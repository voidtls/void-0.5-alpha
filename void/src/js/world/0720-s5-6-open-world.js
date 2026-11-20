// ===== открытый мир секторов V–VI =====
const W74={gen:false,zones:[],pois:[]};
const W74_JR={j5a:['ЧУЖАЯ МАТЬ · ПЕРЕВОД 3/5','«Мы отдали им имена заранее. Имена живут дольше нас».'],j5b:['ТАЛА ОШ · ПОЛЕВОЙ ДНЕВНИК','«Считала коконы и цивилизации в каталоге Архива. Разница — ровно одна. Одна кладка лишняя. Или один из нас».'],j5c:['СТРАЖ-31 · ЖУРНАЛ ОТКАЗОВ','«Приказ: выжечь колыбель. Выполнено. Причина не запрашивалась. Причина не была бы дана».'],
  j6a:['КУРСАНТ ТЕО · ЗАПИСЬ 2','«Мне 19. Нас учили: Стражи — машины, машины не щадят. Сегодня Страж прошёл в метре от нашей шлюпки и не выстрелил. Я не знаю, кто из нас машина».'],j6b:['АДМИРАЛ И. КАРР · ЛИЧНОЕ','«Они могли уничтожить нас за минуту. Они потратили девять часов, выбивая только двигатели. Я приказал стрелять по ним до конца. Если они не хотят нашей смерти — чего они хотят?»']};
const W74_GLYPH=['…мы [сохранили]…','…мы сохранили [наших]…','…мы сохранили наших [мёртвых]…','…[цена] — наши…','…цена — наши [нерождённые]…'];
function w74S(){const S=G.save;return S.w74||(S.w74={pois:{},glyph:0,zd:{}});}
function w74Gen(){if(W74.gen||!WORLD.sectors[5]||!G.save)return;W74.gen=true;const N=WORLD.nodes;
  const okAt=(x,y,dn,dp)=>w58Far(x,y,N,dn)&&w58Far(x,y,W74.pois,dp)&&w58Far(x,y,W74.zones,dp)&&w58Far(x,y,WORLD.shops,dp)&&inSectors(x,y);
  const ZS=[[4,'ВЫВОДОК','brood'],[4,'ХОР','choir'],[4,'ПАСТУХИ','herd'],[4,'ПОВИТУХИ','midwife'],[5,'ЗВЕНО БЕЗ КОМАНДИРА','wing'],[5,'ПОХОРОННАЯ ПРОЦЕССИЯ','funeral'],[5,'БРАНДЕРНАЯ АТАКА','fireships'],[5,'СПАСАТЕЛЬНАЯ ШЛЮПКА','boat']];
  ZS.forEach(([sec,name,k],i)=>{const R=mulberry(7400+i*37);const q=w58Pt(sec,R,(x,y)=>okAt(x,y,1300,700)&&w58Far(x,y,W74.zones,1700)&&Math.hypot(x-WORLD.hangar.x,y-WORLD.hangar.y)>900&&Math.hypot(x-WORLD.arsenal.x,y-WORLD.arsenal.y)>900&&WORLD.sectors.every(sc=>!sc.bx||Math.hypot(x-sc.bx,y-sc.by)>900),500);const z={x:q.x,y:q.y,req:0,set:[],w58:1,sec,after:0,name,lead:null,reinf:{},idx:1100+i,k74:k,cool:0};W74.zones.push(z);WORLD.zones.push(z);W58.zones.push(z);});
  const P=(sec,id,kind,seed)=>{const R=mulberry(seed);const q=w58Pt(sec,R,(x,y)=>okAt(x,y,600,500),400);W74.pois.push({id,kind,sec,x:q.x,y:q.y});};
  P(4,'j5a','jr',7501);P(4,'j5b','jr',7502);P(4,'j5c','jr',7503);for(let i=0;i<5;i++)P(4,'g'+(i+1),'glyph',7510+i);P(4,'s33','save33',7520);P(5,'j6a','jr',7601);P(5,'j6b','jr',7602);}
