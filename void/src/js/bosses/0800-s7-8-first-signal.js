// ===== «Первый сигнал» · Колодец Истока =====
function wellRing(b,id){return b.rings[id==='O'?0:1];}
function wellInit(b){const R=Math.min(W,H)*.48,k=clamp(R/365,.7,1.15);b.cx=W/2;b.cy=H/2;b.R=R;b.k=k;b.x=b.cx;b.y=b.cy;
  Object.assign(b,{rings:[{id:'O',r:150*k,rot:0,v:12*Math.PI/180,n:8,arc:30*Math.PI/180,share:.03},{id:'I',r:96*k,rot:Math.PI/6,v:-20*Math.PI/180,n:6,arc:36*Math.PI/180,share:.035}],
    emit:[],sons:[],sonT:2.5,son2:0,pilT:3,pilN:0,woke:0,absorbed:0,rec:null,recT:2,ghosts:[],echoT:5,anchors:[],loopT:0,loopMax:pk85(26,20,16),loops:0,loopCap:pk85(1,2,3),hist:[],histT:0,stun:0,anchorT:1.5,karr:0,
    iw:null,invT:2.5,invN:0,p4i:0,p4T:2.5,p4t:0,p4last:false,lit:0,ghostHit:0,sos:0,flashK:0,collapse:0,scT:0,brkN:0});
  for(const ring of b.rings)for(let i=0;i<ring.n;i++)wellEmit(b,ring,i,.5+i*(ring.id==='O'?.42:.5)+(ring.id==='I'?.2:0),1);
  wellPlace(b);
  const X=G.x80;if(X&&X.leaks){X.leaks=X.leaks.filter(q=>!q.w85);for(let i=0;i<3;i++){const a=-Math.PI/2+Math.PI/3+i*TAU/3;X.leaks.push({x:b.cx+Math.cos(a)*(R-120*k),y:b.cy+Math.sin(a)*(R-120*k),r:140*k,w85:1});}}
  if(storyFlag('line31')==='write'&&G.mode==='world')x85().allyPending=1;}
function wellEmit(b,ring,i,spawnT,hpK){const q=spawnEnemy('wemit',b.cx,b.cy,{noAffix:true,noLoot:true,spawnT,host85:b,ring:ring.id,idx:i});q.maxHp=Math.round(b.maxHp*ring.share);q.hp=Math.round(q.maxHp*(hpK||1));q.cd85=rnd(1.5,3.5);q.ringR=ring.r;b.emit.push(q);return q;}
function wellPlace(b){const col=b.collapse||0;for(const e of b.emit){if(!e.alive)continue;const ring=wellRing(b,e.ring);const a=ring.rot+e.idx*TAU/ring.n,r=ring.r+(64*b.k-ring.r)*col;e.ang85=a;e.ringR=r;e.x=b.cx+Math.cos(a)*r;e.y=b.cy+Math.sin(a)*r;e.vx=e.vy=0;}
  b.x=b.cx;b.y=b.cy;}
function wellCoreK(b){return (b.ghosts.some(g=>g.alive&&g.rec)?1.3:1)*(b.stun>0?1.5:1);}
// окно ПК поменяло размер посреди боя: колодец пересобирается вокруг нового центра, всё внутри переносится подобием
function wellResize(b){if(b.gW===W&&b.gH===H)return;const first=b.gW===undefined;b.gW=W;b.gH=H;if(first)return;
  const R=Math.min(W,H)*.48,k=clamp(R/365,.7,1.15),ox=b.cx,oy=b.cy,s=R/b.R,cx=W/2,cy=H/2,mv=q=>{q.x=cx+(q.x-ox)*s;q.y=cy+(q.y-oy)*s;};
  b.cx=cx;b.cy=cy;b.R=R;b.k=k;b.rings[0].r=150*k;b.rings[1].r=96*k;
  for(const e of G.enemies)if(e.alive&&e!==b&&e.type!=='wemit')mv(e);for(const q of G.eb)mv(q);for(const q of G.pick)mv(q);
  const X=G.x80;if(X&&X.leaks)for(const q of X.leaks)if(q.w85){mv(q);q.r=140*k;}
  for(const g of b.ghosts)if(g.rec&&!g.rec.mv85){g.rec.mv85=1;g.rec.path.forEach(mv);}if(b.rec){b.rec.path.forEach(mv);const o={x:b.rec.x0,y:b.rec.y0};mv(o);b.rec.x0=o.x;b.rec.y0=o.y;}for(const g of b.ghosts)if(g.rec)g.rec.mv85=0;
  const p=G.player;if(p){mv(p);p.px=p.x;p.py=p.y;}
  if(b.docks)for(const d of b.docks){mv(d);d.x=clamp(d.x,70,W-70);d.y=clamp(d.y,70,H-70);}wellPlace(b);}
