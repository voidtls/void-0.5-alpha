/* ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ CINE·PROTO 1.5.1 α «Кадр» · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
   Прототип: миссии 01–04 как четыре главы пролога — «Пробуждение», «Отзвук», «Дрейф», «Тень гиганта» — и эхо в 05.
   КАК ВЫРЕЗАТЬ: удалить всё от строки «CINE·PROTO … НАЧАЛО» до «CINE·PROTO … КОНЕЦ» здесь и такой же блок в CSS,
   убрать m66 из списка сборки. Больше нигде кода нет: всё ниже — обёртки чужих функций, они снимаются вместе с блоком.
   Следы в данных: SET.cine и G.save.cine66 — лишние ключи, старый код их не читает.
   ПРАВИЛА РЕЖИССЁРА (из разбора «кинематографичные миссии 01–04»):
   · бой не меняется: режиссёр только смотрит и рисует, своя случайность (r66), ни одного вызова Math.random;
     единственное, что живёт в симуляции, — радио по событиям, и оно не зависит от настройки «Кино»;
   · управление священно: корабль не забираем; стоп-кадр — только на табличке нового врага и ударе тарана, и только без опасности рядом;
   · один приём за раз и общая очередь с обучением; бюджет: неинтерактив ≤ 8 % миссии, замедление в бою ≤ 1,2 с;
   · первый раз — полностью, дальше — коротко; настройка «Кино: полное / тихое / выкл», «Эффекты», «Тряска», «меньше движения» соблюдаются;
   · под автотестами (navigator.webdriver) кино выключено, пока тест не попросит window.__cine66.
   1.5.1: заголовки без печати по букве и без «ГЛАВА» (печатаются только подсказки — примечание БОРТА и радио);
     своя звуковая шина с залом и панорамой (c66Bus/c66O/c66N/c66Braam), камера холстом (c66Cam), цвет глав (c66Grade). */

const C66={ver:'1.5.1',M:null,last:0,dead:0,err:0,dom:null,bar:0,barT:0,duck:1,duckQ:1,lk:null,mb:null,clearAt:0,won:null,world:null,lcut:null,brief:null,done:null,
  dev:{i:{},d:{},c:{},lc:0},stat:{ms:0,max:0,n:0},log:[]};
const C66CH={
  1:{k:'ГЛАВА I',n:'ПРОБУЖДЕНИЕ',col:'#8fe9ff',tint:'8,14,26',ti:.34},
  2:{k:'ГЛАВА II',n:'ОТЗВУК',col:'#ffb84d',tint:'38,22,6',ti:.30},
  3:{k:'ГЛАВА III',n:'ДРЕЙФ',col:'#e8b98a',tint:'34,20,10',ti:.30},
  4:{k:'ГЛАВА IV',n:'ТЕНЬ ГИГАНТА',col:'#8fb0ff',tint:'4,10,40',ti:.40}};
const C66CARD={scout:['РАЗВЕДЧИК','ЛЁГКАЯ ЦЕЛЬ · ИДЁТ СТАЕЙ'],gunner:['СТРЕЛОК','БЬЁТ ОЧЕРЕДЯМИ · ПЛИТА ЗАКРЫВАЕТ'],rammer:['ТАРАН','СНАЧАЛА ЧЕРТИТ ЛИНИЮ · УХОДИТЕ ВБОК'],
  splitter:['РОЕВИК','РАЗБИТЫЙ — РАСПАДАЕТСЯ НА ТРИ'],miner:['МИНЁР','СЕЕТ МИНЫ · ИМПУЛЬС РВЁТ ИХ ЦЕПЬЮ'],shielder:['ЩИТОНОСЕЦ','ПРИКРЫВАЕТ СОСЕДЕЙ · СНИМАЙТЕ ПЕРВЫМ']};
/* радио Стража по событиям: [миссия, событие, группа и номер строки или свой текст] */
const C66R={1:{w:4,line:['А',0]},2:{w:3,txt:'Следы совпадают. Ему — не сообщать.'},3:{stun:1,txt:'Цель использует рельеф. Быстрее, чем в прошлый раз.'},4:{w:5,line:['А',2]}};
const C66LCUT='Он стреляет первым. Как всегда.';
let r66=mulberry(66);

/* ---------- режим и флаги «уже видел» ---------- */
function c66Mode(){const s=SET.cine||'full';if(s==='off')return 'off';if(s==='calm'||(RMQ&&RMQ.matches))return 'calm';return 'full';}
function c66Bot(){try{return !!navigator.webdriver&&!window.__cine66;}catch(e){return false;}}
function c66Allowed(){if(C66.dead||c66Bot())return false;if(c66Mode()==='off')return false;if(G.devRun&&!(G.dev&&G.dev.cine66)&&C66.force!==G.m)return false;/* «▶» в Верстаке включает кино на эту миссию */return G.mode==='world'||G.mode==='dev';}
function c66Live(){return c66Allowed()&&inMission()&&G.m>=1&&G.m<=5&&!!G.player;}
function c66Store(){if(G.mode==='world'&&G.save){const S=G.save;if(!S.cine66||typeof S.cine66!=='object')S.cine66={i:{},d:{},c:{},lc:0};const F=S.cine66;F.i=F.i||{};F.d=F.d||{};F.c=F.c||{};return F;}return C66.dev;}
const c66Fx=()=>!!SET.fx&&!G.lowFx;
const c66Lite=()=>isMob()&&(G.q||0)<2;                               /* слабый телефон: только основные слои */                                   /* свет и цвет — только при включённых эффектах */
const c66Loud=()=>c66Mode()==='full'&&!!SET.fx&&!SET.lessFx;           /* вспышки, «вертиго», призрак */
function c66Note(k,txt){C66.log.push({t:Math.round((C66.M?C66.M.t:0)*10)/10,k,txt:txt||''});if(C66.log.length>40)C66.log.shift();}

/* ---------- экран: координаты арены → CSS и пиксели холста ---------- */
const c66ox=()=>G.arena?CX:0,c66oy=()=>G.arena?CY:0;
function c66Css(x,y){return [(x-c66ox())*SC,(y-c66oy())*SC];}
function c66Px(x,y){const k=SC*DPR;return [(x-c66ox())*k,(y-c66oy())*k];}
const ease3=x=>1-Math.pow(1-clamp(x,0,1),3),easeIO=x=>{x=clamp(x,0,1);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;};
const env66=(t,a,b,c,d)=>t<a||t>d?0:t<b?(t-a)/(b-a):t<=c?1:1-(t-c)/(d-c);   /* огибающая: нарастание a→b, плато, спад c→d */

/* ---------- DOM: полосы, титр, табличка, подпись, загрузка систем, бортовая строка ---------- */
function c66Dom(){if(C66.dom)return C66.dom;const el=document.createElement('div');el.id='c66';el.setAttribute('aria-hidden','true');el.hidden=true;
  el.innerHTML='<div class="bar66 t"></div><div class="bar66 b"></div><div class="ttl66"><i></i><b></b><span></span></div><div class="card66"><i>НОВАЯ УГРОЗА</i><b></b><span></span></div><div class="cap66"></div><div class="boot66"></div><div class="bort66"></div>';
  document.body.appendChild(el);const q=s=>el.querySelector(s);
  C66.dom={el,bt:q('.bar66.t'),bb:q('.bar66.b'),ttl:q('.ttl66'),card:q('.card66'),cap:q('.cap66'),boot:q('.boot66'),bort:q('.bort66')};return C66.dom;}
function c66Vis(on){const D=C66.dom;if(!D){if(on)c66Dom();else return;}const el=C66.dom.el;if(el.hidden===!on)return;el.hidden=!on;}
function c66BarMax(){return isMob()?(CW>CH?.035:.05):.07;}
function c66Bars(k){C66.barT=k>0?Math.max(.0001,k):0;}

/* ---------- звук 1.5.1: своя кино-шина — длинный зал (свёртка 3,4 с), панорама по экрану, удары, подъёмы, шлейфы ----------
   Своя случайность (r66a) и свой шум: ни одного Math.random — бой не сдвигается. Громкость — по «Музыке» (шина стингеров игры),
   а если музыка выключена, но звуки включены — по «Звукам». Ничего не звучит под автотестами. */
let r66a=mulberry(6601);
function c66NB(){const c=AU.ctx;if(C66.nb&&C66.nb.sampleRate===c.sampleRate)return C66.nb;const len=c.sampleRate*2|0,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<len;i++){const w=r66a()*2-1;l=l*.97+w*.03;d[i]=w*.55+l*2;}return C66.nb=b;}
function c66Bus(){try{if(!AU.ctx||c66Bot())return null;const key=SET.amb&&AU.sting?'s':(SET.sfx&&AU.sfx?'f':null);if(!key)return null;C66.au=C66.au||{};if(C66.au[key])return C66.au[key];
  const c=AU.ctx,dst=key==='s'?AU.sting:AU.sfx,inp=c.createGain();inp.gain.value=key==='s'?1:1.5;inp.connect(dst);
  if(!C66.ir){const sr=c.sampleRate,len=Math.floor(sr*3.4),b=c.createBuffer(2,len,sr);for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);let lp=0;for(let i=0;i<len;i++){const w=r66a()*2-1;lp=lp*.55+w*.45;const k=i/len;d[i]=lp*Math.pow(1-k,2.6)*(i<sr*.015?i/(sr*.015):1)*.9;}}C66.ir=b;}
  const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=160;const cvv=c.createConvolver();cvv.buffer=C66.ir;const wet=c.createGain();wet.gain.value=.5;inp.connect(hp);hp.connect(cvv);cvv.connect(wet);wet.connect(dst);
  return C66.au[key]={inp};}catch(e){return null;}}
C66.vox=0;
function c66Go(n,t){C66.vox++;n.onended=()=>{C66.vox--;};n.start(t);}
/* тон: огибающая — нарастание att, спад до dur; f2 — глиссандо; pan/pan2 — панорама с проездом; lp — фильтр с огибающей [от, пик, до] */
function c66O(t,f,dur,type,vol,o){o=o||{};const B=c66Bus();if(!B||C66.vox>48)return;const c=AU.ctx,os=c.createOscillator(),g=c.createGain();os.type=type;os.frequency.setValueAtTime(f,t);if(o.f2)os.frequency.exponentialRampToValueAtTime(o.f2,t+(o.gl||dur));
  const att=o.att||.01;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+att);g.gain.exponentialRampToValueAtTime(.0001,t+dur);let n=os;
  if(o.lp){const fl=c.createBiquadFilter();fl.type='lowpass';fl.Q.value=o.q||.8;fl.frequency.setValueAtTime(o.lp[0],t);fl.frequency.exponentialRampToValueAtTime(o.lp[1],t+(o.lpA||dur*.25));fl.frequency.exponentialRampToValueAtTime(o.lp[2],t+dur);n.connect(fl);n=fl;}
  n.connect(g);n=g;if(o.pan!==undefined){const p=c.createStereoPanner();p.pan.setValueAtTime(clamp(o.pan,-1,1),t);if(o.pan2!==undefined)p.pan.linearRampToValueAtTime(clamp(o.pan2,-1,1),t+dur);n.connect(p);n=p;}n.connect(B.inp);c66Go(os,t);os.stop(t+dur+.05);}
/* шум: тип фильтра, частота f→f2, добротность q */
function c66N(t,dur,vol,type,f,o){o=o||{};const B=c66Bus();if(!B||C66.vox>48)return;const c=AU.ctx,s=c.createBufferSource();s.buffer=c66NB();s.loop=dur>1.9;s.playbackRate.value=o.rate||1;const fl=c.createBiquadFilter();fl.type=type;fl.frequency.setValueAtTime(f,t);if(o.f2)fl.frequency.exponentialRampToValueAtTime(o.f2,t+dur);fl.Q.value=o.q||1;
  const g=c.createGain(),att=o.att||Math.min(.02,dur/3);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+att);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(fl);fl.connect(g);let n=g;
  if(o.pan!==undefined){const p=c.createStereoPanner();p.pan.setValueAtTime(clamp(o.pan,-1,1),t);if(o.pan2!==undefined)p.pan.linearRampToValueAtTime(clamp(o.pan2,-1,1),t+dur);n.connect(p);n=p;}n.connect(B.inp);c66Go(s,t);s.stop(t+dur+.05);}
