// ===== 0.9.5: новые враги сектора IX — Лейкоциты, Спазм, Тельце-бомба, Иммунный страж, Великий Тромб =====
function ai95(e,dt,c){if(e.type==='hunt95'&&!e.pk95i)huntInit95(e);if(e.idle95&&typeof idle95==='function'&&idle95(e,dt))return true;switch(e.type){
    case 'hunt95':huntAI95(e,dt,c);return true;
    case 'spasm95':spasmAI95(e,dt,c);return true;
    case 'cell95':cellAI95(e,dt,c);return true;
    case 'guard95':guardAI95(e,dt,c);return true;
    case 'gclot95':gclotAI95(e,dt,c);return true;
    case 'blot95':blotAI95(e,dt,c);return true;
    case 'scribe95':scribeAI95(e,dt,c);return true;
    case 'ebb95':ebbAI95(e,dt,c);return true;
    case 'lost95':lostAI95(e,dt,c);return true;}
  return false;}
function hurt95(e,dmg,src){switch(e.type){
    case 'spasm95':{const p=G.player,back=e.att95&&Math.abs(angDiff(Math.atan2(p.y-e.y,p.x-e.x),e.fa95||0))>100*Math.PI/180;if(back){if(!e.bh95){e.bh95=1;floater(e.x,e.y-e.r-12,'СЗАДИ ×1,5',C95.spasm);}return dmg*1.5;}return dmg;}
    case 'guard95':return src.charged?dmg*1.2:dmg;
    case 'blot95':return e.bs95==='air'?dmg*1.5:dmg;
    case 'gclot95':return src.charged||src.pulse?dmg*1.5:dmg;
    case 'lost95':return e.inv95>0?0:dmg;}
  return undefined;}
function kill95(e,silent){switch(e.type){
    case 'hunt95':{const P=e.pack95;if(P&&P.leader===e){P.leader=null;for(const m of P.mem)if(m.alive&&m!==e){m.solo95=1;m.hs95='solo';m.ht95=rnd(.8,1.6);}if(!silent){floater(e.x,e.y-26,'ВОЖАК УБИТ · СТАЯ РАССЫПАЛАСЬ',C95.hunt);snd95('elite',e.x);}}break;}
    case 'spasm95':{const f=e.flow95;if(f&&f.sq95===e){f.sq95=null;f.spd95=1;f.w=f.w0||120;}break;}
    case 'cell95':if(!silent&&!e.boomed95)cellBoom95(e,false);break;
    case 'lost95':if(!silent)lostDrop95(e);break;
    case 'ebb95':if(!silent)ebbGone95(e);else ebbGone95(e,true);break;
    case 'scribe95':{for(const b of G.eb)if(b.line95&&b.line95===e.line95&&b.hold95>0){b.life=0;}break;}
    case 'gclot95':if(!silent&&typeof gclotDead95==='function')gclotDead95(e);break;}}
// --- Лейкоцит-охотник: стая из трёх, треугольник, бросок в центр ---
function huntInit95(e){if(e.pk95i)return;e.pk95i=1;if(!e.pack95&&!e.solo95&&!G.world&&e.packN95===undefined&&G.enemies.filter(o=>o.alive&&o.type==='hunt95').length>=8)e.solo95=1;
  if(!e.pack95&&!e.solo95){const P={leader:e,mem:[e],st:'gather',t:0};e.pack95=P;e.r=15;e.lead95=1;const nAll=G.world?0:G.enemies.filter(o=>o.alive&&o.type==='hunt95').length,n=Math.max(0,Math.min(e.packN95!==undefined?e.packN95:2,G.world?9:10-nAll));
    for(let i=0;i<n;i++){const a=rnd(0,TAU);const m=spawnEnemy('hunt95',e.x+Math.cos(a)*30,e.y+Math.sin(a)*30,{noAffix:true,noLoot:!!e.noLoot,pack95:P,spawnT:Math.max(.3,e.spawnT||0),zone:e.zone,pk95i:1,noCap95:1,idle95:e.idle95||0,pat95:e.pat95});P.mem.push(m);}}
  if(e.solo95){e.hs95='solo';e.ht95=1.2;}}
