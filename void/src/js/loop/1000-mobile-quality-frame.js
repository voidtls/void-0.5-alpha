// ===== 0.6.0: адаптивное качество (только телефон и планшет; ПК — как было) =====
let qAcc=0,qN=0,qT=0,qChg=0,qGood=0;
function qStart(){return G.ff==='tablet'?2:1;}
function qApply(){if(!isMob()){PMAX=900;GLOWMAX=0;return;}PMAX=[250,500,900][G.q];GLOWMAX=G.q===2?0:G.q===1?60:0;G.lowFx=G.q===0;const d=Math.min(dprCap(),window.devicePixelRatio||1);if(Math.abs(d-DPR)>.01)resize();}
function qTick(dt,now){
  if(!isMob()){if(G.q!==2){G.q=2;qApply();}return;}
  if(SET.quality!=='auto'){const v=+SET.quality;if(G.q!==v){G.q=v;qApply();}return;}
  if(G.qInit!==G.ff){G.qInit=G.ff;G.q=qStart();qApply();}
  if(!(G.state==='play'||G.state==='world')){qAcc=qN=qT=0;return;}
  qAcc+=dt;qN++;qT+=dt;if(qT<2)return;const avg=qAcc/Math.max(1,qN);qAcc=qN=qT=0;if(G.lowFx!==(G.q===0))G.lowFx=G.q===0;
  if(now-qChg<8000)return;
  if(avg>qDn27()&&G.q>0){G.q--;qChg=now;qGood=0;qApply();}/* ARCH·91 */
  else if(avg<qUp27()){qGood+=2;if(qGood>=20&&G.q<qStart()){G.q++;qChg=now;qGood=0;qApply();}}else qGood=0;}
// ===== 0.6.0: сон экрана =====
let wakeL=null,wakeTry=0;
function wakeSync(now){const want=isMob()&&!document.hidden&&G.state!=='menu'&&G.state!=='pause'&&G.state!=='settings';
  if(want&&!wakeL&&navigator.wakeLock&&now-wakeTry>5000&&!(document.featurePolicy&&document.featurePolicy.allowsFeature&&!document.featurePolicy.allowsFeature('screen-wake-lock'))){wakeTry=now;try{navigator.wakeLock.request('screen').then(l=>{wakeL=l;l.addEventListener('release',()=>{wakeL=null;});},()=>{});}catch(e){}}
  else if(!want&&wakeL){try{wakeL.release();}catch(e){}wakeL=null;}}
function camZTarget(){if(typeof zbCamZ==='function'){const z=zbCamZ();if(z)return z;}if(!isMob()||(RMQ&&RMQ.matches))return 1;if(G.state==='play'&&!G.world)return (G.sb&&G.sb.alive&&G.sb.st!=='enter')||(G.boss&&G.boss.alive)||(G.jam&&G.jam.alive)?1.15:1;if(G.state==='world')return G.calm>3?1.1:1;return G.camZ||1;}
function mobTick(dt,now){
  if(G.resumeK>0&&(G.state==='play'||G.state==='world'))G.resumeK=Math.max(0,G.resumeK-dt);else if(G.state!=='pause')G.resumeK=0;
  const zt=camZTarget(),z=G.camZ||1;if(Math.abs(zt-z)>.001){G.camZ=z+clamp(zt-z,-.15*dt,.15*dt);setScale();}
  touchTick(dt);qTick(dt,now);wakeSync(now);padTick(now);tutTick();
  cv.classList.toggle('fs-cursor',!isMob()&&FS.state==='native'&&(G.state==='play'||G.state==='world')&&now-(MOUSE.mvAt||0)>2500);}
function frame(now){
  if(!ARCH.off['A-20']&&!ARCH.off['A-19'])return frame74(now);/* ARCH·73 A-20 */
  if(isMob()&&SET.fps===30&&now-last<29&&now>=last){requestAnimationFrame(frame);return;}
  const dt0=Math.min(.05,Math.max(0,(now-last)/1000));last=now;if(!ARCH.off['A-19'])ARCH.clk+=dt0;/* ARCH·72 A-19 */
  try{mobTick(dt0,now);}catch(err){console.error(err);}
  const dt=hsK90(G.resumeK>0&&(G.state==='play'||G.state==='world')?dt0*.3:dt0,dt0),sub=isMob()&&SET.fps===30&&dt>.025?2:1;G.rdtU96=(devOn('speed')?2:1)*sub;G.rdt90=(G.rdt90||dt)/sub;
  if(dt>0)fpsAvg+=(1/dt-fpsAvg)*.05;
  if(G.mode==='endless'&&G.state==='play'&&!G.lowFx){G.fpsLow=dt>1/40?(G.fpsLow||0)+dt:Math.max(0,(G.fpsLow||0)-dt*.5);if(G.fpsLow>3)G.lowFx=true;}
  try{if(G.state==='play'){const reps=(devOn('speed')?2:1)*sub;for(let r=0;r<reps&&G.state==='play';r++)update(dt/sub);if(G.mode==='endless')updateEndlessHUD();else updateHUD();}
    else if(G.state==='world'){if(G.prologue)prologueTick(dt);else{for(let r=0;r<sub&&G.state==='world';r++)worldUpdate(dt/sub);updateWorldHUD();}}
    else if(G.state==='hangar')drawHangarPreviews(now);else if(G.state==='arsenal')arsDemoTick(now);arch69Ok();}catch(err){console.error(err);arch69Fault(err);/* ARCH·69 A-4 */}
  try{if(G.prologue&&G.state!=='world')prologueEnd();if(G.state!=='world'&&G.state!=='play'&&G.radio&&G.radio.cur)radioClear();if(G.state==='menu')menuGlitch(dt);else menuGlitchOff();}catch(err){console.error(err);}
  try{musicTick(dt);if(G.state!=='play'&&G.x90&&(G.x90.hudAll||G.x90.hud&&G.x90.hud.cur))clearHud100();}catch(err){console.error(err);}
  try{if(G.world&&G.player)renderWorld(now);else{render(now);secVignette();}mobOverlay(now);drawDevOverlay();if(G.dev.diag77||D77.on)diag77(now,dt0,-1);/* ARCH·77 */}catch(err){console.error(err);}
  requestAnimationFrame(frame);
}
addEventListener('resize',resize);
saveSet6(migrateSave(store('void_world')),'load');
document.documentElement.style.setProperty('--fs',SET.textScale||1);resize();renderSettings();renderMenu();show('sMenu');requestAnimationFrame(frame);
queueMicrotask(()=>cloudInit());

