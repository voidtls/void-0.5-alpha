#!/usr/bin/env python3
# VØID · этап 8 · perf8 — производительность сборки по ТЗ этапа 8, раздел 12.7 (дополняет шаги perf/fps полной приёмки).
#   python3 tools8/perf8.py [--n 10] [--json ФАЙЛ]
# Измеряет: размер HTML; время build8 build (10 раз); время загрузки до первого кадра (первый вызов колбэка requestAnimationFrame
# после загрузки скрипта игры) и до события load — A/B (эталон 1.5.35 ↔ dist) и A/A (эталон ↔ его копия), повторы чередуются ABAB.
# Критерий: разница медиан A/B не выходит за полосу A/A (максимум |разницы медиан| A/A по двум независимым сериям и разброс серий).
import sys, os, json, time, asyncio, statistics, subprocess, shutil, tempfile, hashlib
TOOLS = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(TOOLS)
a = sys.argv[1:]
def opt(n, d=None):
    if n in a: i = a.index(n); v = a[i + 1]; del a[i:i + 2]; return v
    return d
N = int(opt('--n', '10')); OUT = opt('--json')
DIST = os.path.join(ROOT, 'dist', 'void.html'); REF = os.path.join(ROOT, 'archive', 'void_1.5.35_reference.html')
from playwright.async_api import async_playwright
INIT = """(()=>{const t0=performance.now();let done=false;const R=window.requestAnimationFrame.bind(window);
 window.__p8={first:null};window.requestAnimationFrame=function(cb){return R(function(ts){if(!done&&typeof G!=='undefined'){done=true;window.__p8.first=performance.now();}return cb(ts);});};})();"""
async def load(br, f):
    ctx = await br.new_context(viewport={'width': 1280, 'height': 760}); await ctx.add_init_script(INIT)
    await ctx.route('**/*', lambda r: r.abort() if not r.request.url.startswith('file:') else r.continue_())   # без сети: одинаково для A и B
    pg = await ctx.new_page(); await pg.goto('file://' + f, wait_until='load', timeout=120000)
    for _ in range(100):
        v = await pg.evaluate('()=>({first:window.__p8.first,load:performance.getEntriesByType("navigation")[0].loadEventStart})')
        if v['first']: break
        await pg.wait_for_timeout(50)
    await ctx.close(); return v
async def series(pairs):
    res = {k: {'first': [], 'load': []} for k in ('A', 'B', 'A2')}
    async with async_playwright() as pw:
        br = await pw.chromium.launch(args=['--no-sandbox'])
        await load(br, REF)   # прогрев
        for i in range(N):
            for k, f in pairs if i % 2 == 0 else list(reversed(pairs)):
                v = await load(br, f); res[k]['first'].append(round(v['first'], 1)); res[k]['load'].append(round(v['load'], 1))
        await br.close()
    return res
if __name__ == '__main__':
    tmp = tempfile.mkdtemp(prefix='perf8_'); ref2 = os.path.join(tmp, 'void_copy.html'); shutil.copy2(REF, ref2)
    try:
        bt = []
        for _ in range(10):
            t = time.perf_counter(); subprocess.run([sys.executable, os.path.join(TOOLS, 'build8.py'), 'build', '--out', os.path.join(tmp, 'b.html')], check=True, capture_output=True); bt.append(time.perf_counter() - t)
        same = open(DIST, 'rb').read() == open(REF, 'rb').read()
        R = asyncio.run(series([('A', REF), ('B', DIST), ('A2', ref2)]))
    finally: shutil.rmtree(tmp, ignore_errors=True)
    md = lambda L: statistics.median(L)
    out = {'размер HTML, байт': {'dist': os.path.getsize(DIST), 'эталон': os.path.getsize(REF)}, 'dist = эталон побайтно': same,
           'build8 build, с (процесс целиком, 10 раз)': {'медиана': round(md(bt), 3), 'макс': round(max(bt), 3)}, 'повторов': N, 'сырые, мс': R}
    rows = []
    for m in ('first', 'load'):
        A, B, A2 = R['A'][m], R['B'][m], R['A2'][m]
        ab = md(B) - md(A); aa = md(A2) - md(A)
        band = max(abs(aa), statistics.pstdev(A), statistics.pstdev(A2))
        ok = abs(ab) <= band * 1.5 + 1.0   # +1 мс — разрешение таймера страницы
        rows.append({'метрика': {'first': 'до первого кадра', 'load': 'до события load'}[m], 'A 1.5.35, медиана мс': md(A), 'B dist, медиана мс': md(B), 'A/A копия, медиана мс': md(A2),
                     'B−A, мс': round(ab, 1), 'A2−A, мс': round(aa, 1), 'полоса A/A, мс': round(band, 1), 'в пределах A/A': ok})
    out['сравнение'] = rows
    st = 'PASS' if same and all(r['в пределах A/A'] for r in rows) else 'FAIL'; out['status'] = st
    print(json.dumps({k: v for k, v in out.items() if k != 'сырые, мс'}, ensure_ascii=False, indent=1))
    if OUT: json.dump(out, open(OUT, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    sys.exit(0 if st == 'PASS' else 1)
