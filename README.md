# VØID · этап 8 — поставка

Состав:

- `void/` — канонические модульные исходники (`src/`), манифест и инварианты (`build/`), сборщик и инструменты (`tools8/`), индексы (`index/`), итоговый HTML (`dist/`), замороженный архив 1.5.35 и патчей 85–93 (`archive/`), снимки P8.x (`snap/`), журнал (`journal8/`), документы (`docs/`); руководство разработчика — `void/README_SRC.md`, отчёт — `void/REPORT_stage8.md`, ручная проверка на устройствах — `void/MANUAL_PLATFORMS.md`.
- `void_1.5.35_stage8.html` — итоговая игра одним файлом (побайтно 1.5.35).
- `testkit/void-kit-1.5.35.tar.xz` — тестовый комплект 1.5.35 без изменений (развёртывание — README_KIT6.md внутри; затем `python3 void/tools8/accept8.py --testkit <папка комплекта>`).
- `results/` — результаты проверок P8.0–P8.7 и полной приёмки `accept8_full/` (ИТОГ.txt, accept.json, журналы шагов).
- `review8.md` — независимая перепроверка.
- `SHA256SUMS` — хэши всех файлов; `SHA_CONFIRMATION.md` — сверка SHA с 1.5.35.

Быстрая проверка (ничего в поставке не перезаписывает): `cd void && python3 tools8/build8.py build --out /tmp/void_check.html && sha256sum /tmp/void_check.html && python3 tools8/build8.py check && python3 tools8/rollback8.py`.
