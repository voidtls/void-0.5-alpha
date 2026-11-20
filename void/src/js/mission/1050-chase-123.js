/* ===== 1.2.3 α «Погоня»: полоса разгона, гравитационный колодец закрытых миссий, редкое событие «Погоня» ===== */
function lessFx34(){return document.documentElement.classList.contains('lessfx')||!SET.fx;}
function rgba34(hex,a){const n=parseInt(hex.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${Math.max(0,Math.min(1,a)).toFixed(3)})`;}

// ---------- 1. Полоса разгона: куда (шевроны), до куда (скоба), когда (заливка и фиксация) ----------
const RAM_V=660,RAM_T=.55,RAM_AIM=.85,RAM_LOCK=.22;
// путь до полной остановки: рывок 0,55 с плюс скольжение в отдыхе (скорость × 0,92 за кадр)
function ramStop(){/* рывок (кадры замаха→рывка включительно) + занос 0,7 с при v*=.92 за кадр */return RAM_V*(RAM_T+2/60+.92*(1-Math.pow(.92,42))/.08/60)*(G.eSpd||1);}
// x,y — центр врага; ang — курс; len — путь рывка (скорость × время); hw — полуширина коридора удара; k — прогресс 0..1;
// locked — курс зафиксирован; o.r — отступ от корпуса, o.flash — вспышка фиксации 0..1, o.alpha — общий множитель (шлейф)
function teleLane(x,y,ang,len,hw,k,locked,col,o){o=o||{};const lf=lessFx34(),r0=o.r||0,hw2=hw*.6,A=o.alpha===undefined?1:o.alpha;
  const pulse=!lf&&!locked&&k<.4?1+.15*Math.sin(G.t*TAU*2.5):1,jit=!lf&&!locked&&o.alpha===undefined?(Math.random()-.5):0;
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);
  if(o.alpha===undefined){const a=(.06+.06*k)*A,g=ctx.createLinearGradient(r0,0,len,0),kk=clamp(k,.02,.98);
    g.addColorStop(0,rgba34(col,a));g.addColorStop(kk,rgba34(col,a*.85));g.addColorStop(Math.min(1,kk+.02),rgba34(col,.015*A));g.addColorStop(1,rgba34(col,.015*A));
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(r0,-hw);ctx.lineTo(len,-hw2);ctx.lineTo(len,hw2);ctx.lineTo(r0,hw);ctx.closePath();ctx.fill();}
  const rg=ctx.createLinearGradient(r0,0,len,0);rg.addColorStop(0,rgba34(col,(locked?.85:.7)*A*pulse));rg.addColorStop(1,rgba34(col,(locked?.4:.25)*A));
  ctx.strokeStyle=rg;ctx.lineWidth=locked?1.5:1.2;ctx.beginPath();ctx.moveTo(r0,-hw+jit);ctx.lineTo(len,-hw2+jit);ctx.moveTo(r0,hw-jit);ctx.lineTo(len,hw2-jit);ctx.stroke();
  if(o.flash>0){ctx.globalCompositeOperation='lighter';ctx.strokeStyle=rgba34(col,.4*o.flash);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(r0,-hw);ctx.lineTo(len,-hw2);ctx.moveTo(r0,hw);ctx.lineTo(len,hw2);ctx.stroke();ctx.globalCompositeOperation='source-over';}
  if(o.alpha===undefined){const sp=lf?0:(.6+1.8*k),fr=(G.t*sp)%1,cs=Math.min(8,hw2*.8);ctx.strokeStyle=rgba34(col,.55*A);ctx.lineWidth=1.3;
    for(let i=0;i<3;i++){const q=(fr+i/3)%1,cx=r0+(len-r0)*(.12+.76*q);ctx.globalAlpha=lf?1:Math.min(1,Math.sin(q*Math.PI)*1.6);ctx.beginPath();ctx.moveTo(cx-cs,-cs);ctx.lineTo(cx,0);ctx.lineTo(cx-cs,cs);ctx.stroke();}ctx.globalAlpha=1;
    ctx.strokeStyle=rgba34(col,(locked?.95:.75)*A);ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(len-7,-hw2-4);ctx.lineTo(len,-hw2-4);ctx.lineTo(len,hw2+4);ctx.lineTo(len-7,hw2+4);ctx.stroke();}
  ctx.restore();}
function laneRammer(e){if(G.noTele)return;const pr=(G.player&&G.player.r)||14;
  if(e.st==='aim'){const k=1-clamp(e.timer/RAM_AIM,0,1),lk=e.timer<=RAM_LOCK,fl=lk?Math.max(0,1-(RAM_LOCK-e.timer)/.12):0;
    e.lane={x:e.x,y:e.y,a:e.aim};teleLane(e.x,e.y,e.aim,ramStop(),e.r+pr,k,lk,EDEF.rammer.col,{r:e.r+2,flash:fl});}
  else if(e.st==='charge'&&e.lane&&e.timer>RAM_T-.15){const L=e.lane;teleLane(L.x,L.y,L.a,ramStop(),e.r+pr,1,true,EDEF.rammer.col,{r:e.r+2,alpha:(e.timer-(RAM_T-.15))/.15});}}

// ---------- 2. Гравитационный колодец закрытой миссии ----------
const WELL_R0=560,WELL_R1=420,WELL_MIN=170,WELL_DRIFT=80;
function wellK(d){return Math.pow(clamp((d-WELL_MIN)/(WELL_R0-WELL_MIN),0,1),1.6);}
function wellReq(m){for(let q=1;q<m;q++)if(!progDone(q))return q;return Math.max(1,m-1);}
function wellTick(dt){const p=G.player,w=G.w;if(!p||p.hp<=0)return;let depth=0,near=null;
  for(const n of WORLD.nodes){if(nodeState(n.m)!=='locked')continue;const d=Math.hypot(p.x-n.x,p.y-n.y);if(d>=WELL_R0)continue;
    const ux=(p.x-n.x)/(d||1),uy=(p.y-n.y)/(d||1),d0=Math.hypot(p.px-n.x,p.py-n.y);
    // смещение кадра: внутрь — гасится k(d), наружу — свободно; плюс снос наружу
    const mx=p.x-p.px,my=p.y-p.py,dr=mx*ux+my*uy;if(dr<0){const k=wellK(Math.min(d,d0));p.x-=ux*dr*(1-k);p.y-=uy*dr*(1-k);}
    /* вбок — свободно: колодец можно обогнуть по краю, не застревая */
    const drift=WELL_DRIFT*clamp(1-(d-WELL_MIN)/(WELL_R0-WELL_MIN),0,1);p.x+=ux*drift*dt;p.y+=uy*drift*dt;
    const d2=Math.hypot(p.x-n.x,p.y-n.y);if(d2<WELL_MIN){p.x=n.x+ux*WELL_MIN;p.y=n.y+uy*WELL_MIN;}
    const dp=1-clamp((d-WELL_MIN)/(WELL_R0-WELL_MIN),0,1);if(dp>depth){depth=dp;near=n;}
    if(d<WELL_R1&&d0>=WELL_R1){buzz('hit');hintOnce('noise','СИГНАЛ НЕ РАСШИФРОВАН','#9fb0c4');}}
  G.well={depth,n:near};if(depth>0)G.calm=0;wellAudio(depth);}
let wellAU=null;
function wellAudio(depth){try{if(!AU.ctx||!SET.sfx){if(wellAU){wellAU.g.gain.value=0;}return;}const c=AU.ctx;
  if(!wellAU&&depth>0){const g=c.createGain();g.gain.value=0;g.connect(AU.sfx);const o=c.createOscillator();o.type='sine';o.frequency.value=48;const o2=c.createOscillator();o2.type='triangle';o2.frequency.value=96.5;const g2=c.createGain();g2.gain.value=.25;o.connect(g);o2.connect(g2);g2.connect(g);o.start();o2.start();wellAU={g,o,o2};}
  if(wellAU){wellAU.g.gain.setTargetAtTime(depth>0&&G.state==='world'?.18*depth:0,c.currentTime,.2);wellAU.o.frequency.setTargetAtTime(48+62*depth,c.currentTime,.3);wellAU.o2.frequency.setTargetAtTime(96.5+124*depth,c.currentTime,.3);}}catch(e){}}
function drawWell(n,t){const p=G.player,d=p?Math.hypot(p.x-n.x,p.y-n.y):1e9,lf=lessFx34(),near=clamp(1-(d-WELL_MIN)/(1100-WELL_MIN),0,1);
  // кольца-изолинии воронки: густеют к центру
  ctx.save();ctx.translate(n.x,n.y);for(let i=0;i<6;i++){const q=(i+.5)/6,r=WELL_MIN+(WELL_R0-WELL_MIN)*Math.pow(q,1.7);ctx.strokeStyle=rgba34('#9fb0c4',(.05+.16*near)*(1-q*.5));ctx.lineWidth=1;
    ctx.setLineDash([10+i*4,8+i*3]);ctx.lineDashOffset=lf?0:-G.t*(18-i*2)*(i%2?1:-1);ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke();}ctx.setLineDash([]);
  ctx.strokeStyle=rgba34('#9fb0c4',.3);ctx.setLineDash([6,10]);ctx.beginPath();ctx.arc(0,0,WELL_R1,0,TAU);ctx.stroke();ctx.setLineDash([]);
  // течение наружу: штрихи бегут от центра
  if(SET.fx){const N=lf?14:42;for(let i=0;i<N;i++){const a=i*2.399+(i%7)*.1,ph=((G.t*(.18+(i%5)*.03)+i*.137)%1),r=WELL_MIN*.6+(WELL_R0-WELL_MIN*.6)*ph,l=8+18*(1-ph);
    ctx.strokeStyle=rgba34('#bfd2e6',(.08+.22*near)*(1-ph));ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);ctx.lineTo(Math.cos(a)*(r+l),Math.sin(a)*(r+l));ctx.stroke();}}
  // тизер: сквозь помехи едва виден маяк миссии
  ctx.globalAlpha=.12+.2*near*(lf?1:.7+.3*Math.sin(G.t*7));ctx.strokeStyle='#9fb0c4';ctx.lineWidth=2;poly(8,22,G.t*.2);ctx.stroke();ctx.globalAlpha=1;ctx.restore();
  const depth=clamp(1-(d-WELL_MIN)/(WELL_R0-WELL_MIN),0,1);
  if(depth>.55)worldLabel(n.x,n.y-44,'МИССИЯ '+pad2(n.m)+' · СНАЧАЛА '+pad2(wellReq(n.m)),'#9fb0c4');else worldLabel(n.x,n.y,'?','#7a8ea5');}

// ---------- 3. «Погоня»: патруль сектора гонится за двойником VØID к Разлому ----------
RADIO['Д']={tag:'БЕЗ ПОЗЫВНОГО',col:'#ffb84d',l:[{t:'…вижу край… ещё немного…'},{t:'…не догонят… не должны догнать…'},{t:'…там тихо. Там должно быть тихо…'}]};
const CHASE={vFar:.6,tMin:30,tMax:60,check:60,p:.04,pLate:.12,gap:1200,late:2700,dMin:1600,dMax:2400,near:1200,doom:900,lose:1900};
let CHS=null;
function chaseSave(){const S=G.save;if(!S)return null;if(!S.chase||typeof S.chase!=='object')S.chase={seen:0,lost:0,wt:0,last:-1e9,ck:0};return S.chase;}
function chaseCan(){const S=G.save,p=G.player;if(!S||!p||G.state!=='world'||!G.world||G.mode!=='world')return false;if(!progDone(6))return false;
  if((G.calm||0)<20||G.event||G.anom||(typeof zbOn==='function'&&zbOn())||(G.riftI||0)>.05||p.hp<=0)return false;
  if(G.zones&&G.zones.some(z=>z.active))return false;const sec=inSectors(p.x,p.y)?sectorIdx(p.x,p.y):-1;if(sec<0||sec>=11)return false;return true;}
function chaseSpd(){return ((G.st&&G.st.speed)||260);}
function chasePick(){const p=G.player;const base=Math.atan2(p.vy||0,p.vx||1);
  for(let tr=0;tr<60;tr++){const a=tr<30?base+(Math.random()<.5?1:-1)*(Math.PI/2+rnd(-.6,.6)):rnd(0,TAU),d=rnd(CHASE.dMin,CHASE.dMax),x=p.x+Math.cos(a)*d,y=p.y+Math.sin(a)*d;
    if(!inSectors(x,y)||!revealedAt(x,y))continue;try{if(fogBlockedAt(x,y))continue;}catch(e){}
    const sec=sectorIdx(x,y);if(sec<0||sec>=11)continue;
    if(WORLD.nodes.some(n=>nodeState(n.m)==='locked'&&Math.hypot(n.x-x,n.y-y)<WELL_R0+200))continue;
    if(WORLD.shops.some(s=>Math.hypot(s.x-x,s.y-y)<700))continue;if(G.zones&&G.zones.some(z=>z.active&&Math.hypot(z.x-x,z.y-y)<1200))continue;
    // курс: прямая до края Разлома длиной 30–60 с хода; не через игрока
    const v=chaseSpd()*CHASE.vFar,ax=x-p.x,ay=y-p.y,al=Math.hypot(ax,ay)||1,o0=rnd(0,TAU);let best=null;
    for(let k=0;k<16;k++){const h=o0+k*TAU/16,hx=Math.cos(h),hy=Math.sin(h);if((hx*ax+hy*ay)/al<-.2)continue;let L=0;while(L<v*CHASE.tMax+400&&inSectors(x+hx*L,y+hy*L)&&riftInfo(x+hx*L,y+hy*L).d<-220)L+=60;
      const tt=L/v;if(tt<CHASE.tMin||tt>CHASE.tMax)continue;if(!best||Math.abs(tt-45)<Math.abs(best.tt-45))best={tt,tx:x+hx*(L+240),ty:y+hy*(L+240)};}
    if(!best)continue;return {x,y,sec,tx:best.tx,ty:best.ty,tt:best.tt};}
  return null;}
function chaseSet(sec,x,y){let best=null,bd=1e18;for(const z of WORLD.zones){if(!z.set||sectorIdx(z.x,z.y)!==sec)continue;const d=Math.hypot(z.x-x,z.y-y);if(d<bd){bd=d;best=z;}}
  const set=best?best.set:{scout:3,gunner:2};const L=[];for(const [t,c] of Object.entries(set))for(let i=0;i<c;i++)if(EDEF[t]&&!['mine','lock','boss','jam'].includes(t))L.push(t);
  if(!L.length)L.push('scout','scout','gunner','gunner');const n=clamp(4+(Math.random()*3|0),4,6),out=[];for(let i=0;i<n;i++)out.push(L[(i*7+3)%L.length]);
  if(sec>=2&&best&&best.lead)out[0]=best.lead;return out;}
function chaseStart(force){const S=G.save,cs=chaseSave();if(!S||CHS)return false;const pk=chasePick();if(!pk)return false;
  const serial=(()=>{let n;do{n=14+(Math.random()*85|0);}while(n===13);return n;})();
  const dir=Math.atan2(pk.ty-pk.y,pk.tx-pk.x);
  CHS={ph:'far',t:0,sec:pk.sec,tx:pk.tx,ty:pk.ty,set:chaseSet(pk.sec,pk.x,pk.y),serial,
    d:{x:pk.x,y:pk.y,vx:Math.cos(dir),vy:Math.sin(dir),r:14,hp:140,maxHp:140,ang:dir,dodgeT:1.5,fireT:1,seenT:0,doomT:null,dead:false,gone:0},
    pat:{x:pk.x-Math.cos(dir)*320,y:pk.y-Math.sin(dir)*320},hunters:[],tr:[],fade:0,turnT:0,force:!!force};
  cs.last=cs.wt;try{radioSay('Д',(Math.random()*3)|0);}catch(e){}return true;}
function chaseEnd(lost){const cs=chaseSave();if(CHS){for(const e of CHS.hunters)if(e.alive&&e.hunt){e.alive=false;}if(lost&&cs)cs.lost++;}CHS=null;}
function chaseSpawnHunters(){const c=CHS,p=G.player;c.hunters=[];for(let i=0;i<c.set.length;i++){const a=i/c.set.length*TAU,x=c.pat.x+Math.cos(a)*60,y=c.pat.y+Math.sin(a)*60;
  const e=spawnEnemy(c.set[i],x,y,{noAffix:true,spawnT:.3});e.hunt=true;e.chase=true;e.hi=i;e.hcd=rnd(.4,1);c.hunters.push(e);}c.ph='live';}
function chaseTick(dt){const cs=chaseSave();if(!cs)return;if(G.state==='world'&&G.world)cs.wt+=dt;
  if(!CHS){if(!G.world||G.state!=='world')return;cs.ck=(cs.ck||0)+dt;if(cs.ck>=CHASE.check){cs.ck=0;if(cs.wt-cs.last>=CHASE.gap&&chaseCan()){const pr=cs.wt-cs.last>=CHASE.late?CHASE.pLate:CHASE.p;if(Math.random()<pr)chaseStart();}}return;}
  const c=CHS,p=G.player,D=c.d;if(!G.world||G.mode!=='world'){chaseEnd(false);return;}c.t+=dt;
  if(c.fade>0){c.fade-=dt;if(c.fade<=0)chaseEnd(c.lostFlag);return;}
  const dP=Math.hypot(D.x-p.x,D.y-p.y),toT=Math.atan2(c.ty-D.y,c.tx-D.x),base=chaseSpd();
  if(!D.dead){
    // двойник: к краю Разлома; вдали — быстро и ровно, в живом бою — медленнее, уворачивается и отстреливается
    const live=c.ph==='live',v=live?base*.7:base*CHASE.vFar;D.dodgeT-=dt;let side=0;if(live&&D.dodgeT<=0){D.dodgeT=rnd(1.4,2.4);D.dash=.25*(Math.random()<.5?1:-1);}
    if(D.dash){side=Math.sign(D.dash);D.dash=Math.abs(D.dash)>dt?D.dash-Math.sign(D.dash)*dt:0;}
    const a=toT+Math.sin(c.t*.7)*.18;D.vx=Math.cos(a)*v+(side?-Math.sin(a)*side*520:0);D.vy=Math.sin(a)*v+(side?Math.cos(a)*side*520:0);D.x+=D.vx*dt;D.y+=D.vy*dt;D.ang=Math.atan2(D.vy,D.vx);
    if(SET.fx&&live&&Math.random()<.5)part(D.x-Math.cos(D.ang)*14,D.y-Math.sin(D.ang)*14,-D.vx*.2,-D.vy*.2,.35,'#6f8fb0',2);
    if(Math.hypot(c.tx-D.x,c.ty-D.y)<60||(!inSectors(D.x,D.y)&&Math.hypot(c.tx-D.x,c.ty-D.y)<700)){D.dead=true;D.gone=1;c.fade=2;c.lostFlag=true;if(live){chaseTurn();}else return;}
    if(!live){const pd=Math.hypot(c.pat.x-D.x,c.pat.y-D.y),pa=Math.atan2(D.y-c.pat.y,D.x-c.pat.x),pv=pd>340?v*1.05:pd<260?v*.9:v;c.pat.x+=Math.cos(pa)*pv*dt;c.pat.y+=Math.sin(pa)*pv*dt;
      if(dP<CHASE.near)chaseSpawnHunters();}
    else{if(dP>CHASE.lose+100){for(const e of c.hunters)e.alive=false;c.hunters=[];c.ph='far';c.pat={x:D.x-Math.cos(D.ang)*320,y:D.y-Math.sin(D.ang)*320};return;}
      // развязка: игрок ближе 700 или видит двойника на экране дольше 2 с
      const onS=inView(D.x,D.y,20);D.seenT=onS?D.seenT+dt:Math.max(0,D.seenT-dt);if(D.doomT===null&&(dP<CHASE.doom||D.seenT>1.2))D.doomT=rnd(2.2,3.4);
      if(D.doomT!==null){D.doomT-=dt;if(D.doomT<=0)D.hp=0;}
      D.fireT-=dt;if(D.fireT<=0){D.fireT=rnd(.35,.6);const tg=c.hunters.filter(e=>e.alive).sort((a,b)=>Math.hypot(a.x-D.x,a.y-D.y)-Math.hypot(b.x-D.x,b.y-D.y))[0];
        if(tg){const a2=Math.atan2(tg.y-D.y,tg.x-D.x);c.tr.push({x:D.x,y:D.y,vx:Math.cos(a2)*900,vy:Math.sin(a2)*900,life:.5,col:'#9fd8ff',own:true});}}
      if(!c.paid&&c.hunters.length&&c.hunters.every(e=>!e.alive)){c.paid=1;chaseReward();}
      if(D.hp<=0)chaseDie();}}
  else if(c.ph==='turn'){c.turnT-=dt;for(const e of c.hunters)if(e.alive){e.vx*=.85;e.vy*=.85;}if(c.turnT<=0){c.ph='fight';for(const e of c.hunters)if(e.alive){e.hunt=false;}
      const q=c.hunters.find(e=>e.alive);if(q)floater(q.x,q.y-40,'ПАТРУЛЬ','#ff4f6e');sfx('warn');}}
  else if(c.ph==='fight'){const alive=c.hunters.filter(e=>e.alive);if(!alive.length){if(!c.paid){c.paid=1;chaseReward();}chaseEnd(false);return;}
    if(Math.min(...alive.map(e=>Math.hypot(e.x-p.x,e.y-p.y)))>CHASE.lose){for(const e of alive)e.alive=false;chaseEnd(false);return;}}
  // трассы: попадания по двойнику
  for(const b of c.tr){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(!b.own&&!D.dead&&Math.hypot(b.x-D.x,b.y-D.y)<D.r+4){b.life=0;D.hp-=7;if(SET.fx)part(D.x,D.y,rnd(-80,80),rnd(-80,80),.3,'#ffd9a0',2);}
    if(b.own)for(const e of c.hunters)if(e.alive&&Math.hypot(b.x-e.x,b.y-e.y)<e.r+3){b.life=0;if(SET.fx)part(b.x,b.y,rnd(-60,60),rnd(-60,60),.2,'#9fd8ff',1.5);break;}}
  c.tr=c.tr.filter(b=>b.life>0);if(c.gl>0)c.gl-=dt;}
function chaseDie(){const c=CHS,D=c.d;D.dead=true;c.gl=.6;try{postSnd('static',0,1);}catch(e){}if(SET.fx)for(let i=0;i<14;i++)part(D.x,D.y,rnd(-160,160),rnd(-160,160),.5,Math.random()<.5?'#ff2d55':'#2de0ff',2);
  const cs=chaseSave();if(cs&&!c.counted){c.counted=1;cs.seen++;c.firstSeen=cs.seen===1;}chaseTurn();}
function chaseTurn(){const c=CHS;if(!c.hunters.some(e=>e.alive)){c.fade=Math.max(c.fade,2);return;}c.ph='turn';c.turnT=.6;c.fade=0;}
function chaseReward(){const c=CHS,S=G.save,p=G.player;if(!c.d.dead){const cs=chaseSave();if(cs&&!c.counted){c.counted=1;cs.seen++;c.firstSeen=cs.seen===1;}}const v=Math.round((10+c.hunters.length*3)*1.5);S.carry=(S.carry||0)+v;floater(p.x,p.y-40,'ПАТРУЛЬ РАЗБИТ · +'+v+' ЛОМА','#c9d2de');sfx('level');try{conEvent('patrol');}catch(e){}
  if(c.firstSeen)setTimeout(()=>{try{toast('ДВОЙНИК · КУРС НА РАЗЛОМ','Запись открыта в журналах.');}catch(e){}},900);saveWorld();}
// ИИ охотников: пока двойник жив, патруль его не отпускает и игрока не замечает
function chaseHunterAI(dt){const c=CHS;if(!c)return;const D=c.d;for(const e of c.hunters){if(!e.alive||!e.hunt)continue;if(e.spawnT>0){e.spawnT-=dt;continue;}
  if(D.dead){e.vx*=.9;e.vy*=.9;e.x+=e.vx*dt;e.y+=e.vy*dt;continue;}
  const back=Math.atan2(-D.vy,-D.vx),off=(e.hi-(c.hunters.length-1)/2)*.45,R=150+(e.hi%3)*40,tx=D.x+Math.cos(back+off)*R,ty=D.y+Math.sin(back+off)*R,dx=tx-e.x,dy=ty-e.y,dl=Math.hypot(dx,dy)||1,sp=(EDEF[e.type].spd||90)*2.4;
  e.vx+=(dx/dl*sp-e.vx)*Math.min(1,dt*3);e.vy+=(dy/dl*sp-e.vy)*Math.min(1,dt*3);e.x+=e.vx*dt;e.y+=e.vy*dt;e.ang=Math.atan2(D.y-e.y,D.x-e.x);
  e.hcd-=dt;if(e.hcd<=0){e.hcd=rnd(.55,1.1);const a=Math.atan2(D.y-e.y,D.x-e.x)+rnd(-.06,.06);c.tr.push({x:e.x,y:e.y,vx:Math.cos(a)*620,vy:Math.sin(a)*620,life:.9,col:EDEF[e.type].col||'#ff4f6e'});}}}
function chaseDraw(t){if(!CHS)return;const c=CHS,D=c.d;
  for(const b of c.tr){ctx.strokeStyle=b.col;ctx.globalAlpha=.85;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-b.vx*.025,b.y-b.vy*.025);ctx.stroke();}ctx.globalAlpha=1;
  if(!D.dead||c.gl>0){if(!inView(D.x,D.y,60))return;const gl=c.gl>0?c.gl/.6:0;
    const one=(dx,col,al)=>{ctx.save();ctx.translate(D.x+dx,D.y);ctx.rotate(D.ang);ctx.globalAlpha=al;if(col){ctx.globalCompositeOperation='lighter';ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(19,0);ctx.lineTo(-11,-12);ctx.lineTo(-5,0);ctx.lineTo(-11,12);ctx.closePath();ctx.fill();}else drawShip('base',t,Math.hypot(D.vx,D.vy),{});ctx.restore();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';};
    if(gl>0){if(Math.random()<.7){one(-5,'#ff2d55',.5*gl);one(5,'#2de0ff',.5*gl);one(0,null,.6*gl);}}else{one(0,null,.88);
      worldLabel(D.x,D.y-34,'VØID-0'+String(c.serial).padStart(2,'0'),'#9fb0c4');}}}
// карта и мини-карта: знак патруля (три шеврона) и оранжевый «?», оба движутся
function chaseMapPts(){if(!CHS)return null;const c=CHS,D=c.d;let px=c.pat.x,py=c.pat.y,pa=Math.atan2(D.y-c.pat.y,D.x-c.pat.x);
  if(c.ph!=='far'){const al=c.hunters.filter(e=>e.alive);if(al.length){px=al.reduce((s,e)=>s+e.x,0)/al.length;py=al.reduce((s,e)=>s+e.y,0)/al.length;pa=D.dead?Math.atan2(G.player.y-py,G.player.x-px):Math.atan2(D.y-py,D.x-px);}else px=null;}
  return {q:D.dead&&!c.fade?null:{x:D.x,y:D.y,a:c.fade>0?Math.min(1,c.fade/2):1},pt:px===null?null:{x:px,y:py,a:pa}};}
function chaseIcon(g,kind,o,t){if(kind==='chaseQ'){g.globalAlpha=o.a===undefined?1:o.a;g.font='800 13px "JetBrains Mono",monospace';g.textAlign='center';g.fillStyle='#ffb84d';g.fillText('?',0,4.5);g.globalAlpha=1;return true;}
  if(kind==='chaseP'){g.save();g.rotate(o.ang||0);g.strokeStyle='#ff4f6e';g.lineWidth=1.6;for(const dx of [-5,0,5]){g.beginPath();g.moveTo(dx-3,-4);g.lineTo(dx+1,0);g.lineTo(dx-3,4);g.stroke();}g.restore();return true;}return false;}
{const _ma34=w58MapAdd;w58MapAdd=function(add,lod,S){_ma34(add,lod,S);try{const m=chaseMapPts();if(m){if(m.pt)add('chaseP',m.pt.x,m.pt.y,{ang:m.pt.a},lod>=1?{t:'ПАТРУЛЬ',p:3,c:'#ff4f6e'}:null);if(m.q)add('chaseQ',m.q.x,m.q.y,{a:m.q.a},null);}}catch(e){}};}
{const _mi34=w58MapIcon;w58MapIcon=function(g,kind,o,t){if(chaseIcon(g,kind,o,t))return true;return _mi34(g,kind,o,t);};}
{const _mn34=mini95;mini95=function(g,P,s){_mn34(g,P,s);try{const m=chaseMapPts();if(!m)return;const clampP=(x,y)=>{const dx=x-s/2,dy=y-s/2,dl=Math.hypot(dx,dy),mr=s/2-9;return dl>mr?[s/2+dx/dl*mr,s/2+dy/dl*mr]:[x,y];};
  if(m.pt){const [x,y]=clampP(...P(m.pt.x,m.pt.y));g.save();g.translate(x,y);g.scale(1.6,1.6);chaseIcon(g,'chaseP',{ang:m.pt.a});g.restore();}
  if(m.q){const [x,y]=clampP(...P(m.q.x,m.q.y));g.save();g.translate(x,y);g.scale(1.5,1.5);chaseIcon(g,'chaseQ',{a:m.q.a*(.75+.25*Math.sin(G.t*5))});g.restore();}}catch(e){}};}
{const _bl34=buildMapLegend;buildMapLegend=function(){const L=$('#mapLeg');const had=L&&L.dataset.ok;_bl34();try{if(!L||had)return;const box=L.querySelector('.legi');if(!box)return;
  const s=document.createElement('span'),c=document.createElement('canvas');c.width=c.height=28*DPR;c.style.width=c.style.height='18px';const g=c.getContext('2d');g.scale(DPR,DPR);g.translate(14,14);chaseIcon(g,'chaseP',{ang:0});s.appendChild(c);s.appendChild(document.createTextNode('патруль'));box.appendChild(s);}catch(e){}};}
// стрелка у края экрана к событию — оранжевая, со знаком «?» и расстоянием; курс игрока не меняется
{const _ws34=w58Screen;w58Screen=function(t){_ws34(t);try{if(!CHS||G.state!=='world')return;const D=CHS.d;if(D.dead)return;ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);edgeArrow(D.x,D.y,'#ffb84d',10,'? · '+fmtAU(Math.hypot(D.x-G.player.x,D.y-G.player.y)));ctx.restore();}catch(e){}};}
// подключение к миру
{const _wu34=worldUpdate;worldUpdate=function(dt){_wu34(dt);try{chaseTick(dt);}catch(e){console.error(e);}};}
{const _ue34=updateEnemies;updateEnemies=function(dt){if(!CHS||!CHS.hunters.length||!G.world)return _ue34(dt);const H_=G.enemies.filter(e=>e.hunt&&e.alive);if(!H_.length)return _ue34(dt);
  G.enemies=G.enemies.filter(e=>!(e.hunt&&e.alive));try{_ue34(dt);}finally{const rest=G.enemies;G.enemies=rest.concat(H_.filter(e=>!rest.includes(e)));}chaseHunterAI(dt);};}
// пока патруль занят двойником, автонаведение его не выбирает: игрок решает сам, вмешиваться ли
{const _ne34=nearestEnemy;nearestEnemy=function(x,y,R,ig){if(!CHS)return _ne34(x,y,R,ig);const H_=CHS.hunters.filter(e=>e.alive&&e.hunt&&!e.n74);for(const e of H_)e.n74=1;try{return _ne34(x,y,R,ig);}finally{for(const e of H_)delete e.n74;}};}
// раненый охотник переключается на игрока
{const _h34=hurt;hurt=function(e,dmg,src){if(e&&e.hunt&&CHS){e.hunt=false;}return _h34(e,dmg,src);};}
{const _en34=enterNode;enterNode=function(){if(CHS)chaseEnd(false);return _en34.apply(this,arguments);};}
{const _tm34=toMenu;toMenu=function(){if(CHS)chaseEnd(false);return _tm34.apply(this,arguments);};}
{const _mg34=migrateSave;migrateSave=function(S){S=_mg34(S);if(!S||typeof S!=='object')return S;const C=S.chase&&typeof S.chase==='object'?S.chase:{};
  const num=(v,lo,hi,df)=>Number.isFinite(+v)?Math.max(lo,Math.min(hi,+v)):df;S.chase={seen:Math.round(num(C.seen,0,9999,0)),lost:Math.round(num(C.lost,0,9999,0)),wt:num(C.wt,0,1e9,0),last:num(C.last,-1e9,1e9,-1e9),ck:num(C.ck,0,600,0)};return S;};}
{const _rj34=renderJournals;renderJournals=function(el,mapBtn){_rj34(el,mapBtn);try{const cs=G.save&&G.save.chase;if(!cs||!cs.seen)return;
  el.insertAdjacentHTML('beforeend',`<div class="jsec">БЕЗ ПОЗЫВНОГО <small>${cs.seen}</small></div><div class="jr"><h4>ДВОЙНИК · КУРС НА РАЗЛОМ</h4><p>Тот же корпус, другой номер. Он не летел на задание — он летел к краю.</p></div>`);}catch(e){}};}
// разработка: запуск события сразу
window.chaseDev=()=>{if(CHS)chaseEnd(false);return chaseStart(true);};

