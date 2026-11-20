// ===== 0.9.5: босс сектора IX — «Сердце» 2.0 (комната 42) =====
['heart90','hvalve90','hkey90','thromb90'].forEach(k=>SB85T.add(k));HOST85.add('heart90');
SB_NAMES.heart='СЕРДЦЕ';SB_FLAG.heart='heart42';SB_FLAG_M[42]='heart42';
SB_DEATH.heart=['СЕРДЦЕ ВСТАЛО','СЕКТОР IX ПРОЙДЕН','Я построил Ковчег, чтобы кто-то долетел. Я не думал, что он будет лететь вечно.'];
const HEART_PH=['РИТМ','АРИТМИЯ','ДВОЙНОЙ УДАР','ОСТАНОВКА'],HEART_BPM=[50,70,90,60];
function heartGeo(b){if(b.gw===W&&b.gh===H)return;b.gw=W;b.gh=H;b.cx=W/2;b.cy=H/2;b.R=.46*Math.min(W,H);b.k=clamp(b.R/330,.7,1.2);b.x=b.cx;b.y=b.cy;b.r=52*b.k;b.floor95=null;
  b.ves=[45,135,225,315].map((d,i)=>{const a=d*Math.PI/180;return {i,a,shut:(b.ves&&b.ves[i]?b.ves[i].shut:0),dead:(b.ves&&b.ves[i]?b.ves[i].dead:false)};});
  if(b.parts)for(const q of b.parts){if(!q.alive)continue;if(q.type==='hvalve90'){const a=b.ves[q.vi].a;q.x=b.cx+Math.cos(a)*(b.r+30*b.k);q.y=b.cy+Math.sin(a)*(b.r+30*b.k);}
    if(q.type==='hkey90'){const a=-Math.PI/2+q.ki*TAU/b.keyN+(b.keyA96||0);q.x=b.cx+Math.cos(a)*150*b.k;q.y=b.cy+Math.sin(a)*150*b.k;q.r=34*b.k;}}}
