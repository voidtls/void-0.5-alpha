# Подтверждение SHA

| Файл | SHA-256 |
|---|---|
| эталон 1.5.35 (`void/archive/void_1.5.35_reference.html`) | `b936a549366321b63b8f0c6ac5a8c34013150cffac9ea584b71d3c09c7f4c034` |
| сборка из src/ (`void/dist/void.html`, `void_1.5.35_stage8.html`) | `b936a549366321b63b8f0c6ac5a8c34013150cffac9ea584b71d3c09c7f4c034` |
| требуемый (разрешение владельца) | `b936a549366321b63b8f0c6ac5a8c34013150cffac9ea584b71d3c09c7f4c034` |

Совпадение: **да**. Проверить самостоятельно: `cd void && python3 tools8/build8.py build && sha256sum dist/void.html`.
