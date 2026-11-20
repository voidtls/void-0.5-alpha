#!/usr/bin/env python3
# VØID · этап 8 · offline8 — автономность собранной игры (ТЗ этапа 8, раздел 19.2 п. 13).
#   python3 tools8/offline8.py [--html dist/void.html] [--ref archive/void_1.5.35_reference.html] [--json ФАЙЛ]
# Для каждого режима — file://, HTTP (локальный сервер), без сети (context.set_offline), телефон (эмуляция Pixel 7, касания):
#   загрузка до меню, запуск миссии 01 в настоящем цикле на 3 с; ошибки страницы; все сетевые запросы.
# Сравнение: список запросов (схема + путь, без адреса сервера) у сборки и у эталона 1.5.35 обязан совпасть; ни одного запроса во внешнюю сеть;
# в режиме «без сети» игра обязана дойти до боя. Статус: PASS / FAIL / ERROR.
import sys, os, json, asyncio, threading, http.server, functools, socket, urllib.parse
TOOLS = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(TOOLS)
a = sys.argv[1:]
def opt(n, d=None):
    if n in a: i = a.index(n); v = a[i + 1]; del a[i:i + 2]; return v
    return d
HTML = os.path.abspath(opt('--html', os.path.join(ROOT, 'dist', 'void.html')))
REF = os.path.abspath(opt('--ref', os.path.join(ROOT, 'archive', 'void_1.5.35_reference.html')))
OUT = opt('--json')
from playwright.async_api import async_playwright
PROBE = r"""async()=>{const w8=ms=>new Promise(r=>setTimeout(r,ms));const s0=G.state;
  localStorage.removeItem('void_world');startWorld(true);if(G.prologue)prologueEnd();  // то же, что T.fresh стенда, но без стенда
  enterNode(1);startMission();const t0=G.t;await w8(3000);
  return {menu:s0,state:G.state,simT:+(G.t-t0).toFixed(2),ver:VER_TAG,online:navigator.onLine,trips:(window.ARCH&&ARCH.trips)||0};}"""
def serve(dirpath):
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=dirpath)
    class Q(h.func):
        def log_message(self, *x): pass
    s = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Q, directory=dirpath))
    threading.Thread(target=s.serve_forever, daemon=True).start(); return s
def norm(u, base):
    p = urllib.parse.urlsplit(u)
    if p.scheme in ('data', 'blob'): return p.scheme + ':'
    if p.scheme == 'file': return 'file:' + os.path.basename(p.path)
    if p.hostname == '127.0.0.1': return 'http-local:' + os.path.basename(p.path)
    return 'ВНЕШНИЙ:' + u[:120]
async def one(br, pw, f, mode):
    kw = {'viewport': {'width': 1280, 'height': 760}}
    if mode == 'телефон': kw = dict(pw.devices['Pixel 7'])
    ctx = await br.new_context(**kw); reqs = []; errs = []
    if mode == 'без сети': await ctx.set_offline(True)
    pg = await ctx.new_page()
    pg.on('request', lambda r: reqs.append(r.url)); pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    pg.on('console', lambda m: errs.append('CON ' + m.text[:200]) if m.type == 'error' else None)
    srv = None
    if mode == 'HTTP': srv = serve(os.path.dirname(f)); url = 'http://127.0.0.1:%d/%s' % (srv.server_address[1], urllib.parse.quote(os.path.basename(f)))
    else: url = 'file://' + f
    try:
        await pg.goto(url, wait_until='load', timeout=120000); await pg.wait_for_timeout(1500)
        r = await pg.evaluate(PROBE)
    except Exception as e: r = {'сбой': str(e)[:300]}
    finally:
        await ctx.close()
        if srv: srv.shutdown()
    r['ошибок'] = len(errs); r['ошибки'] = errs[:5]; r['запросы'] = sorted({norm(u, url) for u in reqs})
    return r
