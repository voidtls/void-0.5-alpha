// ===== 0.9.5: дизайн уровней 39–46 — геометрия, укрытия, поры, события арены, темп, тайники =====
// нормализованные координаты (0–1); в портрете арена поворачивается на 90°, а не сжимается
function port95(){return H>W*1.15;}
function rot95(u,v){const X=G.x90;if(X&&X.mir95)u=1-u;return port95()?{x:(1-v)*W,y:u*H}:{x:u*W,y:v*H};}
function sz95(){return clamp(Math.min(W,H)/760,.75,1.25);}
const LV95={
  39:{pil:[[.5,.5,58,'core'],[.2,.52,34],[.74,.22,30],[.76,.78,36,0,'sec']],sec:[.9,.9],
    flows:[[[-.05,.15],[.2,.05],[.3,.45],[.47,.49]],[[.9,1.05],[.85,.7],[.6,.75],[.52,.53]],[[1.05,.25],[.82,.1],[.72,.42],[.53,.47]]],ev:'rev',evName:['ПРИЛИВ КРОВИ','ЛЕНТЫ МЕНЯЮТ НАПРАВЛЕНИЕ'],elite:'hunt95'},
  40:{pil:[[.15,.3,30],[.15,.74,34],[.5,.24,36],[.5,.76,32],[.85,.28,34,0,'sec'],[.85,.72,30]],sec:[.93,.12],locks:[.3,.7],ev:'quar',evName:['КАРАНТИН','ШЛЮЗЫ ЗАКРЫТЫ · 10 СЕКУНД'],elite:'spasm95'},
  41:{pil:[[.5,.5,120,'core'],[.14,.2,28],[.86,.22,30,0,'sec'],[.18,.82,30]],sec:[.95,.1],ring:1,
    flows:[[[.12,.52],[.12,.04],[.88,.04],[.88,.5]],[[.88,.48],[.88,.96],[.12,.96],[.12,.5]]],ev:'zap',evName:['РАЗРЯД','ГАНГЛИЙ БЬЁТ ЛУЧАМИ · 15 СЕКУНД'],elite:'guard95'},
  43:{pil:[[.3,.3,40],[.7,.34,34],[.36,.72,30],[.68,.7,44,0,'sec']],sec:[.97,.06],secV:1,
    spits:[[0,.3,.2,.42,74],[1,.7,.8,.58,74],[.42,0,.48,.17,60],[.6,1,.54,.83,60],[1.02,-.02,.9,.12,90]],ev:'fog',evName:['ТУМАН ЗАБВЕНИЯ','ВИДНО ТОЛЬКО ВБЛИЗИ · 20 СЕКУНД'],elite:'blot95'},
  44:{pil:[[.12,.15,30],[.88,.85,30,0,'sec']],sec:[.04,.95],secV:1,rows:[.27,.5,.73],ev:'mir',evName:['ПРАВКА','АРЕНА ОТРАЖЕНА'],elite:'scribe95',
    spits:[[-.02,1.02,.1,.88,80]]},
  45:{pil:[[.35,.62,32],[.62,.4,34,0,'sec'],[.8,.22,28]],sec:[.03,.04],secV:1,poly:[[[-.02,-.02],[.56,-.02],[-.02,.64]],[[1.02,1.02],[.44,1.02],[1.02,.36]]],ev:'wave9',evName:['ДЕВЯТЫЙ ВАЛ','ДВА ПРИЛИВА НАВСТРЕЧУ'],elite:'lost95'},
  42:{pil:[]},46:{pil:[]}};
// --- геометрия: пересчёт при смене размера (X04: секунда неуязвимости и выталкивание без урона) ---
function lv95Init(M,X){const m=G.m,L=LV95[m];X.lv95=L||null;X.pil95=[];X.walls95=[];X.pores95=[];X.loot95=[];X.ev95=null;X.evDone95=0;X.mir95=0;X.rowT95=20;X.wv95=[];X.tg95=[];X.gw95=0;
  G.ol95=1;if(!L||M.bossRoom)return;
  for(const q of L.pil){const [u,v,r,kind,sec]=q;X.pil95.push({u,v,r0:r,r,core:kind==='core',hp:300,max:300,sec:sec==='sec',alive:true,hit:0});}
  if(L.flows&&X.flows&&X.flows.length){X.flows=L.flows.map(p=>({p,w:L.ring?100:120,shut:0,closed:false,valve:null}));X.gw=0;X.gwInit90=0;geo90(X);}
  if(L.locks&&X.locks)for(let i=0;i<X.locks.length;i++)if(L.locks[i]!==undefined)X.locks[i].nx=L.locks[i];
  if(L.rows){X.rows95=L.rows.map(v=>({v,gaps:rowGaps95()}));}
  const S=G.save;X.sec95={u:L.sec[0],v:L.sec[1],found:!!(S&&S.story&&((S.story.sec95||0)&(1<<(m-39)))),vis:!!L.secV};
  geo95(X,true);}
