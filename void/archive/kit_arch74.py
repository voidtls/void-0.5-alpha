# Этап 4 (ARCH·72…ARCH·75): общий модуль патчей. Каждый патч = смена версии + вырезаемый блок-прелюдия + точечные правки.
# apply(s,n) накладывает патч n поверх сборки предыдущего; strip(s,n) снимает его байт в байт.
import os
D='/home/claude/VOID_stage8/testkit_run/void-tests-1.5.35/kit/'
END='/* ▲▲▲ ARCH·%d · КОНЕЦ ВЫРЕЗАЕМОГО БЛОКА ▲▲▲ */\n'
def _r(name):return open(D+name,encoding='utf8').read()

# ---------- 72 · A-19 · часы ударной паузы ----------
PRE72="""/* ▼▼▼ ARCH·72 · НАЧАЛО ВЫРЕЗАЕМОГО БЛОКА ▼▼▼ (1.5.12 α · этап 4.1: часы ударной паузы)
   A-19 · hs90 отсчитывает паузу 500 мс между слабыми ударными паузами по часам игры ARCH.clk, а не по performance.now().
   ARCH.clk — секунды: в старом цикле растёт на dt0 кадра (те же часы, что у rAF), в цикле A-20 — на шаг 1/60.
   Выключение: window.__archOff=['A-19'] до загрузки. */
ARCH.clk=0;
"""+END%72
S72=[
 ("const dt0=Math.min(.05,Math.max(0,(now-last)/1000));last=now;\n  try{mobTick(dt0,now);}",
  "const dt0=Math.min(.05,Math.max(0,(now-last)/1000));last=now;if(!ARCH.off['A-19'])ARCH.clk+=dt0;/* ARCH·72 A-19 */\n  try{mobTick(dt0,now);}"),
 ("function hs90(d,prio){if(!inMission()||G.state!=='play')return;const now=performance.now();",
  "function hs90(d,prio){if(!inMission()||G.state!=='play')return;const now=ARCH.off['A-19']?performance.now():ARCH.clk*1000;/* ARCH·72 A-19 */"),
]
STAGES={72:dict(vf='1.5.11 α',vt='1.5.12 α',J='m72_journal.txt',pre=PRE72,after=71,sites=S72)}
for n in (73,74,75,76,77,78,79,80):
    f=D+'arch74_%d.py'%n
    if os.path.exists(f):exec(open(f,encoding='utf8').read())

def pairs(n):
    st=STAGES[n];J=_r(st['J']).strip()
    P=[('<div class="ver" id="verTag">%s</div>'%st['vf'],'<div class="ver" id="verTag">%s</div>'%st['vt']),
       ("const VER_TAG='%s';"%st['vf'],"const VER_TAG='%s';"%st['vt']),
       ('<dl class="kv"><dt>%s</dt>'%st['vf'],'<dl class="kv"><dt>%s</dt><dd>%s</dd><dt>%s</dt>'%(st['vt'],J,st['vf'])),
       (END%st['after'],END%st['after']+st['pre'])]
    return P+list(st['sites'])
def apply(s,n):
    for a,b in pairs(n):
        k=s.count(a)
        if k!=1:raise ValueError('m%d: якорь найден %d раз: %s'%(n,k,a[:90]))
        s=s.replace(a,b)
    return s
def strip(s,n):
    for a,b in reversed(pairs(n)):
        if s.count(b)!=1:raise ValueError('strip%d: место не найдено ровно один раз: %s'%(n,b[:90]))
        s=s.replace(b,a)
    return s
