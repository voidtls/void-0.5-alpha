// ---------- Инвентаризатор ----------
function invInit(b){b.cells=[];for(let i=0;i<6;i++)b.cells.push({i,e:null,t:0,label:null,open:0,locked:false});
  b.beams=[{a:rnd(0,TAU),dir:Math.random()<.5?1:-1,acc:0}];b.crysT=3.5;b.invT=storyFlag('arcSilence')?12:7;b.inv=null;b.copyT=5;b.ring=null;b.seals=[];b.sealT=0;b.cores=null;}
function invCellPos(b,i){const a=b.t*.5+i/6*TAU;return {x:b.x+Math.cos(a)*96,y:b.y+Math.sin(a)*72};}
function invSpawnCell(b,c){const q=invCellPos(b,c.i);c.e=spawnEnemy('invcell',q.x,q.y,{noAffix:true,noLoot:true,spawnT:.8,cell:c});c.e.hp=c.e.maxHp=Math.round(160*sbRank());c.label=null;c.locked=false;c.open=0;}
function invMoveCells(b){for(const c of b.cells){if(c.e&&c.e.alive){const q=invCellPos(b,c.i);c.e.x=q.x;c.e.y=q.y;c.e.vx=c.e.vy=0;}}}
function invCellDied(e){const b=G.sb,c=e.cell;if(!b||!c||b.sbk!=='inv')return;c.e=null;c.t=sbHard()?12:15;if(b.st==='dying')return;
  if(c.label&&b.inv){const L=c.label;b.inv.saved.push(L);c.label=null;floater(e.x,e.y-20,L+' · СИСТЕМА СПАСЕНА','#dff6ff');for(const o of b.inv.cs)if(o!==c&&o.label)o.locked=true;}
  c.label=null;c.locked=false;if(b.st==='fight'){b.open=Math.max(b.open,6);floater(b.x,b.y-b.r-16,'КОРПУС ОТКРЫТ · 6 С','#dff6ff');if(Math.random()<.55)dropCell(e.x,e.y,0);}sfx('level');}
function invCoreDied(e){const b=G.sb;if(!b||b.sbk!=='inv'||b.st!=='final'||b.choice)return;sbChoose(b,e.core);}
function invLock(sys){const p=G.player;if(sys==='ЩИТ'){G.lockShield=8;p.shieldUp=false;p.shieldT=0;}else if(sys==='РЫВОК')G.lockDash=8;else G.lockGun=8;
  floater(p.x,p.y-30,sys+' · ПРИНЯТО НА ХРАНЕНИЕ · 8 С','#8fd8ff');sfx('block');}
function invCopy(b){const p=G.player,hard=sbHard();let path=null;const log=G.posLog.filter(q=>G.t-q.t<=3);
  if(log.length>=4){let len=0;for(let i=1;i<log.length;i++)len+=Math.hypot(log[i].x-log[i-1].x,log[i].y-log[i-1].y);if(len>=120)path=log.map(q=>({x:q.x,y:q.y,t:q.t-log[0].t}));}
  if(!path){const a0=rnd(0,TAU),R_=250,dir=Math.random()<.5?1:-1;path=[];for(let i=0;i<=24;i++){const a=a0+dir*i/24*1.6;path.push({x:clamp(p.x+Math.cos(a)*R_,20,W-20),y:clamp(p.y+Math.sin(a)*R_,20,H-20),t:i/24*3});}}
  const skin=COPY_SKINS[Math.floor(Math.random()*COPY_SKINS.length)];
  const c=spawnEnemy('icecopy',path[0].x,path[0].y,{path,pt:0,noAffix:true,noLoot:true,spawnT:1,fire:true,frate:Math.max(.5,G.st.rate*2)*atkK(),fdmg:clamp(G.st.dmg*.5,6,22),skin,hull:HULL_NUM[skin]||''});c.contact=14;
  const alive=b.cells.filter(x=>x.e&&x.e.alive&&x.e.spawnT<=0);if(alive.length){const cc=alive[Math.floor(Math.random()*alive.length)];cc.open=5;floater(cc.e.x,cc.e.y-18,'ЯЧЕЙКА ОТКРЫТА · УРОН В КОРПУС ×2','#dff6ff');}
  floater(c.x,c.y-22,'ЗАПИСЬ ЦИКЛА · VØID-'+(c.hull||'0??'),'#8fd8ff');sfx('warn');}
