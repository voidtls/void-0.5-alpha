/* ===== 1.3.2 α «Проверка»: исправления по 5000 прогонам сектора I ===== */
/* Баг №1: музыка меню — автоматический клик в свободную точку экрана вместо игрока.
   Важно: браузеры (Chrome, Safari, Firefox) не считают клик из кода настоящим (isTrusted=false) и звук по нему
   не разрешают. Поэтому клик делается, но вместе с ним остаются попытки раз в 1,5 с и включение с первого
   настоящего касания. Клик посылается только событиями мыши (не pointer — их слушает полноэкранный режим)
   и только туда, где нет кнопок, полей и холста. */
function autoClick132(){try{if(!SET.amb||G.state!=='menu')return false;if(AU.ctx&&AU.ctx.state==='running')return false;
  const pts=[[innerWidth*.78,innerHeight*.5],[innerWidth*.5,innerHeight*.08],[innerWidth-6,innerHeight*.5],[6,innerHeight-6]];
  for(const [x,y] of pts){const el=document.elementFromPoint(x,y);if(!el)continue;if(el.closest('button,a,input,select,textarea,label,summary,[data-seg],[data-act],[data-v],.btn,.tog,#touch,canvas,kbd,[role=button],[role=switch]'))continue;
    const o={bubbles:true,cancelable:true,clientX:x,clientY:y,view:window,button:0};el.dispatchEvent(new MouseEvent('mousedown',o));el.dispatchEvent(new MouseEvent('mouseup',o));el.dispatchEvent(new MouseEvent('click',o));G.autoClick132=(G.autoClick132||0)+1;break;}
  if(typeof audioWake==='function')audioWake();return true;}catch(e){return false;}}
setTimeout(autoClick132,500);setTimeout(autoClick132,1500);
{let n=0;const iv=setInterval(()=>{n++;if(AU.ctx&&AU.ctx.state==='running'||n>40){clearInterval(iv);return;}autoClick132();},1500);}

/* карточка объекта на телефоне в альбомной ориентации закрывала кнопки справа («ИМП») —
   теперь карточка встаёт в свободный промежуток между стиком и кнопками, без своей кнопки (её дублирует «ДЕЙСТВИЕ») */
function wcardFit132(){const c=$('#wcard'),T=$('#touch');if(!c||!T)return;c.style.removeProperty('left');c.style.removeProperty('width');c.style.removeProperty('transform');c.style.removeProperty('max-width');c.classList.remove('fit132');
  if(!isMob()||G.ff==='phone-p'||c.hidden)return;const bs=[...T.querySelectorAll('.tbtn')].filter(b=>!b.hidden&&getComputedStyle(b).display!=='none').map(b=>b.getBoundingClientRect()).filter(r=>r.width>0);if(!bs.length)return;
  const left=SET.hand==='l';const cr=c.getBoundingClientRect();let ok=true;for(const b of bs){if(!(cr.right<=b.left-8||cr.left>=b.right+8||cr.bottom<=b.top-8||cr.top>=b.bottom+8)){ok=false;break;}}if(ok)return;
  const edge=left?Math.max(...bs.map(r=>r.right))+12:Math.min(...bs.map(r=>r.left))-12;const J=typeof joyFixed==='function'?joyFixed():null;
  const jEdge=J?(left?J.x-J.R-12:J.x+J.R+12):(left?CW-12:12);const a=left?edge:Math.max(12,jEdge),z=left?Math.min(CW-12,jEdge):edge;const w=Math.max(150,Math.min(300,z-a));
  const zf=(c.offsetWidth?cr.width/c.offsetWidth:1)||1;/* на планшете карточка увеличена через zoom — пересчитываем в её единицы */
  c.classList.add('fit132');c.style.width=(w/zf)+'px';c.style.maxWidth=(w/zf)+'px';c.style.left=Math.round(((a+z)/2-w/2)/zf)+'px';c.style.transform='none';}
{const _wh=updateWorldHUD;updateWorldHUD=function(){const r=_wh.apply(this,arguments);try{const c=$('#wcard');if(c&&!c.hidden){const k=G.cardKey+'|'+CW+'x'+CH+'|'+SET.hand+'|'+SET.btnSize;if(c.dataset.fit!==k){c.dataset.fit=k;wcardFit132();}}}catch(e){}return r;};}

