// ===== 0.9 → 0.9.5: враги сектора IX — ИИ, урон, гибель (переработка атак) =====
function nets90(){const X=G.x90;if(X&&inMission())return X.nets;return G.wn90||(G.wn90=[]);}
function nearLock90(x,y){const X=G.x90;if(!X||!inMission()||!X.locks.length)return false;for(const L of X.locks)if(Math.abs(lu90(L,x,y)-L.pos)<60)return true;return false;}
function comp90(x,y){const X=G.x90;if(!X||!inMission()||!X.locks.length)return true;for(const L of X.locks)if((lu90(L,x,y)-L.pos)*(lu90(L,W/2,H/2)-L.pos)<=0)return false;return true;}
function place90(e,fn,minP){const p=G.player,m=90;let best=null,bd=-1;const R=Math.random;
  for(let i=0;i<40;i++){const x=G.world?e.x+rnd(-260,260):m+R()*(W-2*m),y=G.world?e.y+rnd(-260,260):m+R()*(H-2*m);if(fn&&!fn(x,y))continue;if(nearLock90(x,y)||!comp90(x,y)||blocked95(x,y,40))continue;const dp=p?Math.hypot(x-p.x,y-p.y):999;if(dp<(minP||220))continue;
    let dn=1e9;for(const o of G.enemies)if(o!==e&&o.alive&&STATIC.has(o.type))dn=Math.min(dn,Math.hypot(o.x-x,o.y-y));const sc=Math.min(dn,400)+Math.min(dp,500)*.3;if(sc>bd){bd=sc;best={x,y};}}
  if(!best&&!G.world)best={x:W/2+rnd(-W*.12,W*.12),y:H/2+rnd(-H*.25,H*.25)};if(best){e.x=best.x;e.y=best.y;}e.vx=e.vy=0;e.spawnT=Math.max(e.spawnT||0,.6);}
const CAP90={neuron90:8,typo100:4,phago90:6,echo100:4,noname100:2,fixer100:3,eraser100:4,hollow100:4,keeper90:4,clot90:5,hunt95:6,spasm95:2,cell95:5,guard95:2,blot95:3,scribe95:3,ebb95:2,lost95:1};
function cap90(e){if(e.cap90||e.zone||G.world||e.elite95||e.host85||e.pack95||e.noCap95||e.net90)return;e.cap90=1;const L=G.x110&&inMission()&&CAP110[e.type]!==undefined?CAP110[e.type]:CAP90[e.type];if(L===undefined)return;let n=0;for(const o of G.enemies)if(o!==e&&o.alive&&o.type===e.type)n++;if(n<L)return;
  // замена — враг того же сектора, у которого есть место (а не безликий стрелок)
  let nt=e.type==='gunner'?'phantom':'gunner';const X=G.x90,FB=X&&inMission()?FB95[X.sec]:null;if(FB){for(const t of shuffle(FB.slice())){if(t===e.type)continue;const c=G.x110&&inMission()&&CAP110[t]!==undefined?CAP110[t]:CAP90[t];let m=0;for(const o of G.enemies)if(o.alive&&o.type===t)m++;if(c===undefined||m<c){nt=t;break;}}}
  const k=e.maxHp/EDEF[e.type].hp;e.type=nt;e.maxHp=e.hp=EDEF[nt].hp*k;e.r=EDEF[nt].r;e.contact=EDEF[nt].contact;e.spd=EDEF[nt].spd*rnd(.92,1.08);e.noBar90=0;e.hid90=false;}
