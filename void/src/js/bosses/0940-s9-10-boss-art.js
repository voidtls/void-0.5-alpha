// ===== 0.9.5: рисунок боссов IX–X — Сердце 2.0 и Берег 2.0 =====
// --- Сердце: три слоя (тело, сосудистая сетка, свечение), систола, трещины, хроматический сдвиг ---
const HB95={};
function heartGrad95(r,open){const key=Math.round(r)+'|'+(open>0?1:0);if(HB95[key])return HB95[key];const g=ctx.createRadialGradient(0,r*.1,r*.1,0,0,r*1.25);g.addColorStop(0,open>0?'#fff4d0':'#ffb84d');g.addColorStop(.35,'#a0182c');g.addColorStop(1,'#2a060c');return HB95[key]=g;}
const HMESH95=[[[-.5,-.45],[-.3,-.1],[-.1,.1],[.15,.7]],[[.45,-.5],[.3,-.2],[.2,0],[.4,.45]],[[-.3,-.1],[-.6,.15]],[[.3,-.2],[.62,-.05]],[[-.1,.1],[-.35,.5]],[[.2,0],[.05,.35]],[[-.62,-.35],[-.75,-.05]],[[.62,-.4],[.8,-.15]]];
const HCRACK95=[[[-.15,-.55],[.05,-.2],[-.05,.05],[.12,.4]],[[.5,-.3],[.25,-.05],[.38,.25]],[[-.6,-.1],[-.3,.12],[-.42,.42]],[[.05,.55],[.25,.3],[.5,.38],[.62,.12]]];
function heartPath95(r){ctx.beginPath();ctx.moveTo(0,r*1.05);ctx.bezierCurveTo(-r*1.25,r*.25,-r*1.15,-r*.9,-r*.42,-r*.82);ctx.bezierCurveTo(-r*.12,-r*.78,0,-r*.5,0,-r*.38);ctx.bezierCurveTo(0,-r*.5,r*.12,-r*.78,r*.42,-r*.82);ctx.bezierCurveTo(r*1.15,-r*.9,r*1.25,r*.25,0,r*1.05);ctx.closePath();}
function heartBody95(x,y,r,s,t,open,fl,crack,beat){ctx.save();ctx.translate(x,y);const sx=s*(1+.04*(1-s)),sy=s;ctx.scale(sx,sy);
  if(beat>0&&SET.fx&&!SET.lessFx){const o=2.2*beat/.12;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.25*beat/.12;ctx.fillStyle='#ff2040';ctx.save();ctx.translate(o,0);heartPath95(r);ctx.fill();ctx.restore();ctx.fillStyle='#20e0ff';ctx.save();ctx.translate(-o,0);heartPath95(r);ctx.fill();ctx.restore();ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
  heartPath95(r);ctx.fillStyle=heartGrad95(r,open);ctx.fill();ctx.strokeStyle=fl>0?'#ffffff':C90.ark;ctx.lineWidth=2.5;ctx.stroke();
  // сосудистая сетка
  ctx.save();heartPath95(r);ctx.clip();ctx.strokeStyle=rgba90('#ff8a9a',.28+.12*(1-s)*6);ctx.lineWidth=1.4;ctx.beginPath();for(const L of HMESH95){ctx.moveTo(L[0][0]*r,L[0][1]*r);for(let i=1;i<L.length;i++)ctx.lineTo(L[i][0]*r,L[i][1]*r);}ctx.stroke();
  if(crack>0){ctx.strokeStyle=rgba90('#fff1c4',.65+.25*Math.sin(t*9));ctx.lineWidth=2;ctx.beginPath();for(let c=0;c<Math.min(crack,4);c++){const L=HCRACK95[c];ctx.moveTo(L[0][0]*r,L[0][1]*r);for(let i=1;i<L.length;i++)ctx.lineTo(L[i][0]*r,L[i][1]*r);}ctx.stroke();
    ctx.globalCompositeOperation='lighter';ctx.strokeStyle=rgba90('#ffd36b',.18);ctx.lineWidth=6;ctx.stroke();ctx.globalCompositeOperation='source-over';}
  ctx.restore();
  ctx.lineWidth=5;ctx.strokeStyle='#6a1020';for(const [ax,ay,bx,by] of [[-r*.25,-r*.7,-r*.35,-r*1.2],[r*.05,-r*.6,r*.1,-r*1.25],[r*.3,-r*.72,r*.55,-r*1.1]]){ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();}
  if(open>0){ctx.strokeStyle='#ffffff';ctx.lineWidth=3;ctx.globalAlpha=open;ctx.beginPath();ctx.moveTo(0,-r*.3);ctx.lineTo(-r*.08,r*.1);ctx.lineTo(r*.06,r*.35);ctx.lineTo(0,r*.8);ctx.stroke();ctx.globalAlpha=1;}
  ctx.restore();}
// кривая систолы: резкое сжатие за 0,12 с, мягкое расправление
function systole95(b){if(b.phase>=4&&b.st==='fight')return 0;const u=b.bt;return u<.12?u/.12:Math.max(0,1-(u-.12)/.55);}
function heartFloor95(b){const R=Math.ceil(b.R+30),key=R;if(b.floor95&&b.floor95.k===key)return b.floor95.c;const c=document.createElement('canvas');c.width=c.height=R*2;const g=c.getContext('2d');
  const gr=g.createRadialGradient(R,R,b.r,R,R,b.R);gr.addColorStop(0,'rgba(70,12,22,.82)');gr.addColorStop(.75,'rgba(30,8,14,.66)');gr.addColorStop(1,'rgba(10,4,6,.25)');g.fillStyle=gr;g.beginPath();g.arc(R,R,b.R,0,TAU);g.fill();
  g.strokeStyle='rgba(140,30,50,.16)';g.lineWidth=1.5;const rr=mulberry(77);for(let i=0;i<26;i++){let a=rr()*TAU,d=b.r+rr()*(b.R-b.r);g.beginPath();g.moveTo(R+Math.cos(a)*d,R+Math.sin(a)*d);for(let j=0;j<5;j++){a+=(rr()-.5)*.5;d+=(rr()-.4)*40;g.lineTo(R+Math.cos(a)*d,R+Math.sin(a)*d);}g.stroke();}
  b.floor95={k:key,c};return c;}
function heartUnder(b,t){if(!b.R)return;const lit=b.st==='enter'?b.lit:1;ctx.save();ctx.globalAlpha=lit;
  const F=heartFloor95(b),R=F.width/2;ctx.drawImage(F,b.cx-R,b.cy-R);
  const pk=beat90(G.t)*.5+(b.sysK||0)*.5;ctx.strokeStyle=rgba90(C90.ark,.3+.3*pk);ctx.lineWidth=3;ctx.beginPath();ctx.arc(b.cx,b.cy,b.R,0,TAU);ctx.stroke();ctx.strokeStyle=rgba90(C90.red,.25);ctx.lineWidth=12;ctx.beginPath();ctx.arc(b.cx,b.cy,b.R+8,0,TAU);ctx.stroke();
  // ударная волна по полу на каждом ударе
  if(b.sysK>0&&b.st==='fight'&&b.phase<4){const k=1-b.sysK;ctx.strokeStyle=rgba90('#ff9aa8',.25*(1-k));ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.cx,b.cy,b.r+(b.R-b.r)*k,0,TAU);ctx.stroke();}
  const sys=heartInSys(b);for(const v of b.ves){const ux=Math.cos(v.a),uy=Math.sin(v.a),nx=-uy,ny=ux,w=55*b.k,r0=b.r+20,r1=b.R+30,sh=v.shut>0||b.phase>=4;
    ctx.fillStyle=sh?'rgba(60,50,50,.25)':rgba90(C90.red,.14+.1*pk);ctx.beginPath();ctx.moveTo(b.cx+ux*r0+nx*w*.6,b.cy+uy*r0+ny*w*.6);ctx.lineTo(b.cx+ux*r1+nx*w,b.cy+uy*r1+ny*w);ctx.lineTo(b.cx+ux*r1-nx*w,b.cy+uy*r1-ny*w);ctx.lineTo(b.cx+ux*r0-nx*w*.6,b.cy+uy*r0-ny*w*.6);ctx.closePath();ctx.fill();
    if(b.whipV===v.i&&b.whipT>0){ctx.fillStyle=rgba90('#ff9aa8',.3*Math.min(1,b.whipT*2));ctx.fill();}
    ctx.setLineDash(sh?[3,10]:[10,16]);ctx.lineDashOffset=sh?0:(sys?-1:1)*t*120;ctx.strokeStyle=sh?'rgba(160,150,140,.4)':rgba90(C90.ark,.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(b.cx+ux*r0,b.cy+uy*r0);ctx.lineTo(b.cx+ux*r1,b.cy+uy*r1);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;
    if(v.shut>0&&b.phase<4)worldLabel(b.cx+ux*b.R*.72,b.cy+uy*b.R*.72-20,'ПЕРЕЖАТ · '+Math.ceil(v.shut),'#9fb0c4');}
  if(b.whipT>0)b.whipT-=VDT74;/* ARCH·75 A-22 */
  // кровотечение из разбитых клапанов
  for(const q of b.bleed){const a=Math.min(1,q.t,(q.t0-q.t)*2);rgDraw95(q.x,q.y,q.r*1.15,'#7a0a1c',.75*a,0,[.7,.5*a]);ctx.strokeStyle=rgba90(C90.blood,.5*a);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(q.x,q.y,q.r+2*Math.sin(t*3+q.x),0,TAU);ctx.stroke();
    if(SET.fx&&Math.random()<.2)part(q.x+rnd(-q.r,q.r)*.6,q.y+rnd(-q.r,q.r)*.6,0,-20,.5,C90.blood,2);}
  // затопление камеры в фазе 4: кровь поднимается от краёв
  if(b.phase>=4&&b.st==='fight'&&b.dry<b.R-2){ctx.save();ctx.beginPath();ctx.arc(b.cx,b.cy,b.R,0,TAU);ctx.arc(b.cx,b.cy,b.dry,0,TAU,true);ctx.fillStyle='rgba(96,8,24,.72)';ctx.fill();
    ctx.strokeStyle=rgba90('#ff6f86',.55+.25*Math.sin(t*4));ctx.lineWidth=2.5;ctx.beginPath();for(let i=0;i<=48;i++){const a=i/48*TAU,rr=b.dry+3*Math.sin(a*7+t*3)+2*Math.sin(a*13-t*4);const x=b.cx+Math.cos(a)*rr,y=b.cy+Math.sin(a)*rr;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);}ctx.stroke();ctx.restore();
    if(b.dry<b.R*.75)worldLabel(b.cx,b.cy+b.dry-14,'СУХО',rgba90('#ffe9b0',.6));}
  for(const w of b.waves){ctx.lineWidth=(w.thin?7:14)*b.k;ctx.strokeStyle=rgba90(w.dmg>12?'#ff9a4d':C90.ark,.55);if(w.gaps&&w.gaps.length){const G2=w.gaps.slice().sort((a,c)=>a.a-c.a);for(let i=0;i<G2.length;i++){const a0=G2[i].a+G2[i].w/2,n=G2[(i+1)%G2.length],a1=n.a-n.w/2+(i===G2.length-1?TAU:0);ctx.beginPath();ctx.arc(b.cx,b.cy,w.r,a0,a1>a0?a1:a1+TAU);ctx.stroke();}}else{ctx.beginPath();ctx.arc(b.cx,b.cy,w.r,0,TAU);ctx.stroke();}
    ctx.lineWidth=2;ctx.strokeStyle='rgba(255,240,210,.7)';ctx.beginPath();ctx.arc(b.cx,b.cy,w.r,0,TAU);ctx.globalAlpha=lit*.35;ctx.stroke();ctx.globalAlpha=lit;}
  if(b.phase>=2&&b.phase<=3&&b.nextGaps&&b.st==='fight'){const k=clamp(b.bt/b.btN,0,1),R0=b.r+40*b.k;gapArrows95(b.cx,b.cy,R0,b.nextGaps,k,'#ffffff');if(b.phase===3)gapArrows95(b.cx,b.cy,R0,b.nextGaps.map(g=>({a:g.a+(b.gdir96||1)*heartOff96(),w:g.w})),k*.5,'#ffe9b0');}
  if(b.fib>0&&b.fibA96!==undefined&&b.st==='fight')gapArrows95(b.cx,b.cy,b.r+40*b.k,[{a:b.fibA96,w:70*Math.PI/180}],1,'#ff9a4d');
  ctx.restore();}
