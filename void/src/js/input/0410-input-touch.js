// ---------- Ввод ----------
let touchMode=window.matchMedia&&matchMedia('(pointer:coarse)').matches;
// 0.6.0: три оси адаптации — ввод (G.input), форм-фактор (G.ff), качество (G.q). ПК (ff-desk + kbm) не меняется.
const MOBQ=window.matchMedia?matchMedia('(pointer:coarse)'):null;
G.input=touchMode?'touch':'kbm';G.ff='desk';G.q=2;
let inputT=0,mouseAcc=0,synthKey=false;
document.documentElement.lang='ru';document.documentElement.dataset.input=G.input;
function setInput(m){if(G.input===m)return;if(G.input==='touch'&&m!=='touch'&&performance.now()-inputT<500)return;
  G.input=m;touchMode=m==='touch';document.documentElement.dataset.input=m;for(const k in hudCache)delete hudCache[k];
  try{ffUpdate();$('#touch').hidden=!(touchMode&&(G.state==='play'||G.state==='world'));updateCursor();renderSettings();G.cardKey=null;if(typeof layoutTouch==='function')layoutTouch();}catch(e){console.error(e);}}
function ffUpdate(){setTimeout(()=>{try{FS.sync();}catch(e){}},0);const vv=window.visualViewport,w=vv&&vv.width?vv.width:innerWidth,h=vv&&vv.height?vv.height:innerHeight,sm=Math.min(w,h);
  const dev=(MOBQ&&MOBQ.matches)||G.input==='touch';
  const ff=!dev?'desk':sm<600?(h>w?'phone-p':'phone-l'):sm<=1000?'tablet':'desk';
  G.ff=ff;const c=document.documentElement.classList;for(const k of ['desk','phone-p','phone-l','tablet'])c.toggle('ff-'+k,k===ff);
  c.toggle('mob',ff!=='desk');c.toggle('lefty',ff!=='desk'&&SET.hand==='l');}
function isMob(){return G.ff!=='desk';}
function isPortrait(){return G.ff==='phone-p'||(G.ff==='tablet'&&CH>CW);}
// подсказки управления без клавиш на касаниях
function kh(s){if(!touchMode||typeof s!=='string')return s;
  return s.replace(/\s*\[(?:[A-ZЁ]|ESC|ENTER|TAB|F11)\]/g,'').replace(/WASD или стрелки — движение/g,'Стик слева — движение').replace(/ПРОБЕЛ — рывок/g,'Кнопка РЫВОК — рывок').replace(/E или Shift — импульс/g,'Кнопка ИМП — импульс').replace(/Клик по врагу \(или касание\)/g,'Касание врага').replace(/ · J — все журналы/g,' · журналы — на карте').replace(/J — все журналы/g,'журналы — на карте');}