const FB95={8:['clot90','phago90','cell95','keeper90'],9:['blot95','eraser100','hollow100','typo100']};
function s90Update(e,dt,c){cap90(e);if(e.weak95>0)e.weak95-=dt;if(e.inv95>0)e.inv95-=dt;switch(e.type){
    case 'clot90':clotAI90(e,dt,c);return true;
    case 'valve90':valveAI90(e,dt);return true;
    case 'keeper90':keeperAI90(e,dt,c);return true;
    case 'phago90':phagoAI90(e,dt,c);return true;
    case 'neuron90':neuronAI90(e,dt);return true;
    case 'embryo90':embryoAI90(e,dt);return true;
    case 'pass90':passAI90(e,dt);return true;}
  if(typeof ai95==='function'&&ai95(e,dt,c))return true;
  return typeof ai100==='function'?ai100(e,dt,c):false;}
// --- Тромб: прыжок-слитие с тенью на полу, лужа на месте приземления, слияние в Сгусток ---
function clotAI90(e,dt,c){const p=G.player,X=G.x90;const pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1;
  if(e.lp===undefined)e.lp=rnd(1.2,2.4);if(e.cs===undefined)e.cs='crawl';
  if(e.cs==='squat'){e.vx*=.8;e.vy*=.8;e.st95-=dt;e.sq95=Math.min(1,e.sq95+dt/.6);if(e.st95<=0){e.cs='air';e.ax0=e.x;e.ay0=e.y;e.at95=0;snd95('leap',e.x);}return;}
  if(e.cs==='air'){e.at95+=dt;const u=clamp(e.at95/.5,0,1);e.x=e.ax0+(e.lx-e.ax0)*u;e.y=e.ay0+(e.ly-e.ay0)*u;e.hz95=Math.sin(u*Math.PI)*(e.big95?70:50);e.vx=e.vy=0;if(u>=1){e.cs='crawl';e.hz95=0;e.sq95=0;e.lp=rnd(3.6,4.8);}return;}
  steer(e,pdx,pdy,e.spd*c.sm,dt,2);e.lp-=dt;const R=e.big95?420:300;
  if(e.lp<=0&&pd<R&&p.hp>0){e.cs='squat';e.st95=.6*tel90('clot90');e.sq95=0;let tx=p.x+p.vx*.3,ty=p.y+p.vy*.3;if(!G.world){tx=clamp(tx,40,W-40);ty=clamp(ty,40,H-40);}e.lx=tx;e.ly=ty;
    tg95({k:'zone',x:tx,y:ty,r:e.big95?60:46,T:e.st95+.5,dmg:16,col:C90.red,src:e,key:'clot90',snd:'tlZone',telK:false,on:()=>{clotLand95(e,tx,ty);}});}
  // слияние: два Тромба рядом — один Сгусток
  if(!e.big95&&e.cs==='crawl'&&!G.world&&Math.random()<dt*2)for(const o of G.enemies){if(o===e||!o.alive||o.type!=='clot90'||o.big95||o.cs!=='crawl'||o.spawnT>0)continue;if(Math.hypot(o.x-e.x,o.y-e.y)<e.r+o.r+14){clotMerge95(e,o);break;}}}
function clotLand95(e,x,y){const X=G.x90;snd95('land',x);trauma90(.12);if(G.shock.length<60)G.shock.push({x,y,r:10,R:e.big95?70:56,t:0,col:C90.red,thin:true});
  if(X&&inMission()){if(X.pud.length>=5)X.pud.shift();X.pud.push({x,y,r:e.big95?58:46,t:10,t0:10,bub:[]});if(!X.hint.pud){X.hint.pud=1;floater(x,y-36,'ЛУЖА · ВЯЗКО · ИМПУЛЬС РАСТВОРЯЕТ',C90.red);}}
  else{const P=G.wpud95||(G.wpud95=[]);if(P.length>=5)P.shift();P.push({x,y,r:46,t:8,t0:8});}}
