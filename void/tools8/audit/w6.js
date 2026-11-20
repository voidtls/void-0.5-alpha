// Этап 7 · аудит · w6 — перепись переустановок глобальных функций и повторных объявлений по AST (только чтение).
//   node tools6/w6.js <сборка.html> <out.json>
// Для каждой записи в глобальное имя функции: место (строка, блок ARCH·N или «база»), область (верхний уровень / блок / IIFE /
// функция загрузки / во время игры), форма (фабрика f(name) | функция-выражение | другое имя | прочее), захват прежней реализации
// (прямо name внутри правой части или через локальную const _x=name), признаки нового слоя: вызывает прежнюю, arguments, this,
// try/catch/finally, чтения/записи G, ГСЧ (Math.random, vR*/vrnd*, SFXR63, VFXR65, rnd), время (performance.now, Date.now,
// setTimeout/setInterval/rAF), toString, return прежнего результата. По имени строится цепочка и «мёртвые» слои
// (слой, который полностью перекрыт поздней переустановкой без захвата и ни разу не захвачен).
const path=require('path'),fs=require('fs'),crypto=require('crypto');
process.on('uncaughtException',e=>{console.error('w6: внутренняя ошибка: '+(e&&e.stack||e));process.exit(3);});
const NM=path.join(__dirname,'..','node_modules');
const acorn=require(path.join(NM,'acorn')),walk=require(path.join(NM,'acorn-walk')),escope=require(path.join(NM,'eslint-scope'));
const sha=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const html=fs.readFileSync(process.argv[2],'utf8');const k=html.indexOf('<script>\n"use strict";');const src=html.slice(k+8,html.indexOf('</script>',k));
const ast=acorn.parse(src,{ecmaVersion:2022,sourceType:'script',ranges:true,locations:true});
const sm=escope.analyze(ast,{ecmaVersion:2022});const gs=sm.globalScope;
const refOf=new Map();for(const sc of sm.scopes)for(const r of sc.references)refOf.set(r.identifier,r);
const line=n=>n.loc.start.line;const txt=n=>src.slice(n.range[0],n.range[1]);
// блоки ARCH по маркерам
const blocks=[];{const re=/\/\* ▼▼▼ ARCH·(\d+)[^\n]*/g;let m;while((m=re.exec(src))){const end=src.indexOf('▲▲▲ ARCH·'+m[1]+' · КОНЕЦ',m.index);blocks.push({n:+m[1],a:m.index,b:end<0?src.length:end,head:m[0].slice(0,90)});}}
const blockAt=pos=>{let best=null;for(const b of blocks)if(pos>=b.a&&pos<=b.b&&(!best||b.a>best.a))best=b;return best?'ARCH·'+best.n:'база';};
// ближайший заголовок версии вида «===== 1.2.3 α» или «/* 0.6.0:»
const verAt=pos=>{const s=src.slice(Math.max(0,pos-60000),pos);const m=[...s.matchAll(/(?:=====|\/\/|\/\*)\s*(\d+\.\d+(?:\.\d+)?)\s*(?:α|:|·)/g)];return m.length?m[m.length-1][1]:null;};
const fnVars=gs.variables.filter(v=>v.defs.some(d=>d.type==='FunctionName'));const fnSet=new Set(fnVars);
const decls={};for(const s of ast.body)if(s.type==='FunctionDeclaration')(decls[s.id.name]=decls[s.id.name]||[]).push(s);
const iife=new Set();for(const s of ast.body){let e=s.type==='ExpressionStatement'?s.expression:null;if(e&&e.type==='UnaryExpression')e=e.argument;if(e&&e.type==='CallExpression'&&/Function/.test(e.callee.type))iife.add(e.callee);}
// функции, вызываемые при загрузке: вызовы на верхнем уровне (и в IIFE верхнего уровня) по имени
const bootCalls=new Set();for(const s of ast.body){walk.simple(s,{CallExpression(c){if(c.callee.type==='Identifier')bootCalls.add(c.callee.name);}},{...walk.base,FunctionExpression(n,st,cb){if(iife.has(n))walk.base.FunctionExpression(n,st,cb);},ArrowFunctionExpression(n,st,cb){if(iife.has(n))walk.base.ArrowFunctionExpression(n,st,cb);},FunctionDeclaration(){} });}
const RNG=/^(vR\d|vrnd\d|SFXR63|VFXR65|rnd|rand|rng|R65|gR|srnd)$/;
function features(node,prevNames){const f={callsPrev:0,args:0,this:0,try:0,finally:0,gR:0,gW:0,rng:0,time:0,toString:0,retPrev:0,catchSwallow:0};
  walk.full(node,n=>{
    if(n.type==='Identifier'&&n.name==='arguments')f.args++;
    if(n.type==='ThisExpression')f.this++;
    if(n.type==='TryStatement'){f.try++;if(n.finalizer)f.finally++;if(n.handler&&n.handler.body.body.length===0)f.catchSwallow++;}
    if(n.type==='MemberExpression'&&n.object.type==='Identifier'&&n.object.name==='G')f.gR++;
    if(n.type==='AssignmentExpression'&&n.left.type==='MemberExpression'){let r=n.left;while(r.object&&r.object.type==='MemberExpression')r=r.object;if(r.object&&r.object.name==='G')f.gW++;}
    if(n.type==='CallExpression'){const c=n.callee;
      if(c.type==='MemberExpression'&&c.object.name==='Math'&&c.property.name==='random')f.rng++;
      if(c.type==='Identifier'&&RNG.test(c.name))f.rng++;
      if(c.type==='MemberExpression'&&((c.object.name==='performance'&&c.property.name==='now')||(c.object.name==='Date'&&c.property.name==='now')))f.time++;
      if(c.type==='Identifier'&&/^(setTimeout|setInterval|requestAnimationFrame)$/.test(c.name))f.time++;
      const callee=c.type==='MemberExpression'&&/^(apply|call)$/.test(c.property.name)?c.object:c;
      if(callee.type==='Identifier'&&prevNames.has(callee.name))f.callsPrev++;}
    if(n.type==='MemberExpression'&&!n.computed&&n.property.name==='toString')f.toString++;
    if(n.type==='ReturnStatement'&&n.argument){let a=n.argument;if(a.type==='CallExpression'){const c=a.callee.type==='MemberExpression'&&/^(apply|call)$/.test(a.callee.property.name)?a.callee.object:a.callee;if(c.type==='Identifier'&&prevNames.has(c.name))f.retPrev++;}}
  });return f;}
