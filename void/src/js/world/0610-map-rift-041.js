// ---- карта «Туманность» (0.4.1): кэши в мировых координатах, гиперлинии, подписи без столкновений ----
const MAPC={sc:1/50,neb:null,rift:null,fog:null,fogVer:-1,stars:null,segs:null,spr:null,edge:null,noise:null,cycle:-1};
const hexA=(h,a)=>{const n=parseInt(h.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;};
function secOfNode(n){return n.sec!==undefined?n.sec:sectorIdx(n.x,n.y);}
function mapStars(){if(MAPC.stars)return MAPC.stars;const R=mulberry(77),a=[];for(let i=0;i<600;i++)a.push({x:R(),y:R(),l:i%3,s:R()*1.3+.4,tw:R()*TAU,b:R()<.025});return MAPC.stars=a;}
function mapNeb(){if(MAPC.neb)return MAPC.neb;const sc=MAPC.sc,c=document.createElement('canvas');c.width=Math.ceil(WW*sc);c.height=Math.ceil(WH*sc);const g=c.getContext('2d');g.globalCompositeOperation='lighter';
  WORLD.sectors.forEach((S_,i)=>{const R=mulberry(500+i*31),b=S_.box,n=6+(i%5);for(let k=0;k<n;k++){const x=b[0]+(b[2]-b[0])*(.12+.76*R()),y=b[1]+(b[3]-b[1])*(.12+.76*R()),r=Math.min(b[2]-b[0],b[3]-b[1])*(.38+.42*R());
    const gr=g.createRadialGradient(x*sc,y*sc,0,x*sc,y*sc,r*sc),a=.1+.12*R();gr.addColorStop(0,hexA(S_.col,a));gr.addColorStop(.6,hexA(S_.col,a*.45));gr.addColorStop(1,hexA(S_.col,0));g.fillStyle=gr;g.beginPath();g.arc(x*sc,y*sc,r*sc,0,TAU);g.fill();}});
  return MAPC.neb=c;}
function mapRift(){const sh=riftShift(),er=Math.floor(erosion()*20)/20,key=sh+'|'+er;if(MAPC.rift&&MAPC.riftKey===key)return MAPC.rift;MAPC.riftKey=key;
  const st=100,W_=Math.ceil(WW/st),H_=Math.ceil(WH/st),c=document.createElement('canvas');c.width=W_;c.height=H_;const g=c.getContext('2d'),im=g.createImageData(W_,H_),Rn=mulberry(913),Rb=mulberry(4711);
  const bd=(x,y)=>{let best=1e9;for(const S_ of WORLD.sectors){const b=S_.box,dx=Math.max(b[0]-x,0,x-b[2]),dy=Math.max(b[1]-y,0,y-b[3]),d=Math.hypot(dx,dy);if(d<best)best=d;}return best;};
  const reach=sh+er*250+50;
  for(let j=0;j<H_;j++)for(let i=0;i<W_;i++){const x=(i+.5)*st,y=(j+.5)*st;let d=bd(x,y);const bite=Rb();
    if(d===0&&reach>50){const si=sectorIdx(x,y),b=WORLD.sectors[si].box,own=Math.min(x-b[0],b[2]-x,y-b[1],b[3]-y);if(own<reach+200)d=riftInfo(x,y).d;else d=-own;}
    d+=sh+(d<=0?er*250*bite:0);const q=smooth(0,900,d),n=Rn(),o=(j*W_+i)*4;
    const sp=n<.07*q;im.data[o]=sp?(Rn()<.5?255:180):7+18*q*n;im.data[o+1]=sp?(Rn()<.5?79:140):4;im.data[o+2]=sp?(Rn()<.5?110:255):13+22*q*n;im.data[o+3]=Math.round(255*q*(sp?.55:.82));}
  g.putImageData(im,0,0);const c2=document.createElement('canvas'),sc=MAPC.sc;c2.width=Math.ceil(WW*sc);c2.height=Math.ceil(WH*sc);const g2=c2.getContext('2d');g2.imageSmoothingEnabled=true;g2.filter='blur(1.5px)';g2.drawImage(c,0,0,c2.width,c2.height);g2.filter='none';
  return MAPC.rift=c2;}
function fogSprite(){if(MAPC.spr)return MAPC.spr;const s=64,c=document.createElement('canvas');c.width=c.height=s;const g=c.getContext('2d'),gr=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.55,'rgba(0,0,0,.92)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,s,s);return MAPC.spr=c;}
function mapFog(){const fk=fogMemo().k;if(MAPC.fog&&MAPC.fogVer===G.fogVer&&MAPC.fogK===fk)return MAPC.fog;const sc=MAPC.sc,W_=Math.ceil(WW*sc),H_=Math.ceil(WH*sc),c=document.createElement('canvas');c.width=W_;c.height=H_;const g=c.getContext('2d');
  g.fillStyle='rgba(2,3,8,.94)';g.fillRect(0,0,W_,H_);g.globalCompositeOperation='destination-out';const sp=fogSprite(),rr=FOG*1.6*sc;
  for(let j=0;j<FGH;j++)for(let i=0;i<FGW;i++)if(G.fog[j*FGW+i]&&!fogClosedAt((i+.5)*FOG,(j+.5)*FOG)){const x=(i+.5)*FOG*sc,y=(j+.5)*FOG*sc;g.drawImage(sp,x-rr,y-rr,rr*2,rr*2);}
  const c2=document.createElement('canvas');c2.width=W_;c2.height=H_;const g2=c2.getContext('2d');g2.filter='blur(2px)';g2.drawImage(c,0,0);g2.filter='none';
  MAPC.fog=c2;MAPC.fogVer=G.fogVer;MAPC.fogK=fk;return c2;}
// 1.0.0 α: карта — всё скрытое (неисследованное, закрытые туманом войны сектора, Разлом вне секторов) выглядит как один и тот же
// космос за краем мира: фон и звёзды. Видимость считается полем на сетке 200 ед., размывается в коде (три прохода коробки по осям,
// σ ≈ 700 ед.) и сглаживается S-кривой — переходы очень плавные на любом устройстве, без ctx.filter.
const MAPH={R:200,P:8};
function mapHide(){const F=fogMemo(),key=(G.fogVer||0)+'|'+F.k;if(MAPC.hide&&MAPC.hideK===key)return MAPC.hide;
  const R=MAPH.R,P=MAPH.P,gw=Math.ceil(WW/R)+2*P,gh=Math.ceil(WH/R)+2*P,n=gw*gh,v=new Float32Array(n),u=new Float32Array(n);
  // cv — закрытые туманом войны сектора: их край гаснет целиком на открытой стороне (за границей ничего не просвечивает)
  const cv=new Float32Array(n),oa=openAllNow();
  for(let j=0;j<gh;j++)for(let i=0;i<gw;i++){const x=(i-P+.5)*R,y=(j-P+.5)*R,q=j*gw+i;
    if(!oa&&fogClosedAt(clamp(x,0,WW),clamp(y,0,WH)))cv[q]=1;if(j>=P&&j<gh-P&&i>=P&&i<gw-P)v[q]=inSectors(x,y)&&revealedAt(x,y)?1:0;}
  const r=3,blur=(a,b,hz)=>{const Ln=hz?gw:gh,M=hz?gh:gw,at=(m,q)=>{q=q<0?0:q>=Ln?Ln-1:q;return hz?a[m*gw+q]:a[q*gw+m];};
    for(let m=0;m<M;m++){let s=0;for(let q=-r;q<=r;q++)s+=at(m,q);for(let q=0;q<Ln;q++){b[hz?m*gw+q:q*gw+m]=s/(2*r+1);s+=at(m,q+r+1)-at(m,q-r);}}};
  for(let k=0;k<3;k++){blur(v,u,true);blur(u,v,false);}
  if(!oa)for(let k=0;k<3;k++){blur(cv,u,true);blur(u,cv,false);}
  const c=document.createElement('canvas');c.width=gw;c.height=gh;const g=c.getContext('2d'),im=g.createImageData(gw,gh),d=im.data;
  for(let q=0;q<n;q++){let a=(v[q]-.06)/(.82-.06);a=a<0?0:a>1?1:a;a=a*a*(3-2*a);
    // к краю мира видимость гаснет плавно: туманности за краем нет, обрыва быть не должно
    const x=((q%gw)-P+.5)*R,y=(Math.floor(q/gw)-P+.5)*R;let f=Math.min(x,WW-x,y,WH-y)/1100;f=f<0?0:f>1?1:f;f=f*f*(3-2*f);a*=f;
    let e=1-(cv[q]-.015)/(.5-.015);e=e<0?0:e>1?1:e;a*=e*e*(3-2*e);
    d[q*4+3]=Math.round((1-a)*255);}
  g.putImageData(im,0,0);MAPC.hide=c;MAPC.hideK=key;MAPC.hideDark=null;return c;}
function mapHideTint(){return mapHideDark();}
function mapHideDark(){const hm=mapHide();if(MAPC.hideDark)return MAPC.hideDark;const c=document.createElement('canvas');c.width=hm.width;c.height=hm.height;const g=c.getContext('2d');
  g.fillStyle=MAP_BG;g.fillRect(0,0,c.width,c.height);g.globalCompositeOperation='destination-in';g.imageSmoothingEnabled=true;g.drawImage(hm,0,0);MAPC.hideDark=c;return c;}
// поверх содержимого карты — скрытое закрывается цветом фона (одна растянутая маска), затем звёзды и мягкая виньетка поверх всего
function mapSpace(g,X,Y,k,w,h,t,fx,V_){const pd=MAPH.P*MAPH.R;g.save();g.globalAlpha=1;g.globalCompositeOperation='source-over';g.imageSmoothingEnabled=true;
  g.drawImage(mapHideTint(),X(-pd),Y(-pd),(WW+2*pd)*k,(WH+2*pd)*k);g.restore();
  mapStarsDraw(g,w,h,k,V_,fx,t);g.globalAlpha=1;
  const vg=g.createRadialGradient(w/2,h/2,Math.min(w,h)*.25,w/2,h/2,Math.max(w,h)*.78);vg.addColorStop(0,'rgba(1,2,6,0)');vg.addColorStop(1,'rgba(1,2,6,.5)');g.fillStyle=vg;g.fillRect(0,0,w,h);}
function mapSegs(){if(MAPC.segs)return MAPC.segs;const N=WORLD.nodes,segs=[];
  for(let i=0;i<N.length-1;i++){const p0=N[i-1]||N[i],p1=N[i],p2=N[i+1],p3=N[i+2]||p2,pts=[];
    for(let k=0;k<=14;k++){const t=k/14,t2=t*t,t3=t2*t,f=(a,b,c,d)=>.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t2+(-a+3*b-3*c+d)*t3);pts.push([f(p0.x,p1.x,p2.x,p3.x),f(p0.y,p1.y,p2.y,p3.y)]);}
    const s1=secOfNode(p1),s2=secOfNode(p2);let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const [x,y] of pts){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
    segs.push({a:p1,b:p2,pts,cross:s1!==s2,c1:WORLD.sectors[s1].col,c2:WORLD.sectors[s2].col,bb:[x0,y0,x1,y1]});}
  return MAPC.segs=segs;}
// значки (общие для карты и легенды)
function mapIcon(g,kind,x,y,o){o=o||{};const t=o.t||0;g.save();g.translate(x,y);g.lineWidth=1.5;const glowC=(c,r)=>{const gr=g.createRadialGradient(0,0,0,0,0,r);gr.addColorStop(0,hexA(c,.35));gr.addColorStop(1,hexA(c,0));g.fillStyle=gr;g.beginPath();g.arc(0,0,r,0,TAU);g.fill();};
  if(w58MapIcon(g,kind,o,t)||w74MapIcon(g,kind,o,t)||w80MapIcon(g,kind,o,t)){g.restore();return;}
  switch(kind){
    case 'open':glowC('#ffb84d',14);g.fillStyle='#ffb84d';g.beginPath();g.arc(0,0,4,0,TAU);g.fill();g.strokeStyle='#ffb84d';g.beginPath();g.arc(0,0,7,t*2,t*2+4.4);g.stroke();break;
    case 'done':glowC('#8fe9ff',12);g.fillStyle='#8fe9ff';g.beginPath();g.arc(0,0,4.5,0,TAU);g.fill();g.strokeStyle='rgba(143,233,255,.5)';g.beginPath();g.arc(0,0,7,0,TAU);g.stroke();
      if(o.md!==undefined)for(let i=0;i<4;i++){const a=Math.PI/2+(i-1.5)*.42;g.fillStyle=i<o.md?(i===3?'#b48cff':'#ffb84d'):'#26324a';g.beginPath();g.arc(Math.cos(a)*11,Math.sin(a)*11,1.6,0,TAU);g.fill();}break;
    case 'locked':g.fillStyle='#3a4558';g.beginPath();g.arc(0,0,4,0,TAU);g.fill();g.strokeStyle='#3a4558';g.setLineDash([2,3]);g.beginPath();g.arc(0,0,7,0,TAU);g.stroke();g.setLineDash([]);break;
    case 'boss':{glowC('#ff4f6e',22);const r=o.small?7:11;g.strokeStyle='#ff6b8a';g.rotate(t*.3);g.beginPath();for(let i=0;i<8;i++){const a=i/8*TAU+Math.PI/8;g.lineTo(Math.cos(a)*r,Math.sin(a)*r);}g.closePath();g.stroke();
      g.fillStyle=o.done?'#8fe9ff':'#ff6b8a';g.beginPath();g.arc(0,0,3.5,0,TAU);g.fill();if(!o.small){g.rotate(-t*.6);g.setLineDash([3,4]);g.globalAlpha=.6;g.beginPath();g.arc(0,0,r+5,0,TAU);g.stroke();g.setLineDash([]);g.globalAlpha=1;}break;}
    case 'beacon':glowC(o.col||'#8fe9ff',14);g.strokeStyle=o.col||'#8fe9ff';g.beginPath();g.moveTo(0,-7);g.lineTo(6,0);g.lineTo(0,7);g.lineTo(-6,0);g.closePath();g.stroke();g.globalAlpha=.5;g.beginPath();g.moveTo(0,-7);g.lineTo(0,-18);g.stroke();g.globalAlpha=1;break;
    case 'shop':glowC('#ffb84d',12);g.strokeStyle='#ffb84d';g.strokeRect(-5,-5,10,10);for(let i=0;i<4;i++){g.rotate(Math.PI/2);g.beginPath();g.moveTo(5,0);g.lineTo(8,0);g.stroke();}break;
    case 'arsenal':{const c=o.open||o.small?'#9fe3ff':'#3a5a74';glowC('#8fd8ff',12);g.strokeStyle=c;g.beginPath();for(let i=0;i<6;i++){const a=i/6*TAU;g[i?'lineTo':'moveTo'](Math.cos(a)*6.5,Math.sin(a)*6.5);}g.closePath();g.stroke();if(o.open||o.small){g.globalAlpha=.45;g.fillStyle='#8fd8ff';g.fill();g.globalAlpha=1;}break;}
    case 'hangar':glowC('#ff6bd0',12);g.strokeStyle='#ff6bd0';g.rotate(Math.PI/4);g.strokeRect(-5,-5,10,10);g.globalAlpha=.4;g.fillStyle='#ff6bd0';g.fillRect(-5,-5,5,10);g.globalAlpha=1;break;
    case 'relay':g.strokeStyle=o.ok?'#8fe9ff':'#ff4f6e';g.beginPath();g.moveTo(0,-6);g.lineTo(5.5,4);g.lineTo(-5.5,4);g.closePath();g.stroke();if(o.ok){g.fillStyle='#8fe9ff';g.fill();}break;
    case 'anom':{const j=o.done?0:Math.sin(t*9)*.8;g.strokeStyle=o.done?'#3a4558':'#c9a6ff';g.beginPath();g.arc(j,0,6,0,TAU);g.stroke();if(!o.done){g.globalAlpha=.4;g.beginPath();g.arc(-j,0,9,0,TAU);g.stroke();g.globalAlpha=1;}break;}
    case 'cache':g.fillStyle='#ffb84d';g.rotate(Math.PI/4);g.fillRect(-3,-3,6,6);break;
    case 'wreck':g.strokeStyle=o.col||'#8fe9ff';g.beginPath();g.moveTo(1,-5);g.lineTo(8,0);g.lineTo(1,5);g.lineTo(3,0);g.closePath();g.moveTo(-2,-4);g.lineTo(-8,-7);g.lineTo(-5,-1);g.closePath();g.moveTo(-2,3);g.lineTo(-7,7);g.lineTo(-4,2);g.stroke();break;
    case 'wreckx':g.fillStyle='#7a8ea5';g.beginPath();g.moveTo(-6,-3);g.lineTo(1,-6);g.lineTo(6,-1);g.lineTo(2,5);g.lineTo(-4,3);g.closePath();g.globalAlpha=.55;g.fill();g.globalAlpha=1;g.strokeStyle='#9fb0c4';g.lineWidth=1;g.stroke();break;
    case 'frag':glowC('#ffffff',10);g.fillStyle='#ffffff';g.beginPath();g.moveTo(0,-7);g.lineTo(4,0);g.lineTo(0,7);g.lineTo(-3,1);g.closePath();g.fill();break;
    case 'journal':g.strokeStyle='#8fe9ff';g.beginPath();g.moveTo(-4,-5);g.lineTo(3,-5);g.lineTo(5,-3);g.lineTo(5,5);g.lineTo(-4,5);g.closePath();g.stroke();break;
    case 'abyss':glowC('#b48cff',14);g.fillStyle='#000';g.beginPath();g.arc(0,0,6,0,TAU);g.fill();g.strokeStyle=o.dim?'#5a4a7c':'#c9a6ff';g.beginPath();g.ellipse(0,0,10,3.5,-.3,0,TAU);g.stroke();break;
    case 'gate':g.strokeStyle=o.ok?'#8fe9ff':'#b48cff';g.beginPath();g.arc(0,0,8,0,TAU);g.stroke();g.beginPath();g.moveTo(-8,0);g.lineTo(8,0);g.stroke();break;
    case 'lost':g.strokeStyle='#ff4f6e';g.beginPath();g.arc(0,0,7,0,TAU);g.stroke();g.fillStyle='#c9d2de';g.beginPath();for(let i=0;i<6;i++){const a=-Math.PI/2+i*Math.PI/3;g.lineTo(Math.cos(a)*4,Math.sin(a)*4);}g.closePath();g.fill();break;
    case 'unk':g.fillStyle='#ff4f6e';g.globalAlpha=.6+.4*Math.sin(t*12);g.font='700 10px "JetBrains Mono",monospace';g.textAlign='center';g.textBaseline='middle';g.fillText('?',0,0);g.globalAlpha=1;break;
    case 'ship':g.rotate(o.ang||0);g.fillStyle=o.col||'#8fe9ff';g.beginPath();g.moveTo(9,0);g.lineTo(-6,-6);g.lineTo(-3,0);g.lineTo(-6,6);g.closePath();g.fill();break;
  }
  g.restore();}
function mapSpanMax(w,h){return Math.max(WW,WH*w/h)*1.02;}
function mapSpanDef(){return isMob()?(G.ff==='tablet'?7000:innerWidth>innerHeight?6000:4000):(($('#mapC')&&$('#mapC').clientWidth)||1000)<520?6500:11000;}
function mapSpanMin(){return isMob()?2200:3500;}
function mapViewInit(){const p=G.player,sp=mapSpanDef();G.mapView={cx:p.x,cy:p.y,span:sp*1.25,tspan:sp,vx:0,vy:0};G.mapOpenT=performance.now();G.mapTipPin=null;}
function mapClamp(w,h){const V_=G.mapView,mx=mapSpanMax(w,h),mn=mapSpanMin();V_.span=clamp(V_.span,mn,mx);V_.tspan=clamp(V_.tspan,mn,mx);const vh=V_.span*h/w;
  if(isMob()){V_.cx=clamp(V_.cx,0,WW);V_.cy=clamp(V_.cy,0,WH);return;}
  V_.cx=V_.span>=WW?WW/2:clamp(V_.cx,V_.span/2,WW-V_.span/2);V_.cy=vh>=WH?WH/2:clamp(V_.cy,vh/2,WH-vh/2);}
const MAP_BG='#050a15';
function mapStarsDraw(g,w,h,k,V_,fx,t){
  const st=mapStars(),fac=[.2,.4,.7];for(const s of st){const W2=w+160,H2=h+160;const x=((s.x*W2-(fx?V_.cx*k*fac[s.l]*.08:0))%W2+W2)%W2-80,y=((s.y*H2-(fx?V_.cy*k*fac[s.l]*.08:0))%H2+H2)%H2-80;
    g.globalAlpha=(.3+.25*s.l)*(fx?.75+.25*Math.sin(t*1.5+s.tw):1);g.fillStyle=s.l===2?'#cfeeff':'#7f9ab5';g.fillRect(x,y,s.s,s.s);
    if(s.b){g.globalAlpha=.5;g.strokeStyle='#cfeeff';g.lineWidth=.6;g.beginPath();g.moveTo(x-4,y+.5);g.lineTo(x+5,y+.5);g.moveTo(x+.5,y-4);g.lineTo(x+.5,y+5);g.stroke();}}
  g.globalAlpha=1;
}
function drawMap(){
  const c=$('#mapC'),S=G.save;if(!c||!S)return;if(typeof zbMap==='function'&&zbMap())return;const t0=performance.now(),t=t0/1000;
  const w=Math.max(200,c.clientWidth),h=isMob()?Math.max(180,Math.round(innerHeight-c.getBoundingClientRect().top-(innerWidth>innerHeight?14:96)-SAFE.b)):Math.round(w<520?Math.min(w*1.15,innerHeight*.62):Math.min(w*.56,innerHeight*.62));
  if(c.width!==Math.round(w*DPR)||c.height!==Math.round(h*DPR)){c.width=Math.round(w*DPR);c.height=Math.round(h*DPR);c.style.height=h+'px';}
  if(!G.mapView)mapViewInit();if(MAPC.cycle!==S.cycle){MAPC.cycle=S.cycle;}mapClamp(w,h);
  const V_=G.mapView,k=w/V_.span,ox=V_.cx-V_.span/2,oy=V_.cy-V_.span*h/w/2,X=x=>(x-ox)*k,Y=y=>(y-oy)*k,vis=(x,y,m)=>X(x)>-m&&X(x)<w+m&&Y(y)>-m&&Y(y)<h+m;
  G.mapXY={X,Y,k,ox,oy,w,h};const g=c.getContext('2d');g.setTransform(DPR,0,0,DPR,0,0);g.textBaseline='alphabetic';
  const fx=SET.fx,lod=k<.03?0:k<.085?1:2;
  // 1. фон
  g.fillStyle=MAP_BG;g.fillRect(0,0,w,h);
  // 2. туманности, 3. разлом, 4. туман войны
  const cs=1/MAPC.sc;g.imageSmoothingEnabled=true;
  g.globalCompositeOperation='lighter';g.drawImage(mapNeb(),X(0),Y(0),WW*k,WH*k);g.globalCompositeOperation='source-over';
  {const rf=mapRift();const jx=fx?Math.sin(t*7)*2:0;g.globalAlpha=.85;g.drawImage(rf,X(0)+jx,Y(0),WW*k,WH*k);g.globalAlpha=fx?.25+.15*Math.sin(t*3):.2;g.drawImage(rf,X(0)-jx*2,Y(0)+jx,WW*k,WH*k);g.globalAlpha=1;}
  w58MapBlobs(g,X,Y,k,vis);
  // натяжение пространства по краю секторов
  {g.strokeStyle='rgba(255,140,180,.22)';g.lineWidth=1;g.beginPath();for(const sgm of riftEdges()){if(!vis((sgm[0]+sgm[2])/2,(sgm[1]+sgm[3])/2,120))continue;const wob=fx?Math.sin(t*2+sgm[0]*.002+sgm[1]*.003)*2:0;g.moveTo(X(sgm[0])+sgm[4]*wob,Y(sgm[1])+sgm[5]*wob);g.lineTo(X(sgm[2])+sgm[4]*wob,Y(sgm[3])+sgm[5]*wob);}g.globalAlpha=.6+.4*Math.sin(t*2);g.stroke();g.globalAlpha=1;}
  // старые ворота
  if(!gateOpen()/* ВРЕМЕННО (альфа 0.5.9) */){g.strokeStyle='#7c5cff';g.setLineDash([4,4]);g.beginPath();g.moveTo(X(5000),Y(OY));g.lineTo(X(5000),Y(OY+WH0));g.stroke();g.setLineDash([]);}
  mapSpace(g,X,Y,k,w,h,t,fx,V_);
  // 5. гиперлинии
  const NS=m=>nodeState(m);
  for(const sg of mapSegs()){const b=sg.bb;if(X(b[2])<-20||X(b[0])>w+20||Y(b[3])<-20||Y(b[1])>h+20)continue;if(!openAllNow()&&fogClosedAt(sg.b.x,sg.b.y))continue;
    const sa=NS(sg.a.m),sb=NS(sg.b.m),done=sa==='done'&&sb==='done',open=!done&&sb!=='locked';
    g.beginPath();sg.pts.forEach(([x,y],i)=>i?g.lineTo(X(x),Y(y)):g.moveTo(X(x),Y(y)));
    if(sg.cross){const gr=g.createLinearGradient(X(sg.a.x),Y(sg.a.y),X(sg.b.x),Y(sg.b.y));gr.addColorStop(0,hexA(sg.c1,done?.9:.45));gr.addColorStop(1,hexA(sg.c2,done?.9:.45));g.strokeStyle=gr;g.lineWidth=done?3.5:2.5;if(!done)g.setLineDash([8,6]);g.stroke();g.setLineDash([]);}
    else if(done){g.strokeStyle=hexA(sg.c2,.18);g.lineWidth=7;g.stroke();g.strokeStyle=hexA(sg.c2,.9);g.lineWidth=2;g.stroke();}
    else if(open){g.strokeStyle='rgba(255,184,77,.55)';g.lineWidth=1.6;g.setLineDash([6,6]);g.lineDashOffset=fx?-t*12:0;g.stroke();g.setLineDash([]);g.lineDashOffset=0;}
    else{g.strokeStyle='rgba(122,142,165,.3)';g.lineWidth=1;g.setLineDash([2,6]);g.stroke();g.setLineDash([]);}
    if(open&&fx)for(let j=0;j<3;j++){const u=((t*.22+j/3)%1)*(sg.pts.length-1),i=Math.floor(u),f=u-i,p1=sg.pts[i],p2=sg.pts[Math.min(i+1,sg.pts.length-1)];const x=X(p1[0]+(p2[0]-p1[0])*f),y=Y(p1[1]+(p2[1]-p1[1])*f);
      const gr=g.createRadialGradient(x,y,0,x,y,5);gr.addColorStop(0,'rgba(255,220,150,.95)');gr.addColorStop(1,'rgba(255,184,77,0)');g.fillStyle=gr;g.beginPath();g.arc(x,y,5,0,TAU);g.fill();}}
  // 6–7. значки и подписи
  const items=[],labels=[],obst=[];
  const add=(kind,x,y,o,lab)=>{if(!vis(x,y,30))return;if(kind!=='lost'&&kind!=='unk'&&kind!=='shop'&&kind!=='hangar'&&!openAllNow()&&fogClosedAt(x,y))return;const sx=X(x),sy=Y(y);items.push({kind,x,y,sx,sy,o:o||{},lab});obst.push({x:sx-8,y:sy-8,w:16,h:16,id:items.length-1});};
  WORLD.journals.forEach(j=>{if(S.journals[j.id]){const sp=wreckSpec(j);add(sp.own==='player'?'wreck':'wreckx',j.x,j.y,{col:sp.own==='player'?SKINS[sp.skin].col:null},lod===2?{t:j.title,p:6,c:'#7a8ea5'}:null);}});
  STORY_FRAGS.forEach(f=>{if(!fragAvail(f))return;const q=fragPos(f);if(revealedAt(q.x,q.y))add('frag',q.x,q.y,{},lod>=1?{t:'ФРАГМЕНТ',p:4,c:'#ffffff'}:null);});
  (S.story?S.story.riftWrecks:[]).forEach(w=>add('lost',w.x,w.y,{},null));
  WORLD.caches.forEach(q=>{if(S.found[q.id])add('cache',q.x,q.y);});
  w58MapAdd(add,lod,S);w74MapAdd(add,lod,S);w80MapAdd(add,lod,S);
  WORLD.anomalies.forEach(a=>{if(revealedAt(a.x,a.y))add('anom',a.x,a.y,{done:!!S.anomalies[a.id],a},lod>=1?{t:'АНОМАЛИЯ · '+a.name,p:5,c:'#c9a6ff'}:null);});
  WORLD.relays.forEach(r=>{if(revealedAt(r.x,r.y)||S.relays[r.id])add('relay',r.x,r.y,{ok:!!S.relays[r.id]},lod===2?{t:'РЕТРАНСЛЯТОР',p:6,c:S.relays[r.id]?'#8fe9ff':'#ff4f6e'}:null);});
  WORLD.shops.forEach(q=>{add('shop',q.x,q.y,{q},lod>=1?{t:q.name,p:3,c:'#ffb84d'}:null);});
  {const hg=WORLD.hangar;add('hangar',hg.x,hg.y,{},lod>=1?{t:hg.name,p:4,c:'#ff6bd0'}:null);}
  {const ar=WORLD.arsenal;if(revealedAt(ar.x,ar.y)||arsOpen())add('arsenal',ar.x,ar.y,{open:arsOpen()},lod>=1?{t:ar.name+(arsOpen()?'':' · ЗАПЕЧАТАН'),p:3,c:arsOpen()?'#9fe3ff':'#5a7a94'}:null);}
  {const ab=WORLD.abyss;if(revealedAt(ab.x,ab.y)||ALPHA_OPEN/* ВРЕМЕННО (альфа 0.5.9) */)add('abyss',ab.x,ab.y,{dim:!abyssOpen()},lod>=1?{t:'∞ БЕЗДНА',p:3,c:'#c9a6ff'}:null);}
  add('gate',WORLD.gate.x,WORLD.gate.y,{ok:S.gate},lod===2?{t:S.gate?'ВОРОТА ОТКРЫТЫ':'ВОРОТА',p:5,c:'#b48cff'}:null);
  if(S.lost)add('lost',S.lost.x,S.lost.y,{},{t:'ЛОМ · '+S.lost.v,p:2,c:'#ff4f6e'});
  WORLD.sectors.forEach((sc,i)=>{if(sc.bx)add('beacon',sc.bx,sc.by,{col:sc.col,sec:i},lod>=1?{t:'МАЯК '+roman(i+1),p:2,c:sc.col}:null);});
  const nt=nextTarget();
  WORLD.nodes.forEach(n=>{const st=NS(n.m),md=medalCount(S.medals[n.m]);const kind=n.boss?'boss':st;const tgt=nt&&Math.abs(nt.x-n.x)<1&&Math.abs(nt.y-n.y)<1;
    add(kind,n.x,n.y,{md:lod===2?md:undefined,done:st==='done',small:lod===0,n,tgt},{t:lod===0?'':(lod===2?pad2(n.m)+' · '+MISSIONS[n.m-1].name:pad2(n.m))+(n.boss&&lod===2?' · '+bossLab90(n.m):''),p:tgt?0:n.boss?1:st==='open'?2:3,c:n.boss&&st!=='done'?'#ff6b8a':st==='done'?'#8fe9ff':st==='open'?'#ffb84d':'#7a8ea5'});});
  // названия секторов по центру облаков
  WORLD.sectors.forEach((sc,i)=>{const b=sc.box,cx=(b[0]+b[2])/2,cy=b[0]===0||b[0]===5000?b[3]-700:(b[1]+b[3])/2;if(!vis(cx,cy,300))return;if(!openAllNow()&&!secSeen(i))return;const fs=lod===0?11:lod===1?15:18;
    g.font=`700 ${fs}px "JetBrains Mono",monospace`;g.textAlign='center';const txt=roman(i+1)+' · '+sc.name,sp=txt.split('').join(String.fromCharCode(8202));
    g.globalAlpha=.32;g.fillStyle=sc.col;g.fillText(sp,X(cx),Y(cy));g.globalAlpha=1;});
  // ссылки на неизвестных
  if(G.unk&&G.unk.length)for(const u of G.unk)if(u.x!==undefined)add('unk',u.x,u.y);
  // отрисовка значков
  for(const it of items){const o=it.o;o.t=t;
    if(o.tgt&&fx){const q=(t*.8)%1;for(const qq of [q,(q+.5)%1]){g.strokeStyle=`rgba(255,184,77,${(1-qq)*.7})`;g.lineWidth=1.5;g.beginPath();g.arc(it.sx,it.sy,8+qq*20,0,TAU);g.stroke();}}
    const sel=G.mapHover&&G.mapHover===it.kind+it.x+','+it.y;if(sel){g.save();g.translate(it.sx,it.sy);g.scale(1.2,1.2);g.translate(-it.sx,-it.sy);}
    mapIcon(g,it.kind,it.sx,it.sy,o);if(sel)g.restore();}
  // подписи без пересечений
  for(const [i,it] of items.entries())if(it.lab&&it.lab.t)labels.push({...it.lab,sx:it.sx,sy:it.sy,id:i});
  labels.sort((a,b)=>a.p-b.p);const placed=[];
  {const au=k>.08?5:k>.03?20:50,sl=au*AUNIT*k,mob=w<520,mw=Math.min(mob?110:150,w*.3),mh=mw*WH/WW,bs=mob?44:36,bb=mob?80:96;
    placed.push({x:0,y:h-36,w:sl+86,h:36},{x:w-mw-14,y:h-mh-14,w:mw+14,h:mh+14},{x:w-bs-16,y:h-bb-4*bs-24,w:bs+16,h:4*bs+28});}
  const ovl=r=>placed.some(q=>r.x<q.x+q.w&&r.x+r.w>q.x&&r.y<q.y+q.h&&r.y+r.h>q.y)||obst.some(q=>q.id!==r.id&&r.x<q.x+q.w&&r.x+r.w>q.x&&r.y<q.y+q.h&&r.y+r.h>q.y);
  G.mapLabels=[];
  for(const L of labels){const fs=L.p<=1?11:10;g.font=`700 ${fs}px "JetBrains Mono",monospace`;const tw=g.measureText(L.t).width,th=fs+2,pad=10;
    const cand=[[L.sx-tw/2,L.sy-pad-th],[L.sx+pad,L.sy-th/2],[L.sx-tw/2,L.sy+pad],[L.sx-pad-tw,L.sy-th/2]];
    let ok=null;for(const [x,y] of cand){const r={x,y,w:tw,h:th,id:L.id};if(x<0||y<0||x+tw>w||y+th>h)continue;if(!ovl(r)){ok=r;break;}}
    if(!ok)continue;placed.push(ok);G.mapLabels.push(ok);g.textAlign='left';g.lineWidth=3;g.strokeStyle='rgba(2,4,10,.9)';g.strokeText(L.t,ok.x,ok.y+fs);g.fillStyle=L.c;g.fillText(L.t,ok.x,ok.y+fs);}
  // 1.0.0 α: подпись над первым закрытым сектором (сам сектор — космос, как пустота вокруг)
  if(!openAllNow()){const F=fogMemo();
    const label=(bb,txt)=>{const L=Math.max(0,X(bb[0])),T_=Math.max(0,Y(bb[1])),R_=Math.min(w,X(bb[2])),B_=Math.min(h,Y(bb[3]));if(R_-L<40||B_-T_<40)return;
      const t2=isMob()?txt.replace(/^СЕКТОР [IVXL]+ · /,''):txt;g.font='700 '+(isMob()?10:11)+'px "JetBrains Mono",monospace';g.textAlign='center';
      const tw=Math.max(g.measureText('ТУМАН ВОЙНЫ').width,g.measureText(t2).width)+6,x0=clamp(L+14,6,w-tw-6),cy=B_-T_>140?clamp(T_+48,T_+22,B_-22):(T_+B_)/2;g.textAlign='left';
      g.globalAlpha=.9;g.fillStyle='#8a9bb3';g.fillText('ТУМАН ВОЙНЫ',x0,cy-8);g.fillStyle='#5f7088';g.fillText(t2,x0,cy+9);g.globalAlpha=1;};
    let i=-1;for(let q=1;q<=10;q++)if(!secSeen(q)){i=q;break;}
    if(i>0)label(WORLD.sectors[i].box,fogHint(i));if(!F.z&&F.sx>WORLD.sectors[11].box[0])label(WORLD.sectors[11].box,'СЕКТОР XII · ПРОЙДИТЕ МИССИЮ 49');}
  // 8. корабль и точки прыжка
  const p=G.player;{const q=(t*1.2)%1;g.strokeStyle=hexA(shipCol().length===7?shipCol():'#8fe9ff',(1-q)*.6);g.lineWidth=1.5;g.beginPath();g.arc(X(p.x),Y(p.y),6+q*16,0,TAU);g.stroke();}
  mapIcon(g,'ship',X(p.x)+(G.riftI>.05&&fx?rnd(-2,2)*G.riftI:0),Y(p.y),{ang:p.ang,col:shipCol()});
  G.mapPts=jumpPoints().map(q=>({...q,px:X(q.x),py:Y(q.y-150)}));
  for(const q of G.mapPts){if(q.px<-20||q.px>w+20||q.py<-20||q.py>h+20)continue;const hv=G.mapHover==='jp'+q.label;g.strokeStyle=mapJpCol(hv);g.lineWidth=hv?2:1;g.beginPath();g.arc(q.px,q.py,13,0,TAU);g.stroke();}
  if(G.mapDeny&&t0<G.mapDeny.until){const d=G.mapDeny;g.strokeStyle='#ff4f6e';g.lineWidth=2;g.beginPath();g.arc(X(d.x)+Math.sin(t0/25)*3,Y(d.y),14,0,TAU);g.stroke();}
  if(G.mapJumpFx){const J=G.mapJumpFx,q=clamp((t0-J.t0)/250,0,1);g.strokeStyle='#ffffff';g.lineWidth=2;g.globalAlpha=1-q*.5;g.beginPath();g.moveTo(X(p.x),Y(p.y));g.lineTo(X(p.x)+(X(J.x)-X(p.x))*q,Y(p.y)+(Y(J.y)-Y(p.y))*q);g.stroke();g.globalAlpha=1;}
  if(G.mapHi&&t0<G.mapHi.until){const q=(t0/400)%1;g.strokeStyle='#8fe9ff';g.lineWidth=2;g.globalAlpha=1-q;g.beginPath();g.arc(X(G.mapHi.x),Y(G.mapHi.y),6+q*22,0,TAU);g.stroke();g.globalAlpha=1;}
  // развёртка радара при открытии
  {const q=clamp((t0-(G.mapOpenT||0))/600,0,1);if(q<1){const R=q*Math.hypot(w,h),cx=X(p.x),cy=Y(p.y);g.fillStyle='rgba(2,4,10,.92)';g.beginPath();g.rect(0,0,w,h);g.arc(cx,cy,R,0,TAU,true);g.fill('evenodd');g.strokeStyle='rgba(143,233,255,.6)';g.lineWidth=2;g.beginPath();g.arc(cx,cy,R,0,TAU);g.stroke();}}
  // 9. линейка масштаба
  {const au=k>.08?5:k>.03?20:50,sl=au*AUNIT*k,bx=12,by=h-16;g.fillStyle='rgba(2,4,10,.65)';g.fillRect(bx-6,by-16,sl+70,26);g.strokeStyle='#7a8ea5';g.lineWidth=1.5;g.beginPath();g.moveTo(bx,by);g.lineTo(bx+sl,by);
    for(let i=0;i<=5;i++){const x=bx+sl*i/5,hh=i%5===0?6:3;g.moveTo(x,by-hh);g.lineTo(x,by+hh*.0);}g.stroke();g.fillStyle='#9fb0c4';g.font='600 10px "JetBrains Mono",monospace';g.textAlign='left';g.fillText(au+' а.е.',bx+sl+8,by+4);}
  // обзор мира
  {const mw=Math.min(w<520?110:150,w*.3),mh=mw*WH/WW,mx=w-mw-10,my=h-mh-10,mk=mw/WW;G.mapOv={mx,my,mw,mh,mk};g.fillStyle='rgba(2,4,10,.85)';g.fillRect(mx,my,mw,mh);
    g.globalCompositeOperation='lighter';g.drawImage(mapNeb(),mx,my,mw,mh);g.globalCompositeOperation='source-over';g.imageSmoothingEnabled=true;{const hd=mapHideDark(),P_=MAPH.P;g.drawImage(hd,P_,P_,hd.width-2*P_,hd.height-2*P_,mx,my,mw,mh);}
    g.strokeStyle='rgba(143,233,255,.35)';g.lineWidth=1;g.beginPath();WORLD.nodes.forEach((n,i)=>{const x=mx+n.x*mk,y=my+n.y*mk;i?g.lineTo(x,y):g.moveTo(x,y);});g.stroke();
    g.strokeStyle='#ffffff';g.lineWidth=1;g.strokeRect(mx+ox*mk,my+oy*mk,V_.span*mk,V_.span*h/w*mk);g.fillStyle=shipCol();g.fillRect(mx+p.x*mk-1.5,my+p.y*mk-1.5,3,3);g.strokeStyle='#26324a';g.strokeRect(mx,my,mw,mh);}
  G.mapItems=items;
  const jc=Object.keys(S.journals).length,cc=Object.keys(S.found).length,ac=Object.keys(S.anomalies).length;
  $('#mapStat').textContent=G.mapStatMsg&&t0<G.mapStatMsg.until?G.mapStatMsg.t:/*DEVW*/(window.DEVW&&DEVW.on()?'ПЕСОЧНИЦА · ':'')+`МИССИИ ${doneCount()}/${NM}${(S.cycle||1)>1?' · ЦИКЛ '+roman(S.cycle):''}`;
  MAPC.ms=performance.now()-t0;
}
function mapTick(dt){const V_=G.mapView;if(!V_)return;if(!G.mapDrag){V_.cx+=V_.vx*dt;V_.cy+=V_.vy*dt;const d=Math.exp(-dt/.14);V_.vx*=d;V_.vy*=d;if(Math.abs(V_.vx)<1)V_.vx=0;if(Math.abs(V_.vy)<1)V_.vy=0;}
  if(Math.abs(V_.tspan-V_.span)>1){const M=G.mapXY,f=1-Math.exp(-dt/.06);const ns=V_.span+(V_.tspan-V_.span)*f;
    if(M&&V_.zx!==undefined){const wx=M.ox+V_.zx/M.k,wy=M.oy+V_.zy/M.k,k2=M.w/ns;V_.cx=wx-(V_.zx-M.w/2)/k2;V_.cy=wy-(V_.zy-M.h/2)/k2;}V_.span=ns;}}
let mapLast=0;
function mapLoop(){if(G.state!=='map'||G.mapTab!=='map')return;const now=performance.now(),dt=Math.min(.05,(now-(mapLast||now))/1000);mapLast=now;mapTick(dt);drawMap();arch69MapNext();/* ARCH·69 A-1 */}
function mapZoom(f,sx,sy){const M=G.mapXY;if(!M||!G.mapView)return;const V_=G.mapView;V_.zx=sx??M.w/2;V_.zy=sy??M.h/2;V_.tspan=clamp(V_.tspan*f,mapSpanMin(),mapSpanMax(M.w,M.h));}
function mapMsg(t){G.mapStatMsg={t,until:performance.now()+2200};}
function mapJumpAt(x,y){
  let best=null,bd=18;for(const q of G.mapPts||[]){const d=Math.hypot(q.px-x,q.py-y);if(d<bd){bd=d;best=q;}}
  if(!best)return false;const p=G.player;const deny=(m,r)=>{mapMsg(m);G.mapDeny={x:best.x,y:best.y-150,until:performance.now()+700};sfx('block');try{mapDenyShow(r);}catch(e){}};
  {const r=jumpDenyReason(best);if(r){deny(JUMP_DENY[r].msg,r);return true;}}
  const go=()=>{G.mapJumpFx=null;G.enemies.forEach(o=>{if(o.zone||o.tugAtk)o.alive=false;});G.zones.forEach(z=>{z.active=false;});if(typeof W58!=='undefined')W58.zones.forEach(z=>{z.active=false;});if(G.event==='zone'||G.event==='tug'){if(G.w&&G.w.tug&&G.event==='tug')G.w.tug.alive=false;G.event=null;}G.riftI=0;G.riftB1=0;
    Object.assign(p,{x:best.x,y:best.y,vx:0,vy:0,dashT:0,trail:[]});p.px=p.x;p.py=p.y;camSnap();closeMap();
    G.shock.push({x:p.x,y:p.y,r:10,R:260,t:0,col:shipCol()});sfx('dash');banner('ПРЫЖОК','ТОЧКА '+best.label);};
  if(G.mapAnimJump===false){go();return true;}
  G.mapJumpFx={x:best.x,y:best.y-150,t0:performance.now()};$('#mapTip').hidden=true;setTimeout(()=>{if(G.state==='map'&&G.mapJumpFx)go();},250);return true;}
// подсказка-карточка
function mapFind(x,y){let best=null,bd=16;for(const it of G.mapItems||[]){if(it.kind==='unk')continue;const d=Math.hypot(it.sx-x,it.sy-y);if(d<bd){bd=d;best=it;}}return best;}
function mapTipHTML(it){const S=G.save,p=G.player,dist=fmtAU(Math.hypot(it.x-p.x,it.y-p.y));let h='';
  const jp=(G.mapPts||[]).find(q=>Math.abs(q.x-it.x)<260&&Math.abs(q.y-150-it.y)<260);
  if(it.o.n){const n=it.o.n,M=MISSIONS[n.m-1],st=nodeState(n.m),md=medalCount(S.medals[n.m]),bd=S.bestDiff[n.m];
    h=`<b>${pad2(n.m)} · ${M.name}</b><span>${n.boss?'КОМНАТА БОССА · ДОРАБОТКА · ':''}${st==='done'?'ПРОЙДЕНА':st==='open'?'ДОСТУПНА':'ПОМЕХИ'} · ${dist}</span>${st==='done'?`<span>медали ${md}/4${bd!==undefined?' · лучшая сложность '+DIFF[DIFF_KEYS[bd]].name:''}</span>`:''}`;}
  else{const names={shop:it.o.q?it.o.q.name:'МАСТЕРСКАЯ',hangar:WORLD.hangar.name,arsenal:WORLD.arsenal.name+(arsOpen()?'':' · запечатан'),beacon:'МАЯК СЕКТОРА '+roman((it.o.sec||0)+1),anom:'АНОМАЛИЯ · '+(it.o.a?it.o.a.name:''),relay:'РЕТРАНСЛЯТОР',cache:'ТАЙНИК',journal:'БОРТЖУРНАЛ',abyss:'∞ БЕЗДНА',gate:'ВОРОТА СЕКТОРА',lost:'ПОТЕРЯННЫЙ ЛОМ'};
    h=`<b>${names[it.kind]||''}</b><span>${sectorName(it.x,it.y)} · ${dist}</span>`;}
  {const lab=it.o.n?'МИССИЯ '+pad2(it.o.n.m):({shop:'МАСТЕРСКАЯ',hangar:'ХРАНИЛИЩЕ',beacon:'МАЯК',anom:'АНОМАЛИЯ',relay:'РЕТРАНСЛЯТОР',cache:'ТАЙНИК',journal:'ЖУРНАЛ',abyss:'БЕЗДНА',gate:'ВОРОТА',lost:'ЛОМ'})[it.kind]||'ЦЕЛЬ';h+=`<div class="wc-row"><button class="wbtn" data-mcourse="${Math.round(it.x)},${Math.round(it.y)},${lab}">${G.course&&Math.abs(G.course.x-it.x)<2&&Math.abs(G.course.y-it.y)<2?'КУРС ПРОЛОЖЕН':'ПРОЛОЖИТЬ КУРС'}</button>`+(jp?`<button class="wbtn amber" data-mjump="${jp.label}">ПРЫЖОК</button>`:'')+'</div>';}return h;}
function mapShowTip(it,pin){const tip=$('#mapTip');if(!it){if(!G.mapTipPin){tip.hidden=true;}G.mapHover=null;return;}
  G.mapHover=it.kind+it.x+','+it.y;tip.innerHTML=mapTipHTML(it);tip.hidden=false;tip.classList.toggle('bottom',touchMode);
  if(!touchMode){const M=G.mapXY;tip.style.left=clamp(it.sx+16,4,M.w-230)+'px';tip.style.top=clamp(it.sy-10,4,M.h-90)+'px';}else{tip.style.left='';tip.style.top='';}
  if(pin)G.mapTipPin=it;}
$('#mapTip').addEventListener('click',e=>{const c=e.target.closest('[data-mcourse]');if(c){const [x,y,...l]=c.dataset.mcourse.split(',');G.course={x:+x,y:+y,label:l.join(',')};$('#mapTip').hidden=true;G.mapTipPin=null;closeMap();if(G.player)floater(G.player.x,G.player.y-44,'КУРС · '+G.course.label,'#8fe9ff');return;}const b=e.target.closest('[data-mjump]');if(!b)return;const q=(G.mapPts||[]).find(z=>z.label===b.dataset.mjump);if(q)mapJumpAt(q.px,q.py);});
{const MP={ptr:new Map(),moved:0,pinch:0,lx:0,ly:0,lt:0};const cvM=$('#mapC');
  cvM.addEventListener('pointerdown',e=>{if(G.state!=='map')return;cvM.setPointerCapture(e.pointerId);MP.ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});MP.moved=0;G.mapDrag=true;MP.lt=performance.now();
    if(G.mapView){G.mapView.vx=0;G.mapView.vy=0;}if(MP.ptr.size===2){const [a,b]=[...MP.ptr.values()];MP.pinch=Math.hypot(a.x-b.x,a.y-b.y);}});
  cvM.addEventListener('pointermove',e=>{const r=cvM.getBoundingClientRect();const q=MP.ptr.get(e.pointerId);
    if(!q){if(e.pointerType==='mouse'&&!G.mapTipPin)mapShowTip(mapFind(e.clientX-r.left,e.clientY-r.top),false);
      const jp=(G.mapPts||[]).find(z=>Math.hypot(z.px-(e.clientX-r.left),z.py-(e.clientY-r.top))<16);if(jp)G.mapHover='jp'+jp.label;cvM.style.cursor=jp?'pointer':'grab';return;}
    if(!G.mapXY)return;const dx=e.clientX-q.x,dy=e.clientY-q.y;
    if(MP.ptr.size===2){q.x=e.clientX;q.y=e.clientY;const [a,b]=[...MP.ptr.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(MP.pinch>0&&d>0){const V_=G.mapView;V_.zx=(a.x+b.x)/2-r.left;V_.zy=(a.y+b.y)/2-r.top;V_.tspan=V_.span=clamp(V_.span*MP.pinch/d,mapSpanMin(),mapSpanMax(G.mapXY.w,G.mapXY.h));}MP.pinch=d;MP.moved=99;return;}
    MP.moved+=Math.abs(dx)+Math.abs(dy);if(MP.moved>6){const V_=G.mapView,now=performance.now(),dtm=Math.max(1,now-MP.lt)/1000;V_.cx-=dx/G.mapXY.k;V_.cy-=dy/G.mapXY.k;V_.vx=-dx/G.mapXY.k/dtm*.6;V_.vy=-dy/G.mapXY.k/dtm*.6;MP.lt=now;q.x=e.clientX;q.y=e.clientY;cvM.style.cursor='grabbing';}});
  const up=e=>{const had=MP.ptr.has(e.pointerId);MP.ptr.delete(e.pointerId);if(MP.ptr.size<2)MP.pinch=0;if(MP.ptr.size===0)G.mapDrag=false;if(!had||G.state!=='map')return;
    if(MP.moved>6&&G.mapView&&performance.now()-MP.lt>80){G.mapView.vx=0;G.mapView.vy=0;}
    if(MP.moved<=6&&e.type==='pointerup'){const r=cvM.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,O=G.mapOv;
      if(O&&x>=O.mx&&x<=O.mx+O.mw&&y>=O.my&&y<=O.my+O.mh){G.mapView.cx=(x-O.mx)/O.mk;G.mapView.cy=(y-O.my)/O.mk;return;}
      if(e.pointerType==='mouse'&&mapJumpAt(x,y))return;
      const it=mapFind(x,y);if(it){G.mapTipPin=null;mapShowTip(it,true);}
      else if(e.pointerType!=='mouse'){const jp=(G.mapPts||[]).find(z=>Math.hypot(z.px-x,z.py-y)<18);if(jp){G.mapTipPin=null;const tip=$('#mapTip');tip.innerHTML=`<b>ТОЧКА ПРЫЖКА ${jp.label}</b><span>${sectorName(jp.x,jp.y)}</span><button class="wbtn amber" data-mjump="${jp.label}">ПРЫЖОК</button>`;tip.hidden=false;tip.classList.add('bottom');G.mapTipPin=jp;}else{G.mapTipPin=null;$('#mapTip').hidden=true;}}
      else{G.mapTipPin=null;$('#mapTip').hidden=true;}}};
  cvM.addEventListener('pointerup',up);cvM.addEventListener('pointercancel',up);cvM.addEventListener('pointerleave',()=>{if(!G.mapTipPin){$('#mapTip').hidden=true;G.mapHover=null;}});
  cvM.addEventListener('wheel',e=>{if(G.state!=='map')return;e.preventDefault();const r=cvM.getBoundingClientRect();mapZoom(e.deltaY>0?1.25:1/1.25,e.clientX-r.left,e.clientY-r.top);},{passive:false});
  $('#mapZin').onclick=()=>mapZoom(1/1.4);$('#mapZout').onclick=()=>mapZoom(1.4);$('#mapZme').onclick=()=>{const p=G.player;G.mapView.cx=p.x;G.mapView.cy=p.y;if(isMob()){G.mapView.zx=undefined;G.mapView.tspan=mapSpanDef();}};$('#mapZall').onclick=()=>{G.mapView.zx=undefined;G.mapView.tspan=1e9;G.mapView.cx=WW/2;G.mapView.cy=WH/2;};}