function huntAI95(e,dt,c){const p=G.player,pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1;
  const P=e.pack95;
  if(e.hs95==='solo'||!P||P.leader===null&&e.solo95){huntSolo95(e,dt,c,pd,pdx,pdy);return;}
  if(P.leader!==e){// ведомые слушают вожака
    if(P.st==='dash'&&e.hd95){e.hd95.t-=dt;if(e.hd95.t<=0)e.hd95=null;return;}
    if(P.st==='tri'||P.st==='aim'){const i=P.mem.filter(m=>m.alive).indexOf(e),n=P.mem.filter(m=>m.alive).length;const a=P.a0+i*TAU/Math.max(1,n),tx=P.cx+Math.cos(a)*170,ty=P.cy+Math.sin(a)*170;steer(e,tx-e.x,ty-e.y,e.spd*1.3*c.sm,dt,5);return;}
    if(P.st==='rest'){e.vx*=.92;e.vy*=.92;return;}
    const lx=P.leader?P.leader.x:p.x,ly=P.leader?P.leader.y:p.y,a=Math.atan2(e.y-ly,e.x-lx)+dt;steer(e,lx+Math.cos(a)*40-e.x+(pdx/pd)*30,ly+Math.sin(a)*40-e.y+(pdy/pd)*30,e.spd*c.sm,dt,3);return;}
  // вожак ведёт стаю
  P.t+=dt;const live=P.mem.filter(m=>m.alive);
  if(P.st==='gather'){steer(e,pdx,pdy,e.spd*c.sm*(pd>260?1:.4),dt,3);if(P.t>2.2&&pd<320&&p.hp>0&&live.length>=2&&!(G.x90&&inMission()&&wallBlock95(e,p))){P.st='tri';P.t=0;P.cx=p.x;P.cy=p.y;P.a0=Math.atan2(e.y-p.y,e.x-p.x);}}
  else if(P.st==='tri'){P.cx+=(p.x-P.cx)*Math.min(1,dt*2);P.cy+=(p.y-P.cy)*Math.min(1,dt*2);const i=live.indexOf(e),a=P.a0+i*TAU/Math.max(1,live.length);steer(e,P.cx+Math.cos(a)*170-e.x,P.cy+Math.sin(a)*170-e.y,e.spd*1.3*c.sm,dt,5);
    if(P.t>1.1){P.st='aim';P.t=0;P.T=.6*tel90('hunt95');P.tx=p.x;P.ty=p.y;snd95('tlDash',e.x);tlog95('hunt95',P.T);tel90use('hunt95');for(const m of live)m.tl95=P.T;}}
  else if(P.st==='aim'){for(const m of live){m.vx*=.85;m.vy*=.85;}P.tx+=(p.x-P.tx)*Math.min(1,dt*3);P.ty+=(p.y-P.ty)*Math.min(1,dt*3);
    if(P.t>=P.T){P.st='dash';P.t=0;for(const m of live){const a=Math.atan2(P.ty-m.y,P.tx-m.x);m.vx=Math.cos(a)*620;m.vy=Math.sin(a)*620;m.hd95={t:.38};m.tl95=0;}snd95('pilotDash',e.x);}}
  else if(P.st==='dash'){if(e.hd95){e.hd95.t-=dt;if(e.hd95.t<=0)e.hd95=null;}if(P.t>.42){P.st='rest';P.t=0;}}
  else if(P.st==='rest'){for(const m of live){m.vx*=.92;m.vy*=.92;}if(P.t>1.2){P.st='gather';P.t=0;}}}
function huntSolo95(e,dt,c,pd,pdx,pdy){const p=G.player;if(e.ht95===undefined)e.ht95=1.4;
  if(e.hd95){e.hd95.t-=dt;if(e.hd95.t<=0){e.hd95=null;e.ht95=rnd(2,2.8);}return;}
  if(e.hq95>0){e.hq95-=dt;e.vx*=.8;e.vy*=.8;if(e.hq95<=0){const a=Math.atan2(p.y-e.y,p.x-e.x);e.vx=Math.cos(a)*600;e.vy=Math.sin(a)*600;e.hd95={t:.34};e.tl95=0;snd95('pilotDash',e.x);}return;}
  const m=clamp((pd-200)/100,-1,1);steer(e,pdx/pd*m-pdy/pd*.7*e.dir,pdy/pd*m+pdx/pd*.7*e.dir,e.spd*c.sm,dt,3);e.ht95-=dt;
  if(e.ht95<=0&&pd<360&&p.hp>0&&!(G.x90&&inMission()&&wallBlock95(e,p))){e.hq95=.6*tel90('hunt95');e.tl95=e.hq95;e.ha95=Math.atan2(p.y-e.y,p.x-e.x);tlog95('hunt95',e.hq95);tel90use('hunt95');snd95('tlDash',e.x);}}
