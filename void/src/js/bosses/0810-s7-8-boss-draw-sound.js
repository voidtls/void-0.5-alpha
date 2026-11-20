// ===== 0.8.5: отрисовка, звук, музыка =====
const CF85=(()=>{try{return 'filter' in document.createElement('canvas').getContext('2d');}catch(e){return false;}})();
function gray85(on,br){if(!CF85)return;ctx.filter=on?'grayscale(1) brightness('+(br||.75)+')':'none';}
function shipPath85(s){ctx.beginPath();ctx.moveTo(19*s,0);ctx.lineTo(-11*s,-12*s);ctx.lineTo(-5*s,0);ctx.lineTo(-11*s,12*s);ctx.closePath();}
// --- арена «Цех №0» (под врагами) ---
function lekUnder(b,t){const g=b.g||lekGeo(b),on=b.st==='fight'&&b.stopT<=0,wo=b.wo&&b.wo.st==='go',v=lekBeltSpd(),lit=b.st==='enter'?b.light:1;
  ctx.fillStyle='rgba(16,14,8,.55)';ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(232,210,122,.05)';ctx.lineWidth=1;ctx.beginPath();for(let x=0;x<=W;x+=48){ctx.moveTo(x,0);ctx.lineTo(x,H);}for(let y=0;y<=H;y+=48){ctx.moveTo(0,y);ctx.lineTo(W,y);}ctx.stroke();
  // рельс крана
  const ry=g.rail;ctx.fillStyle='#14120a';ctx.fillRect(0,ry-7,W,14);ctx.save();ctx.beginPath();ctx.rect(0,ry-7,W,14);ctx.clip();ctx.fillStyle='rgba(232,210,122,.55)';for(let x=-20;x<W+20;x+=28){ctx.beginPath();ctx.moveTo(x,ry+7);ctx.lineTo(x+14,ry-7);ctx.lineTo(x+24,ry-7);ctx.lineTo(x+10,ry+7);ctx.closePath();ctx.fill();}ctx.restore();
  ctx.strokeStyle='#5a5230';ctx.lineWidth=2;ctx.strokeRect(-2,ry-7,W+4,14);
  // конвейеры
  for(let i=0;i<3;i++){const y=g.belts[i],h=g.bh,d=g.dir[i],stp=!on||b.beltStop&&b.beltStop[i];
    ctx.fillStyle='rgba(8,8,6,.78)';ctx.fillRect(0,y-h/2,W,h);ctx.fillStyle='#3a3420';ctx.fillRect(0,y-h/2-3,W,4);ctx.fillRect(0,y+h/2-1,W,4);
    const off=((b.beltT||0)*v)%48;ctx.fillStyle='#2a2616';for(let x=-48;x<W+48;x+=48){const xx=x+(stp?0:d*off);ctx.beginPath();ctx.arc(xx,y-h/2,3,0,TAU);ctx.arc(xx,y+h/2,3,0,TAU);ctx.fill();}
    ctx.save();ctx.beginPath();ctx.rect(0,y-h/2+4,W,h-8);ctx.clip();
    if(wo&&!stp){const o=((b.beltT||0)*140)%44;ctx.strokeStyle='rgba(255,79,110,'+(.35+.2*Math.sin(t*10))+')';ctx.lineWidth=4;for(let x=30;x<W;x+=110)for(let yy=y-h/2-44+o;yy<y+h/2+44;yy+=44){ctx.beginPath();ctx.moveTo(x-16,yy-8);ctx.lineTo(x,yy+6);ctx.lineTo(x+16,yy-8);ctx.stroke();}}
    else{const o=stp?0:((b.beltT||0)*v)%90;ctx.strokeStyle=stp?'rgba(232,210,122,.08)':'rgba(232,210,122,.17)';ctx.lineWidth=6;for(let x=-90;x<W+90;x+=90){const xx=x+d*o;ctx.beginPath();ctx.moveTo(xx-12*d,y-h*.28);ctx.lineTo(xx+8*d,y);ctx.lineTo(xx-12*d,y+h*.28);ctx.stroke();}}
    ctx.restore();if(stp&&b.st==='fight'&&b.stopT>0){ctx.globalAlpha=.6;worldLabel(W/2,y+4,'ЛЕНТА СТОИТ · '+Math.ceil(b.stopT)+' С',C85.lek);ctx.globalAlpha=1;}}
  // шлюзы
  for(const [x,lab] of [[18,'ПРИЁМКА'],[W-18,'ОТК']]){const y=g.belts[lab==='ОТК'?1:0];ctx.fillStyle='#0a0904';ctx.strokeStyle='#8a7a3a';ctx.lineWidth=2;ctx.fillRect(x-14,y-g.bh/2,28,g.bh);ctx.strokeRect(x-14,y-g.bh/2,28,g.bh);ctx.save();ctx.translate(x,y);ctx.rotate(-Math.PI/2);ctx.globalAlpha=.7;ctx.font='700 '+fpx(9)+'px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillStyle=C85.lek;ctx.fillText(lab,0,3);ctx.restore();ctx.globalAlpha=1;}
  // печь утилизации
  const fy=g.furY,fh=H-fy;const gr=ctx.createLinearGradient(0,fy-30,0,H);gr.addColorStop(0,'rgba(255,122,61,0)');gr.addColorStop(.35,'rgba(255,122,61,.35)');gr.addColorStop(1,'rgba(255,60,30,.75)');ctx.fillStyle=gr;ctx.fillRect(0,fy-30,W,fh+30);
  ctx.strokeStyle='rgba(255,180,100,'+(.45+.25*Math.sin(t*3))+')';ctx.lineWidth=2;ctx.beginPath();for(let x=0;x<=W;x+=12)ctx.lineTo(x,fy+3*Math.sin(x*.05+t*4));ctx.stroke();
  if(SET.fx&&Math.random()<.5)part(rnd(0,W),fy+rnd(4,fh),rnd(-10,10),-rnd(30,90),.7,Math.random()<.5?'#ff7a3d':'#ffb84d',2.5);
  ctx.globalAlpha=.5*lit;ctx.font='700 '+fpx(10)+'px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillStyle='#ffd0a0';ctx.fillText('ПЕЧЬ УТИЛИЗАЦИИ',W/2,g.furY+24);ctx.globalAlpha=1;
  // пульты смены
  for(const q of b.pults){const ready=q.cd<=0,col=b.stopT>0&&b.st==='fight'?'#7affc9':ready?C85.lek:'#6b7280';glow(q.x,q.y,40,col,ready?.4+.2*Math.sin(t*5):.15);
    ctx.save();ctx.translate(q.x,q.y);ctx.fillStyle='#10100a';ctx.strokeStyle=col;ctx.lineWidth=2;ctx.fillRect(-18,-13,36,26);ctx.strokeRect(-18,-13,36,26);ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fill();
    if(q.ch>0){ctx.strokeStyle='#ffffff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,28,-Math.PI/2,-Math.PI/2+TAU*q.ch/.6);ctx.stroke();}
    else if(!ready){ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,24,-Math.PI/2,-Math.PI/2+TAU*(1-q.cd/25));ctx.stroke();}ctx.restore();
    if(b.st==='fight'||b.st==='enter'){label85(q.x,q.y-40,'ПУЛЬТ СМЕНЫ',col);label85(q.x,q.y-25,ready?'СТОП ЛЕНТ · 0,6 С':'ПЕРЕЗАРЯДКА '+Math.ceil(q.cd)+' С',col);}}
  // лампы ОТК
  if(b.phase===2&&b.st==='fight'){for(let i=0;i<3;i++){const L=lekLamp(b,i),hot=b.inCone;if(!L.on){ctx.fillStyle='#3a3420';ctx.beginPath();ctx.arc(L.x,L.y+6,6,0,TAU);ctx.fill();continue;}ctx.fillStyle=hot?'rgba(255,211,107,.16)':'rgba(255,211,107,.07)';ctx.beginPath();ctx.moveTo(L.x,L.y);ctx.arc(L.x,L.y,LAMP85.len,L.a-LAMP85.ha,L.a+LAMP85.ha);ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(255,211,107,.35)';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle='#ffd36b';ctx.beginPath();ctx.arc(L.x,L.y+6,7,0,TAU);ctx.fill();glow(L.x,L.y+6,22,'#ffd36b',.5);}
    if(b.cone>0){const p=G.player;ctx.strokeStyle='#ffd36b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,p.r+12,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,b.cone/.8));ctx.stroke();}}
  // обломки манипуляторов
  for(const k of G.pick){if(k.k!=='wreck85')continue;ctx.save();ctx.translate(k.x,k.y);ctx.rotate(k.t*.7+k.x*.01);ctx.fillStyle='#1c1a10';ctx.strokeStyle='#c9b15a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-11,-5);ctx.lineTo(9,-8);ctx.lineTo(12,4);ctx.lineTo(-6,8);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}}
// --- арена «Колодец» (под врагами) ---
function wellUnder(b,t){const p=G.player,R=b.R,lit=b.st==='enter'?b.lit:1;
  ctx.fillStyle='rgba(2,3,8,.9)';ctx.beginPath();ctx.rect(-4000,-4000,8000+W,8000+H);ctx.arc(b.cx,b.cy,R,0,TAU,true);ctx.fill('evenodd');
  const gr=ctx.createRadialGradient(b.cx,b.cy,R*.08,b.cx,b.cy,R);gr.addColorStop(0,'rgba(1,2,8,.92)');gr.addColorStop(.6,'rgba(8,14,40,.55)');gr.addColorStop(1,'rgba(18,30,80,.35)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(b.cx,b.cy,R,0,TAU);ctx.fill();
  const n=G.q===0||G.lowFx?3:6,ox=p?(p.x-b.cx):0,oy=p?(p.y-b.cy):0;
  for(let i=1;i<=n;i++){const k=i/(n+1),rr=R*k,par=(1-k)*.12;ctx.strokeStyle='rgba(107,140,255,'+((.04+.08*k)*lit).toFixed(3)+')';ctx.lineWidth=1+k*2;ctx.beginPath();ctx.arc(b.cx-ox*par,b.cy-oy*par,rr,0,TAU);ctx.stroke();}
  ctx.strokeStyle='rgba(107,140,255,'+(.5*lit).toFixed(3)+')';ctx.lineWidth=3;ctx.setLineDash([14,10]);ctx.lineDashOffset=-t*6;ctx.beginPath();ctx.arc(b.cx,b.cy,R,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;
  // дорожки колец
  if(b.st==='fight'||b.st==='enter'){for(const ring of b.rings){const rr=ring.r+(64*b.k-ring.r)*(b.collapse||0);ctx.strokeStyle='rgba(107,140,255,.12)';ctx.lineWidth=2;ctx.setLineDash([3,7]);ctx.beginPath();ctx.arc(b.cx,b.cy,rr,0,TAU);ctx.stroke();ctx.setLineDash([]);}}}
function sb85Under(t){const b=sb85();if(!b||!inMission())return;if(SBX[b.sbk]){if(SBX[b.sbk].under)SBX[b.sbk].under(b,t);return;}if(b.sbk==='lek')lekUnder(b,t);else wellUnder(b,t);}
// --- над врагами ---
function dock85Draw(b,t){if(!b.docks)return;for(const d of b.docks){const col=d.lock?'#5a6478':d.off?'#4a4f5c':d.col?d.col:d.kind==='break'?'#ff7a3d':d.kind==='write'?C85.lek:d.kind==='silence'?'#9fb0c4':d.kind==='answer'?C85.voidc:'#ffffff';
    ctx.globalAlpha=d.off?.45:d.lock?.6:1;glow(d.x,d.y,54,col,d.off||d.lock?.15:.35+.15*Math.sin(t*4));ctx.strokeStyle=col;ctx.lineWidth=d.lock?1.5:2.5;if(d.lock)ctx.setLineDash([4,6]);ctx.beginPath();ctx.arc(d.x,d.y,46,0,TAU);ctx.stroke();ctx.setLineDash([]);
    if(!d.off&&!d.lock){ctx.lineWidth=1;ctx.beginPath();ctx.arc(d.x,d.y,30+4*Math.sin(t*3),0,TAU);ctx.stroke();}
    if(d.ch>0){ctx.strokeStyle='#ffffff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(d.x,d.y,52,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,d.ch/.6));ctx.stroke();}
    worldLabel(d.x,d.y-58,d.lab,col);if(d.sub){const st=d.off?'ДРУГОЙ ВЫБОР':d.prev?'ВАШ ВЫБОР':d.sub;let gap=1e9;for(const o of b.docks)if(o!==d&&Math.abs(o.y-d.y)<30)gap=Math.min(gap,Math.abs(o.x-d.x));ctx.font='700 '+fpx(11)+'px "JetBrains Mono",monospace';const L=gap<1e9&&ctx.measureText(st).width>gap-18?wrap85(st,Math.max(90,gap-18)):[st];L.forEach((ln,i)=>worldLabel(d.x,d.y+64+i*fpx(13),ln,col));}ctx.globalAlpha=1;}}
function armIK85(sx,sy,tx,ty,L,side){const dx=tx-sx,dy=ty-sy,d=Math.min(Math.hypot(dx,dy)||1,2*L-1),a=Math.atan2(dy,dx),c=Math.acos(clamp(d/(2*L),-1,1));const ea=a+side*c;return {ex:sx+Math.cos(ea)*L,ey:sy+Math.sin(ea)*L,hx:sx+Math.cos(a)*d,hy:sy+Math.sin(a)*d};}
function lekDraw(b,t){const p=G.player,g=b.g;
  // руки манипуляторов (от плеча к цели: хват → заготовка → покой)
  for(const arm of [b.armL,b.armR]){if(!lekAlive(arm)||arm.spawnT>0)continue;const side=arm.role==='armL'?-1:1,Gr=b.grab&&b.grab.arm===arm?b.grab:null;let tx,ty;
    if(Gr&&Gr.st!=='tele'){tx=Gr.hx;ty=Gr.hy;}else if(b.asm){tx=b.asm.e.x+side*24;ty=b.asm.e.y-10;}else{tx=arm.x+side*40*g.k;ty=arm.y+130*g.k+10*Math.sin(t*1.5+side);}
    const L=150*g.k,ik=armIK85(arm.x,arm.y,tx,ty,L,side>0?-1:1);
    ctx.strokeStyle=arm.flash>0?'#ffffff':'#c9b15a';ctx.lineWidth=10*g.k;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(arm.x,arm.y);ctx.lineTo(ik.ex,ik.ey);ctx.lineTo(ik.hx,ik.hy);ctx.stroke();
    ctx.strokeStyle='#14120a';ctx.lineWidth=3*g.k;ctx.beginPath();ctx.moveTo(arm.x,arm.y);ctx.lineTo(ik.ex,ik.ey);ctx.lineTo(ik.hx,ik.hy);ctx.stroke();ctx.lineCap='butt';
    ctx.fillStyle='#1c1a10';ctx.strokeStyle='#e8d27a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(ik.ex,ik.ey,7*g.k,0,TAU);ctx.fill();ctx.stroke();
    // трос хвата дальше досягаемости
    let cx=ik.hx,cy=ik.hy;if(Gr&&Gr.st!=='tele'&&Math.hypot(Gr.hx-ik.hx,Gr.hy-ik.hy)>4){ctx.strokeStyle='#9fb0c4';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ik.hx,ik.hy);ctx.lineTo(Gr.hx,Gr.hy);ctx.stroke();cx=Gr.hx;cy=Gr.hy;}
    const ca=Gr&&Gr.st!=='tele'?Gr.a:Math.atan2(ty-ik.ey,tx-ik.ex),open=Gr&&Gr.st==='fly'?.7:Gr&&Gr.st==='hold'?.15:b.asm?.3+.2*Math.sin(t*12):.45;
    ctx.save();ctx.translate(cx,cy);ctx.rotate(ca);ctx.strokeStyle=Gr&&Gr.st==='hold'?'#ff4f6e':'#e8d27a';ctx.lineWidth=4*g.k;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(10*g.k,s*12*open*g.k+s*4);ctx.lineTo(20*g.k,s*4*g.k);ctx.stroke();}ctx.restore();
    if(b.asm&&SET.fx&&Math.random()<.5)part(ik.hx+rnd(-4,4),ik.hy+rnd(-4,4),rnd(-120,120),rnd(-160,20),.25,Math.random()<.5?'#ffffff':'#ffd36b',2);}
  // сборка: кольцо прогресса
  if(b.asm&&b.asm.e.alive){const e=b.asm.e,k=b.asm.t/3;ctx.strokeStyle='#ff4f6e';ctx.globalAlpha=.85;ctx.lineWidth=3;ctx.beginPath();ctx.arc(e.x,e.y,e.r+12,-Math.PI/2,-Math.PI/2+TAU*k);ctx.stroke();ctx.globalAlpha=1;worldLabel(e.x,e.y-e.r-20,'СБОРКА '+Math.round(k*100)+'%','#ff4f6e');}
  // печати ОТК
  for(const s of b.stamps){if(s.t<=0)continue;ctx.save();ctx.translate(s.x,s.y);ctx.rotate(s.sp);ctx.fillStyle='#2a1406';ctx.strokeStyle='#ff7a3d';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<8;i++){const a=i/8*TAU,rr=i%2?6:11;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#ffd36b';ctx.beginPath();ctx.arc(0,0,3,0,TAU);ctx.fill();ctx.restore();}
  // Серийники: номер на борту, вспышка стволов
  for(const e of G.enemies){if(!e.alive||e.type!=='serial85'||e.spawnT>0)continue;worldLabel(e.x,e.y-e.r-12,String(e.no85||14).padStart(3,'0'),C85.lek);
    if(e.sf&&e.sf.st==='tele'){glow(e.x,e.y,30,'#ffd36b',(.5+.4*Math.sin(t*40))*tl85());}}
  dock85Draw(b,t);}
function wellDraw(b,t){const p=G.player;
  // якоря: цепь к ядру и счётчик
  for(const a of b.anchors){if(!a.alive)continue;ctx.strokeStyle=C85.well;ctx.globalAlpha=.35+.2*Math.sin(t*6);ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.lineDashOffset=-t*30;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.cx,b.cy);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;ctx.globalAlpha=1;}
  if(b.anchors.some(a=>a.alive)&&b.st==='fight')worldLabel(b.cx,b.cy-b.r-28,'ПЕТЛЯ · '+Math.max(0,Math.ceil(b.loopT)),b.loopT<5?C85.red:C85.well);
  // запись: тонкий красный след; Отзвук-0: впереди его путь
  if(b.rec&&b.rec.path.length>1){ctx.strokeStyle=C85.red;ctx.globalAlpha=.55;ctx.lineWidth=1.5;ctx.beginPath();for(const q of b.rec.path)ctx.lineTo(q.x,q.y);if(p)ctx.lineTo(p.x,p.y);ctx.stroke();ctx.globalAlpha=1;const q=b.rec.path[0];ctx.fillStyle=C85.red;ctx.beginPath();ctx.arc(q.x,q.y,4,0,TAU);ctx.fill();}
  for(const g of b.ghosts){if(!g.alive||!g.rec)continue;const P_=g.rec.path;ctx.strokeStyle='#f2f6ff';ctx.globalAlpha=.25;ctx.lineWidth=1;ctx.setLineDash([3,6]);ctx.beginPath();ctx.moveTo(g.x,g.y);for(const q of P_)if(q.t>g.pt&&q.t<g.pt+2)ctx.lineTo(q.x,q.y);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}
  // паломники: разбуженные
  for(const e of G.enemies){if(e.alive&&e.type==='pilgrim'&&e.pg85&&e.pg85.st==='woke')worldLabel(e.x,e.y-e.r-26,'ПРОСНУЛСЯ',C85.pil);}
  // корабль на дне
  if(b.st==='scene'||b.st==='final'||b.st==='dying'){const sx=b.cx,sy=b.cy,fx=b.fx85;ctx.save();ctx.translate(sx,sy);ctx.rotate(-Math.PI/2+.25*Math.sin(t*.4));ctx.globalAlpha=.9;gray85(true,.65);drawShip(curSkin(),t,0,{});gray85(false);
    ctx.strokeStyle='rgba(10,12,20,.8)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-4,-6);ctx.lineTo(6,2);ctx.moveTo(-8,5);ctx.lineTo(0,9);ctx.stroke();ctx.restore();ctx.globalAlpha=1;
    const on=!(fx&&fx.kind==='silence'),blink=Math.sin(t*(fx&&fx.kind==='answer'?6:3.2))>.2,dc=fx&&fx.kind==='answer'?shipCol():fx&&fx.kind==='third'?'#ffffff':'#ff4f6e';
    if(on&&blink){glow(sx+8,sy-12,16,dc,.9);ctx.fillStyle=dc;ctx.beginPath();ctx.arc(sx+8,sy-12,2.5,0,TAU);ctx.fill();}worldLabel(sx,sy+34,'013','#9fb0c4');}
  dock85Draw(b,t);}
function ally85Draw(t){const X=G.x85,A=X&&X.ally;if(!A)return;ctx.save();ctx.translate(A.x,A.y);ctx.rotate(A.ang||0);ctx.fillStyle='#2a2408';ctx.strokeStyle=shipCol();ctx.lineWidth=2;shipPath85(.8);ctx.fill();ctx.stroke();ctx.restore();
  worldLabel(A.x,A.y-20,(A.kind==='appr'?'УЧЕНИК':'013')+(A.maxHp&&A.kind==='serial'?' '+Math.ceil(A.hp/A.maxHp*100)+'%':''),shipCol());}
function sb85Draw(b,t){if(SBX[b.sbk]){if(SBX[b.sbk].draw)SBX[b.sbk].draw(b,t);}else if(b.sbk==='lek')lekDraw(b,t);else wellDraw(b,t);if(inMission())ally85Draw(t);}
// --- поверх маски темноты: телеграфы, сонар, сцены, субтитры ---
function edge85(x,y,col){const m=18;if(x>CX+m&&x<CX+VW-m&&y>CY+m&&y<CY+VH-m)return;const cx=CX+VW/2,cy=CY+VH/2,a=Math.atan2(y-cy,x-cx);const ex=clamp(x,CX+m,CX+VW-m),ey=clamp(y,CY+m,CY+VH-m);
  ctx.save();ctx.translate(ex,ey);ctx.rotate(a);ctx.fillStyle=col;ctx.globalAlpha=.6+.35*Math.sin(G.t*14);ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-6,-8);ctx.lineTo(-6,8);ctx.closePath();ctx.fill();ctx.restore();ctx.globalAlpha=1;}
function lekTop(b,t){const p=G.player,g=b.g,tk=tl85();
  if(b.st==='enter'){const rows=8;ctx.fillStyle='#030304';for(let i=0;i<rows;i++){const k=clamp(b.light*rows*1.15-i,0,1);if(k>=1)continue;ctx.globalAlpha=.92*(1-k);ctx.fillRect(-10,H*i/rows,W+20,H/rows+1);}ctx.globalAlpha=1;
    if(b.scan&&b.scanT<1.6){const k=b.scanT/1.6,y=p.y-80+160*k;ctx.strokeStyle=C85.lek;ctx.globalAlpha=.8;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(b.fx,b.fy+40);ctx.lineTo(p.x-40,y);ctx.lineTo(p.x+40,y);ctx.closePath();ctx.stroke();ctx.globalAlpha=.12;ctx.fillStyle=C85.lek;ctx.fill();ctx.globalAlpha=1;worldLabel(p.x,p.y+40,'СКАН ИЗДЕЛИЯ',C85.lek);}}
  if(b.press){const P=b.press,y=g.belts[P.i],hh=g.bh/2;if(P.st==='tele'){const k=1-P.t/P.T;ctx.fillStyle='rgba(255,79,110,'+((.12+.2*k)*tk).toFixed(3)+')';ctx.fillRect(P.x-80,y-hh,160,g.bh);ctx.strokeStyle='#ff4f6e';ctx.globalAlpha=(.5+.45*Math.sin(t*26))*tk;ctx.lineWidth=3;ctx.strokeRect(P.x-80,y-hh,160,g.bh);ctx.globalAlpha=tk;
      ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(P.x-80*k,y-hh,160*k,g.bh);ctx.globalAlpha=1;worldLabel(P.x,y+4,'ПРЕСС',C85.red);edge85(P.x,y,C85.red);}
    const top=b.pr&&b.pr.alive?b.pr.y+14*g.k:b.fy+100*g.k,hy=P.st==='tele'?top+(y-hh-top)*(1-P.t/P.T)*.85:P.st==='up'?y-hh+(top-(y-hh))*(1-P.t/.5):y-hh;
    ctx.strokeStyle='#8a8060';ctx.lineWidth=14*g.k;ctx.beginPath();ctx.moveTo(P.x,top);ctx.lineTo(P.x,hy);ctx.stroke();ctx.fillStyle='#1c1a10';ctx.strokeStyle=C85.lek;ctx.lineWidth=2;ctx.fillRect(P.x-80,hy-10,160,12);ctx.strokeRect(P.x-80,hy-10,160,12);
    if(P.hitT&&G.t-P.hitT<.25){ctx.fillStyle='rgba(255,255,255,'+(.32*(1-(G.t-P.hitT)/.25)).toFixed(3)+')';ctx.fillRect(P.x-80,y-hh,160,g.bh);}}
  const Gr=b.grab;if(Gr&&Gr.st==='tele'&&lekAlive(Gr.arm)){const a=Gr.arm;ctx.strokeStyle='#ff4f6e';ctx.globalAlpha=(.45+.4*Math.sin(t*24))*tk;ctx.lineWidth=2;ctx.setLineDash([8,8]);ctx.lineDashOffset=-t*40;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(a.x+Math.cos(Gr.a)*520,a.y+Math.sin(Gr.a)*520);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;ctx.globalAlpha=1;
    const hx=a.x+Math.cos(Gr.a)*60,hy=a.y+Math.sin(Gr.a)*60;worldLabel(hx,hy-14,'ХВАТ',C85.red);}
  if(b.salvo){const S=b.salvo,k=1-S.t/S.T,n=Math.max(6,Math.min(18,b.hop.length)),sp=Math.min(.12,1.3/Math.max(1,n-1))*(n-1)/2+.06;ctx.fillStyle='rgba(255,79,110,'+((.1+.18*k)*tk).toFixed(3)+')';ctx.beginPath();ctx.moveTo(b.fx,b.fy);ctx.arc(b.fx,b.fy,560,S.a-sp,S.a+sp);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#ff4f6e';ctx.globalAlpha=(.5+.4*Math.sin(t*22))*tk;ctx.lineWidth=2;ctx.stroke();ctx.globalAlpha=1;worldLabel(b.fx+Math.cos(S.a)*150,b.fy+Math.sin(S.a)*150,'ВСЯ СМЕНА · '+b.hop.length,C85.red);}
  if(b.wo){const W_=b.wo;if(W_.st==='warn'||Math.sin(t*8)>0){ctx.strokeStyle='#ff4f6e';ctx.globalAlpha=.5;ctx.lineWidth=8;ctx.strokeRect(CX+4,CY+4,VW-8,VH-8);ctx.globalAlpha=1;}if(W_.st==='warn')worldLabel(p.x,p.y-46,'СПИСАНИЕ · '+fmt85(W_.t),C85.red);}
  // матрица и печь видны в темноте
  if(G.bo80>.3&&b.st==='fight'){const op=lekCoreOpen(b);glow(b.fx,b.fy,op?60:30,op?'#ffffff':C85.lek,op?.9:.5);if(op){ctx.strokeStyle='#ffffff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(b.fx,b.fy,32*g.k,-Math.PI/2,-Math.PI/2+TAU*(b.win/b.winMax));ctx.stroke();}}}
function wellTop(b,t){const p=G.player,tk=tl85();
  for(const S of b.sons){if(S.t>0){const k=1-S.t/S.T;ctx.strokeStyle='#ffffff';ctx.globalAlpha=(.55+.4*Math.sin(t*24))*tk;ctx.lineWidth=5;for(const gp of S.gaps){ctx.beginPath();ctx.arc(b.cx,b.cy,b.r+10+8*k,gp.a-gp.w/2,gp.a+gp.w/2);ctx.stroke();}
      ctx.globalAlpha=.25*tk;ctx.lineWidth=2;ctx.setLineDash([4,8]);for(const gp of S.gaps){ctx.beginPath();ctx.moveTo(b.cx+Math.cos(gp.a)*(b.r+14),b.cy+Math.sin(gp.a)*(b.r+14));ctx.lineTo(b.cx+Math.cos(gp.a)*b.R,b.cy+Math.sin(gp.a)*b.R);ctx.stroke();}ctx.setLineDash([]);ctx.globalAlpha=1;continue;}
    ctx.strokeStyle='#eef3ff';ctx.globalAlpha=.9;ctx.lineWidth=7;ctx.beginPath();const gs=S.gaps.slice().sort((a,c)=>((a.a%TAU)+TAU)%TAU-((c.a%TAU)+TAU)%TAU);
    for(let i=0;i<gs.length;i++){const a0=gs[i].a+gs[i].w/2,a1=gs[(i+1)%gs.length].a-gs[(i+1)%gs.length].w/2+(i===gs.length-1?TAU:0);let e1=a1;while(e1<a0)e1+=TAU;ctx.moveTo(b.cx+Math.cos(a0)*S.r,b.cy+Math.sin(a0)*S.r);ctx.arc(b.cx,b.cy,S.r,a0,e1);}ctx.stroke();ctx.globalAlpha=1;}
  for(const e of b.emit){if(e.alive&&e.tel85>0){glow(e.x,e.y,30,'#9fb8ff',(.6+.35*Math.sin(t*30))*tk);ctx.strokeStyle='#9fb8ff';ctx.globalAlpha=.5*tk;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.globalAlpha=1;}}
  if(b.iw){const I=b.iw;if(I.st==='tele'){ctx.strokeStyle='#e86bff';ctx.globalAlpha=.8*tk;ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.cx,b.cy,b.r+40*(I.t/1),0,TAU);ctx.stroke();ctx.globalAlpha=1;worldLabel(b.cx,b.cy+b.r+30,'ИЗНАНКА','#e86bff');}
    else{ctx.strokeStyle='#e86bff';ctx.globalAlpha=.75*(1-I.r/(b.R+20));ctx.lineWidth=5;ctx.beginPath();ctx.arc(b.cx,b.cy,I.r,0,TAU);ctx.stroke();ctx.globalAlpha=1;}}
  if(b.phase>=4&&b.st==='fight'){glow(b.cx,b.cy,80,'#dfe8ff',.5+.2*Math.sin(t*2));}
  for(const a of b.anchors)if(a.alive)edge85(a.x,a.y,C85.well);
  if(b.st==='scene'&&b.flashK>0){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#ffffff';ctx.globalAlpha=Math.min(SET.fx?1:.6,b.flashK)*(SET.fx?.95:.6);ctx.fillRect(0,0,cv.width,cv.height);ctx.restore();ctx.globalAlpha=1;}}
function rew85Draw(){const X=G.x85;if(!X||!(X.rew>0))return;const k=X.rew/.8;ctx.save();ctx.setTransform(1,0,0,1,0,0);const w=cv.width,h=cv.height;ctx.globalAlpha=.22*k;
  for(let i=0;i<9;i++){const y=((G.t*900+i*h/9)%h);ctx.fillStyle=i%2?'#6b8cff':'#ff4f6e';ctx.fillRect(0,y,w,Math.max(2,h/60));}
  ctx.globalAlpha=.12*k;ctx.fillStyle='#ff004c';ctx.fillRect(6*DPR,0,w,h);ctx.fillStyle='#00c8ff';ctx.fillRect(-6*DPR,0,w,h);ctx.restore();ctx.globalAlpha=1;}
// подпись, которая не уходит за край видимой части арены (телефон: камера ходит по арене 1280×760)
function label85(x,y,text,col){ctx.font='700 '+fpx(11)+'px "JetBrains Mono",monospace';const hw=ctx.measureText(text).width/2+4,l=G.arena?CX:0,r=l+(G.arena?VW:W);worldLabel(hw*2<r-l?clamp(x,l+hw,r-hw):x,y,text,col);}
function wrap85(text,maxW){const words=text.split(' '),lines=[];let cur='';for(const w of words){const t=cur?cur+' '+w:w;if(ctx.measureText(t).width>maxW&&cur){lines.push(cur);cur=w;}else cur=t;}if(cur)lines.push(cur);return lines;}
function sub85Draw(){const X=G.x85,S=X&&X.sub;if(!S)return;const line=S.lines[S.i];if(!line)return;const d=subDur85(line),a=clamp(Math.min(S.t*4,(d-S.t)*4),0,1);
  ctx.save();ctx.setTransform(1,0,0,1,0,0);const k=DPR,w=cv.width,h=cv.height,mob=isMob(),fs=(mob?15:17)*k;ctx.font='600 '+fs+'px "JetBrains Mono",monospace';const L=wrap85(line,Math.min(w*.84,760*k));
  const lh=fs*1.35,boxH=lh*L.length+48*k,y0=h*(mob&&!isPortrait()?.56:.66)-boxH/2,bw=Math.min(w*.9,800*k);
  ctx.globalAlpha=.78*a;ctx.fillStyle='#04060c';ctx.fillRect(w/2-bw/2,y0,bw,boxH);ctx.globalAlpha=a;ctx.strokeStyle=S.col;ctx.lineWidth=1*k;ctx.strokeRect(w/2-bw/2,y0,bw,boxH);
  ctx.textAlign='center';ctx.fillStyle=S.col;ctx.font='700 '+(11*k)+'px "JetBrains Mono",monospace';ctx.fillText(S.cap+'  ·  '+(S.i+1)+'/'+S.lines.length,w/2,y0+16*k);
  ctx.fillStyle='#eef3ff';ctx.font='600 '+fs+'px "JetBrains Mono",monospace';L.forEach((s,i)=>ctx.fillText(s,w/2,y0+30*k+lh*(i+.8)));
  if(S.t>.6){ctx.globalAlpha=.45*a;ctx.fillStyle='#9fb0c4';ctx.font='600 '+(10*k)+'px "JetBrains Mono",monospace';ctx.fillText(touchMode?'КАСАНИЕ — ДАЛЬШЕ':'ПРОБЕЛ / КЛИК — ДАЛЬШЕ',w/2,y0+boxH-7*k);}
  ctx.restore();ctx.globalAlpha=1;}
function sb85Top(t){const b=G.sb&&is85(G.sb)&&G.sb.alive?G.sb:null;if(b&&inMission()){if(SBX[b.sbk]){if(SBX[b.sbk].top)SBX[b.sbk].top(b,t);}else if(b.sbk==='lek')lekTop(b,t);else wellTop(b,t);}rew85Draw();sub85Draw();}
// дыры в маске темноты: печь, глаз матрицы, пульты; ядро колодца
function holes85(hole,band){const b=sb85();if(!b)return;if(SBX[b.sbk])return;if(b.sbk==='lek'){const g=b.g||lekGeo(b);if(band)band(H-125,H-48);else for(let x=40;x<W;x+=120)hole(x,H-24,95);hole(b.fx,b.fy,lekCoreOpen(b)?110:70);for(const q of b.pults)hole(q.x,q.y,60);}
  else{hole(b.cx,b.cy,b.phase>=4||b.st!=='fight'?130:110);}}
// --- рисунки сущностей (из drawE80) ---
function drawE85(e,t,icon,col,face,alpha,P){const r=e.r;
  switch(e.type){
    case 'lekalo':{const b=!icon&&G.sb===e?e:null,g=b&&b.g?b.g:{k:1,rail:-80};const k=icon?.32:g.k,fx=b&&b.fx85,br=fx&&fx.kind==='break',wr=fx&&fx.kind==='write';
      if(br&&fx.t>.25){/* рама рассыпалась */}else{
      if(!icon){ctx.strokeStyle='#5a5230';ctx.lineWidth=2;const ry=g.rail-e.y;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*176*k,-72*k);ctx.lineTo(s*120*k,ry);ctx.stroke();}ctx.fillStyle='#1c1a10';ctx.strokeStyle=C85.lek;ctx.fillRect(-60*k,ry-9,120*k,18);ctx.strokeRect(-60*k,ry-9,120*k,18);}
      const open=b?(b.st==='scene'||b.st==='final'?b.openK:0):0,frameCol=e.flash>0?'#ffffff':wr?shipCol():col;
      ctx.lineJoin='miter';ctx.beginPath();ctx.moveTo(0,104*k);ctx.lineTo(182*k,-74*k);ctx.lineTo(0,-36*k-open*30*k);ctx.lineTo(-182*k,-74*k);ctx.closePath();ctx.fillStyle='rgba(12,10,4,.55)';ctx.fill();
      // VØID-001
      if(!icon){const sw=Math.sin(t*1.1)*.05,dy=br?Math.min(600,fx.t*fx.t*420):0;ctx.save();ctx.translate(0,46*k+dy);ctx.rotate(Math.PI/2+sw+(br?fx.t*2:0));ctx.globalAlpha=alpha*(wr?.95:.62+.3*open);if(!wr)gray85(true,.8);ctx.scale(2.1*k,2.1*k);drawShip(curSkin(),t,0,{});gray85(false);if(!wr){ctx.strokeStyle='rgba(223,232,255,.35)';ctx.lineWidth=.8;shipPath85(1.05);ctx.stroke();}ctx.restore();ctx.globalAlpha=alpha;
        if(!br){ctx.strokeStyle='rgba(201,210,222,.4)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-34*k,-28*k);ctx.lineTo(-10*k,30*k);ctx.moveTo(34*k,-28*k);ctx.lineTo(10*k,30*k);ctx.stroke();worldLabel(0,82*k,'VØID-001','rgba(201,210,222,.75)');}}
      ctx.strokeStyle=frameCol;ctx.lineWidth=12*k;ctx.beginPath();ctx.moveTo(0,104*k);ctx.lineTo(182*k,-74*k);ctx.lineTo(0,-36*k-open*30*k);ctx.lineTo(-182*k,-74*k);ctx.closePath();ctx.stroke();
      ctx.strokeStyle='#14120a';ctx.lineWidth=3*k;ctx.stroke();ctx.lineJoin='round';
      if(!icon){ctx.save();for(const s of [-1,1]){ctx.translate(0,0);const x0=s*182*k,y0=-74*k,ang=Math.atan2(104*k-y0,0-x0);for(let i=0;i<4;i++){const q=i*12*k+8*k,x=x0+Math.cos(ang)*q,y=y0+Math.sin(ang)*q;ctx.fillStyle=i%2?'#14120a':C85.lek;ctx.beginPath();ctx.arc(x,y,4.5*k,0,TAU);ctx.fill();}}ctx.restore();
        ctx.fillStyle=C85.lek;ctx.fillRect(-64*k,-66*k,128*k,14*k);ctx.fillStyle='#14120a';ctx.font='700 '+Math.max(7,10*k)+'px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillText('ЛЕКАЛО · ИЗД. 000',0,-55.5*k);}
      // матрица
      ctx.save();ctx.translate(0,-8*k);const cr=20*k,op=b&&lekCoreOpen(b),oK=b?(op?1:open):0,dead=b&&(b.st==='scene'||b.st==='final'||b.st==='dying');
      ctx.fillStyle='#050604';ctx.beginPath();ctx.arc(0,0,cr+4*k,0,TAU);ctx.fill();
      if(op){glow(0,0,cr*2.4,'#ffffff',.9);ctx.fillStyle=b.core&&b.core.flash>0?'#ffe9a8':'#ffffff';ctx.beginPath();ctx.arc(0,0,cr*(.7+.08*Math.sin(t*14)),0,TAU);ctx.fill();}
      else if(!dead){ctx.fillStyle=C85.lek;ctx.globalAlpha=alpha*(.55+.25*Math.sin(t*3));ctx.beginPath();ctx.arc(0,0,cr*.28,0,TAU);ctx.fill();ctx.globalAlpha=alpha;}
      ctx.fillStyle='#1c1a10';ctx.strokeStyle=op?'#ffffff':C85.lek;ctx.lineWidth=2;const sh=cr*(op?1:oK);for(const s of [-1,1]){ctx.beginPath();ctx.ellipse(s*(cr*.5+sh*.6),0,cr*.5,cr,0,0,TAU);ctx.fill();ctx.stroke();}
      if(b&&b.inv0>0&&b.st==='fight'){ctx.strokeStyle='#ffffff';ctx.globalAlpha=alpha*.35;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,cr+16*k,0,TAU);ctx.stroke();ctx.globalAlpha=alpha;}ctx.restore();}
      break;}
    case 'lpart':{const k=e.host85&&e.host85.g?e.host85.g.k:1;if(e.role==='core')break;
      if(e.role==='press'){ctx.fillStyle='#1c1a10';ctx.strokeStyle=e.flash>0?'#ffffff':col;ctx.lineWidth=2.5;ctx.fillRect(-36*k,-18*k,72*k,32*k);ctx.strokeRect(-36*k,-18*k,72*k,32*k);ctx.fillStyle='#8a8060';for(const s of [-1,1])ctx.fillRect(s*24*k-4*k,14*k,8*k,10*k);ctx.fillStyle=col;ctx.fillRect(-20*k,-6*k,40*k,4*k);break;}
      ctx.beginPath();ctx.arc(0,0,r*.8,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle=col;for(let i=0;i<6;i++){const a=i/6*TAU+t*.2;ctx.beginPath();ctx.arc(Math.cos(a)*r*.55,Math.sin(a)*r*.55,2,0,TAU);ctx.fill();}break;}
    case 'blank85':{ctx.rotate(icon?-Math.PI/2:0);ctx.fillStyle='rgba(20,24,32,.7)';ctx.strokeStyle=e.flash>0?'#ffffff':col;ctx.lineWidth=2;ctx.setLineDash([4,3]);shipPath85(r/13);ctx.fill();ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='rgba(159,176,196,.4)';ctx.fillRect(-6,-2,10,4);break;}
    case 'serial85':{const a=icon?-Math.PI/2:Math.atan2(P.y-e.y,P.x-e.x);ctx.rotate(a);ctx.fillStyle='#2a2408';ctx.strokeStyle=e.flash>0?'#ffffff':col;ctx.lineWidth=2;shipPath85(r/12);ctx.fill();ctx.stroke();
      ctx.fillStyle='#14120a';for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(-6*r/12,s*5*r/12);ctx.lineTo(-9*r/12,s*9*r/12);ctx.lineTo(-5*r/12,s*9*r/12);ctx.lineTo(-3*r/12,s*5*r/12);ctx.closePath();ctx.fill();}
      if(!icon&&e.sf&&e.sf.st==='tele'){ctx.fillStyle='#fff3b0';ctx.beginPath();ctx.arc(19*r/12,0,4+2*Math.sin(t*40),0,TAU);ctx.fill();}break;}
    case 'wellcore':{const b=!icon&&G.sb===e?e:null,R_=icon?r*.9:r,dead=b&&(b.st==='scene'||b.st==='final'||b.st==='dying');if(dead)break;
      const gr=ctx.createRadialGradient(0,0,R_*.1,0,0,R_);gr.addColorStop(0,e.flash>0?'#ffffff':'#eef3ff');gr.addColorStop(.45,'#8fa8ff');gr.addColorStop(1,'#141c40');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,R_,0,TAU);ctx.fill();
      ctx.strokeStyle=b&&b.inv0>0&&b.st==='fight'?'#ffffff':col;ctx.lineWidth=2;ctx.stroke();
      const beat=MUS&&MUS.cur?.5+.5*Math.sin((MUS.cur.step||0)*Math.PI/2):.5;ctx.strokeStyle='#dfe8ff';ctx.globalAlpha=alpha*.8;ctx.lineWidth=1.5;ctx.beginPath();for(let i=0;i<=72;i++){const a=i/72*TAU,amp=(icon?3:5+4*beat)*Math.sin(a*9+t*6)*Math.sin(a*3-t*2);ctx.lineTo(Math.cos(a)*(R_+7+amp),Math.sin(a)*(R_+7+amp));}ctx.closePath();ctx.stroke();ctx.globalAlpha=alpha;
      if(icon){ctx.strokeStyle=col;ctx.lineWidth=4;for(const [rr,a0] of [[R_*1.6,0],[R_*1.3,1]]){for(let i=0;i<4;i++){const a=a0+i*Math.PI/2;ctx.beginPath();ctx.arc(0,0,rr,a-.3,a+.3);ctx.stroke();}}break;}
      if(b&&b.phase>=4){ctx.fillStyle='#04060c';ctx.globalAlpha=alpha*.75;ctx.font='700 18px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillText('013',0,6);ctx.globalAlpha=alpha;}
      if(b&&b.stun>0){ctx.strokeStyle='#ffffff';ctx.globalAlpha=.6;ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,0,R_+12+i*9+Math.sin(t*10+i)*3,0,TAU);ctx.stroke();}ctx.globalAlpha=alpha;}break;}
    case 'wemit':{const rr=e.ringR||96,b=e.host85,arc=b&&b.rings?(e.ring==='O'?b.rings[0].arc:b.rings[1].arc):.5;if(icon){ctx.strokeStyle=col;ctx.lineWidth=7;ctx.beginPath();ctx.arc(-40,0,40,-.5,.5);ctx.stroke();break;}
      ctx.rotate(e.ang85||0);const c2=e.flash>0||e.shieldFlash>0?'#ffffff':e.tel85>0?'#cfe0ff':e.corona?'#4a5a8c':col;ctx.strokeStyle=c2;ctx.lineWidth=e.corona?4:9;ctx.beginPath();ctx.arc(-rr,0,rr,-arc/2,arc/2);ctx.stroke();ctx.strokeStyle='#0a0f1c';ctx.lineWidth=e.corona?1:3;ctx.stroke();
      if(!e.corona){ctx.strokeStyle=c2;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(13,0);ctx.stroke();ctx.fillStyle=c2;ctx.beginPath();ctx.arc(15,0,3,0,TAU);ctx.fill();if(e.back85){ctx.globalAlpha=alpha*.5;ctx.setLineDash([2,3]);ctx.beginPath();ctx.arc(-rr,0,rr,-arc/2,arc/2);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=alpha;}}break;}
    case 'anchor85':{ctx.fillStyle='#0a1028';ctx.strokeStyle=e.flash>0?'#ffffff':col;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(0,-r*1.4);ctx.lineTo(r*.7,0);ctx.lineTo(0,r*1.4);ctx.lineTo(-r*.7,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,-r*.9);ctx.lineTo(0,r*.9);ctx.stroke();if(!icon)glow(0,0,r*1.6,col,.35+.25*Math.sin(t*5));break;}
    case 'ghost85':{if(!icon&&e.trail){for(let i=0;i<(G.q===0||G.lowFx?1:3);i++){const q=e.trail[Math.max(0,e.trail.length-1-(i+1)*5)];if(!q)continue;ctx.save();ctx.translate(q.x-e.x,q.y-e.y);ctx.rotate(e.face||0);ctx.globalAlpha=alpha*(.22-.06*i);ctx.strokeStyle='#f2f6ff';ctx.lineWidth=1.5;shipPath85(1);ctx.stroke();ctx.restore();}}
      ctx.rotate(icon?-Math.PI/2:(e.face||0));ctx.globalAlpha=alpha*(.6+.2*Math.sin(t*8));gray85(true,1.7);drawShip(icon?'base':curSkin(),t,0,{});gray85(false);ctx.strokeStyle='#ffffff';ctx.lineWidth=1.5;shipPath85(1.05);ctx.stroke();ctx.globalAlpha=alpha;break;}
    case 'note85':{ctx.fillStyle='#16204a';ctx.strokeStyle=e.flash>0?'#ffffff':col;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.stroke();ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(r*.4,0);ctx.lineTo(r*.4,-r*2);ctx.quadraticCurveTo(r*1.4,-r*1.6,r*1.2,-r*.8);ctx.stroke();if(!icon)glow(0,0,r*2,col,.4);break;}}
  return true;}
// --- скины 0.8.5 ---
function w85DrawSkin(id,t,sp,o,A,fl,edge){
  if(id==='shard85'){glow(-12,0,fl,'#ffd36b',.6);ctx.fillStyle='#14120a';ctx.strokeStyle=edge;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(19,0);ctx.lineTo(-11,-12);ctx.lineTo(-5,0);ctx.lineTo(-11,12);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(8,-2);ctx.lineTo(0,3);ctx.lineTo(-6,-4);ctx.moveTo(2,5);ctx.lineTo(-4,8);ctx.stroke();return true;}
  if(id==='serial013'){glow(-12,0,fl,'#ffd36b',.7);ctx.fillStyle='#2a2408';ctx.strokeStyle=edge;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(19,0);ctx.lineTo(-11,-12);ctx.lineTo(-5,0);ctx.lineTo(-11,12);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#14120a';for(const s of [-1,1]){ctx.fillRect(-9,s*8-1.5,5,3);}ctx.fillStyle=edge;ctx.font='700 5px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillText('013',3,2);return true;}
  if(id==='silence85'){ctx.fillStyle='#020306';ctx.strokeStyle='#3a4258';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(19,0);ctx.lineTo(-11,-12);ctx.lineTo(-5,0);ctx.lineTo(-11,12);ctx.closePath();ctx.fill();ctx.stroke();return true;}
  if(id==='callsign013'){const k=.5+.5*Math.sin(t*6);glow(-12,0,fl,'#6b8cff',.6);ctx.fillStyle='#0a1028';ctx.strokeStyle=edge;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(19,0);ctx.lineTo(-11,-12);ctx.lineTo(-5,0);ctx.lineTo(-11,12);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='rgba(159,184,255,'+(.4+.6*k).toFixed(2)+')';for(const [x,y] of [[-9,-9],[-9,9],[6,0]]){ctx.beginPath();ctx.arc(x,y,1.8,0,TAU);ctx.fill();}return true;}
  if(id==='carrier85'){glow(-12,0,fl,'#ffffff',.6);ctx.fillStyle='#e8eef8';ctx.strokeStyle=edge;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(19,0);ctx.lineTo(-11,-12);ctx.lineTo(-5,0);ctx.lineTo(-11,12);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle='#6b8cff';ctx.lineWidth=1.2;ctx.beginPath();for(let i=0;i<=20;i++){const x=-10+i*1.4;ctx.lineTo(x,Math.sin(i*.9+t*8)*2.2);}ctx.stroke();return true;}
  return false;}
// --- гибель босса: эффекты выбора ---
function dying85(b,dt){const fx=b.fx85;if(!fx)return;const t0=fx.t-dt;if(SBX[b.sbk]){if(SBX[b.sbk].dying)SBX[b.sbk].dying(b,dt,t0);return;}
  if(b.sbk==='lek'){if(fx.kind==='break'){if(t0<=0){for(let i=0;i<(SET.fx?160:40);i++){const a=rnd(0,TAU),v=rnd(80,520);part(b.fx+rnd(-170,170)*b.g.k,b.fy+rnd(-70,90)*b.g.k,Math.cos(a)*v,Math.sin(a)*v-120,rnd(.6,1.6),Math.random()<.6?C85.lek:'#14120a',rnd(2,5));}sfx('bigboom');shake(16);}G.bo80=Math.max(0,G.bo80-dt*1.2);}
    else{G.bo80=Math.max(.3,G.bo80-dt*.4);if(SET.fx&&Math.random()<.6)part(b.fx+rnd(-180,180)*b.g.k,b.fy+rnd(-60,80)*b.g.k,0,-40,.6,shipCol(),3);}}
  else{G.bo80=Math.max(0,G.bo80-dt*.35);if(fx.kind==='third'&&t0<=0&&G.shock.length<60)G.shock.push({x:b.cx,y:b.cy,r:20,R:Math.max(W,H)*1.2,t:0,col:'#ffffff',slow:true});
    if(fx.kind==='answer'&&SET.fx&&vR3()<.4)part(b.cx+vrnd3(-20,20),b.cy+vrnd3(-20,20),vrnd3(-60,60),vrnd3(-60,60),.8,shipCol(),2.5);}}
// --- звуки телеграфов (громче музыки) ---
function snd85(kind){if(!AU.ctx||!SET.sfx||!AU.sfx)return;const c=AU.ctx,t=c.currentTime;
  const tone=(f0,f1,dur,type,vol,delay)=>{delay=delay||0;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f0,t+delay);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+delay+dur);g.gain.setValueAtTime(0.0001,t+delay);g.gain.linearRampToValueAtTime(vol,t+delay+.01);g.gain.exponentialRampToValueAtTime(.0001,t+delay+dur);o.connect(g);g.connect(AU.sfx);o.start(t+delay);o.stop(t+delay+dur+.03);};
  const noise=(dur,vol,f,type,delay,f2)=>{delay=delay||0;const len=Math.max(1,c.sampleRate*dur|0),bf=c.createBuffer(1,len,c.sampleRate),d=bf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);const s=c.createBufferSource();s.buffer=bf;const fl=c.createBiquadFilter();fl.type=type||'lowpass';fl.frequency.setValueAtTime(f,t+delay);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+delay+dur);const g=c.createGain();g.gain.value=vol;s.connect(fl);fl.connect(g);g.connect(AU.sfx);s.start(t+delay);};
  switch(kind){
    case 'press0':noise(.7,.25,300,'lowpass',0,120);tone(140,70,.7,'sine',.14);break;
    case 'press':noise(.45,.7,500);tone(70,30,.5,'sine',.45);tone(1200,400,.08,'square',.04);break;
    case 'grab':for(let i=0;i<6;i++)tone(240+i*30,200+i*30,.04,'square',.05,i*.07);break;
    case 'siren':for(let i=0;i<3;i++){tone(660,660,.24,'triangle',.09,i*.5);tone(880,880,.24,'triangle',.09,i*.5+.25);}break;
    case 'salvo0':noise(.9,.35,380,'lowpass',0,900);tone(60,90,.9,'sawtooth',.06);break;
    case 'salvo':noise(.6,.6,700);tone(90,40,.6,'sine',.35);break;
    case 'open':tone(400,900,.25,'triangle',.1);tone(800,1800,.2,'sine',.05,.05);break;
    case 'scan':tone(1800,600,.6,'sine',.05);noise(.6,.08,3000,'bandpass');break;
    case 'weld':noise(.4,.12,4200,'highpass');break;
    case 'pult':tone(520,520,.08,'square',.06);tone(390,390,.12,'square',.06,.1);noise(.5,.2,600,'lowpass',.1,150);break;
    case 'stamp':tone(300,150,.12,'square',.06);break;
    case 'stop':for(let i=0;i<3;i++)noise(.3,.3,400,'lowpass',i*.6,100);tone(200,40,2.4,'sawtooth',.05);break;
    case 'ping':tone(1320,1290,.6,'sine',.11);tone(2640,2600,.3,'sine',.03);break;
    case 'emit':tone(900,1400,.12,'triangle',.05);break;
    case 'rec':tone(2000,2000,.02,'square',.07);tone(1200,1200,.03,'square',.06,.04);break;
    case 'play':tone(600,900,.3,'sine',.06);break;
    case 'rewind':tone(300,1800,.8,'sawtooth',.05);noise(.8,.18,2400,'highpass');break;
    case 'anchor':tone(110,110,.6,'triangle',.12);tone(165,165,.6,'triangle',.08,.15);break;
    case 'break':tone(880,220,.6,'triangle',.1);noise(.4,.3,2000,'bandpass');break;
    case 'inv':tone(300,600,1,'sine',.08);break;
    case 'absorb':tone(500,1000,.5,'sine',.06);break;
    case 'sos':{const S=[0,1,2,4,5.4,6.8,8.6,9.1,9.6];S.forEach((d,i)=>{const long=i>=3&&i<=5;tone(1046,1046,long?.38:.12,'sine',.07,d*.18+.1);});break;}
    case 'final':noise(1.2,.25,800,'lowpass',0,6000);tone(220,880,1.2,'sine',.06);break;}}
// --- музыка боёв: из темы сектора, слои по фазам ---
SC_.b31=Object.assign({},SC_.s6,{name:'Цех №0',chordT:[8,12],pad:['sawtooth',360,1000,.028],sub:.1,noise:['bandpass',1400,.012,.08],bell:['metal',10,16,.018],rev:.3,fight:1,boss:1,bpm:104,pulse:'q',toms:'boss',metal:1,mech:1,heavy:1,brass:.04,vol:.9,press85:1});
SC_.b31d=Object.assign({},SC_.s6d,{name:'Цех №0 · без света',fight:1,bpm:100,pulse:'q',toms:'fight',relay:1,mech:0,brass:0,vol:.85,furnace85:1});
SC_.b31e={name:'Цех №0 · линия стоит',root:41,v:[[0,7,14,17]],chordT:[30,30],pad:['triangle',300,600,.04],sub:.08,noise:['lowpass',300,.01,.03],bell:['metal',12,20,.014],rev:.55,vol:.7,bpm:96,end85:1};
SC_.b38=Object.assign({},SC_.s7,{name:'Колодец',chordT:[12,18],fight:1,bpm:60,pulse:'q',toms:'fight',brass:0,vol:.85,sos85:1});
SC_.b38s={name:'Колодец · тишина',root:36,v:[[0,12,19,24]],chordT:[30,30],pad:['sine',300,520,.012],sub:.05,noise:['lowpass',200,.004,.02],bell:null,rev:.7,vol:.55,bpm:60,heart85:1,sos85:1};
SECSC80.add('b31');SECSC80.add('b31d');SECSC80.add('b38');
function step85(P,t,st,bar){const S=P.sc,X=P.ext||{},root=S.root+(P.semi||0);if(!AU.ctx)return;
  if(S.press85&&st===8&&(X.ph85||1)>=1){evNoise(t,.12,.09,P.L.toms,'lowpass',260);ev(t,52,.4,'sine',.24,P.L.toms,.003,34);}
  if(S.press85&&X.siren85&&bar%8===0&&(st===0||st===8))ev(t,mtof(root+30),.7,'triangle',.022,P.L.fx,.05,mtof(root+33));
  if(S.furnace85&&st%4===0)evNoise(t,.5,.03,P.L.noise,'lowpass',160);
  if(S.end85&&st===0&&bar%4===0)for(const iv of [12,19,24])ev(t,mtof(root+iv),3.5,'triangle',.03,P.L.bell,.4);
  if(S.sos85&&!X.mute85){const ph=X.ph85||0,every=ph>=3?1:2;if(bar%every===0){const pat=[[0,.1],[1,.1],[2,.1],[4,.32],[6,.32],[8,.32],[11,.1],[12,.1],[13,.1]];for(const [s,d] of pat)if(st===s){ev(t,mtof(root+31+(X.fin85==='answer'?4:0)),d,'sine',.03,P.L.bell,.005);if(ph===2)ev(t+60/((S.bpm||60))*2,mtof(root+31),d,'sine',.012,P.L.bell,.005);}
      if(X.fin85==='third'&&st===15)ev(t,mtof(root+38),.6,'sine',.03,P.L.bell,.01);}}
  if(S.heart85&&(st===0||st===3))ev(t,56,.32,'sine',.22,P.L.toms,.004,38);}
function mus85(T){const X=G.x85,b=G.sb&&is85(G.sb)?G.sb:null;
  if(G.world&&G.state==='world'){if(T.id==='s6'&&storyFlag('line31')==='break')T.ext.mechOff=1;if(T.id==='s7'&&storyFlag('well38')==='silence')T.ext.choirOff=1;}
  if(!b||!inMission()||T.calm){if(X&&X.silence>0)T.duck=0;return T;}
  if(SBX[b.sbk]){if(SBX[b.sbk].music)SBX[b.sbk].music(b,T);}else if(b.sbk==='lek'){if(b.st==='fight'){T.id=b.phase>=3?'b31d':'b31';T.I=1;T.ext.ph85=b.phase;if(b.phase===2)T.ext.siren85=1;if(b.phase===3&&b.hp<=b.maxHp*.15)T.ext.bpmAdd=8;}
    else if(b.st==='scene'||b.st==='final'||b.st==='dying'){T.id='b31e';T.I=.2;T.ext.bpmAdd=b.st==='scene'?-Math.min(76,(b.scT||0)*19):-76;}}
  else{if(b.st==='enter'){T.id='b38s';T.I=0;T.ext.ph85=0;T.ext.mute85=1;}
    else if(b.st==='fight'){T.id=b.phase>=4?'b38s':'b38';T.I=b.phase>=4?0:.8+.05*b.phase;T.ext.ph85=b.phase;}
    else{T.id='b38s';T.I=0;T.ext.ph85=4;T.ext.fin85=b.choice||null;if(b.choice==='silence')T.ext.mute85=1;}}
  if(X&&X.rew>0){T.lp=700;T.ext.bpmAdd=(T.ext.bpmAdd||0)-30;}if(X&&X.silence>0)T.duck=0;
  return T;}
function fade85(a,b){const A=/^b(3[18]|42|46)/.test(a||''),B=/^b(3[18]|42|46)/.test(b||'');if(!A&&!B)return 0;if(A&&B)return 3;return B?2.5:6;}