function w74ZoneRadio(z){if(z.k80)return w80ZoneRadio(z);const L={brood:['КОЛЫБЕЛЬ','#ff9fb8','…[кладка] просыпается. Не смотри…'],choir:['КОЛЫБЕЛЬ','#ff9fb8','…слушай. Это не для тебя. Но слушай…'],herd:['КОЛЫБЕЛЬ','#ff9fb8','…[дети] идут к узлу. Им туда нельзя…'],midwife:['СТРАЖ','#ff6b8a','Колыбель подлежит зачистке. Объект 013 — не вмешиваться.'],
    wing:['ФЛОТ','#b8c4d6','Звено 7: ведущий на связи. Ведомые — на связи 0.'],funeral:['СТРАЖ','#ff6b8a','Конвой. Хороним по уставу. Не мешать.'],fireships:['ФЛОТ','#b8c4d6','Брандеры — к цели без опознавания.'],boat:['ФЛОТ','#b8c4d6','Это шлюпка 4. Нас трое. Мы видим вас. Вы — Страж?']}[z.k74];if(L)radioLine(L[0],L[1],L[2],.4);}
function w74Sp(z,t,x,y,o){const e=spawnEnemy(t,x,y,Object.assign({spawnT:.7,zone:z,noAffix:true},o||{}));if(e&&!(o&&o.full)){e.hp*=PATROL_HP_K;e.maxHp=e.hp;}z.n++;return e;}
function w74ZoneSpawn(z){if(z.k80)return w80ZoneSpawn(z);const p=G.player,R=(r)=>[z.x+rnd(-r,r),z.y+rnd(-r,r)];z.t74=0;z.out74=null;z.prov74=0;z.solo=null;z.boat=null;
  switch(z.k74){
    case 'brood':for(let i=0;i<6;i++){const a=i/6*TAU;w74Sp(z,'cocoon',z.x+Math.cos(a)*200,z.y+Math.sin(a)*200);}for(let i=0;i<2;i++)w74Sp(z,'pestun',...R(160));break;
    case 'choir':for(let i=0;i<3;i++){const a=i/3*TAU,e=w74Sp(z,'singer',z.x+Math.cos(a)*160,z.y+Math.sin(a)*160);if(!i){z.solo=e;e.solo=true;}}for(let i=0;i<6;i++)w74Sp(z,'unborn',...R(220));break;
    case 'herd':for(let i=0;i<2;i++)w74Sp(z,'pestun',...R(160));for(let i=0;i<8;i++)w74Sp(z,'unborn',...R(240));break;
    case 'midwife':for(let i=0;i<4;i++){const a=i/4*TAU+.4;w74Sp(z,'cocoon',z.x+Math.cos(a)*230,z.y+Math.sin(a)*230,{hatch0:40});}for(let i=0;i<2;i++)w74Sp(z,'guard',z.x+(i?60:-60),z.y-60,{n74:'midwife'});break;
    case 'wing':{const a0=Math.atan2(p.y-z.y,p.x-z.x);for(let i=0;i<5;i++){const e=w74Sp(z,'autopilot',z.x-Math.cos(a0)*i*40+Math.sin(a0)*(i%2?1:-1)*i*30,z.y-Math.sin(a0)*i*40);if(!i){z.solo=e;e.solo=true;}}break;}
    case 'funeral':{const sc=WORLD.sectors[5].box;z.dest={x:z.x<(sc[0]+sc[2])/2?sc[0]+250:sc[2]-250,y:z.y};for(let i=0;i<2;i++){const e=w74Sp(z,'guard',z.x+(i?50:-50),z.y,{n74:'tow'});e.fo=i?50:-50;}z.wreck={x:z.x,y:z.y+70};break;}
    case 'fireships':for(let i=0;i<4;i++){const a=i/4*TAU;w74Sp(z,'fireship',p.x+Math.cos(a)*520,p.y+Math.sin(a)*520);}break;
    case 'boat':{const sc=WORLD.sectors[5].box;z.boat={x:z.x,y:z.y,hp:300,maxHp:300,alive:true,r:16,tx:clamp(z.x+(z.x<(sc[0]+sc[2])/2?1:-1)*1500,sc[0]+300,sc[2]-300),ty:z.y};G.w74b=z.boat;z.w2=0;
      for(let i=0;i<3;i++)w74Sp(z,'cadet',...R(380),{boatAtk:true});w74Sp(z,'gunner',...R(380),{boatAtk:true});break;}}}
