// ===== 0.9.5: босс сектора X — «Берег» 2.0: Смотритель горизонта и злые маяки (комната 46) =====
['shore100','beacon100'].forEach(k=>SB85T.add(k));HOST85.add('shore100');
SB_NAMES.shore='БЕРЕГ';SB_FLAG.shore='shore46';SB_FLAG_M[46]='shore46';
SB_DEATH.shore=['БЕРЕГ ОТСТУПИЛ','СЕКТОР X ПРОЙДЕН','Я стирал, чтобы не помнить, сколько раз начинал заново. Ты помнишь за меня.'];
const SHORE_PH=['ОТМЕЛЬ','ЗАБВЕНИЕ','ТИШИНА'],BEACON_N=[4,4,3],BEACON_NOTE=[0,4,7,11,14];
const SHORE95={bk:.03,beamL:430,beamA:8*Math.PI/180,beamSpd:40*Math.PI/180,beamDmg:9,sig:6,fireDmg:8,stun:3,rw:20,stall:75,shL:230,shR:290};
function sb100(){const b=G.sb;return b&&b.alive&&b.sbk==='shore'?b:null;}
function hzAt100(b,x){return b.hzF*H+9*Math.sin(x*.011+G.t*.45)+5*Math.sin(x*.027-G.t*.3)+3*Math.sin(x*.07+G.t*.9);}
function shk95(){return clamp(Math.min(W,H)/760,.8,1.2);}
function atk95(b){return b&&b.atkK95||1;}
SBX.shore={K:1.12,th:[.66,.33],mc:'shore100',
  spawn(){ambSting('boss');radioClear();const b=spawnEnemy('shore100',W/2,H*.12,{noAffix:true,noLoot:true});sb85Init(b,'shore',3.6);banner('СТЁРТЫЙ БЕРЕГ','ГОРИЗОНТ ОПУСКАЕТСЯ');
    radioLine('БЕРЕГ',C90.sh,'Здесь всё когда-то было написано. Я просто дочитал.',.8);return b;},
  init(b){Object.assign(b,{hz100:1,hzF:.04,hzT:.27,ebb:0,ebbR:0,tideT:8,mobT:8,typoT:10,shadT:6,echoT:6,trk:[],trkT:0,bN:0,broken:0,scT:0,subOn:false,fade:0,lit:0,beacons:[],slots:[],gw:W,gh:H,noteMask:0,
      stall:0,eyes:[],face:{x:W/2,y:H*.04,open:0,stun:0,low:0,mouth:0,shake:0,look:0},fa:null,faT:5,faLast:'',inh:null,shades:[],shadeI:0,hands:null,crumble:0,allOpen:0,atkK95:rk90()>=2?1.15:1,eyeHint:0});
    b.ghost=true;b.contact=0;b.x=W/2;b.y=H*.1;const X=G.x90;if(X){X.ez=[];X.tide={next:16,band:null,n:0,hit:0,boss:1};X.hud=null;X.shadT=0;X.strip95=[];}},
  phase(b){const X=G.x90;for(const q of b.beacons)if(q.alive)kill(q,true);b.beacons=[];b.slots=[];b.broken=0;b.stall=0;b.allOpen=0;b.fa=null;b.inh=null;b.faT=3.5;hs90(.25,1);snd95('phase95');
    for(const s of b.shades)if(s.alive)shadeGone95(b,s,true);b.shades=[];if(X){X.strip95=[];X.tg95=[];X.wv95=[];}
    if(b.phase===2){banner('БЕРЕГ · ФАЗА 2','ЗАБВЕНИЕ · ТЕНИ ПРОШЛЫХ БОССОВ');radioLine('БЕРЕГ',C90.sh,'Помнишь, кого ты победил? Я помню. Плохо, но помню.',.4);if(X){if(rk90()>=1)X.hud={t:6,cur:null,last:null,per:25};if(X.tide){X.tide.band=null;X.tide.bands=null;X.tide.warn=null;X.tide.next=999;}}b.shadT=6;b.typoT=8;}
    if(b.phase===3){banner('БЕРЕГ · ФАЗА 3','ТИШИНА · СМОТРИТЕЛЬ СПУСКАЕТСЯ');radioLine('БЕРЕГ',C90.sh,'…',.4);if(X){if(X.hud&&X.hud.cur)hudBack100(X.hud.cur);X.hud=null;if(X.tide){X.tide.band=null;X.tide.bands=null;X.tide.warn=null;X.tide.next=999;}}b.echoT=4;b.fade=0;b.hands={t:2.5,sw:null,n:0};}
    shoreBeacons(b);},
  hurt(b,e,dmg,src){
    if(e.type==='beacon100'){if(e.spawnT>0)return 0;const m=shoreShK95(b,e);if(m>0)e.lastHit95=G.t;if(m<=0){sbBlock(e);if(!b.shHint||G.t-b.shHint>4){b.shHint=G.t;floater(e.x,e.y-e.r-16,'ЩИТ · ПОДЛЕТИТЕ БЛИЖЕ 260',C90.sh);}return 0;}
      const d=Math.min(dmg*m,e.hp);const nd=pool85(b,d,0,e);return nd;}
    if(e.type==='eye95'){if(b.face.open<.5){sbBlock(e);if(!b.eyeHint||G.t-b.eyeHint>5){b.eyeHint=G.t;floater(e.x,e.y-e.r-12,'ГЛАЗА ЗАКРЫТЫ · РАЗБЕЙТЕ МАЯК','#ffffff');}return 0;}
      const K=(b.face.stun>0?2:1)*(b.allOpen?1.5:1);pool85(b,dmg*K,0,e);e.flash=.06;if(G.t-(b.eyeHs||0)>.6){b.eyeHs=G.t;hsWeak95();}return 0;}
    if(e.type==='shade95'){pool85(b,dmg*.5,0,null);e.hp95=(e.hp95||0)-dmg;e.flash=.06;if(e.hp95<=0)shadeGone95(b,e,false);return 0;}
    return 0;},
  targ(b,e){if(e.type==='beacon100')return shoreShK95(b,e)>0;if(e.type==='eye95')return b.face.open>=.5;if(e.type==='shade95')return true;return e.type!=='shore100';},
  auto(p,b){let best=null,bd=1e9;
    if(b.face.open>=.5)for(const q of b.eyes){if(!q.alive||!targetable(q))continue;const d=Math.hypot(q.x-p.x,q.y-p.y);if(d<bd&&d<760){bd=d;best=q;}}if(best)return best;
    for(const q of b.shades){if(!q.alive||!targetable(q))continue;const d=Math.hypot(q.x-p.x,q.y-p.y);if(d<bd&&d<640){bd=d;best=q;}}if(best)return best;
    for(const q of b.beacons){if(!q.alive||!targetable(q))continue;const d=Math.hypot(q.x-p.x,q.y-p.y);if(d<bd){bd=d;best=q;}}if(best)return best;return nearestEnemy(p.x,p.y,560);},
  hud(b,k){if(b.st==='dying')return k+' · ОТСТУПИЛ';if(b.st==='final')return k+' · ВЫБОР';if(b.st==='scene')return k+' · ГОЛОС';if(b.st==='enter')return k;
    if(b.ebb>0)return 'ОТЛИВ · МАЯКИ БЕЗ ЩИТА · '+Math.ceil(b.ebb)+' С';if(b.face.stun>0)return 'СМОТРИТЕЛЬ ОГЛУШЁН · ГЛАЗА ×2';if(b.allOpen)return 'МАЯКИ ПОГАСЛИ · БЕЙТЕ В ГЛАЗА ×1,5';
    return SHORE_PH[b.phase-1]+' · МАЯКИ '+b.beacons.filter(q=>q.alive).length+(b.face.open>=.5?' · ГЛАЗА ОТКРЫТЫ':' · РАЗБЕЙТЕ МАЯК');},
  strip(b){if(b.st==='enter')return {l:'СТЁРТЫЙ БЕРЕГ · ГОРИЗОНТ ОПУСКАЕТСЯ',k:null,lc:C90.sh};if(b.st==='scene')return {l:'БЕРЕГ · ГОЛОС',k:null,lc:C90.sh2};
    if(b.st==='final')return {l:b.prev85?'ВЫ УЖЕ СДЕЛАЛИ ВЫБОР · ЛЕТИТЕ К ПРИЧАЛУ':'ЧТО ВЫ ВОЗЬМЁТЕ С СОБОЙ',k:null,lc:C90.sh2};
    const lim=.62,k=clamp((b.hzF-.04)/(lim-.04),0,1),n=b.beacons.filter(q=>q.alive).length;
    if(b.face.stun>0)return {l:'ОГЛУШЁН · ГЛАЗА ОТКРЫТЫ · УРОН ×2',k:b.face.stun/SHORE95.stun,col:'#ffffff',r:'МАЯКОВ '+n};
    return {l:(b.ebb>0?'ОТЛИВ · ':'ГОРИЗОНТ · ')+'МАЯКОВ '+n+'/'+(BEACON_N[b.phase-1]||3),k:b.ebb>0?b.ebb/6:k,col:b.ebb>0?'#ffffff':k>.8?'#ff9a4d':C90.sh,r:b.stall>55?'ОТЛИВ ЧЕРЕЗ '+Math.ceil(SHORE95.stall-b.stall):'ФАЗА '+b.phase};},
  update(b,dt){const p=G.player,X=G.x90,A=atk95(b);if(b.gw!==W||b.gh!==H){b.gw=W;b.gh=H;shorePlace(b);}
    b.x=W/2;b.y=Math.max(20,b.hzF*H-30);shoreFace95(b,dt);
    if(b.st==='enter'){b.timer-=dt;b.lit=Math.min(1,b.lit+dt/3);b.hzF+=(b.hzT-b.hzF)*Math.min(1,dt*1.2);if(b.timer<=0){b.st='fight';b.phT=0;banner('БЕРЕГ · ФАЗА 1','ОТМЕЛЬ · РАЗБЕЙТЕ МАЯК — ОТКРОЮТСЯ ГЛАЗА');shoreBeacons(b);}return;}
    if(b.st==='scene'||b.st==='final'){shoreScene(b,dt);return;}
    b.phT+=dt;if(b.tr>0){b.hzF+=(b.hzT-b.hzF)*Math.min(1,dt*2);return;}
    // горизонт
    if(b.ebbR>0){const s=Math.min(b.ebbR,(120/1.5)*dt);b.ebbR-=s;b.hzF-=s/H;}else{b.hzF+=(2+b.broken)*dt/H;}
    if(b.ebb>0){b.ebb-=dt;if(b.ebb<=0)floater(W/2,b.hzF*H+60,'ОТЛИВ КОНЧИЛСЯ',C90.sh);}
    if(b.hzF>=.62&&b.ebbR<=0)shoreEbb95(b,'ОТЛИВ','МАЯКИ 6 С БЕЗ ЩИТА');
    b.stall+=dt;if(b.stall>=SHORE95.stall&&b.ebb<=0&&b.ebbR<=0){b.stall=0;shoreEbb95(b,'ВНЕОЧЕРЕДНОЙ ОТЛИВ','МАЯКИ 6 С БЕЗ ЩИТА · БЕЙТЕ');}
    b.hzF=clamp(b.hzF,.04,.62);
    for(const q of b.beacons){if(!q.alive)continue;const lim=hzAt100(b,q.x)+80;if(q.slide){q.x+=(W/2-q.x)*Math.min(1,dt*.8);q.ty=Math.max(H*.58,lim);}if(q.ty<lim)q.ty=lim;q.y+=(Math.min(q.ty,H-40)-q.y)*Math.min(1,dt*2);}
    for(const e of G.enemies){if(!e.alive||STATIC.has(e.type)||EDEF[e.type].passive||e.sbk||EDEF[e.type].sbp)continue;if(e.y<hzAt100(b,e.x)-10){e.y+=60*dt;}}
    shoreBeaconsTick95(b,dt*A);shoreWatcher95(b,dt*A);shoreShadesTick95(b,dt);shoreHands95(b,dt*A);
    // трек игрока (эхо фазы 3 повторяет и рывки)
    if(b.phase<=2){b.trkT-=dt;if(b.trkT<=0&&p){b.trkT=.2;const d=G.dashId!==b.trkD;b.trkD=G.dashId;b.trk.push({x:p.x/W,y:p.y/H,d:d&&p.dashT>0?1:0});if(b.trk.length>900)b.trk.splice(0,300);}}
    const mobs=()=>G.enemies.filter(o=>o.alive&&!EDEF[o.type].passive&&!o.sbk&&!EDEF[o.type].sbp).length;
    if(b.phase===1){b.mobT-=dt;if(b.mobT<=0){b.mobT=14;if(mobs()<3)for(let i=0;i<2;i++)edgeSpawn(['eraser100','hollow100','blot95'][Math.random()*3|0],{side:Math.random()<.5?1:3,delay:i*.3});}}
    if(b.phase===2){b.typoT-=dt;if(b.typoT<=0){b.typoT=16;if(G.enemies.filter(o=>o.alive&&o.type==='typo100').length<2)edgeSpawn('typo100',{side:Math.random()<.5?1:3});}
      b.mobT-=dt;if(b.mobT<=0){b.mobT=15;if(mobs()<3)edgeSpawn(Math.random()<.5?'hollow100':'scribe95',{side:2});}}
    if(b.phase===3){b.fade=Math.min(1,b.fade+dt/3);if(X&&!X.hudAll&&rk90()>=1){X.hudAll=1;for(const k of ['hp','en','wave','mark'])if(k!=='hp'||p.hp>G.st.maxHp*.3)hudErase100(k);}
      b.echoT-=dt;if(b.echoT<=0){b.echoT=10;if(b.trk.length>10)for(let i=0;i<2;i++){if(G.enemies.filter(o=>o.alive&&o.type==='echo100').length>=3)break;const st=Math.random()*(b.trk.length-30)|0;const q=b.trk[Math.max(0,st)];const e=spawnEnemy('echo100',q.x*W,Math.max(q.y*H,hzAt100(b,q.x*W)+60),{noAffix:true,noLoot:true,spawnT:.6});e.path100=b.trk;e.pi100=Math.max(0,st);}}
      const live=b.beacons.filter(q=>q.alive);if(live.length===1&&!live[0].slide){live[0].slide=1;floater(live[0].x,live[0].y-40,'ПОСЛЕДНИЙ МАЯК',C90.sh);}}
    if(X&&X.tide&&b.phase<3){X.tide.boss=1;}
    b.beacons=b.beacons.filter(q=>q.alive||q.dying);b.shades=b.shades.filter(q=>q.alive);},
  final(b){b.scT=0;b.subOn=false;b.crumble=1;hs90(.25,2);snd95('crumble95');const X=G.x90;if(X){X.ez=[];X.shad=[];X.strip95=[];X.tg95=[];X.wv95=[];X.tide=null;X.hud=null;}clearHud100(true);
    for(const q of b.beacons)if(q.alive)kill(q,true);b.beacons=[];for(const q of b.eyes)if(q.alive)q.alive=false;for(const s of b.shades)if(s.alive)s.alive=false;b.shades=[];b.hands=null;b.inh=null;b.fa=null;
    for(let i=0;i<24;i++){const x=i/23*W;glyph95(x,hzAt100(b,x),2,i%3?C90.sh:'#ffffff');}banner('БЕРЕГ ОТСТУПИЛ','ГОРИЗОНТ РАССЫПАЛСЯ НА БУКВЫ');snd90('final');},
  opts(b){return shoreRecOk()?['forget','carry','record']:['forget','carry'];},
  choose(b,ch,world,prev){shoreChoose(b,ch,world,prev);},
  pulse(b,p,R){if(b.st!=='fight')return;for(const s of b.shades){if(s.alive&&Math.hypot(s.x-p.x,s.y-p.y)<R+s.r){s.hp95-=s.maxHp95*.15;floater(s.x,s.y-s.r-10,'ТЕНЬ ДРОГНУЛА',s.col95);if(s.hp95<=0)shadeGone95(b,s,false);}}},
  drift(b,p,dt){if(b.st!=='fight'&&b.st!=='enter')return;const hz=hzAt100(b,p.x);if(p.y-p.r<hz){if(G.mc&&b.st==='fight')G.mc.hz100=1;if(!b.hzHint){b.hzHint=1;floater(p.x,p.y+40,'ГОРИЗОНТ · НЕ КАСАЙТЕСЬ',C90.sh);}}
    if(b.inh&&b.inh.st==='pull'&&p.dashT<=0){p.y-=120*dt;}
    if(p.y<hz-p.r*.2){p.y=hz-p.r*.2;if(p.vy<0)p.vy=0;if(p.dashT>0&&p.dy<0){p.dashT=0;}}},
  under(b,t){shoreUnder(b,t);},draw(b,t){shoreDraw(b,t);},top(b,t){shoreTop(b,t);},dying(b,dt,t0){shoreDying(b,dt,t0);},
  music(b,T){if(b.st==='fight'||b.st==='enter'){T.id='b46';T.I=b.st==='enter'?.15:b.phase>=3?.05:.6+.1*b.phase;let m=0;b.beacons.forEach((q,i)=>{if(q.alive)m|=1<<(q.note90||0);});T.ext.notes46=m;T.ext.ph90=b.phase;if(b.phase>=3)T.duck=Math.max(.25,1-b.fade*.75);}
    else{T.id='b46';T.I=.1;T.ext.ph90=5;T.ext.fin90=b.choice||null;T.ext.notes46=31;}}};
