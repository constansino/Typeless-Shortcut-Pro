# Typeless Shortcut Pro (Optimizer & Bug Fix)

**Author:** constansino  
**Version:** 1.0.0  
**License:** MIT

[English](#english) | [涓枃](#涓枃)

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

## 涓枃

### 闂鎻忚堪
1.  **蹇嵎閿け鐏碉細** 蹇嵎閿姛鑳戒細闅忔満澶辩伒锛屽繀椤婚噸鍚蒋浠舵墠鑳芥仮澶嶃€傝繖鏄敱浜庡師鐢熼敭鐩樼洃鍚櫒鐨勪簨浠跺惊鐜湪閬囧埌鏈崟鑾风殑寮傚父鏃朵細鐩存帴瀵艰嚧鍚庡彴瀛愯繘绋嬪崩溃銆
2.  **蹇嵎閿畾鍒堕檺鍒讹細** 鍘熺敓搴旂敤绋嬪簭瀛樺湪涓ユ牸鐨勯獙璇佽鍒欙紝绂佹鐢ㄦ埛璁剧疆鍗曢敭蹇嵎閿紙濡 `~`銆`F1` 绛夛級锛屽己鍒惰姹傚繀椤诲寘鍚姛鑳介敭锛圫hift/Ctrl/Alt锛夈€傛澶栵紝瀹冧篃闄愬埗浜嗚繛续鐨勫瓧姣嶆垨鏁板瓧蹇嵎閿€

### 瑙ｅ喅鏂规
1.  **绋冲畾鎬ф淇紙鍚庣锛夛細** 淇敼浜 `keyboard-helper-child-process.js`锛屽湪 `setInterval` 寰幆涓皢 `this.libProcessEvents()` 璋冪敤鍖呭鍦 `try-catch` 鍧椾腑銆傝繖纭繚浜嶅嵆浣垮師鐢熼挬瀛愬嚭鐜颁复鏃堕敊璇紝瀛愯繘绋嬩篃涓嶄細宕╅簝銆
2.  **鑷敱瀹氫箟瑙ｉ攣锛堝墠绔）锛** 淇ˉ浜嗘覆鏌撳櫒鍖呬腑鐨 `index2.js`锛岀洿鎺ヨ烦杩囦簡 `Q` 楠岃瘉鍑芥暟銆傛墍鏈夐檺鍒讹紙浠呴檺瀛楁瘝鏁板瓧銆侀敭浣嶈繃澶氥€佺绯荤粺淇濈暀浠ュ強杩炵画鎸夐敭锛夊潎宸茶绉婚櫎锛岀敤鎴峰彲浠ュ畬鍏ㄨ鑷敱鍦板畬鍏ㄨ嚜鐢卞畾涔夊揩鎹烽敭銆

### 浣跨敤鏂规硶
鏈祫婧愬簱鎻愪緵浜嗕慨琛ョ幇鏈 Typeless 瀹夎鎵€闇€鐨勯€昏緫銆
- `patch-renderer.js`: 鑷姩鍖栦慨琛ュ墠绔獙璇侀€昏緫銆
- `keyboard-helper-child-process.js`: 宸蹭慨澶嶇殑鍚庣澶勭悊绋嬪簭锛屼互鎻愰珮绋冲畾鎬с€
