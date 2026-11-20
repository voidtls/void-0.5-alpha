// ===== 0.5.5: сектора III–IV — механики (лёд, износ, новые враги) =====
function secScale(){if(!inMission()||G.mode==='endless')return null;const M=MISSIONS[G.m-1];return M&&M.gen&&SEC_SCALE[M.sec]||null;}
function secRew(m){const M=MISSIONS[m-1];if(M&&M.gen&&SEC_SCALE[M.sec])return SEC_SCALE[M.sec].rew*(storyFlag('shore46')==='carry'?1.1:1);return m>18?2:1;}
function secReset(){Object.assign(G,{eng74:0,engT74:0,latch74:null,flag74T:0,box74c:false,ice:0,iceT:0,frozen:0,iceImm:0,wear:0,wearT:0,slick:false,posLog:[],waveHold:0,rustN:0,shieldPen:0,sb:null,lockShield:0,lockDash:0,lockGun:0,tiredT:0,waveForce:false,iceRing:null});}
// --- лёд ---
function addIce(n){const p=G.player;if(!p||p.hp<=0||G.iceImm>0||G.frozen>0)return;G.ice=Math.min(3,(G.ice||0)+n);G.iceT=2.5;sfx('block');
  if(G.ice>=3){G.frozen=.8;G.ice=0;G.iceImm=2;p.vx=p.vy=0;p.chg=0;floater(p.x,p.y-30,'КОРПУС ЗАМЁРЗ','#bfe8ff');shake(6);if(SET.fx)for(let i=0;i<14;i++)part(p.x,p.y,vrnd3(-120,120),vrnd3(-120,120),.5,'#dff6ff',2.5);}
  else hintOnce('ice','ОБЛЕДЕНЕНИЕ '+G.ice+'/3','#bfe8ff');}
function clearIce(){if(G.ice>0||G.frozen>0){G.ice=0;G.frozen=0;}}
function iceSpeedK(){return G.frozen>0?0:(1-.12*(G.ice||0))*(G.mode==='endless'?1:(1-.1*(G.eng74||0))*(G.latch74&&G.latch74.alive?.7:1)*(G.box74c?.85:1)*(G.slow80>0?.5:1));}
// --- износ (сектор IV) ---
function addWear(v){const st=G.st;if(!st||!st.maxHp0)return;const cap=Math.max(0,Math.min(st.maxHp0*.3,st.maxHp0-50));const w0=G.wear||0;G.wear=clamp(w0+v,0,cap);
  if(Math.floor(G.wear)!==Math.floor(w0)){computeStats();const p=G.player;if(p&&p.hp>st.maxHp)p.hp=st.maxHp;}}
function wearPct(){const st=G.st;return st&&st.maxHp0?Math.round((G.wear||0)/st.maxHp0*100):0;}
// --- каркасы и ржавые ---
function dropHull(e){const SS=SSW();if(!SS||!SS.rust||e.rebuilt||e.escort||EDEF[e.type].passive||['mite','mine','seeker','hull','icecopy','guard','hive','vortex','frost','archivist','repairer','corroder','cpart','shell','rustcopy','inventor','invcell','invcore','obheart','obseg'].includes(e.type))return;
  if(G.enemies.filter(o=>o.alive&&o.type==='hull').length>=4)return;
  spawnEnemy('hull',e.x,e.y,{hullOf:e.type,life:12,noAffix:true});}
function rebuild(h){if(!h.alive)return;h.alive=false;const e=spawnEnemy(h.hullOf,h.x,h.y,{noAffix:true,rebuilt:true,noLoot:true,spawnT:.6});e.hp=e.maxHp=Math.round(e.maxHp*.5);
  explode(h.x,h.y,'#a0522d',10,.7);floater(h.x,h.y-18,'СОБРАН ЗАНОВО','#ffb060');sfx('warn');}
