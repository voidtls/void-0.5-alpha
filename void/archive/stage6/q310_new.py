# 1.4.1 α «Пульт»: настройки по вкладкам с пояснениями, пауза со сводкой. L01–L13 падают на v37 (1.4.0).
import asyncio,json,sys,os
from h import *
TESTS=[]
def test(name):
    def d(f):TESTS.append((name,f));return f
    return d
W8="const w8=ms=>new Promise(r=>setTimeout(r,ms));"
OPEN=W8+"T.fresh();G.save.tut.off=1;$('#toast').hidden=true;await w8(250);pause();await w8(150);$('#bPauseSet').click();await w8(250);"
TAB="(k)=>document.querySelector(`#sSet button[data-tab63=\"${k}\"]`)"

@test('L01')
async def l01(b):
    P=await newpage(b,1280,800,alpha=False)
    r=await P.js("async()=>{"+OPEN+"const tab="+TAB+";const tabs=[...document.querySelectorAll('#sSet button[data-tab63]')].map(x=>x.dataset.tab63);if(tabs.length<5)return {tabs};const vis={};for(const k of tabs){tab(k).click();await w8(80);vis[k]=[...document.querySelectorAll('#setBody .tab63')].filter(g=>!g.hidden).map(g=>g.dataset.tab63);}"
        "tab('acc').click();await w8(80);closeSettings();await w8(150);$('#bPauseSet').click();await w8(250);const back=[...document.querySelectorAll('#setBody .tab63')].filter(g=>!g.hidden).map(g=>g.dataset.tab63);return {tabs,vis,back,saved:SET.setTab}}")
    ok=r.get('tabs')==['snd','ctl','scr','acc','game'] and all(v==[k] for k,v in r['vis'].items()) and r['back']==['acc'] and r['saved']=='acc'
    rec('L01 пять вкладок (звук · управление · экран · доступность · игра): видна ровно одна, выбранная вкладка помнится после выхода',ok,r)

@test('L02')
async def l02(b):
    out={}
    for (w,h,t) in [(1280,800,False),(390,844,True)]:
        P=await newpage(b,w,h,alpha=False,touch=t)
        out[w]=await P.js("async()=>{"+OPEN+"const rows=[...document.querySelectorAll('#setBody .srow63[data-n63]')].filter(r=>!['vol','svol','keys'].includes(r.dataset.n63));/* ползунки подписаны, раскладка — сама себе пояснение */const bare=rows.filter(r=>!(r.querySelector('.snote')&&r.querySelector('.snote').textContent.trim().length>8)).map(r=>r.dataset.n63);return {n:rows.length,bare}}")
    ok=all(o['n']>=8 and not o['bare'] for o in out.values())
    rec('L02 у каждой настройки есть пояснение одной строкой — на ПК и на телефоне',ok,out)

@test('L03')
async def l03(b):
    out={}
    for (w,h,t) in [(1280,800,False),(390,844,True)]:
        P=await newpage(b,w,h,alpha=False,touch=t)
        out[w]=await P.js("async()=>{"+OPEN+"return ['zoom','quality','fps'].map(k=>!!document.querySelector(`#setBody [data-seg=\"${k}\"]`))}")
    ok=out[1280]==[False,False,True] and out[390]==[True,True,True]  # 1.5.32 (ARCH·90b, решение владельца Р2): «Кадры» — и на ПК
    rec('L03 «Масштаб» и «Качество» работают только на телефоне — на ПК их нет; «Кадры» есть и на ПК, и на телефоне',ok,out)

@test('L04')
async def l04(b):
    P=await newpage(b,1280,800,alpha=False)
    r=await P.js("()=>({def:SET_DEF.sfx,now:SET.sfx,vol:SET.sfxVol,dv:SET_DEF.sfxVol})")
    rec('L04 у нового пилота звуки включены (громкость 70 %)',r['def'] is True and r['now'] is True and abs(r['vol']-.7)<1e-9,r)