function buildMapLegend(){const L=$('#mapLeg');if(!L||L.dataset.ok)return;L.dataset.ok=1;
  const it=[['open','доступно'],['done','пройдено'],['locked','закрыто · туман'],['boss','комната босса'],['beacon','маяк сектора'],['shop','мастерская'],['hangar','хранилище'],['arsenal','арсенал'],['relay','ретранслятор'],['anom','аномалия'],['abyss','Бездна'],['wreck','корпус VØID'],['wreckx','чужой обломок'],['frag','фрагмент памяти'],['lost','потерянный лом']];
  const box=L.querySelector('.legi');box.innerHTML='';for(const [k,n] of it){const s=document.createElement('span'),c=document.createElement('canvas');c.width=c.height=28*DPR;c.style.width=c.style.height='18px';const g=c.getContext('2d');g.scale(DPR*18/28*1.55,DPR*18/28*1.55);
    mapIcon(g,k,9,9,{small:true,md:2,ok:true});s.appendChild(c);s.appendChild(document.createTextNode(n));box.appendChild(s);}
  const sp=document.createElement('span');sp.innerHTML='<b style="color:#ff4f6e">?</b> неизвестные в Разломе';box.appendChild(sp);
  L.open=innerWidth>640&&!isMob();}

// ---- Разлом (0.4.1): помехи за пределами секторов и Неизвестные ----
function riftEdges(){if(MAPC.edge)return MAPC.edge;const segs=[],STEP=200;
  for(const sc of WORLD.sectors){const [x0,y0,x1,y1]=sc.box;
    for(const [ax,ay,bx,by,nx,ny] of [[x0,y0,x1,y0,0,-1],[x1,y0,x1,y1,1,0],[x0,y1,x1,y1,0,1],[x0,y0,x0,y1,-1,0]]){const L=Math.hypot(bx-ax,by-ay),n=Math.max(1,Math.round(L/STEP));
      for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n,mx=ax+(bx-ax)*(u0+u1)/2,my=ay+(by-ay)*(u0+u1)/2;
        if(!inSectors(mx+nx*12,my+ny*12)&&inSectors(mx-nx*12,my-ny*12))segs.push([ax+(bx-ax)*u0,ay+(by-ay)*u0,ax+(bx-ax)*u1,ay+(by-ay)*u1,nx,ny]);}}}
  return MAPC.edge=segs;}
