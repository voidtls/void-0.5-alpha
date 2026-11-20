// ===================== 0.5 «Не дайте ему вспомнить»: сюжет =====================
const FRAG_SHIFT=20,FRAG_SHIFT_MAX=300,EROSION_FULL=25000;
const STORY_OFF={};
// [№, сектор(0..10), корпус, подпись, текст, текст цикла II+ (необяз.)]
const STORY_W=[
[1,0,'base','«ИНЕЙ-4» · ЗАПИСЬ 112','Мы приняли сигнал за маяк и шли на свет. Поняли слишком поздно: он светил не нам.','Мы приняли сигнал за маяк и шли на свет. Поняли слишком поздно: он светил тебе.'],
[2,0,'base','ПИЛОТ СОРЕЛЬ','Разведчики почти не стреляют. Они считают. Каждый наш манёвр куда-то уходит — к ядру.'],
[3,0,'base','ИНЖЕНЕР ВАРГА','Заряды Стража — не броня, а предохранители. Не понимаю только, кого они предохраняют.'],
[4,1,'base','ПОГРАНИЧНЫЙ БУЙ','Ворота держат два замка. Ставили их не мы. Открываются только тем, кто прошёл ядро.'],
[5,1,'base','СМОТРИТЕЛЬ «ГОРИЗОНТА»','Маяк не гаснет. Он просто перестал быть нужен — некому было слушать.'],
[6,1,'base','ПОСЛЕДНЯЯ ЗАПИСЬ СТАНЦИИ','Глушитель — не корабль. Это тишина, которой придали форму. Если ты это слышишь, значит, у тебя получилось.'],
[7,2,'base','АРХИВАРИУС «ХОЛОДНОГО АРХИВА»','Каталог: 41 цивилизация. Все изобрели одно и то же. Все записаны одним почерком.'],
[8,2,'base','КОЛОНИСТКА ИДА РЕН','Я пишу имена на корпусе гвоздём. Металл помнит дольше, чем люди.'],
[9,2,'guard','СТРАЖ-4 · ЖУРНАЛ ОТКАЗОВ','Запрос: объяснить объекту 013 причину. Отказано. Причина засекречена создателем.'],
[10,3,'base','VØID-013 · ЦИКЛ 31','Страж не добил меня. Сказал: «Опять рано». Что значит — опять?'],
[11,3,'base','ТЕХНИК А. ЛОРАН','Мой сын был в списке колонии «Тихая». Сегодня списка нет. Почему я до сих пор помню, что он был?','Не помню, был ли у меня сын. Почерк в журнале мой.'],
[12,3,'base','АВТОМАТ «ОБОД» · КОПИЯ ЛОГА','Клиент 013. Посещений: 4 102. Износ корпуса при поступлении: всегда 12%.','@obod'],
[13,4,'base','ЗАПИСЬ ЧУЖОГО ВИДА · ПЕРЕВОД НЕПОЛНЫЙ','Мы сохранили наших мёртвых. Цена — наши нерождённые.'],
[14,4,'base','УЧЁНАЯ ТАЛА ОШ','Предел — не в технологиях. В пространстве есть место только для конечного числа историй.'],
[15,5,'base','ФЛАГМАН «ПОСЛЕДНИЙ ДОВОД»','Флот вышел против Стражей. Стражи стреляли по двигателям, не по рубкам. Мы не поняли этой милости.'],
[16,5,'falcon','КУРСАНТ ТЕО','Мама обещала встретить в порту. Порта нет на картах. Мамы — в списках.'],
[17,6,'base','«АВРОРА-2» · НОМЕР НЕ ВЫДАН','Нас ещё не построили. Верфь заложит киль через сорок лет.'],
[18,6,'pulsar','VØID-012 · ЦИКЛ 1','Последний перед тобой. Если ты здесь, моя попытка тоже засчитана.'],
[19,6,'hornet','VØID-005 · ЦИКЛ 12','Собрал себя из трёх чужих корпусов. Один из них ещё не построен.'],
[20,6,'prism','VØID-009 · ЦИКЛ 140','В архиве есть запись о моей смерти. Датирована завтрашним днём.'],
[21,6,'base','ПАССАЖИРКА БЕЗ ДАТЫ','В моих документах дата рождения — через двести лет. А я уже старая.'],
[22,6,'base','@next','Этот корпус — мой. Номер цикла — следующий после твоего.'],
[23,6,'guard','СТРАЖ-19','Мы помним предыдущие прохождения. Он — нет. Так задумано.','@s19'],
[24,6,'base','МИРА СЕН · ЗАПИСЬ А','Не пиши его имя целиком. Если система увидит его полностью, она вспомнит за него.'],
[25,7,'guard','СБОРОЧНЫЙ УЗЕЛ СТРАЖЕЙ','Протокол 0: держать границу. Протокол 1: не объяснять. Подпись: Э. В.'],
[26,7,'guard','СТРАЖ-0 · ПЕРВАЯ ЗАПИСЬ','Меня собрали, чтобы я остановил того, кто меня собрал. Он попросил об этом сам.'],
[27,7,'base','НЕИЗВЕСТНЫЙ ПИЛОТ','Гвардия стоит лицом не к нам. Мы долго не понимали, от чего она нас загораживает.'],
[28,7,'base','ИНЖЕНЕР БЮРО «ПРЕДЕЛ» КОРВИН','Мы дали им щиты спереди, а не сзади. Сзади у них то, что они охраняют.'],
[29,7,'guard','СПИСАННЫЙ СТРАЖ С-0/41','Меня списали за один вопрос: «Почему мы защищаем его от него самого?»'],
[30,7,'manta','VØID-006 · ЦИКЛ 413','Отпустил троих. Один вернулся и встал между мной и Стражем.'],
[31,7,'falcon','VØID-004 · ЦИКЛ 902','Страж-0 назвал моё имя. Я его не запомнил. Он сказал: «Так и должно быть».'],
[32,7,'guard','СТРАЖ-11','Объект 013 снова у границы. Напоминание всем узлам: не дайте ему вспомнить.','@s11'],
[33,7,'base','ИСПЫТАТЕЛЬНИЦА БЮРО «ПРЕДЕЛ» АДА МЭЙ','Первый страж открыл глаза и прицелился в того, кто стоял рядом. Тот улыбнулся и сказал: «Хорошо».'],
[34,7,'obsidian','VØID-010 · ЦИКЛ 51','Спрятался в тени конвейера. Они нашли меня по тому, чего во мне нет.'],
[35,7,'reaper','МИРА СЕН · ЗАПИСЬ Б','Мы назвали его Ковчегом. Ковчег берёт с собой не всех. Мы знали это с первого дня.','Мы назвали его Ковчегом. Ковчег берёт с собой всех, кого мы помним.'],
[36,8,'base','ГРУЗОВОЙ ДРОН Т-9','Пиявки пришли после третьей вспышки. Металл им не нужен. Они не едят свет — они несут его обратно.'],
[37,8,'base','СМОТРИТЕЛЬ КОВЧЕГА · ВАХТА 9','Счётчик историй сегодня показал минус одну. Я записал. Через час не мог вспомнить какую.','Счётчик показал минус две. Вчера было минус одна. Или это было в другой раз.'],
[38,8,'base','СОХРАНЁННАЯ · ЛИА, 9 ЛЕТ','Здесь тепло и тихо. Мне сказали, что снаружи тоже кто-то был. Я их не помню.'],
[39,8,'sail','VØID-003 · ЦИКЛ 1200','Сердце Ковчега бьётся ровно. Каждый удар — чей-то мир.'],
[40,8,'prism','VØID-009 · ЦИКЛ 990','Видел его. Он старше всех звёзд вокруг. Он улыбнулся так, как улыбаюсь я.'],
[41,8,'base','Э. В.','Каждая копия знает кусок. Ни одна — целое. Целое делает тебя частью машины.'],
[42,8,'base','МИРА СЕН · ЗАПИСЬ В','Ковчег спасает всех. Я проверяла. Никто не исчез. Никто.'],
[43,8,'base','ОПЕРАТОР КОНТУРА «УДЕРЖАНИЕ»','Сегодня удержали двенадцать систем. Сколько стёрли — не знаю. Нам не показывают вторую колонку.','@op'],
[44,8,'base','Н.','Ты думаешь, я тебя веду. Я просто иду первым. Я всегда шёл первым.','Ты думаешь, я тебя веду. В прошлый раз ты думал так же.'],
[45,8,'reaper','VØID-011 · ЦИКЛ 9','Я забрал всё, что лежало вокруг. Стал сильнее. Пришли все Стражи сразу.'],
[46,9,'base','БОРТОВОЙ ЖУРНАЛ БЕЗ ВЛАДЕЛЬЦА','[ЗАПИСЬ УДАЛЕНА ВМЕСТЕ С ВЛАДЕЛЬЦЕМ]'],
[47,9,'halo','VØID-002 · ЦИКЛ 2','Мы, первая серия, помнили всё. Каждое воспоминание откусывало кусок берега.'],
[48,9,'obsidian','VØID-010 · ЦИКЛ 777','За берегом не пустота. Там всё, чего не случилось. Оно смотрит.'],
[49,9,'base','МИРА СЕН · ЗАПИСЬ Г','Я — та Мира, которой не было. Меня сохранили по ошибке. Спасибо.','Я — та Мира, которой не было. В этот раз меня тоже не будет.'],
[50,9,'base','СОЛ ВЕДЕРН · ЧЕЛОВЕК, КОТОРОГО НЕ БЫЛО','Меня стёрли до рождения. Странно так говорить. Но здесь, у берега, все такие.'],
[51,9,'hornet','VØID-005 · ЦИКЛ 1500','Собирал фрагменты памяти. С каждым Разлом подходил ближе. Знание чего-то стоит.'],
[52,9,'base','КОЛОНИЯ «ТИХАЯ»','Нас нет ни в одной истории. Но мы здесь, на берегу, и ждём, когда кто-нибудь вспомнит.'],
[53,9,'comet','VØID-007 · ЦИКЛ 203','Ушёл в Разлом дальше всех. Там стреляют такие же, как я. Целятся так же, как я.'],
[54,9,'base','СИГНАТУРА НЕ ОПРЕДЕЛЕНА','013, разворачивайся. Мы уже пробовали.','013, разворачивайся. Ты уже пробовал. Это был ты.'],
[55,10,'pulsar','VØID-012 · ЦИКЛ 3001','Нулевая точка — не место. Это миг, когда он впервые нажал кнопку.'],
[56,10,'comet','VØID-007 · ЦИКЛ 3002','Отсюда видны все копии сразу. Мы похожи на созвездие. Без имени.'],
[57,10,'base','Н.','«Не дайте ему вспомнить» писал не я. Но я с ними согласен.'],
[58,10,'base','Э. В.','Если нашёл это — значит, сработало хотя бы частично. Не ищи меня. Ищи третий путь.'],
[59,10,'halo','VØID-002 · ЦИКЛ 1','Первая копия. Я открыл глаза и спросил его имя. Он не ответил. Теперь я знаю почему.'],
[60,10,'reaper','VØID-011 · ЦИКЛ 10','Снова забрал всё. Здесь нечего забирать. Впервые мне легко.'],
[61,10,'sail','VØID-003 · ЦИКЛ 77','Долетел без двигателей. Ничего не взял. Они пропустили меня — сюда, где нечего охранять.'],
[62,10,'manta','VØID-006 · ЦИКЛ 88','Выключил орудия у самой точки. Здесь тихо, как до первого запуска.'],
[63,10,'base','VØID-013 · ЦИКЛ —','Если ты читаешь это — ты дошёл дальше меня. Значит, мы уже чуть больше, чем копии.','Ты снова дошёл дальше. Нас становится больше.']];
const STORY_OLDID={1:'j1',2:'j2',3:'j3',4:'j5',5:'j6',6:'j8',27:'j4',36:'j7'};
const STORY_FRAG=['Лаборатория пахнет озоном. Кто-то смеётся у меня за спиной. Мира?',
 'Я держу модель: кольцо внутри кольца. Говорю: «Оно ничего не будет стирать».',
 'Первый запуск. Стрелки приборов стоят. Потом исчезает соседний корпус. Никто не замечает, что его не было.',
 'Я подписываю протокол. Две буквы: Э. В. Рука дрожит.',
 'Мира спрашивает, сколько историй мы можем себе позволить. Я называю число. Она плачет.',
 'Я проектирую стража. Даю ему один запрет: никогда не объяснять мне, зачем он стреляет.',
 'Я записываю себя в первую копию. Она открывает глаза и спрашивает моё имя. Я не отвечаю.',
 'Первая серия помнила всё. Через неделю половина секторов исчезла с карт.',
 'Я учусь забывать нарочно. Это сложнее, чем помнить.',
 'Сигнал в пустоту. Я отправляю его сам. Или кто-то, кто раньше был мной.',
 'Тринадцатая серия. Я говорю: «Пусть они будут пустыми. Пустое нельзя стереть».',
 'Я стою в сердце машины. Каждый удар — чей-то мир. Я считаю удары, чтобы не слышать.',
 'Мира уходит. В одной истории — к звёздам. В другой — в машину. Я не знаю, какая настоящая.',
 'Я оставляю на обломках свои инициалы. Если копия найдёт их — она сможет решить без меня.',
 '«Не дайте ему вспомнить». Я сам их об этом попросил.'];
