/* ===== 1.3.1 α: меню, «Допуск пилота», прозрачность, музыка ===== */
const VN131={
  alpha:'игра в разработке, всё ещё меняется',
  upd:'небо первого сектора: Маяк Ядра стоит на месте, а камни заднего плана закрывают его — с затмением и светом по краю.'
};
function vnRender(){const el=$('#verNote');if(!el)return;
  el.innerHTML=`<div class="vn-h"><span class="vn-v">VØID ${VER_TAG}</span><span class="vn-a">АЛЬФА</span><span class="vn-p">${VN131.alpha}</span></div>`+
    `<p class="vn-u"><b>НОВОЕ В ${VER_TAG.replace(' α','')}</b>— ${VN131.upd}</p>`+
    `<div class="vn-s" role="status"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M2 6h3l4-3v10L5 10H2z"/><path d="M11.5 5.5c1 1.4 1 3.6 0 5"/></svg><span>${touchMode||isMob()?'МУЗЫКА — С ПЕРВОГО КАСАНИЯ':'МУЗЫКА — С ПЕРВОГО НАЖАТИЯ'}</span></div>`;}
function vnFresh(){const el=$('#verNote');if(el)el.classList.add('fresh');}
(function(){const rl=$('#recLine');if(rl&&!$('#verNote')){const d=document.createElement('div');d.id='verNote';d.setAttribute('aria-label','Версия игры');rl.insertAdjacentElement('afterend',d);}vnRender();})();
/* свежая версия: пометка «НОВОЕ» держится, пока игрок не уйдёт из меню */
{const _tm=toMenu;toMenu=function(){const r=_tm.apply(this,arguments);try{vnRender();vnMute();}catch(e){}return r;};}

/* «Допуск пилота» в паузе: по умолчанию свёрнут; когда освоены все навыки — карточки нет */
{const _pz=pause;pause=function(){const r=_pz.apply(this,arguments);try{const d=$('#tutCard');if(d&&!d.hidden){if(tutSkillN()>=TUT_SK.length)d.hidden=true;else d.open=false;}}catch(e){}return r;};}

/* прозрачность кнопок: «СИЛЬНАЯ» — действительно сильная */
SET_OPT.btnAlpha=[.2,.7,1];SEGS.btnAlpha=[['ПРОЗРАЧНОСТЬ КНОПОК',[[.2,'СИЛЬНАЯ'],[.7,'СРЕДНЯЯ'],[1,'НЕТ']]]];
if(SET.btnAlpha===.45||!SET_OPT.btnAlpha.includes(SET.btnAlpha)){SET.btnAlpha=SET.btnAlpha<.6?.2:SET.btnAlpha<.85?.7:1;try{saveSet();}catch(e){}}
/* прозрачность стика — отдельная настройка */
SET_DEF.stickAlpha=1;SET_OPT.stickAlpha=[.05,.5,1];SEGS.stickAlpha=[['ПРОЗРАЧНОСТЬ СТИКА',[[.05,'СИЛЬНАЯ'],[.5,'СРЕДНЯЯ'],[1,'НЕТ']]]];
if(!SET_OPT.stickAlpha.includes(SET.stickAlpha))SET.stickAlpha=1;
function opApply(){const T=$('#touch');if(!T)return;const mob=isMob();T.style.setProperty('--sa',mob?SET.stickAlpha:1);}
{const _lt=layoutTouch;layoutTouch=function(){const r=_lt.apply(this,arguments);try{opApply();}catch(e){}return r;};}
{const _as=applySettings;applySettings=function(){const r=_as.apply(this,arguments);try{opApply();}catch(e){}return r;};}
const OPIC={btnAlpha:'<svg class="opic" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="2.4" stroke-dasharray="1.6 1.4"/></svg>',
  stickAlpha:'<svg class="opic" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="8" cy="8" r="6.2" stroke-dasharray="2 1.6"/><circle cx="10" cy="6.4" r="2.6" fill="currentColor" fill-opacity=".35"/></svg>'};
function opInject(root){if(!root)return;const b=root.querySelector('[data-seg="btnAlpha"]');if(!b)return;const row=b.closest('.setrow');
  if(row&&!root.querySelector('[data-seg="stickAlpha"]'))row.insertAdjacentHTML('afterend',segHTML('stickAlpha'));
  for(const k of ['btnAlpha','stickAlpha']){const s=root.querySelector(`[data-seg="${k}"]`);const eb=s&&s.closest('.setrow')&&s.closest('.setrow').querySelector('.eyebrow');if(eb&&!eb.querySelector('.opic'))eb.insertAdjacentHTML('afterbegin',OPIC[k]);}}
/* ARCH·86 · слой renderSetScreen 2 из 3 (строка 14489 в 1.5.25) перенесён в объединённый слой ниже */
/* ARCH·86 · объединённый слой renderSettings: 3 слоя (строки 1.5.25: 13689, 14439, 14490) в исходном порядке исполнения */
{const _p86=renderSettings;renderSettings=function(){const was_861={};let foc_861=null;
  document.querySelectorAll('.tog[data-k]').forEach(b=>{was_861[b.dataset.k]=b.classList.contains('on');if(document.activeElement===b)foc_861=b.dataset.k;});
  const r86=_p86.apply(this,arguments);
  document.querySelectorAll('.tog[data-k]').forEach(b=>{const k=b.dataset.k;if(!(k in was_861))return;const on=b.classList.contains('on');
    if(was_861[k]!==on){b.classList.toggle('on',was_861[k]);void b.offsetWidth;b.classList.toggle('on',on);}
    if(foc_861===k)try{b.focus({preventScroll:true});}catch(e){}});
  try{document.querySelectorAll('[data-settings]').forEach((b,i)=>sfxVolInject(b,'svol-'+i));}catch(e){}
  try{document.querySelectorAll('[data-settings]').forEach(opInject);}catch(e){}return r86;};}
try{opApply();}catch(e){}

/* музыка меню. Браузеры не дают странице включить звук до первого настоящего касания или нажатия,
   а искусственный клик из кода (isTrusted=false) такого права не даёт. Поэтому: пробуем сами при загрузке
   и потом каждые 1,5 с (если браузер разрешит — например, сайт уже «знаком» ему), и любое первое касание
   в любом месте включает музыку. Пока браузер держит звук — внизу меню тихая строка-подсказка. */
function vnMute(){const el=$('#verNote');if(!el)return;const blocked=SET.amb&&G.state==='menu'&&(!AU.ctx||AU.ctx.state!=='running');el.classList.toggle('mute',!!blocked&&performance.now()>1400);}
{let n=0;const iv=setInterval(()=>{n++;try{if(AU.ctx&&AU.ctx.state==='running'){vnMute();clearInterval(iv);return;}if(typeof audioWake==='function')audioWake();vnMute();}catch(e){}if(n>80)clearInterval(iv);},1500);}
{const ev=['pointerdown','pointerup','touchend','mousedown','keydown','click'],h=()=>setTimeout(()=>{try{vnMute();}catch(e){}},60);ev.forEach(n=>addEventListener(n,h,{capture:true,passive:true}));}
setTimeout(()=>{try{vnMute();}catch(e){}},1500);

