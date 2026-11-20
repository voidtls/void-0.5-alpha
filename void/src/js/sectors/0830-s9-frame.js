// ===== 0.9 «Сердце Ковчега и Стёртые берега»: общий каркас и сектор IX — механики миссий =====
const S90T=new Set(['clot90','valve90','keeper90','phago90','neuron90','embryo90','pass90','eraser100','hollow100','witness100','typo100','fixer100','echo100','tide100','noname100']);
S90T.forEach(k=>{H74.add(k);STORY_NORETREAT.add(k);});
const D90T=new Set([...S90T,'heart90','hvalve90','hkey90','thromb90','shore100','beacon100']);
function sec90(){const s=sec74();return s===8||s===9?s:-1;}
function rk90(){return curDiff().rank||0;}
function pk90(a,b,c){const r=rk90();return r<=0?a:r===1?b:c;}
function m90(){return inMission()&&G.mode!=='endless'?G.m:0;}
function ark90(){const S=G.save;if(!S||!S.story)return {woke:0,slept:0,lost:0,pods:{}};const a=S.story.ark||(S.story.ark={pods:{}});if(!a.pods)a.pods={};let w=0,s=0,l=0;for(const k in a.pods){const v=a.pods[k];if(v==='w')w++;else if(v==='s')s++;else if(v==='l')l++;}a.woke=w;a.slept=s;a.lost=l;return a;}
function podSet90(id,v){const S=G.save;if(!S||!S.story||G.mode!=='world')return;const a=ark90();const cur=a.pods[id];if(cur==='l'||cur==='w'&&v==='s')return;a.pods[id]=v;ark90();}
// --- геометрия арены, пересчитывается при смене размера окна ---
function geo90(X){if(X.gw===W&&X.gh===H)return;X.gw=W;X.gh=H;
  for(const f of X.flows){const P=f.p.map(([x,y])=>{const q=typeof rot95==='function'?rot95(x,y):{x:x*W,y:y*H};return [q.x,q.y];}),pts=[];let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    for(let i=0;i<=32;i++){const t=i/32,u=1-t,x=u*u*u*P[0][0]+3*u*u*t*P[1][0]+3*u*t*t*P[2][0]+t*t*t*P[3][0],y=u*u*u*P[0][1]+3*u*u*t*P[1][1]+3*u*t*t*P[2][1]+t*t*t*P[3][1];pts.push({x,y});x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
    for(let i=0;i<pts.length;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],l=Math.hypot(b.x-a.x,b.y-a.y)||1;pts[i].tx=(b.x-a.x)/l;pts[i].ty=(b.y-a.y)/l;}
    f.pts=pts;f.bb=[x0-70,y0-70,x1+70,y1+70];}
  {const hz=H>W*1.15;for(const L of X.locks){L.hz=hz;L.pos=L.nx*(hz?H:W);L.door=L.ny*(hz?W:H);L.len=hz?W:H;L.x=hz?L.door:L.pos;L.dy=hz?L.pos:L.door;}}
  for(const q of X.pods){const P=typeof rot95==='function'?rot95(q.nx,q.ny):{x:q.nx*W,y:q.ny*H};q.x=P.x;q.y=P.y;}
  if(X.locks.length&&G.player&&X.gwInit90){const p=G.player;p.inv=Math.max(p.inv,1);for(const L of X.locks){const u=lu90(L,p.x,p.y);if(Math.abs(u-L.pos)<12+p.r+4)lockSet90(L,p,L.pos+(u<L.pos?-1:1)*(12+p.r+6));}}X.gwInit90=1;}
