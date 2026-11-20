// ===== 0.9: мир IX–X, награды, модули, справочник, хроника =====
Object.assign(SKINS,{
  ark90:{name:'Ковчег',col:'#ffd36b',bul:'#ffe9b0',trail:'#d8364a',d:'',unlock:0,find:'СЕКТОР IX · МАСТЕРСТВО «СЕРДЦЕ»'},
  dawn90:{name:'Рассвет Ковчега',col:'#ffe9b0',bul:'#ffffff',trail:'#ffd36b',d:'',unlock:0,find:'СЕКТОР IX · ???'},
  typo100:{name:'Опечатка',col:'#b8ffe0',bul:'#e0fff4',trail:'#7affc9',d:'',unlock:0,find:'СЕКТОР X · 30 ОПЕЧАТОК'},
  tidemark100:{name:'Линия прилива',col:'#7affc9',bul:'#d8fff0',trail:'#3a8a70',d:'',unlock:0,find:'СЕКТОР X · МАСТЕРСТВО «БЕРЕГ»'},
  shore100s:{name:'Пустой берег',col:'#f4fff9',bul:'#ffffff',trail:'#cfe8e0',d:'',unlock:0,find:'СЕКТОР X · ???'}});
Object.assign(STORY_HULL,{ark90:'Обшивка цвета сердечной камеры. Внутри корпуса — тихий ритм: пятьдесят ударов в минуту.',dawn90:'Иллюминаторы по всему борту. В каждом кто-то смотрит наружу — впервые за все циклы.',
  typo100:'Корпус собран из трёх чужих. Швы видно, но летает он лучше любого из них.',tidemark100:'Бледная полоса по борту — там, где прилив так и не дотянулся.',shore100s:'Белый корпус без единой надписи. Всё, что на нём было, теперь записано где-то ещё.'});
for(const k of ['ark90','dawn90','typo100','tidemark100','shore100s'])SKINS[k].d=STORY_HULL[k];
Object.assign(HULL_NUM,{ark90:'050',dawn90:'∞',typo100:'0?3',tidemark100:'46',shore100s:'∅'});
{const ALT={dawn90:['heart42','wake'],shore100s:['shore46','record']};for(const k in ALT){const [f,v]=ALT[k],base=SKINS[k].find;Object.defineProperty(SKINS[k],'find',{get(){const c=storyFlag(f);return c&&c!==v?'ДРУГОЙ ВЫБОР':base;},configurable:true,enumerable:true});}}
function w90DrawSkin(id,t,sp,o,A,fl,edge){const hull=(fill,st,lw)=>{ctx.fillStyle=fill;ctx.strokeStyle=st;ctx.lineWidth=lw||2;ctx.beginPath();ctx.moveTo(19,0);ctx.lineTo(-11,-12);ctx.lineTo(-5,0);ctx.lineTo(-11,12);ctx.closePath();ctx.fill();ctx.stroke();};
  if(id==='ark90'){const k=beat90(t);glow(-12,0,fl,'#d8364a',.5+.3*k);hull('#2a060c',edge,2.2);ctx.fillStyle='#ffd36b';ctx.globalAlpha=A*(.5+.5*k);ctx.beginPath();ctx.arc(2,0,3+1.5*k,0,TAU);ctx.fill();ctx.globalAlpha=A;return true;}
  if(id==='dawn90'){glow(-12,0,fl,'#ffd36b',.6);hull('#3a2a14',edge,2);ctx.fillStyle='#fff6d8';for(let i=0;i<4;i++){ctx.globalAlpha=A*(.5+.5*Math.sin(t*2+i));ctx.fillRect(-6+i*5,-1.5,2.5,3);}ctx.globalAlpha=A;return true;}
  if(id==='typo100'){glow(-12,0,fl,'#7affc9',.5);const g=Math.sin(t*19)>.9?2:0;ctx.save();ctx.translate(g,0);hull('#0e1c18',edge,2);ctx.restore();ctx.strokeStyle='#ffffff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-4,-7);ctx.lineTo(4,4);ctx.moveTo(-8,5);ctx.lineTo(8,-2);ctx.stroke();return true;}
  if(id==='tidemark100'){glow(-12,0,fl,'#7affc9',.55);hull('#0a1412',edge,2);ctx.strokeStyle='#d8fff0';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-9,-6);ctx.quadraticCurveTo(0,-2,12,-1);ctx.stroke();return true;}
  if(id==='shore100s'){glow(-12,0,fl,'#ffffff',.5);hull('#eef6f2',edge,1.5);return true;}
  return false;}
