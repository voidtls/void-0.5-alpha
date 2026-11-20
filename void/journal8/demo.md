# Демонстрация: задачи разработчика на изолированной копии (ТЗ 17.6)

Сгенерировано `python3 tools8/demo8.py`. Копия дерева: временная папка `void/` (src, build, tools8, index, dist; эталон 1.5.35). Рабочее дерево проекта и опубликованная игра не менялись. HTML вручную не правился ни разу: правки — только в файлах `src/` и `build/manifest.json`, сборка — `build8 build`.

Исходная точка копии: `dist/void.html` SHA `b936a549366321b6` (= 1.5.35: True).

## Задача 1 (ТЗ 17.6 а). Найти все слои `toMenu` и их подсистемы

**Шаг 1.** Одна команда вместо поиска по 14 МБ HTML:

```
$ python3 tools8/build8.py where toMenu
toMenu: function, объявление src/js/ui/0400-fullscreen-choices-codex.js:82 [ui]
используется в 9 файлах (загрузка / из функций / запись · первое место):
  src/js/input/0410-input-touch.js:48  2 / 2 / 0
  src/js/world/1040-post-izmoroz-121.js:596  1 / 0 / 1
  src/js/mission/1050-chase-123.js:167  1 / 0 / 1
  src/js/ui/1140-menu-131.js:13  1 / 0 / 1
  src/js/dev/1200-workbench-145.js:98  1 / 0 / 1
  src/js/screens/0390-screens-base.js:46  0 / 1 / 0
  src/js/ui/0400-fullscreen-choices-codex.js:189  0 / 1 / 0
  src/js/dev/0430-dev-mission-select.js:54  0 / 1 / 0
  src/js/saves/0550-save-code.js:24  0 / 1 / 0
слоёв обёрток: 4 (в порядке установки; сигнатура e984a9ab47aad231):
  1. src/js/world/1040-post-izmoroz-121.js:596 [world] функция · блок верхнего уровня · класс 1 · безусловный хук
  2. src/js/mission/1050-chase-123.js:167 [mission] функция · блок верхнего уровня · класс 1 · безусловный хук
  3. src/js/ui/1140-menu-131.js:13 [ui] функция · блок верхнего уровня · класс 1 · безусловный хук
  4. src/js/dev/1200-workbench-145.js:98 [dev] функция · блок верхнего уровня · класс 1 · безусловный хук
# код выхода 0
```

**Шаги 2–4.** Слоёв 4, подсистемы по порядку установки: world → mission → ui → dev. Серия межподсистемная (ТЗ 9.1: post / chase / menu / dev) и не сливается. Порядок совпадает с эталоном `chains6.json` 1.5.35 (это проверяет `navcheck8`, критерий 17.5).

## Задача 2 (ТЗ 17.6 б). Изменить текст одного сообщения (тоста)

Цель: «Проверяю облачное сохранение…» → «Сверяю облачное сохранение…» (тост при проверке облака на входе в игру).

**Шаг 1. Найти:**

```
$ grep -rn "Проверяю облачное сохранение" src/js | cut -c1-140
src/js/saves/0560-cloud-save-100.js:49:function cloudGate(f){if(CLOUD.gateOff||CLOUD.state!=='init'){f();return;}CLOUD.waiters.length=0;CLOU
# код выхода 0
```

```
$ python3 tools8/build8.py where cloudGate
cloudGate: function, объявление src/js/saves/0560-cloud-save-100.js:49 [saves]
используется в 1 файлах (загрузка / из функций / запись · первое место):
  src/js/input/0410-input-touch.js:165  0 / 3 / 0
# код выхода 0
```

**Шаги 2–4.** Подсистема `saves`. Что запускать после правки — `index/TESTS.md`:

```
$ grep -n "| saves |" index/TESTS.md
26:| saves | save; regsave (q71save, q73save); st6; gkeys |
# код выхода 0
```

