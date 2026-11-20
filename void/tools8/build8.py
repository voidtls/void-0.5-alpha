#!/usr/bin/env python3
# VØID · этап 8 · build8 — сборщик и проверки модульных исходников. Только стандартная библиотека Python 3.8+;
# разбор JS для проверок и индексов — node + tools8/node_modules (acorn, eslint-scope). Игру не меняет: сборка = склейка байтов.
#
#   python3 tools8/build8.py build   [--without cine,bg] [--out ФАЙЛ]   собрать (по умолчанию dist/void.html + dist/PROVENANCE.json)
#   python3 tools8/build8.py check   [--quick] [--json ФАЙЛ]            все проверки; статусы PASS / FAIL / KNOWN / ERROR
#   python3 tools8/build8.py lock    --reason "…"                       зафиксировать намеренную правку (lock.json + CHANGES.jsonl)
#   python3 tools8/build8.py index                                      пересобрать index/ (символы, цепочки, зависимости, состояние, ГСЧ)
#   python3 tools8/build8.py where   ИМЯ                                где объявлено имя и все слои его обёрток
#   python3 tools8/build8.py blame   СТРОКА [--script]                  строка собранного HTML (или скрипта) → файл:строка в src/
#   python3 tools8/build8.py verify-html ФАЙЛ                           сравнить чужой HTML со сборкой, назвать расходящиеся части
#   python3 tools8/build8.py selftest                                   набор порчи на копиях (каждый случай обязан быть пойман)
#   python3 tools8/build8.py split   --from HTML [--plan build/split-plan.json]   фаза A (однократно)
#   python3 tools8/build8.py regroup --subsystems build/subsystems.json | --undo  фаза B1 и её откат
# Общий ключ: --root ПАПКА (корень проекта; по умолчанию — родитель tools8).
# Коды выхода check/selftest: 0 — нет FAIL и ERROR (KNOWN допустим и печатается отдельно), 1 — есть FAIL, 2 — есть ERROR, 3 — ошибка вызова.
import contextlib, io, sys, os, json, hashlib, re, subprocess, tempfile, shutil, base64, time, platform

VERSION = '8.0'
TOOLS = os.path.dirname(os.path.abspath(__file__))
OCT_OPEN = '<script type="application/octet-stream" id="%s">'
OCT_CLOSE = '</script>\n'
B64 = re.compile(rb'^[A-Za-z0-9+/=]*\Z')
KINDS = {'shell', 'css', 'js', 'sep', 'octet'}
H = lambda b: hashlib.sha256(b).hexdigest()

class Usage(Exception): pass
class Bad(Exception): pass

# ---------------------------------------------------------------- проект
class Proj:
    def __init__(s, root):
        s.root = os.path.abspath(root)
        s.src = os.path.join(s.root, 'src'); s.bd = os.path.join(s.root, 'build')
        s.dist = os.path.join(s.root, 'dist'); s.idx = os.path.join(s.root, 'index')
    def p(s, *a): return os.path.join(s.root, *a)
    def jload(s, name):
        with open(os.path.join(s.bd, name), encoding='utf8') as f: return json.load(f)
    def jsave(s, name, obj):
        with open(os.path.join(s.bd, name), 'w', encoding='utf8') as f:
            json.dump(obj, f, ensure_ascii=False, indent=1); f.write('\n')
    def manifest(s): return s.jload('manifest.json')
    def invariants(s): return s.jload('invariants.json')

def part_key(x, i):
    if x['kind'] == 'sep': return 'lit:%d' % i
    return x['path']

def part_bytes(P, x):
    k = x['kind']
    if k == 'sep': return x['lit'].encode('utf8')
    with open(os.path.join(P.src, x['path']), 'rb') as f: data = f.read()
    if k == 'octet': return (OCT_OPEN % x['asset']).encode('utf8') + data + OCT_CLOSE.encode('utf8')
    return data

def raw_bytes(P, x):
    if x['kind'] == 'sep': return x['lit'].encode('utf8')
    with open(os.path.join(P.src, x['path']), 'rb') as f: return f.read()

def select(man, without=()):
    return [x for x in man['parts'] if x.get('group') not in without]

def assemble(P, man, without=()):
    return b''.join(part_bytes(P, x) for x in select(man, without))

def script_of(P, man, without=()):
    return b''.join(raw_bytes(P, x) for x in select(man, without) if x['kind'] == 'js').decode('utf8', 'replace')

def groups_of(man): return sorted({x['group'] for x in man['parts'] if x.get('group')})

# ---------------------------------------------------------------- node
def node(*args, timeout=600):
    if not shutil.which('node'): raise Bad('нет программы node')
    r = subprocess.run(['node', os.path.join(TOOLS, 'js8.js')] + list(args), capture_output=True, timeout=timeout)
    try: j = json.loads(r.stdout.decode('utf8') or '{}')
    except Exception: raise Bad('js8 %s: ответ не JSON: %r' % (args[0], r.stdout[:200] + r.stderr[:200]))
    if r.returncode == 3 or 'error' in j and args[0] != 'parse': raise Bad('js8 %s: %s' % (args[0], j.get('error')))
    return j

def with_tmp_js(text, fn):
    d = tempfile.mkdtemp(prefix='b8js_')
    try:
        f = os.path.join(d, 's.js')
        with open(f, 'w', encoding='utf8') as w: w.write(text)
        return fn(f, d)
    finally: shutil.rmtree(d, ignore_errors=True)

# ---------------------------------------------------------------- сборка
def cmd_build(P, out=None, without=(), provenance=True, quiet=False):
    man = P.manifest(); data = assemble(P, man, without)
    if out is None:
        os.makedirs(P.dist, exist_ok=True); out = os.path.join(P.dist, 'void.html')
    tmp = out + '.tmp'
    with open(tmp, 'wb') as f: f.write(data)
    os.replace(tmp, out)
    if provenance and not without and os.path.abspath(out) == os.path.abspath(os.path.join(P.dist, 'void.html')):
        write_provenance(P, man, data)
    if not quiet: print('%s  %d байт  %s' % (H(data), len(data), os.path.relpath(out)))
    return data

def provenance_of(P, man, data):
    parts = []
    for i, x in enumerate(man['parts']):
        parts.append([part_key(x, i), x['kind'], x.get('group'), H(raw_bytes(P, x))])
    inv = open(os.path.join(P.bd, 'invariants.json'), 'rb').read()
    mf = open(os.path.join(P.bd, 'manifest.json'), 'rb').read()
    lock = P.jload('lock.json') if os.path.exists(os.path.join(P.bd, 'lock.json')) else {}
    me = open(os.path.abspath(__file__), 'rb').read()
    prov = {'schema': 1, 'game': 'VØID', 'version': man.get('version'), 'output': 'dist/void.html',
            'output_sha256': H(data), 'output_bytes': len(data),
            'equals_lock': lock.get('out_sha256') == H(data), 'reference_1_5_35_sha256': man.get('reference_sha256'),
            'equals_reference_1_5_35': man.get('reference_sha256') == H(data),
            'manifest_sha256': H(mf), 'invariants_sha256': H(inv),
            'parts_sha256': H(json.dumps(parts, ensure_ascii=False).encode('utf8')), 'parts_count': len(parts),
            'builder': 'tools8/build8.py ' + VERSION, 'builder_sha256': H(me),
            'python': platform.python_version(), 'order': [p[0] for p in parts]}
    return prov

def write_provenance(P, man, data):
    prov = provenance_of(P, man, data)
    with open(os.path.join(P.dist, 'PROVENANCE.json'), 'w', encoding='utf8') as f:
        json.dump(prov, f, ensure_ascii=False, indent=1); f.write('\n')

