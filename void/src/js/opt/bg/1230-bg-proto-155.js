/* ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ BG·PROTO 1.5.5 α «Небо» · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
   Прототип: небо сектора I «Пояс Стража» — в открытом мире и в миссиях 01–06 (мета-промпт «фон первого сектора»).
   КАК ВЫРЕЗАТЬ: удалить всё от «BG·PROTO … НАЧАЛО» до «BG·PROTO … КОНЕЦ» и убрать m67 из сборки (строка изоляции выше — оставить).
   Следы в данных: SET.sky — лишний ключ, старый код его не читает.
   ПРАВИЛА (из мета-промпта):
   · фон — сцена, а не действие: вся яркость фона в нижней трети, центр боя спокойный, одна главная деталь — Маяк Ядра;
   · одно небо на сектор: свой ГСЧ (mulberry по сиду), ни одного Math.random; экран меняет только кадрирование;
   · всё дорогое — один раз заранее и по частям (панорама, плитки звёзд), в кадре — только сложить готовое;
   · бой не меняется: модуль только рисует, читает лишь камеру, корабль и номер миссии;
   · под автотестами (navigator.webdriver) небо выключено, пока тест не попросит window.__sky67. */

const BG67={ver:'1.5.5',dead:0,err:0,job:null,pano:{},tiles:null,tileK:0,mids:null,dust:null,ev:{shoot:null,walk:null,eclipse:null,idle:0,nextShoot:0,nextWalk:0,eclipseDone:0},
  heroP:null,fade:0,lastKey:'',lastCam:null,lvlCut:0,slow:[],stats:{ms:0,max:0,n:0,build:0,chunkMax:0,mem:0},dev:{off:{},lvl:'auto',m:0,zones:false},noStars:[],dith:null,log:[]};
/* сиды и опорные точки сектора */
const BG67SEED=6701,BG67SEC={x0:0,y0:14000,x1:5000,y1:20000},BG67CORE={x:4200,y:18300};
/* рамка сектора I и Ядро — из данных мира (координаты мира сдвигаются при запуске) */
function bg67Geo(){if(BG67.geo)return;try{const b=WORLD.sectors[0].box;Object.assign(BG67SEC,{x0:b[0],y0:b[1],x1:b[2],y1:b[3]});const n=WORLD.nodes.find(n=>n.m===6);if(n)Object.assign(BG67CORE,{x:n.x,y:n.y});BG67.geo=1;}catch(e){}}
/* миссии 01–06: «небо = часы пути». pos — место Маяка в кадре (доли), pts — три точки Дуги в долях кадра */
const BG67M={
  1:{pos:[.86,.2],halo:26,rays:80,core:2.2,pts:[[-.05,.32],[.17,.12],[.42,-.05]],arcA:.85,arcTh:1,dens:.75,peak:.2,white:0,violet:1,glow:.8,lanes:.7,voids:1,stretch:[1,1],mid:0,mines:0,dim:0},
  2:{pos:[.83,.22],halo:32,rays:105,core:2.4,pts:[[-.05,.78],[.09,.46],[.3,-.05]],arcA:.95,arcTh:1,dens:.85,peak:.2,white:0,violet:.35,glow:1,lanes:.8,voids:1,stretch:[1,1],mid:5,mines:0,dim:0},
  3:{pos:[.8,.24],halo:36,rays:125,core:2.5,pts:[[.5,1.05],[.78,.9],[1.05,.68]],arcA:1,arcTh:1.2,dens:.9,peak:.21,white:.05,violet:.8,glow:1.1,lanes:.9,voids:0,stretch:[.55,1.6],mid:0,mines:0,dim:0},
  4:{pos:[.74,.2],halo:40,rays:150,core:2.6,pts:[[-.05,.6],[.22,.9],[.6,1.06]],arcA:1.25,arcTh:1.8,dens:.8,peak:.2,white:.05,violet:.6,glow:1,lanes:.9,voids:1,stretch:[1,1],mid:0,mines:1,dim:.15},
  5:{pos:[.72,.24],halo:50,rays:200,core:2.9,pts:[[-.05,.55],[.2,.16],[.5,-.06]],arcA:1.1,arcTh:1.4,dens:.95,peak:.21,white:.15,violet:.7,glow:1.05,lanes:1,voids:0,stretch:[1,1],mid:2,mines:0,dim:0,corridor:1},
  6:{pos:[.68,.27],halo:60,rays:230,core:3.2,pts:null,ring:{rx:.42,ry:.1,rot:-.21},arcA:1.2,arcTh:1.4,dens:.95,peak:.23,white:.3,violet:.5,glow:1.05,lanes:.8,voids:0,stretch:[1,1],mid:0,mines:0,dim:0}};
const BG67NUM=['halo','rays','core','arcA','arcTh','dens','peak','white','violet','glow','lanes','voids','dim'];

/* ---------- включено ли небо ---------- */
function bg67Bot(){try{return !!navigator.webdriver&&!window.__sky67;}catch(e){return false;}}
function bg67Where(){bg67Geo();if(BG67.dead||bg67Bot()||G.state==='menu'||!G.player)return null;
  if(G.world){const c=bg67CamC();if(c.x>BG67SEC.x1+400||c.y<BG67SEC.y0-1200||c.y>BG67SEC.y1+1200)return null;return {k:'w',m:BG67.dev.m||0,blend:bgSS(BG67SEC.x1-400,BG67SEC.x1+400,c.x)};}
  if(inMission()&&G.m>=1&&G.m<=6&&(G.mode==='world'||G.mode==='dev')&&G.mode!=='endless')return {k:'m',m:BG67.dev.m||G.m,blend:0};return null;}
/* центр камеры в единицах мира/арены */
function bg67CamC(){if(G.world||G.arena)return {x:CX+VW/2,y:CY+VH/2};const p=G.player;return p?{x:p.x,y:p.y}:{x:W/2,y:H/2};}
const bgSS=(a,b,x)=>{x=(x-a)/(b-a);x=x<0?0:x>1?1:x;return x*x*(3-2*x);};
function bg67Lvl(){if(BG67.dev.lvl!=='auto')return +BG67.dev.lvl;let l=G.lowFx?0:isMob()?((G.q===undefined?1:G.q)>=2?2:(G.q===0?0:1)):2;return Math.max(0,l-BG67.lvlCut);}
const bg67Fx=()=>!!SET.fx&&!G.lowFx;
const bg67Calm=()=>!!(RMQ&&RMQ.matches)||SET.cine==='calm';

/* ---------- шум: значения на решётке, плавная интерполяция; period>0 — бесшовный ---------- */
function bg67Noise(seed,period){const R=mulberry(seed),p=[];for(let i=0;i<256;i++)p.push(i);for(let i=255;i>0;i--){const j=Math.floor(R()*(i+1)),t=p[i];p[i]=p[j];p[j]=t;}
  const P=new Uint16Array(512);for(let i=0;i<512;i++)P[i]=p[i&255];const V=new Float32Array(256);for(let i=0;i<256;i++)V[i]=R();const Q=period|0;
  return (x,y)=>{let xi=Math.floor(x),yi=Math.floor(y);const xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);let x1=xi+1,y1=yi+1;
    if(Q){xi=((xi%Q)+Q)%Q;yi=((yi%Q)+Q)%Q;x1=(xi+1)%Q;y1=(yi+1)%Q;}xi&=255;yi&=255;x1&=255;y1&=255;
    const a=V[P[xi+P[yi]]],b=V[P[x1+P[yi]]],c=V[P[xi+P[y1]]],d=V[P[x1+P[y1]]];return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;};}
/* каждая октава повёрнута на ~37° — у шума значений пропадают «клетки» по осям */
function bg67Fbm(n,x,y,o){let s=0,a=.5,m=0;const C=.8,S_=.6;for(let i=0;i<o;i++){s+=a*n(x+i*17.3,y-i*9.1);m+=a;a*=.5;const nx=(C*x-S_*y)*2.03,ny=(S_*x+C*y)*2.03;x=nx;y=ny;}return s/m;}

/* ---------- описание неба: миссия или точка мира ---------- */
function bg67Spec(W_){if(W_.k==='m'||W_.m){const M=BG67M[W_.m]||BG67M[1];return Object.assign({m:W_.m},M);}
  const c=bg67CamC(),o={m:0},ws=[];let sum=0;for(let m=1;m<=6;m++){const n=WORLD.nodes[m-1];if(!n)continue;const d=Math.hypot(n.x-c.x,n.y-c.y),w=1/(d*d+700*700);ws.push([m,w]);sum+=w;}
  for(const k of BG67NUM){let v=0;for(const [m,w] of ws)v+=(BG67M[m][k]||0)*w;o[k]=v/sum;}
  /* у минного поля мира небо темнее и с огнями мин; у полей обломков — силуэты */
  const mf=(WORLD.minefields||[])[0];o.mines=mf?bgSS(1400,500,Math.hypot(mf.x-c.x,mf.y-c.y)):0;o.dim=Math.max(o.dim,.15*o.mines);
  const pts=[[0,0],[0,0],[0,0]];let ps=0;for(const [m,w] of ws){const P=BG67M[m].pts||BG67M[5].pts;for(let i=0;i<3;i++){pts[i][0]+=P[i][0]*w;pts[i][1]+=P[i][1]*w;}ps+=w;}for(const q of pts){q[0]/=ps;q[1]/=ps;}o.pts=pts;o.stretch=[1,1];
  const dc=Math.hypot(BG67CORE.x-c.x,BG67CORE.y-c.y);o.coreNear=bgSS(1200,350,dc);o.ring=o.coreNear>.5?BG67M[6].ring:null;return o;}

