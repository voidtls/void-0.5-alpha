const PERKS={
  hull:{name:'Усиленный корпус',max:3,cost:[100,180,280],d:'+10 к прочности корпуса за уровень.'},
  aim:{name:'Пристрелка',max:3,cost:[120,200,300],d:'+5% к урону основного орудия и заряженного выстрела за уровень.'},
  reserve:{name:'Резерв модулей',max:3,cost:[150,250,400],d:'+1 стартовый модуль на брифинге за уровень.'},
  pre:{name:'Предзаряд',max:2,cost:[120,220],d:'Миссия начинается с заряженным накопителем: 30%, затем 60%.'},
  dash:{name:'Резерв рывка',max:2,cost:[120,220],d:'Перезарядка рывка короче на 0,15 с за уровень.'},
  mag:{name:'Гравиядро',max:2,cost:[60,120],d:'Радиус подбора +25 за уровень.'},
  pilot:{name:'Опытный пилот',max:2,cost:[140,240],d:'+10% к опыту модулей в миссиях за уровень.'},
  regen:{name:'Ремонт в секторе',max:2,cost:[160,260],d:'Через 3 с без урона корпус чинится: 0,5, затем 1 ед./с. Не действует в секторах III–IV (миссии 11–18).'},
  energy:{name:'Энергоконтур',max:2,cost:[100,180],d:'+15% к набору энергии импульса за уровень.'},
  combo:{name:'Боевой ритм',max:3,cost:[150,250,350],d:'Комбо: уничтожения с интервалом до 2,5 с повышают опыт модулей на 5% за звено. Предел ×1,5 / ×1,75 / ×2. Работает и в Бесконечности.'},
  scan:{name:'Сканер',max:1,cost:[600],d:'Тайники и непрочитанные бортжурналы видны на мини-карте с 1600 единиц (6,4 а.е.), а на большой карте — знаком «?» в радиусе 2400.'},
  twin:{name:'Сдвоенный ствол',max:1,cost:[1500],d:'Каждый снаряд основного орудия вылетает парой из двух стволов, урон каждого ×0,65 — итого ×1,3. Складывается с «Веерным залпом». В Бесконечности не действует.',req:4},
  bcar:{name:'Бронеплиты маяка',max:2,cost:[150,250],d:'+60 к целостности маяка в миссиях 7–10.',req:6},
  cargo:{name:'Грузовой отсек',max:1,cost:[180],d:'+1 место в трюме для энергоячеек.',req:6}
};
const MASTERY_GEN=[{t:'Без единого рывка',ok:()=>G.mc.dashes===0},{t:'Подобрать 3 энергоячейки',ok:()=>G.mc.cells>=3},{t:'Дважды применить импульс',ok:()=>G.mc.pulses>=2},{t:'Урон корпусу меньше 20',ok:()=>G.taken-G.missionTaken<20}];
const MASTERY=[
  {t:'Без единого рывка',ok:()=>G.mc.dashes===0},
  {t:'Подобрать 3 энергоячейки',ok:()=>G.mc.cells>=3},
  {t:'Дважды применить импульс',ok:()=>G.mc.pulses>=2},
  {t:'5 уничтожений по приоритетной цели',ok:()=>G.mc.prioKills>=5},
  {t:'Ни одного попадания луча копейщика',ok:()=>G.mc.lanceHits===0},
  {t:'Победить Стража за 3 перегрузки',ok:()=>G.mc.overloads<=3},
  {t:'Маяк цел минимум на 80%',ok:()=>!!G.bc&&G.bc.hp>=G.bc.maxHp*.8},
  {t:'Все линии ретрансляторов целы к концу',ok:()=>G.relays.every(r=>!r.cut)},
  {t:'Маяк цел минимум на 60%',ok:()=>!!G.bc&&G.bc.hp>=G.bc.maxHp*.6},
  {t:'Передача без единой паузы',ok:()=>!G.mc.transPaused}
];
const WORLD={
  nodes:[{m:1,x:700,y:3000},{m:2,x:1500,y:1800},{m:3,x:2600,y:2700},{m:4,x:3200,y:1300},{m:5,x:4000,y:2300},{m:6,x:4200,y:4300},
         {m:7,x:5900,y:3100},{m:8,x:6900,y:1900},{m:9,x:8100,y:3400},{m:10,x:9200,y:1700}],
  hangar:{x:3450,y:2550,name:'АНГАР «ЗЕРКАЛО»'},
  abyss:{x:9550,y:2550},
  shops:[{id:'s1',x:1250,y:4000,name:'МАСТЕРСКАЯ «ОБОД»'},{id:'s2',x:6300,y:4500,name:'МАСТЕРСКАЯ «ГОРИЗОНТ»'}],
  relays:[{id:'r1',x:2500,y:650},{id:'r2',x:7700,y:5150}],
  caches:[{id:'c1',x:380,y:900,skin:'amber'},{id:'c2',x:3600,y:5300,skin:'violet'},{id:'c3',x:7300,y:560,skin:'crimson'},{id:'c4',x:9450,y:5250,skin:'white'}],
  journals:[
    {id:'j1',x:950,y:2250,title:'«ИНЕЙ-4» · ЗАПИСЬ 112',text:'Мы приняли сигнал за маяк и шли на свет. Поняли слишком поздно: он светил не нам.'},
    {id:'j2',x:2150,y:2350,title:'ПИЛОТ СОРЕЛЬ',text:'Разведчики почти не стреляют. Они считают. Каждый наш манёвр куда-то уходит — к ядру.'},
    {id:'j3',x:3800,y:3600,title:'ИНЖЕНЕР ВАРГА',text:'Заряды Стража — не броня, а предохранители. Сними их, и ядро захлебнётся собственной мощностью.'},
    {id:'j4',x:3000,y:450,title:'НЕИЗВЕСТНЫЙ ПИЛОТ',text:'Гвардия разворачивается медленно. Мы жили, пока летали кругами. Потом кончилось топливо.'},
    {id:'j5',x:4650,y:3700,title:'ПОГРАНИЧНЫЙ БУЙ',text:'Ворота держат два замка. Ставили их не мы. Открываются только тем, кто прошёл ядро.'},
    {id:'j6',x:5650,y:4050,title:'СМОТРИТЕЛЬ «ГОРИЗОНТА»',text:'Маяк не гаснет. Он просто перестал быть нужен — некому было слушать.'},
    {id:'j7',x:7250,y:3050,title:'ГРУЗОВОЙ ДРОН Т-9',text:'Пиявки пришли после третьей вспышки. Металл им не нужен. Они едят свет.'},
    {id:'j8',x:9650,y:3050,title:'ПОСЛЕДНЯЯ ЗАПИСЬ СТАНЦИИ',text:'Глушитель — не корабль. Это тишина, которой придали форму. Если ты это слышишь, значит, у тебя получилось.'}],
  anomalies:[{id:'a1',x:2000,y:4850,kind:'cells',name:'РОССЫПЬ',d:'Соберите 8 из 10 энергоячеек за 22 секунды. Ячейки дрейфуют и убегают от корабля — берите рывком. Вокруг мины.'},
             {id:'a2',x:6100,y:850,kind:'storm',name:'ИОННЫЙ ВИХРЬ',d:'30 секунд в сжимающемся круге: кольца снарядов всё чаще, с 12-й секунды — два вращающихся луча. Рывок перезаряжается вдвое дольше.'},
             {id:'a3',x:8800,y:4400,kind:'chase',name:'ПОГОНЯ',d:'Похититель быстрее вас, бронирован, делает фазовые рывки, роняет мины и летит с двумя стрелками. 25 секунд.'}],
  zones:[
    {x:1150,y:2350,req:1,set:{scout:5}},
    {x:2250,y:1050,req:2,set:{scout:4,gunner:2}},
    {x:3300,y:3500,req:3,set:{rammer:2,splitter:2,scout:2}},
    {x:4000,y:700,req:4,set:{gunner:3,scout:4,rammer:1}},
    {x:2700,y:5000,req:5,set:{lancer:2,gunner:2,scout:4}},
    {x:4450,y:3000,req:6,set:{guard:2,gunner:3,scout:4},gate:true},
    {x:6500,y:2450,req:7,set:{moth:10,scout:3}},
    {x:7700,y:2650,req:8,set:{phantom:2,gunner:3,scout:3}},
    {x:6900,y:5200,req:8,set:{rammer:3,splitter:2,mirror:1}},
    {x:8600,y:4900,req:9,set:{shocker:2,phantom:2,mirror:1,scout:2}},
    {x:9500,y:900,req:10,set:{twin:2,hunter:1,mirror:1,scout:3}}],
  fields:[{x:380,y:900,r:520,n:26},{x:2900,y:4000,r:480,n:16},{x:4350,y:1700,r:420,n:12},{x:7300,y:560,r:520,n:24},{x:5600,y:1300,r:480,n:16},{x:8500,y:2500,r:450,n:14},{x:7000,y:4750,r:450,n:14}],
  minefields:[{x:3600,y:5300,r:520,n:18}],
  dark:[{x:9350,y:5050,r:1000}],
  gate:{x:5000,y:3000},
  locks:[[4820,2640],[4820,3360]]
};
for(let m=11;m<=50;m++)MASTERY.push(MASTERY_GEN[m%4]);
MASTERY[21]={t:'Порвать все четыре пуповины за 30 с',ok:()=>!!G.mc&&G.mc.cord74!==undefined&&G.mc.cord74<=30};MASTERY[26]={t:'Ни одного попадания «по двигателям»',ok:()=>!!G.mc&&!G.mc.eng74};
const SECTOR_NAMES=['ПОЯС СТРАЖА','ДРЕЙФ МАЯКА',...SECTORS_NEW.map(q=>q.name)];
// ---- 0.4: мир 40 000 × 20 000; старые сектора сдвинуты вниз на OY ----
(function shiftWorld(){const sh=o=>{o.y+=OY;};const W_=WORLD;[...W_.nodes,...W_.shops,...W_.relays,...W_.caches,...W_.journals,...W_.anomalies,...W_.zones,...W_.fields,...W_.minefields,...W_.dark].forEach(sh);
  sh(W_.hangar);sh(W_.abyss);sh(W_.gate);W_.locks.forEach(l=>l[1]+=OY);})();
