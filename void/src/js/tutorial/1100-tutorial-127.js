/* ===== 1.2.7 α «Первый вылет»: обучение внутри игры (секторы I–II) и надпись запрета прыжка =====
   Обучение только смотрит и подсказывает: ни одна игровая величина здесь не меняется. */

/* ---------- 1. Запрет прыжка: причина, надпись по центру карты, красные точки ---------- */
const JUMP_DENY={
  rift:{msg:'ПРЫЖОК НЕВОЗМОЖЕН · ПОМЕХИ РАЗЛОМА',l1:'ПОМЕХИ РАЗЛОМА',l2:'ПРЫЖОК НЕДОСТУПЕН',sub:'УЙДИТЕ ОТ РАЗЛОМА'},
  patrol:{msg:'ПРЫЖОК НЕВОЗМОЖЕН · РЯДОМ ВРАГИ',l1:'ВО ВРЕМЯ ПАТРУЛЯ',l2:'ПЕРЕМЕЩЕНИЕ НЕДОСТУПНО',sub:'РАЗБЕЙТЕ ПАТРУЛЬ ИЛИ УЙДИТЕ ДАЛЬШЕ'},
  enemies:{msg:'ПРЫЖОК НЕВОЗМОЖЕН · РЯДОМ ВРАГИ',l1:'РЯДОМ ВРАГИ',l2:'ПРЫЖОК НЕДОСТУПЕН',sub:'ОТОЙДИТЕ ИЛИ ЗАЧИСТИТЕ РАЙОН'},
  anom:{msg:'ПРЫЖОК НЕВОЗМОЖЕН · ИДЁТ АНОМАЛИЯ',l1:'ИДЁТ АНОМАЛИЯ',l2:'ПРЫЖОК НЕДОСТУПЕН',sub:'ДОЖДИТЕСЬ ЕЁ КОНЦА'},
  zero:{msg:'ПРЫЖОК НЕВОЗМОЖЕН · ВОРОТА НУЛЕВОЙ ТОЧКИ',l1:'ВОРОТА НУЛЕВОЙ ТОЧКИ',l2:'ПРЫЖОК НЕДОСТУПЕН',sub:''},
  zb:{msg:'ПРЫЖОК НЕВОЗМОЖЕН · ТОЧКА НЕВОЗВРАТА',l1:'ТОЧКА НЕВОЗВРАТА',l2:'ПРЫЖОК НЕДОСТУПЕН',sub:''}};
/* те же проверки и в том же порядке, что были в mapJumpAt; best=null — общий запрет без привязки к точке */
function jumpDenyReason(best){const p=G.player;if(!p)return null;
  if(!ALPHA_OPEN/* ВРЕМЕННО (альфа 0.5.9): в альфе прыжок из Разлома разрешён */&&(G.riftI||0)>=.2)return 'rift';
  if(!ALPHA_OPEN/* ВРЕМЕННО (альфа 0.5.9): в альфе прыжок рядом с врагами разрешён */&&G.enemies.some(o=>o.alive&&o.type!=='mine'&&o.type!=='lock'&&Math.hypot(o.x-p.x,o.y-p.y)<900))
    return (G.event==='zone'||G.enemies.some(o=>o.alive&&o.zone&&Math.hypot(o.x-p.x,o.y-p.y)<900))?'patrol':'enemies';
  if(G.anom)return 'anom';
  if(best&&zeroJumpDeny110(best))return 'zero';
  if(zbOn())return 'zb';
  return null;}
let mapDenyT=0;
function mapDenyFit(el){const L=el.querySelectorAll('.md-l');if(!L.length)return;el.style.removeProperty('--md-fs');
  const box=el.clientWidth||1;let fs=parseFloat(getComputedStyle(L[0]).fontSize)||22;
  for(let i=0;i<24;i++){let over=false;L.forEach(l=>{if(l.scrollWidth>l.clientWidth+1||l.scrollWidth>box*.92)over=true;});if(!over)break;fs-=1;el.style.setProperty('--md-fs',fs+'px');if(fs<=15)break;}}
function mapDenyShow(r,soft){const D=JUMP_DENY[r];if(!D)return;const box=document.querySelector('#sMap .mapbox');if(!box)return;
  let el=$('#mapDeny');if(!el){el=document.createElement('div');el.id='mapDeny';el.setAttribute('role','alert');box.appendChild(el);}
  const key=r+'|'+(soft?1:0);if(el.dataset.k!==key){el.dataset.k=key;
    el.innerHTML=`<div class="md-band"><span class="md-l">${D.l1}</span><span class="md-l">${D.l2}</span><span class="md-s">${D.sub}</span></div>`;
    el.setAttribute('aria-label',D.l1+' — '+D.l2.toLowerCase()+(D.sub?'. '+D.sub.toLowerCase():''));}
  el.classList.remove('on');void el.offsetWidth;el.classList.toggle('soft',!!soft);el.classList.add('on');mapDenyFit(el);
  clearTimeout(mapDenyT);mapDenyT=setTimeout(()=>{el.classList.remove('on');},soft?1400:1960);}
function mapDenyHide(){const el=$('#mapDeny');if(el){clearTimeout(mapDenyT);el.classList.remove('on');}}
/* цвет колец точек прыжка: белые, при запрете — тускло-красные (переход 300 мс) */
function mapJpCol(hv){const k=clamp(G.mapBlkK||0,0,1),r=255,g=Math.round(255-176*k),b=Math.round(255-145*k),a=hv?.9-.15*k:.3+.08*k;return `rgba(${r},${g},${b},${a.toFixed(3)})`;}
{const _dm=drawMap;drawMap=function(){const now=performance.now();
  if(G.state==='map'&&(!G.mapBlkAt||now-G.mapBlkAt>250)){G.mapBlkAt=now;const r=jumpDenyReason(null);G.mapBlk=r;}
  const dt=Math.min(.1,(now-(G.mapBlkLast||now))/1000);G.mapBlkLast=now;const tgt=G.mapBlk?1:0;G.mapBlkK=(G.mapBlkK||0)+clamp(tgt-(G.mapBlkK||0),-dt/.3,dt/.3);
  const r=_dm.apply(this,arguments);try{tutMapDraw(now);}catch(e){console.error(e);}return r;};}
{const _om=openMap;openMap=function(){const was=G.state;const r=_om.apply(this,arguments);if(was!=='map'&&G.state==='map'){G.mapBlkAt=0;G.mapBlk=jumpDenyReason(null);G.mapBlkK=G.mapBlk?1:0;mapDenyHide();
    if(G.mapBlk&&G.mapBlk!=='zero')setTimeout(()=>{if(G.state==='map')mapDenyShow(G.mapBlk,true);},120);tutEmit('map');}return r;};}
{const _cm=closeMap;closeMap=function(){const was=G.state==='map';const r=_cm.apply(this,arguments);if(was&&G.state!=='map'){mapDenyHide();tutEmit('mapClose');}return r;};}

