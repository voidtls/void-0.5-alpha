// ---------- HUD ----------
const hudEls={hud0:document.getElementById('hud')};['hpT','hpB','enT','enB','enBar','misT','sigT','sigB','sigBar','bossBar','bossB','score','dashC','pulseC','lvC','xpB','tDash','tPulse','bcBox','bcB','bcBar','biT','biB','biBar','jamBar','jamB','cargoC','wSec','wLom','wSub','eTime','eB','eStep','eRec','chgC','comboC','tCharge','aimC'].forEach(id=>hudEls[id]=document.getElementById(id));
const hudCache={};
function setT(id,v){if(touchMode)v=kh(v);if(hudCache[id]!==v){hudCache[id]=v;hudEls[id].textContent=v;}}
function setS(id,v){const k=id+'s';if(hudCache[k]!==v){hudCache[k]=v;hudEls[id].style.transform=`scaleX(${v})`;}}
function setC(id,c,on){const k=id+c;if(hudCache[k]!==on){hudCache[k]=on;hudEls[id].classList.toggle(c,on);}}
function setF(id,f){const k=id+'f',v=Math.round(clamp(f,0,1)*50)*2;if(hudCache[k]!==v){hudCache[k]=v;hudEls[id].style.setProperty('--f',v+'%');}}
function mName(M){return M?String(M.name).replace(/^Комната босса · /,''):'';}
function hudClean(v){return String(v==null?'':v).replace(/\s·\sФАЗА\s\d+/g,'').replace(/ФАЗА\s\d+\s·\s/g,'').replace(/(\d+)[,.](\d)\s?[сС](?![А-ЯЁа-яё])/g,(m,a,b)=>Math.ceil(+(a+'.'+b))+' С');}
function setH(id,h){const k=id+'h';if(hudCache[k]!==h){hudCache[k]=h;hudEls[id].hidden=h;}}
function updateHUD(){
  const p=G.player,st=G.st;if(!p)return;
  setT('hpT',Math.ceil(p.hp)+'/'+st.maxHp+(G.wear>0?' · ИЗНОС':''));setS('hpB',(p.hp/st.maxHp).toFixed(3));
  setS('enB',(p.en/100).toFixed(3));setC('enBar','full',p.en>=100);
  setT('misT',mName(MISSIONS[G.m-1]).toUpperCase());
  const bc=G.bc;
  setH('bcBox',!bc);
  if(G.lockGun>0||G.lockShield>0||G.lockDash>0)hintOnce('lockhud',(G.lockShield>0?'ЩИТ ':'')+(G.lockDash>0?'РЫВОК ':'')+(G.lockGun>0?'ОРУДИЕ ':'')+'НА ХРАНЕНИИ','#8fd8ff');
  if(bc){
    setH('sigBar',true);setH('bossBar',true);
    let s;if(bc.done)s=MISSIONS[G.m-1].transmit?'СИГНАЛ ПЕРЕДАН':'МАЯК ЗАРЯЖЕН';
    else if(bc.cool>0)s='ПРОДУВКА';
    else if(bc.transStarted&&!bc.transDone)s=(bc.charge>=80?'ПЕРЕДАЧА · ':'ПЕРЕДАЧА НА ПАУЗЕ · ')+Math.ceil(bc.trans)+' С';
    else if(bc.transDone)s='ПЕРЕДАЧА ЗАВЕРШЕНА';
    else s='ЗАРЯД'+(bc.drain>0?' ▼':bc.inRing?' ▲':'');
    setT('sigT',s);setS('bcB',(bc.charge/100).toFixed(3));setC('bcBar','cool',bc.cool>0);
    setT('biT',bc.barrier>0?'ЩИТ':'');setS('biB',(bc.hp/bc.maxHp).toFixed(3));setC('biBar','hit',bc.hitF>0);
    const j=G.jam&&G.jam.st!=='enter'?G.jam:null;setH('jamBar',!j);if(j)setS('jamB',(j.hp/j.maxHp).toFixed(4));
    setH('cargoC',false);setT('cargoC','ГРУЗ '+p.cargo+'/'+st.cargo);setC('cargoC','ok',p.cargo>0);
  }else{
    setH('cargoC',true);
    const SB=G.sb&&G.sb.st!=='enter'?G.sb:null,boss=!!SB||(G.boss&&G.boss.st!=='enter');
    setH('bossBar',!boss);setH('sigBar',!!boss);
    if(SB){setT('sigT',hudClean(sbHud(SB)));setS('bossB',(SB.hp/SB.maxHp).toFixed(4));}
    else if(boss){setT('sigT',G.boss.over>0?'ПЕРЕГРУЗКА':'СТРАЖ');setS('bossB',(G.boss.hp/G.boss.maxHp).toFixed(4));}
    else{const pr=G.bossSpawned?1:sigProgress()*((MISSIONS[G.m-1].boss||MISSIONS[G.m-1].sboss)?0.85:1);setT('sigT','СИГНАЛ');setS('sigB',pr.toFixed(3));}
  }
  hudEls.score.firstChild.nodeValue=fmt(G.score);
  const blocked=dashBlocked();const dr=p.dashCd<=0&&!blocked;
  setT('dashC',blocked?'РЫВОК · ПОМЕХИ':'РЫВОК');setF('dashC',p.dashCd>0?1-p.dashCd/(p.dashCdMax||st.dashCd||1):0);setC('dashC','ok',dr);setC('dashC','bad',blocked);setC('tDash','cd',!dr);
  const pr=p.en>=100;setT('pulseC',pr?'ИМПУЛЬС [E]':'ИМПУЛЬС');setF('pulseC',pr?0:p.en/100);setC('pulseC','ok',pr);setC('tPulse','cd',!pr);
  setT('lvC','ЩИТ');setH('lvC',!st.shieldCd);setC('lvC','ok',!!(st.shieldCd&&p.shieldUp));setS('xpB',(G.xp/G.need).toFixed(3));
  chargeChip();
}

