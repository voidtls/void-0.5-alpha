// ===== 0.9.5: открытый мир IX–X — патрули, события, безопасные зоны, фон секторов =====
const W95={gen:false,art:[],deb:[],sites:{},pat:[],quiet:0,patCd:8,ev:null,evCd:45,kills:[],immCd:0,lostCd:120,boost:0,lastSec:-1,waves:[],loot:[],hold:null};
function secW95(){if(!G.world||!G.player||!WORLD.sectors[9])return -1;const s=sectorIdx(G.player.x,G.player.y);return s===8||s===9?s:-1;}
function w95S(){const S=G.save;if(!S||!S.story)return {};return S.story.w95||(S.story.w95={});}
function w95Gen(){if(W95.gen||!W90.gen||!WORLD.sectors[9])return;W95.gen=true;const N=WORLD.nodes,ex=[...WORLD.shops,WORLD.hangar,WORLD.arsenal].filter(Boolean);
  const okAt=(x,y,dn,dp)=>w58Far(x,y,N,dn)&&w58Far(x,y,W80.zones,dp)&&w58Far(x,y,W90.pods,dp)&&w58Far(x,y,ex,800)&&inSectors(x,y);
  // артерии сектора IX: длинные красные течения через сектор
  {const b=WORLD.sectors[8].box,R=mulberry(9501);for(let a=0;a<3;a++){const pts=[];let x=b[0]+200,y=b[1]+(b[3]-b[1])*(a+.5)/3,dir=0;for(let i=0;i<10;i++){pts.push({x,y});dir+=(R()-.5)*.9;x+=(b[2]-b[0]-400)/9;y=clamp(y+Math.sin(dir)*300,b[1]+200,b[3]-200);}W95.art.push(pts);}}
  // обломки памяти сектора X (их переписывают в мины)
  {const b=WORLD.sectors[9].box,R=mulberry(9601);for(let i=0;i<22;i++){const x=b[0]+300+R()*(b[2]-b[0]-600),y=b[1]+300+R()*(b[3]-b[1]-600);if(okAt(x,y,500,400))W95.deb.push({x,y,r:16+R()*14,alive:true,rot:R()*TAU});}}
  // постоянные места событий
  const st=(k,sec,seed)=>{const q=pt80(sec,seed,(x,y,k_)=>okAt(x,y,1100*k_,900*k_),600);W95.sites[k]={k,sec,x:q.x,y:q.y,st:'idle'};};
  st('gclot',8,9701);st('typoW',9,9711);st('sig',9,9721);
  {const s=W95.sites.sig;s.pts=[0,1,2].map(i=>{const a=i/3*TAU+.4;return {x:s.x+Math.cos(a)*520,y:s.y+Math.sin(a)*520,ch:0};});s.i=0;}}
// безопасные зоны: станции и порталы, r 380 — враги туда не входят
function safe95(x,y){for(const q of WORLD.shops)if(Math.hypot(x-q.x,y-q.y)<380)return q;if(WORLD.hangar&&Math.hypot(x-WORLD.hangar.x,y-WORLD.hangar.y)<380)return WORLD.hangar;if(WORLD.arsenal&&Math.hypot(x-WORLD.arsenal.x,y-WORLD.arsenal.y)<380)return WORLD.arsenal;
  for(const n of WORLD.nodes)if((n.sec===8||n.sec===9)&&Math.hypot(x-n.x,y-n.y)<380)return n;return null;}
function w95Hostile(e){return e.alive&&!EDEF[e.type].passive&&!STATIC.has(e.type)&&!e.peace&&e.dig===undefined&&!e.sbk;}
// --- тик мира ---
function w95WorldTick(dt){const p=G.player,S=G.save;if(!p||!S)return;
  if(G.wn90&&G.wn90.length)G.wn90=G.wn90.filter(n=>n.nodes.some(e=>e.alive&&Math.hypot(e.x-p.x,e.y-p.y)<3200));
  w95Gen();if(!W95.gen)return;const sec=secW95();
  if(W95.boost>0)W95.boost-=dt;G.wz95=(typeof zbZoom==='function'&&zbZoom())||(sec===8&&SET.fx&&!SET.lessFx?1+.006*beat90(G.t*1.1/1.2):1);
  tgTick95(dt);wvTick95(dt);glTick95(dt);inkTick95(dt);boomTick95(dt);tq95Tick(dt);ebTick95(dt);markTick95(dt);tongueBuild95();
  if(G.wpud95&&G.wpud95.length){for(const q of G.wpud95)q.t-=dt;G.wpud95=G.wpud95.filter(q=>q.t>0);if(p.dashT<=0)for(const q of G.wpud95)if(Math.hypot(p.x-q.x,p.y-q.y)<q.r){p.x=p.px+(p.x-p.px)*.6;p.y=p.py+(p.y-p.py)*.6;break;}}
  if(G.wtongue95&&G.wtongue95.length&&p.dashT<=0){for(const s of G.wtongue95)if(capD95(p.x,p.y,s.x1,s.y1,s.x2,s.y2,s.w)>0){drain90(6*dt);break;}}
  // безопасные зоны выталкивают врагов
  if(sec>=0)for(const e of G.enemies){if(!w95Hostile(e))continue;const z=safe95(e.x,e.y);if(z){const dx=e.x-z.x,dy=e.y-z.y,d=Math.hypot(dx,dy)||1;e.x=z.x+dx/d*382;e.y=z.y+dy/d*382;if(e.vx*dx+e.vy*dy<0){e.vx*=-.3;e.vy*=-.3;}}}
  if(sec!==W95.lastSec){W95.lastSec=sec;if(sec>=0){W95.quiet=0;W95.patCd=Math.max(W95.patCd,6);}}
  if(sec<0||G.state!=='world'||p.hp<=0||G.anom){w95PatTick(dt,-1);return;}
  // пауза без угрозы — не дольше 25 секунд
  let near=0,n1200=0;for(const e of G.enemies){if(!w95Hostile(e))continue;const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<1200)n1200++;if(d<900)near=1;}
  const quietZ=!!safe95(p.x,p.y);if(near||quietZ)W95.quiet=0;else W95.quiet+=dt;W95.patCd-=dt;
  const minN=sec===8?5:4;if(!quietZ&&W95.patCd<=0&&(W95.quiet>25||n1200<minN-2)&&W95.pat.length<3){w95Patrol(sec);W95.patCd=20;W95.quiet=0;}
  // иммунный ответ: шесть убийств за 30 секунд
  W95.kills=W95.kills.filter(t=>G.t-t<30);if(W95.immCd>0)W95.immCd-=dt;if(sec===8&&W95.kills.length>=6&&W95.immCd<=0){W95.immCd=90;W95.kills=[];w95Immune();}
  w95PatTick(dt,sec);w95EvTick(dt,sec);w95Sites(dt,sec);w95LootTick(dt);}
