// ===== 0.7.0: Арсенал «Иней» — прокачка орудия и второе оружие =====
const ARS={
  gun:{name:'ОРУДИЕ',d:'Основное орудие: быстрый одиночный снаряд, работает с пробитием, рикошетом и сдвоенным стволом.',tracks:{
    pow:{name:'СИЛА',k:[1.2,1.3,1.4],cost:[2000,3000,4000]},rate:{name:'ТЕМП',k:[1.1,1.2,1.3],cost:[1500,2500,3500]}}},
  blast:{name:'РАЗРЫВ',price:5000,d:'Снаряд не бьёт в точку, а детонирует при касании: урон всем в радиусе, сильнее в центре. Темп ниже, пробитие и рикошет не действуют.',tracks:{
    pow:{name:'МОЩНОСТЬ',k:[1.2,1.3,1.4],cost:[2000,3000,4000]},rad:{name:'РАДИУС',k:[1.15,1.2,1.25],cost:[1500,2500,3500]}}}};
const BOSS_TROPHY={14:2000,18:3000,22:4000,27:5000,31:6000,38:7000,42:8000,46:9000,50:10000};
function arsDef(){return {weapon:'gun',own:{gun:1,blast:0},lv:{gun:{pow:0,rate:0},blast:{pow:0,rad:0}}};}
function arsMul(w,t,n){const k=ARS[w].tracks[t].k;let m=1;for(let i=0;i<Math.min(n||0,k.length);i++)m*=k[i];return m;}
function arsK(w,t){const S=G.save;if(G.mode!=='world'||!S||!S.ars||!S.ars.lv[w])return 1;return arsMul(w,t,S.ars.lv[w][t]||0);}
function arsWeapon(){const S=G.save;return G.mode==='world'&&S&&S.ars&&S.ars.weapon==='blast'&&S.ars.own.blast?'blast':'gun';}
function arsOpen(){const S=G.save;return !!(S&&S.medals&&S.medals[14]&&S.medals[14].clear);}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function newSave(){const n=WORLD.nodes[0];return{v:2,wv:2,pilot:{lvl:1,xp:0},ownSkins:['base'],contracts:{list:[],done:0},cycle:1,rocksGone:[],zonesDone:{},bestDiff:{},diff:'easy',cleared:0,medals:{},lom:0,carry:0,perks:{},skins:['base'],skin:'base',found:{},journals:{},anomalies:{},relays:{},gate:false,reveal:'',
  pos:{x:n.x-260,y:n.y+90},last:{x:n.x-260,y:n.y+90},run:{mods:{},lvl:1,xp:0,need:need(1),hp:100,en:0,score:0,kills:0,taken:0},replays:{},lost:null,best:{},intro:false};}
function validSave(S){return !!S&&typeof S==='object'&&!Array.isArray(S)&&(S.v===1||S.v===2)&&!!S.run&&typeof S.run==='object'&&Number.isFinite(+S.cleared)&&!!S.pos&&typeof S.pos==='object'&&!!S.medals&&typeof S.medals==='object';}
function saveWorld(){
  const S=G.save;if(!S)return;const p=G.player;
  if(G.world&&p&&p.hp>0)S.pos={x:Math.round(p.x),y:Math.round(p.y)};
  if(G.fog)S.reveal=Array.from(G.fog).join('');
  S.run={mods:{...G.mods},lvl:G.lvl,xp:G.xp,need:G.need,hp:p?Math.max(1,Math.round(p.hp)):100,en:p?p.en:0,score:G.score,kills:G.kills,taken:G.taken};
  store(saveKey(),S);
}
// 1.0.0 α: туман войны. Миссия открыта, только если пройдена предыдущая. Сектор закрыт туманом, пока не пройдена последняя миссия
// предыдущего сектора; стена тумана на всю высоту мира не пускает за кромку (облететь сверху нельзя). Сектор II — ещё и ворота с двумя замками.
function openAllNow(){return ALPHA_OPEN||G.mode==='dev'||!!(window.DEVW&&DEVW.on&&DEVW.on());}
function progDone(m){const S=G.save;if(!S||!m)return false;if(m<=CORE&&+S.cleared>=m)return true;if(S.medals&&S.medals[m]&&S.medals[m].clear)return true;return m===49&&!!(S.story&&S.story.zero49);}
function secOfM(m){if(m<=6)return 0;if(m<=CORE)return 1;const n=WORLD.nodes[m-1];return n&&n.sec!==undefined?n.sec:1;}
const SEC_LAST={};function secLastM(i){if(SEC_LAST[i]!==undefined)return SEC_LAST[i];let r=0;for(const n of WORLD.nodes)if(secOfM(n.m)===i)r=Math.max(r,n.m);return SEC_LAST[i]=r;}
function secSeen(i){if(openAllNow()||i<=0)return true;if(i===1)return progDone(6);if(i===11)return zeroOpen110();return progDone(secLastM(i-1));}
function secOpen(i){return secSeen(i)&&(i!==1||openAllNow()||gateOpen());}
const FOGC={k:null};
function fogMemo(){const S=G.save;let nc=0;if(S&&S.medals)for(const k in S.medals)if(S.medals[k]&&S.medals[k].clear)nc++;
  const k=S?[openAllNow()?1:0,S.cleared,S.gate?1:0,nc,S.story&&S.story.zero49?1:0,G.dev&&G.devZero110?1:0].join('|'):'-';if(FOGC.k===k&&FOGC.s===S)return FOGC;
  FOGC.k=k;FOGC.s=S;const by=f=>{if(!S||openAllNow()||!WORLD.sectors)return Infinity;for(let i=1;i<=10;i++)if(!f(i))return i===1?5000:WORLD.sectors[i].box[0];return Infinity;};
  FOGC.x=by(secOpen);FOGC.sx=by(secSeen);FOGC.z=!S||secSeen(11);FOGC.i=-1;for(let i=1;i<=10;i++)if(!secOpen(i)){FOGC.i=i;break;}return FOGC;}
