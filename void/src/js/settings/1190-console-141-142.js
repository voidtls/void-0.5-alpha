/* ===== 1.4.1 α «Пульт»: настройки и пауза =====
   Настройки: пять вкладок, закреплённая шапка с «ГОТОВО», пояснение под каждой строкой, мёртвые на ПК настройки скрыты,
   зависимые строки приглушаются, прицел «МЫШЬ / АВТО», справка «КЛАВИШИ», сброс настроек к стандартным.
   Пауза: сводка партии на ПК и телефоне (сектор или миссия, цифры, цель или мастерство) и быстрые «МУЗЫКА» / «ЗВУКИ». */
const TABS63=[['snd','ЗВУК'],['ctl','УПРАВЛЕНИЕ'],['scr','ЭКРАН'],['acc','ДОСТУПНОСТЬ'],['game','ИГРА']];
const S63={tab:null,rsT:0};
function tab63(){const t=S63.tab||SET.setTab;return TABS63.some(x=>x[0]===t)?t:'snd';}
const NOTE63={
  amb:'Фоновая музыка сектора, миссий и меню.',sfx:'Рывок, импульс, попадания и щелчки интерфейса.',
  vol:'',svol:'',
  btnSize:'Размер кнопок «РЫВОК», «ИМП» и «ДЕЙСТВИЕ».',btnAlpha:'Насколько кнопки просвечивают поверх боя.',stickAlpha:'Насколько просвечивает стик.',
  hand:'Кнопки — под большой палец этой руки, стик — под другой.',stick:'Плавающий появляется там, где коснулись; закреплённый всегда на одном месте.',
  dashSwipe:'Быстрый свайп по экрану — рывок в ту сторону.',oneHand:'Резкий взмах стиком — рывок: можно лететь и уворачиваться одним пальцем.',haptics:'Короткая вибрация на рывок, импульс и попадания.',
  fsMode:'«При полёте» — полный экран включается, когда вы в секторе или миссии.',orient:'Повернуть игру можно и без поворота телефона.',
  zoom:'«Крупнее» — камера ближе, «Дальше» — видно больше поля боя.',uiSize:'Размер полос, кнопок и подписей HUD.',
  quality:'«Авто» сама снижает частицы и чёткость, если телефон не успевает.',fps:ARCH.fc27?'30 — дольше держит батарея. 60 — ровно 60 кадров. Без ограничения — сколько успевает экран (прежний режим «60»). Скорость игры одинаковая.':'30 кадров — дольше держит батарея, 60 — плавнее.',
  textScale:'Размер всех надписей: меню, подсказки, радио.',fxl:'Частицы, свечение, следы корпусов. «Меньше» — вдвое тише, «Выкл» — без них.',
  shake:'Тряска камеры от взрывов и ударов.',softInv:'Некоторые враги на 2 с меняют управление местами. Вместо этого — короткое замедление.',
  noErase:'Поздние враги «стирают» части интерфейса. Вместо исчезновения — полупрозрачность.',
  tutk:'Короткие подсказки в полёте для тех, кто только начинает.',radio:'Сюжетные переговоры в полёте. Выключите — и они не будут прерывать бой, но часть истории пропадёт.'};