// --- поток: ближайшая точка ленты, направление и сила ---
function flowQ(x,y,X){X=X||G.x90;if(!X||!X.flows.length)return null;let best=null,bk=0;
  for(const f of X.flows){if(!f.pts||f.shut>0||f.closed)continue;const b=f.bb;if(x<b[0]||x>b[2]||y<b[1]||y>b[3])continue;const P=f.pts,hw=f.w/2;
    for(let i=0;i<P.length-1;i++){const a=P[i],c=P[i+1],dx=c.x-a.x,dy=c.y-a.y,L2=dx*dx+dy*dy||1;const t=clamp(((x-a.x)*dx+(y-a.y)*dy)/L2,0,1),qx=a.x+dx*t,qy=a.y+dy*t,d=Math.hypot(x-qx,y-qy);
      if(d<hw){const k=1-(d/hw)*(d/hw);if(k>bk){bk=k;const sg=f.rev95?-1:1,sk=(f.spd95||1)*(f.k95===undefined?1:f.k95);best={tx:(a.tx+(c.tx-a.tx)*t)*sg,ty:(a.ty+(c.ty-a.ty)*t)*sg,k:k*sk,f};}}}}
  return best;}
function beat90(t){const ph=(t*50/60)%1;return Math.pow(Math.max(0,1-ph*3.2),2);}
// --- миссия ---
function t90Init(M){G.x110=null;const sec=M&&M.gen?M.sec:-1;
  G.x90={sec,alarm:0,alarmV:0,alarmOn:false,alarmK:1,stage:0,al90T:0,flows:[],locks:[],pods:[],pud:[],nets:[],nid:0,hint:{},tel:{},atk:{},first:{},newT:{},wave:-1,t:0,quietT:0,hudFx:0,trauma:0,
    er:null,ez:[],hud:null,wit:[],witN:0,witT:0,tide:null,shadT:0,shad:[],echoP:[],echoRec:[],echoRecT:0,frag:0,born:G.t,phago90T:0,pass:[],karr:0};
  G.hs90=null;clearHud100(true);if(typeof t95Init==='function')t95Init(null,null);
  if(G.mode==='endless'||!M||!M.gen)return;const m=G.m,X=G.x90;
  if(sec===8&&!M.bossRoom){
    const F={39:[[[-.05,.28],[.35,.02],[.62,.6],[1.05,.36]],[[.12,1.05],[.32,.58],[.74,.9],[.92,-.05]],[[-.05,.82],[.38,.74],[.6,.3],[1.05,.74]]],
      40:[[[-.05,.3],[.3,.1],[.7,.55],[1.05,.25]],[[-.05,.78],[.4,.95],[.65,.55],[1.05,.82]]],41:[[[.5,-.05],[.15,.35],[.85,.6],[.5,1.05]],[[-.05,.55],[.35,.4],[.65,.75],[1.05,.45]]]}[m];
    if(F)X.flows=F.map(p=>({p,w:120,shut:0,closed:false,valve:null}));
    if(m===40||m===41){X.alarmOn=true;X.alarmK=pk90(.7,1,1.3)*(storyFlag('well38')==='silence'?.8:1);
      X.locks=[{nx:1/3,ny:m===40?.5:.32,ph:0,st:'open',t:0},{nx:2/3,ny:m===40?.5:.68,ph:7,st:'open',t:0}];}
    const PODS={39:[[.18,.24],[.82,.3]],40:[[.15,.22],[.86,.78]],41:[[.5,.16],[.84,.5]]}[m]||[];
    const ids='abc';PODS.forEach((q,i)=>X.pods.push({id:'m'+m+ids[i],nx:q[0],ny:q[1],st:'sleep',ch:0,kch:0,kby:null}));
    if(storyFlag('well38')==='third'){const extra={39:[.5,.12],40:[.5,.86],41:[.16,.5]}[m];if(extra)X.pods.push({id:'m'+m+'t',nx:extra[0],ny:extra[1],st:'sleep',ch:0,kch:0,kby:null});}
    if(m===41&&storyFlag('cradle22')==='keep')X.pods.push({id:'m41k',nx:.32,ny:.84,st:'sleep',ch:0,kch:0,kby:null,child:1});
    const A=ark90();for(const q of X.pods){const v=A.pods[q.id];if(v==='w')q.st='open';else if(v==='l')q.st='lost';}
    geo90(X);}
  if(sec===9&&typeof t100Init==='function')t100Init(M,X);
  if(typeof t95Init==='function')t95Init(M,X);if(typeof t110Init==='function')t110Init(M,X);}
