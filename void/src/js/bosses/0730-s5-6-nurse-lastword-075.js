// ===== 0.7.5: автоприцел видит всех, кого надо убить; Кормилица 2.0; «Последний довод» 2.0 =====
NOAUTO.delete('membrane');NOAUTO.delete('vent');
EDEF.vent.hp=600;EDEF.womb.hp=700;EDEF.flagship.hp=12500;
EDEF.membrane.desc='Живая стена длиной 160 встаёт между вами и стаей. Обычный огонь пробивает её медленно (35% урона), заряд — ×1,5, «Разрыв», импульс и рывок насквозь — полностью. Автоприцел бьёт в ближайшую точку стены. Вражеские снаряды проходят сквозь.';
EDEF.absorber.desc='Вбирает ваши обычные снаряды и «Разрыв» и растёт; на 25 снарядах лопается веером из 25 выстрелов. Ранит его заряд, импульс или таран. Автоприцел выбирает его последним; после двух веёров он «устаёт» и берёт обычный урон.';
EDEF.nurse.desc='Последняя живая колыбель на четырёх пуповинах. Фаза 1 «Колыбельная»: каждая целая пуповина снимает 20% урона по телу; у утроб есть прочность — обычный огонь рвёт их, заряд ×4, «Разрыв» ×2, импульс сразу 40%. Кормилица кормит раненую утробу светящейся нитью — порвите нить. Кольца песни расходятся с «окном». Фаза 2 «Схватки»: арена сжимается (край вспыхивает заранее), на выдохе броня 70%, на вдохе урон ×1,5; Зародыш, убитый рядом с ней, заставляет вдохнуть. Фаза 3 «Последний ребёнок»: лепестки вокруг кокона отражают снаряды — бейте в зазоры; кольца с узким окном и сплошные (рывок). На 15% — колыбельная: враги засыпают, урон ×2. В финале выбор: прервать или выносить.';
EDEF.flagship.desc='Флагман флота и его адмирал. Пять секций и рубка: автоприцел бьёт по секциям; каждая выбитая секция снимает с рубки 15% брони. Бортовые залпы веером, прожектор рубки (1,5 с в луче — залп прицельный; корпуса-укрытия рвут луч). Фаза 2: с живым двигателем — таран по линии, с выбитым — вращение и ангар; не прижимайтесь к борту — откроется шлюз. Фаза 3: рубка открыта (×1,5), заряд по ней оглушает, «Последний довод» и полоса залпа. Выборы сектора приходят на помощь. В финале: по рубке или по двигателям.';
SEC_TEXT[20].hint[0]='Пестуны рассаживают коконы по углам — ловите их до посадки. Мембрану обычный огонь пробивает медленно, заряд, «Разрыв», импульс и рывок насквозь — быстро. Споровик сбивает ваши снаряды облаком — импульс его разгоняет.';
SEC_TEXT[22].hint=['Пуповины рвёт и обычный огонь, но заряд — вчетверо быстрее. Пока пуповины целы, по телу проходит лишь часть урона. Кормилица кормит раненую утробу нитью — порвите нить. Кольца песни расходятся с окном. Молоко порванной утробы лечит и ускоряет стрельбу.','Фаза 2: бейте на вдохе, убивайте Зародышей рядом с ней. Фаза 3: стреляйте в зазоры между лепестками; сплошное кольцо — рывок. В финале выберите: прервать или выносить.'];
SEC_TEXT[27].hint=['«Последний довод» бьёт бортами — держитесь у носа и кормы, но не у самого борта: откроется шлюз. Автоприцел выбивает секции; каждая снимает броню с рубки. Прячьтесь от прожектора за корпусами.','Фаза 3: рубка открыта, заряд по ней оглушает флагман. Быстро разбейте последнюю волну — флагман выйдет без охраны. В финале: по рубке или по двигателям.'];
MASTERY[21]={t:'Ни разу не коснуться стены утробы',ok:()=>!!G.mc&&!!G.mc.nurse74&&!G.mc.wall74};
// --- автоприцел ---
/* ARCH·85 · снято недостижимое объявление aimPt (1 из 2; действует последнее объявление) */
/* ARCH·85 · снято недостижимое объявление nearestEnemy (2 из 3; действует последнее объявление) */
const AIM_SKIP75=new Set(['mine','crate','shell','hull','lastkind','echoship','echoguard']);
/* ARCH·81 → aimFallback перенесена в блок «ПОДСИСТЕМА НАВЕДЕНИЯ» после nearestEnemy */
function sb75Auto(p,b){const near=nearestEnemy(p.x,p.y,210);if(near&&!SB74T.has(near.type))return near;
  if(b.sbk==='nurse'){let best=null,bd=1e9;for(const w of b.wombs||[]){if(!w.alive||!targetable(w))continue;const d=Math.hypot(w.x-p.x,w.y-p.y);if(d<bd){bd=d;best=w;}}if(best&&bd<760)return best;return targetable(b)?b:null;}
  if(b.phase<3){let best=null,bd=1e9;for(const q of b.parts||[]){if(!q.alive||!targetable(q))continue;const d=Math.hypot(q.x-p.x,q.y-p.y);if(d<bd){bd=d;best=q;}}if(best&&bd<760)return best;}
  return targetable(b)&&Math.hypot(b.x-p.x,b.y-p.y)<800?b:null;}
// --- урон по особым целям ---
function s74Hurt(e,dmg,src){if(S90T.has(e.type))return s90Hurt(e,dmg,src);if(SB85T.has(e.type))return s85Hurt(e,dmg,src);if(S80T.has(e.type))return s80Hurt(e,dmg,src);
  if(e.n74&&G.world){const z=e.zone;for(const o of G.enemies)if(o.zone===z&&o.n74)o.n74=null;if(z&&!z.prov74){z.prov74=1;if(z.k74==='midwife')radioLine('СТРАЖ','#ff6b8a','Ты опять на их стороне.',.3);if(z.k74==='funeral')radioLine('СТРАЖ','#ff6b8a','Ты не дал им даже этого.',.3);}}
  if(e.type==='absorber'){if(src.charged||src.pulse||src.ram||e.tired)return dmg*(src.pulse?3:1);e.shieldFlash=.1;return 0;}
  if(e.type==='membrane'){if(src.charged)return dmg*1.5;if(src.blast||src.pulse||src.ram||e.tired||src.memb)return dmg;e.shieldFlash=.1;return dmg*.35;}
  if(e.type==='vent'){if(src.charged)return e.hp+1;if(src.blast||src.pulse){e.vh=(e.vh||0)+.5;if(e.vh>=1)return e.hp+1;}return dmg;}
  if(e.type==='turncoat'&&!src.pulse&&!src.blast&&!src.ap){const p=G.player;const a=Math.atan2(p.y-e.y,p.x-e.x);if(Math.abs(Math.sin(angDiff(a,e.face||0)))>.72){e.shieldFlash=.1;if(!e.sideHint){e.sideHint=1;floater(e.x,e.y-e.r-14,'БОРТ · ЗАХОДИТЕ С НОСА','#ffb84d');}return dmg*.45;}}
  if(e.type==='boarder'&&G.latch74===e&&src.pulse){boarderOff(e);}
  return dmg;}
function s75Killed(e,silent){const b=G.sb;
  if(e.type==='embryo'&&!silent&&b&&b.sbk==='nurse'&&b.phase===2&&b.st==='fight'&&Math.hypot(e.x-b.x,e.y-b.y)<150+b.r){b.breath=0;b.inhale=true;floater(b.x,b.y-b.r-24,'ВДОХ ВЫЗВАН','#ffe0ea');}
  if(e.roll75&&!silent&&b&&b.sbk==='flag'&&b.st==='fight'){b.hp=Math.max(1,b.hp-b.maxHp*.02);sbCheckTh(b);floater(e.x,e.y-20,'НА СВЯЗИ 0 · −2%','#b8c4d6');}}