function w95OffPt(minD){const p=G.player,b=WORLD.sectors[sectorIdx(p.x,p.y)].box;for(let i=0;i<40;i++){const a=rnd(0,TAU),d=(minD||Math.max(VW,VH)*.62+180)+rnd(0,200),x=p.x+Math.cos(a)*d,y=p.y+Math.sin(a)*d;if(x<b[0]+80||x>b[2]-80||y<b[1]+80||y>b[3]-80)continue;if(safe95(x,y)||safe95(x+200,y)||safe95(x-200,y))continue;return {x,y};}return null;}
function w95Sp(type,x,y,o){const e=spawnEnemy(type,x,y,Object.assign({noAffix:true,spawnT:.5},o||{}));return e;}
function w95Patrol(sec){const p=G.player;let kind;if(sec===8)kind='krov';else kind=W95.lostCd<=0&&!W95.pat.some(q=>q.kind==='lost')&&Math.random()<.35?'lost':'pravka';
  if(kind==='krov'){let best=null,bd=1e9,bi=0;for(const A of W95.art)for(let i=0;i<A.length;i++){const d=Math.hypot(A[i].x-p.x,A[i].y-p.y);if(d>700&&d<bd){bd=d;best=A;bi=i;}}if(!best||bd>2200){const q=w95OffPt();if(!q)return;best=null;var sx=q.x,sy=q.y;}else{sx=best[bi].x;sy=best[bi].y;}
    const P={kind,mem:[],art:best,ai:bi,dir:Math.random()<.5?1:-1,aggro:0,t:0};const L=w95Sp('hunt95',sx,sy,{packN95:2,idle95:1});L.pat95=P;huntInit95(L);for(const m of L.pack95.mem){m.idle95=1;m.pat95=P;P.mem.push(m);}
    const sp=w95Sp('spasm95',sx+40,sy+30,{idle95:1});P.mem.push(sp);for(const m of P.mem)m.pat95=P;W95.pat.push(P);}
  else if(kind==='pravka'){const q=w95OffPt();if(!q)return;const P={kind,mem:[],aggro:0,t:0,tgt:null};const s=w95Sp('scribe95',q.x,q.y,{idle95:1});P.mem.push(s);for(let i=0;i<2;i++)P.mem.push(w95Sp('blot95',q.x+rnd(-60,60),q.y+rnd(-60,60),{idle95:1}));for(const m of P.mem)m.pat95=P;W95.pat.push(P);}
  else{const q=w95OffPt(520);if(!q)return;W95.lostCd=150;const P={kind,mem:[],aggro:0,t:0,still:0};const e=w95Sp('lost95',q.x,q.y,{idle95:1});P.mem.push(e);e.pat95=P;W95.pat.push(P);radioLine('???',C95.lost,'…я держусь позади. Не останавливайся…',.6);}}
