#!/usr/bin/env python3
# VØID · этап 8 · variants8 — варианты сборки без необязательных групп в браузере (Chromium через Playwright из тестового комплекта).
#   python3 tools8/variants8.py [--testkit ПАПКА] [--out ФАЙЛ.json] [--k]
# Для каждого варианта (полная, без cine, без bg, без cine+bg):
#   стенд  — rAF подменён (как в наборах kit): ошибки загрузки, вызовы Math.random при перестройке неба (обязано 0), наличие C66/BG67, бой 20 с через T.bot;
#   живой  — настоящий rAF: миссия 01, 4 с реального времени: ошибки страницы, состояние, срабатывания защиты ARCH·69.
# Полная сборка дополнительно: все 57 аудиоблоков декодируются в браузере (atob) и длина = декодированной в Python.
# --k: K-стенд, каждое 6-е задание jobs_k80 (72): вариант без bg против полной сборки — совпадение отпечатков, ГСЧ, снимков.
# Ожидания (ТЗ 6.3, 17.3; разрешение владельца п. 4): без bg — ни одной ошибки; без cine — только зарегистрированный cut.cine.live
# (ReferenceError c66Tick/c66Fail в step74) → KNOWN, любая другая ошибка → FAIL; защита неба — 0 вызовов во всех вариантах.
import sys, os, json, asyncio, subprocess, tempfile, base64, re, shutil
TOOLS = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(TOOLS)
a = sys.argv[1:]
def opt(n, d=None):
    if n in a: i = a.index(n); v = a[i + 1]; del a[i:i + 2]; return v
    return d
TK = os.path.abspath(opt('--testkit', os.environ.get('VOID_TESTKIT', os.path.join(os.path.dirname(ROOT), 'testkit_run', 'void-tests-1.5.35'))))
OUT = opt('--out', os.path.join(ROOT, 'results', 'variants8.json')); DOK = '--k' in a
for p in ('tools5', 'kit'): sys.path.insert(0, os.path.join(TK, p))
import st5, h
from playwright.async_api import async_playwright
KNOWN_RX = re.compile(r'(c66Fail|c66Tick) is not defined\s+at step74 ')  # только зарегистрированное место: step74
BOOT = r"""async()=>{const w8=ms=>new Promise(r=>setTimeout(r,ms));const mr=Math.random;let n=0;Math.random=function(){n++;return mr.apply(this,arguments);};
 let e1=null;try{buildNebula();buildStars();}catch(e){e1=String(e);}Math.random=mr;
 T.fresh();enterNode(1);startMission();await w8(600);const k=T.bot({maxSec:20});
 return {skyRand:n,skyErr:e1,C66:typeof C66,BG67:typeof BG67,state:G.state,bot:k&&k.state,ver:VER_TAG};}"""
LIVE = r"""async()=>{const w8=ms=>new Promise(r=>setTimeout(r,ms));T.fresh();enterNode(1);startMission();const t0=G.t;await w8(4000);
 return {state:G.state,simT:+(G.t-t0).toFixed(2),trips:ARCH.trips,c66s:ARCH.c66s};}"""
AUDIO = r"""(ids)=>ids.map(id=>{const el=document.getElementById(id);if(!el)return [id,-1];try{return [id,atob(el.textContent.trim()).length];}catch(e){return [id,-2];}})"""
VARS = [('полная', ''), ('без cine', 'cine'), ('без bg', 'bg'), ('без cine+bg', 'cine,bg')]

def build(tmp, w):
    o = os.path.join(tmp, 'v_%s.html' % (w.replace(',', '_') or 'full'))
    r = subprocess.run([sys.executable, os.path.join(TOOLS, 'build8.py'), 'build', '--out', o] + (['--without', w] if w else []), capture_output=True, text=True)
    if r.returncode: raise SystemExit('build8: ' + r.stdout + r.stderr)
    return o

