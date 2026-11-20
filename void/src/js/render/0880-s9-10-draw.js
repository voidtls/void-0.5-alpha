// ===== 0.9: ощущение удара, интерфейс, рисунок, звук и музыка секторов IX–X =====
// --- цвет: смешение двух hex по k (0..1) ---
const MIX90={};
function mix90(a,b,k){k=clamp(k,0,1);const q=Math.round(k*31),key=a+b+q;if(MIX90[key])return MIX90[key];const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16),u=q/31;
  const r=Math.round((A>>16&255)*(1-u)+(B>>16&255)*u),g=Math.round((A>>8&255)*(1-u)+(B>>8&255)*u),bl=Math.round((A&255)*(1-u)+(B&255)*u);return MIX90[key]='#'+((1<<24)|(r<<16)|(g<<8)|bl).toString(16).slice(1);}
function rgba90(h,a){const n=parseInt(h.slice(1),16);return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a+')';}
// --- стоп-кадр: короткий (точное попадание, тихое убийство), фазовый и финальный ---
function hs90(d,prio){if(!inMission()||G.state!=='play')return;const now=ARCH.off['A-19']?performance.now():ARCH.clk*1000;/* ARCH·72 A-19 */if(prio<1&&G.hsLast90&&now-G.hsLast90<500)return;G.hsLast90=now;const H_=G.hs90;
  if(H_&&H_.t>d&&prio<=(H_.prio||0))return;G.hs90={t:d,ramp:prio>=2?.4:prio>=1?.15:0,prio:prio||0};}
function hsK90(dt,dt0){const S_=G.slow95;if(S_&&S_.t>0&&(G.state==='play'||G.state==='world')){S_.t-=dt0;dt*=S_.k;if(S_.t<=0)G.slow95=null;}G.rdt90=dt;const H_=G.hs90;if(!H_||G.state!=='play')return dt;
  if(H_.t>0){H_.t-=dt0;return dt*.04;}if(H_.ramp>0){const r0=H_.ramp;H_.ramp-=dt0;return dt*(.3+.7*(1-r0/.4));}G.hs90=null;return dt;}
// --- тряска «травмой»: амплитуда — квадрат накопленного удара ---
function trauma90(v){if(!SET.fx)return;G.tr90=Math.min(1,(G.tr90||0)+v);}
function feel90(dt){if(G.tr90>0){G.tr90=Math.max(0,G.tr90-1.5*dt);const k=(SET.shake===undefined?1:SET.shake)*(isMob()?.6:1);const a=9*G.tr90*G.tr90*k*(SET.lessFx?.5:1);if(a>G.shake)G.shake=a;}}
// --- первое знакомство: табличка на 4 с, первые атаки вполсилы ---
function seen90Tick(dt){const X=G.x90;if(!X)return;const S=G.save,L=S?(S.seen90||(S.seen90=[])):(X.seenL||(X.seenL=[]));
  for(const e of G.enemies){if(!e.alive||e.spawnT>0||!S90T.has(e.type)||e.type==='tide100'||e.type==='gclot95')continue;if(L.includes(e.type))continue;L.push(e.type);X.newT[e.type]=1;X.plq={k:e.type,t:0};snd90('plaque');if(G.state==='play')slow95(.5,.6);break;}
  if(X.tide&&(X.tide.warn||X.tide.band)&&!L.includes('tide100')){L.push('tide100');X.newT.tide100=1;X.plq={k:'tide100',t:0};}
  if(X.plq){if(!(banT>0&&X.plq.t<.01&&(X.plq.w96=(X.plq.w96||0)+dt)<2.8))X.plq.t+=dt;if(X.plq.t>4.4)X.plq=null;}}
const PLQ90={clot90:'Растворяется импульсом и зарядом. Не давайте растечься.',valve90:'Бейте на открытых тактах. На четвёртом — волна.',keeper90:'Не попадайтесь в конус. Сзади — урон ×2 и «тихо».',phago90:'Глотает обычные снаряды. Заряд и «Разрыв» — ×1,5.',
  neuron90:'Сеть ускоряет врагов. Рывок сквозь луч рвёт связь.',embryo90:'Разбейте до вылупления — иначе выйдет копия врага.',pass90:'Союзник. Не стреляйте в него.',eraser100:'Зона стирает ваши снаряды. Рывок сквозь Ластик оглушает.',
  hollow100:'Слушайте вдох — бросок с той стороны. Импульс проявляет.',witness100:'Доведите до края арены. Импульс даёт щит.',typo100:'Каждая — своя. Читайте подпись на борту.',fixer100:'Прерывайте ремонт попаданием или рывком.',
  echo100:'Ваш старый маршрут. Импульс стирает.',tide100:'Ищите проход в полосе или рывок насквозь.',noname100:'Не держите на нём прицел — он крепнет.'};