/* «Допуск пилота» (всплывающая панель) не должен накрывать кнопки на экране — у левшей в альбомной он ложился на «ЗАРЯД» */
function tutSkFit132(){const el=$('#tutSk');if(!el||el.hidden||!isMob())return;el.style.removeProperty('left');el.style.removeProperty('right');el.style.removeProperty('top');
  const hit=()=>{const r=el.getBoundingClientRect();return [...document.querySelectorAll('#touch .tbtn,#mini,#btnPause')].filter(b=>!b.hidden&&getComputedStyle(b).display!=='none').some(b=>{const q=b.getBoundingClientRect();return q.width>0&&!(r.right<=q.left||r.left>=q.right||r.bottom<=q.top||r.top>=q.bottom);});};
  if(!hit())return;el.style.left='auto';el.style.right='max(12px,var(--sar,0px))';if(!hit())return;el.style.removeProperty('right');el.style.removeProperty('left');
  const hud=document.querySelector('#hud .hud-tl');const top=hud?hud.getBoundingClientRect().bottom+8:52;el.style.top=top+'px';}
{const _sp=tutSkillPop;tutSkillPop=function(){const r=_sp.apply(this,arguments);try{TUT.blk=null;tutSkFit132();requestAnimationFrame(()=>{try{tutSkFit132();}catch(e){}});}catch(e){}return r;};}
/* подсказки обучения обходят и всплывающий «Допуск пилота», и карточку объекта — раньше могли лечь под них */
{const _tb=tutBlockers;tutBlockers=function(){const out=_tb.apply(this,arguments).slice();try{for(const id of ['tutSk','wcard']){const el=document.getElementById(id);if(!el||el.hidden)continue;const cs=getComputedStyle(el);if(cs.display==='none'||+cs.opacity<.05)continue;const r=el.getBoundingClientRect();if(r.width>0)out.push([r.left-6,r.top-6,r.right+6,r.bottom+6]);}}catch(e){}return out;};}
/* на телефоне «Допуск пилота» встаёт под радио, тост и карточку объекта, а не поверх них (раньше в книжной ориентации всё слипалось вверху) */
function tutSkSidePC132(el){const p=G.player;if(!p)return;const r=el.getBoundingClientRect();const obs=[];try{const [X,Y]=tutSP(p.x,p.y),q=Math.max(30,(p.r||13)*SC+20);obs.push([X-q,Y-q,X+q,Y+q]);}catch(e){}
  const ch=document.querySelector('#tut .tut-chip.on');if(ch&&!$('#tut').hidden){const c=ch.getBoundingClientRect();obs.push([c.left,c.top,c.right,c.bottom]);}
  const fixedObs=[...document.querySelectorAll('#mini,#btnMap,#btnPause,#hud .hud-tl,#toast,#radio')].filter(o=>!o.hidden&&getComputedStyle(o).display!=='none'&&o.getBoundingClientRect().width>1).map(o=>{const q=o.getBoundingClientRect();return [q.left,q.top,q.right,q.bottom];});
  const hitAt=(l)=>obs.concat(fixedObs).some(o=>!(l+r.width<=o[0]||l>=o[2]||r.bottom<=o[1]||r.top>=o[3]));const onRight=el.classList.contains('r132');const lL=16,lR=CW-r.width-16;
  /* справа можно опустить панель под мини-карту, если по центру ей мешает только она */
  const top0=CH/2-r.height/2;const lowT=Math.max(top0,...fixedObs.filter(o=>o[2]>lR&&o[1]<CH/2).map(o=>o[3]+8));const hitAtT=(l,t)=>obs.concat(fixedObs).some(o=>!(l+r.width<=o[0]||l>=o[2]||t+r.height<=o[1]||t>=o[3]));
  const rightOk=t=>t+r.height<=CH-8&&!hitAtT(lR,t);
  if(!onRight&&hitAt(lL)){const t=rightOk(top0)?top0:(rightOk(lowT)?lowT:null);if(t!==null){el.classList.add('r132');el.style.top=(t+r.height/2)+'px';}}
  else if(onRight&&!hitAt(lL)){el.classList.remove('r132');el.style.removeProperty('top');}}