const KEYS63=[['W A S D · стрелки','полёт'],['ПРОБЕЛ','рывок'],['E · SHIFT','импульс'],['Q · держать','заряд'],['F','действие у объекта'],['M · TAB','карта'],['J','журналы на карте'],['T','прицел: мышь ↔ авто'],['ESC · P','пауза']];
function keys63(){return `<div class="setrow keys63"><div class="eyebrow">КЛАВИШИ</div><div class="kgrid63">${KEYS63.map(([k,a])=>`<span class="k63">${k.split(' · ').map(x=>`<kbd>${x}</kbd>`).join('<i>·</i>')}</span><span class="a63">${a}</span>`).join('')}</div></div>`;}
function aim63(){return `<div class="setrow" id="aim63"><div class="eyebrow">ПРИЦЕЛ</div><div class="seg"><button data-aim63="1" class="${SET.manual?'on':''}">МЫШЬ</button><button data-aim63="0" class="${SET.manual?'':'on'}">АВТО</button></div></div>`;}
function rset63(){const arm=S63.rsT&&performance.now()-S63.rsT<4000;return `<div class="setrow rset63"><div class="eyebrow">СТАНДАРТНЫЕ НАСТРОЙКИ</div><div><button class="wbtn${arm?' arm63':''}" data-rset63>${arm?'НАЖМИТЕ ЕЩЁ РАЗ — ВЕРНУТЬ':'ВЕРНУТЬ СТАНДАРТНЫЕ'}</button></div><p class="snote">Звук, управление и экран — как при первом запуске. Прогресс, скины и обучение не меняются.</p></div>`;}
/* шапка и вкладки — один раз, вне тела настроек (оно перерисовывается при каждом щелчке) */
function head63(){const sec=$('#sSet');if(!sec)return;const wrap=sec.querySelector('.wrap');if(!wrap||wrap.querySelector('.sethead63'))return;const h2=wrap.querySelector('h2');
  const hd=document.createElement('div');hd.className='sethead63';hd.innerHTML=`<div class="sh-top"></div><div class="maptabs settabs63" role="tablist">${TABS63.map(([k,n])=>`<button data-tab63="${k}" role="tab">${n}</button>`).join('')}</div>`;
  wrap.insertBefore(hd,wrap.firstChild);const top=hd.querySelector('.sh-top');if(h2)top.appendChild(h2);top.insertAdjacentHTML('beforeend','<button class="btn primary" id="bSetDone63">ГОТОВО <kbd>ESC</kbd></button>');}
function layout63(){const B=$('#setBody');if(!B||G.state!=='settings')return;head63();$('#sSet').classList.add('tabs63');
  const tch=touchMode||isMob(),desk=!tch;const used=new Set(),T={snd:[],ctl:[],scr:[],acc:[],game:[]};
  const rowOf=el=>el?(el.closest('.setrow')||el.closest('.tutrow')||el.closest('label.vol')||el):null;/* ползунок едет вместе со своей подписью */
  const put=(tab,sel,nk,opt)=>{const el=typeof sel==='string'?B.querySelector(sel):sel;if(!el)return null;const r=rowOf(el);if(used.has(r))return null;used.add(r);const w=document.createElement('div');w.className='srow63'+(opt&&opt.cls?' '+opt.cls:'');if(nk)w.dataset.n63=nk;
    w.appendChild(r);const n=opt&&opt.note!==undefined?opt.note:NOTE63[nk];if(n)w.insertAdjacentHTML('beforeend',`<p class="snote">${n}</p>`);T[tab].push(w);return w;};
  /* ЗВУК */
  put('snd','.tog[data-k="amb"]','amb');const vA=put('snd','[data-vol]','vol');put('snd','.tog[data-k="sfx"]','sfx');const vS=put('snd','[data-svol]','svol');
  B.querySelectorAll('p.note').forEach(p=>{if(/беззвучн/i.test(p.textContent))put('snd',p,'',{note:''});});
  if(vA&&!SET.amb){vA.classList.add('dis63');vA.insertAdjacentHTML('beforeend','<p class="snote why63">МУЗЫКА ВЫКЛЮЧЕНА</p>');}
  if(vS&&!SET.sfx){vS.classList.add('dis63');vS.insertAdjacentHTML('beforeend','<p class="snote why63">ЗВУКИ ВЫКЛЮЧЕНЫ</p>');}
  /* УПРАВЛЕНИЕ */
  const man=B.querySelector('.tog[data-k="manual"]');if(man){used.add(man);man.remove();}
  if(desk){const d=document.createElement('div');d.innerHTML=aim63();put('ctl',d.firstElementChild,'aim',{note:'Мышь — корабль стреляет туда, где курсор. Авто — сам целится в ближайшего врага. В полёте переключает клавиша T.'});
    const k=document.createElement('div');k.innerHTML=keys63();put('ctl',k.firstElementChild,'keys',{note:''});}
  for(const s of ['btnSize','btnAlpha','stickAlpha','hand','stick'])put('ctl',`[data-seg="${s}"]`,s);
  for(const s of ['dashSwipe','oneHand','haptics'])put('ctl',`.tog[data-k="${s}"]`,s);
  /* ЭКРАН */
  put('scr','[data-seg="fsMode"]','fsMode');put('scr','#fsNote','',{note:''});put('scr','[data-fshint]','',{note:''});put('scr','[data-seg="orient"]','orient');
  for(const s of ['zoom','quality','fps']){const el=B.querySelector(`[data-seg="${s}"]`);if(!el)continue;if(desk&&!(s==='fps'&&ARCH.fc27)){const r=rowOf(el);used.add(r);r.remove();}else put('scr',el,s);}/* ARCH·90b: «КАДРЫ» — и на ПК */
  put('scr','[data-seg="uiSize"]','uiSize');
  /* ДОСТУПНОСТЬ */
  put('acc','[data-seg="textScale"]','textScale');put('acc','[data-fxl]','fxl');const sh=put('acc','[data-seg="shake"]','shake');
  if(sh&&!SET.fx){sh.classList.add('dis63');sh.insertAdjacentHTML('beforeend','<p class="snote why63">РАБОТАЕТ ПРИ ВКЛЮЧЁННЫХ ЭФФЕКТАХ</p>');}
  put('acc','.tog[data-k="softInv"]','softInv');put('acc','.tog[data-k="noErase"]','noErase');
  /* ИГРА */
  put('game','[data-tutk]','tutk');put('game','[data-tutreset]','',{note:''});put('game','.tog[data-k="radio"]','radio');
  {const d=document.createElement('div');d.innerHTML=rset63();put('game',d.firstElementChild,'rset',{note:''});}
  /* всё, что не разложено (сброс прогресса, код сохранения, отладка) — в «ИГРУ», ничего не теряем */
  [...B.querySelectorAll('.setgrp')].forEach(g=>{[...g.children].forEach(ch=>{if(ch.classList.contains('cx-h2')||used.has(ch))return;if(ch.querySelector&&[...used].some(u=>ch.contains(u)))return;put('game',ch,'',{note:''});});});
  /* сборка */
  const cur=tab63();B.innerHTML='';for(const [k,n] of TABS63){const g=document.createElement('div');g.className='setgrp tab63';g.dataset.tab63=k;g.hidden=k!==cur;T[k].forEach(w=>g.appendChild(w));B.appendChild(g);}
  document.querySelectorAll('#sSet [data-tab63]').forEach(b=>{if(b.tagName==='BUTTON'){const on=b.dataset.tab63===cur;b.classList.toggle('on',on);b.setAttribute('aria-selected',on);}});}
