/* ===== 1.2.5 α: «Пустота-12» — живая подложка открытого мира в секторах I–II ===== */
const V12={name:'Пустота-12',seg:16,pre:.1,tail:.25,xf:.02,bpm:60,
  order:['intro0','intro1','loop0','loop1','loop2','loop3','loop4','loop5','loop6','loop7','loop8','loop9'],
  buf:{},dec:{},fail:0,ok:false,live:0,on:false,cur:null,nxt:null,pos:null,introDone:false,gain:.38,nodes:null,sec:-1,lastOff:0};
V12.next=n=>{const i=V12.order.indexOf(n);return n==='loop9'?'loop0':V12.order[i+1];};
V12.loopIdx=n=>n.startsWith('loop')?+n.slice(4):-1;
function v12Raw(n){const el=document.getElementById('v12-'+n);return el?el.textContent.trim():'';}
function v12Decode(n){if(V12.buf[n])return Promise.resolve(V12.buf[n]);if(V12.dec[n])return V12.dec[n];
  const b64=v12Raw(n);if(!b64||!AU.ctx)return Promise.reject(new Error('no '+n));
  const bin=atob(b64),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
  const p=new Promise((res,rej)=>{try{const r=AU.ctx.decodeAudioData(u.buffer,res,rej);if(r&&r.then)r.then(res,rej);}catch(e){rej(e);}})
    .then(b=>{V12.buf[n]=b;delete V12.dec[n];if(!V12.ok){V12.ok=true;v12Retune(true);}return b;})
    .catch(e=>{delete V12.dec[n];V12.fail++;throw e;});
  V12.dec[n]=p;return p;}
function v12Keep(){const keep=new Set([V12.cur&&V12.cur.n,V12.nxt&&V12.nxt.n,V12.cur&&V12.next(V12.cur.n)]);for(const k in V12.buf)if(!keep.has(k))delete V12.buf[k];}
function v12Nodes(){if(V12.nodes||!AU.ctx||!AU.musLP)return V12.nodes;const c=AU.ctx;
  const g=c.createGain();g.gain.value=0;const duck=c.createGain();duck.gain.value=1;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=18000;f.Q.value=.5;
  const lo=c.createBiquadFilter();lo.type='lowshelf';lo.frequency.value=120;const hi=c.createBiquadFilter();hi.type='highshelf';hi.frequency.value=1800;
  const pk=c.createBiquadFilter();pk.type='peaking';pk.frequency.value=180;pk.Q.value=.8;const lc=c.createBiquadFilter();lc.type='lowshelf';lc.frequency.value=60;
  const bus=c.createGain();bus.gain.value=1;
  bus.connect(lo);lo.connect(hi);hi.connect(pk);pk.connect(lc);lc.connect(f);f.connect(duck);duck.connect(g);g.connect(AU.musLP);
  V12.nodes={g,duck,f,lo,hi,pk,lc,bus};return V12.nodes;}
/* хочет ли игра подложку прямо сейчас */
function v12Want(){const p=G.player;if(!SET.amb||!AU.ctx||V12.fail>3)return 0;
  if(!(G.mode==='world'&&G.world&&p&&!G.post&&['world','map','pause','codex'].includes(G.state)))return 0;
  const si=sectorIdx(p.x,p.y);if(si!==0&&si!==1)return 0;V12.sec=si;return 1;}
function v12Start(name,off){const c=AU.ctx,N=v12Nodes(),b=V12.buf[name];if(!N||!b)return false;const when=c.currentTime+.06;
  const s=c.createBufferSource();s.buffer=b;const sg=c.createGain();sg.gain.value=1;s.connect(sg);sg.connect(N.bus);
  s.start(when,V12.pre+off);V12.cur={n:name,src:s,g:sg,t0:when-off};return true;}