function tutSkStack132(){const el=$('#tutSk');if(!el||el.hidden)return;if(!isMob()){tutSkSidePC132(el);return;}
  const vis=o=>o&&!o.hidden&&getComputedStyle(o).display!=='none'&&+getComputedStyle(o).opacity>.05&&o.getBoundingClientRect().width>1;
  const pops=['radio','toast','wcard','banner'].map(id=>document.getElementById(id)).filter(vis).map(o=>o.getBoundingClientRect()).filter(q=>q.width<CW*.9||q.height>0);{const ch=document.querySelector('#tut .tut-chip.on');if(ch&&!$('#tut').hidden&&vis(ch))pops.push(ch.getBoundingClientRect());}
  const btns=[...document.querySelectorAll('#touch .tbtn,#mini,#btnPause,#joyIdle')].filter(vis).map(o=>o.getBoundingClientRect());
  try{const p=G.player;if(p){const [X,Y]=tutSP(p.x,p.y),q=Math.max(36,(p.r||13)*SC+24);btns.push({left:X-q,top:Y-q,right:X+q,bottom:Y+q});}}catch(e){}/* и не закрывает сам корабль */
  const w=el.offsetWidth,h=el.offsetHeight,hud=document.querySelector('#hud .hud-tl'),min=hud?hud.getBoundingClientRect().bottom+8:52;
  const free=(l,t)=>t+h<=CH-8&&l>=0&&l+w<=CW&&![...pops,...btns].some(q=>!(l+w<=q.left||l>=q.right||t+h<=q.top||t>=q.bottom));
  const L0=Math.max(12,SAFE.l||0),Lc=Math.round((CW-w)/2),ts=[min,...pops.map(q=>q.bottom+8)].filter(t=>t>=min).sort((a,b)=>a-b);
  const mi=document.getElementById('mini'),mb=vis(mi)?mi.getBoundingClientRect().bottom+8:min;const Lr=CW-w-Math.max(12,SAFE.r||0);
  let pk=null;for(const l of [L0,Lc])for(const t of ts){if(!pk&&free(l,t))pk=[l,t];}if(!pk&&free(Lr,mb))pk=[Lr,mb];
  if(!pk){el.style.transition='none';el.style.opacity='0';return;}if(el.style.opacity==='0'){el.style.transition='';el.style.opacity='';}el.style.right='auto';el.style.left=pk[0]+'px';el.style.top=pk[1]+'px';}
{for(const fn of ['updateWorldHUD','updateHUD']){const f=window[fn];if(typeof f!=='function')continue;window[fn]=function(){const r=f.apply(this,arguments);try{tutSkStack132();}catch(e){}return r;};}}

/* стик на узких телефонах заходил на кнопки «КАРТА»/«ИМП» (и у правшей, и у левшей) — отодвигаем к краю, а если мало — выше */
{const _jf=joyFixed;joyFixed=function(){const J=_jf.apply(this,arguments);try{if(!isMob()||!TBR)return J;const bs=Object.values(TBR).filter(b=>b&&b.r>0);const hit=()=>bs.some(b=>Math.hypot(J.x-b.x,J.y-b.y)<J.R+b.r+10);
  if(!hit())return J;const left=SET.hand==='l';J.x=left?CW-SAFE.r-J.R-14:SAFE.l+J.R+14;for(let k=0;k<16&&hit();k++)J.y-=12;}catch(e){}return J;};}
