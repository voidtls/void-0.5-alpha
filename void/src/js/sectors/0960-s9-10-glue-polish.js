// ===== 0.9.5: связка — тик, рисунок, хуки миссии и мира =====
wavesPlan95();
function t95Init(M,X){G.mark95=null;G.slow95=null;G.slowP95=0;G.fq95=null;G.ol95=0;G.wtg95=[];if(!X)return;Object.assign(X,{tlog95:X.tlog95||{},tg95:[],wv95:[],gl95:[],loot95:[],ink95:[],tongue95:[],strip95:[]});
  if(G.mode==='endless'||!M||!M.gen||(X.sec!==8&&X.sec!==9))return;lv95Init(M,X);}
function t95Tick(dt){const X=G.x90;if(!X||!on95())return;
  tgTick95(dt);wvTick95(dt);markTick95(dt);ebTick95(dt);fqTick95();glTick95(dt);inkTick95(dt);boomTick95(dt);tq95Tick(dt);if(X.sec===9)tongueBuild95();
  lv95Tick(X,dt);
  for(const e of G.enemies)if(e.alive&&e.weak95>0&&!S90T.has(e.type))e.weak95-=dt;
  // лужи: пузыри и след корабля
  if(X.pud.length&&SET.fx){const p=G.player;for(const q of X.pud){if(vR3()<dt*2)q.bub=(q.bub||[]).concat([{a:vrnd3(0,TAU),d:vrnd3(0,q.r*.8),t:0}]).slice(-6);if(q.bub)for(const b of q.bub)b.t+=dt;}
    if(p&&p.dashT<=0&&Math.hypot(p.x-p.px,p.y-p.py)>.5&&inPud90(p.x,p.y)&&vR3()<.5)part(p.x,p.y,-(p.x-p.px)*10,-(p.y-p.py)*10,.6,'#5a0a16',3);}}
function under95(t){const X=G.x90;if(!X||!on95())return;lvUnder95(X,t);
  if(X.estr95)for(const s of X.estr95){const a=s.tele>0?.4:Math.min(1,s.t*2);ctx.globalAlpha=a;ctx.lineCap='round';ctx.strokeStyle='rgba(3,6,7,.92)';ctx.lineWidth=s.w;ctx.beginPath();ctx.moveTo(s.x1,s.y1);ctx.lineTo(s.x2,s.y2);ctx.stroke();ctx.strokeStyle=rgba90(C90.sh,.7);ctx.lineWidth=1.5;ctx.setLineDash([6,6]);ctx.lineDashOffset=-t*20;ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;ctx.lineCap='butt';ctx.globalAlpha=1;}
  if(X.tongue95)for(const s of X.tongue95)tongueDraw95(s,t);
  if(X.ink95)for(const m of X.ink95)inkDraw95(m,t);
  wvDraw95(t);}
function draw95(t){const X=G.x90;if(!X||!on95())return;lvDraw95(X,t);signDraw95();tgDraw95(t);enemyOver95(t);glDraw95();markPlayerDraw95(t);ob96Draw(t);fin96Draw(t);}
function top95(t){const X=G.x90;if(!X||!on95())return;lvTop95(X,t);edgeArrows95(t);eliteBar95(t);}
function drift95(p,dt){slowP95(p,dt);if(G.world){boost95(p,dt);return;}const X=G.x90;if(!X||!on95())return;tun95(p,X);pushOut95(p,0);p.safe95={x:p.x,y:p.y};}
// сквозь строку-стену и колонну не проскочить ни рывком, ни толчком: откат на безопасную сторону
function tun95(p,X){const s=p.safe95;if(!s||!X.pil95||Math.hypot(p.x-s.x,p.y-s.y)>140)return;
  for(const w of X.walls95){if(!segInter(s.x,s.y,p.x,p.y,w.x1,w.y1,w.x2,w.y2))continue;const L=Math.hypot(w.x2-w.x1,w.y2-w.y1)||1,nx=-(w.y2-w.y1)/L,ny=(w.x2-w.x1)/L,side=Math.sign((s.x-w.x1)*nx+(s.y-w.y1)*ny)||1,dp=(p.x-w.x1)*nx+(p.y-w.y1)*ny,m=w.w/2+p.r*.85+1;p.x+=nx*(side*m-dp);p.y+=ny*(side*m-dp);const vn=p.vx*nx+p.vy*ny;if(vn*side<0){p.vx-=vn*nx;p.vy-=vn*ny;}}
  for(const q of X.pil95){if(!q.alive)continue;if(Math.hypot(s.x-q.x,s.y-q.y)<q.r)continue;if(segDist(s.x,s.y,p.x,p.y,q.x,q.y)<q.r*.9&&Math.hypot(p.x-q.x,p.y-q.y)<q.r+p.r){const a=Math.atan2(s.y-q.y,s.x-q.x),m=q.r+p.r*.85+1;p.x=q.x+Math.cos(a)*m;p.y=q.y+Math.sin(a)*m;}}}