const c66Pan=x=>x==null?0:clamp((x-W/2)/(W/2),-1,1)*.8;
function c66Root(){try{if(typeof MZ!=='undefined'&&MZ.anyLive&&MZ_TR[MZ.want])return MZ_TR[MZ.want].root;}catch(e){}const P=MUS.cur;return P?P.sc.root+P.semi:38;}
/* «брам»: две пилы в квинту под закрывающимся фильтром — трейлерный удар */
function c66Braam(t,base,vol,dur,lpPeak){for(const [m,v] of [[0,1],[7,.7],[12,.35]])c66O(t,mtof(base+m),dur,'sawtooth',vol*v,{att:.04,lp:[90,lpPeak||1300,110],lpA:.35,q:1.2});c66O(t,mtof(base)/2,dur*.9,'sine',vol*3.2,{att:.02});c66N(t,dur*.5,vol*1.4,'lowpass',500,{f2:90,att:.01});}
function c66Sting(kind,arg,x){if(!AU.ctx||c66Bot())return;const sfxOn=!!SET.sfx&&!!AU.sfx;
  const c=AU.ctx,t=c.currentTime+.02,r=c66Root(),pan=c66Pan(x);try{
  if(kind==='heart'){if(sfxOn){thump(52,.5);thump(49,.42,.36);}c66O(t,46,.5,'sine',.32,{f2:30});c66O(t+.36,44,.5,'sine',.26,{f2:28});return;}
  if(!c66Bus())return;
  switch(kind){
  case 'open':/* корабль просыпается: низкий гул нарастает из тишины, сверху — далёкое «стекло» */
    c66O(t,38,4.6,'sine',.34,{att:2.2,f2:46,gl:4});c66O(t,mtof(r-12),4.4,'triangle',.05,{att:2.4,lp:[120,700,200],lpA:3});c66N(t,4.2,.12,'lowpass',90,{f2:420,att:2.6});
    for(const [d,iv] of [[1.2,24],[1.9,31],[2.6,36]])c66O(t+d,mtof(r+iv),3.4,'sine',.022,{att:.9});break;
  case 'title':{const m=arg||1;
    if(m===1){c66O(t,64,1.6,'sine',.42,{f2:36,att:.01});for(const iv of [24,31,36,43])c66O(t+.02,mtof(r+iv),4.2,'sine',.028,{att:.35});c66N(t,1.8,.07,'highpass',5000,{att:.5});}
    if(m===2){c66O(t,70,1.3,'sine',.4,{f2:34});for(let k=0;k<5;k++){const a=.06*Math.pow(.62,k);c66O(t+k*.26,mtof(r+19),.9,'triangle',a,{pan:k%2?.5:-.5});c66N(t+k*.26,.25,a*.9,'bandpass',2600,{q:4,pan:k%2?-.4:.4});}}
    if(m===3){c66O(t,78,1.4,'sine',.55,{f2:30});c66N(t,.9,.35,'lowpass',1400,{f2:120});c66O(t,mtof(r-12),2.2,'sawtooth',.06,{lp:[200,900,120],lpA:.15});c66N(t+.05,2.4,.08,'bandpass',300,{f2:90,q:1.4,att:.3});}
    if(m===4){c66Braam(t,r-24,.075,4.4,1500);for(const iv of [24,27,31])c66O(t+.05,mtof(r+iv),4.2,'sine',.018,{att:.6});}
    break;}
  case 'riser':{const d=arg||1;c66N(t,d+.06,.16,'bandpass',260,{f2:4200,q:1.1,att:d});c66O(t,mtof(r+12),d+.05,'sine',.025,{f2:mtof(r+24),att:d*.95});c66N(t,d+.06,.05,'highpass',4000,{att:d});break;}
  case 'boot':{const iv=[12,16,19,24][arg|0]||12;c66N(t,.04,.16,'highpass',2500);c66O(t,mtof(r+iv),2.8,'sine',.075,{att:.015});c66O(t,mtof(r+iv)*2,.45,'triangle',.02);break;}
  case 'bootDone':for(const iv of [12,16,19,24,28])c66O(t+iv*.004,mtof(r+iv),3.6,'sine',.03,{att:.25});c66O(t,mtof(r+36),3,'sine',.012,{att:.8});break;
  case 'chime':{const f=mtof(r+24+[0,4,7,12][Math.min(3,arg|0)]);c66O(t,f,3.8,'sine',.15,{pan,att:.004});c66O(t,f*2.76,1.6,'sine',.045,{pan,att:.004});c66O(t,f*5.4,.8,'sine',.022,{pan,att:.004});c66O(t,f/2,2.4,'sine',.06,{att:.01});c66N(t,1.2,.05,'highpass',6000,{att:.4,pan});break;}
  case 'sub':c66O(t,96,1.5,'sine',.6,{f2:26,att:.004});c66N(t,.9,.28,'lowpass',600,{f2:70,att:.005});c66N(t,.35,.08,'bandpass',3000,{f2:600,q:1.5});break;
  case 'tail':for(const iv of [12,19,26,31])c66O(t+iv*.006,mtof(r+iv),4.6,'triangle',.05,{att:.5});c66O(t+.3,mtof(r+43),3.2,'sine',.01,{att:1});break;
  case 'whooshIn':c66N(t,.6,.2,'bandpass',4200,{f2:220,q:1.3,att:.05,pan:-.3,pan2:.3});c66O(t,880,.55,'sine',.035,{f2:110});c66O(t+.05,55,.9,'sine',.25,{f2:34,att:.05});break;
  case 'whooshOut':c66N(t,.5,.12,'bandpass',220,{f2:3400,q:1.3,att:.42,pan:.3,pan2:-.3});break;
  case 'whiz':c66N(t,.42,.08,'bandpass',2600,{f2:1500,q:3,att:.15,pan:c66Pan(arg),pan2:pan});c66O(t,1900,.35,'sine',.012,{f2:1300,att:.12,pan:c66Pan(arg),pan2:pan});break;
  case 'tink':c66O(t,3300,.4,'triangle',.055,{f2:2900,pan});c66O(t,6700,.18,'sine',.02,{pan});break;
  case 'echo':for(let k=0;k<(arg||3);k++)c66O(t+k*.21,1500+k*140,.18,'sine',.02,{pan:k%2?.4:-.4});break;
  case 'rumble':c66N(t,2.4,.26,'lowpass',110,{f2:260,att:1.7,pan});c66O(t,34,2.3,'sine',.42,{att:1.8});c66N(t+1.6,.8,.07,'bandpass',900,{q:2,pan});break;
  case 'impact':c66O(t,84,1.1,'sine',.65,{f2:28,att:.003});c66N(t,.7,.42,'lowpass',2200,{f2:120,att:.003,pan});c66O(t,240,.9,'triangle',.06,{f2:170,pan});c66N(t+.02,.25,.1,'highpass',3000,{pan});c66O(t+.15,mtof(r-12),2.6,'sawtooth',.045,{lp:[300,800,100],lpA:.1});break;
  case 'whoomp':c66O(t,120,1,'sine',.42,{f2:38});c66N(t,.8,.14,'bandpass',500,{f2:2400,q:1,att:.05});c66N(t+.1,1.4,.06,'highpass',3000,{att:.3});break;
  case 'note':{const P5=PENTA&&PENTA.length?PENTA:[523.25,587.33,659.25,783.99,880],i=arg||0,f=P5[i%5]*(i>=5?2:1);c66O(t,f,1.6,'triangle',.1,{att:.005,pan});c66O(t,f*2,.7,'sine',.028,{att:.005,pan});break;}
  case 'shadow':c66N(t,4.4,.26,'lowpass',90,{f2:220,att:1.2});c66O(t,34,4.6,'sawtooth',.11,{att:1.4,lp:[60,380,70],lpA:2});c66O(t,51,4.4,'sawtooth',.07,{att:1.6,lp:[60,320,70],lpA:2.2});c66O(t,27,4.8,'sine',.5,{att:1.6});
    c66N(t+.8,3,.09,'bandpass',220,{f2:130,q:9,att:1.4});c66O(t+.6,mtof(r-12+1),3.6,'sawtooth',.02,{att:1.4,lp:[200,600,150],lpA:2});break;
  case 'search':c66N(t,.12,.4,'lowpass',380);c66O(t,62,.5,'sine',.5,{f2:40});c66O(t+.08,100,1.9,'triangle',.02,{att:.2});c66O(t+.08,150,1.9,'triangle',.012,{att:.2});c66N(t+.1,1.6,.04,'bandpass',1400,{q:2,att:.4});c66O(t+.25,mtof(r+31),1.8,'sine',.02,{att:.4});break;
  case 'glitch':c66N(t,.12,.07,'bandpass',3000,{q:2});c66N(t+.18,.08,.06,'bandpass',2000,{q:2});c66O(t+.05,90,.12,'square',.03);break;
  case 'ghost':c66N(t,1.05,.12,'highpass',2500,{att:.95});c66O(t+.2,5200,1.6,'sine',.012,{att:.4});c66O(t+1,mtof(r+30),1.4,'sine',.02,{f2:mtof(r+29)});break;
  case 'reveal':c66O(t,150,.4,'sine',.32,{f2:70});c66O(t,mtof(r+24),1.4,'sine',.035,{att:.01});c66O(t,mtof(r+31),1.1,'sine',.02,{att:.06});c66N(t,.6,.05,'bandpass',2400,{q:4});break;
  }}catch(e){C66.aerr=kind+': '+e;}}
/* музыка: приглушение и тишина — через общий «пригиб» музыки, его же слушает записанная музыка */
function c66Duck(v,T){const M=C66.M;if(!M)return;M.dk={v,until:M.t+T};}

/* ---------- бюджет и очередь с обучением ---------- */
function c66Danger(){const p=G.player;if(!p||p.hp<=0)return true;if(p.hp<(G.st&&G.st.maxHp||100)*.35)return true;
  for(const b of G.eb||[]){if(b.life<=0)continue;if(Math.hypot(b.x-p.x,b.y-p.y)<170)return true;}
  for(const e of G.enemies||[]){if(!e.alive||e.spawnT>0||e.type==='mine'||(EDEF[e.type]&&EDEF[e.type].passive))continue;if(Math.hypot(e.x-p.x,e.y-p.y)<(e.r||14)+120)return true;}return false;}
function c66NIcap(M){const exp={1:90,2:100,3:110,4:120,5:120}[M.m]||100;return exp*.08;}
function c66Slow(T,k){const M=C66.M;if(!M||c66Mode()!=='full')return false;if(M.slow+T>1.2)return false;M.slow+=T;slow95(T,k);c66Sting('whooshIn');setTimeout(()=>{if(C66.M===M)c66Sting('whooshOut');},Math.max(0,T*1000-280));return true;}
function c66Freeze(d){const M=C66.M;if(!M||c66Mode()!=='full'||!M.full)return false;if(M.ni+d>c66NIcap(M)||c66Danger())return false;M.ni+=d;hs90(d,1);return true;}
function c66TutHold(s){try{if(typeof TUT!=='undefined'&&TUT)TUT.gap=Math.max(TUT.gap||0,s);}catch(e){}}
const c66TutBusy=()=>{try{return typeof TUT!=='undefined'&&!!TUT&&!!TUT.cur;}catch(e){return false;}};

/* ---------- начало и конец миссии ---------- */
function c66Begin(){const m=G.m,F=c66Store();const first=!F.i[m],full=!F.d[m];if(first)F.i[m]=1;
  r66=mulberry(((G.layoutSeed||1)^(m*2654435761))>>>0);
  const M=C66.M={m,t:0,first,full,mode:c66Mode(),ni:0,slow:0,did:{},w:G.waveIdx||0,stun:(G.mc&&G.mc.s1stun)||0,refl:(G.mc&&G.mc.s1refl)||0,pulses:(G.mc&&G.mc.pulses)||0,
    taken:G.taken,kills:G.kills,xp:G.xp,lvl:G.lvl,chains:{},chainCine:0,rings:[],tr:[],marks:[],dust:[],puffs:[],lights:null,shadow:null,search:null,ghost:null,kc:null,boot:null,est:null,stra:null,
    ttl:null,card:null,cap:null,bort:null,dk:null,flash:0,fl:[],bl:{},lpUntil:0,dCards:[],warnSeen:{},cyc:cycleN()};
  c66Note('begin',(first?'первый показ':full?'до первой победы':'повтор')+' · '+M.mode);
  /* полосы на входе: в 01 — веки открываются (рифма с прологом), в 04 — общий план, в остальных — короткая рамка */
  if(first){if(m===1){C66.bar=.5;M.lids=1;M.barOff=2.9;M.open={s:isMob()?1.3:1.5};}else if(m===4){C66.bar=c66BarMax()*1.2;c66Bars(c66BarMax()*1.2);M.barOff=1.5;}else if(m<=3){C66.bar=c66BarMax();c66Bars(c66BarMax());M.barOff=1.3;}}
  if(m<=4)M.ttl={at:first?(m===1?2.6:m===2?1.35:m===3?.6:1.25):.35,short:!first};
  if(m===2&&first)M.dolly={s:1.07,T:2.6};/* 02: медленный наезд, пока летят чужие трассеры */
  if(m===2&&first)M.barOff=2.4;
  if(m===4&&first)M.riserAt=.2;/* 04: подъём шума ведёт к удару на титре */
  if(m===1&&first)c66BootStart(M);
  if(m===1&&first){c66Sting('heart');c66Sting('open');}
  if(m===4&&first&&M.mode==='full'&&SET.fx)M.est={t:0,T:1.6};
  if(m===4)c66Mines(M);
  if(m===3)c66DustInit(M);
  if(m===5&&!c66Store().e5){c66Store().e5=1;M.far5={t:0};}
  if(m===4&&(full||M.cyc>1))M.stra={x:W*.79,y:H*.08,on:1,a:0};
}
function c66End(){const M=C66.M;C66.M=null;C66.bar=0;C66.barT=0;C66.duckQ=1;c66BootEnd(true);c66CamReset();
  const D=C66.dom;if(D){D.bt.style.height=D.bb.style.height='0';D.ttl.className='ttl66';D.card.className='card66';D.cap.className='cap66';D.bort.className='bort66';D.boot.innerHTML='';}
  c66Vis(false);if(M)c66Note('end');}

