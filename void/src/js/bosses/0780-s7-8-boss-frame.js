// ===== 0.8.5 «Лекало и Колодец»: боссы секторов VII–VIII — каркас =====
const SB85T=new Set(['lekalo','lpart','blank85','serial85','wellcore','wemit','anchor85','ghost85','note85']);
['lekalo','lpart','blank85','wellcore','wemit','anchor85','ghost85','note85'].forEach(k=>STATIC.add(k));
['lekalo','lpart','wellcore','wemit','anchor85'].forEach(k=>HEAVY.add(k));
['blank85','serial85','ghost85','note85','anchor85'].forEach(k=>H74.add(k));
SB85T.forEach(k=>STORY_NORETREAT.add(k));
// 0.9: реестр новых боссов на каркасе 0.8.5 (Сердце, Берег). Лекало и Колодец идут прежними ветками.
const SBX={},HOST85=new Set(['lekalo','wellcore']),AI85X={},HURT85X={},KILL85X={};
function sbx(b){return b&&SBX[b.sbk]||null;}
SB_NAMES.lek='ЛЕКАЛО';SB_NAMES.well='ПЕРВЫЙ СИГНАЛ';
Object.assign(SB_FLAG,{lek:'line31',well:'well38'});Object.assign(SB_FLAG_M,{31:'line31',38:'well38'});
SB_DEATH.lek=['ЛИНИЯ ОСТАНОВЛЕНА','СЕКТОР VII ПРОЙДЕН','Цех ноль закрыт. Дальше — без меня.'];SB_DEATH.well=['СИГНАЛ ПРИНЯТ','СЕКТОР VIII ПРОЙДЕН','Дальше сигнал не ведёт.'];
const LEK_PH=['ПРИЁМКА','СБОРКА','ОТК','СПИСАНИЕ'],WELL_PH=['СИГНАЛ','ЗОВ','ЭХО','ПЕТЛЯ','ТИШИНА'];
const C85={lek:'#e8d27a',well:'#6b8cff',voidc:'#dfe8ff',red:'#ff4f6e',hot:'#ff7a3d',pil:'#dfe8ff'};
// общая прочность относительно «Последнего довода» (EDEF.*.hp = 12 500 — как у флагмана); подобрано ботами
const K85={lek:1.15,well:1.3};
function is85(b){return !!b&&(b.sbk==='lek'||b.sbk==='well'||!!SBX[b.sbk]);}
function sb85(){const b=G.sb;return b&&b.alive&&is85(b)?b:null;}
function rk85(){return curDiff().rank||0;}
function pk85(a,b,c){const r=rk85();return r<=0?a:r===1?b:c;}
function tl85(){return G.noTele?.5:1;}
function x85(){return G.x85||(G.x85={rk:{},bl:[],trk:[],calm:0,stun:0,cs:0,tap:0,tapUsed:0});}
function fmt85(v){return (Math.max(0,v)).toFixed(1).replace('.',',');}
// радио боя: не чаще одной реплики в 6 с; ключ — своя пауза; force — фазовые реплики
function say85(tag,col,txt,o){o=o||{};const X=x85();if(!o.force){if(X.rLast&&G.t-X.rLast<6)return false;if(o.key){const R=X.rk;if(R[o.key]&&G.t-R[o.key]<(o.cd||20))return false;R[o.key]=G.t;}}X.rLast=G.t;radioLine(tag,col,txt,o.d||0);return true;}
function RB85(t,o){return say85('БЮРО',C85.lek,t,o);}
function RI85(t,o){return say85('ИСТОК',C85.well,t,o);}
// --- появление ---
function sb85Spawn(kind){if(SBX[kind])return SBX[kind].spawn();ambSting('boss');radioClear();const lek=kind==='lek';
  const b=spawnEnemy(lek?'lekalo':'wellcore',W/2,lek?-220:H/2,{noAffix:true,noLoot:true});sb85Init(b,kind,lek?4:5);
  if(lek){banner('ЛЕКАЛО · ЦЕХ №0','ФАЗА 0 · ПРИЁМКА');RB85('Изделие 013 поступило. Основание: возврат.',{force:1,d:.6});}
  else{banner('ПЕРВЫЙ СИГНАЛ','ИСТОЧНИК НЕ ОПОЗНАН');RI85('…я у самого дна… если слышишь — лети на голос…',{force:1,d:1.6});}
  return b;}