function b95Hit(b){if(shoot95(b))return true;if(guardHit95(b))return true;const X=G.x90;if(!X||!on95())return false;if(pilBullet95(b,true))return true;return false;}
function pulse95(p,R){scribeErase95(p,R);const X=G.x90;
  for(const e of G.enemies){if(!e.alive)continue;const d=Math.hypot(e.x-p.x,e.y-p.y);if(e.type==='pass90'&&d<R*2.2){e.pull95=3;floater(e.x,e.y-24,'КО МНЕ',C90.pil);}
    if(e.type==='hunt95'&&d<R+e.r&&e.pack95&&e.pack95.st==='aim'){e.pack95.st='rest';e.pack95.t=0;floater(e.x,e.y-20,'СТАЯ СБИТА',C95.hunt);}}
  for(const L of [X&&inMission()?X.ink95:G.wink95]){if(!L)continue;for(const m of L)if(Math.hypot(m.x-p.x,m.y-p.y)<R){m.t=0;glyph95(m.x,m.y,3,C90.sh);}}}
// --- оверлеи врагов: ✦ уязвимое окно, ⬡ неуязвимость, треугольник стаи, маршрут Смотрителя, счётчик Фагоцита ---
function enemyOver95(t){const p=G.player;
  for(const e of G.enemies){if(!e.alive||e.spawnT>0)continue;if(G.world&&!inView(e.x,e.y,60))continue;
    if((e.weak95>0||e.inv95>0)&&e.type!=='eye95'){ctx.save();ctx.translate(e.x,e.y-(e.hz95||0));markDraw95(e,t);ctx.restore();}
    if(e.type==='hunt95'&&e.lead95&&e.pack95){const P=e.pack95,live=P.mem.filter(m=>m.alive&&m.spawnT<=0);if(live.length>=2&&(P.st==='tri'||P.st==='aim')){const k=P.st==='aim'?clamp(P.t/P.T,0,1):0;ctx.strokeStyle=rgba90(P.st==='aim'?C95.dash:C95.hunt,P.st==='aim'?.5+.5*k:.25);ctx.lineWidth=P.st==='aim'?1.5+2.5*k:1;ctx.setLineDash(P.st==='aim'?[]:[4,8]);
        ctx.beginPath();for(let i=0;i<live.length;i++){const a=live[i],b=live[(i+1)%live.length];const u=P.st==='aim'?k:1;ctx.moveTo(a.x,a.y);ctx.lineTo(a.x+(b.x-a.x)*u,a.y+(b.y-a.y)*u);}ctx.stroke();ctx.setLineDash([]);
        if(P.st==='aim'){ctx.fillStyle=rgba90(C95.dash,.12*k);ctx.beginPath();ctx.moveTo(live[0].x,live[0].y);for(const m of live)ctx.lineTo(m.x,m.y);ctx.closePath();ctx.fill();for(const m of live){const a=Math.atan2(P.ty-m.y,P.tx-m.x);arrow95(m.x+Math.cos(a)*(m.r+8),m.y+Math.sin(a)*(m.r+8),a,C95.dash,k);}}}}
    if(e.type==='hunt95'&&e.hq95>0)arrow95(e.x+Math.cos(e.ha95)*(e.r+8),e.y+Math.sin(e.ha95)*(e.r+8),e.ha95,C95.dash,1-e.hq95/.6);
    if(e.type==='lost95'&&e.dsh95&&e.dsh95.st==='aim')arrow95(e.x+Math.cos(e.dsh95.a)*24,e.y+Math.sin(e.dsh95.a)*24,e.dsh95.a,C95.dash,1-e.dsh95.t/.45);
    if(e.type==='lost95'&&e.pls95){const k=1-e.pls95.t/.6;ctx.strokeStyle=rgba90(C95.lost,.4+.5*k);ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,170-150*k,0,TAU);ctx.stroke();}
    if(e.type==='lost95'&&e.chg95){const k=1-e.chg95.t/1.2;ctx.strokeStyle=rgba90('#ffffff',.5+.5*k);ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,22,-Math.PI/2,-Math.PI/2+TAU*k);ctx.stroke();ctx.setLineDash([6,6]);ctx.strokeStyle=rgba90('#ffffff',.35*k);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+Math.cos(e.chg95.a)*700,e.y+Math.sin(e.chg95.a)*700);ctx.stroke();ctx.setLineDash([]);}
    if(e.type==='keeper90'&&e.st==='patrol'&&e.rt95&&!G.world){ctx.strokeStyle=rgba90('#ffe9b0',.16);ctx.setLineDash([3,9]);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(e.rt95[0].x,e.rt95[0].y);for(let i=1;i<=3;i++){const q=e.rt95[i%3];ctx.lineTo(q.x,q.y);}ctx.stroke();ctx.setLineDash([]);for(const q of e.rt95){ctx.fillStyle=rgba90('#ffe9b0',.25);ctx.fillRect(q.x-2,q.y-2,4,4);}}
    if(e.type==='keeper90'&&e.fa!==undefined){ctx.strokeStyle=rgba90('#ffe9b0',.45);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(e.x,e.y,e.r+9,e.fa+Math.PI-1.2,e.fa+Math.PI+1.2);ctx.stroke();}
    if(e.type==='phago90'&&(e.fed||0)>0)worldLabel(e.x,e.y-e.r-12,(e.fed||0)+'/10',mix90('#ffd36b','#ff4f6e',(e.fed||0)/10));
    if(e.type==='witness100'&&!e.arrived){const bw=34,k=clamp(e.hp/e.maxHp,0,1);ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(e.x-bw/2,e.y-e.r-24,bw,4);ctx.fillStyle='#ffffff';ctx.fillRect(e.x-bw/2,e.y-e.r-24,bw*k,4);
      const a=e.ex>W/2?0:Math.PI;arrow95(e.x+Math.cos(a)*(e.r+16),e.y,a,'#ffffff',.6+.4*Math.sin(t*4));if(e.lead95>0){ctx.strokeStyle=rgba90('#ffffff',.35*e.lead95);ctx.setLineDash([3,5]);ctx.beginPath();ctx.arc(e.x,e.y,120,0,TAU);ctx.stroke();ctx.setLineDash([]);}}
    if(e.type==='spasm95'&&e.att95){ctx.strokeStyle=rgba90(C95.spasm,.45);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(e.x,e.y,e.r+10,(e.fa95||0)+Math.PI-.9,(e.fa95||0)+Math.PI+.9);ctx.stroke();}
    if(e.type==='embryo90'&&e.hatch>0&&e.hatch<5)worldLabel(e.x,e.y-e.r-14,fmt85(e.hatch),'#ff9fb0');}
  // импульсы по лучам нейросети
  const N=nets90();if(N&&N.length)for(const n of N){if(n.chg95&&n.chg95.alive){const s=n.chg95,k=clamp(1-n.impT/.5,0,1);glow(s.x,s.y,30+20*k,'#ffe47a',.5*k);}
    if(n.imp)for(const f of n.imp.front){const u=clamp(f.u,0,1),x=f.from.x+(f.to.x-f.from.x)*u,y=f.from.y+(f.to.y-f.from.y)*u;glow(x,y,26,'#ffe47a',.9);ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();ctx.strokeStyle=rgba90('#fff6c4',.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(f.from.x,f.from.y);ctx.lineTo(x,y);ctx.stroke();}}}
