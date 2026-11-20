/* ▼▼▼ ARCH·77 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.17 α · диагностика кадров, только режим разработчика)
   Включается переключателем «Диагностика кадров» в меню разработчика (меню открывается через ?dev или 5 нажатий на логотип).
   Без переключателя diag77 не вызывается и ничего не меняет. Только читает состояние и рисует поверх кадра: частоту rAF и разброс
   интервалов, шаги за кадр (0/1/2/3), 0- и 2-шаговые кадры и пропуски vsync за минуту, состояние A-23 и её переключения,
   источник текущей цели и расстояние, неровность видимой скорости корабля и камеры. Кольцевой буфер последних 60 с живых кадров
   (метка rAF, dt, шаги, накопитель, A-23, видимые x/y корабля, камера). Экспорт последних 30 с в JSON: F8 на компьютере
   или выключение переключателя (скачивание файла и window.__diag77last). */
const D77C=['now','dt0','n','acc','ip','px','py','cx','cy'];
const D77={on:false,buf:null,cap:14400,i:0,n:0,tog:0,act:null,chk:0,okDev:false,last:0,t0:0,px:NaN,py:NaN,cx:0,cy:0,
  sec:[],cur:null,dts:new Float64Array(240),di:0,dn:0,med:0,vs:new Float64Array(240),vc:new Float64Array(240),vi:0,vn:0,txt:[],txtAt:0,lines:null,wrapAt:-1,wrapW:0};
function diag77Dev(now){if(now-D77.chk>1000||now<D77.chk){D77.chk=now;try{D77.okDev=devUnlocked();}catch(e){D77.okDev=false;}}return D77.okDev;}
function diag77(now,dt0,n){
  const want=!!(G.dev&&G.dev.diag77)&&diag77Dev(now);
  if(!want){if(D77.on){D77.on=false;diag77Export('выкл');}return;}
  if(!D77.on){D77.on=true;D77.buf=new Float64Array(D77.cap*D77C.length);D77.i=0;D77.n=0;D77.tog=0;D77.act=null;D77.sec=[];D77.cur=null;D77.dn=0;D77.vn=0;D77.px=NaN;D77.t0=now;D77.last=now;D77.txtAt=0;}
  const L=live74(),p=G.player,I=typeof IP76!=='undefined'?IP76:null,old=!!(ARCH.off['A-20']||ARCH.off['A-19']);
  if(I){if(D77.act!==null&&D77.act!==I.act)D77.tog++;D77.act=I.act;}
  const fd=now-D77.last;D77.last=now;
  if(L){const C=D77C.length,k=D77.i*C,B=D77.buf;B[k]=now;B[k+1]=dt0;B[k+2]=n;B[k+3]=old?NaN:ACC74;B[k+4]=(ARCH.vi?1:0)+(I&&I.act?2:0)+(old?4:0);
    B[k+5]=p?p.x:NaN;B[k+6]=p?p.y:NaN;B[k+7]=CX;B[k+8]=CY;D77.i=(D77.i+1)%D77.cap;D77.n=Math.min(D77.n+1,D77.cap);
    if(fd>0&&fd<100){D77.dts[D77.di]=fd;D77.di=(D77.di+1)%240;D77.dn=Math.min(D77.dn+1,240);}
    let S=D77.cur;if(!S||now-S.t>=1000){S=D77.cur={t:now,f:0,z:0,a:0,b:0,c:0,m:0};D77.sec.push(S);while(D77.sec.length&&now-D77.sec[0].t>60000)D77.sec.shift();}
    S.f++;if(n===0)S.z++;else if(n===1)S.a++;else if(n===2)S.b++;else if(n===3)S.c++;if(D77.med>0&&fd>D77.med*1.5&&fd<100)S.m++;
    if(p&&fd>0&&fd<100&&D77.px===D77.px){D77.vs[D77.vi]=Math.hypot(p.x-D77.px,p.y-D77.py)*1000/fd;D77.vc[D77.vi]=Math.hypot(CX-D77.cx,CY-D77.cy)*1000/fd;D77.vi=(D77.vi+1)%240;D77.vn=Math.min(D77.vn+1,240);}
    else D77.vn=0;
    D77.px=p?p.x:NaN;D77.py=p?p.y:NaN;D77.cx=CX;D77.cy=CY;}
  else{D77.px=NaN;D77.vn=0;}
  if(now-D77.txtAt>250||now<D77.txtAt){D77.txtAt=now;diag77Text(now,old,I);}
  diag77Draw();}