/* ---------- 2. Обучение ---------- */
const TUT_KEYS_ALL=['calib','move','lom','stash','act','fire','dash','energy','pulse','cell','line','map','jump','patrol'];
const TUT={cur:null,hideAt:-1e9,gap:0,hist:[],last:0,mv:0,lpx:null,lpy:null,worldT:0,calmT:0,kills:null,carry:null,lom:null,lomAt:0,patrolEv:null,jumpPt:null,el:null,chip:null,rings:[],chk:0,fx:{}};
function tutClean(t,cleared){
  if(!t||typeof t!=='object'||Array.isArray(t))return cleared>=1?{v:1,off:1,vet:1,done:{},seen:{}}:{v:1,done:{},seen:{}};
  const o={v:1,done:{},seen:{}};if(t.off)o.off=1;if(t.vet)o.vet=1;
  for(const k of TUT_KEYS_ALL){if(t.done&&t.done[k])o.done[k]=1;const n=t.seen?+t.seen[k]:0;if(n>0&&Number.isFinite(n))o.seen[k]=Math.min(3,Math.round(n));if(t.ok&&t.ok[k]){(o.ok||(o.ok={}))[k]=1;}}
  return o;}
{const _ms=migrateSave;migrateSave=function(S){const had=!!(S&&typeof S==='object'&&S.tut&&typeof S.tut==='object'&&!Array.isArray(S.tut));
  const r=_ms.apply(this,arguments);if(r)r.tut=tutClean(had?r.tut:null,+r.cleared||0);return r;};}
/* облако: пройденный где-то урок пройден везде */
{const _ca=cloudApply;cloudApply=function(body){let loc=null;try{const v=store('void_world');loc=v&&v.tut;}catch(e){}
  const r=_ca.apply(this,arguments);
  try{const S=G.save;if(S&&loc&&typeof loc==='object'){const c=tutClean(loc,0),T=S.tut||(S.tut={v:1,done:{},seen:{}});T.done=T.done||{};T.seen=T.seen||{};
    for(const k in c.done)T.done[k]=1;if(c.off)T.off=1;store(saveKey(),S);}}catch(e){}
  return r;};}
function tutT(){const S=G.save;if(!S)return null;if(!S.tut||typeof S.tut!=='object')S.tut=tutClean(null,+S.cleared||0);const T=S.tut;if(!T.done)T.done={};if(!T.seen)T.seen={};return T;}
function tutSave(){const S=G.save;if(!S)return;try{if(G.world&&G.player)saveWorld();else store(saveKey(),S);}catch(e){}}
function tutOn(){const S=G.save;if(!S||!S.tut||S.tut.off)return false;
  if(G.mode!=='world'||G.devRun||G.fromAbyss||(window.DEVW&&DEVW.on&&DEVW.on()))return false;return true;}
function tutInput(){return G.input==='pad'?'pad':touchMode?'touch':'kbm';}
function tutDoneQ(k){const T=tutT();return !!(T&&T.done[k]);}
function tutDone(k,how){const T=tutT();if(!T||T.done[k])return;if(!tutOn()&&how!=='skip')return;T.done[k]=1;
  if(TUT.cur&&TUT.cur.k===k)tutEnd(how==='skip'?'skip':'ok');tutSave();}
/* события игры → уроки (только чтение) */
function tutEmit(ev,a){if(!G.save)return;
  if(ev==='dash')tutDone('dash');else if(ev==='pulse')tutDone('pulse');else if(ev==='act')tutDone('act');else if(ev==='map')tutDone('map');
  else if(ev==='jump')tutDone('jump');else if(ev==='cell')tutDone('cell');else if(ev==='line')tutDone('line');
  else if(ev==='patrolBroken')tutDone('patrol');
  else if(ev==='patrol'){if(!TUT.patrolEv||performance.now()-TUT.patrolEv.t>20000)TUT.patrolEv={x:a&&a.x,y:a&&a.y,t:performance.now()};}
  else if(ev==='mapClose'){const C=TUT.cur;if(C&&C.k==='jump')tutEnd('miss');}}
{const _td=tryDash;tryDash=function(){const p=G.player,cd=p?p.dashCd:0,dt=p?p.dashT:0;const r=_td.apply(this,arguments);
  if(p&&G.player===p&&(p.dashCd>cd||p.dashT>dt))tutEmit('dash');return r;};}
{const _tp=tryPulse;tryPulse=function(){const p=G.player,en=p?p.en:0;const r=_tp.apply(this,arguments);if(p&&en>=100&&p.en<en)tutEmit('pulse');return r;};}
{const _ca2=cardAct;cardAct=function(){const had=!!G.card&&G.state==='world';const r=_ca2.apply(this,arguments);if(had)tutEmit('act');return r;};}
{const _bn=banner;banner=function(b){if(b==='ПРЫЖОК')tutEmit('jump');return _bn.apply(this,arguments);};}
{const _fl=floater;floater=function(x,y,text){if(typeof text==='string'){
    if(text==='+ЗАРЯД')tutEmit('cell');else if(text==='ЛИНИЯ ВОССТАНОВЛЕНА')tutEmit('line');
    else if(/^ПАТРУЛЬ РАЗБИТ/.test(text))tutEmit('patrolBroken');else if(/^(ПАТРУЛЬ( ·|$)|ЗАСЛОН ГВАРДИИ)/.test(text))tutEmit('patrol',{x,y});}
  return _fl.apply(this,arguments);};}
/* новичку текстовая справка о секторе больше не нужна — её показывает обучение */
{const _to=toast;toast=function(title){if(title==='ОТКРЫТЫЙ СЕКТОР'&&G.save&&G.save.tut&&!G.save.tut.off&&!G.save.tut.vet)return;return _to.apply(this,arguments);};}
/* старая подсказка 0.6.0 заменена */
tutTick=function(){};

/* ---------- вспомогательное ---------- */
function tutSP(x,y){const Z=G.world?(G.wz95||1):1;return [SC*(Z*(x-CX)+W/2*(1-Z)),SC*(Z*(y-CY)+H/2*(1-Z))];}
function tutHostile(e){return e&&e.alive&&!(e.spawnT>0)&&!e.ghost&&e.type!=='mine'&&e.type!=='lock'&&e.type!=='rangedummy'&&!e.peace&&!(EDEF[e.type]&&EDEF[e.type].passive);}
function tutNearFoes(R){const p=G.player;if(!p)return 0;let n=0;for(const e of G.enemies)if(tutHostile(e)&&Math.hypot(e.x-p.x,e.y-p.y)<R)n++;return n;}
function tutCalm(){const p=G.player;if(!p||p.hp<=0)return false;if(p.hp<(G.st&&G.st.maxHp||100)*.35)return false;
  if(G.boss||G.jam||G.sb||G.anom||G.prologue||banT>0)return false;if(G.radio&&G.radio.cur)return false;
  if(tutNearFoes(600))return false;const t=$('#toast');if(t&&!t.hidden)return false;return true;}