WORLD.sectors=[{name:SECTOR_NAMES[0],box:[0,OY,5000,OY+WH0],col:'#8fe9ff'},{name:SECTOR_NAMES[1],box:[5000,OY,WW0,OY+WH0],col:'#ffb84d'}];
WORLD.fields2=[];
const SEC_Y0=[12000,8500,11000,7000,9500,13000,9500,6000,8000],SEC_W=[3400,3200,3500,3300,3200,3700,3300,3400,3000];
{let xs=10000;SECTORS_NEW.forEach((q,k)=>{if(k>=9)return;const x0=xs,x1=x0+SEC_W[k],y0=SEC_Y0[k],y1=y0+5500,R=mulberry(900+k*13);xs=x1;
  const prev=k===0?[OY,OY+WH0]:[SEC_Y0[k-1],SEC_Y0[k-1]+5500],next=k<8?[SEC_Y0[k+1],SEC_Y0[k+1]+5500]:[y0+1500,y1-1500];
  const ey=(Math.max(y0,prev[0])+Math.min(y1,prev[1]))/2,xy=(Math.max(y0,next[0])+Math.min(y1,next[1]))/2;
  const sc={name:q.name,box:[x0,y0,x1,y1],col:q.col,bx:x0+430,by:clamp(ey,y0+600,y1-600),lv:q.lv};WORLD.sectors.push(sc);
  const n=q.lv[1]-q.lv[0]+1;
  for(let i=0;i<n;i++){const f=(i+1)/n,x=x0+900+(x1-x0-1400)*f,zig=(i%2?1:-1)*(n>5?650:450)*(i===n-1?0:1);
    const y=clamp(ey+(xy-ey)*f+zig+(R()-.5)*250,y0+600,y1-600);
    WORLD.nodes.push({m:q.lv[0]+i,x:Math.round(x+(R()-.5)*(i===n-1?0:200)),y:Math.round(y),boss:BOSS_LV.has(q.lv[0]+i),sec:k+2});}
  for(let i=0;i<2;i++)WORLD.fields2.push({x:x0+800+R()*(x1-x0-1600),y:y0+1200+R()*(y1-y0-2400),r:350+R()*200,n:12+Math.floor(R()*8)});});}