// --- снаряды игрока ---
function hullBlocks75(x1,y1,x2,y2){const X=x74();for(const h of X.hulls)for(let i=1;i<10;i++){const k=i/10;if(hullIn(h,x1+(x2-x1)*k,y1+(y2-y1)*k,0))return true;}return false;}
function b74Hit(b){if(!G.world&&!inMission())return false;if(b80Hit(b))return true;const X=G.world?G.w74r:G.x74;if(!X)return false;
  for(const h of X.hulls){if(hullIn(h,b.x,b.y,2)){b.life=0;if(SET.fx)part(b.x,b.y,vrnd3(-60,60),vrnd3(-60,60),.2,'#9fb0c4',2);return true;}}
  for(const e of G.enemies){if(e.type!=='absorber'||!e.alive||e.spawnT>0||b.charged||e.tired)continue;if(segDist(b.px,b.py,b.x,b.y,e.x,e.y)>e.r+3)continue;
    b.life=0;b.det=true;e.ab=(e.ab||0)+1;e.flash=.05;if(SET.fx)part(b.x,b.y,vrnd3(-30,30),vrnd3(-30,30),.25,'#ff9fe0',2);
    if(e.ab>=25){e.ab=0;e.bursts=(e.bursts||0)+1;for(let i=0;i<25;i++)shootE(e.x,e.y,i/25*TAU+rnd(-.05,.05),230,8,'#ff9fe0',5);explode(e.x,e.y,'#ff9fe0',20,.8);sfx('boom');
      if(e.bursts>=2){e.tired=true;floater(e.x,e.y-26,'ПОГЛОТИТЕЛЬ УСТАЛ · БЕРЁТ ОБЫЧНЫЙ УРОН','#ff9fe0');}else floater(e.x,e.y-26,'ПОГЛОТИТЕЛЬ ЛОПНУЛ · БЕЙТЕ ЗАРЯДОМ','#ff9fe0');}
    else if(e.ab===15)floater(e.x,e.y-e.r-12,'ПЕРЕПОЛНЕН · 15/25','#ff9fe0');return true;}
  for(const e of G.enemies){if(e.type!=='membrane'||!e.alive||e.spawnT>0||e.tired)continue;const s=memSeg(e);if(!segInter(b.px,b.py,b.x,b.y,s[0],s[1],s[2],s[3]))continue;
    if(b.blast){b.life=0;return true;}
    if(b.charged){if(!b.hit.includes(e)){b.hit.push(e);hurt(e,b.dmg,{charged:true});}continue;}
    hurt(e,b.dmg*.35,{memb:true});b.life=0;e.shieldFlash=.08;if(SET.fx)part(b.x,b.y,vrnd3(-40,40),vrnd3(-40,40),.3,'#ff8fa8',2.5);return true;}
  const B=G.sb;
  if(B&&B.alive&&B.sbk==='nurse'&&B.st==='fight'){
    if(B.feed&&B.feed.w&&B.feed.w.alive&&segInter(b.px,b.py,b.x,b.y,B.x,B.y,B.feed.w.x,B.feed.w.y)){B.feed.hits+=b.charged?3:1;if(!b.charged)b.life=0;if(B.feed.hits>=3)nuFeedBreak(B);return !b.charged;}
    if(B.phase===3&&!B.lull){const d=Math.hypot(b.x-B.x,b.y-B.y);if(d>B.r+18&&d<B.r+48){const a=Math.atan2(b.y-B.y,b.x-B.x);for(let i=0;i<3;i++){const pa=(B.petA||0)+i*TAU/3;if(Math.abs(angDiff(a,pa))<.36){b.life=0;const p=G.player;shootE(b.x,b.y,Math.atan2(p.y-b.y,p.x-b.x),260,6,'#ffd0e0',4);if(SET.fx)part(b.x,b.y,0,0,.2,'#ffffff',3);return true;}}}}}
  if(B&&B.alive&&B.sbk==='flag'&&B.st==='fight'&&B.resp){for(const [role,ox,oy] of FL_PARTS){const rt=B.resp[role];if(rt===undefined||rt>8)continue;const c=Math.cos(B.ang),s_=Math.sin(B.ang),x=B.x+ox*c-oy*s_,y=B.y+ox*s_+oy*c;
      if(Math.hypot(b.x-x,b.y-y)<30){B.resp[role]=Math.min(25,rt+1.5);b.life=0;if(SET.fx)part(x,y,vrnd3(-50,50),vrnd3(-50,50),.3,'#ffd36b',2);return true;}}}
  for(const s of X.spores){if(Math.hypot(b.x-s.x,b.y-s.y)<s.r){b.vx*=.94;b.vy*=.94;const a=rnd(-.08,.08),c=Math.cos(a),sn=Math.sin(a),vx=b.vx*c-b.vy*sn;b.vy=b.vx*sn+b.vy*c;b.vx=vx;b.life-=.004;}}
  for(const w of X.wells){if(!w.on)continue;const dx=w.x-b.x,dy=w.y-b.y,d=Math.hypot(dx,dy);if(d<320&&d>1){const k=900*(1-d/320)/60;b.vx+=dx/d*k;b.vy+=dy/d*k;}}
  return false;}
// --- урон по боссам ---
function nuK(b){if(!b||b.st!=='fight')return 0;let k=1;
  if(b.phase===1){k=b.stagger>0?1:1-.2*(b.wombs||[]).filter(w=>w.alive).length;}
  else if(b.phase===2){k=b.inhale?1.5:.3;if(storyFlag('save33')==='unborn')k*=1.25;}
  if(b.lull>0)k*=2;return Math.max(.2,k);}
function nuOpen(b){return !!b&&b.st==='fight'&&nuK(b)>=1;}
function flDead(b){return FL_PARTS.filter(([r])=>!flRole(b,r)).length;}
function flK(b){return b.phase>=3?1.5:Math.min(1.1,(b.phase===2?.5:.35)+.15*flDead(b));}
function sb74Hurt(e,dmg,src){const b=G.sb;if(!b||!b.alive){if(e.type==='nurse'||e.type==='flagship')return 0;return dmg;}src=src||{};
  if(e.type==='nurse'){if(b.st!=='fight'||b.inv0>0){sbBlock(e);return 0;}const k=nuK(b);if(k<1){e.domeFlash=.08;}return dmg*k;}
  if(e.type==='womb'){if(b.st!=='fight'||e.spawnT>0){sbBlock(e);return 0;}e.flash=.1;if(src.pulse)return Math.max(dmg,e.maxHp*.4);return dmg*(src.charged?4:src.blast?2:1);}
  if(e.type==='flagship'){if(b.st!=='fight'||b.inv0>0){sbBlock(e);return 0;}if(b.lock&&src.charged){b.lock=null;floater(b.x,b.y-60,'ШЛЮЗ ЗАКРЫТ','#ffb84d');}
    if(b.phase>=3&&src.charged&&!(b.stun75>0)){b.stun75=2;floater(b.x,b.y-60,'РУБКА ОГЛУШЕНА · 2 С','#ffffff');sfx('block');}return dmg*flK(b);}
  if(e.type==='fpart'){if(b.st!=='fight'||b.inv0>0||e.spawnT>0){sbBlock(e);return 0;}if(b.lock&&src.charged){b.lock=null;floater(b.x,b.y-60,'ШЛЮЗ ЗАКРЫТ','#ffb84d');}b.hp-=dmg*.6*(1-(e.secArm||0));b.flash=.07;sbCheckTh(b);return dmg;}
  return dmg;}
