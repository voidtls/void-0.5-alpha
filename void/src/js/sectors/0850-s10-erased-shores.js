// ===== 0.9 → 0.9.5: сектор X «Стёртые берега» — стирание, интерфейс, память, Свидетели, Прилив, враги =====
function ez100(){const X=G.x90;if(X&&inMission())return X.ez;return G.wez100||(G.wez100=[]);}
function sh100(){const S=G.save;if(!S||!S.story)return {frag:0,lostFrag:0};return S.story.shore||(S.story.shore={frag:0,lostFrag:0});}
function fragN100(v){let n=0;for(let i=0;i<12;i++)if(v&(1<<i))n++;return n;}
const FRAG100=['«…мы назвали его Ковчегом, потому что на нём было тесно и тепло…»','«…у пилота 013 была привычка: перед прыжком считать до трёх вслух…»','«…Э. В. рисовал корабли на полях отчётов. Всегда — с людьми в иллюминаторах…»',
  '«…здесь был берег. Настоящий: песок, вода, кто-то бросал камни…»','«…последний, кто помнил имена спящих, записал их на обшивке. Обшивку стёрли…»','«…мы не боялись темноты. Мы боялись, что нас забудут раньше, чем найдут…»',
  '«…первый цикл длился сорок лет. Последний — одиннадцать минут…»','«…если найдёшь это — значит, хоть что-то осталось…»','«…ребёнок спросил, почему звёзды не стираются. Никто не ответил…»',
  '«…мы оставили свет включённым — на случай, если кто-то вернётся…»','«…имя корабля было не VØID. Его стёрли первым…»','«…ты не первый, кто дочитал до конца. Но первый, кто собрал всё…»'];
// --- стирание с краёв: 12 с наползает, 6 держит, 12 отступает (Отливник может очистить края на 6 с) ---
function erW100(){const w=[rnd(.4,1),rnd(.4,1),rnd(.4,1),rnd(.4,1)];w[Math.random()*4|0]=1;return w;}
function erEase100(u){return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;}
function erK100(E){const u=((E.t%30)+30)%30;return u<12?erEase100(u/12):u<18?1:1-erEase100((u-18)/12);}
function erD100(E){const k=(E.t<0?0:erK100(E))*(1-clamp(E.clr95||0,0,1));const D=E.D*k;return [D*E.w[0],D*E.w[1],D*E.w[2],D*E.w[3]];}
function erJit100(s,pos){return 7*Math.sin(pos*.021+s*1.7)+4*Math.sin(pos*.057+s*3.1)+2*Math.sin(pos*.13+G.t*.6+s);}
function capD95(x,y,x1,y1,x2,y2,w){return w/2-segDist(x1,y1,x2,y2,x,y);}
function voidDepth100(x,y,X){X=X||G.x90;if(!X||!inMission())return 0;let best=0;const E=X.er;
  if(E&&E.t>=0){const d=erD100(E);if(d[0]>2)best=Math.max(best,d[0]+erJit100(0,y)-x);if(d[1]>2)best=Math.max(best,x-(W-d[1]-erJit100(1,y)));if(d[2]>2)best=Math.max(best,d[2]+erJit100(2,x)-y);if(d[3]>2)best=Math.max(best,y-(H-d[3]-erJit100(3,x)));}
  for(const z of X.ez){if(z.tele>0)continue;const q=z.r-Math.hypot(x-z.x,y-z.y);if(q>best)best=q;}
  if(X.estr95)for(const s of X.estr95){if(s.tele>0)continue;const q=capD95(x,y,s.x1,s.y1,s.x2,s.y2,s.w);if(q>best)best=q;}
  if(X.strip95)for(const s of X.strip95){if(y<s.y0||s.t>s.t0-.05)continue;const q=s.w/2-Math.abs(x-s.x);if(q>best)best=q;}
  if(X.spits95)for(const s of X.spits95){const q=capD95(x,y,s.x1,s.y1,s.x2,s.y2,s.w);if(q>best)best=q;}
  if(X.poly95)for(const P of X.poly95){const q=polyD95(x,y,P);if(q>best)best=q;}
  if(X.tongue95)for(const s of X.tongue95){const q=capD95(x,y,s.x1,s.y1,s.x2,s.y2,s.w);if(q>best)best=q;}
  const b=typeof sb100==='function'?sb100():null;if(b&&b.hz100&&(b.st==='fight'||b.st==='enter')){const q=hzAt100(b,x)-y;if(q>best)best=q;}
  return best;}
function inVoid100(x,y,X){return voidDepth100(x,y,X)>0;}
function t100Init(M,X){const m=G.m;X.sh=sh100();X.estr95=[];X.tongue95=[];X.pulseLog95=[];
  if(!M.bossRoom){X.er={t:-6,w:erW100(),wn:erW100(),D:.18*Math.min(W,H),cyc:0};
    const S=X.sh,slots=[0,1].map(i=>(m-43)*2+i);X.witPlan=slots.filter(b=>!(S.frag&(1<<b))&&!(S.lostFrag&(1<<b))).map((b,i)=>({bit:b,at:i?62:24,done:false}));
    if(m>=44&&rk90()>=1){X.hud={t:pk90(28,24,22),cur:null,last:null};}
    if(m>=44)mem100Waves(X);
    if(m===45){X.tide={next:16,band:null,n:0,hit:0,diag:1};X.shadT=20;}
    if(m===43&&storyFlag('line31')==='write'&&G.mode==='world'){const p=G.player;x85().ally={kind:'appr',x:p.x-60,y:p.y+40,a:0,cd:1,t:90};radioLine('УЧЕНИК',C85.lek,'Я помню, как ты летаешь. Здесь это пригодится.',1);}}
  X.echoSaved=echoLoad100(m);X.typoSer=storyFlag('line31')==='write'&&typeof serialNo85==='function'?1:0;}
function done100(M,X){if(X.echoRec&&X.echoRec.length>40)echoSave100(G.m,X.echoRec);}
// --- память: во второй половине волн — враги прошлых секторов (белый список MEM95, X07) ---
const MEM95=['gunner','phantom','hunter','defect','loop','labrat','shocker','stamp','inspector','echo80','scout','rammer','splitter','lancer','clot90','keeper90','phago90','hunt95'];
function mem100Pool(){const S=G.save,out=new Set();for(let m=11;m<=41;m++){const C=SEC_WAVES[m];if(!C)continue;if(!ALPHA_OPEN&&!(S&&S.medals&&S.medals[m]&&S.medals[m].clear))continue;for(const t of C.nw.concat(C.old||[]))if(MEM95.includes(t)&&EDEF[t])out.add(t);}
  return out.size?[...out]:['gunner','phantom','hunter','defect','loop','clot90','keeper90'];}