function v12Chain(){const c=AU.ctx,C=V12.cur,N=V12.nodes;if(!C)return;const now=c.currentTime,end=C.t0+V12.seg,nn=V12.next(C.n);
  if(!V12.nxt&&end-now<8&&!V12.buf[nn])v12Decode(nn).catch(()=>{});
  if(!V12.nxt&&end-now<2){const b=V12.buf[nn];
    if(b){const s=c.createBufferSource();s.buffer=b;const sg=c.createGain();sg.gain.setValueAtTime(0,end-V12.xf/2);sg.gain.linearRampToValueAtTime(1,end+V12.xf/2);
      s.connect(sg);sg.connect(N.bus);s.start(end-V12.xf/2,V12.pre-V12.xf/2);C.g.gain.setValueAtTime(1,end-V12.xf/2);C.g.gain.linearRampToValueAtTime(0,end+V12.xf/2);
      try{C.src.stop(end+V12.tail);}catch(e){}V12.nxt={n:nn,src:s,g:sg,t0:end};}
    else if(now>end-.05){/* кусок не успел — доиграть хвост и войти позже с сильной доли */try{C.g.gain.setTargetAtTime(0,end,.08);C.src.stop(end+V12.tail);}catch(e){}
      V12.pos={n:nn,off:0,t:performance.now()};V12.cur=null;v12Decode(nn).then(()=>{if(V12.on&&!V12.cur){v12Start(nn,0);}}).catch(()=>{});return;}}
  if(V12.nxt&&now>=V12.nxt.t0){if(V12.cur.n==='intro1')V12.introDone=true;V12.cur=V12.nxt;V12.nxt=null;v12Keep();}}
function v12Pos(){const C=V12.cur;if(!C||!AU.ctx)return null;const off=clamp(AU.ctx.currentTime-C.t0,0,V12.seg-.01);return {n:C.n,off,t:performance.now()};}
function v12Stop(fade){V12.gen=(V12.gen||0)+1;const c=AU.ctx,N=V12.nodes;if(!N)return;V12.pos=v12Pos()||V12.pos;const t=c.currentTime;
  {const v=N.g.gain.value,K=48,a=new Float32Array(K);for(let j=0;j<K;j++)a[j]=v*Math.cos(j/(K-1)*Math.PI/2);N.g.gain.cancelScheduledValues(t);N.g.gain.setValueAtTime(v,t);try{N.g.gain.setValueCurveAtTime(a,t+.005,Math.max(.05,fade));}catch(e){N.g.gain.linearRampToValueAtTime(0,t+fade);}}
  for(const X of [V12.cur,V12.nxt])if(X)try{X.src.stop(t+fade+.05);}catch(e){}V12.cur=V12.nxt=null;V12.lvl=0;}
/* куда входить: вступление один раз, потом петля; вернулся быстрее 90 с — с того же места */
function v12Entry(){const P=V12.pos;if(P&&performance.now()-P.t<90000){let n=P.n,off=Math.floor(P.off/4)*4;if(n.startsWith('intro')&&V12.introDone){n='loop0';off=0;}return {n,off};}
  if(!V12.introDone&&!V12.everIntro){V12.everIntro=1;return {n:'intro0',off:0};}return {n:V12.sec===1?'loop4':'loop0',off:0};}
