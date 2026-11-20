// ===== 0.5.8: открытый мир секторов III–IV («Холод и ржавчина») =====
// --- инфраструктура ---
function worldSS(x,y){if(!G.world||!G.save)return null;const p=G.player;if(x===undefined){if(!p)return null;x=p.x;y=p.y;}if(!inSectors(x,y))return null;const i=sectorIdx(x,y);return SEC_SCALE[i]||null;}
function SSW(){return secScale()||(G.world?worldSS():null);}
const W58={shelves:[],rust:[],recs:[],beacons:[],zones:[],depot:null,core:null,gen:false};
const W58_NAMES={tug:['ТИХАЯ-ГРУЗ 4','ИНЕЙ-9','ПОСЛЕДНИЙ РЕЙС','КОЛЫБЕЛЬНАЯ','СТАРЫЙ ВАРГ']};
function w58S(){const S=G.save;if(!S)return null;if(!S.w58)S.w58={iceRocks:[],arcRec:[],rustBox:[],arcBeacons:[],tugs:{esc:0,rob:0},wander:{},conveyor:{},packs:{}};const w=S.w58;
  w.iceRocks=w.iceRocks||[];w.arcRec=w.arcRec||[];w.rustBox=w.rustBox||[];w.arcBeacons=w.arcBeacons||[];w.tugs=w.tugs||{esc:0,rob:0};w.wander=w.wander||{};w.conveyor=w.conveyor||{};w.packs=w.packs||{};return w;}
function w58Reset(){G.w={storms:{},tug:null,tugT:40,wander:null,wanderT:0,packs:[],ambush:null,chill:0,chillT:0,onShelf:false,inRust:false,inRain:false,slide:0,wsec:-1,noSpawnT:0,snow:[],rain:[],vis:0,beaconFights:{},digs:null,respT:0};G.event=null;}
function w58After(m){const S=G.save;return !!S&&nodeState(m)==='done';}
function w58SecOpen(i){const S=G.save;return !!S&&S.cleared>=CORE&&S.gate;}
function w58Pt(sec,R,ok,m){m=m||300;const sc=WORLD.sectors[sec],b=sc.box;for(let k=0;k<400;k++){const x=b[0]+m+R()*(b[2]-b[0]-2*m),y=b[1]+m+R()*(b[3]-b[1]-2*m);if(ok(x,y))return {x:Math.round(x),y:Math.round(y)};}return {x:(b[0]+b[2])/2,y:(b[1]+b[3])/2};}
function w58Far(x,y,list,d){return list.every(q=>Math.hypot(q.x-x,q.y-y)>d);}
function w58Gen(){if(W58.gen)return;W58.gen=true;
  const N=WORLD.nodes,pois=[...WORLD.journals,...WORLD.anomalies,...WORLD.shops,...WORLD.caches];
  const nodesOf=s=>N.filter(n=>n.sec===s);const bea=s=>({x:WORLD.sectors[s].bx,y:WORLD.sectors[s].by});
  const placed=[];
  const okAt=(x,y,dn,dp)=>w58Far(x,y,N,dn)&&w58Far(x,y,pois,dp)&&w58Far(x,y,placed,dp)&&w58Far(x,y,[bea(2),bea(3)],dp)&&inSectors(x,y);
  // 61: зоны патрулей
  // 0.5.9: зон 8 → 4 (off — точка выбирается, чтобы генерация мира не сдвинулась, но зона не создаётся); set — пул сопровождения
  const ZS=[[2,10,'ИНЕЙ',['frost','scout','gunner'],['gunner',['fast']],{},0],
    [2,11,'ИНДЕКС',['phantom','gunner','frost'],['phantom',['armor']],{},1],
    [2,12,'КАТАЛОГ',['lancer','frost','archivist'],['shade',['fast']],{},0],
    [2,13,'ХРАНИЛИЩЕ',['hunter','shocker','frost'],['hunter',['armor']],{},1],
    [3,14,'ПРИЧАЛ',['gunner','corroder','scout'],['rammer',['fast','boom']],{},1],
    [3,15,'ВЕРФЬ',['repairer','gunner','rammer'],['hunter',['armor','fast']],{},0],
    [3,16,'ДЕПО',['repairer','lancer','gunner'],['shade',['boom','armor']],{},1],
    [3,17,'СВАЛКА',['shocker','rammer','corroder','repairer'],['hunter',['fast','boom']],{},0]];
  ZS.forEach(([sec,after,name,set,lead,reinf,off],i)=>{const R=mulberry(6100+i*31);const q=w58Pt(sec,R,(x,y)=>okAt(x,y,700,600));placed.push(q);
    if(off)return;const z={x:q.x,y:q.y,req:0,set,w58:1,sec,after,name,lead,reinf,idx:1000+i};WORLD.zones.push(z);W58.zones.push(z);});
  // 62: шельфы
  const R2=mulberry(5101),n11=nodesOf(2);
  for(let i=0;i<6;i++){let q;const r=380+R2()*270,dn=r*1.15+120;
    if(i<2&&n11.length>=3){const a=n11[i],b=n11[i+1];const f=.5;const nx=-(b.y-a.y),ny=(b.x-a.x),l=Math.hypot(nx,ny)||1;const off=(R2()<.5?-1:1)*(dn*.75);q={x:Math.round(a.x+(b.x-a.x)*f+nx/l*off),y:Math.round(a.y+(b.y-a.y)*f+ny/l*off)};const bb=WORLD.sectors[2].box,mg=r*1.15+60;if(!okAt(q.x,q.y,dn,300)||q.x<bb[0]+mg||q.x>bb[2]-mg||q.y<bb[1]+mg||q.y>bb[3]-mg)q=w58Pt(2,R2,(x,y)=>okAt(x,y,dn,500),mg);}
    else q=w58Pt(2,R2,(x,y)=>okAt(x,y,dn,500)&&w58Far(x,y,W58.shelves,900),r*1.15+60);
    const pts=[];for(let k=0;k<14;k++){const a=k/14*TAU,rr=r*(.72+R2()*.4);pts.push({x:q.x+Math.cos(a)*rr,y:q.y+Math.sin(a)*rr});}
    const cracks=[];const nc=6+Math.floor(R2()*4);for(let k=0;k<nc;k++){const a=R2()*TAU,l=[];let cx=q.x+(R2()-.5)*r*.4,cy=q.y+(R2()-.5)*r*.4,ang=a;for(let s=0;s<4;s++){l.push([cx,cy]);cx+=Math.cos(ang)*r*.22;cy+=Math.sin(ang)*r*.22;ang+=(R2()-.5)*1.2;}cracks.push(l);}
    const blinks=[];for(let k=0;k<4+Math.floor(R2()*3);k++)blinks.push({x:q.x+(R2()-.5)*r*1.1,y:q.y+(R2()-.5)*r*1.1,ph:R2()*TAU,per:3+R2()*2});
    const rocks=[];const nr=2+Math.floor(R2()*3);for(let k=0;k<nr;k++){const a=R2()*TAU,d=R2()*r*.6;rocks.push({id:'s'+i+'r'+k,x:Math.round(q.x+Math.cos(a)*d),y:Math.round(q.y+Math.sin(a)*d),r:14+R2()*8,rot:R2()*TAU});}
    W58.shelves.push({id:i,x:q.x,y:q.y,r,pts,cracks,blinks,rocks,rec:false});placed.push(q);}
  // 66: ржавые поля
  const R3=mulberry(5202),n15=nodesOf(3);
  for(let i=0;i<7;i++){let q;
    if(i<3&&n15.length>=3){const a=n15[i],b=n15[i+1];const f=.3+R3()*.4;const px=a.x+(b.x-a.x)*f,py=a.y+(b.y-a.y)*f;const nx=-(b.y-a.y),ny=(b.x-a.x),l=Math.hypot(nx,ny)||1;const off=(R3()<.5?-1:1)*(260+R3()*120);q={x:Math.round(px+nx/l*off),y:Math.round(py+ny/l*off)};const bb=WORLD.sectors[3].box;if(!okAt(q.x,q.y,300,300)||q.x<bb[0]+600||q.x>bb[2]-600||q.y<bb[1]+600||q.y>bb[3]-600)q=w58Pt(3,R3,(x,y)=>okAt(x,y,300,400),600);}
    else q=w58Pt(3,R3,(x,y)=>okAt(x,y,300,400)&&w58Far(x,y,W58.rust,800),600);
    const r=300+R3()*220;const dots=[];for(let k=0;k<12+Math.floor(R3()*9);k++)dots.push({a:R3()*TAU,d:R3(),ph:R3()*TAU});
    const rocks=[];for(let k=0;k<6+Math.floor(R3()*4);k++){const a=R3()*TAU,d=R3()*r*.8;rocks.push({id:'f'+i+'r'+k,x:Math.round(q.x+Math.cos(a)*d),y:Math.round(q.y+Math.sin(a)*d),r:16+R3()*18,rot:R3()*TAU,rust:true});}
    W58.rust.push({id:i,x:q.x,y:q.y,r,dots,rocks,box:false});placed.push(q);}
  W58.rust.slice().sort((a,b)=>b.r-a.r).slice(0,3).forEach(f=>f.box=true);
  // 70: маяки Архива (треугольником, один на краю шельфа)
  const R4=mulberry(5303);const sc2=WORLD.sectors[2].box;
  const corners=[[sc2[0]+700,sc2[1]+700],[sc2[2]-700,sc2[1]+900],[sc2[0]+900,sc2[3]-800]];
  corners.forEach(([cx,cy],i)=>{let q={x:cx,y:cy};if(i===2&&W58.shelves.length){const s=W58.shelves[W58.shelves.length-1];q={x:Math.round(s.x+s.r*1.05),y:Math.round(s.y)};}
    if(!okAt(q.x,q.y,900,500))q=w58Pt(2,R4,(x,y)=>okAt(x,y,900,500));W58.beacons.push({id:'b'+i,x:q.x,y:q.y,seeds:0});placed.push(q);});
  // 72: холодное ядро — дальняя часть III, рядом шельф
  const R5=mulberry(5404);let qc=null,qd=-1;{const b=WORLD.sectors[2].box;for(let k=0;k<600;k++){const x=b[0]+600+R5()*(b[2]-b[0]-1200),y=b[1]+600+R5()*(b[3]-b[1]-1200);if(!okAt(x,y,600,600))continue;const d=Math.min(...N.filter(n=>n.sec===2).map(n=>Math.hypot(n.x-x,n.y-y)));if(d>qd){qd=d;qc={x:Math.round(x),y:Math.round(y)};}}if(!qc)qc=w58Pt(2,R5,(x,y)=>okAt(x,y,600,600));}W58.core={x:qc.x,y:qc.y};placed.push(qc);
  if(!WORLD.anomalies.some(a=>a.id==='a4'))WORLD.anomalies.push({id:'a4',x:qc.x,y:qc.y,kind:'coldcore',name:'ХОЛОДНОЕ ЯДРО',d:'Внутри сферы время врагов идёт вдвое медленнее, но корабль обрастает льдом. За 35 секунд соберите 5 осколков тепла — каждый снимает лёд. Дальше 900 от ядра — провал.'});
  {const r=460,pts=[];for(let k=0;k<14;k++){const a=k/14*TAU,rr=r*(.8+R5()*.3);pts.push({x:qc.x+Math.cos(a)*rr,y:qc.y+Math.sin(a)*rr});}W58.shelves.push({id:6,x:qc.x,y:qc.y,r,pts,cracks:[],blinks:[],rocks:[],rec:false,core:true});}
  // 63: записи — 4 свободно, 1 вморожена в дальний шельф, 1 в ядре
  const R6=mulberry(5505);const far=W58.shelves.slice(0,6).reduce((a,b)=>Math.hypot(b.x-WORLD.sectors[2].bx,b.y-WORLD.sectors[2].by)>Math.hypot(a.x-WORLD.sectors[2].bx,a.y-WORLD.sectors[2].by)?b:a);far.rec=true;
  const RT=[['ЦИКЛ IV · ЗАПИСЬ 0007','Объект 013 вошёл в сектор на скорости сверх эталона. Скорость приведена.','На полях: «Ты всегда летишь слишком быстро. Это хорошо». — Э. В.'],
    ['ЦИКЛ IX · ЗАПИСЬ 0213','Объект 013 отказался от модуля «Щит». Причина не зафиксирована. Цикл завершён на передаче 14.','«Он хотел что-то доказать. Мне или себе».'],
    ['ЦИКЛ XIII · ЗАПИСЬ 0090','Во время сверки объект 013 вышел из кадра и не вернулся в течение 41 с. Копия продолжила маршрут без него.','«Запись не знает, куда ты повернёшь. Помни об этом».'],
    ['ЦИКЛ XX · ЗАПИСЬ 1144','Выбор объекта 013 у маяка: холод. Выбор совпал с эталоном. Отклонений нет.','«Двадцать раз одно и то же. Не будь эталоном».'],
    ['ЦИКЛ XXVII · ЗАПИСЬ 0001','Объект 013 принял сигнал Архива за свой. Принят на хранение.','«Этот цикл я потерял. Прости».'],
    ['ЦИКЛ XXXI · ЗАПИСЬ 4102','Последняя сверка перед циклом XXXII. Объект 013 спросил: «Сколько нас было?» Ответ не предусмотрен.','«Тридцать один. Ты тридцать второй. И единственный, кто спросил».']];
  RT.forEach(([title,text,memo],i)=>{let rec={id:i,title,text,memo,cyc:['IV','IX','XIII','XX','XXVII','XXXI'][i]};
    if(i<4){const q=w58Pt(2,R6,(x,y)=>okAt(x,y,500,500));const Rr=300+R6()*300,b=WORLD.sectors[2].box;Object.assign(rec,{x:clamp(q.x,b[0]+Rr+80,b[2]-Rr-80),y:clamp(q.y,b[1]+Rr+80,b[3]-Rr-80),R:Rr,ph:R6()*TAU,sp:(25+R6()*15)/300,drift:true});placed.push(q);}
    else if(i===4)Object.assign(rec,{x:far.x,y:far.y,frozen:true,drift:false});
    else Object.assign(rec,{x:qc.x,y:qc.y,core:true,drift:false});
    W58.recs.push(rec);});
  // 68: депо у узла 17 (юго-восток)
  const n17=N.find(n=>n.m===17);if(n17){let q={x:n17.x+640,y:n17.y+640};const b=WORLD.sectors[3].box;q.x=clamp(q.x,b[0]+1300,b[2]-1300);q.y=clamp(q.y,b[1]+900,b[3]-900);W58.depot={x:Math.round(q.x),y:Math.round(q.y)};}
}
function w58RecPos(r){if(r.drift){const a=r.ph+G.t*r.sp;return {x:r.x+Math.cos(a)*r.R,y:r.y+Math.sin(a)*r.R*.6};}return {x:r.x,y:r.y};}
function w58InPoly(x,y,pts){let c=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)c=!c;}return c;}
function w58OnShelf(x,y){for(const s of W58.shelves){if(Math.abs(s.x-x)>s.r*1.2||Math.abs(s.y-y)>s.r*1.2)continue;if(w58InPoly(x,y,s.pts))return s;}return null;}
function w58InRust(x,y){for(const f of W58.rust){if(Math.hypot(f.x-x,f.y-y)<f.r)return f;}return null;}
function w58InStorm(x,y){const w=G.w;if(!w)return null;for(const k in w.storms){const s=w.storms[k];if(!s||s.ph==='wait'||s.k<=0)continue;const dx=(x-s.x)/700,dy=(y-s.y)/400;if(dx*dx+dy*dy<1)return s;}return null;}
// --- главный тик мира (после updateEnemies) ---
function secWorldTick(dt){const S=G.save,p=G.player,w=G.w;if(!S||!p||!w)return;w58Gen();const ws=w58S();
  const sec=inSectors(p.x,p.y)?sectorIdx(p.x,p.y):-1;if(sec!==w.wsec){w.wsec=sec;computeStats();if(p.hp>G.st.maxHp)p.hp=G.st.maxHp;}
  if(w.noSpawnT>0)w.noSpawnT-=dt;
  const inW=sec===2||sec===3;
  // шельф и холод
  if(!SSW())G.slick=false;
  const sh=p.hp>0?w58OnShelf(p.x,p.y):null;w.onShelf=!!sh;if(p.dashT>0)w58DashRocks(p);
  if(sh){G.slick=true;G.slickK=2.5;w.chillT+=dt;const sp=Math.hypot(p.vx,p.vy);if(sp>260){w.slide+=sp*dt;if(w.slide>=100){w.slide-=100;conEvent('shelf');}
      if(SET.fx){w.trail=w.trail||[];const a=Math.atan2(p.vy,p.vx),nx=-Math.sin(a)*7,ny=Math.cos(a)*7;w.trail.push({x1:p.x+nx,y1:p.y+ny,x2:p.x-nx,y2:p.y-ny,t:2});if(w.trail.length>40)w.trail.shift();}}}
  else G.slickK=undefined;
  const snow=w58InStorm(p.x,p.y);const cold=!!sh||(snow&&snow.kind==='snow');
  if(cold){if(!sh)w.chillT+=dt;w.chill=Math.min(1,w.chill+dt*.5);}else{w.chill=Math.max(0,w.chill-dt/1.5);w.chillT=0;}
  if(w.chillT>4&&!w.iced){w.iced=true;floater(p.x,p.y-30,'ОБЛЕДЕНЕНИЕ','#bfe8ff');}
  if(w.iced&&(p.dashT>0||!cold||w.pulsed)){w.iced=false;w.chillT=Math.min(w.chillT,0);if(SET.fx)for(let i=0;i<10;i++)part(p.x,p.y,rnd(-120,120),rnd(-120,120),.4,'#ffffff',2);}
  w.pulsed=0;G.chillK=w.iced?.92:1;G.chillD=w.iced?1.15:1;
  if(w.trail)for(const q of w.trail)q.t-=dt;if(w.trail)w.trail=w.trail.filter(q=>q.t>0);
  // ржавые поля и дождь
  const rf=p.hp>0?w58InRust(p.x,p.y):null;w.inRust=!!rf;const rain=snow&&snow.kind==='rain';w.inRain=!!rain;
  const cap=G.st.maxHp0*(storyFlag('factory')?.10:.15);
  if(rf){const k=(w.boxing?2:1)*(storyFlag('obod18')==='scrap'?.5:1);if((G.wear||0)<cap)addWear(G.st.maxHp0*.01*dt/5*k);if(!w.rustHint){w.rustHint=1;floater(p.x,p.y-30,'РЖАВОЕ ПОЛЕ · ИЗНОС КОРПУСА','#c96a2a');}G.shieldPen=Math.max(G.shieldPen||0,.2);}
  if(rain){const rcap=Math.min(cap,(w.rainW0!==undefined?w.rainW0:(w.rainW0=G.wear||0))+G.st.maxHp0*.05);if((G.wear||0)<rcap)addWear(G.st.maxHp0*.01*dt/10);G.shieldPen=Math.max(G.shieldPen||0,.2);}else w.rainW0=undefined;
  if(!rf&&!rain&&(G.wear||0)>0&&p.hp>0){w.wearDec=(w.wearDec||0)+dt;if(w.wearDec>=20){w.wearDec-=20;addWear(-G.st.maxHp0*.01);}}
  for(const e of G.enemies){if(!e.alive||!e.secArm)continue;if(e.type!=='corroder'&&e.type!=='rustcopy'&&w58InRust(e.x,e.y))e.noArm=Math.max(e.noArm||0,.2);}
  // системы
  w58StormTick(dt,sec);w58ZonesTick(dt);w58RecTick(dt);w58BeaconTick(dt);w58WanderTick(dt,sec);w58PackTick(dt,sec);w58TugTick(dt,sec);w58DigTick(dt);w58ShelfRocks(dt);
  G.calm=G.event?0:G.calm;
  if(G.cruise){const k=snow&&snow.kind==='snow'?1.5/1.75:1;w.cruiseK=k;}
}
// --- 61: патрули III–IV ---
function w58Quiet(x,y){// 0.5.9: тихие зоны — патрули не активируются рядом с Бездной, узлами, мастерскими, Хранилищем, маяками секторов и во время аномалий
  if(G.anom)return true;const A=WORLD.abyss;if(Math.hypot(x-A.x,y-A.y)<1500)return true;
  for(const n of WORLD.nodes)if(Math.hypot(x-n.x,y-n.y)<1000)return true;
  for(const q of WORLD.shops)if(Math.hypot(x-q.x,y-q.y)<600)return true;
  if(Math.hypot(x-WORLD.hangar.x,y-WORLD.hangar.y)<600)return true;if(Math.hypot(x-WORLD.arsenal.x,y-WORLD.arsenal.y)<600)return true;
  for(const sc of WORLD.sectors)if(sc.bx&&Math.hypot(x-sc.bx,y-sc.by)<600)return true;return false;}