function tutVis(el){if(!el||el.hidden)return false;const r=el.getBoundingClientRect();if(r.width<2||r.height<2)return false;const cs=getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden'&&+cs.opacity>.05;}
function tutCardBtn(){const W_=$('#wcard');if(!W_||W_.hidden)return null;const b=W_.querySelector('[data-act]:not([disabled])');return b&&tutVis(b)?b:null;}
function tutShopPt(){const p=G.player;let best=null,bd=1e12,bestR=null,bdR=1e12;
  for(const s of WORLD.shops){const d=Math.hypot(s.x-p.x,s.y-p.y);if(sectorIdx(s.x,s.y)>1)continue;if(revealedAt(s.x,s.y)&&d<bdR){bdR=d;bestR=s;}if(d<bd){bd=d;best=s;}}
  return bestR||best;}
function tutKeyHTML(a){const I=tutInput();
  const kb=s=>`<kbd>${s}</kbd>`,pd=s=>`<kbd class="pad">${s}</kbd>`;
  const mouse='<svg class="tut-mouse" viewBox="0 0 14 20" aria-hidden="true"><rect x="1" y="1" width="12" height="18" rx="6" fill="none" stroke="#8fe9ff" stroke-width="1.2"/><path d="M7 1v7M1.4 8h11.2" stroke="#8fe9ff" stroke-width="1"/><path d="M7 1.2a5.8 5.8 0 0 0-5.6 5.8V8H7z" fill="#8fe9ff" opacity=".85"/></svg>';
  if(I==='pad')return {move:'<kbd>Л. СТИК</kbd>',dash:pd('A'),pulse:pd('X'),act:pd('B'),map:pd('Y'),jump:'',fire:''}[a]||'';
  if(I==='touch')return '';
  return {move:'<span class="tut-wasd"><kbd data-kk="KeyW">W</kbd><kbd data-kk="KeyA">A</kbd><kbd data-kk="KeyS">S</kbd><kbd data-kk="KeyD">D</kbd></span>',
    dash:kb('ПРОБЕЛ'),pulse:kb('E'),act:kb('F'),map:kb('M'),jump:mouse,fire:SET.manual?mouse:''}[a]||'';}

/* ---------- уроки ---------- */
/* ctx: где живёт урок; fight: можно показывать в бою; dur: сколько держится; info: закрывается показом */
const TUT_L={
  move:{ctx:'world',dur:10,
    when(){return TUT.worldT>1.5&&!G.prologue;},
    view(){const I=tutInput();return {keys:tutKeyHTML('move'),text:'ЛЕТИ',at:I==='touch'?'stick':'ship'};}},
  lom:{ctx:'world',dur:4.6,info:true,
    when(){return (G.save.carry||0)>0;},
    view(){return {keys:'',text:'<i></i>СКЛАД <span class="sep">·</span> <i class="a"></i>С СОБОЙ',at:'el',el:$('#wLom'),ring:[$('#wLom')],ringCls:'amber sq'};}},
  stash:{ctx:'world',dur:45,
    when(){const S=G.save;if(!tutDoneQ('lom')||!(S.carry>0))return false;return S.carry>=25||performance.now()-TUT.lomAt>90000;},
    view(){const s=tutShopPt(),p=G.player;return {keys:'',text:'<i class="a"></i>ЛОМ <b>НА СКЛАД</b>',at:'ship',draw:'stash',avoid:s?Math.atan2(s.y-p.y,s.x-p.x):undefined};}},
  act:{ctx:'world',dur:10,
    when(){return !!tutCardBtn();},
    view(){const I=tutInput(),b=tutCardBtn();const lab=b?(b.textContent||'').trim().split(/\s+/)[0]:'ОТКРЫТЬ';
      if(I==='touch'){const ta=$('#tAct');if(tutVis(ta))return {keys:'',text:'НАЖМИ',at:'el',el:ta,ring:[ta]};return {keys:'',text:'НАЖМИ',at:'el',el:b,ring:[b],ringCls:'sq'};}
      return {keys:tutKeyHTML('act'),text:lab,at:'el',el:$('#wcard'),ring:[b],ringCls:'sq',side:'up'};}},
  fire:{ctx:'any',dur:6,fight:true,info:true,
    when(){return tutNearFoes(600)>0;},
    view(){const man=SET.manual&&tutInput()==='kbm';return {keys:man?tutKeyHTML('fire'):'',text:man?'ОГОНЬ':'ОГОНЬ <b>САМ</b>',at:'ship',draw:'fire'};}},
  dash:{ctx:'any',dur:6,fight:true,minShow:3.5,
    when(){const p=G.player;if(p.dashCd>0||dashBlocked())return false;return tutThreat();},
    view(){const I=tutInput();if(I==='touch'){const d=$('#tDash');return {keys:'',text:'УВОРОТ',at:'el',el:d,ring:[d],draw:'dash'};}
      return {keys:tutKeyHTML('dash'),text:'УВОРОТ',at:'ship',draw:'dash'};}},
  pulse:{ctx:'any',dur:7,fight:true,
    when(){const p=G.player;return p.en>=100&&tutNearFoes((G.st.pR||150)*1.1)>=2;},
    view(){const I=tutInput();if(I==='touch'){const d=$('#tPulse');return {keys:'',text:'УДАР ВОКРУГ',at:'el',el:d,ring:[d],ringCls:'amber',draw:'pulse'};}
      return {keys:tutKeyHTML('pulse'),text:'УДАР <b>ВОКРУГ</b>',at:'ship',draw:'pulse'};}},
  cell:{ctx:'mission',dur:25,fight:true,
    when(){const p=G.player;if(!G.bc||G.bc.done)return false;if(p.cargo>0)return true;return !!tutCell();},
    view(){const p=G.player,q=p.cargo>0?G.bc:tutCell(),av=q?Math.atan2(q.y-p.y,q.x-p.x):undefined;return p.cargo>0?{keys:'',text:'<i class="a"></i>СДАЙ <b>В КОЛЬЦО</b>',at:'ship',draw:'ring',avoid:av}:{keys:'',text:'<i class="a"></i>СОБЕРИ <b>ЯЧЕЙКУ</b>',at:'ship',draw:'cell',avoid:av};}},
  line:{ctx:'mission',dur:25,fight:true,
    when(){return !!tutRelay();},
    view(){return {keys:'',text:'ДЕРЖИСЬ <b>НА ЛИНИИ</b>',at:'line',draw:'line'};}},
  map:{ctx:'world',dur:10,
    when(){const S=G.save,p=G.player;if((S.cleared||0)<1||TUT.worldT<30||jumpDenyReason(null))return false;return jumpPoints().some(q=>Math.hypot(q.x-p.x,q.y-p.y)>1500);},
    view(){const I=tutInput();if(I==='touch'){const ta=$('#tAct');if(tutVis(ta)&&ta.dataset.act==='map')return {keys:'',text:'КАРТА',at:'el',el:ta,ring:[ta]};const mi=$('#mini');return {keys:'',text:'КАРТА',at:'el',el:mi,ring:[mi]};}
      const bm=$('#btnMap');if(I==='kbm'&&tutVis(bm))return {keys:tutKeyHTML('map'),text:'КАРТА',at:'el',el:bm,ring:[bm],ringCls:'sq'};
      return {keys:tutKeyHTML('map'),text:'КАРТА',at:'ship'};}},
  jump:{ctx:'map',dur:0,
    when(){if(tutInput()==='pad'||G.mapTab!=='map'||!G.mapPts||!G.mapPts.length)return false;if(jumpDenyReason(null))return false;return !!tutJumpPick();},
    view(){const tip=$('#mapTip'),b=tip&&!tip.hidden?tip.querySelector('[data-mjump]'):null;
      if(b&&tutVis(b))return {keys:'',text:'',at:'none',ring:[b],ringCls:'sq amber'};return {at:'none'};}},
  patrol:{ctx:'world',dur:7,fight:true,info:true,
    when(){const E=TUT.patrolEv;return !!E&&performance.now()-E.t<6000&&(!!tutZone()||G.enemies.some(e=>e.alive&&e.zone));},
    view(){const z=tutZone(),p=G.player;return {keys:'',text:'<b>ПАТРУЛЬ</b> <span class="sep">·</span> РАЗБЕЙ ИЛИ УЛЕТИ',at:'ship',draw:'patrol',hostile:true,avoid:z?Math.atan2(p.y-z.y,p.x-z.x):undefined};}}};
function tutZone(){const p=G.player;let best=null,bd=1e12;for(const z of (G.zones||[]).concat(typeof W58!=='undefined'&&W58.zones||[])){if(!z||!z.active)continue;const d=Math.hypot(z.x-p.x,z.y-p.y);if(d<bd){bd=d;best=z;}}return best;}
const TUT_PRI=['patrol','dash','pulse','fire','cell','line','calib','move','act','energy','lom','stash','map','jump'];
/* угроза для рывка: снаряд дойдёт меньше чем за 0,6 с или таран вплотную */
function tutThreat(){const p=G.player;
  for(const b of G.eb||[]){const dx=p.x-b.x,dy=p.y-b.y,v=Math.hypot(b.vx||0,b.vy||0);if(v<40)continue;const d=Math.hypot(dx,dy);if(d>520)continue;
    const along=(dx*(b.vx||0)+dy*(b.vy||0))/v;if(along<=0)continue;const tti=along/v;if(tti>.6||tti<.06)continue;
    const miss=Math.abs(dx*(b.vy||0)-dy*(b.vx||0))/v;if(miss<(p.r||13)+(b.r||4)+14){TUT.threat={x:b.x,y:b.y,vx:b.vx,vy:b.vy};return true;}}
  for(const e of G.enemies){if(!tutHostile(e))continue;const d=Math.hypot(e.x-p.x,e.y-p.y);if(d>(e.r||14)+(p.r||13)+70)continue;const cl=((e.vx||0)*(p.x-e.x)+(e.vy||0)*(p.y-e.y))/(d||1);
    if(cl>60){TUT.threat={x:e.x,y:e.y,vx:e.vx,vy:e.vy};return true;}}
  return false;}
function tutCell(){const p=G.player;let best=null,bd=1e9;for(const k of G.pick||[]){if(k.k!=='cell'||k.stab>0)continue;const d=Math.hypot(k.x-p.x,k.y-p.y);if(d<bd){bd=d;best=k;}}return best;}
function tutRelay(){const p=G.player;if(!G.bc||!G.relays)return null;let best=null,bd=1e9;for(const r of G.relays){if(!r.cut)continue;const d=segDist(r.x,r.y,G.bc.x,G.bc.y,p.x,p.y);if(d<bd){bd=d;best=r;}}return best;}
function tutJumpPick(){const p=G.player,P=G.mapPts||[];if(!p||!P.length)return null;
  if(TUT.jumpPt){const q=P.find(z=>z.label===TUT.jumpPt);if(q)return q;}
  const far=P.filter(q=>Math.hypot(q.x-p.x,q.y-p.y)>800);if(!far.length)return null;
  const sh=far.filter(q=>q.label==='М').sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y));
  const q=sh[0]||far.slice().sort((a,b)=>Math.hypot(b.x-p.x,b.y-p.y)-Math.hypot(a.x-p.x,a.y-p.y))[0];return q;}
