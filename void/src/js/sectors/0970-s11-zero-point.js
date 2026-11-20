// ===== 0.9.7: сектор XI «Нулевая точка» — миссии 47 «Созвездие», 48 «Пуск», 49 «Миг»; сектор XII — заготовка комнаты босса (50) =====
// Враги сектора — лучшие связки старых врагов (I–X). Каждая миссия — своя задача, свой свет, свой звук.
// лимиты одновременных врагов одного типа — только для сектора XI (CAP90 общий и не трогается)
const CAP110={signaller:1,labrat:1,singer:1,commander:1,inverse:1,echo80:1,hunter:2,guard:1,shielder:1,fireship:1,stamp:2,autopilot:2,lancer:2,frost:2,miner:2,keeper90:2,clot90:2,eraser100:1,hollow100:3,echo100:3,fixer100:1,lost95:1,loop:3,unborn:5,gunner:5,scout:6,rammer:3};
const C110={zero:'#ff9fe0',rose:'#ffd0ee',dim:'#6a2e58',deep:'#120812',white:'#fff4fb',gold:'#ffe9b0',ice:'#bfe8ff',blue:'#9fd8ff',neg:'#e8fff8',ink:'#1a0a16'};
// --- мир: XI сужается до 47–49, XII — одна комната (50) за воротами. Вызывается из генерации мира (до объявления констант модуля — без C110) ---
function world110Setup(){const N=WORLD.nodes,S_=WORLD.sectors;if(!S_[10]||N.length<49)return;if(N.length===49)N.push({m:50,x:38500,y:16600,boss:true,sec:11});
  const xi=S_[10];xi.box=[37000,8000,40000,13500];xi.bx=37430;xi.by=Math.max(xi.box[1]+600,Math.min(xi.box[3]-600,xi.by));xi.lv=[47,49];
  const P={47:[37800,8800],48:[39500,10800],49:[37900,12700],50:[38500,16600]};for(const m in P){const n=N[m-1];if(!n)continue;n.x=P[m][0];n.y=P[m][1];n.sec=+m===50?11:10;}
  S_.push({name:'???',box:[37000,13500,40000,19000],col:'#ff9fe0',bx:37430,by:14300,lv:[50,50],xii:1});
  WORLD.fields2=WORLD.fields2.filter(f=>!(f.x>=37000&&f.y>=8000&&f.y<=13500&&N.slice(46,49).some(n=>Math.hypot(n.x-f.x,n.y-f.y)<700)));
  WORLD.zero110={x:38500,y:13500,x0:37000,x1:40000};}
function zeroOpen110(){return (ALPHA_OPEN&&window.__alpha!==false)||!!(G.save&&G.save.story&&G.save.story.zero49)||!!(G.save&&G.save.medals&&G.save.medals[49]&&G.save.medals[49].clear)||!!(G.dev&&G.dev.on&&G.devZero110);}
function inXII110(x,y){const b=WORLD.sectors[11];return !!b&&x>=b.box[0]&&x<=b.box[2]&&y>=b.box[1]&&y<=b.box[3];}
// ворота на границе XI/XII: до победы в «Миге» закрыты в обе стороны (с любой стороны — откат на прежнюю позицию)
function gate110(p,S){const Z=WORLD.zero110;if(!Z||!p||zeroOpen110())return;const inN=inXII110(p.x,p.y),inP=inXII110(p.px,p.py);
  if(inN&&!inP){p.x=p.px;p.y=p.py;p.vx*=-.5;p.vy*=-.5;p.dashT=0;hintOnce('gate110','ВОРОТА НУЛЕВОЙ ТОЧКИ · ПРОЙДИТЕ «МИГ»','#ff9fe0');}}
function zeroJumpDeny110(q){if(!q||zeroOpen110())return false;return inXII110(q.x,q.y);}
function gate110Draw(t){const Z=WORLD.zero110;if(!Z)return;const open=zeroOpen110(),col=open?'#ffd0ee':'#ff9fe0';
  if(inView(Z.x,Z.y,1700)){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=1.5;const x0=Math.max(Z.x0,CX-40),x1=Math.min(Z.x1,CX+W+40);
    for(let x=x0-(x0%34);x<x1;x+=34){const k=open?.08:.15+.3*Math.abs(Math.sin(t*2.6+x*.03));ctx.globalAlpha=k;ctx.beginPath();ctx.moveTo(x+rnd(-5,5),Z.y-14);ctx.lineTo(x+rnd(-5,5),Z.y+14);ctx.stroke();}
    ctx.globalAlpha=open?.25:.55;ctx.setLineDash([14,10]);ctx.lineDashOffset=-t*20;ctx.beginPath();ctx.moveTo(Z.x0,Z.y);ctx.lineTo(Z.x1,Z.y);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
  if(inView(Z.x,Z.y,300)){ctx.save();ctx.translate(Z.x,Z.y);glow(0,0,220,col,open?.2:.35);ctx.rotate(t*.12);ctx.strokeStyle=col;ctx.lineWidth=3;
    for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(0,0,120,i/4*TAU,i/4*TAU+(open?1.2:.8));ctx.stroke();}ctx.rotate(-t*.3);ctx.globalAlpha=.5;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,60,0,TAU);ctx.stroke();ctx.restore();
    worldLabel(Z.x,Z.y-150,open?'ВОРОТА ОТКРЫТЫ · СЕКТОР XII':'ВОРОТА НУЛЕВОЙ ТОЧКИ','#ff9fe0');worldLabel(Z.x,Z.y+158,open?'НУЛЕВОЙ МИГ · КНОПКА ЕЩЁ ТЁПЛАЯ':'ПРОЙДИТЕ «МИГ» (49)','#9fb0c4');}}
// --- каркас ---
function x110(){const X=G.x110;return X&&inMission()&&G.mode!=='endless'?X:null;}
function P110(u,v){return H>W?{x:(1-v)*W,y:u*H}:{x:u*W,y:v*H};}
function k110(){return clamp(Math.min(W,H)/760,.75,1.25);}
function mc110(){const m=G.mc;if(!m)return null;if(m.read110===undefined){m.read110=0;m.readBreak110=0;m.puskDrop110=0;m.out110=0;m.allyLost110=0;}return m;}
function t110Init(M,X90){G.x110=null;if(!M||!M.gen||G.mode==='endless'||!inMission())return;if(M.sec!==10&&M.sec!==11)return;const m=G.m;
  if(X90){X90.estr95=X90.estr95||[];X90.pulseLog95=X90.pulseLog95||[];X90.tongue95=X90.tongue95||[];}
  const X=G.x110={m,sec:M.sec,t:0,hint:{},rel:0,relT:0,vig:0,out:0,spawnAt:null,flashT:0,k:'room'};mc110();
  if(m===47)init47(X);else if(m===48)init48(X);else if(m===49)init49(X);
  const p=G.player;if(p){const q=P110(m===49?.23:.5,.5);p.x=q.x;p.y=q.y;p.px=p.x;p.py=p.y;p.vx=p.vy=0;}
  G.waveHold=999;}
function x110Block(){const X=x110();if(!X)return false;if(X.k==='room')return true;if(X.k==='const')return X.lit<5;if(X.k==='launch')return !X.btn.fired;if(X.k==='blink')return X.band.ph<4||X.band.t<2;return false;}
// --- выпуск волн: волна idx разрешена, когда X.rel>idx; остальное время волны держатся ---
function rel110(X,wave,at){const i=G.waveIdx+ (X.rel>G.waveIdx?X.rel-G.waveIdx:0);if(wave){G.waves[i]=scaleWave(wave.slice());G.waveBase[i]=wave.length;}
  X.rel=i+1;X.relT=0;if(at)X.spawnAt=at;G.gapT=Math.min(G.gapT,.5);}
