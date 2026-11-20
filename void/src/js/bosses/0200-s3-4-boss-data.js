// ===== 0.5.6: боссы секторов III–IV, состав волн — данные =====
Object.assign(EDEF,{
  inventor:{name:'Инвентаризатор',hp:10000,spd:40,r:60,xp:0,contact:24,col:'#9fd8ff',pts:12000,act:3,m:14,sec:2,sb:'inv',sbp:true,
    desc:'Корабль-картотека Холодного архива. Каждые 12 с описывает две ваши системы (щит, рывок, орудие): разбейте ячейку с нужной подписью за 4 с — иначе система уйдёт на хранение на 8 с. Разбитая ячейка открывает корпус на 6 с (урон ×1,5), закрытый корпус держит урон ×0,5. Фаза 2 выпускает записи прежних циклов — копии, стреляющие вашим орудием; открытая ячейка в это время проводит урон в корпус ×2. Фаза 3 замораживает арену от краёв, печати на кольце льда ломаются рывком. Каждые 14 с Архив вызывает звено охраны хранилища (разведчики и стрелки, затем изморозь и тараны, в конце — охотники и копейщики). В финале выбор: ядро памяти или ядро холода.',
    lore:'«Объект 013. Цикл XXXII. Отклонение от эталона зафиксировано. Привести». Архив не воюет с вами — он сверяет вас с предыдущими тридцатью одним.'},
  invcell:{name:'Ячейка каталога',hp:160,spd:0,r:14,xp:0,contact:8,col:'#bfe8ff',pts:60,passive:true,sbp:true},
  invcore:{name:'Ядро картотеки',hp:300,spd:0,r:22,xp:0,contact:0,col:'#dff6ff',pts:0,passive:true,sbp:true},
  obheart:{name:'Обод',hp:7000,spd:0,r:36,xp:0,contact:24,col:'#ffb060',pts:18000,act:3,m:18,sec:3,sb:'obod',sbp:true,
    desc:'Ремонтная станция-кольцо колонии «Тихая». Кольцо из восьми сегментов окружает корабль и вращается; наружу — только через пробоину. Сервисный узел сидит в сегменте и уязвим лишь в пробоине, при переезде между сегментами (1,5 с) или после красного дока. Каждые 14 с открываются два дока: зелёный РЕМОНТ (снимает износ, возвращает щит и даёт 6 с неуязвимости, но забирает модуль до конца боя; прочность не чинит — в Хрониках ничего не чинят) и красный УТИЛИЗАЦИЯ (пробоина и доступ к узлу на 9 с, но ремонтники охотятся на вас и вешают износ). Спицы ржавчины сбивают щит. Фаза 3 сжимает кольцо. Каждые 14 с внутрь кольца прибывают «другие клиенты» — звено атакующих врагов. В финале заказ-наряд: восстановить корабль до заводского или списать станцию.',
    lore:'Клиент 013, посещение 4 103. Износ корпуса 12%. Протокол обслуживания написан Э. В.: обслуживать всех, вопросов не задавать. Людей не осталось — остались вы.'},
  obseg:{name:'Сегмент «Обода»',hp:350,spd:0,r:16,xp:0,contact:0,col:'#c96a2a',pts:40,passive:true,sbp:true},
  rustcopy:{name:'Ржавая копия',hp:60,spd:150,r:13,xp:0,contact:12,col:'#c96a2a',pts:30,fixed:true,noRet:true}
});
// медленные/«занудные» и динамичные типы (0.5.6, исправление 53)
const SEC_SLOW=new Set(['guard','shielder','commander','hive','vortex','corroder','cruiser','crate','miner']);
const SEC_FAST=new Set(['hunter','phantom','shade','rammer','lancer','shocker','frost','repairer','seeker','scout','thief','twin','cutter']);
const SEC_CHASER=new Set(['rammer','hunter','shade','seeker','scout','mite','thief','moth','phantom','cutter']);
const SEC_LIM_END={guard:1,corroder:1,hive:0,vortex:0,commander:1};
SEC_SCALE[2].pace=.15;SEC_SCALE[3].pace=.20;
function secGenWaves(m,R){const C=SEC_WAVES[m];if(!C)return null;const boss=BOSS_LV.has(m),nW=boss?5:(m%3===0?6:5),waves=[];
  const pool=C.nw.concat(C.old),fastU=[...new Set(pool.filter(t=>SEC_FAST.has(t)))],pick=arr=>arr[Math.floor(R()*arr.length)];
  for(let w=0;w<nW;w++){const size=Math.max(4,Math.round((7+(m-10)*.3+w*1.3)*(m>=15?.6:.7))),wave=[],cnt={};
    const share=Math.min(.6,C.share+w*.03);
    for(let k=0;k<size;k++){let pl=R()<share?C.nw:C.old,ty=pick(pl);
      if(SEC_LIM[ty]!==undefined&&(cnt[ty]||0)>=SEC_LIM[ty])ty=C.old.includes('frost')?'frost':C.old[0];
      if(SEC_LIM[ty]!==undefined&&(cnt[ty]||0)>=SEC_LIM[ty])ty=C.nw[0];
      cnt[ty]=(cnt[ty]||0)+1;wave.push(ty);}
    if(w>=nW-2&&fastU.length){ // 53: последние волны — вдвое меньше бронированных, больше динамичных
      let k=0;for(let i=0;i<wave.length;i++){if(SEC_SLOW.has(wave[i])){k++;if(k%2===0)wave[i]=pick(fastU);}}
      const c2={};for(let i=0;i<wave.length;i++){const t=wave[i];if(SEC_LIM_END[t]!==undefined){c2[t]=(c2[t]||0)+1;if(c2[t]>SEC_LIM_END[t])wave[i]=pick(fastU);}}
      let fast=wave.filter(t=>SEC_FAST.has(t)).length;while(fast<Math.ceil(wave.length*.6)){wave.push(pick(fastU));fast++;}
      if(!boss&&w===nW-1)wave.push('pack:'+pick(fastU));}
    if(w<2&&fastU.length)for(let i=0;i<2;i++)wave.push(pick(fastU)); // старт: +2 динамичных врага
    waves.push(wave);}
  if(C.brood)for(const wv of waves){let n=0;for(let i=0;i<wv.length;i++){if(n>=4)break;if(!wv[i].startsWith('pack:')&&!NO_BROOD.has(wv[i])&&R()<C.brood){wv[i]='cocoon';n++;}}}/* 0.7.4: инкубация */
  if(C.debut)waves.unshift([C.debut]);
  return waves;}
