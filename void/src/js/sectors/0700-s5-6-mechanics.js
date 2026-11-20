// ===== 0.7.4: сектора V–VI — механики, враги, события, боссы, открытый мир =====
const H74=new Set(['membrane','vent','turncoat','boarder','cocoon','absorber']);
const SB74T=new Set(['nurse','womb','flagship','fpart']);
const NU_PHASES=['КОЛЫБЕЛЬНАЯ','СХВАТКИ','ПОСЛЕДНИЙ РЕБЁНОК'],FL_PHASES=['БОРТОВОЙ ЗАЛП','БЕЗ ХОДА','РУБКА ОТКРЫТА'];
SB_NAMES.nurse='КОРМИЛИЦА';SB_NAMES.flag='ПОСЛЕДНИЙ ДОВОД';
SB_ESC.nurse={1:['unborn','unborn','pestun'],2:['unborn','singer','cord'],3:['unborn','unborn','membrane']};
SB_ESC.flag={1:['autopilot','autopilot','cadet'],2:['boarder','autopilot','fireship'],3:['autopilot','boarder','cadet','fireship']};
const SB_FLAG={inv:'inv14',obod:'obod18',nurse:'cradle22',flag:'fleet27'},SB_FLAG_M={14:'inv14',18:'obod18',22:'cradle22',27:'fleet27'};
const SB_DEATH={nurse:['КОЛЫБЕЛЬ ЗАСНУЛА','СЕКТОР V ПРОЙДЕН','Колыбели строили не мы. Мы только решали, чьи истории в них поместятся. Я ошибся с местом. И с тобой — тоже.'],
  flag:['ФЛОТ ЗАМОЛЧАЛ','СЕКТОР VI ПРОЙДЕН','Карр спрашивал, почему Стражи не стреляют по рубке. Я запретил им объяснять. Ему — тоже.']};
const SB_ESC_R={nurse:['КОРМИЛИЦА','#ff9fb8','…[дети]… проснитесь… [чужой] пришёл…'],flag:['ФЛАГМАН','#b8c4d6','Всем кораблям: к флагману. Держать строй.']};
Object.assign(SB_WRECK,{22:{cut:['ОБОЛОЧКА КОРМИЛИЦЫ','Кокон разбит. Внутри — контур корабля, ещё без номера. В скорлупе выцарапано на чужом языке одно слово, переводчик даёт: «следующий».'],keep:['ОБОЛОЧКА КОРМИЛИЦЫ','Пустой кокон. Младший вылупился и летит рядом. Колыбель спит. На стенке — отпечаток крыла, похожего на ваше.']},
  27:{bridge:['РУБКА «ПОСЛЕДНЕГО ДОВОДА»','Рубка пробита. Бортовой журнал адмирала Карра обрывается на вопросе: «Почему не в рубку?» Ответа он так и не получил.'],engine:['ДВИГАТЕЛИ «ПОСЛЕДНЕГО ДОВОДА»','Двигатели выбиты, рубка цела. Адмирал жив и молчит. В эфире флота иногда слышно: «Справа строй. Бери ниже».']}});
RADIO['С']={tag:'КОЛЫБЕЛЬ',col:'#ff9fb8',l:[{t:'…[место] освободилось. Выходите по одному…'},{t:'…ты пахнешь чужими [мирами]…'},{t:'…архив записал нас [чужим] почерком…'},{t:'…[дети] спят [сто двадцать семь] [сезонов]…'},{t:'…мы отдали им [имена] заранее. Имена живут дольше…'},{t:'…не стреляй в [кладку]. Она ещё не [знает], кто ты…'},{t:'…ты сжёг [память]. Теперь тут тесно…',c:'invcold'},{t:'…записи оттаяли. Они плачут сквозь [стену]…',c:'invmem'},{t:'…[Тала] считала нас. Нас было на одного больше…'},{t:'…ты выбрал [мёртвых]. Как тот, кто нас сохранил…',c:'dead33'},{t:'…ты выбрал [детей]. Тогда дослушай [колыбельную]…',c:'unborn33'},{t:'…[младший] летит рядом. Он помнит твой [запах]…',c:'keep22'}]};
RADIO['Т']={tag:'ФЛОТ',col:'#b8c4d6',l:[{t:'Фрегат «Северин»: экипаж 412, на связи 0.'},{t:'Крейсер «Ладога»: экипаж 980, на связи 0.'},{t:'Флагман — всем: держать строй.'},{t:'Это шлюпка 4. Нас трое. Мы видим вас. Вы — Страж?'},{t:'Курсант Тео, борт 12. Прошу разрешения вернуться в порт.'},{t:'…двигатели выбиты. Рубка цела. Почему рубка цела?…'},{t:'Не стрелять по рубке. Только по двигателям. Он не наш.'},{t:'VØID-013… на связи… — пауза в перекличке.'},{t:'Тео жив. Повторяю: Тео жив.',c:'teo'},{t:'Справа строй. Бери ниже.',c:'engine27'}]};
RADIO_SEC[4]='С';RADIO_SEC[5]='Т';
STORY_NORETREAT.add('cocoon');STORY_NORETREAT.add('vent');STORY_NORETREAT.add('womb');STORY_NORETREAT.add('nurse');STORY_NORETREAT.add('flagship');STORY_NORETREAT.add('fpart');STORY_NORETREAT.add('battery');STORY_NORETREAT.add('linkor');STORY_NORETREAT.add('lastkind');STORY_NORETREAT.add('membrane');
// --- утилиты ---
function x74(){return G.world?(G.w74r||(G.w74r={hulls:[],wells:[],strips:[],tracers:[],spores:[],milk:[],ev:{}})):(G.x74||(G.x74={hulls:[],wells:[],strips:[],tracers:[],spores:[],milk:[],ev:{}}));}
function sec74(){if(G.world){const p=G.player;return p&&inSectors(p.x,p.y)?sectorIdx(p.x,p.y):-1;}const M=MISSIONS[G.m-1];return inMission()&&M&&M.gen?M.sec:-1;}
function mercyHit(d){const p=G.player;if(!p||p.hp<=0||p.dashT>0||p.inv>0||G.deadT>0)return;if(p.shieldUp){damagePlayer(d);return;}
  damagePlayer(d*.4);G.eng74=Math.min(5,(G.eng74||0)+1);G.engT74=6;if(G.mc)G.mc.eng74=1;
  if(G.eng74>=5){G.eng74=0;G.lockDash=Math.max(G.lockDash||0,4);floater(p.x,p.y-30,'ДВИГАТЕЛИ ЗАГЛУШЕНЫ · РЫВОК 4 С','#b8c4d6');sfx('block');}
  else floater(p.x,p.y-30,'ДВИГАТЕЛЬ ПОВРЕЖДЁН','#b8c4d6');}
function shootM(x,y,a,spd,dmg){const q=shootE(x,y,a,spd,dmg,'#dfe8ff',5);if(q)q.mercy=true;return q;}
function hatchCocoon(e){if(!e.alive)return;e.alive=false;e.hatched=true;const pool=G.sb&&G.sb.alive&&G.sb.sbk==='nurse'?['unborn']:!G.world&&G.coPool74&&G.coPool74.length?G.coPool74:['unborn','gunner','phantom','shocker'];
  const t=pool[Math.floor(Math.random()*pool.length)];const n=spawnEnemy(t,e.x,e.y,{noAffix:true,spawnT:.35,zone:e.zone,escort:e.escort});
  if(n){n.hp*=1.3;n.maxHp=n.hp;if(AFX_OK.has(t)){const k=shuffle(Object.keys(AFX))[0];n.affix=[k];if(k==='armor')n.armor=3;if(k==='fast')n.spd*=1.35;}}
  explode(e.x,e.y,'#ff9fb8',14,.8);floater(e.x,e.y-20,'ВЫЛУПЛЕНИЕ','#ff9fb8');sfx('warn');if(G.x74&&!G.world)G.x74.hatched=(G.x74.hatched||0)+1;}
function memSeg(e){const a=e.wa||0,L=80;return [e.x-Math.cos(a)*L,e.y-Math.sin(a)*L,e.x+Math.cos(a)*L,e.y+Math.sin(a)*L];}
function hullLocal(h,x,y){const c=Math.cos(-h.ang),s=Math.sin(-h.ang),dx=x-h.x,dy=y-h.y;return [dx*c-dy*s,dx*s+dy*c];}
function hullIn(h,x,y,pad){const [lx,ly]=hullLocal(h,x,y);return Math.abs(lx)<h.L/2+pad&&Math.abs(ly)<h.T/2+pad;}
function hullAdd(i,n){const X=x74();const h={x:n===1?W*.5:(i?W*.72:W*.28),y:n===1?H*.36:(i?H*.58:H*.3),ang:rnd(-.4,.4),va:rnd(-.05,.05),vx:rnd(-14,14),vy:rnd(-10,10),L:Math.min(340,W*.3),T:64,cd:0};
  X.hulls.push(h);const b=spawnEnemy('battery',h.x,h.y,{noAffix:true,host74:h,ox:h.L*.22,oy:-h.T/2-4,fa:-Math.PI/2});if(b)b.cd=rnd(2,4);return h;}