function wellUpdate(b,dt){wellResize(b);const p=G.player;b.emit=b.emit.filter(e=>e.alive);
  const sp=b.phase>=4&&b.st==='fight'?.25:1;for(const ring of b.rings)ring.rot+=ring.v*dt*sp*(b.stun>0?.3:1);
  const dk=b.st==='enter'?.45*Math.min(1,(b.enterT-b.timer)/2):b.st==='fight'?(b.phase>=4?1:.45):b.st==='scene'||b.st==='final'?Math.max(0,.8-(b.scT||0)*.25):0;G.bo80+=(dk-G.bo80)*Math.min(1,dt*1.4);if(Math.abs(G.bo80-dk)<.01)G.bo80=dk;
  if(b.phase>=4)b.collapse=Math.min(1,b.collapse+dt*.8);
  wellPlace(b);wellConfine(b,dt);wellPilMove(b,dt);
  if(b.st==='enter'){b.timer-=dt;b.lit=Math.min(1,b.lit+dt/4.2);
    const el=b.enterT-b.timer;if(b.sos<1&&el>.6){b.sos=1;snd85('sos');}
    if(b.timer<=0){b.st='fight';b.phT=0;banner('ПЕРВЫЙ СИГНАЛ · ФАЗА 1','ЗОВ · БУДИТЕ ПАЛОМНИКОВ ИМПУЛЬСОМ');RI85('…идите сюда. Все. Здесь не страшно…',{force:1,d:.4});wellAlly(b);}
    return;}
  if(b.st==='scene'||b.st==='final'){wellScene(b,dt);return;}
  b.phT+=dt;wellHist(b,dt);if(b.stun>0)b.stun-=dt;
  if(b.tr>0)return;
  wellSonar(b,dt);if(b.phase<=3)wellEmitFire(b,dt);
  if(b.phase===1)wellPilgrims(b,dt);
  if(b.phase===2)wellEcho(b,dt);
  if(b.phase===3)wellLoop(b,dt);
  if(b.phase===4)wellSilence(b,dt);}
// стена колодца и тяга к центру
function wellConfine(b,dt){for(const e of G.enemies){if(!e.alive||STATIC.has(e.type)||e.spawnT>0)continue;if(e.pg85&&e.pg85.st==='woke')continue;const dx=e.x-b.cx,dy=e.y-b.cy,d=Math.hypot(dx,dy)||1,lim=b.R-e.r-4;if(d>lim){e.x=b.cx+dx/d*lim;e.y=b.cy+dy/d*lim;e.vx*=.5;e.vy*=.5;}}}
function wellDrift(b,p,dt){if(p.hp<=0)return;const dx=p.x-b.cx,dy=p.y-b.cy,d=Math.hypot(dx,dy)||1;
  if(b.st==='fight'&&p.dashT<=0&&d>b.r+30){const pull=pk85(15,25,35)*(touchMode?.8:1);p.x-=dx/d*pull*dt;p.y-=dy/d*pull*dt;}
  const lim=b.R-p.r;if(d>lim){p.x=b.cx+dx/d*lim;p.y=b.cy+dy/d*lim;p.vx*=.6;p.vy*=.6;if(!b.wallH){b.wallH=1;hintOnce('well85','СТЕНА КОЛОДЦА','#6b8cff');}}
  if(b.st==='scene'&&b.scT<2.2){const tx=b.cx,ty=b.cy+92*b.k,q=Math.hypot(p.x-tx,p.y-ty);if(q>160){p.x+=(tx-p.x)*Math.min(1,dt*1.3);p.y+=(ty-p.y)*Math.min(1,dt*1.3);}}}
// сонар: расширяющееся кольцо с проходами; рывок сквозь волну — без урона
function wellSon(b,second){const p=G.player,n=pk85(3,2,2),w=pk85(52,44,34)*Math.PI/180,pa=Math.atan2(p.y-b.cy,p.x-b.cx);const a0=pa+rnd(.45,1.1)*(Math.random()<.5?-1:1)+(second?Math.PI/n:0);
  const gaps=[];for(let i=0;i<n;i++)gaps.push({a:a0+i*TAU/n,w});const T=pk85(1.1,.9,.65);b.sons.push({r:b.r+6,v:b.phase>=4?176:220,t:T,T,gaps,hit:false,dmg:14});snd85('ping');}
function wellSonar(b,dt){const p=G.player;b.sonT-=dt;const every=b.phase===1?4:b.phase===2?6:5;
  if(b.sonT<=0&&p.hp>0&&!(b.stun>0)){b.sonT=every*atkK()*(b.phase>=4?1.25:1);wellSon(b,0);if(b.phase===3)b.son2=.7;}
  if(b.son2>0){b.son2-=dt;if(b.son2<=0){b.son2=0;wellSon(b,1);}}
  for(const S of b.sons){if(S.t>0){S.t-=dt;continue;}S.r+=S.v*dt;
    if(!S.hit&&p.hp>0){const dd=Math.hypot(p.x-b.cx,p.y-b.cy);if(Math.abs(dd-S.r)<9+p.r*.6){const a=Math.atan2(p.y-b.cy,p.x-b.cx);if(!S.gaps.some(g=>Math.abs(angDiff(a,g.a))<g.w/2)){S.hit=true;if(p.dashT<=0&&!(x85().calm>0)){damagePlayer(S.dmg);if(G.mc)G.mc.son85=(G.mc.son85||0)+1;}}}}}
  b.sons=b.sons.filter(S=>S.r<b.R+30);}
// излучатели: очередь по 3, когда игрок перед ними (±30°); одновременно не больше двух
function wellEmitFire(b,dt){const p=G.player;if(b.stun>0||p.hp<=0)return;const pa=Math.atan2(p.y-b.cy,p.x-b.cx),pd=Math.hypot(p.x-b.cx,p.y-b.cy);let busy=b.emit.filter(e=>e.alive&&(e.tel85>0||e.bn85>0)).length;
  for(const e of b.emit){if(!e.alive||e.spawnT>0||e.corona)continue;if(e.cd85>0)e.cd85-=dt;
    if(e.tel85>0){e.tel85-=dt;if(e.tel85<=0){e.bn85=3;e.bt85=0;}continue;}
    if(e.bn85>0){e.bt85-=dt;if(e.bt85<=0){e.bn85--;e.bt85=.13;shootE(e.x,e.y,Math.atan2(p.y-e.y,p.x-e.x)+rnd(-.04,.04),250,9,'#9fb8ff',4);sfx('shot');if(e.bn85<=0)e.cd85=3*atkK();}continue;}
    if(e.cd85<=0&&busy<2&&G.t>=(b.emitGap||0)&&pd>e.ringR+24&&Math.abs(angDiff(pa,e.ang85))<.52){e.tel85=pk85(.8,.6,.6);busy++;b.emitGap=G.t+pk85(2.2,1.6,1.2);}}}
