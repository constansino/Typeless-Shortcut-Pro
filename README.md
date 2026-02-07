# Typeless Shortcut Pro (Optimizer & Fix Kit)

**Author:** Constantino  
**Version:** 1.0.3  
**License:** MIT

[English](#english) | [中文](#中文)

---

## English

### Introduction
**Typeless Shortcut Pro** is a comprehensive enhancement suite for the Typeless application. It transforms the software from a restrictive, unstable tool into a robust, highly customizable productivity powerhouse.

This repository contains the result of an extensive debugging session aimed at resolving core stability issues and unlocking user freedom.

---

### 🛠️ Deep Dive: The Debugging Journey & Technical Analysis

Our path to a stable application involved three major iterations of reverse engineering and logic hardening.

#### 1. The Stability Crisis (The "Crash" Bug)
*   **Symptoms:** The application would randomly stop responding to shortcuts, requiring a restart. The background process simply vanished.
*   **Root Cause Analysis:** The application relies on a native Node.js addon (via `koffi`) to hook into system keyboard events. The polling loop (`libProcessEvents`) runs continuously. We discovered that transient OS-level errors or malformed event data could throw an unhandled exception within this loop. Since Node.js treats unhandled exceptions in the main event loop as fatal, the entire child process would crash silently.
*   **The Fix:** We injected a robust `try-catch` wrapper around the critical polling interval in `keyboard-helper-child-process.js`. This acts as a shock absorber—if the native hook fails for one frame, the error is logged (or suppressed), and the process continues to the next frame instead of terminating.

#### 2. The "Ghost Key" Phenomenon (The "Stuck State" Bug)
*   **Symptoms:** Users experienced bizarre behavior where a shortcut (e.g., `Shift + Ctrl + Z`) would seemingly "stick." Opening the settings menu would auto-fill this shortcut immediately. Sometimes, the interface would flash as if triggered by invisible inputs.
*   **Root Cause Analysis:** This was the most elusive bug. It occurs when a system-interrupting event (like a Screenshot tool, UAC prompt, or Screen Lock) steals focus *after* a key is pressed down but *before* it is released.
    *   The `keydown` event is registered by Typeless.
    *   The OS interrupt swallows the `keyup` event.
    *   **Result:** Typeless's state machine enters a "zombie state," believing the user is holding the keys down forever. This polluted the input buffer, causing auto-triggers and UI conflicts.
*   **The Solution: Heuristic Watchdog (v1.0.3):**
    *   We implemented a self-correcting "Watchdog" mechanism in the backend.
    *   The system now timestamps the last state change.
    *   **Logic:** `if (keys_pressed && (now - last_update > 3000ms)) -> RESET`.
    *   If any key combination is held for more than 3 seconds (an unnatural duration for a command shortcut), the Watchdog assumes a "stuck" state and forcibly clears the internal key buffer. This makes the system "self-healing."

#### 3. Customization Unlock (The "Freedom" Patch)
*   **Analysis:** The frontend code (`index2.js`) contained an over-zealous validation function (`Q`). It enforced arbitrary rules: "Must have modifier," "No single keys," "No consecutive letters."
*   **The Fix:** We developed a patcher that locates this validation logic using its unique error string signatures and hot-patches the function to bypass all checks (`return true`). This allows users to map *any* key (e.g., `F1`, `~`, or single letters) to actions.

---

### How to Apply
> **Prerequisite:** You must unpack `resources/app.asar` into a `resources/app` folder before applying these patches.

1.  **Backend Fix:** Replace `resources/app/dist/main/keyboard-helper-child-process.js` with the version from this repo.
2.  **Frontend Fix:** Run `node patch-renderer.js` to unlock the UI restrictions.
3.  **Critical Step:** Rename the original `resources/app.asar` to `resources/app.asar.original`. If this file exists, Typeless will prioritize it over the patched `app` folder, causing the patches to fail.

---

## 中文

### 简介
**Typeless Shortcut Pro** 是专为 Typeless 应用打造的深度增强套件。它将原本受限、不稳定的软件转变为一个稳健、高度可定制的生产力工具。

本仓库包含了我们对该软件核心逻辑进行深度逆向分析和调试的成果，彻底解决了原生版本的稳定性缺陷。

---

### 🛠️ 技术深度解析与调试思路 (The Debugging Journey)

为了打造完美的体验，我们经历了三个阶段的底层重构与逻辑加固。

#### 1. 稳定性危机（崩溃 Bug）
*   **症状：** 快捷键功能会随机失效，必须重启软件才能恢复。后台子进程经常莫名消失。
*   **根本原因分析：** 该软件依赖原生 Node.js 插件（通过 `koffi`）来挂钩系统键盘事件。底层的轮询循环 (`libProcessEvents`) 缺乏错误处理。我们发现，当操作系统抛出瞬时错误或产生畸形事件数据时，该循环会抛出未捕获的异常。在 Node.js 中，主事件循环中的未捕获异常是致命的，直接导致子进程崩溃退出。
*   **修复方案：** 我们在 `keyboard-helper-child-process.js` 的核心轮询区间外层注入了一个 `try-catch` 保护壳。这就像一个减震器——即使原生钩子在某一帧出错，错误会被捕获并记录，进程会继续执行下一帧，而不是直接自杀。

#### 2. “幽灵按键”现象（按键卡死 Bug）
*   **症状：** 用户会遇到极度诡异的现象：某个快捷键（如 `Shift + Ctrl + Z`）似乎“粘”住了。打开设置菜单时，输入框会自动填入这个快捷键；有时界面甚至会闪烁，仿佛有隐形人在按键。
*   **根本原因分析：** 这是一个极其隐蔽的状态同步问题。当系统级中断发生时（例如：按下截图快捷键 Win+Shift+S、弹出 UAC 窗口或锁屏），中断会“吞掉”按键抬起 (`keyup`) 的信号。
    *   Typeless 记录了按键按下 (`keydown`)。
    *   系统拦截了按键抬起 (`keyup`) 的信号。
    *   **结果：** Typeless 的内部状态机进入“僵尸状态”，认为用户一直按着这些键不放。这污染了输入缓冲区，导致了自动触发和 UI 冲突。
*   **终极方案：启发式看门狗 (Watchdog v1.0.3)：**
    *   我们在后端实现了一个自我纠错的“看门狗”机制。
    *   系统现在会为最后一次按键状态变更打上时间戳。
    *   **逻辑：** `如果 (有键按下 && (当前时间 - 最后更新时间 > 3000毫秒)) -> 强制重置`。
    *   如果任何组合键被按住超过 3 秒（这对于快捷键指令来说是不自然的），看门狗会判定为“卡死状态”，并强制清空内部的按键缓存。这赋予了系统“自愈”的能力。

#### 3. 解除定制限制（自由补丁）
*   **分析：** 前端代码 (`index2.js`) 包含一个极其严格的验证函数 (`Q`)。它强制执行了许多不必要的规则：“必须包含修饰键”、“禁止单键”、“禁止连续字母”等。
*   **修复方案：** 我们编写了一个智能补丁脚本，通过唯一的错误提示字符串定位该验证函数的内存地址，并对其进行热替换，使其永远返回 `true`。现在，用户可以将 *任何* 按键（如 `F1`、`~` 或单字母）映射为功能键。

---

### 使用方法
> **前置条件：** 在应用补丁之前，您必须先将 `resources/app.asar` 解压到 `resources/app` 文件夹。

1.  **后端修复：** 使用本仓库中的 `keyboard-helper-child-process.js` 替换 `resources/app/dist/main/keyboard-helper-child-process.js`。
2.  **Frontend Fix:** 运行 `node patch-renderer.js` 以解除 UI 限制。
3.  **关键步骤：** 将原始的 `resources/app.asar` 重命名为 `resources/app.asar.original`。如果此文件存在，Typeless 会优先读取它而忽略已打补丁的 `app` 文件夹，导致补丁失效。