function heartDraw(b,t){if(!b.R||b.st==='dying')return;if(b.st==='fight'&&b.phase<4){const k=clamp(b.bt/b.btN,0,1),perf=heartInPerf(b),rr=b.r+8+(b.R*.5)*(1-k);ctx.strokeStyle=perf?'#ffffff':rgba90(C90.ark,.45);ctx.lineWidth=perf?3:1.5;ctx.beginPath();ctx.arc(b.cx,b.cy,rr,0,TAU);ctx.stroke();
    if(perf){glow(b.cx,b.cy,b.r*2.2,'#ffffff',.25);}}
  if(b.flashP>0){ctx.strokeStyle=rgba90('#ffffff',b.flashP*2);ctx.lineWidth=4;ctx.beginPath();ctx.arc(b.cx,b.cy,b.r*(1.3+(.35-b.flashP)*2),0,TAU);ctx.stroke();}
  if(b.combo>1&&b.st==='fight'&&b.phase<4){ctx.font='700 '+fpx(16)+'px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillStyle='#04060c';ctx.fillText('×'+b.combo,b.cx+1,b.cy+b.r+30);ctx.fillStyle=b.comboBuff>1?'#ffffff':C90.warm;ctx.fillText('×'+b.combo,b.cx,b.cy+b.r+29);ctx.textAlign='left';}
  if(b.st==='final'||b.st==='scene')dock85Draw(b,t);
  if(b.st==='fight'&&b.phase>=4&&b.launch<=0&&b.keys.length){ctx.strokeStyle=rgba90(C90.ark,.3);ctx.lineWidth=2;ctx.setLineDash([3,8]);ctx.beginPath();ctx.arc(b.cx,b.cy,150*b.k,0,TAU);ctx.stroke();ctx.setLineDash([]);
    const k=b.keys[b.keyI];if(k){worldLabel(b.cx,b.cy+b.r+30,'КЛЮЧ '+['I','II','III','IV'][k.ki]+(b.rot96?' · ЛОВИТЕ НА ХОДУ':b.launches===1?' · ОБРАТНЫЙ ПОРЯДОК':' · ПРОЛЕТИТЕ В ТАКТ'),'#ffffff');const p=G.player;if(p&&b.keyI>0){ctx.strokeStyle=rgba90('#ffffff',.25);ctx.setLineDash([3,6]);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(k.x,k.y);ctx.stroke();ctx.setLineDash([]);}}}
  if(inMission())ally85Draw(t);}
// лента тактов: следующие 4 удара бегут к линии «сейчас»; аритмия видна заранее
function heartLane95(b,t){if(b.st!=='fight')return;const Q=heartQ95(b),span=2.6;const marks=[];let acc=b.btN-b.bt;marks.push({t:acc,arr:b.curArr95?1:0});for(let i=0;i<5;i++){acc+=Q[i].d;marks.push({t:acc,arr:Q[i].arr});}
  const mob=isMob(),por=isPortrait(),S=mob?1:SC,vw=mob?CW:VW,vh=mob?CH:VH;ctx.save();ctx.setTransform(DPR*S,0,0,DPR*S,0,0);const w=Math.min(440,vw*(por?.92:mob?.5:.72)),h=mob?22:24,x0=vw/2-w/2,y0=por?158:mob?vh-h-8:vh-150;
  ctx.fillStyle='rgba(8,3,5,.72)';ctx.fillRect(x0,y0,w,h);ctx.strokeStyle=rgba90(C90.ark,.45);ctx.lineWidth=1;ctx.strokeRect(x0,y0,w,h);
  const hx=x0+34,pw=heartPerfW(b)/span*(w-44);ctx.fillStyle=rgba90('#ffffff',heartInPerf(b)?.3:.1);ctx.fillRect(hx,y0+2,pw,h-4);
  ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(hx,y0-3);ctx.lineTo(hx,y0+h+3);ctx.stroke();
  for(const m of marks){if(m.t>span)break;const x=hx+m.t/span*(w-44);const c=m.arr?'#ff9a4d':b.phase>=4?C90.warm:C90.ark;ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x,y0+3);ctx.lineTo(x+5,y0+h/2);ctx.lineTo(x,y0+h-3);ctx.lineTo(x-5,y0+h/2);ctx.closePath();ctx.fill();}
  ctx.font='700 '+(mob?11:9)+'px "JetBrains Mono",monospace';ctx.fillStyle=rgba90('#ffe9b0',.7);ctx.textAlign='left';ctx.fillText(b.phase>=4?'КЛЮЧИ':'ТАКТ',x0+4,y0+h/2+3);
  if(b.combo>1){ctx.textAlign='right';ctx.fillStyle=b.comboBuff>1?'#ffffff':C90.warm;ctx.fillText('КОМБО ×'+b.combo,x0+w-6,y0+h/2+3);}ctx.textAlign='left';ctx.restore();}