function w95Immune(){const q=w95OffPt(560);if(!q)return;banner('ИММУННЫЙ ОТВЕТ','КОВЧЕГ РЕАГИРУЕТ НА ВАС');snd95('event',q.x);const P={kind:'imm',mem:[],aggro:1,t:0};P.mem.push(w95Sp('guard95',q.x,q.y));for(let i=0;i<3;i++)P.mem.push(w95Sp('cell95',q.x+rnd(-80,80),q.y+rnd(-80,80)));for(const m of P.mem)m.pat95=P;W95.pat.push(P);}
function idle95(e,dt){const P=e.pat95,p=G.player;if(!P||P.aggro){e.idle95=0;return false;}
  if(P.kind==='krov'){const A=P.art;if(!A){P.aggro=1;return false;}const T=A[P.ai];if(!T){P.dir*=-1;P.ai=clamp(P.ai,0,A.length-1);return false;}const lead=P.mem[0]===e;if(lead&&Math.hypot(T.x-e.x,T.y-e.y)<60){P.ai+=P.dir;if(P.ai<0||P.ai>=A.length){P.dir*=-1;P.ai=clamp(P.ai,0,A.length-1);}}
    const L=P.mem[0]&&P.mem[0].alive?P.mem[0]:e,tx=lead?T.x:L.x+Math.cos(e.uid)*50,ty=lead?T.y:L.y+Math.sin(e.uid)*50;steer(e,tx-e.x,ty-e.y,e.spd*.5,dt,2);return true;}
  if(P.kind==='pravka'){const s=P.mem[0];if(e===s){if(!P.tgt||!P.tgt.alive){let bd=1e9;P.tgt=null;for(const d of W95.deb){if(!d.alive)continue;const q=Math.hypot(d.x-e.x,d.y-e.y);if(q<bd&&q<1600){bd=q;P.tgt=d;}}}const D=P.tgt;if(!D){P.aggro=1;return false;}
      const d=Math.hypot(D.x-e.x,D.y-e.y);if(d>50){steer(e,D.x-e.x,D.y-e.y,e.spd*.6,dt,2);P.wr=0;}else{e.vx*=.8;e.vy*=.8;P.wr=(P.wr||0)+dt;if(P.wr>=1.2){P.wr=0;D.alive=false;inkMine95(D.x,D.y);glyph95(D.x,D.y,8,C95.scribe);floater(D.x,D.y-24,'ОБЛОМОК ПЕРЕПИСАН · МИНА',C95.scribe);P.tgt=null;}}return true;}
    const L=s&&s.alive?s:e;steer(e,L.x+Math.cos(e.uid+G.t)*70-e.x,L.y+Math.sin(e.uid+G.t)*70-e.y,e.spd*.5,dt,2);return true;}
  if(P.kind==='lost'){const d=Math.hypot(p.x-e.x,p.y-e.y),a=Math.atan2(e.y-p.y,e.x-p.x);steer(e,p.x+Math.cos(a)*300-e.x,p.y+Math.sin(a)*300-e.y,e.spd*(d>420?1.2:.7),dt,2);e.face=Math.atan2(p.y-e.y,p.x-e.x);return true;}
  return false;}
function w95PatTick(dt,sec){const p=G.player;for(const P of W95.pat){P.t+=dt;P.mem=P.mem.filter(m=>m.alive);
    if(!P.mem.length){if(!P.gone&&P.kind==='krov'&&P.killed){W95.boost=8;p.en=Math.min(100,p.en+50);floater(p.x,p.y-44,'КРОВОТОК ЗАЧИЩЕН · ПУЛЬС · СКОРОСТЬ +15%',C90.ark);snd95('chest',p.x);}P.done=1;continue;}
    let far=true;for(const m of P.mem){const d=Math.hypot(m.x-p.x,m.y-p.y);if(d<2600)far=false;if(m.hp<m.maxHp-.5)P.killed=P.aggro=1;
      if(!P.aggro&&P.kind!=='lost'&&(d<300||P.kind==='krov'&&d<520&&P.art&&artNear95(P.art,p.x,p.y)<120)){P.aggro=1;floater(m.x,m.y-30,P.kind==='krov'?'КРОВОТОК · ЗАМЕТИЛИ':'ПРАВКА · ЗАМЕТИЛИ',EDEF[m.type].col);snd95('mark',m.x);}}
    if(P.kind==='lost'&&!P.aggro){const sp=Math.hypot(p.vx,p.vy);P.still=sp<30?P.still+dt:0;if(P.still>3){P.aggro=1;floater(P.mem[0].x,P.mem[0].y-30,'ОН АТАКУЕТ',C95.lost);}const z=safe95(p.x,p.y);if(z){for(const m of P.mem){m.alive=false;glyph95(m.x,m.y,10,C95.lost);}const nm=LOSTN95[Math.random()*LOSTN95.length|0];floater(p.x,p.y-44,'ЗАПИСЬ ПИЛОТА · '+nm,C95.lost);radioLine('ПИЛОТ '+nm,C95.lost,'«Вы довели меня до света. Я помню, как меня звали. Этого достаточно».',.4);if(G.save)G.save.lom+=50;snd95('secret',p.x);P.gone=1;}}
    if(P.aggro)for(const m of P.mem)m.idle95=0;
    if(far&&!P.aggro||sec<0&&far){for(const m of P.mem)m.alive=false;P.gone=1;P.done=1;}}
  W95.pat=W95.pat.filter(P=>!P.done);if(W95.lostCd>0)W95.lostCd-=dt;}
