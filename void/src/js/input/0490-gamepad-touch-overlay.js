// ===== 0.6.0: геймпад =====
const PADB={};
function padTick(now){const gp=navigator.getGamepads?[...navigator.getGamepads()].find(g=>g&&g.connected):null;if(!gp){if(G.padOn){G.padOn=false;G.padX=G.padY=0;CHG.p=false;}return;}
  const ax=gp.axes[0]||0,ay=gp.axes[1]||0,l=Math.hypot(ax,ay),dz=.18;G.padOn=l>dz;if(G.padOn){const k=Math.min(1,(l-dz)/(1-dz))/l;G.padX=ax*k;G.padY=ay*k;}else G.padX=G.padY=0;
  const pr=i=>!!(gp.buttons[i]&&(gp.buttons[i].pressed||gp.buttons[i].value>.5));const edge=i=>{const v=pr(i),o=PADB[i];PADB[i]=v;return v&&!o;};
  const any=[0,1,2,3,9,12,13].some(i=>pr(i))||G.padOn;if(any)setInput('pad');
  CHG.p=pr(7)||pr(5);
  const st=G.state;
  if(st==='play'||st==='world'){if(edge(0))tryDash();if(edge(2))tryPulse();if(edge(9))pause();if(st==='world'&&edge(3))openMap();if(st==='world'&&edge(1)&&G.card)cardAct('main');return;}
  if(st==='map'&&(edge(3)||edge(1))){closeMap();return;}
  if(st==='pause'&&edge(9)){resume();return;}
  if(edge(1)){escAction();return;}
  const sc=G.scrId&&$('#'+G.scrId);if(!sc)return;const bt=[...sc.querySelectorAll('button:not([disabled]),.card')].filter(b=>b.offsetParent!==null&&getComputedStyle(b).visibility!=='hidden');if(!bt.length)return;
  let i=bt.indexOf(document.activeElement);if(edge(13)){i=(i+1)%bt.length;bt[i].focus();}if(edge(12)){i=(i-1+bt.length)%bt.length;bt[i].focus();}
  if(edge(0)){if(i<0){bt[0].focus();}else bt[i].click();}}
addEventListener('gamepadconnected',()=>setInput('pad'));
// ===== 0.6.0: обучение на касаниях (миссии 1–2) =====
function tutTick(){if(!touchMode||!isMob()||G.state!=='play'||G.mode!=='world'||!G.player||G.m>2)return;const T=G.tut||(G.tut={});const p=G.player;
  if(!T['s'+G.m]){T['s'+G.m]=1;floater(p.x,p.y-46,G.m===1?'ВЕДИТЕ КОРАБЛЬ СТИКОМ СЛЕВА':'РЫВОК — УВОРОТ · КНОПКА ИЛИ СВАЙП ВПРАВО','#8fe9ff');}
  if(!T.en&&p.en>=100){T.en=1;floater(p.x,p.y-46,'ИМП ГОТОВ · КНОПКА СПРАВА','#ffb84d');}}
// ===== 0.6.0: экранный слой для телефона =====
function drawArenaEdge(p,t){const m=120,near=Math.min(p.x,p.y,W-p.x,H-p.y);if(near>m*2.2)return;const a=clamp(1-(near-m*.4)/(m*1.8),0,1)*.55;
  ctx.save();ctx.strokeStyle='#8fe9ff';ctx.globalAlpha=a;ctx.lineWidth=2/SC;ctx.setLineDash([10/SC,8/SC]);ctx.strokeRect(2,2,W-4,H-4);ctx.setLineDash([]);ctx.restore();}
function edgePt(X,Y,x0,y0,x1,y1){const cx=(x0+x1)/2,cy=(y0+y1)/2,dx=X-cx,dy=Y-cy;let k=1e9;
  if(dx)k=Math.min(k,((dx>0?x1:x0)-cx)/dx);if(dy)k=Math.min(k,((dy>0?y1:y0)-cy)/dy);k=Math.min(1,k);return [cx+dx*k,cy+dy*k,Math.atan2(dy,dx)];}
