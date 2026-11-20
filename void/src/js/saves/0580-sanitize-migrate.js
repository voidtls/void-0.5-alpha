// ---- миграция сохранений ----
// 0.5.10: схема сохранения — приведение типов и очистка строк (код сохранения приходит от чужих людей)
function sanitizeSave(S){
  const num=(v,d,lo,hi,int)=>{v=+v;if(!Number.isFinite(v))v=d;if(lo!==undefined&&v<lo)v=lo;if(hi!==undefined&&v>hi)v=hi;return int?Math.round(v):v;};
  const obj=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
  const arr=v=>Array.isArray(v)?v:[];
  const strip=v=>{if(typeof v==='string')return v.replace(/[<>]/g,'').slice(0,FGW*FGH+64);if(Array.isArray(v))return v.map(strip);if(v&&typeof v==='object'){const o={};for(const k of Object.keys(v)){if(k==='__proto__'||k==='constructor'||k==='prototype')continue;o[k]=strip(v[k]);}return o;}return v;};
  S=strip(S);
  S.lom=num(S.lom,0,0,1e12);S.carry=num(S.carry,0,0,1e12);S.cleared=num(S.cleared,0,0,CORE,true);S.cycle=num(S.cycle,1,1,999,true);
  S.pilot=obj(S.pilot);S.pilot.lvl=num(S.pilot.lvl,1,1,999,true);S.pilot.xp=num(S.pilot.xp,0,0,1e9);
  S.run=obj(S.run);S.run.mods=obj(S.run.mods);S.run.hp=num(S.run.hp,100,1,1e6);S.run.en=num(S.run.en,0,0,100);S.run.lvl=num(S.run.lvl,1,1,999,true);S.run.xp=num(S.run.xp,0,0,1e9);S.run.need=num(S.run.need,10,1,1e9);S.run.score=num(S.run.score,0,0,1e12);S.run.kills=num(S.run.kills,0,0,1e9,true);S.run.taken=num(S.run.taken,0,0,1e9);
  for(const k of ['pos','last']){S[k]=obj(S[k]);S[k].x=num(S[k].x,0,0,WW);S[k].y=num(S[k].y,0,0,WH);}
  if(S.lost){S.lost=obj(S.lost);S.lost.x=num(S.lost.x,0,0,WW);S.lost.y=num(S.lost.y,0,0,WH);S.lost.v=num(S.lost.v,0,0,1e12);if(!S.lost.v)S.lost=null;}
  S.contracts=obj(S.contracts);S.contracts.done=num(S.contracts.done,0,0,1e6,true);S.contracts.list=arr(S.contracts.list).filter(c=>c&&typeof c==='object'&&typeof c.tid==='string'&&CTPL.some(t=>t.id===c.tid)).slice(0,20).map(c=>({tid:c.tid,p:num(c.p,0,0,1e6,true),n:num(c.n,1,1,1e6,true),lom:num(c.lom,0,0,1e6,true),px:num(c.px,0,0,1e6,true)}));
  const m={};for(const k of Object.keys(obj(S.medals))){const i=+k;if(!(i>=1&&i<=NM))continue;const v=obj(S.medals[k]),o={};for(const f of ['clear','clean','master'])if(v[f])o[f]=1;m[i]=o;}S.medals=m;
  const pk={};for(const k of Object.keys(obj(S.perks)))if(PERKS[k])pk[k]=num(S.perks[k],0,0,PERKS[k].max,true);S.perks=pk;
  {const A=obj(S.ars),lv=obj(A.lv),g=obj(lv.gun),bl=obj(lv.blast);S.ars={weapon:A.weapon==='blast'?'blast':'gun',own:{gun:1,blast:obj(A.own).blast?1:0},lv:{gun:{pow:num(g.pow,0,0,3,true),rate:num(g.rate,0,0,3,true)},blast:{pow:num(bl.pow,0,0,3,true),rad:num(bl.rad,0,0,3,true)}}};if(!S.ars.own.blast)S.ars.weapon='gun';
   const tr={};for(const k of Object.keys(obj(S.trophy))){const i=+k;if(BOSS_TROPHY[i]&&S.trophy[k])tr[i]=1;}S.trophy=tr;}
  S.ownSkins=arr(S.ownSkins).filter(k=>SKINS[k]);S.skins=arr(S.skins).filter(k=>SKINS[k]);if(!SKINS[S.skin])S.skin='base';if(!DIFF[S.diff])S.diff='easy';
  for(const k of ['journals','found','anomalies','relays','zonesDone','replays','best','bestDiff'])S[k]=obj(S[k]);
  S.jOrder=arr(S.jOrder).filter(x=>typeof x==='string');S.rocksGone=arr(S.rocksGone).filter(x=>typeof x==='number'||typeof x==='string').slice(0,5000);S.locksDown=arr(S.locksDown).filter(x=>typeof x==='number');
  if(typeof S.reveal!=='string'||S.reveal.length>FGW*FGH)S.reveal='';S.gate=!!S.gate;S.speedBoost=S.speedBoost?1:0;S.intro=!!S.intro;
  if(S.story!==undefined){S.story=obj(S.story);const st=S.story;if(st.inv14!==undefined&&!['memory','cold'].includes(st.inv14))delete st.inv14;if(st.obod18!==undefined&&!['scrap','service'].includes(st.obod18))delete st.obod18;if(st.cradle22!==undefined&&!['cut','keep'].includes(st.cradle22))delete st.cradle22;if(st.fleet27!==undefined&&!['bridge','engine'].includes(st.fleet27))delete st.fleet27;if(st.save33!==undefined&&!['dead','unborn'].includes(st.save33))delete st.save33;if(st.teo!==undefined&&![1,-1].includes(st.teo))delete st.teo;if(st.echo127!==undefined&&st.echo127!=='guard')delete st.echo127;if(st.lastKind!==undefined)st.lastKind=num(st.lastKind,0,0,1e4,true);if(st.pilgrimsKilled!==undefined)st.pilgrimsKilled=num(st.pilgrimsKilled,0,0,1e6,true);st.history=arr(st.history).filter(r=>r&&typeof r==='object').slice(0,50);if(st.invDig!==undefined)st.invDig=num(st.invDig,0,0,4,true);}
  if(S.w80!==undefined){const w=S.w80=obj(S.w80);w.clk=num(w.clk,0,0,1e9);w.alarmAt=arr(w.alarmAt).slice(0,3).map(v=>num(v,0,0,1e9));while(w.alarmAt.length<3)w.alarmAt.push(0);w.rangeBest=num(w.rangeBest,0,0,1e6,true);if(w.rangeGoal!==undefined)w.rangeGoal=num(w.rangeGoal,60,0,1e6,true);w.seen=obj(w.seen);w.zd=obj(w.zd);w.voices=num(w.voices,0,0,12,true);if(w.karr!==undefined)w.karr=1;}
  if(S.story){const st=S.story;if(st.line31!==undefined&&!['break','write'].includes(st.line31))delete st.line31;if(st.well38!==undefined&&!['silence','answer','third'].includes(st.well38))delete st.well38;if(st.woke!==undefined)st.woke=num(st.woke,0,0,1e6,true);if(st.third85!==undefined&&st.third85!==1)delete st.third85;}
  sanitize90(S,num,obj);
  if(S.w85!==undefined){const w=S.w85=obj(S.w85);w.apprAt=num(w.apprAt,0,0,1e9);}
  if(S.w74!==undefined){const w=S.w74=obj(S.w74);w.pois=obj(w.pois);w.zd=obj(w.zd);w.glyph=num(w.glyph,0,0,5,true);if(w.save33!==undefined&&!['dead','unborn'].includes(w.save33))delete w.save33;}
  if(S.w58!==undefined){const w=S.w58=obj(S.w58);for(const k of ['iceRocks','arcRec','rustBox','arcBeacons'])w[k]=arr(w[k]).filter(x=>typeof x==='number'||typeof x==='string').slice(0,500);w.tugs=obj(w.tugs);w.tugs.esc=num(w.tugs.esc,0,0,1e6,true);w.tugs.rob=num(w.tugs.rob,0,0,1e6,true);w.wander=obj(w.wander);w.conveyor=obj(w.conveyor);w.packs=obj(w.packs);}
  return S;}