function hold110(X){G.waveHold=G.waveIdx<X.rel?0:999;if(G.waveIdx<X.rel)G.waveForce=true;}
function aliveN110(){let n=0;for(const e of G.enemies)if(e.alive&&!EDEF[e.type].passive&&!e.ally110)n++;return n+G.warns.length+G.spawnQ.length;}
// появление врагов — строем относительно точки события: ударные с ближнего края, клещи (копейщики, тараны, охотники) — с противоположного,
// стрелки и зигзаги — с боков, поддержка (Связист, Лаборант, Певчий, Командир, Корректор, Отзвук) — с дальнего края, за спинами своих
const PREF110={lancer:'opp',rammer:'opp',hunter:'opp',fireship:'opp',eraser100:'opp',lost95:'opp',keeper90:'side',gunner:'side',stamp:'side',autopilot:'side',hollow100:'side',inverse:'side',commander:'far',signaller:'far',labrat:'far',singer:'far',fixer100:'far',echo80:'far'};
function spawn110(type,o){const X=x110();if(!X||!X.spawnAt||G.bc)return false;const p=G.player,q=X.spawnAt,c=[[q.x,-34,q.x,22],[W+34,q.y,W-22,q.y],[q.x,H+34,q.x,H-22],[-34,q.y,22,q.y]];
  const ds=[q.y,W-q.x,H-q.y,q.x];let order=[0,1,2,3].sort((a,b)=>ds[a]-ds[b]);const pref=PREF110[type]||'near';if(pref==='opp')order=[order[3],order[2],order[1],order[0]];else if(pref==='side'){X.sideN=(X.sideN||0)+1;order=X.sideN%2?[order[1],order[2],order[0],order[3]]:[order[2],order[1],order[3],order[0]];}else if(pref==='far')order=[order[3],order[1],order[2],order[0]];let pick=null;
  for(const s of order){const [x,y,mx,my]=c[s];const u=clamp((s%2?my/H:mx/W)+rnd(-.1,.1),.06,.94);const xx=s%2?x:u*W,yy=s%2?u*H:y,mxx=s%2?mx:u*W,myy=s%2?u*H:my;if(p&&Math.hypot(mxx-p.x,myy-p.y)<240)continue;pick={x:xx,y:yy,mx:mxx,my:myy};break;}
  if(!pick)return false;G.warns.push({x:pick.x,y:pick.y,mx:pick.mx,my:pick.my,type,t:.85+(o&&o.delay||0),o:Object.assign({},o||{},{sp110:1})});return true;}
function t110Tick(X90,dt){const X=x110();if(!X)return;const p=G.player;X.t+=dt;X.relT+=dt;if(X.flashT>0)X.flashT-=dt;
  // общее для сектора: лужи Тромба, зоны и полосы Ластика, память Эхо-призрака
  if(X90.pud.length){for(const q of X90.pud)q.t-=dt;X90.pud=X90.pud.filter(q=>q.t>0);if(p&&p.dashT<=0&&inPud90(p.x,p.y)){p.x=p.px+(p.x-p.px)*.6;p.y=p.py+(p.y-p.py)*.6;if(!X90.hint.pud2){X90.hint.pud2=1;floater(p.x,p.y-30,'ЛУЖА · ВЯЗКО · ИМПУЛЬС РАСТВОРЯЕТ',C90.red);}}}
  for(const z of X90.ez){if(z.tele>0){z.tele-=dt;if(z.tele<=0)snd90('erase');}else z.t-=dt;}X90.ez=X90.ez.filter(z=>z.tele>0||z.t>0);
  if(X90.estr95.length){for(const s of X90.estr95){if(s.tele>0)s.tele-=dt;else s.t-=dt;}X90.estr95=X90.estr95.filter(s=>s.tele>0||s.t>0);}
  if(p&&p.hp>0&&voidDepth100(p.x,p.y,X90)>0){if(!X90.hint.void){X90.hint.void=1;floater(p.x,p.y-40,'СТЁРТО · 6 УРОНА В СЕКУНДУ',C90.sh);}drain90(6*dt);}
  if(p){X90.echoP.push({x:p.x,y:p.y,t:G.t});while(X90.echoP.length&&G.t-X90.echoP[0].t>24)X90.echoP.shift();}
  if(X90.pulseLog95.length&&G.t-X90.pulseLog95[0].t>26)X90.pulseLog95.shift();
  if(X.k==='const')tick47(X,dt);else if(X.k==='launch')tick48(X,dt);else if(X.k==='blink')tick49(X,dt);else tickRoom(X,dt);
  hold110(X);}
function done110(M,X90){const X=G.x110,S=G.save;if(!X||!S||!S.story||G.mode!=='world')return;if(X.m===49&&!S.story.zero49){S.story.zero49=1;setTimeout(()=>{if(G.save)toast('ВОРОТА НУЛЕВОЙ ТОЧКИ ОТКРЫТЫ','СЕКТОР XII · НУЛЕВОЙ МИГ · ОН ЖДЁТ У КНОПКИ');},900);}}
// ======================= 47 «СОЗВЕЗДИЕ» =======================
// Пять погибших пилотов — по порядку созвездия. Прочитать — 3 с рядом; память отвечает теми, кто их убил, и с каждым пилотом злее. Следующий читается, когда память стихает.
const LINES47=[
  ['VØID-002','Линии ровные. Я шёл по прямой, как учили. Прямая кончилась.'],
  ['VØID-011','Холодно. Лёд держит крепче любого тарана. Не стойте.'],
  ['VØID-003','Патруль ходит по кругу. Я тоже ходил. Они не устают.'],
  ['VØID-006','Мины видно. Охотника — нет. Запишите это для следующего.'],
  ['VØID-012','Командир сказал, что мы все вернёмся. Не уточнил, в каком виде.']];
const WAVES47=[['lancer','lancer','scout','scout','scout','scout','scout'],['frost','frost','rammer','rammer','rammer'],['keeper90','keeper90','gunner','gunner','gunner'],['miner','miner','hunter','scout','scout'],['commander','clot90','clot90','lancer','lancer','scout','scout']];
function init47(X){X.k='const';setTimeout(()=>{if(G.x110===X&&inMission())radioLine('ПАМЯТЬ','#ff9fe0','Пять сигналов. Все старше тебя. Читай по порядку — так они легли.',.5);},1500);X.lit=0;X.phase='read';X.cool=0;X.fT=0;X.fSize=0;X.cur=null;X.order=[];
  const D=[[.23,.26,0,.9],[.77,.24,1,-2.2],[.84,.74,2,2.6],[.5,.82,3,-.4],[.17,.68,4,1.7]];
  X.st=D.map(d=>({u:d[0],v:d[1],i:d[2],ang:d[3],id:LINES47[d[2]][0],line:LINES47[d[2]][1],read:0,done:0,x:0,y:0,lit:0}));
  X.r=90;G.waves=WAVES47.map(w=>scaleWave(w.slice()));G.waveBase=WAVES47.map(w=>w.length);G.waveIdx=0;G.spawnQ=[];}
function next47(X){return X.st.find(q=>!q.done)||null;}
function geo47(X){const k=k110();X.r=90*k;for(const s of X.st){const q=P110(s.u,s.v);s.x=q.x;s.y=q.y;}}
function tick47(X,dt){geo47(X);const p=G.player,M=mc110();if(!p)return;for(const s of X.st)if(s.lit<1&&s.done)s.lit=Math.min(1,s.lit+dt*.8);
  if(X.phase==='fight'){X.fT+=dt;const n=aliveN110();if(G.spawnQ.length===0&&G.waveIdx>=X.rel&&(n<=Math.max(1,Math.floor(X.fSize*.3))||X.fT>14)){X.phase='cool';X.cool=2;}}
  else if(X.phase==='cool'){X.cool-=dt;if(X.cool<=0){X.phase='read';if(X.lit<5){floater(p.x,p.y-40,'ПАМЯТЬ СТИХЛА · ЧИТАЙТЕ ДАЛЬШЕ',C110.rose);snd110('calm');}}}
  if(X.phase!=='read'||p.hp<=0){X.cur=null;return;}
  let cur=null;const nx=next47(X);if(nx&&Math.hypot(p.x-nx.x,p.y-nx.y)<X.r)cur=nx;
  if(cur&&SET.fx&&Math.random()<.5){const a=rnd(0,TAU),d=rnd(X.r*.5,X.r);part(cur.x+Math.cos(a)*d,cur.y+Math.sin(a)*d,(p.x-cur.x)*.6,(p.y-cur.y)*.6,.5,C110.rose,1.6);}
  for(const s of X.st){if(s.done)continue;if(s===cur){s.read+=dt;if(!s.snd||G.t-s.snd>.5){s.snd=G.t;snd110('read',s.x);}
      if(s.read>=3){s.done=1;s.read=3;X.lit++;X.order.push(s.i);M.read110++;read47(X,s);}}
    else if(s.read>0){s.read=Math.max(0,s.read-.2*dt);if(s.read===0&&!s.brk){s.brk=1;}if(s.hadCur&&s.read<3){s.hadCur=0;M.readBreak110++;}}
    if(s===cur)s.hadCur=1;}
  X.cur=cur;if(cur&&!X.hint.read){X.hint.read=1;floater(cur.x,cur.y-X.r-18,'ДЕРЖИТЕСЬ В КОЛЬЦЕ 3 С',C110.rose);}
  if(nx&&!cur&&!X.hint.seq&&X.t>3){X.hint.seq=1;floater(nx.x,nx.y-X.r-18,'СЛЕДУЮЩАЯ ЗВЕЗДА · '+nx.id,C110.zero);}}