function tabGo63(k){S63.tab=k;SET.setTab=k;try{saveSet();}catch(e){}const B=$('#setBody');if(!B)return;B.querySelectorAll('.tab63').forEach(g=>g.hidden=g.dataset.tab63!==k);
  document.querySelectorAll('#sSet button[data-tab63]').forEach(b=>{const on=b.dataset.tab63===k;b.classList.toggle('on',on);b.setAttribute('aria-selected',on);if(on)try{b.scrollIntoView({block:'nearest',inline:'nearest'});}catch(e){}});
  const sc=$('#sSet');if(sc)sc.scrollTop=0;}
/* ARCH·86 · объединённый слой renderSetScreen: 3 слоя (строки 1.5.25: 14438, 14489, 15095) в исходном порядке исполнения */
{const _p86=renderSetScreen;renderSetScreen=function(){const r86=_p86.apply(this,arguments);
  try{sfxVolInject($('#setBody'),'svol-sSet');}catch(e){}
  try{opInject($('#setBody'));}catch(e){}
  try{layout63();}catch(e){console.error(e);}return r86;};}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('button[data-tab63]');if(t){tabGo63(t.dataset.tab63);try{buzz('tap');}catch(er){}return;}
  const a=e.target.closest&&e.target.closest('[data-aim63]');if(a){SET.manual=a.dataset.aim63==='1';saveSet();updateCursor();renderSetScreen();try{buzz('tap');}catch(er){}return;}
  const d=e.target.closest&&e.target.closest('#bSetDone63');if(d){closeSettings();return;}
  const rs=e.target.closest&&e.target.closest('[data-rset63]');if(rs){const now=performance.now();if(!(S63.rsT&&now-S63.rsT<4000)){S63.rsT=now;renderSetScreen();setTimeout(()=>{if(G.state==='settings')renderSetScreen();},4100);return;}
    S63.rsT=0;const keep={fsHintShown:SET.fsHintShown,setTab:SET.setTab};for(const k in SET_DEF)SET[k]=SET_DEF[k];Object.assign(SET,keep);saveSet();try{audioInit();applyAudio();}catch(er){}try{if(typeof sfxVolApply==='function')sfxVolApply();}catch(er){}
    applySettings();try{opApply();}catch(er){}updateCursor();renderSettings();try{banner('НАСТРОЙКИ','СТАНДАРТНЫЕ');}catch(er){}}});
