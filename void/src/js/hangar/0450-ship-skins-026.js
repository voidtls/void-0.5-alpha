// ---------- Скины корабля (0.2.6) ----------
// у всех одинаковый хитбокс; скин меняет силуэт, детали, пламя, шлейф и цвет снарядов
const SKINS={
  base:{name:'Базовый',col:'#8fe9ff',bul:'#8fe9ff',trail:'#8fe9ff',d:'Стандартный разведкорабль экспедиции.',unlock:0},
  falcon:{name:'Сокол',col:'#ffb84d',bul:'#ffcf7a',trail:'#ff9a3d',d:'Обратная стреловидность и два форсажных двигателя.',unlock:3},
  manta:{name:'Скат',col:'#4dffd2',bul:'#7affe0',trail:'#2fd6b0',d:'Живые крылья волнами режут пустоту.',unlock:6},
  prism:{name:'Призма',col:'#e0d2ff',bul:'#ffffff',trail:'#e0d2ff',d:'Кристалл, который преломляет свет звёзд.',unlock:9},
  reaper:{name:'Жнец',col:'#ff3d5a',bul:'#ff6b81',trail:'#ff2a44',d:'Серп из закалённого сплава. Оставляет тлеющие искры.',unlock:12},
  halo:{name:'Ореол',col:'#ffe6a3',bul:'#fff2c9',trail:'#ffd36b',d:'Ядро, окружённое вечным кольцом.',unlock:15},
  comet:{name:'Комета',col:'#9fb8ff',bul:'#c9d6ff',trail:'#b48cff',d:'Ледяное ядро с хвостом на полнеба.',unlock:18},
  hornet:{name:'Шершень',col:'#ffd23d',bul:'#ffe27a',trail:'#ffb800',d:'Полосатый перехватчик с жалом и гудящими крыльями.',unlock:21},
  obsidian:{name:'Обсидиан',col:'#b48cff',bul:'#c9a6ff',trail:'#5a3a8c',d:'Стелс-корпус. Виден только по контуру.',unlock:24},
  sail:{name:'Солнечный парус',col:'#ffd77a',bul:'#fff0b0',trail:'#ffc94d',d:'Ловит звёздный ветер огромным парусом.',unlock:27},
  pulsar:{name:'Пульсар',col:'#ff6bd0',bul:'#6bf0ff',trail:'#ff6bd0',d:'Нейтронная звезда на поводке. Пульсирует.',unlock:30}
};
function curSkin(){const k=G.save&&G.save.skin;return SKINS[k]&&(!G.save.ownSkins||G.save.ownSkins.includes(k))?k:'base';}
function shipCol(){return SKINS[curSkin()].col;}
function shipBul(){return SKINS[curSkin()].bul;}
function flameTri(x,y,len,w,col){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x,y-w);ctx.lineTo(x-len,y);ctx.lineTo(x,y+w);ctx.closePath();ctx.fill();}
// рисует корабль в локальных координатах (нос смотрит вдоль +x)
function drawShip(id,t,sp,o){
  o=o||{};const S=SKINS[id]||SKINS.base,A=ctx.globalAlpha,fl=8+sp/30+Math.sin(t*50)*2,edge=o.noDash?'#6bf0ff':S.col;
  ctx.lineJoin='round';ctx.lineCap='round';
  if(w58DrawSkin(id,t,sp,o,A,fl,edge)||w74DrawSkin(id,t,sp,o,A,fl,edge)||w85DrawSkin(id,t,sp,o,A,fl,edge)||w90DrawSkin(id,t,sp,o,A,fl,edge)){ctx.globalAlpha=A;ctx.lineCap='butt';return;}
  switch(id){
    case 'falcon':{
      for(const s of [-1,1]){glow(-11,s*5,fl,'#ff9a3d',.8);flameTri(-9,s*5,fl*1.1,2.4,'#ffcf7a');}
      ctx.fillStyle='#1a1206';ctx.strokeStyle=edge;ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(21,0);ctx.lineTo(6,-4);ctx.lineTo(-2,-16);ctx.lineTo(-8,-15);ctx.lineTo(-5,-6);ctx.lineTo(-12,-5);ctx.lineTo(-10,0);
      ctx.lineTo(-12,5);ctx.lineTo(-5,6);ctx.lineTo(-8,15);ctx.lineTo(-2,16);ctx.lineTo(6,4);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle=S.col;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(13,s*2);ctx.lineTo(8,s*8);ctx.lineTo(6,s*3);ctx.closePath();ctx.fill();}
      ctx.strokeStyle='#fff3d6';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(17,0);ctx.lineTo(-6,0);ctx.stroke();
      ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(8,0,2,0,TAU);ctx.fill();break;}
    case 'manta':{const w=Math.sin(t*6)*3;
      glow(-10,0,fl,'#2fd6b0',.7);
      ctx.strokeStyle='#4dffd2';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-8,0);for(let i=1;i<=9;i++)ctx.lineTo(-8-i*2.6,Math.sin(t*8-i*.8)*i*.5);ctx.stroke();
      ctx.fillStyle='#04241f';ctx.strokeStyle=edge;ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(16,0);ctx.quadraticCurveTo(8,-6,0,-8);ctx.quadraticCurveTo(-6,-18-w,-12,-17-w);ctx.quadraticCurveTo(-8,-8,-9,0);
      ctx.quadraticCurveTo(-8,8,-12,17+w);ctx.quadraticCurveTo(-6,18+w,0,8);ctx.quadraticCurveTo(8,6,16,0);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(77,255,210,.45)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(4,-4);ctx.quadraticCurveTo(-4,-10,-9,-13-w*.7);ctx.moveTo(4,4);ctx.quadraticCurveTo(-4,10,-9,13+w*.7);ctx.stroke();
      ctx.fillStyle='#bfffee';ctx.beginPath();ctx.arc(9,-2.5,1.6,0,TAU);ctx.arc(9,2.5,1.6,0,TAU);ctx.fill();break;}
    case 'prism':{const h=(t*80)%360;
      glow(-10,0,fl,'#ffffff',.5);flameTri(-9,0,fl*1.1,3.5,`hsl(${(h+180)%360},100%,72%)`);
      const g=ctx.createLinearGradient(-10,-12,18,12);g.addColorStop(0,`hsla(${h},90%,66%,.92)`);g.addColorStop(.5,`hsla(${(h+120)%360},90%,66%,.92)`);g.addColorStop(1,`hsla(${(h+240)%360},90%,66%,.92)`);
      ctx.fillStyle=g;ctx.strokeStyle=o.noDash?'#6bf0ff':'#ffffff';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(19,0);ctx.lineTo(-10,-13);ctx.lineTo(-10,13);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(19,0);ctx.lineTo(-1,0);ctx.lineTo(-10,-13);ctx.moveTo(-1,0);ctx.lineTo(-10,13);ctx.stroke();
      const k=(t*1.4)%1;ctx.fillStyle='#ffffff';ctx.globalAlpha=A*(1-k);ctx.beginPath();ctx.arc(17-k*24,-k*9,1.8,0,TAU);ctx.fill();ctx.globalAlpha=A;break;}
    case 'reaper':{
      glow(-6,0,fl*.9,'#ff2a44',.8);flameTri(-5,0,fl,2.6,'#ff6b81');
      ctx.fillStyle='#1a0408';ctx.strokeStyle=edge;ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(0,0,17,-2.3,2.3);ctx.arc(-5,0,14,2.05,-2.05,true);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-6,0);ctx.lineTo(10,0);ctx.stroke();
      ctx.fillStyle='#ff3d5a';ctx.beginPath();ctx.arc(-3,0,3+Math.sin(t*6),0,TAU);ctx.fill();
      ctx.fillStyle='#ffd0d6';ctx.beginPath();ctx.arc(14,-6,1.3,0,TAU);ctx.arc(14,6,1.3,0,TAU);ctx.fill();break;}
    case 'halo':{const rot=t*1.2;
      glow(0,0,20,'#ffd36b',.6);glow(-9,0,fl*.8,'#ffd36b',.5);
      ctx.strokeStyle=edge;ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(0,0,15,6,rot,0,TAU);ctx.stroke();
      ctx.fillStyle='#ffffff';for(let i=0;i<3;i++){const a=t*3+i*TAU/3,lx=15*Math.cos(a),ly=6*Math.sin(a);ctx.beginPath();ctx.arc(lx*Math.cos(rot)-ly*Math.sin(rot),lx*Math.sin(rot)+ly*Math.cos(rot),2,0,TAU);ctx.fill();}
      const g=ctx.createRadialGradient(0,0,0,0,0,8);g.addColorStop(0,'#ffffff');g.addColorStop(.6,'#ffe6a3');g.addColorStop(1,'#c99a3a');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,7,0,TAU);ctx.fill();
      ctx.fillStyle='#ffe6a3';ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(9,-3);ctx.lineTo(9,3);ctx.closePath();ctx.fill();break;}
    case 'comet':{const L=fl*2.2+10;const cols=['#b48cff','#9fb8ff','#ffffff'];
      for(let i=0;i<3;i++){ctx.strokeStyle=cols[i];ctx.globalAlpha=A*(.25+i*.22);ctx.lineWidth=7-i*2.2;ctx.beginPath();ctx.moveTo(2,0);
        for(let s=1;s<=10;s++)ctx.lineTo(-s*L/10,Math.sin(t*7-s*.7)*s*.45*(1-i*.3));ctx.stroke();}
      ctx.globalAlpha=A;
      const g=ctx.createRadialGradient(6,0,0,4,0,10);g.addColorStop(0,'#ffffff');g.addColorStop(.5,'#c9d6ff');g.addColorStop(1,'#6b7dff');
      ctx.fillStyle=g;ctx.strokeStyle=edge;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(4,0,9,0,TAU);ctx.fill();ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.9)';ctx.beginPath();ctx.arc(7,-3,2,0,TAU);ctx.fill();break;}
    case 'hornet':{const wa=.3+.25*Math.sin(t*90);
      glow(-14,0,fl*.7,'#ffb800',.6);
      ctx.fillStyle=`rgba(220,240,255,${wa})`;ctx.beginPath();ctx.ellipse(1,-9,9,4,-.45,0,TAU);ctx.ellipse(1,9,9,4,.45,0,TAU);ctx.fill();
      ctx.strokeStyle='#ffd23d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-14,0);ctx.lineTo(-22,0);ctx.stroke();
      ctx.save();ctx.beginPath();ctx.ellipse(-7,0,9,6,0,0,TAU);ctx.fillStyle='#141008';ctx.fill();ctx.clip();ctx.fillStyle='#ffd23d';for(let i=-2;i<3;i++)ctx.fillRect(-7+i*4.5-1.2,-7,2.4,14);ctx.restore();
      ctx.strokeStyle=edge;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(-7,0,9,6,0,0,TAU);ctx.stroke();
      ctx.fillStyle='#141008';ctx.beginPath();ctx.ellipse(4,0,5,4.5,0,0,TAU);ctx.fill();ctx.stroke();
      ctx.fillStyle='#ffd23d';ctx.beginPath();ctx.arc(11,0,3.6,0,TAU);ctx.fill();
      ctx.fillStyle='#141008';ctx.beginPath();ctx.arc(12.5,-1.6,1.2,0,TAU);ctx.arc(12.5,1.6,1.2,0,TAU);ctx.fill();break;}
    case 'obsidian':{const fk=.55+.45*Math.abs(Math.sin(t*3));
      glow(-10,0,fl*.6,'#5a3a8c',.6);flameTri(-9,0,fl*.6,2,'#7c5cff');
      ctx.fillStyle='#050308';ctx.beginPath();ctx.moveTo(21,0);ctx.lineTo(3,-6);ctx.lineTo(-5,-17);ctx.lineTo(-13,-7);ctx.lineTo(-9,0);ctx.lineTo(-13,7);ctx.lineTo(-5,17);ctx.lineTo(3,6);ctx.closePath();ctx.fill();
      ctx.strokeStyle=edge;ctx.globalAlpha=A*fk;ctx.lineWidth=1.4;ctx.stroke();ctx.globalAlpha=A;
      ctx.strokeStyle='rgba(180,140,255,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(3,-6);ctx.lineTo(-9,0);ctx.lineTo(3,6);ctx.moveTo(21,0);ctx.lineTo(-9,0);ctx.stroke();
      ctx.fillStyle='#c9a6ff';ctx.globalAlpha=A*fk;ctx.fillRect(6,-1,7,2);ctx.globalAlpha=A;break;}
    case 'sail':{
      glow(-13,0,fl*.8,'#ffc94d',.7);flameTri(-12,0,fl,2.2,'#fff0b0');
      ctx.save();ctx.translate(-2,0);ctx.rotate(Math.PI/4);
      const g=ctx.createLinearGradient(-11,-11,11,11);g.addColorStop(0,'rgba(255,215,122,.18)');g.addColorStop(.5,'rgba(255,240,176,.6)');g.addColorStop(1,'rgba(255,201,77,.22)');
      ctx.fillStyle=g;ctx.fillRect(-11,-11,22,22);ctx.strokeStyle=edge;ctx.lineWidth=1.2;ctx.strokeRect(-11,-11,22,22);
      ctx.save();ctx.beginPath();ctx.rect(-11,-11,22,22);ctx.clip();const k=((t*.8)%1)*44-22;ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(k,-11);ctx.lineTo(k-8,11);ctx.stroke();ctx.restore();
      ctx.restore();
      ctx.strokeStyle='rgba(255,240,176,.5)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-2,-15.5);ctx.lineTo(8,0);ctx.lineTo(-2,15.5);ctx.stroke();
      ctx.strokeStyle='#fff0b0';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(20,0);ctx.lineTo(-14,0);ctx.stroke();
      ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(20,0,2,0,TAU);ctx.fill();break;}
    case 'pulsar':{
      for(let i=0;i<2;i++){const k=((t*1.2+i*.5)%1);ctx.strokeStyle='#6bf0ff';ctx.globalAlpha=A*(1-k)*.6;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,6+k*18,0,TAU);ctx.stroke();}
      ctx.globalAlpha=A;glow(-8,0,fl*.7,'#ff6bd0',.6);glow(0,0,16,'#ff6bd0',.5);
      ctx.save();ctx.rotate(t*2.5);for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.fillStyle=i%2?'#ff6bd0':'#6bf0ff';ctx.beginPath();ctx.moveTo(4,-2.6);ctx.lineTo(16,0);ctx.lineTo(4,2.6);ctx.closePath();ctx.fill();}ctx.restore();
      const g=ctx.createRadialGradient(0,0,0,0,0,7);g.addColorStop(0,'#ffffff');g.addColorStop(.5,'#ffc2ec');g.addColorStop(1,'#ff6bd0');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,6+Math.sin(t*10)*.8,0,TAU);ctx.fill();
      ctx.strokeStyle=edge;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(10,-3);ctx.lineTo(19,0);ctx.lineTo(10,3);ctx.stroke();break;}
    default:{
      glow(-12,0,fl*1.2,'#5fc8ff',.8);flameTri(-8,0,fl,4,S.col);
      ctx.fillStyle='#0c1828';ctx.strokeStyle=edge;ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(19,0);ctx.lineTo(-11,-12);ctx.lineTo(-5,0);ctx.lineTo(-11,12);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(5,0,2.5,0,TAU);ctx.fill();}
  }
  ctx.globalAlpha=A;ctx.lineCap='butt';
}
