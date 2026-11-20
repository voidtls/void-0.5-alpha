// ARCH·89: смена объекта G.save через saveSet6(S, класс) и временная подмена через saveWith6(S, fn) с восстановлением в finally.
// Источник — dump88 (FIELD=save) по 1.5.28: 17 записей, все — отдельные операторы-выражения (значение не используется).
const fs=require('fs'),path=require('path');const build=require('./sites6.js');
const h=fs.readFileSync(process.argv[2],'utf8');const I0=h.indexOf('<script>\n"use strict";')+8,J0=h.indexOf('</script>',I0);const src=h.slice(I0,J0);
const T=JSON.parse(fs.readFileSync(path.join(__dirname,'t89.json'),'utf8'));if(T.length!==17||T.some(o=>o.used||o.op!=='='))throw new Error('ожидалось 17 записей-операторов');
// класс каждой записи — по функции и тексту (проверяется ниже)
const CLS={arch69Boot:'load',cloudReloadState:'load',exit:'load',suspend:'load',startWorld:'new',fullReset:'reset',addPilotXPTo:'temp',dvSnapLoad:'dev',dvCopyMine:'dev',dvAct:'dev'};
const items=[];const special=new Set(['doneCountS','devAct']);
for(const o of T){if(special.has(o.unit))continue;let c=CLS[o.unit];
  if(o.unit==='(top)'){const ctx=src.slice(o.a-420,o.b+60);c=ctx.includes("$('#bSaveLoad').onclick")?'import':ctx.includes('load(s){store(saveKey()')?'load':ctx.includes("addEventListener('resize',resize);")?'load':null;}
  if(!c)throw new Error('нет класса для '+o.unit+'@'+o.line);
  items.push({a:o.a,b:o.b,t:'saveSet6('+o.rhs+",'"+c+"')",unit:o.unit,cls:c,line:o.line});}
// doneCountS — целиком
const d0="function doneCountS(S){const k=G.save;G.save=S;const n=doneCount();G.save=k;return n;}";const da=src.indexOf(d0);if(da<0||src.indexOf(d0,da+1)>=0)throw new Error('doneCountS');
items.push({a:da,b:da+d0.length,t:"function doneCountS(S){return saveWith6(S,doneCount);}",unit:'doneCountS',cls:'temp'});
// devAct: восстановление после addPilotXPTo — в finally; G.pilotUps=[] — как прежде, только на обычном пути
const v0="const keep=G.save;addPilotXPTo(S,pilotNeed(S.pilot.lvl)-S.pilot.xp);if(!sb){G.save=keep;G.pilotUps=[];}";const va=src.indexOf(v0);if(va<0||src.indexOf(v0,va+1)>=0)throw new Error('devAct');
items.push({a:va,b:va+v0.length,t:"const keep=G.save;try{addPilotXPTo(S,pilotNeed(S.pilot.lvl)-S.pilot.xp);}finally{if(!sb)saveSet6(keep,'temp');}if(!sb)G.pilotUps=[];",unit:'devAct',cls:'temp'});
if(items.length!==16)throw new Error('мест '+items.length);
const {sites}=build(h,src,I0,items);
fs.writeFileSync(path.join(__dirname,'s89.json'),JSON.stringify({sites,reg:items.map(i=>({unit:i.unit,cls:i.cls}))}));console.log('мест',sites.length,items.map(i=>i.unit+':'+i.cls).join(' '));
