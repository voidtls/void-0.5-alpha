/* ===== 1.3.3 α «Курс без тупиков» =====
   1) ворота калибровки держатся до рывка сквозь луч: радио, бой, уход в миссию, удаление и перезагрузка их больше не снимают;
   2) «лом» и путь к складу — сразу после миссии 01, а не по дороге ко второй;
   3) у миссии 02 карта молчит; после победы в ней — подсветка кнопки карты и подпись в самой карте на 5 с.
   Обучение по-прежнему только смотрит и рисует: ни одна игровая величина не меняется. */

/* ---------- сохранение: прогресс калибровки и флаг подписи в карте переживают перезагрузку ---------- */
{const _tc=tutClean;tutClean=function(t,cleared){const o=_tc.apply(this,arguments);
  try{if(o&&t&&typeof t==='object'&&!Array.isArray(t)){if(t.calS)o.calS=1;const i=Math.round(+t.calI||0);if(i>0&&Number.isFinite(i))o.calI=Math.min(3,i);if(t.jh)o.jh=1;}}catch(e){}
  return o;};}

/* окна «после миссии»: пока открыто одно из них, калибровка ждёт */
function tut133Window(){const T=tutT();if(!T)return false;
  for(const k of ['lom','stash','map']){if(T.done[k])continue;try{if(TUT_L[k].when())return true;}catch(e){}}return false;}

/* ---------- 1. калибровка: повтор до успеха ---------- */
{const _cn=tutCalNew;tutCalNew=function(){const K=_cn.apply(this,arguments);const T=tutT(),p=G.player;const i0=Math.min(3,Math.round(+(T&&T.calI)||0));
  if(i0>0&&K&&p){for(let j=0;j<i0;j++)K.pts[j].done=1;K.i=i0;
    if(i0>=3){/* кольца уже пройдены — ворота ставим поближе, по курсу */let gx=p.x+K.dx*460,gy=p.y+K.dy*460;
      for(const r of G.rocks||[]){if(!r.alive)continue;const d=Math.hypot(r.x-gx,r.y-gy),need=(r.r||20)+80;if(d<need){gx+=-K.dy*(need-d+10);gy+=K.dx*(need-d+10);}}
      K.gate.x=gx;K.gate.y=gy;K.gateOn=performance.now();}}
  return K;};}
{const L=TUT_L.calib,_s=L.step,_v=L.view;
  L.when=function(){const S=G.save,T=tutT(),p=G.player;if(!T||T.done.calib||T.vet||G.prologue||TUT.worldT<1.2||!p)return false;
    if((S.cleared||0)>0&&!T.calS)return false;/* после миссии — только тем, кто её уже начинал */
    if(sectorIdx(p.x,p.y)>1)return false;if(tut133Window())return false;return true;};
  L.step=function(dt,now){const T=tutT(),p=G.player;
    if(T&&!T.calS){T.calS=1;tutSave();}
    const K=TUT.cal;
    if(K&&p){const tgt=K.i<3?K.pts[K.i]:K.gate,d=Math.hypot(p.x-tgt.x,p.y-tgt.y);
      if(d>1800){K.far133=(K.far133||0)+dt;K.far=0;
        if(K.far133>8){/* улетел — трасса едет к игроку, пройденное сохраняется */TUT.cal=tutCalNew();TUT.cal.far133=0;}}
      else K.far133=0;
      K.far=0;}
    const r=_s.apply(this,arguments);
    const K2=TUT.cal;if(T&&K2&&K2.i>(T.calI||0)){T.calI=Math.min(3,K2.i);tutSave();}
    return r;};
  L.view=function(){const K=TUT.cal;const V=_v.apply(this,arguments)||{};if(!K)return V;
    if(K.i>=3&&performance.now()-K.gate.fail<1800){V.text='<b>БЕЗ РЫВКА</b> · ЕЩЁ РАЗ';V.hostile=true;}
    return V;};}
/* перезапуски калибровки не съедают лимит «6 подсказок за 10 минут» */
{const _ts=tutStart;tutStart=function(k){const r=_ts.apply(this,arguments);if(k==='calib'){if(TUT.calSeen133&&TUT.hist.length)TUT.hist.pop();TUT.calSeen133=1;}return r;};}
/* призрак рывка показывает проход со стороны игрока: ворота проходятся в обе стороны */
{const _cd=tutCalDraw;tutCalDraw=function(now){const K=TUT.cal,p=G.player;let flip=false;
  if(K&&p&&K.i>=3){const s=(p.x-K.gate.x)*K.dx+(p.y-K.gate.y)*K.dy;if(s>0){flip=true;K.dx=-K.dx;K.dy=-K.dy;}}
  try{return _cd.apply(this,arguments);}finally{if(flip){K.dx=-K.dx;K.dy=-K.dy;}}};}