function updateInv(b,dt){const p=G.player,hard=sbHard();if(sbCommon(b,dt))return;sbEscort(b,dt);
  if(b.st==='enter'){b.y+=(H*.24-b.y)*Math.min(1,dt*1.4);b.timer-=dt;if(b.timer<=0){b.st='fight';for(const c of b.cells)invSpawnCell(b,c);}invMoveCells(b);return;}
  if(b.st==='final'){b.timer-=dt;invMoveCells(b);if(b.cores)b.cores.forEach((c,i)=>{if(c.alive){c.x=b.x+(i?84:-84);c.y=b.y+46;}});if(b.timer<=0)sbTimeout(b);return;}
  // движение
  if(b.phase<3){const tx=W/2+Math.sin(b.t*.3)*W*.28,ty=H*.22+Math.sin(b.t*.6)*H*.06,k=Math.min(1,dt*.6);b.x+=(tx-b.x)*k;b.y+=(ty-b.y)*k;}
  else{const k=Math.min(1,dt*.8);b.x+=(W/2-b.x)*k;b.y+=(H*.42-b.y)*k;}
  invMoveCells(b);
  for(const c of b.cells){if(c.open>0)c.open-=dt;if(c.e&&!c.e.alive)c.e=null;if(!c.e){c.t-=dt;if(c.t<=0)invSpawnCell(b,c);}
    else if(c.e.spawnT<=0&&p.hp>0&&b.inv0<=0){c.cd=(c.cd===undefined?rnd(1.5,4):c.cd)-dt;if(c.cd<=0&&onScreen(c.e)){c.cd=(b.phase===3?rnd(2.6,3.4):rnd(3.2,4.4))*atkK();const a=Math.atan2(p.y-c.e.y,p.x-c.e.x)+rnd(-.06,.06);const q=shootE(c.e.x,c.e.y,a,175,8,'#bfe8ff',5);if(q){q.frost=true;q.boss=true;}}}}
  // инвентаризация
  if(!b.inv){b.invT-=dt;if(b.invT<=0){const alive=b.cells.filter(c=>c.e&&c.e.alive&&c.e.spawnT<=0);
      if(alive.length>=2){const sys=shuffle(['ЩИТ','РЫВОК','ОРУДИЕ']).slice(0,2),cs=shuffle(alive.slice()).slice(0,2);cs[0].label=sys[0];cs[1].label=sys[1];
        b.inv={t:4,saved:[],cs};banner('ИНВЕНТАРИЗАЦИЯ · '+sys.join(' / '),'РАЗБЕЙТЕ ЯЧЕЙКУ С НУЖНОЙ СИСТЕМОЙ · 4 С');sfx('warn');b.invT=hard?9:12;}
      else b.invT=2;}}
  else{const I=b.inv;I.t-=dt;if(I.t<=0){for(const c of I.cs){if(c.label&&c.e&&c.e.alive)invLock(c.label);c.label=null;c.locked=false;}b.inv=null;}}
  // индекс-лучи
  for(const B of b.beams){B.a+=B.dir*(b.phase===3?.61:.436)*dt;
    if(p.hp>0&&p.dashT<=0){const dx=p.x-b.x,dy=p.y-b.y,d=Math.hypot(dx,dy);if(d<520&&Math.abs(angDiff(Math.atan2(dy,dx),B.a))<.52){B.acc+=dt;if(B.acc>=.7){B.acc=0;addIce(1);}}else B.acc=0;}}
  // кристаллы
  b.crysT-=dt;if(b.crysT<=0&&p.hp>0){b.crysT=(b.phase===3?2.2:b.phase===2?2.6:3)*atkK();const n=b.phase===3?7:5,a0=Math.atan2(p.y-b.y,p.x-b.x);
    for(let i=0;i<n;i++){const q=shootE(b.x,b.y,a0+(i-(n-1)/2)*.17,190,10,'#bfe8ff',6);if(q){q.frost=true;q.boss=true;}}}
  // фаза 2: записи циклов
  if(b.phase>=2){b.copyT-=dt;if(b.copyT<=0){b.copyT=(hard?7:9)*atkK();if(G.enemies.filter(e=>e.alive&&e.type==='icecopy').length<(hard?4:3))invCopy(b);}}
  // фаза 3: консервация
  if(b.phase===3&&b.ring){const R_=b.ring;R_.r=Math.max(170,R_.r-14*dt);
    b.sealT-=dt;if(b.seals.length<3&&b.sealT<=0){b.sealT=3;b.seals.push({a:rnd(0,TAU),t:0});}
    if(p.hp>0){const d=Math.hypot(p.x-R_.x,p.y-R_.y);if(d>R_.r){R_.acc+=dt;if(R_.acc>=1){R_.acc=0;addIce(1);hintOnce('icering','ЛЁД · ВЕРНИТЕСЬ В КРУГ','#bfe8ff');}}else R_.acc=0;}
    if(p.dashT>0)for(let i=b.seals.length-1;i>=0;i--){const s=b.seals[i],sx=R_.x+Math.cos(s.a)*R_.r,sy=R_.y+Math.sin(s.a)*R_.r;
      if(segDist(p.px,p.py,p.x,p.y,sx,sy)<26){b.seals.splice(i,1);R_.r=Math.min(R_.r0,R_.r+80);explode(sx,sy,'#dff6ff',16,.8);floater(sx,sy-18,'ПЕЧАТЬ СЛОМАНА · КРУГ +80','#dff6ff');sfx('boom');b.sealT=Math.max(b.sealT,6);}}}}