function w74ZoneTick(dt){const p=G.player;for(const z of W74.zones){if(!z.active)continue;z.t74=(z.t74||0)+dt;
    if(z.k74==='choir'&&z.solo&&!z.solo.alive&&!z.broke){z.broke=1;for(const e of G.enemies)if(e.alive&&e.zone===z&&e.type==='singer'){e.alive=false;explode(e.x,e.y,'#ffd0e0',14,.7);}floater(p.x,p.y-40,'СОЛИСТ СНЯТ · ХОР РАСПАЛСЯ','#ffd0e0');}
    if(z.k74==='wing'&&z.solo&&!z.solo.alive&&!z.broke){z.broke=1;const left=G.enemies.filter(e=>e.alive&&e.zone===z);if(left.length===4){for(const e of left)e.rogue=true;floater(p.x,p.y-40,'ВЕДУЩИЙ СБИТ · ЗВЕНО СТРЕЛЯЕТ ДРУГ В ДРУГА','#c9d2de');}}
    if(z.k74==='funeral'&&z.wreck){const g=G.enemies.filter(e=>e.alive&&e.zone===z);if(g.length){const cx=g.reduce((a,e)=>a+e.x,0)/g.length,cy=g.reduce((a,e)=>a+e.y,0)/g.length;z.wreck.x+=(cx-z.wreck.x)*Math.min(1,dt*2);z.wreck.y+=(cy+70-z.wreck.y)*Math.min(1,dt*2);}}
    if(z.k74==='boat'&&z.boat){const B=z.boat;if(B.alive){const near=Math.hypot(p.x-B.x,p.y-B.y)<650;if(near){const dx=B.tx-B.x,dy=B.ty-B.y,d=Math.hypot(dx,dy);if(d>8){B.x+=dx/d*70*dt;B.y+=dy/d*70*dt;}}
        for(const b of G.eb){if(b.life>0&&Math.hypot(b.x-B.x,b.y-B.y)<B.r+4){b.life=0;B.hp-=b.dmg;}}
        if(z.t74>15&&!z.w2){z.w2=1;for(let i=0;i<2;i++)w74Sp(z,'cadet',B.x+rnd(-420,420),B.y+rnd(-420,420),{boatAtk:true});w74Sp(z,'autopilot',B.x+rnd(-420,420),B.y-400);}
        if(B.hp<=0){B.alive=false;z.out74='lost';explode(B.x,B.y,'#7affc9',30,1);floater(B.x,B.y-30,'ШЛЮПКА ПОТЕРЯНА','#ff4f6e');}
        else if(Math.hypot(B.tx-B.x,B.ty-B.y)<30){B.alive=false;z.out74='saved';for(const e of G.enemies)if(e.alive&&e.zone===z){e.alive=false;explode(e.x,e.y,EDEF[e.type].col,6,.4);}floater(B.x,B.y-30,'ШЛЮПКА В БЕЗОПАСНОСТИ','#7affc9');}}}}}
function w74ZoneDone(z){if(z.k80)return w80ZoneDone(z);const S=G.save,p=G.player,ws=w74S(),first=!ws.zd[z.k74];ws.zd[z.k74]=1;z.active=false;z.cool=first?900:1200;let v=Math.round((first?10+z.n*3:3)*3),msg='ПАТРУЛЬ РАЗБИТ';
  if(z.k74==='brood'&&z.t74<12){v*=2;msg='ВЫВОДОК РАЗБИТ ЗА 12 С · ЛОМ ×2';}
  if(z.k74==='midwife'&&z.out74==='helped'){v=Math.round(v*.6);msg='ПОВИТУХИ УШЛИ · ВЫ НЕ ВМЕШАЛИСЬ';radioLine('СТРАЖ','#ff6b8a','Объект 013 не вмешался. Зафиксировано.',.4);}
  if(z.k74==='funeral'&&z.out74==='passed'){v=Math.round(v*.6);msg='ПРОЦЕССИЯ ПРОШЛА';if(!ws.pois.funeral){ws.pois.funeral=1;toast('ПРИКАЗ · ХОРОНИТЬ ПО УСТАВУ','«Корпус флагманского звена — к краю сектора. Рубку не вскрывать. Экипаж не тревожить». Стражи хоронят тех, кого не стали убивать.');}}
  if(z.k74==='boat'){if(z.out74==='saved'){v+=60;msg='ШЛЮПКА СПАСЕНА · ТРОЕ ЖИВЫ';if(!ws.pois.boat){ws.pois.boat=1;toast('ШЛЮПКА 4','«Нас трое. Вы не Страж — Стражи бы просто прошли мимо. Спасибо. Мы не знаем, куда теперь лететь, но мы живы».');}}else if(z.out74==='lost'){v=Math.round(v*.4);msg='ШЛЮПКА ПОТЕРЯНА';}G.w74b=null;}
  S.carry+=v;if(first)addPilotXP(25);floater(p.x,p.y-40,msg+' · +'+v+' ЛОМА'+(first?'':' · ПОВТОР'),'#c9d2de');sfx('level');conEvent('patrol');conEvent('patrol');if(G.event==='zone')G.event=null;saveWorld();return true;}