// --- мастерство (индекс — номер миссии минус один) ---
Object.assign(MASTERY,{38:{t:'Растворить импульсом или зарядом 4 Тромба',ok:()=>!!G.mc&&(G.mc.clot90||0)>=4},39:{t:'Ни разу не поднять Тревогу выше 60',ok:()=>!!G.mc&&!G.mc.alarm60},40:{t:'Порвать рывком 3 нейронные связи',ok:()=>!!G.mc&&(G.mc.cut90||0)>=3},
  41:{t:'Не потерять ни одного Пассажира, 8 ударов в такт, первый запуск — без сбоя',ok:()=>!!G.mc&&!!G.mc.heart90&&!G.mc.passKill90&&(G.mc.perf90||0)>=8&&!!G.mc.p4clean90},
  42:{t:'Ни разу не залететь в стёртое',ok:()=>!!G.mc&&!G.mc.void100},43:{t:'Прервать 3 ремонта Корректора',ok:()=>!!G.mc&&(G.mc.fixCut100||0)>=3},44:{t:'Пережить Прилив и ни разу не попасть под него',ok:()=>!!G.mc&&!G.mc.tide100&&(G.mc.tideN100||0)>=1},
  45:{t:'Ни разу не коснуться горизонта',ok:()=>!!G.mc&&!!G.mc.shore100&&!G.mc.hz100}});
// --- справочник: лор боссов и имя Безымянного открываются после победы ---
Object.defineProperty(EDEF.heart90,'lore',{get(){return BEAT90x(42)?'Сердце Ковчега качает кровь для пассажиров, которые не просыпались с первого цикла. Оно не знает, куда летит корабль. Оно знает, что останавливаться нельзя.':'ИСТОЧНИК НЕ ОПОЗНАН';},configurable:true,enumerable:true});
Object.defineProperty(EDEF.shore100,'lore',{get(){return BEAT90x(46)?'Край стёртого. Здесь кончается всё, что кто-то помнил, — и начинается то, чего никто не записал.':'ИСТОЧНИК НЕ ОПОЗНАН';},configurable:true,enumerable:true});
Object.defineProperty(EDEF.noname100,'name',{get(){return BEAT90x(46)?'Безымянный':'???';},configurable:true,enumerable:true});
Object.defineProperty(EDEF.noname100,'lore',{get(){return BEAT90x(46)?'Его имя стёрли первым. Он смотрит на тех, кто смотрит на него, — проверяет, не узнают ли.':'ИМЯ СТЁРТО';},configurable:true,enumerable:true});
function BEAT90x(m){const S=G.save;return !!(S&&S.medals&&S.medals[m]&&S.medals[m].clear)||!!storyFlag(m===42?'heart42':'shore46');}
// --- обломки боссов в мире ---
Object.assign(SB_WRECK,{42:{stop:['СЕРДЦЕ КОВЧЕГА','Сердце остановлено. В камере тихо и тепло. На стенке — метки ритма: пятьдесят, пятьдесят, пятьдесят…'],pulse:['СЕРДЦЕ КОВЧЕГА','Сердце бьётся ровно. Ковчег летит дальше. Куда — не знает никто, но теперь есть кому спросить.'],wake:['СЕРДЦЕ КОВЧЕГА','Камера пуста. Капсулы открыты. На полу — следы босых ног, ведущие к иллюминаторам.']},
  46:{forget:['ЛИНИЯ БЕРЕГА','Песок ровный, как чистый лист. Ничего не написано.'],carry:['ЛИНИЯ БЕРЕГА','На песке — двенадцать ямок от камней. Часть пуста. Остальное — у вас.'],record:['ЛИНИЯ БЕРЕГА','Каждое имя выцарапано на маяке. Прилив его больше не трогает.']}});