function clotMerge95(e,o){const hp=(e.hp+o.hp)*.8,mx=(e.maxHp+o.maxHp)*.8;o.alive=false;e.big95=1;e.r=26;e.hp=hp;e.maxHp=mx;e.contact=Math.round((e.contact||14)*1.3);e.x=(e.x+o.x)/2;e.y=(e.y+o.y)/2;explode(e.x,e.y,C90.red,14,.7);floater(e.x,e.y-34,'СЛИЯНИЕ · СГУСТОК',C90.red);snd95('squeeze',e.x);}
// --- Клапан: тельца вдоль потока на открытых тактах, волна с двумя проходами, окно ✦ ---
function valveAI90(e,dt){const X=G.x90,p=G.player;e.vx=e.vy=0;
  if(!e.v90){e.v90=1;e.vb=rnd(0,.6);e.vi=0;
    if(X&&inMission()&&X.flows.length){let cand=[];for(const f of X.flows){if(f.valve&&f.valve.alive)continue;for(let i=7;i<=25;i+=2){const q=f.pts[i];if(q&&q.x>70&&q.x<W-70&&q.y>70&&q.y<H-70&&Math.hypot(q.x-p.x,q.y-p.y)>260&&!blocked95(q.x,q.y,30))cand.push([f,q,i]);}}
      if(cand.length){const [f,q,i]=cand[Math.random()*cand.length|0];e.x=q.x;e.y=q.y;f.valve=e;e.flow90=f;e.fi95=i;e.spawnT=Math.max(e.spawnT,.6);}else place90(e,null,260);}
    else if(inMission())place90(e,null,260);}
  if(e.spawnT>0)return;const T=1.2;e.vb+=dt;
  if(e.vb>=T){e.vb-=T;e.vi=(e.vi+1)%4;
    if(e.vi===3){const g=e.gap95||valveGaps95();wv95({x:e.x,y:e.y,v:320,w:12,dmg:15*first90(e),col:C90.ark,gaps:g,R:118});snd90('valve');trauma90(.06);tel90use('valve90');e.gap95=null;}
    else{if(e.vi===0)weak95(e,.4,2);
      // три кровяных тельца вдоль потока
      let a=Math.atan2(p.y-e.y,p.x-e.x),sp=320;const f=e.flow90;if(f&&f.pts&&e.fi95!==undefined){const q=f.pts[e.fi95];a=Math.atan2(q.ty,q.tx);if(f.rev95)a+=Math.PI;sp=120*(f.spd95||1)+200;}
      if(G.world||onScreen(e))for(let i=0;i<3;i++)eb95(e.x+Math.cos(a)*e.r,e.y+Math.sin(a)*e.r,a+(i-1)*.09,sp*(1-.06*Math.abs(i-1)),8*first90(e),C90.blood,6,'cell');snd95('spit',e.x);
      if(e.vi===2)e.gap95=valveGaps95();}}
  e.tele90=e.vi===2&&e.vb>T-.45*tel90('valve90');e.tl95=e.vi===2?1:0;}
