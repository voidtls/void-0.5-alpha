// ===== 1.0.0 α: облачное сохранение — личная папка игрока в базе артефакта (data/users/<id>/save) =====
// Переживает публикацию новых версий и смену устройства. Решение «облако или браузер»: явное действие (новый полёт, сброс, загрузка
// кода) побеждает; иначе побеждает больший прогресс (пройденные миссии); при равенстве — более свежая запись.
var CLOUD_KEYS=['void_world','void_record','void_endless','void_settings','void_echo100','void_serial85'];
var CLOUD={state:'init',ref:null,dirty:false,busy:false,again:false,tm:0,lastAt:0,sig:'',applying:false,pending:null,waiters:[],gateOff:false,err:''};
function metaGet(){try{const v=JSON.parse(LS.getItem('void_meta')||'null');return v&&typeof v==='object'?{t:+v.t||0,force:+v.force||0}:{t:0,force:0};}catch(e){return {t:0,force:0};}}
function metaSet(m){try{LS.setItem('void_meta',JSON.stringify(m),true);}catch(e){}}
function worldDone(raw){try{const S=typeof raw==='string'?JSON.parse(raw):raw;if(!validSave(S))return 0;let n=0;
  for(let m=1;m<=NM;m++)if((m<=CORE&&+S.cleared>=m)||(S.medals&&S.medals[m]&&S.medals[m].clear)||(m===49&&S.story&&S.story.zero49))n++;return n;}catch(e){return 0;}}
LS.onWrite(k=>{if(CLOUD.applying||!CLOUD_KEYS.includes(k))return;const m=metaGet();m.t=Date.now();metaSet(m);cloudDirty();});
function cloudForce(){const m=metaGet();m.force=m.t=Date.now();metaSet(m);cloudDirty(true);}
function cloudBody(){const keys={};for(const k of CLOUD_KEYS)keys[k]=LS.getItem(k);const m=metaGet();return {v:1,t:m.t||Date.now(),force:m.force||0,done:worldDone(keys.void_world),ver:'1.0.0a',keys};}
function cloudSig(b){return JSON.stringify(b.keys)+'|'+b.force;}
function cloudDirty(now){CLOUD.dirty=true;if(CLOUD.state!=='ready')return;clearTimeout(CLOUD.tm);
  CLOUD.tm=setTimeout(cloudPush,now?60:Math.min(12000,Math.max(3000,12000-(Date.now()-CLOUD.lastAt))));}
async function cloudPush(){if(CLOUD.state!=='ready'||!CLOUD.ref)return;if(CLOUD.busy){CLOUD.again=true;return;}if(!CLOUD.dirty)return;
  const b=cloudBody(),sg=cloudSig(b);if(sg===CLOUD.sig){CLOUD.dirty=false;return;}CLOUD.busy=true;CLOUD.dirty=false;
  try{await CLOUD.ref.set(b);CLOUD.sig=sg;CLOUD.lastAt=Date.now();CLOUD.err='';}
  catch(e){const c=e&&e.code;CLOUD.dirty=true;CLOUD.err=c||'unavailable';
    if(['invalid_argument','not_granted','capability_disabled','capability_removed','revoked','transform_error'].includes(c))CLOUD.state='ro';
    else if(c==='quota_exceeded')toast('ОБЛАКО ЗАПОЛНЕНО','Облачная копия не записана: место в хранилище закончилось. Код сохранения в меню по-прежнему работает.');
    else setTimeout(()=>{if(CLOUD.dirty)cloudPush();},2500+Math.random()*2000);}
  finally{CLOUD.busy=false;if(CLOUD.again){CLOUD.again=false;if(CLOUD.dirty)cloudDirty();}}}
function cloudWinner(body){if(!body||!body.keys)return 'local';const lw=LS.getItem('void_world'),ld=worldDone(lw),m=metaGet(),ct=+body.t||0,cf=+body.force||0,cd=+body.done||0;
  if(m.force&&m.force>ct)return 'local';if(cf&&cf>m.t)return 'cloud';if(!lw&&body.keys.void_world)return 'cloud';
  if(cd>ld)return 'cloud';if(ld>cd)return 'local';return ct>m.t?'cloud':'local';}
function cloudApply(body){CLOUD.applying=true;
  try{for(const k of CLOUD_KEYS){if(!(k in body.keys))continue;const v=body.keys[k];try{if(v===null||v===undefined)LS.removeItem(k,true);else LS.setItem(k,String(v),true);}catch(e){}}
    metaSet({t:+body.t||Date.now(),force:0});}finally{CLOUD.applying=false;}
  CLOUD.sig=cloudSig(cloudBody());cloudReloadState();}