// ---------- Обод ----------
function obInit(b){b.cx=W/2;b.cy=H/2;b.R=260;b.R0=260;b.Rmin=sbHard()?120:150;b.rot=0;b.rotV=TAU/18;b.segs=[];for(let i=0;i<8;i++)b.segs.push({i,e:null,t:0});
  b.seat=2;b.seatT=8;b.hop=null;b.tele=false;b.next=0;b.expo=0;b.svcT=9;b.svc=null;b.spokeT=3;b.spokes=[];b.rcT=6;b.rustT=5;b.repT=15;b.lostMods=[];b.docks=null;b.shrink=0;
  b.memory=storyFlag('inv14')==='memory';b.x=b.cx+Math.cos(obSegAng(b,b.seat))*b.R;b.y=b.cy+Math.sin(obSegAng(b,b.seat))*b.R;}
function obSegAng(b,i){return b.rot+i*TAU/8;}
function obSegPos(b,i){const a=obSegAng(b,i);return {x:b.cx+Math.cos(a)*b.R,y:b.cy+Math.sin(a)*b.R};}
function obSpawnSeg(b,s){const q=obSegPos(b,s.i);s.e=spawnEnemy('obseg',q.x,q.y,{noAffix:true,noLoot:true,spawnT:.8,seg:s});s.e.hp=s.e.maxHp=Math.round(350*sbRank());}
function obSegDied(e){const b=G.sb,s=e.seg;if(!b||!s||b.sbk!=='obod')return;s.e=null;s.t=10;if(b.st==='dying')return;floater(e.x,e.y-18,'ПРОБОИНА','#ffb060');if(Math.random()<.5)dropCell(e.x,e.y,0);}
function obHoleAt(b,a){for(const s of b.segs){const sa=obSegAng(b,s.i);const hole=!s.e||!s.e.alive||s.e.spawnT>0||(b.svc&&b.svc.docks.some(d=>d.i===s.i));
    if(hole&&Math.abs(angDiff(a,sa))<TAU/16-.05)return true;}return false;}
function obHeartOpen(b){if(b.st!=='fight')return false;if(b.hop||b.expo>0)return true;const s=b.segs[b.seat];return !s.e||!s.e.alive||s.e.spawnT>0;}
function obPickSeg(b){const ok=b.segs.filter(s=>s.i!==b.seat&&s.e&&s.e.alive),any=b.segs.filter(s=>s.i!==b.seat);const pool=ok.length&&Math.random()<.65?ok:any;return pool[Math.floor(Math.random()*pool.length)].i;}
function obRingBullet(b,q){const d0=Math.hypot(q.px-b.cx,q.py-b.cy),d1=Math.hypot(q.x-b.cx,q.y-b.cy);if((d0-b.R)*(d1-b.R)>0&&Math.abs(d1-b.R)>8)return false;
  const a=Math.atan2((q.y+q.py)/2-b.cy,(q.x+q.px)/2-b.cx);
  for(const s of b.segs){const e=s.e;if(!e||!e.alive||e.spawnT>0)continue;if(b.svc&&b.svc.docks.some(d=>d.i===s.i))continue;
    if(Math.abs(angDiff(a,obSegAng(b,s.i)))<TAU/16){if(q.hit.includes(e))return false;q.hit.push(e);hurt(e,q.dmg,{charged:!!q.charged});if(SET.fx)part(q.x,q.y,vrnd3(-50,50),vrnd3(-50,50),.2,'#ffb060',2);if(!q.charged)q.life=0;return true;}}
  return false;}
