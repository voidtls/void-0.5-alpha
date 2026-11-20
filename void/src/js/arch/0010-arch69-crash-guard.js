
"use strict";
/* ▼▼▼ ARCH·69 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.9 α «Опора»)
   Надёжность без изменения игры. Каждая правка выключается флагом: ARCH.off['A-n']=1 в консоли
   или window.__archOff=['A-n'] до загрузки — тогда идёт старый путь. Точечные места помечены «ARCH·69 A-n».
   A-1 · один цикл отрисовки карты · A-2 · резерв нечитаемого сохранения · A-3 · сохранение на загрузке проходит всю цепочку миграций
   A-4 · предохранитель симуляции: N кадров подряд с ошибкой → пауза, сообщение, запись в void_diag */
var ARCH={off:{},mapGen:0,err:0,errN:30,first:null,trips:0};try{if(window.__archOff)for(const k of window.__archOff)ARCH.off[k]=1;}catch(e){}
/* A-1 — продолжение цикла карты только у последнего запущенного цикла; старые гаснут на своём следующем кадре */
function arch69MapNext(){if(ARCH.off['A-1']){requestAnimationFrame(mapLoop);return;}const g=ARCH.mapGen;requestAnimationFrame(()=>{if(g===ARCH.mapGen)mapLoop();});}
/* A-4 — счётчик подряд идущих кадров с ошибкой в стадии симуляции/мира */
function arch69Ok(){if(ARCH.err&&!ARCH.off['A-13']){ARCH.first=null;ARCH.last=null;}ARCH.err=0;ARCH.hudErr=null;}/* ARCH·70 A-13 */
function arch69Fault(err){if(!(ARCH.off['A-10']&&ARCH.off['A-12']&&ARCH.off['A-13']))return arch70Fault(err);/* ARCH·70 A-10 A-12 A-13 */if(ARCH.off['A-4'])return;if(G.state!=='play'&&G.state!=='world'){ARCH.err=0;return;}
  if(!ARCH.err)ARCH.first={msg:String(err&&err.message||err).slice(0,200),stack:String(err&&err.stack||'').split('\n').slice(0,6).join(' | ').slice(0,600)};
  if(++ARCH.err<ARCH.errN)return;ARCH.err=0;ARCH.trips++;
  try{LS.setItem('void_diag',JSON.stringify({ver:typeof VER_TAG!=='undefined'?VER_TAG:'',at:Date.now(),stage:'sim',state:G.state,m:G.m&&G.m.id!=null?G.m.id:null,frames:ARCH.errN,trips:ARCH.trips,msg:ARCH.first&&ARCH.first.msg,stack:ARCH.first&&ARCH.first.stack}),true);}catch(e){}
  try{pause();}catch(e){}
  try{toast('СБОЙ В ИГРЕ','Часть систем перестала отвечать, поэтому игра встала на паузу, чтобы бой не завис незаметно. Можно продолжить или выйти в меню — подробности записаны для разработчика.');}catch(e){}}
/* A-2 — нечитаемое сохранение откладывается до того, как новая игра его перезапишет */
function arch69Backup(){if(ARCH.off['A-2'])return;if(!ARCH.off['A-11'])return arch70Backup();/* ARCH·70 A-11 */try{if(G.save)return;const raw=LS.getItem('void_world');if(!raw)return;
  const prev=LS.getItem('void_world_bad');if(prev===raw)return;const key=prev?'void_world_bad_'+(Date.now()%1e9):'void_world_bad';LS.setItem(key,raw,true);
  try{toast('СОХРАНЕНИЕ НЕ ПРОЧИТАНО','Старая запись не открылась и отложена отдельно — новая игра её не сотрёт.');}catch(e){}}catch(e){}}
/* выполняется последней строкой главного скрипта, когда все обёртки уже установлены */
function arch69Boot(){if(!ARCH.off['A-3']){try{saveSet6(migrateSave(store('void_world')),'load');}catch(e){console.error(e);}}arch69Backup();}
/* ▲▲▲ ARCH·69 · КОНЕЦ ВЫРЕЗАЕМОГО БЛОКА ▲▲▲ */