const ops=[];
for(const v of fnVars){for(const r of v.references){if(!r.isWrite())continue;const id=r.identifier;
  // область записи
  let sc=r.from,where='верхний уровень';const chain=[];while(sc&&sc.type!=='global'){chain.push(sc);sc=sc.upper;}
  let fnSc=chain.find(s=>s.type==='function');
  if(fnSc){if(iife.has(fnSc.block))where='IIFE верхнего уровня';else{const b=fnSc.block;const nm=b.id?b.id.name:(b.type==='FunctionDeclaration'?b.id.name:null);
      // имя внешней функции верхнего уровня
      let outer=fnSc;while(outer.upper&&outer.upper.type!=='global'){outer=outer.upper;}const on=outer.block.id?outer.block.id.name:'(анонимная)';
      where=(bootCalls.has(on)?'функция загрузки ':'во время игры ')+on;}}
  else if(chain.find(s=>s.type==='block'))where='блок верхнего уровня';
  // узел присваивания
  let asg=null;walk.fullAncestor(ast,(n,st)=>{if(n===id){const p=st[st.length-2];if(p.type==='AssignmentExpression'&&p.left===id)asg=p;}});
  if(!asg){ops.push({name:v.name,line:line(id),where,form:'не присваивание',block:blockAt(id.range[0])});continue;}
  const rhs=asg.right;
  // имена, которые означают прежнюю реализацию: само имя (если вычисляется до присваивания) и локальные const x=name в той же области
  const prevNames=new Set();
  const scope=sm.acquire(fnSc?fnSc.block:ast)||gs;
  for(const sc2 of [r.from,...chain])for(const vv of sc2.variables){const d=vv.defs[0];if(d&&d.type==='Variable'&&d.node.init&&d.node.init.type==='Identifier'&&d.node.init.name===v.name)prevNames.add(vv.name);}
  let form='прочее',factory=null,captures=false,fnode=null;
  const selfRef=[];walk.full(rhs,n=>{if(n.type==='Identifier'&&n.name===v.name){const rr=refOf.get(n);if(rr&&rr.resolved===v)selfRef.push(n);}});
  if(rhs.type==='CallExpression'){form='фабрика';factory=rhs.callee.type==='Identifier'?rhs.callee.name:txt(rhs.callee).slice(0,40);
    captures=rhs.arguments.some(a=>a.type==='Identifier'&&(a.name===v.name||prevNames.has(a.name)))||selfRef.length>0;
    // IIFE-фабрика (o=>function(){…o…})(name)
    if(/Function/.test(rhs.callee.type)){const ps=rhs.callee.params.map(p=>p.name);rhs.arguments.forEach((a,i)=>{if(a.type==='Identifier'&&(a.name===v.name||prevNames.has(a.name))&&ps[i])prevNames.add(ps[i]);});fnode=rhs.callee;factory='(IIFE)';}}
  else if(/Function/.test(rhs.type)){form='функция';fnode=rhs;captures=[...prevNames].some(pn=>{let u=false;walk.full(rhs,n=>{if(n.type==='Identifier'&&n.name===pn)u=true;});return u;})||selfRef.length>0;}
  else if(rhs.type==='Identifier'){form='другое имя';factory=rhs.name;}
  if(selfRef.length)prevNames.add(v.name);
  const feat=fnode?features(fnode,prevNames):null;
  ops.push({name:v.name,line:line(id),pos:id.range[0],where,form,factory,captures,prevVia:[...prevNames],block:blockAt(id.range[0]),ver:verAt(id.range[0]),sha:sha(txt(asg)),len:txt(asg).length,feat});}}