function heartPer(b){return 60/b.tempo;}
function heartSys(b){return Math.min(.35,b.btN*.4);}
function heartPerfW(b){return Math.min(.3,b.btN*.36);}
function heartInSys(b){return b.bt<heartSys(b)&&b.phase<4;}
function heartInPerf(b){return b.phase<4&&b.btN-b.bt<=heartPerfW(b);}
// очередь будущих ударов: лента тактов показывает их заранее (аритмия видна до того, как случится)
function heartQ95(b){const Q=b.q95||(b.q95=[]);while(Q.length<6)Q.push({d:heartPer(b),arr:0});return Q;}
function heartPerfBeat95(){const b=G.sb;if(!b||!b.alive||b.sbk!=='heart'||b.st!=='fight'||b.phase>=4)return 0;return heartInPerf(b)?b.beatN+1:0;}
SBX.heart={K:1.3,th:[.7,.4,.15],mc:'heart90',
  spawn(){ambSting('boss');radioClear();const b=spawnEnemy('heart90',W/2,H/2,{noAffix:true,noLoot:true});sb85Init(b,'heart',3.4);banner('СЕРДЦЕ КОВЧЕГА','ФАЗА 0 · ПРИСЛУШАЙТЕСЬ');
    radioLine('КОВЧЕГ',C90.ark,'Посторонний в сердечной камере. Пассажиры спят. Ритм — пятьдесят.',.8);return b;},
  init(b){b.gw=0;heartGeo(b);Object.assign(b,{tempo:50,bt:0,btN:1.2,beatN:0,waves:[],arr:null,arrT:18,phagoT:8,thrT:6,thr:null,keys:[],keyI:0,keyN:rk90()<=0?3:4,keyHit:false,keyWin:false,p4T:0,p4miss:0,miss:0,launch:0,launches:0,
      p4auto:false,perfN:0,perfT:-9,perfHint:0,lit:0,sysK:0,karr:0,ally:false,nextGaps:null,curGaps:null,dbl:0,scT:0,subOn:false,openK:0,hitT0:-9,bgT:0,
      q95:[],combo:0,comboLast:-9,comboBuff:1,nearT:0,whipN:0,leukT:18,fibT:20,fib:0,fibI:0,bleed:[],dry:0,autoK:0,chunkN:0,swell:0,flashP:0,crack:0,atkK95:rk90()>=2?1.15:1});
    b.contact=0;b.ghost=false;},
  phase(b){const X=x85();b.tempo=HEART_BPM[b.phase-1]||60;b.waves=[];b.arr=null;b.q95=[];b.comboBuff=1;b.combo=0;hs90(.25,1);snd95('phase95');const XX=G.x90;if(XX){XX.tg95=[];}
    if(b.phase===2){banner('СЕРДЦЕ · ФАЗА 2','АРИТМИЯ · КЛАПАНЫ СТРЕЛЯЮТ · ПРОХОДЫ ПЛЫВУТ');b.gth96=b.ves[0].a;b.gdir96=1;b.gfl96=8;radioLine('КОВЧЕГ',C90.ark,'Ритм нарушен. Подключаю клапаны.',.4);
      b.ves.forEach((v,i)=>{const q=spawnEnemy('hvalve90',b.cx,b.cy,{noAffix:true,noLoot:true,spawnT:.8,host85:b,vi:i,keep85:1});q.hp=q.maxHp=Math.round(b.maxHp*.04);q.r=20*b.k;b.parts.push(q);});heartGeo(Object.assign(b,{gw:0}));b.arrT=10;b.phagoT=6;
      if(storyFlag('fleet27')==='engine')b.karr=8;}
    if(b.phase===3){banner('СЕРДЦЕ · ФАЗА 3','ДВОЙНОЙ УДАР · ПРОХОДЫ ДРЕЙФУЮТ');radioLine('КОВЧЕГ',C90.ark,'Тахикардия. Сгустки — к сердцу.',.4);for(const q of b.parts)if(q.type==='hvalve90'&&q.alive)kill(q,true);b.thrT=5;b.fibT=16;b.gth96=b.ves[0].a;b.gdir96=1;b.gfl96=8;b.nextGaps=heartGaps(b,1);}
    if(b.phase===4){banner('СЕРДЦЕ ВСТАЛО','КАМЕРУ ЗАЛИВАЕТ · ПРОЛЕТАЙТЕ КЛЮЧИ В ТАКТ');b.lN96=rk90()<=0?2:3;b.keyA96=0;b.rot96=0;b.fin96=0;radioLine('КОВЧЕГ',C90.ark,'Остановка. Затопление камеры. Ручной запуск: ключи по порядку, в такт. Запусков нужно '+b.lN96+'.',.4);
      if(b.thr&&b.thr.alive)kill(b.thr,true);b.thr=null;for(const o of G.enemies)if(o.alive&&!o.host85&&o!==b&&!EDEF[o.type].passive)kill(o,true);b.bleed=[];
      for(let i=0;i<b.keyN;i++){const q=spawnEnemy('hkey90',b.cx,b.cy,{noAffix:true,noLoot:true,spawnT:.8,host85:b,ki:i,keep85:1,ghost:true});q.hp=q.maxHp=1e6;q.contact=0;b.parts.push(q);b.keys.push(q);}
      heartGeo(Object.assign(b,{gw:0}));b.keyI=0;b.p4T=0;b.lastL90=0;b.bt=0;b.btN=heartPer(b);b.dry=b.R;snd90('stop');snd95('flood',b.cx);trauma90(.5);}},
  hurt(b,e,dmg,src){
    if(e===b){if(b.phase>=4){const L=b.launch>0;if(L&&b.fin96)return 0;pool85(b,dmg*(L?(b.autoK?1.4:2.5):.15),L?heartQuota96(b,Math.max(1,b.launches)):heartQuota96(b,b.launches+1)+.01,e);if(L&&!b.fin96&&b.hp<=b.maxHp*heartQuota96(b,Math.max(1,b.launches))+1&&b.launch>.7)b.launch=.7;if(L&&G.t-(b.hsL||0)>.5){b.hsL=G.t;hsWeak95();}if(!L&&!b.floorHint2){b.floorHint2=1;floater(b.cx,b.cy-b.r-40,'СЕРДЦЕ СТОИТ · ЗАПУСТИТЕ КЛЮЧАМИ','#ffffff');}return 0;}
      let K=1;const perfB=src.bt95||(heartInPerf(b)&&!src.drone?b.beatN+1:0);if(heartInSys(b)&&!src.bt95)K=.15;else if(perfB){K=(b.arr||b.curArr95)?2:1.6;heartPerfect(b,perfB);}
      const nv=b.parts.filter(q=>q.alive&&q.type==='hvalve90').length;K*=(1-.12*nv)*b.comboBuff;pool85(b,dmg*K,0,e);return 0;}
    if(e.type==='hkey90')return 0;
    if(e.type==='hvalve90'||e.type==='thromb90'){const d=Math.min(dmg,e.hp);pool85(b,d*.7,0,null);return dmg;}
    return dmg;},
  targ(b,e){if(e.type==='hkey90')return false;if(e===b)return b.st==='fight';return true;},
  auto(p,b){if(b.phase>=4)return targetable(b)?b:null;
    if(b.thr&&b.thr.alive&&targetable(b.thr))return b.thr;let best=null,bd=1e9;for(const q of b.parts){if(!q.alive||q.type!=='hvalve90'||!targetable(q))continue;const d=Math.hypot(q.x-p.x,q.y-p.y);if(d<bd){bd=d;best=q;}}if(best&&bd<700)return best;return targetable(b)?b:null;},
  hud(b,k){if(b.st==='dying')return k+' · ВСТАЛО';if(b.st==='final')return k+' · ВЫБОР';if(b.st==='scene')return k+' · КОВЧЕГ';if(b.st==='enter')return k;
    if(b.phase>=4)return b.launch>0?'СЕРДЦЕ ОТКРЫТО · УРОН ×'+(b.autoK?'1,4':'2,5'):'КЛЮЧИ · ЗАПУСКИ '+b.launches+'/'+(b.lN96||2);if(b.arr||b.curArr95)return 'АРИТМИЯ · В ТАКТ ×2';return HEART_PH[b.phase-1]+' · ТЕМП '+b.tempo+(b.combo>1?' · КОМБО ×'+b.combo:'')+(b.comboBuff>1?' · +10%':'');},
  strip(b){if(b.st==='enter')return {l:'СЕРДЦЕ КОВЧЕГА · ПРИСЛУШАЙТЕСЬ К РИТМУ',k:null,lc:C90.ark};if(b.st==='scene')return {l:'КОВЧЕГ · ГОЛОС',k:null,lc:C90.warm};
    if(b.st==='final')return {l:b.prev85?'ВЫ УЖЕ СДЕЛАЛИ ВЫБОР · ЛЕТИТЕ К ПРИЧАЛУ':'РЕШИТЕ ЗА СПЯЩИХ',k:null,lc:C90.warm};
    const ph=clamp(b.bt/b.btN,0,1);
    if(b.phase>=4)return {l:(b.launch>0?'ЗАПУСК · ':'КЛЮЧИ ')+Math.min(b.keyI,b.keyN)+'/'+b.keyN+' · ЗАЛИВАЕТ '+Math.round((1-b.dry/b.R)*100)+'%',k:b.launch>0?b.launch/4:ph,col:b.launch>0?'#ffffff':C90.warm,r:'ЗАПУСКИ '+b.launches+'/'+(b.lN96||2)};
    if(b.phase===3&&b.thr&&b.thr.alive){const d=Math.hypot(b.thr.x-b.cx,b.thr.y-b.cy),k0=clamp((d-b.r)/(b.R*.85-b.r),0,1);return {l:'СГУСТОК ПОЛЗЁТ К СЕРДЦУ · СБЕЙТЕ',k:k0,col:C90.red,r:'ТЕМП '+b.tempo};}
    if(b.phase===2)return {l:'КЛАПАНЫ '+b.parts.filter(q=>q.alive&&q.type==='hvalve90').length+'/4 · '+((b.arr||b.curArr95)?'АРИТМИЯ':'АРИТМИЯ ЧЕРЕЗ '+Math.ceil(Math.max(0,b.arrT))),k:ph,col:(b.arr||b.curArr95)?'#ff9a4d':C90.ark,r:'КОМБО ×'+b.combo};
    return {l:'РИТМ · В ТАКТ '+b.perfN+(b.combo>1?' · КОМБО ×'+b.combo:''),k:ph,col:heartInPerf(b)?'#ffffff':C90.ark,r:'ТЕМП '+b.tempo};},
  update(b,dt){heartGeo(b);const p=G.player;const rdt=G.rdtU96>0?(G.rdtU96--,G.rdt90||dt):dt,A=atk95(b);
    for(const v of b.ves)if(v.shut>0)v.shut-=dt;if(b.swell>0)b.swell-=dt;if(b.flashP>0)b.flashP-=dt;
    if(b.st==='enter'){b.timer-=dt;b.lit=Math.min(1,b.lit+dt/3);heartBeatTick(b,rdt,true);if(b.timer<=0){b.st='fight';b.phT=0;banner('СЕРДЦЕ · ФАЗА 1','РИТМ · БЕЙТЕ ЗА МИГ ДО УДАРА');heartAlly(b);}return;}
    if(b.st==='scene'||b.st==='final'){heartScene(b,dt);return;}
    b.phT+=dt;heartBeatTick(b,rdt,false);heartWaves(b,dt);
    if(b.launch>0){heartFinTick96(b,dt);if(b.st!=='fight')return;b.launch-=dt;b.openK=Math.min(1,b.openK+dt*4);if(b.launch<=0){b.launch=0;b.autoK=0;heartSeq96(b);}}else b.openK=Math.max(0,b.openK-dt*3);
    {const L=Math.max(0,1-b.hp/b.maxHp);b.crack=L>.75?4:L>.55?3:L>.35?2:L>.15?1:0;}
    if(b.tr>0)return;
    // толчок: стоять вплотную дольше 2 с нельзя
    if(p&&p.hp>0&&b.phase<4){const d=Math.hypot(p.x-b.cx,p.y-b.cy);if(d<140*b.k)b.nearT+=dt;else b.nearT=Math.max(0,b.nearT-dt*2);
      if(b.nearT>=2){b.nearT=0;b.swell=.6;tg95({k:'zone',x:b.cx,y:b.cy,r:140*b.k,T:.55,dmg:14,kb:170,col:C90.blood,src:b,key:'heartShove',snd:'tlRing',on:()=>{snd95('shove',b.cx);trauma90(.3);}});floater(b.cx,b.cy-b.r-20,'ТОЛЧОК!',C90.blood);}}
    // кровотечение из разбитых клапанов
    for(const q of b.bleed){q.t-=dt;if(p&&p.hp>0&&Math.hypot(p.x-q.x,p.y-q.y)<q.r&&p.dashT<=0){drain90(5*dt);G.slowP95=Math.max(G.slowP95||0,.1);}}b.bleed=b.bleed.filter(q=>q.t>0);
    if(b.phase<=3){b.leukT-=dt*A;if(b.leukT<=0){b.leukT=b.phase===1?18:24;if(G.enemies.filter(o=>o.alive&&o.type==='hunt95').length<3){const v=b.ves[Math.random()*4|0];const e=spawnEnemy('hunt95',b.cx+Math.cos(v.a)*b.R*.9,b.cy+Math.sin(v.a)*b.R*.9,{noAffix:true,noLoot:true,spawnT:.6,packN95:2});}}}
    if(b.phase===2){heartDrift96(b,dt);b.arrT-=dt*A;if(b.arrT<=0){b.arrT=18;const Q=heartQ95(b),per=heartPer(b);Q.splice(2,0,{d:per*.6,arr:1},{d:per*1.4,arr:1},{d:per*.8,arr:1});floater(b.cx,b.cy-b.r-50,'АРИТМИЯ НА ЛЕНТЕ · В ТАКТ ×2','#ff9a4d');snd90('arr');}
      b.phagoT-=dt;if(b.phagoT<=0){b.phagoT=12;if(G.enemies.filter(o=>o.alive&&o.type==='phago90').length<3){const v=b.ves[Math.random()*4|0];spawnEnemy('phago90',b.cx+Math.cos(v.a)*b.R*.9,b.cy+Math.sin(v.a)*b.R*.9,{noAffix:true,noLoot:true,spawnT:.6});}}
      if(b.karr>0){b.karr-=dt;if(b.karr<=0){b.karr=-1;let vi=0,bd=1e9;b.ves.forEach((v,i)=>{const d=Math.abs(angDiff(Math.atan2(p.y-b.cy,p.x-b.cx),v.a));if(d<bd){bd=d;vi=i;}});b.ves[vi].shut=10;radioLine('КАРР','#b8c4d6','Держу сосуд двигателем. Десять секунд — бей!',.1);floater(b.cx+Math.cos(b.ves[vi].a)*b.R*.7,b.cy+Math.sin(b.ves[vi].a)*b.R*.7,'КАРР ДЕРЖИТ СОСУД','#b8c4d6');}}}
    if(b.phase===3){heartDrift96(b,dt);b.thrT-=dt*A;if(b.thrT<=0&&!(b.thr&&b.thr.alive)){b.thrT=14;const a=rnd(0,TAU),d=b.R*.85;const q=spawnEnemy('thromb90',b.cx+Math.cos(a)*d,b.cy+Math.sin(a)*d,{noAffix:true,noLoot:true,spawnT:.6,host85:b});q.hp=q.maxHp=Math.round(b.maxHp*.03);q.r=18*b.k;b.thr=q;b.parts.push(q);floater(q.x,q.y-30,'СГУСТОК ПОЛЗЁТ К СЕРДЦУ',C90.red);snd90('pud');}
      if(b.thr&&b.thr.alive&&b.thr.spawnT<=0&&Math.hypot(b.thr.x-b.cx,b.thr.y-b.cy)<b.r+b.thr.r+8){const cap=b.maxHp*b.th[1],h=Math.min(b.maxHp*.02,Math.max(0,cap-b.hp));b.hp+=h;b.tempo=Math.min(120,b.tempo+10);b.q95=[];b.thr.alive=false;floater(b.cx,b.cy-b.r-40,'СГУСТОК ВОШЁЛ · +2% · ТЕМП '+b.tempo,C90.red);snd90('heal');b.thr=null;}
      b.fibT-=dt*A;if(b.fibT<=0&&!(b.fib>0)){b.fibT=20;b.fib=3;b.fibI=0;b.fibA96=rnd(0,TAU);banner('ФИБРИЛЛЯЦИЯ','3 СЕКУНДЫ · ПРОХОД — ПО ОРАНЖЕВОЙ СТРЕЛКЕ');snd95('fib',b.cx);}
      if(b.fib>0){b.fib-=dt;b.fibI-=dt;if(b.fibI<=0){b.fibI=.3;const a=(b.fibA96!==undefined?b.fibA96:rnd(0,TAU))+rnd(-.1,.1);b.waves.push({r:b.r,v:400*b.k,gaps:[{a,w:70*Math.PI/180}],hit:false,dmg:6,thin:1,gd:0});}}}
    if(b.phase>=4){if(b.rot96&&b.launch<=0){b.keyA96=(b.keyA96||0)+b.rot96*dt;heartKeyPos96(b);}heartKeyTouch(b);heartKeyCheck(b);b.p4T+=dt;
      if(b.launch<=0){b.dry=Math.max(220*b.k,b.dry-(b.R-220*b.k)/Math.max(18,40-9*b.launches)*dt);if(p&&p.hp>0&&Math.hypot(p.x-b.cx,p.y-b.cy)>b.dry){drain90(4*dt);if(!b.floodHint){b.floodHint=1;floater(p.x,p.y-40,'КРОВЬ · 4 УРОНА В СЕКУНДУ',C90.blood);}}}
      if(b.launch<=0&&b.p4T-(b.lastL90||0)>60){heartLaunch(b,true);}}
    b.parts=b.parts.filter(q=>q.alive);},
  final(b){b.waves=[];b.arr=null;b.launch=0;b.scT=0;b.subOn=false;b.bleed=[];b.dry=b.R;const X=G.x90;if(X)X.tg95=[];for(const q of b.parts)if(q.alive&&q.type!=='hkey90')kill(q,true);for(const q of b.keys)if(q.alive){q.alive=false;}b.keys=[];banner('СЕРДЦЕ ВСТАЛО','КОВЧЕГ СЛУШАЕТ');snd90('final');},
  opts(b){return heartWakeOk()?['stop','pulse','wake']:['stop','pulse'];},
  choose(b,ch,world,prev){heartChoose(b,ch,world,prev);},
  pulse(b,p,R){if(b.st!=='fight')return;for(const v of b.ves){if(v.shut>0)continue;const mx=b.cx+Math.cos(v.a)*b.R*.72,my=b.cy+Math.sin(v.a)*b.R*.72;if(Math.hypot(p.x-mx,p.y-my)<R+80){v.shut=10;floater(mx,my-24,'СОСУД ПЕРЕЖАТ · 10 С',C90.ark);snd90('valve');}}},
  drift(b,p,dt){heartGeo(b);if(b.st!=='fight'&&b.st!=='enter')return;const dx=p.x-b.cx,dy=p.y-b.cy,d=Math.hypot(dx,dy)||1;
    if(b.phase<4&&b.st==='fight'&&p.dashT<=0){const sys=heartInSys(b);for(const v of b.ves){if(v.shut>0||v.dead)continue;const ux=Math.cos(v.a),uy=Math.sin(v.a),along=dx*ux+dy*uy,perp=Math.abs(-dx*uy+dy*ux);
        if(along>b.r+20&&perp<55*b.k){const s=180*b.k*(1-perp/(55*b.k))*(sys?1:-.55);p.x+=ux*s*dt;p.y+=uy*s*dt;}}}
    const lim=b.R-p.r,dd=Math.hypot(p.x-b.cx,p.y-b.cy);if(dd>lim){p.x=b.cx+(p.x-b.cx)/dd*lim;p.y=b.cy+(p.y-b.cy)/dd*lim;}
    const inner=b.r*(1+(b.swell>0?.3*Math.sin(Math.min(1,b.swell/.6)*Math.PI):0))+p.r+4;if(dd<inner&&dd>0){p.x=b.cx+(p.x-b.cx)/dd*inner;p.y=b.cy+(p.y-b.cy)/dd*inner;}},
  floorTxt(b){return b.phase>=4&&!(b.launch>0)?'СЕРДЦЕ СТОИТ · ЗАПУСТИТЕ КЛЮЧАМИ':null;},
  under(b,t){heartUnder(b,t);},draw(b,t){heartDraw(b,t);},top(b,t){heartTop(b,t);},dying(b,dt,t0){heartDying(b,dt,t0);},
  music(b,T){if(b.st==='fight'||b.st==='enter'){T.id='b42';T.I=b.st==='enter'?.2:b.phase>=4?.1+.22*Math.min(b.keyI,4)+(b.launch>0?.3:0):.7+.08*b.phase;T.ext.bpmAdd=b.tempo-SC_.b42.bpm;T.ext.ph90=b.phase;T.ext.arr90=!!(b.arr||b.curArr95);}
    else{T.id='b42';T.I=.12;T.ext.bpmAdd=-20;T.ext.ph90=5;T.ext.fin90=b.choice||null;}}};