function w58ZoneReady(z){return (ALPHA_OPEN/* ВРЕМЕННО (альфа 0.7.4): мир открыт целиком — патрули III–IV не ждут прохождения своих узлов */||w58After(z.after))&&!(G.w&&G.w.noSpawnT>0)&&!(G.event&&G.event!=='zone'&&G.event!=='beacon')&&!w58Quiet(G.player.x,G.player.y)&&!W58.zones.some(q=>q.active&&q!==z);}// 0.5.9: не больше одного патруля одновременно
function w58RollEsc(){const r=Math.random();return r<.3?1:r<.7?2:3;}// 0.5.9: 1–3 сопровождающих (30/40/30) + вожак = 2–4
function w58ZonesTick(dt){const S=G.save,p=G.player,w=G.w;
  for(const z of W58.zones){if(z.cool>0)z.cool-=dt;const d=Math.hypot(p.x-z.x,p.y-z.y);const st=w58InStorm(z.x,z.y);const actR=st&&st.kind==='snow'?450:800;
    if(!z.active){if(z.cool<=0&&d<actR&&p.hp>0&&w58ZoneReady(z)){z.active=true;z.n=0;z.leader=null;z.reinf=z.reinf||{};z.reinfDone=false;z.leadFirst=false;z.killed=0;z.t=0;
        if(z.k74)w74ZoneSpawn(z);else{{const pool=z.set.slice(),ne=w58RollEsc();for(let i=0;i<ne;i++){if(!pool.length)pool.push(...z.set);const t=pool.splice(Math.floor(Math.random()*pool.length),1)[0];const e=spawnEnemy(t,z.x+rnd(-220,220),z.y+rnd(-220,220),{spawnT:.7,zone:z,noAffix:true});if(e){e.hp*=PATROL_HP_K;e.maxHp=e.hp;}z.n++;}}
        const L=spawnEnemy(z.lead[0],z.x+rnd(-120,120),z.y+rnd(-120,120),{spawnT:.7,zone:z,noAffix:true});L.affix=z.lead[1].slice();if(L.affix.includes('armor'))L.armor=3;if(L.affix.includes('fast'))L.spd*=1.35;L.leader=true;L.hp*=PATROL_HP_K*1.5;L.maxHp=L.hp;z.leader=L;z.n++;}
        G.event=G.event||'zone';floater(p.x,p.y-40,'ПАТРУЛЬ · '+z.name,'#ff4f6e');sfx('warn');
        const ws=w58S();const rk=z.k80?'radioZ'+z.k80:z.k74?'radioZ'+z.k74:z.z80g?'radioZg'+z.sec:z.sec===2?'radioZ3':'radioZ4';if(!ws[rk]){ws[rk]=1;if(z.k74)w74ZoneRadio(z);else if(z.z80g)w80ZoneRadio(z);else radioLine(z.sec===2?'АРХИВ':'ОБОД',z.sec===2?'#9fd8ff':'#ffb060',z.sec===2?'Объект вне каталога. Высылаю сверку.':'Выездная бригада направлена. Клиент не обслуживается.',.4);}}}
    else{z.t+=dt;const mine=G.enemies.filter(e=>e.alive&&e.zone===z);const left=mine.length;
      if(z.leader&&z.leader.alive){for(const e of mine)if(e!==z.leader&&Math.hypot(e.x-z.leader.x,e.y-z.leader.y)<400)e.buff=Math.max(e.buff||1,1.15);}
      else if(z.leader&&!z.ldChk){z.ldChk=true;z.leadFirst=(z.n-left)<=1;}
      if(false&&!z.reinfDone&&z.leader&&z.leader.alive&&left<=Math.ceil(z.n*.5)&&left>0){z.reinfDone=true;/* 0.5.9: подкрепление патрулей убрано */const a=Math.atan2(p.y-z.y,p.x-z.x)+Math.PI;
        for(const [t,c] of Object.entries(z.reinf))for(let i=0;i<c;i++){const x=clamp(z.x+Math.cos(a+rnd(-.5,.5))*700,20,WW-20),y=clamp(z.y+Math.sin(a+rnd(-.5,.5))*700,20,WH-20);G.warns.push({x,y,t:1.2,type:t,zone:z});}}
      if(left===0&&z.k74&&w74ZoneDone(z)){}
      else if(left===0){z.active=false;const first=!S.zonesDone['w'+z.idx];z.cool=first?900:1200;const mul=z.sec>=6?3:z.sec===2?1.5:2;let v=Math.round((first?10+z.n*3:3)*mul);if(z.leadFirst)v=Math.round(v*1.25);S.zonesDone['w'+z.idx]=1;S.carry+=v;if(first)addPilotXP(z.sec===2?15:20);
        floater(p.x,p.y-40,'ПАТРУЛЬ РАЗБИТ · +'+v+' ЛОМА'+(first?'':' · ПОВТОР')+(z.leadFirst?' · ВОЖАК ПЕРВЫМ':''),'#c9d2de');sfx('level');conEvent('patrol');conEvent('patrol');if(z.leadFirst)conEvent('patrolLeader');if(G.event==='zone')G.event=null;}
      else if(d>1800){G.enemies.forEach(e=>{if(e.zone===z)e.alive=false;});z.active=false;z.cool=120;if(G.event==='zone')G.event=null;}}}
  if(G.event==='zone'&&!W58.zones.some(z=>z.active))G.event=null;
  // подкрепление из предупреждений
  for(let i=G.warns.length-1;i>=0;i--){const q=G.warns[i];if(!q.zone)continue;q.t-=dt;if(q.t<=0){G.warns.splice(i,1);const e=spawnEnemy(q.type,q.x,q.y,{spawnT:.3,zone:q.zone,noAffix:true});q.zone.n++;}}
}
// --- 62: вмёрзшие обломки ---
function w58ShelfRocks(dt){}
function w58IceRockHit(b,charged){const ws=w58S();for(const s of W58.shelves)for(const r of s.rocks){if(ws.iceRocks.includes(r.id))continue;if(Math.hypot(b.x-r.x,b.y-r.y)<r.r+6){if(!charged){b.life=0;if(SET.fx)part(b.x,b.y,rnd(-40,40),rnd(-40,40),.2,'#bfe8ff',2);return true;}w58IceRockBreak(r,s);return true;}}return false;}
function w58IceRockBreak(r,s){const ws=w58S();if(ws.iceRocks.includes(r.id))return;ws.iceRocks.push(r.id);explode(r.x,r.y,'#bfe8ff',16,.8);for(let i=0;i<3;i++)G.pick.push({k:'lom',x:r.x+rnd(-10,10),y:r.y+rnd(-10,10),vx:rnd(-80,80),vy:rnd(-80,80),r:5,t:0,life:30,v:1});
  if(s.rec){const rec=W58.recs.find(q=>q.frozen);if(rec&&!ws.arcRec.includes(rec.id)){rec.frozen=false;rec.drift=false;rec.x=r.x;rec.y=r.y-30;floater(r.x,r.y-24,'ЗАПИСЬ ОСВОБОЖДЕНА','#bfe8ff');}}
  sfx('boom');}
function w58RustRockHit(b,charged){const S=G.save;if(!S)return false;for(const f of W58.rust){if(Math.abs(f.x-b.x)>f.r+60||Math.abs(f.y-b.y)>f.r+60)continue;for(const r of f.rocks){if(S.rocksGone&&S.rocksGone.includes(r.id))continue;if(Math.hypot(b.x-r.x,b.y-r.y)<r.r+(b.r||4)){r.hp=(r.hp===undefined?(r.r>25?60:25):r.hp)-b.dmg;if(!charged)b.life=0;if(SET.fx)part(b.x,b.y,rnd(-60,60),rnd(-60,60),.2,'#8a5a3a',2);
        if(r.hp<=0){if(S.rocksGone&&!S.rocksGone.includes(r.id))S.rocksGone.push(r.id);explode(r.x,r.y,'#8a5a3a',14,.8);const n=(r.r>25?2:1)*2;for(let i=0;i<n;i++)G.pick.push({k:'lom',x:r.x+rnd(-10,10),y:r.y+rnd(-10,10),vx:rnd(-80,80),vy:rnd(-80,80),r:5,t:0,life:30,v:1});sfx('boom');}return true;}}}return false;}