ops.sort((a,b)=>a.line-b.line);
// цепочки по именам (только загрузочные: верхний уровень, блок, IIFE, функция загрузки)
const names={};for(const o of ops){(names[o.name]=names[o.name]||{decl:[],ops:[]}).ops.push(o);}
for(const [n,a] of Object.entries(decls)){(names[n]=names[n]||{decl:[],ops:[]}).decl=a.map(d=>({line:line(d),block:blockAt(d.range[0]),ver:verAt(d.range[0]),sha:sha(txt(d)),len:txt(d).length}));}
const chains={};
for(const [n,e] of Object.entries(names)){if(!e.ops.length&&e.decl.length<2)continue;
  const boot=e.ops.filter(o=>!/^во время игры/.test(o.where));const run=e.ops.filter(o=>/^во время игры/.test(o.where));
  // живость: идём от последнего загрузочного слоя назад, пока слой захватывает прежний
  // порядок исполнения загрузки: функции загрузки (arch69Boot/arch70Boot/arch71Boot…) исполняются в месте своего вызова — берём строку вызова
  let depth=0,live=[],dead=[];const L=boot.slice();
  for(let i=L.length-1;i>=0;i--){live.unshift(L[i]);depth++;if(!L[i].captures){dead=L.slice(0,i);break;}}
  const declLive=e.decl.length&&(L.length===0||L.every(o=>o.captures));
  chains[n]={decls:e.decl.length,declWinner:e.decl.length?e.decl[e.decl.length-1]:null,deadDecls:Math.max(0,e.decl.length-1),bootOps:boot.length,runOps:run.length,depth:depth+(declLive?1:0),
    deadLayers:dead.map(o=>o.line),declLive,ops:e.ops.map(o=>({line:o.line,where:o.where,form:o.form,factory:o.factory,captures:o.captures,block:o.block,ver:o.ver,feat:o.feat}))};}