# ---------------------------------------------------------------- фаза A: разрез
def cmd_split(P, src, plan_path):
    plan = json.load(open(plan_path, encoding='utf8'))
    raw = open(src, 'rb').read()
    if plan.get('source_sha256') and H(raw) != plan['source_sha256']: raise Bad('источник не тот: SHA %s ≠ плана' % H(raw)[:16])
    s = raw.decode('utf8')
    if os.path.exists(P.src) and os.listdir(P.src): raise Bad('src/ не пуст — разрез делается один раз (откат: удалить src/ и build/*.json фазы A)')
    lines = s.split('\n')  # последний элемент — '' после финального \n
    def hl(a, b): return '\n'.join(lines[a - 1:b]) + '\n'  # строки HTML a..b включительно с переводами
    so = plan['script']['open_line']
    if lines[so - 1] != '<script>': raise Bad('строка %d не «<script>»' % so)
    pre = []  # (имя, вид, группа, текст)
    for e in plan['html']:
        if 'lit' in e: pre.append(('lit', 'sep', None, e['lit'])); continue
        txt = hl(e['from'], e['to'])
        if e.get('expect_first') and not lines[e['from'] - 1].startswith(e['expect_first']): raise Bad('%s: первая строка не «%s»' % (e['name'], e['expect_first']))
        pre.append((e['name'], e['kind'], e.get('group'), txt))
    body_from = plan['script']['body_from']
    pre.append(('shell/body.html', 'shell', None, '\n'.join(lines[body_from - 1:so - 1]) + '\n<script>'))
    k0 = len(''.join(t for *_, t in pre))
    if s[:k0] != ''.join(t for *_, t in pre): raise Bad('оболочка до скрипта не совпадает с источником')
    end = s.index('</script>', k0); S = s[k0:end]; SL = S.split('\n')
    frs = plan['script']['fragments']
    starts = [f['start'] for f in frs]
    if starts[0] != 1 or starts != sorted(starts) or len(set(starts)) != len(starts): raise Bad('начала фрагментов не по порядку')
    for f in frs:
        ln = SL[f['start'] - 1]
        if f.get('anchor') is not None:
            if not ln.startswith(f['anchor']): raise Bad('%s: строка %d не начинается с якоря «%s»' % (f['name'], f['start'], f['anchor']))
            if sum(1 for x in SL if x == ln) != 1: raise Bad('%s: строка-якорь %d встречается не один раз' % (f['name'], f['start']))
        if f.get('expect_empty') and ln != '': raise Bad('%s: строка %d не пустая' % (f['name'], f['start']))
    cuts = with_tmp_js(S, lambda fp, d: (json.dump(starts[1:], open(os.path.join(d, 'l.json'), 'w')), node('cuts', fp, os.path.join(d, 'l.json')))[1])
    if cuts['inside']: raise Bad('разрез внутри оператора: %s' % cuts['inside'])
    jsparts = []
    for i, f in enumerate(frs):
        a = f['start']; b = frs[i + 1]['start'] - 1 if i + 1 < len(frs) else len(SL)
        txt = '\n'.join(SL[a - 1:b]) + ('\n' if b < len(SL) else '')
        for c in f.get('contains', []):
            if txt.count(c) != 1: raise Bad('%s: «%s» встречается %d раз' % (f['name'], c[:40], txt.count(c)))
        if f.get('last_line_starts'):
            ll = txt.rstrip('\n').split('\n')[-1]
            if not ll.startswith(f['last_line_starts']): raise Bad('%s: последняя строка не «%s»' % (f['name'], f['last_line_starts']))
        jsparts.append((f, txt, a, b))
    if ''.join(t for _, t, _, _ in jsparts) != S: raise Bad('JS-фрагменты не дают исходный скрипт')
    tail = s[end:]
    if not tail.startswith('</script>\n'): raise Bad('после скрипта не «</script>\\n»')
    q = len('</script>\n'); assets = []
    rx = re.compile(r'<script type="application/octet-stream" id="([^"<>]+)">([A-Za-z0-9+/=]*)</script>\n')
    while q < len(tail):
        m = rx.match(tail, q)
        if not m: raise Bad('хвост после скрипта не разобран со смещения %d' % (end + q))
        assets.append((m.group(1), m.group(2))); q = m.end()
    if len({a for a, _ in assets}) != len(assets): raise Bad('повтор id аудиоблока')
    # запись
    man = {'schema': 1, 'game': 'VØID', 'version': plan.get('version'), 'reference_sha256': H(raw), 'parts': []}
    def put(rel, text_or_bytes):
        fp = os.path.join(P.src, rel); os.makedirs(os.path.dirname(fp), exist_ok=True)
        with open(fp, 'wb') as w: w.write(text_or_bytes if isinstance(text_or_bytes, bytes) else text_or_bytes.encode('utf8'))
    for name, kind, grp, txt in pre:
        if kind == 'sep': man['parts'].append({'lit': txt, 'kind': 'sep'}); continue
        put(name, txt); e = {'path': name, 'kind': kind}
        if grp: e['group'] = grp
        man['parts'].append(e)
    for f, txt, a, b in jsparts:
        rel = 'js/%s.js' % f['name']; put(rel, txt)
        e = {'path': rel, 'kind': 'js', 'a': f['name'], 'lines': [a, b]}
        for k in ('group', 'role', 'subsystem'):
            if f.get(k): e[k] = f[k]
        man['parts'].append(e)
    man['parts'].append({'lit': '</script>\n', 'kind': 'sep'})
    for aid, data in assets:
        rel = 'assets/audio/%s.b64' % aid; put(rel, data)
        man['parts'].append({'asset': aid, 'path': rel, 'kind': 'octet'})
    os.makedirs(P.bd, exist_ok=True); P.jsave('manifest.json', man)
    out = assemble(P, man)
    if out != raw: raise Bad('сборка после разреза ≠ источнику (SHA %s)' % H(out)[:16])
    # карта фазы A — замороженное доказательство покрытия
    amap = {'schema': 1, 'reference': 'archive/void_1.5.35_reference.html', 'reference_sha256': H(raw), 'reference_bytes': len(raw), 'parts': []}
    off = 0
    for i, x in enumerate(man['parts']):
        b = part_bytes(P, x)
        amap['parts'].append({'key': part_key(x, i), 'kind': x['kind'], 'offset': off, 'bytes': len(b), 'sha256': H(b), **({'a': x['a']} if x.get('a') else {})})
        off += len(b)
    P.jsave('phaseA-map.json', amap)
    write_lock(P, man, None, 'фаза A: разрез 1.5.35')
    print('частей: %d (оболочка %d, CSS %d, JS %d, разделители %d, аудиоблоков %d); SHA %s' % (
        len(man['parts']), *[sum(1 for x in man['parts'] if x['kind'] == k) for k in ('shell', 'css', 'js', 'sep', 'octet')], H(out)))

def write_lock(P, man, reason, note=None):
    data = assemble(P, man)
    old = P.jload('lock.json') if os.path.exists(os.path.join(P.bd, 'lock.json')) else None
    lock = {'schema': 1, 'out_sha256': H(data), 'out_bytes': len(data),
            'manifest_sha256': H(open(os.path.join(P.bd, 'manifest.json'), 'rb').read()),
            'invariants_sha256': H(open(os.path.join(P.bd, 'invariants.json'), 'rb').read()) if os.path.exists(os.path.join(P.bd, 'invariants.json')) else None,
            'parts': {part_key(x, i): H(raw_bytes(P, x)) for i, x in enumerate(man['parts']) if x['kind'] != 'sep'}}
    changed = []
    if old:
        for k in sorted(set(lock['parts']) | set(old['parts'])):
            if lock['parts'].get(k) != old['parts'].get(k): changed.append(k)
    P.jsave('lock.json', lock)
    with open(os.path.join(P.bd, 'CHANGES.jsonl'), 'a', encoding='utf8') as f:
        f.write(json.dumps({'time': time.strftime('%Y-%m-%d %H:%M:%S'), 'reason': reason or note, 'old_sha256': old and old['out_sha256'],
                            'new_sha256': lock['out_sha256'], 'changed_parts': changed[:200], 'changed_count': len(changed),
                            'manifest_changed': bool(old and old.get('manifest_sha256') != lock['manifest_sha256'])}, ensure_ascii=False) + '\n')
    return lock, changed

# ---------------------------------------------------------------- проверки
class Res:
    def __init__(s): s.rows = []
    def add(s, name, st, det): s.rows.append((name, st, det))
    def code(s):
        sts = {r[1] for r in s.rows}
        return 2 if 'ERROR' in sts else 1 if 'FAIL' in sts else 0

def run_check(name, fn, R):
    try:
        st, det = fn()
    except Bad as e: st, det = 'ERROR', str(e)
    except Exception as e: st, det = 'ERROR', 'сбой проверки: %r' % e
    R.add(name, st, det)