function read47(X,s){const p=G.player;snd110('readOk',s.x);hs90(.12,1);radioLine(s.id,'#ff9fe0',s.line,.2);floater(s.x,s.y-X.r-26,s.id+' · ПРОЧИТАН',C110.white);
  if(SET.fx)for(let i=0;i<fxN95(14);i++){const a=rnd(0,TAU),v=rnd(30,140);part(s.x,s.y,Math.cos(a)*v,Math.sin(a)*v,rnd(.4,.9),i%3?C110.zero:C110.white,rnd(1.5,3));}
  if(G.shock.length<60)G.shock.push({x:s.x,y:s.y,r:10,R:X.r*1.6,t:0,col:C110.zero,thin:true});
  const w=WAVES47[s.i];X.phase='fight';X.fT=0;X.fSize=Math.round(w.length*enemyMul());rel110(X,w,{x:s.x,y:s.y});
  setTimeout(()=>{if(G.x110===X&&G.state==='play')floater(s.x,s.y-X.r-10,'ПАМЯТЬ ОТВЕЧАЕТ',C90.red);},600);snd110('wake',s.x);
  if(X.lit>=5){setTimeout(()=>{if(G.x110===X&&G.state==='play')banner('СОЗВЕЗДИЕ СОБРАНО','ПОСЛЕДНЯЯ ПАМЯТЬ · ДОБЕЙТЕ');},400);}}
function hull110(i){ctx.beginPath();
  if(i===0){ctx.moveTo(18,0);ctx.lineTo(-8,-12);ctx.lineTo(-4,0);ctx.lineTo(-8,12);}
  else if(i===1){ctx.moveTo(16,0);ctx.lineTo(-6,-16);ctx.lineTo(-10,-4);ctx.lineTo(-10,4);ctx.lineTo(-6,16);}
  else if(i===2){ctx.moveTo(19,0);ctx.lineTo(-11,-12);ctx.lineTo(-5,0);ctx.lineTo(-11,12);}
  else if(i===3){ctx.moveTo(20,0);ctx.lineTo(0,-8);ctx.lineTo(-14,-10);ctx.lineTo(-8,0);ctx.lineTo(-14,10);ctx.lineTo(0,8);}
  else{ctx.moveTo(17,0);ctx.lineTo(-2,-14);ctx.lineTo(-14,-16);ctx.lineTo(-6,0);ctx.lineTo(-14,16);ctx.lineTo(-2,14);}
  ctx.closePath();}
function bg47(X,t){geo47(X);const k=k110();
  // туманность созвездия и пунктир между всеми звёздами, яркие линии — по порядку чтения
  glow(W/2,H/2,Math.max(W,H)*.45,C110.zero,.06);
  ctx.lineWidth=1;ctx.strokeStyle=rgba90(C110.zero,.12);ctx.setLineDash([3,9]);ctx.beginPath();for(let i=0;i<5;i++)for(let j=i+1;j<5;j++){const a=X.st[i],b=X.st[j];if(Math.hypot(a.x-b.x,a.y-b.y)>Math.max(W,H)*.62)continue;ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);}ctx.stroke();ctx.setLineDash([]);
  for(let i=1;i<X.order.length;i++){const a=X.st[X.order[i-1]],b=X.st[X.order[i]],l=Math.min(1,b.lit*1.4);ctx.strokeStyle=rgba90(C110.rose,.55*l);ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(a.x+(b.x-a.x)*l,a.y+(b.y-a.y)*l);ctx.stroke();}
  if(X.lit>=5&&X.order.length>=5){const a=X.st[X.order[4]],b=X.st[X.order[0]];ctx.strokeStyle=rgba90(C110.white,.35+.2*Math.sin(t*3));ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  const nx=next47(X);for(const s of X.st){const act=X.cur===s,isNext=s===nx,ready=X.phase==='read'&&isNext;ctx.save();ctx.translate(s.x,s.y);
    if(isNext){ctx.strokeStyle=rgba90(ready?C110.zero:C110.dim,ready?.55:.3);ctx.lineWidth=1.5;ctx.setLineDash([6,8]);ctx.lineDashOffset=-t*14;ctx.beginPath();ctx.arc(0,0,X.r,0,TAU);ctx.stroke();ctx.setLineDash([]);
      if(ready){ctx.strokeStyle=rgba90(C110.zero,.25+.2*Math.sin(t*3));ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,X.r*(1.15+.08*Math.sin(t*3)),0,TAU);ctx.stroke();}
      if(s.read>0){ctx.strokeStyle=C110.white;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,X.r+5,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,s.read/3));ctx.stroke();}}
    glow(0,0,s.done?56*k:40*k,s.done?C110.rose:C110.zero,s.done?.22+.08*Math.sin(t*2+s.i):.12+(ready?.1*Math.abs(Math.sin(t*2.4)):0));
    // обломки вокруг корпуса (медленно вращаются)
    ctx.strokeStyle=rgba90(s.done?C110.rose:C110.dim,.6);ctx.lineWidth=1.2;for(let j=0;j<6;j++){const a=s.ang+j*1.05+t*.05*(j%2?1:-1),d=(34+j*7)*k,l=(4+j%3*3)*k;ctx.beginPath();ctx.moveTo(Math.cos(a)*d,Math.sin(a)*d);ctx.lineTo(Math.cos(a)*d+Math.cos(a+1.2)*l,Math.sin(a)*d+Math.sin(a+1.2)*l);ctx.stroke();}
    ctx.rotate(s.ang);ctx.scale(1.7*k,1.7*k);ctx.fillStyle=C110.ink;ctx.strokeStyle=s.done?C110.rose:rgba90(C110.zero,.6);ctx.lineWidth=1.4;hull110(s.i);ctx.fill();ctx.stroke();
    ctx.strokeStyle=rgba90(C110.dim,.9);ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(4,-3);ctx.lineTo(-3,2);ctx.moveTo(-6,-6);ctx.lineTo(-9,-2);ctx.moveTo(2,5);ctx.lineTo(-4,7);ctx.stroke();
    if(!s.done&&Math.sin(t*2.2+s.i*1.3)>.6){ctx.fillStyle=C110.white;ctx.beginPath();ctx.arc(6,0,1.4,0,TAU);ctx.fill();}
    ctx.restore();
    if(s.done){ctx.fillStyle=C110.white;ctx.globalAlpha=.75+.25*Math.sin(t*3+s.i);ctx.beginPath();ctx.arc(s.x,s.y,2.6,0,TAU);ctx.fill();ctx.globalAlpha=1;}
    if(s.done||isNext)worldLabel(s.x,s.y-X.r-8,s.id+(s.done?' · ПРОЧИТАН':act?' · ЧТЕНИЕ':ready?' · ЧИТАЙТЕ':' · ЖДЁТ'),s.done?C110.rose:ready?C110.zero:C110.dim);}}
// ======================= 48 «ПУСК» =======================
// Стартовый стол. Три контакта (подойти или выстрелить) будят расчёт: Отсчёт, Ремонт, Хор. Когда все три подняты — кнопка «ПУСК»: 10 с в круге. Пуск стирает всё.
const CON48=[{id:'A',name:'ОТСЧЁТ',u:.16,v:.21,wave:['signaller','gunner','gunner','gunner','shielder']},{id:'B',name:'РЕМОНТ',u:.84,v:.21,wave:['guard','labrat','rammer','scout','scout']},{id:'C',name:'ХОР',u:.5,v:.9,wave:['singer','unborn','unborn','unborn','unborn','fireship']}];
const FINAL48=['commander','stamp','stamp','fireship','autopilot','autopilot'];
function init48(X){X.k='launch';X.con=CON48.map(c=>({id:c.id,name:c.name,u:c.u,v:c.v,wave:c.wave,on:0,t:0,x:0,y:0}));X.btn={u:.5,v:.5,r:220,x:0,y:0,hold:0,armed:0,fired:0,fin:0,was:0,count:-1};X.on=0;
  const all=CON48.map(c=>c.wave).concat([FINAL48]);G.waves=all.map(w=>scaleWave(w.slice()));G.waveBase=all.map(w=>w.length);G.waveIdx=0;G.spawnQ=[];}
