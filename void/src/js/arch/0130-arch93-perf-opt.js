/* ▼▼▼ ARCH·93 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.35 α · этапы 6+7: итог)
   Исполняемого кода нет. Границы владения полями G после этапа 6 (проверка — node tools6/own6.js по tools6/ownership6.json):
     экраны      G.state                                   — только scr6 (ARCH·88); исключение — групповой сброс enterWorldAt;
     прогресс    смена объекта G.save                      — только saveSet6 / saveWith6 (ARCH·89); содержимое G.save.* не ограничено;
     прокачка    G.xp, lvl, need, lvlQ, bpQ, briefQ, briefN — только run*6 (ARCH·89b); исключения — сбросы раунда setupMission0, enterWorldAt (bpQ);
     наведение   G.prio, aimLock, tg90, noTg75, aimWarn75  — подсистема ARCH·81 и prioSet / prioClear / aimLockClear; исключения — сбросы раунда.
   Этап 7: сняты 24 недостижимых объявления (ARCH·85), 4 серии из 10 слоёв одной подсистемы слиты в 4 слоя (ARCH·86; 11 серий из слоёв разных подсистем оставлены раздельными), снята ветка A-26 (ARCH·87).
   Оставшиеся цепочки переустановок перечислены с назначением и классом в tools6/chains6.json. Чтения полей G не ограничены:
   G остаётся одним глобальным объектом — это границы записи, а не инкапсуляция. Откат — снятие патча 93. */
/* ▲▲▲ ARCH·93 · КОНЕЦ ВЫРЕЗАЕМОГО БЛОКА ▲▲▲ */


/* ▼▼▼ PERF·OPT · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.8 α)
   Оптимизации без изменения поведения. Каждая выключается флагом: PERF.off['O-n']=1 в консоли
   или window.__perfOff=['O-n'] до загрузки — тогда идёт старый путь. Точечные места помечены «PERF·OPT O-n». */
var PERF={off:{}};try{if(window.__perfOff)for(const k of window.__perfOff)PERF.off[k]=1;}catch(e){}
/* O-6 · один форматтер чисел на всю игру — НАЧАЛО.
   toLocaleString('ru-RU') по стандарту = new Intl.NumberFormat('ru-RU').format(x): тот же текст, но без создания форматтера на каждый вызов */
var NF68=null;try{NF68=new Intl.NumberFormat('ru-RU');}catch(e){NF68=null;}
function ru68(n){return (NF68&&!PERF.off['O-6'])?NF68.format(n):n.toLocaleString('ru-RU');}
/* O-6 — КОНЕЦ */
/* O-3 · враги: те же вычисления, меньше лишних — НАЧАЛО.
   Math.hypot(dx,dy) ≥ max(|dx|,|dy|), поэтому пара, у которой |dx| или |dy| уже ≥ порога, заведомо не проходит проверку «< порога».
   Набор, порядок обхода и все числа — прежние. */
/* три ближайших к щитоносцу: расстояние один раз на кандидата; сортировка стабильная по тем же числам — тот же порядок при равенстве */
function o3Near(s){const sx=s.x,sy=s.y,a=[];
  for(const o of G.enemies){const dx=o.x-sx,dy=o.y-sy;if(dx>=240||dx<=-240||dy>=240||dy<=-240)continue;if(!(o.alive&&o!==s&&o.type!=='shielder'&&!HEAVY.has(o.type)&&o.type!=='moth'))continue;const d=Math.hypot(dx,dy);if(d<240)a.push({o,d});}
  a.sort((p,q)=>p.d-q.d);const r=[];for(let i=0;i<a.length&&i<3;i++)r.push(a[i].o);return r;}
/* разведение: фильтр sep() не зависит от координат — считается один раз; пары идут в прежнем порядке i<j */
var O3L=[];
function o3Sep(es,sep){const L=O3L;let n=0;for(let i=0;i<es.length;i++)if(sep(es[i]))L[n++]=es[i];
  for(let i=0;i<n;i++){const a=L[i];for(let j=i+1;j<n;j++){const b=L[j],dx=b.x-a.x,dy=b.y-a.y,m=a.r+b.r+2;
    if(dx>=m||dx<=-m||dy>=m||dy<=-m)continue;
    const d=Math.hypot(dx,dy);if(d>0&&d<m){const k=(m-d)/d*.5;a.x-=dx*k;a.y-=dy*k;b.x+=dx*k;b.y+=dy*k;}}}
  L.length=0;}
/* O-3 — КОНЕЦ */
/* ▲▲▲ PERF·OPT · КОНЕЦ ВЫРЕЗАЕМОГО БЛОКА ▲▲▲ */

/* 1.0.0 α: слой хранения. Браузерное хранилище может отказать (встроенное окно, приватный режим, переполнение) или прийти пустым
   после новой версии. LS держит копию каждой записи в памяти — в этой вкладке прогресс не теряется, а облако (ниже) переносит его между версиями. */
const LS=(function(){const mem={},bad={},hooks=[];let real=null;try{real=window.localStorage;real.getItem('void_world');}catch(e){real=null;}
  const has=k=>Object.prototype.hasOwnProperty.call(mem,k);const fire=k=>{for(const f of hooks){try{f(k);}catch(e){}}};
  return {ok(){return !!real;},persisted(k){return !!real&&!bad[k];},
    getItem(k){if(real&&!bad[k]){try{return real.getItem(k);}catch(e){}}return has(k)?mem[k]:null;},
    setItem(k,v,quiet){v=String(v);mem[k]=v;let ok=false;if(real){try{real.setItem(k,v);ok=true;delete bad[k];}catch(e){bad[k]=1;}}else bad[k]=1;
      if(!quiet)fire(k);if(!ok){const er=new Error('storage write failed');er.name='QuotaExceededError';throw er;}},
    removeItem(k,quiet){delete mem[k];delete bad[k];if(real){try{real.removeItem(k);}catch(e){}}if(!quiet)fire(k);},
    onWrite(f){hooks.push(f);}};})();
