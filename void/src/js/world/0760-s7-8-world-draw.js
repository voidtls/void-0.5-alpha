// ===== открытый мир секторов VII–VIII =====
const W80={gen:false,zones:[],pults:[],range:null,melt:null,leaks:[],near:[],nearT:0,alarm:null,dummy:null,rlog:[],last:0,radioT:0,boPh:-1};
function w80Gen(){if(W80.gen||!WORLD.sectors[7]||!G.save)return;W80.gen=true;const N=WORLD.nodes,ex=[...WORLD.shops,WORLD.hangar,WORLD.arsenal].filter(Boolean);
  const okAt=(x,y,dn,dp)=>w58Far(x,y,N,dn)&&w58Far(x,y,W80.zones,dp)&&w58Far(x,y,W80.pults,dp)&&w58Far(x,y,ex,800)&&inSectors(x,y)&&WORLD.sectors.every(sc=>!sc.bx||Math.hypot(x-sc.bx,y-sc.by)>900);
  const ZS=[[6,'КОНВОЙ «УТИЛИЗАЦИЯ»','convoy',28],[6,'РЕВИЗИЯ','audit',28],[7,'ПАЛОМНИКИ','pilgrims',32]];
  const pick=(sec,seed)=>{for(const [dn,dz] of [[1300,1700],[1300,1400],[1300,1150],[1150,1000]]){const R=mulberry(seed);const q=w58Pt(sec,R,(x,y)=>okAt(x,y,dn,dz),500);if(w58Far(q.x,q.y,N,dn)&&w58Far(q.x,q.y,W80.zones,dz))return q;}return pt80(sec,seed,(x,y,k)=>okAt(x,y,900*k,900*k),500);};
  ZS.forEach(([sec,name,k,after],i)=>{const q=pick(sec,8000+i*41);const z={x:q.x,y:q.y,home:{x:q.x,y:q.y},req:0,set:[],w58:1,sec,after,name,lead:null,reinf:{},idx:1200+i,k74:'x80',k80:k,cool:0};W80.zones.push(z);WORLD.zones.push(z);W58.zones.push(z);});
  const GZ=[[6,'СМЕНА',['labrat','defect','gunner'],['hunter',['armor']],28],[6,'БРАКОВКА',['defect','stamp','phantom'],['shade',['fast']],28],[7,'ОТРАЖЕНИЯ',['echo80','phantom','shocker'],['hunter',['armor']],32],[7,'ПЕТЛИ',['loop','gunner','mirror'],['shade',['boom']],32]];
  GZ.forEach(([sec,name,set,lead,after],i)=>{const q=pick(sec,8100+i*43);const z={x:q.x,y:q.y,req:0,set,w58:1,sec,after,name,lead,reinf:{},idx:1210+i,z80g:1};W80.zones.push(z);WORLD.zones.push(z);W58.zones.push(z);});
  for(let i=0;i<3;i++){const q=pt80(6,8200+i*17,(x,y,k)=>okAt(x,y,700*k,1500*k)&&w58Far(x,y,W80.pults,Math.max(900,1500*k)),400);W80.pults.push({x:q.x,y:q.y,i,ch:0});}
  {const q=pt80(6,8301,(x,y,k)=>okAt(x,y,900*k,1200*k)&&W80.zones.every(z=>Math.abs(x-z.x)>1500*k||Math.abs(y-z.y)>1100*k)&&W80.pults.every(p_=>Math.abs(p_.x-x)>560||Math.abs(p_.y-y)>460),600);W80.range={x:q.x,y:q.y,w:600,h:400};}
  {const cz=W80.zones[0];const q=pt80(6,8302,(x,y,k)=>okAt(x,y,800*k,900*k)&&Math.hypot(x-cz.x,y-cz.y)>1600*k&&!inRange80(x,y,250),500);W80.melt={x:q.x,y:q.y};}
  for(let i=0;i<7;i++){const q=pt80(6,8400+i*13,(x,y,k)=>w58Far(x,y,N,600*k)&&w58Far(x,y,W80.leaks,Math.max(450,700*k))&&inSectors(x,y)&&!inRange80(x,y,Math.max(250,400*k))&&w58Far(x,y,W80.pults,350),300);W80.leaks.push({x:q.x,y:q.y,r:220+Math.round(mulberry(8450+i)()*100)});}
  {const n38=N.find(n=>n.m===38),b=WORLD.sectors[7].box;W80.dest=n38?{x:n38.x,y:n38.y}:{x:(b[0]+b[2])/2,y:(b[1]+b[3])/2};}}
// размещение с постепенным ослаблением дистанций; в худшем случае — самая свободная точка (не центр сектора)
function pt80(sec,seed,fn,m){m=m||300;for(const k of [1,.8,.65,.5,.38,.27]){const q=w58Pt(sec,mulberry(seed),(x,y)=>fn(x,y,k),m);if(fn(q.x,q.y,k))return q;}
  const b=WORLD.sectors[sec].box,R=mulberry(seed+1),occ=[...WORLD.nodes,...W80.zones,...W80.pults,...W80.leaks,...(W80.range?[W80.range]:[]),...(W80.melt?[W80.melt]:[])];let best=null,bd=-1;
  for(let i=0;i<300;i++){const x=b[0]+m+R()*(b[2]-b[0]-2*m),y=b[1]+m+R()*(b[3]-b[1]-2*m);if(W80.range&&inRange80(x,y,200))continue;let d=1e9;for(const q of occ)d=Math.min(d,Math.hypot(q.x-x,q.y-y));if(d>bd){bd=d;best={x:Math.round(x),y:Math.round(y)};}}
  return best||{x:(b[0]+b[2])/2,y:(b[1]+b[3])/2};}