const out={blocks:blocks.map(b=>({n:b.n,line:src.slice(0,b.a).split('\n').length,head:b.head})),ops,chains};
fs.writeFileSync(process.argv[3],JSON.stringify(out,null,0));
const C=Object.values(chains);
console.log(`w6: записей в имена функций ${ops.length} (загрузочных ${ops.filter(o=>!/^во время игры/.test(o.where)).length}, во время игры ${ops.filter(o=>/^во время игры/.test(o.where)).length}); имён с переустановками ${C.filter(c=>c.bootOps).length}; повторных имён ${C.filter(c=>c.decls>1).length}, мёртвых объявлений ${C.reduce((s,c)=>s+c.deadDecls,0)}; мёртвых слоёв ${C.reduce((s,c)=>s+c.deadLayers.length,0)}; макс. глубина ${Math.max(...C.map(c=>c.depth))}`);
// ---- дополнение: форма слоя (прозрачность) для каждой загрузочной переустановки-функции ----
if(process.argv[4]==='--shape'){
  const res=[];
  for(const o of ops){if(o.form!=='функция'&&!(o.form==='фабрика'&&o.factory==='(IIFE)'))continue;
    // найдём узел функции слоя заново по позиции
    let asg=null;walk.fullAncestor(ast,(n,st)=>{if(n.type==='AssignmentExpression'&&n.left.type==='Identifier'&&n.left.range[0]===o.pos)asg=n;});
    if(!asg)continue;let fnode=asg.right;let prev=new Set(o.prevVia);
    if(fnode.type==='CallExpression'){const c=fnode.callee;fnode=c.body&&c.body.type==='BlockStatement'?(c.body.body.find(s=>s.type==='ReturnStatement')||{}).argument:c.body;if(!fnode)continue;}
    if(!fnode||!/Function/.test(fnode.type))continue;
    const body=fnode.body.type==='BlockStatement'?fnode.body.body:[{type:'ReturnStatement',argument:fnode.body}];
    const isPrevCall=n=>{if(!n||n.type!=='CallExpression')return false;const c=n.callee.type==='MemberExpression'&&/^(apply|call)$/.test(n.callee.property.name)?n.callee.object:n.callee;return c.type==='Identifier'&&prev.has(c.name);};
    let topCall=0,nestedCall=0,cond=false;
    walk.fullAncestor(fnode,(n,st)=>{if(isPrevCall(n)){const inIf=st.some(a=>a!==fnode&&(a.type==='IfStatement'||a.type==='ConditionalExpression'||a.type==='LogicalExpression'||/Function/.test(a.type)&&a!==fnode));if(inIf)nestedCall++;else topCall++;}});
    const only=body.length===1&&((body[0].type==='ReturnStatement'&&isPrevCall(body[0].argument))||(body[0].type==='ExpressionStatement'&&isPrevCall(body[0].expression)));
    // ранний выход до вызова прежней реализации: if(...) return …; затем вызов
    const early=body.some((s,i)=>s.type==='IfStatement'&&JSON.stringify(src.slice(s.range[0],s.range[1])).includes('return')&&body.slice(i+1).some(t=>src.slice(t.range[0],t.range[1]).match(new RegExp('\\b('+[...prev].join('|')+')\\b'))));
    const shape=only?'сквозной':topCall&&!nestedCall?(early?'условная замена + вызов':'безусловный хук'):nestedCall&&!topCall?'условный вызов прежней':topCall&&nestedCall?'смешанный':'не вызывает прежнюю';
    res.push({name:o.name,line:o.line,shape,stmts:body.length,len:o.len,feat:o.feat,ver:o.ver});}
  fs.writeFileSync(process.argv[3].replace('.json','_shape.json'),JSON.stringify(res));
  const c={};for(const r of res)c[r.shape]=(c[r.shape]||0)+1;console.log('формы слоёв:',JSON.stringify(c));}
