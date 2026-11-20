// ===== 0.8.0: сектора VII «Предел» и VIII «Исток» — поведение, мир, звук =====
const S80T=new Set(['labrat','defect','inspector','railshield','stamp','recycler','echo80','loop','inverse','pilgrim','rangedummy','convoybox']);
S80T.forEach(k=>H74.add(k));S80T.forEach(k=>STORY_NORETREAT.add(k));['pilgrim','rangedummy','convoybox'].forEach(k=>AIM_SKIP75.add(k));
const DEF_MODES80=['shoot','ram','mine','guard'],DEF_COL80={shoot:'#ffd36b',ram:'#ff4f6e',mine:'#ff9a3d',guard:'#9fb0c4'},DEF_TXT80={shoot:'СТРЕЛОК',ram:'ТАРАН',mine:'МИНЁР',guard:'СТОРОЖ'};
const VOICES80=['«…вы тоже слышали? Не ответ. Вопрос…»','«…мы не первые. Мы не последние. Мы — те, кто дошёл…»','«…Стражи спрашивали то же самое. Им ответили. Им не понравилось…»','«…номер не важен. Важно, что сигнал повторяется…»',
  '«…я помнил небо. Потом помнил только курс…»','«…Исток не зовёт. Он просто не перестаёт звучать…»','«…если ты слышишь это — ты уже копия. Не бойся. Мы тоже…»','«…бюро считало нас изделиями. Изделия не уходят сами…»',
  '«…сто двадцать седьмой цикл. Или первый. Здесь это одно и то же…»','«…Карр тоже летит сюда. Он ещё не знает зачем…»','«…они назвали это «Пределом». Предел — это где кончается бюро. Не мы…»','«…последний голос. Дальше — только сигнал…»'];
function sec80(){const s=sec74();return s===6||s===7?s:-1;}
function d80H(k,txt,col){const H=G.h80||(G.h80={});if(H[k])return;H[k]=1;const p=G.player;if(p)floater(p.x,p.y-44,txt,col||'#e8d27a');}
function w80S(){const S=G.save;if(!S)return {clk:0,alarmAt:[0,0,0],rangeBest:0,seen:{},voices:0};const w=S.w80||(S.w80={clk:0,alarmAt:[0,0,0],rangeBest:0,seen:{},voices:0});w.alarmAt=w.alarmAt||[0,0,0];w.seen=w.seen||{};return w;}
function rankD80(){return curDiff().rank||0;}
// --- инициализация миссии ---
function t80Init(M){t85Init(M);t90Init(M);const sec=M&&M.gen?M.sec:-1;G.x80={sec,leaks:[],bo:null,pil:null,born:G.t};G.bo80=0;G.insp80=0;G.insp80By=null;G.inv80=0;G.slow80=0;G.stamp80=null;G.rcDrop80=0;G.rcLost80=0;G.echoQ80=[];G.echoSeq80=0;G.echoHitT80=-99;G.dmgN80=[];G.rcB80=[];G.echoBl80=[];G.res80=null;document.body.classList.remove('stamp80');
  if(G.mode==='endless'||!inMission()||(sec!==6&&sec!==7))return;const m=G.m,X=G.x80;
  if(!M.bossRoom&&m!==28&&m!==32&&m!==34&&m!==36&&!(sec===6&&G.mode==='world'&&storyFlag('line31')==='break'))X.bo={st:'wait',t:0};
  if(m===29||m===30){const n=m===29?1:2;for(let i=0;i<n;i++)X.leaks.push({x:n===1?W*.5:(i?W*.72:W*.3),y:n===1?H*.52:(i?H*.62:H*.4),r:Math.min(W,H)*(n===1?.22:.18)});}
  if(m===36||m===37)X.pil={at:m===36?20:30,done:false,hostile:false,tol:((G.save&&G.save.story&&G.save.story.spared||0)>=5?1:0)+(storyFlag('line31')==='write'?1:0)};}