function fogX(){return fogMemo().x;}
function fogSeeX(){return fogMemo().sx;}
function fogSec(){return fogMemo().i;}
function fogClosedAt(x,y){const F=fogMemo();if(x>=F.sx)return true;return !F.z&&inXII110(x,y);}
function fogBlockedAt(x,y){const F=fogMemo();if(x>=F.x)return true;return !F.z&&inXII110(x,y);}
function fogHint(i){return i===1?(progDone(6)?'УНИЧТОЖЬТЕ ДВА ЗАМКА ВОРОТ':'ПРОЙДИТЕ МИССИЮ 06'):'СЕКТОР '+roman(i+1)+' · ПРОЙДИТЕ МИССИЮ '+pad2(secLastM(i-1));}
function nodeState(m){const S=G.save;if(progDone(m))return 'done';if(openAllNow())return 'open';
  if(m>1&&!progDone(m-1))return 'locked';if(m===7&&!S.gate)return 'locked';return secOpen(secOfM(m))?'open':'locked';}
// стена: держит только пересечение кромки (корабль, уже оказавшийся за ней, не перебрасывает через полмира)
function fogWall(p){if(!p||openAllNow()||p.px===undefined)return;const fx=fogX();if(fx===Infinity)return;const L=fx-p.r;
  if(p.x>L&&p.px<=L+1){p.x=L-1;p.vx=-Math.abs(p.vx)*.4-90;p.dashT=0;const i=fogSec();hintOnce(i===1?'gate':'fog'+i,i===1?(G.save.cleared>=6?'ВОРОТА ЗАПЕРТЫ · УНИЧТОЖЬТЕ ДВА ЗАМКА':'ВОРОТА СЕКТОРА · СНАЧАЛА ЯДРО СТРАЖА'):'ТУМАН ВОЙНЫ · '+fogHint(i),i===1?'#b48cff':'#9fb0c4');}}
// старые сохранения альфы: ворота II, если уже пройдены миссии за ними; корабль не стоит в закрытом тумане
function fogFix(S){if(!S||openAllNow())return;if(!S.gate&&WORLD.nodes.some(n=>n.m>=7&&progDone(n.m)))S.gate=true;
  if(S.pos&&fogBlockedAt(S.pos.x,S.pos.y)){let bn=WORLD.nodes[0];for(const n of WORLD.nodes)if(nodeState(n.m)!=='locked'&&!fogBlockedAt(n.x,n.y))bn=n;S.pos={x:bn.x,y:bn.y+160};S.last={...S.pos};}}