// --- инициализация миссии ---
function t74Init(M){const sec=M&&M.gen?M.sec:-1;G.x74={sec,hulls:[],wells:[],strips:[],tracers:[],spores:[],milk:[],ev:{},stripT:rnd(26,38),hatched:0};G.lom74=0;G.latch74=null;G.flag74T=0;G.box74c=false;G.noEsc74=false;G.eng74=0;G.engT74=0;
  const C=SEC_WAVES[G.m];G.coPool74=C?C.nw.concat(C.old).filter(t=>!NO_BROOD.has(t)&&EDEF[t]):null;
  if(sec<4||!inMission()||G.mode==='endless')return;const m=G.m,ev=G.x74.ev;
  if(sec===5&&!M.bossRoom){const n=m>=25?2:1;for(let i=0;i<n;i++)hullAdd(i,n);}
  if(m===19)ev.birth={at:32};
  if(m===20||m===21)ev.grav={at:m===20?18:26};
  if(m>=19&&m<=21&&Math.random()<(m===21?.6:.4))ev.last={at:rnd(36,52)};
  if(m===24){ev.flag={at:28};ev.teo={};}
  if(m===25){ev.box={at:22};ev.mines={at:48};}
  if(m===26){ev.echo={at:18};ev.linkor={};}
  if(m===27)ev.order={};
  if(sec===5&&storyFlag('fleet27')==='engine'&&G.save&&G.save.medals[m]&&G.save.medals[m].clear)ev.admiral={at:rnd(14,26)};}
// --- ИИ новых врагов (из secEnemyUpdate; true = обработан) ---
function s74Update(e,dt,c){const r=s74Update0(e,dt,c);if(r&&!G.world&&e.alive&&!STATIC.has(e.type)&&e.type!=='lastkind'&&e.type!=='linkor'&&e.type!=='pilgrim'&&e.type!=='witness100'&&!e.leave90&&!e.retreat&&G.latch74!==e)edge74(e,dt);return r;}
function edge74(e,dt){const m=60,k=500*dt;if(e.x<m)e.vx+=k;else if(e.x>W-m)e.vx-=k;if(e.y<m)e.vy+=k;else if(e.y>H-m)e.vy-=k;}
function s74Update0(e,dt,c){const p=G.player,{ux,uy,d,sm,T,pd}=c,pdx=p.x-e.x,pdy=p.y-e.y;if(G.world&&(e.alarm80||e.convoy80||e.audit80)&&s80Pre(e,dt))return true;if(S90T.has(e.type))return s90Update(e,dt,c);if(SB85T.has(e.type))return s85Update(e,dt,c);if(S80T.has(e.type))return s80Update(e,dt,c);
  if(e.n74&&G.world){n74AI(e,dt,c);return true;}
  switch(e.type){
    case 'cocoon':{e.vx=e.vy=0;if(e.hatchT===undefined){const er=G.save&&G.save.story?clamp(erosion(),0,1):0;e.hatchT=e.hatch0||8-2*er;e.hatchMax=e.hatchT;}
      e.hatchT-=dt*(e.song>0?2:1);if(e.song>0)e.song-=dt;if(e.hatchT<=0)hatchCocoon(e);return true;}
    case 'unborn':{e.a74=(e.a74||0)+dt;e.ghost=e.a74<1;const w=Math.sin(e.t*4+e.seed)*.4;steer(e,pdx/pd-pdy/pd*w,pdy/pd+pdx/pd*w,e.spd*sm*(e.a74<1?.6:1),dt,4);return true;}
    case 'pestun':{if(e.carry===undefined){e.carry=2;e.cn=Math.floor(Math.random()*4);}
      if(e.carry>0){const m=90,C4=G.world?[[p.x-420,p.y-300],[p.x+420,p.y-300],[p.x+420,p.y+300],[p.x-420,p.y+300]]:[[m,m],[W-m,m],[W-m,H-m],[m,H-m]],q=C4[e.cn%4];
        if(!e.tg)e.tg=q.slice();steer(e,e.tg[0]-e.x,e.tg[1]-e.y,e.spd*sm,dt,2.5);
        if(Math.hypot(e.tg[0]-e.x,e.tg[1]-e.y)<50){spawnEnemy('cocoon',e.x,e.y,{noAffix:true,spawnT:.3,zone:e.zone,escort:e.escort});e.carry--;e.cn+=1+Math.floor(Math.random()*2);e.tg=null;floater(e.x,e.y-20,'КОКОН ПОСАЖЕН','#ff9fb8');}}
      else{const m=clamp((pd-300)/120,-1,1);steer(e,pdx/pd*m-pdy/pd*.6*e.dir,pdy/pd*m+pdx/pd*.6*e.dir,e.spd*sm,dt,2.5);
        e.cd-=dt;if(e.cd<=0&&onScreen(e)&&p.hp>0){e.cd=rnd(2.2,2.8);shootE(e.x,e.y,Math.atan2(T.y-e.y,T.x-e.x),190,8,'#ff9fb8',6,!!T.isBc);}}return true;}
    case 'membrane':{let best=null,bd=1e9;for(const o of G.enemies){if(o===e||!o.alive||o.type==='membrane'||EDEF[o.type].passive||o.spawnT>0)continue;const q=Math.hypot(o.x-p.x,o.y-p.y);if(q<bd&&q<900){bd=q;best=o;}}
      let tx,ty;if(best){const k=Math.min(1,160/Math.max(1,bd));tx=best.x+(p.x-best.x)*k;ty=best.y+(p.y-best.y)*k;}else{tx=p.x-pdx/pd*260;ty=p.y-pdy/pd*260;}
      if(Math.hypot(tx-p.x,ty-p.y)<120){tx=p.x+(tx-p.x)/Math.max(1,Math.hypot(tx-p.x,ty-p.y))*120;ty=p.y+(ty-p.y)/Math.max(1,Math.hypot(tx-p.x,ty-p.y))*120;}
      const q=Math.hypot(tx-e.x,ty-e.y);if(q>8)steer(e,tx-e.x,ty-e.y,Math.min(e.spd*sm*2,q*2),dt,2);else{e.vx*=.9;e.vy*=.9;}
      const wa=Math.atan2(pdy,pdx)+Math.PI/2;e.wa=e.wa===undefined?wa:e.wa+clamp(angDiff(wa,e.wa),-1.2*dt,1.2*dt);return true;}
    case 'cord':{if(!e.paired){e.paired=1;if(!e.mateOf){const m=spawnEnemy('cord',e.x+rnd(-40,40),e.y+rnd(-40,40),{noAffix:true,zone:e.zone,mateOf:e,paired:1,spawnT:.3,escort:e.escort});if(m){e.mate=m;m.mate=e;e.ph=0;m.ph=Math.PI;}}}
      const R_=230,a=G.t*.6+(e.ph||0),tx=p.x+Math.cos(a)*R_,ty=p.y+Math.sin(a)*R_;steer(e,tx-e.x,ty-e.y,e.spd*sm,dt,2.5);
      const m=e.mate;if(m&&m.alive&&!e.cut){e.hp=Math.min(e.maxHp,e.hp+6*dt);
        if(e.uid<m.uid&&p.hp>0&&e.spawnT<=0&&m.spawnT<=0){const sd=segDistP(p.x,p.y,e.x,e.y,m.x,m.y);
          if(p.dashT>0&&segInter(p.px,p.py,p.x,p.y,e.x,e.y,m.x,m.y)){e.cut=m.cut=true;floater((e.x+m.x)/2,(e.y+m.y)/2-14,'СВЯЗЬ ПОРВАНА','#ff7fa0');sfx('boom');}
          else if(sd<p.r+6&&p.dashT<=0){e.tcd=(e.tcd||0)-dt;if(e.tcd<=0){e.tcd=1;damagePlayer(10);}}}}return true;}
    case 'singer':{const m=clamp((pd-380)/120,-1,1);steer(e,pdx/pd*m-pdy/pd*.5*e.dir,pdy/pd*m+pdx/pd*.5*e.dir,e.spd*sm,dt,2);if(Math.random()<dt*.2)e.dir*=-1;e.sing=(e.sing||0)+dt;return true;}
    case 'sporer':{const m=clamp((pd-300)/120,-1,1);steer(e,pdx/pd*m-pdy/pd*.6*e.dir,pdy/pd*m+pdx/pd*.6*e.dir,e.spd*sm,dt,2.5);if(Math.random()<dt*.2)e.dir*=-1;
      e.sp=(e.sp===undefined?3:e.sp)-dt;if(e.sp<=0&&onScreen(e)&&p.hp>0){e.sp=5*(G.atkK||1);const X=x74();if(X.spores.length<4){X.spores.push({x:p.x+rnd(-40,40),y:p.y+rnd(-40,40),r:90,t:8});sfx('warn');}}return true;}
    case 'absorber':{const m=clamp((pd-260)/120,-1,1);steer(e,pdx/pd*m,pdy/pd*m,e.spd*sm,dt,1.5);e.r=16+(e.ab||0)*.6;return true;}
    case 'embryo':{e.grow=(e.grow||0)+dt;const gm=e.fast?10:20;steer(e,pdx,pdy,e.spd*sm,dt,1.5);
      if(e.grow>=gm){e.alive=false;const g=spawnEnemy('guard',e.x,e.y,{noAffix:true,zone:e.zone,spawnT:.4,escort:e.escort});explode(e.x,e.y,'#ffb84d',16,.8);floater(e.x,e.y-24,'ДОРОС ДО СТРАЖА','#ffb84d');sfx('warn');}return true;}
    case 'lastkind':{e.lk=(e.lk||0)+dt;if(e.ex===undefined)e.ex=G.world?(e.x<p.x?-1:1):(e.x<W/2?-1:1);
      if(G.world){steer(e,-pdx/pd,-pdy/pd,e.spd,dt,1);if(e.lk>16)lastkindGone(e);}
      else{const tx=e.ex<0?-220:W+220;steer(e,tx-e.x,(H*.5-e.y)*.2,e.spd,dt,1);if(e.x<-60||e.x>W+60||e.lk>18)lastkindGone(e);}return true;}
    case 'vent':{e.vx=e.vy=0;e.vt=(e.vt===undefined?1.5:e.vt)-dt;e.life74=(e.life74===undefined?30:e.life74)-dt;
      if(e.vt<=0){e.vt=3.5;if(G.enemies.filter(o=>o.alive&&o.type==='unborn').length<10)spawnEnemy('unborn',e.x,e.y,{noAffix:true,spawnT:.3});}
      if(e.life74<=0){e.alive=false;explode(e.x,e.y,'#5a2030',10,.6);}return true;}
    case 'autopilot':{if(e.cx===undefined){e.cx=G.world?e.x:W/2+rnd(-W*.1,W*.1);e.cy=G.world?e.y:H/2+rnd(-H*.1,H*.1);e.ph=rnd(0,TAU);}
      const R_=G.world?260:Math.min(W,H)*.32,a=e.t*.9+e.ph,tx=e.cx+Math.cos(a)*R_*1.2,ty=e.cy+Math.sin(2*a)*R_*.5;steer(e,tx-e.x,ty-e.y,e.spd*sm,dt,3);
      e.cd-=dt;if(e.cd<=0&&onScreen(e)){e.cd=rnd(1.4,1.9);let tg=null,td=420;const peace=G.flag74T>0;
        if(!peace&&!e.rogue&&p.hp>0&&pd<td){tg=p;td=pd;}
        for(const o of G.enemies){if(o===e||!o.alive||o.spawnT>0||o.ghost||EDEF[o.type].passive||EDEF[o.type].sbp||(o.type==='autopilot'&&!e.rogue)||o.n74)continue;const q=Math.hypot(o.x-e.x,o.y-e.y);if(q<td){td=q;tg=o;}}
        if(tg===p)shootE(e.x,e.y,Math.atan2(p.y+p.vy*.15-e.y,p.x+p.vx*.15-e.x),330,9,'#c9d2de',4);
        else if(tg){const X=x74();X.tracers.push({x1:e.x,y1:e.y,x2:tg.x,y2:tg.y,t:.15});hurt(tg,14,{ap:true});}}return true;}
    case 'battery':{const h=e.host74;if(h){const c_=Math.cos(h.ang),s_=Math.sin(h.ang);e.x=h.x+e.ox*c_-e.oy*s_;e.y=h.y+e.ox*s_+e.oy*c_;e.face=h.ang+(e.fa||0);e.vx=e.vy=0;if(h.alive===false){kill(e,true);return true;}}
      else{e.vx=e.vy=0;e.face=Math.atan2(pdy,pdx);}if(e.eng)return true;
      const ap=Math.atan2(pdy,pdx),inArc=Math.abs(angDiff(ap,e.face))<Math.PI/4&&pd<720;
      if(e.ch>0){e.ch-=dt;if(e.ch<=0){for(let i=-2;i<=2;i++)shootE(e.x,e.y,e.face+i*.12+clamp(angDiff(ap,e.face),-.6,.6),240,10,'#c9d2de',5);sfx('shot');}}
      else{e.cd-=dt;if(e.cd<=0&&inArc&&p.hp>0){e.ch=.6;e.cd=4;}}return true;}
    case 'boarder':{if(G.latch74===e){e.la=(e.la||0)+dt*.6;e.x=p.x+Math.cos(e.la)*12;e.y=p.y+Math.sin(e.la)*12;e.vx=p.vx;e.vy=p.vy;e.bt=(e.bt||0)+dt;if(e.bt>=1){e.bt=0;damagePlayer(4);}
        if(p.dashT>0||p.hp<=0)boarderOff(e);return true;}
      if(G.latch74&&G.latch74.alive){const m=clamp((pd-90)/60,-1,1);steer(e,pdx/pd*m,pdy/pd*m,e.spd*sm,dt,3);return true;}
      steer(e,pdx,pdy,e.spd*sm,dt,3.5);if(pd<e.r+p.r+4&&p.dashT<=0&&p.inv<=0&&p.hp>0&&!(e.stun>0)&&!(e.offT>0)){G.latch74=e;e.la=Math.atan2(-pdy,-pdx);floater(p.x,p.y-30,'АБОРДАЖ · СБРОСЬТЕ РЫВКОМ','#ffb84d');sfx('block');}
      if(e.offT>0)e.offT-=dt;return true;}
    case 'fireship':{e.v74=Math.min(230,(e.v74||e.spd*.6)+dt*22);steer(e,pdx,pdy,e.v74*sm,dt,1.1);e.ft=(e.ft||0)+dt;e.face=Math.atan2(e.vy,e.vx);
      if((pd<64&&p.hp>0)||e.ft>15)fireBlast(e,false);return true;}
    case 'signaller':{const m=clamp((pd-420)/120,-1,1);steer(e,pdx/pd*m-pdy/pd*.5*e.dir,pdy/pd*m+pdx/pd*.5*e.dir,e.spd*sm,dt,2);
      e.sc=(e.sc===undefined?5:e.sc)-dt;if(e.sc<=0&&p.hp>0){e.sc=7*(G.atkK||1);let n=0;
        for(const o of G.enemies){if(n>=10)break;if(!o.alive||o===e||o.spawnT>0||o.ghost||EDEF[o.type].passive||EDEF[o.type].sbp||o.type==='cocoon'||!onScreen(o)||o.retreat)continue;shootE(o.x,o.y,Math.atan2(p.y-o.y,p.x-o.x),300,8,'#9fd8ff',4);n++;}
        floater(e.x,e.y-24,'ЗАЛП','#9fd8ff');sfx('shot');}return true;}
    case 'turncoat':{const ap=Math.atan2(pdy,pdx);e.face=(e.face||ap)+clamp(angDiff(ap,e.face||ap),-.6*dt,.6*dt);const m=clamp((pd-320)/120,-1,1);steer(e,Math.cos(e.face)*m,Math.sin(e.face)*m,e.spd*sm,dt,1.5);
      if(e.burst>0){e.bt-=dt;if(e.bt<=0){e.burst--;e.bt=.15;shootM(e.x+Math.cos(e.face)*24,e.y+Math.sin(e.face)*24,Math.atan2(p.y-e.y,p.x-e.x)+rnd(-.05,.05),290,18);}}
      else{e.cd-=dt;if(e.cd<=0&&onScreen(e)&&p.hp>0){e.cd=3;e.burst=3;e.bt=0;}}return true;}
    case 'cadet':{const m=clamp((d-280)/120,-1,1);steer(e,ux*m-uy*.6*e.dir,uy*m+ux*.6*e.dir,e.spd*sm,dt,3);if(Math.random()<dt*.25)e.dir*=-1;
      if(!e.cadR&&!e.retreat&&inMission()&&e.hp<=e.maxHp*.34){e.cadR=true;storyRetreat(e);return true;}
      e.cd-=dt;if(e.cd<=0&&onScreen(e)){e.cd=rnd(1.8,2.4);shootE(e.x,e.y,Math.atan2(T.y-e.y,T.x-e.x)+rnd(-.35,.35),260,7,'#8fe9ff',4,!!T.isBc);}return true;}
    case 'linkor':return linkorAI(e,dt),true;
    case 'echoship':case 'echoguard':{e.ghost=false;const m=e.type==='echoship'?1:-1;steer(e,m*30,Math.sin(e.t+e.seed)*40,e.spd,dt,1);e.vx*=.98;e.ecd=(e.ecd===undefined?rnd(.5,1.5):e.ecd)-dt;
      if(e.ecd<=0){e.ecd=rnd(1.2,1.8);const foes=G.enemies.filter(o=>o.alive&&(o.type===(e.type==='echoship'?'echoguard':'echoship')));if(foes.length){const f=foes[Math.floor(Math.random()*foes.length)];x74().tracers.push({x1:e.x,y1:e.y,x2:f.x,y2:f.y,t:.18,c:EDEF[e.type].col});}}return true;}
    case 'nurse':case 'flagship':{if(!e.sbk&&!sb74Adopt(e))return true;if(e.sbk==='nurse')nuUpdate(e,dt);else flUpdate(e,dt);return true;}
    case 'womb':case 'fpart':e.vx=e.vy=0;return true;
  }
  return false;}