function inRange80(x,y,pad){const r=W80.range;if(!r)return false;return Math.abs(x-r.x)<r.w/2+pad&&Math.abs(y-r.y)<r.h/2+pad;}
function rangeGoal80(){const ws=w80S();return ws.rangeGoal||(ws.rangeGoal=Math.round(Math.max(60,(ws.rangeBest||0)*1.1)));}
function convoyRoute80(z){const b=WORLD.sectors[6].box,m=W80.melt,h=z.home,R=mulberry(8500+Math.floor((w80S().clk||0)/60));const pts=[];for(let i=1;i<=3;i++){const f=i/4;pts.push({x:clamp(h.x+(m.x-h.x)*f+(R()-.5)*900,b[0]+300,b[2]-300),y:clamp(h.y+(m.y-h.y)*f+(R()-.5)*900,b[1]+300,b[3]-300)});}pts.push({x:m.x,y:m.y});return pts;}
function w80ZoneSpawn(z){const p=G.player,R=(r)=>[z.x+rnd(-r,r),z.y+rnd(-r,r)];z.t80=0;z.out80=null;z.prov80=0;z.alarm=0;z.stealth=0;z.n=0;
  switch(z.k80){
    case 'convoy':{z.tug={x:z.home.x,y:z.home.y,i:0,route:convoyRoute80(z),ang:0};const bx=spawnEnemy('convoybox',z.home.x-46,z.home.y,{zone:z,noSec:true,noAffix:true,noLoot:true,spawnT:.6});bx.hp=bx.maxHp=600;z.box=bx;z.n++;
      for(const t of ['labrat','labrat','recycler','gunner','gunner'])w74Sp(z,t,...R(160),{convoy80:z});break;}
    case 'audit':{z.ap={x:z.home.x-800,y:z.home.y-500};z.wp=0;z.path=[];for(let r=0;r<5;r++){const y=z.home.y-500+r*250;z.path.push(r%2?{x:z.home.x+800,y}:{x:z.home.x-800,y},r%2?{x:z.home.x-800,y}:{x:z.home.x+800,y});}z.dir={x:1,y:0};
      for(let i=0;i<3;i++)w74Sp(z,'inspector',z.ap.x,z.ap.y+(i-1)*260,{audit80:z,ai80:i});break;}
    case 'pilgrims':{const g={hostile:false,tol:((G.save.story&&G.save.story.spared||0)>=5?1:0)+(storyFlag('line31')==='write'?1:0),ships:[],dest:W80.dest,hitByP:0};z.pg=g;z.esc=0;z.atkT=12;const n=4+Math.floor(Math.random()*3);
      for(let i=0;i<n;i++){const fx=((i%3)-1)*50,fy=(Math.floor(i/3)-.5)*50;const e=w74Sp(z,'pilgrim',z.home.x+fx,z.home.y+fy,{full:true,noSec:true});e.hp=e.maxHp=80;e.peace=true;e.pg80=g;e.fx=fx;e.fy=fy;g.ships.push(e);}break;}}}
function w80ZoneRadio(z){const L={convoy:['БЮРО','#e8d27a','Партия на переплавку. Сопровождение — по регламенту.'],audit:['БЮРО','#e8d27a','Плановая ревизия квадрата. Изделия — на места.'],pilgrims:['ИСТОК','#6b8cff','…мы идём. Ты тоже идёшь. Не мешай…']}[z.k80];
  if(z.z80g)radioLine(z.sec===6?'БЮРО':'ИСТОК',z.sec===6?'#e8d27a':'#6b8cff',z.sec===6?'Линия работает. Посторонним — покинуть цех.':'…повтори… повтори… повтори…',.4);else if(L)radioLine(L[0],L[1],L[2],.4);}
function convoyAI80(e,dt){const z=e.convoy80;if(!z||!z.active||z.prov80||!z.box||!z.box.alive)return false;const p=G.player;if(Math.hypot(p.x-z.box.x,p.y-z.box.y)<450)return false;
  const tx=z.box.x+Math.cos(e.seed)*90,ty=z.box.y+Math.sin(e.seed)*90;steer(e,tx-e.x,ty-e.y,Math.min(e.spd,140),dt,2);return true;}
function auditAI80(e,dt){const z=e.audit80;if(!z||!z.active||z.alarm)return false;const p=G.player,dx=z.dir.x,dy=z.dir.y,i=e.ai80||0;
  const tx=z.ap.x-dy*(i-1)*260,ty=z.ap.y+dx*(i-1)*260;steer(e,tx-e.x,ty-e.y,Math.min(Math.max(e.spd*1.6,90),Math.hypot(tx-e.x,ty-e.y)*3+40),dt,3);
  e.ca=Math.atan2(dy,dx)+Math.sin(G.t*.8+i)*.44;const dark=G.bo80>=.5,len=dark?260:420;e.clen=len;const pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy);
  const see=p.hp>0&&pd<len&&Math.abs(angDiff(Math.atan2(pdy,pdx),e.ca))<.436&&e.spawnT<=0;const need=rankD80()===0?1.2:sbHard()?.5:.8;
  if(see)e.seeT=(e.seeT||0)+dt;else e.seeT=Math.max(0,(e.seeT||0)-dt*2);if(e.seeT>=need){e.seeT=0;e.cool80=5;insAlarm80(e);}return true;}