function mem100Waves(X){const pool=mem100Pool(),n=G.waves.length;for(let w=Math.floor(n/2);w<n;w++){const wv=G.waves[w];for(let i=0;i<wv.length;i++){if(typeof wv[i]!=='string'||wv[i].includes(':'))continue;if(Math.random()<.3)wv[i]='mem:'+pool[Math.random()*pool.length|0];}}}
function mem100Spawn(ty){edgeSpawn(EDEF[ty]&&MEM95.includes(ty)?ty:'gunner',{mem100:1});}
// --- след прошлого прохождения (для Эха-призрака) ---
const ECH64='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
function echoLoad100(m){try{const v=JSON.parse(LS.getItem('void_echo100')||'{}');const s=v&&typeof v==='object'?v[m]:null;if(typeof s!=='string'||s.length<20)return null;const out=[];for(let i=0;i+1<s.length;i+=2){const a=ECH64.indexOf(s[i]),b=ECH64.indexOf(s[i+1]);if(a<0||b<0)return null;out.push([a/63,b/63]);}return out;}catch(e){return null;}}
function echoSave100(m,rec){try{const v=JSON.parse(LS.getItem('void_echo100')||'{}');const o=v&&typeof v==='object'&&!Array.isArray(v)?v:{};let s='';for(const [x,y] of rec.slice(0,450))s+=ECH64[clamp(Math.round(x*63),0,63)]+ECH64[clamp(Math.round(y*63),0,63)];o[m]=s.slice(0,2000);for(const k of Object.keys(o))if(!/^4[3-6]$/.test(k))delete o[k];LS.setItem('void_echo100',JSON.stringify(o));}catch(e){}}
// --- тик миссии сектора X ---
function t100Tick(X,dt){const p=G.player;if(!p)return;
  if(X.er){const E=X.er,u0=((E.t%30)+30)%30;E.t+=dt;const u1=((E.t%30)+30)%30;if(E.t>=0&&u1<u0){E.w=E.wn;E.wn=erW100();E.cyc++;}E.D=.18*Math.min(W,H);E.tele=E.t<0?clamp(1+E.t,0,1):u1>29?u1-29:0;if(E.clrT95>0){E.clrT95-=dt;E.clr95=clamp(E.clrT95,0,1);}else E.clr95=0;}
  for(const z of X.ez){if(z.tele>0){z.tele-=dt;if(z.tele<=0)snd90('erase');}else z.t-=dt;}X.ez=X.ez.filter(z=>z.tele>0||z.t>0);
  if(X.estr95.length){for(const s of X.estr95){if(s.tele>0)s.tele-=dt;else s.t-=dt;}X.estr95=X.estr95.filter(s=>s.tele>0||s.t>0);}
  // эффекты пустоты: стирание не добивает (ниже 10% — урон ×0,3)
  const pd=voidDepth100(p.x,p.y,X);
  if(pd>0&&p.hp>0){X.vT=(X.vT||0)+dt;if(G.mc)G.mc.void100=1;if(!X.hint.void){X.hint.void=1;floater(p.x,p.y-40,'СТЁРТО · 6 УРОНА В СЕКУНДУ',C90.sh);}
    drain90(6*dt);X.vAcc=(X.vAcc||0)+dt;if(X.vAcc>=.5){X.vAcc=0;if(p.dashT<=0)sfx('hurt');}}else X.vAcc=0;
  for(const e of G.enemies){if(!e.alive||e.spawnT>0||STATIC.has(e.type)||EDEF[e.type].passive||e.sbk||EDEF[e.type].sbp||e.type==='eraser100'||e.type==='ebb95'||e.type==='blot95')continue;if(voidDepth100(e.x,e.y,X)>0){e.hp-=e.maxHp*.04*dt;if(e.hp<=0)kill(e);}}
  for(const it of G.pick){const d=voidDepth100(it.x,it.y,X);if(d<=0){it.v100=0;continue;}if(it.story||it.k==='frag100'||it.quest||it.anom||it.k==='chest95'||it.k==='tag95'){const a=Math.atan2(H/2-it.y,W/2-it.x);it.x+=Math.cos(a)*160*dt;it.y+=Math.sin(a)*160*dt;continue;}it.v100=(it.v100||0)+dt;if(it.v100>=2){it.life=0;if(SET.fx)part(it.x,it.y,0,-30,.5,C90.sh,2);}}
  // запись пути (и рывков — для эха)
  if(G.t-X.born<90){X.echoRecT-=dt;if(X.echoRecT<=0){X.echoRecT=.2;X.echoRec.push([p.x/W,p.y/H]);}}
  X.echoP.push({x:p.x,y:p.y,t:G.t});while(X.echoP.length&&G.t-X.echoP[0].t>24)X.echoP.shift();
  if(X.pulseLog95.length&&G.t-X.pulseLog95[0].t>26)X.pulseLog95.shift();
  if(X.hud)hudTick100(X,dt);
  if(X.witPlan)witTick100(X,dt);
  if(X.tide)tideTick100(X,dt);
  if(X.shadT>0&&G.endT<=0){X.shadT-=dt;if(X.shadT<=0){X.shadT=20;shadow100(X);}}
  shadTick100(X,dt);
  for(const e of G.enemies)if(e.alive&&e.mem100&&!e.memK){e.memK=1;e.hp*=.8;e.maxHp=e.hp;}}
// --- потеря интерфейса (X11: только 44–45 и Берег, не корпус ниже 30%, на «Лёгкой» — нет) ---
const HUD100={hp:['#hpT','#hpB'],en:['#enT','#enBar'],wave:['#misT','#sigBar'],mark:['#mini']};
const HUD100N={hp:'КОРПУС',en:'НАКОПИТЕЛЬ',wave:'ВОЛНА',mark:'КАРТА'};
function hudEls100(k){const out=[];for(const s of HUD100[k]){const el=document.querySelector(s);if(!el)continue;out.push(el.id==='hpT'||el.id==='enT'||el.id==='misT'||el.id==='hpB'?el.parentElement:el);}return out;}
function hudVis100(k){return hudEls100(k).some(el=>el.offsetParent!==null);}
function hudCss100(){if(document.getElementById('er100css'))return;const st=document.createElement('style');st.id='er100css';
  st.textContent='.er100{animation:er100o .6s forwards;pointer-events:none}.er100s{opacity:.6!important;filter:grayscale(1)}.er100r{animation:er100i .4s}@keyframes er100o{0%{opacity:1;filter:none;transform:none}55%{opacity:.5;filter:blur(1px);transform:translateX(2px)}100%{opacity:0;filter:blur(3px);transform:translateY(-4px)}}@keyframes er100i{from{opacity:0;filter:blur(2px)}to{opacity:1;filter:none}}';document.head.appendChild(st);}
function hudErase100(k){hudCss100();const soft=!!SET.noErase;for(const el of hudEls100(k)){el.classList.remove('er100r');el.classList.add(soft?'er100s':'er100');}snd90('crumble');}
function hudBack100(k){for(const el of hudEls100(k)){const was=el.classList.contains('er100');el.classList.remove('er100','er100s');if(was){el.classList.add('er100r');setTimeout(()=>el.classList.remove('er100r'),450);}}}
function clearHud100(force){const X=G.x90;let any=false;for(const k in HUD100){for(const el of hudEls100(k))if(el.classList.contains('er100')||el.classList.contains('er100s')){el.classList.remove('er100','er100s');any=true;}}
  if(X&&X.hud&&X.hud.cur){X.hud.cur=null;}if(X&&X.hudAll){X.hudAll=0;}return any;}
function hudTick100(X,dt){const H_=X.hud,p=G.player;if(G.endT>0||p.hp<=0){if(H_.cur){hudBack100(H_.cur);H_.cur=null;}return;}
  if(H_.cur==='hp'&&p.hp<G.st.maxHp*.3){hudBack100('hp');H_.cur=null;H_.t=8;return;}
  if(X.hudAll&&p.hp<G.st.maxHp*.3)hudBack100('hp');
  if(H_.cur){H_.left-=dt;if(H_.cur==='en'&&p.en>=100&&!(H_.chime>0)){H_.chime=1;snd90('chime');}if(p.en<100)H_.chime=0;if(H_.left<=0){hudBack100(H_.cur);H_.cur=null;H_.t=H_.per?H_.per-12:rnd(35,55);}return;}
  H_.t-=dt;if(H_.t<=0){const ks=['hp','en','wave','mark'].filter(k=>k!==H_.last&&hudVis100(k)&&(k!=='hp'||p.hp>=G.st.maxHp*.3));if(!ks.length){H_.t=5;return;}const k=ks[Math.random()*ks.length|0];H_.cur=H_.last=k;H_.left=12;hudErase100(k);
    floater(p.x,p.y-48,'СТЁРТО: '+HUD100N[k]+' · 12 С',C90.sh);if(!X.hint.hud){X.hint.hud=1;radioLine('БЕРЕГ',C90.sh,'Вы забываете, сколько вам осталось. Это нормально. Здесь все забывают.',.3);}}}
