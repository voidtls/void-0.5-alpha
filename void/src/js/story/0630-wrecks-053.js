// ---------- мир: обломки, фрагменты, эрозия ----------
// ---------- 0.5.3: обломки — разбитые корпуса VØID и чужие корабли ----------
const HULL_NUM={base:'013',falcon:'004',manta:'006',prism:'009',reaper:'011',halo:'002',comet:'007',hornet:'005',obsidian:'010',sail:'003',pulsar:'012'};
const DMG_NAME=['','подбит','пробит','выгорел','разорван','стёрт'];
const SEC_DMG=[1,1,2,2,3,3,4,4,5,5,5];
// * — запись «в трюме» (автор не VØID), # — номер на борту стёрт
const WRECK_P={2:'base*',3:'base*',6:'base*',8:'base*',10:'base',14:'base*',16:'falcon*',18:'pulsar',19:'hornet',20:'prism',22:'base',30:'manta',31:'falcon',34:'obsidian',35:'reaper*',
  39:'sail',40:'prism',44:'base#',45:'reaper',47:'halo',48:'obsidian',51:'hornet',53:'comet',54:'base',55:'pulsar',56:'comet',57:'base#',59:'halo',60:'reaper',61:'sail',62:'manta',63:'base'};
const WRECK_O={1:['transport','','гражданский транспорт'],4:['station','buoy','пограничный буй'],5:['station','ring','сегмент кольца станции'],7:['barge','','архивная баржа'],9:['barge','guard','шасси Гвардии во льду'],
  11:['tug','','колониальный тягач'],12:['tug','robot','ремонтный автомат'],13:['shell','','раковина чужого вида'],15:['flagship','','флагман'],
  17:['blueprint','cruiser','чертёж крейсера'],21:['blueprint','liner','чертёж лайнера'],23:['blueprint','guard','чертёж Гвардии'],24:['blueprint','scout','чертёж исследовательского катера'],
  25:['cradle','frame','рама конвейера'],26:['cradle','guard','шасси Стража'],27:['cradle','shuttle','челнок'],28:['cradle','bureau','челнок бюро «Предел»'],29:['cradle','guardShot','шасси Гвардии · выстрел в ядро'],
  32:['cradle','guard','шасси Гвардии'],33:['cradle','stand','испытательный стенд'],
  36:['ark','drone','сервисный дрон'],37:['ark','console','пульт-модуль'],38:['ark','pod','капсула сохранения'],41:['ark','consoleP','личная капсула-пульт'],42:['ark','pod','капсула сохранения'],43:['ark','console','пульт-модуль'],
  46:['erased','transport','транспорт'],49:['erased','scout','исследовательский катер'],50:['erased','liner','лайнер'],52:['erased','tug','колониальный тягач'],58:['proto','','прототип-кольцо']};
const WCLS={transport:{sz:1.2,st:'лёгкое'},station:{sz:1.6,st:'разлом по стыку'},barge:{sz:1.8,st:'замёрзший'},tug:{sz:1.5,st:'коррозия'},shell:{sz:2,st:'расколотая скорлупа'},
  flagship:{sz:3.2,st:'тяжёлое боевое'},blueprint:{sz:1.8,st:'недостроен'},cradle:{sz:1.6,st:'разобран'},ark:{sz:1.4,st:'«выпит»'},erased:{sz:1.6,st:'стёрт'},proto:{sz:2.4,st:'осколки света'}};