// --- полоса механики под шкалой сигнала (Тревога, Стирание, Обрывки) ---
let hud90K='',hud90On=null;
function hud90(){const X=G.x90;let I=typeof hud110==='function'?hud110():null;
  if(X&&inMission()&&G.state==='play'&&!(G.sb&&G.sb.alive&&is85(G.sb))){
    if(X.sec===8&&X.alarmOn){const k=X.alarmV/100;I={l:'ТРЕВОГА '+Math.round(X.alarm),k,col:alarmCol90(k),lc:alarmCol90(k),r:X.pods.length?'КАПСУЛЫ '+X.pods.filter(q=>q.st==='open'||q.st==='taken').length+'/'+X.pods.length:''};}
    else if(X.sec===8&&X.pods.length){I={l:'КАПСУЛЫ · ПОСТОЙТЕ РЯДОМ',k:null,lc:C90.ark,r:X.pods.filter(q=>q.st==='open').length+'/'+X.pods.length};}
    else if(X.sec===9&&X.er){const E=X.er,u=((E.t%30)+30)%30,ph=E.t<0?'СТИРАНИЕ ЧЕРЕЗ '+Math.ceil(-E.t):u<12?'СТИРАНИЕ НАСТУПАЕТ':u<18?'СТИРАНИЕ ДЕРЖИТ':'СТИРАНИЕ ОТСТУПАЕТ';const n=fragN100(X.sh?X.sh.frag:0);
      I={l:ph+(X.tide&&X.tide.warn?' · ПРИЛИВ!':''),k:E.t<0?0:erK100(E),col:C90.sh,lc:C90.sh,r:'ОБРЫВКИ '+n+'/12'};}}
  const show=!!I;let el=document.getElementById('x90G');
  if(!el){if(!show)return;const sb=document.getElementById('sigBar');if(!sb)return;
    if(!document.getElementById('x90css')){const st=document.createElement('style');st.id='x90css';st.textContent='#x90G{display:flex;align-items:center;gap:8px;margin-top:5px;font:700 11px "JetBrains Mono",monospace;letter-spacing:.06em;color:#c9d2de;min-height:14px;text-shadow:0 1px 0 #04060c}#x90G[hidden]{display:none}#x90G .l{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:70%}#x90G .g{flex:1;height:5px;border:1px solid #3a3a2a;position:relative;overflow:hidden;min-width:48px;background:rgba(0,0,0,.35)}#x90G .g i{position:absolute;inset:0;transform-origin:left;background:#ffd36b;transition:transform .15s,background-color .6s}#x90G.nog .g{display:none}#x90G .r{white-space:nowrap}@media (max-width:820px){#x90G{font-size:12px;gap:6px}}';document.head.appendChild(st);}
    el=document.createElement('div');el.id='x90G';el.innerHTML='<span class="l"></span><span class="g"><i></i></span><span class="r"></span>';sb.insertAdjacentElement('afterend',el);}
  if(!show){if(!el.hidden)el.hidden=true;hud90K='';return;}if(el.hidden)el.hidden=false;
  const key=I.l+'|'+(I.k===null?'-':I.k.toFixed(2))+'|'+I.r+'|'+I.col;if(key===hud90K)return;hud90K=key;
  el.querySelector('.l').textContent=I.l;el.querySelector('.l').style.color=I.lc||'';el.querySelector('.r').textContent=I.r||'';el.classList.toggle('nog',I.k===null);
  if(I.k!==null){const gi=el.querySelector('.g i');gi.style.transform='scaleX('+clamp(I.k,0,1).toFixed(3)+')';gi.style.background=I.col;}}
// ======================= РИСУНОК =======================
function ribbon90(f,t,on){const P=f.pts;if(!P)return;ctx.lineCap='round';ctx.lineJoin='round';
  ctx.beginPath();ctx.moveTo(P[0].x,P[0].y);for(let i=1;i<P.length;i++)ctx.lineTo(P[i].x,P[i].y);
  const pulse=.85+.15*beat90(t);ctx.strokeStyle=on?rgba90(C90.ark,.07*pulse):'rgba(120,110,100,.05)';ctx.lineWidth=f.w;ctx.stroke();
  ctx.strokeStyle=on?rgba90(C90.red,.10*pulse):'rgba(120,110,100,.06)';ctx.lineWidth=f.w*.45;ctx.stroke();
  const dir=f.rev95?-1:1,sp=(f.spd95||1);ctx.setLineDash(on?[14,22]:[4,14]);ctx.lineDashOffset=on?-t*110*dir*sp:0;ctx.strokeStyle=on?rgba90(C90.ark,.55):'rgba(160,150,140,.35)';ctx.lineWidth=2;ctx.stroke();
  ctx.setLineDash([3,30]);ctx.lineDashOffset=on?-t*160*dir*sp:0;ctx.strokeStyle=on?rgba90(C90.warm,.5):'rgba(0,0,0,0)';ctx.lineWidth=4;ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;ctx.lineCap='butt';}
function tornPath90(pts){ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);}
function erDraw100(X,t){const E=X.er;if(!E)return;const d=erD100(E),N=24;
  const side=(s)=>{const pts=[];if(d[s]<2)return null;for(let i=0;i<=N;i++){const u=i/N;if(s===0){const y=u*H;pts.push([d[0]+erJit100(0,y),y]);}else if(s===1){const y=u*H;pts.push([W-d[1]-erJit100(1,y),y]);}else if(s===2){const x=u*W;pts.push([x,d[2]+erJit100(2,x)]);}else{const x=u*W;pts.push([x,H-d[3]-erJit100(3,x)]);}}return pts;};
  for(let s=0;s<4;s++){const pts=side(s);if(!pts)continue;ctx.beginPath();if(s===0){ctx.moveTo(-20,-20);for(const q of pts)ctx.lineTo(q[0],q[1]);ctx.lineTo(-20,H+20);}else if(s===1){ctx.moveTo(W+20,-20);for(const q of pts)ctx.lineTo(q[0],q[1]);ctx.lineTo(W+20,H+20);}
      else if(s===2){ctx.moveTo(-20,-20);for(const q of pts)ctx.lineTo(q[0],q[1]);ctx.lineTo(W+20,-20);}else{ctx.moveTo(-20,H+20);for(const q of pts)ctx.lineTo(q[0],q[1]);ctx.lineTo(W+20,H+20);}ctx.closePath();
    ctx.fillStyle='rgba(3,6,7,.93)';ctx.fill();tornPath90(pts);ctx.strokeStyle=rgba90(C90.sh,.22);ctx.lineWidth=8;ctx.stroke();ctx.strokeStyle=rgba90(C90.sh,.85);ctx.lineWidth=1.6;ctx.stroke();
    if(SET.fx&&!G.lowFx&&Math.random()<.35){const q=pts[Math.random()*pts.length|0];part(q[0],q[1],rnd(-20,20),rnd(-40,-10),rnd(.5,1),C90.sh,1.6);}}
  if(E.tele>0){const D=E.D,w=E.t<0?E.w:E.wn;ctx.setLineDash([6,8]);ctx.lineDashOffset=-t*30;ctx.strokeStyle=rgba90(C90.sh,.25+.5*E.tele);ctx.lineWidth=1.5;ctx.beginPath();
    ctx.moveTo(D*w[0],0);ctx.lineTo(D*w[0],H);ctx.moveTo(W-D*w[1],0);ctx.lineTo(W-D*w[1],H);ctx.moveTo(0,D*w[2]);ctx.lineTo(W,D*w[2]);ctx.moveTo(0,H-D*w[3]);ctx.lineTo(W,H-D*w[3]);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;}}