// группы перехватов; c — условие
const RADIO={
 'А':{tag:'СТРАЖ',col:'#ff6b8a',l:[{t:'Объект в секторе. Вести, не вступать.'},{t:'Он стреляет первым. Как всегда.'},{t:'Держать строй. Граница за спиной.'},{t:'Не дайте ему вспомнить.',c:'force'},{t:'Потери допустимы. Его воспоминания — нет.'},{t:'Он снова поглощает. Эрозия растёт.'},{t:'Отходите к маяку. Маяк важнее нас.'},{t:'Не отвечать на его частоту.'},{t:'Цель повторяет маршрут. Предсказуемо.'},{t:'Он не знает, что ищет. Пусть так и остаётся.'},{t:'Узел семь потерян. Узел семь будет восстановлен.'},{t:'Цель приближается к ядру. Будите Стража-0.',c:'m4'},{t:'Не стрелять по рубке. Только по двигателям.'},{t:'Он спросит — не отвечать.'},{t:'Ещё одна копия. Протокол тот же.',c:'m7'}]},
 'В':{tag:'М. СЕН',col:'#c9a6ff',l:[{t:'…если кто-то слышит — мы почти закончили калибровку…'},{t:'…он не спит третьи сутки. Говорит, что спать — значит забывать…'},{t:'…Ковчег держит. Ковчег держит. Не смотри на карту…'},{t:'…я не помню, как выглядела моя сестра. Её фотографии пустые…'},{t:'…он запретил стражам объяснять. Даже мне не объяснил…'},{t:'…эта запись из другой версии. Если в твоей я жива — передай мне…'},{t:'…тринадцатая серия будет пустой. Он называет это милосердием…'},{t:'…я голосовала против. В другой истории — за…'},{t:'…если ты копия — ты не виноват. Если ты оригинал — виноват…'},{t:'…не ищи меня в списках. Меня в них сохранили неправильно…'},{t:'…он сказал: «Пусть кто-то другой найдёт третий путь». Он имел в виду тебя…'},{t:'…выключи приёмник. Если слушать меня долго, начнёшь вспоминать…'}]},
 'Г':{tag:'ЭФИР',col:'#9fb0c4',l:[{t:'…«Горизонт», ответьте. «Горизонт»…'},{t:'…двигатель держит, корпус нет. Скажите дочери…'},{t:'…я вижу свой корабль. Он летит мне навстречу…'},{t:'…не стреляйте, мы гражданские… мы были гражданскими…'},{t:'…здесь была планета. Я точно помню, здесь была планета…'},{t:'…топливо на нуле, летаю кругами. Гвардия не трогает…'},{t:'…кто-нибудь помнит колонию «Тихая»? Хоть кто-нибудь?…'},{t:'…маяк светит. Мы идём. Мы идём…'},{t:'…странно: мне не страшно. Будто уже было…'},{t:'…«НЕ ДАЙТЕ ЕМУ ВСПОМНИТЬ» на всех частотах. Кому — ему?…'},{t:'…меня зовут… меня звали…'},{t:'…если найдёте это — не сдавайте корпус на лом…'},{t:'…счётчик лет сломался. Показывает 127…'},{t:'…слышу стрельбу. Это VØID? Опять VØID?…'},{t:'…на моём корпусе чужие инициалы. Не мои…'}]},
 'Д':{tag:'Н.',col:'#ffd36b',l:[{t:'Координаты подтверждены. Продолжайте.',c:'force'},{t:'Вы ближе, чем в прошлый раз.',c:'cyc2'},{t:'Не слушайте Стражей. Они помнят за вас.'},{t:'Контракт выдан. Оплата — тем, что останется.'},{t:'Я посылал этот сигнал до того, как вы родились. Вы тоже.'},{t:'Ищите там, где карта молчит.'},{t:'Когда дойдёте до Нулевой точки — узнаете голос.'},{t:'Не торопитесь. Вы опоздали на сто двадцать семь лет. Ещё минута ничего не изменит.'}]},
 'Е':{tag:'?',col:'#ff4f6e',rift:1,l:[{t:'013, разворачивайся. Мы уже пробовали.'},{t:'Здесь нет сектора. Здесь нет тебя.'},{t:'Мы стреляем, как ты. Потому что мы — ты.'},{t:'Вернись. Нам не нужна компания.'},{t:'Какой у тебя цикл? У меня кончились числа.'},{t:'Слышишь свой голос? Привыкай.'},{t:'Мы были дальше. Здесь нечего искать.'},{t:'Не пытайся увернуться. Мы знаем твой рывок.'},{t:'Ещё шаг — и тебя никто не вспомнит. Даже ты.'},{t:'Помехи — это мы. Мы кричим.'},{t:'Твой корпус уже лежит здесь. Хочешь посмотреть?',c:'rwreck'},{t:'Уходи, пока помнишь дорогу назад.'}]},
 'Ж':{tag:'ОТСТУПАЮЩИЙ',col:'#dfe8ff',l:[{t:'Не стреляй. Я ухожу.'},{t:'Достаточно. Граница удержана.'},{t:'Ты отпускал меня раньше. Я помню.',c:'cyc2'},{t:'Мне нужно донести запись.'},{t:'Отступаю. Сохрани заряд для Стража.'},{t:'Это не трусость. Это протокол.'},{t:'Спасибо. Это не входит в протокол.',c:'force'},{t:'Мы ещё встретимся. В другом цикле.'}]},
 'З':{tag:'БОРТ',col:'#8fe9ff',l:[{t:'Цель экспедиции: установить источник сигнала. Цель экспедиции: установить источ…'},{t:'Сверка памяти: расхождение 3%. Игнорировать.'},{t:'Обнаружена запись с вашей подписью. Доступ запрещён.'},{t:'Внимание: эрозия в радиусе корабля. Источник: корабль.',c:'eros'},{t:'Восстановление связи с человечеством: адресат не найден.'},{t:'Пилот опознан. Пилот опознан. Пилот оп…'},{t:'Рекомендация: не задерживаться у обломков.'},{t:'Модули установлены. Происхождение модулей: не указано.'},{t:'Ошибка: экспедиция 013 зарегистрирована 4 102 раза.'},{t:'Сон пилота: не требуется. Сон пилота: запрещён.'},{t:'Архив молчит. Запросов не поступало. Запросов больше не будет.',c:'invcold'},{t:'Корпус восстановлен до заводского. Происхождение корпуса: не указано.',c:'observ'}]},
 'И':{tag:'ЭФИР',col:'#c9a6ff',l:[{t:'…приём. Это «Аврора-2». Мы ещё не вылетели. Почему вы нас слышите?…'},{t:'…сигнал пришёл раньше, чем был отправлен. Отправитель — вы…'},{t:'…не стреляйте в этот корабль, его ещё не построили…'},{t:'…вы уже прошли здесь. Через минуту. Я видел обломки…'},{t:'…наши часы показывают завтра. Завтра нас нет…'},{t:'…если вы слышите это до своей гибели — сверните левее…'}]},
 'К':{tag:'БЮРО «ПРЕДЕЛ»',col:'#6b8cff',l:[{t:'…бюро «Предел», испытание 12. Страж отказался стрелять в макет. Макет был в форме создателя…'},{t:'…протокол «не объяснять» прошит в ядро. Удалить невозможно. Он так хотел…'},{t:'…сборка партии сорок. В базе угроз у каждого одно и то же лицо…'},{t:'…мы делаем их честными. Им будет больно врать. Поэтому им запрещено говорить…'},{t:'…списанный страж просится обратно. Говорит, без границы ему нечего помнить…'},{t:'…он стоял у конвейера и смотрел, как они учатся его узнавать…'}]},
 'Л':{tag:'КОВЧЕГ',col:'#ffd36b',l:[{t:'…удержание: двенадцать систем. Вторая колонка скрыта…'},{t:'…сохранённые спрашивают, есть ли снаружи кто-нибудь. Инструкция: отвечать «нет»…'},{t:'…сердцебиение машины ровное. Шестьдесят ударов. Шестьдесят миров…'},{t:'…смотритель, вахта девять. Я снова забыл, что записал…'},{t:'…внимание, в контуре чужая копия. Код доступа совпадает с кодом создателя…'},{t:'…девочка из сектора сохранения рисует корабль. Ваш корабль…'}]},
 'М':{tag:'БЕРЕГ',col:'#7affc9',l:[{t:'…мы те, кого не случилось. Мы не злимся. Мы просто здесь…'},{t:'…колония «Тихая» вызывает. Нас никто не помнит, но мы всё ещё вызываем…'},{t:'…берег осыпается каждый раз, когда кто-то вспоминает лишнее…'},{t:'…ты оставил здесь след в прошлый раз. Он ещё тёплый…'},{t:'…с этой стороны ваша карта выглядит как остров…'},{t:'…не оборачивайся. За спиной — твоя другая жизнь…'}]},
 'П':{tag:'АРХИВ',col:'#8fd8ff',l:[{t:'Запись 4 117 принята. Источник: 013. Дубликат.'},{t:'Каталог цивилизаций закрыт для дополнений. Исключение: сорок вторая.'},{t:'Расхождение почерка с эталоном: ноль.'},{t:'Посетителю 013: ваш маршрут уже хранится. Повторный ввод не требуется.'},{t:'Температура хранения в норме. Записи не меняются. Записи не должны меняться.'},{t:'Запрос Стража-4 на объяснение отклонён. Основание: засекречено создателем.'},{t:'Обнаружена попытка импровизации. Классифицировано как шум.'},{t:'Сорок одна история. Один почерк. Вопросов не поступало.'},{t:'Дубликат 013 обнаружен в собственном каталоге. Удалять не предписано.'},{t:'Каталог оттаял. Тридцать одна запись читает друг друга. Шум, похожий на хор.',c:'invmem'},{t:'Эталон утрачен. Сверять не с чем. Архив продолжает принимать.',c:'invmem'}]},
 'Р':{tag:'ТИХАЯ',col:'#ffa66b',l:[{t:'…третьей очереди на высадку нет. Список пустой. Список был…'},{t:'…ремонтный автомат «Обод»: клиент 013, посещение 4 103, износ 12%…'},{t:'…папа, ты где? …папа?…'},{t:'…мы грузили тягачи три дня. Куда — не помню. Тягачи помнят…'},{t:'…колония «Тихая» вызывает порт. Порт не отвечает. Порта нет на карте…'},{t:'…ржавчина не на корпусе. Ржавчина — это и есть корпус…'},{t:'…«Обод» чинит всех. Он не спрашивает, кого чинит. Ему запретили…'},{t:'…я нацарапал имена на листе обшивки. Лист ржавеет быстрее, чем я забываю…'},{t:'…если слышишь это, сын, я всё ещё помню, что ты был…'},{t:'…«Обод» списан. Тягачи стоят. Некому сказать им, что везти…',c:'obscrap'},{t:'…кольцо не вращается. Впервые за сто двадцать семь лет тихо…',c:'obscrap'},{t:'…заказ 4 103 закрыт. Клиент восстановлен до заводского. Следующих не будет…',c:'observ'},{t:'…в списке колонистов снова есть строки. Одна — моя…',c:'observ'}]},
 'Н':{tag:'0',col:'#ff9fe0',l:[{t:'…здесь всё начиналось. Здесь всё начнётся снова, если ты захочешь…'},{t:'…я узнаю твой маршрут. Я летал им первым…'},{t:'…все копии сразу на одной частоте. Шум, похожий на хор…'},{t:'…кнопка ещё тёплая…'},{t:'…не дайте ему вспомнить. Не дайте ему вспомнить. Не дай… себе…'},{t:'…сигнал отправлен. Получатель: VØID-013. Отправитель: VØID-000…'}]}};