function sb85Init(b,kind,enterT){const lek=kind==='lek',XX=SBX[kind];const P=Math.round(EDEF[b.type].hp*(XX?XX.K:K85[kind])*sbRank()*cycHp()*(rk85()>=2&&!XX?.85:1));
  b.hp=b.maxHp=P;b.th=XX?XX.th.slice():lek?[.7,.4]:[.7,.4,.15];
  Object.assign(b,{sbk:kind,phase:1,st:'enter',timer:enterT,enterT,t:0,rot:0,flash:0,open:0,inv0:0,fails:0,choice:null,domeFlash:0,deathT:0,noAffix:true,noLoot:true,docks:null,tr:0,dmgT:G.t,phT:0,parts:[],t0:G.t});
  G.sb=b;const X=x85();X.b=b;X.calm=0;X.done=0;if(XX){if(G.mc)G.mc[XX.mc]=1;XX.init(b);return;}if(G.mc)G.mc[lek?'lek85':'well85']=1;
  if(lek)lekInit(b);else wellInit(b);}
// --- общий урон по «телу»: пул прочности, пороги фаз, пол для частей ---
function pool85(b,d,fk,e){if(!(d>0)||!b||b.st!=='fight'||b.inv0>0)return 0;const fl=fk?b.maxHp*fk:0;let nd=d;
  if(b.hp-nd<fl){nd=Math.max(0,b.hp-fl);if(nd<d&&b.sbk==='lek'&&!b.floorHint){b.floorHint=1;floater(b.x,b.y-70,'РАМА ДЕРЖИТ · БЕЙТЕ В МАТРИЦУ','#ffffff');}
    if(nd<d&&b.sbk==='well'&&b.phase>=4&&!b.floorHint){b.floorHint=1;floater(b.x,b.y-70,'СЛУШАЙТЕ','#dfe8ff');}
    if(nd<d&&SBX[b.sbk]&&!b.floorHint){const ft=SBX[b.sbk].floorTxt&&SBX[b.sbk].floorTxt(b);if(ft){b.floorHint=1;floater(b.hx!==undefined?b.hx:b.x,(b.hy!==undefined?b.hy:b.y)-70,ft,'#ffffff');}}}
  if(nd<=0){if(e)e.domeFlash=.1;return 0;}b.hp-=nd;b.flash=.07;if(e)e.flash=.07;sfx('hit');b.dmgT=G.t;sb85CheckTh(b);return nd;}
function sb85CheckTh(b){if(!(b.hp>=1))b.hp=1;if(b.st!=='fight')return;const th=b.th;
  if(b.phase<=th.length){const lim=b.maxHp*th[b.phase-1];if(b.hp<=lim){b.hp=lim;sb85Phase(b);}return;}
  if(b.hp<=1)sb85Final(b);}
function sb85Phase(b){ambSting('phase');b.phase++;b.inv0=2.5;b.tr=2.5;b.phT=0;b.floorHint=0;G.eb=G.eb.filter(x=>x.rift);const X=x85();X.calm=Math.max(X.calm||0,2.5);X.bl=[];
  G.shock.push({x:b.hx!==undefined?b.hx:b.x,y:b.hy!==undefined?b.hy:b.y,r:20,R:Math.max(W,H),t:0,col:EDEF[b.type].col,slow:true});sfx('bigboom');shake(10);buzz('ready');if(typeof hs90==='function')hs90(.12,1);
  if(SBX[b.sbk])SBX[b.sbk].phase(b);else if(b.sbk==='lek')lekPhase(b);else wellPhase(b);}
function sb85Hurt(e,dmg,src){src=src||{};const b=G.sb,host=HOST85.has(e.type);
  if(!b||!b.alive||!is85(b)||(!host&&e.host85!==b))return host?0:dmg;
  if(b.st!=='fight'||b.inv0>0||e.spawnT>0){sbBlock(e);return 0;}
  if(SBX[b.sbk])return SBX[b.sbk].hurt(b,e,dmg,src);return b.sbk==='lek'?lekHurt(b,e,dmg,src):wellHurt(b,e,dmg,src);}
