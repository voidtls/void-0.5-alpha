// ---- вход в мир / выход в миссию ----
function startWorld(fresh){
  /*DEVW*/if(window.DEVW&&!DEVW.on())DEVW.clearFlag(true);
  audioInit();
  let S=fresh?null:migrateSave(store(saveKey()));if(!S)S=migrateSave(newSave());
  if(!inSectors(S.pos.x,S.pos.y)){let bn=WORLD.nodes[0],bd=1e12;for(const q of WORLD.nodes){const d=Math.hypot(q.x-S.pos.x,q.y-S.pos.y);if(d<bd){bd=d;bn=q;}}S.pos={x:bn.x,y:bn.y+160};S.last={...S.pos};}
  if(S.lost&&!inSectors(S.lost.x,S.lost.y))S.lost=null;
  /*DEVW*/if(window.DEVW&&DEVW.on())DEVW.prep(S);
  saveSet6(S,'new');fogFix(S);if(!S.contracts.init&&S.cleared>=2){fillContracts();S.contracts.init=1;}else if(S.contracts.init&&S.contracts.list.length<3){try{fillContracts();}catch(e){}}
  saveSet6(S,'new');G.mode='world';G.devRun=false;G.end=null;G.abyssImm=0;G.saveFail=0;G.lowFx=false;G.wgen=false;w58Reset();W58.zones.forEach(z=>{z.active=false;z.cool=0;});
  G.mods={...S.run.mods};computeStats();G.player=newPlayer();
  Object.assign(G.player,{hp:clamp(S.run.hp,1,G.st.maxHp),en:S.run.en||0});
  runRestore6(S.run);Object.assign(G,{score:S.run.score,kills:S.run.kills,taken:S.run.taken,inRun:true});
  enterWorldAt(S.pos.x,S.pos.y);saveWorld();
  if(S.migrated!==undefined){toast('ОБНОВЛЕНИЕ 0.3',`Модули корабля теперь действуют до конца миссии и выбираются на брифинге. За прежние модули начислено ${S.migrated} лома. Уровень пилота: ${S.pilot.lvl}.`);delete S.migrated;S.intro=true;store(saveKey(),S);}
  else if(!S.intro){S.intro=true;toast('ОТКРЫТЫЙ СЕКТОР',touchMode?'Янтарная стрелка ведёт к доступной миссии. Кнопка над рывком — войти или карта.':'Янтарная стрелка ведёт к доступной миссии. M — карта, F — взаимодействие.');}
  else banner(sectorName(S.pos.x,S.pos.y),(S.cycle||1)>1?'ЦИКЛ '+roman(S.cycle):'');
  G.lomPrev=undefined;G.radio=null;/*DEVW*/if(!(window.DEVW&&DEVW.on()))prologueStart(!!fresh||!S.story.prologue);
}
function enterWorldAt(x,y){
  unlockArena();secReset();if(!G.wgen)genWorld();
  const S=G.save;
  Object.assign(G,{world:true,state:'world',enemies:[],pb:[],eb:[],pick:[],parts:[],float:[],warns:[],shock:[],fields:[],meteors:[],meteorT:0,prio:null,boss:null,jam:null,bc:null,relays:[],rocks:[],storm:null,
    dark:false,noTele:false,aimLock:null,riftI:0,riftD:-1e9,unk:[],riftDeath:0,riftB1:0,riftB2:0,lightFull:0,affixCh:0,endT:0,deadT:0,bpQ:0,fake:null,lureP:null,dashLog:[],anom:null,calm:0,saveT:8,flare:0,cardKey:null,card:null,mc:null,zb:null,zbCool:0,zbAmb:null});
  G.m=Math.max(1,S.cleared);
  G.zones.forEach(z=>{z.active=false;});
  loadFog();
  const p=G.player;Object.assign(p,{x:clamp(x,40,WW-40),y:clamp(y,40,WH-40),vx:0,vy:0,inv:1.5,dashT:0,dashCd:0,trail:[],cargo:0,noDash:0});p.px=p.x;p.py=p.y;
  for(const f of WORLD.minefields){const R=mulberry(77);for(let i=0;i<f.n;i++){const a=R()*TAU,d=100+Math.sqrt(R())*(f.r-100);spawnEnemy('mine',f.x+Math.cos(a)*d,f.y+Math.sin(a)*d,{arm:0,fuse:0,life:1e9,noAffix:true});}}
  if(S.cleared>=6&&!S.gate)WORLD.locks.forEach(([lx,ly],li)=>{if(!(S.locksDown||[]).includes(li))spawnEnemy('lock',lx,ly,{noAffix:true,li});});
  BW=WW;BH=WH;camSnap();show('');
}
function riftReset(){G.unk=[];G.riftI=0;G.riftD=-1e9;G.riftDeath=0;G.riftB1=0;G.riftB2=0;if(G.eb)G.eb=G.eb.filter(b=>!b.rift);const hd=document.getElementById('hud');if(hd){hd.style.transform='';hd.style.opacity='';}}
function enterNode(m,echo){
  if(m===50&&G.mode==='world'&&G.world&&!echo&&typeof zbStart==='function'){zbStart();return;}
  const S=G.save,n=WORLD.nodes[m-1];if(!S||!n||!G.player)return;riftReset();if(G.anom)endAnom();G.slick=false;G.chillK=1;G.chillD=1;if(G.w){G.w.chill=0;G.w.chillT=0;G.w.iced=false;}
  if(S.carry>0){S.lom+=S.carry;S.carry=0;}
  S.pos={x:n.x,y:n.y+160};S.last={...S.pos};saveWorld();
  G.world=false;G.card=null;G.cardKey=null;$('#wcard').hidden=true;
  CX=0;CY=0;BW=W;BH=H;openIntro(m-1);
}
function returnToWorld(){
  const S=G.save;if(!S||!G.player)return;$('#toast').hidden=true;
  G.mods={};computeStats();runZero6(true);G.combo=null;G.player.hp=Math.min(G.player.hp,G.st.maxHp);
  if(G.boostMsg){G.boostMsg=0;setTimeout(()=>toast('ДВИГАТЕЛИ ПЕРЕНАСТРОЕНЫ','Корабль навсегда стал быстрее.'),400);}
  enterWorldAt(S.pos.x,S.pos.y);
  if(G.arsMsg){G.arsMsg=0;G.trophyMsg=0;const ar=WORLD.arsenal;setTimeout(()=>{banner('АРСЕНАЛ ОТКРЫТ','«ИНЕЙ» · СЕКТОР III · ТРОФЕЙ +2000 ЛОМА');if(G.state==='world'){G.course={x:ar.x,y:ar.y+150,label:ar.name};}},700);}
  else if(G.trophyMsg){const tr=G.trophyMsg;G.trophyMsg=0;setTimeout(()=>banner('ТРОФЕЙ БОССА','+'+tr+' ЛОМА НА СКЛАД'),700);}
  try{const ios=/iP(hone|ad|od)/.test(navigator.userAgent),sa=navigator.standalone||matchMedia('(display-mode: standalone)').matches;if(ios&&!sa&&!SET.iosHint&&doneCount()>=5){SET.iosHint=true;saveSet();setTimeout(()=>toast('СОХРАНИТЕ ПРОГРЕСС','Safari стирает данные сайтов, которые не открывали 7 дней. Добавьте игру на экран «Домой» («Поделиться» → «На экран Домой») или сохраните код в меню «ЕЩЁ» → «КОД СОХРАНЕНИЯ».'),900);}}catch(e){}
  const U=G.unlockPending;G.unlockPending=null;
  if(U){
    if(U.from===6){banner('ВОРОТА СЕКТОРА','УНИЧТОЖЬТЕ ДВА ЗАМКА ГВАРДИИ');const a=WORLD.nodes[5];G.unlockFx={x0:a.x,y0:a.y,x1:WORLD.gate.x,y1:WORLD.gate.y,t:0};}
    else if(U.from===CORE){if(!postGate()){banner('ПРОХОД ПЕРЕКРЫТ','В ЛЁД ВМЁРЗ СТОРОЖЕВИК «ИЗМОРОЗЬ»');const a=WORLD.nodes[CORE-1];G.unlockFx={x0:a.x,y0:a.y,x1:POST_HATCH.x,y1:POST_HATCH.y,t:0};G.course={x:POST_HATCH.x,y:POST_HATCH.y+150,label:'СТОРОЖЕВИК «ИЗМОРОЗЬ»'};setTimeout(()=>{try{radioSay('Х',0);}catch(e){}},2600);}else banner('АКТ I ЗАВЕРШЁН','ДОСТУПЕН НОВЫЙ ЦИКЛ · МАСТЕРСКАЯ ИЛИ УЗЕЛ 10');}
    else{const a=WORLD.nodes[U.from-1],b=WORLD.nodes[U.from];banner('СИГНАЛ РАСШИФРОВАН','МИССИЯ '+pad2(U.from+1)+' ДОСТУПНА');G.unlockFx={x0:a.x,y0:a.y,x1:b.x,y1:b.y,t:0};}
    sfx('flash');
  }
  saveWorld();
}
function worldMissionDone(){if(!G.save||!G.player||!G.mc||G.mode!=='world')return;ambSting('win');buzz('win');{const M=MISSIONS[G.m-1];if(M&&M.gen&&M.sec===3&&wearPct()<=5)conEvent('clearLowWear');if(M&&M.gen&&M.sec===6&&G.mc&&!G.mc.seen80)conEvent('clean85');done90(M);}
  const S=G.save,m=G.m,first=m<=CORE?(m>S.cleared&&!(ALPHA_OPEN&&S.medals[m]&&S.medals[m].clear))/* ВРЕМЕННО (альфа 0.5.9): без повторной первой награды */:!(S.medals[m]&&S.medals[m].clear),p=G.player,node=WORLD.nodes[m-1],D=curDiff(),mul=D.lom*cycLom()*(MISSION_K[m]&&MISSION_K[m].lom||1);
  const md=S.medals[m]||(S.medals[m]={});const got=[];let lom=0,px=0;
  const taken=G.taken-G.missionTaken,cleanLim=m<=6?30:45;
  if(!md.clear){md.clear=1;got.push('Прохождение');}
  if(!md.clean&&taken<cleanLim){md.clean=1;got.push('Чистота');}
  let mastered=false;try{mastered=MASTERY[m-1].ok();}catch(e){}
  if(!md.master&&mastered){md.master=1;got.push('Мастерство');}
  lom+=got.length*20;
  const k=S.replays[m]||0;
  const sr=secRew(m),firstLom=m<=CORE?20+12*m:Math.round((100+3*(m-CORE))*sr*(m>=15?3:1));/* 0.7.0: сектора IV+ платят втрое */
  if(first){lom+=firstLom;px+=(40+8*m)*mul*sr;}
  else{lom+=m>CORE?Math.round(firstLom*.35)/* 0.7.0: повторы в секторах III+ — плоские 35 % */:Math.max(2,Math.round((6+2*m)*Math.pow(.6,k)));px+=Math.max(10,(40+8*m)*Math.pow(.6,k+1))*mul;S.replays[m]=k+1;}
  lom=Math.round(lom*mul*(G.sbLomK||1))+Math.round(G.lom74||0);px+=25*got.length;
  {const tr=BOSS_TROPHY[m];if(tr&&!(S.trophy&&S.trophy[m])){S.trophy=S.trophy||{};S.trophy[m]=1;lom+=tr;G.trophyMsg=tr;if(m===14)G.arsMsg=1;}}
  S.lom+=lom;addPilotXP(px);const tsec=Math.round(G.mT);if(!S.best[m]||tsec<S.best[m])S.best[m]=tsec;
  S.bestDiff[m]=Math.max(S.bestDiff[m]??-1,D.rank);
  const healed=Math.round(Math.min(G.st.maxHp-p.hp,G.st.maxHp*.3));p.hp+=healed;
  if(first&&m<=CORE){G.unlockPending={from:m};}
  if(first&&m===CORE&&!S.speedBoost){S.speedBoost=1;G.boostMsg=1;}
  if(m<=CORE){if(ALPHA_OPEN){if(m===S.cleared+1){S.cleared=m;while(S.cleared<CORE&&S.medals[S.cleared+1]&&S.medals[S.cleared+1].clear)S.cleared++;}}/* ВРЕМЕННО (альфа 0.5.9): cleared растёт только по порядку */else S.cleared=Math.max(S.cleared,m);}S.pos={x:node.x,y:node.y+160};S.last={...S.pos};
  REC.maxMission=Math.max(REC.maxMission,m+1);REC.best=Math.max(REC.best,G.score);saveRec();
  conEvent('clear',D.rank);if(G.mc.pulses===0&&m>=2)conEvent('clearNoPulse');if(G.mc.dashes===0)conEvent('clearNoDash');
  if(G.bc&&G.bc.hp>=G.bc.maxHp*.9)conEvent('clearBc90');got.forEach(()=>conEvent('medal'));
  if(first)fillContracts();saveWorld();
  scr6('done');
  $('#dnEyebrow').textContent=(m===6&&first?'ЯДРО ПРОЙДЕНО':m===CORE&&first?'АКТ I ЗАВЕРШЁН':'МИССИЯ ВЫПОЛНЕНА');
  $('#dnName').textContent=mName(MISSIONS[m-1]);
  const cells=[['ВРЕМЯ',mmss(G.mT)],['ЛОМ',lomH('+'+lom,1)]];
  $('#dnStats').innerHTML=statCells(cells);
  const mrow=(on,name,cond)=>`<span style="color:${on?'var(--amber)':'var(--muted)'}">${on?'●':'○'} ${name}${cond?' — '+cond:''}</span>`;
  const fx=v=>v.toFixed(2).replace('.',',').replace(/0$/,'').replace(/,$/,'');
  $('#dnNote').innerHTML=`<span style="display:grid;gap:4px;font-family:var(--f-mono);font-size:12px">${mrow(md.clear,'Прохождение')}${mrow(md.clean,'Чистота','почти без урона')}${mrow(md.master,'Мастерство',MASTERY[m-1].t)}</span>`+
    (G.sbChoiceTxt?'<br>'+G.sbChoiceTxt:'');
  $('#bNext').firstChild.nodeValue='В СЕКТОР ';$('#bDoneMenu').textContent='В МЕНЮ';
  show('sDone');(touchMode||$('#bNext').focus());
}
function worldRespawn(){
  if(G.zb&&typeof zbAbort==='function')zbAbort('death');
  const S=G.save,p=G.player;
  let lx=p.x,ly=p.y;if(!inSectors(lx,ly)){const R_=riftInfo(lx,ly);lx=R_.nx-R_.ox*150;ly=R_.ny-R_.oy*150;}
  if(S.carry>0){S.lost={x:Math.round(lx),y:Math.round(ly),v:S.carry+(S.lost?S.lost.v:0)};S.carry=0;}
  const wasRift=G.riftDeath;G.riftDeath=0;G.unk=[];G.eb=[];G.riftI=wasRift?.7:G.riftI;
  G.enemies.forEach(e=>{if(e.zone)e.alive=false;});G.enemies=G.enemies.filter(e=>e.alive);G.zones.forEach(z=>{z.active=false;});G.eb=[];endAnom();clearIce();G.iceImm=0;if(G.w){G.w.chill=0;G.w.chillT=0;G.w.iced=false;G.w.ambush=null;}G.chillK=1;G.chillD=1;
  Object.assign(p,{hp:G.st.maxHp*.7,x:S.last.x,y:S.last.y,vx:0,vy:0,inv:2.5,dashT:0,trail:[]});p.px=p.x;p.py=p.y;camSnap();
  banner('КОРАБЛЬ ВОССТАНОВЛЕН',wasRift?(S.lost?'У ПОСЛЕДНЕЙ ТОЧКИ · ЛОМ ОСТАЛСЯ У КРАЯ СЕКТОРА':'У ПОСЛЕДНЕЙ ТОЧКИ'):S.lost?'ПОТЕРЯННЫЙ ЛОМ ЖДЁТ НА МЕСТЕ ГИБЕЛИ':'У ПОСЛЕДНЕЙ ТОЧКИ');saveWorld();
}

