// ---------- Игрок ----------
function newPlayer(){return{x:W/2,y:H*.7,vx:0,vy:0,r:14,hp:100,en:0,ang:-Math.PI/2,fireT:0,dashCd:0,dashT:0,dx:0,dy:0,inv:1,shieldUp:false,shieldT:0,droneA:0,droneT:[0,0],px:W/2,py:H*.7,trail:[],cargo:0,noDash:0,chg:0,chgCd:0,hitT:-99};}
const KEYS={};const CHG={m:false,t:false};
const MOUSE={sx:0,sy:0,moved:false,down:false};
/* ARCH·81 → aimLockable перенесена в блок «ПОДСИСТЕМА НАВЕДЕНИЯ» после nearestEnemy */
/* ARCH·81 → aimManual перенесена в блок «ПОДСИСТЕМА НАВЕДЕНИЯ» после nearestEnemy */
function mouseWorld(){return{x:MOUSE.sx/SC+CX,y:MOUSE.sy/SC+CY};}
function updateCursor(){cv.style.cursor=(G.state==='play'||G.state==='world')&&SET.manual&&!touchMode?'none':'';}
const joy={on:false,id:null,ox:0,oy:0,x:0,y:0,lx:null,ly:null,locked:false,lockable:false,lockA:0,lockHold:0,fl:[],flT:0};
function inputVec(){
  let x=0,y=0;
  if(KEYS.KeyA||KEYS.ArrowLeft)x--; if(KEYS.KeyD||KEYS.ArrowRight)x++; if(KEYS.KeyW||KEYS.ArrowUp)y--; if(KEYS.KeyS||KEYS.ArrowDown)y++;
  if(joy.on||joy.locked){x+=joy.x;y+=joy.y;}
  if(G.padOn){x+=G.padX;y+=G.padY;}
  const l=Math.hypot(x,y);if(l>1){x/=l;y/=l;}const k80=inputK80();return[x*k80,y*k80];
}
function dashBlocked(){const p=G.player;return p.noDash>0||G.frozen>0||G.lockDash>0||inStorm(p.x,p.y);}
function tryDash(dir){
  const p=G.player;if((G.state!=='play'&&G.state!=='world')||!p||p.dashCd>0||p.hp<=0)return;
  if(dashBlocked()){hintOnce('nodash',p.noDash>0?'РЫВОК ПОДАВЛЕН РАЗРЯДОМ':G.lockDash>0?'РЫВОК НА ХРАНЕНИИ · '+G.lockDash.toFixed(1)+' С':G.frozen>0?'КОРПУС ЗАМЁРЗ':'РЫВОК НЕДОСТУПЕН В БУРЕ','#6bf0ff');return;}
  let [x,y]=dir||inputVec();const l=Math.hypot(x,y);if(l<.1){const da=ARCH.a24&&A24P.dash==='aim'?a24Hull(p):p.ang;/* ARCH·80 A-24 */x=Math.cos(da);y=Math.sin(da);}else{x/=l;y/=l;}
  clearIce();p.dx=x;p.dy=y;p.dashT=.15;p.dashCd=G.st.dashCd*(G.anom&&G.anom.a.kind==='storm'?2:1)*(G.world&&G.chillD||1);p.dashCdMax=p.dashCd;buzz('dash');p.inv=Math.max(p.inv,.22);G.dashId++;sfx('dash');
  G.dashLog.push({t:G.t,x:clamp(p.x+x*225,20,BW-20),y:clamp(p.y+y*225,20,BH-20)});if(G.mc)G.mc.dashes++;
  if(G.st.phase)G.lureP={x:p.x,y:p.y,t:1};
  if(SET.fx)for(let i=0;i<10;i++)part(p.x,p.y,-x*vrnd1(80,260)+vrnd1(-60,60),-y*vrnd1(80,260)+vrnd1(-60,60),.35,(SKINS[curSkin()]||SKINS.base).trail,2.2);
}
function tryPulse(){
  const p=G.player;if((G.state!=='play'&&G.state!=='world')||!p||p.en<100||p.hp<=0)return;
  p.en=0;clearIce();buzz('pulse');if(G.w)G.w.pulsed=1;if(G.mc)G.mc.pulses++;const R=G.st.pR;G.shock.push({x:p.x,y:p.y,r:10,R,t:0,col:'#ffb84d'});if(G.world||inMission()){const X_=x74();X_.spores=X_.spores.filter(s=>Math.hypot(s.x-p.x,s.y-p.y)>R+s.r*.5);pulse80(p,R);}sfx('pulse');shake(10);if(typeof zbPulse==='function')zbPulse(p,R);
  G.eb=G.eb.filter(b=>{if(Math.hypot(b.x-p.x,b.y-p.y)<R){part(b.x,b.y,0,0,.3,'#ffb84d',3);return false;}return true;});
  for(const e of G.enemies.slice()){if(!e.alive||e.spawnT>0||e.down>0||e.ghost)continue;const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<R+e.r){
    if(e.affix&&e.affix.includes('screen')){floater(e.x,e.y-e.r-10,'ЭКРАН','#8fe9ff');continue;}
    hurt(e,e.type==='pylon'||e.type==='antenna'?70:45,{pulse:true});
    if(!HEAVY.has(e.type)){const k=(1-d/(R+e.r))*520;e.vx+=(e.x-p.x)/(d||1)*k;e.vy+=(e.y-p.y)/(d||1)*k;}}}
}
function updatePlayer(dt){
  const p=G.player,st=G.st;p.px=p.x;p.py=p.y;
  if(p.hp<=0)return;
  p.dashCd=Math.max(0,p.dashCd-dt);p.inv=Math.max(0,p.inv-dt);p.noDash=Math.max(0,p.noDash-dt);
  // заряженный выстрел
  p.chgCd=Math.max(0,(p.chgCd||0)-dt);
  const hold=(KEYS.KeyQ||CHG.m||CHG.t||CHG.p)&&chargeAllowed();
  if(hold&&p.chgCd<=0)p.chg=(p.chg||0)+dt;else{if(p.chg>=CHG_T)fireCharged(p);p.chg=0;}
  const spd=st.speed*(p.chg>0?.7:1)*iceSpeedK()*(G.world&&G.chillK||1);
  const [ix,iy]=inputVec();
  if(p.dashT>0){p.dashT-=dt;p.vx=p.dx*1500;p.vy=p.dy*1500;if(p.dashT<=0){p.vx=p.dx*spd;p.vy=p.dy*spd;}}
  else{const k=Math.min(1,dt*(G.slick?(G.slickK||3):11));p.vx+=(ix*spd-p.vx)*k;p.vy+=(iy*spd-p.vy)*k;}
  p.x=clamp(p.x+p.vx*dt,p.r,BW-p.r);p.y=clamp(p.y+p.vy*dt,p.r,BH-p.r);drift85(p,dt);drift90(p,dt);
  if(st.shieldCd>0&&!p.shieldUp&&!(G.lockShield>0)){p.shieldT+=dt*(G.shieldPen>0?.5:1);if(p.shieldT>=st.shieldCd){p.shieldUp=true;p.shieldT=0;}}
  if(SET.fx){p.trail.push({x:p.x,y:p.y,t:p.dashT>0?.25:.12});}
  for(const t of p.trail)t.t-=dt;p.trail=p.trail.filter(t=>t.t>0);
  const man=aimManual();
  const tg=aimStep(p,dt,man);/* ARCH·82: шаги 4–12 — в подсистеме наведения · ARCH·87: ветка отката A-26 снята (1.5.27) */
  p.fireT-=dt;
  const shoot=autoFireWanted(man,tg);/* ARCH·82 · ARCH·87 */
  if(shoot&&p.fireT<=0&&!(p.chg>0)){p.fireT=st.rate*(G.bc&&G.bc.inRing?st.sync:1)*(G.lockGun>0?3:1)*(G.milk75>0?.83:1);fire(p,tg,man?p.ang:undefined);}
  p.droneA+=dt*2.2;
  for(let i=0;i<st.drones;i++){p.droneT[i]-=dt;if(p.droneT[i]<=0){const a=p.droneA+i*Math.PI,dx=p.x+Math.cos(a)*34,dy=p.y+Math.sin(a)*34;
    const t=nearestEnemy(dx,dy,480);if(t){p.droneT[i]=.6;const an=Math.atan2(t.y-dy,t.x-dx);G.pb.push({x:dx,y:dy,px:dx,py:dy,vx:Math.cos(an)*820,vy:Math.sin(an)*820,dmg:6*MODS.cal.v[G.mods.cal||0],pierce:0,rico:0,life:.7,hit:[],drone:true});}else p.droneT[i]=.2;}}
  for(const e of G.enemies){
    if(!e.alive||e.spawnT>0||e.type==='mine'||e.ghost||e.down>0)continue;
    const d=segDist(p.px,p.py,p.x,p.y,e.x,e.y);
    if(e.type==='hull'){if(p.dashT>0&&d<e.r+p.r)kill(e,true);continue;}
    if(d<e.r+p.r*.7){
      if(p.dashT>0&&st.ram>0&&e.ramId!==G.dashId){e.ramId=G.dashId;hurt(e,st.ram,{ram:true});}
      else if(p.dashT<=0&&e.contact>0&&!cg95(e)){if(e.type==='guard'&&SSW()&&SSW().mercy)mercyHit(e.contact);else damagePlayer(e.contact);if(e.type==='seeker'||e.type==='unborn'){kill(e,true);continue;}
        if(!HEAVY.has(e.type)){const a=Math.atan2(e.y-p.y,e.x-p.x);e.vx+=Math.cos(a)*260;e.vy+=Math.sin(a)*260;}}
    }
  }
}
function damagePlayer(d){
  if(devAny()&&G.dev.god)return;if(G.x85&&G.x85.calm>0&&inMission())return;
  const p=G.player;if(!p||p.inv>0||p.dashT>0||p.hp<=0||G.deadT>0)return;
  if(inMission())d*=(curDiff().dmg||1)*missionK('dmg');
  if(G.insp80>0&&(G.world||inMission()))d*=1.2;
  if(p.shieldUp){p.shieldUp=false;p.shieldT=0;p.inv=.45;sfx('shield');for(let i=0;i<16;i++){const a=rnd(0,TAU);part(p.x+Math.cos(a)*22,p.y+Math.sin(a)*22,Math.cos(a)*120,Math.sin(a)*120,.4,'#8fe9ff',2);}return;}
  p.hp-=d;G.taken+=d;p.inv=.75;shake(9);G.hurtV=1;sfx('hurt');p.hitT=G.t;comboBreak();buzz(d>=20?'hit2':'hit');
  if(p.hp<=0&&!lc95(p)){p.hp=0;explode(p.x,p.y,'#8fe9ff',60,1.6);sfx('bigboom');G.deadT=1.6;storyDeath(false);buzz('death');}
}
function shake(v){if(SET.fx){v*=(SET.shake===undefined?1:SET.shake)*(SET.lessFx?.5:1);if(isMob())v*=(RMQ&&RMQ.matches?.3:1)*[.3,.6,1][G.q];G.shake=Math.max(G.shake,v);}}

