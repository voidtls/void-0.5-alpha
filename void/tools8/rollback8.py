#!/usr/bin/env python3
# VØID · этап 8 · rollback8 — проверка обратимости (ТЗ этапа 8, раздел 14.2), только на временных копиях; рабочее дерево не меняется.
#   python3 tools8/rollback8.py [--json ФАЙЛ]
# 1. B1 → A: regroup --undo на копии; 18 JS-фрагментов и манифест побайтно равны снимку фазы A (snap/P8.4); сборка = 1.5.35.
#    Дополнительно: snap8 restore P8.4 на копии даёт то же дерево.
# 2. A → монолит: build даёт b936a549… (и из дерева B1, и из восстановленного дерева A).
# 3. Монолит → 1.5.24: замороженный конвейер archive/ (rollback6 + stage6) во временной раскладке, без тестового комплекта → 76753e33…;
#    и обратно: s6 apply 85…93 к 1.5.24 → b936a549….
# 4. Искусственный патч на копии: правка комментария в одном куске + lock --reason → SHA другой, в CHANGES.jsonl новая строка;
#    возврат файла + lock → снова b936a549…, check без FAIL.
# 5. verify-html на испорченной копии dist находит расхождение и называет часть, в которой испорчен байт.
import sys, os, json, shutil, subprocess, tempfile, hashlib
TOOLS = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(TOOLS)
sys.path.insert(0, TOOLS); import build8 as B
W35 = 'b936a549366321b63b8f0c6ac5a8c34013150cffac9ea584b71d3c09c7f4c034'
W24 = '76753e3338ab36eefe8e6e5f945428a341de27b8e0f29b4fd8235ef0ad897776'
H = lambda b: hashlib.sha256(b).hexdigest()
a = sys.argv[1:]; OUT = a[a.index('--json') + 1] if '--json' in a else None
rows = []
def row(n, ok, det): rows.append({'пункт': n, 'status': 'PASS' if ok else 'FAIL', 'detail': det}); print('%-5s %s — %s' % (rows[-1]['status'], n, det), flush=True)
def b8(root, *args):
    r = subprocess.run([sys.executable, os.path.join(root, 'tools8', 'build8.py')] + list(args), capture_output=True, text=True, cwd=root)
    return r.returncode, r.stdout + r.stderr
def copy(dst):
    for d in ('src', 'build', 'dist', 'tools8', 'snap', 'index'):
        if os.path.exists(os.path.join(ROOT, d)): shutil.copytree(os.path.join(ROOT, d), os.path.join(dst, d), ignore=shutil.ignore_patterns('node_modules') if d != 'tools8' else None, symlinks=True)
    os.makedirs(os.path.join(dst, 'archive')); shutil.copy2(os.path.join(ROOT, 'archive', 'void_1.5.35_reference.html'), os.path.join(dst, 'archive'))
    return dst
def sums(root, pred):
    out = {}
    for r, _, fs in os.walk(os.path.join(root, 'src')):
        for f in fs:
            rel = os.path.relpath(os.path.join(r, f), root).replace(os.sep, '/')
            if pred(rel): out[rel] = H(open(os.path.join(root, rel), 'rb').read())
    return out
def snap_sums(name):
    return {l.split('  ', 1)[1].rstrip('\n'): l.split('  ', 1)[0] for l in open(os.path.join(ROOT, 'snap', name, 'SHA256SUMS'))}