function sb74Targetable(e){const b=G.sb;if(!b)return false;if(e.type==='womb'||e.type==='nurse'||e.type==='flagship'||e.type==='fpart')return b.st==='fight'&&e.spawnT<=0;return true;}
// --- фазы и финал ---
function sb74Phase(b){ambSting('phase');b.phase++;b.open=0;b.inv0=2;G.eb=G.eb.filter(x=>x.rift);
  G.shock.push({x:b.x,y:b.y,r:20,R:Math.max(W,H),t:0,col:EDEF[b.type].col,slow:true});sfx('bigboom');shake(14);
  const names=b.sbk==='nurse'?NU_PHASES:FL_PHASES;banner(SB_NAMES[b.sbk]+' · ФАЗА '+b.phase,names[b.phase-1]+(b.sbk==='nurse'&&b.phase===2?' · БЕЙТЕ НА ВДОХЕ':b.sbk==='nurse'&&b.phase===3?' · БЕЙТЕ В ЗАЗОРЫ':b.sbk==='flag'&&b.phase===3?' · ЗАРЯД ОГЛУШАЕТ':''));
  if(b.sbk==='nurse'){b.rings=[];b.cycle=0;b.breath=2.5;b.inhale=false;b.feed=null;b.dark=2;
    if(b.phase===2)radioLine('КОРМИЛИЦА','#ff9fb8','…[схватки]. Не мешай. Это не для тебя…',1);
    if(b.phase===3){b.petA=0;radioLine('КОРМИЛИЦА','#ff9fb8','…последний. Его контур — твой. Номер — [следующий]…',1);}}
  else{b.bs=null;b.ram=null;b.lock=null;
    if(b.phase===2){radioLine('АДМИРАЛ КАРР','#b8c4d6','Девять часов. Они били только в двигатели. Почему не в рубку?',1);
      if(storyFlag('teo')===1){const bat=flRole(b,'batL')||flRole(b,'batR');if(bat){bat.distract=10;radioLine('КУРСАНТ ТЕО','#8fe9ff','Это Тео! Отвлеку батарею — десять секунд!',.2);}}}
    if(b.phase===3){radioLine('АДМИРАЛ КАРР','#b8c4d6','Если ты Страж — ответь хоть раз.',1);
      const names=['Фрегат «Северин»','Крейсер «Ладога»','Эсминец «Тихий»'];names.forEach((n,i)=>{radioLine('ПЕРЕКЛИЧКА','#b8c4d6',n+'… на связи?',2+i*1.2);
        const a=rnd(0,TAU),e=spawnEnemy('autopilot',clamp(b.x+Math.cos(a)*260,40,W-40),clamp(b.y+Math.sin(a)*260,40,H-40),{noAffix:true,spawnT:.8+i*.6,escort:true,roll75:true,life75:15});});
      if(storyFlag('echo127')==='guard'){b.echoG=15;b.echoT=1;radioLine('СТРАЖ','#ff6b8a','Тогда ты был на нашей стороне. Мы — тоже. По двигателям.',.5);}
      if(storyFlag('box81')===1){b.salT=(b.salT||0)+3;radioLine('АДМИРАЛ КАРР','#b8c4d6','Тот доклад… «мы живы». Я читал его. …Огонь.',.4);}}}}
function sb74Final(b){b.st='final';b.timer=20;b.open=0;b.warn5=0;G.eb=G.eb.filter(x=>x.rift);const prev=G.mode==='world'?storyFlag(SB_FLAG[b.sbk]):null;
  if(b.sbk==='nurse'){b.rings=[];b.feed=null;b.lull=0;b.docks=[{kind:'cut',x:b.cx-140,y:b.cy+b.R0*.45,ch:0},{kind:'keep',x:b.cx+140,y:b.cy+b.R0*.45,ch:0}];
    banner('ПОСЛЕДНИЙ РЕБЁНОК','ПРЕРВАТЬ ИЛИ ВЫНОСИТЬ · 20 С');radioLine('КОРМИЛИЦА','#ff9fb8','…решай. Колыбель на одного. Как всегда.',.5);}
  else{b.bs=null;b.sal=[];b.ram=null;b.lock=null;b.docks=[{kind:'bridge',x:W/2-150,y:H*.62,ch:0},{kind:'engine',x:W/2+150,y:H*.62,ch:0}];
    banner('ПОСЛЕДНИЙ ВЫСТРЕЛ','ПО РУБКЕ ИЛИ ПО ДВИГАТЕЛЯМ · 20 С');radioLine('АДМИРАЛ КАРР','#b8c4d6','…ты не Страж. Ты похож на них. Но ты тонешь, как мы.',.5);}
  if(prev)for(const d of b.docks){if(d.kind!==prev)d.off=true;else d.prev=true;}
  for(const d of b.docks){d.x=clamp(d.x,60,W-60);d.y=clamp(d.y,60,H-60);}
  sfx('level');}
function sb74Docks(b,dt){const p=G.player;if(!b.docks||p.hp<=0)return false;
  if(b.timer<5&&!b.warn5){b.warn5=1;buzz('ready');sfx('warn');}
  for(const d of b.docks){if(d.off)continue;if(Math.hypot(p.x-d.x,p.y-d.y)<44){d.ch+=dt;if(d.ch>=.6){sbChoose(b,d.kind);return true;}}else d.ch=0;}return false;}
function sb74Choose(b,ch){if(b.choice||(b.st!=='final'&&b.st!=='fight'))return;const S=G.save,world=G.mode==='world'&&S;
  const prev=world?storyFlag(SB_FLAG[b.sbk]):null;if(prev&&!ch)ch=prev;
  if(!ch)ch=b.sbk==='nurse'?(Math.random()<.5?'cut':'keep'):(Math.random()<.5?'bridge':'engine');b.choice=ch;b.docks=null;b.fx75={kind:ch,t:2.6};
  if(ch==='cut'){G.sbLomK=2;G.sbChoiceTxt='Кокон разбит: лом ×2. Следующая копия не родится.';banner('СЛЕДУЮЩАЯ КОПИЯ НЕ РОДИТСЯ','ЛОМ ×2');radioLine('КОРМИЛИЦА','#ff9fb8','…пусто. Как было до нас.',.3);}
  else if(ch==='keep'){G.sbLomK=.5;G.sbChoiceTxt='Кокон выношен: лом ×0,5. «Младший» летит с вами в секторах V–VI, скин «Нерождённый» в ангаре.';banner('МЛАДШИЙ ВЫЛУПИЛСЯ','ЛОМ ×0,5 · СПУТНИК В СЕКТОРАХ V–VI · СКИН «НЕРОЖДЁННЫЙ»');radioLine('КОРМИЛИЦА','#ff9fb8','…лети. Он знает дорогу. Он — ты.',.3);
    if(world&&!S.ownSkins.includes('unborn'))S.ownSkins.push('unborn');G.jr74={a:0,cd:.3,x:b.x,y:b.y};}
  else if(ch==='bridge'){G.sbLomK=2;G.sbChoiceTxt='Рубка пробита: лом ×2. Флот замолчал навсегда.';banner('ПО РУБКЕ','ЛОМ ×2 · ФЛОТ ЗАМОЛЧАЛ');radioLine('АДМИРАЛ КАРР','#b8c4d6','Почему не в…',.1);}
  else{G.sbLomK=1;G.sbChoiceTxt='Выбиты двигатели, адмирал жив: перк «Милость» — отступающие враги сдаются от попадания и отдают лом.';banner('ПО ДВИГАТЕЛЯМ','КАК СТРАЖИ · ПЕРК «МИЛОСТЬ»');radioLine('АДМИРАЛ КАРР','#b8c4d6','Понял. Теперь понял.',.6);
    if(world&&S.story){S.story.spared++;S.story.cyc.spared++;}
    toast('ПРОТОКОЛ СТРАЖА · ДОПОЛНЕНИЕ 7','«Протокол „не объяснять“, дополнение 7. Людей не убивать. Людям не объяснять. Копию VØID — останавливать до вспоминания». Подпись: Э. В., бюро «Предел».');}
  if(b.sbk==='flag'&&world&&!S.ownSkins.includes('argument'))S.ownSkins.push('argument');
  sbDeath(b);}