function ezDraw100(Z,t){for(const z of Z){if(G.world&&!inView(z.x,z.y,z.r+20))continue;if(z.tele>0){const k=1-z.tele/(z.tele0||(z.tele0=z.tele));ctx.setLineDash([5,7]);ctx.lineDashOffset=-t*40;ctx.strokeStyle=rgba90(C90.sh,.35+.5*k);ctx.lineWidth=2;ctx.beginPath();ctx.arc(z.x,z.y,z.r*(.4+.6*k),0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;continue;}
    const a=Math.min(1,z.t*2);ctx.globalAlpha=a;ctx.beginPath();for(let i=0;i<=16;i++){const an=i/16*TAU,rr=z.r+5*Math.sin(an*3+t*2+z.x)+3*Math.sin(an*7-t);if(i)ctx.lineTo(z.x+Math.cos(an)*rr,z.y+Math.sin(an)*rr);else ctx.moveTo(z.x+Math.cos(an)*rr,z.y+Math.sin(an)*rr);}ctx.closePath();
    ctx.fillStyle='rgba(3,6,7,.9)';ctx.fill();ctx.strokeStyle=rgba90(C90.sh,.8);ctx.lineWidth=1.5;ctx.stroke();ctx.globalAlpha=1;}}
function tideDraw100(T,t){const B0=T.warn?T.warn.bands:null;
  if(B0)for(const B of B0){const a=.3+.3*Math.sin(t*12);ctx.save();ctx.translate(B.dx*B.s0,B.dy*B.s0);ctx.rotate(Math.atan2(B.dy,B.dx));ctx.fillStyle=rgba90(C90.sh,a*.35);ctx.fillRect(0,B.u0,18,B.u1-B.u0);ctx.fillStyle='#ffffff';ctx.fillRect(0,B.c-B.gw/2,18,B.gw);ctx.restore();
    const gx=B.dx*(B.s0+40)+B.nx*B.c,gy=B.dy*(B.s0+40)+B.ny*B.c;worldLabel(clamp(gx,90,W-90),clamp(gy,30,H-30),'ПРОХОД',C90.sh);}
  const L=T.bands;if(!L)return;for(const B of L){if(B.pos>B.full)continue;ctx.save();ctx.translate(B.dx*B.s0,B.dy*B.s0);ctx.rotate(Math.atan2(B.dy,B.dx));const x0=B.pos-B.th,w=B.th;ctx.fillStyle='rgba(4,10,10,.88)';ctx.strokeStyle=rgba90(C90.sh,.9);ctx.lineWidth=2;
    const segs=[[B.u0-40,B.c-B.gw/2],[B.c+B.gw/2,B.u1+40]];for(const [y0,y1] of segs){if(y1<=y0)continue;ctx.fillRect(x0,y0,w,y1-y0);ctx.strokeRect(x0,y0,w,y1-y0);ctx.globalAlpha=.25;for(let i=1;i<5;i++){const xx=x0+w*i/5+4*Math.sin(t*3+i);ctx.beginPath();ctx.moveTo(xx,y0);ctx.lineTo(xx,y1);ctx.stroke();}ctx.globalAlpha=1;}
    ctx.restore();}}
function shadDraw100(X,t){for(const q of X.shad){const tk=clamp(q.t/q.tele,0,1),a=q.t<q.tele?.25+.45*tk:.8;
    if(q.k==='lek'){ctx.fillStyle=rgba90(q.col,q.t<q.tele?.08+.12*tk:.35);ctx.fillRect(q.x-q.w/2,0,q.w,H);ctx.strokeStyle=rgba90(q.col,a);ctx.setLineDash([8,8]);ctx.strokeRect(q.x-q.w/2,0,q.w,H);ctx.setLineDash([]);}
    else if(q.k==='well'||q.k==='heart'){if(q.t<q.tele){ctx.strokeStyle=rgba90(q.col,a);ctx.setLineDash([4,6]);ctx.beginPath();ctx.arc(q.x,q.y,30+20*tk,0,TAU);ctx.stroke();ctx.setLineDash([]);}
      else{ctx.strokeStyle=rgba90(q.col,.75);ctx.lineWidth=12;if(q.gaps){for(let i=0;i<2;i++){const g0=q.gaps[i]+.3,g1=q.gaps[(i+1)%2]-.3+(i?TAU:0);ctx.beginPath();ctx.arc(q.x,q.y,q.R,g0,g1>g0?g1:g1+TAU);ctx.stroke();}}else{ctx.beginPath();ctx.arc(q.x,q.y,q.R,0,TAU);ctx.stroke();}ctx.lineWidth=2;}}
    else if(q.k==='flag'){ctx.strokeStyle=rgba90(q.col,a);ctx.setLineDash([4,8]);const p=G.player,a0=Math.atan2(p.y-q.y,p.x-q.x);ctx.beginPath();for(let i=-4;i<=4;i+=2){ctx.moveTo(q.x,q.y+30);ctx.lineTo(q.x+Math.cos(a0+i*.12)*500,q.y+30+Math.sin(a0+i*.12)*500);}ctx.stroke();ctx.setLineDash([]);}
    if(q.t<q.tele+.2){const top=G.sb&&G.sb.sbk==='shore'&&G.sb.alive?G.sb.hzF*H+40:130;worldLabel(clamp(q.x||W/2,90,W-90),q.k==='flag'||q.k==='lek'?top:(q.y||H/2)-44,'ТЕНЬ · '+q.name,q.col);}}}
function under90(t){const X=G.x90;
  if(G.world){if(G.wez100&&G.wez100.length)ezDraw100(G.wez100,t);if(G.wn90)beams90(G.wn90,t);return;}
  if(!X||!inMission())return;
  if(X.sec===8){for(const f of X.flows)ribbon90(f,t,!(f.shut>0)&&!f.closed);
    for(const q of X.pud){const a=Math.min(1,q.t,(q.t0-q.t)*3),rr=q.r+3*Math.sin(t*3+q.x);rgDraw95(q.x,q.y,rr*1.08,'#5a0a16',.85*a,0,[.78,.7*a]);ctx.strokeStyle=rgba90('#ff6f86',.35*a);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(q.x,q.y,rr*.92,Math.PI*1.1,Math.PI*1.6);ctx.stroke();
      if(q.bub)for(const b of q.bub){const k=b.t/.9;if(k>=1)continue;ctx.strokeStyle=rgba90('#ff9aa8',.5*(1-k)*a);ctx.lineWidth=1;ctx.beginPath();ctx.arc(q.x+Math.cos(b.a)*b.d,q.y+Math.sin(b.a)*b.d,2+3*k,0,TAU);ctx.stroke();}}
    for(const q of X.pods)podDraw90(q,t);}
  if(X.nets.length)beams90(X.nets,t);
  for(const e of G.enemies){if(!e.alive||e.spawnT>0)continue;if(e.type==='keeper90'&&e.st!=='alert'){const c=e.see>0?mix90('#ffe9b0','#d8364a',e.see/.6):'#ffe9b0';ctx.fillStyle=rgba90(c,.08+.12*(e.see/.6));ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.arc(e.x,e.y,240,(e.fa||0)-35*Math.PI/180,(e.fa||0)+35*Math.PI/180);ctx.closePath();ctx.fill();ctx.strokeStyle=rgba90(c,.25);ctx.lineWidth=1;ctx.stroke();}}
  if(X.sec===9){erDraw100(X,t);ezDraw100(X.ez,t);if(X.tide)tideDraw100(X.tide,t);}
  if(typeof under95==='function')under95(t);}
function beams90(N,t){for(const n of N)for(const q of n.beams){if(!q.a.alive||!q.b.alive)continue;const cut=q.cut>0;ctx.strokeStyle=cut?'rgba(160,140,90,.25)':rgba90('#ffe47a',.55+.25*Math.sin(t*8+q.a.uid));ctx.lineWidth=cut?1:2;if(cut)ctx.setLineDash([3,7]);
    ctx.beginPath();ctx.moveTo(q.a.x,q.a.y);const mx=(q.a.x+q.b.x)/2+Math.sin(t*3+q.a.uid)*8,my=(q.a.y+q.b.y)/2+Math.cos(t*3+q.b.uid)*8;ctx.quadraticCurveTo(mx,my,q.b.x,q.b.y);ctx.stroke();ctx.setLineDash([]);
    if(!cut&&SET.fx){const k=(t*.8+q.a.uid*.13)%1;const x=(1-k)*(1-k)*q.a.x+2*(1-k)*k*mx+k*k*q.b.x,y=(1-k)*(1-k)*q.a.y+2*(1-k)*k*my+k*k*q.b.y;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(x,y,2,0,TAU);ctx.fill();}}}
function podDraw90(q,t){ctx.save();ctx.translate(q.x,q.y);const op=q.st==='open'||q.st==='taken',lost=q.st==='lost';
  glow(0,0,46,lost?'#5a4048':op?C90.pil:C90.ark,lost?.15:.22+.08*Math.sin(t*1.2+q.x));
  ctx.fillStyle='#120a0c';ctx.strokeStyle=lost?'#6a4a52':op?C90.pil:C90.ark;ctx.lineWidth=2;const w=q.child?18:24,h=q.child?32:44;
  ctx.beginPath();ctx.roundRect?ctx.roundRect(-w/2,-h/2,w,h,w/2):ctx.rect(-w/2,-h/2,w,h);ctx.fill();ctx.stroke();
  if(!op&&!lost){ctx.globalAlpha=.55+.2*Math.sin(t*.9+q.y);ctx.fillStyle=C90.pil;ctx.beginPath();ctx.arc(0,-h*.22,w*.18,0,TAU);ctx.fill();ctx.fillRect(-w*.16,-h*.1,w*.32,h*.42);ctx.globalAlpha=1;
    ctx.strokeStyle=rgba90(C90.ark,.35);ctx.beginPath();ctx.moveTo(-w/2+3,0);ctx.lineTo(w/2-3,0);ctx.stroke();}
  else if(op){ctx.strokeStyle=rgba90(C90.pil,.6);ctx.beginPath();ctx.moveTo(-w/2,-h/2);ctx.lineTo(-w*.9,-h*.75);ctx.moveTo(w/2,-h/2);ctx.lineTo(w*.9,-h*.75);ctx.stroke();}
  if(q.ch>0){ctx.strokeStyle='#ffffff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,h*.75,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,q.ch/(storyFlag('well38')==='silence'?2:1.5)));ctx.stroke();}
  if(q.kch>0){ctx.strokeStyle=C90.red;ctx.lineWidth=3;ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(0,0,h*.75+6,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,q.kch/3));ctx.stroke();ctx.setLineDash([]);}
  ctx.restore();const p=G.player;if(p&&!op&&!lost&&Math.hypot(p.x-q.x,p.y-q.y)<220)worldLabel(q.x,q.y-40,q.child?'ДЕТСКАЯ КАПСУЛА':'КАПСУЛА · СПИТ',q.kch>0?C90.red:C90.ark);}
function draw90(t){const X=G.x90;if(!X||!inMission())return;const p=G.player;
  for(const L of X.locks){const warn=L.st==='warn',cl=L.st==='closed',col=cl?C90.red:warn?(Math.sin(t*14)>0?'#ffffff':C90.ark):C90.ark,P_=L.pos,top=L.door-90,bot=L.door+90,len=L.len;
    ctx.save();if(L.hz)ctx.transform(0,1,1,0,0,0);
    ctx.fillStyle='rgba(30,10,12,.85)';ctx.strokeStyle=col;ctx.lineWidth=2;ctx.fillRect(P_-12,0,24,top);ctx.strokeRect(P_-12,-2,24,top+2);ctx.fillRect(P_-12,bot,24,len-bot);ctx.strokeRect(P_-12,bot,24,len-bot+2);
    for(let y=20;y<top;y+=36){ctx.beginPath();ctx.moveTo(P_-12,y);ctx.lineTo(P_+12,y+12);ctx.stroke();}for(let y=bot+20;y<len;y+=36){ctx.beginPath();ctx.moveTo(P_-12,y);ctx.lineTo(P_+12,y+12);ctx.stroke();}
    if(cl){ctx.fillStyle='rgba(216,54,74,.35)';ctx.fillRect(P_-10,top,20,bot-top);ctx.strokeRect(P_-10,top,20,bot-top);}else{ctx.globalAlpha=warn?.6:.25;ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(P_,top);ctx.lineTo(P_,bot);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}
    ctx.restore();if(warn||cl)worldLabel(L.hz?L.x:L.x,L.hz?L.dy-24:top-14,cl?'ШЛЮЗ ЗАКРЫТ':'ЗАКРЫВАЕТСЯ',col);}
  for(const e of G.enemies){if(!e.alive||e.spawnT>0)continue;
    if(e.type==='fixer100'&&e.fx&&e.fx.alive){const T=e.fx,near=Math.hypot(T.x-e.x,T.y-e.y)<=225;ctx.strokeStyle=rgba90(C90.sh,near?.8:.25);ctx.lineWidth=near?3:1;ctx.setLineDash(near?[]:[3,6]);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(T.x,T.y);ctx.stroke();ctx.setLineDash([]);
      if(near){ctx.strokeStyle='#ffffff';ctx.beginPath();ctx.arc(T.x,T.y,T.r+8,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,e.fxT/1.5));ctx.stroke();}}
    if(e.type==='valve90'&&e.vi===2&&e.gap95){const k=clamp(e.vb/1.2,0,1);ctx.strokeStyle=rgba90(C90.ark,.25+.5*k);ctx.lineWidth=e.tele90?2.5:1.5;ctx.setLineDash([5,5]);const G2=e.gap95.slice().sort((a,c)=>a.a-c.a);for(let i=0;i<G2.length;i++){const a0=G2[i].a+G2[i].w/2,n=G2[(i+1)%G2.length],a1=n.a-n.w/2+(i===G2.length-1?TAU:0);ctx.beginPath();ctx.arc(e.x,e.y,110,a0,a1>a0?a1:a1+TAU);ctx.stroke();}ctx.setLineDash([]);gapArrows95(e.x,e.y,118,e.gap95,k,'#ffffff');}
    if(e.type==='hollow100'&&e.inh&&p){ctx.strokeStyle=rgba90('#cfe8e0',.3);ctx.setLineDash([2,6]);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.setLineDash([]);}
    if(e.type==='typo100'&&e.tpName&&p){const d_=Math.hypot(p.x-e.x,p.y-e.y);if(d_<380&&(d_>95||e.glitch95>0)){ctx.font='700 '+fpx(11)+'px "JetBrains Mono",monospace';const tw=ctx.measureText(e.tpName).width/2+4;worldLabel(clamp(e.x,tw,W-tw),e.y-e.r-12,e.tpName,'#b8ffe0');}}
    if(e.type==='witness100'){worldLabel(e.x,e.y-e.r-14,'СВИДЕТЕЛЬ','#ffffff');if(e.sh100>0){ctx.strokeStyle='#ffffff';ctx.globalAlpha=.6;ctx.beginPath();ctx.arc(e.x,e.y,e.r+8,0,TAU);ctx.stroke();ctx.globalAlpha=1;}}
    if(e.type==='pass90'){worldLabel(e.x,e.y-e.r-14,e.hostT>0?'ПАССАЖИР · НЕ УЗНАЁТ':'ПАССАЖИР · '+Math.ceil(e.life90||0),e.hostT>0?C90.red:C90.pil);}
    if(e.type==='embryo90'&&e.hatch>0&&e.hatch<5)worldLabel(e.x,e.y-e.r-12,fmt85(e.hatch),'#ff9fb0');
    if(e.type==='keeper90'&&e.st==='wake')worldLabel(e.x,e.y-e.r-14,'БУДИТ СПЯЩЕГО',C90.red);}
  if(X.sec===9&&X.shad.length)shadDraw100(X,t);
  if(typeof draw95==='function')draw95(t);}