function arrow95(x,y,a,col,k){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=.5+.5*clamp(k,0,1);ctx.fillStyle=col;ctx.strokeStyle='#04060c';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(10+6*k,0);ctx.lineTo(-4,-7);ctx.lineTo(0,0);ctx.lineTo(-4,7);ctx.closePath();ctx.stroke();ctx.fill();ctx.restore();}
// --- рисунок новых врагов ---
function drawE95(e,t,icon,col,face,alpha,P){const r=e.r;if(drawBoss95(e,t,icon,col,face,alpha))return true;
  const hz=icon?0:(e.hz95||0);if(hz>0){ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(0,0,r*1.1,r*.5,0,0,TAU);ctx.fill();ctx.translate(0,-hz);ctx.fillStyle='#0a0f1c';}
  const sq=!icon&&e.tl95>0?.82:1;
  switch(e.type){
    case 'hunt95':{ctx.scale(sq,2-sq);ctx.beginPath();for(let i=0;i<=16;i++){const a=i/16*TAU,rr=r*(1+.1*Math.sin(a*4+t*4+e.seed));if(i)ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);else ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fillStyle='#1e1418';ctx.fill();ctx.stroke();
      ctx.fillStyle=rgba90('#ff9fb0',.75);for(let i=0;i<3;i++){const a=i*2.1+e.seed+t*.6;ctx.beginPath();ctx.arc(Math.cos(a)*r*.35,Math.sin(a)*r*.35,r*.24,0,TAU);ctx.fill();}
      if(e.lead95||icon){ctx.strokeStyle='#ffffff';ctx.lineWidth=1.5;ctx.beginPath();for(let i=-1;i<=1;i++){ctx.moveTo(i*r*.35-3,-r-1);ctx.lineTo(i*r*.35,-r-8-(i?0:3));ctx.lineTo(i*r*.35+3,-r-1);}ctx.stroke();}break;}
    case 'spasm95':{const pu=icon?.5:e.pul95||0;ctx.rotate(icon?0:(e.fa95||0));ctx.scale(1+.2*pu,1-.12*pu);ctx.beginPath();for(let i=0;i<=20;i++){const a=i/20*TAU,rr=r*(1+.18*Math.sin(a*5+t*6));if(i)ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);else ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fillStyle='#2a080e';ctx.fill();ctx.stroke();
      ctx.strokeStyle=rgba90('#ff8a9a',.6);ctx.lineWidth=2;for(let i=0;i<4;i++){const a=i/4*TAU+t;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.3,Math.sin(a)*r*.3);ctx.lineTo(Math.cos(a+.6)*r*.85,Math.sin(a+.6)*r*.85);ctx.stroke();}
      if(pu>0&&!icon){ctx.strokeStyle=rgba90('#ffffff',pu);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r+6,0,TAU);ctx.stroke();}break;}
    case 'cell95':{const inf=!icon&&e.inf95!==undefined;ctx.fillStyle=inf&&Math.sin(t*40)>0?'#ffffff':col;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.strokeStyle='#04060c';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle=rgba90('#5a0a16',.7);ctx.beginPath();ctx.arc(0,0,r*.45,0,TAU);ctx.fill();
      ctx.fillStyle=rgba90('#ffffff',.5);ctx.beginPath();ctx.arc(-r*.35,-r*.35,r*.22,0,TAU);ctx.fill();break;}
    case 'guard95':{ctx.rotate(icon?0:(e.fa95||0));poly(6,r,0);ctx.fillStyle='#1a1408';ctx.fill();ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,r*.3,0,TAU);ctx.fill();
      const br=!icon&&e.mb95>0;ctx.strokeStyle=br?'#6b5a3a':e.shieldFlash>0?'#ffffff':C95.guard;ctx.lineWidth=br?2:6;if(br)ctx.setLineDash([3,5]);ctx.beginPath();ctx.arc(0,0,r+8,-Math.PI/3,Math.PI/3);ctx.stroke();ctx.setLineDash([]);ctx.lineWidth=1;ctx.strokeStyle=rgba90('#ffffff',.5);ctx.beginPath();ctx.arc(0,0,r+12,-Math.PI/3,Math.PI/3);ctx.stroke();ctx.lineWidth=2;break;}
    case 'blot95':{ctx.fillStyle=C95.ink;ctx.beginPath();for(let i=0;i<=14;i++){const a=i/14*TAU,rr=r*(1+.22*Math.sin(a*3+e.seed)+.1*Math.sin(a*7+t*3));if(i)ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);else ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.strokeStyle=col;ctx.stroke();
      ctx.fillStyle=col;for(let i=0;i<2;i++){ctx.beginPath();ctx.arc((i?1:-1)*r*.3,-r*.15,2.2,0,TAU);ctx.fill();}if(!icon&&e.bs95==='air'){ctx.strokeStyle='#ffffff';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,r+4,0,TAU);ctx.stroke();}break;}
    case 'scribe95':{ctx.rotate(icon?-Math.PI/2:Math.atan2(P.y-e.y,P.x-e.x));ctx.beginPath();ctx.moveTo(r*1.2,0);ctx.lineTo(-r*.4,-r*.55);ctx.lineTo(-r*.9,0);ctx.lineTo(-r*.4,r*.55);ctx.closePath();ctx.fillStyle='#0c1814';ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(r*1.2,0);ctx.lineTo(-r*.6,0);ctx.stroke();
      if(!icon){ctx.font='700 9px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillStyle=rgba90(col,.7);for(let i=0;i<3;i++){const a=t*2+i*2.1;ctx.fillText(GLYPH95[(i*11+Math.floor(t*3))%GLYPH95.length],Math.cos(a)*(r+10),Math.sin(a)*(r+10)+3);}ctx.textAlign='left';}break;}
    case 'ebb95':{ctx.rotate(icon?0:Math.atan2(P.y-e.y,P.x-e.x));ctx.beginPath();ctx.arc(0,0,r,-.9*Math.PI,.9*Math.PI);ctx.quadraticCurveTo(-r*.2,0,Math.cos(-.9*Math.PI)*r,Math.sin(-.9*Math.PI)*r);ctx.fillStyle='#04100c';ctx.fill();ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.arc(r*.4,0,3,0,TAU);ctx.fill();
      if(!icon&&SET.fx&&Math.random()<.2)part(e.x,e.y,rnd(-20,20),40,.5,C95.ebb,1.6);break;}
    case 'lost95':{ctx.rotate(icon?-Math.PI/2:(e.face||face));ctx.globalAlpha=alpha*.92;drawShip(e.skin95&&SKINS[e.skin95]?e.skin95:'base',t,Math.hypot(e.vx,e.vy),{});ctx.globalAlpha=alpha;ctx.strokeStyle=e.flash>0?'#ffffff':'#ff4f6e';ctx.lineWidth=1.5;ctx.setLineDash([5,4]);ctx.beginPath();ctx.arc(0,0,24,0,TAU);ctx.stroke();ctx.setLineDash([]);
      if(!icon&&e.inv95>0){ctx.globalAlpha=alpha*.5;ctx.strokeStyle='#8fe9ff';ctx.beginPath();ctx.arc(0,0,20,0,TAU);ctx.stroke();ctx.globalAlpha=alpha;}break;}
    case 'gclot95':{ctx.fillStyle='#3a0a12';ctx.beginPath();for(let i=0;i<=24;i++){const a=i/24*TAU,rr=r*(1+.12*Math.sin(a*3+t*2+e.seed)+.08*Math.sin(a*7-t*3));if(i)ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);else ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.lineWidth=3;ctx.stroke();
      ctx.strokeStyle=rgba90('#ff6f86',.5);ctx.lineWidth=2;for(let i=0;i<5;i++){const a=i*1.26+e.seed;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(Math.cos(a+.5)*r*.5,Math.sin(a+.5)*r*.5,Math.cos(a)*r*.9,Math.sin(a)*r*.9);ctx.stroke();}
      if(!icon){const bw=r*2.6,k=clamp(e.hp/e.maxHp,0,1);ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(-bw/2,r+10,bw,5);ctx.fillStyle=C90.red;ctx.fillRect(-bw/2,r+10,bw*k,5);}break;}
    default:return false;}
  return true;}

