/* ▼▼▼ ARCH·81 · ПОДСИСТЕМА НАВЕДЕНИЯ ▼▼▼ (1.5.21 α · этап 5, пилот переноса)
   Ответственность: кого можно взять в автоприцел (targetable, aimLockable), выбор цели (pickTarget, nearestEnemy — сразу выше,
   запасной выбор aimFallback), ручной прицел (aimManual), отметка цели касанием (prioTap), точка прицеливания (aimPt).
   Внешние входы, только чтение: G.player, G.enemies, G.state, G.world, G.dark, G.bo80, G.boss, G.jam, EDEF, NOAUTO, AIM_SKIP75, W80,
     SET.manual, touchMode, MOUSE, камера CX/CY/W/H/SC; функции inMission, isMob, sbAutoTarget (бой с носителем), visibleAt, inStorm,
     w58Hidden, targ90, sbTargetable, bossShielded, jamShielded, aw90, inRange80, memSeg, clamp; вывод — floater, console.warn.
   Поля G подсистемы: G.prio, G.aimLock, G.tg90, G.noTg75, G.aimWarn75. ARCH·84 (1.5.24): снаружи их меняют только
     через prioSet / prioClear / aimLockClear — kill, storyRetreat, loopIntercept80, startAnom, startEndless (шесть мест, ARCH·83);
     зарегистрированные исключения: групповые сбросы раунда Object.assign в setupMission0, startEndless, enterWorldAt (prio, aimLock).
     Ветка отката A-26 снята в ARCH·87 (1.5.27). Шаг наведения — aimStep (ARCH·82).
     Граница проверяется tools6/own6.js по tools6/ownership6.json (группа targeting; прежде — tools5/own5.js). Подсистема логически ограничена, но не инкапсулирована:
     G остаётся глобальным, поля читаются откуда угодно (в том числе diag77Text, ip78Post, nonameAI100 читают G.tg90).
   Перенос: объявления перенесены сюда без изменения тел (подъём объявлений делает место неважным; повторов у этих имён,
     кроме aimPt и nearestEnemy, нет; мёртвые копии aimPt и nearestEnemy сняты в ARCH·85, 1.5.25).
   Единственная правка — aimPt(e, from = G.player): точка считается относительно from, по умолчанию — игрока, как и раньше.
     Все вызовы aimPt передают один аргумент (в том числе прицел союзников), поэтому расчёт не изменился,
     а зависимость от G.player сохраняется — она внесена в реестр остатков. Длина aimPt.length осталась 1.
   Откат: mstrip 81 (байт в байт). */
function aimLockable(e){if(!e||!e.alive||e.spawnT>0||e.ghost||e.down>0||e.type==='shell')return false;if(e.type==='boss'||e.type==='jam')return e.st!=='enter'&&e.st!=='dying';if(EDEF[e.type].sbp)return targetable(e);return targetable(e)||(G.dark&&inStorm(e.x,e.y));}
function aimManual(){return SET.manual&&!touchMode&&MOUSE.moved;}
function targetable(e){
  if(!e||!e.alive||e.spawnT>0||e.ghost||e.down>0)return false;
  if(e.x<CX-10||e.x>CX+W+10||e.y<CY-10||e.y>CY+H+10)return false;
  if(e.type==='boss')return G.boss&&G.boss.st==='fight'&&!bossShielded();
  if(e.type==='jam')return G.jam&&G.jam.st==='fight'&&!jamShielded();
  if(EDEF[e.type].sbp)return sbTargetable(e);
  if(G.dark&&!visibleAt(e.x,e.y)&&!(e.reveal>0))return false;
  if(G.bo80>=.5&&(G.world||inMission())&&G.player&&!(e.reveal>0)&&Math.hypot(e.x-G.player.x,e.y-G.player.y)>380)return false;
  if(G.world&&(e.peace||e.dig!==undefined||w58Hidden(e)))return false;
  if(!targ90(e))return false;
  return true;
}
function pickTarget(){const p=G.player;if(G.prio&&targetable(G.prio)&&Math.hypot(G.prio.x-p.x,G.prio.y-p.y)<760)return G.prio;if(G.prio&&!G.prio.alive)G.prio=null;{const q=sbAutoTarget(p);if(q)return q;}return nearestEnemy(p.x,p.y,560);}
function prioTap(cx,cy){if(G.state!=='play'&&G.state!=='world')return;const x=cx/SC+CX,y=cy/SC+CY,tm=touchMode&&isMob();let best=null,bd=1e9;
  for(const en of G.enemies){if(!targetable(en))continue;const d=Math.hypot(en.x-x,en.y-y),R=tm?Math.max(en.r*SC+12,28)/SC:en.r+24;if(d<R&&d<bd){bd=d;best=en;}}
  if(best){if(tm&&G.prio===best){G.prio=null;floater(best.x,best.y-best.r-18,'ПРИОРИТЕТ СНЯТ','#9fb0c4');}else{G.prio=best;floater(best.x,best.y-best.r-18,'ПРИОРИТЕТ','#ffffff');}}else G.prio=null;}
