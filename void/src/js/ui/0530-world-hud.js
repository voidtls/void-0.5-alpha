// ---- HUD мира ----
let miniT=0;
function updateWorldHUD(){
  const p=G.player,st=G.st,S=G.save;if(!p||!S)return;
  setT('hpT',Math.ceil(p.hp)+'/'+st.maxHp);setS('hpB',(p.hp/st.maxHp).toFixed(3));
  setS('enB',(p.en/100).toFixed(3));setC('enBar','full',p.en>=100);
  setT('wSec',sectorName(p.x,p.y));{const v=lomH(S.lom,1)+(S.carry?` <span style="font-size:13px;color:var(--amber)">+${fmtN(S.carry)}</span>`:'');if(hudCache.wLom!==v){hudCache.wLom=v;$('#wLom').innerHTML=v;}}
  let sub='';
  if(G.anom){const A=G.anom;sub=A.a.hud?A.a.hud():'АНОМАЛИЯ · '+A.a.name+' · '+Math.max(0,Math.ceil(A.dur-A.t))+' С'+(A.a.kind==='cells'||A.a.kind==='coldcore'?' · '+A.got+'/'+A.need:'');}
  setT('wSub',hudClean(sub));setC('hud0','subimp',!!G.anom);if(typeof zbHud==='function')zbHud();
  hudEls.score.firstChild.nodeValue=fmt(G.score);
  const blocked=dashBlocked();const dr=p.dashCd<=0&&!blocked;
  setT('dashC','РЫВОК');setF('dashC',p.dashCd>0?1-p.dashCd/(p.dashCdMax||st.dashCd||1):0);setC('dashC','ok',dr);setC('dashC','bad',false);setC('tDash','cd',!dr);
  const pr=p.en>=100;setT('pulseC',pr?'ИМПУЛЬС [E]':'ИМПУЛЬС');setF('pulseC',pr?0:p.en/100);setC('pulseC','ok',pr);setC('tPulse','cd',!pr);
  setH('cargoC',true);
  setT('lvC','ЩИТ');setH('lvC',!st.shieldCd);setC('lvC','ok',!!(st.shieldCd&&p.shieldUp));setS('xpB',(G.xp/G.need).toFixed(3));
  chargeChip();
  {const I=G.riftI||0,hd=$('#hud');if(I>=.7&&SET.fx){hd.style.transform=vR5()<.25?`translate(${vrnd5(-4,4).toFixed(1)}px,${vrnd5(-2,2).toFixed(1)}px)`:'';hd.style.opacity=vR5()<.12?'.55':'1';if(vR5()<.08){hudEls.wLom&&(hudCache.wLom=null);$('#wLom').textContent='▒░▒ ░▒▒';hudCache.wLom='glitch';}}
    else if(hd.style.transform||hd.style.opacity){hd.style.transform='';hd.style.opacity='';}}
  if(++miniT%(isMob()?[4,2,1][G.q]||2:2)===0)drawMini();
}
$('#mini').addEventListener('click',()=>{if(G.state==='world'&&isMob())openMap();});
function drawMini(){
  const c=$('#mini');if(!c)return;if(typeof zbMini==='function'&&zbMini())return;const g=c.getContext('2d'),s=c.width,R=2600,k=s/2/R,p=G.player,S=G.save;
  g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,s,s);g.save();g.beginPath();g.arc(s/2,s/2,s/2-1,0,TAU);g.clip();
  g.fillStyle='rgba(4,6,12,.85)';g.fillRect(0,0,s,s);
  const P=(x,y)=>[s/2+(x-p.x)*k,s/2+(y-p.y)*k];
  if(!gateOpen()/* ВРЕМЕННО (альфа 0.5.9) */&&p.y>OY-2600){const [gx]=P(5000,0);g.strokeStyle='rgba(180,140,255,.5)';g.setLineDash([3,3]);g.beginPath();g.moveTo(gx,0);g.lineTo(gx,s);g.stroke();g.setLineDash([]);}
  for(const r of G.rocks){const [x,y]=P(r.x,r.y);g.fillStyle='#26324a';g.fillRect(x-1,y-1,2,2);}
  WORLD.nodes.forEach(n=>{const [x,y]=P(n.x,n.y);const st=nodeState(n.m);g.fillStyle=n.boss&&st!=='done'?'#ff6b8a':st==='done'?'#8fe9ff':st==='open'?'#ffb84d':'#3a4558';g.beginPath();g.arc(x,y,st==='open'?6:4,0,TAU);g.fill();});
  WORLD.shops.forEach(sh=>{const [x,y]=P(sh.x,sh.y);g.fillStyle='#ffb84d';g.fillRect(x-4,y-4,8,8);});
  {const [x,y]=P(WORLD.hangar.x,WORLD.hangar.y);g.save();g.translate(x,y);g.rotate(Math.PI/4);g.fillStyle='#ff6bd0';g.fillRect(-4,-4,8,8);g.restore();}
  {const [x,y]=P(WORLD.arsenal.x,WORLD.arsenal.y);g.fillStyle=arsOpen()?'#9fe3ff':'#3a5a74';g.beginPath();g.arc(x,y,4,0,TAU);g.fill();}
  WORLD.anomalies.forEach(a=>{if(S.anomalies[a.id])return;const [x,y]=P(a.x,a.y);g.strokeStyle='#c9a6ff';g.beginPath();g.arc(x,y,5,0,TAU);g.stroke();});
  WORLD.relays.forEach(r=>{const [x,y]=P(r.x,r.y);g.fillStyle=S.relays[r.id]?'#8fe9ff':'#ff4f6e';g.fillRect(x-3,y-3,6,6);});
  if(abyssOpen()){const [x,y]=P(WORLD.abyss.x,WORLD.abyss.y);g.fillStyle='#c9a6ff';g.font='700 13px "JetBrains Mono",monospace';g.textAlign='center';g.fillText('∞',x,y+4);}
  if(perk('scan')){WORLD.caches.forEach(c=>{if(S.found[c.id]||Math.hypot(c.x-p.x,c.y-p.y)>1600)return;const [x,y]=P(c.x,c.y);g.strokeStyle='#ffb84d';g.lineWidth=1.5;g.strokeRect(x-3,y-3,6,6);});
    WORLD.journals.forEach(j=>{if(S.journals[j.id]||Math.hypot(j.x-p.x,j.y-p.y)>1600)return;const [x,y]=P(j.x,j.y);g.strokeStyle='#8fe9ff';g.lineWidth=1.5;g.beginPath();g.arc(x,y,3,0,TAU);g.stroke();});}
  if(G.unk&&G.unk.length){g.font='700 10px "JetBrains Mono",monospace';g.textAlign='center';g.fillStyle='#ff4f6e';for(const u of G.unk){if(u.x===undefined)continue;let [x,y]=P(u.x,u.y);const dx=x-s/2,dy=y-s/2,dl=Math.hypot(dx,dy),mr=s/2-8;if(dl>mr){x=s/2+dx/dl*mr;y=s/2+dy/dl*mr;}g.globalAlpha=.6+.4*Math.sin(G.t*10);g.fillText('?',x,y+3);g.globalAlpha=1;}}
  if((G.riftI||0)>.05){g.globalAlpha=Math.min(.6,G.riftI*.7);for(let i=0;i<40;i++){g.fillStyle=vR5()<.5?'#ff4f6e':'#9fb0c4';g.fillRect(vR5()*s,vR5()*s,2,1);}g.globalAlpha=1;}
  if(S.lost){const [x,y]=P(S.lost.x,S.lost.y);g.fillStyle='#ff4f6e';g.beginPath();g.arc(x,y,4,0,TAU);g.fill();}
  if(G.course){let [x,y]=P(G.course.x,G.course.y);const dx=x-s/2,dy=y-s/2,dl=Math.hypot(dx,dy),mr=s/2-6;if(dl>mr){x=s/2+dx/dl*mr;y=s/2+dy/dl*mr;}g.strokeStyle='rgba(143,233,255,.7)';g.lineWidth=2;g.setLineDash([4,4]);g.beginPath();g.moveTo(s/2,s/2);g.lineTo(x,y);g.stroke();g.setLineDash([]);}
  STORY_FRAGS.forEach(f=>{if(!fragAvail(f))return;const q=fragPos(f);if(Math.hypot(q.x-p.x,q.y-p.y)>1600)return;const [x,y]=P(q.x,q.y);g.fillStyle='#ffffff';g.fillRect(x-2,y-2,4,4);});
  WORLD.journals.forEach(j=>{if(S.journals[j.id]||Math.hypot(j.x-p.x,j.y-p.y)>1600||perk('scan'))return;const [x,y]=P(j.x,j.y);g.strokeStyle='rgba(143,233,255,.6)';g.lineWidth=1;g.beginPath();g.arc(x,y,3,0,TAU);g.stroke();});
  mini95(g,P,s);
  for(const e of G.enemies){if(!e.alive||e.type==='mine')continue;const [x,y]=P(e.x,e.y);g.fillStyle=e.type==='lock'?'#b48cff':'#ff4f6e';g.fillRect(x-2,y-2,4,4);}
  if(!openAllNow()){const fx=fogSeeX();if(fx<Infinity){const [gx]=P(fx,0);if(gx<s+30){const gr=g.createLinearGradient(gx-26,0,gx+4,0);gr.addColorStop(0,'rgba(3,5,11,0)');gr.addColorStop(1,'rgba(3,5,11,.95)');g.fillStyle=gr;g.fillRect(Math.max(0,gx-26),0,s,s);}}}
  g.translate(s/2,s/2);g.rotate(p.ang);g.fillStyle=shipCol();g.beginPath();g.moveTo(8,0);g.lineTo(-5,-5);g.lineTo(-3,0);g.lineTo(-5,5);g.closePath();g.fill();
  g.restore();g.strokeStyle='#1c2a42';g.lineWidth=2;g.beginPath();g.arc(s/2,s/2,s/2-1,0,TAU);g.stroke();
}
function nextTarget(){const S=G.save;if(S.cleared>=CORE){const n=WORLD.nodes.find(q=>q.m>CORE&&nodeState(q.m)!=='done');return n?{x:n.x,y:n.y,label:(n.boss?'БОСС ':'МИССИЯ ')+pad2(n.m),col:n.boss?'#ff6b8a':'#ffb84d'}:null;}if(S.cleared>=6&&!S.gate)return{x:WORLD.gate.x,y:WORLD.gate.y,label:'ВОРОТА',col:'#b48cff'};const n=WORLD.nodes[S.cleared];return{x:n.x,y:n.y,label:'МИССИЯ '+pad2(n.m),col:'#ffb84d'};}