function w58DashRocks(p){if(!G.world||p.dashT<=0)return;for(const s of W58.shelves)for(const r of s.rocks){if(w58S().iceRocks.includes(r.id))continue;if(segDist(p.px,p.py,p.x,p.y,r.x,r.y)<r.r+p.r)w58IceRockBreak(r,s);}}
// --- 69: бури ---
function w58StormTick(dt,sec){const w=G.w,S=G.save,p=G.player;
  for(const k of [2,3]){let s=w.storms[k];if(!s){const ws=w58S();const first=!ws['storm'+k];s=w.storms[k]={sec:k,kind:k===2?'snow':'rain',ph:'wait',t:first?180:60+Math.random()*60,k:0,x:0,y:0,warned:false};}
    const playerIn=sec===k;if(!playerIn&&s.ph==='wait')continue;
    s.t-=dt;
    if(s.ph==='wait'){if(!s.warned&&s.t<=20&&playerIn&&!G.anom){s.warned=true;radioLine('МЕТЕО','#9fb0c4',k===2?'Снежный фронт входит в сектор с запада. Видимость упадёт.':'Ржавый дождь с севера. Берегите щит.',0);}
      if(s.t<=0){if(G.anom||G.event==='conv'){s.t=15;continue;}const b=WORLD.sectors[k].box;const side=Math.random()<.5?0:1;if(k===2){s.x=b[0]+200;s.y=b[1]+800+Math.random()*(b[3]-b[1]-1600);s.dir=0;if(Math.hypot(s.x-WORLD.abyss.x,s.y-WORLD.abyss.y)<2000)s.y=b[1]+800;}else{s.x=b[0]+800+Math.random()*(b[2]-b[0]-1600);s.y=b[1]+200;s.dir=Math.PI/2;}
        s.ph='born';s.t=20;s.k=0;s.warned=false;s.box=null;w58S()['storm'+k]=1;}}
    else if(s.ph==='born'){s.k=Math.min(1,1-s.t/20);if(s.t<=0){s.ph='move';s.t=90;s.k=1;s.box={got:false};}}
    else if(s.ph==='move'){const b=WORLD.sectors[k].box;if(!(s.dir>-1e9))s.dir=0;s.dir+=(Math.random()-.5)*dt*.3;s.x+=Math.cos(s.dir)*40*dt;s.y+=Math.sin(s.dir)*40*dt;s.x=clamp(s.x,b[0]+300,b[2]-300);s.y=clamp(s.y,b[1]+300,b[3]-300);
      if(G.anom){const a=G.anom.a;const dx=s.x-a.x,dy=s.y-a.y,d=Math.hypot(dx,dy)||1;if(d<1300){s.x+=dx/d*60*dt;s.y+=dy/d*60*dt;}}
      {const A=WORLD.abyss,dx=s.x-A.x,dy=s.y-A.y,d=Math.hypot(dx,dy)||1;if(d<2000){s.x+=dx/d*80*dt;s.y+=dy/d*80*dt;s.dir=Math.atan2(dy,dx);}}// 0.5.9: бури обходят Бездну
      if(s.t<=0){s.ph='fade';s.t=20;}}
    else if(s.ph==='fade'){s.k=Math.max(0,s.t/20);if(s.t<=0){s.ph='wait';s.t=60+Math.random()*60;s.k=0;s.box=null;}}
    // груз в центре
    if(s.box&&!s.box.got&&(s.ph==='move'||s.ph==='fade')&&p.hp>0&&Math.hypot(p.x-s.x,p.y-s.y)<60){s.box.got=true;const v=k===2?30:40;S.carry+=v;if(k===2)dropCell(s.x,s.y,0);floater(p.x,p.y-30,(k===2?'ЗАМЁРЗШИЙ ГРУЗ':'СМЫТЫЙ КОНТЕЙНЕР')+' · +'+v+' ЛОМА','#ffb84d');sfx('level');conEvent('stormBox');
      if(k===3&&!s.box.guards){s.box.guards=1;}}
    if(s.box&&!s.box.got&&k===3&&!s.box.guards&&s.ph==='move'&&playerIn&&Math.hypot(p.x-s.x,p.y-s.y)<700){s.box.guards=1;for(let i=0;i<2;i++)w58SpawnCopy(s.x+rnd(-80,80),s.y+rnd(-80,80),null);}
  }
}
function w58Hidden(e){const w=G.w;if(!w)return false;const p=G.player;if(!p)return false;const s=w58InStorm(e.x,e.y);if(!s||s.kind!=='snow')return false;return Math.hypot(e.x-p.x,e.y-p.y)>420*(2-s.k);}
function w58NoFire(x,y){if(!G.world||!G.w)return false;const s=w58InStorm(x,y);if(!s||s.kind!=='snow')return false;const p=G.player;return p&&Math.hypot(x-p.x,y-p.y)>420;}

// --- 63: дрейфующие записи ---
function w58RecText(r){const ws=w58S(),ch=storyFlag('inv14');let t=r.text;if(ch==='cold')t=t.split(' ').map((w,i)=>i%3===2?'░░░':w).join(' ');if(ch==='memory')t+=' '+r.memo;return t;}
function w58RecTick(dt){const ws=w58S(),p=G.player,S=G.save;if(!w58SecOpen()||p.hp<=0)return;
  for(const r of W58.recs){if(ws.arcRec.includes(r.id)||r.frozen||r.core&&!(G.anom&&G.anom.a.kind==='coldcore'&&G.anom.t>=20&&G.anom.t<30))continue;
    const q=w58RecPos(r);const d=Math.hypot(p.x-q.x,p.y-q.y);
    if(r.drift&&d<240&&d>60&&p.dashT<=0){r.esc=(r.esc||0)+dt;const a=Math.atan2(q.y-p.y,q.x-p.x);r.x+=Math.cos(a)*60*dt;r.y+=Math.sin(a)*60*dt;const b=WORLD.sectors[2].box;r.x=clamp(r.x,b[0]+300,b[2]-300);r.y=clamp(r.y,b[1]+300,b[3]-300);}
    if(d<60){ws.arcRec.push(r.id);const v=storyFlag('inv14')==='cold'?30:15;S.lom+=v;conEvent('arcRec');const n=ws.arcRec.length;toast(r.title,w58RecText(r)+` (ЗАПИСЬ ${n}/6 · +${v} ЛОМА · J — бортжурнал)`);sfx('pick');explode(q.x,q.y,'#bfe8ff',10,.6);
      if(n>=6&&S.story&&!S.story.arcAll){S.story.arcAll=1;addPilotXP(60);banner('КАТАЛОГ ЦИКЛОВ СОБРАН','+60 ОПЫТА ПИЛОТА · ЗАПИСЬ В ХРОНИКЕ');radioLine('Э. В.','#ffd36b','Теперь ты знаешь их поимённо.',2);}
      saveWorld();}
    if(d<1200)r.seen=true;}
}
// --- 70: радиомаяки Архива ---
function w58BeaconDead(){return w58S().arcBeacons.length>=3;}
function w58BeaconTick(dt){const ws=w58S(),p=G.player,w=G.w;if(!w58After(11)||p.hp<=0||w.noBeacons)return;
  for(const b of W58.beacons){if(ws.arcBeacons.includes(b.id))continue;const d=Math.hypot(p.x-b.x,p.y-b.y);const F=w.beaconFights[b.id]||(w.beaconFights[b.id]={hp:900,guards:[],regen:0,scanT:6,ring:null,active:false,ghosts:false});
    b.F=F;
    if(!F.active){if(d<1000&&w58ZoneReady({after:11})){F.active=true;F.regen=0;if(!F.guards.some(g=>g.alive)){F.guards=[];[['frost',0],['guard',1],['frost',2]].forEach(([t,i])=>{const a=i/3*TAU,e=spawnEnemy(t,b.x+Math.cos(a)*150,b.y+Math.sin(a)*150,{spawnT:.7,noAffix:true,beacon:b.id});F.guards.push(e);});}G.event=G.event||'beacon';}
      else{if(F.guards.length&&!F.guards.some(g=>g.alive)){F.regen+=dt;if(F.regen>=60){F.guards=[];F.regen=0;}}continue;}}
    if(d>2000){F.active=false;G.enemies.forEach(e=>{if(e.beacon===b.id)e.alive=false;});F.guards=[];F.regen=0;if(G.event==='beacon')G.event=null;continue;}
    const shielded=F.guards.some(g=>g.alive);F.shield=shielded;
    if(!shielded&&!F.ghosts){F.ghosts=true;for(let i=0;i<2;i++){const a=rnd(0,TAU);spawnEnemy('phantom',p.x+Math.cos(a)*700,p.y+Math.sin(a)*700,{spawnT:.5,noAffix:true,beacon:b.id});}floater(b.x,b.y-50,'КУПОЛ СНЯТ · ПРИЗРАКИ','#9fd8ff');}
    F.scanT-=dt;if(F.scanT<=0){F.scanT=6;F.ring={r:0,t:0};}
    if(F.ring){F.ring.r+=600*dt;F.ring.t+=dt;if(!F.ring.hit&&Math.abs(Math.hypot(p.x-b.x,p.y-b.y)-F.ring.r)<24&&p.dashT<=0&&p.hp>0){F.ring.hit=true;G.w.chillT=Math.max(G.w.chillT,2);addIce(1);floater(p.x,p.y-28,'ОБНАРУЖЕН','#9fd8ff');if(w.wander&&w.wander.alive&&Math.hypot(w.wander.x-p.x,w.wander.y-p.y)<2500)w.wander.mark=8;}if(F.ring.r>900)F.ring=null;}
    if(F.hp<=0){ws.arcBeacons.push(b.id);G.enemies.forEach(e=>{if(e.beacon===b.id)e.alive=false;});explode(b.x,b.y,'#9fd8ff',40,1.4);sfx('bigboom');G.save.lom+=35;revealAround(b.x,b.y,1500);const n=ws.arcBeacons.length;banner('МАЯК АРХИВА УНИЧТОЖЕН · '+n+'/3','+35 ЛОМА · КАРТА РАСКРЫТА');conEvent('arcBeacon');if(G.event==='beacon')G.event=null;
      if(n>=3){G.save.lom+=100;addPilotXP(50);if(G.save.story)G.save.story.arcSilence=1;radioLine('ИНВЕНТАРИЗАТОР','#9fd8ff','Связь с сектором ░░░ потеряна. Объект 013 ░░░ вне каталога.',1);setTimeout(()=>banner('АРХИВ ОГЛОХ','+100 ЛОМА · +50 ОПЫТА · ЛОМ СЕКТОРА III ×1,25'),2800);}
      saveWorld();}}
}
function w58BeaconHit(b,charged){if(!w58After(11))return false;const ws=w58S();for(const bc of W58.beacons){if(ws.arcBeacons.includes(bc.id))continue;const F=bc.F;if(!F||!F.active)continue;
    if(Math.hypot(b.x-bc.x,b.y-bc.y)<34+(b.r||4)){if(F.shield){b.life=0;sfx('block');if(SET.fx)part(b.x,b.y,rnd(-60,60),rnd(-60,60),.2,'#bfe8ff',2);return true;}F.hp-=b.dmg;F.flash=.08;if(!charged)b.life=0;sfx('hit');return true;}}return false;}
// --- 67: Архиватор-блуждатель ---
function w58WanderTick(dt,sec){const w=G.w,ws=w58S(),p=G.player;if(!w58After(12))return;
  if(w.wanderT>0)w.wanderT-=dt;
  const e=w.wander;if(e&&!e.alive){w.wander=null;return;}
  if(e){const A=WORLD.abyss,dx=e.x-A.x,dy=e.y-A.y,d=Math.hypot(dx,dy)||1;if(d<1500){e.x=A.x+dx/d*1500;e.y=A.y+dy/d*1500;}}// 0.5.9: блуждатель не подходит к Бездне
  if(!e){if(w.wanderT>0||(G.event&&G.event!=='zone'&&G.event!=='beacon'))return;const ns=WORLD.nodes.filter(n=>n.sec===2);const far=ns.filter(n=>Math.hypot(n.x-p.x,n.y-p.y)>2200);if(!far.length)return;const n=far[Math.floor(Math.random()*far.length)];
    const b=WORLD.sectors[2].box;const sx=clamp(n.x+600,b[0]+200,b[2]-200),sy=clamp(n.y+300,b[1]+200,b[3]-200);const a=spawnEnemy('archivist',sx,sy,{noAffix:true,wander:true,spawnT:.5});a.hp*=3;a.maxHp=a.hp;a.affix=['screen'];a.r*=1.25;a.wst='roam';a.wt=0;a.wnode=n;a.cd=0;a.recCd=0;w.wander=a;
    for(let i=0;i<2;i++){const f=spawnEnemy('frost',a.x+rnd(-60,60),a.y+rnd(-60,60),{noAffix:true,spawnT:.5});f.escortOf=a;f.orb=i*Math.PI;}return;}
  if(e.escortOf)return;
  for(const f of G.enemies){if(f.escortOf===e&&f.alive&&e.alive){const a=f.orb+G.t*.8;const tx=e.x+Math.cos(a)*200,ty=e.y+Math.sin(a)*200;if(Math.hypot(p.x-f.x,p.y-f.y)>900){f.x+=(tx-f.x)*Math.min(1,dt*2);f.y+=(ty-f.y)*Math.min(1,dt*2);}}}
  // засада
  const A=w.ambush;if(A){A.t-=dt;if(A.t<=0||sec!==2)w.ambush=null;else{const pts=[...WORLD.nodes.filter(n=>n.sec===2),...W58.shelves,...W58.recs.map(w58RecPos),...W58.beacons];
      for(const q of pts){if(Math.hypot(p.x-q.x,p.y-q.y)<300){w.ambush=null;const n=w58BeaconDead()?1:2;for(let i=0;i<n;i++)w58AmbushCopy(q,A.path,i);floater(p.x,p.y-40,'ЗАСАДА · ЗАПИСЬ ПРЕЖНЕГО МАРШРУТА','#8fd8ff');sfx('warn');break;}}}}
}
function w58AmbushCopy(q,path,i){const p=G.player;const ox=q.x-path[0].x+rnd(-80,80),oy=q.y-path[0].y+rnd(-80,80);const pth=path.map(s=>({x:s.x+ox,y:s.y+oy,t:s.t}));
  const c=spawnEnemy('icecopy',pth[0].x,pth[0].y,{path:pth,pt:0,noAffix:true,noLoot:true,spawnT:.4,fire:true,frate:Math.max(.5,G.st.rate*2)*atkK(),fdmg:clamp(G.st.dmg*.5,6,22),skin:curSkin()});c.contact=14;}