/* ---------- 01: «загрузка систем» — интерфейс зажигается по частям, когда нужен ---------- */
const C66BOOT=[['wpn','АВТОНАВЕДЕНИЕ','В СЕТИ','#hud .hud-b .chips,#score'],['hull','КОРПУС','В СЕТИ','#hud .hud-tl'],['sig','СИГНАЛ ЦЕЛИ','ПРИНЯТ','#hud .hud-tc'],['data','ДАННЫЕ','ПРИЁМ','#hud .hud-b .bar.xp']];
function c66BootStart(M){const hud=document.getElementById('hud');if(!hud)return;M.boot={on:{},lines:[]};hud.classList.add('c66boot');
  for(const [k,,,sel] of C66BOOT)hud.parentNode.querySelectorAll(sel).forEach(el=>{el.classList.add('c66off');el.dataset.c66=k;});
  c66BootLine('СИСТЕМЫ','ЗАПУСК',1);}
function c66BootLine(a,b,dim){const D=c66Dom();const row=document.createElement('div');row.className='bl66'+(dim?' dim':'');row.innerHTML=`<b>${a}</b><i></i><span>${b}</span>`;D.boot.appendChild(row);
  while(D.boot.children.length>4)D.boot.firstChild.remove();setTimeout(()=>{row.classList.add('out');},3200);setTimeout(()=>{row.remove();},3900);}
function c66BootOn(M,k){const B=M.boot;if(!B||B.on[k])return;B.on[k]=1;const it=C66BOOT.find(x=>x[0]===k);
  document.querySelectorAll(`[data-c66="${k}"]`).forEach(el=>{el.classList.remove('c66off');el.classList.add('c66in');setTimeout(()=>el.classList.remove('c66in'),700);});
  if(it){c66BootLine(it[1],it[2]);c66Sting('boot',Object.keys(B.on).length-1);}c66Note('boot',k);
  if(C66BOOT.every(x=>B.on[x[0]])){c66BootEnd(false);setTimeout(()=>{if(C66.M&&C66.M.m===1)c66Sting('bootDone');},260);}}
function c66BootEnd(hard){const hud=document.getElementById('hud');document.querySelectorAll('[data-c66]').forEach(el=>{el.classList.remove('c66off');if(hard)el.classList.remove('c66in');delete el.dataset.c66;});if(hud)hud.classList.remove('c66boot');
  if(C66.M&&C66.M.boot)C66.M.boot.done=1;}
function c66BootTick(M){const B=M.boot;if(!B||B.done)return;const p=G.player,t=M.t;
  if((G.pb&&G.pb.length)||G.kills>M.kills||t>4)c66BootOn(M,'wpn');
  if(G.taken>M.taken||t>6.5)c66BootOn(M,'hull');
  if((G.waveIdx||0)>=2||t>10)c66BootOn(M,'sig');
  if(G.xp>M.xp||G.lvl>M.lvl||t>12.5)c66BootOn(M,'data');
  if(t>14||(p&&p.hp<(G.st.maxHp||100)*.5))for(const x of C66BOOT)c66BootOn(M,x[0]);}

/* ---------- титр миссии 1.5.1: только название миссии, без «ГЛАВА» и без печати по букве ----------
   Появляется целиком, как титр в кино: из размытия, с широкой разрядкой, которая собирается, и бликом света по буквам. */
function c66TitleName(m){const Mi=MISSIONS[m-1];return Mi?mTitle(Mi).toUpperCase():'';}
function c66TitleTick(M,dt){const T=M.ttl;if(!T)return;const D=c66Dom(),ch=C66CH[M.m];if(!ch){M.ttl=null;return;}
  if(!T.on){if(M.t<T.at||M.card)return;if(c66TutBusy()&&M.t<T.at+3)return;T.on=1;T.t=0;const nm=c66TitleName(M.m);
    D.ttl.querySelector('i').textContent='';D.ttl.querySelector('span').textContent='';D.ttl.style.setProperty('--c66',ch.col);D.ttl.className='ttl66'+(T.short?' short':'');
    c66TitlePlace(D,nm,T.short);void D.ttl.offsetWidth;D.ttl.classList.add('on');if(!T.short){c66Sting('title',M.m);if(M.m===3&&M.mode==='full'&&SET.fx&&G.player)M.punch={t:0,T:.5,s:1.045,x:G.player.x,y:G.player.y};}c66TutHold(T.short?2:3.8);c66Note('title',nm+' · '+(D.ttl.dataset.q66||''));}
  T.t+=dt;const life=c66TitleLife(T);if(T.t>life&&!T.out){T.out=1;D.ttl.classList.add('out');}if(T.t>life+.9){D.ttl.className='ttl66';M.ttl=null;}}
const c66TitleLife=T=>T.short?1.8:3.6;
/* место титра: из четырёх «третей» экрана — та, что дальше всего от корабля, буёв и плит (титр не ложится на игрока) */
function c66TitlePlace(D,name,short){const el=D.ttl,b=el.querySelector('b');el.classList.remove('r66');el.style.left=el.style.right=el.style.top=el.style.bottom='';
  b.textContent=name;const w=el.offsetWidth||320,h=el.offsetHeight||90;
  const sl=SAFE.l||0,sr=SAFE.r||0,st=SAFE.t||0,sb=SAFE.b||0,mx=Math.max(CW*.07,20),mob=isMob(),hudT=(mob?64:76)+st,hudB=(mob?150:90)+sb;
  const objs=[];const p=G.player;if(p){const [x,y]=c66Css(p.x,p.y);objs.push([x,y,1]);}
  const S=G.s1;for(const o of ((S&&S.buoys)||[]).concat((S&&S.plates)||[])){const [x,y]=c66Css(o.x,o.y);objs.push([x,y,.45]);}
  const ys=[CH*(short?.62:.6),CH*(mob?.2:.24)].map(y=>clamp(y,hudT,CH-hudB-h)),C=[];
  for(const y of ys)for(const right of [0,1]){const x0=right?CW-mx-sr-w:mx+sl;let sc=1e9;
    for(const [ox,oy,wt] of objs){const dx=Math.max(x0-ox,0,ox-(x0+w)),dy=Math.max(y-oy,0,oy-(y+h));sc=Math.min(sc,Math.hypot(dx,dy)/wt+(wt<1?60:0));}
    C.push({y,right,sc:Math.min(sc,400)-(right?14:0)-C.length*3});}
  C.sort((a,b)=>b.sc-a.sc);const c=C[0];el.style.top=Math.round(c.y)+'px';el.style.bottom='auto';
  if(c.right){el.classList.add('r66');el.style.left='auto';el.style.right=Math.round(mx+sr)+'px';}else el.style.left=Math.round(mx+sl)+'px';el.dataset.q66=(c.right?'справа':'слева')+(c.y>CH/2?' внизу':' вверху');}

/* ---------- табличка нового врага: имя и одна строка, короткий стоп-кадр без опасности рядом ---------- */
function c66CardTick(M,dt){const F=c66Store(),D=c66Dom();
  if(M.card){const C=M.card;C.t+=dt;if(C.t>2.6&&!C.out){C.out=1;D.card.classList.add('out');}if(C.t>3.2){D.card.className='card66';M.card=null;}return;}
  if(!M.full||M.m>4||M.m===1)return;if(M.ttl&&!M.ttl.out)return;/* один приём за раз: титр главы сначала */const intro=(MISSIONS[M.m-1]&&MISSIONS[M.m-1].intro)||[];
  for(const w of G.warns||[]){if(!intro.includes(w.type)||F.c[w.type]||M.warnSeen[w.type]||w.t>.7)continue;
    if(c66TutBusy()&&M.m>1)continue;/* урок обучения на экране — табличка дождётся следующего такого же врага */M.warnSeen[w.type]=1;F.c[w.type]=1;const L=C66CARD[w.type]||[(EDEF[w.type]&&EDEF[w.type].name||'').toUpperCase(),''];
    D.card.querySelector('b').textContent=L[0];D.card.querySelector('span').textContent=L[1];D.card.style.setProperty('--c66',(EDEF[w.type]&&EDEF[w.type].col)||'#dfe8ff');
    const [x,y]=c66Css(w.mx!==undefined?w.mx:w.x,w.my!==undefined?w.my:w.y);D.card.style.width='';D.card.style.left='0px';const cw=Math.min(D.card.offsetWidth||300,CW-32);/* по тексту, без висячих слов */let L_=x<CW/2?x+28:x-28-cw,T_=clamp(y-30,70+(SAFE.t||0),CH-140-(SAFE.b||0));L_=clamp(L_,16+(SAFE.l||0),CW-cw-16-(SAFE.r||0));
    D.card.style.left=L_+'px';D.card.style.top=T_+'px';D.card.className='card66 on';M.card={t:0,type:w.type};
    const frz=M.m>1&&c66Freeze(.42);c66Sting('reveal');c66TutHold(2.6);c66Note('card',w.type+(frz?' · стоп-кадр':''));break;}}

/* ---------- подпись к приёму: «ОГЛУШЁН · УРОН ×2», «СКВОЗЬ ОГОНЬ» ---------- */
function c66Cap(txt,x,y,col,T,below){const D=c66Dom(),M=C66.M;if(!M)return;const [cx,cy0]=c66Css(x,y),cy=below?cy0+92:cy0;D.cap.textContent=txt;D.cap.style.setProperty('--c66',col||'#ffd24d');
  D.cap.style.left=clamp(cx,90,CW-90)+'px';D.cap.style.top=clamp(cy-58,80+(SAFE.t||0),CH-120)+'px';D.cap.className='cap66';void D.cap.offsetWidth;D.cap.className='cap66 on';M.cap={t:0,T:T||1.6};}
function c66CapTick(M,dt){const C=M.cap;if(!C)return;C.t+=dt;if(C.t>C.T){C66.dom.cap.className='cap66';M.cap=null;}}

/* ---------- ненадёжный рассказчик: бортовая строка с глитчем ---------- */
function c66Bort(M,txt,T){const D=c66Dom();M.bort={t:0,T:T||2.8,txt};D.bort.textContent=txt;D.bort.className='bort66 on';c66Sting('glitch');}
function c66BortTick(M,dt){const B=M.bort;if(!B)return;B.t+=dt;const D=C66.dom;
  if(B.t<1.2&&r66()<.25){const s=B.txt.replace(/3 %/,()=>Math.floor(r66()*9+1)+' %');D.bort.textContent=s;}else if(D.bort.textContent!==B.txt&&r66()<.3)D.bort.textContent=B.txt;
  if(B.t>B.T&&!B.out){B.out=1;D.bort.classList.add('out');}if(B.t>B.T+.6){D.bort.className='bort66';M.bort=null;}}

/* ---------- кольца в арене (свои, не игровые) ---------- */
function c66Flare(x,y,col,L,T){const M=C66.M;if(!M||!c66Fx())return;if(M.fl.length>6)M.fl.shift();M.fl.push({x,y,col:col||'#cfeaff',L:L||280,T:T||.7,t:0});}
function c66Ring(x,y,R,col,T,w){const M=C66.M;if(!M)return;if(M.rings.length>12)M.rings.shift();M.rings.push({x,y,R,col,T:T||.9,t:0,w:w||2});}

