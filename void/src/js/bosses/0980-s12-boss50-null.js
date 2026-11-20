// ===== 0.9.9 R3: сектор XII «Нулевой миг» — босс 50 VØID-000 «Нулевой» =====
// R3 «сложно, но не душно». Урон по боссу проходит всегда (×1); мастерство умножает: шов ×1,5, остывание ×1,5, сбой ×2, в такт ×2,
// бок во время стойки ×2; итог ≤ ×3. Пространство дышит: выдох, выдох, вдох (×0,88, ×0,88, ×1,28) в границах стадии.
// Дирижёр атак: бюджет угроз, лёгкие и крупные, остывание после крупных. Четыре стадии: Зеркало, Отсчёт, Негатив, Кнопка; гонка и выбор.
// Контрольных точек нет: гибель — цикл заново.
const C120={zero:'#ff9fe0',rose:'#ffd0ee',dim:'#6a2e58',white:'#fff4fb',warm:'#ffb36b',ice:'#bfe8ff',neg:'#e8fff8',ink:'#120812',red:'#ff4f6e',gold:'#ffe9b0',body:'#1a0c1a',rim:'#fff4fb',mint:'#8dffd2'};
const ZB_BEAT=1.2,ZB_N=4,ZB_FLOOR=330,ZB_SHR=.88,ZB_EXP=1.28,ZB_SEG=4700,ZB_MIRMIN=260,ZB_MIRMAX=440;
const ZB_BAND=[null,[560,720],[520,680],[430,560],[440,620]];
const ZB_SEGK=[0,1,1.1,1.15,1.35];
const ZB_TEMPO=[0,1.5,1.7,1.4,1.3];
// выдох — только выпуклые; вдох — любые (вогнутые фигуры — только на расширении)
const ZB_POOL={out:[null,['ellipse','capsule','circle','lens2','hexagon'],['circle','hexagon','capsule','ellipse'],['circle','ellipse','hexagon','capsule','triangle'],['circle','hexagon','ellipse','capsule']],
  in:[null,['circle','star','cross','hexagon','lens2'],['ring','star','shards','circle','hexagon'],['circle','lens2','hexagon','ellipse'],['crescent','star','spiral','shards','circle','hexagon']]};// у кнопки нет кольца: дыра легла бы на кнопку
const ZST=[null,
  {n:'ЗЕРКАЛО',g:0,hint:'ОН ПОВТОРЯЕТ ВАС · ПОСЛЕ БРОСКА БЕЙТЕ В КОРМУ',r:'…я повторяю тебя. Я повторял тебя первым…'},
  {n:'ОТСЧЁТ',g:1,hint:'ДЛИННУЮ СТРЕЛКУ — РЫВКОМ · НА НУЛЕ К КРАЮ · ТАРАН — +4 С',r:'…пятнадцать. Ты меня не остановишь. Никто не останавливал…'},
  {n:'НЕГАТИВ',g:0,hint:'ИНОГДА МИР ВЫВОРАЧИВАЕТСЯ · В НЕГАТИВЕ — НАРУЖУ',r:'…внутри нельзя. Снаружи можно. Я помню это наоборот…'},
  {n:'КНОПКА',g:0,hint:'АТАКИ В ТАКТ СЕРДЦА · В ТАКТ ×2 · НА 20% — ГОНКА',r:'…кнопка. Кто первый — тот и помнит. Или стирает…'}];
// атаки: имя, совет при гибели, крупная (даёт остывание)
const ZB_ATK={dash:{n:'БРОСОК',tip:'ШАГ В СТОРОНУ, КОГДА ЛИНИЯ ЗАМРЁТ',big:1},fan:{n:'ВЕЕР',tip:'УХОДИТЕ ИЗ КОНУСА ИЛИ В ЩЕЛЬ МЕЖДУ ПУЛЯМИ',big:0},
  fan2:{n:'ДВОЙНОЙ ВЕЕР',tip:'ВСТАНЬТЕ В ЩЕЛЬ ПЕРВОГО ВЕЕРА И СДВИНЬТЕСЬ',big:0},pulse:{n:'ИМПУЛЬС',tip:'НЕ ВИСНИТЕ НА НЁМ, КОГДА ВСПЫХИВАЕТ КРУГ',big:1},
  beam:{n:'ЗЕРКАЛЬНЫЙ ЛУЧ',tip:'ВО ВРЕМЯ СТОЙКИ ЗАХОДИТЕ СБОКУ',big:1},repeat:{n:'ПОВТОР',tip:'НЕ СТОЙТЕ НА МЕСТЕ И НЕ РАЗВОРАЧИВАЙТЕСЬ',big:0},
  mines:{n:'НУЛИ',tip:'РАССТРЕЛИВАЙТЕ НУЛИ ИЛИ ОБХОДИТЕ',big:0},dashfan:{n:'БРОСОК-ВЕЕР',tip:'ПОСЛЕ БРОСКА ЖДИТЕ ВЕЕР С ТОЧКИ ПРИЗЕМЛЕНИЯ',big:1},
  star:{n:'ЗВЕЗДА',tip:'ВЫЙДЯ ИЗ КРУГА, ВСТАНЬТЕ МЕЖДУ ЛУЧАМИ ЗВЕЗДЫ',big:1},burst:{n:'ОЧЕРЕДЬ',tip:'ДВИГАЙТЕСЬ ПОПЕРЁК ОЧЕРЕДИ, А НЕ НАЗАД',big:0},
  blink:{n:'ВСПЫШКА',tip:'СЛЕДИТЕ ЗА МЕТКОЙ — ОН ПОЯВИТСЯ ТАМ И СРАЗУ СТРЕЛЯЕТ',big:0},tridash:{n:'ТРОЙНОЙ БРОСОК',tip:'ТРИ ЛИНИИ ПОДРЯД · ПОСЛЕ ТРЕТЬЕЙ — ОКНО ×1,5',big:1},
  grid:{n:'РЕШЁТКА',tip:'ВСТАНЬТЕ В ПРОСВЕТ МЕЖДУ ЛУЧАМИ',big:1}};
const ZB_HIT={dash:ZB_ATK.dash,dashfan:ZB_ATK.dashfan,star:ZB_ATK.star,burst:ZB_ATK.burst,blink:ZB_ATK.blink,tridash:ZB_ATK.tridash,grid:ZB_ATK.grid,sat:{n:'СПУТНИК',tip:'СПУТНИК СБИВАЕТ ТАРАН, ИМПУЛЬС ИЛИ ЗАРЯД — И ЭТО СБОЙ'},echo:{n:'ЭХО СЕКТОРОВ',tip:'СНАЧАЛА СОТРИТЕ ЭХО — ОНИ БЬЮТ СБОКУ, ПОКА ОН ДАВИТ'},fan:ZB_ATK.fan,fan2:ZB_ATK.fan2,pulse:ZB_ATK.pulse,beam:ZB_ATK.beam,repeat:ZB_ATK.repeat,mine:{n:'НУЛЬ',tip:ZB_ATK.mines.tip},
  ghost:{n:'ПОСЛЕОБРАЗ',tip:'НЕ ВОЗВРАЩАЙТЕСЬ НА ЛИНИЮ БРОСКА'},hands:{n:'СТРЕЛКИ',tip:'ДЛИННУЮ СТРЕЛКУ ПЕРЕПРЫГИВАЙТЕ РЫВКОМ ИЛИ ОБГОНЯЙТЕ · КОРОТКАЯ ЖЖЁТ ЦЕНТР'},
  nova:{n:'НОЛЬ',tip:'НА НУЛЕ УХОДИТЕ К КРАЮ ИЛИ СБИВАЙТЕ СЧЁТ ТАРАНОМ'},sing:{n:'ВОРОНКА',tip:'ИДИТЕ ПРОТИВ ТЯГИ'},beat:{n:'ВЫПАД',tip:'ШАГ В СТОРОНУ НА КРАСНОМ ТАКТЕ'},
  out:{n:'СТИРАНИЕ',tip:'СЛЕДИТЕ ЗА ПОЛОСОЙ ДЫХАНИЯ'},clone:{n:'ОТРАЖЕНИЕ',tip:'РАЗБЕЙТЕ КОПИЮ ИЛИ ВЫМАНИТЕ ЕЁ ПОД СЖАТИЕ'},body:{n:'КОРПУС',tip:'НЕ СТОЙТЕ НА ЛИНИИ БРОСКА'}};
Object.assign(EDEF,{
  zero000:{name:'VØID-000 «Нулевой»',hp:1e9,spd:300,r:54,xp:0,contact:0,col:'#ff9fe0',pts:0,act:6,m:50,sec:11,zb:1,
    desc:'Первая копия. Он не ждёт в комнате — выходит в сектор сам, и пространство начинает дышать: выдох, выдох, вдох. Урон по нему проходит всегда, а мастерство умножает: корма ×1,5, остывание после крупной атаки ×1,5, сбой ×2. В «Зеркале» он стоит в вашей зеркальной точке и повторяет ваш след. В «Отсчёте» кружит у стола со стрелками — у края безопасно, таран сбивает счёт. В «Негативе» мир иногда выворачивается, и он выходит за вами наружу. У «Кнопки» атакует в такт сердца, а на 20% начинается гонка.',
    lore:'…кнопка ещё тёплая…'},
  zero000c:{name:'Отражение Нулевого',hp:1e9,spd:260,r:30,xp:0,contact:0,col:'#ffd0ee',pts:0,act:6,m:50,sec:11,zb:2,desc:'Копия в зеркальной точке. Разбитая отнимает у него 3% сегмента и раскачивает сбой; сжатие стирает её.'}});
HEAVY.add('zero000');HEAVY.add('zero000c');
// --- каркас ---
let ZBB=null,ZBBs=null;function zbBox(){const b=WORLD.sectors[11];if(!b)return [0,0,0,0];if(ZBBs===b&&ZBB&&ZBB.src===b.box)return ZBB;ZBBs=b;ZBB=[b.box[0]+60,b.box[1]+60,b.box[2]-60,b.box[3]-60];ZBB.src=b.box;return ZBB;}
function zbNode(){const n=WORLD.nodes[49];return n?{x:n.x,y:n.y}:{x:38500,y:16600};}
function zbOn(){const Z=G.zb;return !!(Z&&Z.k!=='idle'&&G.world&&G.mode==='world'&&Z.save===G.save);}
function zbF(){const Z=G.zb;return zbOn()&&(Z.k==='fight'||Z.k==='race'||Z.k==='seg')?Z:null;}
function zbDone(){const S=G.save;return !!(S&&S.medals&&S.medals[50]&&S.medals[50].clear);}
function zbDiffK(){const d=G.save&&G.save.diff;return d==='hard'?{hp:1.15,dmg:1.4,drain:.033,win:.09,tempo:1/1.25,hold:6.5,budget:4,heal:.2,lane:1,hands:.52}:d==='mid'?{hp:1,dmg:1.1,drain:.025,win:.12,tempo:.92,hold:7.5,budget:3,heal:.25,lane:1,hands:.42}:{hp:.85,dmg:.85,drain:.018,win:.2,tempo:1.15,hold:8.5,budget:2,heal:.35,lane:1,hands:.34};}
function zbCanStart(){return G.world&&G.mode==='world'&&G.state==='world'&&!zbOn()&&!(G.zbCool>G.t)&&!!G.save&&!!G.player&&G.player.hp>0;}
function zbStart(){if(!zbCanStart())return false;const p=G.player,D=zbDiffK();G.card=null;G.cardKey=null;$('#wcard').hidden=true;
  G.zb={k:'silence',t:0,T:0,stT:0,save:G.save,stage:0,seg:[1,1,1,1],hp:0,segMax:ZB_SEG*D.hp,segBase:ZB_SEG*D.hp,boss:null,clones:[],stars:[],lines:[],mines:[],frags:[],sing:null,delay:[],
    shape:{kind:'circle',s:ZB_BAND[1][1],a:0,c:{x:0,y:0},prev:null,morph:1,tg:0,hold:0,next:null,type:'E'},br:{i:0},shrink:1,nShape:0,nExp:0,nShr:0,out:0,outT:0,vig:0,flash:0,exp:0,thrT:0,mapStatic:0,
    beat:0,beatN:0,beatT:0,beatEnv:0,trail:[],trailT:0,trailE:[],trailET:0,stall:0,lunge:0,lungeCool:0,cycles:0,deaths:0,glitch:0,sw:{x:0,y:0},hint:{},choice:null,thirdOK:false,cheer:0,
    stg:0,stgT:-9,stgLock:0,stun:0,nStun:0,cool:0,wind:0,stance:0,stanceA:0,face:0,deflT:0,atkT:3,seq:[],light:0,used:{},ramId:-1,ramCd:0,count:15,novaT:0,zeroN:0,hands:null,neg:{m:'norm',t:0},
    orbA:0,orbDir:1,orbT:6,cloneDone:0,cloneRe:0,mineDrop:0,mineDT:0,chase:'intercept',chaseT:0,lastHp:p.hp,lastHit:null,lastAtk:null,lastShot:null,endT:0,dir:{x:1,y:0}};
  const n=zbNode();const a=Math.atan2(p.y-n.y,p.x-n.x);G.zb.dir={x:Math.cos(a),y:Math.sin(a)};if(!isFinite(G.zb.dir.x)){G.zb.dir={x:0,y:-1};}
  snd120('press',n.x);p.inv=Math.max(p.inv,.5);G.calm=0;return true;}
// --- стены ---
function zbWalls(){const Z=G.zb;return zbOn()&&Z.k!=='silence'&&Z.k!=='end';}
function zbClamp(o,r){const b=zbBox();r=r||0;if(o.x<b[0]+r){o.x=b[0]+r;if(o.vx<0)o.vx*=-.3;}if(o.x>b[2]-r){o.x=b[2]-r;if(o.vx>0)o.vx*=-.3;}if(o.y<b[1]+r){o.y=b[1]+r;if(o.vy<0)o.vy*=-.3;}if(o.y>b[3]-r){o.y=b[3]-r;if(o.vy>0)o.vy*=-.3;}}
// --- фигуры пространства: полярный радиус r(θ); кольцо — с внутренним контуром ---
function zbPolyR(n,th){const s=TAU/n,q=((th%s)+s)%s;return Math.cos(s/2)/Math.cos(q-s/2);}
function zbSup(th,asp,n){const c=Math.abs(Math.cos(th)),s=Math.abs(Math.sin(th))/asp;return Math.pow(Math.pow(c,n)+Math.pow(s,n),-1/n);}
function zbR(kind,th,rot){th-=rot;switch(kind){
  case 'circle':return 1;
  case 'ellipse':return 1/Math.sqrt(Math.cos(th)**2+(Math.sin(th)/.62)**2);
  case 'ring':return 1;
  case 'capsule':return zbSup(th,.56,4);
  case 'band':return zbSup(th,.32,6);
  case 'crescent':return 1-.55*Math.pow(Math.max(0,Math.cos(th)),1.6);
  case 'lens2':return Math.max(zbSup(th,.46,2.4),zbSup(th+Math.PI/2,.46,2.4));
  case 'triangle':return zbPolyR(3,th)*1.08;
  case 'hexagon':return zbPolyR(6,th);
  case 'star':return .58+.42*Math.pow(.5+.5*Math.cos(5*th),.7);
  case 'cross':return Math.max(zbSup(th,.36,8),zbSup(th+Math.PI/2,.36,8));
  case 'spiral':return .72+.28*Math.sin(3*th);
  case 'shards':return .64+.36*Math.pow(Math.abs(Math.sin(2*th)),.75);}return 1;}
function zbRin(kind){return kind==='ring'?.46:0;}
function zbEase(k){return k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;}
function zbBeatSq(Z){return Z.stage===4&&Z.k==='fight'?1-.04*Z.beatEnv:1;}
function zbRad(Z,th){const S=Z.shape,sh=Z.shrink*zbBeatSq(Z);const r1=zbR(S.kind,th,S.a)*S.s;let r=r1*sh;if(S.prev&&S.morph<1){const k=zbEase(S.morph);r=(zbR(S.prev.kind,th,S.prev.a)*S.prev.s*(1-k)+r1*k)*sh;}
  // фигура никогда не выходит за стены сектора (морф между далёкими центрами мог задеть стену)
  const c=zbCen(Z),b=zbBox();if(r<Math.min(c.x-b[0],b[2]-c.x,c.y-b[1],b[3]-c.y)-2)return r;const dx=Math.cos(th),dy=Math.sin(th);let m=1e9;if(dx>1e-6)m=Math.min(m,(b[2]-2-c.x)/dx);else if(dx<-1e-6)m=Math.min(m,(b[0]+2-c.x)/dx);if(dy>1e-6)m=Math.min(m,(b[3]-2-c.y)/dy);else if(dy<-1e-6)m=Math.min(m,(b[1]+2-c.y)/dy);return Math.max(0,Math.min(r,m));}
function zbRadIn(Z,th){const S=Z.shape,sh=Z.shrink;const r1=zbRin(S.kind)*S.s;if(S.prev&&S.morph<1){const k=zbEase(S.morph);return (zbRin(S.prev.kind)*S.prev.s*(1-k)+r1*k)*sh;}return r1*sh;}
function zbCen(Z){const S=Z.shape;if(S.prev&&S.morph<1){const k=zbEase(S.morph);return {x:S.prev.c.x+(S.c.x-S.prev.c.x)*k,y:S.prev.c.y+(S.c.y-S.prev.c.y)*k};}return S.c;}
function zbIn(Z,x,y,pad){const c=zbCen(Z),dx=x-c.x,dy=y-c.y,d=Math.hypot(dx,dy),th=Math.atan2(dy,dx);pad=pad||0;const r=zbRad(Z,th),ri=zbRadIn(Z,th);return d<=r-pad&&(ri<=0||d>=ri+pad);}
function zbEdgeD(Z,x,y){const c=zbCen(Z),dx=x-c.x,dy=y-c.y,d=Math.hypot(dx,dy),th=Math.atan2(dy,dx);const r=zbRad(Z,th),ri=zbRadIn(Z,th);let e=r-d;if(ri>0)e=Math.min(e,d-ri);return e;}// >0 внутри
function zbPoly(Z,inner){const key=inner?'pi':'po';const C=Z.polyC||(Z.polyC={});const q=C[key]||(C[key]={t:-1,f:-1,P:[]});if(q.t===G.t&&q.f===Z.T)return q.P;const n=isMob()?64:96,c=zbCen(Z),P=q.P;P.length=n;for(let i=0;i<n;i++){const th=i/n*TAU,r=inner?zbRadIn(Z,th):zbRad(Z,th);const v=P[i]||(P[i]=[0,0]);v[0]=c.x+Math.cos(th)*r;v[1]=c.y+Math.sin(th)*r;}q.t=G.t;q.f=Z.T;return P;}
function zbPolyOf(kind,s,a,c,inner){const n=isMob()?64:96,P=[];for(let i=0;i<n;i++){const th=i/n*TAU,r=(inner?zbRin(kind):zbR(kind,th,a))*s;P.push([c.x+Math.cos(th)*r,c.y+Math.sin(th)*r]);}return P;}
function zbNextPoly(N,inner){const k=inner?'Qi':'Q';if(N.kind==='spiral')return zbPolyOf(N.kind,N.s,N.a,N.c,inner);return N[k]||(N[k]=zbPolyOf(N.kind,N.s,N.a,N.c,inner));}
function zbPath(P){ctx.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)ctx.lineTo(P[i][0],P[i][1]);ctx.closePath();}
function zbFitC(x,y,s,m){const b=zbBox();m=m||0;const hx=(b[2]-b[0])/2-12,hy=(b[3]-b[1])/2-12;const sx=Math.min(s+m,hx),sy=Math.min(s+m,hy);return {x:clamp(x,b[0]+sx+10,b[2]-sx-10),y:clamp(y,b[1]+sy+10,b[3]-sy-10)};}
// точка внутри фигуры, ближайшая к (x,y) по лучу из центра (доля радиуса f)
function zbInside(Z,x,y,f){const c=zbCen(Z);const dx=x-c.x,dy=y-c.y,d=Math.hypot(dx,dy)||1,th=Math.atan2(dy,dx);const r=zbRad(Z,th)*(f||.8),ri=zbRadIn(Z,th);let q=Math.min(d,r);if(ri>0)q=Math.max(q,ri*1.25);return {x:c.x+Math.cos(th)*q,y:c.y+Math.sin(th)*q};}
// --- дыхание: выдох, выдох, вдох ---
function zbBreathType(Z,k){return (Z.br.i+(k||0))%3===2?'E':'S';}
function zbNegOn(Z){return Z.stage===3&&Z.neg&&Z.neg.m!=='norm';}
function zbNextShape(Z,first){const S=Z.shape,B=ZB_BAND[Z.stage]||ZB_BAND[1],p=G.player,D=zbDiffK();
  const type=first?'E':zbBreathType(Z);const cur=S.s||B[1];
  let s=first?B[1]:type==='S'?cur*ZB_SHR:cur*ZB_EXP;s=Math.max(ZB_FLOOR,clamp(s,B[0],B[1]));
  const pool=(type==='E'?ZB_POOL.in:ZB_POOL.out)[Z.stage]||ZB_POOL.out[1];let kind=pool[Math.random()*pool.length|0],tries=0;
  while((kind===S.kind||(S.prev&&kind===S.prev.kind))&&tries++<8)kind=pool[Math.random()*pool.length|0];
  const ang=rnd(0,TAU),margin=Z.stage===3?300:10;
  const base=S.c&&S.c.x?{x:S.c.x,y:S.c.y}:(p?{x:p.x,y:p.y}:zbNode());
  let c;const nd=zbNode();if(Z.stage===4)c={x:nd.x,y:nd.y};
  else{const a=rnd(0,TAU),d=first?0:type==='E'?rnd(80,300):rnd(0,140);c=zbFitC(base.x+Math.cos(a)*d,base.y+Math.sin(a)*d,s*1.12,margin);}
  // выдох держит игрока внутри с запасом 120 (у кнопки центр уходит от неё не дальше 220)
  const mg=Z.stage===4?150:120;// у кнопки радиус ещё и пульсирует на 4%
  if(type==='S'&&p){for(let it=0;it<8;it++){const dx=p.x-c.x,dy=p.y-c.y,d2=Math.hypot(dx,dy)||1;const r=zbR(kind,Math.atan2(dy,dx),ang)*s;const need=d2-(r-mg);if(need<=0)break;const k=Math.min(d2,need+4);c=zbFitC(c.x+dx/d2*k,c.y+dy/d2*k,s*1.12,margin);
    if(Z.stage===4){const ox=c.x-nd.x,oy=c.y-nd.y,od=Math.hypot(ox,oy);if(od>380){c={x:nd.x+ox/od*380,y:nd.y+oy/od*380};}}}
    {const dx=p.x-c.x,dy=p.y-c.y,d2=Math.hypot(dx,dy),u=zbR(kind,Math.atan2(dy,dx),ang);if(u>0&&d2+mg>u*s)s=Math.min(Math.max(B[1],cur),(d2+mg+4)/u);}
    // последний предохранитель: если вытянутая фигура всё равно не вмещает игрока с запасом — круг, а если и он мал — центр к игроку
    {const dx=p.x-c.x,dy=p.y-c.y,d2=Math.hypot(dx,dy)||1,u=zbR(kind,Math.atan2(dy,dx),ang);if(d2+mg>u*s){kind='circle';const s2=Math.min(Math.max(B[1],cur),d2+mg+4);if(s2>s)s=s2;if(d2+mg>s){const k=d2+mg+4-s;c=zbFitC(c.x+dx/d2*k,c.y+dy/d2*k,s*1.12,margin);}}}}
  S.next={kind,s,a:ang,c,hold:D.hold*rnd(.95,1.05),type,first:!!first};S.tg=first?1.0:1.8;snd120(type==='E'?'inTg':'outTg',c.x);}
function zbShapeTick(Z,dt){const S=Z.shape;
  if(S.kind==='spiral')S.a+=dt*.3;if(S.prev&&S.prev.kind==='spiral')S.prev.a+=dt*.3;// вращается только сама спираль, не фигура, в которую она перетекает
  if(zbNegOn(Z)&&!S.next&&S.morph>=1)return;// в негативе дыхание стоит
  if(S.next){S.tg-=dt;if(S.tg<=0){const N=S.next;S.prev={kind:S.kind,s:S.s,a:S.a,c:{x:S.c.x,y:S.c.y}};S.kind=N.kind;S.s=N.s;S.a=N.a;S.c={x:N.c.x,y:N.c.y};S.hold=N.hold;S.type=N.type;S.next=null;S.morph=0;Z.nShape++;if(N.type==='E')Z.nExp++;else Z.nShr++;if(!N.first)Z.br.i++;snd120(N.type==='E'?'inhale':'exhale',S.c.x);trauma90(.1);}}
  else if(S.morph<1){S.morph=Math.min(1,S.morph+dt/1.2);if(S.morph>=1){const pv=S.prev;S.prev=null;zbBreathDone(Z,pv);}}
  else if(Z.k==='fight'){S.hold-=dt;if(S.hold<=0&&!(Z.stage===3&&Z.neg.m==='norm'&&Z.neg.t>=6.2))zbNextShape(Z);}}