// --- Спазм: присасывается к ленте, сжимает её, выбрасывает сгустки в такт ---
function spasmAI95(e,dt,c){const X=G.x90,p=G.player;if(e.sp95===undefined){e.sp95=rnd(1.5,3);e.fa95=0;}
  if(!e.att95){let best=null,bd=420,bi=0,bf=null;if(X&&inMission()&&X.flows.length){for(const f of X.flows){if(!f.pts||f.sq95&&f.sq95!==e&&f.sq95.alive)continue;for(let i=4;i<=28;i+=2){const q=f.pts[i];if(!q||q.x<50||q.x>W-50||q.y<50||q.y>H-50)continue;const d=Math.hypot(q.x-e.x,q.y-e.y);if(d<bd){bd=d;best=q;bi=i;bf=f;}}}}
    if(best){steer(e,best.x-e.x,best.y-e.y,e.spd*1.6*c.sm,dt,3);if(bd<14){e.att95=1;e.flow95=bf;e.fi95=bi;bf.sq95=e;bf.w0=bf.w0||bf.w;bf.w=70;bf.spd95=2;e.vx=e.vy=0;floater(e.x,e.y-e.r-14,'СПАЗМ · ПОТОК ×2',C95.spasm);snd95('squeeze',e.x);}}
    else{// без лент: к ближайшей стене, сжимает пространство вдоль неё
      const pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1;const m=clamp((pd-260)/120,-1,1);steer(e,pdx/pd*m-pdy/pd*.4*e.dir,pdy/pd*m+pdx/pd*.4*e.dir,e.spd*c.sm,dt,2);e.fa95=Math.atan2(pdy,pdx)+Math.PI;}}
  else{const f=e.flow95,q=f&&f.pts?f.pts[e.fi95]:null;if(q){e.x=q.x;e.y=q.y;e.fa95=Math.atan2(-q.tx,q.ty);const side=Math.sign((p.x-q.x)*(-q.ty)+(p.y-q.y)*q.tx)||1;e.fa95=Math.atan2(q.tx*side,-q.ty*side);}e.vx=e.vy=0;if(f&&f.sq95!==e)e.att95=0;}
  e.sp95-=dt;e.pul95=e.sp95<.6?1-e.sp95/.6:0;if(e.sp95<=.6&&!e.spw95){e.spw95=1;e.tl95=.6;snd95('squeeze',e.x);tlog95('spasm95',.6);}
  if(e.sp95<=0){e.sp95=4;e.spw95=0;e.tl95=0;tel90use('spasm95');const f=e.flow95,q=f&&f.pts?f.pts[e.fi95]:null;let a=q?Math.atan2(q.ty,q.tx):Math.atan2(p.y-e.y,p.x-e.x);if(f&&f.rev95)a+=Math.PI;
    if(G.world||onScreen(e)){for(let i=0;i<4;i++)eb95(e.x,e.y,a+(i-1.5)*.08,330-i*25,9*first90(e),C95.spasm,6,'cell');if(q)for(let i=0;i<2;i++)eb95(e.x,e.y,a+Math.PI+(i-.5)*.1,260,9*first90(e),C95.spasm,6,'cell');}snd95('spit',e.x);trauma90(.06);}}
// --- Тельце-бомба: несётся по лентам, раздувается рядом с вами ---
function cellAI95(e,dt,c){const p=G.player,pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1;
  if(e.inf95!==undefined){e.inf95-=dt;e.vx*=.86;e.vy*=.86;e.r=EDEF.cell95.r*(1+.7*(1-Math.max(0,e.inf95)/e.inf0));if(e.inf95<=0)cellBoom95(e,true);return;}
  const q=G.x90&&inMission()?flowQ(e.x,e.y):null;if(q){e.x+=q.tx*170*q.k*dt;e.y+=q.ty*170*q.k*dt;}
  steer(e,pdx,pdy,e.spd*c.sm*(q?.6:1),dt,2.4);
  if(pd<90&&p.hp>0){e.inf0=e.inf95=.5*tel90('cell95');snd95('inflate',e.x);tg95({k:'zone',x:e.x,y:e.y,r:70,T:e.inf95,dmg:15,col:C95.cell,src:e,key:'cell95',snd:false,telK:false,track:o=>{o.x=e.x;o.y=e.y;},hitE:40,fx:false});}}
