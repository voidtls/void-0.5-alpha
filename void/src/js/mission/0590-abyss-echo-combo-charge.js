// ---- Бездна ----
function enterAbyss(){
  const S=G.save,a=WORLD.abyss;if(S.carry>0){S.lom+=S.carry;S.carry=0;}
  S.pos={x:a.x,y:a.y+620};S.last={...S.pos};G.world=false;saveWorld();/* 0.5.9: saveWorld больше не перезаписывает точку возврата позицией корабля у дыры */
  G.fromAbyss=true;G.world=false;$('#wcard').hidden=true;G.card=null;startEndless(false,1);banner('БЕЗДНА','В СЕКТОР НИЧЕГО НЕ ПЕРЕНОСИТСЯ');
}
function leaveAbyss(){G.fromAbyss=false;startWorld(false);G.abyssImm=3;banner('ВЫХОД ИЗ БЕЗДНЫ','СЕКТОР В ТОМ ЖЕ СОСТОЯНИИ');}
function drawAbyss(t){
  const a=WORLD.abyss,S=G.save;if(!inView(a.x,a.y,320))return;
  ctx.save();ctx.translate(a.x,a.y);
  glow(0,0,260,'#7c5cff',.35);glow(0,0,160,'#ff6b3d',.18);
  ctx.save();ctx.rotate(-.32);
  for(let i=6;i>=0;i--){const rx=78+i*24,ry=(78+i*24)*.32;ctx.strokeStyle=i%2?'#ffb84d':'#b48cff';ctx.globalAlpha=.16+.07*(6-i);ctx.lineWidth=5-i*.5;
    ctx.setLineDash([18+i*6,10+i*4]);ctx.lineDashOffset=-t*(120-i*12);ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,TAU);ctx.stroke();}
  ctx.setLineDash([]);ctx.restore();
  ctx.globalAlpha=1;
  for(let i=0;i<40;i++){const k=((t*.35+i/40)%1),ang=i*2.39+t*1.6*(1-k),r=260*(1-k)+20;ctx.fillStyle=i%3?'#c9a6ff':'#ffd0a0';ctx.globalAlpha=k;ctx.fillRect(Math.cos(ang)*r,Math.sin(ang)*r*.55,2,2);}
  ctx.globalAlpha=1;const g=ctx.createRadialGradient(0,0,10,0,0,70);g.addColorStop(0,'#000000');g.addColorStop(.8,'#000000');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,70,0,TAU);ctx.fill();
  ctx.strokeStyle='#b48cff';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,58,0,TAU);ctx.stroke();
  ctx.restore();
  const eb=bestEndless();if(abyssOpen()&&G.player&&Math.hypot(G.player.x-a.x,G.player.y-a.y)<900){ctx.strokeStyle='#b48cff';ctx.globalAlpha=G.abyssPull?.4:.25;ctx.lineWidth=1.5;ctx.setLineDash([8,10]);ctx.beginPath();ctx.arc(a.x,a.y,520,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}
  worldLabel(a.x,a.y-120,'∞ БЕЗДНА · БЕСКОНЕЧНОСТЬ',abyssOpen()?'#c9a6ff':'#5a4a7c');
  if(eb)worldLabel(a.x,a.y-104,'ЛУЧШЕЕ ВРЕМЯ '+fmtT(eb.t),'#7a8ea5');
}

// ---- боссы-эхо в Бесконечности ----
function spawnEchoBoss(){
  const E=G.end,n=E.bossN++,mul=1+.25*n;
  if(n%2===0){spawnBoss();const b=G.boss;b.hp=b.maxHp=EDEF.boss.hp*mul;b.th=[b.maxHp*2/3,b.maxHp/3,0];banner('ЭХО СТРАЖА',(G.fromAbyss&&storyEchoLine())||'ТРИ ФАЗЫ · СНИМИТЕ ЗАРЯДЫ');}
  else{spawnJam();const j=G.jam;j.hp=j.maxHp=EDEF.jam.hp*mul;j.th=[j.maxHp*2/3,j.maxHp/3,0];banner('ЭХО ГЛУШИТЕЛЯ','АНТЕННЫ · ЛОЖНАЯ ЦЕЛЬ · ТЬМА');}
  E.bossOn=true;sfx('warn');
}
function endlessBossAlive(){return !!((G.boss&&G.boss.alive)||(G.jam&&G.jam.alive));}
function updateEndlessBoss(){
  const E=G.end,alive=endlessBossAlive();
  if(!alive&&E.bossOn){E.bossOn=false;E.bosses++;G.dark=false;banner('ЭХО ПОВЕРЖЕНО','+3 РЕМКОМПЛЕКТА');
    for(let i=0;i<3;i++)G.pick.push({k:'rep',x:W/2+rnd(-140,140),y:H/2+rnd(-90,90),vx:0,vy:0,r:10,t:0,life:30});}
  if(!alive&&!E.bossOn&&E.t>=E.nextBoss){E.nextBoss+=300;spawnEchoBoss();}
}