// системная кнопка «назад» = Esc (только на телефоне и планшете)
let histOn=false;
function histArm(){if(histOn||!isMob())return;try{history.pushState({v:1},'');histOn=true;}catch(e){}}
function escAction(){synthKey=true;try{dispatchEvent(new KeyboardEvent('keydown',{code:'Escape',key:'Escape'}));}finally{synthKey=false;KEYS.Escape=false;}}
addEventListener('popstate',()=>{histOn=false;if(G.state==='menu')return;if(performance.now()-(FS.chgAt||0)<300){histArm();return;}escAction();histArm();});
addEventListener('keydown',e=>{
  if(cfmKey(e))return;if(e.target&&e.target.tagName==='INPUT')return;if(!synthKey&&!e.repeat)setInput('kbm');
  if(!$('#fsCard').hidden){if(e.code==='Escape'||e.code==='Enter'){e.preventDefault();FS.card(false);}return;}
  if(e.code==='F11'||(e.code==='Enter'&&e.altKey)||(e.code==='KeyF'&&e.ctrlKey&&e.metaKey)){if(FS.is()||FS.can()){e.preventDefault();FS.toggle('key');return;}}
  if(G.state==='settings'&&e.code==='Escape'){closeSettings();return;}
  if(G.state==='intro'&&e.code==='Escape'&&synthKey){if(!$('#bIntroBack').hidden)$('#bIntroBack').click();return;}
  if(G.prologue){prologueSkip();e.preventDefault();return;}
  /*DEVW*/if(window.DEVW&&DEVW.on()&&DEVW.key(e))return;
  KEYS[e.code]=true;
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)&&G.state==='play')e.preventDefault();
  if((G.state==='world'||G.state==='play')&&e.code==='KeyT'){SET.manual=!SET.manual;saveSet();updateCursor();if(G.player)floater(G.player.x,G.player.y-40,SET.manual?'ПРИЦЕЛ · РУЧНОЙ':'ПРИЦЕЛ · АВТО','#8fe9ff');}
  if(G.state==='world'){
    if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].includes(e.code))e.preventDefault();
    if(e.code==='KeyJ'){openMap('jr');return;}
    if(e.code==='Space')tryDash();if(e.code==='KeyE'||e.code==='ShiftLeft'||e.code==='ShiftRight')tryPulse();
    if(e.code==='KeyF'||e.code==='Enter')cardAct('main');
    if(e.code==='KeyM'||e.code==='Tab')openMap();if(e.code==='Escape'||e.code==='KeyP')pause();return;}
  if(G.state==='map'){if(['KeyM','Tab','Escape'].includes(e.code)){e.preventDefault();closeMap();}else if(e.code==='KeyJ')mapTab(G.mapTab==='jr'?'map':'jr');return;}
  if(G.state==='shop'){if(e.code==='Escape')closeShop();return;}
  if(G.state==='hangar'){if(e.code==='Escape')closeHangar();return;}
  if(G.state==='arsenal'){if(e.code==='Escape')closeArsenal();return;}
  if(G.state==='cycle'){if(e.code==='Escape')closeCycle();return;}
  if(G.state==='save'||G.state==='dev'){if(e.code==='Escape')toMenu();return;}
  if(e.code==='Backquote'&&devAny()&&G.state==='play'){toggleDevPanel();return;}
  if(G.state==='play'){if(e.code==='Space')tryDash();if(e.code==='KeyE'||e.code==='ShiftLeft'||e.code==='ShiftRight')tryPulse();if(e.code==='Escape'||e.code==='KeyP')pause();}
  else if(G.state==='pause'&&(e.code==='Escape'||e.code==='KeyP'))resume();
  else if(G.state==='levelup'&&/^Digit[123]$/.test(e.code))choose(+e.code.slice(5)-1);
  else if(G.state==='levelup'&&e.code==='KeyA'&&G.briefQ>0)autoPick();
  else if(G.state==='menu'){if(e.code==='Enter'&&document.activeElement.tagName!=='BUTTON')startWorld(false);if(e.code==='KeyC')openCodex('menu');}
  else if(G.state==='codex'&&e.code==='Escape')closeCodex();
  else if(G.state==='intro'&&e.code==='Enter'&&document.activeElement.tagName!=='BUTTON'){e.preventDefault();startMission();}
});
addEventListener('keyup',e=>{KEYS[e.code]=false;});
addEventListener('blur',()=>{for(const k in KEYS)KEYS[k]=false;CHG.m=false;CHG.t=false;MOUSE.down=false;pause();lifeSave();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();lifeSave();}});
function lifeSave(){try{for(const k in KEYS)KEYS[k]=false;CHG.m=false;CHG.t=false;CHG.p=false;if(joy.on){joy.on=false;joy.id=null;joy.x=joy.y=0;$('#joy').style.display='none';}SW.clear();
  if(G.mode==='world'&&G.world&&G.player&&G.save&&!(window.DEVW&&DEVW.on()))saveWorld();if(isMob()&&AU.ctx&&AU.ctx.state==='running'&&document.hidden)AU.ctx.suspend();}catch(e){console.error(e);}}