function aimFallback(dt){const p=G.player;if(!p||!(G.world||inMission())){G.noTg75=0;return null;}
  let need=false;for(const e of G.enemies){if(e.alive&&e.spawnT<=0&&!EDEF[e.type].passive&&!e.retreat&&!e.n74&&!AIM_SKIP75.has(e.type)&&targetable(e)&&Math.hypot(e.x-p.x,e.y-p.y)<560){need=true;break;}}
  if(!need){G.noTg75=0;return null;}G.noTg75=(G.noTg75||0)+dt;if(G.noTg75<3)return null;
  let best=null,bd=560;for(const e of G.enemies){if(!e.alive||!targetable(e)||e.retreat||e.n74||EDEF[e.type].passive||AIM_SKIP75.has(e.type))continue;const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<bd){bd=d;best=e;}}
  if(best){G.aimWarn75=G.aimWarn75||{};if(!G.aimWarn75[best.type]){G.aimWarn75[best.type]=1;try{console.warn('[VØID] автоприцел: запасной выбор цели — '+best.type);}catch(err){}}}return best;}
function aimPt(e,from=G.player){const p=from;if(e&&e.alive&&p){if(e.type==='membrane'&&e.wa!==undefined){const s=memSeg(e),dx=s[2]-s[0],dy=s[3]-s[1],L2=dx*dx+dy*dy||1,k=clamp(((p.x-s[0])*dx+(p.y-s[1])*dy)/L2,.12,.88);return {x:s[0]+dx*k,y:s[1]+dy*k};}
    if(e.type==='railshield'&&e.fa!==undefined){const ux=Math.cos(e.fa+Math.PI/2),uy=Math.sin(e.fa+Math.PI/2),k=clamp((p.x-e.x)*ux+(p.y-e.y)*uy,-24,24);return {x:e.x+ux*k,y:e.y+uy*k};}}return e;}
/* ARCH·82 · шаг наведения из updatePlayer (1.5.22). Тело — дословно операторы 1.5.21 от «let tg=» до поворота p.ang:
   выбор цели → G.tg90 (в ручном режиме — захват прошлого шага) → noTg75/aimFallback → sp → ручной захват/want → A-24 → p.ang.
   Возвращает tg (цель для выстрела). Вызывается из updatePlayer в том же месте; при window.__archOff=['A-26'] работает прежний текст. */
function aimStep(p,dt,man){
  let tg=man?null:pickTarget();G.tg90=man?G.aimLock:tg;if(!man){if(tg)G.noTg75=0;else tg=aimFallback(dt);}/* 0.7.5 */
  const sp=Math.hypot(p.vx,p.vy);
  let want;if(man){const m=mouseWorld();let L=G.aimLock;
    if(L&&(!aimLockable(L)||Math.hypot(m.x-L.x,m.y-L.y)>L.r+70))L=G.aimLock=null;
    if(!L){let bd=1e9;for(const e of G.enemies){if(!aimLockable(e))continue;const q=Math.hypot(m.x-e.x,m.y-e.y);if(q<e.r+26&&q<bd){bd=q;L=e;}}G.aimLock=L;}
    const T=L||m;want=Math.atan2(T.y-p.y,T.x-p.x);}else{G.aimLock=null;want=tg?Math.atan2(aimPt(tg).y-p.y,aimPt(tg).x-p.x):sp>20?Math.atan2(p.vy,p.vx):p.ang;}
  if(ARCH.a24)want=a24Want(p,tg,want,sp,dt,man);/* ARCH·80 A-24 */
  p.ang+=man?clamp(angDiff(want,p.ang)*Math.min(1,dt*18),-.45,.45):angDiff(want,p.ang)*Math.min(1,dt*14);
  return tg;}