// ---- комбо (перк «Боевой ритм») ----
function comboOn(){return(G.mode==='endless'||(G.mode==='world'&&!G.world))&&perkRaw('combo')>0;}
function comboCap(){return[1,1.5,1.75,2][perkRaw('combo')]||1;}
function comboKill(){
  if(!comboOn())return;const C=G.combo||(G.combo={n:0,mul:1,last:-9,hit:false});
  if(G.t-C.last>2.5){C.n=0;C.hit=false;}C.n++;C.last=G.t;C.mul=Math.min(comboCap(),1+.05*(C.n-1));
  if(C.mul>=1.75&&!C.hit){C.hit=true;conEvent('combo',C.mul);}
}
function comboTick(){const C=G.combo;if(C&&C.n>0&&G.t-C.last>2.5){C.n=0;C.mul=1;}}
function comboBreak(){const C=G.combo;if(C&&C.n>0){C.n=0;C.mul=1;}}

// ---- заряженный выстрел ----
const CHG_T=1.2,CHG_CD=3;
function chargeAllowed(){if(G.state==='world')return !!G.save&&G.save.cleared>=1;if(G.state!=='play')return false;return G.mode==='endless'||G.m>=2;}
function fireCharged(p){
  const tg=aimManual()?null:pickTarget();const a=tg?Math.atan2(tg.y-p.y,tg.x-p.x):p.ang;const sx=p.x+Math.cos(a)*18,sy=p.y+Math.sin(a)*18;
  if(G.st.weapon==='blast')G.pb.push({x:sx,y:sy,px:sx,py:sy,vx:Math.cos(a)*900,vy:Math.sin(a)*900,dmg:G.st.dmg*6,pierce:0,rico:0,life:.9,hit:[],charged:true,blast:true,R:G.st.blastR,age:0});
  else G.pb.push({x:sx,y:sy,px:sx,py:sy,vx:Math.cos(a)*1300,vy:Math.sin(a)*1300,dmg:G.st.dmg*6,pierce:99,rico:0,life:.9,hit:[],charged:true});
  p.chgCd=CHG_CD;sfx('charged');shake(5);buzz('chg');
  if(SET.fx)for(let i=0;i<14;i++)part(sx,sy,Math.cos(a)*rnd(100,400)+rnd(-80,80),Math.sin(a)*rnd(100,400)+rnd(-80,80),.35,'#ffffff',2.5);
}
function regenTick(dt){const l=perk('regen'),p=G.player;if(!l||!p||p.hp<=0||p.hp>=G.st.maxHp||noHeal())return;if(G.t-(p.hitT??-99)>3)p.hp=Math.min(G.st.maxHp,p.hp+.5*l*dt);}
function chargeChip(){
  const p=G.player;const show=!!p&&(G.world?!!G.save&&G.save.cleared>=1:(G.mode==='endless'||G.m>=2));setH('chgC',!show);setH('tCharge',!show);if(!show)return;
  const rd=p.chgCd<=0&&!(p.chg>0);setT('chgC',rd?'ЗАРЯД [Q]':'ЗАРЯД');setF('chgC',p.chgCd>0?1-p.chgCd/CHG_CD:p.chg>0?Math.min(1,p.chg/CHG_T):0);
  setC('chgC','ok',rd||p.chg>=CHG_T);setC('tCharge','cd',p.chgCd>0);
  setH('aimC',true);
  const C=G.combo;const on=comboOn()&&C&&C.n>1;setH('comboC',!on);if(on)setT('comboC','КОМБО '+C.n);
}

function rewMul(){return curDiff().lom*cycLom();}
function addPilotXPTo(S,v){saveSet6(S,'temp');addPilotXP(v);}

