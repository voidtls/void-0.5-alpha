// =====================================================================
// ---------- ПРОГРЕССИЯ 0.3 ----------
// сложность · брифинг · пилот · контракты · циклы · обнуление · Бездна · боссы-эхо · заряд · комбо
// =====================================================================
const DIFF={
  easy:{name:'ЛЁГКАЯ',short:'Л',k:1,enemy:1,live:1,xp:1,thr:[25,50,75],rep:1,lom:1,rank:0,k57:1,esc:{every:14,cap:5}},
  mid:{name:'СРЕДНЯЯ',short:'С',k:.75,enemy:1.1,live:1.1,xp:.9,thr:[25,50,75],rep:.8,lom:1.1,rank:1,k57:1.15,esc:{every:12,cap:6}},
  hard:{name:'ХАРДКОР',short:'Х',k:.5,enemy:2.5,live:1.5,xp:.75,thr:[50,75],rep:.5,lom:2,rank:2,dmg:3,spd:1.5,bcDmg:1,bcHp:2,hideTele:true,k57:1.5,esc:{every:9,cap:8}}
};
const DIFF_KEYS=['easy','mid','hard'];
const BRIEF_K=[0,2,4,6,8,10,11,12,13,14];
const roman=n=>['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'][n-1]||String(n);
function curDiff(){return(G.mode==='world'||G.mode==='dev')&&DIFF[G.diff]?DIFF[G.diff]:DIFF.easy;}
function cycleN(){if(G.mode==='dev')return G.dev.cycle||1;return G.mode==='world'&&G.save?(G.save.cycle||1):1;}
function cycLom(){return Math.min(2,1+.25*(cycleN()-1));}
function cycHp(){return Math.min(1.5,1+.1*(cycleN()-1));}
function cycCnt(){return Math.min(1.25,1+.05*(cycleN()-1));}
function inMission(){return(G.mode==='world'||G.mode==='dev')&&!G.world;}
// ===== 1.2.0: прибавки по миссиям (умножаются на множители выбранной сложности, не заменяют их) =====
const MISSION_K={
  6: {rate:1.25,hp:1.25,lom:1.25},
  8: {spd:1.25,dmg:1.25,hp:1.25,lom:1.25},
  9: {spd:1.25,dmg:1.25,hp:1.25,lom:1.25},
  10:{spd:1.25,dmg:1.25,hp:1.25,lom:1.25}
};
function missionK(k){if(!inMission())return 1;const t=MISSION_K[G.m];return t&&t[k]||1;}

function enemyMul(){return inMission()?curDiff().enemy*cycCnt():1;}
function liveMul(){return inMission()?curDiff().live*cycCnt():1;}
function briefK(m){if(G.mode!=='world')return 0;const b=m<=CORE?BRIEF_K[m-1]:Math.min(20,14+Math.floor((m-CORE)/5));return Math.floor(b*curDiff().k)+perk('reserve');}
function perkRaw(k){return G.save&&G.save.perks?(G.save.perks[k]||0):0;}
function xpMul(){let m=inMission()?curDiff().xp:1;m*=1+.1*perk('pilot');return m*(G.combo?G.combo.mul:1);}
function scaleWave(arr){const mul=enemyMul();if(mul===1)return arr;const c={};arr.forEach(t=>c[t]=(c[t]||0)+1);const out=[];for(const t in c){const n=String(t).startsWith('e95:')?1:Math.max(1,Math.round(c[t]*mul));for(let i=0;i<n;i++)out.push(t);}return shuffle(out);}

// ---- уровень пилота ----
const pilotNeed=L=>150+60*(L-1);
const SKIN_ORDER=['falcon','manta','prism','reaper','halo','comet','hornet','obsidian','sail','pulsar'];
const skinReq=k=>{const i=SKIN_ORDER.indexOf(k);return i<0?{lvl:0,cost:0}:{lvl:2*(i+1),cost:100+50*i};};
function addPilotXP(v){
  const S=G.save;if(!S||!S.pilot||!(v>0))return;const P=S.pilot;P.xp+=v;
  while(P.xp>=pilotNeed(P.lvl)){P.xp-=pilotNeed(P.lvl);P.lvl++;(G.pilotUps||(G.pilotUps=[])).push({lvl:P.lvl,sk:SKIN_ORDER.find(k=>skinReq(k).lvl===P.lvl)});}
}
function flushPilotUps(){
  const u=G.pilotUps;if(!u||!u.length)return;const last=u[u.length-1],sk=u.map(x=>x.sk).filter(Boolean);
  banner('ПИЛОТ · УРОВЕНЬ '+last.lvl,sk.length?'СКИН «'+SKINS[sk[sk.length-1]].name.toUpperCase()+'» МОЖНО КУПИТЬ В ХРАНИЛИЩЕ':'УРОВЕНЬ ПОВЫШЕН');sfx('level');G.pilotUps=[];
}