// --- Свидетели: держитесь рядом — летят за вами и быстрее (X13: обходят зоны стирания) ---
function witTick100(X,dt){const p=G.player;for(const q of X.witPlan){if(q.done||G.t-X.born<q.at||G.endT>0)continue;q.done=true;const L=Math.random()<.5,y=rnd(.3,.7)*H;
    const e=spawnEnemy('witness100',L?-24:W+24,y,{noAffix:true,noLoot:true,spawnT:.4,bit:q.bit,ex:L?W+40:-40,ey:rnd(.3,.7)*H});X.wit.push(e);floater(clamp(e.x,60,W-60),y-30,'СВИДЕТЕЛЬ · ДЕРЖИТЕСЬ РЯДОМ','#ffffff');snd90('frag');
    if(!X.hint.wit){X.hint.wit=1;radioLine('СВИДЕТЕЛЬ','#ffffff','Я несу то, что вы забыли. Летите рядом — я полечу за вами.',.4);}}
  X.wit=X.wit.filter(e=>e.alive);
  for(const w of X.wit){if(w.sh100>0)w.sh100-=dt;if(w.spawnT>0)continue;
    for(const b of G.eb){if(b.life<=0||b.rift)continue;if(Math.hypot(b.x-w.x,b.y-w.y)<w.r+5){b.life=0;if(w.sh100>0){w.flash=.05;continue;}witHurt100(w,b.dmg);}}
    for(const e of G.enemies){if(!e.alive||e===w||!(e.contact>0)||EDEF[e.type].passive||e.spawnT>0)continue;if(Math.hypot(e.x-w.x,e.y-w.y)<e.r+w.r&&!(e.wc100>G.t)){e.wc100=G.t+.8;if(!(w.sh100>0))witHurt100(w,e.contact);}}}}
function witHurt100(w,d){w.hp-=d;w.flash=.08;if(w.hp<=0&&w.alive){kill(w);}else if(!w.hurtHint){w.hurtHint=1;floater(w.x,w.y-24,'СВИДЕТЕЛЬ ПОД ОГНЁМ','#ffffff');}}
function witArrive100(w){const S=G.save,X=G.x90;if(!w.alive||w.arrived)return;w.arrived=1;w.alive=false;const sh=sh100();
  if(G.mode==='world'&&S&&S.story){if(w.bit>=0&&w.bit<12)sh.frag|=1<<w.bit;S.lom+=30;}const n=fragN100(sh.frag);
  floater(clamp(w.x,80,W-80),w.y-30,'ОБРЫВОК ПАМЯТИ · '+n+'/12 · +30 ЛОМА','#ffffff');snd90('fragGet');hs90(.06,0);conEvent('escort100');radioLine('ОБРЫВОК',C90.sh,FRAG100[w.bit]||'«…»',.3);}
function witAI100(e,dt){if(e.ex===undefined){e.ex=e.x<W/2?W+40:-40;e.ey=e.y;}if(e.bit===undefined)e.bit=-1;if(e.spawnT>0)return;const p=G.player;let tx=e.ex,ty=e.ey;
  const pd=Math.hypot(p.x-e.x,p.y-e.y),lead=pd<120&&p.hp>0;e.lead95=lead?Math.min(1,(e.lead95||0)+dt*3):Math.max(0,(e.lead95||0)-dt);
  if(lead){const ex=e.ex>W/2?1:-1;tx=p.x-ex*40;ty=p.y;}
  let dx=tx-e.x,dy=ty-e.y;const dl=Math.hypot(dx,dy)||1;
  // обход зон стирания по касательной
  const ahead=voidDepth100(e.x+dx/dl*70,e.y+dy/dl*70);if(ahead>0){const X=G.x90;let zx=null,zy=null,bd=1e9;for(const z of (X?X.ez:[])){const d=Math.hypot(z.x-e.x,z.y-e.y);if(d<bd){bd=d;zx=z.x;zy=z.y;}}
    if(zx!==null&&bd<260){const ax=e.x-zx,ay=e.y-zy,al=Math.hypot(ax,ay)||1,s=(ax/al)*(-dy/dl)+(ay/al)*(dx/dl)>0?1:-1;dx=-ay/al*s*dl+ax/al*dl*.4;dy=ax/al*s*dl+ay/al*dl*.4;}else dy+=(H/2-e.y)*2;}
  steer(e,dx,dy,e.spd*(e.sh100>0?1.25:1)*(1+.25*e.lead95),dt,2);if(voidDepth100(e.x,e.y)>0){const a=Math.atan2(H/2-e.y,W/2-e.x);e.x+=Math.cos(a)*90*dt;e.y+=Math.sin(a)*90*dt;}
  if(e.ex>W&&e.x>W+20||e.ex<0&&e.x<-20)witArrive100(e);}
function witT100(e){const X=G.x90;if(!X||X.sec!==9||!X.wit||!X.wit.length||!inMission()||EDEF[e.type].passive||STATIC.has(e.type)||e.sbk)return null;const p=G.player;let best=null,bd=Math.hypot(p.x-e.x,p.y-e.y);
  if(e.uid%2)return null;for(const w of X.wit){if(!w.alive||w.spawnT>0||w.sh100>0)continue;const d0=Math.hypot(w.x-e.x,w.y-e.y);if(d0>380)continue;const d=d0*.66;if(d<bd){bd=d;best=w;}}return best;}
// --- Прилив: полоса пустоты в любом направлении (в 45 — по диагонали); X03 — толкает не дольше 1,2 с и выбрасывает в проход ---
function tideFrame95(dir){let dx=0,dy=1;if(dir==='h'){dx=1;dy=0;}else if(dir==='v'){dx=0;dy=1;}else if(dir&&dir.dx!==undefined){dx=dir.dx;dy=dir.dy;}const l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;const nx=-dy,ny=dx;
  const C=[[0,0],[W,0],[0,H],[W,H]];let s0=1e9,s1=-1e9,u0=1e9,u1=-1e9;for(const [x,y] of C){const s=x*dx+y*dy,u=x*nx+y*ny;s0=Math.min(s0,s);s1=Math.max(s1,s);u0=Math.min(u0,u);u1=Math.max(u1,u);}
  return {dx,dy,nx,ny,s0,s1,u0,u1};}
function tideMake95(dir,gapPt,boss){const F=tideFrame95(dir),U=F.u1-F.u0;let c;if(gapPt){c=gapPt.x*F.nx+gapPt.y*F.ny;}else c=F.u0+U*rnd(.22,.78);return Object.assign(F,{pos:-80,hit:false,c,gw:140,th:160,full:F.s1-F.s0+160,pushT:0});}
function tideIn95(B,x,y,pad){pad=pad||0;const s=x*B.dx+y*B.dy-B.s0,u=x*B.nx+y*B.ny;if(s<B.pos-B.th-pad||s>B.pos+pad)return false;if(Math.abs(u-B.c)<B.gw/2-pad)return false;return true;}
function tideTick100(X,dt){const T=X.tide,p=G.player;if(G.endT>0){T.band=null;T.bands=null;return;}
  if(!T.bands){T.next-=dt;if(T.next<=3&&!T.warn){let dirs;if(T.diag){const d1={dx:1,dy:H/W},d2={dx:-1,dy:-H/W};dirs=T.wave9?[d1,d2]:[Math.random()<.5?d1:d2];}else dirs=[Math.random()<.5?'v':'h'];
      const sb_=typeof sb100==='function'?sb100():null,hz_=sb_&&sb_.hz100&&sb_.alive?hzAt100(sb_,W/2):0;const gp=T.wave9?{x:W*rnd(.35,.65),y:H*rnd(.35,.65)}:hz_>0?{x:W*rnd(.25,.75),y:rnd(Math.min(H-110,hz_+100),H-90)}:null;T.warn={bands:dirs.map(d=>tideMake95(d,gp))};snd90('tideW');banner(T.wave9?'ДЕВЯТЫЙ ВАЛ':'ПРИЛИВ',T.wave9?'ДВА ПРИЛИВА НАВСТРЕЧУ · ОДИН ОБЩИЙ ПРОХОД':'ИЩИТЕ ПРОХОД · ИЛИ РЫВОК СКВОЗЬ');}
    if(T.next<=0&&T.warn){T.bands=T.warn.bands;T.band=T.bands[0];T.warn=null;T.n++;T.wave9=0;snd90('tide');trauma90(.35);}return;}
  let alive=0;for(const B of T.bands){B.pos+=70*dt;if(B.pos>B.full)continue;alive++;
    for(const b of G.eb)if(b.life>0&&!b.rift&&tideIn95(B,b.x,b.y))b.life=0;
    for(const b of G.pb)if(b.life>0&&tideIn95(B,b.x,b.y))b.life=0;
    if(p.hp>0&&tideIn95(B,p.x,p.y,p.r*.6)){if(p.dashT<=0){if(!T.hitN){T.hitN=1;damagePlayer(12);if(G.mc)G.mc.tide100=1;floater(p.x,p.y-34,'ПРИЛИВ · −12',C90.sh);trauma90(.2);}
        B.pushT+=dt;if(B.pushT<1.2){p.x+=B.dx*70*1.6*dt;p.y+=B.dy*70*1.6*dt;}
        else{const s=p.x*B.dx+p.y*B.dy;p.x=B.dx*s+B.nx*B.c;p.y=B.dy*s+B.ny*B.c;B.pushT=0;floater(p.x,p.y-30,'ВЫБРОШЕНО В ПРОХОД',C90.sh);snd95('fade95',p.x);if(SET.fx)for(let i=0;i<12;i++)part(p.x,p.y,vrnd3(-120,120),vrnd3(-120,120),.4,C90.sh,2);}}}
    else B.pushT=Math.max(0,B.pushT-dt*.25);
    for(const e of G.enemies){if(!e.alive||STATIC.has(e.type)||EDEF[e.type].passive||e.sbk)continue;if(tideIn95(B,e.x,e.y)){e.x+=B.dx*70*1.4*dt;e.y+=B.dy*70*1.4*dt;}}}
  if(!alive){if(!T.hitN){conEvent('tide100');if(G.mc)G.mc.tideN100=(G.mc.tideN100||0)+1;}T.bands=null;T.band=null;T.hitN=0;T.next=T.boss?16:40;}}