function sb74Hud(b){const k=SB_NAMES[b.sbk];if(b.st==='dying')return k+' · '+(b.sbk==='nurse'?'ЗАСЫПАЕТ':'ТОНЕТ');if(b.st==='final')return k+' · ВЫБОР · '+Math.ceil(b.timer)+' С';if(b.st==='enter')return k;
  if(b.sbk==='nurse'){const al=(b.wombs||[]).filter(w=>w.alive).length;
    if(b.phase===1)return al?'РВИТЕ ПУПОВИНЫ · '+(4-al)+'/4'+(b.feed?' · ПОРВИТЕ НИТЬ':''):'КОЛЫБЕЛЬНАЯ · ТЕЛО ОТКРЫТО';
    if(b.phase===2)return b.inhale?'ВДОХ · БЕЙТЕ':'ВЫДОХ · БРОНЯ 70%';return b.lull>0?'КОЛЫБЕЛЬНАЯ · УРОН ×2':'ЛЕПЕСТКИ · БЕЙТЕ В ЗАЗОРЫ';}
  if(b.stun75>0)return 'РУБКА ОГЛУШЕНА';if(b.lock)return 'ШЛЮЗ · ЗАРЯД ЗАКРОЕТ';if(b.ram&&b.ram.st==='tele')return 'ТАРАН · УЙДИТЕ С ЛИНИИ';if(b.bs)return 'БОРТОВОЙ ЗАЛП · '+(b.bs.side>0?'ПРАВЫЙ':'ЛЕВЫЙ')+' БОРТ';
  if(b.phase<3)return 'ВЫБЕЙТЕ СЕКЦИИ · '+flDead(b)+'/5 · РУБКА ×'+String(Math.round(flK(b)*100)/100).replace('.',',');return 'РУБКА ОТКРЫТА · ЗАРЯД ОГЛУШАЕТ';}
// --- Кормилица 2.0 ---
function nuInit(b){b.cx=W/2;b.cy=H/2;b.R0=Math.min(W,H)*.47;b.R=b.R0;b.wombs=[];b.ringT=3;b.rings=[];b.ubT=6;b.embT=5;b.sporeT=4;b.cycle=0;b.breath=2.5;b.inhale=false;b.wallCd=0;b.x=b.cx;b.y=b.cy;b.feedT=10;b.feed=null;b.stagger=0;b.ringN=0;b.petA=0;b.lull=0;b.lullDone=false;b.regrown=false;b.firstTorn=0;b.dark=0;}
function nuSpawnWombs(b){b.wombs=[];for(let i=0;i<4;i++){const a=Math.PI/4+i*Math.PI/2;const w=spawnEnemy('womb',b.cx+Math.cos(a)*b.R*.78,b.cy+Math.sin(a)*b.R*.78,{noAffix:true,noLoot:true,spawnT:.8,wa:a});w.hp=w.maxHp=Math.round(EDEF.womb.hp*sbRank());b.wombs.push(w);}}
function nuPlace(b){for(const w of b.wombs){if(!w.alive)continue;w.x=b.cx+Math.cos(w.wa)*b.R*.78;w.y=b.cy+Math.sin(w.wa)*b.R*.78;}}
function nuWall(b,dt){const p=G.player;if(!p||p.hp<=0||b.st==='dying')return;b.wallCd-=dt;const dx=p.x-b.cx,dy=p.y-b.cy,d=Math.hypot(dx,dy)||1,lim=b.R-p.r;
  if(d>lim){p.x=b.cx+dx/d*(lim-1);p.y=b.cy+dy/d*(lim-1);p.vx*=.5;p.vy*=.5;if(b.wallCd<=0&&p.dashT<=0&&b.st==='fight'){b.wallCd=.6;damagePlayer(b.phase===2?10:5);if(G.mc)G.mc.wall74=1;hintOnce('nuwall','МЕМБРАНА УТРОБЫ · НЕ КАСАЙТЕСЬ СТЕНЫ','#ff9fb8');}}}
function nuFeedBreak(b){const w=b.feed&&b.feed.w;b.feed=null;b.stagger=2;b.feedT=12*atkK();if(w)explode((b.x+w.x)/2,(b.y+w.y)/2,'#ffe0ea',14,.7);floater(b.x,b.y-b.r-26,'НИТЬ ПОРВАНА · КОРМИЛИЦА ОТКРЫТА','#ffe0ea');sfx('boom');}
function nuUpdate(b,dt){const p=G.player;if(sbCommon(b,dt))return;sbEscort(b,dt);
  if(b.dark>0)b.dark-=dt;if(b.stagger>0)b.stagger-=dt;
  // в фазах 2–3 тело медленно дрейфует за кораблём, в пределах половины арены
  if(b.st==='fight'&&b.phase>=2&&p.hp>0){const dx=p.x-b.x,dy=p.y-b.y,d=Math.hypot(dx,dy)||1;if(d>b.r+60){b.x+=dx/d*20*dt;b.y+=dy/d*20*dt;}const ox=b.x-b.cx,oy=b.y-b.cy,od=Math.hypot(ox,oy),lim=b.R0*.42;if(od>lim){b.x=b.cx+ox/od*lim;b.y=b.cy+oy/od*lim;}}
  else{b.x+=(b.cx-b.x)*Math.min(1,dt*2);b.y+=(b.cy-b.y)*Math.min(1,dt*2);}
  if(b.phase===2&&b.st==='fight'){const c0=b.cycle;b.cycle=(b.cycle+dt)%7;if(c0>b.cycle){// начало схватки: со стены падают коконы
      for(let i=0;i<2;i++){const a=rnd(0,TAU);spawnEnemy('cocoon',b.cx+Math.cos(a)*b.R*.82,b.cy+Math.sin(a)*b.R*.82,{noAffix:true,hatch0:5,spawnT:.3,escort:true});}}
    b.wallWarn=b.cycle>6;if(b.wallWarn&&!b.ww0){b.ww0=1;sfx('warn');buzz('hit');}if(!b.wallWarn)b.ww0=0;
    const k=b.cycle<3?Math.sin(Math.PI*b.cycle/3):0;b.R=b.R0*(1-.25*k);}else{b.wallWarn=false;b.R=b.R0+(b.st==='fight'?12*Math.sin(b.t*TAU/1.2):0);}
  nuWall(b,dt);
  if(b.st==='enter'){b.timer-=dt;if(b.timer<=0){b.st='fight';nuSpawnWombs(b);b.fight0=G.t;if(G.mc)G.mc.nurse74=1;}return;}
  nuPlace(b);
  if(b.st==='final'){b.timer-=dt;if(sb74Docks(b,dt))return;if(b.timer<=0)sbTimeout(b);return;}
  const hard=sbHard(),dead33=storyFlag('save33')==='dead';
  // колыбельная (K8)
  if(b.phase===3&&!b.lullDone&&b.hp<b.maxHp*.15){b.lullDone=true;b.lull=6;for(const e of G.enemies)if(e.alive&&!EDEF[e.type].sbp&&!e.sbk)e.stun=Math.max(e.stun||0,6);radioLine('КОРМИЛИЦА','#ff9fb8','…баю… [спи]… баю…',0);banner('ПОСЛЕДНЯЯ КОЛЫБЕЛЬНАЯ','ВРАГИ СПЯТ · УРОН ×2 · 6 С');}
  if(b.lull>0){b.lull-=dt;return;}
  // кольца песни
  b.ringT-=dt;if(b.ringT<=0&&p.hp>0){b.ringT=(b.phase===1?4.5:b.phase===2?6:4.2)*atkK();b.ringN++;
    const solid=b.phase===3&&b.ringN%2===0,gw=solid?0:b.phase===3?.44:(hard?.6:.8);
    b.rings.push({ox:b.x,oy:b.y,r:b.r+8,t:G.noTele?-.4:-.8,gap:Math.atan2(p.y-b.y,p.x-b.x)+rnd(-1.4,1.4),gw,hit:false,tol:dead33?1.2:1});
    if(solid){floater(p.x,p.y-34,'СПЛОШНОЕ КОЛЬЦО · РЫВОК','#ffd0e0');buzz('ready');}sfx('warn');}
  for(const R_ of b.rings){if(R_.ox===undefined){R_.ox=b.cx;R_.oy=b.cy;}if(R_.tol===undefined)R_.tol=1;R_.t+=dt;if(R_.t>0)R_.r+=170*dt;if(!R_.hit&&R_.t>0&&p.hp>0){const dd=Math.hypot(p.x-R_.ox,p.y-R_.oy);if(Math.abs(dd-R_.r)<(9+p.r*.6)*R_.tol){const a=Math.atan2(p.y-R_.oy,p.x-R_.ox);if(!(R_.gw>0&&Math.abs(angDiff(a,R_.gap))<R_.gw/2)){R_.hit=true;damagePlayer(12);}}}}
  b.rings=b.rings.filter(R_=>R_.r<b.R0*2.2);
  if(b.phase===1){
    b.ubT-=dt;if(b.ubT<=0){b.ubT=7*atkK();if(G.enemies.filter(e=>e.alive&&e.type==='unborn').length<6)for(const w of b.wombs.filter(w=>w.alive).slice(0,2))spawnEnemy('unborn',w.x,w.y,{noAffix:true,spawnT:.3,escort:true});}
    // кормление (K1)
    if(b.feed){const F=b.feed;if(!F.w.alive){b.feed=null;}else{F.t-=dt;F.w.hp=Math.min(F.w.maxHp,F.w.hp+F.w.maxHp*.05*dt);if(F.t<=0){b.feed=null;b.feedT=12*atkK();}}}
    else{b.feedT-=dt;if(b.feedT<=0){const al=b.wombs.filter(w=>w.alive);if(al.length){al.sort((a,c)=>a.hp/a.maxHp-c.hp/c.maxHp);b.feed={w:al[0],t:3,hits:0};floater(al[0].x,al[0].y-al[0].r-20,'КОРМЛЕНИЕ · ПОРВИТЕ НИТЬ','#ffe0ea');}b.feedT=12*atkK();}}
    // отрастание (K3)
    if(b.firstTorn&&!b.regrown&&G.t-b.firstTorn>30&&b.wombs.filter(w=>w.alive).length===3){b.regrown=true;const dw=b.wombs.find(w=>!w.alive);if(dw){const w=spawnEnemy('womb',dw.x,dw.y,{noAffix:true,noLoot:true,spawnT:.6,wa:dw.wa});w.maxHp=Math.round(EDEF.womb.hp*sbRank());w.hp=w.maxHp*.5;b.wombs=b.wombs.map(o=>o===dw?w:o);floater(w.x,w.y-w.r-18,'ПУПОВИНА ОТРАСТАЕТ','#ff9fb8');sfx('warn');}}}
  if(b.phase===2){if(b.breath!==undefined){b.breath=(b.breath+dt)%5;const inh=b.breath<2;if(inh!==b.inhale){b.inhale=inh;if(inh)floater(b.x,b.y-b.r-24,'ВДОХ · УЯЗВИМА','#ffe0ea');}b.preInhale=b.breath>4.5;}
    b.embT-=dt;const cap=Math.max(1,3-Math.min(2,storyFlag('lastKind')||0));if(b.embT<=0){b.embT=6*atkK();if(G.enemies.filter(e=>e.alive&&(e.type==='embryo'||e.type==='guard')).length<cap){/* 0.7.5: доросшие Стражи тоже в лимите — раньше копились без конца */const a=rnd(0,TAU);spawnEnemy('embryo',b.x+Math.cos(a)*b.r*1.5,b.y+Math.sin(a)*b.r*1.5,{noAffix:true,spawnT:.4,fast:true,escort:true});}}}
  if(b.phase===3){b.petA=(b.petA||0)+dt*.8;b.sporeT-=dt;if(b.sporeT<=0&&p.hp>0){b.sporeT=4*atkK();x74().spores.push({x:p.x+rnd(-60,60),y:p.y+rnd(-60,60),r:95,t:6});}}}