document.addEventListener('keydown',e=>{const t=e.target;if(!(t&&t.matches&&t.matches('button[data-tab63]')))return;if(e.code!=='ArrowLeft'&&e.code!=='ArrowRight')return;e.preventDefault();e.stopPropagation();
  const i=TABS63.findIndex(x=>x[0]===t.dataset.tab63),j=(i+(e.code==='ArrowRight'?1:-1)+TABS63.length)%TABS63.length;tabGo63(TABS63[j][0]);const nb=$(`#sSet button[data-tab63="${TABS63[j][0]}"]`);if(nb)nb.focus();},true);

/* ---------- пауза: сводка и быстрый звук ---------- */
const QIC63={amb:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 12V3.5l7-1.5V10" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="4.5" cy="12" r="1.8" fill="currentColor"/><circle cx="11.5" cy="10.5" r="1.8" fill="currentColor"/></svg>',
  sfx:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10L5 10H2z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M11.5 5.5c1 1.4 1 3.6 0 5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'};
function quick63(){return ['amb','sfx'].map(k=>`<button class="q63${SET[k]?' on':''}" data-q63="${k}" aria-pressed="${!!SET[k]}">${QIC63[k]}<span>${k==='amb'?'МУЗЫКА':'ЗВУКИ'}</span><b>${SET[k]?'ВКЛ':'ВЫКЛ'}</b></button>`).join('');}
function mast63(){const M=typeof MASTERY!=='undefined'&&MASTERY[G.m-1];if(!M||!G.mc)return '';let ok=false;try{ok=!!M.ok();}catch(e){}
  return `<div class="pz-m${ok?' ok':''}"><span>МАСТЕРСТВО</span>${M.t}<b>${ok?'✓ ВЫПОЛНЯЕТСЯ':'· ПОКА НЕТ'}</b></div>`;}
function info63(){const S=G.save,p=G.player;const sep='<i>·</i>';
  if(G.pausedWorld&&S&&p){let tg=null;try{tg=G.course?{x:G.course.x,y:G.course.y,label:'КУРС · '+G.course.label}:(typeof tut133HoldNext==='function'&&tut133HoldNext()&&typeof tutShopPt==='function'&&tutShopPt()?Object.assign({label:'СКЛАД'},tutShopPt()):nextTarget());}catch(e){}
    const lom=fmtN(S.lom||0)+(S.carry?` <em>+${fmtN(S.carry)}</em>`:''),lv=S.pilot&&S.pilot.lvl||1;
    return `<div class="pz-t">${sectorName(p.x,p.y)}</div><div class="pz-n"><span>МИССИИ <b>${doneCount()}/${NM}</b></span>${sep}<span>ЛОМ <b>${lom}</b></span>${sep}<span>ПИЛОТ <b>УР. ${lv}</b></span></div>`+
      (tg?`<div class="pz-g"><span>ЦЕЛЬ</span>${tg.label} <b>${fmtAU(Math.hypot(tg.x-p.x,tg.y-p.y))}</b></div>`:'');}
  const tm=mmss(G.mT||0);
  if(G.mode==='endless')return `<div class="pz-t">БЕСКОНЕЧНОСТЬ</div><div class="pz-n"><span>СТУПЕНЬ <b>${G.end?G.end.step:1}</b></span>${sep}<span>ВРЕМЯ <b>${tm}</b></span>${sep}<span>УБИТО <b>${G.kills||0}</b></span></div>`;
  const M=MISSIONS[G.m-1];if(!M)return '';const df=(G.mode==='world'||G.mode==='dev')&&DIFF[G.diff]?DIFF[G.diff].name:'';
  return `<div class="pz-t">${pad2(G.m)} · ${mName(M)}${df?`<em>${df}</em>`:''}</div><div class="pz-n"><span>ВРЕМЯ <b>${tm}</b></span>${sep}<span>УРОВЕНЬ <b>${G.lvl||1}</b></span>${sep}<span>УБИТО <b>${G.kills||0}</b></span></div>`+((G.mode==='world'||G.mode==='dev')?mast63():'');}
function pzRender63(){const box=$('#sPause .wrap');if(!box)return;let I=$('#pzInfo');if(!I){I=document.createElement('div');I.id='pzInfo';I.setAttribute('role','status');const st=$('#pauseStat');(st||box.querySelector('.eyebrow')).insertAdjacentElement('afterend',I);}
  I.innerHTML=info63();let Q=$('#pzQuick');if(!Q){Q=document.createElement('div');Q.id='pzQuick';I.insertAdjacentElement('afterend',Q);}Q.innerHTML=quick63();const st=$('#pauseStat');if(st)st.hidden=true;}
{const _pz=pause;pause=function(){const r=_pz.apply(this,arguments);try{if(G.state==='pause')pzRender63();}catch(e){console.error(e);}return r;};}
{const _cs=closeSettings;closeSettings=function(){const r=_cs.apply(this,arguments);try{if(G.state==='pause')pzRender63();}catch(e){}return r;};}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-q63]');if(!b)return;const k=b.dataset.q63;SET[k]=!SET[k];saveSet();try{audioInit();applyAudio();}catch(er){}renderSettings();try{pzRender63();}catch(er){}try{buzz('tap');}catch(er){}});