// совместимость с 0.9: прямоугольник полосы (для старых проверок)
function tideRect100(B){return {x:0,y:0,w:W,h:H};}
function inTide100(B,r,x,y,pad){return tideIn95(B,x,y,pad);}
// --- тени прошлых боссов в миссии 45 (X06: только ниже горизонта + 40) ---
const SHAD100=[['lek','ЛЕКАЛО','#e8d27a'],['well','ПЕРВЫЙ СИГНАЛ','#6b8cff'],['heart','СЕРДЦЕ','#ffd36b'],['flag','ПОСЛЕДНИЙ ДОВОД','#b8c4d6']];
function shadTop95(){const b=typeof sb100==='function'?sb100():null;return b?hzAt100(b,W/2)+40:0;}
function shadow100(X,pick){const p=G.player,[k,name,col]=pick||SHAD100[Math.random()*SHAD100.length|0];const tk=1.2*tl85();const q={k,name,col,t:0,tele:Math.max(.7,1.1*tk),done:false};const top=shadTop95();
  if(k==='lek'){q.x=clamp(p.x+p.vx*.5,80,W-80);q.w=130;q.y0=top;}
  if(k==='well'){q.x=Math.random()<.5?40:W-40;q.y=Math.max(top+40,rnd(.2,.8)*H);q.gaps=[rnd(0,TAU),rnd(0,TAU)];q.R=0;}
  if(k==='heart'){q.x=W/2;q.y=Math.max(top+60,H/2);q.R=0;}
  if(k==='flag'){q.x=clamp(p.x,120,W-120);q.y=Math.max(top+40,-20);}
  X.shad.push(q);snd90('shadow');tlog95('shadow100',q.tele);}
function shadTick100(X,dt){const p=G.player;for(const q of X.shad){q.t+=dt;if(q.t<q.tele)continue;const u=q.t-q.tele;
    if(q.k==='lek'){if(!q.done){q.done=true;trauma90(.25);sfx('boom');if(p.hp>0&&p.dashT<=0&&Math.abs(p.x-q.x)<q.w/2+p.r*.5&&p.y>(q.y0||0))damagePlayer(14);}if(u>.5)q.dead=1;}
    else if(q.k==='well'||q.k==='heart'){const R0=q.R;q.R+=300*dt;const d=Math.hypot(p.x-q.x,p.y-q.y);
      if(p.hp>0&&p.dashT<=0&&!q.hit&&d>R0-p.r-7&&d<q.R+p.r+7){let gap=false;if(q.gaps){const a=Math.atan2(p.y-q.y,p.x-q.x);for(const g of q.gaps)if(Math.abs(angDiff(a,g))<.3)gap=true;}if(!gap){q.hit=true;damagePlayer(q.k==='well'?10:7);}}
      if(q.R>Math.hypot(W,H))q.dead=1;}
    else if(q.k==='flag'){if(!q.done){q.done=true;const a0=Math.atan2(p.y-q.y,p.x-q.x);for(let i=0;i<9;i++)shootE(q.x,q.y+30,a0+(i-4)*.12,260,8.4,'#b8c4d6',5);}q.dead=1;}}
  X.shad=X.shad.filter(q=>!q.dead);}
// --- движение корабля ---
function drift100(X,p,dt){if(p.dashT<=0&&voidDepth100(p.x,p.y,X)>0){p.x=p.px+(p.x-p.px)*.7;p.y=p.py+(p.y-p.py)*.7;}
  if(p.dashT>0)for(const e of G.enemies){if(e.type!=='eraser100'||!e.alive||e.spawnT>0||e.ramId100===G.dashId)continue;if(segDist(p.px,p.py,p.x,p.y,e.x,e.y)<e.r+p.r){e.ramId100=G.dashId;e.stun=1.5;floater(e.x,e.y-24,'ЛАСТИК ОГЛУШЁН',C90.sh);hs90(.06,0);}}
  if(p.dashT>0)for(const e of G.enemies){if(e.type!=='fixer100'||!e.alive||!e.fx||e.cutId===G.dashId)continue;const T=e.fx;if(T.alive&&segInter(p.px,p.py,p.x,p.y,e.x,e.y,T.x,T.y)){e.cutId=G.dashId;fixCut100(e,true);}}}
// --- снаряды игрока ---
function b100Hit(b,X){if(!b.charged){for(const z of X.ez){if(z.tele>0)continue;if(Math.hypot(b.x-z.x,b.y-z.y)<z.r){b.life=0;if(SET.fx)part(b.x,b.y,0,0,.25,C90.sh,2);return true;}}
    if(X.estr95)for(const s of X.estr95){if(s.tele>0)continue;if(capD95(b.x,b.y,s.x1,s.y1,s.x2,s.y2,s.w)>0){b.life=0;return true;}}}
  return false;}
function pulse100(X,p,R){if(X.pulseLog95)X.pulseLog95.push({t:G.t,x:p.x,y:p.y});}
function targ100(e,X){if(e.hid90&&!(e.rev100>0)&&!(e.vis100>0)&&!(G.player&&Math.hypot(e.x-G.player.x,e.y-G.player.y)<220))return false;if(voidDepth100(e.x,e.y,X)>40)return false;return true;}
// --- Опечатка: нос, орудие и крылья от разных врагов; раз в 8 с переписывает часть (×2) ---
const TYPO_MV=[['ТАРАН','ram',.45],['ВЕЕР','weave',.3],['КРУГ','orbit',.35],['СКАЧОК','blink',.4],['СТРОЙ','strafe',.3],['СПИРАЛЬ','spiral',.35],['ДРЕЙФ','drift',.2],['РЫВОК','jink',.4]];
const TYPO_GUN=[['ОДИН','single',.3],['ТРОЙКА','fan3',.4],['ВЕНОК','ring',.45],['КОПЬЁ','lance',.45],['МИНА','mine',.35],['БУМЕРАН','boom',.4],['ОРБИТА','orb',.4],['ЛОКОТЬ','none',.1]];
const TYPO_HAB=[['БРОНЯ','armor',.35],['РАСКОЛ','split',.3],['ЛЕКАРЬ','heal',.4],['РЫСЬ','fast',.3],['ВЗРЫВ','boom',.25],['ЗАТЯЖКА','regen',.35],['ТЕНЬ','fade',.3],['ДВОЙНИК','twin',.35],['ЗЕРКАЛО','mirror',.35],['ЯКОРЬ','anchor',.4]];
function typoGen100(e){for(let t=0;t<20;t++){const a=TYPO_MV[Math.random()*TYPO_MV.length|0],b=TYPO_GUN[Math.random()*TYPO_GUN.length|0],c=TYPO_HAB[Math.random()*TYPO_HAB.length|0];if(a[2]+b[2]+c[2]<=1.3||t===19){e.tp={mv:a[1],gun:b[1],hab:c[1]};e.tpN=[a[0],b[0],c[0]];break;}}
  typoName95(e);typoHab95(e);e.gcd=rnd(1,2);e.hl=0;e.rwT95=8;
  const X=G.x90;if(X&&X.typoSer&&!X.typoSerDone){X.typoSerDone=1;e.tpSer=' · №'+String(serialNo85()).padStart(3,'0');typoName95(e);}}