function w58WanderAI(e,dt,c){const p=G.player,w=G.w;const d=c.d;e.wt+=dt;
  if(e.st==='rec'){e.timer-=dt;e.bx=p.x;e.by=p.y;e.vx*=.9;e.vy*=.9;
    if(e.hp<=e.recHp-e.maxHp*.25||recBeamHit(e)){e.st='seek';e.wst='flee';e.wt=0;e.recCd=6;floater(e.x,e.y-20,'ЗАПИСЬ ПРЕРВАНА','#8fd8ff');sfx('block');}
    else if(e.timer<=0){e.st='seek';e.wst='flee';e.wt=0;e.recCd=12;const log=G.posLog.filter(q=>G.t-q.t<=3);if(log.length>=4){w.ambush={t:180,path:log.map(q=>({x:q.x,y:q.y,t:q.t-log[0].t}))};floater(e.x,e.y-20,'ЗАПИСЬ ПРИНЯТА · ЗАСАДА ВПЕРЕДИ','#8fd8ff');}}
    return;}
  e.recCd=Math.max(0,(e.recCd||0)-dt);if(e.mark>0)e.mark-=dt;
  if(e.wst==='roam'){if(d<1400||e.mark>0){e.wst='watch';e.wt=0;if(!e.seenOnce){e.seenOnce=1;radioLine('АРХИВ','#9fd8ff','Объект 013 в поле зрения. Сверка возможна.',.3);}w58S().wander.seen={x:Math.round(e.x),y:Math.round(e.y)};}
    const n=e.wnode;if(!n||Math.hypot(n.x-e.x,n.y-e.y)<560){const ns=WORLD.nodes.filter(q=>q.sec===2&&q!==e.wnode);e.wnode=ns[Math.floor(Math.random()*ns.length)];}
    const tx=e.wnode.x,ty=e.wnode.y;steer(e,tx-e.x,ty-e.y,70,dt,2);if(e.hp<e.maxHp)e.hp=Math.min(e.maxHp,e.hp+e.maxHp/30*dt);return;}
  if(d>2200){e.wst='roam';return;}
  if(e.wst==='flee'){const a=Math.atan2(e.y-p.y,e.x-p.x);steer(e,Math.cos(a),Math.sin(a),G.st.speed*.85,dt,3);if(e.wt>5)e.wst='watch';return;}
  // watch
  if(d<300){e.wst='flee';e.wt=0;return;}
  const m=clamp((d-700)/100,-1,1);steer(e,c.ux*m-c.uy*.5*e.dir,c.uy*m+c.ux*.5*e.dir,e.spd,dt,3);if(Math.random()<dt*.2)e.dir*=-1;
  if(d<800&&e.recCd<=0&&p.hp>0&&onScreen(e)){e.st='rec';e.timer=w58BeaconDead()?5:3.5;e.recHp=e.hp;e.bx=p.x;e.by=p.y;sfx('warn');}
}
function w58WanderDied(e){const w=G.w,ws=w58S(),S=G.save;w.wander=null;w.wanderT=600;w.ambush=null;G.enemies.forEach(f=>{if(f.escortOf===e)f.alive=false;});
  const first=!ws.wander.killed;ws.wander.killed=(ws.wander.killed||0)+1;const v=first?60:30;for(let i=0;i<v;i++)G.pick.push({k:'lom',x:e.x+rnd(-20,20),y:e.y+rnd(-20,20),vx:rnd(-120,120),vy:rnd(-120,120),r:5,t:0,life:30,v:1});
  dropCell(e.x,e.y,0);dropCell(e.x+10,e.y,0);addPilotXP(25);conEvent('wander');floater(e.x,e.y-30,'СТРАНСТВУЮЩИЙ АРХИВАТОР УНИЧТОЖЕН · +'+v,'#8fd8ff');
  if(first){const r=W58.recs.find(q=>!ws.arcRec.includes(q.id)&&q.drift);if(r){r.drift=false;r.x=e.x;r.y=e.y+40;}}}
// --- 73: стаи ржавых копий ---
function w58SpawnCopy(x,y,pack){const c=spawnEnemy('rustcopy',x,y,{noAffix:true,noLoot:true,spawnT:.8,skin:COPY_SKINS[Math.floor(Math.random()*COPY_SKINS.length)],pack});c.hp=c.maxHp=220;c.secArm=.19;c.spd=Math.min(150*1.45,G.st.speed*1.10);c.cd=rnd(.5,1.5);return c;}
function w58PackTick(dt,sec){const w=G.w,S=G.save,p=G.player;if(!w58After(18)||w.noPacks)return;const ch=storyFlag('obod18');const nP=ch==='service'?3:2;
  while(w.packs.length<nP){const f=W58.rust[Math.floor(Math.random()*W58.rust.length)];w.packs.push({x:f.x+rnd(-100,100),y:f.y+rnd(-100,100),st:'roam',t:rnd(20,40),tgt:null,ships:[],dead:0,hostile:ch!=='service',hostT:0,uid:++G.uid});}
  for(const P of w.packs){
    if(P.dead>0){P.dead-=dt;if(P.dead<=0){const f=W58.rust[Math.floor(Math.random()*W58.rust.length)];Object.assign(P,{x:f.x,y:f.y,st:'roam',t:20,ships:[],hostile:ch!=='service',hostT:0});}continue;}
    if(P.hostT>0){P.hostT-=dt;if(P.hostT<=0&&ch==='service'){P.hostile=false;}}
    const live=P.ships.filter(e=>e.alive);
    if(!live.length&&P.ships.length){P.ships=[];P.dead=900;const pk=w58S().packs;pk.n=(pk.n||0)+1;const v=pk.n<=2?(ch==='service'?30:45):(ch==='service'?15:20);S.carry+=v;addPilotXP(15);floater(p.x,p.y-40,'СТАЯ РАЗБИТА · +'+v+' ЛОМА','#c96a2a');sfx('level');if(ch==='service'&&!w58S().packs.evWarn){w58S().packs.evWarn=1;radioLine('Э. В.','#ffd36b','Ты стреляешь в тех, кто тебе доверял.',1);}continue;}
    const d=Math.hypot(p.x-P.x,p.y-P.y);
    if(!P.ships.length){if(d<1600&&sec===3&&w.noSpawnT<=0&&!(G.event&&G.event!=='zone')){for(let i=0;i<3;i++){const c=w58SpawnCopy(P.x+rnd(-60,60),P.y+rnd(-60,60),P);c.peace=!P.hostile;c.contact=c.peace?0:12;P.ships.push(c);}}
      else{// абстрактное движение
        if(P.st==='roam'){P.t-=dt;if(P.t<=0){P.tgt=W58.rust[Math.floor(Math.random()*W58.rust.length)];P.st='go';}}
        else{const dx=P.tgt.x-P.x,dy=P.tgt.y-P.y,l=Math.hypot(dx,dy);if(l<40){P.st='roam';P.t=rnd(20,40);}else{P.x+=dx/l*90*dt;P.y+=dy/l*90*dt;}}}
      continue;}
    // корабли есть: центр = средняя точка
    P.x=live.reduce((a,e)=>a+e.x,0)/live.length;P.y=live.reduce((a,e)=>a+e.y,0)/live.length;
    if(d>2400||sec!==3){P.ships.forEach(e=>e.alive=false);P.ships=[];continue;}
    for(const e of live){e.peace=!P.hostile;e.contact=e.peace?0:12;}
  }
}
function w58CopyAI(e,dt,c){const p=G.player,P=e.pack;const d=c.d;
  if(e.peace){// мирная: летит рядом, стреляет по врагам игрока
    const a=(e.uid%7)/7*TAU+G.t*.5;const tx=p.x+Math.cos(a)*400,ty=p.y+Math.sin(a)*400;steer(e,tx-e.x,ty-e.y,e.spd,dt,2.5);
    e.cd-=dt;if(e.cd<=0){e.cd=rnd(1.2,1.6);let best=null,bd=400;for(const o of G.enemies){if(!o.alive||o===e||o.type==='rustcopy'||o.peace||o.spawnT>0||o.tug)continue;const q=Math.hypot(o.x-e.x,o.y-e.y);if(q<bd){bd=q;best=o;}}
      if(best){const a2=Math.atan2(best.y-e.y,best.x-e.x);G.pb.push({x:e.x,y:e.y,px:e.x,py:e.y,vx:Math.cos(a2)*600,vy:Math.sin(a2)*600,dmg:4,pierce:0,rico:0,life:.9,hit:[e],turret:true});}}
    return;}
  if(e.hp<e.maxHp*.4&&!e.retreating){e.retreating=true;e.rf=W58.rust.reduce((a,b)=>Math.hypot(b.x-e.x,b.y-e.y)<Math.hypot(a.x-e.x,a.y-e.y)?b:a);}
  if(e.retreating){const f=e.rf;steer(e,f.x-e.x,f.y-e.y,e.spd,dt,3);if(Math.hypot(f.x-e.x,f.y-e.y)<f.r*.6){e.hp=Math.min(e.maxHp*.8,e.hp+10*dt);if(e.hp>=e.maxHp*.8)e.retreating=false;}return;}
  const m=clamp((d-450)/150,-1,1);const spread=((e.uid%3)-1)*.6;steer(e,c.ux*m-c.uy*spread,c.uy*m+c.ux*spread,e.spd,dt,3);
  e.cd-=dt;if(e.cd<=0&&onScreen(e)&&p.hp>0&&d<900){e.cd=rnd(1.2,1.6)*atkK();const a=Math.atan2(p.y+p.vy*.2-e.y,p.x+p.vx*.2-e.x);const q=shootE(e.x+Math.cos(a)*14,e.y+Math.sin(a)*14,a,430,8,'#ffb060',4);if(q)q.copy=true;}
}
function w58CopyHurt(e){const P=e.pack;if(P&&!P.hostile){P.hostile=true;P.hostT=300;for(const o of P.ships)o.peace=false;floater(e.x,e.y-24,'КЛИЕНТЫ: ВРАЖДЕБНЫ · 5 МИН','#c96a2a');}}
// --- 65: гражданские буксиры ---
function w58TugTick(dt,sec){const w=G.w,S=G.save,p=G.player,ws=w58S();const T=w.tug;
  if(!T){if(!(sec===2&&w58After(11))&&!(sec===3&&w58After(15)))return;w.tugT-=dt;if(w.tugT>0)return;w.tugT=90;if(Math.random()>.18&&!w.forceTug)return;if((G.event&&G.event!=='zone')||w58InStorm(p.x,p.y)||(ws.tugs.last&&G.t-ws.tugs.last<480&&!w.forceTug))return;w.forceTug=0;
    const a=rnd(0,TAU),d=rnd(1400,1800);const x0=p.x+Math.cos(a)*d,y0=p.y+Math.sin(a)*d;const a2=a+Math.PI+rnd(-.35,.35);const L=rnd(3000,3600);const x1=x0+Math.cos(a2)*L,y1=y0+Math.sin(a2)*L;if([[x0,y0],[x1,y1],[p.x,p.y]].some(([qx,qy])=>Math.hypot(qx-WORLD.abyss.x,qy-WORLD.abyss.y)<1500))return;// 0.5.9: буксир не идёт мимо Бездны
    const guard=ws.tugs.rob>0&&sec!==3;
    w.tug={x:x0,y:y0,x1,y1,vx:0,vy:0,name:W58_NAMES.tug[Math.floor(Math.random()*5)],hp:400,maxHp:400,st:'idle',t:0,sec,cont:[],amb:[0,0],near:0,warn:0,alive:true,r:30,spd:110,guard,contR:3,done:false};
    ws.tugs.last=G.t;if(guard){const g=spawnEnemy('hunter',x0,y0,{noAffix:true,spawnT:.5,tugGuard:true});g.tugG=true;}return;}
  if(!T.alive)return;T.t+=dt;if(T.warnT>0)T.warnT-=dt;
  const dx=T.x1-T.x,dy=T.y1-T.y,L=Math.hypot(dx,dy);
  const sp=T.st==='rob'?T.spd*1.6:(T.guard&&Math.hypot(p.x-T.x,p.y-T.y)<700&&T.st==='idle'?T.spd*1.5:T.spd);
  if(L>20){T.vx=dx/L*sp;T.vy=dy/L*sp;T.x+=T.vx*dt;T.y+=T.vy*dt;}
  for(const r of G.rocks){if(!r.alive)continue;const q=Math.hypot(T.x-r.x,T.y-r.y),m=r.r+T.r;if(q<m&&q>0){T.x=r.x+(T.x-r.x)/q*m;T.y=r.y+(T.y-r.y)/q*m;}}
  const dP=Math.hypot(p.x-T.x,p.y-T.y);
  if(T.st==='idle'){if(dP<350&&p.hp>0){T.near+=dt;if(T.near>=3){T.st='escort';G.event='tug';radioLine(T.name,'#7affc9','Спасибо, пилот. Держитесь рядом — впереди неспокойно.',0);T.len0=Math.hypot(T.x1-T.x,T.y1-T.y);T.x0=T.x;T.y0=T.y;}}else T.near=0;}
  if(T.st==='escort'){const pr=1-Math.hypot(T.x1-T.x,T.y1-T.y)/T.len0;
    for(const [i,f] of [[0,.35],[1,.7]]){if(!T.amb[i]&&pr>=f){T.amb[i]=1;const set=T.sec===2?(i?{archivist:1,phantom:2}:{frost:2,phantom:2}):(i?{shade:2,rammer:1}:{rammer:3,repairer:1});const a=Math.atan2(T.vy,T.vx);
        for(const [t,c] of Object.entries(set))for(let k=0;k<c;k++){const ax=T.x+Math.cos(a+rnd(-.6,.6))*650,ay=T.y+Math.sin(a+rnd(-.6,.6))*650;const e=spawnEnemy(t,ax,ay,{noAffix:true,spawnT:.6,tugAtk:true});if(e&&T.sec===3){e.hp*=.6;e.maxHp=e.hp;}}
        floater(T.x,T.y-40,'ЗАСАДА','#ff4f6e');sfx('warn');}}
    if(dP>3000){T.alive=false;G.event=null;floater(p.x,p.y-40,'БУКСИР УШЁЛ','#7a8ea5');}}
  // урон буксиру
  if(T.st!=='rob'){for(const b of G.eb){if(b.life<=0)continue;if(Math.hypot(b.x-T.x,b.y-T.y)<T.r+(b.r||4)){b.life=0;T.hp-=Math.min(8,b.dmg);T.flash=.1;}}
    for(const e of G.enemies){if(!e.alive||!e.tugAtk)continue;if(e.tugCd>0)e.tugCd-=dt;if(Math.hypot(e.x-T.x,e.y-T.y)<T.r+e.r+4&&!(e.tugCd>0)){e.tugCd=2;T.hp-=15;T.flash=.1;}}
    if(T.flash>0)T.flash-=dt;
    if(T.hp<=0){T.alive=false;explode(T.x,T.y,'#7affc9',40,1.4);sfx('bigboom');G.enemies.forEach(e=>{if(e.tugAtk)e.alive=false;});if(G.event==='tug')G.event=null;floater(T.x,T.y-40,'БУКСИР ПОТЕРЯН','#ff4f6e');return;}}
  if(T.st==='rob'){T.robT=(T.robT||0)+dt;if(T.robT>=6&&!T.robG){T.robG=1;for(let i=0;i<2;i++){const a=rnd(0,TAU);spawnEnemy('hunter',p.x+Math.cos(a)*800,p.y+Math.sin(a)*800,{noAffix:true,spawnT:.5});}floater(p.x,p.y-40,'ОХРАНА ГРАЖДАНСКИХ','#ff4f6e');}
    for(const c of T.cont){if(c.hp<=0)continue;c.x+=c.vx*dt;c.y+=c.vy*dt;c.vx*=.98;c.vy*=.98;}
    if(T.cont.every(c=>c.hp<=0)||dP>3000||T.robT>60){if(dP<=3000)for(const c of T.cont)if(c.hp>0){}T.alive=false;if(G.event==='tug')G.event=null;}}
  if(L<=20&&T.st!=='rob'){T.alive=false;if(T.st==='escort'){const v=T.sec===2?70:90;S.lom+=v;addPilotXP(30);p.en=100;ws.tugs.esc++;banner('БУКСИР ДОШЁЛ','+'+v+' ЛОМА НА СКЛАД · +30 ОПЫТА · НАКОПИТЕЛЬ ПОЛОН');radioLine(T.name,'#7affc9','Дошли. Если ещё раз пересечёмся — мы вас узнаем.',0);if(S.story)S.story.tugEsc=(S.story.tugEsc||0)+1;
      if(ws.tugs.esc===3&&!ws.tugs.cache){ws.tugs.cache=1;const f=W58.rust[0];WORLD.caches.push({id:'c58',x:f.x+600,y:f.y-600,skin:null,civ:true});banner('ГРАЖДАНСКИЕ ОСТАВИЛИ ТАЙНИК','СЕКТОР IV · 120 ЛОМА');}
      G.enemies.forEach(e=>{if(e.tugAtk)e.alive=false;});saveWorld();}if(G.event==='tug')G.event=null;}
}
function w58TugHit(b){const T=G.w&&G.w.tug;if(!T||!T.alive)return false;
  if(T.st==='rob'){for(const c of T.cont){if(c.hp<=0)continue;if(Math.hypot(b.x-c.x,b.y-c.y)<16+(b.r||4)){c.hp-=b.dmg;b.life=0;if(c.hp<=0){explode(c.x,c.y,'#7affc9',12,.7);G.save.carry+=25;dropCell(c.x,c.y,0);floater(c.x,c.y-20,'+25 ЛОМА · ЯЧЕЙКА','#ffb84d');sfx('boom');}return true;}}return false;}
  if(Math.hypot(b.x-T.x,b.y-T.y)<T.r+(b.r||4)){if(T.st==='escort'&&G.enemies.some(e=>e.alive&&e.tugAtk))return false;b.life=0;T.warn=(T.warn||0);if(T.warnT>0&&T.warn>=1){w58TugRob(T);}else{T.warn=1;T.warnT=5;floater(T.x,T.y-40,'«НЕ СТРЕЛЯЙТЕ!»','#7affc9');radioLine(T.name,'#7affc9','Не стреляйте! Мы гражданские!',0);}return true;}return false;}
