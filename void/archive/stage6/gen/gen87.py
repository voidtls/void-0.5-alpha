# Генерирует stage6/arch74_87.py: ветка отката A-26 снимается дословно (тексты берутся из сборки 1.5.26 и проверяются).
import os,sys,re
D=os.path.dirname(os.path.abspath(__file__));h=open(sys.argv[1],encoding='utf8').read()
a=h.index("  let tg;if(ARCH.a26)tg=aimStep(p,dt,man);/* ARCH·82: шаги 4–12 — в подсистеме наведения */\n  else{/* ARCH·82 · откат A-26")
b=h.index("  p.fireT-=dt;\n  const shoot=ARCH.a26?autoFireWanted(man,tg)",a)
old1=h[a:b];assert h.count(old1)==1 and old1.count('else{/* ARCH·82 · откат A-26')==1 and old1.endswith('dt*14);}\n')
new1="  const tg=aimStep(p,dt,man);/* ARCH·82: шаги 4–12 — в подсистеме наведения · ARCH·87: ветка отката A-26 снята (1.5.27) */\n"
s2=re.search(r"  const shoot=ARCH\.a26\?autoFireWanted\(man,tg\):\(man\?\(MOUSE\.down\|\|G\.enemies\.some\(e=>targetable\(e\)&&!NOAUTO\.has\(e\.type\)\)\):!!tg\);/\* ARCH·82 \*/",h)
old2=s2.group(0);new2="  const shoot=autoFireWanted(man,tg);/* ARCH·82 · ARCH·87 */"
old3="ARCH.a26=!ARCH.off['A-26'];\n";new3="/* ARCH·87: флаг A-26 снят вместе с веткой отката (1.5.27); window.__archOff=['A-26'] больше ничего не меняет */\n"
for o in (old1,old2,old3):assert h.count(o)==1,o[:80]
# во всей функции updatePlayer после правки tg больше не присваивается (проверка на тексте итогового объявления)
i=h.rindex('\nfunction updatePlayer(',0,a);j=h.index('\nfunction ',a+10);body=h[i:j].replace(old1,new1)
assert not re.search(r'(?<![\w.])tg\s*=(?!=)',body.replace('const tg=aimStep','')),'tg присваивается ещё где-то'
sites=[(old1,new1),(old2,new2),(old3,new3)]
PRE=('/* ▼▼▼ ARCH·87 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.27 α · этап 7: снята ветка отката A-26)\n'
     '   Исполняемого кода нет. В updatePlayer удалён прежний встроенный текст шагов наведения (ветка отката A-26, ARCH·82) и выбор\n'
     '   стрельбы по флагу; шаги наведения выполняет только aimStep / autoFireWanted. Владелец подтвердил работу 1.5.24 (решение Р1).\n'
     '   Откат — снятие патча 87 (вернёт ветку и флаг A-26). */\n')
out=('# ---------- 87 · этап 7 · снятие ветки отката A-26 ----------\n# Сгенерировано stage6/gen/gen87.py по 1.5.26.\n'
     'PRE87=%r+END6%%87\nS87=%r\n'
     "STAGES['87']=dict(vf='1.5.26 α',vt='1.5.27 α',J='m87_journal.txt',pre=PRE87,after='86',sites=S87)\n")%(PRE,sites)
open(os.path.join(D,'..','arch74_87.py'),'w',encoding='utf8').write(out);print('ok',len(old1))
