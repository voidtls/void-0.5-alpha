// ===== 0.9.5: язык угроз, комфорт, общие системы секторов IX–X =====
['hunt95','spasm95','cell95','guard95','blot95','scribe95','ebb95','lost95','gclot95'].forEach(k=>{S90T.add(k);H74.add(k);STORY_NORETREAT.add(k);D90T.add(k);});
['eye95','shade95'].forEach(k=>{D90T.add(k);SB85T.add(k);});
function on95(){const X=G.x90;return !!X&&inMission()&&X.sec>=8&&X.sec<=11&&G.mode!=='endless';}
function x95(){return G.x90;}
// --- телеграфы: «предупреждение → заряд → удар → остаток». Минимум 0,45 с, для ударов от 20 урона — 0,7 с ---
function tmin95(dmg){return dmg>=20?.7:.45;}
function tlog95(k,T){const X=G.x90;if(!X)return;const L=X.tlog95||(X.tlog95={});if(L[k]===undefined||T<L[k])L[k]=T;}
// o: {k:'line'|'zone'|'cone'|'drop'|'col', x,y, x2,y2, w, r, a, arc, len, T, dmg, col, src, key, snd, keep, on(o), fx}
function tg95(o){const X=G.x90;const L=X&&inMission()?(X.tg95||(X.tg95=[])):(G.wtg95||(G.wtg95=[]));
  o.T=Math.max(o.T||0,tmin95(o.dmg||0))*(o.key&&o.telK!==false?tel90(o.key):1);o.t=0;o.st='warn';o.rest=0;o.col=o.col||C95.zone;if(o.key){tlog95(o.key,o.T);tel90use(o.key);}
  if(o.snd!==false)snd95(o.snd||(o.k==='line'?'tlLine':o.k==='zone'||o.k==='drop'?'tlZone':o.k==='cone'?'tlCone':'tlLine'),o.x);
  L.push(o);if(L.length>48)L.shift();return o;}
function tgList95(){const X=G.x90;return X&&inMission()?(X.tg95||[]):(G.wtg95||[]);}
function tgHit95(o,x,y,pad){pad=pad||0;switch(o.k){
    case 'line':return segDist(o.x,o.y,o.x2,o.y2,x,y)<o.w/2+pad;
    case 'zone':case 'drop':return Math.hypot(x-o.x,y-o.y)<o.r+pad;
    case 'cone':{const d=Math.hypot(x-o.x,y-o.y);if(d>o.len+pad||d<4)return d<4;return Math.abs(angDiff(Math.atan2(y-o.y,x-o.x),o.a))<o.arc/2;}
    case 'col':return Math.abs(x-o.x)<o.w/2+pad&&y>o.y&&y<o.y2;
    case 'arc':{const d=Math.hypot(x-o.x,y-o.y);if(Math.abs(d-o.r)>o.w/2+pad)return false;return Math.abs(angDiff(Math.atan2(y-o.y,x-o.x),o.a))<o.arc/2;}}
  return false;}
function tgTick95(dt){const L=tgList95();if(!L.length)return;const p=G.player;
  for(const o of L){if(o.src&&!o.src.alive&&!o.keep&&o.st==='warn'){o.dead=1;continue;}
    if(o.track&&o.st==='warn')o.track(o,dt);
    o.t+=dt;if(o.st==='warn'&&o.t>=o.T){o.st='hit';o.rest=.3;
      if(o.on)o.on(o);
      if(!o.noHit&&p&&p.hp>0&&p.dashT<=0&&tgHit95(o,p.x,p.y,p.r*.55)){damagePlayer((o.dmg||10)*(o.src?first90(o.src):1));if(o.kb){const a=Math.atan2(p.y-o.y,p.x-o.x);p.x+=Math.cos(a)*o.kb;p.y+=Math.sin(a)*o.kb;if(inMission()){p.x=clamp(p.x,p.r,BW-p.r);p.y=clamp(p.y,p.r,BH-p.r);}}if(o.slow)G.slowP95=Math.max(G.slowP95||0,o.slow);}
      if(o.hitE)for(const e of G.enemies){if(!e.alive||e===o.src||STATIC.has(e.type)||EDEF[e.type].passive||e.sbk||EDEF[e.type].sbp)continue;if(tgHit95(o,e.x,e.y,e.r*.5))hurt(e,o.hitE,{pulse:true});}
      if(o.fx!==false)tgFx95(o);}
    else if(o.st==='hit'){o.rest-=dt;if(o.rest<=0)o.dead=1;}}
  for(let i=L.length-1;i>=0;i--)if(L[i].dead)L.splice(i,1);}
function tgFx95(o){const c=o.col;trauma90(o.dmg>=18?.18:.08);
  if(!SET.fx)return;const n=fxN95(o.k==='line'?10:8);
  if(o.k==='line'){for(let i=0;i<n;i++){const u=vR3();part(o.x+(o.x2-o.x)*u,o.y+(o.y2-o.y)*u,vrnd3(-60,60),vrnd3(-60,60),vrnd3(.2,.45),i%3?c:'#ffffff',2);}}
  else if(o.k==='zone'||o.k==='drop'){if(G.shock.length<60)G.shock.push({x:o.x,y:o.y,r:o.r*.4,R:o.r,t:0,col:c,thin:true});for(let i=0;i<n;i++){const a=vrnd3(0,TAU);part(o.x+Math.cos(a)*o.r*.5,o.y+Math.sin(a)*o.r*.5,Math.cos(a)*vrnd3(40,140),Math.sin(a)*vrnd3(40,140),vrnd3(.25,.5),c,2);}}
  else if(o.k==='cone'){for(let i=0;i<n;i++){const a=o.a+vrnd3(-o.arc/2,o.arc/2),d=vrnd3(20,o.len);part(o.x+Math.cos(a)*d,o.y+Math.sin(a)*d,Math.cos(a)*80,Math.sin(a)*80,.3,c,2);}}}