function valveGaps95(){const a=rnd(0,TAU),w=50*Math.PI/180;return [{a,w},{a:a+Math.PI,w}];}
// --- Смотритель: маршрут из трёх точек, прожектор, метка «ЦЕЛЬ», иглы-седативы ---
function keeperRoute95(e){const pts=[];for(let i=0;i<3;i++){let x,y,k=0;do{x=G.world?e.x+rnd(-320,320):rnd(90,W-90);y=G.world?e.y+rnd(-320,320):rnd(90,H-90);}while(++k<10&&!G.world&&(blocked95(x,y,30)||!comp90(x,y)));pts.push({x,y});}return pts;}
function keeperAI90(e,dt,c){const p=G.player,X=inMission()?G.x90:null;const pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1;
  if(!e.st90){e.st90=1;e.st='patrol';e.fa=Math.atan2(pdy,pdx)+Math.PI;e.see=0;e.rt95=keeperRoute95(e);e.ri95=0;e.cd=2.5;}
  const sm=c.sm;
  if(e.st==='patrol'||e.st==='wake'){
    if(e.st==='wake'){const q=e.wk90;if(!q||q.st!=='sleep'){e.st='patrol';e.wk90=null;}else{const d=Math.hypot(q.x-e.x,q.y-e.y);if(d>60)steer(e,q.x-e.x,q.y-e.y,e.spd*.6*sm,dt,3);else{e.vx*=.85;e.vy*=.85;if(!q.kby){q.kby=e;q.kch=0;}}}}
    else{if(G.world&&(!e.rt95||Math.hypot(e.rt95[0].x-e.x,e.rt95[0].y-e.y)>900))e.rt95=keeperRoute95(e);const w=e.rt95[e.ri95%3];if(Math.hypot(w.x-e.x,w.y-e.y)<40){e.ri95++;e.pause95=.8;}
      if(e.pause95>0){e.pause95-=dt;e.vx*=.9;e.vy*=.9;e.fa+=Math.sin(G.t*1.6+e.seed)*dt*.9;}else steer(e,w.x-e.x,w.y-e.y,e.spd*.55*sm,dt,2);
      if(X&&X.pods&&Math.random()<dt*.12)for(const q of X.pods){if(q.st==='sleep'&&!q.kby&&Math.hypot(q.x-e.x,q.y-e.y)<300){e.st='wake';e.wk90=q;break;}}}
    const sp=Math.hypot(e.vx,e.vy);if(sp>8&&!(e.pause95>0))e.fa+=clamp(angDiff(Math.atan2(e.vy,e.vx),e.fa),-4*dt,4*dt);
    const inCone=pd<240&&Math.abs(angDiff(Math.atan2(pdy,pdx),e.fa))<35*Math.PI/180&&p.hp>0&&!lockBlock90(e,p)&&!wallBlock95(e,p);
    if(inCone)e.see+=dt;else e.see=Math.max(0,e.see-dt*1.5);
    if(e.see>=.6)keeperAlert90(e);}
  else{e.fa+=clamp(angDiff(Math.atan2(pdy,pdx),e.fa),-6*dt,6*dt);const m=clamp((pd-320)/100,-1,1);steer(e,pdx/pd*m-pdy/pd*.5*e.dir,pdy/pd*m+pdx/pd*.5*e.dir,e.spd*sm,dt,3);if(Math.random()<dt*.3)e.dir*=-1;
    if(e.bn>0){e.bt-=dt;if(e.bt<=0){e.bn--;e.bt=.16;const a=Math.atan2(pdy,pdx),lt=pd/330*.9;let a2=Math.atan2(p.y+(p.vy||0)*lt-e.y,p.x+(p.vx||0)*lt-e.x);if(Math.abs(angDiff(a2,a))<.06)a2=a+(e.uid%2?.06:-.06);for(const q of [a,a2]){const b=eb95(e.x,e.y,q,330,10*first90(e),'#fff2c0',4,'needle');if(b)b.slow95=1.5;}snd95('needle',e.x);}}
    else{e.cd-=dt;e.charging=e.cd<.45;if(e.cd<=0&&pd<700){e.bn=1;e.bt=0;e.cd=2.4;}}
    if(pd>700||lockBlock90(e,p))e.lost90=(e.lost90||0)+dt;else e.lost90=0;if(e.lost90>5){e.st='patrol';e.see=0;e.lost90=0;}}}
function keeperAlert90(e){if(e.st==='alert')return;const X=G.x90,p=G.player;e.st='alert';e.see=0;e.cd=1.4;if(e.wk90){const q=e.wk90;if(q.kby===e){q.kby=null;q.kch=0;}e.wk90=null;}
  if(X&&X.alarmOn&&!(storyFlag('well38')==='answer'&&G.t-X.born<10)&&(!e.spotT||G.t-e.spotT>6)){e.spotT=G.t;alarm90(5,1,e.x,e.y);}
  // вспышка-прожектор: конус горит 0,5 с — 15 урона, затем метка «ЦЕЛЬ»
  const fa=e.fa;tg95({k:'cone',x:e.x,y:e.y,a:fa,arc:70*Math.PI/180,len:260,T:.5,dmg:15,col:'#fff2c0',src:e,key:'keeper90',snd:'spot',on:()=>{snd95('flash',e.x);if(p&&Math.hypot(p.x-e.x,p.y-e.y)<300&&Math.abs(angDiff(Math.atan2(p.y-e.y,p.x-e.x),fa))<.7)mark95('ЦЕЛЬ',6);}});
  floater(e.x,e.y-e.r-14,'ЗАМЕЧЕН','#ffe9b0');snd90('spot');if(X&&!X.hint.keep){X.hint.keep=1;floater(p.x,p.y-56,'БЕЙТЕ СМОТРИТЕЛЕЙ В СПИНУ — ТИХО','#ffe9b0');}}