function done90(M){const X=G.x90;if(!X||!M||!M.gen)return;
  for(const q of X.pods)if(q.st==='sleep')podSet90(q.id,'s');
  if(M.sec===9&&typeof done100==='function')done100(M,X);if(M.sec>=10&&typeof done110==='function')done110(M,X);
  if(M.sec===8&&G.mc&&X.alarmOn&&!G.mc.alarm60)conEvent('calm90');}
function r90Reset(){G.x90=null;G.x110=null;G.hs90=null;G.ol95=0;G.mark95=null;G.slow95=null;G.fq95=null;G.slowP95=0;clearHud100(true);const el=document.getElementById('x90G');if(el)el.hidden=true;}
// --- Тревога ---
// непрерывный урон (стирание, пустота): идёт мимо неуязвимости после удара, но не мимо рывка
function drain90(d){const p=G.player;if(!p||p.hp<=0||p.dashT>0||G.deadT>0||(devAny()&&G.dev.god)||(G.x85&&G.x85.calm>0&&inMission()))return;if(inMission())d*=curDiff().dmg||1;if(G.st&&p.hp<G.st.maxHp*.1)d*=.3;p.hp-=d;G.taken+=d;G.hurtV=Math.max(G.hurtV,.3);p.hitT=G.t;if(p.hp<=0){p.hp=.01;p.inv=0;p.shieldUp=false;damagePlayer(1);}}
function alarm90(v,why,x,y,aP){const X=G.x90;if(!X||!X.alarmOn||G.endT>0||!inMission())return;const a0=aP!==undefined?aP:X.alarm;X.alarm=clamp(X.alarm+(v>0?v*X.alarmK:v),0,100);
  if(why&&Math.abs(v)>=3&&x!==undefined)floater(x,y-26,(v>0?'ТРЕВОГА +':'ТРЕВОГА ')+Math.round(v>0?v*X.alarmK:v),v>0?C90.red:C90.warm);
  if(X.alarm>60&&G.mc)G.mc.alarm60=1;if(a0<30&&X.alarm>=30&&X.stage<1){X.stage=1;X.ph30=1;floater(G.player.x,G.player.y-46,'ТРЕВОГА 30 · КЛЕТКИ ПРОСНУЛИСЬ',C90.ark);}
  if(a0<60&&X.alarm>=60&&X.stage<2){X.stage=2;banner('ТРЕВОГА 60','ВРАГИ БЫСТРЕЕ · КОВЧЕГ ИЩЕТ ВАС');snd90('alarm');}
  if(X.alarm>=90&&!(X.al90T>0)){X.al90T=30;X.alarm=55;banner('ТРЕВОГА 90','ОБЛАВА · СБЕЙТЕ ИХ — СТАНЕТ ТИШЕ');snd90('alarm');trauma90(.25);{const n=Math.max(0,Math.min(3,6-G.enemies.filter(o=>o.alive&&o.type==='phago90').length));for(let i=0;i<n;i++)edgeSpawn('phago90',{delay:i*.25,ob96:1});}}}