async def run_all(files):
    man = json.load(open(os.path.join(ROOT, 'build', 'manifest.json'), encoding='utf8'))
    want = {x['asset']: len(base64.b64decode(open(os.path.join(ROOT, 'src', x['path']), 'rb').read())) for x in man['parts'] if x['kind'] == 'octet'}
    res = {}
    async with async_playwright() as pw:
        br = await pw.chromium.launch(executable_path=st5.CHROME, args=['--no-sandbox']) if st5.CHROME else await pw.chromium.launch(args=['--no-sandbox'])
        for name, w in VARS:
            f = files[w]; r = {'without': w or None}
            ctx, pg, errs = await st5.page(br, f, 1280, 760); await pg.wait_for_timeout(300)
            try: r['стенд'] = await pg.evaluate(BOOT)
            except Exception as e: r['стенд'] = {'сбой': str(e)[:300]}
            r['стенд']['ошибки'] = list(errs)[:5]; r['стенд']['ошибок'] = len(errs)  # стенд обязан быть без ошибок во всех вариантах
            if not w:
                got = dict(await pg.evaluate(AUDIO, sorted(want)))
                r['аудио'] = {'блоков': len(want), 'совпало': sum(1 for k in want if got.get(k) == want[k]), 'расхождения': [k for k in want if got.get(k) != want[k]][:5]}
            await ctx.close()
            P = await h.newpage(br, 1280, 760, url='file://' + os.path.abspath(f), init=st5.init_js().replace('window.requestAnimationFrame=()=>0;', ''))
            await P.pg.wait_for_timeout(1200)
            try: r['живой'] = await P.pg.evaluate(LIVE)
            except Exception as e: r['живой'] = {'сбой': str(e)[:300]}
            r['живой']['ошибок'] = len(P.errs); r['живой']['ошибки'] = list(P.errs)[:3]
            r['живой']['чужих'] = [e[:200] for e in P.errs if not KNOWN_RX.search(e)][:5]; r['живой']['чужих_n'] = sum(1 for e in P.errs if not KNOWN_RX.search(e))
            # все ошибки, сведённые к первой строке и месту (без путей и номеров колонок): текст → сколько раз
            u = {}
            for e in P.errs:
                k_ = re.sub(r'file://\S+?/v_[\w]+\.html:(\d+):\d+', r'void.html:\1', ' '.join(e.split('\n')[:2]))[:200]; u[k_] = u.get(k_, 0) + 1
            r['живой']['все_ошибки'] = u
            await P.pg.context.close(); res[name] = r
            print(name, json.dumps(r, ensure_ascii=False)[:500], flush=True)
        await br.close()
    return res

def judge(name, w, r):
    s, l = r.get('стенд', {}), r.get('живой', {}); why = []
    if 'сбой' in s or 'сбой' in l: return 'ERROR', ['сбой стенда: %s %s' % (s.get('сбой'), l.get('сбой'))]
    if s.get('skyRand') != 0: why.append('небо: %s вызовов Math.random (обязано 0)' % s.get('skyRand'))
    if s.get('ошибок'): why.append('ошибки загрузки в стенде: %s' % s.get('ошибки'))
    cine_cut = 'cine' in w.split(','); bg_cut = 'bg' in w.split(',')
    if (s.get('C66') == 'undefined') != cine_cut: why.append('C66: %s' % s.get('C66'))
    if (s.get('BG67') == 'undefined') != bg_cut: why.append('BG67: %s' % s.get('BG67'))
    if 'аудио' in r and r['аудио']['совпало'] != r['аудио']['блоков']: why.append('аудио: %s' % r['аудио'])
    if s.get('state') not in ('play', 'levelup', 'win', 'brief') and s.get('bot') is None: why.append('стенд: бой не идёт (%s)' % s.get('state'))
    errs = l.get('ошибки', []); n = l.get('ошибок', 0)
    if why: return 'FAIL', why
    if not cine_cut:
        if n or l.get('state') != 'play' or l.get('trips'): return 'FAIL', ['живой цикл: ошибок %d, состояние %s, срабатываний защиты %s' % (n, l.get('state'), l.get('trips'))]
        return 'PASS', ['живой цикл: 0 ошибок, %s с симуляции' % l.get('simT')]
    if n == 0: return 'PASS', ['живой цикл: 0 ошибок — известный cut.cine.live не воспроизвёлся (проверьте, не исправлен ли он)']
    if l.get('чужих_n', 1) == 0 and n >= 1:  # проверяются ВСЕ ошибки, не только первые три
        return 'KNOWN', ['cut.cine.live: %d ошибок «c66Fail/c66Tick is not defined» в step74, других нет; состояние %s, защита ARCH·69: %s' % (n, l.get('state'), l.get('trips'))]
    return 'FAIL', ['живой цикл: новые ошибки (%s): %s' % (l.get('чужих_n'), l.get('чужих'))]