function heartTop(b,t){if(b.st==='enter'&&b.lit<1){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='rgba(8,2,4,'+(.85*(1-b.lit))+')';ctx.fillRect(0,0,cv.width,cv.height);ctx.restore();}
  if(b.launch>0){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='rgba(255,240,210,'+(.06+.04*Math.sin(t*20))+')';ctx.fillRect(0,0,cv.width,cv.height);ctx.restore();}
  // удар сердца — пульс по кромке камеры (дешевле полноэкранной виньетки, читается так же)
  if(b.st==='fight'&&b.sysK>.08&&b.phase<4&&SET.fx){ctx.strokeStyle=rgba90('#ff4f6e',.32*b.sysK);ctx.lineWidth=10+8*b.sysK;ctx.beginPath();ctx.arc(b.cx,b.cy,b.R+6,0,TAU);ctx.stroke();}
  heartLane95(b,t);}
function heartDying(b,dt,t0){const fx=b.fx85;if(t0<=0){hs90(.25,2);trauma90(.7);}if(SET.fx&&Math.random()<(fx.kind==='wake'?.8:.4)){const a=rnd(0,TAU),v=rnd(60,260);part(b.cx,b.cy,Math.cos(a)*v,Math.sin(a)*v,rnd(.5,1.2),fx.kind==='stop'?'#9fb0c4':fx.kind==='wake'?C90.pil:C90.ark,rnd(2,4));}}
// --- Берег: пустота, горизонт, Смотритель горизонта, маяки-прожекторы, тени, руки ---
function shoreUnder(b,t){const N=24,pts=[];for(let i=0;i<=N;i++){const x=i/N*W;pts.push([x,hzAt100(b,x)]);}const lit=b.st==='enter'?b.lit:1;
  ctx.save();ctx.beginPath();ctx.moveTo(-20,-20);for(const q of pts)ctx.lineTo(q[0],q[1]);ctx.lineTo(W+20,-20);ctx.closePath();ctx.fillStyle='rgba(2,5,6,'+(.95*lit)+')';ctx.fill();
  if(b.st!=='dying'||b.hzF>0)shoreFaceDraw95(b,t,lit);
  if(!b.crumble){tornPath90(pts);ctx.strokeStyle=rgba90(b.ebb>0?'#ffffff':C90.sh,.18);ctx.lineWidth=14;ctx.stroke();ctx.strokeStyle=b.ebb>0?'#ffffff':C90.sh;ctx.lineWidth=2;ctx.stroke();}
  else{ctx.setLineDash([3,9]);tornPath90(pts);ctx.strokeStyle=rgba90(C90.sh,.35);ctx.lineWidth=1.5;ctx.stroke();ctx.setLineDash([]);}
  if(SET.fx&&!G.lowFx&&Math.random()<.6){const q=pts[Math.random()*pts.length|0];part(q[0]+rnd(-10,10),q[1],rnd(-15,15),rnd(-60,-20),rnd(.6,1.4),C90.sh,1.6);}
  ctx.fillStyle='rgba(122,255,201,.025)';ctx.fillRect(0,H*.8,W,H*.2);
  // слёзы: полосы стирания из глаз
  const X=G.x90;if(X&&X.strip95)for(const s of X.strip95){const a=Math.min(1,s.t*2,(s.t0-s.t)*4);ctx.globalAlpha=a;ctx.fillStyle='rgba(3,6,7,.92)';ctx.fillRect(s.x-s.w/2,s.y0,s.w,H-s.y0+10);ctx.strokeStyle=rgba90(C90.sh,.85);ctx.lineWidth=1.5;
    ctx.beginPath();for(const sd of [-1,1]){const x=s.x+sd*s.w/2;ctx.moveTo(x,s.y0);for(let y=s.y0;y<H+10;y+=24)ctx.lineTo(x+sd*3*Math.sin(y*.05+t*3),y);}ctx.stroke();
    if(SET.fx&&Math.random()<.5)part(s.x+rnd(-s.w/2,s.w/2),s.y0+rnd(0,H-s.y0),0,90,.5,C90.sh,1.6);ctx.globalAlpha=1;}
  // прожекторы маяков
  const k=shk95(),p=G.player;
  for(const q of b.beacons){if(!q.alive||q.spawnT>0)continue;const lx=q.x,ly=q.y-q.r*.95;
    if(q.bOn||q.bFlick){const on=q.bOn?1:(Math.sin(t*40)>0?.35:0),L=SHORE95.beamL*k,A=SHORE95.beamA;if(on>0){ctx.globalCompositeOperation='lighter';ctx.fillStyle=rgba90('#d8fff0',.09*on);ctx.beginPath();ctx.moveTo(lx,ly);ctx.arc(lx,ly,L,q.ba-A,q.ba+A);ctx.closePath();ctx.fill();
      ctx.fillStyle=rgba90('#ffffff',.08*on);ctx.beginPath();ctx.moveTo(lx,ly);ctx.arc(lx,ly,L*.75,q.ba-A*.45,q.ba+A*.45);ctx.closePath();ctx.fill();ctx.globalCompositeOperation='source-over';
      ctx.strokeStyle=rgba90(C90.sh,.4*on);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+Math.cos(q.ba-A)*L,ly+Math.sin(q.ba-A)*L);ctx.moveTo(lx,ly);ctx.lineTo(lx+Math.cos(q.ba+A)*L,ly+Math.sin(q.ba+A)*L);ctx.stroke();}}
    // радиус щита: кольцо 260, тает по мере приближения
    if(b.st==='fight'&&p&&Math.hypot(p.x-q.x,p.y-q.y)<520){const m=shoreShK95(b,q);ctx.strokeStyle=rgba90(C90.sh,.1+.2*(1-m));ctx.setLineDash([2,10]);ctx.lineDashOffset=-t*8;ctx.beginPath();ctx.arc(q.x,q.y,260,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;}
    if(q.rw95){const R_=q.rw95,s=R_.slot,tx=s.nx*W,ty=s.ty,u=R_.t/R_.T;ctx.strokeStyle=rgba90(C90.sh,.5);ctx.setLineDash([3,6]);ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(tx,ty);ctx.stroke();ctx.setLineDash([]);
      ctx.font='700 11px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillStyle=C90.sh;for(let i=0;i<4;i++){const v=(u+i/4)%1;ctx.fillText(GLYPH95[(i*7+Math.floor(t*6))%GLYPH95.length],q.x+(tx-q.x)*v,q.y+(ty-q.y)*v);}ctx.textAlign='left';
      ctx.strokeStyle=rgba90('#ffffff',.6);ctx.lineWidth=2;ctx.beginPath();ctx.arc(tx,ty,26,-Math.PI/2,-Math.PI/2+TAU*u);ctx.stroke();}}
  // разбитые слоты: обломки с мерцающим «?»
  for(const s of b.slots){if(!s.broken)continue;const x=s.nx*W,y=s.ty;ctx.strokeStyle=rgba90(C90.sh,.35);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-14,y+20);ctx.lineTo(x-6,y-2);ctx.lineTo(x+3,y+6);ctx.lineTo(x+12,y-4);ctx.lineTo(x+16,y+20);ctx.stroke();if(Math.sin(t*3+s.i)>.3)worldLabel(x,y-12,'?',rgba90(C90.sh,.6));}
  ctx.restore();}
