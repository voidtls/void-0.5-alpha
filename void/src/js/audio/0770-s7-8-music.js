// ===== музыка секторов VII–VIII: «Бюро» и «Исток», тёмные варианты, плавная смена =====
SC_.s6={name:'Предел · бюро',root:41,v:[[0,7,14,17],[-2,5,12,14],[0,7,10,14],[-5,2,7,14]],chordT:[10,16],pad:['sawtooth',360,900,.026],sub:.085,noise:['bandpass',1400,.01,.05],bell:['metal',8,14,.02],rev:.32,alert:1,vol:.7,bpm:96,mech:1};
SC_.s6d={name:'Предел · без света',root:41,v:[[0,7,14,17],[-2,5,12,14]],chordT:[14,20],pad:['triangle',260,520,.03],sub:.1,noise:['lowpass',380,.016,.04],bell:['metal',12,20,.014],rev:.45,alert:1,vol:.66,bpm:96,relay:1};
SC_.s7={name:'Исток · хор',root:36,v:[[0,7,12,19],[5,12,17,24],[-2,5,14,19],[0,7,14,19]],chordT:[14,22],pad:['sine',500,1300,.05],sub:.07,noise:['bandpass',900,.008,.04],bell:['glass',9,15,.022],rev:.62,alert:1,vol:.72,bpm:60,vib:[4.6,9],choir:1};
SC_.s7d={name:'Исток · один голос',root:36,v:[[0,12,19,24]],chordT:[20,30],pad:['sine',420,800,.035],sub:.06,noise:['lowpass',300,.01,.03],bell:['glass',14,22,.016],rev:.7,alert:1,vol:.62,bpm:60,vib:[4.2,7]};
SC_.mx6=Object.assign({},SC_.mx6,{name:'Бой · Предел',root:41,bpm:102,metal:1,heavy:1,mech:1,brass:.03});SC_.mx6d=Object.assign({},SC_.mx6,{name:'Бой · Предел без света',pad:['triangle',260,600,.03],toms:'fight',heavy:0,relay:1,brass:0});
SC_.mx7=Object.assign({},SC_.mx7,{name:'Бой · Исток',root:36,bpm:66,vib:[4.6,9],pulse:'q',brass:.025});SC_.mx7d=Object.assign({},SC_.mx7,{name:'Бой · Исток во тьме',pad:['sine',380,700,.03],brass:0});
function scape80(P,c,t){const S=P.sc;if(!S.vib||!P.pad)return;const l=c.createOscillator();l.frequency.value=S.vib[0];const lg=c.createGain();lg.gain.value=S.vib[1];l.connect(lg);for(const v of P.pad)if(v&&v.o)lg.connect(v.o.detune);vStart(l,t);P.nodes.push(l);}
function step80(P,t,st,bar){const S=P.sc,X=P.ext||{},root=S.root+(P.semi||0);step85(P,t,st,bar);step90(P,t,st,bar);
  if(S.mech&&!X.darkOff&&!X.mechOff){if(st===0||st===6||st===10)evNoise(t,.07,.05,P.L.toms,'lowpass',420);if(st===4||st===12)evNoise(t,.04,.03,P.L.tick,'bandpass',3600,9);if(st===14&&bar%2===0)ev(t,mtof(root+24),.18,'square',.012,P.L.fx,.004);}
  if(S.relay&&st%8===3&&Math.random()<.5)evNoise(t,.02,.03,P.L.tick,'highpass',5200);
  if(S.choir&&!X.choirOff&&st===0&&bar%2===0){const iv=P.chord[Math.random()*P.chord.length|0];ev(t,mtof(root+24+iv),3.2,'sine',.018,P.L.bell,.6,null,rnd(-.5,.5));tonal(t,P.id);}
  if(X.siren&&(st===0||st===8)){ev(t,mtof(root+30),.9,'triangle',.03,P.L.fx,.05,mtof(root+33));}}
const SECSC80=new Set(['s6','s7','s6d','s7d','mx6','mx7','mx6d','mx7d']);
function mus80(T){const st=G.state;if(SECSC80.has(T.id)){if(G.bo80>=.5&&SC_[T.id+'d'])T.id=T.id+'d';}
  if(W80.alarm&&G.world)T.ext.siren=1;
  // гистерезис на границе секторов: новая тема — через 2 с в новом секторе
  if(G.world&&st==='world'&&/^s\d+d?$/.test(T.id)){const base=T.id.replace('d','');const H_=MUS.h80||(MUS.h80={id:base,since:G.t});if(H_.cand!==base){H_.cand=base;H_.since=G.t;}if(base!==H_.id&&G.t-H_.since>=2)H_.id=base;if(base!==H_.id){const keep=H_.id+(T.id.endsWith('d')&&SC_[H_.id+'d']?'d':'');if(SC_[keep])T.id=keep;}}
  return mus90(mus85(T));}
function fade80(cur,id,fade){if(!cur)return fade;{const f85=fade85(cur.id,id);if(f85)return f85;}const a=cur.id,b=id;if(SECSC80.has(a)||SECSC80.has(b)){const ba=a.replace(/d$/,''),bb=b.replace(/d$/,'');if(ba===bb)return 3;if(/^s\d+$/.test(ba)&&/^s\d+$/.test(bb))return 6;}return fade;}
// --- миссии VIII: не больше 2 Изнанок за миссию и 1 в волне ---
for(let m=32;m<=38;m++){const M=MISSIONS[m-1];if(!M||!M.wavesT)continue;let n=0;for(const wv of M.wavesT){let k=0;for(let i=0;i<wv.length;i++){if(wv[i]==='inverse'){if(n>=2||k>=1)wv[i]='loop';else{n++;k++;}}}}}
// --- мастерство миссий 28–37 ---
Object.assign(MASTERY,{27:{t:'Порвать луч Лаборанта рывком',ok:()=>!!G.mc&&!!G.mc.beam80},28:{t:'Ни разу не взорваться штампом',ok:()=>!!G.mc&&!G.mc.stampBoom80},29:{t:'Ни разу не вызвать «нарушение регламента»',ok:()=>!!G.mc&&!G.mc.seen80},
  31:{t:'Ни разу не получить от себя же',ok:()=>!!G.mc&&!G.mc.echoHit80},32:{t:'Разорвать все Петли с первого раза',ok:()=>!!G.mc&&(G.mc.loopK80||0)>0&&!G.mc.loopBad80},33:{t:'Ни разу не попасть под волну Изнанки',ok:()=>!!G.mc&&!G.mc.inv80},
  34:{t:'Импульсом стереть память Отзвука',ok:()=>!!G.mc&&!!G.mc.echoWipe80},35:{t:'Не задеть ни одного Паломника',ok:()=>!!G.mc&&!G.mc.pilHit80},36:{t:'Уничтожить 10 врагов в темноте',ok:()=>!!G.mc&&(G.mc.dark80||0)>=10}});


