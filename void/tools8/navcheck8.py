#!/usr/bin/env python3
# VØID · этап 8 · navcheck8 — независимая проверка навигации: blame и where сверяются с настоящими байтами, а не с сообщениями самих команд.
#   python3 tools8/navcheck8.py [--n 200] [--seed 8] [--json ФАЙЛ]
# 1) blame HTML: для N случайных строк dist/void.html команда называет файл:строку; строка этого файла src/ обязана совпасть со строкой HTML
#    (для аудиоблоков — названный .b64 обязан содержать эту строку).
# 2) blame --script: то же для строк основного скрипта.
# 3) where: для N случайных имён из index/data/symbols.json строка объявления в названном файле обязана содержать имя;
#    каждый слой из chains.json указывает на строку, где имя встречается.
# 4) index/TESTS.md перечисляет каждую подсистему манифеста.
import sys, os, json, random, re, subprocess
TOOLS = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(TOOLS)
sys.path.insert(0, TOOLS); import build8 as B
a = sys.argv[1:]
def opt(n, d=None):
    if n in a: i = a.index(n); v = a[i + 1]; del a[i:i + 2]; return v
    return d
N = int(opt('--n', '200')); SEED = int(opt('--seed', '8')); OUT = opt('--json')
P = B.Proj(ROOT); man = P.manifest(); html = B.assemble(P, man).decode('utf8').split('\n'); script = B.script_of(P, man).split('\n')
rnd = random.Random(SEED); bad = []; n_ok = {'html': 0, 'script': 0, 'where': 0, 'layers': 0}
def run(*args):
    r = subprocess.run([sys.executable, os.path.join(TOOLS, 'build8.py')] + list(args), capture_output=True, text=True, cwd=ROOT)
    return r.returncode, r.stdout
def src_line(rel, ln):
    with open(os.path.join(ROOT, rel), encoding='utf8') as f: L = f.read().split('\n')
    return L[ln - 1] if 0 < ln <= len(L) else None
RX = re.compile(r'→ (src/\S+):(\d+)')
for mode, lines in (('html', html), ('script', script)):
    picks = set(rnd.sample(range(1, len(lines)), min(N, len(lines) - 1)))
    # обязательно: первая и последняя строка каждой части (границы — самое уязвимое место)
    ln = 1
    for x in man['parts']:
        b = B.part_bytes(P, x) if mode == 'html' else (B.raw_bytes(P, x) if x['kind'] == 'js' else b'')
        if not b: continue
        k = b.count(b'\n'); picks.add(ln); picks.add(ln + max(k - 1, 0)); ln += k
    picks = sorted(p for p in picks if 0 < p < len(lines))
    for ln in picks:
        rc, out = run('blame', str(ln), *(['--script'] if mode == 'script' else []))
        m = RX.search(out)
        ml = re.search(r'литерал манифеста, часть №(\d+)', out)
        if not rc and ml and mode == 'html':
            lit = man['parts'][int(ml.group(1))].get('lit', '')
            if lines[ln - 1].startswith(lit.split('\n')[0]): n_ok[mode] += 1
            else: bad.append([mode, ln, 'литерал не совпал'])
            continue
        if rc or not m:
            ma = re.search(r'аудиоблок (\S+) \((src/\S+)\)', out)
            md = re.match(r'^<script type="application/octet-stream" id="([^"]+)">(.*)</script>$', lines[ln - 1]) if ma else None
            if mode == 'html' and md and md.group(1) == ma.group(1) and md.group(2) == open(os.path.join(ROOT, ma.group(2)), encoding='utf8').read():
                n_ok[mode] += 1; continue
            bad.append([mode, ln, 'нет ответа: %s' % out[:120]]); continue
        got = src_line(m.group(1), int(m.group(2)))
        if got != lines[ln - 1]: bad.append([mode, ln, 'строка не совпала: %s:%s' % (m.group(1), m.group(2))])
        else: n_ok[mode] += 1
S = json.load(open(os.path.join(P.idx, 'data', 'symbols.json'), encoding='utf8'))
C = json.load(open(os.path.join(P.idx, 'data', 'chains.json'), encoding='utf8'))
names = sorted(S); picks = rnd.sample(names, min(N, len(names))) + [n for n in ('openIntro', 'c66Tick', 'G', 'buildNebula', 'sanitizeSave') if n in S]
for nm in picks:
    rc, out = run('where', nm)
    m = re.search(r'объявление (src/\S+):(\d+)', out)
    if rc or not m: bad.append(['where', nm, out[:120]]); continue
    got = src_line(m.group(1), int(m.group(2)))
    if got is None or not re.search(r'(?<![\w$])' + re.escape(nm) + r'(?![\w$])', got): bad.append(['where', nm, 'в строке объявления нет имени'])
    else: n_ok['where'] += 1
for nm, c in C.items():
    for L in c['layers']:
        got = src_line('src/' + L['file'], L['line'])
        if got is None or nm not in got: bad.append(['layer', nm, '%s:%s' % (L['file'], L['line'])])
        else: n_ok['layers'] += 1
# 5) ТЗ 17.5: для десяти имён раздела 9.2 `where` выдаёт слои в том же порядке и на тех же строках скрипта, что эталонный chains6.json 1.5.35
REF6 = os.path.join(TOOLS, 'audit', 'ref175', 'chains6.json'); ten = {}
if os.path.exists(REF6):
    RC = json.load(open(REF6, encoding='utf8'))['chains']; rng_ = B.chunk_ranges(P, man); start = {f: lo for lo, hi, f in rng_}
    for nm in ('update', 'renderWorld', 'musicTick', 'sfx', 'kill', 'hurt', 'updateEnemies', 'renderSetScreen', 'toast', 'openIntro'):
        rc, o = run('where', nm)
        got = [start[f] + int(l) - 1 for f, l in re.findall(r'^\s+\d+\. src/(\S+?):(\d+) ', o, re.M)]
        want = [L['line'] for L in RC[nm]['layers']]
        ten[nm] = got == want
        if got != want: bad.append(['17.5', nm, 'слои where %s ≠ chains6 %s' % (got, want)])
else: bad.append(['17.5', REF6, 'нет эталона chains6 1.5.35'])
n_ok['17.5 (10 имён)'] = sum(ten.values())
tm = open(os.path.join(P.idx, 'TESTS.md'), encoding='utf8').read() if os.path.exists(os.path.join(P.idx, 'TESTS.md')) else ''
subs = sorted({x.get('subsystem') or 'A:' + x.get('a', '?') for x in man['parts'] if x['kind'] == 'js'})
miss = [s for s in subs if '| %s |' % s not in tm]
if miss: bad.append(['tests', miss, 'нет в index/TESTS.md'])
res = {'status': 'PASS' if not bad else 'FAIL', 'проверено': n_ok, 'подсистем в TESTS.md': len(subs) - len(miss), 'нарушения': bad[:30]}
try: print(json.dumps(res, ensure_ascii=False, indent=1))
except BrokenPipeError: pass
if OUT: json.dump(res, open(OUT, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
sys.exit(0 if not bad else 1)