function cellBoom95(e,self){if(e.boomed95)return;e.boomed95=1;const x=e.x,y=e.y;explode(x,y,C95.cell,22,.9);snd95('boom95',x);trauma90(.2);if(G.shock.length<60)G.shock.push({x,y,r:10,R:74,t:0,col:C95.cell,thin:false});
  if(!self)for(const o of G.enemies){if(!o.alive||o===e||STATIC.has(o.type)||EDEF[o.type].passive||o.sbk||EDEF[o.type].sbp)continue;if(Math.hypot(o.x-x,o.y-y)<70+o.r)hurt(o,40,{pulse:true});}
  if(self&&e.alive)kill(e,true);}
// --- Иммунный страж: мембрана спереди, удар щитом конусом, заряд пробивает и оглушает ---
function guardAI95(e,dt,c){const p=G.player,pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1;if(e.fa95===undefined){e.fa95=Math.atan2(pdy,pdx);e.bs95=rnd(1.5,2.5);}
  if(e.mb95>0)e.mb95-=dt;
  if(e.bash95){const B=e.bash95;B.t-=dt;e.vx*=.8;e.vy*=.8;if(B.t<=0){e.bash95=null;e.vx=Math.cos(e.fa95)*360;e.vy=Math.sin(e.fa95)*360;e.mb95=Math.max(e.mb95||0,1.2);weak95(e,1.2,1.5);if(!e.gw96){e.gw96=1;floater(e.x,e.y-e.r-14,'ПОСЛЕ УДАРА МЕМБРАНА ОПУЩЕНА ✦','#ffffff');}}return;}
  e.fa95+=clamp(angDiff(Math.atan2(pdy,pdx),e.fa95),-1.6*dt,1.6*dt);const m=clamp((pd-140)/80,-1,1);steer(e,pdx/pd*m,pdy/pd*m,e.spd*c.sm,dt,2);
  e.bs95-=dt;e.charging=e.bs95<.7;if(e.bs95<=0&&pd<300&&p.hp>0){e.bs95=3.5;const T=.7*tel90('guard95');e.bash95={t:T};tg95({k:'cone',x:e.x,y:e.y,a:e.fa95,arc:Math.PI/2,len:160,T,dmg:16,kb:120,col:C95.guard,src:e,key:'guard95',snd:'tlCone',telK:false,track:o=>{o.x=e.x;o.y=e.y;o.a=e.fa95;},on:()=>{snd95('bash',e.x);trauma90(.2);}});}}
function guardFront95(e,bx,by){if(e.mb95>0)return false;return Math.abs(angDiff(Math.atan2(by-e.y,bx-e.x),e.fa95||0))<Math.PI/3;}
// снаряды игрока против мембраны стража и перекладины геометрии (вызов из b90Hit)
function guardHit95(b){for(const e of G.enemies){if(e.type!=='guard95'||!e.alive||e.spawnT>0||b.hit.includes(e))continue;if(segDist(b.px,b.py,b.x,b.y,e.x,e.y)>e.r+8)continue;if(!guardFront95(e,b.px,b.py))continue;
    if(b.charged){e.mb95=2;e.stun=2;b.hit.push(e);floater(e.x,e.y-e.r-12,'МЕМБРАНА ПРОБИТА · ОГЛУШЁН',C95.guard);snd95('stun',e.x);hurt(e,b.dmg*.6,{charged:true});return false;}
    b.life=0;e.shieldFlash=.12;snd95('shieldHit',e.x);if(SET.fx)part(b.x,b.y,rnd(-80,80),rnd(-80,80),.2,C95.shield,2);if(!e.gh95){e.gh95=1;floater(e.x,e.y-e.r-12,'МЕМБРАНА · ОБХОДИТЕ СБОКУ','#c9d2de');}return true;}
  return false;}