/* ---------- финальный удар: каше, замедление, тишина, кольцо ---------- */
function c66KillCam(M){if(M.kc)return;const lk=C66.lk&&c66Clk()-C66.lk.at<1500?/* ARCH·74 A-21 */C66.lk:{x:G.player.x,y:G.player.y};
  M.kc={t:0,x:lk.x,y:lk.y};const lite=!M.full;c66Note('killcam',lite?'коротко':'полностью');
  if(!lite)c66Bars(c66BarMax());if(M.mode==='full')slow95(lite?.45:.9,lite?.45:.25);M.kc.cam=M.mode==='full'&&!!SET.fx;c66Sting('sub',0,lk.x);
  c66Duck(M.m===3?.02:.03,M.m===3?1.25:.8);c66Flare(lk.x,lk.y,C66CH[M.m]?C66CH[M.m].col:'#ffffff',lite?220:380,1);if(M.mode==='full')M.lpUntil=M.t+(lite?.6:1.3);c66Ring(lk.x,lk.y,lite?160:260,C66CH[M.m]?C66CH[M.m].col:'#ffffff',1.1,lite?1.5:2.5);
  setTimeout(()=>{if(C66.M===M)c66Sting('tail');},M.m===3?1250:820);
  if(M.full&&M.m===1)M.kc.bortAt=.95;
  if(M.full&&M.m===2)M.kc.echoAt=.45;
  if(M.full&&M.m===4&&M.cyc<3)M.search={t:-.55,T:1.9};}
function c66KillCamTick(M,dt){const K=M.kc;if(!K)return;K.t+=dt;
  if(K.bortAt!==undefined&&K.t>=K.bortAt){K.bortAt=undefined;c66Bort(M,'СВЕРКА ПАМЯТИ: РАСХОЖДЕНИЕ 3 % · ИГНОРИРОВАТЬ',2.6);}
  if(K.echoAt!==undefined&&K.t>=K.echoAt){K.echoAt=undefined;const p=G.player,a=-Math.PI/2+(r66()-.5)*1.2;M.tr.push({x:p.x,y:p.y,vx:Math.cos(a)*560,vy:Math.sin(a)*560,t:0,T:1.6,fin:1});c66Ring(p.x,p.y,46,shipBul(),.9,1.5);c66Sting('echo',1);c66Note('echo','последний трассер — раньше него');}
  if(K.t>1.6&&!M.search)c66Bars(0);}

/* ---------- 02: эхо — чужие трассеры «вашего типа» и отметины на плитах ---------- */
function c66EchoStart(M){const S=G.s1;if(!S||!S.plates||!S.plates.length)return;const n=7;
  for(let i=0;i<n;i++){const pl=S.plates[i%S.plates.length],side=r66()*4|0;let x,y;if(side===0){x=-40;y=r66()*H;}else if(side===1){x=W+40;y=r66()*H;}else if(side===2){x=r66()*W;y=-40;}else{x=r66()*W;y=H+40;}
    const tx=pl.x+(r66()-.5)*pl.L*1.4,ty=pl.y+(r66()-.5)*10,d=Math.hypot(tx-x,ty-y)||1,sp=760+r66()*240;
    M.tr.push({x,y,vx:(tx-x)/d*sp,vy:(ty-y)/d*sp,t:-i*.24-.15,T:d/sp,pl,tx,ty});}
  c66Sting('echo',4);c66Note('echo','7 трассеров');}
function c66TracerTick(M,dt){for(const q of M.tr){q.t+=dt;if(q.t<0)continue;if(!q.snd){q.snd=1;c66Sting('whiz',q.x,q.tx!==undefined?q.tx:q.x+q.vx*.5);}q.x+=q.vx*dt;q.y+=q.vy*dt;
    if(q.pl&&!q.hit&&q.t>=q.T){q.hit=1;c66Sting('tink',0,q.x);const pl=q.pl,c=Math.cos(-pl.a),s=Math.sin(-pl.a),dx=q.x-pl.x,dy=q.y-pl.y;M.marks.push({pl,u:clamp(dx*c-dy*s,-pl.L+4,pl.L-4),v:clamp(dx*s+dy*c,-6,6),t:0});}}
  M.tr=M.tr.filter(q=>q.t<0||(q.pl?q.t<q.T+.18:q.t<q.T));for(const k of M.marks)k.t+=dt;M.marks=M.marks.filter(k=>k.t<26);}

/* ---------- 03: пыль дрейфа ---------- */
function c66DustInit(M){M.dust=[];for(let i=0;i<46;i++)M.dust.push({x:r66()*W,y:r66()*H,s:1+r66()*2.2,a:.08+r66()*.16,k:.6+r66()*.8});}
/* ---------- 04: дальнее минное поле и огни мин ---------- */
function c66Mines(M){M.lights=[];for(let i=0;i<54;i++)M.lights.push({x:r66()*1.3-.15,y:r66()*1.3-.15,ph:r66()*6,T:1.6+r66()*1.6,s:1.4+r66()*1.6});}

/* ---------- 04: тень гиганта ---------- */
function c66ShadowStart(M){const cy=M.cyc;c66Note('shadow',cy>=3?'цикл III+: не приходит':cy===2?'цикл II: останавливается':'проходит');
  if(cy>=3){M.shadow={t:0,T:2.2,ghost:1};c66Duck(.05,2.2);c66Sting('shadow');return;}
  const Lh=H*2.4,Wd=Math.max(W*.5,420);M.shadow={t:0,T:cy===2?4.2:3.4,halt:cy===2,Lh,Wd,a:-.22,x0:-Wd*.7,x1:W+Wd*.7,y:H*.5};c66Duck(.04,M.shadow.T);c66Sting('shadow');}
function c66ShadowPos(Sh){const k=Sh.t/Sh.T;let x;if(Sh.halt){const mid=W*.42;x=k<.4?Sh.x0+(mid-Sh.x0)*easeIO(k/.4):k<.68?mid:mid+(Sh.x0-mid)*easeIO((k-.68)/.32);}else x=Sh.x0+(Sh.x1-Sh.x0)*easeIO(k);return x;}
function c66InShadow(x,y){const M=C66.M,Sh=M&&M.shadow;if(!Sh)return 0;if(Sh.ghost)return env66(Sh.t,.2,.5,1.5,2)*.9;const cx=c66ShadowPos(Sh),c=Math.cos(Sh.a),s=Math.sin(Sh.a),dx=x-cx,dy=y-Sh.y,u=dx*c+dy*s,v=-dx*s+dy*c;
  const q=Math.pow(v/(Sh.Lh/2),2)+Math.pow(u/(Sh.Wd/2),2);return q<1?clamp((1-q)*3,0,1):0;}
function c66ShadowPath(Sh,sc){const cx=c66ShadowPos(Sh);ctx.save();ctx.translate(cx,Sh.y);ctx.rotate(Sh.a);ctx.beginPath();const N=44;
  for(let i=0;i<=N;i++){const th=i/N*TAU,bump=1+.05*Math.sin(th*7)+.03*Math.sin(th*17+1)+(Math.abs(Math.sin(th))>.92?.06:0);ctx.lineTo(Math.cos(th)*Sh.Wd/2*sc*bump,Math.sin(th)*Sh.Lh/2*sc*bump);}
  ctx.closePath();ctx.restore();}
function c66ShadowDraw(Sh,aCore){const fade=env66(Sh.t,0,.35,Sh.T-.4,Sh.T);if(fade<=0)return;ctx.fillStyle='#010208';
  for(const [sc,a] of [[1.12,.10],[1.06,.14],[1,1]]){ctx.globalAlpha=a*aCore*fade;c66ShadowPath(Sh,sc);ctx.fill();}
  /* холодный контур — край корпуса ловит дальний свет, тень читается как предмет, а не дыра */
  if(aCore>.5){c66ShadowPath(Sh,1.005);ctx.strokeStyle='#5d7fd6';ctx.lineWidth=1.5;ctx.globalAlpha=.16*fade;ctx.stroke();c66ShadowPath(Sh,1.03);ctx.strokeStyle='#2c3f78';ctx.lineWidth=6;ctx.globalAlpha=.07*fade;ctx.stroke();}
  /* рёбра корпуса — едва видны */
  const cx=c66ShadowPos(Sh);ctx.save();ctx.translate(cx,Sh.y);ctx.rotate(Sh.a);ctx.strokeStyle='#1b2a52';ctx.lineWidth=2;ctx.globalAlpha=.10*fade*aCore;
  for(let v=-Sh.Lh/2+60;v<Sh.Lh/2;v+=70){const hw=Sh.Wd/2*Math.sqrt(Math.max(0,1-Math.pow(v/(Sh.Lh/2),2)))*.92;ctx.beginPath();ctx.moveTo(-hw,v);ctx.lineTo(hw,v+18);ctx.stroke();}
  ctx.restore();ctx.globalAlpha=1;}

/* ---------- 1.5.1: КАМЕРА — наезды и отъезды холстом (интерфейс не двигается), фокус и экспозиция на входе ----------
   Только когда игроку ничего не грозит: вход в миссию, финальный удар (бой окончен), удар тарана без опасности рядом, тень между волнами.
   «Тихое» кино и выключенные эффекты — без движения камеры; слабый телефон — без размытия. */
function c66Cam(M,dt){const p=G.player;let s=1,ox=null,oy=null,blur=0,br=1;const mv=M.mode==='full'&&!!SET.fx,lite=c66Lite();
  if(M.open){const t=M.t;if(mv)s*=M.open.s+(1-M.open.s)*easeIO(clamp((t-.75)/2.6,0,1));if(M.mode==='full'&&SET.fx)blur=10*(1-easeIO(clamp((t-.75)/1.7,0,1)));br=.5+.5*ease3(clamp((t-.6)/1.9,0,1));if(t>3.6)M.open=null;}
  if(M.est){const E=M.est;E.t+=dt;s*=.86+.14*easeIO(E.t/E.T);if(E.t>=E.T)M.est=null;}
  if(M.dolly&&mv){s*=M.dolly.s+(1-M.dolly.s)*easeIO(clamp(M.t/M.dolly.T,0,1));if(M.t>M.dolly.T)M.dolly=null;}
  if(M.kc&&M.kc.cam){const t=M.kc.t,k=t<.22?ease3(t/.22):t<.95?1:1-easeIO(clamp((t-.95)/.6,0,1));s*=1+.12*Math.max(0,k);ox=M.kc.x;oy=M.kc.y;}
  if(M.punch){const P=M.punch;P.t+=dt;const k=P.t<.07?P.t/.07:1-ease3((P.t-.07)/(P.T-.07));s*=1+(P.s-1)*Math.max(0,k);if(ox===null){ox=P.x;oy=P.y;}if(P.t>P.T)M.punch=null;}
  if(M.shadow&&!M.shadow.ghost&&mv){const Sh=M.shadow;s*=1+.04*env66(Sh.t,0,Sh.T*.45,Sh.T*.6,Sh.T);}
  if(ox===null&&p){ox=p.x;oy=p.y;}
  const [sx,sy]=ox!==null?c66Css(ox,oy):[CW/2,CH/2];const tr=Math.abs(s-1)<.002?'':`scale(${s.toFixed(4)})`;
  if(cv.style.transform!==tr)cv.style.transform=tr;if(tr){const org=`${Math.round(sx)}px ${Math.round(sy)}px`;if(cv.style.transformOrigin!==org)cv.style.transformOrigin=org;}
  const fl=lite?'':blur>.2?`blur(${blur.toFixed(1)}px) brightness(${br.toFixed(2)})`:(br<.99?`brightness(${br.toFixed(2)})`:'');if(fl||C66.filt){if(cv.style.filter!==fl)cv.style.filter=fl;C66.filt=!!fl;}
  /* тень над ареной: интерфейс подрагивает, как от просадки питания */
  const hud=document.getElementById('hud');if(hud){const dim=!!(M.shadow&&!M.shadow.ghost&&c66Fx()&&M.shadow.t>.5&&M.shadow.t<M.shadow.T-.6);if(hud.classList.contains('c66dim')!==dim)hud.classList.toggle('c66dim',dim);}}
function c66CamReset(){try{cv.style.transform='';cv.style.transformOrigin='';if(C66.filt){cv.style.filter='';C66.filt=false;}const h=document.getElementById('hud');if(h)h.classList.remove('c66dim');}catch(e){}}
/* цвет главы: 01 — мир без цвета, который возвращается с каждым буем; 02 — выцветшее «прошлое»; 03 — пыльное тепло; 04 — глубокий синий.
   Финальный удар вымывает цвет — время стоит. Режимы смешения холста, без фильтров; на слабом телефоне — нет. */
function c66Grade(M){const m=M.m,o=[];
  if(m===1){const lit=M.lit||0,op=M.open?1-clamp((M.t-.8)/2.8,0,1):0;o.push(['saturation','#808080',clamp(.46*(1-lit)+.45*op,0,.92)]);o.push(['soft-light','#5aa8ff',.16]);}
  if(m===2){o.push(['saturation','#808080',.36]);o.push(['color','#b8875a',.13]);o.push(['soft-light','#ffb060',.12]);}
  if(m===3){o.push(['soft-light','#d8955a',.2]);o.push(['saturation','#808080',.16]);}
  if(m===4){o.push(['soft-light','#2a3a9a',.26]);const Sh=M.shadow;if(Sh&&!Sh.ghost)o.push(['saturation','#808080',.6*env66(Sh.t,0,.7,Sh.T-.7,Sh.T)]);}
  if(M.kc){o.push(['saturation','#808080',.55*env66(M.kc.t,0,.15,.95,1.6)]);}
  return o;}