/* ARCH·82 · условие автострельбы (шаг 14), вызывается после p.fireT-=dt, как и раньше; запросная функция — G не пишет */
function autoFireWanted(man,tg){return man?(MOUSE.down||G.enemies.some(e=>targetable(e)&&!NOAUTO.has(e.type))):!!tg;}
/* ARCH·83 · контролируемые точки записи (1.5.23). Внешний код меняет G.prio и G.aimLock только через эти три функции
   (или в зарегистрированных групповых сбросах Object.assign в setupMission0, startEndless, enterWorldAt). Логики сверх присваивания нет,
   возвращаемое значение не используется. Вызовы: kill (prioClear — ветка twin; prioSet(null) — основная, условие и счётчик prioKills снаружи),
   storyRetreat и loopIntercept80 (prioClear), startAnom (prioSet), startEndless (aimLockClear). Записи внутри подсистемы остаются прямыми. */
function prioSet(e){G.prio=e;}
function prioClear(e){if(G.prio===e)G.prio=null;}
function aimLockClear(){G.aimLock=null;}
/* ▲▲▲ ARCH·81 · КОНЕЦ ПОДСИСТЕМЫ НАВЕДЕНИЯ ▲▲▲ */
// --- утечка охлаждения: снаряды втрое медленнее ---
function leakK80(x,y){if(!G.world&&!inMission())return 1;const L=G.world?W80.near:(G.x80&&G.x80.leaks);if(!L||!L.length)return 1;for(const q of L)if((x-q.x)*(x-q.x)+(y-q.y)*(y-q.y)<q.r*q.r)return 1/3;return 1;}
// --- общий тик (миссия и мир) ---
function ens80(){if(!G.rcB80)G.rcB80=[];if(!G.echoBl80)G.echoBl80=[];if(!G.echoB80)G.echoB80=[];if(!G.echoQ80)G.echoQ80=[];if(!G.dmgN80)G.dmgN80=[];if(G.echoSeq80===undefined)G.echoSeq80=0;if(G.echoHitT80===undefined)G.echoHitT80=-99;if(G.rcDrop80===undefined){G.rcDrop80=0;G.rcLost80=0;}}
function c80Tick(dt){const p=G.player;if(!p)return;ens80();const S=G.save;if(S)w80S().clk+=dt;
  if(G.insp80>0){G.insp80-=dt;if(G.insp80By&&!G.insp80By.alive)G.insp80=0;}for(const e of G.enemies)if(e.insB80>0)e.insB80-=dt;
  if(G.inv80>0)G.inv80-=dt;if(G.slow80>0)G.slow80-=dt;if(p.hp<=0){G.inv80=0;G.slow80=0;}
  if(G.stamp80){const s=G.stamp80;if(p.hp<=0){G.stamp80=null;document.body.classList.remove('stamp80');}else if(p.dashT>0)stampOff80('РЫВОК');else{s.t-=dt;if(s.t<=0){G.stamp80=null;document.body.classList.remove('stamp80');if(G.mc)G.mc.stampBoom80=1;explode(p.x,p.y,'#ff7a3d',30,1);G.shock.push({x:p.x,y:p.y,r:10,R:90,t:0,col:'#ff7a3d'});sfx('boom');shake(6);
        damagePlayer(22);for(const o of G.enemies){if(!o.alive||o.spawnT>0||STATIC.has(o.type)||EDEF[o.type].sbp||EDEF[o.type].passive)continue;if(Math.hypot(o.x-p.x,o.y-p.y)<90+o.r)hurt(o,40,{force:true});}}}}
  // Утилизатор: подбираемое тянется спиралью
  for(const k of G.pick){if(!k.c80){k.c80=1;if(k.k==='xp'||k.k==='lom')G.rcDrop80=(G.rcDrop80||0)+1;}const e=k.rc80;if(!e)continue;if(!e.alive||e.hopper&&e.hopper.length>=12){k.rc80=null;k.noMag=k.k==='part80';continue;}
    if(p.hp>0&&Math.hypot(k.x-p.x,k.y-p.y)<(G.st.mag||0)*.6){k.rc80=null;k.noMag=k.k==='part80';continue;}
    const dx=e.x-k.x,dy=e.y-k.y,d=Math.hypot(dx,dy)||1;k.vx=dx/d*160-dy/d*60;k.vy=dy/d*160+dx/d*60;if(d<e.r){k.life=0;e.hopper.push({k:k.k,v:k.v||1});e.hopper0=Math.max(e.hopper0||0,e.hopper.length);}}
  // снаряды Утилизатора: промах — снова на пол
  const live=(G.rcB80.length||G.echoB80.length||G.echoBl80.length)?new Set(G.eb):null;G.live80=live;
  if(G.rcB80.length){for(const b of G.rcB80){if(b.life>0&&live.has(b))continue;const hitP=p.hp>0&&Math.hypot(b.x-p.x,b.y-p.y)<b.r+14;const it=b.rc80;b.rc80=null;
      if(hitP){if(it&&(it.k==='xp'||it.k==='lom'))G.rcLost80++;}else if(it){G.pick.push({k:it.k,x:clamp(b.x,10,BW-10),y:clamp(b.y,10,BH-10),vx:0,vy:0,r:it.k==='part80'?6:it.k==='cell'?9:5,t:0,life:it.k==='part80'?10:20,v:it.v||1,stab:it.k==='cell'?0:undefined,noMag:it.k==='part80'||it.k==='wreck85'});}}
    G.rcB80=G.rcB80.filter(b=>b.rc80&&b.life>0&&live.has(b));}
  echoTick80(dt);
  for(const n of G.dmgN80){n.t-=dt;n.y-=30*dt;}G.dmgN80=G.dmgN80.filter(n=>n.t>0);
  if(G.res80)res80Tick(dt);}