function tutCtxOk(c){const st=G.state;
  if(c==='world')return st==='world'&&G.world&&!!G.player&&!G.prologue;
  if(c==='mission')return st==='play'&&!G.world&&G.m>=1&&G.m<=10&&!!G.player;
  if(c==='map')return st==='map';
  if(c==='any')return ((st==='world'&&G.world&&!G.prologue)||(st==='play'&&!G.world&&G.m>=1&&G.m<=10))&&!!G.player;
  return false;}

/* ---------- режиссёр ---------- */
function tutStart(k){const L=TUT_L[k];TUT.cur={k,L,t:0,shown:0,step:null};TUT.hist.push(performance.now());(TUT.log||(TUT.log=[])).push(k);if(TUT.log.length>64)TUT.log.shift();if(k==='jump')TUT.jumpPt=null;
  if(k==='jump'){const q=tutJumpPick();if(q){TUT.jumpPt=q.label;const M=G.mapXY,V_=G.mapView;if(M&&V_&&(q.px<48||q.px>M.w-48||q.py<48||q.py>M.h-48)){V_.cx=q.x;V_.cy=q.y-150;V_.vx=V_.vy=0;}}}}
function tutEnd(how){const C=TUT.cur;if(!C)return;TUT.cur=null;const T=tutT();
  if(how==='ok'){if(T&&!T.done[C.k]){T.done[C.k]=1;tutSave();}if(!C.L.info)tutFxOk(C.k);TUT.gap=C.k==='map'?.4:4;}
  else if(how==='abort'){TUT.gap=1.5;}
  else{TUT.gap=4;if(T&&how!=='skip'){if(C.L.info){T.done[C.k]=1;}else if(C.t>1){T.seen[C.k]=(T.seen[C.k]||0)+1;if(T.seen[C.k]>=3)T.done[C.k]=1;}tutSave();}}
  if(C.k==='lom'&&how!=='abort')TUT.lomAt=performance.now();
  tutDomHide(how==='ok'?'ok':'out');}
