// ===== 0.8.5: мир после выборов, награды, справочник, хроника =====
function own85(k){const S=G.save;if(S&&S.ownSkins&&!S.ownSkins.includes(k))S.ownSkins.push(k);}
Object.assign(SKINS,{
  shard85:{name:'Осколок лекала',col:'#e8d27a',bul:'#fff0b0',trail:'#ffd36b',d:'Жёлтая балка рамы, вся в трещинах.',unlock:0,find:'СЕКТОР VII · РАЗБИТЬ ЛЕКАЛО'},
  serial013:{name:'Серия 013',col:'#8fe9ff',bul:'#c9f4ff',trail:'#e8d27a',d:'Корпус по вашему лекалу: ваш цвет и номер 013 на борту.',unlock:0,find:'СЕКТОР VII · ПЕРЕПИСАТЬ ЛЕКАЛО'},
  silence85:{name:'Тишина',col:'#3a4258',bul:'#9fb0c4',trail:'#1a2030',d:'Чёрный корпус без огней.',unlock:0,find:'СЕКТОР VIII · ЗАГЛУШИТЬ'},
  callsign013:{name:'Позывной 013',col:'#6b8cff',bul:'#cfe0ff',trail:'#6b8cff',d:'Синие огни мигают в ритм сигнала.',unlock:0,find:'СЕКТОР VIII · ОТВЕТИТЬ'},
  carrier85:{name:'Несущая',col:'#ffffff',bul:'#ffffff',trail:'#9fb8ff',d:'Белый корпус, по контуру бежит волна.',unlock:0,find:'СЕКТОР VIII · ???'}});
Object.assign(STORY_HULL,{shard85:'Обшивка из балки разбитого лекала. «ИЗД. 000» — теперь просто металл.',serial013:'Корпус по новому лекалу. Номер 013 — ваш, а не партии.',silence85:'Корпус без огней. После колодца ему нечего передавать.',
  callsign013:'Огни мигают позывным: три коротких, три длинных, три коротких — вашими словами.',carrier85:'Несущая частота за краем карты. Корпус светится, как сигнал, который ещё никто не слышал.'});
for(const k of ['shard85','serial013','silence85','callsign013','carrier85'])SKINS[k].d=STORY_HULL[k];
Object.assign(HULL_NUM,{shard85:'000',serial013:'013',silence85:'—',callsign013:'013',carrier85:'∞'});
{const ALT={shard85:['line31','break'],serial013:['line31','write'],silence85:['well38','silence'],callsign013:['well38','answer'],carrier85:['well38','third']};
  for(const k in ALT){const [f,v]=ALT[k],base=SKINS[k].find;Object.defineProperty(SKINS[k],'find',{get(){const c=storyFlag(f);return c&&c!==v?'ДРУГОЙ ВЫБОР':base;},configurable:true,enumerable:true});}}
// мастерство (индекс — номер миссии минус один)
MASTERY[30]={t:'Ни одного Серийника в серии: разбить все заготовки до конца сборки',ok:()=>!!G.mc&&!!G.mc.lek85&&!G.mc.serial85};
MASTERY[37]={t:'Ни одного голоса колодцу: ни один Паломник не долетел и не пострадал',ok:()=>!!G.mc&&!!G.mc.well85&&!G.mc.absorb38&&!G.mc.pilHit38};
// справочник: лор боссов открывается после победы
function beat85(m){const S=G.save;return !!(S&&S.medals&&S.medals[m]&&S.medals[m].clear)||!!storyFlag(m===31?'line31':'well38');}
Object.defineProperty(EDEF.lekalo,'lore',{get(){return beat85(31)?'«ЛЕКАЛО · ИЗД. 000». С него сняли первую копию — и все следующие. Внутри рамы висел VØID-001: он так и не проснулся.':'ИСТОЧНИК НЕ ОПОЗНАН';},configurable:true,enumerable:true});
Object.defineProperty(EDEF.wellcore,'lore',{get(){return beat85(38)?'Передатчик на дне колодца не выключался с первого цикла. Долетев до дна, каждый становится его голосом.':'ИСТОЧНИК НЕ ОПОЗНАН';},configurable:true,enumerable:true});
// обломки боссов в мире
Object.assign(SB_WRECK,{31:{break:['ОСКОЛОК ЛЕКАЛА','Жёлтая балка с трафаретом «ИЗД. 000». Линия стоит. На обороте кто-то нацарапал: «013 — не брак».'],write:['ОСКОЛОК ЛЕКАЛА','Балка ещё тёплая. В пазу матрицы — ваш скан: оружие, модули, износ 12%. Следующая копия начнёт с этого.']},
  38:{silence:['ПЕРЕДАТЧИК КОЛОДЦА','Передатчик молчит. На панели — счётчик вызовов: он больше не растёт.'],answer:['ПЕРЕДАТЧИК КОЛОДЦА','Передатчик повторяет ваши слова. Где-то далеко кто-то впервые слышит не просьбу, а ответ.'],third:['ПЕРЕДАТЧИК КОЛОДЦА','Частота сдвинута за край карты. На ленте записи — координаты, которых нет ни в одном каталоге.']}});