// --- щит маяка: тает между 230 и 290 пикселями ---
function shoreShK95(b,e){if(b.ebb>0||e.slide)return 1;const p=G.player;if(!p)return 0;const d=Math.hypot(p.x-e.x,p.y-e.y);return 1-clamp((d-SHORE95.shL)/(SHORE95.shR-SHORE95.shL),0,1);}
function shoreShield(b,e){return shoreShK95(b,e)<=0;}
function shoreEbb95(b,t1,t2){b.ebbR=120;b.ebb=6;b.stall=0;b.hzF=Math.min(b.hzF,.62);banner(t1,t2);snd90('ebb');trauma90(.25);}
// --- маяки: слоты, лучи-прожекторы, «сигнал» огнями, перезапись ---
function shoreBeacons(b){const n=BEACON_N[b.phase-1]||3,hp=Math.max(1,Math.round(b.maxHp*SHORE95.bk));b.bN=n;b.bHp=hp;b.slots=[];
  for(let i=0;i<n;i++){const nx=(i+1)/(n+1)+rnd(-.025,.025),ty=rnd(.68,.88)*H;const s={i,nx,ty,note:i%5,ent:null,broken:false};b.slots.push(s);shoreSlotSpawn95(b,s,1,i);}snd90('beacon');}
function shoreSlotSpawn95(b,s,k,i){const q=spawnEnemy('beacon100',s.nx*W,s.ty,{noAffix:true,noLoot:true,spawnT:.9,host85:b,keep85:1,noBar90:1});q.hp=q.maxHp=b.bHp;if(k<1)q.hp=Math.round(b.bHp*k);q.ty=s.ty;q.nx=s.nx;q.note90=s.note;q.slot95=s;
  q.ba=-Math.PI/2+(s.i%2?.6:-.6);q.bdir=s.i%2?-1:1;q.bOn=false;q.bT=1.2+(i||0)*1.4;q.bh=0;q.sigT=3+(i||0)*1.6;q.lastHit95=G.t;q.rw95=null;s.ent=q;s.broken=false;b.beacons.push(q);b.parts.push(q);return q;}