// ---------- Видимость (тьма) ----------
function beaconLight(){const bc=G.bc;if(!bc)return 0;return (bc.cool>0?210:300)*(1+.04*Math.sin(G.t*3));}
function visibleAt(x,y){
  if(!G.dark||G.lightFull>.5)return true;
  const p=G.player;if(p&&Math.hypot(x-p.x,y-p.y)<G.st.light*.85)return true;
  if(G.bc&&Math.hypot(x-G.bc.x,y-G.bc.y)<beaconLight()*.85)return true;
  return false;
}

// ---------- Стрельба и выбор цели ----------
/* ARCH·81 → targetable перенесена в блок «ПОДСИСТЕМА НАВЕДЕНИЯ» после nearestEnemy */
/* ARCH·85 · снято недостижимое объявление nearestEnemy (1 из 3; действует последнее объявление) */
/* ARCH·81 → pickTarget перенесена в блок «ПОДСИСТЕМА НАВЕДЕНИЯ» после nearestEnemy */
function fire(p,tg,ang){
  const st=G.st,n=st.shots;let base;if(ang!==undefined)base=ang;else{const q=aimPt(tg);base=Math.atan2(q.y-p.y,q.x-p.x);}const spread=.11;
  if(inStorm(p.x,p.y))base+=rnd(-.4,.4);
  const tw=perk('twin')>0&&st.weapon!=='blast';
  for(let i=0;i<n;i++){const a=base+(i-(n-1)/2)*spread;const ma=ARCH.a24&&p===G.player?a24Muz(p,a):p.ang,sx=p.x+Math.cos(ma)*16,sy=p.y+Math.sin(ma)*16;/* ARCH·80 A-24 */
    if(st.weapon==='blast'){G.pb.push({x:sx,y:sy,px:sx,py:sy,vx:Math.cos(a)*620,vy:Math.sin(a)*620,dmg:st.dmg*st.shotK,pierce:0,rico:0,life:.75,hit:[],blast:true,R:st.blastR,age:0});continue;}
    if(tw){for(const o of [-5,5]){const ox=-Math.sin(a)*o,oy=Math.cos(a)*o;G.pb.push({x:sx+ox,y:sy+oy,px:sx+ox,py:sy+oy,vx:Math.cos(a)*980,vy:Math.sin(a)*980,dmg:st.dmg*st.shotK*.65,pierce:st.pierce,rico:st.rico,life:.75,hit:[]});}continue;}
    G.pb.push({x:sx,y:sy,px:sx,py:sy,vx:Math.cos(a)*980,vy:Math.sin(a)*980,dmg:st.dmg*st.shotK,pierce:st.pierce,rico:st.rico,life:.75,hit:[]});}
  sfx('shot');
}
function shootE(x,y,a,spd,dmg,col,r=5,bc=false){if(G.eb.length>=420||w58NoFire(x,y))return null;spd*=ebK();if(G.curE&&G.curE.dmgK90)dmg*=G.curE.dmgK90;const b={x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,dmg,col,r,life:9,bc};G.eb.push(b);return b;}
// взрыв «Разрыва»: всем в радиусе, сильнее в центре; щиты гвардии и зеркальщиков, купол босса — уважаются; броня сектора — как у обычного снаряда
function blastAt(x,y,R,dmg,charged){
  for(const e of G.enemies){if(!e.alive||e.spawnT>0||e.ghost||e.down>0)continue;if(e.type==='obseg')continue;
    if(e.type==='boss'&&(!G.boss||G.boss.st!=='fight'||bossShielded()))continue;if(e.type==='jam'&&(!G.jam||G.jam.st!=='fight'||jamShielded()))continue;
    if(EDEF[e.type].sbp&&G.sb&&(G.sb.st==='enter'||G.sb.st==='dying'))continue;
    const d=Math.max(0,Math.hypot(e.x-x,e.y-y)-e.r);if(d>R)continue;const a=Math.atan2(y-e.y,x-e.x);
    if(e.type==='guard'&&!(e.shieldDown>0)&&Math.abs(angDiff(a,e.face))<1.05){e.shieldFlash=.12;continue;}
    if(e.type==='mirror'&&Math.abs(angDiff(a,e.face))<1.0){e.shieldFlash=.12;continue;}
    hurt(e,dmg*(1.4-.9*clamp(d/R,0,1)),{blast:true,charged:!!charged});}
  for(const r of G.rocks){if(r.alive&&Math.hypot(r.x-x,r.y-y)<R+r.r)rockHit(r,dmg*.7);}
  if(G.shock.length<60)G.shock.push({x,y,r:6,R,t:0,col:'#9fe3ff',thin:true});explode(x,y,'#9fe3ff',charged?26:12,charged?1.1:.7);sfx('boom');shake(charged?4:1.5);
}
function updateBullets(dt){
  const vx=G.enemies.filter(e=>e.alive&&e.type==='vortex'&&e.spawnT<=0);
  for(const b of G.pb){
    b.px=b.x;b.py=b.y;b.age=(b.age||0)+dt;
    for(const v of vx){const dx=v.x-b.x,dy=v.y-b.y,d=Math.hypot(dx,dy);if(d<240&&d>1){const k=650*(1-d/240)*dt;b.vx+=dx/d*k;b.vy+=dy/d*k;}}
    {const k_=leakK80(b.x,b.y)*bK110(b);b.x+=b.vx*dt*k_;b.y+=b.vy*dt*k_;b.life-=dt*k_;}
    // перебить трос буксира
    for(const e of G.enemies){if(e.type==='tug'&&e.alive&&e.rock&&segInter(b.px,b.py,b.x,b.y,e.x,e.y,e.rock.x,e.rock.y)){releaseTug(e,true);b.life=0;break;}}
    if(b.life<=0)continue;
    // астероиды — укрытие
    for(const r of G.rocks){if(!r.alive)continue;if(segDist(b.px,b.py,b.x,b.y,r.x,r.y)<r.r){if(b.blast){b.life=0;break;}if(b.charged){if(!b.hit.includes(r)){b.hit.push(r);rockHit(r,b.dmg);}continue;}rockHit(r,b.dmg);b.life=0;if(SET.fx)part(b.x,b.y,vrnd1(-60,60),vrnd1(-60,60),.2,'#9fb0c4',2);break;}}
    if(b.life<=0)continue;
    if(G.sb&&G.sb.sbk==='obod'&&G.sb.alive&&obRingBullet(G.sb,b)&&b.life<=0)continue;
    if(b74Hit(b)&&b.life<=0)continue;
    if(G.world&&G.w&&(w58TugHit(b)||w58BeaconHit(b,b.charged)||w58IceRockHit(b,b.charged)||w58RustRockHit(b,b.charged)||w58ConvHit(b))&&b.life<=0)continue;
    for(const e of G.enemies){
      if(b.life<=0)break;if(!e.alive||e.spawnT>0||e.ghost||e.down>0||b.hit.includes(e))continue;
      if(e.type==='boss'&&G.boss&&G.boss.st!=='fight')continue;
      if(e.type==='obseg')continue;if(EDEF[e.type].sbp&&G.sb&&(G.sb.st==='enter'||G.sb.st==='dying'))continue;
      if(e.type==='jam'&&G.jam&&G.jam.st!=='fight')continue;
      if(segDist(b.px,b.py,b.x,b.y,e.x,e.y)>e.r+3)continue;
      if(e.type==='guard'&&!(e.shieldDown>0)){const a=Math.atan2(b.py-e.y,b.px-e.x);if(Math.abs(angDiff(a,e.face))<1.05){b.life=0;sfx('block');if(e.iceGuard){e.cracks=(e.cracks||0)+1;if(e.cracks>=10){e.cracks=0;e.shieldDown=5;floater(e.x,e.y-e.r-12,'ЛЕДЯНОЙ ЩИТ РАСКОЛОТ · 5 С','#dff6ff');}}part(b.x,b.y,rnd(-80,80),rnd(-80,80),.2,'#ffb84d',2);e.shieldFlash=.12;break;}}
      if(e.type==='mirror'){const a=Math.atan2(b.py-e.y,b.px-e.x);if(Math.abs(angDiff(a,e.face))<1.0){b.life=0;sfx('block');e.shieldFlash=.12;const p=G.player;
        shootE(b.x,b.y,Math.atan2(p.y-b.y,p.x-b.x)+rnd(-.15,.15),330,6,'#dfe8ff',4);break;}}
      if(e.type==='boss'&&bossShielded()){b.life=0;sfx('block');part(b.x,b.y,rnd(-60,60),rnd(-60,60),.25,'#b48cff',2);G.boss.domeFlash=.15;break;}
      if(e.type==='jam'&&jamShielded()){b.life=0;sfx('block');part(b.x,b.y,rnd(-60,60),rnd(-60,60),.25,'#4dd0ff',2);G.jam.domeFlash=.15;break;}
      if(b.blast){if(b.age<.06)continue;b.life=0;break;}
      b.hit.push(e);hurt(e,b.dmg,{charged:!!b.charged,drone:!!(b.drone||b.turret),bt95:b.bt95,refl:!!b.refl});
      if(SET.fx)part(b.x,b.y,-b.vx*.08+vrnd1(-50,50),-b.vy*.08+vrnd1(-50,50),.18,'#d8f8ff',1.6);
      if(b.rico>0){let nb=null,nd=260;for(const o of G.enemies){if(o===e||!targetable(o)||b.hit.includes(o)||NOAUTO.has(o.type))continue;const d=Math.hypot(o.x-b.x,o.y-b.y);if(d<nd){nd=d;nb=o;}}
        if(nb){b.rico--;const a=Math.atan2(nb.y-b.y,nb.x-b.x),s=Math.hypot(b.vx,b.vy);b.vx=Math.cos(a)*s;b.vy=Math.sin(a)*s;b.life=Math.max(b.life,.4);b.px=b.x;b.py=b.y;break;}}
      if(b.pierce-->0)continue;b.life=0;
    }
  }
  for(const b of G.pb)if(b.blast&&b.life<=0&&!b.det){b.det=true;blastAt(b.x,b.y,(b.R||G.st.blastR||110)*(b.charged?1.5:1),b.dmg,b.charged);}
  if(G.world)for(const b of G.pb)if(b.life>.5&&!inSectors(b.x,b.y))b.life=.5;
  G.pb=G.pb.filter(b=>b.life>0&&b.x>CX-40&&b.x<CX+W+40&&b.y>CY-40&&b.y<CY+H+40);
  const p=G.player,bc=G.bc;
  for(const b of G.eb){
    for(const v of vx){const dx=v.x-b.x,dy=v.y-b.y,d=Math.hypot(dx,dy);if(d<200&&d>1){const k=120*(1-d/200)*dt;b.vx+=dx/d*k;b.vy+=dy/d*k;}}
    {const A=G.anom;const k=(A&&A.a.kind==='coldcore'&&Math.hypot(b.x-A.a.x,b.y-A.a.y)<420?.5:1)*leakK80(b.x,b.y)*bK110(b);b.x+=b.vx*dt*k;b.y+=b.vy*dt*k;b.life-=dt*k;}
    if(b.homing){const a=Math.atan2(p.y-b.y,p.x-b.x),c=Math.atan2(b.vy,b.vx),n=c+clamp(angDiff(a,c),-1.6*dt,1.6*dt),s=Math.hypot(b.vx,b.vy);b.vx=Math.cos(n)*s;b.vy=Math.sin(n)*s;}
    if(b.rift){if(p.hp>0&&p.dashT<=0&&G.deadT<=0&&segDist(b.x-b.vx*dt,b.y-b.vy*dt,b.x,b.y,p.x,p.y)<13){b.life=0;riftKill();}continue;}
    for(const r of G.rocks){if(r.alive&&Math.hypot(b.x-r.x,b.y-r.y)<r.r+b.r){b.life=0;break;}}
    if(b.life<=0)continue;
    if(bc&&b.bc&&Math.hypot(b.x-bc.x,b.y-bc.y)<bc.r+b.r){b.life=0;
      if(bc.mods.reflect){const a=Math.atan2(-b.vy,-b.vx)+rnd(-.2,.2);G.pb.push({x:b.x,y:b.y,px:b.x,py:b.y,vx:Math.cos(a)*700,vy:Math.sin(a)*700,dmg:8,pierce:0,rico:0,life:.8,hit:[],turret:true});}
      else dmgBeacon(b.dmg,null);continue;}
    if(p.hp>0&&Math.hypot(b.x-p.x,b.y-p.y)<b.r+9){if(p.dashT>0||p.inv>0){continue;}
      if(b.rust){b.life=0;if(p.shieldUp){p.shieldUp=false;p.shieldT=0;}G.shieldPen=10;hintOnce('rustsh','РЖАВЧИНА · ЩИТ СБИТ','#c96a2a');continue;}
      if(b.mercy){mercyHit(b.dmg);b.life=0;continue;}damagePlayer(b.dmg);if(b.frost)addIce(1);if(b.slow95)G.slowP95=Math.max(G.slowP95||0,b.slow95);b.life=0;}}
  G.eb=G.eb.filter(b=>b.life>0&&(b.rift||b.x>CX-60&&b.x<CX+W+60&&b.y>CY-60&&b.y<CY+H+60));
}

