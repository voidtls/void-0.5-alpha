# ---------- 90b · FPS ----------
# Сгенерировано stage6/gen/gen90.py.
PRE_='/* ▼▼▼ ARCH·90b · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.32 α · FPS: строка «КАДРЫ» на ПК)\n   Исполняемого кода нет. layout63 больше не убирает строку «КАДРЫ» на ПК (при A-27 вкл.); «МАСШТАБ» и «КАЧЕСТВО» на ПК скрыты, как раньше.\n   Решение владельца Р2; ожидание теста L03 (kit/q310.py) обновлено по его тексту. Откат — снятие патча 90b. */\n'+END6%'90b'
S_=[('for(const s of [\'zoom\',\'quality\',\'fps\']){const el=B.querySelector(`[data-seg="${s}"]`);if(!el)continue;if(desk){const r=rowOf(el);used.add(r);r.remove();}else put(\'scr\',el,s);}', 'for(const s of [\'zoom\',\'quality\',\'fps\']){const el=B.querySelector(`[data-seg="${s}"]`);if(!el)continue;if(desk&&!(s===\'fps\'&&ARCH.fc27)){const r=rowOf(el);used.add(r);r.remove();}else put(\'scr\',el,s);}/* ARCH·90b: «КАДРЫ» — и на ПК */')]
STAGES['90b']=dict(vf='1.5.31 α',vt='1.5.32 α',J='m90b_journal.txt',pre=PRE_,after='90a',sites=S_)