function artNear95(A,x,y){let d=1e9;for(let i=0;i<A.length-1;i++)d=Math.min(d,segDist(A[i].x,A[i].y,A[i+1].x,A[i+1].y,x,y));return d;}
// --- события мира: Аритмия и Отлив (ротация каждые 90 с), Тромбоз, Опечатка в мире, Последний сигнал (места) ---
function w95EvTick(dt,sec){const p=G.player;const E=W95.ev;
  if(!E){W95.evCd-=dt;if(W95.evCd<=0&&!safe95(p.x,p.y)){W95.evCd=90;if(sec===8)w95EvStart('arr');else w95EvStart('ebb');}}
  else{E.t-=dt;
    if(E.k==='arr'){E.wt-=dt;if(E.wt<=0){E.wt=1.6;W95.waves.push({x:E.x,y:E.y,r:30,v:520,R:1100,hit:false});snd90('beat',.8);trauma90(.08);}
      for(const e of G.enemies)if(w95Hostile(e)&&Math.hypot(e.x-p.x,e.y-p.y)<1400){e.buff=Math.max(e.buff,1.2);}
      if(E.t<=0){W95.ev=null;if(G.save)G.save.lom+=80;floater(p.x,p.y-44,'АРИТМИЯ ПЕРЕЖИТА · +80 ЛОМА',C90.ark);snd95('chest',p.x);saveWorld();}}
    if(E.k==='ebb'){if(E.t<=0&&!E.wash){E.wash={pos:-E.R-100};floater(E.x,E.y-E.R*.5,'ПРИЛИВ ВОЗВРАЩАЕТСЯ',C90.sh);snd90('tide');trauma90(.3);}
      if(E.wash){E.wash.pos+=300*dt;const bx=E.x+E.wash.pos;if(p.hp>0&&p.dashT<=0&&Math.abs(p.x-bx)<80&&Math.abs(p.y-E.y)<E.R){if(!E.hitP){E.hitP=1;damagePlayer(12);}p.x+=300*dt;}
        for(const q of W95.loot)if(q.ebb&&Math.abs(q.x-bx)<80){q.got=1;glyph95(q.x,q.y,6,C90.sh);}if(E.wash.pos>E.R+100){W95.ev=null;}}}}
  for(const w of W95.waves){const r0=w.r;w.r+=w.v*dt;if(!w.hit&&p.hp>0&&p.dashT<=0){const d=Math.hypot(p.x-w.x,p.y-w.y);if(d>r0-10&&d<w.r+10){w.hit=true;const a=Math.atan2(p.y-w.y,p.x-w.x);p.x+=Math.cos(a)*26;p.y+=Math.sin(a)*26;p.vx=(p.vx||0)+Math.cos(a)*240;p.vy=(p.vy||0)+Math.sin(a)*240;}}}
  W95.waves=W95.waves.filter(w=>w.r<w.R);}
function w95EvStart(k){const p=G.player;if(k==='arr'){W95.ev={k,t:40,wt:1,x:p.x+rnd(-300,300),y:p.y+rnd(-300,300)};banner('АРИТМИЯ','СЕКТОР ПУЛЬСИРУЕТ · ВРАГИ УСИЛЕНЫ · 40 С');snd95('event',p.x);}
  if(k==='ebb'){const a=Math.atan2(p.vy||0,p.vx||1),x=p.x+Math.cos(a)*500,y=p.y+Math.sin(a)*300;W95.ev={k,t:45,x,y,R:560};for(let i=0;i<3;i++){const q=rnd(0,TAU),d=rnd(120,420);W95.loot.push({k:'chest',x:x+Math.cos(q)*d,y:y+Math.sin(q)*d*.6,t:0,ebb:1});}banner('ОТЛИВ','ВОДА УШЛА · СУНДУКИ НА ДНЕ · 45 С');snd95('event',x);}}
function w95Sites(dt,sec){const p=G.player,D=w95S();for(const k in W95.sites){const s=W95.sites[k];if(D[k]===(G.save.cycle||1)){s.st='done';continue;}const d=Math.hypot(p.x-s.x,p.y-s.y);
    if(k==='gclot'){if(s.st==='idle'&&d<900){s.st='on';const e=spawnEnemy('gclot95',s.x,s.y,{noAffix:true,spawnT:1});e.site95=s;s.e=e;banner('ТРОМБОЗ','ВЕЛИКИЙ ТРОМБ ПЕРЕКРЫЛ КРОВОТОК');snd95('event',s.x);}if(s.st==='on'&&s.e&&!s.e.alive&&!s.e.dead95){s.st='idle';}if(s.st==='on'&&d>2600&&s.e&&s.e.alive){s.e.alive=false;s.st='idle';}}
    if(k==='typoW'){if(s.st==='idle'&&d<520){s.st='on';s.mem=[spawnEnemy('fixer100',s.x,s.y-60,{noAffix:true,spawnT:.8}),spawnEnemy('echo100',s.x-80,s.y+40,{noAffix:true,spawnT:.8}),spawnEnemy('echo100',s.x+80,s.y+40,{noAffix:true,spawnT:.8})];banner('ОПЕЧАТКА В МИРЕ','КУСОК ФОНА СТЁРТ · ВНУТРИ — ПРАВКА');snd95('event',s.x);}
      if(s.st==='on'){if(s.mem.every(e=>!e.alive)){s.st='done';D[k]=G.save.cycle||1;G.save.lom+=120;floater(s.x,s.y-50,'ЧЕРТЁЖ · +120 ЛОМА','#ffffff');snd95('secret',s.x);saveWorld();}else if(d>2400){for(const e of s.mem)e.alive=false;s.st='idle';}}}
    if(k==='sig'){if(s.st==='idle'&&d<640){s.st='on';s.i=0;for(const q of s.pts)q.ch=0;banner('ПОСЛЕДНИЙ СИГНАЛ','ДЕРЖИТЕСЬ В ТРЁХ ТОЧКАХ ПО 15 СЕКУНД');snd95('event',s.x);s.spT=3;}
      if(s.st==='on'){const q=s.pts[s.i];if(!q){s.st='done';D[k]=G.save.cycle||1;G.save.lom+=100;floater(s.x,s.y-60,'ОСКОЛОК ИСТОРИИ · +100 ЛОМА','#ffffff');radioLine('СИГНАЛ',C90.sh,'«…если кто-то держит этот маяк — значит, берег ещё помнят…»',.3);snd95('secret',s.x);saveWorld();continue;}
        if(Math.hypot(p.x-q.x,p.y-q.y)<150&&p.hp>0){q.ch+=dt;s.spT-=dt;if(s.spT<=0){s.spT=4.5;const o=w95OffPt(560);if(o)w95Sp(Math.random()<.5?'hollow100':'blot95',o.x,o.y);}if(q.ch>=15){s.i++;floater(q.x,q.y-40,'ТОЧКА '+s.i+'/3 УДЕРЖАНА',C90.sh);snd95('chime',q.x);}}else q.ch=Math.max(0,q.ch-dt*.5);
        if(d>2600){s.st='idle';}}}}}