// ---- обновление мира ----
function worldUpdate(dt){
  applyWH();G.t+=dt;BW=WW;BH=WH;const S=G.save,p=G.player,st=G.st;
  if(G.deadT>0){G.deadT-=dt;updateFx(dt);camFollow(dt);if(G.riftDeath)G.riftI=1;if(G.deadT<=0)worldRespawn();return;}
  const hostile=G.enemies.some(e=>e.alive&&e.type!=='mine'&&e.type!=='lock'&&e.type!=='rangedummy'&&!e.peace&&Math.hypot(e.x-p.x,e.y-p.y)<750);
  if(hostile||G.hurtV>0||G.anom)G.calm=0;else G.calm+=dt;
  G.cruise=G.calm>2.2&&(G.riftI||0)<.1;
  const base=st.speed;if(G.cruise)st.speed=base*1.75*(G.w&&G.w.cruiseK||1);
  /*DEVW*/if(window.DEVW&&DEVW.on())DEVW.move(dt);else updatePlayer(dt);st.speed=base;regenTick(dt);updateRift(dt);if(G.pilotUps&&G.pilotUps.length)flushPilotUps();
  if(G.abyssImm>0)G.abyssImm-=dt;G.abyssPull=0;
  if(abyssOpen()&&!(G.abyssImm>0)&&p.hp>0&&!(p.dashT>0)){const a=WORLD.abyss,d=Math.hypot(a.x-p.x,a.y-p.y);if(d<520&&d>70){// 0.5.9: притяжение сильнее, шире и видно
    const k=160*Math.pow(1-d/520,.7)*dt;p.x+=(a.x-p.x)/d*k;p.y+=(a.y-p.y)/d*k;G.calm=0;G.abyssPull=1;hintOnce('abyssPull','БЕЗДНА ТЯНЕТ · ВХОД В ЦЕНТРЕ','#c9a6ff');
    if(SET.fx&&vR2()<dt*12)part(p.x+vrnd2(-10,10),p.y+vrnd2(-10,10),(a.x-p.x)/d*220,(a.y-p.y)/d*220,.6,'#c9a6ff',2);}}
  if(G.cruise&&SET.fx&&Math.hypot(p.vx,p.vy)>320&&vR2()<.6)part(p.x-p.vx*.04+vrnd2(-6,6),p.y-p.vy*.04+vrnd2(-6,6),-p.vx*.3,-p.vy*.3,.35,shipCol(),2);
  // барьеры: помехи вокруг закрытых узлов и ворота
  wellTick(dt);
  if(!gateOpen()&&p.px<=4945&&p.x>4945&&p.y>OY)/* ВРЕМЕННО (альфа 0.5.9): gateOpen() вместо S.gate */{p.x=4945;p.vx=-140;p.dashT=0;hintOnce('gate',S.cleared>=6?'ВОРОТА ЗАПЕРТЫ · УНИЧТОЖЬТЕ ДВА ЗАМКА':'ВОРОТА СЕКТОРА · СНАЧАЛА ЯДРО СТРАЖА','#b48cff');}
  gate110(p,S);fogWall(p);
  // обломки рядом с кораблём
  G.rocks=G.wrocks.filter(r=>r.alive&&Math.abs(r.x-p.x)<W+300&&Math.abs(r.y-p.y)<H+300);
  for(const r of G.rocks){r.rot+=r.vr*dt;r.hitF=Math.max(0,r.hitF-dt);
    const d=Math.hypot(p.x-r.x,p.y-r.y),m=r.r+p.r*.8;if(d<m&&d>0){p.x=r.x+(p.x-r.x)/d*m;p.y=r.y+(p.y-r.y)/d*m;}
    for(const e of G.enemies){if(!e.alive||STATIC.has(e.type)||e.type==='mine')continue;const q=Math.hypot(e.x-r.x,e.y-r.y),mm=r.r+e.r;if(q<mm&&q>0){e.x=r.x+(e.x-r.x)/q*mm;e.y=r.y+(e.y-r.y)/q*mm;}}}
  updateEnemies(dt);
  for(const e of G.enemies){if(!e.zone||!e.alive)continue;if(!inSectors(e.x,e.y)){const R_=riftInfo(e.x,e.y);e.x=R_.nx-R_.ox*20;e.y=R_.ny-R_.oy*20;e.vx*=.3;e.vy*=.3;}if(G.riftD>0&&e.cd!==undefined)e.cd=Math.max(e.cd,.6);}
  updateFields(dt);updateBullets(dt);updatePickups(dt);
  G.wrocks=G.wrocks.filter(r=>r.alive);
  secTick(dt);secWorldTick(dt);w74WorldTick(dt);w80WorldTick(dt);updateZones(dt);updatePOI(dt);storyWorldTick(dt);updateAnom(dt);revealAround(p.x,p.y,900);
  if(G.unlockFx){G.unlockFx.t+=dt;if(G.unlockFx.t>3.2)G.unlockFx=null;}
  updateFx(dt);zbCamPre();camFollow(dt);zbTick(dt);
  runLvlUp6(p);
  if(G.lvlQ>0&&G.state==='world'&&G.deadT<=0)nextPick();
  G.saveT-=dt;if(G.saveT<=0){G.saveT=8;saveWorld();}
}
function updateZones(dt){
  const S=G.save,p=G.player;
  for(const z of G.zones){if(z.w58)continue;
    if(z.cool>0)z.cool-=dt;
    if(S.cleared<z.req||(z.gate&&S.gate))continue;
    const d=Math.hypot(p.x-z.x,p.y-z.y);
    if(!z.active){
      if(z.cool<=0&&d<950&&p.hp>0){z.active=true;z.n=0;
        for(const [t,c] of Object.entries(z.set)){
          if(t==='twin'){for(let i=0;i<c/2;i++){const id=++G.uid;for(let k=0;k<2;k++){spawnEnemy('twin',z.x+rnd(-240,240),z.y+rnd(-240,240),{spawnT:.7,zone:z,pair:id,noAffix:true});z.n++;}}continue;}
          for(let i=0;i<c;i++){spawnEnemy(t,z.x+rnd(-260,260),z.y+rnd(-260,260),{spawnT:.7,zone:z,noAffix:true});z.n++;}}
        floater(p.x,p.y-40,z.gate?'ЗАСЛОН ГВАРДИИ':'ПАТРУЛЬ','#ff4f6e');sfx('warn');}
    }else{
      const left=G.enemies.filter(e=>e.alive&&e.zone===z).length;
      if(left===0){z.active=false;z.cool=240;const first=!S.zonesDone[z.idx];const v=first?10+z.n*3:3;S.zonesDone[z.idx]=1;S.carry+=v;floater(p.x,p.y-40,'ПАТРУЛЬ РАЗБИТ · +'+v+' ЛОМА'+(first?'':' · ПОВТОР'),'#c9d2de');sfx('level');conEvent('patrol');}
      else if(d>1900){G.enemies.forEach(e=>{if(e.zone===z)e.alive=false;});z.active=false;}
    }
  }
}
function updatePOI(dt){
  const S=G.save,p=G.player;if(p.hp<=0)return;
  let card=null;
  for(const n of WORLD.nodes){if(nodeState(n.m)==='locked')continue;if(Math.hypot(p.x-n.x,p.y-n.y)<150){card={kind:'node',n,key:'n'+n.m};S.last={x:n.x,y:n.y+150};}}
  for(const s of WORLD.shops){if(Math.hypot(p.x-s.x,p.y-s.y)<175){card={kind:'shop',s,key:s.id};S.last={x:s.x,y:s.y+150};}}
  for(const a of WORLD.anomalies){if(S.anomalies[a.id]||G.anom||(G.anomCd&&G.anomCd[a.id]>G.t))continue;if(Math.hypot(p.x-a.x,p.y-a.y)<170)card={kind:'anom',a,key:a.id};}
  {const hg=WORLD.hangar;if(Math.hypot(p.x-hg.x,p.y-hg.y)<175){card={kind:'hangar',key:'hangar|'+curSkin()};S.last={x:hg.x,y:hg.y+150};}}
  {const ar=WORLD.arsenal;if(Math.hypot(p.x-ar.x,p.y-ar.y)<175){card={kind:'arsenal',key:'arsenal|'+(arsOpen()?1:0)+'|'+(S.ars?S.ars.weapon:'')};S.last={x:ar.x,y:ar.y+150};}}
  for(const sc of WORLD.sectors)if(sc.bx&&Math.hypot(p.x-sc.bx,p.y-sc.by)<220)S.last={x:sc.bx,y:sc.by+150};
  if(abyssOpen()){const ab=WORLD.abyss;if(Math.hypot(p.x-ab.x,p.y-ab.y)<200){card={kind:'abyss',key:'abyss'};S.last={x:ab.x,y:ab.y+620};}}
  for(const r of WORLD.relays){if(S.relays[r.id])continue;const d=Math.hypot(p.x-r.x,p.y-r.y);
    if(d<120){r.rep=(r.rep||0)+dt;if(r.rep>=2){S.relays[r.id]=1;r.rep=0;revealAround(r.x,r.y,2400);S.lom+=30;banner('РЕТРАНСЛЯТОР ВОССТАНОВЛЕН','КАРТА РАСКРЫТА · +30 ЛОМА · НОВАЯ ТОЧКА ПРЫЖКА');sfx('level');G.shock.push({x:r.x,y:r.y,r:10,R:900,t:0,col:'#8fe9ff',slow:true});saveWorld();}}
    else r.rep=Math.max(0,(r.rep||0)-dt);}
  for(const c of WORLD.caches){if(S.found[c.id])continue;if(Math.hypot(p.x-c.x,p.y-c.y)<75){const cv=80+20*WORLD.caches.indexOf(c);S.found[c.id]=1;S.lom+=cv;addPilotXP(20);banner('ТАЙНИК · ЗАКЛАДКА Э.','+'+cv+' ЛОМА НА СКЛАД · +20 ОПЫТА ПИЛОТА');sfx('level');explode(c.x,c.y,'#ffb84d',30,1);saveWorld();}}
  for(const j of WORLD.journals){if(S.journals[j.id])continue;if(Math.hypot(p.x-j.x,p.y-j.y)<wreckR(j)){S.journals[j.id]=1;(S.jOrder||(S.jOrder=[])).includes(j.id)||S.jOrder.push(j.id);S.lom+=10;toast(j.title,j.text+' (+10 лома · J — все журналы)');sfx('pick');saveWorld();}}
  if(S.lost&&Math.hypot(p.x-S.lost.x,p.y-S.lost.y)<80){S.carry+=S.lost.v;floater(p.x,p.y-30,'ЛОМ ВОЗВРАЩЁН · +'+S.lost.v,'#c9d2de');S.lost=null;sfx('cell');saveWorld();}
  card=arch70POI(card,dt);/* ARCH·70 A-9 */if(card&&card.kind==='node'&&card.n.m===50&&zbOn())card=null;
  G.card=card;renderCard(card);
}
function renderCard(card){
  const el=$('#wcard');const key=card?card.key+'|'+G.save.cleared+'|'+G.save.lom+(card.kind==='node'&&card.n.m===50?'|'+(zbOn()?'z':zbDone()?'d':G.zbCool>G.t?'c':'o'):''):'';
  if(key===G.cardKey)return;G.cardKey=key;
  if(!card||G.state!=='world'){el.hidden=true;return;}
  const S=G.save;let h='';
  if(card.kind==='node'&&card.n.m===50){h=zbCard();}
  else if(card.kind==='node'){const m=card.n.m,M=MISSIONS[m-1],md=S.medals[m]||{},done=nodeState(m)==='done';
    h=`<div class="eyebrow">МИССИЯ ${pad2(m)}${done?' · ПРОЙДЕНА':''}</div><h3>${mName(M)}${M.bossRoom||M.boss||M.sboss?' <span class="badge" style="color:#ff6b8a">БОСС</span>':''}</h3>

      <div class="medals"><i class="${md.clear?'on':''}"></i><i class="${md.clean?'on':''}"></i><i class="${md.master?'on':''}"></i><span>${S.best[m]?'лучшее время '+mmss(S.best[m]):''}</span></div>
      ${done?`<p class="note">Мастерство: ${MASTERY[m-1].t}.</p>`:''}
      <div class="wc-row"><button class="wbtn" data-act="enter">ВОЙТИ [F]</button>${m===CORE&&S.cleared>=CORE?`<button class="wbtn amber" data-act="cycle">НОВЫЙ ЦИКЛ</button>`:''}</div>`;}
  else if(card.kind==='shop'){h=`<div class="eyebrow">${card.s.name}</div><h3>Ремонт и улучшения</h3><p class="note">На складе ${lomH(S.lom,1)}${S.carry?' · с собой '+lomH(S.carry):''}</p><div class="wc-row"><button class="wbtn amber" data-act="shop">ОТКРЫТЬ [F]</button></div>`;}
  else if(card.kind==='hangar'){h=`<div class="eyebrow">${WORLD.hangar.name}</div><h3>Скины корабля</h3><p class="note">${SKINS[curSkin()].name}</p><div class="wc-row"><button class="wbtn amber" data-act="hangar">ОТКРЫТЬ [F]</button></div>`;}
  else if(card.kind==='arsenal'){const open=arsOpen(),A=S.ars||arsDef();h=`<div class="eyebrow">${WORLD.arsenal.name}${open?'':' · ЗАПЕЧАТАН'}</div><h3>${open?'Прокачка орудия и второе оружие':'Склад Изобретателя'}</h3><p class="note">${open?`Оружие: ${ARS[A.weapon].name} · на складе ${lomH(S.lom,1)}`:'Откроется после победы над боссом Холодного архива.'}</p><div class="wc-row">${open?'<button class="wbtn amber" data-act="arsenal">ОТКРЫТЬ [F]</button>':'<button class="wbtn" disabled>ЗАПЕЧАТАНО</button>'}</div>`;}
  else if(card.kind==='abyss'){const eb=bestEndless();h=`<div class="eyebrow">∞ БЕЗДНА · БЕСКОНЕЧНОСТЬ</div><h3>Забег на выживание</h3><p class="note">Бесконечность на базовом корабле. В сектор ничего не переносится.${eb?' Лучшее: '+mmss(eb.t)+'.':''}</p><div class="wc-row"><button class="wbtn violet" data-act="abyss">ВОЙТИ [F]</button></div>`;}
  else if(card.kind==='anom'){h=`<div class="eyebrow">АНОМАЛИЯ · ${card.a.name}</div><p>${card.a.d}</p><div class="wc-row"><button class="wbtn violet" data-act="anom">НАЧАТЬ [F]</button></div>`;}
  else if(card.kind==='conv')h=w58Card(card);
  el.innerHTML=kh(h);el.hidden=false;if(typeof ctxBtnSync==='function')ctxBtnSync();
}
function cardAct(act){
  const c=G.card;if(!c||G.state!=='world')return;
  if(act==='cycle'){if(c.kind==='node'&&c.n.m===CORE&&G.save.cleared>=CORE)openCycle();return;}
  if(c.kind==='node'){if(act==='echo')return;{if(c.n.m===50){if(zbOn())return;if(!zbCanStart()){hintOnce('n50',G.zbCool>G.t?'ТОЧКА НЕВОЗВРАТА ЗАКРЫТА · '+Math.ceil(G.zbCool-G.t)+' С':'КНОПКА НЕ ОТВЕЧАЕТ','#ff9fe0');return;}zbStart();return;}enterNode(c.n.m,false);}}
  else if(c.kind==='shop'&&act!=='echo')openShop(c.s);
  else if(c.kind==='anom'&&act!=='echo')startAnom(c.a);
  else if(c.kind==='conv'&&act!=='echo')w58ConvStart();
  else if(c.kind==='hangar'&&act!=='echo')openHangar();
  else if(c.kind==='arsenal'&&act!=='echo'){if(arsOpen())openArsenal();}
  else if(c.kind==='abyss'&&act!=='echo')enterAbyss();
}
$('#wcard').addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(b)cardAct(b.dataset.act);});
let toastTimer=0;
function toast(title,text){$('#toastT').textContent=kh(title);$('#toastP').textContent=kh(text);$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{$('#toast').hidden=true;},8000);}

