// ---------- Маяк ----------
function makeBeacon(M){return{x:W/2,y:H/2,r:30,hp:M.bcHp,maxHp:M.bcHp,charge:0,peak:0,thr:curDiff().thr.slice(),thrI:0,coolAt:(M.cool||[]).slice(),coolI:0,cool:0,
  trans:0,transStarted:false,transDone:false,done:false,mods:{},barrier:0,barF:0,turT:0,turA:0,hitF:0,rot:0,inRing:false,lureT:4,isBc:true,drain:0,rate:0};}
function bcRing(){return 125*(G.bc&&G.bc.mods.ring?1.4:1);}
function layoutBeacon(){
  const bc=G.bc;bc.x=W/2;bc.y=H/2;
  const R=Math.min(W,H)*.36;G.relays.forEach((r,i)=>{const a=-Math.PI/2+i*TAU/3+Math.PI/3;r.x=clamp(bc.x+Math.cos(a)*R,40,W-40);r.y=clamp(bc.y+Math.sin(a)*R,40,H-40);});
}
function dmgBeacon(d,src){
  if(devAny()&&G.dev.bcGod)return;
  const bc=G.bc;if(!bc||bc.done||G.deadT>0)return;if(bc.cool>0)d*=1.5;d*=(curDiff().bcDmg||1)*missionK('dmg');
  if(bc.barrier>0){const a=Math.min(bc.barrier,d);bc.barrier-=a;d-=a;bc.barF=.15;if(d<=0)return;}
  bc.hp-=d;bc.hitF=.25;G.bcTaken+=d;sfx('bhit');
  if(src&&src.affix&&src.affix.includes('vamp'))src.hp=Math.min(src.maxHp,src.hp+d);
  if(bc.hp<=0){bc.hp=0;G.loseBeacon=true;explode(bc.x,bc.y,'#ffb84d',80,1.8);sfx('bigboom');shake(18);G.deadT=1.8;banner('МАЯК РАЗРУШЕН','СИГНАЛ ПОТЕРЯН');}
}
function beaconFlash(){
  const bc=G.bc;if(!bc)return;G.eb=[];G.lightFull=1;sfx('flash');shake(6);
  G.shock.push({x:bc.x,y:bc.y,r:20,R:Math.max(W,H)*.7,t:0,col:'#ffb84d',slow:true});
  if(bc.mods.barrier)bc.barrier=100;
  for(const e of G.enemies){if(!e.alive||e.spawnT>0)continue;const d=Math.hypot(e.x-bc.x,e.y-bc.y);
    if(d<420&&!HEAVY.has(e.type)){const k=(1-d/420)*480;e.vx+=(e.x-bc.x)/(d||1)*k;e.vy+=(e.y-bc.y)/(d||1)*k;if(e.type==='leech'&&e.att){e.att=false;}}
    if(bc.mods.flashdmg&&d<420){hurt(e,60,{pulse:true});if(e.alive&&!STATIC.has(e.type))e.stun=1.5;}}
}
function finishBeacon(){
  const bc=G.bc;beaconFlash();G.enemies.slice().forEach(e=>{if(e.alive&&e!==G.jam)kill(e,true);});G.eb=[];
  banner(MISSIONS[G.m-1].transmit?'СИГНАЛ ПЕРЕДАН':'МАЯК ЗАРЯЖЕН','ИСТОРИЯ ЗАФИКСИРОВАНА');G.endT=2.6;bc.done=true;
}
function updateBeacon(dt){
  const bc=G.bc,p=G.player,st=G.st;if(!bc)return;
  bc.rot+=dt;bc.hitF=Math.max(0,bc.hitF-dt);bc.barF=Math.max(0,bc.barF-dt);
  const inRing=p.hp>0&&Math.hypot(p.x-bc.x,p.y-bc.y)<bcRing();bc.inRing=inRing;
  if(bc.done)return;
  if(inRing&&bc.mods.repair&&!p.shieldUp&&!(G.lockShield>0)){p.shieldT+=dt;if(!(st.shieldCd>0)&&p.shieldT>=8){p.shieldUp=true;p.shieldT=0;sfx('shield');}}
  if(bc.mods.turret){bc.turT-=dt;if(bc.turT<=0){const t=nearestEnemy(bc.x,bc.y,380,true);
    if(t){bc.turT=bc.mods.turret>1?.5:.8;const a=Math.atan2(t.y-bc.y,t.x-bc.x);bc.turA=a;G.pb.push({x:bc.x+Math.cos(a)*30,y:bc.y+Math.sin(a)*30,px:bc.x,py:bc.y,vx:Math.cos(a)*850,vy:Math.sin(a)*850,dmg:8,pierce:0,rico:0,life:.6,hit:[],turret:true});}else bc.turT=.2;}}
  if(bc.mods.lure){bc.lureT-=dt;if(bc.lureT<=0){bc.lureT=4;for(const e of G.enemies)if(e.alive&&e.group==='hunt'&&Math.random()<.3)e.lureT=4;}}
  if(bc.cool>0){bc.cool-=dt;if(bc.cool<=0)banner('ОХЛАЖДЕНИЕ ЗАВЕРШЕНО','ЗАРЯДКА ВОЗОБНОВЛЕНА');}
  let rate=0;
  if(bc.cool<=0){rate=(inRing?.55:.08)*(MISSIONS[G.m-1].chargeMul||1);
    if(G.relays.length)rate*=1+.2*G.relays.filter(r=>!r.cut).length;
    const nj=G.enemies.filter(e=>e.alive&&e.type==='jammerS'&&e.spawnT<=0&&onScreen(e)).length;rate*=Math.pow(.7,nj);
    if(G.flare>0)rate*=2;}
  bc.rate=rate;
  if(inRing&&p.cargo>0){if(bc.cool>0)hintOnce('cool','МАЯК ОХЛАЖДАЕТСЯ · ГРУЗ ПОЗЖЕ','#ffb84d');else{const add=6*p.cargo;bc.charge+=add;floater(bc.x,bc.y-bc.r-18,'+ЗАРЯД','#ffb84d');p.cargo=0;sfx('cell');}}
  const leech=G.enemies.filter(e=>e.alive&&e.type==='leech'&&e.att).length;
  const ant=G.enemies.filter(e=>e.alive&&e.type==='antenna'&&e.spawnT<=0).length;
  const drain=leech*.7+ant*1.2;bc.drain=drain;
  bc.charge+=(rate-drain)*dt;
  let floor=0;if(bc.mods.battery)for(const t of bc.thr)if(bc.peak>=t)floor=t;
  bc.charge=clamp(bc.charge,floor,100);bc.peak=Math.max(bc.peak,bc.charge);
  while(bc.thrI<bc.thr.length&&bc.charge>=bc.thr[bc.thrI]){bc.thrI++;beaconFlash();ambSting('flash');runGrant6('bp');banner('ВСПЫШКА МАЯКА',bc.thr[bc.thrI-1]+'% · МОДУЛЬ МАЯКА');}
  while(bc.coolI<bc.coolAt.length&&bc.charge>=bc.coolAt[bc.coolI]){bc.coolI++;bc.cool=10;banner('ПРОДУВКА ОХЛАЖДЕНИЯ','10 С · МАЯК УЯЗВИМ, ЗАРЯД СТОИТ');sfx('warn');}
  const M=MISSIONS[G.m-1];
  if(bc.charge>=100){
    if(M.transmit){if(!bc.transStarted){bc.transStarted=true;bc.trans=M.transmit;spawnJam();banner('ПЕРЕДАЧА НАЧАТА','ГЛУШИТЕЛЬ ПРИБЛИЖАЕТСЯ');}}
    else{finishBeacon();return;}
  }
  if(bc.transStarted&&!bc.transDone&&bc.charge<80&&G.mc)G.mc.transPaused=true;
  if(bc.transStarted&&!bc.transDone&&bc.charge>=80){bc.trans-=dt;if(bc.trans<=0){bc.trans=0;bc.transDone=true;banner('ПЕРЕДАЧА ЗАВЕРШЕНА',G.jam?'УНИЧТОЖЬТЕ ГЛУШИТЕЛЯ':'СИГНАЛ ДОШЁЛ');}}
  if(bc.transDone&&!G.jam)finishBeacon();
  // контакт врагов с маяком
  for(const e of G.enemies){
    if(!e.alive||e.spawnT>0||e.ghost||e.down>0||NOBC.has(e.type))continue;
    const d=Math.hypot(e.x-bc.x,e.y-bc.y);if(d>=e.r+bc.r)continue;
    if(e.type==='moth'){dmgBeacon(3,e);kill(e,true);continue;}
    if(e.bcT<=0&&e.contact>0){dmgBeacon(e.contact*(e.group==='siege'?1:.5)*(e.type==='rammer'&&e.st==='charge'?1.5:1),e);e.bcT=1;}
    const a=Math.atan2(e.y-bc.y,e.x-bc.x);e.x=bc.x+Math.cos(a)*(e.r+bc.r);e.y=bc.y+Math.sin(a)*(e.r+bc.r);e.vx=Math.cos(a)*180;e.vy=Math.sin(a)*180;
  }
}

