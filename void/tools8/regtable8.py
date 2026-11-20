#!/usr/bin/env python3
# Таблица регрессии «запущено / PASS / FAIL» по наборам и сравнение двух прогонов reg (ТЗ 17.7).
#   python3 tools8/regtable8.py <папка reg прогона 1> <папка reg прогона 2> [--md ФАЙЛ]
import sys, os, re, json
def parse(d):
    out = {}
    for f in sorted(os.listdir(d)):
        m = re.match(r'(q\w+)\.log$', f)
        if not m: continue
        t = open(os.path.join(d, f), encoding='utf8', errors='replace').read()
        ok = re.findall(r'^\s*OK\s+(\S+)', t, re.M); fail = re.findall(r'^\s*FAIL\s+(\S+)', t, re.M)
        out[m.group(1)] = {'run': len(ok) + len(fail), 'ok': len(ok), 'fail': sorted(fail)}
    return out
a = sys.argv[1:]; md = a[a.index('--md') + 1] if '--md' in a else None
A, B = parse(a[0]), parse(a[1])
key = lambda s: (int(re.sub(r'\D', '', s) or 0), s)
rows = ['| Набор | приёмка № 2: запущено / PASS / FAIL | этап 8: запущено / PASS / FAIL | FAIL только в № 2 | FAIL только в этапе 8 |', '|---|---|---|---|---|']
tot = [0] * 6; diff = []
for s in sorted(set(A) | set(B), key=key):
    x, y = A.get(s, {'run': 0, 'ok': 0, 'fail': []}), B.get(s, {'run': 0, 'ok': 0, 'fail': []})
    only2 = sorted(set(x['fail']) - set(y['fail'])); only8 = sorted(set(y['fail']) - set(x['fail']))
    if only2 or only8 or x['run'] != y['run']: diff.append([s, only2, only8, x['run'], y['run']])
    for i, v in enumerate((x['run'], x['ok'], len(x['fail']), y['run'], y['ok'], len(y['fail']))): tot[i] += v
    rows.append('| %s | %d / %d / %d | %d / %d / %d | %s | %s |' % (s, x['run'], x['ok'], len(x['fail']), y['run'], y['ok'], len(y['fail']), ', '.join(only2) or '—', ', '.join(only8) or '—'))
rows.append('| **всего** | %d / %d / %d | %d / %d / %d | | |' % tuple(tot))
txt = '\n'.join(rows) + '\n'
print(txt); print('расхождения:', json.dumps(diff, ensure_ascii=False))
if md: open(md, 'w', encoding='utf8').write(txt + '\nРасхождения (набор, FAIL только в № 2, FAIL только в этапе 8, запущено № 2, запущено этап 8): ' + json.dumps(diff, ensure_ascii=False) + '\n')