// ---- аномалии ----
function startAnom(a){
  G.anom={a,t:0,got:0,objs:[]};G.cardKey=null;const S=G.save,R=(x,y,o)=>{const m=spawnEnemy('mine',x,y,Object.assign({arm:0,fuse:0,life:1e9,noAffix:true,anomObj:true},o||{}));G.anom.objs.push(m);return m;};
  if(a.kind==='cells'){G.anom.dur=22;G.anom.need=8;G.anom.tp=6;
    for(let i=0;i<10;i++){const ang=rnd(0,TAU),d=rnd(140,470),da=rnd(0,TAU),sp=rnd(40,70);G.pick.push({k:'cell',x:a.x+Math.cos(ang)*d,y:a.y+Math.sin(ang)*d,vx:0,vy:0,r:9,t:0,stab:0,life:24,anom:true,noMag:true,dx:Math.cos(da)*sp,dy:Math.sin(da)*sp});}
    for(let i=0;i<4;i++){const ang=i/4*TAU+.4;R(a.x+Math.cos(ang)*260,a.y+Math.sin(ang)*260);}
    banner('АНОМАЛИЯ · РОССЫПЬ','8 ИЗ 10 ЯЧЕЕК ЗА 22 С · ЯЧЕЙКИ УБЕГАЮТ — БЕРИТЕ РЫВКОМ');}
  if(a.kind==='storm'){G.anom.dur=30;G.anom.next=1;G.anom.R=400;G.anom.beamA=rnd(0,TAU);banner('АНОМАЛИЯ · ИОННЫЙ ВИХРЬ','30 С В СЖИМАЮЩЕМСЯ КРУГЕ · С 12 С — ЛУЧИ');}
  if(a.kind==='coldcore'){w58CoreStart(a);}
  if(a.kind==='chase'){G.anom.dur=25;const e=spawnEnemy('thief',a.x+60,a.y,{noAffix:true,anomObj:true});e.hp=e.maxHp=150;e.armor=3;e.spd=310;e.flee=true;e.loot=0;const ang=rnd(0,TAU);
    e.fx=clamp(a.x+Math.cos(ang)*3200,100,WW-100);e.fy=clamp(a.y+Math.sin(ang)*3200,100,WH-100);G.anom.target=e;prioSet(e);G.anom.dashT=4;G.anom.mineT=2.5;G.anom.boost=0;
    for(let i=0;i<2;i++){const g=spawnEnemy('gunner',e.x+rnd(-60,60),e.y+rnd(-60,60),{noAffix:true,anomObj:true});G.anom.objs.push(g);}
    banner('АНОМАЛИЯ · ПОГОНЯ','ПОХИТИТЕЛЬ БЫСТРЕЕ ВАС · ПЕРЕХВАТЫВАЙТЕ И ДЕЛАЙТЕ РЫВОК');}
  sfx('warn');
}
function endAnom(){const A=G.anom;if(!A)return;G.enemies.forEach(e=>{e.tK=1;});if(A.a.kind==='conveyor'){G.enemies.forEach(e=>{if(e.conv)e.alive=false;});G.event=null;}for(const o of A.objs)o.alive=false;if(A.target&&A.target.alive)A.target.alive=false;G.pick=G.pick.filter(k=>!k.anom);G.anom=null;G.cardKey=null;}
function updateAnom(dt){
  const A=G.anom;if(!A)return;const S=G.save,p=G.player,a=A.a;A.t+=dt;G.calm=0;
  const fail=why=>{banner('АНОМАЛИЯ ПРОВАЛЕНА',why+' · ПОВТОР ЧЕРЕЗ 30 С');(G.anomCd||(G.anomCd={}))[a.id]=G.t+30;endAnom();};
  const win=v=>{S.anomalies[a.id]=1;S.lom+=v;addPilotXP(40);banner('АНОМАЛИЯ ПРОЙДЕНА','+'+v+' ЛОМА · +40 ОПЫТА ПИЛОТА');sfx('level');endAnom();conEvent('anom');saveWorld();};
  if(a.kind==='conveyor'){w58ConvTick(dt);return;}
  if(a.kind==='coldcore'){w58CoreTick(dt,fail,win);return;}
  if(p.hp<=0){fail('КОРАБЛЬ ПОТЕРЯН');return;}
  if(a.kind==='cells'){
    if(A.got>=A.need){win(100);return;}if(A.t>A.dur){fail('ВРЕМЯ ВЫШЛО');return;}
    const cells=G.pick.filter(k=>k.anom&&k.life>0);
    A.tp-=dt;if(A.tp<=0&&cells.length){A.tp=6;const c=cells[Math.random()*cells.length|0];const ang=rnd(0,TAU),d=rnd(140,460);explode(c.x,c.y,'#ffb84d',6,.5);c.x=a.x+Math.cos(ang)*d;c.y=a.y+Math.sin(ang)*d;}
    for(const c of cells){c.x+=c.dx*dt;c.y+=c.dy*dt;const ra=Math.hypot(c.x-a.x,c.y-a.y);if(ra>480){c.dx=-c.dx;c.dy=-c.dy;c.x=a.x+(c.x-a.x)*479/ra;c.y=a.y+(c.y-a.y)*479/ra;}
      const d=Math.hypot(c.x-p.x,c.y-p.y);if(d<130&&p.dashT<=0&&d>1){c.x+=(c.x-p.x)/d*265*dt;c.y+=(c.y-p.y)/d*265*dt;}c.life=Math.max(c.life,2);}
  }
  else if(a.kind==='storm'){
    A.R=400-180*clamp(A.t/A.dur,0,1);
    if(Math.hypot(p.x-a.x,p.y-a.y)>A.R){fail('ВЫ ПОКИНУЛИ КРУГ');return;}
    A.next-=dt;if(A.next<=0){A.next=Math.max(.6,1.2-.02*A.t);const gap=Math.atan2(p.y-a.y,p.x-a.x)+rnd(-.8,.8);
      for(let i=0;i<26;i++){const ang=i/26*TAU+A.t;if(Math.abs(angDiff(ang,gap))<.45)continue;shootE(a.x,a.y,ang,150,8,'#9fb4ff',5);}}
    if(A.t>=12){A.beamA+=dt*.55;const cyc=(A.t-12)%4.3;A.beamWarn=cyc<.8;A.beamOn=cyc>=.8&&cyc<3.8;
      if(A.beamOn)for(const k of [0,Math.PI]){const ang=A.beamA+k,ex=a.x+Math.cos(ang)*A.R,ey=a.y+Math.sin(ang)*A.R;if(segDist(a.x,a.y,ex,ey,p.x,p.y)<16)damagePlayer(14);}}
    if(A.t>A.dur){G.eb=[];win(130);}}
  else if(a.kind==='chase'){const e=A.target;
    if(!e.alive){if(e.hp<=0)win(130);else fail('ПОХИТИТЕЛЬ УШЁЛ');return;}
    if(A.t>A.dur||Math.hypot(e.x-a.x,e.y-a.y)>2600){fail('ПОХИТИТЕЛЬ УШЁЛ');return;}
    A.dashT-=dt;e.blink=A.dashT<.4;if(A.dashT<=0){A.dashT=4;const base=Math.atan2(e.fy-e.y,e.fx-e.x)+rnd(-1.05,1.05);explode(e.x,e.y,'#9dff6b',8,.5);e.x=clamp(e.x+Math.cos(base)*260,40,WW-40);e.y=clamp(e.y+Math.sin(base)*260,40,WH-40);sfx('dash');}
    A.mineT-=dt;if(A.mineT<=0){A.mineT=2.5;const m=spawnEnemy('mine',e.x,e.y,{arm:0,fuse:0,life:1e9,noAffix:true,anomObj:true});A.objs.push(m);}
    const d=Math.hypot(e.x-p.x,e.y-p.y);if(A.boost>0)A.boost-=dt;else if(d<200)A.boost=1.5;e.spd=A.boost>0?382:310;
    for(const g of A.objs)if(g.type==='gunner'&&g.alive){const tx=(e.x*2+p.x)/3,ty=(e.y*2+p.y)/3;g.x+=(tx-g.x)*Math.min(1,dt*1.5);g.y+=(ty-g.y)*Math.min(1,dt*1.5);}}
}