function rowGaps95(){const a=rnd(.1,.38),b=rnd(.55,.86);return [{c:a,w:.15},{c:b,w:.15}];}
function geo95(X,force){if(!X.lv95)return;if(!force&&X.gw95===W&&X.gh95===H)return;const first=!X.gw95;X.gw95=W;X.gh95=H;const k=sz95(),L=X.lv95;
  for(const q of X.pil95){const P=rot95(q.u,q.v);q.x=P.x;q.y=P.y;q.r=q.r0*k;}
  X.walls95=[];if(X.rows95)for(const R of X.rows95){let u0=0;const gs=R.gaps.slice().sort((a,b)=>a.c-b.c);for(const g of gs){const u1=g.c-g.w/2;if(u1-u0>.02){const A=rot95(u0,R.v),B=rot95(u1,R.v);X.walls95.push({x1:A.x,y1:A.y,x2:B.x,y2:B.y,w:14});}u0=g.c+g.w/2;}if(1-u0>.02){const A=rot95(u0,R.v),B=rot95(1,R.v);X.walls95.push({x1:A.x,y1:A.y,x2:B.x,y2:B.y,w:14});}}
  X.spits95=[];if(L.spits)for(const s of L.spits){const A=rot95(s[0],s[1]),B=rot95(s[2],s[3]);X.spits95.push({x1:A.x,y1:A.y,x2:B.x,y2:B.y,w:s[4]*k});}
  X.poly95=[];if(L.poly)for(const P of L.poly)X.poly95.push(P.map(([u,v])=>rot95(u,v)));
  if(X.sec95){const P=rot95(X.sec95.u,X.sec95.v);X.sec95.x=P.x;X.sec95.y=P.y;}
  X.pores95=[];const pp=[[0,.2],[0,.8],[1,.25],[1,.75],[.3,0],[.7,0],[.3,1],[.7,1]];for(const [u,v] of pp){const P=rot95(u,v);X.pores95.push({x:clamp(P.x,26,W-26),y:clamp(P.y,26,H-26),open:0});}
  if(!first){const p=G.player;if(p){p.inv=Math.max(p.inv,1);pushOut95(p,0);}for(const e of G.enemies)if(e.alive&&!STATIC.has(e.type))pushOut95(e,0);}}
// глубина пустоты от многоугольников стирания (берег в 45)
function polyD95(x,y,P){let inside=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)inside=!inside;}if(!inside)return 0;let d=1e9;for(let i=0,j=P.length-1;i<P.length;j=i++)d=Math.min(d,segDist(P[j].x,P[j].y,P[i].x,P[i].y,x,y));return d;}
// --- столкновения с укрытиями и строками-стенами ---
function blocked95(x,y,r){const X=G.x90;if(!X||!inMission()||!X.pil95)return false;for(const q of X.pil95)if(q.alive&&Math.hypot(x-q.x,y-q.y)<q.r+r)return true;for(const w of X.walls95)if(segDist(w.x1,w.y1,w.x2,w.y2,x,y)<w.w/2+r)return true;
  if(X.poly95)for(const P of X.poly95)if(polyD95(x,y,P)>0)return true;return false;}
function wallBlock95(a,b){const X=G.x90;if(!X||!inMission()||!X.pil95)return false;for(const q of X.pil95)if(q.alive&&segDist(a.x,a.y,b.x,b.y,q.x,q.y)<q.r*.9)return true;for(const w of X.walls95)if(segInter(a.x,a.y,b.x,b.y,w.x1,w.y1,w.x2,w.y2))return true;return false;}
function pushOut95(o,pad){const X=G.x90;if(!X||!X.pil95)return;const r=(o.r||14)+(pad||0);
  for(const q of X.pil95){if(!q.alive)continue;const dx=o.x-q.x,dy=o.y-q.y,d=Math.hypot(dx,dy)||1e-3,m=q.r+r*.85;if(d<m){o.x=q.x+dx/d*m;o.y=q.y+dy/d*m;if(o.vx!==undefined){const vn=(o.vx*dx+o.vy*dy)/d;if(vn<0){o.vx-=vn*dx/d;o.vy-=vn*dy/d;}}}}
  for(const w of X.walls95){const L2=(w.x2-w.x1)**2+(w.y2-w.y1)**2||1,t=clamp(((o.x-w.x1)*(w.x2-w.x1)+(o.y-w.y1)*(w.y2-w.y1))/L2,0,1),cx=w.x1+(w.x2-w.x1)*t,cy=w.y1+(w.y2-w.y1)*t,dx=o.x-cx,dy=o.y-cy,d=Math.hypot(dx,dy)||1e-3,m=w.w/2+r*.85;
    if(d<m){const px=o.px!==undefined?o.px:o.x-(o.vx||0)/60,py=o.py!==undefined?o.py:o.y-(o.vy||0)/60;let nx=dx/d,ny=dy/d;if(d<1){const sx=(px-cx),sy=(py-cy),sl=Math.hypot(sx,sy)||1;nx=sx/sl;ny=sy/sl;}o.x=cx+nx*m;o.y=cy+ny*m;}}}
