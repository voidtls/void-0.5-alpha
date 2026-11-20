// Этап 6 · own6 — проверка границ владения полями G по манифесту tools6/ownership6.json (только чтение сборки).
//   node tools6/own6.js <сборка.html> [--manifest tools6/ownership6.json] [--json out.json]
// Для каждой группы: все записи полей (прямые =, op=, ++/--, delete, деструктуризация, for-left и групповые Object.assign(G,{…}))
// разрешены только в функциях-владельцах группы и в зарегистрированных исключениях (функция + вид записи + поле).
// Дополнительно: тексты функций-владельцев равны записанным в манифесте (логика API не меняется молча); каждая объявлена один раз
// и не получает новых переустановок сверх записанных в манифесте (ownerWrapped); запись поля из обёртки видна как «имя~wN» и
// считается записью не владельца; псевдонимов G — 0; вычисляемые ключи и «G как значение» —
// только зарегистрированные. Выход: 0 — нарушений нет; 1 — нарушения; 3 — ошибка инструмента.
const path=require('path'),fs=require('fs'),cp=require('child_process'),os=require('os');
process.on('uncaughtException',e=>{console.error('own6: внутренняя ошибка: '+(e&&e.stack||e));process.exit(3);});
const NM=path.join(__dirname,'..','node_modules');const acorn=require(path.join(NM,'acorn'));
const argv=process.argv.slice(2);const opt=k=>{const i=argv.indexOf(k);return i<0?null:argv[i+1];};
const B=argv[0];const M=JSON.parse(fs.readFileSync(opt('--manifest')||path.join(__dirname,'ownership6.json'),'utf8'));
const tmp=path.join(os.tmpdir(),'own6_'+process.pid+'.json');
const r=cp.spawnSync('node',[path.join(__dirname,'g6.js'),B,tmp],{encoding:'utf8'});if(r.status!==0)throw new Error('g6: '+r.stderr);
const g=JSON.parse(fs.readFileSync(tmp,'utf8'));fs.unlinkSync(tmp);
const tw=path.join(os.tmpdir(),'own6w_'+process.pid+'.json');const r2=cp.spawnSync('node',[path.join(__dirname,'w6.js'),B,tw],{encoding:'utf8'});if(r2.status!==0)throw new Error('w6: '+r2.stderr);
const w=JSON.parse(fs.readFileSync(tw,'utf8'));fs.unlinkSync(tw);
const html=fs.readFileSync(B,'utf8');const k=html.indexOf('<script>\n"use strict";');const src=html.slice(k+8,html.indexOf('</script>',k));
const ast=acorn.parse(src,{ecmaVersion:2022,ranges:true});const decls={};for(const s of ast.body)if(s.type==='FunctionDeclaration')(decls[s.id.name]=decls[s.id.name]||[]).push(src.slice(s.range[0],s.range[1]));
const bad=[];const rep={groups:{}};
for(const G of M.groups){const own=new Set(G.owners);const ex=G.exceptions||[];const R={writes:{},violations:[]};rep.groups[G.id]=R;
  for(const f of G.fields){const v=g.fields[f];if(!v){if(!G.optional||!G.optional.includes(f))R.violations.push(f+': поле не найдено');continue;}
    const all=[...v.writes.map(x=>['w',x]),...v.bulk.map(x=>['bulk',x])];
    for(const [kind,x] of all){const u=x.split('@')[0];(R.writes[f]=R.writes[f]||{})[u]=((R.writes[f]||{})[u]||0)+1;
      if(own.has(u))continue;
      if(ex.some(e=>e.unit===u&&(e.kind===kind||e.kind==='*')&&(!e.fields||e.fields.includes(f))))continue;
      R.violations.push(`${f}: запись (${kind}) в ${x} — не владелец и не зарегистрированное исключение`);}}
  for(const e of ex){const f0=(e.fields||G.fields);if(!f0.some(f=>g.fields[f]&&[...g.fields[f].writes,...g.fields[f].bulk].some(x=>x.startsWith(e.unit+'@'))))R.violations.push('исключение '+e.unit+' больше не пишет поля группы — удалите его из манифеста');}
  for(const o of G.owners){const d=decls[o]||[];if(d.length!==1)R.violations.push(o+': объявлений '+d.length);
    else if(G.bodies&&G.bodies[o]!==undefined&&G.bodies[o]!==d[0])R.violations.push(o+': текст функции-владельца отличается от манифеста');
    if(w.chains[o]){(R.ownerWrapped=R.ownerWrapped||{})[o]=w.chains[o].bootOps+'/'+w.chains[o].runOps;
      if(!(G.ownerWrapped||[]).includes(o))R.violations.push(o+': у функции-владельца появились переустановки (не записаны в манифесте ownerWrapped)');}}
  if(R.violations.length)bad.push(...R.violations.map(x=>G.id+': '+x));}
if(g.gAlias.length)bad.push('псевдонимы G: '+g.gAlias.join('; '));
const okDyn=new Set(M.dyn||[]),okEsc=new Set(M.escapes||[]);
for(const d of g.dyn){const u=d.replace(/@\d+/,'');if(!okDyn.has(u))bad.push('незарегистрированная вычисляемая запись/чтение G: '+d);}
for(const d of g.escapes){const u=d.replace(/@\d+/,'');if(!okEsc.has(u))bad.push('G используется как значение: '+d);}
rep.bad=bad;
for(const [id,R] of Object.entries(rep.groups))console.log('группа',id,'· полей',Object.keys(R.writes).length,'· пишущих функций',new Set(Object.values(R.writes).flatMap(o=>Object.keys(o))).size,'· нарушений',R.violations.length);
console.log(bad.length?'own6: НАРУШЕНИЯ':'own6: нарушений нет');bad.slice(0,40).forEach(x=>console.log('  -',x));
if(opt('--json'))fs.writeFileSync(opt('--json'),JSON.stringify(rep,null,1));
process.exit(bad.length?1:0);