const WSIZE={4:1.3,9:1.4,12:1.2,25:1.8,26:2,27:1.4,28:1.4,29:1.5,32:1.5,33:1.8,36:1.2,37:1.5,38:1.3,41:1.4,42:1.3,43:1.5,52:2};
function wreckSpec(j){if(j._spec)return j._spec;let s;
  if(j.rift)s={own:'player',skin:SKINS[j.skin]?j.skin:'base',hull:'013',dmg:5,rift:1,size:1};
  else if(WRECK_P[j.n]){const v=WRECK_P[j.n],skin=v.replace(/[*#]/g,'');s={own:'player',skin,hull:v.includes('#')?'':HULL_NUM[skin],hold:v.includes('*'),dmg:SEC_DMG[j.sec]||3,size:1};}
  else{const o=WRECK_O[j.n]||['transport','','обломок'];s={own:'other',cls:o[0],variant:o[1],nm:o[2],size:WSIZE[j.n]||WCLS[o[0]].sz,st:WCLS[o[0]].st};}
  try{Object.defineProperty(j,'_spec',{value:s,enumerable:false,configurable:true});}catch(e){}return s;}
function wreckR(j){const s=wreckSpec(j);return s.own==='player'?110:Math.min(200,110*s.size);}
function hullLine(j){const s=wreckSpec(j);
  if(s.own==='player'){const nm=SKINS[s.skin].name;if(!s.hull)return 'Корпус: VØID · номер стёрт · '+DMG_NAME[s.dmg];
    return (s.hold?'Найдено в трюме VØID-'+s.hull:'Корпус: VØID-'+s.hull)+' · '+nm+' · '+DMG_NAME[s.dmg];}
  return 'Обломок: '+s.nm+' · '+s.st;}

// --- рисунки чужих кораблей (единицы корабля игрока, нос по +x, радиус ≤ 24) ---
function wPoly(g,p){g.beginPath();g.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)g.lineTo(p[i][0],p[i][1]);g.closePath();}
function wFS(g,f,s,lw){g.fillStyle=f;g.fill();if(s){g.strokeStyle=s;g.lineWidth=lw||1.2;g.stroke();}}
const W_SHAPES={
  transport(g){g.fillStyle='#141a24';g.strokeStyle='#7a8ea5';g.lineWidth=1;g.fillRect(-19,-4,5,8);g.strokeRect(-19,-4,5,8);
    for(const y of [-12.5,5.5]){g.fillStyle='#232c3a';g.fillRect(-12,y,15,7);g.strokeStyle='#7a8ea5';g.strokeRect(-12,y,15,7);g.strokeStyle='#4a5a70';g.lineWidth=.8;g.beginPath();for(let i=1;i<4;i++){g.moveTo(-12+i*3.75,y);g.lineTo(-12+i*3.75,y+7);}g.stroke();g.lineWidth=1;}
    wPoly(g,[[-14,-5],[8,-5],[12,-3],[12,3],[8,5],[-14,5]]);wFS(g,'#1a2433','#9fb4c8',1.4);
    g.beginPath();g.arc(12,0,4.5,-1.4,1.4);g.closePath();wFS(g,'#2a4a60','#cfe6ff',1);
    g.fillStyle='#ffd23d';for(const [x,y] of [[-11,-11.5],[-11,11.5],[1.5,-11.5],[1.5,11.5]])g.fillRect(x-.9,y-.9,1.8,1.8);return {cock:[12,0]};},
  ring(g,R){const cx=-6;g.beginPath();g.arc(cx,0,22,-1.05,1.05);g.arc(cx,0,14,1.05,-1.05,true);g.closePath();wFS(g,'#1c2028','#dfe6ee',1.3);
    g.strokeStyle='#dfe6ee';g.lineWidth=1.6;g.beginPath();for(const a of [-.35,.35]){g.moveTo(cx+Math.cos(a)*14,Math.sin(a)*14);g.lineTo(cx+Math.cos(a)*22,Math.sin(a)*22);}g.stroke();
    for(let a=-.95;a<=.96;a+=.12){g.fillStyle=R()<.65?'#ffcf7a':'#3a4558';g.fillRect(cx+Math.cos(a)*18-.8,Math.sin(a)*18-.8,1.6,1.6);}
    return {light:[cx+Math.cos(-.75)*22,Math.sin(-.75)*22],ctr:[cx,0],joints:[-.35,.35]};},
  buoy(g){wPoly(g,[[-17,-3],[-12,-7],[-12,7],[-17,3]]);wFS(g,'#14181e','#9fb4c8',1);
    wPoly(g,[[-12,-5],[6,-5],[9,-3],[9,3],[6,5],[-12,5]]);wFS(g,'#1c2028','#dfe6ee',1.3);
    g.strokeStyle='rgba(255,184,77,.8)';g.lineWidth=1.5;g.beginPath();g.moveTo(-6,-5);g.lineTo(-6,5);g.moveTo(0,-5);g.lineTo(0,5);g.stroke();
    g.strokeStyle='#dfe6ee';g.lineWidth=1;g.beginPath();g.moveTo(9,0);g.lineTo(19,0);g.moveTo(19,-4);g.quadraticCurveTo(22,0,19,4);g.stroke();return {light:[19.5,0]};},
  barge(g){g.fillStyle='#10161e';g.fillRect(-24,-3.5,2.5,7);
    wPoly(g,[[-22,-6],[14,-6],[20,-2],[20,2],[14,6],[-22,6]]);wFS(g,'#141c26','#bfe0ff',1.2);
    g.strokeStyle='rgba(107,184,255,.7)';g.lineWidth=.7;for(let i=0;i<8;i++)for(const y of [-4.6,.6])g.strokeRect(-20.5+i*4.25,y,3.4,4);
    wPoly(g,[[12,-6],[15,-9.5],[19,-9.5],[17,-6]]);wFS(g,'#1a2430','#bfe0ff',1);return {};},
  guard(g){g.beginPath();for(let i=0;i<6;i++){const a=i/6*TAU;g.lineTo(Math.cos(a)*18,Math.sin(a)*18);}g.closePath();wFS(g,'#2a1a10','#ffb84d',1.8);
    g.beginPath();for(let i=0;i<6;i++){const a=i/6*TAU;g.lineTo(Math.cos(a)*9,Math.sin(a)*9);}g.closePath();g.strokeStyle='#ffb84d';g.lineWidth=1.2;g.stroke();
    g.strokeStyle='rgba(255,184,77,.45)';g.lineWidth=.8;g.beginPath();for(let i=0;i<6;i++){const a=i/6*TAU;g.moveTo(Math.cos(a)*9,Math.sin(a)*9);g.lineTo(Math.cos(a)*18,Math.sin(a)*18);}g.stroke();
    g.fillStyle='#ffb84d';g.beginPath();g.arc(0,0,3,0,TAU);g.fill();return {core:[0,0]};},
  tug(g){g.fillStyle='#1a120a';for(const y of [-7,3])g.fillRect(-18,y,4,4);
    wPoly(g,[[-14,-10],[4,-10],[4,10],[-14,10]]);wFS(g,'#24160c','#c96a2a',1.4);
    g.strokeStyle='rgba(201,106,42,.55)';g.lineWidth=.7;g.beginPath();g.moveTo(-8,-10);g.lineTo(-8,10);g.moveTo(-2,-10);g.lineTo(-2,10);g.moveTo(-14,0);g.lineTo(4,0);g.stroke();
    g.fillStyle='#e08a4a';for(let x=-13;x<4;x+=3)for(const y of [-9,9])g.fillRect(x-.4,y-.4,.8,.8);
    g.strokeStyle='#c96a2a';g.lineWidth=1.2;g.beginPath();g.moveTo(4,-6);g.lineTo(19,-6);g.moveTo(4,6);g.lineTo(19,6);for(let x=4;x<19;x+=3){g.moveTo(x,-6);g.lineTo(x+3,6);}g.stroke();
    g.fillStyle='#2e1c0e';g.fillRect(18,-8,3,16);g.strokeRect(18,-8,3,16);return {};},
  robot(g){g.strokeStyle='#c96a2a';g.lineWidth=1.6;g.beginPath();for(const s of [-1,1]){g.moveTo(7,s*5);g.lineTo(13,s*9);g.lineTo(19,s*6);g.moveTo(19,s*6);g.lineTo(21,s*8);g.moveTo(19,s*6);g.lineTo(21,s*4);}g.stroke();
    wPoly(g,[[-9,-8],[7,-8],[7,8],[-9,8]]);wFS(g,'#24160c','#c96a2a',1.4);
    g.fillStyle='#1a120a';g.fillRect(-13,-9,4,18);g.strokeRect(-13,-9,4,18);
    g.fillStyle='#ffb84d';g.beginPath();g.arc(3,0,2,0,TAU);g.fill();g.fillStyle='#e08a4a';for(const [x,y] of [[-7,-6],[5,-6],[-7,6],[5,6]])g.fillRect(x-.5,y-.5,1,1);return {};},
  shell(g){const P=[];for(let th=0;th<=11.3;th+=.14){const r=2.2*Math.exp(.205*th);P.push([r*Math.cos(th),r*Math.sin(th)]);}
    wPoly(g,P);const gr=g.createRadialGradient(0,0,1,0,0,22);gr.addColorStop(0,'#3a2a3a');gr.addColorStop(1,'#1e1622');g.fillStyle=gr;g.fill();
    g.strokeStyle='#f0d8e8';g.lineWidth=1.1;g.beginPath();P.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();
    g.strokeStyle='rgba(201,166,200,.6)';g.lineWidth=.7;g.beginPath();for(let th=6.3;th<=11.3;th+=.5){const r1=2.2*Math.exp(.205*(th-TAU)),r2=2.2*Math.exp(.205*th);g.moveTo(r1*Math.cos(th),r1*Math.sin(th));g.lineTo(r2*Math.cos(th),r2*Math.sin(th));}g.stroke();return {ctr:[0,0]};},
  cruiser(g){g.fillStyle='#3a4558';for(const y of [-6,-1,4])g.fillRect(-23.5,y,2.5,2);
    wPoly(g,[[22,0],[8,-6],[-6,-11],[-18,-10],[-21,-5],[-21,5],[-18,10],[-6,11],[8,6]]);wFS(g,'#10151c','#8a9ab0',1);
    g.strokeStyle='rgba(138,154,176,.5)';g.lineWidth=.6;g.beginPath();g.moveTo(18,0);g.lineTo(-18,0);g.moveTo(-6,-11);g.lineTo(-6,11);g.stroke();
    g.fillStyle='#1a222c';g.fillRect(-13,-3,7,6);g.strokeStyle='#8a9ab0';g.lineWidth=.8;g.strokeRect(-13,-3,7,6);
    for(const [x,y] of [[8,0],[-1,-5.5],[-1,5.5]]){g.beginPath();g.arc(x,y,2.1,0,TAU);wFS(g,'#202a36','#a8b8cc',.7);g.beginPath();g.moveTo(x+1.5,y);g.lineTo(x+5,y);g.stroke();}
    g.strokeStyle='#ff4f6e';g.lineWidth=1.1;g.beginPath();g.moveTo(-17,-8.7);g.lineTo(-10,-9.6);g.moveTo(-17,8.7);g.lineTo(-10,9.6);g.moveTo(14,-2.3);g.lineTo(17,-1.2);g.stroke();return {};},
  liner(g){for(const s of [-1,1]){wPoly(g,[[-14,s*5],[-20,s*10],[-22,s*9],[-19,s*4]]);wFS(g,'#141a22','#9fb4c8',.9);}
    wPoly(g,[[18,0],[14,-5],[-16,-5],[-20,-3],[-20,3],[-16,5],[14,5]]);wFS(g,'#161c26','#dfe6ee',1.2);
    g.fillStyle='#ffe6a3';for(let x=-14;x<12;x+=2.6)for(const y of [-2.5,2.5])g.fillRect(x,y-.5,1.3,1);return {};},
  scout(g){wPoly(g,[[20,0],[4,-4],[-12,-5],[-16,-9],[-18,-8],[-15,-3],[-18,0],[-15,3],[-18,8],[-16,9],[-12,5],[4,4]]);wFS(g,'#141a24','#cfe6ff',1.2);
    g.strokeStyle='#cfe6ff';g.lineWidth=.8;g.beginPath();g.moveTo(-4,-4.5);g.lineTo(-8,-12);g.stroke();g.fillStyle='#8fe9ff';g.beginPath();g.arc(9,0,1.8,0,TAU);g.fill();return {};},
  frame(g){g.strokeStyle='#ffb84d';g.lineWidth=2;g.beginPath();g.moveTo(-22,-12);g.lineTo(22,-12);g.moveTo(-22,12);g.lineTo(22,12);g.stroke();
    g.lineWidth=.9;g.strokeStyle='rgba(255,184,77,.6)';g.beginPath();for(let x=-20;x<=20;x+=5){g.moveTo(x,-12);g.lineTo(x,12);}g.stroke();
    g.beginPath();for(let i=0;i<=4;i++){const a=i/6*TAU-1;g.lineTo(Math.cos(a)*9,Math.sin(a)*9);}g.strokeStyle='#ffd27a';g.lineWidth=1.4;g.stroke();
    g.fillStyle='#ffb84d';for(const x of [-14,14])for(const y of [-12,12])g.fillRect(x-1.5,y-2,3,4);return {};},
  stand(g){g.strokeStyle='#dfe6ee';g.lineWidth=1.3;g.strokeRect(-15,-13,30,26);g.lineWidth=.7;g.beginPath();g.moveTo(-15,-13);g.lineTo(15,13);g.moveTo(15,-13);g.lineTo(-15,13);g.stroke();
    g.beginPath();g.ellipse(0,0,8,4.5,0,0,TAU);wFS(g,'#e8eef4','#ffffff',1);g.fillStyle='#ffb84d';for(const s of [-1,1])g.fillRect(s*8-1,-1.5,2,3);return {};},
  shuttle(g,R,o){wPoly(g,[[18,0],[12,-4],[-14,-4],[-17,-2],[-17,2],[-14,4],[12,4]]);wFS(g,'#161c24','#dfe6ee',1.2);
    const lab=o&&o.bureau;wPoly(g,[[-10,-4],[-10,-9],[3,-9],[5,-4]]);wFS(g,lab?'#e8eef4':'#20262e',lab?'#ffffff':'#9fb4c8',1);
    g.fillStyle=lab?'#6bb8ff':'#8fe9ff';for(let x=-8;x<2;x+=3)g.fillRect(x,-7.5,1.6,1.6);
    if(lab){g.fillStyle='#ffb84d';g.beginPath();g.moveTo(8,-1.5);g.lineTo(11,0);g.lineTo(8,1.5);g.fill();}return {};},
  drone(g){g.strokeStyle='#ffd27a';g.lineWidth=1.3;g.beginPath();for(const [x,y] of [[10,10],[10,-10],[-10,10],[-10,-10]]){g.moveTo(0,0);g.lineTo(x,y);}g.stroke();
    for(const [x,y] of [[10,10],[10,-10],[-10,10],[-10,-10]]){g.beginPath();g.arc(x,y,4,0,TAU);g.strokeStyle='rgba(255,210,122,.7)';g.lineWidth=1;g.stroke();}
    g.beginPath();g.arc(0,0,6.5,0,TAU);wFS(g,'#1e1a10','#ffd27a',1.3);g.beginPath();g.arc(1.5,0,2.8,0,TAU);wFS(g,'#4a3a1a','#fff2c9',.8);return {win:[1.5,0,2.8]};},
  console(g){wPoly(g,[[-12,-8],[12,-8],[12,8],[-12,8]]);wFS(g,'#1e1a10','#ffd27a',1.3);
    g.fillStyle='#4a3a1a';g.fillRect(-8,-6,16,5);g.strokeStyle='#fff2c9';g.lineWidth=.7;g.strokeRect(-8,-6,16,5);
    for(let i=0;i<6;i++)for(let r=0;r<2;r++){g.fillStyle=(i+r)%3?'#3a3020':'#ffe6a3';g.fillRect(-10+i*3.6,1+r*3,2.4,2);}return {win:[0,-3.5,6]};},
  consoleP(g){wPoly(g,[[-21,-6],[-9,-6],[-9,6],[-21,6]]);wFS(g,'#1e1a10','#ffd27a',1.1);
    for(let i=0;i<3;i++){g.fillStyle=i%2?'#3a3020':'#ffe6a3';g.fillRect(-19+i*3.4,2,2.2,2);}
    g.beginPath();g.ellipse(4,0,13,7,0,0,TAU);wFS(g,'#1e1a10','#ffd27a',1.3);g.beginPath();g.ellipse(4,0,7.5,3.8,0,0,TAU);wFS(g,'#4a3a1a','#fff2c9',.9);return {win:[4,0,7]};},
  pod(g){g.fillStyle='#2a2414';for(const s of [-1,1])g.fillRect(s*16-(s>0?0:3),-3,3,6);
    g.beginPath();g.ellipse(0,0,16,8,0,0,TAU);wFS(g,'#1e1a10','#ffd27a',1.3);g.beginPath();g.ellipse(0,0,9,4.5,0,0,TAU);wFS(g,'#4a3a1a','#fff2c9',.9);
    g.strokeStyle='rgba(255,210,122,.5)';g.lineWidth=.6;g.beginPath();g.moveTo(-12,-5);g.lineTo(-12,5);g.moveTo(12,-5);g.lineTo(12,5);g.stroke();return {win:[0,0,8]};}
};
function wShapeKey(s){const v=s.variant;
  if(s.cls==='station')return v==='buoy'?'buoy':'ring';if(s.cls==='barge')return v==='guard'?'guard':'barge';if(s.cls==='tug')return v==='robot'?'robot':'tug';
  if(s.cls==='flagship')return 'cruiser';if(s.cls==='blueprint'||s.cls==='erased')return v||'transport';
  if(s.cls==='cradle')return v==='guardShot'?'guard':v==='bureau'?'shuttle':v;if(s.cls==='ark')return v;return s.cls;}

// --- примитивы повреждений (координаты холста, px) ---
function wkCv(w,h,rd){const c=document.createElement('canvas');c.width=Math.max(1,w);c.height=Math.max(1,h||w);c._g=c.getContext('2d',rd?{willReadFrequently:true}:undefined);return c;}
function wkScan(g,S){const im=g.getImageData(0,0,S,S),d=im.data,pts=[],edge=[];let x0=S,y0=S,x1=0,y1=0,cnt=0;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){if(d[(y*S+x)*4+3]>24){cnt++;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}}
  for(let y=3;y<S-3;y+=3)for(let x=3;x<S-3;x+=3){const a=d[(y*S+x)*4+3];if(a<90)continue;pts.push([x,y]);
    if(d[(y*S+x-3)*4+3]<20||d[(y*S+x+3)*4+3]<20||d[((y-3)*S+x)*4+3]<20||d[((y+3)*S+x)*4+3]<20)edge.push([x,y]);}
  return {pts,edge,bb:cnt?[x0,y0,x1+1,y1+1]:[0,0,1,1],cnt,im};}
const wkPick=(a,R)=>a.length?a[Math.floor(R()*a.length)]:[0,0];
const wkRng=(R,a,b)=>a+R()*(b-a);
const wkInt=(R,v)=>Array.isArray(v)?v[0]+Math.floor(R()*(v[1]-v[0]+1)):(v||0);
function wkDark(g,S,a,col){g.globalCompositeOperation='source-atop';g.fillStyle=col||`rgba(4,6,12,${a})`;g.fillRect(0,0,S,S);g.globalCompositeOperation='source-over';}
function wkDarkIn(g,base,S,a,er){const m=wkCv(S);m._g.drawImage(base,0,0);const e=wkCv(S),r=e._g;r.drawImage(base,0,0);r.globalCompositeOperation='destination-in';
  for(const [dx,dy] of [[er,0],[-er,0],[0,er],[0,-er]])r.drawImage(m,dx,dy);r.globalCompositeOperation='source-in';r.fillStyle=`rgba(4,6,12,${a})`;r.fillRect(0,0,S,S);g.drawImage(e,0,0);}
function wkBurns(g,sc,R,n,r0,r1){g.globalCompositeOperation='source-atop';for(let i=0;i<n;i++){const [x,y]=wkPick(sc.pts,R),r=wkRng(R,r0,r1),gr=g.createRadialGradient(x,y,0,x,y,r);
  gr.addColorStop(0,'rgba(0,0,0,.9)');gr.addColorStop(.6,'rgba(10,6,4,.5)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);}g.globalCompositeOperation='source-over';}
function wkJag(R,x,y,r,n){const p=[];for(let i=0;i<n;i++){const a=i/n*TAU,q=r*(.55+R()*.6);p.push([x+Math.cos(a)*q,y+Math.sin(a)*q]);}return p;}
function wkHoles(g,sc,R,n,r0,r1,rim,rimW){const hs=[];for(let i=0;i<n;i++){const [x,y]=wkPick(sc.pts,R),p=wkJag(R,x,y,wkRng(R,r0,r1),7+Math.floor(R()*4));hs.push(p);
    g.globalCompositeOperation='destination-out';wPoly(g,p);g.fillStyle='#000';g.fill();
    if(rim){g.globalCompositeOperation='source-atop';wPoly(g,p);g.strokeStyle=rim;g.lineWidth=rimW||2;g.stroke();}}
  g.globalCompositeOperation='source-over';return hs;}
function wkCracks(g,sc,R,n,col,lw,len,blur){g.globalCompositeOperation=col?'source-atop':'destination-out';g.strokeStyle=col||'#000';g.lineCap='round';
  if(blur&&col){g.shadowColor=col;g.shadowBlur=blur;}
  for(let i=0;i<n;i++){let [x,y]=wkPick(sc.pts,R),a=R()*TAU;const L=wkRng(R,len*.5,len);g.lineWidth=lw*(.7+R()*.6);g.beginPath();g.moveTo(x,y);
    for(let s=0;s<5;s++){a+=(R()-.5)*1.1;x+=Math.cos(a)*L/5;y+=Math.sin(a)*L/5;g.lineTo(x,y);
      if(R()<.25){const b=a+(R()<.5?1:-1)*(.6+R()*.6);g.lineTo(x+Math.cos(b)*L/6,y+Math.sin(b)*L/6);g.moveTo(x,y);}}g.stroke();}
  g.shadowBlur=0;g.globalCompositeOperation='source-over';}
function wkGrid(g,base,sc,R,n,r0,r1){const S=base.width,mask=wkCv(S);mask._g.drawImage(base,0,0);
  for(let i=0;i<n;i++){const [x,y]=wkPick(sc.pts,R),r=wkRng(R,r0,r1);
    g.globalCompositeOperation='destination-out';g.beginPath();g.arc(x,y,r,0,TAU);g.fillStyle='#000';g.fill();
    const t=wkCv(S),q=t._g;q.save();q.beginPath();q.arc(x,y,r,0,TAU);q.clip();q.strokeStyle='#4a5870';q.lineWidth=1.2;q.beginPath();
    for(let k=-r;k<=r;k+=4.5){q.moveTo(x+k,y-r);q.lineTo(x+k,y+r);q.moveTo(x-r,y+k);q.lineTo(x+r,y+k);}q.stroke();q.restore();
    q.globalCompositeOperation='destination-in';q.drawImage(mask,0,0);g.globalCompositeOperation='source-over';g.drawImage(t,0,0);}
  g.globalCompositeOperation='source-over';}
function wkEraseEdge(g,sc,R,n,r0,r1,C){const e=sc.edge.slice().sort((a,b)=>Math.hypot(b[0]-C,b[1]-C)-Math.hypot(a[0]-C,a[1]-C)),top=e.slice(0,Math.max(1,Math.floor(e.length*.45)));
  g.globalCompositeOperation='destination-out';for(let i=0;i<n;i++){const [x,y]=wkPick(top,R),r=wkRng(R,r0,r1),gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.7,'rgba(0,0,0,.8)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);}
  g.globalCompositeOperation='source-over';}
function wkNoise(g,S,C,seed,pmax,desat,rmax){const im=g.getImageData(0,0,S,S),d=im.data;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){const o=(y*S+x)*4;if(!d[o+3])continue;
    const dd=Math.hypot(x-C,y-C)/rmax,q=dd<.3?0:Math.min(1,Math.pow((dd-.3)/.7,1.2))*pmax;
    let h=Math.imul((x>>1)*73856093^(y>>1)*19349663^seed,0x45d9f3b);h^=h>>>16;h=Math.imul(h,0x45d9f3b);h^=h>>>16;
    if((h>>>0)/4294967296<q){d[o+3]=0;continue;}
    if(desat){const l=d[o]*.3+d[o+1]*.59+d[o+2]*.11;d[o]=d[o]+(l-d[o])*desat;d[o+1]=d[o+1]+(l-d[o+1])*desat;d[o+2]=d[o+2]+(l-d[o+2])*desat;}}
  g.putImageData(im,0,0);}
function wkFrost(g,sc,R,n){g.strokeStyle='rgba(232,246,255,.9)';g.lineWidth=.9;g.beginPath();
  for(let i=0;i<n;i++){const [x,y]=wkPick(sc.edge,R),L=wkRng(R,2,4.5),a0=R()*TAU;for(let k=0;k<3;k++){const a=a0+k*TAU/3;g.moveTo(x,y);g.lineTo(x+Math.cos(a)*L,y+Math.sin(a)*L);}}g.stroke();}
function wkRust(g,sc,R,n,C){g.globalCompositeOperation='source-atop';const dir=Math.PI/2+(R()-.5)*.6;
  for(let i=0;i<n;i++){const [x,y]=wkPick(sc.pts,R),L=wkRng(R,6,18);g.strokeStyle=`rgba(${120+Math.floor(R()*50)},${50+Math.floor(R()*20)},18,.55)`;g.lineWidth=wkRng(R,1,2.2);g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(dir)*L,y+Math.sin(dir)*L);g.stroke();}
  g.globalCompositeOperation='source-over';
  for(let i=0;i<4;i++){const [x,y]=wkPick(sc.edge,R),a=Math.atan2(y-C,x-C)+(R()-.5)*.8,L=wkRng(R,5,9);
    g.beginPath();g.moveTo(x+Math.cos(a+1.6)*3,y+Math.sin(a+1.6)*3);g.lineTo(x+Math.cos(a)*L,y+Math.sin(a)*L);g.lineTo(x+Math.cos(a-1.6)*3,y+Math.sin(a-1.6)*3);g.closePath();
    g.fillStyle='#3a2010';g.fill();g.strokeStyle='#c96a2a';g.lineWidth=1;g.stroke();}}
// контур по маске (для чертежа и стёртых)
function wkOutline(src,S,col,w){const o=wkCv(S),q=o._g;for(const [dx,dy] of [[-w,0],[w,0],[0,-w],[0,w],[-w,-w],[w,w],[w,-w],[-w,w]])q.drawImage(src,dx,dy);
  q.globalCompositeOperation='source-in';q.fillStyle=col;q.fillRect(0,0,S,S);q.globalCompositeOperation='destination-out';q.drawImage(src,0,0);q.globalCompositeOperation='source-over';return o;}

// --- нарезка ---
function wkWedges(cx,cy,ang,S){const out=[];for(let i=0;i<ang.length;i++){const a1=ang[i],a2=i+1<ang.length?ang[i+1]:ang[0]+TAU,p=[[cx,cy]],st=Math.max(2,Math.ceil((a2-a1)/(Math.PI/4)));
  for(let k=0;k<=st;k++){const a=a1+(a2-a1)*k/st;p.push([cx+Math.cos(a)*S*1.5,cy+Math.sin(a)*S*1.5]);}out.push(p);}return out;}
// полосы между линиями разреза; ось x (поперёк корпуса) или y; jag — изломанность
function wkStrips(S,cuts,R,jag,tilt,horiz){const lines=[[[-S,-S],[-S,2*S]]];
  for(const c of cuts){const L=[],tl=(R()-.5)*(tilt||0),n=jag?9:1;for(let k=0;k<=n;k++){const v=-S*.2+S*1.4*k/n;L.push([c+tl*(v-S/2)+(jag&&k&&k<n?(R()-.5)*jag:0),v]);}lines.push(L);}
  lines.push([[2*S,-S],[2*S,2*S]]);const out=[];
  for(let i=0;i<lines.length-1;i++){const p=lines[i].concat(lines[i+1].slice().reverse());out.push(horiz?p.map(([a,b])=>[b,a]):p);}return out;}
function wkPip(p,x,y){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const [xi,yi]=p[i],[xj,yj]=p[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c;}return c;}
function wkCut(base,S,polys,bb,mot){const C=S/2,out=[];
  polys.forEach((p,i)=>{let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const [x,y] of p){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
    x0=Math.max(Math.floor(x0),bb[0]-1);y0=Math.max(Math.floor(y0),bb[1]-1);x1=Math.min(Math.ceil(x1),bb[2]+1);y1=Math.min(Math.ceil(y1),bb[3]+1);if(x1-x0<2||y1-y0<2)return;
    const c=wkCv(x1-x0,y1-y0),q=c._g;q.translate(-x0,-y0);wPoly(q,p);q.clip();q.drawImage(base,0,0);
    const m=mot(i,p)||{};out.push({c,poly:p,ox:x0-C,oy:y0-C,px:(x0+x1)/2-C,py:(y0+y1)/2-C,dx:m.dx||0,dy:m.dy||0,rot:m.rot||0,dr:m.dr||0,ph:m.ph||0,per:m.per||3});});
  return out;}

// --- сборка обломка ---
const WRECK_SPR={},WRK={n:0,frame:0,budget:1,ms:[],icons:{}};
function wreckSprite(j,force){const id=j.id,c=WRECK_SPR[id];if(c){c.use=WRK.frame;return c;}
  if(!force){if(WRK.budget<=0)return null;WRK.budget--;}
  const t0=performance.now();let s;try{s=wkBuild(j);}catch(e){console.error(e);s={pieces:[],col:'#8fe9ff',bits:[],base:0,sz:1,rv:40,fx:{},spec:wreckSpec(j)};}
  s.ms=performance.now()-t0;WRK.ms.push(s.ms);if(WRK.ms.length>200)WRK.ms.shift();s.use=WRK.frame;WRECK_SPR[id]=s;WRK.n++;
  const keys=Object.keys(WRECK_SPR);if(keys.length>28){keys.sort((a,b)=>WRECK_SPR[a].use-WRECK_SPR[b].use);for(const k of keys.slice(0,keys.length-28))if(WRECK_SPR[k].use<WRK.frame-1)delete WRECK_SPR[k];}
  return s;}
function wkBuild(j){const sp=wreckSpec(j),R=mulberry(j.n*7919+(j.rift?101:3)),k=2.6*(sp.size||1),S=Math.ceil(52*k+24),C=S/2;
  const base=wkCv(S,S,true),g=base._g,fx={},o={pieces:[],bits:[],base:R()*TAU,sz:sp.size||1,fx,spec:sp,S};
  let info={};g.setTransform(k,0,0,k,C,C);
  if(sp.own==='player'){const oc=ctx,og=glow,of=flameTri;ctx=g;glow=()=>{};flameTri=()=>{};try{drawShip(sp.skin,0,0,{});}finally{ctx=oc;glow=og;flameTri=of;}}
  else if(sp.cls!=='proto'){const key=wShapeKey(sp);info=(W_SHAPES[key]||W_SHAPES.transport)(g,R,{bureau:sp.variant==='bureau'})||{};}
  g.setTransform(1,0,0,1,0,0);g.lineCap='butt';
  const P=(x,y)=>[C+x*k,C+y*k];let sc=sp.cls==='proto'?{pts:[[C,C]],edge:[[C,C]],bb:[C-1,C-1,C+1,C+1]}:wkScan(g,S);
  const mot=(f)=>f;let polys,motion;
  if(sp.own==='player'){const L=sp.dmg,col=SKINS[sp.skin].col;o.col=sp.rift?'#ff4f6e':col;
    const Q=[null,{np:2,sp:[6,10],rot:.25,dr:.01,burn:2,dark:.35,hole:0,bits:3},{np:3,sp:[10,18],rot:.45,dr:.015,burn:[3,4],dark:.45,hole:[2,3],bits:5},
      {np:[3,4],sp:[14,22],rot:.6,dr:.02,burn:[3,4],dark:.6,hole:[1,2],crack:[4,6],grid:2,bits:7},{np:4,sp:[20,34],rot:.9,dr:.06,burn:3,dark:.6,hole:2,crack:[3,5],grid:2,erase:1,bits:[12,16]},
      {np:[4,5],sp:[26,42],rot:.9,dr:.03,burn:1,dark:.5,hole:1,crack:[2,3],noise:.42,desat:.45,bits:6}][L];
    const cnt0=sc.cnt;wkDarkIn(g,base,S,Q.dark,2.5);wkBurns(g,sc,R,wkInt(R,Q.burn),6,14);
    if(Q.hole)wkHoles(g,sc,R,wkInt(R,Q.hole),3,6,L>=3?null:'rgba(255,140,60,.8)',1.4);
    if(Q.crack)wkCracks(g,sc,R,wkInt(R,Q.crack),col,1.6,26,6);
    if(Q.grid)wkGrid(g,base,sc,R,Q.grid,7,11);
    if(Q.erase)wkEraseEdge(g,sc,R,5,7,12,C);
    if(Q.noise){const rm=Math.max(...sc.edge.map(([x,y])=>Math.hypot(x-C,y-C)),20);wkNoise(g,S,C,j.n*131+7,Q.noise,Q.desat,rm);}
    if(sp.rift){wkDark(g,S,0,'rgba(255,40,70,.18)');}
    sc=wkScan(g,S);o.keep=sc.cnt/cnt0;
    // разрез: центр к корме, носовой клин — первый и самый большой
    const np=wkInt(R,Q.np),h=wkRng(R,.95,1.2),cx=C-5*k,cy=C+(R()-.5)*6,ang=[h];
    for(let i=1;i<np-1;i++)ang.push(h+(TAU-2*h)*i/(np-1)+(R()-.5)*.35);if(np>1)ang.push(TAU-h);
    polys=np>1?wkWedges(cx,cy,ang,S):[[[0,0],[S,0],[S,S],[0,S]]];if(np>1)polys.unshift(polys.pop());
    motion=(i,p)=>{const nose=i===0;let mx=0,my=0;for(const q of p.slice(1)){mx+=q[0];my+=q[1];}mx=mx/(p.length-1)-cx;my=my/(p.length-1)-cy;const l=Math.hypot(mx,my)||1,d=wkRng(R,Q.sp[0],Q.sp[1])*(nose?.3:1);
      return {dx:mx/l*d,dy:my/l*d,rot:(R()-.5)*2*Q.rot*(nose?.3:1),dr:(R()-.5)*2*Q.dr*(nose?.3:1),ph:R()*3,per:2+R()*2};};
    o.pieces=wkCut(base,S,polys,sc.bb,motion);
    if(L<=2){const ex=C-10*k,ey=C;fx.ember={x:ex-C,y:ey-C,pi:o.pieces.findIndex(p=>wkPip(p.poly,ex,ey))};}
    fx.spark=[0,.006,.01,.012,.02,0][L];if(L===5){fx.glitch=1;fx.noisePx=1;}if(sp.rift)fx.red=1;
    o.bits=wkBits(R,wkInt(R,Q.bits),k,['#3a4558','#3a4558',col]);}
  else{const cls=sp.cls;o.col={transport:'#9fb4c8',station:'#ffcf7a',barge:'#bfe0ff',tug:'#c96a2a',shell:'#ffc2ec',flagship:'#ff4f6e',blueprint:'#6bb8ff',cradle:'#ffb84d',ark:'#ffd27a',erased:'#9fffe0',proto:'#ffffff'}[cls];
    const all=[[[0,0],[S,0],[S,S],[0,S]]],bb=sc.bb,bw=bb[2]-bb[0];let nb=4,bcol=['#3a4558','#4a5870'];
    if(cls==='transport'){wkDark(g,S,.35);wkBurns(g,sc,R,2,6,12);const [qx,qy]=P(12,0);g.globalCompositeOperation='destination-out';g.strokeStyle='#000';g.lineWidth=1.2;g.beginPath();for(let i=0;i<4;i++){const a=R()*TAU;g.moveTo(qx,qy);g.lineTo(qx+Math.cos(a)*3.5*k,qy+Math.sin(a)*3.5*k);}g.stroke();g.globalCompositeOperation='source-over';
      polys=wkStrips(S,[C-5.3*k],R,0,0,true);const up=R()<.5;motion=(i)=>((i===0)===up?{dx:wkRng(R,-5,5),dy:(i===0?-1:1)*wkRng(R,10,16),rot:(R()-.5)*.7,dr:(R()-.5)*.03}:{rot:(R()-.5)*.1});
      if(!up)polys=wkStrips(S,[C+5.3*k],R,0,0,true);}
    else if(cls==='station'){wkDark(g,S,.3);wkBurns(g,sc,R,2,6,12);wkHoles(g,sc,R,1,3,5);
      if(info.joints){const [cx,cy]=P(info.ctr[0],info.ctr[1]);polys=wkWedges(cx,cy,[-.35,.35,Math.PI],S);motion=(i,p)=>{const a=i===0?0:i===1?.75:-.75,d=wkRng(R,6,12);return {dx:Math.cos(a)*d,dy:Math.sin(a)*d,rot:(R()-.5)*.35,dr:(R()-.5)*.02};};}
      else{polys=wkStrips(S,[C+wkRng(R,-2,2)*k],R,4,.3);motion=i=>({dx:(i?1:-1)*wkRng(R,6,10),dy:wkRng(R,-3,3),rot:(R()-.5)*.6,dr:(R()-.5)*.02});}
      if(info.light){const [lx,ly]=P(info.light[0],info.light[1]);fx.beacon={x:lx-C,y:ly-C,ph:R()*2};}fx.spark=.004;}
    else if(cls==='barge'){wkDark(g,S,.3);wkDark(g,S,0,'rgba(170,220,255,.18)');wkCracks(g,sc,R,10,'rgba(232,246,255,.85)',.8,22);wkCracks(g,sc,R,3,null,.9,18);wkFrost(g,sc,R,26);
      polys=sp.variant==='guard'?wkWedges(C,C,[.3+R(),3.2+R()],S):wkStrips(S,[C-8*k,C+6*k],R,3,.25);motion=()=>({dx:wkRng(R,-3,3),dy:wkRng(R,-3,3),rot:(R()-.5)*.08});
      if(sp.variant!=='guard'){const ps=polys;motion=(i)=>({dx:(i-1)*wkRng(R,3,5),dy:wkRng(R,-1.5,1.5),rot:(R()-.5)*.06});}bcol=['#bfe0ff','#e8f6ff'];}
    else if(cls==='tug'){wkDark(g,S,.3);wkDark(g,S,0,'rgba(150,70,20,.22)');wkHoles(g,sc,R,wkInt(R,[3,5]),3,7,'#c96a2a',2);wkRust(g,sc,R,9,C);
      polys=wkStrips(S,[sp.variant==='robot'?C+7.5*k:C+wkRng(R,-4,0)*k],R,6,.3);motion=i=>({dx:(i?1:-1)*wkRng(R,8,14),dy:wkRng(R,-5,5),rot:(R()-.5)*.6,dr:(R()-.5)*.02});bcol=['#5a3418','#c96a2a'];}
    else if(cls==='shell'){wkDark(g,S,.25);wkCracks(g,sc,R,5,null,1,24);
      polys=wkStrips(S,[C-7*k+wkRng(R,-2,2)*k,C+5*k+wkRng(R,-2,2)*k],R,9,.4);motion=i=>({dx:(i-1)*wkRng(R,8,14),dy:wkRng(R,-6,6),rot:(R()-.5)*.8,dr:(R()-.5)*.015});fx.bio={x:0,y:0,r:12*k};bcol=['#c9a6c8','#f0d8e8'];nb=6;}
    else if(cls==='flagship'){wkDark(g,S,.3);wkBurns(g,sc,R,5,8,18);wkHoles(g,sc,R,3,4,8,'rgba(255,140,60,.7)',2);
      const [bx,by]=P(-9,(R()-.5)*8),br=8*k,gr=g.createRadialGradient(bx,by,0,bx,by,br);g.globalCompositeOperation='source-atop';gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.7,'rgba(10,4,2,.85)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(bx-br,by-br,br*2,br*2);
      const hp=wkJag(R,bx,by,4*k,10);g.globalCompositeOperation='destination-out';wPoly(g,hp);g.fill();g.globalCompositeOperation='source-atop';wPoly(g,hp);g.strokeStyle='rgba(255,150,60,.95)';g.lineWidth=3;g.stroke();g.globalCompositeOperation='source-over';
      polys=wkStrips(S,[C+wkRng(R,-1,3)*k],R,10,.35);motion=i=>({dx:(i?1:-1)*wkRng(R,12,18),dy:wkRng(R,-6,6),rot:(R()-.5)*.4,dr:(R()-.5)*.006});fx.spark=.02;nb=14;bcol=['#3a4558','#8a9ab0','#ff4f6e'];}
    else if(cls==='blueprint'){wkDark(g,S,.2);const sil=wkCv(S);sil._g.drawImage(base,0,0);
      const bp=wkCv(S),q=bp._g;q.strokeStyle='rgba(107,184,255,.45)';q.lineWidth=1;q.beginPath();for(let x=bb[0];x<bb[2];x+=6){q.moveTo(x,bb[1]);q.lineTo(x,bb[3]);}for(let y=bb[1];y<bb[3];y+=6){q.moveTo(bb[0],y);q.lineTo(bb[2],y);}q.stroke();
      q.globalCompositeOperation='destination-in';q.drawImage(sil,0,0);q.globalCompositeOperation='source-over';q.drawImage(wkOutline(sil,S,'#6bb8ff',1.2),0,0);
      q.strokeStyle='rgba(180,140,255,.8)';q.lineWidth=1;q.setLineDash([3,3]);q.beginPath();const yb=bb[3]+8,xr=bb[2]+8;q.moveTo(bb[0],yb);q.lineTo(bb[2],yb);q.moveTo(xr,bb[1]);q.lineTo(xr,bb[3]);q.stroke();q.setLineDash([]);
      q.beginPath();for(const x of [bb[0],bb[2]]){q.moveTo(x,yb-3);q.lineTo(x,yb+3);}for(const y of [bb[1],bb[3]]){q.moveTo(xr-3,y);q.lineTo(xr+3,y);}q.stroke();
      fx.bp={mat:base,bp,C,bb,ph:R()*TAU,sp:.25+R()*.2};o.pieces=[];o.bits=[];o.rv=Math.hypot(bw,bb[3]-bb[1])/2+10;return o;}
    else if(cls==='cradle'){wkDark(g,S,.2);if(sp.variant==='guardShot'){const r=7*k,gr=g.createRadialGradient(C,C,0,C,C,r);g.globalCompositeOperation='source-atop';gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(C-r,C-r,r*2,r*2);
        const hp=wkJag(R,C+1,C-1,3.2*k,9);g.globalCompositeOperation='destination-out';wPoly(g,hp);g.fill();g.globalCompositeOperation='source-atop';wPoly(g,hp);g.strokeStyle='rgba(255,150,60,.95)';g.lineWidth=2.5;g.stroke();g.globalCompositeOperation='source-over';}
      const nk=sp.variant==='frame'||sp.variant==='stand'?3:R()<.5?3:4,cuts=[];for(let i=1;i<nk;i++)cuts.push(bb[0]+bw*i/nk);polys=wkStrips(S,cuts,R,0,0);
      const gap=wkRng(R,10,16);motion=i=>({dx:(i-nk/2)*gap,dy:0});fx.apart=1;nb=3;bcol=['#ffb84d','#3a4558'];}
    else if(cls==='ark'){wkDark(g,S,.15);if(info.win){const [wx,wy]=P(info.win[0],info.win[1]);const sc2={pts:sc.pts.filter(([x,y])=>Math.hypot(x-wx,y-wy)<info.win[2]*k),edge:[]};if(sc2.pts.length)wkCracks(g,sc2,R,4,'rgba(255,255,255,.9)',.8,info.win[2]*k);
        fx.heart={x:wx-C,y:wy-C,r:info.win[2]*k*1.4,ph:R()*2};}polys=all;motion=()=>({});nb=2;bcol=['#ffd27a','#3a3020'];}
    else if(cls==='erased'){const sil=wkCv(S);sil._g.drawImage(base,0,0);const ol=wkOutline(sil,S,'#9fffe0',1.4);g.clearRect(0,0,S,S);g.globalAlpha=.25;g.drawImage(wkOutline(sil,S,'#9fffe0',3),0,0);g.globalAlpha=1;g.drawImage(ol,0,0);
      sc=wkScan(g,S);const a0=R()*TAU,ang=[];for(let i=0;i<6;i++)ang.push(a0+i*TAU/6+(R()-.5)*.3);polys=wkWedges(C,C,ang,S);motion=()=>({ph:R()*TAU,per:1.5+R()*2.5});fx.flick=1;nb=0;}
    else if(cls==='proto'){const arcs=[];for(const [r,n,w] of [[20,4,2.6],[15.5,2,1.4],[11,3,2]])for(let i=0;i<n;i++)arcs.push({r:r*k,a:i/n*TAU+R(),len:TAU/n*(.55+R()*.3),w:w*k*.5,sp:(R()<.5?-1:1)*(.08+R()*.18),dr:R()*TAU});
      fx.proto={arcs,k};o.pieces=[];o.bits=wkBits(R,10,k,['#ffffff','#ffc2ec']);o.rv=24*k;return o;}
    if(cls!=='erased')sc=wkScan(g,S);
    o.pieces=wkCut(base,S,polys||all,sc.bb,motion||(()=>({})));o.bits=wkBits(R,nb,k,bcol);}
  let rv=10;for(const p of o.pieces){rv=Math.max(rv,Math.hypot(p.px+p.dx,p.py+p.dy)+Math.hypot(p.c.width,p.c.height)/2);}o.rv=rv;
  return o;}
function wkBits(R,n,k,cols){const b=[];for(let i=0;i<n;i++){const a=R()*TAU,r=(14+R()*12)*k;b.push({x:Math.cos(a)*r,y:Math.sin(a)*r,s:1.5+R()*2.5,a:R()*TAU,w:(R()-.5)*.8,c:cols[Math.floor(R()*cols.length)]});}return b;}
function wkTint(p){if(p.tint)return p.tint;p.tint=['#ff3d5a','#6bf0ff'].map(col=>{const c=wkCv(p.c.width,p.c.height),q=c._g;q.drawImage(p.c,0,0);q.globalCompositeOperation='source-in';q.fillStyle=col;q.fillRect(0,0,c.width,c.height);return c;});return p.tint;}

// --- отрисовка (в текущем ctx, начало — центр обломка) ---
function wreckBody(s,t,read,still){const fx=s.fx,A=read?.72:1,ef=SET.fx&&!still;
  if(fx.bio){glow(0,0,fx.bio.r,'#ffc2ec',(.35+.15*Math.sin(t*1.3))*A);}
  if(fx.bp){const B=fx.bp,lim=(B.bb[2]-B.bb[0])/2,cxb=(B.bb[0]+B.bb[2])/2-B.C,bx=cxb+Math.sin(t*B.sp+B.ph)*lim*.55;
    ctx.globalAlpha=A;ctx.save();ctx.beginPath();ctx.rect(-B.C,-B.C,bx+B.C,B.C*2);ctx.clip();ctx.drawImage(B.mat,-B.C,-B.C);ctx.restore();
    ctx.save();ctx.beginPath();ctx.rect(bx,-B.C,B.C*2,B.C*2);ctx.clip();ctx.globalAlpha=A*(.75+.25*Math.sin(t*3));ctx.drawImage(B.bp,-B.C,-B.C);ctx.restore();
    ctx.globalAlpha=A*.7;ctx.strokeStyle='#6bf0ff';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(bx,B.bb[1]-B.C-4);ctx.lineTo(bx,B.bb[3]-B.C+4);ctx.stroke();ctx.globalAlpha=1;}
  if(fx.proto){const k=fx.proto.k;glow(0,0,26*k,'#ffc2ec',.35*A);glow(0,0,8*k,'#ffffff',.6*A);ctx.lineCap='round';
    for(const a of fx.proto.arcs){const ang=a.a+a.sp*t,rr=a.r*(1+.04*Math.sin(t*.7+a.dr));ctx.strokeStyle='rgba(255,194,236,.35)';ctx.globalAlpha=A;ctx.lineWidth=a.w*3;ctx.beginPath();ctx.arc(0,0,rr,ang,ang+a.len);ctx.stroke();
      ctx.strokeStyle='#ffffff';ctx.lineWidth=a.w;ctx.beginPath();ctx.arc(0,0,rr,ang,ang+a.len);ctx.stroke();}ctx.lineCap='butt';ctx.globalAlpha=1;}
  for(const b of s.bits){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.a+b.w*t);ctx.fillStyle=b.c;ctx.globalAlpha=A*.9;ctx.fillRect(-b.s,-b.s*.6,b.s*2,b.s*1.2);ctx.restore();}
  ctx.globalAlpha=1;
  if(fx.apart&&s.pieces.length>1){ctx.strokeStyle='rgba(255,184,77,.35)';ctx.lineWidth=1;ctx.setLineDash([3,4]);ctx.beginPath();for(let i=0;i<s.pieces.length-1;i++){const p=s.pieces[i],q=s.pieces[i+1];ctx.moveTo(p.px+p.dx,p.py-s.S*.12);ctx.lineTo(q.px+q.dx,q.py-s.S*.12);}ctx.stroke();ctx.setLineDash([]);}
  s.pieces.forEach((p,i)=>{let a=A,jx=0,jy=0,gl=false;
    if(fx.flick){const v=Math.sin(t*(TAU/p.per)+p.ph)+Math.sin(t*1.7+p.ph*2)*.5;a*=v>-.4?1:.12;}
    if(fx.glitch&&ef&&((t+p.ph)%p.per)<.15){gl=true;jx=(Math.random()-.5)*5;jy=(Math.random()-.5)*3;}
    ctx.save();ctx.translate(p.px+p.dx+jx,p.py+p.dy+jy);ctx.rotate(p.rot+p.dr*t);ctx.globalAlpha=a;
    if(gl){const T=wkTint(p);ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.55;ctx.drawImage(T[0],p.ox-p.px-3,p.oy-p.py);ctx.drawImage(T[1],p.ox-p.px+3,p.oy-p.py);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=a;}
    ctx.drawImage(p.c,p.ox-p.px,p.oy-p.py);
    if(fx.ember&&fx.ember.pi===i){ctx.globalAlpha=1;glow(fx.ember.x-p.px,fx.ember.y-p.py,10+3*Math.sin(t*4),'#ff8a3d',(.45+.2*Math.sin(t*7))*A);}
    ctx.restore();});
  ctx.globalAlpha=1;
  if(fx.beacon){const q=(t+fx.beacon.ph)%2.4,a=q<.18?1:q<.5?.5*(1-(q-.18)/.32):.08;glow(fx.beacon.x,fx.beacon.y,14,'#ffb84d',a*A);}
  if(fx.heart){const q=(t+fx.heart.ph)%1.7,hb=Math.exp(-q*q*60)+.6*Math.exp(-(q-.28)*(q-.28)*60),fade=.45+.55*(.5+.5*Math.sin(t*.23+fx.heart.ph));glow(fx.heart.x,fx.heart.y,fx.heart.r,'#ffd27a',(.15+.75*hb)*fade*A);}
  if(fx.red)glow(0,0,s.rv*.9,'#ff4f6e',.25+.1*Math.sin(t*2));
  if(fx.noisePx&&ef&&Math.random()<.35){ctx.fillStyle='#ffffff';for(let i=0;i<3;i++){const a=Math.random()*TAU,r=Math.random()*s.rv;ctx.globalAlpha=.4+Math.random()*.5;ctx.fillRect(Math.cos(a)*r,Math.sin(a)*r,2,2);}ctx.globalAlpha=1;}}
function drawWreck(j,t,read,label){const s=wreckSprite(j),sp=wreckSpec(j),sz=Math.min(sp.size||1,2.2);
  if(s){ctx.save();ctx.translate(j.x,j.y);const gr=46*Math.max(1,sz),gl=ctx.createRadialGradient(0,0,0,0,0,gr);gl.addColorStop(0,hexA(s.col&&s.col.length===7?s.col:'#8fe9ff',read?.06:.14));gl.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gl;ctx.fillRect(-gr,-gr,gr*2,gr*2);
    ctx.rotate(s.base);wreckBody(s,t,read);ctx.restore();
    if(s.fx.spark&&SET.fx&&Math.random()<s.fx.spark*(1+sz)){const r=s.rv*.5;part(j.x+rnd(-r,r),j.y+rnd(-r,r),rnd(-80,80),rnd(-80,80),.5,Math.random()<.5?'#ffd27a':s.col,1.5);}}
  if(!read){const q=(t*.9)%1,R0=30*Math.max(1,sz*.8);ctx.strokeStyle=hexA('#8fe9ff',(1-q)*.6);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(j.x,j.y,R0+q*26,0,TAU);ctx.stroke();if(label)worldLabel(j.x,j.y-48*Math.max(1,sz*.85),label,'#7a8ea5');}}
// иконка 48 px (журнал)
function wreckIcon(j){const id=j.id;if(WRK.icons[id])return WRK.icons[id];const s=wreckSprite(j,true),c=wkCv(96),oc=ctx;ctx=c._g;
  try{const k=44/Math.max(20,s.rv);ctx.translate(48,48);ctx.scale(k,k);ctx.rotate(-.5);wreckBody(s,2,false,true);}catch(e){console.error(e);}finally{ctx=oc;}
  return WRK.icons[id]=c;}
function wreckIconsFill(el){el.querySelectorAll('canvas[data-wr]').forEach(cv=>{const j=WORLD.journals.find(q=>q.id===cv.dataset.wr);if(!j)return;const g=cv.getContext('2d');g.clearRect(0,0,cv.width,cv.height);g.drawImage(wreckIcon(j),0,0,cv.width,cv.height);});}
function skinWrecks(k){const all=WORLD.journals.filter(j=>{const s=wreckSpec(j);return s.own==='player'&&s.skin===k;}),S=G.save;return [all.filter(j=>S&&S.journals[j.id]).length,all.length];}
// отладка: сетка всех обломков
function wreckGrid(on){let el=document.getElementById('wrkGrid');if(on===false){if(el)el.remove();return 0;}
  if(!el){el=document.createElement('canvas');el.id='wrkGrid';el.style.cssText='position:fixed;inset:0;z-index:99;background:#04060c;width:100vw;height:100vh';document.body.appendChild(el);}
  const W_=el.width=innerWidth,H_=el.height=innerHeight,cols=9,rows=7,cw=W_/cols,ch=H_/rows,g=el.getContext('2d'),oc=ctx,t=performance.now()/1000,out=[];
  ctx=g;try{WORLD.journals.forEach((j,i)=>{const s=wreckSprite(j,true),sp=wreckSpec(j),x=(i%cols+.5)*cw,y=(Math.floor(i/cols)+.45)*ch,kk=Math.min(cw,ch)*.42/Math.max(20,s.rv);
    g.save();g.translate(x,y);g.scale(kk,kk);g.rotate(-.35);wreckBody(s,t,false,true);g.restore();
    g.font='10px monospace';g.textAlign='center';g.fillStyle=sp.own==='player'?SKINS[sp.skin].col:'#9fb0c4';g.fillText(j.n+' '+roman(j.sec+1)+' '+(sp.own==='player'?sp.skin+' '+sp.dmg:sp.cls+(sp.variant?'/'+sp.variant:'')),x,y+ch*.47);
    out.push({n:j.n,own:sp.own,k:sp.own==='player'?sp.skin:sp.cls,ms:+(s.ms||0).toFixed(1)});});}finally{ctx=oc;}
  return out;}

function storyDrawWorld(t){if(STORY_OFF.wrecks)return;try{const S=G.save;
  WRK.frame++;WRK.budget=1;sbWorldDraw(t);
  for(const j of WORLD.journals){const m=70*(wreckSpec(j).size||1)+40;if(!inView(j.x,j.y,m)){if(!WRECK_SPR[j.id]&&inView(j.x,j.y,m+Math.max(W,H)*.75))wreckSprite(j);continue;}drawWreck(j,t,!!S.journals[j.id],'СИГНАЛ БОРТЖУРНАЛА');}
  for(const w of S.story.riftWrecks){if(!inView(w.x,w.y,110))continue;drawWreck({id:'rw'+w.id,n:w.id%997,skin:w.skin,x:w.x,y:w.y,rift:1},t,!!w.read,'V∅ID-013 · ЦИКЛ '+roman(w.c));}
  for(const f of STORY_FRAGS){if(!fragAvail(f))continue;const p=fragPos(f);if(!inView(p.x,p.y,60))continue;const pu=.6+.4*Math.sin(t*3+p.x);
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(t*.6);const gr=ctx.createRadialGradient(0,0,0,0,0,34);gr.addColorStop(0,`rgba(255,255,255,${.35*pu})`);gr.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=gr;ctx.fillRect(-34,-34,68,68);
    ctx.fillStyle='#ffffff';ctx.globalAlpha=.85;ctx.beginPath();ctx.moveTo(0,-11);ctx.lineTo(6,0);ctx.lineTo(0,11);ctx.lineTo(-5,2);ctx.closePath();ctx.fill();ctx.restore();ctx.globalAlpha=1;worldLabel(p.x,p.y-34,'ФРАГМЕНТ ПАМЯТИ','#dfe8ff');}
 }catch(err){STORY_OFF.wrecks=1;console.error(err);}}
function storyPOI(){const S=G.save,p=G.player;if(!S||!S.story||p.hp<=0)return;sbWorldPOI();
  for(const w of S.story.riftWrecks){if(w.read)continue;if(Math.hypot(p.x-w.x,p.y-w.y)<110){w.read=1;toast('V∅ID-013 · ЦИКЛ '+roman(w.c),'ВОСПОМИНАНИЕ ИЗЪЯТО. Корпус ещё тёплый.');sfx('pick');}}
  for(const f of STORY_FRAGS){if(!fragAvail(f))continue;const q=fragPos(f);if(Math.hypot(p.x-q.x,p.y-q.y)<75){const n=Object.keys(S.story.frags).length+1;S.story.frags[f.id]=n;
    fragShow(STORY_FRAG[n-1]||'',n);G.lightFull=Math.max(G.lightFull||0,.6);thump(55,.5);thump(52,.4,.35);sfx('level');MAPC.rift=null;MAPC.riftKey=null;storyFixLast();saveWorld();}}}
function fragShow(txt,n){const el=document.getElementById('fragTxt');if(!el)return;el.innerHTML=`<small>ФРАГМЕНТ ПАМЯТИ · ${n}/15</small>${txt}`;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');}
function storyFixLast(){const S=G.save;if(!S)return;const I=x=>riftTarget(riftInfo(x.x,x.y).d+riftShift());if(I(S.last)>=.2){let bn=WORLD.nodes[0],bd=1e12;for(const q of WORLD.nodes){const d=Math.hypot(q.x-S.last.x,q.y-S.last.y);if(d<bd&&nodeState(q.m)!=='locked'){bd=d;bn=q;}}S.last={x:bn.x,y:bn.y+150};}}
function storyWorldTick(dt){storyTick();radioTick(dt,'world');storyPOI();
  const e=erosion();if(e>0&&SET.fx&&G.riftD>-400&&G.riftD<0&&G.parts.length<300&&vR2()<e*dt*6){const p=G.player;part(p.x+vrnd2(-300,300),p.y+vrnd2(-200,200),vrnd2(-20,20),vrnd2(10,40),1.2,'#6b4a8c',1.5);}
  if(!G.secChk||G.secChk<=0){G.secChk=1;radioWorldEnter();}else G.secChk-=dt;}

