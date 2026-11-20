/* ===== 1.2.4 α: единый масштаб интерфейса UI (1080p = 1, 1440p = 1,35, 4K = 2) + сцена 21:9 ===== */
var UI=1;
SET_DEF.uiSize=1;SET_OPT.uiSize=[.9,1,1.1,1.25];SEGS.uiSize=[['ИНТЕРФЕЙС',[[.9,'90%'],[1,'АВТО'],[1.1,'110%'],[1.25,'125%']]]];
try{const v=store('void_settings');if(v&&SET_OPT.uiSize.includes(v.uiSize))SET.uiSize=v.uiSize;}catch(e){}
function uiCalc(){if(G.ff!=='desk')return 1;const a=Math.min(CW/1920,CH/1080);return Math.max(.85,Math.round(clamp(a,1,2.5)*(SET.uiSize||1)*20)/20);}
function stageW(){return G.ff==='desk'&&CW/CH>2.45?Math.round(CH*21/9):CW;}
function uiApply(){const u=uiCalc(),R=document.documentElement;UI=u;R.style.setProperty('--ui',u);R.classList.toggle('uiz',G.ff==='desk');
  const m=Math.max(0,(CW-stageW())/2);R.style.setProperty('--stage-m',(m/u).toFixed(2)+'px');R.style.setProperty('--stage-px',m.toFixed(1)+'px');R.classList.toggle('ultra',m>0);}
{const _rz=resize;resize=function(){_rz();try{uiApply();}catch(e){}};addEventListener('resize',()=>{try{uiApply();}catch(e){}});try{uiApply();}catch(e){}}
try{let mq=null;const watch=()=>{try{if(mq)mq.removeEventListener('change',on);mq=matchMedia('(resolution: '+(window.devicePixelRatio||1)+'dppx)');mq.addEventListener('change',on);}catch(e){}};const on=()=>{resize();watch();};watch();}catch(e){}
/* арена миссии на ПК шире 21:9 — 21:9 по центру, остальное — фон */
{const _la=lockArena;lockArena=function(){if(!isMob()&&VW/VH>21/9+.02){G.arena={w:Math.round(VH*21/9),h:Math.round(VH)};applyWH();return;}_la();};}
/* настройки: строка «Интерфейс» на ПК; применяется сразу */
{const _as=applySettings;applySettings=function(){_as();try{uiApply();}catch(e){}};}
if(SET.uiSize===undefined)SET.uiSize=1;
function stageL(){return (CW-stageW())/2;}
/* стрелка у края экрана (вызывается из погони и телефона): на ПК — в масштабе UI и в пределах сцены */
{const _ea=edgeArrow;edgeArrow=function(x,y,col,size,label){if(isMob()||UI===1&&!stageL())return _ea(x,y,col,size,label);
  const sl=stageL(),cw=CW,ch=CH,sc=SC,cx=CX,cy=CY;ctx.save();ctx.translate(sl,0);ctx.scale(UI,UI);
  try{CW=stageW()/UI;CH=ch/UI;SC=sc/UI;CX=cx+sl/sc;return _ea(x,y,col,size,label);}finally{CW=cw;CH=ch;SC=sc;CX=cx;CY=cy;ctx.restore();}};}
/* подписи на большой карте растут вместе с UI */
try{const c=document.getElementById('mapC'),g=c&&c.getContext('2d');if(g){const D=Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype,'font');
  Object.defineProperty(g,'font',{configurable:true,get(){return D.get.call(this);},set(v){D.set.call(this,UI===1?v:String(v).replace(/(\d+(?:\.\d+)?)px/,(m,n)=>(+n*UI).toFixed(1)+'px'));}});}}catch(e){}
