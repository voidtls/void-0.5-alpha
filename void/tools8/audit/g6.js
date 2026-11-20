// Этап 6 · аудит · g6 — перепись полей глобального объекта G по AST (только чтение сборки, ничего не меняет).
//   node tools6/g6.js <сборка.html> <out.json>
// Для каждого поля верхнего уровня G (G.f) собирается:
//   writes  — прямые записи: =, op=, ++/--, delete, цель деструктуризации, Object.assign(G,{f}) (bulk);
//   nested  — мутации вложенного: G.f.x=…, G.f[i]=…, G.f.x++, delete G.f.x, G.f.push/splice/…(…), Object.assign(G.f,…);
//   alias   — G.f сохраняется в локальную переменную/свойство/аргумент (дальнейшие мутации через псевдоним не прослеживаются);
//   reads   — остальные обращения.
// Единица кода: имя функции верхнего уровня; анонимная функция, присвоенная глобальному имени на верхнем уровне
// (переустановка/обёртка), — «имя~wN»; код верхнего уровня — «(top)». Псевдонимы самого G и вычисляемые ключи — отдельно.
const path=require('path'),fs=require('fs');
process.on('uncaughtException',e=>{console.error('g6: внутренняя ошибка: '+(e&&e.stack||e));process.exit(3);});
const NM=path.join(__dirname,'..','node_modules');
const acorn=require(path.join(NM,'acorn')),walk=require(path.join(NM,'acorn-walk')),escope=require(path.join(NM,'eslint-scope'));
const html=fs.readFileSync(process.argv[2],'utf8');const k=html.indexOf('<script>\n"use strict";');const src=html.slice(k+8,html.indexOf('</script>',k));
const ast=acorn.parse(src,{ecmaVersion:2022,sourceType:'script',ranges:true,locations:true});
const sm=escope.analyze(ast,{ecmaVersion:2022});const gs=sm.globalScope;
const Gv=gs.set.get('G');const refOf=new Map();for(const sc of sm.scopes)for(const r of sc.references)refOf.set(r.identifier,r);
const isG=n=>{if(!n||n.type!=='Identifier'||n.name!=='G')return false;const r=refOf.get(n);return !!(r&&r.resolved===Gv);};
const line=n=>n.loc.start.line;
// единицы кода
const fnVars=new Set(gs.variables.filter(v=>v.defs.some(d=>d.type==='FunctionName')));
const wN={};
function unitOf(st){
  for(let i=0;i<st.length;i++){const n=st[i];
    if(n.type==='FunctionDeclaration'&&i<=2)return n.id.name;
    if((n.type==='FunctionExpression'||n.type==='ArrowFunctionExpression')){
      // ищем ближайшее присваивание глобальному имени функции над этой функцией (обёртка/переустановка)
      for(let j=i-1;j>=0;j--){const a=st[j];if(a.type==='AssignmentExpression'&&a.left.type==='Identifier'){const r=refOf.get(a.left);if(r&&r.resolved&&fnVars.has(r.resolved)){const key=a.left.name+'@'+a.range[0];if(!wN[key])wN[key]=a.left.name+'~w'+(Object.keys(wN).filter(x=>x.startsWith(a.left.name+'@')).length+1);return wN[key];}}
        if(a.type==='FunctionDeclaration')return a.id.name;}
      // вызов фабрики на верхнем уровне без присваивания (IIFE) — относим к (top)
    }
  }
  return '(top)';}