function heartAlly(b){const A=ark90();if(G.mode==='world'&&A.woke>=4&&!x85().ally){const p=G.player;x85().ally={kind:'pass',x:p.x-60,y:p.y+40,a:0,cd:1,t:90};radioLine('ПАССАЖИР',C90.pil,'Я из тех, кого вы разбудили. Помогу, пока сердце бьётся.',.8);floater(p.x,p.y-50,'ПАССАЖИР · СОЮЗНИК НА 90 С',C90.pil);}}
function heartBleed95(b,vi){const v=b.ves[vi];if(!v)return;b.bleed.push({x:b.cx+Math.cos(v.a)*(b.R-40*b.k),y:b.cy+Math.sin(v.a)*(b.R-40*b.k),r:70*b.k,t:15,t0:15});}
// --- удары сердца ---
function heartBeatTick(b,dt,soft){b.bt+=dt;if(b.bt<b.btN)return;b.bt-=b.btN;b.beatN++;
  const Q=heartQ95(b),nx=Q.shift();b.btN=nx.d;b.curArr95=nx.arr;b.arr=nx.arr?{}:null;heartQ95(b);
  if(b.beatN-b.comboLast>2&&b.combo>0){b.combo=0;}
  if(b.phase>=4&&b.st==='fight'){snd90('tick',b.keys[b.keyI]?1:0);return;}
  snd90('beat',soft?.5:1);b.sysK=1;b.flashC95=.12;if(soft){trauma90(.05);return;}trauma90(.12);
  if(b.st!=='fight'||b.fib>0)return;const A=atk95(b),p=G.player;
  const sp=300*b.k*(b.tempo>=100?1.12:1);
  if(b.phase===3){b.curGaps=heartGaps(b,0);b.nextGaps=heartGaps(b,1);b.waves.push({r:b.r,v:sp,gaps:b.curGaps.map(g=>({a:g.a,w:g.w})),hit:false,dmg:10,gd:0});b.dbl=.25;}
  else{b.curGaps=heartGaps(b,0);b.nextGaps=heartGaps(b,1);b.waves.push({r:b.r,v:sp,gaps:b.curGaps.map(g=>({a:g.a,w:g.w})),hit:false,dmg:10});}
  if(b.phase===1&&b.beatN%4===0){for(const v of b.ves)for(const s of [-1,1])eb95(b.cx+Math.cos(v.a)*b.r,b.cy+Math.sin(v.a)*b.r,v.a+s*.1,240,9,C90.blood,6,'cell');snd90('cells');}
  // бич аорты: раз в 4 удара
  if(b.beatN%4===2&&p&&p.hp>0){const pa=Math.atan2(p.y-b.cy,p.x-b.cx),pd=Math.hypot(p.x-b.cx,p.y-b.cy);let v=null,bd=9;for(const q of b.ves){if(q.shut>0)continue;const d=Math.abs(angDiff(pa,q.a));if(d<bd){bd=d;v=q;}}
    if(v){const r=clamp(pd,b.r+60*b.k,b.R-34*b.k);b.whipV=v.i;b.whipT=.8;tg95({k:'arc',x:b.cx,y:b.cy,r,w:60*b.k,a:pa,arc:120*Math.PI/180,T:.8,dmg:18,col:C90.blood,src:b,key:'heartWhip',snd:'tlCone',on:()=>{snd95('whip',b.cx);trauma90(.22);}});}}
  // кровяной дождь: капли падают точно на удар
  const every=b.phase===1?3:2;if(b.beatN%every===0&&p&&p.hp>0){let T=b.btN;if(T<.9)T+=heartQ95(b)[0].d;const n=b.phase===3?4+(Math.random()<.5?1:0):3;
    for(let i=0;i<n;i++){let x,y;if(i===0){x=p.x+p.vx*.5;y=p.y+p.vy*.5;}else{const a=rnd(0,TAU),d=rnd(b.r+40,b.R-30);x=b.cx+Math.cos(a)*d;y=b.cy+Math.sin(a)*d;}const dd=Math.hypot(x-b.cx,y-b.cy);if(dd>b.R-30){x=b.cx+(x-b.cx)/dd*(b.R-30);y=b.cy+(y-b.cy)/dd*(b.R-30);}if(dd<b.r+30)continue;
      tg95({k:'drop',x,y,r:40*b.k,T,dmg:12,col:C90.blood,src:b,key:'heartRain',snd:i?false:'rain'});}}
  // клапаны второй фазы стреляют веером на открытом такте
  if(b.phase===2&&b.beatN%2===1&&p)for(const q of b.parts){if(!q.alive||q.type!=='hvalve90'||q.spawnT>0)continue;const a=Math.atan2(p.y-q.y,p.x-q.x);for(let i=-1;i<=1;i++)eb95(q.x,q.y,a+i*.2,230,8,C90.ark,6,'cell');snd95('spit',q.x);}}