/* арена 21:9 на сверхшироком: за краями — приглушённый фон и тонкая рамка поля */
{const _mo=mobOverlay;mobOverlay=function(now){try{if(!isMob()&&G.arena&&!G.world&&(G.state==='play'||G.state==='pause'||G.state==='levelup'||G.state==='intro')){
  ctx.setTransform(DPR,0,0,DPR,0,0);const x0=(0-CX)*SC,x1=(W-CX)*SC;ctx.fillStyle='rgba(2,3,8,.42)';if(x0>0)ctx.fillRect(0,0,x0,CH);if(x1<CW)ctx.fillRect(x1,0,CW-x1,CH);
  ctx.strokeStyle='rgba(143,233,255,.14)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x0+.5,0);ctx.lineTo(x0+.5,CH);ctx.moveTo(x1-.5,0);ctx.lineTo(x1-.5,CH);ctx.stroke();}}catch(e){}
  return _mo(now);};}

/* ===== 1.2.4 α: переключатели доезжают до края и едут плавно ===== */
/* ARCH·86 · слой renderSettings 1 из 3 (строка 13689 в 1.5.25) перенесён в объединённый слой ниже */
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.tog[data-k]');if(!b)return;
  try{if(isMob()&&SET.haptics&&!SET.lessFx&&navigator.vibrate)navigator.vibrate(8);}catch(er){}},true);
document.addEventListener('keydown',e=>{const b=document.activeElement;if(!b||!b.matches||!b.matches('.tog[data-k]'))return;if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;
  e.preventDefault();e.stopImmediatePropagation();if(e.key==='ArrowRight'&&!b.classList.contains('on')||e.key==='ArrowLeft'&&b.classList.contains('on'))b.click();},true);

/* ===== 1.2.4 α: всплывающие сообщения закрываются нажатием или свайпом ===== */
const DX={born:{},hold:{}};
function dxBtn(el){if(!el||el.querySelector(':scope>.dx'))return;const b=document.createElement('button');b.className='dx';b.type='button';b.setAttribute('aria-label','Скрыть сообщение');b.tabIndex=-1;b.textContent='✕';el.appendChild(b);}
function dxFade(el,dir,done){if(!el)return;el.classList.remove('dxdrag');el.style.transition='';el.classList.add('dxout');el.dataset.dxd=dir||'';
  const fin=()=>{el.classList.remove('dxout');el.style.transform='';el.style.opacity='';done();};setTimeout(fin,(SET.lessFx||SET.fx===false)?100:180);}
