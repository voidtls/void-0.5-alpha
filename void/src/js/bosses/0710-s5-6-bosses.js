// ===== боссы секторов V–VI =====
function sb74Spawn(kind){ambSting('boss');radioClear();const type=kind==='nurse'?'nurse':'flagship';
  const b=spawnEnemy(type,kind==='nurse'?W/2:-170,kind==='nurse'?H/2:H*.32,{noAffix:true,noLoot:true});sb74Init(b,kind,2.6);
  if(kind==='nurse'){banner('КОРМИЛИЦА · ПОСЛЕДНЯЯ КОЛЫБЕЛЬ','ФАЗА 1 · '+NU_PHASES[0]);const s33=storyFlag('save33');
    radioLine('КОРМИЛИЦА','#ff9fb8',s33==='dead'?'Ты выбрал мёртвых. Как и тот, кто нас сохранил.':s33==='unborn'?'Ты выбрал детей. Тогда послушай колыбельную до конца.':'…ты пахнешь [пустым местом]. Ты пришёл за [кладкой]?…',1.5);}
  else{banner('«ПОСЛЕДНИЙ ДОВОД» · ФЛАГМАН ФЛОТА','ФАЗА 1 · '+FL_PHASES[0]);radioLine('ФЛАГМАН','#b8c4d6','Неопознанный корабль. Назовите себя.',1.5);radioLine('ФЛАГМАН','#b8c4d6','Корабль Стражей. Огонь по готовности.',6);}
  return b;}
function sb74Init(b,kind,enterT){b.hp=b.maxHp=Math.round(EDEF[b.type].hp*sbRank()*cycHp());b.th=[b.maxHp*.67,b.maxHp*.33,b.maxHp*.10];
  Object.assign(b,{sbk:kind,phase:1,st:'enter',timer:enterT,t:0,rot:0,flash:0,open:0,inv0:0,fails:0,choice:null,domeFlash:0,deathT:0,noAffix:true,noLoot:true,docks:null});
  if(kind==='nurse')nuInit(b);else flInit(b);G.sb=b;if(G.noEsc74)b.noEsc=true;}
function sb74Adopt(b){const kind=b.type==='nurse'?'nurse':'flag';if(G.sb&&G.sb!==b&&G.sb.alive){b.alive=false;return false;}sb74Init(b,kind,1);return true;}
/* ARCH·85 · снято недостижимое объявление sb74Hurt (1 из 2; действует последнее объявление) */
/* ARCH·85 · снято недостижимое объявление sb74Targetable (1 из 2; действует последнее объявление) */
/* ARCH·85 · снято недостижимое объявление sb74Phase (1 из 2; действует последнее объявление) */
/* ARCH·85 · снято недостижимое объявление sb74Final (1 из 2; действует последнее объявление) */
function sb74Timeout(b){b.fails++;if(b.fails>=2){sbChoose(b,null);return;}
  b.hp=Math.min(b.maxHp,b.hp+b.maxHp*.2);b.st='fight';b.inv0=1.5;b.docks=null;banner(b.sbk==='nurse'?'КОЛЫБЕЛЬ НЕ ЖДЁТ':'ПРИКАЗ НЕ ОТДАН','ПОВТОР · +20% ПРОЧНОСТИ');sfx('warn');}
/* ARCH·85 · снято недостижимое объявление sb74Choose (1 из 2; действует последнее объявление) */
/* ARCH·85 · снято недостижимое объявление sb74Hud (1 из 2; действует последнее объявление) */
/* ARCH·85 · снято недостижимое объявление sb74Docks (1 из 2; действует последнее объявление) */
// --- Кормилица ---
/* ARCH·85 · снято недостижимое объявление nuInit (1 из 2; действует последнее объявление) */
/* ARCH·85 · снято недостижимое объявление nuOpen (1 из 2; действует последнее объявление) */
/* ARCH·85 · снято недостижимое объявление nuSpawnWombs (1 из 2; действует последнее объявление) */
/* ARCH·85 · снято недостижимое объявление nuPlace (1 из 2; действует последнее объявление) */
/* ARCH·85 · снято недостижимое объявление nuWall (1 из 2; действует последнее объявление) */
/* ARCH·85 · снято недостижимое объявление nuUpdate (1 из 2; действует последнее объявление) */
/* ARCH·85 · снято недостижимое объявление sb74WombDied (1 из 2; действует последнее объявление) */
// --- «Последний довод» ---
const FL_PARTS=[['nose',122,0],['batL',40,-36],['batR',40,36],['engL',-118,-26],['engR',-118,26]];
/* ARCH·85 · снято недостижимое объявление flInit (1 из 2; действует последнее объявление) */
/* ARCH·85 · снято недостижимое объявление flSpawnParts (1 из 2; действует последнее объявление) */
function flPlace(b){const c=Math.cos(b.ang),s=Math.sin(b.ang);for(const q of b.parts){if(!q.alive)continue;q.x=b.x+q.ox*c-q.oy*s;q.y=b.y+q.ox*s+q.oy*c;q.vx=q.vy=0;}}
function flRole(b,r){return b.parts.find(q=>q.role===r&&q.alive);}
/* ARCH·85 · снято недостижимое объявление flUpdate (1 из 2; действует последнее объявление) */
/* ARCH·85 · снято недостижимое объявление sb74PartDied (1 из 2; действует последнее объявление) */
// --- общая отрисовка боссов V–VI (после врагов) ---
/* ARCH·85 · снято недостижимое объявление sb74Draw (1 из 2; действует последнее объявление) */
function sb74ExtraDraw(t){}