// паломники летят на зов; долетевший питает ядро и становится нотой; импульс будит
function tol85(){const s=G.save&&G.save.story;return ((s&&s.spared||0)>=5?1:0)+(storyFlag('line31')==='write'?1:0);}
function wellPilgrims(b,dt){b.pilT-=dt;if(b.pilT<=0&&b.pilN<8){b.pilT=10;const a=rnd(0,TAU);
    for(let i=0;i<2&&b.pilN<8;i++){const aa=a+(i?.28:0),e=spawnEnemy('pilgrim',b.cx+Math.cos(aa)*(b.R-26),b.cy+Math.sin(aa)*(b.R-26),{noAffix:true,noLoot:true,spawnT:.6});e.hp=e.maxHp=60;e.peace=true;e.pg85={st:'go',tol:tol85()};b.pilN++;}
    if(!b.pilH){b.pilH=1;floater(G.player.x,G.player.y-44,'ПАЛОМНИКИ ЛЕТЯТ НА ЗОВ · БУДИТЕ ИМПУЛЬСОМ',C85.pil);}}}
function wellPilMove(b,dt){for(const e of G.enemies){if(!e.alive||e.type!=='pilgrim'||!e.pg85||e.spawnT>0)continue;const g=e.pg85;
    if(g.st==='go'){const dx=b.cx-e.x,dy=b.cy-e.y,d=Math.hypot(dx,dy)||1;steer(e,dx,dy,b.st==='fight'?50:0,dt,2);if(d<b.r+22&&b.st==='fight'&&b.phase<4)wellAbsorb(b,e);}
    else if(g.st==='woke'){const dx=e.x-b.cx,dy=e.y-b.cy,d=Math.hypot(dx,dy)||1;steer(e,dx,dy,140,dt,2.5);if(d>b.R+50)e.alive=false;}
    else pil85Hostile(e,dt);}}
function wellAbsorb(b,e){e.alive=false;b.absorbed++;if(G.mc)G.mc.absorb38=1;const up=b.phase===1?b.maxHp:b.maxHp*b.th[b.phase-2]-1;b.hp=Math.min(up,b.hp+b.maxHp*.02);explode(e.x,e.y,C85.pil,14,.6);snd85('absorb');
  floater(b.cx,b.cy-b.r-30,'ГОЛОС КОЛОДЦУ · +2%',C85.pil);RI85('…ещё один голос. Громче…',{key:'absorb',cd:16});
  if(G.enemies.filter(o=>o.alive&&o.type==='note85').length<6){const n=spawnEnemy('note85',b.cx,b.cy,{noAffix:true,noLoot:true,spawnT:.4,host85:b});n.oa=rnd(0,TAU);n.or=b.r+42+rnd(0,34);n.fc=rnd(1,3);}}
function wellWake(b,e){const g=e.pg85;if(!g||g.st!=='go')return false;g.st='woke';e.peace=true;b.woke++;const S=G.save;if(S&&S.story&&G.mode==='world')S.story.woke=(S.story.woke||0)+1;
  floater(e.x,e.y-24,'ПРОСНУЛСЯ',C85.pil);explode(e.x,e.y,C85.pil,8,.4);say85('ПАЛОМНИК',C85.pil,'Где я? Я… поворачиваю.',{key:'woke',cd:14});return true;}
function pil85Hurt(e,dmg,src){const g=e.pg85;if(!g)return dmg;const b=sb85();
  if(src&&src.pulse){if(b&&b.sbk==='well'&&g.st==='go')wellWake(b,e);return g.st==='hostile'?dmg:0;}
  if(g.st==='hostile')return dmg;if(G.mc)G.mc.pilHit38=1;
  if(g.tol>0){g.tol--;floater(e.x,e.y-24,'ОНИ СЧИТАЮТ ЭТО ОШИБКОЙ',C85.pil);e.flash=.1;return 0;}
  g.st='hostile';e.peace=false;e.hostile80=true;e.cd=1;floater(e.x,e.y-24,'ПАЛОМНИК: ТЫ НЕ ИЗ НАС',C85.red);RI85('…ты не из нас…',{key:'hostile',cd:20});sfx('warn');return dmg;}
function pil85Hostile(e,dt){const p=G.player,pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1,k=clamp((pd-300)/100,-1,1);steer(e,pdx/pd*k-pdy/pd*.5*e.dir,pdy/pd*k+pdx/pd*.5*e.dir,e.spd*1.3,dt,2);
  e.cd-=dt;if(e.cd<=0&&p.hp>0&&pd<700){e.cd=1.3;const a=Math.atan2(pdy,pdx),n=Math.min(3,(G.st&&G.st.shots)||1);for(let i=0;i<n;i++)shootE(e.x,e.y,a+(i-(n-1)/2)*.12,520,6,'#dfe8ff',4);}}