function typoName95(e){e.tpName=e.tpN.join('-')+(e.tpSer||'');}
function typoHab95(e){if(e.tp.hab==='armor')e.armor=3;if(e.tp.hab==='fast'&&!e.fastK95){e.fastK95=1;e.spd*=1.3;}}
function typoRewrite95(e){const k=Math.random()*3|0;const L=[TYPO_MV,TYPO_GUN,TYPO_HAB][k],key=['mv','gun','hab'][k];let q;for(let i=0;i<8;i++){q=L[Math.random()*L.length|0];if(q[1]!==e.tp[key])break;}
  if(e.tp.hab==='fast'&&key==='hab'&&e.fastK95){e.fastK95=0;e.spd/=1.3;}e.tp[key]=q[1];e.tpN[k]=q[0];typoName95(e);typoHab95(e);e.glitch95=.5;weak95(e,.5,2);e.orb95=null;snd95('glitch',e.x);glyph95(e.x,e.y,5,'#b8ffe0');floater(e.x,e.y-e.r-22,'ПРАВКА · '+q[0],'#b8ffe0');}
function typoAI100(e,dt,c){const p=G.player;if(!e.tp)typoGen100(e);const pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1,sm=c.sm;
  if(e.glitch95>0)e.glitch95-=dt;e.rwT95-=dt;if(e.rwT95<=0){e.rwT95=8;typoRewrite95(e);}
  switch(e.tp.mv){
    case 'ram':if(e.rs==='aim'){e.vx*=.88;e.vy*=.88;e.rt-=dt;if(e.rt<=0){e.rs='go';e.rt=.5;e.vx=Math.cos(e.aim)*600;e.vy=Math.sin(e.aim)*600;}}else if(e.rs==='go'){e.rt-=dt;if(e.rt<=0)e.rs=null;}else{steer(e,pdx,pdy,e.spd*sm,dt,3);e.rc=(e.rc||2)-dt;if(e.rc<=0&&pd<450){e.rc=3;e.rs='aim';e.rt=.7*tel90('typo100');e.aim=Math.atan2(pdy,pdx);e.tl95=e.rt;tlog95('typoRam',e.rt);}}break;
    case 'weave':{const w=Math.sin(e.t*3+e.seed)*.6;steer(e,pdx/pd-pdy/pd*w,pdy/pd+pdx/pd*w,e.spd*sm,dt,3);break;}
    case 'orbit':{e.oa=(e.oa===undefined?Math.atan2(-pdy,-pdx):e.oa)+dt*e.dir*.9;const tx=p.x+Math.cos(e.oa)*220,ty=p.y+Math.sin(e.oa)*220;steer(e,tx-e.x,ty-e.y,e.spd*sm,dt,3);break;}
    case 'blink':e.bk=(e.bk||2.5)-dt;steer(e,pdx,pdy,e.spd*.6*sm,dt,2);if(e.bk<=0){e.bk=3;const a=rnd(0,TAU);explode(e.x,e.y,EDEF.typo100.col,6,.3);e.x=clamp(p.x+Math.cos(a)*240,40,W-40);e.y=clamp(p.y+Math.sin(a)*240,40,H-40);e.spawnT=.3;}break;
    case 'spiral':{e.oa=(e.oa===undefined?Math.atan2(-pdy,-pdx):e.oa)+dt*e.dir*1.4;e.sr95=Math.max(120,(e.sr95||360)-dt*40);if(e.sr95<=125)e.sr95=360;const tx=p.x+Math.cos(e.oa)*e.sr95,ty=p.y+Math.sin(e.oa)*e.sr95;steer(e,tx-e.x,ty-e.y,e.spd*sm,dt,3);break;}
    case 'drift':{const m=clamp((pd-400)/120,-1,1);steer(e,pdx/pd*m,pdy/pd*m,e.spd*.55*sm,dt,1.5);break;}
    case 'jink':{e.jk=(e.jk||1.4)-dt;const m=clamp((pd-260)/120,-1,1);steer(e,pdx/pd*m,pdy/pd*m,e.spd*sm,dt,2.5);if(e.jk<=0){e.jk=rnd(1.2,1.8);const s=Math.random()<.5?-1:1;e.vx=-pdy/pd*s*480;e.vy=pdx/pd*s*480;}break;}
    default:{const m=clamp((pd-280)/120,-1,1);steer(e,pdx/pd*m-pdy/pd*.6*e.dir,pdy/pd*m+pdx/pd*.6*e.dir,e.spd*sm,dt,3);if(Math.random()<dt*.25)e.dir*=-1;}}
  e.gcd-=dt;const a=Math.atan2(pdy,pdx);e.charging=e.gcd<.45;
  if(e.gcd<=0&&pd<720){const k=first90(e);switch(e.tp.gun){case 'single':shootE(e.x,e.y,a,280,10*k,'#b8ffe0',5);e.gcd=1.8;break;case 'fan3':for(let i=-1;i<=1;i++)shootE(e.x,e.y,a+i*.18,260,8*k,'#b8ffe0',5);e.gcd=2.2;break;
      case 'ring':for(let i=0;i<8;i++)shootE(e.x,e.y,i/8*TAU+e.t,220,7*k,'#b8ffe0',5);e.gcd=4;break;case 'lance':if(!e.ln){e.ln=.6*tel90('typo100');e.la=a;e.tl95=e.ln;}e.gcd=9;break;
      case 'mine':{inkMine95(e.x,e.y);e.gcd=4.5;break;}
      case 'boom':{const b=shootE(e.x,e.y,a,340,9*k,'#b8ffe0',6);if(b){b.boom95={t:.9,o:e};}e.gcd=2.6;break;}
      case 'orb':{if(!e.orb95)e.orb95={n:3,a:0,fl:3};e.gcd=1;break;}
      default:e.gcd=9;}}
  if(e.ln>0){e.ln-=dt;e.la+=clamp(angDiff(a,e.la),-1.2*dt,1.2*dt);if(e.ln<=0){e.ln=0;shootE(e.x,e.y,e.la,520,13*first90(e),'#ffffff',4);e.gcd=2.6;}}
  if(e.orb95){const O=e.orb95;O.a+=dt*2.6;O.fl-=dt;if(O.fl<=0&&O.n>0&&pd<500){O.fl=2.2;O.n--;const q=O.a+O.n*TAU/3;shootE(e.x+Math.cos(q)*30,e.y+Math.sin(q)*30,a,300,9*first90(e),'#b8ffe0',6);snd95('fling',e.x);if(O.n<=0){e.orb95=null;e.gcd=2;}}
    if(p.hp>0&&p.dashT<=0)for(let i=0;i<O.n;i++){const q=O.a+i*TAU/3,x=e.x+Math.cos(q)*30,y=e.y+Math.sin(q)*30;if(Math.hypot(p.x-x,p.y-y)<p.r*.6+6&&!(e.ohit95>G.t)){e.ohit95=G.t+.8;damagePlayer(8);}}}
  if(e.tp.hab==='heal'){e.hl-=dt;if(e.hl<=0){e.hl=1;for(const o of G.enemies)if(o.alive&&o!==e&&!o.sbk&&!STATIC.has(o.type)&&Math.hypot(o.x-e.x,o.y-e.y)<200)o.hp=Math.min(o.maxHp,o.hp+o.maxHp*.02);}}
  if(e.tp.hab==='regen'&&G.t-(e.hitT100||-9)>2)e.hp=Math.min(e.maxHp,e.hp+e.maxHp*.05*dt);
  if(e.tp.hab==='fade'){e.fade100=(Math.sin(e.t*1.3+e.seed)>.6);}
  if(e.tp.hab==='anchor'){e.anc95=(e.anc95||4)-dt;if(e.anc95<=.7&&!e.ancW){e.ancW=1;e.tl95=.7;snd95('tlDash',e.x);}if(e.anc95<=0){e.anc95=5;e.ancW=0;e.ancP=.8;}if(e.ancP>0){e.ancP-=dt;if(p.dashT<=0&&pd<420){p.x-=pdx/pd*120*dt;p.y-=pdy/pd*120*dt;}}}}
