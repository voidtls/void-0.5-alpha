// ---- карта сектора ----
function openMap(tab){if(G.state!=='world')return;scr6('map');mapViewInit();buildMapLegend();$('#mapTip').hidden=true;show('sMap');mapTab(tab||'map');alphaJumpUI();}
// ВРЕМЕННО (альфа 0.5.9): список быстрого прыжка к любому уровню
function alphaJumpUI(){const el=$('#alphaJump');if(!el)return;if(!ALPHA_OPEN){el.hidden=true;return;}const S=G.save;
  let o='';for(const n of WORLD.nodes){const M=MISSIONS[n.m-1]||{},st=nodeState(n.m);o+=`<option value="${pad2(n.m)}">${pad2(n.m)} · ${M.name||''}${n.boss?' · БОСС':''}${st==='done'?' · ПРОЙДЕНА':''}</option>`;}
  o+='<option value="∞">∞ БЕЗДНА</option>';
  el.innerHTML=`<span class="aj-l">АЛЬФА · ПРЫЖОК К УРОВНЮ</span><select id="ajSel">${o}</select><button class="wbtn amber" id="ajGo">ПРЫЖОК</button>`;el.hidden=false;
  $('#ajGo').onclick=()=>alphaJump($('#ajSel').value);}
function alphaJump(label){if(G.state!=='map')return false;if(!G.mapPts||!G.mapPts.length)drawMap();const q=(G.mapPts||[]).find(z=>z.label===label);if(!q)return false;G.mapAnimJump=false;const r=mapJumpAt(q.px,q.py);G.mapAnimJump=undefined;return r;}
function mapTab(t){G.mapTab=t;document.querySelectorAll('#mapTabs [data-mt]').forEach(b=>b.classList.toggle('on',b.dataset.mt===t));
  $('#mapJr').hidden=t!=='jr';$('#mapPane').style.display=t==='jr'?'none':'grid';
  const S=G.save;$('#mtJr').firstChild.nodeValue='ЖУРНАЛЫ · '+journalIds().length+'/'+WORLD.journals.length+' ';
  if(t==='jr')renderJournals($('#mapJr'),true);else{ARCH.mapGen++;mapLoop();}/* ARCH·69 A-1 */}
function journalIds(){const S=G.save;if(!S)return [];const ids=(S.jOrder||[]).filter((id,i,a)=>a.indexOf(id)===i&&S.journals[id]&&WORLD.journals.some(j=>j.id===id));
  for(const j of WORLD.journals)if(S.journals[j.id]&&!ids.includes(j.id))ids.push(j.id);return ids;}
function renderJournals(el,mapBtn){
  const S=G.save,ids=journalIds(),p=G.player;
  const card=j=>`<div class="jr"><h4>${j.title}</h4><p>${j.text}</p><div class="jhull"><canvas data-wr="${j.id}" width="96" height="96"></canvas><span>${hullLine(j)}</span></div><div class="meta"><span>${sectorName(j.x,j.y)}${p&&G.mode==='world'?' · '+fmtAU(Math.hypot(j.x-p.x,j.y-p.y)):''}</span>${mapBtn?`<button class="wbtn" data-jmap="${j.id}">НА КАРТЕ</button>`:''}</div></div>`;
  let h=`<p class="note">Найдено записей: ${ids.length} из ${WORLD.journals.length}. Записи остались на обломках кораблей — подлетите к мигающему корпусу.</p>`;
  WORLD.sectors.forEach((sc,si)=>{const all=WORLD.journals.filter(j=>j.sec===si),got=all.filter(j=>S.journals[j.id]);if(!all.length)return;
    h+=`<div class="jsec${got.length?'':' empty'}">${roman(si+1)} · ${sc.name} <small>${got.length}/${all.length}</small></div>`;
    h+=got.map(card).join('');});
  {const ws=S&&typeof w58S==='function'?w58S():null;if(ws){const got=W58.recs.filter(r=>ws.arcRec.includes(r.id));h+=`<div class="jsec">ЗАПИСИ АРХИВА <small>${got.length}/6</small></div>`+(got.length?got.map(r=>`<div class="jr"><h4>${r.title}</h4><p>${w58RecText(r)}</p></div>`).join(''):'<div class="jr lockd"><h4>— НЕ НАЙДЕНО —</h4><p>Ледяные капсулы дрейфуют по Холодному архиву. Их шесть.</p></div>');}}
  const fr=S&&S.story?Object.entries(S.story.frags).sort((a,b)=>a[1]-b[1]):[];
  h+=`<div class="jsec">ФРАГМЕНТЫ ПАМЯТИ <small>${fr.length}/15</small></div>`+(fr.length?fr.map(([,n])=>`<div class="jr frag"><h4>ФРАГМЕНТ ${n}</h4><p>${STORY_FRAG[n-1]}</p></div>`).join(''):'<div class="jr lockd"><h4>НЕ НАЙДЕНО</h4><p>Белые осколки света. Некоторые лежат там, где пространство уже не держит форму.</p></div>');
  if(typeof zbJournalsHTML==='function')h+=zbJournalsHTML(S);el.innerHTML=h;try{wreckIconsFill(el);}catch(e){console.error(e);}
}
$('#mapTabs').addEventListener('click',e=>{const b=e.target.closest('[data-mt]');if(b&&G.state==='map')mapTab(b.dataset.mt);});
$('#mapJr').addEventListener('click',e=>{const b=e.target.closest('[data-jmap]');if(!b)return;const j=WORLD.journals.find(q=>q.id===b.dataset.jmap);if(!j)return;G.mapHi={x:j.x,y:j.y,until:performance.now()+3000};mapTab('map');});
function closeMap(){if(G.state!=='map')return;scr6('world');G.cardKey=null;show('');}
function jumpPoints(){const S=G.save,pts=[];
  WORLD.nodes.forEach(n=>{if(nodeState(n.m)==='done'||ALPHA_OPEN/* ВРЕМЕННО (альфа 0.5.9): прыжок к любому узлу */)pts.push({x:n.x,y:n.y+150,label:pad2(n.m)});});
  WORLD.sectors.slice(2).forEach((sc,i)=>pts.push({x:sc.bx,y:sc.by+150,label:roman(i+3)}));
  WORLD.shops.forEach(s=>{pts.push({x:s.x,y:s.y+150,label:'М'});});
  WORLD.relays.forEach(r=>{if(S.relays[r.id])pts.push({x:r.x,y:r.y+120,label:'Р'});});
  pts.push({x:WORLD.hangar.x,y:WORLD.hangar.y+150,label:'А'});
  if(arsOpen())pts.push({x:WORLD.arsenal.x,y:WORLD.arsenal.y+150,label:'И'});
  if(abyssOpen()&&(revealedAt(WORLD.abyss.x,WORLD.abyss.y)||ALPHA_OPEN/* ВРЕМЕННО (альфа 0.5.9) */))pts.push({x:WORLD.abyss.x,y:WORLD.abyss.y+150,label:'∞'});return pts.filter(q=>!fogBlockedAt(q.x,q.y-150));}