function noteAI85(e,dt){e.vx=e.vy=0;const b=e.host85&&e.host85.alive?e.host85:null;if(!b){e.oa=(e.oa||0)+dt;return;}const p=G.player,slow=b.phase>=4?1.25:1;
  e.oa=(e.oa||0)+dt*.9/slow;e.x=b.cx+Math.cos(e.oa)*(e.or||b.r+50);e.y=b.cy+Math.sin(e.oa)*(e.or||b.r+50);
  e.fc=(e.fc===undefined?2:e.fc)-dt;if(e.fc<=0&&p.hp>0&&b.st==='fight'&&b.tr<=0){e.fc=3*slow*atkK();const q=shootE(e.x,e.y,Math.atan2(p.y-e.y,p.x-e.x),120,8,'#9fb8ff',5);if(q){q.homing=true;q.life=6;}}}
// эхо: запись 8 с полёта и выстрелов → Отзвук-0 повторяет; импульс рядом стирает
function wellEcho(b,dt){const p=G.player,overlap=rk85()>0&&b.hp<=b.maxHp*.55,R=b.rec;
  if(R){R.t+=dt;R.st+=dt;if(R.st>=.1&&p.hp>0){R.st=0;if(R.path.length<80)R.path.push({t:R.t,x:p.x,y:p.y});}
    for(const q of G.pb){if(q.e85)continue;q.e85=1;if(q.drone||q.turret||q.jr||q.test||(q.age||0)>.08||Math.hypot(q.x-p.x,q.y-p.y)>60)continue;
      if(R.shots.length>=120)R.shots=R.shots.filter((_,i)=>i%2===0);R.shots.push({t:R.t,a:Math.atan2(q.vy,q.vx),spd:Math.hypot(q.vx,q.vy),dmg:q.dmg,blast:q.blast?(q.R||110):0,charged:!!q.charged});}
    if(R.t>=8){b.rec=null;wellPlay(b,R);b.recT=overlap?.05:99;}}
  else{for(const q of G.pb)q.e85=1;b.recT-=dt;if(b.recT<=0&&b.ghosts.filter(g=>g.alive).length<2&&p.hp>0){b.rec={t:0,st:0,x0:p.x,y0:p.y,path:[{t:0,x:p.x,y:p.y}],shots:[]};snd85('rec');if(!b.recH){b.recH=1;floater(p.x,p.y-42,'● REC · КОЛОДЕЦ ЗАПИСЫВАЕТ ВАС',C85.red);}}}
  b.ghosts=b.ghosts.filter(g=>g.alive);if(!b.rec&&b.recT>50&&!b.ghosts.length)b.recT=1.5;
  b.echoT-=dt;if(b.echoT<=0){b.echoT=22;if(G.enemies.filter(e=>e.alive&&e.type==='echo80').length<pk85(1,1,2)){const a=rnd(0,TAU);spawnEnemy('echo80',b.cx+Math.cos(a)*(b.R-40),b.cy+Math.sin(a)*(b.R-40),{noAffix:true,spawnT:.6,escort:true});}}}
function wellPlay(b,R){const g=spawnEnemy('ghost85',R.x0,R.y0,{noAffix:true,noLoot:true,spawnT:.3,host85:b});g.rec=R;g.pt=0;g.si=0;g.rl=12;g.trail=[];b.ghosts.push(g);snd85('play');
  if(!RI85('…вот так ты летал восемь секунд назад…',{key:'ghost',cd:30})&&!b.ghH){}b.ghH=1;}
function ghostAI85(e,dt){e.vx=e.vy=0;const R=e.rec;if(!R){e.t85=(e.t85||0)+dt;e.x+=Math.cos(e.t85*.8)*20*dt;e.y+=Math.sin(e.t85*1.1)*20*dt;return;}
  const p=G.player,b=e.host85;e.pt+=dt;const P=R.path;let i=0;while(i<P.length-1&&P[i+1].t<=e.pt)i++;const a=P[i],c=P[Math.min(P.length-1,i+1)],k=c.t>a.t?clamp((e.pt-a.t)/(c.t-a.t),0,1):0;
  const nx=a.x+(c.x-a.x)*k,ny=a.y+(c.y-a.y)*k;e.face=Math.atan2(ny-e.y,nx-e.x)||e.face||0;e.x=nx;e.y=ny;e.trail.push({x:nx,y:ny});if(e.trail.length>18)e.trail.shift();
  e.rl=Math.min(12,(e.rl||0)+12*dt);const cap=[12,18,22][rk85()],X=x85();
  while(e.si<R.shots.length&&R.shots[e.si].t<=e.pt){const s=R.shots[e.si++];if(e.rl<1||p.hp<=0||!b||b.tr>0)continue;e.rl-=1;const q=shootE(e.x,e.y,s.a,Math.min(700,s.spd*.7),clamp(s.dmg*.4,2,cap),'#f2f6ff',s.charged?7:s.blast?6:4);
    if(q){q.gh85=1;X.trk.push(q);if(s.blast){q.bl85=s.blast*.6;q.life=1.1;X.bl.push(q);}}}
  if(e.pt>=R.t+.05){e.alive=false;explode(e.x,e.y,'#f2f6ff',10,.5);}}