function alarmAI80(e,dt){const q=e.alarm80;if(!q||!W80.alarm||W80.alarm.st!=='on'){e.alarm80=null;return false;}const d=Math.hypot(q.x-e.x,q.y-e.y);if(d<180)return false;steer(e,q.x-e.x,q.y-e.y,e.spd,dt,2);return true;}
function w80ZoneTick(dt){const p=G.player;for(const z of W80.zones){if(!z.k80)continue;
    if(!z.active){if(z.home&&(z.x!==z.home.x||z.y!==z.home.y)){z.x=z.home.x;z.y=z.home.y;}z.tug=null;z.box=null;continue;}
    z.t80=(z.t80||0)+dt;const mine=G.enemies.filter(e=>e.alive&&e.zone===z);
    if(z.k80==='convoy'&&z.tug){const T=z.tug,B=z.box;if(!z.prov80&&mine.some(e=>e.hp<e.maxHp-.5))z.prov80=1;
      const halt=W80.alarm&&W80.alarm.st==='on'&&W80.pults[W80.alarm.i]&&Math.hypot(T.x-W80.pults[W80.alarm.i].x,T.y-W80.pults[W80.alarm.i].y)<2000;
      if(B&&B.alive&&!halt&&!z.out80){const q=T.route[T.i];if(q){const dx=q.x-T.x,dy=q.y-T.y,d=Math.hypot(dx,dy);if(d<20)T.i++;else{T.x+=dx/d*55*dt;T.y+=dy/d*55*dt;T.ang=Math.atan2(dy,dx);}}
        else{z.out80='melted';for(const e of mine)e.alive=false;radioLine('БЮРО','#e8d27a','Партия списана.',.1);floater(p.x,p.y-40,'КОНТЕЙНЕР НА ПЕРЕПЛАВКЕ','#ff7a3d');}}
      if(B&&B.alive){B.x=T.x-Math.cos(T.ang)*46;B.y=T.y-Math.sin(T.ang)*46;B.vx=B.vy=0;}
      else if(B&&!B.alive&&!z.out80)convoyBroken80(z,B);
      z.x=T.x;z.y=T.y;}
    if(z.k80==='audit'&&z.ap){if(!z.alarm&&mine.some(e=>e.hp<e.maxHp-.5)){z.alarm=1;z.stealth=1;}
      if(!z.alarm){const q=z.path[z.wp%z.path.length],dx=q.x-z.ap.x,dy=q.y-z.ap.y,d=Math.hypot(dx,dy);if(d<20)z.wp++;else{z.ap.x+=dx/d*70*dt;z.ap.y+=dy/d*70*dt;z.dir={x:dx/d,y:dy/d};}}
      z.x=z.ap.x;z.y=z.ap.y;}
    if(z.k80==='pilgrims'&&z.pg){const g=z.pg,live=g.ships.filter(e=>e.alive);
      if(live.length){const cx=live.reduce((a,e)=>a+e.x,0)/live.length,cy=live.reduce((a,e)=>a+e.y,0)/live.length;z.x=cx;z.y=cy;
        if(!g.hostile){if(p.hp>0&&Math.hypot(p.x-cx,p.y-cy)<500)z.esc+=dt;z.atkT-=dt;
          if(z.atkT<=0&&z.t80<120){z.atkT=20;for(let i=0;i<2;i++){const a=rnd(0,TAU);w74Sp(z,Math.random()<.5?'echo80':'loop',cx+Math.cos(a)*420,cy+Math.sin(a)*420,{pilgAtk:z});}floater(cx,cy-40,'НА ПАЛОМНИКОВ НАПАЛИ','#ff4f6e');}
          for(const e of mine){if(!e.pilgAtk||e.tr80>0)continue;e.pat80=(e.pat80===undefined?1:e.pat80)-dt;if(e.pat80<=0){let t_=null,td=320;for(const o of live){const q=Math.hypot(o.x-e.x,o.y-e.y);if(q<td){td=q;t_=o;}}if(t_){e.pat80=1.4;x74().tracers.push({x1:e.x,y1:e.y,x2:t_.x,y2:t_.y,t:.18,c:EDEF[e.type].col});t_.hp-=12;t_.flash=.1;if(t_.hp<=0){t_.alive=false;explode(t_.x,t_.y,'#dfe8ff',12,.6);g.lost=(g.lost||0)+1;}}else e.pat80=.3;}}
          if(Math.hypot(cx-g.dest.x,cy-g.dest.y)<160){const atk=mine.filter(e=>e.pilgAtk&&e.alive).length;z.out80=z.esc>=40&&!atk?'escorted':'passed';for(const e of mine)e.alive=false;}}
        else if(!live.some(e=>e.hostile80))z.out80='killed';}
      else if(!z.out80)z.out80=g.hostile?'killed':'lost';}}}
function convoyBroken80(z,B){z.out80='broken';G.res80={x:B.x,y:B.y,a:0,cd:.5,t:120};floater(B.x,B.y-30,'КОПИЯ СПАСЕНА · ЛЕТИТ С ВАМИ 2 МИН','#dfe8ff');radioLine('КОПИЯ','#dfe8ff','…я с тобой. Недолго.',.3);conEvent('convoyBreak');conEvent('rescue80');sfx('level');}
function w80ZoneDone(z){if(z.k80==='convoy'&&!z.out80&&z.box)convoyBroken80(z,z.box);if(z.k80==='pilgrims'&&!z.out80)z.out80=z.pg&&z.pg.hostile?'killed':'lost';const S=G.save,p=G.player,ws=w80S(),zd=ws.zd||(ws.zd={}),first=!zd[z.k80];zd[z.k80]=1;z.active=false;z.cool=240;let v=Math.round((first?10+z.n*3:3)*3),msg='ПАТРУЛЬ РАЗБИТ';
  if(z.k80==='convoy'){if(z.out80==='melted'){v=0;msg='ПАРТИЯ СПИСАНА · НАГРАДЫ НЕТ';}else{v+=60;msg='КОНВОЙ РАЗБИТ · КОПИЯ СПАСЕНА';}}
  if(z.k80==='audit'&&z.stealth){v+=30;msg='РЕВИЗИЯ НЕ ЗАМЕТИЛА';conEvent('auditStealth');}
  if(z.k80==='pilgrims'){const g=z.pg||{};if(z.out80==='escorted'){if(storyFlag('well38')==='silence')conEvent('exodus85');v=30;msg='ПАЛОМНИКИ ДОШЛИ · ГОЛОС ИСТОКА';const k=ws.voices||0;if(storyFlag('well38')==='silence'){}else if(k<VOICES80.length){toast('ГОЛОС ИСТОКА '+(k+1)+'/'+VOICES80.length,VOICES80[k]);ws.voices=k+1;}else radioLine('ИСТОК','#6b8cff',VOICES80[Math.floor(Math.random()*VOICES80.length)],.2);if(!g.hitByP)conEvent('pilgrimsSafe');}
    else if(z.out80==='killed'){v=0;msg='ЗВЕНО УНИЧТОЖЕНО';}else{v=0;msg=z.out80==='lost'?'ПАЛОМНИКИ ПОГИБЛИ':'ПАЛОМНИКИ ПРОШЛИ';}
    if(storyFlag('fleet27')==='engine'&&!ws.karr&&z.out80==='escorted'){ws.karr=1;radioLine('ПАЛОМНИК','#dfe8ff','Карр жив. Он тоже летит сюда.',2);}}
  if(z.home){z.x=z.home.x;z.y=z.home.y;}z.tug=null;z.box=null;z.pg=null;
  if(v>0){S.carry+=v;if(first)addPilotXP(25);}floater(p.x,p.y-40,msg+(v>0?' · +'+v+' ЛОМА'+(first?'':' · ПОВТОР'):''),'#c9d2de');sfx('level');if(v>0){conEvent('patrol');conEvent('patrol');}if(G.event==='zone')G.event=null;saveWorld();return true;}