function lastkindGone(e){e.alive=false;e.spared=true;const S=G.save;if(S&&S.story&&G.mode==='world'){S.story.spared++;S.story.cyc.spared++;S.story.lastKind=(S.story.lastKind||0)+1;}
  floater(clamp(e.x,CX+40,CX+W-40),clamp(e.y,CY+40,CY+H-40),'ОТПУЩЕН · ПОСЛЕДНЯЯ КЛАДКА','#ffe0ea');radioLine('КОЛЫБЕЛЬ','#ff9fb8','…[спасибо]. Это слово мы не успели [перевести]…',.6);}
function boarderOff(e){if(G.latch74===e)G.latch74=null;e.stun=1.5;e.offT=3;e.hp=Math.max(1,e.hp*.5);const p=G.player,a=Math.atan2(e.y-p.y,e.x-p.x);e.vx=Math.cos(a)*320;e.vy=Math.sin(a)*320;floater(e.x,e.y-18,'СБРОШЕН','#ffb84d');sfx('block');}
function fireBlast(e,byPlayer){if(e.blasted)return;e.blasted=true;const p=G.player,R=180;explode(e.x,e.y,'#ff7a3d',40,1.3);G.shock.push({x:e.x,y:e.y,r:20,R,t:0,col:'#ff7a3d'});sfx('bigboom');shake(10);
  if(p&&p.hp>0&&Math.hypot(p.x-e.x,p.y-e.y)<R+p.r)damagePlayer(25);
  for(const o of G.enemies){if(o===e||!o.alive||o.spawnT>0||STATIC.has(o.type)||EDEF[o.type].sbp||o.type==='mine')continue;if(Math.hypot(o.x-e.x,o.y-e.y)<R+o.r)hurt(o,byPlayer?70:35,{fire:true});}
  if(e.alive){e.alive=false;}}