/* уровни и окраска */
function v12Mix(dt){const N=V12.nodes,c=AU.ctx;if(!N)return;const t=c.currentTime,p=G.player,T=MUS.cur;
  const phone=G.ff==='phone';let db=0,lp=18000;
  const I=T&&T.I||0,zone=typeof zbOn==='function'&&zbOn(),anom=!!G.anom;
  if(zone||anom){db-=12;lp=700;}else if(I>.5){db-=5;lp=1800;}
  if(['map','codex'].includes(G.state)){db-=8;lp=Math.min(lp,900);}
  if(G.well&&G.well.depth>0){db-=6*G.well.depth;lp=Math.min(lp,500+17500*Math.pow(1-G.well.depth,2));}
  try{const r=radioEl();if(r&&!r.hidden)db-=2;}catch(e){}
  if(typeof CHS!=='undefined'&&CHS&&CHS.ph==='live'){db=Math.min(db,-5);lp=Math.min(lp,1800);}
  const lvl=V12.on?V12.gain*(phone?1.19:1)*Math.pow(10,db/20):0;
  if(Math.abs(lvl-(V12.lvl||0))>.002||V12.fadeIn){const tc=V12.fadeIn?1.3:(lvl<(V12.lvl||0)?.5:1.2);const G_=N.g.gain;G_.cancelScheduledValues(t);G_.setValueAtTime(G_.value,t);G_.setTargetAtTime(lvl,t,tc);V12.lvl=lvl;V12.fadeIn=0;}
  if(Math.abs(lp-(V12.lp||0))>30){N.f.frequency.setTargetAtTime(lp,t,lp<(V12.lp||18000)?.4:1.2);V12.lp=lp;}
  const s=V12.sec;const eq=s===1?[-1.5,2]:[1.5,-2];if(V12.eqSec!==s+(phone?10:0)){V12.eqSec=s+(phone?10:0);N.lo.gain.setTargetAtTime(eq[0],t,2);N.hi.gain.setTargetAtTime(eq[1],t,2);N.hi.frequency.setTargetAtTime(s===1?1500:2000,t,2);
    N.pk.gain.setTargetAtTime(phone?2:0,t,.5);N.lc.gain.setTargetAtTime(phone?-3:0,t,.5);}
  /* Разлом: лёгкая «плывучесть» */
  const rI=G.riftI||0,rate=rI>.5?1-.015*Math.min(1,(rI-.5)*2):1;if(Math.abs(rate-(V12.rate||1))>.001){V12.rate=rate;for(const X of [V12.cur,V12.nxt])if(X)X.src.playbackRate.setTargetAtTime(rate,t,.8);}
}
function v12Tick(dt){if(!AU.ctx||AU.ctx.state!=='running')return;const want=v12Want();
  if(want&&!V12.on){V12.on=true;V12.fadeIn=1;const gen=V12.gen=(V12.gen||0)+1;const E=v12Entry();v12Decode(E.n).then(()=>{if(V12.on&&!V12.cur&&gen===V12.gen){v12Nodes();v12Start(E.n,E.off);v12Retune(true);}}).catch(()=>{});}
  else if(!want&&V12.on){V12.on=false;V12.gen=(V12.gen||0)+1;v12Stop(SET.amb?3.5:.4);v12Retune(false);}
  if(V12.on&&V12.cur)v12Chain();
  V12.live=V12.on&&V12.cur?1:0;
  if(V12.nodes)v12Mix(dt);
  if(V12.live)MUS.lastName=V12.name;
}
/* такт и доля подложки для синхронных слоёв */
V12.beatAt=function(t){const C=V12.cur;if(!C)return null;const k=C.n.startsWith('loop')?V12.loopIdx(C.n)*16:(C.n==='intro1'?16:0);const pos=k+(t-C.t0)*(V12.rate||1);return {beat:Math.floor(pos),ph:pos-Math.floor(pos),bar0:C.t0-((k%4))};};
/* перенастройка процедурных пейзажей I–II в фа минор, пока звучит подложка */
V.v12=[[0,7,12,15],[-4,3,8,12],[3,10,15,19],[-2,5,10,14]];
const V12_KEEP={belt:{root:SC_.belt.root,v:SC_.belt.v,bpm:SC_.belt.bpm},drift:{root:SC_.drift.root,v:SC_.drift.v,bpm:SC_.drift.bpm}};
const PENTA0=PENTA.slice(),PENTA_F=[523.25,622.25,698.46,830.61,932.33];
function v12Retune(on){const B=SC_.belt,D=SC_.drift;
  if(on&&V12.ok){B.root=41;B.v=V.v12;B.bpm=120;D.root=44;D.v=V.v12.map(ch=>ch.map(x=>x-3));D.bpm=120;PENTA.splice(0,5,...PENTA_F);}
  else{Object.assign(B,V12_KEEP.belt);Object.assign(D,V12_KEEP.drift);if(V12_KEEP.belt.bpm===undefined)delete B.bpm;if(V12_KEEP.drift.bpm===undefined)delete D.bpm;PENTA.splice(0,5,...PENTA0);}
  try{const P=MUS.cur;if(P&&(P.id==='belt'||P.id==='drift')&&AU.ctx){setChord(P,AU.ctx.currentTime);}}catch(e){}}
{const _sl=scapeLayers;scapeLayers=function(P){_sl(P);if(V12.live&&(P.id==='belt'||P.id==='drift')){const t=AU.ctx.currentTime;P.L.pad.gain.setTargetAtTime(0,t,.8);P.L.sub.gain.setTargetAtTime(0,t,.8);P.L.noise.gain.setTargetAtTime(.6,t,.8);}};}
/* сетка секвенсора и колокольчики — по долям подложки */
{const _sr=scapeRun;scapeRun=function(P,now,ahead){if(V12.live&&(P.id==='belt'||P.id==='drift')){const B=V12.beatAt(now);if(B){const sd=60/(120+(P.ext.bpmAdd||0))/4,g0=now-B.ph*(1/(V12.rate||1));
    if(P.next>=now-.25){const k=Math.ceil((P.next-g0)/sd-1e-6),snap=g0+k*sd;if(Math.abs(snap-P.next)>.002){P.next=snap;P.step=((B.beat%4)*8+k)%32;}}
    if(P.nextBell<ahead){const q=g0+Math.ceil((Math.max(now,P.nextBell)-g0))*1;P.nextBell=q;}}}
  return _sr(P,now,ahead);};}
