# Changelog

## [1.0.1] - 2026-02-03

### Fixed
- **Backend Stability**: Wrapped the `processEvents` loop in `keyboard-helper-child-process.js` with a `try-catch` block. This prevents the entire child process from crashing when the native hook encounters a transient error or invalid key state.
- **Patcher Robustness**: `patch-renderer.js` now verifies the existence of the target code block before applying changes, preventing file corruption if the application version differs or is already patched.