// рисунок телеграфа: k — 0..1 (предупреждение → заряд)
function tgDraw95(t){const L=tgList95();if(!L.length)return;const hard=rk90()>=2;
  for(const o of L){if(G.world&&!inView(o.x,o.y,(o.len||o.r||300)+60))continue;const k=clamp(o.t/o.T,0,1),c=o.col;
    if(o.st==='hit'){const a=clamp(o.rest/.3,0,1);ctx.globalAlpha=a*.6;ctx.fillStyle=c;ctx.strokeStyle='#ffffff';
      if(o.k==='line'){ctx.lineCap='round';ctx.strokeStyle=c;ctx.lineWidth=o.w*a;ctx.beginPath();ctx.moveTo(o.x,o.y);ctx.lineTo(o.x2,o.y2);ctx.stroke();ctx.lineCap='butt';}
      else if(o.k==='zone'||o.k==='drop'){ctx.beginPath();ctx.arc(o.x,o.y,o.r,0,TAU);ctx.fill();}
      else if(o.k==='cone'){ctx.beginPath();ctx.moveTo(o.x,o.y);ctx.arc(o.x,o.y,o.len,o.a-o.arc/2,o.a+o.arc/2);ctx.closePath();ctx.fill();}
      else if(o.k==='col'){ctx.fillRect(o.x-o.w/2,o.y,o.w,o.y2-o.y);}
      else if(o.k==='arc'){ctx.strokeStyle=c;ctx.lineWidth=o.w*a;ctx.beginPath();ctx.arc(o.x,o.y,o.r,o.a-o.arc/2,o.a+o.arc/2);ctx.stroke();ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.stroke();}
      ctx.globalAlpha=1;continue;}
    const charge=k>.6,blink=charge&&Math.sin(t*40)>0,A=(hard?.75:1);
    if(o.k==='line'){const w=2+(o.w-2)*Math.pow(k,1.6);ctx.lineCap='round';
      if(!charge){ctx.setLineDash([10,8]);ctx.lineDashOffset=-t*60;ctx.strokeStyle=rgba90('#ffffff',(.25+.35*k)*A);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(o.x,o.y);ctx.lineTo(o.x2,o.y2);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;}
      ctx.strokeStyle=rgba90('#ffffff',(.35+.5*k)*A);ctx.lineWidth=w+3;ctx.beginPath();ctx.moveTo(o.x,o.y);ctx.lineTo(o.x2,o.y2);ctx.globalAlpha=charge?.9:.4;ctx.stroke();
      ctx.strokeStyle=c;ctx.lineWidth=w;ctx.globalAlpha=(.25+.6*k)*A;ctx.stroke();ctx.globalAlpha=1;ctx.lineCap='butt';}
    else if(o.k==='zone'||o.k==='drop'){ctx.strokeStyle=rgba90(c,(.35+.5*k)*A);ctx.lineWidth=blink?2.5:1.5;ctx.setLineDash(k<.6?[6,6]:[]);ctx.beginPath();ctx.arc(o.x,o.y,o.r,0,TAU);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle=rgba90(c,(o.k==='drop'?.18:.22)*A);ctx.beginPath();ctx.arc(o.x,o.y,o.r*k,0,TAU);ctx.fill();
      if(o.k==='drop'){const h=(1-k)*160;ctx.fillStyle=rgba90(c,.75*A);ctx.beginPath();ctx.ellipse(o.x,o.y-h,4,7+6*k,0,0,TAU);ctx.fill();}}
    else if(o.k==='cone'){ctx.fillStyle=rgba90(c,(.08+.22*k)*A);ctx.beginPath();ctx.moveTo(o.x,o.y);ctx.arc(o.x,o.y,o.len*(.3+.7*k),o.a-o.arc/2,o.a+o.arc/2);ctx.closePath();ctx.fill();
      ctx.strokeStyle=rgba90(blink?'#ffffff':c,(.4+.5*k)*A);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(o.x,o.y);ctx.arc(o.x,o.y,o.len,o.a-o.arc/2,o.a+o.arc/2);ctx.closePath();ctx.stroke();}
    else if(o.k==='col'){ctx.fillStyle=rgba90(c,(.06+.22*k)*A);ctx.fillRect(o.x-o.w/2*k,o.y,o.w*k,o.y2-o.y);ctx.strokeStyle=rgba90(c,(.35+.5*k)*A);ctx.setLineDash([6,6]);ctx.strokeRect(o.x-o.w/2,o.y,o.w,o.y2-o.y);ctx.setLineDash([]);}
    else if(o.k==='arc'){ctx.strokeStyle=rgba90(c,(.12+.3*k)*A);ctx.lineWidth=o.w;ctx.beginPath();ctx.arc(o.x,o.y,o.r,o.a-o.arc/2,o.a+o.arc/2);ctx.stroke();
      ctx.strokeStyle=rgba90(blink?'#ffffff':c,(.45+.5*k)*A);ctx.lineWidth=2;ctx.beginPath();ctx.arc(o.x,o.y,o.r-o.w/2,o.a-o.arc/2,o.a+o.arc/2);ctx.stroke();ctx.beginPath();ctx.arc(o.x,o.y,o.r+o.w/2,o.a-o.arc/2,o.a+o.arc/2);ctx.stroke();
      const e0=o.a-o.arc/2+o.arc*k;ctx.fillStyle='#ffffff';ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(o.x+Math.cos(e0)*o.r,o.y+Math.sin(e0)*o.r,4,0,TAU);ctx.fill();ctx.globalAlpha=1;}}}
