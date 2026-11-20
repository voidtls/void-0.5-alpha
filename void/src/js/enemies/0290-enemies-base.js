// ---------- Враги ----------
function spawnEnemy(type,x,y,o={}){
  const d=EDEF[type];
  const e=Object.assign({type,x,y,vx:0,vy:0,hp:d.hp,maxHp:d.hp,r:d.r,spd:d.spd*rnd(.92,1.08),contact:d.contact,alive:true,t:0,seed:rnd(0,TAU),flash:0,spawnT:0,
    cd:rnd(.8,2),st:'seek',timer:0,dir:Math.random()<.5?-1:1,face:0,shieldK:1,aim:0,uid:++G.uid,buff:1,stun:0,bcT:0,lureT:0,down:0,ghost:false},o);
  if(G.player&&(type==='guard'||type==='mirror'))e.face=Math.atan2(G.player.y-y,G.player.x-x);
  // группа
  if(G.bc&&!e.group){if(d.grp)e.group=d.grp;else if(d.act===1&&!d.passive&&!STATIC.has(type)&&type!=='seeker'){const R=MISSIONS[G.m-1].ratio;e.group=Math.random()<R.siege/(R.siege+R.hunt)?'siege':'hunt';}}
  // аффиксы
  if(AFX_OK.has(type)&&!o.noAffix&&(o.elite||(G.affixCh&&Math.random()<G.affixCh))){const keys=shuffle(Object.keys(AFX));e.affix=[keys[0]];if(o.elite||Math.random()<(G.affix2||0))e.affix.push(keys[1]);
    if(e.affix.includes('armor'))e.armor=3;if(e.affix.includes('fast'))e.spd*=1.35;}
  if(type==='hunter')e.seen=G.t;
  if(inMission()&&!d.passive&&cycHp()>1){e.hp*=cycHp();e.maxHp=e.hp;}
  if(inMission()&&!d.passive&&!d.sb&&!d.fixed&&MISSIONS[G.m-1]&&MISSIONS[G.m-1].hpMul){e.hp*=MISSIONS[G.m-1].hpMul;e.maxHp=e.hp;}
  if(inMission()&&!d.passive){const hk=missionK('hp');if(hk!==1){e.hp*=hk;e.maxHp=e.hp;}}
  {const SS=secScale()||(G.world&&!o.noSec?worldSS(x,y):null);if(SS&&!d.passive&&!d.sb&&!d.fixed&&type!=='boss'&&type!=='jam'){e.hp*=SS.hp;e.spd*=secSpdK(SS,inMission()?curDiff():DIFF.easy);if(SEC_CHASER.has(type)&&G.st)e.spd=Math.min(e.spd,G.st.speed*1.10);e.cd*=atkK();e.secArm=SS.arm;if(e.hp>d.hp*8)e.hp=d.hp*8;e.maxHp=e.hp;}}
  if(G.mode==='endless'&&G.end&&!d.passive&&type!=='boss'&&type!=='jam'){e.hp*=G.end.hpMul;e.maxHp=e.hp;e.spd*=G.end.spdMul;}
  if(!d.passive){const k129=hpX129();if(k129!==1){e.hp*=k129;e.maxHp*=k129;}}
  if(type==='boss'||type==='jam'){if(G.bossMul){e.hp*=G.bossMul;e.maxHp=e.hp;}e.th=[e.maxHp*2/3,e.maxHp/3,0];}
  if(type==='twin'&&o.pair){const mate=G.enemies.find(q=>q.type==='twin'&&q.pair===o.pair&&q.alive&&!q.mate);if(mate){mate.mate=e;e.mate=mate;}}
  if(G.x90&&inMission()&&(G.x90.sec===8||G.x90.sec===9))e.cg95=G.t+(e.spawnT||0)+.6;
  G.enemies.push(e);
  if(type==='cruiser'){e.ang=Math.atan2(H/2-y,W/2-x);e.parts=[];[['eng',-34,-16],['eng',-34,16],['gun',35,0]].forEach(([role,ox,oy])=>{const q=spawnEnemy('cpart',x,y,{role,ox,oy,host:e,group:'siege',noAffix:true});e.parts.push(q);});}
  if(d.desc&&!REC.seen.includes(type)){REC.seen.push(type);saveRec();}
  return e;
}
function edgeSpawn(type,o={}){if(spawn95(type,o))return;if(spawn110(type,o))return;
  const p=G.player;let x,y,mx,my,tries=0;
  do{const s=o.side!==undefined?o.side:Math.random()*4|0;const u=clamp(o.u!==undefined?o.u:Math.random(),.03,.97);
    if(s===0){x=u*W;y=-34;mx=x;my=22;}else if(s===1){x=W+34;y=u*H;mx=W-22;my=y;}else if(s===2){x=u*W;y=H+34;mx=x;my=H-22;}else{x=-34;y=u*H;mx=22;my=y;}
  }while(o.side===undefined&&Math.hypot(mx-p.x,my-p.y)<240&&++tries<8);
  G.warns.push({x,y,mx,my,type,t:.7+(o.delay||0),o});
}
function steer(e,dx,dy,spd,dt,k){const l=Math.hypot(dx,dy)||1;const q=Math.min(1,k*dt*(e.slick?.3:1));e.vx+=(dx/l*spd-e.vx)*q;e.vy+=(dy/l*spd-e.vy)*q;}
const onScreen=e=>e.x>CX&&e.x<CX+W&&e.y>CY&&e.y<CY+H;
function enemyTarget(e){{const q90=cloak90(e)||witT100(e)||door90(e);if(q90)return q90;}
  const p=G.player,bc=G.bc;if(e.boatAtk&&G.w74b&&G.w74b.alive)return G.w74b;if(e.tugAtk&&G.w&&G.w.tug&&G.w.tug.alive&&G.w.tug.st!=='rob')return G.w.tug;
  if(!bc||!e.group)return p;
  if(e.group==='siege'){
    if(G.fake&&e.uid%2===0)return G.fake;
    if(!EDEF[e.type].noRet&&p.hp>0&&Math.hypot(p.x-e.x,p.y-e.y)<110)return p;
    return bc;}
  if(e.group==='hunt'){if(G.lureP)return G.lureP;if(e.lureT>0)return bc;}
  return p;
}
function settle(e,dt,margin){if(e.sx===undefined){e.sx=clamp(e.x,margin,W-margin);e.sy=clamp(e.y,margin,H-margin);}
  const dx=e.sx-e.x,dy=e.sy-e.y;if(Math.hypot(dx,dy)>6)steer(e,dx,dy,110,dt,3);else{e.vx*=.8;e.vy*=.8;}}