const FACEG95={};
function shoreFaceDraw95(b,t,lit){const F=b.face,k=shk95(),p=G.player;if(b.st==='dying'&&b.crumble)return;const x=F.x,y=F.y,w=140*k,h=100*k;ctx.save();ctx.globalAlpha=lit*(b.st==='scene'||b.st==='final'?.5:1);
  const jit=F.stun>0?2.5:.6,J=()=>rnd(-jit,jit);const sh=C90.sh,wh='#f4fff9';
  glow(x,y,w*1.6,sh,.1+.05*Math.sin(t*1.3));
  // тело маски: тёмная пустота, в которой держится лицо
  {const gk=Math.round(w)+'|'+Math.round(h);let g=FACEG95[gk];if(!g){g=FACEG95[gk]=ctx.createRadialGradient(0,0,h*.15,0,0,w*1.12);g.addColorStop(0,'rgba(2,7,7,.86)');g.addColorStop(.72,'rgba(2,7,7,.58)');g.addColorStop(1,'rgba(2,7,7,0)');}ctx.save();ctx.translate(x,y);ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,w*1.12,h*1.08,0,0,TAU);ctx.fill();ctx.restore();}
  // строки развёртки: лицо — недописанная передача
  ctx.fillStyle=rgba90(sh,.07);for(let i=0;i<3;i++){const sy=y-h+((t*38+i*h*.7)%(h*2.1));ctx.fillRect(x-w*.95,sy,w*1.9,2);}
  // контур маски: незамкнутый, со стёртыми кусками; хроматический сдвиг (кроме «Меньше эффектов»)
  const outl=(ox,col)=>{ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=40;i++){const a=-Math.PI*.95+i/40*Math.PI*1.9,rx=w*(1+.06*Math.sin(a*3+t)),ry=h*(1.05+.08*Math.cos(a*2));const px=x+ox+Math.cos(a)*rx+J(),py=y+Math.sin(a)*ry*.9+J();if(i%9===4){ctx.moveTo(px,py);continue;}if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py);}ctx.stroke();};
  if(SET.fx&&!SET.lessFx&&!isMob()){outl(-2.6,'rgba(255,70,110,.24)');outl(2.6,'rgba(70,225,255,.24)');}outl(0,rgba90(wh,.78));
  ctx.strokeStyle=rgba90(sh,.4);ctx.lineWidth=1;ctx.beginPath();for(let i=-3;i<=3;i++){ctx.moveTo(x+i*w*.28,y-h*.95+Math.abs(i)*6);ctx.lineTo(x+i*w*.24,y-h*.62+Math.abs(i)*4);}ctx.stroke();
  // брови
  ctx.strokeStyle=rgba90(wh,.8);ctx.lineWidth=2.5;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(x+s*w*.18,y-h*.38+J());ctx.quadraticCurveTo(x+s*w*.45,y-h*(F.stun>0?.62:.5),x+s*w*.72,y-h*.34+J());ctx.stroke();}
  // глаза
  const op=F.open;for(const s of [-1,1]){const ex=x+s*64*k,ey=y-8*k,ew=34*k,eh=4+15*k*op;ctx.strokeStyle=rgba90(wh,.95);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ex-ew,ey);ctx.quadraticCurveTo(ex,ey-eh,ex+ew,ey);ctx.quadraticCurveTo(ex,ey+eh,ex-ew,ey);ctx.closePath();ctx.fillStyle=op>.1?rgba90('#0a1a16',.95):'rgba(2,5,6,.9)';ctx.fill();ctx.stroke();
    if(op>.1){let lx=0,ly=0;if(p){const a=Math.atan2(p.y-ey,p.x-ex);lx=Math.cos(a)*ew*.35;ly=Math.sin(a)*eh*.35;}const ir=Math.min(eh*.9,12*k);glow(ex+lx,ey+ly,ir*3,F.stun>0?'#ffffff':sh,.5*op);ctx.fillStyle=F.stun>0?'#ffffff':sh;ctx.beginPath();ctx.arc(ex+lx,ey+ly,ir,0,TAU);ctx.fill();ctx.fillStyle='#04060c';ctx.beginPath();ctx.arc(ex+lx,ey+ly,ir*.4,0,TAU);ctx.fill();}
    // дорожки слёз
    ctx.strokeStyle=rgba90(sh,b.fa&&b.fa.k==='tears'?.8:.25);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(ex+s*6,ey+eh);ctx.lineTo(ex+s*9+Math.sin(t*2+s)*2,ey+h*.55);ctx.stroke();}
  // рот: на «Речи» открывается тёмной щелью с буквами
  const mo=F.mouth,my=y+h*.42;ctx.strokeStyle=rgba90(wh,.85);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-w*.32,my);ctx.quadraticCurveTo(x,my+(4+22*mo)*k,x+w*.32,my);if(mo>.05)ctx.quadraticCurveTo(x,my-(2+8*mo)*k,x-w*.32,my);ctx.stroke();
  if(mo>.2){ctx.fillStyle='rgba(2,5,6,.9)';ctx.fill();ctx.font='700 10px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillStyle=rgba90(wh,mo);for(let i=0;i<5;i++)ctx.fillText(GLYPH95[(i*5+Math.floor(t*10))%GLYPH95.length],x-w*.2+i*w*.1,my+6*k);ctx.textAlign='left';}
  if(b.inh){ctx.strokeStyle=rgba90(sh,.3);ctx.lineWidth=1;for(let i=0;i<10;i++){const u=(t*1.5+i/10)%1,px=rnd(0,W),py=my+(H-my)*(1-u);ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+(x-px)*.06,py-30);ctx.stroke();}}
  if(F.stun>0)worldLabel(x,y-h*1.15,'ОГЛУШЁН · ×2','#ffffff');
  ctx.restore();}
