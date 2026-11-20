// рабочий скрипт P8.5: разделы скрипта (по строкам-заголовкам), их размер, объявленные имена
const fs=require('fs'),path=require('path');const NM='/home/claude/VOID_stage8/void/tools8/node_modules';const acorn=require(path.join(NM,'acorn'));
const S=fs.readFileSync(process.argv[2],'utf8');const L=S.split('\n');const ast=acorn.parse(S,{ecmaVersion:2022,locations:true});
const hdr=[];L.forEach((l,i)=>{if(/^(\/\/ =====|\/\* =====|\/\/ -----|\/\* ---------- |\/\* ▼▼▼)/.test(l))hdr.push(i+1);});
const A=[1,716,1339,2628,4229,5072,5755,5908,6884,7598,8980,11361,12503,12548,15689,16204,16210,16520];
const cuts=[...new Set([...hdr,...A])].sort((a,b)=>a-b);const out=[];
for(let i=0;i<cuts.length;i++){const a=cuts[i],b=(cuts[i+1]||L.length+1)-1;
 const names=ast.body.filter(n=>n.loc.start.line>=a&&n.loc.start.line<=b).map(n=>n.type==='FunctionDeclaration'?n.id.name:n.type==='VariableDeclaration'?(n.declarations[0].id.name||'{}'):n.type==='ExpressionStatement'&&n.expression.type==='AssignmentExpression'&&n.expression.left.type==='Identifier'?n.expression.left.name+'=':n.type==='BlockStatement'?((S.slice(n.start,n.start+200).match(/const\s+_?\w+\s*=\s*([A-Za-z_$][\w$]*)\s*;/)||[])[1]||'{}')+'⊕':null).filter(Boolean);
 out.push({a,b,n:b-a+1,h:L[a-1].slice(0,150),names});}
fs.writeFileSync(process.argv[3],JSON.stringify(out));console.log(out.length);