function heartWaves(b,dt){const p=G.player;if(b.dbl>0){b.dbl-=dt;if(b.dbl<=0&&b.phase===3&&!(b.fib>0)){const g=(b.curGaps||[]).map(q=>({a:q.a+(b.gdir96||1)*heartOff96(),w:q.w}));b.waves.push({r:b.r,v:300*b.k,gaps:g,hit:false,dmg:10,gd:0});snd90('beat',.7);}}
  for(const w of b.waves){const r0=w.r;w.r+=w.v*dt;if(w.gd&&w.gaps)for(const g of w.gaps)g.a+=w.gd*dt;if(w.hit||!p||p.hp<=0)continue;const d=Math.hypot(p.x-b.cx,p.y-b.cy);const th=w.thin?4:7;if(d+p.r*.6<r0-th||d-p.r*.6>w.r+th)continue;
    if(w.gaps){const a=Math.atan2(p.y-b.cy,p.x-b.cx);if(w.gaps.some(g=>Math.abs(angDiff(a,g.a))<g.w/2))continue;}
    if(p.dashT>0){if(!b.dashHint){b.dashHint=1;floater(p.x,p.y-30,'СКВОЗЬ ВОЛНУ',C90.warm);}continue;}w.hit=true;damagePlayer(w.dmg);}
  b.waves=b.waves.filter(w=>w.r<b.R+40);if(b.sysK>0)b.sysK=Math.max(0,b.sysK-dt/Math.max(.2,heartSys(b)*1.6));}