def checks(P, quick=False, skip=()):
    R = Res(); ctx = {}
    # 1. схема манифеста
    def c_schema():
        try: man = P.manifest()
        except Exception as e: return 'FAIL', 'манифест не читается: %s' % e
        errs = []
        if man.get('schema') != 1 or not isinstance(man.get('parts'), list): errs.append('нет schema=1 или parts')
        for i, x in enumerate(man.get('parts', [])):
            k = x.get('kind')
            if k not in KINDS: errs.append('#%d: неизвестный kind %r' % (i, k)); continue
            if k == 'sep':
                v = x.get('lit')
                if not isinstance(v, str) or len(v.encode()) > 16 or v.replace('</script>', '').strip(' \n\t') != '' or 'path' in x:
                    errs.append('#%d: lit — только пробелы/переводы строк и «</script>», ≤16 байт' % i)
            else:
                pth = x.get('path')
                if not isinstance(pth, str) or pth.startswith('/') or '..' in pth.split('/'): errs.append('#%d: недопустимый path %r' % (i, pth))
                if k == 'octet' and not re.match(r'^[A-Za-z0-9_-]+$', str(x.get('asset', ''))): errs.append('#%d: недопустимый asset id' % i)
            if x.get('group') is not None and x['group'] not in ('cine', 'bg'): errs.append('#%d: неизвестная группа %r' % (i, x['group']))
        ctx['man'] = man
        return ('FAIL', errs[:10]) if errs else ('PASS', '%d частей' % len(man['parts']))
    run_check('schema', c_schema, R)
    if 'man' not in ctx: return R
    man = ctx['man']
    # 2. файлы: каждый ровно один раз, нет лишних
    def c_files():
        used = [x['path'] for x in man['parts'] if x['kind'] != 'sep']; errs = []
        dup = sorted({p for p in used if used.count(p) > 1})
        if dup: errs.append('включены дважды: %s' % dup[:5])
        miss = [p for p in used if not os.path.isfile(os.path.join(P.src, p))]
        if miss: errs.append('нет файлов: %s' % miss[:5])
        disk = set()
        for r, _, fs in os.walk(P.src):
            for f in fs: disk.add(os.path.relpath(os.path.join(r, f), P.src).replace(os.sep, '/'))
        extra = sorted(disk - set(used))
        if extra: errs.append('файлы вне манифеста: %s' % extra[:5])
        if not dup and not miss: ctx['files_ok'] = True  # лишние файлы не мешают собрать и проверить остальное
        return ('FAIL', errs) if errs else ('PASS', '%d файлов, лишних нет' % len(disk))
    run_check('files', c_files, R)
    if not ctx.get('files_ok'):
        R.add('остальные', 'ERROR', 'не выполнены: набор файлов не согласован с манифестом'); return R
    # 3. кодировка
    def c_enc():
        errs = []
        for x in man['parts']:
            if x['kind'] in ('sep', 'octet'): continue
            b = raw_bytes(P, x)
            if b.startswith(b'\xef\xbb\xbf'): errs.append('BOM: ' + x['path'])
            try: b.decode('utf8')
            except UnicodeDecodeError: errs.append('не UTF-8: ' + x['path'])
            if b'\r' in b: errs.append('CR (\\r): ' + x['path'])
        return ('FAIL', errs[:10]) if errs else ('PASS', 'UTF-8 без BOM и \\r')
    run_check('encoding', c_enc, R)
    # 4. аудиоблоки
    def c_assets():
        inv = P.invariants(); errs = []; oc = [x for x in man['parts'] if x['kind'] == 'octet']
        ids = [x['asset'] for x in oc]
        if len(set(ids)) != len(ids): errs.append('повтор id')
        if len(oc) != inv.get('assets'): errs.append('аудиоблоков %d, ожидалось %s' % (len(oc), inv.get('assets')))
        for x in oc:
            b = raw_bytes(P, x)
            if not B64.match(b): errs.append('не base64-алфавит: ' + x['path']); continue
            try: base64.b64decode(b, validate=True)
            except Exception: errs.append('base64 не декодируется: ' + x['path'])
            if os.path.basename(x['path']) != x['asset'] + '.b64': errs.append('имя файла ≠ id: ' + x['path'])
        lock = P.jload('lock.json')
        ch = [x['path'] for x in oc if lock['parts'].get(x['path']) != H(raw_bytes(P, x))]
        if ch: errs.append('изменены после lock: %s' % ch[:5])
        return ('FAIL', errs[:10]) if errs else ('PASS', '%d блоков: base64 декодируется, SHA = lock' % len(oc))
    run_check('assets', c_assets, R)
    # 5. сборка и детерминированность
    def c_build():
        a = assemble(P, man); b = assemble(P, man); ctx['full'] = a
        if a != b: return 'FAIL', 'две сборки подряд различаются'
        return 'PASS', 'SHA %s, %d байт, две сборки равны' % (H(a)[:16], len(a))
    run_check('build', c_build, R)
    full = ctx.get('full')
    # 6. lock
    def c_lock():
        lock = P.jload('lock.json'); errs = []
        cur = {part_key(x, i): H(raw_bytes(P, x)) for i, x in enumerate(man['parts']) if x['kind'] != 'sep'}
        ch = sorted(k for k in set(cur) | set(lock['parts']) if cur.get(k) != lock['parts'].get(k))
        if ch: errs.append('части изменены после lock (%d): %s' % (len(ch), ch[:6]))
        if H(open(os.path.join(P.bd, 'manifest.json'), 'rb').read()) != lock.get('manifest_sha256'): errs.append('manifest.json изменён после lock')
        if H(open(os.path.join(P.bd, 'invariants.json'), 'rb').read()) != lock.get('invariants_sha256'): errs.append('invariants.json изменён после lock')
        if full is not None and H(full) != lock['out_sha256']: errs.append('SHA сборки %s ≠ lock %s' % (H(full)[:16], lock['out_sha256'][:16]))
        return ('FAIL', errs) if errs else ('PASS', 'части, манифест, инварианты и SHA = lock')
    run_check('lock', c_lock, R)
    # 7. dist
    def c_dist():
        f = os.path.join(P.dist, 'void.html')
        if not os.path.exists(f): return 'FAIL', 'нет dist/void.html (выполните build)'
        d = open(f, 'rb').read()
        if d != full: return 'FAIL', 'dist/void.html ≠ свежей сборке (правился вручную или устарел; см. verify-html)'
        pv = os.path.join(P.dist, 'PROVENANCE.json')
        if not os.path.exists(pv): return 'FAIL', 'нет dist/PROVENANCE.json'
        # сверяется вся запись происхождения (сборщик, манифест, инварианты, части, порядок), кроме версии Python — она зависит от машины
        have = json.load(open(pv, encoding='utf8')); want = provenance_of(P, P.manifest(), d)
        stale = sorted(k for k in set(have) | set(want) if k != 'python' and have.get(k) != want.get(k))
        if stale: return 'FAIL', 'PROVENANCE.json устарел (поля %s) — выполните build' % stale
        return 'PASS', 'dist = сборка, PROVENANCE актуален'
    run_check('dist', c_dist, R)
    # 8. доказательство фазы A (только если SHA сборки = эталону 1.5.35)
    def c_proof():
        am = P.jload('phaseA-map.json'); lock = P.jload('lock.json')
        if H(full) != am['reference_sha256'] and lock.get('out_sha256') == am['reference_sha256']:
            # зафиксированное состояние — 1.5.35, а сборка отличается: найти первую расходящуюся позицию и часть
            ref = P.p(am['reference']); rb = open(ref, 'rb').read() if os.path.exists(ref) else b''
            i = next((k for k in range(min(len(rb), len(full))) if rb[k] != full[k]), min(len(rb), len(full)))
            o = 0; who = '?'
            for j, x in enumerate(man['parts']):
                n = len(part_bytes(P, x))
                if o <= i < o + n or (i == o + n and j == len(man['parts']) - 1): who = part_key(x, j); break
                o += n
            refp = next((a['key'] for a in am['parts'] if a['offset'] <= i < a['offset'] + a['bytes']), '?')
            return 'FAIL', 'сборка ≠ эталону 1.5.35 (lock = 1.5.35): первое отличие на байте %d — в сборке часть %s, в эталоне часть %s; длина %d / %d' % (i, who, refp, len(full), len(rb))
        ref = P.p(am['reference'])
        if not os.path.exists(ref): return 'ERROR', 'нет эталона ' + am['reference']
        rb = open(ref, 'rb').read()
        if H(rb) != am['reference_sha256']: return 'FAIL', 'эталон в archive/ изменён'
        errs = []; off = 0; A = am['parts']
        for a in A:
            if a['offset'] != off: errs.append('карта: %s начинается с %d, ожидалось %d' % (a['key'], a['offset'], off))
            if H(rb[a['offset']:a['offset'] + a['bytes']]) != a['sha256']: errs.append('карта: байты эталона ≠ %s' % a['key'])
            off = a['offset'] + a['bytes']
        if off != len(rb): errs.append('карта не покрывает эталон: %d из %d' % (off, len(rb)))
        if H(full) != am['reference_sha256']:
            # игра намеренно изменена и зафиксирована (lock ≠ 1.5.35): проверяется только сама карта фазы A по эталону; побайтное сравнение сборки с 1.5.35 не делается
            if errs: return 'FAIL', errs
            return 'PASS', 'проверена только карта фазы A: %d частей сплошь покрывают эталон 1.5.35, хэши верны. Сборка с эталоном НЕ сравнивалась: по lock она намеренно другая (%s)' % (len(A), lock.get('out_sha256', '?')[:16])
        # текущие части укладываются в части фазы A и вместе дают их побайтно
        cur = []; o = 0
        for i, x in enumerate(man['parts']):
            b = part_bytes(P, x); cur.append((o, o + len(b), x, i)); o += len(b)
        ai = 0; acc = b''
        for (s0, s1, x, i) in cur:
            while ai < len(A) and s0 >= A[ai]['offset'] + A[ai]['bytes']: ai += 1
            if ai >= len(A): errs.append('часть за пределами карты: %s' % part_key(x, i)); break
            a = A[ai]
            if not (a['offset'] <= s0 and s1 <= a['offset'] + a['bytes']): errs.append('часть %s пересекает границу части фазы A %s' % (part_key(x, i), a['key'])); continue
            if x.get('a') is not None and a.get('a') is not None and x['a'] != a['a']: errs.append('часть %s помечена a=%s, лежит в %s' % (part_key(x, i), x['a'], a['a']))
        if rb != full: errs.append('сборка ≠ эталону')
        return ('FAIL', errs[:8]) if errs else ('PASS', 'покрытие: %d частей фазы A смежны от 0 до %d; %d текущих частей укладываются в них; сборка = эталон 1.5.35' % (len(A), len(rb), len(cur)))
    run_check('coverage', c_proof, R)
    # 9. инварианты порядка и групп
    def c_order():
        inv = P.invariants(); errs = []; P_ = man['parts']
        js = [x for x in P_ if x['kind'] == 'js']
        if not js or js[-1].get('role') != 'boot': errs.append('последний JS-фрагмент не role=boot')
        if sum(1 for x in js if x.get('role') == 'boot') != 1: errs.append('role=boot должна быть ровно у одного фрагмента')
        sky = [i for i, x in enumerate(P_) if x.get('role') == 'sky-rng-guard']
        if len(sky) != 1: errs.append('страж неба (role=sky-rng-guard): найдено %d' % len(sky))
        else:
            sx = P_[sky[0]]
            if sx.get('group'): errs.append('страж неба внутри группы %s' % sx['group'])
            jcine = [i for i, x in enumerate(P_) if x['kind'] == 'js' and x.get('group') == 'cine']
            jbg = [i for i, x in enumerate(P_) if x['kind'] == 'js' and x.get('group') == 'bg']
            if jcine and jbg and not (max(jcine) < sky[0] < min(jbg)): errs.append('страж неба не между CINE и BG')
        for g, mk in inv['groups'].items():
            for kind, a, z in (('js', 'js_start', 'js_end'), ('css', 'css_start', 'css_end')):
                ix = [i for i, x in enumerate(P_) if x['kind'] == kind and x.get('group') == g]
                if not ix: errs.append('группа %s: нет %s-частей' % (g, kind)); continue
                if ix != list(range(ix[0], ix[-1] + 1)): errs.append('группа %s (%s) не непрерывна' % (g, kind))
                first = raw_bytes(P, P_[ix[0]]).decode('utf8', 'replace'); last = raw_bytes(P, P_[ix[-1]]).decode('utf8', 'replace')
                if not first.split('\n', 1)[0].startswith(mk[a]): errs.append('группа %s (%s): первая строка не маркер начала' % (g, kind))
                if not last.rstrip('\n').split('\n')[-1].startswith(mk[z]): errs.append('группа %s (%s): последняя строка не маркер конца' % (g, kind))
                body = ''.join(raw_bytes(P, P_[i]).decode('utf8', 'replace') for i in ix)
                if body.count(mk[a]) != 1 or body.count(mk[z]) != 1: errs.append('группа %s (%s): маркеры не по одному разу' % (g, kind))
        return ('FAIL', errs) if errs else ('PASS', 'boot последний; страж неба обязателен, между CINE и BG; группы непрерывны, маркеры на краях')
    run_check('order', c_order, R)
    # 10. стражи, ключи сохранений, Math.random, запреты
    def c_guards():
        inv = P.invariants(); errs = []
        ng = script_of(P, man, tuple(inv['groups'])); fs = script_of(P, man); ctx['script'] = fs; ctx['script_ng'] = ng
        for g in inv['guards']:
            n = ng.count(g['text'])
            if n != g['count']: errs.append('страж «%s»: %d раз в сборке без групп (нужно %d)' % (g['text'][:50], n, g['count']))
        keys = sorted(set(re.findall(r"""['"](void_[a-z0-9_]+)['"]""", fs)))
        if keys != sorted(inv['storage_keys']): errs.append('ключи сохранений: %s' % sorted(set(keys) ^ set(inv['storage_keys'])))
        mr = fs.count('Math.random')
        if mr != inv['math_random']: errs.append('Math.random: %d (эталон %d) — изменение ГСЧ требует разбора и обновления invariants с причиной' % (mr, inv['math_random']))
        for t in inv['forbidden_in_js']:
            if t in fs: errs.append('запрещённое в скрипте: %r' % t)
        return ('FAIL', errs) if errs else ('PASS', 'стражи ×1 без групп; ключей void_* %d; Math.random %d; запрещённого нет' % (len(keys), mr))
    run_check('guards', c_guards, R)
    fs = ctx.get('script'); inv = P.invariants()
    variants = [()] + [(g,) for g in inv['groups']] + [tuple(inv['groups'])]
    # 11. синтаксис + аудит инициализации
    def c_syntax():
        if fs is None: return 'ERROR', 'нет текста скрипта'
        errs = []; det = []
        for v in variants:
            t = script_of(P, man, v)
            r = with_tmp_js(t, lambda f, d: node('parse', f))
            if not r.get('ok'): errs.append('синтаксис (%s): %s' % ('+'.join(v) or 'полная', r.get('error')))
        return ('FAIL', errs) if errs else ('PASS', 'разбор acorn: полная и %d вариантов' % (len(variants) - 1))
    run_check('syntax', c_syntax, R)
    def c_init():
        errs = []; info = []
        for v in variants:
            t = script_of(P, man, v); r = with_tmp_js(t, lambda f, d: node('init', f))
            if r['lexicalBelow']: errs.append('%s: чтение let/const/class до объявления: %s' % ('+'.join(v) or 'полная', r['lexicalBelow'][:4]))
            info.append('%s: 0' % ('+'.join(v) or 'полная'))
        return ('FAIL', errs) if errs else ('PASS', 'чтений лексических имён до объявления при загрузке: ' + ', '.join(info))
    run_check('init', c_init, R)
    # 12. висячие ссылки вариантов
    def c_dangle():
        base = inv['dangle_baseline']; errs = []; known = []; det = []
        for g in inv['groups']:
            t = script_of(P, man, (g,))
            r = with_tmp_js(fs, lambda f, d: (open(os.path.join(d, 'v.js'), 'w', encoding='utf8').write(t), node('dangle', f, os.path.join(d, 'v.js')))[1])
            got = sorted(r['unguarded']); want = sorted(base.get(g, {}))
            det.append('%s: удалено имён %d, незащищённых %s' % (g, r['removed'], got or 'нет'))
            if got != want: errs.append('%s: незащищённые ссылки %s ≠ эталону %s' % (g, got, want))
            elif got: known.append('%s → %s (%s)' % (g, got, inv['known_ids'].get(g, '?')))
        if errs: return 'FAIL', errs + det
        if known: return 'KNOWN', det + ['зарегистрировано: ' + '; '.join(known)]
        return 'PASS', det
    run_check('dangle', c_dangle, R)
    # 13. индексы актуальны
    if not quick and 'index' not in skip:
        def c_index():
            if not os.path.isdir(P.idx): return 'FAIL', 'нет index/ (выполните index)'
            tmp = tempfile.mkdtemp(prefix='b8idx_')
            try:
                make_index(P, tmp)
                diff = []
                for r, _, fs_ in os.walk(tmp):
                    for f in fs_:
                        rel = os.path.relpath(os.path.join(r, f), tmp); cur = os.path.join(P.idx, rel)
                        if not os.path.exists(cur) or open(cur, 'rb').read() != open(os.path.join(r, f), 'rb').read(): diff.append(rel)
                for r, _, fs_ in os.walk(P.idx):
                    for f in fs_:
                        rel = os.path.relpath(os.path.join(r, f), P.idx)
                        if not os.path.exists(os.path.join(tmp, rel)): diff.append(rel + ' (лишний)')
                return ('FAIL', 'устарели: %s (выполните index)' % diff[:8]) if diff else ('PASS', 'index/ совпадает с перестроенным')
            finally: shutil.rmtree(tmp, ignore_errors=True)
        run_check('index', c_index, R)
    return R