// --- мировой тик ---
function w80WorldTick(dt){const S=G.save,p=G.player;if(!S||!p)return;w80Gen();if(!W80.gen)return;w85WorldTick(dt);w90WorldTick(dt);const ws=w80S();c80Tick(dt);w80ZoneTick(dt);
  const sec=sec80();
  if(sec>=0&&!ws.seen[sec]){ws.seen[sec]=1;if(sec===6)radioLine('БЮРО','#e8d27a','Цех «Предел». Изделие вне партии обнаружено. Вернуть на линию.',1);else radioLine('ИСТОК','#6b8cff','…ты дошёл. Все доходят. Не все возвращаются…',1);}
  // свет по циклу сектора
  if(sec>=0&&!(sec===6&&storyFlag('line31')==='break')){const cyc=sec===6?[150,5,40,3]:[120,5,45,3],L=cyc[0]+cyc[1]+cyc[2]+cyc[3],ph=((ws.clk||0)+(sec===6?0:90))%L;let st,k;
    if(ph<cyc[0]){st=0;k=0;}else if(ph<cyc[0]+cyc[1]){st=1;k=Math.sin(G.t*22)>.3?.45:0;}else if(ph<cyc[0]+cyc[1]+cyc[2]){st=2;k=1;}else{st=3;k=clamp(1-(ph-cyc[0]-cyc[1]-cyc[2])/cyc[3],0,1);}
    if(st===1&&W80.boPh!==1){radioLine(sec===6?'БЮРО':'ИСТОК',sec===6?'#e8d27a':'#6b8cff',sec===6?'Смена окончена. Свет — по регламенту.':'…тише… слушай…',0);buzz('ready');}W80.boPh=st;G.bo80=k;}
  else{G.bo80=Math.max(0,G.bo80-dt*2);W80.boPh=-1;}
  // утечки рядом
  W80.nearT-=dt;if(W80.nearT<=0){W80.nearT=.5;W80.near=W80.leaks.filter(q=>Math.hypot(q.x-p.x,q.y-p.y)<1700);}
  if(p.hp>0&&W80.near.some(q=>Math.hypot(p.x-q.x,p.y-q.y)<q.r))d80H('leak','УТЕЧКА ОХЛАЖДЕНИЯ · СНАРЯДЫ ×3 МЕДЛЕННЕЕ','#bfe8ff');
  // пульты тревоги
  for(const q of W80.pults){const ready=(ws.clk||0)>=(ws.alarmAt[q.i]||0);if(ready&&!W80.alarm&&p.hp>0&&Math.hypot(p.x-q.x,p.y-q.y)<44){q.ch+=dt;if(q.ch>=.6){q.ch=0;W80.alarm={i:q.i,st:'count',t:10,sec:10};floater(q.x,q.y-40,'ТРЕВОГА ЧЕРЕЗ 10 С','#ff4f6e');sfx('warn');buzz('ready');}}else q.ch=0;}
  if(W80.alarm){const A=W80.alarm,q=W80.pults[A.i];A.t-=dt;
    if(A.st==='count'){const s=Math.ceil(A.t);if(s!==A.sec){A.sec=s;if(Math.hypot(p.x-q.x,p.y-q.y)<2200){floater(q.x,q.y-40,'ТРЕВОГА · '+s,'#ff4f6e');if(s<=5)buzz('tap');}}
      if(A.t<=0){A.st='on';A.t=60;radioLine('БЮРО','#e8d27a','Изделие вне партии. Всем постам.',0);sfx('bigboom');shake(6);}}
    else if(A.st==='on'){for(const e of G.enemies){if(!e.alive||EDEF[e.type].passive||STATIC.has(e.type)||e.alarm80)continue;if(sectorIdx(e.x,e.y)===6&&Math.hypot(e.x-q.x,e.y-q.y)<2000)e.alarm80=q;}
      if(A.t<=0){for(const e of G.enemies)e.alarm80=null;ws.alarmAt[A.i]=(ws.clk||0)+rnd(1200,1800);W80.alarm=null;saveWorld();}}}
  // полигон
  const r=W80.range;if(r){const d=Math.hypot(p.x-r.x,p.y-r.y);const dm=W80.dummy;
    if(d<900&&(!dm||!dm.alive)){W80.dummy=spawnEnemy('rangedummy',r.x,r.y,{noSec:true,noAffix:true,noLoot:true,spawnT:.3});W80.dummy.hp=W80.dummy.maxHp=1000;}
    else if(d>1400&&dm&&dm.alive){dm.alive=false;W80.dummy=null;}
    for(const e of G.enemies){if(!e.alive||e.type==='rangedummy'||STATIC.has(e.type))continue;if(inRange80(e.x,e.y,e.r)){const dx=e.x-r.x,dy=e.y-r.y,ox=r.w/2+e.r-Math.abs(dx),oy=r.h/2+e.r-Math.abs(dy);if(ox<oy)e.x+=Math.sign(dx||1)*ox;else e.y+=Math.sign(dy||1)*oy;}}
    const now=G.t;W80.rlog=W80.rlog.filter(q=>now-q.t<5);if(W80.rlog.length){const t0=Math.max(1,Math.min(5,now-W80.rlog[0].t+.25));const dps=Math.round(W80.rlog.reduce((a,q)=>a+q.v,0)/t0);W80.dps=dps;
      if(now-W80.rlog[0].t>=2&&dps>(ws.rangeBest||0)){ws.rangeBest=dps;W80.rec=1;}if(now-W80.rlog[0].t>=2&&S.contracts&&S.contracts.list.some(c=>c.tid==='c_range80')&&dps>=rangeGoal80()){conEvent('rangeDps');delete ws.rangeGoal;}
      W80.radioT-=dt;if(W80.radioT<=0&&now-W80.rlog[0].t>=3){W80.radioT=30;radioLine('СТЕНД','#e8d27a','Урон в секунду: '+dps+'. '+(W80.rec?'Выше нормы.':'Норма.'),0);W80.rec=0;}}else W80.dps=0;
    if(inRange80(p.x,p.y,0))d80H('range','СТЕНД ИСПЫТАНИЙ · БЕЙТЕ ПО МИШЕНИ','#e8d27a');}}
