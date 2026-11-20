// VØID этап 8 · js8 — разбор исполняемого скрипта для сборщика build8 (только чтение; ничего не меняет).
// Вход — файл с ТЕКСТОМ основного скрипта (без <script>); строки нумеруются с 1, как «строки скрипта» в ТЗ.
//   node js8.js parse   <script.js>                       → {ok, error?}
//   node js8.js cuts    <script.js> <lines.json>          → {inside:[[строка, тип оператора, строки]]} — какие строки-разрезы внутри оператора
//   node js8.js safe    <script.js>                       → {safe:[строки]} — начала строк, где можно резать по оператору
//   node js8.js init    <script.js>                       → {lexicalBelow:[[имя,вид,строка ссылки,строка объявления]], functionBelow:n}
//   node js8.js dangle  <full.js> <variant.js>            → {removed:n, unguarded:{имя:[строки]}, guarded:{имя:[строки]}}
//   node js8.js index   <script.js> <ranges.json>         → индекс по кускам: объявления, ГСЧ, ссылки между кусками
// ranges.json: [[первая строка, последняя строка, id куска], …] — покрывают весь скрипт.
'use strict';
const fs=require('fs'),path=require('path');const NM=path.join(__dirname,'node_modules');
const acorn=require(path.join(NM,'acorn')),walk=require(path.join(NM,'acorn-walk')),escope=require(path.join(NM,'eslint-scope'));
const [cmd,...A]=process.argv.slice(2);
const rd=f=>fs.readFileSync(f,'utf8');
const parse=S=>acorn.parse(S,{ecmaVersion:2022,sourceType:'script',ranges:true,locations:true,allowHashBang:false});
const out=o=>{process.stdout.write(JSON.stringify(o));};
function lineStarts(S){const r=[0];for(let i=0;i<S.length;i++)if(S.charCodeAt(i)===10)r.push(i+1);return r;}
function scope(ast){return escope.analyze(ast,{ecmaVersion:2022,sourceType:'script'});}
function inFn(sc,gs){let q=sc;while(q&&q.type!=='function'&&q!==gs)q=q.upper;return !!(q&&q.type==='function');}
try{
 if(cmd==='parse'){try{parse(rd(A[0]));out({ok:true});}catch(e){out({ok:false,error:e.message});process.exitCode=1;}}
 else if(cmd==='cuts'){const S=rd(A[0]),ast=parse(S),ls=lineStarts(S),L=JSON.parse(rd(A[1]));const inside=[];
   for(const l of L){const p=ls[l-1];const n=ast.body.find(n=>n.start<p&&n.end>p);if(n)inside.push([l,n.type,n.loc.start.line,n.loc.end.line]);}
   out({inside});}
 else if(cmd==='safe'){const S=rd(A[0]),ast=parse(S),ls=lineStarts(S);const safe=[];let k=0;const B=ast.body;
   for(let l=1;l<=ls.length;l++){const p=ls[l-1];while(k<B.length&&B[k].end<=p)k++;const n=B[k];if(!n||n.start>=p)safe.push(l);}
   out({safe});}
 else if(cmd==='init'){const S=rd(A[0]),ast=parse(S),sm=scope(ast),gs=sm.globalScope;const lex=[];let fnb=0;
   for(const sc of sm.scopes){if(inFn(sc,gs))continue;
     for(const r of sc.references){const v=r.resolved;if(!v||v.scope!==gs||!r.isRead())continue;const d=v.defs[0];if(!d)continue;
       if(d.name.range[0]>r.identifier.range[0]){if(d.type==='FunctionName')fnb++;else lex.push([v.name,d.type==='Variable'?d.parent.kind:d.type,r.identifier.loc.start.line,d.name.loc.start.line]);}}}
   out({lexicalBelow:lex,functionBelow:fnb});}
 else if(cmd==='dangle'){const F=parse(rd(A[0])),Vs=rd(A[1]),V=parse(Vs);const fa=scope(F).globalScope,vs=scope(V),va=vs.globalScope;
   const declA=new Set(fa.variables.map(v=>v.name)),declB=new Set(va.variables.map(v=>v.name));const gone=new Set([...declA].filter(n=>!declB.has(n)));
   const ung={},gd={};
   for(const r of va.through){const n=r.identifier.name;if(!gone.has(n))continue;const st=V.body.find(s=>s.range[0]<=r.identifier.range[0]&&s.range[1]>=r.identifier.range[1]);
     const txt=st?Vs.slice(st.range[0],st.range[1]):'';const g=new RegExp('typeof\\s+'+n.replace(/\$/g,'\\$')+'\\b').test(txt);
     ((g?gd:ung)[n]=(g?gd:ung)[n]||[]).push(r.identifier.loc.start.line);}
   out({removed:gone.size,unguarded:ung,guarded:gd});}
 else if(cmd==='index'){const S=rd(A[0]),ast=parse(S),sm=scope(ast),gs=sm.globalScope,R=JSON.parse(rd(A[1]));
   const ids=R.map(r=>r[2]);const idx=new Int32Array(S.split('\n').length+2).fill(-1);R.forEach((r,i)=>{for(let l=r[0];l<=r[1]&&l<idx.length;l++)idx[l]=i;});
   const at=l=>ids[idx[l]];
   // объявления верхнего уровня
   const decl=[];const kindOf={};
   for(const v of gs.variables){const d=v.defs[0];if(!d)continue;const k=d.type==='FunctionName'?'function':d.type==='ClassName'?'class':(d.parent&&d.parent.kind)||d.type.toLowerCase();
     kindOf[v.name]=[k,d.name.loc.start.line];decl.push([v.name,k,d.name.loc.start.line,at(d.name.loc.start.line)]);}
   decl.sort((a,b)=>a[2]-b[2]);
   // ссылки между кусками (только имена верхнего уровня); load — вне тел функций
   const deps={},uses={};const inc=(a,b,t)=>{const k=a+'\u0001'+b;(deps[k]=deps[k]||{load:0,run:0,write:0})[t]++;};
   for(const sc of sm.scopes){const f=inFn(sc,gs);for(const r of sc.references){const v=r.resolved;if(!v||v.scope!==gs||!kindOf[v.name])continue;
     const a=at(r.identifier.loc.start.line),b=at(kindOf[v.name][1]);
     {const u=(uses[v.name]=uses[v.name]||{});const e=(u[a]=u[a]||[0,0,0,0]);if(r.isWrite()&&!r.init)e[2]++;if(r.isRead())e[f?1:0]++;if(!e[3]||r.identifier.loc.start.line<e[3])e[3]=r.identifier.loc.start.line;}
     if(a===b)continue;
     if(r.isWrite()&&!r.init)inc(a,b,'write');if(r.isRead())inc(a,b,f?'run':'load');}}
   // Math.random: объемлющая функция верхнего уровня или «загрузка»
   const rng=[];const tops=[];
   for(const n of ast.body){if(n.type==='FunctionDeclaration')tops.push([n.start,n.end,n.id.name]);}
   walk.full(ast,n=>{if(n.type==='MemberExpression'&&!n.computed&&n.object.type==='Identifier'&&n.object.name==='Math'&&n.property.name==='random'){
     const t=tops.find(t=>t[0]<=n.start&&t[1]>=n.end);rng.push([n.loc.start.line,t?t[2]:'(вне объявлений функций)',at(n.loc.start.line)]);}});
   out({decl,deps:Object.entries(deps).map(([k,v])=>[...k.split('\u0001'),v.load,v.run,v.write]),rng,uses});}
 else{out({error:'неизвестная команда '+cmd});process.exitCode=3;}
}catch(e){out({error:String(e&&e.message||e)});process.exitCode=3;}