// --- Великий Тромб (событие мира «Тромбоз»): три фазы атак ---
function gclotAI95(e,dt,c){const p=G.player,pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1;const k=e.hp/e.maxHp,ph=k>.66?1:k>.33?2:3;if(ph!==e.ph95){e.ph95=ph;e.ga95=1.2;if(ph>1){banner('ВЕЛИКИЙ ТРОМБ · ФАЗА '+ph,ph===2?'ПЛЕВКИ ЛУЖ':'ВИХРЬ ТРОМБОВ');snd95('phase95',e.x);}}
  if(e.cs95==='air'){e.at95+=dt;const u=clamp(e.at95/.6,0,1);e.x=e.ax0+(e.lx-e.ax0)*u;e.y=e.ay0+(e.ly-e.ay0)*u;e.hz95=Math.sin(u*Math.PI)*90;if(u>=1){e.cs95=null;e.hz95=0;}return;}
  steer(e,pdx,pdy,e.spd*c.sm,dt,1.5);e.ga95-=dt;if(e.ga95>0)return;
  if(ph===1){e.ga95=3.2;e.cs95='sq';const tx=p.x+p.vx*.3,ty=p.y+p.vy*.3,T=.9;e.lx=tx;e.ly=ty;tg95({k:'zone',x:tx,y:ty,r:110,T:T+.6,dmg:20,col:C90.red,src:e,key:'gclot1',on:()=>{snd95('land',tx);trauma90(.35);if(G.shock.length<60)G.shock.push({x:tx,y:ty,r:20,R:200,t:0,col:C90.red});}});setTimeout0_95(e,T,()=>{e.cs95='air';e.ax0=e.x;e.ay0=e.y;e.at95=0;});}
  else if(ph===2){e.ga95=2.6;for(let i=0;i<3;i++){const a=rnd(0,TAU),d=i?rnd(80,180):0,x=p.x+Math.cos(a)*d,y=p.y+Math.sin(a)*d;tg95({k:'drop',x,y,r:56,T:1,dmg:12,col:C90.red,src:e,key:'gclot2',snd:i?false:undefined,on:()=>{const P=G.wpud95||(G.wpud95=[]);if(P.length>=6)P.shift();P.push({x,y,r:56,t:7,t0:7});}});}}
  else{e.ga95=3;for(let i=0;i<10;i++)eb95(e.x,e.y,G.t*2+i/10*TAU,200,9,C90.red,7,'cell');if(G.enemies.filter(o=>o.alive&&o.type==='clot90'&&o.gc95===e).length<4){const a=rnd(0,TAU);const m=spawnEnemy('clot90',e.x+Math.cos(a)*50,e.y+Math.sin(a)*50,{noAffix:true,noLoot:true,spawnT:.4,gc95:e});}snd95('spit',e.x);}}
// отложенное действие в такте ИИ (без setTimeout — по времени игры)
function setTimeout0_95(e,T,fn){(e.tq95||(e.tq95=[])).push({t:T,fn});}
function tq95Tick(dt){for(const e of G.enemies){if(!e.alive||!e.tq95||!e.tq95.length)continue;for(const q of e.tq95)q.t-=dt;const R=e.tq95.filter(q=>q.t<=0);e.tq95=e.tq95.filter(q=>q.t>0);for(const q of R)q.fn();}}