function riftInfo(x,y){let bd=1e18,bx=x,by=y,bn=null;for(const s of riftEdges()){const dx=s[2]-s[0],dy=s[3]-s[1],L2=dx*dx+dy*dy;let u=((x-s[0])*dx+(y-s[1])*dy)/L2;u=u<0?0:u>1?1:u;
    const px=s[0]+dx*u,py=s[1]+dy*u,d=(x-px)*(x-px)+(y-py)*(y-py);if(d<bd){bd=d;bx=px;by=py;bn=s;}}
  const d=Math.sqrt(bd);return {d:inSectors(x,y)?-d:d,nx:bx,ny:by,ox:bn?bn[4]:0,oy:bn?bn[5]:0};}
const smooth=(a,b,v)=>{const q=clamp((v-a)/(b-a),0,1);return q*q*(3-2*q);};
function riftTarget(d){if(d<=-300)return 0;if(d<=0)return .2*smooth(-300,0,d);if(d<=800)return .2+.5*smooth(0,800,d);return .7+.3*smooth(800,1600,d);}
function updateRift(dt){
  const p=G.player,R_=riftInfo(p.x,p.y);G.riftD=R_.d+riftShift();const tgt=G.riftDeath?1:riftTarget(G.riftD),I0=G.riftI||0;
  G.riftI=I0+(tgt-I0)*(1-Math.exp(-dt/(tgt>I0?.6:.9)));if(G.riftI<.002)G.riftI=0;const I=G.riftI;
  let ox=p.x-R_.nx,oy=p.y-R_.ny;const ol=Math.hypot(ox,oy);if(R_.d>0&&ol>1){ox/=ol;oy/=ol;}else{ox=R_.ox;oy=R_.oy;}
  G.riftBack={x:R_.nx-ox*150,y:R_.ny-oy*150};
  if(I>=.15&&!G.riftB1){G.riftB1=1;banner('ГРАНИЦА СЕКТОРОВ','ПРОСТРАНСТВО НЕСТАБИЛЬНО');sfx('warn');}
  if(I>=.35&&!G.riftB2){G.riftB2=1;banner('РАЗЛОМ','НЕИЗВЕСТНЫЕ КОНТАКТЫ · ВЕРНИТЕСЬ В СЕКТОР');sfx('warn');}
  if(I<.05){G.riftB1=0;G.riftB2=0;}
  const U=G.unk||(G.unk=[]);
  if(I<.25||G.riftDeath){if(U.length)U.length=0;G.unkT0=0;}
  else if(I>=.35||U.length){const want=I<.35?U.length:Math.min(4,1+Math.floor((I-.35)/.65*3.999));
    while(U.length<want){U.push({a:Math.atan2(oy,ox)+rnd(-Math.PI/4,Math.PI/4),r:rnd(700,1000),dir:Math.random()<.5?1:-1,cd:rnd(.6,1.4)});if(!G.unkT0)G.unkT0=G.t;}
    while(U.length>want)U.pop();}
  const base=Math.atan2(oy,ox);
  for(const u of U){u.a+=u.dir*.15*dt;const da=angDiff(u.a,base);if(Math.abs(da)>Math.PI/4){u.a=base+Math.sign(da)*Math.PI/4;u.dir*=-1;}
    u.x=p.x+Math.cos(u.a)*u.r;u.y=p.y+Math.sin(u.a)*u.r;
    if(I<.35||p.hp<=0||G.deadT>0)continue;u.cd-=dt;
    if(u.cd<=0){u.cd=(2.2-1.5*clamp((I-.35)/.65,0,1))*rnd(.85,1.15);
      const dist=Math.hypot(p.x-u.x,p.y-u.y),tt=dist/980;let tx=p.x+p.vx*tt,ty=p.y+p.vy*tt;
      if(G.t-G.unkT0<2.5){const side=Math.atan2(ty-u.y,tx-u.x)+Math.PI/2,off=rnd(120,180)*(Math.random()<.5?1:-1);tx+=Math.cos(side)*off;ty+=Math.sin(side)*off;}
      const a=Math.atan2(ty-u.y,tx-u.x)+rnd(-.08,.08);G.eb.push({x:u.x,y:u.y,vx:Math.cos(a)*980,vy:Math.sin(a)*980,dmg:0,col:'#ff4f6e',r:4,life:1.6,rift:true});
      if(AU.ctx&&SET.sfx){const c=AU.ctx,t=c.currentTime,o=c.createOscillator(),g=c.createGain(),pn=c.createStereoPanner();o.type='square';o.frequency.value=2200;g.gain.setValueAtTime(.02,t);g.gain.exponentialRampToValueAtTime(.0001,t+.04);pn.pan.value=clamp((u.x-p.x)/800,-1,1);o.connect(g);g.connect(pn);pn.connect(AU.sfx);o.start(t);o.stop(t+.05);}}}
  if(I<.35)for(const b of G.eb)if(b.rift&&b.life>.3)b.life=.3;
  // аномалия и крейсер
  if(G.anom&&G.riftD>0){banner('АНОМАЛИЯ ПРОВАЛЕНА','ВЫ ПОКИНУЛИ СЕКТОР · ПОВТОР ЧЕРЕЗ 30 С');(G.anomCd||(G.anomCd={}))[G.anom.a.id]=G.t+30;endAnom();}
}
function riftKill(){/*DEVW*/if(window.DEVW&&DEVW.on()&&G.dev.god)return;const p=G.player;if(!p||p.hp<=0||G.deadT>0)return;p.hp=0;G.riftDeath=1;G.riftI=1;
  for(let i=0;i<70;i++){const a=rnd(0,TAU),v=rnd(40,380);part(p.x,p.y,Math.cos(a)*v,Math.sin(a)*v,rnd(.4,1.3),Math.random()<.5?'#ffffff':shipCol(),rnd(1.5,3.5));}
  sfx('bigboom');shake(14);G.deadT=1.8;G.save.riftDeaths=(G.save.riftDeaths||0)+1;banner('ПРОСТРАНСТВО ОТТОРГЛО КОРАБЛЬ','ВОСПОМИНАНИЕ ИЗЪЯТО');storyDeath(true);}