// --- ИИ (из s74Update0; true = обработан) ---
const CAP80={labrat:2,railshield:2,recycler:1,inspector:2,echo80:2,loop:4,stamp:3,inverse:1};
function cap80(e){if(e.cap80||G.world||e.zone)return;e.cap80=1;const lim=CAP80[e.type];if(lim===undefined)return;const M=MISSIONS[G.m-1],L=e.type==='recycler'&&M&&M.bossRoom?2:lim;
  const n=G.enemies.filter(o=>o!==e&&o.alive&&o.type===e.type).length;if(n<L)return;const sec=M&&M.sec;let nt=sec===7?(e.type==='loop'?'phantom':'loop'):'defect';if(nt===e.type)nt='gunner';if(nt==='defect'&&G.enemies.filter(o=>o.alive&&o.type==='defect').length>=3)nt='gunner';
  if(CAP80[nt]!==undefined&&G.enemies.filter(o=>o!==e&&o.alive&&o.type===nt).length>=CAP80[nt])nt='gunner';const k=e.maxHp/EDEF[e.type].hp;e.type=nt;e.maxHp=e.hp=EDEF[nt].hp*k;e.r=EDEF[nt].r;e.contact=EDEF[nt].contact;e.cap80=1;}
function s80Update(e,dt,c){cap80(e);if(!S80T.has(e.type))return false;const p=G.player,{ux,uy,d,sm,T,pd}=c,pdx=p.x-e.x,pdy=p.y-e.y,dark=G.bo80>=.5;
  switch(e.type){
    case 'labrat':{let cx=0,cy=0,n=0;for(const o of G.enemies){if(o===e||!o.alive||o.type==='labrat'||EDEF[o.type].passive||STATIC.has(o.type)||Math.hypot(o.x-e.x,o.y-e.y)>600)continue;cx+=o.x;cy+=o.y;n++;}
      let tx,ty;if(n){cx/=n;cy/=n;const dx=cx-p.x,dy=cy-p.y,l=Math.hypot(dx,dy)||1;tx=cx+dx/l*120;ty=cy+dy/l*120;}else{const a=G.t*.5+e.seed;tx=p.x+Math.cos(a)*300;ty=p.y+Math.sin(a)*300;}
      const q=Math.hypot(tx-p.x,ty-p.y);if(q<260){tx=p.x+(tx-p.x)/(q||1)*280;ty=p.y+(ty-p.y)/(q||1)*280;}
      steer(e,tx-e.x,ty-e.y,e.spd*sm,dt,2.5);if(e.bcut>0)e.bcut-=dt;
      e.ht=(e.ht===undefined?.3:e.ht)-dt;if(e.hot>0)e.hot-=dt;if(e.ht<=0&&!(e.hot>0)){e.ht=.5;let best=e.beam&&e.beam.alive&&e.beam.healBy===e?e.beam:null,bk=best?best.hp/best.maxHp:1;if(!best)for(const o of G.enemies){if(o===e||!o.alive||o.spawnT>0||o.type==='labrat'||EDEF[o.type].passive||EDEF[o.type].sbp||STATIC.has(o.type)||o.type==='boss'||o.type==='loop'&&o.tr80>0||(o.healBy&&o.healBy!==e&&o.healBy.alive&&o.healBy.beam===o))continue;const k=o.hp/o.maxHp;if(k<bk&&Math.hypot(o.x-e.x,o.y-e.y)<300){bk=k;best=o;}}if(best!==e.beam)e.bt80=0;e.beam=best;if(best)best.healBy=e;}
      const b=e.beam;if(b&&(!b.alive||b.hp>=b.maxHp||Math.hypot(b.x-e.x,b.y-e.y)>340||e.bcut>0))e.beam=null;
      if(e.beam&&p.hp>0&&p.dashT>0&&segInter(p.px,p.py,p.x,p.y,e.x,e.y,e.beam.x,e.beam.y)){floater((e.x+e.beam.x)/2,(e.y+e.beam.y)/2-14,'ЛУЧ ПОРВАН','#7affc9');e.beam=null;e.bcut=1;if(G.mc)G.mc.beam80=1;}
      if(e.beam){const o=e.beam;e.bt80=(e.bt80||0)+dt;if(e.bt80>4){e.beam=null;e.hot=2;e.bt80=0;}else o.hp=Math.min(o.maxHp,o.hp+o.maxHp*(HEAVY.has(o.type)?.04:.06)*(rankD80()>=2?.6:1)*dt);}if(e.beam){d80H('labrat','ЛАБОРАНТ ЧИНИТ РАНЕНЫХ · СНАЧАЛА ЕГО','#7affc9');}return true;}
    case 'defect':{if(!e.mode){e.mode=DEF_MODES80[Math.floor(Math.random()*4)];e.mT=3;}e.mT-=dt;
      if(e.mT<=0){let nm;do{nm=DEF_MODES80[Math.floor(Math.random()*4)];}while(nm===e.mode);e.mode=nm;e.mT=3;e.rst=null;e.mined=0;e.bn=0;}
      const m_=e.mode;
      if(m_==='shoot'){const k=clamp((pd-300)/120,-1,1);steer(e,pdx/pd*k-pdy/pd*.6*e.dir,pdy/pd*k+pdx/pd*.6*e.dir,e.spd*sm,dt,3);
        if(e.bn>0){e.bt-=dt;if(e.bt<=0){e.bn--;e.bt=.15;shootE(e.x,e.y,Math.atan2(T.y-e.y,T.x-e.x)+rnd(-.06,.06),280,8,'#ffd36b',4,!!T.isBc);}}
        else{e.cd-=dt;if(e.cd<=0&&onScreen(e)&&p.hp>0&&(!dark||pd<520)){e.cd=1.6;e.bn=3;e.bt=0;}}}
      else if(m_==='ram'){if(!e.rst){e.rst='aim';e.rt=G.noTele?.5:.8;e.aim=Math.atan2(pdy,pdx);}
        if(e.rst==='aim'){e.vx*=.85;e.vy*=.85;if(e.rt>.22)e.aim+=clamp(angDiff(Math.atan2(pdy,pdx),e.aim),-1.5*dt,1.5*dt);e.rt-=dt;if(e.rt<=0){e.rst='go';e.rt=.6;}}
        else if(e.rst==='go'){e.vx=Math.cos(e.aim)*420;e.vy=Math.sin(e.aim)*420;e.rt-=dt;if(e.rt<=0)e.rst='rest';}
        else{e.vx*=.9;e.vy*=.9;}}
      else if(m_==='mine'){steer(e,-pdx/pd*.3-pdy/pd*e.dir,-pdy/pd*.3+pdx/pd*e.dir,e.spd*sm*.8,dt,2);
        if(!e.mined&&e.mT<2.4){e.mined=1;if(G.enemies.filter(o=>o.alive&&o.type==='mine'&&o.def80).length<4){const mn=spawnEnemy('mine',e.x,e.y,{arm:.95,fuse:0,life:12,noAffix:true,noLoot:true,def80:true});}}}
      else{e.vx*=.9;e.vy*=.9;}
      return true;}
    case 'inspector':{const k=clamp((pd-380)/120,-1,1);steer(e,pdx/pd*k-pdy/pd*.5*e.dir,pdy/pd*k+pdx/pd*.5*e.dir,e.spd*sm,dt,2);
      if(e.ca===undefined)e.ca=Math.atan2(pdy,pdx)+rnd(-1,1);if(!e.cdir)e.cdir=Math.random()<.5?-1:1;if(e.ct===undefined)e.ct=rnd(4,7);
      e.ct-=dt;if(e.ct<=0){e.ct=rnd(4,7);e.cdir*=-1;}e.ca+=.6*e.cdir*dt;if(e.cool80>0)e.cool80-=dt;
      const len=dark?260:420;e.clen=len;let see=false;
      if(p.hp>0&&pd<len&&Math.abs(angDiff(Math.atan2(pdy,pdx),e.ca))<.436&&e.spawnT<=0){see=true;const X=x74();if(X.hulls.length&&typeof hullBlocks75==='function'&&hullBlocks75(e.x,e.y,p.x,p.y))see=false;}
      const need=rankD80()===0?1.2:sbHard()?.5:.8;
      if(see)e.seeT=(e.seeT||0)+dt;else e.seeT=Math.max(0,(e.seeT||0)-dt*2);
      if(e.seeT>=need&&!(e.cool80>0)){e.seeT=0;e.cool80=5;insAlarm80(e);}
      e.cd-=dt;if(e.cd<=0&&onScreen(e)&&p.hp>0&&(!dark||pd<520)){e.cd=2.8;shootE(e.x,e.y,Math.atan2(T.y-e.y,T.x-e.x),240,8,'#ffd36b',4,!!T.isBc);}return true;}
    case 'railshield':{let cx=0,cy=0,n=0;for(const o of G.enemies){if(o===e||!o.alive||o.type==='railshield'||EDEF[o.type].passive||STATIC.has(o.type)||Math.hypot(o.x-p.x,o.y-p.y)>900)continue;cx+=o.x;cy+=o.y;n++;}
      if(!n){cx=e.x;cy=e.y;}else{cx/=n;cy/=n;}let dx=cx-p.x,dy=cy-p.y,l=Math.hypot(dx,dy);if(l<1){dx=e.x-p.x;dy=e.y-p.y;l=Math.hypot(dx,dy)||1;}
      const dist=clamp(l*.45,200,400),tx=p.x+dx/l*dist,ty=p.y+dy/l*dist;e.rail={x:tx,y:ty,ux:-dy/l,uy:dx/l};
      const q=Math.hypot(tx-e.x,ty-e.y);if(q>6)steer(e,tx-e.x,ty-e.y,Math.min(e.spd*sm,q*3),dt,3);else{e.vx*=.8;e.vy*=.8;}
      const fa=Math.atan2(p.y-e.y,p.x-e.x);e.fa=e.fa===undefined?fa:e.fa+clamp(angDiff(fa,e.fa),-2*dt,2*dt);return true;}
    case 'stamp':{if(e.sc>0)e.sc-=dt;const away=e.sc>0;
      if(away){const k=clamp((pd-220)/100,-1,1);steer(e,pdx/pd*k-pdy/pd*.7*e.dir,pdy/pd*k+pdx/pd*.7*e.dir,e.spd*sm,dt,3);}
      else{const w=Math.sin(e.t*5+e.seed)*.8;steer(e,pdx/pd-pdy/pd*w,pdy/pd+pdx/pd*w,e.spd*sm,dt,3);
        if(pd<e.r+p.r+4&&p.hp>0&&p.dashT<=0&&e.spawnT<=0){if(!G.stamp80&&p.inv<=0){G.stamp80={t:rankD80()===0?5:4,max:rankD80()===0?5:4};floater(p.x,p.y-34,'ПРОВЕРЕНО · СБРОСЬТЕ РЫВКОМ','#ff7a3d');buzz('hit');sfx('block');document.body.classList.add('stamp80');d80H('stamp','ШТАМП: РЫВОК ИЛИ ИМПУЛЬС СБРАСЫВАЮТ','#ff7a3d');}
          e.sc=G.stamp80?8:2;e.vx=-pdx/pd*320;e.vy=-pdy/pd*320;}}return true;}
    case 'recycler':{const k=clamp((pd-300)/90,-1,1);steer(e,pdx/pd*k-pdy/pd*.4*e.dir,pdy/pd*k+pdx/pd*.4*e.dir,e.spd*sm,dt,1.5);
      e.hopper=e.hopper||[];e.pt=(e.pt||0)-dt;
      if(e.pt<=0){e.pt=.25;const lim=G.rcLost80>=.3*Math.max(10,G.rcDrop80);if(!lim&&e.hopper.length<12){const mag=G.st?G.st.mag:0;let n=0;
          for(const k_ of G.pick){if(n>=6)break;if(k_.rc80||k_.anom||k_.story||k_.quest||k_.life<=0||(k_.k!=='xp'&&k_.k!=='lom'&&k_.k!=='cell'&&k_.k!=='part80'))continue;
            if(Math.hypot(k_.x-e.x,k_.y-e.y)>320)continue;if(p.hp>0&&Math.hypot(k_.x-p.x,k_.y-p.y)<mag+10)continue;k_.rc80=e;k_.noMag=true;n++;}}}
      if(e.fire80){e.fire80-=dt;if(e.fire80<=0){e.fire80=0;const n=Math.min(4,e.hopper.length);const a0=Math.atan2(T.y-e.y,T.x-e.x);
          for(let i=0;i<n;i++){const it=e.hopper.shift();const dmg=it.k==='lom'?Math.min(14,8+Math.floor((it.v||1)/10)):it.k==='part80'?12:6;const col=it.k==='lom'?'#ffb84d':it.k==='xp'?'#d9c8ff':it.k==='cell'?'#ffb84d':'#c9d2de';
            const b=shootE(e.x,e.y,a0+(i-(n-1)/2)*.14,260,dmg,col,it.k==='part80'?7:5,!!T.isBc);if(b){b.rc80=it;G.rcB80.push(b);}}sfx('shot');e.fT=2.4;if(G.mc&&n)G.mc.rcFired80=1;}}
      else{e.fT=(e.fT===undefined?2:e.fT)-dt;if(e.fT<=0&&e.hopper.length&&p.hp>0&&onScreen(e)&&(!dark||pd<520)){e.fire80=G.noTele?.5:.8;sfx('warn');}}return true;}
    case 'echo80':{const k=clamp((pd-420)/80,-1,1);let tx=null;const L=G.posLog;if(L&&L.length){for(let i=L.length-1;i>=0;i--){if(G.t-L[i].t>=3){tx=L[i];break;}}}
      if(tx&&pd>380){steer(e,(tx.x-e.x)*.6+pdx/pd*k*120,(tx.y-e.y)*.6+pdy/pd*k*120,e.spd*sm,dt,1.6);}else steer(e,pdx/pd*k-pdy/pd*.5*e.dir,pdy/pd*k+pdx/pd*.5*e.dir,e.spd*sm,dt,2);
      if(Math.random()<dt*.2)e.dir*=-1;e.born80=e.born80||G.t;return true;}
    case 'loop':{if(e.tr80>0){e.tr80-=dt;e.vx=e.vy=0;e.ghost=true;if(e.tr80<=0){e.tr80=0;e.ghost=false;e.hp=e.maxHp*(rankD80()>=2?.4:.5);e.lr80=(e.lr80||0)+1;e.win80=2.6;e.spawnT=.6;e.contact=e.contact0||10;if(e.lr80>=2&&G.mc)G.mc.loopBad80=1;sfx('warn');}return true;}
      if(e.win80>0)e.win80-=dt;
      if(pd>320){steer(e,pdx,pdy,e.spd*sm,dt,3);}else{steer(e,-pdy/pd*e.dir+pdx/pd*.2,pdx/pd*e.dir+pdy/pd*.2,e.spd*sm,dt,3);if(Math.random()<dt*.3)e.dir*=-1;}
      if(e.bn>0){e.bt-=dt;if(e.bt<=0){e.bn--;e.bt=.12;shootE(e.x,e.y,Math.atan2(T.y-e.y,T.x-e.x),300,8,'#6b8cff',4,!!T.isBc);}}
      else{e.cd-=dt;if(e.cd<=0&&onScreen(e)&&p.hp>0&&pd<520){e.cd=1.6;e.bn=2;e.bt=0;}}return true;}
    case 'inverse':{const k=clamp((pd-300)/80,-1,1);steer(e,pdx/pd*k-pdy/pd*.6*e.dir,pdy/pd*k+pdx/pd*.6*e.dir,e.spd*sm,dt,2.5);if(Math.random()<dt*.25)e.dir*=-1;
      if(e.it===undefined)e.it=4;
      if(e.iw){const w=e.iw;w.r+=500*dt;if(!w.hit&&p.hp>0&&Math.abs(Math.hypot(p.x-w.x,p.y-w.y)-w.r)<22){w.hit=true;if(p.dashT<=0){invHit80();}}if(w.r>=380)e.iw=null;}
      else if(e.itel>0){e.itel-=dt;e.vx*=.9;e.vy*=.9;if(e.itel<=0){e.itel=0;e.iw={x:e.x,y:e.y,r:e.r,hit:false};e.pulsed80=1;sfx('pulse');G.shock.push({x:e.x,y:e.y,r:e.r,R:380,t:0,col:'#e86bff',thin:true});}}
      else{e.it-=dt;if(e.it<=0&&onScreen(e)&&p.hp>0){e.it=7*(G.atkK||1);e.itel=sbHard()?.6:1.0;sfx('warn');}}return true;}
    case 'pilgrim':return pilgrimAI80(e,dt),true;
    case 'rangedummy':case 'convoybox':e.vx=e.vy=0;return true;}
  return false;}