// ===== отрисовка =====
function leakDraw80(q,t){const g=ctx.createRadialGradient(q.x,q.y,q.r*.2,q.x,q.y,q.r);g.addColorStop(0,'rgba(191,232,255,.16)');g.addColorStop(1,'rgba(191,232,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,TAU);ctx.fill();
  ctx.strokeStyle='#dff6ff';ctx.globalAlpha=.35;ctx.lineWidth=1.5;ctx.setLineDash([3,7]);ctx.lineDashOffset=t*8;ctx.beginPath();for(let i=0;i<=28;i++){const a=i/28*TAU,rr=q.r*(1+.04*Math.sin(a*6+t*1.5));ctx.lineTo(q.x+Math.cos(a)*rr,q.y+Math.sin(a)*rr);}ctx.closePath();ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;ctx.globalAlpha=1;}
// под врагами: утечки, рельсы
function d80Under(t){sb85Under(t);under90(t);under110(t);const L=G.world?W80.near:(G.x80&&G.x80.leaks);if(L)for(const q of L)if(!G.world||inView(q.x,q.y,q.r))leakDraw80(q,t);
  for(const e of G.enemies){if(!e.alive||e.type!=='railshield'||!e.rail)continue;const R_=e.rail;ctx.strokeStyle='#c9d2de';ctx.globalAlpha=.3;ctx.lineWidth=2;ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(R_.x-R_.ux*220,R_.y-R_.uy*220);ctx.lineTo(R_.x+R_.ux*220,R_.y+R_.uy*220);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}}
// над врагами
function d80Draw(t){draw90(t);draw110(t);const p=G.player;if(!p)return;
  for(const k of G.pick){if(k.k!=='part80')continue;ctx.save();ctx.translate(k.x,k.y);ctx.rotate(k.t*2);ctx.globalAlpha=k.life<3?(Math.sin(k.life*14)>0?1:.3):1;ctx.fillStyle='#1a2030';ctx.strokeStyle='#c9d2de';ctx.lineWidth=1.5;ctx.fillRect(-5,-3,10,6);ctx.strokeRect(-5,-3,10,6);ctx.restore();ctx.globalAlpha=1;}
  for(const k of G.pick){if(!k.rc80||!k.rc80.alive)continue;ctx.strokeStyle='#9fb0c4';ctx.globalAlpha=.35;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(k.x,k.y);ctx.lineTo(k.rc80.x,k.rc80.y);ctx.stroke();ctx.globalAlpha=1;}
  for(const e of G.enemies){if(!e.alive)continue;
    if(e.insB80>0&&!EDEF[e.type].passive){ctx.strokeStyle='#ffd36b';ctx.globalAlpha=.6;ctx.lineWidth=1.5;ctx.strokeRect(e.x-e.r-4,e.y-e.r-4,e.r*2+8,e.r*2+8);ctx.globalAlpha=1;}
    switch(e.type){
      case 'labrat':if(e.beam&&e.beam.alive){const b=e.beam;ctx.strokeStyle='#7affc9';ctx.globalAlpha=.55+.3*Math.sin(t*16);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.globalAlpha=1;glow(b.x,b.y,b.r*1.6,'#7affc9',.3);}break;
      case 'inspector':if(e.ca!==undefined&&e.spawnT<=0){const len=e.clen||420,k=Math.min(1,(e.seeT||0)/.8);ctx.fillStyle=k>0?`rgba(255,211,107,${.12+.16*k})`:'rgba(255,211,107,.08)';ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.arc(e.x,e.y,len,e.ca-.436,e.ca+.436);ctx.closePath();ctx.fill();
        ctx.strokeStyle='#ffd36b';ctx.globalAlpha=.4;ctx.lineWidth=1;ctx.stroke();ctx.globalAlpha=1;if(e.seeT>0){ctx.strokeStyle='#ffd36b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,p.r+10,-Math.PI/2,-Math.PI/2+TAU*k);ctx.stroke();}}break;
      case 'defect':if(e.mode){const c=DEF_COL80[e.mode];worldLabel(e.x,e.y-e.r-12,DEF_TXT80[e.mode],c);if(e.mode==='ram'&&e.rst==='aim'&&!G.noTele){const T0=.8,lk=e.rt<=.22;teleLane(e.x,e.y,e.aim,420*.6*(G.eSpd||1),e.r+14,1-clamp(e.rt/T0,0,1),lk,'#ff4f6e',{r:e.r+2,flash:lk?Math.max(0,1-(.22-e.rt)/.12):0});}}break;
      case 'recycler':{const n=e.hopper?e.hopper.length:0;if(n)worldLabel(e.x,e.y-e.r-12,'БУНКЕР '+n+'/12','#ffb84d');if(e.fire80>0&&!G.noTele){glow(e.x,e.y,e.r*2,'#ffd36b',.4+.4*Math.sin(t*30));}break;}
      case 'echo80':{const q=G.echoQ80?G.echoQ80.length:0;ctx.strokeStyle='#b48cff';ctx.globalAlpha=.5;ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,e.r+8,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,q/12));ctx.stroke();ctx.globalAlpha=1;break;}
      case 'loop':if(e.tr80>0){ctx.strokeStyle='#6b8cff';ctx.globalAlpha=.4+.3*Math.sin(t*8);ctx.lineWidth=2;ctx.setLineDash([4,5]);ctx.beginPath();ctx.arc(e.x,e.y,e.r+6,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=.9;ctx.lineWidth=3;ctx.beginPath();ctx.arc(e.x,e.y,e.r+12,-Math.PI/2,-Math.PI/2+TAU*(1-e.tr80/5));ctx.stroke();ctx.globalAlpha=1;worldLabel(e.x,e.y-e.r-18,'СЛЕД · '+Math.ceil(e.tr80),'#6b8cff');}
        else if(e.win80>0&&e.win80<90&&e.spawnT<=0){ctx.strokeStyle='#ffffff';ctx.globalAlpha=.7;ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,e.r+7,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,e.win80/2));ctx.stroke();ctx.globalAlpha=1;}
        if(e.lr80){for(let i=0;i<e.lr80;i++){ctx.fillStyle='#6b8cff';ctx.beginPath();ctx.arc(e.x-6+i*6,e.y+e.r+7,2,0,TAU);ctx.fill();}}break;
      case 'inverse':if(e.itel>0&&!G.noTele){ctx.strokeStyle='#e86bff';ctx.globalAlpha=.8;ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,e.r+40*(e.itel/1),0,TAU);ctx.stroke();ctx.globalAlpha=1;}if(e.iw){ctx.strokeStyle='#e86bff';ctx.globalAlpha=.7*(1-e.iw.r/380);ctx.lineWidth=5;ctx.beginPath();ctx.arc(e.iw.x,e.iw.y,e.iw.r,0,TAU);ctx.stroke();ctx.globalAlpha=1;}break;
      case 'pilgrim':if(!e.hostile80)worldLabel(e.x,e.y-e.r-12,'ПАЛОМНИК','#dfe8ff');break;
      case 'convoybox':worldLabel(e.x,e.y-e.r-12,'НА СПИСАНИЕ','#e8d27a');ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(e.x-24,e.y+e.r+6,48,4);ctx.fillStyle='#e8d27a';ctx.fillRect(e.x-24,e.y+e.r+6,48*Math.max(0,e.hp/e.maxHp),4);break;}}
  // штамп на корабле
  if(G.stamp80&&p.hp>0){const s=G.stamp80,k=s.t/s.max;ctx.strokeStyle='#ff7a3d';ctx.lineWidth=3;ctx.globalAlpha=.9;ctx.beginPath();ctx.arc(p.x,p.y,p.r+12,-Math.PI/2,-Math.PI/2+TAU*k);ctx.stroke();ctx.globalAlpha=1;worldLabel(p.x,p.y-p.r-24,'ПРОВЕРЕНО · '+Math.ceil(s.t)+' · РЫВОК','#ff7a3d');}
  // Изнанка: рамка и значок
  if((G.inv80>0||G.slow80>0)&&p.hp>0){const k=(G.inv80||G.slow80)/2;ctx.strokeStyle='#e86bff';ctx.globalAlpha=.55;ctx.lineWidth=6;ctx.strokeRect(CX+3,CY+3,W-6,H-6);ctx.globalAlpha=1;ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,p.r+16,-Math.PI/2,-Math.PI/2+TAU*k);ctx.stroke();worldLabel(p.x,p.y+p.r+26,G.inv80>0?'⇄ '+G.inv80.toFixed(1):'ЗАМЕДЛЕНИЕ','#e86bff');}
  // спасённая копия
  if(G.res80){const R_=G.res80;ctx.save();ctx.translate(R_.x,R_.y);ctx.rotate(R_.a+Math.PI/2);ctx.strokeStyle='#dfe8ff';ctx.fillStyle='#0b0f18';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(9,0);ctx.lineTo(-6,-6);ctx.lineTo(-3,0);ctx.lineTo(-6,6);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
  // числа урона
  ctx.textAlign='center';ctx.font='700 '+fpx(isMob()?17:12)+'px "JetBrains Mono",monospace';for(const n of G.dmgN80||[]){ctx.globalAlpha=Math.min(1,n.t*2);ctx.fillStyle='#04060c';ctx.fillText(String(Math.round(n.v)),n.x+1,n.y+1);ctx.fillStyle=n.col;ctx.fillText(String(Math.round(n.v)),n.x,n.y);}ctx.globalAlpha=1;
  // снаряды в утечке — иней
  const L=G.world?W80.near:(G.x80&&G.x80.leaks);if(L&&L.length&&SET.fx){ctx.fillStyle='rgba(223,246,255,.35)';for(const b of G.pb)if(leakK80(b.x,b.y)<1){ctx.beginPath();ctx.arc(b.x,b.y,5,0,TAU);ctx.fill();}for(const b of G.eb)if(leakK80(b.x,b.y)<1){ctx.beginPath();ctx.arc(b.x,b.y,b.r+3,0,TAU);ctx.fill();}}}