function geo48(X){const k=k110();for(const c of X.con){const q=P110(c.u,c.v);c.x=q.x;c.y=q.y;}const q=P110(.5,.5);X.btn.x=q.x;X.btn.y=q.y;X.btn.r=220*k;}
function tick48(X,dt){geo48(X);const p=G.player,B=X.btn,M=mc110();if(!p)return;
  const calm=aliveN110()===0;for(const c of X.con){if(c.on)continue;let hit=Math.hypot(p.x-c.x,p.y-c.y)<250;if(!hit&&calm)for(const b of G.pb){if(b.life<=0||b.drone)continue;if(Math.hypot(b.x-c.x,b.y-c.y)<30){hit=1;b.life=0;break;}}
    if(hit)contact48(X,c);}
  if(!B.armed&&X.on>=3){const n=aliveN110();if(n<=2&&G.waveIdx>=X.rel&&!G.spawnQ.length&&!G.warns.length){B.armed=1;banner('СТОЛ ПОЧТИ ЧИСТ · ПУСК ДОСТУПЕН','10 С В КРУГЕ · ПОСЛЕДНИЙ РАСЧЁТ ПРИДЁТ');snd110('armed');}else if(!X.hint.arm&&X.on>=3){X.hint.arm=1;floater(p.x,p.y-40,'ПУСК ОТКРОЕТСЯ, КОГДА СТОЛ ПОЧТИ ЧИСТ',C110.blue);}}
  if(B.armed&&!B.fired&&p.hp>0){const inside=Math.hypot(p.x-B.x,p.y-B.y)<B.r;
    let onPad=null;for(const e of G.enemies){if(!e.alive||e.spawnT>0||EDEF[e.type].passive||e.ally110)continue;if(Math.hypot(e.x-B.x,e.y-B.y)<B.r+e.r){onPad=e;break;}}B.onPad=onPad;
    if(inside){if(!B.was){B.was=1;if(!B.fin){B.fin=1;rel110(X,FINAL48,{x:B.x,y:B.y});floater(B.x,B.y-B.r-20,'ПОСЛЕДНИЙ РАСЧЁТ · ДЕРЖИТЕ ПУСК',C90.red);snd110('wake',B.x);}}
      if(onPad){if(!B.padT||G.t-B.padT>2.6){B.padT=G.t;floater(onPad.x,onPad.y-onPad.r-14,'ВРАГ НА СТОЛЕ · ОТСЧЁТ ЖДЁТ',C90.red);}}
      else B.hold=Math.min(10,B.hold+dt);
      const c=Math.floor(10-B.hold);if(c!==B.count){B.count=c;snd110(c%5===0?'tock':'tick');if(c<=3&&c>=0)floater(B.x,B.y-B.r*.5,String(c+1),C110.white);}}
    else{if(B.was){B.was=0;if(B.hold>0){M.puskDrop110++;floater(p.x,p.y-30,'ОТСЧЁТ ТЕЧЁТ · ВЕРНИТЕСЬ В КРУГ',C90.red);}}B.hold=Math.max(0,B.hold-.5*dt);B.count=-1;}
    if(B.hold>=10)pusk48(X);}
  if(!X.hint.c&&X.t>2){X.hint.c=1;floater(p.x,p.y-40,'КОНТАКТЫ · ПОДОЙДИТЕ ИЛИ ВЫСТРЕЛИТЕ В ЗАТИШЬЕ',C110.blue);}}
function contact48(X,c){c.on=1;c.t=G.t;X.on++;snd110('contact',c.x);hs90(.08,0);floater(c.x,c.y-50,'КОНТАКТ '+c.id+' · '+c.name,C110.blue);if(G.shock.length<60)G.shock.push({x:c.x,y:c.y,r:6,R:160,t:0,col:C110.blue,thin:true});
  rel110(X,c.wave,{x:c.x,y:c.y});radioLine('СТАРТОВЫЙ СТОЛ','#9fd8ff',c.id==='A'?'Отсчёт принят. Связист поднимает расчёт.':c.id==='B'?'Ремонтная бригада на столе. Гвардия прикрывает.':'Хор поёт. Нерождённые слышат.',.1);}
function pusk48(X){const B=X.btn;if(B.fired)return;B.fired=1;X.flashT=1.4;hs90(.3,2);snd110('pusk');trauma90(.5);banner('ПУСК','ПАМЯТЬ ЗАПУЩЕНА · СТОЛ ЧИСТ');
  for(const e of G.enemies){if(!e.alive||e.ally110)continue;if(EDEF[e.type].passive){e.alive=false;continue;}e.hp=0;kill(e,true);explode(e.x,e.y,C110.white,10,.8);G.kills++;G.score+=Math.round(EDEF[e.type].pts||0);if(G.mode==='world'&&!G.world)addPilotXP(rewMul());}
  G.warns.length=0;G.spawnQ.length=0;for(const b of G.eb)b.life=0;G.waveIdx=G.waves.length;X.rel=G.waveIdx;
  radioLine('СТАРТОВЫЙ СТОЛ','#9fd8ff','Пуск произведён. Расчёт стёрт вместе с памятью о нём. Так всегда и было.',1.2);}
function bg48(X,t){geo48(X);const B=X.btn,k=k110();
  ctx.fillStyle='rgba(8,14,34,.42)';ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(159,216,255,.07)';ctx.lineWidth=1;ctx.beginPath();for(let x=0;x<=W;x+=64){ctx.moveTo(x,0);ctx.lineTo(x,H);}for(let y=0;y<=H;y+=64){ctx.moveTo(0,y);ctx.lineTo(W,y);}ctx.stroke();
  ctx.strokeStyle='rgba(159,216,255,.16)';ctx.beginPath();for(let x=0;x<=W;x+=256){ctx.moveTo(x,0);ctx.lineTo(x,H);}for(let y=0;y<=H;y+=256){ctx.moveTo(0,y);ctx.lineTo(W,y);}ctx.stroke();
  // стол: круг пуска, шевроны, цифры отсчёта
  const armed=B.armed&&!B.fired,col=B.fired?C110.white:armed?C110.gold:C110.blue;ctx.save();ctx.translate(B.x,B.y);glow(0,0,B.r*1.3,col,armed?.18+.08*Math.sin(t*4):.08);
  ctx.strokeStyle=rgba90(col,armed?.75:.35);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,B.r,0,TAU);ctx.stroke();ctx.setLineDash([8,10]);ctx.lineDashOffset=t*(armed?30:8);ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,B.r*.82,0,TAU);ctx.stroke();ctx.setLineDash([]);
  ctx.rotate(t*.1);for(let i=0;i<8;i++){const a=i/8*TAU;ctx.strokeStyle=rgba90(col,.3);ctx.beginPath();ctx.moveTo(Math.cos(a)*B.r*.9,Math.sin(a)*B.r*.9);ctx.lineTo(Math.cos(a)*B.r*1.06,Math.sin(a)*B.r*1.06);ctx.stroke();}ctx.rotate(-t*.1);
  if(armed){ctx.strokeStyle=C110.white;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,B.r+8,-Math.PI/2,-Math.PI/2+TAU*B.hold/10);ctx.stroke();
    ctx.globalAlpha=.16+.06*Math.sin(t*6);ctx.fillStyle=C110.gold;ctx.font='700 '+Math.round(B.r*.75)+'px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(Math.ceil(10-B.hold)),0,4);ctx.textBaseline='alphabetic';ctx.textAlign='left';ctx.globalAlpha=1;}
  ctx.restore();
  worldLabel(B.x,B.y-B.r-16,B.fired?'ПУСК ПРОИЗВЕДЁН':armed?(B.onPad&&B.was?'ОТСЧЁТ ЖДЁТ · ОЧИСТИТЕ СТОЛ':'ПУСК · ДЕРЖИТЕ КРУГ '+Math.ceil(10-B.hold)+' С'):(X.on>=3?'ПУСК · ОЧИСТИТЕ СТОЛ':'ПУСК ЗАБЛОКИРОВАН · КОНТАКТЫ '+X.on+'/3'),B.onPad&&B.was&&armed?C90.red:col);
  for(const c of X.con){ctx.save();ctx.translate(c.x,c.y);const on=c.on,cc=on?C110.dim:C110.blue;glow(0,0,60*k,cc,on?.1:.2+.1*Math.sin(t*3));
    ctx.rotate(Math.PI/4);ctx.fillStyle='#0b1226';ctx.strokeStyle=cc;ctx.lineWidth=2;ctx.fillRect(-16*k,-16*k,32*k,32*k);ctx.strokeRect(-16*k,-16*k,32*k,32*k);ctx.rotate(-Math.PI/4);
    if(!on){ctx.strokeStyle=rgba90(cc,.2);ctx.setLineDash([4,8]);ctx.beginPath();ctx.arc(0,0,250,0,TAU);ctx.stroke();ctx.setLineDash([]);}
    ctx.fillStyle=on?C110.dim:C110.white;ctx.font='700 '+fpx(13)+'px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(c.id,0,1);ctx.textBaseline='alphabetic';ctx.textAlign='left';ctx.restore();
    worldLabel(c.x,c.y-30*k,c.name+(on?' · ПОДНЯТ':''),on?C110.dim:C110.blue);}}
