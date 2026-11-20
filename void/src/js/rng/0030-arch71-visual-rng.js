/* ▼▼▼ ARCH·71 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.11 α · этап 3: визуальная случайность в симуляции — на VFXR65)
   В отмеченных местах симуляции и HUD визуальные числа (частицы, искры, дрожание) берутся не из игрового Math.random,
   а из уже существующего VFXR65 — так эффекты, «Меньше», lowFx, качество и частота кадров больше не сдвигают ход боя.
   Группы и флаги отката (window.__archOff=['A-n'] до загрузки; читаются один раз при загрузке):
   A-14 ядро боя · A-15 мир и сюжет · A-16 боссы и сектора · A-17 «Ноль» · A-18 HUD и мини-карта (частота кадров).
   С выключенным флагом группа берёт числа из текущего Math.random — ровно как в 1.5.10. Новых генераторов и обёрток нет.
   Места в коде: vR<n>() / vrnd<n>(a,b). */
var VR71_1=()=>Math.random(),VR71_2=()=>Math.random(),VR71_3=()=>Math.random(),VR71_4=()=>Math.random(),VR71_5=()=>Math.random();
function vR1(){return VR71_1();}function vrnd1(a,b){return a+VR71_1()*(b-a);}
function vR2(){return VR71_2();}function vrnd2(a,b){return a+VR71_2()*(b-a);}
function vR3(){return VR71_3();}function vrnd3(a,b){return a+VR71_3()*(b-a);}
function vR4(){return VR71_4();}function vrnd4(a,b){return a+VR71_4()*(b-a);}
function vR5(){return VR71_5();}function vrnd5(a,b){return a+VR71_5()*(b-a);}
function arch71Boot(){if(typeof VFXR65!=='function'){console.warn('ARCH·71: VFXR65 не найден — A-14…A-18 не применены');return;}
  if(!ARCH.off['A-14'])VR71_1=VFXR65;if(!ARCH.off['A-15'])VR71_2=VFXR65;if(!ARCH.off['A-16'])VR71_3=VFXR65;if(!ARCH.off['A-17'])VR71_4=VFXR65;if(!ARCH.off['A-18'])VR71_5=VFXR65;}
/* ▲▲▲ ARCH·71 · КОНЕЦ ВЫРЕЗАЕМОГО БЛОКА ▲▲▲ */
