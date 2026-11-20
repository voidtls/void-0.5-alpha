#!/usr/bin/env python3
# VØID · этап 8 · accept8 — итоговая приёмка модульной сборки (ТЗ этапа 8, раздел 12.4) поверх accept6 тестового комплекта 1.5.35.
#   python3 tools8/accept8.py [--testkit ПАПКА] [--out ПАПКА] [--steps a,b,…] [--group g,…] [--list] [--keep-going] [--selftest]
# Чем отличается от accept6:
#   • шаг build: после штатной сборки 1.5.25…1.5.35 из 1.5.24 патчами 85–93 проверяется, что dist/void.html (выход build8 из src/)
#     ПОБАЙТНО равен итогу цепочки; дальше все шаги комплекта проверяют именно dist/void.html (копия в папке прогона), а не итог цепочки;
#   • добавлены шаги группы stage8: b8check (build8 check: KNOWN допускается только точный зарегистрированный cut.cine.live),
#     b8self (build8 selftest), variants8, nav8 (navcheck8), rollback8, offline8.
# Статусы и коды выхода — как у accept6: PASS / FAIL / KNOWN / ERROR; 0 — полный прогон без FAIL/ERROR; 1 — FAIL; 2 — ERROR; 3 — вызов; 4 — частичный.
import sys, os, json, shutil, importlib.util, hashlib, time
TOOLS = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(TOOLS)
a = sys.argv[1:]
def opt(n, d=None):
    if n in a:
        i = a.index(n)
        if i + 1 >= len(a): print('ОШИБКА ВЫЗОВА: %s без значения' % n); sys.exit(3)
        v = a[i + 1]; del a[i:i + 2]; return v
    return d
TK = os.path.abspath(opt('--testkit', os.environ.get('VOID_TESTKIT', os.path.join(os.path.dirname(ROOT), 'testkit_run', 'void-tests-1.5.35'))))
if not os.path.isfile(os.path.join(TK, 'tools6', 'accept6.py')): print('ОШИБКА ВЫЗОВА: нет тестового комплекта: %s (укажите --testkit)' % TK); sys.exit(3)
spec = importlib.util.spec_from_file_location('accept6', os.path.join(TK, 'tools6', 'accept6.py')); A6 = importlib.util.module_from_spec(spec)
sys.argv = [os.path.join(TK, 'tools6', 'accept6.py')]; spec.loader.exec_module(A6)
PY = sys.executable; DIST = os.path.join(ROOT, 'dist', 'void.html'); INV = json.load(open(os.path.join(ROOT, 'build', 'invariants.json'), encoding='utf8'))
sha = lambda p: hashlib.sha256(open(p, 'rb').read()).hexdigest()

def st_build8(c):
    st, det = A6.st_build(c)
    if st != 'PASS': return st, det
    chain = c.B; c.B = None
    if not os.path.isfile(DIST): return 'FAIL', dict(det, dist='нет dist/void.html — выполните build8 build')
    same = open(DIST, 'rb').read() == open(chain, 'rb').read()
    det.update({'dist/void.html SHA': sha(DIST)[:16], 'dist = итог цепочки 85–93 побайтно': same})
    if not same: return 'FAIL', det
    B = c.d('void_dist.html'); shutil.copy2(DIST, B); c.B = B   # дальше комплект проверяет модульную сборку
    det['проверяется'] = 'dist/void.html (копия в папке прогона)'
    return 'PASS', det

def b8(c, label, args, timeout=3600):
    return c.sh(label, [PY, os.path.join(TOOLS, 'build8.py')] + args, cwd=ROOT, timeout=timeout)