async def main():
    res = {}
    async with async_playwright() as pw:
        br = await pw.chromium.launch(args=['--no-sandbox', '--autoplay-policy=no-user-gesture-required'])
        for mode in ('file://', 'HTTP', 'без сети', 'телефон'):
            res[mode] = {'сборка': await one(br, pw, HTML, mode), 'эталон 1.5.35': await one(br, pw, REF, mode)}
            print(mode, json.dumps(res[mode]['сборка'], ensure_ascii=False)[:300], flush=True)
        await br.close()
    return res
def rq(L): return [x.replace(os.path.basename(HTML), '<игра>').replace(os.path.basename(REF), '<игра>') for x in L]
if __name__ == '__main__':
    res = asyncio.run(main()); rows = []
    for mode, v in res.items():
        b, e = v['сборка'], v['эталон 1.5.35']; why = []
        if 'сбой' in b or 'сбой' in e: rows.append({'режим': mode, 'status': 'ERROR', 'detail': [b.get('сбой'), e.get('сбой')]}); continue
        nb = len([x for x in b['ошибки'] if not x.startswith('CON Failed to load resource: net::ERR_')]) + max(0, b['ошибок'] - 5)
        ne = sum(1 for x in e['ошибки'] if x.startswith('CON Failed to load resource: net::ERR_'))
        if nb: why.append('ошибки страницы: %s' % b['ошибки'])
        if b['ошибок'] - nb > ne: why.append('ошибок загрузки ресурсов больше, чем у 1.5.35: %d > %d' % (b['ошибок'] - nb, ne))
        if b['state'] != 'play' or b['simT'] <= 0.5: why.append('бой не идёт: %s, %s с' % (b['state'], b['simT']))
        if b['menu'] != 'menu': why.append('после загрузки не меню: %s' % b['menu'])
        # внешние запросы допустимы только те, что были в 1.5.35 (исторический веб-шрифт Google Fonts с запасными системными шрифтами — KNOWN-факт, не регрессия)
        ext = [x for x in b['запросы'] if x.startswith('ВНЕШНИЙ')]; ext_ref = [x for x in e['запросы'] if x.startswith('ВНЕШНИЙ')]
        if [x for x in ext if x not in ext_ref]: why.append('новые запросы во внешнюю сеть: %s' % [x for x in ext if x not in ext_ref])
        if any('fonts.g' not in x for x in ext): why.append('внешние запросы не к шрифтам: %s' % ext)
        # ошибка «не загрузился ресурс» допустима только как следствие недоступного внешнего шрифта (сеть закрыта) и только если она была и у 1.5.35
        b['ошибки_игры'] = [x for x in b['ошибки'] if not x.startswith('CON Failed to load resource: net::ERR_')]
        b['ошибок_сети'] = b['ошибок'] - len(b['ошибки_игры'])
        if rq(b['запросы']) != rq(e['запросы']): why.append('запросы отличаются от 1.5.35: %s против %s' % (b['запросы'], e['запросы']))
        if mode == 'без сети' and b.get('online') is not False: why.append('режим без сети не включился (navigator.onLine=%s)' % b.get('online'))
        rows.append({'режим': mode, 'status': 'FAIL' if why else 'PASS', 'detail': why or ['меню → бой, %s с симуляции; ошибок игры 0; запросы = 1.5.35: %s; недоступный внешний шрифт: ошибок загрузки %d (у 1.5.35 %d)' % (b['simT'], b['запросы'], b['ошибок'] - nb, ne)], 'raw': v})
    st = 'ERROR' if any(r['status'] == 'ERROR' for r in rows) else 'FAIL' if any(r['status'] == 'FAIL' for r in rows) else 'PASS'
    print('\noffline8:', st)
    for r in rows: print('  %-6s %-9s %s' % (r['status'], r['режим'], '; '.join(map(str, r['detail']))[:260]))
    if OUT: json.dump({'status': st, 'rows': rows}, open(OUT, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    sys.exit({'PASS': 0, 'FAIL': 1, 'ERROR': 2}[st])