// --- Фагоцит: выпад псевдоподией, видимые проглоченные снаряды, спираль на десятом ---
function phagoAI90(e,dt,c){const p=G.player;if(e.orbA===undefined){e.orbA=Math.atan2(e.y-p.y,e.x-p.x);e.orbK=1;e.lunge95=rnd(1.5,3);}
  e.orbK=Math.min(1,(e.orbK||0)+dt*.6);if(e.nos95>0)e.nos95-=dt;
  if(e.burst90>0){e.burst90-=dt;e.vx*=.9;e.vy*=.9;
    if(e.burst90<=0){const n=Math.max(8,6+Math.floor((e.fed||0)/2)*2),col=shipCol();e.spir95={i:0,n,a:e.seed,t:0,col};e.burst90=-1;snd90('burst');trauma90(.2);}return;}
  if(e.spir95){const S=e.spir95;S.t-=dt;e.vx*=.9;e.vy*=.9;while(S.t<=0&&S.i<S.n){S.t+=.045;const a=S.a+S.i*.62;eb95(e.x,e.y,a,230,9*first90(e),S.col,5,'needle');S.i++;}if(S.i>=S.n){explode(e.x,e.y,'#ff8a5c',18,.7);e.burstDone=1;kill(e);}return;}
  if(e.lg95){const L=e.lg95;e.vx*=.85;e.vy*=.85;L.t-=dt;if(L.t<=0){e.lg95=null;e.nos95=.8;weak95(e,.8,1.5);}return;}
  e.lunge95-=dt;const pd=Math.hypot(p.x-e.x,p.y-e.y);
  if(e.lunge95<=0&&pd<240&&p.hp>0){e.lunge95=3;const a=Math.atan2(p.y-e.y,p.x-e.x),T=.5*tel90('phago90');e.lg95={t:T+.15,a};tg95({k:'line',x:e.x,y:e.y,x2:e.x+Math.cos(a)*140,y2:e.y+Math.sin(a)*140,w:22,T,dmg:12,col:'#ff8a5c',src:e,key:'phago90',snd:'tlLine',telK:false,track:o=>{o.x=e.x;o.y=e.y;o.x2=e.x+Math.cos(e.lg95?e.lg95.a:0)*140;o.y2=e.y+Math.sin(e.lg95?e.lg95.a:0)*140;},on:()=>snd95('lash',e.x)});return;}
  e.orbA+=1.4*e.dir*dt;const R=90+(e.fed||0)*2,tx=p.x+Math.cos(e.orbA)*R,ty=p.y+Math.sin(e.orbA)*R;steer(e,tx-e.x,ty-e.y,e.spd*c.sm*(Math.hypot(tx-e.x,ty-e.y)>160?1.4:1),dt,3*e.orbK+.5);}
