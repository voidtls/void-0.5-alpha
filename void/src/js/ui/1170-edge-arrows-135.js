/* ===== 1.3.5 α «Один курс»: стрелки у края экрана =====
   1) одна цель — одна стрелка: курс, проложенный на карте, и обычная стрелка к следующей миссии больше не рисуются друг на друге;
   2) подписи разных стрелок не наслаиваются — встают одна под другой;
   3) на телефоне тёмная обводка подписи переезжает вместе с текстом (раньше оставалась на старом месте чёрной кляксой). */
const L61={a:[],r:[]};
function l61(){return L61;}
function l61Reset(){L61.a.length=0;L61.r.length=0;}
/* новый проход стрелок: каждый кадр мира начинается с чистого листа; в миссиях — с кадра оверлея */
{const _rw=renderWorld;renderWorld=function(){l61Reset();return _rw.apply(this,arguments);};}
{const _mo=mobOverlay;mobOverlay=function(){if(!G.world)l61Reset();return _mo.apply(this,arguments);};}
/* та же цель уже показана в этом кадре? (ближе 160 ед.) — тогда вторую стрелку не рисуем */
function arw61Dup(x,y){const L=l61();if(L.a.some(q=>Math.hypot(q[0]-x,q[1]-y)<160))return true;L.a.push([x,y]);return false;}
/* место для подписи: если занято другой подписью — сдвиг вниз/вверх */
function lab61Free(cx,cy,hw,h){return !l61().r.some(q=>cx+hw>q[0]&&cx-hw<q[2]&&cy+3>q[1]&&cy-h<q[3]);}
function lab61Add(cx,cy,hw,h){l61().r.push([cx-hw,cy-h-2,cx+hw,cy+5]);}
function lab61Place(cx,cy,hw,h){let y=cy;for(const d of [0,h+6,-(h+6),2*(h+6),-2*(h+6),3*(h+6),-3*(h+6)]){if(lab61Free(cx,cy+d,hw,h)){y=cy+d;break;}}lab61Add(cx,y,hw,h);return y;}

