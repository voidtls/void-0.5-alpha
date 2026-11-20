// ---- код сохранения ----
function openSaveScreen(){try{$('#bSaveShare').hidden=!navigator.share;$('#savePasteRow').hidden=!(navigator.clipboard&&navigator.clipboard.readText);}catch(e){}/*DEVW*/if(window.DEVW&&!DEVW.on())DEVW.clearFlag(true);
  scr6('save');const S=store('void_world');
  $('#saveOut').value=validSave(S)?btoa(unescape(encodeURIComponent(JSON.stringify(S)))):'';
  $('#saveOut').placeholder='Сохранения пока нет. Начните полёт в открытом секторе.';$('#saveIn').value='';$('#saveMsg').textContent=saveStatus();show('sSave');
}
$('#bSaveCopy').onclick=()=>{const t=$('#saveOut');if(!t.value){$('#saveMsg').textContent='Копировать нечего: сохранения пока нет.';return;}
  const done=()=>{$('#saveMsg').textContent='Код скопирован.';};
  // 1.0.0 α: во встроенном окне буфер часто запрещён — запасной путь через выделение и execCommand
  const manual=()=>{try{t.focus();t.select();t.setSelectionRange(0,t.value.length);if(document.execCommand&&document.execCommand('copy')){done();return;}}catch(e){}
    $('#saveMsg').textContent='Код выделен — скопируйте его вручную (долгое нажатие → «Копировать»).';};
  try{if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t.value).then(done,manual);else manual();}catch(e){manual();}};
// 1.0.0 α: код чистится от того, что добавляют чаты и мессенджеры: кавычки, переносы, неразрывные и невидимые пробелы, текст вокруг
function codeDecode(raw){const one=c=>{c=c.replace(/=+$/,'').replace(/-/g,'+').replace(/_/g,'/');while(c.length%4)c+='=';const S=JSON.parse(decodeURIComponent(escape(atob(c))));return validSave(S)?S:null;};
  const s0=String(raw||'').replace(/[​-‏⁠﻿­]/g,'').replace(/[  -   　]/g,' ');
  const flat=s0.replace(/[\s"'`«»“”„‘’<>]/g,''),cands=[];
  const i=flat.indexOf('eyJ');if(i>=0){const m=flat.slice(i).match(/^[A-Za-z0-9+/=_-]+/);if(m)cands.push(m[0]);}
  const runs=flat.match(/[A-Za-z0-9+/_-]{40,}={0,2}/g);if(runs)cands.push(...runs.sort((a,b)=>b.length-a.length));cands.push(flat);
  for(const c of cands){try{const S=one(c);if(S)return S;}catch(e){}}return null;}
$('#bSaveLoad').onclick=()=>{const raw=$('#saveIn').value,S0=codeDecode(raw);
  if(!S0){$('#saveMsg').textContent=raw.trim()?'Код не распознан. Проверьте, что он скопирован целиком.':'Вставьте код сохранения в поле.';return;}
  store('void_world',S0);const S=migrateSave(JSON.parse(JSON.stringify(S0)));saveSet6(S,'import');cloudForce();
  $('#saveMsg').textContent='Полёт загружен: пройдено миссий — '+worldDone(S0)+'.';renderMenu();};
$('#bSaveBack').onclick=()=>toMenu();