// ===== 0.9.6 · доводка «до идеала» =====
// --- Сердце: кульминация фазы 4 — три круга ключей (на Лёгкой два), каждый со своим рисунком ---
// доля пула, ниже которой Сердце не опустится, пока не сделано j запусков
function heartQuota96(b,j){const n=b.lN96||2;return .15*Math.max(0,1-j/n);}
// следующий круг ключей после очередного запуска: обратный порядок, затем «плывущие» ключи
function heartSeq96(b){const n=b.lN96||2,j=b.launches;if(j>=n||b.st!=='fight')return;
  for(const k of b.keys)k.lit90=0;b.keyI=0;
  if(j===1){b.keys.sort((a,c)=>c.ki-a.ki);b.rot96=0;banner('КЛЮЧИ НАОБОРОТ','СЕРДЦЕ СОПРОТИВЛЯЕТСЯ · ОБРАТНЫЙ ПОРЯДОК');radioLine('КОВЧЕГ',C90.ark,'Ритм идёт вспять. Ключи — в обратном порядке.',.2);}
  else if(j>=2){b.keys.sort((a,c)=>a.ki-c.ki);b.rot96=.28*(rk90()>=2?1.2:1);banner('КЛЮЧИ ПЛЫВУТ','ПОСЛЕДНИЙ КРУГ · ЛОВИТЕ В ТАКТ');radioLine('КОВЧЕГ',C90.ark,'Последний круг. Ключи уходят — догоняйте.',.2);}
  snd95('phase95');trauma90(.2);}