/* ---------- 2. «лом» и «склад» — сразу после миссии 01 ---------- */
const TUT133={win:90};
/* 1.3.3 α (вторая правка): эти уроки идут по событию «вернулся из миссии» и не ждут тишины, паузы между подсказками
   и лимита «6 за 10 минут» — в миссии 01 обучение успевает показать 5–7 подсказок, и раньше лом ждал по 10 минут */
{const L=TUT_L.lom,_v=L.view;L.fight=true;
  L.when=function(){const S=G.save;return (S.cleared||0)===1&&TUT.worldT>.8;};
  L.view=function(){const S=G.save;if((S.carry||0)>0)return _v.apply(this,arguments);const el=$('#wLom');
    return {keys:'',text:'<i></i>НАГРАДА <span class="sep">—</span> <b>НА СКЛАДЕ</b>',at:'el',el,ring:[el],ringCls:'amber sq'};};}
{const L=TUT_L.stash,_v=L.view;L.dur=0;L.fight=true;/* дорожка горит, пока игрок не долетит до склада (или не закроет её «✕») */
  L.when=function(){const S=G.save,p=G.player;if((S.cleared||0)!==1||!tutDoneQ('lom'))return false;
    const s=tutShopPt();if(!s||!p)return false;return Math.hypot(s.x-p.x,s.y-p.y)>240;};
  L.view=function(){const S=G.save,V=_v.apply(this,arguments)||{};if(!((S.carry||0)>0))V.text='<i class="a"></i>НА СКЛАД <span class="sep">·</span> <b>УЛУЧШЕНИЯ</b>';return V;};}
/* приоритет: окна «после миссии» идут раньше калибровки и карточки объекта */
{const order=['patrol','dash','pulse','fire','cell','line','lom','stash','map','calib','move','act','energy','jump'];
  const rest=TUT_PRI.filter(k=>!order.includes(k));TUT_PRI.length=0;order.concat(rest).forEach(k=>TUT_PRI.push(k));}
/* склад засчитан: долетел до мастерской, пока горит дорожка, или открыл её */
{const _os=openShop;openShop=function(){const r=_os.apply(this,arguments);try{if(G.state==='shop'&&(G.save.cleared||0)>=1)tutDone('stash');}catch(e){}return r;};}
/* не навязываться: дорожку проигнорировали — больше не показываем, но и галочку не ставим */
{const _e=tutEnd;tutEnd=function(how){const C=TUT.cur,T=tutT();
  if(C&&T&&C.k==='stash'&&how==='miss'&&!T.done.stash){TUT.cur=null;T.done.stash=1;tutSave();TUT.gap=4;tutDomHide('out');return;}
  const r=_e.apply(this,arguments);
  /* «лом» → «склад» идут одной фразой: дорожка появляется сразу за кольцом на счётчике */
  if(C&&C.k==='lom'&&how==='ok'&&T&&(G.save.cleared||0)===1&&!T.done.stash)TUT.gap=.6;
  return r;};}

/* ---------- 3. карта — после миссии 02; прожектор прыжка убран ---------- */
{const L=TUT_L.map;L.dur=14;L.fight=true;L.when=function(){const S=G.save;return (S.cleared||0)===2&&TUT.worldT>.8&&TUT.worldT<TUT133.win;};}
TUT_L.jump.when=function(){return false;};

/* наблюдения: склад рядом, калибровка уступает окнам «после миссии» */
{const _t=tutTick2;tutTick2=function(dt,now){
  try{const S=G.save,T=tutT(),p=G.player;
    /* «лом» → «склад» → «карта»: стартуют сразу, вытесняя любую другую подсказку (кроме кнопки «действие» у самой мастерской) */
    if(T&&tutOn()&&G.state==='world'&&G.world&&p&&!G.prologue&&!(TUT.cur&&(['lom','stash','map'].includes(TUT.cur.k)||TUT.cur.k==='act'&&T.done.lom))){
      for(const k of ['lom','stash','map']){if(T.done[k])continue;if(k==='stash'&&TUT.gap>0)continue;let ok=false;try{ok=TUT_L[k].when();}catch(e){}
        if(ok){if(TUT.cur)tutEnd('abort');TUT.gap=0;tutStart(k);if(TUT.hist.length)TUT.hist.pop();break;}}}
    const C=TUT.cur;
    if(T&&tutOn()&&C&&C.k==='stash'&&G.state==='world'&&p){const s=tutShopPt();if(s&&Math.hypot(s.x-p.x,s.y-p.y)<240)tutDone('stash');}
    if(T&&tutOn()&&C&&C.k==='calib'&&G.state==='world'&&tutCalm()&&tut133Window())tutEnd('abort');
    /* трасса живёт сама: пока подпись спрятана (радио, бой, другой урок), кольца и ворота засчитываются и рисуются */
    if(tut133CalLive()&&!(TUT.cur&&TUT.cur.k==='calib')){const keep=TUT.cur;TUT.cur={k:'calib',L:TUT_L.calib,t:0,shown:0,step:null,ghost:1};
      try{TUT_L.calib.step(dt,now);}finally{if(TUT.cur&&TUT.cur.ghost)TUT.cur=keep;else if(TUT.cur===null)TUT.cur=keep&&!T.done[keep.k]?keep:null;}}}catch(e){}
  return _t.apply(this,arguments);};}

