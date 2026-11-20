/* ===== 1.4.5 α «Верстак»: режим разработчика =====
   1) в песочнице открыто всё: ворота XII к боссу 50, арсенал, сторожевик «Изморозь» на своём месте;
   2) сторожевик и босс 50 в сетке выбора миссий запускаются через песочницу — по настоящей дороге и без записи в игру;
   3) одна панель #dvx (Ё / ` / кнопка DEV) на 7 вкладок: прыжок, корабль, бой, мир, прогресс, обучение, отладка;
   4) бессмертие в три ступени, телепорт сеткой, по карте, назад, закладки, снимки, сид, журнал событий, отчёт.
   Всё работает только при devAny(): без ?dev в адресе ничего из этого не видно и не слушается. */
const DVX={open:false,tab:null,ctx:'',hist:[],near:{},errs:[],log:[],step:0,mr:null,seeded:false,live:null,arm:{},lastWarn:0,pressT:0};
function dvOn(){try{return !!(window.DEVW&&DEVW.on&&DEVW.on());}catch(e){return false;}}
function devOpen(){return dvOn()||G.mode==='dev';}
function devGod(){if(!devAny())return 0;return G.dev.god?2:G.dev.god1?1:0;}
function dvSave(){try{store('void_dev',G.dev);}catch(e){}}
function devLog(kind,text){DVX.log.push({t:Date.now(),gt:G.t||0,kind,text:String(text).slice(0,160)});if(DVX.log.length>200)DVX.log.shift();if(DVX.open&&DVX.tab==='dbg')dvxLive();}
G.dev=Object.assign({god1:false,en:false,nocd:false,ohk:false,noclip:false,freeze:false,tscale:1,tpause:false,seed:4417,seedOn:false,tut:false,dvTab:'jump',bm:[null,null,null],zbCalm:false,postCold:false,postLight:false},G.dev||{});
if(!Array.isArray(G.dev.bm))G.dev.bm=[null,null,null];

/* ---------- ошибки — всегда пишем, показываем только в деве ---------- */
addEventListener('error',e=>{DVX.errs.push({t:Date.now(),m:String(e.message||e.error||'ошибка').slice(0,200),s:(e.error&&e.error.stack||'').split('\n').slice(0,4).join(' | ').slice(0,400),seen:0});if(DVX.errs.length>40)DVX.errs.shift();try{if(devAny())dvxBar();}catch(er){}});
addEventListener('unhandledrejection',e=>{DVX.errs.push({t:Date.now(),m:'promise: '+String(e.reason&&e.reason.message||e.reason).slice(0,200),s:'',seen:0});if(DVX.errs.length>40)DVX.errs.shift();});

/* ---------- 1. доступ: в песочнице открыто всё ---------- */
{const _z=zeroOpen110;zeroOpen110=function(){if(dvOn())return true;return _z.apply(this,arguments);};}
{const _a=arsOpen;arsOpen=function(){if(dvOn())return true;return _a.apply(this,arguments);};}
/* сторожевик в песочнице — на своём месте (раньше «всё открыто» прятало его, чтобы он не перегораживал III) */
{const _p=postAvail;postAvail=function(){if(dvOn())return !!G.save&&progDone(CORE)&&!G.post;return _p.apply(this,arguments);};}

/* ---------- прогресс песочницы: «пройдено до N» и точная копия моего прогресса ---------- */
{const _pr=DEVW.prep;DEVW.prep=function(S){const r=_pr.apply(this,arguments);try{if(S&&S.devExact&&S.devOrig){Object.assign(S,JSON.parse(JSON.stringify(S.devOrig)));}
  else if(S&&Number.isInteger(S.devProg))S.cleared=Math.min(S.devProg,CORE);}catch(e){}return r||S;};}
function dvSetProg(N){const S=G.save;if(!S)return;N=clamp(N|0,0,50);delete S.devExact;delete S.devOrig;S.devProg=N;S.cleared=Math.min(N,CORE);S.medals=S.medals||{};
  for(let m=1;m<=50;m++){if(m<=N){const md=S.medals[m]||(S.medals[m]={});md.clear=1;}else if(S.medals[m]){delete S.medals[m].clear;delete S.medals[m].clean;delete S.medals[m].master;}}
  S.story=S.story||{};if(N>=49)S.story.zero49=1;else delete S.story.zero49;if(N<50){delete S.story.zero50;delete S.story.zbJ;}
  if(N<CORE){const T=tutT();if(T&&G.dev.tut)T.off=0;}
  try{MAPC.fog=null;MAPC.fogVer=null;}catch(e){}saveWorld();devLog('prog','пройдено до '+N);}

/* ---------- 2. сетка выбора миссий: сторожевик и босс 50 — через песочницу ---------- */
function devGo(kind){if(!window.DEVW)return;const diff=G.dev.diff||'easy';DEVW.enter();const S=G.save;if(!S||!G.player)return;S.diff=diff;G.diff=diff;
  if(kind==='post'){devJump(POST_HATCH.x,POST_HATCH.y-150,'сторожевик',{exact:1,quiet:1});postEnter();devLog('go','сторожевик из сетки · '+diff);}
  if(kind==='zb'){const n=WORLD.nodes[49];devJump(n.x,n.y+100,'босс 50',{exact:1,quiet:1});G.zbCool=0;setTimeout(()=>{try{if(G.state==='world'&&!G.zb)zbStart();devLog('go','босс 50 из сетки · '+diff);}catch(e){console.error(e);}},60);}}
{const _ds=devStart;devStart=function(m){if(m===50){devGo('zb');return;}if(m===POST_I+1){devGo('post');return;}/* сид — до сборки модулей: «типичная» сборка тоже случайна */dvSeedOff();dvSeedOn(true);return _ds.apply(this,arguments);};}
{const _od=openDev;openDev=function(){dvSeedOff();const r=_od.apply(this,arguments);try{dvxClose();const g=$('#devGrid');if(g&&!g.querySelector('[data-m="post"]')){const t10=g.querySelector('[data-m="10"]');
    const b=document.createElement('button');b.className='devm post65';b.dataset.m='post';b.innerHTML='<b>❄</b><span>Сторожевик «Изморозь»</span><small>ГРАНИЦА II–III · ХОРРОР</small>';if(t10)t10.insertAdjacentElement('afterend',b);else g.appendChild(b);
    const t50=g.querySelector('[data-m="50"] small');if(t50)t50.textContent='БОСС · ОТКРЫТЫЙ МИР · СЕКТОР XII';}}catch(e){console.error(e);}return r;};}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#devGrid .devm');if(!b)return;if(b.dataset.m==='post'){e.stopImmediatePropagation();devGo('post');}else if(b.dataset.m==='50'){e.stopImmediatePropagation();devGo('zb');}},true);

/* ---------- 3. бессмертие: 0 — выкл, 1 — держать 1 HP, 2 — полное ---------- */
{const _l=lc95;lc95=function(p){if(devGod()===1&&p){p.hp=1;p.inv=Math.max(p.inv||0,.75);return true;}return _l.apply(this,arguments);};}
{const _rk=riftKill;riftKill=function(){if(devGod()>=1){const p=G.player;if(p&&devGod()===1)p.hp=Math.max(1,p.hp);return;}return _rk.apply(this,arguments);};}
{const _ai=addIce;addIce=function(){if(devGod()===2)return;return _ai.apply(this,arguments);};}
{const _aw=addWear;addWear=function(v){if(devGod()===2&&v>0)return;return _aw.apply(this,arguments);};}
/* «полное»: удар проходит как в игре (окно неуязвимости, отброс, вспышка), но здоровье и счётчик урона возвращаются —
   так бой с бессмертием идёт точно так же, как без него */
{const _dp=damagePlayer;damagePlayer=function(d){if(devGod()!==2)return _dp.apply(this,arguments);const p=G.player;if(!p)return;const hp=p.hp,tk=G.taken;
  G.dev.god=false;G.dev.god1=true;try{return _dp.apply(this,arguments);}finally{G.dev.god=true;G.dev.god1=false;p.hp=hp;G.taken=tk;}};}
/* с одного попадания — кроме боссов, их фазы должны идти честно */
function dvBossy(e){return !!(e&&(e.zb||e===G.sb||['boss','jam','lock'].includes(e.type)||(EDEF[e.type]&&(EDEF[e.type].sbp||EDEF[e.type].boss))));}
{const _h=hurt;hurt=function(e,dmg,src){if(devAny()&&G.dev.ohk&&e&&e.alive&&!dvBossy(e))dmg=Math.max(dmg,(e.hp||0)+1);return _h.call(this,e,dmg,src);};}
{const _ue=updateEnemies;updateEnemies=function(dt){if(devAny()&&G.dev.freeze)return;return _ue.apply(this,arguments);};}
{const _ub=updateBullets;updateBullets=function(dt){if(devAny()&&G.dev.freeze)return;return _ub.apply(this,arguments);};}
function dvShipTick(){const p=G.player;if(!p||!devAny())return;if(G.dev.en)p.en=Math.max(p.en||0,100);if(G.dev.nocd)p.dashCd=0;
  if(G.zb&&G.dev.zbCalm){G.zb.atkT=Math.max(G.zb.atkT||0,9);}
  if(G.post&&G.post.O&&G.dev.postFreeze){const O=G.post.O;O.cd=Math.max(O.cd,5);if(O.st!=='off'){O.st='off';O.x=-999;O.y=-999;}}}
/* скорость времени, пауза и шаг кадра; на телефоне при открытом листе мир стоит */
function dvRun(orig,self,args){if(!devAny())return orig.apply(self,args);const dt=args[0];
  if((DVX.open&&touchMode)||G.dev.tpause){if(DVX.step>0&&!(DVX.open&&touchMode)){DVX.step--;dvShipTick();return orig.call(self,1/60);}return;}
  const k=+G.dev.tscale||1;let r;if(k===1){r=orig.apply(self,args);}else if(k<1){r=orig.call(self,dt*k);}else{for(let i=0;i<k;i++)r=orig.call(self,dt);}dvShipTick();return r;}
{const _u=update;update=function(){return dvRun(_u,this,arguments);};}
/* сквозь скалы: позиция после полёта сохраняется, выталкивание скалами отменяется */
{const _mv=DEVW.move;DEVW.move=function(dt){const r=_mv.apply(this,arguments);const p=G.player;DVX.nc=p&&G.dev.noclip&&!G.zb?{x:p.x,y:p.y}:null;return r;};}
{const _w=worldUpdate;worldUpdate=function(dt){DVX.nc=null;const r=dvRun(_w,this,arguments);const p=G.player,q=DVX.nc;if(q&&p&&dvOn()&&G.dev.noclip&&G.world&&!G.zb){p.x=q.x;p.y=q.y;}return r;};}
/* сторожевик: холод и свет */
{const _pk=postDK;postDK=function(){const D=_pk.apply(this,arguments);if(!devAny())return D;if(G.dev.postCold||G.dev.postLight)return Object.assign({},D,G.dev.postCold?{cold:0}:{},G.dev.postLight?{dark:0}:{});return D;};}