SB_WM85.push(42,46);
// --- контракты ---
CTPL.push({id:'c_quiet90',s:'IX · Тихий обход',t:n=>`Убить ${n} Смотрителей ударом в спину, пока они не подняли тревогу`,ev:'quiet90',n:[4,6],after:40,sec:8},
  {id:'c_drain90',s:'IX · Дренаж',t:n=>`Растворить ${n} Тромбов и луж импульсом или зарядом`,ev:'drain90',n:[5,7],after:39,sec:8},
  {id:'c_wake90',s:'IX · Доброе утро',t:n=>`Разбудить ${n} пассажиров в капсулах`,ev:'wake90',n:[2,3],after:39,sec:8},
  {id:'c_escort100',s:'X · Сопровождение',t:n=>`Довести ${n} Свидетелей до края арены`,ev:'escort100',n:[2,2],after:43,sec:9},
  {id:'c_tide100',s:'X · Перед приливом',t:n=>`Пережить ${n} Приливов без урона`,ev:'tide100',n:[2,3],after:45,sec:9},
  {id:'c_look100',s:'X · Взгляд в сторону',t:()=>'Уничтожить Безымянного, не дав взгляду окрепнуть',ev:'look100',n:[1,1],after:45,sec:9});
// --- модули сюжета ---
function mod90(k){const h=storyFlag('heart42'),s=storyFlag('shore46');if(k==='hush')return h==='stop'||h==='wake';if(k==='pulse')return h==='pulse'||h==='wake';if(k==='erase')return s==='forget';if(k==='mem')return s==='carry';return false;}
function memK90(){if(!mod90('mem'))return 1;return 1+.01*fragN100(sh100().frag);}
function mod90Tick(dt){const p=G.player;if(!p)return;if(G.cloak90>0)G.cloak90-=dt;
  if(G.dashId!==G.dash90){G.dash90=G.dashId;if(mod90('hush')&&p.dashT>0){G.cloak90=1.5;G.cloakP90={x:p.x,y:p.y,hp:1,isDecoy:true};if(!G.hushH90){G.hushH90=1;floater(p.x,p.y-40,'ТИШИНА СЕРДЦА · ВАС НЕ ВИДЯТ',C90.warm);}}}}
function mod90Pulse(p){if(mod90('erase')){G.cloak90=1.2;G.cloakP90={x:p.x,y:p.y,hp:1,isDecoy:true};if(!G.eraseH90){G.eraseH90=1;floater(p.x,p.y-40,'СТЁРКА · ВАС НЕ ВИДЯТ',C90.sh);}}}
function cloak90(e){if(!(G.cloak90>0)||!G.cloakP90)return null;if(e&&(e.sbk||EDEF[e.type].sbp))return null;return G.cloakP90;}
{const f0=fire;fire=function(p,tg,ang){const n0=G.pb.length;const own=p===G.player;if(own)G.lastFire90=G.t;const r=f0(p,tg,ang);
  if(own){const bt=typeof heartPerfBeat95==='function'?heartPerfBeat95():0;if(bt)for(let i=n0;i<G.pb.length;i++)G.pb[i].bt95=bt;}
  if(own&&mod90('pulse')){G.shot90=(G.shot90||0)+1;if(G.shot90%4===0)for(let i=n0;i<G.pb.length;i++){G.pb[i].dmg*=1.5;G.pb[i].pk90=1;}}return r;};}