// положение ключей: по кругу 150·k, с поворотом в последнем круге
function heartKeyPos96(b){for(const q of b.keys){if(!q.alive)continue;const a=-Math.PI/2+q.ki*TAU/b.keyN+(b.keyA96||0);q.x=b.cx+Math.cos(a)*150*b.k;q.y=b.cy+Math.sin(a)*150*b.k;}}
// последний запуск: Сердце гаснет за 4 секунды при любом уроне — финал не зависит от сборки
function heartFinTick96(b,dt){if(!(b.fin96&&b.launch>0)||b.st!=='fight')return;if(!(b.fin96H>1)){b.fin96H=b.hp;b.fin96L=b.launch;}
  const f=clamp((b.launch-.4)/Math.max(.1,b.fin96L-.4),0,1);b.hp=Math.max(1,1+(b.fin96H-1)*f);b.dmgT=G.t;b.flash=.05;
  if(SET.fx&&vR3()<.5){const a=vrnd3(0,TAU),v=vrnd3(80,240);part(b.cx+Math.cos(a)*b.r*.6,b.cy+Math.sin(a)*b.r*.6,Math.cos(a)*v,Math.sin(a)*v,vrnd3(.4,.9),vR3()<.5?'#ffffff':C90.ark,vrnd3(2,3.5));}
  if(f<=0){b.hp=1;sb85CheckTh(b);}}