function shorePlace(b){for(const q of b.beacons){if(!q.alive)continue;q.x=(q.nx||.5)*W;q.ty=clamp(q.ty,H*.4,H-40);}for(const s of b.slots)s.ty=clamp(s.ty,H*.4,H-40);}
function shoreBeaconsTick95(b,dt){const p=G.player,S=SHORE95,k=shk95();const lim=b.beacons.filter(q=>q.alive);
  for(const q of lim){if(q.spawnT>0)continue;const lx=q.x,ly=q.y-q.r*.95;
    // прожектор: 6 с горит, 3 с гаснет; за 0,6 с до включения мигает
    q.bT-=dt;if(q.bT<=0){q.bOn=!q.bOn;q.bT=q.bOn?6:3;if(q.bOn){q.bh=0;snd95('search',q.x);}}
    q.bFlick=!q.bOn&&q.bT<.6;if(q.bOn){q.ba+=S.beamSpd*q.bdir*dt;
      if(p&&p.hp>0&&p.dashT<=0&&p.y>hzAt100(b,p.x)){const dx=p.x-lx,dy=p.y-ly,d=Math.hypot(dx,dy);if(d<S.beamL*k&&Math.abs(angDiff(Math.atan2(dy,dx),q.ba))<S.beamA+Math.atan2(p.r*.5,Math.max(40,d))){q.bh+=dt;if(q.bh>=.25){q.bh=-.25;damagePlayer(S.beamDmg);mark95('ВИДЕН',2);}}else q.bh=Math.max(0,q.bh-dt);}}
    // сигнал: три самонаводящихся огня, сбиваются
    q.sigT-=dt;q.sigK=q.sigT<.55&&q.sigT>0?1-q.sigT/.55:0;if(q.sigT<=.55&&!q.sigS){q.sigS=1;snd95('signal',q.x);q.tl95=.55;}
    if(q.sigT<=0){q.sigS=0;q.sigT=S.sig*(.9+.2*Math.random());q.tl95=0;if(p&&p.hp>0){const a0=Math.atan2(p.y-ly,p.x-lx);for(let i=-1;i<=1;i++){const f=eb95(lx,ly,a0+i*.42,170,S.fireDmg,C95.hom,6,'fire',{homing:true,shoot95:1});if(f)f.life=6;}}}
    if(q.tl95>0)q.tl95-=dt;
    // перезапись: маяк, который 20 секунд никто не трогал, восстанавливает разбитого соседа
    if(!q.rw95&&G.t-(q.lastHit95||0)>S.rw){const s=q.slot95,ns=s?b.slots.filter(o=>o.broken&&Math.abs(o.i-s.i)===1):[];if(ns.length){const t_=ns[0];q.rw95={t:0,T:1.6,slot:t_};floater(q.x,q.y-q.r-22,'ПЕРЕЗАПИСЬ',C90.sh);snd95('rewrite',q.x);}else q.lastHit95=G.t-S.rw+4;}
    if(q.rw95){const R_=q.rw95;R_.t+=dt;if(R_.t>=R_.T){q.rw95=null;q.lastHit95=G.t;if(R_.slot.broken&&b.st==='fight'){const n=shoreSlotSpawn95(b,R_.slot,.5,0);n.spawnT=.4;b.broken=Math.max(0,b.broken-1);b.allOpen=0;floater(n.x,n.y-40,'МАЯК ПЕРЕПИСАН · 50%',C90.sh);glyph95(n.x,n.y,8,C90.sh);}}}}}
