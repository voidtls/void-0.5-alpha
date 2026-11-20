// ---------- Предметы и подбор ----------
let hintCd={};
function hintOnce(key,text,col){const t=G.t;if(hintCd[key]&&t-hintCd[key]<2.6)return;hintCd[key]=t;if(G.player)floater(G.player.x,G.player.y-30,text,col);}
function updatePickups(dt){
  const p=G.player,st=G.st,bc=G.bc;
  for(const k of G.pick){
    k.t+=dt;k.life-=dt;if(k.stab>0)k.stab-=dt;
    k.vx*=Math.pow(.05,dt);k.vy*=Math.pow(.05,dt);
    const d=Math.hypot(p.x-k.x,p.y-k.y);
    const cargoFree=bc&&p.cargo<st.cargo;
    const full=!k.anom&&((k.k==='rep'&&p.hp>=st.maxHp)||(k.k==='cell'&&p.en>=100&&!cargoFree));
    const attract=p.hp>0&&!full&&!(k.stab>0)&&!k.noMag&&(d<st.mag||G.endT>0);
    if(attract){const s=G.endT>0?900:clamp(600-d*2,220,600);k.vx+=(p.x-k.x)/(d||1)*s*dt*6;k.vy+=(p.y-k.y)/(d||1)*s*dt*6;const v=Math.hypot(k.vx,k.vy);if(v>700){k.vx*=700/v;k.vy*=700/v;}}
    k.x+=k.vx*dt;k.y+=k.vy*dt;k.x=clamp(k.x,8,BW-8);k.y=clamp(k.y,8,BH-8);
    if(p.hp>0){
      const hd=segDist(p.px,p.py,p.x,p.y,k.x,k.y);
      if(hd<p.r+k.r+6){
        if(k.k==='xp'){k.life=0;runXp6(xpMul());G.score+=2;sfx('pick');}
        else if(k.k==='lom'){k.life=0;if(G.save)G.save.carry+=k.v;sfx('pick');}
        else if(k.anom){k.life=0;if(G.anom)G.anom.got++;p.en=Math.min(100,p.en+8);sfx('cell');floater(k.x,k.y-14,'ЯЧЕЙКА '+(G.anom?G.anom.got:0)+'/'+(G.anom?G.anom.need:8),'#ffb84d');}
        else if(k.stab>0){hintOnce('stab','ЯЧЕЙКА СТАБИЛИЗИРУЕТСЯ · '+k.stab.toFixed(1)+' с','#ffb84d');}
        else if(k.k==='cell'){
          const got=()=>{if(G.mc){G.mc.cells++;conEvent('cell');}};
          if(cargoFree){k.life=0;p.cargo++;got();sfx('cell');floater(k.x,k.y-14,'ЯЧЕЙКА В ТРЮМЕ · '+p.cargo+'/'+st.cargo,'#ffb84d');}
          else if(p.en>=100)hintOnce('enfull',bc?'ТРЮМ И НАКОПИТЕЛЬ ПОЛНЫ':'НАКОПИТЕЛЬ ПОЛОН · ИМПУЛЬС: E','#ffb84d');
          else{k.life=0;got();p.en=Math.min(100,p.en+34*st.eGain);sfx('cell');floater(k.x,k.y-14,'+ЭНЕРГИЯ','#ffb84d');}}
        else if(k.k==='rep'){if(noHeal()){k.life=0;p.en=Math.min(100,p.en+34*st.eGain);sfx('cell');floater(k.x,k.y-14,'+ЭНЕРГИЯ','#8fe9ff');}else if(p.hp>=st.maxHp)hintOnce('hpfull','КОРПУС ЦЕЛ · РЕМКОМПЛЕКТ ОСТАЁТСЯ','#8fe9ff');else{k.life=0;if(G.wear>0)addWear(-st.maxHp0*(storyFlag('factory')?.1:.05));const h=Math.min(st.maxHp-p.hp,30);p.hp+=h;sfx('cell');floater(k.x,k.y-14,'+'+Math.round(h)+' КОРПУС','#8fe9ff');}}
      }
    }
  }
  G.pick=G.pick.filter(k=>k.life>0);
  if(G.m>=2&&p.hp>0)p.en=Math.min(100,p.en+dt*1.2*st.eGain*(secScale()&&secScale().ice?1.15:1));
}

