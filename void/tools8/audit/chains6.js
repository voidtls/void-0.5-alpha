// Этап 7 · манифест цепочек исполнения: для каждого глобального имени с переустановками — слои по порядку установки,
// форма, класс, назначение (ближайший комментарий над слоем и версия), какие поля G пишут слои, и ограничения порядка.
//   node tools6/chains6.js <сборка.html> <out.json>      (сам вызывает w6 --shape и g6; сборку не меняет)
// Классы: 1 — функциональный слой (добавляет поведение: хук до/после, условная замена); 2 — защитный или совместимый (изоляция RNG
// iso63/iso65, HUD arch70Hud, миграции сохранений migrateSave, временная подмена во время игры с восстановлением);
// 5 — замещённое объявление (объявление + замена присваиванием без захвата прежней). Класс 3 (серия соседних слоёв ОДНОЙ подсистемы,
// сливаемая без потерь) после ARCH·86 отсутствует; класс 4 (недостижимые объявления) снят ARCH·85. 11 серий соседних слоёв РАЗНЫХ подсистем
// (dump86 их не сливает) остаются классом 1 и перечислены в поле crossSeries с подсистемами слоёв — каждый слой переезжает со своей подсистемой.
const path=require('path'),fs=require('fs'),cp=require('child_process'),os=require('os');
const B=process.argv[2],OUT=process.argv[3];const tw=path.join(os.tmpdir(),'ch6w_'+process.pid+'.json'),tg=path.join(os.tmpdir(),'ch6g_'+process.pid+'.json');
cp.execFileSync('node',[path.join(__dirname,'w6.js'),B,tw,'--shape'],{stdio:'ignore'});cp.execFileSync('node',[path.join(__dirname,'g6.js'),B,tg],{stdio:'ignore'});
const W=JSON.parse(fs.readFileSync(tw,'utf8')),SH=JSON.parse(fs.readFileSync(tw.replace('.json','_shape.json'),'utf8')),Gx=JSON.parse(fs.readFileSync(tg,'utf8'));
const html=fs.readFileSync(B,'utf8');const k=html.indexOf('<script>\n"use strict";');const L=html.slice(k+8,html.indexOf('</script>',k)).split('\n');
const HDR=/^(\/\/ =====|\/\* =====|\/\/ -----|\/\* ---------- |\/\* ▼▼▼|\/\/ ===)/;const secOf=line=>{for(let i=line-1;i>=1;i--){const s=L[i-1]||'';if(HDR.test(s))return s.replace(/^[\/* =▼-]+/,'').replace(/[ =*\/-]+$/,'').slice(0,120);}return null;};
const comm=line=>{for(let i=line-1;i>=Math.max(0,line-4);i--){const s=L[i-1]||'';const m=s.match(/\/\*\s*([^*][\s\S]*?)\s*\*\/\s*$/)||s.match(/^\s*\/\/\s*(.+)$/);if(m)return m[1].slice(0,160);}
  const s=L[line-1]||'';const m=s.match(/\/\*\s*([^*][^]*?)\*\//);return m?m[1].slice(0,160):null;};
// поля G, которые пишут слои имени (единицы g6 «имя~wN»)
const fw={},fd={};for(const [f,v] of Object.entries(Gx.fields)){for(const x of [...v.writes,...v.bulk,...v.nested]){const u=x.split('@')[0];const m=u.match(/^(.+)~w\d+$/);if(m)(fw[m[1]]=fw[m[1]]||new Set()).add(f);}
  for(const x of [...v.writes,...v.bulk]){const u=x.split('@')[0];const m=u.match(/^(.+)~w\d+$/);if(m)(fd[m[1]]=fd[m[1]]||new Set()).add(f);}}/* fd — прямые и групповые записи самого поля (не вложенные G.f.x) */
const CTRL=new Set(['state','save','xp','lvl','need','lvlQ','bpQ','briefQ','briefN','prio','aimLock','tg90','noTg75','aimWarn75']);
const shapeOf=(n,l)=>{const s=SH.find(x=>x.name===n&&x.line===l);return s?s.shape:null;};
const out={build:path.basename(B),note:'Порядок слоёв каждого имени — порядок установки; при физическом разделении исходников (этап 8) он должен сохраниться.',chains:{}};
const cnt={1:0,2:0,5:0};
for(const [n,c] of Object.entries(W.chains)){const ops=c.ops.map((o,i)=>{const sh=o.form==='функция'?shapeOf(n,o.line):null;
    let cls,why;
    if(o.factory){cls=2;why={iso63:'изоляция RNG звука (Math.random → SFXR63): игровой RNG не расходуется звуком',iso65:'изоляция RNG визуала (Math.random → VFXR65): игровой RNG не расходуется эффектами',arch70Hud:'HUD-обёртка этапа 3 (ARCH·70)'}[o.factory]||'фабрика '+o.factory;}
    else if(/во время игры/.test(o.where)){cls=2;why='временная подмена на время построения (wkBuild), восстанавливается в finally';}
    else if(!o.captures){cls=5;why='замещённое объявление: замена присваиванием без захвата прежней';}
    else if(n==='migrateSave'){cls=2;why='миграция старых форматов сохранения';}
    else {cls=1;why=sh||'слой';}
    cnt[cls]++;
    return {i:i+1,line:o.line,where:o.where,form:o.form,factory:o.factory,shape:sh,block:o.block,ver:o.ver,cls,why,comment:comm(o.line),section:secOf(o.line),feat:o.feat};});
  const writes=[...(fw[n]||[])].sort();
  out.chains[n]={depth:c.depth,decls:c.decls,layers:ops,writesG:writes,writesControlled:[...(fd[n]||[])].filter(f=>CTRL.has(f)).sort(),
    order:ops.length>1?'слои '+ops.map(o=>o.line).join(' → ')+' должны устанавливаться в этом порядке после объявления':'один слой',
    bootInstalled:ops.some(o=>/arch70Boot/.test(o.where)),runtime:ops.some(o=>/во время игры/.test(o.where))};}
out.summary={withComment:Object.values(out.chains).reduce((s,c)=>s+c.layers.filter(l=>l.comment).length,0),sectionOnly:Object.values(out.chains).reduce((s,c)=>s+c.layers.filter(l=>!l.comment&&l.section).length,0),noContext:Object.values(out.chains).reduce((s,c)=>s+c.layers.filter(l=>!l.comment&&!l.section).length,0),names:Object.keys(out.chains).length,layers:Object.values(out.chains).reduce((s,c)=>s+c.layers.length,0),byClass:cnt,
  maxDepth:Math.max(...Object.values(out.chains).map(c=>c.depth)),writingControlled:Object.entries(out.chains).filter(([n,c])=>c.writesControlled.length).map(([n,c])=>n+': '+c.writesControlled.join(','))};
try{const T86=JSON.parse(fs.readFileSync(path.join(__dirname,'..','stage6','gen','t86.json'),'utf8'));out.crossSeries=T86.series.filter(x=>!x.ok).map(x=>({name:x.name,layers1525:x.layers,subsystems:x.subs||x.why}));}catch(e){out.crossSeries=null;}
fs.writeFileSync(OUT,JSON.stringify(out,null,1));fs.unlinkSync(tw);fs.unlinkSync(tg);
console.log('chains6: имён',out.summary.names,'· назначение: комментарий у слоя',out.summary.withComment,'· только заголовок раздела',out.summary.sectionOnly,'· без контекста',out.summary.noContext,'· записей (слоёв)',out.summary.layers,'· по классам',JSON.stringify(cnt),'· макс. глубина',out.summary.maxDepth,'· слои, пишущие поля под границами:',out.summary.writingControlled.length?out.summary.writingControlled.join('; '):'нет');