/* ---------- сид ---------- */
function dvSeedOn(force,salt){if(!(force||devAny())||!G.dev.seedOn||DVX.seeded)return;DVX.mr=Math.random;let s=((G.dev.seed>>>0)+(salt||0)*7919)%2147483648||1;Math.random=()=>{s=(s*1103515245+12345)%2147483648;return s/2147483648;};DVX.seeded=true;devLog('seed','сид '+G.dev.seed+' включён');}
function dvSeedOff(){if(!DVX.seeded)return;if(DVX.mr)Math.random=DVX.mr;DVX.seeded=false;DVX.mr=null;}
/* сид: брифинг (раскладка, стартовый набор) — от сида, а с «В БОЙ» — от сида+1, так что время на брифинге повтор не сбивает */
{const _oi2=openIntro;openIntro=function(){dvSeedOff();dvSeedOn();return _oi2.apply(this,arguments);};}
{const _sm=startMission;startMission=function(){const was=G.state==='intro';if(was){dvSeedOff();dvSeedOn(false,1);}const r=_sm.apply(this,arguments);
  /* с сидом бой начинается с одинакового корабля: энергия, наводка и огонь не тянутся из сектора */
  if(was&&DVX.seeded&&G.player){const p=G.player;p.en=0;p.fireT=0;p.ang=-Math.PI/2;p.droneA=0;G.calm=0;G.rdt90=1/60;if(typeof G.lastFire90==='number')G.lastFire90=G.t-999;}return r;};}

/* визуальные случайности (частицы, взрывы, дрожание отрисовки) — свой генератор, как звук в 1.4.1:
   время на брифинге, «Эффекты» и частота кадров больше не сдвигают случайности боя */
const VFXR65=(()=>{let s=0x51ED27;return ()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return (s>>>0)/4294967296;};})();
/* ARCH·71 A-14…A-18 */arch71Boot();
function iso65(f){const w=function(){const mr=Math.random;Math.random=VFXR65;try{return f.apply(this,arguments);}finally{Math.random=mr;}};w.toString=()=>f.toString();return w;}
if(typeof part==='function')part=iso65(part);if(typeof explode==='function')explode=iso65(explode);
if(typeof render==='function')render=iso65(render);if(typeof renderWorld==='function')renderWorld=iso65(renderWorld);if(typeof mobOverlay==='function')mobOverlay=iso65(mobOverlay);

/* ---------- журнал событий ---------- */
{const _b=banner;banner=function(b,s){try{if(devAny())devLog('banner',b+(s?' · '+s:''));}catch(e){}return _b.apply(this,arguments);};}
{const _t=toast;toast=function(a,b){try{if(devAny())devLog('toast',a+' · '+b);}catch(e){}return _t.apply(this,arguments);};}
{const _ts=tutStart;tutStart=function(k){try{if(devAny())devLog('tut','урок «'+k+'» начат');}catch(e){}return _ts.apply(this,arguments);};}
{const _te=tutEnd;tutEnd=function(how){try{if(devAny()&&TUT.cur)devLog('tut','урок «'+TUT.cur.k+'» → '+how);}catch(e){}return _te.apply(this,arguments);};}
{const _en=enterNode;enterNode=function(m){try{if(devAny()){devLog('go','вход в узел '+pad2(m));dvSeedOff();dvSeedOn(false,2);}}catch(e){}return _en.apply(this,arguments);};}
{const _rw=returnToWorld;returnToWorld=function(){dvSeedOff();try{if(devAny())devLog('go','возврат в мир');}catch(e){}return _rw.apply(this,arguments);};}
{const _go=gameOver;gameOver=function(){try{if(devAny())devLog('death','гибель · '+(G.post?'сторожевик':G.mode==='endless'?'бесконечность':'миссия '+pad2(G.m)));}catch(e){}return _go.apply(this,arguments);};}
{const _tm=toMenu;toMenu=function(){dvSeedOff();dvxClose();return _tm.apply(this,arguments);};}
{const _za=zbAbort;zbAbort=function(w){try{if(devAny()&&G.zb)devLog('death','босс 50 · гибель на стадии '+G.zb.stage);}catch(e){}return _za.apply(this,arguments);};}

/* ---------- телепорт ---------- */
function dvFree(x,y){const rr=G.rocks||[];const bad=(qx,qy)=>rr.some(r=>r.alive!==false&&Math.hypot(qx-r.x,qy-r.y)<r.r+40);if(!bad(x,y))return [x,y];
  for(let i=1;i<40;i++){const a=i*2.4,d=40+i*22,qx=x+Math.cos(a)*d,qy=y+Math.sin(a)*d;if(!bad(qx,qy))return [qx,qy];}return [x,y];}
function dvLeave(){/* из любого состояния — чисто в мир */
  if(G.state==='levelup'&&typeof pickMode!=='undefined'&&pickMode==='zbChoice'){pickMode='ship';scr6('world');show('');}
  if(G.zb&&G.state==='levelup'){runQClear6();if(typeof pickMode!=='undefined')pickMode='ship';scr6('world');show('');}
  if(G.zb){try{zbLeave();}catch(e){G.zb=null;}}
  if(G.state==='map')closeMap();
  if(G.state==='pause'&&G.pausedWorld)resume();
  if(G.post||inMission()&&['intro','play','levelup','pause','done','over','codex'].includes(G.state)){try{if(G.runStart)restoreRun();}catch(e){}returnToWorld();}
  if(G.state==='shop'||G.state==='hangar'||G.state==='arsenal'){try{if(G.state==='shop'&&typeof closeShop==='function')closeShop();else if(G.state==='hangar'&&typeof closeHangar==='function')closeHangar();else if(G.state==='arsenal'&&typeof closeArsenal==='function')closeArsenal();}catch(e){}}}
function devJump(x,y,why,o){o=o||{};if(!dvOn()){toast('ТОЛЬКО В ПЕСОЧНИЦЕ','Откройте «Открытый мир» в режиме разработчика.');return false;}
  dvLeave();if(G.state!=='world'||!G.player)return false;const p=G.player;
  if(!o.back){DVX.hist.push({x:p.x,y:p.y,why:sectorName(p.x,p.y)});if(DVX.hist.length>8)DVX.hist.shift();}
  enterWorldAt(x,y);if(!o.exact){const q=dvFree(p.x,p.y);p.x=q[0];p.y=q[1];}p.px=p.x;p.py=p.y;p.vx=p.vy=0;p.dashT=0;camSnap();G.card=null;G.cardKey=null;$('#wcard').hidden=true;
  try{saveWorld();}catch(e){}devLog('jump',(why||'точка')+' · '+Math.round(p.x)+' '+Math.round(p.y));if(!o.quiet)floater(p.x,p.y-46,'ПРЫЖОК · '+(why||'ТОЧКА').toUpperCase(),'#00ff88');
  if(DVX.open)dvxRender();return true;}
function dvBack(){const h=DVX.hist.pop();if(!h){toast('НАЗАД','История прыжков пуста.');return;}devJump(h.x,h.y,'назад',{back:1,exact:1});}
function dvNode(m){if(m==='post')return {x:POST_HATCH.x,y:POST_HATCH.y-150,label:'сторожевик'};const n=WORLD.nodes[m-1];return n?{x:n.x,y:n.y+(m===50?100:160),label:'миссия '+pad2(m)}:null;}
function dvGoNode(m,enter){const q=dvNode(m);if(!q)return;if(!devJump(q.x,q.y,q.label,{exact:m===50||m==='post'}))return;if(!enter)return;
  if(m==='post'){postEnter();return;}if(m===50){G.zbCool=0;setTimeout(()=>{try{if(G.state==='world'&&!G.zb)zbStart();}catch(e){console.error(e);}},60);return;}
  enterNode(m);}
const DV_PLACES=[['shop','СКЛАД',()=>WORLD.shops[0]],['hangar','ХРАНИЛИЩЕ',()=>WORLD.hangar],['arsenal','АРСЕНАЛ',()=>WORLD.arsenal],['abyss','БЕЗДНА',()=>WORLD.abyss&&{x:WORLD.abyss.x,y:WORLD.abyss.y+260}],
  ['gate','ВОРОТА II',()=>WORLD.gate&&{x:WORLD.gate.x-250,y:WORLD.gate.y}],['post','СТОРОЖЕВИК',()=>({x:POST_HATCH.x,y:POST_HATCH.y-150})],['zero','ВОРОТА XII',()=>WORLD.zero110&&{x:WORLD.zero110.x,y:WORLD.zero110.y-260}]];
const DV_NEAR=[['journals','ЖУРНАЛ',()=>WORLD.journals],['caches','ТАЙНИК',()=>WORLD.caches],['relays','РЕТРАНСЛЯТОР',()=>WORLD.relays],['anomalies','АНОМАЛИЯ',()=>WORLD.anomalies],['locks','ЗАМОК',()=>(WORLD.locks||[]).map(l=>Array.isArray(l)?{x:l[0],y:l[1]}:l)],['shops','МАСТЕРСКАЯ',()=>WORLD.shops]];
function dvNear(k){const D=DV_NEAR.find(x=>x[0]===k);if(!D||!G.player)return;const L=(D[2]()||[]).filter(q=>q&&Number.isFinite(q.x));if(!L.length)return;let st=DVX.near[k];
  if(!st){const p=G.player;st=DVX.near[k]={i:-1,L:L.slice().sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))};}
  st.i=(st.i+1)%st.L.length;const q=st.L[st.i];devJump(q.x,q.y+130,D[1].toLowerCase()+' '+(st.i+1)+'/'+st.L.length);}
function dvSecC(i){const s=WORLD.sectors[i];if(!s)return null;return {x:s.bx||(s.box[0]+s.box[2])/2,y:(s.by||(s.box[1]+s.box[3])/2)+150};}

/* ---------- снимки ---------- */
function dvSnapSave(i){const S=G.save,p=G.player;if(!dvOn()||!S||!p)return;try{saveWorld();}catch(e){}
  const v={v:1,t:Date.now(),ver:VER_TAG,pos:{x:Math.round(p.x),y:Math.round(p.y)},sec:sectorName(p.x,p.y),save:JSON.parse(JSON.stringify(S))};v.save.pos={...v.pos};v.save.last={...v.pos};
  try{LS.setItem('void_devsnap'+i,JSON.stringify(v));toast('СНИМОК '+i+' СОХРАНЁН',v.sec+' · '+v.pos.x+' '+v.pos.y);devLog('snap','снимок '+i+' сохранён');}catch(e){toast('СНИМОК НЕ ЗАПИСАН','Не хватает места в браузере. Старый снимок не тронут.');}
  if(DVX.open)dvxRender();}
