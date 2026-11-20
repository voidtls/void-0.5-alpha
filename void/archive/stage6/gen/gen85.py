# Генерирует stage6/arch74_85.py: места берутся из AST 1.5.24 (dump85.js → t85.json), текст объявлений не набирается вручную.
import json,os
D=os.path.dirname(os.path.abspath(__file__));T=json.load(open(os.path.join(D,'t85.json')))
assert T['nested']==0 and len(T['items'])==24 and len({t['name'] for t in T['items']})==23
sites=[]
for t in sorted(T['items'],key=lambda t:-(t['L']+t['R'])):  # с контекстом — первыми: их контекст захватывает соседние снимаемые тексты
    mark='/* ARCH·85 · снято недостижимое объявление %s (%d из %d; действует последнее объявление) */'%(t['name'],t['k'],t['of'])
    sites.append((t['pre']+t['text']+t['post'],t['pre']+mark+t['post']))
PRE=('/* ▼▼▼ ARCH·85 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.25 α · этап 7: недостижимые объявления)\n'
     '   Исполняемого кода нет. Сняты 24 объявления функций верхнего уровня (23 имени), которые перекрыты более поздним объявлением\n'
     '   того же имени: при подъёме объявлений имя связывается с последним, к прежним не ведёт ни одна ссылка. Вместо каждого — метка\n'
     '   «ARCH·85 · снято …». Имена: nearestEnemy (2), aimPt и 21 функция прежней версии сверхбосса 0.7.5 (s74Hurt, b74Hit, sb74*, nu*, fl*).\n'
     '   Итоговые объявления не лежат в вырезаемых тестами блоках CINE·PROTO / BG·PROTO. Откат — снятие патча 85. */\n')
out=('# ---------- 85 · этап 7 · недостижимые объявления ----------\n'
     '# Сгенерировано stage6/gen/gen85.py из AST 1.5.24 (SHA 76753e33…).\n'
     'PRE85=%r+END6%%85\nS85=%r\n'
     "STAGES['85']=dict(vf='1.5.24 α',vt='1.5.25 α',J='m85_journal.txt',pre=PRE85,after=84,sites=S85)\n")%(PRE,sites)
open(os.path.join(D,'..','arch74_85.py'),'w',encoding='utf8').write(out);print('ok',len(out),len(sites))