// ======================= 49 «МИГ» =======================
// Существует только полоса. Она ползёт, поворачивает, сжимается к точке выхода. Снаружи — стирание, рывок не заряжается, враги вязнут (×0,6).
const WAVES49=[['hunter','hunter','rammer','rammer','rammer'],['echo80','loop','loop','loop','gunner'],['echo100','hollow100','hollow100','hollow100','eraser100'],['lost95','fixer100','inverse','gunner'],['echo100','echo100']];
const PH49=[{ax:'v',a:.23,b:.77,T:40},{ax:'h',a:.23,b:.77,T:32},{ax:'v',a:.77,b:.23,T:32},{ax:'c',T:20}];
function init49(X){X.k='blink';setTimeout(()=>{if(G.x110===X&&inMission())radioLine('МИГ','#ff9fe0','Существует только полоса. Всё, что вне её, уже было или ещё не случилось.',.5);},1500);X.band={ph:0,t:0,hw:.23,c:.23,ax:'v',turn:0,warn:0,R:0,cx:.5,cy:.5};X.outT=0;X.in=1;X.allies=[];X.alN=0;X.notch=0;
  G.waves=WAVES49.map(w=>scaleWave(w.slice()));G.waveBase=WAVES49.map(w=>w.length);G.waveIdx=0;G.spawnQ=[];}
function bandIn49(X,x,y){const B=X.band,u=x/W,v=y/H;if(B.ax==='c'){const q=P110(B.cx,B.cy);return Math.hypot(x-q.x,y-q.y)<=B.R;}
  if(H>W){if(B.ax==='v')return Math.abs(v-B.c)<=B.hw;return Math.abs(1-u-B.c)<=B.hw;}
  if(B.ax==='v')return Math.abs(u-B.c)<=B.hw;return Math.abs(v-B.c)<=B.hw;}
// милосердные выборы прошлых секторов: кто помнит вас у точки выхода
function mercy110(){const f=storyFlag,L=[];if(f('cradle22')==='keep')L.push('КОЛЫБЕЛЬ');if(f('fleet27')==='engine')L.push('ФЛОТ');if(f('line31')==='write')L.push('ЛИНИЯ');if(f('well38')==='answer'||f('well38')==='third')L.push('КОЛОДЕЦ');if(f('heart42')==='wake')L.push('СЕРДЦЕ');if(f('shore46')==='record')L.push('БЕРЕГ');return L;}
function allies49(X){const names=['УЧЕНИК','ПАССАЖИР'].concat(mercy110()).slice(0,6),n=names.length,q=P110(.5,.5);X.allies=[];for(let i=0;i<n;i++){const a=i/n*TAU;X.allies.push({x:q.x+Math.cos(a)*120,y:q.y+Math.sin(a)*120,a,cd:rnd(.2,.8),hp:70,maxHp:70,name:names[i],ang:0,t:0});}
  X.alN=n;banner('ПАМЯТЬ ОТВЕЧАЕТ ЗА ВАС','СОЮЗНИКИ · '+n);snd110('ally');radioLine('ПАМЯТЬ','#ffd0ee',n>2?'Те, кого вы пощадили, помнят. Их '+(n-2)+' и ещё двое.':'Двое помнят вас. Этого хватит.',.3);}
function allyTick110(X,dt){const p=G.player;if(!p||!X.allies.length)return;const M=mc110();
  for(const A of X.allies){A.t+=dt;A.a+=dt*.9;const tx=p.x+Math.cos(A.a)*96,ty=p.y+Math.sin(A.a)*96;A.x+=(tx-A.x)*Math.min(1,dt*3);A.y+=(ty-A.y)*Math.min(1,dt*3);
    A.cd-=dt;if(A.cd<=0){const t_=nearestEnemy(A.x,A.y,520);if(t_){const sc=lekScan(),a0=Math.atan2(aimPt(t_).y-A.y,aimPt(t_).x-A.x);A.ang=a0;G.pb.push({x:A.x,y:A.y,px:A.x,py:A.y,vx:Math.cos(a0)*820,vy:Math.sin(a0)*820,dmg:sc.dmg*.4,pierce:0,rico:0,life:.7,hit:[],drone:true,jr:true,a85:1});A.cd=Math.max(.3,sc.rate*2);}else A.cd=.2;}
    for(const b of G.eb){if(b.life>0&&!b.rift&&Math.hypot(b.x-A.x,b.y-A.y)<12){A.hp-=b.dmg;b.life=0;}}
    if(A.hp<=0){A.dead=1;explode(A.x,A.y,C110.rose,18,.8);floater(A.x,A.y-24,A.name+' · ПОТЕРЯН',C110.rose);M.allyLost110++;}}
  X.allies=X.allies.filter(A=>!A.dead);}
function tick49(X,dt){const B=X.band,p=G.player,M=mc110();if(!p)return;
  if(B.ph<4){const P=PH49[B.ph];if(B.turn>0){B.turn-=dt;if(B.turn<=0){B.ph++;B.t=0;B.warn=0;if(B.ph<4){const Q=PH49[B.ph];B.ax=Q.ax;B.c=Q.a===undefined?.5:Q.a;if(Q.ax==='c'){B.R=B.hw*Math.max(W,H);}}snd110('turn');floater(p.x,p.y-40,B.ph<3?'ПОВОРОТ':'МИГ СЖИМАЕТСЯ · К ТОЧКЕ ВЫХОДА',C110.zero);
        if(B.ph===3){rel110(X,WAVES49[4],{x:W/2,y:H/2});allies49(X);}}}
    else{B.t+=dt;const k=clamp(B.t/P.T,0,1);if(P.ax==='c'){B.ax='c';B.c=.5;B.R=B.hw*Math.max(W,H)*(1-k)+180*k110()*k;B.cx=.5;B.cy=.5;}else{B.ax=P.ax;B.c=P.a+(P.b-P.a)*k;}
      if(B.t>=P.T){if(B.ph<3){B.turn=3;B.warn=1;}else{B.ph=4;B.t=0;}}
      else if(P.T-B.t<=3&&!B.warn){B.warn=1;floater(p.x,p.y-40,B.ph<2?'ПОВОРОТ ЧЕРЕЗ 3':'СЖАТИЕ ЧЕРЕЗ 3',C110.zero);snd110('warn');}
      // засечки: волны по ходу полосы и по затишью
      const th=[[0,.02],[0,.55],[1,.4],[2,.35]];const n=aliveN110();
      for(let i=X.notch;i<4;i++){const [ph,kk]=th[i];if(B.ph>ph||(B.ph===ph&&k>=kk)||(i>0&&n<=2&&X.relT>8)){X.notch=i+1;const q=P110(B.ax==='v'?B.c:.5,B.ax==='h'?B.c:.5);rel110(X,WAVES49[i],{x:q.x,y:q.y});floater(q.x,q.y-40,'ЗАСЕЧКА '+(i+1),C110.zero);snd110('wake',q.x);break;}}}}
  else B.t+=dt;
  // снаружи: эрозия, рывок не заряжается
  const inB=bandIn49(X,p.x,p.y);if(inB!==X.in){X.in=inB;snd110('edge',p.x);if(!inB&&!X.hint.out){X.hint.out=1;floater(p.x,p.y-40,'ВНЕ МИГА · СТИРАНИЕ ЧЕРЕЗ 1,2 С · РЫВОК НЕ ЗАРЯЖАЕТСЯ',C90.red);}}
  if(!inB&&p.hp>0){X.outT+=dt;M.out110+=dt;if(p.dashCd>0)p.dashCd=Math.min(p.dashCdMax||p.dashCd,p.dashCd+dt);
    if(X.outT>1.2){drain90(G.st.maxHp*.02*dt);X.vig=Math.min(1,X.vig+dt*2);if(!X.erS||G.t-X.erS>.6){X.erS=G.t;snd110('erode');}}}
  else{X.outT=0;X.vig=Math.max(0,X.vig-dt*1.5);}
  for(const e of G.enemies){if(!e.alive||e.sbk)continue;const o=!bandIn49(X,e.x,e.y)&&e.spawnT<=0;e.tK=o?.6:1;e.out110=o?1:0;
    if(o){e.outT110=(e.outT110||0)+dt;if(e.outT110>1.5&&!STATIC.has(e.type)&&!EDEF[e.type].passive){e.hp-=e.maxHp*.03*dt;if(!X.hint.eout){X.hint.eout=1;floater(e.x,e.y-e.r-14,'ВНЕ МИГА · СТИРАЕТСЯ',C110.rose);}if(e.hp<=0)kill(e);}}else e.outT110=0;}
  allyTick110(X,dt);}