function shoreBroke(b,q){b.broken++;b.stall=0;if(q.slot95){q.slot95.broken=true;q.slot95.ent=null;}b.hzF=Math.min(.62,b.hzF+25/H);explode(q.x,q.y,C90.sh,24,.9);G.shock.push({x:q.x,y:q.y,r:10,R:220,t:0,col:C90.sh,thin:true});snd90('beaconX',q.note90||0);snd95('choirX',q.x);trauma90(.18);hs90(.07,0);
  glyph95(q.x,q.y,10,C90.sh);b.face.stun=SHORE95.stun;b.face.shake=.6;snd95('stun',W/2);floater(q.x,q.y-40,'МАЯК ПОГАС · СМОТРИТЕЛЬ ОГЛУШЁН',C90.sh);
  if(b.beacons.filter(o=>o.alive&&o!==q).length===0&&b.st==='fight'){b.allOpen=1;floater(W/2,hzAt100(b,W/2)+70,'ВСЕ МАЯКИ ПОГАСЛИ · ГЛАЗА ОТКРЫТЫ',C90.sh);}}
KILL85X.beacon100=(e,silent)=>{const b=sb100();if(b&&!silent&&e.host85===b)shoreBroke(b,e);};
// --- Смотритель горизонта: лицо, глаза, атаки ---
function shoreFace95(b,dt){const F=b.face,p=G.player,k=shk95();
  if(F.stun>0)F.stun-=dt;if(F.shake>0)F.shake-=dt;
  const want=b.st==='fight'||b.st==='enter';const tx=p?clamp(p.x*.35+W/2*.65+Math.sin(G.t*.23)*W*.12,W*.22,W*.78):W/2;F.x+=(tx-F.x)*Math.min(1,dt*.35);
  F.low=b.phase>=3&&b.st==='fight'?Math.min(1,F.low+dt/3):Math.max(0,F.low-dt/2);
  const hz=hzAt100(b,F.x);F.y=Math.max(hz-30*k,(G.arena?CY:0)+150*k)+F.low*(200*k)+(F.shake>0?rnd(-4,4):0);
  const open=b.st==='fight'&&(F.stun>0||b.allOpen||b.fa&&b.fa.k==='tears'||b.phase>=3&&b.hands&&b.hands.sw&&b.hands.sw.st==='go');F.open+=((open?1:0)-F.open)*Math.min(1,dt*6);
  F.mouth+=((b.fa&&b.fa.k==='speech'&&b.fa.t<b.fa.T0?1:0)-F.mouth)*Math.min(1,dt*8);
  if(!b.eyes.length&&(b.st==='fight'||b.st==='enter')){for(const s of [-1,1]){const e=spawnEnemy('eye95',F.x+s*64*k,F.y,{noAffix:true,noLoot:true,host85:b,keep85:1,side95:s,noBar90:1});e.r=26*k;b.eyes.push(e);b.parts.push(e);}}
  for(const e of b.eyes){if(!e.alive)continue;e.x=F.x+e.side95*64*k;e.y=F.y-8*k;e.vx=e.vy=0;}
  if(F.open>.5&&!F.wasOpen){F.wasOpen=1;snd95('eyeOpen',F.x);for(const e of b.eyes)if(e.alive)weak95(e,F.stun>0?F.stun:3,F.stun>0?2:1);}else if(F.open<.3)F.wasOpen=0;
  for(const e of b.eyes)if(e.alive&&F.open>.5)e.weak95=Math.max(e.weak95||0,.2);}