// ===== 0.9.5: новые враги сектора X — Клякса, Переписчик, Отливник, Стёртый пилот =====
// --- Клякса: три прыжка, круг приземления, чернильные пятна, брызги после третьего ---
function blotAI95(e,dt,c){const p=G.player,pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1;if(e.bs95===undefined){e.bs95='idle';e.bt95=rnd(1,1.8);e.bj95=0;}
  if(e.bs95==='idle'){const m=clamp((pd-220)/120,-1,1);steer(e,pdx/pd*m-pdy/pd*.5*e.dir,pdy/pd*m+pdx/pd*.5*e.dir,e.spd*.6*c.sm,dt,2);e.bt95-=dt;if(e.bt95<=0&&pd<560&&p.hp>0){e.bj95=0;blotJump95(e);}return;}
  if(e.bs95==='squat'){e.vx*=.8;e.vy*=.8;e.bt95-=dt;if(e.bt95<=0){e.bs95='air';e.at95=0;e.ax0=e.x;e.ay0=e.y;snd95('hop',e.x);}return;}
  if(e.bs95==='air'){e.at95+=dt;const u=clamp(e.at95/.5,0,1);e.x=e.ax0+(e.lx-e.ax0)*u;e.y=e.ay0+(e.ly-e.ay0)*u;e.hz95=Math.sin(u*Math.PI)*44;e.vx=e.vy=0;
    if(u>=1){e.hz95=0;e.bj95++;snd95('splat',e.x);const Z=ez100();if(Z.filter(z=>z.by&&z.by.type==='blot95').length<6)Z.push({x:e.x,y:e.y,r:50,tele:0,t:4,by:e,ink95:1});
      if(e.bj95>=3){if(G.world||onScreen(e))for(let i=0;i<8;i++)eb95(e.x,e.y,i/8*TAU+e.seed,210,8*first90(e),C95.blot,6,'ink');snd95('splat',e.x);e.bs95='idle';e.bt95=2.6;}
      else blotJump95(e);}}}
function blotJump95(e){const p=G.player;let tx=p.x+p.vx*.35+rnd(-40,40),ty=p.y+p.vy*.35+rnd(-40,40);const d=Math.hypot(tx-e.x,ty-e.y),mx=230;if(d>mx){tx=e.x+(tx-e.x)/d*mx;ty=e.y+(ty-e.y)/d*mx;}
  if(!G.world){tx=clamp(tx,40,W-40);ty=clamp(ty,40,H-40);}e.lx=tx;e.ly=ty;e.bs95='squat';e.bt95=.3;
  tg95({k:'zone',x:tx,y:ty,r:50,T:.8,dmg:12,col:C95.blot,src:e,key:'blot95',snd:e.bj95?false:'tlZone',fx:false});}
// --- Переписчик: строка символов висит 1,2 с, потом летит веером; импульс стирает строку целиком ---
let LID95=0;
function scribeAI95(e,dt,c){const p=G.player,pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1;if(e.wr95===undefined)e.wr95=rnd(2,3.5);
  if(e.wq95){const Q=e.wq95;e.vx*=.85;e.vy*=.85;Q.t-=dt;while(Q.t<=0&&Q.i<Q.n){Q.t+=.09;const u=Q.n>1?Q.i/(Q.n-1)-.5:0,x=Q.cx+Q.px*u*Q.L,y=Q.cy+Q.py*u*Q.L;
      const b=eb95(x,y,0,.001,8*first90(e),C95.scribe,6,'sym',{ch:GLYPH95[Math.random()*GLYPH95.length|0],line95:e.line95,hold95:1.2+(Q.n-1-Q.i)*.09,go95:scribeGo95});if(b)b.life=12;Q.i++;if(Q.i===1)snd95('write',e.x);}
    if(Q.i>=Q.n)e.wq95=null;return;}
  const m=clamp((pd-300)/120,-1,1);steer(e,pdx/pd*m-pdy/pd*.6*e.dir,pdy/pd*m+pdx/pd*.6*e.dir,e.spd*c.sm,dt,2.5);if(Math.random()<dt*.25)e.dir*=-1;
  e.wr95-=dt;e.charging=e.wr95<.4;if(e.wr95<=0&&pd<640&&p.hp>0){e.wr95=5.2;e.line95=++LID95;const a=Math.atan2(pdy,pdx),L=150,cx=e.x+Math.cos(a)*50,cy=e.y+Math.sin(a)*50;e.wq95={n:7,i:0,t:0,cx,cy,px:-Math.sin(a),py:Math.cos(a),L};tlog95('scribe95',1.2);tel90use('scribe95');}}
function scribeGo95(b){const p=G.player;if(!p)return;const a=Math.atan2(p.y-b.y,p.x-b.x)+rnd(-.06,.06);b.vx=Math.cos(a)*260;b.vy=Math.sin(a)*260;b.frz95=0;if(Math.random()<.2)snd95('fling',b.x);}
function scribeErase95(p,R){const ids=new Set();for(const b of G.eb)if(b.line95&&b.hold95>0&&Math.hypot(b.x-p.x,b.y-p.y)<R+40)ids.add(b.line95);if(!ids.size)return;let n=0;
  for(const b of G.eb)if(b.line95&&ids.has(b.line95)&&b.life>0){b.life=0;n++;glyph95(b.x,b.y,1,C95.scribe);}if(n){floater(p.x,p.y-50,'СТРОКА СТЁРТА · '+n,C95.scribe);snd95('fade95',p.x);}}
