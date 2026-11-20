// ===== «Лекало» · Цех №0 =====
function lekGeo(b){const k=Math.min(1,W/980,H/700),bh=Math.min(140,H*.17),wo=b&&b.wo&&b.wo.st==='go'?40*clamp(b.wo.k||0,0,1):0;
  return {k,bh,rail:H*.14,belts:[H*.34,H*.56,H*.78],dir:[-1,1,-1],furY:H-60-wo,fur0:H-60,pultY:H-134};}
function lekBand(g,y){for(let i=0;i<3;i++)if(Math.abs(y-g.belts[i])<g.bh/2)return i;return -1;}
function lekBeltSpd(){return pk85(45,60,80);}
function lekAlive(q){return !!q&&q.alive;}
function lekArms(b){return (lekAlive(b.armL)?1:0)+(lekAlive(b.armR)?1:0);}
function lekCoreOpen(b){return !!b&&b.sbk==='lek'&&b.st==='fight'&&b.inv0<=0&&b.win>0;}
function lekScan(){const st=G.st||{},bl=st.weapon==='blast';return {w:bl?'blast':'gun',n:clamp(st.shots||1,1,5),spd:(bl?620:980)*.7,dmg:(st.dmg||10)*(st.shotK||1),R:(st.blastR||110)*.6,rate:st.rate||.2,
  name:(typeof ARS!=='undefined'&&ARS[bl?'blast':'gun']&&ARS[bl?'blast':'gun'].name||(bl?'«Разрыв»':'Орудие')).toUpperCase(),mods:Object.values(G.mods||{}).reduce((a,v)=>a+v,0)};}
function lekInit(b){const g=lekGeo(b);b.g=g;b.fx=W/2;b.fy=-170;b.x=b.fx;b.y=b.fy;
  Object.assign(b,{blanks:[],asm:null,pressT:4.5,press:null,grabT:7,grab:null,blankT:2.5,stopT:0,otk:0,cone:0,otk100:0,otk50:0,wo:null,stamps:[],stampT:5,hop:[],salvoT:9,salvo:null,last:false,last5:false,win:0,winMax:1.6,labT:3,lab:null,scan:null,scanT:0,light:0,crush:0,hitT0:-1,utT:0,openK:0,inCone:false,beltT:0,
    pults:[{x:Math.max(96,W*.075),y:g.pultY,cd:0,ch:0},{x:Math.min(W-96,W*.925),y:g.pultY,cd:0,ch:0}]});
  const mk=(role,ox,oy,share,r)=>{const q=spawnEnemy('lpart',b.fx+ox,b.fy+oy,{noAffix:true,noLoot:true,spawnT:.9,role,ox,oy,host85:b});q.r=r;q.hp=q.maxHp=share?Math.round(b.maxHp*share):1e6;b.parts.push(q);return q;};
  b.core=mk('core',0,0,0,24);b.core.ghost=true;b.core.contact=0;
  {const i=G.enemies.indexOf(b.core),j=G.enemies.indexOf(b);if(i>j&&j>=0){G.enemies.splice(i,1);G.enemies.splice(j,0,b.core);}}
  b.armL=mk('armL',-172,-58,.09,22);b.armR=mk('armR',172,-58,.09,22);b.pr=mk('press',0,96,.16,26);lekPlace(b);}
function lekPlace(b){const k=(b.g||lekGeo(b)).k;b.x=b.fx;b.y=b.fy;for(const q of b.parts){if(!q.alive)continue;q.x=b.fx+q.ox*k;q.y=b.fy+q.oy*k;q.vx=q.vy=0;}}
function lekFyT(b){const g=b.g;return b.phase>=3&&b.st==='fight'?H*.30:g.rail+72*g.k;}
// окно ПК поменяло размер посреди боя (полный экран, масштаб): цех перестраивается, всё остаётся на арене
function lekResize(b){if(b.gW===W&&b.gH===H)return;const first=b.gW===undefined;b.gW=W;b.gH=H;if(first)return;
  for(const e of G.enemies){if(!e.alive||e===b||e.host85===b&&e.type==='lpart')continue;e.x=clamp(e.x,e.r,W-e.r);e.y=clamp(e.y,e.r,H-e.r);}
  for(const k of G.pick){k.x=clamp(k.x,8,W-8);k.y=clamp(k.y,8,H-8);}b.stamps=b.stamps.filter(s=>s.x>-40&&s.x<W+40&&s.y>-40&&s.y<H+40);
  if(b.docks)for(const d of b.docks){d.x=clamp(W/2+(d.kind==='break'?-1:1)*dock85dx(),70,W-70);d.y=clamp(H*.62,70,H-70);}}
