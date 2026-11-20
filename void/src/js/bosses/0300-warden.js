// ---------- Страж ----------
const PHASE_NAMES=['ПРОБУЖДЕНИЕ','ПРИЦЕЛЬНЫЙ КОНТУР','АГОНИЯ ЯДРА'];
const PATTERNS=[['spiral','aimed'],['spiral','sweep','aimed'],['rings','sweep','seekers','spiral']];
function spawnBoss(){ambSting('boss');
  const b=spawnEnemy('boss',W/2,-120);
  Object.assign(b,{st:'enter',timer:2.6,phase:1,over:0,atk:null,atkT:1.6,patI:0,rot:0,domeFlash:0,deathT:0});
  G.boss=b;banner('СТРАЖ ПРОБУЖДАЕТСЯ','ФАЗА 1 · '+PHASE_NAMES[0]);sfx('warn');storyWarden();
}
function bossShielded(){return G.enemies.some(o=>o.alive&&o.type==='pylon');}
function spawnPylons(b){
  const n=2+b.phase;const R=150+b.phase*12;const dir=Math.random()<.5?1:-1;
  for(let i=0;i<n;i++){const orb=i/n*TAU;spawnEnemy('pylon',b.x+Math.cos(orb)*R,b.y+Math.sin(orb)*R*.8,{orb,R,dir,spawnT:1,cd:rnd(1.5,4)});}
}
function startOverload(b){if(G.mc)G.mc.overloads++;b.over=6.5;b.atk=null;G.eb=G.eb.filter(x=>!x.boss);banner('ПЕРЕГРУЗКА ЯДРА','ЯДРО УЯЗВИМО · УРОН ×1,5');sfx('level');shake(8);}
function phaseShift(b){ambSting('phase');
  b.phase++;b.over=0;b.atk=null;b.atkT=2.4;b.patI=0;
  G.shock.push({x:b.x,y:b.y,r:20,R:Math.max(W,H),t:0,col:'#b48cff',slow:true});G.eb=[];
  G.enemies.forEach(o=>{if(o.type==='pylon')o.alive=false;});
  spawnPylons(b);
  if(b.phase===2){edgeSpawn('guard');edgeSpawn('guard');}
  if(b.phase===3){edgeSpawn('guard');}
  banner('ФАЗА '+b.phase,PHASE_NAMES[b.phase-1]);sfx('bigboom');shake(14);
}
function bossDeath(b){ambSting('bossDown');buzz('boss');
  b.alive=true;b.st='dying';b.deathT=2.6;b.hp=0;G.eb=[];G.enemies.forEach(o=>{if(o!==b&&o.alive){kill(o,true);}});
  if(G.mode!=='endless')banner('ЯДРО РАЗРУШЕНО','АКТ I ЗАВЕРШЁН');G.score+=EDEF.boss.pts;G.kills++;
}
function updateBoss(b,dt){
  const p=G.player;b.rot+=dt*(b.over>0?.25:.6+b.phase*.15);if(b.domeFlash>0)b.domeFlash-=dt;
  if(b.st==='dying'){b.deathT-=dt;shake(6);if(Math.random()<.5)explode(b.x+rnd(-50,50),b.y+rnd(-50,50),Math.random()<.5?'#b48cff':'#8fe9ff',8,.8);
    if(b.deathT<=0){b.alive=false;explode(b.x,b.y,'#ffffff',120,2.2);sfx('bigboom');shake(20);G.boss=null;G.endT=2.2;}return;}
  if(b.st==='enter'){b.y+=(H*.26-b.y)*Math.min(1,dt*1.4);b.timer-=dt;if(b.timer<=0){b.st='fight';spawnPylons(b);}return;}
  b.t+=dt;const amp=b.phase===3?W*.3:W*.2;
  const tx=W/2+Math.sin(b.t*.27)*amp,ty=H*.26+Math.sin(b.t*.53)*H*.05;const k=Math.min(1,dt*(b.over>0?.3:1.2)*G.eSpd);b.x+=(tx-b.x)*k;b.y+=(ty-b.y)*k;
  if(b.over>0){b.over-=dt;if(SET.fx&&vR3()<.4)part(b.x+vrnd3(-30,30),b.y+vrnd3(-30,30),vrnd3(-80,80),vrnd3(-80,80),.4,'#ffffff',2);
    if(b.over<=0){spawnPylons(b);banner('ЯДРО СТАБИЛИЗИРОВАНО','ЗАРЯДЫ ВОССТАНАВЛИВАЮТСЯ');b.atkT=1.8;}return;}
  if(!b.atk){b.atkT-=dt*missionK('rate');if(b.atkT<=0){const list=PATTERNS[b.phase-1];b.atk={type:list[b.patI%list.length],t:0,n:0,dir:Math.random()<.5?1:-1};b.patI++;
    if(b.atk.type==='sweep'){b.atk.a0=Math.atan2(p.y-b.y,p.x-b.x)-b.atk.dir*.95;}}return;}
  const A=b.atk;A.t+=dt;const ph=b.phase;
  const emit=(a,s,dmg=10,col='#d7c4ff',r=5)=>{const q=shootE(b.x+Math.cos(a)*40,b.y+Math.sin(a)*40,a,s,dmg,col,r);if(q)q.boss=true;};
  let done=false;
  switch(A.type){
    case 'spiral':{const dur=3.2,step=ph===3?.09:.11,arms=2+ph;while(A.n*step<Math.min(A.t,dur)){const base=A.n*step*1.7*A.dir;for(let i=0;i<arms;i++)emit(base+i/arms*TAU,160+28*ph);A.n++;}done=A.t>dur;break;}
    case 'aimed':{const times=[0,.45,.9];while(A.n<times.length&&A.t>=times[A.n]){const a=Math.atan2(p.y-b.y,p.x-b.x);for(let i=-2;i<=2;i++)emit(a+i*.17,255,10,'#ffffff');A.n++;}done=A.t>1.4;break;}
    case 'sweep':{A.ang=A.t<1?A.a0:A.a0+A.dir*1.9*clamp((A.t-1)/2.4,0,1);
      if(A.t>1&&A.t<3.4){const ex=b.x+Math.cos(A.ang)*2000,ey=b.y+Math.sin(A.ang)*2000;if(segDist(b.x,b.y,ex,ey,p.x,p.y)<20)damagePlayer(16);}
      done=A.t>3.5;break;}
    case 'rings':{const times=[0,.8,1.6];while(A.n<times.length&&A.t>=times[A.n]){const gapA=Math.atan2(p.y-b.y,p.x-b.x)+rnd(-.7,.7);const N=30;for(let i=0;i<N;i++){const a=i/N*TAU;if(Math.abs(angDiff(a,gapA))<.42)continue;emit(a,150,10,'#ff9fd0',6);}A.n++;}done=A.t>2.2;break;}
    case 'seekers':{if(A.n===0){for(let i=0;i<3;i++){const a=Math.PI/2+(i-1)*.9;const s=spawnEnemy('seeker',b.x+Math.cos(a)*50,b.y+Math.sin(a)*50,{life:7});s.vx=Math.cos(a)*120;s.vy=Math.sin(a)*120;}A.n=1;}done=A.t>1;break;}
  }
  if(done){b.atk=null;b.atkT=[1.4,1.1,.9][ph-1];}
}