/* ---------- кадр: размеры в единицах, коэффициенты ---------- */
function bg67Frame(){const k=DPR*SC,fw=VW,fh=VH,portrait=fh>fw;return {k,fw,fh,portrait,cw:cv.width,ch:cv.height,min:Math.min(fw,fh)};}
/* разрешение панорамы: ~1/3,5 экрана, по короткой стороне кадра 300…540 px */
function bg67Res(F){return Math.max(300/F.min,Math.min(540/F.min,F.k/3.5));}
const BG67PAR=.04,BG67M_PX=60;/* запас по краю панорамы, ед. */
/* ключ неба. Миссия: точный размер кадра (Маяк и свет к нему запечены). Мир: панорама собирается с запасом 20 % и годится,
   пока кадр в неё помещается и не меньше 55 % — масштаб мира на телефоне «дышит» со скоростью, и пересборок на ходу быть не должно */
function bg67Key(W_,F){const b=Math.round(F.fw/48)+'x'+Math.round(F.fh/48);if(W_.k!=='w')return 'm'+W_.m+'|'+b;
  const r=bg67Res(F);for(const k in BG67.pano){const P=BG67.pano[k];if(k[0]==='w'&&F.fw<=P.cfw&&F.fh<=P.cfh&&F.fw>=P.cfw*.55&&F.fh>=P.cfh*.55&&Math.abs(r/P.r-1)<.4)return k;}
  if(BG67.job&&BG67.job.key[0]==='w'){const J=BG67.job;if(F.fw<=J.cfw&&F.fh<=J.cfh&&F.fw>=J.cfw*.55&&F.fh>=J.cfh*.55)return J.key;}return 'w|'+b;}

/* ---------- ПАНОРАМА: глубина + туман + свечение к Маяку + маска тёмных полос (по частям, без рывков) ---------- */
function bg67Start(key,W_,F0,S){const F=W_.k==='w'?Object.assign({},F0,{fw:F0.fw*1.2,fh:F0.fh*1.2}):F0,r=bg67Res(F0),mx=W_.k==='w'?BG67PAR*(BG67SEC.x1-BG67SEC.x0+400):BG67M_PX*2,my=W_.k==='w'?BG67PAR*(BG67SEC.y1-BG67SEC.y0+400):BG67M_PX*2;
  const uw=F.fw+mx+BG67M_PX*2,uh=F.fh+my+BG67M_PX*2,w=Math.ceil(uw*r),h=Math.ceil(uh*r);
  const c=document.createElement('canvas');c.width=w;c.height=h;/* полосы пыли — низкие частоты: их маска в половину разрешения (память и время вдвое меньше) */const lw=Math.ceil(w/2),lh=Math.ceil(h/2),l=document.createElement('canvas');l.width=lw;l.height=lh;
  const hero=W_.k==='m'?bg67HeroFrame(S,F):null;/* в миссии Маяк неподвижен — свет и туман к нему запекаются */
  BG67.job={key,W:W_,S,F,r,uw,uh,w,h,c,l,cfw:F.fw,cfh:F.fh,img:c.getContext('2d').createImageData(w,h),lim:l.getContext('2d').createImageData(lw,lh),lw,row:0,t0:performance.now(),spent:0,
    hx:hero?(hero.x+(W_.k==='m'?BG67M_PX:0)+BG67M_PX)*r:-1e9,hy:hero?(hero.y+BG67M_PX+BG67M_PX)*r:-1e9,
    n1:bg67Noise(BG67SEED+1),n2:bg67Noise(BG67SEED+2),n3:bg67Noise(BG67SEED+3),n4:bg67Noise(BG67SEED+4),n5:bg67Noise(BG67SEED+5),n6:bg67Noise(BG67SEED+6),R:mulberry(BG67SEED+7+(W_.m||0))};
  bg67Note('сборка',key+' · '+w+'×'+h);bg67Idle();}
/* сборка идёт и в простое браузера между кадрами (где он это умеет) — небо готово раньше, кадры не страдают */
function bg67Idle(){if(typeof requestIdleCallback!=='function'||BG67.idleOn)return;BG67.idleOn=1;const f=d=>{BG67.idleOn=0;if(!BG67.job||BG67.dead)return;const r=d.timeRemaining();if(r>3){const t1=performance.now();bg67Step(Math.min(8,r-2));BG67.stats.idle=(BG67.stats.idle||0)+performance.now()-t1;}BG67.idleOn=1;requestIdleCallback(f,{timeout:250});};requestIdleCallback(f,{timeout:250});}
function bg67Step(budget){const J=BG67.job;if(!J)return;const t0=performance.now(),S=J.S,d=J.img.data,L=J.lim.data,w=J.w,h=J.h,r=J.r,sc=3.4/760,st=S.stretch||[1,1];
  const T1=[31,111,143],T2=[44,79,138],VI=[90,63,140],WH=[205,230,255],diag=Math.hypot(w,h),wide=W_isWorld(J);
  while(J.row<h&&performance.now()-t0<budget){const y=J.row++;for(let x=0;x<w;x++){const U=x/r,V=y/r,X=U*sc*st[0],Y=V*sc*st[1];
      const qx=bg67Fbm(J.n2,X*.8,Y*.8,3),qy=bg67Fbm(J.n3,X*.8+5.2,Y*.8+1.3,3),f=bg67Fbm(J.n1,X+3.2*qx,Y+3.2*qy,4);
      let near=0;if(!wide){const dh=Math.hypot(x-J.hx,y-J.hy)/diag;near=Math.exp(-dh*dh/(2*.23*.23));}else near=.4;
      const den=bgSS(.4-.08*S.dens,.88,f)*(.26+.84*near)*S.dens,mix=bg67Fbm(J.n4,X*.6,Y*.6,2),vio=bgSS(.66,.82,bg67Fbm(J.n3,X*1.4+9,Y*1.4,2))*S.violet;
      const gy=y/h;let R_=3+2*gy,G_=6+4*gy,B_=12+9*gy;
      if(!wide){const dh=Math.hypot(x-J.hx,y-J.hy)/diag,gl=Math.exp(-dh*dh/(2*.2*.2))*S.glow,gw=Math.exp(-dh*dh/(2*.5*.5))*S.glow;R_+=10*gl+3*gw;G_+=22*gl+6*gw;B_+=36*gl+11*gw;}
      const warm=near*near*S.white,a=den*S.peak;
      for(let i=0;i<3;i++){let c=T1[i]*(1-mix)+T2[i]*mix;c=c*(1-vio*.7)+VI[i]*vio*.7;c=c*(1-warm)+WH[i]*warm;if(i===0)R_+=c*a;else if(i===1)G_+=c*a;else B_+=c*a;}
      const dt=(J.R()-.5)*1.7,o=(y*w+x)*4;d[o]=R_+dt;d[o+1]=G_+dt;d[o+2]=B_+dt;d[o+3]=255;
      /* тёмные полосы — гребни низкочастотного шума; пустоты — редкая россыпь звёзд */
      if(!(x&1)&&!(y&1)){const q=bg67Fbm(J.n6,X*.75,Y*.75,2),lf=bg67Fbm(J.n5,X*.58+.7*q,Y*.58+.7*q,3),ridge=1-Math.abs(2*lf-1);let la=bgSS(.72,.97,ridge)*.6*S.lanes;
      if(S.voids)la=Math.max(la,bgSS(.58,.74,bg67Fbm(J.n4,X*.45+3,Y*.45-2,2))*.3*S.voids);
      /* 05 «Копьё во тьме»: тёмный коридор от центра боя к Маяку — Маяк как наконечник в конце тьмы */if(S.corridor&&J.hx>-1e8){const ax=w/2,ay=h/2,bx=J.hx,by=J.hy,vx=bx-ax,vy=by-ay,L2=vx*vx+vy*vy||1;let tt=((x-ax)*vx+(y-ay)*vy)/L2;tt=tt<0?0:tt>1?1:tt;const dd=Math.hypot(x-ax-vx*tt,y-ay-vy*tt)/diag;la=Math.max(la,(1-bgSS(.05,.13,dd))*.42*S.corridor*bgSS(1,.8,tt));}
      const lo=((y>>1)*J.lw+(x>>1))*4;L[lo]=2;L[lo+1]=4;L[lo+2]=10;L[lo+3]=la*255;}}}
  J.spent+=performance.now()-t0;BG67.stats.chunkMax=Math.max(BG67.stats.chunkMax,performance.now()-t0);
  if(J.row>=h){J.c.getContext('2d').putImageData(J.img,0,0);J.l.getContext('2d').putImageData(J.lim,0,0);
    const P={key:J.key,c:J.c,l:J.l,r,uw:J.uw,uh:J.uh,w,h,W:J.W,F:J.F,cfw:J.cfw,cfh:J.cfh,born:performance.now(),build:J.spent};
    BG67.pano[J.key]=P;bg67Mem();/* памяти — не больше 11 МБ на ПК и 5,5 МБ на телефоне: лишние (старые) панорамы выбрасываем, всего не больше двух */{const lim=(isMob()?5.5:11)*1048576;let ks=Object.keys(BG67.pano).filter(k=>k!==J.key).sort((a,b)=>BG67.pano[a].born-BG67.pano[b].born);while(ks.length&&(BG67.stats.mem>lim||ks.length>1)){delete BG67.pano[ks.shift()];bg67Mem();}}BG67.stats.build=J.spent;bg67Note('готово',J.key+' · '+J.spent.toFixed(0)+' мс');BG67.job=null;bg67Mem();}}
