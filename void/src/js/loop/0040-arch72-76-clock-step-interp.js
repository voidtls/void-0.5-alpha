/* ▼▼▼ ARCH·72 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.12 α · этап 4.1: часы ударной паузы)
   A-19 · hs90 отсчитывает паузу 500 мс между слабыми ударными паузами по часам игры ARCH.clk, а не по performance.now().
   ARCH.clk — секунды: в старом цикле растёт на dt0 кадра (те же часы, что у rAF), в цикле A-20 — на шаг 1/60.
   Выключение: window.__archOff=['A-19'] до загрузки. */
ARCH.clk=0;
/* ▲▲▲ ARCH·72 · КОНЕЦ ВЫРЕЗАЕМОГО БЛОКА ▲▲▲ */
/* ▼▼▼ ARCH·73 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.13 α · этап 4.2: игровой шаг 1/60)
   A-20 · главный цикл frame74: накопитель реального времени кадра, шаги ровно по 1/60 с, не больше 3 за кадр
   (тот же предел 0,05 с, что у старого цикла). Замедление slow95, ударная пауза hs90 и resumeK масштабируют dt шага (C1),
   а их таймеры, часы ARCH.clk и зум камеры camZ (видимая область VW/VH) отсчитываются по шагам. HUD, звук и отрисовка — раз в кадр,
   ветка HUD выбирается по состоянию на начало кадра, как прежде; мир не удваивается режимом speed, как прежде.
   Старый frame() остаётся целиком: window.__archOff=['A-20'] (или выключенный A-19) до загрузки — и игра идёт по нему. */
const STEP74=1/60,MAXN74=3;let ACC74=0;ARCH.sc74=1;ARCH.n74=0;ARCH.steps74=0;
function live74(){return G.state==='play'||G.state==='world';}
function camZ74(dt){const zt=camZTarget(),z=G.camZ||1;if(Math.abs(zt-z)>.001){G.camZ=z+clamp(zt-z,-.15*dt,.15*dt);setScale();}}
function mobTick74(dt,now){
  touchTick(dt);qTick(dt,now);wakeSync(now);padTick(now);tutTick();
  cv.classList.toggle('fs-cursor',!isMob()&&FS.state==='native'&&(G.state==='play'||G.state==='world')&&now-(MOUSE.mvAt||0)>2500);}
function step74(){
  ARCH.clk+=STEP74;camZ74(STEP74);let k=1;const L=live74();
  if(G.resumeK>0&&L){G.resumeK=Math.max(0,G.resumeK-STEP74);if(G.resumeK>0)k*=.3;}
  const S_=G.slow95;if(S_&&S_.t>0&&L){S_.t-=STEP74;k*=S_.k;if(S_.t<=0)G.slow95=null;}
  G.rdt90=STEP74*k;let kh=1;const H_=G.hs90;
  if(H_&&G.state==='play'){if(H_.t>0){H_.t-=STEP74;kh=.04;}else if(H_.ramp>0){const r0=H_.ramp;H_.ramp-=STEP74;kh=.3+.7*(1-r0/.4);}else G.hs90=null;}
  const dt=STEP74*k*kh,reps=devOn('speed')?2:1;G.rdtU96=reps;ARCH.sc74=k*kh;ARCH.steps74++;
  if(G.state==='play'){for(let r=0;r<reps&&G.state==='play';r++)update(dt);}
  else if(G.state==='world'){if(G.prologue)prologueTick(dt);else worldUpdate(dt);}
  if(ARCH.c66s){try{c66Tick(STEP74);}catch(e){c66Fail(e);}}/* ARCH·74 A-21 */}
