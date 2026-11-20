// ---------- Данные: угрозы ----------
// grp: siege — летит к маяку, hunt — охотится на игрока, sab — диверсант
const EDEF={
  scout:{name:'Разведчик',hp:18,spd:155,r:11,xp:1,contact:10,col:'#ff5f8a',pts:10,act:1,desc:'Быстро сближается и таранит корпус. Опасен стаей, а не поодиночке.'},
  gunner:{name:'Стрелок',hp:30,spd:95,r:13,xp:2,contact:10,col:'#ff9a4d',pts:20,act:1,desc:'Держит дистанцию и стреляет прицельно. Перед выстрелом ствол раскаляется.'},
  rammer:{name:'Таран',hp:42,spd:80,r:15,xp:3,contact:16,col:'#ff4545',pts:30,act:1,desc:'Подсвечивает траекторию и разгоняется по прямой. Уходите вбок, а не назад.'},
  splitter:{name:'Роевик',hp:36,spd:75,r:16,xp:2,contact:10,col:'#e86bff',pts:25,act:1,desc:'При гибели распадается на три быстрых осколка.'},
  mite:{name:'Осколок',hp:8,spd:190,r:7,xp:1,contact:6,col:'#f2a2ff',pts:5,act:1,desc:'Остаток роевика. Хрупкий, но шустрый.'},
  miner:{name:'Минёр',hp:34,spd:85,r:14,xp:3,contact:10,col:'#ffd24d',pts:30,act:1,desc:'Расставляет мины. Мина взводится за секунду и взрывается, если подлететь близко. Мины можно сбивать.'},
  mine:{name:'Мина',hp:6,spd:0,r:9,xp:0,contact:0,col:'#ffd24d',pts:2,passive:true},
  shielder:{name:'Щитоносец',hp:55,spd:70,r:15,xp:4,contact:10,col:'#9c8cff',pts:45,act:1,desc:'Держится позади и связывает до трёх союзников полем: по ним проходит лишь 35% урона. Снимайте первым.'},
  lancer:{name:'Копейщик',hp:40,spd:75,r:13,xp:4,contact:10,col:'#ff3dbb',pts:45,act:1,desc:'Секунду ведёт вас прицелом, затем бьёт лучом через весь экран. Линия прицела — сигнал к рывку.'},
  guard:{name:'Гвардия',hp:150,spd:72,r:20,xp:8,contact:18,col:'#ffb84d',pts:120,act:1,desc:'Элита Стража. Фронтальный щит отражает выстрелы, но разворачивается медленно — заходите с фланга. Рывок и импульс игнорируют щит.'},
  pylon:{name:'Заряд',hp:85,spd:0,r:13,xp:2,contact:12,col:'#b48cff',pts:60,act:1,desc:'Питает щит ядра Стража. Уничтожьте все заряды, чтобы вызвать перегрузку ядра.'},
  seeker:{name:'Искатель',hp:10,spd:175,r:8,xp:0,contact:12,col:'#ff4f6e',pts:10,act:1,desc:'Самонаводящийся снаряд Стража и Глушителя. Сбивается одним-двумя попаданиями.'},
  boss:{name:'Страж',hp:1800,spd:0,r:54,xp:0,contact:22,col:'#b48cff',pts:5000,act:1,desc:'Три фазы. Ядро неуязвимо, пока живы заряды. Без зарядов ядро уходит в перегрузку: атаки замирают, урон по ядру ×1,5.'},
  // ---- Акт II ----
  moth:{name:'Мотылёк',hp:6,spd:135,r:7,xp:1,contact:3,col:'#ffe08a',pts:4,grp:'siege',noRet:true,act:2,m:7,desc:'Летит стаей на свет маяка и бьётся о него. Одно-два попадания. Стаю у маяка удобно снимать импульсом.'},
  leech:{name:'Пиявка',hp:14,spd:120,r:9,xp:1,contact:0,col:'#c46bff',pts:12,grp:'siege',noRet:true,act:2,m:7,desc:'Прилипает к маяку и тянет из него заряд. Урона не наносит, но каждая пиявка отнимает 0,7% заряда в секунду.'},
  carrier:{name:'Носитель',hp:60,spd:50,r:18,xp:3,contact:15,col:'#ffc46b',pts:35,grp:'siege',act:2,m:7,desc:'Медленный транспорт. У маяка сбрасывает четыре мотылька каждые 6 секунд. Сбивайте на подлёте.'},
  jammerS:{name:'Малый глушитель',hp:45,spd:90,r:13,xp:3,contact:8,col:'#4dd0ff',pts:40,grp:'sab',act:2,m:7,desc:'Встаёт у края экрана. Пока жив, зарядка маяка идёт на 30% медленнее.'},
  cutter:{name:'Резчик',hp:22,spd:150,r:10,xp:2,contact:8,col:'#5ee0ff',pts:25,grp:'sab',act:2,m:8,desc:'Летит к линии ретранслятора и режет её. Порванную линию чините, пролетая вдоль неё.'},
  tug:{name:'Буксир',hp:40,spd:75,r:14,xp:3,contact:10,col:'#c9a36b',pts:30,grp:'siege',act:2,m:8,desc:'Цепляет астероид тросом и швыряет его в маяк. Трос можно перебить выстрелом.'},
  mortar:{name:'Осадник',hp:35,spd:60,r:14,xp:3,contact:10,col:'#ff8f5a',pts:35,grp:'siege',act:2,m:8,desc:'Бьёт по маяку навесом. Место падения отмечено кругом. Снаряд можно сбить или закрыть собой.'},
  shell:{name:'Навесной снаряд',hp:4,spd:0,r:7,xp:0,contact:0,col:'#ff8f5a',pts:3,passive:true},
  phantom:{name:'Призрак',hp:30,spd:120,r:12,xp:3,contact:12,col:'#a0b4ff',pts:30,grp:'hunt',act:2,m:8,desc:'Периодически становится прозрачным и неуязвимым. Бейте, когда он плотный.'},
  shade:{name:'Тень',hp:28,spd:140,r:11,xp:3,contact:14,col:'#8a7dff',pts:35,grp:'hunt',act:2,m:9,desc:'Невидима вне света. Перед броском выдаёт себя короткой вспышкой.'},
  mirror:{name:'Зеркальщик',hp:70,spd:85,r:16,xp:5,contact:14,col:'#dfe8ff',pts:60,grp:'hunt',act:2,m:9,desc:'Щит спереди отражает ваши снаряды обратно в вас. Уязвим с флангов и сзади, таран его пробивает.'},
  hive:{name:'Матка',hp:120,spd:60,r:22,xp:6,contact:10,col:'#ffcf4d',pts:80,grp:'siege',act:2,m:9,desc:'Неподвижный узел у края. Каждые 4 секунды выпускает двух мотыльков.'},
  shocker:{name:'Шокер',hp:32,spd:95,r:12,xp:3,contact:10,col:'#6bf0ff',pts:35,grp:'hunt',act:2,m:9,desc:'Разряд на 3 секунды отключает ваш рывок. После гибели оставляет такое же поле.'},
  vortex:{name:'Вихрь',hp:60,spd:40,r:16,xp:5,contact:10,col:'#7d6bff',pts:55,grp:'sab',act:2,m:9,desc:'Гравитационная воронка тянет корабль, снаряды, ячейки и врагов. Хорошее место для импульса.'},
  twin:{name:'Близнецы',hp:35,spd:110,r:12,xp:3,contact:12,col:'#ff6bd0',pts:40,grp:'hunt',act:2,m:10,desc:'Пара, связанная лучом. Если убить одного, второй воскресит его через 3 секунды. Добивайте обоих.'},
  thief:{name:'Похититель',hp:30,spd:175,r:10,xp:3,contact:6,col:'#9dff6b',pts:40,grp:'sab',act:2,m:10,desc:'Крадёт ячейку из вашего трюма или с поля и улетает. Догоните — груз выпадет.'},
  hunter:{name:'Охотник',hp:90,spd:160,r:14,xp:6,contact:18,col:'#ff2e4a',pts:90,grp:'hunt',act:2,m:10,desc:'Повторяет ваши рывки с задержкой 0,5 с — туда, куда вы прыгнули. Рывок в сторону и обратно заставит его промахнуться.'},
  commander:{name:'Командир',hp:80,spd:60,r:17,xp:6,contact:12,col:'#ffa63d',pts:80,grp:'siege',act:2,m:10,desc:'Ускоряет врагов рядом с собой на 25%. Без него наступление вязнет.'},
  cruiser:{name:'Осадный крейсер',hp:180,spd:45,r:22,xp:12,contact:25,col:'#ff7a5a',pts:250,grp:'siege',act:2,m:10,desc:'Корабль из частей: два двигателя, орудие и ядро. Двигатели замедляют, орудие бьёт по маяку. Выбирайте, что ломать.'},
  cpart:{name:'Узел крейсера',hp:60,spd:0,r:11,xp:2,contact:0,col:'#ff9a7a',pts:40,grp:'siege'},
  antenna:{name:'Антенна',hp:40,spd:0,r:10,xp:1,contact:0,col:'#4dd0ff',pts:30},
  decoy:{name:'Ложный маяк',hp:150,spd:0,r:26,xp:0,contact:0,col:'#8fe9ff',pts:50},
  crate:{name:'Контейнер',hp:60,spd:0,r:16,xp:0,contact:0,col:'#8fe9ff',pts:50,passive:true},
  lock:{name:'Замок ворот',hp:300,spd:0,r:24,xp:0,contact:0,col:'#b48cff',pts:200},
  jam:{name:'Глушитель',hp:2000,spd:0,r:46,xp:0,contact:22,col:'#4dd0ff',pts:8000,act:2,m:10,desc:'Источник помех. Фаза 1: антенны глушат маяк и закрывают ядро. Фаза 2: ложный маяк уводит автоприцел, цели отмечайте вручную. Фаза 3: тьма, ядро открывается только во вспышки маяка (каждые 16 с на 4,5 с).'}
};
const CODEX_ORDER=['scout','gunner','rammer','splitter','mite','miner','shielder','lancer','guard','pylon','seeker','boss',
  'moth','leech','carrier','jammerS','cutter','tug','mortar','phantom','shade','mirror','hive','shocker','vortex','twin','thief','hunter','commander','cruiser','jam'];
const STATIC=new Set(['pylon','boss','jam','cpart','antenna','decoy','shell','lock','inventor','invcell','invcore','obheart','obseg']);
const HEAVY=new Set(['lock','boss','pylon','jam','antenna','decoy','cruiser','cpart','hive','jammerS','crate','shell','mine','guard','inventor','invcell','invcore','obheart','obseg']);