/* взрывы на мгновение прижимают подложку */
{const _sfx=sfx;sfx=function(n){const r=_sfx.apply(this,arguments);try{if(V12.live&&V12.nodes&&(n==='boom'||n==='bigboom')){const t=AU.ctx.currentTime,g=V12.nodes.duck.gain,d=n==='bigboom'?.5:.71;
  g.cancelScheduledValues(t);g.setTargetAtTime(d,t,.01);g.setTargetAtTime(1,t+.05,.15);}}catch(e){}return r;};}
{const _mt=musicTick;musicTick=function(dt){_mt(dt);try{v12Tick(dt);}catch(e){console.error(e);}};}

const MZ_DEF={"menu": {"segs": [["menu_i0", 12.801208], ["menu_i1", 12.801187], ["menu_i2", 12.801208], ["menu_i3", 12.801187], ["menu_i4", 12.801208], ["menu_l0", 15.299604], ["menu_l1", 15.299604], ["menu_l2", 15.299583], ["menu_l3", 15.299604], ["menu_l4", 15.299604]], "intro": 5, "loop": 5}, "m10": {"segs": [["m10_i0", 14.525], ["m10_i1", 14.525], ["m10_i2", 14.525], ["m10_i3", 14.525], ["m10_i4", 14.525], ["m10_l0", 14.062667], ["m10_l1", 14.062687], ["m10_l2", 14.062667], ["m10_l3", 14.062687], ["m10_l4", 14.062667], ["m10_l5", 14.062667], ["m10_l6", 14.062687], ["m10_l7", 14.062667]], "intro": 5, "loop": 8}, "s0": {"segs": [["s0_i0", 13.604604], ["s0_i1", 13.604604], ["s0_i2", 13.604583], ["s0_i3", 13.604604], ["s0_i4", 13.604604], ["s0_l0", 15.4045], ["s0_l1", 15.4045], ["s0_l2", 15.4045], ["s0_l3", 15.4045], ["s0_l4", 15.4045], ["s0_l5", 15.4045]], "intro": 5, "loop": 6}, "s10": {"segs": [["s10_i0", 13.65625], ["s10_i1", 13.65625], ["s10_i2", 13.65625], ["s10_i3", 13.65625], ["s10_l0", 14.256021], ["s10_l1", 14.256042], ["s10_l2", 14.256021], ["s10_l3", 14.256042], ["s10_l4", 14.256021], ["s10_l5", 14.256042], ["s10_l6", 14.256021]], "intro": 4, "loop": 7}};
/* ===== 1.2.6 α: записанная музыка меню, миссий 1–10 и боссов; общая пауза −90 % ===== */
/* MZ_DEF вставляется сборкой из au/seg2/manifest.json: {key:{segs:[[name,dur],…],intro:n,loop:n}} */
const MZ_TR={
  menu:{name:'Последний сигнал',gain:.47,root:39,penta:[554.37,622.25,739.99,830.61,932.33]},
  m10: {name:'Вахта',gain:.52,root:41,penta:[523.25,622.25,698.46,830.61,932.33]},
  s0:  {name:'Страж-0',gain:.55,root:41,penta:[523.25,622.25,698.46,830.61,932.33]},
  s10: {name:'Глушитель',gain:.58,root:36,penta:[523.25,622.25,698.46,783.99,932.33]}};