def print_res(R, title='build8 check'):
    print(title)
    for n, st, det in R.rows:
        d = det if isinstance(det, str) else '; '.join(map(str, det))
        print('  %-6s %-9s %s' % (st, n, d[:400]))
    c = {s: sum(1 for r in R.rows if r[1] == s) for s in ('PASS', 'KNOWN', 'FAIL', 'ERROR')}
    print('ИТОГ: PASS %(PASS)d · KNOWN %(KNOWN)d · FAIL %(FAIL)d · ERROR %(ERROR)d' % c + ('' if not c['KNOWN'] else '  (KNOWN — зарегистрированное отклонение, не PASS)'))

def cmd_check(P, quick=False, jout=None):
    R = checks(P, quick); print_res(R)
    if jout:
        with open(jout, 'w', encoding='utf8') as f: json.dump([{'check': n, 'status': s, 'detail': d} for n, s, d in R.rows], f, ensure_ascii=False, indent=1)
    return R.code()

def cmd_lock(P, reason):
    if not reason or len(reason.strip()) < 5: raise Usage('lock: нужна причина --reason "…" (не короче 5 символов)')
    R = checks(P, quick=False, skip=('index',))
    bad = [(n, s) for n, s, _ in R.rows if s in ('FAIL', 'ERROR') and n not in ('lock', 'dist', 'coverage')]
    if bad:
        print_res(R); print('lock ОТКАЗАН: сначала исправьте %s' % bad); return 1
    man = P.manifest(); cmd_build(P, quiet=True)
    lock, changed = write_lock(P, man, reason)
    cmd_build(P, quiet=True)  # PROVENANCE с новым lock
    print('lock: SHA %s; изменено частей %d: %s' % (lock['out_sha256'], len(changed), changed[:10]))
    print('Напоминание: правка игры требует профильных тестов (index/TESTS.md) и полной приёмки перед выпуском; выполните index.')
    return 0

# ---------------------------------------------------------------- индексы
def chunk_ranges(P, man):
    R = []; ln = 1
    for x in man['parts']:
        if x['kind'] != 'js': continue
        n = raw_bytes(P, x).decode('utf8').count('\n')
        R.append([ln, ln + max(n, 1) - 1 if n else ln, x['path']]); ln += n
    return R

def md_escape(s): return str(s).replace('|', '\\|')