function diag77Cv(a,N,i0){/* неровность: среднее |v(i)−v(i−1)| / средняя v по последним кадрам при движении быстрее 60 px/с; плавный разгон её почти не меняет */
  let s=0,d=0,k=0;for(let j=1;j<N;j++){const v=a[(i0-N+j+480)%240],u=a[(i0-N+j-1+480)%240];if(v>60||u>60){s+=v;d+=Math.abs(v-u);k++;}}return k<20?null:d/Math.max(1e-9,s);}
function diag77Text(now,old,I){
  const d=Array.from(D77.dts.subarray(0,D77.dn)).sort((a,b)=>a-b),med=d.length?d[d.length>>1]:0;D77.med=med;
  let f=0,z=0,a=0,b=0,c=0,m=0;for(const S of D77.sec){f+=S.f;z+=S.z;a+=S.a;b+=S.b;c+=S.c;m+=S.m;}
  const span=D77.sec.length?Math.max(1,(now-D77.sec[0].t)/60000):0,pm=v=>span?(v/span).toFixed(0):'—',pc=v=>f?Math.round(100*v/f)+'%':'—';
  const p=G.player,tg=G.tg90,man=typeof aimManual==='function'&&aimManual();
  let src='нет цели',dist='';if(man)src='ручной прицел';else if(tg){src=tg===G.prio?'отмеченная (касание/клик)':(G.sb&&G.sb.alive&&G.sb.st==='fight'?'авто · босс':'авто · ближайшая');if(p)dist=' · '+Math.round(Math.hypot(tg.x-p.x,tg.y-p.y))+' px';}
  const pr=G.prio&&p?' · отмечена цель на '+Math.round(Math.hypot(G.prio.x-p.x,G.prio.y-p.y))+' px':'';
  const cs=diag77Cv(D77.vs,D77.vn,D77.vi),cc=diag77Cv(D77.vc,D77.vn,D77.vi),q=v=>v===null?'—':Math.round(v*100)+'%';
  const F=ARCH.d78&&ARCH.d78.fail?' · АВАРИЯ A-23: '+ARCH.d78.where:'';
  D77.txt=['ДИАГНОСТИКА · ARCH·77 · '+(old?'старый цикл':'цикл A-20')+' · '+(med>0?(1000/med).toFixed(1)+' Гц':'—')+' · кадр мин/мед/макс '+(d.length?d[0].toFixed(1)+'/'+med.toFixed(1)+'/'+d[d.length-1].toFixed(1):'—')+' мс',
    (old?'шаги за кадр: — (старый цикл)':'шаги за кадр  0:'+pc(z)+'  1:'+pc(a)+'  2:'+pc(b)+'  3:'+pc(c)+' · в минуту: 0-шаговых '+pm(z)+', 2-шаговых '+pm(b))+', пропусков vsync '+pm(m),
    'A-23 '+(ARCH.vi?'включена':'выключена')+(I?' · '+(I.act?'интерполирует':'спит')+' · переключений '+D77.tog+' · доля шага '+(I.al||0).toFixed(2):'')+F,
    'цель: '+src+dist+pr,
    'рывки видимой скорости от кадра к кадру: корабль '+q(cs)+' · камера '+q(cc)+' · запись '+Math.min(30,(now-D77.t0)/1000).toFixed(0)+'/30 с · экспорт: F8 или выключить'];}
