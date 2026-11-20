/* ▼▼▼ ARCH·80 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.20 α · A-24: свобода корпуса, эксперимент)
   A-24 · цель, автострельба и направление выстрела работают как прежде (pickTarget, shoot=!!tg, aimPt, радиусы 560/700/760/800,
   G.prio, G.tg90 не меняются). Меняется только желаемый угол корпуса в автонаведении: если корабль летит ОТ цели
   (скорость больше v0, угол между скоростью и направлением на цель больше 90°) и цель дальше r0, корпус плавно доворачивается
   к направлению полёта. Вес w = гладкая ступень(скорость) · гладкая ступень(угол) · гладкая ступень(дальность), 0…1;
   поворот идёт тем же сглаживанием, что и раньше (dt·14), так что скачков угла нет. Пока w = 0, всё побитно как без A-24.
   Зависит от поворота (согласованно): точка вылета пуль (смещается к цели пропорционально w — пули не пролетают сквозь корпус),
   рывок с места без ввода (летит по корпусу). Механики, которые читают курс корабля для баланса (Отзвук echo80, пара hollow100),
   читают «прежний» курс — тот, который был бы без A-24 (считается параллельно теми же формулами). В бою с боссом, «Нолём» и в ручном прицеле не работает.
   Включение только явно: window.__a24on=true до загрузки (пробная сборка). Параметры: window.__a24={r0,r1,v0,v1,c0,c1,dash}; dash:'aim' — рывок без ввода по прежнему курсу на цель. */
const A24P=Object.assign({r0:200,r1:320,v0:60,v1:180,c0:0,c1:-.5,dash:'hull'},window.__a24||{});
ARCH.a24=window.__a24on===true&&!ARCH.off['A-24'];
ARCH.a24s={p:null,ang:0,last:0,ep:false,w:0,n:0};
function a24ss(x){x=x<0?0:x>1?1:x;return x*x*(3-2*x);}
function a24Boss(){return !!((G.boss&&G.boss.st==='fight')||(G.jam&&G.jam.st==='fight')||(G.sb&&G.sb.alive&&G.sb.st==='fight')||G.zb);}
function a24Want(p,tg,want,sp,dt,man){const A=ARCH.a24s;
  if(A.p!==p){A.p=p;A.ang=p.ang;A.last=p.ang;A.ep=false;A.w=0;}
  if(p.ang!==A.last){if(A.ep)A.ang+=angDiff(p.ang,A.last);else A.ang=p.ang;}/* курс изменён вне поворота (зеркало, сброс): прежний курс следует за ним */
  /* «прежний» курс: тот же поворот, что у корпуса без A-24 — те же формулы и то же want, поэтому побитно равен p.ang сборки без A-24 */
  A.ang+=man?clamp(angDiff(want,A.ang)*Math.min(1,dt*18),-.45,.45):angDiff(want,A.ang)*Math.min(1,dt*14);
  let w=0;if(!man&&tg&&sp>A24P.v0&&!a24Boss()){const q=aimPt(tg),dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy);
    if(d>A24P.r0){const c=(p.vx*dx+p.vy*dy)/(sp*d);w=a24ss((A24P.c0-c)/(A24P.c0-A24P.c1))*a24ss((sp-A24P.v0)/(A24P.v1-A24P.v0))*a24ss((d-A24P.r0)/(A24P.r1-A24P.r0));}}
  A.w=w;let wn=want;
  if(w>0){A.n++;const mA=Math.atan2(p.vy,p.vx);let df=angDiff(mA,want);
    if(Math.abs(df)>2.8){const s=angDiff(p.ang,want);if(s!==0&&(s>0)!==(df>0))df+=df>0?-TAU:TAU;}/* почти встречно: доворот с той стороны, где корпус уже стоит */
    wn=want+df*w;}
  A.last=p.ang+(man?clamp(angDiff(wn,p.ang)*Math.min(1,dt*18),-.45,.45):angDiff(wn,p.ang)*Math.min(1,dt*14));/* то же выражение, что в updatePlayer */
  A.ep=A.last!==A.ang;
  return wn;}
function a24Hull(p){const A=ARCH.a24s;return ARCH.a24&&A.p===p?A.ang:p.ang;}
function a24Muz(p,base){const A=ARCH.a24s;return A.p===p&&A.w>0?p.ang+angDiff(base,p.ang)*A.w:p.ang;}
/* ▲▲▲ ARCH·80 · КОНЕЦ ВЫРЕЗАЕМОГО БЛОКА ▲▲▲ */