/* звуки и музыка со своим генератором случайных чисел: со звуком и без бой идёт одинаково (шум, высота нот, музыкальные шаги не трогают Math.random игры) */
const SFXR63=(()=>{let s=0x2545F491;return ()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return (s>>>0)/4294967296;};})();
function iso63(f){const w=function(){const mr=Math.random;Math.random=SFXR63;try{return f.apply(this,arguments);}finally{Math.random=mr;}};w.toString=()=>f.toString();return w;}
/* все звуковые функции: шум, ноты, музыкальные шаги, радиопомехи */
if(typeof sfx==='function')sfx=iso63(sfx);if(typeof noiseBuf==='function')noiseBuf=iso63(noiseBuf);if(typeof scapeStep==='function')scapeStep=iso63(scapeStep);if(typeof musicTick==='function')musicTick=iso63(musicTick);if(typeof radioSay==='function')radioSay=iso63(radioSay);if(typeof snd85==='function')snd85=iso63(snd85);if(typeof snd90==='function')snd90=iso63(snd90);if(typeof step90==='function')step90=iso63(step90);if(typeof snd95==='function')snd95=iso63(snd95);if(typeof snd110==='function')snd110=iso63(snd110);if(typeof step110==='function')step110=iso63(step110);if(typeof snd120==='function')snd120=iso63(snd120);if(typeof postSnd==='function')postSnd=iso63(postSnd);if(typeof postAudio==='function')postAudio=iso63(postAudio);if(typeof thump==='function')thump=iso63(thump);if(typeof tutChord==='function')tutChord=iso63(tutChord);if(typeof tutNote==='function')tutNote=iso63(tutNote);

/* ===== 1.4.2 α «Пульт»: одна кнопка «Готово», вкладки без прокрутки =====
   1) верхняя «ГОТОВО» из 1.4.1 убрана: на телефоне нижняя и так всегда на экране, на ПК — Esc и нижняя (с подсказкой ESC);
   2) на телефоне вкладки — плитка 3 + 2 со значками, видны все пять сразу, ничего не листается вбок. */
const TIC64={snd:'<path d="M3 7.5h3l4-3v11l-4-3H3z"/><path d="M13.5 7c1.1 1.6 1.1 4.4 0 6M15.8 5c2 2.7 2 7.3 0 10"/>',
  ctl:'<circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="2.6"/>',
  scr:'<rect x="2.5" y="3.5" width="15" height="10" rx="1.5"/><path d="M7 17h6M10 13.5V17"/>',
  acc:'<path d="M1.8 10S5 4.5 10 4.5 18.2 10 18.2 10 15 15.5 10 15.5 1.8 10 1.8 10z"/><circle cx="10" cy="10" r="2.6"/>',
  game:'<path d="M10 2.5l6 14-6-3.2-6 3.2z"/>'};
function tabIco64(k){return `<svg class="tic64" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${TIC64[k]||''}</svg>`;}
{const _h=head63;head63=function(){const r=_h.apply(this,arguments);try{
  const d=$('#bSetDone63');if(d)d.remove();
  document.querySelectorAll('#sSet button[data-tab63]').forEach(b=>{if(b.querySelector('.tic64'))return;const n=b.textContent;b.innerHTML=tabIco64(b.dataset.tab63)+`<span>${n}</span>`;b.setAttribute('aria-label',n);});
  const bk=$('#bSetBack');if(bk&&!bk.querySelector('kbd'))bk.insertAdjacentHTML('beforeend',' <kbd class="pconly64">ESC</kbd>');}catch(e){console.error(e);}return r;};}