@test('L05')
async def l05(b):
    P=await newpage(b,1280,800,alpha=False)
    r=await P.js("async()=>{"+OPEN+"const dis=n=>{const e=document.querySelector(`#setBody .srow63[data-n63=\"${n}\"]`);return e?e.classList.contains('dis63'):'none';};const a=[dis('vol'),dis('svol'),dis('shake')];"
        "document.querySelector('#setBody .tog[data-k=\"amb\"]').click();await w8(60);document.querySelector('#setBody .tog[data-k=\"sfx\"]').click();await w8(60);SET.fx=false;saveSet();renderSetScreen();await w8(60);const b=[dis('vol'),dis('svol'),dis('shake')];"
        "const lab=[...document.querySelectorAll('#setBody .srow63[data-n63=\"vol\"] label.vol span,#setBody .srow63[data-n63=\"svol\"] label.vol span')].map(s=>s.textContent);return {a,b,lab,amb:SET.amb,sfx:SET.sfx}}")
    ok=r['a']==[False,False,False] and r['b']==[True,True,True] and len(r['lab'])==2 and r['amb'] is False and r['sfx'] is False
    rec('L05 ползунок громкости и тряска гаснут с пояснением, когда их источник выключен; подписи ползунков на месте',ok,r)

@test('L06')
async def l06(b):
    P=await newpage(b,1280,800,alpha=False)
    r=await P.js("async()=>{"+OPEN+"document.querySelector('#sSet button[data-tab63=\"ctl\"]').click();await w8(60);const k=[...document.querySelectorAll('#setBody .kgrid63 kbd')].map(x=>x.textContent.trim());"
        "const auto=document.querySelector('#setBody [data-aim63=\"0\"]'),mouse=document.querySelector('#setBody [data-aim63=\"1\"]');if(!auto||!mouse)return {k,none:true};auto.click();await w8(60);const m1=SET.manual;document.querySelector('#setBody [data-aim63=\"1\"]').click();await w8(60);"
        "return {k:k.length,txt:k.join(' '),m1,m2:SET.manual,tog:!!document.querySelector('#setBody .tog[data-k=\"manual\"]')}}")
    ok=not r.get('none') and r['k']>=10 and 'Esc' in r['txt'].title() and r['m1'] is False and r['m2'] is True and not r['tog']
    rec('L06 ПК: прицел «Мышь / Авто» вместо непонятного тумблера, раскладка клавиш всегда в настройках',ok,r)

@test('L07')
async def l07(b):
    P=await newpage(b,1280,800,alpha=False)
    r=await P.js("async()=>{"+OPEN+"G.save.lom=777;G.save.cleared=3;SET.amb=false;SET.textScale=SET_OPT&&SET_OPT.textScale?SET_OPT.textScale[SET_OPT.textScale.length-1]:SET.textScale;SET.btnSize='big';SET.radio=false;saveSet();document.querySelector('#sSet button[data-tab63=\"game\"]').click();renderSetScreen();await w8(60);"
        "const q=()=>document.querySelector('#setBody [data-rset63]');q().click();await w8(60);const armed=!!document.querySelector('#setBody .arm63')||/ещё раз|ЕЩЁ РАЗ/.test(q().textContent);const mid=SET.amb;q().click();await w8(120);"
        "const diff=Object.keys(SET_DEF).filter(k=>!['fsHintShown','setTab'].includes(k)&&JSON.stringify(SET[k])!==JSON.stringify(SET_DEF[k]));return {armed,mid,diff,lom:G.save.lom,cl:G.save.cleared,tab:SET.setTab}}")
    ok=r['armed'] and r['mid'] is False and not r['diff'] and r['lom']==777 and r['cl']==3 and r['tab']=='game'
    rec('L07 «Вернуть стандартные» — по двойному нажатию, сбрасывает только настройки, прогресс не трогает',ok,r)

@test('L08')
async def l08(b):
    out={}
    P=await newpage(b,1280,800,alpha=False)
    out['world']=await P.js("async()=>{"+W8+"T.fresh();G.save.tut.off=1;G.save.lom=340;G.save.carry=25;await w8(250);pause();await w8(150);const I=$('#pzInfo');return I?{t:I.innerText,vis:I.offsetHeight>0}:null}")
    out['mission']=await P.js("async()=>{"+W8+"resume();T.go(5);await w8(400);pause();await w8(150);const I=$('#pzInfo');return I?{t:I.innerText,vis:I.offsetHeight>0}:null}")
    w,m=out['world'],out['mission']
    ok=bool(w and m) and w['vis'] and m['vis'] and 'МИССИИ' in w['t'] and '340' in w['t'] and '+25' in w['t'] and 'ЦЕЛЬ' in w['t'] and '05' in m['t'] and 'ВРЕМЯ' in m['t'] and 'МАСТЕРСТВО' in m['t'] and not P.errs
    rec('L08 пауза на ПК показывает сводку: в секторе — миссии, лом, цель; в миссии — номер, время, мастерство',ok,{**out,'pe':P.errs[:2]})

