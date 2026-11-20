/* ▼▼▼ ARCH·89b · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.30 α · этап 6: граница подсистемы «прокачка забега»)
   Поля G.xp, G.lvl, G.need, G.lvlQ, G.bpQ, G.briefQ, G.briefN (опыт, уровень, порог, очереди модулей корабля / маяка / брифинга)
   пишут только функции этого блока. Было: 34 места в 19 функциях, две копии цикла повышения уровня (update, worldUpdate) и две копии
   старта брифинга (startMission, zbTick). Стало: 19 вызовов API. Зарегистрированные исключения — большие групповые сбросы раунда
   Object.assign в setupMission0 и enterWorldAt (bpQ:0 вместе с остальными полями раунда). Чтения полей не ограничены.
   Порядок вычислений сохранён: аргументы вычисляются до записи, как значения литерала в Object.assign; need() и xpMul() не пишут G.
   Порядок создания ключей G тот же (новым может быть только briefQ/briefN — они создаются там же и в том же порядке).
   Правило проверяется own6 (tools6/ownership6.json). Откат — снятие патча 89b. */
function runXp6(v){G.xp+=v;}
function runLvlUp6(p){while(G.xp>=G.need&&p.hp>0){G.xp-=G.need;G.lvl++;G.need=need(G.lvl);G.lvlQ++;}}
function runLvlSeg6(){G.lvlQ++;G.xp=0;G.lvl++;G.need=need(G.lvl);}
function runBrief6(K){Object.assign(G,{lvl:1+K,xp:0,lvlQ:K,briefQ:K,briefN:K});G.need=need(G.lvl);}
function runStart6(lv){Object.assign(G,{xp:0,lvl:lv,lvlQ:0,bpQ:0});G.need=need(lv);}
function runZero6(bp){const n=need(1);G.lvl=1;G.xp=0;G.need=n;G.lvlQ=0;if(bp)G.bpQ=0;G.briefQ=0;}
function runRestore6(r){G.xp=r.xp;G.lvl=r.lvl;G.need=r.need;G.lvlQ=0;G.bpQ=0;}
function runGrant6(k){if(k==='bp')G.bpQ++;else G.lvlQ++;}
function runTake6(k){if(k==='bp')G.bpQ=Math.max(0,G.bpQ-1);else{G.lvlQ=Math.max(0,G.lvlQ-1);if(G.briefQ>0)G.briefQ--;}}
function runQClear6(){G.lvlQ=0;G.briefQ=0;}
/* ▲▲▲ ARCH·89b · КОНЕЦ ВЫРЕЗАЕМОГО БЛОКА ▲▲▲ */