// --- Нейрон: импульс бежит по лучам, жжёт на луче, узел выпускает кольцо ---
function neuronAI90(e,dt){e.vx=e.vy=0;const N=nets90();
  if(!e.n90){e.n90=1;if(!e.net90){if(inMission())place90(e,null,240);const n={nodes:[e],beams:[],key:'',impT:rnd(3,5)};e.net90=n;N.push(n);
      const alive=G.enemies.filter(o=>o.alive&&o.type==='neuron90').length,k=Math.min(rk90()>=1?3:2,8-alive);
      for(let i=0;i<k;i++){let x=e.x,y=e.y;for(let t=0;t<12;t++){const a=rnd(0,TAU),d=rnd(180,300);x=e.x+Math.cos(a)*d;y=e.y+Math.sin(a)*d;if(G.world||x>70&&x<W-70&&y>70&&y<H-70&&!nearLock90(x,y)&&comp90(x,y)&&!blocked95(x,y,30))break;}
        if(!G.world){x=clamp(x,70,W-70);y=clamp(y,70,H-70);}const s=spawnEnemy('neuron90',x,y,{net90:n,n90:1,spawnT:.8,noAffix:true,zone:e.zone});n.nodes.push(s);}}
    else if(!e.net90.nodes.includes(e))e.net90.nodes.push(e);}}
function netImp95(n,dt){const p=G.player;if(!n.beams.length)return;if(n.impT===undefined)n.impT=4;
  if(!n.imp){n.impT-=dt;const live=n.nodes.filter(o=>o.alive&&o.spawnT<=0);if(n.impT<=.5&&!n.chg95&&live.length>1){n.chg95=live[Math.random()*live.length|0];snd95('impulse',n.chg95.x);}
    if(n.impT<=0&&n.chg95){const s=n.chg95;n.chg95=null;n.impT=5;if(!s.alive)return;n.imp={front:[],done:new Set([s]),hit:new Set()};for(const q of n.beams)if(!(q.cut>0)&&(q.a===s||q.b===s))n.imp.front.push({q,from:s,to:q.a===s?q.b:q.a,u:0});tel90use('neuron90');tlog95('neuron90',.5);}return;}
  const I=n.imp,nf=[];for(const f of I.front){const q=f.q;if(q.cut>0||!f.to.alive||!f.from.alive)continue;const L=Math.hypot(f.to.x-f.from.x,f.to.y-f.from.y)||1;f.u+=260*dt/L;
    if(p&&p.hp>0&&p.dashT<=0&&!I.hit.has(q)&&segDist(q.a.x,q.a.y,q.b.x,q.b.y,p.x,p.y)<6+p.r*.55){I.hit.add(q);damagePlayer(8);floater(p.x,p.y-30,'РАЗРЯД −8','#ffe47a');}
    if(f.u>=1){const nd=f.to;if(!I.done.has(nd)){I.done.add(nd);if(G.world||onScreen(nd)){for(let i=0;i<6;i++)shootE(nd.x,nd.y,i/6*TAU+G.t,210,7,'#ffe47a',5);snd95('zap',nd.x);}nd.flash=.12;for(const q2 of n.beams)if(q2!==q&&!(q2.cut>0)&&(q2.a===nd||q2.b===nd)){const to=q2.a===nd?q2.b:q2.a;if(!I.done.has(to))nf.push({q:q2,from:nd,to,u:0});}}}else nf.push(f);}
  I.front=nf;if(!nf.length)n.imp=null;}
// --- Эмбрион: пульс чаще к вылуплению, силуэт за 3 с, брызги при раннем разрыве, окно у Перерождённого ---
function embryoAI90(e,dt){e.vx=e.vy=0;if(e.hatch===undefined){if(inMission())place90(e,null,220);e.hatch=pk90(18,15,12);e.hatch0=e.hatch;
    if(G.enemies.filter(o=>o.alive&&o.type==='embryo90').length>4){e.type='clot90';e.r=EDEF.clot90.r;e.contact=EDEF.clot90.contact;return;}}
  if(e.spawnT>0)return;e.hatch-=dt;if(e.hatch<3&&!e.hTy){e.hTy=embryoPick95(e);snd95('silhouette',e.x);e.tl95=3;}if(e.hatch<=0)embryoHatch90(e);}
