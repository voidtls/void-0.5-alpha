/* ===== 1.1.1 α «Стекло»: оболочка — подтверждения, клавиатура, движение ===== */
function fx25(){document.documentElement.classList.toggle('lessfx',!SET.fx||!!SET.lessFx);}
// подтверждение перед необратимым (вместо «нажмите ещё раз» на телефоне): одно окно для всех устройств
function askConfirm(title,text,ok,onOk){let el=document.getElementById('cfm');
  if(!el){el=document.createElement('div');el.id='cfm';el.hidden=true;el.setAttribute('role','alertdialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','cfmT');el.setAttribute('aria-describedby','cfmP');
    el.innerHTML='<div class="box"><h3 id="cfmT"></h3><p id="cfmP"></p><div class="row"><button class="btn" id="cfmNo">ОТМЕНА</button><button class="btn danger-f" id="cfmOk"></button></div></div>';document.body.appendChild(el);
    el.addEventListener('click',e=>{if(e.target===el)closeConfirm();});
    el.querySelector('#cfmNo').onclick=()=>closeConfirm();
    el.querySelector('#cfmOk').onclick=()=>{const f=el._ok;closeConfirm(true);if(f)f();};}
  el.querySelector('#cfmT').textContent=title;const P=el.querySelector('#cfmP');P.textContent=text||'';P.hidden=!text;el.querySelector('#cfmOk').textContent=ok;
  el._ok=onOk;el._ret=document.activeElement;el.hidden=false;try{el.querySelector('#cfmNo').focus();}catch(e){}buzz&&buzz('tap');}
function closeConfirm(done){const el=document.getElementById('cfm');if(!el||el.hidden)return;el.hidden=true;el._ok=null;const r=el._ret;el._ret=null;
  if(!done&&r&&r.focus&&document.contains(r)&&r.offsetParent)try{r.focus({preventScroll:true});}catch(e){}}
function confirmPause(el,f){return e=>{
  if(G.devRun||G.mode==='dev')return f(e);
  const id=el.id,end=G.mode==='endless';let o=null;
  if(id==='bQuit'){if(G.pausedWorld)return f(e);o=end?['Выйти в меню?','Забег прервётся.','В МЕНЮ']:['Выйти в меню?','Миссия прервётся, прогресс этой попытки пропадёт.','В МЕНЮ'];}
  else if(id==='bRestart')o=end?['Начать заново?','Текущий забег прервётся.','ЗАНОВО']:['Перезапустить миссию?','Прогресс этой попытки пропадёт.','ПЕРЕЗАПУСК'];
  else if(id==='bAbandon')o=G.fromAbyss?['Покинуть Бездну?','Этот спуск не попадёт в рекорды.','ПОКИНУТЬ']:['Покинуть миссию?','Вы вернётесь в сектор. Прогресс миссии пропадёт.','ПОКИНУТЬ'];
  if(!o)return f(e);
  askConfirm(o[0],o[1],o[2],()=>{if(G.state==='pause')f(e);});};}
// окно подтверждения перехватывает клавиши: Esc — отмена, Tab и стрелки — между двумя кнопками
function cfmKey(e){const c=document.getElementById('cfm');if(!c||c.hidden)return false;
  if(e.code==='Escape'){e.preventDefault();closeConfirm();}
  else if(e.code==='Tab'||/^Arrow/.test(e.code)){e.preventDefault();const a=c.querySelector('#cfmNo'),b=c.querySelector('#cfmOk');(document.activeElement===a?b:a).focus();}
  return true;}
addEventListener('keydown',e=>{if(cfmKey(e))e.stopImmediatePropagation();},true);
// стрелки в меню и окнах: фокус ходит по кнопкам в порядке на экране
addEventListener('keydown',e=>{
  if(!/^Arrow(Up|Down|Left|Right)$/.test(e.code)||e.altKey||e.ctrlKey||e.metaKey)return;
  if(G.state==='play'||G.state==='world'||G.state==='map'||G.prologue)return;
  const t=e.target;if(t&&t.tagName&&/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))return;if(t&&t.matches&&t.matches('.tog[data-k]')&&(e.code==='ArrowLeft'||e.code==='ArrowRight'))return;
  const root=[...document.querySelectorAll('section.screen')].find(s=>!s.hidden&&s.id!=='fsCard');if(!root||root.id==='sMap')return;
  const L=[...root.querySelectorAll('button')].filter(b=>!b.disabled&&b.offsetParent!==null&&b.getClientRects().length);if(!L.length)return;
  const R=new Map(L.map(b=>[b,b.getBoundingClientRect()]));L.sort((a,b)=>{const A=R.get(a),B=R.get(b);return Math.abs(A.top-B.top)>6?A.top-B.top:A.left-B.left;});
  let i=L.indexOf(document.activeElement);
  if(i<0){const p=[...root.querySelectorAll('.btn.primary')].find(x=>L.includes(x));i=p?L.indexOf(p):0;}
  else{const d=(e.code==='ArrowDown'||e.code==='ArrowRight')?1:-1;i=(i+d+L.length)%L.length;}
  e.preventDefault();try{L[i].focus();L[i].scrollIntoView({block:'nearest'});}catch(er){}
},true);

