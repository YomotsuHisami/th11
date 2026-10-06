# th11

[![QQ Group 1124121427](https://img.shields.io/badge/QQ%20Group-1124121427-12B7F5?logo=tencentqq)](https://qm.qq.com/q/eeUrxIltug?from=tim)

A high-fidelity, portable reimplementation of 東方地霊殿　～ Subterranean Animism ver 1.00a.

## Layout

- `th11_web/`: TH11 game, SDL runtime, launcher integration, documentation, and source tests.
- `portable/`: shared GLES renderer, input code, SDL support code, and bundled third-party source dependencies.

## Build

The source tree follows the same shared workspace/toolchain layout used by TH08 and TH10. See `th11_web/docs/BUILD.md` for the current build, validation, and packaging commands.

Generated build outputs are written below `th11_web/artifacts/` and are intentionally not tracked.

## Assets and licensing

This repository does not include the original Touhou executable, game data, music, replay, save files, or private development reference material. A runnable package must be assembled locally from files you are legally allowed to use.

Licensing is component-specific. Keep the notices and licenses beside each bundled component; no blanket license is asserted for the original game or its assets.