// ---------- Режиссёр миссий 7–10 ----------
const LOAD={moth:.25,mite:.3,shell:0,mine:0,crate:0,antenna:0,decoy:0,cpart:0,cruiser:3,hive:1.5,jam:0,seeker:.3};
function enemyLoad(){let s=G.warns.reduce((a,w)=>a+(LOAD[w.type]??1),0);for(const e of G.enemies)if(e.alive)s+=LOAD[e.type]??1;return s;}
function pickPool(pool){let tot=0;for(const k in pool)tot+=pool[k];let r=Math.random()*tot;for(const k in pool){r-=pool[k];if(r<=0)return k;}return Object.keys(pool)[0];}
function directorSpawn(type){
  if(type==='moth'){const side=Math.random()*4|0,u=rnd(.15,.85),n=6+(Math.random()*4|0);for(let i=0;i<n;i++)edgeSpawn('moth',{side,u:u+rnd(-.06,.06),delay:i*.08});}
  else if(type==='twin'){const id=++G.uid;const side=Math.random()*4|0,u=rnd(.2,.8);edgeSpawn('twin',{pair:id,side,u});edgeSpawn('twin',{pair:id,side,u:u+.08});}
  else edgeSpawn(type);
}
function updateDirector(dt){
  const M=MISSIONS[G.m-1],bc=G.bc;G.mT+=dt;
  if(G.endT>0){G.endT-=dt;if(G.endT<=0)missionComplete();return;}
  if(bc.done)return;
  let ph=M.phases[0];for(const q of M.phases)if(bc.peak>=q.at)ph=q;
  for(const ev of G.script)if(!ev.done&&bc.peak>=ev.at){ev.done=true;edgeSpawn(ev.spawn);if(ev.msg)banner(ev.msg[0],ev.msg[1]);}
  while(G.evAt.length&&bc.peak>=G.evAt[0]){G.evAt.shift();startEvent();}
  G.dirT-=dt;const tr=bc.transStarted?1.1:1;
  const em=enemyMul();
  if(G.dirT<=0&&enemyLoad()<Math.min(40,ph.max*tr*em)){G.dirT=ph.every*rnd(.8,1.2)/(tr*em);directorSpawn(pickPool(ph.pool));}
}

