// ---------- Отрисовка ----------
function render(now){
  const t=now/1000;
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  if(nebula)ctx.drawImage(nebula,0,0,cv.width,cv.height);
  const sx=G.shake?rnd(-G.shake,G.shake):0,sy=G.shake?rnd(-G.shake,G.shake):0;
  ctx.setTransform(DPR*SC,0,0,DPR*SC,sx*DPR*SC,sy*DPR*SC);
  const p=G.player;
  const ox=p?(p.x-W/2):Math.sin(t*.05)*200,oy=p?(p.y-H/2):Math.cos(t*.04)*120;
  for(const s of stars){const x=((s.x-ox*s.k-t*6*s.k*10)%(VW*1.2)+VW*1.2)%(VW*1.2)-VW*.1,y=((s.y-oy*s.k)%(VH*1.2)+VH*1.2)%(VH*1.2)-VH*.1;
    ctx.globalAlpha=.45+.4*Math.sin(t*1.3+s.tw);ctx.fillStyle=s.k>.06?'#cfeeff':'#7f9ab5';ctx.fillRect(x,y,s.s,s.s);}
  ctx.globalAlpha=1;
  if(!p||G.state==='menu'||G.state==='codex'&&!G.inRun)return;
  if(G.arena)ctx.setTransform(DPR*SC,0,0,DPR*SC,(sx-CX)*DPR*SC,(sy-CY)*DPR*SC);
  if(G.arena)drawArenaEdge(p,t);bg110(t);
  const bc=G.bc;

  // маяк: линии и кольцо
  if(bc){
    for(const r of G.relays){
      if(r.cut){ctx.strokeStyle='#ff4f6e';ctx.globalAlpha=.35+.35*(Math.sin(t*10)>0?1:0);ctx.setLineDash([4,10]);}
      else{ctx.strokeStyle='#8fe9ff';ctx.globalAlpha=.45;ctx.setLineDash([]);}
      ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(r.x,r.y);ctx.lineTo(bc.x,bc.y);ctx.stroke();ctx.setLineDash([]);
      if(!r.cut){const k=(t*.6+r.x*.001)%1;ctx.globalAlpha=.9;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(r.x+(bc.x-r.x)*k,r.y+(bc.y-r.y)*k,2,0,TAU);ctx.fill();}
      ctx.globalAlpha=1;glow(r.x,r.y,24,r.cut?'#ff4f6e':'#8fe9ff',.5);
      ctx.fillStyle='#0b1220';ctx.strokeStyle=r.cut?'#ff4f6e':'#8fe9ff';ctx.lineWidth=2;ctx.save();ctx.translate(r.x,r.y);poly(3,12,-Math.PI/2);ctx.fill();ctx.stroke();ctx.restore();
      if(r.cut&&r.rep>0){ctx.strokeStyle='#8fe9ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(r.x,r.y,18,-Math.PI/2,-Math.PI/2+TAU*r.rep/2);ctx.stroke();}
    }
    const rr=bcRing();ctx.strokeStyle=bc.inRing?'#ffb84d':'#7a5a24';ctx.globalAlpha=bc.inRing?.75:.5;ctx.lineWidth=1.5;ctx.setLineDash([6,8]);ctx.lineDashOffset=-t*20;ctx.beginPath();ctx.arc(bc.x,bc.y,rr,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;ctx.globalAlpha=1;
    if(bc.inRing&&bc.rate>0&&SET.fx&&Math.random()<.5){const a=rnd(0,TAU);part(bc.x+Math.cos(a)*rr,bc.y+Math.sin(a)*rr,-Math.cos(a)*rr*1.6,-Math.sin(a)*rr*1.6,.5,'#ffb84d',2);}
  }
  drawRocks(G.rocks);if(G.s1)s1DrawUnder(t);if(G.post)postDrawUnder(t);
  drawPickups();

  // предупреждения о появлении
  for(const w of G.warns){if(w.t>.7||G.noTele)continue;const a=1-w.t/.7;ctx.save();ctx.translate(w.mx,w.my);ctx.rotate(Math.atan2(H/2-w.my,W/2-w.mx));ctx.strokeStyle=EDEF[w.type].col;ctx.globalAlpha=.4+.6*Math.abs(Math.sin(w.t*18));ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(-6,-8);ctx.lineTo(4,0);ctx.lineTo(-6,8);ctx.stroke();ctx.beginPath();ctx.arc(0,0,10+a*8,0,TAU);ctx.globalAlpha*=.4;ctx.stroke();ctx.restore();}
  ctx.globalAlpha=1;

  // поля, метеоры, гравитация
  for(const f of G.fields){if(f.ice||f.rust)continue;const k=f.t/f.max;ctx.strokeStyle='#6bf0ff';ctx.globalAlpha=.3+.4*k;ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=24;i++){const a=i/24*TAU,rr=f.r*(1+rnd(-.06,.06));ctx.lineTo(f.x+Math.cos(a)*rr,f.y+Math.sin(a)*rr);}ctx.stroke();
    ctx.fillStyle='#6bf0ff';ctx.globalAlpha=.06+.08*k;ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,TAU);ctx.fill();ctx.globalAlpha=1;}
  for(const m of G.meteors){if(m.t<=0)continue;ctx.strokeStyle='#ffb07a';ctx.globalAlpha=.5+.4*Math.sin(t*20);ctx.lineWidth=2;ctx.beginPath();ctx.arc(m.x,m.y,46,0,TAU);ctx.stroke();
    ctx.globalAlpha=1-m.t/1.1;ctx.beginPath();ctx.arc(m.x,m.y,46*(1-m.t/1.1),0,TAU);ctx.stroke();
    const k=m.t/1.1;ctx.globalAlpha=1;glow(m.x-k*160,m.y-k*260,14,'#ffb07a',.9);ctx.globalAlpha=1;}
  for(const e of G.enemies){if(e.type==='vortex'&&e.alive&&e.spawnT<=0){ctx.strokeStyle='#7d6bff';ctx.lineWidth=1.5;for(let i=0;i<3;i++){ctx.globalAlpha=.18;ctx.beginPath();const ph=t*2+i*2.1;for(let s=0;s<40;s++){const rr=240*(1-s/40),a=ph+s*.25;ctx.lineTo(e.x+Math.cos(a)*rr,e.y+Math.sin(a)*rr);}ctx.stroke();}ctx.globalAlpha=1;}}

  // связи, телеграфы, тросы
  for(const e of G.enemies){
    if(!e.alive)continue;
    if(e.type==='shielder'&&e.links){ctx.strokeStyle='#9c8cff';ctx.lineWidth=1.5;ctx.globalAlpha=.35+.2*Math.sin(t*6);for(const o of e.links){ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(o.x,o.y);ctx.stroke();}ctx.globalAlpha=1;}
    if(e.type==='commander'&&e.spawnT<=0){ctx.strokeStyle='#ffa63d';ctx.globalAlpha=.15;ctx.lineWidth=1;ctx.setLineDash([3,6]);ctx.beginPath();ctx.arc(e.x,e.y,220,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}
    if(e.type==='twin'&&e.mate&&e.mate.alive&&e.uid<e.mate.uid){ctx.strokeStyle='#ff6bd0';ctx.globalAlpha=e.down>0||e.mate.down>0?.8:.3;ctx.lineWidth=e.down>0||e.mate.down>0?3:1.5;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.mate.x,e.mate.y);ctx.stroke();ctx.globalAlpha=1;}
    if(e.type==='leech'&&e.att&&bc){ctx.strokeStyle='#c46bff';ctx.globalAlpha=.6+.3*Math.sin(t*12+e.seed);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(bc.x,bc.y);ctx.stroke();ctx.globalAlpha=1;}
    if(e.type==='antenna'&&bc&&e.spawnT<=0){ctx.strokeStyle='#4dd0ff';ctx.globalAlpha=.5;ctx.lineWidth=1.5;ctx.setLineDash([2,6]);ctx.lineDashOffset=t*30;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(bc.x,bc.y);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;ctx.globalAlpha=1;}
    if(e.type==='tug'&&e.rock){ctx.strokeStyle='#c9a36b';ctx.lineWidth=2;ctx.globalAlpha=.9;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.rock.x,e.rock.y);ctx.stroke();ctx.globalAlpha=1;}
    if(e.type==='shell'&&!G.noTele){ctx.strokeStyle='#ff8f5a';ctx.globalAlpha=.5+.4*Math.sin(t*16);ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.tx,e.ty,30,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(e.tx,e.ty,30*(e.ft/e.dur),0,TAU);ctx.stroke();ctx.globalAlpha=1;}
    if(e.type==='cutter'&&e.cutting&&!G.noTele){ctx.strokeStyle='#ff4f6e';ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(e.x,e.y,e.r+6,-Math.PI/2,-Math.PI/2+TAU*(e.cutT/.9));ctx.lineWidth=2;ctx.stroke();ctx.globalAlpha=1;}
    if(e.type==='rammer')laneRammer(e);
    if(e.type==='shocker'&&e.st==='charge'&&!G.noTele){ctx.strokeStyle='#6bf0ff';ctx.globalAlpha=.3+.5*(1-e.timer/.6);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(e.x,e.y,115*(1-e.timer/.6),0,TAU);ctx.stroke();ctx.globalAlpha=1;}
    if(e.type==='lancer'&&e.st!=='seek'){const ex=e.x+Math.cos(e.aim)*2000,ey=e.y+Math.sin(e.aim)*2000;
      if(e.st==='fire'){ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#ff3dbb';ctx.lineWidth=14;ctx.globalAlpha=.5;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(ex,ey);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=4;ctx.globalAlpha=1;ctx.stroke();ctx.globalCompositeOperation='source-over';}
      else if(!G.noTele){ctx.strokeStyle='#ff3dbb';ctx.lineWidth=e.st==='lock'?2.5:1;ctx.globalAlpha=e.st==='lock'?(Math.sin(t*50)>0?1:.4):.5;ctx.setLineDash(e.st==='lock'?[]:[8,8]);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);}
      ctx.globalAlpha=1;}
  }
  const B=G.boss;
  if(B&&B.atk&&B.atk.type==='sweep'&&B.atk.ang!==undefined){const A=B.atk,ex=B.x+Math.cos(A.ang)*2000,ey=B.y+Math.sin(A.ang)*2000;
    if(A.t<1){if(!G.noTele){ctx.strokeStyle='#b48cff';ctx.globalAlpha=.4+.4*Math.sin(t*30);ctx.lineWidth=2;ctx.setLineDash([12,10]);ctx.beginPath();ctx.moveTo(B.x,B.y);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);
      ctx.beginPath();ctx.arc(B.x,B.y,90,A.a0,A.a0+A.dir*1.9,A.dir<0);ctx.stroke();}}
    else{ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#b48cff';ctx.globalAlpha=.45;ctx.lineWidth=30;ctx.beginPath();ctx.moveTo(B.x,B.y);ctx.lineTo(ex,ey);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.globalAlpha=1;ctx.lineWidth=6;ctx.stroke();ctx.globalCompositeOperation='source-over';}
    ctx.globalAlpha=1;}

  if(bc)drawBeacon(bc,t);
  if(G.fake){ctx.globalAlpha=.5+.5*(Math.sin(t*14)>0?1:.4);drawMiniBeacon(G.fake.x,G.fake.y,'#ffb84d',t);ctx.globalAlpha=1;}
  if(G.lureP){ctx.globalAlpha=G.lureP.t;ctx.save();ctx.translate(G.lureP.x,G.lureP.y);ctx.strokeStyle='#8fe9ff';ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(19,0);ctx.lineTo(-11,-12);ctx.lineTo(-5,0);ctx.lineTo(-11,12);ctx.closePath();ctx.stroke();ctx.setLineDash([]);ctx.restore();ctx.globalAlpha=1;}

  if(inMission())d74Under(t);
  if(inMission())d80Under(t);
  for(const e of G.enemies){if(e.type==='shade'&&G.dark&&!visibleAt(e.x,e.y)&&!(e.reveal>0)&&!inStorm(e.x,e.y))continue;drawEnemy(e,t);}
  secDraw(t);secDraw2(t);if(inMission())d74Draw(t);if(inMission())d80Draw(t);

  ctx.globalCompositeOperation='lighter';
  const BC=shipBul();for(const b of G.pb){if(b.blast){glow(b.x,b.y,b.charged?34:22,'#9fe3ff',.8);ctx.strokeStyle='#9fe3ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(b.x-b.vx*.03,b.y-b.vy*.03);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.fillStyle='#dff6ff';ctx.beginPath();ctx.arc(b.x,b.y,b.charged?7:4.5,0,TAU);ctx.fill();continue;}if(b.charged){glow(b.x,b.y,34,BC,.9);ctx.strokeStyle='#ffffff';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(b.x-b.vx*.05,b.y-b.vy*.05);ctx.lineTo(b.x,b.y);ctx.stroke();continue;}ctx.strokeStyle=b.drone?'#c9b6ff':b.turret?'#ffcf80':BC;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(b.x-b.vx*.018,b.y-b.vy*.018);ctx.lineTo(b.x,b.y);ctx.stroke();}
  ctx.globalCompositeOperation='source-over';

  if(inMission())w80Mask(G.arena?sx-CX:sx,G.arena?sy-CY:sy);if(inMission()){sb85Top(t);top90(t);top110(t);}
  if(G.s1)s1DrawOver(t);if(G.post)postDrawOver(t);
  if(G.dark){drawDark(G.arena?sx-CX:sx,G.arena?sy-CY:sy);
    if(G.storm&&G.storm.warn<=0){ctx.strokeStyle='#8fd8ff';ctx.lineWidth=1.5;ctx.setLineDash([3,4]);ctx.lineDashOffset=-t*20;for(const e of G.enemies){if(!e.alive||e.spawnT>0||!inStorm(e.x,e.y)||visibleAt(e.x,e.y))continue;ctx.globalAlpha=.75;ctx.beginPath();ctx.arc(e.x,e.y,e.r+6,0,TAU);ctx.stroke();}ctx.setLineDash([]);ctx.globalAlpha=1;}}

  ctx.globalCompositeOperation='lighter';
  for(const b of G.eb){if(b.rift)continue;glow(b.x,b.y,Math.max(b.r*3.2,BMIN*4.5),b.col,.8);}
  ctx.globalCompositeOperation='source-over';
  for(const b of G.eb){if(b.k95){eb95Draw(b,t);continue;}if(b.copy){ctx.strokeStyle=b.col;ctx.lineWidth=3;ctx.globalAlpha=.9;ctx.beginPath();ctx.moveTo(b.x-b.vx*.02,b.y-b.vy*.02);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.globalAlpha=1;continue;}if(b.rift){ctx.strokeStyle='#ff4f6e';ctx.lineWidth=4;ctx.globalAlpha=.5;ctx.beginPath();ctx.moveTo(b.x-b.vx*.03,b.y-b.vy*.03);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.globalAlpha=1;ctx.stroke();continue;}ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(b.x,b.y,Math.max(b.r*.55,BMIN),0,TAU);ctx.fill();if(BMIN||G.ol95){ctx.strokeStyle='#04060c';ctx.lineWidth=(G.ol95?1.5:1)/SC;ctx.stroke();}}

  drawPlayer(p,t);

  ctx.globalCompositeOperation='lighter';
  for(const q of G.parts){ctx.globalAlpha=q.life/q.max;ctx.fillStyle=q.col;ctx.fillRect(q.x-q.size/2,q.y-q.size/2,q.size,q.size);}
  for(const s of G.shock){ctx.globalAlpha=(1-s.t)*(s.thin?.5:.8);ctx.strokeStyle=s.col;ctx.lineWidth=s.thin?2:5*(1-s.t)+1;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,TAU);ctx.stroke();}
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';

  // ионная буря
  const S=G.storm;if(S){const x0=S.axis==='x'?S.pos-S.w/2:0,y0=S.axis==='y'?S.pos-S.w/2:0,w=S.axis==='x'?S.w:W,h=S.axis==='y'?S.w:H;
    if(S.warn>0){ctx.strokeStyle='#7d9bff';ctx.globalAlpha=.4+.4*Math.sin(t*12);ctx.setLineDash([10,8]);ctx.lineWidth=2;
      const entry=S.dir>0?0:(S.axis==='x'?W:H);ctx.beginPath();if(S.axis==='x'){ctx.moveTo(entry,0);ctx.lineTo(entry,H);}else{ctx.moveTo(0,entry);ctx.lineTo(W,entry);}ctx.stroke();ctx.setLineDash([]);}
    else{ctx.font='700 11px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillStyle='#bcd0ff';ctx.globalAlpha=.75;if(S.axis==='x')ctx.fillText('ИОННАЯ БУРЯ',S.pos,((t*60)%(H+40))-20);else ctx.fillText('ИОННАЯ БУРЯ',((t*80)%(W+120))-60,S.pos+4);
      ctx.fillStyle='#4a5cff';ctx.globalAlpha=.12;ctx.fillRect(x0,y0,w,h);ctx.strokeStyle='#9fb4ff';ctx.globalAlpha=.25;ctx.lineWidth=1;
      for(let i=0;i<14;i++){ctx.beginPath();if(S.axis==='x'){const x=x0+Math.random()*w,y=Math.random()*H;ctx.moveTo(x,y);ctx.lineTo(x+rnd(-20,20),y+rnd(20,60));}else{const x=Math.random()*W,y=y0+Math.random()*h;ctx.moveTo(x,y);ctx.lineTo(x+rnd(20,60),y+rnd(-20,20));}ctx.stroke();}}
    ctx.globalAlpha=1;}
  if(G.flare>0){ctx.fillStyle='#ffb84d';ctx.globalAlpha=.05+.03*Math.sin(t*4);ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}

  if(G.prio&&G.prio.alive){const e=G.prio,r=e.r+10,a=t*2;ctx.strokeStyle='#ffffff';ctx.lineWidth=2;
    for(let i=0;i<4;i++){const q=a+i*Math.PI/2;ctx.beginPath();ctx.arc(e.x,e.y,r,q,q+.5);ctx.stroke();}
    ctx.font='700 '+fpx(10)+'px "JetBrains Mono",monospace';ctx.fillStyle='#ffffff';ctx.textAlign='center';ctx.fillText('ЦЕЛЬ',e.x,e.y-r-6);}

  ctx.textAlign='center';ctx.font='700 '+fpx(12)+'px "JetBrains Mono",monospace';
  for(const f of G.float){ctx.globalAlpha=Math.min(1,f.life*2);ctx.fillStyle='#04060c';ctx.fillText(f.text,f.x+1,f.y+1);ctx.fillStyle=f.col;ctx.fillText(f.text,f.x,f.y);}
  ctx.globalAlpha=1;

  if(aimManual()&&p&&p.hp>0&&(G.state==='play'||G.state==='world')){const m=mouseWorld(),c=shipCol();ctx.strokeStyle=c;ctx.lineWidth=1;ctx.globalAlpha=.85;
    for(let i=0;i<4;i++){const a=i*Math.PI/2;ctx.beginPath();ctx.moveTo(m.x+Math.cos(a)*3,m.y+Math.sin(a)*3);ctx.lineTo(m.x+Math.cos(a)*6,m.y+Math.sin(a)*6);ctx.stroke();}
    ctx.fillStyle=c;ctx.fillRect(m.x-.75,m.y-.75,1.5,1.5);
    const L=G.aimLock;if(L&&L.alive){const r=L.r+7,q=5;ctx.lineWidth=1.5;ctx.globalAlpha=.95;for(const [sx2,sy2] of [[-1,-1],[1,-1],[1,1],[-1,1]]){ctx.beginPath();ctx.moveTo(L.x+sx2*r,L.y+sy2*(r-q));ctx.lineTo(L.x+sx2*r,L.y+sy2*r);ctx.lineTo(L.x+sx2*(r-q),L.y+sy2*r);ctx.stroke();}}
    ctx.globalAlpha=1;}
  const lowHp=p.hp>0&&p.hp<G.st.maxHp*.25,lowBc=bc&&bc.hp<bc.maxHp*.3&&bc.hp>0;
  if(G.hurtV>0||lowHp||lowBc){ctx.setTransform(1,0,0,1,0,0);const v=Math.max(G.hurtV*.55,lowHp||lowBc?.16+.08*Math.sin(t*5):0);
    const g=ctx.createRadialGradient(cv.width/2,cv.height/2,Math.min(cv.width,cv.height)*.35,cv.width/2,cv.height/2,Math.max(cv.width,cv.height)*.7);g.addColorStop(0,'rgba(255,40,70,0)');g.addColorStop(1,`rgba(255,40,70,${v})`);ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height);}
}
function drawRocks(list){
  for(const r of list){ctx.save();ctx.translate(r.x,r.y);ctx.rotate(r.rot);ctx.beginPath();r.v.forEach((v,i)=>{const a=i/r.v.length*TAU;ctx.lineTo(Math.cos(a)*v,Math.sin(a)*v);});ctx.closePath();
    ctx.fillStyle=r.hitF>0?'#3a4658':'#151d2a';ctx.fill();ctx.strokeStyle=r.flung?'#ff8f5a':'#5d6e86';ctx.lineWidth=2;ctx.stroke();ctx.restore();
    if(r.flung){ctx.strokeStyle='#ff8f5a';ctx.globalAlpha=.4;ctx.beginPath();ctx.moveTo(r.x,r.y);ctx.lineTo(r.x-r.vx*.25,r.y-r.vy*.25);ctx.lineWidth=r.r;ctx.stroke();ctx.globalAlpha=1;}}
}
function drawLomIcon(s){ctx.lineWidth=1.4;ctx.strokeStyle='#c9d2de';ctx.fillStyle='#141c28';ctx.beginPath();for(let i=0;i<6;i++){const a=-Math.PI/2+i*Math.PI/3;ctx.lineTo(Math.cos(a)*s*.75,Math.sin(a)*s*.75);}ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#ffb84d';ctx.beginPath();ctx.moveTo(0,-s*.75);ctx.lineTo(Math.cos(-Math.PI/6)*s*.75,Math.sin(-Math.PI/6)*s*.75);ctx.lineTo(0,0);ctx.closePath();ctx.fill();
  ctx.fillStyle='#04060c';ctx.beginPath();ctx.arc(0,0,s*.24,0,TAU);ctx.fill();ctx.stroke();}