function wellGhostDied(b,e){floater(e.x,e.y-26,'ЗАПИСЬ ОБОРВАНА','#f2f6ff');RI85('…ты стёр себя. Хорошо. Я тоже так делал…',{key:'wipe',cd:30});if(G.mc)G.mc.wipe85=1;}
function wellPulse(b,p,R){const rw=Math.max(220,R);for(const e of G.enemies){if(e.alive&&e.type==='pilgrim'&&e.pg85&&Math.hypot(e.x-p.x,e.y-p.y)<rw+e.r)wellWake(b,e);}
  if(b.phase===2){let wiped=false;for(const g of b.ghosts){if(g.alive&&Math.hypot(g.x-p.x,g.y-p.y)<260+g.r){kill(g,false);wiped=true;}}
    if(b.rec){b.rec=null;b.recT=2;wiped=true;}if(wiped){floater(p.x,p.y-44,'ЗАПИСЬ СТЁРТА','#f2f6ff');RI85('…ты стёр себя. Хорошо. Я тоже так делал…',{key:'wipe',cd:30});if(G.mc)G.mc.wipe85=1;}}}
// петля: три якоря держат счётчик; на нуле колодец отматывает себя на 6 с назад
function wellHist(b,dt){b.histT-=dt;if(b.histT>0)return;b.histT=.5;b.hist.push({t:G.t,hp:b.hp,alive:b.emit.filter(e=>e.alive).map(e=>e.ring+e.idx)});if(b.hist.length>14)b.hist.shift();}
function wellAnchors(b){const a0=rnd(0,TAU);b.anchors=[];for(let i=0;i<3;i++){const a=a0+i*TAU/3,e=spawnEnemy('anchor85',b.cx+Math.cos(a)*(b.R-60*b.k),b.cy+Math.sin(a)*(b.R-60*b.k),{noAffix:true,noLoot:true,spawnT:.6,host85:b});e.hp=e.maxHp=Math.round(b.maxHp*.025);b.anchors.push(e);}
  b.loopT=b.loopMax;b.anchT0=G.t;floater(b.cx,b.cy-b.r-46,'ПЕТЛЯ ЗАМЫКАЕТСЯ · РАЗБЕЙТЕ ТРИ ЯКОРЯ',C85.well);snd85('anchor');}
function wellLoop(b,dt){const al=b.anchors.filter(a=>a.alive);b.anchors=al;
  if(!al.length){if(b.loops>=b.loopCap)return;b.anchorT-=dt;if(b.anchorT<=0)wellAnchors(b);return;}
  if(al.some(a=>a.spawnT>0))return;b.loopT-=dt;
  if(!b.karr&&storyFlag('fleet27')==='engine'&&G.t-(b.anchT0||G.t)>3){b.karr=1;say85('ФЛОТ','#b8c4d6','Это Карр. Держу якорь. Бей остальные.',{force:1});const a=al[0],ea=Math.atan2(a.y-b.cy,a.x-b.cx);
    x74().tracers.push({x1:b.cx+Math.cos(ea)*(b.R+200),y1:b.cy+Math.sin(ea)*(b.R+200),x2:a.x,y2:a.y,t:.4,c:'#ffb84d'});explode(a.x,a.y,'#ffb84d',24,1);sfx('bigboom');floater(a.x,a.y-30,'ЗАЛП КАРРА','#ffb84d');a.hp=1;hurt(a,10,{force:true,pulse:true});if(a.alive)kill(a);}
  if(b.loopT<=0&&b.anchors.some(a=>a.alive))wellLoopFire(b);}
function wellLoopFire(b){const X=x85();X.rew=.8;snd85('rewind');b.loops++;if(G.mc)G.mc.loop38=1;
  let h=null;for(let i=b.hist.length-1;i>=0;i--){if(G.t-b.hist[i].t>=6){h=b.hist[i];break;}}if(!h)h=b.hist[0];
  if(h){const cap=b.maxHp*pk85(.06,.05,.05),hi=b.maxHp*b.th[1]-1,nh=Math.min(h.hp,b.hp+cap,hi);if(nh>b.hp)b.hp=nh;
    for(const key of h.alive){if(b.emit.some(e=>e.alive&&e.ring+e.idx===key))continue;const ring=wellRing(b,key[0]),i=+key.slice(1);const q=wellEmit(b,ring,i,.4,.5);q.back85=1;}}
  const a=b.anchors.find(q=>q.alive);if(a)spawnEnemy('loop',a.x,a.y,{noAffix:true,spawnT:.5,escort:true});
  RI85('…и снова. Как всегда…',{key:'loop',cd:8});banner('ПЕТЛЯ','КОЛОДЕЦ ОТМОТАЛ СЕБЯ НАЗАД');buzz('hit2');
  if(b.loops>=b.loopCap){for(const q of b.anchors)if(q.alive){q.alive=false;explode(q.x,q.y,C85.well,16,.7);}b.anchors=[];floater(b.cx,b.cy-b.r-46,'ПЕТЛЯ ИСЧЕРПАНА',C85.well);}else b.loopT=b.loopMax;}
function wellAnchorDied(b,e){explode(e.x,e.y,C85.well,22,.9);sfx('boom');if(b.anchors.some(a=>a!==e&&a.alive)){floater(e.x,e.y-26,'ЯКОРЬ РАЗБИТ · '+b.anchors.filter(a=>a!==e&&a.alive).length+' ОСТАЛОСЬ',C85.well);return;}
  b.stun=4;b.anchorT=25;b.brkN++;banner('ПЕТЛЯ РАЗОРВАНА','ЯДРО ОГЛУШЕНО · УРОН ×1,5');RI85('…так далеко ещё никто…',{key:'brk',cd:30});snd85('break');shake(8);}
