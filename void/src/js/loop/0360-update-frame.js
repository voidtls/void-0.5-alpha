// ---------- Обновление кадра ----------
function update(dt){
  applyWH();BW=W;BH=H;missionCam(dt);
  G.t+=dt;
  if(G.mode==='world'&&G.state==='play')radioTick(dt,'mission');
  if(G.deadT>0){G.deadT-=dt;updateFx(dt);if(G.deadT<=0)gameOver();return;}
  updatePlayer(dt);t75Tick(dt);t80Tick(dt);secTick(dt);if(inMission())t74Tick(dt);tiredTick(dt);regenTick(dt);comboTick();
  for(const w of G.warns){w.t-=dt;if(w.t<=0){const o2={};if(w.o){if(w.o.pair)o2.pair=w.o.pair;if(w.o.elite)o2.elite=true;if(w.o.mem100)o2.mem100=1;}const e=spawnEnemy(w.type,w.x,w.y,o2);const a=Math.atan2(H/2-w.y,W/2-w.x);e.vx=Math.cos(a)*e.spd;e.vy=Math.sin(a)*e.spd;spawned95(e,w);}}
  G.warns=G.warns.filter(w=>w.t>0);
  updateEnemies(dt);
  if(G.bc){updateRocks(dt);updateRelays(dt);updateStorm(dt);updateEvents(dt);}
  updateFields(dt);
  updateBullets(dt);updatePickups(dt);
  if(G.bc){updateBeacon(dt);if(G.deadT<=0)updateDirector(dt);}else if(G.mode==='endless')updateEndless(dt);else updateWaves(dt);
  if(G.mode==='endless'&&G.endT>0)G.endT=Math.max(0,G.endT-dt);
  updateFx(dt);
  runLvlUp6(G.player);
  if((G.lvlQ>0||G.bpQ>0)&&G.state==='play'&&G.endT<=0&&G.deadT<=0)nextPick();
}
function updateFx(dt){
  for(const q of G.parts){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=Math.pow(.15,dt);q.vy*=Math.pow(.15,dt);q.life-=dt;}G.parts=G.parts.filter(q=>q.life>0);
  for(const f of G.float){f.y-=28*dt;f.life-=dt;}G.float=G.float.filter(f=>f.life>0);
  for(const s of G.shock){s.t+=dt*(s.slow?.9:2.6);s.r=s.R*Math.min(1,s.t);}G.shock=G.shock.filter(s=>s.t<1);
  G.shake=Math.max(0,G.shake-dt*30);G.hurtV=Math.max(0,G.hurtV-dt*2);G.lightFull=Math.max(0,G.lightFull-dt*.9);
  if(banT>0){banT-=dt;if(banT<=0)$('#banner').classList.remove('show');}
}

