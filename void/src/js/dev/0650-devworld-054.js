// ===== DEV-WORLD 0.5.4 =====
// Открытый мир разработчика (песочница). Весь режим — в этом блоке; в остальном коде только зацепки /*DEVW*/ вида
// `window.DEVW&&DEVW.…`, которые без блока ничего не делают. Скрыть режим: DEVW_ENABLED=false. Удалить: вырезать блок.
const DEVW_ENABLED=true;
window.DEVW=(function(){
  const KEY='void_devworld',FLAG='void_devstate',SPD=[.5,1,2,4,8],warn=[],blocked={},BAR0='РАЗРАБОТКА · НЕ СОХРАНЯЕТСЯ · ` ПАНЕЛЬ';
  let tok=0,autoT=null;
  const on=()=>DEVW_ENABLED&&!!G.devWorld;
  const flag=()=>{try{return !!(JSON.parse(LS.getItem(FLAG)||'null')||{}).on;}catch(e){try{LS.removeItem(FLAG);}catch(_){}return false;}};
  const setFlag=()=>{try{LS.setItem(FLAG,JSON.stringify({on:1,since:Date.now(),ver:'0.5.4'}));}catch(e){}};
  const rmFlag=()=>{try{LS.removeItem(FLAG);}catch(e){}};
  if(!DEVW_ENABLED)rmFlag();
  const spd=()=>{const v=+G.dev.wspeed;return SPD.includes(v)?v:1;};
  // --- стили и элементы (создаются кодом, чтобы удаление блока убирало и их) ---
  const css=document.createElement('style');css.textContent=`
#dwPanel{position:fixed;right:max(16px,env(safe-area-inset-right,0px));top:calc(104px + env(safe-area-inset-top,0px));width:min(300px,calc(100% - 32px));max-height:calc(100% - 140px);overflow:auto;display:grid;gap:6px;padding:12px;border:1px solid #00ff8866;background:rgba(4,10,8,.94);font-family:var(--f-mono);font-size:11px;color:#bfffe0;z-index:7}
#dwPanel .h{color:#00ff88;letter-spacing:.16em;margin-top:4px}
#dwPanel .r{display:flex;flex-wrap:wrap;gap:4px}
#dwPanel button,#dwPanel select{border:1px solid #00ff8844;background:none;color:#bfffe0;padding:6px 8px;font-family:var(--f-mono);font-size:11px;letter-spacing:.06em}
#dwPanel button.on{background:#00ff8833;border-color:#00ff88;color:#fff}
#dwPanel .x{border-color:#00ff88;color:#00ff88}
#dwAuto{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);width:min(360px,calc(100% - 32px));border:1px solid #00ff8866;background:rgba(4,10,8,.9);color:#00ff88;font-family:var(--f-mono);font-size:11px;letter-spacing:.12em;padding:8px 10px;z-index:30;text-align:center}
#dwAuto i{display:block;height:2px;background:#00ff88;margin-top:6px;transform-origin:left;animation:dwbar 2.5s linear forwards}
@keyframes dwbar{from{transform:scaleX(1)}to{transform:scaleX(0)}}
#dwStrip{border:1px solid #00ff8866;background:#00ff8814;color:#00ff88;font-family:var(--f-mono);font-size:11px;letter-spacing:.12em;padding:10px 12px;display:grid;gap:8px;margin-bottom:14px}
#dwStrip .r{display:flex;flex-wrap:wrap;gap:8px}
#dwStrip button{border:1px solid #00ff8866;background:none;color:#bfffe0;padding:7px 10px;font-family:var(--f-mono);font-size:11px;letter-spacing:.08em}
#bDevExit{border-color:#00ff88!important;color:#00ff88!important}
.devm.dw b{color:#00ff88}`;document.head.appendChild(css);
  const el=(tag,id,html)=>{let e=document.getElementById(id);if(!e){e=document.createElement(tag);e.id=id;e.hidden=true;document.body.appendChild(e);}if(html!==undefined)e.innerHTML=html;return e;};
  // --- песочница: подготовка сохранения ---
  function prep(S){
    S.cleared=Math.max(S.cleared||0,CORE);S.gate=true;S.intro=true;delete S.migrated;if(S.story)S.story.prologue=1;
    S.pilot=S.pilot||{lvl:1,xp:0};S.pilot.lvl=Math.max(S.pilot.lvl||1,30);S.ownSkins=Object.keys(SKINS);S.skins=Object.keys(SKINS);
    S.relays=S.relays||{};for(const r of WORLD.relays)S.relays[r.id]=1;S.reveal='1'.repeat(FGW*FGH);return S;}
  function resetCaches(){try{MAPC.fog=null;MAPC.fogVer=null;MAPC.rift=null;MAPC.riftKey=null;}catch(e){}
    Object.assign(G,{unlockPending:null,boostMsg:0,card:null,cardKey:null,lomPrev:undefined,radio:null,unlockFx:null,mapHi:null,pilotUps:[]});cancelAuto();}
  function reloadRec(){const s=store('void_record')||{};for(const k in REC)delete REC[k];Object.assign(REC,{best:0,maxMission:0,seen:['scout']},s);}
  function enter(){if(!DEVW_ENABLED)return;
    G.devWorld=true;setFlag();let S=migrateSave(store(KEY));const first=!S;
    if(!S){S=migrateSave(newSave());S.cycle=G.dev.cycle||1;S.diff=G.dev.diff||'easy';}
    if(!S.devw){S.devw=1;S.lom=Math.max(S.lom||0,5000);}
    prep(S);store(KEY,S);resetCaches();$('#devPanel').hidden=true;G.devRun=false;G.fromAbyss=false;
    startWorld(false);
    if(first)toast('ОТКРЫТЫЙ МИР · ПЕСОЧНИЦА','Всё открыто. Награды остаются здесь и не попадают в игру. [ ] — скорость, Ё — панель, ESC дважды — выход.');
    else banner('МИР РАЗРАБОТЧИКА','ПЕСОЧНИЦА · СКОРОСТЬ ×'+fmtS(spd()));}
  // выход из режима: песочница сохранена, настоящая игра — как до входа
  function exit(){if(!on())return;
    if(G.mode==='world'&&G.world&&G.player)saveWorld();
    G.devWorld=false;rmFlag();panel(false);resetCaches();reloadRec();
    saveSet6(migrateSave(store('void_world')),'load');G.inRun=false;G.fromAbyss=false;
    if(G.prologue)prologueEnd();radioClear();$('#toast').hidden=true;
    openDev();toast('РЕЖИМ РАЗРАБОТЧИКА ВЫКЛЮЧЕН','Настоящий прогресс не изменился.');}
  // уход в главное меню без выхода из режима: флаг остаётся, меню показывает настоящую игру
  function suspend(){G.devWorld=false;panel(false);resetCaches();reloadRec();saveSet6(migrateSave(store('void_world')),'load');}
  function clearFlag(say){if(!flag())return;rmFlag();if(say)setTimeout(()=>toast('РЕЖИМ РАЗРАБОТЧИКА ВЫКЛЮЧЕН','Запущена настоящая игра. Песочница сохранена.'),50);}
  // --- запись: сторож настоящего сохранения ---
  function block(k){if(!on())return false;
    if(k==='void_world'){warn.push('void_world · '+((new Error().stack||'').split('\n')[3]||'').trim());return true;}
    if(k==='void_record'||k==='void_endless'){blocked[k]=(blocked[k]||0)+1;return true;}return false;}
  // --- движение в мире ---
  function move(dt){const st=G.st,v=spd();st.speed*=v;const n=v>2?Math.ceil(v/2):1;
    for(let i=0;i<n;i++){updatePlayer(dt/n);if(n>1){const p=G.player;for(const r of G.rocks){const d=Math.hypot(p.x-r.x,p.y-r.y),m=r.r+p.r*.8;if(d<m&&d>0){p.x=r.x+(p.x-r.x)/d*m;p.y=r.y+(p.y-r.y)/d*m;}}}}}
  const fmtS=v=>String(v).replace('.',',');
  function setSpd(v){G.dev.wspeed=v;store('void_dev',G.dev);ui();if(G.player&&G.world)floater(G.player.x,G.player.y-40,'СКОРОСТЬ ×'+fmtS(v),'#00ff88');const P=document.getElementById('dwPanel');if(P&&!P.hidden)renderPanel();}
  function stepSpd(d){const i=SPD.indexOf(spd());setSpd(SPD[clamp(i+d,0,SPD.length-1)]);}
  // --- клавиши ---
  function key(e){const c=e.code;
    if(G.state==='world'){
      if(c==='BracketLeft'||c==='Minus'){stepSpd(-1);return true;}
      if(c==='BracketRight'||c==='Equal'){stepSpd(1);return true;}
      if(c==='Backquote'){panel();return true;}
      const P=document.getElementById('dwPanel');if(c==='Escape'&&P&&!P.hidden){panel(false);return true;}
      return false;}
    if(G.state==='pause'&&G.pausedWorld&&c==='Escape'){exit();return true;}
    if((G.state==='done'||G.state==='over')&&autoT&&(c==='Enter'||c==='Space')&&document.activeElement.tagName!=='BUTTON'){e.preventDefault();autoGo();return true;}
    return false;}
  // --- автовозврат после миссии ---
  function cancelAuto(){if(autoT){clearTimeout(autoT.h);autoT=null;}const a=document.getElementById('dwAuto');if(a)a.hidden=true;}
  function after(kind){cancelAuto();const my=++tok,m=G.m;
    const eb=kind==='done'?'#dnEyebrow':'#ovEyebrow',E=$(eb);if(E&&!E.textContent.startsWith('РАЗРАБОТКА'))E.textContent='РАЗРАБОТКА · НЕ ЗАПИСАНО В ИГРУ · '+E.textContent;
    el('div','dwAuto','<span>ВОЗВРАТ В МИР РАЗРАБОТЧИКА · ENTER — СРАЗУ</span><i></i>').hidden=false;
    autoT={kind,m,my,h:setTimeout(()=>{if(autoT&&autoT.my===my)autoGo();},2500)};}
  function autoGo(){const a=autoT;cancelAuto();if(!a||!on()||G.state!==a.kind||G.m!==a.m)return;
    if(a.kind==='done')returnToWorld();else{restoreRun();returnToWorld();}}
  // --- пауза ---
  function pauseUI(){let b=document.getElementById('bDevExit');const box=document.querySelector('#sPause .btns');
    if(!b&&box){b=document.createElement('button');b.className='btn';b.id='bDevExit';b.textContent='ВЫЙТИ ИЗ РЕЖИМА РАЗРАБОТЧИКА · ESC';b.onclick=()=>exit();box.insertBefore(b,box.firstChild);}
    if(!b)return;const show_=on()&&G.pausedWorld;b.hidden=!show_;
    $('#bResume').innerHTML=show_?'ПРОДОЛЖИТЬ <kbd>P</kbd>':'ПРОДОЛЖИТЬ <kbd>ESC</kbd>';}
  // --- HUD ---
  function ui(){const bar=$('#devBar');if(!bar)return;
    if(on()){const st=G.state,world=st==='world'||(st==='pause'&&G.pausedWorld);
      bar.textContent=world?'РАЗРАБОТКА · МИР · ×'+fmtS(spd())+' · [ ] СКОРОСТЬ · Ё ПАНЕЛЬ · ESC×2 ВЫХОД':'РАЗРАБОТКА · ПЕСОЧНИЦА · НЕ ЗАПИСАНО В ИГРУ · Ё ПАНЕЛЬ';
      bar.hidden=!['world','play','levelup'].includes(st);
      $('#devBtn').hidden=!(st==='play'||st==='world');}
    else if(bar.textContent!==BAR0)bar.textContent=BAR0;
    const P=document.getElementById('dwPanel');if(P&&(G.state!=='world'||!on()))P.hidden=true;
    if(G.state!=='done'&&G.state!=='over')cancelAuto();}
  // --- панель в мире ---
  function panel(force){const P=el('div','dwPanel');P.hidden=force!==undefined?!force:!P.hidden;if(!P.hidden)renderPanel();}
  window.W58DEV=k=>{try{w58Dev(k);}catch(e){console.error(e);}};
  function renderPanel(){const P=el('div','dwPanel'),S=G.save,v=spd(),D=G.dev;
    const opt=(a,f)=>a.map((x,i)=>`<option value="${i}">${f(x,i)}</option>`).join('');
    P.innerHTML=`<div class="h">МИР РАЗРАБОТЧИКА · ЛОМ ${fmtN(Math.round(S.lom))}</div>
      <div class="h">СКОРОСТЬ</div><div class="r">${SPD.map(x=>`<button data-dw="spd" data-v="${x}" class="${x===v?'on':''}">×${fmtS(x)}</button>`).join('')}</div>
      <div class="h">ЛОМ</div><div class="r"><button data-dw="lom" data-v="500">+500</button><button data-dw="lom" data-v="5000">+5 000</button><button data-dw="lom0">0</button></div>
      <div class="h">ПРЫЖОК</div><div class="r"><select id="dwNode">${opt(WORLD.nodes,(n,i)=>'УЗЕЛ '+pad2(i+1)+(BOSS_LV.has(i+1)?' · БОСС':''))}</select><button data-dw="node">К УЗЛУ</button></div>
      <div class="r"><select id="dwSec">${opt(WORLD.sectors,(s,i)=>roman(i+1)+' · '+s.name)}</select><button data-dw="sec">К СЕКТОРУ</button></div>
      <div class="r"><button data-dw="hangar">ХРАНИЛИЩЕ</button><button data-dw="abyss">БЕЗДНА</button></div>
      <div class="h">СЮЖЕТ · ЦИКЛ ${roman(S.cycle||1)}</div><div class="r"><button data-dw="read">ВСЕ ЗАПИСИ</button><button data-dw="frag" data-v="0">ФРАГМ. 0</button><button data-dw="frag" data-v="6">6</button><button data-dw="frag" data-v="15">15</button></div>
      <div class="r"><button data-dw="ero" data-v="0">ЭРОЗИЯ 0</button><button data-dw="ero" data-v=".5">0,5</button><button data-dw="ero" data-v="1">1</button><button data-dw="cyc" data-v="-1">ЦИКЛ −</button><button data-dw="cyc" data-v="1">ЦИКЛ +</button></div>
      <div class="h">ПЕРЕКЛЮЧАТЕЛИ</div><div class="r">${[['god','БЕССМЕРТИЕ'],['bcGod','МАЯК'],['hit','ХИТБОКСЫ'],['fps','FPS']].map(([k,n])=>`<button data-dw="tog" data-v="${k}" class="${D[k]?'on':''}">${n}</button>`).join('')}</div>
      <button data-dw="exit" class="x">ВЫЙТИ ИЗ РЕЖИМА РАЗРАБОТЧИКА</button>`;}
  function jumpTo(x,y){enterWorldAt(x,y);saveWorld();}
  function act(a,v,b){const S=G.save;if(!on()||G.state!=='world')return;
    if(a==='spd')setSpd(+v);
    if(a==='lom'){S.lom+=+v;G.lomPrev=undefined;saveWorld();floater(G.player.x,G.player.y-40,'+'+fmtN(+v)+' ЛОМА · ПЕСОЧНИЦА','#00ff88');}
    if(a==='lom0'){S.lom=0;S.carry=0;G.lomPrev=undefined;saveWorld();}
    if(a==='node'){const n=WORLD.nodes[+$('#dwNode').value];jumpTo(n.x,n.y+160);}
    if(a==='sec'){const s=WORLD.sectors[+$('#dwSec').value];jumpTo(s.bx||(s.box[0]+s.box[2])/2,(s.by||(s.box[1]+s.box[3])/2)+150);}
    if(a==='hangar')jumpTo(WORLD.hangar.x,WORLD.hangar.y+150);
    if(a==='abyss')jumpTo(WORLD.abyss.x,WORLD.abyss.y+260);
    if(a==='read'){VOID_DBG.readAll();saveWorld();}
    if(a==='frag'){VOID_DBG.frags(+v);saveWorld();}
    if(a==='ero'){VOID_DBG.erosion(+v);saveWorld();}
    if(a==='cyc'){S.cycle=clamp((S.cycle||1)+(+v),1,9);saveWorld();}
    if(a==='tog'){G.dev[v]=!G.dev[v];store('void_dev',G.dev);}
    if(a==='exit'){exit();return;}
    {const P=document.getElementById('dwPanel');if(P&&!P.hidden)renderPanel();}}
  document.addEventListener('click',e=>{const b=e.target.closest('#dwPanel [data-dw]');if(b){e.stopPropagation();act(b.dataset.dw,b.dataset.v,b);}});
  // --- экран разработчика: карточка и скорость ---
  function devCard(){const g=$('#devGrid');if(!g||!DEVW_ENABLED)return;
    const c=document.createElement('button');c.className='devm dw';c.id='dwCard';c.innerHTML=`<b>◎</b><span>Открытый мир</span><small>ПЕСОЧНИЦА · НЕ СОХРАНЯЕТСЯ В ИГРУ</small>`;
    c.onclick=e=>{e.stopPropagation();enter();};g.appendChild(c);
    let r=document.getElementById('dwOpts');if(!r){r=document.createElement('div');r.id='dwOpts';const at=$('#devBuild');at.parentNode.insertBefore(r,at.previousElementSibling);}
    const has=!!store(KEY);
    r.innerHTML=`<div class="eyebrow" style="color:#00ff88">ОТКРЫТЫЙ МИР · СКОРОСТЬ ПОЛЁТА</div><div class="seg">${SPD.map(x=>`<button data-dws="${x}" class="${x===spd()?'on':''}">×${fmtS(x)}</button>`).join('')}${has?`<button id="dwReset" style="margin-left:12px">СБРОСИТЬ ПЕСОЧНИЦУ</button>`:''}</div>`;
    r.querySelectorAll('[data-dws]').forEach(b=>b.onclick=()=>{G.dev.wspeed=+b.dataset.dws;store('void_dev',G.dev);devCard2();});
    const rb=document.getElementById('dwReset');if(rb){let arm=0;rb.onclick=()=>{if(!arm){arm=1;rb.textContent='ТОЧНО? НАЖМИТЕ ЕЩЁ РАЗ';return;}try{LS.removeItem(KEY);}catch(e){}rb.remove();toast('ПЕСОЧНИЦА СБРОШЕНА','Следующий вход начнёт открытый мир разработчика заново.');};}}
  function devCard2(){document.querySelectorAll('#dwOpts [data-dws]').forEach(b=>b.classList.toggle('on',+b.dataset.dws===spd()));}
  // --- главное меню: полоса режима ---
  function menu(){const box=document.querySelector('#sMenu .wrap');if(!box)return;let s=document.getElementById('dwStrip');
    if(!DEVW_ENABLED||!flag()){if(s)s.hidden=true;return;}
    if(!s){s=document.createElement('div');s.id='dwStrip';box.insertBefore(s,box.firstChild);
      s.innerHTML=`<div>РЕЖИМ РАЗРАБОТЧИКА ВКЛЮЧЁН · ПРОГРЕСС НЕ СОХРАНЯЕТСЯ В ИГРУ</div><div class="r"><button id="dwBack">ВЕРНУТЬСЯ В МИР РАЗРАБОТЧИКА</button><button id="dwOff">ВЫЙТИ ИЗ РЕЖИМА</button></div>`;
      s.querySelector('#dwBack').onclick=()=>enter();s.querySelector('#dwOff').onclick=()=>{rmFlag();renderMenu();toast('РЕЖИМ РАЗРАБОТЧИКА ВЫКЛЮЧЕН','Настоящий прогресс не изменился.');};}
    s.hidden=false;}
  return {on,flag,spd,enter,exit,suspend,clearFlag,block,move,key,after,pauseUI,ui,panel,devCard,menu,prep,warn,blocked,KEY,
    stats(){return {on:on(),flag:flag(),spd:spd(),warn:warn.slice(),blocked:{...blocked}};}};
})();
// ===== /DEV-WORLD =====