function w58TugRob(T){const ws=w58S();T.st='rob';G.event='tug';ws.tugs.rob++;for(let i=0;i<3;i++){const a=rnd(0,TAU);T.cont.push({x:T.x-T.vx*.3+Math.cos(a)*40,y:T.y-T.vy*.3+Math.sin(a)*40,vx:Math.cos(a)*30,vy:Math.sin(a)*30,hp:120});}
  G.enemies.forEach(e=>{if(e.tugAtk)e.alive=false;});floater(T.x,T.y-40,'БУКСИР СБРОСИЛ ГРУЗ И УХОДИТ','#ff4f6e');sfx('warn');
  if(ws.tugs.rob===3)radioLine('Э. В.','#ffd36b','Они были последними, кто ещё летал сам.',2);}
// --- 64: раскопки у обломка Инвентаризатора ---
function w58DigTick(dt){const S=G.save,p=G.player,w=G.w;if(!S||!S.story||!S.story.inv14)return;const ws=w58S();const q=sbWreckPos(14);const d=Math.hypot(p.x-q.x,p.y-q.y);
  const prog=S.story.invDig||0;if(prog>=4||d>1600){if(w.digs&&d>2200){w.digs.forEach(c=>{if(c.alive)c.alive=false;});w.digs=null;}return;}
  if(!w.digs){w.digs=[];const L=['ЩИТ','РЫВОК','ОРУДИЕ','013'];for(let i=0;i<4;i++){if(i<prog){w.digs.push(null);continue;}const a=i/4*TAU-Math.PI/2;const c=spawnEnemy('invcell',q.x+Math.cos(a)*160,q.y+Math.sin(a)*160,{noAffix:true,noLoot:true,spawnT:.3,dig:i,digL:L[i]});c.hp=c.maxHp=300;c.cell=null;w.digs.push(c);}}
}
function w58DigHurt(e,dmg){const S=G.save,prog=S.story.invDig||0;if(e.dig!==prog){e.domeFlash=.15;sfx('block');return 0;}return dmg;}
function w58DigDied(e){const S=G.save,ws=w58S(),w=G.w;S.story.invDig=(S.story.invDig||0)+1;const n=S.story.invDig;S.carry+=20;const q=sbWreckPos(14);
  const lines=['ЩИТ: отказано в циклах IX, XVII. Хранится как образец.','РЫВОК: 4 102 записи. Эталон — цикл XX.','ОРУДИЕ: калибр менялся 31 раз. Результат один.',''];
  if(n===1||n===3){for(let i=0;i<2;i++){const a=rnd(0,TAU);const path=[];for(let k=0;k<=20;k++)path.push({x:q.x+Math.cos(a)*300+Math.cos(a+k*.3)*120,y:q.y+Math.sin(a)*300+Math.sin(a+k*.3)*120,t:k/5});const c=spawnEnemy('icecopy',path[0].x,path[0].y,{path,pt:0,noAffix:true,noLoot:true,spawnT:.5,fire:true,frate:Math.max(.5,G.st.rate*2)*atkK(),fdmg:clamp(G.st.dmg*.5,6,22),skin:curSkin()});c.contact=14;}
    if(n===3)spawnEnemy('frost',q.x+rnd(-200,200),q.y-300,{noAffix:true,spawnT:.5});floater(q.x,q.y-100,'ЗАЩИТА КАРКАСА','#8fd8ff');}
  if(n<4){toast('ЯЧЕЙКА КАТАЛОГА · '+e.digL,lines[n-1]+' (+20 лома)');}
  else{const ch=storyFlag('inv14');if(!S.ownSkins.includes('archive')){S.ownSkins.push('archive');banner('СКИН НАЙДЕН · «АРХИВНЫЙ»','ЯЧЕЙКА 013 · АНГАР «ЗЕРКАЛО»');}
    if(ch==='memory')toast('ЯЧЕЙКА 013','На дне ячейки — записка не по форме: «Я вписал тебя в каталог сам, чтобы Архив не мог тебя стереть. Прости за номер». — Э. В. (+20 лома)');else{S.carry+=40;toast('ЯЧЕЙКА 013','Ячейка пуста. Холод стёр записи, остался лом. (+60 лома)');}}
  sfx('level');saveWorld();}
// --- 72: Холодное ядро (аномалия) ---
function w58CoreStart(a){const A=G.anom;A.dur=35;A.need=5;A.got=0;A.iceT=2.5;A.shard=null;A.wave=0;A.recT=0;w58CoreShard(a);banner('АНОМАЛИЯ · ХОЛОДНОЕ ЯДРО','5 ОСКОЛКОВ ТЕПЛА ЗА 35 С · ЛЁД РАСТЁТ · РЫВОК СБРАСЫВАЕТ');}
function w58CoreShard(a){const A=G.anom;let x,y,k=0;do{const ang=rnd(0,TAU),d=rnd(120,380);x=a.x+Math.cos(ang)*d;y=a.y+Math.sin(ang)*d;}while(A.shard&&Math.hypot(x-A.shard.x,y-A.shard.y)<250&&++k<20);A.shard={x,y,t:0};}
function w58CoreTick(dt,fail,win){const A=G.anom,a=A.a,p=G.player;const inS=Math.hypot(p.x-a.x,p.y-a.y)<420;
  if(A.got>=A.need){win(120);const S=G.save;if(!S.ownSkins.includes('rime')){S.ownSkins.push('rime');banner('СКИН НАЙДЕН · «НАСТ»','ЯДРО РАСКОЛОТО · АНГАР «ЗЕРКАЛО»');}return true;}
  if(A.t>A.dur){fail('ВРЕМЯ ВЫШЛО');return true;}if(Math.hypot(p.x-a.x,p.y-a.y)>900){fail('ВЫ ПОКИНУЛИ ЯДРО');return true;}
  if(inS){A.iceT-=dt;if(A.iceT<=0){A.iceT=2.5;addIce(1);}}
  if(A.shard){A.shard.t+=dt;if(Math.hypot(p.x-A.shard.x,p.y-A.shard.y)<24&&p.hp>0){A.got++;clearIce();G.iceImm=3;explode(A.shard.x,A.shard.y,'#ffb84d',10,.6);floater(p.x,p.y-26,'ТЕПЛО · '+A.got+'/5','#ffb84d');sfx('cell');if(A.got<A.need)w58CoreShard(a);else A.shard=null;}}
  const ph=A.t<12?0:A.t<24?1:2;if(A.wave<=ph){A.wave=ph+1;const sets=[{frost:2},{phantom:2,frost:1},{shade:2,hunter:1}];for(const [t,c] of Object.entries(sets[ph]))for(let i=0;i<c;i++){const ang=rnd(0,TAU);const e=spawnEnemy(t,a.x+Math.cos(ang)*600,a.y+Math.sin(ang)*600,{noAffix:true,spawnT:.5,anomObj:true});A.objs.push(e);}}
  for(const e of G.enemies){if(!e.alive)continue;e.tK=Math.hypot(e.x-a.x,e.y-a.y)<420?.5:1;}
  if(A.t>=20&&A.t<30){const r=W58.recs.find(q=>q.core);if(r&&!w58S().arcRec.includes(r.id)){r.x=a.x;r.y=a.y;}}
  return false;}
// --- 68: спецзадание «Конвейер» ---
const CONV={L:2400,W:180,cells:[[0,800,'ПРИЁМКА'],[800,1600,'СОРТИРОВКА'],[1600,2200,'ПРЕСС']]};
function w58ConvAvail(){const S=G.save;return !!W58.depot&&w58After(17)&&!(G.anom);}
function w58ConvStart(){const D=W58.depot,S=G.save,ws=w58S();if(!w58ConvAvail()||G.state!=='world')return;G.enemies.forEach(e=>{if(e.zone||e.tugAtk||e.pack)e.alive=false;});G.w.packs.forEach(P=>{P.ships=[];});W58.zones.forEach(z=>{z.active=false;});
  const a={id:'conv',kind:'conveyor',name:'КОНВЕЙЕР',x:D.x-CONV.L/2,y:D.y,hud:()=>{const A=G.anom;return 'КОНВЕЙЕР · ЦЕХ '+Math.min(3,A.cell+1)+' ИЗ 3 · '+Math.round(A.prog/CONV.L*100)+'% · БАРЖА '+Math.max(0,Math.ceil(A.bhp))+'/600';}};
  G.anom={a,t:0,got:0,objs:[],dur:1e9,x0:D.x-CONV.L/2,y0:D.y,prog:0,bhp:600,cell:0,phase:'set',pt:0,arms:[],press:[],sucks:[],lamps:[],gate:0,gateT:0,fin:false,ch:storyFlag('obod18')};
  const A=G.anom;for(let i=0;i<3;i++)A.arms.push({x:A.x0+950+i*230,side:i%2?1:-1,t:rnd(0,4),jam:0,hits:0,ph:'idle',sw:0});
  for(let i=0;i<2;i++)A.press.push({x:A.x0+1750+i*300,t:2+i*2.5,ph:'up',hold:0,shadow:0});
  G.event='conv';G.cardKey=null;banner('КОНВЕЙЕР','ВЫВЕДИТЕ БАРЖУ ЧЕРЕЗ ТРИ ЦЕХА');sfx('warn');radioLine('КОЛЫБЕЛЬНАЯ','#7affc9','Трое в криосне. Мы не можем остановиться — лента держит.',.5);
  const p=G.player;p.x=A.x0+80;p.y=A.y0-120;}