// обход укрытий и строк-стен: скольжение по касательной, к ближнему разрыву строки
function nav95(e,X,dt,p){if(!p||e.type==='witness100'||e.type==='pass90'||e.hd95||e.dz95>0)return;const tx=p.x,ty=p.y;
  for(const q of X.pil95){if(!q.alive)continue;const dx=q.x-e.x,dy=q.y-e.y,d=Math.hypot(dx,dy)||1;if(d>q.r+e.r+70)continue;const px=tx-e.x,py=ty-e.y;if(px*dx+py*dy<=0)continue;if(segDist(e.x,e.y,tx,ty,q.x,q.y)>q.r+e.r*.8)continue;let ux=-dy/d,uy=dx/d;if(ux*px+uy*py<0){ux=-ux;uy=-uy;}if(Math.abs(ux*px+uy*py)<1){ux=-dy/d*(e.uid%2?1:-1);uy=dx/d*(e.uid%2?1:-1);}e.x+=ux*110*dt;e.y+=uy*110*dt;}
  if(X.walls95.length)for(const w of X.walls95){if(!segInter(e.x,e.y,tx,ty,w.x1,w.y1,w.x2,w.y2))continue;const L=Math.hypot(w.x2-w.x1,w.y2-w.y1)||1,ux=(w.x2-w.x1)/L,uy=(w.y2-w.y1)/L,pad=e.r+w.w/2+18;
    const ends=[[w.x1-ux*pad,w.y1-uy*pad],[w.x2+ux*pad,w.y2+uy*pad]].filter(([x,y])=>x>10&&x<W-10&&y>10&&y<H-10);if(!ends.length)continue;let best=ends[0],bd=1e9;for(const q of ends){const d=Math.hypot(q[0]-e.x,q[1]-e.y)+Math.hypot(q[0]-tx,q[1]-ty);if(d<bd){bd=d;best=q;}}
    const D=Math.hypot(best[0]-e.x,best[1]-e.y)||1,gx=(best[0]-e.x)/D,gy=(best[1]-e.y)/D,va=e.vx*gx+e.vy*gy;if(va<0){e.vx-=va*gx;e.vy-=va*gy;}e.x+=gx*130*dt;e.y+=gy*130*dt;break;}}
// пули: укрытия держат снаряды обеих сторон; ваши снаряды рушат тканевые столбы и обломки
function pilBullet95(b,mine){const X=G.x90;if(!X||!X.pil95)return false;const x0=b.px!==undefined?b.px:b.x-b.vx/60,y0=b.py!==undefined?b.py:b.y-b.vy/60;
  for(const q of X.pil95){if(!q.alive)continue;if(segDist(x0,y0,b.x,b.y,q.x,q.y)<q.r+(b.r||2)*.5){if(mine&&!q.core){q.hp-=b.dmg||10;q.hit=.12;if(q.hp<=0)pilBreak95(X,q);}if(mine&&b.charged&&!q.core)return false;b.life=0;if(SET.fx)part(b.x,b.y,rnd(-60,60),rnd(-60,60),.2,X.sec===8?C90.blood:C90.sh,2);return true;}}
  for(const w of X.walls95){if(segDist(w.x1,w.y1,w.x2,w.y2,b.x,b.y)<w.w/2+2||segInter(x0,y0,b.x,b.y,w.x1,w.y1,w.x2,w.y2)){b.life=0;if(SET.fx)part(b.x,b.y,rnd(-40,40),rnd(-40,40),.2,C90.sh,1.6);return true;}}return false;}
function pilBreak95(X,q){q.alive=false;snd95('pillar',q.x);trauma90(.15);explode(q.x,q.y,X.sec===8?C90.red:C90.sh,22,.9);if(X.sec===9)glyph95(q.x,q.y,10,C90.sh);floater(q.x,q.y-q.r-10,X.sec===8?'СТОЛБ РУХНУЛ':'ОБЛОМОК РАССЫПАЛСЯ',X.sec===8?C90.warm:C90.sh);
  if(q.sec&&X.sec95&&!X.sec95.found){X.sec95.vis=1;X.sec95.x=q.x;X.sec95.y=q.y;floater(q.x,q.y-q.r-30,'ЗА СТОЛБОМ ЧТО-ТО БЛЕСТИТ','#ffffff');snd95('secret',q.x);}}
// --- поры появления: IX — поры сосудов (видно за 1 с), X — враги проявляются из стёртого края ---
function spawn95(type,o){const X=G.x90;if(!on95()||!X.pores95||(G.sb&&G.sb.alive)||G.bc)return false;const p=G.player;if(!p)return false;
  let pts=[];if(X.sec===8){for(const q of X.pores95){const d=Math.hypot(q.x-p.x,q.y-p.y);if(d>=260&&!blocked95(q.x,q.y,20))pts.push([q,d]);}}
  else{for(let i=0;i<24;i++){const x=rnd(50,W-50),y=rnd(50,H-50);if(Math.hypot(x-p.x,y-p.y)<300||blocked95(x,y,24)||voidDepth100(x,y)>0)continue;let nearV=0;for(const [dx,dy] of [[60,0],[-60,0],[0,60],[0,-60]])if(voidDepth100(x+dx,y+dy)>0)nearV=1;const d=Math.min(x,W-x,y,H-y);if(nearV||d<120)pts.push([{x,y},Math.hypot(x-p.x,y-p.y)]);}}
  if(!pts.length)return false;pts.sort((a,b)=>b[1]-a[1]);const q=pts[Math.random()*Math.min(3,pts.length)|0][0];if(q.open!==undefined)q.open=1;
  G.warns.push({x:q.x,y:q.y,mx:q.x,my:q.y,type,t:(X.sec===8?1:.9)+(o.delay||0),o:Object.assign({},o,{sp95:X.sec})});return true;}
function spawned95(e,w){if(!w||!w.o){if(e&&typeof cap90==='function')cap90(e);return;}if(w.o.ob96)e.ob96=1;if(w.o.sp95){e.spawnT=w.o.sp95===9?.8:.45;e.vx=e.vy=0;if(w.o.sp95===9){glyph95(e.x,e.y,6,EDEF[e.type].col);snd95('fade95',e.x);}else{snd95('pore',e.x);if(SET.fx)for(let i=0;i<fxN95(8);i++){const a=vrnd3(0,TAU);part(e.x,e.y,Math.cos(a)*90,Math.sin(a)*90,.4,C90.blood,2.5);}}}
  if(w.o.e95){e.elite95=1;e.hp*=e.type==='guard95'?1.5:2;e.maxHp=e.hp;e.armor=3;if(!e.affix)e.affix=['armor'];floater(e.x,e.y-e.r-20,'КУЛЬМИНАЦИЯ · '+EDEF[e.type].name.toUpperCase(),'#ffffff');snd95('elite',e.x);}
  else if(typeof cap90==='function')cap90(e);}