function zbBreathDone(Z,pv){const S=Z.shape;
  if(S.type==='S'){let n=0;for(const m of Z.mines)if(!zbIn(Z,m.x,m.y,0)){m.dead=1;n++;}Z.mines=Z.mines.filter(m=>!m.dead);
    for(const e of Z.clones)if(e.alive&&!zbIn(Z,e.x,e.y,-10)){e.alive=false;n++;if(SET.fx)explode(e.x,e.y,C120.rose,10,.6);}
    for(const e of G.enemies)if(e.alive&&e.zbEsc&&!zbIn(Z,e.x,e.y,-10)){e.alive=false;e.zbGone=1;n++;if(SET.fx)explode(e.x,e.y,C120.ice,10,.6);}
    if(n){const p=G.player;floater(p.x,p.y-48,'СЖАТИЕ СТЁРЛО: '+n,C120.rose);}}
  else if(pv&&Z.k==='fight'){// вдох дарит три осколка в новой зоне
    const c=zbCen(Z);let made=0;for(let i=0;i<24&&made<3;i++){const th=rnd(0,TAU);const rN=zbR(S.kind,th,S.a)*S.s,rO=zbR(pv.kind,th-(0),pv.a)*pv.s;const ri=zbRin(S.kind)*S.s;const r=Math.max(rN*.82,Math.min(rN-70,rO+90));if(r>rN-50||r<ri+60)continue;const x=c.x+Math.cos(th)*r,y=c.y+Math.sin(th)*r;if(!zbIn(Z,x,y,40))continue;if(Z.frags.some(f=>Math.hypot(f.x-x,f.y-y)<160))continue;Z.frags.push({x,y,t:0,T:6});made++;}
    if(made&&!Z.hint.frag){Z.hint.frag=1;const f=Z.frags[0];floater(f.x,f.y-30,'ОСКОЛОК · ЭНЕРГИЯ И СБОЙ',C120.mint);}
    if(Z.stage===3&&Z.neg.m==='norm')zbSingStart(Z);
    if(Z.k==='fight')zbEchoWave(Z,[0,2,2,3,3][Z.stage]||2);
    if(Z.k==='fight')zbRing(Z,c.x,c.y,zbRad(Z,0)*1.05,C120.mint,.8,14);}}
// --- вход: от кнопки до разлома ---
function zbTick(dt){const Z=G.zb;if(!zbOn()){zbAmbTick(dt);return;}if(Z.k!=='fight'&&Z.boss)Z.boss.contact=0;const p=G.player,n=zbNode(),b=zbBox();Z.t+=dt;Z.T+=dt;if(Z.flash>0)Z.flash-=dt;if(Z.glitch>0)Z.glitch-=dt;if(Z.deflT>0)Z.deflT-=dt;
  if(Z.k==='silence'){if(Z.t>=2){Z.k='walls';Z.t=0;snd120('wall',p.x);trauma90(.35);shake(10);}return;}
  if(Z.k==='walls'){zbClamp(p,p.r);if(Z.t>=.25){Z.k='expand';Z.t=0;Z.thrT=.75;Z.thrD=rnd(760,900);snd120('expand',n.x);}return;}
  if(Z.k==='expand'){Z.exp=Math.min(1,Z.t/2.3);{const RR=120+Math.pow(Z.exp,1.6)*3700,d=Math.hypot(p.x-n.x,p.y-n.y);if(!Z.hint.pass&&RR>=d){Z.hint.pass=1;Z.flash=.4;trauma90(.3);snd120('edge',p.x);}}if(Z.thrT>0){const k=Math.min(dt,Z.thrT)/.75;p.x+=Z.dir.x*Z.thrD*k;p.y+=Z.dir.y*Z.thrD*k;Z.thrT-=dt;p.inv=Math.max(p.inv,.3);if(SET.fx&&vR4()<.7)part(p.x,p.y,-Z.dir.x*300+vrnd4(-60,60),-Z.dir.y*300+vrnd4(-60,60),.4,C120.zero,2);}
    zbClamp(p,p.r);if(Z.t>=1.3&&!Z.mapStatic){Z.mapStatic=1;snd120('static');}
    if(Z.t>=1.8&&!Z.hint.ban){Z.hint.ban=1;Z.glitch=2.6;snd120('banner');radioLine('000',C120.zero,'…точка невозврата открыта. Не бойся. Это ещё не страшно…',.4);}
    if(Z.t>=2.8){Z.k='pick';Z.t=0;const K=briefK(50);G.mods={};computeStats();p.hp=G.st.maxHp;runBrief6(K);G.m=50;if(K>0)openLevelUp();}return;}
  if(Z.k==='pick'){zbClamp(p,p.r);if(G.state==='world'&&G.lvlQ<=0){Z.k='spawn';Z.t=0;snd120('rift',n.x);if(G.shock.length<60)G.shock.push({x:n.x,y:n.y,r:10,R:900,t:0,col:C120.white,slow:true});}return;}
  if(Z.k==='spawn'){zbClamp(p,p.r);zbCam(Z,dt);if(Z.t>=1.1&&!Z.boss)zbSpawnBoss(Z);if(Z.t>=1.9){Z.k='fight';Z.t=0;Z.spawnAtT=Z.T;Z.lastHp=p.hp;zbStageInit(Z,1);}return;}
  if(Z.k==='end'){zbEndTick(Z,dt);return;}
  if(Z.k==='choice'){if(Z.t>=1.4&&!Z.choiceOpen){Z.choiceOpen=1;zbOpenChoice(Z);}return;}
  // бой
  zbClamp(p,p.r);for(const e of G.enemies)if(e.alive&&(e.zb||e.zbEsc))zbClamp(e,e.r);
  zbTrailE(Z,dt);zbHitWatch(Z);
  if(Z.k==='seg'){if(Z.t>=3){Z.k='fight';Z.t=0;zbStageInit(Z,Z.stage+1);}zbShapeTick(Z,dt);zbBeatTick(Z,dt);zbCam(Z,dt);return;}
  zbShapeTick(Z,dt);zbBeatTick(Z,dt);
  Z.trailT+=dt;if(Z.trailT>=.1){Z.trailT=0;Z.trail.push({x:p.x,y:p.y});if(Z.trail.length>40)Z.trail.shift();}
  {const lx=Z.lpx,ly=Z.lpy;if(lx!==undefined&&Z.k==='fight'&&Z.lastHit&&G.t-Z.lastHit.t<.05&&!(Z.stage===3&&Z.neg.m!=='norm')&&Math.hypot(p.x-lx,p.y-ly)>90&&p.dashT<=0&&zbIn(Z,lx,ly,0)&&!zbIn(Z,p.x,p.y,30)){const c=zbCen(Z),th=Math.atan2(p.y-c.y,p.x-c.x),r=Math.max(40,zbRad(Z,th)-50);p.x=c.x+Math.cos(th)*r;p.y=c.y+Math.sin(th)*r;}Z.lpx=p.x;Z.lpy=p.y;}
  // стирание: вне фигуры (в негативе — внутри); в смене режима негатива — безопасно везде; во время морфа таймер стоит
  {const inS=zbIn(Z,p.x,p.y,0);const nm=Z.stage===3&&Z.k==='fight'?Z.neg.m:'norm';const bad=Z.k==='race'?!inS:nm==='neg'?inS:nm==='norm'?!inS:false;const D=zbDiffK();
    if(bad!==!!Z.out){Z.out=bad?1:0;snd120('edge',p.x);if(bad&&!Z.hint.out){Z.hint.out=1;floater(p.x,p.y-40,nm==='neg'?'ВНУТРИ ФИГУРЫ · СТИРАНИЕ ЧЕРЕЗ 1,5 С':'ВНЕ ФИГУРЫ · СТИРАНИЕ ЧЕРЕЗ 1,5 С',C120.red);}}
    if(bad&&p.hp>0&&!(Z.leaveT>0)){if(Z.shape.morph>=1)Z.outT+=dt;if(p.dashCd>0)p.dashCd=Math.min(p.dashCdMax||p.dashCd,p.dashCd+dt*.5);
      if(Z.outT>1.5){Z.lastAtk={n:'out',t:G.t};drain90(G.st.maxHp*D.drain*dt);Z.vig=Math.min(1,Z.vig+dt*2);if(!Z.erS||G.t-Z.erS>.6){Z.erS=G.t;snd120('out',p.x);}}}
    else{Z.outT=0;Z.vig=Math.max(0,Z.vig-dt*1.5);}}
  zbStageTick(Z,dt);zbCam(Z,dt);}
// кто снял корпус: для разбора гибели
function zbHitWatch(Z){const p=G.player;if(!p)return;if(p.hp<Z.lastHp-.01){let k='body';if(Z.lastAtk&&G.t-Z.lastAtk.t<.2)k=Z.lastAtk.n;else if(G.enemies.some(e=>e.alive&&e.zbEsc&&Math.hypot(e.x-p.x,e.y-p.y)<230))k='echo';else if(Z.lastShot&&G.t-Z.lastShot.t<4)k=Z.lastShot.n;Z.lastHit={n:k,t:G.t};}Z.lastHp=p.hp;}
function zbTrailE(Z,dt){const e=Z.boss;if(!e||!e.alive)return;Z.trailET+=dt;if(Z.trailET>=.045){Z.trailET=0;Z.trailE.push({x:e.x,y:e.y,f:Z.face});if(Z.trailE.length>7)Z.trailE.shift();}}
function zbCamZ(){const Z=G.zb;if(!G.world||!zbOn()||!Z)return 0;if(Z.k==='fight'||Z.k==='race'||Z.k==='seg'||Z.k==='spawn')return isMob()?(isPortrait()?1.2:1.22):1.22;return 0;}
function zbCam(Z,dt){const p=G.player;let bx,by;if(Z.k==='spawn'||(Z.k==='fight'&&Z.stage===1&&Z.T-Z.spawnAtT<2.2)){const n=zbNode();bx=clamp((n.x-p.x)*.55,-(W/2-170),W/2-170);by=clamp((n.y-p.y)*.55,-(H/2-150),H/2-150);}
  else if(Z.k==='end'&&Z.boss&&Z.boss.alive){const e=Z.boss;bx=(e.x-p.x)*.85;by=(e.y-p.y)*.85;}else{const e=Z.boss;if(!e||!e.alive)return;const dx=e.x-p.x,dy=e.y-p.y,mx=Math.max(60,W/2-130),my=Math.max(50,H/2-120);bx=clamp(dx*.45,-mx,mx);by=clamp(dy*.45+(dy<0?-30:0),-my,isMob()&&isPortrait()?Math.min(my,H*.06):my);}// в портрете низ экрана занят кнопками
  const tx=Z.sw.x+(bx-Z.sw.x)*Math.min(1,dt*3),ty=Z.sw.y+(by-Z.sw.y)*Math.min(1,dt*3);Z.sw.x=tx;Z.sw.y=ty;CX+=tx;CY+=ty;Z.sw.on=1;}
// снять смещение камеры перед camFollow (оно добавляется заново в zbCam / zbAmbTick)
function zbCamPre(){const Z=G.zb;if(Z&&Z.sw&&Z.sw.on){CX-=Z.sw.x;CY-=Z.sw.y;Z.sw.on=0;}const A=G.zbAmb;if(A&&A.sw&&A.sw.on){CX-=A.sw.x;CY-=A.sw.y;A.sw.on=0;}}
function zbSpawnBoss(Z){const n=zbNode();{const p=G.player,S=Z.shape;S.kind='circle';S.s=ZB_BAND[1][1];S.a=0;S.prev=null;S.morph=1;S.next=null;S.type='E';S.c=zbFitC(p.x,p.y,S.s*1.12);}const e=spawnEnemy('zero000',n.x,n.y+8,{noAffix:true,noCap95:true,noSec:true,zb:1,spawnT:.8,inv:0});e.hp=e.maxHp=1e9;e.cg95=G.t+1.2;e.contact=0;Z.boss=e;
  if(typeof REC!=='undefined'&&REC.seen&&!REC.seen.includes('zero000'))REC.seen.push('zero000');
  explode(n.x,n.y,C120.zero,30,1.4);trauma90(.5);shake(14);snd120('rift',n.x);}
function zbSpd(Z){return G.st.speed||300;}
// он — ваша копия: прочность сегмента растёт с вашей огневой мощью (норма 140 урона/с → ×1; границы ×0,75…×2,2)
function zbDpsK(){const st=G.st;if(!st)return 1;const dps=st.dmg*st.shots*st.shotK/Math.max(.05,st.rate)+(st.drones||0)*6*(MODS.cal.v[G.mods.cal||0]||1)/.6;return clamp(dps/140,.75,2.2);}
// --- ИИ босса ---
function zbAI(e,dt,o){const Z=G.zb;if(!zbOn()||!zbF()){e.vx*=.9;e.vy*=.9;return;}const p=G.player;
  if(e.zb===2){zbCloneAI(Z,e,dt);return;}
  if(Z.k==='seg'||Z.stall>0){e.vx*=.86;e.vy*=.86;if(Z.stall>0)Z.stall-=dt;return;}
  if(Z.lunge>0){if(Z.k==='fight'&&!(Z.stage===3&&Z.neg.m==='neg')&&!zbIn(Z,e.x+e.vx*.05,e.y+e.vy*.05,40)){e.vx*=.3;e.vy*=.3;}// бросок гаснет у кромки
    Z.lunge-=dt;if(Z.lunge<=0){Z.lunge=0;e.contact=0;if(G.shock.length<60)G.shock.push({x:e.x,y:e.y,r:10,R:110,t:0,col:C120.rose,thin:true});
    if(Z.chain>0){Z.chain--;e.vx*=.15;e.vy*=.15;Z.lungeCool=0;zbDashTg(Z,.7,0);return;}if(Z.chainLock)Z.chainLock=0;
    if(Z.after==='fan'){Z.after=0;e.vx*=.2;e.vy*=.2;const a=Math.atan2(p.y-e.y,p.x-e.x);tg95({k:'cone',zb:1,nm:'dashfan',x:e.x,y:e.y,a,arc:1.0,len:700,T:.6,dmg:0,noHit:true,col:C120.rose,src:e,snd:'tlCone',track:(o)=>{o.x=e.x;o.y=e.y;if(o.t<o.T-.2)o.a=Math.atan2(p.y-e.y,p.x-e.x);},on:o=>zbFanShot(Z,e,o.a,'dashfan',0)});}
    if(Z.lungeCool>0){zbCoolStart(Z,Z.lungeCool+(Z.after===0&&Z.seq[Z.seq.length-1]==='dashfan'?.4:0));Z.lungeCool=0;}}return;}
  if(Z.stun>0){e.vx*=.9;e.vy*=.9;Z.face+=dt*2.4;return;}
  if(Z.cool>0||Z.wind>0||Z.stance>0){e.vx*=.86;e.vy*=.86;if(Z.stance>0)Z.face=Z.stanceA;if(Z.k==='fight'&&!(Z.stage===3&&Z.neg.m==='neg')&&!zbIn(Z,e.x,e.y,20)){const q=zbInside(Z,e.x,e.y,.8);steer(e,q.x-e.x,q.y-e.y,zbSpd(Z)*.8,dt,4);}return;}
  const spd=zbSpd(Z);let tx=p.x,ty=p.y,k=3,sp=spd;
  if(Z.k==='race'){const n=zbNode();tx=n.x;ty=n.y;sp=spd*(Z.cycles?.85:.92);steer(e,tx-e.x,ty-e.y,sp,dt,4);zbFaceVel(Z,e);return;}
  const c=zbCen(Z);
  switch(Z.stage){
    case 1:{// зеркальная точка игрока через центр фигуры, на расстоянии 260–440
      let m=zbInside(Z,2*c.x-p.x,2*c.y-p.y,.86);let dx=m.x-p.x,dy=m.y-p.y,d=Math.hypot(dx,dy);
      if(d<1){dx=e.x-p.x;dy=e.y-p.y;d=Math.hypot(dx,dy)||1;}
      if(d>ZB_MIRMAX)m={x:p.x+dx/d*ZB_MIRMAX,y:p.y+dy/d*ZB_MIRMAX};else if(d<ZB_MIRMIN)m={x:p.x+dx/d*ZB_MIRMIN,y:p.y+dy/d*ZB_MIRMIN};
      tx=m.x;ty=m.y;sp=spd*1.2;k=5;const dd=Math.hypot(tx-e.x,ty-e.y);if(dd<14){e.vx*=.7;e.vy*=.7;return;}if(dd<120)sp*=dd/120;break;}
    case 2:{// кружит у стола на 0,75 радиуса; иногда меняет направление
      Z.orbT-=dt;if(Z.orbT<=0){Z.orbT=rnd(6,9);Z.orbDir*=-1;}
      if(!Z.orbInit){Z.orbInit=1;Z.orbA=Math.atan2(e.y-c.y,e.x-c.x);}
      const ro=zbRad(Z,Z.orbA)*.75;Z.orbA+=Z.orbDir*(190/Math.max(200,ro))*dt;tx=c.x+Math.cos(Z.orbA)*ro;ty=c.y+Math.sin(Z.orbA)*ro;sp=spd*.95;k=4;break;}
    case 3:{if(Z.neg.m==='neg'){// выходит наружу: кружит за кромкой рядом с игроком, в 260 от него
        const pa=Math.atan2(p.y-c.y,p.x-c.x),ea=Math.atan2(e.y-c.y,e.x-c.x),dir=Z.orbDir||1;let goal=pa+.6*(angDiff(ea,pa)>=0?1:-1);if(Math.abs(angDiff(ea,pa))<.35)goal=pa+.6*dir;
        const a=ea+clamp(angDiff(goal,ea),-.5,.5),rr=zbRad(Z,a)+150,bx=zbBox();tx=clamp(c.x+Math.cos(a)*rr,bx[0]+40,bx[2]-40);ty=clamp(c.y+Math.sin(a)*rr,bx[1]+40,bx[3]-40);sp=spd*.95;}
      else{Z.orbA+=dt*.5;const r=zbRad(Z,Z.orbA)*.22;tx=c.x+Math.cos(Z.orbA)*r;ty=c.y+Math.sin(Z.orbA)*r;sp=spd*.8;if(Math.hypot(tx-e.x,ty-e.y)<12){e.vx*=.7;e.vy*=.7;return;}}break;}
    case 4:{Z.chaseT-=dt;if(Z.chaseT<=0){Z.chaseT=2;Z.chase=Z.chase==='intercept'?'embrace':'intercept';}
      if(Z.chase==='intercept'){tx=p.x+p.vx*.6;ty=p.y+p.vy*.6;sp=spd*1.0;}else{Z.orbA+=dt*1.3;const r=Math.max(180,Math.hypot(p.x-e.x,p.y-e.y)*.8);tx=p.x+Math.cos(Z.orbA)*r;ty=p.y+Math.sin(Z.orbA)*r;sp=spd*1.05;}
      {const d=Math.hypot(p.x-e.x,p.y-e.y);if(d<170&&Math.hypot(tx-p.x,ty-p.y)<220){e.vx*=.85;e.vy*=.85;return;}}break;}}
  if(!(Z.stage===3&&Z.neg.m==='neg')){const q=zbInside(Z,tx,ty,.88);tx=q.x;ty=q.y;if(!zbIn(Z,e.x,e.y,0))sp*=2;}// он держится внутри фигуры (кроме негатива)
  steer(e,tx-e.x,ty-e.y,sp,dt,k);zbFaceTurn(Z,e,dt);}
function zbFaceVel(Z,e){const v=Math.hypot(e.vx,e.vy);if(v>60)Z.face=Math.atan2(e.vy,e.vx);}
// он смотрит на игрока, но поворачивается с задержкой: корму можно обойти — кругом или рывком вбок
const ZB_TURN=[0,1.1,1.2,1.1,1.3];
function zbFaceTurn(Z,e,dt){const p=G.player;if(!p)return;const d=G.save&&G.save.diff;const k=d==='hard'?1.15:d==='easy'?.85:1;const a=Math.atan2(p.y-e.y,p.x-e.x),w=(ZB_TURN[Z.stage]||1.1)*k*dt;Z.face+=clamp(angDiff(a,Z.face),-w,w);}
function zbDmg(d){return Math.round(d*zbDiffK().dmg);}
function zbCoolStart(Z,T){Z.cool=Math.max(Z.cool,T);if(!Z.hint.cool){Z.hint.cool=1;const e=Z.boss;zbFl(e,24,'ОСТЫВАЕТ · ×1,5',C120.white);}snd120('cool',Z.boss?Z.boss.x:undefined);}
// --- дирижёр атак: бюджет угроз, лёгкие/крупные, без тройных повторов, крупных нет во время выдоха ---
function zbPool(Z){const T=Z.T-Z.stT;switch(Z.stage){
  case 1:return T<8?['dash','fan','burst']:['dash','fan','burst','repeat','pulse'];
  case 2:return T<10?['dash','fan','burst','pulse','mines']:['dash','dashfan','fan','burst','pulse','mines','blink'];
  case 3:return Z.neg.m==='neg'?['dash','fan']:['fan2','beam','mines','star','dashfan','burst','dash','blink','tridash'];
  case 4:return ['dashfan','fan2','beam','star','repeat','mines','burst','dash','grid','tridash','blink'];}return ['fan'];}
function zbBossTg(){return (G.wtg95||[]).filter(o=>o.zb&&!o.sub&&o.st==='warn').length;}
function zbConduct(Z,dt){const e=Z.boss,p=G.player;if(Z.k!=='fight'||!e||!e.alive||e.spawnT>0)return;
  if(Z.stun>0||Z.cool>0||Z.lunge>0||Z.stance>0||Z.novaT>0||Z.mineDrop>0||Z.chainLock)return;
  if(Z.stage===3&&(Z.neg.m==='tg'||Z.neg.m==='back'))return;
  if(Z.stage===3&&Z.neg.m==='norm'&&Z.neg.t>=7.1)return;// перед негативом — тишина, чтобы мир успел вывернуться
  Z.atkT-=dt*(zbEchoAlive()>=2?.8:1);if(Z.atkT>0)return;
  if(Z.stage===4&&!Z.onBeat)return;// у кнопки атаки стартуют на ударе сердца
  const D=zbDiffK(),act=zbBossTg();if(act>=D.budget){Z.atkT=.3;return;}
  const S=Z.shape,exhale=(S.next&&S.next.type==='S')||(S.morph<1&&S.type==='S');
  const d=Math.hypot(p.x-e.x,p.y-e.y);
  let pool=zbPool(Z).filter(k=>!((exhale||Z.wind>0)&&ZB_ATK[k].big));if(Z.wind>0)pool=pool.filter(k=>k!=='mines');
  if(d>=360)pool=pool.filter(k=>k!=='pulse');
  if(Z.mines.length>=5)pool=pool.filter(k=>k!=='mines');
  if(Z.light>=2){const b=pool.filter(k=>ZB_ATK[k].big);if(b.length)pool=b;}
  const L=Z.seq;if(L.length>=2&&L[L.length-1]===L[L.length-2])pool=pool.filter(k=>k!==L[L.length-1]);
  if(Z.stage===3&&!Z.used.beam&&pool.includes('beam')){if(act>0){Z.atkT=.3;return;}pool=['beam'];}// новое — отдельно
  if(!pool.length){Z.atkT=.4;return;}
  const w=pool.map(k=>(k==='pulse'?(d<260?3:1.4):k==='dash'?(d>300?2:1):k==='beam'?(d>380?2:1):1)*(Z.seq.includes(k)?.35:1)*(Z.used[k]?1:2.5));let sum=w.reduce((a,b)=>a+b,0),r=Math.random()*sum,k=pool[0];for(let i=0;i<pool.length;i++){r-=w[i];if(r<=0){k=pool[i];break;}}
  zbAtk(Z,k);Z.seq.push(k);if(Z.seq.length>4)Z.seq.shift();Z.light=ZB_ATK[k].big?0:Z.light+1;
  Z.atkT=ZB_TEMPO[Z.stage]*D.tempo*(Z.rage?.8:1)*rnd(.88,1.12);}
function zbLead(t){const p=G.player;if(p.dashT>0)return {x:p.x,y:p.y};const vx=p.vx||0,vy=p.vy||0,v=Math.hypot(vx,vy),k=v>420?420/v:1;return {x:p.x+vx*k*t,y:p.y+vy*k*t};}
function zbFl(e,dy,txt,col){const Z=G.zb;if(!Z||!e)return;const L=Z.fl||(Z.fl=[]);for(let i=L.length-1;i>=0;i--)if(G.t-L[i].t>2.5)L.splice(i,1);const key=String(txt).split(' · ')[0];if(L.some(q=>q.k===key))return;const n=L.filter(q=>G.t-q.t<1.1).length;floater(e.x,e.y-e.r-16-n*15,txt,col);L.push({t:G.t,k:key});}
const ZBL=new Map();
function zbLabel(x,y,text,col){if(/\d/.test(text)||typeof ctx.getTransform!=='function'){worldLabel(x,y,text,col);return;}const fs=fpx(11),sc=Math.max(.5,Math.round(ctx.getTransform().a*4)/4),key=text+'|'+col+'|'+fs+'|'+sc;let L=ZBL.get(key);
  if(!L){const font='700 '+fs+'px "JetBrains Mono",monospace';ctx.font=font;const tw=ctx.measureText(text).width,w=tw+6,h=fs*1.7;const c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(w*sc));c.height=Math.max(1,Math.ceil(h*sc));const g=c.getContext('2d');g.scale(sc,sc);g.font=font;g.textAlign='center';g.fillStyle='#04060c';g.fillText(text,w/2+1,fs*1.25+1);g.fillStyle=col;g.fillText(text,w/2,fs*1.25);L={c,w,h,fs};if(ZBL.size>=96)ZBL.delete(ZBL.keys().next().value);ZBL.set(key,L);}
  ctx.drawImage(L.c,x-L.w/2,y-L.fs*1.25,L.w,L.h);}
