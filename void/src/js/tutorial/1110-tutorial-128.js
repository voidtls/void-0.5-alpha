/* ===== 1.2.8 α: обучение 2.0 — калибровка, допуск пилота, живые показы, карточка управления =====
   Всё по-прежнему только смотрит и рисует: ни одной игровой величины здесь не меняется. */

/* ---------- навыки пилота: что освоено руками ---------- */
const TUT_SK=[
  {k:'flight',n:'ПОЛЁТ',of:['move'],ic:'<path d="M12 3l6 16-6-4-6 4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'},
  {k:'dash',n:'РЫВОК',of:['dash'],ic:'<path d="M4 12h9M4 7h6M4 17h6M14 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'},
  {k:'pulse',n:'ИМПУЛЬС',of:['pulse'],ic:'<circle cx="12" cy="12" r="2.5" fill="currentColor"/><circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".6"/>'},
  {k:'act',n:'ДЕЙСТВИЕ',of:['act'],ic:'<rect x="4" y="5" width="16" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 9v6M9 9h5M9 12h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'},
  {k:'stash',n:'СКЛАД',of:['stash'],ic:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z M12 12l8-4.5M12 12v9M12 12L4 7.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>'},
  {k:'map',n:'КАРТА',of:['map'],ic:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z M9 4v14M15 6v14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>'},
  {k:'jump',n:'ПРЫЖОК',of:['jump'],ic:'<circle cx="17" cy="7" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 20c3-8 7-11 10-12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="2 2.5" stroke-linecap="round"/>'},
  {k:'beacon',n:'МАЯК',of:['cell','line'],ic:'<path d="M12 4l7 4v8l-7 4-7-4V8z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.4" fill="currentColor"/>'}];
function tutOkMap(){const T=tutT();if(!T)return {};if(!T.ok)T.ok={};return T.ok;}
function tutSkillOk(s){const T=tutT();if(!T)return false;if(T.vet)return true;const ok=T.ok||{};return s.of.some(k=>ok[k]);}
function tutSkillN(){return TUT_SK.filter(tutSkillOk).length;}
function tutOk(k){const T=tutT();if(!T)return;const ok=tutOkMap();if(ok[k])return;const before=TUT_SK.filter(tutSkillOk).map(s=>s.k);ok[k]=1;tutSave();
  const now=TUT_SK.filter(tutSkillOk).map(s=>s.k),fresh=now.filter(x=>!before.includes(x));if(fresh.length&&tutOn())tutSkillPop(fresh);}
/* освоено = сделано руками: пропуск «✕» и три показа без успеха навык не засчитывают */
{const _d=tutDone;tutDone=function(k,how){const T=tutT();const was=!!(T&&T.done[k]);const r=_d.apply(this,arguments);if(T&&!was&&T.done[k]&&how!=='skip')tutOk(k);return r;};}
{const _e=tutEnd;tutEnd=function(how){const C=TUT.cur;const r=_e.apply(this,arguments);if(C&&how==='ok')tutOk(C.k);return r;};}

/* ---------- панель «ДОПУСК ПИЛОТА»: всплывает, когда освоен новый навык ---------- */
function tutSkDom(){let el=$('#tutSk');if(el)return el;el=document.createElement('div');el.id='tutSk';el.setAttribute('aria-live','polite');el.hidden=true;document.body.appendChild(el);return el;}
function tutSkillPop(fresh,final){const el=tutSkDom(),n=tutSkillN(),all=n===TUT_SK.length,now=performance.now();if(TUT.skFresh&&now-TUT.skAt<800)fresh=[...new Set(TUT.skFresh.concat(fresh))];TUT.skFresh=fresh;TUT.skAt=now;
  el.innerHTML=`<div class="tsk-h"><span>ДОПУСК ПИЛОТА</span><b>${n}/${TUT_SK.length}</b></div><div class="tsk-l">${TUT_SK.map(s=>{const ok=tutSkillOk(s),nw=fresh.includes(s.k);
    return `<div class="tsk-r${ok?' ok':''}${nw?' new':''}"><svg viewBox="0 0 24 24" aria-hidden="true">${s.ic}</svg><span>${s.n}</span><i>${ok?'✓':''}</i></div>`;}).join('')}</div>${all?'<div class="tsk-f">ДОПУСК ПОЛУЧЕН</div>':''}`;
  el.classList.toggle('all',all);el.hidden=false;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');
  clearTimeout(TUT.skT);TUT.skT=setTimeout(()=>{el.classList.remove('on');setTimeout(()=>{if(!el.classList.contains('on'))el.hidden=true;},450);},all?4200:3200);
  tutChord(all?5:fresh.length+1);}
function tutChord(n){try{if(!AU.ctx||!SET.sfx||!AU.sfx)return;const c=AU.ctx,t=c.currentTime,P_=typeof PENTA!=='undefined'?PENTA:[523.25,622.25,698.46,830.61,932.33];
  for(let i=0;i<Math.min(5,n);i++){const o=c.createOscillator(),g=c.createGain(),d=i*.07;o.type='sine';o.frequency.value=P_[i%5]*(i>=5?2:1);g.gain.setValueAtTime(0,t+d);g.gain.linearRampToValueAtTime(.04,t+d+.012);g.gain.exponentialRampToValueAtTime(.0004,t+d+.35);o.connect(g);g.connect(AU.sfx);o.start(t+d);o.stop(t+d+.4);}}catch(e){}}
function tutNote(i){try{if(!AU.ctx||!SET.sfx||!AU.sfx)return;const c=AU.ctx,t=c.currentTime,P_=typeof PENTA!=='undefined'?PENTA:[523.25,622.25,698.46,830.61,932.33];
  const o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=P_[i%5]*(i>=5?2:1);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+.01);g.gain.exponentialRampToValueAtTime(.0004,t+.28);o.connect(g);g.connect(AU.sfx);o.start(t);o.stop(t+.3);}catch(e){}}

/* ---------- «КАЛИБРОВКА»: голографическая трасса сразу после пробуждения ----------
   три кольца — рулить, ворота — рывок сквозь луч. Только картинка: ни столкновений, ни наград. */
function tutCalNew(){const p=G.player;let dx=Math.cos(p.ang||-Math.PI/2),dy=Math.sin(p.ang||-Math.PI/2);
  try{const nt=nextTarget();if(nt){const d=Math.hypot(nt.x-p.x,nt.y-p.y);if(d>400){dx=(nt.x-p.x)/d;dy=(nt.y-p.y)/d;}}}catch(e){}
  const ok=(x,y)=>inSectors(x,y)&&sectorIdx(x,y)===0;if(!ok(p.x+dx*1050,p.y+dy*1050)){dx=-dx;dy=-dy;}
  const nx=-dy,ny=dx,at=(a,b)=>{let x=p.x+dx*a+nx*b,y=p.y+dy*a+ny*b;for(const r of G.rocks||[]){if(!r.alive)continue;const d=Math.hypot(r.x-x,r.y-y),need=(r.r||20)+70;if(d<need){x+=nx*(need-d+10)*(b>=0?1:-1);y+=ny*(need-d+10)*(b>=0?1:-1);}}return {x,y};};
  const pts=[at(270,0),at(500,120),at(730,-120)].map(q=>({...q,done:0}));const g=at(1000,0);
  return {pts,i:0,gate:{x:g.x,y:g.y,nx,ny,h:92,done:0,fail:0,fails:0},px:p.x,py:p.y,far:0,dx,dy,t0:performance.now()};}
function tutSegX(ax,ay,bx,by,cx,cy,dx_,dy_){const r=(bx-ax)*(dy_-cy)-(by-ay)*(dx_-cx);if(Math.abs(r)<1e-9)return false;const t=((cx-ax)*(dy_-cy)-(cy-ay)*(dx_-cx))/r,u=((cx-ax)*(by-ay)-(cy-ay)*(bx-ax))/r;return t>=0&&t<=1&&u>=0&&u<=1;}
TUT_L.calib={ctx:'world',dur:0,
  when(){const S=G.save,T=tutT(),p=G.player;if(!T||T.done.calib||T.vet||(S.cleared||0)>0||G.prologue||TUT.worldT<1.2||!p)return false;return sectorIdx(p.x,p.y)===0;},
  step(dt,now){const p=G.player,T=tutT();let K=TUT.cal;if(!K||Math.hypot(K.px-p.x,K.py-p.y)>2600){K=TUT.cal=tutCalNew();}
    const tgt=K.i<3?K.pts[K.i]:K.gate;
    if(K.i<3){if(Math.hypot(p.x-tgt.x,p.y-tgt.y)<56){tgt.done=now;K.i++;tutNote(K.i-1);try{for(let j=0;j<14;j++){const a=j/14*TAU;part(tgt.x,tgt.y,Math.cos(a)*160,Math.sin(a)*160,.45,'#8fe9ff',2);}}catch(e){}
        if(K.i===3){K.gateOn=now;}}}
    else{const G_=K.gate,x1=G_.x+G_.nx*G_.h,y1=G_.y+G_.ny*G_.h,x2=G_.x-G_.nx*G_.h,y2=G_.y-G_.ny*G_.h;
      if(tutSegX(K.px,K.py,p.x,p.y,x1,y1,x2,y2)){if((p.dashT||0)>0||now-(TUT.lastDashAt||-1e9)<450){G_.done=now;tutNote(4);
          try{for(let j=0;j<22;j++){const a=j/22*TAU;part(G_.x,G_.y,Math.cos(a)*220,Math.sin(a)*220,.55,'#ffb84d',2.4);}}catch(e){}
          T.done.calib=1;tutOkMap().calib=1;tutDone('move');tutDone('dash');TUT.calDone=now;tutEnd('ok');return;}
        else{G_.fail=now;G_.fails++;tutNote(0);}}}
    if(Math.hypot(p.x-tgt.x,p.y-tgt.y)>1800){K.far+=dt;if(K.far>12){T.done.calib=1;tutSave();TUT.cal=null;tutEnd('abort');return;}}else K.far=0;
    K.px=p.x;K.py=p.y;},
  view(){const K=TUT.cal,I=tutInput(),p=G.player;if(!K)return {at:'none'};const tgt=K.i<3?K.pts[K.i]:K.gate,av=Math.atan2(tgt.y-p.y,tgt.x-p.x);
    if(K.i<3){const txt=`ЧЕРЕЗ КОЛЬЦА <b>${K.i+1}/3</b>`;if(I==='touch')return {keys:'',text:txt,at:'stick',draw:'calib'};return {keys:tutKeyHTML('move'),text:txt,at:'ship',draw:'calib',avoid:av};}
    const failNow=performance.now()-K.gate.fail<1400,txt=failNow?'<b>С РЫВКОМ</b> · ЕЩЁ РАЗ':'РЫВОК <b>СКВОЗЬ ЛУЧ</b>';
    if(I==='touch'){const d=$('#tDash');return {keys:'',text:txt,at:'el',el:d,ring:[d],draw:'calib',hostile:failNow};}
    return {keys:tutKeyHTML('dash'),text:txt,at:'ship',draw:'calib',avoid:av,hostile:failNow};}};
/* ARCH·86 · слой tutEmit 1 из 2 (строка 14365 в 1.5.25) перенесён в объединённый слой ниже */

/* ---------- «ИМПУЛЬС ГОТОВ»: накопитель впервые полон — показать, где он и что делает ---------- */
TUT_L.energy={ctx:'any',dur:4.8,info:true,
  when(){const p=G.player;return p.en>=100&&!tutDoneQ('pulse');},
  view(){const I=tutInput();if(I==='touch'){const d=$('#tPulse');return {keys:'',text:'<b>ИМПУЛЬС</b> ГОТОВ',at:'el',el:d,ring:[d],ringCls:'amber',draw:'pulsedemo'};}
    const eb=$('#enBar');return {keys:tutKeyHTML('pulse'),text:'<b>ИМПУЛЬС</b> ГОТОВ · ДЛЯ БОЯ',at:'el',el:eb&&tutVis(eb)?eb:null,ring:eb&&tutVis(eb)?[eb]:[],ringCls:'amber sq',draw:'pulsedemo'};}};

/* ---------- живые показы поверх уроков ---------- */
{const _wd=tutWorldDraw;tutWorldDraw=function(now){_wd.apply(this,arguments);const C=TUT.cur;if(!C||!C.v||!G.player)return;try{tutDemo(C,now);}catch(e){console.error(e);}};}
function tutDemo(C,now){if(!tutCtxOk(C.L.ctx==='mission'?'mission':'any'))return;const t=now/1000,p=G.player,c=ctx,k=C.v.draw,u=UI||1;const [PX,PY]=tutSP(p.x,p.y),s=(p.r||13)*SC;
  c.save();c.setTransform(DPR,0,0,DPR,0,0);
  const ghostShip=(x,y,a,al)=>{c.save();c.translate(x,y);c.rotate(a);c.globalAlpha=al;c.strokeStyle='#cfeeff';c.lineWidth=1.4;c.beginPath();c.moveTo(s*1.25,0);c.lineTo(-s*.8,-s*.78);c.lineTo(-s*.4,0);c.lineTo(-s*.8,s*.78);c.closePath();c.stroke();c.restore();};
  if(k==='pulse'||k==='pulsedemo'){const R=(G.st.pR||150)*SC,q=(t%1.3)/1.3;c.strokeStyle='#ffb84d';c.lineWidth=3*(1-q)+1;c.globalAlpha=(1-q)*.55;c.beginPath();c.arc(PX,PY,R*q,0,TAU);c.stroke();
    if(k==='pulsedemo'){c.globalAlpha=.35;c.lineWidth=1.2;c.setLineDash([6,8]);c.lineDashOffset=-t*18;c.beginPath();c.arc(PX,PY,R,0,TAU);c.stroke();c.setLineDash([]);}}
  if(k==='dash'){const T_=TUT.threat;let a=(p.ang||0)+Math.PI/2;if(T_&&T_.vx!==undefined)a=Math.atan2(T_.vy||0,T_.vx||0)+Math.PI/2;const q=(t%.9)/.9,e=1-Math.pow(1-q,3);
    for(let i=0;i<3;i++){const f=Math.max(0,e-i*.12);ghostShip(PX+Math.cos(a)*f*64,PY+Math.sin(a)*f*64,p.ang||0,(1-q)*(.45-i*.12));}}
  if(k==='stash'){const sh=tutShopPt();if(sh){const a=Math.atan2(sh.y-p.y,sh.x-p.x),L=Math.min(300,Math.hypot(sh.x-p.x,sh.y-p.y)-60);if(L>60)for(let i=0;i<4;i++){const q=((t*.7+i/4)%1),d=36+q*(L-36);const [X,Y]=tutSP(p.x+Math.cos(a)*d,p.y+Math.sin(a)*d);
      c.globalAlpha=Math.sin(q*Math.PI)*.9;c.fillStyle='#ffb84d';c.beginPath();c.arc(X,Y,2.6+1.2*Math.sin(q*Math.PI),0,TAU);c.fill();}}}
  if(k==='calib')tutCalDraw(now);
  c.restore();}
function tutCalDraw(now){const K=TUT.cal;if(!K)return;const t=now/1000,c=ctx,u=UI||1,p=G.player,ice='#8fe9ff',amb='#ffb84d',red='#ff4f6e';
  const R=56*SC;
  K.pts.forEach((q,i)=>{const [X,Y]=tutSP(q.x,q.y);
    if(q.done){const e=(now-q.done)/450;if(e<1){c.globalAlpha=(1-e)*.9;c.strokeStyle=ice;c.lineWidth=3;c.beginPath();c.arc(X,Y,R*(1+e*.8),0,TAU);c.stroke();}return;}
    const act=i===K.i;c.globalAlpha=act?1:.22;c.strokeStyle=ice;c.lineWidth=act?2.2:1.4;c.beginPath();c.arc(X,Y,R,0,TAU);c.stroke();
    if(act){c.save();c.translate(X,Y);c.rotate(t*.9);c.lineWidth=3;c.globalAlpha=.8;for(let j=0;j<4;j++){c.beginPath();c.arc(0,0,R+7,j*Math.PI/2,j*Math.PI/2+.5);c.stroke();}c.restore();
      const q2=(t*.9)%1;c.globalAlpha=(1-q2)*.5;c.lineWidth=1.5;c.beginPath();c.arc(X,Y,R*(1+q2*.5),0,TAU);c.stroke();
      const g=c.createRadialGradient(X,Y,0,X,Y,R);g.addColorStop(0,'rgba(143,233,255,.16)');g.addColorStop(1,'rgba(143,233,255,0)');c.globalAlpha=1;c.fillStyle=g;c.beginPath();c.arc(X,Y,R,0,TAU);c.fill();}
    c.globalAlpha=act?.95:.3;c.font='700 11px "JetBrains Mono",monospace';c.textAlign='center';c.fillStyle=ice;c.fillText(String(i+1),X,Y+4);});
  /* ворота: два пилона и луч */
  const G_=K.gate,on=K.i>=3,ax=G_.x+G_.nx*G_.h,ay=G_.y+G_.ny*G_.h,bx=G_.x-G_.nx*G_.h,by=G_.y-G_.ny*G_.h,[X1,Y1]=tutSP(ax,ay),[X2,Y2]=tutSP(bx,by),[GX,GY]=tutSP(G_.x,G_.y);
  const fail=now-G_.fail<600,col=fail?red:amb;c.globalAlpha=on?1:.25;
  for(const [X,Y] of [[X1,Y1],[X2,Y2]]){c.save();c.translate(X,Y);c.rotate(Math.PI/4);c.fillStyle='#0a1220';c.strokeStyle=col;c.lineWidth=2;c.fillRect(-7*u,-7*u,14*u,14*u);c.strokeRect(-7*u,-7*u,14*u,14*u);c.restore();}
  c.strokeStyle=col;c.lineWidth=on?3:1.5;c.setLineDash([9,7]);c.lineDashOffset=-t*40;c.globalAlpha=on?(.65+.35*Math.sin(t*8)):.2;c.beginPath();c.moveTo(X1,Y1);c.lineTo(X2,Y2);c.stroke();c.setLineDash([]);
  if(on){c.globalAlpha=.18;c.lineWidth=10;c.beginPath();c.moveTo(X1,Y1);c.lineTo(X2,Y2);c.stroke();
    /* призрак показывает рывок сквозь луч */
    const q=(t%1.6)/1.6;if(q<.7){const dx=K.dx,dy=K.dy,f=q/.7,e=f<.45?f/.45*.55:.55+(f-.45)/.55*.45*1.0;const sx=G_.x-dx*120+dx*240*e,sy=G_.y-dy*120+dy*240*e,[SX,SY]=tutSP(sx,sy),s=(p.r||13)*SC;
      c.save();c.translate(SX,SY);c.rotate(Math.atan2(dy,dx));c.globalAlpha=.35*(1-f*.6);c.strokeStyle='#cfeeff';c.lineWidth=1.4;c.beginPath();c.moveTo(s*1.25,0);c.lineTo(-s*.8,-s*.78);c.lineTo(-s*.4,0);c.lineTo(-s*.8,s*.78);c.closePath();c.stroke();
      if(f>.45){c.globalAlpha=.25*(1-f);c.beginPath();c.moveTo(-s*.4,0);c.lineTo(-s*3.2,0);c.stroke();}c.restore();}
    c.globalAlpha=1;c.font='700 11px "JetBrains Mono",monospace';c.textAlign='center';c.fillStyle=col;c.fillText('РЫВОК',GX,Math.min(Y1,Y2)-14);}
  /* путь к активной цели и стрелка у края, если цель за кадром */
  const tg=K.i<3?K.pts[K.i]:G_,[TX,TY]=tutSP(tg.x,tg.y);
  if(TX<20||TX>CW-20||TY<20||TY>CH-20){const cx=CW/2,cy=CH/2,a=Math.atan2(TY-cy,TX-cx),m=46*u,ex=clamp(cx+Math.cos(a)*CW,m,CW-m),ey=clamp(cy+Math.sin(a)*CH,m+(isMob()?150:120*u),CH-m-(isMob()?160:80*u));
    c.save();c.translate(ex,ey);c.rotate(a);c.scale(u,u);c.fillStyle=K.i<3?ice:amb;c.globalAlpha=.85+.15*Math.sin(t*5);c.beginPath();c.moveTo(12,0);c.lineTo(-6,-8);c.lineTo(-2,0);c.lineTo(-6,8);c.closePath();c.fill();c.restore();}
  else{const a=Math.atan2(tg.y-p.y,tg.x-p.x),d=Math.min(260,Math.hypot(tg.x-p.x,tg.y-p.y)-70);if(d>30){const [A1,B1]=tutSP(p.x+Math.cos(a)*34,p.y+Math.sin(a)*34),[A2,B2]=tutSP(p.x+Math.cos(a)*d,p.y+Math.sin(a)*d);
    c.strokeStyle=K.i<3?ice:amb;c.globalAlpha=.5;c.lineWidth=1.6;c.setLineDash([5,8]);c.lineDashOffset=-t*30;c.beginPath();c.moveTo(A1,B1);c.lineTo(A2,B2);c.stroke();c.setLineDash([]);}}
  c.globalAlpha=1;}
/* призрак пальца — и для колец калибровки */
{const _gd=tutGhostDraw;tutGhostDraw=function(now){const C=TUT.cur;if(C&&C.k==='calib'&&TUT.cal&&TUT.cal.i<3&&tutInput()==='touch'){const k=C.k;C.k='move';try{_gd.apply(this,arguments);}finally{C.k=k;}return;}return _gd.apply(this,arguments);};}
/* карта: путь от корабля к выбранной точке прыжка */
/* ARCH·86 · слой tutMapDraw 1 из 2 (строка 14416 в 1.5.25) перенесён в объединённый слой ниже */

/* ---------- карточка «ДОПУСК ПИЛОТА» в паузе: управление под ваше устройство ---------- */
const TUT_CTL={flight:{kbm:'W A S D · СТРЕЛКИ',touch:'СТИК СЛЕВА',pad:'ЛЕВЫЙ СТИК'},dash:{kbm:'ПРОБЕЛ',touch:'КНОПКА «РЫВОК» · СВАЙП',pad:'A'},pulse:{kbm:'E · SHIFT',touch:'КНОПКА «ИМП»',pad:'X'},
  act:{kbm:'F · ENTER',touch:'КНОПКА НАД РЫВКОМ',pad:'B'},stash:{kbm:'ЛОМ → МАСТЕРСКАЯ',touch:'ЛОМ → МАСТЕРСКАЯ',pad:'ЛОМ → МАСТЕРСКАЯ'},map:{kbm:'M · TAB',touch:'«КАРТА» · МИНИКАРТА',pad:'Y'},
  jump:{kbm:'КЛИК ПО КОЛЬЦУ НА КАРТЕ',touch:'ТОЧКА → «ПРЫЖОК»',pad:'С МЫШЬЮ ИЛИ КАСАНИЕМ'},beacon:{kbm:'ЯЧЕЙКИ В КОЛЬЦО',touch:'ЯЧЕЙКИ В КОЛЬЦО',pad:'ЯЧЕЙКИ В КОЛЬЦО'}};
function tutCardHTML(){const I=tutInput(),n=tutSkillN();
  return `<summary><span>ДОПУСК ПИЛОТА</span><b>${n}/${TUT_SK.length}</b></summary><div class="tcard-l">${TUT_SK.map(s=>{const ok=tutSkillOk(s);
    return `<div class="tcard-r${ok?' ok':''}"><svg viewBox="0 0 24 24" aria-hidden="true">${s.ic}</svg><span class="nm">${s.n}</span><span class="tck">${TUT_CTL[s.k][I]}</span><i aria-label="${ok?'освоено':'ещё нет'}">${ok?'✓':''}</i></div>`;}).join('')}</div>`;}
{const _pz=pause;pause=function(){const r=_pz.apply(this,arguments);try{if(G.state==='pause'&&G.save&&G.mode==='world'){const pnl=document.querySelector('#sPause .panel');if(pnl){let d=$('#tutCard');if(!d){d=document.createElement('details');d.id='tutCard';const st=$('#pauseStat');(st||pnl.firstElementChild).insertAdjacentElement('afterend',d);}
    const T=tutT(),done=tutSkillN()>=TUT_SK.length;d.innerHTML=tutCardHTML();d.open=!done&&!!T&&!T.off&&!T.vet;d.hidden=false;}}else{const d=$('#tutCard');if(d)d.hidden=true;}}catch(e){console.error(e);}return r;};}