const MZ={pl:{},bus:null,lp:null,duck:null,want:null,prev:null,pre:.1,tail:.25,xf:.02,fail:0,bossDeadT:-99,lastBoss:false,menuIntro:false,anyLive:false};
for(const k in MZ_DEF)Object.assign(MZ_TR[k],MZ_DEF[k]);
function mzRaw(n){const el=document.getElementById('mz-'+n);return el?el.textContent.trim():'';}
function mzP(k){return MZ.pl[k]||(MZ.pl[k]={k,buf:{},dec:{},cur:null,nxt:null,pos:null,gen:0,on:false,fade:null,lvlG:null,fail:0,lvl:1});}
function mzNodes(){if(MZ.bus||!AU.ctx)return MZ.bus;const c=AU.ctx;
  MZ.bus=c.createGain();MZ.lp=c.createBiquadFilter();MZ.lp.type='lowpass';MZ.lp.frequency.value=18000;MZ.lp.Q.value=.5;MZ.duck=c.createGain();
  MZ.bus.connect(MZ.lp);MZ.lp.connect(MZ.duck);MZ.duck.connect(AU.amb);return MZ.bus;}
function mzPlayerNodes(P){if(P.fade)return;const c=AU.ctx;mzNodes();P.fade=c.createGain();P.fade.gain.value=0;P.lvlG=c.createGain();P.lvlG.gain.value=1;P.fade.connect(P.lvlG);P.lvlG.connect(MZ.bus);}
function mzDecode(P,i){const T=MZ_TR[P.k],n=T.segs[i][0];if(P.buf[i])return Promise.resolve(P.buf[i]);if(P.dec[i])return P.dec[i];
  const b64=mzRaw(n);if(!b64||!AU.ctx)return Promise.reject(new Error('no '+n));
  const bin=atob(b64),u=new Uint8Array(bin.length);for(let j=0;j<bin.length;j++)u[j]=bin.charCodeAt(j);
  const p=new Promise((res,rej)=>{try{const r=AU.ctx.decodeAudioData(u.buffer,res,rej);if(r&&r.then)r.then(res,rej);}catch(e){rej(e);}})
    .then(b=>{P.buf[i]=b;delete P.dec[i];return b;}).catch(e=>{delete P.dec[i];P.fail++;MZ.fail++;throw e;});
  P.dec[i]=p;return p;}
function mzNext(P,i){const T=MZ_TR[P.k];return i+1<T.segs.length?i+1:T.intro;}
function mzKeep(P){const keep=new Set();if(P.cur){keep.add(P.cur.i);keep.add(mzNext(P,P.cur.i));}if(P.nxt)keep.add(P.nxt.i);for(const k in P.buf)if(!keep.has(+k))delete P.buf[k];}
function mzStart(P,i,off){const c=AU.ctx,b=P.buf[i];if(!b)return false;mzPlayerNodes(P);const when=c.currentTime+.05;
  const s=c.createBufferSource();s.buffer=b;const g=c.createGain();s.connect(g);g.connect(P.fade);s.start(when,MZ.pre+off);P.cur={i,src:s,g,t0:when-off,d:MZ_TR[P.k].segs[i][1]};return true;}
function mzChain(P){const c=AU.ctx,C=P.cur;if(!C)return;const now=c.currentTime,end=C.t0+C.d,ni=mzNext(P,C.i);
  if(!P.nxt&&end-now<8&&!P.buf[ni])mzDecode(P,ni).catch(()=>{});
  if(!P.nxt&&end-now<2){const b=P.buf[ni];
    if(b){const s=c.createBufferSource();s.buffer=b;const g=c.createGain();g.gain.setValueAtTime(0,end-MZ.xf/2);g.gain.linearRampToValueAtTime(1,end+MZ.xf/2);s.connect(g);g.connect(P.fade);
      s.start(end-MZ.xf/2,MZ.pre-MZ.xf/2);C.g.gain.setValueAtTime(1,end-MZ.xf/2);C.g.gain.linearRampToValueAtTime(0,end+MZ.xf/2);try{C.src.stop(end+MZ.tail);}catch(e){}
      P.nxt={i:ni,src:s,g,t0:end,d:MZ_TR[P.k].segs[ni][1]};}
    else if(now>end-.05){try{C.g.gain.setTargetAtTime(0,end,.08);C.src.stop(end+MZ.tail);}catch(e){}P.cur=null;const gen=P.gen;
      mzDecode(P,ni).then(()=>{if(P.on&&!P.cur&&gen===P.gen)mzStart(P,ni,0);}).catch(()=>{});return;}}
  if(P.nxt&&now>=P.nxt.t0){P.cur=P.nxt;P.nxt=null;mzKeep(P);}}