function w58ConvFail(why){const A=G.anom;banner('ЗАДАНИЕ ПРОВАЛЕНО',why+' · ПОВТОР ЧЕРЕЗ 60 С');(G.anomCd||(G.anomCd={})).conv=G.t+60;G.enemies.forEach(e=>{if(e.conv||e.anomObj)e.alive=false;});G.anom=null;G.event=null;G.cardKey=null;G.enemies.forEach(e=>{e.tK=1;});}
function w58ConvTick(dt){const A=G.anom,a=A.a,p=G.player,S=G.save,ws=w58S();A.pt+=dt;const bx=A.x0+A.prog,by=A.y0;A.bx=bx;A.by=by;
  if(p.hp<=0){w58ConvFail('КОРАБЛЬ ПОТЕРЯН');return;}
  const out=Math.abs(p.y-A.y0)>700||p.x<A.x0-400||p.x>A.x0+CONV.L+500;A.outT=out?(A.outT||0)+dt:0;if(A.outT>3){w58ConvFail('ВЫ ПОКИНУЛИ ДЕПО');return;}
  if(A.bhp<=0){explode(bx,by,'#7affc9',50,1.5);sfx('bigboom');w58ConvFail('БАРЖА РАЗРУШЕНА');return;}
  if(A.phase==='set'){if(A.pt>5){A.phase='run';}return;}
  if(A.phase==='run'){let sp=24;const inCloud=G.fields.some(f=>f.rust&&Math.hypot(f.x-bx,f.y-by)<f.r);if(inCloud)sp*=.5;A.prog+=sp*dt;A.cell=A.prog<800?0:A.prog<1600?1:2;
    if(A.prog>=2200){A.prog=2200;A.phase='gate';A.gateT=0;banner('ШЛЮЗ','ЗАРЯДИТЕ КОЛЬЦО · 6 С В ЗЕЛЁНОМ КРУГЕ');for(let i=0;i<4;i++){const c=w58SpawnCopy(A.x0+1900+rnd(-60,60),by+rnd(-200,200),null);c.conv=true;c.peace=false;}}
    // цех 1: ремонтники
    if(A.cell===0){A.sT=(A.sT||0)-dt;if(A.sT<=0){A.sT=8;const n=G.enemies.filter(e=>e.alive&&e.conv&&e.type==='repairer').length,cap=A.ch==='scrap'?2:4;for(let i=0;i<2&&n+i<cap;i++){const e=spawnEnemy('repairer',bx+rnd(-100,100),by+(Math.random()<.5?-1:1)*600,{noAffix:true,spawnT:.5,conv:true,suck:true});}}
      if(!A.turrets){A.turrets=1;for(const s of [-1,1]){const e=spawnEnemy('gunner',A.x0+500,by+s*260,{noAffix:true,spawnT:.5,conv:true,fixedPos:true});e.spd=0;}}}
    for(const e of G.enemies){if(!e.alive||!e.suck||e.spawnT>0)continue;const q=Math.hypot(e.x-bx,e.y-by)||1;if(q<46){e.stuck=true;e.vx=e.vy=0;e.x=bx+(e.x-bx)/q*40;e.y=by+(e.y-by)/q*40;A.bhp-=6*dt;if(!A.suckHint){A.suckHint=1;floater(bx,by-40,'ИДЁТ РЕМОНТ КЛИЕНТА','#ffb060');}}else{e.x+=(bx-e.x)/q*150*dt;e.y+=(by-e.y)/q*150*dt;}}
    // цех 2: манипуляторы и коррозийник
    if(A.cell>=1){if(!A.cor){A.cor=1;spawnEnemy('corroder',A.x0+1200,by-500,{noAffix:true,spawnT:.5,conv:true});spawnEnemy('shade',A.x0+1000,by+500,{noAffix:true,spawnT:.5,conv:true});spawnEnemy('shade',A.x0+1400,by+500,{noAffix:true,spawnT:.5,conv:true});}
      for(const m of A.arms){if(m.jam>0){m.jam-=dt;continue;}m.t-=dt;if(m.ph==='idle'&&m.t<=0){m.ph='tele';m.t=1.2;}else if(m.ph==='tele'&&m.t<=0){m.ph='sweep';m.t=.4;if(Math.abs(bx-m.x)<140)A.bhp-=60;if(Math.abs(p.x-m.x)<140&&Math.abs(p.y-by)<CONV.W/2+20)damagePlayer(14);}else if(m.ph==='sweep'&&m.t<=0){m.ph='idle';m.t=4;}}}
    // цех 3: прессы
    if(A.cell>=2){if(!A.ram){A.ram=1;for(let i=0;i<3;i++)spawnEnemy('rammer',A.x0+2000+rnd(-100,100),by+(i%2?-1:1)*600,{noAffix:true,spawnT:.5,conv:true});A.ramT=15;}
      A.ramT-=dt;if(A.ramT<=0&&!A.ram2){A.ram2=1;for(let i=0;i<2;i++)spawnEnemy('rammer',A.x0+2000,by+(i%2?-1:1)*600,{noAffix:true,spawnT:.5,conv:true});}
      const per=A.ch==='service'?4:5;for(const P of A.press){if(P.hold>0){P.hold-=dt;P.ph='up';P.t=1.5;continue;}P.t-=dt;if(P.ph==='up'&&P.t<=0){P.ph='warn';P.t=1.5;sfx('warn');}else if(P.ph==='warn'&&P.t<=0){P.ph='down';P.t=.5;shake(8);if(Math.abs(bx-P.x)<110)A.bhp-=200;if(Math.abs(p.x-P.x)<110&&Math.abs(p.y-by)<CONV.W/2+10)damagePlayer(30);}else if(P.ph==='down'&&P.t<=0){P.ph='up';P.t=per-2;}}}
    return;}
  if(A.phase==='gate'){const gx=A.x0+2300,gy=A.y0+220;if(Math.hypot(p.x-gx,p.y-gy)<80&&p.hp>0)A.gateT+=dt;A.gate=Math.min(1,A.gateT/6);
    if(A.gate>=1){A.phase='done';A.pt=0;G.enemies.forEach(e=>{if(e.conv)e.alive=false;});banner('БАРЖА ВЫВЕДЕНА','ТРОЕ ЖИВЫ');radioLine('КОЛЫБЕЛЬНАЯ','#7affc9','Трое живы. Мы не знаем, кто вы, но запомним.',.5);
      const first=!ws.conveyor.done;const v=(first?240:80)+(A.bhp>=450?(first?60:20):0);S.lom+=v;addPilotXP(first?80:30);ws.conveyor.done=1;ws.conveyor.cyc=S.cycle||1;if(S.story)S.story.conveyor=1;S.anomalies.conv=1;conEvent('anom');
      setTimeout(()=>banner('ЗАДАНИЕ ВЫПОЛНЕНО','+'+v+' ЛОМА · +'+(first?80:30)+' ОПЫТА ПИЛОТА'),2700);saveWorld();}return;}
  if(A.phase==='done'){A.prog+=120*dt;if(A.pt>4){G.anom=null;G.event=null;G.cardKey=null;}}
}
function w58ConvHit(b){const A=G.anom;if(!A||A.a.kind!=='conveyor')return false;
  for(const m of A.arms){const jx=m.x,jy=A.y0+m.side*(CONV.W/2+150);if(Math.hypot(b.x-jx,b.y-jy)<22+(b.r||4)){b.life=0;m.hits+=b.charged?3:1;if(m.hits>=3){m.hits=0;m.jam=5;m.ph='idle';m.t=4;floater(jx,jy-20,'СУСТАВ ЗАКЛИНИЛ · 5 С','#ffb84d');sfx('boom');}else sfx('hit');return true;}}
  for(const P of A.press){const kx=P.x,ky=A.y0-(CONV.W/2+230);if(Math.hypot(b.x-kx,b.y-ky)<18+(b.r||4)){b.life=0;if(P.hold<=0){P.hold=6;floater(kx,ky-20,'АВАРИЙНЫЙ СТОП · 6 С','#ff4f6e');sfx('block');}return true;}}
  return false;}