function updateEnemies(dt){
  G.eSpd=inMission()?(curDiff().spd||1)*missionK('spd'):1;G.atkK=atkK()/missionK('rate');
  const p=G.player,bc=G.bc;
  for(const e of G.enemies){e.shieldK=1;e.linkBy=null;e.buff=1;}
  for(const s of G.enemies){if(s.type!=='shielder'||!s.alive)continue;s.links=[];
    const c=PERF.off['O-3']?G.enemies.filter(o=>o.alive&&o!==s&&o.type!=='shielder'&&!HEAVY.has(o.type)&&o.type!=='moth'&&Math.hypot(o.x-s.x,o.y-s.y)<240).sort((a,b)=>Math.hypot(a.x-s.x,a.y-s.y)-Math.hypot(b.x-s.x,b.y-s.y)).slice(0,3):o3Near(s);/* PERF·OPT O-3 */
    for(const o of c){o.shieldK=.35;o.linkBy=s;s.links.push(o);}}
  for(const c of G.enemies){if(c.type!=='commander'||!c.alive||c.spawnT>0)continue;{const f3=!PERF.off['O-3'],cx=c.x,cy=c.y;for(const o of G.enemies){if(f3){const dx=o.x-cx,dy=o.y-cy;if(dx>=220||dx<=-220||dy>=220||dy<=-220)continue;}if(o!==c&&o.alive&&!HEAVY.has(o.type)&&Math.hypot(o.x-c.x,o.y-c.y)<220)o.buff=1.25;}}/* PERF·OPT O-3 */}s74Buffs();buffs90();
  const gm=G.flare>0?1.25:1;
  for(const e of G.enemies){
    if(!e.alive)continue;
    e.t+=dt;if(e.flash>0)e.flash-=dt;if(e.shieldFlash>0)e.shieldFlash-=dt;if(e.bcT>0)e.bcT-=dt;if(e.lureT>0)e.lureT-=dt;
    if(e.spawnT>0){e.spawnT-=dt;if(e.type==='pylon'&&G.boss){e.x=G.boss.x+Math.cos(e.orb)*e.R;e.y=G.boss.y+Math.sin(e.orb)*e.R*.8;}continue;}
    if(e.down>0){e.down-=dt;e.vx*=.9;e.vy*=.9;e.x+=e.vx*dt;e.y+=e.vy*dt;if(e.down<=0){e.hp=e.maxHp*.5;floater(e.x,e.y-20,'ВОССТАНОВЛЕН','#ff6bd0');}continue;}
    if(e.stun>0&&!STATIC.has(e.type)){e.stun-=dt;e.vx*=.9;e.vy*=.9;e.x+=e.vx*dt;e.y+=e.vy*dt;continue;}
    if(e.retreat){storyRetreatMove(e,dt);continue;}
    const dtS=dt;if(e.tK&&e.tK!==1)dt=dt*e.tK;
    const T=enemyTarget(e);
    const dx=T.x-e.x,dy=T.y-e.y,d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d;
    const pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1;
    const sm=e.buff*gm,toBc=!!T.isBc;
    const cd0=e.cd;G.curE=e;
    if(!secEnemyUpdate(e,dt,{ux,uy,d,sm,T,pd}))switch(e.type){
      case 'scout':case 'mite':{const w=Math.sin(e.t*3+e.seed)*.55;steer(e,ux-uy*w,uy+ux*w,e.spd*sm,dt,3.5);break;}
      case 'gunner':{const m=clamp((d-270)/120,-1,1);steer(e,ux*m-uy*.6*e.dir,uy*m+ux*.6*e.dir,e.spd*sm,dt,3);
        if(Math.random()<dt*.2)e.dir*=-1;e.cd-=dt;e.charging=e.cd<.4;
        if(e.cd<=0){if(onScreen(e))shootE(e.x,e.y,Math.atan2(dy,dx),275,10,'#ff9a4d',5,toBc);e.cd=rnd(1.7,2.2);}break;}
      case 'rammer':{
        if(e.st==='seek'){steer(e,ux,uy,e.spd*sm,dt,3);e.cd-=dt;if(e.cd<=0&&d<470&&onScreen(e)){e.st='aim';e.timer=.85;e.aim=Math.atan2(dy,dx);}}
        else if(e.st==='aim'){e.vx*=.88;e.vy*=.88;if(e.timer>.22)e.aim+=clamp(angDiff(Math.atan2(dy,dx),e.aim),-3*dt,3*dt);e.timer-=dt;
          if(e.timer<=0){e.st='charge';e.timer=.55;e.vx=Math.cos(e.aim)*660;e.vy=Math.sin(e.aim)*660;}}
        else if(e.st==='charge'){e.timer-=dt;if(SET.fx&&vR3()<.6)part(e.x,e.y,vrnd3(-30,30),vrnd3(-30,30),.3,'#ff4545',2.5);if(e.timer<=0){e.st='rest';e.timer=.7;}}
        else{e.vx*=.92;e.vy*=.92;e.timer-=dt;if(e.timer<=0){e.st='seek';e.cd=rnd(1.5,2.5);}}
        break;}
      case 'splitter':steer(e,ux,uy,e.spd*sm,dt,2);break;
      case 'miner':{
        if(!e.tx||Math.hypot(e.tx-e.x,e.ty-e.y)<30){let tries=0;do{e.tx=rnd(80,W-80);e.ty=rnd(80,H-80);}while(Math.hypot(e.tx-p.x,e.ty-p.y)<200&&++tries<6);}
        steer(e,e.tx-e.x,e.ty-e.y,e.spd*sm,dt,2);e.cd-=dt;
        if(e.cd<=0&&onScreen(e)){e.cd=rnd(2.4,3.1);spawnEnemy('mine',e.x,e.y,{arm:.95,fuse:0,life:13,noAffix:true});}break;}
      case 'mine':{
        e.vx*=.9;e.vy*=.9;e.arm-=dt;e.life-=dt;
        if(e.arm<=0&&!e.fuse&&pd<64){e.fuse=.42;sfx('warn');}
        if(e.fuse>0){e.fuse-=dt;if(e.fuse<=0){mineBlast(e,82,20);}}
        if(e.life<=0&&e.alive){e.alive=false;part(e.x,e.y,0,0,.4,'#ffd24d',4);}
        break;}
      case 'shielder':{
        const allies=G.enemies.filter(o=>o.alive&&o!==e&&o.type!=='mine'&&o.type!=='shielder'&&o.type!=='moth');
        let cx=0,cy=0;allies.forEach(o=>{cx+=o.x;cy+=o.y;});
        const pux=pdx/pd,puy=pdy/pd;let tx,ty;if(allies.length){cx/=allies.length;cy/=allies.length;tx=cx-pux*110;ty=cy-puy*110;}else{tx=e.x-pux*100;ty=e.y-puy*100;}
        if(pd<260){tx=e.x-pux*200;ty=e.y-puy*200;}
        tx=clamp(tx,40,W-40);ty=clamp(ty,40,H-40);steer(e,tx-e.x,ty-e.y,e.spd*sm,dt,2);break;}
      case 'lancer':{
        if(e.st==='seek'){const m=clamp((d-400)/140,-1,1);steer(e,ux*m-uy*.5*e.dir,uy*m+ux*.5*e.dir,e.spd*sm,dt,2.5);e.cd-=dt;
          if(e.cd<=0&&onScreen(e)){e.st='aim';e.timer=1.15;e.aim=Math.atan2(dy,dx)+rnd(-.4,.4);}}
        else if(e.st==='aim'){e.vx*=.9;e.vy*=.9;e.aim+=clamp(angDiff(Math.atan2(dy,dx),e.aim),-1.5*dt,1.5*dt);e.timer-=dt;if(e.timer<=0){e.st='lock';e.timer=.3;sfx('warn');}}
        else if(e.st==='lock'){e.timer-=dt;if(e.timer<=0){e.st='fire';e.timer=.2;e.hitDone=false;}}
        else if(e.st==='fire'){e.timer-=dt;if(!e.hitDone){e.hitDone=true;const ex=e.x+Math.cos(e.aim)*1800,ey=e.y+Math.sin(e.aim)*1800;
            if(segDist(e.x,e.y,ex,ey,p.x,p.y)<17){if(G.mc&&p.inv<=0&&p.dashT<=0)G.mc.lanceHits++;damagePlayer(20);}
            else if(bc&&toBc&&segDist(e.x,e.y,ex,ey,bc.x,bc.y)<bc.r+4)dmgBeacon(20,e);shake(4);}
          if(e.timer<=0){e.st='seek';e.cd=rnd(3,3.8);}}
        break;}
      case 'guard':{
        e.face+=clamp(angDiff(Math.atan2(dy,dx),e.face),-1.35*dt,1.35*dt);
        const m=clamp((d-190)/100,-1,1);steer(e,ux*m,uy*m,e.spd*sm,dt,2);
        e.cd-=dt;if(e.cd<=0){e.cd=rnd(2.4,2.9);if(onScreen(e))for(let i=-1;i<=1;i++)shootE(e.x+Math.cos(e.face)*22,e.y+Math.sin(e.face)*22,e.face+i*.22,240,11,'#ffb84d',6,toBc);}
        break;}
      case 'pylon':{const b=G.boss;if(!b){e.alive=false;break;}e.orb+=dt*(.45+.15*b.phase)*e.dir;e.x=b.x+Math.cos(e.orb)*e.R;e.y=b.y+Math.sin(e.orb)*e.R*.8;e.vx=e.vy=0;
        if(b.phase>=2&&b.over<=0){e.cd-=dt;if(e.cd<=0){e.cd=rnd(3.8,4.8);for(let i=0;i<6;i++)shootE(e.x,e.y,i/6*TAU+e.orb,135,9,'#b48cff',5);}}break;}
      case 'seeker':{const c=Math.atan2(e.vy,e.vx);const n=c+clamp(angDiff(Math.atan2(pdy,pdx),c),-2.2*dt,2.2*dt);const s=Math.min(e.spd,Math.hypot(e.vx,e.vy)+300*dt);e.vx=Math.cos(n)*s;e.vy=Math.sin(n)*s;
        e.life-=dt;if(e.life<=0)kill(e,true);break;}
      case 'boss':updateBoss(e,dt);break;
      // ---- Акт II ----
      case 'moth':{const w=Math.sin(e.t*7+e.seed)*.9;steer(e,ux-uy*w,uy+ux*w,e.spd*sm,dt,3);break;}
      case 'leech':{
        if(!bc){steer(e,pdx,pdy,e.spd,dt,3);break;}
        if(e.att){e.ang+=dt*.3;e.x=bc.x+Math.cos(e.ang)*(bc.r+6);e.y=bc.y+Math.sin(e.ang)*(bc.r+6);e.vx=e.vy=0;}
        else{steer(e,bc.x-e.x,bc.y-e.y,e.spd*sm,dt,3);if(Math.hypot(bc.x-e.x,bc.y-e.y)<bc.r+e.r+4){e.att=true;e.ang=Math.atan2(e.y-bc.y,e.x-bc.x);floater(e.x,e.y-14,'ПИЯВКА НА МАЯКЕ','#c46bff');}}
        break;}
      case 'carrier':{
        if(d>230)steer(e,ux,uy,e.spd*sm,dt,2);else steer(e,-uy*e.dir,ux*e.dir,e.spd*sm,dt,2);
        e.cd-=dt;if(d<270&&e.cd<=0&&onScreen(e)){e.cd=6;for(let i=0;i<4;i++){const a=i/4*TAU;const m=spawnEnemy('moth',e.x+Math.cos(a)*12,e.y+Math.sin(a)*12,{group:'siege'});m.vx=Math.cos(a)*160;m.vy=Math.sin(a)*160;}}
        break;}
      case 'jammerS':settle(e,dt,60);break;
      case 'hive':{settle(e,dt,70);e.cd-=dt;if(e.cd<=0&&onScreen(e)){e.cd=4;for(let i=0;i<2;i++){const m=spawnEnemy('moth',e.x+rnd(-14,14),e.y+rnd(-14,14),{group:'siege'});m.vx=rnd(-120,120);m.vy=rnd(-120,120);}}break;}
      case 'cutter':{
        const L=nearestLine(e);
        if(!L){steer(e,pdx,pdy,e.spd*sm,dt,3);break;}
        const q=segPoint(L.x,L.y,bc.x,bc.y,e.x,e.y),qd=Math.hypot(q.x-e.x,q.y-e.y);
        if(qd<16){e.vx*=.7;e.vy*=.7;e.cutT=(e.cutT||0)+dt;e.cutting=true;if(e.cutT>.9){L.cut=true;L.rep=0;e.cutT=0;floater(q.x,q.y-12,'ЛИНИЯ ПЕРЕРЕЗАНА','#ff4f6e');sfx('warn');}}
        else{e.cutT=0;e.cutting=false;steer(e,q.x-e.x,q.y-e.y,e.spd*sm,dt,4);}
        break;}
      case 'tug':{
        if(e.rock&&!e.rock.alive)e.rock=null;
        e.cd-=dt;
        if(!e.rock){
          let r=null,rd=1e9;if(e.cd<=0)for(const k of G.rocks){if(!k.alive||k.tow||k.flung)continue;const q=Math.hypot(k.x-e.x,k.y-e.y);if(q<rd){rd=q;r=k;}}
          if(r){steer(e,r.x-e.x,r.y-e.y,e.spd*sm,dt,3);if(rd<r.r+e.r+10){e.rock=r;r.tow=e;}}
          else steer(e,ux,uy,e.spd*sm,dt,2);
        }else{
          const r=e.rock;steer(e,ux,uy,e.spd*.8*sm,dt,2);
          const ddx=r.x-e.x,ddy=r.y-e.y,dl=Math.hypot(ddx,ddy)||1,L=r.r+e.r+30;if(dl>L){r.x=e.x+ddx/dl*L;r.y=e.y+ddy/dl*L;}r.vx=e.vx;r.vy=e.vy;
          if(bc&&toBc&&Math.hypot(bc.x-e.x,bc.y-e.y)<270){const a=Math.atan2(bc.y-r.y,bc.x-r.x);r.vx=Math.cos(a)*240;r.vy=Math.sin(a)*240;r.flung=true;r.tow=null;e.rock=null;e.cd=4;e.vx=-ux*120;e.vy=-uy*120;sfx('warn');}
        }
        break;}
      case 'mortar':{
        const m=clamp((d-430)/120,-1,1);steer(e,ux*m-uy*.5*e.dir,uy*m+ux*.5*e.dir,e.spd*sm,dt,2);
        e.cd-=dt;if(e.cd<=0&&onScreen(e)){e.cd=rnd(3.6,4.4);spawnEnemy('shell',e.x,e.y,{sx:e.x,sy:e.y,tx:T.x+rnd(-10,10),ty:T.y+rnd(-10,10),ft:0,dur:1.6,toBc,h:0,noAffix:true});}
        break;}
      case 'shell':{e.ft+=dt;const k=Math.min(1,e.ft/e.dur);e.x=e.sx+(e.tx-e.sx)*k;e.y=e.sy+(e.ty-e.sy)*k;e.h=Math.sin(Math.PI*k)*90;if(k>=1)shellLand(e);break;}
      case 'phantom':{e.ghost=((e.t+e.seed)%4)<1.6;const w=Math.sin(e.t*2+e.seed)*.4;steer(e,ux-uy*w,uy+ux*w,e.spd*sm,dt,3);break;}
      case 'shade':{
        if(e.st==='dash'){e.timer-=dt;if(e.timer<=0){e.st='seek';e.cd=rnd(2,3);}}
        else if(e.st==='rev'){e.vx*=.85;e.vy*=.85;e.timer-=dt;if(e.timer<=0){e.st='dash';e.timer=.35;const a=Math.atan2(dy,dx);e.vx=Math.cos(a)*560;e.vy=Math.sin(a)*560;}}
        else{steer(e,ux,uy,e.spd*sm,dt,3);e.cd-=dt;if(e.cd<=0&&d<180){e.st='rev';e.timer=.5;}}
        e.reveal=e.st==='rev'||e.st==='dash'?1:0;break;}
      case 'mirror':{
        e.face+=clamp(angDiff(Math.atan2(pdy,pdx),e.face),-1.2*dt,1.2*dt);
        const m=clamp((d-160)/100,-1,1);steer(e,ux*m,uy*m,e.spd*sm,dt,2);break;}
      case 'shocker':{
        if(e.st==='charge'){e.vx*=.85;e.vy*=.85;e.timer-=dt;if(e.timer<=0){e.st='seek';e.cd=rnd(3,4);G.fields.push({x:e.x,y:e.y,r:115,t:.45,max:.45,hit:false});sfx('warn');}}
        else{const m=clamp((d-150)/100,-1,1);steer(e,ux*m-uy*.5*e.dir,uy*m+ux*.5*e.dir,e.spd*sm,dt,3);e.cd-=dt;if(e.cd<=0&&d<230){e.st='charge';e.timer=.6;}}
        break;}
      case 'vortex':{const tx=bc?(p.x+bc.x)/2:p.x,ty=bc?(p.y+bc.y)/2:p.y;steer(e,tx-e.x,ty-e.y,e.spd*sm,dt,1.5);break;}
      case 'twin':{const m=clamp((d-210)/100,-1,1);steer(e,ux*m-uy*.7*e.dir,uy*m+ux*.7*e.dir,e.spd*sm,dt,3);
        e.cd-=dt;if(e.cd<=0){e.cd=rnd(2.2,2.8);if(onScreen(e))shootE(e.x,e.y,Math.atan2(dy,dx),260,9,'#ff6bd0',5,toBc);}break;}
      case 'thief':{
        if(e.flee){steer(e,e.fx-e.x,e.fy-e.y,e.spd*1.1,dt,3);if(e.x<-40||e.x>BW+40||e.y<-40||e.y>BH+40){e.alive=false;if(e.loot)floater(e.x,e.y,'ПОХИТИТЕЛЬ УШЁЛ','#9dff6b');}break;}
        if(p.cargo>0&&p.hp>0){steer(e,pdx,pdy,e.spd*sm,dt,4);if(pd<e.r+p.r+6){p.cargo--;e.loot=(e.loot||0)+1;startFlee(e);floater(p.x,p.y-26,'ГРУЗ ПОХИЩЕН','#9dff6b');sfx('warn');}}
        else{let c=null,cd=1e9;for(const k of G.pick){if(k.k!=='cell'||k.life<=0)continue;const q=Math.hypot(k.x-e.x,k.y-e.y);if(q<cd){cd=q;c=k;}}
          if(c){steer(e,c.x-e.x,c.y-e.y,e.spd*sm,dt,4);if(cd<16){c.life=0;e.loot=(e.loot||0)+1;startFlee(e);}}
          else{const m=clamp((pd-220)/100,-1,1);steer(e,pdx/pd*m-pdy/pd*.8*e.dir,pdy/pd*m+pdx/pd*.8*e.dir,e.spd*.7*sm,dt,3);}}
        break;}
      case 'hunter':{
        if(e.dT>0){e.dT-=dt;if(SET.fx)part(e.x,e.y,vrnd3(-30,30),vrnd3(-30,30),.25,'#ff2e4a',2);}
        else{steer(e,ux,uy,e.spd*sm,dt,3);
          for(const ev of G.dashLog){if(ev.t>e.seen&&G.t-ev.t>=.5){e.seen=ev.t;const a=Math.atan2(ev.y-e.y,ev.x-e.x);e.vx=Math.cos(a)*1150;e.vy=Math.sin(a)*1150;e.dT=.2;break;}}}
        e.cd-=dt;if(e.cd<=0&&onScreen(e)){e.cd=rnd(2.2,2.8);shootE(e.x,e.y,Math.atan2(dy,dx),300,10,'#ff2e4a',5,toBc);}
        break;}
      case 'commander':{if(d>300)steer(e,ux,uy,e.spd*sm,dt,2);else steer(e,-uy*e.dir,ux*e.dir,e.spd*.6,dt,2);break;}
      case 'cruiser':{
        const eng=e.parts.filter(q=>q.alive&&q.role==='eng').length;const spd=e.spd*(eng===2?1:eng===1?.55:.3)*sm;
        if(d>230)steer(e,ux,uy,spd,dt,1.5);else{e.vx*=.95;e.vy*=.95;}
        e.ang+=clamp(angDiff(Math.atan2(dy,dx),e.ang),-.8*dt,.8*dt);
        const gun=e.parts.find(q=>q.role==='gun'&&q.alive);
        e.cd-=dt;if(gun&&e.cd<=0&&onScreen(e)){e.cd=2.2;const a=Math.atan2(T.y-gun.y,T.x-gun.x);for(let i=-1;i<=1;i++)shootE(gun.x,gun.y,a+i*.12,230,12,'#ff7a5a',6,toBc);}
        break;}
      case 'cpart':{const h=e.host;if(!h||!h.alive){kill(e,true);break;}const c=Math.cos(h.ang),s=Math.sin(h.ang);e.x=h.x+c*e.ox-s*e.oy;e.y=h.y+s*e.ox+c*e.oy;break;}
      case 'antenna':break;
      case 'decoy':break;
      case 'crate':{if(onScreen(e))e.entered=true;else if(e.entered)e.alive=false;break;}
      case 'jam':updateJam(e,dt);break;
    }
    if(G.atkK<1&&e.cd>cd0+1e-6&&!e.sbk)e.cd=cd0>0?cd0+(e.cd-cd0)*G.atkK:e.cd*G.atkK;
    if(!STATIC.has(e.type)&&!(e.type==='leech'&&e.att)&&!e.stuck){e.x+=e.vx*dt*G.eSpd;e.y+=e.vy*dt*G.eSpd;
      if(e.type==='rammer'&&e.st==='charge'){if(e.x<e.r||e.x>BW-e.r){e.vx*=-.6;e.x=clamp(e.x,e.r,BW-e.r);}if(e.y<e.r||e.y>BH-e.r){e.vy*=-.6;e.y=clamp(e.y,e.r,BH-e.r);}}}
    dt=dtS;
  }
  G.curE=null;
  // разведение
  const es=G.enemies;
  const sep=e=>e.alive&&!STATIC.has(e.type)&&e.type!=='mine'&&!(e.type==='leech'&&e.att)&&e.down<=0&&!e.zbHide;
  if(!PERF.off['O-3'])o3Sep(es,sep);else{/* PERF·OPT O-3: старый путь */
  for(let i=0;i<es.length;i++){const a=es[i];if(!sep(a))continue;
    for(let j=i+1;j<es.length;j++){const b=es[j];if(!sep(b))continue;
      const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),m=a.r+b.r+2;if(d>0&&d<m){const k=(m-d)/d*.5;a.x-=dx*k;a.y-=dy*k;b.x+=dx*k;b.y+=dy*k;}}}
  }
  if(!G.world)for(const e of es){if(!e.alive||STATIC.has(e.type)||e.type==='thief'&&e.flee||e.retreat||e.type==='crate')continue;const mg=120;if(e.x<-mg||e.x>BW+mg||e.y<-mg||e.y>BH+mg){e.x=clamp(e.x,-mg,BW+mg);e.y=clamp(e.y,-mg,BH+mg);}}
  G.enemies=G.enemies.filter(e=>e.alive);
}
function startFlee(e){e.flee=true;const cx=e.x<W/2?-80:W+80;e.fx=cx;e.fy=e.y;}
function mineBlast(e,R,pd){
  e.alive=false;const p=G.player;G.shock.push({x:e.x,y:e.y,r:8,R,t:0,col:'#ffd24d'});explode(e.x,e.y,'#ffd24d',22,.9);sfx('boom');shake(6);
  if(p&&Math.hypot(p.x-e.x,p.y-e.y)<R+p.r*.5)damagePlayer(pd);
  for(const o of G.enemies)if(o.alive&&o!==e&&!STATIC.has(o.type)&&o.type!=='mine'&&Math.hypot(o.x-e.x,o.y-e.y)<R)hurt(o,30,{});
}
function shellLand(e){
  e.alive=false;const p=G.player,bc=G.bc;explode(e.tx,e.ty,'#ff8f5a',12,.7);sfx('boom');
  const pd=Math.hypot(p.x-e.tx,p.y-e.ty);
  if(e.toBc&&bc){if(pd<34&&p.hp>0){damagePlayer(6);floater(p.x,p.y-24,'ЗАКРЫЛИ МАЯК','#ffb84d');}else if(Math.hypot(e.tx-bc.x,e.ty-bc.y)<bc.r+14)dmgBeacon(16,null);}
  else if(pd<44)damagePlayer(12);
}
function hurt(e,dmg,src){
  if(!e.alive||e.down>0)return;if(e.zb){zbHurt(e,dmg,src);return;}if(e.retreat&&mercySurrender(e))return;
  if(e.type==='boss'){const b=G.boss;if(!b||b.st!=='fight')return;if(bossShielded()&&!src.force)return;if(b.over>0)dmg*=1.5;}
  else if(e.type==='jam'){const j=G.jam;if(!j||j.st!=='fight'||jamShielded())return;}
  else if(e.dig!==undefined){dmg=w58DigHurt(e,dmg);if(dmg<=0)return;}
  else if(EDEF[e.type].sbp){dmg=sbHurt(e,dmg,src);if(dmg<=0)return;}
  if(H74.has(e.type)||e.n74){dmg=s74Hurt(e,dmg,src);if(dmg<=0)return;}
  if(e.peace&&G.world)w58CopyHurt(e);
  else dmg*=e.shieldK;
  if(e.secArm&&!(e.noArm>0)&&!src.pulse)dmg*=1-e.secArm;
  if(e.armor>0&&!src.pulse&&!src.ram){e.armor--;e.flash=.07;sfx('block');part(e.x,e.y,rnd(-60,60),rnd(-60,60),.2,'#cfd8e6',2);return;}
  if(G.x90&&inMission()){if(G.x90.pud.length)dmg*=pud90K(e);if(e.weak95>0&&!S90T.has(e.type))dmg*=weakK95(e);if(G.x90.sec>=9)dl100(e,dmg);}
  e.hp-=dmg;e.flash=.07;sfx('hit');
  if(e.type==='boss'){const b=G.boss;const th=e.th[b.phase-1];if(b.phase<3&&e.hp<=th){e.hp=th;phaseShift(b);}}
  if(e.type==='jam'){const th=e.th[e.phase-1];if(e.phase<3&&e.hp<=th){e.hp=th;jamPhase(e);}}
  if(e.sbk)sbCheckTh(e);
  if(e.hp>0)storyRetreatRoll(e);
  if(e.hp<=0){if(src&&src.charged)e.lastCh=true;kill(e);}
}
function dropCell(x,y,stab=2){G.pick.push({k:'cell',x,y,vx:rnd(-40,40),vy:rnd(-40,40),r:9,t:0,stab,life:20});}
function kill(e,silent){
  if(!e.alive)return;if(e.rebuilt)silent=true;if(e.type==='loop'&&!silent&&loopIntercept80(e))return;
  // Близнецы: если напарник жив и не повержен — уходим в восстановление
  if(e.type==='twin'&&!silent&&e.mate&&e.mate.alive&&!(e.mate.down>0)){e.down=3;e.hp=0;prioClear(e);explode(e.x,e.y,'#ff6bd0',8,.6);floater(e.x,e.y-18,'ВОССТАНОВЛЕНИЕ 3 С','#ff6bd0');return;}
  e.alive=false;const d=EDEF[e.type];storyRetreatKilled(e);
  if(e.type==='invcell'&&e.dig!==undefined)w58DigDied(e);else if(e.type==='invcell')invCellDied(e);else if(e.type==='invcore')invCoreDied(e);else if(e.type==='obseg')obSegDied(e);
  if(e.wander&&G.w)w58WanderDied(e);
  s74Killed(e,silent);s75Killed(e,silent);s80Killed(e,silent);s85Killed(e,silent);s90Killed(e,silent);
  if(G.prio===e){prioSet(null);if(G.mc&&!silent)G.mc.prioKills++;}
  if(e.type==='boss'){bossDeath(e);return;}
  if(e.type==='jam'){jamDeath(e);return;}
  if(e.sbk){sbDeath(e);return;}
  const big=e.type==='guard'||e.type==='cruiser'||e.type==='hive';
  explode(e.x,e.y,d.col,big?36:e.type==='moth'?6:16,big?1.3:.8);sfx(big||['mirror','hunter','commander','shielder'].includes(e.type)?'killBig':'kill');shake(big?8:e.type==='moth'?0:3);
  if(e.type==='twin'&&e.mate&&e.mate.alive&&e.mate.down>0){e.mate.down=0;e.mate.hp=0;kill(e.mate,false);}
  if(e.type==='cruiser'&&e.parts)e.parts.forEach(q=>{if(q.alive)kill(q,true);});
  if(e.type==='cpart'&&!silent&&e.host&&e.host.alive)floater(e.x,e.y-14,e.role==='gun'?'ОРУДИЕ УНИЧТОЖЕНО':'ДВИГАТЕЛЬ УНИЧТОЖЕН','#ff9a7a');
  if(e.type==='shocker'&&!silent)G.fields.push({x:e.x,y:e.y,r:90,t:2,max:2,hit:false});
  if(e.type==='frost'&&!silent)G.fields.push({x:e.x,y:e.y,r:70,t:4,max:4,hit:true,ice:true});
  if(e.type==='corroder'&&!silent){G.fields.push({x:e.x,y:e.y,r:150,t:5,max:5,hit:true,rust:true,strip:true});sfx('boom');}
  if(!silent)dropHull(e);
  if(e.type==='decoy'&&G.jam)G.jam.decoyT=8;
  if(e.type==='thief'&&e.loot)for(let i=0;i<e.loot;i++)dropCell(e.x+rnd(-10,10),e.y+rnd(-10,10),0);
  if(silent)return;
  if(e.affix){if(e.affix.includes('split'))for(let i=0;i<2;i++){const a=rnd(0,TAU);const m=spawnEnemy('mite',e.x,e.y,{group:e.group,noAffix:true,zone:e.zone,noLoot:true});m.vx=Math.cos(a)*240;m.vy=Math.sin(a)*240;}
    if(e.affix.includes('boom'))mineBlast({x:e.x,y:e.y,alive:true},64,12);}
  G.kills++;G.score+=Math.round(d.pts*(e.escort?.5:1));
  if(G.mode==='world'){conEvent('kill',e.type);if(!G.world)addPilotXP(rewMul()*(e.escort?.5:1));}
  if(e.lastCh)conEvent('chargedKill');
  comboKill();
  if(e.type==='crate'){runGrant6('lvl');floater(e.x,e.y-20,'ВНЕОЧЕРЕДНОЙ МОДУЛЬ','#8fe9ff');sfx('level');return;}
  if(e.type==='antenna'&&G.jam&&!G.enemies.some(o=>o.alive&&o.type==='antenna'))banner('АНТЕННЫ СБИТЫ','ЯДРО ГЛУШИТЕЛЯ ОТКРЫТО');
  if(d.passive||e.type==='antenna'||e.type==='decoy')return;
  if(e.type==='lock'){shake(12);if(G.save){const LD=G.save.locksDown||(G.save.locksDown=[]);if(!LD.includes(e.li)){LD.push(e.li);G.save.lom+=50;floater(e.x,e.y-48,'+50 ЛОМА','#c9d2de');}saveWorld();}if(G.save&&!G.enemies.some(o=>o.alive&&o.type==='lock')){G.save.gate=true;banner('ВОРОТА ОТКРЫТЫ','ДРЕЙФ МАЯКА · МИССИЯ 07 ДОСТУПНА');sfx('flash');
      const n=WORLD.nodes[6];G.unlockFx={x0:WORLD.gate.x,y0:WORLD.gate.y,x1:n.x,y1:n.y,t:0};saveWorld();}else floater(e.x,e.y-30,'ЗАМОК СНЯТ · ОСТАЛСЯ ОДИН','#b48cff');return;}
  if(G.world){if(!e.zone&&!e.noLoot&&Math.random()<.5)G.pick.push({k:'lom',x:e.x+rnd(-8,8),y:e.y+rnd(-8,8),vx:rnd(-90,90),vy:rnd(-90,90),r:5,t:0,life:30,v:1});
    if(Math.random()<.06)dropCell(e.x,e.y,0);
    if(e.type==='splitter')for(let i=0;i<3;i++){const a=i/3*TAU;const m=spawnEnemy('mite',e.x+Math.cos(a)*10,e.y+Math.sin(a)*10,{noAffix:true,zone:e.zone,noLoot:true});m.vx=Math.cos(a)*240;m.vy=Math.sin(a)*240;}
    return;}
  const xp=e.type==='moth'?(Math.random()<.5?1:0):e.escort?Math.round(d.xp*.5):d.xp;
  for(let i=0;i<xp;i++)G.pick.push({k:'xp',x:e.x+rnd(-8,8),y:e.y+rnd(-8,8),vx:rnd(-90,90),vy:rnd(-90,90),r:5,t:0,life:22});
  let cellCh=G.m<2?0:e.type==='guard'||e.type==='cruiser'?.6:e.type==='pylon'||e.type==='hive'?.35:e.type==='shielder'||e.type==='lancer'||e.type==='mirror'||e.type==='hunter'?.18:e.type==='moth'?.02:.075;
  if(G.bc)cellCh=e.type==='moth'||e.type==='mite'?.004:Math.min(1,cellCh*.9);
  if(Math.random()<cellCh)dropCell(e.x,e.y);
  const repCh=noHeal()?0:(G.mode==='endless'?Math.max(.005,.03-.003*(G.end.step-1)):e.type==='guard'||e.type==='cruiser'?.4:e.type==='moth'?.005:.03)*(inMission()?curDiff().rep:1);
  if(Math.random()<repCh)G.pick.push({k:'rep',x:e.x,y:e.y,vx:rnd(-40,40),vy:rnd(-40,40),r:10,t:0,life:25});
  if(e.type==='splitter')for(let i=0;i<3;i++){const a=i/3*TAU+rnd(-.3,.3);const m=spawnEnemy('mite',e.x+Math.cos(a)*10,e.y+Math.sin(a)*10,{group:e.group,noAffix:true});m.vx=Math.cos(a)*240;m.vy=Math.sin(a)*240;}
  if(e.type==='pylon'){const b=G.boss;if(b&&b.over<=0&&!G.enemies.some(o=>o.alive&&o.type==='pylon'))startOverload(b);}
}

