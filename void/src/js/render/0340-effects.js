// ---------- Эффекты ----------
let PMAX=900,GLOWMAX=0;
function part(x,y,vx,vy,life,col,size){if(G.parts.length>=PMAX||(G.lowFx&&Math.random()<.5)||(SET.lessFx&&Math.random()<.5))return;G.parts.push({x,y,vx,vy,life,max:life,col,size});}
function explode(x,y,col,n,s){const m=SET.fx?n:Math.ceil(n/4);for(let i=0;i<m;i++){const a=rnd(0,TAU),v=rnd(40,320)*s;part(x,y,Math.cos(a)*v,Math.sin(a)*v,rnd(.3,.8)*s,Math.random()<.3?'#ffffff':col,rnd(1.5,3.5));}
  if(G.shock.length<60)G.shock.push({x,y,r:4,R:30*s+10,t:0,col,thin:true});}
function floater(x,y,text,col){text=tclean(text);if(G.float.length>24)G.float.shift();G.float.push({x:clamp(x,CX+60,CX+W-60),y:clamp(y,CY+30,CY+H-20),text,col,life:1.3});}
let banT=0;
/* 1.1.0: чистка всплывающих надписей */
function tclean(s){if(typeof s!=='string'||!s||G.devRun)return s;let t=s.replace(/\s·\s~?\d+(?:[,.]\d+)?\s?[сС](?![А-ЯЁа-яё])/g,'').replace(/^~?\d+(?:[,.]\d+)?\s?[сС]\s·\s/,'');
  const seg=t.split(' · ');if(seg.length>1){const k=seg.filter(x=>!/×\s?\d/.test(x)&&!/[+−-]?\d+(?:[,.]\d+)?\s?%/.test(x));if(k.length)t=k.join(' · ');}
  t=t.replace(/\s*×\s?\d+(?:[,.]\d+)?(?=$|\s·|,)/g,'').replace(/\s+,/g,',').trim();return t||s;}
function banner(b,s){s=tclean(s);if(/^(ЛОМ|УРОН|ЗАРЯД|ОПЫТ)$/.test(s||''))s='';$('#banB').textContent=b;$('#banS').textContent=s||'';$('#banner').classList.add('show');banT=2.6;}

