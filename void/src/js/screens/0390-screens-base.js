// ---------- Экраны ----------
const SCREENS=['sMenu','sCodex','sIntro','sLevel','sDone','sPause','sOver','sMap','sShop','sSave','sDev','sHangar','sCycle','sReport','sSet','sArsenal'];
const TAPGUARD={sLevel:350,sDone:500,sOver:500};
function show(id){if(G.scrId!==id){G.scrId=id;G.scrAt=performance.now();}if(G.state!=='menu')histArm();if(id&&isMob()){$('#banner').classList.remove('show');}SCREENS.forEach(s=>$('#'+s).hidden=s!==id);if(G.state!=='play'&&G.state!=='world'&&typeof radioClear==='function')radioClear();$('#hud').hidden=!['play','levelup','pause','world'].includes(G.state)||isMob()&&(G.state==='levelup'||G.state==='pause');
  $('#hud').classList.toggle('world',!!G.world);$('#hud').classList.toggle('endless',G.mode==='endless');
  $('#scoreL').textContent=G.mode==='endless'?'УНИЧТОЖЕНО':'ОЧКИ';
  $('#devBar').hidden=!(G.devRun&&['play','levelup','pause','intro'].includes(G.state));$('#devBtn').hidden=!(G.devRun&&G.state==='play');
  if(G.state!=='play')$('#devPanel').hidden=true;
  $('#touch').hidden=!(touchMode&&(G.state==='play'||G.state==='world'));
  if(G.state!=='world'){$('#wcard').hidden=true;G.cardKey=null;}updateCursor();/*DEVW*/if(window.DEVW)DEVW.ui();
  if(G.state!=='world')joyUnlock();if(!$('#touch').hidden&&isMob())layoutTouch();ctxBtnSync();}
document.addEventListener('click',e=>{if(!touchMode)return;const sc=G.scrId,g=TAPGUARD[sc];if(!g||performance.now()-G.scrAt>=g)return;const el=e.target.closest&&e.target.closest('section');if(el&&el.id===sc){e.stopPropagation();e.preventDefault();}},true);
function renderSettings(){
  document.querySelectorAll('[data-settings]').forEach(box=>{
    if(box.closest('#sMenu,#sPause')){if(box.innerHTML)box.innerHTML='';return;}
    box.innerHTML=`
      <button class="tog ${SET.amb?'on':''}" data-k="amb"><span>МУЗЫКА${MUS.lastName&&SET.amb?' · «'+MUS.lastName+'»':''}</span><span>${SET.amb?'ВКЛ':'ВЫКЛ'}</span></button>
      <label class="vol"><span>ГРОМКОСТЬ МУЗЫКИ</span><input type="range" min="0" max="1" step="0.05" value="${SET.ambVol}" data-vol id="vol-${box.closest('section').id}"></label>
      <button class="tog ${SET.sfx?'on':''}" data-k="sfx"><span>ЗВУК</span><span>${SET.sfx?'ВКЛ':'ВЫКЛ'}</span></button>
      <button class="tog ${SET.fx?'on':''}" data-k="fx"><span>ЭФФЕКТЫ · частицы и тряска</span><span>${SET.fx?'ВКЛ':'ВЫКЛ'}</span></button>
      <button class="tog ${SET.manual?'on':''}" data-k="manual"><span>${touchMode?'ПРИЦЕЛ · НА ТЕЛЕФОНЕ ВСЕГДА АВТО':'ПРИЦЕЛ МЫШЬЮ · T'}</span><span>${SET.manual?'РУЧНОЙ':'АВТО'}</span></button>
      <button class="tog ${SET.radio?'on':''}" data-k="radio"><span>ПЕРЕХВАТЫ · радиоэфир</span><span>${SET.radio?'ВКЛ':'ВЫКЛ'}</span></button>${FS.rowPC()}`+(box.closest('#sMenu')?resetBlock():'');
  });
  renderSetScreen();
}
// ---- экран настроек (0.6.0) ----
const SEGS={fsMode:[['ПОЛНЫЙ ЭКРАН',[['off','ВЫКЛ'],['auto','ПРИ ПОЛЁТЕ'],['always','ВСЕГДА']]]],orient:[['ОРИЕНТАЦИЯ',[['auto','АВТО'],['land','АЛЬБОМ'],['port','КНИЖНАЯ']]]],zoom:[['МАСШТАБ',[[.85,'КРУПНЕЕ'],[1,'СТАНДАРТ'],[1.15,'ДАЛЬШЕ']]]],textScale:[['ТЕКСТ',[[1,'ОБЫЧНЫЙ'],[1.15,'КРУПНЫЙ'],[1.3,'ОЧЕНЬ КРУПНЫЙ']]]],
  quality:[['КАЧЕСТВО',[['auto','АВТО'],[0,'ЭКОНОМ'],[1,'СТАНДАРТ'],[2,'ВЫСОКОЕ']]]],fps:[['КАДРЫ',ARCH.fc27?[[30,'30'],[60,'60'],[0,'БЕЗ ОГРАНИЧЕНИЯ']]:[[60,'60'],[30,'30']]]],shake:[['ТРЯСКА',[[0,'НЕТ'],[.5,'СЛАБАЯ'],[1,'ПОЛНАЯ']]]],
  btnSize:[['РАЗМЕР КНОПОК',[[.85,'МЕНЬШЕ'],[1,'СТАНДАРТ'],[1.2,'КРУПНЕЕ']]]],btnAlpha:[['ПРОЗРАЧНОСТЬ КНОПОК',[[.45,'СИЛЬНАЯ'],[.7,'СРЕДНЯЯ'],[1,'НЕТ']]]],
  hand:[['РУКА',[['r','ПРАВАЯ'],['l','ЛЕВАЯ']]]],stick:[['СТИК',[['float','ПЛАВАЮЩИЙ'],['fixed','ЗАКРЕПЛЁННЫЙ']]]]};
function segHTML(k){const [lab,opts]=SEGS[k][0];return `<div class="setrow"><div class="eyebrow">${lab}</div><div class="seg" data-seg="${k}">${opts.map(([v,n])=>`<button data-v="${v}" class="${String(k==='fps'&&ARCH.fc27?fpsCur27():SET[k])===String(v)?'on':''}">${n}</button>`).join('')}</div></div>`;}
function togHTML(k,lab,on,off){return `<button class="tog ${SET[k]?'on':''}" data-k="${k}"><span>${lab}</span><span>${SET[k]?(on||'ВКЛ'):(off||'ВЫКЛ')}</span></button>`;}
function renderSetScreen(){const B=$('#setBody');if(!B||G.state!=='settings')return;const ios=/iP(hone|ad|od)/.test(navigator.userAgent)||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1,tch=touchMode||isMob();
  const fxl=!SET.fx?'off':SET.lessFx?'less':'full',fxSeg=`<div class="setrow"><div class="eyebrow">ЭФФЕКТЫ</div><div class="seg">${[['full','ПОЛНЫЕ'],['less','МЕНЬШЕ'],['off','ВЫКЛ']].map(([v,n])=>`<button data-fxl="${v}" class="${fxl===v?'on':''}">${n}</button>`).join('')}</div></div>`;
  B.innerHTML=`<div class="setgrp"><div class="cx-h2">ЗВУК</div>${togHTML('amb','МУЗЫКА')}
      <label class="vol"><span>ГРОМКОСТЬ МУЗЫКИ</span><input type="range" min="0" max="1" step="0.05" value="${SET.ambVol}" data-vol id="vol-sSet"></label>${togHTML('sfx','ЗВУКИ')}
      ${ios?'<p class="note">Нет звука? Проверьте беззвучный режим.</p>':''}</div>
    <div class="setgrp"><div class="cx-h2">УПРАВЛЕНИЕ</div>${tch?`${segHTML('btnSize')}${segHTML('btnAlpha')}${segHTML('hand')}${segHTML('stick')}
      ${togHTML('dashSwipe','РЫВОК СВАЙПОМ')}${togHTML('oneHand','ОДНОЙ РУКОЙ')}${navigator.vibrate?togHTML('haptics','ВИБРАЦИЯ'):''}`:togHTML('manual','ПРИЦЕЛ МЫШЬЮ')}</div>
    <div class="setgrp"><div class="cx-h2">ЭКРАН</div>${segHTML('fsMode')}${FS.can()?'':`<p class="note" id="fsNote">${FS.noteText()}</p>`}${FS.hintKind()&&!FS.can()?'<div><button class="wbtn" data-fshint>КАК УБРАТЬ ПАНЕЛИ</button></div>':''}${FS.orientOK()?segHTML('orient'):''}
      ${segHTML('zoom')}${G.ff==='desk'?segHTML('uiSize'):''}${segHTML('textScale')}${segHTML('quality')}${segHTML('fps')}${segHTML('shake')}${fxSeg}${devUnlocked()?'<p class="fsdiag">'+FS.diag()+'</p>':''}</div>
    <div class="setgrp"><div class="cx-h2">ПРОЧЕЕ</div>${togHTML('radio','РАДИОЭФИР')}${togHTML('softInv','БЕЗ ПЕРЕВОРОТА УПРАВЛЕНИЯ')}${togHTML('noErase','БЕЗ СТИРАНИЯ ИНТЕРФЕЙСА')}${G.setFrom==='menu'?resetBlock():''}</div>`;}
document.addEventListener('click',e=>{const b=e.target.closest('[data-fxl]');if(!b)return;const v=b.dataset.fxl;SET.fx=v!=='off';SET.lessFx=v==='less';saveSet();applySettings();renderSettings();buzz('tap');});
function applySettings(){document.documentElement.style.setProperty('--fs',SET.textScale||1);ffUpdate();resize();layoutTouch();}
function openSettings(from){G.setFrom=from;G.setPrev=G.state;scr6('settings');renderSetScreen();show('sSet');}
function closeSettings(){if(G.state!=='settings')return;if(G.setFrom==='pause'){scr6('pause');renderSettings();show('sPause');}else{toMenu();}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-seg] [data-v]');if(!b)return;const k=b.closest('[data-seg]').dataset.seg,raw=b.dataset.v,opts=SET_OPT[k];if(!opts)return;if(k==='fps'&&ARCH.fc27){fpsPick27(raw);return;}/* ARCH·90a */
  const v=opts.find(o=>String(o)===raw);if(v===undefined)return;SET[k]=v;saveSet();applySettings();renderSetScreen();buzz('tap');});