const SHORE_ATK95=[['tears','speech'],['tears','speech','inhale'],['tears','speech']];
const WORDS95=['ПЕСОК','КОВЧЕГ','ПРИЛИВ','МАЯКИ','БЕРЕГОМ','ИМЕНА','ЗВЁЗДЫ','ОБШИВКА','ТЕМНОТА','ЗАБЫЛИ','КАМНИ','ВОЗВРАТ','ЦИКЛЫ','ПИЛОТЫ'];
function shoreWatcher95(b,dt){const F=b.face,p=G.player,X=G.x90,k=shk95();if(b.st!=='fight')return;
  if(b.fa){const A=b.fa;A.t+=dt;
    if(A.k==='tears'){if(!A.done&&A.t>=1){A.done=1;for(const e of b.eyes)if(e.alive&&X){X.strip95=X.strip95||[];X.strip95.push({x:e.x,w:54*k,y0:e.y,t:3,t0:3});}trauma90(.15);snd90('erase');}if(A.t>=4)b.fa=null;}
    else if(A.k==='speech'){if(A.t>=A.T0&&A.n<A.N){A.n++;A.T0+=1.1;shoreWord95(b);}if(A.t>=A.T0+.3&&A.n>=A.N)b.fa=null;}
    else if(A.k==='inhale'){if(A.t>=.8&&!b.inh){b.inh={st:'pull',t:2};snd95('inhale95',F.x);}if(b.inh){b.inh.t-=dt;if(b.inh.t<=0){b.inh=null;b.fa=null;}}}}
  else{b.faT-=dt;if(b.faT<=0){const L=SHORE_ATK95[b.phase-1].filter(x=>x!==b.faLast);const kd=L[Math.random()*L.length|0];b.faLast=kd;b.faT=[5.5,4.5,4.2][b.phase-1];
      if(kd==='tears'){b.fa={k:'tears',t:0};for(const e of b.eyes)if(e.alive)tg95({k:'col',x:e.x,y:e.y,y2:H+10,w:54*k,T:1,dmg:0,noHit:true,col:C90.sh,snd:'tears',fx:false});}
      if(kd==='speech'){b.fa={k:'speech',t:0,T0:.65,n:0,N:b.phase>=2?2:1};snd95('speech',F.x);}
      if(kd==='inhale'){b.fa={k:'inhale',t:0};floater(F.x,F.y+60,'ВЗДОХ · РЫВОК ВНИЗ',C90.sh);snd95('tlDash',F.x);}}}
  // втягивание: враги и предметы тоже
  if(b.inh){for(const e of G.enemies){if(!e.alive||STATIC.has(e.type)||EDEF[e.type].passive||e.sbk||EDEF[e.type].sbp)continue;e.y-=70*dt;}for(const it of G.pick){if(it.story)continue;it.y-=90*dt;}}
  // слёзы: полосы стирания
  if(X&&X.strip95&&X.strip95.length){for(const s of X.strip95)s.t-=dt;X.strip95=X.strip95.filter(s=>s.t>0);}}