const RADIO_SEC={2:'П',3:'Р',6:'И',7:'К',8:'Л',9:'М',10:'Н'};
const STORY_NOTES={2:'Зафиксированы следы выстрелов вашего типа. Время: до вашего прибытия.',5:'Связь с экспедицией: нет ответа. Последний ответ получен 127 лет назад.',8:'Ретрансляторы передают голос, совпадающий с вашим на 100%.',10:'Передача адресована VØID-013. Отправитель — тоже.'};
const STORY_SHOP=[{t:'Добро пожаловать. Корпус изношен на 12%. Как обычно.',c:'first'},{t:'Вы платите ломом. Я не спрашиваю, чьим.'},{t:'Модули на складе. Их снимали с таких же, как вы.'},{t:'Протокол обслуживания написан Э. В. Он просил не задавать вопросов.'},{t:'Стражи сюда не заходят. Это часть договора.'},{t:'Скидок нет. Цена не менялась 127 лет.'},{t:'Предыдущий клиент выбрал тот же модуль. Он не вернулся.',c:'bought'},{t:'Вы уже покупали это. В другой раз.',c:'cyc2'},{t:'Клиент 013 опознан. Повторно. Повторно. Повторно.',c:'cyc2'},{t:'Если найдёте Э. — передайте, что автомат всё ещё работает.',c:'cyc3'}];
const STORY_WARDEN=['Опять рано.','Ты снова здесь?','На этот раз ты добрался дальше.','Мы не враги. Ты просил нас остановить тебя.'];
const STORY_HULL={base:'VØID-013. Текущая копия. Состояние: цел.',falcon:'VØID-004. Найден у Пояса Стража. Двигатели работали до конца.',manta:'VØID-006. Найден в Дрейфе. Пилот выключил оружие сам.',prism:'VØID-009. Найден у края Разлома. Внутри — только свет.',reaper:'VØID-011. Поглотил больше всех. Стражи пришли за ним все сразу.',halo:'VØID-002. Старейший корпус. Кольцо — часть первого Ковчега.',comet:'VØID-007. Ушёл дальше всех в Разлом. Хвост светится до сих пор.',hornet:'VØID-005. Собран из деталей трёх других копий.',obsidian:'VØID-010. Пытался спрятаться от Стражей. Они запомнили форму.',sail:'VØID-003. Летел без двигателей, чтобы ничего не поглощать. Не долетел.',pulsar:'VØID-012. Последний перед вами. Сигнал ещё пульсирует.'};
const STORY_LORE={scout:'Считывает ваш маршрут и передаёт ядру.',gunner:'Стреляет на поражение, потому что предупреждения вы уже слышали.',rammer:'Жертвует собой. Его запись уже сохранена где-то ещё.',splitter:'Одна запись, разделённая на три, чтобы её труднее было поглотить.',mite:'Одна запись, разделённая на три, чтобы её труднее было поглотить.',miner:'Расставляет мины там, где вы пролетали в прошлый раз.',shielder:'Защищает других ценой себя. Странно для машины.',lancer:'Его луч достаёт до края наблюдаемого. Дальше стрелять не в кого.',guard:'Держит строй лицом к Разлому, а не к вам. Разворачивается неохотно.',pylon:'Сдерживает не вас, а Стража.',seeker:'Наводится не на корпус, а на подпись вашего сознания.',boss:'Первый защитник. Знает, кто вы. Ему запрещено сказать.',moth:'Летит на свет маяка, как летели все до него.',leech:'Тянет заряд не для себя: пытается вернуть стёртое.',carrier:'Внутри — не дроны, а копии одного и того же дрона.',cutter:'Режет пространство по швам, оставленным Ковчегом.',tug:'Уводит маяк туда, где его никто не запомнит.',mortar:'Бьёт по площади: без разницы, что там было.',phantom:'Остаток корабля, которого никогда не было.',shade:'Повторяет ваши манёвры с опозданием в один цикл.',mirror:'Возвращает вам то, что вы в него вложили.',hive:'Восстанавливает своих из записей. Как и Ковчег.',shocker:'Разряд стирает последние доли секунды из памяти систем.',vortex:'Место, где пространство начало забывать себя.',twin:'Две версии одного корабля из разных историй. Спорят, кто настоящий.',thief:'Забирает ячейки, чтобы их не поглотили вы.',hunter:'Идёт по следу вашей эрозии.',commander:'Отдаёт приказы на языке, который писали вы.',cruiser:'Последний корабль флота, перешедший на сторону Стражей.',antenna:'Передаёт одну фразу. Вы её знаете.',decoy:'Светит так же, как сигнал, который привёл вас сюда.',jam:'Тишина, которой придали форму. Заглушает не связь, а вашу память.'};
const STORY_NORETREAT=new Set(['boss','jam','guard','pylon','cruiser','cpart','antenna','decoy','lock','mine','mite','shell','seeker','crate','twin','thief','leech','moth','hive','icecopy','hull','rustcopy','inventor','invcell','invcore','obheart','obseg']);