// --- волны (кольца) с проходами: клапаны, ганглий, тени боссов ---
function wvList95(){const X=G.x90;return X&&inMission()?(X.wv95||(X.wv95=[])):(G.wwv95||(G.wwv95=[]));}
function wv95(o){const L=wvList95();Object.assign(o,{r:o.r||8,hit:false});L.push(o);if(L.length>24)L.shift();return o;}
function wvTick95(dt){const L=wvList95();if(!L.length)return;const p=G.player;
  for(const w of L){const r0=w.r;w.r+=w.v*dt;if(w.hit||!p||p.hp<=0)continue;const d=Math.hypot(p.x-w.x,p.y-w.y);if(d+p.r*.55<r0-(w.w||10)/2||d-p.r*.55>w.r+(w.w||10)/2)continue;
    if(w.gaps){const a=Math.atan2(p.y-w.y,p.x-w.x);if(w.gaps.some(g=>Math.abs(angDiff(a,g.a))<g.w/2))continue;}if(p.dashT>0)continue;w.hit=true;damagePlayer(w.dmg||10);}
  for(let i=L.length-1;i>=0;i--)if(L[i].r>=(L[i].R||Math.hypot(W,H)))L.splice(i,1);}
function wvDraw95(t){for(const w of wvList95()){const a=clamp(1-w.r/(w.R||900),.15,1);
    // кольцо и его светлая кромка рисуются только по сплошным дугам — проходы остаются честно пустыми
    const P=new Path2D();if(w.gaps&&w.gaps.length){const G2=w.gaps.slice().sort((a_,c)=>a_.a-c.a);for(let i=0;i<G2.length;i++){const a0=G2[i].a+G2[i].w/2,n=G2[(i+1)%G2.length],a1=n.a-n.w/2+(i===G2.length-1?TAU:0);P.moveTo(w.x+Math.cos(a0)*w.r,w.y+Math.sin(a0)*w.r);P.arc(w.x,w.y,w.r,a0,a1>a0?a1:a1+TAU);}}
    else P.arc(w.x,w.y,w.r,0,TAU);
    ctx.strokeStyle=rgba90(w.col||C90.ark,.6*a);ctx.lineWidth=w.w||10;ctx.stroke(P);ctx.lineWidth=1.5;ctx.strokeStyle=rgba90('#ffffff',.5*a);ctx.stroke(P);}}
// стрелки проходов за такт до волны
function gapArrows95(x,y,R,gaps,k,col){for(const g of gaps){const ux=Math.cos(g.a),uy=Math.sin(g.a);ctx.save();ctx.translate(x+ux*R,y+uy*R);ctx.rotate(g.a);ctx.globalAlpha=.4+.5*k;ctx.fillStyle=col||'#ffffff';
    ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(-4,-9);ctx.lineTo(0,0);ctx.lineTo(-4,9);ctx.closePath();ctx.fill();ctx.restore();}ctx.globalAlpha=1;}
// --- уязвимое окно ✦ и неуязвимый момент ⬡ ---
function weak95(e,dur,k){if(!e||!e.alive)return;const was=e.weak95>0;e.weak95=Math.max(e.weak95||0,dur);e.weakK95=k||1.5;if(!was){snd95('weak',e.x);}}
function weakK95(e){return e.weak95>0?(e.weakK95||1.5):1;}
function markDraw95(e,t){if(e.weak95>0){const y=-e.r-16-3*Math.sin(t*6),a=Math.min(1,e.weak95*3);ctx.save();ctx.globalAlpha=a;ctx.translate(0,y);ctx.rotate(Math.PI/4);ctx.fillStyle='#ffffff';ctx.fillRect(-4.5,-4.5,9,9);ctx.strokeStyle='#04060c';ctx.lineWidth=1.5;ctx.strokeRect(-4.5,-4.5,9,9);ctx.restore();
    ctx.globalAlpha=a*.5;ctx.strokeStyle='#ffffff';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,e.r+5+2*Math.sin(t*10),0,TAU);ctx.stroke();ctx.globalAlpha=1;}
  if(e.inv95>0){ctx.strokeStyle=C95.shield;ctx.globalAlpha=.75;ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=6;i++){const a=i/6*TAU+Math.PI/6;const x=Math.cos(a)*(e.r+7),y=Math.sin(a)*(e.r+7);if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);}ctx.stroke();ctx.globalAlpha=1;}}
// --- метки «ЦЕЛЬ» (Смотритель) и «ВИДЕН» (маяк): враги рядом стреляют на 15% чаще ---
function mark95(kind,T){const m=G.mark95;if(m&&m.t>0&&m.kind===kind){m.t=Math.max(m.t,T);return;}G.mark95={kind,t:T,t0:T};snd95('mark');}
function markTick95(dt){const m=G.mark95;if(!m)return;m.t-=dt;if(m.t<=0){G.mark95=null;return;}const p=G.player;if(!p)return;
  for(const e of G.enemies){if(!e.alive||e.spawnT>0||STATIC.has(e.type)||EDEF[e.type].passive||e.sbk||EDEF[e.type].sbp)continue;if(Math.hypot(e.x-p.x,e.y-p.y)<450&&e.cd>0)e.cd-=dt*.15;}}