/* ---------- ОСНОВНОЙ ТАКТ (кадр, не симуляция) ---------- */
function c66Tick(dt){
  if(C66.world){C66.world.t+=dt;if(C66.world.t>1.6)C66.world=null;}
  c66BriefTick(dt);c66DoneTick(dt);
  if(!c66Live()){if(C66.M)c66End();else c66Vis(false);return;}
  const st=G.state;if(st==='play'&&!C66.M)c66Begin();const M=C66.M;if(!M){c66Vis(false);return;}if(M.m!==G.m){c66End();return;}
  c66Vis(st==='play');if(st!=='play'){if(st==='done'||st==='over'){C66.bar=0;C66.barT=0;C66.duckQ=1;c66BootEnd(true);c66CamReset();}return;}
  M.t+=dt;const p=G.player,m=M.m,full=M.full,mode=M.mode;if(M.c66slAt&&ARCH.clk>=M.c66slAt-1e-9){M.c66slAt=0;c66Slow(.6,.35);}/* ARCH·74 A-21 */
  /* полосы */
  if(M.barOff&&M.t>M.barOff){M.barOff=0;c66Bars(0);}
  if(M.lids){/* веки: закрыты → приоткрылись → моргнули → открылись (как в прологе) */const t=M.t,mx=c66BarMax(),o=t<.55?0:t<.8?.35*ease3((t-.55)/.25):t<.95?.35-.2*((t-.8)/.15):t<1.8?.15+.85*easeIO((t-.95)/.85):1;C66.bar=.5-(.5-mx)*o;if(t>=1.8){M.lids=0;C66.bar=mx;c66Bars(mx);}}
  else{const bt=C66.barT,bk=C66.bar>bt?2.2:1.6;C66.bar+=clamp(bt-C66.bar,-bk*dt,bk*dt);if(C66.bar<.0005)C66.bar=0;}
  {const D=c66Dom(),h=(C66.bar*100).toFixed(2)+'vh';if(D.bt.style.height!==h){D.bt.style.height=h;D.bb.style.height=h;}}
  /* музыка */
  let dq=1;if(M.dk){if(M.t<M.dk.until)dq=M.dk.v;else M.dk=null;}dq=Math.round(dq*20)/20;C66.duckQ=dq;
  c66BootTick(M);c66TitleTick(M,dt);c66CardTick(M,dt);c66CapTick(M,dt);c66BortTick(M,dt);c66KillCamTick(M,dt);c66TracerTick(M,dt);
  for(const r of M.rings)r.t+=dt;M.rings=M.rings.filter(r=>r.t<r.T);for(const f of M.fl)f.t+=dt;M.fl=M.fl.filter(f=>f.t<f.T);for(const q of M.puffs)q.t+=dt;M.puffs=M.puffs.filter(q=>q.t<q.T);
  if(M.flash>0)M.flash=Math.max(0,M.flash-dt*3);
  /* общий план 04: холст в рамке → наезд */
  c66Cam(M,dt);if(M.riserAt&&M.t>=M.riserAt){M.riserAt=0;c66Sting('riser',1.05);}
  /* финальный удар */
  if(C66.clearAt&&c66Clk()-C66.clearAt<800&&/* ARCH·74 A-21 */!M.kc&&m<=4){C66.clearAt=0;c66KillCam(M);}
  /* по миссиям */
  const wv=G.waveIdx||0,wvUp=wv!==M.w;M.wPrev=M.w;M.w=wv;
  if(m===1){const S1=G.s1;if(S1&&S1.buoys)for(const b of S1.buoys){const on=b.lit>0;if(on&&!M.bl[b.i]){c66Flare(b.x,b.y,'#8fe9ff',300,.8);M.bc=M.bc||{};if(!M.bc[b.i]){M.bc[b.i]=1;M.nb=(M.nb||0)+1;c66Sting('chime',M.nb-1,b.x);c66Ring(b.x,b.y,190,'#8fe9ff',1.1,2);}}M.bl[b.i]=on;}
    if(!M.did.light&&G.radio&&G.radio.cur&&/^Объект в секторе/.test(G.radio.cur.txt||'')){M.did.light=1;M.stra={x:W*.79,y:H*.08,on:1,a:0,radio:1};c66Note('light','огонёк Стража');}}
  if(m===2){if(full&&!M.did.echo&&M.t>.35){M.did.echo=1;c66EchoStart(M);}
    if(full&&wvUp&&wv===5&&!M.did.ghost&&c66Loud()){M.did.ghost=1;M.ghostAt=M.t+.9;}
    if(M.ghostAt&&M.t>=M.ghostAt){M.ghostAt=0;const S=G.s1;let best=null,bd=-1;for(const pl of (S&&S.plates)||[]){const d=Math.hypot(pl.x-p.x,pl.y-p.y);if(d>bd){bd=d;best=pl;}}
      if(best&&!c66Danger()){M.ghost={x:best.x+Math.cos(best.a+1.57)*36,y:best.y+Math.sin(best.a+1.57)*36,a:Math.atan2(p.y-best.y,p.x-best.x),t:0};c66Sting('ghost');c66Note('ghost','силуэт у дальней плиты');}}
    if(M.ghost){M.ghost.t+=dt;if(M.ghost.t>.5)M.ghost=null;}
    if(!M.did.thread&&p.dashT>0){for(const b of G.eb||[]){if(b.life>0&&Math.hypot(b.x-p.x,b.y-p.y)<64){M.did.thread=1;if(c66Slow(.5,.35)||mode!=='full'){if(mode==='full')M.lpUntil=M.t+.6;c66Cap('СКВОЗЬ ОГОНЬ',p.x,p.y,'#8fe9ff',1.4);c66Note('slow','рывок сквозь огонь');}break;}}}
    const rf=(G.mc&&G.mc.s1refl)||0;if(rf>M.refl){M.refl=rf;if(!M.did.refl){M.did.refl=1;const lk=C66.lk||p;if(c66Slow(.5,.35)||mode!=='full'){if(mode==='full')M.lpUntil=M.t+.6;c66Cap('ИХ ЖЕ ОГНЁМ',lk.x,lk.y,'#ffb84d',1.5);c66Ring(lk.x,lk.y,120,'#ffb84d',.7);c66Note('slow','рикошет во врага');}}}}
  if(m===3){for(const w of G.warns||[]){if(w.type==='rammer'&&!M.did.silence){M.did.silence=1;c66Duck(.04,1.8);const x=w.mx!==undefined?w.mx:w.x,y=w.my!==undefined?w.my:w.y;c66Sting('rumble',0,x);
        for(let i=0;i<14;i++){const a=r66()*TAU,v=20+r66()*50;M.puffs.push({x:clamp(x,8,W-8)+Math.cos(a)*14,y:clamp(y,8,H-8)+Math.sin(a)*14,vx:Math.cos(a)*v+(W/2-x)*.12,vy:Math.sin(a)*v+(H/2-y)*.12,t:-r66()*.5,T:1.5+r66()*.6,s:2+r66()*3});}
        c66Note('silence','тишина перед тараном');break;}}
    const sn=(G.mc&&G.mc.s1stun)||0;if(sn>M.stun){M.stun=sn;if(!M.did.stun){M.did.stun=1;let e=null;for(const o of G.enemies)if(o.alive&&o.type==='rammer'&&o.s1dz>G.t){e=o;break;}const x=e?e.x:p.x,y=e?e.y:p.y;
        if(mode==='full'&&full&&!c66Danger()){hs90(.12,2);M.ni+=.12;}if(mode==='full'){trauma90(.45);if(ARCH.c66s)M.c66slAt=ARCH.clk+.14;else setTimeout(()=>{if(C66.M===M)c66Slow(.6,.35);},140);/* ARCH·74 A-21 */}
        c66Ring(x,y,220,'#ffd24d',.8,3);c66Ring(x,y,120,'#ffffff',.5,1.5);c66Flare(x,y,'#ffd24d',320,.8);if(mode==='full')M.lpUntil=M.t+.9;if(c66Loud()&&full)M.flash=.5;c66Sting('impact',0,x);if(mode==='full'&&SET.fx&&!c66Danger())M.punch={t:0,T:.6,s:1.07,x,y};c66Cap('ОГЛУШЁН · УРОН ×2',x,y,'#ffd24d',1.8,1);c66Note('stun','первый таран о глыбу');}}
    const pu=(G.mc&&G.mc.pulses)||0;if(pu>M.pulses){M.pulses=pu;if(!M.did.pulse){M.did.pulse=1;c66Duck(.25,.9);c66Ring(p.x,p.y,Math.max(W,H)*.75,'#ffb84d',1.1,2);c66Sting('whoomp');c66Note('pulse','первый импульс — вдох');}}}
  if(m===4){/* тень — в паузе после волны 4 (тогда же радио Стража) */
    if(wvUp&&wv===5&&!M.did.shadow&&(full||M.cyc>1)){M.did.shadow=1;M.shadowAt=M.t+.35;}
    if(M.shadowAt&&M.t>=M.shadowAt){M.shadowAt=0;c66ShadowStart(M);}
    if(M.shadow){M.shadow.t+=dt;if(M.shadow.t>=M.shadow.T)M.shadow=null;}
    /* цепь мин: ноты пентатоники по восходящей, первая длинная — замедление на всю цепь */
    const S=G.s1;if(S&&S.chains){for(const id in S.chains){const C=S.chains[id],was=M.chains[id]||0;if(C.n>was){M.chains[id]=C.n;for(let k=was;k<C.n&&k<9;k++){const i=k;setTimeout(()=>c66Sting('note',i),(k-was)*45);}
          if(C.n>=3&&!M.chainCine){M.chainCine=+id;if(c66Slow(.6,.3)){M.lpUntil=M.t+1;c66Note('chain','замедление на цепь');}}
          else if(+id===M.chainCine&&C.n>3&&mode==='full'&&M.slow<1.2){const add=Math.min(.14,1.2-M.slow);M.slow+=add;slow95(Math.max(.15,(G.slow95&&G.slow95.t)||0)+add,.3);}
          const at=C66.mb&&c66Clk()-C66.mb.at<400?/* ARCH·74 A-21 */C66.mb:null;if(at)c66Ring(at.x,at.y,70+C.n*14,'#ff4f6e',.6,1.5);
          if(C.n>=5&&C.hit&&!M.did.chain5){M.did.chain5=1;const q=at||p;c66Flare(q.x,q.y,'#ffd24d',360,1);c66Cap('ЦЕПЬ ×'+C.n+' · МАСТЕРСТВО',q.x,q.y,'#ffd24d',1.9);}}}}
    if(M.search){M.search.t+=dt;if(M.search.t>0&&!M.search.snd){M.search.snd=1;c66Sting('search');c66Note('search','прожектор нашёл корабль');}if(M.search.t>M.search.T)M.search=null;}}
  if(M.stra){const L=M.stra;L.a=Math.min(1,L.a+dt*1.5);if(L.radio&&!(G.radio&&G.radio.cur)){L.radio=0;L.fade=1;}if(L.fade){L.on-=dt*.4;if(L.on<=0)M.stra=null;}}
  if(M.far5){M.far5.t+=dt;if(M.far5.t>3.2)M.far5=null;}
  for(const d of M.dust){const F=c66Drift();d.x+=(F[0]*d.k+6)*dt;d.y+=F[1]*d.k*dt;if(d.x<-10)d.x+=W+20;if(d.x>W+10)d.x-=W+20;if(d.y<-10)d.y+=H+20;if(d.y>H+10)d.y-=H+20;}
}
function c66Drift(){let vx=0,vy=0,n=0;for(const r of G.rocks||[]){if(!r.alive||!r.s1big)continue;vx+=r.vx;vy+=r.vy;n++;}return n?[vx/n*1.6,vy/n*1.6]:[10,0];}