function embryoPick95(e){let best=null,bd=500;for(const o of G.enemies){if(o===e||!o.alive||o.spawnT>0||STATIC.has(o.type)||EDEF[o.type].passive||o.sbk||EDEF[o.type].sbp||['embryo90','neuron90','pass90','witness100','tide100','echo100','lost95','gclot95'].includes(o.type))continue;const d=Math.hypot(o.x-e.x,o.y-e.y);if(d<bd){bd=d;best=o;}}return best?best.type:'clot90';}
function embryoHatch90(e){const ty=e.hTy||embryoPick95(e);e.alive=false;explode(e.x,e.y,'#ff9fb0',12,.6);snd90('hatch');
  const n=spawnEnemy(ty,e.x,e.y,{noAffix:true,noLoot:true,reborn90:1,spawnT:.4,zone:e.zone});n.hp*=1.4;n.maxHp=n.hp;n.dmgK90=1.2;n.contact=Math.round((n.contact||0)*1.2);n.weak95=2.4;n.weakK95=1.5;
  floater(e.x,e.y-24,'ПЕРЕРОЖДЁННЫЙ · '+EDEF[ty].name.toUpperCase(),'#ff9fb0');}
// --- Пассажир ---
function passAI90(e,dt){const p=G.player,X=G.x90;if(e.life90===undefined){e.life90=60;e.hostT=0;e.cd=1.2;}
  e.life90-=dt;if(e.hostT>0)e.hostT-=dt;if(e.pull95>0)e.pull95-=dt;
  if(e.life90<=0||e.leave90){if(!e.leave90){e.leave90=1;floater(e.x,e.y-26,'ПАССАЖИР УЛЕТАЕТ В ГЛУБИНУ',C90.pil);}
    const ex=e.x<W/2?-80:W+80;steer(e,ex-e.x,(H/2-e.y)*.2,240,dt,3);if(e.x<-60||e.x>W+60){e.alive=false;passSaved90(e);}return;}
  if(!e.oa)e.oa=rnd(0,TAU);e.oa+=dt*.5;const R=e.pull95>0?58:150,tx=p.x+Math.cos(e.oa)*R,ty=p.y+Math.sin(e.oa)*R;steer(e,tx-e.x,ty-e.y,e.spd*(e.pull95>0?2.2:1),dt,e.pull95>0?3.5:2.2);
  e.cd-=dt;if(e.cd>0)return;
  if(e.hostT>0&&p.hp>0){e.cd=1;shootE(e.x,e.y,Math.atan2(p.y-e.y,p.x-e.x),260,5,C90.pil,4);return;}
  let t_=null,bd=420;for(const o of G.enemies){if(!o.alive||o===e||EDEF[o.type].passive||NOAUTO.has(o.type)||!targetable(o))continue;const d=Math.hypot(o.x-e.x,o.y-e.y);if(d<bd){bd=d;t_=o;}}
  if(t_){const q=aimPt(t_),a=Math.atan2(q.y-e.y,q.x-e.x);e.face90=a;G.pb.push({x:e.x,y:e.y,px:e.x,py:e.y,vx:Math.cos(a)*760,vy:Math.sin(a)*760,dmg:(G.st?G.st.dmg:10)*.6,pierce:0,rico:0,life:.8,hit:[e],drone:true,al90:1,pas95:1});e.cd=.55;}else e.cd=.3;}