function heartPerfect(b,n){b.perfN++;if(G.mc)G.mc.perf90=(G.mc.perf90||0)+1;
  if(n!==b.comboLast){if(n===b.comboLast+1)b.combo++;else b.combo=1;b.comboLast=n;
    if(b.combo===5&&b.comboBuff<1.1){b.comboBuff=1.1;floater(b.cx,b.cy-b.r-56,'КОМБО ×5 · +10% УРОНА ДО КОНЦА ФАЗЫ','#ffffff');snd95('combo',b.cx);}else if(b.combo>1&&b.combo%5!==0)snd95('perfect95',b.cx);}
  if(G.t-b.perfT>.45){b.perfT=G.t;b.flashP=.35;hs90(.06,0);snd90('perfect');if(G.shock.length<60)G.shock.push({x:b.cx,y:b.cy,r:b.r,R:b.r*2.4,t:0,col:'#ffffff',thin:true});if(b.perfHint<3){b.perfHint++;floater(b.cx,b.cy-b.r-24,(b.arr||b.curArr95)?'В ТАКТ ×2':'В ТАКТ ×1,6','#ffffff');}}}
// --- ключи ритма (фаза 4) ---
function heartWin(b){return rk90()<=0?.45:.3;}
function heartNear(b){const per=b.btN,u=b.bt;return Math.min(u,per-u);}
function heartKeySoon(b){const per=b.btN,u=b.bt;return per-u<.55||u<heartWin(b);}
function heartKeyTouch(b){const p=G.player,e=b.keys[b.keyI];if(!e||!e.alive||b.launch>0||e.spawnT>0||!p||p.hp<=0)return;if(Math.hypot(p.x-e.x,p.y-e.y)>e.r+p.r+6)return;heartKey(b,e);}
function heartKey(b,e){if(b.launch>0||e.spawnT>0)return;const ok=b.keys[b.keyI]===e;if(!ok)return;
  if(heartNear(b)>heartWin(b)){if(!b.offHint||G.t-b.offHint>1.5){b.offHint=G.t;floater(e.x,e.y-e.r-12,'НЕ В ТАКТ · ЖДИТЕ УДАРА','#9fb0c4');}return;}
  const slot=Math.round((b.beatN+(b.bt>b.btN/2?1:0)));if(b.keySlot===slot)return;b.keySlot=slot;
  e.flash=.15;e.lit90=1;b.keyI++;snd90('key',b.keyI);hs90(.06,0);floater(e.x,e.y-e.r-14,b.keyI+'/'+b.keyN,'#ffffff');b.lastKeyBeat=slot;
  if(b.keyI>=b.keyN)heartLaunch(b,false);}