function lekUpdate(b,dt){lekResize(b);const p=G.player,g=lekGeo(b);b.g=g;b.beltT+=dt*(b.stopT>0?0:1);
  const dk=b.st==='fight'&&b.phase>=3?1:(b.st==='scene'||b.st==='final')?.68:0;G.bo80+=(dk-G.bo80)*Math.min(1,dt*1.6);if(Math.abs(G.bo80-dk)<.01)G.bo80=dk;
  if(b.st==='enter'){b.timer-=dt;b.light=Math.min(1,b.light+dt/1.6);b.fy+=(lekFyT(b)-b.fy)*Math.min(1,dt*2.2);lekPlace(b);
    if(!b.scan&&b.timer<=b.enterT-1.6){b.scan=lekScan();b.scanT=0;RB85('Партия: вне. Приёмка начата.',{force:1,d:2.4});snd85('scan');}
    if(b.scan)b.scanT+=dt;
    if(b.timer<=0){b.st='fight';b.phT=0;b.light=1;if(!b.scan)b.scan=lekScan();banner('ЛЕКАЛО · ФАЗА 1','СБОРКА · РАЗБИВАЙТЕ ЗАГОТОВКИ');RB85('Заготовка на линии. Сборка по лекалу.',{force:1,d:.6});lekLabSpawn(b,true);}
    return;}
  if(b.st==='scene'||b.st==='final'){lekScene(b,dt);return;}
  b.phT+=dt;lekRail(b,dt);lekPlace(b);lekBelts(b,dt);lekPults(b,dt);
  if(b.win>0)b.win-=dt;b.core.ghost=!lekCoreOpen(b);
  if(b.phase===2)lekOtk(b,dt);
  if(b.tr>0)return;
  if(b.phase<=2)lekBlanks(b,dt);
  lekPress(b,dt);lekGrab(b,dt);lekLab(b,dt);
  if(b.phase===2)lekStamps(b,dt);
  if(b.phase===3){lekUtil(b,dt);lekSalvo(b,dt);lekLast(b);}
  lekStampMove(b,dt);
  // страховка от затяжки: 45 с без урона по телу — линия перегревается, матрица открыта 3 с
  if(G.t-b.dmgT>45&&b.win<=0&&b.inv0<=0){b.dmgT=G.t;b.win=3;b.winMax=3;floater(b.fx,b.fy-70,'ЛИНИЯ ПЕРЕГРЕЛАСЬ · МАТРИЦА ОТКРЫТА','#ffffff');snd85('open');}}
// рама едет по рельсу за игроком с отставанием 1,5 с; во время сборки, удара пресса и залпа — стоит
function lekRail(b,dt){const p=G.player,g=b.g,L=G.posLog;let q=p;if(L&&L.length){q=L[0];for(let i=L.length-1;i>=0;i--){if(G.t-L[i].t>=1.5){q=L[i];break;}}}
  const hold=!!b.asm||(b.press&&b.press.st!=='up')||!!b.salvo;const m=190*g.k+20;let tx=clamp(q.x,m,W-m);if(hold)tx=b.fx;
  const sp=b.phase>=3?52:40;b.fx+=clamp(tx-b.fx,-sp*dt,sp*dt);b.fx=clamp(b.fx,m,W-m);b.fy+=(lekFyT(b)-b.fy)*Math.min(1,dt*1.2);}
function lekBelts(b,dt){const g=b.g;if(b.stopT>0)b.stopT-=dt;const on=b.stopT<=0,wo=b.wo&&b.wo.st==='go',v=lekBeltSpd();
  if(on){for(const e of G.enemies){if(!e.alive||STATIC.has(e.type)||e.spawnT>0||(e.pg85&&e.pg85.st==='woke'))continue;const i=lekBand(g,e.y);if(i<0)continue;if(wo)e.y+=140*dt;else e.x+=g.dir[i]*v*dt;}
    for(const k of G.pick){if(k.lek85)continue;const i=lekBand(g,k.y);if(i<0)continue;if(wo)k.y+=140*dt;else k.x+=g.dir[i]*v*dt;}}
  for(const e of G.enemies){if(!e.alive||e===b||e.host85===b&&e.type==='lpart'||EDEF[e.type].sbp)continue;if(e.y>g.furY+6){explode(e.x,g.furY+12,C85.hot,12,.6);kill(e,true);}}
  for(const k of G.pick)if(k.y>g.furY+8&&k.life>0){if(k.story||k.quest||k.anom){k.y=g.furY-12;k.vy=-Math.abs(k.vy||0)-40;continue;}k.life=0;if(SET.fx)part(k.x,g.furY+10,vrnd3(-20,20),-60,.5,C85.hot,3);}}
function lekPults(b,dt){const p=G.player,xs=[Math.max(96,W*.075),Math.min(W-96,W*.925)];for(let i=0;i<b.pults.length;i++){const q=b.pults[i];q.x=xs[i];q.y=b.g.pultY;if(q.cd>0)q.cd-=dt;
  if(q.cd<=0&&p.hp>0&&Math.hypot(p.x-q.x,p.y-q.y)<56){q.ch+=dt;if(q.ch>=.6){q.ch=0;q.cd=25;b.stopT=8;floater(q.x,q.y-46,'КОНВЕЙЕРЫ СТОП · 8 С',C85.lek);snd85('pult');buzz('ready');if(G.mc)G.mc.pult85=(G.mc.pult85||0)+1;}}else q.ch=0;}}
// игрок: снос лентой, хват, печь
function lekDrift(b,p,dt){const X=x85(),g=b.g||lekGeo(b);if(p.hp<=0)return;
  if(b.st==='fight'&&b.stopT<=0){const i=lekBand(g,p.y);if(i>=0){const tk=touchMode?.7:1;if(b.wo&&b.wo.st==='go')p.y+=140*tk*dt;else p.x+=g.dir[i]*lekBeltSpd()*tk*dt;}}
  const Gr=b.grab;if(Gr&&Gr.st==='hold'&&p.dashT<=0){p.x=p.px+(p.x-p.px)*.15;p.y=Math.max(p.y,p.py)+160*dt;}
  if(b.st==='fight'&&p.y+p.r*.6>g.furY&&!(X.knock>0)){damagePlayer(8);X.knock=.2;hintOnce('fur85','ПЕЧЬ УТИЛИЗАЦИИ · ДЕРЖИТЕСЬ ВЫШЕ',C85.hot);if(Gr&&Gr.st==='hold'){Gr.st='back';Gr.t=.5;}}
  if(X.knock>0){X.knock-=dt;p.y-=600*dt;}}