function w74WorldTick(dt){const S=G.save,p=G.player;if(!S||!p)return;w74Gen();const ws=w74S();w74ZoneTick(dt);t74Tick(dt);
  if(p.hp<=0)return;for(const q of W74.pois){if(ws.pois[q.id])continue;const d=Math.hypot(p.x-q.x,p.y-q.y);if(d>(q.kind==='save33'?140:70))continue;
    if(q.kind==='jr'){ws.pois[q.id]=1;const J=W74_JR[q.id];toast(J[0],J[1]+' (+20 ЛОМА)');S.lom+=20;sfx('pick');explode(q.x,q.y,q.sec===4?'#ff9fb8':'#b8c4d6',16,.7);saveWorld();}
    else if(q.kind==='glyph'){ws.pois[q.id]=1;ws.glyph=(ws.glyph||0)+1;S.lom+=15;sfx('pick');explode(q.x,q.y,'#ff9fb8',14,.7);
      if(ws.glyph>=5){toast('ПЕРЕВОД ЗАВЕРШЁН','«Мы сохранили наших мёртвых. Цена — наши нерождённые. Мы не жалеем. Мы просто считаем». Глиф найден: скин «Глиф» в ангаре.');if(!S.ownSkins.includes('glyph'))S.ownSkins.push('glyph');banner('СКИН НАЙДЕН · «ГЛИФ»','ПЯТЬ ГЛИФОВ · АНГАР «ЗЕРКАЛО»');}
      else toast('ГЛИФ '+ws.glyph+'/5',W74_GLYPH[ws.glyph-1]+' (+15 ЛОМА)');saveWorld();}
    else if(q.kind==='save33'&&!ws.save33){for(const [k,ox] of [['dead',-60],['unborn',60]]){if(Math.hypot(p.x-(q.x+ox),p.y-q.y)<40){ws.save33=k;ws.pois[q.id]=1;if(S.story)S.story.save33=k;
          banner(k==='dead'?'СОХРАНЕНА ЗАПИСЬ МЁРТВОГО ВИДА':'СОХРАНЁН ЗАРОДЫШ','ПИТАНИЯ ХВАТИЛО НА ОДНОГО · КОРМИЛИЦА ЗАПОМНИТ');sfx('level');saveWorld();break;}}}}}
