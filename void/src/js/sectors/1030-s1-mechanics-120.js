/* ===== 1.2.0 α · сектор I: по одной механике среды на миссию и новый Страж (без новых врагов) ===== */
// 1 буи · 2 рикошетные плиты · 3 дрейфующие глыбы · 4 цепные мины и течение · 5 тёмные карманы и ракеты · 6 Страж: связи, пояс, минная спираль и тьма
const S1C={ice:'#8fe9ff',amber:'#ffb84d',red:'#ff4f6e',violet:'#b48cff',plate:'#9fb6cc'};
function s1Setup(m){
  G.s1=null;if(!inMission()||m<1||m>6)return;
  const S={m,t:0,cid:0,chains:{},links:[],ph:0,ring:false,clouds:[],flares:[],lights:[],stock:0,flareT:9,spiralT:5,flow:null,buoys:[],plates:[]};G.s1=S;
  if(m===1)S.buoys=[[.12,.45],[.88,.45],[.5,.14]].map(([u,v],i)=>({i,x:W*u,y:H*v,lit:0,ping:2,ever:false,ring:0}));
  if(m===2)S.plates=[[.28,.38],[.72,.34],[.5,.6]].map(([u,v])=>({x:W*u,y:H*v,a:rnd(0,TAU),vr:rnd(.18,.3)*(Math.random()<.5?-1:1),vx:rnd(-10,10),vy:rnd(-8,8),L:50,cd:0,flash:0}));
  if(m===3){for(let i=0;i<4;i++){const r=makeRock(W*(.16+i*.23)+rnd(-30,30),H*rnd(.3,.58),rnd(44,52));r.hp=1e9;r.s1big=true;r.vx=rnd(10,18)*(i%2?-1:1);r.vy=rnd(-6,6);r.vr=rnd(-.15,.15);G.rocks.push(r);}}
  if(m===4)S.flow={a:rnd(0,TAU),v:30,streaks:Array.from({length:26},()=>({x:rnd(0,W),y:rnd(0,H),l:rnd(20,60)}))};
  if(m===5){S.clouds=s1Clouds(3);S.flares=[{x:W*.22,y:H*.3},{x:W*.78,y:H*.68}].map(o=>({...o,t:0}));}
  s1Chip();
}
function s1Clouds(n){const out=[];for(let i=0;i<n;i++)out.push({x:W*(.2+.3*i)+rnd(-40,40),y:H*rnd(.25,.7),r:rnd(150,190),vx:rnd(8,14)*(Math.random()<.5?-1:1),vy:rnd(-7,7),ph:rnd(0,TAU)});return out;}
function s1Chip(){let c=document.getElementById('flareC');if(!c){const box=document.querySelector('#hud .chips');if(!box)return;c=document.createElement('div');c.className='chip ok';c.id='flareC';c.hidden=true;c.textContent='РАКЕТА';box.appendChild(c);}
  c.hidden=!(G.s1&&G.s1.stock>0);}
function s1InCloud(x,y){const S=G.s1;if(!S||!S.clouds.length)return false;let inC=false;for(const c of S.clouds)if(Math.hypot(x-c.x,y-c.y)<c.r*.82){inC=true;break;}if(!inC)return false;
  for(const L of S.lights)if(Math.hypot(x-L.x,y-L.y)<L.r*.9)return false;return true;}
