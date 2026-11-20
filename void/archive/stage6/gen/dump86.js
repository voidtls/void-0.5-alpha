// ARCH·86: слияние серий соседних слоёв-переустановок (список серий — m6 по той же сборке) в один слой на месте последнего.
// Для каждой серии L1…Lk (L1 — самый ранний, ближайший к прежней реализации):
//   {const _p86=f; f=function(<параметры Lk>){<параметры L1…Lk-1 как const из arguments> pre_k … pre_1 const r86=_p86.apply(this,arguments); post_1 … post_k return r86;};}
// Это ровно порядок исполнения исходной цепочки: внешний слой выполняет pre первым и post последним.
// Проверки (любой отказ — серия не сливается, причина пишется): слои подряд в цепочке f без других записей между ними;
// параметры — простые имена; arguments используется только в вызове прежней; нет return вне вложенных функций, кроме последнего
// «return r» (r — результат вызова, после вызова не читается); _p не используется кроме вызова; между первым и последним слоем
// на верхнем уровне нет ни одного чтения имени f, исполняемого при загрузке (захват промежуточной версии), и вызова, достигающего f (m6).
// Локальные имена каждого слоя (включая параметры) переименовываются в <имя>_86<i> по областям видимости eslint-scope —
// иначе объявления разных слоёв столкнулись бы или перехватили бы свободные имена соседнего слоя.
const fs=require('fs'),path=require('path');const NM=path.join(__dirname,'..','..','node_modules');
const acorn=require(path.join(NM,'acorn')),walk=require(path.join(NM,'acorn-walk')),escope=require(path.join(NM,'eslint-scope'));
const h=fs.readFileSync(process.argv[2],'utf8');const I0=h.indexOf('<script>\n"use strict";')+8,J0=h.indexOf('</script>',I0);const src=h.slice(I0,J0);
const M6=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));const W6=JSON.parse(fs.readFileSync(process.argv[4],'utf8'));
const ast=acorn.parse(src,{ecmaVersion:2022,ranges:true,locations:true});const sm=escope.analyze(ast,{ecmaVersion:2022});
const T=n=>src.slice(n.range[0],n.range[1]);const line=p=>src.slice(0,p).split('\n').length;
const res=[];const sites=[];let work=h;
// подсистема слоя — по идентификаторам в теле (правила те же, что в отчёте этапа 7; строки и комментарии не исключаются — правило строже)
const SUBS=[['dev',/\b(devLog|devAny|dvSeed\w*|dvx\w*|dvForced)\b/],['tut',/\b(tut\w*|TUT\w*|JH133|jh133\w*)\b/],['skin',/\b(SKFX|SK62|curSkin)\b/],
 ['chase',/\b(CHS|chase\w*)\b/],['post',/\bG\.post\b|\bpostAudio\b/],['vn',/\bvn[A-Z]\w*/],['setui',/\b(sfxVolInject|opInject|layout63)\b|\.tog\[/],
 ['mapdeny',/\b(mapDeny\w*|jumpDenyReason|mapBlk\w*)\b/],['pausecard',/\bpzRender63\b/],['world61',/\bl61Reset\b/]];
function uniqAnchor(text,a,b){// минимальный единственный в текущем тексте якорь вокруг [a,b) исходного src (текст ещё не тронут в этом месте)
  let L=0,R=0;for(let q=0;q<300;q++){const s=src.slice(a-L,b+R);if(work.split(s).length-1===1)return [a-L,b+R];if(q%2)L+=16;else R+=16;}throw new Error('нет единственного якоря');}
for(const run of M6.runs){const f=run.name,R={name:f,layers:run.layers,ok:false,why:''};res.push(R);
  try{
    const ch=W6.chains[f];const opsL=ch.ops.filter(o=>o.where!=='во время игры').map(o=>o.line);
    const i0=opsL.indexOf(run.layers[0]);if(i0<0)throw new Error('слой не найден в цепочке w6');
    for(let q=0;q<run.layers.length;q++)if(opsL[i0+q]!==run.layers[q])throw new Error('слои не подряд в цепочке: '+opsL.slice(i0,i0+run.layers.length));
    const blocks=run.layers.map(l=>{const b=ast.body.find(s=>s.type==='BlockStatement'&&s.loc.start.line<=l&&s.loc.end.line>=l);if(!b||b.body.length!==2)throw new Error('нет блока слоя '+l);
      const d=b.body[0],a=b.body[1];if(d.type!=='VariableDeclaration'||d.declarations.length!==1||d.declarations[0].init.name!==f)throw new Error('нет захвата '+l);
      if(a.type!=='ExpressionStatement'||a.expression.type!=='AssignmentExpression'||a.expression.left.name!==f||a.expression.right.type!=='FunctionExpression')throw new Error('не присваивание функции '+l);
      return {blk:b,p:d.declarations[0].id.name,fn:a.expression.right};});
    // чтения f при загрузке между первым и последним слоем
    const ia=ast.body.indexOf(blocks[0].blk),ib=ast.body.indexOf(blocks[blocks.length-1].blk);
    for(let q=ia+1;q<ib;q++){const s=ast.body[q];if(blocks.some(b=>b.blk===s))continue;let bad=null;
      (function v(n,runNow){if(!n||typeof n.type!=='string'||bad)return;
        if(/Function/.test(n.type)){if(!runNow)return;}
        if(n.type==='Identifier'&&n.name===f){bad=line(n.range[0]);return;}
        if(n.type==='CallExpression'&&/Function/.test(n.callee.type)){v(n.callee.body,true);n.arguments.forEach(x=>v(x,false));return;}
        for(const k of Object.keys(n)){if(k==='loc'||k==='range')continue;const x=n[k];if(Array.isArray(x))x.forEach(y=>y&&v(y,false));else if(x&&typeof x.type==='string')v(x,false);}})(s,false);
      if(bad)throw new Error('чтение '+f+' при загрузке между слоями (строка '+bad+')');}
    const parts=blocks.map((B,i)=>{const fn=B.fn,body=fn.body.body,tag='_86'+(i+1);
      if(fn.params.some(x=>x.type!=='Identifier'))throw new Error('сложные параметры');
      let ci=-1,kind=null,rName=null;
      body.forEach((st,k)=>{const t=T(st);if(t.indexOf(B.p+'.apply(this,arguments)')<0)return;
        if(st.type==='VariableDeclaration'&&st.declarations.length===1&&T(st.declarations[0].init)===B.p+'.apply(this,arguments)'){ci=k;kind='r';rName=st.declarations[0].id.name;}
        else if(st.type==='ReturnStatement'&&T(st.argument)===B.p+'.apply(this,arguments)'){ci=k;kind='ret';}
        else throw new Error('вызов прежней в неподдерживаемой форме');});
      if(ci<0)throw new Error('нет вызова прежней');
      let pre=body.slice(0,ci),post=body.slice(ci+1);
      if(kind==='r'){const last=post[post.length-1];if(!last||last.type!=='ReturnStatement'||!last.argument||last.argument.type!=='Identifier'||last.argument.name!==rName)throw new Error('нет завершающего return r');post=post.slice(0,-1);}
      if(kind==='ret'&&post.length)throw new Error('код после return');
      // запреты внутри pre/post
      let uP=0;walk.full(fn,n=>{if(n.type==='Identifier'&&n.name===B.p)uP++;});if(uP!==1)throw new Error('_p используется '+uP+' раз');
      for(const st of pre.concat(post))(function v(n,inFn){if(!n||typeof n.type!=='string')return;
        if(/Function/.test(n.type)&&n.type!=='ArrowFunctionExpression'){inFn=true;}
        if(n.type==='ArrowFunctionExpression')inFn=inFn||'arrow';
        if(n.type==='ReturnStatement'&&!inFn)throw new Error('return вне вложенной функции');
        if(n.type==='Identifier'&&n.name==='arguments'&&inFn!==true)throw new Error('arguments в теле слоя');
        if(n.type==='Identifier'&&rName&&n.name===rName&&!inFn&&post.includes(st))throw new Error('результат читается после вызова');
        if(n.type==='ThisExpression'&&inFn!==true){}/* this — тот же объект, допустимо */
        for(const k of Object.keys(n)){if(k==='loc'||k==='range')continue;const x=n[k];if(Array.isArray(x))x.forEach(y=>y&&v(y,inFn));else if(x&&typeof x.type==='string')v(x,inFn);}})(st,false);
      // переименование локальных имён (области функции слоя и всех вложенных областей, объявленные в самой функции слоя)
      const scope=sm.acquire(fn);const edits=[];const names=[];
      for(const vr of scope.variables){if(vr.name==='arguments')continue;names.push(vr.name);
        const nn=vr.name+tag;const ids=new Set([...vr.identifiers,...vr.references.map(r=>r.identifier)]);
        for(const id of ids)edits.push({a:id.range[0],b:id.range[1],t:nn,id});}
      // короткая запись свойств {x} / {x}=…
      walk.full(fn,n=>{if(n.type==='Property'&&n.shorthand){const e=edits.find(e=>e.id===n.value||(n.value.type==='AssignmentPattern'&&e.id===n.value.left));if(e)e.t=n.key.name+':'+e.t;}});
      const ren=(a,b)=>{let out='',p=a;for(const e of edits.filter(e=>e.a>=a&&e.b<=b).sort((x,y)=>x.a-y.a)){out+=src.slice(p,e.a)+e.t;p=e.b;}return out+src.slice(p,b);};
      const seg=arr=>arr.length?ren(arr[0].range[0],arr[arr.length-1].range[1]):'';
      return {i,tag,params:fn.params.map(x=>x.name),pre:seg(pre),post:seg(post),kind,names,line:B.blk.loc.start.line};});
    const k=parts.length,outer=parts[k-1];
    const head=parts.slice(0,-1).flatMap(P=>P.params.map((x,j)=>'const '+x+P.tag+'=arguments['+j+'];')).join('');
    const pres=parts.slice().reverse().map(P=>P.pre).filter(Boolean);const posts=parts.map(P=>P.post).filter(Boolean);
    const merged='{const _p86='+f+';'+f+'=function('+outer.params.map(x=>x+outer.tag).join(',')+'){'+head+pres.join('\n  ')+(pres.length?'\n  ':'')+'const r86=_p86.apply(this,arguments);'+(posts.length?'\n  '+posts.join('\n  '):'')+'return r86;};}';
    try{acorn.parse(merged,{ecmaVersion:2022});}catch(e){throw new Error('объединённый слой не разбирается: '+e.message);}
    // 1.5.26 (пересмотр после самокритики): сливаются только серии, все слои которых принадлежат ОДНОЙ подсистеме.
    // Слияние слоёв разных подсистем (обучение + облики, погоня + журнал разработчика + пост …) собирает чужие крючки в одном месте:
    // на этапе 8 их пришлось бы разделять обратно, а archcheck видит запись чужого поля G в чужой зоне (G.post в зоне v65).
    {const tagsOf=t=>SUBS.filter(([,r])=>r.test(t)).map(([n])=>n);
     const per=blocks.map(B=>tagsOf(src.slice(B.fn.body.range[0],B.fn.body.range[1])));const uni=[...new Set(per.flat())];
     R.subs=per;if(uni.length!==1||per.some(x=>x.length!==1))throw new Error('слои разных подсистем: '+per.map(x=>x.join('+')||'?').join(' | '));}
    // места: ранние слои → метка, последний → объединённый слой
    blocks.forEach((B,i)=>{const [a,b]=uniqAnchor(work,B.blk.range[0],B.blk.range[1]);const anc=src.slice(a,b);
      const pre_=src.slice(a,B.blk.range[0]),post_=src.slice(B.blk.range[1],b);
      const neu=i<k-1?'/* ARCH·86 · слой '+f+' '+(i+1)+' из '+k+' (строка '+B.blk.loc.start.line+' в 1.5.25) перенесён в объединённый слой ниже */'
        :'/* ARCH·86 · объединённый слой '+f+': '+k+' слоя (строки 1.5.25: '+run.layers.join(', ')+') в исходном порядке исполнения */\n'+merged;
      sites.push([anc,pre_+neu+post_]);work=work.replace(anc,pre_+neu+post_);});
    R.ok=true;R.merged=merged;R.parts=parts.map(P=>({line:P.line,kind:P.kind,params:P.params,names:P.names}));
  }catch(e){R.why=e.message;}
  console.log(R.ok?'ОК ':'НЕТ',f,run.layers.join(','),R.why||'');}
fs.writeFileSync(process.argv[5],JSON.stringify({series:res,sites},null,1));
console.log('серий слито',res.filter(r=>r.ok).length,'из',res.length,'· слоёв убрано',res.filter(r=>r.ok).reduce((s,r)=>s+r.layers.length-1,0));