function tutTick2(dt,now){
  const S=G.save;if(!S||!S.tut)return;const T=tutT();
  /* обучение кончается вместе с секторами I–II */
  if(!T.off&&G.mode==='world'&&((S.cleared||0)>=10||(G.world&&G.player&&sectorIdx(G.player.x,G.player.y)>=2))){T.off=1;tutEnd('abort');tutSave();}
  if(!tutOn()){if(TUT.cur)tutEnd('abort');tutDomHide('out');return;}
  const p=G.player;
  /* наблюдения: путь, лом, убийства */
  if(G.state==='world'&&G.world&&p&&!G.prologue){TUT.worldT+=dt;if(TUT.lpx!==null){const d=Math.hypot(p.x-TUT.lpx,p.y-TUT.lpy);if(d<60)TUT.mv+=d;}TUT.lpx=p.x;TUT.lpy=p.y;
    if(TUT.mv>=250)tutDone('move');}
  else{TUT.lpx=null;if(G.state!=='map'&&G.state!=='world')TUT.worldT=G.state==='play'?0:TUT.worldT;}
  if(TUT.carry!==null&&TUT.carry>0&&(S.carry||0)===0&&(S.lom||0)>=TUT.lom+TUT.carry-1&&(G.state==='world'||G.state==='shop')){tutFly(TUT.carry);tutDone('stash');}
  TUT.carry=S.carry||0;TUT.lom=S.lom||0;
  if(TUT.kills===null||G.kills<TUT.kills)TUT.kills=G.kills;if(G.kills>TUT.kills){TUT.kills=G.kills;tutDone('fire');}
  if(G.state==='levelup'||G.state==='pause'||G.state==='settings'){if(TUT.cur)tutDomHide('out');return;}
  if(TUT.gap>0)TUT.gap-=dt;
  /* текущий урок */
  const C=TUT.cur;
  if(C){if(T.done[C.k]){tutEnd('ok');return;}
    if(!tutCtxOk(C.L.ctx)){tutEnd(C.k==='jump'?'miss':'abort');return;}
    if(!C.L.fight&&!tutCalm()&&C.L.ctx!=='map'){tutEnd('abort');return;}
    /* склад уступает карточке объекта, карта — ничему */
    if(C.k==='stash'&&!tutDoneQ('act')&&TUT_L.act.when()&&tutCalm()){tutEnd('abort');tutStart('act');tutDraw(now);return;}
    C.t+=dt;if(C.L.step){C.L.step(dt,now);if(TUT.cur!==C)return;}
    const keep=C.L.minShow&&C.t<C.L.minShow;
    if(!keep&&C.L.dur&&C.t>C.L.dur){tutEnd(C.L.info?'ok':'miss');return;}
    if(C.k==='patrol'&&TUT.patrolEv&&C.t>1&&!G.zones.some(z=>z.active)&&!G.enemies.some(e=>e.alive&&e.zone)){tutEnd('ok');T.done.patrol=1;tutSave();return;}
    if(!keep&&!C.L.fight&&C.L.ctx!=='map'&&!C.L.info&&C.k!=='stash'&&C.k!=='move'&&C.k!=='calib'&&!C.L.when())C.idle=(C.idle||0)+dt;else C.idle=0;
    if(C.idle>1.2){tutEnd(C.t>3?'miss':'abort');return;}
    tutDraw(now);return;}
  /* выбор следующего */
  if(TUT.gap>0)return;
  if((TUT.chk+=dt)<.1)return;TUT.chk=0;
  const t0=performance.now();TUT.hist=TUT.hist.filter(h=>t0-h<600000);if(TUT.hist.length>=6)return;
  const calm=tutCalm();
  for(const k of TUT_PRI){if(T.done[k])continue;const L=TUT_L[k];if(!tutCtxOk(L.ctx))continue;if(!L.fight&&L.ctx!=='map'&&!calm)continue;
    if(k==='dash'||k==='pulse'||k==='fire'||k==='patrol'){}else if(k!=='move'&&k!=='jump'&&k!=='calib'&&!tutDoneQ('move')&&G.world)continue;
    if(k==='move'&&TUT_L.calib&&!T.done.calib&&TUT_L.calib.when())continue;
    let ok=false;try{ok=L.when();}catch(e){ok=false;}
    if(ok){tutStart(k);tutDraw(now);return;}}
}

/* ---------- отрисовка: DOM (подпись, кольца) ---------- */
function tutDom(){if(TUT.el)return TUT.el;const el=document.createElement('div');el.id='tut';el.hidden=true;
  el.innerHTML='<div class="tut-ring"></div><div class="tut-ring"></div><div class="tut-chip" role="status" aria-live="polite"><span class="tut-keys"></span><span class="tut-txt"></span><button class="tut-x" type="button" aria-label="Скрыть подсказку">✕</button></div>';
  document.body.appendChild(el);TUT.el=el;TUT.chip=el.querySelector('.tut-chip');TUT.rings=[...el.querySelectorAll('.tut-ring')];
  el.querySelector('.tut-x').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const C=TUT.cur;if(C)tutDone(C.k,'skip');});
  el.querySelector('.tut-x').addEventListener('pointerdown',e=>{e.stopPropagation();});
  return el;}
function tutDomHide(mode){const el=TUT.el;if(!el||el.hidden)return;const ch=TUT.chip;ch.classList.remove('on');ch.classList.add(mode==='ok'?'ok':'out');
  TUT.rings.forEach(r=>{if(mode==='ok'&&r.classList.contains('on')){const m=r.style.transform||'';r.style.transform=m+' scale(.2)';}r.classList.remove('on');if(mode==='ok')r.classList.add('ok');});
  TUT.domKey=null;clearTimeout(TUT.hideT);TUT.hideT=setTimeout(()=>{if(!TUT.cur){el.hidden=true;}},650);}
function tutRect(el){if(!el)return null;const r=el.getBoundingClientRect();return r.width>1?r:null;}
function tutInter(a,b){return a[0]<b[2]&&a[2]>b[0]&&a[1]<b[3]&&a[3]>b[1];}
function tutBlockers(){const now=performance.now();if(TUT.blk&&now-TUT.blkAt<250)return TUT.blk;const out=[],add=el=>{if(!el||!tutVis(el))return;const r=el.getBoundingClientRect();out.push([r.left-6,r.top-6,r.right+6,r.bottom+6]);};
  document.querySelectorAll('#touch .tbtn').forEach(add);['mini','btnPause','btnMap','toast','radio','wcard','joyIdle','banner'].forEach(id=>add(document.getElementById(id)));document.querySelectorAll('#hud .hud-tl,#hud .hud-w .bar-l,#hud .hud-b .chips').forEach(add);TUT.blk=out;TUT.blkAt=now;return out;}
function tutPlace(cw,ch,cands,extra){const blk=tutBlockers().concat(extra||[]);
  const sl=(SAFE.l||0)+8,sr=CW-(SAFE.r||0)-8,st=(SAFE.t||0)+8,sb=CH-(SAFE.b||0)-8;let first=null;
  for(const [x,y] of cands){const L=clamp(x-cw/2,sl,sr-cw),Tp=clamp(y,st,sb-ch),box=[L,Tp,L+cw,Tp+ch];if(!first)first=[L,Tp];if(!blk.some(b=>tutInter(box,b)))return [L,Tp];}
  return first||[sl,st];}