function zbFirst(Z,k){if(Z.used[k])return;Z.used[k]=1;const e=Z.boss;zbFl(e,34,ZB_ATK[k].n,C120.white);}
// атаки через телеграфы 0.9.5 (в мире — G.wtg95); у каждого телеграфа zb:1 и имя для разбора гибели
function zbAtk(Z,kind){const e=Z.boss,p=G.player;if(!e||!e.alive||!p)return;const a=Math.atan2(p.y-e.y,p.x-e.x);zbFirst(Z,kind);
  if(kind==='dashfan'){Z.after='fan';kind='dash';}else Z.after=0;
  if(kind==='star'){const r=300;Z.wind=1.0;tg95({k:'zone',zb:1,nm:'star',x:e.x,y:e.y,r,T:1.0,dmg:zbDmg(13),col:C120.rose,src:e,kb:220,snd:'tlZone',track:(o)=>{o.x=e.x;o.y=e.y;},on:o=>{Z.lastAtk={n:'star',t:G.t};Z.wind=0;if(G.shock.length<60)G.shock.push({x:e.x,y:e.y,r:20,R:r,t:0,col:C120.white});snd120('pulse',e.x);zbRing(Z,e.x,e.y,r*1.15,C120.rose,.55,18);zbShards(Z,e.x,e.y,10,C120.rose,420);zbKick(Z,.45);
      const a0=Math.atan2(p.y-e.y,p.x-e.x)+Math.PI/12;for(let i=0;i<12;i++){const b=shootE(e.x,e.y,a0+i*TAU/12,250,zbDmg(8),C120.rose,6);if(b)b.zbN='star';}Z.lastShot={n:'star',t:G.t};zbCoolStart(Z,1.2);}});return;}
  if(kind==='tridash'){Z.chain=2;Z.chainLock=1;zbDashTg(Z,.9,0);return;}
  if(kind==='dash'){zbDashTg(Z,.9,Z.stage>=2);}
  else if(kind==='fan'||kind==='fan2'){
    tg95({k:'cone',zb:1,nm:kind,x:e.x,y:e.y,a,arc:1.0,len:700,T:.8,dmg:0,noHit:true,col:C120.rose,src:e,snd:'tlCone',track:(o)=>{o.x=e.x;o.y=e.y;if(o.t<o.T-.25){const q=zbLead(Math.min(.55,Math.hypot(p.x-e.x,p.y-e.y)/350*.6+(o.T-o.t-.25)));o.a=Math.atan2(q.y-e.y,q.x-e.x);}},
      on:o=>{zbFanShot(Z,e,o.a,kind,0);if(kind==='fan2')tg95({k:'cone',zb:1,sub:1,nm:'fan2',x:e.x,y:e.y,a:o.a+.075,arc:1.0,len:700,T:.6,dmg:0,noHit:true,col:C120.rose,src:e,snd:false,track:(q)=>{q.x=e.x;q.y=e.y;},on:q=>zbFanShot(Z,e,q.a,'fan2',1)});}});}
  else if(kind==='pulse'){const r=300;Z.wind=1.0;tg95({k:'zone',zb:1,nm:'pulse',x:e.x,y:e.y,r,T:1.0,dmg:zbDmg(14),col:C120.rose,src:e,kb:200,snd:'tlZone',track:(o)=>{o.x=e.x;o.y=e.y;},on:o=>{Z.lastAtk={n:'pulse',t:G.t};Z.wind=0;if(G.shock.length<60)G.shock.push({x:e.x,y:e.y,r:20,R:r,t:0,col:C120.white});snd120('pulse',e.x);zbRing(Z,e.x,e.y,r*1.15,C120.rose,.55,18);zbShards(Z,e.x,e.y,10,C120.rose,420);zbKick(Z,.45);zbCoolStart(Z,1.0);}});}
  else if(kind==='beam'){const L=1150;Z.stance=1.3;Z.stanceA=a;snd120('stance',e.x);if(!Z.hint.stance){Z.hint.stance=1;zbFl(e,48,'ЩИТ СПЕРЕДИ · ЗАХОДИТЕ СБОКУ ×2',C120.white);}
    tg95({k:'line',zb:1,nm:'beam',x:e.x,y:e.y,x2:e.x+Math.cos(a)*L,y2:e.y+Math.sin(a)*L,w:50,T:1.3,dmg:zbDmg(14),col:C120.white,src:e,snd:'tlLine',
      track:(o,dt)=>{o.x=e.x;o.y=e.y;const c=Math.atan2(o.y2-o.y,o.x2-o.x);let n=c;if(o.t<o.T-.3){const b=Math.atan2(p.y-o.y,p.x-o.x);n=c+clamp(angDiff(b,c),-.4*dt,.4*dt);}o.x2=o.x+Math.cos(n)*L;o.y2=o.y+Math.sin(n)*L;Z.stanceA=n;Z.face=n;},
      on:o=>{Z.lastAtk={n:'beam',t:G.t};snd120('beam',e.x);Z.beamFx={x:o.x,y:o.y,x2:o.x2,y2:o.y2,t:.35};Z.stance=0;zbCoolStart(Z,1.5);}});}
  else if(kind==='repeat'){const T=Z.trail,n=T.length;if(n<17){Z.atkT=.5;return;}let first=1;for(const age of [16,13,10,7,4]){const q=T[n-1-age];if(!q)continue;tg95({k:'zone',zb:1,sub:first?0:1,nm:'repeat',x:q.x,y:q.y,r:70,T:.9,dmg:zbDmg(10),col:C120.zero,snd:first?'tlZone':false,on:o=>{Z.lastAtk={n:'repeat',t:G.t};if(G.shock.length<60)G.shock.push({x:o.x,y:o.y,r:10,R:70,t:0,col:C120.rose});}});first=0;}
    snd120('repeat',e.x);if(!Z.hint.rep){Z.hint.rep=1;floater(p.x,p.y-52,'ОН ПОВТОРЯЕТ ВАШ СЛЕД',C120.zero);}}
  else if(kind==='mines'){Z.mineDrop=3;Z.mineDT=0;}
  else if(kind==='burst'){Z.burst={n:Z.stage>=3?4:3,t:.6};snd95('tlCone',e.x);}
  else if(kind==='blink'){const ba=Math.atan2(e.y-p.y,e.x-p.x)+(Math.random()<.5?-1:1)*rnd(.9,1.4);let d=null;for(const sg of [1,-1,1]){const a2=sg>0?ba:ba+Math.PI;let q={x:p.x+Math.cos(a2)*310,y:p.y+Math.sin(a2)*310};q=zbInside(Z,q.x,q.y,.82);const dd=Math.hypot(q.x-p.x,q.y-p.y);if(!d||Math.abs(dd-310)<Math.abs(Math.hypot(d.x-p.x,d.y-p.y)-310))d=q;if(dd>=250&&dd<=380)break;}// метка — не вплотную и не за полэкранаZ.wind=.6;
    tg95({k:'zone',zb:1,nm:'blink',x:d.x,y:d.y,r:80,T:.6,dmg:zbDmg(10),col:C120.ice,kb:120,snd:'tlZone',on:o=>{zbFx(Z,{k:'blinkLine',x:e.x,y:e.y,x2:o.x,y2:o.y,t:0,T:.35});zbShards(Z,e.x,e.y,8,C120.zero,260);if(G.shock.length<60)G.shock.push({x:e.x,y:e.y,r:60,R:4,t:0,col:C120.ice,thin:true});
      e.x=o.x;e.y=o.y;e.vx=e.vy=0;Z.face=Math.atan2(p.y-e.y,p.x-e.x);Z.wind=0;Z.lastAtk={n:'blink',t:G.t};snd120('rift',e.x);trauma90(.15);if(G.shock.length<60)G.shock.push({x:e.x,y:e.y,r:10,R:160,t:0,col:C120.ice});if(SET.fx)explode(e.x,e.y,C120.ice,16,.9);Z.burst={n:3,t:.6};}});}
  else if(kind==='grid'){const th=Math.atan2(p.y-e.y,p.x-e.x),nx=-Math.sin(th),ny=Math.cos(th),L=1700;Z.wind=1.4;let first=1;
    for(const k of [0,-1,1,-2,2]){const cx=p.x+nx*k*240,cy=p.y+ny*k*240,T=1.1+Math.abs(k)*.15;tg95({k:'line',zb:1,sub:first?0:1,nm:'grid',x:cx-Math.cos(th)*L/2,y:cy-Math.sin(th)*L/2,x2:cx+Math.cos(th)*L/2,y2:cy+Math.sin(th)*L/2,w:56,T,dmg:zbDmg(13),col:C120.red,snd:first?'tlLine':false,
      on:o=>{Z.lastAtk={n:'grid',t:G.t};zbFx(Z,{k:'scorch',x:o.x,y:o.y,x2:o.x2,y2:o.y2,t:0,T:.7,col:C120.red});if(k===2||k===-2){Z.wind=0;zbCoolStart(Z,1.4);}snd120('beam',o.x);}});first=0;}}}
function zbDashTg(Z,T,ghost){const e=Z.boss,p=G.player,L=760;const a=Math.atan2(p.y-e.y,p.x-e.x);Z.wind=T;
    tg95({k:'line',zb:1,nm:Z.chainLock?'tridash':'dash',x:e.x,y:e.y,x2:e.x+Math.cos(a)*L,y2:e.y+Math.sin(a)*L,w:76,T,dmg:zbDmg(15),col:Z.chainLock?C120.red:C120.zero,src:e,kb:140,snd:'tlLine',
      track:(o,dt)=>{o.x=e.x;o.y=e.y;const c=Math.atan2(o.y2-o.y,o.x2-o.x);let n=c;if(o.t<o.T-.3){const q=zbLead(Math.min(.45,o.T-o.t+.15)),b=Math.atan2(q.y-o.y,q.x-o.x);n=c+clamp(angDiff(b,c),-1.5*dt,1.5*dt);}o.x2=o.x+Math.cos(n)*L;o.y2=o.y+Math.sin(n)*L;Z.face=n;},
      on:o=>{const c=Math.atan2(o.y2-o.y,o.x2-o.x);Z.lastAtk={n:Z.chainLock?'tridash':'dash',t:G.t};zbClean(Z,o);e.vx=Math.cos(c)*1500;e.vy=Math.sin(c)*1500;Z.face=c;Z.lunge=.42;Z.lungeCool=Z.chainLock?(Z.chain>0?0:1.8):Z.stage>=2?1.4:1.2;Z.wind=0;snd120('dash',e.x);
        zbFx(Z,{k:'streak',x:o.x,y:o.y,x2:o.x+Math.cos(c)*630,y2:o.y+Math.sin(c)*630,t:0,T:.4,col:Z.chainLock?C120.red:C120.zero});
        if(ghost){for(const [T2,w] of [[.6,60],[.95,60]])tg95({k:'line',zb:1,sub:1,nm:'ghost',x:o.x,y:o.y,x2:o.x2,y2:o.y2,w,T:T2,dmg:zbDmg(9),col:C120.rose,snd:false,on:q=>{Z.lastAtk={n:'ghost',t:G.t};Z.ghostFx={x:q.x,y:q.y,x2:q.x2,y2:q.y2,t:.4};}});}}});}
function zbFanShot(Z,e,a,kind,off){const n=kind==='clone'?3:7,st=kind==='clone'?.2:.15;for(let i=0;i<n;i++){const b=shootE(e.x,e.y,a+(i-(n-1)/2)*st,kind==='clone'?320:350,zbDmg(kind==='clone'?6:8),C120.rose,5);if(b)b.zbN=kind;}Z.lastShot={n:kind==='clone'?'clone':kind,t:G.t};snd120('fan',e.x);}
// чистое уклонение: рывок сквозь бросок в последний момент
function zbClean(Z,o){const p=G.player;if(p.dashT>0&&tgHit95(o,p.x,p.y,p.r+24)){zbStg(Z,20);if(G.shock.length<60)G.shock.push({x:p.x,y:p.y,r:10,R:90,t:0,col:C120.mint});floater(p.x,p.y-40,'ЧИСТО · +СБОЙ',C120.mint);zbRing(Z,p.x,p.y,120,C120.mint,.4,10);snd120('clean',p.x);}}
// --- сбой ---
function zbStg(Z,v){if(Z.stun>0||Z.stgLock>0||Z.k!=='fight'||!(v>0))return;Z.stg=Math.min(100,Z.stg+v);Z.stgT=G.t;if(Z.stg>=100)zbStun(Z);}
function zbStun(Z){const e=Z.boss;zbRing(Z,e.x,e.y,260,C120.white,.6,16);zbRing(Z,e.x,e.y,160,C120.warm,.45,8);zbShards(Z,e.x,e.y,14,C120.white,380);zbKick(Z,.7);e.contact=0;Z.stun=3;Z.stg=0;Z.stgLock=4.5;Z.nStun++;Z.after=0;Z.chain=0;Z.chainLock=0;Z.cool=0;Z.stance=0;Z.wind=0;Z.lunge=0;Z.lungeCool=0;Z.mineDrop=0;e.vx*=.2;e.vy*=.2;G.wtg95=(G.wtg95||[]).filter(o=>!(o.zb&&o.st==='warn'&&o.src===e));
  slow95(.15,.15);trauma90(.35);shake(8);snd120('stun',e.x);zbFl(e,20,'СБОЙ · ×2,5 · 3 С',C120.white);Z.plateFx=1;if(SET.fx)explode(e.x,e.y,C120.white,18,.9);}
// --- стадии ---
function zbStageInit(Z,n){const p=G.player,e=Z.boss;Z.stage=n;Z.stT=Z.T;Z.segMax=Math.round(Z.segBase*(ZB_SEGK[n]||1)*zbDpsK());Z.hp=Z.segMax;Z.shrink=1;Z.stall=0;Z.lunge=0;Z.lungeCool=0;Z.cool=0;Z.wind=0;Z.stance=0;Z.stun=0;Z.stg=0;Z.stgLock=0;
  Z.atkT=n===1?3:2.2;Z.after=0;Z.seq=[];Z.light=0;Z.mines=[];Z.frags=[];Z.sing=null;Z.mineDrop=0;Z.count=15;Z.novaT=0;Z.hands=null;Z.neg={m:'norm',t:0};Z.orbInit=0;Z.cloneDone=0;Z.cloneRe=0;Z.stars=[];Z.lines=[];Z.br={i:0};Z.chain=0;Z.chainLock=0;Z.rage=0;Z.rifts=[];Z.echoT=n===1?11:6;Z.sats=[];Z.satRe=0;for(let i=0;i<[0,0,1,2,2][n];i++)Z.sats.push(zbSatNew(Z,i));
  for(const c of Z.clones)c.alive=false;Z.clones=[];
  if(e){e.ghost=false;e.zbHide=0;e.deflT=0;e.contact=0;}
  if(n>1){zbNextShape(Z,true);}else{Z.shape.hold=zbDiffK().hold;}
  Z.warpT=1;const st=ZST[n];banner('СТАДИЯ '+n+' · '+st.n,st.hint);radioLine('000',C120.zero,st.r,1.2);snd120('stage');
  if(n===2){const a0=rnd(0,TAU);Z.hands={a:[a0,a0+Math.PI],t:8.2,cd:0};}
  if(n===4){Z.chase='intercept';Z.chaseT=2;const names=mercy110().slice(0,6);const nd=zbNode();Z.stars=names.map((nm,i)=>({name:nm,i,x:nd.x+Math.cos(i/Math.max(1,names.length)*TAU+.7)*560,y:nd.y+Math.sin(i/Math.max(1,names.length)*TAU+.7)*560,cd:1.5+i*.4}));Z.thirdOK=Z.stars.length>=3;if(Z.stars.length)snd120('ally');}
  G.calm=0;}
function zbSegDone(Z){const st=Z.stage;{const e=Z.boss;if(e&&e.alive){for(const [R_,T_,c_] of [[900,.9,C120.white],[600,.7,C120.zero],[320,.5,C120.warm]])zbRing(Z,e.x,e.y,R_,c_,T_,22);zbShards(Z,e.x,e.y,30,C120.ice,700);Z.chromT=.5;zbKick(Z,1);}}Z.seg[st-1]=0;Z.hp=0;Z.flash=1;Z.k='seg';Z.t=0;snd120('seg');slow95(.3,.08);trauma90(.3);shake(10);runLvlSeg6();G.wtg95=[];
  Z.stun=0;Z.cool=0;Z.stance=0;Z.wind=0;Z.mines=[];Z.frags=[];Z.sing=null;Z.mineDrop=0;for(const c of Z.clones)c.alive=false;Z.clones=[];Z.plateBreak=1;Z.sats=[];Z.rifts=[];Z.chain=0;Z.chainLock=0;for(const q of G.enemies)if(q.alive&&q.zbEsc){q.alive=false;q.zbGone=1;if(SET.fx)explode(q.x,q.y,C120.ice,10,.7);}{const e=Z.boss;if(e){zbShards(Z,e.x,e.y,16,C120.ice,420);Z.chromT=.5;}}
  const e=Z.boss;if(e){if(G.shock.length<60)G.shock.push({x:e.x,y:e.y,r:20,R:700,t:0,col:C120.white});if(SET.fx)explode(e.x,e.y,C120.rose,24,1.2);}
  {const p=G.player;Z.stun=Math.max(Z.stun||0,1.5);floater(p.x,p.y-44,'СЕГМЕНТ '+st+'/4 СНЯТ · ОН ОГЛУШЁН',C120.white);}
  if(st>=ZB_N){zbWinRace(Z);}}
function zbBurstTick(Z,dt){const B=Z.burst,e=Z.boss,p=G.player;if(!B)return;if(Z.stun>0||Z.k!=='fight'){Z.burst=null;return;}B.t-=dt;if(B.t>0)return;
  const d=Math.hypot(p.x-e.x,p.y-e.y),lt=p.dashT>0?0:Math.min(.35,d/380),ax=p.x+(p.vx||0)*lt*.6,ay=p.y+(p.vy||0)*lt*.6;const b=shootE(e.x,e.y,Math.atan2(ay-e.y,ax-e.x),380,zbDmg(8),C120.zero,6);if(b)b.zbN='burst';Z.lastShot={n:'burst',t:G.t};snd120('fan',e.x);B.n--;B.t=.16;if(B.n<=0)Z.burst=null;}
// --- спутники: осколки сброшенных пластин кружат вокруг него и постреливают; таран, импульс или пуля их сбивают ---
function zbSatNew(Z,i){return {a:i*Math.PI,hp:Math.max(60,Math.round(Z.segMax*.012)),fireT:2.4+i*1.6,fl:0,x:0,y:0};}
function zbSatTick(Z,dt){const e=Z.boss,p=G.player;if(!e||!e.alive)return;if(!Z.sats.length&&[0,0,1,2,2][Z.stage]){Z.satRe+=dt;if(Z.satRe>=15){Z.satRe=0;for(let i=0;i<[0,0,1,2,2][Z.stage];i++)Z.sats.push(zbSatNew(Z,i));zbFl(e,16,'СПУТНИКИ ВЕРНУЛИСЬ · ТАРАН, ИМПУЛЬС ИЛИ ЗАРЯД',C120.ice);}return;}
  if(Z.sats.length&&!Z.hint.sats&&Z.k==='fight'){Z.hint.sats=1;zbFl(e,16,'СПУТНИКИ · ТАРАН, ИМПУЛЬС ИЛИ ЗАРЯД',C120.ice);}
  for(const s of Z.sats){s.a+=dt*1.3;s.x=e.x+Math.cos(s.a)*(e.r+48);s.y=e.y+Math.sin(s.a)*(e.r+48);if(s.fl>0)s.fl-=dt;
    if(Z.k==='fight'&&Z.stun<=0){s.fireT-=dt;if(s.fireT<=0){s.fireT=3.2;const b=shootE(s.x,s.y,Math.atan2(p.y-s.y,p.x-s.x),230,zbDmg(6),C120.ice,5);if(b)b.zbN='sat';Z.lastShot={n:'sat',t:G.t};if(SET.fx)part(s.x,s.y,0,0,.25,C120.ice,4);}}
    for(const b of G.pb){if(b.life<=0||!b.charged||Math.hypot(b.x-s.x,b.y-s.y)>24)continue;s.hp=0;s.fl=.08;}// обычные пули проходят сквозь: сбить можно тараном, импульсом или зарядом
    if(p.dashT>0&&Math.hypot(p.x-s.x,p.y-s.y)<p.r+22)s.hp=0;
    if(s.hp<=0&&!s.dead){s.dead=1;zbStg(Z,10);p.en=Math.min(100,(p.en||0)+12);zbShards(Z,s.x,s.y,10,C120.ice,300);snd120('cloneDie',s.x);floater(s.x,s.y-24,'СПУТНИК · +СБОЙ',C120.ice);}}
  if(Z.sats.some(s=>s.dead))Z.sats=Z.sats.filter(s=>!s.dead);}
function zbSatPulse(Z,p,R){for(const s of Z.sats||[])if(Math.hypot(s.x-p.x,s.y-p.y)<R)s.hp=0;}
// --- эхо прошлых секторов: враги из уже пройденных миссий выходят из разломов у кромки ---
const ZB_ECHO=[null,['scout','gunner','mirror'],['lancer','rammer','cutter','shielder'],['phantom','moth','frost','shocker'],['boarder','cadet','hunter','twin']];
function zbEchoCap(){const d=G.save&&G.save.diff;return d==='hard'?5:d==='easy'?3:4;}
function zbEchoAlive(){let n=0;for(const e of G.enemies)if(e.alive&&e.zbEsc)n++;return n;}
function zbEchoWave(Z,n){const c=zbCen(Z),p=G.player;if(!p)return;const k=Math.min(n,zbEchoCap()-zbEchoAlive()-(Z.rifts||[]).filter(r=>!r.done).length);if(k<=0)return;
  const L=ZB_ECHO[Z.stage]||ZB_ECHO[1],base=Math.atan2(p.y-c.y,p.x-c.x)+Math.PI;
  for(let i=0;i<k;i++){const a=base+(i-(k-1)/2)*.6,r=zbRad(Z,a)*.86;Z.rifts.push({x:c.x+Math.cos(a)*r,y:c.y+Math.sin(a)*r,t:0,T:1.2,tp:L[(Math.random()*L.length)|0]});}
  if(!Z.hint.echo){Z.hint.echo=1;banner('ЭХО ПРОШЛЫХ СЕКТОРОВ','ОНИ ВЫХОДЯТ ИЗ РАЗЛОМОВ · УБИТОЕ ЭХО — ЭНЕРГИЯ И СБОЙ');}snd120('rift',c.x);}
function zbEchoTick(Z,dt){const p=G.player;if(Z.k!=='fight')return;
  if(Z.echoT>0){Z.echoT-=dt;if(Z.echoT<=0)zbEchoWave(Z,[0,2,2,2,3][Z.stage]||2);}
  for(const r of Z.rifts){r.t+=dt;if(r.t>=r.T&&!r.done){r.done=1;const e=spawnEnemy(r.tp,r.x,r.y,{noAffix:true,noCap95:true,noSec:true,zbEsc:1,spawnT:.35});e.hp=e.maxHp=Math.round((EDEF[r.tp].hp||30)*3*zbDiffK().hp);(Z.echoes||(Z.echoes=[])).push(e);
      floater(r.x,r.y-30,'ЭХО · '+String(EDEF[r.tp].name).toUpperCase(),C120.ice);if(SET.fx)explode(r.x,r.y,C120.ice,14,.8);if(G.shock.length<60)G.shock.push({x:r.x,y:r.y,r:10,R:120,t:0,col:C120.ice,thin:true});}}
  if(Z.rifts.length&&Z.rifts.some(r=>r.t>=r.T+.5))Z.rifts=Z.rifts.filter(r=>r.t<r.T+.5);
  if(Z.echoes){for(const e of Z.echoes){if(!e.alive&&!e.zbCounted){e.zbCounted=1;if(!e.zbGone){p.en=Math.min(100,(p.en||0)+10);zbStg(Z,6);floater(e.x,e.y-26,'ЭХО СТЁРТО · +ЭНЕРГИЯ',C120.ice);if(SET.fx)explode(e.x,e.y,C120.ice,12,.8);}}}if(Z.echoes.some(e=>!e.alive))Z.echoes=Z.echoes.filter(e=>e.alive);}}