function obRingPlayer(b){const p=G.player;if(!p||p.hp<=0||b.st==='dying')return;const dx=p.x-b.cx,dy=p.y-b.cy,d=Math.hypot(dx,dy)||1,a=Math.atan2(dy,dx),th=7+p.r;
  if(Math.abs(d-b.R)>=th||obHoleAt(b,a))return;
  if(d<b.R){p.x=b.cx+dx/d*(b.R-th-1);p.y=b.cy+dy/d*(b.R-th-1);if(p.dashT<=0){damagePlayer(b.phase===3?20:10);if(b.phase===3)addWear(G.st.maxHp0*.03);}}
  else{p.x=b.cx+dx/d*(b.R+th+1);p.y=b.cy+dy/d*(b.R+th+1);}
  p.x=clamp(p.x,p.r,BW-p.r);p.y=clamp(p.y,p.r,BH-p.r);p.vx*=.3;p.vy*=.3;}
function obFix(b){const p=G.player;G.wear=0;computeStats();p.inv=Math.max(p.inv,6);p.shieldUp=true;p.shieldT=0;G.shieldPen=0;G.ice=0;
  const ks=Object.keys(G.mods).filter(k=>G.mods[k]>0);let txt='';if(ks.length){const k=ks[Math.floor(Math.random()*ks.length)];G.mods[k]--;if(!G.mods[k])delete G.mods[k];b.lostMods.push(k);computeStats();if(p.hp>G.st.maxHp)p.hp=G.st.maxHp;txt=' · УДАЛЕНО: '+(MODS[k]?MODS[k].name.toUpperCase():k);}
  banner('РЕМОНТ ВЫПОЛНЕН','ИЗНОС СНЯТ · ЩИТ · НЕУЯЗВИМОСТЬ 6 С'+txt);sfx('level');}
function obScrap(b,i){const s=b.segs[i];if(s.e&&s.e.alive)kill(s.e,true);s.e=null;s.t=9;b.expo=9;
  let n=0;for(const e of G.enemies)if(e.alive&&e.type==='repairer'){e.hunt=8;n++;}
  if(n<2)for(let k=n;k<2;k++)sbEdge('repairer',{hunt:8});
  banner('УТИЛИЗАЦИЯ','ПРОБОИНА · УЗЕЛ ОТКРЫТ 8 С · РЕМОНТНИКИ ИДУТ ЗА ВАМИ');sfx('bigboom');shake(8);}