def st_b8check(c):
    c.need_B(); o = c.d('check.json'); rc = b8(c, 'check', ['check', '--json', o], timeout=3600)
    rows = c.J(o)
    if not isinstance(rows, list) or not rows: return 'ERROR', {'причина': 'check --json: неожиданный формат'}
    st = {r['check']: r['status'] for r in rows}
    dt = {r['check']: ('; '.join(map(str, r['detail'])) if isinstance(r.get('detail'), list) else str(r.get('detail', ''))) for r in rows}
    bad = {k: v for k, v in st.items() if v in ('FAIL', 'ERROR')}; known = {k for k, v in st.items() if v == 'KNOWN'}
    det = {'код': rc, 'статусы': st}
    if bad: return ('ERROR' if 'ERROR' in bad.values() else 'FAIL'), dict(det, нарушения={k: dt[k] for k in bad})
    if known == {'dangle'}:
        d = dt['dangle']; reg = INV.get('dangle_baseline', {})
        ok = ("незащищённых ['c66Fail', 'c66Tick']" in d and 'bg: удалено имён' in d and 'незащищённых нет' in d.split('bg:')[1]
              and 'cut.cine.live' in d and sorted(reg.get('cine', {})) == ['c66Fail', 'c66Tick'] and not reg.get('bg'))
        return ('KNOWN' if ok else 'FAIL'), dict(det, dangle=d, KNOWN='cut.cine.live: точное совпадение с build/invariants.json' if ok else 'отклонение dangle не совпадает с реестром')
    if known: return 'FAIL', dict(det, причина='KNOWN не из реестра: %s' % sorted(known))
    return 'PASS', det

def st_b8self(c):
    rc = b8(c, 'selftest', ['selftest'], timeout=5400); t = c.text('selftest')
    ok = rc == 0 and 'не поймано/сбой: 0' in t
    return ('PASS' if ok else 'FAIL'), {'код': rc, 'итог': [l for l in t.splitlines() if l.startswith('ИТОГ')][-1:]}

def st_variants8(c):
    c.need_B(); o = c.d('variants8.json')
    rc = c.sh('variants8', [PY, os.path.join(TOOLS, 'variants8.py'), '--testkit', TK, '--out', o, '--k'], cwd=ROOT, timeout=7200)
    rows = c.J(o); st = {r['вариант']: r['status'] for r in rows}
    want = {'полная': 'PASS', 'без cine': 'KNOWN', 'без bg': 'PASS', 'без cine+bg': 'KNOWN', 'K: без bg против полной': 'PASS'}
    det = {'код': rc, 'варианты': st}
    if any(v == 'ERROR' for v in st.values()): return 'ERROR', det
    if st == want: return 'KNOWN', dict(det, KNOWN='cut.cine.live в вариантах без cine; остальные PASS')
    if all(v == 'PASS' for v in st.values()) and set(st) == set(want): return 'FAIL', dict(det, причина='cut.cine.live не воспроизвёлся — проверьте, не изменён ли код (реестр не совпал)')
    return 'FAIL', det

def simple(name, script, args, timeout=3600):
    def f(c):
        c.need_B(); o = c.d(name + '.json')
        rc = c.sh(name, [PY, os.path.join(TOOLS, script)] + args + ['--json', o], cwd=ROOT, timeout=timeout)
        r = c.J(o); return (r['status'] if r.get('status') in ('PASS', 'FAIL', 'ERROR') else 'ERROR'), {'код': rc, 'итог': r.get('rows', r.get('проверено'))}
    return f

STEPS8 = [('b8check', 'stage8', st_b8check, 'build8 check: схема, файлы, кодировка, ресурсы, сборка, lock, dist, покрытие, порядок, стражи, синтаксис, инициализация, висячие ссылки, индексы'),
          ('b8self', 'stage8', st_b8self, 'build8 selftest: порча на копиях и случаи B1 (каждая обязана быть поймана)'),
          ('variants8', 'stage8', st_variants8, 'четыре варианта сборки в браузере + K без bg = полной (cut.cine.live → KNOWN)'),
          ('nav8', 'stage8', simple('nav8', 'navcheck8.py', ['--n', '200']), 'навигация: blame/where сверены с реальными строками src/, все границы частей'),
          ('rollback8', 'stage8', simple('rollback8', 'rollback8.py', []), 'обратимость: B1 → A → монолит → 1.5.24 → 1.5.35, искусственный патч, verify-html'),
          ('offline8', 'stage8', simple('offline8', 'offline8.py', []), 'автономность: file://, HTTP, без сети, телефон; запросы = 1.5.35')]