// --- Отзвук: запись и ответ ---
function echoTick80(dt){const p=G.player,E=G.enemies.filter(e=>e.alive&&e.type==='echo80'&&e.spawnT<=0);
  if(!E.length){if(G.echoQ80&&G.echoQ80.length)G.echoQ80.length=0;for(const b of G.pb)b.e80=1;return;}
  const Q=G.echoQ80||(G.echoQ80=[]);
  for(const b of G.pb){if(b.e80)continue;b.e80=1;if(b.drone||b.turret||b.jr||b.test||(b.age||0)>.08||Math.hypot(b.x-p.x,b.y-p.y)>60)continue;
    if(Q.length>=90)Q.shift();Q.push({t:G.t,seq:G.echoSeq80++,off:angDiff(Math.atan2(b.vy,b.vx),ARCH.a24?a24Hull(p):p.ang)/* ARCH·80 A-24 */,spd:Math.hypot(b.vx,b.vy),dmg:b.dmg,blast:b.blast?(b.R||110):0,charged:!!b.charged});}
  E.sort((a,c)=>a.uid-c.uid);const cap=[12,18,22][rankD80()];
  while(Q.length&&G.t-Q[0].t>=1){const r=Q.shift();const e=E[r.seq%E.length];e.rl=Math.min(12,(e.rl===undefined?12:e.rl));if(e.rl<1)continue;e.rl-=1;
    if(p.hp<=0)continue;const a=Math.atan2(p.y-e.y,p.x-e.x)+r.off;const b=shootE(e.x,e.y,a,Math.min(700,r.spd*.7),clamp(r.dmg*.4,2,cap),'#c9b6ff',r.charged?7:r.blast?6:4);
    if(b){b.ech80=1;G.echoB80.push(b);if(r.blast){b.bl80=r.blast*.6;G.echoBl80.push(b);}}}
  for(const e of E)e.rl=Math.min(12,(e.rl===undefined?12:e.rl)+12*dt);
  // попадания по игроку и взрывы «Разрыва»-копии
  const live=G.live80||new Set(G.eb);
  if(G.echoB80.length){for(const b of G.echoB80){if(b.life>0&&live.has(b))continue;if(p.hp>0&&Math.hypot(b.x-p.x,b.y-p.y)<b.r+14){b.e80h=1;G.echoHitT80=G.t;G.echoDmg80=(G.echoDmg80||0)+b.dmg;if(G.mc)G.mc.echoHit80=1;}b.e80d=1;}G.echoB80=G.echoB80.filter(b=>!b.e80d);}
  if(G.echoBl80.length){for(const b of G.echoBl80){if(b.life>0&&live.has(b))continue;if(b.bx80)continue;b.bx80=1;const R=b.bl80||60;explode(b.x,b.y,'#c9b6ff',14,.6);G.shock.push({x:b.x,y:b.y,r:6,R,t:0,col:'#c9b6ff',thin:true});
      if(p.hp>0&&p.dashT<=0&&Math.hypot(b.x-p.x,b.y-p.y)<R&&!b.e80h){damagePlayer(b.dmg*.5);G.echoHitT80=G.t;}}G.echoBl80=G.echoBl80.filter(b=>!b.bx80);}}