// --- Отливник: язык пустоты от края, стрельба с кончика; гибель очищает края на 6 с ---
function ebbEdge95(e){const ds=[e.x,W-e.x,e.y,H-e.y];let k=0;for(let i=1;i<4;i++)if(ds[i]<ds[k])k=i;return k;}
function ebbAI95(e,dt,c){const p=G.player;if(e.eg95===undefined){e.eg95=G.world?-1:ebbEdge95(e);e.sh95=rnd(1.5,2.5);}
  let ex=e.x,ey=e.y,nx=0,ny=0;if(e.eg95>=0){const k=e.eg95;if(k===0){ex=0;ey=e.y;nx=1;}else if(k===1){ex=W;ey=e.y;nx=-1;}else if(k===2){ex=e.x;ey=0;ny=1;}else{ex=e.x;ey=H;ny=-1;}
    const along=k<2?clamp(p.y,80,H-80):clamp(p.x,80,W-80),depth=200+30*Math.sin(G.t*.8+e.seed),tx=k<2?ex+nx*depth:along,ty=k<2?along:ey+ny*depth;
    steer(e,(k<2?tx:along)-e.x,(k<2?along:ty)-e.y,e.spd*c.sm,dt,2);if(k<2)e.x=clamp(e.x,Math.min(ex,ex+nx*260),Math.max(ex,ex+nx*260));else e.y=clamp(e.y,Math.min(ey,ey+ny*260),Math.max(ey,ey+ny*260));e.tg95={x1:k<2?ex:e.x,y1:k<2?e.y:ey,x2:e.x,y2:e.y};}
  else{const pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1,m=clamp((pd-300)/120,-1,1);steer(e,pdx/pd*m,pdy/pd*m,e.spd*c.sm,dt,2);e.tg95={x1:e.x-pdx/pd*200,y1:e.y-pdy/pd*200,x2:e.x,y2:e.y};}
  e.sh95-=dt;e.charging=e.sh95<.45;if(e.sh95<=0&&p.hp>0){e.sh95=2.6;const a=Math.atan2(p.y-e.y,p.x-e.x);if(G.world||onScreen(e))for(let i=-1;i<=1;i++)eb95(e.x,e.y,a+i*.16,250,8*first90(e),C95.ebb,6,'ink');snd95('spit',e.x);}}
function tongueBuild95(){const X=G.x90;const L=[];for(const e of G.enemies)if(e.alive&&e.type==='ebb95'&&e.tg95&&e.spawnT<=0)L.push({x1:e.tg95.x1,y1:e.tg95.y1,x2:e.tg95.x2,y2:e.tg95.y2,w:70,e});if(X&&inMission())X.tongue95=L;else G.wtongue95=L;}
function ebbGone95(e,silent){const X=G.x90;if(e.tg95&&!silent){const s=e.tg95;for(let i=0;i<=8;i++){const u=i/8;glyph95(s.x1+(s.x2-s.x1)*u,s.y1+(s.y2-s.y1)*u,1,C95.ebb);}}
  if(!silent&&X&&inMission()&&X.er){X.er.clrT95=6;X.er.clr95=1;floater(e.x,e.y-30,'ЯЗЫК СХЛОПНУЛСЯ · КРАЯ ЧИСТЫ 6 С',C95.ebb);snd95('fade95',e.x);}}
