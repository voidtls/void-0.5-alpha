/* ===== 1.4.0 α «Живые корпуса»: 16 поздних корпусов — 8 живых слоёв и свой рывок у каждого =====
   Силуэт не меняется (лор: это копии VØID-013). Меняется поведение: покой, двигатель, след, рывок (старт → полёт → финиш),
   импульс и витрина в «Хранилище корпусов». Только отрисовка: ни одна игровая величина не трогается. */
const SK62={marks:[],dashOn:false,from:null,endT:0,now:0,lastT:0,acc:0,cur:null,prev:false,key:'',buf:[],st:{}};
const SK62_LATE=['archive','rime','izmo','unborn','glyph','argument','shard85','serial013','silence85','callsign013','carrier85','ark90','dawn90','typo100','tidemark100','shore100s'];
/* свой генератор случайных чисел для эффектов: игровой Math.random не тратится, симуляция не меняется */
let VR62=0x9e3779b9;function vr62(){VR62=(VR62*1664525+1013904223)>>>0;return VR62/4294967296;}function vr62r(a,b){return a+vr62()*(b-a);}
function fx62(){return !!SET.fx&&!SET.lessFx&&!G.lowFx;}
function mark62(x,y,life,draw,o){const M=SK62.marks;if(M.length>=40)M.shift();M.push(Object.assign({x,y,t0:SK62.now,life:life*(fx62()?1:.5),draw},o||{}));}
function hull62(s){s=s||1;ctx.beginPath();ctx.moveTo(19*s,0);ctx.lineTo(-11*s,-12*s);ctx.lineTo(-5*s,0);ctx.lineTo(-11*s,12*s);ctx.closePath();}
function ghost62(x,y,a,col,al,lw,fill){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=al;hull62();if(fill){ctx.fillStyle=fill;ctx.fill();}ctx.strokeStyle=col;ctx.lineWidth=lw||1.4;ctx.stroke();ctx.restore();}
function ring62(x,y,r,col,al,lw){if(r<=0)return;ctx.globalAlpha=al;ctx.strokeStyle=col;ctx.lineWidth=lw||2;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();}
function emit62(dt,rate,fn){if(!fx62())return;SK62.acc+=dt*rate;let n=0;while(SK62.acc>=1&&n<4){SK62.acc-=1;n++;try{fn();}catch(e){}}}
function lerp62(a,b,q){return a+(b-a)*q;}
function path62(m,q){return [lerp62(m.x,m.x2,q),lerp62(m.y,m.y2,q)];}
/* пять чужих букв «Глифа» — короткие штрихи 6×6 */
const GLY62=[g=>{g.beginPath();g.arc(0,0,2.6,.3,4.6);g.moveTo(-3,3);g.lineTo(3,3);g.stroke();},g=>{g.beginPath();g.moveTo(-3,3);g.lineTo(0,-3);g.lineTo(3,3);g.moveTo(-1.5,1);g.lineTo(1.5,1);g.stroke();},
  g=>{g.beginPath();g.moveTo(-3,-3);g.lineTo(3,-3);g.moveTo(0,-3);g.lineTo(0,3);g.moveTo(-2,3);g.lineTo(2,1);g.stroke();},g=>{g.beginPath();for(let i=0;i<=12;i++){const a=i*.6,r=.3*i;g.lineTo(Math.cos(a)*r,Math.sin(a)*r);}g.stroke();},
  g=>{g.beginPath();g.moveTo(-3,-2);g.lineTo(3,-2);g.moveTo(-3,2);g.lineTo(3,2);g.moveTo(-1,-3.5);g.lineTo(1,3.5);g.stroke();}];
function glyph62(i,x,y,s,col,al,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.scale(s,s);ctx.globalAlpha=al;ctx.strokeStyle=col;ctx.lineWidth=1.2/s;ctx.lineCap='round';GLY62[((i%5)+5)%5](ctx);ctx.restore();}
/* позывной: «· · ·  — — —  · · ·» настоящим ритмом (точка 0,12 с) */
const MORSE62=(()=>{const u=.12,a=[];const L=(s)=>{for(let i=0;i<s.length;i++){a.push([1,s[i]==='.'?u:3*u]);if(i<s.length-1)a.push([0,u]);}};L('...');a.push([0,3*u]);L('---');a.push([0,3*u]);L('...');a.push([0,7*u]);let T=0;for(const q of a)T+=q[1];return {a,T};})();
function morse62(t){let x=((t%MORSE62.T)+MORSE62.T)%MORSE62.T;for(const [on,d] of MORSE62.a){if(x<d)return on;x-=d;}return 0;}
function beat62(t){return typeof beat90==='function'?beat90(t):Math.pow(Math.max(0,1-((t*50/60)%1)*3.2),2);}