// тишина: кольца становятся короной, один голос в эфире
function wellSilence(b,dt){const p=G.player;b.p4t+=dt;
  if(rk85()>0){b.invT-=dt;if(!b.iw&&b.invT<=0&&(rk85()>=2||b.invN<1)){b.iw={st:'tele',t:1,r:b.r};b.invN++;b.invT=30;snd85('inv');}}
  if(b.iw){const I=b.iw;if(I.st==='tele'){I.t-=dt;if(I.t<=0){I.st='go';I.hit=false;}}else{I.r+=500*dt;if(!I.hit&&p.hp>0&&Math.abs(Math.hypot(p.x-b.cx,p.y-b.cy)-I.r)<22){I.hit=true;if(p.dashT<=0&&!(x85().calm>0))invHit80();}if(I.r>b.R+20)b.iw=null;}}
  b.p4T-=dt;const L=wellP4();if(b.p4T<=0&&b.p4i<L.length){const q=L[b.p4i++];say85(q[0],q[0]==='ИСТОК'?C85.well:C85.voidc,q[1],{force:1});b.p4T=7;}
  if(!b.p4last&&b.hp<=b.maxHp*.03){b.p4last=true;say85('VØID',C85.voidc,storyFlag('line31')==='write'?'Ты оставил себя в лекале. Значит, тебя запомнят дважды.':'Теперь ты у самого дна.',{force:1});}}
function wellP4(){const L=[['ИСТОК','…Курсант Тео… прошу разрешения вернуться…'],['VØID',storyFlag('fleet27')==='bridge'?'…журнал обрывается на вопросе…':'…почему не в рубку… почему не в рубку…'],['VØID','Страж не добил меня. Сказал: «Опять рано».']];
  if(storyFlag('cradle22')==='cut')L.push(['VØID','…партия Кормилицы закрыта…']);L.push(['VØID','Я тоже летел на голос. Потом стал им.']);return L;}
// урон: ядро — в пул (×1,3, пока играет Отзвук; ×1,5 после разрыва петли); излучатель — свой запас и пул
function wellHurt(b,e,dmg,src){if(e.type==='wellcore'){const fl=b.phase>=4&&(b.p4t<18||b.p4i<3)?.03:0;pool85(b,dmg*wellCoreK(b),fl,e);return 0;}
  if(e.corona)return 0;const d=Math.min(dmg,e.hp);pool85(b,d,0,null);return dmg;}
function wellEmitDied(b,e){explode(e.x,e.y,C85.well,16,.7);sfx('boom');if(!b.gapH){b.gapH=1;floater(e.x,e.y-24,'ПРОХОД В КОЛЬЦЕ',C85.well);}}
// снаряды игрока: кольца глотают обычные, заряд и «Разрыв» проходят насквозь с уроном по излучателю
function wellBullet(b,bu){if(b.st!=='fight'||b.phase>=4)return false;
  // попадание в сам излучатель (раньше пересечения кольца) — по тем же правилам щита
  for(const e of b.emit){if(!e.alive||e.corona||e.spawnT>0||bu.hit.includes(e))continue;if(segDist(bu.px,bu.py,bu.x,bu.y,e.x,e.y)>e.r+3)continue;
    if(bu.charged||bu.blast){bu.hit.push(e);hurt(e,bu.dmg*1.5,{charged:!!bu.charged,blast:!!bu.blast});continue;}hurt(e,bu.dmg,{ring:true});bu.life=0;e.shieldFlash=.08;return true;}
  for(const ring of b.rings){const d0=Math.hypot(bu.px-b.cx,bu.py-b.cy),d1=Math.hypot(bu.x-b.cx,bu.y-b.cy),R=ring.r;if((d0-R)*(d1-R)>0)continue;
    const k=Math.abs(d0-d1)<1e-6?0:(d0-R)/(d0-d1),x=bu.px+(bu.x-bu.px)*k,y=bu.py+(bu.y-bu.py)*k,a=Math.atan2(y-b.cy,x-b.cx);
    const e=b.emit.find(q=>q.alive&&q.ring===ring.id&&!q.corona&&q.spawnT<=0&&Math.abs(angDiff(a,q.ang85))<ring.arc/2);if(!e)continue;
    if(bu.charged||bu.blast){if(!bu.hit.includes(e)){bu.hit.push(e);hurt(e,bu.dmg*1.5,{charged:!!bu.charged,blast:!!bu.blast});}continue;}
    hurt(e,bu.dmg,{ring:true});bu.life=0;e.shieldFlash=.08;if(SET.fx)part(x,y,vrnd3(-40,40),vrnd3(-40,40),.25,'#9fb8ff',2);return true;}
  return false;}
function wellBlocker(b,x,y){if(b.phase>=4)return null;const a=Math.atan2(y-b.cy,x-b.cx),d=Math.hypot(x-b.cx,y-b.cy);
  for(const ring of b.rings){if(d<ring.r)continue;const e=b.emit.find(q=>q.alive&&q.ring===ring.id&&!q.corona&&q.spawnT<=0&&Math.abs(angDiff(a,q.ang85))<ring.arc/2);if(e)return e;}return null;}
function wellAuto(p,b){let best=null,bs=1e9;const cand=(e,w)=>{if(!e||!e.alive||!targetable(e))return;const d=Math.hypot(e.x-p.x,e.y-p.y)/w;if(d<bs){bs=d;best=e;}};
  for(const a of b.anchors)cand(a,1.6);for(const g of b.ghosts)cand(g,1.15);for(const e of G.enemies){if(!e.alive)continue;if(e.type==='echo80')cand(e,1.25);else if(e.type==='loop'||e.type==='inverse'||(e.type==='pilgrim'&&e.hostile80))cand(e,1);}if(best&&bs<720)return best;
  const blk=wellBlocker(b,p.x,p.y);if(blk&&targetable(blk))return blk;return targetable(b)?b:null;}
