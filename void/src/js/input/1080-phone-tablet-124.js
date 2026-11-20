/* ===== 1.2.4 α: телефон и планшет ===== */
/* подписи мира не обрезаются краем экрана */
{const _wl=worldLabel;worldLabel=function(x,y,text,col){try{if(SC>0&&text){ctx.font='700 '+fpx(11)+'px "JetBrains Mono",monospace';const w=ctx.measureText(text).width/2,X=(x-CX)*SC;
  if(X+w*SC>0&&X-w*SC<CW){const pad=8/SC,L=CX+pad+w+stageL()/SC,R=CX+(CW-stageL())/SC-pad-w;if(L<R)x=clamp(x,L,R);}}}catch(e){}return _wl(x,y,text,col);};}
/* подпись стрелки у края на телефоне не ложится на кнопки, мини-карту, радио и тосты */
function hudRects(){const out=[];for(const k in TBR){const b=TBR[k];if(b&&b.r)out.push([b.x-b.r-4,b.y-b.r-4,b.x+b.r+4,b.y+b.r+4]);}
  for(const id of ['mini','radio','toast','btnPause','btnMap']){const el=document.getElementById(id);if(!el||el.hidden||!el.offsetParent&&id!=='radio')continue;const r=el.getBoundingClientRect();if(r.width>0)out.push([r.left-4,r.top-4,r.right+4,r.bottom+4]);}
  return out;}
{const _ea2=edgeArrow;edgeArrow=function(x,y,col,size,label){if(!isMob()||!label)return _ea2(x,y,col,size,label);
  const calls=[],ft=ctx.fillText,st=ctx.strokeText;ctx.fillText=function(t,a,b){calls.push(['f',t,a,b,this.fillStyle]);};ctx.strokeText=function(t,a,b){calls.push(['s',t,a,b,this.strokeStyle,this.lineWidth,this.lineJoin]);};
  const ownF=Object.prototype.hasOwnProperty.call(ctx,'fillText'),ownS=Object.prototype.hasOwnProperty.call(ctx,'strokeText'),ownT=Object.prototype.hasOwnProperty.call(ctx,'translate'),tr=ctx.translate;let A=null;ctx.translate=function(a,b){if(!A)A=[a,b];return tr.apply(this,arguments);};
  let r;try{r=_ea2(x,y,col,size,label);}finally{if(ownF)ctx.fillText=ft;else delete ctx.fillText;if(ownS)ctx.strokeText=st;else delete ctx.strokeText;if(ownT)ctx.translate=tr;else delete ctx.translate;}
  const F=calls.filter(c=>c[0]==='f').pop();if(!F)return r;const t0=F[1],a0=F[2],b0=F[3];ctx.font='700 12px "JetBrains Mono",monospace';const w=ctx.measureText(t0).width/2+4,h=9,rs=hudRects();const AR=A?[A[0]-size-3,A[1]-size-3,A[0]+size+3,A[1]+size+3]:null;/* сама стрелка — препятствие для отодвинутой подписи */
  const hit=(cx,cy)=>cx-w<SAFE.l+4||cx+w>CW-SAFE.r-4||cy+4>CH-SAFE.b||cy-h<SAFE.t+2||rs.some(q=>cx+w>q[0]&&cx-w<q[2]&&cy+3>q[1]&&cy-h<q[3])||!lab61Free(cx,cy,w,h);
  const hitA=(cx,cy)=>hit(cx,cy)||!!AR&&cx+w>AR[0]&&cx-w<AR[2]&&cy+3>AR[1]&&cy-h<AR[3];
  let best=null;if(!hit(a0,b0))best=[a0,b0];else for(const d of [16,-16,30,-30,44,-44,60,-60,80,-80,100,-100]){if(!hitA(a0,b0+d)){best=[a0,b0+d];break;}if(!hitA(a0+d*1.5,b0)){best=[a0+d*1.5,b0];break;}}
  if(!best)outer:for(const dy of [-16,-32,-48,16,-64,-80]){for(const dx of [40,-40,80,-80,120,-120,160,-160,200,-200]){if(!hitA(a0+dx,b0+dy)){best=[a0+dx,b0+dy];break outer;}}}
  if(!best)return r;/* места нет — подпись не рисуем, как и раньше: лучше без неё, чем поверх кнопки */
  const dx=best[0]-a0,dy=best[1]-b0,fs=ctx.fillStyle,ss=ctx.strokeStyle,lw=ctx.lineWidth,lj=ctx.lineJoin;
  for(const c of calls){if(c[0]==='s'){ctx.strokeStyle=c[4];ctx.lineWidth=c[5];ctx.lineJoin=c[6];st.call(ctx,c[1],c[2]+dx,c[3]+dy);}else{ctx.fillStyle=c[4];ft.call(ctx,c[1],c[2]+dx,c[3]+dy);}}
  ctx.fillStyle=fs;ctx.strokeStyle=ss;ctx.lineWidth=lw;ctx.lineJoin=lj;lab61Add(best[0],best[1],w,h);
  return r;};}
/* планшеты до 1200 px по короткой стороне — планшетная раскладка (iPad Pro 12,9″ больше не получает смесь ПК и тач-кнопок) */
{const _ff=ffUpdate;ffUpdate=function(){_ff();try{if(G.ff==='desk'){const vv=window.visualViewport,w=vv&&vv.width?vv.width:innerWidth,h=vv&&vv.height?vv.height:innerHeight,sm=Math.min(w,h);
  const dev=(MOBQ&&MOBQ.matches)||G.input==='touch';if(dev&&sm<=1200){G.ff='tablet';const c=document.documentElement.classList;for(const k of ['desk','phone-p','phone-l','tablet'])c.toggle('ff-'+k,k==='tablet');c.toggle('mob',true);c.toggle('lefty',SET.hand==='l');}}}catch(e){}};}
try{ffUpdate();resize();}catch(e){}
/* планшет: HUD и тач-кнопки крупнее пропорционально экрану (768 → 1, 1024 → 1,3) */
function tabK(){return G.ff==='tablet'?clamp(Math.min(CW,CH)/768,1,1.3):1;}
{const _uc=uiCalc;uiCalc=function(){return G.ff==='tablet'?Math.round(tabK()*20)/20:_uc();};}
{const _ua=uiApply;uiApply=function(){_ua();document.documentElement.classList.toggle('tabz',G.ff==='tablet'&&UI>1);};}
{const _jr=joyR;joyR=function(){return _jr()*tabK();};}
try{uiApply();layoutTouch();}catch(e){}