addEventListener('pagehide',lifeSave);
addEventListener('pointerdown',()=>{if(isMob())audioInit();},true);
cv.addEventListener('mousedown',e=>{if(e.button===2)CHG.m=true;if(e.button===0)MOUSE.down=true;});
addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;MOUSE.mvAt=performance.now();if(G.input!=='kbm'){mouseAcc+=Math.abs(e.movementX||0)+Math.abs(e.movementY||0);if(mouseAcc>8){mouseAcc=0;setInput('kbm');}}MOUSE.sx=e.clientX;MOUSE.sy=e.clientY;if(!MOUSE.moved){MOUSE.moved=true;}});
addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){inputT=performance.now();setInput('touch');}else if(e.pointerType==='mouse')setInput('kbm');},true);
addEventListener('mouseup',e=>{if(e.button===2)CHG.m=false;if(e.button===0)MOUSE.down=false;});
addEventListener('contextmenu',e=>{if(G.state==='play'||G.state==='world'||e.target===cv)e.preventDefault();});
// ---------- 0.6.0: сенсорное управление ----------
let SAFE={t:0,r:0,b:0,l:0},TBR={};
const TBL={dash:{d:88,dx:92,dy:92},pulse:{d:64,dx:190,dy:64},charge:{d:64,dx:64,dy:190},act:{d:64,dx:190,dy:190}};
function readSafe(){const el=$('#safeProbe');if(!el)return;const cs=getComputedStyle(el);SAFE={t:parseFloat(cs.paddingTop)||0,r:parseFloat(cs.paddingRight)||0,b:parseFloat(cs.paddingBottom)||0,l:parseFloat(cs.paddingLeft)||0};}
function joyR(){return isMob()?56*(SET.btnSize||1):55;}
function joyFixed(){const k=SET.btnSize||1,R=joyR();const x=SET.hand==='l'?CW-SAFE.r-24-R*2.1:SAFE.l+24+R*2.1;return{x,y:CH-SAFE.b-24-R*2.1,R};}
function layoutTouch(){readSafe();const mob=isMob(),k=(SET.btnSize||1)*(typeof tabK==='function'?tabK():1),left=SET.hand==='l';TBR={};
  const T=$('#touch');if(T)T.style.setProperty('--ba',mob?(SET.btnAlpha||.7):1);
  const topLim=G.world&&G.state!=='menu'?SAFE.t+(G.ff==='phone-l'?(CH<=360?136:150):148):SAFE.t+64,need=Math.max(...Object.values(TBL).map(L=>(L.dy+L.d/2)*k)),f=Math.min(1,(CH-SAFE.b-topLim)/need);
  for(const [id,key] of [['tDash','dash'],['tPulse','pulse'],['tCharge','charge'],['tAct','act']]){const el=$('#'+id);if(!el)continue;
    if(!mob){el.style.cssText='';continue;}
    const L=TBL[key],d=L.d*k*(f<.85?Math.max(.8,f/.85):1),cx=left?SAFE.l+L.dx*k:CW-SAFE.r-L.dx*k,cy=CH-SAFE.b-L.dy*k*f;
    el.style.left=(cx-d/2)+'px';el.style.top=(cy-d/2)+'px';el.style.right='auto';el.style.bottom='auto';el.style.width=el.style.height=d+'px';TBR[key]={x:cx,y:cy,r:d/2};}
  const R=joyR(),J=$('#joy'),I=$('#joyIdle');
  if(mob){J.style.width=J.style.height=(R*2+10)+'px';J.style.margin=(-(R+5))+'px 0 0 '+(-(R+5))+'px';const kn=J.firstElementChild;kn.style.width=kn.style.height=(R*.82)+'px';kn.style.margin=(-(R*.41))+'px 0 0 '+(-(R*.41))+'px';}
  else{J.style.width=J.style.height=J.style.margin='';const kn=J.firstElementChild;kn.style.width=kn.style.height=kn.style.margin='';}
  if(I){const f=SET.stick==='fixed'?joyFixed():{x:joy.lx??(left?CW-SAFE.r-24-R*2.3:SAFE.l+24+R*2.3),y:joy.ly??(CH-SAFE.b-24-R*2.3)};
    I.style.width=I.style.height=(R*2+10)+'px';I.style.left=(f.x-R-5)+'px';I.style.top=(f.y-R-5)+'px';}}
function stickZone(x,y){if(!isMob())return x<CW*.5;
  const left=SET.hand==='l';if(left?x<CW*.5:x>=CW*.5)return false;
  if(x<SAFE.l+14||x>CW-SAFE.r-14||y>CH-SAFE.b-10)return false;
  for(const k in TBR){const b=TBR[k];if(Math.hypot(x-b.x,y-b.y)<b.r*1.15)return false;}
  if(SET.stick==='fixed'){const f=joyFixed();return Math.hypot(x-f.x,y-f.y)<f.R*1.8;}
  return y>(isPortrait()?CH*.4:SAFE.t+84);}