// ---- контракты ----
const CTPL=[
  {id:'k_scout',s:'Разведчики',t:n=>`Уничтожить ${n} разведчиков`,ev:'kill',type:'scout',n:[30,50]},
  {id:'k_gunner',s:'Стрелки',t:n=>`Уничтожить ${n} стрелков`,ev:'kill',type:'gunner',n:[15,25],req:2},
  {id:'k_rammer',s:'Тараны',t:n=>`Уничтожить ${n} таранов`,ev:'kill',type:'rammer',n:[10,16],req:3},
  {id:'k_splitter',s:'Роевики',t:n=>`Уничтожить ${n} роевиков`,ev:'kill',type:'splitter',n:[10,16],req:3},
  {id:'k_shielder',s:'Щитоносцы',t:n=>`Уничтожить ${n} щитоносцев`,ev:'kill',type:'shielder',n:[6,10],req:4},
  {id:'k_miner',s:'Минёры',t:n=>`Уничтожить ${n} минёров`,ev:'kill',type:'miner',n:[8,12],req:4},
  {id:'k_lancer',s:'Копейщики',t:n=>`Уничтожить ${n} копейщиков`,ev:'kill',type:'lancer',n:[8,12],req:5},
  {id:'k_guard',s:'Гвардия',t:n=>`Уничтожить ${n} гвардейцев`,ev:'kill',type:'guard',n:[3,5],req:6},
  {id:'k_moth',s:'Мотыльки',t:n=>`Уничтожить ${n} мотыльков`,ev:'kill',type:'moth',n:[60,100],req:7},
  {id:'k_leech',s:'Пиявки',t:n=>`Уничтожить ${n} пиявок`,ev:'kill',type:'leech',n:[12,20],req:7},
  {id:'k_mirror',s:'Зеркальщики',t:n=>`Уничтожить ${n} зеркальщиков`,ev:'kill',type:'mirror',n:[4,8],req:9},
  {id:'k_hunter',s:'Охотники',t:n=>`Уничтожить ${n} охотников`,ev:'kill',type:'hunter',n:[3,5],req:10},
  {id:'c_mid',s:'Средняя+',t:()=>'Пройти миссию на средней сложности или выше',ev:'clear',min:1,n:[1,1],req:1},
  {id:'c_hard',s:'Хардкор',t:()=>'Пройти миссию на хардкоре',ev:'clear',min:2,n:[1,1],req:2},
  {id:'c_nopulse',s:'Без импульса',t:()=>'Пройти миссию, ни разу не применив импульс',ev:'clearNoPulse',n:[1,1],req:3},
  {id:'c_nodash',s:'Без рывка',t:()=>'Пройти миссию без единого рывка',ev:'clearNoDash',n:[1,1],req:1},
  {id:'c_bc',s:'Маяк 90%',t:()=>'Пройти миссию с маяком, сохранив 90% целостности',ev:'clearBc90',n:[1,1],req:7},
  {id:'medal',s:'Медали',t:n=>`Получить ${n} медали`,ev:'medal',n:[2,3],req:1},
  {id:'charged',s:'Заряд',t:n=>`Уничтожить ${n} врагов заряженным выстрелом`,ev:'chargedKill',n:[8,15],req:2},
  {id:'combo',s:'Комбо ×1,75',t:()=>'Достичь комбо ×1,75',ev:'combo',n:[1,1],perk:['combo',2]},
  {id:'cells',s:'Ячейки',t:n=>`Подобрать ${n} энергоячеек в миссиях`,ev:'cell',n:[10,18],req:2},
  {id:'patrol',s:'Патрули',t:n=>`Разбить ${n} патруля`,ev:'patrol',n:[2,3],req:1},
  {id:'anom',s:'Аномалия',t:()=>'Пройти аномалию',ev:'anom',n:[1,1],anomLeft:true},
  {id:'c_frost',s:'III · Оттепель',t:n=>`Уничтожить ${n} Изморозей`,ev:'kill',type:'frost',n:[12,20],after:11,sec:2},
  {id:'c_rec',s:'III · Каталогизатор',t:n=>`Найти ${n} дрейфующих записи Архива`,ev:'arcRec',n:[2,3],after:11,sec:2,alive:()=>w58S().arcRec.length<4},
  {id:'c_slide',s:'III · Коньки',t:n=>`Прокатиться ${n*100} единиц по ледяным шельфам`,ev:'shelf',n:[40,60],after:11,sec:2},
  {id:'c_wander',s:'III · Стёртый наблюдатель',t:()=>'Уничтожить Странствующего Архиватора',ev:'wander',n:[1,1],after:12,sec:2},
  {id:'c_beacon',s:'III · Радиотишина',t:n=>`Снести ${n} ${n===1?'маяк':'маяка'} Архива`,ev:'arcBeacon',n:[1,2],after:11,sec:2,alive:()=>w58S().arcBeacons.length<2},
  {id:'c_rustbox',s:'IV · Утильсырьё',t:n=>`Вскрыть ${n} ${n===1?'контейнер':'контейнера'} в ржавых полях`,ev:'rustBox',n:[1,2],after:15,sec:3,alive:()=>w58S().rustBox.length<2},
  {id:'c_clean4',s:'IV · Заводская краска',t:()=>'Пройти миссию сектора IV с износом не более 5%',ev:'clearLowWear',n:[1,1],after:15,sec:3},
  {id:'c_storm',s:'III–IV · Охотник за бурями',t:()=>'Забрать груз из центра бури',ev:'stormBox',n:[1,1],after:11,sec:2},
  {id:'c_patrol34',s:'III–IV · Выездная бригада',t:n=>`Разбить ${n} патруля секторов III–IV, убив вожака первым`,ev:'patrolLeader',n:[2,2],after:11,sec:3},
  {id:'c_convoy80',s:'VII · Списание отменено',t:()=>'Разбить контейнер конвоя «Утилизация»',ev:'convoyBreak',n:[1,1],after:28,sec:6},
  {id:'c_rescue80',s:'VII · Без номера',t:n=>`Спасти ${n} ${n===1?'копию':'копии'} с переплавки`,ev:'rescue80',n:[1,2],after:28,sec:6},
  {id:'c_audit80',s:'VII · Вне ревизии',t:()=>'Пройти мимо Ревизии незамеченным и разбить её',ev:'auditStealth',n:[1,1],after:28,sec:6},
  {id:'c_recycler80',s:'VII · Вторсырьё',t:n=>`Уничтожить ${n} Утилизатора с полным бункером (от 8)`,ev:'recyclerFull',n:[2,3],after:30,sec:6},
  {id:'c_stamp80',s:'VII · Без подписи',t:n=>`Сбросить ${n} штампов Печати`,ev:'stampOff',n:[3,5],after:29,sec:6},
  {id:'c_alarm80',s:'VII · Всем постам',t:n=>`Уничтожить ${n} врагов у пульта во время тревоги`,ev:'alarmKill',n:[8,12],after:28,sec:6,alive:()=>{const w=w80S();return w.alarmAt.some(a=>a-(w.clk||0)<600);}},
  {id:'c_range80',s:'VII · Выше нормы',t:()=>`Набрать на стенде ${rangeGoal80()} урона в секунду`,ev:'rangeDps',n:[1,1],after:28,sec:6},
  {id:'c_dark80',s:'VII–VIII · Без света',t:n=>`Уничтожить ${n} врагов в темноте`,ev:'darkKill',n:[10,15],after:28,sec:6},
  {id:'c_pilgrims80',s:'VIII · Попутчики',t:()=>'Проводить Паломников, не задев ни одного',ev:'pilgrimsSafe',n:[1,1],after:32,sec:7},
  {id:'c_loop80',s:'VIII · Конец петли',t:n=>`Разорвать ${n} Петель с первого возвращения`,ev:'loopBreak',n:[3,5],after:33,sec:7},
  {id:'c_echo80',s:'VIII · Тишина в ответ',t:n=>`Уничтожить ${n} ${n===1?'Отзвука':'Отзвуков'}, не получив своих же снарядов`,ev:'echoClean',n:[1,2],after:32,sec:7},
  {id:'c_inverse80',s:'VIII · Лицевая сторона',t:()=>'Уничтожить Изнанку до её первой волны',ev:'inverseFast',n:[1,1],after:34,sec:7}
];
const conT=c=>CTPL.find(t=>t.id===c.tid);
function conEligible(T){const S=G.save;if(T.after&&!(S.cleared>=CORE&&S.gate&&S.medals[T.after]&&S.medals[T.after].clear))return false;if(T.alive&&!T.alive())return false;if(T.req&&S.cleared<T.req&&(S.cycle||1)===1)return false;if(T.perk&&perkRaw(T.perk[0])<T.perk[1])return false;
  if(T.anomLeft&&WORLD.anomalies.every(a=>S.anomalies[a.id]))return false;return !S.contracts.list.some(c=>c.tid===T.id);}