// --- хроника ---
function chron90(s){if(!s)return '';let h='';const A=s.ark;
  if(A&&A.pods){let w=0,sl=0,l=0;for(const k in A.pods){const v=A.pods[k];if(v==='w')w++;else if(v==='s')sl++;else if(v==='l')l++;}if(w+sl+l)h+=`<dt>Пассажиры Ковчега</dt><dd>Разбужено: ${w}. Спят: ${sl}. Потеряно: ${l}.${l?' Потерянных не вернуть.':''}</dd>`;}
  if(s.heart42)h+=`<dt>Сердце Ковчега</dt><dd>${s.heart42==='stop'?'Сердце остановлено. Спящие уснули насовсем — тихо, без боли и без пробуждения.':s.heart42==='pulse'?'Сердце запущено. Ковчег летит дальше, и теперь у него есть ритм.':'Все проснулись. Ковчег больше не спит — он смотрит наружу.'}</dd>`;
  const S=s.shore;if(S&&(S.frag||S.lostFrag)){const n=fragN100(S.frag||0),lo=fragN100(S.lostFrag||0);h+=`<dt>Обрывки памяти</dt><dd>Собрано ${n} из 12${lo?', потеряно навсегда: '+lo:''}.</dd>`;for(let i=0;i<12;i++)if(S.frag&(1<<i))h+=`<dt>Обрывок ${i+1}</dt><dd>${FRAG100[i]}</dd>`;}
  if(s.shore46)h+=`<dt>Стёртый берег</dt><dd>${s.shore46==='forget'?'Вы всё забыли и летите налегке.':s.shore46==='carry'?'Вы несёте то, что осталось. Это тяжело — так и должно быть.':'Берег записан целиком. За краем стёртого — Нулевая точка.'}</dd>`;
  if(s.typo100)h+=`<dt>Опечатки</dt><dd>Исправлено опечаток: ${s.typo100}.</dd>`;return h;}
// --- открытый мир IX–X ---
const W90={gen:false,pods:[],frags:[],zero:null,sec:-1,netO:{nets:[]}};
function w90Gen(){if(W90.gen||!WORLD.sectors[9]||!G.save||!W80.gen)return;W90.gen=true;const N=WORLD.nodes,ex=[...WORLD.shops,WORLD.hangar,WORLD.arsenal].filter(Boolean);
  const okAt=(x,y,dn,dp)=>w58Far(x,y,N,dn)&&w58Far(x,y,W80.zones,dp)&&w58Far(x,y,W90.pods,dp)&&w58Far(x,y,W90.frags,dp)&&w58Far(x,y,ex,800)&&inSectors(x,y)&&WORLD.sectors.every(sc=>!sc.bx||Math.hypot(x-sc.bx,y-sc.by)>900);
  const GZ=[[8,'ИММУНИТЕТ',['keeper90','phago90','clot90'],['hunter',['armor']],39],[8,'НЕРВНЫЙ УЗЕЛ',['neuron90','clot90','gunner'],['shade',['fast']],40],[9,'ОТМЕЛЬ',['eraser100','hollow100','gunner'],['hunter',['armor']],43],[9,'ЧЕРНОВИК',['typo100','fixer100','phantom'],['shade',['boom']],44]];
  GZ.forEach(([sec,name,set,lead,after],i)=>{const q=pt80(sec,9100+i*43,(x,y,k)=>okAt(x,y,1100*k,1100*k),500);const z={x:q.x,y:q.y,req:0,set,w58:1,sec,after,name,lead,reinf:{},idx:1300+i,z80g:1};W80.zones.push(z);WORLD.zones.push(z);W58.zones.push(z);});
  ['wA','wB','wC'].forEach((id,i)=>{const q=pt80(8,9200+i*17,(x,y,k)=>okAt(x,y,800*k,1300*k),400);W90.pods.push({id,x:q.x,y:q.y,ch:0});});
  for(let i=0;i<6;i++){const q=pt80(9,9300+i*19,(x,y,k)=>okAt(x,y,700*k,1000*k),350);W90.frags.push({bit:6+i,x:q.x,y:q.y});}
  {const s=WORLD.sectors[10];if(s&&s.box){const b=s.box;W90.zero={x:(b[0]+b[2])/2,y:b[3]};}}}