**Шаг 5. Изменить** одну строку одного файла:

```
$ sed -i 's/Проверяю облачное сохранение…/Сверяю облачное сохранение…/' src/js/saves/0560-cloud-save-100.js && grep -c 'Сверяю облачное' src/js/saves/0560-cloud-save-100.js
1
# код выхода 0
```

**Шаг 6. Собрать** и **шаг 8 до фиксации** — check указывает на незафиксированную часть:

```
$ python3 tools8/build8.py build
e8dbdbe7563c804a04352335fc84f1897dadb5d94077aaeb0b7218a8ac469f32  14099126 байт  dist/void.html
# код выхода 0
```

```
$ python3 tools8/build8.py check --quick
build8 check
  PASS   schema    189 частей
  PASS   files     187 файлов, лишних нет
  PASS   encoding  UTF-8 без BOM и \r
  PASS   assets    57 блоков: base64 декодируется, SHA = lock
  PASS   build     SHA e8dbdbe7563c804a, 14099126 байт, две сборки равны
  FAIL   lock      части изменены после lock (1): ['js/saves/0560-cloud-save-100.js']; SHA сборки e8dbdbe7563c804a ≠ lock b936a549366321b6
  PASS   dist      dist = сборка, PROVENANCE актуален
  FAIL   coverage  сборка ≠ эталону 1.5.35 (lock = 1.5.35): первое отличие на байте 833219 — в сборке часть js/saves/0560-cloud-save-100.js, в эталоне часть js/04-cloud.js; длина 14099126 / 14099130
  PASS   order     boot последний; страж неба обязателен, между CINE и BG; группы непрерывны, маркеры на краях
  PASS   guards    стражи ×1 без групп; ключей void_* 17; Math.random 373; запрещённого нет
  PASS   syntax    разбор acorn: полная и 3 вариантов
  PASS   init      чтений лексических имён до объявления при загрузке: полная: 0, cine: 0, bg: 0, cine+bg: 0
  KNOWN  dangle    cine: удалено имён 97, незащищённых ['c66Fail', 'c66Tick']; bg: удалено имён 57, незащищённых нет; зарегистрировано: cine → ['c66Fail', 'c66Tick'] (cut.cine.live)
ИТОГ: PASS 10 · KNOWN 1 · FAIL 2 · ERROR 0  (KNOWN — зарегистрированное отклонение, не PASS)
# код выхода 1
```

```
$ python3 tools8/build8.py lock --reason "демо: текст тоста облака"
lock: SHA e8dbdbe7563c804a04352335fc84f1897dadb5d94077aaeb0b7218a8ac469f32; изменено частей 1: ['js/saves/0560-cloud-save-100.js']
Напоминание: правка игры требует профильных тестов (index/TESTS.md) и полной приёмки перед выпуском; выполните index.
# код выхода 0
```

```
$ python3 tools8/build8.py check --quick
build8 check
  PASS   schema    189 частей
  PASS   files     187 файлов, лишних нет
  PASS   encoding  UTF-8 без BOM и \r
  PASS   assets    57 блоков: base64 декодируется, SHA = lock
  PASS   build     SHA e8dbdbe7563c804a, 14099126 байт, две сборки равны
  PASS   lock      части, манифест, инварианты и SHA = lock
  PASS   dist      dist = сборка, PROVENANCE актуален
  PASS   coverage  проверена только карта фазы A: 83 частей сплошь покрывают эталон 1.5.35, хэши верны. Сборка с эталоном НЕ сравнивалась: по lock она намеренно другая (e8dbdbe7563c804a)
  PASS   order     boot последний; страж неба обязателен, между CINE и BG; группы непрерывны, маркеры на краях
  PASS   guards    стражи ×1 без групп; ключей void_* 17; Math.random 373; запрещённого нет
  PASS   syntax    разбор acorn: полная и 3 вариантов
  PASS   init      чтений лексических имён до объявления при загрузке: полная: 0, cine: 0, bg: 0, cine+bg: 0
  KNOWN  dangle    cine: удалено имён 97, незащищённых ['c66Fail', 'c66Tick']; bg: удалено имён 57, незащищённых нет; зарегистрировано: cine → ['c66Fail', 'c66Tick'] (cut.cine.live)
ИТОГ: PASS 12 · KNOWN 1 · FAIL 0 · ERROR 0  (KNOWN — зарегистрированное отклонение, не PASS)
# код выхода 0
```

