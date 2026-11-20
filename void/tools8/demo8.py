#!/usr/bin/env python3
# VØID · этап 8 · demo8 — три задачи разработчика на ИЗОЛИРОВАННОЙ копии (ТЗ этапа 8, 15.1 и 17.6). Рабочее дерево и игра не меняются.
#   python3 tools8/demo8.py [--md ОТЧЁТ.md]
# Задачи ТЗ 17.6: (а) все слои toMenu и их подсистемы; (б) изменить текст одного тоста — меняется ровно одна часть, check зелёный, откат → SHA 1.5.35;
# (в) пробная запись данных в новую зону — аудит инициализации чист, живая загрузка без ошибок, откат (и опровержение: кусок не на своём месте ловится).
# Дополнительно (4): найти код по строке из ошибки — стек cut.cine.live → blame → where (без правки).
# Все команды запускаются по-настоящему; в отчёт попадает их реальный вывод и коды выхода.
import sys, os, json, shutil, subprocess, tempfile, asyncio, hashlib, re
TOOLS = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(TOOLS)
a = sys.argv[1:]; MD = a[a.index('--md') + 1] if '--md' in a else os.path.join(ROOT, 'results', 'demo8.md')
W35 = 'b936a549366321b63b8f0c6ac5a8c34013150cffac9ea584b71d3c09c7f4c034'
tmp = tempfile.mkdtemp(prefix='demo8_'); C = os.path.join(tmp, 'void')
out = ['# Демонстрация: задачи разработчика на изолированной копии (ТЗ 17.6)\n\n',
       'Сгенерировано `python3 tools8/demo8.py`. Копия дерева: временная папка `void/` (src, build, tools8, index, dist; эталон 1.5.35). ',
       'Рабочее дерево проекта и опубликованная игра не менялись. HTML вручную не правился ни разу: правки — только в файлах `src/` и `build/manifest.json`, сборка — `build8 build`.\n\n']
res = {}
def sh(cmd, show=True, cut=40):
    r = subprocess.run(cmd, cwd=C, capture_output=True, text=True, shell=isinstance(cmd, str))
    text = (r.stdout + r.stderr).rstrip('\n'); lines = text.split('\n')
    if len(lines) > cut: lines = lines[:cut] + ['… (ещё %d строк)' % (len(lines) - cut)]
    if show: out.append('```\n$ %s\n%s\n# код выхода %d\n```\n\n' % (cmd if isinstance(cmd, str) else ' '.join(cmd), '\n'.join(lines), r.returncode))
    return r.returncode, text