function shoreWord95(b){const F=b.face,p=G.player;if(!p)return;const w=WORDS95[Math.random()*WORDS95.length|0],n=w.length,a0=Math.atan2(p.y-F.y-30,p.x-F.x),spr=Math.min(1.25,.14*n);
  for(let i=0;i<n;i++){const a=a0-spr/2+spr*(n>1?i/(n-1):.5);eb95(F.x,F.y+30*shk95(),a,215,7,'#f4fff9',6,'word',{ch:w[i]});}snd95('speech',F.x);trauma90(.06);}
// --- руки-стиратели фазы 3: прочёсывают арену полосами ---
function shoreHands95(b,dt){const H_=b.hands;if(!H_||b.st!=='fight'||b.phase<3)return;const p=G.player,k=shk95();
  if(!H_.sw){H_.t-=dt;if(H_.t<=0&&p){const vert=H_.n%2===1,w=80*k,from=Math.random()<.5?0:1;H_.n++;const hz=hzAt100(b,W/2);
      const sw=vert?{vert,x:clamp(p.x,60,W-60),from,w,st:'warn',t:0,T:.85,pos:0}:{vert,y:clamp(p.y,hz+60,H-40),from,w,st:'warn',t:0,T:.85,pos:0};H_.sw=sw;snd95('hands',vert?sw.x:W/2);
      if(vert)tg95({k:'col',x:sw.x,y:hz,y2:H+10,w,T:.85,dmg:0,noHit:true,col:C90.sh2,fx:false,snd:false});else tg95({k:'line',x:0,y:sw.y,x2:W,y2:sw.y,w,T:.85,dmg:0,noHit:true,col:C90.sh2,fx:false,snd:false});}}
  else{const sw=H_.sw;sw.t+=dt;if(sw.st==='warn'&&sw.t>=sw.T){sw.st='go';sw.t=0;trauma90(.2);}
    if(sw.st==='go'){const span=sw.vert?H:W,v=720;sw.pos+=v*dt;const at=sw.from?span-sw.pos:sw.pos;
      if(!sw.hit&&p&&p.hp>0&&p.dashT<=0){const inBand=sw.vert?Math.abs(p.x-sw.x)<sw.w/2+p.r*.5:Math.abs(p.y-sw.y)<sw.w/2+p.r*.5,near=sw.vert?Math.abs(p.y-at)<60:Math.abs(p.x-at)<60;if(inBand&&near){sw.hit=1;damagePlayer(14);trauma90(.25);}}
      if(SET.fx&&vR3()<.6)glyph95(sw.vert?sw.x+vrnd3(-30,30):at,sw.vert?at:sw.y+vrnd3(-30,30),1,'#f4fff9',1);
      if(sw.pos>span+80){H_.sw=null;H_.t=b.allOpen?1.6:2.6;}}}}
// --- тени прошлых боссов фазы 2: мини-боссы на 15 секунд, две атаки каждая ---
const SHADE95=[['lek','ЛЕКАЛО','#e8d27a'],['well','ПЕРВЫЙ СИГНАЛ','#6b8cff'],['heart','СЕРДЦЕ','#ffd36b'],['flag','ПОСЛЕДНИЙ ДОВОД','#b8c4d6']];
function shoreShadesTick95(b,dt){if(b.st!=='fight')return;if(b.phase===2){b.shadT-=dt;if(b.shadT<=0&&!b.shades.some(s=>s.alive)){b.shadT=20;shadeSpawn95(b);}}
  for(const s of b.shades){if(!s.alive)continue;s.life95-=dt;s.a1-=dt*atk95(b);s.a2-=dt*atk95(b);if(s.spawnT>0)continue;shadeAtk95(b,s);if(s.life95<=0)shadeGone95(b,s,true);}}