function sb85Targetable(e){const b=G.sb,host=HOST85.has(e.type);if(!b||!b.alive||!is85(b)||(!host&&e.host85!==b))return !host;
  if(b.st!=='fight'||e.spawnT>0||e.corona)return false;if(SBX[b.sbk])return SBX[b.sbk].targ?SBX[b.sbk].targ(b,e):true;if(e.type==='lpart'&&e.role==='core')return lekCoreOpen(b);return true;}
function sb85Auto(p,b){if(b.sbk==='lek'&&lekCoreOpen(b)&&targetable(b.core)&&Math.hypot(b.core.x-p.x,b.core.y-p.y)<900)return b.core;if(SBX[b.sbk]&&SBX[b.sbk].auto0){const q=SBX[b.sbk].auto0(p,b);if(q)return q;}const near=nearestEnemy(p.x,p.y,210);if(near&&!near.host85&&near!==b&&near.type!=='anchor85')return near;if(SBX[b.sbk])return SBX[b.sbk].auto(p,b);return b.sbk==='lek'?lekAuto(p,b):wellAuto(p,b);}
function sb85Hud(b){const k=SB_NAMES[b.sbk];if(SBX[b.sbk])return SBX[b.sbk].hud(b,k);if(b.st==='dying')return k+(b.sbk==='lek'?' · ЛИНИЯ СТОИТ':' · СИГНАЛ ПРИНЯТ');if(b.st==='final')return k+' · ВЫБОР';if(b.st==='scene')return k+(b.sbk==='lek'?' · ЗАПИСЬ':' · СВЯЗЬ');if(b.st==='enter')return k;
  return b.sbk==='lek'?lekHud(b):wellHud(b);}
function sb85Update(b,dt){if(sbCommon(b,dt)){if(b.fx85){b.fx85.t+=dt;dying85(b,dt);}return;}if(b.tr>0)b.tr-=dt;if(SBX[b.sbk])SBX[b.sbk].update(b,dt);else if(b.sbk==='lek')lekUpdate(b,dt);else wellUpdate(b,dt);}
// --- финал: сцена (монолог) → выбор у причалов ---
function sb85Final(b){if(b.st!=='fight')return;b.st='scene';b.hp=1;b.inv0=0;b.scT=0;b.docks=null;b.dockT=0;G.eb=G.eb.filter(x=>x.rift);const X=x85();X.calm=99;X.bl=[];X.trk=[];radioClear();
  for(const o of G.enemies.slice()){if(!o.alive||o===b||o.host85===b&&(o.type==='lpart'||o.type==='wemit'||o.keep85))continue;if(o.type==='pilgrim'){o.alive=false;continue;}kill(o,true);}
  if(G.stamp80){G.stamp80=null;document.body.classList.remove('stamp80');}G.inv80=0;G.slow80=0;G.latch74=null;
  sfx('level');buzz('boss');if(typeof hs90==='function')hs90(.25,2);if(SBX[b.sbk])SBX[b.sbk].final(b);else if(b.sbk==='lek')lekFinal(b);else wellFinal(b);}
function sub85(cap,col,lines,onDone){const X=x85();X.sub={cap,col,lines,i:0,t:0,onDone};X.tapUsed=X.tap;}
function subDur85(s){return Math.max(2.2,s.length*.045);}
function subTick85(dt){const X=G.x85,S=X&&X.sub;if(!S)return;S.t+=dt;const line=S.lines[S.i];if(line===undefined){X.sub=null;if(S.onDone)S.onDone();return;}
  if(S.t>=subDur85(line)||(S.t>=.6&&X.tap&&X.tap!==X.tapUsed)){X.tapUsed=X.tap;S.i++;S.t=0;if(S.i>=S.lines.length){X.sub=null;if(S.onDone)S.onDone();}}}
window.addEventListener('pointerdown',()=>{if(G.x85&&G.x85.sub)G.x85.tap=performance.now();},{passive:true});
window.addEventListener('keydown',e=>{if(G.x85&&G.x85.sub&&(e.code==='Space'||e.code==='Enter'||e.code==='KeyF'||e.code==='KeyE'))G.x85.tap=performance.now();});
function sb85Docks(b,dt){const p=G.player;if(!b.docks||!p||p.hp<=0)return false;b.dockT=(b.dockT||0)+dt;
  for(const d of b.docks){if(d.off||d.lock)continue;if(b.dockT>.6&&Math.hypot(p.x-d.x,p.y-d.y)<48){d.ch+=dt;if(d.ch>=.6){sbChoose(b,d.kind);return true;}}else d.ch=Math.max(0,d.ch-dt*2);}return false;}