// --- Утилизатор: высыпать бункер ---
function rcRelease80(e,silent){const H_=e.hopper||[];if(!H_.length&&silent)return;const extra=silent?0:Math.ceil(H_.length*.15);
  for(const it of H_)G.pick.push({k:it.k,x:e.x+rnd(-16,16),y:e.y+rnd(-16,16),vx:rnd(-120,120),vy:rnd(-120,120),r:it.k==='part80'?6:it.k==='cell'?9:5,t:0,life:it.k==='part80'?10:22,v:it.v||1,noMag:it.k==='part80'});
  for(let i=0;i<extra;i++)G.pick.push(G.world?{k:'lom',x:e.x+rnd(-16,16),y:e.y+rnd(-16,16),vx:rnd(-120,120),vy:rnd(-120,120),r:5,t:0,life:30,v:1}:{k:'xp',x:e.x+rnd(-16,16),y:e.y+rnd(-16,16),vx:rnd(-120,120),vy:rnd(-120,120),r:5,t:0,life:22});
  if(!silent&&H_.length)floater(e.x,e.y-30,'УТИЛИЗАТОР ВСКРЫТ · +'+extra,'#ffb84d');e.hopper=[];}
// --- мишень полигона ---
function rangeHit80(e,dmg,src){const col=src.pulse||src.blast?'#e86bff':src.charged?'#8fe9ff':'#ffffff',now=G.t;e.flash=.07;sfx('hit');const R=W80.rlog||(W80.rlog=[]);R.push({t:now,v:dmg});W80.last=dmg;
  const N=G.dmgN80,mx=isMob()?12:40;const rec=N.filter(n=>now-n.at<.2&&n.r80===e);
  if(rec.length>=8){const n=rec[rec.length-1];n.v+=dmg;n.t=1;}else{if(N.length>=mx)N.shift();N.push({x:e.x+rnd(-14,14),y:e.y-e.r-8,v:dmg,col,t:1,at:now,r80:e});}}
// --- мирные/враждебные Паломники ---
function pilgrimHit80(e){const g=e.pg80;if(G.mc)G.mc.pilHit80=1;if(!g||g.hostile)return;if(g.tol>0){g.tol--;floater(e.x,e.y-24,'ОНИ СЧИТАЮТ ЭТО ОШИБКОЙ','#dfe8ff');return;}
  g.hostile=true;g.hostT=300;g.hitByP=1;for(const o of g.ships)if(o.alive){o.peace=false;o.hostile80=true;}floater(e.x,e.y-24,'ПАЛОМНИКИ: ТЫ НЕ ИЗ НАС','#ff4f6e');radioLine('ИСТОК','#6b8cff','…ты не из нас…',.1);sfx('warn');}
function pilgrimAI80(e,dt){const p=G.player,g=e.pg80;if(!g)return;if(e.hostile80&&g.hostile){const pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1,k=clamp((pd-300)/100,-1,1);steer(e,pdx/pd*k-pdy/pd*.5*e.dir,pdy/pd*k+pdx/pd*.5*e.dir,e.spd*1.4,dt,2);
    e.cd-=dt;if(e.cd<=0&&p.hp>0&&pd<700){e.cd=1.2;const a=Math.atan2(pdy,pdx);if(G.st&&G.st.weapon==='blast'){const b=shootE(e.x,e.y,a,380,7,'#dfe8ff',6);if(b){b.ech80=1;b.bl80=60;G.echoBl80.push(b);}}else{const n=Math.min(3,(G.st&&G.st.shots)||1);for(let i=0;i<n;i++)shootE(e.x,e.y,a+(i-(n-1)/2)*.12,590,6,'#dfe8ff',4);}}return;}
  const tx=g.dest.x+(e.fo||0)*.0,ty=g.dest.y;const dx=tx-e.x+(e.fx||0),dy=ty-e.y+(e.fy||0),d=Math.hypot(dx,dy)||1;steer(e,dx,dy,Math.min(60,d),dt,1.5);}
