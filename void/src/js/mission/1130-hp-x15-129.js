/* ===== 1.2.9 α: миссии 15–24 — враги прочнее и бьют больнее в 1,5 раза (скорость и темп атак без изменений) ===== */
const X129={from:15,to:24,hp:1.5,dmg:1.5};
function hpX129(){return inMission()&&G.m>=X129.from&&G.m<=X129.to?X129.hp:1;}
/* урон по игроку и по маяку: через уже существующий множитель миссий (damagePlayer, dmgBeacon) */
for(let m=X129.from;m<=X129.to;m++){MISSION_K[m]=Object.assign({},MISSION_K[m]);MISSION_K[m].dmg=(MISSION_K[m].dmg||1)*X129.dmg;}
/* боссы секторов и их части задают прочность сами — через sbRank() */
{const _sbR=sbRank;sbRank=function(){return _sbR()*hpX129();};}

