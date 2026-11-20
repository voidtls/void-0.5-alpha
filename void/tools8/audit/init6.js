// Этап 8 · подготовка: зависимости инициализации и глобальные интерфейсы (только чтение сборки).
//   node tools6/init6.js <сборка.html> <out.json>
// Разделы — диапазоны строк между заголовками-комментариями («// =====», «/* =====», «// -----», «/* ---------- », блоки ARCH).
// Считается: какие операторы верхнего уровня исполняются при загрузке (всё, кроме объявлений функций), на какие привязки верхнего
// уровня (const/let/var/функции) они ссылаются при загрузке (вне тел функций), и из скольких разделов на каждую привязку
// ссылаются тела функций (кандидаты в общие интерфейсы). Объявления функций поднимаются — их можно переносить между файлами
// свободно; операторы, исполняемые при загрузке, — только с сохранением порядка относительно того, что они читают.
const path=require('path'),fs=require('fs');const NM=path.join(__dirname,'..','node_modules');
const acorn=require(path.join(NM,'acorn')),escope=require(path.join(NM,'eslint-scope'));
const html=fs.readFileSync(process.argv[2],'utf8');const k=html.indexOf('<script>\n"use strict";');const src=html.slice(k+8,html.indexOf('</script>',k));
const ast=acorn.parse(src,{ecmaVersion:2022,ranges:true,locations:true});const sm=escope.analyze(ast,{ecmaVersion:2022});const gs=sm.globalScope;
const lines=src.split('\n');const hdr=[];lines.forEach((l,i)=>{if(/^(\/\/ =====|\/\* =====|\/\/ -----|\/\* ---------- |\/\* ▼▼▼ ARCH·)/.test(l))hdr.push({line:i+1,t:l.replace(/^[\/* =▼-]+/,'').slice(0,70)});});
const secOf=ln=>{let s=0;for(let i=0;i<hdr.length;i++){if(hdr[i].line<=ln)s=i+1;else break;}return s;};
const decl={};for(const v of gs.variables){const d=v.defs[0];if(!d)continue;decl[v.name]={kind:d.type==='FunctionName'?'function':d.parent&&d.parent.kind||d.type,line:d.name.loc.start.line,sec:secOf(d.name.loc.start.line),refsSec:new Set(),loadRefs:0};}
// ссылки: из тела функции (во время игры) или из кода верхнего уровня (при загрузке)
for(const sc of sm.scopes){for(const r of sc.references){const v=r.resolved;if(!v||v.scope!==gs||!decl[v.name])continue;const ln=r.identifier.loc.start.line;
  let s=sc;while(s&&s.type!=='function'&&s!==gs)s=s.upper;const inFn=s&&s.type==='function';
  if(inFn)decl[v.name].refsSec.add(secOf(ln));else{decl[v.name].loadRefs++;}}}
// операторы верхнего уровня, исполняемые при загрузке, и их ссылки назад (на что опираются)
const stmts=ast.body.filter(s=>s.type!=='FunctionDeclaration');const back={};let crossSec=0,total=0;
for(const s of stmts){const sl=s.loc.start.line,ss=secOf(sl);const seen=new Set();
  for(const sc of sm.scopes){if(sc.block.range[0]<s.range[0]||sc.block.range[1]>s.range[1])if(sc!==gs)continue;
    for(const r of sc.references){if(r.identifier.range[0]<s.range[0]||r.identifier.range[1]>s.range[1])continue;let q=sc;while(q&&q.type!=='function'&&q!==gs)q=q.upper;if(q&&q.type==='function')continue;
      const v=r.resolved;if(!v||v.scope!==gs||!decl[v.name]||seen.has(v.name))continue;seen.add(v.name);total++;if(decl[v.name].sec!==ss)crossSec++;}}}
const iface=Object.entries(decl).map(([n,d])=>({n,kind:d.kind,line:d.line,secs:d.refsSec.size,loadRefs:d.loadRefs})).filter(x=>x.secs>=8).sort((a,b)=>b.secs-a.secs);
const out={sections:hdr.length,topLevel:ast.body.length,functionsDecl:ast.body.length-stmts.length,loadStatements:stmts.length,
  loadKinds:stmts.reduce((o,s)=>{const k=s.type==='VariableDeclaration'?s.kind:s.type;o[k]=(o[k]||0)+1;return o;},{}),
  loadRefsTotal:total,loadRefsCrossSection:crossSec,globals:Object.keys(decl).length,
  interfaces:iface.slice(0,80),interfacesCount:iface.length};
fs.writeFileSync(process.argv[3],JSON.stringify(out,null,1));
console.log('разделов',out.sections,'· операторов верхнего уровня',out.topLevel,'· объявлений функций',out.functionsDecl,'· исполняемых при загрузке',out.loadStatements,JSON.stringify(out.loadKinds));
console.log('ссылок при загрузке на привязки верхнего уровня',total,'· из них на привязки другого раздела',crossSec);
console.log('привязок, на которые ссылаются функции из ≥ 8 разделов:',iface.length,'· первые:',iface.slice(0,30).map(x=>x.n+'('+x.secs+')').join(' '));
