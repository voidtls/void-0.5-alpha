// ---------- Глушитель ----------
const JAM_NAMES=['ПОМЕХИ','ОТРАЖЕНИЕ','ПОЛНАЯ ТИШИНА'];
function spawnJam(){ambSting('boss');if(G.mode==='world'&&!G.world&&G.m===10){radioClear();radioSay('А',3);}const j=spawnEnemy('jam',W/2,-110,{noAffix:true});Object.assign(j,{st:'enter',timer:2.6,phase:1,orb:-Math.PI/2,antT:0,atkA:1.5,atkB:2.5,decoyT:0,window:0,rot:0,domeFlash:0,spT:0,spOn:0,flashT:4});j.group=null;G.jam=j;sfx('warn');}
function jamShielded(){const j=G.jam;if(!j)return true;if(j.phase===1)return G.enemies.some(o=>o.alive&&o.type==='antenna');if(j.phase===3)return j.window<=0;return false;}
function jamPhase(j){ambSting('phase');
  j.phase++;G.eb=[];G.enemies.forEach(o=>{if(o.type==='antenna'||o.type==='decoy'||o.type==='seeker')o.alive=false;});
  G.shock.push({x:j.x,y:j.y,r:20,R:Math.max(W,H),t:0,col:'#4dd0ff',slow:true});sfx('bigboom');shake(14);
  banner('ГЛУШИТЕЛЬ · ФАЗА '+j.phase,JAM_NAMES[j.phase-1]);
  if(j.phase===2){j.decoyT=1.2;}
  if(j.phase===3){G.dark=true;j.flashT=4;j.window=0;}
}
function jamDeath(j){ambSting('bossDown');buzz('boss');
  j.alive=true;j.st='dying';j.deathT=2.4;j.hp=0;G.dark=false;G.eb=[];
  G.enemies.forEach(o=>{if(o.alive&&(o.type==='antenna'||o.type==='decoy'||o.type==='seeker'))kill(o,true);});
  G.score+=EDEF.jam.pts;G.kills++;banner('ГЛУШИТЕЛЬ УНИЧТОЖЕН',G.bc&&G.bc.transDone?'СИГНАЛ СВОБОДЕН':'УДЕРЖИТЕ ПЕРЕДАЧУ');
}
function updateJam(j,dt){
  const p=G.player,bc=G.bc||{x:W/2,y:H/2};j.rot+=dt*.8;if(j.domeFlash>0)j.domeFlash-=dt;
  if(j.st==='dying'){j.deathT-=dt;shake(5);if(Math.random()<.5)explode(j.x+rnd(-40,40),j.y+rnd(-40,40),Math.random()<.5?'#4dd0ff':'#ffffff',8,.8);
    if(j.deathT<=0){j.alive=false;explode(j.x,j.y,'#ffffff',120,2.2);sfx('bigboom');shake(20);G.jam=null;}return;}
  const R=Math.min(W,H)*.38;j.orb+=dt*.22*G.eSpd;const tx=bc.x+Math.cos(j.orb)*R,ty=bc.y+Math.sin(j.orb)*R*.75;
  if(j.st==='enter'){j.x+=(tx-j.x)*Math.min(1,dt*1.5);j.y+=(ty-j.y)*Math.min(1,dt*1.5);j.timer-=dt;if(j.timer<=0){j.st='fight';banner('ГЛУШИТЕЛЬ · ФАЗА 1',JAM_NAMES[0]);}return;}
  j.t+=dt;j.x+=(tx-j.x)*Math.min(1,dt*2);j.y+=(ty-j.y)*Math.min(1,dt*2);
  if(j.window>0)j.window-=dt;
  const ph=j.phase;j.atkA-=dt;j.atkB-=dt;
  const emit=(a,s,dmg,col,r,toBc)=>shootE(j.x+Math.cos(a)*40,j.y+Math.sin(a)*40,a,s,dmg,col,r,toBc);
  if(ph===1){
    if(!G.enemies.some(o=>o.alive&&o.type==='antenna')){j.antT-=dt;if(j.antT<=0){j.antT=7;for(let i=0;i<3;i++){const a=rnd(0,TAU),r=rnd(140,240);spawnEnemy('antenna',clamp(bc.x+Math.cos(a)*r,40,W-40),clamp(bc.y+Math.sin(a)*r,40,H-40),{spawnT:.8});}banner('АНТЕННЫ ПОМЕХ','ТЯНУТ ЗАРЯД · ЗАКРЫВАЮТ ЯДРО');}}
    if(j.atkA<=0){j.atkA=2;const a=Math.atan2(p.y-j.y,p.x-j.x);for(let i=-1;i<=1;i++)emit(a+i*.2,250,10,'#4dd0ff',5,false);}
    if(j.atkB<=0){j.atkB=3.5;const a=Math.atan2(bc.y-j.y,bc.x-j.x);for(let i=-2;i<=2;i++)emit(a+i*.12,200,9,'#9fe8ff',5,true);}
  }else if(ph===2){
    if(!G.enemies.some(o=>o.alive&&o.type==='decoy')){j.decoyT-=dt;if(j.decoyT<=0){let x,y,t=0;do{x=rnd(80,W-80);y=rnd(80,H-80);}while(Math.hypot(x-bc.x,y-bc.y)<300&&++t<20);
      spawnEnemy('decoy',x,y,{spawnT:.6});banner('ЛОЖНЫЙ МАЯК','АВТОПРИЦЕЛ СБИТ · ОТМЕЧАЙТЕ ЦЕЛИ КЛИКОМ');}}
    j.spT-=dt;if(j.spT<=0){j.spOn=j.spOn>0?0:3;j.spT=j.spOn>0?3:1.6;}
    if(j.spOn>0){j.spAcc=(j.spAcc||0)+dt;while(j.spAcc>.12){j.spAcc-=.12;const base=j.t*1.6;for(let i=0;i<3;i++)emit(base+i/3*TAU,170,10,'#9fe8ff',5,false);}}
    if(j.atkA<=0){j.atkA=2.4;const a=Math.atan2(p.y-j.y,p.x-j.x);for(let i=-2;i<=2;i++)emit(a+i*.16,260,10,'#ffffff',5,false);}
  }else{
    G.dark=true;
    j.flashT-=dt;if(j.flashT<=0){j.flashT=16;j.window=4.5;if(G.bc){beaconFlash();banner('ВСПЫШКА МАЯКА','ЯДРО ГЛУШИТЕЛЯ ОТКРЫТО · 4,5 С');}else{G.lightFull=1;G.eb=[];sfx('flash');banner('ОКНО СВЕТА','ЯДРО ЭХА ОТКРЫТО · 4,5 С');}}
    if(j.atkA<=0){j.atkA=3.2;const gapA=Math.atan2(p.y-j.y,p.x-j.x)+rnd(-.6,.6);for(let i=0;i<28;i++){const a=i/28*TAU;if(Math.abs(angDiff(a,gapA))<.45)continue;emit(a,145,10,'#ff9fd0',6,false);}}
    if(j.atkB<=0){j.atkB=7;for(let i=0;i<2;i++){const a=rnd(0,TAU);const s=spawnEnemy('seeker',j.x+Math.cos(a)*50,j.y+Math.sin(a)*50,{life:7});s.vx=Math.cos(a)*120;s.vy=Math.sin(a)*120;}}
  }
}