// разнос причалов по горизонтали: на узком экране телефона (портрет) — ближе к центру, чтобы подписи не уходили за край
function dock85dx(k){const vw=typeof VW==='number'&&VW>0?VW:W;return Math.min(170*(k||1),vw*.22);}
function sb85SetDocks(b,list){const prev=G.mode==='world'?storyFlag(SB_FLAG[b.sbk]):null;b.docks=list.map(d=>Object.assign({ch:0},d));
  for(const d of b.docks){d.x=clamp(d.x,70,W-70);d.y=clamp(d.y,70,H-70);if(prev){if(d.kind===prev)d.prev=true;else d.off=true;}}b.dockT=0;b.prev85=prev||null;}
function sb85Choose(b,ch){if(b.choice||(b.st!=='final'&&b.st!=='scene'&&b.st!=='fight'))return;const S=G.save,world=G.mode==='world'&&!!S&&!!S.story;
  const prev=world?storyFlag(SB_FLAG[b.sbk]):null;const opts=SBX[b.sbk]?SBX[b.sbk].opts(b):b.sbk==='lek'?['break','write']:third85(b)?['silence','answer','third']:['silence','answer'];
  if(prev)ch=prev;else if(!ch||!opts.includes(ch))ch=opts[Math.random()*opts.length|0];
  b.choice=ch;b.docks=null;b.fx85={kind:ch,t:0};x85().calm=99;x85().sub=null;
  if(SBX[b.sbk])SBX[b.sbk].choose(b,ch,world,prev);else if(b.sbk==='lek')lekChoose(b,ch,world,prev);else wellChoose(b,ch,world,prev);
  sbDeath(b);}
// --- ИИ сущностей 0.8.5 (из s74Update0) ---
function s85Update(e,dt,c){if(AI85X[e.type]){AI85X[e.type](e,dt,c);return true;}switch(e.type){
    case 'lekalo':case 'wellcore':{if(!e.sbk){if(G.sb&&G.sb!==e&&G.sb.alive){e.alive=false;return true;}sb85Init(e,e.type==='lekalo'?'lek':'well',1);}e.vx=e.vy=0;sb85Update(e,dt);return true;}
    case 'lpart':case 'wemit':{e.vx=e.vy=0;if(!e.host85||!e.host85.alive||G.sb!==e.host85)kill(e,true);return true;}
    case 'serial85':serialAI85(e,dt,c);return true;
    case 'blank85':e.vx=e.vy=0;return true;
    case 'ghost85':ghostAI85(e,dt);return true;
    case 'note85':noteAI85(e,dt);return true;
    case 'anchor85':e.vx=e.vy=0;return true;}
  return false;}
function s85Hurt(e,dmg,src){if(HURT85X[e.type])return HURT85X[e.type](e,dmg,src||{});if(e.type==='anchor85'){const b=sb85();if(b&&(b.inv0>0||b.st!=='fight')){sbBlock(e);return 0;}}return dmg;}
function s85Killed(e,silent){if(KILL85X[e.type]){KILL85X[e.type](e,silent);return;}const b=G.sb&&is85(G.sb)?G.sb:null;if(!b)return;
  switch(e.type){
    case 'lpart':if(!silent&&b.alive&&b.sbk==='lek'&&e.host85===b)lekPartDied(b,e);break;
    case 'wemit':if(!silent&&b.alive&&b.sbk==='well'&&e.host85===b)wellEmitDied(b,e);break;
    case 'blank85':if(b.sbk==='lek')lekBlankGone(b,e,silent);break;
    case 'ghost85':if(b.sbk==='well'&&!silent&&b.alive)wellGhostDied(b,e);break;
    case 'anchor85':if(b.sbk==='well'&&!silent&&b.alive)wellAnchorDied(b,e);break;}}