function markPlayerDraw95(t){const m=G.mark95,p=G.player;if(!m||!p||p.hp<=0)return;const a=Math.min(1,m.t*2),c=m.kind==='ВИДЕН'?C90.sh:'#ffe9b0',r=26+2*Math.sin(t*8);ctx.strokeStyle=c;ctx.globalAlpha=.7*a;ctx.lineWidth=1.5;
  for(let i=0;i<4;i++){const q=t*1.5+i*Math.PI/2;ctx.beginPath();ctx.arc(p.x,p.y,r,q,q+.6);ctx.stroke();}ctx.globalAlpha=a;const age=(m.t0||0)-m.t;if(age<.35){const z=1+.7*(1-age/.35);ctx.save();ctx.translate(p.x,p.y-r-8);ctx.scale(z,z);worldLabel(0,0,m.kind,c);ctx.restore();}else worldLabel(p.x,p.y-r-8,m.kind,c);ctx.globalAlpha=1;}
// --- стоп-кадр по тирам: обычный 30 мс, элита 50, слабая точка босса 70, смена фазы 250 ---
function hsKill95(e){if(!on95())return;if(e.affix||e.elite95)hs90(.05,0);else hs90(.03,0);}
function hsWeak95(){hs90(.07,0);}
// --- замедление времени (последний шанс, табличка первой встречи, смерть элиты) ---
function slow95(T,k){const s=G.slow95;if(s&&s.t>0&&s.k<=k){s.t=Math.max(s.t,T);return;}G.slow95={t:T,k};}
// --- очередь плавающих надписей: не больше двух сразу, одинаковые склеиваются «×3», справка — не чаще раза в 4 с ---
function fqOn95(){return on95()&&(G.state==='play'||G.state==='levelup');}
function fqPrio95(text,col){const s=String(text);if(/[!−]|ТРЕВОГ|ПРИЛИВ|ЛОПНЕТ|ЗАМЕЧЕН|ЦЕЛЬ|ВИДЕН|ВЗОРВ|БРОСОК|ЗАЖАЛО|ПОД ОГН|ПОГИБ|ПОТЕРЯН/.test(s)||col===C90.red||col==='#ff4f6e')return 2;if(/\+|ОБРЫВОК|ЛОМА|ТАЙНИК|ПРОСНУЛ|ДОЛЕТЕЛ|ЖЕТОН/.test(s))return 1;return 0;}
{const f0=floater;floater=function(x,y,text,col){if(!fqOn95())return f0(x,y,text,col);const Q=G.fq95||(G.fq95={q:[],last:{}}),s=String(text);
    for(const f of G.float){if(f.base95===s&&f.life>.25){f.n95=(f.n95||1)+1;f.text=s+' ×'+f.n95;f.life=Math.max(f.life,1.1);return;}}
    for(const q of Q.q)if(q.text===s){q.n=(q.n||1)+1;q.t=G.t;return;}
    const pr=fqPrio95(s,col);if(pr===0&&Q.last[s]!==undefined&&G.t-Q.last[s]<4)return;Q.last[s]=G.t;
    const act=G.float.filter(f=>f.q95&&f.life>.35).length;if(act<2||pr===2&&act<3){f0(x,y,s,col);const f=G.float[G.float.length-1];if(f&&f.text===s){f.q95=1;f.base95=s;}return;}
    Q.q.push({x,y,text:s,col,pr,t:G.t,n:1});Q.q.sort((a,b)=>b.pr-a.pr||a.t-b.t);if(Q.q.length>6)Q.q.length=6;};}
function fqTick95(){const Q=G.fq95;if(!Q||!Q.q.length)return;if(!fqOn95()){Q.q=[];return;}Q.q=Q.q.filter(q=>q.pr===2?G.t-q.t<2.5:G.t-q.t<3.2);
  const act=G.float.filter(f=>f.q95&&f.life>.35).length;if(act>=2||!Q.q.length)return;const q=Q.q.shift();const s=q.n>1?q.text+' ×'+q.n:q.text;const p=G.player;
  const n0=G.float.length;(function(){const F=G.float;if(F.length>24)F.shift();F.push({x:clamp(q.x,CX+60,CX+W-60),y:clamp(q.y,CY+30,CY+H-20),text:s,col:q.col,life:1.3,q95:1,base95:q.text});})();}
// --- последний шанс: первый смертельный удар за миссию оставляет 1 ОЗ («Лёгкая» и «Средняя») ---
function lc95(p){if(!on95()||rk90()>=2||(devAny()&&G.dev.god))return false;const X=G.x90;if(X.lc95)return false;X.lc95=1;p.hp=1;p.inv=1.4;slow95(.8,.3);trauma90(.45);hs90(.12,1);
  floater(p.x,p.y-44,'ПОСЛЕДНИЙ ШАНС','#ffffff');snd95('last');if(G.shock.length<60)G.shock.push({x:p.x,y:p.y,r:10,R:200,t:0,col:'#ffffff',slow:true});G.hurtV=1;return true;}
