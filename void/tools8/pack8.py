#!/usr/bin/env python3
# VØID · этап 8 · pack8 — сборка поставки VOID_stage8.zip и проверка из чистой распаковки.
#   python3 tools8/pack8.py --kit void-kit-1.5.35.tar.xz --results ПАПКА [--accept ПАПКА_ПРОГОНА] [--review review8.md] --out VOID_stage8.zip
# Содержимое: void/ (src, build, tools8, index, dist, archive, snap, journal8, docs, README_SRC.md, MANUAL_PLATFORMS.md, REPORT_stage8.md),
# void_1.5.35_stage8.html (итоговый HTML), testkit/void-kit-1.5.35.tar.xz, results/ (итоги проверок; без копий собранных HTML из шагов),
# SHA256SUMS (все файлы архива), SHA_CONFIRMATION.md, README.md.
# Проверка: распаковка во временную папку; SHA256SUMS сходится; build из src/ = b936…; check (без index — пересобирается) PASS/KNOWN;
# rollback8 PASS; при наличии развёрнутого комплекта — нет.
import sys, os, zipfile, hashlib, shutil, subprocess, tempfile, json, time
TOOLS = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(TOOLS)
a = sys.argv[1:]
def opt(n, d=None):
    if n in a: i = a.index(n); v = a[i + 1]; del a[i:i + 2]; return v
    return d
KIT = opt('--kit'); RES = opt('--results'); ACC = opt('--accept'); REV = opt('--review'); OUT = os.path.abspath(opt('--out', 'VOID_stage8.zip'))
W35 = 'b936a549366321b63b8f0c6ac5a8c34013150cffac9ea584b71d3c09c7f4c034'
H = lambda b: hashlib.sha256(b).hexdigest()
entries = {}   # путь в архиве → байты/путь
def add_tree(src, dst, skip=lambda rel: False):
    for r, ds, fs in os.walk(src):
        ds[:] = sorted(d for d in ds if d not in ('__pycache__',))
        for f in sorted(fs):
            p = os.path.join(r, f); rel = os.path.relpath(p, src).replace(os.sep, '/')
            if not skip(rel): entries[dst + '/' + rel] = p
for d in ('src', 'build', 'tools8', 'index', 'dist', 'archive', 'snap', 'journal8', 'docs'):
    add_tree(os.path.join(ROOT, d), 'void/' + d)
for f in ('README_SRC.md', 'MANUAL_PLATFORMS.md', 'REPORT_stage8.md'):
    if os.path.exists(os.path.join(ROOT, f)): entries['void/' + f] = os.path.join(ROOT, f)
entries['void_1.5.35_stage8.html'] = os.path.join(ROOT, 'dist', 'void.html')
if KIT: entries['testkit/void-kit-1.5.35.tar.xz'] = os.path.abspath(KIT)
big = lambda rel: rel.endswith('.html') and '/steps/' in '/' + rel   # копии сборок в шагах приёмки (восстанавливаются цепочкой)
if RES: add_tree(RES, 'results', big)
if ACC: add_tree(ACC, 'results/accept8_full', big)
if REV: entries['review8.md'] = os.path.abspath(REV)
dsha = H(open(os.path.join(ROOT, 'dist', 'void.html'), 'rb').read())
conf = ['# Подтверждение SHA\n\n',
        '| Файл | SHA-256 |\n|---|---|\n',
        '| эталон 1.5.35 (`void/archive/void_1.5.35_reference.html`) | `%s` |\n' % H(open(os.path.join(ROOT, 'archive', 'void_1.5.35_reference.html'), 'rb').read()),
        '| сборка из src/ (`void/dist/void.html`, `void_1.5.35_stage8.html`) | `%s` |\n' % dsha,
        '| требуемый (разрешение владельца) | `%s` |\n\n' % W35,
        'Совпадение: **%s**. Проверить самостоятельно: `cd void && python3 tools8/build8.py build && sha256sum dist/void.html`.\n' % ('да' if dsha == W35 else 'НЕТ')]
readme = ('# VØID · этап 8 — поставка\n\nСостав:\n\n'
          '- `void/` — канонические модульные исходники (`src/`), манифест и инварианты (`build/`), сборщик и инструменты (`tools8/`), индексы (`index/`), '
          'итоговый HTML (`dist/`), замороженный архив 1.5.35 и патчей 85–93 (`archive/`), снимки P8.x (`snap/`), журнал (`journal8/`), документы (`docs/`); '
          'руководство разработчика — `void/README_SRC.md`, отчёт — `void/REPORT_stage8.md`, ручная проверка на устройствах — `void/MANUAL_PLATFORMS.md`.\n'
          '- `void_1.5.35_stage8.html` — итоговая игра одним файлом (побайтно 1.5.35).\n'
          '- `testkit/void-kit-1.5.35.tar.xz` — тестовый комплект 1.5.35 без изменений (развёртывание — README_KIT6.md внутри; затем `python3 void/tools8/accept8.py --testkit <папка комплекта>`).\n'
          '- `results/` — результаты проверок P8.0–P8.7 и полной приёмки `accept8_full/` (ИТОГ.txt, accept.json, журналы шагов).\n'
          '- `review8.md` — независимая перепроверка.\n- `SHA256SUMS` — хэши всех файлов; `SHA_CONFIRMATION.md` — сверка SHA с 1.5.35.\n\n'
          'Быстрая проверка (ничего в поставке не перезаписывает): `cd void && python3 tools8/build8.py build --out /tmp/void_check.html && sha256sum /tmp/void_check.html && python3 tools8/build8.py check && python3 tools8/rollback8.py`.\n')