const MUT=new Set(['push','pop','shift','unshift','splice','sort','reverse','fill','copyWithin','set','delete','clear','add']);
const R={};const F=f=>R[f]||(R[f]={writes:[],nested:[],alias:[],reads:0,readers:{},bulk:[]});
const add=(o,u,l,kind)=>o.push(u+'@'+l+(kind?':'+kind:''));
const gAlias=[],dyn=[],escapes=[];
walk.fullAncestor(ast,(n,st)=>{
  if(n.type==='Identifier'&&isG(n)){const p=st[st.length-2];
    if(p&&p.type==='MemberExpression'&&p.object===n)return;
    // G как значение
    if(p&&p.type==='CallExpression'&&p.callee.type==='MemberExpression'&&p.callee.object.name==='Object'&&p.callee.property.name==='assign'&&p.arguments[0]===n){
      for(const a of p.arguments.slice(1)){if(a.type==='ObjectExpression'){for(const pr of a.properties){if(pr.type==='Property'&&!pr.computed){const f=pr.key.name||pr.key.value;F(f).bulk.push(unitOf(st)+'@'+line(p));}else dyn.push(unitOf(st)+'@'+line(p)+' Object.assign(G, …spread/computed)');}}else dyn.push(unitOf(st)+'@'+line(p)+' Object.assign(G, не-литерал)');}
      return;}
    if(p&&p.type==='VariableDeclarator'&&p.init===n){gAlias.push(unitOf(st)+'@'+line(n)+' '+(p.id.name||'?'));return;}
    if(p&&p.type==='AssignmentExpression'&&p.right===n){gAlias.push(unitOf(st)+'@'+line(n)+' (присваивание)');return;}
    if(p&&(p.type==='BinaryExpression'||p.type==='UnaryExpression'&&p.operator==='typeof'))return;
    escapes.push(unitOf(st)+'@'+line(n)+' '+(p?p.type:'?'));return;}
  if(n.type!=='MemberExpression'||!isG(n.object))return;
  const u=unitOf(st);
  if(n.computed&&!(n.property.type==='Literal')){dyn.push(u+'@'+line(n)+' G[выражение]');return;}
  const f=n.computed?String(n.property.value):n.property.name;const e=F(f);
  const p=st[st.length-2];
  // прямые записи
  if(p.type==='AssignmentExpression'&&p.left===n){add(e.writes,u,line(n),p.operator==='='?'':p.operator);return;}
  if(p.type==='UpdateExpression'){add(e.writes,u,line(n),p.operator);return;}
  if(p.type==='UnaryExpression'&&p.operator==='delete'){add(e.writes,u,line(n),'delete');return;}
  if((p.type==='ArrayPattern')||(p.type==='Property'&&st[st.length-3]&&st[st.length-3].type==='ObjectPattern')||p.type==='AssignmentPattern'&&p.left===n){add(e.writes,u,line(n),'destructure');return;}
  if((p.type==='ForInStatement'||p.type==='ForOfStatement')&&p.left===n){add(e.writes,u,line(n),'for-left');return;}
  // вложенные мутации: поднимаемся по цепочке G.f.a.b
  let top=n,i=st.length-2;while(i>=0&&st[i].type==='MemberExpression'&&st[i].object===top){top=st[i];i--;}
  const q=st[i];
  if(top!==n){
    if(q&&q.type==='AssignmentExpression'&&q.left===top){add(e.nested,u,line(n),'=');return;}
    if(q&&q.type==='UpdateExpression'&&q.argument===top){add(e.nested,u,line(n),q.operator);return;}
    if(q&&q.type==='UnaryExpression'&&q.operator==='delete'&&q.argument===top){add(e.nested,u,line(n),'delete');return;}
    if(q&&q.type==='CallExpression'&&q.callee===top&&top.property&&MUT.has(top.property.name)){add(e.nested,u,line(n),top.property.name+'()');return;}
  }
  if(q&&q.type==='CallExpression'&&q.callee.type==='MemberExpression'&&q.callee.object.name==='Object'&&q.callee.property.name==='assign'&&q.arguments[0]===top){add(e.nested,u,line(n),'Object.assign');return;}
  // псевдоним значения поля (G.f целиком, не глубже) — мутации через него не видны
  if(top===n&&q&&((q.type==='VariableDeclarator'&&q.init===n)||(q.type==='AssignmentExpression'&&q.right===n))){add(e.alias,u,line(n));e.reads++;e.readers[u]=(e.readers[u]||0)+1;return;}
  e.reads++;e.readers[u]=(e.readers[u]||0)+1;
});
// второй проход: мутации через локальные псевдонимы поля (const p=G.player; p.hp-=…; p.list.push(…))
const aliasVar=new Map();
walk.fullAncestor(ast,(n,st)=>{if(n.type!=='VariableDeclarator'||n.id.type!=='Identifier'||!n.init)return;let m=n.init;
  if(m.type==='LogicalExpression')m=m.left;if(m.type!=='MemberExpression'||m.computed||!isG(m.object))return;
  const sc=sm.acquire(st.slice().reverse().find(x=>/Function/.test(x.type))||ast)||gs;let v=null;for(let s=sc;s&&!v;s=s.upper)v=s.set.get(n.id.name);
  if(v)aliasVar.set(v,m.property.name);});