Меняется ровно одна часть (сверка эталона 1.5.35 с новой сборкой с начала и с конца):

```
$ python3 tools8/build8.py verify-html archive/void_1.5.35_reference.html
РАСХОДИТСЯ со сборкой: отличается 1 часть (байты файла 827253–834800; длина файла 14099130, сборки 14099126):
  js/saves/0560-cloud-save-100.js
Правку переносят в src/ (файлы выше), затем build и check. Итоговый HTML вручную не правят.
# код выхода 1
```

**Шаг 7. Проверка поведения в браузере:** вызвать настоящий `cloudGate` в состоянии «облако проверяется» и прочитать текст тоста.

```
текст тоста: 'Сверяю облачное сохранение…'; ошибок страницы: 0
```

**Откат:** вернуть строку и `lock` — SHA снова 1.5.35.

```
$ sed -i 's/Сверяю облачное сохранение…/Проверяю облачное сохранение…/' src/js/saves/0560-cloud-save-100.js && python3 tools8/build8.py lock --reason "демо: возврат текста тоста" | head -1
lock: SHA b936a549366321b63b8f0c6ac5a8c34013150cffac9ea584b71d3c09c7f4c034; изменено частей 1: ['js/saves/0560-cloud-save-100.js']
# код выхода 0
```

## Задача 3 (ТЗ 17.6 в). Добавить пробную запись данных в новую зону

Новый код — новый кусок в зоне «после 1.5.35»: в манифесте после BG и перед `boot`. Таблица `EDEF` к этому моменту создана; старые куски не трогаются.

Добавлены файл `src/js/enemies/1235-demo8-enemy.js` и запись в `build/manifest.json` перед `js/boot/…`:

```
$ cat src/js/enemies/1235-demo8-enemy.js
// ===== демо этапа 8: данные нового врага (у каждого врага свои данные и свои функции; общий обработчик не вводится) =====
EDEF.demo8={name:'Демо-8',hp:30,spd:60,r:12,xp:5,contact:10,col:'#ffd400',pts:50};
# код выхода 0
```

```
$ python3 tools8/build8.py build && python3 tools8/build8.py lock --reason "демо: враг demo8" | head -1
ec4fe830a6f5d3447d80afc6dff027e74438ff380862f82844b7fc2a57fd5bd3  14099427 байт  dist/void.html
lock: SHA ec4fe830a6f5d3447d80afc6dff027e74438ff380862f82844b7fc2a57fd5bd3; изменено частей 1: ['js/enemies/1235-demo8-enemy.js']
# код выхода 0
```

```
$ python3 tools8/build8.py check --quick
build8 check
  PASS   schema    190 частей
  PASS   files     188 файлов, лишних нет
  PASS   encoding  UTF-8 без BOM и \r
  PASS   assets    57 блоков: base64 декодируется, SHA = lock
  PASS   build     SHA ec4fe830a6f5d344, 14099427 байт, две сборки равны
  PASS   lock      части, манифест, инварианты и SHA = lock
  PASS   dist      dist = сборка, PROVENANCE актуален
  PASS   coverage  проверена только карта фазы A: 83 частей сплошь покрывают эталон 1.5.35, хэши верны. Сборка с эталоном НЕ сравнивалась: по lock она намеренно другая (ec4fe830a6f5d344)
  PASS   order     boot последний; страж неба обязателен, между CINE и BG; группы непрерывны, маркеры на краях
  PASS   guards    стражи ×1 без групп; ключей void_* 17; Math.random 373; запрещённого нет
  PASS   syntax    разбор acorn: полная и 3 вариантов
  PASS   init      чтений лексических имён до объявления при загрузке: полная: 0, cine: 0, bg: 0, cine+bg: 0
  KNOWN  dangle    cine: удалено имён 97, незащищённых ['c66Fail', 'c66Tick']; bg: удалено имён 57, незащищённых нет; зарегистрировано: cine → ['c66Fail', 'c66Tick'] (cut.cine.live)
ИТОГ: PASS 12 · KNOWN 1 · FAIL 0 · ERROR 0  (KNOWN — зарегистрированное отклонение, не PASS)
# код выхода 0
```