function linkorAI(e,dt){const p=G.player;if(!e.parts){e.parts=[];e.ang=0;e.wp=0;e.bsT=5;
    for(const [ox,oy,eng] of [[60,-30,0],[-20,-30,0],[60,30,0],[-20,30,0],[-90,-18,1],[-90,18,1]]){const q=spawnEnemy('battery',e.x,e.y,{noAffix:true,host74:e,ox,oy,fa:oy<0?-Math.PI/2:Math.PI/2,eng:!!eng,escort:true});if(q){if(eng){q.hp=q.maxHp=Math.round(q.maxHp*1.4);}q.cd=rnd(2,5);e.parts.push(q);}}}
  const engs=e.parts.filter(q=>q.alive&&q.eng).length;
  const WP=[[W*.3,H*.3],[W*.7,H*.3],[W*.7,H*.55],[W*.3,H*.55]],w=WP[e.wp%4],dx=w[0]-e.x,dy=w[1]-e.y;if(Math.hypot(dx,dy)<40)e.wp++;
  const ta=Math.atan2(dy,dx);e.ang+=clamp(angDiff(ta,e.ang),-.35*dt,.35*dt);const sp=e.spd*(engs/2);e.vx=Math.cos(e.ang)*sp;e.vy=Math.sin(e.ang)*sp;e.face=e.ang;
  if(e.bs){e.bs.t-=dt;if(e.bs.t<=0){const a=e.ang+e.bs.side*Math.PI/2;for(const ox of [-60,0,60]){const x=e.x+Math.cos(e.ang)*ox+Math.cos(a)*30,y=e.y+Math.sin(e.ang)*ox+Math.sin(a)*30;for(let i=-1;i<=1;i++)shootE(x,y,a+i*.16,210,12,'#d6dee8',6);}e.bs=null;sfx('bigboom');shake(5);}}
  else{e.bsT-=dt;if(e.bsT<=0&&p.hp>0){e.bsT=(engs?8:12)*atkK();const side=((p.x-e.x)*(-Math.sin(e.ang))+(p.y-e.y)*Math.cos(e.ang))>0?1:-1;e.bs={side,t:1};sfx('warn');}}}
function n74AI(e,dt,c){const p=G.player,z=e.zone;
  if(e.n74==='midwife'){let tg=null,td=1e9;for(const o of G.enemies){if(!o.alive||o.type!=='cocoon'||o.zone!==z)continue;const q=Math.hypot(o.x-e.x,o.y-e.y);if(q<td){td=q;tg=o;}}
    if(tg){steer(e,tg.x-e.x,tg.y-e.y,e.spd,dt,2);e.face=Math.atan2(tg.y-e.y,tg.x-e.x);if(td<46){tg.alive=false;explode(tg.x,tg.y,'#ffb84d',14,.7);floater(tg.x,tg.y-18,'КЛАДКА ВЫЖЖЕНА','#ffb84d');}}
    else{e.leaveT=(e.leaveT||0)+dt;steer(e,e.x-p.x,e.y-p.y,e.spd,dt,1);if(e.leaveT>4){e.alive=false;if(z)z.out74='helped';}}return;}
  if(e.n74==='tow'&&z&&z.dest){const tx=z.dest.x+(e.fo||0),ty=z.dest.y;steer(e,tx-e.x,ty-e.y,60,dt,1.5);e.face=Math.atan2(e.vy,e.vx);if(Math.hypot(tx-e.x,ty-e.y)<80){e.alive=false;if(z)z.out74='passed';}return;}}
// --- хуки урона и гибели ---
/* ARCH·85 · снято недостижимое объявление s74Hurt (1 из 2; действует последнее объявление) */
function s74Killed(e,silent){
  if(e.type==='cord'&&e.mate&&e.mate.alive&&!silent){const m=e.mate;m.hp=Math.max(1,m.hp*.5);m.maxHp*=.5;m.spd*=.7;m.cut=true;floater(m.x,m.y-20,'ПАРА РАЗОРВАНА · ×0,5','#ff7fa0');}
  if(e.type==='pestun'&&(e.carry||0)>0&&!silent)for(let i=0;i<e.carry;i++)spawnEnemy('cocoon',e.x+rnd(-30,30),e.y+rnd(-30,30),{noAffix:true,zone:e.zone,hatch0:3,spawnT:.2,escort:e.escort});
  if(e.type==='fireship'&&!e.blasted&&!silent)fireBlast(e,true);
  if(e.type==='boarder'&&G.latch74===e)G.latch74=null;
  if(e.type==='lastkind'&&!silent){if(G.world){for(let i=0;i<14;i++)G.pick.push({k:'lom',x:e.x+rnd(-20,20),y:e.y+rnd(-20,20),vx:rnd(-120,120),vy:rnd(-120,120),r:5,t:0,life:30,v:1});}else{G.lom74=(G.lom74||0)+60;for(let i=0;i<20;i++)G.pick.push({k:'xp',x:e.x+rnd(-12,12),y:e.y+rnd(-12,12),vx:rnd(-90,90),vy:rnd(-90,90),r:5,t:0,life:22});}
    floater(e.x,e.y-30,'ПОСЛЕДНЯЯ КЛАДКА УНИЧТОЖЕНА'+(G.world?'':' · +60 ЛОМА'),'#ffe0ea');}
  if(e.type==='linkor'&&e.parts)e.parts.forEach(q=>{if(q.alive)kill(q,true);});
  if(e.type==='battery'&&e.eng&&e.host74&&e.host74.alive&&!silent)floater(e.x,e.y-18,'ДВИГАТЕЛЬ ВЫБИТ','#d6dee8');
  if(e.type==='vent'&&!silent){G.lom74=(G.lom74||0)+15;floater(e.x,e.y-26,'УСТЬЕ ЗАКРЫТО · +15 ЛОМА','#ff9fb8');sfx('level');}
  if(e.type==='womb')sb74WombDied(e);
  if(e.type==='fpart')sb74PartDied(e);
  if(e.type==='cocoon'&&!silent&&!e.hatched)conEvent('cocoon');
  if(e.type==='echoship'||e.type==='echoguard'){const X=x74();X.echoK=X.echoK||{s:0,g:0};X.echoK[e.type==='echoship'?'s':'g']++;}
  if(e.teo&&!silent&&!e.spared){const S=G.save;if(S&&S.story&&G.mode==='world')S.story.teo=-1;}}
// --- баффы Певчих (из updateEnemies) ---
function s74Buffs(){for(const s of G.enemies){if(s.type!=='singer'||!s.alive||s.spawnT>0)continue;for(const o of G.enemies){if(o===s||!o.alive)continue;if(Math.hypot(o.x-s.x,o.y-s.y)<220){if(o.type==='cocoon')o.song=.3;else if(!HEAVY.has(o.type))o.buff=Math.max(o.buff,1.3);}}}}
// --- снаряды игрока: корпуса, мембраны, споры, воронки (true = снаряд поглощён) ---
/* ARCH·85 · снято недостижимое объявление b74Hit (1 из 2; действует последнее объявление) */
// --- тик (миссия и мир) ---
function t74Tick(dt){const p=G.player;if(!p)return;const X=x74(),sec=sec74();
  if(G.engT74>0)G.engT74-=dt;else if(G.eng74>0)G.eng74=Math.max(0,G.eng74-dt*.5);
  if(G.flag74T>0)G.flag74T-=dt;
  if(G.latch74&&(!G.latch74.alive||p.hp<=0))G.latch74=null;
  for(const q of X.tracers)q.t-=dt;X.tracers=X.tracers.filter(q=>q.t>0);
  for(const s of X.spores)s.t-=dt;X.spores=X.spores.filter(s=>s.t>0);
  // молоко Кормилицы
  for(const m of X.milk){m.t-=dt;if(p.hp>0&&Math.hypot(p.x-m.x,p.y-m.y)<30){m.t=0;G.milk75=5;floater(p.x,p.y-26,'МОЛОКО · ТЕМП ВЫШЕ','#ffe0ea');sfx('cell');}}X.milk=X.milk.filter(m=>m.t>0);
  // мембраны: рывок насквозь
  if(p.dashT>0)for(const e of G.enemies){if(e.type!=='membrane'||!e.alive||e.spawnT>0||e.ramId===G.dashId)continue;const s=memSeg(e);if(segInter(p.px,p.py,p.x,p.y,s[0],s[1],s[2],s[3])){e.ramId=G.dashId;hurt(e,e.maxHp*.5,{ram:true});floater(e.x,e.y-20,'МЕМБРАНА ПОРВАНА','#ff8fa8');}}
  // корпуса
  for(const h of X.hulls){h.ang+=h.va*dt;h.x+=h.vx*dt;h.y+=h.vy*dt;const mx=h.L*.35,my=h.T+40;if(h.x<mx){h.x=mx;h.vx=Math.abs(h.vx);}if(h.x>W-mx){h.x=W-mx;h.vx=-Math.abs(h.vx);}if(h.y<my){h.y=my;h.vy=Math.abs(h.vy);}if(h.y>H-my){h.y=H-my;h.vy=-Math.abs(h.vy);}
    if(h.cd>0)h.cd-=dt;
    if(p.hp>0){const [lx,ly]=hullLocal(h,p.x,p.y),ex=h.L/2+p.r-Math.abs(lx),ey=h.T/2+p.r-Math.abs(ly);if(ex>0&&ey>0){let nx=lx,ny=ly;if(ex<ey)nx=Math.sign(lx||1)*(h.L/2+p.r+1);else ny=Math.sign(ly||1)*(h.T/2+p.r+1);
      const c=Math.cos(h.ang),s=Math.sin(h.ang);const wx=h.x+nx*c-ny*s,wy=h.y+nx*s+ny*c;const cx=clamp(wx,p.r,BW-p.r),cy=clamp(wy,p.r,BH-p.r);p.x=cx;p.y=cy;
      if((Math.abs(cx-wx)>2||Math.abs(cy-wy)>2)&&h.cd<=0&&p.dashT<=0){h.cd=1;damagePlayer(15);floater(p.x,p.y-26,'ЗАЖАТ КОРПУСОМ','#d6dee8');}}}
    for(const e of G.enemies){if(!e.alive||STATIC.has(e.type)||e.type==='battery'||e.type==='mine'||e.type==='linkor')continue;const [lx,ly]=hullLocal(h,e.x,e.y);if(Math.abs(lx)<h.L/2+e.r&&Math.abs(ly)<h.T/2+e.r){const ex=h.L/2+e.r-Math.abs(lx),ey=h.T/2+e.r-Math.abs(ly);let nx=lx,ny=ly;if(ex<ey)nx=Math.sign(lx||1)*(h.L/2+e.r+1);else ny=Math.sign(ly||1)*(h.T/2+e.r+1);const c=Math.cos(h.ang),s=Math.sin(h.ang);e.x=h.x+nx*c-ny*s;e.y=h.y+nx*s+ny*c;}}}
  if(X.hulls.length)for(const b of G.eb){if(b.life<=0||b.rift)continue;for(const h of X.hulls)if(hullIn(h,b.x,b.y,0)){b.life=0;if(b.boss&&h.boss75)h.hits=(h.hits||0)+1;break;}}
  // воронки чужой гравитации
  for(const w of X.wells){w.t+=dt;w.life-=dt;w.on=w.life>0&&(w.t%2)<.9;if(!w.on)continue;
    if(p.hp>0&&p.dashT<=0){const dx=w.x-p.x,dy=w.y-p.y,d=Math.hypot(dx,dy);if(d<320&&d>8){const k=380*(1-d/320)*dt;p.x+=dx/d*k;p.y+=dy/d*k;}}
    for(const e of G.enemies){if(!e.alive||HEAVY.has(e.type)||STATIC.has(e.type))continue;const dx=w.x-e.x,dy=w.y-e.y,d=Math.hypot(dx,dy);if(d<320&&d>8){e.vx+=dx/d*420*(1-d/320)*dt;e.vy+=dy/d*420*(1-d/320)*dt;}}}
  X.wells=X.wells.filter(w=>w.life>-1);
  // залпы мёртвого флота
  for(const s of X.strips){s.t+=dt;if(s.t>=0&&!s.fired){s.fired=true;sfx('bigboom');shake(6);
      const inS=(x,y)=>s.hor?Math.abs(y-s.pos)<s.w/2:Math.abs(x-s.pos)<s.w/2;
      if(p.hp>0&&inS(p.x,p.y)&&p.dashT<=0)damagePlayer(22);
      for(const e of G.enemies){if(!e.alive||e.spawnT>0||STATIC.has(e.type)||EDEF[e.type].sbp||EDEF[e.type].passive)continue;if(inS(e.x,e.y))hurt(e,120,{force:true,strip:true});}}}
  X.strips=X.strips.filter(s=>s.t<.4);
  jr74Tick(dt,sec);
  if(!G.world&&inMission()){t74Events(dt,X,sec);if(sec>=4)t74Rescue(dt);}}