function tutDraw(now){const C=TUT.cur;if(!C)return;const el=tutDom();const V=C.L.view()||{};C.v=V;
  if(el.hidden){el.hidden=false;}clearTimeout(TUT.hideT);
  const ch=TUT.chip,key=C.k+'|'+(V.keys||'')+'|'+(V.text||'')+'|'+(V.hostile?1:0);
  if(TUT.domKey!==key){TUT.domKey=key;ch.querySelector('.tut-keys').innerHTML=V.keys||'';ch.querySelector('.tut-txt').innerHTML=V.text||'';ch.classList.toggle('hostile',!!V.hostile);ch.classList.remove('ok','out');}
  /* нажатые клавиши подсвечиваются — подсказка отвечает на руки игрока */
  ch.querySelectorAll('kbd[data-kk]').forEach(k=>{const c=k.dataset.kk,alt={KeyW:'ArrowUp',KeyA:'ArrowLeft',KeyS:'ArrowDown',KeyD:'ArrowRight'}[c];k.classList.toggle('lit',!!(KEYS[c]||KEYS[alt]));});
  const showChip=V.at&&V.at!=='none'&&(V.text||V.keys);
  if(showChip){const cw=ch.offsetWidth||120,chh=ch.offsetHeight||30,u=UI||1,p=G.player;let cands=[];
    if(V.at==='ship'&&p){const [X,Y]=tutSP(p.x,p.y),off=(p.r||13)*SC+18*u;cands=[[X,Y+off,0,1],[X,Y-off-chh,0,-1],[X+off+cw/2,Y-chh/2,1,0],[X-off-cw/2,Y-chh/2,-1,0]];
      if(V.avoid!==undefined){const ax=Math.cos(V.avoid),ay=Math.sin(V.avoid);cands.sort((a,b)=>(a[2]*ax+a[3]*ay)-(b[2]*ax+b[3]*ay));}}
    else if(V.at==='stick'){const f=tutStickPt(),y0=f.y-f.R-chh-18;cands=[[f.x,y0],[f.x,y0-16],[f.x-cw*.4,y0],[f.x+cw*.4,y0],[f.x,y0-36],[f.x,f.y+f.R+10]];}
    else if(V.at==='line'){const r=tutRelay();if(r&&G.bc){const [X,Y]=tutSP((r.x+G.bc.x)/2,(r.y+G.bc.y)/2);cands=[[X,Y-chh-28*u],[X,Y+28*u]];}else if(p){const [X,Y]=tutSP(p.x,p.y);cands=[[X,Y+40*u]];}}
    else if(V.at==='el'){const r=tutRect(V.el);if(r){const cx=(r.left+r.right)/2,cy=(r.top+r.bottom)/2,g=12*u;
      const up=[cx,r.top-g-chh],dn=[cx,r.bottom+g],lf=[r.left-g-cw/2,cy-chh/2],rt=[r.right+g+cw/2,cy-chh/2],ul=[r.left-cw/2,r.top-g-chh];
      cands=V.side==='up'?[up,dn,lf,rt]:(cy>CH*.55?[up,lf,rt,ul,dn]:[dn,up,lf,rt]);}}
    let extra=[];if(p&&(V.at==='ship'||V.at==='line')){const [X,Y]=tutSP(p.x,p.y),s_=(p.r||13)*SC+8;extra.push([X-s_,Y-s_,X+s_,Y+s_]);}
    if(cands.length){const [L,Tp]=tutPlace(cw,chh,cands,extra);ch.style.transform=`translate3d(${L.toFixed(1)}px,${Tp.toFixed(1)}px,0)`;ch.classList.add('on');}else ch.classList.remove('on');}
  else ch.classList.remove('on');
  const rings=V.ring||[];TUT.rings.forEach((rg,i)=>{const r=tutRect(rings[i]);if(!r){rg.classList.remove('on');return;}
    const pad=10*(UI||1),sq=/\bsq\b/.test(V.ringCls||''),w=sq?r.width+pad*2:Math.max(r.width,r.height)+pad*2,h=sq?r.height+pad*2:w;
    rg.className='tut-ring on '+(V.ringCls||'');rg.style.width=w+'px';rg.style.height=h+'px';rg.style.transform=`translate3d(${((r.left+r.right)/2-w/2).toFixed(1)}px,${((r.top+r.bottom)/2-h/2).toFixed(1)}px,0)`;});}
function tutStickPt(){const R=(typeof joyR==='function'?joyR():48),I=$('#joyIdle');if(I&&tutVis(I)){const r=I.getBoundingClientRect();return {x:(r.left+r.right)/2,y:(r.top+r.bottom)/2,R:r.width/2-5};}
  if(SET.stick==='fixed'&&typeof joyFixed==='function')return joyFixed();const left=SET.hand==='l';return {x:left?CW-SAFE.r-24-R*2.3:SAFE.l+24+R*2.3,y:CH-SAFE.b-24-R*2.3,R};}
function tutFly(n){try{const w=$('#wLom');if(!w||!tutVis(w))return;w.classList.remove('tut-flash');void w.offsetWidth;w.classList.add('tut-flash');const r=w.getBoundingClientRect();
  const f=document.createElement('div');f.className='tut-fly';f.textContent='+'+fmtN(n)+' НА СКЛАД';f.style.left=((r.left+r.right)/2)+'px';f.style.top=(r.bottom+6)+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),1200);}catch(e){}}
function tutFxOk(k){try{buzz('tap');}catch(e){}
  try{if(!AU.ctx||!SET.sfx||!AU.sfx)return;const c=AU.ctx,t=c.currentTime,f=(typeof PENTA!=='undefined'?PENTA[2]:698.46);
    for(const [m,d,v] of [[1,0,.05],[1.5,.07,.035]]){const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=f*m;g.gain.setValueAtTime(0,t+d);g.gain.linearRampToValueAtTime(v,t+d+.01);g.gain.exponentialRampToValueAtTime(.0005,t+d+.22);o.connect(g);g.connect(AU.sfx);o.start(t+d);o.stop(t+d+.25);}}catch(e){}}