function newContract(){const S=G.save,C=S.contracts;const el=CTPL.filter(conEligible);const hot=S.medals[11]&&S.medals[11].clear&&!(S.medals[18]&&S.medals[18].clear);const pool=[];for(const T of el){const w=T.sec&&hot?4:1;for(let i=0;i<w;i++)pool.push(T);}if(!pool.length)return null;const T=pool[Math.random()*pool.length|0];
  const n=T.n[0]+Math.floor(Math.random()*(T.n[1]-T.n[0]+1)),mul=(1+Math.min(1,.1*C.done))*(T.sec>=6?3:T.sec===3?2:T.sec===2?1.5:1);return{tid:T.id,n,p:0,lom:Math.round(40*mul),px:Math.round(60*mul)};}
function fillContracts(){const S=G.save;if(!S||(S.cleared<2&&(S.cycle||1)===1))return;const C=S.contracts;C.list=C.list.filter(c=>conT(c)&&!(conT(c).alive&&!conT(c).alive()));while(C.list.length<3){const c=newContract();if(!c)break;C.list.push(c);}}
function conEvent(ev,data){
  const S=G.save;if(!S||G.mode!=='world'||!S.contracts)return;const C=S.contracts;let changed=false;
  for(const c of C.list){const T=conT(c);if(!T||T.ev!==ev||c.p>=c.n)continue;
    if(ev==='kill'&&data!==T.type)continue;if(ev==='clear'&&(data||0)<T.min)continue;c.p++;changed=true;}
  if(!changed)return;
  const done=C.list.filter(c=>c.p>=c.n);
  for(const c of done){S.lom+=c.lom;addPilotXP(c.px);C.done++;banner('КОНТРАКТ ВЫПОЛНЕН','+'+c.lom+' ЛОМА · +'+c.px+' ОПЫТА ПИЛОТА');sfx('level');}
  if(done.length){C.list=C.list.filter(c=>c.p<c.n);store(saveKey(),S);}
}