/* подсказка плавающего стика («ДВИЖЕНИЕ») тоже не должна ложиться на кнопки */
{const _lt=layoutTouch;layoutTouch=function(){const r=_lt.apply(this,arguments);try{const I=$('#joyIdle');if(!I||!isMob()||SET.stick==='fixed'||!TBR)return r;const R=joyR();let x=parseFloat(I.style.left)+R+5,y=parseFloat(I.style.top)+R+5;if(!isFinite(x)||!isFinite(y))return r;
  const bs=Object.values(TBR).filter(b=>b&&b.r>0);const hit=()=>bs.some(b=>Math.hypot(x-b.x,y-b.y)<R+b.r+8);if(!hit())return r;const left=SET.hand==='l';x=left?CW-SAFE.r-R-14:SAFE.l+R+14;for(let k=0;k<16&&hit();k++)y-=12;
  I.style.left=(x-R-5)+'px';I.style.top=(y-R-5)+'px';}catch(e){}return r;};}
/* телефон, книжная: карточка объекта сдвигается под тост/радио, если они вверху (раньше тост «ИНЕЙ-4 · ЗАПИСЬ» ложился на карточку) */
function wcardStack132(){const c=$('#wcard');if(!c||c.hidden||G.ff!=='phone-p')return;const base=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sat'))||0;
  let want=null;for(const id of ['toast','radio']){const o=document.getElementById(id);if(!o||o.hidden||getComputedStyle(o).display==='none'||+getComputedStyle(o).opacity<.05)continue;const q=o.getBoundingClientRect();if(q.width<2||q.top>CH*.4)continue;want=Math.max(want||0,q.bottom+8);}
  if(want&&want+c.offsetHeight<CH*.55){c.style.top=want+'px';}else c.style.removeProperty('top');}
{const f=window.updateWorldHUD;window.updateWorldHUD=function(){const r=f.apply(this,arguments);try{wcardStack132();}catch(e){}return r;};}

/* подсказка стика («ДВИЖЕНИЕ») не уезжает за край экрана, где бы ни было последнее касание */
function joyIdleClamp132(){const I=$('#joyIdle');if(!I||!isMob())return;const R=joyR();let x=parseFloat(I.style.left)+R+5,y=parseFloat(I.style.top)+R+5;if(!isFinite(x)||!isFinite(y))return;
  const lw=Math.max(R+5,(I.firstElementChild?I.firstElementChild.offsetWidth/2:0)+4);const nx=clamp(x,SAFE.l+lw+6,CW-SAFE.r-lw-6),ny=clamp(y,SAFE.t+R+60,CH-SAFE.b-R-8);if(nx!==x||ny!==y){I.style.left=(nx-R-5)+'px';I.style.top=(ny-R-5)+'px';}}
{for(const fn of ['updateWorldHUD','updateHUD']){const f=window[fn];if(typeof f!=='function')continue;window[fn]=function(){const r=f.apply(this,arguments);try{joyIdleClamp132();}catch(e){}return r;};}}
/* подсказка обучения: если все обычные места заняты (кнопки, панели), ищем ближайшее свободное по вертикали, а не ложимся поверх кнопки */
{const _tp=tutPlace;tutPlace=function(cw,ch,cands,extra){const res=_tp.apply(this,arguments);try{const blk=tutBlockers().concat(extra||[]);const free=(l,t)=>!blk.some(b=>tutInter([l,t,l+cw,t+ch],b));if(free(res[0],res[1]))return res;
  const top=(SAFE.t||0)+8,bot=CH-(SAFE.b||0)-8;for(let d=12;d<=300;d+=12)for(const sg of [-1,1]){const t=res[1]+sg*d;if(t<top||t+ch>bot)continue;if(free(res[0],t))return [res[0],t];}}catch(e){}return res;};}

/* «Допуск пилота» пересчитывает место и вне полёта (карта, вступление к миссии), а на экранах-меню не висит поверх */
setInterval(()=>{try{const el=$('#tutSk');if(!el||el.hidden)return;if(G.state!=='world'&&G.state!=='play'){el.style.transition='none';el.style.opacity='0';return;}tutSkStack132();}catch(e){}},100);