// --- отрисовка: под объектами (шельфы, поля, депо) ---
function w58Draw(t){if(!W58.gen)return;const ws=w58S(),S=G.save;
  for(const s of W58.shelves){if(!inView(s.x,s.y,s.r*1.2))continue;
    const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r);g.addColorStop(0,`rgba(191,232,255,${.10*COLD_A})`);g.addColorStop(1,`rgba(191,232,255,${.04*COLD_A})`);ctx.fillStyle=g;ctx.beginPath();s.pts.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.closePath();ctx.fill();
    ctx.strokeStyle='#bfe8ff';ctx.globalAlpha=.35*COLD_A;ctx.lineWidth=1.5;ctx.stroke();
    ctx.globalAlpha=.18*COLD_A;ctx.lineWidth=1;for(const c of s.cracks){ctx.beginPath();c.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();}
    if(SET.fx)for(const b of s.blinks){const k=.5+.5*Math.sin(t*TAU/b.per+b.ph);ctx.globalAlpha=k*.6*COLD_A;ctx.fillStyle='#ffffff';ctx.fillRect(b.x-1,b.y-1,2,2);}
    ctx.globalAlpha=1;
    for(const r of s.rocks){if(ws&&ws.iceRocks.includes(r.id))continue;ctx.save();ctx.translate(r.x,r.y);ctx.rotate(r.rot);ctx.fillStyle='#1c2a3a';ctx.strokeStyle='#5b7f99';ctx.lineWidth=1.5;ctx.beginPath();for(let i=0;i<7;i++){const a=i/7*TAU,rr=r.r*(.8+.2*Math.sin(i*2.3));ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(223,246,255,.55)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,r.r+5,0,TAU);ctx.stroke();ctx.restore();}
    if(s.core)continue;}
  for(const f of W58.rust){if(!inView(f.x,f.y,f.r+40))continue;const sc=storyFlag('obod18')==='scrap';
    const g=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.r);g.addColorStop(0,`rgba(201,106,42,${sc?.04:.07})`);g.addColorStop(1,'rgba(201,106,42,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,TAU);ctx.fill();
    ctx.strokeStyle='#c96a2a';ctx.globalAlpha=.12;ctx.lineWidth=1;ctx.setLineDash([6,14]);ctx.lineDashOffset=t*8;ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;
    if(SET.fx){ctx.fillStyle='#c96a2a';ctx.globalAlpha=.25;for(const d of f.dots){const a=d.a+t*.05,rr=f.r*(.2+.75*((d.d+t*.01)%1));ctx.fillRect(f.x+Math.cos(a)*rr,f.y+Math.sin(a)*rr,1.5,1.5);}}
    ctx.globalAlpha=1;
    for(const r of f.rocks){if(S.rocksGone&&S.rocksGone.includes(r.id))continue;ctx.save();ctx.translate(r.x,r.y);ctx.rotate(r.rot+t*.1);ctx.fillStyle='#2a1a10';ctx.strokeStyle='#8a5a3a';ctx.lineWidth=1.5;ctx.beginPath();for(let i=0;i<7;i++){const a=i/7*TAU,rr=r.r*(.8+.2*Math.sin(i*2.3));ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
    if(f.box&&ws&&!ws.rustBox.includes(f.id)){ctx.save();ctx.translate(f.x,f.y);glow(0,0,40,'#ffb84d',.3);ctx.rotate(t*.3);ctx.fillStyle='#1a1206';ctx.strokeStyle='#c96a2a';ctx.lineWidth=2;ctx.fillRect(-14,-10,28,20);ctx.strokeRect(-14,-10,28,20);ctx.restore();worldLabel(f.x,f.y-30,'КОНТЕЙНЕР УТИЛИЗАЦИИ','#ffb84d');
      if(f.rep>0){ctx.strokeStyle='#ffb84d';ctx.lineWidth=3;ctx.beginPath();ctx.arc(f.x,f.y,30,-Math.PI/2,-Math.PI/2+TAU*f.rep/3);ctx.stroke();}}}
  // депо
  const D=W58.depot;if(D&&w58After(17)&&inView(D.x,D.y,CONV.L/2+360)){const A=G.anom&&G.anom.a.kind==='conveyor'?G.anom:null;const x0=D.x-CONV.L/2,y=D.y;const done=w58S().conveyor.done;
    ctx.strokeStyle='#5a3a2a';ctx.lineWidth=6;ctx.globalAlpha=done&&!A?.35:.9;ctx.beginPath();ctx.moveTo(x0,y-CONV.W/2);ctx.lineTo(x0+CONV.L,y-CONV.W/2);ctx.moveTo(x0,y+CONV.W/2);ctx.lineTo(x0+CONV.L,y+CONV.W/2);ctx.stroke();
    if(A||!done){ctx.fillStyle='#c96a2a';ctx.globalAlpha=.35;const off=(t*24)%60;for(let x=x0+off;x<x0+CONV.L;x+=60){ctx.beginPath();ctx.moveTo(x,y-10);ctx.lineTo(x+12,y);ctx.lineTo(x,y+10);ctx.lineTo(x+4,y);ctx.closePath();ctx.fill();}}
    ctx.globalAlpha=1;
    // мостки и фонари
    for(const s of [-1,1]){const yy=y+s*260;ctx.strokeStyle='#4a5566';ctx.lineWidth=2;ctx.globalAlpha=.6;ctx.beginPath();ctx.moveTo(x0,yy);ctx.lineTo(x0+CONV.L,yy);ctx.stroke();ctx.globalAlpha=1;
      for(let x=x0+100;x<x0+CONV.L;x+=200){if(!inView(x,yy,40))continue;const lit=A?x>A.prog+x0-200:!done;ctx.fillStyle=lit?'#ffd36b':'#2a2a2a';ctx.fillRect(x-3,yy-3,6,6);if(lit&&SET.fx)glow(x,yy,30,'#ffd36b',.25);}}
    // цеха
    CONV.cells.forEach(([a,b,name],i)=>{if(!inView(x0+(a+b)/2,y,(b-a)/2+260))return;ctx.fillStyle='rgba(0,0,0,'+(.08*(i+1))+')';ctx.fillRect(x0+a,y-CONV.W/2-230,b-a,CONV.W+460);ctx.strokeStyle='#ffb84d';ctx.lineWidth=2;ctx.globalAlpha=.5;ctx.setLineDash([12,8]);ctx.beginPath();ctx.moveTo(x0+a,y-CONV.W/2-230);ctx.lineTo(x0+a,y+CONV.W/2+230);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;worldLabel(x0+a+(b-a)/2,y-CONV.W/2-240,name,'#ffb84d');});
    // шлюз
    {const gx=x0+2300,open=A?A.gate:done?1:0;ctx.fillStyle='#1a2230';ctx.strokeStyle='#7affc9';ctx.lineWidth=2;for(const s of [-1,1]){const h=(CONV.W/2+60)*(1-open);ctx.fillRect(gx-20,s>0?y:y-h-(s<0?0:0),40,0);ctx.beginPath();ctx.rect(gx-20,s<0?y-CONV.W/2-60:y+CONV.W/2+60-h,40,h);ctx.fill();ctx.stroke();}
      ctx.strokeStyle='#7affc9';ctx.globalAlpha=A&&A.phase==='gate'?.9:.3;ctx.lineWidth=2;ctx.beginPath();ctx.arc(gx,y+220,80,0,TAU);ctx.stroke();if(A&&A.phase==='gate'){ctx.lineWidth=4;ctx.beginPath();ctx.arc(gx,y+220,80,-Math.PI/2,-Math.PI/2+TAU*A.gate);ctx.stroke();worldLabel(gx,y+320,'КОЛЬЦО ЗАРЯДКИ · '+Math.round(A.gate*100)+'%','#7affc9');}ctx.globalAlpha=1;}
    if(!A){worldLabel(D.x,y-CONV.W/2-300,done?'ДЕПО · ЛИНИЯ ОСТАНОВЛЕНА':'ДЕПО · ЛИНИЯ УТИЛИЗАЦИИ','#ffb84d');}
    else{// баржа, руки, прессы
      const bx=A.bx||x0,by=y;ctx.save();ctx.translate(bx,by);glow(0,0,70,'#7affc9',.3);ctx.fillStyle='#0f2a22';ctx.strokeStyle='#7affc9';ctx.lineWidth=2.5;ctx.fillRect(-55,-23,110,46);ctx.strokeRect(-55,-23,110,46);
        for(let i=-1;i<=1;i++){ctx.fillStyle=`rgba(255,255,255,${.5+.4*Math.sin(t*2+i)})`;ctx.beginPath();ctx.arc(i*30,0,8,0,TAU);ctx.fill();}
        if(A.bhp<400){ctx.fillStyle='#000';ctx.globalAlpha=.5;for(let i=0;i<3;i++)ctx.fillRect(-40+i*30,-15+(i%2)*20,14,8);ctx.globalAlpha=1;if(SET.fx&&Math.random()<.3)part(bx+rnd(-50,50),by+rnd(-20,20),rnd(-40,40),rnd(-60,-10),.4,'#ffb84d',2);}
        ctx.restore();worldLabel(bx,by-40,'«КОЛЫБЕЛЬНАЯ» · '+Math.max(0,Math.ceil(A.bhp)),'#7affc9');
      if(A.cell>=1)for(const m of A.arms){const jx=m.x,jy=y+m.side*(CONV.W/2+150),base={x:m.x,y:y+m.side*260};ctx.strokeStyle=m.jam>0?'#7a8ea5':'#8a9bb0';ctx.lineWidth=8;ctx.lineCap='round';
          const sw=m.ph==='sweep'?1:m.ph==='tele'?.3:0;const ex=m.x+(m.side*-1)*0,ey=y+m.side*(CONV.W/2+150-sw*150);ctx.beginPath();ctx.moveTo(base.x,base.y);ctx.lineTo(jx,jy);ctx.lineTo(ex+sw*0,ey);ctx.stroke();ctx.lineCap='butt';
          ctx.fillStyle=m.jam>0?'#ffb84d':'#c96a2a';ctx.beginPath();ctx.arc(jx,jy,m.jam>0?12:10,0,TAU);ctx.fill();if(m.jam>0&&SET.fx&&Math.random()<.4)part(jx,jy,rnd(-80,80),rnd(-80,80),.2,'#ffd36b',2);
          if(m.ph==='tele'){ctx.fillStyle='rgba(255,79,110,.25)';ctx.fillRect(m.x-140,y-CONV.W/2,280,CONV.W);}if(m.ph==='sweep'){ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(m.x-140,y-CONV.W/2,280,CONV.W);}}
      if(A.cell>=2)for(const P of A.press){const kx=P.x,ky=y-(CONV.W/2+230);const down=P.ph==='down'?1:0;ctx.fillStyle='#1a1a1a';ctx.strokeStyle='#ffd36b';ctx.lineWidth=2;const ph=120+down*(CONV.W+100);ctx.fillRect(P.x-110,y-CONV.W/2-230,220,ph);ctx.strokeRect(P.x-110,y-CONV.W/2-230,220,ph);
          ctx.fillStyle='#000';for(let i=0;i<5;i++)ctx.fillRect(P.x-110+i*44+(i%2)*22,y-CONV.W/2-230,22,ph);
          if(P.ph==='warn'){ctx.fillStyle='rgba(255,40,70,.3)';ctx.fillRect(P.x-110,y-CONV.W/2,220,CONV.W);}
          ctx.fillStyle=P.hold>0?'#3a1a1a':'#ff4f6e';ctx.beginPath();ctx.arc(kx,ky,16,0,TAU);ctx.fill();ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.stroke();worldLabel(kx,ky-26,P.hold>0?'СТОП · '+Math.ceil(P.hold)+' С':'АВАРИЙНЫЙ СТОП','#ff4f6e');}
      ctx.strokeStyle='#ffb84d';ctx.globalAlpha=.15;ctx.setLineDash([4,10]);ctx.strokeRect(x0-400,y-700,CONV.L+900,1400);ctx.setLineDash([]);ctx.globalAlpha=1;}}
  // раскопки
  if(G.w&&G.w.digs){const q=sbWreckPos(14);for(const c of G.w.digs){if(!c||!c.alive)continue;worldLabel(c.x,c.y-24,c.digL,(G.save.story.invDig||0)===c.dig?'#dff6ff':'#5b7f99');}}
}
// --- отрисовка: над врагами (маяки, записи, буксир, засада, бури) ---
function w58DrawTop(t){if(!W58.gen||!G.w)return;const ws=w58S(),p=G.player,w=G.w,S=G.save;
  // след на льду
  if(w.trail)for(const q of w.trail){ctx.strokeStyle='#ffffff';ctx.globalAlpha=q.t/2*.35*COLD_A;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(q.x1,q.y1);ctx.lineTo(q.x1+1,q.y1+1);ctx.moveTo(q.x2,q.y2);ctx.lineTo(q.x2+1,q.y2+1);ctx.stroke();}ctx.globalAlpha=1;
  // записи
  if(w58SecOpen())for(const r of W58.recs){if(ws.arcRec.includes(r.id))continue;if(r.core&&!(G.anom&&G.anom.a.kind==='coldcore'&&G.anom.t>=20&&G.anom.t<30))continue;const q=w58RecPos(r);if(!inView(q.x,q.y,60))continue;
    glow(q.x,q.y,40,'#bfe8ff',.4);ctx.save();ctx.translate(q.x,q.y);ctx.fillStyle='#0b1628';ctx.strokeStyle=r.frozen?'#5b7f99':'#bfe8ff';ctx.lineWidth=2;poly(6,11,t*.4);ctx.fill();ctx.stroke();ctx.restore();
    ctx.font='700 9px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillStyle='#dff6ff';ctx.globalAlpha=.6+.4*Math.sin(t*3);ctx.fillText(r.cyc,q.x,q.y+3);ctx.globalAlpha=1;
    const k=(t/4)%1;if(k<.5){ctx.strokeStyle='#bfe8ff';ctx.globalAlpha=(1-k*2)*.4;ctx.lineWidth=1;ctx.beginPath();ctx.arc(q.x,q.y,12+k*60,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
    worldLabel(q.x,q.y-22,r.frozen?'ЗАПИСЬ · ВМОРОЖЕНА':'ЗАПИСЬ АРХИВА','#bfe8ff');}
  // маяки
  if(w58After(11))for(const b of W58.beacons){const dead=ws.arcBeacons.includes(b.id);if(!inView(b.x,b.y,120))continue;
    ctx.save();ctx.translate(b.x,b.y);if(dead){ctx.strokeStyle='#3a4558';ctx.lineWidth=2;poly(3,26,-Math.PI/2);ctx.stroke();ctx.restore();worldLabel(b.x,b.y-44,'МАЯК АРХИВА · РАЗБИТ','#3a4558');continue;}
    const F=b.F;glow(0,0,70,'#9fd8ff',.3);ctx.fillStyle='#0b1628';ctx.strokeStyle=F&&F.flash>0?'#ffffff':'#9fd8ff';ctx.lineWidth=2.5;poly(3,30,-Math.PI/2);ctx.fill();ctx.stroke();ctx.rotate(t*1.2);ctx.strokeStyle='#dff6ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,16,-.6,.6);ctx.stroke();ctx.rotate(-t*1.2);
    for(let i=0;i<3;i++){const a=i/3*TAU-Math.PI/2;ctx.fillStyle=Math.sin(t*4+i)>0?'#9fd8ff':'#1c3a55';ctx.beginPath();ctx.arc(Math.cos(a)*22,Math.sin(a)*22,3,0,TAU);ctx.fill();}
    if(F&&F.shield){ctx.strokeStyle='#bfe8ff';ctx.globalAlpha=.5+.2*Math.sin(t*5);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,42,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
    if(F&&F.flash>0)F.flash-=VDT74;/* ARCH·75 A-22 */ctx.restore();
    if(F&&F.shield)for(const g of F.guards){if(!g.alive)continue;ctx.strokeStyle='#bfe8ff';ctx.globalAlpha=.3;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(g.x,g.y);ctx.stroke();ctx.globalAlpha=1;}
    if(F&&F.ring){ctx.strokeStyle='#9fd8ff';ctx.globalAlpha=.5*(1-F.ring.r/900);ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,F.ring.r,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
    if(F&&F.active){ctx.strokeStyle='#9fd8ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(b.x,b.y,36,-Math.PI/2,-Math.PI/2+TAU*F.hp/900);ctx.stroke();}
    worldLabel(b.x,b.y-50,F&&F.shield?'МАЯК АРХИВА · КУПОЛ':'МАЯК АРХИВА','#9fd8ff');}
  // блуждатель: кольцо карточек и подпись
  if(w.wander&&w.wander.alive){const e=w.wander;if(inView(e.x,e.y,80)){ctx.save();ctx.translate(e.x,e.y);ctx.rotate(t*.6);for(let i=0;i<6;i++){ctx.rotate(TAU/6);ctx.fillStyle='rgba(191,232,255,.6)';ctx.fillRect(34,-4,10,8);}ctx.restore();worldLabel(e.x,e.y-e.r-26,'СТРАНСТВУЮЩИЙ АРХИВАТОР','#9fd8ff');
      if(e.st==='rec'){ctx.font='700 11px "JetBrains Mono",monospace';ctx.fillStyle='#8fd8ff';ctx.textAlign='center';ctx.fillText('ЗАПИСЬ '+Math.round((1-e.timer/(w58BeaconDead()?5:3.5))*100)+'%',e.x,e.y+e.r+22);}}}
  // буксир
  const T=w.tug;if(T&&T.alive){const a=Math.atan2(T.vy,T.vx);
    if(T.st!=='rob'){for(let i=0;i<T.contR;i++){const cx=T.x-Math.cos(a)*(60+i*34),cy=T.y-Math.sin(a)*(60+i*34);ctx.strokeStyle='#7affc9';ctx.lineWidth=1;ctx.globalAlpha=.6;ctx.beginPath();ctx.moveTo(i?T.x-Math.cos(a)*(60+(i-1)*34):T.x,i?T.y-Math.sin(a)*(60+(i-1)*34):T.y);ctx.lineTo(cx,cy);ctx.stroke();ctx.globalAlpha=1;
        ctx.save();ctx.translate(cx,cy);ctx.rotate(a);ctx.fillStyle='#0f2a22';ctx.strokeStyle='#7affc9';ctx.lineWidth=1.5;ctx.fillRect(-13,-9,26,18);ctx.strokeRect(-13,-9,26,18);ctx.restore();}}
    else for(const c of T.cont){if(c.hp<=0)continue;ctx.save();ctx.translate(c.x,c.y);ctx.rotate(t);ctx.fillStyle='#0f2a22';ctx.strokeStyle='#7affc9';ctx.lineWidth=1.5;ctx.fillRect(-13,-9,26,18);ctx.strokeRect(-13,-9,26,18);ctx.restore();}
    ctx.save();ctx.translate(T.x,T.y);ctx.rotate(a);glow(0,0,50,'#7affc9',.25);ctx.fillStyle='#0f2a22';ctx.strokeStyle=T.flash>0?'#ffffff':'#7affc9';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(30,0);ctx.lineTo(10,-12);ctx.lineTo(-30,-12);ctx.lineTo(-30,12);ctx.lineTo(10,12);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle=Math.sin(t*TAU)>0?'#ffffff':'#7affc9';ctx.fillRect(-28,-14,3,3);ctx.fillRect(-28,11,3,3);ctx.restore();
    worldLabel(T.x,T.y-34,T.name+(T.st==='escort'?' · '+Math.ceil(T.hp):T.st==='rob'?' · УХОДИТ':''),'#7affc9');
    if(T.st==='escort'){ctx.fillStyle='#1a2230';ctx.fillRect(T.x-30,T.y-26,60,4);ctx.fillStyle='#7affc9';ctx.fillRect(T.x-30,T.y-26,60*clamp(T.hp/T.maxHp,0,1),4);}}
  // подкрепление патрулей (метки)
  for(const q of G.warns){if(!q.zone)continue;ctx.strokeStyle=EDEF[q.type].col;ctx.globalAlpha=.4+.6*Math.abs(Math.sin(q.t*18));ctx.lineWidth=2;ctx.beginPath();ctx.arc(q.x,q.y,14,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
  // вожак
  for(const e of G.enemies){if(!e.alive||!e.leader||e.spawnT>0)continue;ctx.save();ctx.translate(e.x,e.y-e.r-10);ctx.fillStyle='#ffb84d';ctx.beginPath();ctx.moveTo(-8,4);ctx.lineTo(-8,-4);ctx.lineTo(-3,0);ctx.lineTo(0,-6);ctx.lineTo(3,0);ctx.lineTo(8,-4);ctx.lineTo(8,4);ctx.closePath();ctx.fill();ctx.restore();worldLabel(e.x,e.y-e.r-18,'ВОЖАК','#ffb84d');}
  for(const e of G.enemies){if(!e.alive||!e.peace||e.spawnT>0)continue;ctx.strokeStyle='#7affc9';ctx.globalAlpha=.5;ctx.lineWidth=1;ctx.beginPath();ctx.arc(e.x,e.y,e.r+6,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
  if(G.enemies.some(e=>e.alive&&e.peace&&Math.hypot(e.x-p.x,e.y-p.y)<600)&&p.hp>0)worldLabel(p.x,p.y+34,'КЛИЕНТЫ СОПРОВОЖДАЮТ','#7affc9');
  // холодное ядро
  const a4=WORLD.anomalies.find(q=>q.id==='a4');if(a4&&inView(a4.x,a4.y,480)&&!S.anomalies.a4){const act=G.anom&&G.anom.a===a4;const g=ctx.createRadialGradient(a4.x,a4.y,0,a4.x,a4.y,420);g.addColorStop(0,'rgba(230,246,255,.12)');g.addColorStop(1,'rgba(191,232,255,.02)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(a4.x,a4.y,420,0,TAU);ctx.fill();
    for(let i=1;i<=3;i++){ctx.strokeStyle='#dff6ff';ctx.globalAlpha=.12;ctx.lineWidth=1;ctx.setLineDash([20,30]);ctx.lineDashOffset=t*(10*i)*(i%2?1:-1);ctx.beginPath();ctx.arc(a4.x,a4.y,140*i,0,TAU);ctx.stroke();}ctx.setLineDash([]);ctx.lineDashOffset=0;ctx.globalAlpha=1;
    ctx.save();ctx.translate(a4.x,a4.y);glow(0,0,60,'#ffffff',.4+.2*Math.sin(t*2));ctx.rotate(t*.3);ctx.fillStyle='#dff6ff';ctx.strokeStyle='#ffffff';ctx.lineWidth=2;poly(6,18+Math.sin(t*2)*3,0);ctx.fill();ctx.stroke();ctx.restore();
    if(act){const A=G.anom;if(A.shard){glow(A.shard.x,A.shard.y,30,'#ffb84d',.7);ctx.fillStyle='#ffd36b';ctx.beginPath();ctx.arc(A.shard.x,A.shard.y,10,0,TAU);ctx.fill();worldLabel(A.shard.x,A.shard.y-20,'ТЕПЛО','#ffb84d');}
      ctx.strokeStyle='#ff4f6e';ctx.globalAlpha=.25;ctx.setLineDash([8,12]);ctx.beginPath();ctx.arc(a4.x,a4.y,900,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
      for(const e of G.enemies){if(e.alive&&e.tK===.5){ctx.strokeStyle=EDEF[e.type].col;ctx.globalAlpha=.3;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x-e.vx*.15,e.y-e.vy*.15);ctx.stroke();ctx.globalAlpha=1;}}}}
  // бури (мировые): стена/дымка
  for(const k in w.storms){const s=w.storms[k];if(!s||s.ph==='wait'||s.k<=0||!inView(s.x,s.y,800))continue;const snow=s.kind==='snow';
    ctx.save();ctx.translate(s.x,s.y);ctx.scale(1,400/700);const g=ctx.createRadialGradient(0,0,100,0,0,700);g.addColorStop(0,snow?`rgba(230,240,255,${.18*s.k})`:`rgba(201,106,42,${.14*s.k})`);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,700,0,TAU);ctx.fill();
    if(SET.fx){ctx.strokeStyle=snow?'rgba(255,255,255,.25)':'rgba(120,60,20,.35)';ctx.lineWidth=snow?8:2;for(let i=0;i<10;i++){const a=t*.3+i*.63,r=200+((i*97+t*40)%400);const x=Math.cos(a)*r,y=Math.sin(a)*r;ctx.globalAlpha=s.k*.5;ctx.beginPath();if(snow){ctx.arc(x,y,40,0,TAU);}else{ctx.moveTo(x,y);ctx.lineTo(x-20,y+60);}ctx.stroke();}}
    ctx.restore();ctx.globalAlpha=1;
    if(s.box&&!s.box.got&&(s.ph==='move'||s.ph==='fade')){glow(s.x,s.y,30,'#ffb84d',.5);ctx.save();ctx.translate(s.x,s.y);ctx.rotate(t);ctx.fillStyle='#1a1206';ctx.strokeStyle='#ffb84d';ctx.lineWidth=2;ctx.fillRect(-12,-9,24,18);ctx.strokeRect(-12,-9,24,18);ctx.restore();worldLabel(s.x,s.y-24,snow?'ЗАМЁРЗШИЙ ГРУЗ':'СМЫТЫЙ КОНТЕЙНЕР','#ffb84d');}}
  secDraw(t);
}
// --- экранные эффекты (после мира, до стрелок) ---
function w58Screen(t){if(!G.w||!G.player)return;const w=G.w,p=G.player,S=G.save;const CW_=cv.width,CH_=cv.height;ctx.setTransform(1,0,0,1,0,0);
  const snow=w58InStorm(p.x,p.y);const inSnow=snow&&snow.kind==='snow'?snow.k:0,inRain=snow&&snow.kind==='rain'?snow.k:0;
  // маска видимости в снегу
  if(inSnow>0){const px=(p.x-CX)*SC*DPR,py=(p.y-CY)*SC*DPR;const R=420*SC*DPR;const g=ctx.createRadialGradient(px,py,R*.8,px,py,R*1.6);g.addColorStop(0,'rgba(220,235,250,0)');g.addColorStop(1,`rgba(220,235,250,${.85*inSnow*COLD_A})`);ctx.fillStyle=g;ctx.fillRect(0,0,CW_,CH_);}
  // иней-виньетка
  const ch=w.chill;if(ch>0){const g=ctx.createRadialGradient(CW_/2,CH_/2,Math.min(CW_,CH_)*.4,CW_/2,CH_/2,Math.max(CW_,CH_)*.72);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(200,230,255,${.22*ch*COLD_A*(isMob()?.67:1)})`);ctx.fillStyle=g;ctx.fillRect(0,0,CW_,CH_);}
  if(w.inRust||inRain>0){const g=ctx.createRadialGradient(CW_/2,CH_/2,Math.min(CW_,CH_)*.45,CW_/2,CH_/2,Math.max(CW_,CH_)*.72);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(138,58,18,${(w.inRust?.10:.08*inRain)*(isMob()?.67:1)})`);ctx.fillStyle=g;ctx.fillRect(0,0,CW_,CH_);}
  // снежинки / снег / дождь — экранные пулы
  if(SET.fx){const mob=CW<520;
    if(ch>.05||inSnow>0){const n=Math.round((inSnow>0?80:12)*(mob?.5:1)*Math.max(ch,inSnow));if(w.snow.length<n)for(let i=w.snow.length;i<n;i++)w.snow.push({x:Math.random(),y:Math.random(),s:Math.random()});w.snow.length=Math.min(w.snow.length,n);
      ctx.strokeStyle='#ffffff';ctx.lineWidth=1.5*DPR;for(const f of w.snow){f.x=(f.x+(inSnow>0?.25:.02)*(VDT74)+.0003)%1;f.y=(f.y+(.04+f.s*.06)*(VDT74))%1;/* ARCH·75 A-22 */ctx.globalAlpha=(.3+.4*f.s)*(inSnow>0?1:COLD_A);const x=f.x*CW_,y=f.y*CH_;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(inSnow>0?14:2)*DPR,y+3*DPR);ctx.stroke();}ctx.globalAlpha=1;}
    else w.snow.length=0;
    if(inRain>0){const n=Math.round(70*(mob?.5:1)*inRain);if(w.rain.length<n)for(let i=w.rain.length;i<n;i++)w.rain.push({x:Math.random(),y:Math.random(),s:Math.random()});w.rain.length=Math.min(w.rain.length,n);
      ctx.strokeStyle='#c96a2a';ctx.lineWidth=1*DPR;for(const f of w.rain){f.x=(f.x-.1*(VDT74))%1;if(f.x<0)f.x+=1;f.y=(f.y+(.6+f.s*.3)*(VDT74))%1;/* ARCH·75 A-22 */ctx.globalAlpha=.25+.3*f.s;const x=f.x*CW_,y=f.y*CH_;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-6*DPR,y+22*DPR);ctx.stroke();}ctx.globalAlpha=1;}
    else w.rain.length=0;}
  // иней на корпусе
  if(w.iced&&p.hp>0){const px=(p.x-CX)*SC*DPR,py=(p.y-CY)*SC*DPR;ctx.strokeStyle='rgba(223,246,255,.7)';ctx.lineWidth=1.5*DPR;for(let i=0;i<3;i++){const a=t*1.2+i*TAU/3,x=px+Math.cos(a)*20*SC*DPR,y=py+Math.sin(a)*20*SC*DPR;ctx.beginPath();for(let k=0;k<3;k++){const b=k/3*TAU+a;ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(b)*5*DPR,y+Math.sin(b)*5*DPR);}ctx.stroke();}}
  ctx.setTransform(DPR*SC,0,0,DPR*SC,0,0);
}
// --- карта ---
function w58MapBlobs(g,X,Y,k,vis){if(!W58.gen)return;const ws=w58S();const S=G.save;
  for(const s of W58.shelves){if(!revealedAt(s.x,s.y)||!vis(s.x,s.y,s.r*k))continue;g.fillStyle='rgba(191,232,255,.14)';g.beginPath();s.pts.forEach((q,i)=>i?g.lineTo(X(q.x),Y(q.y)):g.moveTo(X(q.x),Y(q.y)));g.closePath();g.fill();}
  for(const f of W58.rust){if(!revealedAt(f.x,f.y)||!vis(f.x,f.y,f.r*k))continue;g.fillStyle='rgba(201,106,42,.15)';g.beginPath();g.arc(X(f.x),Y(f.y),f.r*k,0,TAU);g.fill();}
  if(G.w)for(const kk in G.w.storms){const s=G.w.storms[kk];if(!s||s.ph==='wait'||s.k<=0)continue;const snow=s.kind==='snow';g.save();g.translate(X(s.x),Y(s.y));g.scale(1,400/700);const gr=g.createRadialGradient(0,0,0,0,0,700*k);gr.addColorStop(0,snow?`rgba(255,255,255,${.35*s.k})`:`rgba(201,106,42,${.35*s.k})`);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(0,0,700*k,0,TAU);g.fill();g.restore();
    g.strokeStyle=snow?'#ffffff':'#c96a2a';g.globalAlpha=.6;g.lineWidth=1.5;const ex=X(s.x)+Math.cos(s.dir)*14,ey=Y(s.y)+Math.sin(s.dir)*14;g.beginPath();g.moveTo(X(s.x),Y(s.y));g.lineTo(ex,ey);g.stroke();g.globalAlpha=1;}
}
function w58MapAdd(add,lod,S){if(!W58.gen)return;const ws=w58S(),w=G.w;
  if(w58SecOpen())for(const r of W58.recs){if(ws.arcRec.includes(r.id)||!r.seen||r.core)continue;const q=w58RecPos(r);add('arcrec',q.x,q.y,{},lod===2?{t:'ЗАПИСЬ АРХИВА',p:6,c:'#bfe8ff'}:null);}
  if(w58After(11))for(const b of W58.beacons){if(!revealedAt(b.x,b.y))continue;add('arcbeacon',b.x,b.y,{dead:ws.arcBeacons.includes(b.id)},lod>=1?{t:'МАЯК АРХИВА',p:5,c:ws.arcBeacons.includes(b.id)?'#3a4558':'#9fd8ff'}:null);}
  for(const f of W58.rust){if(f.box&&!ws.rustBox.includes(f.id)&&revealedAt(f.x,f.y))add('rustbox',f.x,f.y,{},lod===2?{t:'КОНТЕЙНЕР',p:7,c:'#ffb84d'}:null);}
  if(W58.depot&&w58After(17)&&revealedAt(W58.depot.x,W58.depot.y))add('depot',W58.depot.x,W58.depot.y,{done:!!ws.conveyor.done},lod>=1?{t:'ДЕПО · КОНВЕЙЕР',p:3,c:'#ffb84d'}:null);
  if(ws.wander.seen&&!(w&&w.wander&&w.wander.alive&&false))add('eye',ws.wander.seen.x,ws.wander.seen.y,{},lod===2?{t:'АРХИВАТОР · ПОСЛЕДНИЙ РАЗ',p:7,c:'#9fd8ff'}:null);
  if(w&&w.tug&&w.tug.alive)add('tug',w.tug.x,w.tug.y,{},{t:w.tug.name,p:2,c:'#7affc9'});
}
function w58MapIcon(g,kind,o,t){switch(kind){
    case 'arcrec':g.strokeStyle='#bfe8ff';g.beginPath();for(let i=0;i<6;i++){const a=i/6*TAU;g.lineTo(Math.cos(a)*5,Math.sin(a)*5);}g.closePath();g.stroke();return true;
    case 'arcbeacon':g.strokeStyle=o.dead?'#3a4558':'#9fd8ff';g.beginPath();g.moveTo(0,-7);g.lineTo(6,5);g.lineTo(-6,5);g.closePath();g.stroke();if(o.dead){g.beginPath();g.moveTo(-6,-6);g.lineTo(6,6);g.stroke();}return true;
    case 'rustbox':g.strokeStyle='#ffb84d';g.strokeRect(-5,-4,10,8);return true;
    case 'depot':g.strokeStyle=o.done?'#5a4a3a':'#ffb84d';g.strokeRect(-8,-4,16,8);g.beginPath();g.moveTo(-8,0);g.lineTo(8,0);g.stroke();return true;
    case 'eye':g.strokeStyle='#9fd8ff';g.beginPath();g.ellipse(0,0,7,4,0,0,TAU);g.stroke();g.fillStyle='#9fd8ff';g.beginPath();g.arc(0,0,2,0,TAU);g.fill();return true;
    case 'tug':g.fillStyle='#7affc9';g.beginPath();g.arc(0,0,4,0,TAU);g.fill();g.strokeStyle='#7affc9';g.setLineDash([2,2]);g.beginPath();g.moveTo(0,0);g.lineTo(-12,0);g.stroke();g.setLineDash([]);return true;}
  return false;}
// --- карточки POI ---
function w58POI(card){const S=G.save,p=G.player,ws=w58S();
  const D=W58.depot;if(D&&w58After(17)&&!ws.conveyor.done&&!G.anom&&!(G.anomCd&&G.anomCd.conv>G.t)&&Math.hypot(p.x-D.x,p.y-D.y)<260)return {kind:'conv',key:'conv'};
  // контейнеры в ржавых полях
  for(const f of W58.rust){if(!f.box||ws.rustBox.includes(f.id))continue;const d=Math.hypot(p.x-f.x,p.y-f.y);if(d<70){f.rep=(f.rep||0)+arch70Dt();/* ARCH·70 A-9 */G.w.boxing=true;if(f.rep>=3){ws.rustBox.push(f.id);f.rep=0;S.lom+=40;conEvent('rustBox');banner('КОНТЕЙНЕР ВСКРЫТ','+40 ЛОМА НА СКЛАД');sfx('level');saveWorld();}}else{f.rep=Math.max(0,(f.rep||0)-arch70Dt());/* ARCH·70 A-9 */}}
  G.w.boxing=W58.rust.some(f=>f.rep>0);
  // гражданский тайник
  const c=WORLD.caches.find(q=>q.civ);if(c&&!S.found[c.id]&&Math.hypot(p.x-c.x,p.y-c.y)<75){S.found[c.id]=1;S.lom+=120;addPilotXP(20);banner('ТАЙНИК ГРАЖДАНСКИХ','+120 ЛОМА НА СКЛАД · +20 ОПЫТА');sfx('level');explode(c.x,c.y,'#7affc9',30,1);saveWorld();}
  return card;}
function w58Card(card){if(card.kind!=='conv')return '';const first=!w58S().conveyor.done;return `<div class="eyebrow">ДЕПО · ЛИНИЯ УТИЛИЗАЦИИ</div><h3>Спецзадание «Конвейер»</h3><p>Гражданская баржа «Колыбельная» с тремя криокапсулами идёт по ленте утилизации «Обода» через приёмку, сортировку и пресс. Лента не останавливается — расчищайте путь и выведите баржу через аварийный шлюз.</p><p class="note">Награда: ${first?'240':'80'} лома на склад, +${first?'80':'30'} опыта пилота, бонус за целую баржу.</p><div class="wc-row"><button class="wbtn amber" data-act="conv">НАЧАТЬ [F]</button></div>`;}
// --- скины ---
Object.assign(SKINS,{
  archive:{name:'Архивный',col:'#9fd8ff',bul:'#dff6ff',trail:'#bfe8ff',d:'Корпус из картотеки. На борту — инвентарный номер, который никто не выдавал.',unlock:0,find:'СЕКТОР III · ОБЛОМОК'},
  rime:{name:'Наст',col:'#e6f6ff',bul:'#ffffff',trail:'#dff6ff',d:'Тонкий лёд на каркасе. Держится, пока ты движешься.',unlock:0,find:'СЕКТОР III · ХОЛОДНОЕ ЯДРО'}});
HULL_NUM.archive='013';HULL_NUM.rime='014';
function w58DrawSkin(id,t,sp,o,A,fl,edge){
  if(id==='archive'){for(const s of [-1,1]){const x=-14,y=s*6;ctx.fillStyle='#9fd8ff';ctx.globalAlpha=A*.5;for(let i=0;i<3;i++)ctx.fillRect(x-8-i*5-fl*.2,y-1.5,3,3);}ctx.globalAlpha=A;
    ctx.fillStyle='#0b1628';ctx.strokeStyle=edge;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(18,-8);ctx.lineTo(18,8);ctx.lineTo(-16,8);ctx.lineTo(-16,-8);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(191,232,255,.6)';ctx.lineWidth=1;for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(i*4,-6);ctx.lineTo(i*4,-3);ctx.moveTo(i*4,3);ctx.lineTo(i*4,6);ctx.stroke();}
    ctx.strokeStyle=edge;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-6,-8);ctx.lineTo(-10,-16);ctx.lineTo(2,-16);ctx.moveTo(-6,8);ctx.lineTo(-10,16);ctx.lineTo(2,16);ctx.stroke();
    ctx.fillStyle='#dff6ff';ctx.font='700 5px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillText('013',2,2);return true;}
  if(id==='rime'){glow(-12,0,fl,'#dff6ff',.5);ctx.fillStyle='rgba(230,246,255,.35)';ctx.strokeStyle=edge;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(20,0);ctx.lineTo(-10,-7);ctx.lineTo(-6,0);ctx.lineTo(-10,7);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='#9fd8ff';ctx.lineWidth=1;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(-2,s*4);ctx.lineTo(-14,s*18);ctx.moveTo(-6,s*5);ctx.lineTo(-18,s*12);ctx.moveTo(2,s*3);ctx.lineTo(-8,s*20);ctx.stroke();}
    if(SET.fx&&sp>60&&Math.random()<.4)part(-14+rnd(-4,4),rnd(-6,6),rnd(-30,0),rnd(-20,20),.5,'#ffffff',1.5);
    ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(6,0,2,0,TAU);ctx.fill();return true;}
  return false;}
// --- панель разработчика мира ---
function w58Dev(k){const w=G.w,p=G.player;if(!w)return;
  if(k==='storm'){const sec=inSectors(p.x,p.y)?sectorIdx(p.x,p.y):2;const s=w.storms[sec]||(w.storms[sec]={sec,kind:sec===2?'snow':'rain',ph:'wait',t:0,k:0,x:0,y:0});s.ph='born';s.t=20;s.k=0;s.x=p.x+600;s.y=p.y;s.dir=Math.PI;s.box=null;w58S()['storm'+sec]=1;}
  if(k==='tug'){w.tug=null;w.tugT=0;w.forceTug=1;w58S().tugs.last=-1e9;}
  if(k==='wander'){if(w.wander)w.wander.alive=false;w.wander=null;w.wanderT=0;}
  if(k==='pack'){w.packs.push({x:p.x+500,y:p.y,st:'roam',t:30,ships:[],dead:0,hostile:storyFlag('obod18')!=='service',hostT:0,uid:++G.uid});}
  if(k==='reset'){G.save.w58=null;w58S();W58.recs.forEach(r=>{r.frozen=r.id===4;r.drift=r.id<4;});}
}