function frame74(now){
  if(ARCH.fc27){if(!gate27(now)){requestAnimationFrame(frame);return;}}else if(isMob()&&SET.fps===30&&now-last<29&&now>=last){requestAnimationFrame(frame);return;}/* ARCH·90a A-27 */
  const dt0=Math.min(.05,Math.max(0,(now-last)/1000));last=now;if(ARCH.vdt)VDT74=dt0;/* ARCH·75 A-22 */
  try{mobTick74(dt0,now);}catch(err){console.error(err);}
  let n=0;const st0=G.state,pro0=G.prologue;
  try{if(!live74()){ACC74=ARCH.a25?STEP74/2:0;/* ARCH·79 A-25 */ARCH.sc74=1;camZ74(dt0);if(G.state!=='pause')G.resumeK=0;}
    else{ACC74=Math.min(ACC74+dt0,STEP74*MAXN74+1e-9);while(ACC74>=STEP74-1e-9&&n<MAXN74&&live74()){ACC74-=STEP74;n++;step74();if(ARCH.vi&&IP76.act)ip78Post();/* ARCH·76 A-23: перепись только при активной интерполяции */}}
    if(st0==='play'){if(G.mode==='endless')updateEndlessHUD();else updateHUD();}
    else if(st0==='world'){if(!pro0)updateWorldHUD();}
    else if(st0==='hangar')drawHangarPreviews(now);else if(st0==='arsenal')arsDemoTick(now);arch69Ok();}catch(err){console.error(err);arch69Fault(err);/* ARCH·69 A-4 */}
  ARCH.n74=n;const dt=live74()?dt0*ARCH.sc74:dt0;
  if(dt>0)fpsAvg+=(1/dt-fpsAvg)*.05;
  if(G.mode==='endless'&&G.state==='play'&&!G.lowFx){G.fpsLow=dt>fpsLowT27()?(G.fpsLow||0)+dt:Math.max(0,(G.fpsLow||0)-dt*.5);if(G.fpsLow>3)G.lowFx=true;}
  try{if(G.prologue&&G.state!=='world')prologueEnd();if(G.state!=='world'&&G.state!=='play'&&G.radio&&G.radio.cur)radioClear();if(G.state==='menu')menuGlitch(dt);else menuGlitchOff();}catch(err){console.error(err);}
  try{musicTick(dt);if(G.state!=='play'&&G.x90&&(G.x90.hudAll||G.x90.hud&&G.x90.hud.cur))clearHud100();}catch(err){console.error(err);}
  const ip76=ARCH.vi&&ip78Apply(dt0);/* ARCH·76 A-23 · ARCH·78 защита */
  try{if(G.world&&G.player)renderWorld(now);else{render(now);secVignette();}mobOverlay(now);drawDevOverlay();if(G.dev.diag77||D77.on)diag77(now,dt0,n);/* ARCH·77 */}catch(err){console.error(err);}
  if(ip76)ip78Restore();/* ARCH·76 A-23 · ARCH·78 защита */
  requestAnimationFrame(frame);}
/* ▲▲▲ ARCH·73 · КОНЕЦ ВЫРЕЗАЕМОГО БЛОКА ▲▲▲ */
/* ▼▼▼ ARCH·74 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.14 α · этап 4.3: часы режиссёра C66)
   A-21 · такт режиссёра C66 (миссии 1–5) в бою и в мире идёт из шага step74 по 1/60, а не из отрисовки по часам стены.
   Отложенное замедление после оглушения тарана (было setTimeout 140 мс) и метки «последнее убийство / взрыв мины / зона чиста»
   считаются по ARCH.clk. Звуковые setTimeout, заставка брифинга и карточка итога остаются на настоящем времени: игру они не меняют.
   Работает только вместе с циклом A-20 (и A-19). Выключение: window.__archOff=['A-21'] до загрузки. */
ARCH.c66s=!ARCH.off['A-21']&&!ARCH.off['A-20']&&!ARCH.off['A-19'];
function c66Clk(){return ARCH.c66s?ARCH.clk*1000:performance.now();}
/* ▲▲▲ ARCH·74 · КОНЕЦ ВЫРЕЗАЕМОГО БЛОКА ▲▲▲ */
/* ▼▼▼ ARCH·75 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.15 α · этап 4.4: визуальные таймеры)
   A-22 · 13 мест в рисовании, где вспышка, снег, дождь, подсветка удара или глитч убывали на 1/60 за каждую отрисовку
   (w58DrawTop, w58Screen ×4, sb74Draw, drawE90, lvTop95, heartUnder, zbDraw ×2, postDrawCrates, bg67Events), теперь убывают на
   настоящее время кадра VDT74. Симуляция эти поля не читает (перепись чтений в отчёте 4.4). Без A-22 VDT74 всегда ровно 1/60 —
   прежнее поведение побайтно. Работает только вместе с циклом A-20 (и A-19). Выключение: window.__archOff=['A-22'] до загрузки. */