// заготовки: едут по верхней ленте к точке сборки под рамой
function lekBlanks(b,dt){const g=b.g,armN=lekArms(b);b.blanks=b.blanks.filter(e=>e.alive);
  if(armN>0){b.blankT-=dt;if(b.blankT<=0){b.blankT=pk85(10,8,7)*(b.phase===2?2:1);if(b.blanks.length<4){const e=spawnEnemy('blank85',-26,g.belts[0],{noAffix:true,noLoot:true,spawnT:.3,host85:b});b.blanks.push(e);if(!b.blHint){b.blHint=1;floater(80,g.belts[0]-40,'ЗАГОТОВКА · РАЗБЕЙТЕ ДО СБОРКИ','#c9d2de');}}}}
  const lim=pk85(1,2,3),ser=G.enemies.filter(e=>e.alive&&e.type==='serial85').length,full=ser>=lim,ax=b.fx;
  if(b.asm&&(!b.asm.e.alive||armN===0))b.asm=null;
  b.blanks.sort((a,c)=>c.x-a.x);let prevX=null;
  for(const e of b.blanks){e.y=g.belts[0];if(b.asm&&b.asm.e===e){e.x+=(ax-e.x)*Math.min(1,dt*4);prevX=e.x;continue;}
    const head=prevX===null,tx=head?((b.asm||full||armN===0)?ax-140*g.k:ax):prevX-46;e.x+=clamp(tx-e.x,-80*dt,80*dt);prevX=e.x;
    if(head&&!b.asm&&!full&&armN>0&&!(b.asmCd>0)&&Math.abs(e.x-ax)<4&&e.spawnT<=0){b.asm={e,t:0};snd85('weld');}}
  if(b.asmCd>0)b.asmCd-=dt;
  if(b.asm){const A=b.asm;A.t+=dt/(armN===1?2:1);if(A.t>=3)lekAssemble(b,A.e);}}
function lekAssemble(b,e){b.asm=null;b.asmCd=pk85(7,5,4);e.alive=false;const S=G.save;let no=serialNo85()+1;serialNo85(no);
  const s=spawnEnemy('serial85',e.x,e.y+8,{noAffix:true,spawnT:.5,no85:no});s.scan85=b.scan;s.vy=180;if(G.mc)G.mc.serial85=1;
  explode(e.x,e.y,C85.lek,16,.7);sfx('killBig');floater(e.x,e.y-34,'СЕРИЙНИК '+String(no).padStart(3,'0'),C85.lek);
  if(!b.ser1){b.ser1=1;if(storyFlag('cradle22')==='keep')RB85('Отметка Кормилицы на изделии. Не предусмотрено.',{force:1});else RB85('Изделие повторено. Серия '+String(no).padStart(3,'0')+'.',{force:1});}}
function serialNo85(v){try{if(v!==undefined){LS.setItem('void_serial85',String(v));return v;}const n=parseInt(LS.getItem('void_serial85')||'13',10);return Number.isFinite(n)&&n>=13?Math.min(n,99999):13;}catch(e){if(v!==undefined)G.ser85=v;return G.ser85||13;}}
function lekBlankGone(b,e,silent){if(b.asm&&b.asm.e===e)b.asm=null;if(silent||!b.alive)return;
  for(let i=0;i<3;i++)G.pick.push({k:'part80',x:e.x+rnd(-14,14),y:e.y+rnd(-14,14),vx:rnd(-80,80),vy:rnd(-80,80),r:6,t:0,life:12,noMag:true});
  RB85('Заготовка испорчена. Списать.',{key:'blank',cd:18});}
// пресс: бьёт по ленте с игроком; давит и своих; после удара (фаза 2) рама раскрывается
function lekPress(b,dt){const g=b.g,p=G.player;if(!lekAlive(b.pr)){b.press=null;return;}
  if(!b.press){b.pressT-=dt;if(b.pressT<=0&&p.hp>0){let i=lekBand(g,p.y);if(i<0){let bd=1e9;for(let j=0;j<3;j++){const d=Math.abs(p.y-g.belts[j]);if(d<bd){bd=d;i=j;}}}
      const T=pk85(1.3,1,.7);b.press={st:'tele',t:T,T,i,x:b.fx,n:b.phase===3?2:1};snd85('press0');}}
  else{const P=b.press;P.t-=dt;
    if(P.st==='tele'){P.x=b.fx;if(P.t<=0)lekStrike(b,P);}
    else if(P.st==='up'){if(P.t<=0){b.press=null;b.pressT=(b.phase===3?6.5:5)*atkK();}}}}
function lekStrike(b,P){const g=b.g,p=G.player,y=g.belts[P.i],x=P.x,hw=80,hh=g.bh/2;
  snd85('press');shake(6);P.hitT=G.t;
  if(SET.fx)for(let i=0;i<14;i++)part(x+vrnd3(-hw,hw),y+vrnd3(-hh*.6,hh*.6),vrnd3(-160,160),vrnd3(-40,40),.5,'#9fb0c4',3);
  G.shock.push({x,y,r:8,R:110,t:0,col:C85.lek,thin:true});
  if(p.hp>0&&Math.abs(p.x-x)<hw+p.r*.5&&Math.abs(p.y-y)<hh+p.r*.5&&p.dashT<=0&&!(x85().calm>0)){const h0=p.hp;damagePlayer(26);if(p.hp<h0){x85().stun=.3;floater(p.x,p.y-36,'ПРЕСС · ДВИГАТЕЛЬ ОГЛУШЁН','#ff4f6e');}}
  for(const e of G.enemies.slice()){if(!e.alive||(e.type!=='blank85'&&e.type!=='serial85')||e.spawnT>0)continue;if(Math.abs(e.x-x)<hw+e.r&&Math.abs(e.y-y)<hh+e.r){if(e.type==='blank85'){b.crush++;if(G.mc)G.mc.crush85=b.crush;}explode(e.x,e.y,C85.lek,18,.8);kill(e,true);RB85('Брак пресса. Записано.',{key:'crush',cd:16});}}
  if(b.phase===2){const near=Math.hypot(p.x-x,p.y-y)<240;b.winMax=pk85(2.2,1.6,1.2)+(near?.4:0);b.win=b.winMax;snd85('open');floater(b.fx,b.fy-70,near?'МАТРИЦА ОТКРЫТА · ВЫ РЯДОМ':'МАТРИЦА ОТКРЫТА','#ffffff');}
  P.n--;if(P.n>0){P.st='tele';P.T=Math.max(.6,P.T*.7);P.t=P.T;{const pb=lekBand(g,p.y);P.i=P.i===1?(pb===0||pb===2?pb:(Math.random()<.5?0:2)):1;}snd85('press0');}else{P.st='up';P.t=.5;}}