function migrateSave(S){
  if(!validSave(S))return null;S=sanitizeSave(S);
  if(S.v===1){
    const lv=Object.values(S.run.mods||{}).reduce((a,b)=>a+b,0),comp=Math.min(300,15*lv);S.lom=(S.lom||0)+comp;
    let px=0;for(let m=1;m<=S.cleared;m++)px+=40+8*m;for(const k in S.medals)px+=25*medalCount(S.medals[k]);
    S.pilot={lvl:1,xp:0};while(px>=pilotNeed(S.pilot.lvl)){px-=pilotNeed(S.pilot.lvl);S.pilot.lvl++;}S.pilot.xp=px;
    S.ownSkins=['base'];if(S.skin&&S.skin!=='base'&&SKINS[S.skin])S.ownSkins.push(S.skin);
    S.v=2;S.migrated=comp;
  }
  S.run.mods={};S.run.lvl=1;S.run.xp=0;
  S.pilot=S.pilot||{lvl:1,xp:0};S.ownSkins=S.ownSkins||['base'];if(!S.ownSkins.includes('base'))S.ownSkins.unshift('base');
  if(!S.wv){for(const k of ['pos','last','lost'])if(S[k]&&typeof S[k].y==='number')S[k].y=Math.min(WH,S[k].y+OY);
    if(S.reveal){const o=S.reveal,FW0=Math.ceil(WW0/FOG),FH0=Math.ceil(WH0/FOG),a=new Array(FGW*FGH).fill('0');for(let j=0;j<FH0;j++)for(let i=0;i<FW0;i++)if(o[j*FW0+i]==='1')a[(j+OY/FOG)*FGW+i]='1';S.reveal=a.join('');}
    S.wv=2;}
  if(!S.speedBoost&&(S.cleared>=CORE||(S.cycle||1)>1))S.speedBoost=1;
  S.contracts=S.contracts||{list:[],done:0};if(!Array.isArray(S.jOrder))S.jOrder=WORLD.journals.filter(j=>S.journals&&S.journals[j.id]).map(j=>j.id);S.cycle=S.cycle||1;S.rocksGone=S.rocksGone||[];S.zonesDone=S.zonesDone||{};S.bestDiff=S.bestDiff||{};
  S.diff=DIFF[S.diff]?S.diff:'easy';if(!SKINS[S.skin]||!S.ownSkins.includes(S.skin))S.skin='base';
  {const D=newSave();for(const k in D)if(S[k]===undefined)S[k]=D[k];for(const k of ['lom','carry']){const v=+S[k];S[k]=Number.isFinite(v)&&v>0?v:0;}}
  storyInit(S);
  return S;
}

