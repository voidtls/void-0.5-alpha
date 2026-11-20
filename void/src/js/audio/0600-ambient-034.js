// =====================================================================
// ---------- ЭМБИЕНТ (0.3.4) ----------
// адаптивные звуковые пейзажи: протяжные пэды без терций, саб-дрон, шум, редкие отзвуки;
// в бою — мягкий пульс и томы, на боссе — медь и двойной пульс; тревога поверх; равномощный кроссфейд
// =====================================================================
const AMB_CFG={fadeCalm:4,fadeFight:2,fadeOut:6,alarmOn:.3,alarmOff:.35,alarmHold:1.5,maxVoices:40};
// аккорды-«поля» (полутоны от тоники), без терций либо с терцией глубоко внутри
const V={
  dor:[[0,7,14,17],[-2,5,12,14],[5,12,17,19],[-5,2,7,14]],
  mix:[[0,7,14,17],[-2,5,14,17],[5,12,19,21],[0,7,10,14]],
  lyd:[[0,7,14,18],[2,9,14,21],[-5,2,7,14],[0,7,11,18]],
  phr:[[0,7,12,19],[1,8,13,20],[0,7,12,17],[-2,5,12,17]],
  calm:[[0,7,14,19],[5,12,19,21],[-2,5,14,17],[0,7,12,21]]
};
const SC_={
  menu:  {name:'Последний сигнал',root:38,v:V.calm,chordT:[12,18],pad:['triangle',380,850,.05],sub:.09,noise:['lowpass',480,.016,.05],bell:['shine',9,16,.026],ping:1,rev:.45,vol:.62},
  belt:  {name:'Пояс Стража',root:40,v:V.dor,chordT:[10,16],pad:['sawtooth',420,1050,.03],sub:.085,noise:['bandpass',800,.012,.08],bell:['shine',10,18,.022],rev:.35,alert:1,vol:.7},
  drift: {name:'Дрейф маяка',root:45,v:V.lyd,chordT:[10,16],pad:['triangle',650,1500,.045],sub:.07,noise:['bandpass',1200,.01,.06],bell:['glass',7,12,.024],rev:.55,alert:1,vol:.68},
  shop:  {name:'Мастерская',root:41,v:[[0,7,12,14],[5,12,14,19],[-2,5,10,14]],chordT:[12,20],pad:['triangle',330,680,.045],sub:.06,noise:['lowpass',400,.007,.04],bell:['metal',6,11,.02],rev:.42,vol:.72},
  hangar:{name:'Хранилище корпусов',root:46,v:[[0,7,14,19],[2,9,14,21],[5,12,19,21]],chordT:[12,18],pad:['triangle',560,1150,.04],sub:.05,noise:['lowpass',600,.006,.05],bell:['glass',5,9,.022],chorus:1,rev:.5,vol:.75},
  cycle: {name:'Новый цикл',root:38,v:[[0,7,12,19]],chordT:[30,30],pad:['triangle',400,700,.05],sub:.09,noise:['lowpass',400,.01,.03],bell:['shine',8,12,.03],rev:.6,vol:.6},
  abyss: {name:'Бездна',root:33,v:[[0,7,12,19],[1,8,13,20],[0,7,12,17]],chordT:[10,14],pad:['sawtooth',230,620,.035],sub:.13,noise:['lowpass',300,.025,.03],bell:['shine',12,20,.015],rev:.5,fight:1,bpm:94,pulse:'q',toms:'fight',vol:1},
  warden:{name:'Страж',root:38,v:V.phr,chordT:[8,10],pad:['sawtooth',300,900,.03],sub:.13,tri:1,noise:['lowpass',420,.02,.2],rev:.35,fight:1,boss:1,bpm:112,pulse:'double',toms:'boss',brass:.07,vol:.85},
  jam:   {name:'Глушитель',root:40,v:V.phr,chordT:[8,10],pad:['sawtooth',320,950,.028],sub:.12,tri:1,noise:['bandpass',1500,.025,1.3],rev:.4,fight:1,boss:1,bpm:118,pulse:'double',toms:'boss',brass:.05,crackle:1,vol:.85}
};
[['m1','Первый контакт',38,'dor',84,{}],['m2','Охота на стрелков',40,'mix',88,{metal:1}],['m3','Рой',36,'dor',92,{swarm:1}],
 ['m4','Стальной строй',41,'mix',94,{heavy:1}],['m5','Копья в пустоте',43,'dor',96,{brass:.035}],['m6','Ядро Стража',38,'phr',98,{brass:.03,heavy:1}],
 ['m7','Тихий маяк',45,'lyd',90,{beat:1}],['m8','Ретрансляторы',46,'lyd',96,{pan:1}],['m9','Ионная буря',36,'dor',100,{crackle:1}],['m10','Последняя передача',38,'mix',106,{hi:1,brass:.03}]]
 .forEach(([id,name,root,mode,bpm,x])=>{SC_[id]=Object.assign({name,root,v:V[mode],chordT:[8,12],pad:['sawtooth',380,1100,.03],sub:.1,noise:['bandpass',700,x.swarm?.03:.012,x.swarm?.9:.1],bell:['shine',14,22,.016],rev:.32,fight:1,bpm,pulse:'q',toms:'fight',vol:1},x);});
