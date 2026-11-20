#!/usr/bin/env python3
# VØID · этап 8 · abab8 — классификация нового FAIL по ТЗ этапа 8, раздел 12.5.
#   python3 tools8/abab8.py --testkit ПАПКА --out ПАПКА [--n 10] q180:D04 [q96:E05 …]
# A = эталон 1.5.35 (archive/), B = кандидат dist/void.html. Каждый тест N раз поочерёдно A, B (run6 investigate комплекта, одиночно, без параллельной нагрузки).
# Точный двусторонний тест Фишера по долям падений + сравнение журналов (порядок строк OK/FAIL набора).
# Вердикт: «историческая нестабильность» (p ≥ 0,05; статус в итоге остаётся FAIL) или «новая регрессия» (p < 0,05 — зависимые шаги останавливаются).
# Статистика одна не доказывает эквивалентность (разрешение владельца): в вердикт входят ещё SHA сборок и сравнение журналов.
import sys, os, json, subprocess, re, hashlib
from math import comb
TOOLS = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(TOOLS)
a = sys.argv[1:]
def opt(n, d=None):
    if n in a: i = a.index(n); v = a[i + 1]; del a[i:i + 2]; return v
    return d
TK = os.path.abspath(opt('--testkit', os.path.join(os.path.dirname(ROOT), 'testkit_run', 'void-tests-1.5.35'))); OUT = os.path.abspath(opt('--out')); N = int(opt('--n', '10'))
A = os.path.join(ROOT, 'archive', 'void_1.5.35_reference.html'); B = os.path.join(ROOT, 'dist', 'void.html')
H = lambda p: hashlib.sha256(open(p, 'rb').read()).hexdigest()
def fisher(a1, b1, a2, b2):
    """Точный двусторонний тест Фишера для таблицы [[a1,b1],[a2,b2]] (сумма вероятностей таблиц не вероятнее наблюдаемой)."""
    r1, r2, c1, n = a1 + b1, a2 + b2, a1 + a2, a1 + b1 + a2 + b2
    p = lambda x: comb(r1, x) * comb(r2, c1 - x) / comb(n, c1)
    p0 = p(a1); lo, hi = max(0, c1 - r2), min(r1, c1)
    return min(1.0, sum(p(x) for x in range(lo, hi + 1) if p(x) <= p0 * (1 + 1e-9)))
r = subprocess.run([sys.executable, os.path.join(TK, 'tools6', 'run6.py'), 'investigate', A, B, OUT, str(N)] + a, cwd=TK, capture_output=True, text=True)
J = json.load(open(os.path.join(OUT, 'run.json'), encoding='utf8'))
res = {'A': A, 'B': B, 'shaA': H(A), 'shaB': H(B), 'побайтно равны': H(A) == H(B), 'повторов': N, 'тесты': {}}
for k, v in J['tally'].items():
    fa, oa, fb, ob = v['A']['FAIL'], v['A']['OK'], v['B']['FAIL'], v['B']['OK']
    na, nb = v['A']['NONE'], v['B']['NONE']
    p = fisher(fa, oa, fb, ob)
    q, c = k.split(':')
    def seq(tag):   # порядок строк результата набора в журналах (без чисел и времени)
        out = []
        for i in range(N):
            f = os.path.join(OUT, '%s_%s_%s_%d.log' % (q, c, tag, i))
            out.append(tuple(re.sub(r'\d+(\.\d+)?', '#', l.strip())[:60] for l in open(f, encoding='utf8', errors='replace') if re.match(r'^\s*(OK|FAIL)\s', l)))
        return sorted(set(out))
    same_logs = seq('A') == seq('B')
    verdict = ('ERROR: тест не дал результата в %d/%d запусках' % (na + nb, 2 * N)) if na + nb else \
              ('новая регрессия' if p < 0.05 else 'историческая нестабильность (остаётся FAIL)' if fa + fb else 'не воспроизводится (остаётся FAIL исходного прогона)')
    res['тесты'][k] = {'A 1.5.35': v['A'], 'B dist': v['B'], 'p Фишера': round(p, 4), 'одинаковые варианты журналов A и B': same_logs, 'вердикт': verdict}
json.dump(res, open(os.path.join(OUT, 'abab8.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(json.dumps(res, ensure_ascii=False, indent=1))
sys.exit(1 if any(t['вердикт'] == 'новая регрессия' for t in res['тесты'].values()) else 2 if any(t['вердикт'].startswith('ERROR') for t in res['тесты'].values()) else 0)
