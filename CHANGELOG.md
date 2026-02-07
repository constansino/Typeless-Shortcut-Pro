# Changelog

## [1.0.3] - 2026-02-07

### Verified
- **Typeless v0.9.4 Compatibility**: Confirmed that all patch logic remains valid for the latest version.
- **ASAR Handling**: Added instructions to rename the original `app.asar` to prevent the application from bypassing the patched `app` folder.

## [1.0.2] - 2026-02-03

### Fixed
- **Stuck Keys Watchdog**: Implemented a watchdog mechanism in `keyboard-helper-child-process.js`. If shortcut keys are detected as "pressed" for more than 3 seconds (often caused by system interruptions like screenshots or UAC), the system now automatically resets the keyboard state. This fixes the "ghost key" bug where Typeless would falsely register previous shortcuts (e.g., Shift+Ctrl+Z) when setting new ones.

## [1.0.1] - 2026-02-03

### Fixed
- **Backend Stability**: Wrapped the `processEvents` loop in `keyboard-helper-child-process.js` with a `try-catch` block. This prevents the entire child process from crashing when the native hook encounters a transient error or invalid key state.
- **Patcher Robustness**: `patch-renderer.js` now verifies the existence of the target code block before applying changes, preventing file corruption if the application version differs or is already patched.