function heartKeyCheck(b){if(b.launch>0||b.keyI===0)return;if(b.beatN>=(b.lastKeyBeat||0)+1&&b.bt>heartWin(b))heartMiss(b);}
function heartMiss(b){b.keyI=0;b.p4miss++;b.miss++;for(const k of b.keys)k.lit90=0;floater(b.cx,b.cy-b.r-40,'СБИЛИСЬ С РИТМА · НЕЙТРОФИЛЫ','#ff9a4d');snd90('miss');b.waves.push({r:b.r,v:340*b.k,gaps:heartGaps(b,0),hit:false,dmg:14});trauma90(.15);
  if(G.enemies.filter(o=>o.alive&&o.type==='hunt95').length<4)for(let i=0;i<2;i++){const v=b.ves[(b.p4miss+i*2)%4];spawnEnemy('hunt95',b.cx+Math.cos(v.a)*b.R*.9,b.cy+Math.sin(v.a)*b.R*.9,{noAffix:true,noLoot:true,spawnT:.6,solo95:1});}
  if(b.miss>=6){b.miss=0;b.tempo=Math.max(42,Math.round(b.tempo*.85));b.q95=[];floater(b.cx,b.cy+b.r+40,'ТЕМП НИЖЕ · '+b.tempo,C90.warm);}}
