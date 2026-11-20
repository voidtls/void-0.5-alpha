# Генерирует stage6/arch74_90a.py, arch74_90b.py, arch74_91.py, arch74_92.py — FPS 30 / 60 / без ограничения.
# Все якоря проверяются на исходной сборке (1.5.30 для 90a) и должны встречаться ровно один раз.
import os,sys
D=os.path.dirname(os.path.abspath(__file__))
def chk(h,pairs):
    for a,b in pairs:
        assert h.count(a)==1,('якорь',h.count(a),a[:100])
OLDGATE="if(isMob()&&SET.fps===30&&now-last<29&&now>=last){requestAnimationFrame(frame);return;}"
F74="function frame74(now){\n  "+OLDGATE
S90a=[
 # 1. ключи настроек (по классу устройства) и допустимые значения
 (",shake:1,noErase:false,lessFx:false};",",shake:1,noErase:false,lessFx:false,fpsCap:0,fpsCapD:0};/* ARCH·90a: fpsCap — телефон/планшет, fpsCapD — ПК; 0 — без ограничения */"),
 ("quality:['auto',0,1,2],fps:[60,30],textScale:","quality:['auto',0,1,2],fps:[60,30],fpsCap:[30,60,0],fpsCapD:[30,60,0],textScale:"),
 # 2. разовое выведение из старого ключа fps для сохранённых до 1.5.31 настроек (до проверки по SET_OPT, без записи в хранилище)
 ("return v&&typeof v==='object'&&!Array.isArray(v)?v:{};})());\n",
  "return v&&typeof v==='object'&&!Array.isArray(v)?v:{};})());\n{const v=store('void_settings');if(!(v&&typeof v==='object'&&!Array.isArray(v)&&'fpsCap' in v))SET.fpsCap=SET.fps===30?30:0;}/* ARCH·90a: прежний «30» — предел на телефоне, прежний «60» — предела не было */\n"),
 # 3. три кнопки (при A-27 выкл. — прежние две)
 ("fps:[['КАДРЫ',[[60,'60'],[30,'30']]]]","fps:[['КАДРЫ',ARCH.fc27?[[30,'30'],[60,'60'],[0,'БЕЗ ОГРАНИЧЕНИЯ']]:[[60,'60'],[30,'30']]]]"),
 # 4. подсветка выбранной кнопки сегмента fps — по ключу своего класса устройства
 ("String(SET[k])===String(v)","String(k==='fps'&&ARCH.fc27?fpsCur27():SET[k])===String(v)"),
 # 5. нажатие кнопки сегмента fps
 ("opts=SET_OPT[k];if(!opts)return;","opts=SET_OPT[k];if(!opts)return;if(k==='fps'&&ARCH.fc27){fpsPick27(raw);return;}/* ARCH·90a */"),
 # 6. пояснение строки
 ("fps:'30 кадров — дольше держит батарея, 60 — плавнее.'","fps:ARCH.fc27?'30 — дольше держит батарея. 60 — ровно 60 кадров. Без ограничения — сколько успевает экран (прежний режим «60»). Скорость игры одинаковая.':'30 кадров — дольше держит батарея, 60 — плавнее.'"),
 # 7. планировщик кадров — первая строка frame74 (старый frame() не меняется)
 (F74,"function frame74(now){\n  if(ARCH.fc27){if(!gate27(now)){requestAnimationFrame(frame);return;}}else "+OLDGATE+"/* ARCH·90a A-27 */"),
]
PRE90a=('/* ▼▼▼ ARCH·90a · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.31 α · FPS: 30 / 60 / без ограничения)\n'
 '   A-27 · предел частоты обработанных кадров. Решает только, обрабатывать ли очередной вызов rAF; игровой шаг остаётся 1/60 (STEP74),\n'
 '   накопитель ACC74 и MAXN74 не меняются, глобальный requestAnimationFrame не подменяется. Срок следующего кадра накапливается\n'
 '   (FC27.next += T), поэтому средняя частота точная на любом экране (30.00 / 60.00 на 60–240 Гц), а не «каждый N-й кадр».\n'
 '   Допуск — половина периода экрана (оценка по интервалам rAF), но не больше половины периода предела. Провал больше 2T (фон, зависание)\n'
 '   или скачок времени назад сбрасывает срок — без всплеска кадров после возврата. Настройки: SET.fpsCap (телефон/планшет, isMob()) и\n'
 '   SET.fpsCapD (ПК) — независимы, значения 30 / 60 / 0 (без ограничения). Старый ключ fps синхронизируется при выборе на телефоне\n'
 '   (30 → 30, иначе 60): при откате на прежнюю версию телефон ведёт себя как выбрано. Сохранённые до 1.5.31 настройки: fps 30 → fpsCap 30,\n'
 '   fps 60 → 0 (прежний «60» не ограничивал частоту). Выключение: window.__archOff=[\'A-27\'] до загрузки — прежнее условие пропуска и\n'
 '   прежние две кнопки. Старый frame() (A-20 выкл.) не тронут. Откат — снятие патча 90a. */\n'
 "ARCH.fc27=!ARCH.off['A-27'];const FC27={last:0,next:0,disp:0};\n"
 'function fpsCur27(){return isMob()?SET.fpsCap:SET.fpsCapD;}\n'
 'function fpsCap27(){if(!ARCH.fc27)return 0;const c=fpsCur27();return c===30||c===60?c:0;}\n'
 'function gate27(now){const cap=fpsCap27();\n'
 '  if(FC27.last){const d=now-FC27.last;if(d>0&&d<100)FC27.disp=FC27.disp?FC27.disp+(d-FC27.disp)*.1:d;}FC27.last=now;\n'
 '  if(cap<=0){FC27.next=0;return true;}\n'
 '  const T=1000/cap,tol=Math.min(T*.5,Math.max(1,FC27.disp*.5));\n'
 '  if(!FC27.next||now<FC27.next-4*T||now-FC27.next>2*T){FC27.next=now+T;return true;}\n'
 '  if(now<FC27.next-tol)return false;\n'
 '  FC27.next+=T;return true;}\n'
 "function fpsPick27(raw){const v=[30,60,0].find(o=>String(o)===raw);if(v===undefined)return;const mob=isMob();SET[mob?'fpsCap':'fpsCapD']=v;if(mob)SET.fps=v===30?30:60;\n"
 "  saveSet();applySettings();renderSetScreen();buzz('tap');}\n")