// снаряды игрока (до общих попаданий; true — поглощён)
function b85Hit(bu){if(bu.a85)a85Pass(bu);const b=sb85();if(!b)return false;if(SBX[b.sbk])return SBX[b.sbk].bullet?SBX[b.sbk].bullet(b,bu):false;return b.sbk==='lek'?lekBullet(b,bu):wellBullet(b,bu);}
// снаряды союзников 0.8.5 пролетают мирных Паломников насквозь (их ошибки — не ваши)
function a85Pass(bu){for(const e of G.enemies){if(!e.alive||e.type!=='pilgrim'||e.hostile80||(e.pg85&&e.pg85.st==='hostile')||bu.hit.includes(e))continue;if(segDist(bu.px,bu.py,bu.x,bu.y,e.x,e.y)<e.r+8)bu.hit.push(e);}}
// импульс
function pulse85(p,R){const X=G.x85;
  if(inMission()&&G.mode==='world'&&X&&!X.cs&&storyFlag('well38')==='answer'){X.cs=1;p.shieldUp=true;p.shieldT=0;p.inv=Math.max(p.inv||0,2);floater(p.x,p.y-48,'ПОЗЫВНОЙ · ЩИТ',C85.voidc);sfx('cell');}
  if(G.world&&typeof w85Pulse==='function')w85Pulse(p,R);
  const b=sb85();if(!b)return;if(SBX[b.sbk]){if(SBX[b.sbk].pulse)SBX[b.sbk].pulse(b,p,R);return;}if(b.sbk==='lek')lekPulse(b,p,R);else wellPulse(b,p,R);}
// движение корабля после ввода: конвейеры, хват, печь, колодец, оглушение
function drift85(p,dt){const X=G.x85;if(!X||!inMission())return;
  if(X.stun>0){X.stun-=dt;if(p.dashT>0)X.stun=0;else{p.x=p.px;p.y=p.py;}}
  const b=sb85();if(!b)return;if(SBX[b.sbk]){if(SBX[b.sbk].drift)SBX[b.sbk].drift(b,p,dt);}else if(b.sbk==='lek')lekDrift(b,p,dt);else wellDrift(b,p,dt);
  p.x=clamp(p.x,p.r,BW-p.r);p.y=clamp(p.y,p.r,BH-p.r);}
// --- миссия ---
function t85Init(M){G.x85={rk:{},bl:[],trk:[],calm:0,stun:0,cs:0,tap:0,tapUsed:0,b:null,ally:null,sub:null,done:0,self:0};
  if(G.mode==='endless'||!M||!M.gen)return;const m=G.m;
  if(m>=32&&m<=37&&storyFlag('well38')==='silence'&&G.mode==='world')thin85();}
// «Заглушить»: в миссиях 32–37 Отзвуков и Петель на 25% меньше
function thin85(){let n=0;for(const wv of G.waves||[])for(let i=wv.length-1;i>=0;i--){if(wv[i]==='echo80'||wv[i]==='loop'){if(n++%4===0)wv.splice(i,1);}}}
function t85Tick(dt){const X=G.x85;if(!X||!inMission())return;if(X.calm>0)X.calm-=dt;if(X.silence>0)X.silence-=dt;if(X.rew>0)X.rew-=dt;
  const b=G.sb&&is85(G.sb)?G.sb:null;if(b&&!b.alive&&!X.done){X.done=1;clean85();}
  bl85Tick(dt);if(X.ally)ally85Tick(dt);subTick85(dt);hud85();}