// контактный урон только через 0,6 с после появления
function cg95(e){return e.cg95>G.t;}
// --- частицы и эффекты: «Меньше эффектов» ---
function fxN95(n){return Math.max(1,Math.round(n*(SET.lessFx?.5:1)*(G.lowFx?.5:1)*(isMob()?.6:1)));}
// глифы — частицы-буквы сектора X
const GLYPH95='АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ';
function glyph95(x,y,n,col,vis){const X=G.x90;const L=X&&inMission()?(X.gl95||(X.gl95=[])):(G.wgl95||(G.wgl95=[]));const gR=vis?vR3:vR5,gRnd=vis?vrnd3:vrnd5;/* ARCH·71: vis — вызов под SET.fx (A-16), иначе A-18 */n=fxN95(n);for(let i=0;i<n;i++){if(L.length>60)L.shift();const a=gRnd(0,TAU),v=gRnd(30,120);L.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-30,life:gRnd(.6,1.2),max:1.2,ch:GLYPH95[gR()*GLYPH95.length|0],col:col||C90.sh,rot:gRnd(-1,1)});}}
function glTick95(dt){for(const L of [G.x90&&G.x90.gl95,G.wgl95]){if(!L||!L.length)continue;for(const q of L){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=Math.pow(.3,dt);q.vy*=Math.pow(.3,dt);q.life-=dt;}for(let i=L.length-1;i>=0;i--)if(L[i].life<=0)L.splice(i,1);}}
// кэш спрайтов букв: буквы-частицы и снаряды-слова рисуются картинкой, а не текстом каждый кадр
const GLC95=new Map();
function glyphSpr95(ch,px,col,sh){const S=DPR*SC>2.2?3:2,key=ch+'|'+px+'|'+col+'|'+(sh?1:0)+'|'+S;let c=GLC95.get(key);if(c)return c;const sz=Math.ceil((px*1.4+6)*S);c=document.createElement('canvas');c.width=c.height=sz;const g=c.getContext('2d');g.setTransform(S,0,0,S,0,0);g.font='700 '+px+'px "JetBrains Mono",monospace';g.textAlign='center';g.textBaseline='middle';const m=sz/S/2;if(sh){g.fillStyle='#04060c';g.fillText(ch,m+1,m+1);}g.fillStyle=col;g.fillText(ch,m,m);
  if(GLC95.size>500)GLC95.clear();GLC95.set(key,c);return c;}
// шрифт догрузился — перерисуем кэши букв и обломков (до этого живём с запасным шрифтом, но без пересоздания холстов каждый кадр)
if(document.fonts&&document.fonts.addEventListener)document.fonts.addEventListener('loadingdone',()=>{GLC95.clear();if(typeof PIL95C!=='undefined')PIL95C.clear();});
function glyphDraw95(ch,x,y,px,col,sh,rot){const c=glyphSpr95(ch,px,col,sh),s=c.width/(DPR*SC>2.2?3:2);if(rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.drawImage(c,-s/2,-s/2,s,s);ctx.restore();}else ctx.drawImage(c,x-s/2,y-s/2,s,s);}
function glDraw95(){const L=G.world?G.wgl95:G.x90&&G.x90.gl95;if(!L||!L.length)return;
  const mob=isMob();for(const q of L){ctx.globalAlpha=clamp(q.life/q.max,0,1);glyphDraw95(q.ch,q.x,q.y,11,q.col,false,mob?0:q.rot*(1-q.life));}ctx.globalAlpha=1;}
// гибель врага в секторах IX–X: кровь или буквы; элита — кольцо света и замедление
function death95(e,silent){if(silent||!on95()&&!(G.world&&secW95()>=0))return;if(G.world&&secW95()===8&&!EDEF[e.type].passive)W95.kills.push(G.t);const d=EDEF[e.type];if(!d||d.passive||d.sbp||e.sbk)return;const sec=G.world?secW95():G.x90.sec;
  if(sec===8&&SET.fx){const n=fxN95(10);for(let i=0;i<n;i++){const a=vrnd3(0,TAU),v=vrnd3(60,220);part(e.x,e.y,Math.cos(a)*v,Math.sin(a)*v,vrnd3(.3,.7),i%3?C90.blood:C95.bloodD,vrnd3(2,3.5));}}
  if(sec===9)glyph95(e.x,e.y,6,e.mem100?'#a8b4b0':d.col);if(sec>=10)spark110(e);
  if(e.affix||e.elite95){slow95(.3,.4);if(G.shock.length<60)G.shock.push({x:e.x,y:e.y,r:e.r,R:150,t:0,col:'#ffffff',slow:true});snd95('elite');}
  hsKill95(e);}
// --- кэш спрайтов градиентов (X16): лужи, темнота, виньетки ---
const RG95={};
function rg95(col,a0,a1,mid){const key=col+'|'+a0+'|'+a1+'|'+(mid||'');if(RG95[key])return RG95[key];const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);
  gr.addColorStop(0,rgba90(col,a0));if(mid)gr.addColorStop(mid[0],rgba90(col,mid[1]));gr.addColorStop(1,rgba90(col,a1));g.fillStyle=gr;g.fillRect(0,0,128,128);return RG95[key]=c;}