function diag77Draw(){
  const w=Math.min(CW-20,660),y0=isMob()?172:86;ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.font='700 10px "JetBrains Mono",monospace';ctx.textAlign='left';ctx.textBaseline='top';
  if(D77.wrapAt!==D77.txtAt||D77.wrapW!==w){D77.wrapAt=D77.txtAt;D77.wrapW=w;const out=[];
    for(const s of D77.txt){let cur='';for(const part of s.split(' · ')){const t=cur?cur+' · '+part:part;if(cur&&ctx.measureText(t).width>w-14){out.push(cur);cur='   '+part;}else cur=t;}out.push(cur);}D77.lines=out;}
  const L=D77.lines||[];ctx.globalAlpha=.78;ctx.fillStyle='#000';ctx.fillRect(10,y0-4,w,L.length*13+36);ctx.globalAlpha=1;ctx.fillStyle='#00ff88';
  for(let i=0;i<L.length;i++)ctx.fillText(L[i],16,y0+i*13);
  const gy=y0+L.length*13+28,N=Math.min(D77.dn,(w-12)/2|0);ctx.lineWidth=1;ctx.strokeStyle='#00ff88';ctx.beginPath();
  for(let j=0;j<N;j++){const v=D77.dts[(D77.di-N+j+480)%240],h=Math.min(24,v/50*24);ctx.moveTo(16+j*2+.5,gy);ctx.lineTo(16+j*2+.5,gy-h);}ctx.stroke();
  ctx.strokeStyle='#ffb84d';ctx.beginPath();ctx.moveTo(16,gy-8);ctx.lineTo(16+w-12,gy-8);ctx.stroke();ctx.restore();}
function diag77Rows(sec,now){const R=[],C=D77C.length,B=D77.buf;for(let j=D77.n-1;j>=0;j--){const k=((D77.i-1-j+D77.cap*2)%D77.cap)*C;if(now-B[k]>sec*1000)continue;const r=[];for(let c=0;c<C;c++){const v=B[k+c];r.push(v===v?+v.toFixed(c===0?3:4):null);}R.push(r);}return R;}
function diag77Export(why){if(!D77.buf)return null;const R=diag77Rows(30,D77.n?D77.buf[((D77.i-1+D77.cap)%D77.cap)*D77C.length]:D77.last);/* окно — 30 с до последнего игрового кадра */
  const out={what:'VØID ARCH·77 диагностика кадров',ver:typeof VER_TAG!=='undefined'?VER_TAG:'',why,at:new Date().toISOString(),ua:navigator.userAgent,dpr:devicePixelRatio,
    screen:[screen.width,screen.height],off:Object.keys(ARCH.off).filter(k=>ARCH.off[k]),ipMode:typeof IP76!=='undefined'?IP76.mode:null,cols:D77C,
    note:'now — метка rAF, мс; dt0 — с; n — шагов в кадре (-1 старый цикл); acc — накопитель после шагов, с; ip: 1 — A-23 включена, 2 — интерполирует, 4 — старый цикл; px/py — видимое положение корабля, cx/cy — камера',rows:R};
  window.__diag77last=out;
  const name='void-diag77-'+out.at.replace(/[:.]/g,'-')+'.json',txt=JSON.stringify(out);
  const link=()=>{try{const b=new Blob([txt],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},4000);}catch(e){console.warn('ARCH·77 экспорт',e);}};
  /* в просмотрщике claude.ai обычная ссылка скачивания не работает — там файл отдаётся через возможность downloads */
  try{if(window.claude&&typeof window.claude.use==='function')window.claude.use('downloads').then(d=>{if(d)d.save({filename:name,data:txt}).catch(e=>console.warn('ARCH·77 экспорт',e));else link();},link);else link();}catch(e){link();}
  return out;}
addEventListener('keydown',e=>{if(e.code==='F8'&&D77.on){e.preventDefault();diag77Export('F8');}});
/* ▲▲▲ ARCH·77 · КОНЕЦ ВЫРЕЗАЕМОГО БЛОКА ▲▲▲ */