function alarmCol90(k){return k<.5?mix90('#ffd36b','#ff9a4d',k*2):mix90('#ff9a4d','#d8364a',(k-.5)*2);}
// --- шлюзы ---
const LOCK90={open:14,warn:3,closed:8};
function lockCyc90(L){const E=G.x90&&G.x90.ev95;if(G.x90&&G.x90.fin96)return 'open';if(E&&E.k==='quar'&&E.t>0)return 'closed';const per=LOCK90.open+LOCK90.warn+LOCK90.closed,u=((G.x90.t+L.ph)%per+per)%per;return u<LOCK90.open?'open':u<LOCK90.open+LOCK90.warn?'warn':'closed';}
function lockGapOpen90(L){return L.st!=='closed';}
// стена шлюза: на ПК — вертикальная, на телефоне в портрете — горизонтальная; u — поперёк стены, v — вдоль
function lu90(L,x,y){return L.hz?y:x;}function lv90(L,x,y){return L.hz?x:y;}
function lockCross90(L,x0,y0,x1,y1){const u0=lu90(L,x0,y0),u1=lu90(L,x1,y1);if((u0-L.pos)*(u1-L.pos)>0)return false;const t=(L.pos-u0)/((u1-u0)||1e-6),v=lv90(L,x0,y0)+(lv90(L,x1,y1)-lv90(L,x0,y0))*t;if(lockGapOpen90(L)&&Math.abs(v-L.door)<90)return false;return true;}
function lockBlock90(a,b){const X=G.x90;if(!X||!X.locks.length||!a||!b||!inMission())return false;for(const L of X.locks)if(lockCross90(L,a.x,a.y,b.x,b.y))return true;return false;}
// враги обходят стену через дверь: цель — проём со своей стороны, у проёма — точка по ту сторону
function door90(e){const X=G.x90;if(!X||!inMission()||!X.locks.length||STATIC.has(e.type)||e.sbk||EDEF[e.type].passive)return null;const p=G.player;if(!p)return null;
  for(const L of X.locks){const ue=lu90(L,e.x,e.y),up=lu90(L,p.x,p.y);if((ue-L.pos)*(up-L.pos)>=0)continue;const side=ue<L.pos?-1:1,ve=lv90(L,e.x,e.y);
    const near=Math.abs(ue-(L.pos+side*34))<40&&Math.abs(ve-L.door)<60,tu=near?L.pos-side*60:L.pos+side*34;return L.hz?{x:L.door,y:tu}:{x:tu,y:L.door};}
  return null;}
function lockSet90(L,o,u){if(L.hz)o.y=u;else o.x=u;}
function lockPush90(o,px,py){const X=G.x90;if(!X)return;for(const L of X.locks){const hw=12+o.r,u=lu90(L,o.x,o.y),v=lv90(L,o.x,o.y);if(Math.abs(u-L.pos)>=hw)continue;const inGap=Math.abs(v-L.door)<90-o.r*.4;
    if(lockGapOpen90(L)&&inGap)continue;const pu=px!==undefined?lu90(L,px,py):u,side=pu<L.pos?-1:1;lockSet90(L,o,L.pos+side*hw);if(L.hz){if(o.vy&&Math.sign(o.vy)===-side)o.vy=0;}else if(o.vx&&Math.sign(o.vx)===-side)o.vx=0;}}
function lockTick90(X,dt){const p=G.player;for(const L of X.locks){const st=lockCyc90(L);
    if(st!==L.st){if(st==='warn'){snd90('lockw');if(!X.hint.lock){X.hint.lock=1;floater(L.x,L.dy-(L.hz?40:110),'ШЛЮЗ ЗАКРЫВАЕТСЯ · 3 С',C90.ark);}}
      if(st==='closed'){snd90('lock');trauma90(.08);
        if(p&&p.hp>0&&Math.abs(lu90(L,p.x,p.y)-L.pos)<12+p.r&&Math.abs(lv90(L,p.x,p.y)-L.door)<100){const side=lu90(L,p.x,p.y)<L.pos?-1:1;lockSet90(L,p,L.pos+side*(12+p.r+4));if(p.dashT<=0){damagePlayer(10);floater(p.x,p.y-30,'ЗАЖАЛО ШЛЮЗОМ',C90.red);}}
        for(const e of G.enemies){if(!e.alive||STATIC.has(e.type)||EDEF[e.type].passive||e.sbk)continue;if(Math.abs(lu90(L,e.x,e.y)-L.pos)<12+e.r&&Math.abs(lv90(L,e.x,e.y)-L.door)<100){const side=lu90(L,e.x,e.y)<L.pos?-1:1;lockSet90(L,e,L.pos+side*(14+e.r));hurt(e,e.maxHp*.25,{pulse:true});}}}
      if(st==='open')snd90('locko');L.st=st;}}
  for(const b of G.eb){if(b.life<=0||b.rift)continue;const px=b.x-b.vx*dt,py=b.y-b.vy*dt;for(const L of X.locks)if(lockCross90(L,px,py,b.x,b.y)){b.life=0;if(SET.fx)part(b.x,b.y,rnd(-40,40),rnd(-40,40),.2,C90.ark,2);break;}}
  for(const q of G.pick){if(q.px90!==undefined)for(const L of X.locks){if(lockCross90(L,q.px90,q.py90,q.x,q.y)){q.x=q.px90;q.y=q.py90;q.vx=q.vy=0;}}q.px90=q.x;q.py90=q.y;}}