// --- волны: темп миссии (знакомство · смешение · событие · передышка · кульминация) ---
function wavesPlan95(){for(const m of [39,40,41,43,44,45]){const M=MISSIONS[m-1];if(!M||!M.wavesT||M.plan95)continue;M.plan95=1;const W0=M.wavesT;const deb=W0[0]&&W0[0].length===1&&M.debut?W0[0]:null;let rest=deb?W0.slice(1):W0.slice();
    while(rest.length>5)rest.splice(rest.length-2,1);const plus=w=>{const out=w.slice();const n=Math.round(w.length*.2);for(let i=0;i<n;i++){const t=w[i%w.length];if(!String(t).includes(':'))out.push(t);}return out;};
    const mixed=rest.slice(0,3).map(plus),last=plus(rest[rest.length-1]||rest[0]),br=(rest[3]||rest[0]).filter(t=>!String(t).includes(':')).slice(0,Math.max(3,Math.round((rest[3]||rest[0]).length*.4)));
    const L=LV95[m];last.push('e95:'+(L&&L.elite||'gunner'));M.wavesT=(deb?[deb]:[]).concat(mixed,[br],[last]);M.br95=(deb?1:0)+3;}}
// --- тик уровня ---
function lv95Tick(X,dt){if(!X.lv95)return;geo95(X);const p=G.player,M=MISSIONS[G.m-1];
  for(const q of X.pil95)if(q.hit>0)q.hit-=dt;for(const q of X.pores95)if(q.open>0)q.open-=dt;
  // враги и снаряды против укрытий
  for(const e of G.enemies){if(!e.alive||STATIC.has(e.type)||e.sbk||EDEF[e.type].sbp||e.hz95>0)continue;pushOut95(e,0);if(e.spawnT<=0&&!e.passive95)nav95(e,X,dt,e.type==='fixer100'&&e.fx&&e.fx.alive?e.fx:p);}
  for(const b of G.eb){if(b.life<=0||b.rift||b.k95==='word')continue;pilBullet95(b,false);}
  // строки 44 переписываются каждые 20 с
  if(X.rows95){X.rowT95-=dt;if(X.rowT95<=1.2&&!X.rowW95){X.rowW95=1;snd95('rewrite',W/2);for(const w of X.walls95)for(let i=0;i<3;i++){const u=Math.random();glyph95(w.x1+(w.x2-w.x1)*u,w.y1+(w.y2-w.y1)*u,1,C90.sh);}}
    if(X.rowT95<=0){X.rowT95=20;X.rowW95=0;for(const R of X.rows95)R.gaps=rowGaps95();geo95(X,true);floater(W/2,H*.2,'СТРОКИ ПЕРЕПИСАНЫ',C90.sh);}}
  // темп волн
  if(G.waveIdx===1&&M.debut&&!X.deb95){const e=G.enemies.find(o=>o.alive&&o.type===M.debut&&!o.deb95);if(e){X.deb95=1;e.deb95=1;e.hp*=.3;e.maxHp=e.hp;}}
  if(G.waveIdx>=3&&!X.evDone95&&X.lv95.ev){X.evDone95=1;ev95Start(X);}
  if(M.br95&&G.waveIdx===M.br95+1&&!X.brDone95){X.brDone95=1;const P=rot95(.5,.5);let x=P.x,y=P.y;for(let i=0;i<10&&blocked95(x,y,30);i++){x=rnd(W*.3,W*.7);y=rnd(H*.3,H*.7);}X.loot95.push({k:'chest',x,y,t:0});banner('ПЕРЕДЫШКА','СУНДУК ЛОМА · КУЛЬМИНАЦИЯ СКОРО');snd95('chest',x);}
  if(X.ev95)ev95Tick(X,dt);
  // тайник и находки
  for(const q of X.loot95){q.t+=dt;if(p&&p.hp>0&&Math.hypot(p.x-q.x,p.y-q.y)<34)loot95(X,q);}X.loot95=X.loot95.filter(q=>!q.got);
  const S=X.sec95;if(S&&!S.found&&S.vis&&p&&p.hp>0&&Math.hypot(p.x-S.x,p.y-S.y)<30){S.found=1;secret95(X);}}
function loot95(X,q){q.got=1;const S=G.save,w=G.mode==='world'&&S;if(q.k==='chest'){if(w)S.lom+=60;else G.score+=600;floater(q.x,q.y-30,w?'СУНДУК · +60 ЛОМА':'СУНДУК · +600 ОЧКОВ','#ffb84d');const p=G.player;if(p)p.en=Math.min(100,p.en+40);snd95('chest',q.x);hs90(.05,0);}
  if(q.k==='tag'){if(w)S.lom+=40;floater(q.x,q.y-30,'ЖЕТОН · '+q.nm+(w?' · +40 ЛОМА':''),C95.lost);radioLine('ЖЕТОН',C95.lost,'«Пилот '+q.nm+'. Последняя запись: “Если найдёте — я долетел”».',.2);snd95('secret',q.x);}}