function w90WorldTick(dt){const S=G.save,p=G.player;if(!S||!p)return;w90Gen();if(!W90.gen)return;mod90Tick(dt);const sec=sectorIdx(p.x,p.y);
  // ночлег пассажиров в мире
  for(const q of W90.pods){const st=ark90().pods[q.id];if(st==='w'||st==='l')continue;const d=Math.hypot(p.x-q.x,p.y-q.y);if(d<60&&p.hp>0){q.ch+=dt;if(q.ch>=(storyFlag('well38')==='silence'?2:1.5)){q.ch=0;podSet90(q.id,'w');S.lom+=60;floater(q.x,q.y-40,'ПРОСНУЛСЯ · +60 ЛОМА',C90.pil);sfx('cell');snd90('wake');conEvent('wake90');saveWorld();}}else q.ch=Math.max(0,q.ch-dt*1.5);}
  // обрывки
  const sh=sh100();for(const f of W90.frags){if(sh.frag&(1<<f.bit))continue;if(Math.hypot(p.x-f.x,p.y-f.y)<50&&p.hp>0){sh.frag|=1<<f.bit;const n=fragN100(sh.frag);floater(f.x,f.y-30,'ОБРЫВОК ПАМЯТИ · '+n+'/12','#ffffff');snd90('fragGet');radioLine('ОБРЫВОК',C90.sh,FRAG100[f.bit],.2);saveWorld();}}
  // сеть нейронов и пятна Ластиков в открытом мире
  if(G.wn90&&G.wn90.length){W90.netO.nets=G.wn90;netTick90(W90.netO,dt);G.wn90=W90.netO.nets;}
  if(G.wez100&&G.wez100.length){for(const z of G.wez100){if(z.tele>0)z.tele-=dt;else z.t-=dt;}G.wez100=G.wez100.filter(z=>z.tele>0||z.t>0);let inZ=false;for(const z of G.wez100)if(z.tele<=0&&Math.hypot(p.x-z.x,p.y-z.y)<z.r)inZ=true;
    if(inZ&&p.dashT<=0)drain90(6*dt);}
  // пассажиры летят с вами (после «Разбудить всех»)
  if(sec===8&&W90.sec!==8&&storyFlag('heart42')==='wake'&&!G.ally90w&&p.hp>0){G.ally90w={kind:'pass',x:p.x-60,y:p.y+40,a:0,cd:1,t:90};radioLine('ПАССАЖИР',C90.pil,'Мы проснулись. Теперь наша очередь вас прикрывать.',.6);floater(p.x,p.y-50,'ПАССАЖИР · СОЮЗНИК НА 90 С',C90.pil);}
  W90.sec=sec;if(G.ally90w){if(sec!==8||p.hp<=0)G.ally90w=null;else ally85Tick(dt,G.ally90w);if(G.ally90w&&G.ally90w.t<=0)G.ally90w=null;}
  w95WorldTick(dt);}
function w90Draw(t){if(!W90.gen)return;const p=G.player;const A=ark90();
  for(const q of W90.pods){if(!inView(q.x,q.y,80))continue;const st=A.pods[q.id];podDraw90({x:q.x,y:q.y,st:st==='w'?'open':st==='l'?'lost':'sleep',ch:q.ch,kch:0},t);}
  const sh=sh100();for(const f of W90.frags){if(sh.frag&(1<<f.bit)||!inView(f.x,f.y,80))continue;glow(f.x,f.y,40,C90.sh,.35+.15*Math.sin(t*3+f.bit));ctx.save();ctx.translate(f.x,f.y);ctx.rotate(t*.8+f.bit);ctx.strokeStyle='#ffffff';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(6,0);ctx.lineTo(0,9);ctx.lineTo(-6,0);ctx.closePath();ctx.stroke();ctx.restore();if(p&&Math.hypot(p.x-f.x,p.y-f.y)<300)worldLabel(f.x,f.y-24,'ОБРЫВОК','#ffffff');}
  gate110Draw(t);
  w95Draw(t);
  const Al=G.ally90w;if(Al){ctx.save();ctx.translate(Al.x,Al.y);ctx.rotate(Al.ang||0);ctx.fillStyle='#141a28';ctx.strokeStyle=C90.pil;ctx.lineWidth=2;shipPath85(.8);ctx.fill();ctx.stroke();ctx.restore();worldLabel(Al.x,Al.y-20,'ПАССАЖИР · '+Math.ceil(Al.t),C90.pil);}}
function w90MapAdd(add,lod,S){w90Gen();if(!W90.gen)return;const A=ark90();for(const q of W90.pods){if(!revealedAt(q.x,q.y))continue;const st=A.pods[q.id];add('pod90',q.x,q.y,{st},lod===2?{t:st==='w'?'КАПСУЛА · ПУСТА':'КАПСУЛА',p:5,c:st==='w'?'#9fb0c4':C90.ark}:null);}
  const sh=sh100();for(const f of W90.frags){if(sh.frag&(1<<f.bit)||!revealedAt(f.x,f.y))continue;add('frag100',f.x,f.y,{},lod===2?{t:'ОБРЫВОК',p:5,c:'#ffffff'}:null);}
  if(W90.zero&&revealedAt(W90.zero.x,W90.zero.y))add('zero100',W90.zero.x,W90.zero.y,{},lod===2?{t:zeroOpen110()?'ВОРОТА ОТКРЫТЫ · НУЛЕВОЙ МИГ':'ВОРОТА · ПРОЙДИТЕ «МИГ»',p:6,c:'#ff9fe0'}:null);
  if(W95.gen){const N95={gclot:'ТРОМБОЗ',typoW:'ОПЕЧАТКА В МИРЕ',sig:'ПОСЛЕДНИЙ СИГНАЛ'},D=w95S();for(const k in W95.sites){const q=W95.sites[k];if(D[k]===(S&&S.cycle||1)||!revealedAt(q.x,q.y))continue;add('ev95',q.x,q.y,{},lod===2?{t:N95[k],p:5,c:'#ffffff'}:null);}}}
function w90MapIcon(g,kind,o,t){if(kind==='pod90'){g.strokeStyle=o.st==='w'?'#9fb0c4':'#ffd36b';g.strokeRect(-3,-5,6,10);return true;}if(kind==='frag100'){g.strokeStyle='#ffffff';g.beginPath();g.moveTo(0,-5);g.lineTo(4,0);g.lineTo(0,5);g.lineTo(-4,0);g.closePath();g.stroke();return true;}
  if(kind==='ev95'){g.strokeStyle='#ffffff';g.beginPath();g.arc(0,0,5,0,TAU);g.stroke();g.beginPath();g.arc(0,0,1.5,0,TAU);g.stroke();return true;}
  if(kind==='zero100'){g.strokeStyle='#ff9fe0';g.beginPath();g.arc(0,0,6,0,TAU);g.stroke();g.beginPath();g.moveTo(-3,-3);g.lineTo(3,3);g.moveTo(3,-3);g.lineTo(-3,3);g.stroke();return true;}return false;}
// --- сохранение: чистка полей 0.9 ---
function sanitize90(S,num,obj){if(!S)return;if(S.story){const st=S.story;
    if(st.heart42!==undefined&&!['stop','pulse','wake'].includes(st.heart42))delete st.heart42;if(st.shore46!==undefined&&!['forget','carry','record'].includes(st.shore46))delete st.shore46;
    if(st.ark!==undefined){const a=st.ark=obj(st.ark);const P=a.pods=obj(a.pods);for(const k of Object.keys(P))if(!/^(m(39|40|41)[abtk]|w[ABC])$/.test(k)||!['w','s','l'].includes(P[k]))delete P[k];for(const k of ['woke','slept','lost'])a[k]=num(a[k],0,0,99,true);}
    if(st.shore!==undefined){const h=st.shore=obj(st.shore);h.frag=num(h.frag,0,0,4095,true);h.lostFrag=num(h.lostFrag,0,0,4095,true)&~h.frag;}
    if(st.typo100!==undefined)st.typo100=num(st.typo100,0,0,1e6,true);
    if(st.sec95!==undefined)st.sec95=num(st.sec95,0,0,255,true);
    if(st.zero49!==undefined)st.zero49=num(st.zero49,0,0,1,true);if(st.zero50!==undefined)st.zero50=num(st.zero50,0,0,9,true);
    if(st.w95!==undefined){const w=st.w95=obj(st.w95);for(const k of Object.keys(w))if(!['gclot','typoW','sig'].includes(k))delete w[k];else w[k]=num(w[k],0,0,999,true);}}
  if(S.seen90!==undefined){S.seen90=Array.isArray(S.seen90)?S.seen90.filter(k=>typeof k==='string'&&D90T.has(k)).slice(0,40):[];}}
function bossLab90(m){if(m===50)return 'VØID-000';const si=secOfLevel(m);return SEC_SCALE[si]&&SB_OF_SEC[si]&&SB_NAME_OF_SEC[si]?'БОСС · '+SB_NAME_OF_SEC[si]:'БОСС · ДОРАБОТКА';}