// --- капсулы ---
function podTick90(X,dt){const p=G.player;if(!p)return;const wakeT=storyFlag('well38')==='silence'?2:1.5;
  for(const q of X.pods){if(q.st!=='sleep')continue;const d=Math.hypot(p.x-q.x,p.y-q.y);
    if(d<60&&p.hp>0){q.ch+=dt;if(q.ch>=wakeT)podWake90(q,'player');}else q.ch=Math.max(0,q.ch-dt*1.5);
    if(q.kby){const k=q.kby;if(!k.alive||k.wk90!==q){q.kby=null;q.kch=0;}else{q.kch+=dt;if(q.kch>=3)podWake90(q,'keeper');}}}}
function podWake90(q,by){const X=G.x90,p=G.player;if(q.st!=='sleep')return;q.ch=0;
  if(by==='player'){q.st='open';q.wakeT=G.t;podSet90(q.id,'w');const S=G.save;if(S&&G.mode==='world')S.lom+=60;floater(q.x,q.y-40,(q.child?'РЕБЁНОК ПРОСНУЛСЯ':'ПРОСНУЛСЯ')+' · +60 ЛОМА',C90.pil);sfx('cell');snd90('wake');conEvent('wake90');
    alarm90(15,1,q.x,q.y);hs90(.06,0);for(let i=0;i<(SET.fx?18:6);i++){const a=rnd(0,TAU);part(q.x,q.y,Math.cos(a)*rnd(40,140),Math.sin(a)*rnd(40,140),rnd(.4,.9),i%2?C90.pil:C90.ark,2);}
    if(!X.hint.pod){X.hint.pod=1;radioLine('КОВЧЕГ',C90.ark,'Пассажир '+q.id.slice(1).toUpperCase()+' проснулся раньше прибытия. Нарушение протокола.',.4);}}
  else{q.st='taken';const e=spawnEnemy('pass90',q.x,q.y+10,{noAffix:true,noLoot:true,spawnT:.5});e.pod90=q;e.life90=60;e.hostT=0;e.cd=1.2;X.pass.push(e);
    alarm90(6,1,q.x,q.y);floater(q.x,q.y-40,'РАЗБУЖЕН СИЛОЙ · ПАССАЖИР',C90.pil);snd90('wake');if(!X.hint.pass){X.hint.pass=1;floater(p.x,p.y-60,'ПАССАЖИР НА ВАШЕЙ СТОРОНЕ · НЕ ПОПАДИТЕ В НЕГО','#ffffff');}}}
// --- лужи Тромбов ---
function pud90K(e){const X=G.x90;if(!X||!X.pud.length)return 1;for(const q of X.pud)if((e.x-q.x)*(e.x-q.x)+(e.y-q.y)*(e.y-q.y)<q.r*q.r)return .65;return 1;}
function inPud90(x,y){const X=G.x90;if(!X)return false;for(const q of X.pud)if((x-q.x)*(x-q.x)+(y-q.y)*(y-q.y)<q.r*q.r)return true;return false;}
// --- нейросеть: минимальное остовное дерево по живым узлам ---
function net90(n){const nodes=n.nodes.filter(e=>e.alive);const key=nodes.map(e=>e.uid).join(',');if(key===n.key)return;n.key=key;const old=n.beams||[];n.beams=[];if(nodes.length<2)return;
  const inT=[nodes[0]];const rest=nodes.slice(1);while(rest.length){let bi=-1,bj=-1,bd=1e9;for(let i=0;i<inT.length;i++)for(let j=0;j<rest.length;j++){const d=Math.hypot(inT[i].x-rest[j].x,inT[i].y-rest[j].y);if(d<bd){bd=d;bi=i;bj=j;}}
    const a=inT[bi],b=rest[bj];const o=old.find(q=>q.a===a&&q.b===b||q.a===b&&q.b===a);n.beams.push({a,b,cut:o?o.cut:0});inT.push(b);rest.splice(bj,1);}}