/* ---------- отрисовка: мир (канва) ---------- */
function tutWorldDraw(now){const C=TUT.cur;if(!C||!C.v||!C.v.draw||!G.player)return;if(!tutCtxOk(C.L.ctx==='map'?'map':C.L.ctx==='mission'?'mission':'any'))return;
  const t=now/1000,p=G.player,u=UI||1,c=ctx;c.save();c.setTransform(DPR,0,0,DPR,0,0);c.globalCompositeOperation='source-over';
  const [PX,PY]=tutSP(p.x,p.y);const ice='#8fe9ff',amber='#ffb84d',red='#ff4f6e';
  const ringAt=(x,y,R,col,lab)=>{const [X,Y]=tutSP(x,y),q=(t*0.85)%1;c.globalAlpha=.9;c.strokeStyle=col;c.lineWidth=2;c.setLineDash([]);c.beginPath();c.arc(X,Y,R,0,TAU);c.stroke();
    c.globalAlpha=(1-q)*.7;c.beginPath();c.arc(X,Y,R+q*R*.6,0,TAU);c.stroke();c.globalAlpha=1;
    if(lab){c.font='700 11px "JetBrains Mono",monospace';c.textAlign='center';c.fillStyle=col;c.fillText(lab,X,Y-R-10*u);}return [X,Y];};
  const onScr=(X,Y,m)=>X>m&&X<CW-m&&Y>m&&Y<CH-m;
  const edge=(x,y,col,lab)=>{const [X,Y]=tutSP(x,y);if(onScr(X,Y,20))return false;if(arw61Dup(x,y))return true;const cx=CW/2,cy=CH/2,a=Math.atan2(Y-cy,X-cx),m=46*u,sl=(typeof stageL==='function'?stageL():0);
    const [ex,ey]=edgeAvoid133(clamp(cx+Math.cos(a)*CW,sl+m,CW-sl-m),clamp(cy+Math.sin(a)*CH,m+(isMob()?150:170*u),CH-m-(isMob()?150:80*u)));
    c.save();c.translate(ex,ey);c.rotate(a);c.scale(u,u);c.fillStyle=col;c.globalAlpha=.85+.15*Math.sin(t*5);c.beginPath();c.moveTo(12,0);c.lineTo(-6,-8);c.lineTo(-2,0);c.lineTo(-6,8);c.closePath();c.fill();c.restore();
    c.globalAlpha=1;c.font='700 10px "JetBrains Mono",monospace';c.textAlign='center';c.fillStyle=col;{const tl=lab+' · '+fmtAU(Math.hypot(x-p.x,y-p.y)),tx=clamp(ex-Math.cos(a)*34*u,sl+70*u,CW-sl-70*u),ty=lab61Place(tx,ey-(Math.sin(a)*22-4)*u,c.measureText(tl).width/2+4,10*u);c.lineJoin='round';c.lineWidth=4*u;c.strokeStyle='rgba(4,6,12,.92)';c.strokeText(tl,tx,ty);c.fillText(tl,tx,ty);}return true;};
  const guide=(x,y,col)=>{const a=Math.atan2(y-p.y,x-p.x),d=Math.min(300,Math.hypot(x-p.x,y-p.y)-60);if(d<40)return;const [X1,Y1]=tutSP(p.x+Math.cos(a)*36,p.y+Math.sin(a)*36),[X2,Y2]=tutSP(p.x+Math.cos(a)*d,p.y+Math.sin(a)*d);
    const g=c.createLinearGradient(X1,Y1,X2,Y2);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');c.strokeStyle=g;c.globalAlpha=.75;c.lineWidth=2;c.setLineDash([6,8]);c.lineDashOffset=-t*28;c.beginPath();c.moveTo(X1,Y1);c.lineTo(X2,Y2);c.stroke();c.setLineDash([]);c.globalAlpha=1;};
  const k=C.v.draw;
  if(k==='stash'){const s=tutShopPt();if(s){guide(s.x,s.y,amber);if(!edge(s.x,s.y,amber,'СКЛАД'))ringAt(s.x,s.y,Math.max(30,70*SC),amber,'СКЛАД');}}
  else if(k==='fire'){let tg=null,bd=1e9;for(const e of G.enemies){if(!tutHostile(e))continue;const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<bd){bd=d;tg=e;}}
    if(tg){const [X,Y]=tutSP(tg.x,tg.y),R=((tg.r||14)+10)*SC,L=R*.45;c.strokeStyle=ice;c.lineWidth=2;c.globalAlpha=.75+.25*Math.sin(t*6);c.beginPath();
      for(const [sx,sy] of [[-1,-1],[1,-1],[1,1],[-1,1]]){c.moveTo(X+sx*R,Y+sy*(R-L));c.lineTo(X+sx*R,Y+sy*R);c.lineTo(X+sx*(R-L),Y+sy*R);}c.stroke();c.globalAlpha=1;}}
  else if(k==='dash'){const T_=TUT.threat;if(T_&&T_.vx!==undefined){const a=Math.atan2(T_.vy||0,T_.vx||0)+Math.PI/2,s=Math.sin(t*6)*.5+.5;
      for(const sg of [1,-1]){const ax=Math.cos(a)*sg,ay=Math.sin(a)*sg,d0=(p.r||13)*SC+10+6*s;c.save();c.translate(PX+ax*d0,PY+ay*d0);c.rotate(Math.atan2(ay,ax));c.globalAlpha=sg>0?.85:.35;c.fillStyle=ice;c.beginPath();c.moveTo(10,0);c.lineTo(-4,-6);c.lineTo(-1,0);c.lineTo(-4,6);c.closePath();c.fill();c.restore();}c.globalAlpha=1;}}
  else if(k==='pulse'){const R=(G.st.pR||150)*SC;c.strokeStyle=amber;c.lineWidth=1.5;c.globalAlpha=.55+.25*Math.sin(t*4);c.setLineDash([8,7]);c.lineDashOffset=-t*20;c.beginPath();c.arc(PX,PY,R,0,TAU);c.stroke();c.setLineDash([]);c.globalAlpha=1;}
  else if(k==='cell'){const q=tutCell();if(q){guide(q.x,q.y,amber);if(!edge(q.x,q.y,amber,'ЯЧЕЙКА'))ringAt(q.x,q.y,16*SC+6,amber,'');}}
  else if(k==='ring'){const bc=G.bc;if(bc){const [X,Y]=tutSP(bc.x,bc.y),R=bcRing()*SC;c.strokeStyle=amber;c.lineWidth=2.5;c.globalAlpha=.55+.35*Math.sin(t*4);c.setLineDash([10,8]);c.lineDashOffset=-t*30;c.beginPath();c.arc(X,Y,R,0,TAU);c.stroke();c.setLineDash([]);c.globalAlpha=1;guide(bc.x,bc.y,amber);
      if(!edge(bc.x,bc.y,amber,'МАЯК')){c.font='700 11px "JetBrains Mono",monospace';c.textAlign='center';c.fillStyle=amber;c.fillText('КОЛЬЦО МАЯКА',X,Y-R-10*u);}}}
  else if(k==='line'){const r=tutRelay(),bc=G.bc;if(r&&bc){const [X1,Y1]=tutSP(r.x,r.y),[X2,Y2]=tutSP(bc.x,bc.y);c.strokeStyle=ice;c.lineWidth=6;c.globalAlpha=.16;c.beginPath();c.moveTo(X1,Y1);c.lineTo(X2,Y2);c.stroke();
      c.lineWidth=2;c.globalAlpha=.85;c.setLineDash([10,9]);c.lineDashOffset=-t*40;c.beginPath();c.moveTo(X1,Y1);c.lineTo(X2,Y2);c.stroke();c.setLineDash([]);
      const mx=(X1+X2)/2,my=(Y1+Y2)/2,a=Math.atan2(Y2-Y1,X2-X1),s=(p.r||13)*SC;c.save();c.translate(mx,my);c.rotate(a);c.globalAlpha=.32+.12*Math.sin(t*3);c.strokeStyle='#e6edf5';c.lineWidth=1.5;c.beginPath();c.moveTo(s*1.2,0);c.lineTo(-s*.8,-s*.75);c.lineTo(-s*.4,0);c.lineTo(-s*.8,s*.75);c.closePath();c.stroke();c.restore();
      if((r.rep||0)>0){c.globalAlpha=.9;c.strokeStyle=ice;c.lineWidth=3;c.beginPath();c.arc(PX,PY,(p.r||13)*SC+12,-Math.PI/2,-Math.PI/2+TAU*clamp(r.rep/2,0,1));c.stroke();}c.globalAlpha=1;
      edge((r.x+bc.x)/2,(r.y+bc.y)/2,ice,'ЛИНИЯ');}}
  else if(k==='patrol'){const E=TUT.patrolEv;const q=Math.sin(t*5)*.5+.5,a0=.12+.08*q;const g=c.createRadialGradient(CW/2,CH/2,Math.min(CW,CH)*.35,CW/2,CH/2,Math.hypot(CW,CH)*.6);g.addColorStop(0,'rgba(255,79,110,0)');g.addColorStop(1,`rgba(255,79,110,${a0.toFixed(3)})`);c.fillStyle=g;c.fillRect(0,0,CW,CH);
    let zx,zy;const z=tutZone();if(z){zx=z.x;zy=z.y;}
    if(zx!==undefined){let a=Math.atan2(p.y-zy,p.x-zx);if(Math.hypot(p.x-zx,p.y-zy)<30)a=-Math.PI/2;for(let i=0;i<3;i++){const ph=((t*1.4+i/3)%1),d=(p.r||13)*SC+16+ph*46;c.save();c.translate(PX+Math.cos(a)*d,PY+Math.sin(a)*d);c.rotate(a);c.globalAlpha=(1-ph)*.9;c.fillStyle=red;c.beginPath();c.moveTo(8,0);c.lineTo(-4,-6);c.lineTo(-1,0);c.lineTo(-4,6);c.closePath();c.fill();c.restore();}c.globalAlpha=1;}}
  c.restore();}