function bK110(b){const X=x110();if(!X||X.k!=='blink'||b.rift)return 1;return bandIn49(X,b.x,b.y)?1:.6;}
// контур полосы (без beginPath — чтобы можно было вычитать из прямоугольника арены)
function bandPath49(X){const B=X.band;if(B.ax==='c'){const q=P110(B.cx,B.cy);ctx.moveTo(q.x+B.R,q.y);ctx.arc(q.x,q.y,B.R,0,TAU);return;}
  const port=H>W;if(B.ax==='v'){if(!port)ctx.rect((B.c-B.hw)*W,0,2*B.hw*W,H);else ctx.rect(0,(B.c-B.hw)*H,W,2*B.hw*H);}else{if(!port)ctx.rect(0,(B.c-B.hw)*H,W,2*B.hw*H);else ctx.rect((1-B.c-B.hw)*W,0,2*B.hw*W,H);}}
let NEGP110=null;
function negPat110(){if(NEGP110)return NEGP110;const c=document.createElement('canvas');c.width=c.height=84;const g=c.getContext('2d');g.strokeStyle='rgba(232,255,248,.035)';g.lineWidth=1;g.beginPath();for(let y=.5;y<84;y+=6){g.moveTo(0,y);g.lineTo(84,y);}g.stroke();
  g.strokeStyle='rgba(255,159,224,.05)';g.beginPath();for(let d=-84;d<168;d+=28){g.moveTo(d,0);g.lineTo(d+84,84);}g.stroke();return NEGP110=ctx.createPattern(c,'repeat');}
function bandOut49(X){ctx.beginPath();ctx.rect(0,0,W,H);bandPath49(X);ctx.clip('evenodd');}
function under49(X,t){const B=X.band;
  // снаружи полосы — негатив: тёмная заливка со строчками
  // снаружи полосы — негатив: обращённые цвета, бледная засветка и строчки
  // снаружи — тёмный негатив: заливка и кэш-узор (строчки и штрих) одним прямоугольником, узор бежит сдвигом начала координат
  ctx.save();bandOut49(X);ctx.fillStyle='rgba(5,2,9,.66)';ctx.fillRect(0,0,W,H);
  if(SET.fx&&!G.lowFx&&!isMob()){const sh=((t*18)%84);ctx.translate(sh,sh);ctx.fillStyle=negPat110();ctx.fillRect(-sh,-sh,W+84,H+84);}ctx.restore();
  // внутри — тёплая кромка
  if(!isMob()){ctx.save();ctx.beginPath();bandPath49(X);ctx.clip();glow(W/2,H/2,Math.max(W,H)*.5,C110.zero,.05);ctx.restore();}
  const warn=B.warn&&B.turn<=0&&B.ph<3;ctx.strokeStyle=warn&&Math.sin(t*12)>0?C110.white:C110.zero;ctx.lineWidth=2;ctx.beginPath();bandPath49(X);ctx.stroke();
  if(!isMob()){ctx.setLineDash([3,11]);ctx.lineDashOffset=-t*40;ctx.strokeStyle=rgba90(C110.rose,.45);ctx.lineWidth=6;ctx.beginPath();bandPath49(X);ctx.stroke();ctx.setLineDash([]);}
  else{ctx.strokeStyle=rgba90(C110.rose,.3);ctx.lineWidth=5;ctx.beginPath();bandPath49(X);ctx.stroke();}
  if(B.turn>0&&B.ph<3){const Q=PH49[B.ph+1];const save={ax:B.ax,c:B.c,R:B.R};B.ax=Q.ax;B.c=Q.a===undefined?.5:Q.a;if(Q.ax==='c')B.R=B.hw*Math.max(W,H);ctx.setLineDash([10,8]);ctx.strokeStyle=rgba90(C110.white,.35+.25*Math.sin(t*8));ctx.lineWidth=1.5;ctx.beginPath();bandPath49(X);ctx.stroke();ctx.setLineDash([]);Object.assign(B,save);}
  if(B.ax==='c'){const q=P110(B.cx,B.cy);ctx.strokeStyle=rgba90(C110.white,.4);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(q.x-12,q.y);ctx.lineTo(q.x+12,q.y);ctx.moveTo(q.x,q.y-12);ctx.lineTo(q.x,q.y+12);ctx.stroke();worldLabel(q.x,q.y-B.R-12,'ТОЧКА ВЫХОДА',C110.zero);}
  else if(B.ph<3&&B.turn<=0){// шевроны хода полосы по её оси
    const P=PH49[B.ph],dir=P.b>P.a?1:-1,port=H>W,vert=(B.ax==='v')!==port;ctx.strokeStyle=rgba90(C110.rose,.35);ctx.lineWidth=1.5;const k=(t*40)%60;
    if(vert){const cx=(port?(1-B.c):B.c)*W,sgn=port?(B.ax==='h'?-dir:dir):dir;for(let y=40;y<H;y+=120){const yy=y+(port?0:0);ctx.beginPath();ctx.moveTo(cx-6,yy);ctx.lineTo(cx+6*0,yy);}
      for(let y=-60+k;y<H;y+=60){const x0=cx+ (sgn>0?-8:8);ctx.beginPath();ctx.moveTo(x0,y-5);ctx.lineTo(x0+sgn*8,y);ctx.lineTo(x0,y+5);ctx.stroke();}}
    else{const cy=B.c*H,sgn=port?(B.ax==='v'?dir:-dir):dir;for(let x=-60+k;x<W;x+=60){const y0=cy+(sgn>0?-8:8);ctx.beginPath();ctx.moveTo(x-5,y0);ctx.lineTo(x,y0+sgn*8);ctx.lineTo(x+5,y0);ctx.stroke();}}}}
function draw49(X,t){ctx.save();bandOut49(X);ctx.fillStyle='rgba(5,2,9,.42)';ctx.fillRect(0,0,W,H);ctx.restore();
  for(const A of X.allies){ctx.save();ctx.translate(A.x,A.y);ctx.rotate(A.ang||0);glow(0,0,26,C110.rose,.3);ctx.fillStyle='#2a0a22';ctx.strokeStyle=C110.rose;ctx.lineWidth=2;shipPath85(.8);ctx.fill();ctx.stroke();ctx.restore();
    if(A.hp<A.maxHp){ctx.strokeStyle=C110.rose;ctx.lineWidth=2;ctx.beginPath();ctx.arc(A.x,A.y,16,-Math.PI/2,-Math.PI/2+TAU*A.hp/A.maxHp);ctx.stroke();}
    worldLabel(A.x,A.y-22,A.name,C110.rose);}}
// ======================= 50 — заготовка комнаты босса (сектор XII) =======================
function tickRoom(X,dt){const p=G.player;if(p&&!X.hint.room&&X.t>1.5){X.hint.room=1;floater(p.x,p.y-40,'КОМНАТА ПУСТА · ОН ВЫХОДИТ В МИР, К КНОПКЕ',C110.zero);radioLine('Э. В.','#ffd36b','Здесь его нет. Он там, где кнопка.',.3);}}
function bgRoom(X,t){ctx.fillStyle='rgba(18,8,18,.5)';ctx.fillRect(0,0,W,H);const q=P110(.5,.5),k=k110();glow(q.x,q.y,320*k,C110.zero,.12+.04*Math.sin(t*.8));
  ctx.save();ctx.translate(q.x,q.y);for(let i=1;i<=5;i++){ctx.strokeStyle=rgba90(C110.zero,.06+.03*i);ctx.lineWidth=1;ctx.setLineDash([6,14]);ctx.lineDashOffset=t*(i%2?10:-10);ctx.beginPath();ctx.arc(0,0,i*64*k,0,TAU);ctx.stroke();}ctx.setLineDash([]);
  ctx.rotate(t*.1);ctx.strokeStyle=rgba90(C110.rose,.5);ctx.lineWidth=2;for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(0,0,40*k,i/6*TAU,i/6*TAU+.6);ctx.stroke();}ctx.restore();
  worldLabel(q.x,q.y-70*k,'КОМНАТА 50 · ПУСТА',C110.zero);worldLabel(q.x,q.y+78*k,'ОН ЖДЁТ СНАРУЖИ, У КНОПКИ',C110.dim);}