function s80Pre(e,dt){if(e.alarm80&&alarmAI80(e,dt))return true;if(e.convoy80&&convoyAI80(e,dt))return true;if(e.audit80&&auditAI80(e,dt))return true;return false;}
function insAlarm80(e){G.insp80=5;G.insp80By=e;const p=G.player;for(const o of G.enemies)if(o.alive&&o!==e&&Math.hypot(o.x-e.x,o.y-e.y)<500)o.insB80=5;
  floater(p.x,p.y-38,'НАРУШЕНИЕ РЕГЛАМЕНТА · ВРАГИ СИЛЬНЕЕ','#ffd36b');buzz('ready');sfx('warn');if(G.mc)G.mc.seen80=1;
  if(e.audit80&&e.zone&&!e.zone.alarm){const z=e.zone;z.alarm=1;if(!z.stealth){radioLine('БЮРО','#e8d27a','Изделие вне партии. Квадрат '+(1+Math.floor(Math.abs(z.x+z.y)/700)%9)+'.',.1);const s=w74Sp(z,'stamp',e.x+rnd(-40,40),e.y+rnd(-40,40));}}}
function invHit80(){const p=G.player;if(G.inv80>0||G.slow80>0)return;if(SET.softInv){G.slow80=2;floater(p.x,p.y-34,'ИЗНАНКА · ЗАМЕДЛЕНИЕ','#e86bff');}else{G.inv80=2;if(!(G.h80&&G.h80.inv))floater(p.x,p.y-34,'ИЗНАНКА · УПРАВЛЕНИЕ НАОБОРОТ','#e86bff');G.h80=G.h80||{};G.h80.inv=1;}buzz('hit2');sfx('block');if(G.mc)G.mc.inv80=1;}
function inputK80(){return G.inv80>0&&!SET.softInv?-1:1;}
// --- урон ---
function s80Hurt(e,dmg,src){src=src||{};
  switch(e.type){
    case 'rangedummy':{rangeHit80(e,dmg,src);return 0;}
    case 'defect':return e.mode==='guard'?dmg*.6:dmg;
    case 'labrat':e.bcut=1;e.beam=null;return dmg;
    case 'pilgrim':if(e.pg85)return pil85Hurt(e,dmg,src);if(src.pulse&&G.world&&e.peace&&storyFlag('well38'))return 0;pilgrimHit80(e);return dmg;
    case 'convoybox':if(e.zone)e.zone.prov80=1;return dmg;}
  return dmg;}