function sb74WombDied(e){const b=G.sb;if(!b||b.sbk!=='nurse')return;explode(e.x,e.y,'#ff6b8a',30,1.1);sfx('boom');shake(6);x74().milk.push({x:e.x,y:e.y,t:25});
  if(b.feed&&b.feed.w===e)b.feed=null;if(!b.firstTorn)b.firstTorn=G.t;
  for(let i=0;i<3;i++)spawnEnemy('unborn',e.x+rnd(-20,20),e.y+rnd(-20,20),{noAffix:true,spawnT:.4,escort:true});
  floater(e.x,e.y-30,'ПУПОВИНА ПОРВАНА · ПЛАЧ · МОЛОКО','#ff9fb8');
  if(!b.wombs.some(w=>w.alive&&w!==e)){banner('ПУПОВИНЫ ПОРВАНЫ','КОРМИЛИЦА ОТКРЫТА');if(G.mc)G.mc.cord74=G.t-(b.fight0||G.t);}}
// --- «Последний довод» 2.0 ---
function flInit(b){b.ang=0;b.wp=0;b.bsT=4;b.bs=null;b.hgT=10;b.salT=4;b.sal=[];b.salQ=0;b.salN=0;b.parts=[];b.drift=false;b.resp={};b.sl=0;b.litT=0;b.aimed=false;b.ramT=9;b.ram=null;b.nearT=0;b.lock=null;b.lockCd=0;b.brT=2.5;b.stun75=0;b.echoG=0;b.wing=false;}
function flSpawnParts(b){for(const [role,ox,oy] of FL_PARTS){const q=spawnEnemy('fpart',b.x,b.y,{noAffix:true,noLoot:true,spawnT:.6,role,ox,oy,host:b});q.hp=q.maxHp=Math.round((role==='nose'?1300:900)*sbRank());b.parts.push(q);}flPlace(b);}
function flAxisDist(b,x,y){const c=Math.cos(b.ang),s=Math.sin(b.ang);return segDistP(x,y,b.x-c*150,b.y-s*150,b.x+c*150,b.y+s*150);}
function flHulls(b){const X=x74();if(b.hulls75)return;b.hulls75=true;const mh=sbHard()?18:27;
  for(const [x,y] of [[W*.24,H*.72],[W*.76,H*.72]]){const h={x,y,ang:rnd(-.3,.3),va:rnd(-.03,.03),vx:rnd(-6,6),vy:rnd(-4,4),L:Math.min(220,W*.2),T:52,cd:0,hits:0,maxHits:mh,boss75:true};X.hulls.push(h);}}