**Живая загрузка:** игра грузится, запись есть в таблице, бой идёт 2 с в настоящем цикле, ошибок нет.

```
{"demo8": "Демо-8", "state": "play", "simT": 1.98}; ошибок страницы: 0
```

Опровержение: тот же кусок поставлен в самое начало сборки (до объявления `EDEF`). Аудит инициализации обязан это поймать, а `lock` — отказать:

```
$ python3 tools8/build8.py lock --reason "демо: неверное место"
build8 check
  PASS   schema    190 частей
  PASS   files     188 файлов, лишних нет
  PASS   encoding  UTF-8 без BOM и \r
  PASS   assets    57 блоков: base64 декодируется, SHA = lock
  PASS   build     SHA 07ed1f429b01a97f, 14099427 байт, две сборки равны
… (ещё 10 строк)
# код выхода 1
```

```
$ python3 tools8/build8.py check --quick
build8 check
  PASS   schema    190 частей
  PASS   files     188 файлов, лишних нет
  PASS   encoding  UTF-8 без BOM и \r
  PASS   assets    57 блоков: base64 декодируется, SHA = lock
  PASS   build     SHA 07ed1f429b01a97f, 14099427 байт, две сборки равны
  FAIL   lock      manifest.json изменён после lock; SHA сборки 07ed1f429b01a97f ≠ lock ec4fe830a6f5d344
  PASS   dist      dist = сборка, PROVENANCE актуален
  PASS   coverage  проверена только карта фазы A: 83 частей сплошь покрывают эталон 1.5.35, хэши верны. Сборка с эталоном НЕ сравнивалась: по lock она намеренно другая (ec4fe830a6f5d344)
  PASS   order     boot последний; страж неба обязателен, между CINE и BG; группы непрерывны, маркеры на краях
  PASS   guards    стражи ×1 без групп; ключей void_* 17; Math.random 373; запрещённого нет
  PASS   syntax    разбор acorn: полная и 3 вариантов
  FAIL   init      полная: чтение let/const/class до объявления: [['EDEF', 'const', 2, 673]]; cine: чтение let/const/class до объявления: [['EDEF', 'const', 2, 673]]; bg: чтение let/const/class до объявления: [['EDEF', 'const', 2, 673]]; cine+bg: чтение let/const/class до объявления: [['EDEF', 'const', 2, 673]]
  KNOWN  dangle    cine: удалено имён 97, незащищённых ['c66Fail', 'c66Tick']; bg: удалено имён 57, незащищённых нет; зарегистрировано: cine → ['c66Fail', 'c66Tick'] (cut.cine.live)
ИТОГ: PASS 10 · KNOWN 1 · FAIL 2 · ERROR 0  (KNOWN — зарегистрированное отклонение, не PASS)
# код выхода 1
```

**Откат:** убрать кусок из манифеста и файл, `lock` — SHA снова 1.5.35.

```
$ python3 tools8/build8.py build >/dev/null && python3 tools8/build8.py lock --reason "демо: откат врага demo8" | head -1
lock: SHA b936a549366321b63b8f0c6ac5a8c34013150cffac9ea584b71d3c09c7f4c034; изменено частей 1: ['js/enemies/1235-demo8-enemy.js']
# код выхода 0
```