function tut133CalLive(){const T=tutT(),p=G.player;if(!T||!tutOn()||T.done.calib||T.vet||!T.calS||!TUT.cal||!p)return false;
  return G.state==='world'&&G.world&&!G.prologue&&sectorIdx(p.x,p.y)<=1;}
{const _mo=mobOverlay;mobOverlay=function(now){const r=_mo.apply(this,arguments);
  try{const C=TUT.cur;if(tut133CalLive()&&!(C&&(C.k==='calib'||C.k==='lom'||C.k==='stash'))){const c=ctx;c.save();c.setTransform(DPR,0,0,DPR,0,0);try{tutCalDraw(now);}finally{c.restore();}}}catch(e){console.error(e);}
  return r;};}

/* ---------- подпись в карте: одно правило, без цели ---------- */
const JH133={on:false,at:0,t1:0,t2:0,dur:5000};
function jh133Dom(){const box=document.querySelector('#sMap .mapbox');if(!box)return null;let el=$('#mapHint');
  if(!el){el=document.createElement('div');el.id='mapHint';el.setAttribute('role','status');el.setAttribute('aria-live','polite');
    el.innerHTML='<div class="mh-band"><span class="mh-l">НАЖМИ НА ТОЧКУ — ПРЫЖОК</span><span class="mh-s"><i aria-hidden="true"></i>БЕЛЫЕ КОЛЬЦА — ТОЧКИ ПРЫЖКА</span><span class="mh-t" aria-hidden="true"></span></div>';}
  if(el.parentNode!==box)box.appendChild(el);return el;}
function jh133Want(){const S=G.save,T=tutT();if(!S||!T||T.jh||T.vet||!tutOn())return false;if((S.cleared||0)<2)return false;
  if(G.state!=='map'||G.mapTab!=='map'||tutInput()==='pad')return false;if(jumpDenyReason(null))return false;return !!(G.mapPts&&G.mapPts.length);}
function jh133Show(){const el=jh133Dom();if(!el)return;JH133.on=true;JH133.at=performance.now();el.style.setProperty('--mh-d',JH133.dur+'ms');
  el.classList.remove('on','out');void el.offsetWidth;el.classList.add('on');clearTimeout(JH133.t2);JH133.t2=setTimeout(()=>jh133Hide(true),JH133.dur);}
function jh133Hide(full){const el=$('#mapHint');clearTimeout(JH133.t1);clearTimeout(JH133.t2);if(!JH133.on){if(el)el.classList.remove('on');return;}
  const seen=full||performance.now()-JH133.at>=2500;JH133.on=false;if(el){el.classList.remove('on');el.classList.add('out');}
  if(seen){const T=tutT();if(T&&!T.jh){T.jh=1;tutSave();}}}
{const _om=openMap;openMap=function(){const was=G.state;const r=_om.apply(this,arguments);
  try{if(was!=='map'&&G.state==='map'){clearTimeout(JH133.t1);JH133.t1=setTimeout(()=>{try{if(jh133Want())jh133Show();}catch(e){}},650);}}catch(e){}return r;};}
{const _cm=closeMap;closeMap=function(){const was=G.state==='map';const r=_cm.apply(this,arguments);try{if(was&&G.state!=='map')jh133Hide(false);}catch(e){}return r;};}
{const _mt=mapTab;mapTab=function(t){const r=_mt.apply(this,arguments);try{if(t!=='map'&&JH133.on)jh133Hide(false);}catch(e){}return r;};}
/* прыжок совершён — подпись больше не нужна */
/* ARCH·86 · объединённый слой tutEmit: 2 слоя (строки 1.5.25: 14365, 14697) в исходном порядке исполнения */
{const _p86=tutEmit;tutEmit=function(ev_862){const ev_861=arguments[0];if(ev_862==='jump'){try{const T=tutT();if(T&&!T.jh){T.jh=1;tutSave();}if(JH133.on)jh133Hide(true);}catch(e){}}
  if(ev_861==='dash')TUT.lastDashAt=performance.now();
  const r86=_p86.apply(this,arguments);return r86;};}
