// =====================================================================
// ---------- ВЫБОР МИССИЙ (режим разработчика) ----------
// включается константой DEV_MENU; ничего не пишет в сохранения
// =====================================================================
const DEV_MENU=true;
/* 1.1.0: меню разработчика скрыто от игроков; вход — пять нажатий по логотипу или ?dev в адресе (запоминается в этой вкладке) */
function devUnlocked(){try{if(/[?&#]dev\b/.test(location.search+location.hash))sessionStorage.setItem('void_dev_ui','1');return DEV_MENU&&(window.__devUI===true||sessionStorage.getItem('void_dev_ui')==='1');}catch(e){return window.__devUI===true;}}
(function(){let n=0,t=0;const L=document.querySelector('#sMenu .logo');if(L)L.addEventListener('click',()=>{const now=performance.now();n=now-t<600?n+1:1;t=now;if(n>=5){window.__devUI=true;try{sessionStorage.setItem('void_dev_ui','1');}catch(e){}renderMenu();toast('РАЗРАБОТКА','Меню разработчика открыто.');}});})();
const DEV_TYP=[0,3,6,9,12,14,15,16,18,20];
const DEV_TOG=[['god','Бессмертие корабля'],['bcGod','Неуязвимый маяк'],['speed','Скорость времени ×2'],['hit','Показать хитбоксы'],['fps','FPS и число объектов'],['diag77','Диагностика кадров']];/* ARCH·77 */
G.dev=Object.assign({build:'typ',god:false,bcGod:false,speed:false,hit:false,fps:false,step:1,diff:'easy',cycle:1},store('void_dev')||{});
function devBuild(m,b){
  const avail=Object.keys(MODS).filter(k=>MODS[k].from<=m),mods={};
  if(b==='max')avail.forEach(k=>mods[k]=MODS[k].max);
  else if(b==='typ'){for(let i=0;i<(DEV_TYP[m-1]??20);i++){const ks=avail.filter(k=>(mods[k]||0)<MODS[k].max);if(!ks.length)break;const k=ks[Math.random()*ks.length|0];mods[k]=(mods[k]||0)+1;}}
  return mods;
}
function openDev(){
  banT=0;$('#banner').classList.remove('show');scr6('dev');G.devRun=false;G.mode=null;G.world=false;G.player=null;G.bc=null;G.boss=null;G.jam=null;G.dark=false;CX=0;CY=0;
  $('#devGrid').innerHTML=MISSIONS.slice(0,NM).map((M,i)=>`<button class="devm" data-m="${i+1}"><b>${pad2(i+1)}</b><span>${M.name}</span><small>${M.gen?(M.bossRoom?'БОСС · ':'')+'СЕКТОР '+roman(M.sec+1):i<6?'АКТ I':'АКТ II'}</small></button>`).join('')+
    `<button class="devm end" data-m="end"><b>∞</b><span>Бесконечность</span><small>СТУПЕНЬ ${G.dev.step}</small></button>`;
  renderDevOpts();show('sDev');/*DEVW*/if(window.DEVW)DEVW.devCard();
}
function renderDevOpts(){
  const D=G.dev;store('void_dev',D);
  document.querySelectorAll('#devBuild button').forEach(b=>b.classList.toggle('on',b.dataset.b===D.build));
  $('#devToggles').innerHTML=DEV_TOG.map(([k,n])=>`<button class="tog dtog ${D[k]?'on':''}" data-d="${k}"><span>${n}</span><span>${D[k]?'ВКЛ':'ВЫКЛ'}</span></button>`).join('');
  document.querySelectorAll('#devDiff [data-df]').forEach(b=>b.classList.toggle('on',b.dataset.df===D.diff));$('#devCyc').textContent=roman(D.cycle||1);
  $('#devStep').textContent=D.step;const end=document.querySelector('.devm.end small');if(end)end.textContent='СТУПЕНЬ '+D.step;
}
function devStart(m){
  riftReset();audioInit();const D=G.dev;G.mode='dev';G.devRun=true;G.world=false;
  G.mods=devBuild(m,D.build);computeStats();G.player=newPlayer();G.player.hp=G.st.maxHp;
  const lv=1+Object.values(G.mods).reduce((a,b)=>a+b,0);
  runStart6(lv);Object.assign(G,{score:0,kills:0,taken:0,inRun:true});
  openIntro(m-1);
}
function devMissionDone(){ambSting('win');
  scr6('done');
  $('#dnEyebrow').textContent='ТЕСТ · МИССИЯ '+pad2(G.m)+' ПРОЙДЕНА · НЕ ЗАПИСАНО';$('#dnName').textContent=MISSIONS[G.m-1].name;
  const cells=[['ВРЕМЯ',mmss(G.mT)],['УНИЧТОЖЕНО',G.kills-G.missionKills],['ПОЛУЧЕНО УРОНА',Math.round(G.taken-G.missionTaken)],['УРОВЕНЬ МОДУЛЕЙ',G.lvl]];
  if(G.bc)cells.splice(3,0,['МАЯК ЦЕЛ НА',Math.round(G.bc.hp/G.bc.maxHp*100)+'%']);
  $('#dnStats').innerHTML=statCells(cells);
  let mast='';try{mast=MASTERY[G.m-1].ok()?'выполнено':'не выполнено';}catch(e){mast='—';}
  $('#dnNote').textContent='Условие мастерства «'+MASTERY[G.m-1].t+'»: '+mast+'. Прогресс и медали не сохраняются.';
  $('#bNext').firstChild.nodeValue='ЕЩЁ РАЗ ';$('#bDoneMenu').textContent='К ВЫБОРУ МИССИЙ';
  show('sDone');(touchMode||$('#bNext').focus());
}
$('#devGrid').addEventListener('click',e=>{const b=e.target.closest('.devm');if(!b)return;if(b.dataset.m==='end')startEndless(true,G.dev.step);else devStart(+b.dataset.m);});
$('#devBuild').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;G.dev.build=b.dataset.b;renderDevOpts();});
$('#devToggles').addEventListener('click',e=>{const b=e.target.closest('.dtog');if(!b)return;const k=b.dataset.d;G.dev[k]=!G.dev[k];renderDevOpts();});
$('#devStepM').onclick=()=>{G.dev.step=Math.max(1,G.dev.step-1);renderDevOpts();};
$('#devStepP').onclick=()=>{G.dev.step=Math.min(15,G.dev.step+1);renderDevOpts();};
$('#bDevBack').onclick=()=>toMenu();
$('#devDiff').addEventListener('click',e=>{const b=e.target.closest('[data-df]');if(!b)return;G.dev.diff=b.dataset.df;renderDevOpts();});
$('#devCycM').onclick=()=>{G.dev.cycle=Math.max(1,(G.dev.cycle||1)-1);renderDevOpts();};
$('#devCycP').onclick=()=>{G.dev.cycle=Math.min(6,(G.dev.cycle||1)+1);renderDevOpts();};
function devAny(){return G.devRun||!!(window.DEVW&&DEVW.on());}/*DEVW*/
const devOn=k=>devAny()&&G.dev[k];
// панель быстрых действий
function toggleDevPanel(force){/*DEVW*/if(window.DEVW&&DEVW.on()&&G.state==='world'){DEVW.panel(force);return;}if(!devAny())return;const P=$('#devPanel');P.hidden=force!==undefined?!force:!P.hidden;if(!P.hidden)renderDevPanel();}
function renderDevPanel(){
  const sel=$('#devSpawn');if(!sel.options.length)sel.innerHTML=CODEX_ORDER.filter(k=>!['boss','jam','pylon','inventor','obheart','shell','icecopy','cpart','invcell','invcore','obseg','hull','lock','rustcopy'].includes(k)&&EDEF[k]).map(k=>`<option value="${k}">${EDEF[k].name}</option>`).join('');
  const M=G.mode==='endless'?null:MISSIONS[G.m-1];
  $('#dvBoss').hidden=!(M&&(M.boss||M.transmit||M.sboss));$('#dvBoss').textContent=G.boss||G.jam||G.sb?'СЛЕДУЮЩАЯ ФАЗА БОССА':'ПЕРЕЙТИ К БОССУ';
  $('#dvCharge').hidden=!G.bc;$('#dvWave').hidden=!(M&&!M.beacon&&!M.boss);$('#dvStep').hidden=G.mode!=='endless';
}
function devAct(a){
  if(!devAny()||G.state!=='play')return;const M=G.mode==='endless'?null:MISSIONS[G.m-1];
  const clearAll=()=>{G.warns=[];G.spawnQ=[];for(let k=0;k<2;k++)G.enemies.slice().forEach(e=>{if(e.alive&&!['boss','jam','lock'].includes(e.type)&&!EDEF[e.type].sbp)kill(e,false);});};
  if(a==='kill')clearAll();
  if(a==='wave'){clearAll();G.gapT=0;}
  if(a==='lvl')runGrant6('lvl');
  if(a==='plvl'||a==='lom'){const sb=!!(window.DEVW&&DEVW.on()),K='void_devworld',S=sb?G.save:(migrateSave(store(K))||migrateSave(newSave()));if(a==='lom')S.lom+=500;else{const keep=G.save;try{addPilotXPTo(S,pilotNeed(S.pilot.lvl)-S.pilot.xp);}finally{if(!sb)saveSet6(keep,'temp');}if(!sb)G.pilotUps=[];}store(K,S);if(sb)G.lomPrev=undefined;
    floater(G.player.x,G.player.y-40,a==='lom'?'+500 ЛОМА В ПЕСОЧНИЦУ':'ПИЛОТ · УР '+S.pilot.lvl,'#00ff88');}
  if(a==='charge'&&G.bc){G.bc.charge=Math.min(100,G.bc.charge+25);}
  if(a==='step'&&G.end)G.end.stepT=G.end.dur;
  if(a==='spawn'){const t=$('#devSpawn').value;if(t==='twin')directorSpawn('twin');else edgeSpawn(t);}
  if(a==='boss'&&M){
    if(M.sboss){const b=G.sb;if(!b){clearAll();G.waveIdx=G.waves.length;G.gapT=.1;}else if(b.st==='enter')b.timer=0;else if(b.st==='fight'){if(b.phase<3){b.hp=b.th[b.phase-1];sbPhase(b);}else{b.hp=b.th[2];sbFinal(b);}}else if(b.st==='final')sbChoose(b,null);}
    else if(M.boss){const b=G.boss;
      if(!b){clearAll();G.waveIdx=G.waves.length;G.gapT=.1;}
      else if(b.st==='enter')b.timer=0;
      else if(b.st==='fight'){const th=b.th[b.phase-1];if(b.phase<3){b.hp=th;phaseShift(b);}else{b.hp=0;b.alive=true;kill(b);}}}
    else if(M.transmit){const j=G.jam,bc=G.bc;
      if(!j&&bc){bc.charge=100;bc.peak=100;bc.thrI=bc.thr.length;bc.coolI=bc.coolAt.length;}
      else if(j&&j.st==='enter')j.timer=0;
      else if(j&&j.st==='fight'){const th=j.th[j.phase-1];if(j.phase<3){j.hp=th;jamPhase(j);}else{j.hp=0;kill(j);}}}
  }
  renderDevPanel();
}
$('#devPanel').addEventListener('click',e=>{const b=e.target.closest('[data-dv]');if(b)devAct(b.dataset.dv);});
$('#devBtn').onclick=()=>toggleDevPanel();
let fpsAvg=60;
function drawDevOverlay(){
  if(!devAny()||!G.player)return;
  if(G.dev.hit){const k=DPR*SC;ctx.setTransform(k,0,0,k,-CX*k,-CY*k);ctx.lineWidth=1;ctx.globalAlpha=.9;
    ctx.strokeStyle='#00ff88';for(const e of G.enemies){if(!e.alive)continue;ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,TAU);ctx.stroke();}
    ctx.strokeStyle='#ffffff';const p=G.player;ctx.beginPath();ctx.arc(p.x,p.y,9,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,TAU);ctx.stroke();
    ctx.strokeStyle='#ff4f6e';for(const b of G.eb){ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,TAU);ctx.stroke();}
    if(G.bc){ctx.strokeStyle='#ffb84d';ctx.beginPath();ctx.arc(G.bc.x,G.bc.y,G.bc.r,0,TAU);ctx.stroke();}
    ctx.globalAlpha=1;}
  if(G.dev.fps){ctx.setTransform(DPR,0,0,DPR,0,0);ctx.font='700 11px "JetBrains Mono",monospace';ctx.textAlign='left';ctx.fillStyle='#00ff88';
    const txt=`FPS ${Math.round(fpsAvg)} · ВРАГИ ${G.enemies.length} · НАГРУЗКА ${enemyLoad().toFixed(1)} · СНАРЯДЫ ${G.pb.length}/${G.eb.length} · ЧАСТИЦЫ ${G.parts.length}`;
    ctx.fillText(txt,16,CH-70);}
}