/* плавные равномощные кривые: из текущего значения, без щелчков */
function mzCurve(param,to,dur){const c=AU.ctx,t=c.currentTime+.01,v=param.value,N=64,a=new Float32Array(N);
  for(let j=0;j<N;j++){const x=j/(N-1);a[j]=to>v?v+(to-v)*Math.sin(x*Math.PI/2):to+(v-to)*Math.cos(x*Math.PI/2);}
  param.cancelScheduledValues(t-.01);param.setValueAtTime(v,t-.005);try{param.setValueCurveAtTime(a,t,Math.max(.05,dur));}catch(e){param.setTargetAtTime(to,t,dur/3);}}
function mzOn(P,i,off,fi){P.on=true;const gen=++P.gen;mzDecode(P,i).then(()=>{if(!P.on||gen!==P.gen)return;if(!P.cur)mzStart(P,i,off);mzCurve(P.fade.gain,1,fi);}).catch(()=>{});}
function mzOff(P,fo){if(!P.on)return;P.on=false;P.gen++;const c=AU.ctx;const C=P.cur;
  if(C){P.pos={i:C.i,off:clamp(c.currentTime-C.t0,0,C.d-.01),t:performance.now()};}
  if(P.fade){mzCurve(P.fade.gain,0,fo);const stopAt=c.currentTime+fo+.1;for(const X of [P.cur,P.nxt])if(X)try{X.src.stop(stopAt);}catch(e){}}P.cur=P.nxt=null;}
/* что должно звучать */
function mzWant(){if(!SET.amb||!AU.ctx||MZ.fail>6)return null;const st=G.state;
  if(G.mode!=='endless'&&!G.world&&G.m>=1&&G.m<=10&&!G.post&&(G.mode==='world'||G.mode==='dev')&&['intro','play','levelup','pause','codex'].includes(st)){
    const bossOn=G.m===6&&G.boss&&G.boss.alive,jamOn=G.m===10&&G.jam&&G.jam.alive;
    if(st==='intro')MZ.lastBoss=false;
    if(bossOn||jamOn){MZ.lastBoss=G.m===6?'s0':'s10';MZ.since=0;}
    /* после гибели босса трек держится ещё 3 с — финальный удар не обрывается */
    if(MZ.lastBoss&&MZ.since<3&&MZ.lastBoss===(G.m===6?'s0':G.m===10?'s10':''))return MZ.lastBoss;
    return 'm10';}
  MZ.lastBoss=false;
  let id=null;try{id=musTarget().id;}catch(e){}
  if(id==='menu'&&!G.world&&!(G.m&&['play','levelup','intro'].includes(st)))return 'menu';
  return null;}
const MZ_FADE={'m10>s0':[2.5,2],'m10>s10':[2.5,2],'s0>m10':[4,4],'s10>m10':[4,4],'menu>m10':[2,3],'m10>menu':[2.5,3.5],'s0>menu':[2.5,3.5],'s10>menu':[2.5,3.5],'>menu':[0,3.5],'menu>':[3,0],'m10>':[3,0],'s0>':[3,0],'s10>':[3,0],'>m10':[0,3]};
function mzEntry(k){const P=mzP(k),T=MZ_TR[k],pos=P.pos;
  if(k==='menu'){if(pos&&performance.now()-pos.t<120000)return {i:pos.i,off:pos.off};if(!MZ.menuIntro){MZ.menuIntro=true;return {i:0,off:0};}return {i:T.intro,off:0};}
  if(k==='m10'&&MZ.prev&&MZ.prev[0]==='s'&&pos&&performance.now()-pos.t<60000)return {i:pos.i,off:pos.off};
  return {i:0,off:0};}