function fogDraw(t){if(openAllNow()||!G.save||!G.player)return;const F=fogMemo(),p=G.player,mob=isMob(),vx0=CX-80,vx1=CX+W+80,vy0=CY-80,vy1=CY+H+80;
  const wall=(ax,ay,bx,by,dir,txt)=>{const E=dir==='x'?860:720;
    const L=Math.max(dir==='x'?ax-E:ax,vx0),R_=Math.min(bx,vx1),T_=Math.max(dir==='y'?ay-E:ay,vy0),B_=Math.min(by,vy1);if(L>=R_||T_>=B_)return;
    const gr=dir==='x'?ctx.createLinearGradient(ax-E,0,ax,0):ctx.createLinearGradient(0,ay-E,0,ay);
    // плавная S-кривая (smootherstep по 13 точкам): к границе сектора мгла полная, обрыва нет
    for(let q=0;q<=12;q++){const u=q/12,a=u*u*u*(u*(u*6-15)+10);gr.addColorStop(u,'rgba(3,5,11,'+(a*.985).toFixed(3)+')');}ctx.fillStyle=gr;ctx.fillRect(L,T_,R_-L,B_-T_);
    if(SET.fx){const st=mob?420:260;const puff=(cx,cy,r)=>{const rg=ctx.createRadialGradient(cx,cy,0,cx,cy,r);rg.addColorStop(0,'rgba(3,5,11,.55)');rg.addColorStop(1,'rgba(3,5,11,0)');ctx.fillStyle=rg;ctx.fillRect(cx-r,cy-r,r*2,r*2);};
      if(dir==='x'){for(let y=Math.floor(T_/st)*st;y<B_+st;y+=st){const k=y/st;puff(ax-60+Math.sin(t*.25+k*1.7)*70,y+Math.sin(t*.2+k)*60,170+50*Math.sin(t*.4+k*2.3));}}
      else{for(let x=Math.floor(L/st)*st;x<R_+st;x+=st){const k=x/st;puff(x+Math.sin(t*.2+k)*60,ay-50+Math.sin(t*.25+k*1.7)*60,170+50*Math.sin(t*.4+k*2.3));}}}
    if(dir==='x'?Math.abs(p.x-ax)<1000:Math.abs(p.y-ay)<1000){const hw=(mob?95:125)/SC,lx=clamp(dir==='x'?ax+190:p.x,CX+hw+8/SC,CX+W-hw-8/SC),ly=dir==='x'?clamp(p.y-40,T_+60,B_-60):ay+130;
      worldLabel(lx,ly,'ТУМАН ВОЙНЫ','#9fb0c4');worldLabel(lx,ly+18,mob?txt.replace(/^СЕКТОР [IVXL]+ · /,''):txt,'#6f8096');}};
  const i=F.sx===Infinity?-1:(()=>{for(let k=1;k<=10;k++)if(!secSeen(k))return k;return -1;})();
  if(i>0)wall(F.sx,0,WW,WH,'x',fogHint(i));
  if(!F.z&&F.sx>WORLD.sectors[11].box[0]){const b=WORLD.sectors[11].box;wall(b[0],b[1],b[2],b[3],'y','СЕКТОР XII · ПРОЙДИТЕ МИССИЮ 49');}}
const medalCount=md=>md?(md.clear?1:0)+(md.clean?1:0)+(md.master?1:0):0;
function totalMedals(){let s=0;for(const k in G.save.medals)s+=medalCount(G.save.medals[k]);return s;}
const AUNIT=250;
const fmtAU=d=>{const v=d/AUNIT;return v<1?'рядом':Math.round(v)+' а.е.';};
const inView=(x,y,r)=>x+r>CX&&x-r<CX+W&&y+r>CY&&y-r<CY+H;

