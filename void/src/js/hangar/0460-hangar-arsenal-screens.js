// ---- ангар «Зеркало» ----
function openHangar(){if(G.state!=='world')return;scr6('hangar');renderHangar();show('sHangar');}
// ---- 0.7.0: Арсенал ----
function openArsenal(){if(G.state!=='world'||!arsOpen())return;const S=G.save;if(S&&!S.ars)S.ars=arsDef();scr6('arsenal');G.arsArm=null;renderArsenal();show('sArsenal');saveWorld();}
function closeArsenal(){if(G.state!=='arsenal')return;scr6('world');G.cardKey=null;G.arsArm=null;computeStats();show('');}
const f1=v=>(Math.round(v*10)/10).toFixed(1).replace('.',',');
function arsStat(w,lv){const dmg=10*arsMul(w,'pow',lv.pow),rate=w==='gun'?(1/.27)*arsMul('gun','rate',lv.rate):(1/.27)/1.6,R=110*arsMul('blast','rad',lv.rad||0);return {dmg,rate,R};}
function renderArsenal(){const S=G.save;if(!S)return;const A=S.ars||(S.ars=arsDef());if(G.arsArm&&performance.now()-G.arsArmT>6000)G.arsArm=null;
  $('#arsLom').innerHTML=`ЛОМ ${lomH(S.lom,1)}`;
  const card=w=>{const W=ARS[w],own=!!A.own[w],cur=A.weapon===w&&own,lv=A.lv[w],st=arsStat(w,lv);
    const stats=w==='gun'?`УРОН ${f1(st.dmg)} · ТЕМП ${f1(st.rate)} ВЫСТР./С`:`ВЗРЫВ ${f1(st.dmg*1.4)} В ЦЕНТРЕ · ТЕМП ${f1(st.rate)} ВЫСТР./С · РАДИУС ${Math.round(st.R)}`;
    const tracks=Object.entries(W.tracks).map(([t,T])=>{const n=lv[t]||0;const curV=t==='pow'?st.dmg*(w==='blast'?1.4:1):t==='rate'?st.rate:st.R,nxt=n<3?curV*T.k[n]:null;
      const segs=T.k.map((k,i)=>{const can=own&&i===n,cost=T.cost[i],arm=G.arsArm===w+':'+t,poor=can&&S.lom<cost;
        return `<button class="ars-seg ${i<n?'f':i===n?'next':''} ${poor?'poor':''} ${arm&&can?'arm':''}" data-buy="${w}:${t}" ${can?'':'disabled'} aria-label="${T.name} ступень ${i+1}">${i<n?'✓ '+(i+1):arm&&can?'ПОДТВЕРДИТЬ':lomH(cost)}</button>`;}).join('');
      return `<div class="ars-track" data-t="${t}"><div class="ars-tl"><span>${T.name}</span><span>${n}/3</span></div><div class="ars-segs">${segs}</div><div class="ars-after">${!own?'сначала купите оружие':n<3?'':'максимум'}</div></div>`;}).join('');
    const arm=G.arsArm==='w:'+w,btn=!own?`<button class="wbtn amber ars-buyw ${S.lom<W.price?'poor':''} ${arm?'arm':''}" data-buyw="${w}">${arm?'ПОДТВЕРДИТЬ · ':'КУПИТЬ ОРУЖИЕ · '}${lomH(W.price)}</button>`:cur?`<button class="wbtn" disabled>АКТИВНО</button>`:`<button class="wbtn" data-pickw="${w}">ВЫБРАТЬ</button>`;
    return `<div class="ars-card ${cur?'cur':''}" data-w="${w}"><div class="eyebrow">${W.name}${cur?' · АКТИВНО':own?' · КУПЛЕНО':' · '+lomH(W.price)}</div><canvas class="ars-demo" data-demo="${w}" width="440" height="220" aria-hidden="true"></canvas><p class="note">${W.d}</p>${tracks}<div class="wc-row">${btn}</div></div>`;};
  $('#arsCards').innerHTML=card('gun')+card('blast');const m=$('#arsMsg');if(m)m.textContent=G.arsMsgT||'';G.arsMsgT='';}
