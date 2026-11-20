#!/bin/sh
# Профильные динамические проверки сборки этапа 6+7 против эталона 1.5.24 (out5/p84). Без изменения сборки.
#   sh stage6/prof6.sh <сборка.html> <папка> "<allow: fn1,fn2>" [stands] [a24] [k] [e24]
# stands — boot/trace/aimman/prio/probes против out5/p84/s164; a24 — то же при A-24 (VOID_A24=1) против s164a24;
# k — K-стенд (429 заданий) против kit/t72/k80.jsonl (= 1.5.20 = 1.5.24 побитно); e24 — 35 заданий A-24 против kit/t72/e24.jsonl.
R=$(cd "$(dirname "$0")/.." && pwd); B=$(cd "$(dirname "$1")" && pwd)/$(basename "$1"); O=$2; A=$3; shift 3; mkdir -p $O
log(){ echo "$(date +%H:%M:%S) $*" >> $O/progress.txt; }
for w in "$@"; do case $w in
 stands) python3 $R/tools5/run5.py stands $B $O/s --ref $R/out5/p84/s164 --allow "$A" > $O/s.out 2>&1; log stands $?;;
 a24) VOID_A24=1 python3 $R/tools5/run5.py stands $B $O/sa24 --ref $R/out5/p84/s164a24 --allow "$A" > $O/sa24.out 2>&1; log a24 $?;;
 k) python3 $R/tools5/run5.py k $B $R/kit/t72/jobs_k80.json $O/k.jsonl --ref $R/kit/t72/k80.jsonl > $O/k.out 2>&1; log k $?;;
 e24) python3 $R/tools5/variant5.py $B ${B%.html}_a24v.html --a24 > /dev/null && python3 $R/tools5/run5.py k ${B%.html}_a24v.html $R/kit/t72/jobs_e24.json $O/e24.jsonl --ref $R/kit/t72/e24.jsonl > $O/e24.out 2>&1; log e24 $?;;
esac; done
log ALLDONE