// --- луч архиватора ---
function recBeamHit(e){const p=G.player;if(e.st!=='rec'||p.dashT<=0)return false;return segDist(p.px,p.py,p.x,p.y,e.x,e.y)<p.r+4||segDistP(p.x,p.y,e.x,e.y,e.bx,e.by)<p.r+6;}
function spawnCopy(e){const p=G.player,crystal=()=>{const a=Math.atan2(p.y-e.y,p.x-e.x);const q=shootE(e.x,e.y,a,300,10,'#dff6ff',6);if(q)q.frost=true;};
  if(storyFlag('inv14')==='cold'){crystal();floater(e.x,e.y-34,'КАТАЛОГ СОЖЖЁН · ЗАПИСЫВАТЬ НЕКУДА','#8fd8ff');return;}
  const log=G.posLog.filter(q=>G.t-q.t<=3);if(log.length<4){crystal();return;}let len=0,turn=0,pa=null;
  for(let i=1;i<log.length;i++){const dx=log[i].x-log[i-1].x,dy=log[i].y-log[i-1].y,l=Math.hypot(dx,dy);len+=l;if(l>4){const a=Math.atan2(dy,dx);if(pa!==null)turn+=Math.abs(angDiff(a,pa));pa=a;}}
  if(len<120||G.enemies.filter(o=>o.alive&&o.type==='icecopy').length>=3){crystal();return;}
  const path=log.map(q=>({x:q.x,y:q.y,t:q.t-log[0].t}));
  const c=spawnEnemy('icecopy',path[0].x,path[0].y,{path,pt:0,noAffix:true,noLoot:true,spawnT:.25,fire:true,frate:Math.max(.5,G.st.rate*2)*atkK()*(turn>9.4?2:1),fdmg:clamp(G.st.dmg*.5,6,22),skin:curSkin()});c.contact=14;
  if(turn>9.4)floater(c.x,c.y-22,'ЛОМАНЫЙ МАРШРУТ · КОПИЯ ЦЕЛИТСЯ ВДВОЕ РЕЖЕ','#8fd8ff');}
