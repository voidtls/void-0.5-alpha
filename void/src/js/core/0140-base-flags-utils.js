/* =====================================================================
   VØID 0_2_0 «Последний сигнал» + дополнение 0.1.1 «Маяк» (альфа)
   Подсистемы: утилиты · настройки · аудио · рендер-ресурсы · данные · игрок · стрельба
   · враги · Страж · маяк · режиссёр · уровень (астероиды, линии, тьма, буря) · события
   · Глушитель · подбор · прогрессия · отрисовка · HUD · экраны · ввод · цикл
   ===================================================================== */
/* ВРЕМЕННО (альфа 0.5.9): все уровни и Бездна открыты для теста, прыжок с карты к любому узлу.
   Убрать перед бетой: ALPHA_OPEN = false, затем удалить все блоки с пометкой "ВРЕМЕННО (альфа 0.5.9)". */
const ALPHA_OPEN = (typeof window!=='undefined'&&window.__alpha===true); // 1.0.0 α: мир закрыт туманом войны; true выставляют только старые тесты // ВРЕМЕННО (альфа 0.5.9): false выставляют только тесты
function gateOpen(){return !!G.save&&(!!G.save.gate||ALPHA_OPEN);} // ВРЕМЕННО (альфа 0.5.9): ворота проходимы в альфе
function abyssOpen(){return gateOpen();} // 0.5.9: Бездна открыта вместе с воротами (в альфе — всегда)
const COLD_A=0.5; // 0.5.9: холод сектора III прозрачнее вдвое (множитель всех декоративных слоёв)
const PATROL_HP_K=1/3; // 0.5.9: прочность патрулей III–IV ÷3

// ---------- Утилиты ----------
const $=s=>document.querySelector(s);
const TAU=Math.PI*2;
const rnd=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const angDiff=(a,b)=>{let d=(a-b)%TAU;if(d>Math.PI)d-=TAU;if(d<-Math.PI)d+=TAU;return d;};
function segDist(ax,ay,bx,by,px,py){const dx=bx-ax,dy=by-ay,l=dx*dx+dy*dy;let t=l?((px-ax)*dx+(py-ay)*dy)/l:0;t=clamp(t,0,1);return Math.hypot(ax+dx*t-px,ay+dy*t-py);}
function segPoint(ax,ay,bx,by,px,py){const dx=bx-ax,dy=by-ay,l=dx*dx+dy*dy;let t=l?((px-ax)*dx+(py-ay)*dy)/l:0;t=clamp(t,0,1);return{x:ax+dx*t,y:ay+dy*t};}
function segInter(ax,ay,bx,by,cx,cy,dx,dy){const r1=bx-ax,r2=by-ay,s1=dx-cx,s2=dy-cy,den=r1*s2-r2*s1;if(Math.abs(den)<1e-9)return false;const t=((cx-ax)*s2-(cy-ay)*s1)/den,u=((cx-ax)*r2-(cy-ay)*r1)/den;return t>=0&&t<=1&&u>=0&&u<=1;}
const fmt=n=>ru68(Math.round(n));/* PERF·OPT O-6 */
const pad2=n=>String(n).padStart(2,'0');
const LOMSVG='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.4 13.7 4.7v6.6L8 14.6 2.3 11.3V4.7Z" fill="#141c28" stroke="#c9d2de" stroke-width="1.4" stroke-linejoin="round"/><path d="M8 1.4 13.7 4.7 8 8Z" fill="#ffb84d" opacity=".9"/><circle cx="8" cy="8" r="2.3" fill="#04060c" stroke="#c9d2de" stroke-width="1.2"/></svg>';
const fmtN=n=>typeof n==='number'?ru68(Math.round(n)):n;/* PERF·OPT O-6 */
function lomH(n,big){return `<span class="lom${big?' big':''}">${LOMSVG}<b>${fmtN(n)}</b></span>`;}
function store(k,v){/*DEVW*/if(v!==undefined&&window.DEVW&&DEVW.block(k))return null;try{if(v===undefined){const s=LS.getItem(k);return s?JSON.parse(s):null;}LS.setItem(k,JSON.stringify(v));G.saveFail=0;}catch(e){if(v!==undefined&&k==='void_world'&&!G.saveFail&&!(window.CLOUD&&CLOUD.state==='ready')){G.saveFail=1;try{toast('СОХРАНЕНИЕ НЕ ЗАПИСАНО','Браузер не даёт записать прогресс: хранилище переполнено или запрещено. Скопируйте код сохранения в меню, иначе прогресс пропадёт.');}catch(_){}}return null;}}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;}