// ======================= рисунок и интерфейс =======================
function bg110(t){const X=x110();if(!X)return;if(X.k==='const')bg47(X,t);else if(X.k==='launch')bg48(X,t);else if(X.k==='room')bgRoom(X,t);}
function under110(t){const X=x110();if(!X)return;const X90=G.x90;if(X.k==='blink')under49(X,t);
  if(X90){for(const q of X90.pud){const a=Math.min(1,q.t,(q.t0-q.t)*3),rr=q.r+3*Math.sin(t*3+q.x);rgDraw95(q.x,q.y,rr*1.08,'#5a0a16',.85*a,0,[.78,.7*a]);ctx.strokeStyle=rgba90('#ff6f86',.35*a);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(q.x,q.y,rr*.92,Math.PI*1.1,Math.PI*1.6);ctx.stroke();}
    if(X90.ez.length)ezDraw100(X90.ez,t);}}
function draw110(t){const X=x110();if(!X)return;if(X.k==='blink')draw49(X,t);}
function top110(t){const X=x110();if(!X)return;
  if(X.flashT>0){const a=clamp(X.flashT/1.4,0,1);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=a*a;ctx.fillStyle='#fff4fb';ctx.fillRect(0,0,cv.width,cv.height);ctx.restore();}
  if(X.k==='blink'&&X.vig>0)vig95('#ff9fe0',.22*X.vig,.3);}
function hud110(){const X=x110();if(!X||G.state!=='play')return null;
  if(X.k==='const'){const c=X.cur;return {l:'СОЗВЕЗДИЕ · ПРОЧИТАНО '+X.lit+'/5',k:c?c.read/3:null,col:C110.white,lc:C110.zero,r:X.phase==='fight'?'ПАМЯТЬ ОТВЕЧАЕТ':X.phase==='cool'?'ПАМЯТЬ СТИХАЕТ':X.lit>=5?'ДОБЕЙТЕ':'ЧИТАЙТЕ '+(next47(X)||{id:''}).id};}
  if(X.k==='launch'){const B=X.btn;return {l:B.fired?'ПУСК ПРОИЗВЕДЁН':B.armed?'ПУСК · '+Math.ceil(10-B.hold)+' С':X.on>=3?'ПУСК · ОЧИСТИТЕ СТОЛ':'КОНТАКТЫ '+X.on+'/3',k:B.armed&&!B.fired?B.hold/10:null,col:B.onPad&&B.was?C90.red:C110.gold,lc:C110.blue,r:B.armed&&!B.fired?(B.onPad&&B.was?'ВРАГ НА СТОЛЕ':'ДЕРЖИТЕ КРУГ'):B.fired?'':'ПОДОЙДИТЕ ИЛИ ВЫСТРЕЛИТЕ В ЗАТИШЬЕ'};}
  if(X.k==='blink'){const B=X.band,P=PH49[Math.min(3,B.ph)],port=H>W,ph=B.ph>=4?'ТОЧКА ВЫХОДА · ДОБЕЙТЕ':B.turn>0?(B.ph<2?'ПОВОРОТ':'СЖАТИЕ'):B.ph===0?(port?'МИГ ИДЁТ ↓':'МИГ ИДЁТ →'):B.ph===1?(port?'МИГ ИДЁТ ←':'МИГ ИДЁТ ↓'):B.ph===2?(port?'МИГ ИДЁТ ↑':'МИГ ИДЁТ ←'):'МИГ СЖИМАЕТСЯ';
    return {l:ph,k:B.ph>=4?null:clamp(B.t/P.T,0,1),col:X.in?C110.zero:C90.red,lc:X.in?C110.zero:C90.red,r:X.in?(X.allies.length?'СОЮЗНИКИ '+X.allies.length:'ЗАСЕЧКИ '+X.notch+'/4'):'ВНЕ МИГА'};}
  return {l:'КОМНАТА 50 · ПУСТА · БОЙ — ИЗ МИРА',k:null,col:C110.zero,lc:C110.zero,r:'ВЫХОД — ПАУЗА'};}
function spark110(e){if(!SET.fx)return;const n=fxN95(8);for(let i=0;i<n;i++){const a=rnd(0,TAU),v=rnd(40,180);part(e.x,e.y,Math.cos(a)*v,Math.sin(a)*v,rnd(.3,.6),i%2?C110.zero:C110.white,rnd(1.5,2.5));}}
// ======================= звук =======================
const SND110={};
function snd110(kind,x){if(!AU.ctx||!SET.sfx||!AU.sfx)return;const c=AU.ctx,t=c.currentTime;const now=performance.now();if(SND110[kind]&&now-SND110[kind]<70)return;SND110[kind]=now;
  if(typeof vox95==='function'&&!vox95(.4,['pusk','armed','readOk','ally','turn'].includes(kind)))return;
  const pan=x===undefined||!isFinite(x)?0:clamp(((x-CX)/(VW||W))*2-1,-.6,.6);
  const out=()=>{if(pan&&c.createStereoPanner){const q=c.createStereoPanner();q.pan.value=pan;q.connect(AU.sfx);return q;}return AU.sfx;};
  const tone=(f0,f1,dur,type,vol,delay)=>{delay=delay||0;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f0,t+delay);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+delay+dur);g.gain.setValueAtTime(.0001,t+delay);g.gain.linearRampToValueAtTime(vol,t+delay+.012);g.gain.exponentialRampToValueAtTime(.0001,t+delay+dur);o.connect(g);g.connect(out());o.start(t+delay);o.stop(t+delay+dur+.03);};
  const noise=(dur,vol,f,type,delay,f2,q)=>{delay=delay||0;const s=c.createBufferSource();s.buffer=noiseBuf95(c);const fl=c.createBiquadFilter();fl.type=type||'lowpass';if(q)fl.Q.value=q;fl.frequency.setValueAtTime(f,t+delay);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+delay+dur);const g=c.createGain();g.gain.setValueAtTime(vol,t+delay);g.gain.linearRampToValueAtTime(.0001,t+delay+dur);s.connect(fl);fl.connect(g);g.connect(out());s.start(t+delay,Math.random()*1.4,dur+.05);};
  switch(kind){
    case 'read':tone(520,780,.22,'sine',.022);break;
    case 'readOk':tone(523,523,.9,'sine',.03);tone(659,659,.9,'sine',.024,.06);tone(784,784,1.1,'sine',.02,.12);noise(.3,.02,2400,'highpass');break;
    case 'wake':noise(.5,.05,180,'lowpass',0,1200);tone(220,110,.5,'triangle',.03);break;
    case 'calm':tone(392,330,.5,'sine',.02);break;
    case 'contact':tone(1400,900,.16,'triangle',.035);noise(.05,.04,5000,'highpass');break;
    case 'tick':noise(.03,.05,4200,'highpass');tone(1200,1200,.035,'square',.008);break;
    case 'tock':noise(.04,.06,3200,'highpass');tone(800,790,.07,'square',.012);break;
    case 'armed':tone(440,660,.14,'triangle',.03);tone(660,990,.16,'triangle',.03,.14);tone(990,1320,.3,'triangle',.028,.3);break;
    case 'pusk':noise(1.3,.12,200,'lowpass',0,4000);tone(60,30,1.1,'sine',.2);tone(880,1760,.9,'sine',.03,.1);tone(1320,2640,.9,'sine',.02,.18);break;
    case 'erode':tone(70,66,.22,'sawtooth',.02);noise(.2,.02,800,'bandpass');break;
    case 'edge':tone(900,600,.12,'sine',.03);break;
    case 'warn':tone(660,660,.12,'square',.012);tone(660,660,.12,'square',.012,.2);tone(660,660,.12,'square',.012,.4);break;
    case 'turn':noise(.6,.06,400,'bandpass',0,2400,2);tone(300,150,.5,'sine',.03);break;
    case 'ally':tone(880,880,.4,'sine',.03);tone(1320,1320,.5,'sine',.022,.12);break;}}