// ---------- Уровень: ретрансляторы, астероиды, буря, поля ----------
function nearestLine(e){if(!G.bc)return null;let b=null,bd=1e9;for(const r of G.relays){if(r.cut)continue;const q=segDist(r.x,r.y,G.bc.x,G.bc.y,e.x,e.y);if(q<bd){bd=q;b=r;}}return b;}
function updateRelays(dt){
  const p=G.player,bc=G.bc;if(!bc)return;
  for(const r of G.relays){if(!r.cut)continue;
    if(p.hp>0&&segDist(r.x,r.y,bc.x,bc.y,p.x,p.y)<28){r.rep+=dt*G.st.linek;if(r.rep>=2){r.cut=false;r.rep=0;floater(p.x,p.y-26,'ЛИНИЯ ВОССТАНОВЛЕНА','#8fe9ff');sfx('cell');}}
    else r.rep=Math.max(0,r.rep-dt*.5);}
}
function makeRock(x,y,r){const n=9,v=[];for(let i=0;i<n;i++)v.push(r*rnd(.75,1.1));return{x,y,vx:rnd(-22,22),vy:rnd(-22,22),r,hp:r>25?60:25,v,rot:rnd(0,TAU),vr:rnd(-.4,.4),alive:true,tow:null,flung:false,hitF:0};}
function spawnRocks(n){const bc=G.bc,p=G.player;for(let i=0;i<n;i++){let x,y,t=0;do{x=rnd(60,W-60);y=rnd(60,H-60);}while((Math.hypot(x-bc.x,y-bc.y)<bcRing()+70||Math.hypot(x-p.x,y-p.y)<120)&&++t<20);G.rocks.push(makeRock(x,y,rnd(28,36)));}}
function rockHit(r,dmg){r.hp-=dmg;r.hitF=.06;if(r.hp<=0&&r.alive){r.alive=false;if(r.tow){releaseTug(r.tow,false);}explode(r.x,r.y,'#8a9bb0',14,.8);
  const list=G.world?G.wrocks:G.rocks;
  if(r.r>25&&!G.world)for(let i=0;i<2;i++){const s=makeRock(r.x+rnd(-10,10),r.y+rnd(-10,10),rnd(15,19));if(G.world){s.vx=0;s.vy=0;}else{s.vx=rnd(-60,60);s.vy=rnd(-60,60);}list.push(s);}
  if(G.world){const rk=(G.w&&storyFlag('arcSilence')&&worldSS(r.x,r.y)===SEC_SCALE[2])?1.25:1;for(let i=0;i<Math.round((r.r>25?2:1)*rk);i++)G.pick.push({k:'lom',x:r.x+rnd(-10,10),y:r.y+rnd(-10,10),vx:rnd(-80,80),vy:rnd(-80,80),r:5,t:0,life:30,v:1});if(r.id!==undefined&&G.save&&G.save.rocksGone&&!G.save.rocksGone.includes(r.id))G.save.rocksGone.push(r.id);}
  else if(Math.random()<.25)dropCell(r.x,r.y);}}