const SB_WM85=[14,18,22,27,31,38];
// хроника: исходы и открытия
function chron85(s){if(!s)return '';let h='';
  if(s.line31){h+=`<dt>Паспорт изделия 013</dt><dd>Оружие, модули, износ 12%. Партия: вне. Основание приёмки: возврат. Так бюро записывало каждую копию.</dd><dt>VØID-001</dt><dd>Первая копия висела внутри лекала и так и не проснулась. Э. В. счёл это милосердием.</dd>`;
    h+=`<dt>Лекало</dt><dd>${s.line31==='break'?'Лекало разбито. В Цехе №0 горит свет, и больше нечего проверять. Копий больше не делают.':'Лекало переписано. Следующая копия будет помнить, как тебя звали. Линия работает по новому лекалу.'}</dd>`;}
  if(s.well38){h+=`<dt>Первый сигнал</dt><dd>Сигнал, за которым летят все копии, — голос VØID из прошлого цикла. Долетев до дна, каждый зовёт следующего.</dd><dt>Корабль на дне</dt><dd>Потёртый корпус с номером 013 и передатчиком, который не выключался с первого цикла. ${s.well38==='silence'?'Теперь передатчик молчит.':s.well38==='answer'?'Теперь он говорит вашими словами.':'Теперь он смотрит за край карты.'}</dd>`;
    if(s.well38==='third')h+=`<dt>Третий путь</dt><dd>Сигнал перестроен на координаты за краем карты. Запись Э. В.: «Третий путь не здесь. Он там, куда сигнал никогда не звал».</dd>`;}
  const n=serialNo85();if(n>13)h+=`<dt>Серия</dt><dd>Линия Цеха №0 собрала копий с вашим оружием: ${n-13}. Последний номер на борту — ${String(n).padStart(3,'0')}. Линия помнит, даже если вы начнёте заново.</dd>`;
  return h;}
// контракты после побед
CTPL.push({id:'c_clean85',s:'VII · Партия без брака',t:()=>'Пройти миссию сектора VII, не вызвав нарушения регламента',ev:'clean85',n:[1,1],after:31,sec:6},
  {id:'c_wake85',s:'VIII · Разбудить',t:n=>`Разбудить импульсом ${n} Паломников в секторе VIII`,ev:'wake85',n:[3,5],after:38,sec:7,alive:()=>storyFlag('well38')!=='silence'},
  {id:'c_exodus85',s:'VIII · Исход',t:()=>'Сопроводить Исход Паломников до сектора VII',ev:'exodus85',n:[1,1],after:38,sec:7,alive:()=>storyFlag('well38')==='silence'});
// --- открытый мир VII–VIII ---
const W85={sec:-1,exo:false,voice:false};
function w85S(){const S=G.save;if(!S)return {apprAt:0};return S.w85||(S.w85={apprAt:0});}
function w85Node(){const s=WORLD.sectors[7];if(!s||!s.box)return null;const b=s.box;return {x:b[2]-280,y:(b[1]+b[3])/2};}
function w85WorldTick(dt){const S=G.save,p=G.player;if(!S||!p)return;const sec=sec80();
  if(sec===6&&W85.sec!==6&&storyFlag('line31')==='write'&&!G.ally85w&&p.hp>0){G.ally85w={kind:'appr',x:p.x-60,y:p.y+40,a:0,cd:1,t:90};radioLine('БЮРО',C85.lek,'Линия работает по новому лекалу.',.6);floater(p.x,p.y-50,'УЧЕНИК · СОЮЗНИК НА 90 С',shipCol());}
  W85.sec=sec;if(G.ally85w){if(sec!==6||p.hp<=0)G.ally85w=null;else ally85Tick(dt,G.ally85w);}
  if(storyFlag('line31')==='break')for(const z of W80.zones)if(z.k80==='audit'&&!z.active)z.cool=Math.max(z.cool||0,30);
  const w38=storyFlag('well38');
  if(w38!=='silence'&&W85.exo){W85.exo=false;if(W80.dest0)W80.dest=W80.dest0;else{const n38=WORLD.nodes.find(n=>n.m===38);if(n38)W80.dest={x:n38.x,y:n38.y};}for(const z of W80.zones)if(z.k80==='pilgrims')z.name='ПАЛОМНИКИ';}
  if(w38==='silence'&&!W85.exo){W85.exo=true;const n=WORLD.nodes[27];if(n){W80.dest0=W80.dest;W80.dest={x:n.x,y:n.y};}for(const z of W80.zones)if(z.k80==='pilgrims')z.name='ИСХОД';}
  if((w38==='answer'||w38==='third')&&!W85.voice){W85.voice=true;VOICES80.push('«…кто-то ответил с самого дна. Не «помогите». Сказал: «я слышу. Лети дальше». Это был ты?…»');}
  if(w38==='answer'||w38==='third'){for(const z of W80.zones){if(z.k80!=='pilgrims'||!z.active||!z.pg)continue;z.pg.tol=99;
      for(const e of z.pg.ships){if(!e.alive||e.hostile80||Math.hypot(e.x-p.x,e.y-p.y)>340)continue;for(const b of G.eb){if(b.life>0&&!b.rift&&Math.hypot(b.x-e.x,b.y-e.y)<e.r+6&&Math.random()<.35){b.life=0;e.flash=.1;if(!e.cov85){e.cov85=1;floater(e.x,e.y-22,'ПРИКРЫЛ',C85.pil);}}}}}}}