// --- эффекты: осколки, полосы броска, ожоги, линия вспышки ---
function zbRing(Z,x,y,R,col,T,w){if(!SET.fx)return;zbFx(Z,{k:'ring',x,y,R,t:0,T:T||.5,col,w:w||10});}
function zbKick(Z,v){Z.kick=Math.max(Z.kick||0,v);}
function zbArc(Z,x1,y1,x2,y2,col){if(!SET.fx)return;const P=[[x1,y1]],n=6;for(let i=1;i<n;i++){const k=i/n;P.push([x1+(x2-x1)*k+vrnd4(-14,14),y1+(y2-y1)*k+vrnd4(-14,14)]);}P.push([x2,y2]);zbFx(Z,{k:'arc',P,t:0,T:.13,col:col||C120.white});}
function zbFx(Z,o){const L=Z.fx||(Z.fx=[]);if(L.length<(isMob()?40:90))L.push(o);}
function zbShards(Z,x,y,n,col,spd){if(!SET.fx)return;n=isMob()?Math.ceil(n/2):n;for(let i=0;i<n;i++){const a=vrnd4(0,TAU),v=vrnd4(.35,1)*spd;zbFx(Z,{k:'shard',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,a:vrnd4(0,TAU),va:vrnd4(-9,9),s:vrnd4(5,13),t:0,T:vrnd4(.6,1.2),col});}}
function zbPartOK(){return !isMob()||G.parts.length<140;}
function zbFxTick(Z,dt){if(Z.kick>0)Z.kick=Math.max(0,Z.kick-dt*2.5);
  if(SET.fx&&!G.lowFx&&(Z.k==='fight'||Z.k==='race')&&zbPartOK()){const mob=isMob(),c=zbCen(Z),N=Z.shape.next;const col=N?(N.type==='E'?C120.mint:C120.red):Z.stage===3&&Z.neg.m==='neg'?C120.mint:C120.zero;let q=mob?.3:2;while(q>0){if(q<1&&vR4()>q)break;q--;const th=vrnd4(0,TAU),r=zbRad(Z,th),x=c.x+Math.cos(th)*r,y=c.y+Math.sin(th)*r;if(!inView(x,y,40))continue;const sg=vR4()<.5?1:-1,tv=vrnd4(30,90)*sg,ov=N&&N.type==='S'?-50:30;part(x,y,-Math.sin(th)*tv+Math.cos(th)*ov,Math.cos(th)*tv+Math.sin(th)*ov,vrnd4(.4,.8),col,2);}
    const e=Z.boss;if(e&&e.alive&&Z.stun>0){Z.arcT=(Z.arcT||0)-dt;if(Z.arcT<=0){Z.arcT=mob?.16:.08;const a1=vrnd4(0,TAU),a2=a1+vrnd4(1,2.6),r1=e.r+vrnd4(6,50),r2=e.r+vrnd4(6,50);zbArc(Z,e.x+Math.cos(a1)*r1,e.y+Math.sin(a1)*r1,e.x+Math.cos(a2)*r2,e.y+Math.sin(a2)*r2,vR4()<.5?C120.white:C120.ice);}}}
{const M=Z.motes||(Z.motes=[]),want=SET.fx?(isMob()?26:70):0;while(M.length<want)M.push({a:vrnd4(0,TAU),r:vrnd4(.2,1),v:vrnd4(.03,.09),w:vrnd4(.15,.5)});if(M.length>want)M.length=want;for(const m of M){m.r-=m.v*dt;m.a+=m.w*dt*(1.2-m.r);if(m.r<.04){m.r=vrnd4(.9,1);m.a=vrnd4(0,TAU);}}}if(Z.chromT>0)Z.chromT-=dt;if(Z.negFlash>0)Z.negFlash-=dt;if(Z.warpT>0)Z.warpT-=dt;const e=Z.boss;
  if(SET.fx&&e&&e.alive&&Z.k==='fight'&&zbPartOK()){const mob=isMob();
    if((Z.wind>0||Z.stance>0||(Z.burst&&Z.burst.t>0))&&vR4()<(mob?.4:1)){const q=vrnd4(0,TAU),r=vrnd4(90,150);part(e.x+Math.cos(q)*r,e.y+Math.sin(q)*r,-Math.cos(q)*r*2.4,-Math.sin(q)*r*2.4,.4,Z.stance>0?C120.ice:C120.zero,2);}
    const v=Math.hypot(e.vx,e.vy);if(v>220&&vR4()<(mob?.4:.9)){part(e.x-e.vx/v*e.r*.6+vrnd4(-10,10),e.y-e.vy/v*e.r*.6+vrnd4(-10,10),-e.vx*.15,-e.vy*.15,.45,Z.rage?C120.red:C120.rose,3);}
    if(Z.stage===2&&Z.novaT>0&&vR4()<(mob?.5:1)){const c=zbCen(Z),q=vrnd4(0,TAU),r=zbRad(Z,q)*.6;part(c.x+Math.cos(q)*r,c.y+Math.sin(q)*r,-Math.cos(q)*r*.9,-Math.sin(q)*r*.9,.9,C120.white,3);}}
  const L=Z.fx;if(!L||!L.length)return;for(const f of L){f.t+=dt;if(f.k==='shard'){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vx*=.96;f.vy*=.96;f.a+=f.va*dt;}}if(L.some(f=>f.t>=f.T))Z.fx=L.filter(f=>f.t<f.T);}
function zbFxDraw(Z,t){const L=Z.fx;if(!L||!L.length)return;ctx.save();
  for(const f of L){const k=1-f.t/f.T;
    if(f.k==='shard'){ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.a);ctx.globalAlpha=k;ctx.fillStyle=rgba90(f.col,.35);ctx.strokeStyle=f.col;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-f.s,0);ctx.lineTo(0,-f.s*.45);ctx.lineTo(f.s*.8,0);ctx.lineTo(0,f.s*.5);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
    else if(f.k==='streak'){ctx.globalAlpha=k*.8;ctx.strokeStyle=f.col;const dx=f.x2-f.x,dy=f.y2-f.y,d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d;const m=isMob()?3:6;for(let i=0;i<m;i++){const o=(i-(m-1)/2)*16,s0=.1+(i%3)*.12;ctx.lineWidth=i%2?1:2;ctx.beginPath();ctx.moveTo(f.x+dx*s0+nx*o,f.y+dy*s0+ny*o);ctx.lineTo(f.x+dx*(s0+.55*k+.2)+nx*o,f.y+dy*(s0+.55*k+.2)+ny*o);ctx.stroke();}}
    else if(f.k==='scorch'){ctx.globalAlpha=k*.7;ctx.strokeStyle=f.col;ctx.lineWidth=10*k+2;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(f.x2,f.y2);ctx.stroke();ctx.globalAlpha=k;ctx.strokeStyle=C120.white;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(f.x2,f.y2);ctx.stroke();
      if(SET.fx&&!isMob()&&Math.random()<.5){const q=Math.random();part(f.x+(f.x2-f.x)*q,f.y+(f.y2-f.y)*q,rnd(-40,40),rnd(-40,40),.4,f.col,2);}}
    else if(f.k==='ring'){const p=f.t/f.T,r=f.R*(1-(1-p)*(1-p));ctx.globalAlpha=(1-p)*.9;ctx.strokeStyle=f.col;ctx.lineWidth=f.w*(1-p)+1;ctx.beginPath();ctx.arc(f.x,f.y,Math.max(1,r),0,TAU);ctx.stroke();if(!isMob()){ctx.globalAlpha=(1-p)*.6;ctx.strokeStyle=C120.white;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(f.x,f.y,Math.max(1,r*.92),0,TAU);ctx.stroke();}}
    else if(f.k==='arc'){ctx.globalAlpha=k;ctx.strokeStyle=f.col;ctx.lineWidth=isMob()?2:3;ctx.beginPath();f.P.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();if(!isMob()){ctx.globalAlpha=k*.35;ctx.lineWidth=9;ctx.stroke();}}
    else if(f.k==='blinkLine'){ctx.globalAlpha=k;ctx.strokeStyle=C120.ice;ctx.lineWidth=6*k+1;ctx.setLineDash([12,10]);ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(f.x2,f.y2);ctx.stroke();ctx.setLineDash([]);}}
  ctx.restore();ctx.globalAlpha=1;}
function zbStageTick(Z,dt){const p=G.player,e=Z.boss;if(!e||!e.alive||!p)return;
  if(Z.k==='race'){zbRaceTick(Z,dt);return;}
  e.contact=Z.lunge>0?zbDmg(10):0;if(Z.lunge>0)Z.lastAtk={n:Z.stage===4&&Z.beatLunge?'beat':'dash',t:G.t-.1};
  if(Z.wind>0)Z.wind-=dt;if(Z.stance>0&&!(G.wtg95||[]).some(o=>o.nm==='beam'&&o.st==='warn'))Z.stance=0;
  if(Z.cool>0)Z.cool=Math.max(0,Z.cool-dt);if(Z.stun>0){Z.stun-=dt;if(Z.stun<=0){Z.stun=0;snd120('stunEnd',e.x);}}if(Z.stgLock>0)Z.stgLock-=dt;if(Z.ramCd>0)Z.ramCd-=dt;
  if(Z.stg>0&&G.t-Z.stgT>3)Z.stg=Math.max(0,Z.stg-3*dt);
  // таран: рывок сквозь корпус — всегда награда
  if(p.dashT>0&&Z.ramCd<=0&&G.dashId!==Z.ramId&&segDist(p.px??p.x,p.py??p.y,p.x,p.y,e.x,e.y)<e.r+p.r+8){Z.ramId=G.dashId;Z.ramCd=1.2;zbStg(Z,30);const a=Math.atan2(e.y-p.y,e.x-p.x);e.x+=Math.cos(a)*50;e.y+=Math.sin(a)*50;
    if(Z.stage===2)Z.count=Math.min(15,Z.count+4);snd120('ram',e.x);trauma90(.2);shake(5);zbRing(Z,e.x,e.y,150,C120.white,.35,10);zbShards(Z,e.x,e.y,8,C120.ice,320);zbKick(Z,.4);zbShards(Z,e.x,e.y,8,C120.white,320);if(G.shock.length<60)G.shock.push({x:e.x,y:e.y,r:10,R:130,t:0,col:C120.white});zbFl(e,16,'ТАРАН · +30 СБОЯ'+(Z.stage===2?' · +4 С':''),C120.white);if(SET.fx)explode(e.x,e.y,C120.white,10,.7);}
  zbMinesTick(Z,dt);zbFragsTick(Z,dt);zbSingTick(Z,dt);zbCloneTick(Z,dt);zbBurstTick(Z,dt);zbSatTick(Z,dt);zbEchoTick(Z,dt);zbFxTick(Z,dt);
  if(!Z.rage&&Z.stage<=3&&Z.k==='fight'&&Z.hp<=Z.segMax*.3){Z.rage=1;zbFl(e,16,'ЯРОСТЬ · ОН СПЕШИТ',C120.red);snd120('stun',e.x);trauma90(.2);if(G.shock.length<60)G.shock.push({x:e.x,y:e.y,r:20,R:260,t:0,col:C120.red});}
  switch(Z.stage){
    case 1:{if(!Z.cloneDone&&Z.hp<=Z.segMax*.5){Z.cloneDone=1;zbCloneSpawn(Z);banner('ДВА ОТРАЖЕНИЯ','РАЗБЕЙТЕ КОПИИ ИЛИ ВЫМАНИТЕ ПОД СЖАТИЕ');}break;}
    case 2:{zbHandsTick(Z,dt);const c=zbCen(Z);
      if(Z.novaT>0){Z.novaT-=dt;}
      else if(Z.stun<=0){Z.count-=dt;const cnt=Math.ceil(Z.count);if(cnt!==Z.cntS){Z.cntS=cnt;snd120(cnt<=3?'tock':'tick',c.x);}
        if(Z.count<=0){Z.count=15;Z.zeroN++;Z.novaT=1.2;const R=zbRad(Z,0)*.6;snd120('novaTg',c.x);banner('НОЛЬ','СТОЛ ВЗРЫВАЕТСЯ · УХОДИТЕ К КРАЮ');
          tg95({k:'zone',zb:1,nm:'nova',x:c.x,y:c.y,r:R,T:1.2,dmg:zbDmg(16),col:C120.zero,snd:false,keep:true,track:(o)=>{const q=zbCen(Z);o.x=q.x;o.y=q.y;o.r=zbRad(Z,0)*.6;},on:o=>{Z.lastAtk={n:'nova',t:G.t};snd120('zero',o.x);zbRing(Z,o.x,o.y,o.r*1.2,C120.white,.7,24);zbRing(Z,o.x,o.y,o.r*.7,C120.red,.5,12);zbShards(Z,o.x,o.y,16,C120.zero,520);zbKick(Z,.8);trauma90(.45);Z.flash=.35;zbShards(Z,o.x,o.y,14,C120.white,520);if(G.shock.length<58){G.shock.push({x:o.x,y:o.y,r:10,R:o.r*1.6,t:0,col:C120.gold,thin:true});}if(G.shock.length<60)G.shock.push({x:o.x,y:o.y,r:20,R:o.r,t:0,col:C120.white});zbCoolStart(Z,2.0);}});}}
      break;}
    case 3:{zbNegTick(Z,dt);break;}
    case 4:{for(const s of Z.stars){s.cd-=dt;if(s.cd<=0){s.cd=2.6;if(Math.hypot(s.x-e.x,s.y-e.y)<1100){zbApply(Z,Z.segMax*.0035);Z.lines.push({x:s.x,y:s.y,x2:e.x,y2:e.y,t:.3});snd120('allyShot',s.x);}}}
      for(const l of Z.lines)l.t-=dt;if(Z.lines.length)Z.lines=Z.lines.filter(l=>l.t>0);
      if(!Z.cloneDone&&Z.hp<=Z.segMax*.6){Z.cloneDone=1;zbCloneSpawn(Z);banner('ПОСЛЕДНИЕ ОТРАЖЕНИЯ','ОНИ НЕ ВЕРНУТСЯ');}
      if(Z.hp<=Z.segMax*.3&&!Z.hint.race){Z.hint.race=1;floater(p.x,p.y-44,'СКОРО ГОНКА · ДЕРЖИТЕСЬ БЛИЖЕ К КНОПКЕ',C120.warm);radioLine('000',C120.zero,'…я уже вижу кнопку. А ты?…',.1);}
      if(Z.hp<=Z.segMax*.2&&Z.k==='fight'){zbRaceStart(Z);return;}break;}}
  zbConduct(Z,dt);Z.onBeat=0;
  if(Z.k==='fight')Z.seg[Z.stage-1]=Math.max(0,Z.hp/Z.segMax);}
// --- стрелки «Отсчёта»: 0,6 радиуса, в разные стороны; 7 с горят, 1,2 с гаснут, 0,8 с мигают перед включением; кольцо гасит их ---
function zbHandsOn(Z){const H=Z.hands;if(!H)return 0;const ph=((H.t%9)+9)%9;if(Z.shape.kind==='ring'||(Z.shape.prev&&Z.shape.prev.kind==='ring'))return 0;if(Z.novaT>0||Z.stun>0)return 0;return ph<7?1:ph>=8.2?.5:0;}
function zbHandsTick(Z,dt){const H=Z.hands;if(!H)return;const p=G.player,c=zbCen(Z),D=zbDiffK();H.t+=dt;H.a[0]+=D.hands*dt;H.a[1]-=D.hands*dt;if(H.cd>0)H.cd-=dt;
  if(zbHandsOn(Z)!==1||H.cd>0||p.dashT>0||p.inv>0||p.hp<=0)return;
  for(let i=0;i<2;i++){const a=H.a[i],L=zbRad(Z,a)*(i===0?.97:.6);if(segDist(c.x,c.y,c.x+Math.cos(a)*L,c.y+Math.sin(a)*L,p.x,p.y)<22+p.r*.5){H.cd=.8;Z.lastAtk={n:'hands',t:G.t};damagePlayer(zbDmg(10));
      const dx=p.x-c.x,dy=p.y-c.y,d=Math.hypot(dx,dy)||1;if(i===0){const b=a-.24,rr=Math.min(d,zbRad(Z,b)*.9);p.x=c.x+Math.cos(b)*rr;p.y=c.y+Math.sin(b)*rr;}else{const to=Math.max(d,L+70);p.x=c.x+dx/d*to;p.y=c.y+dy/d*to;}snd120('beamHit',p.x);trauma90(.2);break;}}}
// --- нули (мины) ---
function zbMinesTick(Z,dt){const p=G.player,e=Z.boss;
  if(Z.mineDrop>0){Z.mineDT-=dt;if(Z.mineDT<=0){Z.mineDT=.4;Z.mineDrop--;if(Z.mines.length<6){Z.mines.push({x:e.x,y:e.y,t:0,fuse:-1,hp:2});snd120('mineSet',e.x);}}}
  for(const m of Z.mines){m.t+=dt;
    for(const b of G.pb){if(b.life<=0||Math.hypot(b.x-m.x,b.y-m.y)>24)continue;m.hp--;if(!b.charged)b.life=0;if(m.hp<=0&&m.fuse<0)m.fuse=.05;}
    if(m.t>=.8&&m.fuse<0&&Math.hypot(p.x-m.x,p.y-m.y)<80){m.fuse=.25;snd120('mineArm',m.x);}
    if(m.t>=5.5&&m.fuse<0)m.fuse=.05;
    if(m.fuse>=0){m.fuse-=dt;if(m.fuse<=0)zbMineBoom(Z,m);}}
  Z.mines=Z.mines.filter(m=>!m.dead);}
function zbMineBoom(Z,m){const p=G.player,e=Z.boss;m.dead=1;zbRing(Z,m.x,m.y,110,C120.zero,.45,12);zbShards(Z,m.x,m.y,6,C120.zero,260);if(G.shock.length<60)G.shock.push({x:m.x,y:m.y,r:10,R:90,t:0,col:C120.zero});snd120('mineBoom',m.x);
  if(p.hp>0&&p.dashT<=0&&Math.hypot(p.x-m.x,p.y-m.y)<90){Z.lastAtk={n:'mine',t:G.t};damagePlayer(zbDmg(8));}
  if(e&&e.alive&&Z.k==='fight'&&Math.hypot(e.x-m.x,e.y-m.y)<140){zbApply(Z,Z.segMax*.04);zbStg(Z,10);zbFl(e,16,'НУЛЬ У НЕГО · −4%',C120.white);}
  for(const q of Z.mines)if(!q.dead&&Math.hypot(q.x-m.x,q.y-m.y)<140&&(q.fuse<0||q.fuse>.15))q.fuse=.15;}
// --- осколки вдоха ---
function zbFragsTick(Z,dt){const p=G.player;for(const f of Z.frags){f.t+=dt;if(Math.hypot(p.x-f.x,p.y-f.y)<44){f.dead=1;p.en=Math.min(100,(p.en||0)+25);zbStg(Z,8);snd120('frag',f.x);if(SET.fx)explode(f.x,f.y,C120.mint,8,.5);}if(f.t>=f.T)f.dead=1;}Z.frags=Z.frags.filter(f=>!f.dead);}
// --- воронка «Негатива»: спираль 1 с, потом 2,5 с тяги 140 px/с; ядро 60 ---
function zbSingStart(Z){const c=zbCen(Z);Z.sing={x:c.x,y:c.y,t:0,cd:0};snd120('sing',c.x);if(!Z.hint.sing){Z.hint.sing=1;floater(c.x,c.y-60,'ВОРОНКА · ИДИТЕ ПРОТИВ ТЯГИ',C120.ice);}}
function zbSingTick(Z,dt){const s=Z.sing;if(!s)return;s.t+=dt;if(s.cd>0)s.cd-=dt;if(s.t>=3.5){Z.sing=null;return;}if(s.t<1)return;const p=G.player;
  const pull=(o,v)=>{const dx=s.x-o.x,dy=s.y-o.y,d=Math.hypot(dx,dy)||1;if(d<4)return;const k=Math.min(d,v*dt);o.x+=dx/d*k;o.y+=dy/d*k;};
  if(p.dashT<=0)pull(p,140);for(const m of Z.mines)pull(m,160);for(const f of Z.frags)pull(f,90);
  if(s.cd<=0&&p.dashT<=0&&Math.hypot(p.x-s.x,p.y-s.y)<60){s.cd=1;Z.lastAtk={n:'sing',t:G.t};damagePlayer(zbDmg(10));}}
// --- «Негатив»: обычный 8 с → телеграф 1,5 с → негатив 6 с → возврат 1,5 с ---
function zbNegTick(Z,dt){const N=Z.neg,p=G.player;N.t+=dt;
  if(N.m==='norm'){if(N.t>=8&&!Z.shape.next&&Z.shape.morph>=1&&Z.stun<=0&&!Z.sing&&zbBossTg()===0){N.m='tg';N.t=0;snd120('negTg',p.x);if(!Z.hint.neg){Z.hint.neg=1;banner('НЕГАТИВ','СЕЙЧАС ВНУТРИ СТАНЕТ НЕЛЬЗЯ · ВЫХОДИТЕ НАРУЖУ');}}}
  else if(N.m==='tg'){if(N.t>=1.5){N.m='neg';N.t=0;Z.outT=0;snd120('neg',p.x);trauma90(.25);Z.negFlash=.22;
    // он выворачивается вместе с миром: отражается через кромку наружу
    const e=Z.boss;if(e&&e.alive){const c=zbCen(Z),a=Math.atan2(p.y-c.y,p.x-c.x)+(Math.random()<.5?-.6:.6),bx=zbBox();if(SET.fx)explode(e.x,e.y,C120.mint,14,.7);const rr=zbRad(Z,a)+170;e.x=clamp(c.x+Math.cos(a)*rr,bx[0]+40,bx[2]-40);e.y=clamp(c.y+Math.sin(a)*rr,bx[1]+40,bx[3]-40);e.vx=e.vy=0;if(SET.fx)explode(e.x,e.y,C120.mint,14,.7);zbFl(e,16,'ОН СНАРУЖИ · ×1,5',C120.mint);}}}
  else if(N.m==='neg'){if(N.t>=6){N.m='back';N.t=0;snd120('negTg',p.x);}}
  else if(N.m==='back'){if(N.t>=1.5){N.m='norm';N.t=0;Z.outT=0;snd120('neg',p.x);Z.shape.hold=Math.max(Z.shape.hold,2.5);}}}
// --- отражения: две копии в зеркальных точках по осям ---
function zbCloneSpawn(Z){const p=G.player,c=zbCen(Z);for(const q of Z.clones)q.alive=false;Z.clones=[];
  for(const ax of ['x','y']){let q=ax==='x'?{x:2*c.x-p.x,y:p.y}:{x:p.x,y:2*c.y-p.y};q=zbInside(Z,q.x,q.y,.85);const e=spawnEnemy('zero000c',q.x,q.y,{noAffix:true,noCap95:true,noSec:true,zb:2,spawnT:.6,inv:0});
    e.hp=e.maxHp=1e9;e.chp=e.cmax=Math.max(60,Math.round(Z.segMax*.05));e.ax=ax;e.fireT=2+(ax==='y'?1.75:0);e.contact=0;e.zbClone=1;Z.clones.push(e);}
  snd120('copy',c.x);trauma90(.25);}
function zbCloneTick(Z,dt){if(!Z.cloneDone||Z.stage!==1)return;if(Z.clones.length&&Z.clones.every(c=>!c.alive)){if(Z.cloneRe<=0)Z.cloneRe=12;Z.cloneRe-=dt;if(Z.cloneRe<=0){Z.cloneRe=0;zbCloneSpawn(Z);floater(G.player.x,G.player.y-50,'ОТРАЖЕНИЯ ВЕРНУЛИСЬ',C120.rose);}}}
function zbCloneAI(Z,e,dt){if(Z.k!=='fight'||Z.stun>0){e.vx*=.9;e.vy*=.9;return;}const p=G.player,c=zbCen(Z);let q=e.ax==='x'?{x:2*c.x-p.x,y:p.y}:{x:p.x,y:2*c.y-p.y};q=zbInside(Z,q.x,q.y,.85);
  {const dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy)||1;if(d<220){q={x:p.x+dx/d*220,y:p.y+dy/d*220};}}
  steer(e,q.x-e.x,q.y-e.y,260,dt,4);
  if(e.spawnT>0)return;e.fireT-=dt;if(e.fireT<=0){e.fireT=3.5;const a=Math.atan2(p.y-e.y,p.x-e.x);tg95({k:'cone',zb:1,nm:'clone',x:e.x,y:e.y,a,arc:.7,len:560,T:.7,dmg:0,noHit:true,col:C120.rose,src:e,snd:'tlCone',track:(o)=>{o.x=e.x;o.y=e.y;if(o.t<o.T-.2)o.a=Math.atan2(p.y-e.y,p.x-e.x);},on:o=>{if(e.alive)zbFanShot(Z,e,o.a,'clone',0);}});}}
function zbCloneHurt(Z,e,dmg){if(Z.k!=='fight')return;e.flash=.07;e.chp-=dmg;if(e.chp<=0&&e.alive){e.alive=false;if(SET.fx)explode(e.x,e.y,C120.rose,18,.9);snd120('cloneDie',e.x);zbApply(Z,Z.segMax*.03);zbStg(Z,15);floater(e.x,e.y-30,'ОТРАЖЕНИЕ РАЗБИТО · −3% · +СБОЙ',C120.white);}}
function zbBeatTick(Z,dt){const prev=Z.beatT;Z.beatT+=dt;const per=ZB_BEAT;Z.beatEnv=Math.max(0,1-Z.beatT/.32);
  // красный такт: телеграф выпада за 0,6 с до каждого четвёртого удара
  const e=Z.boss;if(Z.stage===4&&Z.k==='fight'&&e&&e.alive&&(Z.beatN+1)%4===0&&prev<per-.6&&Z.beatT>=per-.6&&Z.stun<=0&&Z.cool<=0&&Z.stance<=0&&Z.wind<=0&&Z.lunge<=0){const p=G.player,L=520;const a=Math.atan2(p.y-e.y,p.x-e.x);
    tg95({k:'line',zb:1,nm:'beat',x:e.x,y:e.y,x2:e.x+Math.cos(a)*L,y2:e.y+Math.sin(a)*L,w:70,T:.6,dmg:zbDmg(10),col:C120.red,src:e,kb:120,snd:'tlLine',track:(o)=>{o.x=e.x;o.y=e.y;const c=Math.atan2(o.y2-o.y,o.x2-o.x);let n=c;if(o.t<o.T-.25){const b=Math.atan2(p.y-o.y,p.x-o.x);n=c+clamp(angDiff(b,c),-.08,.08);}o.x2=o.x+Math.cos(n)*L;o.y2=o.y+Math.sin(n)*L;Z.face=n;},
      on:o=>{const c=Math.atan2(o.y2-o.y,o.x2-o.x);Z.lastAtk={n:'beat',t:G.t};zbClean(Z,o);e.vx=Math.cos(c)*(Z.cheer?600:860);e.vy=Math.sin(c)*(Z.cheer?600:860);Z.face=c;Z.lunge=.32;Z.lungeCool=.8;Z.beatLunge=1;snd120('dash',e.x);}});}
  if(Z.beatT>=per){Z.beatT-=per;Z.beatN++;Z.beatEnv=1;Z.onBeat=1;snd120('beat',e?e.x:undefined);if(Z.lunge<=0)Z.beatLunge=0;}}
