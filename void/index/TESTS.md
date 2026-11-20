<!-- Сгенерировано: python3 tools8/build8.py index. Не править вручную: check сверяет с перестроенным. -->

# Какие проверки запускать для подсистемы

Подсистема → шаги приёмки (имена шагов accept6/accept8; запуск: python3 tools8/accept8.py --steps a,b,… — частичный прогон, для выпуска не засчитывается). Карта по ТЗ этапа 8, раздел 15.1 (шаг 7). Привязка исторических наборов kit/kit6 к отдельным секторам не выводилась (нет источника, который это доказывает), поэтому сектора, враги и боссы проверяются полной регрессией reg и K-стендом, а не «своими» наборами.

| Подсистема | Проверки |
|---|---|
| arch | static; arch; trace; stands; a24; k |
| audio | stands; k (ГСЧ звука изолирован iso63); reg |
| boot | static; stands; variants8; reg |
| bosses | k; e24; trace; arct; reg |
| core | gkeys; st6; k; e24; arct; reg |
| dev | stands; st6; reg |
| enemies | k; e24; trace; arct; reg |
| hangar | save; st6; reg |
| input | fpsx; reg; ручная проверка касаний (MANUAL_PLATFORMS.md) |
| loop | fps; fpsx; shots; perf; k; e24; a24 |
| mission | k; e24; st6; reg |
| opt/bg | variants8 (небо: 0 вызовов, K без bg = полной); shots; perf |
| opt/cine | variants8; build8 check (dangle: cut.cine.live); shots; reg |
| player | k; e24; a24; trace; reg |
| render | shots; perf; fps; k (визуальный ГСЧ vR не влияет на игру); variants8 |
| rng | k; e24; trace; arct; variants8 (защита неба: 0 вызовов) |
| runlvl | st6; save; k; reg |
| saves | save; regsave (q71save, q73save); st6; gkeys |
| screens | st6; gkeys; c5; reg |
| sectors | k; e24; arct; reg |
| settings | save; shots; fps; reg |
| story | save; st6; reg |
| targeting | stands (aimman, prio); k; trace |
| tutorial | st6; reg; flaky (наборы обучения нестабильны под нагрузкой — сверять с реестром known6) |
| ui | shots; st6; reg |
| world | k; st6; save; reg |

## Всегда

- python3 tools8/build8.py check — покрытие, порядок, стражи, синтаксис, инициализация, висячие ссылки, актуальность индексов
- python3 tools8/variants8.py — четыре варианта сборки в браузере (без bg — без ошибок; без cine — только cut.cine.live)
- при смене SHA игры: k, e24, trace, arct (ГСЧ, физика, состояние против 1.5.24) — ТЗ 19.2 п. 11
- перед выпуском: полная приёмка python3 tools8/accept8.py