function updateOb(b,dt){const p=G.player,hard=sbHard();if(sbCommon(b,dt))return;sbEscort(b,dt);
  if(b.st==='enter'){b.timer-=dt;b.cx+=(p.x-b.cx)*Math.min(1,dt);b.cy+=(p.y-b.cy)*Math.min(1,dt);if(b.timer<=0){b.st='fight';for(const s of b.segs)obSpawnSeg(b,s);for(let k=0;k<2;k++)edgeSpawn('repairer');}
    const q=obSegPos(b,b.seat);b.x=q.x;b.y=q.y;obPlaceSegs(b);return;}
  if(b.st==='final'){b.timer-=dt;b.fT=Math.min(1,(b.fT||0)+dt/1.5);b.x=b.fx0+(b.cx-b.fx0)*b.fT;b.y=b.fy0+(b.cy-b.fy0)*b.fT;obPlaceSegs(b);
    if(b.docks&&b.fT>=1&&p.hp>0)for(const d of b.docks){const x=b.cx+d.ox,y=b.cy;if(Math.hypot(p.x-x,p.y-y)<40){d.ch+=dt;if(d.ch>=.6){sbChoose(b,d.kind==='fix'?'service':'scrap');return;}}else d.ch=0;}
    if(b.timer<=0)sbTimeout(b);return;}
  // кольцо следует за игроком
  {const lo=Math.min(b.R+30,W/2),hi=Math.max(W-b.R-30,W/2),lo2=Math.min(b.R+30,H/2),hi2=Math.max(H-b.R-30,H/2);const tx=clamp(p.x,lo,hi),ty=clamp(p.y,lo2,hi2);
    const sp=70*dt,ddx=tx-b.cx,ddy=ty-b.cy,dd=Math.hypot(ddx,ddy);if(dd>sp){b.cx+=ddx/dd*sp;b.cy+=ddy/dd*sp;}else{b.cx=tx;b.cy=ty;}}
  b.rot+=b.rotV*dt;
  if(b.phase===3){b.shrink+=dt;b.R=Math.max(b.Rmin,b.R0-(b.R0-b.Rmin)*Math.min(1,b.shrink/20));}
  // сегменты
  for(const s of b.segs){if(s.e&&!s.e.alive)s.e=null;if(!s.e){s.t-=dt;if(s.t<=0){obSpawnSeg(b,s);floater(s.e.x,s.e.y-18,'СЕГМЕНТ ВОССТАНОВЛЕН','#ffb060');}}}
  obPlaceSegs(b);
  // узел: переезды
  if(b.expo>0)b.expo-=dt;
  if(!b.hop){b.seatT-=dt;if(b.seatT<=1&&!b.tele){b.tele=true;b.next=obPickSeg(b);}
    if(b.seatT<=0){const q0=obSegPos(b,b.seat);b.hop={x0:q0.x,y0:q0.y,to:b.next,t:0};b.tele=false;b.seatT=b.phase===3?5:8;}
    const q=obSegPos(b,b.seat);b.x=q.x;b.y=q.y;}
  else{const h=b.hop;h.t+=dt;const k=Math.min(1,h.t/1.5),q=obSegPos(b,h.to);b.x=h.x0+(q.x-h.x0)*k;b.y=h.y0+(q.y-h.y0)*k;if(k>=1){b.seat=h.to;b.hop=null;}}
  // ржавый веер узла
  b.fanT=(b.fanT===undefined?2:b.fanT)-dt;if(b.fanT<=0&&p.hp>0&&onScreen(b)){b.fanT=(b.phase===3?3.2:4)*atkK();const a0=Math.atan2(p.y-b.y,p.x-b.x);for(let i=-1;i<=1;i++){const q=shootE(b.x,b.y,a0+i*.16,230,8,'#ffb060',5);if(q)q.boss=true;}}
  // спицы ржавчины
  b.spokeT-=dt;if(b.spokeT<=0){b.spokeT=(b.phase===3?2.4:2.7)*atkK();for(let k=0;k<2;k++){const i=Math.floor(Math.random()*8);if(b.segs[i].e&&b.segs[i].e.alive&&!b.spokes.some(s=>s.i===i))b.spokes.push({i,t:0,tele:.8,act:b.phase>=2?1:.3,hit:false});}}
  for(const s of b.spokes){s.t+=dt;if(s.t>s.tele&&s.t<=s.tele+s.act&&!s.hit&&p.hp>0&&p.dashT<=0&&p.inv<=0){const q=obSegPos(b,s.i);
      if(segDist(q.x,q.y,b.cx,b.cy,p.x,p.y)<16){s.hit=true;damagePlayer(14);if(p.shieldUp){p.shieldUp=false;p.shieldT=0;}G.shieldPen=10;hintOnce('rustsh','РЖАВЧИНА · ЩИТ СБИТ','#c96a2a');}}}
  b.spokes=b.spokes.filter(s=>s.t<s.tele+s.act);
  // сервисные окна
  if(!b.svc){b.svcT-=dt;if(b.svcT<=0){let i=Math.floor(Math.random()*8);if(i===b.seat||(i+4)%8===b.seat)i=(i+1)%8;b.svc={t:5,docks:[{i,kind:'fix',ch:0},{i:(i+4)%8,kind:'scrap',ch:0}]};b.svcT=b.memory?11:(hard?10:14);
      banner('СЕРВИСНОЕ ОКНО · 5 С','ЗЕЛЁНЫЙ ДОК — РЕМОНТ · КРАСНЫЙ — УТИЛИЗАЦИЯ');sfx('warn');}}
  else{const S_=b.svc;S_.t-=dt;let done=false;
    for(const d of S_.docks){const q=obSegPos(b,d.i),near=p.hp>0&&Math.hypot(p.x-q.x,p.y-q.y)<46;
      if(d.kind==='fix'){if(near){d.ch+=dt;if(d.ch>=2){obFix(b);done=true;break;}}else d.ch=0;}
      else if(near){obScrap(b,d.i);done=true;break;}}
    if(done||S_.t<=0)b.svc=null;}
  // ремонтники
  b.repT-=dt;if(b.repT<=0){b.repT=15;if(G.enemies.filter(e=>e.alive&&e.type==='repairer').length<2)edgeSpawn('repairer');}
  // фаза 2: ржавые копии
  if(b.phase>=2){b.rcT-=dt;if(b.rcT<=0){b.rcT=12*atkK();const n=G.enemies.filter(e=>e.alive&&e.type==='rustcopy').length;
      for(let k=0;k<2&&n+k<4;k++){const a=rnd(0,TAU),x=clamp(b.cx+Math.cos(a)*(b.R-40),20,W-20),y=clamp(b.cy+Math.sin(a)*(b.R-40),20,H-20);
        const c=spawnEnemy('rustcopy',x,y,{noAffix:true,noLoot:true,spawnT:.8,skin:COPY_SKINS[Math.floor(Math.random()*COPY_SKINS.length)]});c.hp=c.maxHp=Math.round(60*sbRank());c.spd*=1+.10*diffK();}
      floater(b.cx,b.cy-30,'ЗАПАСНЫЕ КОРПУСА КЛИЕНТА','#c96a2a');sfx('warn');}}
  // фаза 3: ржавчина внутри
  if(b.phase===3){b.rustT-=dt;if(b.rustT<=0){b.rustT=5;if(G.fields.filter(f=>f.rust&&!f.strip).length<3){const a=rnd(0,TAU),r=rnd(0,b.R*.5);G.fields.push({x:b.cx+Math.cos(a)*r,y:b.cy+Math.sin(a)*r,r:70,t:6,max:6,hit:true,rust:true});}}}
  obRingPlayer(b);}
