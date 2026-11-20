#!/usr/bin/env python3
# Откат 1.5.35 → 1.5.24: снимает патчи ARCH·93…85 (stage6/s6.py strip) и проверяет результат по SHA-256 1.5.24.
#   python3 tools6/rollback6.py <void 1.5.35.html> <куда записать 1.5.24.html>
# Ничего не публикует и не трогает сохранения: только пишет файл. Выход 0 — получена ровно 1.5.24; 1 — нет; 3 — ошибка вызова.
import sys,os,hashlib
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));sys.argv_=sys.argv
if len(sys.argv)!=3:print(open(__file__,encoding='utf8').read().split('import sys')[0]);sys.exit(3)
W35='b936a549366321b63b8f0c6ac5a8c34013150cffac9ea584b71d3c09c7f4c034';W24='76753e3338ab36eefe8e6e5f945428a341de27b8e0f29b4fd8235ef0ad897776'
src=open(sys.argv[1],encoding='utf8').read()
if hashlib.sha256(src.encode()).hexdigest()!=W35:print('это не 1.5.35 α из поставки (SHA не совпадает) — откат не выполняется');sys.exit(1)
sys.argv=[sys.argv[0],'--kit',os.path.join(R,'kit')];import importlib.util
spec=importlib.util.spec_from_file_location('s6',os.path.join(R,'stage6','s6.py'))
# s6.py при импорте читает args; запускаем его функцию strip напрямую
sys.argv=['s6.py','strip','-','-'];m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
s=src
for k in reversed(m.ORDER):s=m.strip(s,k)
h=hashlib.sha256(s.encode()).hexdigest()
open(sys.argv_[2],'w',encoding='utf8',newline='').write(s)
print('1.5.24 SHA',h[:16],'— совпадает' if h==W24 else '— НЕ совпадает');sys.exit(0 if h==W24 else 1)