## Задача 4 (дополнительно). Найти код по строке из ошибки или профилировщика

В варианте сборки без CINE в настоящем цикле игра падает (зарегистрированный дефект cut.cine.live). Стек браузера даёт строку HTML. Вопрос разработчика: какой файл `src/` править и что ещё затронет правка.

```
$ python3 tools8/build8.py build --without cine --out /tmp/demo8_nocine.html | tail -1
b87cbf30752cbea5c88733ece12cf49fb1dda0167687cc8278a57ca5dc0a4425  14015070 байт  ../../demo8_nocine.html
# код выхода 0
```

Стек из variants8 для этой сборки: `ReferenceError: c66Fail is not defined at step74 (v_cine.html:1917:47)`. Строка 1917 относится к сборке без cine, а в ней вырезан и CSS cine выше скрипта, поэтому номера строк HTML сдвинуты относительно полной сборки. Переводим в номер строки скрипта: находим строку `<script>` основного скрипта в той же сборке.

```
$ grep -n '^<script>' /tmp/demo8_nocine.html | head -1
1766:<script>
# код выхода 0
```

```
строка скрипта = 1917 − 1766 + 1 = 152
```

```
$ python3 tools8/build8.py blame --script 152
скрипт 152 → src/js/loop/0040-arch72-76-clock-step-interp.js:28  [js, loop]
  │   if(ARCH.c66s){try{c66Tick(STEP74);}catch(e){c66Fail(e);}}/* ARCH·74 A-21 */}
# код выхода 0
```

Кто объявляет эти имена и кто ещё их использует (правка в одном месте не должна сломать другие):

```
$ python3 tools8/build8.py where c66Fail
c66Fail: function, объявление src/js/opt/cine/1210-cine-proto-151.js:447 [opt/cine]
используется в 2 файлах (загрузка / из функций / запись · первое место):
  src/js/opt/cine/1210-cine-proto-151.js:442  0 / 3 / 0
  src/js/loop/0040-arch72-76-clock-step-interp.js:28  0 / 1 / 0
# код выхода 0
```

```
$ python3 tools8/build8.py where step74
step74: function, объявление src/js/loop/0040-arch72-76-clock-step-interp.js:19 [loop]
используется в 1 файлах (загрузка / из функций / запись · первое место):
  src/js/loop/0040-arch72-76-clock-step-interp.js:35  0 / 1 / 0
# код выхода 0
```

Вывод разработчика: правка — в `src/js/loop/0040-arch72-76-clock-step-interp.js`, строка 28 (`step74`): вызов `c66Tick`/`c66Fail` без защиты `typeof`, а объявлены они только внутри `opt/cine`. По правилу 15.2 ТЗ ссылки на имена cine допустимы только через `typeof`. **В этапе 8 исправление не вносится** (изменило бы SHA): оформлено отдельной задачей `docs/FOLLOWUP_cut_cine_live.md`.

## Итог демонстрации

| Проверка | Результат |
|---|---|
| 1. toMenu: 4 слоя в world → mission → ui → dev | PASS |
| 2. check до lock ловит правку и называет часть | PASS |
| 2. check после lock зелёный (PASS + KNOWN cut.cine.live) | PASS |
| 2. отличается ровно одна часть | PASS |
| 2. в игре показан новый текст, ошибок нет | PASS |
| 2. откат возвращает SHA 1.5.35 | PASS |
| 3. аудит инициализации чист, check зелёный | PASS |
| 3. живая загрузка без ошибок, бой идёт | PASS |
| 3. кусок до EDEF: init FAIL, lock отказал | PASS |
| 3. откат возвращает SHA 1.5.35, check зелёный | PASS |
| 4. blame указывает на loop/…:28 (step74) | PASS |

**PASS**: 11 из 11.