// --- спасённая копия (конвой) ---
function res80Tick(dt){const R=G.res80,p=G.player;if(!R)return;R.t-=dt;if(!G.world||sec80()!==6||p.hp<=0||R.t<=0){if(R.t<=0&&G.world)radioLine('КОПИЯ','#dfe8ff','Номера нет. Спасибо.',.2);G.res80=null;return;}
  R.a+=dt*1.4;const tx=p.x+Math.cos(R.a)*70,ty=p.y+Math.sin(R.a)*70;R.x+=(tx-R.x)*Math.min(1,dt*3);R.y+=(ty-R.y)*Math.min(1,dt*3);R.cd-=dt;
  if(R.cd<=0){const t_=nearestEnemy(R.x,R.y,460);if(t_&&t_.type!=='rangedummy'){R.cd=.6;const an=Math.atan2(t_.y-R.y,t_.x-R.x);G.pb.push({x:R.x,y:R.y,px:R.x,py:R.y,vx:Math.cos(an)*760,vy:Math.sin(an)*760,dmg:6*Math.max(1,playerDmgK()),pierce:0,rico:0,life:.7,hit:[],drone:true,jr:true});}else R.cd=.25;}}
// --- тик миссии ---
function t80Tick(dt){t85Tick(dt);t90Tick(dt);if(!inMission()||!G.x80)return;const X=G.x80,p=G.player;c80Tick(dt);const M=MISSIONS[G.m-1];if(G.endT>0||G.deadT>0){G.bo80=Math.max(0,G.bo80-dt);if(G.stamp80){G.stamp80=null;document.body.classList.remove('stamp80');}G.inv80=0;G.slow80=0;return;}
  // отключение света
  if(X.bo){const B=X.bo;if(B.st==='wait'){if(G.waveIdx>=2&&!G.sb){B.t+=dt;if(B.t>=(B.at||(B.at=rnd(6,18)))){B.st='warn';B.t=5;radioLine(X.sec===6?'БЮРО':'ИСТОК',X.sec===6?'#e8d27a':'#6b8cff',X.sec===6?'Смена окончена. Свет — по регламенту.':'…тише… слушай…',0);buzz('ready');}}}
    else if(B.st==='warn'){B.t-=dt;G.bo80=Math.sin(G.t*22)>.3?.45:0;if(B.t<=0){B.st='dark';B.t=20;}}
    else if(B.st==='dark'){B.t-=dt;G.bo80=1;d80H('dark','ТЕМНОТА · АВТОПРИЦЕЛ ВИДИТ ТОЛЬКО РЯДОМ','#e8d27a');if(B.t<=0){B.st='back';B.t=3;}}
    else if(B.st==='back'){B.t-=dt;G.bo80=clamp(B.t/3,0,1);if(B.t<=0){B.st='done';G.bo80=0;}}}
  if(X.leaks.length&&p.hp>0&&X.leaks.some(q=>Math.hypot(p.x-q.x,p.y-q.y)<q.r))d80H('leak','УТЕЧКА ОХЛАЖДЕНИЯ · СНАРЯДЫ ×3 МЕДЛЕННЕЕ','#bfe8ff');
  // Паломники через арену
  if(X.pil&&!X.pil.done&&G.mT>=X.pil.at&&!G.sb){X.pil.done=true;const g={hostile:false,tol:X.pil.tol,ships:[],dest:{x:W+120,y:H*.5}};X.pg=g;const y0=H*rnd(.3,.7);
    for(let i=0;i<3;i++){const e=spawnEnemy('pilgrim',-40-i*50,y0+(i-1)*46,{noAffix:true,noLoot:true,spawnT:.5});e.peace=true;e.pg80=g;e.fx=0;e.fy=(i-1)*46;g.ships.push(e);}
    floater(p.x,p.y-40,'ПАЛОМНИКИ · НЕ СТРЕЛЯТЬ','#dfe8ff');radioLine('ИСТОК','#6b8cff','…мы мимо. Мы не к тебе…',.3);}
  if(X.pg){for(const e of X.pg.ships)if(e.alive&&!e.hostile80&&e.x>W+60){e.alive=false;}}}