/* призрак пальца на сенсорном экране: ведёт стик по кругу */
function tutGhostDraw(now){const C=TUT.cur;if(!C||C.k!=='move'||tutInput()!=='touch'||!tutCtxOk('world'))return;const t=now/1000,f=tutStickPt(),c=ctx;c.save();c.setTransform(DPR,0,0,DPR,0,0);
  const a=t*2.2,rr=f.R*.55,x=f.x+Math.cos(a)*rr,y=f.y+Math.sin(a)*rr;c.globalAlpha=.22;c.strokeStyle='#e6edf5';c.lineWidth=1.5;c.beginPath();c.arc(f.x,f.y,f.R,0,TAU);c.stroke();
  for(let i=6;i>=0;i--){const b=a-i*.12;c.globalAlpha=.06*(7-i);c.fillStyle='#e6edf5';c.beginPath();c.arc(f.x+Math.cos(b)*rr,f.y+Math.sin(b)*rr,10-i*.6,0,TAU);c.fill();}
  c.globalAlpha=.55;c.fillStyle='#ffffff';c.beginPath();c.arc(x,y,14,0,TAU);c.fill();c.restore();}
/* карта: прожектор на точке прыжка */
function tutMapDraw(now){const C=TUT.cur;if(!C||C.k!=='jump'||G.state!=='map'||G.mapTab!=='map')return;const q=tutJumpPick();if(!q)return;const cv_=$('#mapC'),M=G.mapXY;if(!cv_||!M)return;
  const g=cv_.getContext('2d');g.save();g.setTransform(DPR,0,0,DPR,0,0);const t=now/1000,X=q.px,Y=q.py,tip=$('#mapTip'),pinned=tip&&!tip.hidden&&tip.querySelector('[data-mjump]');
  g.fillStyle='rgba(4,6,12,.35)';g.beginPath();g.rect(0,0,M.w,M.h);g.arc(X,Y,36,0,TAU,true);g.fill('evenodd');
  const ph=(t*.85)%1;g.strokeStyle='#8fe9ff';g.lineWidth=2;g.globalAlpha=.95;g.beginPath();g.arc(X,Y,15,0,TAU);g.stroke();g.globalAlpha=(1-ph)*.8;g.beginPath();g.arc(X,Y,15+ph*20,0,TAU);g.stroke();g.globalAlpha=1;
  const I=tutInput(),lab=pinned?'НАЖМИ «ПРЫЖОК»':'НАЖМИ НА ТОЧКУ',sub=I==='touch'?'ЩИПОК — МАСШТАБ':'КОЛЕСО — МАСШТАБ';
  g.font='700 12px "JetBrains Mono",monospace';g.textAlign='center';g.textBaseline='alphabetic';const below=Y<M.h-80,ly=below?Y+50:Y-58;
  const w1=g.measureText(lab).width;g.font='600 10px "JetBrains Mono",monospace';const w2=g.measureText(sub).width;const bw=Math.max(w1,w2)+28,bx=clamp(X,bw/2+6,M.w-bw/2-6);
  g.fillStyle='rgba(7,12,23,.88)';g.strokeStyle='rgba(143,233,255,.35)';g.lineWidth=1;const by=ly-17,bh=34;if(g.roundRect){g.beginPath();g.roundRect(bx-bw/2,by,bw,bh,8);g.fill();g.stroke();}else{g.fillRect(bx-bw/2,by,bw,bh);g.strokeRect(bx-bw/2,by,bw,bh);}
  g.font='700 12px "JetBrains Mono",monospace';g.fillStyle='#e6edf5';g.fillText(lab,bx,ly-1);g.font='600 10px "JetBrains Mono",monospace';g.fillStyle='#7a8ea5';g.fillText(sub,bx,ly+12);
  if(I==='touch'&&!pinned){const s=(Math.sin(t*4)*.5+.5);g.globalAlpha=.25+.3*(1-s);g.fillStyle='#ffffff';g.beginPath();g.arc(X+10,Y+12,9+s*5,0,TAU);g.fill();g.globalAlpha=1;}
  else if(I==='kbm'&&!pinned){g.save();g.translate(X+14,Y+10);g.rotate(-.35);g.fillStyle='#ffffff';g.strokeStyle='#04060c';g.lineWidth=1;g.beginPath();g.moveTo(0,0);g.lineTo(0,16);g.lineTo(4,12);g.lineTo(7,18);g.lineTo(9.5,17);g.lineTo(6.5,11);g.lineTo(11.5,11);g.closePath();g.fill();g.stroke();g.restore();}
  g.restore();}
/* кадр: после мира и HUD-канвы */
{const _mo2=mobOverlay;mobOverlay=function(now){const r=_mo2.apply(this,arguments);
  try{const dt=Math.min(.5,Math.max(0,(now-(TUT.last||now))/1000));TUT.last=now;tutTick2(dt,now);if(TUT.cur){tutWorldDraw(now);tutGhostDraw(now);}}catch(e){console.error(e);}
  return r;};}
/* при каждом входе в мир счётчик «спокойного полёта» начинается заново */
{const _ew=enterWorldAt;enterWorldAt=function(){TUT.worldT=0;TUT.lpx=null;if(TUT.cur)tutEnd('abort');return _ew.apply(this,arguments);};}

/* ---------- настройки: переключатель и «пройти заново» ---------- */
{const _rss=renderSetScreen;renderSetScreen=function(){const r=_rss.apply(this,arguments);try{const B=$('#setBody');const S=G.save;if(!B||!S)return r;const T=tutT();
  const grp=[...B.querySelectorAll('.setgrp')].pop();if(!grp)return r;const h=grp.querySelector('.cx-h2');const on=!T.off;
  const html=`<button class="tog ${on?'on':''}" data-tutk="off" role="switch" aria-checked="${on}"><span>ПОДСКАЗКИ ОБУЧЕНИЯ</span><span class="sw"><span class="sr">${on?'ВКЛ':'ВЫКЛ'}</span></span></button><div class="tutrow"><button class="wbtn" data-tutreset>ПРОЙТИ ОБУЧЕНИЕ ЗАНОВО</button></div>`;
  if(h)h.insertAdjacentHTML('afterend',html);else grp.insertAdjacentHTML('afterbegin',html);}catch(e){console.error(e);}return r;};}
document.addEventListener('click',e=>{const tg=e.target.closest('[data-tutk],[data-tutreset]');if(!tg||!G.save)return;const T=tutT();
  if(tg.dataset.tutk){const was=!T.off;T.off=was?1:0;if(!was){T.vet=0;}store(saveKey(),G.save);renderSetScreen();const b=$('[data-tutk]');if(b){b.classList.toggle('on',was);void b.offsetWidth;b.classList.toggle('on',!was);try{b.focus({preventScroll:true});}catch(er){}}}
  else{T.done={};T.seen={};T.off=0;T.vet=0;store(saveKey(),G.save);TUT.hist=[];TUT.mv=0;tg.textContent='ОБУЧЕНИЕ НАЧНЁТСЯ В ПОЛЁТЕ';tg.disabled=true;
    const b=$('[data-tutk]');if(b){b.classList.add('on');b.setAttribute('aria-checked','true');const sr=b.querySelector('.sr');if(sr)sr.textContent='ВКЛ';}}
  try{buzz('tap');}catch(er){}});
document.addEventListener('keydown',e=>{if((e.code==='ArrowLeft'||e.code==='ArrowRight')&&e.target&&e.target.matches&&e.target.matches('[data-tutk]')){e.preventDefault();e.stopPropagation();e.target.click();}},true);