function flUpdate(b,dt){const p=G.player,easy=(curDiff().rank||0)===0,hard=sbHard(),X=x74();if(sbCommon(b,dt))return;if(b.phase!==2||b.st!=='fight')sbEscort(b,dt);/* фаза 2: охрану заменяет ангар */
  if(b.st==='enter'){if(!b.wing){b.wing=true;if(b.noEsc)banner('ФЛАГМАН ВЫХОДИТ ОДИН','БЕЗ ОХРАНЫ');else for(let i=0;i<3;i++)spawnEnemy('autopilot',-60-i*40,H*.32+(i-1)*60,{noAffix:true,spawnT:.5,escort:true});radioLine('ФЛАГМАН','#b8c4d6','Звено, к флагману. Строй — клин.',.4);}
    b.timer-=dt;b.x+=(W*.3-b.x)*Math.min(1,dt*.9);b.y+=(H*.32-b.y)*Math.min(1,dt*.9);flPlace(b);if(b.timer<=0){b.st='fight';flSpawnParts(b);flHulls(b);}return;}
  if(b.st==='final'){b.timer-=dt;flPlace(b);if(sb74Docks(b,dt))return;if(b.timer<=0)sbTimeout(b);return;}
  // ремонт секций — виден искрами последние 8 с
  b.rep75=b.rep75||{};for(const [role,ox,oy] of FL_PARTS){if(role==='engL'||role==='engR'||flRole(b,role)||b.rep75[role])continue;b.resp[role]=(b.resp[role]===undefined?25:b.resp[role])-dt;
    if(b.resp[role]<=0){b.resp[role]=undefined;b.rep75[role]=1;b.parts=b.parts.filter(q=>q.alive);const q=spawnEnemy('fpart',b.x,b.y,{noAffix:true,noLoot:true,spawnT:.8,role,ox,oy,host:b});q.hp=q.maxHp=Math.round((role==='nose'?1300:900)*sbRank()*.5);b.parts.push(q);floater(b.x,b.y-60,role==='nose'?'НОС ЗАЛАТАН':'БАТАРЕЯ ВОССТАНОВЛЕНА','#d6dee8');}}
  for(const q of b.parts)if(q.alive&&q.distract>0)q.distract-=dt;
  // корпуса-укрытия разрушаются залпами
  for(const h of X.hulls)if(h.boss75&&h.hits>=h.maxHits&&!h.gone){h.gone=true;explode(h.x,h.y,'#9fb0c4',40,1.4);sfx('bigboom');floater(h.x,h.y-30,'УКРЫТИЕ РАЗБИТО','#9fb0c4');}
  X.hulls=X.hulls.filter(h=>!h.gone);
  // эхо Стража (выбор «Битвы 127 лет назад»)
  if(b.echoG>0){b.echoG-=dt;b.echoT-=dt;if(b.echoT<=0){b.echoT=3;b.hp=Math.max(1,b.hp-b.maxHp*.02);sbCheckTh(b);X.tracers.push({x1:W-20,y1:20,x2:b.x-Math.cos(b.ang)*110,y2:b.y-Math.sin(b.ang)*110,t:.25,c:'#ffb84d'});floater(b.x,b.y-60,'ЭХО СТРАЖА · −2%','#ffb84d');}}
  if(b.stun75>0){b.stun75-=dt;flPlace(b);return;}
  const engs=['engL','engR'].filter(r=>flRole(b,r)).length;if(engs<2&&b.phase>=2&&!b.drift){b.drift=true;banner('ФЛАГМАН ПОТЕРЯЛ УПРАВЛЕНИЕ','ЗАЛПЫ МЕТУТ АРЕНУ');}
  // таран (фаза 2, если жив хоть один двигатель)
  if(b.ram){const R_=b.ram;R_.t-=dt;if(R_.st==='tele'){if(R_.t>.22)b.ang+=clamp(angDiff(Math.atan2(p.y-b.y,p.x-b.x),b.ang),-1.5*dt,1.5*dt);if(R_.t<=0){R_.st='go';R_.t=.5;sfx('bigboom');}}
    else{b.x+=Math.cos(b.ang)*800*dt;b.y+=Math.sin(b.ang)*800*dt;if(!R_.hit&&p.hp>0&&p.dashT<=0&&flAxisDist(b,p.x,p.y)<44){R_.hit=true;damagePlayer(30);shake(10);}if(R_.t<=0){b.ram=null;b.ramT=9*atkK();}}}
  else if(!b.drift){const WP=[[W*.28,H*.3],[W*.72,H*.3],[W*.72,H*.6],[W*.28,H*.6]],w=WP[b.wp%4],dx=w[0]-b.x,dy=w[1]-b.y;if(Math.hypot(dx,dy)<40)b.wp++;
    b.ang+=clamp(angDiff(Math.atan2(dy,dx),b.ang),-.5*dt,.5*dt);const sp=engs===2?45:engs===1?26:0;b.x+=Math.cos(b.ang)*sp*dt;b.y+=Math.sin(b.ang)*sp*dt;}
  else{b.ang+=.25*dt;b.x+=(W/2-b.x)*dt*.1;b.y+=(H*.45-b.y)*dt*.1;}
  if(!b.ram&&b.phase===2&&engs>=1&&!easy){b.ramT-=dt;if(b.ramT<=0&&p.hp>0){b.ram={st:'tele',t:1.2};buzz('ready');sfx('warn');}}
  b.x=clamp(b.x,110,W-110);b.y=clamp(b.y,100,H-100);flPlace(b);
  // прожектор рубки (фазы 1–2)
  if(b.phase<3&&!easy){const ta=Math.atan2(p.y-b.y,p.x-b.x);b.sl=(b.sl||0)+clamp(angDiff(ta,b.sl||0),-.5*dt,.5*dt);
    const lit=p.hp>0&&Math.abs(angDiff(ta,b.sl))<.35&&Math.hypot(p.x-b.x,p.y-b.y)<750&&!hullBlocks75(b.x,b.y,p.x,p.y);b.lit=lit;
    if(lit){b.litT+=dt;if(b.litT>=1.5&&!b.aimed){b.aimed=true;floater(p.x,p.y-34,'ВАС ВИДЯТ · ЗАЛП ПРИЦЕЛЬНЫЙ','#ffd36b');}}else b.litT=Math.max(0,b.litT-dt);}else b.lit=false;
  // абордажный шлюз
  if(b.lockCd>0)b.lockCd-=dt;
  if(b.lock){b.lock.t-=dt;if(b.lock.t<=0){b.lock=null;b.lockCd=10;for(let i=0;i<2;i++)spawnEnemy('boarder',b.x,b.y,{noAffix:true,spawnT:.3,escort:true});floater(b.x,b.y-50,'АБОРДАЖ','#ffb84d');}}
  else if(b.lockCd<=0&&p.hp>0){if(flAxisDist(b,p.x,p.y)<90){b.nearT+=dt;if(b.nearT>=3){b.nearT=0;b.lock={t:1.5};floater(b.x,b.y-50,'ШЛЮЗ ОТКРЫВАЕТСЯ · ЗАРЯД ЗАКРОЕТ','#ffb84d');sfx('warn');}}else b.nearT=Math.max(0,b.nearT-dt);}
  // бортовой залп (прицельный после прожектора)
  if(!b.bs){b.bsT-=dt;if(b.bsT<=0&&p.hp>0){const s=((p.x-b.x)*(-Math.sin(b.ang))+(p.y-b.y)*Math.cos(b.ang))>0?1:-1;const ok=r=>{const q=flRole(b,r);return q&&!(q.distract>0)?q:null;};const bat=ok(s>0?'batR':'batL')||ok(s>0?'batL':'batR');
      if(bat){b.bs={side:bat.role==='batR'?1:-1,t:G.noTele?.6:1,aim:b.aimed};b.aimed=false;b.litT=0;sfx('warn');}b.bsT=(b.drift?3.4:6)*atkK();}}
  else{b.bs.t-=dt;if(b.bs.t<=0){const a=b.ang+b.bs.side*Math.PI/2,c=Math.cos(b.ang),s=Math.sin(b.ang);for(const ox of [-80,0,80]){const x=b.x+ox*c-b.bs.side*44*s,y=b.y+ox*s+b.bs.side*44*c;const aa=b.bs.aim?Math.atan2(p.y-y,p.x-x):a;for(let i=-1;i<=1;i++){const q=shootE(x,y,aa+i*(b.bs.aim?.06:.18),b.bs.aim?250:210,12,'#d6dee8',6);if(q)q.boss=true;}}b.bs=null;sfx('bigboom');shake(6);}}
  // рубка сама отвечает очередями, когда батарей нет
  if(!flRole(b,'batL')&&!flRole(b,'batR')){b.brT-=dt;if(b.brT<=0&&p.hp>0){b.brT=2.5*atkK();for(let i=0;i<3;i++){const q=shootE(b.x,b.y,Math.atan2(p.y-b.y,p.x-b.x)+(i-1)*.08,260,10,'#ffffff',5);if(q)q.boss=true;}sfx('shot');}}
  // ангар
  if(b.phase>=2&&!easy){b.hgT-=dt;if(b.hgT<=0){b.hgT=14*atkK();if(G.enemies.filter(e=>e.alive&&(e.type==='boarder'||e.type==='fireship')).length<3){spawnEnemy(Math.random()<.5?'boarder':'fireship',b.x,b.y,{noAffix:true,spawnT:.6,escort:true});floater(b.x,b.y-50,'АНГАР','#ffb84d');}}}
  // «Последний довод»: два удара туда, где вы были, третий — полоса залпа мёртвого флота
  if(b.phase===3){b.salT-=dt;if(b.salT<=0&&p.hp>0&&!b.salQ){b.salT=5*atkK();b.salQ=easy?2:3;b.salN=0;banner('«ПОСЛЕДНИЙ ДОВОД»','ЗАЛП БЬЁТ ТУДА, ГДЕ ВЫ БЫЛИ');}
    if(b.salQ>0){b.salN-=dt;if(b.salN<=0){b.salQ--;b.salN=.6;const log=G.posLog.filter(q=>G.t-q.t>=.9&&G.t-q.t<=1.2),q=log.length?log[0]:{x:p.x,y:p.y};
        if(b.salQ===0&&!easy){const hor=Math.random()<.5;X.strips.push({hor,pos:hor?p.y:p.x,w:46,t:-2,fired:false});}else b.sal.push({x:q.x,y:q.y,t:1.5,mercy:hard});sfx('warn');}}}
  for(const s of b.sal){s.t-=dt;if(s.t<=0&&!s.done){s.done=true;explode(s.x,s.y,'#ffd0a0',26,1);G.shock.push({x:s.x,y:s.y,r:10,R:70,t:0,col:'#ffd0a0'});sfx('boom');shake(5);
      if(p.hp>0&&Math.hypot(p.x-s.x,p.y-s.y)<70+p.r*.5&&p.dashT<=0){if(s.mercy)mercyHit(25);else damagePlayer(25);}
      for(const e of G.enemies){if(!e.alive||e.sbk||EDEF[e.type].sbp||STATIC.has(e.type))continue;if(Math.hypot(e.x-s.x,e.y-s.y)<70)hurt(e,60,{});}}}
  b.sal=b.sal.filter(s=>s.t>-.3);}