// хват манипулятора: летит по прямой; поймал — тянет к печи; рывок или импульс рвут
function lekGrab(b,dt){const p=G.player,arms=[b.armL,b.armR].filter(lekAlive);
  if(!b.grab){if(!arms.length||b.phase===3)return;b.grabT-=dt;if(b.grabT<=0&&p.hp>0){const arm=arms.length===2?(Math.abs(p.x-b.armL.x)<Math.abs(p.x-b.armR.x)?b.armL:b.armR):arms[0];
      if(Math.hypot(p.x-arm.x,p.y-arm.y)>600){b.grabT=1;return;}const T=pk85(1.2,.9,.6);b.grab={st:'tele',t:T,T,arm,a:Math.atan2(p.y-arm.y,p.x-arm.x),L:0,hx:arm.x,hy:arm.y};snd85('grab');}}
  else{const Gr=b.grab,arm=Gr.arm;if(!lekAlive(arm)){b.grab=null;b.grabT=9;return;}Gr.t-=dt;
    if(Gr.st==='tele'){if(Gr.t>Gr.T*.25)Gr.a=Math.atan2(p.y-arm.y,p.x-arm.x);Gr.hx=arm.x;Gr.hy=arm.y;if(Gr.t<=0){Gr.st='fly';Gr.t=1.2;Gr.L=0;}}
    else if(Gr.st==='fly'){Gr.L=Math.min(520,Gr.L+520/1.2*dt);Gr.hx=arm.x+Math.cos(Gr.a)*Gr.L;Gr.hy=arm.y+Math.sin(Gr.a)*Gr.L;
      if(p.hp>0&&p.dashT<=0&&p.inv<=0&&!(x85().calm>0)&&Math.hypot(p.x-Gr.hx,p.y-Gr.hy)<p.r+18){Gr.st='hold';Gr.t=1.5;floater(p.x,p.y-38,'ХВАТ · РЫВОК ИЛИ ИМПУЛЬС','#ff4f6e');buzz('hit');sfx('block');if(G.mc)G.mc.grab85=1;}
      else if(Gr.t<=0||Gr.L>=520){Gr.st='back';Gr.t=.6;}}
    else if(Gr.st==='hold'){Gr.hx=p.x;Gr.hy=p.y;Gr.L=Math.hypot(p.x-arm.x,p.y-arm.y);Gr.a=Math.atan2(p.y-arm.y,p.x-arm.x);if(p.dashT>0){lekGrabBreak(b,'РЫВОК');return;}if(Gr.t<=0||p.hp<=0){Gr.st='back';Gr.t=.6;}}
    else{Gr.L=Math.max(0,Gr.L-1300*dt);Gr.hx=arm.x+Math.cos(Gr.a)*Gr.L;Gr.hy=arm.y+Math.sin(Gr.a)*Gr.L;if(Gr.L<=0||Gr.t<=0){b.grab=null;b.grabT=(b.phase===2?12:9)*atkK();}}}}
function lekGrabBreak(b,how){const Gr=b.grab;if(!Gr)return;Gr.st='back';Gr.t=.6;const arm=Gr.arm;floater(G.player.x,G.player.y-38,'ХВАТ ПОРВАН · '+how,'#ffffff');sfx('block');
  if(lekAlive(arm)&&b.st==='fight'&&b.inv0<=0)hurt(arm,arm.maxHp*.1,{ram:true});RB85('Изделие сопротивляется. Не предусмотрено.',{key:'grab',cd:24});}
// персонал цеха: один Лаборант лечит только Серийников и заготовки (не на «Лёгком»)
function lekLabSpawn(b,first){if(rk85()<=0)return;const s=Math.random()<.5;const e=spawnEnemy('labrat',s?W-40:40,H*.46,{noAffix:true,spawnT:.6});e.lab85=1;b.lab=e;if(first)floater(e.x,e.y-26,'ЛАБОРАНТ ЦЕХА','#7affc9');}
function lekLab(b,dt){if(rk85()<=0)return;const L=b.lab;if(!L||!L.alive){b.labT-=dt;if(b.labT<=0){b.labT=30;lekLabSpawn(b,false);}return;}
  if(!L.beam&&!(L.bcut>0)&&!(L.hot>0)){let best=null,bk=1;for(const e of b.blanks){if(!e.alive||e.spawnT>0)continue;const k=e.hp/e.maxHp;if(k<bk&&Math.hypot(e.x-L.x,e.y-L.y)<300){bk=k;best=e;}}if(best){L.beam=best;best.healBy=L;L.bt80=0;}}}