// --- Тревога 0.9.6: облава гасится, а не раскручивается ---
function ob96N(){let n=0;for(const e of G.enemies)if(e.alive&&e.ob96)n++;for(const w of G.warns)if(w.o&&w.o.ob96)n++;return n;}
// --- виньетка сектора: градиент по экрану каждый кадр стоил 4–17 мс на слабом телефоне (программный растр, ЦП ×4);
//     теперь кэш-спрайт цвета (до 2,3 Мп — в точный размер, крупнее — 640 px с растяжением) и прозрачность кадра ---
const SVIG96=new Map();
function secVigSpr96(rgb,w,h){const big=w*h>2.3e6,sw=big?640:w,sh=big?Math.max(1,Math.round(640*h/w)):h,key=rgb+'|'+sw+'x'+sh;let c=SVIG96.get(key);
  if(!c){c=document.createElement('canvas');c.width=sw;c.height=sh;const g=c.getContext('2d'),gr=g.createRadialGradient(sw/2,sh/2,Math.min(sw,sh)*.45,sw/2,sh/2,Math.max(sw,sh)*.72);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba('+rgb+',1)');g.fillStyle=gr;g.fillRect(0,0,sw,sh);
    if(SVIG96.size>=3)SVIG96.delete(SVIG96.keys().next().value);SVIG96.set(key,c);}return c;}