function joyShow(){const j=$('#joy');j.style.display='block';j.style.left=joy.ox+'px';j.style.top=joy.oy+'px';}
function joyUnlock(){if(!joy.locked)return;joy.locked=false;joy.x=joy.y=0;const L=$('#joyLock');if(L)L.classList.remove('on');}
/* ARCH·81 → prioTap перенесена в блок «ПОДСИСТЕМА НАВЕДЕНИЯ» после nearestEnemy */
const SW=new Map();
cv.addEventListener('pointerdown',e=>{if(G.prologue){if(e.pointerType!=='touch'||G.prologue.t>.8)prologueSkip();return;}
  audioInit();if(e.button===2)return;
  if(e.pointerType==='touch'){touchMode=true;$('#touch').hidden=!(G.state==='play'||G.state==='world');}
  if(G.state!=='play'&&G.state!=='world')return;
  if(e.pointerType==='mouse'&&aimManual())return;
  if(e.pointerType==='touch'){
    if(!joy.on&&stickZone(e.clientX,e.clientY)){joyUnlock();joy.on=true;joy.id=e.pointerId;
      if(isMob()&&SET.stick==='fixed'){const f=joyFixed();joy.ox=f.x;joy.oy=f.y;}else{joy.ox=e.clientX;joy.oy=e.clientY;}
      joy.x=joy.y=0;joy.lockHold=0;joy.lockable=false;joy.fl=[{x:e.clientX,y:e.clientY,t:performance.now()}];joyShow();joyMove(e.clientX,e.clientY);
      const j=$('#joy');j.firstElementChild.style.transform='';const I=$('#joyIdle');if(I)I.classList.remove('on');return;}
    SW.set(e.pointerId,{x:e.clientX,y:e.clientY,t:performance.now()});return;}
  prioTap(e.clientX,e.clientY);
});
function joyMove(cx,cy){const m=joyR();let dx=cx-joy.ox,dy=cy-joy.oy,l=Math.hypot(dx,dy);
  if(isMob()){if(SET.stick!=='fixed'&&l>m){joy.ox+=dx/l*(l-m);joy.oy+=dy/l*(l-m);dx=cx-joy.ox;dy=cy-joy.oy;l=m;$('#joy').style.left=joy.ox+'px';$('#joy').style.top=joy.oy+'px';}
    else if(l>m){dx*=m/l;dy*=m/l;l=m;}
    const n=l/m,dz=.08,o=n<=dz?0:Math.pow((n-dz)/(1-dz),1.25);joy.x=l>0?dx/l*o:0;joy.y=l>0?dy/l*o:0;}
  else{if(l>m){dx*=m/l;dy*=m/l;}joy.x=dx/m;joy.y=dy/m;}
  $('#joy').firstElementChild.style.transform=`translate(${dx}px,${dy}px)`;}
addEventListener('pointermove',e=>{if(!joy.on||e.pointerId!==joy.id)return;joyMove(e.clientX,e.clientY);
  if(isMob()&&SET.oneHand){const now=performance.now();joy.fl.push({x:e.clientX,y:e.clientY,t:now});while(joy.fl.length&&now-joy.fl[0].t>120)joy.fl.shift();
    const a=joy.fl[0],dx=e.clientX-a.x,dy=e.clientY-a.y,d=Math.hypot(dx,dy);if(d>joyR()*2&&now-joy.flT>350){joy.flT=now;joy.fl=[];tryDash([dx/d,dy/d]);}}});
const joyEnd=e=>{if(e.pointerId!==joy.id)return;const keep=e.type==='pointerup'&&joy.lockable&&G.state==='world';
  joy.on=false;joy.id=null;joy.lx=joy.ox;joy.ly=joy.oy;$('#joy').style.display='none';$('#joy').classList.remove('lockable');joy.lockable=false;
  if(keep){joy.locked=true;const L=$('#joyLock');if(L){L.classList.add('on');L.style.left=Math.max(8,joy.ox-90)+'px';L.style.top=Math.max(8,joy.oy-joyR()-40)+'px';}buzz('ready');}
  else{joy.x=joy.y=0;}
  if(isMob())layoutTouch();const I=$('#joyIdle');if(I&&isMob()&&touchMode)I.classList.add('on');};
addEventListener('pointerup',joyEnd);addEventListener('pointercancel',joyEnd);
const swEnd=e=>{const q=SW.get(e.pointerId);if(!q)return;SW.delete(e.pointerId);if(e.type!=='pointerup')return;
  const dx=e.clientX-q.x,dy=e.clientY-q.y,d=Math.hypot(dx,dy),dt=performance.now()-q.t;
  if(isMob()&&SET.dashSwipe!==false&&d>=60&&dt<=200){tryDash([dx/d,dy/d]);return;}
  if(d<14)prioTap(q.x,q.y);};