// --- поверх маски: таблички, зерно, сердцебиение без шкалы ---
let grain90=null;
function grainPat90(){if(grain90)return grain90;const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),im=g.createImageData(128,128);for(let i=0;i<im.data.length;i+=4){const v=Math.random()*255|0;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=Math.random()<.5?255:0;}g.putImageData(im,0,0);grain90=ctx.createPattern(c,'repeat');return grain90;}
function top90(t){const X=G.x90;if(!X||!inMission())return;const p=G.player;
  ctx.save();ctx.setTransform(1,0,0,1,0,0);const w=cv.width,h=cv.height;
  if(X.sec===9&&SET.fx&&!G.lowFx&&!isMob()&&G.q>=2){ctx.globalAlpha=.07;ctx.fillStyle=grainPat90();ctx.translate(Math.random()*128|0,Math.random()*128|0);ctx.fillRect(-128,-128,w+256,h+256);ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;}
  ctx.restore();
  if(X.hud&&X.hud.cur==='hp'||X.hudAll){if(p&&p.hp/G.st.maxHp<.35){const k=beat90(t*1.6);vig95('#d8364a',.12+.3*k,.3);}}
  if(X.plq){const q=X.plq,d=EDEF[q.k];if(d){const a=clamp(Math.min(q.t*4,(4.4-q.t)*3),0,1),sp=q.t<.35?1+.08*Math.sin(q.t/.35*Math.PI):1;const cx=CX+VW/2,cy=CY+(VH>VW*1.15?VH*.3:isMob()?VH*.4:Math.min(VH*.22,160));
      ctx.save();ctx.globalAlpha=a;ctx.translate(cx,cy);ctx.scale(sp,sp);const nm=d.name.toUpperCase(),tx=PLQ95[q.k]||PLQ90[q.k]||'';ctx.font='500 '+fpx(11)+'px "JetBrains Mono",monospace';const tw=Math.max(ctx.measureText(tx).width,200);
      const ic=fpx(40),bw=Math.min(VW-24,tw+ic+48),bh=fpx(48);ctx.fillStyle='rgba(6,8,12,.88)';ctx.strokeStyle=d.col;ctx.lineWidth=1.5;ctx.fillRect(-bw/2,-bh/2,bw,bh);ctx.strokeRect(-bw/2,-bh/2,bw,bh);ctx.fillStyle=d.col;ctx.fillRect(-bw/2,-bh/2,3,bh);
      // анимированная иконка врага слева
      {const f={type:q.k,x:0,y:0,vx:Math.cos(q.t*2)*60,vy:Math.sin(q.t*2)*60,r:Math.min(EDEF[q.k].r,16),t:q.t,seed:1,alive:true,flash:0,spawnT:0,hp:1,maxHp:1,fa:q.t,fa95:q.t*.8,dir:1,look:2,vi:Math.floor(q.t*2)%4,fed:3,hatch:5,hatch0:15,tp:{mv:'ram',gun:'fan3',hab:'armor'},tpN:['','',''],pul95:.5+.5*Math.sin(q.t*6),tl95:Math.sin(q.t*4)>.3?1:0};
        ctx.save();ctx.translate(-bw/2+ic/2+10,0);const s2=ic/(Math.max(24,f.r*2.6));ctx.scale(s2,s2);try{drawEnemy(f,performance.now()/1000,true);}catch(err){}ctx.restore();}
      ctx.textAlign='left';ctx.textBaseline='middle';const x0=-bw/2+ic+20;ctx.font='700 '+fpx(12)+'px "JetBrains Mono",monospace';ctx.fillStyle=d.col;ctx.fillText('НОВОЕ · '+nm,x0,-bh*.2);ctx.font='500 '+fpx(10.5)+'px "JetBrains Mono",monospace';ctx.fillStyle='#c9d2de';
      let s=tx;const mw=bw-(x0+bw/2)-10;while(s.length>8&&ctx.measureText(s).width>mw)s=s.slice(0,-2);if(s!==tx)s=s.slice(0,-1)+'…';ctx.fillText(s,x0,bh*.22);ctx.restore();ctx.textAlign='left';ctx.textBaseline='alphabetic';}}
  if(typeof top95==='function')top95(t);}