const W_isWorld=J=>J.W.k==='w';
function bg67Mem(){let b=0;for(const k in BG67.pano){const P=BG67.pano[k];b+=P.w*P.h*4+P.l.width*P.l.height*4;}if(BG67.tiles)for(const T of BG67.tiles)b+=T.c.width*T.c.height*4;BG67.stats.mem=b;}

/* ---------- ЗВЁЗДЫ: три бесшовные плитки (509 / 631 / 733 px), три семьи цвета, скопления; мерцающие — живые ---------- */
/* плитки строятся по одной за кадр (без рывка); на телефоне — меньше (281 / 347 / 401 px), ради памяти */
function bg67Tiles(F){const k=F.k,key=k.toFixed(2)+(isMob()?'m':'');if(!BG67.tiles||BG67.tileK!==key){BG67.tiles=[];BG67.tileK=key;}if(BG67.tiles.length>=3)return BG67.tiles;const px=DPR>=2?1.4:1;
  const L=isMob()?[[281,.02,.5,.85],[347,.035,.35,1],[401,.06,.15,1.15]]:[[509,.02,.5,.85],[631,.035,.35,1],[733,.06,.15,1.15]];const fam=[['191,230,255',.55],['240,244,255',.35],['255,226,194',.10]];
  const ti=BG67.tiles.length;BG67.tiles.push([L[ti]].map(([sz,par,share,br])=>{const c=document.createElement('canvas');c.width=c.height=sz;const g=c.getContext('2d'),R=mulberry(BG67SEED+40+ti),cl=bg67Noise(BG67SEED+50+ti,4);
    const N=Math.round((sz/k)*(sz/k)/1800*share*1.15),tw=[];for(let i=0;i<N;i++){const x=R()*sz,y=R()*sz,keep=.25+.75*bgSS(.3,.72,bg67Fbm(cl,x/sz*4,y/sz*4,1));if(R()>keep)continue;
      const f=R(),F_=f<.55?fam[0]:f<.9?fam[1]:fam[2];const a=(.22+R()*.38)*br,s=(R()<.25?1.5:1)*px;
      if(R()<.12){tw.push({x,y,a,s,col:F_[0],ph:R()*6.28,fr:.9+R()*2.2});continue;}g.fillStyle=`rgba(${F_[0]},${a.toFixed(3)})`;g.fillRect(x,y,s,s);}
    return {c,sz,par,tw};})[0]);bg67Mem();return BG67.tiles;}
/* яркие звёзды — живые, со своим крошечным крестом, не ближе 0,25 короткой стороны к центру кадра */
function bg67Bright(){if(BG67.br)return BG67.br;const R=mulberry(BG67SEED+60),a=[];for(let i=0;i<46;i++)a.push({u:R(),v:R(),a:.55+R()*.2});return BG67.br=a;}
/* сглаживающий шум ±1/255 на весь экран против полос на тёмных градиентах */
function bg67Dither(){if(BG67.dith)return BG67.dith;const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),d=g.createImageData(128,128),R=mulberry(BG67SEED+70);
  for(let i=0;i<d.data.length;i+=4){const v=R()<.5?0:2;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255;}g.putImageData(d,0,0);return BG67.dith=ctx.createPattern(c,'repeat');}

/* ---------- МАЯК: место в кадре (единицы от левого верхнего угла кадра) ---------- */
function bg67Hud(F){const k=SC,mob=isMob();return {t:((mob?64:84)+(SAFE.t||0))/k,b:((mob?150:92)+(SAFE.b||0))/k,l:((SAFE.l||0)+12)/k,r:((SAFE.r||0)+12)/k};}
function bg67Clamp(x,y,F,S){const hd=bg67Hud(F),m=(S.halo||30)*.6,cx=F.fw/2,cy=F.fh/2,lim=.9*F.min;
  x=Math.max(cx-lim,Math.min(cx+lim,x));x=Math.max(hd.l+m,Math.min(F.fw-hd.r-m,x));y=Math.max(hd.t+m,Math.min(F.fh-hd.b-m,y));
  /* вне центрального эллипса боя */let ex=(x-cx)/(.3*F.fw),ey=(y-cy)/(.3*F.fh),e=Math.hypot(ex,ey);if(e<1.15&&e>1e-3){const s=1.15/e;x=cx+(x-cx)*s;y=cy+(y-cy)*s;}
  if(F.portrait&&y>F.fh*.45)y=F.fh*.45;/* без скачков: просто не ниже середины */return {x,y};}
function bg67HeroFrame(S,F){let fx=S.pos[0],fy=S.pos[1];if(F.portrait){fy=Math.min(fy*.8,.2);}return bg67Clamp(fx*F.fw,fy*F.fh,F,S);}
/* 1.5.7: в мире Маяк — самая дальняя точка неба: стоит на месте (вверху слева — справа в мире миникарта и «КАРТА») и смещается только параллаксом 0,01 — через весь сектор на ~50 ед. */
function bg67HeroWorld(S,F){BG67.heroVis=1;const c=bg67CamC(),P=bg67Clamp((F.portrait?.24:.28)*F.fw,(F.portrait?.17:.2)*F.fh,F,{halo:30});return {x:P.x-(c.x-(BG67SEC.x0+BG67SEC.x1)/2)*.01,y:P.y-(c.y-(BG67SEC.y0+BG67SEC.y1)/2)*.01};}

