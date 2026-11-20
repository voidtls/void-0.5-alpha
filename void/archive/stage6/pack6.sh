#!/bin/sh
# Сборка архива поставки этапов 6+7 и FPS.  sh stage6/pack6.sh <папка-назначения>
set -e
R=$(cd "$(dirname "$0")/.." && pwd); D=$1/VOID_1.5.35_stage6-7; rm -rf "$D"; mkdir -p "$D"
cd "$R"
mkdir -p $D/build $D/src/kit $D/src/stage5 $D/src/stage6 $D/tests/kit $D/tools $D/results $D/docs
cp builds6/void_b175.html $D/build/void_1.5.35_test.html
# исходные патчи и генераторы
cp -r stage6/* $D/src/stage6/; rm -rf $D/src/stage6/__pycache__ $D/src/stage6/gen/__pycache__
cp stage5/arch74_8*.py stage5/m8*_journal.txt $D/src/stage5/
cp kit/arch74*.py kit/m*_journal*.txt $D/src/kit/
# тесты: изменённое ожидание L03 и новый набор FPS
cp kit/q310.py kit/q390.py $D/tests/kit/; cp stage6/q310_L03.diff $D/tests/
# инструменты
cp -r tools6 $D/tools/tools6; rm -rf $D/tools/tools6/__pycache__
for f in run5.py st5.py compare5.py cmpreg5.py perf5.py perfsum5.py variant5.py kjobs5.py; do cp tools5/$f $D/tools/ 2>/dev/null || true; done
# результаты
cp -r out6/final $D/results/final; mkdir -p $D/results/final_v2; cp -r out6/final_v2/k out6/final_v2/perf_ab_sum.txt out6/final_v2/perf_aa_sum.txt out6/final_v2/reg $D/results/final_v2/ 2>/dev/null || true
cp -r out6/report $D/results/report
mkdir -p $D/results/investigation $D/results/regression_1.5.30_v1 $D/results/per_patch
cp -r out6/inv170 out6/inv170L out6/inv170_v1 out6/inv175 $D/results/investigation/; cp out6/report/inv170.md $D/results/investigation/
cp out6/reg170/cmp.txt out6/reg170/cmp.json $D/results/regression_1.5.30_v1/
cp -r out6/st6 out6/fps out6/p87 $D/results/per_patch/; cp out6/p85_s165.out out6/static_165.txt $D/results/per_patch/ 2>/dev/null || true
cp out6/g6_164.json out6/g6_175.json out6/w6_164.json out6/w6_175.json out6/init6_175.json out6/bulk_matrix.json $D/results/
cp tools6/chains6.json tools6/ownership6.json $D/results/
# документы
cp docs_tmp/REPORT_stage6_7.md docs_tmp/READINESS_stage8.md docs_tmp/TZ_stage6-7_FPS.md $D/docs/; cp docs_tmp/README.md $D/README.md
# удалить тяжёлые промежуточные json K-стенда, оставив итоги
find $D/results -name "*.jobs.json" -delete
cd $D && find . -type f ! -name SHA256SUMS -exec sha256sum {} \; | sort -k2 > SHA256SUMS
cd .. && rm -f VOID_1.5.35_stage6-7.zip && zip -qr VOID_1.5.35_stage6-7.zip VOID_1.5.35_stage6-7 && ls -la VOID_1.5.35_stage6-7.zip