SECTORS_NEW.forEach((q,i)=>{if(i>=9)return;const modes=['dor','mix','phr','dor','lyd','phr','mix','lyd','dor'],roots=[43,41,38,36,47,35,42,44,39],md=modes[i];
  SC_['s'+(i+2)]={name:q.name.charAt(0)+q.name.slice(1).toLowerCase(),root:roots[i],v:V[md],chordT:[10,16],pad:[i%2?'sawtooth':'triangle',420+i*20,1000+i*40,i%2?.03:.042],sub:.08,noise:['bandpass',600+i*90,.012,.05+i*.02],bell:[['shine','glass','metal'][i%3],9,15,.02],rev:.4+(i%3)*.06,alert:1,vol:.68};
  SC_['mx'+(i+2)]={name:'Бой · '+q.name.charAt(0)+q.name.slice(1).toLowerCase(),root:roots[i],v:V[md],chordT:[8,12],pad:['sawtooth',380,1100,.03],sub:.1,noise:['bandpass',700+i*60,.012,.1],bell:['shine',14,22,.016],rev:.32,fight:1,bpm:96+i*2,pulse:'q',toms:'fight',heavy:i%2?1:0,brass:i>=4?.03:0,vol:1};});
const MUS={players:[],cur:null,lastName:'',voices:0,alarm:false,alarmT:0,lowSince:0,tonal:[],duckT:1,pausedLP:false};
const mtof=m=>440*Math.pow(2,(m-69)/12);
function vStart(n,t){MUS.voices++;n.onended=()=>{MUS.voices--;};n.start(t);}
function noiseBuf(){const c=AU.ctx;if(MUS.nb)return MUS.nb;const len=c.sampleRate*2,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<len;i++){const w=Math.random()*2-1;l=l*.97+w*.03;d[i]=w*.6+l*2.2;}return MUS.nb=b;}
// одиночные события
function ev(t,f,dur,type,vol,out,att,f2,pan){const c=AU.ctx;if(MUS.voices>AMB_CFG.maxVoices)return;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+(att||.01));g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);
  if(pan){const p=c.createStereoPanner();p.pan.value=pan;g.connect(p);p.connect(out);}else g.connect(out);vStart(o,t);o.stop(t+dur+.05);}
function evNoise(t,dur,vol,out,type,f,q,f2){const c=AU.ctx;if(MUS.voices>AMB_CFG.maxVoices)return;const s=c.createBufferSource();s.buffer=noiseBuf();const fl=c.createBiquadFilter();fl.type=type;fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+dur);fl.Q.value=q||1;
  const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+Math.min(.02,dur/3));g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(fl);fl.connect(g);g.connect(out);vStart(s,t);s.stop(t+dur+.05);}