// ---- новый цикл и обнуление ----
function newCycle(){
  const S=G.save;if(!S||S.cleared<CORE)return;S.lom+=S.carry||0;S.carry=0;
  if(S.w58){S.w58.iceRocks=[];S.w58.arcRec=[];S.w58.rustBox=[];S.w58.arcBeacons=[];S.w58.wander={};S.w58.conveyor={};S.w58.packs={};}if(S.story){delete S.story.invDig;}WORLD.caches=WORLD.caches.filter(c=>!c.civ);
  storyNewCycle(S);Object.assign(S,{jOrder:[],cycle:(S.cycle||1)+1,cleared:0,gate:false,locksDown:[],medals:{},found:{},journals:{},anomalies:{},relays:{},replays:{},best:{},bestDiff:{},reveal:'',lost:null,zonesDone:{}});
  const n=WORLD.nodes[0];S.pos={x:n.x-260,y:n.y+90};S.last={...S.pos};store(saveKey(),S);
  fillContracts.call(null);startWorld(false);banner('ЦИКЛ '+roman(S.cycle),'ВРАГИ СИЛЬНЕЕ · НАГРАДЫ ×'+cycLom().toFixed(2).replace('.',','));
}
let resetT=0,resetTm=0;
function fullReset(alsoEndless){
  try{LS.removeItem('void_world');LS.removeItem('void_record');if(alsoEndless)LS.removeItem('void_endless');}catch(e){}
  cloudForce();saveSet6(null,'reset');REC.best=0;REC.maxMission=0;REC.seen=['scout'];resetT=0;renderMenu();renderSettings();banner('ПРОГРЕСС ОБНУЛЁН','ВСЁ НАЧИНАЕТСЯ ЗАНОВО');sfx('warn');
}
function resetBlock(){const arm=resetT&&performance.now()-resetT<5000;
  return cloudBestHTML()+`<div class="reset"><button class="rbtn" id="bReset">${arm?'ОТМЕНА':'СБРОСИТЬ ПРОГРЕСС'}</button>
    ${arm?`<p class="rwarn">Сотрётся весь полёт: миссии, пилот, перки, скины и лом.</p><button class="rbtn go" id="bResetGo">СТЕРЕТЬ</button>
    <label class="rchk"><input type="checkbox" id="rsEnd"> Также стереть рекорды Бесконечности</label>`:''}
    <p class="rnote">Звук, эффекты и настройки разработки не сбрасываются. Перед обнулением можно сохранить «Код сохранения».</p></div>`;}
document.addEventListener('click',e=>{
  if(e.target.closest('#bResetGo')){if(resetT&&performance.now()-resetT<5000){const ch=$('#rsEnd');fullReset(!!(ch&&ch.checked));}return;}
  if(!e.target.closest('#bReset'))return;
  if(resetT&&performance.now()-resetT<5000){resetT=0;renderSettings();return;}
  resetT=performance.now();renderSettings();clearTimeout(resetTm);resetTm=setTimeout(()=>{resetT=0;if(G.state==='menu')renderSettings();},5000);
});