function wellHud(b){if(b.stun>0)return 'ПЕТЛЯ РАЗОРВАНА · ЯДРО ОГЛУШЕНО ×1,5';if(b.phase===1)return 'ЗОВ · КОЛЬЦА ГЛОТАЮТ СНАРЯДЫ · БЕЙТЕ В ПРОХОДЫ';
  if(b.phase===2)return b.ghosts.some(g=>g.alive)?'ОТЗВУК-0 ИГРАЕТ · ЯДРО СЛУШАЕТ ×1,3':b.rec?'● REC · НЕ ПОВТОРЯЙТЕ СВОЙ ПУТЬ':'ЭХО';
  if(b.phase===3)return b.anchors.some(a=>a.alive)?'ЯКОРЯ ПЕТЛИ · РАЗБЕЙТЕ ДО НУЛЯ':b.loops>=b.loopCap?'ПЕТЛЯ ИСЧЕРПАНА':'ПЕТЛЯ';return 'ТИШИНА · СЛУШАЙТЕ';}
function wellStrip(b){
  if(b.st==='enter')return {l:'ПЕРВЫЙ СИГНАЛ · ИСТОЧНИК НЕ ОПОЗНАН',k:null,lc:C85.well};
  if(b.st==='scene')return {l:'VØID-013 · ЦИКЛ ??',k:null,lc:C85.voidc};
  if(b.st==='final')return {l:b.prev85?'ВЫ УЖЕ СДЕЛАЛИ ВЫБОР · ЛЕТИТЕ К ПРИЧАЛУ':'РЕШАЙТЕ, ЧТО УСЛЫШИТ СЛЕДУЮЩИЙ',k:null,lc:C85.voidc};
  if(b.phase===1)return {l:'ПРОБУЖДЕНО '+b.woke+' · ГОЛОСОВ КОЛОДЦУ '+b.absorbed,k:null,lc:C85.pil};
  if(b.phase===2){const g=b.ghosts.find(q=>q.alive&&q.rec);if(g)return {l:'▶ ОТЗВУК-0 · ЯДРО СЛУШАЕТ ×1,3',k:1-g.pt/8,col:'#f2f6ff',r:fmt85(8-g.pt)+' С'};if(b.rec)return {l:'● REC',lc:C85.red,k:b.rec.t/8,col:C85.red,r:fmt85(8-b.rec.t)+' С'};return {l:'ЭХО · ЗАПИСЬ СКОРО',k:null};}
  if(b.phase===3){const al=b.anchors.filter(a=>a.alive).length;if(al)return {l:'ПЕТЛЯ ЗАМЫКАЕТСЯ · '+Math.max(0,Math.ceil(b.loopT)),lc:b.loopT<5?C85.red:C85.well,k:b.loopT/b.loopMax,col:C85.well,r:'ЯКОРЯ '+al+'/3'};
    return {l:b.loops>=b.loopCap?'ПЕТЛЯ ИСЧЕРПАНА':b.stun>0?'ПЕТЛЯ РАЗОРВАНА · ЯДРО ОГЛУШЕНО':'ЯКОРЯ ВЕРНУТСЯ · '+Math.ceil(b.anchorT)+' С',k:null,lc:C85.well,r:'ПЕТЕЛЬ '+b.loops+'/'+b.loopCap};}
  return {l:'ТИШИНА',k:null,lc:C85.voidc};}
// третья кнопка: «write» + милость раньше + ни одного убитого паломника + ≥4 разбуженных в этом бою
function third85(b){const s=G.save&&G.save.story||{};return storyFlag('line31')==='write'&&(storyFlag('cradle22')==='keep'||storyFlag('fleet27')==='engine')&&!((s.pilgrimsKilled||0)>0)&&((b&&b.woke)||0)>=4;}
// фазы
function wellPhase(b){const X=x85();
  if(b.phase===2){banner('ПЕРВЫЙ СИГНАЛ · ФАЗА 2','ЭХО · ТАМ, ГДЕ ВЫ БЫЛИ, СТАНЕТ ОПАСНО');RI85('…постой. Я запомню, как ты летаешь…',{force:1,d:.5});b.recT=2.6;b.echoT=9;}
  if(b.phase===3){banner('ПЕРВЫЙ СИГНАЛ · ФАЗА 3','ПЕТЛЯ · РАЗБЕЙТЕ ТРИ ЯКОРЯ');RI85('…ещё раз. Ещё раз. Это не должно кончиться…',{force:1,d:.5});b.rec=null;for(const g of b.ghosts)if(g.alive)kill(g,true);b.ghosts=[];b.anchorT=1.2;
    if(X.ally&&X.ally.kind==='serial'){X.ally.t=Math.min(X.ally.t,1.5);floater(X.ally.x,X.ally.y-24,'СЕРИЙНИК 013 УХОДИТ',C85.lek);}}
  if(b.phase===4){banner('ПЕРВЫЙ СИГНАЛ · ФАЗА 4','ТИШИНА');b.anchors.forEach(a=>{if(a.alive){a.alive=false;explode(a.x,a.y,C85.well,12,.6);}});b.anchors=[];b.p4T=2.6;b.p4t=0;
    for(const e of b.emit){e.corona=true;e.ghost=true;e.tel85=0;e.bn85=0;}radioClear();X.silence=0;}}