function riftNoise(){if(MAPC.noise)return MAPC.noise;const c=document.createElement('canvas');c.width=c.height=160;const g=c.getContext('2d'),im=g.createImageData(160,160);
  for(let i=0;i<im.data.length;i+=4){const v=Math.random()*255|0;im.data[i]=v;im.data[i+1]=v;im.data[i+2]=Math.min(255,v+20);im.data[i+3]=Math.random()<.45?255:0;}g.putImageData(im,0,0);return MAPC.noise=c;}
// экранные помехи (после отрисовки мира, экранные координаты)
function drawRiftFx(I,t){
  if(I<.02&&!G.riftDeath)return;const w=cv.width,h=cv.height,fx=SET.fx;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  let src=cv;if(I>=.15){let sn=MAPC.snap;if(!sn){sn=MAPC.snap=document.createElement('canvas');}if(sn.width!==w||sn.height!==h){sn.width=w;sn.height=h;}const sg=sn.getContext('2d');sg.globalCompositeOperation='copy';sg.drawImage(cv,0,0);src=sn;}
  if(fx&&I>=.35){const n=8+Math.round(6*I),sh=Math.ceil(h/n),amp=(I-.35)/.65*18*DPR;for(let i=0;i<n;i++){const off=Math.sin(t*6+i*.9)*amp;if(Math.abs(off)<.5)continue;ctx.drawImage(src,0,i*sh,w,sh,off,i*sh,w,sh);}}
  if(I>=.15){const n=2+Math.round(4*I);for(let i=0;i<n;i++){const y=Math.random()*h,bh=(4+Math.random()*24)*DPR,off=(Math.random()-.5)*2*(4+26*I)*DPR;ctx.drawImage(src,0,y,w,bh,off,y,w,bh);}}
  if(fx&&I>=.25){const o=(1+5*(I-.25)/.75)*DPR;ctx.globalCompositeOperation='screen';ctx.globalAlpha=.2;ctx.drawImage(src,(t*60|0)%2?o:-o,o*.3);
    ctx.globalCompositeOperation='multiply';ctx.globalAlpha=.06*I;ctx.fillStyle='#ff3060';ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;}
  const pat=ctx.createPattern(riftNoise(),'repeat'),ga=Math.min(.82,.04+.5*Math.pow(I,1.4)+(I>.85?(I-.85)*2.2:0));ctx.translate(Math.random()*160,Math.random()*160);ctx.globalAlpha=ga;ctx.fillStyle=pat;ctx.fillRect(-160,-160,w+320,h+320);ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
  if(I>=.5){const v=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.25,w/2,h/2,Math.max(w,h)*.7);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,`rgba(4,2,8,${Math.min(.85,(I-.5)*1.5)})`);ctx.fillStyle=v;ctx.fillRect(0,0,w,h);
    if(fx&&Math.random()<.04*I){ctx.fillStyle='rgba(0,0,0,.85)';ctx.fillRect(0,Math.random()*h,w,(10+Math.random()*60)*DPR);}}
  if(G.riftDeath&&G.deadT>0){const q=clamp((1.8-G.deadT)/1.8,0,1);ctx.fillStyle=`rgba(2,2,6,${smooth(.4,1,q)})`;ctx.fillRect(0,0,w,h);}
  ctx.restore();}