// фагоциты облавы помечены пунктирным кольцом: видно, кого сбить, чтобы стало тише
function ob96Draw(t){const X=G.x90;if(!X||!X.alarmOn)return;let any=false;for(const e of G.enemies){if(!e.alive||!e.ob96||e.spawnT>0)continue;if(!any){any=true;ctx.save();ctx.lineWidth=1.5;ctx.setLineDash([4,5]);ctx.lineDashOffset=-t*18;}
  ctx.strokeStyle=rgba90(C90.red,.55+.25*Math.sin(t*5+e.uid));ctx.beginPath();ctx.arc(e.x,e.y,e.r+9,0,TAU);ctx.stroke();}if(any)ctx.restore();}
// --- Сердце: волна обходит сосуды. Раньше кольцо без проходов шло на каждый удар фаз 1–2, а двойной удар фазы 3
//     ставил проходы двух колец под 90° — увернуться можно было только рывком, а он перезаряжается 1,5–2,4 с.
//     Идеальный «рывковый» бот погибал за 14–20 с. Теперь у каждой волны есть проход, до которого можно долететь:
//     фаза 1 — вдоль всех четырёх сосудов (учимся); фаза 2 — два прохода плывут по 12°/с (следуем);
//     фаза 3 — два прохода плывут по 15°/с, второй удар сдвинут на 12/16/20° (Лёгкая/Нормальная/Тяжёлая):
//     безопасно там, где проходы совпадают (точность). Направление дрейфа меняется раз в 8 с, стрелки у сердца ---
const HGW96={1:[54,44,38],2:[48,40,34],3:[46,40,34]},HGO96=[12,16,20];
function heartOff96(){return HGO96[Math.max(0,Math.min(2,rk90()))]*Math.PI/180;}
function heartRate96(b){return (b.phase===2?12:15)*Math.PI/180;}
function heartGaps(b,ahead){ahead=ahead||0;const ph=b.phase>=1&&b.phase<=3?b.phase:1,rk=Math.max(0,Math.min(2,rk90())),w=HGW96[ph][rk]*Math.PI/180;
  if(ph===1||!b.ves||!b.ves.length)return (b.ves||[]).map(v=>({a:v.a,w}));
  const th=(b.gth96!==undefined?b.gth96:b.ves[0].a)+(b.gdir96||1)*heartRate96(b)*(b.btN||.67)*ahead;return [{a:th,w},{a:th+Math.PI,w}];}
function heartDrift96(b,dt){if(b.gth96===undefined){b.gth96=b.ves[0].a;b.gdir96=1;b.gfl96=8;}b.gth96+=b.gdir96*heartRate96(b)*dt;b.gfl96-=dt;if(b.gfl96<=0){b.gfl96=8;b.gdir96*=-1;}}
// --- враг «за краем» (держатель дистанции отступал вдоль стены или шлюза за кромку арены): за ним нельзя
//     прицелиться, и миссия вставала минутами. Кто однажды вошёл в арену, из неё больше не выходит;
//     кто застрял снаружи сразу после появления — через 2,5 с возвращается внутрь с мерцанием.
//     Не трогаем тех, кто уходит за край по замыслу: беглец с грузом, Последний из рода, линкор, паломники,
//     пассажиры и свидетели, корабли-эхо, ледяная копия, снаряды и мины, классические боссы и части боссов ---
const OUT96=new Set(['witness100','pass90','lastkind','linkor','pilgrim','echoship','echoguard','icecopy','crate','shell','mine','hull','decoy','convoybox','rangedummy','boss','jam']);
function rescue96(dt){if(G.sb&&G.sb.alive)return;for(const e of G.enemies){if(!e.alive||e.spawnT>0||e.retreat||e.flee||e.leave90||e.tailT>0||e.dummy||e.sbk||e.host85||e.host74||G.latch74===e||STATIC.has(e.type)||EDEF[e.type].passive||EDEF[e.type].sbp||OUT96.has(e.type))continue;
  const r=e.r||12,inside=e.x>=r&&e.x<=W-r&&e.y>=r&&e.y<=H-r;if(inside){e.in96=1;e.off96=0;continue;}
  if(e.in96){const x=clamp(e.x,r,W-r),y=clamp(e.y,r,H-r);if(x!==e.x)e.vx=0;if(y!==e.y)e.vy=0;e.x=x;e.y=y;continue;}
  const out=e.x<-10||e.x>W+10||e.y<-10||e.y>H+10;if(!out){e.off96=0;continue;}e.off96=(e.off96||0)+dt;
  if(e.off96>2.5){e.off96=0;e.in96=1;e.x=clamp(e.x,50,W-50);e.y=clamp(e.y,50,H-50);e.vx=e.vy=0;e.spawnT=.4;if(typeof pushOut95==='function')pushOut95(e,4);if(typeof lockPush90==='function')lockPush90(e);}}}