function w74Draw(t){if(!W74.gen)return;const ws=w74S();
  for(const q of W74.pois){if(ws.pois[q.id]&&q.kind!=='save33')continue;if(!inView(q.x,q.y,160))continue;
    if(q.kind==='jr'){glow(q.x,q.y,30,q.sec===4?'#ff9fb8':'#b8c4d6',.5+.3*Math.sin(t*3));ctx.save();ctx.translate(q.x,q.y);ctx.rotate(Math.PI/4);ctx.strokeStyle=q.sec===4?'#ff9fb8':'#d6dee8';ctx.lineWidth=2;ctx.strokeRect(-8,-8,16,16);ctx.restore();worldLabel(q.x,q.y-24,'ЗАПИСЬ','#c9d2de');}
    else if(q.kind==='glyph'){glow(q.x,q.y,34,'#ff9fb8',.5+.3*Math.sin(t*2));ctx.save();ctx.translate(q.x,q.y);ctx.rotate(t*.5);ctx.strokeStyle='#ffd0e0';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,10,0,4.5);ctx.moveTo(-10,0);ctx.lineTo(10,0);ctx.moveTo(0,-14);ctx.lineTo(0,6);ctx.stroke();ctx.restore();worldLabel(q.x,q.y-26,'ГЛИФ','#ff9fb8');}
    else if(q.kind==='save33'){for(const [k,ox] of [['dead',-60],['unborn',60]]){const chosen=ws.save33===k,dim=ws.save33&&!chosen;const x=q.x+ox,y=q.y;ctx.globalAlpha=dim?.35:1;glow(x,y,30,k==='dead'?'#9fb0c4':'#ff9fb8',chosen?.8:.4);ctx.fillStyle='#0b0f18';ctx.strokeStyle=k==='dead'?'#c9d2de':'#ff9fb8';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,12,20,0,0,TAU);ctx.fill();ctx.stroke();ctx.globalAlpha=1;
        worldLabel(x,y-32,k==='dead'?'ЗАПИСЬ МЁРТВОГО ВИДА':'ЗАРОДЫШ',k==='dead'?'#c9d2de':'#ff9fb8');}if(!ws.save33)worldLabel(q.x,q.y+40,'ПИТАНИЯ ХВАТИТ НА ОДНОГО','#9fb0c4');}}
  for(const z of W74.zones){if(!z.active)continue;if(z.k74==='funeral'&&z.wreck&&inView(z.wreck.x,z.wreck.y,80)){const w=z.wreck;ctx.save();ctx.translate(w.x,w.y);ctx.fillStyle='#10151f';ctx.strokeStyle='#6b7688';ctx.lineWidth=2;ctx.fillRect(-50,-14,100,28);ctx.strokeRect(-50,-14,100,28);ctx.restore();
      for(const e of G.enemies)if(e.alive&&e.zone===z){ctx.strokeStyle='#ffb84d';ctx.globalAlpha=.4;ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(w.x,w.y);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}}
    if(z.k74==='boat'&&z.boat&&z.boat.alive){const B=z.boat;ctx.save();ctx.translate(B.x,B.y);ctx.rotate(Math.atan2(B.ty-B.y,B.tx-B.x));glow(0,0,24,'#7affc9',.5);ctx.fillStyle='#0b1a14';ctx.strokeStyle='#7affc9';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-10,-9);ctx.lineTo(-10,9);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
      ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(B.x-22,B.y+20,44,4);ctx.fillStyle='#7affc9';ctx.fillRect(B.x-22,B.y+20,44*B.hp/B.maxHp,4);worldLabel(B.x,B.y-26,'ШЛЮПКА 4 · ДЕРЖИТЕСЬ РЯДОМ','#7affc9');
      ctx.strokeStyle='#7affc9';ctx.globalAlpha=.3;ctx.setLineDash([6,8]);ctx.beginPath();ctx.moveTo(B.x,B.y);ctx.lineTo(B.tx,B.ty);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}}}
function w74DrawTop(t){d74Draw(t);}
function w74MapAdd(add,lod,S){w74Gen();if(!W74.gen)return;const ws=w74S();
  for(const q of W74.pois){if(ws.pois[q.id]||!revealedAt(q.x,q.y))continue;add(q.kind==='jr'?'j74':q.kind==='glyph'?'glyph74':'save74',q.x,q.y,{sec:q.sec},lod===2?{t:q.kind==='jr'?'ЗАПИСЬ':q.kind==='glyph'?'ГЛИФ':'ДВА КОНТЕЙНЕРА',p:6,c:q.sec===4?'#ff9fb8':'#b8c4d6'}:null);}}
function w74MapIcon(g,kind,o,t){switch(kind){
    case 'j74':g.strokeStyle=o.sec===4?'#ff9fb8':'#b8c4d6';g.rotate(Math.PI/4);g.strokeRect(-4,-4,8,8);return true;
    case 'glyph74':g.strokeStyle='#ff9fb8';g.beginPath();g.arc(0,0,5,0,4.5);g.moveTo(-5,0);g.lineTo(5,0);g.stroke();return true;
    case 'save74':g.strokeStyle='#ff9fb8';g.beginPath();g.ellipse(-4,0,3,5,0,0,TAU);g.stroke();g.strokeStyle='#c9d2de';g.beginPath();g.ellipse(4,0,3,5,0,0,TAU);g.stroke();return true;}
  return false;}