function sb74PartDied(e){const b=G.sb;if(!b||b.sbk!=='flag'||b.st==='dying')return;explode(e.x,e.y,'#d6dee8',30,1.1);sfx('boom');shake(6);
  floater(e.x,e.y-26,(e.role==='engL'||e.role==='engR'?'ДВИГАТЕЛЬ ВЫБИТ':e.role==='nose'?'НОС РАЗБИТ':'БАТАРЕЯ ВЫБИТА')+' · РУБКА ×'+String(Math.round(Math.min(1.1,.35+.15*(flDead(b)+1))*100)/100).replace('.',','),'#d6dee8');}
// --- тик 0.7.5 (из t74Tick) ---
function t75Tick(dt){if(G.milk75>0)G.milk75-=dt;
  if(!(G.sb&&G.sb.alive&&G.sb.sbk==='flag')&&(G.x74||G.w74r)){const X=x74();if(X.hulls.some(h=>h.boss75))X.hulls=X.hulls.filter(h=>!h.boss75);}
  for(const e of G.enemies){if(e.roll75&&e.alive){e.life75-=dt;if(e.life75<=0){e.alive=false;explode(e.x,e.y,'#b8c4d6',8,.5);}}}
  const t10=document.getElementById('tick10');const sb=G.sb&&G.sb.alive&&(G.sb.sbk==='nurse'||G.sb.sbk==='flag');
  if(sb&&!t10){const bar=document.getElementById('bossBar');if(bar){const s=document.createElement('span');s.className='tick';s.id='tick10';s.style.left='10%';bar.appendChild(s);}}else if(t10)t10.hidden=!sb;}