function zbBeatOff(Z){return Math.min(Z.beatT,ZB_BEAT-Z.beatT);}
function zbRaceStart(Z){Z.k='race';Z.t=0;const n=zbNode(),S=Z.shape;S.prev={kind:S.kind,s:S.s,a:S.a,c:{x:S.c.x,y:S.c.y}};S.kind='circle';S.s=300;S.c={x:n.x,y:n.y};S.next=null;S.morph=0;S.hold=1e9;S.type='S';Z.shrink=1;
  Z.mines=[];Z.frags=[];Z.sing=null;Z.stun=0;Z.cool=0;Z.stance=0;Z.wind=0;Z.lunge=0;if(Z.boss)Z.boss.contact=0;for(const c of Z.clones)c.alive=false;Z.clones=[];Z.sats=[];Z.rifts=[];Z.chain=0;Z.chainLock=0;for(const q of G.enemies)if(q.alive&&q.zbEsc){q.alive=false;q.zbGone=1;if(SET.fx)explode(q.x,q.y,C120.ice,8,.6);}
  banner('ГОНКА','КТО КОСНЁТСЯ КНОПКИ ПЕРВЫМ · РЫВОК СКВОЗЬ НЕГО СБИВАЕТ ЕГО');snd120('race');radioLine('000',C120.zero,'…кто первый. Я уже бежал. Я помню, чем кончилось…',.2);G.wtg95=[];}
function zbRaceTick(Z,dt){const p=G.player,e=Z.boss,n=zbNode();const dp=Math.hypot(p.x-n.x,p.y-n.y),de=Math.hypot(e.x-n.x,e.y-n.y);e.contact=0;
  if(Z.ramCd>0)Z.ramCd-=dt;
  if(p.dashT>0&&Z.ramCd<=0&&G.dashId!==Z.ramId&&segDist(p.px??p.x,p.py??p.y,p.x,p.y,e.x,e.y)<e.r+p.r+10){Z.ramId=G.dashId;Z.ramCd=1;Z.stall=.6;e.vx*=.1;e.vy*=.1;snd120('ram',e.x);zbFl(e,16,'СБИТ · 0,6 С',C120.white);}
  if(de<44){Z.cycles++;Z.flash=1.2;Z.hp=Z.segMax*.6;Z.seg[3]=.6;Z.k='fight';Z.t=0;Z.atkT=2;Z.hint.race=0;snd120('cycle');banner('ЦИКЛ ПОВТОРЁН','ОН НАЖАЛ ПЕРВЫМ · СЕГМЕНТ 60% · СЛЕДУЮЩАЯ ГОНКА ЛЕГЧЕ');trauma90(.5);const a=rnd(0,TAU);e.x=n.x+Math.cos(a)*520;e.y=n.y+Math.sin(a)*520;e.vx=e.vy=0;Z.br.i=2;zbNextShape(Z);Z.shape.tg=.8;G.wtg95=[];return;}
  if(dp<46&&p.hp>0){zbWinRace(Z);}}
function zbWinRace(Z){Z.k='choice';Z.t=0;const e=Z.boss;if(e){e.vx=e.vy=0;Z.stall=1e9;}G.eb=[];G.wtg95=[];snd120('choice');
  for(const q of G.enemies)if(q.alive&&(q.zbEsc||q.zb===2)){q.alive=false;}
  radioLine('000',C120.zero,'…ты успел первым. Это уже третий раз, когда кто-то успевает. Нажмёшь — и всё начнётся сначала. Не нажмёшь — он вспомнит. Или…',.1);
  Z.choiceOpen=0;}
function zbOpenChoice(Z){scr6('levelup');pickMode='zbChoice';choices=['erase','recall'].concat(Z.thirdOK?['third']:['none']);sfx('level');
  $('#lvEyebrow').textContent='ТОЧКА НЕВОЗВРАТА · КНОПКА ЕЩЁ ТЁПЛАЯ · ВЫБЕРИТЕ';$('#lvAuto').hidden=true;$('#cards').classList.remove('bcm');
  const T={erase:['СТЕРЕТЬ','Нажать кнопку','Кольцо замкнётся. Он забудет, вы забудете, и всё начнётся сначала — так, как было всегда.'],recall:['ВСПОМНИТЬ','Отойти от кнопки','Кнопка остынет. Он вспомнит, кем был, и получит номер, которого ждал.'],third:['ТРЕТИЙ ПУТЬ','Записать себя в него','Те, кого вы пощадили, держат линии. Войти в разлом вместо него — и не нажимать.'],none:['…','Третий путь не найден','Э. В. писал: «Ищи третий путь». Кто-то должен был остаться рядом, чтобы его показать.']};
  $('#cards').innerHTML=choices.map((k,i)=>{const t=T[k];return `<button class="card" data-i="${i}" ${k==='none'?'disabled style="opacity:.45"':''}><div class="k"><span>${t[0]}</span><span>${i+1}</span></div><h3>${t[1]}</h3><p>${t[2]}</p></button>`;}).join('');
  show('sLevel');const f=$('#cards .card');if(f&&!touchMode)f.focus();}
function zbChoose(i){const Z=G.zb,k=choices[i];if(!Z||Z.k!=='choice'||!k||k==='none')return;Z.choice=k;Z.k='end';Z.t=0;Z.endT=k==='third'?10:k==='recall'?7:5;scr6('world');show('');pickMode='ship';snd120(k==='erase'?'erase':k==='recall'?'recall':'third');
  const e=Z.boss;if(e){Z.stall=1e9;}G.calm=0;if(k==='erase'){Z.flash=1.2;}}
function zbEndTick(Z,dt){const p=G.player,e=Z.boss,n=zbNode();zbCam(Z,dt);if(e&&e.alive){if(Z.choice==='recall'||Z.choice==='third'){const dx=n.x-e.x,dy=n.y-e.y,d=Math.hypot(dx,dy);if(d>60){e.vx=dx/d*180;e.vy=dy/d*180;}else{e.vx*=.8;e.vy*=.8;}}else{e.vx=e.vy=0;}}
  if(Z.choice==='third'&&Z.t<3){const dx=n.x-p.x,dy=n.y-p.y,d=Math.hypot(dx,dy)||1;p.x+=dx/d*Math.min(d,260*dt);p.y+=dy/d*Math.min(d,260*dt);p.inv=1;}
  if(Z.t>=Z.endT)zbFinish(Z);}
function zbFinish(Z){const S=G.save,e=Z.boss,k=Z.choice;const code=k==='erase'?1:k==='recall'?2:3;
  if(S&&S.story){S.story.zero50=code;S.story.zero50n=(S.story.zero50n||0)+1;const J=S.story.zbJ||(S.story.zbJ={});J[k==='erase'?'e':k==='recall'?'r':'t']=1;}
  const md=S.medals[50]||(S.medals[50]={});const first=!md.clear;md.clear=1;if(Z.cycles===0&&Z.deaths===0)md.master=1;
  const lom=Math.round((first?4000:1200)*(curDiff().lom||1));S.lom+=lom;G.score+=Math.round(8*Z.segMax);addPilotXP(first?400:120);
  if(e){explode(e.x,e.y,C120.white,60,1.8);e.alive=false;}Z.boss=null;for(const q of G.enemies)if(q.alive&&(q.zb||q.zbEsc))q.alive=false;G.eb=[];G.wtg95=[];
  Z.k='idle';G.zbCool=G.t+6;snd120('seg');zbResetMods();
  banner(k==='erase'?'КОЛЬЦО ЗАМКНУТО':k==='recall'?'ОН ВСПОМНИЛ':'КОЛЬЦО РАЗОМКНУТО',(first?'МИССИЯ 50 ПРОЙДЕНА · ':'')+'+'+fmt(lom)+' ЛОМА'+(md.master?' · МАСТЕРСТВО':''));
  setTimeout(()=>{if(G.save!==S)return;toast(k==='erase'?'ЗАПИСЬ 64 · «Я БЫЛ ПЕРВЫМ, КТО НАЖАЛ»':k==='recall'?'ЗАПИСЬ 64 · «Я ВСПОМНИЛ, ЧТО БЫЛ ИМ»':'ЗАПИСЬ 65 · «ТРЕТИЙ ПУТЬ»',k==='erase'?'Кнопка была тёплой, потому что её только что нажали. Я. Каждый раз — я. Кольцо внутри кольца.':k==='recall'?'Номер 013 ждал меня тринадцать циклов. Я не нажал. Это и есть ответ: не нажимать.':'Они держали линии, пока я входил. Созвездие без имени получило имя. Кольцо разомкнуто — не стёрто, а дописано.');},2200);
  saveWorld();}
// гибель — цикл заново, без контрольных точек; разбор: что стёрло и что делать иначе
function zbResetMods(){G.mods={};computeStats();runZero6(false);const p=G.player;if(p)p.hp=Math.min(p.hp,G.st.maxHp);}
function zbLeave(){const Z=G.zb;if(!Z||Z.k==='idle')return;zbResetMods();for(const q of G.enemies)if(q.alive&&(q.zb||q.zbEsc))q.alive=false;Z.boss=null;G.eb=[];G.wtg95=[];G.zb=null;G.zbCool=0;
  if(G.state==='levelup'&&pickMode==='zbChoice'){pickMode='ship';scr6('world');show('');}banner('БОЙ ПРЕРВАН','ВЫ ВЫШЛИ ЗА АРЕНУ · КНОПКА ЖДЁТ — МОЖНО ВОЙТИ СНОВА');snd120('stage');}
function zbDeathWhy(Z){const h=Z.lastHit&&G.t-Z.lastHit.t<6?Z.lastHit.n:Z.out?'out':'body';return ZB_HIT[h]||ZB_HIT.body;}
function zbAbort(why){const Z=G.zb;if(!Z||Z.k==='idle')return;Z.deaths++;const st=Z.stage;const W_=zbDeathWhy(Z);G.zbLastDeath={n:W_.n,tip:W_.tip,stage:st};zbResetMods();{const n=zbNode(),S=G.save;if(S){S.last={x:n.x,y:n.y+150};}}for(const q of G.enemies)if(q.alive&&(q.zb||q.zbEsc))q.alive=false;Z.boss=null;G.eb=[];G.wtg95=[];G.zb=null;G.zbCool=G.t+8;
  if(G.state==='levelup'&&pickMode==='zbChoice'){pickMode='ship';scr6('world');show('');}
  setTimeout(()=>{if(G.save&&G.world)banner('ЦИКЛ ПОВТОРЁН · СТАДИЯ '+st+'/4','СТЁР: '+W_.n+' · СОВЕТ: '+W_.tip);},1900);}
// --- урон по боссу: база ×1 всегда; мастерство умножает ---
function zbAngP(e){const p=G.player;return Math.atan2(p.y-e.y,p.x-e.x);}
function zbFront(Z,e){return Z.stance>0&&Math.abs(angDiff(zbAngP(e),Z.stanceA))<.61;}// лобовая дуга 70°
function zbSeam(Z,e){return Math.abs(angDiff(zbAngP(e),Z.face+Math.PI))<Math.PI/3;}// корма: задняя дуга 120°
function zbMult(Z,e){if(!Z||Z.k==='seg')return 0;if(Z.k==='race')return 1;if(Z.k!=='fight')return 0;if(zbFront(Z,e))return 0;let m=1;if(Z.stance>0)m*=2;if(zbSeam(Z,e))m*=1.5;if(Z.cool>0)m*=1.5;if(Z.stun>0)m*=2.5;
  if(Z.stage===3&&Z.neg.m==='neg')m*=1.5;if(Z.stage===4&&zbBeatOff(Z)<=zbDiffK().win)m*=2;return Math.min(3,m);}
function zbVulnNow(Z,e){return zbMult(Z,e)>0;}
function zbDeflect(Z,e){e.deflT=.25;Z.deflT=.25;if(!Z.hint.inv||G.t-Z.hint.inv>4){Z.hint.inv=G.t;zbFl(e,14,'ЩИТ СПЕРЕДИ · ЗАХОДИТЕ СБОКУ',C120.rose);}snd120('deflect',e.x);}
function zbHurt(e,dmg,src){const Z=G.zb;src=src||{};if(!zbF()||Z.k==='seg')return;const p=G.player;
  if(e.zb===2){zbCloneHurt(Z,e,dmg);return;}
  if(Z.k==='race'){e.flash=.07;zbApply(Z,dmg);const a=Math.atan2(e.y-p.y,e.x-p.x);e.x+=Math.cos(a)*30;e.y+=Math.sin(a)*30;return;}
  if(src.pulse)return;// импульс считается в zbPulse
  const m=zbMult(Z,e);if(m<=0){zbDeflect(Z,e);return;}
  e.flash=m>=1.5?.1:.07;const d=dmg*m;
  if(SET.fx&&G.t-(Z.hsT||0)>.05&&zbPartOK()){Z.hsT=G.t;const a=Math.atan2(p.y-e.y,p.x-e.x),hx=e.x+Math.cos(a)*e.r*.8,hy=e.y+Math.sin(a)*e.r*.8,col=m>=2.5?C120.gold:m>=1.5?C120.warm:C120.rose,n=(m>=2.5?7:m>=1.5?5:3)*(isMob()?.5:1);for(let i=0;i<n;i++){const q=a+vrnd4(-1,1),v=vrnd4(120,360);part(hx,hy,Math.cos(q)*v,Math.sin(q)*v,.3,col,2);}if(m>=2&&G.t-(Z.hrT||0)>.25){Z.hrT=G.t;zbRing(Z,hx,hy,46,col,.25,6);}}
  if(SET.fx&&vR4()<(isMob()?.35:.7)){const a=Math.atan2(p.y-e.y,p.x-e.x)+vrnd4(-.5,.5),hx=e.x+Math.cos(a)*e.r*.8,hy=e.y+Math.sin(a)*e.r*.8,col=m>=2.5?C120.white:m>=2?C120.ice:m>=1.5?C120.warm:C120.rose;
    for(let i=0;i<(m>=2?4:2);i++)part(hx,hy,Math.cos(a)*vrnd4(80,220)+vrnd4(-60,60),Math.sin(a)*vrnd4(80,220)+vrnd4(-60,60),vrnd4(.2,.4),col,m>=2?3:2);
    if(m>=2.5&&G.shock.length<60&&vR4()<.25)G.shock.push({x:hx,y:hy,r:4,R:40,t:0,col,thin:true});}
  if(zbSeam(Z,e)&&(!Z.hint.seam||G.t-Z.hint.seam>2.5)){Z.hint.seam=G.t;zbFl(e,14,'ШОВ · ×1,5',C120.warm);snd120('seam',e.x);}
  if(Z.stage===4&&zbBeatOff(Z)<=zbDiffK().win&&(!Z.hint.pf||G.t-Z.hint.pf>.9)){Z.hint.pf=G.t;zbFl(e,30,'В ТАКТ · ×2',C120.white);snd120('perfect',e.x);}
  if(Z.stance>0&&(!Z.hint.side||G.t-Z.hint.side>2.5)){Z.hint.side=G.t;zbFl(e,30,'СБОКУ · ×2',C120.white);}
  zbApply(Z,d);zbStg(Z,d/Z.segMax*60+(src.charged?14:0));
  if((src.charged||m>=2.5)&&(!Z.numT||G.t-Z.numT>.35)){Z.numT=G.t;floater(e.x+rnd(-30,30),e.y-e.r-6,'−'+Math.round(d)+(m>1?' ×'+String(+m.toFixed(2)).replace('.',','):''),m>=2.5?C120.white:C120.warm);}}
function zbApply(Z,dmg){if(Z.k==='seg')return;Z.hp-=dmg;if(Z.stage===ZB_N)Z.hp=Math.max(Z.segMax*.01,Z.hp);Z.seg[Z.stage-1]=Math.max(0,Z.hp/Z.segMax);if(Z.hp<=0&&Z.stage!==ZB_N)zbSegDone(Z);}
function zbPulse(p,R){const Z=G.zb;if(!zbF())return;const e=Z.boss;if(!e||!e.alive)return;const d=Math.hypot(e.x-p.x,e.y-p.y);
  if(d<R+e.r&&Z.k==='fight'){const m=Math.max(1,zbMult(Z,e));zbApply(Z,45*m);zbStg(Z,25);e.flash=.1;const a=Math.atan2(e.y-p.y,e.x-p.x);e.vx+=Math.cos(a)*380;e.vy+=Math.sin(a)*380;zbFl(e,16,'ИМПУЛЬС · +СБОЙ',C120.warm);}
  for(const m of (Z.mines||[]))if(Math.hypot(m.x-p.x,m.y-p.y)<R&&m.fuse<0)m.fuse=.2;zbSatPulse(Z,p,R);}
// --- мир вне боя: сектор XII до боя (слабые искажения, блики) ---
function zbInXII(){const p=G.player;return !!p&&G.world&&typeof inXII110==='function'&&inXII110(p.x,p.y);}
function zbAmbTick(dt){if(!G.world||!G.player)return;{const sc=WORLD.sectors[11];if(sc&&sc.name==='???'&&zbDone()){sc.name='НУЛЕВОЙ МИГ';if(typeof SECTORS_NEW!=='undefined'&&SECTORS_NEW[9])SECTORS_NEW[9].name='НУЛЕВОЙ МИГ';}}const A=G.zbAmb||(G.zbAmb={sw:{x:0,y:0},gl:[],t:0});A.t+=dt;const on=zbInXII()&&!zbOn();
  const bx=on?Math.sin(A.t*.55)*4:0,by=on?Math.cos(A.t*.43)*3:0;const tx=A.sw.x+(bx-A.sw.x)*Math.min(1,dt*2),ty=A.sw.y+(by-A.sw.y)*Math.min(1,dt*2);A.sw.x=tx;A.sw.y=ty;if(Math.abs(tx)>.01||Math.abs(ty)>.01){CX+=tx;CY+=ty;A.sw.on=1;}
  if(on&&SET.fx){if(A.gl.length<6&&vR4()<dt*.8)A.gl.push({x:vR4(),y:vR4(),t:0,T:vrnd4(2.5,5),s:vrnd4(6,16),c:vR4()<.5?C120.zero:C120.ice,vx:vrnd4(-.01,.01),vy:vrnd4(-.008,.008)});
    for(const g of A.gl){g.t+=dt;g.x+=g.vx*dt;g.y+=g.vy*dt;}A.gl=A.gl.filter(g=>g.t<g.T);}else A.gl.length=0;}
function zbZoom(){const Z=G.zb;if(!G.world||!SET.fx||SET.lessFx)return 0;if(zbOn()&&Z.k!=='silence'){const kk=1+.03*(Z.kick||0);const k=kk*(Z.k==='expand'?1-.04*Math.sin(Z.t*9)*(1-Z.exp):1+.012*Z.beatEnv*(Z.stage>=4?1:.5)+.004*Math.sin(Z.T*1.7));return k;}if(zbInXII())return 1+.008*Math.sin(G.t*.9);return 0;}
// --- рисунок: подложка, тела, верх ---
function zbUnder(t){const Z=G.zb;if(!zbOn()){if(zbInXII())zbSoftGlints(t);return;}const b=zbBox(),n=zbNode(),p=G.player;
  if(Z.k==='silence')return;
  const R=Z.k==='expand'?120+Math.pow(Z.exp,1.6)*3700:Z.k==='walls'?120:1e5;
  ctx.save();ctx.beginPath();ctx.rect(b[0],b[1],b[2]-b[0],b[3]-b[1]);ctx.clip();if(R<1e5){ctx.beginPath();ctx.arc(n.x,n.y,R,0,TAU);ctx.clip();}
  const one=zbF()||Z.k==='choice'||Z.k==='end';// в бою — одна заливка экрана вместо двух
  if(!one){const x0=Math.max(b[0],CX-10),y0=Math.max(b[1],CY-10);ctx.fillStyle='rgba(10,3,12,.62)';ctx.fillRect(x0,y0,Math.min(b[2],CX+W+10)-x0,Math.min(b[3],CY+H+10)-y0);}
  if(Z.k==='expand'||Z.k==='walls'){const RR=Math.min(R,3700);ctx.globalCompositeOperation='lighter';ctx.strokeStyle=rgba90(C120.white,.85);ctx.lineWidth=5;ctx.beginPath();ctx.arc(n.x,n.y,RR,0,TAU);ctx.stroke();ctx.strokeStyle=rgba90(C120.zero,.5);ctx.lineWidth=14;ctx.beginPath();ctx.arc(n.x,n.y,RR,0,TAU);ctx.stroke();
    for(let i=1;i<=5;i++){ctx.strokeStyle=rgba90(C120.rose,.3/i);ctx.lineWidth=2;ctx.beginPath();ctx.arc(n.x,n.y,Math.max(10,RR-i*150),0,TAU);ctx.stroke();}
    if(SET.fx){ctx.strokeStyle=rgba90(C120.ice,.18);ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<24;i++){const a=i/24*TAU+t*.2,r0=Math.max(0,RR-420),r1=RR;ctx.moveTo(n.x+Math.cos(a)*r0,n.y+Math.sin(a)*r0);ctx.lineTo(n.x+Math.cos(a)*r1,n.y+Math.sin(a)*r1);}ctx.stroke();}ctx.globalCompositeOperation='source-over';}
  // фактура негатива — вне боя (в бою она стоила ~6 мс кадра на заливке всего экрана)
  if(SET.fx&&!G.lowFx&&!isMob()&&!['walls','expand','fight','race','seg'].includes(Z.k)){ctx.globalAlpha=1;ctx.fillStyle=negPat110();const x0=Math.max(b[0],CX-10),y0=Math.max(b[1],CY-10);ctx.fillRect(x0,y0,Math.min(b[2],CX+W+10)-x0,Math.min(b[3],CY+H+10)-y0);ctx.globalAlpha=1;}
  ctx.restore();
  if(!zbF()&&Z.k!=='choice'&&Z.k!=='end')return;
  // фигура: снаружи — негатив; в «Негативе» — наоборот, внутри
  const P=zbPoly(Z),Pi=zbRadIn(Z,0)>0?zbPoly(Z,true):null;const nm=Z.stage===3&&Z.k==='fight'?Z.neg.m:'norm';const inv=nm==='neg',blink=(nm==='tg'||nm==='back')&&Math.sin(t*14)>0;
  {const x0=Math.max(b[0],CX-10),y0=Math.max(b[1],CY-10),x1=Math.min(b[2],CX+W+10),y1=Math.min(b[3],CY+H+10);if(one&&(inv||!isMob())){ctx.save();ctx.beginPath();ctx.rect(b[0],b[1],b[2]-b[0],b[3]-b[1]);ctx.clip();ctx.beginPath();zbPath(P);if(Pi)zbPath(Pi);ctx.fillStyle=inv?'rgba(53,52,58,.67)':(['rgba(10,3,12,.62)','rgba(24,5,20,.6)','rgba(22,12,6,.6)','rgba(4,18,16,.6)','rgba(26,4,8,.6)'][Z.stage]||'rgba(10,3,12,.62)');ctx.fill('evenodd');ctx.restore();}
    ctx.beginPath();if(!inv||one)ctx.rect(x0,y0,x1-x0,y1-y0);zbPath(P);if(Pi)zbPath(Pi);ctx.fillStyle=inv?(one?'rgba(10,3,12,.62)':'rgba(232,255,248,.13)'):one?(blink?'rgba(27,45,40,.81)':'rgba(7,2,10,.86)'):blink?'rgba(40,70,60,.5)':'rgba(5,2,9,.62)';ctx.fill('evenodd');}
  // кромка
  const edgeC=inv||blink?C120.mint:C120.zero;ctx.strokeStyle=edgeC;ctx.lineWidth=3+2.5*(Z.beatEnv||0)*(Z.stage===4?1:.4);ctx.beginPath();zbPath(P);if(Pi)zbPath(Pi);ctx.stroke();
  if(SET.fx&&(Z.k==='fight'||Z.k==='seg'||Z.k==='race')){const n=P.length,m=isMob()?4:8;ctx.save();for(let k=0;k<4;k++){ctx.globalAlpha=.9*(1-k/4);ctx.fillStyle=k?edgeC:C120.white;const r=k?3-k*.5:4.2;ctx.beginPath();for(let j=0;j<m;j++){const f=((t*.07+j/m)%1)*n,q=P[((Math.floor(f)-k)%n+n)%n];ctx.moveTo(q[0]+r,q[1]);ctx.arc(q[0],q[1],r,0,TAU);}ctx.fill();}ctx.restore();ctx.globalAlpha=1;}
  if(!isMob()){ctx.strokeStyle=rgba90(inv?C120.mint:C120.rose,.22);ctx.lineWidth=9;ctx.beginPath();zbPath(P);if(Pi)zbPath(Pi);ctx.stroke();if(SET.fx&&!G.lowFx){ctx.setLineDash([14,30]);ctx.lineDashOffset=-t*40;ctx.strokeStyle=rgba90(C120.white,.35);ctx.lineWidth=2;ctx.beginPath();zbPath(P);if(Pi)zbPath(Pi);ctx.stroke();ctx.setLineDash([]);}}
  else{ctx.strokeStyle=rgba90(C120.rose,.3);ctx.lineWidth=5;ctx.beginPath();zbPath(P);if(Pi)zbPath(Pi);ctx.stroke();}
  // внутри фигуры — тихие концентрические кольца: видно масштаб
  if(SET.fx&&Z.motes&&Z.motes.length){const c=zbCen(Z),tint=[null,C120.rose,C120.gold,C120.mint,C120.red][Z.stage]||C120.zero;ctx.save();ctx.fillStyle=tint;for(const m of Z.motes){const r=m.r*Z.shape.s,x=c.x+Math.cos(m.a)*r,y=c.y+Math.sin(m.a)*r;ctx.globalAlpha=.25+.5*Math.min(1,m.r*2)*(m.r<.15?m.r/.15:1);ctx.fillRect(x-1.2,y-1.2,2.4,2.4);}ctx.restore();ctx.globalAlpha=1;}
  if(!isMob()&&SET.fx&&!G.lowFx&&!inv){const c=zbCen(Z);ctx.save();ctx.strokeStyle=rgba90(C120.rose,.06);ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<12;i++){const a=i/12*TAU+t*.05,r=zbRad(Z,a);ctx.moveTo(c.x+Math.cos(a)*60,c.y+Math.sin(a)*60);ctx.lineTo(c.x+Math.cos(a)*r,c.y+Math.sin(a)*r);}ctx.stroke();ctx.restore();}
  if(!isMob()&&SET.fx&&!G.lowFx&&!inv){const c=zbCen(Z);ctx.save();ctx.beginPath();zbPath(P);if(Pi)zbPath(Pi);ctx.clip('evenodd');ctx.strokeStyle=rgba90(C120.rose,.14);ctx.lineWidth=1;ctx.setLineDash([3,9]);const base=Z.shape.s;for(let i=1;i<=4;i++){const r=base*i/4.6;if(r<40)continue;ctx.beginPath();ctx.arc(c.x,c.y,r,0,TAU);ctx.stroke();}ctx.setLineDash([]);ctx.restore();}
  // телеграф дыхания: что теряете (красное) или получаете (мятное), шевроны по кромке, подпись у ближайшего края
  if(Z.shape.next&&(Z.k==='fight'||Z.k==='seg')){const N=Z.shape.next,ex=N.type==='E',col=ex?C120.mint:C120.red;const Q=zbNextPoly(N),Qi=zbRin(N.kind)>0?zbNextPoly(N,true):null;
    const pulse=.5+.5*Math.sin(t*8);ctx.beginPath();zbPath(P);if(Pi)zbPath(Pi);zbPath(Q);if(Qi)zbPath(Qi);ctx.fillStyle=rgba90(col,.07+.07*pulse);ctx.fill('evenodd');
    ctx.setLineDash([10,8]);ctx.strokeStyle=rgba90(col,.45+.35*pulse);ctx.lineWidth=2;ctx.beginPath();zbPath(Q);if(Qi)zbPath(Qi);ctx.stroke();ctx.setLineDash([]);
    const c=zbCen(Z);ctx.strokeStyle=rgba90(col,.8);ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<16;i++){const th=i/16*TAU+.1,r=zbRad(Z,th),dir=ex?1:-1,x=c.x+Math.cos(th)*r,y=c.y+Math.sin(th)*r,nx=Math.cos(th)*dir,ny=Math.sin(th)*dir,tx=-ny,ty=nx,o=10*pulse;
      ctx.moveTo(x+nx*(o)-tx*9-nx*8,y+ny*(o)-ty*9-ny*8);ctx.lineTo(x+nx*(o+6),y+ny*(o+6));ctx.lineTo(x+nx*(o)+tx*9-nx*8,y+ny*(o)+ty*9-ny*8);}ctx.stroke();
    {const th=Math.atan2(p.y-c.y,p.x-c.x),r=zbRad(Z,th);zbLabel(c.x+Math.cos(th)*(r+(ex?-46:-46)),c.y+Math.sin(th)*(r-46),(ex?'▲ РАСШИРЕНИЕ · ':'▼ СЖАТИЕ · ')+Math.max(0,Z.shape.tg).toFixed(1),col);}}
  zbStageUnder(Z,t);}
