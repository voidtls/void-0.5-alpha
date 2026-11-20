#!/bin/sh
# Итоговая приёмка 1.5.35 (b175) против 1.5.24 (b164). Всё последовательно (машина — 2 ядра; параллельные прогоны искажают время).
#   sh stage6/final6.sh [шаги…]   без шагов — все по порядку. Журнал — out6/final/progress.txt
R=$(cd "$(dirname "$0")/.." && pwd); cd "$R"; O=$R/out6/final; mkdir -p $O
B0=builds5/void_b164.html; B=builds6/void_b175.html
log(){ echo "$(date +%H:%M:%S) $*" >> $O/progress.txt; }
STEPS=${*:-"q310 stands gkeys st6 self tdep c5 q390 save shots trace fps perf k reg regsave"}
for w in $STEPS; do case $w in
 q310) cp stage6/q310_new.py kit/q310.py; log q310 восстановлен $(sha256sum kit/q310.py | cut -c1-12);;
 stands) python3 tools5/run5.py stands $B $O/s --ref out5/p84/s164 > $O/s.out 2>&1; log stands $?
         VOID_A24=1 python3 tools5/run5.py stands $B $O/sa24 --ref out5/p84/s164a24 > $O/sa24.out 2>&1; log a24 $?;;
 gkeys) python3 tools5/st5.py gkeys $B $O/gkeys_175.json > $O/gkeys_175.out 2>&1; python3 tools5/compare5.py out5/p84/gkeys_164.json $O/gkeys_175.json > $O/gkeys_cmp.txt 2>&1; log gkeys $?;;
 st6) for m in trans saveid; do python3 tools6/st6.py $m $B $O/${m}_175.json > $O/${m}_175.log 2>&1; python3 tools6/st6.py cmp out6/st6/${m}_164.json $O/${m}_175.json > $O/${m}_cmp.txt 2>&1; log st6 $m $?; done;;
 self) python3 tools6/selftest6.py $B > $O/selftest6.txt 2>&1; log selftest6 $?; node tools6/own6.js $B > $O/own6.txt 2>&1; log own6 $?;;
 tdep) python3 tools6/tdep6.py $B0 $B --json $O/tdep6.json > $O/tdep6.txt 2>&1; log tdep6 $?;;
 c5) python3 tools6/c5probe.py $B $O/c5probe_175.json > $O/c5probe.txt 2>&1; log c5probe $?;;
 q390) (cd kit && GAME_URL=file://$R/$B python3 q390.py > $O/q390.log 2>&1); log q390 $?;;
 save) python3 tools6/save6.py $B $B0 $O/save6.json > $O/save6.txt 2>&1; log save6 $?;;
 shots) python3 tools6/shots6.py $B $O/shots > $O/shots.txt 2>&1; log shots $?;;
 trace) python3 tools6/trace7.py run builds6/void_b166.html $O/tr166.json > $O/tr166.log 2>&1; python3 tools6/trace7.py run builds6/void_b165.html $O/tr165.json > $O/tr165.log 2>&1
        python3 tools6/trace7.py run builds6/void_b165.html $O/tr165b.json > $O/tr165b.log 2>&1
        python3 tools6/trace7.py cmp $O/tr165.json $O/tr166.json > $O/tr_cmp.txt 2>&1; python3 tools6/trace7.py cmp $O/tr165.json $O/tr165b.json > $O/tr_aa.txt 2>&1; log trace7 $?;;
 fps175) python3 tools6/fps6.py run $B $O/fps_175.json > $O/fps_175.log 2>&1; log fps175 $?; python3 tools6/fps6.py sum $O/fps_164.json $O/fps_175.json > $O/fps_sum.txt 2>&1;;
 fps) python3 tools6/fps6.py run $B0 $O/fps_164.json > $O/fps_164.log 2>&1; log fps164 $?; python3 tools6/fps6.py run $B $O/fps_175.json > $O/fps_175.log 2>&1; log fps175 $?
      python3 tools6/fps6.py sum $O/fps_164.json $O/fps_175.json > $O/fps_sum.txt 2>&1; log fpssum $?;;
 perf) python3 tools5/perf5.py $B0 $B $O/perf_ab.json 6 > $O/perf_ab.log 2>&1; log perf_ab $?; python3 tools5/perf5.py $B0 $B0 $O/perf_aa.json 6 > $O/perf_aa.log 2>&1; log perf_aa $?
       python3 tools5/perfsum5.py $O/perf_ab.json > $O/perf_ab_sum.txt 2>&1; python3 tools5/perfsum5.py $O/perf_aa.json > $O/perf_aa_sum.txt 2>&1;;
 k) sh stage6/prof6.sh $B $O/k "" k e24; log k-e24 done;;
 reg) python3 tools5/run5.py reg $B $O/reg --base out5/p84/reg24 --aa baseline/reg20_aa > $O/reg.out 2>&1; log reg $?;;
 regsave) python3 tools5/run5.py reg $B $O/regsave --suites q71save,q73save --base out5/p84/reg24_save --aa baseline/reg20_save > $O/regsave.out 2>&1; log regsave $?;;
esac; done
log ALLDONE