L63="for(const s of ['zoom','quality','fps']){const el=B.querySelector(`[data-seg=\"${s}\"]`);if(!el)continue;if(desk){const r=rowOf(el);used.add(r);r.remove();}else put('scr',el,s);}"
S90b=[(L63,"for(const s of ['zoom','quality','fps']){const el=B.querySelector(`[data-seg=\"${s}\"]`);if(!el)continue;if(desk&&!(s==='fps'&&ARCH.fc27)){const r=rowOf(el);used.add(r);r.remove();}else put('scr',el,s);}/* ARCH·90b: «КАДРЫ» — и на ПК */")]
PRE90b=('/* ▼▼▼ ARCH·90b · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.32 α · FPS: строка «КАДРЫ» на ПК)\n'
 '   Исполняемого кода нет. layout63 больше не убирает строку «КАДРЫ» на ПК (при A-27 вкл.); «МАСШТАБ» и «КАЧЕСТВО» на ПК скрыты, как раньше.\n'
 '   Решение владельца Р2; ожидание теста L03 (kit/q310.py) обновлено по его тексту. Откат — снятие патча 90b. */\n')
S91=[
 ("if(avg>1/50&&G.q>0){G.q--;qChg=now;qGood=0;qApply();}\n  else if(avg<1/83){","if(avg>qDn27()&&G.q>0){G.q--;qChg=now;qGood=0;qApply();}/* ARCH·91 */\n  else if(avg<qUp27()){"),
 ("  ARCH.n74=n;const dt=live74()?dt0*ARCH.sc74:dt0;\n  if(dt>0)fpsAvg+=(1/dt-fpsAvg)*.05;\n  if(G.mode==='endless'&&G.state==='play'&&!G.lowFx){G.fpsLow=dt>1/40?",
  "  ARCH.n74=n;const dt=live74()?dt0*ARCH.sc74:dt0;\n  if(dt>0)fpsAvg+=(1/dt-fpsAvg)*.05;\n  if(G.mode==='endless'&&G.state==='play'&&!G.lowFx){G.fpsLow=dt>fpsLowT27()?"),
]
PRE91=('/* ▼▼▼ ARCH·91 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.33 α · FPS: предел кадров не снижает качество сам по себе)\n'
 '   Автокачество (qTick) и облегчённые эффекты бесконечного режима (fpsLow в frame74) судят о нехватке производительности по\n'
 '   интервалу между обработанными кадрами. При пределе 30 этот интервал ≈ 1/30 с — больше прежних порогов 1/50 и 1/40, и качество\n'
 '   падало без всякой нагрузки. Теперь пороги учитывают ожидаемый интервал предела E = 1/cap: снижение — при среднем > max(1/50, 1.2·E),\n'
 '   fpsLow — при кадре > max(1/40, 1.2·E), повышение — при среднем < max(1/83, 1.05·E). Без предела (cap 0) и при A-27 выкл. пороги прежние.\n'
 '   Настоящая перегрузка (кадр заметно дольше предела) по-прежнему снижает качество. Старый frame() не тронут. Откат — снятие патча 91. */\n'
 'function qDn27(){const c=fpsCap27();return c>0?Math.max(1/50,1.2/c):1/50;}\n'
 'function qUp27(){const c=fpsCap27();return c>0?Math.max(1/83,1.05/c):1/83;}\n'
 'function fpsLowT27(){const c=fpsCap27();return c>0?Math.max(1/40,1.2/c):1/40;}\n')