function drawPickups(){
  for(const k of G.pick){
    const fade=k.life<3?(Math.sin(k.life*14)>0?1:.3):1;ctx.globalAlpha=fade;
    if(k.k==='lom'){glow(k.x,k.y,12,'#ffb84d',.35);ctx.save();ctx.translate(k.x,k.y);ctx.rotate(k.t*1.5);drawLomIcon(9);ctx.restore();}
    else if(k.k==='xp'){glow(k.x,k.y,12,'#b48cff',.7);ctx.fillStyle='#d9c8ff';ctx.save();ctx.translate(k.x,k.y);ctx.rotate(k.t*3);ctx.fillRect(-3,-3,6,6);ctx.restore();}
    else if(k.k==='cell'){const unstable=k.stab>0;glow(k.x,k.y,24,'#ffb84d',unstable?.35+.3*Math.sin(k.t*20):.8);
      ctx.save();ctx.translate(k.x,k.y);ctx.strokeStyle='#ffb84d';ctx.lineWidth=2;ctx.fillStyle=unstable?'#3a2a10':'#ffb84d';
      poly(6,8,Math.PI/6);ctx.fill();ctx.stroke();
      if(unstable){ctx.beginPath();ctx.arc(0,0,14,-Math.PI/2,-Math.PI/2+TAU*(1-k.stab/2));ctx.stroke();}ctx.restore();}
    else{glow(k.x,k.y,22,'#8fe9ff',.6);ctx.save();ctx.translate(k.x,k.y);ctx.fillStyle='#0b1a28';ctx.strokeStyle='#8fe9ff';ctx.lineWidth=2;ctx.fillRect(-9,-9,18,18);ctx.strokeRect(-9,-9,18,18);
      ctx.fillStyle='#8fe9ff';ctx.fillRect(-2,-6,4,12);ctx.fillRect(-6,-2,12,4);ctx.restore();}
  }
  ctx.globalAlpha=1;
}
function drawDark(sx,sy){
  if(!darkC||darkC.width!==cv.width||darkC.height!==cv.height){darkC=document.createElement('canvas');darkC.width=cv.width;darkC.height=cv.height;dctx=darkC.getContext('2d');}
  const k=DPR*SC,p=G.player;
  dctx.globalCompositeOperation='source-over';dctx.clearRect(0,0,darkC.width,darkC.height);
  dctx.fillStyle=`rgba(1,2,7,${(.93*(1-G.lightFull)).toFixed(3)})`;dctx.fillRect(0,0,darkC.width,darkC.height);
  dctx.globalCompositeOperation='destination-out';
  const hole=(x,y,r)=>{const X=(x+sx)*k,Y=(y+sy)*k,R=r*k;const g=dctx.createRadialGradient(X,Y,R*.35,X,Y,R);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');dctx.fillStyle=g;dctx.beginPath();dctx.arc(X,Y,R,0,TAU);dctx.fill();};
  if(G.bc)hole(G.bc.x,G.bc.y,beaconLight());
  if(p)hole(p.x,p.y,G.st.light);
  for(const e of G.enemies)if(e.reveal>0)hole(e.x,e.y,55);
  {const S=G.storm;if(S&&S.warn<=0){dctx.fillStyle='rgba(0,0,0,.5)';if(S.axis==='x')dctx.fillRect((S.pos-S.w/2+sx)*k,0,S.w*k,darkC.height);else dctx.fillRect(0,(S.pos-S.w/2+sy)*k,darkC.width,S.w*k);}}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(darkC,0,0);ctx.restore();
}
function drawMiniBeacon(x,y,col,t){ctx.save();ctx.translate(x,y);glow(0,0,50,col,.5);ctx.fillStyle='#0b1220';ctx.strokeStyle=col;ctx.lineWidth=2;poly(8,24,t*.3);ctx.fill();ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,7,0,TAU);ctx.fill();ctx.restore();}
function drawBeacon(bc,t){
  const R=bc.r,col=bc.cool>0?'#ff6b4d':'#ffb84d';
  ctx.save();ctx.translate(bc.x,bc.y);
  if(SET.fx){ctx.globalCompositeOperation='lighter';const len=bc.cool>0?260:440;
    for(let k=0;k<2;k++){const ang=t*.9+k*Math.PI;const g=ctx.createLinearGradient(0,0,Math.cos(ang)*len,Math.sin(ang)*len);g.addColorStop(0,col+'40');g.addColorStop(1,col+'00');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,len,ang-.15,ang+.15);ctx.closePath();ctx.fill();}
    ctx.globalCompositeOperation='source-over';}
  glow(0,0,R*2.6,col,.55+.25*bc.charge/100);
  ctx.fillStyle=bc.hitF>0?'#3a1a1a':'#0b1220';ctx.strokeStyle=bc.hitF>0?'#ff4f6e':col;ctx.lineWidth=2.5;poly(8,R,Math.PI/8);ctx.fill();ctx.stroke();
  ctx.save();ctx.rotate(bc.rot*.7);ctx.lineWidth=2;for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(0,0,R*.68,i/6*TAU,i/6*TAU+.6);ctx.stroke();}ctx.restore();
  ctx.fillStyle=col;ctx.globalAlpha=.4+.6*bc.charge/100;ctx.beginPath();ctx.arc(0,0,R*.36,0,TAU);ctx.fill();ctx.globalAlpha=1;
  ctx.strokeStyle='rgba(255,184,77,.18)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,R+9,0,TAU);ctx.stroke();
  ctx.strokeStyle=bc.transStarted?'#8fe9ff':'#ffb84d';ctx.beginPath();ctx.arc(0,0,R+9,-Math.PI/2,-Math.PI/2+TAU*bc.charge/100);ctx.stroke();
  ctx.strokeStyle='#04060c';ctx.lineWidth=2;for(const q of [25,50,75]){const a=-Math.PI/2+TAU*q/100;ctx.beginPath();ctx.moveTo(Math.cos(a)*(R+6),Math.sin(a)*(R+6));ctx.lineTo(Math.cos(a)*(R+12),Math.sin(a)*(R+12));ctx.stroke();}
  if(bc.mods.turret){ctx.save();ctx.rotate(bc.turA);ctx.fillStyle='#ffcf80';ctx.fillRect(R*.3,-3,R*.9,6);ctx.restore();}
  if(bc.barrier>0){ctx.strokeStyle=bc.barF>0?'#ffffff':'#8fe9ff';ctx.globalAlpha=.25+.35*bc.barrier/100;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,R+20,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
  if(bc.cool>0&&SET.fx&&Math.random()<.5)part(bc.x+rnd(-10,10),bc.y+rnd(-10,10),rnd(-40,40),rnd(-90,-30),.7,'#ff8a6b',3);
  if(bc.transStarted&&!bc.transDone){ctx.strokeStyle='#8fe9ff';ctx.globalAlpha=.6;ctx.lineWidth=1.5;const k=(t*1.2)%1;ctx.beginPath();ctx.arc(0,0,R+20+k*120,0,TAU);ctx.globalAlpha=.6*(1-k);ctx.stroke();ctx.globalAlpha=1;}
  ctx.restore();
}
function drawPlayer(p,t){
  if(p.hp<=0)return;
  const SKID=curSkin(),SKC=SKINS[SKID].trail;
  for(const tr of p.trail){glow(tr.x,tr.y,10,SKC,Math.min(1,tr.t*3));}
  const st=G.st;
  for(let i=0;i<st.drones;i++){const a=p.droneA+i*Math.PI,x=p.x+Math.cos(a)*34,y=p.y+Math.sin(a)*34;glow(x,y,12,'#b48cff',.7);ctx.fillStyle='#e2d6ff';ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();}
  ctx.globalAlpha=p.inv>0&&p.dashT<=0&&Math.sin(t*40)<0?.4:1;
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.ang);
  const sp=Math.hypot(p.vx,p.vy);
  drawShip(SKID,t,sp,{noDash:p.noDash>0});
  for(let i=0;i<p.cargo;i++){ctx.fillStyle='#ffb84d';ctx.fillRect(-9-i*6,-2.5,4,5);}
  ctx.restore();ctx.globalAlpha=1;
  if(p.chg>0){const q=Math.min(1,p.chg/CHG_T);ctx.strokeStyle=q>=1?'#ffffff':shipCol();ctx.lineWidth=q>=1?3:2;ctx.globalAlpha=q>=1?.7+.3*Math.sin(t*20):.8;ctx.beginPath();ctx.arc(p.x,p.y,30,-Math.PI/2,-Math.PI/2+TAU*q);ctx.stroke();ctx.globalAlpha=1;if(q>=1)glow(p.x+Math.cos(p.ang)*18,p.y+Math.sin(p.ang)*18,22,'#ffffff',.6);}
  if(p.shieldUp){ctx.strokeStyle='#8fe9ff';ctx.globalAlpha=.35+.15*Math.sin(t*4);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(p.x,p.y,24,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
  if(p.noDash>0){ctx.strokeStyle='#6bf0ff';ctx.globalAlpha=.5;ctx.lineWidth=1;for(let i=0;i<3;i++){const a=rnd(0,TAU);ctx.beginPath();ctx.moveTo(p.x+Math.cos(a)*10,p.y+Math.sin(a)*10);ctx.lineTo(p.x+Math.cos(a+.4)*22,p.y+Math.sin(a+.4)*22);ctx.stroke();}ctx.globalAlpha=1;}
}
function poly(n,r,rot=0){ctx.beginPath();for(let i=0;i<n;i++){const a=rot+i/n*TAU;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();}
function drawEnemy(e,t,icon){
  if(EDEF[e.type].zb){if(icon)zbIcon(e);else if(e.zb===2)zbDrawCopy(e,t);else zbDrawBoss(e,t);return;}
  const d=EDEF[e.type],col=e.flash>0?'#ffffff':e.rebuilt?'#b5652e':e.mem100?'#a8b4b0':d.col;
  if(!icon&&e.type!=='mine'&&e.type!=='shell'&&e.type!=='obseg'&&!e.ghost&&!e.hid90)glow(e.x,e.y,e.r*2.6,d.col,e.type==='boss'||e.type==='jam'||e.sbk?.5:.35);
  ctx.save();ctx.translate(e.x,e.y);
  let alpha=1;if(e.spawnT>0)alpha=Math.max(0,1-e.spawnT);if(e.ghost)alpha*=.22;if(e.down>0)alpha*=.35+.2*Math.sin(t*10);
  ctx.globalAlpha=alpha;
  ctx.fillStyle='#0a0f1c';ctx.strokeStyle=col;ctx.lineWidth=2;
  const face=Math.atan2(e.vy,e.vx);
  const P=G.player||{x:e.x+100,y:e.y};
  switch(e.type){
    case 'scout':case 'mite':ctx.rotate(face);ctx.beginPath();ctx.moveTo(e.r,0);ctx.lineTo(-e.r*.8,-e.r*.75);ctx.lineTo(-e.r*.4,0);ctx.lineTo(-e.r*.8,e.r*.75);ctx.closePath();ctx.fill();ctx.stroke();break;
    case 'gunner':{const a=icon?0:Math.atan2(P.y-e.y,P.x-e.x);ctx.rotate(a);poly(4,e.r);ctx.fill();ctx.stroke();ctx.fillStyle=e.charging?'#ffffff':col;ctx.fillRect(4,-2.5,e.r+2,5);
      if(e.charging&&!icon)glow(e.r+6,0,10,'#ff9a4d',G.noTele?.45:.9);break;}
    case 'rammer':ctx.rotate(e.st==='aim'||e.st==='charge'?e.aim:face);ctx.beginPath();ctx.moveTo(e.r+4,0);ctx.lineTo(-e.r,-e.r);ctx.lineTo(-e.r*.5,0);ctx.lineTo(-e.r,e.r);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(e.r+4,0);ctx.lineTo(0,0);ctx.stroke();break;
    case 'splitter':ctx.rotate(e.t*.8);for(let i=0;i<3;i++){const a=i/3*TAU;ctx.save();ctx.translate(Math.cos(a)*6,Math.sin(a)*6);poly(6,e.r*.55,0);ctx.fill();ctx.stroke();ctx.restore();}break;
    case 'miner':ctx.rotate(e.t*1.5);ctx.fillRect(-e.r*.7,-e.r*.7,e.r*1.4,e.r*1.4);ctx.strokeRect(-e.r*.7,-e.r*.7,e.r*1.4,e.r*1.4);ctx.rotate(Math.PI/4);ctx.strokeRect(-e.r*.45,-e.r*.45,e.r*.9,e.r*.9);break;
    case 'mine':{const armed=icon||e.arm<=0;const blink=e.fuse>0?Math.sin(t*60)>0:Math.sin(t*4)>0;
      if(!icon&&armed){ctx.globalAlpha=alpha*.12;ctx.beginPath();ctx.arc(0,0,64,0,TAU);ctx.stroke();ctx.globalAlpha=alpha;}
      poly(8,e.r,e.t);ctx.fill();ctx.stroke();ctx.fillStyle=armed&&blink?(e.fuse>0?'#ffffff':'#ffd24d'):'#5a4a20';ctx.beginPath();ctx.arc(0,0,3.5,0,TAU);ctx.fill();break;}
    case 'shielder':ctx.beginPath();ctx.arc(0,0,e.r,0,TAU);ctx.fill();ctx.stroke();ctx.rotate(e.t);ctx.setLineDash([5,5]);ctx.beginPath();ctx.arc(0,0,e.r+6,0,TAU);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,4,0,TAU);ctx.fill();break;
    case 'lancer':ctx.rotate(e.st==='seek'?Math.atan2(P.y-e.y,P.x-e.x)||0:e.aim);ctx.beginPath();ctx.moveTo(e.r+10,0);ctx.lineTo(-e.r,-6);ctx.lineTo(-e.r+4,0);ctx.lineTo(-e.r,6);ctx.closePath();ctx.fill();ctx.stroke();
      if(e.st==='aim'||e.st==='lock'){ctx.fillStyle='#ff3dbb';ctx.beginPath();ctx.arc(e.r+10,0,3+2*Math.sin(t*20),0,TAU);ctx.fill();}break;
    case 'guard':ctx.rotate(e.face);poly(6,e.r,0);ctx.fill();ctx.stroke();poly(6,e.r*.5,0);ctx.stroke();
      if(!icon&&e.shieldDown>0){ctx.strokeStyle='#6b5a3a';ctx.lineWidth=2;ctx.setLineDash([3,5]);ctx.beginPath();ctx.arc(0,0,e.r+7,-1.05,1.05);ctx.stroke();ctx.setLineDash([]);}else{ctx.strokeStyle=e.shieldFlash>0?'#ffffff':'#ffb84d';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,e.r+7,-1.05,1.05);ctx.stroke();}ctx.lineWidth=2;break;
    case 'pylon':ctx.rotate(e.t*2);poly(4,e.r,0);ctx.fill();ctx.stroke();ctx.fillStyle=col;poly(4,e.r*.4,0);ctx.fill();break;
    case 'seeker':ctx.rotate(face);ctx.beginPath();ctx.moveTo(e.r+2,0);ctx.lineTo(-e.r,-e.r*.7);ctx.lineTo(-e.r,e.r*.7);ctx.closePath();ctx.fillStyle=col;ctx.fill();break;
    case 'boss':drawBoss(e,t);break;
    // ---- Акт II ----
    case 'moth':{ctx.rotate(face);const f=.4+.6*Math.abs(Math.sin(e.t*18+e.seed));ctx.fillStyle=col;ctx.globalAlpha=alpha*.85;
      ctx.beginPath();ctx.moveTo(2,0);ctx.lineTo(-4,-e.r*1.3*f);ctx.lineTo(-6,0);ctx.lineTo(-4,e.r*1.3*f);ctx.closePath();ctx.fill();ctx.globalAlpha=alpha;ctx.fillStyle='#ffffff';ctx.fillRect(-3,-1,6,2);break;}
    case 'leech':ctx.rotate(e.att?e.ang+Math.PI:face);ctx.beginPath();ctx.ellipse(0,0,e.r*1.2,e.r*.7,0,0,TAU);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-e.r*1.2,0);ctx.quadraticCurveTo(-e.r*2,Math.sin(e.t*8)*6,-e.r*2.6,0);ctx.stroke();
      ctx.fillStyle=col;ctx.beginPath();ctx.arc(e.r*.7,0,2.5,0,TAU);ctx.fill();break;
    case 'carrier':ctx.rotate(face);ctx.beginPath();ctx.rect(-e.r,-e.r*.65,e.r*2,e.r*1.3);ctx.fill();ctx.stroke();for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(i*7,-e.r*.65);ctx.lineTo(i*7,e.r*.65);ctx.stroke();}
      ctx.fillStyle=col;ctx.fillRect(e.r-4,-3,6,6);break;
    case 'jammerS':{ctx.beginPath();ctx.arc(0,0,e.r*.7,0,TAU);ctx.fill();ctx.stroke();for(let i=0;i<6;i++){const a=i/6*TAU+e.t;ctx.beginPath();ctx.moveTo(Math.cos(a)*e.r*.7,Math.sin(a)*e.r*.7);ctx.lineTo(Math.cos(a)*e.r*1.3,Math.sin(a)*e.r*1.3);ctx.stroke();}
      if(!icon){const k=(e.t*.8)%1;ctx.globalAlpha=alpha*(1-k)*.6;ctx.beginPath();ctx.arc(0,0,e.r+k*60,0,TAU);ctx.stroke();ctx.globalAlpha=alpha;}break;}
    case 'cutter':ctx.rotate(e.t*(e.cutting?18:6));for(let i=0;i<2;i++){ctx.save();ctx.rotate(i*Math.PI/2);ctx.beginPath();ctx.moveTo(-e.r*1.2,-2);ctx.lineTo(e.r*1.2,-2);ctx.lineTo(e.r*1.2,2);ctx.lineTo(-e.r*1.2,2);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
      ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,3,0,TAU);ctx.fill();break;
    case 'tug':ctx.rotate(face);ctx.fillRect(-e.r*.8,-e.r*.8,e.r*1.6,e.r*1.6);ctx.strokeRect(-e.r*.8,-e.r*.8,e.r*1.6,e.r*1.6);ctx.beginPath();ctx.arc(-e.r*1.1,0,5,-Math.PI/2,Math.PI/2,true);ctx.stroke();break;
    case 'mortar':ctx.beginPath();ctx.moveTo(-e.r,e.r*.6);ctx.lineTo(e.r,e.r*.6);ctx.lineTo(e.r*.6,-e.r*.4);ctx.lineTo(-e.r*.6,-e.r*.4);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.save();ctx.rotate(-Math.PI/2+.3*Math.sin(e.t));ctx.fillStyle=col;ctx.fillRect(0,-3,e.r*1.1,6);ctx.restore();break;
    case 'shell':{const h=icon?0:e.h||0;ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(0,0,7,4,0,0,TAU);ctx.fill();ctx.translate(0,-h);glow(0,0,14,'#ff8f5a',.9);ctx.fillStyle='#ffd0b0';ctx.beginPath();ctx.arc(0,0,5,0,TAU);ctx.fill();break;}
    case 'phantom':ctx.rotate(face);ctx.beginPath();ctx.moveTo(e.r,0);ctx.lineTo(-e.r,-e.r*.8);ctx.quadraticCurveTo(-e.r*.3,0,-e.r,e.r*.8);ctx.closePath();ctx.fill();ctx.stroke();break;
    case 'shade':{ctx.rotate(face);if(e.reveal>0&&!icon)glow(0,0,26,'#ffffff',.6);poly(4,e.r,0);ctx.fillStyle='#05040c';ctx.fill();ctx.stroke();ctx.fillStyle=e.reveal>0?'#ffffff':col;ctx.fillRect(2,-1.5,5,3);break;}
    case 'mirror':ctx.rotate(e.face);poly(6,e.r,Math.PI/6);ctx.fill();ctx.stroke();ctx.strokeStyle=e.shieldFlash>0?'#ffffff':'#c7d6ff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,e.r+6,-1,1);ctx.stroke();
      ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,e.r+10,-1,1);ctx.stroke();break;
    case 'hive':{poly(8,e.r,Math.PI/8);ctx.fill();ctx.stroke();ctx.fillStyle=col;for(let i=0;i<6;i++){const a=i/6*TAU+e.t*.3;ctx.globalAlpha=alpha*(.4+.6*Math.abs(Math.sin(e.t*2+i)));ctx.beginPath();ctx.arc(Math.cos(a)*e.r*.5,Math.sin(a)*e.r*.5,3.5,0,TAU);ctx.fill();}ctx.globalAlpha=alpha;break;}
    case 'shocker':{ctx.beginPath();ctx.arc(0,0,e.r,0,TAU);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-4,-7);ctx.lineTo(2,-1);ctx.lineTo(-2,1);ctx.lineTo(4,7);ctx.stroke();if(e.st==='charge'&&!icon)glow(0,0,24,'#6bf0ff',.9);break;}
    case 'vortex':{ctx.rotate(-e.t*3);for(let i=0;i<3;i++){ctx.save();ctx.rotate(i/3*TAU);ctx.beginPath();ctx.arc(e.r*.4,0,e.r*.6,Math.PI,TAU);ctx.stroke();ctx.restore();}ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,4,0,TAU);ctx.fill();break;}
    case 'twin':ctx.rotate(e.t*2);ctx.beginPath();ctx.arc(0,0,e.r,Math.PI/2,Math.PI*1.5);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(3,0,e.r*.7,-Math.PI/2,Math.PI/2);ctx.stroke();
      if(e.down>0&&!icon){ctx.rotate(-e.t*2);ctx.strokeStyle='#ffffff';ctx.beginPath();ctx.arc(0,0,e.r+6,-Math.PI/2,-Math.PI/2+TAU*(1-e.down/3));ctx.stroke();}break;
    case 'thief':ctx.rotate(face);ctx.beginPath();ctx.moveTo(e.r+3,0);ctx.lineTo(-e.r,-e.r*.6);ctx.lineTo(-e.r*.5,0);ctx.lineTo(-e.r,e.r*.6);ctx.closePath();ctx.fill();ctx.stroke();
      if(e.loot){ctx.fillStyle='#ffb84d';ctx.fillRect(-e.r-6,-3,6,6);}break;
    case 'hunter':ctx.rotate(face);ctx.beginPath();ctx.moveTo(e.r+6,0);ctx.lineTo(-e.r,-e.r);ctx.lineTo(-e.r*.2,0);ctx.lineTo(-e.r,e.r);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(e.r+6,0);ctx.lineTo(-e.r*.2,0);ctx.stroke();
      ctx.fillStyle=col;ctx.beginPath();ctx.arc(e.r*.2,0,2.5,0,TAU);ctx.fill();break;
    case 'commander':ctx.rotate(face);ctx.beginPath();ctx.moveTo(e.r,0);ctx.lineTo(-e.r*.6,-e.r);ctx.lineTo(-e.r*.2,0);ctx.lineTo(-e.r*.6,e.r);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle=col;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.arc(-e.r*.5,i*6,2,0,TAU);ctx.fill();}break;
    case 'cruiser':{ctx.rotate(icon?0:e.ang);ctx.beginPath();ctx.moveTo(e.r*1.8,0);ctx.lineTo(e.r*.4,-e.r);ctx.lineTo(-e.r*1.7,-e.r);ctx.lineTo(-e.r*1.7,e.r);ctx.lineTo(e.r*.4,e.r);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.arc(0,0,e.r*.45,0,TAU);ctx.fillStyle=col;ctx.globalAlpha=alpha*.6;ctx.fill();ctx.globalAlpha=alpha;
      if(icon){ctx.strokeStyle='#ff9a7a';ctx.strokeRect(-e.r*1.9,-e.r*.9,8,8);ctx.strokeRect(-e.r*1.9,e.r*.5,8,8);}break;}
    case 'cpart':{const h=e.host;ctx.rotate(h?h.ang:0);if(e.role==='gun'){ctx.fillRect(-e.r,-e.r*.7,e.r*2,e.r*1.4);ctx.strokeRect(-e.r,-e.r*.7,e.r*2,e.r*1.4);ctx.fillStyle=col;ctx.fillRect(e.r*.2,-2.5,e.r*1.4,5);}
      else{ctx.beginPath();ctx.arc(0,0,e.r,0,TAU);ctx.fill();ctx.stroke();if(!icon)glow(-e.r,0,12,'#ffb070',.8);}break;}
    case 'antenna':{ctx.beginPath();ctx.moveTo(0,e.r);ctx.lineTo(0,-e.r*1.6);ctx.stroke();ctx.beginPath();ctx.moveTo(-e.r*.8,e.r);ctx.lineTo(e.r*.8,e.r);ctx.stroke();
      for(let i=0;i<3;i++){const k=((e.t*1.5+i/3)%1);ctx.globalAlpha=alpha*(1-k);ctx.beginPath();ctx.arc(0,-e.r*1.6,3+k*14,0,TAU);ctx.stroke();}ctx.globalAlpha=alpha;break;}
    case 'decoy':ctx.restore();ctx.save();ctx.globalAlpha=alpha*(.6+.4*(Math.sin(t*14)>0?1:.5));drawMiniBeacon(e.x,e.y,'#8fe9ff',t);ctx.translate(e.x,e.y);break;
    case 'crate':ctx.rotate(e.t*.5);ctx.fillRect(-e.r*.8,-e.r*.8,e.r*1.6,e.r*1.6);ctx.strokeRect(-e.r*.8,-e.r*.8,e.r*1.6,e.r*1.6);ctx.beginPath();ctx.moveTo(-e.r*.8,-e.r*.8);ctx.lineTo(e.r*.8,e.r*.8);ctx.moveTo(e.r*.8,-e.r*.8);ctx.lineTo(-e.r*.8,e.r*.8);ctx.stroke();break;
    case 'frost':{ctx.rotate(e.t*.6);for(let i=0;i<3;i++){const a=i*Math.PI/3;ctx.beginPath();ctx.moveTo(Math.cos(a)*e.r,Math.sin(a)*e.r);ctx.lineTo(-Math.cos(a)*e.r,-Math.sin(a)*e.r);ctx.stroke();}
      poly(6,e.r*.55);ctx.fill();ctx.stroke();ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(0,0,2.2,0,TAU);ctx.fill();break;}
    case 'archivist':{const a=icon?0:Math.atan2(P.y-e.y,P.x-e.x);ctx.rotate(a);ctx.fillRect(-e.r*.9,-e.r*.6,e.r*1.6,e.r*1.2);ctx.strokeRect(-e.r*.9,-e.r*.6,e.r*1.6,e.r*1.2);
      ctx.strokeStyle='rgba(143,216,255,.6)';ctx.lineWidth=1;ctx.beginPath();for(let i=-2;i<=2;i++){ctx.moveTo(-e.r*.7,i*e.r*.25);ctx.lineTo(e.r*.5,i*e.r*.25);}ctx.stroke();ctx.strokeStyle=col;ctx.lineWidth=2;
      ctx.fillStyle=e.st==='rec'?'#ffffff':col;ctx.beginPath();ctx.arc(e.r*.9,0,3,0,TAU);ctx.fill();break;}
    case 'icecopy':{ctx.rotate(e.face||0);ctx.globalAlpha=alpha*.85;drawShip(SKINS[e.skin]?e.skin:curSkin(),t,160,{});ctx.globalAlpha=alpha*.7;ctx.strokeStyle='#dff6ff';ctx.lineWidth=1.5;poly(6,20,t*.8);ctx.stroke();break;}
    case 'rustcopy':{ctx.rotate(e.face||face);ctx.globalAlpha=alpha*.9;drawShip(SKINS[e.skin]?e.skin:'base',t,120,{});ctx.globalAlpha=alpha*.5;ctx.fillStyle='#8a3a12';ctx.beginPath();ctx.arc(0,0,15,0,TAU);ctx.fill();ctx.globalAlpha=alpha;ctx.strokeStyle='#c96a2a';ctx.lineWidth=1.5;poly(4,19,t*.5);ctx.stroke();break;}
    case 'inventor':{const b=!icon&&G.sb===e?e:null,open=b&&b.open>0&&b.st==='fight';ctx.rotate(Math.sin(e.t*.3)*.08);ctx.fillStyle='#0b1628';ctx.strokeStyle=open?'#ffffff':col;ctx.lineWidth=2.5;
      const k=icon?.42:1;ctx.scale(k,k);ctx.beginPath();ctx.moveTo(-65,-14);ctx.lineTo(-50,-24);ctx.lineTo(50,-24);ctx.lineTo(65,-14);ctx.lineTo(65,14);ctx.lineTo(50,24);ctx.lineTo(-50,24);ctx.lineTo(-65,14);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(159,216,255,.55)';ctx.lineWidth=1;for(let i=-4;i<=4;i++){ctx.beginPath();ctx.moveTo(i*13,-20);ctx.lineTo(i*13,20);ctx.stroke();}
      for(let i=-4;i<4;i++){ctx.fillStyle=((i+4+(e.t*2|0))%3===0)?'#bfe8ff':'#1c3a55';ctx.fillRect(i*13+3,-8,7,16);}
      glow(0,0,36,open?'#ffffff':'#9fd8ff',open?1:.5);ctx.fillStyle=open||e.flash>0?'#ffffff':'#dff6ff';ctx.beginPath();ctx.arc(0,0,12,0,TAU);ctx.fill();
      if(b&&(b.inv0>0||b.st==='enter'||b.st==='final')){ctx.strokeStyle=e.domeFlash>0?'#ffffff':'#9fd8ff';ctx.globalAlpha=alpha*.35;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,e.r+12,0,TAU);ctx.stroke();ctx.globalAlpha=alpha;}break;}
    case 'invcell':{const c=e.cell,b=G.sb;ctx.rotate(icon?0:Math.atan2(e.y-(b?b.y:e.y-1),e.x-(b?b.x:e.x-1)));ctx.fillStyle='#0b1a28';ctx.strokeStyle=c&&c.locked?'#5a6b80':col;ctx.lineWidth=2;ctx.fillRect(-11,-9,22,18);ctx.strokeRect(-11,-9,22,18);
      ctx.strokeStyle='rgba(191,232,255,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-6,-9);ctx.lineTo(-6,9);ctx.moveTo(4,-9);ctx.lineTo(4,9);ctx.stroke();ctx.fillStyle=c&&c.label?'#ffffff':'#8fd8ff';ctx.fillRect(-3,-2,6,4);break;}
    case 'invcore':{const mem=e.core==='memory',cc=mem?'#ffd36b':'#bfe8ff';glow(0,0,44,cc,.6);ctx.fillStyle='#0b1220';ctx.strokeStyle=e.flash>0?'#ffffff':cc;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,0,e.r,0,TAU);ctx.fill();ctx.stroke();
      ctx.strokeStyle=cc;ctx.lineWidth=1.2;if(mem){for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(-10,i*5);ctx.lineTo(10,i*5);ctx.stroke();}}else{for(let i=0;i<3;i++){const a=i*Math.PI/3+e.t*.5;ctx.beginPath();ctx.moveTo(Math.cos(a)*12,Math.sin(a)*12);ctx.lineTo(-Math.cos(a)*12,-Math.sin(a)*12);ctx.stroke();}}break;}
    case 'obheart':{const b=!icon&&G.sb===e?e:null,open=b&&obHeartOpen(b);ctx.rotate(e.t*.4);const k=icon?.7:1;ctx.scale(k,k);ctx.fillStyle='#1a0e06';ctx.strokeStyle=open||e.flash>0?'#ffffff':col;ctx.lineWidth=3;poly(8,e.r,0);ctx.fill();ctx.stroke();
      ctx.strokeStyle='#c96a2a';ctx.lineWidth=1.5;for(let i=0;i<4;i++){const a=i*Math.PI/4;ctx.beginPath();ctx.moveTo(Math.cos(a)*e.r*.45,Math.sin(a)*e.r*.45);ctx.lineTo(-Math.cos(a)*e.r*.45,-Math.sin(a)*e.r*.45);ctx.stroke();}
      glow(0,0,e.r*1.2,open?'#ffffff':'#ffb060',open?1:.5);ctx.fillStyle=open?'#ffffff':'#ffd0a0';ctx.beginPath();ctx.arc(0,0,e.r*.3,0,TAU);ctx.fill();
      if(b&&!open&&b.st!=='dying'){ctx.strokeStyle=e.domeFlash>0?'#ffffff':'#c96a2a';ctx.globalAlpha=alpha*.4;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,e.r+12,0,TAU);ctx.stroke();ctx.globalAlpha=alpha;}break;}
    case 'obseg':{if(icon){ctx.strokeStyle=col;ctx.lineWidth=8;ctx.beginPath();ctx.arc(0,30,44,-2.2,-.95);ctx.stroke();}break;}
    case 'corroder':{ctx.rotate(face);ctx.fillRect(-e.r,-e.r*.7,e.r*1.7,e.r*1.4);ctx.strokeRect(-e.r,-e.r*.7,e.r*1.7,e.r*1.4);ctx.fillStyle='#5a2e14';for(const [x,y] of [[-e.r*.6,-e.r*.3],[0,e.r*.2],[e.r*.3,-e.r*.4]]){ctx.beginPath();ctx.arc(x,y,3,0,TAU);ctx.fill();}
      ctx.fillStyle='#2a1a10';ctx.fillRect(e.r*.7,-e.r*.9,e.r*.4,e.r*1.8);ctx.strokeRect(e.r*.7,-e.r*.9,e.r*.4,e.r*1.8);break;}
    case 'repairer':{ctx.rotate(face);ctx.fillRect(-e.r*.7,-e.r*.6,e.r*1.4,e.r*1.2);ctx.strokeRect(-e.r*.7,-e.r*.6,e.r*1.4,e.r*1.2);ctx.lineWidth=1.5;ctx.beginPath();for(const s of [-1,1]){ctx.moveTo(e.r*.5,s*e.r*.4);ctx.lineTo(e.r*1.2,s*e.r*.9);ctx.lineTo(e.r*1.6,s*e.r*.5);}ctx.stroke();
      ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(0,0,2.5,0,TAU);ctx.fill();if(!icon){ctx.rotate(-face);ctx.fillStyle='#ffb060';ctx.font='700 10px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillText('🔧',0,-e.r-6);}break;}
    case 'hull':{ctx.rotate(e.seed);ctx.globalAlpha=alpha*(.5+.25*Math.sin(t*4));ctx.strokeStyle='#8b96a6';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-e.r,-e.r*.5);ctx.lineTo(e.r*.8,-e.r*.3);ctx.lineTo(e.r*.5,e.r*.6);ctx.lineTo(-e.r*.6,e.r*.5);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(-e.r*.6,0);ctx.lineTo(e.r*.6,0);ctx.stroke();break;}
    case 'jam':drawJam(e,t,icon);break;
    default:drawE74(e,t,icon,col,face,alpha,P);
  }
  ctx.restore();ctx.globalAlpha=1;
  if(icon)return;
  if(e.shieldK<1){ctx.strokeStyle='#9c8cff';ctx.globalAlpha=.6;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(e.x,e.y,e.r+5,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
  if(e.buff>1){ctx.strokeStyle='#ffa63d';ctx.globalAlpha=.5;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(e.x-e.r,e.y+e.r+3);ctx.lineTo(e.x+e.r,e.y+e.r+3);ctx.stroke();ctx.globalAlpha=1;}
  if(e.affix){e.affix.forEach((a,i)=>{ctx.strokeStyle=AFX[a].col;ctx.globalAlpha=.75;ctx.lineWidth=1.5;ctx.setLineDash([3,4]);ctx.lineDashOffset=t*10*(i?-1:1);ctx.beginPath();ctx.arc(e.x,e.y,e.r+6+i*4,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;});
    if(e.armor>0){ctx.fillStyle='#cfd8e6';for(let i=0;i<e.armor;i++)ctx.fillRect(e.x-6+i*5,e.y-e.r-6,3,3);}ctx.globalAlpha=1;}
  if(G.bc&&e.group&&!(e.type==='leech'&&e.att)&&e.spawnT<=0&&!e.ghost&&e.type!=='cpart'){const x=e.x,y=e.y-e.r-11;ctx.globalAlpha=.85;
    if(e.group==='siege'){ctx.fillStyle='#ffb84d';ctx.beginPath();ctx.moveTo(x,y-3.5);ctx.lineTo(x+3.5,y);ctx.lineTo(x,y+3.5);ctx.lineTo(x-3.5,y);ctx.closePath();ctx.fill();}
    else if(e.group==='hunt'){ctx.fillStyle='#ff4f6e';ctx.beginPath();ctx.moveTo(x,y+3.5);ctx.lineTo(x+4,y-3);ctx.lineTo(x-4,y-3);ctx.closePath();ctx.fill();}
    else{ctx.strokeStyle='#4dd0ff';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,3,0,TAU);ctx.stroke();}
    ctx.globalAlpha=1;}
  if(e.type==='pylon'&&G.boss&&e.spawnT<=0){ctx.strokeStyle='#b48cff';ctx.globalAlpha=.25;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(G.boss.x,G.boss.y);ctx.stroke();ctx.globalAlpha=1;}
  if(e.hp<e.maxHp&&e.hp>0&&e.type!=='boss'&&e.type!=='jam'&&e.type!=='mine'&&!e.sbk&&e.maxHp>=30&&!e.noBar90&&!e.hid90){const w=Math.max(20,e.r*2);ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(e.x-w/2,e.y+e.r+6,w,3);ctx.fillStyle=d.col;ctx.fillRect(e.x-w/2,e.y+e.r+6,w*e.hp/e.maxHp,3);}
}
function drawBoss(b,t){
  const over=b.over>0,R=b.r;
  ctx.save();ctx.rotate(b.rot);ctx.lineWidth=5;
  for(let i=0;i<10;i++){const a=i/10*TAU;ctx.strokeStyle=over?(Math.sin(t*20+i)>0?'#ffffff':'#7c5cff'):'#7c5cff';ctx.beginPath();ctx.arc(0,0,R+16,a,a+TAU/10-.12);ctx.stroke();}
  ctx.restore();
  ctx.save();ctx.rotate(-b.rot*1.6);ctx.strokeStyle='#b48cff';ctx.lineWidth=2;poly(6,R,0);ctx.fillStyle='#0d0a1e';ctx.fill();ctx.stroke();poly(6,R*.72,Math.PI/6);ctx.stroke();ctx.restore();
  const cr=R*.38*(over?1+.12*Math.sin(t*25):1);
  glow(0,0,cr*3,over?'#ffffff':'#b48cff',over?1:.6);
  ctx.fillStyle=over||b.flash>0?'#ffffff':'#e0d2ff';ctx.beginPath();ctx.arc(0,0,cr,0,TAU);ctx.fill();
  if(over){ctx.strokeStyle='#8fe9ff';ctx.lineWidth=1.5;for(let i=0;i<5;i++){const a=rnd(0,TAU);ctx.beginPath();ctx.moveTo(Math.cos(a)*cr,Math.sin(a)*cr);ctx.lineTo(Math.cos(a+rnd(-.3,.3))*(R+10),Math.sin(a+rnd(-.3,.3))*(R+10));ctx.stroke();}}
  if(G.enemies.some(o=>o.type==='pylon'&&o.alive)){ctx.strokeStyle=b.domeFlash>0?'#ffffff':'#b48cff';ctx.globalAlpha=.35+.15*Math.sin(t*3);ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,R+30,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
}
function drawJam(j,t,icon){
  const R=j.r,open=!icon&&G.jam===j&&j.st==='fight'&&!jamShielded();
  ctx.save();ctx.rotate(j.rot||0);ctx.strokeStyle='#4dd0ff';ctx.lineWidth=2;
  for(let i=0;i<8;i++){const a=i/8*TAU;ctx.beginPath();ctx.moveTo(Math.cos(a)*R*.8,Math.sin(a)*R*.8);ctx.lineTo(Math.cos(a)*(R+18),Math.sin(a)*(R+18));ctx.stroke();ctx.beginPath();ctx.arc(Math.cos(a)*(R+18),Math.sin(a)*(R+18),3,0,TAU);ctx.stroke();}
  ctx.restore();
  ctx.fillStyle='#06121c';ctx.strokeStyle='#4dd0ff';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,0,R*.85,0,TAU);ctx.fill();ctx.stroke();
  ctx.save();ctx.rotate(-(j.rot||0)*2);ctx.setLineDash([6,6]);ctx.beginPath();ctx.arc(0,0,R*.6,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  glow(0,0,R*.9,open?'#ffffff':'#4dd0ff',open?1:.5);
  ctx.fillStyle=open||j.flash>0?'#ffffff':'#b9f0ff';ctx.beginPath();ctx.arc(0,0,R*.28,0,TAU);ctx.fill();
  if(!icon&&G.jam===j&&j.st!=='dying'&&jamShielded()){ctx.strokeStyle=j.domeFlash>0?'#ffffff':'#4dd0ff';ctx.globalAlpha=.3+.15*Math.sin(t*3);ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,R+28,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
}