function zbStageUnder(Z,t){const p=G.player,e=Z.boss,c=zbCen(Z);
  if(Z.k==='fight'||Z.k==='seg'){const tint=[null,C120.rose,C120.gold,C120.mint,C120.red][Z.stage]||C120.zero;}
  for(const r of Z.rifts||[]){const k=Math.min(1,r.t/r.T),rr=18+42*k;ctx.save();ctx.translate(r.x,r.y);glow(0,0,rr*2,C120.ice,.5*k);ctx.rotate(t*5);ctx.strokeStyle=rgba90(C120.ice,.85);ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,0,rr*(.45+i*.25),i*2.1,i*2.1+2.2);ctx.stroke();}ctx.restore();
    if(SET.fx&&Math.random()<.5){const q=rnd(0,TAU);part(r.x+Math.cos(q)*90,r.y+Math.sin(q)*90,-Math.cos(q)*150,-Math.sin(q)*150,.5,C120.ice,2);}}
  {const S=Z.shape;if(SET.fx&&S.prev&&S.morph<1&&(Z.k==='fight'||Z.k==='seg')){const ex=S.type==='E',col=ex?C120.mint:C120.red;const P=zbPoly(Z),n=P.length;ctx.save();ctx.strokeStyle=col;ctx.lineWidth=2;for(const off of [1,2]){ctx.globalAlpha=.3*(1-S.morph)/off;const sc=ex?-14*off:14*off;ctx.beginPath();for(let i=0;i<n;i+=2){const q=P[i],dx=q[0]-c.x,dy=q[1]-c.y,d=Math.hypot(dx,dy)||1,x=q[0]+dx/d*sc,y=q[1]+dy/d*sc;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.stroke();}ctx.restore();
      if(zbPartOK()&&Math.random()<(isMob()?.4:1))for(let j=0;j<(isMob()?1:3);j++){const q=P[(Math.random()*n)|0],dx=q[0]-c.x,dy=q[1]-c.y,d=Math.hypot(dx,dy)||1,v=ex?160:-160;part(q[0],q[1],dx/d*v+rnd(-30,30),dy/d*v+rnd(-30,30),.6,col,2);}}}
  if(Z.burst&&e&&e.alive){const B=Z.burst,k=B.t>0&&B.n>=3?1-B.t/.6:.4;const a=Math.atan2(p.y-e.y,p.x-e.x);ctx.save();ctx.strokeStyle=rgba90(C120.zero,.5+.4*k);ctx.lineWidth=3;ctx.beginPath();ctx.arc(e.x,e.y,e.r+14+10*(1-k),a-.35,a+.35);ctx.stroke();glow(e.x+Math.cos(a)*(e.r+10),e.y+Math.sin(a)*(e.r+10),24,C120.zero,.3+.4*k);ctx.restore();}
  // осколки вдоха
  for(const f of Z.frags){const k=Math.min(1,f.t/.3)*Math.min(1,(f.T-f.t)/.8);ctx.save();ctx.translate(f.x,f.y);ctx.globalAlpha=k;glow(0,0,34,C120.mint,.35);ctx.rotate(t*2);ctx.strokeStyle=C120.mint;ctx.fillStyle=rgba90(C120.mint,.25);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-11);ctx.lineTo(8,0);ctx.lineTo(0,11);ctx.lineTo(-8,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
  // нули
  for(const m of Z.mines){const arm=Math.min(1,m.t/.8),fl=m.fuse>=0&&Math.sin(t*50)>0;ctx.save();ctx.translate(m.x,m.y);glow(0,0,40,fl?C120.red:C120.zero,.22);ctx.strokeStyle=fl?C120.red:C120.zero;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,11,15,0,0,TAU);ctx.stroke();
    ctx.strokeStyle=rgba90(fl?C120.red:C120.rose,.6);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,24,-Math.PI/2,-Math.PI/2+TAU*arm);ctx.stroke();if(arm>=1){ctx.setLineDash([3,6]);ctx.strokeStyle=rgba90(C120.zero,.25);ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,80,0,TAU);ctx.stroke();ctx.setLineDash([]);}ctx.restore();}
  if(Z.stage===1&&Z.k==='fight'&&e&&e.alive){// ось зеркала: игрок — центр — он
    ctx.save();ctx.setLineDash([6,10]);ctx.lineDashOffset=-t*30;ctx.strokeStyle=rgba90(C120.rose,.28);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(c.x,c.y);ctx.lineTo(e.x,e.y);ctx.stroke();ctx.setLineDash([]);
    glow(c.x,c.y,40,C120.rose,.3);ctx.strokeStyle=rgba90(C120.white,.5);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(c.x,c.y,10,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(c.x-18,c.y);ctx.lineTo(c.x+18,c.y);ctx.moveTo(c.x,c.y-18);ctx.lineTo(c.x,c.y+18);ctx.stroke();ctx.restore();}
  if(Z.stage===2&&e&&e.alive&&Z.hands){const H=Z.hands,on=zbHandsOn(Z);
    ctx.save();for(let i=0;i<2;i++){const a=H.a[i],L=zbRad(Z,a)*(i===0?.97:.6);const x2=c.x+Math.cos(a)*L,y2=c.y+Math.sin(a)*L;
      if(on!==1){const bl=on===.5&&Math.sin(t*24)>0;ctx.setLineDash([8,12]);ctx.strokeStyle=rgba90(bl?C120.white:C120.dim,bl?.8:.55);ctx.lineWidth=bl?4:3;ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(x2,y2);ctx.stroke();ctx.setLineDash([]);continue;}
      if(!isMob())ctx.globalCompositeOperation='lighter';ctx.strokeStyle=rgba90(C120.zero,isMob()?.45:.35);ctx.lineWidth=isMob()?16:26;ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(x2,y2);ctx.stroke();ctx.strokeStyle=rgba90(C120.white,.9);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.lineTo(x2,y2);ctx.stroke();ctx.globalCompositeOperation='source-over';
      glow(x2,y2,30,C120.zero,.4);
      if(i===0){const rr=L*.92,a1=a+.05,a2=a+.2;ctx.strokeStyle=rgba90(C120.white,.6);ctx.lineWidth=2;ctx.beginPath();ctx.arc(c.x,c.y,rr,a1,a2);ctx.stroke();const hx=c.x+Math.cos(a2)*rr,hy=c.y+Math.sin(a2)*rr,ta=a2+Math.PI/2;ctx.fillStyle=rgba90(C120.white,.7);ctx.beginPath();ctx.moveTo(hx+Math.cos(ta)*9,hy+Math.sin(ta)*9);ctx.lineTo(hx+Math.cos(ta+2.4)*7,hy+Math.sin(ta+2.4)*7);ctx.lineTo(hx+Math.cos(ta-2.4)*7,hy+Math.sin(ta-2.4)*7);ctx.closePath();ctx.fill();}}
    // граница безопасного кольца
    if(!isMob())ctx.setLineDash([2,10]);ctx.strokeStyle=rgba90(C120.mint,isMob()?.2:.35);ctx.lineWidth=1.5;ctx.beginPath();for(let i=0;i<=64;i++){const th=i/64*TAU,r=zbRad(Z,th)*.6+12;const x=c.x+Math.cos(th)*r,y=c.y+Math.sin(th)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.setLineDash([]);ctx.restore();
    // стол и отсчёт
    ctx.save();ctx.translate(c.x,c.y);const hot=Z.count<=3||Z.novaT>0;glow(0,0,160,hot?C120.red:C120.ice,hot?.2:.08);ctx.strokeStyle=C120.white;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,96,-Math.PI/2,-Math.PI/2+TAU*Math.max(0,Z.count/15));ctx.stroke();
    ctx.strokeStyle=rgba90(hot?C120.red:C120.ice,.5);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,84,0,TAU);ctx.stroke();
    ctx.globalAlpha=(hot?.28:.18)+.06*Math.sin(t*6);ctx.fillStyle=hot?C120.red:C120.gold;ctx.font='700 110px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(Z.novaT>0?'0':String(Math.max(0,Math.ceil(Z.count))),0,4);ctx.textBaseline='alphabetic';ctx.textAlign='left';ctx.restore();
    zbLabel(c.x,c.y-120,Z.novaT>0?'НОЛЬ · К КРАЮ':'ОТСЧЁТ '+Math.max(0,Math.ceil(Z.count))+' · ТАРАН +4',hot?C120.red:C120.gold);}
  if(Z.stage===3&&Z.sing){const s=Z.sing,k=Math.min(1,s.t/1),on=s.t>=1;ctx.save();ctx.translate(s.x,s.y);ctx.strokeStyle=rgba90(C120.ice,.25+.35*k);ctx.lineWidth=2;for(let j=0;j<3;j++){ctx.beginPath();for(let i=0;i<=40;i++){const q=i/40,r=20+q*260*k,a=q*5+j*TAU/3-t*(on?3:1.2);const x=Math.cos(a)*r,y=Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}
    glow(0,0,70,C120.ice,on?.5:.2);ctx.fillStyle=rgba90(C120.ink,.9);ctx.beginPath();ctx.arc(0,0,on?26:14,0,TAU);ctx.fill();ctx.strokeStyle=C120.ice;ctx.beginPath();ctx.arc(0,0,60,0,TAU);ctx.stroke();ctx.restore();}
  if(Z.stage===3&&Z.k==='fight'&&(Z.neg.m==='tg'||Z.neg.m==='back')){const left=1.5-Z.neg.t;zbLabel(p.x,p.y-64,(Z.neg.m==='tg'?'НЕГАТИВ · НАРУЖУ · ':'ВОЗВРАЩАЙТЕСЬ ВНУТРЬ · ')+Math.max(0,left).toFixed(1),C120.mint);}
  if(Z.stage===4||Z.k==='race'||Z.k==='choice'||Z.k==='end'){const n=zbNode();const race=Z.k==='race';ctx.save();ctx.translate(n.x,n.y);glow(0,0,160,C120.warm,.25+.2*Z.beatEnv);ctx.strokeStyle=race?C120.white:C120.warm;ctx.lineWidth=race?3:2;ctx.beginPath();ctx.arc(0,0,46,0,TAU);ctx.stroke();ctx.fillStyle=rgba90(C120.warm,.35+.3*Z.beatEnv);ctx.beginPath();ctx.arc(0,0,26,0,TAU);ctx.fill();ctx.restore();zbLabel(n.x,n.y+74,race?'КНОПКА · КТО ПЕРВЫЙ':Z.k==='fight'?'КНОПКА · ГОНКА НА 20%':'КНОПКА',race?C120.white:C120.warm);
    for(const s of Z.stars){ctx.save();ctx.translate(s.x,s.y);glow(0,0,60,C120.rose,.3);ctx.rotate(t*.6);ctx.fillStyle='#2a0a22';ctx.strokeStyle=C120.rose;ctx.lineWidth=2;shipPath85(.9);ctx.fill();ctx.stroke();ctx.restore();zbLabel(s.x,s.y-26,s.name,C120.rose);}
    if(Z.lines.length){ctx.save();ctx.globalCompositeOperation='lighter';for(const l of Z.lines){ctx.strokeStyle=rgba90(C120.white,Math.min(1,l.t/.3)*.8);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(l.x,l.y);ctx.lineTo(l.x2,l.y2);ctx.stroke();}ctx.restore();}}}
// корпус-негатив: тёмное тело, светлая кромка, шов на корме, четыре зеркальные пластины на орбите
function zbHull(s){ctx.beginPath();ctx.moveTo(26*s,0);ctx.lineTo(10*s,-7*s);ctx.lineTo(2*s,-18*s);ctx.lineTo(-12*s,-19*s);ctx.lineTo(-9*s,-8*s);ctx.lineTo(-22*s,-5*s);ctx.lineTo(-22*s,5*s);ctx.lineTo(-9*s,8*s);ctx.lineTo(-12*s,19*s);ctx.lineTo(2*s,18*s);ctx.lineTo(10*s,7*s);ctx.closePath();}
function zbHullBody(s,fill,stroke,lw){ctx.fillStyle=fill;ctx.strokeStyle=stroke;ctx.lineWidth=lw;zbHull(s);ctx.fill();ctx.stroke();}
function zbState(Z){if(Z.k!=='fight')return '';if(Z.stun>0)return 'stun';if(Z.stance>0)return 'stance';if(Z.cool>0)return 'cool';if(Z.stage===3&&Z.neg.m==='neg')return 'neg';return '';}
function zbDrawBoss(e,t){const Z=G.zb;if(!Z)return;if(e.zbHide)return;const mob=isMob(),R=e.r;const st=zbState(Z);
  let a=1;if(e.spawnT>0)a*=Math.max(0,1-e.spawnT);if(Z.k==='end'&&Z.choice==='recall')a*=Math.max(.15,1-Z.t/Z.endT);
  const face=Z.face,s=R/24,negB=st==='neg';
  // послеобразы: он — копия, за ним тянутся копии
  if(!mob&&SET.fx&&Z.trailE.length>1){const n=Z.trailE.length;for(let i=0;i<n-1;i++){const q=Z.trailE[i];const k=(i+1)/n;if(Math.hypot(q.x-e.x,q.y-e.y)<6)continue;ctx.save();ctx.translate(q.x,q.y);ctx.rotate(q.f);ctx.globalAlpha=a*.22*k;ctx.lineJoin='round';ctx.strokeStyle=C120.zero;ctx.lineWidth=1.2;zbHull(s*(.7+.3*k));ctx.stroke();ctx.restore();}}
  ctx.save();ctx.translate(e.x,e.y);ctx.globalAlpha=a;
  // аура: вращающееся кольцо меток, цвет — состояние
  if(SET.fx&&Z.k!=='end'){const ac=st==='stun'?C120.white:st==='cool'?C120.gold:st==='stance'?C120.ice:negB?C120.mint:Z.rage?C120.red:C120.zero,rr=R+20+3*Math.sin(t*3),n=mob?12:24;
    ctx.save();ctx.rotate(t*(Z.rage?1.6:.7));ctx.globalAlpha=a*(.55+.25*Z.beatEnv);ctx.fillStyle=ac;for(let i=0;i<n;i++){const q=i/n*TAU;const L=i%3===0?7:3;ctx.save();ctx.rotate(q);ctx.fillRect(rr,-1,L,2);ctx.restore();}
    if(!mob){ctx.rotate(-t*1.9);ctx.strokeStyle=rgba90(ac,.35);ctx.lineWidth=1;ctx.setLineDash([2,7]);ctx.beginPath();ctx.arc(0,0,R+34,0,TAU);ctx.stroke();ctx.setLineDash([]);}ctx.restore();ctx.globalAlpha=a;
    if(Z.rage&&Math.random()<(mob?.3:.7)){const q=rnd(0,TAU);part(e.x+Math.cos(q)*R*.8,e.y+Math.sin(q)*R*.8,Math.cos(q)*60,Math.sin(q)*60-40,.5,C120.red,3);}}
  if(!mob){ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgba(10,2,12,.6)';ctx.beginPath();ctx.arc(0,0,R*2.2,0,TAU);ctx.fill();ctx.globalCompositeOperation='source-over';}
  // пластины = оставшиеся сегменты; в сбое разлетаются
  {const np=Z.k==='fight'||Z.k==='seg'?Math.max(0,5-Z.stage-(Z.k==='seg'?1:0)):Z.k==='race'?1:0;const sp=st==='stun'?1:0;Z.plateR=(Z.plateR||0)+((sp?40:0)-(Z.plateR||0))*.15;
    for(let i=0;i<np;i++){const an=t*.6+i/4*TAU,rr=R+30+Z.plateR;ctx.save();ctx.rotate(an);ctx.translate(rr,0);ctx.rotate(Math.PI/2+(sp?t*4:0));ctx.globalAlpha=a*(sp?.55:1);ctx.fillStyle=rgba90(C120.ice,.18);ctx.strokeStyle=sp?C120.dim:C120.ice;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-9,-4);ctx.lineTo(9,-4);ctx.lineTo(6,4);ctx.lineTo(-6,4);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}ctx.globalAlpha=a;}
  // лобовая стойка: зеркало-дуга 70°
  if(st==='stance'){ctx.save();ctx.strokeStyle=C120.white;ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,R+14,Z.stanceA-.61,Z.stanceA+.61);ctx.stroke();ctx.strokeStyle=rgba90(C120.ice,.7);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,R+22,Z.stanceA-.5,Z.stanceA+.5);ctx.stroke();
    ctx.fillStyle=rgba90(C120.warm,.6+.3*Math.sin(t*12));for(const sd of [1,-1]){const an=Z.stanceA+sd*Math.PI/2;ctx.beginPath();ctx.arc(Math.cos(an)*(R+8),Math.sin(an)*(R+8),5,0,TAU);ctx.fill();}ctx.restore();}
  if(e.deflT>0&&st==='stance'){ctx.save();ctx.globalAlpha=a*Math.min(1,e.deflT/.25);glow(Math.cos(Z.stanceA)*(R+14),Math.sin(Z.stanceA)*(R+14),30,C120.white,.6);ctx.restore();}
  ctx.rotate(face);ctx.lineJoin='round';const sp=Math.hypot(e.vx,e.vy);
  if(st==='stun')ctx.rotate(Math.sin(t*30)*.06);
  if(Z.chromT>0&&SET.fx){const k=Z.chromT/.5;ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineJoin='round';ctx.lineWidth=2;for(const [col,dx] of [[C120.red,-6*k],[C120.ice,6*k]]){ctx.save();ctx.translate(dx,0);ctx.globalAlpha=.7*k;ctx.strokeStyle=col;zbHull(s);ctx.stroke();ctx.restore();}ctx.restore();}
  // тёмный выхлоп (негатив пламени)
  if(sp>40){ctx.fillStyle=rgba90(C120.ink,.85);const fl=8+sp/40+Math.sin(t*50)*2;ctx.beginPath();ctx.moveTo(-22*s,-5*s);ctx.lineTo(-22*s-fl*s,0);ctx.lineTo(-22*s,5*s);ctx.closePath();ctx.fill();glow(-26*s,0,fl*s,C120.zero,.25);}
  if(SET.fx&&Z.k!=='end'){const hc=st==='stun'?C120.white:st==='cool'?C120.gold:negB?C120.mint:Z.rage?C120.red:C120.zero;ctx.save();ctx.rotate(-face);if(!mob)glow(0,0,R*2.8,hc,.22+.12*Z.beatEnv);
    if(!mob&&!G.lowFx){ctx.rotate(t*.25);ctx.fillStyle=rgba90(hc,.07);ctx.beginPath();for(let i=0;i<5;i++){const q=i/5*TAU;ctx.moveTo(Math.cos(q-.05)*R,Math.sin(q-.05)*R);ctx.lineTo(Math.cos(q-.09)*220,Math.sin(q-.09)*220);ctx.lineTo(Math.cos(q+.09)*220,Math.sin(q+.09)*220);ctx.lineTo(Math.cos(q+.05)*R,Math.sin(q+.05)*R);}ctx.fill();}ctx.restore();}
  // тело: в негативе — обнажён (светлое тело, тёмная кромка)
  glow(0,0,R*1.4,negB?C120.mint:st==='cool'?C120.white:C120.zero,negB?.3:st==='cool'?.3:.18);
  zbHullBody(s,e.flash>0?C120.rose:negB?C120.neg:C120.body,negB?C120.ink:st==='cool'||st==='stun'?C120.white:C120.rim,2.6);
  ctx.strokeStyle=rgba90(negB?C120.ink:C120.zero,.75);ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(10*s,-7*s);ctx.lineTo(-9*s,-8*s);ctx.moveTo(10*s,7*s);ctx.lineTo(-9*s,8*s);ctx.moveTo(2*s,-18*s);ctx.lineTo(-6*s,-9*s);ctx.moveTo(2*s,18*s);ctx.lineTo(-6*s,9*s);ctx.stroke();
  // шов на корме: тёплая полоса, ярче в остывании и сбое
  {const hot=st==='cool'||st==='stun'?1:.45;glow(-20*s,0,R*.7,C120.warm,.35*hot);ctx.strokeStyle=rgba90(C120.warm,.5+.5*hot);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-21*s,-4.5*s);ctx.lineTo(-21*s,4.5*s);ctx.stroke();ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-17*s,-7*s);ctx.lineTo(-17*s,7*s);ctx.stroke();}
  // трещины сбоя
  if(st==='stun'&&SET.fx){ctx.save();ctx.strokeStyle=rgba90(C120.ice,.85);ctx.lineWidth=1.5;for(let j=0;j<(mob?2:4);j++){let q=rnd(0,TAU),r0=R*.5;ctx.beginPath();ctx.moveTo(Math.cos(q)*r0,Math.sin(q)*r0);for(let k2=1;k2<6;k2++){q+=rnd(-.5,.5);const r1=r0+k2*10;ctx.lineTo(Math.cos(q)*r1,Math.sin(q)*r1);}ctx.stroke();}ctx.restore();}
  if(st==='stun'){ctx.strokeStyle=C120.white;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(4*s,-2*s);ctx.lineTo(-3*s,-9*s);ctx.lineTo(-8*s,-6*s);ctx.moveTo(4*s,2*s);ctx.lineTo(-2*s,10*s);ctx.moveTo(14*s,0);ctx.lineTo(8*s,-5*s);ctx.stroke();}
  ctx.fillStyle=rgba90(negB?C120.ink:C120.white,.9);ctx.beginPath();ctx.ellipse(3*s,0,5*s,2.4*s,0,0,TAU);ctx.fill();ctx.fillStyle=negB?C120.neg:C120.ink;ctx.beginPath();ctx.ellipse(4*s,0,2.2*s,1.2*s,0,0,TAU);ctx.fill();
  // тёплая кнопка на носу — бьётся 50 в минуту
  const warm=.45+.55*Z.beatEnv;glow(19*s,0,26,C120.warm,warm*.95);ctx.fillStyle=C120.warm;ctx.globalAlpha=a*warm;ctx.beginPath();ctx.arc(19*s,0,3.6,0,TAU);ctx.fill();ctx.globalAlpha=a;
  ctx.restore();ctx.globalAlpha=1;
  // пар остывания из пазов
  if(st==='cool'&&SET.fx&&Math.random()<.6){for(const sd of [1,-1]){const an=face+sd*2.2;part(e.x+Math.cos(an)*R*.8,e.y+Math.sin(an)*R*.8,Math.cos(an)*rnd(40,120),Math.sin(an)*rnd(40,120),.5,C120.white,2);}}
  if(SET.fx&&Math.random()<.35&&(e.vx||e.vy))glyph95(e.x-Math.cos(face)*R,e.y-Math.sin(face)*R,1,C120.rose);
  const lab=Z.k==='end'&&Z.choice==='recall'&&Z.t>2?'VØID-013':'VØID-000'+(st==='stun'?' · СБОЙ ×2':st==='cool'?' · ОСТЫВАЕТ ×1,5':st==='stance'?' · СТОЙКА':st==='neg'?' · ОБНАЖЁН ×1,5':'');
  zbLabel(e.x,e.y+R+(st==='stun'?70:22),lab,Z.k==='end'&&Z.choice==='recall'&&Z.t>2?C120.ice:st?C120.white:C120.zero);}