const viaA={};
walk.fullAncestor(ast,(n,st)=>{if(n.type!=='MemberExpression'||n.object.type!=='Identifier')return;const r=refOf.get(n.object);if(!r||!r.resolved||!aliasVar.has(r.resolved))return;
  const f=aliasVar.get(r.resolved);let top=n,i=st.length-2;while(i>=0&&st[i].type==='MemberExpression'&&st[i].object===top){top=st[i];i--;}const q=st[i];let kind=null;
  if(q&&q.type==='AssignmentExpression'&&q.left===top)kind='=';else if(q&&q.type==='UpdateExpression'&&q.argument===top)kind=q.operator;else if(q&&q.type==='UnaryExpression'&&q.operator==='delete'&&q.argument===top)kind='delete';
  else if(q&&q.type==='CallExpression'&&q.callee===top&&top.property&&MUT.has(top.property.name))kind=top.property.name+'()';
  if(kind){const e=F(f);(e.viaAlias||(e.viaAlias=[])).push(unitOf(st)+'@'+line(n)+':'+kind);}});
// начальные ключи G
const gDecl=ast.body.find(s=>s.type==='VariableDeclaration'&&s.declarations.some(d=>d.id.name==='G'));const init=gDecl.declarations.find(d=>d.id.name==='G').init;
const initKeys=init.properties.map(p=>p.key.name||p.key.value);
const initType={};for(const p of init.properties){const v=p.value;initType[p.key.name||p.key.value]=v.type==='Literal'?(v.value===null?'null':typeof v.value):v.type==='ArrayExpression'?'array':v.type==='ObjectExpression'?'object':v.type==='UnaryExpression'?'number':v.type;}
const out={initLine:line(gDecl),initKeys,initType,fields:{},gAlias,dyn,escapes};
for(const [f,e] of Object.entries(R)){const wu=[...new Set(e.writes.map(x=>x.split('@')[0]))],nu=[...new Set(e.nested.map(x=>x.split('@')[0]))],bu=[...new Set(e.bulk.map(x=>x.split('@')[0]))];
  out.fields[f]={inInit:initKeys.includes(f),type:initType[f]||null,nW:e.writes.length,writers:wu,nNested:e.nested.length,nestedWriters:nu,nBulk:e.bulk.length,bulkWriters:bu,nAlias:e.alias.length,aliasUnits:[...new Set(e.alias.map(x=>x.split('@')[0]))],nReads:e.reads,readers:Object.keys(e.readers).length,
    nViaAlias:(e.viaAlias||[]).length,viaAliasWriters:[...new Set((e.viaAlias||[]).map(x=>x.split('@')[0]))],viaAlias:e.viaAlias||[],writes:e.writes,nested:e.nested,bulk:e.bulk,alias:e.alias};}
fs.writeFileSync(process.argv[3],JSON.stringify(out,null,0));
const fl=Object.entries(out.fields);
console.log(`g6: полей G ${fl.length} (в литерале ${initKeys.length}); прямых записей ${fl.reduce((s,[,v])=>s+v.nW,0)}, вложенных мутаций ${fl.reduce((s,[,v])=>s+v.nNested,0)}, групповых ${fl.reduce((s,[,v])=>s+v.nBulk,0)}, псевдонимов полей ${fl.reduce((s,[,v])=>s+v.nAlias,0)} (мутаций через них ${fl.reduce((s,[,v])=>s+v.nViaAlias,0)}), чтений ${fl.reduce((s,[,v])=>s+v.nReads,0)}; псевдонимов G ${gAlias.length}; вычисляемых ${dyn.length}; G как значение ${escapes.length}`);