function passSaved90(e){const q=e.pod90;if(q&&!e.saved90){e.saved90=1;podSet90(q.id,'w');}}
// --- урон ---
function s90Hurt(e,dmg,src){src=src||{};const p=G.player;dmg*=weakK95(e);
  switch(e.type){
    case 'clot90':e.ut=0;if(src.charged&&!src.drone){clotDissolve90(e);return 0;}return dmg;
    case 'valve90':if(e.vi===3){sbBlock(e);e.inv95=.15;if(G.x90&&!G.x90.hint.valveC){G.x90.hint.valveC=1;floater(e.x,e.y-34,'ЗАКРЫТ · ЖДИТЕ ТАКТ',C90.ark);}return 0;}return dmg;
    case 'keeper90':{const back=Math.abs(angDiff(Math.atan2(p.y-e.y,p.x-e.x),e.fa||0))>110*Math.PI/180;e.patK=e.st!=='alert';e.back90=back;
      if(back){dmg*=2;if(G.x90&&!G.x90.hint.back){G.x90.hint.back=1;floater(e.x,e.y-26,'В СПИНУ ×2','#ffe9b0');}}
      if(e.wk90){const q=e.wk90;if(q.kby===e){q.kby=null;q.kch=0;}e.wk90=null;e.st='patrol';}
      if(!back&&e.st!=='alert'&&e.hp-dmg>0)keeperAlert90(e);else if(back&&e.hp-dmg>0&&e.st!=='alert')e.see=Math.max(e.see,.45);return dmg;}
    case 'phago90':return src.charged||src.blast?dmg*1.5:dmg;
    case 'pass90':if(src.pulse)return 0;if(!src.al90){if(!(e.hostT>0))floater(e.x,e.y-26,'ПАССАЖИР РАНЕН · ОН ВАС НЕ УЗНАЁТ',C90.red);e.hostT=4;}return dmg;}
  if(typeof hurt95==='function'){const r=hurt95(e,dmg,src);if(r!==undefined)return r;}
  return typeof hurt100==='function'?hurt100(e,dmg,src):dmg;}
// --- гибель ---
function s90Killed(e,silent){const X=G.x90;if(e.ob96&&!silent&&X&&X.alarmOn&&inMission()){alarm90(-4);floater(e.x,e.y-26,'ТИШЕ · −4',C90.warm);}
  switch(e.type){
    case 'keeper90':if(!silent&&e.back90&&e.patK){alarm90(-8);floater(e.x,e.y-26,'ТИХО',C90.warm);hs90(.06,0);snd90('quiet');conEvent('quiet90');if(G.mc)G.mc.quiet90=(G.mc.quiet90||0)+1;}
      if(e.wk90&&e.wk90.kby===e){e.wk90.kby=null;e.wk90.kch=0;}break;
    case 'valve90':if(e.flow90)e.flow90.valve=null;if(!silent)alarm90(3,1,e.x,e.y);break;
    case 'neuron90':if(!silent)alarm90(3,0);break;
    case 'embryo90':if(!silent&&e.hatch>0){for(let i=0;i<3;i++)eb95(e.x,e.y,rnd(0,TAU),170,7,'#ff9fb0',5,'cell',{life:.8});}break;
    case 'pass90':if(silent){passSaved90(e);break;}{const q=e.pod90;if(q&&!e.saved90){podSet90(q.id,'l');q.st='lost';}if(G.mc)G.mc.passKill90=1;floater(e.x,e.y-28,'ПАССАЖИР ПОГИБ',C90.red);snd90('lost');radioLine('КОВЧЕГ',C90.ark,'Пассажир '+(q?q.id.slice(1).toUpperCase():'')+': жизненные показатели — ноль. Причина: ваш огонь.',.3);}break;}
  if(typeof kill95==='function')kill95(e,silent);
  if(typeof kill100==='function')kill100(e,silent);
  if(typeof death95==='function')death95(e,silent);}
// --- «первая встреча»: первые две атаки нового врага — вполсилы; первые два телеграфа — в полтора раза дольше ---
function first90(e){const X=G.x90;if(!X||!inMission()||!e||!X.newT||!X.newT[e.type])return 1;const k=e.type,A=X.atk,slot=Math.floor(G.t*2);if(e.lastAtk90!==slot){e.lastAtk90=slot;A[k]=(A[k]||0)+1;}return A[k]<=2?.5:1;}
function tel90(k){const X=G.x90;if(!X||!inMission())return 1;return (X.tel[k]||0)<2&&X.newT&&X.newT[k]?1.5:1;}
function tel90use(k){const X=G.x90;if(X)X.tel[k]=(X.tel[k]||0)+1;}