/* ---------- описатели корпусов ---------- */
const SKFX={
archive:{c:'#9fd8ff',
  under(t,sp,k,e){for(let i=2;i>=1;i--){ctx.save();ctx.translate(-i*3-k*i*5,i*1.2*Math.sin(t*1.3+i));ctx.globalAlpha=(.16+.18*k)/i;ctx.strokeStyle='#bfe8ff';ctx.lineWidth=1;ctx.strokeRect(-16,-8,34,16);ctx.restore();}},
  over(t,sp,k,e){const x=-16+((t*.45)%1)*34;const g=ctx.createLinearGradient(x-5,0,x+1,0);g.addColorStop(0,'rgba(191,232,255,0)');g.addColorStop(1,'rgba(223,246,255,.75)');ctx.fillStyle=g;ctx.fillRect(x-5,-8,6,16);
    for(let i=-3;i<=3;i++){const on=((Math.floor(t*6)+i*3)%5)===0;ctx.fillStyle=on?'#ffffff':'rgba(159,216,255,.35)';ctx.fillRect(i*4-.6,-6,1.2,3);ctx.fillRect(i*4-.6,3,1.2,3);}
    if(Math.sin(t*3.1)>.6||e>0){ctx.globalAlpha=.55+.45*Math.max(e,Math.sin(t*9));ctx.fillStyle='#ffffff';ctx.font='700 5px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillText('013',2,2);}},
  move(p,t,sp,dt){if(sp>60)emit62(dt,sp/160,()=>{const a=p.ang+Math.PI+vr62r(-.4,.4),r0=vr62r(0,TAU);mark62(p.x-Math.cos(p.ang)*16,p.y-Math.sin(p.ang)*16,.9,(m,q)=>{ctx.save();ctx.translate(m.x+Math.cos(a)*q*30,m.y+Math.sin(a)*q*30);ctx.rotate(r0+q*2.5);ctx.globalAlpha=(1-q)*.7;ctx.strokeStyle='#bfe8ff';ctx.lineWidth=1;ctx.strokeRect(-4,-2.5,8,5);ctx.restore();});});},
  dashStart(p){const x=p.x,y=p.y;mark62(x,y,.6,(m,q)=>{ring62(m.x,m.y,10+q*26,'#dff6ff',(1-q)*.8,2);ctx.globalAlpha=(1-q);ctx.fillStyle='#dff6ff';ctx.font='700 10px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillText('013',m.x,m.y-16-q*8);});},
  dash(p,t,k){},
  dashEnd(p,f){const a=f.a;mark62(f.x,f.y,1.3,(m,q)=>{for(let i=0;i<5;i++){const u=i/4,[x,y]=path62(m,u),qq=Math.max(0,q*1.3-u*.3);if(qq>=1)continue;ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=(1-qq)*.55;ctx.strokeStyle='#bfe8ff';ctx.lineWidth=1.2;ctx.strokeRect(-16,-8,34,16);
      ctx.fillStyle='#dff6ff';ctx.font='700 5px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillText(String(13+i).padStart(3,'0'),2,2);ctx.restore();}
    ctx.globalAlpha=Math.max(0,1-q*1.4);ctx.fillStyle='#dff6ff';ctx.font='700 8px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillText('ЗАПИСАНО',m.x2,m.y2-22);},{x2:p.x,y2:p.y});},
  pulse(p,R){const x=p.x,y=p.y;mark62(x,y,.7,(m,q)=>{for(let i=0;i<14;i++){const a=i/14*TAU+q;ctx.save();ctx.translate(m.x+Math.cos(a)*R*q,m.y+Math.sin(a)*R*q);ctx.rotate(a+q*4);ctx.globalAlpha=(1-q)*.8;ctx.fillStyle='#dff6ff';ctx.fillRect(-3,-2,6,4);ctx.restore();}});}},

rime:{c:'#e6f6ff',
  under(t,sp,k,e){glow(0,0,26,'#dff6ff',.18+.12*Math.sin(t*1.7));},
  over(t,sp,k,e){const P=SK62.cur;const st=SK62.st.rime||(SK62.st.rime={f:.5});const tgt=P?(sp<40?1:0):.6;st.f+= (tgt-st.f)*.03;const f=st.f;
    ctx.strokeStyle='#ffffff';ctx.lineWidth=1;ctx.globalAlpha=.4+.5*f;for(const s of [-1,1])for(let i=0;i<3;i++){const x=-9+i*7,y=s*(5.5-i*1.5);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-2-f*4,y+s*(2+f*5));ctx.moveTo(x-1,y+s*1.5);ctx.lineTo(x+1+f*2,y+s*(1+f*3));ctx.stroke();}
    if(f<.5){ctx.globalAlpha=(.5-f)*1.4;ctx.strokeStyle='#9fd8ff';ctx.beginPath();ctx.moveTo(12,-1);ctx.lineTo(4,2);ctx.lineTo(-2,-2);ctx.lineTo(-7,1);ctx.stroke();}
    const tw=(t*2.3)%1;ctx.globalAlpha=Math.sin(tw*Math.PI);ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(-4+tw*10,-3+tw*2,.9,0,TAU);ctx.fill();},
  move(p,t,sp,dt){if(sp>50)emit62(dt,sp/90,()=>part(p.x-Math.cos(p.ang)*14+vr62r(-5,5),p.y-Math.sin(p.ang)*14+vr62r(-5,5),-Math.cos(p.ang)*vr62r(20,60)+vr62r(-15,15),-Math.sin(p.ang)*vr62r(20,60)+vr62r(-15,15),.7,'#ffffff',vr62r(1,2)));},
  dashStart(p){for(let i=0;i<8&&fx62();i++){const a=i/8*TAU;part(p.x,p.y,Math.cos(a)*120,Math.sin(a)*120,.35,'#dff6ff',2);}mark62(p.x,p.y,.4,(m,q)=>ring62(m.x,m.y,6+q*22,'#ffffff',(1-q)*.9,1.5));},
  dashEnd(p,f){const segs=7,seed=vr62()*9;mark62(f.x,f.y,1.4,(m,q)=>{const L=Math.hypot(m.x2-m.x,m.y2-m.y),a=Math.atan2(m.y2-m.y,m.x2-m.x),nx=-Math.sin(a),ny=Math.cos(a);
      for(let i=0;i<segs;i++){const u0=i/segs,u1=(i+1)/segs,crack=Math.max(0,q-.45)/.55,gap=crack*.35,dr=crack*(4+((i*7+seed)%5));const [x0,y0]=path62(m,u0+gap/segs),[x1,y1]=path62(m,u1-gap/segs);const off=(i%2?1:-1)*dr;
        ctx.globalAlpha=(1-q)*.85;ctx.strokeStyle='#e6f6ff';ctx.lineWidth=4*(1-crack*.5);ctx.beginPath();ctx.moveTo(x0+nx*off,y0+ny*off);ctx.lineTo(x1+nx*off,y1+ny*off);ctx.stroke();
        ctx.globalAlpha=(1-q)*.9;ctx.strokeStyle='#ffffff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x0+nx*(off+1.5),y0+ny*(off+1.5));ctx.lineTo(x1+nx*(off+1.5),y1+ny*(off+1.5));ctx.stroke();}
      if(L<1)return;},{x2:p.x,y2:p.y});},
  pulse(p,R){mark62(p.x,p.y,.8,(m,q)=>{ctx.globalAlpha=(1-q)*.85;ctx.strokeStyle='#ffffff';ctx.lineWidth=1.6;const r=R*q;for(let i=0;i<6;i++){const a=i/6*TAU+q*.6,cx=Math.cos(a),cy=Math.sin(a);ctx.beginPath();ctx.moveTo(m.x,m.y);ctx.lineTo(m.x+cx*r,m.y+cy*r);
      for(const b of [.45,.7]){const bx=m.x+cx*r*b,by=m.y+cy*r*b,l=r*.18;ctx.moveTo(bx,by);ctx.lineTo(bx+Math.cos(a+.6)*l,by+Math.sin(a+.6)*l);ctx.moveTo(bx,by);ctx.lineTo(bx+Math.cos(a-.6)*l,by+Math.sin(a-.6)*l);}ctx.stroke();}});}},

izmo:{c:'#cfefff',
  under(t,sp,k,e){for(let i=0;i<3;i++){const q=((t*.9+i/3)%1);ctx.globalAlpha=(1-q)*.28;ctx.fillStyle='#dff6ff';ctx.beginPath();ctx.arc(-12-q*14,Math.sin(t*2+i)*2,2+q*5,0,TAU);ctx.fill();}},
  over(t,sp,k,e){const g=.5+.5*Math.sin(t*.6);ctx.strokeStyle='rgba(223,246,255,.85)';ctx.lineWidth=.9;for(const s of [-1,1]){ctx.globalAlpha=.5+.4*g;ctx.beginPath();ctx.moveTo(-6,s*4);ctx.lineTo(-6-4*g,s*(6+3*g));ctx.moveTo(-8,s*7);ctx.lineTo(-10-2*g,s*(9+2*g));ctx.moveTo(0,s*3);ctx.lineTo(-2-3*g,s*(5+2*g));ctx.stroke();}
    for(let i=0;i<4;i++){const ph=(t*1.3+i*.37)%1;ctx.globalAlpha=Math.max(0,Math.sin(ph*Math.PI))*.9;ctx.fillStyle='#ffffff';const x=[8,-3,-8,2][i],y=[-2,5,-6,-1][i];ctx.fillRect(x-.5,y-1.5,1,3);ctx.fillRect(x-1.5,y-.5,3,1);}
    if(k>0){ctx.globalAlpha=k*.7;ctx.fillStyle='rgba(230,246,255,.5)';hull62(1.15);ctx.fill();}},
  move(p,t,sp,dt){if(sp>40)emit62(dt,sp/120,()=>part(p.x-Math.cos(p.ang)*12,p.y-Math.sin(p.ang)*12,vr62r(-25,25),vr62r(-25,25),1.1,'#cfefff',vr62r(2,3.5)));},
  dashStart(p){mark62(p.x,p.y,.45,(m,q)=>{glow(m.x,m.y,30*(1-q*.4),'#dff6ff',(1-q)*.9);});},
  dashEnd(p,f){const a=f.a;mark62(f.x,f.y,1.25,(m,q)=>{for(const u of [.25,.55,.85]){const [x,y]=path62(m,u),qq=Math.min(1,q*1.15);ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=(1-qq)*.7;hull62();ctx.fillStyle='rgba(207,239,255,.35)';ctx.fill();ctx.strokeStyle='#ffffff';ctx.lineWidth=1.2;ctx.stroke();
      if(qq>.45){const c=(qq-.45)/.55;ctx.strokeStyle='#9fd8ff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(4,-3*c-1);ctx.lineTo(-2,2);ctx.lineTo(-8,-5*c);ctx.moveTo(4,-3*c-1);ctx.lineTo(0,-8*c);ctx.stroke();
        ctx.fillStyle='#ffffff';for(let j=0;j<4;j++){ctx.globalAlpha=(1-qq)*.8;ctx.fillRect(-6+j*5+c*j*3,(j%2?1:-1)*c*10,1.5,1.5);}}ctx.restore();}},{x2:p.x,y2:p.y});},
  pulse(p,R){mark62(p.x,p.y,.75,(m,q)=>{ring62(m.x,m.y,R*q,'#dff6ff',(1-q)*.8,2);ctx.lineWidth=1.2;ctx.beginPath();for(let i=0;i<24;i++){const a=i/24*TAU,r=R*q;ctx.moveTo(m.x+Math.cos(a)*r,m.y+Math.sin(a)*r);ctx.lineTo(m.x+Math.cos(a)*(r+8+4*(i%2)),m.y+Math.sin(a)*(r+8+4*(i%2)));}ctx.stroke();});}},

unborn:{c:'#ffc2d4',
  under(t,sp,k,e){ctx.strokeStyle='rgba(255,159,184,.45)';ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<=36;i++){const a=i/36*TAU,r=17+1.6*Math.sin(a*5+t*3)+k*6*Math.max(0,-Math.cos(a));ctx.lineTo(Math.cos(a)*r*1.1-k*4,Math.sin(a)*r*.75);}ctx.closePath();ctx.globalAlpha=.6;ctx.stroke();},
  over(t,sp,k,e){const b=beat62(t*1.4);ctx.strokeStyle='#ff6b8a';ctx.lineWidth=.8;ctx.globalAlpha=.35+.55*b;ctx.beginPath();ctx.moveTo(2,0);ctx.quadraticCurveTo(-4,-4,-10,-7);ctx.moveTo(2,0);ctx.quadraticCurveTo(-4,4,-10,7);ctx.moveTo(2,0);ctx.quadraticCurveTo(10,-2,16,0);ctx.stroke();
    for(let i=0;i<3;i++){const q=(t*.5+i/3)%1;ctx.globalAlpha=Math.sin(q*Math.PI)*.8;ctx.fillStyle='#ffe0ea';ctx.beginPath();ctx.arc(-8+q*18,Math.sin(t+i*2)*5,.9,0,TAU);ctx.fill();}
    if(k>0){ctx.globalAlpha=1;glow(2+k*12,0,10,'#ff9fb8',.9);ctx.fillStyle='#ff6b8a';ctx.beginPath();ctx.arc(2+k*12,0,3.4,0,TAU);ctx.fill();}},
  move(p,t,sp,dt){if(sp>50)emit62(dt,sp/200,()=>{const x=p.x-Math.cos(p.ang)*12,y=p.y-Math.sin(p.ang)*12,r=vr62r(2,4),vx=vr62r(-12,12),vy=vr62r(-12,12);mark62(x,y,1.1,(m,q)=>{ctx.globalAlpha=(1-q)*.6;ctx.strokeStyle='#ffc2d4';ctx.lineWidth=.9;ctx.beginPath();ctx.arc(m.x+vx*q,m.y+vy*q-q*8,r*(1+q*.5),0,TAU);ctx.stroke();});});},
  dashStart(p){mark62(p.x,p.y,.5,(m,q)=>{ctx.globalAlpha=(1-q)*.5;ctx.fillStyle='#ffc2d4';ctx.beginPath();ctx.ellipse(m.x,m.y,16*(1-q*.5),11*(1-q*.5),0,0,TAU);ctx.fill();});},
  dashEnd(p,f){mark62(p.x,p.y,.7,(m,q)=>{ring62(m.x,m.y,8+q*30,'#ff9fb8',(1-q)*.8,1.6);for(let i=0;i<6;i++){const a=i/6*TAU+.3;ctx.globalAlpha=(1-q);ctx.fillStyle='#ffe0ea';ctx.beginPath();ctx.arc(m.x+Math.cos(a)*(10+q*36),m.y+Math.sin(a)*(10+q*36),1.8*(1-q)+.4,0,TAU);ctx.fill();}});
    mark62(f.x,f.y,1,(m,q)=>{for(let i=1;i<=4;i++){const [x,y]=path62(m,i/5);ctx.globalAlpha=(1-q)*.55;ctx.strokeStyle='#ffc2d4';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y-q*10,3+i+q*3,0,TAU);ctx.stroke();}},{x2:p.x,y2:p.y});},
  pulse(p,R){mark62(p.x,p.y,.9,(m,q)=>{for(let j=0;j<3;j++){const qq=Math.max(0,q-j*.15);if(qq<=0)continue;ctx.globalAlpha=(1-q)*.6;ctx.strokeStyle='#ff9fb8';ctx.lineWidth=2.4-j*.6;ctx.beginPath();for(let i=0;i<=48;i++){const a=i/48*TAU,r=R*qq+3*Math.sin(a*8+q*10);ctx.lineTo(m.x+Math.cos(a)*r,m.y+Math.sin(a)*r);}ctx.closePath();ctx.stroke();}});}},

glyph:{c:'#ff9fb8',
  under(t,sp,k,e){const f=1+Math.sin(t*20)*.15;glyph62(Math.floor(t*4),-15-sp/60,0,.9*f,'#ff6b8a',.75);},
  over(t,sp,k,e){const cur=Math.floor(t/.42)%5;const P=[[10,0],[3,-4],[3,4],[-4,-6],[-4,6]];for(let i=0;i<5;i++){const on=i===cur||k>0||e>.3;glyph62(i,P[i][0],P[i][1],.42,on?'#ffffff':'#ff9fb8',on?1:.22);if(on&&fx62())glow(P[i][0],P[i][1],5,'#ff9fb8',.5);}},
  move(p,t,sp,dt){if(sp>60)emit62(dt,sp/170,()=>{const g=Math.floor(vr62()*5),a=p.ang+Math.PI+vr62r(-.5,.5),r0=vr62r(-1,1);mark62(p.x-Math.cos(p.ang)*14,p.y-Math.sin(p.ang)*14,1,(m,q)=>glyph62(g,m.x+Math.cos(a)*q*26,m.y+Math.sin(a)*q*26,1.2,'#ffd0e0',(1-q)*.75,r0+q*2));});},
  dashStart(p){mark62(p.x,p.y,.45,(m,q)=>{ring62(m.x,m.y,12+q*16,'#ffd0e0',(1-q)*.8,1.4);for(let i=0;i<5;i++){const a=i/5*TAU;glyph62(i,m.x+Math.cos(a)*(14+q*14),m.y+Math.sin(a)*(14+q*14),1.1,'#ffffff',1-q,a);}});},
  dashEnd(p,f){mark62(f.x,f.y,1.5,(m,q)=>{const a=Math.atan2(m.y2-m.y,m.x2-m.x);for(let i=0;i<5;i++){const u=(i+.5)/5,[x,y]=path62(m,u),born=i*.06,die=.5+i*.09,al=q<born?0:q<die?1:Math.max(0,1-(q-die)/.3);glyph62(i,x,y,1.8,'#ffffff',al*.9,a+Math.PI/2);}},{x2:p.x,y2:p.y});},
  pulse(p,R){mark62(p.x,p.y,.9,(m,q)=>{for(let i=0;i<5;i++){const a=i/5*TAU+q*2;glyph62(i,m.x+Math.cos(a)*R*q,m.y+Math.sin(a)*R*q,2.2,'#ffd0e0',1-q,a+q*3);}});}},

argument:{c:'#d6dee8',
  under(t,sp,k,e){const L=10+sp/24+Math.sin(t*40)*1.5;for(const s of [-1,1]){glow(-19,s*5,L,'#b8c4d6',.65);ctx.fillStyle='rgba(230,240,255,.8)';ctx.beginPath();ctx.moveTo(-17,s*5-2);ctx.lineTo(-17-L*.9,s*5);ctx.lineTo(-17,s*5+2);ctx.closePath();ctx.fill();}},
  over(t,sp,k,e){const x=-12+((t*.7)%1)*30;const g=ctx.createLinearGradient(x-6,0,x+6,0);g.addColorStop(0,'rgba(143,233,255,0)');g.addColorStop(.5,'rgba(143,233,255,.95)');g.addColorStop(1,'rgba(143,233,255,0)');ctx.fillStyle=g;ctx.fillRect(Math.max(-12,x-6),-1.5,Math.min(12,26-(x-6)),3);
    const bl=Math.sin(t*5)>.4;ctx.fillStyle=bl?'#ffffff':'#5a6678';ctx.fillRect(9,-9.5,2,2);ctx.fillRect(9,7.5,2,2);ctx.fillStyle=Math.sin(t*5+Math.PI)>.4?'#9fe3ff':'#3a4a5a';ctx.fillRect(-13,-9.5,2,2);ctx.fillRect(-13,7.5,2,2);
    if(k>0){ctx.globalAlpha=k;ctx.strokeStyle='#ffffff';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(22,-12);ctx.lineTo(29,0);ctx.lineTo(22,12);ctx.stroke();glow(26,0,16,'#d6dee8',k*.9);
      ctx.lineWidth=1;for(let i=0;i<4;i++){ctx.globalAlpha=k*.7;ctx.beginPath();ctx.moveTo(-20-i*6,(i-1.5)*6);ctx.lineTo(-34-i*8,(i-1.5)*6);ctx.stroke();}}},
  move(p,t,sp,dt){if(sp>80)emit62(dt,sp/110,()=>{for(const s of [-1,1]){const c=Math.cos(p.ang),si=Math.sin(p.ang);part(p.x-c*20-si*s*5,p.y-si*20+c*s*5,-c*40+vr62r(-10,10),-si*40+vr62r(-10,10),.6,'#b8c4d6',2.4);}});},
  dashStart(p){const a=Math.atan2(p.dy,p.dx);mark62(p.x,p.y,.5,(m,q)=>{ctx.globalAlpha=(1-q)*.8;ctx.strokeStyle='#ffffff';ctx.lineWidth=1.4;ctx.beginPath();for(let i=-3;i<=3;i++){const b=a+Math.PI+i*.22;ctx.moveTo(m.x+Math.cos(b)*(14+q*10),m.y+Math.sin(b)*(14+q*10));ctx.lineTo(m.x+Math.cos(b)*(30+q*30),m.y+Math.sin(b)*(30+q*30));}ctx.stroke();});},
  dashEnd(p,f){const a=f.a;mark62(p.x,p.y,.7,(m,q)=>{ring62(m.x-Math.cos(a)*10,m.y-Math.sin(a)*10,12+q*34,'#d6dee8',(1-q)*.85,2.6-q*1.6);ctx.save();ctx.translate(m.x+Math.cos(a)*18,m.y+Math.sin(a)*18);ctx.rotate(a);ctx.globalAlpha=(1-q)*.8;ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-4-q*6,-12);ctx.lineTo(4+q*4,0);ctx.lineTo(-4-q*6,12);ctx.stroke();ctx.restore();});},
  pulse(p,R){mark62(p.x,p.y,.8,(m,q)=>{ctx.save();ctx.translate(m.x,m.y);ctx.rotate(q*.5);ctx.globalAlpha=(1-q)*.85;ctx.strokeStyle='#ffffff';ctx.lineWidth=2.4;poly(6,Math.max(24,R*q),0);ctx.stroke();ctx.globalAlpha=(1-q)*.25;ctx.fillStyle='#d6dee8';poly(6,Math.max(24,R*q),0);ctx.fill();ctx.restore();});}},

shard85:{c:'#e8d27a',
  under(t,sp,k,e){glow(0,0,22,'#ffd36b',.15+.1*Math.sin(t*7));for(let i=0;i<2;i++){const a=t*(1.6+i*.5)+i*Math.PI;ctx.save();ctx.translate(Math.cos(a)*22,Math.sin(a)*15);ctx.rotate(a*2);ctx.fillStyle='#e8d27a';ctx.globalAlpha=.8;ctx.beginPath();ctx.moveTo(3,0);ctx.lineTo(-2,-2);ctx.lineTo(-1,2);ctx.closePath();ctx.fill();ctx.restore();}},
  alpha(k){return 1-.85*k;},
  over(t,sp,k,e){const pu=.5+.5*Math.sin(t*4);ctx.strokeStyle='#ffd36b';ctx.lineWidth=1.3;ctx.globalAlpha=.3+.7*pu;ctx.shadowColor='#ffd36b';ctx.shadowBlur=4;ctx.beginPath();ctx.moveTo(8,-2);ctx.lineTo(0,3);ctx.lineTo(-6,-4);ctx.moveTo(2,5);ctx.lineTo(-4,8);ctx.stroke();ctx.shadowBlur=0;
    const s=k>0?k:e*e;if(s>0){const d=7*s;ctx.globalAlpha=1;ctx.fillStyle='#14120a';ctx.strokeStyle='#e8d27a';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(19+d,0);ctx.lineTo(4+d,-5);ctx.lineTo(4+d,5);ctx.closePath();ctx.fill();ctx.stroke();
      for(const g of [-1,1]){ctx.beginPath();ctx.moveTo(2,g*(5+d));ctx.lineTo(-11-d*.6,g*(12+d));ctx.lineTo(-5-d*.6,g*(1+d));ctx.closePath();ctx.fill();ctx.stroke();}
      if(k>0){ctx.globalAlpha=k;ctx.strokeStyle='#ffffff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(4+d,-5);ctx.lineTo(2,-5-d);ctx.moveTo(4+d,5);ctx.lineTo(2,5+d);ctx.stroke();}}},
  move(p,t,sp,dt){if(sp>60)emit62(dt,sp/140,()=>part(p.x-Math.cos(p.ang)*10+vr62r(-6,6),p.y-Math.sin(p.ang)*10+vr62r(-6,6),vr62r(-30,30),vr62r(-30,30),.6,'#e8d27a',vr62r(1.5,2.5)));},
  dashStart(p){for(let i=0;i<10&&fx62();i++)part(p.x,p.y,vr62r(-160,160),vr62r(-160,160),.35,i%2?'#ffffff':'#ffd36b',2);mark62(p.x,p.y,.3,(m,q)=>glow(m.x,m.y,24,'#ffd36b',(1-q)));},
  dashEnd(p,f){const a=f.a;mark62(f.x,f.y,1,(m,q)=>{for(let i=0;i<3;i++){const [x,y]=path62(m,.2+i*.3);ctx.save();ctx.translate(x,y);ctx.rotate(a+(i-1)*.4*q);ctx.globalAlpha=(1-q)*.6;ctx.strokeStyle='#e8d27a';ctx.lineWidth=1.3;ctx.beginPath();if(i===1){ctx.moveTo(10,0);ctx.lineTo(-4,-5);ctx.lineTo(-4,5);}else{ctx.moveTo(2,0);ctx.lineTo(-10,(i-1)*-9);ctx.lineTo(-5,0);}ctx.closePath();ctx.stroke();ctx.restore();}},{x2:p.x,y2:p.y});
    mark62(p.x,p.y,.4,(m,q)=>{ctx.globalAlpha=1-q;ctx.strokeStyle='#ffffff';ctx.lineWidth=1.5;ctx.beginPath();for(let i=0;i<4;i++){const b=i/4*TAU+.4;ctx.moveTo(m.x+Math.cos(b)*4,m.y+Math.sin(b)*4);ctx.lineTo(m.x+Math.cos(b)*(10+q*14),m.y+Math.sin(b)*(10+q*14));}ctx.stroke();});},
  pulse(p,R){const sp=[...Array(12)].map(()=>vr62r(-3,3));mark62(p.x,p.y,.8,(m,q)=>{for(let i=0;i<12;i++){const a=i/12*TAU;ctx.save();ctx.translate(m.x+Math.cos(a)*R*q,m.y+Math.sin(a)*R*q);ctx.rotate(a+q*sp[i]*3);ctx.globalAlpha=(1-q);ctx.fillStyle='#e8d27a';ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(-3,-3);ctx.lineTo(-2,3);ctx.closePath();ctx.fill();ctx.restore();}});}},

serial013:{c:'#8fe9ff',
  under(t,sp,k,e){ctx.save();ctx.rotate(t*.4);ctx.setLineDash([3,4]);ctx.strokeStyle='rgba(232,210,122,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,23,0,TAU);ctx.stroke();ctx.setLineDash([]);for(let i=0;i<8;i++){const a=i/8*TAU;ctx.beginPath();ctx.moveTo(Math.cos(a)*21,Math.sin(a)*21);ctx.lineTo(Math.cos(a)*25,Math.sin(a)*25);ctx.stroke();}ctx.restore();},
  over(t,sp,k,e){ctx.save();hull62();ctx.clip();ctx.strokeStyle='rgba(143,233,255,.22)';ctx.lineWidth=.6;for(let x=-12;x<=20;x+=4){ctx.beginPath();ctx.moveTo(x,-13);ctx.lineTo(x,13);ctx.stroke();}for(let y=-12;y<=12;y+=4){ctx.beginPath();ctx.moveTo(-12,y);ctx.lineTo(20,y);ctx.stroke();}ctx.restore();
    const q=(t*.5)%1;ctx.fillStyle='#e8d27a';for(let i=0;i<5;i++){const u=(q+i/5)%1;ctx.globalAlpha=.9;ctx.fillRect(19-u*30-.6,-u*12-1.5,1.2,3);ctx.fillRect(19-u*30-.6,u*12-1.5,1.2,3);}
    if(k>0||e>0){ctx.globalAlpha=Math.max(k,e);ctx.setLineDash([2,2]);ctx.strokeStyle='#e8d27a';ctx.lineWidth=1;hull62(1.25);ctx.stroke();ctx.setLineDash([]);}},
  move(p,t,sp,dt){if(sp>70)emit62(dt,sp/220,()=>{const a=p.ang;mark62(p.x,p.y,.6,(m,q)=>{ctx.save();ctx.translate(m.x,m.y);ctx.rotate(a);ctx.globalAlpha=(1-q)*.45;ctx.setLineDash([2,3]);ctx.strokeStyle='#8fe9ff';ctx.lineWidth=1;hull62();ctx.stroke();ctx.setLineDash([]);ctx.restore();});});},
  dashStart(p){const a=Math.atan2(p.dy,p.dx);mark62(p.x,p.y,.6,(m,q)=>{ctx.globalAlpha=(1-q)*.85;ctx.strokeStyle='#e8d27a';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(m.x,m.y,26,a+Math.PI-1.2*Math.min(1,q*3),a+Math.PI+1.2*Math.min(1,q*3));ctx.stroke();ctx.fillStyle='#e8d27a';ctx.beginPath();ctx.arc(m.x,m.y,1.6,0,TAU);ctx.fill();});},
  dashEnd(p,f){const a=f.a,d=Math.hypot(p.x-f.x,p.y-f.y),lab=(typeof AUNIT!=='undefined'&&AUNIT>0?(d/AUNIT).toFixed(2).replace('.',',')+' а.е.':Math.round(d)+' ед.');mark62(f.x,f.y,1.4,(m,q)=>{const nx=-Math.sin(a)*22,ny=Math.cos(a)*22;ctx.globalAlpha=(1-q)*.85;ctx.strokeStyle='#e8d27a';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(m.x,m.y);ctx.lineTo(m.x+nx*1.2,m.y+ny*1.2);ctx.moveTo(m.x2,m.y2);ctx.lineTo(m.x2+nx*1.2,m.y2+ny*1.2);ctx.moveTo(m.x+nx,m.y+ny);ctx.lineTo(m.x2+nx,m.y2+ny);ctx.stroke();
      for(const [x,y,s] of [[m.x+nx,m.y+ny,1],[m.x2+nx,m.y2+ny,-1]]){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a+s*.4)*6*s,y+Math.sin(a+s*.4)*6*s);ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a-s*.4)*6*s,y+Math.sin(a-s*.4)*6*s);ctx.stroke();}
      ctx.fillStyle='#e8d27a';ctx.font='700 8px "JetBrains Mono",monospace';ctx.textAlign='center';ctx.fillText(lab,(m.x+m.x2)/2+nx*1.5,(m.y+m.y2)/2+ny*1.5+3);
      for(const u of [.33,.66]){const [x,y]=path62(m,u);ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=(1-q)*.5;ctx.strokeStyle='#8fe9ff';ctx.lineWidth=.8;hull62();ctx.stroke();ctx.beginPath();ctx.moveTo(19,0);ctx.lineTo(-5,0);ctx.stroke();ctx.restore();}},{x2:p.x,y2:p.y});},
  pulse(p,R){mark62(p.x,p.y,.9,(m,q)=>{ctx.setLineDash([4,4]);for(let j=0;j<3;j++){const r=R*q*(.5+j*.25);ring62(m.x,m.y,r,'#e8d27a',(1-q)*.7,1);}ctx.setLineDash([]);ctx.beginPath();for(let i=0;i<36;i++){const a=i/36*TAU,r=R*q;ctx.moveTo(m.x+Math.cos(a)*r,m.y+Math.sin(a)*r);ctx.lineTo(m.x+Math.cos(a)*(r-(i%3?3:7)),m.y+Math.sin(a)*(r-(i%3?3:7)));}ctx.stroke();});}},

silence85:{c:'#3a4258',
  under(t,sp,k,e){const g=ctx.createRadialGradient(0,0,4,0,0,34);g.addColorStop(0,'rgba(0,0,0,.55)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,34,0,TAU);ctx.fill();
    /* звёздный свет огибает корпус: три дуги линзы */ctx.strokeStyle='#9fb0c4';ctx.lineWidth=.8;for(let i=0;i<3;i++){const a=t*.5+i*TAU/3;ctx.globalAlpha=.18+.1*Math.sin(t*1.7+i);ctx.beginPath();ctx.arc(0,0,27+1.5*Math.sin(t+i),a,a+1.1);ctx.stroke();}},
  alpha(k){return 1-.7*k;},
  over(t,sp,k,e){ctx.globalAlpha=.3+.25*Math.sin(t*2.3)+.4*k;ctx.strokeStyle='#9fb0c4';ctx.lineWidth=1;hull62();ctx.stroke();
    const u=(t*.6)%1,pts=[[19,0],[-11,-12],[-5,0],[-11,12],[19,0]],seg=u*4,i=Math.floor(seg),f=seg-i,a=pts[i],b=pts[i+1];ctx.globalAlpha=.9;ctx.fillStyle='#cfe0ff';ctx.beginPath();ctx.arc(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,1.1,0,TAU);ctx.fill();},
  move(p,t,sp,dt){if(sp>60)emit62(dt,sp/120,()=>{const x=p.x-Math.cos(p.ang)*10,y=p.y-Math.sin(p.ang)*10;mark62(x,y,.9,(m,q)=>{const g=ctx.createRadialGradient(m.x,m.y,0,m.x,m.y,16);g.addColorStop(0,`rgba(0,0,0,${(.45*(1-q)).toFixed(3)})`);g.addColorStop(1,'rgba(0,0,0,0)');ctx.globalAlpha=1;ctx.fillStyle=g;ctx.beginPath();ctx.arc(m.x,m.y,16,0,TAU);ctx.fill();});});},
  dashStart(p){mark62(p.x,p.y,.4,(m,q)=>{ring62(m.x,m.y,30*(1-q),'#9fb0c4',(1-q)*.8,1.2);ctx.globalAlpha=(1-q)*.6;ctx.fillStyle='#000';ctx.beginPath();ctx.arc(m.x,m.y,22*(1-q),0,TAU);ctx.fill();});},
  dashEnd(p,f){mark62(f.x,f.y,.9,(m,q)=>{ctx.globalAlpha=(1-q)*.35;ctx.strokeStyle='#9fb0c4';ctx.lineWidth=1;ctx.setLineDash([1,6]);ctx.beginPath();ctx.moveTo(m.x,m.y);ctx.lineTo(m.x2,m.y2);ctx.stroke();ctx.setLineDash([]);},{x2:p.x,y2:p.y});
    mark62(p.x,p.y,.55,(m,q)=>{const r=34*(1-q);ctx.globalAlpha=(1-q)*.55;ctx.fillStyle='#000';ctx.beginPath();ctx.arc(m.x,m.y,r,0,TAU);ctx.fill();ring62(m.x,m.y,r,'#cfe0ff',(1-q)*.9,1.4);});},
  pulse(p,R){mark62(p.x,p.y,.8,(m,q)=>{ctx.globalAlpha=(1-q)*.5;ctx.strokeStyle='#000';ctx.lineWidth=10;ctx.beginPath();ctx.arc(m.x,m.y,R*q,0,TAU);ctx.stroke();ring62(m.x,m.y,R*q+5,'#9fb0c4',(1-q)*.85,1.2);});}},

callsign013:{c:'#6b8cff',
  under(t,sp,k,e){const on=morse62(t);glow(0,0,24,'#6b8cff',on?.45:.12);},
  over(t,sp,k,e){const on=morse62(t);ctx.fillStyle=on?'#cfe0ff':'rgba(107,140,255,.35)';for(const [x,y] of [[-9,-9],[-9,9],[6,0]]){ctx.beginPath();ctx.arc(x,y,on?2.4:1.6,0,TAU);ctx.fill();if(on)glow(x,y,7,'#9fb8ff',.8);}
    if(on){for(let i=0;i<2;i++){const q=((t*2.2+i*.5)%1);ctx.globalAlpha=(1-q)*.8;ctx.strokeStyle='#cfe0ff';ctx.lineWidth=1;ctx.beginPath();ctx.arc(19,0,3+q*9,-.7,.7);ctx.stroke();}}
    if(k>0){for(let i=0;i<3;i++){ctx.globalAlpha=k*(1-i*.25);ctx.strokeStyle='#cfe0ff';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(19,0,8+i*7+(1-k)*10,-.6,.6);ctx.stroke();}}},
  move(p,t,sp,dt){const on=morse62(t);const st=SK62.st.cs||(SK62.st.cs={last:0});if(sp>40&&on&&!st.last&&fx62()){const x=p.x-Math.cos(p.ang)*14,y=p.y-Math.sin(p.ang)*14;mark62(x,y,1.1,(m,q)=>{ctx.globalAlpha=(1-q)*.85;ctx.fillStyle='#9fb8ff';ctx.beginPath();ctx.arc(m.x,m.y,2.2,0,TAU);ctx.fill();ring62(m.x,m.y,2+q*10,'#6b8cff',(1-q)*.5,1);});}st.last=on;},
  dashStart(p){const a=Math.atan2(p.dy,p.dx);mark62(p.x,p.y,.5,(m,q)=>{for(let i=0;i<3;i++){const r=14+i*10+q*30;ctx.globalAlpha=(1-q)*(1-i*.25);ctx.strokeStyle='#cfe0ff';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(m.x,m.y,r,a-.5,a+.5);ctx.stroke();}});},
  dashEnd(p,f){mark62(f.x,f.y,1.3,(m,q)=>{const code=[1,1,1,0,3,3,3,0,1,1,1];const n=code.length;ctx.lineCap='round';for(let i=0;i<n;i++){if(!code[i])continue;const u0=i/n,u1=u0+(code[i]===3?.07:.02),[x0,y0]=path62(m,u0),[x1,y1]=path62(m,Math.min(1,u1)),al=Math.max(0,Math.min(1,(q*3-u0))*(1-q));
      ctx.globalAlpha=Math.min(1,al*1.5);ctx.strokeStyle='#cfe0ff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1+.01,y1);ctx.stroke();}ctx.lineCap='butt';},{x2:p.x,y2:p.y});
    mark62(p.x,p.y,.8,(m,q)=>{for(let i=0;i<3;i++){const qq=q-i*.12;if(qq>0)ring62(m.x,m.y,6+qq*32,'#9fb8ff',(1-q)*.8,1.4);}});},
  pulse(p,R){mark62(p.x,p.y,1,(m,q)=>{const d=[0,.06,.12,.28,.4,.52];for(let i=0;i<6;i++){const qq=q-d[i];if(qq<=0)continue;ring62(m.x,m.y,R*Math.min(1,qq*1.3),i<3?'#cfe0ff':'#6b8cff',(1-q)*.8,i<3?1.2:3);}});}},

carrier85:{c:'#ffffff',
  under(t,sp,k,e){glow(0,0,24,'#ffffff',.14+.08*Math.sin(t*1.2));},
  over(t,sp,k,e){ctx.strokeStyle='rgba(107,140,255,.6)';ctx.lineWidth=.8;for(const s of [-1,1]){ctx.beginPath();for(let i=0;i<=14;i++){const u=i/14,x=19-u*30,y=s*u*12+Math.sin(u*14-t*9)*1.2;ctx.lineTo(x,y);}ctx.stroke();}
    for(let i=0;i<5;i++){const h=2+3*Math.abs(Math.sin(t*7+i*1.3));ctx.fillStyle=i===2?'#ffffff':'#9fb8ff';ctx.globalAlpha=.85;ctx.fillRect(-16-i*0,(-2+i)*2.2-1,-h,1.6);}
    if(k>0){ctx.globalAlpha=k;ctx.strokeStyle='#ffffff';ctx.lineWidth=1.6;ctx.beginPath();for(let i=0;i<=30;i++){const x=-10-i*1.6;ctx.lineTo(x,Math.sin(i*.9-t*20)*8*k*(1-i/34));}ctx.stroke();}},
  move(p,t,sp,dt){},
  trail:true,
  dashStart(p){const a=Math.atan2(p.dy,p.dx);mark62(p.x,p.y,.4,(m,q)=>{for(let i=0;i<3;i++){ctx.globalAlpha=(1-q)*(1-i*.3);ctx.strokeStyle='#ffffff';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(m.x,m.y,8+i*6+q*14,a+Math.PI-.8,a+Math.PI+.8);ctx.stroke();}});},
  dashEnd(p,f){mark62(f.x,f.y,1.1,(m,q)=>{const a=Math.atan2(m.y2-m.y,m.x2-m.x),nx=-Math.sin(a),ny=Math.cos(a);ctx.lineWidth=1.8;ctx.strokeStyle='#ffffff';ctx.beginPath();const N=40;for(let i=0;i<=N;i++){const u=i/N;if(u<q*1.1-.1)continue;const [x,y]=path62(m,u),A=10*(1-q)*Math.sin(u*Math.PI),w=Math.sin(u*28-q*14)*A;ctx.lineTo(x+nx*w,y+ny*w);}ctx.globalAlpha=(1-q)*.9;ctx.stroke();},{x2:p.x,y2:p.y});},
  pulse(p,R){mark62(p.x,p.y,.9,(m,q)=>{ctx.globalAlpha=(1-q)*.85;ctx.strokeStyle='#ffffff';ctx.lineWidth=1.6;ctx.beginPath();for(let i=0;i<=72;i++){const a=i/72*TAU,r=R*q+6*(1-q)*Math.sin(a*12+q*20);ctx.lineTo(m.x+Math.cos(a)*r,m.y+Math.sin(a)*r);}ctx.closePath();ctx.stroke();ring62(m.x,m.y,R*q*.8,'#6b8cff',(1-q)*.5,1);});}},

ark90:{c:'#ffd36b',
  under(t,sp,k,e){const b=beat62(t);glow(0,0,20+8*b,'#d8364a',.25+.35*b);},
  over(t,sp,k,e){const b=beat62(t);ctx.strokeStyle='#d8364a';ctx.lineWidth=1;ctx.globalAlpha=.35+.6*b;ctx.beginPath();ctx.moveTo(2,0);ctx.lineTo(-9,-9);ctx.moveTo(2,0);ctx.lineTo(-9,9);ctx.moveTo(2,0);ctx.lineTo(16,0);ctx.moveTo(-2,0);ctx.lineTo(-6,0);ctx.stroke();
    ctx.globalAlpha=1;for(let i=0;i<6;i++){const x=-7+(i%3)*5,y=i<3?-4:4,on=Math.sin(t*.8+i*2.1)>-.3;ctx.fillStyle=on?'#ffe9b0':'#5a2a1a';ctx.fillRect(x-.7,y-.7,1.4,1.4);}
    if(k>0){ctx.globalAlpha=k;glow(2,0,18,'#ffd36b',k);}},
  move(p,t,sp,dt){if(sp>50)emit62(dt,sp/130,()=>part(p.x-Math.cos(p.ang)*12+vr62r(-4,4),p.y-Math.sin(p.ang)*12+vr62r(-4,4),vr62r(-20,20),vr62r(-20,20),.8,vr62()<.6?'#d8364a':'#ffd36b',vr62r(1.6,2.6)));},
  dashStart(p){mark62(p.x,p.y,.45,(m,q)=>{ring62(m.x,m.y,8+q*28,'#d8364a',(1-q)*.9,3*(1-q)+.5);});},
  dashEnd(p,f){mark62(f.x,f.y,1.3,(m,q)=>{const a=Math.atan2(m.y2-m.y,m.x2-m.x),nx=-Math.sin(a),ny=Math.cos(a);ctx.globalAlpha=(1-q)*.95;ctx.strokeStyle='#ffd36b';ctx.lineWidth=1.6;ctx.lineJoin='round';ctx.beginPath();
      const ecg=u=>{const z=(u*2)%1;return z<.38?0:z<.42?-3:z<.46?14:z<.5?-9:z<.54?2:z<.7?Math.sin((z-.54)/.16*Math.PI)*3:0;};const N=50;for(let i=0;i<=N;i++){const u=i/N;if(u>Math.min(1,q*4))break;const [x,y]=path62(m,u),w=ecg(u);ctx.lineTo(x+nx*w,y+ny*w);}ctx.stroke();},{x2:p.x,y2:p.y});
    mark62(p.x,p.y,.8,(m,q)=>{ring62(m.x,m.y,6+q*30,'#d8364a',(1-q)*.8,2);const q2=q-.3;if(q2>0)ring62(m.x,m.y,6+q2*30,'#ffd36b',(1-q)*.8,1.6);});},
  pulse(p,R){mark62(p.x,p.y,1,(m,q)=>{ring62(m.x,m.y,R*Math.min(1,q*1.4),'#d8364a',(1-q)*.85,4*(1-q)+1);const q2=q-.22;if(q2>0)ring62(m.x,m.y,R*Math.min(1,q2*1.4),'#ffd36b',(1-q)*.85,3*(1-q)+1);});}},

dawn90:{c:'#ffe9b0',
  under(t,sp,k,e){glow(0,0,24,'#ffd36b',.22+.1*Math.sin(t));const gl=Math.max(0,Math.sin(t*1.3))**8;if(gl>.05){ctx.globalAlpha=gl;ctx.strokeStyle='#fff6d8';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(19-7,0);ctx.lineTo(19+7,0);ctx.moveTo(19,-7);ctx.lineTo(19,7);ctx.stroke();}},
  over(t,sp,k,e){ctx.save();hull62();ctx.clip();const x=-14+((t*.25)%1)*40;const g=ctx.createLinearGradient(x-14,0,x+14,0);g.addColorStop(0,'rgba(255,211,107,0)');g.addColorStop(.5,'rgba(255,233,176,.55)');g.addColorStop(1,'rgba(255,211,107,0)');ctx.fillStyle=g;ctx.fillRect(-12,-13,32,26);ctx.restore();
    const n=Math.floor(t*1.5)%6;for(let i=0;i<4;i++){const on=i<n||n>4;ctx.globalAlpha=on?1:.3;ctx.fillStyle='#fff6d8';ctx.fillRect(-6+i*5,-1.5,2.5,3);if(on&&fx62())glow(-5+i*5,0,4,'#ffe9b0',.6);}
    if(k>0){ctx.globalAlpha=k;const g2=ctx.createLinearGradient(-60,0,24,0);g2.addColorStop(0,'rgba(255,211,107,0)');g2.addColorStop(1,'rgba(255,246,216,.95)');ctx.fillStyle=g2;ctx.fillRect(-60,-1.5,84,3);glow(19,0,14,'#fff6d8',k);}},
  move(p,t,sp,dt){if(sp>50)emit62(dt,sp/150,()=>part(p.x-Math.cos(p.ang)*12+vr62r(-6,6),p.y-Math.sin(p.ang)*12+vr62r(-6,6),vr62r(-14,14),vr62r(-24,-4),1.1,'#ffe9b0',vr62r(1.2,2.2)));},
  dashStart(p){mark62(p.x,p.y,.35,(m,q)=>{glow(m.x,m.y,30,'#fff6d8',(1-q)*.9);});},
  dashEnd(p,f){mark62(f.x,f.y,1,(m,q)=>{const g=ctx.createLinearGradient(m.x,m.y,m.x2,m.y2);g.addColorStop(0,'rgba(255,211,107,0)');g.addColorStop(1,`rgba(255,246,216,${(.85*(1-q)).toFixed(3)})`);ctx.globalAlpha=1;ctx.strokeStyle=g;ctx.lineWidth=5*(1-q)+1;ctx.beginPath();ctx.moveTo(m.x,m.y);ctx.lineTo(m.x2,m.y2);ctx.stroke();},{x2:p.x,y2:p.y});
    const a=f.a;mark62(p.x,p.y,.8,(m,q)=>{ctx.globalAlpha=(1-q)*.8;ctx.strokeStyle='#ffe9b0';ctx.lineWidth=1.4;ctx.beginPath();for(let i=-3;i<=3;i++){const b=a+i*.28;ctx.moveTo(m.x+Math.cos(b)*10,m.y+Math.sin(b)*10);ctx.lineTo(m.x+Math.cos(b)*(24+q*30),m.y+Math.sin(b)*(24+q*30));}ctx.stroke();});},
  pulse(p,R){mark62(p.x,p.y,.9,(m,q)=>{ctx.globalAlpha=(1-q)*.85;ctx.strokeStyle='#ffe9b0';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<12;i++){const a=i/12*TAU+q*.4,r0=R*q*.5,r1=R*q*(i%2?.8:1.05);ctx.moveTo(m.x+Math.cos(a)*r0,m.y+Math.sin(a)*r0);ctx.lineTo(m.x+Math.cos(a)*r1,m.y+Math.sin(a)*r1);}ctx.stroke();glow(m.x,m.y,30*(1-q),'#fff6d8',(1-q)*.7);});}},

typo100:{c:'#b8ffe0',
  under(t,sp,k,e){glow(0,0,20,'#7affc9',.18);},
  over(t,sp,k,e){ctx.strokeStyle='#ffffff';ctx.lineWidth=.8;ctx.setLineDash([1.2,1.2]);ctx.globalAlpha=.7;ctx.beginPath();ctx.moveTo(8,-6);ctx.lineTo(8,6);ctx.moveTo(-3,-9);ctx.lineTo(-3,9);ctx.stroke();ctx.setLineDash([]);
    const j=i=>Math.sin(t*(13+i*5))>.93?(i%2?1.5:-1.5):0;ctx.save();ctx.translate(j(0),0);ctx.globalAlpha=.55;ctx.strokeStyle='#7affc9';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(19,0);ctx.lineTo(8,-4);ctx.moveTo(19,0);ctx.lineTo(8,4);ctx.stroke();ctx.restore();
    ctx.save();ctx.translate(0,j(1));ctx.globalAlpha=.55;ctx.strokeStyle='#e0fff4';ctx.beginPath();ctx.moveTo(-3,-9);ctx.lineTo(-11,-12);ctx.moveTo(-3,9);ctx.lineTo(-11,12);ctx.stroke();ctx.restore();
    if(Math.sin(t*7.3)>.85){ctx.globalAlpha=.9;ctx.fillStyle=Math.sin(t*31)>0?'#7affc9':'#ffffff';for(let i=0;i<3;i++)ctx.fillRect(-8+((t*97+i*13)%24),((t*61+i*7)%20)-10,2,2);}
    if(k>0){const d=6*k;for(const [c,dy] of [['#7affc9',-d],['#ffffff',0],['#6bf0ff',d]]){ctx.save();ctx.translate(-d*.6,dy);ctx.globalAlpha=k*.7;ctx.strokeStyle=c;ctx.lineWidth=1.2;hull62();ctx.stroke();ctx.restore();}}},
  move(p,t,sp,dt){if(sp>60)emit62(dt,sp/120,()=>{const x=p.x-Math.cos(p.ang)*12+vr62r(-8,8),y=p.y-Math.sin(p.ang)*12+vr62r(-8,8),c=vr62()<.5?'#7affc9':'#ffffff',s=vr62r(1.5,3);mark62(x,y,.5,(m,q)=>{if(Math.sin(q*40)>0)return;ctx.globalAlpha=(1-q);ctx.fillStyle=c;ctx.fillRect(m.x+(q>.5?2:0),m.y,s,s);});});},
  dashStart(p){const a=Math.atan2(p.dy,p.dx);mark62(p.x,p.y,.35,(m,q)=>{ctx.save();ctx.translate(m.x,m.y);ctx.rotate(a);ctx.globalAlpha=(1-q)*.8;for(let i=-3;i<=3;i++){ctx.fillStyle=i%2?'#7affc9':'#ffffff';ctx.fillRect(-14+(i*7%5)*q*6,i*4,22,1.5);}ctx.restore();});},
  dashEnd(p,f){const a=f.a,offs=[[-10,-8,'#7affc9'],[-6,0,'#ffffff'],[-10,8,'#6bf0ff']];mark62(p.x,p.y,.45,(m,q)=>{const s=1-Math.min(1,q*2.2);for(const [ox,oy,c] of offs){ctx.save();ctx.translate(m.x,m.y);ctx.rotate(a);ctx.translate(ox*s,oy*s);ctx.globalAlpha=(1-q)*.8;ctx.strokeStyle=c;ctx.lineWidth=1.3;hull62();ctx.stroke();ctx.restore();}if(q>.45&&q<.6)ring62(m.x,m.y,16,'#ffffff',.9,1);});
    mark62(f.x,f.y,.7,(m,q)=>{for(let i=0;i<6;i++){const [x,y]=path62(m,i/6);if((i+Math.floor(q*10))%2)continue;ctx.globalAlpha=(1-q)*.7;ctx.fillStyle=i%2?'#7affc9':'#ffffff';ctx.fillRect(x-3,y-1,6,2);}},{x2:p.x,y2:p.y});},
  pulse(p,R){const jit=[...Array(16)].map(()=>vr62r(-8,8));mark62(p.x,p.y,.8,(m,q)=>{ctx.globalAlpha=(1-q)*.85;ctx.strokeStyle='#7affc9';ctx.lineWidth=2;const r=R*q;ctx.beginPath();for(let i=0;i<16;i++){const s=i%4,u=(i%4)/4,side=Math.floor(i/4);const pts=[[-r,-r],[r,-r],[r,r],[-r,r]],A=pts[side],B=pts[(side+1)%4];ctx.lineTo(A[0]+(B[0]-A[0])*u+m.x+jit[i]*(1-q),A[1]+(B[1]-A[1])*u+m.y);}ctx.closePath();ctx.stroke();});}},

tidemark100:{c:'#7affc9',
  under(t,sp,k,e){glow(0,0,22,'#7affc9',.16+.08*Math.sin(t*1.2));},
  over(t,sp,k,e){const lv=Math.sin(t*1.2)*4+(k>0?-4*k:0);ctx.save();hull62();ctx.clip();ctx.fillStyle='rgba(122,255,201,.32)';ctx.beginPath();ctx.moveTo(-14,14);for(let x=-14;x<=20;x+=2)ctx.lineTo(x,lv+Math.sin(x*.5+t*3)*1.1);ctx.lineTo(20,14);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#d8fff0';ctx.lineWidth=.9;ctx.beginPath();for(let x=-14;x<=20;x+=2)ctx.lineTo(x,lv+Math.sin(x*.5+t*3)*1.1);ctx.stroke();ctx.restore();
    const dq=(t*1.1)%1;ctx.globalAlpha=Math.sin(dq*Math.PI);ctx.fillStyle='#d8fff0';ctx.beginPath();ctx.arc(-11-dq*6,12+dq*3,1,0,TAU);ctx.fill();},
  trail:true,
  move(p,t,sp,dt){},
  dashStart(p){for(let i=0;i<10&&fx62();i++){const a=Math.atan2(p.dy,p.dx)+Math.PI+vr62r(-1.1,1.1);part(p.x,p.y,Math.cos(a)*vr62r(60,150),Math.sin(a)*vr62r(60,150),.45,i%3?'#d8fff0':'#7affc9',vr62r(1.5,2.5));}},
  dashEnd(p,f){mark62(f.x,f.y,1.2,(m,q)=>{const a=Math.atan2(m.y2-m.y,m.x2-m.x),nx=-Math.sin(a),ny=Math.cos(a);for(const s of [-1,1]){ctx.globalAlpha=(1-q)*.8;ctx.strokeStyle='#d8fff0';ctx.lineWidth=1.6;ctx.beginPath();const N=16;for(let i=0;i<=N;i++){const u=i/N,[x,y]=path62(m,u),w=s*(2+(1-u)*(18+q*16))+Math.sin(u*12+q*8)*1.5;ctx.lineTo(x+nx*w,y+ny*w);}ctx.stroke();
      ctx.fillStyle='#ffffff';for(let i=0;i<6;i++){const u=i/6,[x,y]=path62(m,u),w=s*(2+(1-u)*(18+q*16));ctx.globalAlpha=(1-q)*.7;ctx.fillRect(x+nx*w-1,y+ny*w-1,2,2);}}},{x2:p.x,y2:p.y});
    mark62(p.x,p.y,.6,(m,q)=>{for(let i=0;i<7;i++){const a=i/7*TAU,r=6+q*22;ctx.globalAlpha=(1-q);ctx.fillStyle='#d8fff0';ctx.beginPath();ctx.arc(m.x+Math.cos(a)*r,m.y+Math.sin(a)*r-q*q*10,1.6,0,TAU);ctx.fill();}});},
  pulse(p,R){mark62(p.x,p.y,1,(m,q)=>{ctx.globalAlpha=(1-q)*.8;ctx.strokeStyle='#7affc9';ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<=64;i++){const a=i/64*TAU,r=R*q+4*Math.sin(a*6-q*12);ctx.lineTo(m.x+Math.cos(a)*r,m.y+Math.sin(a)*r);}ctx.closePath();ctx.stroke();ring62(m.x,m.y,R*q-6,'#d8fff0',(1-q)*.6,1);});}},

shore100s:{c:'#f4fff9',
  under(t,sp,k,e){glow(0,0,22,'#ffffff',.14);for(let i=0;i<8;i++){const a=t*.35+i*.785,r=20+3*Math.sin(t+i);ctx.globalAlpha=.55;ctx.fillStyle='#f4fff9';ctx.fillRect(Math.cos(a)*r-.6,Math.sin(a)*r*.8-.6,1.2,1.2);}},
  alpha(k){return 1-.75*k;},
  over(t,sp,k,e){ctx.save();ctx.strokeStyle='#070c16';ctx.lineWidth=2.6;ctx.setLineDash([3,9]);ctx.lineDashOffset=-t*12;ctx.globalAlpha=.85;hull62();ctx.stroke();ctx.restore();
    const s=k>0?k:e*.6;if(s>0){ctx.fillStyle='#ffffff';for(let i=0;i<22;i++){const a=i*2.4,r=(i%7)*2.4,x=Math.cos(a)*r*1.3+2,y=Math.sin(a)*r*.9;ctx.globalAlpha=s;ctx.fillRect(x-s*(8+i%5)*1.4-.7,y+Math.sin(i)*s*6-.7,1.4,1.4);}}},
  move(p,t,sp,dt){if(sp>50)emit62(dt,sp/140,()=>part(p.x-Math.cos(p.ang)*12+vr62r(-5,5),p.y-Math.sin(p.ang)*12+vr62r(-5,5),vr62r(-8,8),vr62r(-8,8),1.3,'#f4fff9',vr62r(1,1.8)));},
  dashStart(p){mark62(p.x,p.y,.5,(m,q)=>{ctx.globalAlpha=(1-q)*.6;ctx.fillStyle='#f4fff9';for(let i=0;i<16;i++){const a=i/16*TAU;ctx.fillRect(m.x+Math.cos(a)*(6+q*20)-1,m.y+Math.sin(a)*(6+q*20)-1,2,2);}});},
  dashEnd(p,f){const a=f.a;mark62(f.x,f.y,1.5,(m,q)=>{const L=Math.hypot(m.x2-m.x,m.y2-m.y),n=Math.max(2,Math.floor(L/16));for(let i=0;i<n;i++){const u=(i+.5)/n,[x,y]=path62(m,u),s=i%2?1:-1;ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=(1-q)*.55;ctx.fillStyle='#f4fff9';ctx.beginPath();ctx.ellipse(0,s*5,3,1.7,0,0,TAU);ctx.fill();ctx.restore();}},{x2:p.x,y2:p.y});},
  pulse(p,R){mark62(p.x,p.y,.9,(m,q)=>{ctx.globalAlpha=(1-q)*.7;ctx.strokeStyle='#ffffff';ctx.lineWidth=9*(1-q)+1;ctx.beginPath();ctx.arc(m.x,m.y,R*q,0,TAU);ctx.stroke();ctx.globalAlpha=(1-q)*.35;ctx.strokeStyle='#04060c';ctx.lineWidth=2;ctx.beginPath();ctx.arc(m.x,m.y,R*q-6,0,TAU);ctx.stroke();});}}
};
/* общая заглушка «dash» (полёт) — у всех есть: свечение по ходу рывка в цвете корпуса */
for(const id of SK62_LATE){const F=SKFX[id];if(!F.dash)F.dash=function(p,t,k){glow(p.x,p.y,22+10*k,SKINS[id].trail,.35*k);};if(!F.move)F.move=function(){};}

/* ---------- след движения у «Несущей» и «Линии прилива»: история позиций ---------- */
function trail62(id,p,t,sp){const B=SK62.buf;if(!B.length||Math.hypot(B[B.length-1].x-p.x,B[B.length-1].y-p.y)>4)B.push({x:p.x,y:p.y,t});while(B.length&&(t-B[0].t>.7||B.length>60))B.shift();if(B.length<3||sp<20)return;
  if(id==='carrier85'){ctx.strokeStyle='#ffffff';ctx.lineWidth=1.2;ctx.beginPath();for(let i=1;i<B.length;i++){const a=B[i-1],b=B[i],dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1,age=(t-b.t)/.7,w=Math.sin(i*.9-t*12)*5*(1-age);ctx.lineTo(b.x-dy/l*w,b.y+dx/l*w);}ctx.globalAlpha=.55;ctx.stroke();}
  if(id==='tidemark100'){for(const s of [-1,1]){ctx.strokeStyle='#d8fff0';ctx.lineWidth=1.2;ctx.beginPath();for(let i=1;i<B.length;i++){const a=B[i-1],b=B[i],dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1,age=(t-b.t)/.7,w=s*(6+age*22);ctx.lineTo(b.x-dy/l*w,b.y+dx/l*w);}ctx.globalAlpha=.45;ctx.stroke();}}}

/* ---------- метки ---------- */
function drawMarks62(t){const M=SK62.marks;if(!M.length)return;const A=ctx.globalAlpha;for(let i=M.length-1;i>=0;i--){const m=M[i],q=(t-m.t0)/m.life;if(q>=1||q<-.5){M.splice(i,1);continue;}ctx.save();try{m.draw(m,Math.max(0,q),t);}catch(e){M.splice(i,1);}ctx.restore();}ctx.globalAlpha=A;}
function sk62Key(){return (G.world?'w':'m'+(G.m||0))+'|'+(G.runId||'')+'|'+(G.state==='menu'?'menu':'');}

/* ---------- обёртки ---------- */
{const _ds=drawShip;drawShip=function(id,t,sp,o){const F=SKFX[id];if(!F)return _ds.apply(this,arguments);
  let k=0,e=0;if(SK62.cur){k=SK62.cur.k;e=SK62.cur.e;}else if(SK62.prev){const ph=((t%3)+3)%3;k=ph<.3?1-ph/.3:0;e=ph>=.3&&ph<.8?1-(ph-.3)/.5:0;}
  const A=ctx.globalAlpha;sp=sp||0;
  if(F.under){ctx.save();try{F.under(t,sp,k,e);}catch(err){}ctx.restore();ctx.globalAlpha=A;}
  if(F.alpha){try{ctx.globalAlpha=A*Math.max(.3,F.alpha(k,t));}catch(err){}}
  const r=_ds.apply(this,arguments);ctx.globalAlpha=A;
  if(F.over){ctx.save();try{F.over(t,sp,k,e);}catch(err){}ctx.restore();ctx.globalAlpha=A;}
  /* финиш рывка на самом корпусе: короткое «оседание» — кольцо в цвет следа сжимается к корпусу */
  if(e>0){ctx.save();try{if(F.settle)F.settle(t,e);else{ctx.globalAlpha=A*e*.6;ctx.strokeStyle=(SKINS[id]||SKINS.base).trail;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(2,0,16+12*e,0,TAU);ctx.stroke();}}catch(err){}ctx.restore();ctx.globalAlpha=A;}
  return r;};}
{const _dp=drawPlayer;drawPlayer=function(p,t){SK62.now=t;const key=sk62Key();if(key!==SK62.key){SK62.key=key;SK62.marks.length=0;SK62.buf.length=0;SK62.dashOn=false;SK62.endT=0;}
  const id=curSkin(),F=SKFX[id];if(!F||!p||p.hp<=0){SK62.lastT=t;return _dp.apply(this,arguments);}
  const dt=clamp(t-(SK62.lastT||t),0,.05);SK62.lastT=t;
  const dash=p.dashT>0,k=dash?clamp(p.dashT/.15,0,1):0;
  if(!dash&&SK62.dashOn){SK62.dashOn=false;SK62.endT=t;try{F.dashEnd&&F.dashEnd(p,SK62.from||{x:p.x,y:p.y,a:p.ang},t);}catch(err){}}
  const e=SK62.endT?clamp(1-(t-SK62.endT)/.5,0,1):0;const sp=Math.hypot(p.vx||0,p.vy||0);
  const A=ctx.globalAlpha;
  ctx.save();try{drawMarks62(t);if(F.trail)trail62(id,p,t,sp);F.move(p,t,sp,dt);if(dash)F.dash(p,t,k);}catch(err){}ctx.restore();ctx.globalAlpha=A;
  SK62.cur={k,e};try{return _dp.apply(this,arguments);}finally{SK62.cur=null;}};}
{const _td=tryDash;tryDash=function(dir){const p=G.player,before=p?p.dashCd:0;const r=_td.apply(this,arguments);
  try{if(p&&p.dashT>=.149&&p.dashCd>0&&p.dashCd!==before){const F=SKFX[curSkin()];if(F){SK62.dashOn=true;SK62.from={x:p.x,y:p.y,a:Math.atan2(p.dy||0,p.dx||1)};if(F.dashStart)F.dashStart(p);}}}catch(e){}return r;};}
{const _tp=tryPulse;tryPulse=function(){const p=G.player,en=p?p.en:0;const r=_tp.apply(this,arguments);
  try{if(p&&en>=100&&p.en<100){const F=SKFX[curSkin()];if(F&&F.pulse)F.pulse(p,(G.st&&G.st.pR)||150);}}catch(e){}return r;};}
{const _hp=drawHangarPreviews;drawHangarPreviews=function(){SK62.prev=true;try{return _hp.apply(this,arguments);}finally{SK62.prev=false;}};}