function releaseTug(e,byShot){if(e.rock){e.rock.tow=null;e.rock.vx*=.3;e.rock.vy*=.3;}e.rock=null;e.cd=3;if(byShot){floater(e.x,e.y-18,'ТРОС ПЕРЕБИТ','#c9a36b');sfx('block');}}
function updateRocks(dt){
  const bc=G.bc,p=G.player;
  for(const r of G.rocks){if(!r.alive)continue;r.rot+=r.vr*dt;r.hitF=Math.max(0,r.hitF-dt);
    if(r.tow&&!r.tow.alive)r.tow=null;
    if(!r.tow){r.x+=r.vx*dt;r.y+=r.vy*dt;}
    if(r.flung){if(bc&&Math.hypot(r.x-bc.x,r.y-bc.y)<r.r+bc.r){dmgBeacon(r.r>25?40:22,null);r.alive=false;explode(r.x,r.y,'#c9a36b',20,1);shake(8);continue;}
      if(r.x<-60||r.x>W+60||r.y<-60||r.y>H+60){r.alive=false;continue;}}
    else{if(r.x<r.r&&r.vx<0||r.x>W-r.r&&r.vx>0)r.vx*=-1;if(r.y<r.r&&r.vy<0||r.y>H-r.r&&r.vy>0)r.vy*=-1;
      r.x=clamp(r.x,-r.r,W+r.r);r.y=clamp(r.y,-r.r,H+r.r);
      if(bc&&!r.tow){const d=Math.hypot(r.x-bc.x,r.y-bc.y);if(d<r.r+bc.r+20){const a=Math.atan2(r.y-bc.y,r.x-bc.x);r.x=bc.x+Math.cos(a)*(r.r+bc.r+20);r.y=bc.y+Math.sin(a)*(r.r+bc.r+20);r.vx=Math.cos(a)*25;r.vy=Math.sin(a)*25;}}}
    if(p.hp>0){const d=Math.hypot(p.x-r.x,p.y-r.y),m=r.r+p.r*.8;if(d<m&&d>0){p.x=clamp(r.x+(p.x-r.x)/d*m,p.r,W-p.r);p.y=clamp(r.y+(p.y-r.y)/d*m,p.r,H-p.r);}}
    for(const e of G.enemies){if(!e.alive||STATIC.has(e.type)||e===r.tow||e.type==='mine')continue;const d=Math.hypot(e.x-r.x,e.y-r.y),m=r.r+e.r;if(d<m&&d>0){e.x=r.x+(e.x-r.x)/d*m;e.y=r.y+(e.y-r.y)/d*m;}}
  }
  G.rocks=G.rocks.filter(r=>r.alive);
  if(G.rockN){G.rockT-=dt;if(G.rockT<=0&&G.rocks.length<Math.ceil(G.rockN*.6)){G.rockT=8;const s=Math.random()*4|0;const x=s===1?W+40:s===3?-40:rnd(80,W-80),y=s===0?-40:s===2?H+40:rnd(80,H-80);
    const r=makeRock(x,y,rnd(28,36));const a=Math.atan2(H/2-y,W/2-x)+rnd(-.5,.5);r.vx=Math.cos(a)*35;r.vy=Math.sin(a)*35;G.rocks.push(r);}}
}
function inStorm(x,y){const s=G.storm;if(!s||s.warn>0)return false;return s.axis==='x'?Math.abs(x-s.pos)<s.w/2:Math.abs(y-s.pos)<s.w/2;}
function updateStorm(dt){
  const M=MISSIONS[G.m-1];if(!M.storm)return;
  if(!G.storm){G.stormT-=dt;if(G.stormT<=0){const axis=Math.random()<.5?'x':'y',L=axis==='x'?W:H,dir=Math.random()<.5?1:-1;
    G.storm={axis,dir,w:200,pos:dir>0?-100:L+100,warn:3,L};banner('ИОННАЯ БУРЯ','РЫВОК И ПРИЦЕЛ СБОЯТ В ПОЛОСЕ');sfx('warn');}}
  else{const s=G.storm;if(s.warn>0)s.warn-=dt;else{s.pos+=s.dir*110*dt;if(s.dir>0?s.pos>s.L+120:s.pos<-120){G.storm=null;G.stormT=rnd(16,24);}}}
}
function updateFields(dt){
  const p=G.player;
  for(const f of G.fields){f.t-=dt;if(!f.hit&&p.hp>0&&Math.hypot(p.x-f.x,p.y-f.y)<f.r){f.hit=true;p.noDash=3;damagePlayer(5);floater(p.x,p.y-26,'РЫВОК ПОДАВЛЕН','#6bf0ff');}}
  G.fields=G.fields.filter(f=>f.t>0);
  // гравитация вихрей
  for(const v of G.enemies){if(!v.alive||v.type!=='vortex'||v.spawnT>0)continue;
    if(p.hp>0&&p.dashT<=0){const dx=v.x-p.x,dy=v.y-p.y,d=Math.hypot(dx,dy);if(d<240&&d>v.r){const k=95*(1-d/240)*dt;p.x=clamp(p.x+dx/d*k,p.r,BW-p.r);p.y=clamp(p.y+dy/d*k,p.r,BH-p.r);}}
    for(const e of G.enemies){if(e===v||!e.alive||HEAVY.has(e.type)||STATIC.has(e.type)||(e.type==='leech'&&e.att))continue;const dx=v.x-e.x,dy=v.y-e.y,d=Math.hypot(dx,dy);if(d<240&&d>v.r+e.r){const k=110*(1-d/240)*dt;e.x+=dx/d*k;e.y+=dy/d*k;}}
    for(const k of G.pick){const dx=v.x-k.x,dy=v.y-k.y,d=Math.hypot(dx,dy);if(d<240&&d>8){k.vx+=dx/d*200*dt;k.vy+=dy/d*200*dt;}}}
}