function arsBuy(key){const S=G.save,A=S.ars;if(!A)return false;
  if(key.startsWith('w:')){const w=key.slice(2),W=ARS[w];if(A.own[w])return false;if(S.lom<W.price){G.arsMsgT='НЕ ХВАТАЕТ '+(W.price-S.lom)+' ЛОМА';sfx('block');return false;}S.lom-=W.price;A.own[w]=1;A.weapon=w;}
  else{const [w,t]=key.split(':'),T=ARS[w].tracks[t],n=A.lv[w][t]||0;if(!A.own[w]||n>=3)return false;const cost=T.cost[n];if(S.lom<cost){G.arsMsgT='НЕ ХВАТАЕТ '+(cost-S.lom)+' ЛОМА';sfx('block');return false;}S.lom-=cost;A.lv[w][t]=n+1;}
  G.arsArm=null;computeStats();saveWorld();sfx('level');buzz('win');return true;}
document.addEventListener('click',e=>{if(G.state!=='arsenal')return;const S=G.save;if(!S||!S.ars)return;
  const b=e.target.closest('[data-buy],[data-buyw],[data-pickw]');if(!b||b.disabled)return;
  if(b.dataset.pickw){S.ars.weapon=b.dataset.pickw;computeStats();saveWorld();buzz('tap');renderArsenal();return;}
  const key=b.dataset.buyw?'w:'+b.dataset.buyw:b.dataset.buy;
  if(G.arsArm===key){arsBuy(key);}else{G.arsArm=key;G.arsArmT=performance.now();buzz('tap');}renderArsenal();});
// живые демонстрации выстрела
function arsDemoTick(now){const S=G.save;if(!S||!S.ars)return;const t=now/1000;
  document.querySelectorAll('#arsCards .ars-demo').forEach(c=>{const w=c.dataset.demo,g=c.getContext('2d'),W=c.width,H=c.height,lv=S.ars.lv[w],st=arsStat(w,lv);g.clearRect(0,0,W,H);
    g.fillStyle='#030710';g.fillRect(0,0,W,H);g.strokeStyle='#10213a';g.lineWidth=1;for(let x=0;x<W;x+=40){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke();}
    const sx=60,sy=H/2;g.fillStyle='#8fe9ff';g.beginPath();g.moveTo(sx+16,sy);g.lineTo(sx-12,sy-11);g.lineTo(sx-6,sy);g.lineTo(sx-12,sy+11);g.closePath();g.fill();
    const tg=[[W-70,sy-52],[W-60,sy],[W-74,sy+50]];const cyc=w==='gun'?1.2:2.4,ph=(t%cyc)/cyc;
    if(w==='gun'){const gap=Math.max(28,90*3.7/st.rate);const th=1.5+(st.dmg/10-1)*2;g.strokeStyle='#8fe9ff';g.lineWidth=th;for(let x=sx+20+(ph*gap)%gap;x<W-80;x+=gap){g.beginPath();g.moveTo(x-16,sy);g.lineTo(x,sy);g.stroke();}
      for(const [x,y] of tg){const hit=Math.abs(y-sy)<8&&((t*st.rate)%1)<.25;g.strokeStyle=hit?'#ffffff':'#ff4f6e';g.lineWidth=2;g.beginPath();g.arc(x,y,12,0,TAU);g.stroke();if(hit){g.fillStyle='rgba(255,255,255,.35)';g.fill();}}}
    else{const fx=sx+20+ph*(W-sx-120)/.6,R=st.R*.55;const expl=ph>.6;const ex=W-90,ey=sy;
      if(!expl){g.fillStyle='#dff6ff';g.beginPath();g.arc(Math.min(fx,ex),sy,5,0,TAU);g.fill();g.strokeStyle='#9fe3ff';g.lineWidth=2;g.beginPath();g.moveTo(Math.min(fx,ex)-18,sy);g.lineTo(Math.min(fx,ex),sy);g.stroke();}
      else{const q=(ph-.6)/.4;g.strokeStyle=`rgba(159,227,255,${1-q})`;g.lineWidth=3;g.beginPath();g.arc(ex,ey,R*Math.min(1,q*1.6),0,TAU);g.stroke();g.fillStyle=`rgba(159,227,255,${.25*(1-q)})`;g.fill();}
      for(const [x,y] of tg){const d=Math.hypot(x-ex,y-ey),hit=expl&&d<R*Math.min(1,(ph-.6)/.4*1.6);g.strokeStyle=hit?'#ffffff':'#ff4f6e';g.lineWidth=2;g.beginPath();g.arc(x,y,12,0,TAU);g.stroke();if(hit){g.fillStyle='rgba(255,255,255,.35)';g.fill();}}
      g.strokeStyle='rgba(159,227,255,.25)';g.setLineDash([4,4]);g.beginPath();g.arc(ex,ey,R,0,TAU);g.stroke();g.setLineDash([]);}
  });}