SEC_TEXT[14]={name:'Холодный архив · картотека',hint:['Инвентаризатор описывает ваши системы: за 4 секунды разбейте ячейку с подписью той системы, которая нужнее. Разбитая ячейка открывает корпус на 6 секунд.','Фаза 2 выпускает записи прежних циклов — они стреляют вашим орудием. Фаза 3 замораживает арену от краёв: печати ломаются рывком. В финале придётся выбрать, что стереть.']};
SEC_TEXT[18]={name:'Ржавые хроники · сервисный узел',hint:['Обод окружает корабль кольцом. Узел уязвим в пробоине, при переезде и после красного дока. Зелёный док снимает износ и даёт 6 с неуязвимости, но забирает модуль; красный открывает узел, но натравливает ремонтников. Прочность здесь не восстанавливается ничем.','Спицы ржавчины сбивают щит, кольцо в фазе 3 сжимается. В финале Обод спросит, что делать с заказом.']};


const NOAUTO=new Set(['mine','crate','shell','hull']);
const NOBC=new Set(['boss','pylon','jam','antenna','decoy','cpart','shell','crate','mine','leech']);
const AFX={armor:{name:'Бронированный',col:'#cfd8e6',d:'первые 3 попадания блокируются'},split:{name:'Расщепляющийся',col:'#e86bff',d:'при гибели распадается на осколки'},
  fast:{name:'Ускоренный',col:'#4dffa6',d:'+35% скорости'},boom:{name:'Взрывной',col:'#ff7a3d',d:'взрывается при гибели'},
  screen:{name:'Экранированный',col:'#8fe9ff',d:'иммунитет к импульсу'},vamp:{name:'Вампир',col:'#ff2e4a',d:'лечится, когда бьёт маяк'}};
const AFX_OK=new Set(['scout','gunner','rammer','splitter','miner','shielder','lancer','guard','cutter','tug','mortar','phantom','mirror','shocker','commander','carrier','hunter']);