world110Setup();
// 0.7.0: Арсенал «Иней» — рядом с узлом 14, внутри сектора III, не ближе 520 к другим узлам
{const n14=WORLD.nodes.find(n=>n.m===14),b=WORLD.sectors[2].box;let best=null;for(const [dx,dy] of [[-650,-520],[-650,520],[650,-520],[-900,0],[650,520],[0,-800]]){const x=n14.x+dx,y=n14.y+dy;if(x<b[0]+450||x>b[2]-450||y<b[1]+450||y>b[3]-450)continue;if(WORLD.nodes.some(q=>q!==n14&&Math.hypot(q.x-x,q.y-y)<520))continue;best={x,y};break;}
  if(!best)best={x:clamp(n14.x-650,b[0]+450,b[2]-450),y:clamp(n14.y-520,b[1]+450,b[3]-450)};WORLD.arsenal={x:Math.round(best.x),y:Math.round(best.y),name:'АРСЕНАЛ «ИНЕЙ»'};}
function sectorIdx(x,y){const S_=WORLD.sectors;for(let i=0;i<S_.length;i++){const b=S_[i].box;if(x>=b[0]&&x<=b[2]&&y>=b[1]&&y<=b[3])return i;}
  let bi=0,bd=1e12;for(let i=0;i<S_.length;i++){const b=S_[i].box,dx=Math.max(b[0]-x,0,x-b[2]),dy=Math.max(b[1]-y,0,y-b[3]),d=dx*dx+dy*dy;if(d<bd){bd=d;bi=i;}}return bi;}
const sectorName=(x,y)=>WORLD.sectors[sectorIdx(x,y)].name;
function inSectors(x,y){return WORLD.sectors.some(q=>x>=q.box[0]&&x<=q.box[2]&&y>=q.box[1]&&y<=q.box[3]);}
const doneCount=()=>{let n=0;for(const q of WORLD.nodes)if(nodeState(q.m)==='done')n++;return n;};
function perk(k){return G.mode==='world'&&G.save&&G.save.perks?(G.save.perks[k]||0):0;}