def make_index(P, out):
    man = P.manifest(); S = script_of(P, man); ranges = chunk_ranges(P, man)
    sub = {x['path']: x.get('subsystem') or 'A:' + x.get('a', '?') for x in man['parts'] if x['kind'] == 'js'}
    loc = lambda line: local(ranges, line)
    os.makedirs(os.path.join(out, 'data'), exist_ok=True)
    d = tempfile.mkdtemp(prefix='b8ix_')
    try:
        sf = os.path.join(d, 's.js'); open(sf, 'w', encoding='utf8').write(S)
        rf = os.path.join(d, 'r.json'); json.dump(ranges, open(rf, 'w'))
        J = node('index', sf, rf, timeout=900)
        html = os.path.join(d, 'void.html'); open(html, 'wb').write(assemble(P, man))
        ch = os.path.join(d, 'chains.json'); g6 = os.path.join(d, 'g6.json')
        for tool, o in (('chains6.js', ch), ('g6.js', g6)):
            r = subprocess.run(['node', os.path.join(TOOLS, 'audit', tool), html, o], capture_output=True, timeout=1800)
            if r.returncode: raise Bad('%s: код %d %s' % (tool, r.returncode, r.stderr[-300:]))
        C = json.load(open(ch, encoding='utf8')); G = json.load(open(g6, encoding='utf8'))
    finally: shutil.rmtree(d, ignore_errors=True)
    # --- символы
    syms = {}
    for name, kind, line, cid in J['decl']:
        f, l = loc(line); syms[name] = {'kind': kind, 'file': f, 'line': l, 'subsystem': sub.get(f)}
        U = J.get('uses', {}).get(name, {})  # места использования по файлам: [загрузка, из функций, запись, первая строка скрипта]
        syms[name]['used_by'] = sorted([[cf, u[0], u[1], u[2], loc(u[3])[1]] for cf, u in U.items() if cf], key=lambda r: -(r[1] + r[2] + r[3]))
    chains = {}
    for name, c in sorted(C['chains'].items()):
        lay = []
        for L in c['layers']:
            f, l = loc(L['line'])
            lay.append({'file': f, 'line': l, 'subsystem': sub.get(f), 'form': L.get('form'), 'factory': L.get('factory'), 'where': L.get('where'),
                        'cls': L.get('cls'), 'feat': L.get('feat'), 'ver': L.get('ver'), 'why': (L.get('why') or '')[:160]})
        sig = H(json.dumps([[x['form'], x['factory'], x['where'], x['cls']] for x in lay], ensure_ascii=False).encode())[:16]
        chains[name] = {'decl': syms.get(name), 'depth': c.get('depth'), 'layers': lay, 'signature': sig}
    json.dump(syms, open(os.path.join(out, 'data', 'symbols.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=0, sort_keys=True)
    json.dump(chains, open(os.path.join(out, 'data', 'chains.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=0, sort_keys=True)
    W = lambda name, text: open(os.path.join(out, name), 'w', encoding='utf8').write(text)
    hdr = '<!-- Сгенерировано: python3 tools8/build8.py index. Не править вручную: check сверяет с перестроенным. -->\n\n'
    # SYMBOLS.md
    t = [hdr, '# Символы верхнего уровня\n\n%d имён. Строки — в файлах src/ (а не в собранном HTML).\n\n| Имя | Вид | Файл:строка | Подсистема | Слоёв обёрток |\n|---|---|---|---|---|\n' % len(syms)]
    for n in sorted(syms, key=str.lower):
        s = syms[n]; t.append('| `%s` | %s | `%s:%d` | %s | %s |\n' % (md_escape(n), s['kind'], s['file'], s['line'], s['subsystem'], len(chains[n]['layers']) if n in chains else ''))
    W('SYMBOLS.md', ''.join(t))
    # SUBSYSTEMS.md
    per = {}
    for x in man['parts']:
        if x['kind'] == 'js': per.setdefault(x.get('subsystem') or 'A:' + x.get('a', '?'), []).append(x)
    t = [hdr, '# Подсистемы\n\nПорядок файлов в сборке задаёт только build/manifest.json; номер NNNN в имени файла показывает позицию.\n\n']
    t.append('| Подсистема | Файлов | Строк | Объявлений | Слоёв обёрток |\n|---|---|---|---|---|\n')
    nd = {}; nl = {}
    for s in syms.values(): nd[s['subsystem']] = nd.get(s['subsystem'], 0) + 1
    for c in chains.values():
        for L in c['layers']: nl[L['subsystem']] = nl.get(L['subsystem'], 0) + 1
    for k in sorted(per):
        lines = sum(raw_bytes(P, x).count(b'\n') for x in per[k])
        t.append('| %s | %d | %d | %d | %d |\n' % (k, len(per[k]), lines, nd.get(k, 0), nl.get(k, 0)))
    for k in sorted(per):
        t.append('\n## %s\n\n| Файл | Строк | Исходный раздел | Также |\n|---|---|---|---|\n' % k)
        for x in per[k]:
            t.append('| `%s` | %d | %s | %s |\n' % (x['path'], raw_bytes(P, x).count(b'\n'), md_escape((x.get('origin') or '')[:110]), ', '.join(x.get('also', []))))
    W('SUBSYSTEMS.md', ''.join(t))
    # CHAINS.md
    t = [hdr, '# Цепочки обёрток\n\n%d имён, %d слоёв. Слои — в порядке установки (последний вызывается первым). Сигнатура — хэш последовательности (форма, фабрика, место, класс) без номеров строк.\n\n' % (len(chains), sum(len(c['layers']) for c in chains.values()))]
    for n, c in chains.items():
        d0 = c['decl']
        t.append('## `%s` — глубина %s, сигнатура `%s`\n\nОбъявление: %s\n\n| # | Файл:строка | Подсистема | Форма | Где ставится | Класс | Назначение |\n|---|---|---|---|---|---|---|\n' % (
            n, c['depth'], c['signature'], ('`%s:%d` (%s)' % (d0['file'], d0['line'], d0['subsystem'])) if d0 else 'нет объявления верхнего уровня'))
        for i, L in enumerate(c['layers'], 1):
            t.append('| %d | `%s:%d` | %s | %s%s | %s | %s | %s |\n' % (i, L['file'], L['line'], L['subsystem'], L['form'] or '', (' ' + L['factory']) if L.get('factory') else '', L['where'] or '', L['cls'] or '', md_escape(L['why'])))
        t.append('\n')
    W('CHAINS.md', ''.join(t))
    # DEPS.md — по подсистемам
    agg = {}
    for a, b, l, r, w in J['deps']:
        sa, sb = sub.get(a, '?'), sub.get(b, '?')
        if sa == sb: continue
        k = (sa, sb); v = agg.setdefault(k, [0, 0, 0]); v[0] += l; v[1] += r; v[2] += w
    t = [hdr, '# Зависимости между подсистемами\n\nСсылки на имена верхнего уровня, объявленные в другой подсистеме. load — исполняется при загрузке (порядок важен), run — из тел функций (во время игры), write — запись в чужую привязку (обёртки, переназначения).\n\n| Откуда | Куда | load | run | write |\n|---|---|---|---|---|\n']
    for (sa, sb), v in sorted(agg.items(), key=lambda kv: (-kv[1][0], -kv[1][1], kv[0])):
        t.append('| %s | %s | %d | %d | %d |\n' % (sa, sb, *v))
    W('DEPS.md', ''.join(t))
    # STATE.md — поля G: кто пишет (по подсистемам)
    t = [hdr, '# Состояние G: где пишется\n\nПо g6 (прямые записи, вложенные мутации, групповые записи) с привязкой мест к файлам и подсистемам. Владельцы — tools8/audit/ownership6.json (screen, save, runlvl, наведение).\n\n| Поле | Чтений | Пишут (подсистема: мест) |\n|---|---|---|\n']
    for f, x in sorted(G['fields'].items()):
        cnt = {}
        for kind in ('writes', 'nested', 'bulk'):
            for u in x.get(kind, []):
                m = re.search(r'@(\d+)', u)
                if not m: continue
                fl, _ = loc(int(m.group(1))); s = sub.get(fl, '?'); cnt[s] = cnt.get(s, 0) + 1
        t.append('| `G.%s` | %s | %s |\n' % (md_escape(f), x.get('nReads', ''), ', '.join('%s: %d' % kv for kv in sorted(cnt.items(), key=lambda kv: -kv[1])) or '—'))
    W('STATE.md', ''.join(t))
    # RNG.md
    ntext = S.count('Math.random')
    t = [hdr, '# Math.random — места вызова\n\nИгровой ГСЧ — Math.random (стенды его засевают и считают). Защиты iso63 / iso65 подменяют его на время звука и визуала.\n\n%d мест в коде (по синтаксическому дереву). Инвариант build/invariants.json (math_random) считает вхождения в тексте скрипта, включая комментарии: %d (разница %d — упоминания в комментариях и строках).\n\n| Файл:строка | Подсистема | Объемлющая функция |\n|---|---|---|\n' % (len(J['rng']), ntext, ntext - len(J['rng']))]
    for line, fn, cid in J['rng']:
        f, l = loc(line); t.append('| `%s:%d` | %s | %s |\n' % (f, l, sub.get(f), md_escape(fn)))
    W('RNG.md', ''.join(t))
    # TESTS.md — карта проверок (из build/tests-map.json)
    tm = os.path.join(P.bd, 'tests-map.json')
    if os.path.exists(tm):
        M = json.load(open(tm, encoding='utf8'))
        t = [hdr, '# Какие проверки запускать для подсистемы\n\n%s\n\n| Подсистема | Проверки |\n|---|---|\n' % M.get('note', '')]
        for k in sorted(per):
            t.append('| %s | %s |\n' % (k, '; '.join(M['map'].get(k, M.get('default', [])))))
        t.append('\n## Всегда\n\n' + ''.join('- %s\n' % x for x in M.get('always', [])))
        W('TESTS.md', ''.join(t))

def local(ranges, line):
    lo, hi = 0, len(ranges) - 1
    while lo <= hi:
        m = (lo + hi) // 2; a, b, f = ranges[m]
        if line < a: hi = m - 1
        elif line > b: lo = m + 1
        else: return f, line - a + 1
    return '?', line

def cmd_index(P):
    tmp = P.idx + '.new'; shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
    make_index(P, tmp); shutil.rmtree(P.idx, ignore_errors=True); os.replace(tmp, P.idx)
    print('index/: ' + ', '.join(sorted(os.listdir(P.idx))))

def cmd_where(P, name):
    f = os.path.join(P.idx, 'data', 'symbols.json')
    if not os.path.exists(f): raise Usage('нет index/ — выполните index')
    S = json.load(open(f, encoding='utf8')); C = json.load(open(os.path.join(P.idx, 'data', 'chains.json'), encoding='utf8'))
    hit = False
    if name in S:
        s = S[name]; hit = True; print('%s: %s, объявление src/%s:%d [%s]' % (name, s['kind'], s['file'], s['line'], s['subsystem']))
        ub = s.get('used_by', [])
        if ub:
            print('используется в %d файлах (загрузка / из функций / запись · первое место):' % len(ub))
            for cf, l0, r0, w0, fl in ub[:25]: print('  src/%s:%d  %d / %d / %d' % (cf, fl, l0, r0, w0))
            if len(ub) > 25: print('  … ещё %d (index/data/symbols.json)' % (len(ub) - 25))
    if name in C:
        hit = True; c = C[name]; print('слоёв обёрток: %d (в порядке установки; сигнатура %s):' % (len(c['layers']), c['signature']))
        for i, L in enumerate(c['layers'], 1):
            print('  %d. src/%s:%d [%s] %s%s · %s · класс %s · %s' % (i, L['file'], L['line'], L['subsystem'], L['form'] or '', (' ' + L['factory']) if L.get('factory') else '', L['where'], L['cls'], L['why'][:80]))
    if not hit:
        near = sorted(n for n in S if name.lower() in n.lower())[:15]
        print('не найдено: %s%s' % (name, ('; похожие: ' + ', '.join(near)) if near else '')); return 1
    return 0

def cmd_blame(P, line, script=False):
    man = P.manifest(); ln = 1; sl = 1
    for i, x in enumerate(man['parts']):
        b = part_bytes(P, x) if not script else (raw_bytes(P, x) if x['kind'] == 'js' else b'')
        n = b.count(b'\n'); start = ln if not script else sl
        # строка принадлежит части, в которой она начинается: если часть кончается переводом строки, строка start+n начинается уже в следующей
        if b and (start <= line < start + n or (line == start + n and not b.endswith(b'\n'))):
            loc_ = line - start + 1; key = part_key(x, i)
            off = 0
            if x['kind'] == 'octet' and not script: print('%s → аудиоблок %s (src/%s)' % (line, x['asset'], x['path'])); return 0
            if x['kind'] == 'sep': print('HTML %d → литерал манифеста, часть №%d: %r (build/manifest.json, файла нет)' % (line, i, x['lit'])); return 0
            text = b.decode('utf8', 'replace').split('\n')
            print('%s %d → src/%s:%d  [%s%s]' % ('скрипт' if script else 'HTML', line, key, loc_, x['kind'], (', ' + x['subsystem']) if x.get('subsystem') else ''))
            if loc_ - 1 < len(text): print('  │ ' + text[loc_ - 1][:200])
            return 0
        if script: sl += n
        else: ln += n
    print('строка %d вне сборки' % line); return 1

def cmd_verify_html(P, f):
    """Сверка чужого HTML со сборкой. Проход с начала находит первую отличающуюся часть, проход с конца — последнюю;
    между ними — ровно те части, которые надо перенести в src/ (вставка/удаление байтов не «размазывает» отличие по хвосту)."""
    man = P.manifest(); got = open(f, 'rb').read(); parts = [(part_key(x, i), part_bytes(P, x)) for i, x in enumerate(man['parts'])]
    total = sum(len(b) for _, b in parts)
    if got == b''.join(b for _, b in parts): print('совпадает со сборкой побайтно (SHA %s)' % H(got)); return 0
    off = 0; i0 = len(parts)
    for i, (k, b) in enumerate(parts):
        if got[off:off + len(b)] != b: i0 = i; break
        off += len(b)
    end = len(got); i1 = -1
    for i in range(len(parts) - 1, -1, -1):
        b = parts[i][1]
        if i < i0 or end - len(b) < off or got[end - len(b):end] != b: i1 = i; break
        end -= len(b)
    i1 = max(i1, i0) if i0 < len(parts) else i1
    rng = [parts[i][0] for i in range(i0, min(i1, len(parts) - 1) + 1)] if i0 < len(parts) else []
    n = len(rng); word = 'отличается %d часть' % n if n % 10 == 1 and n % 100 != 11 else ('отличаются %d части' % n if 2 <= n % 10 <= 4 and not 12 <= n % 100 <= 14 else 'отличаются %d частей' % n)
    print('РАСХОДИТСЯ со сборкой: %s (байты файла %d–%d; длина файла %d, сборки %d):' % (word, off, end, len(got), total))
    for k in rng[:20]: print('  ' + k)
    if len(rng) > 20: print('  … ещё %d' % (len(rng) - 20))
    if not rng: print('  (части совпадают, отличается только длина: лишние байты в конце файла)')
    print('Правку переносят в src/ (файлы выше), затем build и check. Итоговый HTML вручную не правят.')
    return 1

# ---------------------------------------------------------------- фаза B1
def cmd_regroup(P, sub_path=None, undo=False):
    man = P.manifest(); parts = man['parts']
    if undo:
        bm = P.jload('phaseB1-map.json'); out = []; done = set(); keep = []
        for x in parts:
            if x['kind'] != 'js': out.append(x); continue
            a = x['a']
            if a in done: continue
            done.add(a); ae = bm['a_entries'][a]; chunks = [y for y in parts if y['kind'] == 'js' and y['a'] == a]
            data = b''.join(raw_bytes(P, y) for y in chunks)
            fp = os.path.join(P.src, ae['path']); os.makedirs(os.path.dirname(fp), exist_ok=True)
            open(fp, 'wb').write(data); out.append(ae)
            for y in chunks: os.remove(os.path.join(P.src, y['path']))
        man['parts'] = out; P.jsave('manifest.json', man)
        for r, ds, fs in os.walk(os.path.join(P.src, 'js'), topdown=False):
            if not os.listdir(r): os.rmdir(r)
        os.remove(os.path.join(P.bd, 'phaseB1-map.json'))
        print('B1 отменена: %d JS-фрагментов фазы A восстановлено' % len(done)); return 0
    SB = json.load(open(sub_path, encoding='utf8'))
    js = [x for x in parts if x['kind'] == 'js']
    if any('/' in x['path'][3:] for x in js): raise Bad('regroup: JS уже разложен (сначала --undo)')
    byA = {}
    for c in SB['chunks']: byA.setdefault(c['a'], []).append(c)
    a_entries = {}; newjs = {}; bmap = []; n = 0
    for x in js:
        a = x['a']; L0, L1 = x['lines']; cs = byA.get(a)
        if not cs: raise Bad('regroup: нет кусков для %s' % a)
        if cs[0]['from'] != L0 or cs[-1]['to'] != L1: raise Bad('regroup: куски %s не покрывают %d–%d' % (a, L0, L1))
        for p_, q_ in zip(cs, cs[1:]):
            if q_['from'] != p_['to'] + 1: raise Bad('regroup: %s: разрыв/пересечение между %d и %d' % (a, p_['to'], q_['from']))
        text = raw_bytes(P, x).decode('utf8'); TL = text.split('\n')
        a_entries[a] = x; out = []
        for c in cs:
            n += 1; lo, hi = c['from'] - L0, c['to'] - L0
            seg = '\n'.join(TL[lo:hi + 1]) + ('\n' if hi + 1 < len(TL) else '')
            if c['dir'] in ('', None) or not re.match(r'^[a-z][a-z0-9-]*(/[a-z][a-z0-9-]*)?$', c['dir']): raise Bad('regroup: недопустимый каталог %r' % c['dir'])
            if not re.match(r'^[a-z0-9][a-z0-9.-]{0,39}$', c['label']): raise Bad('regroup: недопустимая метка %r' % c['label'])
            rel = 'js/%s/%04d-%s.js' % (c['dir'], n * 10, c['label'])
            e = {'path': rel, 'kind': 'js', 'a': a, 'lines': [c['from'], c['to']], 'subsystem': c['dir'].split('/')[0] if not c['dir'].startswith('opt/') else c['dir'],
                 'origin': c.get('origin', ''), 'why': c['why']}
            if c.get('also'): e['also'] = c['also']
            for k in ('group', 'role'):
                if x.get(k): e[k] = x[k]
            out.append((e, seg)); bmap.append({'path': rel, 'a': a, 'from': c['from'], 'to': c['to']})
        if ''.join(s for _, s in out) != text: raise Bad('regroup: куски %s не дают фрагмент побайтно' % a)
        newjs[a] = out
    # каждая граница куска — начало строки вне оператора верхнего уровня (иначе разрез рвал бы оператор)
    starts = sorted({c['from'] for cs in byA.values() for c in cs})
    full = script_of(P, man)
    cuts = with_tmp_js(full, lambda fp, d: (json.dump(starts, open(os.path.join(d, 'l.json'), 'w')), node('cuts', fp, os.path.join(d, 'l.json')))[1])
    if cuts['inside']: raise Bad('regroup: граница куска внутри оператора: %s' % cuts['inside'][:5])
    # запись
    newparts = []
    for x in parts:
        if x['kind'] != 'js': newparts.append(x); continue
        for e, seg in newjs[x['a']]:
            fp = os.path.join(P.src, e['path']); os.makedirs(os.path.dirname(fp), exist_ok=True)
            open(fp, 'wb').write(seg.encode('utf8')); newparts.append(e)
        os.remove(os.path.join(P.src, x['path']))
    man['parts'] = newparts
    P.jsave('manifest.json', man)
    P.jsave('phaseB1-map.json', {'schema': 1, 'chunks': bmap, 'a_entries': a_entries})
    print('B1: %d кусков в %d каталогах' % (len(bmap), len({e['path'].split('/')[1] for e in newparts if e['kind'] == 'js'})))
    return 0

# ---------------------------------------------------------------- самопроверка (порча на копиях)
def copy_proj(P, dst):
    for d in ('src', 'build', 'dist', 'archive'):
        if os.path.exists(P.p(d)):
            if d == 'archive': os.makedirs(os.path.join(dst, d), exist_ok=True); shutil.copy2(P.p(d, 'void_1.5.35_reference.html'), os.path.join(dst, d))
            else: shutil.copytree(P.p(d), os.path.join(dst, d))
    return Proj(dst)

def relock(Q):
    man = Q.manifest()
    lock = {'schema': 1, 'out_sha256': H(assemble(Q, man)), 'out_bytes': len(assemble(Q, man)),
            'manifest_sha256': H(open(os.path.join(Q.bd, 'manifest.json'), 'rb').read()),
            'invariants_sha256': H(open(os.path.join(Q.bd, 'invariants.json'), 'rb').read()),
            'parts': {part_key(x, i): H(raw_bytes(Q, x)) for i, x in enumerate(man['parts']) if x['kind'] != 'sep'}}
    Q.jsave('lock.json', lock)
    os.makedirs(Q.dist, exist_ok=True); open(os.path.join(Q.dist, 'void.html'), 'wb').write(assemble(Q, man)); write_provenance(Q, man, assemble(Q, man))

def cmd_selftest(P):
    base = tempfile.mkdtemp(prefix='b8self_'); rows = []
    def js_of(Q, pred):
        return [x for x in Q.manifest()['parts'] if x['kind'] == 'js' and pred(x)]
    def fpath(Q, x): return os.path.join(Q.src, x['path'])
    def edit(Q, x, fn):
        p = fpath(Q, x); b = open(p, 'rb').read(); open(p, 'wb').write(fn(b))
    def manedit(Q, fn):
        m = Q.manifest(); fn(m['parts']); Q.jsave('manifest.json', m)
    A = lambda name: (lambda x: x.get('a') == name)
    def first(Q, a): return js_of(Q, A(a))[0]
    def last(Q, a): return js_of(Q, A(a))[-1]
    cases = [
     ('удалён один символ (08-sectors-5-6)', lambda Q: edit(Q, first(Q, '08-sectors-5-6'), lambda b: b[:3000] + b[3001:]), {'lock', 'coverage', 'syntax', 'dist'}, False),
     ('переставлены фрагменты 02-game и 03-shell', lambda Q: manedit(Q, lambda P_: swap_a(P_, '02-game', '03-shell')), {'coverage', 'init', 'lock'}, True),
     ('фрагмент включён дважды', lambda Q: manedit(Q, lambda P_: P_.insert(next(i for i, x in enumerate(P_) if x.get('a') == '05-story'), dict(next(x for x in P_ if x.get('a') == '05-story')))), {'files'}, True),
     ('удалён обязательный файл (страж неба)', lambda Q: os.remove(fpath(Q, js_of(Q, lambda x: x.get('role') == 'sky-rng-guard')[0])), {'files'}, True),
     ('часть убрана из манифеста', lambda Q: manedit(Q, lambda P_: P_.remove(next(x for x in P_ if x.get('a') == '06-devworld'))), {'files', 'coverage', 'lock'}, True),
     ('кодировка cp1251', lambda Q: edit(Q, first(Q, '05-story'), lambda b: b.decode('utf8').encode('cp1251', 'replace')), {'encoding'}, True),
     ('добавлен BOM', lambda Q: edit(Q, first(Q, '01-data-sectors'), lambda b: b'\xef\xbb\xbf' + b), {'encoding'}, True),
     ('лишний перевод строки', lambda Q: edit(Q, last(Q, '12-mobile-start'), lambda b: b + b'\n'), {'lock', 'coverage', 'dist'}, False),
     ('CRLF вместо LF', lambda Q: edit(Q, last(Q, '16-boot'), lambda b: b.replace(b'\n', b'\r\n')), {'encoding'}, True),
     ('удалена защита iso65', lambda Q: edit(Q, js_of(Q, lambda x: x.get('role') == 'sky-rng-guard')[0], lambda b: b.replace(b'buildNebula=iso65(buildNebula);', b'')), {'guards'}, True),
     ('защита неба перенесена внутрь BG', lambda Q: move_guard_into_bg(Q), {'guards', 'order'}, True),
     ('сдвинут маркер CINE', lambda Q: shift_marker(Q), {'order'}, True),
     ('повреждён 1 символ аудиоблока', lambda Q: edit_asset(Q), {'assets', 'lock', 'coverage'}, False),
     ('файл вне манифеста', lambda Q: open(os.path.join(Q.src, 'js', 'zz-new.js'), 'w').write('x();\n'), {'files'}, True),
     ('загрузка не последняя', lambda Q: manedit(Q, lambda P_: move_boot(P_)), {'order', 'coverage', 'lock'}, True),
     ('манифест: неизвестный kind и lit не из пробелов', lambda Q: manedit(Q, lambda P_: (P_[0].__setitem__('kind', 'html'), P_.insert(1, {'lit': 'alert(1)', 'kind': 'sep'}))), {'schema'}, True),
     ('манифест не JSON', lambda Q: open(os.path.join(Q.bd, 'manifest.json'), 'w').write('{"schema":1,'), {'schema'}, True),
     ('кусок пересекает границу фрагментов фазы A', lambda Q: merge_across(Q), {'coverage'}, False),
     ('PROVENANCE устарел (сборщик другой)', lambda Q: (lambda pv: open(pv, 'w', encoding='utf8').write(open(pv, encoding='utf8').read().replace('"builder_sha256": "', '"builder_sha256": "0')))(os.path.join(Q.dist, 'PROVENANCE.json')), {'dist'}, False),
    ]
    try:
        for name, mut, expect, relock_too in cases:
            for mode in (('обычный', 'после пересчёта lock') if relock_too else ('обычный',)):
                d = os.path.join(base, 'c'); shutil.rmtree(d, ignore_errors=True); Q = copy_proj(P, d)
                try: mut(Q)
                except Exception as e: rows.append((name, mode, 'ERROR', 'мутация не применилась: %r' % e)); continue
                if mode != 'обычный':
                    try: relock(Q)
                    except Exception: pass
                R = checks(Q, quick=True)
                failed = {n for n, s, _ in R.rows if s in ('FAIL', 'ERROR')}
                hit = failed & expect
                rows.append((name, mode, 'PASS' if hit else 'FAIL', 'поймано: %s' % sorted(failed) if failed else 'НЕ ПОЙМАНО'))
        # детерминированность в другой папке и окружении
        d = os.path.join(base, 'det'); Q = copy_proj(P, d)
        o = os.path.join(base, 'det.html')
        env = dict(os.environ, LANG='C', LC_ALL='C', TZ='Asia/Tokyo', PYTHONHASHSEED='12345')
        r = subprocess.run([sys.executable, os.path.abspath(__file__), '--root', d, 'build', '--out', o], cwd=base, env=env, capture_output=True)
        same = r.returncode == 0 and open(o, 'rb').read() == assemble(P, P.manifest())
        rows.append(('сборка в другой папке, LANG=C, TZ=Asia/Tokyo, другой cwd', 'обычный', 'PASS' if same else 'FAIL', 'SHA совпал' if same else 'SHA различается: %s' % r.stderr[-200:]))
        rows.extend(regroup_cases(P, base))
        # исходное дерево чистое
        R = checks(P, quick=True); bad = [(n, s) for n, s, _ in R.rows if s in ('FAIL', 'ERROR')]
        rows.append(('исходное дерево без порчи', 'обычный', 'PASS' if not bad else 'FAIL', 'чисто' if not bad else str(bad)))
    finally: shutil.rmtree(base, ignore_errors=True)
    print('build8 selftest — порча на копиях (каждый случай обязан дать FAIL ожидаемой проверки):')
    for n, m, st, det in rows: print('  %-5s %-28s %-60s %s' % (st, m, n, det[:150]))
    nb = sum(1 for r in rows if r[2] != 'PASS')
    print('ИТОГ: %d случаев, не поймано/сбой: %d' % (len(rows), nb))
    return 0 if nb == 0 else 1

def tree_sums(Q):
    out = {}
    for top in ('src',):
        for r, _, fs in os.walk(os.path.join(Q.root, top)):
            for f in fs:
                fp = os.path.join(r, f); out[os.path.relpath(fp, Q.root)] = H(open(fp, 'rb').read())
    return out

def regroup_cases(P, base):
    """B1: перекладка и её отмена на копиях. Разметка — build/subsystems.json (если её нет — случаи пропускаются с ERROR)."""
    rows = []; sp = os.path.join(P.bd, 'subsystems.json')
    if not os.path.exists(sp): return [('B1: разметка', 'обычный', 'ERROR', 'нет build/subsystems.json')]
    SB = json.load(open(sp, encoding='utf8')); want = assemble(P, P.manifest())
    def fresh(tag):
        d = os.path.join(base, 'rg_' + tag); shutil.rmtree(d, ignore_errors=True); Q = copy_proj(P, d)
        if os.path.exists(os.path.join(Q.bd, 'phaseB1-map.json')):
            with contextlib.redirect_stdout(io.StringIO()): cmd_regroup(Q, undo=True)
        return Q
    def try_sb(Q, sb):
        f = os.path.join(Q.root, 'sb.json'); json.dump(sb, open(f, 'w', encoding='utf8'), ensure_ascii=False)
        try:
            with contextlib.redirect_stdout(io.StringIO()): cmd_regroup(Q, f)
            return None
        except Bad as e: return str(e)
    # 1. перекладка → та же сборка → отмена → дерево фазы A побайтно
    Q = fresh('ok'); A0 = tree_sums(Q); err = try_sb(Q, SB)
    ok1 = err is None and assemble(Q, Q.manifest()) == want
    with contextlib.redirect_stdout(io.StringIO()): cmd_regroup(Q, undo=True)
    ok2 = ok1 and tree_sums(Q) == A0 and not os.path.exists(os.path.join(Q.bd, 'phaseB1-map.json'))
    rows.append(('B1: перекладка по разметке, сборка побайтно та же', 'обычный', 'PASS' if ok1 else 'FAIL', 'SHA совпал' if ok1 else 'ошибка: %s' % err))
    rows.append(('B1: --undo возвращает дерево фазы A побайтно', 'обычный', 'PASS' if ok2 else 'FAIL', 'совпало' if ok2 else 'дерево отличается'))
    # 2. порченые разметки обязаны быть отвергнуты до записи (дерево не тронуто)
    def bad_case(name, fn):
        Q = fresh('bad'); A1 = tree_sums(Q); sb = json.loads(json.dumps(SB)); fn(sb, Q); err = try_sb(Q, sb)
        untouched = tree_sums(Q) == A1
        rows.append((name, 'обычный', 'PASS' if err and untouched else 'FAIL', ('отвергнуто: %s' % err[:90]) if err else 'НЕ ОТВЕРГНУТО'))
    def gap(sb, Q): sb['chunks'][5]['from'] += 1
    def overlap(sb, Q): sb['chunks'][5]['from'] -= 1
    def inside(sb, Q):
        # граница внутрь оператора: ищем строку внутри объявления функции в куске 10
        full = script_of(Q, Q.manifest()); i = max(range(len(sb['chunks']) - 1), key=lambda i: sb['chunks'][i]['to'] - sb['chunks'][i]['from'])
        c = sb['chunks'][i]; L = list(range(c['from'] + 1, c['to']))
        got = with_tmp_js(full, lambda fp, d: (json.dump(L, open(os.path.join(d, 'l.json'), 'w')), node('cuts', fp, os.path.join(d, 'l.json')))[1])
        k = got['inside'][0][0]; c2 = dict(c, **{'from': k, 'label': c['label'] + '-b'}); c['to'] = k - 1
        if not got['inside']: raise Bad('нет строки внутри оператора в %s' % c['label'])
        sb['chunks'].insert(i + 1, c2)
    def baddir(sb, Q): sb['chunks'][3]['dir'] = '../x'
    def across(sb, Q):
        i = next(i for i, c in enumerate(sb['chunks']) if c['a'] == '06-devworld'); sb['chunks'][i - 1]['to'] = sb['chunks'][i]['to']; sb['chunks'][i - 1]['a'] = '05-story'; del sb['chunks'][i]
    bad_case('B1: разрыв между кусками', gap)
    bad_case('B1: пересечение кусков', overlap)
    bad_case('B1: граница внутри оператора', inside)
    bad_case('B1: недопустимый каталог', baddir)
    bad_case('B1: кусок через границу фазы A', across)
    return rows

def swap_a(P_, a, b):
    ia = [i for i, x in enumerate(P_) if x.get('a') == a]; ib = [i for i, x in enumerate(P_) if x.get('a') == b]
    xa = [P_[i] for i in ia]; xb = [P_[i] for i in ib]
    lo = min(ia + ib); seq = xb + xa
    for i in sorted(ia + ib, reverse=True): del P_[i]
    for k, x in enumerate(seq): P_.insert(lo + k, x)

def move_boot(P_):
    i = next(i for i, x in enumerate(P_) if x.get('role') == 'boot'); x = P_.pop(i)
    j = next(i for i, y in enumerate(P_) if y.get('a') == '03-shell'); P_.insert(j, x)

def move_guard_into_bg(Q):
    m = Q.manifest(); g = next(x for x in m['parts'] if x.get('role') == 'sky-rng-guard')
    b0 = next(x for x in m['parts'] if x['kind'] == 'js' and x.get('group') == 'bg')
    gp = os.path.join(Q.src, g['path']); bp = os.path.join(Q.src, b0['path'])
    gb = open(gp, 'rb').read(); open(bp, 'wb').write(gb + open(bp, 'rb').read()); open(gp, 'wb').write(b'')

def shift_marker(Q):
    m = Q.manifest(); c0 = next(x for x in m['parts'] if x['kind'] == 'js' and x.get('group') == 'cine')
    i = m['parts'].index(c0); prev = m['parts'][i - 1]
    pp = os.path.join(Q.src, prev['path']); cp = os.path.join(Q.src, c0['path'])
    pb = open(pp, 'rb').read(); k = pb.rstrip(b'\n').rfind(b'\n') + 1
    open(pp, 'wb').write(pb[:k]); open(cp, 'wb').write(pb[k:] + open(cp, 'rb').read())

def edit_asset(Q):
    m = Q.manifest(); a = [x for x in m['parts'] if x['kind'] == 'octet'][-1]; p = os.path.join(Q.src, a['path'])
    b = open(p, 'rb').read(); c = b'B' if b[100:101] != b'B' else b'C'; open(p, 'wb').write(b[:100] + c + b[101:])

def merge_across(Q):
    # последний кусок 05-story и первый кусок 06-devworld сливаются в один файл, помеченный как 05-story
    m = Q.manifest(); P_ = m['parts']
    i = max(i for i, x in enumerate(P_) if x.get('a') == '05-story'); j = i + 1
    a, b = P_[i], P_[j]
    pa = os.path.join(Q.src, a['path']); pb = os.path.join(Q.src, b['path'])
    data = open(pa, 'rb').read() + open(pb, 'rb').read(); open(pa, 'wb').write(data); os.remove(pb); del P_[j]
    Q.jsave('manifest.json', m); relock(Q)

# ---------------------------------------------------------------- вход
def main(argv):
    a = list(argv)
    def opt(n, default=None):
        if n in a:
            i = a.index(n)
            if i + 1 >= len(a): raise Usage('%s: нет значения' % n)
            v = a[i + 1]; del a[i:i + 2]; return v
        return default
    def flag(n):
        if n in a: a.remove(n); return True
        return False
    try:
        root = opt('--root', os.path.dirname(TOOLS)); P = Proj(root)
        if not a: raise Usage('нет команды (см. начало tools8/build8.py)')
        cmd = a.pop(0)
        if cmd == 'build':
            w = opt('--without'); out = opt('--out');
            if a: raise Usage('лишние аргументы: %s' % a)
            without = tuple(x for x in (w or '').split(',') if x)
            unk = set(without) - set(groups_of(P.manifest()))
            if unk: raise Usage('нет групп: %s' % sorted(unk))
            cmd_build(P, out, without); return 0
        if cmd == 'check':
            q = flag('--quick'); j = opt('--json')
            if a: raise Usage('лишние аргументы: %s' % a)
            return cmd_check(P, q, j)
        if cmd == 'lock': return cmd_lock(P, opt('--reason'))
        if cmd == 'index': cmd_index(P); return 0
        if cmd == 'where':
            if len(a) != 1: raise Usage('where ИМЯ')
            return cmd_where(P, a[0])
        if cmd == 'blame':
            sc = flag('--script')
            if len(a) != 1 or not a[0].isdigit(): raise Usage('blame СТРОКА [--script]')
            return cmd_blame(P, int(a[0]), sc)
        if cmd == 'verify-html':
            if len(a) != 1: raise Usage('verify-html ФАЙЛ')
            return cmd_verify_html(P, a[0])
        if cmd == 'selftest': return cmd_selftest(P)
        if cmd == 'split':
            src = opt('--from'); plan = opt('--plan', os.path.join(P.bd, 'split-plan.json'))
            if not src: raise Usage('split --from HTML')
            cmd_split(P, src, plan); return 0
        if cmd == 'regroup':
            if flag('--undo'): return cmd_regroup(P, undo=True)
            s = opt('--subsystems', os.path.join(P.bd, 'subsystems.json')); return cmd_regroup(P, s)
        raise Usage('неизвестная команда %s' % cmd)
    except Usage as e: print('ОШИБКА ВЫЗОВА:', e); return 3
    except Bad as e: print('ОШИБКА:', e); return 1

if __name__ == '__main__':
    try: sys.exit(main(sys.argv[1:]))
    except BrokenPipeError:  # вывод обрезан (| head) — не ошибка
        try: sys.stdout = open(os.devnull, 'w')
        except Exception: pass
        sys.exit(0)
