# Генерирует stage6/arch74_89b.py из stage6/gen/s89b.json (gen89b.js по 1.5.29).
import json,os
D=os.path.dirname(os.path.abspath(__file__));S=[tuple(x) for x in json.load(open(os.path.join(D,'s89b.json')))];assert len(S)==19
PRE=('/* ▼▼▼ ARCH·89b · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.30 α · этап 6: граница подсистемы «прокачка забега»)\n'
     '   Поля G.xp, G.lvl, G.need, G.lvlQ, G.bpQ, G.briefQ, G.briefN (опыт, уровень, порог, очереди модулей корабля / маяка / брифинга)\n'
     '   пишут только функции этого блока. Было: 34 места в 19 функциях, две копии цикла повышения уровня (update, worldUpdate) и две копии\n'
     '   старта брифинга (startMission, zbTick). Стало: 19 вызовов API. Зарегистрированные исключения — большие групповые сбросы раунда\n'
     '   Object.assign в setupMission0 и enterWorldAt (bpQ:0 вместе с остальными полями раунда). Чтения полей не ограничены.\n'
     '   Порядок вычислений сохранён: аргументы вычисляются до записи, как значения литерала в Object.assign; need() и xpMul() не пишут G.\n'
     '   Порядок создания ключей G тот же (новым может быть только briefQ/briefN — они создаются там же и в том же порядке).\n'
     '   Правило проверяется own6 (tools6/ownership6.json). Откат — снятие патча 89b. */\n'
     'function runXp6(v){G.xp+=v;}\n'
     'function runLvlUp6(p){while(G.xp>=G.need&&p.hp>0){G.xp-=G.need;G.lvl++;G.need=need(G.lvl);G.lvlQ++;}}\n'
     'function runLvlSeg6(){G.lvlQ++;G.xp=0;G.lvl++;G.need=need(G.lvl);}\n'
     'function runBrief6(K){Object.assign(G,{lvl:1+K,xp:0,lvlQ:K,briefQ:K,briefN:K});G.need=need(G.lvl);}\n'
     'function runStart6(lv){Object.assign(G,{xp:0,lvl:lv,lvlQ:0,bpQ:0});G.need=need(lv);}\n'
     'function runZero6(bp){const n=need(1);G.lvl=1;G.xp=0;G.need=n;G.lvlQ=0;if(bp)G.bpQ=0;G.briefQ=0;}\n'
     'function runRestore6(r){G.xp=r.xp;G.lvl=r.lvl;G.need=r.need;G.lvlQ=0;G.bpQ=0;}\n'
     "function runGrant6(k){if(k==='bp')G.bpQ++;else G.lvlQ++;}\n"
     "function runTake6(k){if(k==='bp')G.bpQ=Math.max(0,G.bpQ-1);else{G.lvlQ=Math.max(0,G.lvlQ-1);if(G.briefQ>0)G.briefQ--;}}\n"
     'function runQClear6(){G.lvlQ=0;G.briefQ=0;}\n')
out=('# ---------- 89b · этап 6 · граница «прокачка забега» ----------\n# Сгенерировано stage6/gen/gen89b.py (места — gen89b.js по AST 1.5.29).\n'
     'PRE89b=%r+END6%%\'89b\'\nS89b=%r\n'
     "STAGES['89b']=dict(vf='1.5.29 α',vt='1.5.30 α',J='m89b_journal.txt',pre=PRE89b,after='89',sites=S89b)\n")%(PRE,S)
open(os.path.join(D,'..','arch74_89b.py'),'w',encoding='utf8').write(out);print('ok',len(S))