function shoreDraw(b,t){const p=G.player;
  // тени боссов
  for(const s of b.shades){if(!s.alive)continue;const a=(s.spawnT>0?1-s.spawnT:1)*Math.min(1,s.life95*1.5),c=s.col95;ctx.save();ctx.translate(s.x,s.y);
    // тень прошлого босса: тёмное тело, свечение цвета босса, бегущий пунктир и (если можно) хроматический сдвиг
    const shp=()=>{ctx.beginPath();if(s.k95==='lek')ctx.rect(-70,-36,140,72);else if(s.k95==='well')ctx.arc(0,0,s.r*1.35,0,TAU);else if(s.k95==='heart')heartPath95(s.r*.8);else{ctx.save();ctx.rotate(Math.atan2((p?p.y:0)-s.y,(p?p.x:0)-s.x));ctx.moveTo(s.r*1.3,0);ctx.lineTo(-s.r,-s.r*.8);ctx.lineTo(-s.r*.5,0);ctx.lineTo(-s.r,s.r*.8);ctx.closePath();ctx.restore();}};
    ctx.globalAlpha=a;glow(0,0,(s.k95==='lek'?90:s.r*1.8),c,.18+.06*Math.sin(t*3+s.x));shp();ctx.fillStyle='rgba(4,8,10,.62)';ctx.fill();
    ctx.fillStyle=rgba90(c,.06);for(let i=0;i<3;i++){const y=-40+((t*30+i*27)%80);ctx.fillRect(-72,y,144,2);}
    if(SET.fx&&!SET.lessFx&&!isMob()){ctx.globalAlpha=.35*a;ctx.save();ctx.translate(-2.5,0);shp();ctx.strokeStyle='rgba(255,70,110,.8)';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();ctx.save();ctx.translate(2.5,0);shp();ctx.strokeStyle='rgba(70,225,255,.8)';ctx.stroke();ctx.restore();}
    ctx.globalAlpha=.85*a;ctx.strokeStyle=c;ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.lineDashOffset=-t*20;
    if(s.k95==='lek'){ctx.strokeRect(-70,-36,140,72);ctx.beginPath();ctx.moveTo(-70,0);ctx.lineTo(70,0);ctx.moveTo(-20,-36);ctx.lineTo(-20,36);ctx.moveTo(20,-36);ctx.lineTo(20,36);ctx.stroke();}
    else if(s.k95==='well'){for(let i=1;i<=3;i++){ctx.beginPath();ctx.arc(0,0,s.r*i*.45,0,TAU);ctx.stroke();}}
    else if(s.k95==='heart'){ctx.setLineDash([]);heartPath95(s.r*.8);ctx.stroke();}
    else{shp();ctx.stroke();}
    ctx.setLineDash([]);ctx.restore();ctx.globalAlpha=a;const bw=80,k_=clamp(s.hp95/s.maxHp95,0,1);ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(s.x-bw/2,s.y-s.r-24,bw,4);ctx.fillStyle=c;ctx.fillRect(s.x-bw/2,s.y-s.r-24,bw*k_,4);
    if(!(banT>0))worldLabel(s.x,s.y-s.r-30,'ТЕНЬ · '+s.name95+' · '+Math.ceil(s.life95),c);ctx.globalAlpha=1;}
  // руки-стиратели
  const H_=b.hands;if(H_&&H_.sw&&H_.sw.st==='go'){const sw=H_.sw,span=sw.vert?H:W,at=sw.from?span-sw.pos:sw.pos,x=sw.vert?sw.x:at,y=sw.vert?at:sw.y,dir=sw.vert?(sw.from?-Math.PI/2:Math.PI/2):(sw.from?Math.PI:0);hand95(x,y,dir,t,shk95());}
  if(b.st==='final'||b.st==='scene')dock85Draw(b,t);if(b.st==='fight'&&b.ebb>0)worldLabel(W/2,b.hzF*H+40,'ОТЛИВ · '+Math.ceil(b.ebb),'#ffffff');if(inMission())ally85Draw(t);}
