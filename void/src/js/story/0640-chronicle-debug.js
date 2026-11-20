// ---------- кодекс «Хроника» ----------
function chronicleHTML(){const S=G.save,s=S&&S.story,e=erosion();
  let h=`<dl class="kv"><dt>Лом</dt><dd>Остаточные записи. Энергия, извлечённая из того, что перестало существовать. Система не хранит источники.</dd>
  <dt>Маяк</dt><dd>Узел сети, которая удерживает реальность на месте. Заряженный маяк сохраняет одну историю. Остальные он не спрашивает.</dd>
  <dt>Разлом</dt><dd>За пределами секторов пространство не держит форму: помехи нарастают, а в глубине стреляют Неизвестные — их выстрелы убивают сразу. Спасает только рывок.</dd>`;
  if(e>=.2)h+=`<dt>Эрозия</dt><dd>Края секторов осыпаются. Причина: не установлена.</dd>`;
  if(s&&s.inv14==='memory')h+=`<dt>Циклы I–XXXI</dt><dd>Записи Инвентаризатора оттаяли. Тридцать одна копия VØID-013, один почерк. На полях трёх записей — рука Э. В.: «Ты снова выбрал холод. Не выбирай». «Третий путь — не вперёд и не назад». «Если читаешь это оттаявшим — значит, впервые не повторил».</dd>`;
  if(s&&s.inv14==='cold')h+=`<dt>Картотека</dt><dd>Ядро памяти сожжено. Тридцать одна запись исчезла вместе с тем, как именно они ошиблись. Архив молчит.</dd>`;
  if(s&&s.obod18)h+=`<dt>Обод</dt><dd>${s.obod18==='scrap'?'Станция списана. Кольцо не вращается, фонового износа в Хрониках больше нет; мастерские сектора IV восстанавливают корпус только до 80%.':'Заказ закрыт: корабль восстановлен до заводского. Перк «Заводской корпус»: фоновый износ вдвое медленнее, ремкомплект возвращает 10% износа. На листе обшивки — копия списка колонистов «Тихой».'}</dd>`;
  if(s&&s.arcAll)h+=`<dt>Каталог циклов</dt><dd>Шесть записей Архива собраны. Тридцать один цикл до этого: кто-то летел слишком быстро, кто-то отказался от щита, кто-то спросил, сколько их было. Э. В. правил их все на полях.</dd>`;
  if(s&&s.arcSilence)h+=`<dt>Тишина в Архиве</dt><dd>Три радиомаяка снесены. Холодный архив больше не слышит сектор, и Инвентаризатор начинает сверку с опозданием.</dd>`;
  if(s&&s.conveyor)h+=`<dt>Колыбельная</dt><dd>Баржа с тремя криокапсулами выведена с линии утилизации «Обода». Трое живы. Они не знают, кто вы, но запомнят.</dd>`;
  if(s&&s.cradle22)h+=`<dt>Кормилица</dt><dd>${s.cradle22==='cut'?'Кокон разбит. Следующая копия VØID не родилась в этой колыбели. Очередь копий: разрыв.':'Кокон выношен. Младший летит рядом в секторах V–VI. На его борту — номер следующего цикла.'}</dd>`;
  if(s&&s.fleet27)h+=`<dt>«Последний довод»</dt><dd>${s.fleet27==='bridge'?'Рубка пробита. Адмирал Карр так и не узнал, почему Стражи не стреляли в неё.':'Двигатели выбиты, рубка цела — как сделали Стражи 127 лет назад. Протокол «не объяснять», дополнение 7: «Людей не убивать». Перк «Милость»: отступающие сдаются от попадания.'}</dd>`;
  if(s&&s.save33)h+=`<dt>Выбор сохранения</dt><dd>${s.save33==='dead'?'Вы сохранили запись мёртвого вида. Зародышу питания не хватило.':'Вы сохранили зародыш. Запись мёртвого вида стёрлась.'}</dd>`;
  if(s&&s.history.length)h+=`<dt>Отчёты</dt><dd>${s.history.slice().reverse().map(r=>`Цикл ${roman(r.cyc)}: миссий ${r.missions}, поглощено ${fmtN(r.abs)}, отпущено ${r.spared}, записей ${r.read}/63, фрагментов ${r.frags}/15 — ${r.fin.toLowerCase()}.`).join('<br>')}</dd>`;
  return h+chron85(s)+chron90(s)+'</dl>';}