function secret95(X){const S=G.save,m=G.m,w=G.mode==='world'&&S&&S.story;if(w){S.story.sec95=(S.story.sec95||0)|(1<<(m-39));S.lom+=80;}floater(X.sec95.x,X.sec95.y-30,w?'ТАЙНИК · +80 ЛОМА':'ТАЙНИК','#ffffff');snd95('secret',X.sec95.x);hs90(.06,0);if(G.mc)G.mc.sec95=1;
  if(SET.fx)for(let i=0;i<16;i++){const a=rnd(0,TAU);part(X.sec95.x,X.sec95.y,Math.cos(a)*160,Math.sin(a)*160,.6,'#ffffff',2);}}
// --- события арены (волна 3): баннер, звук, перестройка за 2 с ---
function ev95Start(X){const L=X.lv95,k=L.ev;banner(L.evName[0],L.evName[1]);snd95('event',W/2);trauma90(.3);hs90(.12,1);
  if(k==='rev'){X.ev95={k,t:2,flip:0};}
  if(k==='quar'){X.ev95={k,t:10,sp:0};for(const Lk of X.locks)Lk.st='warn';}
  if(k==='zap'){X.ev95={k,t:16,a:rnd(0,TAU),hitT:0};}
  if(k==='fog'){X.ev95={k,t:20};}
  if(k==='mir'){X.ev95={k,t:2,flip:0};}
  if(k==='wave9'){if(X.tide){X.tide.wave9=1;X.tide.next=Math.min(X.tide.next,4);if(X.tide.bands){X.tide.bands=null;X.tide.band=null;}X.tide.warn=null;}X.ev95=null;}}
function ev95Tick(X,dt){const E=X.ev95,p=G.player;E.t-=dt;
  if(E.k==='rev'){if(E.t<=1&&!E.flip){E.flip=1;for(const f of X.flows)f.rev95=!f.rev95;trauma90(.2);}for(const f of X.flows)f.k95=Math.abs(E.t-1);}
  if(E.k==='quar'&&!E.sp){E.sp=1;const comp=[[.15,.5],[.5,.5],[.85,.5]],pool=['keeper90','phago90','clot90','spasm95','cell95'];for(const [u,v] of comp){for(let i=0;i<2;i++){const P=rot95(u+rnd(-.08,.08),v+rnd(-.3,.3));if(p&&Math.hypot(P.x-p.x,P.y-p.y)<180)continue;spawnEnemy(pool[Math.random()*pool.length|0],P.x,P.y,{spawnT:.8});}}}
  if(E.k==='zap'){const live=E.t<15;E.a+=(live?25:8)*Math.PI/180*dt;const c=X.pil95.find(q=>q.core);if(live&&c&&p&&p.hp>0&&p.dashT<=0){E.hitT-=dt;for(let i=0;i<4;i++){const a=E.a+i*Math.PI/2,x2=c.x+Math.cos(a)*1600,y2=c.y+Math.sin(a)*1600;if(E.hitT<=0&&segDist(c.x+Math.cos(a)*c.r,c.y+Math.sin(a)*c.r,x2,y2,p.x,p.y)<9+p.r*.55){E.hitT=.8;damagePlayer(10);floater(p.x,p.y-30,'РАЗРЯД −10','#ffe47a');}}}
    if(E.t<=0)snd95('zap',W/2);}
  if(E.k==='mir'){if(E.t<=1&&!E.flip){E.flip=1;mirror95(X);}}
  if(E.t<=0){if(E.k==='rev')for(const f of X.flows)f.k95=1;X.ev95=null;}}
function mirror95(X){X.mir95=X.mir95?0:1;const fx=x=>W-x;const p=G.player;if(p){p.x=fx(p.x);p.px=fx(p.px);p.vx=-p.vx;p.ang=Math.PI-p.ang;}
  for(const e of G.enemies){if(!e.alive)continue;e.x=fx(e.x);e.vx=-e.vx;if(e.ex!==undefined&&e.type==='witness100')e.ex=fx(e.ex);}
  for(const b of G.eb){b.x=fx(b.x);b.vx=-b.vx;}for(const b of G.pb){b.x=fx(b.x);b.px=fx(b.px);b.vx=-b.vx;}for(const k of G.pick){k.x=fx(k.x);k.vx=-k.vx;}
  for(const z of X.ez)z.x=fx(z.x);for(const s of X.estr95||[]){s.x1=fx(s.x1);s.x2=fx(s.x2);}for(const q of X.loot95)q.x=fx(q.x);if(X.ink95)for(const m of X.ink95)m.x=fx(m.x);for(const w of G.warns){w.x=fx(w.x);w.mx=fx(w.mx);}
  if(X.er){const w=X.er.w;[w[0],w[1]]=[w[1],w[0]];const n=X.er.wn;[n[0],n[1]]=[n[1],n[0]];}
  geo95(X,true);trauma90(.4);snd95('glitch',W/2);X.glitch95=.6;if(SET.fx)for(let i=0;i<30;i++)glyph95(rnd(0,W),rnd(0,H),1,C90.sh);}
