/* ===== 1.2.1 α · Сторожевик «Изморозь»: мёртвый корабль вмёрз поперёк прохода II–III. Путь в сектор III — только насквозь ===== */
// Четыре палубы: Шлюзовая (темнота) → Криопалуба (лёд, холод, капсулы) → Машинное (Наблюдатель охотится) → Реактор и побег от ледяного фронта.
// Каноны: свет — единственная защита и он подводит; стены отбрасывают тень; тишина перед ударом; то, что видно краем глаза;
// ложная безопасность; нарастание; погоня в финале. Особая миссия вне счёта «из 50»: запись MISSIONS[50] после расчёта NM.
const POST_W={x:9540,y:14330},POST_ANG=-.06;           // корпус вмёрз у самой границы секторов, выше узла 10 и вдали от Бездны
const POST_HL=[-300,-104];                              // входной шлюз — на верхнем борту корпуса (координаты корпуса)
const POST_HATCH=(()=>{const c=Math.cos(POST_ANG),s=Math.sin(POST_ANG);return {x:Math.round(POST_W.x+POST_HL[0]*c-POST_HL[1]*s),y:Math.round(POST_W.y+POST_HL[0]*s+POST_HL[1]*c)};})();
const POST_EXIT={x:10520,y:14300};                      // выходной шлюз — уже в секторе III
const POST_I=MISSIONS.length; // 50
MISSIONS.push({name:'Сторожевик «Изморозь»',sector:'ГРАНИЦА СЕКТОРОВ II–III',intro:['shade'],post:true,waves:[],
  mech:['ТЕМНОТА','ЛЁД','ХОЛОД'],
  hint:['Фонарь светит по курсу, стены отбрасывают тень. Чего не видите вы — не видно и вам.','Вне тепла корпус обрастает льдом и замерзает. Лампы и генераторы греют.','Оно двигается, только пока вы на него не смотрите. Свет и импульс отгоняют его.']});
MASTERY[POST_I]={t:'Ни разу не замёрзнуть',ok:()=>!!G.post&&G.post.freezes===0};
// раскладка палуб в относительных координатах (в книжной ориентации поворачивается); декор — там же
// Пять палуб. Левел-дизайн: 1 — узкий коридор со скафандрами (учит свету и тени), 2 — лабиринт рядов криокапсул,
// 3 — та же криопалуба ещё раз: тихо, темно, все капсулы открыты (лиминальный повтор), 4 — кольцо вокруг кожуха реактора
// с тупиковыми нишами генераторов (охота), 5 — длинный тесный коридор → огромный зал реактора → бег назад по коридору.
const POST_ACTS=[
 {key:'lock',name:'ШЛЮЗОВАЯ ПАЛУБА',start:[.05,.5],aim:0,walls:[[.12,0,.45,.4],[.12,.6,.45,1],[.56,.42,.61,.58],[.72,0,.76,.3],[.72,.45,.76,1]],crates:[4],
  ice:[],lamps:[[.06,.86,.1,'dead'],[.52,.2,.13,'p0'],[.66,.8,.13,'p1'],[.88,.42,.14,'p2']],panels:[[.58,.1],[.58,.9],[.9,.15]],cells:[],gens:[],core:null,door:[.96,.88],
  wrecks:[[.06,.16,0]],cold:false,watcher:false,beacons:[[.45,.4],[.72,.3],[.12,.6]],
  suits:[[.16,.43],[.21,.43],[.26,.43],[.31,.43],[.36,.43],[.41,.43],[.16,.57],[.21,.57],[.26,.57],[.31,.57],[.36,.57],[.41,.57]],roster:[.66,.05],
  claws:[[.86,.62,.4],[.5,.62,-.5]],pods:[],breach:[]},
 {key:'cryo',name:'КРИОПАЛУБА',start:[.05,.1],aim:0,walls:[[.15,.25,.85,.3],[0,.5,.4,.55],[.5,.5,1,.55],[.15,.75,.85,.8]],
  ice:[[.2,.32,.8,.48],[.15,.57,.85,.73]],lamps:[[.25,.1,.11,'on'],[.75,.65,.1,'on'],[.3,.92,.1,'on']],panels:[],cells:[[.5,.12],[.06,.65],[.94,.92]],gens:[],core:null,door:[.5,.93],
  wrecks:[[.08,.38,1]],cold:true,watcher:'mid',beacons:[[.15,.25],[.85,.3],[.4,.5],[.5,.55]],tally:[[.93,.64,.1]],
  claws:[[.6,.38,1.2],[.72,.86,-.3]],pods:'rows',scarePod:[.33,.45],breach:[[.96,.42,.04]]},
 {key:'loop',name:'КРИОПАЛУБА',start:[.05,.1],aim:0,walls:[[.15,.25,.85,.3],[0,.5,.4,.55],[.5,.5,1,.55],[.15,.75,.85,.8]],
  ice:[],lamps:[[.94,.92,.1,'on']],panels:[],cells:[],gens:[],core:null,door:[.5,.93],trig:[.45,.65],
  wrecks:[],cold:false,watcher:false,beacons:[],claws:[[.6,.38,1.2],[.72,.86,-.3]],pods:'rows',podsOpen:true,breach:[[.96,.42,.04]]},
 {key:'eng',name:'МАШИННОЕ ОТДЕЛЕНИЕ',start:[.5,.9],aim:-Math.PI/2,walls:[[.42,.36,.58,.64],[.16,0,.19,.38],[.16,.62,.19,1],[.72,0,.75,.3],[.75,.27,.9,.3],[.72,.7,.75,1],[.75,.7,.9,.73]],
  ice:[[.24,.2,.38,.8],[.6,.32,.7,.68]],lamps:[[.5,.82,.1,'on']],panels:[],cells:[],gens:[[.07,.5],[.87,.12],[.87,.88]],core:null,door:[.97,.5],
  wrecks:[[.3,.08,2]],cold:true,watcher:'all',beacons:[[.42,.36],[.58,.64],[.19,.38],[.75,.3],[.75,.7]],
  claws:[[.62,.9,.3],[.08,.2,-1.1],[.82,.55,.9]],pods:[],breach:[],rift:true},
 {key:'core',name:'РЕАКТОР',start:[.05,.5],aim:0,walls:[[.08,0,.5,.42],[.08,.58,.5,1],[.62,.12,.66,.28],[.62,.72,.66,.88],[.9,.12,.94,.28],[.9,.72,.94,.88]],
  ice:[[.52,.3,.74,.7]],lamps:[[.2,.5,.08,'on'],[.4,.5,.08,'on'],[.56,.2,.1,'on'],[.56,.8,.1,'on'],[.76,.06,.1,'on'],[.76,.94,.1,'on']],panels:[],cells:[],gens:[],core:[.82,.5],door:[.03,.5],
  wrecks:[[.68,.5,3,1]],cold:true,watcher:'all',beacons:[[.5,.42],[.5,.58],[.66,.28],[.66,.72]],
  claws:[[.3,.3,.4],[.72,.2,-.5]],pods:[],breach:[[.97,.08,.04],[.97,.92,.04]],edoor:[.27,.42,.3,.58],rift:true}];
const POST_LOGS=[
 {title:'СТОРОЖЕВИК «ИЗМОРОЗЬ» · ВАХТА 1',text:'Сменили фильтры. Второй генератор шумит. В капсуле семь опять иней изнутри. Проверил — пустая.'},
 {title:'СТОРОЖЕВИК «ИЗМОРОЗЬ» · ВАХТА 2',text:'На поверке насчитал тринадцать. Пересчитал — двенадцать. Капитан говорит, я устал.'},
 {title:'СТОРОЖЕВИК «ИЗМОРОЗЬ» · ВАХТА 3',text:'В шлюзе висит лишний скафандр. Номер не наш. Утром его не было.'},
 {title:'СТОРОЖЕВИК «ИЗМОРОЗЬ» · ПОСЛЕДНЯЯ',text:'Последняя поверка: двенадцать. Тринадцатый стоял в конце строя и не отвечал. Мы так и не поняли, кого из нас не хватает.'}];