function cloudReloadState(){saveSet6(migrateSave(store('void_world')),'load');recReload();
  const v=store('void_settings');if(v&&typeof v==='object'&&!Array.isArray(v)){for(const k in SET_DEF){if(!(k in v))continue;const x=v[k];
    if(SET_OPT[k]?SET_OPT[k].includes(x):(typeof x===typeof SET_DEF[k]&&(typeof x!=='number'||Number.isFinite(x))))SET[k]=x;}try{applySettings();renderSettings();}catch(e){}}
  if(G.state==='menu')renderMenu();}
async function cloudInit(){const done=()=>{if(CLOUD.gateOff)return;CLOUD.gateOff=true;const W_=CLOUD.waiters.splice(0);try{if(G.state==='menu')renderMenu();}catch(e){}
    for(const f of W_){try{f();}catch(e){console.error(e);}}};
  setTimeout(done,LS.getItem('void_world')?6000:15000);
  try{const C=typeof window!=='undefined'?window.claude:null;if(!C||typeof C.use!=='function'){CLOUD.state='off';return done();}
    const [db,user]=await Promise.all([C.use('db'),C.use('user')]);if(!db||!user){CLOUD.state='off';return done();}
    const uid=await user.id();if(!uid){CLOUD.state='off';return done();}
    CLOUD.ref=db.doc('data/users/'+uid+'/save');let snap=null;
    for(let a=0;a<2&&!snap;a++){try{snap=await CLOUD.ref.get();}catch(e){if(a)throw e;await new Promise(r=>setTimeout(r,1500));}}
    const body=snap&&snap.exists?snap.data():null;CLOUD.state='ready';
    if(body&&cloudWinner(body)==='cloud'){if(G.state==='menu'){cloudApply(body);const n=worldDone(LS.getItem('void_world'));toast('ПРОГРЕСС ВОССТАНОВЛЕН',n?'Облачная копия: пройдено миссий '+n+' из '+NM+'.':'Облачная копия загружена.');}else CLOUD.pending=body;}
    else cloudDirty(true);
  }catch(e){CLOUD.state='off';CLOUD.err=(e&&e.code)||'error';}
  done();}
function cloudMenuCheck(){const b=CLOUD.pending;if(!b)return;CLOUD.pending=null;if(cloudWinner(b)==='cloud'){cloudApply(b);toast('ПРОГРЕСС ВОССТАНОВЛЕН','Облачная копия загружена.');}else cloudDirty(true);}
function cloudGate(f){if(CLOUD.gateOff||CLOUD.state!=='init'){f();return;}CLOUD.waiters.length=0;CLOUD.waiters.push(f);toast('СИНХРОНИЗАЦИЯ','Проверяю облачное сохранение…');}
function cloudFlush(){if(CLOUD.state==='ready'&&CLOUD.dirty){clearTimeout(CLOUD.tm);cloudPush();}}
addEventListener('visibilitychange',()=>{if(document.hidden)cloudFlush();});addEventListener('pagehide',cloudFlush);
function saveWhere(){const C=window.CLOUD;if(C&&C.state==='init'&&!C.gateOff)return 'ПРОВЕРКА…';if(C&&C.state==='ready')return 'ОБЛАКО';return LS.ok()&&LS.persisted('void_world')?'БРАУЗЕР':'ВКЛАДКА';}
function saveStatus(){const C=window.CLOUD;if(C&&C.state==='ready')return 'Прогресс сохраняется автоматически.';
  if(LS.ok()&&LS.persisted('void_world'))return 'Прогресс хранится только на этом устройстве — сохраните код.';
  return 'Здесь прогресс не сохраняется. Скопируйте код перед выходом.';}

$('#bSaveShare').onclick=()=>{const t=$('#saveOut').value;if(!t||!navigator.share)return;navigator.share({title:'VØID · код сохранения',text:t}).catch(()=>{});};
$('#bSavePaste').onclick=()=>{try{navigator.clipboard.readText().then(v=>{$('#saveIn').value=v||'';$('#saveMsg').textContent=v?'Код вставлен — нажмите «ЗАГРУЗИТЬ КОД».':'Буфер обмена пуст.';},()=>{$('#saveMsg').textContent='Браузер не дал прочитать буфер — вставьте код вручную.';});}catch(e){$('#saveMsg').textContent='Вставьте код вручную.';}};