// --- обновление новых врагов (вызывается из updateEnemies перед switch; true = обработан) ---
function secEnemyUpdate(e,dt,ctx_){if(e.zb){zbAI(e,dt,ctx_);return true;}const p=G.player,{ux,uy,d,sm,T,pd}=ctx_;if(s74Update(e,dt,ctx_))return true;
  if(e.type==='rustcopy'&&G.world&&(e.pack||e.conv||e.peace!==undefined)){w58CopyAI(e,dt,ctx_);return true;}
  switch(e.type){
    case 'frost':{const m=clamp((d-240)/120,-1,1);steer(e,ux*m-uy*.6*e.dir,uy*m+ux*.6*e.dir,e.spd*sm,dt,3);if(Math.random()<dt*.25)e.dir*=-1;
      e.cd-=dt;if(e.cd<=0&&onScreen(e)){const b=shootE(e.x,e.y,Math.atan2(T.y-e.y,T.x-e.x)+rnd(-.08,.08),170,6,'#bfe8ff',6,!!T.isBc);if(b)b.frost=true;e.cd=rnd(1.6,2.1);}return true;}
    case 'archivist':{if(e.wander){w58WanderAI(e,dt,ctx_);return true;}
      if(e.st==='rec'){e.timer-=dt;e.bx=p.x;e.by=p.y;e.vx*=.9;e.vy*=.9;
        if(e.hp<=e.recHp-e.maxHp*.3||recBeamHit(e)){e.st='seek';e.cd=3;floater(e.x,e.y-20,'ЗАПИСЬ ПРЕРВАНА','#8fd8ff');sfx('block');}
        else if(e.timer<=0){e.st='seek';e.cd=rnd(4,5.5);spawnCopy(e);floater(e.x,e.y-20,'ЗАПИСЬ ПРИНЯТА · ДУБЛИКАТ','#8fd8ff');}return true;}
      const m=clamp((d-300)/120,-1,1);steer(e,ux*m-uy*.5*e.dir,uy*m+ux*.5*e.dir,e.spd*sm,dt,3);if(Math.random()<dt*.2)e.dir*=-1;
      e.cd-=dt;if(e.cd<=0&&d<520&&onScreen(e)&&p.hp>0){e.st='rec';e.timer=G.ice>0?2:3;e.recHp=e.hp;e.bx=p.x;e.by=p.y;sfx('warn');}return true;}
    case 'icecopy':{const P=e.path;e.pt+=dt;
      if(!P||!P.length){e.alive=false;return true;}if(!(e.tailT>0)){let i=0;while(i<P.length-1&&P[i+1].t<e.pt)i++;
        if(i>=P.length-1){e.tailT=1.5;const n=P.length,a=P[n-1],b0=P[Math.max(0,n-2)],dtp=Math.max(.05,a.t-b0.t);let vx=(a.x-b0.x)/dtp,vy=(a.y-b0.y)/dtp;const sp=Math.hypot(vx,vy)||1,s2=Math.min(sp,320);e.tvx=vx*s2/sp;e.tvy=vy*s2/sp;if(s2<20){const f=e.face||0;e.tvx=Math.cos(f)*120;e.tvy=Math.sin(f)*120;}}
        else{const a=P[i],b=P[i+1],k=clamp((e.pt-a.t)/Math.max(.001,b.t-a.t),0,1);if(!e.fire)e.face=Math.atan2(b.y-a.y,b.x-a.x);e.x=a.x+(b.x-a.x)*k;e.y=a.y+(b.y-a.y)*k;}}
      if(e.tailT>0){e.tailT-=dt;e.x+=e.tvx*dt;e.y+=e.tvy*dt;if(e.tailT<=0||e.x<-40||e.x>W+40||e.y<-40||e.y>H+40){e.alive=false;explode(e.x,e.y,'#dff6ff',8,.5);return true;}}
      e.vx=e.vy=0;
      if(e.fire&&p.hp>0&&e.spawnT<=0){e.face=Math.atan2(p.y-e.y,p.x-e.x);e.fcd=(e.fcd||0)-dt;if(e.fcd<=0&&onScreen(e)){e.fcd=e.frate;const tx=p.x+p.vx*.25,ty=p.y+p.vy*.25,a=Math.atan2(ty-e.y,tx-e.x);const q=shootE(e.x+Math.cos(a)*16,e.y+Math.sin(a)*16,a,540,e.fdmg,'#dff6ff',4);if(q){q.frost=true;q.copy=true;}}}
      return true;}
    case 'rustcopy':{const pdx=p.x-e.x,pdy=p.y-e.y,m=clamp((pd-220)/100,-1,1);steer(e,pdx/pd*m-pdy/pd*.7*e.dir,pdy/pd*m+pdx/pd*.7*e.dir,e.spd*sm,dt,3);if(Math.random()<dt*.3)e.dir*=-1;e.face=Math.atan2(pdy,pdx);
      e.cd-=dt;if(e.cd<=0&&onScreen(e)&&p.hp>0){e.cd=rnd(1.2,1.6);const a=Math.atan2(p.y+p.vy*.2-e.y,p.x+p.vx*.2-e.x);const q=shootE(e.x+Math.cos(a)*14,e.y+Math.sin(a)*14,a,430,8,'#ffb060',4);if(q)q.copy=true;}return true;}
    case 'inventor':if(!e.sbk&&!sbAdopt(e))return true;updateInv(e,dt);return true;
    case 'obheart':if(!e.sbk&&!sbAdopt(e))return true;updateOb(e,dt);return true;
    case 'invcell':case 'invcore':case 'obseg':e.vx=e.vy=0;return true;
    case 'corroder':{const m=clamp((d-260)/120,-1,1);steer(e,ux*m-uy*.4*e.dir,uy*m+ux*.4*e.dir,e.spd*sm,dt,1.5);
      e.cd-=dt;if(e.cd<=0&&onScreen(e)){e.cd=rnd(4.5,5.5);const n=G.fields.filter(f=>f.rust&&!f.strip).length;
        if(n<3){G.fields.push({x:e.x+rnd(-20,20),y:e.y+rnd(-20,20),r:90,t:6,max:6,hit:true,rust:true});sfx('warn');}
        else{const b=shootE(e.x,e.y,Math.atan2(T.y-e.y,T.x-e.x),220,0,'#c96a2a',7,false);if(b)b.rust=true;}}return true;}
    case 'repairer':{const pdx=p.x-e.x,pdy=p.y-e.y;
      if(e.hunt>0){e.hunt-=dt;if(e.huntCd>0)e.huntCd-=dt;steer(e,pdx,pdy,e.spd*sm,dt,3.5);e.fix=null;e.chan=0;
        if(pd<e.r+p.r+6&&!(e.huntCd>0)&&p.hp>0&&p.dashT<=0&&p.inv<=0){e.huntCd=1;addWear(G.st.maxHp0*.02);floater(p.x,p.y-26,'ИЗНОС','#ffb060');sfx('block');}return true;}
      let tg=null,td=1e9;for(const o of G.enemies){if(!o.alive||o===e||o.spawnT>0)continue;if(o.type==='hull'){const q=Math.hypot(o.x-e.x,o.y-e.y)-400;if(q<td){td=q;tg=o;}}
        else if(o.hp<o.maxHp*.9&&(!EDEF[o.type].passive||o.type==='obseg')&&o.type!=='repairer'&&!o.sbk){const q=Math.hypot(o.x-e.x,o.y-e.y);if(q<td){td=q;tg=o;}}}
      if(!tg){const m=clamp((pd-330)/100,-1,1);steer(e,(p.x-e.x)/pd*m-(p.y-e.y)/pd*.6*e.dir,(p.y-e.y)/pd*m+(p.x-e.x)/pd*.6*e.dir,e.spd*.6*sm,dt,2);e.chan=0;e.fix=null;return true;}
      const q=Math.hypot(tg.x-e.x,tg.y-e.y);if(q>42){steer(e,tg.x-e.x,tg.y-e.y,e.spd*sm,dt,3);e.chan=0;return true;}
      e.vx*=.8;e.vy*=.8;e.fix=tg;
      if(tg.type==='hull'){e.chan=(e.chan||0)+dt;if(e.chan>=4){e.chan=0;rebuild(tg);}}
      else{tg.hp=Math.min(tg.maxHp,tg.hp+8*dt);if(SET.fx&&vR3()<.3)part(tg.x+vrnd3(-8,8),tg.y+vrnd3(-8,8),0,-30,.3,'#ffb060',2);}return true;}
    case 'hull':{e.life-=dt;e.vx*=.95;e.vy*=.95;if(e.life<=0)e.alive=false;return true;}
  }return false;}