// бумеранг: снаряд Опечатки возвращается
function boomTick95(dt){for(const b of G.eb){if(!b.boom95)continue;const B=b.boom95;B.t-=dt;if(B.t<=0&&!B.back){B.back=1;const o=B.o;if(o&&o.alive){const a=Math.atan2(o.y-b.y,o.x-b.x),s=Math.hypot(b.vx,b.vy);b.vx=Math.cos(a)*s;b.vy=Math.sin(a)*s;b.life=Math.max(b.life,2);}}}}
// чернильные мины (X12): свои, в цвете сектора
function inkMine95(x,y){const X=G.x90;const L=X&&inMission()?(X.ink95||(X.ink95=[])):(G.wink95||(G.wink95=[]));if(L.length>=6)return;L.push({x,y,arm:.9,t:13,fuse:0});snd95('splat',x);}
function inkTick95(dt){const X=G.x90,p=G.player;const L=X&&inMission()?X.ink95:G.wink95;if(!L||!L.length||!p)return;for(const m of L){m.t-=dt;if(m.arm>0){m.arm-=dt;continue;}if(!m.fuse&&p.hp>0&&Math.hypot(p.x-m.x,p.y-m.y)<72){m.fuse=1;m.t=0;tg95({k:'zone',x:m.x,y:m.y,r:64,T:.45,dmg:12,col:C90.sh,key:'inkMine',snd:'tlZone',hitE:20});}}
  for(let i=L.length-1;i>=0;i--)if(L[i].t<=0)L.splice(i,1);}
// --- Корректор: опасный луч, рывок переворачивает ремонт, «правка» снарядов ---
function dl100(e,d){const L=e.dl||(e.dl=[]);L.push({t:G.t,d});if(L.length>8)L.shift();}
function dlSum100(e){if(!e.dl)return 0;let s=0;for(const q of e.dl)if(G.t-q.t<=3)s+=q.d;return s;}
function fixCut100(e,rev){if(!e.fx)return;const T=e.fx;if(rev&&T.alive){const h=Math.min(T.hp-1,dlSum100(T)*clamp((e.fxT||0)/1.5,.4,1));if(h>0){T.hp-=h;T.flash=.12;floater(T.x,T.y-T.r-14,'РЕМОНТ ПЕРЕВЁРНУТ · −'+Math.round(h),C90.sh);hs90(.07,0);}T.dl=[];}
  e.fx=null;e.fxT=0;e.fcd=3;e.chDmg=0;floater(e.x,e.y-24,'РЕМОНТ ПРЕРВАН',C90.sh);if(G.mc)G.mc.fixCut100=(G.mc.fixCut100||0)+1;snd90('cut');}
function fixerAI100(e,dt,c){const p=G.player;if(e.fcd>0)e.fcd-=dt;if(e.edT===undefined)e.edT=rnd(2,3.5);
  if(!e.fx&&!(e.fcd>0)){let best=null,bk=.95;for(const o of G.enemies){if(!o.alive||o===e||o.spawnT>0||o.sbk||EDEF[o.type].sbp||EDEF[o.type].passive||o.type==='fixer100')continue;const k=o.hp/o.maxHp;if(k<bk&&dlSum100(o)>0&&Math.hypot(o.x-e.x,o.y-e.y)<500){bk=k;best=o;}}if(best){e.fx=best;e.fxT=0;e.chDmg=0;}}
  if(e.fx){const T=e.fx;if(!T.alive){e.fx=null;return;}const d=Math.hypot(T.x-e.x,T.y-e.y);steer(e,T.x-e.x,T.y-e.y,e.spd*c.sm*(d>140?1.35:.25),dt,3);
    // луч жжёт
    if(d<=225&&p.hp>0&&p.dashT<=0&&segDist(e.x,e.y,T.x,T.y,p.x,p.y)<5+p.r*.55&&!(e.bh95>G.t)){e.bh95=G.t+.8;damagePlayer(10);floater(p.x,p.y-30,'ЛУЧ КОРРЕКТОРА −10',C90.sh);}
    if(d>220)e.fxT=Math.max(0,e.fxT-dt*2);
    else{e.fxT+=dt;if(e.fxT>=1.5){const h=Math.min(T.maxHp-T.hp,dlSum100(T));if(h>0){T.hp+=h;floater(T.x,T.y-22,'ИСПРАВЛЕНО',C90.sh);snd90('fix');}T.dl=[];e.fx=null;e.fcd=3;}}return;}
  // без цели — «правка»: снаряды рядом замирают и доворачивают к вам
  e.edT-=dt;if(e.edT<=0){e.edT=4;let n=0;for(const b of G.eb){if(b.rift||b.k95==='word'||b.hold95>0||b.frz95>0)continue;if(Math.hypot(b.x-e.x,b.y-e.y)<200){b.frz95=.45;b.rv95=1;b.vx0=b.vx;b.vy0=b.vy;n++;}}if(n){snd95('rewrite',e.x);floater(e.x,e.y-e.r-14,'ПРАВКА · '+n,C90.sh);tlog95('fixEdit',.45);}}
  const pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1,m=clamp((pd-280)/120,-1,1);steer(e,pdx/pd*m-pdy/pd*.5*e.dir,pdy/pd*m+pdx/pd*.5*e.dir,e.spd*c.sm,dt,2.5);}
// --- Эхо-призрак: путь, рывки и импульсы игрока; очереди в стиле вашего оружия ---
function echoAI100(e,dt){const X=G.x90,p=G.player;let tx=e.x,ty=e.y;const tPast=G.t-20;
  if(e.dz95>0){e.dz95-=dt;e.x+=e.vx*dt;e.y+=e.vy*dt;e.x=clamp(e.x,20,W-20);e.y=clamp(e.y,20,H-20);if(SET.fx)part(e.x,e.y,vrnd3(-30,30),vrnd3(-30,30),.3,'#e0fff4',2);return;}
  if(e.path100&&e.path100.length){const L=e.path100,i=(e.pi100+Math.floor(e.t*5))%L.length,q=L[i];tx=q.x*W;ty=q.y*H;e.src100='boss';if(q.d&&e.lastI95!==i){e.lastI95=i;echoDash95(e,tx,ty);}}
  else if(X&&X.echoSaved&&X.echoSaved.length){const i=Math.floor(e.t*5)%X.echoSaved.length,q=X.echoSaved[i];tx=q[0]*W;ty=q[1]*H;e.src100='saved';e.sd95=(e.sd95||3.5)-dt;if(e.sd95<=0){e.sd95=rnd(3.5,5);const j=(i+3)%X.echoSaved.length,q2=X.echoSaved[j];echoDash95(e,q2[0]*W,q2[1]*H);}}
  else if(X&&X.echoP.length){let q=null;for(const s of X.echoP){if(s.t<=tPast)q=s;else break;}if(q){tx=q.x;ty=q.y;e.src100='past';}
    const last=e.tp95===undefined?tPast:e.tp95;for(const ev of G.dashLog){if(ev.t>last&&ev.t<=tPast){echoDash95(e,ev.x,ev.y);break;}}if(X.pulseLog95)for(const ev of X.pulseLog95){if(ev.t>last&&ev.t<=tPast){echoPulse95(e);break;}}e.tp95=tPast;}
  const dx=tx-e.x,dy=ty-e.y,d=Math.hypot(dx,dy);if(d>2){const s=Math.min(d*4,320);e.vx=dx/d*s;e.vy=dy/d*s;e.face=Math.atan2(dy,dx);}else{e.vx*=.8;e.vy*=.8;}
  e.x+=e.vx*dt;e.y+=e.vy*dt;e.x=clamp(e.x,20,W-20);e.y=clamp(e.y,20,H-20);
  e.cd-=dt;e.charging=e.cd<.4;if(e.cd<=0&&p.hp>0){e.cd=1.7;e.bq95=3;e.bqT=0;}
  if(e.bq95>0){e.bqT-=dt;if(e.bqT<=0){e.bq95--;e.bqT=.13;const n=Math.min(3,G.st?G.st.shots:1),a=Math.atan2(p.y-e.y,p.x-e.x);for(let i=0;i<n;i++)shootE(e.x,e.y,a+(i-(n-1)/2)*.11,320,6*first90(e),'#a8b4b0',4);}}}