// ОТК: лампы, шкала брака, списание
const LAMP85={ha:.4,len:540};
function lekLamp(b,i){const g=b.g,off=Math.floor((b.phT||0)/7)%3;return {x:W*(.2+.3*i),y:g.rail,a:Math.PI/2+.6*Math.sin(G.t*.5+i*2.1),on:i!==off};}
function lekOtk(b,dt){const p=G.player;if(b.wo)lekWriteOff(b,dt);
  let inC=false;if(p.hp>0&&!b.wo&&b.tr<=0)for(let i=0;i<3;i++){const L=lekLamp(b,i);if(!L.on)continue;const d=Math.hypot(p.x-L.x,p.y-L.y);if(d<LAMP85.len&&Math.abs(angDiff(Math.atan2(p.y-L.y,p.x-L.x),L.a))<LAMP85.ha){inC=true;break;}}
  b.inCone=inC;if(inC){b.cone+=dt;if(b.cone>=.8){b.cone=0;lekOtkAdd(b,25,'ОТКЛОНЕНИЕ');}}else{b.cone=Math.max(0,b.cone-dt*2);if(!b.wo)b.otk=Math.max(0,b.otk-3*dt);}
  if(p.hitT!==undefined&&p.hitT>b.hitT0){b.hitT0=p.hitT;if(!b.wo)lekOtkAdd(b,4);}}
function lekOtkAdd(b,v,txt){if(b.wo||b.phase!==2)return;const p=G.player;b.otk=Math.min(100,b.otk+v);if(txt){floater(p.x,p.y-40,txt+' · +'+v+'% БРАКА',C85.lek);sfx('warn');}
  if(b.otk>=50&&!b.otk50){b.otk50=1;RB85('Отклонение от нормы: память.',{force:1});}
  if(b.otk>=100){b.wo={st:'warn',t:1.5,k:0};b.otk100++;if(G.mc)G.mc.otk85=1;RB85('Списание изделия. Всем лентам — к печи.',{force:1});snd85('siren');buzz('ready');banner('СПИСАНИЕ ИЗДЕЛИЯ','ЛЕНТЫ — К ПЕЧИ · ПУЛЬТ СМЕНЫ ИЛИ ВЕРХНЯЯ ЛЕНТА');}}
function lekWriteOff(b,dt){const W_=b.wo;W_.t-=dt;if(W_.st==='warn'){if(W_.t<=0){W_.st='go';W_.t=5;W_.k=0;}}
  else{W_.k=Math.min(1,W_.k+dt*2);if(W_.t<=0){b.wo=null;b.otk=0;if(G.player.hp>0)RB85('Изделие не списано. Повторить осмотр.',{force:1});}}}
// печати ОТК
function lekStamps(b,dt){b.stampT-=dt;if(b.stampT<=0){b.stampT=8*atkK();const p=G.player,a0=Math.atan2(p.y-b.fy,p.x-b.fx);
    for(let i=0;i<3;i++){const a=a0+(i-1)*.45;b.stamps.push({x:b.fx+(i-1)*44*b.g.k,y:b.fy+70*b.g.k,a,t:6,sp:rnd(0,TAU)});}snd85('stamp');}}
function lekStampMove(b,dt){const p=G.player,X=x85();for(const s of b.stamps){if(s.t<=0)continue;s.t-=dt;const ta=Math.atan2(p.y-s.y,p.x-s.x);s.a+=clamp(angDiff(ta,s.a),-1.1*dt,1.1*dt);s.x+=Math.cos(s.a)*110*dt;s.y+=Math.sin(s.a)*110*dt;s.sp+=dt*3;
    if(p.hp>0&&Math.hypot(p.x-s.x,p.y-s.y)<p.r+12){s.t=0;if(p.dashT>0)continue;if(X.calm>0)continue;
      if(!G.stamp80&&p.inv<=0){const t=rk85()===0?5:4;G.stamp80={t,max:t};document.body.classList.add('stamp80');floater(p.x,p.y-34,'ПРОВЕРЕНО · СБРОСЬТЕ РЫВКОМ','#ff7a3d');buzz('hit');sfx('block');}
      lekOtkAdd(b,20,'ПЕЧАТЬ ОТК');}}
  b.stamps=b.stamps.filter(s=>s.t>0&&s.x>-40&&s.x<W+40&&s.y>-40&&s.y<H+40);}
// списание: рама втягивает добычу (бункер 24) и бьёт ею веером «Вся смена»
function lekUtil(b,dt){b.utT++;const p=G.player,mag=(G.st&&G.st.mag)||0;
  for(const k of G.pick){if(k.life<=0||k.anom||k.story||k.quest)continue;if(k.k!=='xp'&&k.k!=='lom'&&k.k!=='cell'&&k.k!=='part80'&&k.k!=='wreck85')continue;
    if(!k.lek85){if(b.utT%4)continue;if(p.hp>0&&Math.hypot(k.x-p.x,k.y-p.y)<mag+10)continue;k.lek85=1;k.noMag=true;k.rc80=null;}
    if(p.hp>0&&k.k!=='part80'&&k.k!=='wreck85'&&Math.hypot(k.x-p.x,k.y-p.y)<mag*.55){k.lek85=0;k.noMag=false;continue;}
    const dx=b.fx-k.x,dy=b.fy-k.y,d=Math.hypot(dx,dy)||1;k.vx=dx/d*190-dy/d*55;k.vy=dy/d*190+dx/d*55;k.life=Math.max(k.life,2);
    if(d<36){if(b.hop.length<24){b.hop.push({k:k.k,v:k.v||1});k.life=0;}else{k.vx=k.vy=0;}}}}