function w85Pulse(p,R){if(sec80()!==7||!storyFlag('well38'))return;const rw=Math.max(220,R);for(const z of W80.zones){if(z.k80!=='pilgrims'||!z.active||!z.pg)continue;for(const e of z.pg.ships){if(!e.alive||e.hostile80||e.woke85||Math.hypot(e.x-p.x,e.y-p.y)>rw+e.r)continue;e.woke85=1;floater(e.x,e.y-24,'ПРОСНУЛСЯ',C85.pil);conEvent('wake85');}}}
function w85Draw(t){const A=G.ally85w;if(A){ctx.save();ctx.translate(A.x,A.y);ctx.rotate(A.ang||0);ctx.fillStyle='#2a2408';ctx.strokeStyle=shipCol();ctx.lineWidth=2;shipPath85(.8);ctx.fill();ctx.stroke();ctx.restore();worldLabel(A.x,A.y-20,'УЧЕНИК · '+Math.ceil(A.t),shipCol());}
  if(storyFlag('well38')==='third'){const q=w85Node();if(q&&inView(q.x,q.y,260)){glow(q.x,q.y,120,'#ffffff',.25+.1*Math.sin(t*2));ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.setLineDash([10,8]);ctx.lineDashOffset=-t*10;ctx.beginPath();ctx.arc(q.x,q.y,90,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;
      for(let i=0;i<3;i++){ctx.globalAlpha=.5-i*.15;ctx.beginPath();ctx.arc(q.x,q.y,30+i*18+6*Math.sin(t*3+i),0,TAU);ctx.stroke();}ctx.globalAlpha=1;worldLabel(q.x,q.y-110,'СИГНАЛ ЗА ПРЕДЕЛОМ','#ffffff');worldLabel(q.x,q.y+112,'СКОРО','#9fb0c4');}}}
// союзник: Серийник 013 (бой 38) и «Ученик» (мир VII)
function ally85Tick(dt,A0){const X=G.x85,A=A0||(X&&X.ally);if(!A)return;const p=G.player;if(!p)return;
  A.t-=dt;if(A.t<=0||p.hp<=0){if(A.kind==='appr'&&A.t<=0)radioLine('УЧЕНИК',C85.lek,'Смена окончена. Я запомнил, как ты летаешь.',.2);if(A0)G.ally85w=null;else if(X)X.ally=null;return;}
  A.a+=dt*1.1;const tx=p.x+Math.cos(A.a)*80,ty=p.y+Math.sin(A.a)*80;A.x+=(tx-A.x)*Math.min(1,dt*3);A.y+=(ty-A.y)*Math.min(1,dt*3);
  A.cd-=dt;if(A.cd<=0){const t_=nearestEnemy(A.x,A.y,480);if(t_&&t_.type!=='rangedummy'){const sc=lekScan(),n=Math.min(3,sc.n),a0=Math.atan2(aimPt(t_).y-A.y,aimPt(t_).x-A.x);A.ang=a0;
      for(let i=0;i<n;i++){const a=a0+(i-(n-1)/2)*.11;G.pb.push({x:A.x,y:A.y,px:A.x,py:A.y,vx:Math.cos(a)*820,vy:Math.sin(a)*820,dmg:sc.dmg*.45,pierce:0,rico:0,life:.7,hit:[],drone:true,jr:true,a85:1});}A.cd=Math.max(.35,sc.rate*2.2);}else A.cd=.25;}
  if(A.kind==='serial'&&A.maxHp){for(const b of G.eb){if(b.life>0&&!b.rift&&Math.hypot(b.x-A.x,b.y-A.y)<12){A.hp-=b.dmg;b.life=0;}}
    if(A.hp<=0){explode(A.x,A.y,C85.lek,20,.8);floater(A.x,A.y-24,'СЕРИЙНИК 013 ПОТЕРЯН',C85.lek);if(X)X.ally=null;}}}


