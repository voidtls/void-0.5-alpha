// ===== 0.5.6: боссы секторов III–IV — «Инвентаризатор» (14) и «Обод» (18) =====
const SB_NAMES={inv:'ИНВЕНТАРИЗАТОР',obod:'ОБОД'};
const INV_PHASES=['ПРИЁМКА','ДУБЛИКАТЫ','КОНСЕРВАЦИЯ'];
const OB_PHASES=['ПРИЁМ','СБОРКА','СЖАТИЕ'];
const COPY_SKINS=['falcon','manta','prism','reaper','halo','comet','hornet','obsidian','sail','pulsar'];
function romanN(n){const M=[[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let r='';for(const [v,k] of M)while(n>=v){r+=k;n-=v;}return r||'I';}
function sbRank(){return 1+.25*(curDiff().rank||0);}
function sbHard(){return !!curDiff().hideTele;}
// ===== 0.5.7: скорость, темп атаки, без ремонта, звенья у боссов =====
SEC_SCALE[2].spd2=.05;SEC_SCALE[3].spd2=.10;
function diffK(){return curDiff().k57||1;}
function secSpdK(SS,D){D=D||curDiff();return SS.spd*(1+(SS.pace||0)*(D.hideTele?2:1))*(1+(SS.spd2||0)*(D.k57||1));}
function atkK(){const SS=SSW();if(!SS)return 1;return 1/(1+.15*(inMission()?diffK():1));}
function atkPct(D){return Math.round(15*((D||curDiff()).k57||1));}
function healAllowed(){return !inMission();}
function noHeal(){return !healAllowed();}
function escortCfg(){return curDiff().esc||{every:14,cap:5};}
function secHintFmt(h,m){const M=MISSIONS[(m||G.m)-1],SS=M&&M.gen&&SEC_SCALE[M.sec];if(!SS)return h;const D=curDiff();
  return h.replace('{DMG}',String(playerDmgK()).replace('.',',')).replace('{SPD}',Math.round((secSpdK(SS,D)-1)*100)).replace('{ATK}',atkPct(D));}
function ebK(){const SS=SSW();if(!SS||!SS.pace)return 1;if(!inMission())return (1+SS.pace/2)*(1+(SS.spd2||0)/2);return (1+SS.pace/2*(sbHard()?2:1))*(1+(SS.spd2||0)/2*diffK());}
function storyFlag(k){const S=G.save;return S&&S.story?S.story[k]:undefined;}
// --- радио: произвольная строка (босс, Э. В.) ---
function radioLine(tag,col,txt,delay){const S=G.save;if(!S||!S.story||!SET.radio||STORY_OFF.radio)return;if(G.world&&((tag==='БЮРО'&&storyFlag('line31')==='break')||(tag==='ИСТОК'&&storyFlag('well38')==='silence')))return;const st=radioState();st.q.push({txt,tag,col,d:delay||0});}
function radioSayTxt(q){const st=radioState();radioClear();st.cur={g:'sb',txt:q.txt,tag:q.tag,col:q.col,rift:false,t:0,len:q.txt.length};st.n++;
  const el=radioEl();if(!el)return;el.hidden=false;el.style.opacity='1';el.style.borderColor=q.col;el.classList.remove('rift');
  el.querySelector('.rtag').textContent='ПЕРЕХВАТ · '+q.tag;el.querySelector('.rtag').style.color=q.col;el.querySelector('.rtxt').textContent='';}
// --- общее ---
function spawnSB(kind){if(SBX[kind]||kind==='lek'||kind==='well')return sb85Spawn(kind);if(kind==='nurse'||kind==='flag')return sb74Spawn(kind);ambSting('boss');radioClear();
  const type=kind==='inv'?'inventor':'obheart';const b=spawnEnemy(type,W/2,kind==='inv'?-120:H/2,{noAffix:true,noLoot:true});
  b.hp=b.maxHp=Math.round(EDEF[type].hp*sbRank()*cycHp());b.th=[b.maxHp*.67,b.maxHp*.33,b.maxHp*.10];
  Object.assign(b,{sbk:kind,phase:1,st:'enter',timer:2.6,t:0,rot:0,flash:0,open:0,inv0:0,fails:0,choice:null,domeFlash:0,deathT:0});
  if(kind==='inv')invInit(b);else obInit(b);G.sb=b;sfx('warn');
  banner(SB_NAMES[kind]+(kind==='inv'?' ПРОСЫПАЕТСЯ':' ПРИНИМАЕТ КЛИЕНТА'),'ФАЗА 1 · '+(kind==='inv'?INV_PHASES:OB_PHASES)[0]);
  if(kind==='inv')radioLine('ИНВЕНТАРИЗАТОР','#9fd8ff','Объект 013. Цикл '+romanN(cycN()+31)+'. Отклонение от эталона зафиксировано. Привести.',1.5);
  else{radioLine('ОБОД','#ffb060','Клиент 013, посещение '+fmtN(4102+cycN())+'. Износ корпуса '+Math.max(12,wearPct())+'%. Начинаю обслуживание.',1.5);
    if(storyFlag('inv14')==='memory')radioLine('ОБОД','#ffb060','Клиент 013. Архив сообщает, что вы помните. Это не входит в гарантию.',9);}
  return b;}
function sbAdopt(b){const kind=b.type==='inventor'?'inv':'obod';if(G.sb&&G.sb!==b&&G.sb.alive){b.alive=false;return false;}
  b.hp=b.maxHp=Math.round(EDEF[b.type].hp*sbRank()*cycHp());b.th=[b.maxHp*.67,b.maxHp*.33,b.maxHp*.10];
  Object.assign(b,{sbk:kind,phase:1,st:'enter',timer:1,t:0,rot:0,flash:0,open:0,inv0:0,fails:0,choice:null,domeFlash:0,deathT:0,noAffix:true,noLoot:true});
  if(kind==='inv')invInit(b);else obInit(b);G.sb=b;return true;}
function sbPhase(b){if(is85(b))return sb85Phase(b);if(b.sbk==='nurse'||b.sbk==='flag')return sb74Phase(b);ambSting('phase');b.phase++;b.open=0;b.inv0=2;G.eb=G.eb.filter(x=>x.rift);
  G.shock.push({x:b.x,y:b.y,r:20,R:Math.max(W,H),t:0,col:EDEF[b.type].col,slow:true});sfx('bigboom');shake(14);
  const names=b.sbk==='inv'?INV_PHASES:OB_PHASES;banner(SB_NAMES[b.sbk]+' · ФАЗА '+b.phase,names[b.phase-1]);
  if(b.sbk==='inv'){b.inv=null;for(const c of b.cells){c.label=null;c.locked=false;}
    if(b.phase===2)radioLine('ИНВЕНТАРИЗАТОР','#9fd8ff','Предъявляю предыдущие версии. Сравните.',1);
    if(b.phase===3){b.beams.push({a:b.beams[0].a+Math.PI,dir:b.beams[0].dir});b.ring={x:W/2,y:H/2,r:Math.hypot(W,H)/2*.9,r0:Math.hypot(W,H)/2*.9,acc:0};b.seals=[];b.sealT=1;
      radioLine('ИНВЕНТАРИЗАТОР','#9fd8ff','Консервация. Вы будете храниться хорошо.',1);}}
  else{b.svc=null;b.spokes=[];
    if(b.phase===2)radioLine('ОБОД','#ffb060','Обнаружены запасные корпуса клиента. Использую.',1);
    if(b.phase===3){b.rotV=TAU/8;radioLine('ОБОД','#ffb060','Клиент сопротивляется обслуживанию. Протокол не предусматривает отказ.',1);}}}
function sbCheckTh(b){if(is85(b))return sb85CheckTh(b);if(b.hp<=0)b.hp=1;if(b.st!=='fight')return;if(b.phase<3&&b.hp<=b.th[b.phase-1]){b.hp=b.th[b.phase-1];sbPhase(b);}
  else if(b.phase===3&&b.hp<=b.th[2]){b.hp=b.th[2];sbFinal(b);}}
function sbBlock(e){e.domeFlash=.15;sfx('block');}
function sbHurt(e,dmg,src){if(SB85T.has(e.type))return sb85Hurt(e,dmg,src);if(SB74T.has(e.type))return sb74Hurt(e,dmg,src);const b=G.sb;if(!b||!b.alive)return 0;
  if(e.type==='inventor'||e.type==='obheart'){if(b.st!=='fight'||b.inv0>0){sbBlock(e);return 0;}
    if(e.type==='inventor')return dmg*(b.open>0?1.5:.5);
    if(!obHeartOpen(b)){sbBlock(e);return 0;}return dmg;}
  if(e.type==='invcell'){const c=e.cell;if(c&&c.locked){sbBlock(e);return 0;}
    if(c&&c.open>0&&b.st==='fight'&&b.inv0<=0){b.hp-=dmg*2;b.flash=.07;e.flash=.07;sfx('hit');sbCheckTh(b);return 0;}return dmg;}
  if(e.type==='invcore')return b.st==='final'&&e.spawnT<=0&&!(src&&(src.drone||src.pulse))?dmg:0;
  return dmg;}
function sbTargetable(e){if(SB85T.has(e.type))return sb85Targetable(e);if(SB74T.has(e.type))return sb74Targetable(e);const b=G.sb;if(!b)return false;
  if(e.type==='inventor')return b.st==='fight';if(e.type==='obheart')return b.st==='fight'&&obHeartOpen(b);
  if(e.type==='invcell')return !e.cell||!e.cell.locked;if(e.type==='invcore')return b.st==='final';return true;}
function sbHud(b){if(is85(b))return sb85Hud(b);if(b.sbk==='nurse'||b.sbk==='flag')return sb74Hud(b);const k=SB_NAMES[b.sbk];if(b.st==='dying')return k+' · РАЗРУШЕН';if(b.st==='final')return k+' · ВЫБОР · '+Math.ceil(b.timer)+' С';
  if(b.sbk==='inv'){if(b.inv)return 'ИНВЕНТАРИЗАЦИЯ · '+b.inv.t.toFixed(1)+' С';if(b.open>0)return 'КОРПУС ОТКРЫТ · '+b.open.toFixed(1)+' С';return k+' · ФАЗА '+b.phase;}
  if(b.svc)return 'СЕРВИСНОЕ ОКНО · '+b.svc.t.toFixed(1)+' С';if(b.expo>0)return 'УЗЕЛ ОТКРЫТ · '+b.expo.toFixed(1)+' С';if(b.hop)return 'УЗЕЛ ПЕРЕЕЗЖАЕТ';return k+' · ФАЗА '+b.phase;}
function sbDeath(b){if(!b.alive||b.st==='dying')return;ambSting('bossDown');buzz('boss');b.alive=true;b.st='dying';b.deathT=2.8;b.hp=0;G.eb=G.eb.filter(x=>x.rift);
  G.enemies.forEach(o=>{if(o!==b&&o.alive)kill(o,true);});G.score+=EDEF[b.type].pts;G.kills++;
  G.lockShield=G.lockDash=G.lockGun=0;G.iceRing=null;
  if(b.lostMods&&b.lostMods.length){for(const k of b.lostMods)G.mods[k]=(G.mods[k]||0)+1;b.lostMods=[];computeStats();}
  if(SB_DEATH[b.sbk])banner(SB_DEATH[b.sbk][0],SB_DEATH[b.sbk][1]);else banner(b.sbk==='inv'?'КАРТОТЕКА РАЗРУШЕНА':'ЗАКАЗ ЗАКРЫТ',b.sbk==='inv'?'СЕКТОР III ПРОЙДЕН':'СЕКТОР IV ПРОЙДЕН');
  const S=G.save;if(G.mode==='world'&&S&&S.story){S.story[SB_FLAG[b.sbk]]=b.choice;if(b.sbk==='obod'&&b.choice==='service')S.story.factory=1;}
  radioLine('Э. В.','#ffd36b',SB_DEATH[b.sbk]?SB_DEATH[b.sbk][2]:b.sbk==='inv'?'Я строил Архив, чтобы ты не повторял ошибок. Он решил, что проще не дать тебе меняться.':'Обод был первым, что я построил. Он должен был чинить людей. Людей не осталось, и он стал чинить тебя.',3.5);}
function sbCommon(b,dt){b.t+=dt;if(b.flash>0)b.flash-=dt;if(b.domeFlash>0)b.domeFlash-=dt;if(b.inv0>0)b.inv0-=dt;if(b.open>0)b.open-=dt;
  if(b.st==='dying'){b.deathT-=dt;shake(6);if(Math.random()<.5)explode(b.x+rnd(-50,50),b.y+rnd(-50,50),Math.random()<.5?EDEF[b.type].col:'#ffffff',8,.8);
    if(b.deathT<=0){b.alive=false;explode(b.x,b.y,'#ffffff',120,2.2);sfx('bigboom');shake(20);G.sb=null;G.endT=2.2;}return true;}return false;}
function sbFinal(b){if(is85(b))return sb85Final(b);if(b.sbk==='nurse'||b.sbk==='flag')return sb74Final(b);b.st='final';b.timer=20;b.open=0;G.eb=G.eb.filter(x=>x.rift);
  if(b.sbk==='inv'){b.inv=null;for(const c of b.cells){c.label=null;c.locked=false;}
    b.cores=[['memory',-84],['cold',84]].map(([k,ox])=>{const c=spawnEnemy('invcore',b.x+ox,b.y+46,{noAffix:true,noLoot:true,spawnT:.6,core:k});c.hp=c.maxHp=Math.round(300*sbRank());return c;});
    banner('ЭТАЛОН','ЯДРО ПАМЯТИ ИЛИ ЯДРО ХОЛОДА · 20 С');radioLine('ИНВЕНТАРИЗАТОР','#9fd8ff','Выберите, что стереть. Эталон всегда выбирал холод.',.5);}
  else{b.svc=null;b.spokes=[];b.hop=null;b.tele=false;b.rotV=0;b.expo=0;b.fx0=b.x;b.fy0=b.y;b.fT=0;
    b.docks=[{kind:'fix',ox:-96,ch:0},{kind:'scrap',ox:96,ch:0}];
    banner('ЗАКАЗ-НАРЯД','ВОССТАНОВИТЬ ДО ЗАВОДСКОГО ИЛИ СПИСАТЬ СТАНЦИЮ · 20 С');radioLine('ОБОД','#ffb060','Вопросов не задаю. Но вы можете задать один.',.5);}
  sfx('level');}
function sbTimeout(b){if(is85(b))return;if(b.sbk==='nurse'||b.sbk==='flag')return sb74Timeout(b);b.fails++;
  if(b.fails>=2){sbChoose(b,null);return;}
  b.hp=Math.min(b.maxHp,b.hp+b.maxHp*.2);b.st='fight';b.inv0=1.5;banner(b.sbk==='inv'?'ОТКЛОНЕНИЕ НЕ ЗАФИКСИРОВАНО':'ЗАКАЗ НЕ ПОДТВЕРЖДЁН','ПОВТОР · +20% ПРОЧНОСТИ');sfx('warn');
  if(b.sbk==='inv'){for(const c of (b.cores||[]))if(c.alive)kill(c,true);b.cores=null;}
  else{b.docks=null;b.rotV=TAU/8;b.seatT=3;}}
function sbChoose(b,ch){if(is85(b))return sb85Choose(b,ch);if(b.sbk==='nurse'||b.sbk==='flag')return sb74Choose(b,ch);if(b.choice||(b.st!=='final'&&b.st!=='fight'))return;if(!ch)ch=b.sbk==='inv'?(Math.random()<.5?'memory':'cold'):(Math.random()<.5?'service':'scrap');b.choice=ch;const p=G.player;
  if(ch==='cold'){G.sbLomK=2;G.sbChoiceTxt='Ядро памяти сожжено: лом ×2, Архив замолчал.';banner('ЯДРО ПАМЯТИ СОЖЖЕНО','31 ЗАПИСЬ ИСЧЕЗЛА · ЛОМ ×2');}
  else if(ch==='memory'){G.sbLomK=1;G.sbChoiceTxt='Ядро холода разрушено: записи оттаяли (см. Хронику).';banner('ЯДРО ХОЛОДА РАЗРУШЕНО','ЗАПИСИ ОТТАИВАЮТ · ЦИКЛЫ I–XXXI');}
  else if(ch==='scrap'){G.sbLomK=2;G.sbChoiceTxt='Станция списана: лом ×2, фоновый износ в Хрониках снят.';banner('СТАНЦИЯ СПИСАНА','ЛОМ ×2 · ФОНОВЫЙ ИЗНОС В ХРОНИКАХ СНЯТ');}
  else{G.sbLomK=.5;G.sbChoiceTxt='Корабль восстановлен до заводского: оплата ломом (×0,5), перк «Заводской корпус».';G.mods={};G.wear=0;computeStats();if(p){p.hp=G.st.maxHp;}banner('ВОССТАНОВЛЕНО ДО ЗАВОДСКОГО','ОПЛАТА ЛОМОМ · ПЕРК «ЗАВОДСКОЙ КОРПУС»');}
  if(b.sbk==='inv'){for(const c of (b.cores||[]))if(c.alive)kill(c,true);b.cores=null;}
  sbDeath(b);}
// --- вспомогательное: стая, спавн у края, автоприцел, отрисовка сектора ---
function packSpawn(t){if(!EDEF[t]){edgeSpawn(t);return;}[0,1,3].forEach((s,i)=>edgeSpawn(t,{side:s,delay:i*.08}));floater(W/2,H*.3,'СТАЯ · '+EDEF[t].name.toUpperCase(),EDEF[t].col);sfx('warn');}
const SB_ESC={inv:{1:['scout','scout','gunner','phantom'],2:['frost','rammer','shade','gunner'],3:['hunter','rammer','lancer']},
  obod:{1:['gunner','gunner','scout','shocker'],2:['rammer','hunter','frost'],3:['shade','shade','hunter','lancer']}};
function sbEscort(b,dt){const p=G.player;if(b.st!=='fight'&&b.st!=='final')return;if(b.noEsc&&b.phase===1)return;if(!p||p.hp<=0)return;
  const C=escortCfg();if(b.escT===undefined){b.escT=b.sbk==='inv'&&storyFlag('arcSilence')?14:8;b.escN=0;b.escFinal=false;}
  if(b.st==='final'){if(b.escFinal)return;b.escFinal=true;}
  else{b.escT-=dt;if(b.escT>0)return;b.escT=C.every;}
  const alive=G.enemies.filter(e=>e.alive&&e.escort&&e.type!=='rustcopy').length;if(b.st!=='final'&&alive>=C.cap)return;
  const pool=SB_ESC[b.sbk][Math.min(3,Math.max(1,b.phase))],n=Math.min(Math.random()<.5?3:2,C.cap-alive);if(n<=0)return;
  for(let i=0;i<n;i++){const ty=pool[Math.floor(Math.random()*pool.length)];
    if(b.sbk==='obod'){const a=rnd(0,TAU),x=clamp(b.cx+Math.cos(a)*(b.R-50),20,W-20),y=clamp(b.cy+Math.sin(a)*(b.R-50),20,H-20);spawnEnemy(ty,x,y,{noAffix:true,spawnT:.8,escort:true});}
    else sbEdge(ty,{escort:true});}
  sfx('warn');floater(b.sbk==='obod'?b.cx:b.x,(b.sbk==='obod'?b.cy:b.y)-40,b.escN?'ЗВЕНО ОХРАНЫ':'ОХРАНА ВЫЗВАНА','#ff9a4d');
  if(!b.escN&&SB_ESC_R[b.sbk])radioLine(SB_ESC_R[b.sbk][0],SB_ESC_R[b.sbk][1],SB_ESC_R[b.sbk][2],.3);else if(!b.escN)radioLine(b.sbk==='inv'?'ИНВЕНТАРИЗАТОР':'ОБОД',b.sbk==='inv'?'#9fd8ff':'#ffb060',b.sbk==='inv'?'Отклонение сопротивляется описанию. Архив вызывает охрану хранилища.':'Клиент беспокоит других клиентов. Вызываю других клиентов.',.3);
  b.escN++;}
function sbEdge(type,o){const s=Math.random()*4|0,u=rnd(.1,.9);const x=s===0?u*W:s===1?W+30:s===2?u*W:-30,y=s===0?-30:s===1?u*H:s===2?H+30:u*H;return spawnEnemy(type,x,y,Object.assign({noAffix:true,spawnT:.4},o||{}));}
function sbAutoTarget(p){const b=G.sb;if(!b||!b.alive||b.st!=='fight')return null;if(is85(b))return sb85Auto(p,b);if(b.sbk==='nurse'||b.sbk==='flag')return sb75Auto(p,b);
  if(b.sbk==='inv'){const I=b.inv;if(I){if(I.auto&&I.auto.alive&&I.auto.cell&&I.auto.cell.label&&!I.auto.cell.locked&&targetable(I.auto))return I.auto;
      let best=null,bd=1e9;for(const c of I.cs){const e=c.e;if(!e||!e.alive||!c.label||c.locked||!targetable(e))continue;const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<bd){bd=d;best=e;}}if(best){I.auto=best;return best;}}
    if(b.open>0&&targetable(b)&&Math.hypot(b.x-p.x,b.y-p.y)<700)return b;return null;}
  if(targetable(b)&&Math.hypot(b.x-p.x,b.y-p.y)<700)return b;return null;}
function secDraw2(t){const SS=secScale();if(!SS)return;
  for(const e of G.enemies){if(!e.alive||e.spawnT>0||EDEF[e.type].passive||STATIC.has(e.type)||e.ghost)continue;const sp=Math.hypot(e.vx,e.vy);
    if(sp>190){ctx.strokeStyle=EDEF[e.type].col;ctx.globalAlpha=.28;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x-e.vx*.08,e.y-e.vy*.08);ctx.stroke();}
    if(e.tired){ctx.strokeStyle='#9fb0c4';ctx.globalAlpha=.6;ctx.lineWidth=1;ctx.setLineDash([2,4]);ctx.beginPath();ctx.arc(e.x,e.y,e.r+8,0,TAU);ctx.stroke();ctx.setLineDash([]);}}
  ctx.globalAlpha=1;sbDraw(t);}
// --- усталость: затянувшаяся концовка из бронированных (все сгенерированные миссии 11+) ---
function tiredTick(dt){if(!inMission()||G.mode==='endless'||G.sb||G.deadT>0||G.endT>0||!G.player)return;const M=MISSIONS[G.m-1];if(!M||!M.gen)return;
  const live=G.enemies.filter(e=>e.alive&&!EDEF[e.type].passive&&e.spawnT<=0);
  const slowOnly=live.length>0&&!G.spawnQ.length&&!G.warns.length&&live.every(e=>SEC_SLOW.has(e.type)||e.tired);
  if(!slowOnly){G.tiredT=0;return;}
  G.tiredT=(G.tiredT||0)+dt;if(G.tiredT<12)return;G.tiredT=0;
  if(G.waveIdx<G.waves.length){G.waveForce=true;G.gapT=0;return;}
  for(const e of live){if(e.tired)continue;e.tired=true;e.secArm=0;if(e.type==='guard')e.shieldDown=999;floater(e.x,e.y-e.r-12,'УСТАЛОСТЬ · БРОНЯ СНЯТА','#9fb0c4');}}