ARCH.vdt=!ARCH.off['A-22']&&!ARCH.off['A-20']&&!ARCH.off['A-19'];let VDT74=1/60;
/* ▲▲▲ ARCH·75 · КОНЕЦ ВЫРЕЗАЕМОГО БЛОКА ▲▲▲ */
/* ▼▼▼ ARCH·76 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.16 α · этап 4.5: плавность 90/120/144 Гц)
   A-23 · после каждого шага step74 запоминаются x, y и ang всех объектов, достижимых из G (корабль, враги и их части, боссы,
   снаряды, подборы, частицы, «Ноль», сектора), и камера CX/CY. Перед отрисовкой кадра им на время рисования ставится положение
   между предыдущим и текущим шагом (доля = остаток накопителя / шаг), после рисования точные значения возвращаются на место.
   Игра, столкновения, ИИ, RNG и сохранения видят только настоящие значения. Скачок больше IP76CUT пикселей за шаг (телепорт,
   смена сцены, переиспользованный объект) не сглаживается. Новые объекты с vx/vy отодвигаются назад по своей скорости, чтобы
   снаряд не «опережал» корабль. Включается сама, только если экран заметно чаще 60 Гц (средний кадр < 0,8 шага): на 60 Гц и
   ниже картинка, задержка и нагрузка те же, что без патча (перепись объектов тоже не идёт). В плоских списках
   G.parts, G.pb, G.eb, G.pick, G.float, G.rocks берутся только x/y самих элементов, без захода в их поля. Работает только вместе с циклом A-20 (и A-19).
   Выключение: window.__archOff=['A-23'] до загрузки. Сравнение для владельца: window.__ip76mode='x' — экстраполяция вперёд. */
ARCH.vi=!ARCH.off['A-23']&&!ARCH.off['A-20']&&!ARCH.off['A-19'];
const IP76LEAF=new Set(['parts','pb','eb','pick','float','rocks','wrocks']),IP76CUT=80,IP76SKIP=new Set(['save','fog','fogT','wrocks','decor','zones','posLog','dashLog','trail','world','nodes','dev','mc','stat','ach','runStart','radio','x90','relays','hit']);
const IP76={A:{o:[],x:new Float64Array(4096),y:new Float64Array(4096),a:new Float64Array(4096),m:new Map(),n:0,cx:0,cy:0},
  B:{o:[],x:new Float64Array(4096),y:new Float64Array(4096),a:new Float64Array(4096),m:new Map(),n:0,cx:0,cy:0},
  ok:0,ema:STEP74,act:false,mode:(window.__ip76mode==='x'?'x':'i'),al:0,rx:new Float64Array(4096),ry:new Float64Array(4096),ra:new Float64Array(4096),rn:0,rcx:0,rcy:0,
  st:{fr:0,ip:0,obj:0,cut:0,born:0,postMs:0,applyMs:0},seen:new Set()};
function ip76Grow(L,n){if(n<L.x.length)return;const k=L.x.length*2,f=a=>{const b=new Float64Array(k);b.set(a);return b;};L.x=f(L.x);L.y=f(L.y);L.a=f(L.a);
  if(IP76.rx.length<k){IP76.rx=f(IP76.rx);IP76.ry=f(IP76.ry);IP76.ra=f(IP76.ra);}}
function ip76Walk(o,d,L,leaf){if(!o||typeof o!=='object'||IP76.seen.has(o))return;IP76.seen.add(o);
  if(Array.isArray(o)){if(!o.length||typeof o[0]!=='object')return;for(let i=0;i<o.length;i++)ip76Walk(o[i],d,L,leaf);return;}
  if(ArrayBuffer.isView(o)||o instanceof Node||o instanceof Map||o instanceof Set)return;
  if(typeof o.x==='number'&&typeof o.y==='number'){const n=L.n;ip76Grow(L,n);L.o[n]=o;L.x[n]=o.x;L.y[n]=o.y;L.a[n]=typeof o.ang==='number'?o.ang:NaN;L.m.set(o,n);L.n=n+1;}
  if(d>=2||leaf)return;for(const k in o){if(IP76SKIP.has(k))continue;const v=o[k];if(v&&typeof v==='object')ip76Walk(v,d+1,L);}}