function rgDraw95(x,y,r,col,a0,a1,mid){ctx.drawImage(rg95(col,a0,a1,mid),x-r,y-r,r*2,r*2);}
// экранная виньетка: прозрачный центр → цвет по краю (кэш 256×256 на цвет)
const VIG95={};
function vig95(col,a,inner){const key=col+'|'+(inner||.3);let c=VIG95[key];if(!c){c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d'),gr=g.createRadialGradient(128,128,128*(inner||.3)*1.4,128,128,182);gr.addColorStop(0,rgba90(col,0));gr.addColorStop(1,rgba90(col,1));g.fillStyle=gr;g.fillRect(0,0,256,256);VIG95[key]=c;}
  // на ПК — копия в точном размере экрана: блит 1:1 без масштабирования заметно дешевле (кэш на 3 виньетки)
  const px=cv.width*cv.height;if(px<=2.3e6){const k2=key+'|'+cv.width+'x'+cv.height;let F=VIG95F.get(k2);if(!F){F=document.createElement('canvas');F.width=cv.width;F.height=cv.height;F.getContext('2d').drawImage(c,0,0,cv.width,cv.height);if(VIG95F.size>=3)VIG95F.delete(VIG95F.keys().next().value);VIG95F.set(k2,F);}c=F;}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=clamp(a,0,1);ctx.drawImage(c,0,0,cv.width,cv.height);ctx.restore();}
const VIG95F=new Map();
// --- свои снаряды: слова, огни, иглы, тельца, чернила, символы ---
function eb95(x,y,a,spd,dmg,col,r,k,ex){const b=shootE(x,y,a,spd,dmg,col,r);if(b){b.k95=k;if(ex)Object.assign(b,ex);}return b;}
function eb95Draw(b,t){const k=b.k95;
  if(k==='word'||k==='sym'){glyphDraw95(b.ch||'·',b.x,b.y,k==='word'?15:13,b.frz95>0?'#ffffff':b.col,true,0);return;}
  if(k==='fire'){const a=Math.atan2(b.vy,b.vx);ctx.save();ctx.translate(b.x,b.y);ctx.rotate(a);ctx.fillStyle=rgba90(C95.hom,.35);ctx.beginPath();ctx.moveTo(-18,0);ctx.lineTo(0,-5);ctx.lineTo(0,5);ctx.closePath();ctx.fill();
    ctx.fillStyle=C95.hom;ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fill();ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(1.5,0,2.6,0,TAU);ctx.fill();ctx.fillStyle='#04060c';ctx.beginPath();ctx.arc(2.4,0,1.2,0,TAU);ctx.fill();ctx.strokeStyle='#04060c';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.stroke();ctx.restore();return;}
  if(k==='needle'){const a=Math.atan2(b.vy,b.vx);ctx.save();ctx.translate(b.x,b.y);ctx.rotate(a);ctx.fillStyle=b.col;ctx.strokeStyle='#04060c';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(9,0);ctx.lineTo(-7,-2.2);ctx.lineTo(-7,2.2);ctx.closePath();ctx.stroke();ctx.fill();ctx.restore();return;}
  if(k==='cell'){ctx.fillStyle='#04060c';ctx.beginPath();ctx.arc(b.x,b.y,b.r+1.5,0,TAU);ctx.fill();ctx.fillStyle=b.col;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,TAU);ctx.fill();ctx.fillStyle=rgba90('#3a0a12',.8);ctx.beginPath();ctx.arc(b.x,b.y,b.r*.45,0,TAU);ctx.fill();return;}
  if(k==='ink'){ctx.fillStyle=C95.ink;ctx.strokeStyle=b.col;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,TAU);ctx.fill();ctx.stroke();return;}
  ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(b.x,b.y,Math.max(b.r*.55,BMIN),0,TAU);ctx.fill();ctx.strokeStyle='#04060c';ctx.lineWidth=1.5/SC;ctx.stroke();}
// снаряды, которые можно сбить: огни маяков, капли — проверка пулями игрока
function shoot95(bu){if(!G.eb.length)return false;for(const b of G.eb){if(!b.shoot95||b.life<=0)continue;if(segDist(bu.px,bu.py,bu.x,bu.y,b.x,b.y)<(b.r||6)+4){b.life=0;if(SET.fx)for(let i=0;i<fxN95(6);i++){const a=vrnd3(0,TAU);part(b.x,b.y,Math.cos(a)*120,Math.sin(a)*120,.3,b.col,2);}snd95('pop',b.x);if(!bu.charged){if(bu.pierce-->0)return false;bu.life=0;return true;}return false;}}return false;}
// эффекты снарядов: замедление от игл, заморозка «правки»
function ebTick95(dt){for(const b of G.eb){if(b.frz95>0){b.frz95-=dt;if(b.frz95<=0&&b.rv95){const p=G.player,a=Math.atan2(p.y-b.y,p.x-b.x),s=Math.max(200,Math.hypot(b.vx0||b.vx,b.vy0||b.vy));b.vx=Math.cos(a)*s;b.vy=Math.sin(a)*s;b.rv95=0;}else{b.x-=b.vx*dt;b.y-=b.vy*dt;b.life+=dt;}}
    if(b.hold95>0){b.hold95-=dt;b.x-=b.vx*dt;b.y-=b.vy*dt;b.life+=dt;if(b.hold95<=0&&b.go95)b.go95(b);}}
  if(G.slowP95>0){G.slowP95-=dt;}}
