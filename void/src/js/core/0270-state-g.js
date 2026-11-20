const G={state:'menu',m:0,t:0,player:null,enemies:[],pb:[],eb:[],pick:[],parts:[],float:[],warns:[],waves:[],waveIdx:0,spawnQ:[],waveT:0,gapT:0,waveSize:1,
  mods:{},st:null,xp:0,lvl:1,need:10,lvlQ:0,bpQ:0,score:0,kills:0,taken:0,mT:0,prio:null,shake:0,hurtV:0,boss:null,endT:0,shock:[],runStart:null,dashId:0,deadT:0,uid:0,
  bc:null,relays:[],rocks:[],fields:[],meteors:[],storm:null,stormT:0,flare:0,fake:null,lureP:null,dashLog:[],dark:false,lightFull:0,jam:null,script:[],evAt:[],evUsed:[],dirT:0,affixCh:0,loseBeacon:false,bcTaken:0,rockN:0,rockT:0};
function need(l){const b=Math.round(6+l*3.6);return G.mode==='endless'?Math.max(3,Math.round(b/1.6)):b;}
function computeStats(){
  const m=G.mods,V=k=>MODS[k].v[m[k]||0];
  G.st={dmg:10*V('cal')*(1+.05*perk('aim')),rate:.27*V('rof'),shots:V('multi')[0],shotK:V('multi')[1],pierce:V('pierce'),speed:290*V('eng')*(G.mode==='world'&&G.save&&G.save.speedBoost?1.15:1),dashCd:Math.max(.9,V('dash')-.15*perk('dash')),
    maxHp:100+V('hull')+10*perk('hull'),mag:V('mag')+25*perk('mag'),ram:V('ram'),shieldCd:V('shield'),drones:V('drone'),eGain:V('pulse')[0]*(1+.15*perk('energy')),pR:V('pulse')[1],
    cargo:V('tractor')+perk('cargo'),sync:V('sync'),rico:V('rico'),phase:V('phase'),light:V('light'),linek:V('linekit')};
  {const aw=arsWeapon();G.st.weapon=aw;G.st.dmg*=arsK(aw,'pow');if(aw==='gun')G.st.rate/=arsK('gun','rate');else G.st.rate*=1.6;G.st.blastR=110*arsK('blast','rad');const wc=$('#wpnC');if(wc)wc.hidden=aw!=='blast';}
  {G.st.dmg*=playerDmgK()*memK90();G.st.maxHp0=G.st.maxHp;if(G.wear>0)G.st.maxHp=Math.max(50,Math.round(G.st.maxHp-G.wear));}/* 0.7.4: урон и максимум прочности — по силе пилота, а не по сектору под кораблём */
}

