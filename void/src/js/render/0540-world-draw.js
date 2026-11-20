// ---- отрисовка мира ----
function renderWorld(now){
  const t=now/1000,p=G.player,S=G.save;
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  if(nebula)ctx.drawImage(nebula,0,0,cv.width,cv.height);
  const rI=G.riftI||0,sx=(G.shake?rnd(-G.shake,G.shake):0)+(SET.fx?Math.sin(t*1.3)*6*rI:0),sy=(G.shake?rnd(-G.shake,G.shake):0)+(SET.fx?Math.cos(t*1.1)*6*rI:0),k=DPR*SC;
  ctx.setTransform(k,0,0,k,0,0);
  for(const s of stars){const x=((s.x-CX*s.k*2.5)%(W*1.2)+W*1.2)%(W*1.2)-W*.1,y=((s.y-CY*s.k*2.5)%(H*1.2)+H*1.2)%(H*1.2)-H*.1;
    ctx.globalAlpha=.45+.4*Math.sin(t*1.3+s.tw);ctx.fillStyle=s.k>.06?'#cfeeff':'#7f9ab5';ctx.fillRect(x,y,s.s,s.s);}
  ctx.globalAlpha=1;
  wbg95(t,k,sx,sy);{const Z=G.wz95||1;ctx.setTransform(k*Z,0,0,k*Z,((sx-CX)*Z+W/2*(1-Z))*k,((sy-CY)*Z+H/2*(1-Z))*k);}
  if(SET.fx)for(const n of G.decor)if(inView(n.x,n.y,n.r))glow(n.x,n.y,n.r,n.col,n.a);
  for(const sc of WORLD.sectors){const b=sc.box;if(b[2]<CX-50||b[0]>CX+W+50||b[3]<CY-50||b[1]>CY+H+50)continue;ctx.strokeStyle=sc.col;ctx.globalAlpha=.16;ctx.lineWidth=4;ctx.setLineDash([24,18]);ctx.strokeRect(b[0],b[1],b[2]-b[0],b[3]-b[1]);ctx.setLineDash([]);ctx.globalAlpha=1;
    if(inView(b[0]+260,b[3]-60,300)){ctx.font='700 13px "JetBrains Mono",monospace';ctx.textAlign='left';ctx.fillStyle=sc.col;ctx.globalAlpha=.55;ctx.fillText('СЕКТОР '+roman(WORLD.sectors.indexOf(sc)+1)+' · '+sc.name,b[0]+40,b[3]-40);ctx.globalAlpha=1;}
    if(sc.bx&&inView(sc.bx,sc.by,120)){ctx.save();ctx.translate(sc.bx,sc.by);glow(0,0,90,sc.col,.35);ctx.rotate(t*.4);ctx.strokeStyle=sc.col;ctx.lineWidth=2;poly(4,22,0);ctx.stroke();ctx.rotate(-t*.8);poly(4,12,0);ctx.stroke();ctx.restore();worldLabel(sc.bx,sc.by-46,'МАЯК СЕКТОРА '+roman(WORLD.sectors.indexOf(sc)+1),sc.col);}}
  // ворота
  const gt=WORLD.gate;
  if(!gateOpen()/* ВРЕМЕННО (альфа 0.5.9) */){ctx.strokeStyle='#7c5cff';ctx.lineWidth=1.5;const y0=Math.max(OY,CY-40),y1=Math.min(OY+WH0,CY+H+40);
    for(let y=y0-(y0%30);y<y1;y+=30){ctx.globalAlpha=.15+.35*Math.abs(Math.sin(t*3+y*.05));ctx.beginPath();ctx.moveTo(5000+rnd(-6,6),y);ctx.lineTo(5000+rnd(-6,6),y+22);ctx.stroke();}
    ctx.globalAlpha=1;}
  if(inView(gt.x,gt.y,260)){ctx.save();ctx.translate(gt.x,gt.y);glow(0,0,240,S.gate?'#8fe9ff':'#7c5cff',.35);ctx.rotate(t*.15);ctx.strokeStyle=S.gate?'#8fe9ff':'#b48cff';ctx.lineWidth=4;
    for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(0,0,150,i/6*TAU,i/6*TAU+.7);ctx.stroke();}ctx.restore();
    if(!S.gate)for(const e of G.enemies)if(e.type==='lock'&&e.alive){ctx.strokeStyle='#b48cff';ctx.globalAlpha=.4+.3*Math.sin(t*6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(gt.x,gt.y);ctx.stroke();ctx.globalAlpha=1;}
    worldLabel(gt.x,gt.y-185,S.gate?'ВОРОТА ОТКРЫТЫ':ALPHA_OPEN/* ВРЕМЕННО (альфа 0.5.9) */?'ВОРОТА СЕКТОРА · АЛЬФА: ПРОХОД ОТКРЫТ':'ВОРОТА СЕКТОРА',S.gate?'#8fe9ff':'#b48cff');}
  // аномалии
  for(const a of WORLD.anomalies){if(!inView(a.x,a.y,420))continue;const done=S.anomalies[a.id],act=G.anom&&G.anom.a===a;
    if(act&&a.kind==='storm'){const A=G.anom;ctx.strokeStyle='#9fb4ff';ctx.lineWidth=2;ctx.globalAlpha=.6;ctx.setLineDash([10,8]);ctx.beginPath();ctx.arc(a.x,a.y,A.R,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
      if(A.beamWarn||A.beamOn)for(const k of [0,Math.PI]){const ang=A.beamA+k,ex=a.x+Math.cos(ang)*A.R,ey=a.y+Math.sin(ang)*A.R;
        if(A.beamOn){ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#9fb4ff';ctx.globalAlpha=.5;ctx.lineWidth=22;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(ex,ey);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.globalAlpha=.9;ctx.lineWidth=4;ctx.stroke();ctx.globalCompositeOperation='source-over';}
        else{ctx.strokeStyle='#9fb4ff';ctx.globalAlpha=.4+.4*Math.sin(t*30);ctx.lineWidth=2;ctx.setLineDash([12,8]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(ex,ey);ctx.stroke();ctx.setLineDash([]);}ctx.globalAlpha=1;}}
    if(done){ctx.strokeStyle='#3a4558';ctx.lineWidth=1;ctx.beginPath();ctx.arc(a.x,a.y,30,0,TAU);ctx.stroke();continue;}
    for(let i=0;i<3;i++){ctx.strokeStyle='#c9a6ff';ctx.globalAlpha=.25+.15*i;ctx.lineWidth=2;ctx.beginPath();ctx.arc(a.x,a.y,26+i*14,t*(1+i*.4),t*(1+i*.4)+4);ctx.stroke();}ctx.globalAlpha=1;
    glow(a.x,a.y,60,'#c9a6ff',.5);worldLabel(a.x,a.y-80,'АНОМАЛИЯ · '+a.name,'#c9a6ff');}
  // ретрансляторы
  for(const r of WORLD.relays){if(!inView(r.x,r.y,200))continue;const ok=S.relays[r.id];const col=ok?'#8fe9ff':'#ff4f6e';glow(r.x,r.y,50,col,ok?.6:.3+.3*(Math.sin(t*8)>0?1:0));
    ctx.save();ctx.translate(r.x,r.y);ctx.fillStyle='#0b1220';ctx.strokeStyle=col;ctx.lineWidth=2.5;poly(3,22,-Math.PI/2);ctx.fill();ctx.stroke();ctx.restore();
    if(!ok&&r.rep>0){ctx.strokeStyle='#8fe9ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(r.x,r.y,34,-Math.PI/2,-Math.PI/2+TAU*r.rep/2);ctx.stroke();}
    worldLabel(r.x,r.y-50,ok?'РЕТРАНСЛЯТОР':'РЕТРАНСЛЯТОР · ПОВРЕЖДЁН',col);}
  // мастерские
  for(const s of WORLD.shops){if(!inView(s.x,s.y,200))continue;ctx.save();ctx.translate(s.x,s.y);glow(0,0,110,'#ffb84d',.35);ctx.rotate(t*.3);ctx.strokeStyle='#ffb84d';ctx.fillStyle='#0b1220';ctx.lineWidth=2.5;
    ctx.fillRect(-36,-36,72,72);ctx.strokeRect(-36,-36,72,72);for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.moveTo(36,0);ctx.lineTo(62,0);ctx.stroke();ctx.fillStyle='#ffb84d';ctx.fillRect(60,-5,10,10);ctx.fillStyle='#0b1220';}
    ctx.restore();worldLabel(s.x,s.y-90,s.name,'#ffb84d');}
  storyDrawWorld(t);w58Draw(t);w74Draw(t);d74Under(t);w80Draw(t);d80Under(t);zbUnder(t);zbWallsDraw(t);
  // тайники: видны только вблизи
  for(const c of WORLD.caches){if(S.found[c.id]||Math.hypot(p.x-c.x,p.y-c.y)>650)continue;const a=1-Math.hypot(p.x-c.x,p.y-c.y)/650;glow(c.x,c.y,30,'#ffb84d',a*(.5+.5*Math.sin(t*6)));
    ctx.save();ctx.translate(c.x,c.y);ctx.rotate(t);ctx.globalAlpha=a;ctx.strokeStyle='#ffb84d';ctx.lineWidth=2;ctx.strokeRect(-9,-9,18,18);ctx.restore();ctx.globalAlpha=1;}
  // ангар «Зеркало»
  {const hg=WORLD.hangar;if(inView(hg.x,hg.y,220)){const ks=Object.keys(SKINS);ctx.save();ctx.translate(hg.x,hg.y);glow(0,0,130,'#ff6bd0',.3);ctx.rotate(t*.25);
    for(let i=0;i<6;i++){ctx.save();ctx.rotate(i/6*TAU);ctx.translate(58,0);ctx.rotate(Math.PI/2);const col=SKINS[ks[(i+Math.floor(t*.5))%ks.length]].col;
      ctx.fillStyle='#0b1220';ctx.strokeStyle=col;ctx.lineWidth=2;ctx.fillRect(-14,-5,28,10);ctx.strokeRect(-14,-5,28,10);ctx.fillStyle=col;ctx.globalAlpha=.35+.25*Math.sin(t*3+i);ctx.fillRect(-12,-3,24,6);ctx.globalAlpha=1;ctx.restore();}
    ctx.restore();ctx.save();ctx.translate(hg.x,hg.y);ctx.rotate(-t*.6);drawShip(curSkin(),t,200,{});ctx.restore();
    worldLabel(hg.x,hg.y-92,hg.name,'#ff6bd0');}}
  {const ar=WORLD.arsenal;if(inView(ar.x,ar.y,220)){const open=arsOpen();ctx.save();ctx.translate(ar.x,ar.y);glow(0,0,120,'#8fd8ff',open?.3:.12);ctx.save();ctx.rotate(t*.15);ctx.strokeStyle=open?'#9fe3ff':'#3a5a74';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<6;i++){const a=i/6*TAU;ctx[i?'lineTo':'moveTo'](Math.cos(a)*56,Math.sin(a)*56);}ctx.closePath();ctx.stroke();ctx.globalAlpha=.3;ctx.fillStyle=open?'#8fd8ff':'#1c2e44';ctx.fill();ctx.globalAlpha=1;ctx.restore();
    ctx.rotate(-t*.5);for(let i=0;i<3;i++){ctx.save();ctx.rotate(i/3*TAU);ctx.translate(34,0);ctx.fillStyle=open?'#dff6ff':'#3a5a74';ctx.globalAlpha=open?.6+.3*Math.sin(t*3+i):.5;ctx.fillRect(-10,-3,20,6);ctx.restore();}ctx.restore();
    if(!open){ctx.strokeStyle='#9fd8ff';ctx.lineWidth=2;ctx.strokeRect(ar.x-9,ar.y-6,18,14);ctx.beginPath();ctx.arc(ar.x,ar.y-6,6,Math.PI,0);ctx.stroke();}
    worldLabel(ar.x,ar.y-84,ar.name+(open?'':' · ЗАПЕЧАТАН'),open?'#9fe3ff':'#5a7a94');}}
  drawAbyss(t);
  // узлы миссий
  for(const n of WORLD.nodes){if(!inView(n.x,n.y,460))continue;drawNode(n,t);}
  if(S.lost&&inView(S.lost.x,S.lost.y,60)){glow(S.lost.x,S.lost.y,40,'#ff4f6e',.6+.3*Math.sin(t*5));worldLabel(S.lost.x,S.lost.y-30,'ПОТЕРЯННЫЙ ЛОМ · '+S.lost.v,'#ff4f6e');}
  if(G.unlockFx){const U=G.unlockFx,q=Math.min(1,U.t/1.5);ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#ffb84d';ctx.lineWidth=6;ctx.globalAlpha=.6*(1-Math.max(0,U.t-2)/1.2);
    ctx.beginPath();ctx.moveTo(U.x0,U.y0);ctx.lineTo(U.x0+(U.x1-U.x0)*q,U.y0+(U.y1-U.y0)*q);ctx.stroke();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
  drawRocks(G.rocks);try{postWorldDraw(t);}catch(e){}try{chaseDraw(t);}catch(e){}
  drawPickups();
  for(const e of G.enemies)if(inView(e.x,e.y,e.r+80))drawEnemy(e,t);
  w58DrawTop(t);w74DrawTop(t);zbDraw(t);d80Draw(t);w80Mask(sx-CX,sy-CY);
  fogDraw(t);
  ctx.globalCompositeOperation='lighter';
  const BC=shipBul();for(const b of G.pb){if(b.blast){glow(b.x,b.y,b.charged?34:22,'#9fe3ff',.8);ctx.strokeStyle='#9fe3ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(b.x-b.vx*.03,b.y-b.vy*.03);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.fillStyle='#dff6ff';ctx.beginPath();ctx.arc(b.x,b.y,b.charged?7:4.5,0,TAU);ctx.fill();continue;}if(b.charged){glow(b.x,b.y,34,BC,.9);ctx.strokeStyle='#ffffff';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(b.x-b.vx*.05,b.y-b.vy*.05);ctx.lineTo(b.x,b.y);ctx.stroke();continue;}ctx.strokeStyle=b.pk90?'#ffd36b':b.drone?'#c9b6ff':BC;ctx.lineWidth=b.pk90?4.5:3;ctx.beginPath();ctx.moveTo(b.x-b.vx*.018,b.y-b.vy*.018);ctx.lineTo(b.x,b.y);ctx.stroke();}
  for(const b of G.eb){if(b.rift)continue;glow(b.x,b.y,Math.max(b.r*3.2,BMIN*4.5),b.col,.8);}
  ctx.globalCompositeOperation='source-over';
  for(const b of G.eb){if(b.k95){eb95Draw(b,t);continue;}if(b.copy){ctx.strokeStyle=b.col;ctx.lineWidth=3;ctx.globalAlpha=.9;ctx.beginPath();ctx.moveTo(b.x-b.vx*.02,b.y-b.vy*.02);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.globalAlpha=1;continue;}if(b.rift){ctx.strokeStyle='#ff4f6e';ctx.lineWidth=4;ctx.globalAlpha=.5;ctx.beginPath();ctx.moveTo(b.x-b.vx*.03,b.y-b.vy*.03);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.globalAlpha=1;ctx.stroke();continue;}ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(b.x,b.y,Math.max(b.r*.55,BMIN),0,TAU);ctx.fill();if(BMIN||G.ol95){ctx.strokeStyle='#04060c';ctx.lineWidth=(G.ol95?1.5:1)/SC;ctx.stroke();}}
  drawPlayer(p,t);
  ctx.globalCompositeOperation='lighter';
  for(const q of G.parts){ctx.globalAlpha=q.life/q.max;ctx.fillStyle=q.col;ctx.fillRect(q.x-q.size/2,q.y-q.size/2,q.size,q.size);}
  for(const s of G.shock){ctx.globalAlpha=(1-s.t)*(s.thin?.5:.8);ctx.strokeStyle=s.col;ctx.lineWidth=s.thin?2:5*(1-s.t)+1;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,TAU);ctx.stroke();}
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  if(G.prio&&G.prio.alive){const e=G.prio,r=e.r+10,a=t*2;ctx.strokeStyle='#ffffff';ctx.lineWidth=2;for(let i=0;i<4;i++){const q=a+i*Math.PI/2;ctx.beginPath();ctx.arc(e.x,e.y,r,q,q+.5);ctx.stroke();}}
  ctx.textAlign='center';ctx.font='700 '+fpx(12)+'px "JetBrains Mono",monospace';
  for(const f of G.float){ctx.globalAlpha=Math.min(1,f.life*2);ctx.fillStyle='#04060c';ctx.fillText(f.text,f.x+1,f.y+1);ctx.fillStyle=f.col;ctx.fillText(f.text,f.x,f.y);}
  ctx.globalAlpha=1;
  if(aimManual()&&p&&p.hp>0&&(G.state==='play'||G.state==='world')){const m=mouseWorld(),c=shipCol();ctx.strokeStyle=c;ctx.lineWidth=1;ctx.globalAlpha=.85;
    for(let i=0;i<4;i++){const a=i*Math.PI/2;ctx.beginPath();ctx.moveTo(m.x+Math.cos(a)*3,m.y+Math.sin(a)*3);ctx.lineTo(m.x+Math.cos(a)*6,m.y+Math.sin(a)*6);ctx.stroke();}
    ctx.fillStyle=c;ctx.fillRect(m.x-.75,m.y-.75,1.5,1.5);
    const L=G.aimLock;if(L&&L.alive){const r=L.r+7,q=5;ctx.lineWidth=1.5;ctx.globalAlpha=.95;for(const [sx2,sy2] of [[-1,-1],[1,-1],[1,1],[-1,1]]){ctx.beginPath();ctx.moveTo(L.x+sx2*r,L.y+sy2*(r-q));ctx.lineTo(L.x+sx2*r,L.y+sy2*r);ctx.lineTo(L.x+sx2*(r-q),L.y+sy2*r);ctx.stroke();}}
    ctx.globalAlpha=1;}
  // тёмная зона
  let dk=0;for(const d of WORLD.dark){const q=Math.hypot(p.x-d.x,p.y-d.y);dk=Math.max(dk,clamp((d.r-q)/(d.r*.45),0,1));}
  if(dk>.02)drawWorldDark(sx,sy,dk*.9);
  drawRiftFx(Math.max(G.riftI||0,G.wakeI||0),t);w58Screen(t);zbTop(t);
  // стрелки у края экрана
  ctx.setTransform(DPR,0,0,DPR,0,0);
  const arrow=(x,y,col,label)=>{if(arw61Dup(x,y))return;if(isMob()){edgeArrow(x,y,col,10,label+' · '+fmtAU(Math.hypot(x-p.x,y-p.y)));ctx.setTransform(DPR,0,0,DPR,0,0);return;}const X=(x-CX)*SC,Y=(y-CY)*SC;if(X>20&&X<CW-20&&Y>20&&Y<CH-20)return;
    const cx=CW/2,cy=CH/2,a=Math.atan2(Y-cy,X-cx),m=46*UI,sl=stageL(),ex=clamp(cx+Math.cos(a)*CW,sl+m,CW-sl-m),ey=clamp(cy+Math.sin(a)*CH,m+170*UI,CH-m-80*UI);
    ctx.save();ctx.translate(ex,ey);ctx.rotate(a);ctx.scale(UI,UI);ctx.fillStyle=col;ctx.globalAlpha=.85+.15*Math.sin(t*5);ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(-6,-8);ctx.lineTo(-2,0);ctx.lineTo(-6,8);ctx.closePath();ctx.fill();ctx.restore();
    ctx.globalAlpha=1;ctx.font='700 '+(10*UI)+'px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillStyle=col;const dd=fmtAU(Math.hypot(x-p.x,y-p.y));
    {const tl=label+' · '+dd,tx=clamp(ex-Math.cos(a)*34*UI,stageL()+70*UI,CW-stageL()-70*UI),ty=lab61Place(tx,ey-(Math.sin(a)*22-4)*UI,ctx.measureText(tl).width/2+4,10*UI);ctx.lineJoin='round';ctx.lineWidth=4*UI;ctx.strokeStyle='rgba(4,6,12,.92)';ctx.strokeText(tl,tx,ty);ctx.fillText(tl,tx,ty);}};
  if(G.course){if(Math.hypot(G.course.x-p.x,G.course.y-p.y)<240){G.course=null;floater(p.x,p.y-44,'ВЫ НА МЕСТЕ','#8fe9ff');}else arrow(G.course.x,G.course.y,'#8fe9ff','КУРС · '+G.course.label);}
  const nt=zbOn()?null:tut133HoldNext()?tut134Home():nextTarget();if(nt)arrow(nt.x,nt.y,nt.col,nt.label);
  if(S.lost)arrow(S.lost.x,S.lost.y,'#ff4f6e','ЛОМ');
  if(G.anom&&G.anom.a.kind!=='conveyor')arrow(G.anom.a.x,G.anom.a.y,'#c9a6ff','АНОМАЛИЯ');
  if(G.w&&G.w.tug&&G.w.tug.alive&&Math.hypot(G.w.tug.x-p.x,G.w.tug.y-p.y)<2500)arrow(G.w.tug.x,G.w.tug.y,'#7affc9',G.w.tug.st==='escort'?'БУКСИР':'ГРАЖДАНСКИЕ');
  if((G.riftI||0)>=.35&&G.riftBack&&p.hp>0){const X=(G.riftBack.x-CX)*SC,Y=(G.riftBack.y-CY)*SC;if(X>20&&X<CW-20&&Y>20&&Y<CH-20){ctx.font='700 11px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillStyle='#8fe9ff';ctx.fillText('↓ СЕКТОР',X,Y);}else arrow(G.riftBack.x,G.riftBack.y,'#8fe9ff','К СЕКТОРУ');}
  if(G.unk&&G.unk.length&&p.hp>0)for(const u of G.unk){if(u.x===undefined)continue;const X=(u.x-CX)*SC,Y=(u.y-CY)*SC,cx=CW/2,cy=CH/2,a=Math.atan2(Y-cy,X-cx);
    const ex=clamp(cx+Math.cos(a)*CW,30,CW-30),ey=clamp(cy+Math.sin(a)*CH,40,CH-40);ctx.font='700 13px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillStyle='#ff4f6e';ctx.globalAlpha=.55+.45*Math.sin(t*10+u.a);ctx.fillText('?',ex,ey);ctx.globalAlpha=1;}
  // помехи на экране у закрытого узла
  let nz=0;for(const n of WORLD.nodes){if(nodeState(n.m)!=='locked')continue;nz=Math.max(nz,clamp((640-Math.hypot(p.x-n.x,p.y-n.y))/220,0,1));}
  if(nz>0&&SET.fx){ctx.globalAlpha=.08*nz;ctx.fillStyle='#9fb0c4';for(let i=0;i<40;i++)ctx.fillRect(Math.random()*CW,Math.random()*CH,rnd(20,120),1);ctx.globalAlpha=1;}
  if(G.hurtV>0||(p.hp>0&&p.hp<G.st.maxHp*.25)){ctx.setTransform(1,0,0,1,0,0);const v=Math.max(G.hurtV*.55,p.hp<G.st.maxHp*.25?.16+.08*Math.sin(t*5):0);
    const g=ctx.createRadialGradient(cv.width/2,cv.height/2,Math.min(cv.width,cv.height)*.35,cv.width/2,cv.height/2,Math.max(cv.width,cv.height)*.7);g.addColorStop(0,'rgba(255,40,70,0)');g.addColorStop(1,`rgba(255,40,70,${v})`);ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height);}
}
function fpx(n){return isMob()?Math.max(n,11.5/SC):n;}
function worldLabel(x,y,text,col){ctx.font='700 '+fpx(11)+'px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillStyle='#04060c';ctx.fillText(text,x+1,y+1);ctx.fillStyle=col;ctx.fillText(text,x,y);}
function drawNode(n,t){
  if(n.m===50&&typeof zbDrawNode==='function'){zbDrawNode(n,t);return;}
  const st=nodeState(n.m),M=MISSIONS[n.m-1],S=G.save;
  if(st==='locked'){drawWell(n,t);return;}
  const col=st==='done'?'#8fe9ff':'#ffb84d';
  if(st==='open'){for(let i=0;i<3;i++){const q=((t*.5+i/3)%1);ctx.strokeStyle=col;ctx.globalAlpha=(1-q)*.6;ctx.lineWidth=2;ctx.beginPath();ctx.arc(n.x,n.y,30+q*160,0,TAU);ctx.stroke();}ctx.globalAlpha=1;}
  if(n.boss){ctx.save();ctx.translate(n.x,n.y);glow(0,0,170,'#ff4f6e',.35);ctx.rotate(t*.15);ctx.strokeStyle='#ff6b8a';ctx.lineWidth=3;poly(8,92,0);ctx.stroke();ctx.rotate(-t*.3);ctx.globalAlpha=.6;ctx.setLineDash([16,12]);ctx.lineDashOffset=t*30;poly(8,120,0);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;ctx.restore();
    worldLabel(n.x,n.y+140,bossLab90(n.m),'#ff6b8a');}
  if(n.m>=7&&n.m<=CORE)drawMiniBeacon(n.x,n.y,col,t);
  else if(n.m===6){ctx.save();ctx.translate(n.x,n.y);glow(0,0,140,'#b48cff',st==='done'?.3:.55);ctx.rotate(t*.2);ctx.strokeStyle=st==='done'?'#5a4a8c':'#b48cff';ctx.lineWidth=4;
    for(let i=0;i<10;i++){const a=i/10*TAU;if(st==='done'&&i%3===0)continue;ctx.beginPath();ctx.arc(0,0,70,a,a+TAU/10-.15);ctx.stroke();}ctx.fillStyle=st==='done'?'#2a2440':'#e0d2ff';ctx.beginPath();ctx.arc(0,0,22,0,TAU);ctx.fill();ctx.restore();}
  else{ctx.save();ctx.translate(n.x,n.y);glow(0,0,70,col,.5);ctx.rotate(Math.PI/4+t*.4);ctx.fillStyle='#0b1220';ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.fillRect(-16,-16,32,32);ctx.strokeRect(-16,-16,32,32);ctx.restore();
    ctx.fillStyle=col;ctx.beginPath();ctx.arc(n.x,n.y,5,0,TAU);ctx.fill();}
  worldLabel(n.x,n.y-(n.m===6?110:62),pad2(n.m)+' · '+M.name.toUpperCase(),col);
  if(st==='done'){const md=S.medals[n.m]||{};const arr=[md.clear,md.clean,md.master];arr.forEach((on,i)=>{ctx.fillStyle=on?'#ffb84d':'#26324a';ctx.beginPath();ctx.arc(n.x-10+i*10,n.y+(n.m===6?100:50),3.5,0,TAU);ctx.fill();});}
}
function drawWorldDark(sx,sy,alpha){
  if(!darkC||darkC.width!==cv.width||darkC.height!==cv.height){darkC=document.createElement('canvas');darkC.width=cv.width;darkC.height=cv.height;dctx=darkC.getContext('2d');}
  const k=DPR*SC,p=G.player;dctx.globalCompositeOperation='source-over';dctx.clearRect(0,0,darkC.width,darkC.height);
  dctx.fillStyle=`rgba(1,2,7,${alpha.toFixed(3)})`;dctx.fillRect(0,0,darkC.width,darkC.height);dctx.globalCompositeOperation='destination-out';
  const X=(p.x-CX+sx)*k,Y=(p.y-CY+sy)*k,R=G.st.light*1.3*k;const g=dctx.createRadialGradient(X,Y,R*.3,X,Y,R);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');dctx.fillStyle=g;dctx.beginPath();dctx.arc(X,Y,R,0,TAU);dctx.fill();
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(darkC,0,0);ctx.restore();
}