function gclotDead95(e){const s=e.site95;if(!s)return;e.dead95=1;s.st='done';const D=w95S();D.gclot=G.save.cycle||1;G.save.lom+=150;const p=G.player;if(p)p.en=100;floater(e.x,e.y-50,'ЯДРО МОДУЛЯ · +150 ЛОМА','#ffd36b');snd95('secret',e.x);saveWorld();}
function w95LootTick(dt){const p=G.player;for(const q of W95.loot){q.t+=dt;if(p.hp>0&&Math.hypot(p.x-q.x,p.y-q.y)<36){q.got=1;if(G.save)G.save.lom+=60;floater(q.x,q.y-30,'СУНДУК · +60 ЛОМА','#ffb84d');snd95('chest',q.x);}}
  const L=G.wloot95;if(L)for(const q of L){if(p.hp>0&&Math.hypot(p.x-q.x,p.y-q.y)<36){q.got=1;if(G.save)G.save.lom+=40;floater(q.x,q.y-30,'ЖЕТОН · '+q.nm+' · +40 ЛОМА',C95.lost);snd95('secret',q.x);}}
  W95.loot=W95.loot.filter(q=>!q.got);if(L)G.wloot95=L.filter(q=>!q.got);}
// --- скорость после зачистки Кровотока ---
function boost95(p,dt){if(W95.boost>0&&G.world&&p.dashT<=0){p.x+=(p.x-p.px)*.15;p.y+=(p.y-p.py)*.15;}}
// --- фон секторов: параллакс (IX — сосуды, клетки, эритроциты; X — штриховка «недорисованного» мира) ---
const WBG95={};
function wbgTile95(k){if(WBG95[k])return WBG95[k];const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d'),R=mulberry(k==='v'?11:k==='c'?22:k==='e'?33:44);
  // бесшовная плитка: всё, что пересекает край, дорисовывается с другой стороны
  const O=[-512,0,512],W9=f=>{for(const dx of O)for(const dy of O)f(dx,dy);};
  if(k==='v'){g.lineCap='butt';g.lineJoin='round';for(let i=0;i<5;i++){const lw=10+R()*18,x0=R()*512,d=[];for(let j=0;j<8;j++)d.push((R()-.5)*120);const m=d.reduce((s_,v)=>s_+v,0)/8;for(let j=0;j<8;j++)d[j]-=m;
      const pts=[];let x=x0-d[7];for(let j=-1;j<=9;j++){pts.push([x,j*64]);x+=d[((j%8)+8)%8];}
      for(const dx of O){g.beginPath();g.moveTo(pts[0][0]+dx,pts[0][1]);for(let j=1;j<pts.length;j++)g.lineTo(pts[j][0]+dx,pts[j][1]);g.strokeStyle='rgba(150,30,50,.20)';g.lineWidth=lw;g.stroke();g.lineWidth=2;g.strokeStyle='rgba(255,120,140,.10)';g.stroke();}}}
  if(k==='c'){for(let i=0;i<14;i++){const x=R()*512,y=R()*512,r=14+R()*26;W9((dx,dy)=>{if(x+dx+r<0||x+dx-r>512||y+dy+r<0||y+dy-r>512)return;g.strokeStyle='rgba(255,140,160,.12)';g.lineWidth=2;g.beginPath();g.arc(x+dx,y+dy,r,0,TAU);g.stroke();g.fillStyle='rgba(120,20,40,.10)';g.fill();g.fillStyle='rgba(255,160,170,.14)';g.beginPath();g.arc(x+dx+r*.2,y+dy-r*.15,r*.3,0,TAU);g.fill();});}}
  if(k==='e'){for(let i=0;i<22;i++){const x=R()*512,y=R()*512,r=5+R()*6,rot=R()*TAU;W9((dx,dy)=>{if(x+dx+r<0||x+dx-r>512||y+dy+r<0||y+dy-r>512)return;g.fillStyle='rgba(216,54,74,.30)';g.beginPath();g.ellipse(x+dx,y+dy,r,r*.7,rot,0,TAU);g.fill();g.fillStyle='rgba(60,6,14,.4)';g.beginPath();g.ellipse(x+dx,y+dy,r*.4,r*.28,0,0,TAU);g.fill();});}}
  if(k==='s'){g.strokeStyle='rgba(207,232,224,.06)';g.lineWidth=1;for(let i=0;i<70;i++){const x=R()*512,y=R()*512,l=20+R()*60,a=-.8+R()*.3;W9((dx,dy)=>{g.beginPath();g.moveTo(x+dx,y+dy);g.lineTo(x+dx+Math.cos(a)*l,y+dy+Math.sin(a)*l);g.stroke();});}
    g.font='700 12px "JetBrains Mono",monospace';for(let i=0;i<10;i++){const al=.04+R()*.05,ch=GLYPH95[(R()*GLYPH95.length)|0],x=R()*500,y=12+R()*494;g.fillStyle='rgba(122,255,201,'+al+')';g.fillText(ch,x,y);}}
  return WBG95[k]=c;}