// --- Стёртый пилот: летает по вашим правилам — рывок (откат 1,5 с), импульс, заряд; роняет жетон ---
const LOSTN95=['ЛЕВ','ИРА','ТИМУР','ВАРЯ','ОЛЕГ','НИКА','ДАН','ЕВА','РОМАН','СОНЯ','ГЛЕБ','ЯНА'];
function lostSkin95(){const S=G.save,own=(S&&S.ownSkins||[]).filter(k=>SKINS[k]&&k!==curSkin());return own.length?own[Math.random()*own.length|0]:'base';}
function lostAI95(e,dt,c){const p=G.player,pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1;
  if(!e.lp95){e.lp95=1;e.skin95=lostSkin95();e.nm95=LOSTN95[Math.random()*LOSTN95.length|0]+' · '+String(100+Math.random()*899|0);e.dcd95=1.5;e.pcd95=5;e.ccd95=4;e.fcd95=1;e.elite95=1;e.face=Math.atan2(pdy,pdx);}
  if(e.dcd95>0)e.dcd95-=dt;if(e.pcd95>0)e.pcd95-=dt;if(e.ccd95>0)e.ccd95-=dt;
  e.face=Math.atan2(pdy,pdx);
  if(e.dsh95){const D=e.dsh95;D.t-=dt;if(D.st==='aim'){e.vx*=.8;e.vy*=.8;if(D.t<=0){D.st='go';D.t=.16;e.vx=Math.cos(D.a)*1450;e.vy=Math.sin(D.a)*1450;e.inv95=.16;snd95('pilotDash',e.x);}}else{if(SET.fx)part(e.x,e.y,-e.vx*.1,-e.vy*.1,.3,C95.lost,2.2);if(D.t<=0){e.dsh95=null;e.dcd95=1.5;e.vx*=.2;e.vy*=.2;}}return;}
  if(e.chg95){const C=e.chg95;C.t-=dt;e.vx*=.9;e.vy*=.9;C.a+=clamp(angDiff(Math.atan2(pdy,pdx),C.a),-.8*dt,.8*dt);if(C.t<=0){e.chg95=null;e.ccd95=5;const b=shootE(e.x+Math.cos(C.a)*16,e.y+Math.sin(C.a)*16,C.a,900,18*first90(e),'#ffffff',7);snd95('beamFire',e.x);trauma90(.12);}return;}
  if(e.pls95){const P=e.pls95;P.t-=dt;e.vx*=.85;e.vy*=.85;if(P.t<=0){e.pls95=null;e.pcd95=7;wv95({x:e.x,y:e.y,v:620,w:12,dmg:12*first90(e),col:C95.lost,R:170});snd95('pilotPulse',e.x);trauma90(.15);for(const b of G.pb)if(Math.hypot(b.x-e.x,b.y-e.y)<170)b.life=0;}return;}
  // решения
  if(e.dcd95<=0&&(pd<160||Math.random()<dt*.5)&&p.hp>0){const side=Math.random()<.5?-1:1,a=Math.atan2(pdy,pdx)+side*1.1;e.dsh95={st:'aim',t:.45*tel90('lost95'),a};e.tl95=e.dsh95.t;snd95('tlDash',e.x);tlog95('lostDash',e.dsh95.t);return;}
  if(e.pcd95<=0&&pd<175&&p.hp>0){e.pls95={t:.6};e.tl95=.6;snd95('tlRing',e.x);tlog95('lostPulse',.6);return;}
  if(e.ccd95<=0&&pd<620&&pd>180&&p.hp>0){e.chg95={t:1.2,a:Math.atan2(pdy,pdx)};e.tl95=1.2;tlog95('lostCharge',1.2);return;}
  const m=clamp((pd-260)/100,-1,1);steer(e,pdx/pd*m-pdy/pd*.7*e.dir,pdy/pd*m+pdx/pd*.7*e.dir,e.spd*c.sm,dt,3);if(Math.random()<dt*.35)e.dir*=-1;
  e.fcd95-=dt;e.charging=e.fcd95<.3;if(e.fcd95<=0){e.fcd95=1.4;e.fb95=3;e.fbT95=0;}
  if(e.fb95>0){e.fbT95-=dt;if(e.fbT95<=0){e.fb95--;e.fbT95=.12;shootE(e.x,e.y,Math.atan2(pdy,pdx)+rnd(-.05,.05),480,6*first90(e),C95.lost,4);}}}
function lostDrop95(e){const X=G.x90;const L=X&&inMission()?(X.loot95||(X.loot95=[])):(G.wloot95||(G.wloot95=[]));L.push({k:'tag',x:e.x,y:e.y,t:0,nm:e.nm95||'ПИЛОТ'});floater(e.x,e.y-30,'ЖЕТОН · '+(e.nm95||''),C95.lost);}

