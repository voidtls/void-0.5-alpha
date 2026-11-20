/* ===== 1.2.8 α: музыка меню сразу, громкость звуков, кнопки меню на телефоне ===== */
/* громкость звуков: свой множитель поверх прежних 0,32 */
SET_DEF.sfxVol=.7;if(typeof SET.sfxVol!=='number'||!Number.isFinite(SET.sfxVol))SET.sfxVol=.7;SET.sfxVol=clamp(SET.sfxVol,0,1);
function sfxVolApply(){if(!AU.ctx||!AU.sfx)return;const t=AU.ctx.currentTime;AU.sfx.gain.cancelScheduledValues(t);AU.sfx.gain.setTargetAtTime(.32*SET.sfxVol,t,.03);}
{const _aa=applyAudio;applyAudio=function(){const r=_aa.apply(this,arguments);sfxVolApply();return r;};}
function sfxVolRow(id){return `<label class="vol"><span>ГРОМКОСТЬ ЗВУКОВ</span><input type="range" min="0" max="1" step="0.05" value="${SET.sfxVol}" data-svol id="${id}" aria-label="Громкость звуков"></label>`;}
function sfxVolInject(root,id){if(!root)return;root.querySelectorAll('.tog[data-k="sfx"]').forEach((b,i)=>{const nx=b.nextElementSibling;if(nx&&nx.querySelector&&nx.querySelector('[data-svol]'))return;b.insertAdjacentHTML('afterend',sfxVolRow(id+(i?'-'+i:'')));});}
/* ARCH·86 · слой renderSetScreen 1 из 3 (строка 14438 в 1.5.25) перенесён в объединённый слой ниже */
/* ARCH·86 · слой renderSettings 2 из 3 (строка 14439 в 1.5.25) перенесён в объединённый слой ниже */
let sfxPrevT=0;
document.addEventListener('input',e=>{if(!e.target.matches||!e.target.matches('[data-svol]'))return;SET.sfxVol=clamp(+e.target.value,0,1);saveSet();audioInit();sfxVolApply();
  const now=performance.now();if(SET.sfx&&now-sfxPrevT>140){sfxPrevT=now;try{sfx('cell');}catch(er){}}});

/* музыка меню: через 0,5 с после загрузки. Если браузер не пускает звук без касания —
   трек уже декодирован и начнётся с первого же касания, клика или клавиши в любом месте */
function audioWake(){try{if(!AU.ctx)audioInit();else if(AU.ctx.state!=='running'&&AU.ctx.state!=='closed')AU.ctx.resume();}catch(e){}}
setTimeout(()=>{audioWake();try{if(AU.ctx&&typeof mzP==='function'&&typeof MZ_TR!=='undefined'){const P_=mzP('menu');mzDecode(P_,0).catch(()=>{});mzDecode(P_,MZ_TR.menu.intro).catch(()=>{});}}catch(e){}},500);
{const ev=['pointerdown','pointerup','touchend','mousedown','keydown','click'],h=()=>{audioWake();if(AU.ctx&&AU.ctx.state==='running')ev.forEach(n=>removeEventListener(n,h,true));};ev.forEach(n=>addEventListener(n,h,{capture:true,passive:true}));}