function wellAlly(b){const X=x85();if(!X.allyPending)return;X.allyPending=0;const hp=Math.round(EDEF.serial85.hp*SEC_SCALE[7].hp*.6);
  X.ally={kind:'serial',x:G.player.x-60,y:G.player.y+40,a:0,cd:1,t:1e9,hp,maxHp:hp,no:13};say85('СЕРИЙНИК 013',C85.lek,'Сделан по новому лекалу. Лечу с тобой.',{force:1,d:1.2});floater(G.player.x,G.player.y-50,'СЕРИЙНИК 013 · СОЮЗНИК',C85.lek);}
// финал: белая вспышка, корабль на дне, голос
function wellFinal(b){if(G.x80&&G.x80.leaks)G.x80.leaks=G.x80.leaks.filter(q=>!q.w85);b.sons=[];b.iw=null;b.rec=null;b.scT=0;b.subOn=false;b.flashK=0;for(const e of b.emit)if(e.alive)kill(e,true);b.emit=[];snd85('final');banner('ГОЛОС ГАСНЕТ','НА ДНЕ — КОРАБЛЬ');}
function wellScene(b,dt){b.scT+=dt;b.flashK=b.scT<1.2?b.scT/1.2:Math.max(0,1-(b.scT-1.2)/1.6);
  if(b.st==='scene'&&b.scT>=2.6&&!b.subOn){b.subOn=true;
    sub85('VØID-013 · ЦИКЛ ??',C85.voidc,['«Это не чужой сигнал. Это мой. И твой».','«Каждый из нас долетает до дна и зовёт следующего».','«Стражи летят отсюда, чтобы остановить нас раньше. Паломники — чтобы звать громче».','«Это и есть последний сигнал. Последний — потому что каждый раз кажется последним».','«Решай, что услышит следующий».'],
      ()=>{if(b.st!=='scene')return;b.st='final';const t3=third85(b);
        const L=[{kind:'silence',x:b.cx-dock85dx(b.k),y:b.cy+b.R*.28,lab:'ЗАГЛУШИТЬ',sub:'тишина для всех'},{kind:'answer',x:b.cx+dock85dx(b.k),y:b.cy+b.R*.28,lab:'ОТВЕТИТЬ',sub:'сигнал — вашими словами'}];
        L.push({kind:'third',x:b.cx,y:b.cy+b.R*.72,lab:t3?'ПРОДОЛЖИТЬ ПОИСК':'…есть третья частота, но она не ловится…',sub:t3?'координаты за краем карты':'',lock:!t3});
        sb85SetDocks(b,L);banner('ПЕРВЫЙ СИГНАЛ','ЗАГЛУШИТЬ ИЛИ ОТВЕТИТЬ · ЛЕТИТЕ К ПРИЧАЛУ');sfx('level');});}
  if(b.st==='final')sb85Docks(b,dt);}
function epi85(l,w){const T={'break|silence':'«Больше никто не проснётся и никто не полетит. Ты — последний. Это тихо».','break|answer':'«Копий больше не будет, но твой голос остался. Его услышат другие — не копии».',
  'write|silence':'«Следующий проснётся, помня тебя, и не услышит никакого зова. Ему придётся искать самому».','write|answer':'«Следующий проснётся с твоей памятью и полетит на твой голос. Круг стал короче».',
  'write|third':'«Ты не позвал сюда и не замолчал. Ты позвал дальше».'};return T[l+'|'+w]||(w==='silence'?'«Колодец замолчал. Следующий проснётся в тишине».':w==='answer'?'«Сигнал теперь звучит твоими словами».':'«Ты позвал дальше».');}
function wellChoose(b,ch,world,prev){const badges=[];if(!b.ghostHit)badges.push('«Не оглядывайся»');if(!b.loops)badges.push('«Разомкнутый»');const bt=badges.length?' Бейджи: '+badges.join(', ')+'.':'';const ep=epi85(storyFlag('line31')||'',ch),X=x85();
  if(ch==='silence'){G.sbLomK=prev?1:2;X.silence=3;G.sbChoiceTxt=(prev?'Вы уже сделали выбор: колодец заглушён. ':'Колодец заглушён: лом ×2. Паломники сектора VIII разворачиваются, Исток молчит, Отзвуков и Петель в миссиях 32–37 меньше. Скин «Тишина». ')+ep+bt;
    SB_DEATH.well=['КОЛОДЕЦ ЗАМОЛЧАЛ','СЕКТОР VIII ПРОЙДЕН','Тишина — тоже ответ. Я так и не решился его дать.'];if(world&&!prev)own85('silence85');}
  else if(ch==='answer'){G.sbLomK=1;G.sbChoiceTxt=(prev?'Вы уже сделали выбор: вы ответили. ':'Вы ответили: лом ×1. Паломники видят в вас своего, модуль «Позывной» — первый импульс в миссии даёт щит и короткую неуязвимость. Скин «Позывной 013». ')+ep+bt;
    SB_DEATH.well=['СИГНАЛ ПРИНЯТ','СЕКТОР VIII ПРОЙДЕН','Ты ответил. Значит, следующий услышит не просьбу, а голос.'];if(world&&!prev)own85('callsign013');}
  else{G.sbLomK=prev?1:1.5;G.sbChoiceTxt=(prev?'Вы уже сделали выбор: поиск продолжается. ':'Сигнал перестроен на координаты за краем карты: лом ×1,5. На карте — «Сигнал за Пределом». Скин «Несущая». ')+ep+bt;
    SB_DEATH.well=['ТРЕТЬЯ ЧАСТОТА','СИГНАЛ ЗА ПРЕДЕЛОМ · СКОРО','Если слышишь это — значит, ты нашёл. Третий путь не здесь. Он там, куда сигнал никогда не звал.'];if(world&&!prev){own85('carrier85');if(G.save.story)G.save.story.third85=1;}}}

