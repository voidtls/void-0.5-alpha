// ======================= ЗВУК =======================
const SND90={};
const SND90P=new Set(['beat','perfect','key','launch','stop','alarm','wake','lost','fragGet','plaque','final','tide','tideW','beacon','beaconX','ebb','chime','quiet','arr','miss','tick']);
function snd90(kind,v){if(!AU.ctx||!SET.sfx||!AU.sfx)return;const c=AU.ctx,t=c.currentTime;const now=performance.now();if(SND90[kind]&&now-SND90[kind]<80)return;SND90[kind]=now;if(typeof vox95==='function'&&!vox95(.4,SND90P.has(kind)))return;
  const det=()=>Math.pow(2,rnd(-30,30)/1200);
  const out=(pan)=>{if(pan&&c.createStereoPanner){const p=c.createStereoPanner();p.pan.value=clamp(pan,-.6,.6);p.connect(AU.sfx);return p;}return AU.sfx;};
  const tone=(f0,f1,dur,type,vol,delay,pan)=>{delay=delay||0;const o=c.createOscillator(),g=c.createGain(),k=det();o.type=type;o.frequency.setValueAtTime(f0*k,t+delay);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1*k),t+delay+dur);g.gain.setValueAtTime(0.0001,t+delay);g.gain.linearRampToValueAtTime(vol,t+delay+.01);g.gain.exponentialRampToValueAtTime(.0001,t+delay+dur);o.connect(g);g.connect(out(pan));o.start(t+delay);o.stop(t+delay+dur+.03);};
  const noise=(dur,vol,f,type,delay,f2,pan,q)=>{delay=delay||0;const s=c.createBufferSource();s.buffer=noiseBuf95(c);const fl=c.createBiquadFilter();fl.type=type||'lowpass';if(q)fl.Q.value=q;fl.frequency.setValueAtTime(f,t+delay);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+delay+dur);const g=c.createGain();g.gain.setValueAtTime(vol,t+delay);g.gain.linearRampToValueAtTime(.0001,t+delay+dur);s.connect(fl);fl.connect(g);g.connect(out(pan));s.start(t+delay,Math.random()*Math.max(0,1.9-dur),dur+.05);};
  switch(kind){
    case 'beat':{const k=(v===undefined?1:v)*.7;tone(58,40,.32,'sine',.42*k);noise(.18,.22*k,300);tone(52,38,.26,'sine',.28*k,.2);noise(.12,.12*k,260,'lowpass',.2);tone(1250,700,.035,'triangle',.03*k);break;}
    case 'perfect':tone(660,660,.25,'sine',.07);tone(990,990,.22,'sine',.05,.02);break;
    case 'tick':tone(v?1760:1320,v?1760:1320,.05,'square',.05);break;
    case 'key':{const f=440*Math.pow(2,[0,4,7,12,16][clamp((v||1)-1,0,4)]/12);tone(f,f,.5,'triangle',.09);tone(f*2,f*2,.3,'sine',.03,.02);break;}
    case 'miss':tone(220,208,.35,'sawtooth',.06);tone(233,220,.35,'sawtooth',.05);break;
    case 'launch':for(const iv of [0,7,12,16])tone(220*Math.pow(2,iv/12),220*Math.pow(2,iv/12),1.4,'triangle',.05,iv*.012);noise(1,.25,600,'lowpass',0,3000);break;
    case 'stop':tone(80,30,2.2,'sine',.25);noise(1.6,.2,300,'lowpass',0,60);break;
    case 'arr':for(let i=0;i<3;i++)tone(70,45,.2,'sine',.2,[0,.15,.42][i]);break;
    case 'cells':noise(.5,.15,500,'bandpass',0,1500);break;
    case 'heal':noise(.6,.2,400,'lowpass',0,120);tone(180,120,.5,'sine',.08);break;
    case 'lock':noise(.4,.4,180,'bandpass',0,140,0,6);tone(90,60,.4,'square',.06);break;
    case 'lockw':for(let i=0;i<3;i++)tone(880,880,.06,'square',.03,i*.25);break;
    case 'locko':noise(.5,.15,1200,'bandpass',0,400);break;
    case 'blop':{const f=300+(v||0)*60;tone(f,f*1.6,.12,'sine',.08);break;}
    case 'burst':noise(.35,.4,1200,'lowpass',0,200);tone(400,90,.3,'square',.06);break;
    case 'quiet':tone(1400,1400,.04,'sine',.05);if(AU.duckG){AU.duckG.gain.setTargetAtTime(.25,t,.02);AU.duckG.gain.setTargetAtTime(MUS.duckT||1,t+.35,.2);}break;
    case 'spot':tone(1100,1100,.08,'square',.04);tone(880,880,.12,'square',.04,.09);break;
    case 'alarm':for(let i=0;i<4;i++)tone(1568*Math.pow(2,[0,3,7,10][i]/12),1568*Math.pow(2,[0,3,7,10][i]/12),.25,'sine',.04,i*.08);break;
    case 'wake':for(let i=0;i<3;i++)tone(349*Math.pow(2,[0,4,7][i]/12),349*Math.pow(2,[0,4,7][i]/12),1.1,'sine',.06,i*.12);break;
    case 'lost':for(let i=0;i<3;i++)tone(392*Math.pow(2,[0,-3,-7][i]/12),392*Math.pow(2,[0,-3,-7][i]/12),.6,'triangle',.06,i*.18);break;
    case 'flow':noise(.35,.12,900,'bandpass',0,2400);break;
    case 'cut':tone(2000,500,.12,'square',.05);noise(.1,.2,3000,'highpass');break;
    case 'valve':tone(110,50,.35,'sine',.3);noise(.2,.2,400);break;
    case 'dissolve':noise(.5,.2,3000,'highpass',0,800);break;
    case 'pud':noise(.4,.25,250,'lowpass',0,90);break;
    case 'hatch':noise(.15,.3,2200,'bandpass');tone(600,200,.2,'triangle',.06);break;
    case 'inhale':noise(.45,.18,1800,'highpass',0,5000,v||0);break;
    case 'fix':tone(200,900,.6,'sawtooth',.04);break;
    case 'erase':noise(.4,.1,4000,'highpass',0,1500);break;
    case 'eraseT':noise(.6,.06,6000,'highpass');break;
    case 'crumble':for(let i=0;i<4;i++)noise(.08,.15,1500+i*400,'bandpass',i*.07);break;
    case 'chime':for(let i=0;i<3;i++)tone(1046*Math.pow(2,[0,4,7][i]/12),1046*Math.pow(2,[0,4,7][i]/12),.5,'sine',.04,i*.08);break;
    case 'tideW':noise(2.6,.25,120,'lowpass',0,400);break;
    case 'tide':noise(3,.3,500,'lowpass',0,150);tone(55,45,2,'sine',.15);break;
    case 'frag':tone(700,720,.6,'sine',.04);tone(1100,1080,.6,'sine',.03,.05);break;
    case 'fragGet':for(let i=0;i<4;i++)tone(784*Math.pow(2,[0,5,7,12][i]/12),784*Math.pow(2,[0,5,7,12][i]/12),.7,'sine',.05,i*.1);break;
    case 'beacon':for(let i=0;i<5;i++)tone(523*Math.pow(2,BEACON_NOTE[i]/12),523*Math.pow(2,BEACON_NOTE[i]/12),1.5,'sine',.025,i*.15);break;
    case 'beaconX':{const f=523*Math.pow(2,BEACON_NOTE[v||0]/12);tone(f,f*.5,1.6,'sine',.08);noise(.6,.2,2000,'bandpass',0,300);break;}
    case 'ebb':noise(1.6,.3,2000,'lowpass',0,200);break;
    case 'shadow':tone(150,450,1,'sawtooth',.03);noise(1,.08,800,'bandpass',0,2400);break;
    case 'plaque':tone(1320,1320,.08,'sine',.04);tone(1760,1760,.12,'sine',.03,.07);break;
    case 'final':noise(1.4,.25,800,'lowpass',0,5000);tone(220,660,1.4,'sine',.06);break;}}