// --- финальная зачистка в отсеках со шлюзами: волны кончились, врагов ≤ 5 — шлюзы открываются насовсем,
//     а последних врагов видно сквозь стены: никто не прячется за закрытой дверью минутами ---
function fin96Tick(X){if(X.fin96||!X.locks||!X.locks.length||(G.sb&&G.sb.alive))return;if(G.waveIdx<G.waves.length||(G.spawnQ&&G.spawnQ.length))return;
  let n=0;for(const e of G.enemies)if(e.alive&&!EDEF[e.type].passive&&!STATIC.has(e.type))n++;if(n>5)return;X.fin96=1;const p=G.player;if(p&&n>0){floater(p.x,p.y-60,'ШЛЮЗЫ ОТКРЫТЫ · ДОБЕЙТЕ ОСТАВШИХСЯ',C90.warm);snd90('locko');}}
function fin96Draw(t){const X=G.x90;if(!X||!X.fin96)return;let any=false;for(const e of G.enemies){if(!e.alive||EDEF[e.type].passive||STATIC.has(e.type)||e.spawnT>0)continue;if(!any){any=true;ctx.save();ctx.lineWidth=1.5;ctx.setLineDash([2,6]);ctx.lineDashOffset=t*14;}
  ctx.strokeStyle=rgba90('#ffffff',.35+.2*Math.sin(t*3+e.uid));ctx.beginPath();ctx.arc(e.x,e.y,e.r+14,0,TAU);ctx.stroke();}if(any)ctx.restore();}
// --- ядро ганглия (39–41) — снова векторами: поворот спрайта 552×552 стоил 1,5–1,7 мс на слой на слабом телефоне
//     (программный растр, ЦП ×4), те же пути векторами — 0,24–0,48 мс; рисунок тот же, поворот и пульс — трансформом ---
function coreVec96(q,layer){const r=q.r;ctx.lineCap='butt';
  if(layer===0){ctx.fillStyle='#2a0810';ctx.strokeStyle=C90.ark;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.stroke();
    ctx.strokeStyle=rgba90(C90.red,.6);ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<6;i++){const a=i/6*TAU;ctx.moveTo(Math.cos(a)*r*.3,Math.sin(a)*r*.3);ctx.quadraticCurveTo(Math.cos(a+.4)*r*.7,Math.sin(a+.4)*r*.7,Math.cos(a+.2)*r*.95,Math.sin(a+.2)*r*.95);}ctx.stroke();}
  else{ctx.strokeStyle=rgba90('#ffe47a',.6);ctx.lineWidth=1.5;ctx.beginPath();for(let i=0;i<7;i++){const a=i/7*TAU;ctx.moveTo(Math.cos(a)*r*.22,Math.sin(a)*r*.22);ctx.quadraticCurveTo(Math.cos(a+.5)*r*.5,Math.sin(a+.5)*r*.5,Math.cos(a+.25)*r*.92,Math.sin(a+.25)*r*.92);}ctx.stroke();}}
// --- лимит видов IX–X — в момент появления: раньше проверка ждала первого хода ИИ (после анимации появления),
//     и на полсекунды на арене бывало на 2–3 Спазма больше лимита, а появившийся враг на глазах менял вид ---
function capEarly96(){for(const e of G.enemies)if(e.alive&&!e.cap90&&S90T.has(e.type))cap90(e);}

