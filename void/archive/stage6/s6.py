# Этап 6+7 · загрузчик патчей ARCH·85–93 поверх цепочки этапов 4–5 (kit/arch74.py + stage5/arch74_81…84.py; сами они не меняются).
#   python3 stage6/s6.py apply <in.html> <out.html> 85 [86 …]    — накладывает по порядку, печатает SHA, пишет <out>.js
#   python3 stage6/s6.py strip <cand.html> <ref.html> 85 [86 …]  — снимает в обратном порядке и сравнивает с эталоном байт в байт
#   python3 stage6/s6.py chain <in.html> <outdir> 85 86 …         — строит промежуточные сборки b<ключ>.html для каждого шага
# Ключи патчей — строки ('85', '90a' …): маркеры блоков пишутся как «ARCH·<ключ>».
import sys,os,hashlib
R=os.path.dirname(os.path.abspath(__file__));R5=os.path.join(R,'..','stage5')
args=sys.argv[1:]
KIT=None
if '--kit' in args:i=args.index('--kit');KIT=args[i+1];del args[i:i+2]
KIT=KIT or os.environ.get('VOID_KIT') or os.path.join(R,'..','kit')
sys.path.insert(0,os.path.abspath(KIT))
import arch74 as A
for n in (81,82,83,84):
    f=os.path.join(R5,'arch74_%d.py'%n)
    if os.path.exists(f):exec(open(f,encoding='utf8').read(),A.__dict__)
END6='/* ▲▲▲ ARCH·%s · КОНЕЦ ВЫРЕЗАЕМОГО БЛОКА ▲▲▲ */\n'
A.__dict__['END6']=END6
ORDER=['85','86','87','88','89','89b','90a','90b','91','92','93']
for k in ORDER:
    f=os.path.join(R,'arch74_%s.py'%k)
    if os.path.exists(f):exec(open(f,encoding='utf8').read(),A.__dict__)
def _r(name):
    for d in (R,R5):
        p=os.path.join(d,name)
        if os.path.exists(p):return open(p,encoding='utf8').read()
    return A._r(name)
def pairs(n):
    st=A.STAGES[n];J=_r(st['J']).strip()
    P=[('<div class="ver" id="verTag">%s</div>'%st['vf'],'<div class="ver" id="verTag">%s</div>'%st['vt']),
       ("const VER_TAG='%s';"%st['vf'],"const VER_TAG='%s';"%st['vt']),
       ('<dl class="kv"><dt>%s</dt>'%st['vf'],'<dl class="kv"><dt>%s</dt><dd>%s</dd><dt>%s</dt>'%(st['vt'],J,st['vf'])),
       (END6%st['after'],END6%st['after']+st['pre'])]
    return P+list(st['sites'])
def apply(s,n):
    for i,(a,b) in enumerate(pairs(n)):
        k=s.count(a)
        if k!=1:raise ValueError('m%s: якорь №%d найден %d раз: %s'%(n,i,k,a[:120]))
        s=s.replace(a,b)
    return s
def strip(s,n):
    for i,(a,b) in reversed(list(enumerate(pairs(n)))):
        if s.count(b)!=1:raise ValueError('strip%s: место №%d найдено %d раз: %s'%(n,i,s.count(b),b[:120]))
        s=s.replace(b,a)
    return s
def sha(s):return hashlib.sha256(s.encode()).hexdigest()
def wjs(p,s):
    i=s.index('<script>\n"use strict";');j=s.index('</script>',i);open(p+'.js','w',encoding='utf8').write(s[i+8:j])
if __name__=='__main__':
    cmd,a,b=args[0:3];ns=args[3:]
    for n in ns:
        if n not in A.STAGES:sys.exit('нет патча '+n)
    s=open(a,encoding='utf8').read()
    if cmd=='apply':
        for n in ns:s=apply(s,n)
        open(b,'w',encoding='utf8').write(s);wjs(b,s);print('ok',ns,sha(s),len(s.encode()))
    elif cmd=='chain':
        os.makedirs(b,exist_ok=True)
        for n in ns:
            s=apply(s,n);p=os.path.join(b,'b%s.html'%n);open(p,'w',encoding='utf8').write(s);wjs(p,s);print(n,sha(s)[:16],len(s.encode()))
    else:
        for n in reversed(ns):s=strip(s,n)
        ref=open(b,encoding='utf8').read()
        print('равно эталону:',s==ref,'sha:',sha(s)[:16],'остатки:',[k for k in ORDER if ('ARCH·%s ·'%k) in s])
        sys.exit(0 if s==ref else 1)