function netTick90(X,dt){for(const n of X.nets){net90(n);for(const q of n.beams)if(q.cut>0)q.cut-=dt;if(typeof netImp95==='function')netImp95(n,dt);let w=null;for(const e of n.nodes)if(e.alive&&(!w||e.hp<w.hp))w=e;for(const e of n.nodes)e.weak90=e===w&&n.nodes.filter(o=>o.alive).length>1;}
  X.nets=X.nets.filter(n=>n.nodes.some(e=>e.alive));}
function buffs90(){const N=nets90();if(!N||!N.length)return;const B=[];for(const n of N)for(const q of n.beams)if(!(q.cut>0)&&q.a.alive&&q.b.alive&&q.a.spawnT<=0&&q.b.spawnT<=0)B.push(q);if(!B.length)return;
  for(const o of G.enemies){if(!o.alive||o.type==='neuron90'||STATIC.has(o.type)||EDEF[o.type].passive||o.sbk)continue;for(const q of B){if(segDist(q.a.x,q.a.y,q.b.x,q.b.y,o.x,o.y)<220){o.buff=Math.max(o.buff,1.2);o.nb90=.2;break;}}}}
// --- тик миссии ---
function t90Tick(dt){const X=G.x90;if(!X||!inMission())return;const p=G.player;X.t+=dt;feel90(dt);mod90Tick(dt);capEarly96();rescue96(dt);fin96Tick(X);
  if(G.state!=='play'){clearHud100();return;}
  if(X.sec===8)ark90Tick(X,dt);else if(X.sec===9&&typeof t100Tick==='function')t100Tick(X,dt);else if(X.sec>=10&&typeof t110Tick==='function')t110Tick(X,dt);
  if(X.nets.length)netTick90(X,dt);
  for(const e of G.enemies){if(!e.alive)continue;if(e.nb90>0){e.nb90-=dt;if(e.cd>0)e.cd-=dt*.25;}}
  if(typeof t95Tick==='function')t95Tick(dt);capEarly96();
  seen90Tick(dt);hud90();}
function ark90Tick(X,dt){const p=G.player;geo90(X);
  for(const f of X.flows){if(f.shut>0)f.shut-=dt;f.closed=!!(f.valve&&f.valve.alive&&f.valve.vi===3);}
  if(X.flows.length){const str=.85+.15*beat90(G.t);for(const e of G.enemies){if(!e.alive||STATIC.has(e.type)||EDEF[e.type].passive||e.sbk||e.spawnT>0)continue;const q=flowQ(e.x,e.y,X);if(q){e.x+=q.tx*120*q.k*str*dt;e.y+=q.ty*120*q.k*str*dt;}}
    for(const it of G.pick){if(it.story||it.k==='frag100')continue;const q=flowQ(it.x,it.y,X);if(q){it.x+=q.tx*90*q.k*dt;it.y+=q.ty*90*q.k*dt;it.x=clamp(it.x,10,W-10);it.y=clamp(it.y,10,H-10);}}}
  for(const q of X.pud)q.t-=dt;X.pud=X.pud.filter(q=>q.t>0);
  if(X.locks.length){lockTick90(X,dt);for(const e of G.enemies){if(!e.alive||STATIC.has(e.type)||e.sbk)continue;lockPush90(e,e.x-e.vx*dt,e.y-e.vy*dt);}}
  if(X.pods.length)podTick90(X,dt);
  if(X.alarmOn&&G.endT<=0&&p&&p.hp>0){const quiet=G.t-(G.lastFire90||-9)>1.5,calm=quiet&&!G.enemies.some(e=>e.alive&&!EDEF[e.type].passive&&targetable(e));const aP=X.alarm;X.alarm=clamp(X.alarm+(calm?-5:quiet?-2.5:.5*X.alarmK)*dt,0,100);if(X.al90T>0)X.al90T-=dt;alarm90(0,0,undefined,undefined,aP);
    if(X.ph30&&G.waveIdx<G.waves.length){X.ph30=0;const nx=G.waves[G.waveIdx];if(nx)nx.push('phago90');}
    const sp=X.stage>=2&&X.alarm>=60;for(const e of G.enemies){if(!e.alive||STATIC.has(e.type)||EDEF[e.type].passive||e.sbk)continue;e.tK=sp?1.1:(e.tK===1.1?1:e.tK);}
    X.alarmV+=(X.alarm-X.alarmV)*Math.min(1,dt*4);}}