// роли для экранного диктора: вкладки, группы выбора; вкладки с прокруткой держат активную в центре
function ariaSync(){try{
  document.querySelectorAll('.tabs,.maptabs').forEach(t=>t.setAttribute('role','tablist'));
  document.querySelectorAll('.tabs .tab,.maptabs button').forEach(b=>{b.setAttribute('role','tab');b.setAttribute('aria-selected',b.classList.contains('on')?'true':'false');});
  document.querySelectorAll('.seg').forEach(g=>g.setAttribute('role','group'));
  document.querySelectorAll('.seg button').forEach(b=>b.setAttribute('aria-pressed',b.classList.contains('on')?'true':'false'));
  if(isMob())document.querySelectorAll('.tabs').forEach(t=>{const on=t.querySelector('.on');if(!on||t.scrollWidth<=t.clientWidth+2||!t.offsetParent)return;const r=on.getBoundingClientRect(),q=t.getBoundingClientRect();t.scrollLeft+=(r.left+r.width/2)-(q.left+q.width/2);});
}catch(e){}}
document.addEventListener('click',()=>setTimeout(ariaSync,0));
// меню: в главной кнопке — что дальше (номер и название ближайшей непройденной миссии)
function menuCont25(){const b=document.getElementById('bWorld');if(!b)return;let c=b.querySelector('.cont');if(!c){c=document.createElement('span');c.className='cont';b.insertBefore(c,b.querySelector('kbd'));}
  let t='';try{const S=G.save&&validSave(G.save)?G.save:null;if(S){let m=0;for(let i=1;i<=NM;i++){if(nodeState(i)==='open'){m=i;break;}}
    t=m?'Миссия '+m+' · '+mName(MISSIONS[m-1]):(doneCountS(S)>=NM?'Все миссии пройдены':'');}}catch(e){t='';}c.textContent=t;}
{const _rm25=renderMenu;renderMenu=function(){_rm25.apply(this,arguments);menuCont25();};}
// тень потери: красный след за полосой корпуса догоняет её с задержкой
{let gh25=1;const _setS25=setS;setS=function(id,v){_setS25(id,v);if(id!=='hpB')return;const n=+v;if(n===gh25)return;const g=document.getElementById('hpG');if(!g)return;g.style.transition=n>gh25?'none':'';gh25=n;g.style.transform=`scaleX(${n})`;};}
// штамп поражения живёт внутри экрана поражения, а не поверх любых окон (V-02)
function stamp25(txt){const w=document.querySelector('#sOver .wrap');if(!w)return false;let st=document.getElementById('ovStamp');
  if(!st){st=document.createElement('div');st.id='ovStamp';st.setAttribute('aria-hidden','true');w.insertBefore(st,w.firstChild);}
  st.textContent=txt||'';st.classList.remove('on');if(txt){void st.offsetWidth;st.classList.add('on');}return true;}
{const _mf25=memoFlash;memoFlash=function(txt){if(!$('#sOver').hidden&&stamp25(txt))return;_mf25(txt);};}
{const _show25=show;show=function(id){closeConfirm();const m=document.getElementById('memo'),live=m&&m.classList.contains('on');
  _show25(id);setTimeout(ariaSync,0);if(id==='sOver')stamp25(live?m.textContent:'');if(m&&id)m.classList.remove('on');};}
{const _toast25=toast;toast=function(a,b){_toast25(a,b);const el=document.getElementById('toast');if(!el)return;el.classList.remove('in');void el.offsetWidth;el.classList.add('in');};}
{const _apply25=applySettings;applySettings=function(){_apply25.apply(this,arguments);fx25();};}
togHTML=function(k,lab,on,off){const v=!!SET[k];return `<button class="tog ${v?'on':''}" data-k="${k}" role="switch" aria-checked="${v}"><span>${lab}</span><span class="sw"><span class="sr">${v?(on||'ВКЛ'):(off||'ВЫКЛ')}</span></span></button>`;};

// книжная ориентация: карточка объекта не залезает под монологи и уведомления — встаёт под их стопку
function cardStack25(){const c=document.getElementById('wcard');if(!c)return;
  if(c.hidden||!document.documentElement.classList.contains('ff-phone-p')){if(c.style.top)c.style.top='';return;}
  let y=0;for(const id of ['radio','toast','fragTxt']){const e=document.getElementById(id);if(!e||e.hidden||e.offsetHeight===0)continue;const cs=getComputedStyle(e);if(+cs.opacity<.05||cs.display==='none')continue;const r=e.getBoundingClientRect();if(r.left<innerWidth*.5)y=Math.max(y,r.bottom);}
  const sp=document.getElementById('safeProbe'),base=sp?parseFloat(getComputedStyle(sp).paddingTop)||0:0;const want=y?Math.max(base+96,Math.round(y+8)):0;
  c.style.top=want?want+'px':'';}
// стопка монологов догоняет печатающийся текст каждый кадр, а не раз в 120 мс
(function loop25(){try{if(isMob()){mobStack74();cardStack25();}else cardStack25();}catch(e){}requestAnimationFrame(loop25);})();
fx25();


