# Typeless Shortcut Pro (Optimizer & Bug Fix)

**Author:** constansino  
**Version:** 1.0.0  
**License:** MIT

[English](#english) | [中文](#中文)

---

## English

### Problem Description
1.  **Shortcut Instability:** Shortcuts frequently stop working randomly, requiring a full application restart to restore functionality. This was caused by an unhandled exception in the native keyboard listener's event loop, which would crash the background child process.
2.  **Shortcut Restrictions:** The original application enforced strict validation rules, preventing users from setting single-key shortcuts (like `~`, `F1`, etc.) and requiring at least one modifier key (Shift/Ctrl/Alt). It also blocked consecutive alphanumeric keys.

### Solution
1.  **Stability Fix (Backend):** Modified `keyboard-helper-child-process.js` to wrap the `libProcessEvents()` call within a `try-catch` block inside the `setInterval` loop. This ensures that even if a transient error occurs in the native hook, the child process remains alive.
2.  **Customization Unlock (Frontend):** Patched `index2.js` in the renderer bundle to bypass the `Q` validation function. All restrictions (alphanumeric-only, too-many-keys, system-reserved, and consecutive keys) have been removed, allowing total freedom in shortcut assignment.

### How to Apply
This repository provides the necessary logic to patch an existing Typeless installation.
- `patch-renderer.js`: Automates the patching of the frontend validation logic.
- `keyboard-helper-child-process.js`: The patched backend handler for stability.

---

## 中文

### 问题描述
1.  **快捷键失灵：** 快捷键功能会随机失灵，必须重启软件才能恢复。这是由于原生键盘监听器的事件循环在遇到未捕获的异常时会直接导致后台子进程崩溃。
2.  **快捷键定制限制：** 原生应用程序存在严格的验证规则，禁止用户设置单键快捷键（如 `~`、`F1` 等），强制要求必须包含功能键（Shift/Ctrl/Alt）。此外，它也限制了连续的字母或数字快捷键。

### 解决方案
1.  **稳定性修复（后端）：** 修改了 `keyboard-helper-child-process.js`，在 `setInterval` 循环中将 `this.libProcessEvents()` 调用包装在 `try-catch` 块中。这确保了即使原生钩子出现临时错误，子进程也不会崩溃。
2.  **自由定义解锁（前端）：** 修复了渲染器包中的 `index2.js`，直接跳过了 `Q` 验证函数。所有限制（仅限字母数字、键位过多、系统保留以及连续按键）均已被移除，用户可以完全自由地定义快捷键。

### 使用方法
本资源库提供了修复现有 Typeless 安装所需的逻辑。
- `patch-renderer.js`: 自动化修复前端验证逻辑。
- `keyboard-helper-child-process.js`: 已修复的后端处理程序，以提高稳定性。