# Генерирует stage6/arch74_88.py из stage6/gen/s88.json (gen88.js по 1.5.27).
import json,os
D=os.path.dirname(os.path.abspath(__file__));S=[tuple(x) for x in json.load(open(os.path.join(D,'s88.json')))];assert len(S)==41
PRE=('/* ▼▼▼ ARCH·88 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.28 α · этап 6: переходы экранов через одну точку записи)\n'
     '   Все 41 прямая запись G.state в 38 функциях заменены вызовом scr6(X). Логики сверх присваивания нет: scr6 возвращает присвоенное\n'
     '   значение, как выражение присваивания; во всех местах оно стояло отдельным оператором, X вычисляется до записи, как и раньше.\n'
     '   Зарегистрированные исключения (пишут G.state не через scr6): литерал G (начальное «menu») и групповой сброс Object.assign в enterWorldAt\n'
     '   (state:\'world\' вместе с полями раунда). Допустимые переходы и правило «писать только через scr6» — tools6/ownership6.json (own6, st6 trans).\n'
     '   Откат — снятие патча 88. */\n'
     'function scr6(to){return G.state=to;}\n')
out=('# ---------- 88 · этап 6 · scr6: единая точка записи G.state ----------\n# Сгенерировано stage6/gen/gen88.py (места — gen88.js по AST 1.5.27).\n'
     'PRE88=%r+END6%%88\nS88=%r\n'
     "STAGES['88']=dict(vf='1.5.27 α',vt='1.5.28 α',J='m88_journal.txt',pre=PRE88,after='87',sites=S88)\n")%(PRE,S)
open(os.path.join(D,'..','arch74_88.py'),'w',encoding='utf8').write(out);print('ok',len(S))