/* пока подпись на экране — все белые кольца пульсируют одинаково: ни одно не выделено */
/* ARCH·86 · объединённый слой tutMapDraw: 2 слоя (строки 1.5.25: 14416, 14699) в исходном порядке исполнения */
{const _p86=tutMapDraw;tutMapDraw=function(now_862){const now_861=arguments[0];const C_861=TUT.cur;if(C_861&&C_861.k==='jump'&&G.state==='map'&&G.mapTab==='map'&&G.mapXY&&G.player){try{const q=tutJumpPick();const M=G.mapXY,g=$('#mapC').getContext('2d');if(q){g.save();g.setTransform(DPR,0,0,DPR,0,0);
    const sx=M.X(G.player.x),sy=M.Y(G.player.y),t=now_861/1000;g.strokeStyle='rgba(143,233,255,.55)';g.lineWidth=1.5;g.setLineDash([4,6]);g.lineDashOffset=-t*24;g.beginPath();g.moveTo(sx,sy);g.lineTo(q.px,q.py);g.stroke();g.setLineDash([]);
    const f=(t*.6)%1;g.fillStyle='#8fe9ff';g.globalAlpha=.9;g.beginPath();g.arc(sx+(q.px-sx)*f,sy+(q.py-sy)*f,2.5,0,TAU);g.fill();g.restore();}}catch(e){}}
  const r86=_p86.apply(this,arguments);
  try{if(JH133.on&&G.state==='map'&&G.mapTab==='map'&&G.mapPts){const cv=$('#mapC');if(cv){const g=cv.getContext('2d'),t=now_862/1000,q=(t*.9)%1,w=cv.clientWidth,h=cv.clientHeight;
    g.save();g.setTransform(DPR,0,0,DPR,0,0);g.strokeStyle='#ffffff';
    for(const p of G.mapPts){if(p.px<-20||p.px>w+20||p.py<-20||p.py>h+20)continue;g.globalAlpha=(1-q)*.55;g.lineWidth=1.5;g.beginPath();g.arc(p.px,p.py,13+q*16,0,TAU);g.stroke();}
    g.restore();}}}catch(e){}return r86;};}

/* стрелки обучения у края экрана (например «СКЛАД · 4 а.е.») на телефоне обходят кнопки «ЗАРЯД», «КАРТА», «РЫВОК» */
const EA133={at:0,r:[]};
function edgeAvoid133(x,y){if(!isMob())return [x,y];const now=performance.now();
  if(now-EA133.at>250){EA133.at=now;EA133.r=[...document.querySelectorAll('#touch .tbtn')].filter(tutVis).map(b=>{const q=b.getBoundingClientRect();return [q.left-70,q.top-30,q.right+70,q.bottom+24];});}
  for(let n=0;n<4;n++){const hit=EA133.r.find(q=>x>q[0]&&x<q[2]&&y>q[1]&&y<q[3]);if(!hit)break;
    if(hit[0]-6>CW*.55)x=hit[0]-6;else y=hit[1]-6;}
  return [clamp(x,46,CW-46),clamp(y,46,CH-46)];}

/* пока склад не посещён, стрелка «МИССИЯ 02» у края экрана не зовёт дальше: сначала склад, потом — путь ко второй миссии */
function tut133HoldNext(){try{const S=G.save,T=tutT();return !!(S&&T&&tutOn()&&!T.vet&&(S.cleared||0)===1&&!T.done.stash);}catch(e){return false;}}

/* ===== 1.3.4 α «Дорога домой» =====
   1) после миссии 01 через секунду — склад: кольцо на счётчике лома, дорожка и кольцо на самом складе, стрелка «СКЛАД» вместо «МИССИЯ 02».
      Подсказка держится, пока игрок не долетит до склада; радио, баннер и тосты её не гасят. Только потом путь ведёт ко второй миссии;
   2) импульс предлагается только в бою миссии 02 и дальше, когда враги рядом — не в секторе и не у склада;
   3) склад и «Хранилище корпусов» всегда на карте, даже под туманом. */