// --- рисунки сущностей ---
function drawE90(e,t,icon,col,face,alpha,P){const r=e.r;
  if(e.hid90&&!icon){alpha*=.22+(e.inh?.25:0);ctx.globalAlpha=alpha;}
  if(e.mem100&&!icon){ctx.globalAlpha=alpha*.8;}
  switch(e.type){
    case 'clot90':{const big=e.big95,air=!icon&&e.cs==='air',hz=air?e.hz95||0:0,sq=!icon&&e.cs==='squat'?(e.sq95||0):0;if(air){ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(0,0,r*1.1,r*.5,0,0,TAU);ctx.fill();ctx.translate(0,-hz);}ctx.scale(1+.25*sq,1-.2*sq);
      ctx.fillStyle=big?'#4a0c16':'#3a0a12';ctx.beginPath();for(let i=0;i<=18;i++){const a=i/18*TAU,rr=r*(1+.12*Math.sin(a*3+t*2.4+e.seed)+.06*Math.sin(a*5-t*3));if(i)ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);else ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle=rgba90(C90.blood,.6);for(let i=0;i<(big?5:3);i++){const a=e.seed+i*2.1+t*.3;ctx.beginPath();ctx.arc(Math.cos(a)*r*.4,Math.sin(a)*r*.4,r*.18,0,TAU);ctx.fill();}if(sq>0){ctx.strokeStyle=rgba90(C95.dash,.5+.5*sq);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,r+5,0,TAU);ctx.stroke();}break;}
    case 'valve90':{const open=icon?1:e.vi===3?0:e.vi===2?.6:1,a0=open*.9;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle=e.vi===3?C90.red:e.tele90?'#ffffff':col;
      for(const s of [-1,1]){ctx.save();ctx.rotate(s*a0*.5);ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r*.8,s<0?Math.PI*.55:-Math.PI*.45,s<0?Math.PI*1.45:Math.PI*.45);ctx.closePath();ctx.globalAlpha=alpha*(.35+.4*(1-open));ctx.fill();ctx.globalAlpha=alpha;ctx.stroke();ctx.restore();}
      if(!icon){ctx.fillStyle=col;for(let i=0;i<4;i++){ctx.globalAlpha=alpha*(i===e.vi?1:.25);ctx.beginPath();ctx.arc(-9+i*6,r+7,2,0,TAU);ctx.fill();}ctx.globalAlpha=alpha;}break;}
    case 'keeper90':{const a=icon?0:(e.fa||0);ctx.rotate(a);ctx.beginPath();ctx.ellipse(0,0,r*1.2,r*.75,0,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle=e.st==='alert'?C90.red:'#fff6d8';ctx.beginPath();ctx.arc(r*.75,0,r*.28,0,TAU);ctx.fill();
      if(!icon&&e.st!=='alert')glow(r*.75,0,12,'#fff6d8',.5);ctx.strokeStyle=col;ctx.beginPath();ctx.moveTo(-r*1.2,0);ctx.lineTo(-r*1.7,-r*.4);ctx.moveTo(-r*1.2,0);ctx.lineTo(-r*1.7,r*.4);ctx.stroke();break;}
    case 'phago90':{const bu=e.burst90>0||!!e.spir95,fed=icon?3:Math.min(10,e.fed||0),red=fed/10;ctx.fillStyle=bu&&Math.sin(t*40)>0?'#ffffff':mix90('#2a120a','#5a0a14',red);ctx.strokeStyle=e.flash>0?'#ffffff':mix90(col,'#ff4f6e',red);ctx.beginPath();for(let i=0;i<=20;i++){const a=i/20*TAU,rr=r*(1+.15*Math.sin(a*4+t*3+e.seed)+(e.lg95?.12*Math.max(0,Math.cos(a-(e.lg95.a-face))):0));if(i)ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);else ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.stroke();
      const sc=icon?'#ffd36b':shipCol();ctx.strokeStyle=sc;ctx.lineWidth=2;for(let i=0;i<fed;i++){const q=e.eat95&&e.eat95[i],a=(q?q.a:i*2.4)+t*(1.2+i*.07),d=r*(q?q.d:.5);ctx.save();ctx.translate(Math.cos(a)*d,Math.sin(a)*d);ctx.rotate(a+t*3);ctx.beginPath();ctx.moveTo(-3,0);ctx.lineTo(3,0);ctx.stroke();ctx.restore();}
      ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,r*.28,0,TAU);ctx.globalAlpha=alpha*.7;ctx.fill();ctx.globalAlpha=alpha;if(!icon&&e.nos95>0){ctx.strokeStyle=rgba90('#ffffff',.6);ctx.setLineDash([3,4]);ctx.beginPath();ctx.arc(0,0,r+5,0,TAU);ctx.stroke();ctx.setLineDash([]);}break;}
    case 'neuron90':{ctx.rotate(e.seed);ctx.beginPath();for(let i=0;i<5;i++){const a=i/5*TAU;ctx.moveTo(Math.cos(a)*r*.5,Math.sin(a)*r*.5);ctx.lineTo(Math.cos(a+.2)*r*1.4,Math.sin(a+.2)*r*1.4);}ctx.stroke();ctx.beginPath();ctx.arc(0,0,r*.7,0,TAU);ctx.fill();ctx.stroke();
      ctx.fillStyle=col;ctx.globalAlpha=alpha*(.5+.4*Math.sin(t*6+e.seed));ctx.beginPath();ctx.arc(0,0,r*.35,0,TAU);ctx.fill();ctx.globalAlpha=alpha;
      if(e.weak90&&!icon){ctx.rotate(-e.seed+t);ctx.strokeStyle='#ffffff';ctx.setLineDash([4,5]);ctx.beginPath();ctx.arc(0,0,r+8,0,TAU);ctx.stroke();ctx.setLineDash([]);}break;}
    case 'embryo90':{const k=icon?.5:1-clamp((e.hatch||0)/(e.hatch0||15),0,1),pr=1+.06*Math.sin(t*(3+k*14));ctx.scale(pr,pr);ctx.fillStyle=rgba90('#ff9fb0',.15+.2*k);ctx.beginPath();ctx.ellipse(0,0,r,r*1.2,0,0,TAU);ctx.fill();ctx.stroke();
      if(!icon&&e.hTy&&EDEF[e.hTy]){ctx.save();ctx.globalAlpha=alpha*(.25+.35*(1-clamp(e.hatch/3,0,1)));const f={type:e.hTy,x:0,y:0,vx:0,vy:0,r:Math.min(EDEF[e.hTy].r,r*.8),t:e.t,seed:e.seed,alive:true,flash:0,spawnT:0,hp:1,maxHp:1,fa:0,dir:1};ctx.scale(.7,.7);try{drawEnemy(f,t,true);}catch(err){}ctx.restore();}
      else{ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,r*.1,r*.45*(.6+.4*k),.4+t*.5,4.6+t*.5);ctx.stroke();}if(!icon){ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r+5,-Math.PI/2,-Math.PI/2+TAU*k);ctx.stroke();}break;}
    case 'pass90':{if(!icon){ctx.strokeStyle=e.hostT>0?C90.red:'#6bb8ff';ctx.lineWidth=2;ctx.globalAlpha=alpha*(.55+.25*Math.sin(t*4));ctx.beginPath();ctx.arc(0,0,r+9,0,TAU);ctx.stroke();ctx.globalAlpha=alpha;}ctx.rotate(icon?-Math.PI/2:(e.face90!==undefined?e.face90:face));ctx.fillStyle='#141a28';ctx.strokeStyle=e.hostT>0?C90.red:col;shipPath85(.75);ctx.fill();ctx.stroke();ctx.fillStyle='#6bb8ff';ctx.beginPath();ctx.arc(2,0,2.5,0,TAU);ctx.fill();break;}
    case 'heart90':{if(icon){ctx.scale(.45,.45);heartBody95(0,0,52,1,t,0,0,0,0);break;}const b=G.sb===e?e:null;if(b&&b.fx85&&b.fx85.kind==='stop'&&b.fx85.t>1.2){ctx.globalAlpha=alpha*Math.max(.25,1-(b.fx85.t-1.2)*.4);}
      const sq=b?systole95(b):0,sw=b&&b.swell>0?.3*Math.sin(Math.min(1,b.swell/.6)*Math.PI):0;heartBody95(0,0,e.r,b?1-.13*sq+sw:1,t,b?b.openK||0:0,e.flash,b?b.crack||0:0,b&&b.flashC95>0?b.flashC95:0);if(b&&b.flashC95>0)b.flashC95-=VDT74;/* ARCH·75 A-22 */break;}
    case 'hvalve90':{const b=e.host85,a=b&&b.ves?b.ves[e.vi].a:0;ctx.rotate(a);ctx.fillStyle='#2a1608';ctx.beginPath();ctx.moveTo(-r*.8,-r);ctx.quadraticCurveTo(r*1.3,-r*.6,r*.9,0);ctx.quadraticCurveTo(r*1.3,r*.6,-r*.8,r);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-r*.4,0);ctx.lineTo(r*.6,0);ctx.stroke();break;}
    case 'hkey90':{if(!icon){alpha=e.spawnT>0?Math.max(0,1-e.spawnT):1;ctx.globalAlpha=alpha;}const b=e.host85,hi=b&&b.keys&&b.keys[b.keyI]===e&&!(b.launch>0),lit=e.lit90,win=b&&heartNear(b)<=heartWin(b);ctx.fillStyle=lit?rgba90(C90.ark,.5):'#140a06';ctx.strokeStyle=hi?(win?'#ffffff':C90.warm):lit?C90.ark:'#6a5a3a';ctx.lineWidth=hi?3:2;
      ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.stroke();if(hi&&!icon){glow(0,0,r*2,win?'#ffffff':C90.ark,win?.6:.25);const k=b?1-clamp(b.bt/b.btN,0,1):0;ctx.globalAlpha=alpha*.7;ctx.beginPath();ctx.arc(0,0,r+6+36*k,0,TAU);ctx.stroke();ctx.globalAlpha=alpha;}
      ctx.fillStyle=hi?'#ffffff':lit?C90.ark:'#8a7a5a';ctx.font='700 '+Math.round(r*.7)+'px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(['I','II','III','IV'][e.ki||0],0,1);ctx.textAlign='left';ctx.textBaseline='alphabetic';break;}
    case 'thromb90':{ctx.fillStyle='#3a0a12';ctx.beginPath();for(let i=0;i<=14;i++){const a=i/14*TAU,rr=r*(1+.18*Math.sin(a*3+t*4));if(i)ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);else ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.stroke();
      if(!icon&&e.thrT!==undefined){ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r+6,-Math.PI/2,-Math.PI/2+TAU*clamp(e.thrT/8,0,1));ctx.stroke();}break;}
    case 'eraser100':{ctx.rotate(e.t*.6);ctx.fillRect(-r*.8,-r*.5,r*1.6,r);ctx.strokeRect(-r*.8,-r*.5,r*1.6,r);ctx.fillStyle=col;ctx.globalAlpha=alpha*.5;ctx.fillRect(-r*.8,-r*.5,r*.5,r);ctx.globalAlpha=alpha;if(e.stun>0&&!icon){ctx.rotate(-e.t*.6);worldLabel(0,-r-10,'ОГЛУШЁН',col);}break;}
    case 'hollow100':{if(!icon&&SET.fx){ctx.save();ctx.globalAlpha=Math.min(1,alpha*1.6);ctx.strokeStyle=rgba90('#cfe8e0',.5);ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<=12;i++){const a=i/12*TAU,rr=r*1.35+3*Math.sin(a*5+t*14+e.seed);if(i)ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);else ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.stroke();ctx.restore();}
      ctx.rotate(face);ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(r*1.1,0);ctx.lineTo(-r*.8,-r*.8);ctx.lineTo(-r*.4,0);ctx.lineTo(-r*.8,r*.8);ctx.closePath();ctx.stroke();ctx.setLineDash([]);if(e.ls==='zig'||e.ls==='go'){ctx.fillStyle=rgba90(col,.3);ctx.fill();}
      if(!icon&&(e.inh||e.ls==='zig')){ctx.globalAlpha=1;ctx.fillStyle='#ff2e4a';for(const s of [-1,1]){ctx.beginPath();ctx.arc(r*.35,s*r*.28,2.6,0,TAU);ctx.fill();}glow(r*.3,0,14,'#ff2e4a',.7);}break;}
    case 'witness100':{ctx.rotate(face);ctx.fillStyle='#10161a';shipPath85(.75);ctx.fill();ctx.stroke();ctx.fillStyle='#ffffff';ctx.globalAlpha=alpha*(.6+.4*Math.sin(t*5));ctx.beginPath();ctx.arc(-4,0,3,0,TAU);ctx.fill();ctx.globalAlpha=alpha;break;}
    case 'typo100':{const gl=!icon&&e.glitch95>0,g=icon?0:gl?rnd(-4,4):Math.sin(t*23+e.seed)>.85?rnd(-3,3):0;ctx.translate(g,0);ctx.rotate(face);const tp=e.tp||{mv:'ram',gun:'single',hab:'armor'};
      // крылья — от привычки, нос — от хода, орудие — от оружия
      ctx.fillStyle=gl?'#1a3a30':'#0a1a16';ctx.beginPath();if(tp.hab==='armor'||tp.hab==='mirror'){ctx.rect(-r*.8,-r*.95,r*.7,r*1.9);}else if(tp.hab==='fast'||tp.hab==='fade'){ctx.moveTo(-r*.2,-r*.4);ctx.lineTo(-r*1.1,-r*1.05);ctx.lineTo(-r*.7,0);ctx.lineTo(-r*1.1,r*1.05);ctx.lineTo(-r*.2,r*.4);}else if(tp.hab==='split'||tp.hab==='twin'){for(const s of [-1,1]){ctx.moveTo(-r*.1,s*r*.3);ctx.lineTo(-r*.9,s*r*.95);ctx.lineTo(-r*.5,s*r*.2);}}else{ctx.ellipse(-r*.45,0,r*.5,r*.85,0,0,TAU);}ctx.fill();ctx.stroke();
      ctx.fillStyle='#0a1a16';ctx.beginPath();if(tp.mv==='ram'||tp.mv==='jink'){ctx.moveTo(r*1.25,0);ctx.lineTo(-r*.1,-r*.45);ctx.lineTo(-r*.1,r*.45);}else if(tp.mv==='orbit'||tp.mv==='spiral'){ctx.arc(r*.25,0,r*.55,0,TAU);}else if(tp.mv==='blink'){ctx.moveTo(r,0);ctx.lineTo(r*.2,-r*.6);ctx.lineTo(-r*.2,0);ctx.lineTo(r*.2,r*.6);}else{ctx.moveTo(r*.95,0);ctx.lineTo(0,-r*.55);ctx.lineTo(-r*.25,0);ctx.lineTo(0,r*.55);}ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle=gl?'#ffffff':'#b8ffe0';ctx.lineWidth=2.5;ctx.beginPath();if(tp.gun==='fan3'||tp.gun==='ring'){for(const s of [-1,0,1]){ctx.moveTo(r*.2,s*r*.3);ctx.lineTo(r*.75,s*r*.45);}}else if(tp.gun==='lance'){ctx.moveTo(0,0);ctx.lineTo(r*1.5,0);}else if(tp.gun==='mine'||tp.gun==='boom'){ctx.arc(r*.3,0,r*.25,0,TAU);}else if(tp.gun==='orb'){ctx.arc(0,0,r*1.15,0,TAU);}else if(tp.gun!=='none'){ctx.moveTo(r*.2,0);ctx.lineTo(r*.9,0);}ctx.stroke();ctx.lineWidth=2;
      if(!icon&&e.orb95){const O=e.orb95;ctx.rotate(-face);for(let i=0;i<O.n;i++){const q=O.a+i*TAU/3;ctx.fillStyle='#b8ffe0';ctx.beginPath();ctx.arc(Math.cos(q)*30,Math.sin(q)*30,4.5,0,TAU);ctx.fill();}}
      if(e.fade100&&!icon)ctx.globalAlpha=alpha*.4;break;}
    case 'fixer100':{ctx.rotate(face);ctx.beginPath();ctx.arc(0,0,r*.8,0,TAU);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-r*.5,0);ctx.lineTo(r*.5,0);ctx.moveTo(0,-r*.5);ctx.lineTo(0,r*.5);ctx.stroke();ctx.beginPath();ctx.moveTo(r*.8,0);ctx.lineTo(r*1.4,0);ctx.stroke();break;}
    case 'echo100':{ctx.rotate(icon?-Math.PI/2:(e.face||0));ctx.globalAlpha=alpha*(.45+.2*Math.sin(t*7));ctx.strokeStyle='#e0fff4';ctx.lineWidth=1.5;ctx.setLineDash([4,3]);shipPath85(1);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=alpha;break;}
    case 'tide100':{ctx.fillStyle='rgba(4,10,10,.9)';ctx.fillRect(-r,-r*.4,r*2,r*.8);ctx.strokeRect(-r,-r*.4,r*2,r*.8);ctx.clearRect(-r*.2,-r*.4,r*.4,r*.8);break;}
    case 'noname100':{const L=e.look||0;ctx.rotate(face);ctx.beginPath();for(let i=0;i<7;i++){const a=i/7*TAU;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle=L>3?'#ffffff':col;ctx.globalAlpha=alpha*(.3+.14*L);ctx.beginPath();ctx.ellipse(0,0,r*.55,r*.22*(.4+.12*L),0,0,TAU);ctx.fill();ctx.globalAlpha=alpha;if(L>0&&!icon){ctx.strokeStyle='#ffffff';ctx.globalAlpha=alpha*Math.min(.8,L*.16);ctx.beginPath();ctx.arc(0,0,r+6,0,TAU);ctx.stroke();ctx.globalAlpha=alpha;}break;}
    case 'shore100':{if(icon){ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=8;i++){const x=-20+i*5,y=Math.sin(i*1.3)*4;if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);}ctx.stroke();}break;}
    default:return typeof drawE95==='function'?drawE95(e,t,icon,col,face,alpha,P):false;}
  return true;}
// --- Сердце: камера, сосуды, волны, метроном ---
// --- Берег: пустота над горизонтом ---
