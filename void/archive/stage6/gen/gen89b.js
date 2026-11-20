// ARCH·89b: граница «прокачка забега» — поля G.xp, G.lvl, G.need, G.lvlQ, G.bpQ, G.briefQ, G.briefN пишут только функции блока.
// Каждое место ищется внутри итогового объявления указанной функции (AST), текст должен встречаться в нём ровно один раз.
const fs=require('fs'),path=require('path');const NM=path.join(__dirname,'..','..','node_modules');const acorn=require(path.join(NM,'acorn'));const build=require('./sites6.js');
const h=fs.readFileSync(process.argv[2],'utf8');const I0=h.indexOf('<script>\n"use strict";')+8,J0=h.indexOf('</script>',I0);const src=h.slice(I0,J0);
const ast=acorn.parse(src,{ecmaVersion:2022,ranges:true});
const decl=n=>{const a=ast.body.filter(s=>s.type==='FunctionDeclaration'&&s.id.name===n);if(a.length!==1)throw new Error(n+': объявлений '+a.length);return a[0];};
const S=[
 ['updatePickups',"G.xp+=xpMul();","runXp6(xpMul());"],
 ['update',"while(G.xp>=G.need&&G.player.hp>0){G.xp-=G.need;G.lvl++;G.need=need(G.lvl);G.lvlQ++;}","runLvlUp6(G.player);"],
 ['worldUpdate',"while(G.xp>=G.need&&p.hp>0){G.xp-=G.need;G.lvl++;G.need=need(G.lvl);G.lvlQ++;}","runLvlUp6(p);"],
 ['zbSegDone',"G.lvlQ++;G.xp=0;G.lvl++;G.need=need(G.lvl);","runLvlSeg6();"],
 ['startMission',"Object.assign(G,{lvl:1+K,xp:0,lvlQ:K,briefQ:K,briefN:K});G.need=need(G.lvl);","runBrief6(K);"],
 ['zbTick',"Object.assign(G,{lvl:1+K,xp:0,lvlQ:K,briefQ:K,briefN:K});G.need=need(G.lvl);","runBrief6(K);"],
 ['startEndless',"Object.assign(G,{xp:0,lvl:1,lvlQ:0,bpQ:0,score:0,kills:0,taken:0,inRun:true,m:10});G.need=need(1);","runStart6(1);Object.assign(G,{score:0,kills:0,taken:0,inRun:true,m:10});"],
 ['devStart',"Object.assign(G,{xp:0,lvl:lv,lvlQ:0,bpQ:0,score:0,kills:0,taken:0,inRun:true});G.need=need(lv);","runStart6(lv);Object.assign(G,{score:0,kills:0,taken:0,inRun:true});"],
 ['openIntro',"Object.assign(G,{xp:0,lvl:1,need:need(1),lvlQ:0,bpQ:0,briefQ:0});","runZero6(true);"],
 ['returnToWorld',"Object.assign(G,{lvl:1,xp:0,need:need(1),lvlQ:0,bpQ:0,briefQ:0,combo:null});","runZero6(true);G.combo=null;"],
 ['zbResetMods',"Object.assign(G,{lvl:1,xp:0,need:need(1),lvlQ:0,briefQ:0});","runZero6(false);"],
 ['restoreRun',"Object.assign(G,{xp:s.xp,lvl:s.lvl,need:s.need,score:s.score,kills:s.kills,taken:s.taken,lvlQ:0,bpQ:0});","runRestore6(s);Object.assign(G,{score:s.score,kills:s.kills,taken:s.taken});"],
 ['startWorld',"Object.assign(G,{xp:S.run.xp,lvl:S.run.lvl,need:S.run.need,score:S.run.score,kills:S.run.kills,taken:S.run.taken,lvlQ:0,bpQ:0,inRun:true});","runRestore6(S.run);Object.assign(G,{score:S.run.score,kills:S.run.kills,taken:S.run.taken,inRun:true});"],
 ['choose',"G.bpQ=Math.max(0,G.bpQ-1);","runTake6('bp');"],
 ['choose',"G.lvlQ=Math.max(0,G.lvlQ-1);if(G.briefQ>0)G.briefQ--;","runTake6('lvl');"],
 ['kill',"if(e.type==='crate'){G.lvlQ++;","if(e.type==='crate'){runGrant6('lvl');"],
 ['devAct',"if(a==='lvl')G.lvlQ++;","if(a==='lvl')runGrant6('lvl');"],
 ['updateBeacon',"G.bpQ++;","runGrant6('bp');"],
 ['dvLeave',"G.lvlQ=0;G.briefQ=0;","runQClear6();"]];
const items=S.map(([fn,o,n])=>{const d=decl(fn);const t=src.slice(d.range[0],d.range[1]);const k=t.indexOf(o);if(k<0||t.indexOf(o,k+1)>=0)throw new Error(fn+': место «'+o.slice(0,50)+'» найдено не один раз');
  return {a:d.range[0]+k,b:d.range[0]+k+o.length,t:n,fn};});
const PRE=require('child_process').execFileSync('python3',['-c',"import re,sys;t=open(sys.argv[1],encoding='utf8').read();i=t.index('PRE=(');j=t.index('out=(');exec(t[i:j]);print(PRE,end='')",path.join(__dirname,'gen89b.py')],{encoding:'utf8'});
const {sites}=build(h,src,I0,items,PRE);
fs.writeFileSync(path.join(__dirname,'s89b.json'),JSON.stringify(sites));console.log('мест',sites.length);