// --- тик (из update) ---
function secTick(dt){const SS=SSW(),p=G.player;if(!SS||!p)return;
  G.posLog.push({t:G.t,x:p.x,y:p.y});if(G.posLog.length>240)G.posLog.splice(0,G.posLog.length-240);
  if(G.iceT>0){G.iceT-=dt;if(G.iceT<=0&&G.ice>0){G.ice--;G.iceT=2.5;}}
  if(G.frozen>0){G.frozen-=dt;p.vx=p.vy=0;}
  if(p.hp>G.st.maxHp)p.hp=G.st.maxHp;
  if(G.iceImm>0)G.iceImm-=dt;if(G.shieldPen>0)G.shieldPen-=dt;if(G.waveHold>0)G.waveHold-=dt;
  if(G.lockShield>0){G.lockShield-=dt;p.shieldUp=false;p.shieldT=0;}if(G.lockDash>0)G.lockDash-=dt;if(G.lockGun>0)G.lockGun-=dt;
  G.slick=false;let inRust=false;
  for(const f of G.fields){if(!f.ice&&!f.rust)continue;const dd=Math.hypot(p.x-f.x,p.y-f.y);
    if(f.ice&&dd<f.r)G.slick=true;if(f.rust&&!f.strip&&dd<f.r&&p.hp>0)inRust=true;
    if(f.strip)for(const e of G.enemies){if(e.alive&&Math.hypot(e.x-f.x,e.y-f.y)<f.r)e.noArm=.5;}}
  if(inRust){addWear(dt);if(Math.random()<dt*2)hintOnce('rust','ИЗНОС КОРПУСА','#c96a2a');}
  if(SS.rust&&inMission()&&p.hp>0&&!G.sb&&storyFlag('obod18')!=='scrap'){G.wearT=(G.wearT||0)+dt;const per=storyFlag('factory')?90:45;if(G.wearT>=per){G.wearT-=per;if(wearPct()<12)addWear(G.st.maxHp0*.01);}}
  for(const e of G.enemies){if(e.noArm>0)e.noArm-=dt;if(e.shieldDown>0)e.shieldDown-=dt;if(e.type==='guard'&&SS.ice)e.iceGuard=true;}
  for(const e of G.enemies)if(e.alive)e.slick=G.fields.some(f=>f.ice&&Math.hypot(e.x-f.x,e.y-f.y)<f.r);
}
// --- отрисовка (из render, после врагов) ---
function secDraw(t){const SS=SSW(),p=G.player;if(!SS)return;
  for(const f of G.fields){const k=f.t/f.max;if(f.ice){ctx.fillStyle='#bfe8ff';ctx.globalAlpha=(.08+.1*k)*COLD_A;ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,TAU);ctx.fill();ctx.strokeStyle='#dff6ff';ctx.globalAlpha=.35*k*COLD_A;ctx.lineWidth=1;ctx.stroke();}
    if(f.rust){ctx.fillStyle=f.strip?'#ffb060':'#8a3a12';ctx.globalAlpha=(f.strip?.12:.22)*Math.min(1,k*3);ctx.beginPath();for(let i=0;i<=20;i++){const a=i/20*TAU,rr=f.r*(1+.08*Math.sin(a*5+t*2));ctx.lineTo(f.x+Math.cos(a)*rr,f.y+Math.sin(a)*rr);}ctx.closePath();ctx.fill();
      ctx.strokeStyle='#c96a2a';ctx.globalAlpha=.4*k;ctx.lineWidth=1.5;ctx.stroke();}}
  ctx.globalAlpha=1;
  for(const e of G.enemies){if(!e.alive)continue;
    if(e.type==='archivist'&&e.st==='rec'&&!G.noTele){ctx.strokeStyle='#8fd8ff';ctx.globalAlpha=.35+.35*Math.sin(t*20);ctx.lineWidth=2;ctx.setLineDash([4,5]);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.bx,e.by);ctx.stroke();ctx.setLineDash([]);
      ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(e.x,e.y,e.r+6,-Math.PI/2,-Math.PI/2+TAU*(1-e.timer/(G.ice>0?2:3)));ctx.stroke();ctx.globalAlpha=1;}
    if(e.type==='repairer'&&e.fix&&e.fix.alive&&Math.hypot(e.fix.x-e.x,e.fix.y-e.y)<60){ctx.strokeStyle='#ffb060';ctx.globalAlpha=.6;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.fix.x,e.fix.y);ctx.stroke();
      if(e.fix.type==='hull'&&e.chan>0){ctx.beginPath();ctx.arc(e.fix.x,e.fix.y,16,-Math.PI/2,-Math.PI/2+TAU*e.chan/4);ctx.lineWidth=3;ctx.stroke();}ctx.globalAlpha=1;}
    if(e.secArm&&!(e.noArm>0)&&e.spawnT<=0&&!EDEF[e.type].passive){ctx.strokeStyle=SS.col;ctx.globalAlpha=.55;ctx.lineWidth=1;ctx.beginPath();ctx.arc(e.x,e.y,e.r+3,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
    if(e.type==='guard'&&e.iceGuard&&e.cracks>0&&!(e.shieldDown>0)){ctx.strokeStyle='#dff6ff';ctx.globalAlpha=.5;ctx.lineWidth=1;const a0=e.face-1.05;ctx.beginPath();ctx.arc(e.x,e.y,e.r+9,a0,a0+2.1*e.cracks/10);ctx.stroke();ctx.globalAlpha=1;}}
  if(p&&p.hp>0&&(G.ice>0||G.frozen>0)){ctx.strokeStyle='#dff6ff';ctx.lineWidth=1.5;const n=G.frozen>0?3:G.ice;for(let i=0;i<n;i++){const a=t*1.5+i*TAU/3;const x=p.x+Math.cos(a)*22,y=p.y+Math.sin(a)*22;ctx.globalAlpha=.9;ctx.beginPath();for(let k=0;k<3;k++){const b=k*Math.PI/3;ctx.moveTo(x-Math.cos(b)*4,y-Math.sin(b)*4);ctx.lineTo(x+Math.cos(b)*4,y+Math.sin(b)*4);}ctx.stroke();}
    if(G.frozen>0){ctx.globalAlpha=.5;ctx.fillStyle='#dff6ff';ctx.beginPath();ctx.arc(p.x,p.y,p.r+6,0,TAU);ctx.fill();}ctx.globalAlpha=1;}}