function heartLaunch(b,auto){b.launch=4;b.launches++;b.lastL90=b.p4T||0;b.keyI=0;b.autoK=auto?1:0;b.dry=b.R;for(const k of b.keys)k.lit90=0;if(!auto&&b.launches===1&&b.p4miss===0&&G.mc)G.mc.p4clean90=1;
  for(const o of G.enemies)if(o.alive&&o.type==='hunt95')kill(o,true);
  const fin=b.launches>=(b.lN96||2);b.fin96=fin?1:0;
  if(!auto&&!fin){const lq=heartQuota96(b,b.launches),chunk=Math.min(b.maxHp*.03,Math.max(0,b.hp-b.maxHp*lq));b.chunkN++;const h0=b.hp;pool85(b,chunk,lq,b);floater(b.cx,b.cy+b.r+30,'ЗАПУСК · −'+Math.round(h0-b.hp),'#ffffff');}else if(!auto)b.chunkN++;
  if(fin){banner('ПОСЛЕДНИЙ ЗАПУСК','СЕРДЦЕ РВЁТ РИТМ · 4 СЕКУНДЫ');radioLine('КОВЧЕГ',C90.ark,'Ритм… восстановлен? Нет. Он больше не мой.',.1);}
  else banner(auto?'СЕРДЦЕ СДАЁТСЯ':'ЗАПУСК '+b.launches+' ИЗ '+(b.lN96||2),auto?'СЕРДЦЕ ОТКРЫТО · 4 С · УРОН ×1,4':'СЕРДЦЕ ОТКРЫТО · 4 С · УРОН ×2,5');snd90('launch');snd95('launch2',b.cx);trauma90(.3);hs90(.12,1);G.shock.push({x:b.cx,y:b.cy,r:b.r,R:b.R,t:0,col:'#ffffff',slow:true});}
