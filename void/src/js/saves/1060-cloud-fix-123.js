/* ===== 1.2.3 · исправление облака: пустой прогресс больше не затирает облачную копию ===== */
/* ранг прогресса: цикл важнее числа пройденных миссий (новый цикл обнуляет пройденные) */
function cloudRank(raw){try{const S=typeof raw==='string'?JSON.parse(raw):raw;if(!validSave(S))return 0;return (Math.max(1,+S.cycle||1)-1)*1000+worldDone(S);}catch(e){return 0;}}
function bodyRank(b){return b&&b.keys?cloudRank(b.keys.void_world):0;}
cloudWinner=function(body){if(!body||!body.keys)return 'local';const lw=LS.getItem('void_world'),lr=cloudRank(lw),m=metaGet(),ct=+body.t||0,cf=+body.force||0,cr=bodyRank(body);
  if(m.force&&m.force>ct)return 'local';if(cf&&cf>m.t)return 'cloud';if(!lw&&body.keys.void_world)return 'cloud';
  if(cr>lr)return 'cloud';if(lr>cr)return 'local';return ct>m.t?'cloud':'local';};
/* резервная копия: лучшая облачная копия хранится отдельно и не перезаписывается меньшим прогрессом */
async function cloudBak(body){try{if(!body||!body.keys||!CLOUD.ref)return;const ref=CLOUD.bakRef||(CLOUD.bakRef=CLOUD.db.doc(CLOUD.path+'_best'));
  let cur=null;try{const s=await ref.get();cur=s&&s.exists?s.data():null;}catch(e){}
  if(cur&&bodyRank(cur)>=bodyRank(body))return;await ref.set(body);CLOUD.best=body;}catch(e){}}
cloudPush=async function(){if(CLOUD.state!=='ready'||!CLOUD.ref)return;
  if(CLOUD.pending){CLOUD.dirty=true;if(G.state!=='menu'&&!CLOUD.heldToast){CLOUD.heldToast=1;toast('ОБЛАЧНЫЙ ПРОГРЕСС НАЙДЕН','В облаке пройдено миссий: '+worldDone(CLOUD.pending.keys&&CLOUD.pending.keys.void_world)+'. Выйдите в меню — он загрузится.');}return;}  /* облачная копия ждёт возврата в меню — ничего не пишем поверх */
  if(CLOUD.busy){CLOUD.again=true;return;}if(!CLOUD.dirty)return;
  const b=cloudBody(),sg=cloudSig(b);if(sg===CLOUD.sig){CLOUD.dirty=false;return;}CLOUD.busy=true;CLOUD.dirty=false;let held=false;
  try{if(!CLOUD.peek){const s=await CLOUD.ref.get();CLOUD.peek=s&&s.exists?s.data():{keys:null};}
    const cur=CLOUD.peek&&CLOUD.peek.keys?CLOUD.peek:null,cr=bodyRank(cur),br=bodyRank(b),m=metaGet();
    if(cur&&cr>br){
      if(!(m.force&&m.force>(+cur.t||0))){              /* меньше прогресса без сброса по кнопке → не затираем, вернём облачную */
        held=true;CLOUD.pending=cur;CLOUD.dirty=true;
        if(G.state==='menu'){setTimeout(()=>{try{cloudMenuCheck();}catch(e){}},0);}
        else if(!CLOUD.heldToast){CLOUD.heldToast=1;toast('ОБЛАЧНЫЙ ПРОГРЕСС','В облаке сохранено больше (миссий: '+worldDone(cur.keys.void_world)+'). Выйдите в меню — он загрузится.');}
        return;}
      await cloudBak(cur);}                               /* осознанный сброс: лучшая копия остаётся в резерве */
    await CLOUD.ref.set(b);CLOUD.peek=b;CLOUD.sig=sg;CLOUD.lastAt=Date.now();CLOUD.err='';
    if(br>0&&(!CLOUD.best||br>bodyRank(CLOUD.best))&&br%1000>0&&(!CLOUD.bakAt||Date.now()-CLOUD.bakAt>120000)){CLOUD.bakAt=Date.now();cloudBak(b);}}
  catch(e){const c=e&&e.code;CLOUD.dirty=true;CLOUD.err=c||'unavailable';
    if(['invalid_argument','not_granted','capability_disabled','capability_removed','revoked','transform_error'].includes(c))CLOUD.state='ro';
    else setTimeout(()=>{if(CLOUD.dirty)cloudPush();},2500+Math.random()*2000);}
  finally{CLOUD.busy=false;if(!held&&CLOUD.again){CLOUD.again=false;if(CLOUD.dirty)cloudDirty();}}};
{const _cmc=cloudMenuCheck;cloudMenuCheck=function(){const b=CLOUD.pending;_cmc();if(b&&CLOUD.peek!==b&&cloudWinner(b)!=='cloud')CLOUD.peek=b;CLOUD.heldToast=0;};}
/* путь и база для резервной копии; облачная копия в момент входа тоже уходит в резерв */
{const _ci=cloudInit;cloudInit=async function(){try{const C=window.claude;if(C&&typeof C.use==='function'){const [db,user]=await Promise.all([C.use('db'),C.use('user')]);const uid=user&&await user.id();
    if(db&&uid){CLOUD.db=db;CLOUD.path='data/users/'+uid+'/save';}}}catch(e){}
  await _ci();
  try{if(CLOUD.state==='ready'&&CLOUD.db){const s=await CLOUD.db.doc(CLOUD.path+'_best').get();CLOUD.best=s&&s.exists?s.data():null;
    const s2=await CLOUD.ref.get();const cur=s2&&s2.exists?s2.data():null;if(cur&&cur.keys){CLOUD.peek=cur;if(bodyRank(cur)>bodyRank(CLOUD.best))cloudBak(cur);}}}catch(e){}
  try{if(G.state==='menu')renderMenu();}catch(e){}};}
/* кнопка «вернуть лучшую копию» в настройках */
function cloudBestHTML(){const B=CLOUD.best;if(!B||!B.keys)return '';const br=bodyRank(B),lr=cloudRank(LS.getItem('void_world'));if(br<=lr)return '';
  const n=worldDone(B.keys.void_world),c=Math.max(1,(()=>{try{return +JSON.parse(B.keys.void_world).cycle||1}catch(e){return 1}})());
  return `<div class="reset"><button class="rbtn" id="bCloudBest" style="border-color:rgba(127,224,255,.5);color:#7fe0ff">ВЕРНУТЬ СОХРАНЕНИЕ · МИССИЙ ${n}${c>1?' · ЦИКЛ '+c:''}</button></div>`;}
function cloudBestRestore(){const B=CLOUD.best;if(!B)return;cloudApply(B);cloudForce();toast('ПРОГРЕСС ВОЗВРАЩЁН','Загружена резервная облачная копия: пройдено миссий '+worldDone(B.keys.void_world)+'.');try{renderSettings();}catch(e){}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#bCloudBest');if(!b)return;e.preventDefault();
  if(b.dataset.arm&&performance.now()-(+b.dataset.arm)<4000){cloudBestRestore();return;}b.dataset.arm=performance.now();b.textContent='НАЖМИТЕ ЕЩЁ РАЗ — ТЕКУЩИЙ ПРОГРЕСС ЗАМЕНИТСЯ';});