function mzTick(dt){if(!AU.ctx||AU.ctx.state!=='running')return;{const now=performance.now();if(G.state==='play'&&MZ.lastNow)MZ.since=(MZ.since||0)+Math.min(.25,(now-MZ.lastNow)/1000);MZ.lastNow=now;}let w=mzWant();
  /* конец миссии и гибель: музыка уходит плавно, стингеры звучат сами */
  const ending=w&&!G.world&&(G.state==='done'||G.state==='over');if(ending)w=null;
  if(w!==MZ.want){const from=MZ.want||'',to=w||'',f=MZ_FADE[from+'>'+to]||[3,3.5];
    if(from)mzOff(mzP(from),G.state==='over'?2.5:G.state==='done'?4:f[0]);
    if(to){const E=mzEntry(to);mzOn(mzP(to),E.i,E.off,f[1]);}
    MZ.prev=MZ.want;MZ.want=w;}
  let any=false;for(const k in MZ.pl){const P=MZ.pl[k];if(P.on&&P.cur)mzChain(P);if(P.on||P.cur||P.nxt)any=any||!!P.cur;}
  MZ.anyLive=!!(MZ.want&&mzP(MZ.want).cur);
  if(MZ.bus){const t=AU.ctx.currentTime;
    /* уровень по состоянию: брифинг −3 дБ, выбор улучшения −5 дБ и глуше */
    for(const k in MZ.pl){const P=MZ.pl[k];if(!P.lvlG)continue;let db=0;if(G.state==='intro')db=-3;else if(G.state==='levelup')db=-5;
      const g=MZ_TR[k].gain*(G.ff==='phone'?1.12:1)*Math.pow(10,db/20);if(Math.abs(g-P.lvl)>.002){P.lvl=g;P.lvlG.gain.setTargetAtTime(g,t,.6);}}
    let lp=AU.musLP?AU.musLP.frequency.value:18000;if(G.state==='levelup')lp=Math.min(lp,2600);if(G.state==='over')lp=Math.min(lp,350);
    if(Math.abs(lp-(MZ.lpv||0))>30){MZ.lpv=lp;MZ.lp.frequency.setTargetAtTime(lp,t,G.state==='over'?.8:.25);}
    const dk=AU.duckG?AU.duckG.gain.value:1;if(Math.abs(dk-(MZ.dk||1))>.01){MZ.dk=dk;MZ.duck.gain.setTargetAtTime(dk,t,.05);}}
  /* процедурная музыка молчит, пока звучит запись */
  if(AU.mus){const tg=MZ.anyLive?0:1;if(tg!==MZ.musT){MZ.musT=tg;AU.mus.gain.setTargetAtTime(tg,AU.ctx.currentTime,tg?1.0:.6);}}
  if(MZ.anyLive)MUS.lastName=MZ_TR[MZ.want].name;}
/* стингеры и звук убийства — в тональности звучащего трека */
{const _as=ambSting;ambSting=function(kind){const P=MUS.cur;if(MZ.anyLive&&P){const T=MZ_TR[MZ.want],s0=P.semi;let d=((T.root-P.sc.root)%12+12)%12;if(d>6)d-=12;P.semi=d;try{return _as(kind);}finally{P.semi=s0;}}return _as(kind);};}
function mzPenta(){const src=MZ.anyLive?MZ_TR[MZ.want].penta:(typeof V12!=='undefined'&&V12.live?PENTA_F:PENTA0);if(PENTA[0]!==src[0]||PENTA[1]!==src[1]||PENTA[2]!==src[2])PENTA.splice(0,5,...src);}
/* пауза: вся музыка плавно −90 % (≈ −20 дБ), обратно — быстрее */
function pauseMusTick(){if(!AU.ctx||!AU.amb)return;
  if(!AU.pauseG){try{const c=AU.ctx;AU.pauseG=c.createGain();AU.pauseG.gain.value=1;AU.pauseG.connect(c.destination);AU.amb.connect(AU.pauseG);AU.amb.disconnect(c.destination);}catch(e){}}const p=G.state==='pause',t=AU.ctx.currentTime;if(p!==MZ.paused){MZ.paused=p;const g=AU.pauseG.gain;g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);g.setTargetAtTime(p?.1:1,t,p?.9:.3);}}
{const _mt2=musicTick;musicTick=function(dt){_mt2(dt);try{mzTick(dt);mzPenta();pauseMusTick();}catch(e){console.error(e);}};}

