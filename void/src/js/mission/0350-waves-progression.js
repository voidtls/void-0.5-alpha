// ---------- Прогрессия: волны и миссии ----------
function setupMission(i){const _r=Math.random;Math.random=mulberry(G.layoutSeed||1);try{setupMission0(i);}finally{Math.random=_r;}}
function setupMission0(i){
  G.m=i+1;const M=MISSIONS[i];
  Object.assign(G,{enemies:[],pb:[],eb:[],pick:[],parts:[],float:[],warns:[],shock:[],prio:null,boss:null,endT:0,deadT:0,bc:null,relays:[],rocks:[],fields:[],meteors:[],meteorT:0,meteorN:0,
    affix2:M.gen?M.affix2:i+1>=10?.25:0,lowFx:false,
    storm:null,stormT:rnd(10,16),flare:0,fake:null,lureP:null,dashLog:[],dark:!!M.dark,lightFull:0,jam:null,bpQ:0,loseBeacon:false,bcTaken:0,affixCh:(M.affix||0),dirT:1.5,evUsed:[],rockN:M.rocks||0,rockT:8,
    mc:{dashes:0,cells:0,pulses:0,prioKills:0,lanceHits:0,overloads:0,transPaused:false},combo:null,bossMul:0,aimLock:null,sb:null,sbLomK:1,lom74:0,sbChoiceTxt:'',tiredT:0,waveForce:false,noTele:!!(inMission()&&curDiff().hideTele)});
  G.waves=M.waves?M.waves.map(parseWave):M.wavesT?M.wavesT.map(w=>shuffle(w.slice())):[];G.waveBase=G.waves.map(w=>w.length);G.waves=G.waves.map(scaleWave);G.waveCap=99;G.waveIdx=0;G.spawnQ=[];G.gapT=1.2;G.waveT=0;G.mT=0;G.missionKills=G.kills;G.missionTaken=G.taken;G.bossSpawned=false;
  const p=G.player;p.x=W/2;p.y=H*.7;p.px=p.x;p.py=p.y;p.vx=p.vy=0;p.inv=1.2;p.dashT=0;p.dashCd=0;p.trail=[];p.cargo=0;p.noDash=0;
  if(perk('pre'))p.en=Math.max(p.en,30*perk('pre'));
  if(M.beacon){
    G.bc=makeBeacon(M);if(curDiff().bcHp){G.bc.hp*=curDiff().bcHp;G.bc.maxHp=G.bc.hp;}{const tk=document.querySelectorAll('#bcBar .tick');tk.forEach((t,ix)=>t.style.display=G.bc.thr.includes([25,50,75][ix])?'':'none');}const ba=60*perk('bcar');G.bc.hp+=ba;G.bc.maxHp+=ba;
    if(M.relays)G.relays=[0,1,2].map(()=>({x:0,y:0,cut:false,rep:0}));
    layoutBeacon();p.x=G.bc.x;p.y=G.bc.y+bcRing()*.6;p.px=p.x;p.py=p.y;
    if(M.rocks)spawnRocks(M.rocks);
    G.script=M.script.map(o=>({...o,done:false}));
    G.evAt=[];for(let k=0;k<(M.events||0);k++)G.evAt.push(rnd(25,85));G.evAt.sort((a,b)=>a-b);
  }else{G.script=[];G.evAt=[];}
  secReset();computeStats();t74Init(M);t80Init(M);
}
function updateWaves(dt){
  G.mT+=dt;
  const M=MISSIONS[G.m-1];
  const alive=G.enemies.filter(e=>e.alive&&!EDEF[e.type].passive).length+G.warns.length,aliveW=alive-(G.x90&&G.x90.alarmOn?ob96N():0);
  if(G.spawnQ.length){G.spawnT-=dt;if(G.spawnT<=0&&aliveW<G.waveCap){const ty=G.spawnQ.shift();if(typeof ty==='string'&&ty.startsWith('pack:'))packSpawn(ty.slice(5));else if(typeof ty==='string'&&ty.startsWith('mem:'))mem100Spawn(ty.slice(4));else if(typeof ty==='string'&&ty.startsWith('e95:'))edgeSpawn(EDEF[ty.slice(4)]?ty.slice(4):'gunner',{e95:1});else edgeSpawn(ty);G.spawnT=clamp(3.2/G.waveSize,.18,.5);}}
  else if(G.waveIdx<G.waves.length){
    G.waveT+=dt;const SSw=secScale();
    const ready=!(G.waveHold>0)&&(G.waveIdx===0||G.waveForce||aliveW<=Math.max(SSw?2:1,Math.floor(G.waveSize*.3))||G.waveT>24);
    if(ready){G.gapT-=dt;if(G.gapT<=0){G.waveCap=Math.max(1,Math.round(G.waveBase[G.waveIdx]*liveMul()));G.spawnQ=G.waves[G.waveIdx].slice();G.waveSize=G.spawnQ.length;G.waveIdx++;if(M.debut&&G.waveIdx===1)G.waveHold=6;G.spawnT=0;G.waveT=0;G.gapT=SSw?1.2:1.6;G.waveForce=false;
      if(!noHeal()&&G.player.hp<G.st.maxHp*.6&&Math.random()<.5*curDiff().rep)G.pick.push({k:'rep',x:rnd(W*.25,W*.75),y:rnd(H*.3,H*.7),vx:0,vy:0,r:10,t:0,life:25});}}
  }
  else if((M.boss||M.sboss)&&!G.bossSpawned){if(alive===0){G.gapT-=dt;if(G.gapT<=0){G.bossSpawned=true;if(M.sboss)spawnSB(M.sboss);else spawnBoss();}}}
  else if(!M.boss&&!M.sboss&&alive===0&&G.endT<=0&&!x110Block()){G.endT=1.6;G.enemies.forEach(e=>{if(e.type==='mine')e.life=0;});banner('ЗОНА ЧИСТА','СБОР ДАННЫХ');return;}
  if(G.endT>0){G.endT-=dt;if(G.endT<=0)missionComplete();}
}
function sigProgress(){const n=G.waves.length;if(!n||!G.waveIdx)return 0;const alive=G.enemies.filter(e=>e.alive&&!EDEF[e.type].passive).length+G.warns.length+G.spawnQ.length;return clamp((G.waveIdx-1+clamp(1-alive/Math.max(1,G.waveSize),0,1))/n,0,1);}

