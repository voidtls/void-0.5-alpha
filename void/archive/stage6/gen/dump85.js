// ARCH·85: недостижимые объявления функций верхнего уровня (из AST сборки-источника).
// Для каждого имени с несколькими объявлениями FunctionDeclaration в теле скрипта оставляется последнее (оно и связано с именем
// после подъёма объявлений); остальные — недостижимы: к ним не ведёт ни одна ссылка, их текст не исполняется.
// Проверки: объявления только на верхнем уровне скрипта (не в блоках); победитель не лежит в вырезаемых тестами блоках
// CINE·PROTO / BG·PROTO (иначе при вырезании блока проигравший стал бы живым); якорь — текст объявления, единственный в файле.
const fs=require('fs'),path=require('path');const NM=path.join(__dirname,'..','..','node_modules');const acorn=require(path.join(NM,'acorn'));
const h=fs.readFileSync(process.argv[2],'utf8');const i=h.indexOf('<script>\n"use strict";')+8,j=h.indexOf('</script>',i);const src=h.slice(i,j);
const ast=acorn.parse(src,{ecmaVersion:2022,ranges:true});
const cut=[];for(const [a,b] of [['CINE·PROTO','CINE·PROTO'],['BG·PROTO','BG·PROTO']]){const x=src.indexOf('▼▼▼ '+a);const y=src.indexOf('▲▲▲ '+b,x);if(x<0||y<0)throw new Error('нет блока '+a);cut.push([x,y]);}
const inCut=p=>cut.some(([a,b])=>p>=a&&p<=b);
const by={};for(const s of ast.body)if(s.type==='FunctionDeclaration')(by[s.id.name]=by[s.id.name]||[]).push(s);
const out=[];
for(const [n,a] of Object.entries(by)){if(a.length<2)continue;const win=a[a.length-1];
  if(inCut(win.range[0]))throw new Error(n+': итоговое объявление внутри вырезаемого блока — проигравшие не мертвы при вырезании');
  a.slice(0,-1).forEach((d,k)=>{const t=src.slice(d.range[0],d.range[1]);
    if(inCut(d.range[0]))throw new Error(n+': проигравшее объявление внутри вырезаемого блока');
    let L=0,R=0,anc=t;for(let q=0;q<200&&h.split(anc).length-1!==1;q++){if(q%2)L+=16;else R+=16;anc=src.slice(d.range[0]-L,d.range[1]+R);}
    if(h.split(anc).length-1!==1)throw new Error(n+': нет единственного якоря');
    out.push({name:n,k:k+1,of:a.length,line:src.slice(0,d.range[0]).split('\n').length,winLine:src.slice(0,win.range[0]).split('\n').length,len:t.length,
      same:t===src.slice(win.range[0],win.range[1]),L,R,pre:src.slice(d.range[0]-L,d.range[0]),post:src.slice(d.range[1],d.range[1]+R),text:t});});}
// блоки и вложенные объявления с теми же именами — для справки
let nested=0;(function w(n,top){if(!n||typeof n!=='object')return;if(Array.isArray(n)){n.forEach(x=>w(x,top));return;}
  if(n.type==='FunctionDeclaration'&&!top&&by[n.id.name]&&by[n.id.name].length>1)nested++;for(const k in n)if(k!=='range')w(n[k],false);})(ast.body.map(s=>s.type==='FunctionDeclaration'?s.body:s),false);
fs.writeFileSync(process.argv[3],JSON.stringify({nested,items:out},null,1));
for(const o of out)console.log(o.name,o.k+'/'+o.of,'строка',o.line,'→ итог',o.winLine,'длина',o.len,o.same?'(текст равен итоговому)':'','контекст',o.L,o.R);
console.log('всего',out.length,'имён',new Set(out.map(o=>o.name)).size,'вложенных одноимённых',nested);
