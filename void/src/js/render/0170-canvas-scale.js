// ---------- Холст и масштаб ----------
const cv=$('#cv');let ctx=cv.getContext('2d');
let DPR=1,SC=1,W=900,H=600,CW=900,CH=600;
let BW=900,BH=600,CX=0,CY=0,VW=900,VH=600,BMIN=0;
let nebula=null,stars=[],darkC=null,dctx=null;
// 0.6.0: видимый мир и разрешение рендера разделены. ПК — 760 единиц на короткую сторону (как раньше), телефон — 560, планшет — 680.
function viewS(){return G.ff==='desk'?760:G.ff==='tablet'?680:560;}
function zoomK(){return (isMob()?(SET.zoom||1):1)*(G.camZ||1);}
function applyWH(){if(G.arena&&!G.world){W=G.arena.w;H=G.arena.h;}else{W=VW;H=VH;}}
function setScale(){SC=Math.max(.42,Math.min(CW,CH)/(viewS()*zoomK()));VW=CW/SC;VH=CH/SC;applyWH();BMIN=isMob()?2.2/SC:0;}
function dprCap(){const q=G.q,cap=q>=2?2:q===1?1.5:1;return Math.min(cap,Math.sqrt(2.2e6/Math.max(1,CW*CH)));}
let rsW=0,rsH=0;
function resize(){
  ffUpdate();CW=window.innerWidth;CH=window.innerHeight;DPR=Math.min(isMob()?dprCap():2,window.devicePixelRatio||1);
  cv.width=Math.round(CW*DPR);cv.height=Math.round(CH*DPR);
  setScale();
  // туманность и звёзды — только при заметной смене размера (адресная строка дёргает resize десятки раз), на ПК — как раньше
  if(!isMob()||Math.abs(CW-rsW)>64||Math.abs(CH-rsH)>64||!nebula||(CW>CH)!==(rsW>rsH)){rsW=CW;rsH=CH;buildNebula();buildStars();}
  if(G.player&&!G.world&&!G.arena){G.player.x=clamp(G.player.x,20,W-20);G.player.y=clamp(G.player.y,20,H-20);}
  if(G.bc&&!G.arena)layoutBeacon();
  if(G.world&&G.player)camSnap();
  if(G.arena&&!G.world&&G.player){G.camSnap=1;missionCam(0);}
  if(typeof layoutTouch==='function')layoutTouch();
}
// арена миссии на телефоне и планшете: 1280×760, длинной стороной вдоль длинной стороны экрана; на ПК арена = экран
function lockArena(){if(!isMob()){G.arena=null;applyWH();return;}G.arena=CW>=CH?{w:1280,h:760}:{w:760,h:1280};applyWH();}
function unlockArena(){G.arena=null;applyWH();}
function missionCam(dt){
  if(!G.arena){CX=0;CY=0;return;}
  const p=G.player;if(!p){CX=(W-VW)/2;CY=(H-VH)/2;return;}
  const off=isPortrait()?.12:.06;let tx=p.x+(p.vx||0)*.35-VW/2,ty=p.y+(p.vy||0)*.35-VH/2+VH*off;
  if(G.bc){tx=tx*.7+(G.bc.x-VW/2)*.3;ty=ty*.7+(G.bc.y-VH/2)*.3;}
  const fx=W>VW?clamp(tx,0,W-VW):(W-VW)/2,fy=H>VH?clamp(ty,0,H-VH):(H-VH)/2;
  const k=G.camSnap||!(dt>0)?1:Math.min(1,dt*6);G.camSnap=0;CX+=(fx-CX)*k;CY+=(fy-CY)*k;}
function buildNebula(){
  const c=document.createElement('canvas');c.width=Math.max(2,CW*DPR/2|0);c.height=Math.max(2,CH*DPR/2|0);const g=c.getContext('2d');
  g.fillStyle='#04060c';g.fillRect(0,0,c.width,c.height);
  const blobs=[['rgba(70,40,140,',.22],['rgba(20,80,130,',.2],['rgba(120,30,70,',.1],['rgba(30,110,140,',.12]];
  for(let i=0;i<7;i++){const [col,a]=blobs[i%blobs.length];const x=Math.random()*c.width,y=Math.random()*c.height,r=rnd(.3,.75)*Math.max(c.width,c.height);
    const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,col+a+')');gr.addColorStop(1,col+'0)');g.fillStyle=gr;g.fillRect(0,0,c.width,c.height);}
  nebula=c;
}
function buildStars(){
  stars=[];const n=Math.round(W*H/2600);
  for(let i=0;i<n;i++){const l=Math.random();stars.push({x:Math.random()*W*1.2-W*.1,y:Math.random()*H*1.2-H*.1,k:l<.6?.02:l<.9?.05:.1,s:l<.6?.8:l<.9?1.3:2,tw:Math.random()*TAU});}
}
const glowCache={};
function glowSprite(col){
  if(glowCache[col])return glowCache[col];const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');
  const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,col);gr.addColorStop(.35,col+'66');gr.addColorStop(1,col+'00');g.fillStyle=gr;g.fillRect(0,0,64,64);
  return glowCache[col]=c;
}
function glow(x,y,r,col,a=1){if((!SET.fx||G.lowFx)&&r>30||GLOWMAX&&r>GLOWMAX)return;const ga=ctx.globalAlpha;ctx.globalAlpha=ga*a;ctx.drawImage(glowSprite(col),x-r,y-r,r*2,r*2);ctx.globalAlpha=ga;}