// --- финал ---
function heartWakeOk(){const A=ark90();return G.mode==='world'&&A.woke>=6&&A.lost===0;}
function heartScene(b,dt){b.scT+=dt;b.openK=Math.min(1,b.openK+dt*.5);
  if(b.st==='scene'&&b.scT>=2.2&&!b.subOn){b.subOn=true;const A=ark90(),total=9+(storyFlag('well38')==='third'?3:0)+(storyFlag('cradle22')==='keep'?1:0),sl=Math.max(0,total-A.woke-A.lost);
    sub85('КОВЧЕГ',C90.warm,['«Это не сердце корабля. Это сердце всех, кто в нём спит».','«Ты разбудил '+A.woke+'. Ещё '+sl+' спят и не знают, что Ковчег давно никуда не летит».','«Остановишь меня — они уснут насовсем. Запустишь — полетим дальше. Туда же. В никуда».','«Реши за них. Ты ведь тоже когда-то спал».'],
      ()=>{if(b.st!=='scene')return;b.st='final';const ok=heartWakeOk();const yy=b.cy+b.R*.5,P0=dockPos95(3,0,yy),P1=dockPos95(3,2,yy),P2=dockPos95(3,1,yy);
        const L=[{kind:'stop',x:P0.x,y:P0.y,lab:'ОСТАНОВИТЬ',sub:'пусть спят спокойно',col:'#9fb0c4'},{kind:'pulse',x:P1.x,y:P1.y,lab:'ЗАПУСТИТЬ',sub:'Ковчег летит дальше',col:C90.ark}];
        const port=VH>VW*1.15;L.push({kind:'wake',x:port?P2.x:b.cx,y:port?P2.y:b.cy-b.R*.62,lab:ok?'РАЗБУДИТЬ ВСЕХ':'…слишком много спящих…',sub:ok?'никто больше не спит':'',lock:!ok,col:'#ffffff'});
        sb85SetDocks(b,L);banner('СЕРДЦЕ КОВЧЕГА','ОСТАНОВИТЬ ИЛИ ЗАПУСТИТЬ · ЛЕТИТЕ К ПРИЧАЛУ');sfx('level');});}
  if(b.st==='final')sb85Docks(b,dt);}
function heartChoose(b,ch,world,prev){const X=x85();const S=G.save;const badges=[];if(b.perfN>=20)badges.push('«Метроном»');if(G.mc&&G.mc.p4clean90)badges.push('«Чистый запуск»');const bt=badges.length?' Бейджи: '+badges.join(', ')+'.':'';
  if(G.mc&&!G.mc.passKill90&&(G.mc.perf90||0)>=8&&G.mc.p4clean90&&world)own85('ark90');
  if(ch==='stop'){G.sbLomK=prev?1:1.5;G.sbChoiceTxt=(prev?'Вы уже сделали выбор: сердце остановлено. ':'Сердце остановлено: лом ×1,5. Спящие уснули насовсем — тихо и без боли. Модуль «Тишина сердца»: после рывка 1,5 с вас не видят. ')+bt;
    SB_DEATH.heart=['СЕРДЦЕ ОСТАНОВЛЕНО','СЕКТОР IX ПРОЙДЕН','Тишина в сердечной камере. Я слышу, как они спят. Больше не страшно.'];}
  else if(ch==='pulse'){G.sbLomK=1;G.sbChoiceTxt=(prev?'Вы уже сделали выбор: сердце запущено. ':'Сердце запущено: Ковчег летит дальше. Модуль «Пульс»: каждый четвёртый выстрел — ×1,5. ')+bt;
    SB_DEATH.heart=['СЕРДЦЕ БЬЁТСЯ','СЕКТОР IX ПРОЙДЕН','Ритм — пятьдесят. Ковчег не знает куда, но знает зачем.'];}
  else{G.sbLomK=prev?1:2;G.sbChoiceTxt=(prev?'Вы уже сделали выбор: все проснулись. ':'Все проснулись: лом ×2. Оба модуля — «Тишина сердца» и «Пульс». Скин «Рассвет Ковчега». В секторе IX с вами летают пассажиры. ')+bt;
    SB_DEATH.heart=['КОВЧЕГ ПРОСНУЛСЯ','СЕКТОР IX ПРОЙДЕН','Они не знают, где мы. Но они смотрят в иллюминаторы. Впервые за все циклы.'];if(world&&!prev)own85('dawn90');}
  b.fx85.t=0;X.calm=99;}