// виньетка сектора (экранные координаты)
function secVignette(){const SS=secScale();if(!SS||!G.player||G.state==='menu')return;ctx.setTransform(1,0,0,1,0,0);const k=SS.ice?Math.min(1,.35+.3*(G.ice||0)+(G.frozen>0?.6:0)):.35,CW_=cv.width,CH_=cv.height;
  const V=SS.ice?['191,232,255',.22*k*COLD_A]:SS.brood?['255,107,138',.14+.04*Math.sin(G.t*TAU/1.2)]:SS.mercy?['120,135,160',.2]:SS.bureau?['232,210,122',.1+.05*(G.bo80||0)]:SS.ark?['216,54,74',.12+.08*beat90(G.t)]:SS.zero?(G.x110&&G.x110.k==='launch'?['159,216,255',.07]:['255,159,224',.07+.08*(G.x110&&G.x110.vig||0)]):SS.shore?['122,255,201',.08]:SS.source?['107,140,255',.12+.03*Math.sin(G.t*TAU/3)]:['138,58,18',.18+.015*wearPct()];
  const a=clamp(V[1],0,1)*(isMob()?.67:1);if(a<=.002)return;ctx.globalAlpha=a;ctx.drawImage(secVigSpr96(V[0],CW_,CH_),0,0,CW_,CH_);ctx.globalAlpha=1;}