// ---------- переименования (сектора — в SECTORS_NEW) ----------
(function storyRename(){
  const R=(k,n)=>{if(EDEF[k])EDEF[k].name=n;};R('mirror','Отражение');R('thief','Сборщик');R('guard','Гвардия Стража');R('pylon','Предохранитель');R('boss','Страж-0');
  for(const k in STORY_LORE)if(EDEF[k])EDEF[k].lore=STORY_LORE[k];
  STORY_HULL.archive='VØID-013. Выкопан из обломка Инвентаризатора. Инвентарный номер, который никто не выдавал.';STORY_HULL.rime='VØID-014. Собран у Холодного ядра. Тонкий лёд на каркасе — держится, пока ты движешься.';
  for(const k in STORY_HULL)if(SKINS[k])SKINS[k].d=STORY_HULL[k];
  const M=MISSIONS;M[0].name='Пробуждение';M[5].name='Страж-0';M[5].sector='ЯДРО · ТОТ, КТО ПОМНИТ';M[7].name='Голоса ретрансляторов';
  for(let i=6;i<10;i++)M[i].sector=M[i].sector.replace('АКТ II','АКТ I');
  WORLD.hangar.name='ХРАНИЛИЩЕ КОРПУСОВ';
  const a3=WORLD.anomalies.find(a=>a.id==='a3');if(a3)a3.d=a3.d.replace('Похититель','Сборщик');
})();

