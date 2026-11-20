// ARCH·88: все прямые записи G.state по AST сборки-источника и контекст каждой: используется ли значение присваивания.
//   node dump88.js <сборка.html> <out.json>
const fs=require('fs'),path=require('path');const NM=path.join(__dirname,'..','..','node_modules');
const acorn=require(path.join(NM,'acorn')),walk=require(path.join(NM,'acorn-walk'));
const h=fs.readFileSync(process.argv[2],'utf8');const I0=h.indexOf('<script>\n"use strict";')+8,J0=h.indexOf('</script>',I0);const src=h.slice(I0,J0);
const ast=acorn.parse(src,{ecmaVersion:2022,ranges:true,locations:true});const T=n=>src.slice(n.range[0],n.range[1]);
const isGS=m=>m&&m.type==='MemberExpression'&&!m.computed&&m.object.type==='Identifier'&&m.object.name==='G'&&m.property.name===(process.env.FIELD||'state');
const unit=st=>{for(const n of st){if(n.type==='FunctionDeclaration')return n.id.name;}return '(top)';};
const out=[];
walk.fullAncestor(ast,(n,st)=>{if(n.type==='AssignmentExpression'&&isGS(n.left)||n.type==='UpdateExpression'&&isGS(n.argument)||(n.type==='UnaryExpression'&&n.operator==='delete'&&isGS(n.argument))){
  const p=st[st.length-2];let ctx=p.type,used=true;
  if(p.type==='ExpressionStatement')used=false;
  else if(p.type==='SequenceExpression'&&p.expressions[p.expressions.length-1]!==n){const pp=st[st.length-3];used=false;ctx='Sequence(не последний)';}
  else if(p.type==='SequenceExpression'){const pp=st[st.length-3];used=pp.type!=='ExpressionStatement';ctx='Sequence(последний) в '+pp.type;}
  // внутри ForStatement update/init
  if((p.type==='ForStatement')&&(p.init===n||p.update===n)){used=false;ctx='for';}
  const fnStack=st.filter(x=>/Function/.test(x.type));const inner=fnStack.length>1?fnStack[fnStack.length-1].type:null;
  out.push({line:n.loc.start.line,unit:unit(st),op:n.operator||n.type,rhs:n.right?T(n.right):null,ctx,used,parent:T(p).slice(0,160),inner,text:T(n),a:n.range[0],b:n.range[1]});}});
fs.writeFileSync(process.argv[3],JSON.stringify(out,null,1));
for(const o of out)console.log(o.line,o.unit,o.op,o.rhs,'|',o.ctx,o.used?'ЗНАЧЕНИЕ ИСПОЛЬЗУЕТСЯ':'',o.inner?'(во вложенной '+o.inner+')':'','|',o.parent.slice(0,110));
console.log('всего',out.length,'со значением',out.filter(o=>o.used).length);