function echoDash95(e,tx,ty){const a=Math.atan2(ty-e.y,tx-e.x);e.vx=Math.cos(a)*1400;e.vy=Math.sin(a)*1400;e.dz95=.16;snd95('pilotDash',e.x);}
function echoPulse95(e){wv95({x:e.x,y:e.y,v:520,w:10,dmg:12,col:'#e0fff4',R:150});snd95('pilotPulse',e.x);}
// --- Пустотник: дрожание пустоты, красные глаза, три рывка зигзагом, окно ×2, охота парами ---
function hollowAI100(e,dt,c){const p=G.player;if(e.lt===undefined){e.lt=rnd(2.5,4);e.oa=Math.atan2(e.y-p.y,e.x-p.x);}
  if(e.rev100>0)e.rev100-=dt;if(e.vis100>0)e.vis100-=dt;e.hid90=!(e.rev100>0||e.vis100>0||e.ls==='go'||e.ls==='zig'||e.ls==='stop'||e.spawnT>0);
  if(e.ls==='zig'){e.zt95-=dt;if(e.zt95<=0){if(e.zn95>=3){e.ls='stop';e.stT95=1.5;e.vx=e.vy=0;weak95(e,1.5,2);e.vis100=1.6;return;}e.zn95++;const base=Math.atan2(p.y-e.y,p.x-e.x),off=e.zn95===1?0:(e.zn95%2?1:-1)*.6;e.za95=base+off;e.vx=Math.cos(e.za95)*620;e.vy=Math.sin(e.za95)*620;e.zt95=.22;e.zp95=.12;snd95('zig',e.x);}
    else if(e.zp95>0){e.zp95-=dt;if(e.zp95<=0){e.vx*=.15;e.vy*=.15;e.zt95=Math.min(e.zt95,.14);}}return;}
  if(e.ls==='stop'){e.stT95-=dt;e.vx*=.8;e.vy*=.8;if(e.stT95<=0){e.ls=null;e.lt=4;}return;}
  e.lt-=dt;const tk=.6*tel90('hollow100');
  if(e.lt<=tk&&!e.inh){e.inh=1;e.tl95=tk;snd90('inhale',clamp((e.x-p.x)/400,-1,1));e.la=Math.atan2(p.y-e.y,p.x-e.x);tlog95('hollow100',tk);}
  if(e.lt<=0){e.inh=0;e.ls='zig';e.zn95=0;e.zt95=0;tel90use('hollow100');return;}
  // пара: один отвлекает спереди, второй заходит сзади
  let R=400,ang=e.oa+dt*.6*e.dir;const mate=G.enemies.find(o=>o!==e&&o.alive&&o.type==='hollow100');if(mate){const pf=Math.hypot(p.vx,p.vy)>40?Math.atan2(p.vy,p.vx):ARCH.a24?a24Hull(p):p.ang;/* ARCH·80 A-24 */const role=e.uid<mate.uid;ang=role?pf+Math.sin(G.t*.7)*.4:pf+Math.PI+Math.sin(G.t*.5)*.5;R=role?320:280;e.oa+=angDiff(ang,e.oa)*Math.min(1,dt*1.5);}else e.oa=ang;
  const tx=p.x+Math.cos(e.oa)*R,ty=p.y+Math.sin(e.oa)*R;steer(e,tx-e.x,ty-e.y,e.spd*c.sm,dt,2.4);}
// --- Ластик: «чирк» через арену со стёртой полосой, зоны на пути игрока, окно ×1,8 ---
function eraserAI100(e,dt,c){const p=G.player,Z=ez100(),X=G.x90;const pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1,m=clamp((pd-250)/120,-1,1);
  if(e.sk95){const S=e.sk95;if(S.st==='warn'){e.vx*=.8;e.vy*=.8;S.t-=dt;if(S.t<=0){S.st='go';S.u=0;snd95('streak',e.x);}return;}
    S.u+=900*dt/S.L;const u=Math.min(1,S.u);e.x=S.x1+(S.x2-S.x1)*u;e.y=S.y1+(S.y2-S.y1)*u;e.vx=(S.x2-S.x1)/S.L*900;e.vy=(S.y2-S.y1)/S.L*900;if(SET.fx&&vR3()<.7)glyph95(e.x,e.y,1,C90.sh,1);
    if(X&&inMission()&&X.pil95)for(const q of X.pil95){if(q.alive&&!q.core&&Math.hypot(q.x-e.x,q.y-e.y)<q.r+e.r){pilBreak95(X,q);floater(q.x,q.y-q.r-26,'СТЁРТО ЛАСТИКОМ',C90.sh);}}
    if(u>=1){e.sk95=null;e.vx*=.1;e.vy*=.1;weak95(e,1,1.8);if(X&&inMission())X.estr95.push({x1:S.x1,y1:S.y1,x2:S.x2,y2:S.y2,w:60,t:4,tele:0});else{const L=G.wez100||(G.wez100=[]);for(let i=0;i<=4;i++){const q=i/4;L.push({x:S.x1+(S.x2-S.x1)*q,y:S.y1+(S.y2-S.y1)*q,r:32,tele:0,t:4,by:e});}}}
    return;}
  steer(e,pdx/pd*m-pdy/pd*.6*e.dir,pdy/pd*m+pdx/pd*.6*e.dir,e.spd*c.sm,dt,2.5);if(Math.random()<dt*.3)e.dir*=-1;
  e.skT95=(e.skT95===undefined?rnd(3,5):e.skT95)-dt;
  if(e.skT95<=0&&pd<640&&p.hp>0){e.skT95=6.5;const a=Math.atan2(pdy,pdx),L=Math.min(700,pd+260);let x2=e.x+Math.cos(a)*L,y2=e.y+Math.sin(a)*L;if(!G.world){x2=clamp(x2,30,W-30);y2=clamp(y2,30,H-30);}
    const T=.7*tel90('eraser100');e.sk95={st:'warn',t:T,x1:e.x,y1:e.y,x2,y2,L:Math.hypot(x2-e.x,y2-e.y)||1};tg95({k:'line',x:e.x,y:e.y,x2,y2,w:60,T,dmg:0,noHit:true,col:C90.sh,src:e,key:'eraser100',telK:false,fx:false});return;}
  e.zt=(e.zt===undefined?rnd(1.5,3):e.zt)-dt;if(e.zt<=0){e.zt=5;if(Z.filter(z=>z.by&&z.by.type==='eraser100').length<3&&pd<700){const x=G.world?p.x+p.vx*.5:clamp(p.x+p.vx*.5,60,W-60),y=G.world?p.y+p.vy*.5:clamp(p.y+p.vy*.5,60,H-60);
      Z.push({x,y,r:110,tele:Math.max(.45,.6*tel90('eraser100')*tl85()*1.2),t:3,by:e});tel90use('eraser100');snd90('eraseT');}}}