/* ---------- 1. дом после миссии 01 ---------- */
function tut134Pending(){try{const S=G.save,T=tutT();return !!(S&&T&&tutOn()&&!T.vet&&!T.off&&(S.cleared||0)===1&&!T.done.stash);}catch(e){return false;}}
/* стрелка у края экрана: пока склад не посещён — «СКЛАД», не «МИССИЯ 02» (когда горит дорожка, стрелку рисует сам урок) */
function tut134Home(){if(TUT.cur&&TUT.cur.k==='stash')return null;const s=tutShopPt();return s?{x:s.x,y:s.y,label:'СКЛАД',col:'#ffb84d'}:null;}
TUT_L.lom.when=function(){return false;};/* «лом» теперь часть одного шага «домой» — кольцо на счётчике загорается вместе с дорожкой */
{const L=TUT_L.stash,_v=L.view;L.dur=0;L.fight=true;/* радио, баннер, тост её не снимают */
  L.when=function(){const p=G.player;if(!tut134Pending()||!p||TUT.worldT<.9)return false;if(tutNearFoes(600)>0||p.hp<(G.st&&G.st.maxHp||100)*.35)return false;/* бой свят: стартуем в тишине, радио и баннер не мешают */const s=tutShopPt();if(!s)return false;return Math.hypot(s.x-p.x,s.y-p.y)>240;};
  L.view=function(){const S=G.save,V=_v.apply(this,arguments)||{},el=$('#wLom');
    V.text=(S.carry||0)>0?'<i class="a"></i>ЛОМ <b>НА СКЛАД</b>':'<i class="a"></i>НАГРАДА <span class="sep">—</span> <b>НА СКЛАДЕ</b>';
    if(el&&tutVis(el)){V.ring=[el];V.ringCls='amber sq';}return V;};}
/* «склад» — первый в очереди после боевых: карточка объекта у миссии 01 его не перебивает */
{const order=['patrol','dash','pulse','fire','cell','line','stash','lom','map','calib','move','act','energy','jump'];
  const rest=TUT_PRI.filter(k=>!order.includes(k));TUT_PRI.length=0;order.concat(rest).forEach(k=>TUT_PRI.push(k));}
{const L=TUT_L.act,_w=L.when;L.when=function(){if(tut134Pending()&&!(G.card&&G.card.kind==='shop'))return false;return _w.apply(this,arguments);};}
{const _t=tutTick2;tutTick2=function(dt,now){
  try{const C=TUT.cur,T=tutT();
    if(C&&C.k==='stash'&&T){
      /* ушёл в миссию 02, не заходя на склад, — дорога домой закрыта без галочки */
      if(!tut134Pending()&&!T.done.stash&&(G.save.cleared||0)>=2){TUT.cur=null;tutDomHide('out');T.done.stash=1;tutSave();}
      /* патруль важнее: уступаем, после боя дорожка вернётся */
      else if(G.state==='world'&&!T.done.patrol&&TUT_L.patrol.when())tutEnd('abort');}
    /* долетел до склада — визит засчитан, даже если дорожку в этот момент перебил патруль или карта */
    if(tut134Pending()&&G.state==='world'&&G.player){const s=tutShopPt(),p=G.player;if(s&&Math.hypot(s.x-p.x,s.y-p.y)<240)tutDone('stash');}
    /* дорожка гаснет ровно в момент визита: так «ЛОМ» тоже засчитан */
    if(T&&T.done.stash&&!T.done.lom&&(G.save.cleared||0)>=1){T.done.lom=1;tutSave();}}catch(e){}
  return _t.apply(this,arguments);};}
/* в 1.3.3 игнор дорожки 45 с закрывал урок — теперь он держится до визита */
{const _e=tutEnd;tutEnd=function(how){const C=TUT.cur;if(C&&C.k==='stash'&&how==='miss'&&tut134Pending()){TUT.cur=null;TUT.gap=4;tutDomHide('out');return;}return _e.apply(this,arguments);};}

/* ---------- 2. импульс — только в бою миссии 02+ ---------- */
function tut134PulseOk(R){const p=G.player;return !!p&&G.state==='play'&&!G.world&&(G.m||0)>=2&&tutNearFoes(R)>=1;}
{const L=TUT_L.energy,_w=L.when;L.ctx='mission';L.fight=true;/* показывается именно в бою */L.when=function(){if(!tut134PulseOk(420))return false;return _w.apply(this,arguments);};}
{const L=TUT_L.pulse,_w=L.when;L.ctx='mission';L.when=function(){if(!tut134PulseOk(420))return false;return _w.apply(this,arguments);};}