// --- скины ---
Object.assign(SKINS,{
  unborn:{name:'Нерождённый',col:'#ffc2d4',bul:'#ffe0ea',trail:'#ff9fb8',d:'Полупрозрачный корпус с розовым ядром. VØID-014б: номер следующего цикла.',unlock:0,find:'СЕКТОР V · ВЫНОСИТЬ'},
  glyph:{name:'Глиф',col:'#ff9fb8',bul:'#ffd0e0',trail:'#ff6b8a',d:'Корпус, расписанный чужими буквами. Пять слов, одна фраза.',unlock:0,find:'СЕКТОР V · ПЯТЬ ГЛИФОВ'},
  argument:{name:'Довод',col:'#d6dee8',bul:'#ffffff',trail:'#b8c4d6',d:'Тёмная броня флагмана с белой полосой. Последний аргумент флота.',unlock:0,find:'СЕКТОР VI · ФЛАГМАН'}});
STORY_HULL.unborn='VØID-014б. Выношен Кормилицей. Номер следующего цикла — его.';STORY_HULL.glyph='Корпус без номера. Пять чужих слов на броне: «мы сохранили наших мёртвых».';STORY_HULL.argument='Броня флагмана «Последний довод». Рубка цела — так решили вы.';
HULL_NUM.unborn='014б';HULL_NUM.glyph='∅';HULL_NUM.argument='Ф-1';
function w74DrawSkin(id,t,sp,o,A,fl,edge){
  if(id==='unborn'){glow(0,0,14,'#ff9fb8',.6);ctx.fillStyle='rgba(255,194,212,.28)';ctx.strokeStyle=edge;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(19,0);ctx.quadraticCurveTo(4,-12,-12,-9);ctx.quadraticCurveTo(-6,0,-12,9);ctx.quadraticCurveTo(4,12,19,0);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#ff6b8a';ctx.beginPath();ctx.arc(2,0,3+.6*Math.sin(t*6),0,TAU);ctx.fill();return true;}
  if(id==='glyph'){ctx.fillStyle='#1a0812';ctx.strokeStyle=edge;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(18,0);ctx.lineTo(-12,-11);ctx.lineTo(-6,0);ctx.lineTo(-12,11);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='#ffd0e0';ctx.lineWidth=1;ctx.beginPath();ctx.arc(-2,-4,3,0,4.5);ctx.moveTo(-6,3);ctx.lineTo(2,3);ctx.moveTo(6,-2);ctx.lineTo(6,3);ctx.stroke();return true;}
  if(id==='argument'){ctx.fillStyle='#0e131c';ctx.strokeStyle=edge;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(20,0);ctx.lineTo(10,-9);ctx.lineTo(-14,-9);ctx.lineTo(-18,0);ctx.lineTo(-14,9);ctx.lineTo(10,9);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#ffffff';ctx.fillRect(-12,-1.5,26,3);glow(-18,0,fl,'#8fe9ff',.6);return true;}
  return false;}

// 0.7.4: стопка монологов на телефоне — под полосой корпуса, друг под другом
function mobStack74(){if(!isMob())return;{const r_=document.getElementById('radio'),t_=document.getElementById('toast'),f_=document.getElementById('fragTxt');if((!r_||r_.hidden)&&(!t_||t_.hidden)&&(!f_||!f_.classList.contains('on')))return;}const hb=document.getElementById('hpB');let y=46,x=10;
  if(hb){let yb=0;for(const id of ['hpB','sigB','bcB','biB','jamB','bossB','enB','b85G','x90G']){const el=document.getElementById(id);if(!el)continue;const bar=el.closest('.bar')||el.parentElement,r=bar.getBoundingClientRect();
      if(r.height>0&&r.bottom>0&&r.left<innerWidth*.45&&r.top<innerHeight*.35){const lab=bar.previousElementSibling,lr=lab?lab.getBoundingClientRect():null;yb=Math.max(yb,r.bottom);if(id==='hpB')x=Math.max(8,Math.round(r.left));}}
    if(yb>0)y=Math.round(yb+8);}
  for(const id of ['radio','toast','fragTxt']){const el=document.getElementById(id);if(!el)continue;el.style.top=y+'px';el.style.left=x+'px';el.style.bottom='auto';
    const vis=!el.hidden&&el.offsetHeight>0&&+getComputedStyle(el).opacity>.05;if(vis)y+=el.offsetHeight+6;}}
setInterval(mobStack74,120);