// ---------- обломки: расстановка ----------
function storyObstacles(){const o=[...WORLD.nodes,...WORLD.shops,...WORLD.anomalies,...WORLD.caches,...WORLD.relays,WORLD.hangar,WORLD.arsenal,WORLD.abyss,WORLD.gate];
  for(const s of WORLD.sectors)if(s.bx)o.push({x:s.bx,y:s.by});return o;}
function segDistP(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,L=dx*dx+dy*dy||1;let u=((px-ax)*dx+(py-ay)*dy)/L;u=u<0?0:u>1?1:u;return Math.hypot(px-ax-dx*u,py-ay-dy*u);}
function storyBuild(){
  WORLD.journals0=WORLD.journals.map(j=>({x:j.x,y:j.y}));const old={};for(const j of WORLD.journals)old[j.id]=j;
  const obs=storyObstacles(),N=WORLD.nodes,placed=[],warn=[];
  for(const j of Object.values(old))if(['j1','j2','j3','j5','j6','j8'].includes(j.id))placed.push(j);
  const lineOk=(x,y)=>{for(let i=0;i<N.length-1;i++)if(segDistP(x,y,N[i].x,N[i].y,N[i+1].x,N[i+1].y)<160)return false;return true;};
  const okAt=(x,y,k)=>obs.every(q=>Math.hypot(q.x-x,q.y-y)>350*k)&&placed.every(q=>Math.hypot(q.x-x,q.y-y)>250*k)&&lineOk(x,y)&&
    WORLD.fields2.every(f=>Math.hypot(f.x-x,f.y-y)>f.r*.6)&&(STORY_EXTRA_ZONES||[]).every(z=>Math.hypot(z.x-x,z.y-y)>500);
  const pick=(sec,R,fn,n)=>{const b=WORLD.sectors[sec].box;for(let pass=0;pass<3;pass++){const k=[1,.8,.6][pass];
      for(let i=0;i<400;i++){let x,y;if(fn){[x,y]=fn(R);}else{x=b[0]+400+R()*(b[2]-b[0]-800);y=b[1]+400+R()*(b[3]-b[1]-800);}
        if(x<b[0]+400||x>b[2]-400||y<b[1]+400||y>b[3]-400)continue;if(okAt(x,y,k))return [x,y];}
      warn.push('wreck '+n+' pass '+(pass+1));}
    return [(b[0]+b[2])/2,(b[1]+b[3])/2];};
  const out=[];
  for(const w of STORY_W){const [n,sec,skin,sign,text,text2]=w,oid=STORY_OLDID[n];
    let x,y;
    if(oid&&old[oid]&&sec<=1){x=old[oid].x;y=old[oid].y;if(oid==='j5'){x=5300;}}
    else{const R=mulberry(7000+sec*97+n*13),S_=WORLD.sectors[sec],b=S_.box;let fn=null;
      if(n===35)fn=R=>[b[2]-800+R()*400,b[1]+400+R()*(b[3]-b[1]-800)];
      if(n===42){const p35=out.find(q=>q.n===35);fn=R=>[b[0]+400+R()*400,clamp(p35.y+(R()-.5)*700,b[1]+400,b[3]-400)];}
      if(n===22){const n0=N.find(q=>q.m===S_.lv[0]);fn=R=>{const f=.35+R()*.3;return [S_.bx+(n0.x-S_.bx)*f+(R()-.5)*500,S_.by+(n0.y-S_.by)*f+(R()-.5)*500];};}
      if(n===63){const a=N[48],c=N[49];fn=R=>{const dx=c.x-a.x,dy=c.y-a.y,l=Math.hypot(dx,dy)||1,d=380+R()*300,s=(R()-.5)*600;return [c.x+dx/l*d-dy/l*s,c.y+dy/l*d+dx/l*s];};}
      [x,y]=pick(sec,R,fn,n);}
    const j={id:oid||('w'+n),n,sec,skin,sign,t1:text,t2:text2,x:Math.round(x),y:Math.round(y)};
    Object.defineProperty(j,'title',{get(){return wreckTitle(this);}});Object.defineProperty(j,'text',{get(){return wreckText(this);}});
    out.push(j);if(!(oid&&sec<=1))placed.push(j);}
  WORLD.journals=out;STORY_WARN.push(...warn);
}
const STORY_WARN=[];
// 3 трудные зоны с патрулями для фрагментов (сектора VIII, IX, X)
const STORY_EXTRA_ZONES=[];
(function storyZones(){[7,8,9].forEach((sec,k)=>{const sc=WORLD.sectors[sec],f=WORLD.fields2.filter(q=>q.x>=sc.box[0]&&q.x<=sc.box[2]).find(q=>WORLD.nodes.every(n=>Math.hypot(n.x-q.x,n.y-q.y)>600))
    ||{x:(sc.box[0]+sc.box[2])/2,y:sc.box[1]+900};
  const z={x:Math.round(f.x),y:Math.round(f.y),req:10,set:[{hunter:1,gunner:3,scout:3},{mirror:1,phantom:2,gunner:2,scout:2},{shocker:2,hunter:1,rammer:2,scout:2}][k],story:1};
  STORY_EXTRA_ZONES.push(z);WORLD.zones.push(z);});})();
function cycN(){return (G.save&&G.save.cycle)||1;}
function wreckTitle(j){if(j.sign==='@next')return 'VØID-013 · ЦИКЛ '+roman(cycN()+1);return j.sign;}
function wreckText(j){const c=cycN();let t=c>1&&j.t2?j.t2:j.t1;
  if(t==='@obod')t='Клиент 013. Посещений: '+fmtN(4102+c*37)+'. Износ всё так же 12%.';
  else if(t==='@s19')t='Мы помним предыдущие прохождения. Их '+fmtN(1903+c)+'. Он — нет.';
  else if(t==='@s11')t='Объект 013 снова у границы. Попытка № '+fmtN(1903+c)+'. Не дайте ему вспомнить.';
  else if(t==='@op')t='Удержали двенадцать систем. Вторую колонку нам по-прежнему не показывают. Цикл '+roman(c)+'.';
  return t;}
storyBuild();

