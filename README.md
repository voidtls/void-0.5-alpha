# VØID

**A 2D sci-fi action game built with JavaScript, HTML and CSS.**

![Status](https://img.shields.io/badge/status-early_alpha-orange)
![Language](https://img.shields.io/badge/language-Russian-blue)
![Version](https://img.shields.io/badge/build-1.5.35-lightgrey)
![License](https://img.shields.io/badge/license-MIT-green)

> [!WARNING]
> **VØID is still in early alpha.**
>
> This is an unfinished game. Much of the planned content is not available yet, and some existing features are incomplete or experimental.
>
> Expect bugs, balancing problems and changes between updates. The current build is intended for testing and feedback, not as a finished release.
>
> **The game is currently available in Russian only.** There is no English localization.

## About

VØID is a browser-based action game set in a science-fiction world divided into sectors.

The gameplay focuses on combat, missions, exploration and boss fights. Different enemies have their own attacks and behaviors, and progressing through the game gradually introduces new challenges.

There is also a story behind the events of VØID, although much of it remains inaccessible in the current alpha.

The game is developed primarily in JavaScript and runs as a standalone HTML file.

### Current state

Only part of the planned game is playable.

The alpha includes the foundations of combat, missions, sector progression and several other gameplay systems. However, the available content does not represent the full scope of the project.

Some things to keep in mind:

- Not all sectors and missions are accessible.
- Some mechanics and progression systems still need work.
- Game balance is not final.
- Bugs and performance issues are possible.
- Existing content may change during development.
- Future versions may not be fully compatible with older saves.

There is currently no announced date for a complete release.

## Download and Play

The repository includes a standalone HTML build.

**Current build: 1.5.35 Alpha**

[Download the HTML game file](void_1.5.35_stage8.html)

To run it:

1. Download `void_1.5.35_stage8.html`.
2. Open the file in a modern desktop browser.
3. Play locally. No server installation is required.

The game interface and in-game text are in Russian.

If something breaks, please report it through [GitHub Issues](https://github.com/voidtls/void-0.5-alpha/issues).

## Source Code

VØID began as a single HTML file containing the game logic and resources.

As the project grew, maintaining everything in one file became increasingly difficult. The codebase was later separated into modules, with a build system that combines them back into a standalone HTML file.

The current Stage 8 source structure contains:

- 124 JavaScript modules across 25 subsystem directories.
- Python scripts for building and verifying the game.
- Source manifests and integrity checks.
- Regression tests and development snapshots.
- Documentation of the modularization process.

The modularization was designed to preserve existing gameplay behavior while making the project easier to maintain.

### Repository Layout

```text
void-0.5-alpha/
├── void/
│   ├── src/           # Game source code
│   ├── build/         # Build manifests
│   ├── tools8/        # Build and testing scripts
│   ├── dist/          # Generated builds
│   ├── docs/          # Technical documentation
│   ├── archive/       # Archived development files
│   ├── index/         # Source indexes
│   ├── snap/          # Development snapshots
│   └── journal8/      # Development records
│
├── testkit/           # Test package
├── results/           # Verification results
├── void_1.5.35_stage8.html
├── review8.md
├── SHA256SUMS
├── SHA_CONFIRMATION.md
└── LICENSE
```

## Build from Source

Python 3 is required for the build script.

Clone the repository:

```bash
git clone https://github.com/voidtls/void-0.5-alpha.git
cd void-0.5-alpha/void
```

Build the game:

```bash
python3 tools8/build8.py build --out /tmp/void_check.html
```

This creates a standalone HTML file at `/tmp/void_check.html`.

To run the available verification tools:

```bash
python3 tools8/build8.py check
python3 tools8/rollback8.py
```

To calculate the checksum of your generated build:

```bash
sha256sum /tmp/void_check.html
```

For details about the build system, source organization and verification results, see the technical documents below.

## Documentation

- [Source Code Guide](void/README_SRC.md)
- [Stage 8 Report](void/REPORT_stage8.md)
- [Platform Testing Notes](void/MANUAL_PLATFORMS.md)
- [Independent Review](review8.md)
- [SHA-256 Verification](SHA_CONFIRMATION.md)

These documents cover the source structure, build process and technical checks carried out during development.

## Feedback and Contributions

The project is open for bug reports, suggestions and pull requests.

If you're reporting a bug, please include the game version, browser and a short explanation of how to reproduce it. Screenshots or console errors are helpful when available.

Keep in mind that the project is still changing, so some parts of the code may be reorganized or replaced in future updates.

[Report a bug or suggest an improvement](https://github.com/voidtls/void-0.5-alpha/issues)

## License

The project includes an [MIT License](LICENSE) for its software.

Copyright (c) 2026 VOID_TLS.

Some assets or third-party dependencies may have separate licensing conditions. Check their applicable terms before reusing or redistributing them.