// ---------- отладка ----------
window.VOID_DBG={
  story(){const S=G.save;if(!S)return null;const s=S.story,bySec={};for(const j of WORLD.journals){bySec[j.sec]=bySec[j.sec]||[0,0];bySec[j.sec][1]++;if(S.journals[j.id])bySec[j.sec][0]++;}
    const seen={};for(const k in s.seen){const g=k[0];seen[g]=(seen[g]||0)+1;}return {abs:Math.round(s.absorbed),eros:+erosion().toFixed(2),spared:s.spared,fk:s.fleeKilled,warden:s.wardenMeets,frags:Object.keys(s.frags).length,rw:s.riftWrecks.length,bySec,seen,off:{...STORY_OFF},warn:STORY_WARN.slice()};},
  check(){const out={n:WORLD.journals.length,errs:[]};const cnt={};let skins={};const W_=WORLD.journals;
    W_.forEach(j=>{cnt[j.sec]=(cnt[j.sec]||0)+1;if(j.skin!=='base'&&j.skin!=='guard')skins[j.skin]=(skins[j.skin]||0)+1;if(!inSectors(j.x,j.y)||sectorIdx(j.x,j.y)!==j.sec)out.errs.push('sec '+j.id);});
    out.dist=Object.keys(cnt).sort((a,b)=>a-b).map(k=>cnt[k]).join('/');out.skins=skins;out.ids=new Set(W_.map(j=>j.id)).size;
    const obs=storyObstacles();W_.forEach(j=>{if(j.sec<=1)return;const d=Math.min(...obs.map(q=>Math.hypot(q.x-j.x,q.y-j.y)));if(d<200)out.errs.push('near '+j.id+' '+Math.round(d));
      W_.forEach(k=>{if(k!==j&&k.sec>1&&Math.hypot(k.x-j.x,k.y-j.y)<150)out.errs.push('pair '+j.id+'/'+k.id);});});
    out.frags=STORY_FRAGS.length;out.radio=Object.values(RADIO).reduce((a,g)=>a+g.l.length,0);out.fragTexts=STORY_FRAG.length;
    out.fullName=document.documentElement.innerHTML.includes(String.fromCharCode(1069,1083,1080,1072,1089));return out;},
  tp(k){const p=G.player;let q=null;if(k[0]==='w'||k[0]==='j')q=WORLD.journals.find(j=>j.id===k||('w'+j.n)===k);else if(k[0]==='f'){const f=STORY_FRAGS.find(f=>f.id===k);q=f&&fragPos(f);}
    else if(k[0]==='n')q=WORLD.nodes[+k.slice(1)-1];else if(k[0]==='s'){const s=WORLD.sectors[+k.slice(1)-1];q={x:s.bx||(s.box[0]+s.box[2])/2,y:(s.by||(s.box[1]+s.box[3])/2)+150};}
    if(q&&p){p.x=q.x;p.y=q.y+(k[0]==='n'?160:0);p.vx=p.vy=0;camSnap();}return q;},
  cycle(n){G.save.cycle=n;return n;},frags(n){const S=G.save;S.story.frags={};STORY_FRAGS.slice(0,n).forEach((f,i)=>S.story.frags[f.id]=i+1);MAPC.rift=null;storyFixLast();return n;},
  erosion(x){G.save.story.absorbed=x*EROSION_FULL;G.lomPrev=undefined;MAPC.rift=null;return x;},radio(g){const p=radioPick(g);if(p)radioSay(p.g,p.i);return p;},
  readAll(){WORLD.journals.forEach(j=>{G.save.journals[j.id]=1;if(!G.save.jOrder.includes(j.id))G.save.jOrder.push(j.id);});return journalIds().length;},
  prologue(l){prologueStart(l!==false);},flee(){const e=G.enemies.filter(o=>o.alive&&!STORY_NORETREAT.has(o.type)&&!STATIC.has(o.type)).sort((a,b)=>Math.hypot(a.x-G.player.x,a.y-G.player.y)-Math.hypot(b.x-G.player.x,b.y-G.player.y))[0];if(e)storyRetreat(e);return e&&e.type;},
  wrecks(on){return wreckGrid(on);},wreck(n){const j=WORLD.journals.find(q=>q.n===n);if(!j)return null;const p=G.player;if(p){p.x=j.x;p.y=j.y+180;p.vx=p.vy=0;camSnap();}const s=wreckSprite(j,true),sp=wreckSpec(j);
    return {n,id:j.id,sec:j.sec+1,own:sp.own,skin:sp.skin,hull:sp.hull,dmg:sp.dmg,cls:sp.cls,variant:sp.variant,size:sp.size,seed:j.n*7919+3,pieces:s.pieces.length,rv:Math.round(s.rv),ms:+(s.ms||0).toFixed(2),line:hullLine(j)};},
  wreckStats(){return {built:WRK.n,cached:Object.keys(WRECK_SPR).length,maxMs:+Math.max(0,...WRK.ms).toFixed(2),avgMs:+(WRK.ms.reduce((a,b)=>a+b,0)/(WRK.ms.length||1)).toFixed(2)};},
  off(k){STORY_OFF[k]=1;},on(k){delete STORY_OFF[k];},save(){return JSON.stringify(G.save);},load(s){store(saveKey(),JSON.parse(s));saveSet6(migrateSave(store(saveKey())),'load');return true;}};