def kcheck(tmp, full, nobg):
    jobs = json.load(open(os.path.join(TK, 'kit', 't72', 'jobs_k80.json'), encoding='utf8'))[::6]
    jf = os.path.join(tmp, 'jobs.json'); json.dump(jobs, open(jf, 'w'))
    outs = {}
    for k, f in (('full', full), ('nobg', nobg)):
        o = os.path.join(tmp, 'k_%s.jsonl' % k)
        subprocess.run([sys.executable, os.path.join(TK, 'tools6', 'run6.py'), 'k', f, jf, o, '--par', '2'], cwd=TK, capture_output=True, timeout=7200)
        outs[k] = {r['id']: r for r in map(json.loads, open(o))} if os.path.exists(o) else {}
    A, B = outs['full'], outs['nobg']; skip = {'wall', 'realT', 'ip'}   # только время стенда; ошибки (errs) сравниваются, имена файлов сборок нормализуются
    norm = lambda v: json.loads(re.sub(r'v_(full|bg)\.html', 'v.html', json.dumps(v, ensure_ascii=False)))
    A = {k: norm(v) for k, v in A.items()}; B = {k: norm(v) for k, v in B.items()}
    if len(A) != len(jobs) or len(B) != len(jobs): return 'ERROR', ['K: заданий %d / %d из %d' % (len(A), len(B), len(jobs))]
    diff = [k for k in A if any(A[k].get(f) != B[k].get(f) for f in A[k] if f not in skip)]
    return ('PASS' if not diff else 'FAIL'), ['K-подмножество %d заданий: без bg = полной по отпечаткам, ГСЧ (%d вызовов), снимкам; расхождений %d %s' % (len(jobs), sum(A[k]['rng'] for k in A), len(diff), diff[:5])]

def judge_selftest():
    """Опровержение судьи: синтетические результаты, которые обязаны дать FAIL/ERROR, и эталонные — PASS/KNOWN."""
    ok = {'skyRand': 0, 'C66': 'object', 'BG67': 'object', 'state': 'play', 'bot': 'play', 'ошибок': 0, 'ошибки': []}
    K = 'CON ReferenceError: c66Fail is not defined\n    at step74 (f.html:1:1)'
    cut = dict(ok, C66='undefined')
    L = lambda **k: dict({'state': 'play', 'simT': 4, 'trips': 0, 'ошибок': 0, 'ошибки': [], 'чужих': [], 'чужих_n': 0}, **k)
    cases = [('полная ок', '', {'стенд': ok, 'живой': L()}, 'PASS'),
             ('небо 1 вызов', 'bg', {'стенд': dict(ok, skyRand=1, BG67='undefined'), 'живой': L()}, 'FAIL'),
             ('bg остался', 'bg', {'стенд': ok, 'живой': L()}, 'FAIL'),
             ('без bg ошибка', 'bg', {'стенд': dict(ok, BG67='undefined'), 'живой': L(ошибок=1, ошибки=['x'])}, 'FAIL'),
             ('cine известная', 'cine', {'стенд': cut, 'живой': L(state='pause', trips=1, ошибок=30, ошибки=[K] * 3)}, 'KNOWN'),
             ('cine 29 известных + 1 чужая (не в первых трёх)', 'cine', {'стенд': cut, 'живой': L(ошибок=30, ошибки=[K] * 3, чужих=['TypeError'], чужих_n=1)}, 'FAIL'),
             ('стенд упал', 'cine', {'стенд': {'сбой': 'x'}, 'живой': L()}, 'ERROR'),
             ('аудио 56/57', '', {'стенд': ok, 'живой': L(), 'аудио': {'блоков': 57, 'совпало': 56}}, 'FAIL'),
             ('защита сработала в полной', '', {'стенд': ok, 'живой': L(trips=1)}, 'FAIL')]
    bad = [(n, want, judge(n, w, r)[0]) for n, w, r, want in cases if judge(n, w, r)[0] != want]
    print('judge selftest: %d/%d' % (len(cases) - len(bad), len(cases)), bad); return 1 if bad else 0

if __name__ == '__main__':
    if '--selftest' in a: sys.exit(judge_selftest())
    tmp = tempfile.mkdtemp(prefix='var8_')
    try:
        files = {w: build(tmp, w) for _, w in VARS}
        res = asyncio.run(run_all(files)); rows = []
        for name, w in VARS:
            st, why = judge(name, w, res[name]); rows.append({'вариант': name, 'status': st, 'detail': why, 'raw': res[name]})
        if DOK:
            st, why = kcheck(tmp, files[''], files['bg']); rows.append({'вариант': 'K: без bg против полной', 'status': st, 'detail': why})
        os.makedirs(os.path.dirname(os.path.abspath(OUT)), exist_ok=True)
        json.dump(rows, open(OUT, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
        print('\nvariants8:')
        for r in rows: print('  %-6s %-22s %s' % (r['status'], r['вариант'], '; '.join(r['detail'])[:300]))
        sts = {r['status'] for r in rows}
        sys.exit(2 if 'ERROR' in sts else 1 if 'FAIL' in sts else 0)
    finally: shutil.rmtree(tmp, ignore_errors=True)