function toastHide(dir){const el=document.getElementById('toast');if(!el||el.hidden)return;clearTimeout(toastTimer);dxFade(el,dir,()=>{el.hidden=true;});}
function fragHide(dir){const el=document.getElementById('fragTxt');if(!el||!el.classList.contains('on'))return;dxFade(el,dir,()=>{el.classList.remove('on');});}
function radioHide(all){const st=radioState();if(all&&st)st.q.length=0;const el=radioEl();if(!el||el.hidden)return;dxFade(el,'l',()=>{radioClear();});}
/* тост: свой таймер, пауза при наведении */
const TST={left:8000,t0:0};
{const _t=toast;toast=function(a,b){_t(a,b);const el=document.getElementById('toast');if(!el)return;dxBtn(el);el.classList.remove('dxout','hold');el.style.transform='';el.style.opacity='';
  DX.born.toast=performance.now();TST.left=8000;TST.t0=performance.now();clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastHide(),8000);};}
{const _fs=fragShow;fragShow=function(txt,n){_fs(txt,n);const el=document.getElementById('fragTxt');if(!el)return;el.innerHTML='<span class="fbox">'+el.innerHTML+'</span>';dxBtn(el.querySelector('.fbox'));DX.born.frag=performance.now();};}
document.addEventListener('animationend',e=>{if(e.target&&e.target.id==='fragTxt'&&e.animationName==='frag')e.target.classList.remove('on');});
{const _rt=radioTick;radioTick=function(dt,mode){if(DX.hold.radio){const st=radioState();if(st&&st.cur)return _rt(0,mode);}return _rt(dt,mode);};}
{const _rc=radioClear;radioClear=function(){_rc();DX.born.radio=performance.now();const el=radioEl();if(el)el.classList.remove('dxout');};}
function dxKind(el){return el.id==='toast'?'toast':el.id==='radio'?'radio':'frag';}
function dxRoot(t){return t.closest&&(t.closest('#toast')||t.closest('#radio')||t.closest('#fragTxt .fbox'));}
function dxClose(card,dir,all){const k=dxKind(card.id?card:card.closest('#fragTxt')||card);if(k==='toast')toastHide(dir);else if(k==='radio')radioHide(all);else fragHide(dir);}
/* в бою с прицелом мышью сообщения прозрачны для клика — закрываются только крестиком */
setInterval(()=>{try{const on=!isMob()&&SET.manual&&G.state==='play'&&G.enemies&&G.enemies.some(e=>e.alive&&!e.ghost&&e.spawnT<=0&&Math.abs(e.x-G.player.x)<VW*.6&&Math.abs(e.y-G.player.y)<VH*.6);
  document.documentElement.classList.toggle('dxaim',!!on);}catch(e){}},200);
{let drag=null;
  const down=e=>{const card=dxRoot(e.target);if(!card)return;e.stopPropagation();e.preventDefault();
    const el=card.id?card:card.closest('#fragTxt'),k=dxKind(el);if(performance.now()-(DX.born[k]||0)<250&&!e.target.closest('.dx'))return;
    if(e.target.closest('.dx')){dxClose(el,'',false);return;}
    drag={el,k,x:e.clientX,y:e.clientY,t:performance.now(),dx:0,dy:0,id:e.pointerId,touch:e.pointerType!=='mouse'};
    if(drag.touch){el.classList.add('dxdrag');try{el.setPointerCapture(e.pointerId);}catch(er){}}};
  const move=e=>{if(!drag||e.pointerId!==drag.id)return;drag.dx=e.clientX-drag.x;drag.dy=e.clientY-drag.y;if(!drag.touch)return;e.preventDefault();
    const base=drag.el.id==='toast'&&getComputedStyle(drag.el).transform!=='none'&&!isMob()?'translateX(-50%) ':'';
    const d=Math.hypot(drag.dx,drag.dy);drag.el.style.transform=base+'translate('+drag.dx+'px,'+drag.dy+'px)';drag.el.style.opacity=String(Math.max(.15,1-d/180));};
  const up=e=>{if(!drag||e.pointerId!==drag.id)return;const D=drag;drag=null;e.stopPropagation();const d=Math.hypot(D.dx,D.dy),v=d/Math.max(1,performance.now()-D.t);
    if(d<8){dxClose(D.el,'',false);return;}
    if(D.touch&&(d>40||v>.5)){const dir=Math.abs(D.dx)>Math.abs(D.dy)?(D.dx<0?'l':'r'):(D.dy<0?'u':'d');dxClose(D.el,dir,D.k==='radio'&&dir==='l');return;}
    D.el.classList.remove('dxdrag');D.el.style.transition='transform .22s cubic-bezier(.3,1.4,.5,1),opacity .2s';D.el.style.transform='';D.el.style.opacity='';setTimeout(()=>{D.el.style.transition='';},260);};
  for(const t of ['pointerdown'])document.addEventListener(t,down,true);
  document.addEventListener('pointermove',move,{capture:true,passive:false});document.addEventListener('pointerup',up,true);document.addEventListener('pointercancel',up,true);
  for(const t of ['mousedown','touchstart','click','contextmenu'])document.addEventListener(t,e=>{if(dxRoot(e.target)){e.stopPropagation();if(t!=='touchstart')e.preventDefault();}},{capture:true,passive:false});
  const hov=(k,on)=>{DX.hold[k]=on;if(k==='toast'){const el=document.getElementById('toast');if(!el||el.hidden)return;el.classList.toggle('hold',on);
      if(on){clearTimeout(toastTimer);TST.left=Math.max(0,TST.left-(performance.now()-TST.t0));}else{TST.left=Math.max(2000,TST.left);TST.t0=performance.now();clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastHide(),TST.left);}}
    if(k==='frag'){const el=document.getElementById('fragTxt');if(el)el.classList.toggle('hold',on);}};
  document.addEventListener('pointerover',e=>{if(e.pointerType!=='mouse')return;const c=dxRoot(e.target);if(!c)return;const el=c.id?c:c.closest('#fragTxt');const k=dxKind(el);if(!DX.hold[k])hov(k,true);});
  document.addEventListener('pointerout',e=>{if(e.pointerType!=='mouse')return;const c=dxRoot(e.target);if(!c)return;const to=e.relatedTarget&&dxRoot(e.relatedTarget);if(to===c)return;const el=c.id?c:c.closest('#fragTxt');hov(dxKind(el),false);});}
try{dxBtn(document.getElementById('toast'));dxBtn(radioEl());}catch(e){}