// туман 43: автоприцел видит только вблизи
function targ95(e){const X=G.x90;if(!X||!inMission())return true;if(X.ev95&&X.ev95.k==='fog'&&G.player&&Math.hypot(e.x-G.player.x,e.y-G.player.y)>340)return false;if(X.pil95&&X.pil95.length&&G.player&&!EDEF[e.type].sbp&&wallBlock95(G.player,e))return false;return true;}
// --- рисунок уровня ---
function lvUnder95(X,t){if(!X.lv95)return;const k=sz95();
  // многоугольники стирания (берег 45) и песчаные косы (43)
  for(const P of X.poly95||[]){ctx.beginPath();ctx.moveTo(P[0].x,P[0].y);for(let i=1;i<P.length;i++)ctx.lineTo(P[i].x,P[i].y);ctx.closePath();ctx.fillStyle='rgba(3,6,7,.94)';ctx.fill();ctx.strokeStyle=rgba90(C90.sh,.75);ctx.lineWidth=1.6;ctx.stroke();ctx.strokeStyle=rgba90(C90.sh,.18);ctx.lineWidth=8;ctx.stroke();}
  for(const s of X.spits95||[]){ctx.lineCap='round';ctx.strokeStyle='rgba(3,6,7,.94)';ctx.lineWidth=s.w;ctx.beginPath();ctx.moveTo(s.x1,s.y1);ctx.lineTo(s.x2,s.y2);ctx.stroke();ctx.strokeStyle=rgba90(C90.sh,.55);ctx.lineWidth=1.5;ctx.setLineDash([5,7]);ctx.lineDashOffset=-t*10;
    const dx=s.x2-s.x1,dy=s.y2-s.y1,l=Math.hypot(dx,dy)||1,nx=-dy/l*s.w/2,ny=dx/l*s.w/2;ctx.beginPath();ctx.moveTo(s.x1+nx,s.y1+ny);ctx.lineTo(s.x2+nx,s.y2+ny);ctx.moveTo(s.x1-nx,s.y1-ny);ctx.lineTo(s.x2-nx,s.y2-ny);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;ctx.lineCap='butt';}
  // поры
  if(X.sec===8)for(const q of X.pores95){const o=clamp(q.open,0,1);ctx.fillStyle='rgba(40,6,12,.85)';ctx.strokeStyle=rgba90(C90.red,.45+.4*o);ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(q.x,q.y,14+8*o,9+6*o,Math.atan2(H/2-q.y,W/2-q.x),0,TAU);ctx.fill();ctx.stroke();if(o>0)glow(q.x,q.y,40,C90.blood,.5*o);}
  // стрелки потока после «Прилива крови»
  // эффект появления врагов в X: дрожание края
  for(const w of G.warns){if(!w.o||!w.o.sp95)continue;const u=clamp(1-w.t,0,1);if(w.o.sp95===9){ctx.strokeStyle=rgba90(C90.sh,.3+.5*u);ctx.lineWidth=1.5;ctx.setLineDash([3,4]);ctx.beginPath();ctx.arc(w.x,w.y,10+16*u,0,TAU);ctx.stroke();ctx.setLineDash([]);}
    else{glow(w.x,w.y,30+20*u,C90.blood,.3+.4*u);}}
  // разряд ганглия
  const E=X.ev95;if(E&&E.k==='zap'){const c=X.pil95.find(q=>q.core);if(c){const live=E.t<15;for(let i=0;i<4;i++){const a=E.a+i*Math.PI/2,x1=c.x+Math.cos(a)*c.r,y1=c.y+Math.sin(a)*c.r,x2=c.x+Math.cos(a)*1600,y2=c.y+Math.sin(a)*1600;
    if(live){ctx.strokeStyle=rgba90('#ffe47a',.25);ctx.lineWidth=18;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.strokeStyle='#fff6c4';ctx.lineWidth=2.5;ctx.stroke();}
    else{ctx.setLineDash([8,8]);ctx.lineDashOffset=-t*40;ctx.strokeStyle=rgba90('#ffe47a',.5);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;}}}}}
function pilPaint95(c,q,sec,hit,dmg,t){
  if(sec===8){c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(4,6,q.r*1.05,q.r,0,0,TAU);c.fill();c.fillStyle=hit?'#5a1420':'#2a0a12';c.strokeStyle=hit?'#ffffff':'#e0a0a8';c.lineWidth=2.5;c.beginPath();for(let i=0;i<=18;i++){const a=i/18*TAU,rr=q.r*(1+.05*Math.sin(a*5+q.u*9+t*1.2));if(i)c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);else c.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}c.closePath();c.fill();c.stroke();
        c.strokeStyle=rgba90('#c0405a',.7);c.lineWidth=3;c.beginPath();c.arc(0,0,q.r*.68,0,TAU);c.stroke();c.fillStyle='#120408';c.beginPath();c.arc(0,0,q.r*.38,0,TAU);c.fill();c.strokeStyle=rgba90('#ff8a9a',.5);c.lineWidth=1.2;c.stroke();
        c.strokeStyle=rgba90('#e0a0a8',.35);c.lineWidth=1;for(let i=0;i<8;i++){const a=i/8*TAU+q.v*3;c.beginPath();c.moveTo(Math.cos(a)*q.r*.4,Math.sin(a)*q.r*.4);c.lineTo(Math.cos(a)*q.r*.66,Math.sin(a)*q.r*.66);c.stroke();}
        if(dmg>.15){c.strokeStyle=rgba90('#ffe9b0',.35+.5*dmg);c.lineWidth=1.5;c.beginPath();c.moveTo(-q.r*.9,-q.r*.2);c.lineTo(-q.r*.3,q.r*.1);c.lineTo(q.r*.1,-q.r*.25);if(dmg>.5){c.moveTo(q.r*.2,q.r*.85);c.lineTo(q.r*.35,q.r*.3);c.lineTo(q.r*.8,q.r*.15);}c.stroke();}}
  else{c.fillStyle=hit?'#13221e':'#0a1412';c.strokeStyle=hit?'#ffffff':rgba90(C90.sh,.75);c.lineWidth=1.8;c.beginPath();const n=7;for(let i=0;i<=n;i++){const a=i/n*TAU+q.u*5,rr=q.r*(.82+.18*((i*37+Math.round(q.v*100))%5)/4);if(i)c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);else c.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}c.closePath();c.fill();c.stroke();
      c.font='700 '+Math.round(q.r*.5)+'px "JetBrains Mono",monospace';c.textAlign='center';c.textBaseline='middle';c.fillStyle=rgba90(C90.sh,.35+.3*dmg);c.fillText(GLYPH95[(Math.round(q.u*31+q.v*17))%GLYPH95.length],0,1);c.textAlign='left';c.textBaseline='alphabetic';}}