// --- Безымянный: «взгляд» в ответ — луч по линии прицела, «стёртая подпись», окно без брони ---
// буквы «стёртой подписи» — штрихами: снаряды стоят в вершинах, между ними тянется гаснущая чернильная линия
const SIGN95={Ж:[[[0,-1],[0,0],[0,1]],[[-1,-1],[-.5,-.5],[0,0]],[[-1,1],[-.5,.5],[0,0]],[[1,-1],[.5,-.5],[0,0]],[[1,1],[.5,.5],[0,0]]],
  Я:[[[.6,-1],[.6,-.1],[.6,1]],[[.6,-1],[-.2,-1],[-.7,-.55],[-.2,-.1],[.6,-.1]],[[-.1,-.1],[-.4,.45],[-.7,1]]],
  Ф:[[[0,-1],[0,0],[0,1]],[[0,-.55],[-.65,-.45],[-.85,0],[-.65,.45],[0,.55],[.65,.45],[.85,0],[.65,-.45],[0,-.55]]],
  Ш:[[[-1,-1],[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1]],[[0,-1],[0,0],[0,1]]]};
function signShoot95(e,a){const keys=Object.keys(SIGN95),k=keys[Math.random()*keys.length|0],L=SIGN95[k],S=30,cu=Math.cos(a-Math.PI/2),su=Math.sin(a-Math.PI/2),cv=Math.cos(a),sv=Math.sin(a),made={},strokes=[];
  for(const st of L){const row=[];for(const [u,v] of st){const key=u+','+v;let b=made[key];if(!b){const ox=e.x+cv*40+cu*u*S+cv*v*S,oy=e.y+sv*40+su*u*S+sv*v*S;b=shootE(ox,oy,a,230,8*first90(e),'#cfe0da',5);made[key]=b;}if(b)row.push(b);}strokes.push(row);}
  const Ls=G.x90&&inMission()?(G.x90.sig95||(G.x90.sig95=[])):null;if(Ls){if(Ls.length>6)Ls.shift();Ls.push({k,strokes,t0:G.t});}floater(e.x,e.y-e.r-18,'ПОДПИСЬ · '+k,'#cfe0da');}
function signDraw95(){const X=G.x90;if(!X||!X.sig95||!X.sig95.length)return;X.sig95=X.sig95.filter(S=>S.strokes.some(r=>r.some(b=>b.life>0)));ctx.lineCap='round';ctx.lineJoin='round';
  for(const S of X.sig95){const a=clamp(1-(G.t-S.t0)/1.8,.14,1);ctx.strokeStyle=rgba90('#cfe0da',.55*a);ctx.lineWidth=3;for(const r of S.strokes){ctx.beginPath();let pen=false;for(const b of r){if(b.life>0){if(pen)ctx.lineTo(b.x,b.y);else ctx.moveTo(b.x,b.y);pen=true;}else pen=false;}ctx.stroke();}}ctx.lineCap='butt';ctx.lineJoin='miter';}
function nonameAI100(e,dt,c){const p=G.player;const tg=G.tg90===e;if(e.bm95){const B=e.bm95;B.t-=dt;e.vx*=.85;e.vy*=.85;if(B.t<=0){e.bm95=null;}return;}
  e.look=clamp((e.look||0)+(tg?dt:-2*dt),0,5);e.noBar90=1;
  if(e.look>=5&&!(e.bmCd95>G.t)&&p.hp>0){e.bmCd95=G.t+6;const a=Math.atan2(p.y-e.y,p.x-e.x),T=1;e.bm95={t:T+.3};snd95('beam',e.x);floater(e.x,e.y-e.r-16,'ОН СМОТРИТ В ОТВЕТ',C90.sh);
    tg95({k:'line',x:e.x,y:e.y,x2:e.x+Math.cos(a)*1500,y2:e.y+Math.sin(a)*1500,w:34,T,dmg:18,col:'#e8fff6',src:e,key:'noname100',snd:false,on:()=>{snd95('beamFire',e.x);trauma90(.25);e.look=0;weak95(e,2,1.5);e.arm95=2;}});return;}
  if(e.arm95>0)e.arm95-=dt;
  const pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1,m=clamp((pd-300)/120,-1,1);steer(e,pdx/pd*m-pdy/pd*.4*e.dir,pdy/pd*m+pdx/pd*.4*e.dir,e.spd*c.sm,dt,2);
  e.cd-=dt;e.charging=e.cd<.5*tel90('noname100');if(e.cd<=0){e.cd=3.2;tel90use('noname100');tlog95('nonameSign',.5);signShoot95(e,Math.atan2(pdy,pdx));snd95('sign',e.x);}}
function ai100(e,dt,c){switch(e.type){
    case 'eraser100':eraserAI100(e,dt,c);return true;
    case 'hollow100':hollowAI100(e,dt,c);return true;
    case 'witness100':witAI100(e,dt);return true;
    case 'typo100':typoAI100(e,dt,c);return true;
    case 'fixer100':fixerAI100(e,dt,c);return true;
    case 'echo100':echoAI100(e,dt);return true;
    case 'noname100':nonameAI100(e,dt,c);return true;
    case 'tide100':e.alive=false;return true;}
  return false;}
function hurt100(e,dmg,src){switch(e.type){
    case 'witness100':if(e.sh100>0||src.pulse)return 0;if(!e.pHint){e.pHint=1;floater(e.x,e.y-24,'НЕ СТРЕЛЯЙТЕ В СВИДЕТЕЛЯ','#ffffff');}return dmg*.3;
    case 'fixer100':if(e.fx){e.chDmg=(e.chDmg||0)+dmg;if(e.chDmg>=e.maxHp*.15)fixCut100(e);}return dmg;
    case 'noname100':return e.arm95>0?dmg:dmg*(1-Math.min(.7,.15*(e.look||0)));
    case 'typo100':e.hitT100=G.t;if(e.tp&&e.tp.hab==='mirror'){e.mir95=(e.mir95||0)+1;if(e.mir95%5===0){const p=G.player;shootE(e.x,e.y,Math.atan2(p.y-e.y,p.x-e.x),330,7,'#e0fff4',5);e.shieldFlash=.12;snd95('shieldHit',e.x);return 0;}}
      if(e.tp&&e.tp.hab==='twin'&&!e.tw95&&e.hp-dmg<e.maxHp*.5&&e.hp-dmg>0&&G.enemies.filter(o=>o.alive&&o.type==='typo100').length<6){e.tw95=1;const n=spawnEnemy('typo100',e.x+10,e.y+10,{noAffix:true,noLoot:true,spawnT:.3,zone:e.zone,noCap95:1,tw95:1});n.hp=n.maxHp=Math.max(1,(e.hp-dmg)*.5);n.tp=Object.assign({},e.tp);n.tpN=e.tpN.slice();n.tpName=e.tpName;n.gcd=1.5;n.hl=0;n.rwT95=8;floater(e.x,e.y-e.r-20,'ДВОЙНИК',C90.sh);snd95('glitch',e.x);}return dmg;
    case 'hollow100':if(e.hid90){e.vis100=Math.max(e.vis100||0,.6);}return dmg;}
  return dmg;}
function kill100(e,silent){switch(e.type){
    case 'witness100':if(!e.arrived&&!silent){const S=G.save;if(G.mode==='world'&&S&&S.story&&e.bit>=0&&e.bit<12)sh100().lostFrag|=1<<e.bit;floater(e.x,e.y-28,'ОБРЫВОК ПОТЕРЯН',C90.red);snd90('lost');if(G.mc)G.mc.witLost100=1;}break;
    case 'typo100':if(!silent){const S=G.save;if(G.mode==='world'&&S&&S.story){S.story.typo100=(S.story.typo100||0)+1;if(S.story.typo100>=30)own85('typo100');}
      if(e.tp&&e.tp.hab==='split')for(let i=0;i<2;i++){const m=spawnEnemy('mite',e.x,e.y,{noAffix:true,noLoot:true,zone:e.zone});const a=rnd(0,TAU);m.vx=Math.cos(a)*240;m.vy=Math.sin(a)*240;}
      if(e.tp&&e.tp.hab==='boom')mineBlast({x:e.x,y:e.y,alive:true},70,12);}break;
    case 'fixer100':e.fx=null;break;
    case 'noname100':if(!silent&&(e.look||0)<=3)conEvent('look100');break;}}