function tonal(t,id){MUS.tonal.push([t,id]);if(MUS.tonal.length>400)MUS.tonal.splice(0,200);}
function bell(P,t){const S=P.sc,b=S.bell;if(!b)return;const ch=P.chord,n=ch[Math.random()*ch.length|0]+S.root+24+(Math.random()<.4?12:0),f=mtof(n),pan=rnd(-.7,.7);
  if(b[0]==='metal'){ev(t,f,3.2,'sine',b[3],P.L.bell,.005,null,pan);ev(t,f*2.76,1.6,'sine',b[3]*.35,P.L.bell,.005,null,pan);}
  else if(b[0]==='glass'){ev(t,f,4.5,'sine',b[3],P.L.bell,.02,null,pan);ev(t,f*3,2.2,'sine',b[3]*.25,P.L.bell,.02,null,-pan);}
  else{ev(t,f,5,'sine',b[3],P.L.bell,.03,null,pan);ev(t,f*2,2.5,'sine',b[3]*.3,P.L.bell,.03,null,pan);}
  tonal(t,P.id);}
// звуковой пейзаж: постоянные голоса + планировщик событий
function newScape(id){
  const c=AU.ctx,S=SC_[id],t=c.currentTime;const P={id,sc:S,t0:t,stopAt:0,L:{},chord:S.v[0],ci:0,nextChord:t+rnd(S.chordT[0],S.chordT[1]),step:0,next:t+.1,nextBell:t+rnd(2,6),nextPing:t+3,nodes:[],I:0,calm:false,ext:{},semi:0};
  P.out=c.createGain();P.out.gain.value=0;P.out.connect(AU.mus);P.send=c.createGain();P.send.gain.value=S.rev;P.out.connect(P.send);P.send.connect(AU.rev);
  for(const k of ['pad','sub','noise','pulse','toms','tick','brass','bell','fx','hi'])(P.L[k]=c.createGain()).connect(P.out);
  // пэд: 4 ноты × 2 расстроенных осциллятора, общий фильтр
  P.padF=c.createBiquadFilter();P.padF.type='lowpass';P.padF.Q.value=.7;P.padF.frequency.value=S.pad[1];P.padF.connect(P.L.pad);
  if(S.chorus){const d=c.createDelay(.05);d.delayTime.value=.022;const dg=c.createGain();dg.gain.value=.5;const pn=c.createStereoPanner();pn.pan.value=.6;P.padF.connect(d);d.connect(dg);dg.connect(pn);pn.connect(P.L.pad);}
  P.pad=[];S.v[0].forEach((iv,i)=>{for(const det of [-6,6]){const o=c.createOscillator();o.type=S.pad[0];o.frequency.value=mtof(S.root+12+iv)*Math.pow(2,det/1200);const g=c.createGain();g.gain.value=S.pad[3];const pn=c.createStereoPanner();pn.pan.value=(i-1.5)*.35+det/30;o.connect(g);g.connect(pn);pn.connect(P.padF);vStart(o,t);P.pad.push({o,iv,det});P.nodes.push(o);}});
  P.subO=c.createOscillator();P.subO.type='sine';P.subO.frequency.value=mtof(S.root);const sg=c.createGain();sg.gain.value=S.sub;P.subO.connect(sg);sg.connect(P.L.sub);vStart(P.subO,t);P.nodes.push(P.subO);
  if(S.tri){const o=c.createOscillator();o.type='sine';o.frequency.value=mtof(S.root+6);const g=c.createGain();g.gain.value=S.sub*.22;o.connect(g);g.connect(P.L.sub);vStart(o,t);P.nodes.push(o);}
  const ns=c.createBufferSource();ns.buffer=noiseBuf();ns.loop=true;P.noiseF=c.createBiquadFilter();P.noiseF.type=S.noise[0];P.noiseF.frequency.value=S.noise[1];P.noiseF.Q.value=.8;const ng=c.createGain();ng.gain.value=S.noise[2];ns.connect(P.noiseF);P.noiseF.connect(ng);ng.connect(P.L.noise);vStart(ns,t);P.nodes.push(ns);
  if(S.hi){for(const iv of [24,31]){const o=c.createOscillator();o.type='sine';o.frequency.value=mtof(S.root+iv);const g=c.createGain();g.gain.value=.012;o.connect(g);g.connect(P.L.hi);vStart(o,t);P.nodes.push(o);}P.L.hi.gain.value=0;}
  scape80(P,c,t);P.L.pulse.gain.value=0;P.L.toms.gain.value=0;P.L.tick.gain.value=0;P.L.brass.gain.value=0;
  return P;
}
function scapeStop(P,t){for(const n of P.nodes){try{n.stop(t);}catch(e){}}setTimeout(()=>{try{P.out.disconnect();P.send.disconnect();}catch(e){}},(t-AU.ctx.currentTime+.5)*1000);}
function setChord(P,t){const S=P.sc;P.ci=(P.ci+1+(Math.random()<.3?1:0))%S.v.length;P.chord=S.v[P.ci];
  P.pad.forEach((v,k)=>{const iv=P.chord[Math.floor(k/2)];v.o.frequency.setTargetAtTime(mtof(S.root+P.semi+12+iv)*Math.pow(2,v.det/1200),t,1.4);});
  P.subO.frequency.setTargetAtTime(mtof(S.root+P.semi+(P.chord[0]<0?P.chord[0]+12:P.chord[0])%12),t,2);
  P.nextChord=t+rnd(S.chordT[0],S.chordT[1]);}