function hand95(x,y,dir,t,k){ctx.save();ctx.translate(x,y);ctx.rotate(dir);const s=1.3*k;ctx.scale(s,s);glow(0,0,80,'#ffffff',.28);ctx.lineCap='round';ctx.lineJoin='round';
  // пальцы: два сустава, белый контур и тёмная «плоть» пустоты; кончики шевелятся
  const fing=(x0,y0,l1,l2,a1,a2,w)=>{const x1=x0+Math.cos(a1)*l1,y1=y0+Math.sin(a1)*l1,x2=x1+Math.cos(a1+a2)*l2,y2=y1+Math.sin(a1+a2)*l2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle='#f4fff9';ctx.lineWidth=w+3/s;ctx.stroke();ctx.strokeStyle='rgba(2,5,6,.96)';ctx.lineWidth=w;ctx.stroke();return [x2,y2];};
  const tips=[];for(let i=0;i<4;i++){const yy=-18+i*12,L=(i===1||i===2?20:16),w=i===0||i===3?6.5:7.5;tips.push(fing(6,yy,L,L*.8+2*Math.sin(t*7+i),(i-1.5)*.08,.25*Math.sin(t*5+i*1.3)+(i-1.5)*.06,w));}
  tips.push(fing(-8,-22,16,14,-1.15,.55+.15*Math.sin(t*4),7));
  // ладонь
  ctx.beginPath();ctx.moveTo(-40,-26);ctx.quadraticCurveTo(-10,-34,10,-24);ctx.lineTo(12,24);ctx.quadraticCurveTo(-10,34,-40,26);ctx.closePath();ctx.fillStyle='rgba(2,5,6,.96)';ctx.fill();ctx.strokeStyle='#f4fff9';ctx.lineWidth=2.5/s;ctx.stroke();
  // линии ладони — стёртые строки
  ctx.strokeStyle=rgba90(C90.sh,.55);ctx.lineWidth=1.2/s;ctx.beginPath();ctx.moveTo(-30,-10);ctx.quadraticCurveTo(-12,-14,4,-6);ctx.moveTo(-32,6);ctx.quadraticCurveTo(-14,2,2,10);ctx.stroke();
  ctx.lineCap='butt';ctx.lineJoin='miter';
  if(SET.fx&&Math.random()<.35){const q=tips[Math.random()*tips.length|0],c=Math.cos(dir)*s,sn=Math.sin(dir)*s;glyph95(x+q[0]*c-q[1]*sn,y+q[0]*sn+q[1]*c,1,'#f4fff9');}
  ctx.restore();}