// --- движение корабля: поток, лужи, шлюзы ---
function drift90(p,dt){const X=G.x90;if(!X||!inMission()){if(G.world&&typeof drift95==='function')drift95(p,dt);return;}
  if(X.sec===8){geo90(X);
    if(X.flows.length){const q=flowQ(p.x,p.y,X);
      if(G.dashId!==X.dashId){X.dashId=G.dashId;if(p.dashT>0&&q&&p.dx*q.tx+p.dy*q.ty>.6){p.dashT*=1.5;p.dashCd*=.8;if(!X.hint.flowDash){X.hint.flowDash=1;floater(p.x,p.y-36,'ПО ТЕЧЕНИЮ · РЫВОК ×1,5',C90.ark);}snd90('flow');}}
      if(q&&p.dashT<=0){const s=160*q.k*(.85+.15*beat90(G.t));p.x+=q.tx*s*dt;p.y+=q.ty*s*dt;if(!X.hint.flow){X.hint.flow=1;floater(p.x,p.y-36,'КРОВОТОК · СНОСИТ',C90.ark);}}}
    if(X.pud.length&&p.dashT<=0&&inPud90(p.x,p.y)){p.x=p.px+(p.x-p.px)*.6;p.y=p.py+(p.y-p.py)*.6;if(!X.hint.pud2){X.hint.pud2=1;floater(p.x,p.y-30,'ЛУЖА · ВЯЗКО',C90.red);}}
    if(X.locks.length)lockPush90(p,p.px,p.py);
    if(p.dashT>0&&X.nets.length){for(const n of X.nets)for(const q of n.beams){if(q.cut>0||!q.a.alive||!q.b.alive)continue;if(segInter(p.px,p.py,p.x,p.y,q.a.x,q.a.y,q.b.x,q.b.y)){q.cut=4;if(G.mc)G.mc.cut90=(G.mc.cut90||0)+1;floater((q.a.x+q.b.x)/2,(q.a.y+q.b.y)/2-20,'СВЯЗЬ ПОРВАНА · 4 С',C90.ark);snd90('cut');hs90(.06,0);}}}}
  else if(X.sec===9&&typeof drift100==='function')drift100(X,p,dt);
  if(typeof drift95==='function')drift95(p,dt);
  p.x=clamp(p.x,p.r,BW-p.r);p.y=clamp(p.y,p.r,BH-p.r);}
// --- снаряды игрока (true — поглощён) ---
function b90Hit(b){if(typeof b95Hit==='function'&&b95Hit(b))return true;const X=G.x90;if(!X||!inMission())return false;
  if(X.locks.length){for(const L of X.locks)if(lockCross90(L,b.px,b.py,b.x,b.y)){b.life=0;sfx('block');if(SET.fx)part(b.x,b.y,rnd(-60,60),rnd(-60,60),.2,C90.ark,2);return true;}}
  a90Pass(b);
  if(!b.charged&&!b.blast&&!b.al90){for(const e of G.enemies){if(e.type!=='phago90'||!e.alive||e.spawnT>0||e.burst90||e.spir95||e.nos95>0||b.hit.includes(e))continue;if(segDist(b.px,b.py,b.x,b.y,e.x,e.y)<e.r+3){b.life=0;b.hit.push(e);phagoEat90(e,b.dmg);return true;}}}
  if(X.sec===9&&typeof b100Hit==='function'&&b100Hit(b,X))return true;
  return false;}