// один шестнадцатый шаг
function scapeStep(P,t){
  const S=P.sc,X=P.ext,st=P.step%16,bar=Math.floor(P.step/16),I=P.I,root=S.root+P.semi,tn=m=>mtof(m);
  const dark=X.darkOff;
  // пульс (тональный, одна нота/квинта)
  if(S.fight&&!P.calm&&!dark&&!X.drop){
    const pat=S.pulse==='double'?[0,2,8,10]:I>.55?[0,4,8,12]:[0,4,8];
    if(pat.includes(st)){const n=root+12+(st===8&&S.pulse==='q'&&bar%2?7:0);const pan=S.pan?(st%8===0?-.5:.5):0;
      ev(t,tn(n),.42,'sawtooth',.05,P.L.pulse,.006,tn(n)*.995,pan);tonal(t,P.id);}
    // томы
    const tp=S.toms==='boss'?[0,3,6,8,11]:S.heavy?[0,6,10]:I>.65?[0,6,10]:[0,10];
    if(tp.includes(st)){const f=S.toms==='boss'?72:86;ev(t,f,.5,'sine',S.toms==='boss'?.2:.26,P.L.toms,.003,f*.5);evNoise(t,.05,.05,P.L.toms,'lowpass',1800);}
    if(st===4&&bar%2===1)evNoise(t,.25,.06,P.L.toms,'bandpass',S.metal?3200:900,S.metal?8:1.2);
    // тиканье
    if(st%2===1&&(I>.4||S.boss))evNoise(t,.03,S.metal?.03:.018,P.L.tick,'bandpass',S.metal?4200:2600,4);
    // маяк — тёплый удар на тонике
    if(S.beat&&st===0){ev(t,tn(root+24),1.2,'sine',.05,P.L.fx,.01);tonal(t,P.id);}
    // разгон перед сменой гармонии
    if(P.nextChord-t<2.2&&P.nextChord-t>2.2-60/(S.bpm)/4&&I>.3)evNoise(t,2.1,.05*I+.02,P.L.fx,'bandpass',300,2,3000);
  }
  // тревога в секторе: сердцебиение и тиканье
  if(S.alert&&P.I>0){if(st===0||st===3)ev(t,58,.3,'sine',.22,P.L.toms,.004,40);if(st%4===2)evNoise(t,.03,.016,P.L.tick,'bandpass',2400,4);}
  // глушитель во тьме — только сердце
  if(dark&&(st===0||st===3))ev(t,55,.35,'sine',.26,P.L.toms,.004,38);
  // медь
  if(S.brass&&!P.calm&&!dark&&!X.drop&&st===0&&bar%8===(S.boss?0:4)){const c=AU.ctx,dur=3.2;for(const iv of [0,7]){const o=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain();o.type='sawtooth';o.frequency.value=tn(root+iv);f.type='bandpass';f.Q.value=2.5;f.frequency.setValueAtTime(180,t);f.frequency.exponentialRampToValueAtTime(900,t+1.4);f.frequency.exponentialRampToValueAtTime(260,t+dur);
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(S.brass,t+.8);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(f);f.connect(g);g.connect(P.L.brass);vStart(o,t);o.stop(t+dur+.05);}tonal(t,P.id);}
  // треск бури / глушителя
  if(S.crackle&&(X.storm||S.boss)&&Math.random()<.18)evNoise(t,.02,.035,P.L.fx,'highpass',3500);
  if(S.swarm&&st%2===0&&Math.random()<.5)evNoise(t,.12,.012,P.L.fx,'bandpass',rnd(900,2400),6);
  step80(P,t,st,bar);
}
function scapeRun(P,now,ahead){
  const S=P.sc;const sd=60/((S.bpm||90)+(P.ext.bpmAdd||0))/4;
  if(P.next<now-.25)P.next=now+.05;
  while(P.next<ahead){
    if(P.next>=P.nextChord)setChord(P,P.next);
    scapeStep(P,P.next);P.step++;P.next+=sd;}
  if(S.bell&&P.nextBell<ahead){bell(P,Math.max(now,P.nextBell));P.nextBell+=rnd(S.bell[1],S.bell[2])*(P.I>.5?1.6:1);}
  if(S.ping&&P.nextPing<ahead){const t=Math.max(now,P.nextPing),f=rnd(880,1240);[0,.32,.64].forEach((d,i)=>ev(t+d,f*(i===2?.75:1),1.4,'sine',.03*(1-i*.3),P.L.bell,.02));tonal(t,P.id);P.nextPing+=rnd(10,15);}
}
function scapeLayers(P){
  const t=AU.ctx.currentTime,S=P.sc,X=P.ext,I=P.I,set=(k,v,tc)=>P.L[k].gain.setTargetAtTime(v,t,tc||.7);
  const dark=X.darkOff;
  set('pad',dark?.15:1);set('sub',1);set('noise',dark?.6:1);set('bell',1);
  set('pulse',S.fight&&!P.calm?(S.boss?1:.45+.55*I):0);set('toms',S.fight&&!P.calm?(S.boss?1:.25+.75*I):S.alert?I:0);
  set('tick',S.fight&&!P.calm?(S.boss?1:I):S.alert?I:0);set('brass',S.boss?1:I);set('fx',1);set('hi',X.transmit?1:0,1.5);
  const lo=S.pad[1],hi=S.pad[2],br=S.fight&&!P.calm?.35+.65*I:S.alert?.2+.6*I:.4;
  const cut=(lo+(hi-lo)*br)*(X.storm?1.5:1)*(.85+.15*Math.sin(t*.4+P.t0));P.padF.frequency.setTargetAtTime(cut,t,1.2);
  if(S.alert)P.noiseF.frequency.setTargetAtTime(S.noise[1]*(1+.8*I),t,1.5);
  if(S.swarm||S.noise[3]>.5)P.noiseF.frequency.setTargetAtTime(S.noise[1]*(1+.6*Math.sin(t*S.noise[3]*2)),t,.3);
  if(X.anom)P.L.fx.gain.setTargetAtTime(1,t,.5);
}
// стингеры
function ambSting(kind){
  if(!AU.ctx||!AU.sting||!SET.amb)return;const c=AU.ctx,t=c.currentTime+.02,o=AU.sting,P=MUS.cur,root=P?P.sc.root+P.semi:38;
  AU.duckG.gain.cancelScheduledValues(t);AU.duckG.gain.setTargetAtTime(MUS.duckT*.63,t,.08);AU.duckG.gain.setTargetAtTime(MUS.duckT,t+1.5,.6);
  if(kind==='start'){for(const iv of [12,19,24])ev(t,mtof(root+iv),3,'triangle',.05,o,.4);evNoise(t,1.6,.06,o,'bandpass',400,1.5,2500);}
  if(kind==='flash'){for(const iv of [24,31,36])ev(t,mtof(root+iv),2.4,'sine',.05,o,.01);ev(t,70,.6,'sine',.3,o,.003,40);}
  if(kind==='boss'){evNoise(t,2.5,.12,o,'lowpass',200,1,1400);ev(t,mtof(root),3,'sawtooth',.06,o,1.5);ev(t,mtof(root+1),3,'sawtooth',.03,o,1.5);ev(t+2.4,60,.9,'sine',.45,o,.003,32);}
  if(kind==='phase'){ev(t,mtof(root+13),1.2,'sawtooth',.04,o,.01);ev(t,mtof(root+12),1.2,'sawtooth',.04,o,.01);ev(t,64,.7,'sine',.4,o,.003,34);}
  if(kind==='bossDown'||kind==='win'){for(const iv of [12,19,24,31])ev(t+iv*.004,mtof(root+iv),4.5,'triangle',.045,o,.05);ev(t,66,.8,'sine',.35,o,.003,36);}
  if(kind==='fail'){evNoise(t,3,.08,o,'lowpass',1500,1,120);ev(t,mtof(root+12),3.5,'sine',.06,o,.02,mtof(root));}
}
function makeImpulse(c,sec){const n=c.sampleRate*sec,b=c.createBuffer(2,n,c.sampleRate);for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3.2);}return b;}
function musInit(){
  const c=AU.ctx;AU.mus=c.createGain();AU.mus.gain.value=1;
  AU.musLP=c.createBiquadFilter();AU.musLP.type='lowpass';AU.musLP.frequency.value=18000;
  AU.duckG=c.createGain();AU.duckG.gain.value=1;const comp=c.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=3;
  AU.mus.connect(AU.musLP);AU.musLP.connect(AU.duckG);AU.duckG.connect(comp);comp.connect(AU.amb);
  AU.rev=c.createConvolver();AU.rev.buffer=makeImpulse(c,4);const rg=c.createGain();rg.gain.value=.8;AU.rev.connect(rg);rg.connect(AU.musLP);
  AU.sting=c.createGain();AU.sting.gain.value=1;AU.sting.connect(comp);const ss=c.createGain();ss.gain.value=.35;AU.sting.connect(ss);ss.connect(AU.rev);
  // тревога: звон в ушах (постоянный, тихий) + удары сердца и пульс тритона
  AU.alarm=c.createGain();AU.alarm.gain.value=0;AU.alarm.connect(comp);
  const ring=c.createOscillator();ring.type='sine';ring.frequency.value=2600;const rgn=c.createGain();rgn.gain.value=.006;ring.connect(rgn);rgn.connect(AU.alarm);ring.start();AU.ring=ring;
  {const ns=c.createBufferSource();ns.buffer=noiseBuf();ns.loop=true;AU.riftF=c.createBiquadFilter();AU.riftF.type='bandpass';AU.riftF.Q.value=1.4;AU.riftF.frequency.value=1200;AU.riftG=c.createGain();AU.riftG.gain.value=0;ns.connect(AU.riftF);AU.riftF.connect(AU.riftG);AU.riftG.connect(AU.amb);ns.start();}
  if(!MUS.timer)MUS.timer=setInterval(()=>{try{musSched();}catch(e){console.error(e);}},50);
}
function musSched(){
  if(!AU.ctx||!AU.mus)return;const c=AU.ctx,now=c.currentTime,ahead=now+.3;
  if(c.state!=='running')return;
  for(const P of MUS.players)if(!P.stopAt||now<P.stopAt)scapeRun(P,now,ahead);
  MUS.players=MUS.players.filter(P=>!(P.stopAt&&now>P.stopAt+.2));
  if(MUS.alarm){if(MUS.alarmT<now)MUS.alarmT=now+.05;while(MUS.alarmT<ahead){const t=MUS.alarmT,P=MUS.cur,r=P?P.sc.root+P.semi:40;
    ev(t,60,.25,'sine',.28,AU.alarm,.003,40);ev(t+.22,57,.22,'sine',.2,AU.alarm,.003,38);ev(t+.8,mtof(r+30),.5,'triangle',.03,AU.alarm,.01);MUS.alarmT+=1.6;}
    AU.ring.frequency.setTargetAtTime(2500+300*Math.sin(now*.7),now,.5);}
}
function musSwitch(id,fade,semi){
  if(!AU.ctx)return;const cur=MUS.cur;if(cur&&cur.id===id&&cur.semi===(semi||0))return;
  const c=AU.ctx,t=c.currentTime+.03,N=64;
  const up=new Float32Array(N),dn=new Float32Array(N);for(let i=0;i<N;i++){const x=i/(N-1);up[i]=Math.sin(x*Math.PI/2)*SC_[id].vol;dn[i]=Math.cos(x*Math.PI/2);}
  if(cur){const g=cur.out.gain,v=g.value;g.cancelScheduledValues(t);g.setValueAtTime(v,t);const d2=dn.map(x=>x*v);g.setValueCurveAtTime(d2,t+.001,fade);cur.stopAt=t+fade+.1;scapeStop(cur,t+fade+.1);}
  const P=newScape(id);P.semi=semi||0;if(P.semi){P.pad.forEach((v,k)=>v.o.frequency.value=mtof(P.sc.root+P.semi+12+P.chord[Math.floor(k/2)])*Math.pow(2,v.det/1200));P.subO.frequency.value=mtof(P.sc.root+P.semi);}
  P.out.gain.setValueCurveAtTime(up,t+.001,fade);MUS.players.push(P);MUS.cur=P;MUS.lastName=P.sc.name;
}
// какой пейзаж и с какой интенсивностью нужен сейчас
function musTarget(){
  const st=G.state,p=G.player;let id='menu',I=0,calm=false,semi=0,ext={},low=false,duck=1,lp=18000;
  const bossOf=()=>G.boss&&G.boss.alive&&G.boss.st!=='enter'?'warden':G.jam&&G.jam.alive&&G.jam.st!=='enter'?'jam':null;
  if(G.mode==='endless'&&G.end&&['play','levelup','pause','over','codex'].includes(st)){
    const b=bossOf();id=b||'abyss';I=st==='play'?Math.min(1,.3+G.end.step*.04):.4;if(b){semi=1;}}
  else if(st==='shop')id='shop';else if(st==='hangar')id='hangar';else if(st==='cycle')id='cycle';
  else if(G.mode==='world'&&G.world&&['world','map','pause','codex'].includes(st)&&p){
    {const si=sectorIdx(p.x,p.y);id=si===0?'belt':si===1?'drift':'s'+si;}const hostile=G.enemies.some(e=>e.alive&&e.type!=='mine'&&e.type!=='lock'&&e.type!=='rangedummy'&&!e.peace&&Math.hypot(e.x-p.x,e.y-p.y)<900);
    if(hostile)MUS.hostT=G.t;I=hostile||(G.t-(MUS.hostT||-9)<4)||G.anom?1:0;ext.anom=!!G.anom;if(typeof zbMus==='function'){const q=zbMus();if(q){id=q.id;I=q.I;if(q.ext)Object.assign(ext,q.ext);}}}
  else if((G.mode==='world'||G.mode==='dev')&&['intro','play','levelup','pause','done','over','codex'].includes(st)&&G.m){
    id=SC_['m'+G.m]?'m'+G.m:'mx'+MISSIONS[G.m-1].sec;calm=st==='intro'||st==='done'||st==='over';
    const b=bossOf();if(b&&!calm)id=b;
    if(!calm){const ld=enemyLoad(),near=p&&G.enemies.some(e=>e.alive&&!EDEF[e.type].passive&&Math.hypot(e.x-p.x,e.y-p.y)<300);I=clamp(ld/12+(near?.2:0),0,1);}
    if(G.bc&&G.bc.transStarted)ext.transmit=1;if(G.storm&&G.storm.warn<=0)ext.storm=1;
    if(G.boss&&G.boss.alive){ext.bpmAdd=(G.boss.phase-1)*6;if(G.boss.over>0)ext.drop=1;}
    if(G.jam&&G.jam.alive){ext.bpmAdd=(G.jam.phase-1)*6;if(G.jam.phase===3&&G.jam.window<=0)ext.darkOff=1;}}
  if(G.mode==='endless'&&G.jam&&G.jam.alive&&G.jam.phase===3&&G.jam.window<=0)ext.darkOff=1;
  if(G.mode==='endless'&&G.boss&&G.boss.alive){ext.bpmAdd=(G.boss.phase-1)*6;if(G.boss.over>0)ext.drop=1;}
  if(p&&p.hp>0&&(st==='play'||st==='world'||st==='levelup')){const r=p.hp/G.st.maxHp;if(r<AMB_CFG.alarmOn){low=true;MUS.lowSince=performance.now();}else if(MUS.alarm&&(r<AMB_CFG.alarmOff||performance.now()-MUS.lowSince<AMB_CFG.alarmHold*1000))low=true;}
  if(st==='pause'){duck=.5;lp=800;}
  return mus80({id,I,calm,semi,ext,low,duck,lp});
}
let musLayerT=0;
function musicTick(dt){
  if(!AU.ctx||!AU.mus)return;const T=musTarget(),t=AU.ctx.currentTime,cur=MUS.cur;
  if(!cur||cur.id!==T.id||cur.semi!==T.semi){const from=cur?cur.sc:null,to=SC_[T.id];
    const fade=to.fight&&!(from&&from.fight)?AMB_CFG.fadeFight:from&&from.fight&&!to.fight?AMB_CFG.fadeOut:to.boss?AMB_CFG.fadeFight:AMB_CFG.fadeCalm;
    musSwitch(T.id,fade80(cur,T.id,fade),T.semi);}
  const P=MUS.cur;P.I+=(T.I-P.I)*Math.min(1,dt/2);P.calm=T.calm;P.ext=T.ext;
  if((musLayerT-=dt)<=0){musLayerT=.25;scapeLayers(P);}
  if(T.low!==MUS.alarm){MUS.alarm=T.low;AU.alarm.gain.setTargetAtTime(T.low?1:0,t,.5);}
  const rI=G.world&&G.state==='world'||G.riftDeath?(G.riftI||0):0;
  let lp=T.low?1200:T.lp;if(rI>.02)lp=Math.min(lp,600+17400*Math.pow(1-rI,2));if(Math.abs(lp-(MUS.lp||0))>40){MUS.lp=lp;AU.musLP.frequency.setTargetAtTime(lp,t,.4);}
  if(AU.riftG){AU.riftG.gain.setTargetAtTime(SET.amb||SET.sfx?rI*.5:0,t,.3);AU.riftF.frequency.setTargetAtTime(600+2400*(.5+.5*Math.sin(t*.7)),t,.5);
    if(rI>.5&&Math.random()<.03){AU.duckG.gain.setTargetAtTime(MUS.duckT*.3,t,.01);AU.duckG.gain.setTargetAtTime(MUS.duckT,t+.08,.05);}}
  if(T.duck!==MUS.duckT){MUS.duckT=T.duck;AU.duckG.gain.setTargetAtTime(T.duck,t,.3);}
}