function edgeArrow(x,y,col,size,label){const X=(x-CX)*SC,Y=(y-CY)*SC;if(X>=-4&&X<=CW+4&&Y>=-4&&Y<=CH+4)return false;
  let [ex,ey,a]=edgePt(X,Y,SAFE.l+26,SAFE.t+74,CW-SAFE.r-26,CH-SAFE.b-26);
  if(ex>CW-SAFE.r-130&&ey<SAFE.t+176)ey=SAFE.t+176;
  for(let n=0;n<2;n++)for(const k in TBR){const b=TBR[k];if(Math.hypot(ex-b.x,ey-b.y)<b.r+22){if(Math.abs(ex-b.x)>Math.abs(ey-b.y)&&ey<b.y)ey=b.y-b.r-24;else if(ex>CW/2)ex=b.x-b.r-24;else ex=b.x+b.r+24;}}
  ctx.save();ctx.translate(ex,ey);ctx.rotate(a);ctx.fillStyle=col;ctx.strokeStyle='#04060c';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(size,0);ctx.lineTo(-size*.6,-size*.7);ctx.lineTo(-size*.25,0);ctx.lineTo(-size*.6,size*.7);ctx.closePath();ctx.stroke();ctx.fill();ctx.restore();
  if(label){ctx.font='700 12px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillStyle='#04060c';const lw=ctx.measureText(label).width/2+10,rx=ex-Math.cos(a)*30,lx=clamp(rx,SAFE.l+lw,CW-SAFE.r-lw),ly0=ey-Math.sin(a)*22+4,ly=clamp(Math.abs(lx-ex)<lw+6&&Math.abs(ly0-4-ey)<16?ey+(ey<CH/2?28:-18):ly0,SAFE.t+70,CH-SAFE.b-10);ctx.lineJoin='round';ctx.lineWidth=4;ctx.strokeStyle='rgba(4,6,12,.92)';ctx.strokeText(label,lx,ly);ctx.fillStyle=col;ctx.fillText(label,lx,ly);}
  return true;}
function mobOverlay(now){if(!isMob())return;const p=G.player;if(!p||!(G.state==='play'||G.state==='world'||G.state==='pause'||G.state==='levelup'))return;
  const t=now/1000;ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=1;
  const PX=(p.x-CX)*SC,PY=(p.y-CY)*SC;
  if(!G.world&&G.arena){// угрозы и цели за кадром
    const list=[];for(const e of G.enemies){if(!e.alive||e.spawnT>0||e.ghost||e.type==='mine'||EDEF[e.type]&&EDEF[e.type].passive)continue;
      const d=Math.hypot(e.x-p.x,e.y-p.y);if(d>VW*.95)continue;const X=(e.x-CX)*SC,Y=(e.y-CY)*SC;if(X>=0&&X<=CW&&Y>=0&&Y<=CH)continue;
      const v=(e.vx||0)*(p.x-e.x)+(e.vy||0)*(p.y-e.y);if(v<0&&d>VW*.5)continue;list.push([d,e]);}
    list.sort((a,b)=>a[0]-b[0]);if((curDiff().rank||0)===0)for(const [d,e] of list.slice(0,6))edgeArrow(e.x,e.y,EDEF[e.type].col||'#ff4f6e',8+6*(1-d/VW),'');
    const B=G.sb&&G.sb.alive?G.sb:G.boss&&G.boss.alive?G.boss:G.jam&&G.jam.alive?G.jam:null;if(B)edgeArrow(B.x,B.y,'#ff6b8a',14,'БОСС');
    if(G.bc)edgeArrow(G.bc.x,G.bc.y,'#ffb84d',13,'МАЯК');}
  if(p.hp>0&&touchMode){// ореол корабля: где я и когда рывок
    const R=22;ctx.globalAlpha=.22;ctx.strokeStyle='#cfeeff';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(PX,PY,R,0,TAU);ctx.stroke();
    if(p.dashCd>0){const f=1-p.dashCd/(p.dashCdMax||G.st.dashCd||1);ctx.globalAlpha=.6;ctx.strokeStyle='#8fe9ff';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(PX,PY,R,-Math.PI/2,-Math.PI/2+TAU*f);ctx.stroke();}
    ctx.globalAlpha=1;
    const C=G.combo;if(typeof comboOn==='function'&&comboOn()&&C&&C.n>1){ctx.font='700 14px "JetBrains Mono",monospace';ctx.textAlign='center';const s_='×'+C.mul.toFixed(2).replace('.',',');ctx.fillStyle='#04060c';ctx.fillText(s_,PX+1,PY-R-9);ctx.fillStyle='#ffb84d';ctx.fillText(s_,PX,PY-R-10);}}
  if(G.resumeK>0){const k=G.resumeK/1.2,b=Math.floor(G.resumeK/.4);ctx.globalAlpha=(b%2?.45:.9);ctx.strokeStyle='#8fe9ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(PX,PY,30+k*30,0,TAU);ctx.stroke();
    ctx.font='700 16px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillStyle='#8fe9ff';ctx.fillText(String(Math.ceil(G.resumeK/.4)),PX,PY-48);ctx.globalAlpha=1;}
}