function clean85(){const X=G.x80;if(X&&X.leaks)X.leaks=X.leaks.filter(q=>!q.w85);const Y=G.x85;if(Y){Y.bl=[];Y.trk=[];Y.stun=0;}}
function r85Reset(){G.x85=null;const el=document.getElementById('b85G');if(el)el.hidden=true;tick85(false);}
// взрывы «Разрыва»-копий и учёт попаданий своих же копий
function bl85Tick(dt){const X=G.x85,p=G.player;if(!X||!p)return;if(!X.bl.length&&!X.trk.length)return;const live=new Set(G.eb);
  for(const q of X.bl){if(q.life>0&&live.has(q))continue;if(q.bx85)continue;q.bx85=1;const R=q.bl85||60,col=q.gh85?'#f2f6ff':'#ffd36b';explode(q.x,q.y,col,12,.6);if(G.shock.length<60)G.shock.push({x:q.x,y:q.y,r:6,R,t:0,col,thin:true});sfx('boom');
    const d=Math.hypot(q.x-p.x,q.y-p.y);if(p.hp>0&&d>=q.r+14&&d<R&&p.dashT<=0){const hp0=p.hp;damagePlayer(q.dmg*.5);if(p.hp<hp0)X.self+=hp0-p.hp;}}
  X.bl=X.bl.filter(q=>!q.bx85);
  for(const q of X.trk){if(q.life>0&&live.has(q))continue;q.td85=1;if(p.hp>0&&Math.hypot(q.x-p.x,q.y-p.y)<q.r+14){X.self+=q.dmg;if(q.gh85){const b=sb85();if(b)b.ghostHit=1;}}}
  X.trk=X.trk.filter(q=>!q.td85);}
// --- полоса под полоской босса (паспорт, ОТК, бункер, запись, петля) ---
function tick85(on){const bar=document.getElementById('bossBar');if(!bar)return;
  for(const s of bar.querySelectorAll('.tick')){if(s.classList.contains('t85'))s.style.display=on?'':'none';else if(s.id!=='tick10')s.style.display=on?'none':'';}
  if(on){const b=G.sb,ths=b&&b.th||[];['a','b','c'].forEach((k,i)=>{let s=document.getElementById('t85'+k);if(!s){s=document.createElement('span');s.className='tick t85';s.id='t85'+k;bar.appendChild(s);}
    if(ths[i]!==undefined){s.style.left=(ths[i]*100)+'%';s.style.display='';}else s.style.display='none';});}}
let hud85K='',hud85On=null;
function hud85(){const b=G.sb&&is85(G.sb)&&G.sb.alive?G.sb:null;const show=!!b&&inMission()&&['enter','fight','scene','final'].includes(b.st);
  if(show!==hud85On){hud85On=show;tick85(show);}
  let el=document.getElementById('b85G');
  if(!el){if(!show)return;const bar=document.getElementById('bossBar');if(!bar)return;
    if(!document.getElementById('b85css')){const st=document.createElement('style');st.id='b85css';st.textContent='#b85G{display:flex;align-items:center;gap:8px;margin-top:5px;font:700 11px "JetBrains Mono",monospace;letter-spacing:.06em;color:#c9d2de;min-height:14px;text-shadow:0 1px 0 #04060c}#b85G[hidden]{display:none}#b85G .l{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:72%}#b85G .g{flex:1;height:5px;border:1px solid #3a3a2a;position:relative;overflow:hidden;min-width:48px;background:rgba(0,0,0,.35)}#b85G .g i{position:absolute;inset:0;transform-origin:left;background:#e8d27a;transition:transform .12s}#b85G.nog .g{display:none}#b85G .r{white-space:nowrap}#b85G.wrap .l{white-space:normal;max-width:100%}@media (max-width:820px){#b85G{font-size:12px;gap:6px}}';document.head.appendChild(st);}
    el=document.createElement('div');el.id='b85G';el.innerHTML='<span class="l"></span><span class="g"><i></i></span><span class="r"></span>';bar.insertAdjacentElement('afterend',el);}
  if(!show){if(!el.hidden)el.hidden=true;hud85K='';return;}
  if(el.hidden)el.hidden=false;const I=SBX[b.sbk]?SBX[b.sbk].strip(b):b.sbk==='lek'?lekStrip(b):wellStrip(b);
  const key=I.l+'|'+(I.k===null||I.k===undefined?'-':I.k.toFixed(3))+'|'+(I.r||'')+'|'+(I.col||'')+'|'+(I.wrap?1:0);if(key===hud85K)return;hud85K=key;
  el.querySelector('.l').textContent=I.l;el.querySelector('.l').style.color=I.lc||'';el.querySelector('.r').textContent=I.r||'';el.classList.toggle('nog',I.k===null||I.k===undefined);el.classList.toggle('wrap',!!I.wrap);
  const gi=el.querySelector('.g i');if(I.k!==null&&I.k!==undefined){gi.style.transform='scaleX('+clamp(I.k,0,1).toFixed(3)+')';gi.style.background=I.col||'#e8d27a';}}