// ---------- фрагменты ----------
const STORY_FRAGS=[];
(function fragBuild(){const N=WORLD.nodes;
  [14,22,31,38,42,46].forEach(m=>{const c=N[m-1],a=N[m-2],b=N[m]||c,dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1;let x=c.x-dy/l*260,y=c.y+dx/l*260;
    const box=WORLD.sectors[c.sec].box;if(y<box[1]+350||y>box[3]-350){x=c.x+dy/l*260;y=c.y-dx/l*260;}
    STORY_FRAGS.push({id:'fb'+m,kind:'boss',m,x:Math.round(x),y:Math.round(y)});});
  [5,6,7,8,9,10].forEach(sec=>{const b=WORLD.sectors[sec].box;let best=null,bs=-1;
    for(const s of riftEdges()){const mx=(s[0]+s[2])/2,my=(s[1]+s[3])/2;if(mx<b[0]-1||mx>b[2]+1||my<b[1]-1||my>b[3]+1)continue;
      const ox=mx+s[4]*900,oy=my+s[5]*900;if(ox<300||oy<300||ox>WW-300||oy>WH-300||inSectors(ox,oy))continue;
      let dmin=1e9;WORLD.sectors.forEach((o,i)=>{if(i===sec)return;const q=o.box,dx=Math.max(q[0]-ox,0,ox-q[2]),dy=Math.max(q[1]-oy,0,oy-q[3]);dmin=Math.min(dmin,Math.hypot(dx,dy));});
      const sc=dmin+Math.abs(((s[0]+s[2])/2-(b[0]+b[2])/2))*0+((s[1]===s[3])?200:0);if(sc>bs){bs=sc;best={ex:mx,ey:my,nx:s[4],ny:s[5]};}}
    if(best)STORY_FRAGS.push({id:'fr'+(sec+1),kind:'rift',sec,...best});});
  STORY_EXTRA_ZONES.forEach((z,k)=>STORY_FRAGS.push({id:'fh'+(k+8),kind:'hard',x:z.x,y:z.y}));})();
function fragCount(){const S=G.save;return S&&S.story?Object.keys(S.story.frags).length:0;}
function riftShift(){return Math.min(FRAG_SHIFT_MAX,FRAG_SHIFT*fragCount());}
function fragPos(f){if(f.kind!=='rift')return f;const off=Math.max(140,520-riftShift());return {x:f.ex+f.nx*off,y:f.ey+f.ny*off};}
function fragAvail(f){const S=G.save;if(!S||!S.story||S.story.frags[f.id])return false;if(f.kind==='boss')return !!(S.medals[f.m]&&S.medals[f.m].clear);return true;}

// ---------- сохранение ----------
function storyInit(S){if(!S)return S;const s=S.story||(S.story={});
  if(s.absorbed===undefined)s.absorbed=(S.lom||0)+(S.carry||0);
  for(const k of ['spared','fleeKilled','wardenMeets'])s[k]=s[k]||0;
  s.frags=s.frags||{};s.riftWrecks=s.riftWrecks||[];s.seen=s.seen||{};s.secSeen=s.secSeen||{};s.history=s.history||[];
  s.cyc=s.cyc||{absorbed:0,spared:0,fleeKilled:0,deaths:0,riftDeaths:0,warden:0};s.shopN=s.shopN||0;
  // журналы: оставить только существующие id
  if(S.journals){for(const k in S.journals)if(!WORLD.journals.some(j=>j.id===k))delete S.journals[k];}
  if(Array.isArray(S.jOrder))S.jOrder=S.jOrder.filter(k=>WORLD.journals.some(j=>j.id===k));
  return S;}
function storyTick(){const S=G.save;if(!S||!S.story)return;const tot=(S.lom||0)+(S.carry||0)+(S.lost?S.lost.v:0);
  if(G.lomPrev===undefined||G.lomPrevSave!==S){G.lomPrev=tot;G.lomPrevSave=S;return;}
  if(tot>G.lomPrev){const d=tot-G.lomPrev;S.story.absorbed+=d;S.story.cyc.absorbed+=d;}G.lomPrev=tot;}
function erosion(){const S=G.save;return S&&S.story?Math.min(1,S.story.absorbed/EROSION_FULL):0;}

// ---------- радио ----------
function radioEl(){return document.getElementById('radio');}
function radioClear(){const el=radioEl();if(el){el.hidden=true;el.classList.remove('rift');}if(G.radio)G.radio.cur=null;}
function radioState(){return G.radio||(G.radio={t:20,cur:null,q:[],n:0});}
function radioCond(c){const S=G.save;if(!c)return true;
  if(c==='force')return false;if(c==='cyc2')return cycN()>1;if(c==='cyc3')return cycN()>2;if(c==='eros')return erosion()>=.2;
  if(c==='invcold')return storyFlag('inv14')==='cold';if(c==='invmem')return storyFlag('inv14')==='memory';if(c==='obscrap')return storyFlag('obod18')==='scrap';if(c==='observ')return storyFlag('obod18')==='service';
  if(c==='rwreck')return !!(S&&S.story&&S.story.riftWrecks.length);if(c==='dead33')return storyFlag('save33')==='dead';if(c==='unborn33')return storyFlag('save33')==='unborn';if(c==='keep22')return storyFlag('cradle22')==='keep';if(c==='engine27')return storyFlag('fleet27')==='engine';if(c==='teo')return storyFlag('teo')===1;if(c==='m4')return G.m>=4;if(c==='m7')return G.m>=7;return true;}
function radioPick(g){const S=G.save,R=RADIO[g];if(!R||!S||!S.story)return null;if(g==='П'&&S.story.inv14==='cold')return null;const seen=S.story.seen;
  const av=R.l.map((q,i)=>({q,i})).filter(o=>!seen[g+(o.i+1)]&&radioCond(o.q.c));if(!av.length)return null;const o=av[Math.floor(Math.random()*av.length)];return {g,i:o.i};}
function radioSay(g,i){const S=G.save;if(!S||!S.story||!SET.radio||STORY_OFF.radio)return;const R=RADIO[g],q=R.l[i];if(!q)return;S.story.seen[g+(i+1)]=1;
  const st=radioState();st.cur={g,txt:q.t,tag:R.tag,col:R.col,rift:!!R.rift,t:0,len:q.t.length};st.n++;
  const el=radioEl();if(!el)return;el.hidden=false;el.style.opacity='1';el.style.borderColor=R.col;el.classList.toggle('rift',!!R.rift);
  el.querySelector('.rtag').textContent='ПЕРЕХВАТ · '+R.tag;el.querySelector('.rtag').style.color=R.col;el.querySelector('.rtxt').textContent='';
  if(AU.ctx&&SET.sfx){try{const c=AU.ctx,t=c.currentTime,n=c.createBufferSource(),b=c.createBuffer(1,c.sampleRate*.25,c.sampleRate),d=b.getChannelData(0);for(let k=0;k<d.length;k++)d[k]=(Math.random()*2-1)*(1-k/d.length);
    n.buffer=b;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=1600;f.Q.value=1.5;const gg=c.createGain();gg.gain.value=.05;n.connect(f);f.connect(gg);gg.connect(AU.sfx);n.start(t);}catch(e){}}}
function radioForce(g,i,delay){const st=radioState();st.q.push({g,i,d:delay||0});}
function radioCtxGroups(sec,rift){if(rift)return [['Е',1]];
  if(!RADIO_SEC[sec])return [['Г',.7],['З',.3]];const gs=[[RADIO_SEC[sec],.5],['В',.2],['З',.15]];if(sec>=7)gs.push(['Д',.15]);if(sec<=3)gs.push(['Г',.15]);return gs;}