gen = {'SHA_CONFIRMATION.md': ''.join(conf).encode(), 'README.md': readme.encode()}
sums = {k: H(open(v, 'rb').read()) for k, v in entries.items()}
sums.update({k: H(v) for k, v in gen.items()})
gen['SHA256SUMS'] = ''.join('%s  %s\n' % (sums[k], k) for k in sorted(sums)).encode()
if os.path.exists(OUT): os.remove(OUT)
with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for k in sorted(entries):
        zi = zipfile.ZipInfo(k, date_time=(2026, 11, 17, 0, 0, 0)); zi.compress_type = zipfile.ZIP_DEFLATED
        zi.external_attr = (0o755 if k.endswith(('.py', '.sh')) else 0o644) << 16
        z.writestr(zi, open(entries[k], 'rb').read())
    for k in sorted(gen):
        zi = zipfile.ZipInfo(k, date_time=(2026, 11, 17, 0, 0, 0)); zi.compress_type = zipfile.ZIP_DEFLATED; zi.external_attr = 0o644 << 16
        z.writestr(zi, gen[k])
print('архив: %s, %d файлов, %.1f МБ' % (OUT, len(entries) + len(gen), os.path.getsize(OUT) / 1e6))
# ---------------------------------------------------------------- проверка из чистой распаковки
t = tempfile.mkdtemp(prefix='pack8_chk_'); rows = []
def row(n, ok, d): rows.append((n, ok, d)); print('%-5s %s — %s' % ('PASS' if ok else 'FAIL', n, d), flush=True)
try:
    with zipfile.ZipFile(OUT) as z: z.extractall(t)
    S = {l.split('  ', 1)[1].rstrip('\n'): l.split('  ', 1)[0] for l in open(os.path.join(t, 'SHA256SUMS'), encoding='utf8')}
    bad = [k for k, v in S.items() if H(open(os.path.join(t, k), 'rb').read()) != v]
    row('SHA256SUMS', not bad and len(S) == len(entries) + 2, '%d файлов, расхождений %d' % (len(S), len(bad)))
    V = os.path.join(t, 'void'); env = dict(os.environ, LANG='C', TZ='UTC')
    b = subprocess.run([sys.executable, os.path.join(V, 'tools8', 'build8.py'), 'build', '--out', os.path.join(t, 'x.html')], capture_output=True, text=True, cwd=t, env=env)
    h = H(open(os.path.join(t, 'x.html'), 'rb').read()) if b.returncode == 0 else ''
    row('сборка из src/ после распаковки', h == W35 and h == H(open(os.path.join(t, 'void_1.5.35_stage8.html'), 'rb').read()), 'SHA %s' % h[:16])
    c = subprocess.run([sys.executable, os.path.join(V, 'tools8', 'build8.py'), 'check'], capture_output=True, text=True, cwd=V, env=env)
    tail = [l for l in c.stdout.splitlines() if l.startswith('ИТОГ')]
    row('check после распаковки', c.returncode == 0 and 'FAIL 0' in c.stdout and 'ERROR 0' in c.stdout, '%s' % tail)
    AS = {l.split('  ', 1)[1].rstrip('\n'): l.split('  ', 1)[0] for l in open(os.path.join(V, 'snap', 'P8.0', 'ARCHIVE_SHA256SUMS'), encoding='utf8')}
    have = {os.path.relpath(os.path.join(r_, f_), os.path.join(V, 'archive')).replace(os.sep, '/') for r_, _, fs_ in os.walk(os.path.join(V, 'archive')) for f_ in fs_}
    bada = [k for k, v in AS.items() if H(open(os.path.join(V, 'archive', k), 'rb').read()) != v] + sorted(have - {k.lstrip('./') for k in AS})
    row('archive/ не изменён с P8.0 (ТЗ 17.10)', not bada, '%d файлов, расхождений и лишних %d %s' % (len(AS), len(bada), bada[:3]))
    r = subprocess.run([sys.executable, os.path.join(V, 'tools8', 'rollback8.py')], capture_output=True, text=True, cwd=V, env=env)
    row('rollback8 после распаковки', r.returncode == 0, r.stdout.strip().splitlines()[-1] if r.stdout.strip() else r.stderr[-200:])
    kt = os.path.join(t, 'testkit', 'void-kit-1.5.35.tar.xz')
    if os.path.exists(kt): row('тестовый комплект = поставка 1.5.35', H(open(kt, 'rb').read()) == '49d19a523f5b12f55dc6e89a8abf879dce59f2a4b19114eab0c9f0db1333cc1c', 'SHA %s' % H(open(kt, 'rb').read())[:16])
finally: shutil.rmtree(t, ignore_errors=True)
ok = all(r[1] for r in rows); print('pack8:', 'PASS' if ok else 'FAIL'); sys.exit(0 if ok else 1)