// застрявшие за краем арены (держатели дистанции у стены): 4 с за кадром — возвращаются внутрь
function t74Rescue(dt){for(const e of G.enemies){if(!e.alive||e.spawnT>0||e.retreat||STATIC.has(e.type)||EDEF[e.type].passive||e.type==='lastkind'||e.type==='linkor')continue;
  const out=e.x<-20||e.x>W+20||e.y<-20||e.y>H+20;if(!out){e.off74=0;continue;}e.off74=(e.off74||0)+dt;
  if(e.off74>4){e.off74=0;e.x=clamp(e.x,50,W-50);e.y=clamp(e.y,50,H-50);e.vx=e.vy=0;e.spawnT=.4;}}}
function t74Events(dt,X,sec){const p=G.player,M=MISSIONS[G.m-1],ev=X.ev,mt=G.mT;if(!M||G.endT>0||G.deadT>0)return;
  if(sec===5&&!M.bossRoom&&!G.sb){X.stripT-=dt;if(X.stripT<=0&&p.hp>0){X.stripT=rnd(40,55);const n=3+Math.floor(Math.random()*3),hor=Math.random()<.5;const tele=G.noTele?1.6:3;
      for(let i=0;i<n;i++){const pos=hor?rnd(H*.08,H*.92):rnd(W*.08,W*.92);X.strips.push({hor,pos,w:46,t:-tele-i*.25,fired:false});}
      banner('ЗАЛП МЁРТВОГО ФЛОТА','ФЛОТ БЬЁТ ПО ПОЗИЦИЯМ СТРАЖЕЙ 127-ЛЕТНЕЙ ДАВНОСТИ');sfx('warn');}}
  if(ev.birth&&!ev.birth.done&&mt>=ev.birth.at){ev.birth.done=1;const m=60;for(const [x,y] of [[m,H*.5],[W-m,H*.5],[W*.5,m],[W*.5,H-m]])spawnEnemy('vent',x,y,{noAffix:true,spawnT:.6});
    banner('РОДЫ','УСТЬЯ КОЛЫБЕЛИ ОТКРЫТЫ · ЗАКРОЙТЕ ИХ ЗАРЯДОМ ИЛИ «РАЗРЫВОМ»');radioLine('КОЛЫБЕЛЬ','#ff9fb8','…[время]. Выходите. Он освободил [место]…',.5);sfx('warn');}
  if(ev.grav&&!ev.grav.done&&mt>=ev.grav.at){ev.grav.done=1;for(let i=0;i<3;i++){let x,y,k=0;do{x=rnd(W*.15,W*.85);y=rnd(H*.15,H*.85);}while(Math.hypot(x-p.x,y-p.y)<260&&++k<10);X.wells.push({x,y,t:rnd(0,2),life:40,on:false});}
    banner('ЧУЖАЯ ГРАВИТАЦИЯ','ВОРОНКИ ТЯНУТ В РИТМЕ СЕРДЦА · ЛЕТАЙТЕ МЕЖДУ УДАРАМИ');sfx('warn');}
  if(ev.last&&!ev.last.done&&mt>=ev.last.at){ev.last.done=1;const fromL=Math.random()<.5;spawnEnemy('lastkind',fromL?W*.25:W*.75,-50,{noAffix:true,spawnT:.8});banner('ПОСЛЕДНИЙ ИЗ ВИДА','НЕ АТАКУЕТ · УХОДИТ ЗА КРАЙ');}
  if(ev.flag){const F=ev.flag;if(!F.on&&!F.done&&mt>=F.at){F.on=1;F.x=rnd(W*.2,W*.8);F.y=rnd(H*.25,H*.75);F.p=0;banner('ПОДНЯТЬ ФЛАГ','ДЕРЖИТЕСЬ В КРУГЕ 12 С · АВТОПИЛОТЫ ПРИЗНАЮТ ВАС СВОИМ');}
    if(F.on&&!F.done){if(p.hp>0&&Math.hypot(p.x-F.x,p.y-F.y)<70)F.p+=dt;if(F.p>=12){F.done=1;F.on=0;G.flag74T=30;G.lom74+=30;banner('ФЛАГ ПОДНЯТ','30 С АВТОПИЛОТЫ БЬЮТ ТОЛЬКО ЧУЖИХ · +30 ЛОМА');sfx('level');radioLine('ФЛОТ','#b8c4d6','Флагман — всем: опознан свой. Держать строй.',.3);}}}
  if(ev.box){const B=ev.box;if(!B.on&&!B.done&&mt>=B.at){B.on=1;B.x=rnd(W*.15,W*.4);B.y=rnd(H*.2,H*.8);B.ex=W-80;B.ey=rnd(H*.25,H*.75);banner('ЧЁРНЫЙ ЯЩИК','ПОДБЕРИТЕ И ДОСТАВЬТЕ К ВЫХОДУ · ГРУЗ ЗАМЕДЛЯЕТ');}
    if(B.on&&!B.done){if(!B.got&&p.hp>0&&Math.hypot(p.x-B.x,p.y-B.y)<30){B.got=1;G.box74c=true;floater(p.x,p.y-26,'ЯЩИК НА БОРТУ · −15% СКОРОСТИ','#ffd36b');sfx('pick');}
      if(B.got){B.x=p.x;B.y=p.y;if(Math.hypot(p.x-B.ex,p.y-B.ey)<60){B.done=1;B.on=0;G.box74c=false;G.lom74+=60;sfx('level');banner('ДОКЛАД ДОСТАВЛЕН','+60 ЛОМА');
        toast('ЧЁРНЫЙ ЯЩИК · ПОСЛЕДНИЙ ДОКЛАД','«Флагман — штабу. Стражи бьют только по двигателям. Повторяю: только по двигателям. Рубки целы. Мы живы. Мы не понимаем, почему мы живы».');
        if(G.mode==='world'&&G.save&&G.save.story)G.save.story.box81=1;}}}}
  if(ev.mines&&!ev.mines.done&&mt>=ev.mines.at){ev.mines.done=1;let cx,cy,k=0;do{cx=rnd(W*.25,W*.75);cy=rnd(H*.25,H*.75);}while(Math.hypot(cx-p.x,cy-p.y)<300&&++k<10);
    for(let i=0;i<9;i++){const a=i/9*TAU,r=rnd(60,190);spawnEnemy('mine',cx+Math.cos(a)*r,cy+Math.sin(a)*r,{arm:.95,fuse:0,life:40,noAffix:true});}banner('МИННОЕ ПОЛЕ','ПОЛЕ СТАВИЛ ФЛОТ — ПРОТИВ СТРАЖЕЙ · «РАЗРЫВ» ПРОБИВАЕТ КОРИДОР');sfx('warn');}
  if(ev.echo){const E_=ev.echo;if(!E_.on&&!E_.done&&mt>=E_.at){E_.on=1;E_.t=0;for(let i=0;i<4;i++)spawnEnemy('echoship',W*.12,H*(.2+i*.2),{noAffix:true,spawnT:.8});for(let i=0;i<3;i++)spawnEnemy('echoguard',W*.88,H*(.3+i*.2),{noAffix:true,spawnT:.8});
      banner('БИТВА 127 ЛЕТ НАЗАД','ЭХО ФЛОТА И СТРАЖЕЙ · МОЖНО ПОМОЧЬ ЛЮБОЙ СТОРОНЕ');}
    if(E_.on){E_.t+=dt;if(E_.t>=20){E_.on=0;E_.done=1;const K=X.echoK||{s:0,g:0};G.enemies.forEach(o=>{if(o.alive&&(o.type==='echoship'||o.type==='echoguard')){o.alive=false;explode(o.x,o.y,EDEF[o.type].col,8,.6);}});
      if(K.g>K.s){G.lom74+=40;floater(W/2,H*.3,'ВЫ ПОМОГЛИ ФЛОТУ · +40 ЛОМА','#b8c4d6');}
      else if(K.s>K.g){floater(W/2,H*.3,'ВЫ ПОМОГЛИ СТРАЖАМ','#ffb84d');if(G.mode==='world'&&G.save&&G.save.story)G.save.story.echo127='guard';radioLine('СТРАЖ','#ff6b8a','Тогда ты был на нашей стороне. Ты этого не помнишь.',.5);}}}}
  if(ev.linkor&&!ev.linkor.done&&G.waveIdx>=3&&!G.spawnQ.length){ev.linkor.done=1;spawnEnemy('linkor',W/2,-90,{noAffix:true,spawnT:1.2});banner('СКЕЛЕТ ЛИНКОРА','ВЫБЕЙТЕ ДВИГАТЕЛИ · ДЕРЖИТЕСЬ У НОСА И КОРМЫ');sfx('warn');}
  if(ev.order){const O=ev.order;if(!O.start&&G.waves.length&&G.waveIdx>=G.waves.length){O.start=mt;banner('ПОСЛЕДНИЙ ПРИКАЗ','«ВСЕМ КОРАБЛЯМ: КУРС НА ФЛАГМАН» · РАЗБЕЙТЕ ВОЛНУ ЗА 25 С');radioLine('ФЛАГМАН','#b8c4d6','Всем кораблям: курс на флагман.',.2);}
    if(O.start&&!O.done){const alive=G.enemies.filter(e=>e.alive&&!EDEF[e.type].passive).length+G.warns.length+G.spawnQ.length;if(alive===0){O.done=1;if(mt-O.start<25){G.noEsc74=true;floater(W/2,H*.35,'ФЛАГМАН ВЫХОДИТ БЕЗ ОХРАНЫ','#d6dee8');}}}}
  if(ev.teo&&!ev.teo.tagged){const c=G.enemies.find(e=>e.alive&&e.type==='cadet'&&e.spawnT<=0);if(c){c.teo=true;ev.teo.tagged=1;ev.teo.e=c;floater(c.x,c.y-22,'КУРСАНТ ТЕО','#8fe9ff');}}
  if(ev.teo&&ev.teo.e&&!ev.teo.done&&!ev.teo.e.alive){ev.teo.done=1;if(ev.teo.e.spared){if(G.mode==='world'&&G.save&&G.save.story)G.save.story.teo=1;radioLine('ФЛОТ','#b8c4d6','Курсант Тео, борт 12: вернулся. Спасибо, кто бы ты ни был.',.4);}}
  if(ev.admiral&&!ev.admiral.done&&mt>=ev.admiral.at){ev.admiral.done=1;radioLine('АДМИРАЛ КАРР','#b8c4d6',['Справа строй. Бери ниже.','Брандеры идут с кормы. Не стой на месте.','Связист за строем. Сними его первым.'][Math.floor(Math.random()*3)],0);}}