function dvSnapGet(i){try{const v=JSON.parse(LS.getItem('void_devsnap'+i)||'null');return v&&v.save?v:null;}catch(e){return null;}}
function dvSnapLoad(i){const v=dvSnapGet(i);if(!v){toast('СНИМОК '+i,'Слот пуст.');return;}dvLeave();try{LS.setItem(DEVW.KEY,JSON.stringify(v.save));}catch(e){return;}saveSet6(null,'dev');DEVW.enter();devLog('snap','снимок '+i+' загружен');if(DVX.open)dvxRender();}
function dvCopyMine(){const real=migrateSave(store('void_world'));if(!real){toast('НЕТ СОХРАНЕНИЯ','Настоящая игра ещё не начата.');return;}dvLeave();
  const S=JSON.parse(JSON.stringify(real));S.devw=1;S.devExact=1;S.devOrig={cleared:S.cleared,gate:S.gate,pilot:S.pilot,ownSkins:S.ownSkins,skins:S.skins,relays:S.relays,reveal:S.reveal,intro:S.intro};
  try{LS.setItem(DEVW.KEY,JSON.stringify(S));}catch(e){return;}saveSet6(null,'dev');DEVW.enter();toast('КОПИЯ ВАШЕГО ПРОГРЕССА','Песочница теперь — точная копия настоящей игры. Настоящее сохранение не изменится.');devLog('snap','копия настоящего прогресса');}

/* ---------- отчёт ---------- */
function dvReport(){const p=G.player,S=G.save;const L=[];
  L.push('VØID '+VER_TAG+' · отчёт разработчика · '+new Date().toISOString());
  L.push('устройство: '+innerWidth+'×'+innerHeight+' · dpr '+devicePixelRatio+' · '+(touchMode?'сенсор':'мышь')+' · '+(isMob()?'моб':'ПК')+' · '+(innerWidth>innerHeight?'альбомная':'книжная'));
  L.push('режим: '+(dvOn()?'песочница':G.mode)+' · состояние: '+G.state+(G.m?' · миссия '+pad2(G.m):'')+(G.zb?' · босс 50 '+G.zb.k+' ст.'+G.zb.stage:'')+(G.post?' · сторожевик акт '+(G.post.act+1):''));
  if(p)L.push('корабль: '+Math.round(p.x)+' '+Math.round(p.y)+' · '+sectorName(p.x,p.y)+' · HP '+Math.round(p.hp)+'/'+Math.round(G.st&&G.st.maxHp||0)+' · EN '+Math.round(p.en||0));
  if(S)L.push('прогресс: миссии '+doneCount()+'/'+NM+' · лом '+Math.round(S.lom||0)+' · пилот '+((S.pilot&&S.pilot.lvl)||1)+' · цикл '+(S.cycle||1)+' · сложность '+(S.diff||G.diff));
  L.push('дев: бессмертие '+devGod()+' · время ×'+G.dev.tscale+(G.dev.tpause?' (пауза)':'')+' · сид '+(G.dev.seedOn?G.dev.seed:'случайный')+' · полёт ×'+(DEVW.spd?DEVW.spd():1));
  L.push('настройки: '+JSON.stringify({fx:SET.fx,lessFx:SET.lessFx,quality:SET.quality,fps:SET.fps,uiSize:SET.uiSize,textScale:SET.textScale,hand:SET.hand}));
  const W=DEVW.stats?DEVW.stats():{};L.push('сторож: заблокировано '+JSON.stringify(W.blocked||{})+' · попыток void_world '+((W.warn||[]).length));
  L.push('ошибки ('+DVX.errs.length+'):');DVX.errs.slice(-5).forEach(e=>L.push('  '+e.m+(e.s?' @ '+e.s:'')));
  L.push('журнал:');DVX.log.slice(-20).forEach(e=>L.push('  '+new Date(e.t).toTimeString().slice(0,8)+' '+e.kind+' · '+e.text));
  return L.join('\n');}
function dvCopy(t,okMsg){const done=()=>toast('СКОПИРОВАНО',okMsg||'Текст в буфере обмена.');
  try{navigator.clipboard.writeText(t).then(done,()=>dvCopyFb(t,done));}catch(e){dvCopyFb(t,done);}}