// кэш спрайтов столбов и обломков: тело рисуется один раз на состояние (удар, трещины)
const PIL95C=new Map();
function pilSpr95(q,sec,hit,dl){const S=DPR*SC>2.2?3:2,key=Math.round(q.u*1e4)+'|'+Math.round(q.v*1e4)+'|'+Math.round(q.r)+'|'+sec+'|'+(hit?1:0)+'|'+dl+'|'+S;let c=PIL95C.get(key);if(c)return c;
  const R=q.r*1.4,sz=Math.ceil(R*2*S);c=document.createElement('canvas');c.width=c.height=sz;const g=c.getContext('2d');g.setTransform(S,0,0,S,R*S,R*S);pilPaint95(g,q,sec,hit,dl===2?.6:dl===1?.3:0,0);
  if(PIL95C.size>160)PIL95C.clear();PIL95C.set(key,c);return c;}
const CORE95=new Map();
function coreSpr95(q,layer){const S=DPR*SC>2.2?3:2,key=Math.round(q.r)+'|'+layer+'|'+S;let c=CORE95.get(key);if(c)return c;const R=q.r*1.15,sz=Math.ceil(R*2*S);c=document.createElement('canvas');c.width=c.height=sz;const g=c.getContext('2d');g.setTransform(S,0,0,S,R*S,R*S);
  if(layer===0){g.fillStyle='#2a0810';g.strokeStyle=C90.ark;g.lineWidth=3;g.beginPath();g.arc(0,0,q.r,0,TAU);g.fill();g.stroke();g.strokeStyle=rgba90(C90.red,.6);g.lineWidth=2;for(let i=0;i<6;i++){const a=i/6*TAU;g.beginPath();g.moveTo(Math.cos(a)*q.r*.3,Math.sin(a)*q.r*.3);g.quadraticCurveTo(Math.cos(a+.4)*q.r*.7,Math.sin(a+.4)*q.r*.7,Math.cos(a+.2)*q.r*.95,Math.sin(a+.2)*q.r*.95);g.stroke();}}
  else{g.strokeStyle=rgba90('#ffe47a',.6);g.lineWidth=1.5;for(let i=0;i<7;i++){const a=i/7*TAU;g.beginPath();g.moveTo(Math.cos(a)*q.r*.22,Math.sin(a)*q.r*.22);g.quadraticCurveTo(Math.cos(a+.5)*q.r*.5,Math.sin(a+.5)*q.r*.5,Math.cos(a+.25)*q.r*.92,Math.sin(a+.25)*q.r*.92);g.stroke();}}
  CORE95.set(key,c);return c;}
function lvDraw95(X,t){if(!X.lv95)return;const k=sz95();
  for(const q of X.pil95){if(!q.alive)continue;const sec=X.sec,hit=q.hit>0,dmg=1-q.hp/q.max;ctx.save();ctx.translate(q.x,q.y);
    if(sec===8&&q.core){const pk=beat90(G.t),zp=X.ev95&&X.ev95.k==='zap';glow(0,0,q.r*1.8,C90.red,.25+.2*pk);
        // ядро ганглия — два слоя векторами (диск с красными жилами и жёлтые нервы): на слабом телефоне поворот больших спрайтов стоил втрое дороже путей (0.9.6)
        const z=1+.04*pk;ctx.save();ctx.rotate(t*.2);ctx.scale(z,z);coreVec96(q,0);ctx.restore();
        if(X.lv95.ring){glow(0,0,q.r*.9,'#ffe47a',(zp?.6:.3)+.2*Math.sin(t*5));ctx.fillStyle=rgba90('#fff6c4',.75+.2*Math.sin(t*5));ctx.beginPath();ctx.arc(0,0,q.r*.2*(1+.12*Math.sin(t*5)),0,TAU);ctx.fill();
          ctx.save();ctx.rotate(t*.4);coreVec96(q,1);ctx.restore();}}
    else{const dl=dmg>.5?2:dmg>.15?1:0,c=pilSpr95(q,sec,hit,dl),R=q.r*1.4,s=sec===8?1+.02*Math.sin(t*1.2+q.u*9):1;ctx.drawImage(c,-R*s,-R*s,R*2*s,R*2*s);}
    ctx.restore();}
  // строки-стены «Черновика»
  if(X.walls95.length){const warn=X.rowW95;for(const w of X.walls95){ctx.lineCap='round';ctx.strokeStyle=warn&&Math.sin(t*20)>0?'#ffffff':rgba90(C90.sh,.85);ctx.lineWidth=w.w;ctx.globalAlpha=.25;ctx.beginPath();ctx.moveTo(w.x1,w.y1);ctx.lineTo(w.x2,w.y2);ctx.stroke();ctx.globalAlpha=1;ctx.lineWidth=2;ctx.stroke();
      ctx.font='700 10px "JetBrains Mono",monospace';ctx.fillStyle=rgba90(C90.sh,.5);ctx.textAlign='center';const L=Math.hypot(w.x2-w.x1,w.y2-w.y1),n=Math.floor(L/18);for(let i=0;i<n;i++){const u=(i+.5)/n;ctx.fillText(GLYPH95[(i*7+Math.round(w.x1))%GLYPH95.length],w.x1+(w.x2-w.x1)*u,w.y1+(w.y2-w.y1)*u+3);}ctx.textAlign='left';ctx.lineCap='butt';}}
  // находки
  for(const q of X.loot95){const b=Math.sin(q.t*4)*3;glow(q.x,q.y,40,q.k==='tag'?C95.lost:'#ffb84d',.4+.2*Math.sin(q.t*3));ctx.save();ctx.translate(q.x,q.y+b);
    if(q.k==='chest'){ctx.fillStyle='#2a1a06';ctx.strokeStyle='#ffb84d';ctx.lineWidth=2;ctx.fillRect(-13,-9,26,18);ctx.strokeRect(-13,-9,26,18);ctx.beginPath();ctx.moveTo(-13,-2);ctx.lineTo(13,-2);ctx.stroke();ctx.fillStyle='#ffb84d';ctx.fillRect(-3,-5,6,6);}
    else{ctx.strokeStyle=C95.lost;ctx.fillStyle='#10161c';ctx.lineWidth=2;ctx.beginPath();ctx.rect(-8,-11,16,22);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(0,-6,2.5,0,TAU);ctx.stroke();}ctx.restore();worldLabel(q.x,q.y-24,q.k==='chest'?'СУНДУК':'ЖЕТОН',q.k==='tag'?C95.lost:'#ffb84d');}
  const S=X.sec95;if(S&&!S.found&&S.vis){const p=G.player,near=p&&Math.hypot(p.x-S.x,p.y-S.y)<260;ctx.save();ctx.translate(S.x,S.y);ctx.rotate(t*1.2);ctx.globalAlpha=near?.95:.35+.2*Math.sin(t*3);ctx.strokeStyle='#ffffff';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(6,0);ctx.lineTo(0,8);ctx.lineTo(-6,0);ctx.closePath();ctx.stroke();ctx.restore();ctx.globalAlpha=1;if(near)worldLabel(S.x,S.y-18,'ТАЙНИК','#ffffff');}}