function lekSalvo(b,dt){const p=G.player;
  if(!b.salvo){b.salvoT-=dt;if((b.hop.length>=24||b.salvoT<=0)&&p.hp>0){const T=pk85(1.2,.9,.65);b.salvo={t:T,T,a:Math.atan2(p.y-b.fy,p.x-b.fx)};snd85('salvo0');RB85('Утилизация отходов смены.',{key:'salvo',cd:26});}return;}
  const S=b.salvo;S.t-=dt;if(S.t>S.T*.3)S.a+=clamp(angDiff(Math.atan2(p.y-b.fy,p.x-b.fx),S.a),-.8*dt,.8*dt);if(S.t>0)return;
  const items=b.hop.splice(0,18),n=items.length,X=x85();
  if(!n){for(let i=0;i<6;i++){shootE(b.fx,b.fy+30*b.g.k,S.a+(i-2.5)*.16,240,6,'#ffb84d',4);}}
  else{const step=Math.min(.12,1.3/Math.max(1,n-1));for(let i=0;i<n;i++){const it=items[i],a=S.a+(i-(n-1)/2)*step;const heavy=it.k==='wreck85';
      const dmg=heavy?30:it.k==='lom'?Math.min(14,8+Math.floor((it.v||1)/10)):it.k==='part80'?12:8,col=heavy?'#c9d2de':it.k==='lom'?'#ffb84d':it.k==='xp'?'#d9c8ff':it.k==='cell'?'#ffb84d':'#c9d2de';
      const q=shootE(b.fx,b.fy+30*b.g.k,a,heavy?230:265,dmg,col,heavy?9:it.k==='part80'?7:5);if(q){q.rc80=it;if(G.rcB80)G.rcB80.push(q);}}}
  sfx('bigboom');shake(8);snd85('salvo');b.salvo=null;b.salvoT=8.5*atkK();b.win=pk85(2.6,2,1.5);b.winMax=b.win;floater(b.fx,b.fy-70,'ПЕРЕГРЕВ · МАТРИЦА ОТКРЫТА','#ffffff');snd85('open');}
// «Последняя партия»: на 15% собираются сразу до двух Серийников; пока они живы, матрица берёт ×0,5
function lekLast(b){const k=b.hp/b.maxHp;
  if(!b.last&&k<=.15){b.last=true;banner('ПОСЛЕДНЯЯ ПАРТИЯ','ПОКА СЕРИЙНИКИ ЖИВЫ — МАТРИЦА ×0,5');RB85('Последняя партия. Линия не может остановиться.',{force:1});
    if(lekArms(b)>0){const al=G.enemies.filter(e=>e.alive&&e.type==='serial85').length;for(let i=0;i<Math.max(0,2-al);i++){const no=serialNo85()+1;serialNo85(no);const s=spawnEnemy('serial85',b.fx+(i?60:-60)*b.g.k,b.fy+90*b.g.k,{noAffix:true,spawnT:.6,no85:no,last85:true});s.hp=s.maxHp=s.maxHp*.6;s.scan85=b.scan;s.vy=200;if(G.mc)G.mc.serial85=1;explode(s.x,s.y,C85.lek,14,.6);}}}
  if(!b.last5&&k<=.05){b.last5=true;RB85('Линия не может… линия не…',{force:1});}}
// повреждения
function lekHurt(b,e,dmg,src){
  if(e.type==='lekalo'){pool85(b,dmg*(lekAlive(b.pr)?.7:1),.08,e);return 0;}
  if(e.role==='core'){if(!lekCoreOpen(b)){sbBlock(e);return 0;}const lb=G.enemies.some(q=>q.alive&&q.last85);pool85(b,dmg*1.5*(lb?.5:1),0,b);e.flash=.07;return 0;}
  const d=Math.min(dmg,e.hp);pool85(b,d,.08,null);return dmg;}
function lekPartDied(b,e){explode(e.x,e.y,C85.lek,34,1.2);sfx('bigboom');shake(7);
  if(e.role==='armL'||e.role==='armR'){const g=b.g;for(let i=0;i<3;i++)G.pick.push({k:'wreck85',x:e.x+rnd(-30,30),y:clamp(e.y+rnd(40,140),0,g.furY-30),vx:rnd(-40,40),vy:rnd(40,120),r:9,t:0,life:240,noMag:true});
    if(b.grab&&b.grab.arm===e)b.grab=null;
    if(lekArms(b)===0){floater(e.x,e.y-30,'МАНИПУЛЯТОРЫ ВЫБИТЫ · КОПИЙ БОЛЬШЕ НЕТ',C85.lek);b.asm=null;}else floater(e.x,e.y-30,'МАНИПУЛЯТОР ВЫБИТ · СБОРКА ВДВОЕ ДОЛЬШЕ',C85.lek);}
  else if(e.role==='press'){b.press=null;floater(e.x,e.y-30,b.phase<3?'ПРЕСС ВЫБИТ · РАМА БЕРЁТ ПОЛНЫЙ УРОН':'ПРЕСС ВЫБИТ',C85.lek);}}
function lekBullet(b,bu){const C=b.core;
  // открытая матрица: рама её не заслоняет — попадание в глаз засчитывается по всему проёму рамы
  if(C&&C.alive&&lekCoreOpen(b)&&!bu.hit.includes(C)&&segDist(bu.px,bu.py,bu.x,bu.y,C.x,C.y)<50){if(bu.blast){bu.x=C.x;bu.y=C.y;bu.life=0;return true;}bu.hit.push(C);hurt(C,bu.dmg,{charged:!!bu.charged,drone:!!(bu.drone||bu.turret)});if(SET.fx)part(bu.x,bu.y,vrnd3(-60,60),vrnd3(-60,60),.2,'#ffffff',2);if(!bu.charged){bu.life=0;return true;}}
  for(const s of b.stamps){if(s.t>0&&segDist(bu.px,bu.py,bu.x,bu.y,s.x,s.y)<13){s.t=0;explode(s.x,s.y,'#ff7a3d',8,.4);if(!bu.charged&&!bu.blast){bu.life=0;return true;}}}return false;}
function lekPulse(b,p,R){if(b.grab&&b.grab.st==='hold')lekGrabBreak(b,'ИМПУЛЬС');for(const s of b.stamps)if(Math.hypot(s.x-p.x,s.y-p.y)<R+12)s.t=0;}
// автоприцел: открытая матрица → заготовка в сборке → Серийник → манипулятор → пресс → рама
function lekAuto(p,b){let best=null,bs=1e9;const cand=(e,w)=>{if(!e||!e.alive||!targetable(e))return;const d=Math.hypot(e.x-p.x,e.y-p.y)/w;if(d<bs){bs=d;best=e;}};
  if(lekCoreOpen(b))cand(b.core,1.8);for(const e of b.blanks)cand(e,b.asm&&b.asm.e===e?1.4:1.1);
  for(const e of G.enemies){if(e.type==='serial85')cand(e,1.05);else if(e.type==='labrat'&&e.beam)cand(e,1.15);}cand(b.armL,1.12);cand(b.armR,1.12);cand(b.pr,.92);cand(b,.85);
  return best&&bs<1000?best:null;}
function lekHud(b){if(b.win>0)return (b.phase===3?'ПЕРЕГРЕВ · ':'')+'МАТРИЦА ОТКРЫТА · '+fmt85(b.win)+' С';
  if(b.phase===1)return b.asm?'СБОРКА '+Math.round(b.asm.t/3*100)+'% · РАЗБЕЙТЕ ЗАГОТОВКУ':'СБОРКА · РАЗБИВАЙТЕ ЗАГОТОВКИ';
  if(b.phase===2)return b.wo?'СПИСАНИЕ · ПУЛЬТ СМЕНЫ ИЛИ ВЕРХНЯЯ ЛЕНТА':'ОТК · ЖДИТЕ УДАРА ПРЕССА · БРАК '+Math.round(b.otk)+'%';
  return b.salvo?'ЗАЛП «ВСЯ СМЕНА» · УХОДИТЕ С ВЕЕРА':'СПИСАНИЕ · СОБИРАЙТЕ ДОБЫЧУ РАНЬШЕ РАМЫ';}
function lekStrip(b){
  if(b.st==='enter'){if(!b.scan)return {l:'ПРИЁМКА · СВЕТ ПО ЛИНИЯМ',k:null};const s=b.scan;return {l:'ПАСПОРТ ИЗДЕЛИЯ · VØID-013 · ОРУЖИЕ: '+s.name+(s.n>1?' ×'+s.n:'')+' · МОДУЛЕЙ: '+s.mods+' · ИЗНОС 12% · ПАРТИЯ: ВНЕ',k:null,wrap:true,lc:C85.lek};}
  if(b.st==='scene')return {l:'ЗАПИСЬ · Э. В. · ЦЕХ №0',k:null,lc:'#ffd36b'};
  if(b.st==='final')return {l:b.prev85?'ВЫ УЖЕ СДЕЛАЛИ ВЫБОР · ЛЕТИТЕ К ПРИЧАЛУ':'РАЗБИТЬ ЛЕКАЛО ИЛИ ПЕРЕПИСАТЬ ЕГО СОБОЙ',k:null,lc:C85.lek};
  const lim=pk85(1,2,3),ser=G.enemies.filter(e=>e.alive&&e.type==='serial85').length;
  if(b.phase===1)return {l:b.asm?'СБОРКА СЕРИЙНИКА':lekArms(b)?'ЛИНИЯ · ЗАГОТОВОК '+b.blanks.filter(e=>e.alive).length:'МАНИПУЛЯТОРЫ ВЫБИТЫ',k:b.asm?b.asm.t/3:null,col:'#ff4f6e',r:'СЕРИЙНИКИ '+ser+'/'+lim};
  if(b.phase===2){const k=b.otk/100,c=k<.5?'#7affc9':k<.8?'#ffd36b':'#ff4f6e';return {l:b.wo?(b.wo.st==='warn'?'СПИСАНИЕ ЧЕРЕЗ '+fmt85(b.wo.t):'СПИСАНИЕ · '+fmt85(b.wo.t)+' С'):'ОТК: НОРМА → БРАК',lc:b.wo?'#ff4f6e':'',k,col:c,r:Math.round(b.otk)+'%'};}
  return {l:'ОТХОДЫ СМЕНЫ',k:b.hop.length/24,col:'#ffb84d',r:b.hop.length+'/24'};}
// финал: линия останавливается, рама раскрывается, запись Э. В.
function lekFinal(b){for(const k of G.pick)if(k.lek85){k.lek85=0;k.noMag=k.k==='part80'||k.k==='wreck85';k.vx*=.2;k.vy*=.2;}b.press=null;b.grab=null;b.salvo=null;b.stamps=[];b.wo=null;b.win=0;b.asm=null;b.stopT=0;b.scT=0;b.subOn=false;b.beltStop=[0,0,0];
  banner('МАТРИЦА ПОГАСЛА','ЛИНИЯ ОСТАНАВЛИВАЕТСЯ');snd85('stop');}
function lekScene(b,dt){b.scT+=dt;b.openK=Math.min(1,b.openK+dt/1.6);for(let i=0;i<3;i++)if(b.scT>.6+i*.6)b.beltStop[i]=1;b.stopT=99;
  b.fy+=((b.g.rail+72*b.g.k)-b.fy)*Math.min(1,dt*.8);lekPlace(b);
  if(b.st==='scene'&&b.scT>=2.4&&!b.subOn){b.subOn=true;
    sub85('ЗАПИСЬ · Э. В. · ЦЕХ №0','#ffd36b',['«Если ты слышишь это в Цехе ноль — ты дошёл дальше всех, кого мы сделали».','«Это лекало. С него сняли тебя. И всех, кто летал до тебя».','«Первая копия висит перед тобой. Она так и не проснулась. Я счёл это милосердием».','«Разбей его — и больше никто не проснётся в чужом корпусе».','«Или оставь в нём себя. Тогда следующий проснётся, помня тебя».','«Я не смог выбрать. Прости, что выбирать тебе».'],
      ()=>{if(b.st!=='scene')return;b.st='final';sb85SetDocks(b,[{kind:'break',x:W/2-dock85dx(),y:H*.62,lab:'РАЗБИТЬ ЛЕКАЛО',sub:'копий больше не будет'},{kind:'write',x:W/2+dock85dx(),y:H*.62,lab:'ПЕРЕПИСАТЬ ЛЕКАЛО',sub:'следующий проснётся, помня вас'}]);
        banner('ЛЕКАЛО','РАЗБИТЬ ИЛИ ПЕРЕПИСАТЬ · ЛЕТИТЕ К ПРИЧАЛУ');sfx('level');});}
  if(b.st==='final')sb85Docks(b,dt);}
