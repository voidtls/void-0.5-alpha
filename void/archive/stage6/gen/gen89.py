# Генерирует stage6/arch74_89.py из stage6/gen/s89.json (gen89.js по 1.5.28).
import json,os
D=os.path.dirname(os.path.abspath(__file__));J=json.load(open(os.path.join(D,'s89.json')));S=[tuple(x) for x in J['sites']];assert len(S)==16
PRE=('/* ▼▼▼ ARCH·89 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.29 α · этап 6: идентичность объекта прогресса G.save)\n'
     '   Все 17 мест, где G.save получает другой объект, идут через saveSet6(S, класс) или saveWith6(S, fn). Класс (второй аргумент) —\n'
     '   метка для проверок: load (загрузка из хранилища/облака/выход из песочницы), new (новый или выбранный мир), import (код сохранения),\n'
     '   reset (полный сброс), temp (временная подмена), dev (песочница разработчика). Логики сверх присваивания нет.\n'
     '   Две временные подмены не восстанавливали прежний объект при исключении. doneCountS: единственный вызов (подпись главной кнопки\n'
     '   меню) передаёт текущее сохранение, поэтому видимой ошибки сейчас нет — правка защитная. devAct (режим разработчика, начисление\n'
     '   опыта пилоту вне песочницы): при исключении активным оставалось сохранение песочницы. Обе подмены теперь восстанавливаются в finally.\n'
     '   На обычном пути порядок действий прежний. Реестр мест и классов — tools6/ownership6.json (own6); ловушка устаревшего объекта — st6 saveid.\n'
     '   Откат — снятие патча 89. */\n'
     'function saveSet6(S,why){return G.save=S;}\n'
     'function saveWith6(S,fn){const k=G.save;G.save=S;try{return fn();}finally{G.save=k;}}\n')
out=('# ---------- 89 · этап 6 · saveSet6 / saveWith6: идентичность G.save ----------\n# Сгенерировано stage6/gen/gen89.py (места — gen89.js по AST 1.5.28).\n'
     'PRE89=%r+END6%%89\nS89=%r\n'
     "STAGES['89']=dict(vf='1.5.28 α',vt='1.5.29 α',J='m89_journal.txt',pre=PRE89,after='88',sites=S89)\n")%(PRE,S)
open(os.path.join(D,'..','arch74_89.py'),'w',encoding='utf8').write(out);print('ok',len(S))
