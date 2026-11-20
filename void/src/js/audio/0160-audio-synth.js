// ---------- Аудио (WebAudio, синтез без файлов) ----------
const AU={ctx:null};
function audioInit(){
  if(AU.ctx){if(AU.ctx.state!=='running'&&AU.ctx.state!=='closed'){try{AU.ctx.resume();}catch(e){}}return;}
  try{
    const A=window.AudioContext||window.webkitAudioContext;const c=new A();AU.ctx=c;
    AU.amb=c.createGain();AU.amb.gain.value=0;AU.amb.connect(c.destination);
    AU.sfx=c.createGain();AU.sfx.gain.value=.32;const slp=c.createBiquadFilter();slp.type='lowpass';slp.frequency.value=4200;AU.sfx.connect(slp);slp.connect(c.destination);
    musInit();
    AU.pingT=6;applyAudio();
  }catch(e){AU.ctx=null;}
}
function applyAudio(){if(!AU.ctx)return;const t=AU.ctx.currentTime;AU.amb.gain.setTargetAtTime(SET.amb?SET.ambVol*.55:0,t,.6);}
const sfxLast={};
const PENTA=[523.25,587.33,659.25,783.99,880];
function sfx(n){
  if(!AU.ctx||!SET.sfx)return;const c=AU.ctx,t=c.currentTime;
  const lim={shot:.07,hit:.04,pick:.03,block:.05,boom:.05,bhit:.15,kill:.05,killBig:.08};if(lim[n]){if(sfxLast[n]&&t-sfxLast[n]<lim[n])return;sfxLast[n]=t;}
  const tone=(f0,f1,dur,type,vol,delay=0)=>{const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f0,t+delay);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+delay+dur);g.gain.setValueAtTime(vol,t+delay);g.gain.exponentialRampToValueAtTime(.0001,t+delay+dur);o.connect(g);g.connect(AU.sfx);o.start(t+delay);o.stop(t+delay+dur+.02);};
  const noise=(dur,vol,f)=>{const len=c.sampleRate*dur|0,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);const s=c.createBufferSource();s.buffer=b;const fl=c.createBiquadFilter();fl.type='lowpass';fl.frequency.value=f;const g=c.createGain();g.gain.value=vol;s.connect(fl);fl.connect(g);g.connect(AU.sfx);s.start(t);};
  switch(n){
    case 'shot':{const f=rnd(760,860);tone(f,f*.6,.07,'triangle',.034);tone(f*2.01,f*1.3,.045,'sine',.01);break;}
    case 'hit':tone(420,300,.04,'sine',.03);break;
    case 'kill':{const n=PENTA[Math.random()*5|0];tone(n,n,.16,'triangle',.06);tone(n*1.5,n*1.5,.2,'sine',.035,.04);noise(.12,.12,700);break;}
    case 'killBig':{const n=PENTA[Math.random()*5|0]/2;tone(n,n,.32,'triangle',.08);tone(n*1.5,n*1.5,.36,'sine',.05,.05);tone(n*2,n*2,.3,'sine',.03,.1);noise(.3,.22,500);break;}
    case 'boom':noise(.35,.35,700);tone(110,45,.35,'sine',.22);break;
    case 'bigboom':noise(1.4,.8,600);tone(80,25,1.3,'sine',.5);break;
    case 'pick':tone(900,1500,.08,'sine',.09);break;
    case 'cell':tone(500,1000,.12,'triangle',.12);tone(1000,1600,.12,'sine',.08,.08);break;
    case 'dash':noise(.18,.25,2400);tone(200,600,.15,'sawtooth',.05);break;
    case 'hurt':tone(220,60,.25,'sawtooth',.16);noise(.2,.3,1200);break;
    case 'shield':tone(1200,400,.2,'triangle',.12);break;
    case 'pulse':tone(90,30,.7,'sine',.5);noise(.6,.4,1600);break;
    case 'level':[523,659,784,1046].forEach((f,i)=>tone(f,f,.18,'triangle',.09,i*.07));break;
    case 'warn':tone(660,660,.12,'square',.05);tone(660,660,.12,'square',.05,.18);break;
    case 'block':tone(1800,900,.05,'square',.03);break;
    case 'bhit':tone(180,90,.2,'square',.07);break;
    case 'flash':[392,523,659].forEach((f,i)=>tone(f,f*2,.5,'sine',.08,i*.05));break;
    case 'charged':tone(1400,300,.35,'sawtooth',.06);tone(700,180,.4,'triangle',.12);noise(.25,.25,3000);break;
  }
}