// ---------- Случайные события ----------
const EVENTS=['meteor','flare','crate','fake'];
function startEvent(){
  const left=EVENTS.filter(e=>!G.evUsed.includes(e));const type=left.length?left[Math.random()*left.length|0]:EVENTS[Math.random()*4|0];G.evUsed.push(type);
  if(type==='meteor'){G.meteorT=8;G.meteorN=0;banner('МЕТЕОРНЫЙ ДОЖДЬ','8 С · ОБЛОМКИ БЬЮТ ВСЕХ, ВКЛЮЧАЯ ВРАГОВ');}
  if(type==='flare'){G.flare=8;banner('СОЛНЕЧНАЯ ВСПЫШКА','8 С · ЗАРЯДКА ×2, ВРАГИ БЫСТРЕЕ');}
  if(type==='crate'){const s=Math.random()<.5;const y=rnd(H*.2,H*.8);spawnEnemy('crate',s?-30:W+30,y,{vx:s?70:-70,vy:rnd(-15,15),noAffix:true});banner('ДРЕЙФУЮЩИЙ КОНТЕЙНЕР','СБЕЙТЕ — ВНЕОЧЕРЕДНОЙ МОДУЛЬ');}
  if(type==='fake'){const a=rnd(0,TAU);G.fake={x:clamp(W/2+Math.cos(a)*W*.42,70,W-70),y:clamp(H/2+Math.sin(a)*H*.42,70,H-70),t:10,isFake:true};banner('ЛОЖНЫЙ СИГНАЛ','10 С · ЧАСТЬ ВРАГОВ ОТВЛЕЧЕНА');}
  sfx('warn');
}
function updateEvents(dt){
  if(G.flare>0)G.flare-=dt;
  if(G.fake){G.fake.t-=dt;if(G.fake.t<=0)G.fake=null;}
  if(G.lureP){G.lureP.t-=dt;if(G.lureP.t<=0)G.lureP=null;}
  G.dashLog=G.dashLog.filter(e=>G.t-e.t<2);
  if(G.meteorT>0){G.meteorT-=dt;G.meteorN-=dt;if(G.meteorN<=0){G.meteorN=.45;G.meteors.push({x:rnd(40,W-40),y:rnd(40,H-40),t:1.1});}}
  const p=G.player,bc=G.bc;
  for(const m of G.meteors){m.t-=dt;if(m.t<=0&&!m.done){m.done=true;explode(m.x,m.y,'#ffb07a',14,.8);G.shock.push({x:m.x,y:m.y,r:5,R:46,t:0,col:'#ffb07a',thin:true});
    if(p.hp>0&&Math.hypot(p.x-m.x,p.y-m.y)<46)damagePlayer(12);
    for(const e of G.enemies)if(e.alive&&!STATIC.has(e.type)&&e.type!=='crate'&&Math.hypot(e.x-m.x,e.y-m.y)<46+e.r)hurt(e,30,{});
    if(bc&&Math.hypot(bc.x-m.x,bc.y-m.y)<46+bc.r)dmgBeacon(8,null);}}
  G.meteors=G.meteors.filter(m=>m.t>-.1);
}