function s80Killed(e,silent){const p=G.player;if(!e)return;const hop=e.hopper?e.hopper.length:0;
  if(e.type==='inspector'&&G.insp80By===e){G.insp80=0;G.insp80By=null;}
  if(e.type==='recycler')rcRelease80(e,silent);
  if(silent)return;
  if(G.bo80>=.5&&(inMission()||(G.world&&sec80()>=0))&&!EDEF[e.type].passive){conEvent('darkKill');if(G.mc)G.mc.dark80=(G.mc.dark80||0)+1;}
  if(G.world&&W80.alarm&&W80.alarm.st==='on'){const q=W80.pults[W80.alarm.i];if(q&&Math.hypot(e.x-q.x,e.y-q.y)<600&&!EDEF[e.type].passive){G.save.carry+=5;floater(e.x,e.y-20,'+5 · ТРЕВОГА','#ff7a3d');conEvent('alarmKill');}}
  switch(e.type){
    case 'defect':if(Math.random()<.25){if(G.world)G.pick.push({k:'lom',x:e.x,y:e.y,vx:rnd(-60,60),vy:rnd(-60,60),r:5,t:0,life:30,v:2});else for(let i=0;i<EDEF.defect.xp;i++)G.pick.push({k:'xp',x:e.x+rnd(-8,8),y:e.y+rnd(-8,8),vx:rnd(-90,90),vy:rnd(-90,90),r:5,t:0,life:22});floater(e.x,e.y-20,'ДЕТАЛЬ С БРАКОМ','#e8d27a');}break;
    case 'railshield':for(let i=0;i<3;i++)G.pick.push({k:'part80',x:e.x+rnd(-14,14),y:e.y+rnd(-14,14),vx:rnd(-80,80),vy:rnd(-80,80),r:6,t:0,life:12,noMag:true});break;
    case 'echo80':if(!(G.echoHitT80>(e.born80||0)))conEvent('echoClean');break;
    case 'loop':if(G.mc)G.mc.loopK80=(G.mc.loopK80||0)+1;if(e.lb80){if(!G.world)for(let i=0;i<Math.ceil(EDEF.loop.xp*.5);i++)G.pick.push({k:'xp',x:e.x+rnd(-8,8),y:e.y+rnd(-8,8),vx:rnd(-90,90),vy:rnd(-90,90),r:5,t:0,life:22});else G.save.carry+=3;floater(e.x,e.y-22,'ПЕТЛЯ РАЗОРВАНА','#6b8cff');if((e.lr80||0)<=1)conEvent('loopBreak');}else if(G.mc)G.mc.loopBad80=1;break;
    case 'inverse':if(!e.pulsed80)conEvent('inverseFast');break;
    case 'recycler':if(hop>=8)conEvent('recyclerFull');break;
    case 'pilgrim':{const S=G.save;if(S&&S.story)S.story.pilgrimsKilled=(S.story.pilgrimsKilled||0)+1;break;}}}