// мир: пульты, полигон, переплавка, конвой
function w80Draw(t){if(!W80.gen)return;const ws=w80S(),p=G.player;w85Draw(t);w90Draw(t);
  for(const q of W80.pults){if(!inView(q.x,q.y,120))continue;const ready=(ws.clk||0)>=(ws.alarmAt[q.i]||0),act=W80.alarm&&W80.alarm.i===q.i,col=act?'#ff4f6e':ready?'#ff7a3d':'#6b7280';
    glow(q.x,q.y,40,col,act?.5+.4*Math.sin(t*12):ready?.35:.12);ctx.save();ctx.translate(q.x,q.y);ctx.fillStyle='#10141c';ctx.strokeStyle=col;ctx.lineWidth=2;ctx.fillRect(-16,-12,32,24);ctx.strokeRect(-16,-12,32,24);ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fill();
    if(q.ch>0){ctx.strokeStyle='#ffffff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,26,-Math.PI/2,-Math.PI/2+TAU*q.ch/.6);ctx.stroke();}ctx.restore();
    const sub=act?(W80.alarm.st==='count'?'ТРЕВОГА ЧЕРЕЗ '+Math.ceil(W80.alarm.t):'ТРЕВОГА · '+Math.ceil(W80.alarm.t)+' С'):ready?'ВСЕМ ПОСТАМ · ДЕРЖИТЕ 0,6 С':'ПЕРЕЗАРЯДКА · '+fmtMS80((ws.alarmAt[q.i]||0)-(ws.clk||0));worldLabel(q.x,q.y-30,'ПУЛЬТ ТРЕВОГИ',col);worldLabel(q.x,q.y+34,sub,col);}
  const r=W80.range;if(r&&inView(r.x,r.y,r.w)){ctx.strokeStyle='#e8d27a';ctx.globalAlpha=.5;ctx.lineWidth=2;ctx.setLineDash([12,8]);ctx.strokeRect(r.x-r.w/2,r.y-r.h/2,r.w,r.h);ctx.setLineDash([]);ctx.globalAlpha=.08;ctx.fillStyle='#e8d27a';ctx.fillRect(r.x-r.w/2,r.y-r.h/2,r.w,r.h);ctx.globalAlpha=.25;
    for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(r.x-r.w/2+i*r.w/4,r.y-r.h/2);ctx.lineTo(r.x-r.w/2+i*r.w/4,r.y+r.h/2);ctx.stroke();}ctx.globalAlpha=1;
    worldLabel(r.x,r.y-r.h/2-30,'СТЕНД ИСПЫТАНИЙ','#e8d27a');worldLabel(r.x,r.y-r.h/2-12,'ПОСЛЕДНЕЕ '+Math.round(W80.last||0)+' · УРОН/С '+(W80.dps||0)+' · РЕКОРД '+(ws.rangeBest||0),'#e8d27a');}
  const m=W80.melt;if(m&&inView(m.x,m.y,200)){glow(m.x,m.y,110,'#ff7a3d',.35+.15*Math.sin(t*2));ctx.strokeStyle='#ff7a3d';ctx.lineWidth=3;ctx.beginPath();ctx.arc(m.x,m.y,60,0,TAU);ctx.stroke();worldLabel(m.x,m.y-80,'ПЕРЕПЛАВКА','#ff7a3d');}
  for(const z of W80.zones){if(!z.active)continue;
    if(z.k80==='convoy'&&z.tug){const T=z.tug;ctx.strokeStyle='#e8d27a';ctx.globalAlpha=.25;ctx.setLineDash([6,10]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(T.x,T.y);for(let i=T.i;i<T.route.length;i++)ctx.lineTo(T.route[i].x,T.route[i].y);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
      if(inView(T.x,T.y,80)){ctx.save();ctx.translate(T.x,T.y);ctx.rotate(T.ang);ctx.fillStyle='#10141c';ctx.strokeStyle='#c9d2de';ctx.lineWidth=2;ctx.fillRect(-18,-11,36,22);ctx.strokeRect(-18,-11,36,22);ctx.restore();if(z.box&&z.box.alive){ctx.strokeStyle='#c9d2de';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(T.x,T.y);ctx.lineTo(z.box.x,z.box.y);ctx.stroke();}}}
    if(z.k80==='audit'&&z.ap&&!z.alarm&&inView(z.ap.x,z.ap.y,900)){ctx.strokeStyle='#ffd36b';ctx.globalAlpha=.12;ctx.lineWidth=1;ctx.strokeRect(z.home.x-820,z.home.y-520,1640,1040);ctx.globalAlpha=1;}}}
function fmtMS80(s){s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
// карта
function w80MapAdd(add,lod,S){w80Gen();if(!W80.gen)return;w90MapAdd(add,lod,S);if(storyFlag('well38')==='third'){const q=w85Node();if(q)add('sig85',q.x,q.y,{},lod===2?{t:'СИГНАЛ ЗА ПРЕДЕЛОМ · СКОРО',p:6,c:'#ffffff'}:null);}for(const q of W80.pults)if(revealedAt(q.x,q.y))add('pult80',q.x,q.y,{},lod===2?{t:'ПУЛЬТ ТРЕВОГИ',p:6,c:'#ff7a3d'}:null);
  if(W80.range&&revealedAt(W80.range.x,W80.range.y))add('range80',W80.range.x,W80.range.y,{},lod===2?{t:'СТЕНД',p:6,c:'#e8d27a'}:null);
  if(W80.melt&&revealedAt(W80.melt.x,W80.melt.y))add('melt80',W80.melt.x,W80.melt.y,{},lod===2?{t:'ПЕРЕПЛАВКА',p:6,c:'#ff7a3d'}:null);}
function w80MapIcon(g,kind,o,t){if(w90MapIcon(g,kind,o,t))return true;if(kind==='sig85'){g.strokeStyle='#ffffff';g.beginPath();g.arc(0,0,6,0,TAU);g.stroke();g.beginPath();g.arc(0,0,2,0,TAU);g.stroke();return true;}switch(kind){case 'pult80':g.strokeStyle='#ff7a3d';g.strokeRect(-4,-3,8,6);return true;case 'range80':g.strokeStyle='#e8d27a';g.strokeRect(-6,-4,12,8);g.beginPath();g.moveTo(0,-4);g.lineTo(0,4);g.stroke();return true;case 'melt80':g.strokeStyle='#ff7a3d';g.beginPath();g.arc(0,0,5,0,TAU);g.stroke();return true;}return false;}
// маска отключения света: видно рядом с кораблём, снаряды врагов и вспышки
let c80=null,c80x=null;
function w80Mask(ox,oy){const k0=G.bo80||0;if(k0<=.01||!G.player)return;const lo=isMob()?.5:Math.min(.5,Math.sqrt(9e5/Math.max(1,cv.width*cv.height)));const w_=Math.ceil(cv.width*lo),h_=Math.ceil(cv.height*lo);
  if(!c80||c80.width!==w_||c80.height!==h_){c80=document.createElement('canvas');c80.width=w_;c80.height=h_;c80x=c80.getContext('2d');}
  const g=c80x,k=DPR*SC*lo,p=G.player,R=Math.max(300,Math.min(W,H)*.4);g.globalCompositeOperation='source-over';g.clearRect(0,0,w_,h_);g.fillStyle=`rgba(1,2,7,${((SET.fx?.88:.55)*k0).toFixed(3)})`;g.fillRect(0,0,w_,h_);g.globalCompositeOperation='destination-out';
  const hole=(x,y,r)=>{const X=(x+ox)*k,Y=(y+oy)*k,RR=r*k;if(X<-RR||Y<-RR||X>w_+RR||Y>h_+RR)return;const gr=g.createRadialGradient(X,Y,RR*.35,X,Y,RR);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(X,Y,RR,0,TAU);g.fill();};
  hole(p.x,p.y,R);holes85(hole,(y0,y1)=>{const Y0=(y0+oy)*k,Y1=(y1+oy)*k;if(Y0>h_)return;const gr=g.createLinearGradient(0,Y0,0,Y1);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,1)');g.fillStyle=gr;g.fillRect(0,Y0,w_,h_-Y0);});let n=0;for(const b of G.eb){if(n>=80)break;hole(b.x,b.y,16);n++;}n=0;for(const s of G.shock){if(n>=24)break;hole(s.x,s.y,Math.max(30,s.r));n++;}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(c80,0,0,cv.width,cv.height);ctx.restore();}
// рисунки новых врагов (из drawE74; true = нарисован)
function drawE80(e,t,icon,col,face,alpha,P){if(D90T.has(e.type))return drawE90(e,t,icon,col,face,alpha,P);if(SB85T.has(e.type))return drawE85(e,t,icon,col,face,alpha,P);if(!S80T.has(e.type))return false;const r=e.r;
  switch(e.type){
    case 'labrat':ctx.rotate(face);ctx.beginPath();ctx.arc(0,0,r*.8,0,TAU);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-r*.5,0);ctx.lineTo(r*.5,0);ctx.moveTo(0,-r*.5);ctx.lineTo(0,r*.5);ctx.stroke();for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(r*.6,s*r*.4);ctx.lineTo(r*1.2,s*r*.8);ctx.stroke();}break;
    case 'defect':{const c=icon?col:(e.mT!==undefined&&e.mT<.5&&Math.sin(t*40)>0?'#ffffff':DEF_COL80[e.mode||'shoot']);ctx.strokeStyle=e.flash>0?'#ffffff':c;ctx.rotate(face+(e.mode==='ram'&&e.aim!==undefined?angDiff(e.aim,face):0));
      ctx.beginPath();ctx.moveTo(r,0);ctx.lineTo(r*.2,-r*.9);ctx.lineTo(-r*.7,-r*.5);ctx.lineTo(-r,r*.2);ctx.lineTo(-r*.3,r*.9);ctx.lineTo(r*.5,r*.6);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-r*.3,-r*.4);ctx.lineTo(r*.1,r*.3);ctx.stroke();break;}
    case 'inspector':ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.stroke();{const a=icon?0:(e.ca||0);ctx.fillStyle=col;ctx.beginPath();ctx.arc(Math.cos(a)*r*.45,Math.sin(a)*r*.45,r*.35,0,TAU);ctx.fill();ctx.strokeStyle=col;ctx.beginPath();ctx.arc(0,0,r*.65,0,TAU);ctx.stroke();}break;
    case 'railshield':{const a=icon?0:(e.fa||0);ctx.rotate(a);ctx.fillStyle=e.shieldFlash>0?'#ffffff':'#141a26';ctx.fillRect(-6,-30,12,60);ctx.strokeRect(-6,-30,12,60);ctx.strokeStyle=col;ctx.globalAlpha=alpha*.6;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(-6,i*11);ctx.lineTo(6,i*11+4);ctx.stroke();}ctx.globalAlpha=alpha;
      if(!icon){ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(-14,-38,28,4);ctx.fillStyle=col;ctx.fillRect(-14,-38,28*Math.max(0,e.hp/e.maxHp),4);}break;}
    case 'stamp':ctx.rotate(t*3);ctx.beginPath();for(let i=0;i<8;i++){const a=i/8*TAU,rr=i%2?r*.6:r;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,r*.3,0,TAU);ctx.fill();break;
    case 'recycler':{ctx.rotate(face);ctx.beginPath();ctx.moveTo(r,-r*.4);ctx.lineTo(r,r*.4);ctx.lineTo(-r*.8,r*.8);ctx.lineTo(-r,0);ctx.lineTo(-r*.8,-r*.8);ctx.closePath();ctx.fill();ctx.stroke();const n=e.hopper?e.hopper.length:0;ctx.fillStyle='#ffb84d';for(let i=0;i<Math.min(6,Math.ceil(n/2));i++)ctx.fillRect(-r*.6+i*5,-2,3,4);
      ctx.strokeStyle=col;ctx.beginPath();ctx.arc(r*.9,0,r*.35,-1.2,1.2);ctx.stroke();break;}
    case 'echo80':{ctx.globalAlpha=alpha*(.75+.25*Math.sin(t*6+e.seed));ctx.rotate(icon?-Math.PI/2:Math.atan2(P.y-e.y,P.x-e.x));ctx.beginPath();ctx.moveTo(r,0);ctx.lineTo(-r*.8,-r*.7);ctx.lineTo(-r*.4,0);ctx.lineTo(-r*.8,r*.7);ctx.closePath();ctx.fill();ctx.stroke();ctx.setLineDash([3,3]);ctx.beginPath();ctx.arc(0,0,r*1.25,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=alpha;break;}
    case 'loop':{if(e.tr80>0&&!icon){ctx.globalAlpha=alpha*.3;}ctx.rotate(t*2*(e.dir||1));ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(-r*.35,0,r*.55,r*.4,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.ellipse(r*.35,0,r*.55,r*.4,0,0,TAU);ctx.stroke();ctx.lineWidth=2;ctx.globalAlpha=alpha;break;}
    case 'inverse':{ctx.rotate(-t*2);ctx.beginPath();ctx.moveTo(0,-r);ctx.lineTo(r,0);ctx.lineTo(0,r);ctx.lineTo(-r,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-r*.5,-r*.2);ctx.lineTo(r*.5,-r*.2);ctx.moveTo(r*.5,r*.2);ctx.lineTo(-r*.5,r*.2);ctx.stroke();break;}
    case 'pilgrim':{ctx.rotate(icon?-Math.PI/2:face);ctx.strokeStyle=e.hostile80?'#ff4f6e':col;ctx.beginPath();ctx.moveTo(r,0);ctx.lineTo(-r*.8,-r*.7);ctx.lineTo(-r*.4,0);ctx.lineTo(-r*.8,r*.7);ctx.closePath();ctx.fill();ctx.stroke();if(!e.hostile80){glow(0,0,r*1.4,'#dfe8ff',.2);}break;}
    case 'rangedummy':{ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(0,0,r*.6,0,TAU);ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,r*.22,0,TAU);ctx.fill();break;}
    case 'convoybox':{ctx.fillStyle='#1a1a10';ctx.fillRect(-r,-r*.7,r*2,r*1.4);ctx.strokeRect(-r,-r*.7,r*2,r*1.4);ctx.beginPath();ctx.moveTo(-r,-r*.7);ctx.lineTo(r,r*.7);ctx.moveTo(r,-r*.7);ctx.lineTo(-r,r*.7);ctx.globalAlpha=alpha*.5;ctx.stroke();ctx.globalAlpha=alpha;break;}}
  return true;}