function lvTop95(X,t){const E=X.ev95,p=G.player;
  if(E&&E.k==='fog'&&p){const a=clamp(Math.min(E.t,20-E.t)*1.5,0,1);fog95(p,a);}
  if(X.glitch95>0){X.glitch95-=VDT74;/* ARCH·75 A-22 */ctx.save();ctx.setTransform(1,0,0,1,0,0);const w=cv.width,h=cv.height;for(let i=0;i<8;i++){const y=Math.random()*h,hh=rnd(4,30)*DPR;ctx.globalAlpha=.25;ctx.fillStyle=Math.random()<.5?'#7affc9':'#ffffff';ctx.fillRect(0,y,w,hh*.15);}ctx.restore();}}
// туман: тёмный экран с окном 300 px вокруг игрока (кэш спрайта)
let FOG95=null;
function fog95(p,a){if(!FOG95){const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d'),gr=g.createRadialGradient(256,256,0,256,256,256);gr.addColorStop(0,'rgba(2,5,6,0)');gr.addColorStop(.55,'rgba(2,5,6,.15)');gr.addColorStop(.8,'rgba(2,5,6,.9)');gr.addColorStop(1,'rgba(2,5,6,.97)');g.fillStyle=gr;g.fillRect(0,0,512,512);FOG95=c;}
  const R=380,x=p.x-R,y=p.y-R;ctx.save();ctx.globalAlpha=a;ctx.drawImage(FOG95,x,y,R*2,R*2);ctx.fillStyle='rgba(2,5,6,.97)';const X0=(G.arena?CX:0)-50,Y0=(G.arena?CY:0)-50,X1=X0+VW+100,Y1=Y0+VH+100;
  ctx.fillRect(X0,Y0,X1-X0,Math.max(0,y-Y0));ctx.fillRect(X0,y+R*2,X1-X0,Math.max(0,Y1-y-R*2));ctx.fillRect(X0,y,Math.max(0,x-X0),R*2);ctx.fillRect(x+R*2,y,Math.max(0,X1-x-R*2),R*2);ctx.restore();}
// верхняя полоска прочности элиты кульминации и Стёртого пилота
function eliteBar95(t){const e=G.enemies.find(o=>o.alive&&(o.elite95)&&o.spawnT<=0);if(!e)return;const mob=isMob(),S=mob?1:SC,vw=mob?CW:VW;ctx.save();ctx.setTransform(DPR*S,0,0,DPR*S,0,0);const w=Math.min(360,vw*(mob&&!isPortrait()?.44:.6)),x=vw/2-w/2,y=mob?(isPortrait()?166:CH-16):100;
  ctx.fillStyle='rgba(6,8,12,.82)';ctx.fillRect(x-2,y-2,w+4,12);ctx.fillStyle=EDEF[e.type].col;ctx.fillRect(x,y,w*clamp(e.hp/e.maxHp,0,1),8);ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=1;ctx.strokeRect(x-2,y-2,w+4,12);
  const lbl=e.type==='lost95'?'СТЁРТЫЙ ПИЛОТ · '+(e.nm95||''):'ЭЛИТА · '+EDEF[e.type].name.toUpperCase();ctx.font='700 '+(mob?11:10)+'px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillStyle='#04060c';ctx.fillText(lbl,vw/2+1,y-5);ctx.fillStyle='#ffffff';ctx.fillText(lbl,vw/2,y-6);ctx.textAlign='left';ctx.restore();}