// перехват смерти Петли: след на 5 с
function loopIntercept80(e){if(e.tr80>0)return true;if(e.win80>0&&e.spawnT<=0){e.lb80=1;return false;}if((e.lr80||0)>=(rankD80()>=2?1:2))return false;
  e.tr80=5;e.ghost=true;e.hp=1;e.vx=e.vy=0;e.contact0=e.contact||10;e.contact=0;prioClear(e);explode(e.x,e.y,'#6b8cff',10,.6);
  if(!(G.h80&&G.h80.loop)){G.h80=G.h80||{};G.h80.loop=1;floater(e.x,e.y-24,'ПЕТЛЯ ВЕРНЁТСЯ · ДОБЕЙТЕ ЗА 2 С','#6b8cff');}return true;}
function loopBreak80(e){if(!e.alive||!(e.tr80>0))return;e.tr80=0;e.ghost=false;e.win80=99;e.spawnT=0;e.hp=0;kill(e);}
// --- снаряды игрока (до общих попаданий; true = поглощён) ---
function b80Hit(b){if(b85Hit(b))return true;if(b90Hit(b))return true;
  for(const e of G.enemies){if(!e.alive)continue;
    if(e.type==='railshield'&&e.spawnT<=0&&e.fa!==undefined){const ux=Math.cos(e.fa+Math.PI/2)*30,uy=Math.sin(e.fa+Math.PI/2)*30;
      if(segInter(b.px,b.py,b.x,b.y,e.x-ux,e.y-uy,e.x+ux,e.y+uy)){if(b.charged||b.blast){if(!b.hit.includes(e)){b.hit.push(e);hurt(e,b.dmg*1.5,{charged:!!b.charged,blast:!!b.blast});}continue;}
        hurt(e,b.dmg,{rail:true});b.life=0;e.shieldFlash=.08;if(SET.fx)part(b.x,b.y,vrnd3(-40,40),vrnd3(-40,40),.25,'#c9d2de',2);return true;}}
    if(e.type==='loop'&&e.tr80>0&&b.charged&&segDist(b.px,b.py,b.x,b.y,e.x,e.y)<e.r+10){loopBreak80(e);}}
  return false;}