function zbOpenNow(Z,e){if(Z.k==='race')return true;if(Z.k!=='fight')return false;return Z.stun>0||Z.cool>0||(Z.stage===3&&Z.neg.m==='neg');}
function zbIcon(e){ctx.save();ctx.lineJoin='round';const s=e.r/24;zbHullBody(s,C120.body,C120.rim,2);ctx.strokeStyle=rgba90(C120.ice,.7);ctx.lineWidth=1.5;for(let i=0;i<4;i++){const an=i/4*TAU+.4;ctx.beginPath();ctx.arc(Math.cos(an)*(e.r+16),Math.sin(an)*(e.r+16),4,0,TAU);ctx.stroke();}ctx.strokeStyle=C120.warm;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-21*s,-4.5*s);ctx.lineTo(-21*s,4.5*s);ctx.stroke();ctx.fillStyle=C120.warm;ctx.beginPath();ctx.arc(19*s,0,3.5,0,TAU);ctx.fill();ctx.restore();}
function zbDrawCopy(e,t){const Z=G.zb;const s=e.r/24,p=G.player;let a=e.spawnT>0?Math.max(0,1-e.spawnT/.6):1;const f=Math.atan2(p.y-e.y,p.x-e.x);ctx.save();ctx.translate(e.x,e.y);ctx.globalAlpha=a*.85;glow(0,0,e.r*1.6,C120.rose,.25);
  ctx.save();ctx.rotate(f);ctx.lineJoin='round';if(!isMob())ctx.setLineDash([4,3]);zbHullBody(s,e.flash>0?C120.white:rgba90(C120.rose,.18),C120.rose,1.8);ctx.setLineDash([]);ctx.restore();
  if(e.cmax){ctx.strokeStyle=rgba90(C120.white,.7);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,e.r+10,-Math.PI/2,-Math.PI/2+TAU*Math.max(0,e.chp/e.cmax));ctx.stroke();}
  ctx.restore();ctx.globalAlpha=1;zbLabel(e.x,e.y+e.r+20,'ОТРАЖЕНИЕ',C120.rose);}
// --- 0.9.9 R4: живой слой — хвосты пуль, заряд телеграфов, метки эха ---
function zbVfxDraw(Z,t){if(!SET.fx)return;const mob=isMob();ctx.save();
  // хвосты пуль босса, копий, спутников и очередей
  if(!mob)ctx.globalCompositeOperation='lighter';let n=0;
  for(const b of G.eb){if(!b.zbN||b.life<=0)continue;if(++n>(mob?30:80))break;if(!inView(b.x,b.y,60))continue;const tx=b.x-b.vx*.075,ty=b.y-b.vy*.075,col=b.zbN==='burst'?C120.zero:b.zbN==='sat'?C120.ice:b.zbN==='star'?C120.warm:C120.rose;
    if(!mob){ctx.globalAlpha=.28;ctx.strokeStyle=col;ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(b.x,b.y);ctx.stroke();}
    ctx.globalAlpha=.75;ctx.strokeStyle=mob?col:C120.white;ctx.lineWidth=mob?3:2;ctx.beginPath();ctx.moveTo(b.x-b.vx*.04,b.y-b.vy*.04);ctx.lineTo(b.x,b.y);ctx.stroke();}
  // заряд телеграфов: яркая голова бежит по линии, зона наполняется изнутри
  for(const o of G.wtg95||[]){if(!o.zb||o.st!=='warn')continue;const p=clamp(o.t/o.T,0,1),col=o.col||C120.zero;
    if(o.k==='line'){const hx=o.x+(o.x2-o.x)*p,hy=o.y+(o.y2-o.y)*p;ctx.globalAlpha=.25+.45*p;ctx.strokeStyle=col;ctx.lineWidth=Math.max(2,(o.w||40)*.18);ctx.beginPath();ctx.moveTo(o.x,o.y);ctx.lineTo(hx,hy);ctx.stroke();if(mob){ctx.globalAlpha=.9;ctx.fillStyle=C120.white;ctx.fillRect(hx-3,hy-3,6,6);}else{ctx.globalAlpha=.9;glow(hx,hy,22,col,.8);}}
    else if(o.k==='zone'){ctx.globalAlpha=.2+.5*p;ctx.strokeStyle=col;ctx.lineWidth=mob?2:3;ctx.beginPath();ctx.arc(o.x,o.y,Math.max(1,(o.r||60)*p),0,TAU);ctx.stroke();}
    else if(o.k==='cone'){const rr=(o.len||500)*p;ctx.globalAlpha=.25+.45*p;ctx.strokeStyle=col;ctx.lineWidth=mob?2:3;ctx.beginPath();ctx.arc(o.x,o.y,Math.max(1,rr),o.a-(o.arc||1)/2,o.a+(o.arc||1)/2);ctx.stroke();}}
  ctx.globalCompositeOperation='source-over';
  // эхо: холодное свечение и мерцание под врагами из прошлых секторов
  for(const e of G.enemies){if(!e.alive||!e.zbEsc||!inView(e.x,e.y,80))continue;const k=.5+.5*Math.sin(t*6+e.x*.01);ctx.globalAlpha=1;if(!mob||G.q===2)glow(e.x,e.y,e.r*2.6,C120.ice,.22+.12*k);else{ctx.globalAlpha=.6*k;ctx.strokeStyle=C120.ice;ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,e.r+6,0,TAU);ctx.stroke();}if(!mob){ctx.globalAlpha=.5*k;ctx.strokeStyle=C120.ice;ctx.lineWidth=1.2;ctx.setLineDash([3,5]);ctx.beginPath();ctx.arc(e.x,e.y,e.r+8,t*2,t*2+TAU*.8);ctx.stroke();ctx.setLineDash([]);}}
  ctx.restore();ctx.globalAlpha=1;}
function zbDraw(t){const Z=G.zb;if(!zbOn())return;zbFxDraw(Z,t);zbVfxDraw(Z,t);
  if(Z.sats&&Z.sats.length&&Z.boss&&Z.boss.alive){const e=Z.boss;ctx.save();const mob=isMob();for(const q of Z.sats){ctx.globalAlpha=.35;ctx.strokeStyle=C120.ice;ctx.lineWidth=1;if(!mob)ctx.setLineDash([3,6]);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
    if(!mob)glow(q.x,q.y,26,C120.ice,.45);ctx.save();ctx.translate(q.x,q.y);ctx.rotate(t*3+q.a);ctx.fillStyle=q.fl>0?C120.white:rgba90(C120.ice,.35);ctx.strokeStyle=C120.white;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(0,-13);ctx.lineTo(9,0);ctx.lineTo(0,13);ctx.lineTo(-9,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    const ch=Math.max(0,q.fireT/3.2);if(q.fireT<.6){ctx.strokeStyle=C120.red;ctx.lineWidth=2;ctx.beginPath();ctx.arc(q.x,q.y,17,0,TAU*(1-q.fireT/.6));ctx.stroke();}}ctx.restore();}
  if(Z.beamFx){const B=Z.beamFx;B.t-=VDT74;/* ARCH·75 A-22 */ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=rgba90(C120.white,Math.max(0,B.t/.35));ctx.lineWidth=26*Math.max(0,B.t/.35)+2;ctx.beginPath();ctx.moveTo(B.x,B.y);ctx.lineTo(B.x2,B.y2);ctx.stroke();ctx.restore();if(B.t<=0)Z.beamFx=null;}
  if(Z.ghostFx){const B=Z.ghostFx;B.t-=VDT74;/* ARCH·75 A-22 */const k=Math.max(0,B.t/.4);const q=1-k;ctx.save();ctx.translate(B.x+(B.x2-B.x)*q,B.y+(B.y2-B.y)*q);ctx.rotate(Math.atan2(B.y2-B.y,B.x2-B.x));ctx.globalAlpha=.6*k;ctx.lineJoin='round';ctx.strokeStyle=C120.rose;ctx.lineWidth=1.6;zbHull(2.2);ctx.stroke();ctx.restore();if(B.t<=0)Z.ghostFx=null;}
  if(Z.k==='end'&&Z.choice==='third'&&Z.t>3){const n=zbNode();const names=(Z.stars||[]);const k=Math.min(1,(Z.t-3)/4);ctx.strokeStyle=rgba90(C120.white,.6*k);ctx.lineWidth=1.5;ctx.beginPath();names.forEach((s,i)=>{const a=i/Math.max(1,names.length)*TAU+1;ctx.moveTo(n.x,n.y);ctx.lineTo(n.x+Math.cos(a)*900*k,n.y+Math.sin(a)*900*k);});ctx.stroke();
    names.forEach((s,i)=>{const a=i/Math.max(1,names.length)*TAU+1;zbLabel(n.x+Math.cos(a)*900*k,n.y+Math.sin(a)*900*k-14,s.name,C120.rose);});}}
// стены сектора, кромка «комнаты»
function zbWallsDraw(t){const Z=G.zb;if(!zbWalls())return;const b=zbBox(),mob=isMob();const fl=Z.k==='walls'||(Z.k==='expand'&&Z.t<1)?.6+.4*Math.sin(t*40):0;
  const segs=[];const x0=Math.max(b[0],CX-20),x1=Math.min(b[2],CX+W+20),y0=Math.max(b[1],CY-20),y1=Math.min(b[3],CY+H+20);if(x1<=x0||y1<=y0)return;
  if(b[1]>=CY-20&&b[1]<=CY+H+20)segs.push([x0,b[1],x1,b[1]]);if(b[3]>=CY-20&&b[3]<=CY+H+20)segs.push([x0,b[3],x1,b[3]]);if(b[0]>=CX-20&&b[0]<=CX+W+20)segs.push([b[0],y0,b[0],y1]);if(b[2]>=CX-20&&b[2]<=CX+W+20)segs.push([b[2],y0,b[2],y1]);if(!segs.length)return;
  const path=()=>{ctx.beginPath();for(const q of segs){ctx.moveTo(q[0],q[1]);ctx.lineTo(q[2],q[3]);}};ctx.save();
  if(fl>0){ctx.strokeStyle=C120.white;ctx.lineWidth=(mob?12:8)+10*fl;ctx.globalAlpha=.5*fl;path();ctx.stroke();}ctx.strokeStyle=C120.zero;ctx.lineWidth=mob?12:8;ctx.globalAlpha=.75;path();ctx.stroke();
  ctx.globalAlpha=.9;ctx.lineWidth=2;ctx.strokeStyle=C120.white;ctx.setLineDash([18,14]);ctx.lineDashOffset=-t*30;path();ctx.stroke();ctx.setLineDash([]);
  if(!mob&&SET.fx){ctx.globalAlpha=.3;ctx.lineWidth=1;const p=G.player;for(let i=0;i<24;i++){const x=p.x+rnd(-W,W),y=p.y+rnd(-H,H);if(x<b[0]+30||x>b[2]-30){const xx=x<b[0]+30?b[0]:b[2];ctx.beginPath();ctx.moveTo(xx,y);ctx.lineTo(xx+(xx===b[0]?1:-1)*rnd(10,40),y);ctx.stroke();}if(y<b[1]+30||y>b[3]-30){const yy=y<b[1]+30?b[1]:b[3];ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x,yy+(yy===b[1]?1:-1)*rnd(10,40));ctx.stroke();}}}
  ctx.restore();}
function zbSoftGlints(t){}
function zbScr(){const mob=isMob(),z=mob?1:(G.camZ||1),S=mob?1:SC*z;ctx.setTransform(DPR*S,0,0,DPR*S,0,0);return {vw:mob?CW:VW/z,vh:mob?CH:VH/z,mob,por:isPortrait()};}
function zbTop(t){const Z=G.zb,A=G.zbAmb;
  if(A&&A.gl.length&&!zbOn()){ctx.save();const s=zbScr();ctx.globalCompositeOperation='lighter';for(const g of A.gl){const k=Math.sin(Math.PI*g.t/g.T),x=g.x*s.vw,y=g.y*s.vh;for(const [c,dx] of [[C120.red,-1],[g.c,0],[C120.ice,1]]){ctx.strokeStyle=c;ctx.globalAlpha=.22*k;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-g.s+dx,y);ctx.lineTo(x+g.s+dx,y);ctx.moveTo(x+dx,y-g.s*.6);ctx.lineTo(x+dx,y+g.s*.6);ctx.stroke();}}ctx.restore();return;}
  if(!zbOn())return;
  if(Z.negFlash>0&&SET.fx&&!SET.lessFx){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='difference';ctx.globalAlpha=Math.min(1,Z.negFlash/.22);ctx.fillStyle='#ffffff';ctx.fillRect(0,0,cv.width,cv.height);ctx.restore();}
  if(Z.warpT>0&&SET.fx){ctx.save();ctx.setTransform(1,0,0,1,0,0);const cx=cv.width/2,cy=cv.height/2,k=Z.warpT;ctx.strokeStyle=rgba90(C120.white,.5*k);ctx.lineWidth=2*DPR;ctx.beginPath();for(let i=0;i<(isMob()?24:48);i++){const a=i*2.399+Math.floor(Z.T*2),r0=(.15+((i*37)%50)/100)*Math.max(cx,cy),r1=r0+(1-k)*Math.max(cx,cy)*.6+30*DPR;ctx.moveTo(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0);ctx.lineTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);}ctx.stroke();ctx.restore();}
  if(Z.flash>0){ctx.save();ctx.setTransform(1,0,0,1,0,0);const a=clamp(Z.flash,0,1);ctx.globalAlpha=SET.lessFx?a*.35:a*a;ctx.fillStyle='#fff4fb';ctx.fillRect(0,0,cv.width,cv.height);ctx.restore();}
  if(Z.k==='end'&&Z.choice==='third'&&Z.t<2.2){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='difference';ctx.globalAlpha=Math.min(1,Z.t*2)*(1-Math.max(0,Z.t-1.6)/.6);ctx.fillStyle='#ffffff';ctx.fillRect(0,0,cv.width,cv.height);ctx.restore();}
  if(Z.k==='end'&&Z.choice==='erase'&&Z.t>1){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=Math.min(1,(Z.t-1)/1.5)*clamp((Z.endT-Z.t)/.8,0,1);ctx.fillStyle='#000';ctx.fillRect(0,0,cv.width,cv.height);ctx.restore();}
  if(Z.vig>0){const vc=Z.stage===3&&Z.neg&&Z.neg.m==='neg'?'#e8fff8':'#ff4f6e',va=.26*Z.vig*(.7+.3*Z.beatEnv);
    if(isMob()){ctx.save();ctx.setTransform(1,0,0,1,0,0);const lw=Math.round(28*DPR);ctx.globalAlpha=Math.min(1,va*2);ctx.strokeStyle=vc;ctx.lineWidth=lw;ctx.strokeRect(lw/2,lw/2,cv.width-lw,cv.height-lw);ctx.globalAlpha=Math.min(1,va*1.2);ctx.lineWidth=lw*2.2;ctx.strokeRect(lw*1.1,lw*1.1,cv.width-lw*2.2,cv.height-lw*2.2);ctx.restore();ctx.globalAlpha=1;}// на телефоне — рамка вместо полноэкранной виньетки
    else vig95(vc,va,.3);}
  ctx.save();const s=zbScr();
  if(Z.glitch>0){const k=Math.min(1,Z.glitch/.4,(2.6-Z.glitch)/.3);ctx.font='700 '+(s.mob?22:34)+'px "JetBrains Mono",monospace';ctx.textAlign='center';const txt='ТОЧКА НЕВОЗВРАТА ОТКРЫТА',y=s.vh*.36;
    for(let i=0;i<3;i++){const dx=(SET.fx?rnd(-6,6)*(1-k*.7):0),dy=i*rnd(-2,2);ctx.globalAlpha=.9*k*(i?.5:1);ctx.fillStyle=i===1?C120.red:i===2?C120.ice:C120.white;ctx.fillText(txt,s.vw/2+dx+(i-1)*3,y+dy);}
    if(SET.fx){ctx.globalAlpha=.35*k;ctx.fillStyle=C120.zero;for(let i=0;i<8;i++)ctx.fillRect(Math.random()*s.vw,y-30+Math.random()*40,rnd(30,200),1.5);}
    ctx.font='700 '+(s.mob?11:13)+'px "JetBrains Mono",monospace';ctx.globalAlpha=.8*k;ctx.fillStyle=C120.zero;ctx.fillText('КАРТА — ПОМЕХИ · ТЕЛЕПОРТ ЗАКРЫТ · ОН ИДЁТ',s.vw/2,y+(s.mob?22:30));ctx.globalAlpha=1;}
  if(Z.k==='end'){const T={erase:'КОЛЬЦО ЗАМКНУТО · ЦИКЛ '+((G.save.cycle||1)+1),recall:'ОН ВСПОМНИЛ · VØID-013',third:'КОЛЬЦО РАЗОМКНУТО'}[Z.choice];const k=clamp((Z.t-1)/1,0,1);ctx.font='700 '+(s.mob?20:30)+'px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.globalAlpha=k;ctx.fillStyle=C120.white;ctx.fillText(T,s.vw/2,s.vh*.66);ctx.globalAlpha=1;}
  // он за краем экрана — стрелка у кромки (красная, если у него телеграф)
  if((zbF()||Z.k==='race')&&Z.boss&&Z.boss.alive){const e=Z.boss,k=s.mob?SC:1/(G.camZ||1),ux=(e.x-CX)*k,uy=(e.y-CY)*k,m=26,top=s.por?240:s.mob?40:130,bot=s.mob?s.vh*(s.por?.62:.8):s.vh-60;
    if(ux<m||ux>s.vw-m||uy<top||uy>bot){const cx=clamp(ux,m,s.vw-m),cy=clamp(uy,top,bot),a=Math.atan2(uy-cy,ux-cx)||Math.atan2(uy-s.vh/2,ux-s.vw/2);const hot=(G.wtg95||[]).some(o=>o.zb&&o.st==='warn'&&o.src===e);
      ctx.save();ctx.translate(cx,cy);ctx.rotate(a);ctx.globalAlpha=.6+.3*Math.sin(t*8);ctx.fillStyle=hot?C120.red:C120.zero;ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(-8,-10);ctx.lineTo(-3,0);ctx.lineTo(-8,10);ctx.closePath();ctx.fill();ctx.restore();ctx.globalAlpha=1;}}
  if(zbF()||Z.k==='race'){zbBar(Z,s,t);if(Z.stage===4&&Z.k==='fight'&&zbDiffK().lane)zbLane(Z,s,t);}
  ctx.restore();}
function zbStatus(Z){const e=Z.boss;if(Z.leaveT>0)return ['ВНЕ АРЕНЫ · СБРОС ЧЕРЕЗ '+Math.max(0,5-Z.leaveT).toFixed(1),C120.warm];if(Z.k==='race')return ['ГОНКА · РЫВОК СКВОЗЬ НЕГО СБИВАЕТ',C120.white];if(Z.k==='seg')return ['СЕГМЕНТ СНЯТ',C120.white];
  if(Z.stun>0)return ['СБОЙ · ×2,5 · '+Z.stun.toFixed(1),C120.white];
  if(Z.stage===3){const N=Z.neg;if(N.m==='tg')return ['НЕГАТИВ ЧЕРЕЗ '+Math.max(0,1.5-N.t).toFixed(1),C120.mint];if(N.m==='neg')return ['НЕГАТИВ · СНАРУЖИ · ×1,5 · '+Math.max(0,6-N.t).toFixed(1),C120.mint];if(N.m==='back')return ['ВНУТРЬ ЧЕРЕЗ '+Math.max(0,1.5-N.t).toFixed(1),C120.mint];}
  if(Z.out)return ['ВНЕ ФИГУРЫ',C120.red];
  if(Z.stance>0)return ['ЗАХОДИТЕ СБОКУ · ×2',C120.white];
  if(Z.cool>0)return ['ОСТЫВАЕТ · ×1,5',C120.white];
  if(Z.stage===2)return [Z.novaT>0?'НОЛЬ · К КРАЮ':'ОТСЧЁТ '+Math.max(0,Math.ceil(Z.count)),Z.count<=3||Z.novaT>0?C120.red:C120.gold];
  if(Z.stage===4&&Z.hp<=Z.segMax*.3)return ['СКОРО ГОНКА',C120.warm];
  return ['БЕЙТЕ В КОРМУ · ×1,5',C120.rose];}
function zbBreathIn(Z){const S=Z.shape;if(Z.stage===3&&Z.neg.m!=='norm')return -1;if(S.next)return S.tg;return (S.morph<1?(1-S.morph)*1.2:0)+Math.max(0,S.hold)+1.8;}
function zbBar(Z,s,t){const w=Math.min(520,s.vw*(s.por?.9:s.mob?.4:.6)),h=s.mob?10:12,x0=(s.mob&&!s.por?s.vw*.56:s.vw/2)-w/2,y0=s.por?176:s.mob?8:64,gap=6,sw=(w-gap*(ZB_N-1))/ZB_N,lh=s.mob?12:14;
  ctx.fillStyle='rgba(8,3,8,.72)';ctx.fillRect(x0-6,y0-6,w+12,h+12+6+lh*2);
  const bonus=Z.boss&&zbOpenNow(Z,Z.boss);
  for(let i=0;i<ZB_N;i++){const x=x0+i*(sw+gap),v=Z.seg[i],cur=i===Z.stage-1;ctx.strokeStyle=cur?(bonus?C120.white:rgba90(C120.white,.6)):rgba90(C120.zero,.6);ctx.lineWidth=cur&&bonus?2:1;ctx.strokeRect(x+.5,y0+.5,sw-1,h-1);
    if(v>0){ctx.fillStyle=i<Z.stage-1?rgba90(C120.dim,.5):cur&&bonus?C120.white:C120.zero;ctx.fillRect(x+1,y0+1,(sw-2)*clamp(v,0,1),h-2);}
    if(cur&&Z.k==='fight'&&SET.fx&&Z.beatEnv>.5&&Z.stage===4){ctx.fillStyle=rgba90(C120.white,.25*Z.beatEnv);ctx.fillRect(x+1,y0+1,sw-2,h-2);}}
  // шкала сбоя
  {const sy=y0+h+3,v=Z.stun>0?Z.stun/3:Z.stg/100;ctx.fillStyle=rgba90(C120.dim,.55);ctx.fillRect(x0,sy,w,3);ctx.fillStyle=Z.stun>0?C120.white:Z.stg>=85&&Math.sin(t*20)>0?C120.white:C120.warm;ctx.fillRect(x0,sy,w*clamp(v,0,1),3);}
  const f='700 '+(s.mob?10:11)+'px "JetBrains Mono",monospace';ctx.font=f;const y1=y0+h+6+lh-2,y2=y1+lh;
  const st=ZST[Z.stage];ctx.textAlign='left';ctx.fillStyle=C120.zero;ctx.fillText('VØID-000 · '+Z.stage+'/4 · '+st.n,x0,y1);
  const [r,rc]=zbStatus(Z);ctx.textAlign='right';ctx.fillStyle=rc;ctx.fillText(r,x0+w,y1);
  // полоса дыхания: три следующих
  ctx.textAlign='left';const bi=zbBreathIn(Z);ctx.fillStyle=rgba90(C120.white,.7);ctx.fillText('ДЫХАНИЕ',x0,y2);let bx=x0+ctx.measureText('ДЫХАНИЕ ').width;
  if(bi<0||Z.k==='race'){ctx.fillStyle=rgba90(C120.white,.5);ctx.fillText(Z.k==='race'?'—':'СТОИТ',bx,y2);}
  else{for(let k=0;k<3;k++){const ty=zbBreathType(Z,k),col=ty==='E'?C120.mint:C120.red,cy=y2-(s.mob?4:4.5),sz=k===0?5:4;ctx.globalAlpha=k===0?1:.55;ctx.fillStyle=col;ctx.beginPath();if(ty==='E'){ctx.moveTo(bx,cy+sz);ctx.lineTo(bx+sz,cy-sz);ctx.lineTo(bx+2*sz,cy+sz);}else{ctx.moveTo(bx,cy-sz);ctx.lineTo(bx+sz,cy+sz);ctx.lineTo(bx+2*sz,cy-sz);}ctx.closePath();ctx.fill();bx+=2*sz+7;}
    ctx.globalAlpha=1;ctx.fillStyle=Z.shape.next?(Z.shape.next.type==='E'?C120.mint:C120.red):rgba90(C120.white,.7);ctx.fillText(bi.toFixed(1),bx+2,y2);}
  ctx.textAlign='right';ctx.fillStyle=Z.stun>0?C120.white:rgba90(C120.warm,.9);ctx.fillText(Z.stun>0?'СБОЙ':'СБОЙ '+Math.round(Z.stg)+'%',x0+w,y2);ctx.textAlign='left';}