function shoreTop(b,t){if(b.st==='enter'&&b.lit<1){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='rgba(2,5,6,'+(.85*(1-b.lit))+')';ctx.fillRect(0,0,cv.width,cv.height);ctx.restore();}
  if(b.phase>=3&&b.st==='fight'&&b.fade>0)vig95('#000000',.55*b.fade,.3);
  if(b.face&&b.face.stun>0&&b.st==='fight')vig95('#ffffff',.06*Math.min(1,b.face.stun),.5);}
function shoreDying(b,dt,t0){const fx=b.fx85;if(t0<=0){trauma90(.7);}b.hzF=Math.max(-.1,b.hzF-dt*.25);
  if(SET.fx&&Math.random()<.7){const x=rnd(0,W);glyph95(x,Math.max(10,hzAt100(b,x)),1,fx.kind==='forget'?'#9fb0c4':fx.kind==='record'?'#ffffff':C90.sh);}
  if(SET.fx&&Math.random()<.6)part(rnd(0,W),H*rnd(.2,.9),0,-rnd(30,90),rnd(.8,1.6),fx.kind==='forget'?'#9fb0c4':fx.kind==='record'?'#ffffff':C90.sh,rnd(1.5,3));}
// --- рисунок частей боссов (через drawE95) ---
function drawBoss95(e,t,icon,col,face,alpha){const r=e.r;
  switch(e.type){
    case 'beacon100':{const b=e.host85,m=b&&!icon?shoreShK95(b,e):1;ctx.fillStyle='#0a1412';ctx.beginPath();ctx.moveTo(-r*.7,r);ctx.lineTo(-r*.35,-r*.7);ctx.lineTo(r*.35,-r*.7);ctx.lineTo(r*.7,r);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle=col;ctx.beginPath();for(let i=1;i<4;i++){const y=r-i*r*.45;ctx.moveTo(-r*.6+i*.08*r,y);ctx.lineTo(r*.6-i*.08*r,y);}ctx.stroke();
      const sig=e.sigK>0,lampC=e.flash>0?'#ffffff':sig&&Math.sin(t*30)>0?C95.hom:e.bOn||icon?'#ffffff':col;ctx.fillStyle=lampC;ctx.beginPath();ctx.arc(0,-r*.95,r*.3,0,TAU);ctx.fill();if(!icon&&(e.bOn||sig))glow(0,-r*.95,r*1.4,sig?C95.hom:'#d8fff0',.6);
      if(!icon){if(m<1){ctx.globalAlpha=alpha*(1-m)*.8;ctx.strokeStyle=rgba90(C90.sh,.9);ctx.lineWidth=1.5;ctx.beginPath();for(let i=0;i<=6;i++){const a=i/6*TAU+t*.4,rr=r+14+2*Math.sin(t*3+i);const x=Math.cos(a)*rr,y=Math.sin(a)*rr;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);}ctx.stroke();
          if(SET.fx&&m>0&&m<.95&&Math.random()<.3){const a=rnd(0,TAU);part(e.x+Math.cos(a)*(r+14),e.y+Math.sin(a)*(r+14),Math.cos(a)*30,Math.sin(a)*30-20,.5,C90.sh,1.6);}ctx.globalAlpha=alpha;}
        const bw=r*2.4,k=clamp(e.hp/e.maxHp,0,1);ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(-bw/2,r+8,bw,4);ctx.fillStyle=C90.sh;ctx.fillRect(-bw/2,r+8,bw*k,4);}
      break;}
    case 'eye95':{if(icon){ctx.strokeStyle=col;ctx.beginPath();ctx.ellipse(0,0,r,r*.45,0,0,TAU);ctx.stroke();ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,r*.3,0,TAU);ctx.fill();break;}
      if(e.flash>0){ctx.strokeStyle='#ffffff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,r*1.15,r*.6,0,0,TAU);ctx.stroke();}markDraw95(e,t);break;}
    case 'shade95':break;
    default:return false;}
  return true;}