/* ---------- ОТРИСОВКА НЕБА (до игры) ---------- */
function bg67Draw(t,W_){const F=bg67Frame(),S=bg67Spec(W_),key=bg67Key(W_,F),lvl=bg67Lvl(),fx=bg67Fx(),calm=bg67Calm(),off=BG67.dev.off;
  /* смена кадра (поворот, окно тянут мышью): новое небо начинаем собирать, когда размер 150 мс не меняется; до тех пор — прежнее */const nowMs=performance.now();if(key!==BG67.lastKey){if(BG67.wantKey!==key){BG67.wantKey=key;BG67.wantT=nowMs;}const first=!BG67.lastKey||BG67.lastKey[0]!==key[0]||BG67.lastKey.split('|')[0]!==key.split('|')[0];if(first||nowMs-BG67.wantT>=150||BG67.pano[key]){if(!BG67.pano[key]&&!(BG67.job&&BG67.job.key===key))bg67Start(key,W_,F,S);BG67.lastKey=key;}}
  BG67.stepMs=0;if(BG67.job){const t1=performance.now();bg67Step(G.state==='intro'||G.state==='pause'?14:(isMob()?6:5));BG67.stepMs=performance.now()-t1;}
  let P=BG67.pano[key];if(!P){/* пока новое небо собирается — показываем уже готовое (растянутое) или старое */const ks=Object.keys(BG67.pano).filter(k=>k[0]===key[0]&&(k[0]!=='m'||k.split('|')[0]===key.split('|')[0]));P=ks.length?BG67.pano[ks[0]]:null;}
  if(!P){BG67.fresh=true;return false;}
  const fadeIn=Math.min(1,(performance.now()-P.born)/450);const A=(1-W_.blend)*(BG67.fresh?fadeIn:1);if(fadeIn>=1)BG67.fresh=false;
  const cw=F.cw,ch=F.ch,k=F.k;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
  if(A<1)bg67OldSky(t);ctx.globalAlpha=A;
  /* 1 · панорама */const cam=bg67CamC();let su,sv;if(W_.k==='w'){su=BG67M_PX+BG67PAR*(cam.x-VW/2-BG67SEC.x0+200);sv=BG67M_PX+BG67PAR*(cam.y-VH/2-BG67SEC.y0+200);}
  else{const off_=G.arena?{x:cam.x-W/2,y:cam.y-H/2}:{x:cam.x-W/2,y:cam.y-H/2};su=BG67M_PX*2+BG67PAR*off_.x;sv=BG67M_PX*2+BG67PAR*off_.y;}
  su=Math.max(0,Math.min(P.uw-F.fw,su));sv=Math.max(0,Math.min(P.uh-F.fh,sv));const sw=Math.min(F.fw,P.uw),sh=Math.min(F.fh,P.uh);
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='low';if(!off.far){ctx.drawImage(P.c,su*P.r,sv*P.r,sw*P.r,sh*P.r,0,0,cw,ch);
    const br=SET.sky||'norm';if(br==='bright'){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=A*.32;ctx.drawImage(P.c,su*P.r,sv*P.r,sw*P.r,sh*P.r,0,0,cw,ch);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=A;}
}
  else{ctx.fillStyle='#03060c';ctx.fillRect(0,0,cw,ch);}
  BG67.heroVis=1;const hero=W_.k==='w'?bg67HeroWorld(S,F):bg67HeroFrame(S,F);BG67.heroP=hero;
  /* 2 · в мире свет и туман к Маяку живые (в миссии запечены) */
  if(W_.k==='w'&&!off.far){const hx=hero.x*k,hy=hero.y*k,R=Math.hypot(cw,ch)*.75;let g=ctx.createRadialGradient(hx,hy,0,hx,hy,R);g.addColorStop(0,`rgba(40,96,140,${(.16*S.glow).toFixed(3)})`);g.addColorStop(.45,`rgba(24,60,100,${(.06*S.glow).toFixed(3)})`);g.addColorStop(1,'rgba(12,30,60,0)');
    ctx.globalCompositeOperation='lighter';ctx.fillStyle=g;ctx.fillRect(0,0,cw,ch);if(S.white>.02){const r2=Math.min(cw,ch)*(.25+.3*S.white);g=ctx.createRadialGradient(hx,hy,0,hx,hy,r2);g.addColorStop(0,`rgba(205,230,255,${(.12*S.white).toFixed(3)})`);g.addColorStop(1,'rgba(205,230,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,cw,ch);}ctx.globalCompositeOperation='source-over';}
  /* 3 · звёзды */const bk=SET.sky==='bright'?1.25:SET.sky==='dim'?.75:1;
  if(!off.stars){const T=bg67Tiles(F);for(let i=0;i<T.length;i++){if(lvl===0&&i>0)break;if(lvl===1&&i===1)continue;/* уровень 1: дальний и ближний слои, без среднего */const Ti=T[i],ox=-(((cam.x*Ti.par*k)%Ti.sz)+Ti.sz)%Ti.sz,oy=-(((cam.y*Ti.par*k)%Ti.sz)+Ti.sz)%Ti.sz;ctx.globalAlpha=A*bk;
      for(let x=ox;x<cw;x+=Ti.sz)for(let y=oy;y<ch;y+=Ti.sz)ctx.drawImage(Ti.c,x,y);
      if(lvl>=1)for(const s of Ti.tw){const a=fx&&!calm?s.a*(1+(SET.lessFx?.12:.25)*Math.sin(t*s.fr+s.ph)):s.a;ctx.fillStyle=`rgba(${s.col},${(a*A*bk).toFixed(3)})`;for(let x=ox;x<cw;x+=Ti.sz)for(let y=oy;y<ch;y+=Ti.sz)ctx.fillRect(x+s.x,y+s.y,s.s,s.s);}}}
  ctx.globalAlpha=A;
  /* 4 · тёмные полосы глушат звёзды и туман */if(!off.lanes&&!off.far)ctx.drawImage(P.l,su*P.r/2,sv*P.r/2,sw*P.r/2,sh*P.r/2,0,0,cw,ch);
  /* 5 · яркие звёзды */if(!off.stars&&lvl>=1){const B=bg67Bright(),pu=P.uw,pv=P.uh;for(const b of B){const x=(b.u*pu-su-(cam.x*.0))*k,y=(b.v*pv-sv)*k;if(x<-10||y<-10||x>cw+10||y>ch+10)continue;
      const ex=(x/cw-.5)/.36,ey=(y/ch-.5)/.36,e=ex*ex+ey*ey;if(e<1)continue;const hd=bg67Hud(F);if(y<hd.t*k||y>ch-hd.b*k)continue;const a=b.a*A*bk*Math.min(1,(e-1)*2),L=6*k,p=DPR>=2?2:1.5;
      ctx.fillStyle=`rgba(240,248,255,${a.toFixed(3)})`;ctx.fillRect(x-p/2,y-p/2,p,p);ctx.strokeStyle=`rgba(200,236,255,${(a*.35).toFixed(3)})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-L,y);ctx.lineTo(x+L,y);ctx.moveTo(x,y-L);ctx.lineTo(x,y+L);ctx.stroke();}}
  /* 6 · Дуга Пояса */if(!off.arc)bg67Arc(t,S,F,hero,A,lvl,fx&&!calm,W_);
  /* камни среднего плана (в кадре) — заранее: от них зависит, насколько закрыт Маяк */const rocks=lvl>=1&&!off.mid?bg67MidGeo(t,S,F,W_,calm):[];const occ=bg67Occ(hero,F,rocks),Rh=Math.max(6,(S.halo||30)*k),hid=bgSS(Rh*.5,-Rh*.9,occ.sd);BG67.occ={sd:occ.sd,hid,n:rocks.length};
  /* 7 · Маяк Ядра */if(!off.hero)bg67Hero(t,S,F,hero,A,fx&&!calm,hid);
  /* 8 · огни мин вдали (04 и минное поле мира), если их не рисует кино 1.5.0 */if(S.mines>.02&&!off.far&&!bg67CineMines())bg67Mines(t,S,F,A,fx&&!calm);
  /* 9 · редкие события и пыль — тоже позади камней */if(W_.k==='w'&&lvl>=2&&fx&&!calm&&!off.ev)bg67Events(t,S,F,hero,A);bg67Dust(W_);
  /* 10 · камни: непрозрачные, свет Маяка обтекает их край (затмение) */if(rocks.length)bg67Rocks(t,S,F,hero,A,rocks,occ,Rh,calm);
  /* 10–11 · тень кадра одним слоем: затемнение 04 и «тусклее», тишина центра боя, полосы интерфейса, края 21:9 */{const dm=off.far?0:(S.dim||0)+(SET.sky==='dim'?.24:0);const sh=bg67Shade(F,dm,!off.calm);if(sh){ctx.globalAlpha=A;ctx.drawImage(sh,0,0,cw,ch);ctx.globalAlpha=A;}}
  /* 12 · сглаживающий шум против полос на градиентах (на уровне 2) */if(lvl>=2&&!off.dith){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1;ctx.fillStyle=bg67Dither();ctx.fillRect(0,0,cw,ch);ctx.globalCompositeOperation='source-over';}
  if(BG67.dev.zones)bg67Zones(F,hero);
  ctx.restore();return true;}

/* тень кадра: одна заранее нарисованная картинка в 1/4 разрешения — вместо четырёх-пяти полноэкранных заливок каждый кадр (телефонам важна каждая) */
function bg67Shade(F,dm,calm){const cw=F.cw,ch=F.ch,dq=Math.round(dm*50)/50,key=cw+'x'+ch+'|'+dq+'|'+(calm?1:0)+'|'+Math.round(SAFE.t)+','+Math.round(SAFE.b);if(BG67.shade&&BG67.shade.key===key)return BG67.shade.c;
  const w=Math.max(8,Math.ceil(cw/4)),h=Math.max(8,Math.ceil(ch/4)),c=BG67.shade&&BG67.shade.c||document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),q=w/cw;g.clearRect(0,0,w,h);
  if(dq>0){g.fillStyle=`rgba(2,4,9,${dq.toFixed(3)})`;g.fillRect(0,0,w,h);}
  if(calm){g.save();g.translate(w/2,h/2);g.scale(w*.36,h*.36);const gr=g.createRadialGradient(0,0,0,0,0,1);gr.addColorStop(0,'rgba(3,6,12,.62)');gr.addColorStop(.55,'rgba(3,6,12,.46)');gr.addColorStop(1,'rgba(3,6,12,0)');g.fillStyle=gr;g.fillRect(-1,-1,2,2);g.restore();
    const hd=bg67Hud(F),tb=hd.t*F.k*q,bb=hd.b*F.k*q;let l=g.createLinearGradient(0,0,0,tb*1.3);l.addColorStop(0,'rgba(2,4,9,.22)');l.addColorStop(1,'rgba(2,4,9,0)');g.fillStyle=l;g.fillRect(0,0,w,tb*1.3);
    l=g.createLinearGradient(0,h,0,h-bb*1.3);l.addColorStop(0,'rgba(2,4,9,.22)');l.addColorStop(1,'rgba(2,4,9,0)');g.fillStyle=l;g.fillRect(0,h-bb*1.3,w,bb*1.3);}
  if(F.fw/F.fh>1.9){const core=F.fh*16/9*F.k*q,ed=(w-core)/2;if(ed>1)for(const [x0,x1] of [[0,ed*1.6],[w,w-ed*1.6]]){const l=g.createLinearGradient(x0,0,x1,0);l.addColorStop(0,'rgba(3,6,12,.4)');l.addColorStop(.35,'rgba(3,6,12,.22)');l.addColorStop(.7,'rgba(3,6,12,.06)');l.addColorStop(1,'rgba(3,6,12,0)');g.fillStyle=l;g.fillRect(Math.min(x0,x1),0,ed*1.6,h);}}
  BG67.shade={key,c};return c;}
/* огни мин 04 уже рисует кино 1.5.x (если его блок на месте) — тогда свои не рисуем; связь необязательная, через typeof */
function bg67CineMines(){try{const K=typeof C66!=='undefined'?C66:null;return !!(K&&K['M']&&K['M']['lights']);}catch(e){return false;}}
/* старое небо (для плавного перехода и границы с сектором II) — те же формулы, что в render/renderWorld */
function bg67OldSky(t){if(nebula)ctx.drawImage(nebula,0,0,cv.width,cv.height);const k=DPR*SC;ctx.save();ctx.setTransform(k,0,0,k,0,0);const p=G.player;
  if(G.world){for(const s of stars){const x=((s.x-CX*s.k*2.5)%(W*1.2)+W*1.2)%(W*1.2)-W*.1,y=((s.y-CY*s.k*2.5)%(H*1.2)+H*1.2)%(H*1.2)-H*.1;ctx.globalAlpha=.45+.4*Math.sin(t*1.3+s.tw);ctx.fillStyle=s.k>.06?'#cfeeff':'#7f9ab5';ctx.fillRect(x,y,s.s,s.s);}}
  else{const ox=p?(p.x-W/2):0,oy=p?(p.y-H/2):0;for(const s of stars){const x=((s.x-ox*s.k-t*6*s.k*10)%(VW*1.2)+VW*1.2)%(VW*1.2)-VW*.1,y=((s.y-oy*s.k)%(VH*1.2)+VH*1.2)%(VH*1.2)-VH*.1;ctx.globalAlpha=.45+.4*Math.sin(t*1.3+s.tw);ctx.fillStyle=s.k>.06?'#cfeeff':'#7f9ab5';ctx.fillRect(x,y,s.s,s.s);}}
  ctx.restore();ctx.setTransform(1,0,0,1,0,0);/* у границы с сектором II — его янтарь */if(G.world){const c=bg67CamC(),k2=bgSS(BG67SEC.x1-400,BG67SEC.x1+400,c.x);if(k2>0){ctx.globalAlpha=.1*k2;ctx.fillStyle='#ffb84d';ctx.globalCompositeOperation='soft-light';ctx.fillRect(0,0,cv.width,cv.height);ctx.globalCompositeOperation='source-over';}}ctx.globalAlpha=1;}

/* Дуга Пояса: окружность через три точки (доли кадра); в 06 — кольцо вокруг Маяка */
function bg67Circ(p0,p1,p2){const [ax,ay]=p0,[bx,by]=p1,[cx,cy]=p2,d=2*(ax*(by-cy)+bx*(cy-ay)+cx*(ay-by));if(Math.abs(d)<1e-6)return null;const ux=((ax*ax+ay*ay)*(by-cy)+(bx*bx+by*by)*(cy-ay)+(cx*cx+cy*cy)*(ay-by))/d,uy=((ax*ax+ay*ay)*(cx-bx)+(bx*bx+by*by)*(ax-cx)+(cx*cx+cy*cy)*(bx-ax))/d;return [ux,uy,Math.hypot(ax-ux,ay-uy)];}
function bg67Arc(t,S,F,hero,A,lvl,live,W_){const k=F.k,cw=F.cw,ch=F.ch,aa=Math.min(1.6,S.arcA)*A*(SET.sky==='bright'?1.2:SET.sky==='dim'?.8:1),px=DPR>=2?1.5:1,cam=bg67CamC();
  ctx.save();ctx.globalCompositeOperation='lighter';const R=mulberry(BG67SEED+80);
  const ringK=W_.k==='w'?0:(S.ring?1:0);/* в мире кольца нет: Маяк там плывёт вслед за курсом, кольцо вокруг него выглядело бы кривым */
  if(ringK>.01){const rg=S.ring||BG67M[6].ring;ctx.save();ctx.translate(hero.x*k,hero.y*k);ctx.rotate(rg.rot);const rs=bg67RingFit(rg,F,hero),rx=rg.rx*F.fw*k*rs,ry=rg.ry*F.fh*k*(F.portrait?.6:1)*rs;
    /* кольцо гаснет там, где проходит над центром боя: три полосы по эллипсу спокойствия */
    const ring=(m)=>{for(const [lw,al] of [[7*k,.05],[2.2*px,.16]]){ctx.strokeStyle=`rgba(143,233,255,${(al*aa*ringK*m).toFixed(3)})`;ctx.lineWidth=lw;ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,.18*Math.PI,Math.PI-.05);ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,Math.PI+.22,2*Math.PI+.1);ctx.stroke();}
      const Rr=mulberry(BG67SEED+81);for(let i=0;i<34;i++){const th=Rr()*6.283,a0=.25+Rr()*.4;if(Math.sin(th)<-.05&&Math.abs(Math.cos(th))<.35)continue;const a=a0*aa*ringK*m;ctx.fillStyle=`rgba(200,245,255,${a.toFixed(3)})`;ctx.fillRect(Math.cos(th)*rx-1,Math.sin(th)*ry-1,1.6*px,1.6*px);}};
    const band=(e0,e1)=>{ctx.beginPath();if(e1>5)ctx.rect(-cw,-ch,cw*3,ch*3);else ctx.ellipse(cw/2,ch/2,.3*cw*e1,.3*ch*e1,0,0,6.2832);ctx.ellipse(cw/2,ch/2,.3*cw*e0,.3*ch*e0,0,0,6.2832);};
    ctx.restore();for(const [e0,e1,m] of [[1,9,1],[.82,1,.5],[.62,.82,.18]]){ctx.save();band(e0,e1);ctx.clip('evenodd');ctx.translate(hero.x*k,hero.y*k);ctx.rotate(rg.rot);ring(m);ctx.restore();}}
  /* 1.5.6: длинная Дуга Пояса убрана (в мире и в миссиях) — осталось только кольцо станций вокруг Маяка в 06 */
  ctx.restore();}
/* кольцо 06 не заходит в центральный эллипс боя: уменьшаем, пока самая близкая точка снаружи */
function bg67RingFit(rg,F,hero){const key=Math.round(F.fw)+'x'+Math.round(F.fh)+'|'+Math.round(hero.x/4)+','+Math.round(hero.y/4);if(BG67.ringFit&&BG67.ringFit.key===key)return BG67.ringFit.s;
  const cx=F.fw/2,cy=F.fh/2,ax=.3*F.fw*.62,ay=.3*F.fh*.62,c=Math.cos(rg.rot),sn=Math.sin(rg.rot),ok=sc=>{const rx=rg.rx*F.fw*sc,ry=rg.ry*F.fh*(F.portrait?.6:1)*sc;for(let i=0;i<72;i++){const a=i/72*6.2832,ex=Math.cos(a)*rx,ey=Math.sin(a)*ry,x=hero.x+ex*c-ey*sn,y=hero.y+ex*sn+ey*c;if(((x-cx)/ax)**2+((y-cy)/ay)**2<1)return false;}return true;};
  let lo=.25,hi=1;if(ok(1))lo=1;else for(let i=0;i<12;i++){const m=(lo+hi)/2;if(ok(m))lo=m;else hi=m;}BG67.ringFit={key,s:lo};return lo;}
/* Маяк Ядра: ореол, ядро, четыре луча под 12° и два коротких; дышит ±8 % за 11 с */
/* hid — насколько Маяк закрыт камнем (0…1, плавно по расстоянию до края): лучи и яркое ядро ореола гаснут, общий свет — наполовину */
function bg67Hero(t,S,F,hero,A,live,hid){hid=hid||0;const vis=1-hid;const k=F.k,x=hero.x*k,y=hero.y*k,px=DPR>=2?1.5:1;let br=live?1+.08*Math.sin(t*6.2832/11):1;
  const halo=S.halo*k,a=A*br;ctx.save();ctx.globalCompositeOperation='lighter';let g=ctx.createRadialGradient(x,y,0,x,y,halo*3.2);g.addColorStop(0,`rgba(200,236,255,${(.13*a*(1-.5*hid)).toFixed(3)})`);g.addColorStop(1,'rgba(200,236,255,0)');ctx.fillStyle=g;ctx.fillRect(x-halo*3.2,y-halo*3.2,halo*6.4,halo*6.4);
  g=ctx.createRadialGradient(x,y,0,x,y,halo);g.addColorStop(0,`rgba(220,242,255,${(.4*a*vis).toFixed(3)})`);g.addColorStop(.35,`rgba(200,236,255,${(.14*a*vis).toFixed(3)})`);g.addColorStop(1,'rgba(200,236,255,0)');ctx.fillStyle=g;ctx.fillRect(x-halo,y-halo,halo*2,halo*2);
  /* луч, направленный к центру боя, короче: свет Маяка не тянется в бой */const tcx=F.cw/2-x,tcy=F.ch/2-y,tcl=Math.hypot(tcx,tcy)||1;const ray=(ang,L0,al,w)=>{const dx=Math.cos(ang),dy=Math.sin(ang);for(const sg of [1,-1]){const dot=(dx*sg*tcx+dy*sg*tcy)/tcl,L=L0*(dot>0?Math.max(.35,1-.75*dot)*Math.min(1,(tcl*.62)/L0+.2):1);const l=ctx.createLinearGradient(x,y,x+dx*L*sg,y+dy*L*sg);l.addColorStop(0,`rgba(230,246,255,${(al*A*vis).toFixed(3)})`);l.addColorStop(1,'rgba(230,246,255,0)');ctx.strokeStyle=l;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx*L*sg,y+dy*L*sg);ctx.stroke();}};
  const tl=12*Math.PI/180,L=S.rays*k;/* 1.5.6: Маяк тусклее — лучи и ядро спокойнее, свет в тумане прежний *//* 1.5.7: чуть светлее, чем в 1.5.6 */ray(tl,L*.9,.33,1.1*px);ray(tl+Math.PI/2,L*.74,.29,1.1*px);ray(tl+Math.PI/4,L*.26,.15,px);ray(tl-Math.PI/4,L*.26,.15,px);
  ctx.globalCompositeOperation='source-over';ctx.fillStyle=`rgba(238,249,255,${Math.min(1,.85*a).toFixed(3)})`;ctx.beginPath();ctx.arc(x,y,(S.core||2.4)*.92*px,0,6.2832);ctx.fill();ctx.restore();
}
function bg67Mines(t,S,F,A,fx){if(!BG67.minesL){const R=mulberry(BG67SEED+90),a=[];for(let i=0;i<60;i++)a.push({u:R(),v:R(),ph:R()*6,T:1.6+R()*1.6,s:1.3+R()*1.3});BG67.minesL=a;}const cw=F.cw,ch=F.ch,px=DPR>=2?1.5:1;
  for(const L of BG67.minesL){const x=L.u*cw,y=L.v*ch,ph=fx?((t+L.ph)%L.T)/L.T:.5,on=ph<.14?1-ph/.14:0,a=(.2+.65*on)*A*S.mines;if(a<.03)continue;ctx.fillStyle=`rgba(255,79,110,${a.toFixed(3)})`;ctx.fillRect(x,y,L.s*px,L.s*px);}}
/* средний план: камни (непрозрачные силуэты обломков) — 02, 05 и поля обломков мира */
function bg67MidList(){if(BG67.mids)return BG67.mids;const R=mulberry(BG67SEED+30),mk=(n)=>{const v=[];const nn=7+Math.floor(R()*5),rot=R()*6.28;for(let i=0;i<nn;i++){const a=rot+i/nn*6.28;v.push([Math.cos(a)*(.62+R()*.45)*(i%4===0?.75:1),Math.sin(a)*(.62+R()*.45)*.8]);}return {poly:v,spin:(R()-.5)*.03,ph:R()*6};};/* «poly», не «v»: у камней миссий v — это доля высоты кадра */
  const out={m2:[[.07,.86,78],[.95,.82,64],[.62,.07,38],[.03,.2,50],[.36,.97,34]].map(([u,v,r])=>({u,v,r,...mk()})),m5:[[.06,.8,70],[.95,.14,54]].map(([u,v,r])=>({u,v,r,...mk()})),w:[]};
  for(const f of WORLD.fields||[]){if(f.x>BG67SEC.x1+400||f.y<BG67SEC.y0-600||f.y>BG67SEC.y1+600)continue;for(let i=0;i<4;i++){const a=R()*6.28,d=f.r*(1.2+R()*1.4);out.w.push({x:f.x+Math.cos(a)*d,y:f.y+Math.sin(a)*d,r:30+R()*55,...mk()});}}return BG67.mids=out;}
/* геометрия камней в кадре (px устройства); параллакс прежний: 0,3 в мире, 0,1 в миссии */
function bg67MidGeo(t,S,F,W_,calm){const L=bg67MidList(),k=F.k,cam=bg67CamC();let list=[];
  if(W_.k==='m'){const arr=S.m===2?L.m2:S.m===5?L.m5:null;if(!arr)return [];const p=G.player,par=calm?0:.3/3;const ox=p&&!G.arena?(p.x-W/2)*par:(G.arena?(cam.x-W/2)*.3:0),oy=p&&!G.arena?(p.y-H/2)*par:(G.arena?(cam.y-H/2)*.3:0);
    for(const m of arr)list.push({x:m.u*F.fw-ox,y:m.v*F.fh-oy,m});}
  else{const par=calm?0:.3;for(const m of L.w){const x=F.fw/2+(m.x-cam.x)*par,y=F.fh/2+(m.y-cam.y)*par;if(x<-300||y<-300||x>F.fw+300||y>F.fh+300)continue;list.push({x,y,m});}}
  return list.map(({x,y,m})=>{const r=m.r*k,cx=x*k,cy=y*k,rot=calm?0:t*m.spin,c=Math.cos(rot),s_=Math.sin(rot);return {cx,cy,r,ux:x,uy:y,pts:m.poly.map(([a,b])=>[cx+(a*c-b*s_)*r,cy+(a*s_+b*c)*r])};});}
/* знаковое расстояние от точки до многоугольника (<0 — внутри) и ближайшая точка контура */
function bg67SD(px,py,pts){let ins=false,best=1e9,bx=0,by=0;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const ax=pts[j][0],ay=pts[j][1],cx=pts[i][0],cy=pts[i][1];
    if(((ay>py)!==(cy>py))&&(px<(cx-ax)*(py-ay)/(cy-ay)+ax))ins=!ins;const ex=cx-ax,ey=cy-ay,l2=ex*ex+ey*ey||1;let u=((px-ax)*ex+(py-ay)*ey)/l2;u=u<0?0:u>1?1:u;const qx=ax+ex*u,qy=ay+ey*u,d=Math.hypot(px-qx,py-qy);if(d<best){best=d;bx=qx;by=qy;}}
  return {sd:ins?-best:best,bx,by};}
/* какой камень ближе всех к Маяку (по знаковому расстоянию) */
function bg67Occ(hero,F,rocks){const hx=hero.x*F.k,hy=hero.y*F.k;let o={sd:1e9,rock:null,bx:0,by:0};for(const R of rocks){if(Math.abs(R.cx-hx)>R.r*2+400||Math.abs(R.cy-hy)>R.r*2+400)continue;const q=bg67SD(hx,hy,R.pts);if(q.sd<o.sd)o={sd:q.sd,rock:R,bx:q.bx,by:q.by};}return o;}
/* камни и затмение. Всё — непрерывные функции знакового расстояния sd от Маяка до контура:
   подход (sd>0) — светлеют ближние к Маяку рёбра; на самом краю — «бусина» (кольцо с бриллиантом);
   за камнем (sd<0) — корона выглядывает по всему периметру и слабеет с глубиной; сам камень непрозрачен */
function bg67Rocks(t,S,F,hero,A,rocks,occ,Rh,calm){const k=F.k,hx=hero.x*k,hy=hero.y*k,px=DPR>=2?1.5:1;ctx.save();
  /* корона позади камня: видна только там, где её не закрывает сам камень */
  /* корона позади каждого камня рядом с Маяком (не только ближайшего — иначе при смене «ближайшего» свет прыгал бы) */
  const OR=occ.rock;for(const R of rocks){const sd=R===OR?occ.sd:(Math.abs(R.cx-hx)>R.r*2+Rh*4||Math.abs(R.cy-hy)>R.r*2+Rh*4?1e9:bg67SD(hx,hy,R.pts).sd);R.sd=sd;const E=bgSS(Rh*3,-Rh*.2,sd)*Math.exp(-Math.max(0,-sd)/(R.r*1.3));if(E<=.003)continue;const Rc=R.r*1.25+Rh*2.2;ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(hx,hy,0,hx,hy,Rc);
    g.addColorStop(0,`rgba(205,238,255,${(.42*E*A).toFixed(3)})`);g.addColorStop(.35,`rgba(150,215,255,${(.16*E*A).toFixed(3)})`);g.addColorStop(1,'rgba(120,200,255,0)');ctx.fillStyle=g;ctx.fillRect(hx-Rc,hy-Rc,Rc*2,Rc*2);ctx.globalCompositeOperation='source-over';}
  for(const R of rocks){const pts=R.pts;if(R.cx<-R.r*2||R.cy<-R.r*2||R.cx>F.cw+R.r*2||R.cy>F.ch+R.r*2)continue;
    /* тело — непрозрачное: ни звёзд, ни тумана, ни Маяка сквозь него */
    const lx=hx-R.cx,ly=hy-R.cy,ll=Math.hypot(lx,ly)||1;
    const q=R===OR?occ:bg67SD(hx,hy,pts),sd=q.sd,E=bgSS(Rh*3,-Rh*.2,sd),deep=Math.exp(-Math.max(0,-sd)/(R.r*1.3)),Lr=Math.max(Rh*1.6,R.r*.75);
    /* тело непрозрачное; грань к Маяку чуть светлее (объём), а когда Маяк уходит за камень — лицевая сторона тёмная */
    {const lit=1-E,ux=lx/ll,uy=ly/ll,g=ctx.createLinearGradient(R.cx+ux*R.r,R.cy+uy*R.r,R.cx-ux*R.r,R.cy-uy*R.r),c1=[5+9*lit,9+12*lit,16+18*lit].map(Math.round);g.addColorStop(0,`rgb(${c1})`);g.addColorStop(.55,'rgb(6,10,17)');g.addColorStop(1,'rgb(4,7,13)');
     ctx.globalCompositeOperation='source-over';ctx.globalAlpha=A;ctx.fillStyle=g;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();}
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1;ctx.lineJoin='round';ctx.lineCap='round';
    /* свет по краю: слабая кайма со стороны Маяка всегда + затмение (рёбра ближе к Маяку — ярче) */
    for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,nx=mx-R.cx,ny=my-R.cy,ml=Math.hypot(nx,ny)||1,dot=Math.max(0,(nx*lx+ny*ly)/(ml*ll));
      const ex=b[0]-a[0],ey=b[1]-a[1],l2=ex*ex+ey*ey||1;let u=((hx-a[0])*ex+(hy-a[1])*ey)/l2;u=u<0?0:u>1?1:u;const de=Math.hypot(hx-a[0]-ex*u,hy-a[1]-ey*u);
      const I=Math.min(1.2,.13*bgSS(.15,.6,dot)+E*deep*(.28+.72*Math.exp(-de/Lr)));if(I<.01)continue;
      for(const [lw,al] of (E*deep>.02?[[6*k,.12],[2.4*k,.26],[1.2*px,.9]]:[[1.2*px,.9]])){/* без затмения — одна тонкая линия (дёшево) */ctx.strokeStyle=`rgba(200,240,255,${Math.min(1,al*I*A).toFixed(3)})`;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}}
    /* «бусина»: Маяк на самом краю — яркая точка на контуре, гаснет по обе стороны края (непрерывно) */
    const bead=E*Math.exp(-(((sd+Rh*.25)/(Rh*.42))**2));/* пик — когда Маяк только что ушёл за край */if(bead>.01){const br=Rh*1.1+4*k,g=ctx.createRadialGradient(q.bx,q.by,0,q.bx,q.by,br);g.addColorStop(0,`rgba(240,250,255,${(.85*bead*A).toFixed(3)})`);g.addColorStop(.25,`rgba(190,235,255,${(.3*bead*A).toFixed(3)})`);g.addColorStop(1,'rgba(160,220,255,0)');ctx.fillStyle=g;ctx.fillRect(q.bx-br,q.by-br,br*2,br*2);}}
  ctx.restore();}
/* редкие события мира: падающая звезда, огонёк по Дуге, затмение Маяка при остановке */
function bg67Events(t,S,F,hero,A){const E=BG67.ev,now=performance.now()/1000,R=BG67.evR||(BG67.evR=mulberry(BG67SEED+99)),k=F.k,cw=F.cw,ch=F.ch;
  if(!E.nextShoot)E.nextShoot=now+70+R()*70;
  if(!E.shoot&&now>E.nextShoot&&!SET.lessFx){let x,y,tries=0;do{x=R()*cw;y=R()*ch*.8;tries++;}while(tries<12&&Math.hypot(x/cw-.5,y/ch-.5)<.3);const a=.35+R()*.5;E.shoot={x,y,vx:Math.cos(a)*(260+R()*160)*k,vy:Math.sin(a)*(90+R()*90)*k,t:0,T:.9};E.nextShoot=now+70+R()*70;bg67Note('событие','падающая звезда');}
  if(E.shoot){const s=E.shoot;s.t+=VDT74;/* ARCH·75 A-22 */const p=s.t/s.T,x=s.x+s.vx*s.t,y=s.y+s.vy*s.t,L=(60+60*p)*k/Math.hypot(s.vx,s.vy)*1;const a=.35*Math.sin(Math.PI*p)*A;const l=ctx.createLinearGradient(x,y,x-s.vx*.18,y-s.vy*.18);l.addColorStop(0,`rgba(230,245,255,${a.toFixed(3)})`);l.addColorStop(1,'rgba(230,245,255,0)');ctx.strokeStyle=l;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-s.vx*.18,y-s.vy*.18);ctx.stroke();if(s.t>=s.T)E.shoot=null;}

  /* 1.5.7: «затмение при остановке» убрано — настоящее затмение теперь дают камни */}
/* пыль: с 1.5.7 рисуется в небе, под камнями (скорость параллакса прежняя 1,2–1,4); в мире на скорости — штрихи */
function bg67Dust(W_){const lvl=bg67Lvl();if(lvl<2||!bg67Fx()||bg67Calm()||BG67.dev.off.dust)return;const F=bg67Frame(),k=F.k,cam=bg67CamC();
  if(!BG67.dust){const R=mulberry(BG67SEED+20);BG67.dust=[];for(let i=0;i<30;i++)BG67.dust.push({u:R(),v:R(),a:.06+R()*.08,s:1+R(),par:1.2+R()*.2});}
  const L=BG67.lastCam||cam,vx=(cam.x-L.x),vy=(cam.y-L.y);BG67.lastCam={x:cam.x,y:cam.y};const sp=Math.hypot(vx,vy),n=W_.k==='w'?24:16,px=DPR>=2?1.5:1;
  ctx.save();ctx.setTransform(1,0,0,1,0,0);const drift=performance.now()/1000*6;
  for(let i=0;i<n;i++){const d=BG67.dust[i],fw=F.fw,fh=F.fh;let x=((d.u*fw-cam.x*(d.par-1)+drift*d.par)%fw+fw)%fw,y=((d.v*fh-cam.y*(d.par-1))%fh+fh)%fh;x*=k;y*=k;
    if(W_.k==='w'&&sp>3&&!SET.lessFx){const L_=Math.min(14,sp*.9)*k*d.par;ctx.strokeStyle=`rgba(207,232,255,${(d.a).toFixed(3)})`;ctx.lineWidth=1.1*px;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-vx/sp*L_,y-vy/sp*L_);ctx.stroke();}
    else{ctx.fillStyle=`rgba(207,232,255,${d.a.toFixed(3)})`;ctx.fillRect(x,y,d.s*px,d.s*px);}}ctx.restore();}
/* Верстак: центральный эллипс и полосы интерфейса */
function bg67Zones(F,hero){const k=F.k,cw=F.cw,ch=F.ch,hd=bg67Hud(F);ctx.save();ctx.strokeStyle='rgba(122,255,201,.6)';ctx.setLineDash([6,6]);ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(cw/2,ch/2,.3*cw,.3*ch,0,0,6.2832);ctx.stroke();
  ctx.fillStyle='rgba(255,210,77,.12)';ctx.fillRect(0,0,cw,hd.t*k);ctx.fillRect(0,ch-hd.b*k,cw,hd.b*k);ctx.setLineDash([]);ctx.strokeStyle='rgba(255,210,77,.8)';ctx.beginPath();ctx.arc(hero.x*k,hero.y*k,14,0,6.2832);ctx.stroke();ctx.restore();}
function bg67Note(k,txt){BG67.log.push({t:Math.round(performance.now()/100)/10,k,txt});if(BG67.log.length>30)BG67.log.shift();}
function bg67Fail(e){console.error(e);if(++BG67.err>12)BG67.dead=1;}
function bg67Stat(ms){const S=BG67.stats;S.ms=S.ms*.95+ms*.05;S.max=Math.max(S.max*.995,ms);S.n++;
  /* автоснижение: дважды за 3 с сверх бюджета (0,5 мс ПК / 1 мс телефон, с запасом на шум измерения ×3) — уровень ниже до конца сессии */
  const lim=(isMob()?1:.5)*3;if(ms>lim){const now=performance.now();BG67.slow=BG67.slow.filter(x=>now-x<3000);BG67.slow.push(now);if(BG67.slow.length>=6&&BG67.lvlCut<2&&S.n>120){BG67.lvlCut++;BG67.slow=[];bg67Note('автоснижение','уровень '+bg67Lvl());}}}

/* ---------- ОБВЯЗКА ---------- */
{const _r=render;render=function(now){const W_=bg67Where();if(!W_||W_.k!=='m')return _r.apply(this,arguments);const t0=performance.now();let ok=false;
  try{ok=bg67Draw(now/1000,W_);}catch(e){bg67Fail(e);}const ms=performance.now()-t0-(BG67.stepMs||0);if(!ok)return _r.apply(this,arguments);
  const n0=nebula,s0=stars;nebula=null;stars=BG67.noStars;let r;try{r=_r.apply(this,arguments);}finally{nebula=n0;stars=s0;}
  try{bg67Stat(ms);}catch(e){bg67Fail(e);}return r;};}
{const _rw=renderWorld;renderWorld=function(now){const W_=bg67Where();if(!W_||W_.k!=='w'||W_.blend>=1)return _rw.apply(this,arguments);const t0=performance.now();let ok=false;
  try{ok=bg67Draw(now/1000,W_);}catch(e){bg67Fail(e);}const ms=performance.now()-t0-(BG67.stepMs||0);if(!ok)return _rw.apply(this,arguments);
  const n0=nebula,s0=stars,d0=G.decor;nebula=null;stars=BG67.noStars;if(d0)G.decor=d0.filter(d=>d.x>BG67SEC.x1-400+(1-W_.blend)*400||d.y<BG67SEC.y0||d.y>BG67SEC.y1);/* свечения decor сектора I заменены туманом */
  let r;try{r=_rw.apply(this,arguments);}finally{nebula=n0;stars=s0;G.decor=d0;}try{bg67Stat(ms);}catch(e){bg67Fail(e);}return r;};}
/* сборка начинается заранее: на брифинге миссии и при подлёте к сектору */
{const _oi=openIntro;openIntro=function(i){const r=_oi.apply(this,arguments);try{if(i+1<=6&&!bg67Bot()&&!BG67.dead){BG67.fresh=!BG67.pano[bg67Key({k:'m',m:i+1},bg67Frame())];}}catch(e){}return r;};}
/* карта: у Ядра — маленький холодный ореол, тот же Маяк, что на небе */
try{if(typeof drawMap==='function'){const _dm=drawMap;drawMap=function(){const r=_dm.apply(this,arguments);try{bg67Geo();const M=G.mapXY,c=document.getElementById('mapC');if(M&&c&&!BG67.dead&&!(typeof zbMap==='function'&&zbMap())){const g=c.getContext('2d'),x=M.X(BG67CORE.x),y=M.Y(BG67CORE.y),R=Math.max(14,Math.min(90,900*M.k));
  if(x>-R&&y>-R&&x<M.w+R&&y<M.h+R){g.save();g.setTransform(DPR,0,0,DPR,0,0);g.globalCompositeOperation='lighter';const gr=g.createRadialGradient(x,y,0,x,y,R);gr.addColorStop(0,'rgba(200,236,255,.20)');gr.addColorStop(.3,'rgba(143,233,255,.07)');gr.addColorStop(1,'rgba(143,233,255,0)');g.fillStyle=gr;g.fillRect(x-R,y-R,2*R,2*R);g.restore();}}}catch(e){}return r;};}}catch(e){}

/* ---------- настройка «ЯРКОСТЬ НЕБА» во вкладке «ЭКРАН» ---------- */
if(SET.sky===undefined)SET.sky='norm';try{if(typeof SET_DEF!=='undefined')SET_DEF.sky='norm';}catch(e){}
{const _rs=renderSetScreen;renderSetScreen=function(){const r=_rs.apply(this,arguments);try{const g=document.querySelector('#setBody .tab63[data-tab63="scr"]');if(g&&!g.querySelector('[data-n63="sky"]')){const cur=SET.sky||'norm';const w=document.createElement('div');w.className='srow63';w.dataset.n63='sky';
  w.innerHTML=`<div class="setrow"><div class="eyebrow">ЯРКОСТЬ НЕБА</div><div class="seg">${[['dim','ТУСКЛЕЕ'],['norm','ОБЫЧНАЯ'],['bright','ЯРЧЕ']].map(([k,n])=>`<button data-sky67="${k}" class="${cur===k?'on':''}">${n}</button>`).join('')}</div></div><p class="snote">Туман и звёзды в первом секторе. «Ярче» — для светлой комнаты и дешёвых матриц, «тусклее» — для OLED в темноте. Маяк и бой не меняются.</p>`;g.appendChild(w);}}catch(e){console.error(e);}return r;};}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-sky67]');if(!b)return;SET.sky=b.dataset.sky67;saveSet();renderSetScreen();try{buzz('tap');}catch(er){}});

/* ---------- ВЕРСТАК: «НЕБО · 1.5.5» во вкладках «МИР» и «БОЙ» ---------- */
const BG67LAYERS=[['far','ТУМАН'],['stars','ЗВЁЗДЫ'],['lanes','ПОЛОСЫ'],['arc','КОЛЬЦО 06'],['hero','МАЯК'],['mid','СИЛУЭТЫ'],['dust','ПЫЛЬ'],['ev','СОБЫТИЯ'],['calm','ТИШИНА ЦЕНТРА'],['dith','ДИЗЕРИНГ']];
function bg67Live(){const W_=bg67Where(),S=BG67.stats;if(!W_)return 'не в секторе I'+(bg67Bot()?' · АВТОТЕСТ':'');const P=BG67.pano[BG67.lastKey];
  return (W_.k==='w'?'МИР':'МИССИЯ '+String(W_.m).padStart(2,'0'))+' · УРОВЕНЬ '+bg67Lvl()+' · '+S.ms.toFixed(2).replace('.',',')+' МС (ПИК '+S.max.toFixed(1).replace('.',',')+') · СБОРКА '+(BG67.job?Math.round(BG67.job.row/BG67.job.h*100)+' %':Math.round(S.build)+' МС')+' · ПАМЯТЬ '+(S.mem/1048576).toFixed(1).replace('.',',')+' МБ'+(P?' · '+P.w+'×'+P.h:'');}
function bg67Grp(){const L=BG67LAYERS.map(([k,n])=>btn('bg67off',k,(BG67.dev.off[k]?'○ ':'● ')+n,'')).join('');
  return grp('НЕБО · 1.5.5',`<div class="r65"><span data-live="bg67"></span></div>${seg('bg67lvl',BG67.dev.lvl,[['auto','АВТО'],['0','0'],['1','1'],['2','2']])}${seg('bg67m',BG67.dev.m,[[0,'АВТО'],[1,'01'],[2,'02'],[3,'03'],[4,'04'],[5,'05'],[6,'06']])}<div class="bs65">${L}</div>${btn('bg67zones',1,BG67.dev.zones?'ЗОНЫ: ВКЛ':'ЗОНЫ: ВЫКЛ','wide')}${btn('bg67rebuild',1,'ПЕРЕСОБРАТЬ НЕБО','wide')}`,
    'Уровень деталей, небо любой миссии 01–06, слои по одному. «Зоны» — центральный эллипс боя, полосы интерфейса и место Маяка. Последнее: '+BG67.log.slice(-4).map(x=>x.k+(x.txt?' ('+x.txt+')':'')).join(' · '));}
try{if(typeof DVX_R!=='undefined'){for(const tab of ['world','fight']){if(!DVX_R[tab])continue;const _f=DVX_R[tab];DVX_R[tab]=function(){let h=_f.apply(this,arguments);try{h+=bg67Grp();}catch(e){console.error(e);}return h;};}}
  if(typeof DVX_LIVE!=='undefined')DVX_LIVE.bg67=bg67Live;
  if(typeof dvAct==='function'){const _da=dvAct;dvAct=function(a,v,e){if(a==='bg67off'){BG67.dev.off[v]=!BG67.dev.off[v];dvxRender();return;}if(a==='bg67lvl'){BG67.dev.lvl=v;dvxRender();return;}if(a==='bg67m'){BG67.dev.m=+v;BG67.lastKey='';dvxRender();return;}
    if(a==='bg67zones'){BG67.dev.zones=!BG67.dev.zones;dvxRender();return;}if(a==='bg67rebuild'){BG67.pano={};BG67.tiles=null;BG67.job=null;BG67.lastKey='';BG67.lvlCut=0;BG67.fresh=true;dvxRender();return;}return _da.apply(this,arguments);};}}catch(e){console.error(e);}
window.BG67=BG67;
/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ BG·PROTO 1.5.5 α «Небо» · КОНЕЦ ВЫРЕЗАЕМОГО БЛОКА ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */
