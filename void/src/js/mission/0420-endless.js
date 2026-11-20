// =====================================================================
// ---------- БЕСКОНЕЧНОСТЬ (0.2.5) ----------
// ступени по 10 с · удвоение бюджета и разнообразия · предел 70 · рекорды
// =====================================================================
const END_ORDER=['scout','gunner','rammer','splitter','moth','miner','phantom','lancer','shielder','mirror','shocker','twin','hunter','guard','commander','vortex'];
const END_W={guard:.4,hunter:.6,commander:.6,vortex:.5,shielder:.7,moth:.8};
const END_CAP=35,END_STEP=10;
const stepDur=n=>n<=2?10:15;
const stepStart=n=>n<=1?0:n===2?10:20+(n-3)*15;
const fmtT=t=>{const m=Math.floor(t/60),s=t-m*60;return m+':'+pad2(Math.floor(s))+'.'+Math.floor((s%1)*10);};
function endRecords(){const L=store('void_endless');return Array.isArray(L)?L.filter(r=>r&&typeof r.t==='number'):[];}
function bestEndless(){const L=endRecords();return L.length?L[0]:null;}
function startEndless(dev,step0){secReset();/*DEVW*/if(window.DEVW&&!dev&&!DEVW.on())DEVW.clearFlag(true);riftReset();
  audioInit();
  G.mode='endless';G.devRun=!!dev;G.devStep=step0||1;G.world=false;lockArena();G.mods={};computeStats();G.player=newPlayer();G.player.hp=G.st.maxHp;
  runStart6(1);Object.assign(G,{score:0,kills:0,taken:0,inRun:true,m:10});
  Object.assign(G,{enemies:[],pb:[],eb:[],pick:[],parts:[],float:[],warns:[],shock:[],prio:null,boss:null,endT:0,deadT:0,bc:null,relays:[],rocks:[],fields:[],meteors:[],meteorT:0,
    storm:null,flare:0,fake:null,lureP:null,dashLog:[],dark:false,lightFull:0,jam:null,loseBeacon:false,affixCh:0,affix2:0,rockN:0,waves:[],spawnQ:[],mc:null,lowFx:false,fpsLow:0,mT:0,missionKills:0,missionTaken:0});
  const p=G.player;p.x=W/2;p.y=H/2;p.px=p.x;p.py=p.y;p.inv=1.5;if(G.arena){G.camSnap=1;missionCam(0);}
  const rec=bestEndless();
  G.noTele=false;aimLockClear();G.end={t:0,step:0,stepT:0,acc:1,dur:10,next60:90,best:dev?null:rec,beat:false,budget:4,types:1,hpMul:1,spdMul:1,pool:{},nextBoss:300,bossN:0,bosses:0,bossOn:false};G.combo=null;G.bossMul=0;
  const s0=Math.max(1,step0||1);G.end.t=stepStart(s0);G.end.next60=Math.floor(G.end.t/90)*90+90;G.end.nextBoss=Math.floor(G.end.t/300)*300+300;enterStep(s0,true);
  scr6('play');show('');banner(G.fromAbyss?'БЕЗДНА':'БЕСКОНЕЧНОСТЬ',dev?'ТЕСТ · СТУПЕНЬ '+s0:G.fromAbyss?'В СЕКТОР НИЧЕГО НЕ ПЕРЕНОСИТСЯ':'ДЕРЖИТЕСЬ КАК МОЖНО ДОЛЬШЕ');
}
function enterStep(n,silent){
  const E=G.end,prevTypes=E.types;E.step=n;
  E.budget=2*Math.pow(2,Math.min(n-1,40));E.dur=stepDur(n);E.types=Math.min(END_ORDER.length,Math.pow(2,Math.min(n-1,10)));
  E.pool={};END_ORDER.slice(0,E.types).forEach(k=>E.pool[k]=END_W[k]||1);
  const over=Math.max(0,n-6);
  G.affixCh=n>=6?Math.min(1,(n-5)*.075):0;G.affix2=n>=12?Math.min(1,(n-11)*.075):0;
  E.hpMul=Math.pow(1.06,over);E.spdMul=Math.min(1.3,1+.02*over);
  if(silent)return;
  const fresh=n>1?END_ORDER.slice(Math.min(prevTypes,E.types),E.types).map(k=>EDEF[k].name.toUpperCase()):[];
  banner('СТУПЕНЬ '+n,fresh.length?'НОВЫЕ УГРОЗЫ: '+fresh.slice(0,5).join(', ')+(fresh.length>5?' И ЕЩЁ '+(fresh.length-5):''):
    'ЭЛИТА '+Math.round(G.affixCh*100)+'% · ПРОЧНОСТЬ ×'+E.hpMul.toFixed(2)+' · СКОРОСТЬ ×'+E.spdMul.toFixed(2));
  sfx('warn');
}
function eliteSquad(){
  const E=G.end,cand=['gunner','rammer','lancer','mirror','shocker','hunter','guard'].filter(k=>E.pool[k]);
  if(!cand.length)cand.push('scout','scout');
  const n=Math.max(1,Math.min(E.step>=10?3:2,Math.floor(END_CAP-enemyLoad()))),side=Math.random()*4|0,u=rnd(.2,.8);
  for(let i=0;i<n;i++)edgeSpawn(cand[Math.random()*cand.length|0],{side,u:u+i*.07,elite:true,delay:i*.15});
  banner('ЭЛИТНЫЙ ОТРЯД','ДВА АФФИКСА У КАЖДОГО');sfx('warn');
}
function updateEndless(dt){
  const E=G.end;E.t+=dt;G.mT=E.t;const bossUp=endlessBossAlive();if(!bossUp)E.stepT+=dt;
  if(E.stepT>=E.dur){E.stepT-=E.dur;enterStep(E.step+1);}
  updateEndlessBoss();
  E.acc=Math.min(4,E.acc+dt*E.budget/E.dur*(bossUp?.5:1));
  if(E.acc>=1){const t=pickPool(E.pool),cost=t==='moth'?2.3:t==='twin'?2:1;if(enemyLoad()+cost<=END_CAP){E.acc-=1;directorSpawn(t);}}
  if(E.t>=E.next60){E.next60+=90;eliteSquad();}
  if(E.best&&!E.beat&&E.t>E.best.t){E.beat=true;banner('НОВЫЙ РЕКОРД',fmtT(E.best.t)+' ПОЗАДИ');sfx('level');}
}
function endlessOver(){
  scr6('over');const E=G.end;const picks=Object.values(G.mods).reduce((a,b)=>a+b,0);
  const rec={t:Math.round(E.t*10)/10,k:G.kills,s:E.step,b:E.bosses||0,d:new Date().toLocaleDateString('ru-RU')};let place=0;
  if(!G.devRun){const L=endRecords();L.push(rec);L.sort((a,b)=>b.t-a.t||b.k-a.k);place=L.indexOf(rec)+1;store('void_endless',L.slice(0,10));}
  $('#ovEyebrow').textContent=G.devRun?'БЕСКОНЕЧНОСТЬ · ТЕСТ · НЕ ЗАПИСАНО':G.fromAbyss?'БЕЗДНА · ЗАБЕГ ОКОНЧЕН':'БЕСКОНЕЧНОСТЬ · ЗАБЕГ ОКОНЧЕН';
  $('#ovName').textContent=fmtT(rec.t)+(place&&place<=10?' · место '+place:'');
  $('#ovStats').innerHTML=statCells([['ВРЕМЯ',fmtT(rec.t)],['УНИЧТОЖЕНО',rec.k],['СТУПЕНЬ',rec.s],['БОССЫ',rec.b],['МОДУЛЕЙ',picks]]);
  const b=E.best;$('#ovNote').textContent=G.devRun?'Тестовый забег не попадает в таблицу рекордов.':
    place===1?'Новый лучший результат.':b?'Рекорд: '+fmtT(b.t)+' · '+b.k+' уничтожено.':'Первый забег записан.';
  $('#bRetry').firstChild.nodeValue='ЕЩЁ РАЗ ';$('#bRetry').hidden=false;$('#bToWorld').hidden=!(G.devRun||G.fromAbyss);$('#bToWorld').textContent=G.fromAbyss?'В СЕКТОР':'К ВЫБОРУ МИССИЙ';
  show('sOver');(touchMode||$('#bRetry').focus());
}
function updateEndlessHUD(){
  const p=G.player,st=G.st,E=G.end;if(!p||!E)return;
  setT('hpT',Math.ceil(p.hp)+'/'+st.maxHp);setS('hpB',(p.hp/st.maxHp).toFixed(3));
  setS('enB',(p.en/100).toFixed(3));setC('enBar','full',p.en>=100);
  setT('eTime',mmss(E.t));setS('eB',(E.stepT/E.dur).toFixed(3));
  {const bo=G.boss&&G.boss.alive?G.boss:G.jam&&G.jam.alive?G.jam:null;
    if(bo){setT('eStep',bo.type==='boss'?'ЭХО СТРАЖА':'ЭХО ГЛУШИТЕЛЯ');}
    else{const tb=E.nextBoss-E.t;setT('eStep','СТУПЕНЬ '+E.step+(tb<=10?' · ЭХО БЛИЗКО':''));}}
  if(E.best){setT('eRec',E.beat?'НОВЫЙ РЕКОРД':'РЕКОРД '+mmss(E.best.t));setC('eRec','beat',E.beat);}
  else setT('eRec','');
  hudEls.score.firstChild.nodeValue=fmt(G.kills);
  const blocked=dashBlocked();const dr=p.dashCd<=0&&!blocked;
  setT('dashC','РЫВОК');setF('dashC',p.dashCd>0?1-p.dashCd/(p.dashCdMax||st.dashCd||1):0);setC('dashC','ok',dr);setC('dashC','bad',blocked);setC('tDash','cd',!dr);
  const pr=p.en>=100;setT('pulseC',pr?'ИМПУЛЬС [E]':'ИМПУЛЬС');setF('pulseC',pr?0:p.en/100);setC('pulseC','ok',pr);setC('tPulse','cd',!pr);
  setH('cargoC',true);setT('lvC','ЩИТ');setH('lvC',!st.shieldCd);setC('lvC','ok',!!(st.shieldCd&&p.shieldUp));setS('xpB',(G.xp/G.need).toFixed(3));
  chargeChip();
}