function shadeSpawn95(b,pick){const [k,name,col]=pick||SHADE95[b.shadeI++%4];const hz=hzAt100(b,W/2),k_=shk95();let x=W/2,y=hz+120*k_;
  if(k==='well'){x=Math.random()<.5?W*.14:W*.86;y=clamp(H*.62,hz+110,H-90);}if(k==='heart'){x=W/2;y=clamp(H*.6,hz+140,H-120);}if(k==='flag'){x=W*.7;y=hz+100*k_;}if(k==='lek'){y=hz+60+40*k_;}
  y=Math.max(y,hz+40+40);const s=spawnEnemy('shade95',x,y,{noAffix:true,noLoot:true,host85:b,keep85:1,spawnT:1,noBar90:1});s.k95=k;s.name95=name;s.col95=col;s.life95=15;s.maxHp95=s.hp95=Math.round(b.maxHp*.03);s.a1=1.2;s.a2=3.2;s.r=40*k_;
  b.shades.push(s);b.parts.push(s);banner('ТЕНЬ · '+name,'15 СЕКУНД · РАЗВЕЙТЕ ЕЁ — ГЛАЗА ОТКРОЮТСЯ');snd95('shade',x);return s;}
function shadeGone95(b,s,timeout){if(!s.alive)return;s.alive=false;explode(s.x,s.y,s.col95||'#cfe8e0',20,.9);glyph95(s.x,s.y,10,s.col95);
  if(!timeout&&b&&b.st==='fight'){b.face.stun=Math.max(b.face.stun,2);floater(s.x,s.y-50,'ТЕНЬ РАССЕЯНА · ГЛАЗА ОТКРЫТЫ',s.col95);snd95('stun',s.x);hs90(.07,0);}else floater(s.x,s.y-50,'ТЕНЬ УШЛА',s.col95||'#cfe8e0');}
function shadeAtk95(b,s){const p=G.player;if(!p)return;const hz=hzAt100(b,p.x);
  switch(s.k95){
    case 'lek':if(s.a1<=0){s.a1=3.4;tg95({k:'col',x:clamp(p.x,60,W-60),y:hz,y2:H+10,w:110,T:.9,dmg:14,col:s.col95,src:s,key:'shadeLek'});}
      if(s.a2<=0){s.a2=5;for(let i=0;i<3;i++){const a=rnd(0,TAU),d=i?rnd(70,150):0;tg95({k:'zone',x:clamp(p.x+Math.cos(a)*d,40,W-40),y:Math.max(hz+40,p.y+Math.sin(a)*d),r:60,T:.8+i*.15,dmg:10,col:s.col95,src:s,key:'shadeStamp',snd:i?false:undefined});}}break;
    case 'well':if(s.a1<=0){s.a1=3;const a0=rnd(0,TAU);wv95({x:s.x,y:s.y,v:250,w:12,dmg:10,col:s.col95,gaps:[{a:a0,w:.7},{a:a0+Math.PI,w:.7}],R:Math.hypot(W,H)});snd95('tlRing',s.x);}
      if(s.a2<=0){s.a2=5;for(let i=0;i<4;i++){const f=eb95(s.x,s.y,Math.atan2(p.y-s.y,p.x-s.x)+(i-1.5)*.5,120,7,s.col95,6,'fire',{homing:true,shoot95:1});if(f)f.life=6;}snd95('signal',s.x);}break;
    case 'heart':if(s.a1<=0){s.a1=1.25;wv95({x:s.x,y:s.y,v:300,w:9,dmg:7,col:s.col95,R:Math.hypot(W,H)});snd90('beat',.6);}
      if(s.a2<=0){s.a2=4;for(let i=0;i<4;i++){const a=rnd(0,TAU),d=i?rnd(60,200):0;tg95({k:'drop',x:clamp(p.x+Math.cos(a)*d,40,W-40),y:Math.max(hz+40,p.y+Math.sin(a)*d),r:40,T:.9,dmg:10,col:C90.blood,src:s,key:'shadeRain',snd:i?false:undefined});}}break;
    case 'flag':if(s.a1<=0){s.a1=3;const a0=Math.atan2(p.y-s.y,p.x-s.x);for(let i=0;i<9;i++)shootE(s.x,s.y,a0+(i-4)*.12,260,8,s.col95,5);sfx('shoot2');}
      if(s.a2<=0){s.a2=5;const a=Math.atan2(p.y-s.y,p.x-s.x);tg95({k:'line',x:s.x,y:s.y,x2:s.x+Math.cos(a)*1400,y2:s.y+Math.sin(a)*1400,w:26,T:.9,dmg:16,col:s.col95,src:s,key:'shadeLance'});}break;}}