@test('L09')
async def l09(b):
    P=await newpage(b,1280,800,alpha=False)
    r=await P.js("async()=>{"+W8+"T.fresh();G.save.tut.off=1;await w8(250);pause();await w8(150);const q=k=>document.querySelector(`#pzQuick [data-q63=\"${k}\"]`);if(!q('amb'))return {none:true};const a0=SET.amb,s0=SET.sfx;q('amb').click();await w8(60);q('sfx').click();await w8(60);"
        "let st=JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>/set/i.test(k)))||'{}');return {a0,s0,a1:SET.amb,s1:SET.sfx,lab:q('amb').textContent,stA:st.amb,state:G.state}}")
    ok=not r.get('none') and r['a1']==(not r['a0']) and r['s1']==(not r['s0']) and ('ВЫКЛ' in r['lab'] if not r['a1'] else 'ВКЛ' in r['lab']) and r['stA']==r['a1'] and r['state']=='pause'
    rec('L09 музыку и звуки можно выключить прямо из паузы — сохраняется, игра остаётся на паузе',ok,r)

@test('L10')
async def l10(b):
    # 1.4.2: «Готово» одна — нижняя; на телефоне она всегда на экране (и до, и после прокрутки)
    P=await newpage(b,390,844,alpha=False,touch=True)
    r=await P.js("async()=>{"+OPEN+"const ks0=[...new Set([...document.querySelectorAll('#setBody .tog[data-k],#setBody [data-seg]')].map(e=>e.dataset.k||e.dataset.seg))];const d=$('#bSetBack');const bot=()=>Math.round(d.getBoundingClientRect().bottom);const b1=bot();"
        "$('#sSet').scrollTop=9999;await w8(60);const b2=bot();d.click();await w8(250);return {ks:ks0.length,b1,b2,vh:innerHeight,state:G.state}}")
    ok=r['b1']<=r['vh'] and r['b2']<=r['vh'] and r['state']=='pause' and r['ks']>=14
    rec('L10 телефон: «Готово» всегда на экране (до и после прокрутки), возвращает в паузу; ни одна настройка не потерялась',ok,r)

@test('L11')
async def l11(b):
    P=await newpage(b,1280,760,alpha=False)
    r=await P.js("()=>({ver:VER_TAG,tag:$('#verTag').textContent,log:document.documentElement.outerHTML.includes('<dl class=\"kv\"><dt>1.4.1 α</dt>')})")
    rec('L11 версия 1.4.1 α и запись в журнале',r['ver']=='1.4.1 α' and r['tag']=='1.4.1 α' and r['log'],r)

@test('L12')
async def l12(b):
    out={}
    for snd in [True,False]:
        P=await newpage(b,1100,700,alpha=False)
        out[str(snd)]=await P.js("""async(snd)=>{SET.sfx=snd;SET.amb=snd;saveSet();audioInit();try{await AU.ctx.resume();}catch(e){}T.fresh();G.save.tut.off=1;let s=12345;Math.random=()=>{s=(s*1103515245+12345)%2147483648;return s/2147483648;};T.go(2);const r=T.bot({maxSec:120});return [r.state,r.sec,r.taken,r.lvl,G.kills]}""",snd)
    rec('L12 звук не влияет на бой: одинаковый сид и бот в миссии 2 — со звуком и без итог совпадает до единицы',out['True']==out['False'],out)

@test('L13')
async def l13(b):
    P=await newpage(b,844,390,alpha=False,touch=True)
    r=await P.js("async()=>{"+W8+"setInput('touch');T.fresh();G.save.tut.off=1;T.go(3);await w8(300);pause();await w8(200);const s=$('#sPause'),I=$('#pzInfo'),Q=$('#pzQuick');const bs=[...s.querySelectorAll('button')].filter(e=>e.offsetParent).map(e=>e.getBoundingClientRect());const ir=I?I.getBoundingClientRect():null;"
        "let hit=0;for(const c of bs)if(ir&&ir.bottom>c.top+1&&ir.top<c.bottom-1&&ir.right>c.left&&ir.left<c.right)hit++;return {info:!!ir&&ir.height>0,quick:!!Q&&Q.offsetHeight>0,maxB:Math.round(Math.max(...bs.map(c=>c.bottom))),vh:innerHeight,hit}}")
    rec('L13 телефон в альбомной: сводка и быстрый звук видны, пауза помещается без прокрутки и без наездов',r['info'] and r['quick'] and r['maxB']<=r['vh'] and r['hit']==0,r)

if __name__=='__main__':
    sel=sys.argv[1:]
    if sel:TESTS=[t for t in TESTS if t[0] in sel]
    asyncio.run(run(TESTS,'q310'))