function radioTick(dt,mode){if(STORY_OFF.radio)return;try{
  const st=radioState(),el=radioEl(),S=G.save;if(!S||!S.story)return;
  // показ текущей
  if(st.cur){const c=st.cur;c.t+=dt;const n=Math.min(c.len,Math.floor(c.t/.03));
    if(el&&n!==c.shown){c.shown=n;let s=c.txt.slice(0,n);if(c.rift)s=s.replace(/[^\s]/g,ch=>Math.random()<.08?'▒':ch);el.querySelector('.rtxt').textContent=s;}
    const end=c.len*.03+4;if(c.t>end&&el)el.style.opacity=String(Math.max(0,1-(c.t-end)/.5));if(c.t>end+.5){radioClear();}return;}
  // принудительные
  for(const q of st.q)q.d-=dt;const qi=st.q.findIndex(q=>q.d<=0);if(qi>=0){const q=st.q.splice(qi,1)[0];if(q.txt){radioSayTxt(q);return;}if(q.i<0){const p=radioPick(q.g);if(p)radioSay(p.g,p.i);}else radioSay(q.g,q.i);return;}
  st.t-=dt;if(st.t>0)return;
  if(mode==='mission'){const mg=G.m<=10?'А':RADIO_SEC[secOfLevel(G.m)];if(!mg||G.mode!=='world'){st.t=999;return;}
    if((G.boss&&G.boss.alive)||(G.jam&&G.jam.alive)||G.sb||(G.m===1&&G.mT<30)||st.mN>=3){st.t=5;return;}
    const p=radioPick(mg);if(p&&!(mg==='А'&&p.i===3)){radioSay(mg,p.i);st.mN=(st.mN||0)+1;}st.t=45+Math.random()*25;return;}
  // мир
  const p=G.player,rift=(G.riftI||0)>=.35;
  if(G.anom||G.deadT>0||G.enemies.some(e=>e.alive&&e.type!=='mine'&&e.type!=='lock'&&Math.hypot(e.x-p.x,e.y-p.y)<900)){st.t=4;return;}
  const sec=sectorIdx(p.x,p.y),gs=radioCtxGroups(sec,rift);let r=Math.random()*gs.reduce((a,b)=>a+b[1],0),g=gs[0][0];for(const [k,w] of gs){r-=w;if(r<=0){g=k;break;}}
  const pk=radioPick(g)||gs.map(x=>radioPick(x[0])).find(Boolean);if(pk)radioSay(pk.g,pk.i);
  st.t=rift?9+Math.random()*5:sec<=1?70+Math.random()*30:sec<=5?50+Math.random()*20:25+Math.random()*15;
 }catch(err){STORY_OFF.radio=1;console.error(err);radioClear();}}
function radioWorldEnter(){const S=G.save,p=G.player;if(!S||!S.story||!p)return;const sec=sectorIdx(p.x,p.y);
  if(RADIO_SEC[sec]&&!S.story.secSeen[sec]){S.story.secSeen[sec]=1;radioForce(RADIO_SEC[sec],-1,8);}}

// ---------- пробуждение ----------
function prologueStart(long){const el=document.getElementById('wake');if(!el)return;G.prologue={t:0,len:long?5:1.2,long,hb:0};el.hidden=false;
  el.querySelector('.wtxt').textContent='';el.querySelector('.wmsg').textContent='';el.querySelector('.wbot').textContent='';radioClear();
  if(G.save&&G.save.story)G.save.story.prologue=1;}
function prologueEnd(){const el=document.getElementById('wake');if(el)el.hidden=true;cv.style.filter='';const hd=document.getElementById('hud');if(hd)hd.style.opacity='';
  G.prologue=null;G.wakeI=0;for(const k in KEYS)KEYS[k]=false;if(typeof MOUSE!=='undefined')MOUSE.down=false;}
function prologueSkip(){const P=G.prologue;if(P&&P.t<P.len-.3)P.t=P.len-.3;}
function thump(f,v,at){if(!AU.ctx||!SET.sfx)return;try{const c=AU.ctx,t=c.currentTime+(at||0),o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.6,t+.25);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.connect(g);g.connect(AU.sfx);o.start(t);o.stop(t+.35);}catch(e){}}
function prologueTick(dt){const P=G.prologue;if(!P)return;P.t+=dt;const t=P.t,el=document.getElementById('wake');if(!el){prologueEnd();return;}
  const lin=(a,b,x)=>clamp((x-a)/(b-a),0,1),ease=x=>1-Math.pow(1-x,3);let o,blur,br;
  const S=G.save,c=cycN(),mem=c<=1?'ПАМЯТЬ: ПОВРЕЖДЕНА':c===2?'ПАМЯТЬ: ПОВРЕЖДЕНА ПОВТОРНО':c===3?'ПАМЯТЬ: СТЁРТА НАРОЧНО':'ПАМЯТЬ: НЕ ВАША';
  const T=el.querySelector('.wtxt'),Mg=el.querySelector('.wmsg'),B=el.querySelector('.wbot');
  if(P.long){
    o=t<.8?0:t<1.2?.3*lin(.8,1.2,t):t<1.45?.3*(1-lin(1.2,1.45,t)):t<2?.6*lin(1.45,2,t):t<2.6?.6:t<3.8?.6+.4*ease(lin(2.6,3.8,t)):1;
    blur=t<2.6?18:18*(1-ease(lin(2.6,3.8,t)));br=t<2.6?.55:.55+.45*lin(2.6,3.8,t);
    const s1='ВОССТАНОВЛЕНИЕ СОЗНАНИЯ…';T.textContent=t<2?s1.slice(0,Math.floor(lin(0,.7,t)*s1.length))+(t>.8?'\nV∅ID-013 · '+mem:''):'';
    Mg.textContent=t>=2&&t<2.35?'НЕ ДАЙТЕ ЕМУ ВСПОМНИТЬ':t>=2.35&&t<2.6?'ПЕРЕДАЧА ОБОРВАНА':'';G.wakeI=t>=2&&t<2.6?.8:0;
    B.textContent=t>3.8?'КООРДИНАТЫ ПРИНЯТЫ · ИСТОЧНИК: Н.':'';
    const hd=document.getElementById('hud');if(hd)hd.style.opacity=t<3.8?'0':String(Math.min(1,(t-3.8)/1)*(Math.sin(t*40)>-.3?1:.3));
    if(P.hb===0&&t>.05){P.hb=1;thump(55,.5);thump(52,.45,.38);}if(P.hb===1&&t>1){P.hb=2;thump(60,.4);thump(58,.35,.3);}if(P.hb===2&&t>2.6){P.hb=3;thump(180,.08);}}
  else{o=t<.3?0:t<.55?.3*lin(.3,.55,t):t<.7?.3*(1-lin(.55,.7,t)):ease(lin(.7,1.2,t));blur=10*(1-lin(.6,1.2,t));br=.6+.4*lin(.5,1.2,t);T.textContent='';Mg.textContent='';B.textContent='';}
  el.querySelector('.lid.t').style.transform=`translateY(${-o*100}%)`;el.querySelector('.lid.b').style.transform=`translateY(${o*100}%)`;
  cv.style.filter=SET.fx&&blur>.2?`blur(${blur.toFixed(1)}px) brightness(${br.toFixed(2)})`:`brightness(${br.toFixed(2)})`;
  if(t>=P.len)prologueEnd();}