function wbg95(t,k,sx,sy){const sec=secW95();if(sec<0||!SET.fx)return;const L=sec===8?[['v',.18,1],['c',.42,1],['e',.75,.9]]:[['s',.25,1],['s',.6,.6]];
  const nL=G.q===undefined?L.length:Math.min(L.length,1+G.q);for(const [id,par,a] of L.slice(0,nL)){const T=wbgTile95(id),ox=-((CX*par)%512+512)%512,oy=-((CY*par)%512+512)%512;ctx.globalAlpha=a*(G.lowFx?.6:1);for(let x=ox;x<W;x+=512)for(let y=oy;y<H;y+=512)ctx.drawImage(T,x,y);}ctx.globalAlpha=1;}
// --- рисунок мира ---
function w95Draw(t){if(!W95.gen)return;const p=G.player,sec=secW95();
  // артерии
  if(sec===8||W95.art.some(A=>A.some(q=>inView(q.x,q.y,400)))){ctx.lineCap='round';for(const A of W95.art){if(!A.some(q=>inView(q.x,q.y,500)))continue;ctx.strokeStyle=rgba90(C90.red,.12);ctx.lineWidth=70;ctx.beginPath();ctx.moveTo(A[0].x,A[0].y);for(let i=1;i<A.length;i++)ctx.lineTo(A[i].x,A[i].y);ctx.stroke();
    ctx.setLineDash([16,26]);ctx.lineDashOffset=-t*90;ctx.strokeStyle=rgba90(C90.blood,.45);ctx.lineWidth=3;ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;}ctx.lineCap='butt';}
  // обломки памяти
  for(const d of W95.deb){if(!d.alive||!inView(d.x,d.y,60))continue;ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.rot+t*.1);ctx.strokeStyle=rgba90(C90.sh,.5);ctx.fillStyle='rgba(8,16,14,.8)';ctx.lineWidth=1.5;ctx.beginPath();for(let i=0;i<6;i++){const a=i/6*TAU,r=d.r*(.7+.3*((i*3)%4)/3);if(i)ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);else ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
  // пятна чернил, лужи, языки
  if(G.wpud95)for(const q of G.wpud95){if(!inView(q.x,q.y,q.r))continue;const a=Math.min(1,q.t,(q.t0-q.t)*3);rgDraw95(q.x,q.y,q.r,'#5a0a16',.75*a,0,[.8,.5*a]);}
  if(G.wtongue95)for(const s of G.wtongue95)tongueDraw95(s,t);
  if(G.wink95)for(const m of G.wink95)inkDraw95(m,t);
  // безопасные зоны — тонкие кольца
  if(sec>=0){const zs=[...WORLD.shops,WORLD.hangar,WORLD.arsenal,...WORLD.nodes.filter(n=>n.sec===sec)].filter(Boolean);ctx.setLineDash([4,12]);ctx.lineWidth=1.2;for(const z of zs){if(!inView(z.x,z.y,400))continue;ctx.strokeStyle=rgba90(sec===8?C90.warm:C90.sh,.22);ctx.beginPath();ctx.arc(z.x,z.y,380,0,TAU);ctx.stroke();}ctx.setLineDash([]);}
  // волны Аритмии
  for(const w of W95.waves){ctx.strokeStyle=rgba90(C90.blood,.4*(1-w.r/w.R));ctx.lineWidth=6;ctx.beginPath();ctx.arc(w.x,w.y,w.r,0,TAU);ctx.stroke();}
  // Отлив: дно с сундуками и возвращающаяся вода
  const E=W95.ev;if(E&&E.k==='ebb'&&inView(E.x,E.y,E.R+80)){ctx.fillStyle='rgba(122,255,201,.05)';ctx.beginPath();ctx.ellipse(E.x,E.y,E.R,E.R*.62,0,0,TAU);ctx.fill();ctx.strokeStyle=rgba90(C90.sh,.35);ctx.setLineDash([6,8]);ctx.stroke();ctx.setLineDash([]);
    for(let i=0;i<5;i++){ctx.strokeStyle=rgba90(C90.sh,.08);ctx.beginPath();ctx.ellipse(E.x,E.y+i*30-60,E.R*(.9-i*.12),E.R*.08,0,0,TAU);ctx.stroke();}
    if(!E.wash)worldLabel(E.x,E.y-E.R*.62-14,'ОТЛИВ · '+Math.ceil(E.t),C90.sh);else{const bx=E.x+E.wash.pos;ctx.fillStyle='rgba(3,6,7,.9)';ctx.fillRect(bx-80,E.y-E.R*.62,160,E.R*1.24);ctx.strokeStyle=C90.sh;ctx.strokeRect(bx-80,E.y-E.R*.62,160,E.R*1.24);}}
  for(const q of W95.loot){if(!inView(q.x,q.y,40))continue;const b=Math.sin(q.t*4)*3;glow(q.x,q.y,36,'#ffb84d',.4);ctx.save();ctx.translate(q.x,q.y+b);ctx.fillStyle='#2a1a06';ctx.strokeStyle='#ffb84d';ctx.lineWidth=2;ctx.fillRect(-12,-8,24,16);ctx.strokeRect(-12,-8,24,16);ctx.restore();}
  if(G.wloot95)for(const q of G.wloot95){if(!inView(q.x,q.y,40))continue;glow(q.x,q.y,30,C95.lost,.4);worldLabel(q.x,q.y-20,'ЖЕТОН',C95.lost);ctx.strokeStyle=C95.lost;ctx.strokeRect(q.x-7,q.y-10,14,20);}
  // места событий
  for(const k in W95.sites){const s=W95.sites[k];if(!inView(s.x,s.y,700))continue;
    if(k==='gclot'&&s.st!=='done'){ctx.strokeStyle=rgba90(C90.red,.3);ctx.lineWidth=40;ctx.beginPath();ctx.arc(s.x,s.y,260,0,TAU);ctx.stroke();if(s.st==='idle')worldLabel(s.x,s.y-290,'ТРОМБОЗ · КРОВОТОК ПЕРЕКРЫТ',C90.red);}
    if(k==='typoW'&&s.st!=='done'&&inView(s.x,s.y,480)){ctx.save();ctx.fillStyle='rgba(2,5,6,.86)';const BP=new Path2D();for(let i=0;i<=24;i++){const a=i/24*TAU,r=420+18*Math.sin(a*5+t);if(i)BP.lineTo(s.x+Math.cos(a)*r,s.y+Math.sin(a)*r);else BP.moveTo(s.x+Math.cos(a)*r,s.y+Math.sin(a)*r);}BP.closePath();ctx.fill(BP);
      // внутри — чистый лист: линовка и призрачные буквы, которые проступают и тают
      ctx.save();ctx.clip(BP);ctx.strokeStyle=rgba90(C90.sh,.06);ctx.lineWidth=1;ctx.beginPath();for(let y=s.y-440+((t*6)%36);y<s.y+440;y+=36){ctx.moveTo(s.x-440,y);ctx.lineTo(s.x+440,y);}ctx.stroke();ctx.strokeStyle=rgba90('#ff6f86',.08);ctx.beginPath();ctx.moveTo(s.x-330,s.y-440);ctx.lineTo(s.x-330,s.y+440);ctx.stroke();
      for(let i=0;i<14;i++){const u=(t*.12+i*.071)%1,gx=s.x-360+((i*137)%720),gy=s.y-360+((i*251)%720);ctx.globalAlpha=Math.sin(u*Math.PI)*.35;glyphDraw95(GLYPH95[(i*7+Math.floor(t*.3))%GLYPH95.length],gx,gy,15,C90.sh,false,0);}ctx.globalAlpha=1;ctx.restore();
      ctx.setLineDash([10,8]);ctx.lineDashOffset=-t*24;ctx.strokeStyle=rgba90(C90.sh,.75);ctx.lineWidth=1.6;ctx.stroke(BP);ctx.setLineDash([]);ctx.lineDashOffset=0;ctx.restore();worldLabel(s.x,s.y-440,'ОПЕЧАТКА В МИРЕ',C90.sh);}
    if(k==='sig'&&s.st!=='done'){ctx.save();ctx.translate(s.x,s.y);glow(0,0,90,C90.sh,.35+.15*Math.sin(t*2));ctx.strokeStyle=C90.sh;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-14,26);ctx.lineTo(-7,-18);ctx.lineTo(7,-18);ctx.lineTo(14,26);ctx.closePath();ctx.stroke();ctx.restore();worldLabel(s.x,s.y-40,'ПОСЛЕДНИЙ СИГНАЛ',C90.sh);
      s.pts.forEach((q,i)=>{const on=s.st==='on'&&s.i===i,done=s.st==='on'&&i<s.i;ctx.strokeStyle=done?'#ffffff':on?C90.sh:rgba90(C90.sh,.3);ctx.lineWidth=on?2.5:1.5;ctx.setLineDash(on?[]:[4,8]);ctx.beginPath();ctx.arc(q.x,q.y,150,0,TAU);ctx.stroke();ctx.setLineDash([]);if(on){ctx.strokeStyle='#ffffff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(q.x,q.y,156,-Math.PI/2,-Math.PI/2+TAU*q.ch/15);ctx.stroke();worldLabel(q.x,q.y-160,'ДЕРЖИТЕСЬ · '+Math.ceil(15-q.ch),'#ffffff');}});}}
  tgDraw95(t);wvDraw95(t);glDraw95();if(typeof enemyOver95==='function')enemyOver95(t);markPlayerDraw95(t);
  for(const e of G.enemies){if(!e.alive||!e.pat95||!inView(e.x,e.y,40))continue;if(e.pat95.kind==='pravka'&&e.type==='scribe95'&&e.pat95.wr>0&&e.pat95.tgt){const D=e.pat95.tgt;ctx.font='700 11px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillStyle=C95.scribe;for(let i=0;i<6;i++){const a=i/6*TAU+t*3,r=40*(1-e.pat95.wr/1.2);ctx.fillText(GLYPH95[(i*5+Math.floor(t*8))%GLYPH95.length],D.x+Math.cos(a)*r,D.y+Math.sin(a)*r);}ctx.textAlign='left';}}
  if(sec===8&&SET.fx&&!SET.lessFx){const k=beat90(G.t*1.1/1.2);if(k>.12)vig95('#d8364a',.1*k,.5);}
  if(sec===9&&SET.fx&&!G.lowFx){ctx.save();ctx.setTransform(DPR*SC,0,0,DPR*SC,0,0);ctx.font='700 12px "JetBrains Mono",monospace';for(let i=0;i<8;i++){const u=((t*.07+i*.137)%1),side=i%4,x=side<2?(side?VW-14:14):u*VW,y=side<2?u*VH:(side===2?16:VH-10);ctx.globalAlpha=.12*(1-Math.abs(u-.5)*2);ctx.fillStyle=C90.sh;ctx.fillText(GLYPH95[(i*9+Math.floor(t*.5))%GLYPH95.length],x,y);}ctx.restore();ctx.globalAlpha=1;}}
function tongueDraw95(s,t){ctx.lineCap='round';ctx.strokeStyle='rgba(3,6,7,.92)';ctx.lineWidth=s.w;ctx.beginPath();ctx.moveTo(s.x1,s.y1);ctx.lineTo(s.x2,s.y2);ctx.stroke();ctx.strokeStyle=rgba90(C95.ebb,.6);ctx.lineWidth=1.5;ctx.setLineDash([4,6]);ctx.lineDashOffset=-t*30;ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;ctx.lineCap='butt';}
function inkDraw95(m,t){const a=m.arm>0?.5:1;ctx.globalAlpha=a;ctx.fillStyle=C95.ink;ctx.strokeStyle=C90.sh;ctx.lineWidth=1.5;ctx.beginPath();for(let i=0;i<=10;i++){const q=i/10*TAU,r=11*(1+.25*Math.sin(q*3+m.x));if(i)ctx.lineTo(m.x+Math.cos(q)*r,m.y+Math.sin(q)*r);else ctx.moveTo(m.x+Math.cos(q)*r,m.y+Math.sin(q)*r);}ctx.closePath();ctx.fill();ctx.stroke();
  if(m.arm<=0){ctx.fillStyle=Math.sin(t*6+m.x)>0?'#ffffff':C90.sh;ctx.beginPath();ctx.arc(m.x,m.y,2.5,0,TAU);ctx.fill();ctx.globalAlpha=.12;ctx.beginPath();ctx.arc(m.x,m.y,64,0,TAU);ctx.stroke();}ctx.globalAlpha=1;}
// --- мини-карта: патрули ромбом, события пульсирующим кругом, безопасные зоны тонким кольцом ---
function mini95(g,P,s){if(!W95.gen||secW95()<0)return;const k=s/2/2600;
  for(const Pt of W95.pat){const m=Pt.mem.find(o=>o.alive);if(!m)continue;const [x,y]=P(m.x,m.y);g.save();g.translate(x,y);g.rotate(Math.PI/4);g.strokeStyle=Pt.aggro?'#ff4f6e':'#ffb0b8';g.lineWidth=1.5;g.strokeRect(-3.5,-3.5,7,7);g.restore();}
  const ev=[];if(W95.ev)ev.push(W95.ev);for(const kk in W95.sites){const q=W95.sites[kk];if(q.st!=='done')ev.push(q);}for(const q of ev){const [x,y]=P(q.x,q.y);if(x<-10||x>s+10||y<-10||y>s+10)continue;g.strokeStyle='#ffffff';g.globalAlpha=.5+.4*Math.sin(G.t*4);g.lineWidth=1.5;g.beginPath();g.arc(x,y,5+2*Math.sin(G.t*4),0,TAU);g.stroke();g.globalAlpha=1;}
  g.lineWidth=1;g.strokeStyle='rgba(255,255,255,.25)';for(const z of [...WORLD.shops,WORLD.hangar,WORLD.arsenal].filter(Boolean)){const [x,y]=P(z.x,z.y);g.beginPath();g.arc(x,y,380*k,0,TAU);g.stroke();}}