// --- спутник «Младший» (выбор «Выносить») ---
function jr74Tick(dt,sec){const p=G.player;if(storyFlag('cradle22')!=='keep'||(sec!==4&&sec!==5)||!p||p.hp<=0){G.jr74=null;return;}
  const J=G.jr74||(G.jr74={a:0,cd:1});J.a+=dt*1.4;J.x=p.x+Math.cos(J.a)*44;J.y=p.y+Math.sin(J.a)*44;J.cd-=dt;
  if(J.cd<=0){const t=nearestEnemy(J.x,J.y,420);if(t){J.cd=1.1;const an=Math.atan2(t.y-J.y,t.x-J.x);G.pb.push({x:J.x,y:J.y,px:J.x,py:J.y,vx:Math.cos(an)*760,vy:Math.sin(an)*760,dmg:G.st.dmg*.35,pierce:0,rico:0,life:.7,hit:[],drone:true,jr:true});}else J.cd=.25;}}
// --- «Милость» (выбор «По двигателям»): попадание по отступающему — сдача без смерти ---
function mercySurrender(e){if(storyFlag('fleet27')!=='engine'||!e.retreat)return false;e.alive=false;e.spared=true;const S=G.save;if(S&&S.story){S.story.spared++;S.story.cyc.spared++;}
  if(!G.world)G.lom74=(G.lom74||0)+5;floater(e.x,e.y-24,'СДАЛСЯ · МИЛОСТЬ'+(G.world?'':' · +5 ЛОМА'),'#dfe8ff');sfx('pick');return true;}
// --- отрисовка: под врагами ---
function d74Under(t){const X=G.world?G.w74r:G.x74;if(!X)return;
  for(const h of X.hulls){if(G.world&&!inView(h.x,h.y,h.L))continue;ctx.save();ctx.translate(h.x,h.y);ctx.rotate(h.ang);ctx.fillStyle='#121722';ctx.strokeStyle='#6b7688';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-h.L/2,-h.T/2);ctx.lineTo(h.L/2-18,-h.T/2);ctx.lineTo(h.L/2,0);ctx.lineTo(h.L/2-18,h.T/2);ctx.lineTo(-h.L/2,h.T/2);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(155,170,190,.35)';ctx.lineWidth=1;for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(i*h.L/8,-h.T/2+6);ctx.lineTo(i*h.L/8,h.T/2-6);ctx.stroke();}
    const bl=Math.sin(t*3+h.x)>.6;ctx.fillStyle=bl?'#ff4f6e':'#4a1a22';ctx.beginPath();ctx.arc(-h.L/2+14,0,3,0,TAU);ctx.fill();ctx.restore();}
  for(const w of X.wells){if(w.life<=0)continue;const k=w.on?1:.3;ctx.strokeStyle='#ff6b8a';ctx.lineWidth=1.5;ctx.globalAlpha=.07*k;ctx.setLineDash([4,10]);ctx.beginPath();ctx.arc(w.x,w.y,320,0,TAU);ctx.stroke();ctx.setLineDash([]);if(w.on)for(let i=0;i<2;i++){const r=320*((w.t*.9+i/2)%1);ctx.globalAlpha=.22*(r/320);ctx.beginPath();ctx.arc(w.x,w.y,r,0,TAU);ctx.stroke();}
    glow(w.x,w.y,40,'#ff6b8a',.5*k);ctx.fillStyle='#1a0812';ctx.globalAlpha=1;ctx.beginPath();ctx.arc(w.x,w.y,12,0,TAU);ctx.fill();ctx.strokeStyle='#ff9fb8';ctx.stroke();}
  ctx.globalAlpha=1;
  for(const s of X.spores){const k=Math.min(1,s.t/1);ctx.fillStyle='#ffd0e0';ctx.globalAlpha=.12*k;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,TAU);ctx.fill();ctx.globalAlpha=.4*k;ctx.strokeStyle='#ffd0e0';ctx.setLineDash([3,6]);ctx.stroke();ctx.setLineDash([]);
    for(let i=0;i<6;i++){const a=t*.7+i;ctx.fillRect(s.x+Math.cos(a)*s.r*.6,s.y+Math.sin(a*1.3)*s.r*.6,2,2);}}
  ctx.globalAlpha=1;
  for(const m of X.milk){glow(m.x,m.y,22,'#ffe0ea',.6+.3*Math.sin(t*5));ctx.fillStyle='#ffe0ea';ctx.beginPath();ctx.arc(m.x,m.y,6,0,TAU);ctx.fill();}}