// автоматика корабля: ровный голос, будничные сводки, которые не сходятся
RADIO['Х']={tag:'СТОРОЖЕВИК «ИЗМОРОЗЬ» · АВТОМАТИКА',col:'#bfe8ff',l:[{t:'…СК-07 «Изморозь», плановая сводка. Вахта четыре. Без происшествий.'},{t:'…вахта четыре. Без происшествий. Вахта четыре. Без происшествий.'},{t:'…поверка. Экипаж: двенадцать. Экипаж: тринадцать. Экипаж: двенадцать.'},{t:'…VØID-013 внесён в судовую роль. Займите свою капсулу.'},{t:'…реактор: пуск. Шлюз: открыт. Экипаж: на местах.'},{t:'…стыковка подтверждена. VØID-013, добро пожаловать на борт.'},{t:'…температура в криоотсеке в норме. Все капсулы заняты.'}]};
const POST_DK={easy:{cone:340,dark:.95,cold:.18,wcd:[9,12],wsp:95,tele:1.15,hit:14,esc:52},mid:{cone:300,dark:.97,cold:.24,wcd:[7,9],wsp:110,tele:.95,hit:16,esc:44},hard:{cone:255,dark:.985,cold:.32,wcd:[5,7],wsp:130,tele:.8,hit:18,esc:37}};
function postDK(){return POST_DK[G.diff]||POST_DK.easy;}
function postSave(){const S=G.save;if(!S)return null;if(!S.post||typeof S.post!=='object')S.post={done:0,open3:0,best:0,freezes:-1,logs:[]};return S.post;}
function postDone(){const S=G.save;return !!(S&&S.post&&S.post.done);}
function postGate(){const S=G.save;return !!(S&&S.post&&(S.post.done||S.post.open3));}
function postAvail(){return !!G.save&&progDone(CORE)&&!openAllNowSafe();}
function openAllNowSafe(){try{return openAllNow()&&!G.post;}catch(e){return false;}}
function pRng(seed){let a=seed>>>0;return ()=>{a=a+0x6D2B79F5>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
// --- раскладка: на сенсорном экране палуба ужимается в зону без кнопок (цели не оказываются под пальцем)
function postBox(){let t=false;try{t=!!touchMode;}catch(e){}if(!t)return [0,0,1,1];if(W<H)return [0,.14,1,.72];return SET.hand==='l'?[.27,.1,1,1]:[0,.1,.73,1];}
function postXY(u,v){const B=postBox(),a=W>=H?u:1-v,b=W>=H?v:u;return [(B[0]+a*(B[2]-B[0]))*W,(B[1]+b*(B[3]-B[1]))*H];}
function postUV(x,y){const B=postBox(),a=(x/W-B[0])/(B[2]-B[0]),b=(y/H-B[1])/(B[3]-B[1]);return W>=H?[a,b]:[b,1-a];}
function postRect(r){const a=postXY(r[0],r[1]),b=postXY(r[2],r[3]);return {x0:Math.min(a[0],b[0]),y0:Math.min(a[1],b[1]),x1:Math.max(a[0],b[0]),y1:Math.max(a[1],b[1])};}
function postR(k){return k*Math.min(W,H);}
function postFree(x,y,pad){if(x<pad||y<pad||x>W-pad||y>H-pad)return false;for(const w of G.post.walls)if(x>w.x0-pad&&x<w.x1+pad&&y>w.y0-pad&&y<w.y1+pad)return false;return true;}
function postLoadAct(n,keepHp){const P=G.post,A=POST_ACTS[n],p=G.player;P.act=n;P.at=0;P.cold=0;P.fade=1;P.lights=[];P.flash=0;
  P.walls=A.walls.map(postRect);for(const ci of (A.crates||[]))if(P.walls[ci])P.walls[ci].crates=true;{const B=postBox(),M=60;if(B[0]>0)P.walls.push({x0:-M,y0:-M,x1:B[0]*W,y1:H+M,edge:1});if(B[2]<1)P.walls.push({x0:B[2]*W,y0:-M,x1:W+M,y1:H+M,edge:1});if(B[3]<1)P.walls.push({x0:-M,y0:B[3]*H,x1:W+M,y1:H+M,edge:1});if(B[1]>0)P.walls.push({x0:-M,y0:-M,x1:W+M,y1:B[1]*H,edge:1});}
  P.ice=A.ice.map(r=>{const q=postRect(r);q.cr=Array.from({length:9},()=>[rnd(q.x0,q.x1),rnd(q.y0,q.y1),rnd(0,TAU),rnd(20,60)]);return q;});
  P.lamps=A.lamps.map(([u,v,k,s])=>{const [x,y]=postXY(u,v);return {x,y,r:postR(k)*1.6,on:s==='on',key:s,fail:s==='dead'?1:0,fl:1,flT:rnd(1,6)};});
  P.panels=A.panels.map(([u,v],i)=>{const [x,y]=postXY(u,v);return {x,y,i,on:false,h:0};});
  P.cells=A.cells.map(([u,v])=>{const [x,y]=postXY(u,v);return {x,y,got:false};});
  P.gens=A.gens.map(([u,v],i)=>{const [x,y]=postXY(u,v);return {x,y,i,h:0,on:false};});
  P.core=A.core?(()=>{const [x,y]=postXY(A.core[0],A.core[1]);return {x,y,h:0,on:false};})():null;
  {const [x,y]=postXY(A.door[0],A.door[1]);P.door={x,y,open:false,k:0};}
  P.wrecks=A.wrecks.map(([u,v,li,mir])=>{const [x,y]=postXY(u,v);return {x,y,li,read:false,a:rnd(0,TAU),mirror:!!mir,turn:0};});
  P.beacons=A.beacons.map(([u,v],i)=>{const [x,y]=postXY(u,v);return {x,y,a:rnd(0,TAU),w:(i%2?-1:1)*rnd(1.1,1.6)};});
  P.suits=(A.suits||[]).map(([u,v],i)=>{const [x,y]=postXY(u,v);const f=Math.atan2(postXY(u,.5)[1]-y,postXY(u,.5)[0]-x);return {x,y,i,f,f0:f,gone:false};});
  P.roster=A.roster?postXY(...A.roster):null;P.tally=(A.tally||[]).map(([u,v,a])=>{const [x,y]=postXY(u,v);return {x,y,a};});
  P.trig=A.trig?(()=>{const [x,y]=postXY(...A.trig);return {x,y,hit:false};})():null;P.figs=[];P.strobe=null;P.figT=rnd(7,12);P.strT=rnd(14,22);P.mbT=0;P.mbI=0;P.rift=0;
  P.claws=A.claws.map(([u,v,a])=>{const [x,y]=postXY(u,v);return {x,y,a};});
  {let L=A.pods==='rows'?[]:A.pods.slice();if(A.pods==='rows'){for(let u=.2;u<.81;u+=.075){L.push([u,.205,0]);L.push([u,.845,0]);}for(const u of [.05,.12,.19,.26,.58,.65,.72,.79,.86,.93])L.push([u,.455,0]);}if(A.scarePod)L.push([A.scarePod[0],A.scarePod[1],1]);
    P.pods=L.map(([u,v,sc],i)=>{const [x,y]=postXY(u,v);return {x,y,i,scare:!!sc,broken:!!A.podsOpen,a:W>=H?0:Math.PI/2};});}
  P.breach=A.breach.map(([u,v,r])=>{const [x,y]=postXY(u,v);return {x,y,r:postR(r)};});
  P.edoor=null;if(A.edoor){const r=postRect(A.edoor),wa={x0:r.x0,y0:r.y0,x1:r.x0,y1:r.y0},wb={x0:r.x1,y0:r.y1,x1:r.x1,y1:r.y1};P.edoor={r,k:0,shut:false,wa,wb};P.walls.push(wa,wb);}
  // кабели свисают с концов переборок
  {const R=pRng(31+n*7);P.cables=[];for(const w of P.walls){if(w.edge)continue;const vert=w.y1-w.y0>w.x1-w.x0;for(const end of [0,1]){if(R()<.35)continue;
      const x=vert?(R()<.5?w.x0:w.x1):(end?w.x1:w.x0),y=vert?(end?w.y1:w.y0):(R()<.5?w.y0:w.y1);if(x<4||x>W-4||y<4||y>H-4)continue;
      P.cables.push({x,y,len:30+R()*45,ph:R()*TAU,dir:Math.atan2(H/2-y,W/2-x)+(R()-.5)*1.2});}}}
  P.escape=0;P.allIce=false;P.events={};P.fakeT=rnd(7,11);P.knockT=rnd(4,7);P.spawnT=8;
  P.front=null;P.inFront=false;P.sparks=[];P.glim=null;P.pend=null;P.fl=1;P.flTarget=1;P.flT=rnd(2,4);P.flk=0;P.groanT=rnd(3,6);P.whisT=4;P.brT=0;P.clT=0;P.sparkT=rnd(2,5);P.glimT=rnd(12,20);P.klT=0;P.glitch=0;P.trail=[];P.deck=null;P.hbPulse=0;
  P.hatch=null;if(A.key==='lock'){const [x,y]=postXY(.012,.5);P.hatch={x,y,k:0,t:0};}
  const [sx,sy]=postXY(A.start[0],A.start[1]);p.x=sx;p.y=sy;p.px=sx;p.py=sy;p.vx=p.vy=0;p.inv=Math.max(p.inv,1.2);
  P.aim=(A.aim||0)+(W>=H?0:Math.PI/2);
  G.enemies=[];G.eb=[];G.pb=[];G.warns=[];G.pick=[];G.ice=0;G.frozen=0;
  P.cp={act:n,hp:keepHp!==undefined?keepHp:p.hp,en:p.en};
  const O=P.O;O.st='off';O.x=-999;O.y=-999;O.cd=rnd(...postDK().wcd)+(A.key==='cryo'?6:3);O.seen=0;
  P.bn=false;
}
function postSetup(){const p=G.player;G.post={act:0,t:0,freezes:0,O:{st:'off',x:-999,y:-999,cd:9,t:0,seen:0},hb:0,scares:0,scDone:{},deaths:0,logsGot:[],cp:null,duck:0};
  postLoadAct(0,p.hp);G.post.cp.hp=p.hp;postAudio(true);}
// --- столкновения
function postPush(o,r){for(const w of G.post.walls){const cx=clamp(o.x,w.x0,w.x1),cy=clamp(o.y,w.y0,w.y1),dx=o.x-cx,dy=o.y-cy,d=Math.hypot(dx,dy);
  if(d<r){if(d>0.01){o.x=cx+dx/d*r;o.y=cy+dy/d*r;}else{const l=o.x-w.x0,R_=w.x1-o.x,t_=o.y-w.y0,b_=w.y1-o.y,m=Math.min(l,R_,t_,b_);if(m===l)o.x=w.x0-r;else if(m===R_)o.x=w.x1+r;else if(m===t_)o.y=w.y0-r;else o.y=w.y1+r;}}}}
function postInWall(x,y){for(const w of G.post.walls)if(x>w.x0&&x<w.x1&&y>w.y0&&y<w.y1)return true;return false;}
function postInIce(x,y){if(G.post.allIce)return true;for(const r of G.post.ice)if(x>r.x0&&x<r.x1&&y>r.y0&&y<r.y1)return true;return false;}
function postLit(x,y,pad){const P=G.post;pad=pad||0;for(const L of P.lamps)if(L.on&&L.fl>.5&&Math.hypot(x-L.x,y-L.y)<L.r*.7+pad)return true;for(const g of P.gens)if(g.on&&Math.hypot(x-g.x,y-g.y)<postR(.3)+pad)return true;
  if(P.core&&P.core.on&&P.escape<=0&&Math.hypot(x-P.core.x,y-P.core.y)<postR(.25)+pad)return true;return false;}
function postWarm(x,y){const P=G.post;for(const L of P.lamps)if(L.on&&Math.hypot(x-L.x,y-L.y)<L.r*.55)return true;for(const g of P.gens)if(g.on&&Math.hypot(x-g.x,y-g.y)<postR(.22))return true;return false;}
// отрезок пересекает переборку — для тени фонаря и «видит ли игрок Наблюдателя»
function postSegBlocked(x0,y0,x1,y1){for(const w of G.post.walls){if(w.x1-w.x0<1||w.y1-w.y0<1)continue;let t0=0,t1=1;const dx=x1-x0,dy=y1-y0;let ok=true;
  for(const [p,q] of [[-dx,x0-w.x0],[dx,w.x1-x0],[-dy,y0-w.y0],[dy,w.y1-y0]]){if(p===0){if(q<0){ok=false;break;}}else{const r=q/p;if(p<0){if(r>t1){ok=false;break;}if(r>t0)t0=r;}else{if(r<t0){ok=false;break;}if(r<t1)t1=r;}}}
  if(ok&&t0<=t1)return true;}return false;}
function postConeR(){const D=postDK(),P=G.post;return D.cone*(G.frozen>0?.5:1)*(1-.25*(G.ice||0)/3)*(.35+.65*P.fl);}
function postSees(x,y){const P=G.post,p=G.player;if(P.fl<.5||P.blackout>0)return false;const d=Math.hypot(x-p.x,y-p.y);if(d<60)return true;if(d>postConeR()*.95)return false;
  let da=Math.atan2(y-p.y,x-p.x)-(P.aim??0);da=Math.atan2(Math.sin(da),Math.cos(da));if(Math.abs(da)>.5)return false;return !postSegBlocked(p.x,p.y,x,y);}
// --- ход миссии
function postTick(dt){const P=G.post,p=G.player,A=POST_ACTS[P.act],D=postDK(),O=P.O;if(!P||!p)return;P.t+=dt;P.at+=dt;
  if(!P.bn){P.bn=true;if(!P.cpSet){P.cpSet=1;P.cp.hp=p.hp;}} // без больших плашек: название палубы — только в строке сверху
  {const r={lock:[2.6,5],cryo:[4,6],loop:[3.5,6],eng:[6,1]}[A.key];if(r&&P.at>r[0]&&!P.events.r){P.events.r=1;radioSay('Х',r[1]);}}
  P.fade=Math.max(0,P.fade-dt*.9);P.flash=Math.max(0,P.flash-dt*2);P.glitch=Math.max(0,P.glitch-dt);P.hbPulse=Math.max(0,P.hbPulse-dt*2.2);
  const sp=Math.hypot(p.vx,p.vy);if(sp>20)P.aim=Math.atan2(p.vy,p.vx);
  P.trail.push([p.x,p.y]);if(P.trail.length>150)P.trail.shift();
  // внешний люк за спиной закрывается — назад дороги нет
  if(P.hatch&&P.hatch.k<1){P.hatch.t+=dt;if(P.hatch.t>1.1){const k0=P.hatch.k;P.hatch.k=Math.min(1,P.hatch.k+dt*1.6);if(k0<1&&P.hatch.k>=1){postSnd('slam',0,1.3);shake(10);}}}
  // фонарь: долгие ровные периоды и короткие серии сбоев; рядом с Наблюдателем, в побеге и при заморозке — чаще
  const dO=O.st!=='off'&&O.st!=='flee'?Math.hypot(O.x-p.x,O.y-p.y):999,nerv=(dO<380?1-dO/380:0)+(P.escape>0?.35:0)+(G.frozen>0?.3:0);
  P.flT-=dt;if(P.flT<=0){if(P.flk>0){P.flk--;P.flTarget=P.flTarget<.6?1:rnd(.04,.35);P.flT=rnd(.04,.13);}else{P.flTarget=1;P.flT=rnd(2.5,6)*(1-Math.min(.8,nerv*.7));P.flk=Math.random()<.35+nerv*.6?2+(Math.random()*5|0):0;}}
  if(lessFx25())P.flTarget=Math.max(P.flTarget,.55);P.fl+=(P.flTarget-P.fl)*Math.min(1,dt*30);
  for(const L of P.lamps){if(!L.on){L.fl=0;continue;}L.flT-=dt;if(L.flT<=0){L.flT=Math.random()<.15?rnd(.05,.12):rnd(1.5,7);L.ft=L.flT<.2?rnd(.1,.5):1;}L.fl+=((L.ft??1)-L.fl)*Math.min(1,dt*25);}
  for(const b of P.beacons)b.a+=b.w*dt*(P.escape>0?2.2:1);
  // переборки
  if(p.hp>0)postPush(p,p.r);for(const e of G.enemies)if(e.alive&&!STATIC.has(e.type))postPush(e,e.r);
  for(const b of G.pb)if(b.life>0&&postInWall(b.x,b.y)){b.life=0;if(SET.fx)part(b.x,b.y,rnd(-40,40),rnd(-40,40),.15,'#9fd8ff',1.5);}
  for(const b of G.eb)if(b.life>0&&postInWall(b.x,b.y))b.life=0;
  // лёд под днищем
  {const on=p.hp>0&&(postInIce(p.x,p.y)||P.inFront);G.slick=on;G.slickK=on?(P.inFront?1.2:1.6):undefined;}
  // холод
  const warm=postWarm(p.x,p.y);
  if(A.cold&&p.hp>0){if(warm&&!P.inFront){P.cold=Math.max(0,P.cold-dt*.8);if(G.ice>0&&!(G.frozen>0)){P.thaw=(P.thaw||0)+dt;if(P.thaw>.8){P.thaw=0;G.ice=Math.max(0,G.ice-1);}}}
    else{P.cold+=dt*D.cold*(P.inFront?5:P.escape>0&&P.escT<=0?3:1);if(P.cold>=1){P.cold=0;const f0=G.frozen>0;addIce(1);if(!f0&&G.frozen>0){P.freezes++;postSnd('crack');}}}}
  // объекты палубы
  for(const pn of P.panels){if(pn.on)continue;if(p.hp>0&&Math.hypot(p.x-pn.x,p.y-pn.y)<48){pn.h+=dt;if(pn.h>=1.2){pn.on=true;sfx('cell');floater(pn.x,pn.y-30,'ЩИТОК ВКЛЮЧЁН','#8fe9ff');const L=P.lamps.find(l=>l.key==='p'+pn.i);if(L){L.on=true;L.fl=0;L.ft=1;L.flT=.6;}postOnPanel(pn.i);}}else pn.h=Math.max(0,pn.h-dt);}
  for(const c of P.cells){if(c.got)continue;if(p.hp>0&&Math.hypot(p.x-c.x,p.y-c.y)<32){c.got=true;sfx('cell');floater(c.x,c.y-26,'ТЕРМОЭЛЕМЕНТ','#ffd9a0');if(P.cells.every(q=>q.got)){floater(P.door.x,P.door.y-44,'ШЛЮЗ ОТКРЫТ','#7affc9');sfx('level');}else if(P.cells.filter(q=>q.got).length===1)radioSay('Х',1);}}
  for(const g of P.gens){if(g.on)continue;const inR=p.hp>0&&Math.hypot(p.x-g.x,p.y-g.y)<70;g.h=inR?g.h+dt:Math.max(0,g.h-dt*.5);
    if(inR&&!g.sp){g.sp=1;for(let k=0;k<2;k++)postSpawn('shade');}
    if(inR&&O.st==='lurk')O.cd-=dt*.6; // шум генератора приманивает его
    if(g.h>=6){g.on=true;sfx('level');shake(6);floater(g.x,g.y-40,'ГЕНЕРАТОР ЗАПУЩЕН','#ffd9a0');G.shock.push({x:g.x,y:g.y,r:10,R:postR(.3),t:0,col:'#ffd9a0',slow:true});
      const n=P.gens.filter(q=>q.on).length;if(n===3){floater(P.door.x,P.door.y-44,'ШЛЮЗ ОТКРЫТ','#7affc9');postQueue(2,1.3);}else if(n===2){radioSay('Х',2);const a=rnd(0,TAU);postFig('crew',g.x+Math.cos(a)*110,g.y+Math.sin(a)*110,.9);}}}
  if(P.core&&!P.core.on){const inR=p.hp>0&&Math.hypot(p.x-P.core.x,p.y-P.core.y)<75;P.core.h=inR?P.core.h+dt:Math.max(0,P.core.h-dt*.5);
    if(P.core.h>=4){P.core.on=true;P.escape=D.esc;P.escT=D.esc;P.allIce=false;P.failT=2.5;P.front=1.04;banner('РАЗГЕРМЕТИЗАЦИЯ','РЕАКТОР ЗАПУЩЕН · К ШЛЮЗУ');sfx('bigboom');shake(16);radioSay('Х',4);O.cd=Math.min(O.cd,3);
      postSnd('stinger',0,.8);}}
  if(P.escape>0){P.escT-=dt;P.failT-=dt;if(P.failT<=0){P.failT=P.escape/(P.lamps.length+1);const on=P.lamps.filter(L=>L.on).sort((a,b)=>W>=H?b.x-a.x:b.y-a.y);if(on.length){on[0].on=false;on[0].fail=1;postSnd('crack');shake(3);}}
    if(P.escT<=0&&!P.events.late){P.events.late=1;banner('КОРАБЛЬ ЗАМЕРЗАЕТ','ХОЛОД СИЛЬНЕЕ');}
    // ледяной фронт идёт от реактора к шлюзу; внутри него — лёд и мороз в пять раз сильнее
    P.front=Math.max(-.2,P.front-dt/(D.esc*1.25));const [u]=postUV(p.x,p.y);const was=P.inFront;P.inFront=p.hp>0&&u>P.front;if(P.inFront&&!was){postSnd('crack',0,1.4);shake(5);}
    P.klT-=dt;if(P.klT<=0){P.klT=1.15;postSnd('klaxon');}
    // аварийная переборка сходится; пока корабль не прошёл — оставляет узкую щель
    const E=P.edoor;if(E&&!E.shut){const vert=E.r.y1-E.r.y0>=E.r.x1-E.r.x0,len=vert?E.r.y1-E.r.y0:E.r.x1-E.r.x0,[pu]=postUV(p.x,p.y),passed=pu<A.edoor[0]-.03;
      const kMax=passed?1:Math.max(0,1-(p.r*2+44)/len);E.k=Math.min(kMax,E.k+(passed?dt*2.5:dt/(D.esc*.55)));/* прошли — переборка захлопывается за спиной */const h=len*E.k/2;
      if(vert){Object.assign(E.wa,{x0:E.r.x0,x1:E.r.x1,y0:E.r.y0,y1:E.r.y0+h});Object.assign(E.wb,{x0:E.r.x0,x1:E.r.x1,y0:E.r.y1-h,y1:E.r.y1});}
      else{Object.assign(E.wa,{y0:E.r.y0,y1:E.r.y1,x0:E.r.x0,x1:E.r.x0+h});Object.assign(E.wb,{y0:E.r.y0,y1:E.r.y1,x0:E.r.x1-h,x1:E.r.x1});}
      if(E.k>=1){E.shut=true;postSnd('slam',0,1.2);shake(9);}}}
  // выход
  if(P.trig&&!P.trig.hit&&p.hp>0&&Math.hypot(p.x-P.trig.x,p.y-P.trig.y)<120){P.trig.hit=true;postRollCall();}
  const ready=(!P.trig||P.trig.hit)&&(P.panels.length?P.panels.every(q=>q.on):true)&&(P.cells.length?P.cells.every(q=>q.got):true)&&(P.gens.length?P.gens.every(q=>q.on):true)&&(P.core?P.core.on:true);
  P.door.open=ready;P.door.k=Math.min(1,Math.max(0,P.door.k+(ready?dt*1.5:-dt*3)));if(ready&&p.hp>0&&Math.hypot(p.x-P.door.x,p.y-P.door.y)<60){if(P.act<POST_ACTS.length-1){P.fadeTo=1;postLoadAct(P.act+1,p.hp);sfx('flash');postSnd('slam',0,.8);}else postWin();return;}
  // записи на замёрзших кораблях
  for(const w of P.wrecks){if(w.read||p.hp<=0)continue;if(Math.hypot(p.x-w.x,p.y-w.y)<56){w.read=true;const L=POST_LOGS[w.li];if(!P.logsGot.includes(w.li))P.logsGot.push(w.li);toast(L.title,L.text);sfx('pick');}}
  // то, что двигается, только пока вы не смотрите: замёрзшие VØID и скафандры поворачиваются к вам
  for(const w of P.wrecks)if((w.mirror&&P.scDone.sc3)||(!w.mirror&&!postSees(w.x,w.y))){const ta=Math.atan2(p.y-w.y,p.x-w.x);let da=ta-w.a;da=Math.atan2(Math.sin(da),Math.cos(da));w.a+=da*Math.min(1,dt*(w.mirror?2.5:6));}
  for(const q of P.suits){if(q.gone)continue;const seen=postSees(q.x,q.y);if(!seen){q.f=Math.atan2(p.y-q.y,p.x-q.x);if(q.i===9&&postUV(p.x,p.y)[0]>.55&&!P.events.suitGone){P.events.suitGone=1;q.gone=true;}}}
  // тени из тьмы
  if(A.key!=='loop'&&(A.key!=='lock'||P.panels.some(q=>q.on))){P.spawnT-=dt;const cap=A.key==='lock'?2:A.key==='core'?4:3;if(P.spawnT<=0){P.spawnT=rnd(9,13);if(G.enemies.filter(e=>e.alive).length<cap)postSpawn(Math.random()<.25&&(A.key==='eng'||A.key==='core')?'phantom':'shade');}}
  // ложные сигналы и стук
  P.fakeT-=dt;if(P.fakeT<=0){P.fakeT=rnd(14,22);P.fake={a:rnd(0,TAU),t:.9};sfx('warn');}if(P.fake){P.fake.t-=dt;if(P.fake.t<=0)P.fake=null;}
  P.knockT-=dt;if(P.knockT<=0){P.knockT=rnd(9,16);postSnd('knock',rnd(-1,1));}
  postDirector(dt,dO);postWatcher(dt);postAudioTick(dt);
}
// --- режиссёр страха: сценарии с тишиной перед ударом, искры, то, что видно краем глаза, звуки корпуса
function postQueue(n,t){const P=G.post;if(P.scDone['sc'+n]||P.pend)return;P.pend={n,t};}
function postDirector(dt,dO){const P=G.post,p=G.player,O=P.O,A=POST_ACTS[P.act],K=A.key,lf=lessFx25();
  if(P.pend){P.duck=Math.min(1,P.duck+dt*3);P.pend.t-=dt;if(P.pend.t<=0){const n=P.pend.n;P.pend=null;postScare(n);}}else P.duck=Math.max(0,P.duck-dt*.7);
  if(K==='loop'&&!(P.trig&&P.trig.hit&&P.at-P.trig.at>1.5))P.duck=1; // повтор палубы — полная тишина, слышно только свой двигатель
  if(K==='lock'&&P.panels.filter(q=>q.on).length>=2&&!P.events.k0){P.events.k0=1;postQueue(0,1.5);}
  if(K==='cryo'){const pd=P.pods.find(q=>q.scare&&!q.broken);if(pd&&Math.hypot(p.x-pd.x,p.y-pd.y)<150&&!P.events.pod){P.events.pod=1;postQueue(1,1.1);}}
  if(K==='core'){const w=P.wrecks.find(q=>q.mirror);if(w&&Math.hypot(p.x-w.x,p.y-w.y)<190&&!P.events.mir){P.events.mir=1;postQueue(3,.9);}
    if(!P.events.hall&&postUV(p.x,p.y)[0]>.52&&P.core&&!P.core.on){P.events.hall=1;postFig('pilot',P.core.x,P.core.y,.7);}}
  // музыкальная шкатулка: где-то среди капсул; на криопалубе — у капсулы-ловушки, на повторе — в темноте посередине
  {let src=null;if(K==='cryo'){const pd=P.pods.find(q=>q.scare&&!q.broken);if(pd)src=pd;}else if(K==='loop'&&P.trig&&!P.trig.hit)src=P.trig;
    if(src){const d=Math.hypot(p.x-src.x,p.y-src.y);if(d<700&&d>110){P.mbT-=dt;if(P.mbT<=0){const MB=[659,784,740,659,587,659,494,523,494,440];const f=MB[P.mbI%MB.length]*(K==='loop'?.94:1);P.mbI++;P.mbT=K==='loop'?.75:.52;postSnd('note',clamp((src.x-p.x)/350,-1,1),.55*(1-d/700),f);}}}}
  // искры с оборванных кабелей; во вспышке иногда стоит он
  P.sparkT-=dt;if(P.sparkT<=0&&P.cables.length&&K!=='loop'){P.sparkT=rnd(3,8);const c=P.cables[(Math.random()*P.cables.length)|0],ex=c.x+Math.cos(c.dir)*c.len,ey=c.y+Math.sin(c.dir)*c.len;
    P.sparks.push({x:ex,y:ey,t:.2});postSnd('spark',clamp((ex-p.x)/400,-1,1),.8);if(SET.fx)for(let k=0;k<8;k++)part(ex,ey,vrnd2(-140,140),vrnd2(-60,160),.4,'#dff6ff',1.6);
    if(K!=='lock'&&O.st==='off'&&!lf&&Math.random()<.4){const a=rnd(0,TAU),gx=ex+Math.cos(a)*70,gy=ey+Math.sin(a)*70;if(postFree(gx,gy,10))P.glim={x:gx,y:gy,t:.3,t0:.3};}}
  for(const s of P.sparks)s.t-=dt;P.sparks=P.sparks.filter(s=>s.t>0);
  // силуэт Наблюдателя на краю луча
  if(K!=='lock'&&K!=='loop'&&O.st==='off'&&!P.glim){P.glimT-=dt;if(P.glimT<=0){P.glimT=rnd(14,26);const a=(P.aim??0)+(Math.random()<.5?-1:1)*.62,R=postConeR()*.78,gx=p.x+Math.cos(a)*R,gy=p.y+Math.sin(a)*R;
    if(postFree(gx,gy,10)&&!postSegBlocked(p.x,p.y,gx,gy)){P.glim={x:gx,y:gy,t:.28,t0:.28};postSnd('whisper',clamp((gx-p.x)/300,-1,1),.5);}}}
  if(P.glim){P.glim.t-=dt;if(P.glim.t<=0)P.glim=null;}
  // неизвестные: на долю секунды, со сбоем картинки — экипаж в скафандрах, бледная копия вашего корабля, кто-то прямо за спиной
  if(K!=='loop'&&(K!=='lock'||P.panels.some(q=>q.on))){P.figT-=dt;if(P.figT<=0){P.figT=K==='lock'?rnd(16,24):rnd(9,16);const r=Math.random();
    if(r<.15){const a=(P.aim??0)+Math.PI+rnd(-.5,.5),x=p.x+Math.cos(a)*70,y=p.y+Math.sin(a)*70;if(postFree(x,y,8))postFig('crew',x,y,.45);}
    else{for(let k=0;k<10;k++){const a=(P.aim??0)+rnd(-.5,.5),d=rnd(150,320),x=p.x+Math.cos(a)*d,y=p.y+Math.sin(a)*d;if(postFree(x,y,14)&&!postSegBlocked(p.x,p.y,x,y)){postFig(r<.32&&K!=='lock'?'pilot':'crew',x,y,rnd(.5,1.1));break;}}}}}
  for(const f of P.figs)f.t-=dt;P.figs=P.figs.filter(f=>f.t>0);
  // резкие мерцания: свет гаснет и вспыхивает сериями; в одной из вспышек кто-то стоит в луче
  if(!lf&&(K==='cryo'||K==='eng'||K==='core')){P.strT-=dt;if(P.strT<=0&&!P.strobe){P.strT=rnd(16,30);postStrobe(Math.random()<.6);}}
  if(P.strobe){const S=P.strobe;S.t-=dt;if(S.t<=0){S.i++;if(S.i>=S.seq.length)P.strobe=null;else{S.t=S.seq[S.i];S.dark=!S.dark;if(!S.dark&&S.i===S.show&&S.fig)P.figs.push({...S.fig,t:S.seq[S.i]+.02,t0:S.seq[S.i]+.02,strobe:true});}}}
  // помехи края карты на двух последних палубах — слабые, усиливаются на сбоях и в побеге
  P.rift=A.rift?(.17+.3*P.glitch+(P.escape>0?.06:0))*(lf?.5:1):(P.glitch>.2?.14*(lf?.5:1):0);
  // корпус стонет
  P.groanT-=dt;if(P.groanT<=0&&K!=='loop'){P.groanT=rnd(7,14);postSnd('groan',rnd(-1,1),.9);}
  if(O.st==='lurk'||O.st==='tele'){P.whisT-=dt;if(P.whisT<=0&&dO<520){P.whisT=rnd(3,6);postSnd('whisper',clamp((O.x-p.x)/300,-1,1),.5+.5*(1-dO/520));}
    if(dO<280&&!postSees(O.x,O.y)){P.brT-=dt;if(P.brT<=0){P.brT=2.6;postSnd('breath',clamp((O.x-p.x)/250,-1,1),1-dO/280);}}
    if(O.st==='lurk'&&!O.frz){P.clT-=dt;if(P.clT<=0){P.clT=rnd(.8,1.3);postSnd('clank',clamp((O.x-p.x)/350,-1,1),.25+.55*Math.max(0,1-dO/520));}}}}
function postFig(kind,x,y,dur){const P=G.post,p=G.player;P.figs.push({kind,x,y,t:dur,t0:dur,seed:Math.random()*1000|0});P.glitch=Math.max(P.glitch,.28);postSnd('static',clamp((x-p.x)/350,-1,1),.9);}
function postStrobe(withFig){const P=G.post,p=G.player;if(lessFx25())return;const seq=[.07,.05,.08,.04,.11,.05,.06,.09];let fig=null;
  if(withFig){for(let k=0;k<8;k++){const a=(P.aim??0)+rnd(-.35,.35),d=rnd(110,200),x=p.x+Math.cos(a)*d,y=p.y+Math.sin(a)*d;if(postFree(x,y,14)&&!postSegBlocked(p.x,p.y,x,y)){fig={kind:'crew',x,y,seed:Math.random()*1000|0};break;}}}
  P.strobe={seq,i:0,t:seq[0],dark:true,show:5,fig};postSnd('spark',0,1.2);P.glitch=Math.max(P.glitch,.2);}
// поверка: на повторе палубы в темноте стоят тринадцать — строем, лицом к вам. Одна вспышка, и их нет
function postRollCall(){const P=G.post,p=G.player,T_=P.trig;T_.at=P.at;P.figs.push({kind:'row',x:T_.x,y:T_.y,t:1.15,t0:1.15,seed:7});P.glitch=.5;postSnd('static',0,1.4);
  if(!lessFx25())P.strobe={seq:[.05,.12,.05,.3,.06,.2],i:0,t:.05,dark:true,show:-1,fig:null};
  setTimeout(()=>{try{if(G.post){postSnd('clank',0,1.2);radioSay('Х',2);const L=G.post.lamps[0];if(L){L.on=true;L.fl=0;L.ft=1;}}}catch(e){}},1300);}
function postOnPanel(i){const P=G.post;if(i===0){radioSay('Х',0);postSpawn('shade');}if(i===1){postSpawn('shade');}if(P.panels.every(q=>q.on)){floater(P.door.x,P.door.y-44,'ШЛЮЗ ОТКРЫТ','#7affc9');sfx('level');}}
function postSpawn(type){const P=G.post,p=G.player;let x,y,k=0;do{x=rnd(40,W-40);y=rnd(40,H-40);}while((Math.hypot(x-p.x,y-p.y)<300||postInWall(x,y)||postLit(x,y,40))&&++k<24);if(k>=24)return;
  const e=spawnEnemy(type,x,y,{noAffix:true});e.spawnT=.4;}
// скримеры: 0 — стук изнутри стены, 1 — капсула, 2 — свет гаснет и он прямо перед вами, 3 — замёрзший VØID-013 поворачивается. Не больше четырёх.
function postScare(n){const P=G.post,p=G.player;if(P.scares>=4||P.events['sc'+n]||P.scDone['sc'+n])return;P.events['sc'+n]=1;P.scDone['sc'+n]=1;P.scares++;
  if(n===0){let bw=null,bd=1e9,bx=0,by=0;for(const w of P.walls){if(w.edge)continue;const cx=clamp(p.x,w.x0,w.x1),cy=clamp(p.y,w.y0,w.y1),d=Math.hypot(p.x-cx,p.y-cy);if(d<bd){bd=d;bw=w;bx=cx;by=cy;}}
    postSnd('knock',bw?clamp((bx-p.x)/200,-1,1):0,2.2);setTimeout(()=>{try{if(G.post)postSnd('knock',0,2.6);}catch(e){}},700);shake(7);P.glitch=.25;
    if(bw&&SET.fx)for(let k=0;k<14;k++)part(bx,by,rnd(-90,90),rnd(-90,90),.6,'#9fb6cc',1.6);P.jolt=.5;}
  if(n===1){const pd=P.pods.find(q=>q.scare&&!q.broken)||P.pods[0];if(pd){pd.broken=true;postSnd('stinger',clamp((pd.x-p.x)/300,-1,1),1.1);postSnd('crack',0,1.5);shake(9);P.glitch=.35;
      if(SET.fx)for(let k=0;k<26;k++)part(pd.x,pd.y,rnd(-260,260),rnd(-260,260),.7,'#dff6ff',2.2);
      const e=spawnEnemy('shade',clamp(pd.x,30,W-30),clamp(pd.y,30,H-30),{noAffix:true});e.st='rev';e.timer=.7;e.reveal=1;}
    else{const a=Math.atan2(p.vy||1,p.vx||0)+Math.PI;const e=spawnEnemy('shade',clamp(p.x+Math.cos(a)*140,30,W-30),clamp(p.y+Math.sin(a)*140,30,H-30),{noAffix:true});e.st='rev';e.timer=.7;e.reveal=1;postSnd('stinger',0,1);shake(5);}}
  if(n===2){P.blackout=lessFx25()?0:1.3;const O=P.O;const a=(P.aim??0);O.x=clamp(p.x+Math.cos(a)*110,30,W-30);O.y=clamp(p.y+Math.sin(a)*110,30,H-30);O.st='show';O.t=1.3;postSnd('breath',0,1.4);setTimeout(()=>{try{if(G.post){postSnd('stinger',0,1.2);G.post.glitch=.4;shake(8);}}catch(e){}},1150);}
  if(n===3){const w=P.wrecks.find(q=>q.mirror);if(w){radioSay('Х',3);postSnd('whisper',clamp((w.x-p.x)/300,-1,1),1.3);P.glitch=.3;}}}
function lessFx25(){return document.documentElement.classList.contains('lessfx');}
// --- Наблюдатель: держится на краю света; пока на него смотрят — замирает, потом отступает; бросается, когда корабль замёрз или во тьме
function postWatcher(dt){const P=G.post,O=P.O,p=G.player,D=postDK(),A=POST_ACTS[P.act];
  const allowed=A.watcher==='all'||(A.watcher==='mid'&&G.diff!=='easy');
  if(P.blackout>0)P.blackout-=dt;
  if(O.st==='show'){O.t-=dt;if(O.t<=0){O.st='off';O.cd=rnd(...D.wcd);}return;}
  if(!allowed||p.hp<=0){O.st='off';return;}
  const chase=P.escape>0,spd=D.wsp*(chase?1.35:1),orbit=chase?170:230;
  if(O.st==='off'){O.cd-=dt;if(O.cd<=0){let k=0;do{const a=rnd(0,TAU);O.x=p.x+Math.cos(a)*420;O.y=p.y+Math.sin(a)*420;}while((postInWall(O.x,O.y)||postLit(O.x,O.y)||postSees(O.x,O.y))&&++k<12);O.st='lurk';O.seen=0;O.cd=rnd(...D.wcd)*(chase?.6:1);O.oa=Math.atan2(O.y-p.y,O.x-p.x);}return;}
  const d=Math.hypot(O.x-p.x,O.y-p.y);
  if(O.st==='lurk'){const seen=postSees(O.x,O.y);O.frz=seen;
    if(seen){O.seen+=dt;if(O.seen>.6&&!chase){O.st='flee';O.t=1.4;postSnd('whisper',clamp((O.x-p.x)/300,-1,1),1.2);return;}}
    else{O.seen=Math.max(0,O.seen-dt*.5);O.oa+=dt*.35;const tx=p.x+Math.cos(O.oa)*orbit,ty=p.y+Math.sin(O.oa)*orbit;const a=Math.atan2(ty-O.y,tx-O.x);O.x+=Math.cos(a)*spd*dt;O.y+=Math.sin(a)*spd*dt;}
    if(postLit(O.x,O.y,20)){O.st='flee';O.t=1.5;}
    O.cd-=dt*(G.frozen>0?3:1)*(seen?.3:1);const exposed=!postLit(p.x,p.y,10);if(O.cd<=0&&exposed&&d<520){O.st='tele';O.t=D.tele;O.tx=p.x;O.ty=p.y;postSnd('heart',Math.sign(O.x-p.x),1.2);P.hbPulse=1;}}
  else if(O.st==='tele'){O.t-=dt;O.tx=p.x;O.ty=p.y;if(O.t<=0){O.st='strike';O.t=.7;const a=Math.atan2(O.ty-O.y,O.tx-O.x);O.vx=Math.cos(a)*560;O.vy=Math.sin(a)*560;postSnd('stinger',clamp((O.x-p.x)/300,-1,1),.7);P.glitch=.3;}}
  else if(O.st==='strike'){O.t-=dt;O.x+=O.vx*dt;O.y+=O.vy*dt;if(p.hp>0&&d<30){damagePlayer(D.hit);const f0=G.frozen>0;addIce(2);if(!f0&&G.frozen>0)P.freezes++;postSnd('hit');P.glitch=.45;O.st='flee';O.t=2.5;}
    else if(O.t<=0||postLit(O.x,O.y)){O.st='flee';O.t=1.8;}}
  else if(O.st==='flee'){O.t-=dt;const a=Math.atan2(O.y-p.y,O.x-p.x);O.x+=Math.cos(a)*spd*2.2*dt;O.y+=Math.sin(a)*spd*2.2*dt;if(O.t<=0){O.st='off';O.cd=rnd(...D.wcd)*(chase?.6:1);}}
}
function postOnPulse(){const P=G.post,O=P&&P.O,p=G.player;if(!P)return;P.flash=1;if(O&&O.st!=='off'&&O.st!=='show'&&Math.hypot(O.x-p.x,O.y-p.y)<300){O.st='flee';O.t=3;O.cd=8;floater(p.x,p.y-40,'ОТОГНАН','#bfe8ff');}}
function postRespawn(){const P=G.post,p=G.player,cp=P.cp;P.deaths++;
  const hard=G.diff==='hard';if(hard&&cp.act<POST_ACTS.length-1)return false;
  p.hp=Math.max(cp.hp,G.st.maxHp*.4);p.en=cp.en;G.deadT=0;scr6('play');
  postLoadAct(cp.act,p.hp);P.cp.hp=Math.max(cp.hp,G.st.maxHp*.4);banner('ТОЧКА ВОЗВРАТА','ПАЛУБА '+(cp.act+1));show('');return true;}
// прохождение: без экрана итогов — корабль выходит из кормового шлюза прямо в сектор III
function postWin(){const P=G.post,S=G.save,p=G.player;if(!S)return;const ps=postSave(),first=!ps.done,D=curDiff();
  ps.done=1;const tsec=Math.round(P.t);if(!ps.best||tsec<ps.best)ps.best=tsec;ps.freezes=ps.freezes<0?P.freezes:Math.min(ps.freezes,P.freezes);
  for(const li of P.logsGot)if(!ps.logs.includes(li))ps.logs.push(li);
  let lom=Math.round((first?180:40)*D.lom);let skin=false;
  if(P.freezes===0&&!S.ownSkins.includes('izmo')){S.ownSkins.push('izmo');skin=true;}
  S.lom+=lom;addPilotXP(first?120:30);if(S.story)S.story.post=1;
  try{FOGC.k=null;if(typeof MAPC!=='undefined'){MAPC.fog=null;MAPC.fogVer=null;}}catch(e){}
  G.postMsg=first?1:2;G.postRes={t:tsec,lom,skin,fr:P.freezes,logs:ps.logs.length};postAudio(false);
  S.pos={x:POST_EXIT.x,y:POST_EXIT.y};S.last={...S.pos};saveWorld();
  scr6('done');returnToWorld();}
// --- отрисовка: палуба рисуется один раз на отсек в отдельный холст, сверху — живое
function postBuildDeck(P,k){const c=document.createElement('canvas');c.width=Math.max(1,Math.round(W*k));c.height=Math.max(1,Math.round(H*k));const X=c.getContext('2d');X.scale(k,k);const R=pRng(101+P.act*53);
  // пол: плиты со швами и заклёпками
  X.fillStyle='#05080d';X.fillRect(0,0,W,H);const S=56;
  for(let y=0,row=0;y<H;y+=S,row++)for(let x=(row%2)*S/2-S;x<W;x+=S){X.fillStyle=`rgba(140,170,210,${(.012+R()*.03).toFixed(3)})`;X.fillRect(x+1,y+1,S-2,S-2);
    X.fillStyle='rgba(160,190,230,.14)';for(const [dx,dy] of [[5,5],[S-5,5],[5,S-5],[S-5,S-5]]){X.fillRect(x+dx-1,y+dy-1,2,2);}}
  X.strokeStyle='rgba(0,0,0,.55)';X.lineWidth=1.5;for(let y=0;y<H;y+=S){X.beginPath();X.moveTo(0,y);X.lineTo(W,y);X.stroke();}
  // решётки вдоль длинных переборок
  // лёд: иней на полу
  for(const r of P.ice){X.fillStyle='rgba(170,220,255,.07)';X.fillRect(r.x0,r.y0,r.x1-r.x0,r.y1-r.y0);X.strokeStyle='rgba(210,240,255,.22)';X.lineWidth=1;
    for(const [x,y,a,l] of r.cr){X.beginPath();X.moveTo(x,y);X.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);X.lineTo(x+Math.cos(a+.6)*l*1.4,y+Math.sin(a+.6)*l*1.4);X.moveTo(x+Math.cos(a)*l*.5,y+Math.sin(a)*l*.5);X.lineTo(x+Math.cos(a-.9)*l*.9,y+Math.sin(a-.9)*l*.9);X.stroke();}
    for(let i=0;i<4;i++){const x=r.x0+R()*(r.x1-r.x0),y=r.y0+R()*(r.y1-r.y0),g=X.createRadialGradient(x,y,0,x,y,60);g.addColorStop(0,'rgba(220,245,255,.07)');g.addColorStop(1,'rgba(220,245,255,0)');X.fillStyle=g;X.fillRect(x-60,y-60,120,120);}}
  // пятна — тёмные, замёрзшие; следы волочения
  for(let i=0;i<6;i++){let x,y,t=0;do{x=R()*W;y=R()*H;}while(!postFree(x,y,30)&&++t<20);if(t>=20)continue;
    for(let j=0;j<4;j++){const bx=x+(R()-.5)*40,by=y+(R()-.5)*30,br=10+R()*26,g=X.createRadialGradient(bx,by,0,bx,by,br);g.addColorStop(0,'rgba(64,6,12,.55)');g.addColorStop(1,'rgba(64,6,12,0)');X.fillStyle=g;X.beginPath();X.arc(bx,by,br,0,TAU);X.fill();}
    if(R()<.6){const a=R()*TAU,l=60+R()*110;X.strokeStyle='rgba(64,6,12,.32)';X.lineWidth=9;X.lineCap='round';X.beginPath();X.moveTo(x,y);X.quadraticCurveTo(x+Math.cos(a+.4)*l*.5,y+Math.sin(a+.4)*l*.5,x+Math.cos(a)*l,y+Math.sin(a)*l);X.stroke();X.lineCap='butt';}}
  // следы когтей: три борозды в металле
  for(const c of P.claws){X.save();X.translate(c.x,c.y);X.rotate(c.a);for(let k=-1;k<=1;k++){X.strokeStyle='#120306';X.lineWidth=3.5;X.beginPath();X.moveTo(-70,k*10);X.quadraticCurveTo(0,k*10+8,70,k*13);X.stroke();
      X.strokeStyle='rgba(200,220,245,.16)';X.lineWidth=1;X.beginPath();X.moveTo(-68,k*10-2.5);X.quadraticCurveTo(0,k*10+5.5,68,k*13-2.5);X.stroke();}X.restore();}
  // судовая роль у шлюза: двенадцать строк и тринадцатая, процарапанная от руки
  if(P.roster){const [x,y]=P.roster;X.save();X.translate(x,y);X.fillStyle='#0d141e';X.strokeStyle='rgba(150,185,230,.45)';X.lineWidth=1.2;X.fillRect(-34,-26,68,52);X.strokeRect(-34,-26,68,52);
    X.font='700 7px "Exo 2",sans-serif';X.textAlign='left';X.fillStyle='rgba(190,215,240,.6)';X.fillText('ЭКИПАЖ · СК-07',-29,-17);X.fillStyle='rgba(170,195,225,.4)';for(let i=0;i<12;i++)X.fillRect(-29+(i>5?30:0),-11+(i%6)*5.5,22+(i*7%6),1.6);
    X.strokeStyle='rgba(205,225,245,.75)';X.lineWidth=1;X.beginPath();X.moveTo(-29,24);for(let q=0;q<9;q++)X.lineTo(-29+q*3,24+((q*5)%3)-1.5);X.stroke();X.restore();}
  // счёт дней, процарапанный в металле
  for(const q of P.tally){X.save();X.translate(q.x,q.y);X.rotate(q.a);X.strokeStyle='rgba(200,220,245,.42)';X.lineWidth=1.3;for(let g=0;g<5;g++){for(let i=0;i<(g<4?4:2);i++){X.beginPath();X.moveTo(g*16+i*3,-7);X.lineTo(g*16+i*3+1,7);X.stroke();}if(g<4){X.beginPath();X.moveTo(g*16-2,5);X.lineTo(g*16+12,-5);X.stroke();}}X.restore();}
  // капсулы криосна
  for(const q of P.pods)if(!q.scare)postPod(X,q,0,R);
  // проломы в корпусе: сквозь них — звёзды
  for(const b of P.breach){X.save();X.globalCompositeOperation='destination-out';X.beginPath();for(let i=0;i<14;i++){const a=i/14*TAU,rr=b.r*(.7+R()*.45);X.lineTo(b.x+Math.cos(a)*rr,b.y+Math.sin(a)*rr);}X.closePath();X.fill();X.restore();
    X.strokeStyle='rgba(190,215,240,.5)';X.lineWidth=2;X.beginPath();for(let i=0;i<=14;i++){const a=i/14*TAU,rr=b.r*(1+R()*.25);X.lineTo(b.x+Math.cos(a)*rr,b.y+Math.sin(a)*rr);}X.stroke();
    for(let i=0;i<8;i++){const a=R()*TAU;X.strokeStyle='rgba(150,175,205,.5)';X.lineWidth=2;X.beginPath();X.moveTo(b.x+Math.cos(a)*b.r,b.y+Math.sin(a)*b.r);X.lineTo(b.x+Math.cos(a)*b.r*(1.25+R()*.4),b.y+Math.sin(a+(R()-.5)*.3)*b.r*(1.25+R()*.4));X.stroke();}}
  // переборки: металл, заклёпки, фаска; жёлто-чёрная разметка у проёмов; трубы вдоль длинных стен
  for(const w of P.walls){if(w.x1-w.x0<1||w.y1-w.y0<1||w.crates)continue;const ww=w.x1-w.x0,wh=w.y1-w.y0;
    const g=X.createLinearGradient(w.x0,w.y0,w.x1,w.y1);g.addColorStop(0,'#111a27');g.addColorStop(1,'#080d15');X.fillStyle=g;X.fillRect(w.x0,w.y0,ww,wh);
    X.strokeStyle='rgba(150,185,230,.32)';X.lineWidth=1.5;X.strokeRect(w.x0+.75,w.y0+.75,ww-1.5,wh-1.5);
    if(w.edge){X.strokeStyle='rgba(150,185,230,.08)';X.lineWidth=1;for(let k=0;k<Math.max(ww,wh);k+=9){X.beginPath();if(ww>wh){X.moveTo(w.x0+k,w.y0);X.lineTo(w.x0+k-14,w.y1);}else{X.moveTo(w.x0,w.y0+k);X.lineTo(w.x1,w.y0+k-14);}X.stroke();}continue;}
    X.fillStyle='rgba(170,200,235,.28)';const vert=wh>ww;for(let k=8;k<(vert?wh:ww)-6;k+=14){if(vert){X.fillRect(w.x0+3,w.y0+k,2,2);X.fillRect(w.x1-5,w.y0+k,2,2);}else{X.fillRect(w.x0+k,w.y0+3,2,2);X.fillRect(w.x0+k,w.y1-5,2,2);}}
    const ends=Math.min(ww,wh)>60?[]:vert?[[w.y0,0],[w.y1,1]]:[[w.x0,0],[w.x1,1]];
    for(const [e,s] of ends){const inside=vert?(e>3&&e<H-3):(e>3&&e<W-3);if(!inside)continue;X.save();if(vert)X.beginPath(),X.rect(w.x0,s?e-12:e,ww,12);else X.beginPath(),X.rect(s?e-12:e,w.y0,12,wh);X.clip();
      X.fillStyle='#c9a227';if(vert)X.fillRect(w.x0,s?e-12:e,ww,12);else X.fillRect(s?e-12:e,w.y0,12,wh);X.strokeStyle='#14100a';X.lineWidth=4;for(let k=-30;k<40;k+=9){X.beginPath();if(vert){X.moveTo(w.x0+k,s?e-12:e);X.lineTo(w.x0+k+12,s?e:e+12);}else{X.moveTo(s?e-12:e,w.y0+k);X.lineTo(s?e:e+12,w.y0+k+12);}X.stroke();}X.restore();}
    if(Math.max(ww,wh)>110){const side=R()<.5?-1:1;X.strokeStyle='rgba(120,150,190,.35)';X.lineWidth=4;X.beginPath();if(vert){const x=side<0?w.x0-7:w.x1+7;X.moveTo(x,w.y0+6);X.lineTo(x,w.y1-6);}else{const y=side<0?w.y0-7:w.y1+7;X.moveTo(w.x0+6,y);X.lineTo(w.x1-6,y);}X.stroke();
      X.strokeStyle='rgba(10,14,20,.9)';X.lineWidth=2;for(let k=20;k<(vert?wh:ww)-10;k+=42){X.beginPath();if(vert){const x=side<0?w.x0-7:w.x1+7;X.moveTo(x-4,w.y0+k);X.lineTo(x+4,w.y0+k);}else{const y=side<0?w.y0-7:w.y1+7;X.moveTo(w.x0+k,y-4);X.lineTo(w.x0+k,y+4);}X.stroke();}}
    if(R()<.5){const vx=vert?w.x0+ww*(R()<.5?0:1):w.x0+R()*ww,vy=vert?w.y0+R()*wh:w.y0+wh*(R()<.5?0:1);X.fillStyle='#05080d';X.beginPath();for(let i=0;i<6;i++){const a=i/6*TAU;X.lineTo(vx+Math.cos(a)*(6+R()*8),vy+Math.sin(a)*(6+R()*8));}X.closePath();X.fill();}}
  return c;}
function postPod(X,q,t,R){X.save();X.translate(q.x,q.y);X.rotate(q.a);const w=14,h=28;
  X.fillStyle='#0b121c';X.strokeStyle='rgba(150,185,230,.45)';X.lineWidth=2;X.beginPath();X.ellipse(0,0,w,h,0,0,TAU);X.fill();X.stroke();
  if(!q.broken){X.fillStyle='rgba(140,200,240,.10)';X.beginPath();X.ellipse(0,0,w-5,h-5,0,0,TAU);X.fill();
    X.fillStyle='rgba(2,4,8,.85)';X.beginPath();X.ellipse(0,3,4.5,15,0,0,TAU);X.fill();X.beginPath();X.arc(0,-15,4.5,0,TAU);X.fill();
    X.strokeStyle='rgba(220,240,255,.35)';X.lineWidth=1;for(let i=0;i<4;i++){const y=-h+8+i*12;X.beginPath();X.moveTo(-w+4,y);X.lineTo(-w+9,y+4);X.stroke();}}
  else{X.fillStyle='#020306';X.beginPath();X.ellipse(0,0,w-5,h-5,0,0,TAU);X.fill();X.strokeStyle='rgba(220,240,255,.6)';X.lineWidth=1.2;for(let i=0;i<9;i++){const a=i/9*TAU;X.beginPath();X.moveTo(Math.cos(a)*(w-5),Math.sin(a)*(h-5));X.lineTo(Math.cos(a+.2)*(w-11),Math.sin(a+.2)*(h-13));X.stroke();}}
  X.fillStyle=q.broken?'#ff3b4e':'#3a9fd8';X.fillRect(-3,h-8,6,3);X.restore();}

// --- неизвестные: экипаж в скафандрах (вид сверху), бледная копия VØID-013; рисуются со сбоем картинки
function postCrewShape(X,col,visor){X.fillStyle=col;X.beginPath();X.moveTo(-8,-12);X.lineTo(4,-13);X.quadraticCurveTo(8,0,4,13);X.lineTo(-8,12);X.quadraticCurveTo(-11,0,-8,-12);X.fill();
  X.fillRect(-3,-18,11,5);X.fillRect(-3,13,11,5);X.fillRect(-13,-7,5,14);X.beginPath();X.arc(3,0,7.6,0,TAU);X.fill();if(visor){X.fillStyle=visor;X.beginPath();X.ellipse(6.2,0,3.4,5.4,0,0,TAU);X.fill();}}
// фигура «лицом к вам», в полный рост, вне перспективы: скафандр, чёрное стекло шлема, руки чуть длиннее, чем должны быть
function postCrewFront(X,col,visor,sc){X.save();X.scale(sc,sc);X.fillStyle=col;
  X.beginPath();X.ellipse(0,-30,8.5,9.5,0,0,TAU);X.fill();                       // шлем
  X.beginPath();X.moveTo(-11,-20);X.quadraticCurveTo(0,-23,11,-20);X.lineTo(10,6);X.lineTo(-10,6);X.closePath();X.fill(); // корпус скафандра
  X.lineCap='round';X.strokeStyle=col;X.lineWidth=4.2;X.beginPath();X.moveTo(-11,-18);X.quadraticCurveTo(-15,2,-13,19);X.moveTo(11,-18);X.quadraticCurveTo(15,2,13,19);X.stroke(); // руки
  X.lineWidth=5;X.beginPath();X.moveTo(-5,5);X.lineTo(-6,30);X.moveTo(5,5);X.lineTo(6,30);X.stroke();X.lineCap='butt';           // ноги
  if(visor){X.fillStyle=visor;X.beginPath();X.ellipse(0,-30,6,6.3,0,0,TAU);X.fill();}X.restore();}
function postShipShape(X,col){X.fillStyle=col;X.beginPath();X.moveTo(19,0);X.lineTo(-11,-12);X.lineTo(-5,0);X.lineTo(-11,12);X.closePath();X.fill();}
function postDrawSuits(t){const P=G.post;if(!P||!P.suits.length)return;for(const q of P.suits){ctx.save();ctx.translate(q.x,q.y);
  ctx.strokeStyle='rgba(120,150,190,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,15,0,TAU);ctx.stroke();
  if(!q.gone){ctx.rotate(q.f);ctx.scale(1.15,1.15);postCrewShape(ctx,'#1a2432','#04070b');ctx.strokeStyle='rgba(160,195,235,.35)';ctx.lineWidth=.8;ctx.beginPath();ctx.arc(3,0,7.6,0,TAU);ctx.stroke();}
  else{ctx.strokeStyle='rgba(150,185,230,.5)';ctx.beginPath();ctx.moveTo(-6,0);ctx.lineTo(6,0);ctx.moveTo(0,-6);ctx.lineTo(0,0);ctx.stroke();}ctx.restore();}}
function postDrawCrates(t){const P=G.post;if(!P)return;const j=P.jolt||0;for(const w of P.walls){if(!w.crates)continue;const R=pRng(Math.round(w.x0*7+w.y0*13));
  for(let y=w.y0;y<w.y1-4;y+=22)for(let x=w.x0;x<w.x1-4;x+=22){const sx=x+(R()-.5)*4+(j>0?(Math.random()-.5)*6*j:0),sy=y+(R()-.5)*4,sz=Math.min(20,w.x1-x-1,w.y1-y-1);ctx.save();ctx.translate(sx+sz/2,sy+sz/2);ctx.rotate((R()-.5)*.25);
    ctx.fillStyle='#16110b';ctx.strokeStyle='rgba(201,162,39,.45)';ctx.lineWidth=1.2;ctx.fillRect(-sz/2,-sz/2,sz,sz);ctx.strokeRect(-sz/2,-sz/2,sz,sz);ctx.beginPath();ctx.moveTo(-sz/2,-sz/2);ctx.lineTo(sz/2,sz/2);ctx.stroke();ctx.restore();}}
  if(j>0)P.jolt=Math.max(0,j-VDT74);/* ARCH·75 A-22 */}
function postDrawFig(f,t){const P=G.post,p=G.player;if(!f.strobe&&Math.random()<.22)return;const face=Math.atan2(p.y-f.y,p.x-f.x),al=f.strobe?.95:.62+.3*Math.random(),jit=(Math.random()-.5)*5;
  const draw=(dx,col,visor)=>{if(f.kind==='row'){const n=13,sp=Math.min(40,(W*.85)/n);for(let i=0;i<n;i++){const o=(i-(n-1)/2)*sp;ctx.save();ctx.translate(clamp(f.x+o+dx,10,W-10),f.y+(i===12?6:0));postCrewFront(ctx,col,visor,i===12?.95:.8);ctx.restore();}}
    else{ctx.save();ctx.translate(f.x+dx+jit,f.y);if(f.kind==='pilot'){ctx.rotate(face);ctx.scale(1.2,1.2);postShipShape(ctx,col);}else postCrewFront(ctx,col,visor,1.15);ctx.restore();}};
  ctx.save();ctx.globalAlpha=al*.5;ctx.globalCompositeOperation='lighter';draw(-4,'#ff2d55',null);draw(4,'#2de0ff',null);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=al;draw(0,f.kind==='pilot'?'#dfe9f2':'#c9d4df',f.kind==='pilot'?null:'#020306');ctx.restore();
  // разрыв картинки по горизонтали в районе фигуры
  if(!lessFx25()&&SET.fx){const T_=ctx.getTransform(),sx=T_.a*f.x+T_.e,sy=T_.d*f.y+T_.f,hh=(f.kind==='row'?60:34)*T_.d;ctx.save();ctx.setTransform(1,0,0,1,0,0);for(let i=0;i<3;i++){const y=sy-hh+Math.random()*hh*2,h=2+Math.random()*8*T_.d,dx=(Math.random()-.5)*24*T_.a;try{ctx.drawImage(cv,0,y,cv.width,h,dx,y,cv.width,h);}catch(e){}}ctx.restore();}}
let pC=null,pX=null,lC=null,lX=null,pN=null;
function postDrawUnder(t){const P=G.post;if(!P)return;const p=G.player;
  const k=Math.min(1.25,Math.max(.5,ctx.getTransform().a));if(!P.deck||P.deckAct!==P.act||Math.abs(P.deckK-k)>.05){P.deck=postBuildDeck(P,k);P.deckAct=P.act;P.deckK=k;}
  ctx.drawImage(P.deck,0,0,W,H);
  if(P.allIce||P.inFront){}
  // капсула-ловушка и внешний люк
  for(const q of P.pods)if(q.scare)postPod(ctx,q,t);
  if(P.hatch){const h=P.hatch,o=1-h.k;if(o>0){const a=W>=H?0:Math.PI/2,gr=ctx.createRadialGradient(h.x,h.y,6,h.x,h.y,340);gr.addColorStop(0,`rgba(220,240,255,${(.35*o).toFixed(3)})`);gr.addColorStop(1,'rgba(220,240,255,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(h.x,h.y);ctx.arc(h.x,h.y,340,a-.5*o,a+.5*o);ctx.closePath();ctx.fill();}
    ctx.fillStyle='#0a0f17';ctx.strokeStyle='#c9a227';ctx.lineWidth=3;const L=120;
    if(W>=H){ctx.fillRect(h.x-6,h.y-L/2,12,L*(1-o)/2);ctx.fillRect(h.x-6,h.y+L/2-L*(1-o)/2,12,L*(1-o)/2);ctx.strokeRect(h.x-6,h.y-L/2,12,L);}
    else{ctx.fillRect(h.x-L/2,h.y-6,L*(1-o)/2,12);ctx.fillRect(h.x+L/2-L*(1-o)/2,h.y-6,L*(1-o)/2,12);ctx.strokeRect(h.x-L/2,h.y-6,L,12);}}
  // кабели качаются
  ctx.strokeStyle='#1a2230';ctx.lineWidth=2.2;for(const c of P.cables){const sw=Math.sin(t*1.3+c.ph)*.18,ex=c.x+Math.cos(c.dir+sw)*c.len,ey=c.y+Math.sin(c.dir+sw)*c.len;ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.quadraticCurveTo((c.x+ex)/2+Math.cos(c.dir+1.57)*8*Math.sin(t+c.ph),(c.y+ey)/2+8,ex,ey);ctx.stroke();ctx.fillStyle='#6a7c94';ctx.fillRect(ex-1.5,ey-1.5,3,3);}
  // аварийные маячки
  for(const b of P.beacons){ctx.fillStyle='#2a0a0e';ctx.beginPath();ctx.arc(b.x,b.y,6,0,TAU);ctx.fill();ctx.fillStyle=Math.sin(b.a*2)>0?'#ff3b4e':'#8a1a24';ctx.beginPath();ctx.arc(b.x,b.y,3.5,0,TAU);ctx.fill();}
  // лампы-плафоны
  for(const L of P.lamps){ctx.fillStyle='#141c28';ctx.fillRect(L.x-9,L.y-4,18,8);ctx.fillStyle=L.on?`rgba(255,217,160,${(.25+.75*L.fl).toFixed(2)})`:L.fail?'#3a1a1a':'#202836';ctx.fillRect(L.x-7,L.y-2,14,4);}
  for(const pn of P.panels){ctx.fillStyle='#0b1220';ctx.strokeStyle=pn.on?'#7affc9':'#ff6b84';ctx.lineWidth=2;ctx.fillRect(pn.x-12,pn.y-16,24,32);ctx.strokeRect(pn.x-12,pn.y-16,24,32);
    if(!pn.on){glow(pn.x,pn.y,18,'#ff6b84',.25+.25*Math.sin(t*4));if(pn.h>0){ctx.strokeStyle='#8fe9ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(pn.x,pn.y,26,-Math.PI/2,-Math.PI/2+TAU*pn.h/1.2);ctx.stroke();}}else glow(pn.x,pn.y,20,'#7affc9',.4);}
  for(const c of P.cells){if(c.got)continue;glow(c.x,c.y,26,'#ffd9a0',.55+.25*Math.sin(t*5));ctx.save();ctx.translate(c.x,c.y);ctx.rotate(t);ctx.strokeStyle='#ffd9a0';ctx.lineWidth=2;ctx.beginPath();for(let q=0;q<6;q++){const a=q/6*TAU;ctx.lineTo(Math.cos(a)*9,Math.sin(a)*9);}ctx.closePath();ctx.stroke();ctx.restore();}
  for(const g of P.gens){ctx.strokeStyle=g.on?'#ffd9a0':'#4a5a70';ctx.lineWidth=3;ctx.fillStyle='#0b1220';ctx.beginPath();ctx.arc(g.x,g.y,22,0,TAU);ctx.fill();ctx.stroke();
    ctx.setLineDash([5,7]);ctx.lineWidth=1.5;ctx.globalAlpha=.6;ctx.beginPath();ctx.arc(g.x,g.y,70,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
    if(!g.on&&g.h>0){ctx.strokeStyle='#ffd9a0';ctx.lineWidth=4;ctx.beginPath();ctx.arc(g.x,g.y,32,-Math.PI/2,-Math.PI/2+TAU*g.h/6);ctx.stroke();}
    if(g.on){ctx.save();ctx.translate(g.x,g.y);ctx.rotate(t*3);ctx.strokeStyle='#ffd9a0';for(let q=0;q<3;q++){ctx.rotate(TAU/3);ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(18,0);ctx.stroke();}ctx.restore();}}
  if(P.core){const c=P.core,kk=c.on?1:.5+.3*Math.sin(t*2);ctx.save();ctx.translate(c.x,c.y);ctx.rotate(t*.4);ctx.strokeStyle=c.on?'#ffd9a0':'#8fe9ff';ctx.lineWidth=3;ctx.globalAlpha=kk;ctx.beginPath();for(let q=0;q<6;q++){const a=q/6*TAU;ctx.lineTo(Math.cos(a)*30,Math.sin(a)*30);}ctx.closePath();ctx.stroke();ctx.restore();ctx.globalAlpha=1;
    if(!c.on){ctx.setLineDash([6,8]);ctx.strokeStyle='#8fe9ff';ctx.globalAlpha=.6;ctx.beginPath();ctx.arc(c.x,c.y,75,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;if(c.h>0){ctx.strokeStyle='#ffd9a0';ctx.lineWidth=4;ctx.beginPath();ctx.arc(c.x,c.y,42,-Math.PI/2,-Math.PI/2+TAU*c.h/4);ctx.stroke();}}}
  // шлюз-выход: створки расходятся, когда палуба выполнена
  {const d=P.door,o=d.k,L=56,col=d.open?'#7affc9':'#ff3b4e';ctx.fillStyle='#0a0f17';ctx.strokeStyle='#c9a227';ctx.lineWidth=2;ctx.fillRect(d.x-22,d.y-30,44,60);ctx.strokeRect(d.x-22,d.y-30,44,60);
    ctx.fillStyle='#1a2433';ctx.fillRect(d.x-20,d.y-28,20*(1-o),56);ctx.fillRect(d.x+20-20*(1-o),d.y-28,20*(1-o),56);if(o>.05){ctx.fillStyle='rgba(122,255,201,.18)';ctx.fillRect(d.x-20*o,d.y-28,40*o,56);}
    glow(d.x,d.y-36,10,col,d.open?.7+.3*Math.sin(t*5):.35+.35*(Math.sin(t*3)>0?1:0));}
  // замёрзшие VØID — такие же, как вы
  for(const w of P.wrecks){ctx.save();ctx.translate(w.x,w.y);ctx.rotate(w.a);ctx.globalAlpha=.85;drawShip('base',t,0,{});ctx.globalAlpha=1;ctx.fillStyle='rgba(225,245,255,.5)';for(let i=0;i<7;i++){ctx.fillRect(-14+i*4,-10+((i*7)%13),2,2);}
    if(w.mirror&&P.scDone.sc3){glow(8,0,10,'#ff3b4e',.8);ctx.fillStyle='#ff3b4e';ctx.beginPath();ctx.arc(6,0,2,0,TAU);ctx.fill();}ctx.restore();
    ctx.font='700 '+fpx(10)+'px "Exo 2",sans-serif';ctx.textAlign='center';ctx.fillStyle='rgba(200,225,250,.55)';ctx.fillText('VØID-013',w.x,w.y+30);
    if(!w.read){ctx.strokeStyle='rgba(220,240,255,.5)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(w.x,w.y,24,0,TAU);ctx.stroke();glow(w.x,w.y,24,'#dff6ff',.3+.2*Math.sin(t*3));}}
  postDrawSuits(t);postDrawCrates(t);
  // аварийная переборка
  if(P.edoor){const E=P.edoor;for(const w of [E.wa,E.wb]){if(w.x1-w.x0<1||w.y1-w.y0<1)continue;ctx.fillStyle='#141c28';ctx.fillRect(w.x0,w.y0,w.x1-w.x0,w.y1-w.y0);ctx.save();ctx.beginPath();ctx.rect(w.x0,w.y0,w.x1-w.x0,w.y1-w.y0);ctx.clip();ctx.strokeStyle='#c9a227';ctx.lineWidth=5;for(let q=-40;q<200;q+=14){ctx.beginPath();ctx.moveTo(w.x0+q,w.y0);ctx.lineTo(w.x0+q-30,w.y1);ctx.stroke();}ctx.restore();}}
}
// Наблюдатель: тень с длинными суставчатыми конечностями; виден только в свете, глаза — всегда
const POST_OS=2.2; // Наблюдатель выше корабля в два с лишним раза
function postDrawO(x,y,t,face,ext,al){ctx.save();ctx.translate(x,y);ctx.rotate(face);ctx.scale(POST_OS,POST_OS);ctx.globalAlpha=al;
  for(let i=0;i<7;i++){ctx.fillStyle='rgba(1,2,6,.92)';ctx.beginPath();ctx.ellipse(-i*7+Math.sin(t*3+i)*2,Math.sin(t*2+i*1.7)*4,18-i*1.4,27-i*2.2,0,0,TAU);ctx.fill();}
  ctx.strokeStyle='rgba(1,2,6,.95)';ctx.lineCap='round';
  for(const [base,len,ph] of [[.75,82,0],[-.75,82,1.3],[1.7,64,2.1],[-1.7,64,3.4]]){let px=Math.cos(base)*12,py=Math.sin(base)*16,a=base*.55;const n=3;
    for(let s=0;s<n;s++){const seg=len*ext/n,bend=Math.sin(t*2.2+ph+s)*.35+(s===1?-.5*Math.sign(base):0);a+=bend*.5;const nx=px+Math.cos(a)*seg,ny=py+Math.sin(a)*seg;ctx.lineWidth=3.4-s;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(nx,ny);ctx.stroke();px=nx;py=ny;}
    ctx.lineWidth=1;for(const c of [-.4,0,.4]){ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+Math.cos(a+c)*9,py+Math.sin(a+c)*9);ctx.stroke();}}
  ctx.lineCap='butt';ctx.fillStyle='rgba(1,2,6,.97)';ctx.beginPath();ctx.ellipse(12,0,13,15,0,0,TAU);ctx.fill();
  ctx.strokeStyle='rgba(190,230,255,.22)';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(0,0,22,30,0,0,TAU);ctx.stroke();ctx.strokeStyle='rgba(190,230,255,.1)';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,24,33,0,0,TAU);ctx.stroke();ctx.restore();ctx.globalAlpha=1;}
function postEyes(x,y,t,face,n,bright,al){ctx.save();ctx.translate(x,y);ctx.rotate(face);ctx.scale(POST_OS,POST_OS);ctx.globalAlpha=al;const E=[[16,-6],[16,6],[10,-11],[10,11],[20,-1],[6,0]];
  for(let i=0;i<n;i++){const [ex,ey]=E[i],bl=Math.sin(t*1.7+i*2.3)>.97?.2:1;ctx.fillStyle=bright?'#ffffff':'#bfe8ff';ctx.beginPath();ctx.ellipse(ex,ey,2.6*bl,2.6,0,0,TAU);ctx.fill();}
  if(bright&&!lessFx25()){ctx.globalAlpha=al*.35;glow(16,0,26,'#bfe8ff',1);}ctx.restore();ctx.globalAlpha=1;}
function postDrawOver(t){const P=G.post,p=G.player;if(!P||!p)return;const D=postDK(),O=P.O;
  const T0=ctx.getTransform(),cw=cv.width,ch=cv.height;
  // 1. тело Наблюдателя и мелькнувший силуэт — под тьмой: видно только то, что освещено
  const ext=O.st==='strike'?1.35:O.st==='tele'?1.15:1;
  if(O.st!=='off')postDrawO(O.x,O.y,t,Math.atan2(p.y-O.y,p.x-O.x),ext,1);
  if(P.glim)postDrawO(P.glim.x,P.glim.y,t,Math.atan2(p.y-P.glim.y,p.x-P.glim.x),1.1,Math.min(1,P.glim.t/P.glim.t0*1.6));
  // 2. тьма в половинном разрешении: фонарь с тенями от переборок, лампы, маячки, искры
  const SC=.5,w2=Math.max(1,Math.round(cw*SC)),h2=Math.max(1,Math.round(ch*SC));
  if(!pC||pC.width!==w2||pC.height!==h2){pC=document.createElement('canvas');pC.width=w2;pC.height=h2;pX=pC.getContext('2d');lC=document.createElement('canvas');lC.width=w2;lC.height=h2;lX=lC.getContext('2d');}
  const M=[T0.a*SC,T0.b*SC,T0.c*SC,T0.d*SC,T0.e*SC,T0.f*SC];
  const L=lX;L.setTransform(1,0,0,1,0,0);L.globalCompositeOperation='source-over';L.clearRect(0,0,w2,h2);L.setTransform(...M);
  const bo=P.blackout>0;
  if(!bo){const a=P.aim??0,R=postConeR(),fl=P.fl;const g=L.createRadialGradient(p.x,p.y,10,p.x,p.y,R);g.addColorStop(0,`rgba(0,0,0,${(.97*fl).toFixed(3)})`);g.addColorStop(.65,`rgba(0,0,0,${(.7*fl).toFixed(3)})`);g.addColorStop(1,'rgba(0,0,0,0)');L.fillStyle=g;
    L.beginPath();L.moveTo(p.x,p.y);L.arc(p.x,p.y,R,a-.5,a+.5);L.closePath();L.fill();
    const g2=L.createRadialGradient(p.x,p.y,20,p.x,p.y,74);g2.addColorStop(0,'rgba(0,0,0,.95)');g2.addColorStop(1,'rgba(0,0,0,0)');L.fillStyle=g2;L.beginPath();L.arc(p.x,p.y,74,0,TAU);L.fill();
    L.globalCompositeOperation='destination-out';L.fillStyle='#000';
    for(const w of P.walls){if(w.x1-w.x0<1||w.y1-w.y0<1)continue;const c=[[w.x0,w.y0],[w.x1,w.y0],[w.x1,w.y1],[w.x0,w.y1]];
      for(let i=0;i<4;i++){const A_=c[i],B_=c[(i+1)%4];const fa=Math.hypot(A_[0]-p.x,A_[1]-p.y)||1,fb=Math.hypot(B_[0]-p.x,B_[1]-p.y)||1,K=3000;
        L.beginPath();L.moveTo(A_[0],A_[1]);L.lineTo(B_[0],B_[1]);L.lineTo(B_[0]+(B_[0]-p.x)/fb*K,B_[1]+(B_[1]-p.y)/fb*K);L.lineTo(A_[0]+(A_[0]-p.x)/fa*K,A_[1]+(A_[1]-p.y)/fa*K);L.closePath();L.fill();}}}
  const X=pX;X.setTransform(1,0,0,1,0,0);X.globalCompositeOperation='source-over';X.clearRect(0,0,w2,h2);
  const dk=isMob()?Math.min(D.dark,.93):D.dark;X.fillStyle=`rgba(1,2,6,${(bo?1:dk).toFixed(3)})`;X.fillRect(0,0,w2,h2);
  X.globalCompositeOperation='destination-out';X.drawImage(lC,0,0);X.setTransform(...M);
  const hole=(x,y,r,a)=>{const g=X.createRadialGradient(x,y,r*.25,x,y,r);g.addColorStop(0,`rgba(0,0,0,${a})`);g.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=g;X.beginPath();X.arc(x,y,r,0,TAU);X.fill();};
  if(!bo){for(const Lm of P.lamps)if(Lm.on)hole(Lm.x,Lm.y,Lm.r,.95*Lm.fl);for(const g2 of P.gens)if(g2.on)hole(g2.x,g2.y,postR(.32),.95);if(P.core&&P.core.on&&P.escape<=0)hole(P.core.x,P.core.y,postR(.28),.9);
    if(P.core&&!P.core.on)hole(P.core.x,P.core.y,90,.35+.15*Math.sin(t*2));
    for(const b of P.beacons){const R=postR(.34);for(const [hw,al] of [[.09,.22],[.17,.14],[.26,.08]]){const g=X.createRadialGradient(b.x,b.y,4,b.x,b.y,R);g.addColorStop(0,`rgba(0,0,0,${al})`);g.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=g;X.beginPath();X.moveTo(b.x,b.y);X.arc(b.x,b.y,R,b.a-hw,b.a+hw);X.closePath();X.fill();}}
    for(const s of P.sparks)hole(s.x,s.y,160,Math.min(1,s.t/.2)*.9);
    for(const b of P.breach)hole(b.x,b.y,b.r*1.3,.35);
    if(P.hatch&&P.hatch.k<1){const o=1-P.hatch.k,a=W>=H?0:Math.PI/2,g=X.createRadialGradient(P.hatch.x,P.hatch.y,6,P.hatch.x,P.hatch.y,360);g.addColorStop(0,'rgba(0,0,0,.95)');g.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=g;X.beginPath();X.moveTo(P.hatch.x,P.hatch.y);X.arc(P.hatch.x,P.hatch.y,360,a-.5*o,a+.5*o);X.closePath();X.fill();}
    if(P.door.open)hole(P.door.x,P.door.y,70,.5);
    if(P.flash>0)hole(p.x,p.y,280,P.flash*.9);
    for(const e of G.enemies)if(e.alive&&e.reveal>0)hole(e.x,e.y,50,.8);}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=true;ctx.drawImage(pC,0,0,cw,ch);ctx.restore();
  // 3. цвет света: тёплые лампы, холодный фонарь, красные маячки, вспышки искр
  if(!bo){ctx.save();ctx.globalCompositeOperation='lighter';for(const Lm of P.lamps)if(Lm.on)glow(Lm.x,Lm.y,Lm.r*.75,'#ffcf8a',.16*Lm.fl);for(const g2 of P.gens)if(g2.on)glow(g2.x,g2.y,postR(.26),'#ffcf8a',.14);
    {const a=P.aim??0,R=postConeR()*.9;const g=ctx.createRadialGradient(p.x,p.y,8,p.x,p.y,R);g.addColorStop(0,`rgba(210,235,255,${(.2*P.fl).toFixed(3)})`);g.addColorStop(.6,`rgba(210,235,255,${(.08*P.fl).toFixed(3)})`);g.addColorStop(1,'rgba(210,235,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.arc(p.x,p.y,R,a-.48,a+.48);ctx.closePath();ctx.fill();}
    for(const b of P.beacons){const R=postR(.34),k=P.escape>0?1.5:1;for(const [hw,al] of [[.08,.09],[.16,.05],[.25,.03]]){const g=ctx.createRadialGradient(b.x,b.y,4,b.x,b.y,R);g.addColorStop(0,`rgba(255,30,45,${(al*k).toFixed(3)})`);g.addColorStop(.6,`rgba(255,30,45,${(al*k*.4).toFixed(3)})`);g.addColorStop(1,'rgba(255,30,45,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.arc(b.x,b.y,R,b.a-hw,b.a+hw);ctx.closePath();ctx.fill();}glow(b.x,b.y,26,'#ff3b4e',.25*k);}
    for(const s of P.sparks)glow(s.x,s.y,120,'#cfe8ff',Math.min(1,s.t/.2)*.35);
    for(const b of P.breach)glow(b.x,b.y,b.r*1.4,'#6f9fd8',.12);
    if(P.hatch&&P.hatch.k<1)glow(P.hatch.x,P.hatch.y,200*(1-P.hatch.k),'#cfe8ff',.25);
    ctx.restore();}
  // 4. глаза — их видно и во тьме
  if(O.st!=='off'){const d=Math.hypot(O.x-p.x,O.y-p.y),hot=O.st==='tele'||O.st==='strike'||O.st==='show',vis=hot||postLit(O.x,O.y,30)||d<170||postSees(O.x,O.y);
    if(vis||d<380){const k=O.st==='tele'?.6+.4*Math.abs(Math.sin(t*14)):hot?1:Math.max(.1,1-d/380);postEyes(O.x,O.y,t,Math.atan2(p.y-O.y,p.x-O.x),hot?6:O.frz?4:2,hot,k);}}
  if(P.glim)postEyes(P.glim.x,P.glim.y,t,Math.atan2(p.y-P.glim.y,p.x-P.glim.x),2,true,Math.min(1,P.glim.t/P.glim.t0*1.6));
  for(const f of P.figs)postDrawFig(f,t);
  // 5. указатель цели — тусклый, у самого корабля
  const tg=postTarget();if(tg){const a=Math.atan2(tg.y-p.y,tg.x-p.x),dd=Math.hypot(tg.x-p.x,tg.y-p.y);if(dd>120){const x=p.x+Math.cos(a)*50,y=p.y+Math.sin(a)*50;ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle='rgba(191,232,255,.55)';ctx.beginPath();ctx.moveTo(7,0);ctx.lineTo(-4,-4);ctx.lineTo(-4,4);ctx.closePath();ctx.fill();ctx.restore();
    ctx.font='700 '+fpx(11)+'px "Exo 2",sans-serif';ctx.textAlign='center';ctx.fillStyle='rgba(191,232,255,.5)';ctx.fillText(tg.label,p.x+Math.cos(a)*74,p.y+Math.sin(a)*74+4);}}
  if(P.fake){const a=P.fake.a,x=clamp(p.x+Math.cos(a)*600,30,W-30),y=clamp(p.y+Math.sin(a)*600,30,H-30);ctx.save();ctx.translate(x,y);ctx.rotate(a+Math.PI);ctx.strokeStyle='#8a7dff';ctx.globalAlpha=.4+.6*Math.abs(Math.sin(P.fake.t*18));ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-6,-8);ctx.lineTo(4,0);ctx.lineTo(-6,8);ctx.stroke();ctx.restore();ctx.globalAlpha=1;}
  // 6. ледяной фронт побега
  if(P.front!=null&&P.front<1.05){const vert=W>=H,r=postRect([Math.max(P.front,-.3),0,1.3,1]),e=vert?r.x0:r.y0,depth=vert?W:H,span=vert?H:W;ctx.save();
    const gr=vert?ctx.createLinearGradient(e,0,e+depth*.5,0):ctx.createLinearGradient(0,e,0,e+depth*.5);gr.addColorStop(0,'rgba(235,250,255,.62)');gr.addColorStop(.08,'rgba(200,232,255,.38)');gr.addColorStop(1,'rgba(160,205,240,.22)');ctx.fillStyle=gr;
    ctx.beginPath();for(let q=0;q<=48;q++){const z=q/48*span,j=Math.sin(z*.05+t*6)*8+Math.sin(z*.13-t*4)*5;if(vert)ctx.lineTo(e+j,z);else ctx.lineTo(z,e+j);}if(vert){ctx.lineTo(W+60,H);ctx.lineTo(W+60,0);}else{ctx.lineTo(W,H+60);ctx.lineTo(0,H+60);}ctx.closePath();ctx.fill();
    // кристаллы растут вперёд фронта
    ctx.strokeStyle='rgba(240,252,255,.75)';ctx.lineWidth=1.5;for(let q=0;q<26;q++){const z=((q*97.3)%1)*span+((q*37)%11),len=12+((q*53)%28)*(1+.3*Math.sin(t*3+q)),a=(vert?Math.PI:-Math.PI/2)+(((q*13)%9)-4)*.12;const bx=vert?e:z,by=vert?z:e;ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+Math.cos(a)*len,by+Math.sin(a)*len);ctx.stroke();}
    ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(200,235,255,.25)';ctx.lineWidth=18;ctx.beginPath();for(let q=0;q<=40;q++){const z=q/40*span,j=Math.sin(z*.05+t*6)*8;if(vert)ctx.lineTo(e+j,z);else ctx.lineTo(z,e+j);}ctx.stroke();ctx.globalCompositeOperation='source-over';
    ctx.strokeStyle='rgba(245,252,255,.95)';ctx.lineWidth=2.5;ctx.beginPath();for(let q=0;q<=48;q++){const z=q/48*span,j=Math.sin(z*.05+t*6)*8+Math.sin(z*.13-t*4)*5;if(vert)ctx.lineTo(e+j,z);else ctx.lineTo(z,e+j);}ctx.stroke();
    if(SET.fx&&Math.random()<.8){const q=Math.random()*span;if(vert)part(e,q,rnd(-160,-40),rnd(-40,40),.6,'#eaf8ff',2);else part(q,e,rnd(-40,40),rnd(-160,-40),.6,'#eaf8ff',2);}ctx.restore();}
  // 7. экранные слои: иней, сторона броска, тяжёлая виньетка, пульс сердца, зерно, сбой картинки, затемнение
  ctx.save();ctx.setTransform(1,0,0,1,0,0);const f=Math.min(1,(G.ice||0)/3+P.cold*.25+(G.frozen>0?.4:0)+(P.inFront?.5:0));
  {const g=ctx.createRadialGradient(cw/2,ch/2,Math.min(cw,ch)*.3,cw/2,ch/2,Math.max(cw,ch)*.72);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.62)');ctx.fillStyle=g;ctx.fillRect(0,0,cw,ch);}
  if(f>.02){const g=ctx.createRadialGradient(cw/2,ch/2,Math.min(cw,ch)*.5,cw/2,ch/2,Math.max(cw,ch)*.72);g.addColorStop(0,'rgba(200,235,255,0)');g.addColorStop(.6,`rgba(200,235,255,${(.08*f).toFixed(3)})`);g.addColorStop(1,`rgba(215,240,255,${(.36*f).toFixed(3)})`);ctx.fillStyle=g;ctx.fillRect(0,0,cw,ch);}
  if(O.st==='tele'){const a=Math.atan2(O.y-p.y,O.x-p.x);const gx=cw/2+Math.cos(a)*cw*.5,gy=ch/2+Math.sin(a)*ch*.5;const g=ctx.createRadialGradient(gx,gy,0,gx,gy,Math.min(cw,ch)*.45);g.addColorStop(0,'rgba(220,240,255,.45)');g.addColorStop(1,'rgba(220,240,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,cw,ch);}
  {const dO=O.st!=='off'&&O.st!=='flee'?Math.hypot(O.x-p.x,O.y-p.y):999,near=dO<380?1-dO/380:0,k=near*(.35+.65*P.hbPulse);if(k>.02){const g=ctx.createRadialGradient(cw/2,ch/2,Math.min(cw,ch)*.25,cw/2,ch/2,Math.max(cw,ch)*.7);g.addColorStop(0,'rgba(30,0,4,0)');g.addColorStop(1,`rgba(30,0,4,${(.55*k).toFixed(3)})`);ctx.fillStyle=g;ctx.fillRect(0,0,cw,ch);}}
  if(P.strobe){if(P.strobe.dark){ctx.fillStyle='rgba(0,0,0,.94)';ctx.fillRect(0,0,cw,ch);}else{ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(200,225,255,.14)';ctx.fillRect(0,0,cw,ch);ctx.globalCompositeOperation='source-over';}}
  if(!lessFx25()&&SET.fx){if(!pN){pN=document.createElement('canvas');pN.width=pN.height=160;const nx=pN.getContext('2d'),id=nx.createImageData(160,160);for(let i=0;i<id.data.length;i+=4){const v=Math.random()*255|0;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=Math.random()*70|0;}nx.putImageData(id,0,0);}
    ctx.globalAlpha=.09;const pat=ctx.createPattern(pN,'repeat');ctx.translate(-(Math.random()*160|0),-(Math.random()*160|0));ctx.fillStyle=pat;ctx.fillRect(0,0,cw+160,ch+160);ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
    if(P.glitch>0){for(let i=0;i<5;i++){const y=Math.random()*ch|0,h=4+Math.random()*28|0,dx=(Math.random()-.5)*30*P.glitch*2;try{ctx.drawImage(cv,0,y,cw,h,dx,y,cw,h);}catch(e){}}}}
  ctx.restore();
  if(P.rift>.01&&typeof drawRiftFx==='function'){try{drawRiftFx(P.rift,t);}catch(e){}}
  if(P.fade>0){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=`rgba(0,0,0,${Math.min(1,P.fade).toFixed(3)})`;ctx.fillRect(0,0,cw,ch);ctx.restore();}
}
function postTarget(){const P=G.post;if(!P)return null;const p=G.player,near=a=>a.sort((u,v)=>Math.hypot(u.x-p.x,u.y-p.y)-Math.hypot(v.x-p.x,v.y-p.y))[0];
  const pn=P.panels.filter(q=>!q.on);if(pn.length)return {...near(pn),label:'ЩИТОК'};const c=P.cells.filter(q=>!q.got);if(c.length)return {...near(c),label:'ТЕПЛО'};
  const g=P.gens.filter(q=>!q.on);if(g.length)return {...near(g),label:'ГЕНЕРАТОР'};if(P.core&&!P.core.on)return {x:P.core.x,y:P.core.y,label:'РЕАКТОР'};return {x:P.door.x,y:P.door.y,label:'ШЛЮЗ'};}
// --- звук: гул корпуса вместо музыки, металлический призвук, стоны, шёпот, дыхание, шаги, сирена (Web Audio, без файлов)
function postAudio(on){if(!AU.ctx)return;const c=AU.ctx,t=c.currentTime;
  if(on){AU.amb.gain.setTargetAtTime(0,t,.8);if(AU.postN)return;try{const g=c.createGain();g.gain.value=0;g.connect(AU.sfx);g.gain.setTargetAtTime(SET.sfx?.55:0,t,2);
      const o1=c.createOscillator(),o2=c.createOscillator(),o3=c.createOscillator();o1.type='sine';o1.frequency.value=36;o2.type='sine';o2.frequency.value=36.7;o3.type='triangle';o3.frequency.value=72.4;const og=c.createGain();og.gain.value=.28;const o3g=c.createGain();o3g.gain.value=.05;o1.connect(og);o2.connect(og);o3.connect(o3g);o3g.connect(g);og.connect(g);o1.start();o2.start();o3.start();
      const len=c.sampleRate*2,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
      const n=c.createBufferSource();n.buffer=b;n.loop=true;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=380;f.Q.value=.7;const ng=c.createGain();ng.gain.value=.12;n.connect(f);f.connect(ng);ng.connect(g);n.start();
      const n2=c.createBufferSource();n2.buffer=b;n2.loop=true;const f2=c.createBiquadFilter();f2.type='bandpass';f2.frequency.value=1150;f2.Q.value=28;const n2g=c.createGain();n2g.gain.value=.22;n2.connect(f2);f2.connect(n2g);n2g.connect(g);n2.start();
      AU.postN={g,o1,o2,o3,n,n2,f,f2};}catch(e){}}
  else{const N=AU.postN;AU.postN=null;if(N){try{N.g.gain.setTargetAtTime(0,t,.4);setTimeout(()=>{try{N.o1.stop();N.o2.stop();N.o3.stop();N.n.stop();N.n2.stop();N.g.disconnect();}catch(e){}},1600);}catch(e){}}applyAudio();}}
function postAudioTick(dt){const P=G.post,O=P.O,p=G.player;if(!AU.ctx||!SET.sfx)return;const c=AU.ctx;
  if(AU.postN)try{const N=AU.postN;N.f.frequency.setTargetAtTime(300+120*Math.sin(P.t*.3),c.currentTime,.5);N.f2.frequency.setTargetAtTime(1100+260*Math.sin(P.t*.17)+(P.escape>0?300:0),c.currentTime,.8);
    N.g.gain.setTargetAtTime(.55*(1-.94*P.duck)*(P.escape>0?1.25:1),c.currentTime,P.duck>0?.12:.6);}catch(e){}
  if(O.st!=='off'&&O.st!=='flee'){const d=Math.hypot(O.x-p.x,O.y-p.y);if(d<480){P.hb-=dt;if(P.hb<=0){P.hb=O.st==='tele'?.32:.55+d/480*.6;postSnd('heart',0,O.st==='tele'?1.3:.7+.5*(1-d/480));P.hbPulse=1;}}}}
function postSnd(k,pan,vol,f0){if(!AU.ctx||!SET.sfx)return;const c=AU.ctx,t=c.currentTime;vol=vol||1;try{
  const out=c.createGain();out.gain.value=vol;if(c.createStereoPanner){const sp=c.createStereoPanner();sp.pan.value=clamp(pan||0,-1,1);out.connect(sp);sp.connect(AU.sfx);}else out.connect(AU.sfx);
  const thump=(dl,f,v,f1)=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(f,t+dl);o.frequency.exponentialRampToValueAtTime(f1||30,t+dl+.18);g.gain.setValueAtTime(v,t+dl);g.gain.exponentialRampToValueAtTime(.001,t+dl+.22);o.connect(g);g.connect(out);o.start(t+dl);o.stop(t+dl+.25);};
  const nz=(dl,dur,f,typ,v,q,env)=>{const len=c.sampleRate*dur|0,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++){const x=i/len;d[i]=(Math.random()*2-1)*(env==='swell'?Math.sin(Math.PI*x):Math.pow(1-x,2));}const s=c.createBufferSource();s.buffer=b;const fl=c.createBiquadFilter();fl.type=typ;fl.frequency.value=f;if(q)fl.Q.value=q;const g=c.createGain();g.gain.value=v;s.connect(fl);fl.connect(g);g.connect(out);s.start(t+dl);return fl;};
  const tone=(dl,dur,f,typ,v,f1)=>{const o=c.createOscillator(),g=c.createGain();o.type=typ;o.frequency.setValueAtTime(f,t+dl);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+dl+dur);g.gain.setValueAtTime(.0001,t+dl);g.gain.exponentialRampToValueAtTime(v,t+dl+.03);g.gain.exponentialRampToValueAtTime(.0001,t+dl+dur);o.connect(g);g.connect(out);o.start(t+dl);o.stop(t+dl+dur+.05);return o;};
  if(k==='heart'){thump(0,70,.5);thump(.16,60,.35);}
  else if(k==='knock'){for(let i=0;i<3;i++)nz(i*.19+rnd(0,.04),.09,260,'lowpass',.9);}
  else if(k==='crack'){nz(0,.25,2600,'highpass',.5);nz(.05,.15,900,'bandpass',.4);}
  else if(k==='hit'){thump(0,90,.7);nz(0,.3,600,'lowpass',.8);}
  else if(k==='slam'){thump(0,70,1,24);nz(0,.9,240,'lowpass',.9);nz(.02,.25,1800,'bandpass',.35,6);}
  else if(k==='groan'){const o=tone(0,2.6,58,'sawtooth',.14,26);const fl=c.createBiquadFilter();fl.type='lowpass';fl.frequency.value=220;try{o.disconnect();const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.16,t+.6);g.gain.exponentialRampToValueAtTime(.0001,t+2.6);o.connect(fl);fl.connect(g);g.connect(out);}catch(e){}nz(.2,2.2,140,'bandpass',.35,3,'swell');}
  else if(k==='whisper'){for(let i=0;i<3;i++){const fl=nz(i*.22,.5+rnd(0,.3),900+rnd(0,700),'bandpass',.5,9,'swell');try{fl.frequency.exponentialRampToValueAtTime(600+rnd(0,1400),t+i*.22+.5);}catch(e){}}}
  else if(k==='breath'){nz(0,1.1,520,'lowpass',.55,0,'swell');nz(1.25,1.3,380,'lowpass',.45,0,'swell');}
  else if(k==='clank'){nz(0,.07,1400,'bandpass',.8,8);thump(0,110,.25,50);}
  else if(k==='stinger'){for(const f of [220,233,311,466,493])tone(0,1.5,f,'sawtooth',.06,f*.94);nz(0,.6,3000,'highpass',.4);thump(0,55,.8,25);}
  else if(k==='klaxon'){const o=tone(0,.5,440,'square',.07);const o2=tone(.55,.5,330,'square',.07);}
  else if(k==='static'){nz(0,.35,2400,'bandpass',.7,2);for(let i=0;i<4;i++)nz(i*.05+rnd(0,.03),.04,5000,'highpass',.5);thump(0,180,.15,60);}
  else if(k==='note'){const f=arguments[3]||660;const o=tone(0,1.1,f,'sine',.09,f*.995);const o2=tone(0,.6,f*2.01,'sine',.025);}
  else if(k==='spark'){for(let i=0;i<5;i++)nz(i*.03+rnd(0,.02),.03,4200,'highpass',.6);}}catch(e){}}
// ---------- мир: огромный разбитый сторожевик поперёк прохода
let PWG=null;
function postWreckGeo(){if(PWG)return PWG;const R=pRng(77);
  const hull=[[420,0],[350,-60],[210,-98],[-240,-112],[-345,-92],[-418,-60],[-418,60],[-345,92],[-240,112],[210,98],[350,60]];
  const frost=[];for(let i=0;i<14;i++){const x=-400+R()*760,top=R()<.6,n=5+(R()*4|0),r=10+R()*22,pts=[];for(let j=0;j<n;j++){const a=j/n*TAU;pts.push([Math.cos(a)*r*(.6+R()*.6),Math.sin(a)*r*.5*(.6+R()*.6)]);}frost.push({x,y:top?-96+R()*10:94-R()*10,pts});}
  const holes=[[-150,-40,26],[230,40,22],[-30,70,18]].map(([x,y,r])=>{const pts=[];for(let j=0;j<11;j++){const a=j/11*TAU;pts.push([x+Math.cos(a)*r*(.6+R()*.6),y+Math.sin(a)*r*(.6+R()*.6)]);}return {x,y,r,pts};});
  const ice=[];for(let i=0;i<24;i++)ice.push([-380+R()*700,100+R()*8,6+R()*26]);
  const debris=Array.from({length:22},()=>({a:R()*TAU,d:420+R()*230,s:4+R()*12,sp:(R()-.5)*.04,rot:R()*TAU,n:3+(R()*3|0)}));
  const lh=POST_HL;
  return PWG={hull,frost,ice,debris,lh,holes};}
function postWorldDraw(t){if(!G.save||!postAvail())return;const p=G.player;if(p&&Math.hypot(p.x-POST_W.x,p.y-POST_W.y)>2600)return;const g=postWreckGeo(),done=postDone();
  ctx.save();ctx.translate(POST_W.x,POST_W.y);
  {const gr=ctx.createRadialGradient(0,0,100,0,0,760);gr.addColorStop(0,'rgba(0,0,0,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,760,0,TAU);ctx.fill();}
  for(const d of g.debris){const a=d.a+t*d.sp,x=Math.cos(a)*d.d,y=Math.sin(a)*d.d*.55;ctx.save();ctx.translate(x,y);ctx.rotate(d.rot+t*d.sp*4);ctx.fillStyle='#0c121b';ctx.strokeStyle='rgba(150,180,215,.4)';ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<d.n;i++){const q=i/d.n*TAU;ctx.lineTo(Math.cos(q)*d.s,Math.sin(q)*d.s*.6);}ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
  ctx.rotate(POST_ANG);
  // корпус
  const gr=ctx.createLinearGradient(0,-112,0,112);gr.addColorStop(0,'#1a2433');gr.addColorStop(.5,'#0c121b');gr.addColorStop(1,'#06090e');ctx.fillStyle=gr;ctx.strokeStyle=done?'rgba(122,255,201,.45)':'rgba(170,205,240,.55)';ctx.lineWidth=2.5;
  ctx.beginPath();for(const [x,y] of g.hull)ctx.lineTo(x,y);ctx.closePath();ctx.fill();
  ctx.save();ctx.strokeStyle=done?'rgba(122,255,201,.12)':'rgba(170,215,255,.13)';ctx.lineWidth=16;ctx.stroke();ctx.lineWidth=7;ctx.stroke();ctx.restore();ctx.stroke();
  // мёртвый прожектор: луч с мостика ходит по льду и сбоит
  {const a=-1.9+Math.sin(t*.35)*.55,on=Math.sin(t*5.3)>-.75&&Math.sin(t*.9)>-.85,L=620;if(on){const gr=ctx.createRadialGradient(-220,-74,4,-220,-74,L);gr.addColorStop(0,'rgba(220,240,255,.22)');gr.addColorStop(1,'rgba(220,240,255,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(-220,-74);ctx.arc(-220,-74,L,a-.13,a+.13);ctx.closePath();ctx.fill();}glow(-220,-76,14,'#dff6ff',on?.8:.15);}
  // обшивка: пояса плит
  ctx.save();ctx.beginPath();for(const [x,y] of g.hull)ctx.lineTo(x,y);ctx.closePath();ctx.clip();ctx.strokeStyle='rgba(120,150,190,.14)';ctx.lineWidth=1;for(let x=-420;x<420;x+=34){ctx.beginPath();ctx.moveTo(x,-120);ctx.lineTo(x+6,120);ctx.stroke();}
  for(const y of [-60,-20,24,64]){ctx.beginPath();ctx.moveTo(-420,y);ctx.lineTo(420,y+3);ctx.stroke();}
  // пролом посередине: рёбра шпангоутов и тьма
  ctx.save();ctx.translate(-70,0);ctx.fillStyle='#020306';ctx.beginPath();ctx.moveTo(10,-118);ctx.lineTo(40,-70);ctx.lineTo(18,-40);ctx.lineTo(56,-6);ctx.lineTo(28,30);ctx.lineTo(62,70);ctx.lineTo(36,118);ctx.lineTo(118,118);ctx.lineTo(96,70);ctx.lineTo(128,26);ctx.lineTo(100,-10);ctx.lineTo(132,-52);ctx.lineTo(104,-118);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(140,170,205,.6)';ctx.lineWidth=3;for(let x=34;x<120;x+=17){ctx.beginPath();ctx.moveTo(x,-100);ctx.quadraticCurveTo(x+14,0,x,100);ctx.stroke();}
  ctx.strokeStyle='rgba(200,225,250,.7)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(10,-118);ctx.lineTo(40,-70);ctx.lineTo(18,-40);ctx.lineTo(56,-6);ctx.lineTo(28,30);ctx.lineTo(62,70);ctx.lineTo(36,118);ctx.moveTo(104,-118);ctx.lineTo(132,-52);ctx.lineTo(100,-10);ctx.lineTo(128,26);ctx.lineTo(96,70);ctx.lineTo(118,118);ctx.stroke();
  {const k=(Math.sin(t*1.1)+1)/2;glow(70,10,40,'#ff3b4e',.06+.08*k);}ctx.restore();
  for(const h of g.holes){ctx.fillStyle='#020306';ctx.beginPath();for(const [x,y] of h.pts)ctx.lineTo(x,y);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(200,225,250,.55)';ctx.lineWidth=1.2;ctx.stroke();ctx.strokeStyle='rgba(140,170,205,.5)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(h.x-h.r*.6,h.y-h.r*.9);ctx.lineTo(h.x-h.r*.5,h.y+h.r*.9);ctx.moveTo(h.x+h.r*.3,h.y-h.r*.9);ctx.lineTo(h.x+h.r*.4,h.y+h.r*.9);ctx.stroke();}
  // надстройка, мостик с окнами; в одном окне — свет, иногда в нём кто-то стоит
  ctx.fillStyle='#0f1724';ctx.fillRect(-300,-74,170,58);ctx.strokeStyle='rgba(150,185,230,.35)';ctx.lineWidth=1.5;ctx.strokeRect(-300,-74,170,58);
  for(let i=0;i<9;i++){const x=-292+i*18,lit=i===5,fl=lit?(Math.sin(t*9)>-.2?.9:.15)*(.6+.4*Math.sin(t*1.3)):0;ctx.fillStyle=lit?`rgba(255,207,138,${fl.toFixed(2)})`:'#05080c';ctx.fillRect(x,-62,10,14);
    if(lit&&((t%11)>8.6)){ctx.fillStyle='#020306';ctx.fillRect(x+3,-60,4,12);}}
  // сопла
  for(const y of [-50,0,50]){ctx.fillStyle='#070a10';ctx.beginPath();ctx.ellipse(-420,y,10,18,0,0,TAU);ctx.fill();ctx.strokeStyle='rgba(150,185,230,.35)';ctx.stroke();}
  // имя на борту — выскоблено
  ctx.font='800 34px "Exo 2",sans-serif';ctx.textAlign='left';ctx.fillStyle='rgba(200,220,245,.34)';ctx.fillText('ИЗМОРОЗЬ',70,30);ctx.font='700 14px "Exo 2",sans-serif';ctx.fillText('СК-07 · СТОРОЖЕВОЙ',72,52);
  ctx.strokeStyle='rgba(6,9,14,.9)';ctx.lineWidth=3;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(80+i*38,4);ctx.lineTo(116+i*38,38);ctx.stroke();}
  ctx.restore();
  // иней и сосульки
  for(const f of g.frost){ctx.fillStyle='rgba(225,245,255,.5)';ctx.beginPath();for(const [x,y] of f.pts)ctx.lineTo(f.x+x,f.y+y);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(240,250,255,.7)';ctx.lineWidth=1;ctx.stroke();}
  ctx.strokeStyle='rgba(230,248,255,.55)';ctx.lineWidth=5;ctx.beginPath();for(let i=1;i<=6;i++){const [x,y]=g.hull[i];ctx.lineTo(x,y+4);}ctx.stroke();
  ctx.fillStyle='rgba(215,240,255,.45)';for(const [x,y,l] of g.ice){ctx.beginPath();ctx.moveTo(x-3,y);ctx.lineTo(x+3,y);ctx.lineTo(x,y+l);ctx.closePath();ctx.fill();}
  // огни: красный на носу мигает, янтарный над шлюзом умирает
  {const bl=Math.sin(t*2.2)>.6;glow(410,0,22,'#ff3b4e',bl?.9:.12);ctx.fillStyle=bl?'#ff3b4e':'#5a1a20';ctx.beginPath();ctx.arc(410,0,4,0,TAU);ctx.fill();}
  // шлюз
  {const [hx,hy]=g.lh;ctx.save();ctx.translate(hx,hy);const fl=(Math.sin(t*7)>.3?1:.25)*(Math.sin(t*.7)>-.6?1:.1);
    {const gr=ctx.createLinearGradient(0,0,0,-170);gr.addColorStop(0,`rgba(255,207,138,${(.28*fl).toFixed(3)})`);gr.addColorStop(1,'rgba(255,207,138,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.moveTo(-20,0);ctx.lineTo(20,0);ctx.lineTo(70,-170);ctx.lineTo(-70,-170);ctx.closePath();ctx.fill();}
    ctx.fillStyle='#05080c';ctx.fillRect(-24,-4,48,30);ctx.strokeStyle='#c9a227';ctx.lineWidth=3;ctx.strokeRect(-24,-4,48,30);ctx.fillStyle=`rgba(255,207,138,${(.5*fl).toFixed(2)})`;ctx.fillRect(-19,0,38,22);
    glow(0,-12,22,done?'#7affc9':'#ffcf8a',(done?.8:.9)*fl);ctx.restore();}
  // холодный пар из пролома
  for(let i=0;i<6;i++){const k=((t*.25+i/6)%1),x=70+Math.sin(i*2.1+t)*20,y=-120-k*120;ctx.fillStyle=`rgba(210,235,255,${(.18*(1-k)).toFixed(3)})`;ctx.beginPath();ctx.arc(x,y,8+k*26,0,TAU);ctx.fill();}
  ctx.restore();
  worldLabel(POST_HATCH.x,POST_HATCH.y-62,done?'СТОРОЖЕВИК «ИЗМОРОЗЬ» · ПРОЙДЕН':'СТОРОЖЕВИК «ИЗМОРОЗЬ» · ШЛЮЗ',done?'#7affc9':'#bfe8ff');}
function postEnter(){const S=G.save;if(!S||!G.player)return;riftReset();if(G.anom)endAnom();G.slick=false;
  if(S.carry>0){S.lom+=S.carry;S.carry=0;}S.pos={x:POST_HATCH.x,y:POST_HATCH.y-150};S.last={...S.pos};saveWorld();
  G.world=false;G.card=null;G.cardKey=null;$('#wcard').hidden=true;CX=0;CY=0;BW=W;BH=H;openIntro(POST_I);}
{const _poi30=w58POI;w58POI=function(card){card=_poi30(card);const p=G.player;if(postAvail()&&p){const d=Math.hypot(p.x-POST_HATCH.x,p.y-POST_HATCH.y);
    if(d<900&&!postDone()&&!G.postNear){G.postNear=1;try{radioSay('Х',0);postSnd('crack',0,.6);}catch(e){}}
    if(d<200){card={kind:'post',key:'post|'+(postDone()?1:0)};G.save.last={x:POST_HATCH.x,y:POST_HATCH.y-150};}}return card;};}
{const _rc30=renderCard;renderCard=function(card){if(!card||card.kind!=='post')return _rc30(card);const el=$('#wcard');if(G.cardKey===card.key&&!el.hidden)return;G.cardKey=card.key;const ps=postSave(),done=postDone();
  el.innerHTML=kh(`<div class="eyebrow">ГРАНИЦА II–III · ${done?'ПРОЙДЕН НАСКВОЗЬ':'ВМЁРЗ В ЛЁД'}</div><h3>Сторожевик «Изморозь»</h3><p>${done?'Проход в сектор III открыт. Внутри по-прежнему темно, и в эфире по-прежнему ваш позывной.':'Проход в сектор III перекрыт: поперёк него вмёрз мёртвый сторожевой корабль. Путь один — насквозь. Шлюз открыт. Изнутри вас зовут по имени.'}</p>${done&&ps.best?`<p class="note">Лучшее время ${mmss(ps.best)}</p>`:''}<div class="wc-row"><button class="wbtn" data-act="post">ВОЙТИ В ШЛЮЗ [F]</button></div>`);
  el.hidden=false;if(typeof ctxBtnSync==='function')ctxBtnSync();};}
{const _ca30=cardAct;cardAct=function(act){const c=G.card;if(c&&c.kind==='post'&&G.state==='world'&&act!=='cycle'){postEnter();return;}return _ca30(act);};}
{const _ss30=secSeen;secSeen=function(i){if(i===2&&!openAllNow()&&G.save)return progDone(CORE)&&postGate();return _ss30(i);};}
{const _fh30=fogHint;fogHint=function(i){if(i===2&&G.save&&progDone(CORE)&&!postGate())return 'СЕКТОР III · ПРОЙДИТЕ СТОРОЖЕВИК «ИЗМОРОЗЬ»';return _fh30(i);};}
{const _ma30=w58MapAdd;w58MapAdd=function(add,lod,S){_ma30(add,lod,S);try{if(postAvail())add('post',POST_W.x,POST_W.y,{done:postDone()},lod>=1?{t:postDone()?'СТОРОЖЕВИК · ПРОЙДЕН':'СТОРОЖЕВИК «ИЗМОРОЗЬ»',p:2,c:postDone()?'#7affc9':'#bfe8ff'}:null);}catch(e){}};}
{const _mi30=w58MapIcon;w58MapIcon=function(g,kind,o,t){if(kind!=='post')return _mi30(g,kind,o,t);g.save();g.rotate(POST_ANG);g.fillStyle='#0c121b';g.strokeStyle=o.done?'#7affc9':'#bfe8ff';g.lineWidth=1.5;g.beginPath();g.moveTo(12,0);g.lineTo(8,-4);g.lineTo(-11,-4);g.lineTo(-12,0);g.lineTo(-11,4);g.lineTo(8,4);g.closePath();g.fill();g.stroke();
  g.fillStyle='#020306';g.fillRect(0,-4,3,8);if(!o.done){g.fillStyle=Math.sin(t*2.2)>.4?'#ff3b4e':'#5a1a20';g.beginPath();g.arc(12,0,1.6,0,TAU);g.fill();}g.restore();return true;};}
{const _mg30=migrateSave;migrateSave=function(S){S=_mg30(S);if(!S||typeof S!=='object')return S;
  const P0=S.post&&typeof S.post==='object'?S.post:null;const P={done:P0&&P0.done?1:0,open3:P0&&P0.open3?1:0,best:P0&&+P0.best>0?Math.min(36000,Math.round(+P0.best)):0,freezes:P0&&Number.isFinite(+P0.freezes)?Math.max(-1,Math.min(999,Math.round(+P0.freezes))):-1,logs:Array.isArray(P0&&P0.logs)?P0.logs.filter(v=>Number.isInteger(v)&&v>=0&&v<4).slice(0,4):[]};
  // сохранения до 1.2.0 с пройденной миссией 10: сектор III у них уже был открыт — доступ не отнимаем, сторожевик становится необязательным
  if(!S.v120){S.v120=1;if((+S.cleared||0)>=CORE||(S.medals&&S.medals[CORE]&&S.medals[CORE].clear))P.open3=1;}
  S.post=P;return S;};}
{const _bk30=briefK;briefK=function(m){if(m===POST_I+1){if(G.mode!=='world')return 0;return Math.floor(BRIEF_K[CORE-1]*curDiff().k)+perk('reserve');}return _bk30(m);};}
// брифинг без жанровой плашки: только место
{const _oi30=openIntro;openIntro=function(i){_oi30(i);if(i===POST_I){$('#inSector').textContent=MISSIONS[i].sector;}};}
{const _sm30=setupMission0;setupMission0=function(i){_sm30(i);G.post=null;if(MISSIONS[i]&&MISSIONS[i].post){try{postSetup();}catch(e){console.error(e);}}else postAudio(false);};}
{const _uw30=updateWaves;updateWaves=function(dt){if(G.post)return;return _uw30(dt);};}
{const _up30=update;update=function(dt){_up30(dt);if(G.post&&inMission()&&G.state==='play'&&G.deadT<=0){try{postTick(dt);}catch(e){console.error(e);}}};}
{const _go30=gameOver;gameOver=function(){if(G.post&&G.player&&G.mode==='world'){try{if(postRespawn())return;}catch(e){console.error(e);}postAudio(false);}return _go30();};}
{const _tp30=tryPulse;tryPulse=function(){const p=G.player,was=!!p&&p.en>=100;_tp30();if(was&&p.en<100&&G.post)postOnPulse();};}
{const _hud30=updateHUD;updateHUD=function(){_hud30();const P=G.post;if(!P)return;setT('misT','СТОРОЖЕВИК «ИЗМОРОЗЬ»');
  const tot=P.panels.length+P.cells.length+P.gens.length+(P.core?1:0)||1,dn=P.panels.filter(q=>q.on).length+P.cells.filter(q=>q.got).length+P.gens.filter(q=>q.on).length+(P.core&&P.core.on?1:0);
  setT('sigT',P.escape>0?'К ШЛЮЗУ':POST_ACTS[P.act].name);if(G.frozen>0)setT('dashC','РЫВОК · ЛЁД');setS('sigB',(P.escape>0?Math.max(0,P.escT)/P.escape:dn/tot).toFixed(3));setH('sigBar',false);};}
// выход из корабля — сразу в сектор III: проход открыт, курс на миссию 11, итоги — коротким сообщением
{const _rw30=returnToWorld;returnToWorld=function(){const was=!!G.post;G.post=null;postAudio(false);_rw30();
  if(was&&G.postMsg){const first=G.postMsg===1,R_=G.postRes;G.postMsg=0;G.postRes=null;
    setTimeout(()=>{if(first)banner('ПРОХОД ОТКРЫТ','СЕКТОР III · ХОЛОДНЫЙ АРХИВ');const n=WORLD.nodes[CORE];if(n&&G.state==='world')G.course={x:n.x,y:n.y+150,label:'МИССИЯ 11'};},500);
    if(R_)setTimeout(()=>{try{toast('СТОРОЖЕВИК ПРОЙДЕН','Время '+mmss(R_.t)+' · лом +'+R_.lom+(R_.fr===0?' · ни разу не замёрзли':'')+(R_.skin?' · скин «Изморозь»':'')+' · записи вахты '+R_.logs+'/4');}catch(e){}},3200);}};}
{const _tm30=toMenu;toMenu=function(){G.post=null;postAudio(false);return _tm30.apply(this,arguments);};}
{const _rj30=renderJournals;renderJournals=function(el,mapBtn){_rj30(el,mapBtn);try{const ps=G.save&&G.save.post;if(!ps||!ps.logs||!ps.logs.length&&!ps.done)return;
  const h=`<div class="jsec">СТОРОЖЕВИК «ИЗМОРОЗЬ» <small>${ps.logs.length}/4</small></div>`+ps.logs.slice().sort().map(i=>`<div class="jr"><h4>${POST_LOGS[i].title}</h4><p>${POST_LOGS[i].text}</p></div>`).join('');el.insertAdjacentHTML('beforeend',h);}catch(e){}};}
// скин за прохождение без единой заморозки
Object.assign(SKINS,{izmo:{name:'Изморозь',col:'#cfefff',bul:'#ffffff',trail:'#bfe8ff',d:'Корпус в инее, который не тает. Снят со сторожевика на границе.',unlock:0,find:'ГРАНИЦА II–III · СТОРОЖЕВИК'}});HULL_NUM.izmo='015';
{const _ds30=w58DrawSkin;w58DrawSkin=function(id,t,sp,o,A,fl,edge){if(id!=='izmo')return _ds30(id,t,sp,o,A,fl,edge);
  glow(-12,0,fl*.8,'#dff6ff',.45);ctx.fillStyle='#0d1a2a';ctx.strokeStyle=edge;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(19,0);ctx.lineTo(-11,-12);ctx.lineTo(-5,0);ctx.lineTo(-11,12);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle='rgba(223,246,255,.8)';ctx.lineWidth=1;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(4,s*2);ctx.lineTo(-4,s*7);ctx.lineTo(-2,s*9);ctx.moveTo(-2,s*4);ctx.lineTo(-9,s*9);ctx.stroke();}
  ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(6,0,2,0,TAU);ctx.fill();return true;};}
// музыка: внутри трек сектора II на минимуме (гул корабля звучит поверх, музыкальный канал приглушён)
{const _mt30=musTarget;musTarget=function(){if(!G.post)return _mt30();const m=G.m;G.m=CORE;let r;try{r=_mt30();}finally{G.m=m;}r.I=Math.min(r.I||0,.06);r.calm=true;return r;};}
{const _aa30=applyAudio;applyAudio=function(){_aa30();if(G.post&&AU.ctx)try{AU.amb.gain.setTargetAtTime(0,AU.ctx.currentTime,.3);}catch(e){}};}

// ваш рывок иногда звучит ещё раз — издалека, через секунду
{const _sx30=sfx;sfx=function(k){const r=_sx30.apply(this,arguments);try{if(G.post&&k==='dash'&&Math.random()<.3)setTimeout(()=>{try{if(G.post)(ARCH.off['A-7']||typeof iso63!=='function'?_sx30:iso63(_sx30))('dash');/* ARCH·70 A-7 */}catch(e){}},1100+Math.random()*500);}catch(e){}return r;};}