function obPlaceSegs(b){for(const s of b.segs){if(s.e&&s.e.alive){const q=obSegPos(b,s.i);s.e.x=q.x;s.e.y=q.y;s.e.vx=s.e.vy=0;}}}
// ---------- отрисовка боссов (мировые координаты, после врагов) ----------
function sbDraw(t){const b=G.sb;if(!b||!b.alive)return;const p=G.player;if(is85(b))return sb85Draw(b,t);if(b.sbk==='nurse'||b.sbk==='flag')return sb74Draw(b,t);
  if(b.sbk==='inv'){
    if(b.st==='fight'||b.st==='final'){
      // лучи
      if(b.st==='fight')for(const B of b.beams){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(B.a);const g=ctx.createLinearGradient(0,0,520,0);g.addColorStop(0,'rgba(191,232,255,.28)');g.addColorStop(1,'rgba(191,232,255,0)');
        ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,520,-.52,.52);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(223,246,255,.5)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(-.52)*520,Math.sin(-.52)*520);ctx.moveTo(0,0);ctx.lineTo(Math.cos(.52)*520,Math.sin(.52)*520);ctx.stroke();ctx.restore();}
      // подписи ячеек
      ctx.font='700 10px "JetBrains Mono",monospace';ctx.textAlign='center';
      for(const c of b.cells){const e=c.e;if(!e||!e.alive)continue;
        if(c.label&&b.inv&&!(sbHard()&&b.inv.t>1)){ctx.fillStyle='#04060c';ctx.fillText(c.label,e.x+1,e.y-e.r-9);ctx.fillStyle=c.locked?'#5a6b80':'#ffffff';ctx.fillText(c.label,e.x,e.y-e.r-10);
          if(!c.locked){ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.globalAlpha=.9;ctx.beginPath();ctx.arc(e.x,e.y,e.r+7,-Math.PI/2,-Math.PI/2+TAU*(b.inv.t/4));ctx.stroke();ctx.globalAlpha=1;}}
        if(c.open>0){ctx.strokeStyle='#ffffff';ctx.globalAlpha=.4+.4*Math.sin(t*12);ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,e.r+5,0,TAU);ctx.stroke();ctx.globalAlpha=1;}}
      // кольцо льда (фаза 3)
      if(b.ring&&b.st==='fight'){const R_=b.ring;ctx.fillStyle='rgba(191,232,255,.16)';ctx.beginPath();ctx.rect(-4000,-4000,8000,8000);ctx.arc(R_.x,R_.y,R_.r,0,TAU,true);ctx.fill('evenodd');
        ctx.strokeStyle='#dff6ff';ctx.globalAlpha=.6;ctx.lineWidth=2;ctx.setLineDash([8,6]);ctx.lineDashOffset=-t*20;ctx.beginPath();ctx.arc(R_.x,R_.y,R_.r,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;ctx.globalAlpha=1;
        for(const s of b.seals){const x=R_.x+Math.cos(s.a)*R_.r,y=R_.y+Math.sin(s.a)*R_.r;glow(x,y,30,'#dff6ff',.7);ctx.save();ctx.translate(x,y);ctx.rotate(t*2);ctx.strokeStyle='#ffffff';ctx.fillStyle='#0b1a28';ctx.lineWidth=2;poly(6,12,0);ctx.fill();ctx.stroke();ctx.restore();worldLabel(x,y-22,'ПЕЧАТЬ · РЫВОК','#dff6ff');}}
      // ядра финала
      if(b.st==='final'&&b.cores)for(const c of b.cores){if(!c.alive)continue;worldLabel(c.x,c.y-c.r-14,c.core==='memory'?'ЯДРО ПАМЯТИ':'ЯДРО ХОЛОДА',c.core==='memory'?'#ffd36b':'#bfe8ff');}
      if(b.st==='final'){ctx.strokeStyle='#ffffff';ctx.globalAlpha=.8;ctx.lineWidth=3;ctx.beginPath();ctx.arc(b.x,b.y,b.r+22,-Math.PI/2,-Math.PI/2+TAU*(b.timer/20));ctx.stroke();ctx.globalAlpha=1;}
      // маршруты копий (пока появляются)
      for(const e of G.enemies){if(e.type!=='icecopy'||!e.alive||e.spawnT<=0||!e.path)continue;ctx.strokeStyle='#dff6ff';ctx.globalAlpha=.5;ctx.lineWidth=1.5;ctx.setLineDash([4,6]);ctx.beginPath();e.path.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}
    }
  }else{
    // кольцо Обода
    const segs=b.segs,hard=sbHard();
    for(const s of segs){const e=s.e,a=obSegAng(b,s.i),alive=e&&e.alive;const dock=b.svc&&b.svc.docks.find(d=>d.i===s.i);
      if(alive){const k=e.hp/e.maxHp;let col=e.flash>0?'#ffffff':dock?(hard&&b.svc.t>2?'#c9d2de':dock.kind==='fix'?'#7affc9':'#ff4f6e'):(b.tele&&b.next===s.i&&!b.hop)?'#ffb060':'#c96a2a';
        ctx.strokeStyle=col;ctx.lineWidth=dock?8:14;ctx.globalAlpha=e.spawnT>0?Math.max(0,1-e.spawnT):(.55+.45*k);ctx.beginPath();ctx.arc(b.cx,b.cy,b.R,a-TAU/16+.03,a+TAU/16-.03);ctx.stroke();
        if(dock){ctx.setLineDash([4,5]);ctx.lineWidth=2;ctx.globalAlpha=.9;ctx.beginPath();ctx.arc(b.cx,b.cy,b.R+12,a-TAU/16,a+TAU/16);ctx.stroke();ctx.setLineDash([]);
          const q=obSegPos(b,s.i);worldLabel(q.x,q.y-26,hard&&b.svc.t>2?'ДОК · ?':dock.kind==='fix'?'РЕМОНТ · 2 С':'УТИЛИЗАЦИЯ',col);
          if(dock.kind==='fix'&&dock.ch>0){ctx.strokeStyle='#7affc9';ctx.lineWidth=3;ctx.beginPath();ctx.arc(q.x,q.y,30,-Math.PI/2,-Math.PI/2+TAU*dock.ch/2);ctx.stroke();}}
        ctx.globalAlpha=1;}
      else{ctx.strokeStyle='#5a2e14';ctx.lineWidth=3;ctx.globalAlpha=.5;ctx.setLineDash([3,7]);ctx.beginPath();ctx.arc(b.cx,b.cy,b.R,a-TAU/16+.03,a+TAU/16-.03);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
        if(SET.fx&&Math.random()<.15){const q=obSegPos(b,s.i);part(q.x+rnd(-20,20),q.y+rnd(-20,20),rnd(-20,20),rnd(-20,20),.4,'#ffb060',2);}}}
    // спицы
    for(const s of b.spokes){const q=obSegPos(b,s.i);if(s.t<=s.tele){if(G.noTele)continue;ctx.strokeStyle='#c96a2a';ctx.globalAlpha=.3+.5*(s.t/s.tele);ctx.lineWidth=2;ctx.setLineDash([6,8]);ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(b.cx,b.cy);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}
      else{ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#ff8a3d';ctx.globalAlpha=.6;ctx.lineWidth=18;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(b.cx,b.cy);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=4;ctx.globalAlpha=1;ctx.stroke();ctx.globalCompositeOperation='source-over';}}
    // переезд узла
    if(b.hop){ctx.strokeStyle='#ffb060';ctx.globalAlpha=.5;ctx.lineWidth=2;ctx.setLineDash([5,6]);const q=obSegPos(b,b.hop.to);ctx.beginPath();ctx.moveTo(b.hop.x0,b.hop.y0);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}
    if(b.st==='fight'&&obHeartOpen(b))worldLabel(b.x,b.y-b.r-16,b.expo>0?'УЗЕЛ ОТКРЫТ · '+Math.ceil(b.expo)+' С':'УЗЕЛ ОТКРЫТ','#ffffff');
    // финал: доки
    if(b.st==='final'&&b.docks&&b.fT>=1)for(const d of b.docks){const x=b.cx+d.ox,y=b.cy,col=d.kind==='fix'?'#7affc9':'#ff4f6e';glow(x,y,46,col,.5);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.lineDashOffset=-t*15;ctx.beginPath();ctx.arc(x,y,34,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;
      worldLabel(x,y-46,d.kind==='fix'?'ВОССТАНОВИТЬ ДО ЗАВОДСКОГО':'СПИСАТЬ СТАНЦИЮ',col);worldLabel(x,y+52,d.kind==='fix'?'ОПЛАТА ЛОМОМ · ПЕРК':'ЛОМ ×2',col);}
    if(b.st==='final'){ctx.strokeStyle='#ffffff';ctx.globalAlpha=.8;ctx.lineWidth=3;ctx.beginPath();ctx.arc(b.cx,b.cy,b.r+24,-Math.PI/2,-Math.PI/2+TAU*(b.timer/20));ctx.stroke();ctx.globalAlpha=1;}
  }}
// ---------- обломки боссов в открытом мире ----------
const SB_WRECK={14:{memory:['ОБЛОМОК КАРТОТЕКИ','Ядро холода разрушено. Записи оттаяли: тридцать одна копия, один почерк. В одной из них рука Э. В. дописала: «ищи третий путь».'],cold:['ОБЛОМОК КАРТОТЕКИ','Ядро памяти сожжено. Вы сожгли 31 себя. Теперь никто не скажет, как именно они ошиблись.']},
  18:{service:['ОБЛОМОК ОБОДА','Заказ закрыт. На листе обшивки — копия списка колонистов «Тихой». Строка 118: «Лоран, сын техника». Список был.'],scrap:['ОБЛОМОК ОБОДА','Станция списана. Кольцо больше не вращается. Автомат обслуживания в мастерской пишет: «следующих не будет».']}};
function sbWreckPos(m){const n=WORLD.nodes[m-1];return {x:n.x+150,y:n.y-120};}
function sbWorldDraw(t){const S=G.save;if(!S||!S.story)return;for(const m of SB_WM85){const ch=S.story[SB_FLAG_M[m]];if(!ch)continue;const q=sbWreckPos(m);if(!inView(q.x,q.y,90))continue;const read=S.story.bwRead&&S.story.bwRead[m];
    ctx.save();ctx.translate(q.x,q.y);ctx.globalAlpha=read?.55:.9;ctx.strokeStyle=m===14?'#9fd8ff':m===22?'#ff6b8a':m===27?'#b8c4d6':m===31?'#e8d27a':m===38?'#6b8cff':m===42?'#ffd36b':m===46?'#7affc9':'#c96a2a';ctx.fillStyle='#0b1220';ctx.lineWidth=2;
    if(m===14){ctx.rotate(.35);ctx.beginPath();ctx.moveTo(-44,-10);ctx.lineTo(-30,-18);ctx.lineTo(20,-18);ctx.lineTo(34,-6);ctx.lineTo(10,16);ctx.lineTo(-40,12);ctx.closePath();ctx.fill();ctx.stroke();ctx.lineWidth=1;for(let i=-3;i<=1;i++){ctx.beginPath();ctx.moveTo(i*11,-16);ctx.lineTo(i*11,12);ctx.stroke();}}
    else{ctx.lineWidth=7;ctx.beginPath();ctx.arc(0,0,34,.3,2.6);ctx.stroke();ctx.beginPath();ctx.arc(0,0,34,3.4,4.9);ctx.stroke();ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,10,0,TAU);ctx.fill();ctx.stroke();}
    ctx.restore();ctx.globalAlpha=1;if(!read)glow(q.x,q.y,40,m===14?'#9fd8ff':'#ffb060',.4+.3*Math.sin(t*3));worldLabel(q.x,q.y-50,SB_WRECK[m][ch]?SB_WRECK[m][ch][0]:'ОБЛОМОК','#9fb0c4');}}
function sbWorldPOI(){const S=G.save,p=G.player;if(!S||!S.story||!p||p.hp<=0)return;for(const m of SB_WM85){const ch=S.story[SB_FLAG_M[m]];if(!ch)continue;const R=S.story.bwRead||(S.story.bwRead={});if(R[m])continue;
    const q=sbWreckPos(m);if(Math.hypot(p.x-q.x,p.y-q.y)<95){R[m]=1;const W_=SB_WRECK[m][ch]||['ОБЛОМОК',''];toast(W_[0],W_[1]+' (+25 лома)');S.lom+=25;sfx('pick');saveWorld();}}}

