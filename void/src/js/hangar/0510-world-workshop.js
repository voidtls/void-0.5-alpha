// ---- мастерская ----
function openShop(s){
  const S=G.save,p=G.player;if(!S||!p||G.state!=='world')return;if(S.carry>0){S.lom+=S.carry;S.carry=0;}
  p.hp=Math.max(p.hp,G.st.maxHp*(storyFlag('obod18')==='scrap'&&sectorIdx(s.x,s.y)===3?.8:1));scr6('shop');G.shopName=s.name;renderShop();show('sShop');shopType(shopLine());if(S.contracts.list.length&&S.story&&!S.story.seen['Д1'])radioForce('Д',0,1.5);saveWorld();
}
function renderShop(){
  const S=G.save;{const sh=$('#sShop .shop');if(!sh.dataset.st)sh.dataset.st='perks';const cy=S.cleared>=CORE;$('#shopTabCyc').hidden=!cy;if(!cy&&sh.dataset.st==='cyc')sh.dataset.st='perks';$('#shopTabs').querySelectorAll('[data-st]').forEach(b=>b.classList.toggle('on',b.dataset.st===sh.dataset.st));$('#shopTabsLom').innerHTML=lomH(S.lom,1);}$('#shopName').textContent=G.shopName+' · КОРПУС ВОССТАНОВЛЕН';
  $('#shopLom').innerHTML=`<span>ЛОМ ${lomH(S.lom,1)}</span>`;
  $('#shopPerks').innerHTML=Object.entries(PERKS).map(([k,P])=>{const l=S.perks[k]||0,max=l>=P.max,lockd=P.req&&S.cleared<P.req,cost=max?0:P.cost[l];
    const pips=Array.from({length:P.max},(_,j)=>`<i class="${j<l?'f':''}"></i>`).join('');
    return `<div class="perk"><div><h4>${P.name}</h4><div class="pips" style="margin:6px 0">${pips}</div><p>${P.d}${lockd?' Откроется после ядра Стража.':''}</p></div>
      <button class="wbtn amber" data-perk="${k}" ${max||lockd||S.lom<cost?'disabled':''}>${max?'ПРЕДЕЛ':lockd?'ЗАКРЫТО':'КУПИТЬ · '+lomH(cost)}</button></div>`;}).join('');
  const C=S.contracts;
  $('#shopCon').innerHTML=S.cleared<2&&(S.cycle||1)===1?'<p class="note">Контракты откроются после миссии 02.</p>':`<p class="note">Выполнено: ${C.done}.</p>`+(C.list.length?C.list.map((c,i)=>{const T=conT(c);if(!T)return '';
    return `<div class="perk"><div><h4>${T.s}</h4><p>${T.t(c.n)} · ${c.p}/${c.n} · ${lomH(c.lom)}</p><div class="cbar"><i style="width:${Math.round(c.p/c.n*100)}%"></i></div></div>
      <button class="wbtn" data-reroll="${i}" ${S.lom<20?'disabled':''}>ЗАМЕНИТЬ · ${lomH(20)}</button></div>`;}).join(''):'<p class="note">Доступных контрактов нет.</p>');
  $('#shopCycle').innerHTML=S.cleared>=CORE?`<div class="cx-h2">НОВЫЙ ЦИКЛ</div><div class="perk"><div><h4>Цикл ${roman((S.cycle||1)+1)}</h4><p>Сектор начинается заново: враги сильнее, награды больше. Перки, скины, уровень пилота и лом остаются.</p></div><button class="wbtn violet" data-cyc="1">ПОДРОБНЕЕ</button></div>`:'';
}
$('#shopTabs').addEventListener('click',e=>{const b=e.target.closest('[data-st]');if(!b)return;$('#sShop .shop').dataset.st=b.dataset.st;renderShop();$('#sShop').scrollTop=0;});
$('#shopCon').addEventListener('click',e=>{const b=e.target.closest('[data-reroll]');if(!b||b.disabled)return;const S=G.save,C=S.contracts,i=+b.dataset.reroll;if(S.lom<20||!C.list[i])return;
  const old=C.list[i];C.list.splice(i,1);const n=newContract();if(n)C.list.splice(i,0,n);else C.list.splice(i,0,old);if(n)S.lom-=20;saveWorld();sfx('pick');renderShop();});
$('#shopCycle').addEventListener('click',e=>{if(e.target.closest('[data-cyc]'))openCycle();});
function openCycle(){
  const S=G.save;if(!S||S.cleared<CORE)return;G.cycleFrom=G.state==='shop'?'shop':'world';scr6('cycle');const n=(S.cycle||1)+1;
  $('#cycEyebrow').textContent='НОВЫЙ ЦИКЛ · '+roman(S.cycle||1)+' → '+roman(n);$('#cycName').textContent='Цикл '+roman(n);
  $('#cycList').innerHTML=`<div><div class="eyebrow" style="color:var(--hostile)">СБРОСИТСЯ</div><ul><li>Пройденные миссии и узлы</li><li>Ворота и замки</li><li>Медали</li><li>Тайники, бортжурналы, аномалии, ретрансляторы</li><li>Награды первого разгрома патрулей</li><li>Разведанная карта</li></ul></div>
    <div><div class="eyebrow" style="color:var(--ice)">СОХРАНИТСЯ</div><ul><li>Перки мастерской</li><li>Купленные скины</li><li>Уровень пилота</li><li>Лом на складе: ${lomH(S.lom+(S.carry||0))}</li><li>Контракты</li><li>Рекорды Бесконечности</li></ul></div>`;
  $('#cycNote').textContent=`В цикле ${roman(n)} враги сильнее и их больше, а лома и опыта — больше.`;
  show('sCycle');(touchMode||$('#bCycBack').focus());
}
function closeCycle(){if(G.state!=='cycle')return;if(G.cycleFrom==='shop'){scr6('shop');renderShop();show('sShop');}else{scr6('world');G.cardKey=null;show('');}}
$('#bCycBack').onclick=closeCycle;$('#bCycGo').onclick=()=>{if(G.state!=='cycle')return;openReport();};
$('#bRepGo').onclick=()=>{if(G.state!=='report')return;newCycle();};
$('#shopPerks').addEventListener('click',e=>{const b=e.target.closest('[data-perk]');if(!b||b.disabled)return;const S=G.save,k=b.dataset.perk,P=PERKS[k],l=S.perks[k]||0;if(l>=P.max||S.lom<P.cost[l])return;
  S.lom-=P.cost[l];S.perks[k]=l+1;if(S.story)S.story.bought=1;computeStats();G.player.hp=G.st.maxHp;sfx('level');saveWorld();renderShop();});
function closeShop(){if(G.state!=='shop')return;scr6('world');G.cardKey=null;show('');}