/* ---------- СЛОИ ОТРИСОВКИ ---------- */
/* под врагами: свет и цвет фона, дальний план (огонёк Стража, мины-звёзды, пыль), тень по фону */
function c66Under(t){const M=C66.M;if(!M||G.state==='menu')return;const p=G.player;if(!p)return;const fx=c66Fx();
  if(M.m===1&&fx){const S=G.s1,ever=S?S.buoys.filter(b=>b.ever).length:0,lit=M.lit=(M.lit===undefined?0:M.lit)+((ever/3)-(M.lit||0))*.04;const a=.52*(1-lit);
    if(a>.01){const R=Math.max(W,H)*.8,g=ctx.createRadialGradient(p.x,p.y,140,p.x,p.y,R);g.addColorStop(0,'rgba(2,5,12,0)');g.addColorStop(.35,`rgba(2,5,12,${(a*.55).toFixed(3)})`);g.addColorStop(1,`rgba(2,5,12,${a.toFixed(3)})`);ctx.fillStyle=g;ctx.fillRect(-60,-60,W+120,H+120);}
    if(S){ctx.globalCompositeOperation='lighter';for(const b of S.buoys){if(b.lit<=0)continue;const k=Math.min(1,b.lit/2)*(.85+.15*Math.sin(t*2+b.i));const g=ctx.createRadialGradient(b.x,b.y,10,b.x,b.y,300);g.addColorStop(0,`rgba(143,233,255,${(.13*k).toFixed(3)})`);g.addColorStop(1,'rgba(143,233,255,0)');ctx.fillStyle=g;ctx.fillRect(b.x-300,b.y-300,600,600);}ctx.globalCompositeOperation='source-over';}}
  if(M.m===3&&fx){ctx.fillStyle='#e8c69a';for(const d of M.dust){ctx.globalAlpha=d.a;ctx.fillRect(d.x,d.y,d.s,d.s);}ctx.globalAlpha=1;}
  if(M.m===4&&fx){ctx.fillStyle='rgba(6,14,52,.22)';ctx.fillRect(-60,-60,W+120,H+120);
    if(M.lights){const ox=(p.x-W/2)*.12,oy=(p.y-H/2)*.12;for(const L of M.lights){const x=L.x*W-ox,y=L.y*H-oy,ph=((t+L.ph)%L.T)/L.T,on=ph<.14?1-ph/.14:0;let a=.26+.7*on;
        const sh=c66InShadow(x,y);if(sh>0)a*=1-sh;if(M.est)a=Math.min(1,a*1.6+.15);if(a<.03)continue;ctx.globalAlpha=a;ctx.fillStyle='#ff4f6e';ctx.fillRect(x-L.s/2,y-L.s/2,L.s,L.s);if(on>.3)glow(x,y,7+L.s*2,'#ff4f6e',on*.5*(1-sh));}ctx.globalAlpha=1;}}
  if(M.stra&&fx){const L=M.stra;let a=L.a*Math.max(0,L.on);const sh=c66InShadow(L.x,L.y);a*=1-sh;if(L.radio){const c=G.radio&&G.radio.cur;a*=c&&c.shown<c.len?.55+.45*Math.abs(Math.sin(t*9)):.75;}else a*=.55+.2*Math.sin(t*1.7);
    if(a>.02){glow(L.x,L.y,38,'#ff6b8a',a*.75);glow(L.x,L.y,12,'#ffffff',a*.5);ctx.strokeStyle='#ffd0da';ctx.globalAlpha=a*.7;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(L.x-18,L.y);ctx.lineTo(L.x+18,L.y);ctx.moveTo(L.x,L.y-8);ctx.lineTo(L.x,L.y+8);ctx.stroke();
      ctx.fillStyle='#fff';ctx.globalAlpha=a;ctx.fillRect(L.x-1.5,L.y-1.5,3,3);ctx.globalAlpha=1;}}
  if(M.shadow&&!M.shadow.ghost&&fx)c66ShadowDraw(M.shadow,.62);
  if(M.far5&&fx){const k=env66(M.far5.t,.2,.9,2.2,3.2),a=-.9+M.far5.t*.25,sx=W*.82,sy=-60;if(k>0){ctx.save();ctx.globalCompositeOperation='lighter';ctx.translate(sx,sy);ctx.rotate(Math.PI/2+a);const g=ctx.createLinearGradient(0,0,H*1.3,0);g.addColorStop(0,`rgba(180,210,255,${(.10*k).toFixed(3)})`);g.addColorStop(1,'rgba(180,210,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(H*1.3,-70);ctx.lineTo(H*1.3,70);ctx.closePath();ctx.fill();ctx.restore();}}}
/* поверх врагов, под вражескими пулями и кораблём: огни мин, тень по врагам, эхо, призрак, кольца, прожектор */
function c66Mid(t){const M=C66.M;if(!M||G.state==='menu')return;const p=G.player;if(!p)return;const fx=c66Fx();
  if(M.m===1&&fx&&!c66Lite()&&M.lit!==undefined){const a=.16*(1-M.lit);if(a>.01){const g=ctx.createRadialGradient(p.x,p.y,220,p.x,p.y,Math.max(W,H)*.8);g.addColorStop(0,'rgba(2,5,12,0)');g.addColorStop(1,`rgba(2,5,12,${a.toFixed(3)})`);ctx.fillStyle=g;ctx.fillRect(-60,-60,W+120,H+120);}}
  if(M.m===4&&fx){for(const e of G.enemies){if(!e.alive||e.type!=='mine')continue;const sh=c66InShadow(e.x,e.y),k=.5+.5*Math.sin(t*5+(e.uid||0));glow(e.x,e.y,24,'#ff4f6e',(.22+.25*k)*(1-sh));}}
  if(M.shadow&&fx){if(M.shadow.ghost){const k=env66(M.shadow.t,.2,.5,1.5,2);ctx.fillStyle=`rgba(1,2,8,${(.3*k).toFixed(3)})`;ctx.fillRect(-60,-60,W+120,H+120);}else c66ShadowDraw(M.shadow,.34);}
  if(M.m===2){const S=G.s1;for(const k of M.marks){const pl=k.pl,c=Math.cos(pl.a),s=Math.sin(pl.a),x=pl.x+k.u*c-k.v*s,y=pl.y+k.u*s+k.v*c,a=k.t<.15?1:Math.max(0,1-(k.t-.15)/25)*.7;
      glow(x,y,10,shipBul(),a*.8);ctx.fillStyle='#fff';ctx.globalAlpha=a;ctx.fillRect(x-1.5,y-1.5,3,3);ctx.globalAlpha=1;}
    ctx.globalCompositeOperation='lighter';ctx.lineCap='round';for(const q of M.tr){if(q.t<0)continue;const L=q.fin?.11:.05,col=shipBul();const fin=q.fin?Math.max(0,1-q.t/q.T):1;ctx.strokeStyle=col;ctx.lineWidth=3;ctx.globalAlpha=.55*fin;ctx.beginPath();ctx.moveTo(q.x-q.vx*L,q.y-q.vy*L);ctx.lineTo(q.x,q.y);ctx.stroke();
      ctx.strokeStyle='#ffffff';ctx.lineWidth=1.2;ctx.globalAlpha=.7*fin;ctx.beginPath();ctx.moveTo(q.x-q.vx*L*.4,q.y-q.vy*L*.4);ctx.lineTo(q.x,q.y);ctx.stroke();if(q.hit)glow(q.x,q.y,18,col,.8);}
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.lineCap='butt';
    if(M.ghost){const G_=M.ghost,a=G_.t<.15?.55:Math.max(0,.55-(G_.t-.15)*3);if(a>0){ctx.save();ctx.translate(G_.x,G_.y);ctx.rotate(G_.a);for(const [dx,col] of [[-2,'#ff4f6e'],[2,'#4fd2ff'],[0,'#e8f4ff']]){ctx.strokeStyle=col;ctx.globalAlpha=a*(dx?.45:.8);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(19+dx,0);ctx.lineTo(-11+dx,-12);ctx.lineTo(-5+dx,0);ctx.lineTo(-11+dx,12);ctx.closePath();ctx.stroke();}ctx.restore();ctx.globalAlpha=1;}}}
  if(M.puffs.length){if(!c66Puff){const c=document.createElement('canvas');c.width=c.height=48;const x=c.getContext('2d'),g=x.createRadialGradient(24,24,0,24,24,24);g.addColorStop(0,'rgba(216,180,138,1)');g.addColorStop(.45,'rgba(216,180,138,.45)');g.addColorStop(1,'rgba(216,180,138,0)');x.fillStyle=g;x.fillRect(0,0,48,48);c66Puff=c;}
    for(const q of M.puffs){if(q.t<0)continue;const k=q.t/q.T,r=q.s*(2.2+k*4.5);ctx.globalAlpha=.32*(1-k)*Math.min(1,q.t*6);ctx.drawImage(c66Puff,q.x+q.vx*q.t-r,q.y+q.vy*q.t-r,r*2,r*2);}ctx.globalAlpha=1;}/* мягкие клубы: спрайт с размытым краем вместо плоских кругов */
  ctx.globalCompositeOperation='lighter';for(const f of M.fl){const k=1-f.t/f.T,L=f.L*(.6+.4*ease3(f.t/f.T*2)),g=ctx.createLinearGradient(f.x-L,0,f.x+L,0);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.5,f.col);g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.globalAlpha=.55*k;ctx.fillRect(f.x-L,f.y-1.2,L*2,2.4);ctx.globalAlpha=.18*k;ctx.fillRect(f.x-L*.7,f.y-5,L*1.4,10);glow(f.x,f.y,30,f.col,.6*k);}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  for(const r of M.rings){const k=ease3(r.t/r.T);ctx.strokeStyle=r.col;ctx.globalAlpha=(1-r.t/r.T)*.8;ctx.lineWidth=r.w*(1-k*.6);ctx.beginPath();ctx.arc(r.x,r.y,Math.max(1,r.R*k),0,TAU);ctx.stroke();}ctx.globalAlpha=1;
  if(M.search&&M.search.t>0){const Q=M.search,k=env66(Q.t,0,.25,Q.T-.35,Q.T),sw=ease3(Q.t/1.1),sx=W*1.08,sy=-H*.35,ax=W*.08+(p.x-W*.08)*sw,ay=H*.62+(p.y-H*.62)*sw,ang=Math.atan2(ay-sy,ax-sx),len=Math.hypot(ax-sx,ay-sy)+40;
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.translate(sx,sy);ctx.rotate(ang);
    /* мягкий край луча: заранее отрисованный клин 256×128 (поперечный колокол прозрачности, яркость к кораблю) — один drawImage, без ступенек, швов и фильтров */
    if(!c66Beam){const c=document.createElement('canvas');c.width=256;c.height=128;const x=c.getContext('2d'),d=x.createImageData(256,128);
      for(let px=0;px<256;px++){const u=px/255,w=(10+118*u)/128,al=(.06+.32*u)/.38*Math.min(1,(1-u)*7);for(let py=0;py<128;py++){const v=((py+.5)/64-1)/w,a=v*v<1?Math.pow(1-v*v,1.6)*al:0,o=(py*256+px)*4;d.data[o]=226;d.data[o+1]=238;d.data[o+2]=255;d.data[o+3]=Math.round(a*255);}}
      x.putImageData(d,0,0);c66Beam=c;}
    ctx.globalAlpha=k*.38;ctx.drawImage(c66Beam,0,-128,len,256);
    /* пылинки в луче — объём */if(!c66Lite()){if(!Q.motes){Q.motes=[];for(let i=0;i<34;i++)Q.motes.push({u:.25+r66()*.8,v:r66()*2-1,s:.6+r66()*1.4,ph:r66()*6,sp:.02+r66()*.05});}ctx.fillStyle='#eef5ff';
      for(const d of Q.motes){const u=d.u+Q.t*d.sp,wv=(18+88*Math.min(1,u))*.75,x=u*len,y=(d.v+.18*Math.sin(Q.t*1.3+d.ph))*wv;if(u>1.05)continue;ctx.globalAlpha=k*(.25+.35*Math.abs(Math.sin(Q.t*2+d.ph)))*(1-Math.abs(d.v)*.6);ctx.fillRect(x-d.s/2,y-d.s/2,d.s,d.s);}}
    ctx.globalAlpha=1;ctx.restore();
    if(sw>.98){ctx.globalCompositeOperation='lighter';const g2=ctx.createRadialGradient(p.x,p.y,4,p.x,p.y,70);g2.addColorStop(0,`rgba(235,245,255,${(.35*k).toFixed(3)})`);g2.addColorStop(1,'rgba(235,245,255,0)');ctx.fillStyle=g2;ctx.beginPath();ctx.ellipse(p.x,p.y,72,58,ang,0,TAU);ctx.fill();ctx.globalCompositeOperation='source-over';}}}
/* экран: виньетка главы, обломки переднего плана, фокус финального удара, «вертиго», вспышка */
let c66VG=null,c66Grain=null,c66Beam=null,c66Puff=null;
function c66Top(){const M=C66.M;if(!M||G.state!=='play'&&G.state!=='done'&&G.state!=='levelup')return;const cw=cv.width,ch=cv.height,fx=c66Fx();ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  const CH_=C66CH[M.m];
  if(CH_&&fx){const key=cw+'x'+ch+M.m;if(!c66VG||c66VG.k!==key){const g=ctx.createRadialGradient(cw/2,ch/2,Math.min(cw,ch)*.32,cw/2,ch/2,Math.hypot(cw,ch)*.58);g.addColorStop(0,`rgba(${CH_.tint},0)`);g.addColorStop(1,`rgba(${CH_.tint},${CH_.ti})`);c66VG={k:key,g};}ctx.fillStyle=c66VG.g;ctx.fillRect(0,0,cw,ch);}
  if(fx){const gr=c66Grade(M),lite=c66Lite();for(const [op,col,a] of (lite?gr.slice(0,1).concat(gr.filter(g=>g[0]==='saturation').slice(1)):gr)){/* на слабом телефоне — только главный слой цвета */if(a<.01)continue;ctx.globalCompositeOperation=op;ctx.globalAlpha=a;ctx.fillStyle=col;ctx.fillRect(0,0,cw,ch);}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
  if(M.m===2&&fx&&!c66Lite()){const p=G.player,k=SC*DPR;if(!M.deb){M.deb=[];for(let i=0;i<3;i++){const pts=[];const n=7+(r66()*4|0);for(let j=0;j<n;j++){const a=j/n*TAU,rr=.6+r66()*.5;pts.push([Math.cos(a)*rr,Math.sin(a)*rr*.6]);}const edge=i%2?.04+r66()*.16:.8+r66()*.16;M.deb.push({u:r66(),v:edge,s:(70+r66()*90),sp:.010+r66()*.008,rot:r66()*6,pts});}}
    for(const d of M.deb){d.u+=d.sp/60;const x=(((d.u%1.4)+1.4)%1.4-.2)*cw-(p.x-W/2)*.5*k,y=d.v*ch-(p.y-H/2)*.5*k,s=d.s*DPR;ctx.save();ctx.translate(x,y);ctx.rotate(d.rot+d.u*.6);ctx.beginPath();for(const [a,b] of d.pts)ctx.lineTo(a*s,b*s);ctx.closePath();
      ctx.fillStyle='rgba(6,4,2,.12)';ctx.fill();ctx.strokeStyle='rgba(255,184,77,.06)';ctx.lineWidth=1.5*DPR;ctx.stroke();ctx.restore();}}
  if(M.kc&&M.kc.t<1.7){const K=M.kc,a=env66(K.t,0,.2,1.1,1.7)*(M.full?.5:.3),[x,y]=c66Px(K.x,K.y);if(a>.01){const g=ctx.createRadialGradient(x,y,Math.min(cw,ch)*.12,x,y,Math.hypot(cw,ch)*.6);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${a.toFixed(3)})`);ctx.fillStyle=g;ctx.fillRect(0,0,cw,ch);}}
  /* огни самого гиганта: он выше арены и ближе к камере — огни смещены от тени и плывут быстрее (параллакс глубины) */
  if(M.shadow&&!M.shadow.ghost&&fx){const Sh=M.shadow,fade=env66(Sh.t,.15,.6,Sh.T-.6,Sh.T),cx=c66ShadowPos(Sh),par=(cx-W/2)*.18,c=Math.cos(Sh.a),s=Math.sin(Sh.a),t=M.t;
    if(fade>0)for(let i=0;i<5;i++){const v=(i/4-.5)*Sh.Lh*.62,side=i%2?1:-1,u=side*Sh.Wd*.16,wx=cx+par+90+u*c-v*s,wy=Sh.y-120+u*s+v*c,[x,y]=c66Px(wx,wy),on=((t*1.1+i*.37)%1.6)<.12;
      const r=(on?9:4)*DPR,a=fade*(on?.85:.22);const g=ctx.createRadialGradient(x,y,0,x,y,r*3);const col=i===2?'255,240,220':'255,70,90';g.addColorStop(0,`rgba(${col},${a.toFixed(3)})`);g.addColorStop(1,`rgba(${col},0)`);ctx.fillStyle=g;ctx.fillRect(x-r*3,y-r*3,r*6,r*6);}}
  if(M.shadow&&!M.shadow.ghost&&c66Loud()&&!c66Lite()){const Sh=M.shadow,k=env66(Sh.t,.2,.8,Sh.T-.8,Sh.T);if(k>0){if(!M.vst){M.vst=[];for(let i=0;i<46;i++)M.vst.push({a:r66()*TAU,r:.15+r66()*.6});}ctx.strokeStyle='#cfe0ff';ctx.lineWidth=1*DPR;const R0=Math.hypot(cw,ch)/2,gr=1+Sh.t*.06;
      for(const s of M.vst){const r=s.r*R0*gr,x=cw/2+Math.cos(s.a)*r,y=ch/2+Math.sin(s.a)*r,l=8*DPR*k;ctx.globalAlpha=.14*k;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(s.a)*l,y+Math.sin(s.a)*l);ctx.stroke();}ctx.globalAlpha=1;}}
  if(fx&&!c66Lite()&&(C66.bar>.01||(M.kc&&M.kc.t<1.7)||M.shadow)){if(!c66Grain){const g=document.createElement('canvas');g.width=g.height=128;const x=g.getContext('2d'),d=x.createImageData(128,128);for(let i=0;i<d.data.length;i+=4){const v=r66()*255|0;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255;}x.putImageData(d,0,0);c66Grain=ctx.createPattern(g,'repeat');}
    ctx.save();ctx.globalAlpha=.045;ctx.globalCompositeOperation='overlay';ctx.translate(-(r66()*128|0),-(r66()*128|0));ctx.fillStyle=c66Grain;ctx.fillRect(0,0,cw+128,ch+128);ctx.restore();}
  if(M.flash>0&&c66Loud()){ctx.fillStyle=`rgba(255,236,190,${(M.flash*.14).toFixed(3)})`;ctx.fillRect(0,0,cw,ch);}
  ctx.restore();}
/* мир: склейка по форме — кольцо последнего взрыва становится кольцом узла на карте */
function c66World(){const Wc=C66.world;if(!Wc||!G.world)return;const k=DPR*SC,Z=G.wz95||1,t=Wc.t;ctx.save();ctx.setTransform(k*Z,0,0,k*Z,(-CX*Z+W/2*(1-Z))*k,(-CY*Z+H/2*(1-Z))*k);ctx.globalCompositeOperation='lighter';
  const e=ease3(t/1.1),a=Math.max(0,1-t/1.6);ctx.strokeStyle=Wc.col;ctx.lineWidth=5;ctx.globalAlpha=.75*a;ctx.beginPath();ctx.arc(Wc.x,Wc.y,30+300*e,0,TAU);ctx.stroke();
  ctx.lineWidth=1.5;ctx.globalAlpha=.5*a;ctx.beginPath();ctx.arc(Wc.x,Wc.y,20+180*ease3(t/.8),0,TAU);ctx.stroke();if(t<.5)glow(Wc.x,Wc.y,90,Wc.col,(1-t/.5)*.9);ctx.restore();}

/* ---------- брифинг 1.5.1: заголовки появляются сразу (мягкий вход блоков, без печати и без «ГЛАВА»); печатается только примечание БОРТА — это подсказка ---------- */
function c66BriefStart(i){const m=i+1,sec=document.getElementById('sIntro');if(!sec)return;const old=sec.querySelector('.ch66');if(old)old.remove();sec.classList.remove('c66t');C66.brief=null;
  if(!c66Allowed()||m>4||G.mode!=='world')return;const F=c66Store();if(F.i[m])return;
  sec.classList.remove('c66t');void sec.offsetWidth;sec.classList.add('c66t');const note=sec.querySelector('#inHint .note');if(!note)return;
  C66.brief={t:0,t0:performance.now(),m,note,noteTxt:note.textContent};note.classList.add('n66');note.textContent='';}
function c66BriefTick(dt){const B=C66.brief;if(!B)return;if(G.state!=='intro'){if(B.note)B.note.textContent=B.noteTxt;C66.brief=null;return;}B.t=(performance.now()-B.t0)/1000;/* по настоящему времени: на медленном кадре не тормозит */
  const full=B.noteTxt,pre='Примечание бортовой системы: ',body=full.startsWith(pre)?full.slice(pre.length):full;const t=B.t-.7;let s='';
  if(t>0){const typo=B.m===2&&body.includes('вашего типа');const cps=.028;let k=Math.floor(t/cps);
    if(typo){const i=body.indexOf('вашего типа');const wrong=body.slice(0,i)+'нашего';if(k<=wrong.length)s=wrong.slice(0,k);else{const back=k-wrong.length;if(back<10)s=wrong;else if(back<16)s=wrong.slice(0,Math.max(i,wrong.length-(back-10)));else{const k2=back-16;s=body.slice(0,i+k2);}}}
    else s=body.slice(0,k);s=pre+s;if(s.length<pre.length+body.length&&Math.floor(B.t*6)%2)s+='▌';}
  if(B.note.textContent!==s)B.note.textContent=s;if(t>0&&s===pre+body)C66.brief=null;}

/* ---------- экран итога: L-cut — голос Стража начинается здесь и договаривает уже в секторе ---------- */
function c66DoneStart(){const L=C66.lcut;const sec=document.getElementById('sDone');if(!sec)return;const old=sec.querySelector('.lcut66');if(old)old.remove();C66.done=null;if(!L)return;
  const p=document.createElement('p');p.className='lcut66';p.innerHTML='<i>ПЕРЕХВАТ · СТРАЖ</i><span></span>';const note=document.getElementById('dnNote');if(note)note.insertAdjacentElement('afterend',p);C66.done={t:0,t0:performance.now(),el:p.querySelector('span'),cut:L.cut,txt:L.txt};}
function c66DoneTick(dt){const D=C66.done;if(!D)return;if(G.state!=='done'){C66.done=null;return;}D.t=(performance.now()-D.t0)/1000;const n=Math.min(D.cut,Math.floor(Math.max(0,D.t-.8)/.045));const s=D.txt.slice(0,n)+(Math.floor(D.t*3)%2?'▌':' ');if(D.el.textContent!==s)D.el.textContent=s;}

/* ---------- ОБВЯЗКА: обёртки (все сняты вместе с блоком) ---------- */
/* слои отрисовки */
{const _bg=bg110;bg110=function(t){const r=_bg.apply(this,arguments);if(C66.M&&G.state!=='menu'&&!G.world){const a=performance.now();try{c66Under(t);}catch(e){c66Fail(e);}C66.stat.u=performance.now()-a;}return r;};}
{const _so=s1DrawOver;s1DrawOver=function(t){const r=_so.apply(this,arguments);if(C66.M&&!G.world){const a=performance.now();try{c66Mid(t);}catch(e){c66Fail(e);}C66.stat.m=performance.now()-a;}return r;};}
{const _dd=drawDevOverlay;drawDevOverlay=function(){const r=_dd.apply(this,arguments);const now=performance.now(),dt=Math.min(.05,Math.max(0,(now-(C66.last||now))/1000));C66.last=now;
  try{if(!(ARCH.c66s&&live74()))c66Tick(dt);/* ARCH·74 A-21: в бою и мире такт идёт из шага */if(C66.M&&!G.world)c66Top();if(C66.world&&G.world)c66World();}catch(e){c66Fail(e);}
  const ms=performance.now()-now+(C66.M?(C66.stat.u||0)+(C66.stat.m||0):0);C66.stat.u=C66.stat.m=0;if(C66.M&&G.state==='play'){C66.stat.ms=C66.stat.ms*.95+ms*.05;C66.stat.max=Math.max(C66.stat.max*.995,ms);C66.stat.n++;}return r;};}
function c66Fail(e){console.error(e);if(++C66.err>12){C66.dead=1;try{c66End();}catch(er){}}}
/* музыка: «пригиб» режиссёра поверх пригиба игры */
{const _mt=musTarget;musTarget=function(){const T=_mt.apply(this,arguments);const M=C66.M;if(M&&T&&G.state==='play'){if(C66.duckQ<1)T.duck=Math.round(T.duck*C66.duckQ*20)/20;if(M.lpUntil>M.t)T.lp=Math.min(T.lp||18000,1000);
    if(M.open){const k=clamp((M.t-.9)/2.8,0,1);T.lp=Math.min(T.lp||18000,Math.round((260+17740*k*k)/50)*50);T.duck=Math.round(T.duck*(.4+.6*k)*20)/20;}}return T;};}
/* события из симуляции — только запись в свои поля, без побочных эффектов */
{const _k=kill;kill=function(e,silent){const was=!!(e&&e.alive);const r=_k.apply(this,arguments);if(was&&e&&!e.alive&&inMission())C66.lk={x:e.x,y:e.y,type:e.type,at:c66Clk()};/* ARCH·74 A-21 */return r;};}
{const _mb=mineBlast;mineBlast=function(e,R,pd){if(e&&inMission())C66.mb={x:e.x,y:e.y,at:c66Clk()}/* ARCH·74 A-21 */;return _mb.apply(this,arguments);};}
{const _bn=banner;banner=function(b){if(b==='ЗОНА ЧИСТА'&&inMission()&&G.m>=1&&G.m<=4)C66.clearAt=c66Clk();/* ARCH·74 A-21 */return _bn.apply(this,arguments);};}
{const _sm=setupMission0;setupMission0=function(i){_sm.apply(this,arguments);G.c66r={n:0,last:-99,w:G.waveIdx||0,stun:0};C66.force=0;if(C66.M)c66End();};}
/* радио Стража в 01–04 — по событиям, а не по таймеру (это симуляция: детерминировано и не зависит от «Кино») */
function c66RadioEv(st){const R=G.c66r||(G.c66r={n:0,last:-99,w:0,stun:0}),E=C66R[G.m],S=G.save;if(!E||!S||!S.story||!SET.radio)return;
  const wv=G.waveIdx||0,sn=(G.mc&&G.mc.s1stun)||0;let fire=false;if(E.w&&wv!==R.w){R.w=wv;if(wv===E.w)fire=true;}if(E.stun&&sn>R.stun){R.stun=sn;if(sn===E.stun)fire=true;}
  if(!fire||R.n>=2||G.mT-R.last<12)return;R.n++;R.last=G.mT;
  if(E.line){const [g,i]=E.line;if(!S.story.seen[g+(i+1)]){radioForce(g,i,.6);return;}const p=radioPick(g);if(p&&!(g==='А'&&(p.i===3||p.i===1)))radioForce(p.g,p.i,.6);return;}
  const key='А·66·'+G.m;if(!S.story.seen[key]){S.story.seen[key]=1;st.q.push({txt:E.txt,tag:'СТРАЖ',col:'#ff6b8a',d:.6});return;}
  const p=radioPick('А');if(p&&p.i!==3&&p.i!==1)radioForce(p.g,p.i,.6);}
{const _rt=radioTick;radioTick=function(dt,mode){try{if(mode==='mission'&&G.mode==='world'&&G.m>=1&&G.m<=4&&!STORY_OFF.radio){const st=radioState();if(st.t<2)st.t=2;c66RadioEv(st);}}catch(e){console.error(e);}return _rt.apply(this,arguments);};}
/* победа: L-cut в 04, склейка в мир, «до первой победы» */
{const _wd=worldMissionDone;worldMissionDone=function(){const m=G.m;const r=_wd.apply(this,arguments);try{
  if(G.state==='done'&&m>=1&&m<=4&&!c66Bot()){const F=c66Store();F.d[m]=1;C66.won={m,col:C66CH[m].col};
    C66.lcut=null;if(m===4&&!F.lc&&SET.radio&&!STORY_OFF.radio){F.lc=1;C66.lcut={txt:C66LCUT,cut:19};}c66DoneStart();}}catch(e){console.error(e);}return r;};}
{const _rw=returnToWorld;returnToWorld=function(){const W_=C66.won,L=C66.lcut;C66.won=null;C66.lcut=null;const r=_rw.apply(this,arguments);try{
  if(W_&&c66Allowed()&&G.world){const n=WORLD.nodes[W_.m-1];if(n)C66.world={x:n.x,y:n.y,t:0,col:W_.col};}
  if(L&&G.state==='world'&&SET.radio&&!STORY_OFF.radio&&!c66Bot()){radioSay('А',1);const st=radioState();if(st.cur)st.cur.t=L.cut*.03;}}catch(e){console.error(e);}return r;};}
/* старт боя: режиссёр начинает в тот же кадр — интерфейс 01 не мигает до «загрузки систем» */
{const _st=startMission;startMission=function(){const r=_st.apply(this,arguments);try{if(G.state==='play'&&!C66.M&&c66Live())c66Begin();}catch(e){console.error(e);}return r;};}
/* брифинг */
{const _oi=openIntro;openIntro=function(i){const r=_oi.apply(this,arguments);try{c66BriefStart(i);
  if(i===4&&G.mode==='world'&&G.save&&G.save.medals[4]&&G.save.medals[4].clear&&!c66Bot()){const h=document.getElementById('inHint');if(h&&!h.querySelector('.n66b'))h.insertAdjacentHTML('beforeend','<p class="note n66b">Примечание бортовой системы: объект ███ прошёл над сектором 8-А. Классификация не присвоена.</p>');}}catch(e){console.error(e);}return r;};}
/* обучение: титр и табличка — препятствия для подсказки */
{const _tb=tutBlockers;tutBlockers=function(){const out=_tb.apply(this,arguments).slice();try{const D=C66.dom;if(D&&!D.el.hidden)for(const el of [D.ttl,D.card,D.boot,D.bort,D.cap]){if(!el.classList.contains('on')&&!(el===D.boot&&el.children.length))continue;const r=el.getBoundingClientRect();if(r.width>2)out.push([r.left-6,r.top-6,r.right+6,r.bottom+6]);}}catch(e){}return out;};}
/* пропуск: любое нажатие гасит титр и бортовую строку (управление и так у игрока) */
function c66Skip(){const M=C66.M;if(!M||G.state!=='play')return;const D=C66.dom;if(!D)return;if(M.ttl&&M.ttl.on&&!M.ttl.out&&M.ttl.t>.4){M.ttl.t=c66TitleLife(M.ttl)+.01;}if(M.bort&&M.bort.t>.5)M.bort.t=M.bort.T;}
addEventListener('keydown',e=>{if(e.code==='Escape'||e.code==='Enter')c66Skip();},true);

/* ---------- настройка «КИНО» во вкладке «ЭКРАН» ---------- */
if(SET.cine===undefined)SET.cine='full';try{if(typeof SET_DEF!=='undefined')SET_DEF.cine='full';}catch(e){}
{const _rs=renderSetScreen;renderSetScreen=function(){const r=_rs.apply(this,arguments);try{const g=document.querySelector('#setBody .tab63[data-tab63="scr"]');if(g&&!g.querySelector('[data-n63="cine"]')){const cur=SET.cine||'full';const w=document.createElement('div');w.className='srow63';w.dataset.n63='cine';
  w.innerHTML=`<div class="setrow"><div class="eyebrow">КИНО</div><div class="seg">${[['full','ПОЛНОЕ'],['calm','ТИХОЕ'],['off','ВЫКЛ']].map(([k,n])=>`<button data-cine66="${k}" class="${cur===k?'on':''}">${n}</button>`).join('')}</div></div><p class="snote">Кинематографичные приёмы в миссиях 01–04: титры глав, свет, замедление на ключевых моментах. «Тихое» — без замедления и вспышек.${RMQ&&RMQ.matches?' Система просит меньше движения — замедление уже выключено.':''}</p>`;g.appendChild(w);}}catch(e){console.error(e);}return r;};}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-cine66]');if(!b)return;SET.cine=b.dataset.cine66;saveSet();if(SET.cine==='off'&&C66.M)c66End();renderSetScreen();try{buzz('tap');}catch(er){}});

/* ---------- ВЕРСТАК: кино в панели разработчика (вкладка «БОЙ») ---------- */
const C66PLAY={title:'Титр главы',boot:'Загрузка систем (01)',card:'Табличка врага',killcam:'Финальный удар',light:'Огонёк Стража',echo:'Эхо-трассеры (02)',ghost:'Призрак (02)',stun:'Удар тарана (03)',silence:'Тишина перед тараном (03)',shadow:'Тень гиганта (04)',search:'Прожектор (04)',bort:'Бортовая строка'};
function c66Play(k){C66.force=G.m;if(!C66.M){if(!c66Live()||(G.state!=='play'&&G.state!=='levelup'))return false;c66Begin();}/* в выборе улучшения кадр ждёт и начнётся с боем */const M=C66.M,p=G.player;c66Note('верстак',k);
  if(k==='title'){M.ttl={at:M.t,short:false};}
  if(k==='boot'){c66BootEnd(true);c66BootStart(M);M.t=0;M.kills=G.kills;M.taken=G.taken;M.xp=G.xp;M.lvl=G.lvl;}
  if(k==='card'){const ty=((MISSIONS[M.m-1]||{}).intro||['scout'])[0];const L=C66CARD[ty]||['?',''];const D=c66Dom();D.card.querySelector('b').textContent=L[0];D.card.querySelector('span').textContent=L[1];D.card.style.left='40px';D.card.style.top='120px';D.card.className='card66 on';M.card={t:0,type:ty};c66Sting('reveal');}
  if(k==='killcam'){M.kc=null;C66.lk={x:p.x+80,y:p.y-60,at:c66Clk()}/* ARCH·74 A-21 */;c66KillCam(M);}
  if(k==='light'){M.stra={x:W*.79,y:H*.08,on:1,a:0};}
  if(k==='echo'){c66EchoStart(M);}
  if(k==='ghost'){M.ghost={x:W*.3,y:H*.3,a:0,t:0};c66Sting('ghost');}
  if(k==='stun'){c66Ring(p.x,p.y-80,220,'#ffd24d',.8,3);c66Sting('impact');if(c66Mode()==='full'){hs90(.12,2);trauma90(.45);slow95(.6,.35);}c66Cap('ОГЛУШЁН · УРОН ×2',p.x,p.y-80,'#ffd24d',1.8);}
  if(k==='silence'){c66Duck(.05,1.7);c66Sting('rumble');}
  if(k==='shadow'){c66ShadowStart(M);}
  if(k==='search'){M.search={t:0,T:1.9};}
  if(k==='bort'){c66Bort(M,'СВЕРКА ПАМЯТИ: РАСХОЖДЕНИЕ 3 % · ИГНОРИРОВАТЬ',2.6);}
  return true;}
function c66Reset(){const F=c66Store();F.i={};F.d={};F.c={};F.lc=0;F.e5=0;C66.dev={i:{},d:{},c:{},lc:0};try{if(G.mode==='world'&&G.save)saveWorld();}catch(e){}}
function c66Live2(){const M=C66.M;if(!M)return c66Live()?'ждёт старта боя':'не в миссии 01–05 · '+(c66Mode()==='off'?'КИНО ВЫКЛ':'');
  return pad2(M.m)+' · '+(M.first?'ПЕРВЫЙ ПОКАЗ':M.full?'ДО ПЕРВОЙ ПОБЕДЫ':'ПОВТОР')+' · '+M.mode.toUpperCase()+' · НЕИНТЕР '+M.ni.toFixed(2).replace('.',',')+' / '+c66NIcap(M).toFixed(1).replace('.',',')+' С · ЗАМЕДЛ '+M.slow.toFixed(2).replace('.',',')+' / 1,2 С · '+C66.stat.ms.toFixed(2).replace('.',',')+' МС';}
try{if(typeof DVX_R!=='undefined'&&DVX_R.fight){const _f=DVX_R.fight;DVX_R.fight=function(){let h=_f.apply(this,arguments);try{const m=inMission()?G.m:0;const cur=SET.cine||'full';
    const rows=Object.entries(C66PLAY).map(([k,n])=>btn('c66play',k,'▶ '+n,'',(!inMission()||(G.state!=='play'&&G.state!=='levelup')||m>5)?'в бою 01–05':'')).join('');
    h+=grp('КИНО · 1.5.1',`<div class="r65"><span data-live="c66"></span></div>${seg('c66mode',cur,[['full','ПОЛНОЕ'],['calm','ТИХОЕ'],['off','ВЫКЛ']])}<div class="bs65">${rows}</div>${btn('c66reset',1,'ЗАБЫТЬ «УЖЕ ВИДЕЛ»','wide')}${btn('c66run',1,G.dev&&G.dev.cine66?'КИНО В СЕТКЕ МИССИЙ: ВКЛ':'КИНО В СЕТКЕ МИССИЙ: ВЫКЛ','wide')}`,
      'Приём проигрывается сразу, без проверок очереди и бюджета. «Забыть» — снова первый показ в 01–04. Последние события: '+C66.log.slice(-5).map(x=>x.t+' с '+x.k+(x.txt?' ('+x.txt+')':'')).join(' · '));}catch(e){console.error(e);}return h;};}
  if(typeof DVX_LIVE!=='undefined')DVX_LIVE.c66=c66Live2;
  if(typeof dvAct==='function'){const _da=dvAct;dvAct=function(a,v,e){if(a==='c66play'){c66Play(v);dvxRender();return;}if(a==='c66mode'){SET.cine=v;saveSet();if(v==='off'&&C66.M)c66End();dvxRender();return;}
    if(a==='c66reset'){c66Reset();dvxRender();return;}if(a==='c66run'){G.dev.cine66=!G.dev.cine66;try{store('void_dev',G.dev);}catch(er){}dvxRender();return;}return _da.apply(this,arguments);};}}catch(e){console.error(e);}
window.C66=C66;
/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ CINE·PROTO 1.5.1 α «Кадр» · КОНЕЦ ВЫРЕЗАЕМОГО БЛОКА ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */
