/* ▼▼▼ ARCH·70 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.10 α «Ровно» · этап 2: изоляция случайности и времени)
   Каждая правка выключается флагом: window.__archOff=['A-n'] до загрузки (A-5, A-6, A-8, A-12 ставятся при загрузке и
   из консоли по ходу игры не снимаются; A-7, A-9, A-10, A-11, A-13 проверяют флаг на каждом вызове). Места в коде помечены «ARCH·70 A-n».
   A-5 музыкальный таймер и перенастройка подложки V12 (асинхронно, после декодирования) берут числа из SFXR63 · A-6 эхо реверберации строится на SFXR63 · A-7 отложенное эхо рывка идёт через iso63
   A-8 шум миникарты VØID-000 — на VFXR65 · A-9 ржавый контейнер считает игровое время, а не кадры
   A-10 номер миссии и режим в void_diag · A-11 нечитаемое сохранение нельзя молча перезаписать · A-12 сбой HUD не ставит игру на паузу
   A-13 ARCH.first не переживает восстановление. Новых генераторов случайности нет — только существующие iso63/iso65. */
ARCH.poiDt=null;ARCH.hudErr=null;ARCH.hudN=0;ARCH.toastN=0;ARCH.last=null;ARCH.lock=null;
/* A-9 — шаг времени для w58POI: живёт ровно один вызов, восстанавливается в finally, проверяется на корректность */
function arch70Dt(){const d=ARCH.poiDt;return (!ARCH.off['A-9']&&typeof d==='number'&&d>=0&&d<1000)?d:1/60;}
function arch70POI(card,dt){if(ARCH.off['A-9'])return w58POI(card);const pd=ARCH.poiDt;ARCH.poiDt=dt;try{return w58POI(card);}finally{ARCH.poiDt=pd;}}
/* A-12 — внешняя обёртка функций HUD: помечает исключение, которое из неё вышло. Классификация по самому объекту ошибки,
   поэтому вложенные вызовы HUD и вызовы вне кадра не могут выдать сбой симуляции за сбой интерфейса. */
function arch70Hud(f){const w=function(){try{return f.apply(this,arguments);}catch(e){if(e&&typeof e==='object')ARCH.hudErr=e;throw e;}};w.toString=()=>f.toString();return w;}
function arch70Info(err){return {msg:String(err&&err.message||err).slice(0,200),stack:String(err&&err.stack||'').split('\n').slice(0,6).join(' | ').slice(0,600)};}
/* A-10 · A-13 — запись void_diag */
function arch70Diag(stage,first,last,frames){try{const o={ver:typeof VER_TAG!=='undefined'?VER_TAG:'',at:Date.now(),stage,state:G.state,m:G.m&&G.m.id!=null?G.m.id:null,frames,trips:ARCH.trips,msg:first&&first.msg,stack:first&&first.stack};
  if(!ARCH.off['A-10']){o.m=(G.state==='play'&&typeof G.m==='number')?G.m:null;o.mode=G.mode||null;o.world=G.state==='world';o.zb=G.zb&&G.zb.k||null;o.v=2;}
  if(!ARCH.off['A-13']&&last&&last!==first)o.last=last.msg;
  LS.setItem('void_diag',JSON.stringify(o),true);}catch(e){}}
function arch70Fault(err){if(ARCH.off['A-4'])return;
  if(G.state!=='play'&&G.state!=='world'){ARCH.err=0;ARCH.hudErr=null;if(!ARCH.off['A-13']){ARCH.first=null;ARCH.last=null;}return;}
  const hud=!ARCH.off['A-12']&&err!==null&&typeof err==='object'&&err===ARCH.hudErr;ARCH.hudErr=null;
  if(hud){/* шаг симуляции этого кадра завершился — серия сбоев симуляции прервана */ARCH.err=0;if(!ARCH.off['A-13']){ARCH.first=null;ARCH.last=null;}
    if(!ARCH.hudN++){const i=arch70Info(err);arch70Diag('hud',i,i,1);}return;}
  const info=arch70Info(err);if(!ARCH.err)ARCH.first=info;ARCH.last=info;
  if(++ARCH.err<ARCH.errN)return;ARCH.err=0;ARCH.trips++;
  arch70Diag('sim',ARCH.first,ARCH.last,ARCH.errN);if(!ARCH.off['A-13']){ARCH.first=null;ARCH.last=null;}
  try{pause();}catch(e){}
  if(ARCH.off['A-12']||!ARCH.toastN++){try{toast('СБОЙ В ИГРЕ','Часть систем перестала отвечать, поэтому игра встала на паузу, чтобы бой не завис незаметно. Можно продолжить или выйти в меню — подробности записаны для разработчика.');}catch(e){}}}
/* A-11 — резерв нечитаемого сохранения. Если отложить копию не удалось, запись void_world блокируется: новый прогресс живёт
   только в памяти вкладки, а старая запись остаётся на месте, пока игрок не скачает её или явно не откажется от неё. */
function arch70BadKeys(){const out=[];try{const ls=window.localStorage;for(let i=0;i<ls.length;i++){const k=ls.key(i);if(k&&k.indexOf('void_world_bad')===0)out.push(k);}}catch(e){}return out;}
function arch70Backup(){try{if(G.save)return;const raw=LS.getItem('void_world');if(!raw)return;
  const keys=arch70BadKeys();for(const k of keys){if(LS.getItem(k)===raw)return;}
  let ok=false;if(keys.length<3){const key=keys.indexOf('void_world_bad')<0?'void_world_bad':'void_world_bad_'+(Date.now()%1e9);
    try{LS.setItem(key,raw,true);ok=LS.persisted(key)&&LS.getItem(key)===raw;}catch(e){ok=false;}}
  if(ok){try{toast('СОХРАНЕНИЕ НЕ ПРОЧИТАНО','Старая запись не открылась и отложена отдельно — новая игра её не сотрёт.');}catch(e){}return;}
  arch70Lock(raw);}catch(e){console.error(e);}}
function arch70Lock(raw){if(ARCH.lock)return;const L=ARCH.lock={raw,has:false,mem:null};
  const g=LS.getItem,s=LS.setItem,r=LS.removeItem,p=LS.persisted;L.orig={g,s,r,p};
  LS.getItem=function(k){if(k==='void_world'&&ARCH.lock)return ARCH.lock.has?ARCH.lock.mem:ARCH.lock.raw;return g.apply(this,arguments);};
  LS.setItem=function(k,v){if(k==='void_world'&&ARCH.lock){ARCH.lock.has=true;ARCH.lock.mem=String(v);return;}return s.apply(this,arguments);};
  LS.removeItem=function(k){if(k==='void_world'&&ARCH.lock){ARCH.lock.has=true;ARCH.lock.mem=null;return;}return r.apply(this,arguments);};
  LS.persisted=function(k){if(k==='void_world'&&ARCH.lock)return false;return p.apply(this,arguments);};
  arch70Panel();}
/* экспорт: в просмотрщике claude.ai — через разрешённый механизм downloads (зритель подтверждает сохранение);
   в обычном браузере и из file:// — обычной ссылкой на файл. Результат сообщается честно: ok / declined / sent / fail */
function arch70ExportName(){const d=new Date(),pad=n=>String(n).padStart(2,'0');return 'void_world_'+d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+'_'+pad(d.getHours())+pad(d.getMinutes())+'.txt';}
async function arch70Export(){const L=ARCH.lock;if(!L)return 'fail';const name=arch70ExportName();
  try{const C=window.claude;if(C&&typeof C.use==='function'){const dl=await C.use('downloads');
      if(dl){try{const r=await dl.save({filename:name,data:L.raw});L.exported=1;return r&&r.status==='saved'?'ok':'sent';}catch(e){return e&&e.code==='declined'?'declined':'fail';}}}}catch(e){}
  try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([L.raw],{type:'text/plain'}));a.download=name;
    document.body.appendChild(a);a.click();setTimeout(()=>{try{URL.revokeObjectURL(a.href);a.remove();}catch(e){}},1500);L.exported=1;return 'sent';}catch(e){console.error(e);return 'fail';}}
function arch70Release(){const L=ARCH.lock;if(!L)return;ARCH.lock=null;const o=L.orig;LS.getItem=o.g;LS.setItem=o.s;LS.removeItem=o.r;LS.persisted=o.p;
  try{if(L.has){if(L.mem===null)LS.removeItem('void_world');else LS.setItem('void_world',L.mem);}}catch(e){try{toast('СОХРАНЕНИЕ НЕ ЗАПИСАНО','Браузер не даёт записать прогресс: хранилище переполнено или запрещено. Скопируйте код сохранения в меню, иначе прогресс пропадёт.');}catch(_){}}
  const el=document.getElementById('bak70');if(el)el.remove();clearInterval(L.tick);}
function arch70Panel(){try{const L=ARCH.lock;if(!L||document.getElementById('bak70'))return;
  if(!document.getElementById('bak70css')){const st=document.createElement('style');st.id='bak70css';
    st.textContent='#bak70{position:fixed;left:50%;bottom:max(16px,env(safe-area-inset-bottom,0px));transform:translateX(-50%);width:min(440px,calc(100% - 32px));z-index:60;border-left:2px solid var(--amber);background:var(--panel);padding:14px 16px;display:grid;gap:10px;font-family:var(--f-body);color:var(--text)}'+
      '#bak70 .t{font-family:var(--f-display);font-size:12px;font-weight:600;letter-spacing:.14em;color:var(--amber)}#bak70 p{margin:0;font-size:13px;line-height:1.45;color:var(--text)}'+
      '#bak70 .r{display:grid;grid-template-columns:1fr 1fr;gap:8px}#bak70 .btn{min-height:44px;font-size:11px;padding:10px 12px;justify-content:center;text-align:center}';
    document.head.appendChild(st);}
  const el=document.createElement('div');el.id='bak70';el.setAttribute('role','alertdialog');el.setAttribute('aria-labelledby','bak70t');
  el.innerHTML='<div class="t" id="bak70t">СОХРАНЕНИЕ НЕ ПРОЧИТАНО</div><p>Старую запись не удалось отложить: хранилище браузера переполнено. Чтобы она не пропала, игра пока не записывает новый прогресс поверх неё — он живёт только до закрытия вкладки.</p>'+
    '<div class="r"><button class="btn" data-b70="exp">СКАЧАТЬ ЗАПИСЬ</button><button class="btn act2" data-b70="drop">ОТКАЗАТЬСЯ ОТ НЕЁ</button></div>';
  document.body.appendChild(el);let arm=0;
  el.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-b70]');if(!b)return;
    if(b.dataset.b70==='exp'){arch70Export().then(r=>{const T={ok:['ЗАПИСЬ СКАЧАНА','Файл со старой записью сохранён. Когда убедитесь, что он на месте, можно отказаться от записи в игре.'],
        sent:['ФАЙЛ ОТПРАВЛЕН В ЗАГРУЗКИ','Проверьте папку загрузок. Если файла там нет, браузер его не пропустил — старая запись по-прежнему защищена.'],
        declined:['СКАЧИВАНИЕ ОТМЕНЕНО','Старая запись по-прежнему защищена. Скачать её можно в любой момент.'],
        fail:['НЕ УДАЛОСЬ СКАЧАТЬ','Здесь браузер не даёт сохранить файл. Старая запись по-прежнему защищена.']}[r]||['НЕ УДАЛОСЬ СКАЧАТЬ',''];try{toast(T[0],T[1]);}catch(_){}});return;}
    if(!arm){arm=1;b.textContent='ТОЧНО? ЗАПИСЬ ПРОПАДЁТ';return;}arch70Release();try{toast('ЗАЩИТА СНЯТА','Новый прогресс снова сохраняется. Старая запись будет заменена.');}catch(_){}});
  const sync=()=>{try{el.hidden=!(G.state==='menu'||G.state==='save');}catch(_){}};sync();L.tick=setInterval(sync,400);}catch(e){console.error(e);}}
/* выполняется после arch69Boot(): все обёртки уже установлены */
function arch70Boot(){try{
  if(typeof iso63==='function'){if(!ARCH.off['A-5']){if(typeof musSched==='function')musSched=iso63(musSched);if(typeof v12Retune==='function')v12Retune=iso63(v12Retune);}if(!ARCH.off['A-6']&&typeof makeImpulse==='function')makeImpulse=iso63(makeImpulse);}
  else if(!ARCH.off['A-5']||!ARCH.off['A-6'])console.warn('ARCH·70: iso63 не найден — A-5/A-6 не применены');
  if(typeof iso65==='function'){if(!ARCH.off['A-8']&&typeof zbMapStatic==='function')zbMapStatic=iso65(zbMapStatic);}
  else if(!ARCH.off['A-8'])console.warn('ARCH·70: iso65 не найден — A-8 не применён');
  if(!ARCH.off['A-12']){if(typeof updateHUD==='function')updateHUD=arch70Hud(updateHUD);if(typeof updateEndlessHUD==='function')updateEndlessHUD=arch70Hud(updateEndlessHUD);if(typeof updateWorldHUD==='function')updateWorldHUD=arch70Hud(updateWorldHUD);}
}catch(e){console.error(e);}}
/* ▲▲▲ ARCH·70 · КОНЕЦ ВЫРЕЗАЕМОГО БЛОКА ▲▲▲ */