function genWorld(){
  const R=mulberry(1337),rr=(a,b)=>a+R()*(b-a);
  const pois=[WORLD.hangar,WORLD.abyss,WORLD.arsenal,...WORLD.nodes,...WORLD.shops,...WORLD.relays,...WORLD.caches,...(WORLD.journals0||WORLD.journals),...WORLD.anomalies,WORLD.gate];
  const ok=(x,y)=>pois.every(q=>Math.hypot(q.x-x,q.y-y)>150)&&Math.abs(x-5000)>170&&WORLD.locks.every(([lx,ly])=>Math.hypot(lx-x,ly-y)>120);
  const rocks=[];
  const add=(x,y,r)=>{if(x<60||y-OY<60||x>WW0-60||y-OY>WH0-60||!ok(x,y))return;const n=9,v=[];for(let i=0;i<n;i++)v.push(r*rr(.75,1.1));rocks.push({id:rocks.length,x,y,vx:0,vy:0,r,hp:r>25?60:25,v,rot:rr(0,TAU),vr:rr(-.3,.3),alive:true,tow:null,flung:false,hitF:0});};
  for(const f of WORLD.fields)for(let i=0;i<f.n;i++){const a=rr(0,TAU),d=Math.sqrt(R())*f.r;add(f.x+Math.cos(a)*d,f.y+Math.sin(a)*d,rr(18,38));}
  for(let i=0;i<90;i++)add(rr(100,WW0-100),OY+rr(100,WH0-100),rr(16,34));
  const decor=[];const cols=['#46288c','#145082','#781e46','#1e6e8c'];for(let i=0;i<46;i++)decor.push({x:rr(0,WW0),y:OY+rr(0,WH0),r:rr(500,1300),col:cols[i%4],a:rr(.1,.22)});
  // новые сектора: свои обломки (id с 100000) и туманности
  {const R2=mulberry(4242),r2=(a,b)=>a+R2()*(b-a);let id=100000;
    for(const f of WORLD.fields2)for(let i=0;i<f.n;i++){const a=r2(0,TAU),d=Math.sqrt(R2())*f.r,x=f.x+Math.cos(a)*d,y=f.y+Math.sin(a)*d,r=r2(18,38);if(WORLD.nodes.some(q=>Math.hypot(q.x-x,q.y-y)<180))continue;const v=[];for(let k=0;k<9;k++)v.push(r*r2(.75,1.1));rocks.push({id:id++,x,y,vx:0,vy:0,r,hp:r>25?60:25,v,rot:r2(0,TAU),vr:r2(-.3,.3),alive:true,tow:null,flung:false,hitF:0});}
    for(const sc of WORLD.sectors.slice(2))for(let i=0;i<6;i++)decor.push({x:r2(sc.box[0],sc.box[2]),y:r2(sc.box[1],sc.box[3]),r:r2(600,1400),col:sc.col,a:r2(.05,.1)});}
  const gone=new Set((G.save&&G.save.rocksGone)||[]);G.wrocks=rocks.filter(r=>!gone.has(r.id));G.rockTotal=rocks;G.decor=decor;w58Gen();G.zones=WORLD.zones.filter(z=>!z.w58).map((z,i)=>({...z,idx:i,active:false,cool:0,n:0}));G.wgen=true;
}
function loadFog(){G.fogVer=(G.fogVer||0)+1;G.fog=new Uint8Array(FGW*FGH);const s=G.save.reveal||'';for(let i=0;i<G.fog.length&&i<s.length;i++)G.fog[i]=s[i]==='1'?1:0;}
function revealAround(x,y,R){const c0=Math.max(0,Math.floor((x-R)/FOG)),c1=Math.min(FGW-1,Math.floor((x+R)/FOG)),r0=Math.max(0,Math.floor((y-R)/FOG)),r1=Math.min(FGH-1,Math.floor((y+R)/FOG));
  for(let j=r0;j<=r1;j++)for(let i=c0;i<=c1;i++){const cx=(i+.5)*FOG,cy=(j+.5)*FOG;if(Math.hypot(cx-x,cy-y)<R+FOG*.5&&!G.fog[j*FGW+i]&&!fogClosedAt(cx,cy)){G.fog[j*FGW+i]=1;G.fogVer=(G.fogVer||0)+1;}}}
const revealedAt=(x,y)=>!!G.fog&&G.fog[clamp(Math.floor(y/FOG),0,FGH-1)*FGW+clamp(Math.floor(x/FOG),0,FGW-1)]===1&&!fogClosedAt(x,y);
function camSnap(){const p=G.player;CX=clamp(p.x-W/2,0,Math.max(0,WW-W));CY=clamp(p.y-H/2,0,Math.max(0,WH-H));}
function camFollow(dt){const p=G.player;let lx=0,ly=0;if(aimManual()){const m=mouseWorld();lx=clamp((m.x-p.x)*.15,-80,80);ly=clamp((m.y-p.y)*.15,-80,80);}const tx=clamp(p.x-W/2+p.vx*.22+lx,0,Math.max(0,WW-W)),ty=clamp(p.y-H/2+p.vy*.22+ly,0,Math.max(0,WH-H));const k=Math.min(1,dt*5*(/*DEVW*/window.DEVW&&DEVW.on()&&G.world?Math.max(1,DEVW.spd()):1));CX+=(tx-CX)*k;CY+=(ty-CY)*k;}