function closeHangar(){if(G.state!=='hangar')return;scr6('world');G.cardKey=null;show('');}
function renderHangar(){
  const cur=curSkin(),Sv=G.save,lv=Sv.pilot.lvl;
  $('#hangarNote').innerHTML=`Уровень пилота ${lv} · ${lomH(Sv.lom,1)}<br>Скины открываются уровнем пилота и покупаются за лом.`;
  $('#skinGrid').innerHTML=Object.entries(SKINS).map(([k,S])=>{const own=Sv.ownSkins.includes(k),q=skinReq(k),lock=!own&&lv<q.lvl;
    const tag=k==='base'?'СТАНДАРТ':own?'В ХРАНИЛИЩЕ':S.find?'СКРЫТО':lock?'УРОВЕНЬ '+q.lvl:lomH(q.cost);
    const btn=k===cur?`<button class="wbtn" disabled>ВЫБРАН</button>`:own?`<button class="wbtn amber" data-pick="${k}">ВЫБРАТЬ</button>`:S.find?`<button class="wbtn" disabled>НАЙТИ · ${S.find}</button>`:
      lock?`<button class="wbtn" disabled>ЗАКРЫТ · УРОВЕНЬ ${q.lvl}</button>`:`<button class="wbtn amber" data-buy="${k}" ${Sv.lom<q.cost?'disabled':''}>КУПИТЬ · ${lomH(q.cost)}</button>`;
    const [wn,wm]=skinWrecks(k);
    return `<div class="skincard ${k===cur?'on':''} ${lock?'lock':''}"><canvas data-prev="${k}" width="320" height="200"></canvas>
    <div class="sc-h"><b>${S.name}</b><span class="${lock?'need':'free'}">${tag}</span></div><p>${S.d}</p>${wm?`<p class="wcnt">Обломков найдено: ${wn}/${wm}</p>`:''}${btn}</div>`;}).join('');
}
$('#skinGrid').addEventListener('click',e=>{const S=G.save;if(!S)return;const b=e.target.closest('[data-pick],[data-buy]');if(!b||b.disabled)return;
  if(b.dataset.buy){const k=b.dataset.buy,q=skinReq(k);if(S.ownSkins.includes(k)||S.pilot.lvl<q.lvl||S.lom<q.cost||SKINS[k].find)return;S.lom-=q.cost;S.ownSkins.push(k);S.skin=k;banner('СКИН КУПЛЕН',SKINS[k].name.toUpperCase());}
  else{const k=b.dataset.pick;if(!S.ownSkins.includes(k))return;S.skin=k;}
  saveWorld();sfx('level');renderHangar();});
function drawHangarPreviews(now){
  const t=now/1000,real=ctx;
  document.querySelectorAll('canvas[data-prev]').forEach((c,i)=>{
    const g=c.getContext('2d'),id=c.dataset.prev,S=SKINS[id];ctx=g;
    try{g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.fillStyle='#070c16';g.fillRect(0,0,320,200);
      for(let s=0;s<26;s++){const x=((s*97+i*31)-t*40*(1+s%3))%340,xx=x<0?x+340:x;g.fillStyle=s%3?'#2a3a55':'#7f9ab5';g.fillRect(xx-10,(s*53+i*17)%200,1.5,1.5);}
      const bob=Math.sin(t*1.6+i)*6,ang=-.35+Math.sin(t*.9+i)*.12;
      g.setTransform(3.2,0,0,3.2,165,100+bob);
      for(let k=1;k<=9;k++)glow(-Math.cos(ang)*k*6,-Math.sin(ang)*k*6,7-k*.5,S.trail,.5*(1-k/10));
      g.rotate(ang);drawShip(id,t+i,260,{});
    }catch(err){console.error(err);}finally{ctx=real;g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;}
  });
}