def say(t): out.append(t + '\n\n')
def sha(p): return hashlib.sha256(open(os.path.join(C, p), 'rb').read()).hexdigest()
B8 = 'python3 tools8/build8.py'
try:
    os.makedirs(C)
    for d in ('src', 'build', 'tools8', 'index', 'dist'): shutil.copytree(os.path.join(ROOT, d), os.path.join(C, d), symlinks=True)
    os.makedirs(os.path.join(C, 'archive')); shutil.copy2(os.path.join(ROOT, 'archive', 'void_1.5.35_reference.html'), os.path.join(C, 'archive'))
    say('Исходная точка копии: `dist/void.html` SHA `%s` (= 1.5.35: %s).' % (sha('dist/void.html')[:16], sha('dist/void.html') == W35))

    async def live(f, js):
        from playwright.async_api import async_playwright
        async with async_playwright() as pw:
            br = await pw.chromium.launch(args=['--no-sandbox']); pg = await br.new_page(); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)[:200])); pg.on('console', lambda m: errs.append('CON ' + m.text[:200]) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
            await pg.goto('file://' + f); await pg.wait_for_timeout(1500); t = await pg.evaluate(js); await br.close(); return t, errs
    FRESH = "localStorage.removeItem('void_world');startWorld(true);if(G.prologue)prologueEnd();"
    # ---------------------------------------------------------------- задача 1 (ТЗ 17.6 а)
    say('## Задача 1 (ТЗ 17.6 а). Найти все слои `toMenu` и их подсистемы\n\n**Шаг 1.** Одна команда вместо поиска по 14 МБ HTML:')
    rc, t = sh(B8 + ' where toMenu')
    lay = re.findall(r'^\s+\d+\. src/js/([^/]+)/\S+:(\d+) ', t, re.M)
    say('**Шаги 2–4.** Слоёв %d, подсистемы по порядку установки: %s. Серия межподсистемная (ТЗ 9.1: post / chase / menu / dev) и не сливается. Порядок совпадает с эталоном `chains6.json` 1.5.35 (это проверяет `navcheck8`, критерий 17.5).' % (len(lay), ' → '.join(d for d, _ in lay)))
    res['1. toMenu: 4 слоя в world → mission → ui → dev'] = [d for d, _ in lay] == ['world', 'mission', 'ui', 'dev']
    # ---------------------------------------------------------------- задача 2 (ТЗ 17.6 б)
    say('## Задача 2 (ТЗ 17.6 б). Изменить текст одного сообщения (тоста)\n\nЦель: «Проверяю облачное сохранение…» → «Сверяю облачное сохранение…» (тост при проверке облака на входе в игру).')
    say('**Шаг 1. Найти:**')
    sh('grep -rn "Проверяю облачное сохранение" src/js | cut -c1-140')
    sh(B8 + ' where cloudGate')
    say('**Шаги 2–4.** Подсистема `saves`. Что запускать после правки — `index/TESTS.md`:')
    sh('grep -n "| saves |" index/TESTS.md')
    say('**Шаг 5. Изменить** одну строку одного файла:')
    sh("sed -i 's/Проверяю облачное сохранение…/Сверяю облачное сохранение…/' src/js/saves/0560-cloud-save-100.js && grep -c 'Сверяю облачное' src/js/saves/0560-cloud-save-100.js")
    say('**Шаг 6. Собрать** и **шаг 8 до фиксации** — check указывает на незафиксированную часть:')
    sh(B8 + ' build')
    rc, t = sh(B8 + ' check --quick')
    res['2. check до lock ловит правку и называет часть'] = rc != 0 and 'js/saves/0560-cloud-save-100.js' in t
    sh(B8 + ' lock --reason "демо: текст тоста облака"')
    rc, t = sh(B8 + ' check --quick')
    res['2. check после lock зелёный (PASS + KNOWN cut.cine.live)'] = rc == 0 and 'FAIL 0' in t and 'ERROR 0' in t
    say('Меняется ровно одна часть (сверка эталона 1.5.35 с новой сборкой с начала и с конца):')
    rc, t = sh(B8 + ' verify-html archive/void_1.5.35_reference.html')
    res['2. отличается ровно одна часть'] = rc == 1 and re.findall(r'^  (\S+)$', t, re.M) == ['js/saves/0560-cloud-save-100.js']
    say('**Шаг 7. Проверка поведения в браузере:** вызвать настоящий `cloudGate` в состоянии «облако проверяется» и прочитать текст тоста.')
    t, errs = asyncio.run(live(os.path.join(C, 'dist', 'void.html'), "()=>{const s=CLOUD.state,g=CLOUD.gateOff;CLOUD.state='init';CLOUD.gateOff=false;cloudGate(()=>{});const t=document.getElementById('toastP').textContent;CLOUD.state=s;CLOUD.gateOff=g;CLOUD.waiters.length=0;return t;}"))
    out.append('```\nтекст тоста: %r; ошибок страницы: %d\n```\n\n' % (t, len(errs)))
    res['2. в игре показан новый текст, ошибок нет'] = 'Сверяю облачное' in t and not errs
    say('**Откат:** вернуть строку и `lock` — SHA снова 1.5.35.')
    sh("sed -i 's/Сверяю облачное сохранение…/Проверяю облачное сохранение…/' src/js/saves/0560-cloud-save-100.js && " + B8 + ' lock --reason "демо: возврат текста тоста" | head -1')
    res['2. откат возвращает SHA 1.5.35'] = sha('dist/void.html') == W35
    # ---------------------------------------------------------------- задача 3 (ТЗ 17.6 в)
    say('## Задача 3 (ТЗ 17.6 в). Добавить пробную запись данных в новую зону\n\nНовый код — новый кусок в зоне «после 1.5.35»: в манифесте после BG и перед `boot`. Таблица `EDEF` к этому моменту создана; старые куски не трогаются.')
    NEW = "// ===== демо этапа 8: данные нового врага (у каждого врага свои данные и свои функции; общий обработчик не вводится) =====\nEDEF.demo8={name:'Демо-8',hp:30,spd:60,r:12,xp:5,contact:10,col:'#ffd400',pts:50};\n"
    def add_part(where):
        m = json.load(open(os.path.join(C, 'build', 'manifest.json'), encoding='utf8'))
        ent = {'path': 'js/enemies/1235-demo8-enemy.js', 'kind': 'js', 'subsystem': 'enemies', 'origin': NEW.split('\n')[0], 'why': 'демо: данные нового врага'}
        m['parts'] = [x for x in m['parts'] if x.get('path') != ent['path']]
        if where != 'убрать':
            i = next(i for i, x in enumerate(m['parts']) if x.get('role') == 'boot') if where == 'перед boot' else next(i for i, x in enumerate(m['parts']) if x['kind'] == 'js')
            m['parts'].insert(i, ent); open(os.path.join(C, 'src', ent['path']), 'w', encoding='utf8').write(NEW)
        else: os.remove(os.path.join(C, 'src', ent['path']))
        json.dump(m, open(os.path.join(C, 'build', 'manifest.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1); open(os.path.join(C, 'build', 'manifest.json'), 'a').write('\n')
    add_part('перед boot')
    say('Добавлены файл `src/js/enemies/1235-demo8-enemy.js` и запись в `build/manifest.json` перед `js/boot/…`:')
    sh('cat src/js/enemies/1235-demo8-enemy.js')
    sh(B8 + ' build && ' + B8 + ' lock --reason "демо: враг demo8" | head -1')
    rc, t = sh(B8 + ' check --quick')
    res['3. аудит инициализации чист, check зелёный'] = rc == 0 and re.search(r'PASS\s+init', t) is not None
    say('**Живая загрузка:** игра грузится, запись есть в таблице, бой идёт 2 с в настоящем цикле, ошибок нет.')
    t, errs = asyncio.run(live(os.path.join(C, 'dist', 'void.html'), "async()=>{" + FRESH + "enterNode(1);startMission();const t0=G.t;await new Promise(r=>setTimeout(r,2000));return {demo8:EDEF.demo8&&EDEF.demo8.name,state:G.state,simT:+(G.t-t0).toFixed(2)};}"))
    out.append('```\n%s; ошибок страницы: %d\n```\n\n' % (json.dumps(t, ensure_ascii=False), len(errs)))
    res['3. живая загрузка без ошибок, бой идёт'] = t.get('demo8') == 'Демо-8' and t.get('state') == 'play' and t.get('simT', 0) > 1 and not errs
    say('Опровержение: тот же кусок поставлен в самое начало сборки (до объявления `EDEF`). Аудит инициализации обязан это поймать, а `lock` — отказать:')
    add_part('в начало'); sh(B8 + ' build >/dev/null', show=False)
    rc, t = sh(B8 + ' lock --reason "демо: неверное место"', cut=6)
    rc2, t2 = sh(B8 + ' check --quick')
    res['3. кусок до EDEF: init FAIL, lock отказал'] = rc != 0 and rc2 != 0 and re.search(r'FAIL\s+init', t2) is not None
    say('**Откат:** убрать кусок из манифеста и файл, `lock` — SHA снова 1.5.35.')
    add_part('убрать'); sh(B8 + ' build >/dev/null && ' + B8 + ' lock --reason "демо: откат врага demo8" | head -1')
    rc, t = sh(B8 + ' check --quick', show=False)
    res['3. откат возвращает SHA 1.5.35, check зелёный'] = sha('dist/void.html') == W35 and rc == 0

    # ---------------------------------------------------------------- задача 4 (дополнительно)
    say('## Задача 4 (дополнительно). Найти код по строке из ошибки или профилировщика\n\nВ варианте сборки без CINE в настоящем цикле игра падает (зарегистрированный дефект cut.cine.live). Стек браузера даёт строку HTML. Вопрос разработчика: какой файл `src/` править и что ещё затронет правка.')
    shutil.rmtree(C); os.makedirs(C)
    for d in ('src', 'build', 'tools8', 'index', 'dist'): shutil.copytree(os.path.join(ROOT, d), os.path.join(C, d), symlinks=True)
    os.makedirs(os.path.join(C, 'archive')); shutil.copy2(os.path.join(ROOT, 'archive', 'void_1.5.35_reference.html'), os.path.join(C, 'archive'))
    sh(B8 + ' build --without cine --out /tmp/demo8_nocine.html | tail -1')
    say('Стек из variants8 для этой сборки: `ReferenceError: c66Fail is not defined at step74 (v_cine.html:1917:47)`. Строка 1917 относится к сборке без cine, а в ней вырезан и CSS cine выше скрипта, поэтому номера строк HTML сдвинуты относительно полной сборки. Переводим в номер строки скрипта: находим строку `<script>` основного скрипта в той же сборке.')
    rc, t = sh("grep -n '^<script>' /tmp/demo8_nocine.html | head -1")
    m = re.match(r'(\d+):', t); open_line = int(m.group(1)) if m else 0; sline = 1917 - open_line + 1
    out.append('```\nстрока скрипта = 1917 − %d + 1 = %d\n```\n\n' % (open_line, sline))
    sh(B8 + ' blame --script %d' % sline)
    rc, t = sh(B8 + ' blame --script %d' % sline, show=False)
    res['4. blame указывает на loop/…:28 (step74)'] = 'js/loop/0040-arch72-76-clock-step-interp.js:28' in t
    say('Кто объявляет эти имена и кто ещё их использует (правка в одном месте не должна сломать другие):')
    sh(B8 + ' where c66Fail'); sh(B8 + ' where step74')
    say('Вывод разработчика: правка — в `src/js/loop/0040-arch72-76-clock-step-interp.js`, строка 28 (`step74`): вызов `c66Tick`/`c66Fail` без защиты `typeof`, а объявлены они только внутри `opt/cine`. По правилу 15.2 ТЗ ссылки на имена cine допустимы только через `typeof`. **В этапе 8 исправление не вносится** (изменило бы SHA): оформлено отдельной задачей `docs/FOLLOWUP_cut_cine_live.md`.')
    os.remove('/tmp/demo8_nocine.html')
finally:
    shutil.rmtree(tmp, ignore_errors=True)
ok = all(res.values())
out.append('## Итог демонстрации\n\n| Проверка | Результат |\n|---|---|\n' + ''.join('| %s | %s |\n' % (k, 'PASS' if v else 'FAIL') for k, v in res.items()))
out.append('\n**%s**: %d из %d.\n' % ('PASS' if ok else 'FAIL', sum(res.values()), len(res)))
os.makedirs(os.path.dirname(os.path.abspath(MD)), exist_ok=True); open(MD, 'w', encoding='utf8').write(''.join(out))
print('demo8:', 'PASS' if ok else 'FAIL', res); sys.exit(0 if ok else 1)