STEPS = []
for s in A6.STEPS:
    STEPS.append(('build', s[1], st_build8, s[3] + '; dist/void.html = итог цепочки, дальше проверяется dist') if s[0] == 'build' else s)
    if s[0] == 'build': STEPS += STEPS8

def selftest8():
    """Опровержение: испорченный dist обязан дать FAIL шага build, а без сборки остальные шаги — ERROR (не PASS)."""
    import tempfile, io, contextlib
    global DIST
    tmp = tempfile.mkdtemp(prefix='accept8_self_'); ok = True
    try:
        bad = os.path.join(tmp, 'void.html'); b = bytearray(open(DIST, 'rb').read()); b[len(b) // 3] ^= 1; open(bad, 'wb').write(bytes(b))
        keep = DIST; DIST = bad; run = os.path.join(tmp, 'run'); os.makedirs(run)
        with contextlib.redirect_stdout(io.StringIO()): code = A6.execute([s for s in STEPS if s[0] in ('build', 'b8check')], run, {}, False)
        DIST = keep
        got = {r['step']: r['status'] for r in json.load(open(os.path.join(run, 'accept.json')))['steps']}
        good = got == {'build': 'FAIL', 'b8check': 'ERROR'} and code == 2; ok &= good
        print(('ok   ' if good else 'FAIL ') + 'испорченный dist → build FAIL, остальные ERROR: %s, код %d' % (got, code))
    finally: shutil.rmtree(tmp, ignore_errors=True)
    r = A6.selftest(); ok &= r == 0
    print('САМОПРОВЕРКА accept8:', 'пройдена' if ok else 'НЕ ПРОЙДЕНА'); return 0 if ok else 1

def main():
    if '--selftest' in a: return selftest8()
    if '--list' in a:
        for n, g, _, d in STEPS: print('%-10s [%s] %s' % (n, g, d))
        return 0
    out = opt('--out'); steps = opt('--steps'); groups = opt('--group'); kg = '--keep-going' in a
    if kg: a.remove('--keep-going')
    if a: print('ОШИБКА ВЫЗОВА: неизвестные аргументы: %s' % ' '.join(a)); return 3
    names = [s[0] for s in STEPS]; gn = {s[1] for s in STEPS}
    if steps is not None:
        sel = [x for x in steps.split(',') if x]; unk = [x for x in sel if x not in names]
        if not sel or unk: print('ОШИБКА ВЫЗОВА: неизвестные шаги: %s' % unk); return 3
        S = [s for s in STEPS if s[0] in sel]
    elif groups is not None:
        sel = [x for x in groups.split(',') if x]; unk = [x for x in sel if x not in gn]
        if not sel or unk: print('ОШИБКА ВЫЗОВА: неизвестные группы: %s' % unk); return 3
        S = [s for s in STEPS if s[1] in sel]
    else: S = list(STEPS)
    full = len(S) == len(STEPS)
    if not any(s[0] == 'build' for s in S): S = [s for s in STEPS if s[0] == 'build'] + S
    run = os.path.abspath(out or os.path.join(os.path.dirname(ROOT), 'accept8_runs', time.strftime('%Y%m%d-%H%M%S')))
    if os.path.exists(run) and os.listdir(run): print('ОШИБКА ВЫЗОВА: папка прогона не пуста: ' + run); return 3
    os.makedirs(run, exist_ok=True)
    known = json.load(open(os.path.join(TK, 'ref6', 'known6.json'), encoding='utf8'))
    code = A6.execute(S, run, known, full, kg)
    p = os.path.join(run, 'ИТОГ.txt')
    if os.path.exists(p):
        t = open(p, encoding='utf8').read().replace('ИТОГ ПРИЁМКИ 1.5.35 (корректирующее обновление)', 'ИТОГ ПРИЁМКИ ЭТАПА 8 · модульная сборка dist/void.html (accept8 поверх accept6)', 1)
        t = t.replace('KNOWN — найденное отклонение точно совпало с записью ref6/known6.json (не PASS).', 'KNOWN — найденное отклонение точно совпало с реестром (ref6/known6.json; для stage8 — build/invariants.json: cut.cine.live). KNOWN ≠ PASS.')
        open(p, 'w', encoding='utf8').write(t)
    return code
if __name__ == '__main__': sys.exit(main())