function zbLane(Z,s,t){const span=2.6,w=Math.min(440,s.vw*(s.por?.92:s.mob?.5:.72)),h=s.mob?22:24,x0=s.vw/2-w/2,y0=s.por?232:s.mob?s.vh-h-8:s.vh-150;
  const marks=[];let acc=-Z.beatT,n=Z.beatN;for(let i=0;i<6;i++){acc+=ZB_BEAT;n++;marks.push({t:acc,arr:n%4===0});}
  ctx.fillStyle='rgba(8,3,5,.72)';ctx.fillRect(x0,y0,w,h);ctx.strokeStyle=rgba90(C120.zero,.45);ctx.lineWidth=1;ctx.strokeRect(x0,y0,w,h);
  const hx=x0+34,pw=zbDiffK().win/span*(w-44);ctx.fillStyle=rgba90('#ffffff',zbBeatOff(Z)<=zbDiffK().win?.3:.1);ctx.fillRect(hx-pw,y0+2,pw*2,h-4);
  ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(hx,y0-3);ctx.lineTo(hx,y0+h+3);ctx.stroke();
  for(const m of marks){if(m.t<0||m.t>span)continue;const x=hx+m.t/span*(w-44);ctx.fillStyle=m.arr?C120.red:C120.warm;ctx.beginPath();ctx.moveTo(x,y0+3);ctx.lineTo(x+5,y0+h/2);ctx.lineTo(x,y0+h-3);ctx.lineTo(x-5,y0+h/2);ctx.closePath();ctx.fill();}
  ctx.font='700 '+(s.mob?11:9)+'px "JetBrains Mono",monospace';ctx.fillStyle=rgba90(C120.gold,.7);ctx.textAlign='left';ctx.fillText('ТАКТ',x0+4,y0+h/2+3);ctx.textAlign='right';ctx.fillStyle=rgba90(C120.red,.8);ctx.fillText('КРАСНЫЙ — ВЫПАД',x0+w-4,y0+h/2+3);ctx.textAlign='left';}
// --- узел 50: круглая тёплая кнопка ---
function zbDrawNode(n,t){const done=zbDone(),Z=G.zb,fight=zbOn();ctx.save();ctx.translate(n.x,n.y);const k=.5+.5*Math.sin(t*(50/60)*TAU);
  glow(0,0,180,C120.warm,(fight?.1:.22)+.12*k);ctx.strokeStyle=rgba90(C120.zero,.5);ctx.lineWidth=1.5;ctx.setLineDash([10,14]);ctx.lineDashOffset=-t*10;ctx.beginPath();ctx.arc(0,0,120,0,TAU);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#160a14';ctx.strokeStyle=done?C120.ice:C120.warm;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,46,0,TAU);ctx.fill();ctx.stroke();
  ctx.fillStyle=rgba90(done?C120.ice:C120.warm,.35+.4*k);ctx.beginPath();ctx.arc(0,0,28,0,TAU);ctx.fill();ctx.restore();
  if(!fight){zbLabel(n.x,n.y-64,'50 · НУЛЕВОЙ МИГ',C120.zero);zbLabel(n.x,n.y+74,done?'КНОПКА ОСТЫЛА · ВЕРНУТЬСЯ':G.zbCool>G.t?'ТОЧКА НЕВОЗВРАТА ЗАКРЫТА · '+Math.ceil(G.zbCool-G.t):'КНОПКА ЕЩЁ ТЁПЛАЯ',done?C120.ice:C120.warm);}
  if(done){const md=G.save.medals[50]||{};[md.clear,md.clean,md.master].forEach((on,i)=>{ctx.fillStyle=on?'#ffb84d':'#26324a';ctx.beginPath();ctx.arc(n.x-10+i*10,n.y+88,3.5,0,TAU);ctx.fill();});}}
const ZB_J={64:[['«Я БЫЛ ПЕРВЫМ, КТО НАЖАЛ» · ЗАПИСЬ 64','Кнопка была тёплой, потому что её только что нажали. Я. Каждый раз — я. Кольцо внутри кольца.'],['«Я ВСПОМНИЛ, ЧТО БЫЛ ИМ» · ЗАПИСЬ 64','Номер 013 ждал меня тринадцать циклов. Я не нажал. Это и есть ответ: не нажимать.']],65:[['«ТРЕТИЙ ПУТЬ» · ЗАПИСЬ 65','Они держали линии, пока я входил. Созвездие без имени получило имя. Кольцо разомкнуто — не стёрто, а дописано.']]};
function zbJournalsHTML(S){const J=S&&S.story&&S.story.zbJ;if(!S)return '';const rows=[];if(J&&J.e)rows.push(ZB_J[64][0]);if(J&&J.r)rows.push(ZB_J[64][1]);if(J&&J.t)rows.push(ZB_J[65][0]);
  return `<div class="jsec">ЗАПИСИ НУЛЕВОГО МИГА <small>${rows.length}/3</small></div>`+(rows.length?rows.map(q=>`<div class="jr"><h4>${q[0]}</h4><p>${q[1]}</p><div class="meta"><span>СЕКТОР XII · НУЛЕВОЙ МИГ · VØID-000</span></div></div>`).join(''):'<div class="jr lockd"><h4>НЕ НАЙДЕНО</h4><p>Их пишет тот, кто первым касается кнопки. Три концовки — три записи.</p></div>');}
function zbCard(){const done=zbDone(),cool=G.zbCool>G.t,S=G.save,st=S.story||{};const end=st.zero50;
  return `<div class="eyebrow">МИССИЯ 50${done?' · ПРОЙДЕНА':''}</div><h3>Нулевой миг <span class="badge" style="color:#ff9fe0">VØID-000</span></h3><p class="note">${done?'Кнопка остыла. '+(end===1?'Кольцо замкнуто.':end===2?'Он вспомнил.':'Кольцо разомкнуто.')+' Вернуться — значит пройти все четыре стадии заново; выбор у кнопки можно сделать иначе.':'Комната босса за кнопкой. Он повторяет вас. Контрольных точек нет: гибель возвращает сюда.'}</p><div class="wc-row"><button class="wbtn" data-act="main" ${cool?'disabled style="opacity:.45"':''}>${cool?'ТОЧКА НЕВОЗВРАТА ЗАКРЫТА':done?'ВЕРНУТЬСЯ К КНОПКЕ [F]':'ВОЙТИ В КОМНАТУ [F]'}</button></div>`;}
// --- карта и мини-карта: помехи, игрок в центре, босс ---
function zbMapStatic(g,w,h,s,Z,t){g.fillStyle='#050208';g.fillRect(0,0,w,h);const n=Math.round(w*h/900);g.globalAlpha=.5;for(let i=0;i<n;i++){g.fillStyle=Math.random()<.5?'#2a1a28':'#4a2a44';g.fillRect(Math.random()*w,Math.random()*h,rnd(2,14),1);}
  g.globalAlpha=.08;g.fillStyle=C120.zero;for(let y=((t*120)%6);y<h;y+=6)g.fillRect(0,y,w,1);g.globalAlpha=1;
  const p=G.player,e=Z.boss,k=s;g.strokeStyle=rgba90(C120.zero,.6);g.lineWidth=1.5;const b=zbBox();g.strokeRect(w/2+(b[0]-p.x)*k,h/2+(b[1]-p.y)*k,(b[2]-b[0])*k,(b[3]-b[1])*k);
  if(e&&e.alive){const x=w/2+(e.x-p.x)*k,y=h/2+(e.y-p.y)*k;g.fillStyle=C120.zero;g.beginPath();g.arc(x,y,5,0,TAU);g.fill();g.strokeStyle=C120.white;g.beginPath();g.arc(x,y,9+4*Z.beatEnv,0,TAU);g.stroke();}
  if(zbF()||Z.k==='race'){const P=zbPoly(Z);g.strokeStyle=rgba90(C120.rose,.8);g.lineWidth=1.2;g.beginPath();P.forEach((q,i)=>{const x=w/2+(q[0]-p.x)*k,y=h/2+(q[1]-p.y)*k;i?g.lineTo(x,y):g.moveTo(x,y);});g.closePath();g.stroke();if(zbRadIn(Z,0)>0){const Pi=zbPoly(Z,true);g.beginPath();Pi.forEach((q,i)=>{const x=w/2+(q[0]-p.x)*k,y=h/2+(q[1]-p.y)*k;i?g.lineTo(x,y):g.moveTo(x,y);});g.closePath();g.stroke();}}
  const nd=zbNode();{const x=w/2+(nd.x-p.x)*k,y=h/2+(nd.y-p.y)*k;g.strokeStyle=C120.warm;g.strokeRect(x-4,y-4,8,8);}
  g.fillStyle='#ffffff';g.beginPath();g.arc(w/2,h/2,3.5,0,TAU);g.fill();}
function zbMap(){if(!zbOn()||G.zb.k==='silence')return false;const c=$('#mapC'),Z=G.zb;if(!c)return false;const w=Math.max(200,c.clientWidth),h=isMob()?Math.max(180,Math.round(innerHeight-c.getBoundingClientRect().top-(innerWidth>innerHeight?14:96)-SAFE.b)):Math.round(w<520?Math.min(w*1.15,innerHeight*.62):Math.min(w*.56,innerHeight*.62));
  if(c.width!==Math.round(w*DPR)||c.height!==Math.round(h*DPR)){c.width=Math.round(w*DPR);c.height=Math.round(h*DPR);c.style.height=h+'px';}
  const g=c.getContext('2d');g.setTransform(DPR,0,0,DPR,0,0);zbMapStatic(g,w,h,Math.min(w,h)/2/1500,Z,performance.now()/1000);
  g.font='700 12px "JetBrains Mono",monospace';g.textAlign='center';g.fillStyle=C120.zero;g.fillText('КАРТА · ПОМЕХИ · ТЕЛЕПОРТ ЗАКРЫТ',w/2,22);g.fillStyle=C120.white;g.fillText('ТОЧКА НЕВОЗВРАТА',w/2,h-14);G.mapXY=null;return true;}
function zbMini(){if(!zbOn()||G.zb.k==='silence')return false;const c=$('#mini');if(!c)return false;const g=c.getContext('2d'),s=c.width;g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,s,s);g.save();g.beginPath();g.arc(s/2,s/2,s/2-1,0,TAU);g.clip();zbMapStatic(g,s,s,s/2/1400,G.zb,performance.now()/1000);g.restore();return true;}
function zbHud(){if(!zbOn())return;const Z=G.zb;const st=ZST[Z.stage];
  setT('wSec',Z.k==='fight'||Z.k==='seg'||Z.k==='race'?'VØID-000 · СТАДИЯ '+Z.stage+' · '+st.n:Z.k==='silence'?'СЕКТОР XII · ???':Z.k==='end'?'НУЛЕВОЙ МИГ':'ТОЧКА НЕВОЗВРАТА');
  setT('wSub',Z.k==='race'?'ГОНКА · КТО ПЕРВЫЙ КОСНЁТСЯ КНОПКИ':Z.k==='fight'||Z.k==='seg'?st.hint+(Z.cycles?' · ЦИКЛОВ '+Z.cycles:''):Z.k==='silence'?'…':Z.k==='end'?'':'КАРТА — ПОМЕХИ · ТЕЛЕПОРТ ЗАКРЫТ');}
// --- музыка и звук ---
SC_.zbg={name:'Нулевой миг · цель',root:46,v:[[0,7,14,19],[-5,2,7,14],[0,5,12,17]],chordT:[12,18],pad:['sine',360,820,.04],sub:.09,noise:['lowpass',480,.012,.04],bell:['glass',8,14,.02],rev:.78,fight:1,bpm:50,pulse:'q',toms:'fight',choir:1,vol:.86,zb:1};
SC_.zbd={name:'Нулевой миг · бой',root:46,v:[[0,7,14,19],[-3,4,9,14]],chordT:[8,12],pad:['triangle',380,980,.034],sub:.11,noise:['bandpass',1000,.012,.09],bell:['metal',10,16,.016],rev:.5,fight:1,bpm:100,pulse:'q',toms:'fight',heavy:1,mech:1,vol:.95,zb:1};
SC_.zbr={name:'Нулевой миг · гонка',root:46,v:[[0,7,12,19]],chordT:[4,6],pad:['sawtooth',420,1100,.03],sub:.14,noise:['bandpass',1400,.014,.1],bell:null,rev:.35,fight:1,bpm:120,pulse:'q',toms:'fight',heavy:1,vol:1,zb:1};
SC_.zbc={name:'Нулевой миг · кнопка',root:46,v:[[0,7,12,19]],chordT:[30,40],pad:['sine',300,600,.03],sub:.05,noise:['lowpass',300,.008,.02],bell:null,rev:.9,alert:1,vol:.5,bpm:50,zb:1};
function zbMus(){if(!zbOn())return null;const Z=G.zb;if(Z.k==='choice'||Z.k==='end'||Z.k==='silence')return {id:'zbc',I:0};if(Z.k==='race')return {id:'zbr',I:1};if(Z.k==='fight'||Z.k==='seg'){const g=ZST[Z.stage].g;return {id:g?'zbg':'zbd',I:g?.6:1,ext:{bpmAdd:Z.stage*4}};}return {id:'zbc',I:.2};}
const SND120={};
function snd120(kind,x){if(!AU.ctx||!SET.sfx||!AU.sfx)return;const c=AU.ctx,t=c.currentTime;const now=performance.now();if(SND120[kind]&&now-SND120[kind]<60)return;SND120[kind]=now;
  if(typeof vox95==='function'&&!vox95(.4,['wall','expand','banner','rift','seg','stage','race','choice','cycle','erase','recall','third','zero','ram','stun','neg','novaTg','inhale','exhale'].includes(kind)))return;
  const pan=x===undefined||!isFinite(x)?0:clamp(((x-CX)/(VW||W))*2-1,-.6,.6);
  const out=()=>{if(pan&&c.createStereoPanner){const q=c.createStereoPanner();q.pan.value=pan;q.connect(AU.sfx);return q;}return AU.sfx;};
  const tone=(f0,f1,dur,type,vol,delay)=>{delay=delay||0;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f0,t+delay);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+delay+dur);g.gain.setValueAtTime(.0001,t+delay);g.gain.linearRampToValueAtTime(vol,t+delay+.012);g.gain.exponentialRampToValueAtTime(.0001,t+delay+dur);o.connect(g);g.connect(out());o.start(t+delay);o.stop(t+delay+dur+.03);};
  const noise=(dur,vol,f,type,delay,f2,q)=>{delay=delay||0;const s=c.createBufferSource();s.buffer=noiseBuf95(c);const fl=c.createBiquadFilter();fl.type=type||'lowpass';if(q)fl.Q.value=q;fl.frequency.setValueAtTime(f,t+delay);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+delay+dur);const g=c.createGain();g.gain.setValueAtTime(vol,t+delay);g.gain.linearRampToValueAtTime(.0001,t+delay+dur);s.connect(fl);fl.connect(g);g.connect(out());s.start(t+delay,Math.random()*1.4,dur+.05);};
  switch(kind){
    case 'inTg':noise(.05,.04,3000,'highpass');tone(330,520,1.6,'sine',.018);break;
    case 'outTg':noise(.05,.04,3000,'highpass');tone(520,300,1.6,'sine',.018);break;
    case 'inhale':noise(1.1,.06,300,'bandpass',0,2600,1.5);tone(220,440,1,'sine',.03);break;
    case 'exhale':noise(1.1,.07,2400,'bandpass',0,260,1.5);tone(300,120,1,'sine',.035);tone(90,60,.6,'sawtooth',.02,.2);break;
    case 'stun':noise(.3,.14,5000,'highpass',0,800);tone(900,120,.6,'square',.04);tone(1600,2200,.3,'sine',.03,.1);break;
    case 'stunEnd':tone(200,420,.3,'sine',.03);break;
    case 'seam':tone(2400,2100,.04,'square',.012);break;
    case 'cool':noise(.6,.05,5000,'highpass',0,1200);break;
    case 'frag':tone(1320,1760,.12,'sine',.03);tone(1760,2200,.15,'sine',.022,.06);break;
    case 'mineSet':tone(500,420,.1,'triangle',.02);break;
    case 'mineArm':tone(1500,1500,.06,'square',.02);tone(1500,1500,.06,'square',.02,.1);break;
    case 'mineBoom':noise(.35,.12,300,'lowpass',0,1800);tone(140,50,.35,'sine',.08);break;
    case 'sing':noise(1.2,.06,200,'bandpass',0,1400,4);tone(60,120,1.2,'sine',.06);break;
    case 'negTg':tone(880,440,.25,'square',.02);tone(880,440,.25,'square',.02,.35);tone(880,440,.25,'square',.02,.7);break;
    case 'neg':noise(.6,.1,6000,'highpass',0,300);tone(150,75,.6,'sawtooth',.04);break;
    case 'stance':tone(1800,1800,.5,'sine',.02);tone(2700,2700,.4,'sine',.012,.05);break;
    case 'repeat':for(let i=0;i<5;i++)tone(600+i*80,600+i*80,.06,'triangle',.012,i*.06);break;
    case 'novaTg':tone(80,40,1.2,'sawtooth',.05);noise(1.2,.06,200,'lowpass',0,1200);break;
    case 'cloneDie':noise(.3,.08,3000,'highpass',0,600);tone(900,300,.3,'triangle',.03);break;
    case 'clean':tone(1800,2400,.12,'sine',.03);break;
    case 'press':tone(1200,900,.08,'square',.012);break;
    case 'wall':tone(70,40,1.2,'sine',.16);noise(.4,.08,300,'lowpass',0,120);tone(2400,1800,.5,'triangle',.02,.05);break;
    case 'expand':noise(2.3,.07,200,'lowpass',0,5000);tone(110,330,2.2,'sine',.04);break;
    case 'static':noise(1.2,.03,3000,'highpass');break;
    case 'banner':tone(1800,400,.3,'sawtooth',.02);tone(1400,300,.3,'sawtooth',.02,.12);tone(900,200,.4,'sawtooth',.02,.24);noise(.3,.03,4000,'highpass');break;
    case 'rift':noise(1.8,.12,120,'lowpass',0,2400);tone(50,28,1.6,'sine',.2);tone(2600,5200,1.2,'sine',.02,.2);break;
    case 'beat':tone(62,40,.22,'sine',.09);tone(90,60,.1,'triangle',.03);break;
    case 'shapeTg':noise(.04,.05,4200,'highpass');tone(660,640,1.4,'sine',.014);break;
    case 'shape':noise(.5,.07,500,'bandpass',0,2200,2);tone(280,140,.5,'sine',.035);tone(140,280,.3,'sine',.02,.25);break;
    case 'out':tone(70,66,.22,'sawtooth',.02);noise(.2,.02,800,'bandpass');break;
    case 'edge':tone(900,600,.12,'sine',.03);break;
    case 'seg':noise(.08,.12,6000,'highpass');tone(1600,1600,.06,'square',.03);tone(523,523,.9,'sine',.03,.4);tone(784,784,1,'sine',.024,.5);break;
    case 'stage':tone(330,330,.5,'sine',.03);tone(495,495,.6,'sine',.024,.15);break;
    case 'copy':for(let i=0;i<5;i++)tone(220*(1+i*.003),220,1.2,'sawtooth',.012,i*.03);break;
    case 'deflect':tone(2200,1500,.07,'triangle',.02);noise(.05,.02,5000,'highpass');break;
    case 'open':noise(.25,.08,3000,'highpass',0,600);tone(1800,500,.3,'sine',.035);tone(900,1300,.25,'triangle',.02,.08);break;
    case 'mirror':tone(500,1600,.25,'sine',.03);noise(.12,.03,4000,'highpass');break;
    case 'ram':noise(.2,.1,400,'lowpass',0,2500);tone(160,60,.3,'square',.04);tone(1200,400,.15,'triangle',.02);break;
    case 'beamHit':noise(.18,.08,1800,'bandpass',0,300,2);tone(300,120,.2,'sawtooth',.04);break;
    case 'lunge':noise(.35,.1,600,'bandpass',0,3200);tone(240,90,.35,'sawtooth',.05);tone(2000,900,.2,'sine',.02,.05);break;
    case 'allyShot':tone(1300,900,.06,'triangle',.014);break;
    case 'tick':noise(.03,.05,4200,'highpass');tone(1200,1200,.035,'square',.008);break;
    case 'tock':noise(.04,.06,3200,'highpass');tone(800,790,.07,'square',.012);break;
    case 'zero':noise(1,.1,200,'lowpass',0,3000);tone(60,30,.9,'sine',.16);break;
    case 'perfect':noise(.05,.08,6000,'highpass');tone(1400,1400,.09,'sine',.03);break;
    case 'ally':tone(880,880,.4,'sine',.03);tone(1320,1320,.5,'sine',.022,.12);break;
    case 'echoShot':tone(700,300,.12,'triangle',.02);break;
    case 'dash':noise(.3,.08,800,'bandpass',0,3000);tone(200,80,.3,'sawtooth',.04);break;
    case 'pulse':noise(.4,.08,300,'lowpass',0,2000);tone(120,60,.4,'sine',.08);break;
    case 'beam':noise(.5,.1,2000,'bandpass',0,400,3);tone(1800,900,.4,'sawtooth',.03);break;
    case 'fan':for(let i=0;i<4;i++)tone(900-i*90,700-i*90,.08,'triangle',.014,i*.04);break;
    case 'wake':noise(.5,.05,180,'lowpass',0,1200);tone(220,110,.5,'triangle',.03);break;
    case 'race':[60,90,120].forEach((f,i)=>tone(f,f*1.5,.5,'sine',.1,i*.25));noise(.6,.06,1500,'highpass');break;
    case 'cycle':noise(.6,.12,6000,'highpass');tone(1200,200,.8,'sawtooth',.04);break;
    case 'choice':tone(55,55,4,'sine',.08);break;
    case 'erase':noise(2.5,.14,100,'lowpass',0,8000);tone(40,20,2.5,'sine',.2);break;
    case 'recall':[523,659,784].forEach((f,i)=>tone(f,f*.5,3,'sine',.03,i*.6));break;
    case 'third':[262,330,392,523,659].forEach((f,i)=>tone(f,f,3,'sine',.028,i*.4));break;}}
// --- данные миссии 50 и справка ---
(function mission120(){const M50=MISSIONS[49];if(!M50)return;
  Object.assign(M50,{name:'Нулевой миг',sector:'СЕКТОР XII · НУЛЕВОЙ МИГ',sec:11,bossRoom:true,sboss:null,boss:undefined,intro:[],debut:undefined,wavesT:[],hpMul:1,
    mech:['ОН ВЫХОДИТ САМ · ОН ПОВТОРЯЕТ ВАС','ПРОСТРАНСТВО ДЫШИТ · ВЫДОХ, ВЫДОХ, ВДОХ','4 СТАДИИ · БЕЗ КОНТРОЛЬНЫХ ТОЧЕК'],
    hint:['Босс не ждёт в комнате: нажмите «Войти в комнату» — и VØID-000 выйдет в сектор сам. Карта глохнет, телепорт закрыт. Урон по нему проходит всегда: корма ×1,5, остывание после крупной атаки ×1,5, шкала сбоя (урон, заряд, таран, импульс, осколки) — 3 с ×2. Пространство дышит: выдох, выдох, вдох; полоса «ДЫХАНИЕ» показывает три следующих, вдох дарит осколки. Снаружи через 1,5 с — стирание. «Зеркало»: он в вашей зеркальной точке, бросается сквозь центр и повторяет ваш след; на 50% — две копии. «Отсчёт»: стрелки держат середину, у края безопасно; таран рывком +4 с к счёту; на нуле стол взрывается — к краю.','«Негатив»: каждые ~14 с мир выворачивается на 6 с — выходите наружу, он выходит за вами и обнажён ×1,5; на вдохе — воронка. Перед зеркальным лучом он ставит щит спереди: заходите сбоку ×2. «Кнопка»: атаки в такт сердца, выпад на красном такте, в такт — двойной урон; помилованные стреляют по нему. На 20% — гонка к кнопке; рывок сквозь него сбивает его на 0,6 с; его касание — 60%. Гибель — цикл заново, у кнопки, с разбором: что стёрло и что делать иначе.']});
  MASTERY[49]={t:'Пройти все четыре стадии без единого повтора цикла',ok:()=>false};
  if(typeof CODEX_ORDER!=='undefined'&&!CODEX_ORDER.includes('zero000'))CODEX_ORDER.push('zero000');
})();