// --- отрисовка: над врагами ---
function d74Draw(t){const X=G.world?G.w74r:G.x74;if(!X)return;const p=G.player;
  for(const q of X.tracers){ctx.strokeStyle=q.c||'#e6eef8';ctx.globalAlpha=Math.min(1,q.t*6);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(q.x1,q.y1);ctx.lineTo(q.x2,q.y2);ctx.stroke();}ctx.globalAlpha=1;
  for(const s of X.strips){const W_=s.hor?W:s.w,H_=s.hor?s.w:H,x0=s.hor?0:s.pos-s.w/2,y0=s.hor?s.pos-s.w/2:0;
    if(s.t<0){if(G.noTele&&s.t<-1)continue;ctx.fillStyle='#ff4f6e';ctx.globalAlpha=.08+.1*(Math.sin(t*16)>0?1:0);ctx.fillRect(x0,y0,W_,H_);ctx.globalAlpha=.6;ctx.strokeStyle='#ff4f6e';ctx.setLineDash([10,8]);ctx.strokeRect(x0,y0,W_,H_);ctx.setLineDash([]);}
    else{ctx.globalCompositeOperation='lighter';ctx.fillStyle='#ffd0a0';ctx.globalAlpha=.6*(1-s.t/.4);ctx.fillRect(x0,y0,W_,H_);ctx.globalCompositeOperation='source-over';}}
  ctx.globalAlpha=1;
  for(const e of G.enemies){if(!e.alive)continue;
    if(e.type==='membrane'&&e.spawnT<=0){const s=memSeg(e);ctx.strokeStyle=e.shieldFlash>0?'#ffffff':'#ff8fa8';ctx.globalAlpha=.75;ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(s[0],s[1]);ctx.quadraticCurveTo(e.x+Math.cos(e.wa+Math.PI/2)*10*Math.sin(t*4),e.y+Math.sin(e.wa+Math.PI/2)*10*Math.sin(t*4),s[2],s[3]);ctx.stroke();ctx.lineWidth=2;ctx.strokeStyle='#ffe0ea';ctx.globalAlpha=.6;ctx.stroke();ctx.lineCap='butt';ctx.globalAlpha=1;}
    if(e.type==='cord'&&e.mate&&e.mate.alive&&!e.cut&&e.uid<e.mate.uid&&e.spawnT<=0){ctx.strokeStyle='#ff7fa0';ctx.globalAlpha=.7;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(e.x,e.y);const mx=(e.x+e.mate.x)/2+Math.sin(t*3)*14,my=(e.y+e.mate.y)/2+Math.cos(t*3)*14;ctx.quadraticCurveTo(mx,my,e.mate.x,e.mate.y);ctx.stroke();ctx.globalAlpha=1;}
    if(e.type==='singer'&&e.spawnT<=0){const r=220*((e.sing||0)%1.6)/1.6;ctx.strokeStyle='#ffd0e0';ctx.globalAlpha=.35*(1-r/220);ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,r,0,TAU);ctx.stroke();ctx.globalAlpha=.12;ctx.setLineDash([2,8]);ctx.beginPath();ctx.arc(e.x,e.y,220,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}
    if(e.type==='cocoon'&&e.hatchMax){const k=1-Math.max(0,e.hatchT)/e.hatchMax;ctx.strokeStyle='#ffe0ea';ctx.lineWidth=2;ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(e.x,e.y,e.r+6,-Math.PI/2,-Math.PI/2+TAU*k);ctx.stroke();ctx.globalAlpha=1;}
    if(e.type==='embryo'){const k=(e.grow||0)/(e.fast?10:20);ctx.strokeStyle='#ffb84d';ctx.lineWidth=2;ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(e.x,e.y,e.r+6,-Math.PI/2,-Math.PI/2+TAU*k);ctx.stroke();ctx.globalAlpha=1;}
    if(e.type==='signaller'&&e.sc!==undefined&&e.sc<=3&&e.spawnT<=0){ctx.font='700 14px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillStyle='#9fd8ff';ctx.fillText(String(Math.max(1,Math.ceil(e.sc))),e.x,e.y-e.r-12);}
    if(e.type==='fireship'&&p&&Math.hypot(p.x-e.x,p.y-e.y)<300&&!G.noTele){ctx.strokeStyle='#ff7a3d';ctx.globalAlpha=.25+.25*Math.sin(t*14);ctx.lineWidth=1.5;ctx.setLineDash([5,6]);ctx.beginPath();ctx.arc(e.x,e.y,180,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}
    if(e.type==='battery'&&!e.eng&&e.ch>0&&!G.noTele){ctx.fillStyle='#ff4f6e';ctx.globalAlpha=.18;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.arc(e.x,e.y,260,e.face-Math.PI/4,e.face+Math.PI/4);ctx.closePath();ctx.fill();ctx.globalAlpha=1;}
    if(e.type==='linkor'&&e.bs&&!G.noTele){const a=e.ang+e.bs.side*Math.PI/2;ctx.strokeStyle='#ff4f6e';ctx.globalAlpha=.4+.4*Math.sin(t*20);ctx.lineWidth=3;ctx.beginPath();for(const ox of [-60,0,60]){const x=e.x+Math.cos(e.ang)*ox+Math.cos(a)*30,y=e.y+Math.sin(e.ang)*ox+Math.sin(a)*30;ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*160,y+Math.sin(a)*160);}ctx.stroke();ctx.globalAlpha=1;}
    if(e.teo&&e.spawnT<=0)worldLabel(e.x,e.y-e.r-14,'ТЕО','#8fe9ff');
    if(e.n74&&e.spawnT<=0)worldLabel(e.x,e.y-e.r-14,e.n74==='tow'?'ПОХОРОННЫЙ КОНВОЙ':'ПОВИТУХА','#ffb84d');}
  if(!G.world&&G.x74){const ev=G.x74.ev;
    if(ev.flag&&ev.flag.on){const F=ev.flag;glow(F.x,F.y,70,'#b8c4d6',.35);ctx.strokeStyle='#d6dee8';ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.lineDashOffset=-t*20;ctx.beginPath();ctx.arc(F.x,F.y,70,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;
      ctx.lineWidth=4;ctx.beginPath();ctx.arc(F.x,F.y,78,-Math.PI/2,-Math.PI/2+TAU*F.p/12);ctx.stroke();ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(F.x,F.y+18);ctx.lineTo(F.x,F.y-22);ctx.stroke();ctx.fillStyle='#d6dee8';ctx.fillRect(F.x,F.y-22,16,10);worldLabel(F.x,F.y-34,'ФЛАГ · '+Math.ceil(12-F.p)+' С','#d6dee8');}
    if(ev.box&&ev.box.on){const B=ev.box;if(!B.got){glow(B.x,B.y,30,'#ffd36b',.6);ctx.fillStyle='#1a1408';ctx.strokeStyle='#ffd36b';ctx.lineWidth=2;ctx.fillRect(B.x-9,B.y-7,18,14);ctx.strokeRect(B.x-9,B.y-7,18,14);worldLabel(B.x,B.y-20,'ЧЁРНЫЙ ЯЩИК','#ffd36b');}
      ctx.strokeStyle='#ffd36b';ctx.globalAlpha=.6;ctx.setLineDash([5,5]);ctx.beginPath();ctx.arc(B.ex,B.ey,60,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;worldLabel(B.ex,B.ey-70,'ВЫХОД','#ffd36b');}}
  if(G.jr74&&p&&p.hp>0){const J=G.jr74;ctx.save();ctx.translate(J.x,J.y);ctx.rotate(J.a+Math.PI/2);glow(0,0,14,'#ff9fb8',.5);ctx.fillStyle='rgba(255,159,184,.35)';ctx.strokeStyle='#ff9fb8';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-6,-5);ctx.lineTo(-3,0);ctx.lineTo(-6,5);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
  sb74ExtraDraw(t);}
// --- рисунки новых врагов (default в drawEnemy, начало координат — центр врага) ---
function drawE74(e,t,icon,col,face,alpha,P){const r=e.r;if(drawE80(e,t,icon,col,face,alpha,P))return;
  switch(e.type){
    case 'cocoon':{const k=e.hatchMax?1-Math.max(0,e.hatchT)/e.hatchMax:0,s=1+.08*Math.sin(t*(4+k*8));ctx.scale(s,s*1.15);ctx.fillStyle='rgba(60,14,30,.9)';ctx.beginPath();ctx.ellipse(0,0,r*.8,r,0,0,TAU);ctx.fill();ctx.stroke();
      glow(0,0,r*1.2,'#ffe0ea',.25+.6*k);ctx.strokeStyle='rgba(255,224,234,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-r*.5,-r*.4);ctx.quadraticCurveTo(0,0,r*.4,r*.5);ctx.stroke();break;}
    case 'unborn':ctx.rotate(face);ctx.beginPath();ctx.moveTo(r,0);ctx.quadraticCurveTo(0,-r,-r,-r*.3);ctx.quadraticCurveTo(-r*.4,0,-r,r*.3);ctx.quadraticCurveTo(0,r,r,0);ctx.closePath();ctx.fill();ctx.stroke();break;
    case 'pestun':{ctx.rotate(face);ctx.beginPath();ctx.ellipse(0,0,r,r*.7,0,0,TAU);ctx.fill();ctx.stroke();const n=e.carry===undefined?2:e.carry;ctx.fillStyle='#ff9fb8';for(let i=0;i<n;i++){ctx.beginPath();ctx.ellipse(-r*.3+i*r*.6,r*.75,4,6,0,0,TAU);ctx.fill();}
      ctx.strokeStyle=col;ctx.lineWidth=1.5;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(-r*.2,s*r*.6);ctx.quadraticCurveTo(-r*.8,s*r*1.4*(1+.2*Math.sin(t*8)),-r*1.2,s*r*.7);ctx.stroke();}break;}
    case 'membrane':ctx.beginPath();ctx.arc(0,0,r*.7,0,TAU);ctx.fill();ctx.stroke();break;
    case 'cord':ctx.rotate(t*1.5);ctx.beginPath();for(let i=0;i<=12;i++){const a=i/12*TAU,rr=r*(1+.15*Math.sin(a*3+t*4));ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,3,0,TAU);ctx.fill();break;
    case 'singer':{ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.stroke();ctx.strokeStyle=col;ctx.lineWidth=1.2;for(let i=0;i<3;i++){const a=t*2+i*TAU/3;ctx.beginPath();ctx.arc(0,0,r*.55,a,a+.8);ctx.stroke();}glow(0,0,r,'#ffd0e0',.4+.3*Math.sin(t*6));break;}
    case 'sporer':{ctx.beginPath();for(let i=0;i<=10;i++){const a=i/10*TAU,rr=r*(i%2?.7:1.05);ctx.lineTo(Math.cos(a+t)*rr,Math.sin(a+t)*rr);}ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle=col;for(let i=0;i<3;i++){const a=t*2+i*2.1;ctx.fillRect(Math.cos(a)*r*1.3,Math.sin(a)*r*1.3,2,2);}break;}
    case 'absorber':{const rr=e.r||r,k=(e.ab||0)/25;ctx.fillStyle='#2a0a24';ctx.beginPath();ctx.arc(0,0,rr,0,TAU);ctx.fill();ctx.stroke();glow(0,0,rr*1.2,'#ff9fe0',.25+.6*k);ctx.strokeStyle='#ff9fe0';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,rr*.55,-Math.PI/2,-Math.PI/2+TAU*k);ctx.stroke();break;}
    case 'embryo':{const k=Math.min(1,(e.grow||0)/(e.fast?10:20));ctx.scale(1+k*.6,1+k*.6);ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.stroke();ctx.strokeStyle='#ffb84d';ctx.globalAlpha=alpha*(.3+.7*k);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r+3,-1,1);ctx.stroke();break;}
    case 'lastkind':{ctx.rotate(face);ctx.beginPath();ctx.ellipse(0,0,r*1.3,r*.8,0,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle='#ffe0ea';for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(-r*.6+i*r*.3,0,4,6,0,0,TAU);ctx.fill();}glow(0,0,r*1.4,'#ffe0ea',.3);break;}
    case 'vent':{const k=.5+.5*Math.sin(t*5);ctx.fillStyle='#1a0812';ctx.beginPath();for(let i=0;i<=10;i++){const a=i/10*TAU,rr=r*(1+.2*Math.sin(a*4+t*3));ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.stroke();glow(0,0,r*1.6,'#ff6b8a',.3+.4*k);if(!icon&&e.vh>0){ctx.strokeStyle='#ffffff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r+6,-Math.PI/2,-Math.PI/2+TAU*e.vh);ctx.stroke();}break;}
    case 'womb':{const s=1+.1*Math.sin(t*5.2);ctx.scale(s,s);ctx.fillStyle='#2a0a16';ctx.beginPath();ctx.ellipse(0,0,r,r*.8,0,0,TAU);ctx.fill();ctx.stroke();glow(0,0,r,'#ff6b8a',.5);if(!icon&&e.cut>0){ctx.strokeStyle='#ffffff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r+6,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,e.cut/2));ctx.stroke();}break;}
    case 'nurse':{const b=!icon&&G.sb===e?e:null,open=b&&nuOpen(b);const k=icon?.55:1;ctx.scale(k,k);const R=r*(1+.05*Math.sin(t*TAU/1.2));
      ctx.fillStyle='#24060f';ctx.strokeStyle=open||e.flash>0?'#ffffff':col;ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<=24;i++){const a=i/24*TAU,rr=R*(1+.07*Math.sin(a*5+t*2));ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='#ff9fb8';ctx.lineWidth=1.5;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,0,R*(.35+i*.2),t*(i%2?1:-1),t*(i%2?1:-1)+4);ctx.stroke();}
      if(b&&(b.phase===3||b.st==='final')){glow(0,0,R*.6,'#8fe9ff',.7+.2*Math.sin(t*6));ctx.strokeStyle='#8fe9ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(20,0);ctx.lineTo(-12,-12);ctx.lineTo(-6,0);ctx.lineTo(-12,12);ctx.closePath();ctx.stroke();}
      else{glow(0,0,R*.5,open?'#ffffff':'#ff6b8a',open?.9:.5);}
      if(b&&!open&&b.st!=='dying'){ctx.strokeStyle=e.domeFlash>0?'#ffffff':'#ff6b8a';ctx.globalAlpha=alpha*.4;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,R+12,0,TAU);ctx.stroke();ctx.globalAlpha=alpha;}break;}
    case 'autopilot':ctx.rotate(face);ctx.beginPath();ctx.moveTo(r,0);ctx.lineTo(-r*.6,-r*.9);ctx.lineTo(-r*.2,0);ctx.lineTo(-r*.6,r*.9);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle=G.flag74T>0?'#7affc9':'#ff4f6e';ctx.fillRect(-r*.5,-1.5,3,3);break;
    case 'battery':{ctx.rotate(e.face||0);if(e.eng){ctx.fillRect(-r*.7,-r*.5,r*1.2,r);ctx.strokeRect(-r*.7,-r*.5,r*1.2,r);if(!icon){glow(-r,0,12,'#8fe9ff',.4+.3*Math.sin(t*20));}break;}
      ctx.beginPath();ctx.arc(0,0,r*.75,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle=e.ch>0?'#ffffff':col;for(const o of [-5,0,5])ctx.fillRect(4,o-1.5,r+4,3);break;}
    case 'boarder':ctx.rotate(face);ctx.beginPath();ctx.moveTo(r,0);ctx.lineTo(0,-r);ctx.lineTo(-r,0);ctx.lineTo(0,r);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.beginPath();for(const s of [-1,1]){ctx.moveTo(r*.5,s*r*.4);ctx.lineTo(r*1.3,s*r*.7);}ctx.stroke();break;
    case 'fireship':{ctx.rotate(e.face!==undefined?e.face:face);ctx.fillRect(-r,-r*.6,r*1.8,r*1.2);ctx.strokeRect(-r,-r*.6,r*1.8,r*1.2);glow(0,0,r*1.2,'#ff7a3d',.5+.3*Math.sin(t*(6+(e.ft||0))));ctx.fillStyle='#ffb07a';ctx.beginPath();ctx.arc(0,0,4,0,TAU);ctx.fill();
      if(!icon&&SET.fx&&Math.random()<.4)part(e.x,e.y,rnd(-30,30),rnd(-30,30),.4,'#ff7a3d',2);break;}
    case 'signaller':ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.stroke();ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,-r);ctx.lineTo(0,-r-10);ctx.stroke();for(let i=1;i<=2;i++){ctx.globalAlpha=alpha*(.6-i*.2+.2*Math.sin(t*6));ctx.beginPath();ctx.arc(0,-r-10,i*5,-2.4,-.7);ctx.stroke();}ctx.globalAlpha=alpha;break;
    case 'turncoat':{ctx.rotate(e.face||0);ctx.beginPath();ctx.moveTo(r*1.3,0);ctx.lineTo(r*.4,-r*.7);ctx.lineTo(-r,-r*.6);ctx.lineTo(-r,r*.6);ctx.lineTo(r*.4,r*.7);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle=e.shieldFlash>0?'#ffffff':'#ffb84d';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-r*.8,-r*.75);ctx.lineTo(r*.3,-r*.85);ctx.moveTo(-r*.8,r*.75);ctx.lineTo(r*.3,r*.85);ctx.stroke();ctx.lineWidth=2;break;}
    case 'cadet':ctx.rotate(face);ctx.beginPath();ctx.moveTo(r,0);ctx.lineTo(-r*.7,-r*.6);ctx.lineTo(-r*.7,r*.6);ctx.closePath();ctx.fill();ctx.stroke();break;
    case 'linkor':{ctx.rotate(e.ang||0);ctx.fillStyle='#10151f';ctx.beginPath();ctx.moveTo(110,0);ctx.lineTo(70,-38);ctx.lineTo(-110,-34);ctx.lineTo(-120,0);ctx.lineTo(-110,34);ctx.lineTo(70,38);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(214,222,232,.35)';ctx.lineWidth=1;for(let i=-4;i<=3;i++){ctx.beginPath();ctx.moveTo(i*24,-30);ctx.lineTo(i*24,30);ctx.stroke();}ctx.fillStyle=col;ctx.fillRect(-12,-12,24,24);break;}
    case 'echoship':case 'echoguard':ctx.globalAlpha=alpha*.45;ctx.rotate(e.type==='echoship'?0:Math.PI);ctx.beginPath();ctx.moveTo(r,0);ctx.lineTo(-r*.7,-r*.7);ctx.lineTo(-r*.7,r*.7);ctx.closePath();ctx.stroke();break;
    case 'fpart':{const h=e.host;ctx.rotate(h?h.ang:0);const ro=e.role;if(ro==='nose'){ctx.beginPath();ctx.moveTo(r*1.4,0);ctx.lineTo(-r,-r);ctx.lineTo(-r,r);ctx.closePath();ctx.fill();ctx.stroke();}
      else if(ro==='engL'||ro==='engR'){ctx.fillRect(-r,-r*.6,r*1.6,r*1.2);ctx.strokeRect(-r,-r*.6,r*1.6,r*1.2);if(!icon)glow(-r-4,0,16,'#8fe9ff',.6+.3*Math.sin(t*25));}
      else{ctx.beginPath();ctx.arc(0,0,r*.85,0,TAU);ctx.fill();ctx.stroke();const sd=ro==='batR'?1:-1;ctx.fillStyle=col;for(const o of [-8,0,8])ctx.fillRect(o-1.5,sd>0?4:-r-6,3,r+2);}
      break;}
    case 'flagship':{const b=!icon&&G.sb===e?e:null;ctx.rotate(icon?0:(e.ang||0));const k=icon?.18:1;ctx.scale(k,k);ctx.fillStyle='#0e131c';ctx.strokeStyle=col;ctx.lineWidth=3/k;
      ctx.beginPath();ctx.moveTo(150,0);ctx.lineTo(110,-46);ctx.lineTo(-130,-44);ctx.lineTo(-150,0);ctx.lineTo(-130,44);ctx.lineTo(110,46);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(214,222,232,.3)';ctx.lineWidth=1;for(let i=-5;i<=4;i++){ctx.beginPath();ctx.moveTo(i*24,-38);ctx.lineTo(i*24,38);ctx.stroke();}
      const open=b&&b.phase>=3;ctx.fillStyle=open?'#ffffff':'#2a3446';ctx.strokeStyle=open||e.flash>0?'#ffffff':col;ctx.lineWidth=2;ctx.fillRect(-18,-18,36,36);ctx.strokeRect(-18,-18,36,36);glow(0,0,26,open?'#ffffff':'#b8c4d6',open?.8:.3);
      if(b&&(b.inv0>0||b.st==='enter'||b.st==='final')){ctx.strokeStyle=e.domeFlash>0?'#ffffff':'#b8c4d6';ctx.globalAlpha=alpha*.3;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,170,64,0,0,TAU);ctx.stroke();ctx.globalAlpha=alpha;}break;}
    default:ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.stroke();}}