function ip76Post(){const t0=performance.now();const P=IP76.A;IP76.A=IP76.B;IP76.B=P;const L=IP76.B;L.n=0;L.m.clear();IP76.seen.clear();
  for(const k in G){if(IP76SKIP.has(k))continue;const v=G[k];if(v&&typeof v==='object')ip76Walk(v,0,L,IP76LEAF.has(k));}
  for(let i=L.n;i<L.o.length;i++)L.o[i]=null;L.cx=CX;L.cy=CY;IP76.ok++;IP76.st.postMs+=performance.now()-t0;}
function ip76Apply(dt0){if(dt0>0&&dt0<.05)IP76.ema+=(dt0-IP76.ema)*.1;
  const was=IP76.act;IP76.act=IP76.act?IP76.ema<STEP74*.9||ip27fast():IP76.ema<STEP74*.8||ip27fast();/* ARCH·92 */if(IP76.act&&!was)IP76.ok=0;IP76.st.fr++;
  if(!IP76.act||IP76.ok<2||!live74())return false;
  const t0=performance.now(),al=Math.max(0,Math.min(1,ACC74/STEP74)),C=IP76.B,P=IP76.A,x=IP76.mode==='x',dts=STEP74*ARCH.sc74;IP76.al=al;
  let cut=0,born=0;for(let i=0;i<C.n;i++){const o=C.o[i];const ox=o.x,oy=o.y,oa=o.ang;IP76.rx[i]=ox;IP76.ry[i]=oy;IP76.ra[i]=typeof oa==='number'?oa:NaN;IP76.rp=i+1;/* ARCH·78 */
    if(ox!==C.x[i]||oy!==C.y[i])continue;/* сдвинут вне шага (событие ввода) — рисуем как есть */
    const j=P.m.get(o);
    if(j===undefined){if(!x&&typeof o.vx==='number'&&typeof o.vy==='number'){const k=(1-al)*dts;o.x=ox-o.vx*k;o.y=oy-o.vy*k;born++;}continue;}
    const dx=ox-P.x[j],dy=oy-P.y[j];if(dx*dx+dy*dy>IP76CUT*IP76CUT){cut++;continue;}
    if(x){o.x=ox+dx*al;o.y=oy+dy*al;}else{o.x=P.x[j]+dx*al;o.y=P.y[j]+dy*al;}
    const pa=P.a[j];if(typeof oa==='number'&&pa===pa&&oa===C.a[i]){let da=oa-pa;da-=Math.round(da/(2*Math.PI))*2*Math.PI;o.ang=x?oa+da*al:pa+da*al;}}
  IP76.rn=C.n;IP76.rcx=CX;IP76.rcy=CY;
  if(CX===C.cx&&CY===C.cy){const dx=CX-P.cx,dy=CY-P.cy;if(dx*dx+dy*dy<=IP76CUT*IP76CUT){if(x){CX=CX+dx*al;CY=CY+dy*al;}else{CX=P.cx+dx*al;CY=P.cy+dy*al;}}}
  IP76.st.ip++;IP76.st.obj=C.n;IP76.st.cut+=cut;IP76.st.born+=born;IP76.st.applyMs+=performance.now()-t0;return true;}
function ip76Restore(){const C=IP76.B;for(let i=IP76.rn-1;i>=0;i--){const o=C.o[i];o.x=IP76.rx[i];o.y=IP76.ry[i];const a=IP76.ra[i];if(a===a)o.ang=a;}CX=IP76.rcx;CY=IP76.rcy;}
/* ▲▲▲ ARCH·76 · КОНЕЦ ВЫРЕЗАЕМОГО БЛОКА ▲▲▲ */