// ======================= МУЗЫКА =======================
SC_.s8={name:'Сердце Ковчега',root:41,v:[[0,7,12,16],[5,12,16,19],[-3,4,9,12],[0,7,9,14]],chordT:[12,18],pad:['triangle',380,900,.044],sub:.09,noise:['lowpass',320,.012,.04],bell:['glass',9,15,.02],rev:.5,alert:1,vol:.7,bpm:50,ark90:1};
SC_.mx8={name:'Бой · Сердце Ковчега',root:41,v:[[0,7,12,16],[5,12,16,19],[-3,4,9,12]],chordT:[8,12],pad:['sawtooth',360,1000,.028],sub:.1,noise:['bandpass',700,.012,.08],bell:['glass',12,18,.016],rev:.4,fight:1,bpm:50,pulse:'q',toms:'fight',vol:.95,ark90:1};
SC_.s9={name:'Стёртые берега',root:44,v:[[0,7,14,19],[-5,2,9,14],[0,5,12,17]],chordT:[16,24],pad:['sine',420,1000,.042],sub:.06,noise:['lowpass',500,.01,.03],bell:['shine',6,11,.024],rev:.7,alert:1,vol:.66,bpm:64,shore90:1};
SC_.mx9={name:'Бой · Стёртые берега',root:44,v:[[0,7,14,19],[-5,2,9,14]],chordT:[10,16],pad:['triangle',380,950,.034],sub:.09,noise:['bandpass',900,.01,.08],bell:['shine',10,16,.018],rev:.55,fight:1,bpm:92,pulse:'q',toms:'fight',vol:.9,shore90:1};
SC_.b42={name:'Сердце',root:41,v:[[0,7,12,16],[-3,4,9,12],[5,12,16,19]],chordT:[8,12],pad:['sawtooth',340,1100,.03],sub:.12,noise:['lowpass',300,.02,.05],bell:['glass',10,16,.016],rev:.45,fight:0,bpm:50,vol:.9,heart90:1,boss90:1};
SC_.b46={name:'Берег',root:44,v:[[0,7,14,19],[0,5,12,17]],chordT:[14,20],pad:['sine',380,900,.04],sub:.08,noise:['lowpass',420,.012,.04],bell:null,rev:.75,fight:0,bpm:64,vol:.85,shore46:1,boss90:1};
SECSC80.add('s8');SECSC80.add('s9');SECSC80.add('mx8');SECSC80.add('mx9');
function step90(P,t,st,bar){const S=P.sc,X=P.ext||{},root=S.root+(P.semi||0);if(!AU.ctx)return;step110(P,t,st,bar);
  if(S.ark90&&st%4===0){const v=S.fight?.26:.2*(P.I>0?1:.6);ev(t,58,.3,'sine',v,P.L.toms,.004,40);ev(t+.19,52,.24,'sine',v*.6,P.L.toms,.004,38);}
  if(S.ark90&&X.alarm90&&st%2===0){const pent=[0,2,4,7,9];const n=root+36+pent[(st/2+bar)%5];ev(t,mtof(n),.35,'sine',.02,P.L.bell,.005,null,rnd(-.5,.5));}
  if(S.shore90&&st===0&&bar%2===0&&Math.random()<.8){const iv=P.chord[Math.random()*P.chord.length|0],d=Math.random()<.6?rnd(.4,1.2):3;ev(t,mtof(root+24+iv),d,'sine',.025,P.L.bell,.02,null,rnd(-.6,.6));}
  if(S.heart90&&X.ph90<4&&st===0)ev(t,mtof(root+12),1.6,'triangle',.03,P.L.sub,.05);
  if(S.heart90&&X.ph90===4&&st%4===0)ev(t,mtof(root+36),.06,'square',.012,P.L.tick,.002);
  if(S.shore46&&st===0){const m=X.notes46||0;for(let i=0;i<5;i++)if(m&(1<<i))ev(t+i*.04,mtof(root+24+BEACON_NOTE[i]),3.4,'sine',.02,P.L.bell,.3,null,(i-2)*.25);}}
function mus90(T){T=mus110(T);const X=G.x90;
  if(inMission()&&X&&X.sec===8&&X.alarmOn&&/^mx8/.test(T.id)){if(X.alarm>=60){T.ext.alarm90=1;T.ext.bpmAdd=(T.ext.bpmAdd||0)+20;}else if(X.alarm>=30)T.I=Math.max(T.I,.6);}
  if(inMission()&&X&&X.sec===9&&X.hud&&X.hud.cur)T.lp=Math.min(T.lp||18000,2400);
  return T;}