// импульс: следы Петель, память Отзвуков, штамп
function pulse80(p,R){pulse85(p,R);pulse90(p,R);mod90Pulse(p);for(const e of G.enemies.slice()){if(e.type==='loop'&&e.tr80>0&&Math.hypot(e.x-p.x,e.y-p.y)<R+e.r)loopBreak80(e);}
  if(G.echoQ80&&G.echoQ80.length&&G.enemies.some(e=>e.alive&&e.type==='echo80'&&Math.hypot(e.x-p.x,e.y-p.y)<R+e.r)){G.echoQ80.length=0;if(G.mc)G.mc.echoWipe80=1;floater(p.x,p.y-30,'ПАМЯТЬ ОТЗВУКА СТЁРТА','#b48cff');}
  if(G.stamp80)stampOff80('ИМПУЛЬС');}
function stampOff80(how){G.stamp80=null;document.body.classList.remove('stamp80');const p=G.player;if(p)floater(p.x,p.y-30,'ШТАМП СБРОШЕН','#ff7a3d');conEvent('stampOff');}
// --- автоприцел (замена 0.7.5): веса новых целей, мишень полигона, радиус в темноте ---
/* ARCH·81 → aimPt перенесена в блок «ПОДСИСТЕМА НАВЕДЕНИЯ» после nearestEnemy */
function nearestEnemy(x,y,R,ignoreDecoy){
  if(!ignoreDecoy&&G.jam&&G.jam.phase===2){const dc=G.enemies.find(e=>e.type==='decoy'&&targetable(e));if(dc)return dc;}
  if(G.bo80>=.5)R=Math.min(R,380);
  let best=null,bd=R,ab=null,abd=R,dm=null;for(const e of G.enemies){if(e.type==='rangedummy'){if(e.alive)dm=e;continue;}
    if(!targetable(e)||(NOAUTO.has(e.type)&&!(e.type==='pilgrim'&&e.hostile80))||e.retreat||e.n74)continue;let d=Math.hypot(e.x-x,e.y-y)-e.r;
    if(e.type==='absorber'&&!e.tired){if(d<abd){abd=d;ab=e;}continue;}
    if(e.type==='membrane'){const q=aimPt(e);d=Math.hypot(q.x-x,q.y-y)*1.5;}
    else if(e.type==='railshield'){const q=aimPt(e);d=Math.hypot(q.x-x,q.y-y)*1.3;}
    else if(e.type==='labrat'&&e.beam)d*=.7;else if(e.type==='echo80')d*=.8;d*=aw90(e);
    if(d<bd){bd=d;best=e;}}
  if(!best&&ab)best=ab;
  if(!best&&dm&&G.world&&W80.range&&inRange80(x,y,200)&&dm.spawnT<=0&&Math.hypot(dm.x-x,dm.y-y)<R)best=dm;
  if(!best){for(const e of G.enemies){if((e.type==='mine'||e.type==='shell')&&targetable(e)){const d=Math.hypot(e.x-x,e.y-y);if(d<Math.min(bd,260)){bd=d;best=e;}}}}return best;}