tmp = tempfile.mkdtemp(prefix='rb8_')
try:
    isB1 = os.path.exists(os.path.join(ROOT, 'build', 'phaseB1-map.json'))
    A = snap_sums('P8.4'); jsA = {k: v for k, v in A.items() if k.startswith('src/js/')}
    # 1
    if isB1:
        c = copy(os.path.join(tmp, 'c1')); rc, out = b8(c, 'regroup', '--undo')
        got = sums(c, lambda r: r.startswith('src/js/'))
        man_ok = H(open(os.path.join(c, 'build', 'manifest.json'), 'rb').read()) == A['build/manifest.json']
        rc2, _ = b8(c, 'build', '--out', os.path.join(tmp, 'a.html'))
        okb = rc2 == 0 and H(open(os.path.join(tmp, 'a.html'), 'rb').read()) == W35
        ok = rc == 0 and got == jsA and man_ok and okb and not os.path.exists(os.path.join(c, 'build', 'phaseB1-map.json'))
        row('1. B1 → A (regroup --undo)', ok, '%d JS-фрагментов = снимок фазы A: %s; манифест = снимок: %s; сборка = 1.5.35: %s' % (len(got), got == jsA, man_ok, okb))
        c2 = copy(os.path.join(tmp, 'c1b')); r = subprocess.run([sys.executable, os.path.join(c2, 'tools8', 'snap8.py'), 'restore', 'P8.4'], capture_output=True, text=True)
        rc3, _ = b8(c2, 'build', '--out', os.path.join(tmp, 'a2.html'))
        ok = r.returncode == 0 and rc3 == 0 and H(open(os.path.join(tmp, 'a2.html'), 'rb').read()) == W35 and sums(c2, lambda r: r.startswith('src/js/')) == jsA
        row('1б. B1 → A (snap8 restore P8.4)', ok, r.stdout.strip()[-120:])
    else:
        row('1. B1 → A', True, 'дерево уже в фазе A — пункт не применяется (проверено отсутствие phaseB1-map.json)')
    # 2
    rc, _ = b8(ROOT, 'build', '--out', os.path.join(tmp, 'cur.html')); h = H(open(os.path.join(tmp, 'cur.html'), 'rb').read())
    row('2. текущее дерево → монолит', rc == 0 and h == W35, 'SHA %s' % h[:16])
    # 3
    L = os.path.join(tmp, 'arch'); os.makedirs(os.path.join(L, 'kit')); os.makedirs(os.path.join(L, 'tools6'))
    ka = open(os.path.join(ROOT, 'archive', 'kit_arch74.py'), encoding='utf8').read()
    # в архивной копии путь D к комплекту абсолютный (его вписал setup_kit); во временной раскладке он направляется в неё же — так доказано, что комплект не нужен
    import re as _re
    ka2, nD = _re.subn(r"^D='[^']*'$", "D=os.path.dirname(os.path.abspath(__file__))+'/'", ka, flags=_re.M)
    open(os.path.join(L, 'kit', 'arch74.py'), 'w', encoding='utf8').write(ka2)
    shutil.copytree(os.path.join(ROOT, 'archive', 'stage6'), os.path.join(L, 'stage6')); shutil.copy2(os.path.join(ROOT, 'archive', 'rollback6.py'), os.path.join(L, 'tools6'))
    v24 = os.path.join(tmp, 'v24.html')
    r = subprocess.run([sys.executable, os.path.join(L, 'tools6', 'rollback6.py'), os.path.join(tmp, 'cur.html'), v24], capture_output=True, text=True, cwd=tmp)
    h24 = H(open(v24, 'rb').read()) if os.path.exists(v24) else ''
    row('3. монолит → 1.5.24 (archive/rollback6, без тестового комплекта)', nD == 1 and r.returncode == 0 and h24 == W24, 'SHA %s; путь D перенаправлен во временную раскладку: %s' % (h24[:16], nD == 1))
    r = subprocess.run([sys.executable, os.path.join(L, 'stage6', 's6.py'), 'apply', v24, os.path.join(tmp, 'v35.html'), '85', '86', '87', '88', '89', '89b', '90a', '90b', '91', '92', '93'], capture_output=True, text=True, cwd=tmp)
    h35 = H(open(os.path.join(tmp, 'v35.html'), 'rb').read()) if os.path.exists(os.path.join(tmp, 'v35.html')) else ''
    row('3б. 1.5.24 → 1.5.35 (archive/stage6 apply 85…93)', r.returncode == 0 and h35 == W35, 'SHA %s' % h35[:16])
    # 4
    c = copy(os.path.join(tmp, 'c4')); P = B.Proj(c); man = P.manifest()
    x = next(x for x in man['parts'] if x['kind'] == 'js' and x.get('subsystem') == 'ui') if isB1 else next(x for x in man['parts'] if x['kind'] == 'js')
    fp = os.path.join(c, 'src', x['path']); orig = open(fp, 'rb').read()
    k = orig.index(b'//'); new = orig[:k + 2] + b' rollback8-proba' + orig[k + 2:]
    nch0 = sum(1 for _ in open(os.path.join(c, 'build', 'CHANGES.jsonl')))
    open(fp, 'wb').write(new); rc1, o1 = b8(c, 'lock', '--reason', 'rollback8: проба'); hs = H(open(os.path.join(c, 'dist', 'void.html'), 'rb').read())
    nch1 = sum(1 for _ in open(os.path.join(c, 'build', 'CHANGES.jsonl')))
    open(fp, 'wb').write(orig); rc2, o2 = b8(c, 'lock', '--reason', 'rollback8: возврат'); hb = H(open(os.path.join(c, 'dist', 'void.html'), 'rb').read())
    rc3, o3 = b8(c, 'check', '--quick')
    ok = rc1 == 0 and hs != W35 and nch1 == nch0 + 1 and rc2 == 0 and hb == W35 and rc3 == 0
    row('4. искусственный патч и возврат', ok, 'правка %s: SHA %s (≠ 1.5.35: %s), строк CHANGES %d→%d; после возврата SHA %s, check код %d' % (x['path'], hs[:16], hs != W35, nch0, nch1, hb[:16], rc3))
    # 5
    bad = os.path.join(tmp, 'bad.html'); b = bytearray(open(os.path.join(tmp, 'cur.html'), 'rb').read())
    man = B.Proj(ROOT).manifest(); off = 0; want = None; target = len(b) // 2
    P0 = B.Proj(ROOT)
    for i, y in enumerate(man['parts']):
        n = len(B.part_bytes(P0, y))
        if off <= target < off + n: want = B.part_key(y, i); break
        off += n
    b[target] = (b[target] + 1) % 256 if 32 < b[target] < 120 else 65; open(bad, 'wb').write(bytes(b))
    rc, out = b8(ROOT, 'verify-html', bad)
    first = [l.strip() for l in out.split('\n') if l.startswith('  ')][:1]
    row('5. verify-html на испорченной копии', rc == 1 and first == [want], 'испорчен байт %d в части %s; названа: %s' % (target, want, first))
    # то же для куска JS (середина первого куска боссов или первого JS-фрагмента)
    b = bytearray(open(os.path.join(tmp, 'cur.html'), 'rb').read()); off = 0; want = None
    jx = next((i for i, y in enumerate(man['parts']) if y['kind'] == 'js' and y.get('subsystem') == 'bosses'), None)
    if jx is None: jx = next(i for i, y in enumerate(man['parts']) if y['kind'] == 'js')
    for i, y in enumerate(man['parts']):
        n = len(B.part_bytes(P0, y))
        if i == jx: target = off + n // 2; want = B.part_key(y, i); break
        off += n
    b[target] = (b[target] + 1) % 256 if 32 < b[target] < 120 else 65; open(bad, 'wb').write(bytes(b))
    rc, out = b8(ROOT, 'verify-html', bad); first = [l.strip() for l in out.split('\n') if l.startswith('  ')][:1]
    row('5а. verify-html: испорчен байт в куске JS', rc == 1 and first == [want], 'испорчен байт %d в %s; названа: %s' % (target, want, first))
    rc, out = b8(ROOT, 'verify-html', os.path.join(tmp, 'cur.html'))
    row('5б. verify-html на целой копии', rc == 0, out.strip()[:100])
finally: shutil.rmtree(tmp, ignore_errors=True)
st = 'PASS' if all(r['status'] == 'PASS' for r in rows) else 'FAIL'
print('rollback8:', st)
if OUT: json.dump({'status': st, 'rows': rows}, open(OUT, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
sys.exit(0 if st == 'PASS' else 1)