// ======================= музыка =======================
SC_.s10={name:'Нулевая точка',root:46,v:[[0,7,14,19],[-3,4,9,14],[0,5,12,17]],chordT:[16,24],pad:['sine',400,900,.04],sub:.06,noise:['lowpass',500,.01,.03],bell:['glass',7,12,.022],rev:.72,alert:1,vol:.68,bpm:66};
SC_.mx10={name:'Бой · Нулевая точка',root:46,v:[[0,7,14,19],[-3,4,9,14]],chordT:[10,16],pad:['triangle',380,950,.034],sub:.09,noise:['bandpass',900,.01,.08],bell:['glass',10,16,.018],rev:.5,fight:1,bpm:96,pulse:'q',toms:'fight',vol:.9};
SC_.s11={name:'???',root:46,v:[[0,7,12,19],[-5,2,7,14]],chordT:[20,28],pad:['sine',360,800,.038],sub:.07,noise:['lowpass',420,.012,.03],bell:null,rev:.8,alert:1,vol:.6,bpm:50};
SC_.mx11=Object.assign({},SC_.mx10,{name:'Бой · ???'});
SC_.m47={name:'Созвездие',root:46,v:[[0,7,14,19],[-3,4,9,14],[0,5,12,17]],chordT:[12,18],pad:['sine',420,900,.042],sub:.07,noise:['lowpass',600,.01,.03],bell:['glass',8,13,.02],rev:.72,fight:1,bpm:76,pulse:'q',toms:'fight',choir:1,vol:.86,zero110:'const'};
SC_.m48={name:'Пуск',root:41,v:[[0,7,12,16],[-3,4,9,12],[5,12,16,19]],chordT:[8,12],pad:['sawtooth',360,1000,.028],sub:.1,noise:['bandpass',700,.012,.07],bell:['metal',12,18,.014],rev:.4,fight:1,bpm:60,pulse:'q',toms:'fight',mech:1,brass:.03,vol:.95,zero110:'launch'};
SC_.m49={name:'Миг',root:44,v:[[0,7,14,19],[-5,2,9,14]],chordT:[8,12],pad:['triangle',380,950,.03],sub:.09,noise:['bandpass',1100,.012,.09],bell:['shine',10,16,.016],rev:.45,fight:1,bpm:104,pulse:'q',toms:'fight',heavy:1,vol:.92,zero110:'blink'};
function step110(P,t,st,bar){const S=P.sc,X=P.ext||{},root=S.root+(P.semi||0);if(!S.zero110||!AU.ctx)return;
  if(S.zero110==='const'&&X.read110&&st%2===0){const pent=[0,2,4,7,9,12];ev(t,mtof(root+36+pent[(st/2+bar)%6]),.3,'sine',.018,P.L.bell,.005,null,rnd(-.5,.5));}
  if(S.zero110==='launch'){if(st%4===0){evNoise(t,.03,.05,P.L.tick,'highpass',4200);ev(t,st===0?820:1200,.04,'square',st===0?.012:.007,P.L.tick,.002);}
    if(X.pusk110>0&&st%2===1)evNoise(t,.025,.03*X.pusk110,P.L.tick,'highpass',5200);if(X.pusk110>0&&st%4===0)ev(t,mtof(root+12),.5,'sine',.06*X.pusk110,P.L.sub,.01);}
  if(S.zero110==='blink'){if(st%2===1)evNoise(t,.02,.014,P.L.hi,'highpass',6000);if(X.turn110&&st%4===0)ev(t,mtof(root+31),.25,'triangle',.025,P.L.fx,.01,mtof(root+33));
    if(X.out110&&st%8===4)ev(t,mtof(root-12),.4,'sawtooth',.02,P.L.sub,.02);}}
function mus110(T){const X=x110();if(!X||!inMission()||T.calm)return T;
  if(X.k==='const'){if(X.cur)T.ext.read110=1;if(X.phase==='read'&&X.lit<5)T.I=Math.min(T.I,.35);}
  if(X.k==='launch'){const B=X.btn;if(B.armed&&!B.fired){T.ext.pusk110=clamp(B.hold/10,0,1);T.I=Math.max(T.I,.5+.5*B.hold/10);}if(B.fired){T.I=0;T.lp=Math.min(T.lp||18000,1400);}}
  if(X.k==='blink'){const B=X.band;if(!X.in){T.ext.out110=1;T.lp=Math.min(T.lp||18000,1500);}if(B.warn&&B.turn<=0&&B.ph<3)T.ext.turn110=1;if(B.ph>=3)T.ext.bpmAdd=(T.ext.bpmAdd||0)+10;}
  if(X.k==='room'){T.I=0;}
  return T;}
// ======================= данные миссий (после генерации) =======================
(function missions110(){const M47=MISSIONS[46],M48=MISSIONS[47],M49=MISSIONS[48],M50=MISSIONS[49];if(!M47||!M50)return;
  const S10=SEC_SCALE[10];const hp=S10?S10.hp:8;
  Object.assign(M47,{name:'Нулевая точка · созвездие',sector:'СЕКТОР XI · НУЛЕВАЯ ТОЧКА',sec:10,bossRoom:false,sboss:null,intro:[],debut:undefined,wavesT:WAVES47.map(w=>w.slice()),hpMul:1,
    mech:['НУЛЕВАЯ ТОЧКА · ПАМЯТЬ','ВРАГИ СЕКТОРА ×'+hp,'ЧТЕНИЕ · 5 ПИЛОТОВ'],
    hint:['Пять погибших пилотов лежат созвездием. Читайте их по порядку: подойдите и держитесь в кольце 3 секунды — память ответит теми, кто их убил, и с каждым пилотом злее. Следующий читается, когда память стихнет.','Враги сектора в '+hp+' раз прочнее, на {SPD}% быстрее, атакуют на {ATK}% чаще, броня 30%. Урон вашего орудия здесь ×{DMG}. Ремонта в Нулевой точке нет.']});
  Object.assign(M48,{name:'Нулевая точка · пуск',sector:'СЕКТОР XI · НУЛЕВАЯ ТОЧКА',sec:10,bossRoom:false,sboss:null,intro:[],debut:undefined,wavesT:CON48.map(c=>c.wave.slice()).concat([FINAL48.slice()]),hpMul:1.05,
    mech:['НУЛЕВАЯ ТОЧКА · ПАМЯТЬ','ВРАГИ СЕКТОРА ×'+hp,'ПУСК · 3 КОНТАКТА · 10 С'],
    hint:['Стартовый стол. Три контакта — подойдите или выстрелите — поднимают расчёты: Отсчёт, Ремонт, Хор. Когда все три подняты, встаньте в круг «ПУСК» на 10 секунд. Выход из круга — отсчёт течёт назад. Пуск стирает всё на столе.','Связист зовёт подмогу — бейте его первым. Лаборант чинит Гвардию, Певчий гонит Нерождённых. Последний расчёт приходит, когда вы начинаете отсчёт.']});
  Object.assign(M49,{name:'Нулевая точка · миг',sector:'СЕКТОР XI · НУЛЕВАЯ ТОЧКА',sec:10,bossRoom:false,sboss:null,intro:[],debut:undefined,wavesT:WAVES49.map(w=>w.slice()),hpMul:1.1,
    mech:['НУЛЕВАЯ ТОЧКА · ПАМЯТЬ','ВРАГИ СЕКТОРА ×'+hp,'МИГ · ПОЛОСА ДВИЖЕТСЯ'],
    hint:['Существует только полоса. Она ползёт, дважды поворачивает и сжимается к точке выхода. Снаружи через 1,2 с — стирание 2% корпуса в секунду, рывок не заряжается, но враги вязнут: ×0,6 скорости. Четыре засечки — четыре волны. У точки выхода память ответит за вас: двое и те, кого вы пощадили.','Победа открывает ворота Нулевой точки — сектор XII.']});
  Object.assign(M50,{name:'Комната босса',sector:'СЕКТОР XII · ???',sec:11,bossRoom:true,sboss:null,boss:undefined,intro:[],debut:undefined,wavesT:[],hpMul:1,
    mech:['ЗАГОТОВКА · БОСС ПОЗЖЕ'],hint:['Комната подготовлена, босса здесь пока нет. Он будет описан отдельно.','Вход из мира закрыт до следующего обновления; для проверки — из меню разработчика.']});
  for(const m of [47,48,49,50]){const M=MISSIONS[m-1];M.affix=Math.min(.5,.1+.01*(m-10));M.affix2=Math.min(.4,(m-29)*.02);}
  MASTERY[46]={t:'Прочитать всех пятерых, не прервав ни одного чтения',ok:()=>!!G.mc&&G.mc.read110>=5&&!G.mc.readBreak110};
  MASTERY[47]={t:'Удержать «ПУСК», ни разу не выйдя из круга',ok:()=>!!G.mc&&!G.mc.puskDrop110};
  MASTERY[48]={t:'Провести вне Мига не больше 10 секунд',ok:()=>!!G.mc&&(G.mc.out110||0)<=10};
  FB95[10]=['scout','gunner','rammer','lancer'];
  if(typeof SEC_MECH!=='undefined')SEC_MECH[10]='НУЛЕВАЯ ТОЧКА · ПАМЯТЬ';
  if(typeof STORY_W!=='undefined'&&Array.isArray(STORY_W)){}
})();