AI85X.eye95=(e,dt)=>{e.vx=e.vy=0;if(!e.host85||!e.host85.alive||G.sb!==e.host85)e.alive=false;if(e.weak95>0)e.weak95-=dt;};
AI85X.shade95=(e,dt)=>{e.vx=e.vy=0;if(!e.host85||!e.host85.alive||G.sb!==e.host85)e.alive=false;e.x+=Math.sin(G.t*.8+e.uid)*12*dt;};
KILL85X.hkey90=()=>{};
KILL85X.eye95=()=>{};KILL85X.shade95=()=>{};
KILL85X.hvalve90=(e,silent)=>{const b=G.sb;if(b&&b.sbk==='heart'&&!silent){explode(e.x,e.y,C90.ark,16,.7);floater(e.x,e.y-26,'КЛАПАН РАЗБИТ · СОСУД КРОВОТОЧИТ',C90.ark);snd90('valve');heartBleed95(b,e.vi);}};
KILL85X.thromb90=(e,silent)=>{const b=G.sb;if(b&&b.sbk==='heart'){if(!silent){explode(e.x,e.y,C90.red,14,.6);floater(e.x,e.y-24,'СГУСТОК РАЗБИТ',C90.warm);conEvent('drain90');}if(b.thr===e)b.thr=null;}};
AI85X.heart90=(e,dt)=>{if(!e.sbk){if(G.sb&&G.sb!==e&&G.sb.alive){e.alive=false;return;}sb85Init(e,'heart',1);}e.vx=e.vy=0;sb85Update(e,dt);};
AI85X.shore100=(e,dt)=>{if(!e.sbk){if(G.sb&&G.sb!==e&&G.sb.alive){e.alive=false;return;}sb85Init(e,'shore',1);}e.vx=e.vy=0;sb85Update(e,dt);};
for(const k of ['hvalve90','hkey90','beacon100'])AI85X[k]=(e,dt)=>{e.vx=e.vy=0;if(!e.host85||!e.host85.alive||G.sb!==e.host85)kill(e,true);};
AI85X.thromb90=(e,dt)=>{if(!e.host85||!e.host85.alive||G.sb!==e.host85){kill(e,true);return;}const b=e.host85;if(e.spawnT>0)return;const dx=b.cx-e.x,dy=b.cy-e.y,d=Math.hypot(dx,dy)||1;if(d>b.r+e.r+4){const s=34*b.k;e.vx=dx/d*s;e.vy=dy/d*s;e.x+=e.vx*dt;e.y+=e.vy*dt;}else{e.vx=e.vy=0;}};
// --- финал: причалы в поле зрения камеры, в портрете — стопкой (X15) ---
function dockPos95(n,i,cy){const port=VH>VW*1.15,cx=(G.arena?CX:0)+VW/2,yy=cy!==undefined?cy:(G.arena?CY:0)+VH*.62;
  if(port){const step=Math.min(110,VH*.14);return {x:cx,y:clamp(yy-step*(n-1)/2+step*i,70,H-70)};}const dx=Math.min(190,VW*.28);return {x:clamp(cx+(i-(n-1)/2)*dx,70,W-70),y:yy};}
function shoreRecOk(){return G.mode==='world'&&fragN100(sh100().frag)>=12;}
function shoreScene(b,dt){b.scT+=dt;b.hzF+=(.08-b.hzF)*Math.min(1,dt*.6);
  if(b.st==='scene'&&b.scT>=2.2&&!b.subOn){b.subOn=true;const n=fragN100(sh100().frag);
    sub85('БЕРЕГ',C90.sh2,['«Здесь был берег. Здесь писали имена, и вода их смывала».','«Ты нашёл '+n+' из двенадцати. Остальное море уже забрало».','«Можешь забыть всё и лететь налегке. Или нести то, что осталось».'],
      ()=>{if(b.st!=='scene')return;b.st='final';const ok=shoreRecOk(),need=12-fragN100(sh100().frag);const P0=dockPos95(3,0),P1=dockPos95(3,2),P2=dockPos95(3,1);
        const L=[{kind:'forget',x:P0.x,y:P0.y,lab:'ЗАБЫТЬ',sub:'лететь налегке',col:'#9fb0c4'},{kind:'carry',x:P1.x,y:P1.y,lab:'НЕСТИ',sub:'память — это груз',col:C90.sh}];
        L.push({kind:'record',x:P2.x,y:P2.y,lab:ok?'ЗАПИСАТЬ':'…не хватает '+need+' '+(need%10===1&&need%100!==11?'голоса':'голосов')+'…',sub:ok?'чтобы помнил следующий':'',lock:!ok,col:'#ffffff'});
        sb85SetDocks(b,L);banner('СТЁРТЫЙ БЕРЕГ','ЗАБЫТЬ ИЛИ НЕСТИ · ЛЕТИТЕ К ПРИЧАЛУ');sfx('level');});}
  if(b.st==='final')sb85Docks(b,dt);}
function shoreChoose(b,ch,world,prev){const X=x85();const n=fragN100(sh100().frag);if(G.mc&&!G.mc.hz100&&world)own85('tidemark100');
  if(ch==='forget'){G.sbLomK=prev?1:1.5;G.sbChoiceTxt=(prev?'Вы уже сделали выбор: всё забыто. ':'Вы забыли: лом ×1,5. Модуль «Стёрка»: после импульса 1,2 с вас не видят. ')+'Обрывков найдено: '+n+'/12.';
    SB_DEATH.shore=['БЕРЕГ ЧИСТ','СЕКТОР X ПРОЙДЕН','Налегке летится быстрее. Я проверял. Много раз.'];}
  else if(ch==='carry'){G.sbLomK=1;G.sbChoiceTxt=(prev?'Вы уже сделали выбор: вы несёте память. ':'Вы несёте память: награда за миссии +10%, модуль «Груз памяти» — +1% урона за каждый обрывок ('+n+'). ')+'Обрывков найдено: '+n+'/12.';
    SB_DEATH.shore=['ПАМЯТЬ НА БОРТУ','СЕКТОР X ПРОЙДЕН','Тяжело? Это нормально. Так и должно быть.'];}
  else{G.sbLomK=prev?1:2;G.sbChoiceTxt=(prev?'Вы уже сделали выбор: берег записан. ':'Берег записан целиком: лом ×2. Скин «Пустой берег». На карте — «Нулевая точка» за краем стёртого. ');
    SB_DEATH.shore=['БЕРЕГ ЗАПИСАН','НУЛЕВАЯ ТОЧКА · СКОРО','Двенадцать голосов. Теперь и следующий узнает, что здесь кто-то был.'];if(world&&!prev)own85('shore100s');}
  X.calm=99;}