function a90Pass(bu){if(!bu.al90&&!bu.a85)return;for(const e of G.enemies){if(!e.alive||(e.type!=='pass90'&&e.type!=='witness100')||bu.hit.includes(e))continue;if(segDist(bu.px,bu.py,bu.x,bu.y,e.x,e.y)<e.r+8)bu.hit.push(e);}}
function phagoEat90(e,dmg){e.fed=(e.fed||0)+1;e.r=Math.min(30,EDEF.phago90.r+e.fed*1.5);(e.eat95||(e.eat95=[])).push({a:rnd(0,TAU),d:rnd(.2,.6)});e.flash=.06;sfx('hit');snd90('blop',e.fed);hurt(e,dmg*.5,{phago:true});
  if(e.alive&&e.fed>=10&&!e.burst90){e.burst90=.5*tel90('phago90');floater(e.x,e.y-e.r-12,'ЛОПНЕТ!',C90.blood);}
  if(!G.x90.hint.phago){G.x90.hint.phago=1;floater(e.x,e.y-e.r-26,'ГЛОТАЕТ СНАРЯДЫ · ЗАРЯД ×1,5','#ff8a5c');}}
// --- импульс ---
function pulse90(p,R){const X=G.x90;if(!X||!inMission()){if(G.world&&typeof pulse95==='function')pulse95(p,R);return;}
  if(X.sec===8){for(const v of G.enemies){if(v.type!=='valve90'||!v.alive)continue;if(Math.hypot(v.x-p.x,v.y-p.y)<160+R*.2){if(v.flow90){v.flow90.shut=8;floater(v.x,v.y-36,'ПОТОК ЗАГЛУШЁН · 8 С',C90.ark);}v.vb=(v.vb||0)+.6;v.vi=0;snd90('valve');}}}
  for(const e of G.enemies){if(!e.alive)continue;const d=Math.hypot(e.x-p.x,e.y-p.y);if(d>R+e.r)continue;
    if(e.type==='clot90'){clotDissolve90(e);continue;}
    if(e.type==='phago90'&&!e.spir95){e.fed=0;e.r=EDEF.phago90.r;e.burst90=0;const a=Math.atan2(e.y-p.y,e.x-p.x);e.vx=Math.cos(a)*420;e.vy=Math.sin(a)*420;e.orbK=0;}
    if(e.type==='echo100'){kill(e);floater(e.x,e.y-20,'ЭХО СТЁРТО',C90.sh);}
    if(e.type==='hollow100'){e.rev100=4;}
    if(e.type==='witness100'){e.sh100=3;floater(e.x,e.y-24,'ЩИТ · 3 С','#ffffff');}}
  for(const q of X.pud)if(Math.hypot(q.x-p.x,q.y-p.y)<R+q.r){q.t=Math.min(q.t,.4);conEvent('drain90');}
  if(X.sec>=9&&typeof pulse100==='function')pulse100(X,p,R);
  if(typeof pulse95==='function')pulse95(p,R);}
function clotDissolve90(e){if(!e.alive)return;e.dis90=1;kill(e);floater(e.x,e.y-20,'РАСТВОРЁН',C90.warm);if(G.mc)G.mc.clot90=(G.mc.clot90||0)+1;conEvent('drain90');snd90('dissolve');}
// --- автоприцел и цели ---
function targ90(e){if(e.hid90&&!(e.rev100>0)&&!(e.vis100>0)&&!(G.player&&Math.hypot(e.x-G.player.x,e.y-G.player.y)<220))return false;const X=G.x90;if(!X||!inMission())return true;
  if(X&&X.locks.length&&G.player&&lockBlock90(G.player,e))return false;
  if(X&&X.sec===9&&typeof targ100==='function'&&!targ100(e,X))return false;
  if(typeof targ95==='function'&&!targ95(e))return false;
  return true;}
function aw90(e){switch(e.type){case 'neuron90':return e.weak90?1/1.35:1/1.2;case 'fixer100':return 1/1.4;case 'noname100':return (e.look||0)>3?1/.6:1;case 'keeper90':return e.st==='alert'?.9:1;}return 1;}

