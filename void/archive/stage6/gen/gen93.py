# Генерирует stage6/arch74_93.py: версия, журнал, обновлённые комментарии границ (исполняемый код не меняется).
#   python3 stage6/gen/gen93.py <исходная сборка> <after> <vf> <vt>
import os,sys
D=os.path.dirname(os.path.abspath(__file__));h=open(sys.argv[1],encoding='utf8').read();after,vf,vt=sys.argv[2],sys.argv[3],sys.argv[4]
S=[("     зарегистрированные исключения: групповые сбросы Object.assign в setupMission0, startEndless, enterWorldAt (prio, aimLock — до этапа 6)\n"
    "     и ветка отката A-26 в updatePlayer (tg90, noTg75, aimLock — дословный прежний текст, до этапа 7). Шаг наведения — aimStep (ARCH·82).\n"
    "     Граница проверяется tools5/own5.js по tools5/ownership5.json.",
    "     зарегистрированные исключения: групповые сбросы раунда Object.assign в setupMission0, startEndless, enterWorldAt (prio, aimLock).\n"
    "     Ветка отката A-26 снята в ARCH·87 (1.5.27). Шаг наведения — aimStep (ARCH·82).\n"
    "     Граница проверяется tools6/own6.js по tools6/ownership6.json (группа targeting; прежде — tools5/own5.js)."),
   ("кроме aimPt и nearestEnemy, нет; итоговые aimPt и nearestEnemy по-прежнему ниже мёртвых копий).",
    "кроме aimPt и nearestEnemy, нет; мёртвые копии aimPt и nearestEnemy сняты в ARCH·85, 1.5.25)."),
   ("   A-26: window.__archOff=['A-26'] до загрузки — updatePlayer исполняет прежний встроенный текст (ветка отката, до этапа 7). */",
    "   A-26: флаг и ветка отката сняты в ARCH·87 (1.5.27); window.__archOff=['A-26'] больше ничего не меняет. */")]
for a,b in S:assert h.count(a)==1,a[:80]
PRE=('/* ▼▼▼ ARCH·93 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ ('+vt+' · этапы 6+7: итог)\n'
 '   Исполняемого кода нет. Границы владения полями G после этапа 6 (проверка — node tools6/own6.js по tools6/ownership6.json):\n'
 '     экраны      G.state                                   — только scr6 (ARCH·88); исключение — групповой сброс enterWorldAt;\n'
 '     прогресс    смена объекта G.save                      — только saveSet6 / saveWith6 (ARCH·89); содержимое G.save.* не ограничено;\n'
 '     прокачка    G.xp, lvl, need, lvlQ, bpQ, briefQ, briefN — только run*6 (ARCH·89b); исключения — сбросы раунда setupMission0, enterWorldAt (bpQ);\n'
 '     наведение   G.prio, aimLock, tg90, noTg75, aimWarn75  — подсистема ARCH·81 и prioSet / prioClear / aimLockClear; исключения — сбросы раунда.\n'
 '   Этап 7: сняты 24 недостижимых объявления (ARCH·85), 4 серии из 10 слоёв одной подсистемы слиты в 4 слоя (ARCH·86; 11 серий из слоёв разных подсистем оставлены раздельными), снята ветка A-26 (ARCH·87).\n'
 '   Оставшиеся цепочки переустановок перечислены с назначением и классом в tools6/chains6.json. Чтения полей G не ограничены:\n'
 '   G остаётся одним глобальным объектом — это границы записи, а не инкапсуляция. Откат — снятие патча 93. */\n')
out=('# ---------- 93 · этапы 6+7 · итог: версия, журнал, комментарии границ ----------\n# Сгенерировано stage6/gen/gen93.py.\n'
     'PRE93=%r+END6%%93\nS93=%r\n'
     "STAGES['93']=dict(vf=%r,vt=%r,J='m93_journal.txt',pre=PRE93,after=%r,sites=S93)\n")%(PRE,S,vf,vt,after)
open(os.path.join(D,'..','arch74_93.py'),'w',encoding='utf8').write(out);print('ok')