function dvCopyFb(t,done){try{const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;left:-9999px;top:0';document.body.appendChild(a);a.select();document.execCommand('copy');a.remove();done();}catch(e){toast('НЕ СКОПИРОВАНО','Браузер не дал доступ к буферу.');}}

/* ---------- обучение ---------- */
{const _to=tutOn;tutOn=function(){if(dvOn()&&G.dev.tut){const S=G.save;if(!S||!S.tut||S.tut.off)return false;return G.mode==='world'&&!G.fromAbyss;}return _to.apply(this,arguments);};}
function dvTutBlock(){const S=G.save,p=G.player;if(!S)return 'Нет сохранения.';if((S.cleared||0)>=CORE)return 'Пройдено '+(S.cleared||0)+' миссий — обучение кончается после десятой.';if(p&&sectorIdx(p.x,p.y)>=2)return 'Корабль в секторе '+roman(sectorIdx(p.x,p.y)+1)+' — обучение живёт только в I–II.';return '';}
/* «▶ показать сейчас»: урок держится минимум 5 с, даже если повода (враг, пуля, карта) нет — чтобы его можно было рассмотреть */
const dvForced=()=>!!(TUT.cur&&TUT.cur.forced&&TUT.cur.t<5);
{const _c=tutCtxOk;tutCtxOk=function(){if(dvForced())return true;return _c.apply(this,arguments);};}
{const _c=tutCalm;tutCalm=function(){if(dvForced())return true;return _c.apply(this,arguments);};}
{const _e=tutEnd;tutEnd=function(how){if(dvForced()&&(how==='abort'||how==='miss'))return;return _e.apply(this,arguments);};}
{const _t=tutTick2;tutTick2=function(){if(dvForced())TUT.cur.idle=0;return _t.apply(this,arguments);};}
{const _s=tutStart;tutStart=function(k){if(dvForced()&&TUT.cur.k!==k)return;return _s.apply(this,arguments);};}
const TUT_NM65={move:'Полёт',dash:'Рывок',pulse:'Импульс',fire:'Огонь',cell:'Ячейка',line:'Линия',calib:'Калибровка',act:'Действие',energy:'Энергия',lom:'Лом',stash:'Склад',map:'Карта',jump:'Прыжок',patrol:'Патруль'};
function dvTutWhy(k){const r=[],T=tutT(),L=TUT_L[k];if(!L)return ['нет такого урока'];
  if(!G.dev.tut)r.push('обучение в песочнице выключено (переключатель выше)');
  if(!T)r.push('нет сохранения');else{if(T.off)r.push('обучение закончено: пройдено ≥10 миссий или корабль в секторе III+ («Прогресс» → пройдено до N < 10)');if(T.done[k])r.push('урок уже сделан');}
  if(TUT.cur&&TUT.cur.k!==k)r.push('сейчас идёт урок «'+(TUT_NM65[TUT.cur.k]||TUT.cur.k)+'»');
  if(TUT.gap>0)r.push('пауза между уроками ещё '+TUT.gap.toFixed(1).replace('.',',')+' с');
  let ctx=true;try{ctx=tutCtxOk(L.ctx);}catch(e){}if(!ctx)r.push('не тот экран: нужен '+({world:'сектор',mission:'бой в миссии',map:'карта'}[L.ctx]||L.ctx));
  let calm=true;try{calm=tutCalm();}catch(e){}if(!L.fight&&L.ctx!=='map'&&!calm)r.push('не спокойно: рядом враги или мало здоровья');
  if(!['dash','pulse','fire','patrol','move','jump','calib'].includes(k)&&T&&!T.done.move&&G.world)r.push('сначала урок «Полёт»');
  let ok;try{ok=L.when();}catch(e){ok='ошибка: '+e.message;}if(ok!==true)r.push('условие урока не выполнено (when = '+ok+')');
  if(T)for(const kk of TUT_PRI){if(kk===k)break;if(T.done[kk])continue;const LL=TUT_L[kk];let w=false;try{w=tutCtxOk(LL.ctx)&&LL.when();}catch(e){}if(w){r.push('раньше в очереди «'+(TUT_NM65[kk]||kk)+'»');break;}}
  if(TUT.hist&&TUT.hist.filter(h=>performance.now()-h<600000).length>=6)r.push('лимит: не больше 6 уроков за 10 минут');
  return r.length?r:['ничего не мешает — урок начнётся в ближайшие 0,1 с'];}

/* ---------- значки вкладок ---------- */
const DVX_TABS=[['jump','ПРЫЖОК','<circle cx="10" cy="10" r="6.5"/><circle cx="10" cy="10" r="1.8"/><path d="M10 1.5v3M10 15.5v3M1.5 10h3M15.5 10h3"/>'],
  ['ship','КОРАБЛЬ','<path d="M10 2.5l6 14-6-3.2-6 3.2z"/>'],
  ['fight','БОЙ','<path d="M4 16L14.5 5.5M11.5 3.5l5 5M3 13l4 4"/>'],
  ['world','МИР','<circle cx="10" cy="10" r="7.5"/><path d="M2.5 10h15M10 2.5c2.6 2.4 2.6 12.6 0 15M10 2.5c-2.6 2.4-2.6 12.6 0 15"/>'],
  ['prog','ПРОГРЕСС','<path d="M4 17V3M4 3.5h10l-2 3 2 3H4"/>'],
  ['tut','ОБУЧЕНИЕ','<circle cx="10" cy="10" r="7.5"/><path d="M7.6 7.6a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.6M10 14.2v.3"/>'],
  ['dbg','ОТЛАДКА','<rect x="2.5" y="3.5" width="15" height="13" rx="1.5"/><path d="M5.5 8l2.5 2-2.5 2M10 12.5h4"/>']];
const dvIco=p=>`<svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

/* ---------- панель ---------- */
function dvCtx(){return dvOn()?(G.zb?'zb':G.post?'post':inMission()?'mis':'world'):G.devRun?(G.mode==='endless'?'end':'mis'):'none';}
function dvCtxKey(){const c=dvCtx();return c==='zb'?'zb:'+(['fight','race'].includes(G.zb.k)?'f':G.zb.k):c+':'+G.state;}
function dvxEl(){let P=document.getElementById('dvx');if(!P){P=document.createElement('div');P.id='dvx';P.hidden=true;P.setAttribute('role','dialog');P.setAttribute('aria-label','Панель разработчика');P.setAttribute('lang','ru');document.body.appendChild(P);
    ['pointerdown','mousedown','touchstart','wheel','click','contextmenu'].forEach(ev=>P.addEventListener(ev,e=>e.stopPropagation(),{passive:ev!=='click'&&ev!=='contextmenu'}));
    P.addEventListener('click',dvxClick);P.addEventListener('change',dvxChange);P.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'){e.stopPropagation();if(e.code==='Enter'){const b=e.target.closest('.r65')&&e.target.closest('.r65').querySelector('[data-a]');if(b)b.click();}if(e.code==='Escape')e.target.blur();}});}
  return P;}
function dvxOpen(force){if(!devAny())return;const P=dvxEl();const on=force!==undefined?!!force:P.hidden;if(!on){dvxClose();return;}
  ['dwPanel','devPanel'].forEach(id=>{const e=document.getElementById(id);if(e)e.hidden=true;});
  DVX.open=true;P.hidden=false;document.documentElement.classList.add('dvx-on');dvxRender();clearInterval(DVX.live);DVX.live=setInterval(()=>{if(!DVX.open||!devAny()){dvxClose();return;}if(dvCtxKey()!==DVX.ctx)dvxRender();else dvxLive();},250);dvxBar();}
function dvxClose(){DVX.open=false;const P=document.getElementById('dvx');if(P)P.hidden=true;document.documentElement.classList.remove('dvx-on');clearInterval(DVX.live);DVX.live=null;try{dvxBar();}catch(e){}}
toggleDevPanel=function(force){if(!devAny())return;dvxOpen(force);};
{const _k=DEVW.key;DEVW.key=function(e){if(e.code==='Backquote'&&(G.state==='world'||G.state==='play')){dvxOpen();return true;}
  if(G.state==='pause'&&G.pausedWorld&&e.code==='Escape'){DEVW.exit();return true;}return _k.apply(this,arguments);};}
{const _pu=DEVW.pauseUI;DEVW.pauseUI=function(){const r=_pu.apply(this,arguments);const b=document.getElementById('bDevExit');if(b)b.onclick=()=>DEVW.exit();return r;};}
{const _p=DEVW.panel;DEVW.panel=function(force){dvxOpen(force);};}
/* выход из режима посреди боя с боссом 50, сторожевика или миссии — сначала чисто в мир песочницы, иначе бой «висит» */
{const _ex=DEVW.exit;DEVW.exit=function(){try{if(dvOn()){dvxClose();dvLeave();}}catch(e){console.error(e);}dvSeedOff();return _ex.apply(this,arguments);};}

const seg=(a,cur,opts)=>`<div class="seg65">${opts.map(([v,n])=>`<button data-a="${a}" data-v="${v}" class="${String(v)===String(cur)?'on':''}">${n}</button>`).join('')}</div>`;
const tog=(k,n,dis)=>`<button class="tg65${G.dev[k]?' on':''}" data-a="tog" data-v="${k}"${dis?` disabled title="${dis}"`:''} aria-pressed="${!!G.dev[k]}"><i></i><span>${n}</span>${dis?`<em>${dis}</em>`:''}</button>`;
const btn=(a,v,n,cls,dis)=>`<button class="b65${cls?' '+cls:''}" data-a="${a}" data-v="${v}"${dis?` disabled title="${dis}"`:''}>${n}${dis?`<em>${dis}</em>`:''}</button>`;
const grp=(h,body,note)=>`<section class="g65"><h4>${h}</h4>${body}${note?`<p class="n65">${note}</p>`:''}</section>`;
function dvxRender(){const P=dvxEl();if(!DVX.open)return;DVX.ctx=dvCtxKey();let tab=G.dev.dvTab||'jump';if(!DVX_TABS.some(t=>t[0]===tab))tab='jump';DVX.tab=tab;
  const sb=dvOn();const title=DVX_TABS.find(t=>t[0]===tab)[1];
  const head=`<div class="h65"><b>РАЗРАБОТКА</b><span>${sb?'ПЕСОЧНИЦА':'СЕТКА МИССИЙ'} · ${title}</span><button class="x65" data-a="close" aria-label="Закрыть панель">✕</button></div>`;
  const tabs=`<div class="t65" role="tablist">${DVX_TABS.map(([k,n,ic])=>`<button role="tab" data-a="tab" data-v="${k}" class="${k===tab?'on':''}" aria-selected="${k===tab}" title="${n}">${dvIco(ic)}<span>${n}</span></button>`).join('')}</div>`;
  let body='';try{body=DVX_R[tab]();}catch(e){console.error(e);body=`<p class="n65">Ошибка вкладки: ${e.message}</p>`;}
  const foot=`<button class="ex65" data-a="exit">${sb?'ВЫЙТИ ИЗ РЕЖИМА РАЗРАБОТЧИКА':'К ВЫБОРУ МИССИЙ'}</button>`;
  const sc=P.querySelector('.bd65');const top=sc?sc.scrollTop:0;const keepTab=P.dataset.tab===tab;
  P.innerHTML=head+tabs+`<div class="bd65">${body}</div>`+foot;P.dataset.tab=tab;if(keepTab){const s2=P.querySelector('.bd65');if(s2)s2.scrollTop=top;}dvxLive();}
function dvxLive(){const P=document.getElementById('dvx');if(!P||P.hidden)return;const p=G.player;
  P.querySelectorAll('[data-live]').forEach(el=>{let t='';try{t=DVX_LIVE[el.dataset.live]();}catch(e){t='—';}if(el.textContent!==t)el.textContent=t;});
  if(DVX.tab==='dbg'){const L=P.querySelector('#log65');if(L){const h=DVX.log.slice(-60).reverse().map(e=>`<div><b>${new Date(e.t).toTimeString().slice(0,8)}</b> <i>${e.kind}</i> ${kh?kh(e.text):e.text}</div>`).join('')||'<div>пусто</div>';if(L.dataset.n!==String(DVX.log.length)){L.innerHTML=h;L.dataset.n=DVX.log.length;}}}}
const DVX_LIVE={
  pos:()=>{const p=G.player;return p?Math.round(p.x)+' '+Math.round(p.y)+' · '+sectorName(p.x,p.y):'—';},
  hp:()=>{const p=G.player;return p?'HP '+Math.round(p.hp)+' / '+Math.round(G.st&&G.st.maxHp||0)+' · EN '+Math.round(p.en||0)+(G.taken?' · получено урона '+Math.round(G.taken):''):'—';},
  zb:()=>{const Z=G.zb;if(!Z)return '—';return ({silence:'ТИШИНА',walls:'СТЕНЫ',expand:'РАСШИРЕНИЕ',pick:'ВЫБОР КОМПЛЕКТА',spawn:'ПОЯВЛЕНИЕ',fight:'БОЙ',race:'ГОНКА',choice:'ВЫБОР',end:'ФИНАЛ',seg:'СЕГМЕНТ'}[Z.k]||Z.k.toUpperCase())+' · СТАДИЯ '+Z.stage+'/4 · СЕГМЕНТ '+(Z.segMax?Math.round(Z.hp/Z.segMax*100):0)+'% · СБОЙ '+Math.round(Z.stg||0);},
  post:()=>{const P_=G.post;if(!P_)return '—';const O=P_.O;return 'АКТ '+(P_.act+1)+'/'+POST_ACTS.length+' · '+POST_ACTS[P_.act].name+' · ХОЛОД '+Math.round((P_.cold||0)*100)+'% · СУЩЕСТВО '+(!O||O.st==='off'?'НЕ ВИДНО':'РЯДОМ')+(P_.escape>0?' · ПОБЕГ '+Math.max(0,P_.escT||0).toFixed(0)+' С':'');},
  mast:()=>{const M=typeof MASTERY!=='undefined'&&MASTERY[G.m-1];if(!M||!G.mc)return '—';let ok=false;try{ok=!!M.ok();}catch(e){}return (ok?'✓ ':'· ')+M.t;},
  mis:()=>{if(!inMission())return '—';return pad2(G.m)+' · '+(MISSIONS[G.m-1]?mName(MISSIONS[G.m-1]):'')+' · ВОЛНА '+((G.waveIdx||0)+1)+'/'+((G.waves||[]).length||'—')+' · ВРАГОВ '+G.enemies.filter(e=>e.alive).length;},
  perf:()=>'FPS '+Math.round(typeof fpsAvg!=='undefined'?fpsAvg:0)+' · ВРАГОВ '+(G.enemies||[]).filter(e=>e.alive).length+' · ПУЛЬ '+((G.eb||[]).length+(G.pb||[]).length)+' · ЧАСТИЦ '+(G.parts||[]).length,
  guard:()=>{const W=DEVW.stats?DEVW.stats():{blocked:{},warn:[]};const n=Object.values(W.blocked||{}).reduce((a,b)=>a+b,0)+(W.warn||[]).length;return 'ЗАБЛОКИРОВАНО ЗАПИСЕЙ В ИГРУ: '+n+((W.warn||[]).length?' · последняя: '+W.warn[W.warn.length-1].slice(0,80):'');},
  errs:()=>DVX.errs.length?DVX.errs.length+' · последняя: '+DVX.errs[DVX.errs.length-1].m:'нет'};

const DVX_R={
 jump(){if(!dvOn())return grp('ТОЛЬКО В ПЕСОЧНИЦЕ',btn('sandbox',1,'ОТКРЫТЬ ОТКРЫТЫЙ МИР','wide'),'Прыжки работают в открытом мире разработчика. Отсюда — его карта, все 50 миссий, сторожевик и босс 50.');
  const S=G.save;const secs={};for(let m=1;m<=50;m++){const n=WORLD.nodes[m-1];if(!n)continue;const si=sectorIdx(n.x,n.y);(secs[si]||(secs[si]=[])).push(m);if(m===CORE)secs[si].push('post');}
  const tile=m=>{if(m==='post'){const d=postDone();return `<div class="m65 post${d?' done':''}"><button class="mj" data-a="node" data-v="post" title="К шлюзу"><b>❄</b><span>Сторожевик</span></button><button class="me" data-a="enter" data-v="post" title="Войти сразу" aria-label="Войти в сторожевик">▶</button></div>`;}
    const md=S.medals&&S.medals[m]||{},done=progDone(m),boss=BOSS_LV.has(m),M=MISSIONS[m-1];
    return `<div class="m65${done?' done':''}${boss?' boss':''}${md.master?' master':''}"><button class="mj" data-a="node" data-v="${m}" title="К узлу ${pad2(m)}"><b>${pad2(m)}</b><span>${M?mName(M):''}</span></button><button class="me" data-a="enter" data-v="${m}" title="Войти сразу" aria-label="Войти в миссию ${m}">▶</button></div>`;};
  const grid=Object.keys(secs).sort((a,b)=>a-b).map(si=>{const s=WORLD.sectors[si];return `<div class="sh65" style="--sc:${s&&s.col||'#00ff88'}">${roman(+si+1)} · ${s?s.name:''}</div><div class="mg65">${secs[si].map(tile).join('')}</div>`;}).join('');
  const bm=G.dev.bm.map((q,i)=>`<div class="bm65">${btn('bmgo',i,q?`★${i+1} ${q.label}`:`★${i+1} ПУСТО`,'',q?'':'')}${btn('bmset',i,'ЗАПОМНИТЬ')}</div>`).join('');
  return grp('СЕЙЧАС','<p class="lv65" data-live="pos"></p>'+`<div class="r65">${btn('back',0,'← НАЗАД','',DVX.hist.length?'':'история пуста')}${btn('copypos',0,'КОПИРОВАТЬ МОИ')}</div>`)+
   grp('МИССИИ',grid,'Нажатие — к узлу, ▶ — сразу в брифинг. Shift+клик — тоже сразу. Цифры с клавиатуры: «27» → Enter.')+
   grp('МЕСТА',`<div class="r65 wr">${DV_PLACES.map(([k,n])=>btn('place',k,n)).join('')}</div><div class="r65 wr">${WORLD.sectors.map((s,i)=>btn('sec',i,roman(i+1))).join('')}</div>`,'Римские — центры секторов I–XII.')+
   grp('БЛИЖАЙШЕЕ',`<div class="r65 wr">${DV_NEAR.map(([k,n,f])=>btn('near',k,n+' →')).join('')}</div>`,'Повторное нажатие — следующий по дальности. Так можно обойти все '+WORLD.journals.length+' журналов подряд.')+
   grp('ЗАКЛАДКИ',bm,'Ctrl+1/2/3 — запомнить, Alt+1/2/3 — прыжок.')+
   grp('КООРДИНАТЫ',`<div class="r65"><input id="xy65" inputmode="numeric" placeholder="X Y" aria-label="Координаты X Y">${btn('xy',0,'ПРЫЖОК')}</div>`,'Alt+клик или долгое нажатие на карте (M) — прыжок в точку.');},
 ship(){const g=devGod();const sb=dvOn();
  return grp('БЕССМЕРТИЕ · G',seg('god',g,[[0,'ВЫКЛ'],[1,'ДЕРЖАТЬ 1 HP'],[2,'ПОЛНОЕ']])+'<p class="lv65" data-live="hp"></p>','«1 HP» — урон, вспышки и счётчик урона как в игре, но корабль не погибает. «Полное» — удар проходит как в игре (отброс, вспышка), но здоровье сразу возвращается; лёд и износ не копятся. Бой с бессмертием идёт так же, как без него.')+
   grp('КОРАБЛЬ',`<div class="tg65w">${tog('bcGod','НЕУЯЗВИМЫЙ МАЯК')}${tog('en','БЕСКОНЕЧНАЯ ЭНЕРГИЯ')}${tog('nocd','РЫВОК БЕЗ ПЕРЕЗАРЯДКИ')}${tog('ohk','С ОДНОГО ПОПАДАНИЯ')}${tog('noclip','СКВОЗЬ СКАЛЫ',!sb?'только в песочнице':G.zb?'не в бою с боссом 50':'')}</div>`+`<div class="r65">${btn('heal',0,'ПОЛНОЕ ЗДОРОВЬЕ · H')}</div>`,'«С одного попадания» не действует на боссов — их фазы идут честно. Ворота и стены секторов в песочнице и так открыты.')+
   (sb?grp('СКОРОСТЬ ПОЛЁТА · [ ]',seg('wspd',DEVW.spd(),[[.5,'×0,5'],[1,'×1'],[2,'×2'],[4,'×4'],[8,'×8']]),'Только перемещение корабля. Скорость всей игры — во вкладке «Бой».'):'')+
   grp('КОРПУС',`<div class="r65">${btn('skin',-1,'←')}<span class="lv65 c65">${(SKINS[G.save&&G.save.skin||'base']||{}).name||G.save&&G.save.skin||'—'}</span>${btn('skin',1,'→')}</div>`+(sb?`<div class="r65">${btn('skins','all','ВСЕ КОРПУСА')}${btn('skins','base','ТОЛЬКО БАЗОВЫЙ')}</div>`:''),'Смена корпуса на лету — видно все 16 живых корпусов 1.4.0 в бою.');},
 fight(){const c=dvCtx();let ctxh='';
  if(c==='zb'&&!['fight','race'].includes(G.zb.k)){const Z=G.zb,intro=['silence','walls','expand','spawn'].includes(Z.k);
    ctxh=grp('БОСС 50 · НУЛЕВОЙ МИГ','<p class="lv65" data-live="zb"></p>'+(intro?`<div class="r65">${btn('zbskip',0,'ПРОПУСТИТЬ ВХОД · ДО ВЫБОРА КОМПЛЕКТА','wide')}</div>`:'')+`<div class="r65 wr">${btn('zbleave',0,'ПОКИНУТЬ БОЙ')}${btn('zbagain',0,'СНОВА С НАЧАЛА')}</div>`,
      intro?'Тишина → стены → расширение → выбор комплекта. Стадии, атаки и сегменты появятся, когда начнётся бой.':Z.k==='pick'?'Выберите стартовый комплект — дальше бой, и здесь появятся стадии, атаки и сегменты.':'Финал: выбор и кинематограф. «Снова с начала» — новый заход.');}
  else if(c==='zb'){const Z=G.zb;ctxh=grp('БОСС 50 · НУЛЕВОЙ МИГ','<p class="lv65" data-live="zb"></p>'+
     `<div class="r65">${[1,2,3,4].map(n=>btn('zbst',n,'СТАДИЯ '+n,Z.stage===n?'on':'',Z.boss?'':'ещё нет босса')).join('')}</div>`+
     `<div class="r65 wr">${[100,50,30,20,5].map(v=>btn('zbhp',v,'СЕГМЕНТ '+v+'%','',Z.k==='fight'?'':'только в бою')).join('')}${btn('zbstun',0,'СБОЙ СЕЙЧАС','',Z.k==='fight'?'':'только в бою')}</div>`+
     `<div class="r65 wr">${[['blink','ВСПЫШКА'],['tridash','ТРОЙНОЙ БРОСОК'],['grid','РЕШЁТКА'],['star','ЗВЕЗДА'],['burst','ОЧЕРЕДЬ'],['mines','НУЛИ'],['dash','БРОСОК'],['fan','ВЕЕР'],['beam','ЛУЧ'],['pulse','ИМПУЛЬС'],['clone','ОТРАЖЕНИЕ']].map(([k,n])=>btn('zbatk',k,n,'',Z.k==='fight'&&Z.boss?'':'только в бою')).join('')}</div>`+
     `<div class="tg65w">${tog('zbCalm','ДИРИЖЁР ВЫКЛ · БОСС НЕ АТАКУЕТ САМ')}</div>`+
     `<div class="r65 wr">${btn('zbchoice',0,'ФИНАЛ · ВЫБОР','',Z.boss?'':'ещё нет босса')}${btn('zbleave',0,'ПОКИНУТЬ БОЙ')}${btn('zbagain',0,'СНОВА С НАЧАЛА')}</div>`,'Атаки по имени — через зацепку игры zbAtk, телеграфы и урон настоящие.');}
  else if(c==='post'){const P_=G.post;ctxh=grp('СТОРОЖЕВИК «ИЗМОРОЗЬ»','<p class="lv65" data-live="post"></p>'+`<div class="r65 wr">${POST_ACTS.map((A,i)=>btn('pact',i,(i+1)+' · '+A.name,P_.act===i?'on':'')).join('')}</div>`+
     `<div class="r65 wr">${btn('ptask',0,'ВСЕ ЗАДАЧИ АКТА')}${btn('pdoor',0,'ОТКРЫТЬ ДВЕРЬ')}${btn('pwin',0,'ПРОЙТИ ЦЕЛИКОМ')}</div>`+
     `<div class="tg65w">${tog('postFreeze','СУЩЕСТВО НЕ ПРИХОДИТ')}${tog('postLight','ВСЁ ВИДНО · ТЕМНОТА 0')}${tog('postCold','ХОЛОД ВЫКЛ')}</div>`+
     `<div class="r65 wr">${btn('pcall',0,'ВЫЗВАТЬ СУЩЕСТВО')}${btn('pscare',0,'СТУК')}${btn('pscare',1,'ПУГАЛКА 2')}${btn('pscare',2,'ПУГАЛКА 3')}${btn('pstrobe',0,'СТРОБОСКОП')}${btn('pfig',0,'ФИГУРА')}${btn('proll',0,'ПОВЕРКА',P_.trig?'':'не в этом акте')}</div>`,'Акт загружается со своей контрольной точкой. «Пройти целиком» — итоги, тост и курс на 11, как в игре, но только в песочнице.');}
  else if(c==='mis'||c==='end'){const M=c==='end'?null:MISSIONS[G.m-1];const pl=G.state==='play'?'':'только в бою';
   ctxh=grp(c==='end'?'БЕСКОНЕЧНОСТЬ':'МИССИЯ','<p class="lv65" data-live="mis"></p>'+(c==='mis'?'<p class="lv65" data-live="mast"></p>':'')+
     `<div class="r65 wr">${btn('dv','kill','УБИТЬ ВСЕХ · K','',pl)}${M&&!M.beacon&&!M.boss?btn('dv','wave','СЛЕДУЮЩАЯ ВОЛНА · N','',pl):''}${M&&(M.boss||M.transmit||M.sboss)?btn('dv','boss',G.boss||G.jam||G.sb?'ФАЗА БОССА · N':'К БОССУ · N','',pl):''}${G.bc?btn('dv','charge','МАЯК +25%','',pl):''}${c==='end'?btn('dv','step','СЛЕДУЮЩАЯ СТУПЕНЬ','',pl):''}${btn('dv','lvl','УРОВЕНЬ МОДУЛЕЙ +1','',pl)}</div>`+
     (dvOn()?`<div class="r65">${btn('leave',0,'ПОКИНУТЬ МИССИЮ')}</div>`:''));}
  else ctxh=grp('КОНТЕКСТ','<p class="n65">Сейчас вы в секторе. Здесь появятся инструменты миссии, босса 50 или сторожевика, когда вы туда войдёте.</p>');
  const types=CODEX_ORDER.filter(k=>EDEF[k]&&!['boss','jam','lock','obheart','obseg','invcell','invcore','cpart'].includes(k));
  return ctxh+grp('ПРИЗВАТЬ',`<div class="r65"><select id="sp65" aria-label="Враг">${types.map(k=>`<option value="${k}">${EDEF[k].name}</option>`).join('')}</select></div><div class="r65">${[1,5,20].map(n=>btn('spawn',n,'×'+n,'',G.player&&(G.state==='world'||G.state==='play')?'':'нужен полёт')).join('')}${btn('killr',0,'УБИТЬ РЯДОМ')}</div>`,'В секторе — рядом с кораблем, в миссии — от края арены.')+
   grp('ВРЕМЯ · Shift+[ ]',seg('ts',G.dev.tpause?0:G.dev.tscale,[[0,'ПАУЗА'],[.25,'×¼'],[.5,'×½'],[1,'×1'],[2,'×2'],[4,'×4']])+`<div class="r65">${btn('stepf',0,'ОДИН КАДР · .','',G.dev.tpause?'':'сначала пауза')}</div>`+`<div class="tg65w">${tog('freeze','ЗАМОРОЗИТЬ ВРАГОВ И ПУЛИ')}</div>`,'Влияет на весь бой: врагов, пули, босса. На телефоне при открытой панели игра стоит сама.');},
 world(){if(!dvOn())return grp('ТОЛЬКО В ПЕСОЧНИЦЕ',btn('sandbox',1,'ОТКРЫТЬ ОТКРЫТЫЙ МИР','wide'));const S=G.save;const fogAll=S.reveal&&S.reveal.indexOf('0')<0;
  return grp('СОБЫТИЯ',`<div class="r65 wr">${btn('w58','storm','БУРЯ ЗДЕСЬ')}${btn('w58','pack','СТАЯ РЯДОМ')}${btn('w58','tug','БУКСИР')}${btn('w58','wander','СБРОС СТРАННИКА')}${btn('w58','reset','СБРОС СОБЫТИЙ')}</div>`,'Через игровую зацепку w58Dev: событие запускается так же, как в игре.')+
   grp('ТУМАН',`<div class="r65">${btn('fog',1,'ОТКРЫТЬ ВСЁ',fogAll?'on':'')}${btn('fog',0,'ЗАКРЫТЬ ВСЁ',!fogAll?'on':'')}</div>`,'Закрытый туман — чтобы проверить, как его видит новичок. Ворота от тумана не зависят.')+
   grp('СЛОИ',`<div class="tg65w">${tog('hit','ХИТБОКСЫ')}${tog('fps','FPS И ЧИСЛО ОБЪЕКТОВ')}</div>`);},
 prog(){if(!dvOn())return grp('ТОЛЬКО В ПЕСОЧНИЦЕ',btn('sandbox',1,'ОТКРЫТЬ ОТКРЫТЫЙ МИР','wide'));const S=G.save;const N=Number.isInteger(S.devProg)?S.devProg:doneCount();
  const flags=Object.keys(S.story||{}).filter(k=>['number','boolean'].includes(typeof S.story[k])).sort();
  const snaps=[1,2,3].map(i=>{const v=dvSnapGet(i);return `<div class="bm65"><span class="lv65">${i} · ${v?v.sec+' · '+new Date(v.t).toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'пусто'}</span>${btn('snapS',i,'СОХРАНИТЬ')}${btn('snapL',i,'ЗАГРУЗИТЬ','',v?'':'пусто')}</div>`;}).join('');
  return grp('КАМПАНИЯ',`<div class="r65"><input id="prog65" type="range" min="0" max="50" step="1" value="${N}" aria-label="Пройдено до"><b class="c65" id="progv65">${N}</b>${btn('prog',0,'ПРИМЕНИТЬ')}</div>`+`<div class="r65 wr">${[0,2,6,10,14,27,49,50].map(n=>btn('progq',n,String(n))).join('')}</div>`,'Пройдено до N: миссии, медали прохождения, ворота и флаг «Миг». До 10 — обучение снова живое (вкладка «Обучение»).')+
   grp('РЕСУРСЫ',`<div class="r65 wr">${btn('lom',500,'ЛОМ +500')}${btn('lom',5000,'+5 000')}${btn('lom0',0,'ЛОМ 0')}${btn('carry',100,'ГРУЗ +100')}</div><div class="r65">${btn('plvl',-1,'ПИЛОТ −')}<b class="c65">УР. ${S.pilot&&S.pilot.lvl||1}</b>${btn('plvl',1,'ПИЛОТ +')}${btn('plvl',10,'+10')}</div>`)+
   grp('СЮЖЕТ · ЦИКЛ '+roman(S.cycle||1),`<div class="r65 wr">${btn('read',0,'ВСЕ ЗАПИСИ')}${btn('frag',0,'ФРАГМ. 0')}${btn('frag',6,'6')}${btn('frag',15,'15')}${btn('ero',0,'ЭРОЗИЯ 0')}${btn('ero',.5,'0,5')}${btn('ero',1,'1')}${btn('cyc',-1,'ЦИКЛ −')}${btn('cyc',1,'ЦИКЛ +')}</div>`+
     (flags.length?`<div class="fl65">${flags.map(k=>`<button data-a="flag" data-v="${k}" class="${S.story[k]?'on':''}"><span>${k}</span><b>${String(S.story[k])}</b></button>`).join('')}</div>`:''),'Флаги сюжета: нажатие — следующее значение (0 → 1 → 2 → 3 → 0).')+
   grp('СНИМКИ · F5 / F9',snaps,'Снимок — вся песочница с позицией. F5 — в слот 1, F9 — из слота 1.')+
   grp('ИСТОЧНИК',`<div class="r65 wr">${btn('mine',0,DVX.arm.mine?'ТОЧНО? НАЖМИТЕ ЕЩЁ РАЗ':'КОПИЯ МОЕГО ПРОГРЕССА',DVX.arm.mine?'arm':'')}${btn('reset',0,DVX.arm.reset?'ТОЧНО? НАЖМИТЕ ЕЩЁ РАЗ':'СБРОСИТЬ ПЕСОЧНИЦУ',DVX.arm.reset?'arm':'')}</div>`,'Копия читает настоящее сохранение и больше его не трогает — обратного пути нет ни в одной кнопке.');},
 tut(){if(!dvOn())return grp('ТОЛЬКО В ПЕСОЧНИЦЕ',btn('sandbox',1,'ОТКРЫТЬ ОТКРЫТЫЙ МИР','wide'));const T=tutT()||{done:{},seen:{}};const cur=TUT.cur&&TUT.cur.k;
  const rows=TUT_PRI.filter(k=>TUT_L[k]).map(k=>{const st=cur===k?'ИДЁТ':T.done[k]?(T.ok&&T.ok[k]?'ЗАСЧИТАН':'СДЕЛАН'):'ЖДЁТ';const why=DVX.why===k;
    return `<div class="tu65${cur===k?' cur':''}${T.done[k]?' done':''}"><b>${TUT_NM65[k]||k}</b><span>${st}</span>${btn('tutgo',k,'▶')}${btn('tutrs',k,'↺','',T.done[k]||T.seen&&T.seen[k]?'':'')}${btn('tutwhy',k,'?',why?'on':'')}${why?`<ul>${dvTutWhy(k).map(x=>`<li>${x}</li>`).join('')}</ul>`:''}</div>`;}).join('');
  const blk=dvTutBlock();return grp('ОБУЧЕНИЕ',`<p class="lv65">${blk?'⚠ ВЫКЛЮЧЕНО ИГРОЙ: '+blk:G.dev.tut?(TUT.cur?'ИДЁТ УРОК «'+(TUT_NM65[TUT.cur.k]||TUT.cur.k)+'»':'АКТИВНО · ЖДЁТ ПОВОДА'):'ВЫКЛЮЧЕНО ПЕРЕКЛЮЧАТЕЛЕМ'}</p>`+(blk?`<div class="r65">${btn('tutprep',2,'ПРОЙДЕНО ДО 2 · КОРАБЛЬ К МИССИИ 03','wide')}</div>`:'')+`<div class="tg65w">${tog('tut','ПОДСКАЗКИ ОБУЧЕНИЯ В ПЕСОЧНИЦЕ')}</div><div class="r65 wr">${btn('tutall',1,'ВСЕ СДЕЛАНЫ')}${btn('tutall',0,'СБРОСИТЬ ВСЁ')}</div>`,'Подсказки ведут себя как у нового пилота. Обучение само кончается после миссии 10 и в секторе III — для проверки поставьте «пройдено до» меньше 10.')+
   grp('УРОКИ · ПОРЯДОК ОЧЕРЕДИ',rows,'▶ — показать сейчас, ↺ — сбросить один, ? — почему урок не начинается.');},
 dbg(){return grp('СИД БОЯ',`<div class="r65"><input id="seed65" inputmode="numeric" value="${G.dev.seed}" aria-label="Сид">${btn('seed',0,'ПРИМЕНИТЬ')}${btn('seedrnd',0,'НОВЫЙ')}</div>`+seg('seedOn',G.dev.seedOn?1:0,[[0,'СЛУЧАЙНЫЙ'],[1,'ФИКСИРОВАННЫЙ']]),'Фиксированный сид действует со следующего входа в миссию: раскладка, брифинг и бой повторяются один в один — сколько бы вы ни читали брифинг. Звук (1.4.1), взрывы и отрисовка (1.4.5) на бой не влияют; держите одинаковые «Эффекты». Для повтора удобно: снимок в тихом месте → бой → тот же снимок. Стычка в секторе перед входом тоже меняет начало миссии.')+
   grp('СОСТОЯНИЕ','<p class="lv65" data-live="perf"></p><p class="lv65" data-live="guard"></p><p class="lv65" data-live="errs"></p>'+`<div class="r65 wr">${btn('report',0,'КОПИРОВАТЬ ОТЧЁТ')}${btn('errsee',0,'ОШИБКИ ПОДРОБНО','',DVX.errs.length?'':'ошибок нет')}${btn('logclr',0,'ОЧИСТИТЬ ЖУРНАЛ')}</div>`+(DVX.errOpen?`<div class="er65">${DVX.errs.slice().reverse().map(e=>`<p><b>${new Date(e.t).toTimeString().slice(0,8)}</b> ${e.m}<br><i>${e.s||''}</i></p>`).join('')}</div>`:''))+
   grp('ЖУРНАЛ СОБЫТИЙ','<div id="log65" class="lg65"></div>','200 последних: прыжки, входы и выходы, гибели, уроки, баннеры, снимки.')+
   grp('КЛАВИШИ',`<div class="kg65">${[['Ё / `','панель'],['G','бессмертие по кругу'],['H','полное здоровье'],['[ ]','скорость полёта'],['Shift+[ ]','скорость времени'],['.','пауза / один кадр'],['0–9, Enter','к миссии · Shift+Enter — войти'],['I · O','сторожевик · босс 50'],['Backspace','назад'],['Ctrl+1/2/3 · Alt+1/2/3','закладка: запомнить · прыжок'],['F5 · F9','снимок: сохранить · загрузить'],['K · N','убить всех · дальше'],['Alt+клик на карте','прыжок в точку'],['ESC дважды','выход из режима']].map(([k,v])=>`<kbd>${k}</kbd><span>${v}</span>`).join('')}</div>`,'Клавиши работают только в режиме разработчика и не пересекаются с игровыми.');}};

/* ---------- действия ---------- */
function dvxChange(e){const t=e.target;if(t.id==='prog65'){const v=$('#progv65');if(v)v.textContent=t.value;}}
document.addEventListener('input',e=>{if(e.target&&e.target.id==='prog65'){const v=$('#progv65');if(v)v.textContent=e.target.value;}});
function dvxClick(e){const b=e.target.closest('[data-a]');if(!b||b.disabled)return;/* мышью — снимаем фокус: иначе Пробел (рывок) нажмёт эту кнопку ещё раз */if(e.detail>0&&b.blur)b.blur();const a=b.dataset.a,v=b.dataset.v;try{dvAct(a,v,e);}catch(er){console.error(er);devLog('err','действие '+a+': '+er.message);}try{buzz('tap');}catch(er){}}
function dvAct(a,v,e){const S=G.save,p=G.player;let rr=true;
  switch(a){
  case 'close':dvxClose();return;
  case 'tab':G.dev.dvTab=v;dvSave();DVX.why=null;DVX.errOpen=false;break;
  case 'exit':dvxClose();if(dvOn())DEVW.exit();else openDev();return;
  case 'sandbox':dvxClose();DEVW.enter();return;
  case 'god':G.dev.god=+v===2;G.dev.god1=+v===1;dvSave();devLog('dev','бессмертие '+v);break;
  case 'tog':G.dev[v]=!G.dev[v];dvSave();devLog('dev',v+' '+(G.dev[v]?'вкл':'выкл'));if(v==='tut'&&G.dev.tut){const T=tutT();if(T&&(S.cleared||0)<CORE&&!(G.player&&sectorIdx(G.player.x,G.player.y)>=2))T.off=0;}break;
  case 'heal':if(p){p.hp=G.st.maxHp;p.en=100;floater(p.x,p.y-40,'ЗДОРОВЬЕ · ПОЛНОЕ','#00ff88');}break;
  case 'wspd':G.dev.wspeed=+v;dvSave();try{DEVW.ui();}catch(er){}break;
  case 'skin':{if(!S)break;const L=(S.ownSkins&&S.ownSkins.length?S.ownSkins:Object.keys(SKINS)).filter(k=>SKINS[k]);const i=L.indexOf(S.skin||'base');S.skin=L[(i+(+v)+L.length)%L.length];if(p)floater(p.x,p.y-40,'КОРПУС · '+((SKINS[S.skin]||{}).name||S.skin),'#00ff88');if(dvOn())saveWorld();break;}
  case 'skins':if(!S)break;S.ownSkins=v==='all'?Object.keys(SKINS):['base'];S.skins=S.ownSkins.slice();if(v!=='all')S.skin='base';saveWorld();break;
  case 'node':if(e&&e.shiftKey){dvGoNode(v==='post'?'post':+v,true);return;}dvGoNode(v==='post'?'post':+v,false);return;
  case 'enter':dvxClose();dvGoNode(v==='post'?'post':+v,true);return;
  case 'place':{const P_=DV_PLACES.find(x=>x[0]===v);const q=P_&&P_[2]();if(q)devJump(q.x,q.y+(v==='abyss'||v==='zero'||v==='post'||v==='gate'?0:150),P_[1].toLowerCase(),{exact:v==='zero'||v==='post'});return;}
  case 'sec':{const q=dvSecC(+v);if(q)devJump(q.x,q.y,'сектор '+roman(+v+1));return;}
  case 'near':dvNear(v);return;
  case 'back':dvBack();return;
  case 'copypos':if(p)dvCopy(Math.round(p.x)+' '+Math.round(p.y),'Координаты корабля в буфере.');return;
  case 'bmset':if(p){G.dev.bm[+v]={x:Math.round(p.x),y:Math.round(p.y),label:sectorName(p.x,p.y)};dvSave();toast('ЗАКЛАДКА '+(+v+1),G.dev.bm[+v].label);}break;
  case 'bmgo':{const q=G.dev.bm[+v];if(q)devJump(q.x,q.y,'закладка '+(+v+1),{exact:1});else toast('ЗАКЛАДКА '+(+v+1),'Пусто. Ctrl+'+(+v+1)+' — запомнить место.');return;}
  case 'xy':{const t=($('#xy65')||{}).value||'';const m=t.match(/-?\d+(?:[.,]\d+)?/g);if(m&&m.length>=2)devJump(+m[0].replace(',','.'),+m[1].replace(',','.'),'координаты',{exact:1});else toast('КООРДИНАТЫ','Введите два числа: X Y');return;}
  case 'zbskip':{const Z=G.zb;let n=0;while(G.zb&&['silence','walls','expand','spawn'].includes(G.zb.k)&&n++<900){if(G.player)G.player.hp=Math.max(G.player.hp,1);worldUpdate(1/60);}devLog('zb','вход пропущен → '+(G.zb?G.zb.k:'—'));break;}
  case 'zbst':{const Z=G.zb;if(!Z||!Z.boss)break;for(const q of G.enemies)if(q.alive&&q.zb===2)q.alive=false;Z.clones=[];Z.k='fight';Z.t=0;Z.stall=0;Z.lunge=0;G.wtg95=[];G.eb=[];Z.boss.ghost=false;Z.boss.zbHide=0;zbStageInit(Z,+v);devLog('zb','стадия '+v);break;}
  case 'zbhp':{const Z=G.zb;if(Z&&Z.k==='fight'){Z.hp=Math.max(1,Math.round(Z.segMax*(+v)/100));devLog('zb','сегмент '+v+'%');}break;}
  case 'zbstun':{const Z=G.zb;if(Z&&Z.k==='fight'){Z.stun=0;Z.stgLock=0;zbStg(Z,100);}break;}
  case 'zbatk':{const Z=G.zb;if(Z&&Z.k==='fight'&&Z.boss){Z.cool=0;Z.wind=0;zbAtk(Z,v);devLog('zb','атака '+v);}break;}
  case 'zbchoice':{const Z=G.zb;if(Z&&Z.boss){Z.k='choice';Z.t=0;dvxClose();zbOpenChoice(Z);return;}break;}
  case 'zbleave':dvLeave();break;
  case 'zbagain':{dvLeave();G.zbCool=0;const n=WORLD.nodes[49];devJump(n.x,n.y+100,'босс 50',{exact:1,quiet:1});setTimeout(()=>{try{G.zbCool=0;zbStart();if(DVX.open)dvxRender();}catch(er){console.error(er);}},60);return;}
  case 'pact':if(G.post){postLoadAct(+v,G.player.hp);devLog('post','акт '+(+v+1));}break;
  case 'ptask':{const P_=G.post;if(!P_)break;P_.panels.forEach(q=>{q.on=true;q.h=9;});P_.cells.forEach(q=>q.got=true);P_.gens.forEach(q=>{q.on=true;q.h=9;});if(P_.core&&!P_.core.on)P_.core.h=4;devLog('post','задачи акта выполнены');break;}
  case 'pdoor':if(G.post&&G.post.door){G.post.door.open=true;G.post.door.k=1;}break;
  case 'pwin':if(G.post){dvxClose();postWin();return;}break;
  case 'pcall':if(G.post&&G.post.O){G.dev.postFreeze=false;G.post.O.cd=0;}break;
  case 'pscare':if(G.post){G.post.events['sc'+v]=0;G.post.scDone['sc'+v]=0;G.post.scares=Math.min(G.post.scares,3);postScare(+v);}break;
  case 'pstrobe':if(G.post)postStrobe(true);break;
  case 'pfig':if(G.post&&p){const a=G.post.aim||0;postFig('crew',p.x+Math.cos(a)*160,p.y+Math.sin(a)*160,1.2);}break;
  case 'proll':if(G.post&&G.post.trig)postRollCall();break;
  case 'leave':dvLeave();break;
  case 'dv':devAct(v);break;
  case 'spawn':{const t=($('#sp65')||{}).value;if(!t||!p||!EDEF[t])break;const n=+v;for(let i=0;i<n;i++){if(G.world&&G.state==='world'){const ang=Math.random()*TAU,d=380+Math.random()*220;spawnEnemy(t,p.x+Math.cos(ang)*d,p.y+Math.sin(ang)*d);}else if(G.state==='play'){if(t==='twin')directorSpawn('twin');else edgeSpawn(t);}}devLog('spawn',t+' ×'+n);break;}
  case 'killr':{if(!p)break;let n=0;for(const q of G.enemies.slice())if(q.alive&&!dvBossy(q)&&Math.hypot(q.x-p.x,q.y-p.y)<1100){kill(q,false);n++;}devLog('kill','убито рядом: '+n);break;}
  case 'ts':if(+v===0){G.dev.tpause=true;}else{G.dev.tpause=false;G.dev.tscale=+v;}dvSave();devLog('dev','время '+(G.dev.tpause?'пауза':'×'+G.dev.tscale));break;
  case 'stepf':DVX.step=1;break;
  case 'w58':if(typeof W58DEV==='function'){W58DEV(v);devLog('world','событие '+v);}break;
  case 'fog':if(S){S.reveal=(+v?'1':'0').repeat(FGW*FGH);try{MAPC.fog=null;MAPC.fogVer=null;if(typeof FOGC!=='undefined')FOGC.k=null;}catch(er){}saveWorld();}break;
  case 'prog':{const el=$('#prog65');if(el)dvSetProg(+el.value);break;}
  case 'progq':dvSetProg(+v);break;
  case 'tutprep':{dvSetProg(+v);G.dev.tut=true;dvSave();const T=tutT();if(T){T.off=0;}const n=WORLD.nodes[+v];devJump(n.x,n.y+400,'обучение');break;}
  case 'lom':if(S){S.lom+=+v;G.lomPrev=undefined;saveWorld();}break;
  case 'lom0':if(S){S.lom=0;S.carry=0;G.lomPrev=undefined;saveWorld();}break;
  case 'carry':if(S){S.carry=(S.carry||0)+(+v);G.lomPrev=undefined;saveWorld();}break;
  case 'plvl':if(S){S.pilot=S.pilot||{lvl:1,xp:0};S.pilot.lvl=clamp((S.pilot.lvl||1)+(+v),1,60);S.pilot.xp=0;try{computeStats();}catch(er){}saveWorld();}break;
  case 'read':VOID_DBG.readAll();saveWorld();break;
  case 'frag':VOID_DBG.frags(+v);saveWorld();break;
  case 'ero':VOID_DBG.erosion(+v);saveWorld();break;
  case 'cyc':if(S){S.cycle=clamp((S.cycle||1)+(+v),1,9);saveWorld();}break;
  case 'flag':if(S&&S.story){const c=S.story[v];S.story[v]=typeof c==='boolean'?!c:((+c||0)+1)%4;saveWorld();devLog('flag',v+' = '+S.story[v]);}break;
  case 'snapS':dvSnapSave(+v);return;
  case 'snapL':dvxClose();dvSnapLoad(+v);return;
  case 'mine':if(!DVX.arm.mine){DVX.arm.mine=1;setTimeout(()=>{DVX.arm.mine=0;if(DVX.open)dvxRender();},4000);break;}DVX.arm.mine=0;dvxClose();dvCopyMine();return;
  case 'reset':if(!DVX.arm.reset){DVX.arm.reset=1;setTimeout(()=>{DVX.arm.reset=0;if(DVX.open)dvxRender();},4000);break;}DVX.arm.reset=0;dvxClose();dvLeave();try{LS.removeItem(DEVW.KEY);}catch(er){}saveSet6(null,'dev');DEVW.enter();toast('ПЕСОЧНИЦА СБРОШЕНА','Открытый мир разработчика начат заново.');return;
  case 'tutgo':{if(dvTutBlock()){toast('ОБУЧЕНИЕ ВЫКЛЮЧЕНО ИГРОЙ',dvTutBlock()+' «Прогресс» → «пройдено до» меньше 10 и полёт в секторах I–II.');break;}if(!G.dev.tut){G.dev.tut=true;dvSave();}const T=tutT();if(T){T.off=0;delete T.done[v];}if(TUT.cur)tutEnd('abort');TUT.gap=0;tutStart(v);if(TUT.cur)TUT.cur.forced=1;try{tutDraw(performance.now());}catch(er){}break;}
  case 'tutrs':{const T=tutT();if(T){delete T.done[v];if(T.seen)delete T.seen[v];if(T.ok)delete T.ok[v];tutSave();}break;}
  case 'tutwhy':DVX.why=DVX.why===v?null:v;break;
  case 'tutall':{const T=tutT();if(!T)break;if(+v){for(const k of Object.keys(TUT_L))T.done[k]=1;if(TUT.cur)tutEnd('abort');}else{T.done={};T.seen={};T.ok={};T.off=0;TUT.hist=[];TUT.gap=0;}tutSave();break;}
  case 'seed':{const n=parseInt((($('#seed65')||{}).value||'').replace(/\D/g,''),10);if(n>0){G.dev.seed=n;G.dev.seedOn=true;dvSave();toast('СИД '+n,'Со следующего входа в миссию.');}break;}
  case 'seedrnd':G.dev.seed=1+Math.floor((DVX.mr||Math.random)()*99999);G.dev.seedOn=true;dvSave();break;
  case 'seedOn':G.dev.seedOn=+v===1;dvSave();break;
  case 'report':dvCopy(dvReport(),'Отчёт в буфере — вставьте его в сообщение о баге.');DVX.errs.forEach(x=>x.seen=1);break;
  case 'errsee':DVX.errOpen=!DVX.errOpen;DVX.errs.forEach(x=>x.seen=1);break;
  case 'logclr':DVX.log.length=0;break;
  default:rr=false;}
  if(rr&&DVX.open)dvxRender();dvxBar();}

/* ---------- дев-полоса: состояние чипами ---------- */
function dvxBar(){const bar=$('#devBar');if(!bar||!devAny()){return;}const sb=dvOn();const chips=[];
  chips.push(`<span class="c0">РАЗРАБОТКА · ${sb?'ПЕСОЧНИЦА':G.mode==='endless'?'БЕСКОНЕЧНОСТЬ':'МИССИИ'}</span>`);
  const g=devGod();if(g)chips.push(`<button data-b="god" class="on">${g===2?'БЕССМЕРТИЕ':'1 HP'}</button>`);
  if(sb&&DEVW.spd&&DEVW.spd()!==1)chips.push(`<button data-b="wspd" class="on">ПОЛЁТ ×${String(DEVW.spd()).replace('.',',')}</button>`);
  if(G.dev.tpause)chips.push('<button data-b="ts" class="on">ПАУЗА</button>');else if(G.dev.tscale!==1)chips.push(`<button data-b="ts" class="on">ВРЕМЯ ×${G.dev.tscale===.25?'¼':G.dev.tscale===.5?'½':G.dev.tscale}</button>`);
  if(G.dev.seedOn)chips.push(`<button data-b="seed" class="on">СИД ${G.dev.seed}</button>`);
  const ne=DVX.errs.filter(x=>!x.seen).length;if(ne)chips.push(`<button data-b="err" class="er">⚠ ${ne}</button>`);
  chips.push(`<button data-b="panel">${touchMode?'ПАНЕЛЬ':'Ё ПАНЕЛЬ'}</button>`);
  const h=chips.join('');if(bar.dataset.h!==h||!bar.querySelector('.c0')){bar.innerHTML=h;bar.dataset.h=h;}bar.classList.add('chips65');
  /* на телефоне при выборе модуля полоса не ложится на карточки */if(isMob()&&G.state==='levelup')bar.hidden=true;}
{const _u=DEVW.ui;DEVW.ui=function(){const r=_u.apply(this,arguments);try{if(devAny())dvxBar();}catch(e){}return r;};}
{const _s=show;show=function(){const r=_s.apply(this,arguments);try{if(devAny())dvxBar();if(DVX.open&&!['world','play','levelup','pause','map'].includes(G.state))dvxClose();}catch(e){}return r;};}
$('#devBar').addEventListener('click',e=>{const b=e.target.closest('[data-b]');if(!b)return;e.stopPropagation();const k=b.dataset.b;
  if(k==='panel')dvxOpen();if(k==='god'){G.dev.dvTab='ship';dvSave();dvxOpen(true);}if(k==='ts'||k==='seed'||k==='err'){G.dev.dvTab=k==='ts'?'fight':'dbg';if(k==='err')DVX.errOpen=true;dvSave();dvxOpen(true);}if(k==='wspd'){G.dev.dvTab='ship';dvSave();dvxOpen(true);}});
setInterval(()=>{try{if(devAny()){const W=DEVW.stats?DEVW.stats():null;const n=W?(W.warn||[]).length:0;if(n>DVX.lastWarn){devLog('guard','запись в настоящее сохранение заблокирована');DVX.lastWarn=n;}dvxBar();}}catch(e){}},1000);

/* ---------- клавиши (только в деве) ---------- */
const DVK={buf:'',t:0};
addEventListener('keydown',e=>{if(!devAny())return;const t=e.target;if(t&&t.tagName&&/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))return;const st=G.state;if(!['world','play','map','levelup'].includes(st))return;const c=e.code;let used=true;
  const fly=st==='world'||st==='play';
  if(c==='KeyG'&&fly&&!e.ctrlKey&&!e.metaKey){const g=(devGod()+1)%3;G.dev.god=g===2;G.dev.god1=g===1;dvSave();if(G.player)floater(G.player.x,G.player.y-40,['БЕССМЕРТИЕ ВЫКЛ','ДЕРЖАТЬ 1 HP','БЕССМЕРТИЕ ПОЛНОЕ'][g],'#00ff88');}
  else if(c==='KeyH'&&fly)dvAct('heal');
  else if((c==='BracketLeft'||c==='BracketRight')&&e.shiftKey&&fly){const L=[.25,.5,1,2,4];let i=G.dev.tpause?-1:L.indexOf(G.dev.tscale);if(i<0&&!G.dev.tpause)i=2;if(G.dev.tpause){G.dev.tpause=false;G.dev.tscale=c==='BracketRight'?.25:.25;}else{i=clamp(i+(c==='BracketRight'?1:-1),0,L.length-1);G.dev.tscale=L[i];}dvSave();if(G.player)floater(G.player.x,G.player.y-40,'ВРЕМЯ ×'+String(G.dev.tscale).replace('.',','),'#00ff88');}
  else if(c==='Period'&&fly){if(!G.dev.tpause){G.dev.tpause=true;}else DVX.step=1;dvSave();}
  else if(c==='KeyK'&&st==='play'){devAct('kill');}
  else if(c==='KeyK'&&st==='world'&&dvOn())dvAct('killr');
  else if(c==='KeyN'&&(st==='play'||G.zb||G.post)){if(G.zb&&G.zb.boss){dvAct('zbst',String(Math.min(4,(G.zb.stage||1)+1)));}else if(G.post){if(G.post.act<POST_ACTS.length-1)dvAct('pact',String(G.post.act+1));}else{const M=MISSIONS[G.m-1];devAct(M&&(M.boss||M.transmit||M.sboss)?'boss':'wave');}}
  else if(dvOn()&&st==='world'&&c==='Backspace')dvBack();
  else if(dvOn()&&/^Digit[1-3]$/.test(c)&&(e.ctrlKey||e.altKey)){const i=+c.slice(5)-1;if(e.ctrlKey)dvAct('bmset',String(i));else dvAct('bmgo',String(i));}
  else if(dvOn()&&(c==='F5'||c==='F9')&&st==='world'){if(c==='F5')dvSnapSave(1);else dvSnapLoad(1);}
  else if(dvOn()&&DVX.open&&st==='world'&&/^(Digit|Numpad)[0-9]$/.test(c)){const d=c.slice(-1);DVK.buf=(performance.now()-DVK.t<1500?DVK.buf:'')+d;DVK.buf=DVK.buf.slice(-2);DVK.t=performance.now();const P=$('#dvx');P&&P.querySelectorAll('.m65').forEach(x=>x.classList.toggle('hl',(x.querySelector('.mj b')||{}).textContent===pad2(+DVK.buf)));}
  else if(dvOn()&&DVX.open&&st==='world'&&(c==='Enter'||c==='NumpadEnter')&&DVK.buf&&performance.now()-DVK.t<4000){const m=+DVK.buf;DVK.buf='';if(m>=1&&m<=50)dvGoNode(m,e.shiftKey);}
  else if(dvOn()&&DVX.open&&st==='world'&&(c==='KeyI'||c==='KeyO')){dvGoNode(c==='KeyI'?'post':50,e.shiftKey);}
  else used=false;
  if(used){e.preventDefault();e.stopImmediatePropagation();dvxBar();if(DVX.open)setTimeout(dvxRender,0);}},true);

/* ---------- прыжок по карте: Alt+клик, долгое нажатие ---------- */
{const cv=$('#mapC');if(cv){const P0={};cv.addEventListener('pointerdown',e=>{P0[e.pointerId]={x:e.clientX,y:e.clientY,t:performance.now()};},true);
  cv.addEventListener('pointerup',e=>{const q=P0[e.pointerId];delete P0[e.pointerId];if(!dvOn()||G.state!=='map'||!q||!G.mapXY)return;const moved=Math.hypot(e.clientX-q.x,e.clientY-q.y),held=performance.now()-q.t;
    if(!(e.altKey&&moved<6)&&!(e.pointerType!=='mouse'&&held>600&&moved<10))return;const r=cv.getBoundingClientRect(),M=G.mapXY;const wx=M.ox+(e.clientX-r.left)/M.k,wy=M.oy+(e.clientY-r.top)/M.k;
    e.stopImmediatePropagation();e.preventDefault();closeMap();devJump(wx,wy,'карта');},true);}}

/* ---------- мелочи ---------- */
/* сторожевик из сетки миссий (devStart) больше не запускается в режиме dev — только через песочницу */
{const _oi=openIntro;openIntro=function(i){if(G.mode==='dev'&&(i===POST_I||i===49)){devGo(i===POST_I?'post':'zb');return;}return _oi.apply(this,arguments);};}