S92=[("const was=IP76.act;IP76.act=IP76.act?IP76.ema<STEP74*.9:IP76.ema<STEP74*.8;","const was=IP76.act;IP76.act=IP76.act?IP76.ema<STEP74*.9||ip27fast():IP76.ema<STEP74*.8||ip27fast();/* ARCH·92 */")]
PRE92=('/* ▼▼▼ ARCH·92 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.34 α · FPS: интерполяция A-23 при пределе на быстром экране)\n'
 '   A-23 включалась по средней длине обработанного кадра (< 0.8 шага). При пределе 60 на экране 75–240 Гц средний кадр ≈ шагу, и\n'
 '   интерполяция выключалась, хотя кадры показываются на неравномерной сетке экрана. Теперь она включается и тогда, когда действует\n'
 '   предел, а период самого экрана (оценка gate27) меньше 0.8 шага. Симуляция не меняется: A-23 сдвигает только отрисовку и возвращает\n'
 '   позиции после кадра. Принято по измерению fps6 (неравномерность отрисованного движения). Откат — снятие патча 92 или A-23 / A-27. */\n'
 'function ip27fast(){return fpsCap27()>0&&FC27.disp>0&&FC27.disp<STEP74*800;}\n')
def w(key,vf,vt,pre,after,sites,J):
    out=('# ---------- %s · FPS ----------\n# Сгенерировано stage6/gen/gen90.py.\n'
         'PRE_=%r+END6%%%r\nS_=%r\n'
         "STAGES[%r]=dict(vf=%r,vt=%r,J=%r,pre=PRE_,after=%r,sites=S_)\n")%(key,pre,key,sites,key,vf,vt,J,after)
    open(os.path.join(D,'..','arch74_%s.py'%key),'w',encoding='utf8').write(out)
if __name__=='__main__':
    h=open(sys.argv[1],encoding='utf8').read();chk(h,S90a)
    w('90a','1.5.30 α','1.5.31 α',PRE90a,'89b',S90a,'m90a_journal.txt')
    w('90b','1.5.31 α','1.5.32 α',PRE90b,'90a',S90b,'m90b_journal.txt')
    w('91','1.5.32 α','1.5.33 α',PRE91,'90b',S91,'m91_journal.txt')
    w('92','1.5.33 α','1.5.34 α',PRE92,'91',S92,'m92_journal.txt')
    print('ok')