function s1Linked(e){const S=G.s1;if(!S||!S.links.length)return false;return S.links.some(L=>!L.cut&&(L.a===e||L.b===e)&&L.a.alive&&L.b.alive);}
function s1Tick(dt){const S=G.s1,p=G.player;if(!S||!p)return;S.t+=dt;
  // --- 1: сигнальные буи — зажжённый буй раз в несколько секунд метит врагов рядом, по меченым урон выше
  for(const b of S.buoys){b.ring=Math.max(0,b.ring-dt);const near=p.hp>0&&Math.hypot(p.x-b.x,p.y-b.y)<70;
    if(near&&b.lit<=0){b.lit=18;b.ping=.3;sfx('cell');floater(b.x,b.y-30,'БУЙ ЗАЖЖЁН','#8fe9ff');if(G.waveIdx<G.waves.length&&!b.ever){b.ever=true;G.mc.s1buoys=S.buoys.filter(q=>q.ever).length;}}
    else if(near)b.lit=Math.max(b.lit,18);
    if(b.lit>0){b.lit-=dt;b.ping-=dt;if(b.ping<=0){b.ping=3.5;b.ring=.6;for(const e of G.enemies)if(e.alive&&!e.ghost&&Math.hypot(e.x-b.x,e.y-b.y)<300)e.s1mark=G.t+3;}}}
  // --- 2: рикошетные плиты — укрытие от снарядов; рывок сквозь плиту разворачивает снаряды вокруг неё
  for(const pl of S.plates){pl.a+=pl.vr*dt;pl.x+=pl.vx*dt;pl.y+=pl.vy*dt;if(pl.x<80&&pl.vx<0||pl.x>W-80&&pl.vx>0)pl.vx*=-1;if(pl.y<80&&pl.vy<0||pl.y>H-80&&pl.vy>0)pl.vy*=-1;
    pl.cd=Math.max(0,pl.cd-dt);pl.flash=Math.max(0,pl.flash-dt);const ax=pl.x-Math.cos(pl.a)*pl.L,ay=pl.y-Math.sin(pl.a)*pl.L,bx=pl.x+Math.cos(pl.a)*pl.L,by=pl.y+Math.sin(pl.a)*pl.L;
    for(const b of G.eb){if(b.life<=0||b.k95||b.rift)continue;if(segDist(ax,ay,bx,by,b.x,b.y)<(b.r||5)+4){b.life=0;if(SET.fx)part(b.x,b.y,rnd(-60,60),rnd(-60,60),.2,'#dfe8ff',2);}}
    if(p.dashT>0&&pl.cd<=0&&segDist(ax,ay,bx,by,p.x,p.y)<p.r+8){pl.cd=1.2;pl.flash=.35;let n=0;
      G.eb=G.eb.filter(b=>{if(b.k95||b.rift||b.boss||Math.hypot(b.x-pl.x,b.y-pl.y)>190)return true;const sp=Math.max(420,Math.hypot(b.vx,b.vy)*1.6);let tg=null,td=1e9;for(const e of G.enemies){if(!e.alive||e.ghost||e.spawnT>0)continue;const q=Math.hypot(e.x-b.x,e.y-b.y);if(q<td){td=q;tg=e;}}
        const a=tg?Math.atan2(tg.y-b.y,tg.x-b.x):Math.atan2(-b.vy,-b.vx);G.pb.push({x:b.x,y:b.y,px:b.x,py:b.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,dmg:14,pierce:0,rico:0,life:1,hit:[],refl:true});n++;return false;});
      sfx('shield');shake(3);if(n)floater(pl.x,pl.y-26,'ОТРАЖЕНО','#dfe8ff');}}
  // --- 3: глыбы — таран, влетевший в глыбу, оглушён, урон по нему вдвое
  if(S.m===3||S.ring){for(const e of G.enemies){if(!e.alive)continue;
      if(e.type==='rammer'&&e.st==='charge'){for(const r of G.rocks){if(!r.alive||!(r.s1big||r.s1orb))continue;if(Math.hypot(e.x-r.x,e.y-r.y)<r.r+e.r+2){e.st='rest';e.timer=2;e.vx=e.vy=0;e.s1dz=G.t+2;G.mc.s1stun=(G.mc.s1stun||0)+1;floater(e.x,e.y-e.r-10,'ОГЛУШЁН','#ffd24d');sfx('block');shake(4);break;}}}
      if(e.type==='guard'&&S.ring&&!(e.s1g>G.t)){for(const r of G.rocks){if(!r.alive||!r.s1orb)continue;if(Math.hypot(e.x-r.x,e.y-r.y)<r.r+e.r+2){e.s1g=G.t+4;e.shieldDown=3;e.cd=Math.max(e.cd,2);e.s1dz=G.t+1.2;floater(e.x,e.y-e.r-12,'ЩИТ СБИТ','#ffd24d');sfx('block');break;}}}}}
  // --- 4: течение — сносит корабль и мины
  if(S.flow){const F=S.flow;F.a+=dt*.05;const fx=Math.cos(F.a),fy=Math.sin(F.a);
    if(p.hp>0&&!(p.dashT>0)){p.x=clamp(p.x+fx*F.v*dt,p.r,W-p.r);p.y=clamp(p.y+fy*F.v*dt,p.r,H-p.r);}
    for(const e of G.enemies)if(e.alive&&e.type==='mine'){e.x=clamp(e.x+fx*F.v*.8*dt,10,W-10);e.y=clamp(e.y+fy*F.v*.8*dt,10,H-10);}
    for(const s of F.streaks){s.x+=fx*F.v*2.2*dt;s.y+=fy*F.v*2.2*dt;if(s.x<-60)s.x+=W+120;if(s.x>W+60)s.x-=W+120;if(s.y<-60)s.y+=H+120;if(s.y>H+60)s.y-=H+120;}}
  // --- 5 и 6: тёмные карманы, ракеты
  for(const c of S.clouds){c.x+=c.vx*dt;c.y+=c.vy*dt;c.ph+=dt*.6;if(c.x<c.r*.4&&c.vx<0||c.x>W-c.r*.4&&c.vx>0)c.vx*=-1;if(c.y<c.r*.3&&c.vy<0||c.y>H-c.r*.3&&c.vy>0)c.vy*=-1;}
  for(const L of S.lights)L.t-=dt;S.lights=S.lights.filter(L=>L.t>0);
  if(S.m===5){S.flareT-=dt;if(S.flareT<=0&&S.flares.length<2){S.flareT=14;let x,y,k=0;do{x=rnd(W*.12,W*.88);y=rnd(H*.15,H*.85);}while(Math.hypot(x-p.x,y-p.y)<220&&++k<8);S.flares.push({x,y,t:0});}
    for(const f of S.flares){f.t+=dt;if(S.stock<1&&p.hp>0&&Math.hypot(p.x-f.x,p.y-f.y)<34){f.got=true;S.stock=1;sfx('cell');floater(f.x,f.y-24,'РАКЕТА · НА ИМПУЛЬС','#ffd24d');}}
    S.flares=S.flares.filter(f=>!f.got);}
  // --- 6: Страж
  const b=G.boss;if(S.m===6&&b&&b.alive&&b.st==='fight'){
    if(S.ph!==b.phase){S.ph=b.phase;S.links=[];S.linkKey='';
      for(const r of G.rocks)if(r.s1orb)r.alive=false;S.ring=false;
      if(b.phase===2){S.ring=true;for(let i=0;i<8;i++){const r=makeRock(b.x,b.y,rnd(15,19));r.hp=1e9;r.s1orb=true;r.oa=i/8*TAU;r.vx=r.vy=0;G.rocks.push(r);}}
      if(b.phase===3){S.clouds=s1Clouds(2);S.spiralT=3;}}
    if(b.phase===1){const py=G.enemies.filter(e=>e.alive&&e.type==='pylon'&&e.spawnT<=0);const key=py.map(e=>e.uid).join(',');
      if(py.length>=2&&key!==S.linkKey&&!S.links.length){S.linkKey=key;for(let i=0;i<py.length;i++){const a=py[i],c=py[(i+1)%py.length];if(py.length===2&&i===1)break;S.links.push({a,b:c,cut:false});}}
      for(const L of S.links){if(L.cut||!L.a.alive||!L.b.alive)continue;if(p.dashT>0&&segDist(L.a.x,L.a.y,L.b.x,L.b.y,p.x,p.y)<p.r+8){L.cut=true;floater(p.x,p.y-30,'СВЯЗЬ РАЗОРВАНА','#ffffff');sfx('shield');shake(4);if(SET.fx)for(let k=0;k<10;k++)part((L.a.x+L.b.x)/2,(L.a.y+L.b.y)/2,vrnd3(-120,120),vrnd3(-120,120),.4,S1C.violet,2.5);}}}
    if(S.ring){S.ringA=(S.ringA||0)+dt*.45;for(const r of G.rocks)if(r.alive&&r.s1orb){const a=r.oa+S.ringA;r.x=b.x+Math.cos(a)*205;r.y=b.y+Math.sin(a)*205*.85;r.vx=r.vy=0;}}
    if(b.phase===3&&b.over<=0){S.spiralT-=dt*missionK('rate');if(S.spiralT<=0){S.spiralT=6.5;const a0=rnd(0,TAU);sfx('warn');for(let k=0;k<6;k++){const a=a0+k*1.05,R=110+k*30;spawnEnemy('mine',clamp(b.x+Math.cos(a)*R,20,W-20),clamp(b.y+Math.sin(a)*R*.85,20,H-20),{arm:1.1,fuse:0,life:15,noAffix:true});}}}}
  if(!G.bc&&G.rocks.length)updateRocks(dt);
  s1Chip();
}
function s1OnPulse(){const S=G.s1,p=G.player;if(!S||!p)return;
  if(S.stock>0&&(S.m===5||S.clouds.length)){S.stock=0;S.lights.push({x:p.x,y:p.y,r:240,t:6,t0:6});G.shock.push({x:p.x,y:p.y,r:10,R:240,t:0,col:'#ffd24d',thin:true});floater(p.x,p.y-36,'РАКЕТА','#ffd24d');}
}
function s1ChainBlast(e,R){const S=G.s1;if(!S)return;const id=e.chain||(e.chain=++S.cid);const C=S.chains[id]||(S.chains[id]={n:0,hit:false});C.n++;
  for(const o of G.enemies)if(o.alive&&o!==e&&!STATIC.has(o.type)&&o.type!=='mine'&&Math.hypot(o.x-e.x,o.y-e.y)<R)C.hit=true;
  for(const o of G.enemies){if(!o.alive||o===e||o.type!=='mine'||o.fuse>0)continue;if(Math.hypot(o.x-e.x,o.y-e.y)<R+18){o.fuse=.14;o.chain=id;}}
  if(S.m===6&&G.boss&&G.boss.phase===3)for(const o of G.enemies)if(o.alive&&o.type==='pylon'&&Math.hypot(o.x-e.x,o.y-e.y)<R+o.r){hurt(o,999,{force:true});floater(o.x,o.y-20,'ЗАРЯД СНЯТ','#ffd24d');}
  if(C.hit&&C.n>=2)G.mc.s1chain=Math.max(G.mc.s1chain||0,C.n);
  if(C.n===3)floater(e.x,e.y-30,'ЦЕПЬ','#ffd24d');}