addEventListener('pointerup',swEnd);addEventListener('pointercancel',swEnd);
function tbBump(el){if(!el)return;el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');}
$('#tDash').addEventListener('pointerdown',e=>{e.preventDefault();const p=G.player,cd0=p&&p.dashCd;tryDash();if(p&&cd0===p.dashCd&&!(p.dashT>0))tbBump(e.currentTarget);});
$('#tPulse').addEventListener('pointerdown',e=>{e.preventDefault();const p=G.player,en0=p&&p.en;tryPulse();if(p&&p.en===en0&&en0<100)tbBump(e.currentTarget);});
{const tc=$('#tCharge');tc.addEventListener('pointerdown',e=>{e.preventDefault();CHG.t=true;try{tc.setPointerCapture(e.pointerId);}catch(err){}});
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>tc.addEventListener(ev,()=>{CHG.t=false;}));}
$('#tAct').addEventListener('pointerdown',e=>{e.preventDefault();const a=e.currentTarget.dataset.act;if(G.state!=='world')return;if(!a||a==='map')openMap();else cardAct(a);});
function ctxBtnSync(){const b=$('#tAct');if(!b)return;const on=isMob()&&touchMode&&G.state==='world'&&!G.prologue;if(b.hidden===on)b.hidden=!on;if(!on)return;
  const W_=$('#wcard'),wb=W_.hidden?null:W_.querySelector('[data-act]');const lab=wb?wb.textContent.trim().split(/\s+/)[0]:'КАРТА',act=wb?wb.dataset.act:'map';
  if(b.dataset.act!==act||b.dataset.lab!==lab){b.dataset.act=act;b.dataset.lab=lab;b.querySelector('.lb').textContent=lab;b.classList.toggle('go',!!wb);}}
// вибрация (Android; на iOS API нет — молча ничего)
let buzzT=0;const BUZZ={dash:12,pulse:30,ready:[8,40,8],chg:35,chgFull:20,hit:25,hit2:50,death:[80,60,120],boss:[40,40,40,40,120],win:[40,40,40,40,120],tap:15};
function buzz(k){if(!SET.haptics||!touchMode||!isMob()||!navigator.vibrate||RMQ&&RMQ.matches)return;const now=performance.now();if(now-buzzT<80)return;buzzT=now;try{navigator.vibrate(BUZZ[k]||15);}catch(e){}}
const RMQ=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):null;
// состояние кнопок: кольца перезарядки, готовность, фиксация курса
const tbC={};
function tbSet(id,p,txt,cls){const el=$('#'+id);if(!el)return;const k=Math.round(p*100);if(tbC[id+'p']!==k){tbC[id+'p']=k;const c=el.querySelector('.rf');if(c)c.style.strokeDashoffset=100-k;}
  if(tbC[id+'t']!==txt){tbC[id+'t']=txt;const n=el.querySelector('.cdn');if(n)n.textContent=txt;}
  for(const c of ['rdy','chg'])if(tbC[id+c]!==(cls===c)){tbC[id+c]=cls===c;el.classList.toggle(c,cls===c);}}
let tbPrevEn=0,tbPrevChg=0;
function touchTick(dt){const T=$('#touch');if(!T||T.hidden||!isMob())return;const p=G.player;if(!p)return;
  const dm=p.dashCdMax||G.st.dashCd||1;tbSet('tDash',p.dashCd>0?1-p.dashCd/dm:1,'');
  tbSet('tPulse',Math.min(1,p.en/100),'',p.en>=100?'rdy':'');if(p.en>=100&&tbPrevEn<100)buzz('ready');tbPrevEn=p.en;
  const cf=p.chg>0?Math.min(1,p.chg/CHG_T):p.chgCd>0?1-p.chgCd/CHG_CD:1;tbSet('tCharge',cf,'',p.chg>0?'chg':'');if(p.chg>=CHG_T&&tbPrevChg<CHG_T)buzz('chgFull');tbPrevChg=p.chg||0;
  ctxBtnSync();
  const calm=G.state==='world'&&G.calm>5&&p.hp>=G.st.maxHp*.99;if(tbC.calm!==calm){tbC.calm=calm;T.classList.toggle('calm',calm);}
  // фиксация курса в спокойном полёте: стик у края 2,5 с в одном направлении
  if(joy.on&&G.state==='world'&&G.calm>2){const m=Math.hypot(joy.x,joy.y),a=Math.atan2(joy.y,joy.x);
    if(m>.9&&Math.abs(angDiff(a,joy.lockA))<.35){joy.lockHold+=dt;}else{joy.lockHold=0;joy.lockA=a;}
    const lk=joy.lockHold>2.5;if(lk!==joy.lockable){joy.lockable=lk;$('#joy').classList.toggle('lockable',lk);}}
  else if(joy.lockable){joy.lockable=false;$('#joy').classList.remove('lockable');}
  if(joy.locked&&(G.state!=='world'||G.calm<=0||p.hp<=0))joyUnlock();
  const I=$('#joyIdle');if(I){const on=!joy.on&&!joy.locked;if(I.classList.contains('on')!==on)I.classList.toggle('on',on);const hint=on&&(G.mode==='world'&&!G.world&&G.m<=2);if(I.classList.contains('hint')!==hint)I.classList.toggle('hint',hint);}}