function lekChoose(b,ch,world,prev){const badges=[];if(b.crush>=3)badges.push('«Брак пресса»');if(!b.otk100)badges.push('«Норма»');const bt=badges.length?' Бейджи: '+badges.join(', ')+'.':'';
  if(ch==='break'){G.sbLomK=prev?1:2;
    G.sbChoiceTxt=(prev?'Вы уже сделали выбор: лекало разбито. ':'Лекало разбито: лом ×2. Копий больше не делают — в секторе VII всегда светло, бюро молчит. Скин «Осколок лекала» в ангаре. ')+'«Лекало разбито. В Цехе №0 горит свет, и больше нечего проверять».'+bt;
    SB_DEATH.lek=['ЛЕКАЛО РАЗБИТО','СЕКТОР VII ПРОЙДЕН','Если ты разбил его — значит, решил за всех нас. Я рад, что это был не я.'];if(world&&!prev)own85('shard85');}
  else{G.sbLomK=1;
    G.sbChoiceTxt=(prev?'Вы уже сделали выбор: лекало переписано. ':'Лекало переписано вами: лом ×1. В секторе VII появится союзный «Ученик», Паломники терпят на один выстрел больше, в Колодце поможет Серийник 013. Скин «Серия 013» в ангаре. ')+'«Лекало тёплое. Следующая копия будет помнить, как тебя звали».'+bt;
    SB_DEATH.lek=['ЛЕКАЛО ПЕРЕПИСАНО','СЕКТОР VII ПРОЙДЕН','Если ты оставил себя в нём — следующий узнает твой почерк. Как ты узнал мой.'];if(world&&!prev)own85('serial013');}
  RB85(ch==='break'?'Линия… остановлена.':'Линия работает по новому лекалу.',{force:1,d:.2});}
// Серийник: держится на 300–420 и стреляет шаблоном оружия игрока (скорость ×0,7, темп ×0,5, урон ×0,4 с потолком Отзвука)
function serialAI85(e,dt,c){const p=G.player,b=sb85(),pdx=p.x-e.x,pdy=p.y-e.y,pd=Math.hypot(pdx,pdy)||1,sc=e.scan85||(b&&b.scan)||(e.scan85=lekScan());
  const dk=G.bo80>=.5?260:360,k=clamp((pd-dk)/80,-1,1);let vx=pdx/pd*k-pdy/pd*.6*e.dir,vy=pdy/pd*k+pdx/pd*.6*e.dir;
  if(b&&b.sbk==='lek'&&b.g){const g=b.g;if(e.y>g.furY-80)vy-=1.4;if(e.y<g.rail+50)vy+=.9;}
  steer(e,vx,vy,e.spd*((c&&c.sm)||1),dt,2.4);if(Math.random()<dt*.3)e.dir*=-1;
  const S=e.sf||(e.sf={st:'cd',t:rnd(1,2)});S.t-=dt;if(b&&(b.tr>0||b.st!=='fight'))return;
  if(S.st==='cd'){if(S.t<=0&&p.hp>0&&pd<760&&onScreen(e)){S.st='tele';S.t=.5;}}
  else if(S.st==='tele'){if(S.t<=0){S.st='burst';S.n=pk85(1,1,2);S.t=0;}}
  else if(S.st==='burst'){if(S.t<=0){S.n--;S.t=Math.max(.22,(sc.rate||.2)*2);serialShot85(e,sc);if(S.n<=0){S.st='cd';S.t=rnd(1.6,2.3)*atkK();}}}}
function serialShot85(e,sc){const p=G.player,a0=Math.atan2(p.y-e.y,p.x-e.x),cap=[8,11,15][rk85()],d=clamp((sc.dmg||10)*.3,2,cap),X=x85(),n=clamp(sc.n||1,1,3);
  for(let i=0;i<n;i++){const a=a0+(i-(n-1)/2)*.11;const q=shootE(e.x,e.y,a,sc.spd||686,d,'#ffd36b',sc.w==='blast'?6:4);if(q){q.ser85=1;X.trk.push(q);if(sc.w==='blast'){q.bl85=sc.R||66;q.life=1.1;X.bl.push(q);}}}sfx('shot');}
function lekPhase(b){const p=G.player;
  if(b.phase===2){banner('ЛЕКАЛО · ФАЗА 2','ОТК · НЕ СТОЙТЕ В КОНУСАХ ЛАМП');RB85('Отдел технического контроля. Изделие — к осмотру.',{force:1,d:.5});b.scan=lekScan();b.otk=0;b.cone=0;b.stampT=4;b.blankT=Math.max(b.blankT,5);b.hitT0=p&&p.hitT!==undefined?p.hitT:-1;b.pressT=Math.min(b.pressT,3);}
  if(b.phase===3){banner('ЛЕКАЛО · ФАЗА 3','СПИСАНИЕ · СВЕТ ПО РЕГЛАМЕНТУ');RB85('Смена окончена. Свет — по регламенту.',{force:1,d:.5});b.wo=null;b.stamps=[];b.asm=null;b.otk=0;b.win=0;b.salvoT=6;b.grab=null;b.pressT=Math.max(b.pressT,3);
    for(const e of b.blanks){if(e.alive){b.hop.push({k:'part80',v:1},{k:'part80',v:1});kill(e,true);}}b.blanks=[];}}