// ---------- смерть ----------
function memoFlash(txt){const el=document.getElementById('memo');if(!el)return;el.textContent=txt;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');}
function storyDeath(rift){const S=G.save;if(!S||!S.story||G.mode!=='world')return;S.story.cyc.deaths++;if(rift){S.story.cyc.riftDeaths++;const p=G.player;
    S.story.riftWrecks.push({x:Math.round(p.x),y:Math.round(p.y),skin:curSkin(),c:cycN(),id:Date.now()%1e9});while(S.story.riftWrecks.length>12)S.story.riftWrecks.shift();}
  memoFlash(rift?'ВОСПОМИНАНИЕ ИЗЪЯТО':'ВОСПОМИНАНИЕ НЕ СОХРАНЕНО');}

// ---------- отступающие ----------
function storyRetreatRoll(e){if(e.rolledR||e.retreat||e.hp<=0||e.hp>e.maxHp*.35)return;e.rolledR=true;
  if(STORY_OFF.flee||G.mode!=='world'||G.world||G.m<3||STORY_NORETREAT.has(e.type)||STATIC.has(e.type)||e.elite||e.zone)return;
  if((G.retreatN||0)>=2||G.enemies.some(o=>o.alive&&o.retreat))return;if(Math.random()>=.07)return;storyRetreat(e);}
function storyRetreat(e){e.retreat=true;e.retreatT=0;e.contact=0;e.charging=false;G.retreatN=(G.retreatN||0)+1;prioClear(e);
  floater(e.x,e.y-26,'ОТСТУПАЕТ','#dfe8ff');if(Math.random()<.5){const p=radioPick('Ж');if(p&&p.i!==6)radioSay('Ж',p.i);}}
function storyRetreatMove(e,dt){e.retreatT+=dt;const tx=e.x<W/2?-240:W+240,ty=e.y+(e.y<H/2?-60:60);steer(e,tx-e.x,ty-e.y,e.spd*1.15+40,dt,3);e.x+=e.vx*dt;e.y+=e.vy*dt;
  if(SET.fx&&vR2()<.25)part(e.x,e.y,vrnd2(-40,40),vrnd2(-40,40),.4,'#dfe8ff',1.5);
  if(e.x<-70||e.x>W+70||e.y<-70||e.y>H+70||e.retreatT>8)storySpare(e);}
function storySpare(e){e.alive=false;e.spared=true;const S=G.save;if(S&&S.story){S.story.spared++;S.story.cyc.spared++;}
  floater(clamp(e.x,30,W-30),clamp(e.y,30,H-30),'ОТПУЩЕН','#dfe8ff');if(Math.random()<.4&&S&&S.story&&!S.story.seen['Ж7'])radioSay('Ж',6);}
function storyRetreatKilled(e){const S=G.save;if(e.retreat&&S&&S.story){S.story.fleeKilled++;S.story.cyc.fleeKilled++;}}

// ---------- Страж ----------
function storyWarden(){const S=G.save;if(G.mode!=='world'||!S||!S.story)return;S.story.wardenMeets++;S.story.cyc.warden++;
  if(G.mode==='world'&&!G.world&&G.m===6){banner('СТРАЖ-0 ПРОБУЖДАЕТСЯ',STORY_WARDEN[Math.min(3,cycN()-1)].toUpperCase());}}
function storyEchoLine(){const S=G.save;if(!S||!S.story)return null;S.story.wardenMeets++;const n=S.story.wardenMeets;
  return n<=1?'ТЫ ЗДЕСЬ ВПЕРВЫЕ. ТАК ТЫ ДУМАЕШЬ.':n<=4?'ВСТРЕЧА '+n+'. ТЫ СНОВА НЕ ПОМНИШЬ.':n+'. Я ПЕРЕСТАЛ СЧИТАТЬ. НЕТ — НЕ ПЕРЕСТАЛ.';}

// ---------- мастерская ----------
function shopLine(){const S=G.save;if(!S||!S.story)return '';const s=S.story;s.shopN++;
  const pool=STORY_SHOP.filter(q=>q.c==='first'?s.shopN===1:q.c==='bought'?!!s.bought:q.c==='cyc2'?cycN()>1:q.c==='cyc3'?cycN()>2:true);
  let q=pool[Math.floor(Math.random()*pool.length)];if(s.shopN===1)q=STORY_SHOP[0];if(q.t===s.lastShop&&pool.length>1)q=pool.find(x=>x.t!==q.t);s.lastShop=q.t;return q.t;}
function shopType(txt){const el=document.getElementById('shopBot');if(!el)return;clearInterval(G.shopTm);let i=0;el.textContent='';
  G.shopTm=setInterval(()=>{i++;el.textContent='АВТОМАТ: '+txt.slice(0,i);if(i>=txt.length)clearInterval(G.shopTm);},25);}

// ---------- сводка цикла ----------
function cycleReport(){const S=G.save,s=S.story,c=s.cyc,fr=Object.keys(s.frags).length;
  return {cyc:cycN(),missions:doneCount(),abs:Math.round(c.absorbed),spared:c.spared,fk:c.fleeKilled,read:journalIds().length,frags:fr,deaths:c.deaths,rd:c.riftDeaths,warden:c.warden,
    fin:fr<3?'ВОСПОМИНАНИЕ НЕ СОХРАНЕНО':'КОПИЯ ПЕРЕДАНА СЛЕДУЮЩЕЙ'};}
function reportHTML(r){return `<div class="rep">${[['Миссий пройдено',r.missions+'/'+NM],['Поглощено записей',fmtN(r.abs)],['Отпущено / добито отступавших',r.spared+' / '+r.fk],['Записей прочитано',r.read+'/63'],['Фрагментов памяти',r.frags+'/15'],['Смертей / из них в Разломе',r.deaths+' / '+r.rd],['Встреч со Стражем',r.warden]]
  .map(([k,v],i)=>`<div style="animation-delay:${i*.15}s"><span>${k}</span><b>${v}</b></div>`).join('')}</div><p class="repfin" style="animation-delay:1.2s">${r.fin}</p>`;}
function openReport(){const S=G.save;if(!S||!S.story)return newCycle();const r=cycleReport();S.story.history.push(r);while(S.story.history.length>10)S.story.history.shift();
  scr6('report');$('#repEyebrow').textContent='ОТЧЁТ ЭКСПЕДИЦИИ · V∅ID-013 · ЦИКЛ '+roman(r.cyc);$('#repBody').innerHTML=reportHTML(r);store(saveKey(),S);show('sReport');(touchMode||$('#bRepGo').focus());}
function storyNewCycle(S){const s=S.story;if(!s)return;s.seen={};s.secSeen={};s.frags={};s.riftWrecks=[];s.cyc={absorbed:0,spared:0,fleeKilled:0,deaths:0,riftDeaths:0,warden:0};}

// ---------- меню ----------
let menuGT=8;
function menuGlitch(dt){const el=document.querySelector('#sMenu .sub');if(!el)return;const S=G.save;
  if(!(S&&(S.cycle||1)>1)){if(el.dataset.g){el.textContent='ПОСЛЕДНИЙ СИГНАЛ';el.classList.remove('glt');delete el.dataset.g;}return;}
  menuGT-=dt;if(el.dataset.g){if(menuGT<=0){el.textContent='ПОСЛЕДНИЙ СИГНАЛ';el.classList.remove('glt');delete el.dataset.g;menuGT=9+Math.random()*7;}return;}
  if(menuGT<=0){el.dataset.g=1;el.textContent='НЕ ДАЙТЕ ЕМУ ВСПОМНИТЬ';el.classList.add('glt');menuGT=.18+Math.random()*.12;if(AU.ctx&&SET.sfx)thump(900,.03);}}
function menuGlitchOff(){const el=document.querySelector('#sMenu .sub');if(el&&el.dataset.g){el.textContent='ПОСЛЕДНИЙ СИГНАЛ';el.classList.remove('glt');delete el.dataset.g;}}