$('#btnPause').addEventListener('click',pause);
$('#bHangarClose').onclick=closeHangar;
$('#bWorld').onclick=()=>cloudGate(()=>startWorld(false));$('#bEndless').onclick=()=>{G.fromAbyss=false;startEndless(false,1);};$('#bDev').onclick=openDev;
$('#bWorldNew').onclick=()=>{if(newConfirm&&performance.now()-newConfirm<4000){cloudGate(()=>{startWorld(true);cloudForce();});return;}newConfirm=performance.now();$('#bWorldNew').textContent='ТОЧНО? ПРОГРЕСС ПОЛЁТА СОТРЁТСЯ';};
$('#bSave').onclick=()=>cloudGate(openSaveScreen);$('#bSettings').onclick=()=>openSettings('menu');$('#bMore').onclick=()=>{$('#sMenu').classList.toggle('more');$('#bMore').textContent=$('#sMenu').classList.contains('more')?'СКРЫТЬ':'ЕЩЁ';};$('#bPauseSet').onclick=()=>openSettings('pause');$('#bSetBack').onclick=closeSettings;$('#btnMap').onclick=openMap;$('#bMapClose').onclick=closeMap;$('#bShopClose').onclick=closeShop;
$('#bIntroBack').onclick=()=>{if(G.mode==='world')returnToWorld();else if(G.mode==='dev')openDev();};
$('#bPauseMap').onclick=()=>{scr6('world');openMap();};
$('#bAbandon').onclick=()=>{if(G.fromAbyss){leaveAbyss();return;}if(G.mode==='dev'){openDev();return;}if(G.mode!=='world')return;restoreRun();returnToWorld();};
$('#bToWorld').onclick=()=>{if(G.fromAbyss){leaveAbyss();return;}if(G.devRun){openDev();return;}restoreRun();returnToWorld();};$('#bCodex').onclick=()=>openCodex('menu');$('#bCodexBack').onclick=closeCodex;
$('#bGo').onclick=startMission;$('#bNext').onclick=()=>{if(G.state!=='done')return;if(G.mode==='world'){returnToWorld();return;}if(G.mode==='dev'){restoreRun();openIntro(G.m-1);}};$('#bDoneMenu').onclick=()=>{if(G.mode==='dev')openDev();else toMenu();};
function confirm2(el,f){return e=>{if(!touchMode||!isMob())return f(e);const now=performance.now();if(el.dataset.arm&&now-+el.dataset.arm<3000){el.dataset.arm='';el.textContent=el.dataset.lab;return f(e);}el.dataset.arm=now;el.dataset.lab=el.dataset.lab||el.textContent;el.textContent='ТОЧНО? НАЖМИТЕ ЕЩЁ РАЗ';setTimeout(()=>{if(el.dataset.arm&&performance.now()-+el.dataset.arm>=2900){el.dataset.arm='';el.textContent=el.dataset.lab;}},3000);};}
$('#bArsClose').onclick=closeArsenal;$('#bResume').onclick=resume;$('#bRestart').onclick=()=>{if(G.mode==='endless'){startEndless(G.devRun,G.devStep);return;}restoreRun();openIntro(G.m-1);};$('#bPauseCodex').onclick=()=>openCodex('pause');$('#bQuit').onclick=toMenu;
['bRestart','bAbandon','bQuit'].forEach(id=>{const el=$('#'+id),f=el.onclick;el.onclick=confirmPause(el,f);});
$('#bRetry').onclick=()=>{if(G.mode==='endless'){startEndless(G.devRun,G.devStep);return;}restoreRun();openIntro(G.m-1);};$('#bOverMenu').onclick=toMenu;