// --- отрисовка боссов 2.0 ---
function sb74Draw(b,t){const p=G.player;
  if(b.sbk==='nurse'){
    ctx.fillStyle='rgba(40,6,18,.5)';ctx.beginPath();ctx.rect(-4000,-4000,8000+W,8000+H);ctx.arc(b.cx,b.cy,b.R,0,TAU,true);ctx.fill('evenodd');
    ctx.strokeStyle=b.wallWarn&&!G.noTele?'#ff2a4a':'#ff6b8a';ctx.globalAlpha=b.wallWarn?.95:.7;ctx.lineWidth=b.wallWarn?8:5;ctx.beginPath();for(let i=0;i<=60;i++){const a=i/60*TAU,rr=b.R+4*Math.sin(a*9+t*3);ctx.lineTo(b.cx+Math.cos(a)*rr,b.cy+Math.sin(a)*rr);}ctx.closePath();ctx.stroke();ctx.globalAlpha=1;
    for(const w of b.wombs||[]){if(!w.alive)continue;ctx.strokeStyle='#ff7fa0';ctx.globalAlpha=.75;ctx.lineWidth=5+2*Math.sin(t*5+w.wa);ctx.beginPath();ctx.moveTo(b.x,b.y);const mx=(b.x+w.x)/2+Math.cos(w.wa+Math.PI/2)*22*Math.sin(t*2),my=(b.y+w.y)/2+Math.sin(w.wa+Math.PI/2)*22*Math.sin(t*2);ctx.quadraticCurveTo(mx,my,w.x,w.y);ctx.stroke();ctx.globalAlpha=1;
      ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(w.x-24,w.y+w.r+8,48,5);ctx.fillStyle='#ff9fb8';ctx.fillRect(w.x-24,w.y+w.r+8,48*Math.max(0,w.hp/w.maxHp),5);}
    if(b.feed&&b.feed.w&&b.feed.w.alive){const w=b.feed.w;ctx.strokeStyle='#ffffff';ctx.globalAlpha=.6+.3*Math.sin(t*14);ctx.lineWidth=3;ctx.setLineDash([4,6]);ctx.lineDashOffset=-t*40;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(w.x,w.y);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;ctx.globalAlpha=1;worldLabel((b.x+w.x)/2,(b.y+w.y)/2-14,'НИТЬ · '+(3-b.feed.hits),'#ffffff');}
    for(const R_ of b.rings||[]){const ox=R_.ox===undefined?b.cx:R_.ox,oy=R_.oy===undefined?b.cy:R_.oy,grey=storyFlag('save33')==='dead';
      if(R_.t<0){if(G.noTele)continue;ctx.strokeStyle=R_.gw===0?'#ffffff':'#ffd0e0';ctx.globalAlpha=.25+.25*Math.sin(t*20);ctx.lineWidth=R_.gw===0?4:2;ctx.setLineDash([6,8]);ctx.beginPath();ctx.arc(ox,oy,b.r+30,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;continue;}
      ctx.strokeStyle=R_.gw===0?'#ffffff':grey?'#c9d2de':'#ffd0e0';ctx.globalAlpha=.85;ctx.lineWidth=6*(R_.tol||1);ctx.beginPath();if(R_.gw>0)ctx.arc(ox,oy,R_.r,R_.gap+R_.gw/2,R_.gap-R_.gw/2+TAU);else ctx.arc(ox,oy,R_.r,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
    if(b.phase===2&&b.st==='fight'){ctx.strokeStyle=b.inhale?'#ffffff':b.preInhale?'#ffd0e0':'#5a2030';ctx.globalAlpha=b.preInhale?.5+.4*Math.sin(t*30):.6;ctx.lineWidth=3;ctx.beginPath();ctx.arc(b.x,b.y,b.r+18,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
    if(b.phase===3&&b.st==='fight'&&!b.lull){ctx.strokeStyle='#ffe0ea';ctx.fillStyle='rgba(255,224,234,.25)';ctx.lineWidth=3;for(let i=0;i<3;i++){const pa=(b.petA||0)+i*TAU/3;ctx.beginPath();ctx.arc(b.x,b.y,b.r+40,pa-.36,pa+.36);ctx.arc(b.x,b.y,b.r+22,pa+.36,pa-.36,true);ctx.closePath();ctx.fill();ctx.stroke();}}
    if(b.lull>0||b.dark>0){ctx.fillStyle=b.lull>0?'rgba(120,80,40,.22)':'rgba(0,0,0,.35)';ctx.fillRect(-4000,-4000,8000+W,8000+H);}
  }else{
    for(const q of b.parts||[]){if(!q.alive||q.spawnT>0)continue;ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(q.x-20,q.y-q.r-12,40,4);ctx.fillStyle='#d6dee8';ctx.fillRect(q.x-20,q.y-q.r-12,40*Math.max(0,q.hp/q.maxHp),4);
      if(q.hp<q.maxHp*.5&&SET.fx&&Math.random()<.25)part(q.x+rnd(-8,8),q.y+rnd(-8,8),rnd(-20,20),-30,.8,'#3a4048',4);
      if(q.distract>0){const a=t*3;ctx.fillStyle='#8fe9ff';ctx.beginPath();ctx.arc(q.x+Math.cos(a)*34,q.y+Math.sin(a)*34,4,0,TAU);ctx.fill();worldLabel(q.x,q.y-q.r-22,'ТЕО ОТВЛЕКАЕТ','#8fe9ff');}}
    if(b.resp&&b.st==='fight')for(const [role,ox,oy] of FL_PARTS){const rt=b.resp[role];if(rt===undefined)continue;const c=Math.cos(b.ang),s_=Math.sin(b.ang),x=b.x+ox*c-oy*s_,y=b.y+ox*s_+oy*c;
      if(SET.fx&&Math.random()<.3)part(x+rnd(-10,10),y+rnd(-10,10),rnd(-40,40),rnd(-40,40),.4,rt<=8?'#ffd36b':'#ff7a3d',2);
      if(rt<=8){ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(x-20,y-24,40,4);ctx.fillStyle='#ffd36b';ctx.fillRect(x-20,y-24,40*(1-rt/8),4);worldLabel(x,y-32,'РЕМОНТ · СТРЕЛЯЙТЕ В ИСКРЫ','#ffd36b');}}
    if(b.lit!==undefined&&b.phase<3&&b.st==='fight'&&b.sl!==undefined&&(curDiff().rank||0)>0){ctx.fillStyle=b.lit?'rgba(255,211,107,.18)':'rgba(255,240,200,.07)';ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.arc(b.x,b.y,750,b.sl-.35,b.sl+.35);ctx.closePath();ctx.fill();
      if(b.litT>0){ctx.strokeStyle='#ffd36b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,p.r+10,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,b.litT/1.5));ctx.stroke();}}
    if(b.ram&&b.ram.st==='tele'&&!G.noTele){const R_=b.ram,lk=R_.t<=.22;teleLane(b.x,b.y,b.ang,400,b.r*.9+14,1-clamp(R_.t/1.2,0,1),lk,'#ff4f6e',{r:b.r*.6,flash:lk?Math.max(0,1-(.22-R_.t)/.12):0});}
    if(b.lock){ctx.strokeStyle='#ffb84d';ctx.globalAlpha=.5+.4*Math.sin(t*20);ctx.lineWidth=3;ctx.beginPath();ctx.arc(b.x,b.y,40,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
    if(b.stun75>0){ctx.strokeStyle='#ffffff';ctx.globalAlpha=.6;ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(b.x,b.y,30+i*10+Math.sin(t*10+i)*3,0,TAU);ctx.stroke();}ctx.globalAlpha=1;}
    if(b.echoG>0){const gx=W-60,gy=60;ctx.globalAlpha=.5;ctx.strokeStyle='#ffb84d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(gx+14,gy);ctx.lineTo(gx-10,gy-10);ctx.lineTo(gx-10,gy+10);ctx.closePath();ctx.stroke();ctx.globalAlpha=1;worldLabel(gx,gy+24,'ЭХО СТРАЖА','#ffb84d');}
    if(b.bs&&!G.noTele){const a=b.ang+b.bs.side*Math.PI/2,c=Math.cos(b.ang),s=Math.sin(b.ang);ctx.strokeStyle=b.bs.aim?'#ffd36b':'#ff4f6e';ctx.globalAlpha=.35+.4*Math.sin(t*22);ctx.lineWidth=3;ctx.beginPath();
      for(const ox of [-80,0,80]){const x=b.x+ox*c-b.bs.side*44*s,y=b.y+ox*s+b.bs.side*44*c;const aa=b.bs.aim?Math.atan2(p.y-y,p.x-x):a;for(let i=-1;i<=1;i++){ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(aa+i*(b.bs.aim?.06:.18))*220,y+Math.sin(aa+i*(b.bs.aim?.06:.18))*220);}}ctx.stroke();ctx.globalAlpha=1;}
    for(const s of b.sal||[]){if(s.done)continue;ctx.strokeStyle=s.mercy?'#b8c4d6':'#ffd0a0';ctx.globalAlpha=.5+.4*Math.sin(t*20);ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.x,s.y,70,0,TAU);ctx.stroke();ctx.lineWidth=4;ctx.beginPath();ctx.arc(s.x,s.y,70,-Math.PI/2,-Math.PI/2+TAU*(1-s.t/1.5));ctx.stroke();ctx.globalAlpha=1;}
    for(const h of x74().hulls)if(h.boss75){const k=1-h.hits/h.maxHits;ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(h.x-30,h.y-h.T/2-14,60,4);ctx.fillStyle='#9fb0c4';ctx.fillRect(h.x-30,h.y-h.T/2-14,60*k,4);}
  }
  if(b.fx75&&b.fx75.t>0){const F=b.fx75;F.t-=VDT74;/* ARCH·75 A-22 */const k=Math.min(1,F.t/2.6);
    if(F.kind==='cut'){ctx.strokeStyle='#ffffff';ctx.globalAlpha=k;ctx.lineWidth=2;for(let i=0;i<6;i++){const a=i*1.05+.3;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x+Math.cos(a)*b.r*1.3,b.y+Math.sin(a)*b.r*1.3);ctx.stroke();}ctx.strokeStyle='#8fe9ff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(b.x+34,b.y);ctx.lineTo(b.x-20,b.y-20);ctx.lineTo(b.x-10,b.y);ctx.lineTo(b.x-20,b.y+20);ctx.closePath();ctx.stroke();worldLabel(b.x,b.y-b.r-30,'КОРАБЛЬ БЕЗ НОМЕРА','#8fe9ff');}
    else if(F.kind==='keep'){glow(b.x,b.y,b.r*1.6*(1.2-k),'#ff9fb8',k);worldLabel(b.x,b.y-b.r-30,'МЛАДШИЙ','#ff9fb8');}
    else if(F.kind==='bridge'){glow(b.x,b.y,160*(1.2-k),'#ffd0a0',k);}
    else{ctx.fillStyle='rgba(0,0,0,'+(.5*(1-k))+')';ctx.beginPath();ctx.arc(b.x,b.y,170,0,TAU);ctx.fill();worldLabel(b.x,b.y-80,'«ПОНЯЛ. ТЕПЕРЬ ПОНЯЛ»','#b8c4d6');}
    ctx.globalAlpha=1;}
  if(b.st==='final'&&b.docks){for(const d of b.docks){const red=d.kind==='cut'||d.kind==='bridge',c_=red?'#ff4f6e':d.kind==='keep'?'#ff9fb8':'#9fd8ff';ctx.globalAlpha=d.off?.25:1;glow(d.x,d.y,46,c_,.5);ctx.strokeStyle=c_;ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.lineDashOffset=-t*15;ctx.beginPath();ctx.arc(d.x,d.y,34,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;
      if(d.ch>0){ctx.lineWidth=4;ctx.beginPath();ctx.arc(d.x,d.y,40,-Math.PI/2,-Math.PI/2+TAU*d.ch/.6);ctx.stroke();}
      const L={cut:['ПРЕРВАТЬ','ЛОМ ×2 · КОПИЯ НЕ РОДИТСЯ'],keep:['ВЫНОСИТЬ','ЛОМ ×0,5 · МЛАДШИЙ'],bridge:['ПО РУБКЕ','ЛОМ ×2 · ФЛОТ ЗАМОЛЧИТ'],engine:['ПО ДВИГАТЕЛЯМ','КАК СТРАЖИ · МИЛОСТЬ']}[d.kind];worldLabel(d.x,d.y-48,L[0],c_);worldLabel(d.x,d.y+54,d.prev?'ВЫ УЖЕ ВЫБРАЛИ':L[1],c_);ctx.globalAlpha=1;}
    ctx.strokeStyle=b.timer<5?'#ff4f6e':'#ffffff';ctx.globalAlpha=.8;ctx.lineWidth=3;ctx.beginPath();ctx.arc(b.x,b.y,b.r+26,-Math.PI/2,-Math.PI/2+TAU*(b.timer/20));ctx.stroke();ctx.globalAlpha=1;}}