// ---------- отрисовка: под врагами (буи, плиты, течение, связи) и поверх (тьма, метки, прицелы из тьмы)
function s1DrawUnder(t){const S=G.s1;if(!S)return;
  if(S.flow){const F=S.flow,fx=Math.cos(F.a),fy=Math.sin(F.a);ctx.strokeStyle='#8fd8ff';ctx.lineWidth=1.2;for(const s of F.streaks){ctx.globalAlpha=.12;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x-fx*s.l,s.y-fy*s.l);ctx.stroke();}ctx.globalAlpha=1;}
  for(const b of S.buoys){const on=b.lit>0;glow(b.x,b.y,on?46:22,on?S1C.ice:'#3f5a72',on?.7:.35);ctx.save();ctx.translate(b.x,b.y);ctx.strokeStyle=on?S1C.ice:'#4a6680';ctx.fillStyle='#0b1220';ctx.lineWidth=2;
    ctx.beginPath();for(let k=0;k<6;k++){const a=k/6*TAU;ctx.lineTo(Math.cos(a)*11,Math.sin(a)*11);}ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle=on?'#ffffff':'#4a6680';ctx.beginPath();ctx.arc(0,0,3.5,0,TAU);ctx.fill();
    if(!on){ctx.globalAlpha=.35+.25*Math.sin(t*3+b.i);ctx.setLineDash([3,5]);ctx.beginPath();ctx.arc(0,0,70,0,TAU);ctx.stroke();ctx.setLineDash([]);}
    if(b.ring>0){const k=1-b.ring/.6;ctx.globalAlpha=(1-k)*.6;ctx.strokeStyle=S1C.ice;ctx.beginPath();ctx.arc(0,0,20+280*k,0,TAU);ctx.stroke();}ctx.restore();ctx.globalAlpha=1;}
  for(const pl of S.plates){ctx.save();ctx.translate(pl.x,pl.y);ctx.rotate(pl.a);ctx.fillStyle='#16233a';ctx.strokeStyle=pl.flash>0?'#ffffff':S1C.plate;ctx.lineWidth=2;ctx.beginPath();ctx.rect(-pl.L,-6,pl.L*2,12);ctx.fill();ctx.stroke();
    ctx.strokeStyle='#4a6680';ctx.lineWidth=1;for(let k=-pl.L+10;k<pl.L;k+=14){ctx.beginPath();ctx.moveTo(k,-6);ctx.lineTo(k+6,6);ctx.stroke();}ctx.restore();if(pl.flash>0)glow(pl.x,pl.y,70,'#dfe8ff',pl.flash*2);}
  for(const f of S.flares){glow(f.x,f.y,30,'#ffd24d',.55+.3*Math.sin(f.t*5));ctx.fillStyle='#ffd24d';ctx.beginPath();ctx.moveTo(f.x,f.y-9);ctx.lineTo(f.x+5,f.y+6);ctx.lineTo(f.x-5,f.y+6);ctx.closePath();ctx.fill();}
  for(const L of S.links){if(L.cut||!L.a.alive||!L.b.alive)continue;ctx.strokeStyle=S1C.violet;ctx.lineWidth=3;ctx.globalAlpha=.55+.3*Math.sin(t*12);ctx.beginPath();ctx.moveTo(L.a.x,L.a.y);ctx.lineTo(L.b.x,L.b.y);ctx.stroke();ctx.lineWidth=1;ctx.strokeStyle='#ffffff';ctx.globalAlpha=.6;ctx.stroke();ctx.globalAlpha=1;}
}
let s1C=null,s1X=null;
function s1DrawOver(t){const S=G.s1;if(!S)return;
  for(const e of G.enemies){if(!e.alive)continue;
    if(e.s1mark>G.t){ctx.strokeStyle=S1C.ice;ctx.lineWidth=1.5;ctx.globalAlpha=.8;ctx.setLineDash([4,4]);ctx.lineDashOffset=-t*30;ctx.beginPath();ctx.arc(e.x,e.y,e.r+8,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}
    if(e.s1dz>G.t){for(let k=0;k<3;k++){const a=t*4+k*2.1;ctx.fillStyle='#ffd24d';ctx.beginPath();ctx.arc(e.x+Math.cos(a)*(e.r+6),e.y-e.r-4+Math.sin(a)*4,2.5,0,TAU);ctx.fill();}}
    if(e.type==='pylon'&&s1Linked(e)){ctx.strokeStyle='#ffffff';ctx.globalAlpha=.5;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(e.x,e.y,e.r+6,0,TAU);ctx.stroke();ctx.globalAlpha=1;}}
  if(S.clouds.length){
    if(!s1C||s1C.width!==cv.width||s1C.height!==cv.height){s1C=document.createElement('canvas');s1C.width=cv.width;s1C.height=cv.height;s1X=s1C.getContext('2d');}
    const X=s1X;X.setTransform(1,0,0,1,0,0);X.globalCompositeOperation='source-over';X.clearRect(0,0,s1C.width,s1C.height);X.setTransform(ctx.getTransform());
    // облако — не диск, а клубы: ядро и 6 медленно дышащих выступов, холодно-фиолетовый оттенок к краю
    for(const c of S.clouds){if(!c.pf){c.pf=[];for(let k=0;k<6;k++){const a=k/6*TAU+rnd(-.3,.3);c.pf.push({a,d:rnd(.38,.55),r:rnd(.42,.58),w:rnd(.5,1.2)});}}
      const R0=c.r*(1+.04*Math.sin(c.ph));
      const blob=(x,y,r)=>{const g=X.createRadialGradient(x,y,r*.15,x,y,r);g.addColorStop(0,'rgba(4,5,14,.9)');g.addColorStop(.4,'rgba(6,7,18,.78)');g.addColorStop(.7,'rgba(14,12,34,.42)');g.addColorStop(1,'rgba(22,18,48,0)');X.fillStyle=g;X.beginPath();X.arc(x,y,r,0,TAU);X.fill();};
      blob(c.x,c.y,R0*.8);for(const q of c.pf){const a=q.a+Math.sin(c.ph*q.w)*.18,dd=R0*q.d*(1+.06*Math.sin(c.ph*1.7+q.a));blob(c.x+Math.cos(a)*dd,c.y+Math.sin(a)*dd,R0*q.r);}}
    X.globalCompositeOperation='destination-out';const p=G.player;
    const hole=(x,y,r,a)=>{const g=X.createRadialGradient(x,y,r*.35,x,y,r);g.addColorStop(0,`rgba(0,0,0,${a})`);g.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=g;X.beginPath();X.arc(x,y,r,0,TAU);X.fill();};
    if(p)hole(p.x,p.y,85,1);for(const L of S.lights)hole(L.x,L.y,L.r,Math.min(1,L.t/1.2));
    const b=G.boss;if(b&&b.alive&&b.over>0)hole(b.x,b.y,110,1);
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(s1C,0,0);ctx.restore();
    // копейщик из тьмы виден по лучу прицела
    for(const e of G.enemies){if(!e.alive||e.type!=='lancer'||(e.st!=='aim'&&e.st!=='lock'))continue;ctx.strokeStyle=S1C.red;ctx.globalAlpha=e.st==='lock'?.9:.4;ctx.lineWidth=e.st==='lock'?2.5:1.2;ctx.setLineDash(e.st==='lock'?[]:[8,8]);
      ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+Math.cos(e.aim)*1800,e.y+Math.sin(e.aim)*1800);ctx.stroke();ctx.setLineDash([]);glow(e.x,e.y,16,S1C.red,.6);ctx.globalAlpha=1;}
    for(const L of S.lights){const k=L.t/L.t0;ctx.strokeStyle='#ffd24d';ctx.globalAlpha=.25*k;ctx.lineWidth=1;ctx.beginPath();ctx.arc(L.x,L.y,L.r,0,TAU);ctx.stroke();ctx.globalAlpha=1;}}
}
// ---------- связки с игрой
{const _sm29=setupMission0;setupMission0=function(i){_sm29(i);try{s1Setup(i+1);}catch(e){console.error(e);G.s1=null;}};}
{const _up29=update;update=function(dt){_up29(dt);if(G.s1&&inMission()&&G.state==='play'&&G.deadT<=0)s1Tick(dt);};}
{const _tp29=tryPulse;tryPulse=function(){const p=G.player,was=!!p&&p.en>=100;_tp29();if(was&&p.en<100&&G.s1)s1OnPulse();};}
{const _h29=hurt;hurt=function(e,dmg,src){
  if(G.s1&&e&&e.alive){if(e.type==='pylon'&&s1Linked(e)&&!(src&&src.force)){e.shieldFlash=.12;if(SET.fx)part(e.x,e.y,vrnd3(-50,50),vrnd3(-50,50),.2,S1C.violet,2);return;}
    if(e.s1mark>G.t)dmg*=1.25;if(e.s1dz>G.t)dmg*=2;}
  const was=!!(e&&e.alive);_h29(e,dmg,src);
  if(G.s1&&was&&src&&src.refl&&!e.alive&&e.type==='gunner'&&G.mc)G.mc.s1refl=(G.mc.s1refl||0)+1;};}
{const _k29=kill;kill=function(e,silent){if(G.s1&&e&&e.alive&&e.type==='mine'&&!silent&&(G.s1.m===4||G.s1.m===6)&&!e.s1boom){e.s1boom=1;e.hp=1;e.fuse=.06;e.arm=0;return;}return _k29(e,silent);};}
{const _mb29=mineBlast;mineBlast=function(e,R,pd){_mb29(e,R,pd);if(G.s1&&(G.s1.m===4||G.s1.m===6))s1ChainBlast(e,R);};}
{const _dp29=damagePlayer;damagePlayer=function(d){const p=G.player,h0=p?p.hp:0;_dp29(d);if(G.s1&&p&&p.hp<h0&&G.mc&&s1InCloud(p.x,p.y))G.mc.s1dark=(G.mc.s1dark||0)+1;};}
// мастерство, подсказки и теги миссий 1–6
MASTERY[0]={t:'Зажечь все три буя до последней волны',ok:()=>(G.mc.s1buoys||0)>=3};
MASTERY[1]={t:'Уничтожить 3 стрелков их же снарядами',ok:()=>(G.mc.s1refl||0)>=3};
MASTERY[2]={t:'Оглушить о глыбы 3 тарана',ok:()=>(G.mc.s1stun||0)>=3};
MASTERY[3]={t:'Цепь из 5 мин, задевшая врага',ok:()=>(G.mc.s1chain||0)>=5};
MASTERY[4]={t:'Ни одного попадания в темноте',ok:()=>!(G.mc.s1dark>0)};
{const H=MISSIONS;
  H[0].hint=['WASD или стрелки — движение. Огонь — сам, по ближайшей цели.','Подлетите к бую, чтобы зажечь его: он метит врагов рядом, по меченым урон выше.','Собирайте осколки данных с врагов — из них растут модули.'];
  H[1].hint=['Плиты обшивки закрывают от выстрелов. Рывок сквозь плиту разворачивает снаряды вокруг неё во врагов.','ПРОБЕЛ — рывок сквозь снаряды.'];
  H[2].hint=['Таран, влетевший в глыбу, оглушён — урон по нему вдвое. Ставьте глыбу между собой и тараном.','E или Shift — импульс, когда шкала полна: сносит снаряды и отбрасывает врагов.'];
  H[3].hint=['Импульс рвёт мины цепью — взрыв задевает врагов рядом. Не стойте в цепи сами.','Течение медленно сносит корабль и мины.','Клик по врагу (или касание) — огонь только по нему.'];
  H[4].hint=['В тёмных пятнах врагов не видно. Копейщика выдаёт луч прицела.','Подберите ракету: импульс зажжёт её и осветит круг.','Линия копейщика вспыхнула — рывок.'];
  H[5].hint=['Заряды связаны лучами: пока связь цела, заряд не пробить. Рывок сквозь луч рвёт связь.','Во второй фазе гвардия, задевшая пояс обломков, теряет щит. В третьей импульс рвёт мины цепью — взрыв снимает заряд.','Ядро неуязвимо, пока живы заряды. Каждая фаза — новые атаки.'];
  H[0].mech=['СИГНАЛЬНЫЕ БУИ'];H[1].mech=['РИКОШЕТНЫЕ ПЛИТЫ'];H[2].mech=['ДРЕЙФУЮЩИЕ ГЛЫБЫ'];H[3].mech=['ЦЕПНЫЕ МИНЫ','ТЕЧЕНИЕ'];H[4].mech=['ТЁМНЫЕ ПЯТНА','СИГНАЛЬНЫЕ РАКЕТЫ'];H[5].mech=['СВЯЗАННЫЕ ЗАРЯДЫ','ПОЯС ОБЛОМКОВ','МИННАЯ СПИРАЛЬ'];}


