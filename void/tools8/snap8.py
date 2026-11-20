#!/usr/bin/env python3
# VØID · этап 8 · snap8 — снимки состояния исходников после внутренних патчей (откат к последнему зелёному).
#   python3 tools8/snap8.py save    ИМЯ     → snap/ИМЯ/tree.tar.gz (src без аудио + build/*.json) и SHA256SUMS (всё, включая аудио)
#   python3 tools8/snap8.py verify  ИМЯ     → сверить текущие src/ и build/ со снимком (0 — совпадает)
#   python3 tools8/snap8.py restore ИМЯ     → вернуть src/ и build/ к снимку; аудиоблоки не хранятся повторно — сверяются по SHA
import sys, os, tarfile, hashlib, shutil, io
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
H = lambda b: hashlib.sha256(b).hexdigest()
def listing():
    out = {}
    for top in ('src', 'build'):
        for r, _, fs in os.walk(os.path.join(ROOT, top)):
            for f in fs:
                p = os.path.join(r, f); rel = os.path.relpath(p, ROOT).replace(os.sep, '/')
                if top == 'build' and rel.endswith('CHANGES.jsonl'): continue
                out[rel] = H(open(p, 'rb').read())
    return out
def save(n):
    d = os.path.join(ROOT, 'snap', n); os.makedirs(d, exist_ok=True); L = listing()
    with tarfile.open(os.path.join(d, 'tree.tar.gz'), 'w:gz') as t:
        for rel in sorted(L):
            if rel.startswith('src/assets/'): continue
            ti = t.gettarinfo(os.path.join(ROOT, rel), rel); ti.mtime = 0; ti.uid = ti.gid = 0; ti.uname = ti.gname = ''
            t.addfile(ti, open(os.path.join(ROOT, rel), 'rb'))
    open(os.path.join(d, 'SHA256SUMS'), 'w').write(''.join('%s  %s\n' % (L[k], k) for k in sorted(L)))
    print('снимок %s: %d файлов' % (n, len(L))); return 0
def want(n):
    return {l.split('  ', 1)[1].rstrip('\n'): l.split('  ', 1)[0] for l in open(os.path.join(ROOT, 'snap', n, 'SHA256SUMS'))}
def verify(n):
    W = want(n); L = listing(); bad = sorted(k for k in set(W) | set(L) if W.get(k) != L.get(k))
    print('совпадает со снимком %s' % n if not bad else 'отличия от %s (%d): %s' % (n, len(bad), bad[:10])); return 1 if bad else 0
def restore(n):
    W = want(n); L = listing()
    miss = [k for k, v in W.items() if k.startswith('src/assets/') and L.get(k) != v]
    if miss: print('ОТКАЗ: аудиоблоки не совпадают со снимком (их нет в архиве снимка): %s' % miss[:5]); return 1
    keep = {k: open(os.path.join(ROOT, k), 'rb').read() for k in W if k.startswith('src/assets/')}
    for top in ('src', 'build'):
        for r, ds, fs in os.walk(os.path.join(ROOT, top), topdown=False):
            for f in fs:
                rel = os.path.relpath(os.path.join(r, f), ROOT).replace(os.sep, '/')
                if rel.endswith('CHANGES.jsonl') or rel in keep: continue
                os.remove(os.path.join(r, f))
            if r != os.path.join(ROOT, top) and not os.listdir(r): os.rmdir(r)
    with tarfile.open(os.path.join(ROOT, 'snap', n, 'tree.tar.gz')) as t: t.extractall(ROOT)
    return verify(n)
if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) != 2 or a[0] not in ('save', 'verify', 'restore'): print(__doc__ or 'snap8 save|verify|restore ИМЯ'); sys.exit(3)
    sys.exit({'save': save, 'verify': verify, 'restore': restore}[a[0]](a[1]))