// --- замедление корабля (иглы Смотрителя, лужи) ---
function slowP95(p,dt){if(G.slowP95>0&&p.dashT<=0){p.x=p.px+(p.x-p.px)*.75;p.y=p.py+(p.y-p.py)*.75;}}
// --- стрелки за краем экрана для заряжающихся врагов и телеграфов ---
function edgeArrows95(t){if(!G.arena)return;const p=G.player;if(!p)return;const items=[];
  for(const e of G.enemies){if(!e.alive||e.spawnT>0||!(e.charging||e.tl95>0||e.weak95>0))continue;if(e.x>CX-10&&e.x<CX+VW+10&&e.y>CY-10&&e.y<CY+VH+10)continue;items.push([e.x,e.y,e.weak95>0?'#ffffff':EDEF[e.type].col,e.weak95>0?0:1]);}
  for(const o of tgList95()){if(o.st!=='warn')continue;const x=o.k==='line'?(o.x+o.x2)/2:o.x,y=o.k==='line'?(o.y+o.y2)/2:o.y;if(x>CX&&x<CX+VW&&y>CY&&y<CY+VH)continue;items.push([x,y,o.col,clamp(o.t/o.T,0,1)]);}
  if(!items.length)return;
  // стрелки — в «безопасной» рамке: ниже верхнего HUD, выше кнопок и стика на телефоне; на телефоне в CSS-пикселях и крупнее
  const mob=isMob(),por=isPortrait(),S=mob?1:SC,kk=mob?SC:1,vw=mob?CW:VW,vh=mob?CH:VH,L0=16,R0=vw-16,T0=mob?(por?122:66):88,B0=vh-(mob?(por?226:52):64),sz=mob?1.35:1;
  ctx.save();ctx.setTransform(DPR*S,0,0,DPR*S,0,0);const cx=(L0+R0)/2,cy=(T0+B0)/2;
  for(const [x,y,c,k] of items.slice(0,10)){const sx=(x-CX)*kk,sy=(y-CY)*kk,dx=sx-cx,dy=sy-cy;const s=Math.min((R0-cx)/Math.abs(dx||1e-6),(B0-cy)/Math.abs(dy||1e-6));const ax=cx+dx*s,ay=cy+dy*s,a=Math.atan2(dy,dx);
    ctx.save();ctx.translate(ax,ay);ctx.rotate(a);ctx.scale(sz,sz);ctx.globalAlpha=.55+.45*Math.abs(Math.sin(t*(6+k*14)));ctx.fillStyle=c;ctx.strokeStyle='#04060c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-7,-8);ctx.lineTo(-3,0);ctx.lineTo(-7,8);ctx.closePath();ctx.stroke();ctx.fill();ctx.restore();}
  ctx.restore();}
// --- микшер: одновременно не больше 6 звуков врагов ---
const VOX95=[];
function vox95(dur,prio){const now=AU.ctx?AU.ctx.currentTime:0;for(let i=VOX95.length-1;i>=0;i--)if(VOX95[i]<now)VOX95.splice(i,1);if(!prio&&VOX95.length>=6)return false;VOX95.push(now+Math.min(1.5,dur||.3));return true;}
// --- общий буфер белого шума (X17) ---
let NB95=null;
function noiseBuf95(c){if(NB95&&NB95.sampleRate===c.sampleRate)return NB95;const len=c.sampleRate*2|0;NB95=c.createBuffer(1,len,c.sampleRate);const d=NB95.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;return NB95;}
// --- звуки 0.9.5 ---
const SND95={};
const SND95P=new Set(['last','weak','perfect95','combo','launch2','phase95','plaque95','secret','chest','eyeOpen','stun','mark','choir','choirX','flood','kill95']);
function snd95(kind,x){if(!AU.ctx||!SET.sfx||!AU.sfx)return;const c=AU.ctx,t=c.currentTime;const now=performance.now();if(SND95[kind]&&now-SND95[kind]<70)return;SND95[kind]=now;
  if(!vox95(.4,SND95P.has(kind)))return;
  const pan=x===undefined||!isFinite(x)?0:clamp(((x-CX)/(VW||W))*2-1,-.6,.6);
  const out=()=>{if(pan&&c.createStereoPanner){const q=c.createStereoPanner();q.pan.value=pan;q.connect(AU.sfx);return q;}return AU.sfx;};
  const tone=(f0,f1,dur,type,vol,delay)=>{delay=delay||0;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f0,t+delay);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+delay+dur);g.gain.setValueAtTime(.0001,t+delay);g.gain.linearRampToValueAtTime(vol,t+delay+.01);g.gain.exponentialRampToValueAtTime(.0001,t+delay+dur);o.connect(g);g.connect(out());o.start(t+delay);o.stop(t+delay+dur+.03);};
  const noise=(dur,vol,f,type,delay,f2,q)=>{delay=delay||0;const s=c.createBufferSource();s.buffer=noiseBuf95(c);const fl=c.createBiquadFilter();fl.type=type||'lowpass';if(q)fl.Q.value=q;fl.frequency.setValueAtTime(f,t+delay);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+delay+dur);const g=c.createGain();g.gain.setValueAtTime(vol,t+delay);g.gain.linearRampToValueAtTime(.0001,t+delay+dur);s.connect(fl);fl.connect(g);g.connect(out());s.start(t+delay,Math.random()*1.4,dur+.05);};
  switch(kind){
    case 'tlLine':tone(420,1100,.45,'sine',.035);break;
    case 'tlZone':noise(.5,.08,3000,'highpass',0,6000);break;
    case 'tlCone':tone(300,600,.35,'triangle',.04);break;
    case 'tlDash':noise(.35,.07,1200,'bandpass',0,3500,2);break;
    case 'tlRing':tone(120,90,.25,'sine',.12);break;
    case 'weak':tone(1760,1760,.18,'sine',.05);tone(2637,2637,.22,'sine',.03,.04);break;
    case 'mark':tone(980,980,.08,'square',.03);tone(1320,1320,.1,'square',.03,.08);break;
    case 'last':tone(220,880,.6,'sine',.09);noise(.6,.2,800,'lowpass',0,4000);break;
    case 'pop':tone(900,300,.1,'square',.03);break;
    case 'elite':tone(660,1320,.5,'triangle',.05);noise(.5,.18,2000,'bandpass',0,600);break;
    case 'kill95':noise(.18,.12,900,'bandpass',0,300);break;
    case 'leap':noise(.3,.1,500,'lowpass',0,1200);tone(160,90,.3,'sine',.08);break;
    case 'land':tone(90,40,.3,'sine',.25);noise(.25,.2,300,'lowpass',0,80);break;
    case 'spit':noise(.15,.12,1600,'bandpass',0,500);break;
    case 'spot':tone(700,1600,.5,'sawtooth',.03);break;
    case 'flash':noise(.25,.25,5000,'highpass',0,1500);tone(1800,600,.25,'square',.03);break;
    case 'needle':tone(2400,1800,.08,'square',.025);break;
    case 'lash':noise(.25,.22,2500,'bandpass',0,400,3);break;
    case 'impulse':tone(1500,2200,.12,'sine',.04);break;
    case 'zap':noise(.2,.15,4000,'highpass');tone(880,440,.15,'square',.03);break;
    case 'silhouette':tone(300,280,.8,'sine',.04);break;
    case 'streak':noise(.5,.11,3000,'highpass',0,800);tone(1200,300,.4,'sawtooth',.018);break;
    case 'zig':noise(.12,.12,2200,'bandpass',0,900,2);break;
    case 'glitch':for(let i=0;i<4;i++)tone(rnd(300,1600),rnd(300,1600),.05,'square',.025,i*.05);break;
    case 'beam':tone(110,220,1,'sawtooth',.05);noise(1,.12,800,'bandpass',0,3000);break;
    case 'beamFire':noise(.4,.35,1200,'lowpass',0,200);tone(220,60,.45,'sawtooth',.08);break;
    case 'sign':for(let i=0;i<5;i++)tone(600+i*80,600+i*80,.08,'triangle',.025,i*.04);break;
    case 'hop':tone(300,600,.15,'sine',.05);break;
    case 'splat':noise(.3,.2,700,'lowpass',0,200);break;
    case 'write':for(let i=0;i<6;i++)noise(.04,.08,5000,'highpass',i*.09);break;
    case 'fling':tone(500,1500,.25,'triangle',.04);break;
    case 'tongue':noise(.8,.08,300,'lowpass',0,900);break;
    case 'pilotDash':noise(.2,.15,2000,'bandpass',0,600);break;
    case 'pilotPulse':tone(300,120,.4,'sine',.12);noise(.3,.2,1500,'lowpass',0,300);break;
    case 'boom95':noise(.4,.35,900,'lowpass',0,120);tone(140,50,.35,'sine',.18);break;
    case 'inflate':tone(200,700,.5,'sine',.05);break;
    case 'bash':noise(.25,.3,600,'lowpass',0,150);tone(160,60,.25,'square',.06);break;
    case 'shieldHit':tone(1200,900,.06,'square',.02);break;
    case 'squeeze':tone(90,60,.4,'sine',.12);break;
    case 'perfect95':tone(784,784,.25,'sine',.07);tone(1175,1175,.22,'sine',.05,.02);tone(1568,1568,.2,'sine',.03,.04);break;
    case 'combo':for(let i=0;i<4;i++)tone(880*Math.pow(2,[0,4,7,12][i]/12),880*Math.pow(2,[0,4,7,12][i]/12),.25,'triangle',.04,i*.05);break;
    case 'whip':noise(.3,.3,3500,'bandpass',0,500,4);tone(400,80,.3,'sawtooth',.05);break;
    case 'rain':noise(.25,.12,1000,'bandpass',0,400);break;
    case 'shove':tone(70,40,.5,'sine',.3);noise(.4,.25,300,'lowpass',0,60);break;
    case 'fib':for(let i=0;i<5;i++)tone(80,60,.08,'sine',.12,i*.12);break;
    case 'flood':noise(1.2,.15,200,'lowpass',0,600);break;
    case 'launch2':for(const iv of [0,7,12,16,19])tone(196*Math.pow(2,iv/12),196*Math.pow(2,iv/12),1.6,'triangle',.05,iv*.012);noise(1.2,.25,500,'lowpass',0,4000);break;
    case 'phase95':tone(110,55,1.2,'sine',.2);noise(1,.2,400,'lowpass',0,3000);break;
    case 'tears':noise(1,.09,5000,'highpass',0,1200);tone(880,440,1,'sine',.026);break;
    case 'inhale95':noise(1.6,.2,400,'bandpass',0,4000,1.5);break;
    case 'speech':for(let i=0;i<4;i++)tone(220*Math.pow(2,[0,3,5,7][i]/12),220*Math.pow(2,[0,3,5,7][i]/12),.18,'sawtooth',.03,i*.07);break;
    case 'eyeOpen':tone(1320,1980,.4,'sine',.05);break;
    case 'stun':tone(660,110,.6,'triangle',.07);noise(.4,.2,3000,'highpass',0,500);break;
    case 'search':tone(1500,1400,.25,'sine',.02);break;
    case 'signal':for(let i=0;i<3;i++)tone(1046,1046,.09,'square',.025,i*.11);break;
    case 'rewrite':for(let i=0;i<6;i++)tone(rnd(400,1200),rnd(400,1200),.06,'triangle',.03,i*.06);break;
    case 'hands':noise(1.2,.2,600,'bandpass',0,200,2);break;
    case 'choirX':noise(.6,.15,2000,'bandpass',0,300);tone(523,262,1,'sine',.05);break;
    case 'shade':tone(110,330,.9,'sawtooth',.035);noise(.8,.1,700,'bandpass',0,2000);break;
    case 'crumble95':for(let i=0;i<10;i++)noise(.08,.12,1500+i*300,'bandpass',i*.06);break;
    case 'plaque95':tone(1046,1046,.08,'sine',.04);tone(1568,1568,.14,'sine',.03,.07);break;
    case 'secret':for(let i=0;i<4;i++)tone(1318*Math.pow(2,[0,4,7,12][i]/12),1318*Math.pow(2,[0,4,7,12][i]/12),.4,'sine',.035,i*.07);break;
    case 'chest':tone(523,1046,.3,'triangle',.05);tone(784,1568,.3,'triangle',.04,.08);break;
    case 'event':tone(220,220,.6,'sawtooth',.04);tone(330,330,.6,'sawtooth',.03,.1);noise(.8,.12,600,'bandpass',0,1800);break;
    case 'pore':noise(.3,.08,400,'bandpass',0,900,2);break;
    case 'fade95':noise(.5,.06,6000,'highpass',0,2000);break;
    case 'pillar':noise(.35,.25,500,'lowpass',0,100);tone(200,60,.3,'triangle',.05);break;}}

