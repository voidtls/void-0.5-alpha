#!/bin/sh
# Воспроизводимая сборка и снятие ARCH·85–93 из комплекта поставки.
#   sh stage6/verify6.sh <void 1.5.24 α.html>
# 1) проверяет SHA исходной 1.5.24; 2) строит 1.5.25…1.5.35 и сверяет SHA каждого шага; 3) снимает 93…85 и сверяет с 1.5.24 побайтно;
# 4) сравнивает собранную 1.5.35 с build/void_1.5.35_test.html из поставки.
set -e
R=$(cd "$(dirname "$0")/.." && pwd); B0=$1; T=$(mktemp -d)
[ "$(sha256sum "$B0" | cut -c1-16)" = "76753e3338ab36ee" ] || { echo "это не 1.5.24 α (ожидался SHA 76753e33…)"; exit 2; }
python3 "$R/stage6/s6.py" chain "$B0" "$T" 85 86 87 88 89 89b 90a 90b 91 92 93 > "$T/chain.txt"
cat "$T/chain.txt"
want="85 1ccfbc01e1716fbc
86 5d240a4b3c25ed3a
87 1322deff8c5e347a
88 0a10696778185013
89 52e33e418ef9bdd7
89b 984ed836fc856f93
90a 7f155537b54a43c5
90b 26fddb1e33937ae3
91 8317d6ebbbde5cf4
92 f859dc1d40f847ed
93 b936a549366321b6"
got=$(awk '{print $1, $2}' "$T/chain.txt")
[ "$got" = "$want" ] && echo "SHA всех шагов совпадают" || { echo "SHA шагов НЕ совпадают"; exit 1; }
python3 "$R/stage6/s6.py" strip "$T/b93.html" "$B0" 85 86 87 88 89 89b 90a 90b 91 92 93
for F in "$R/build/void_1.5.35_test.html" "$R/../build/void_1.5.35_test.html"; do [ -f "$F" ] && cmp "$T/b93.html" "$F" && echo "собранная 1.5.35 = build/void_1.5.35_test.html побайтно"; done
rm -rf "$T"
