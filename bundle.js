(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // catalog.js
  var catalog_exports = {};
  __export(catalog_exports, {
    CHAR_TO_KEY: () => CHAR_TO_KEY,
    HID_NAMES: () => HID_NAMES,
    JIS_OUTPUT: () => JIS_OUTPUT,
    JIS_VERIFIED: () => JIS_VERIFIED,
    KEYPAD_NAMES: () => KEYPAD_NAMES,
    KIND_KEYBOARD: () => KIND_KEYBOARD,
    KIND_MEDIA: () => KIND_MEDIA,
    KIND_MOUSE: () => KIND_MOUSE,
    KIND_NAMES: () => KIND_NAMES,
    KNOB_ACTIONS: () => KNOB_ACTIONS,
    KNOB_ORDER: () => KNOB_ORDER,
    LANG: () => LANG,
    LANGS: () => LANGS,
    LAYOUT: () => LAYOUT,
    LAYOUTS: () => LAYOUTS,
    LED_MODES: () => LED_MODES,
    LED_MODE_HELP: () => LED_MODE_HELP,
    LED_MODE_LABELS: () => LED_MODE_LABELS,
    LED_MODE_TRAITS: () => LED_MODE_TRAITS,
    LED_NO_COLOR_REASON: () => LED_NO_COLOR_REASON,
    LED_SLOTS: () => LED_SLOTS,
    MAX_CODES: () => MAX_CODES,
    MAX_KEY_ID: () => MAX_KEY_ID,
    MEDIA_ALIASES: () => MEDIA_ALIASES,
    MEDIA_BY_NAME: () => MEDIA_BY_NAME,
    MEDIA_LABELS: () => MEDIA_LABELS,
    MEDIA_USAGES: () => MEDIA_USAGES,
    MODORDER: () => MODORDER,
    MODS: () => MODS,
    MODS_LEFT: () => MODS_LEFT,
    MODS_RIGHT: () => MODS_RIGHT,
    MOD_BY_NAME: () => MOD_BY_NAME,
    MOUSE_ACTIONS: () => MOUSE_ACTIONS,
    MOUSE_ACTION_BY_NAME: () => MOUSE_ACTION_BY_NAME,
    MOUSE_ALIASES: () => MOUSE_ALIASES,
    MOUSE_BUTTONS: () => MOUSE_BUTTONS,
    MOUSE_BY_NAME: () => MOUSE_BY_NAME,
    MOUSE_LABELS: () => MOUSE_LABELS,
    MOUSE_MOD_OK: () => MOUSE_MOD_OK,
    NAME_TO_HID: () => NAME_TO_HID,
    STRINGS: () => STRINGS,
    VENDOR_PALETTE: () => VENDOR_PALETTE,
    WHEEL_DOWN: () => WHEEL_DOWN,
    WHEEL_UP: () => WHEEL_UP,
    WIRELESS_NOTES: () => WIRELESS_NOTES,
    allTargets: () => allTargets,
    armMouse: () => armMouse,
    charTable: () => charTable,
    detectLang: () => detectLang,
    glyphFor: () => glyphFor,
    isMod: () => isMod,
    isPhysical: () => isPhysical,
    jisFor: () => jisFor,
    keyIdToName: () => keyIdToName,
    keyLabel: () => keyLabel,
    keysForChar: () => keysForChar,
    keysForText: () => keysForText,
    labelFor: () => labelFor,
    ledModeLabel: () => ledModeLabel,
    ledModeList: () => ledModeList,
    mediaLabel: () => mediaLabel,
    mediaList: () => mediaList,
    mediaNames: () => mediaNames,
    mouseActions: () => mouseActions,
    mouseLabel: () => mouseLabel,
    mouseNames: () => mouseNames,
    nameToKeyId: () => nameToKeyId,
    setKnobOrder: () => setKnobOrder,
    setLang: () => setLang,
    setLayout: () => setLayout,
    sortMods: () => sortMods,
    t: () => t,
    wirelessNote: () => wirelessNote
  });
  var LANGS = ["ko", "en", "ja"];
  function detectLang() {
    if (typeof localStorage !== "undefined") {
      try {
        const saved = localStorage.getItem("minikeyboard_lang");
        if (saved && LANGS.includes(saved)) return saved;
      } catch (e) {
      }
    }
    const navLangs = typeof navigator !== "undefined" && Array.isArray(navigator.languages) && navigator.languages.length ? navigator.languages : typeof navigator !== "undefined" && navigator.language ? [navigator.language] : [];
    for (const l of navLangs) {
      const code = String(l || "").toLowerCase().trim();
      if (code.startsWith("ko")) return "ko";
      if (code.startsWith("ja")) return "ja";
      if (code.startsWith("en")) return "en";
    }
    return "en";
  }
  var LANG = detectLang();
  function setLang(l) {
    if (l === "auto") {
      if (typeof localStorage !== "undefined") {
        try {
          localStorage.removeItem("minikeyboard_lang");
        } catch (e) {
        }
      }
      LANG = detectLang();
    } else if (LANGS.includes(l)) {
      LANG = l;
      if (typeof localStorage !== "undefined") {
        try {
          localStorage.setItem("minikeyboard_lang", l);
        } catch (e) {
        }
      }
    }
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.lang = LANG;
    }
    return LANG;
  }
  var STRINGS = {
    // -- header / connection
    "btn.connect": { en: "Connect device", ja: "\u30C7\u30D0\u30A4\u30B9\u306B\u76F4\u7D50", ko: "\uD0A4\uD328\uB4DC \uC5F0\uACB0 (WebHID)" },
    "btn.disconnect": { en: "Disconnect", ja: "\u5207\u65AD", ko: "\uC5F0\uACB0 \uD574\uC81C" },
    "btn.export": { en: "Export \u25BE", ja: "\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8 \u25BE", ko: "\uB0B4\uBCF4\uB0B4\uAE30 \u25BE" },
    "btn.exportApp": { en: "Save app settings", ja: "\u30A2\u30D7\u30EA\u306E\u8A2D\u5B9A\u3092\u4FDD\u5B58", ko: "\uC571 \uC124\uC815 \uC800\uC7A5" },
    "btn.exportDevice": { en: "Save device settings", ja: "\u672C\u4F53\u306E\u8A2D\u5B9A\u3092\u4FDD\u5B58", ko: "\uAE30\uAE30 \uB86C \uC124\uC815 \uC800\uC7A5" },
    "btn.import": { en: "Load a file", ja: "\u30D5\u30A1\u30A4\u30EB\u3092\u8AAD\u307F\u8FBC\u3080", ko: "\uD30C\uC77C \uBD88\uB7EC\uC624\uAE30" },
    "btn.preset": { en: "Presets \u25BE", ja: "\u30D7\u30EA\u30BB\u30C3\u30C8 \u25BE", ko: "\uD504\uB9AC\uC14B \u25BE" },
    "btn.presetPlanA": { en: "48-Key No-Conflict Preset (Rec.)", ja: "48\u30AD\u30FC\u7121\u53CD\u5FDC\u30AD\u30FC\u5272\u5F53\uFF08\u63A8\u5968\uFF09", ko: "3\uAC1C \uB808\uC774\uC5B4 48\uD0A4 \uC804\uCCB4 \uBB34\uBC18\uC751 \uD0A4 \uB9E4\uD551" },
    "btn.clearAll": { en: "Clear all keys (None)", ja: "\u5168\u30AD\u30FC\u89E3\u9664 (None)", ko: "\uD604\uC7AC \uB808\uC774\uC5B4 \uBAA8\uB450 \uBE44\uC6B0\uAE30 (None)" },
    "btn.reload": { en: "Reload", ja: "\u518D\u8AAD\u307F\u8FBC\u307F", ko: "\uB2E4\uC2DC \uC77D\uAE30" },
    "btn.revert": { en: "Revert to device", ja: "\u672C\u4F53\u306E\u5024\u306B\u623B\u3059", ko: "\uAE30\uAE30 \uAC12\uC73C\uB85C \uB418\uB3CC\uB9AC\uAE30" },
    "btn.write": { en: "Write to device", ja: "\u672C\u4F53\u306B\u66F8\u304D\u8FBC\u3080", ko: "\uAE30\uAE30 \uB86C\uC5D0 \uC4F0\uAE30 (Write)" },
    "btn.writeN": { en: "Write to device ({n})", ja: "\u672C\u4F53\u306B\u66F8\u304D\u8FBC\u3080\uFF08{n}\uFF09", ko: "\uAE30\uAE30 \uB86C\uC5D0 \uC4F0\uAE30 ({n})" },
    "btn.written": { en: "Written", ja: "\u66F8\u304D\u8FBC\u307F\u6E08\u307F", ko: "\uC4F0\uAE30 \uC644\uB8CC\uB428" },
    "tip.reload": {
      en: "Re-read the device and compare again",
      ja: "\u672C\u4F53\u3092\u8AAD\u307F\u76F4\u3057\u3066\u6BD4\u8F03\u3057\u306A\u304A\u3057\u307E\u3059",
      ko: "\uAE30\uAE30 \uC124\uC815\uC744 \uB2E4\uC2DC \uC77D\uC5B4\uC635\uB2C8\uB2E4"
    },
    "conn.webhid": { en: "WebHID (direct)", ja: "WebHID\uFF08\u76F4\u7D50\uFF09", ko: "WebHID \uC5F0\uACB0\uB428" },
    "conn.mock": { en: "Mock", ja: "\u30E2\u30C3\u30AF", ko: "\uBAA8\uC758 \uAE30\uAE30 (Mock)" },
    "conn.none": { en: "Not connected", ja: "\u672A\u63A5\u7D9A", ko: "\uC5F0\uACB0 \uC548 \uB428" },
    "conn.loading": { en: "Reading device\u2026", ja: "\u672C\u4F53\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D\u2026", ko: "\uAE30\uAE30 \uB86C \uC77D\uB294 \uC911\u2026" },
    "conn.offlineN": { en: "Offline \xB7 {n} changed", ja: "\u672A\u63A5\u7D9A\u30FB\u5909\u66F4 {n} \u4EF6", ko: "\uC624\uD504\uB77C\uC778 \xB7 {n}\uAC1C \uBCC0\uACBD\uB428" },
    "conn.unwritten": {
      en: "You have unwritten changes",
      ja: "\u672A\u66F8\u304D\u8FBC\u307F\u306E\u5909\u66F4\u304C\u3042\u308A\u307E\u3059",
      ko: "\uC544\uC9C1 \uB86C\uC5D0 \uAE30\uB85D\uB418\uC9C0 \uC54A\uC740 \uBCC0\uACBD\uC0AC\uD56D\uC774 \uC788\uC2B5\uB2C8\uB2E4"
    },
    // -- messages
    "msg.connected": {
      en: "Connected directly (WebHID)",
      ja: "\u30C7\u30D0\u30A4\u30B9\u306B\u76F4\u63A5\u3064\u306A\u304C\u308A\u307E\u3057\u305F\uFF08WebHID\uFF09"
    },
    "msg.connectFail": {
      en: "Could not connect: {e}",
      ja: "\u63A5\u7D9A\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F: {e}"
    },
    "msg.noDevice": {
      en: "No device is connected",
      ja: "\u30C7\u30D0\u30A4\u30B9\u304C\u63A5\u7D9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093"
    },
    "msg.noDeviceHint": {
      en: 'No device is connected. Press "Connect device"',
      ja: "\u30C7\u30D0\u30A4\u30B9\u304C\u63A5\u7D9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\u300C\u30C7\u30D0\u30A4\u30B9\u306B\u76F4\u7D50\u300D\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044"
    },
    "msg.cannotConnect": {
      en: "Cannot reach the device: {e}",
      ja: "\u30C7\u30D0\u30A4\u30B9\u306B\u63A5\u7D9A\u3067\u304D\u307E\u305B\u3093: {e}"
    },
    "msg.loaded": {
      en: "Loaded the device settings",
      ja: "\u672C\u4F53\u306E\u8A2D\u5B9A\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F"
    },
    "msg.inSync": {
      en: "Matches the device settings",
      ja: "\u672C\u4F53\u306E\u8A2D\u5B9A\u3068\u4E00\u81F4\u3057\u3066\u3044\u307E\u3059"
    },
    "msg.notDirect": { en: "Not connected directly", ja: "\u76F4\u7D50\u3057\u3066\u3044\u307E\u305B\u3093" },
    "msg.disconnected": {
      en: "Disconnected. Permission was revoked too, so you will pick the device again next time",
      ja: "\u5207\u65AD\u3057\u307E\u3057\u305F\u3002\u8A31\u53EF\u3082\u53D6\u308A\u6D88\u3057\u305F\u306E\u3067\u3001\u6B21\u306F\u9078\u3073\u76F4\u3057\u306B\u306A\u308A\u307E\u3059"
    },
    "msg.disconnectFail": {
      en: "Could not disconnect: {e}",
      ja: "\u5207\u65AD\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F: {e}"
    },
    "msg.restored": {
      en: 'Restored your last settings. Use "Connect device" to write them to the device',
      ja: "\u524D\u56DE\u306E\u8A2D\u5B9A\u3092\u5FA9\u5143\u3057\u307E\u3057\u305F\u3002\u300C\u30C7\u30D0\u30A4\u30B9\u306B\u76F4\u7D50\u300D\u3067\u672C\u4F53\u306B\u66F8\u304D\u8FBC\u3081\u307E\u3059"
    },
    "msg.pickDevice": {
      en: 'Press "Connect device" and choose your macropad',
      ja: "\u300C\u30C7\u30D0\u30A4\u30B9\u306B\u76F4\u7D50\u300D\u3092\u62BC\u3057\u3066\u30DE\u30AF\u30ED\u30D1\u30C3\u30C9\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044"
    },
    "msg.noWebhid": {
      en: "This browser cannot reach the device: it has no WebHID. Open this page in Chrome or Edge.",
      ja: "\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u306F WebHID \u306B\u5BFE\u5FDC\u3057\u3066\u3044\u306A\u3044\u305F\u3081\u30C7\u30D0\u30A4\u30B9\u306B\u63A5\u7D9A\u3067\u304D\u307E\u305B\u3093\u3002Chrome \u304B Edge \u3067\u958B\u3044\u3066\u304F\u3060\u3055\u3044",
      ko: "\uC774 \uBE0C\uB77C\uC6B0\uC800\uB294 WebHID\uB97C \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. Chrome, Edge, Brave \uB4F1\uC758 \uBE0C\uB77C\uC6B0\uC800\uC5D0\uC11C \uC5F4\uC5B4\uC8FC\uC138\uC694."
    },
    "msg.insecure": {
      en: "WebHID needs a secure connection. Open this page over https, or from 127.0.0.1.",
      ja: "WebHID \u306F\u4FDD\u8B77\u3055\u308C\u305F\u63A5\u7D9A\u3067\u3057\u304B\u52D5\u304D\u307E\u305B\u3093\u3002https \u304B 127.0.0.1 \u3067\u958B\u3044\u3066\u304F\u3060\u3055\u3044",
      ko: "WebHID \uAE30\uAE30 \uD1B5\uC2E0\uC740 \uBCF4\uC548 \uC5F0\uACB0\uC774 \uD544\uC694\uD569\uB2C8\uB2E4. \uD130\uBBF8\uB110\uC5D0\uC11C ./keypad_cli.py gui \uB97C \uC2E4\uD589\uD558\uC5EC http://127.0.0.1:8850 \uC73C\uB85C \uC5F4\uC5B4\uC8FC\uC138\uC694."
    },
    "msg.sameAsDevice": {
      en: "Same as the device. Nothing to write",
      ja: "\u672C\u4F53\u3068\u540C\u3058\u5185\u5BB9\u3067\u3059\u3002\u66F8\u304D\u8FBC\u3080\u5FC5\u8981\u306F\u3042\u308A\u307E\u305B\u3093"
    },
    "msg.notRead": {
      en: "The device settings have not been read",
      ja: "\u672C\u4F53\u306E\u8A2D\u5B9A\u3092\u8AAD\u307F\u8FBC\u3093\u3067\u3044\u307E\u305B\u3093"
    },
    "msg.reverted": {
      en: "Reverted to the device values",
      ja: "\u672C\u4F53\u306E\u5024\u306B\u623B\u3057\u307E\u3057\u305F"
    },
    "msg.keptDraft": {
      en: 'Keeping your edits. Use "Write to device" to apply them',
      ja: "\u7DE8\u96C6\u4E2D\u306E\u8A2D\u5B9A\u3092\u4FDD\u6301\u3057\u3066\u3044\u307E\u3059\u3002\u300C\u672C\u4F53\u306B\u66F8\u304D\u8FBC\u3080\u300D\u3067\u53CD\u6620\u3067\u304D\u307E\u3059"
    },
    "msg.nothingToSave": {
      en: "There are no settings to save",
      ja: "\u4FDD\u5B58\u3059\u308B\u8A2D\u5B9A\u304C\u3042\u308A\u307E\u305B\u3093"
    },
    "msg.exportedApp": {
      en: "Exported the app settings",
      ja: "\u30A2\u30D7\u30EA\u306E\u8A2D\u5B9A\u3092\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u3057\u307E\u3057\u305F"
    },
    "msg.readingDevice": { en: "Reading the device\u2026", ja: "\u672C\u4F53\u3092\u8AAD\u307F\u8FBC\u3093\u3067\u3044\u307E\u3059\u2026" },
    "msg.exportedDevice": {
      en: "Exported the device settings",
      ja: "\u672C\u4F53\u306E\u8A2D\u5B9A\u3092\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u3057\u307E\u3057\u305F"
    },
    "msg.readFail": {
      en: "Could not read the device: {e}",
      ja: "\u672C\u4F53\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F: {e}"
    },
    "msg.importedWrite": {
      en: 'Loaded. Use "Write to device" to apply it',
      ja: "\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F\u3002\u300C\u672C\u4F53\u306B\u66F8\u304D\u8FBC\u3080\u300D\u3067\u53CD\u6620\u3067\u304D\u307E\u3059"
    },
    "msg.imported": { en: "Loaded", ja: "\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F" },
    "msg.importFail": {
      en: "Could not read the file: {e}",
      ja: "\u30D5\u30A1\u30A4\u30EB\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F: {e}"
    },
    "msg.startFail": { en: "Failed to start: {e}", ja: "\u8D77\u52D5\u306B\u5931\u6557\u3057\u307E\u3057\u305F: {e}" },
    "msg.savedKey": {
      en: "{k} set (not written yet)",
      ja: "{k} \u3092\u8A2D\u5B9A\u3057\u307E\u3057\u305F\uFF08\u672A\u66F8\u304D\u8FBC\u307F\uFF09",
      ko: "{k} \uC124\uC815\uB428 (\uC544\uC9C1 \uAE30\uAE30\uC5D0 \uBBF8\uC800\uC7A5)"
    },
    "msg.copiedTo": {
      en: "Copied to {k} (layer {L}) \u2014 not written yet",
      ja: "{k}\uFF08\u30EC\u30A4\u30E4 {L}\uFF09\u3078\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F\uFF08\u672A\u66F8\u304D\u8FBC\u307F\uFF09",
      ko: "{k}(\uB808\uC774\uC5B4 {L})\uB85C \uBCF5\uC0AC\uB428 (\uC544\uC9C1 \uAE30\uAE30\uC5D0 \uBBF8\uC800\uC7A5)"
    },
    "msg.planAApplied": {
      en: "Preset applied (48 keys + 9 knob actions across 3 layers)! Click [Write to device] to save.",
      ja: "\u30D7\u30EA\u30BB\u30C3\u30C8\u9069\u7528\u5B8C\u4E86\uFF08\u51683\u30EC\u30A4\u30E4\u30FC48\u30AD\u30FC\uFF0B9\u30CE\u30D6\u52D5\u4F5C\u3092\u7121\u53CD\u5FDC\u30AD\u30FC\u306B\u8A2D\u5B9A\uFF09\uFF01\u300C\u672C\u4F53\u306B\u66F8\u304D\u8FBC\u3080\u300D\u3067\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      ko: "3\uAC1C \uB808\uC774\uC5B4 48\uD0A4 + 9\uAC1C \uB178\uBE0C \uB3D9\uC791 \uC804\uCCB4 \uBB34\uBC18\uC751 \uD0A4 \uB9E4\uD551 \uC801\uC6A9 \uC644\uB8CC! [\uAE30\uAE30 \uB86C\uC5D0 \uC4F0\uAE30]\uB97C \uB204\uB974\uBA74 \uC800\uC7A5\uB429\uB2C8\uB2E4."
    },
    "msg.confirmClear": {
      en: "Clear all keys and knobs on the current layer?\\n(Unassigned keys do nothing when pressed)",
      ja: "\u73FE\u5728\u306E\u30EC\u30A4\u30E4\u306E\u3059\u3079\u3066\u306E\u30AD\u30FC\u3068\u30CE\u30D6\u8A2D\u5B9A\u3092\u89E3\u9664\u3057\u307E\u3059\u304B\uFF1F\\n\uFF08\u672A\u5272\u308A\u5F53\u3066\u306E\u30AD\u30FC\u306F\u62BC\u3057\u3066\u3082\u4F55\u3082\u52D5\u4F5C\u3057\u307E\u305B\u3093\uFF09",
      ko: "\uD604\uC7AC \uB808\uC774\uC5B4\uC758 \uBAA8\uB4E0 \uD0A4\uC640 \uB178\uBE0C \uC124\uC815\uC744 \uBE44\uC6B0\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?\\n(\uD560\uB2F9\uB418\uC9C0 \uC54A\uC740 \uD0A4\uB294 \uB20C\uB7EC\uB3C4 \uC544\uBB34 \uB3D9\uC791\uB3C4 \uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4)"
    },
    "msg.layerCleared": {
      en: "Current layer cleared. Click [Write to device] to apply to keypad.",
      ja: "\u73FE\u5728\u306E\u30EC\u30A4\u30E4\u3092\u3059\u3079\u3066\u89E3\u9664\u3057\u307E\u3057\u305F\u3002\u300C\u672C\u4F53\u306B\u66F8\u304D\u8FBC\u3080\u300D\u3067\u53CD\u6620\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      ko: "\uD604\uC7AC \uB808\uC774\uC5B4\uAC00 \uBAA8\uB450 \uBE44\uC6CC\uC84C\uC2B5\uB2C8\uB2E4. [\uAE30\uAE30 \uB86C\uC5D0 \uC4F0\uAE30]\uB97C \uB204\uB974\uBA74 \uAE30\uAE30\uC5D0 \uC801\uC6A9\uB429\uB2C8\uB2E4."
    },
    // -- pad
    "pad.hint": {
      en: "Click a key or knob to edit its input sequence.",
      ja: "\u30AD\u30FC\u30FB\u30CE\u30D6\u3092\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u5165\u529B\u30B7\u30FC\u30B1\u30F3\u30B9\u3092\u7DE8\u96C6\u3067\u304D\u307E\u3059\u3002"
    },
    "pad.hintPaint": {
      en: "Click a key to make it the target for colours. (Close LED to go back to editing input sequences.)",
      ja: "\u30AD\u30FC\u3092\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u3001\u305D\u306E\u30AD\u30FC\u304C\u8272\u306E\u9069\u7528\u5148\u306B\u306A\u308A\u307E\u3059\u3002\uFF08LED\u3092\u9589\u3058\u308B\u3068\u30AF\u30EA\u30C3\u30AF\u3067\u5165\u529B\u30B7\u30FC\u30B1\u30F3\u30B9\u306E\u7DE8\u96C6\u306B\u623B\u308A\u307E\u3059\uFF09"
    },
    "pad.hintHover": {
      en: "Hover a key to see how it lights when pressed. (Click to edit its input sequence.)",
      ja: "\u30AD\u30FC\u306B\u30DE\u30A6\u30B9\u3092\u4E57\u305B\u308B\u3068\u3001\u62BC\u3057\u305F\u3068\u304D\u306E\u5149\u308A\u65B9\u304C\u898B\u3048\u307E\u3059\u3002\uFF08\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u5165\u529B\u30B7\u30FC\u30B1\u30F3\u30B9\u3092\u7DE8\u96C6\u3067\u304D\u307E\u3059\uFF09"
    },
    "pad.layer": { en: "Layer {n}", ja: "\u30EC\u30A4\u30E4 {n}" },
    "pad.knob": { en: "Knob {n}", ja: "\u30CE\u30D6 {n}" },
    // -- LED area
    "led.mode": { en: "Mode", ja: "\u30E2\u30FC\u30C9", ko: "LED \uBAA8\uB4DC" },
    "led.customColor": { en: "Custom colour", ja: "\u4EFB\u610F\u8272", ko: "\uC784\uC758 \uC0C9\uC0C1" },
    "led.applyAll": { en: "Apply to all keys", ja: "\u5168\u30AD\u30FC\u306B\u9069\u7528", ko: "\uC804\uCCB4 \uD0A4\uC5D0 \uC801\uC6A9" },
    "led.applyKey": { en: "Apply to Key {n}", ja: "Key {n} \u306B\u9069\u7528", ko: "Key {n}\uC5D0 \uC801\uC6A9" },
    "led.randomColors": { en: "\u{1F3B2} Random Colors", ja: "\u{1F3B2} \u5168\u30E9\u30F3\u30C0\u30E0\u8272", ko: "\u{1F3B2} \uC804\uCCB4 \uB79C\uB364 \uC0C9\uC0C1" },
    "led.writeHint": {
      en: 'Changes are applied together via "Write to device" in the header.',
      ja: "\u5909\u66F4\u306F\u30D8\u30C3\u30C0\u30FC\u306E\u300C\u672C\u4F53\u306B\u66F8\u304D\u8FBC\u3080\u300D\u3067\u307E\u3068\u3081\u3066\u53CD\u6620\u3055\u308C\u307E\u3059\u3002",
      ko: "\uBCC0\uACBD \uC0AC\uD56D\uC740 \uC0C1\uB2E8\uC758 [\uAE30\uAE30 \uB86C\uC5D0 \uC4F0\uAE30] \uBC84\uD2BC\uC744 \uB20C\uB7EC\uC57C \uAE30\uAE30\uC5D0 \uCD5C\uC885 \uC800\uC7A5\uB429\uB2C8\uB2E4."
    },
    "led.targetOne": {
      en: '<span style="color:var(--accent);font-weight:700">\u{1F3AF} Key {n}{q} Selected</span>: Choosing a colour or clicking [Apply to Key {n}] sets <b>Key {n}</b> only. (Click the key again to return to all keys)',
      ja: '<span style="color:var(--accent);font-weight:700">\u{1F3AF} Key {n}{q} \u9078\u629E\u4E2D</span>: \u8272\u898B\u672C\u30FB\u4EFB\u610F\u8272\u3092\u9078\u3076\u304B\uFF3BKey {n} \u306B\u9069\u7528\uFF3D\u3092\u62BC\u3059\u3068 <b>Key {n}</b> \u306E\u307F\u306B\u9069\u7528\u3055\u308C\u307E\u3059\u3002\uFF08\u3082\u3046\u4E00\u5EA6\u30AD\u30FC\u3092\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u5168\u30AD\u30FC\u5BFE\u8C61\u306B\u623B\u308A\u307E\u3059\uFF09',
      ko: '<span style="color:var(--accent);font-weight:700">\u{1F3AF} Key {n}{q} \uC120\uD0DD\uB428</span>: \uC0C9\uC0C1\uD45C\uB098 \uC784\uC758\uC0C9\uC744 \uACE0\uB974\uAC70\uB098 [Key {n}\uC5D0 \uC801\uC6A9]\uC744 \uB204\uB974\uBA74 <b>Key {n}</b>\uC5D0\uB9CC \uC0C9\uC0C1\uC774 \uC801\uC6A9\uB429\uB2C8\uB2E4. (\uC804\uCCB4 \uC801\uC6A9\uC73C\uB85C \uB3CC\uC544\uAC00\uB824\uBA74 \uD574\uB2F9 \uD0A4\uB97C \uB2E4\uC2DC \uD074\uB9AD)'
    },
    "led.targetAll": {
      en: "<span>\u{1F3A8} <b>Target: All 16 Keys</b></span>: Picking a colour or clicking [Apply to all keys] sets all 16 keys. (Click a key on the pad to colour only that key)",
      ja: "<span>\u{1F3A8} <b>\u516816\u30AD\u30FC\u5BFE\u8C61</b></span>: \u8272\u898B\u672C\u3092\u9078\u3076\u304B\uFF3B\u5168\u30AD\u30FC\u306B\u9069\u7528\uFF3D\u3092\u62BC\u3059\u306816\u30AD\u30FC\u5168\u4F53\u306B\u9069\u7528\u3055\u308C\u307E\u3059\u3002\uFF08\u7279\u5B9A\u30AD\u30FC\u306E\u307F\u5857\u308B\u5834\u5408\u306F\u30AD\u30FC\u30D1\u30C3\u30C9\u306E\u30AD\u30FC\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u304F\u3060\u3055\u3044\uFF09",
      ko: "<span>\u{1F3A8} <b>\uC804\uCCB4 16\uAC1C \uD0A4 \uB300\uC0C1</b></span>: \uC0C9\uC0C1\uC744 \uACE0\uB974\uAC70\uB098 [\uC804\uCCB4 \uD0A4\uC5D0 \uC801\uC6A9]\uC744 \uB204\uB974\uBA74 16\uAC1C \uD0A4 \uC804\uCCB4\uC5D0 \uC801\uC6A9\uB429\uB2C8\uB2E4. (\uD2B9\uC815 \uD0A4\uB9CC \uCE60\uD558\uB824\uBA74 \uD0A4\uD328\uB4DC\uC758 \uD0A4\uB97C \uD074\uB9AD\uD558\uC138\uC694)"
    },
    "led.msgAppliedKey": {
      en: "Applied {c} to Key {n}. Click [Write to device] to save.",
      ja: "Key {n} \u306B {c} \u3092\u9069\u7528\u3057\u307E\u3057\u305F\u3002\u300C\u672C\u4F53\u306B\u66F8\u304D\u8FBC\u3080\u300D\u3067\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      ko: "Key {n}\uC5D0 {c} \uC0C9\uC0C1\uC774 \uC801\uC6A9\uB418\uC5C8\uC2B5\uB2C8\uB2E4. [\uAE30\uAE30 \uB86C\uC5D0 \uC4F0\uAE30]\uB97C \uB20C\uB7EC \uC800\uC7A5\uD558\uC138\uC694."
    },
    "led.msgAppliedAll": {
      en: "Applied {c} to all 16 keys. Click [Write to device] to save.",
      ja: "\u516816\u30AD\u30FC\u306B {c} \u3092\u9069\u7528\u3057\u307E\u3057\u305F\u3002\u300C\u672C\u4F53\u306B\u66F8\u304D\u8FBC\u3080\u300D\u3067\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
      ko: "\uC804\uCCB4 16\uAC1C \uD0A4\uC5D0 {c} \uC0C9\uC0C1\uC774 \uC801\uC6A9\uB418\uC5C8\uC2B5\uB2C8\uB2E4. [\uAE30\uAE30 \uB86C\uC5D0 \uC4F0\uAE30]\uB97C \uB20C\uB7EC \uD0A4\uD328\uB4DC\uC5D0 \uC800\uC7A5\uD558\uC138\uC694."
    },
    "led.msgRandom": {
      en: "\u{1F3B2} Applied 16 distinct unique colours to all 16 keys!",
      ja: "\u{1F3B2} \u91CD\u8907\u306E\u306A\u304416\u8272\u306E\u56FA\u6709\u30AB\u30E9\u30FC\u3092\u516816\u30AD\u30FC\u306B\u30E9\u30F3\u30C0\u30E0\u914D\u7F6E\u3057\u307E\u3057\u305F\uFF01",
      ko: "\u{1F3B2} 16\uAC1C \uD0A4\uC5D0 \uACB9\uCE58\uC9C0 \uC54A\uB294 16\uAC00\uC9C0 \uACE0\uC720 \uC0C9\uC0C1\uC774 \uB79C\uB364\uD558\uAC8C \uBC30\uCE58\uB418\uC5C8\uC2B5\uB2C8\uB2E4!"
    },
    // -- editor sheet
    "ed.intro": {
      en: 'Just type and the chips line up. Click a chip to change its modifiers or its delay. The Windows key is under "Modifiers" below; F13-F24 are under "Choose a key".',
      ja: "\u305D\u306E\u307E\u307E\u6587\u5B57\u3092\u6253\u3066\u3070\u30C1\u30C3\u30D7\u304C\u4E26\u3073\u307E\u3059\u3002\u30C1\u30C3\u30D7\u3092\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u4FEE\u98FE\u30AD\u30FC\u3084\u5F85\u3061\u6642\u9593\u3092\u5909\u3048\u3089\u308C\u307E\u3059\u3002Windows\u30AD\u30FC\u306F\u4E0B\u306E\u300C\u4FEE\u98FE\u300D\u3001F13\u301CF24 \u306F\u300C\u30AD\u30FC\u3092\u9078\u3076\u300D\u304B\u3089\u3002"
    },
    "ed.copyTo": { en: "Copy to other keys\u2026", ja: "\u4ED6\u306E\u30AD\u30FC\u3078\u30B3\u30D4\u30FC\u2026" },
    "ed.cancel": { en: "Cancel", ja: "\u30AD\u30E3\u30F3\u30BB\u30EB" },
    "ed.clearAll": { en: "Clear all", ja: "\u5168\u90E8\u6D88\u3059" },
    "ed.confirm": { en: "OK", ja: "\u78BA\u5B9A" },
    "ed.placeholder": {
      en: 'Type, or pick from "Choose a key" below',
      ja: "\u6587\u5B57\u3092\u6253\u3064\u304B\u3001\u4E0B\u306E\u300C\u30AD\u30FC\u3092\u9078\u3076\u300D\u304B\u3089\u9078\u3093\u3067\u304F\u3060\u3055\u3044"
    },
    "ed.meter": {
      en: "{c} chips / {u} steps (max {m})",
      ja: "{c} \u30C1\u30C3\u30D7 / {u} \u30B9\u30C6\u30C3\u30D7\uFF08\u4E0A\u9650 {m}\uFF09"
    },
    "ed.meterNote": {
      en: "Each modifier costs one step",
      ja: "\u4FEE\u98FE\u30AD\u30FC\u306F 1 \u3064\u306B\u3064\u304D 1 \u30B9\u30C6\u30C3\u30D7\u4F7F\u3044\u307E\u3059"
    },
    "ed.nothingChosen": { en: "Nothing chosen yet", ja: "\u307E\u3060\u4F55\u3082\u9078\u3070\u308C\u3066\u3044\u307E\u305B\u3093" },
    "ed.overBudget": {
      en: "Needs {c} steps, but the limit is {m}",
      ja: "{c} \u30B9\u30C6\u30C3\u30D7\u5FC5\u8981\u3067\u3059\u304C\u3001\u4E0A\u9650\u306F {m} \u3067\u3059"
    },
    // -- chips
    "chip.mouse": { en: "Mouse", ja: "\u30DE\u30A6\u30B9" },
    "chip.media": { en: "Media", ja: "\u30E1\u30C7\u30A3\u30A2" },
    "chip.key": { en: "Key", ja: "\u30AD\u30FC" },
    "chip.solo": { en: "Solo", ja: "\u5358\u72EC" },
    "chip.kindSteps": { en: "{kind} \xB7 {n} steps", ja: "{kind}\u30FB{n} \u30B9\u30C6\u30C3\u30D7" },
    "chip.mods": { en: "Modifiers", ja: "\u4FEE\u98FE" },
    "chip.delay": { en: "Delay", ja: "\u5F85\u3061\u6642\u9593" },
    "chip.msRange": { en: "ms (0-6000)", ja: "ms\uFF080\u301C6000\uFF09" },
    "chip.reselect": { en: "Choose again from the list", ja: "\u4E00\u89A7\u304B\u3089\u9078\u3073\u76F4\u3059" },
    "chip.delete": { en: "Delete", ja: "\u524A\u9664" },
    "chip.close": { en: "Close", ja: "\u9589\u3058\u308B" },
    "chip.rightMods": { en: "Right", ja: "\u53F3" },
    "chip.soloNote": {
      en: "Mouse and media actions take no modifiers and no delay.",
      ja: "\u30DE\u30A6\u30B9\uFF0F\u30E1\u30C7\u30A3\u30A2\u306F\u4FEE\u98FE\u30AD\u30FC\u3068\u5F85\u3061\u6642\u9593\u3092\u6301\u3061\u307E\u305B\u3093\u3002"
    },
    // -- toasts
    "toast.noCombine": {
      en: "Mouse and media actions cannot be combined with other keys",
      ja: "\u30DE\u30A6\u30B9\uFF0F\u30E1\u30C7\u30A3\u30A2\u306F\u4ED6\u306E\u30AD\u30FC\u3068\u7D44\u307F\u5408\u308F\u305B\u3067\u304D\u307E\u305B\u3093"
    },
    "toast.noModsSpecial": {
      en: "Mouse and media actions take no modifiers",
      ja: "\u30DE\u30A6\u30B9\uFF0F\u30E1\u30C7\u30A3\u30A2\u306B\u4FEE\u98FE\u30AD\u30FC\u306F\u4ED8\u3051\u3089\u308C\u307E\u305B\u3093"
    },
    "toast.maxChips": {
      en: "A key holds at most {n} chips",
      ja: "1 \u3064\u306E\u30AD\u30FC\u306B\u5165\u308C\u3089\u308C\u308B\u306E\u306F {n} \u500B\u307E\u3067\u3067\u3059"
    },
    "toast.chipsCut": {
      en: "At most {n} chips. The rest were dropped",
      ja: "\u30C1\u30C3\u30D7\u306F {n} \u500B\u307E\u3067\u3067\u3059\u3002\u4EE5\u964D\u306F\u5207\u308A\u6368\u3066\u307E\u3057\u305F"
    },
    "toast.badChars": {
      en: "These characters cannot be typed: {c}",
      ja: "\u4F7F\u3048\u306A\u3044\u6587\u5B57\u304C\u3042\u308A\u307E\u3059: {c}"
    },
    "toast.badChar": {
      en: "This layout cannot type: {c}",
      ja: "\u3053\u306E\u30EC\u30A4\u30A2\u30A6\u30C8\u3067\u306F\u5165\u529B\u3067\u304D\u306A\u3044\u6587\u5B57\u3067\u3059: {c}"
    },
    "toast.mouseModOne": {
      en: "A mouse action takes exactly one of Ctrl, Shift or Alt ({d} will not apply)",
      ja: "\u30DE\u30A6\u30B9\u306B\u4ED8\u3051\u3089\u308C\u308B\u306E\u306F Ctrl\u30FBShift\u30FBAlt \u306E\u3044\u305A\u308C\u304B1\u3064\u3060\u3051\u3067\u3059\uFF08{d} \u306F\u4ED8\u304D\u307E\u305B\u3093\uFF09"
    },
    "toast.mouseNoMods": {
      en: "Mouse actions take no modifiers. Clear the armed modifiers first",
      ja: "\u30DE\u30A6\u30B9\u306B\u4FEE\u98FE\u30AD\u30FC\u306F\u4ED8\u3051\u3089\u308C\u307E\u305B\u3093\u3002\u4FEE\u98FE\u3092\u89E3\u9664\u3057\u3066\u304F\u3060\u3055\u3044"
    },
    "toast.mediaNoMods": {
      en: "Media actions take no modifiers. Clear the armed modifiers first",
      ja: "\u30E1\u30C7\u30A3\u30A2\u306B\u4FEE\u98FE\u30AD\u30FC\u306F\u4ED8\u3051\u3089\u308C\u307E\u305B\u3093\u3002\u4FEE\u98FE\u3092\u89E3\u9664\u3057\u3066\u304F\u3060\u3055\u3044"
    },
    // -- picker
    "pk.title": { en: "Choose a key", ja: "\u30AD\u30FC\u3092\u9078\u3076" },
    "pk.stop": { en: "Stop", ja: "\u3084\u3081\u308B" },
    "pk.search": {
      en: "Type to search  e.g. mouse / win / f13 / \u2191",
      ja: "\u6253\u3063\u3066\u63A2\u3059  \u4F8B: mouse / win / f13 / \u2191 / \u307E\u3046\u3059"
    },
    "pk.noMatch": {
      en: "No match. You can also pick from the list below.",
      ja: "\u8A72\u5F53\u306A\u3057\u3002\u4E0B\u306E\u4E00\u89A7\u304B\u3089\u3082\u9078\u3079\u307E\u3059\u3002"
    },
    "pk.reselecting": { en: "Choosing key {n} again", ja: "{n}\u756A\u76EE\u306E\u30AD\u30FC\u3092\u9078\u3073\u76F4\u3057\u3066\u3044\u307E\u3059" },
    "pk.reselectNote": {
      en: "The chosen key replaces it (modifiers and delay are kept)",
      ja: "\u9078\u3093\u3060\u30AD\u30FC\u3067\u7F6E\u304D\u63DB\u3048\u307E\u3059\uFF08\u4FEE\u98FE\u30AD\u30FC\u3068\u5F85\u3061\u6642\u9593\u306F\u6B8B\u308A\u307E\u3059\uFF09"
    },
    "pk.keyboard": { en: "Keyboard", ja: "\u30AD\u30FC\u30DC\u30FC\u30C9" },
    "pk.mouse": { en: "Mouse", ja: "\u30DE\u30A6\u30B9" },
    "pk.media": { en: "Media", ja: "\u30E1\u30C7\u30A3\u30A2" },
    "pk.blockedSpecial": {
      en: "Not available while a mouse or media action is in the sequence. Delete that chip first.",
      ja: "\u3044\u307E\u306F\u30DE\u30A6\u30B9\uFF0F\u30E1\u30C7\u30A3\u30A2\u304C\u5165\u3063\u3066\u3044\u308B\u305F\u3081\u9078\u3079\u307E\u305B\u3093\u3002\u5148\u306B\u305D\u306E\u30C1\u30C3\u30D7\u3092\u6D88\u3057\u3066\u304F\u3060\u3055\u3044\u3002"
    },
    "pk.charsNote": {
      en: "These are the characters this layout <b>actually types</b> (not the HID names).",
      ja: "\u3053\u306E\u6A5F\u7A2E\u306E\u30AD\u30FC\u30DC\u30FC\u30C9\u914D\u5217\u3067<b>\u5B9F\u969B\u306B\u51FA\u308B\u6587\u5B57</b>\u3092\u4E26\u3079\u3066\u3044\u307E\u3059\uFF08HID \u306E\u540D\u524D\u3067\u306F\u3042\u308A\u307E\u305B\u3093\uFF09\u3002"
    },
    "pk.shiftCost": {
      en: " <b>While Shift is armed every one costs 2 steps.</b>",
      ja: " <b>Shift \u4E2D\u306F\u3069\u308C\u30822\u30B9\u30C6\u30C3\u30D7\u4F7F\u3044\u307E\u3059\u3002</b>"
    },
    "pk.letters": { en: "Letters", ja: "\u82F1\u5B57" },
    "pk.digits": { en: "Digits", ja: "\u6570\u5B57" },
    "pk.digitsShift": { en: "Symbols (number row)", ja: "\u8A18\u53F7\uFF08\u6570\u5B57\u30AD\u30FC\uFF09" },
    "pk.symbols": { en: "Symbols", ja: "\u8A18\u53F7" },
    "pk.symbolsShift": { en: "Symbols (other)", ja: "\u8A18\u53F7\uFF08\u305D\u306E\u4ED6\uFF09" },
    "pk.navEdit": { en: "Arrows & editing", ja: "\u77E2\u5370\u30FB\u7DE8\u96C6" },
    "pk.fkeys": {
      en: "F13-F24 (not on a normal keyboard)",
      ja: "F13\u301CF24\uFF08\u666E\u901A\u306E\u30AD\u30FC\u30DC\u30FC\u30C9\u306B\u7121\u3044\uFF09"
    },
    "pk.jisKeys": {
      en: "Japanese keys (the vendor tool cannot set these)",
      ja: "\u65E5\u672C\u8A9E\u30AD\u30FC\uFF08\u30E1\u30FC\u30AB\u30FC\u88FD\u30C4\u30FC\u30EB\u3067\u306F\u8A2D\u5B9A\u4E0D\u53EF\uFF09"
    },
    "pk.soloNote": {
      en: "Can only be set on its own (cannot be combined). Choosing one replaces the current sequence.",
      ja: "\u5358\u72EC\u3067\u306E\u307F\u8A2D\u5B9A\u3067\u304D\u307E\u3059\uFF08\u4ED6\u3068\u7D44\u307F\u5408\u308F\u305B\u4E0D\u53EF\uFF09\u3002\u9078\u3076\u3068\u4ECA\u306E\u4E26\u3073\u3092\u7F6E\u304D\u63DB\u3048\u307E\u3059\u3002"
    },
    "pk.mouseArmed": {
      en: "Will be set with <b>{m}</b>.",
      ja: "<b>{m}</b> \u3092\u4ED8\u3051\u3066\u8A2D\u5B9A\u3057\u307E\u3059\u3002"
    },
    "pk.mouseArmedDrop": {
      en: " (Only Ctrl, Shift and Alt can ride on a mouse action.)",
      ja: "\uFF08\u30DE\u30A6\u30B9\u306B\u4ED8\u3051\u3089\u308C\u308B\u306E\u306F Ctrl\u30FBShift\u30FBAlt \u3060\u3051\u3067\u3059\uFF09"
    },
    "pk.mouseHint": {
      en: "Arm Ctrl, Shift or Alt above and it rides along (e.g. Ctrl+Wheel up). The wheel and modifier+wheel cannot be set by the vendor tool at all.",
      ja: "\u4E0A\u306E\u4FEE\u98FE\u3067 Ctrl\u30FBShift\u30FBAlt \u3092\u62BC\u3057\u3066\u304A\u304F\u3068\u3001\u305D\u308C\u3092\u4ED8\u3051\u3066\u8A2D\u5B9A\u3067\u304D\u307E\u3059\uFF08\u4F8B: Ctrl\uFF0B\u30DB\u30A4\u30FC\u30EB\u2191\uFF09\u3002\u30DB\u30A4\u30FC\u30EB\u3068 \u4FEE\u98FE\uFF0B\u30DB\u30A4\u30FC\u30EB \u306F\u30E1\u30FC\u30AB\u30FC\u88FD\u30C4\u30FC\u30EB\u3067\u306F\u8A2D\u5B9A\u3067\u304D\u307E\u305B\u3093\u3002"
    },
    "pk.modsLabel": { en: "Modifiers", ja: "\u4FEE\u98FE" },
    "pk.modsArmed": {
      en: "The next key you choose gets <b>{m}</b>. Press it again with nothing chosen to clear.",
      ja: "\u6B21\u306B\u9078\u3076\u30AD\u30FC\u306B <b>{m}</b> \u304C\u4ED8\u304D\u307E\u3059\u3002\u4F55\u3082\u9078\u3070\u305A\u3082\u3046\u4E00\u5EA6\u62BC\u3059\u3068\u89E3\u9664\u3002"
    },
    "pk.modsIdle": {
      en: "Press one first and it attaches to the next key you choose. They can also be inserted on their own.",
      ja: "\u5148\u306B\u62BC\u3057\u3066\u304A\u304F\u3068\u3001\u6B21\u306B\u9078\u3076\u30AD\u30FC\u306B\u4ED8\u304D\u307E\u3059\u3002\u5358\u72EC\u3067\u5165\u308C\u308B\u3053\u3068\u3082\u3067\u304D\u307E\u3059\u3002"
    },
    "pk.badgeMod": { en: "mod", ja: "\u4FEE\u98FE" },
    "pk.badgeSolo": { en: "solo", ja: "\u5358\u72EC" },
    // -- conflict dialog
    "cf.title": {
      en: "The device differs from what is on screen",
      ja: "\u672C\u4F53\u306E\u8A2D\u5B9A\u304C\u753B\u9762\u3068\u9055\u3044\u307E\u3059"
    },
    "cf.sub": {
      en: "Choose which one to keep. The other is lost.",
      ja: "\u3069\u3061\u3089\u3092\u4F7F\u3046\u304B\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002\u9078\u3070\u306A\u304B\u3063\u305F\u5074\u306F\u5931\u308F\u308C\u307E\u3059\u3002"
    },
    "cf.takeDevice": { en: "Load the device values", ja: "\u672C\u4F53\u306E\u5024\u3092\u8AAD\u307F\u8FBC\u3080" },
    "cf.keepDraft": { en: "Keep my edits", ja: "\u7DE8\u96C6\u4E2D\u306E\u8A2D\u5B9A\u3092\u4F7F\u3046" },
    "cf.count": { en: "{n} differences", ja: "\u98DF\u3044\u9055\u3044 {n} \u4EF6" },
    // -- write dialog
    "wr.title": { en: "Write to the device", ja: "\u672C\u4F53\u306B\u66F8\u304D\u8FBC\u307F\u307E\u3059" },
    "wr.sub": {
      en: "Writing {n} changes to the device.",
      ja: "\u5909\u66F4 {n} \u4EF6\u3092\u672C\u4F53\u306B\u66F8\u304D\u8FBC\u307F\u307E\u3059\u3002"
    },
    "wr.note": {
      en: "Takes about {s} seconds. Do not unplug the device.",
      ja: "\u6240\u8981 \u304A\u3088\u305D {s} \u79D2\u3002\u9014\u4E2D\u3067\u672C\u4F53\u3092\u5916\u3055\u306A\u3044\u3067\u304F\u3060\u3055\u3044\u3002"
    },
    "wr.cancel": { en: "Cancel", ja: "\u30AD\u30E3\u30F3\u30BB\u30EB" },
    "wr.go": { en: "Write", ja: "\u66F8\u304D\u8FBC\u3080" },
    "wr.progress": { en: "Writing\u2026 {i} / {n}", ja: "\u66F8\u304D\u8FBC\u307F\u4E2D\u2026 {i} / {n}" },
    "wr.verifying": { en: "Checking the device\u2026", ja: "\u672C\u4F53\u3092\u78BA\u8A8D\u3057\u3066\u3044\u307E\u3059\u2026" },
    "wr.partial": {
      en: "Wrote {n}, but {p} did not take effect",
      ja: "{n} \u4EF6\u66F8\u304D\u8FBC\u307F\u307E\u3057\u305F\u304C\u3001{p} \u4EF6\u304C\u53CD\u6620\u3055\u308C\u3066\u3044\u307E\u305B\u3093"
    },
    "wr.done": {
      en: "Wrote {n} changes to the device",
      ja: "{n} \u4EF6\u3092\u672C\u4F53\u306B\u66F8\u304D\u8FBC\u307F\u307E\u3057\u305F"
    },
    "wr.failed": {
      en: "Failed after writing {n}: {e}",
      ja: "{n} \u4EF6\u66F8\u304D\u8FBC\u3093\u3060\u3068\u3053\u308D\u3067\u5931\u6557\u3057\u307E\u3057\u305F: {e}"
    },
    "wr.none": { en: "none", ja: "\u306A\u3057" },
    "wr.diffRow": {
      en: "Layer {L} \xB7 <b>{k}</b> \u2192 {v}",
      ja: "\u30EC\u30A4\u30E4 {L} \xB7 <b>{k}</b> \u2192 {v}"
    },
    "wr.ledModeOnly": {
      en: "Layer {L} \xB7 <b>LED</b> (mode only)",
      ja: "\u30EC\u30A4\u30E4 {L} \xB7 <b>LED</b>\uFF08\u30E2\u30FC\u30C9\u306E\u307F\uFF09"
    },
    "wr.ledModeOnlyNote": {
      en: "This mode does not use the colours, so they are left as they are.",
      ja: "\u3053\u306E\u30E2\u30FC\u30C9\u3067\u306F\u8272\u306F\u4F7F\u308F\u308C\u306A\u3044\u305F\u3081\u3001\u8272\u306F\u4ECA\u306E\u307E\u307E\u3067\u3059\u3002"
    },
    "wr.ledBoth": {
      en: "Layer {L} \xB7 <b>LED</b> (colours and mode)",
      ja: "\u30EC\u30A4\u30E4 {L} \xB7 <b>LED</b>\uFF08\u8272\u3068\u30E2\u30FC\u30C9\uFF09"
    },
    // -- copy-to dialog
    "cp.title": { en: "Copy to other keys", ja: "\u4ED6\u306E\u30AD\u30FC\u3078\u30B3\u30D4\u30FC" },
    "cp.from": {
      en: "Copies {k} (layer {L}) as-is onto the keys you choose. Writing to the device happens later, all at once.",
      ja: "{k}\uFF08\u30EC\u30A4\u30E4 {L}\uFF09\u306E\u5185\u5BB9\u3092\u3001\u9078\u3093\u3060\u30AD\u30FC\u306B\u305D\u306E\u307E\u307E\u30B3\u30D4\u30FC\u3057\u307E\u3059\u3002\u672C\u4F53\u3078\u306E\u66F8\u304D\u8FBC\u307F\u306F\u5F8C\u3067\u307E\u3068\u3081\u3066\u884C\u3044\u307E\u3059\u3002"
    },
    "cp.waits": { en: " ({n} with a delay)", ja: "\uFF08\u5F85\u3061\u6642\u9593\u3064\u304D {n} \u500B\uFF09" },
    "cp.layer": { en: "Layer", ja: "\u30EC\u30A4\u30E4" },
    "cp.target": { en: "Destination", ja: "\u30B3\u30D4\u30FC\u5148" },
    "cp.targetIs": {
      en: "Destination: {k} (layer {L})",
      ja: "\u30B3\u30D4\u30FC\u5148: {k}\uFF08\u30EC\u30A4\u30E4 {L}\uFF09"
    },
    "cp.pickTarget": {
      en: "Choose a destination key.",
      ja: "\u30B3\u30D4\u30FC\u5148\u306E\u30AD\u30FC\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002"
    },
    "cp.cancel": { en: "Cancel", ja: "\u30AD\u30E3\u30F3\u30BB\u30EB" },
    "cp.go": { en: "Copy here", ja: "\u3053\u3053\u3078\u30B3\u30D4\u30FC" }
  };
  function t(key, vars = null, lang = LANG) {
    const row = STRINGS[key];
    let s = row ? row[lang] !== void 0 ? row[lang] : row.en : key;
    if (vars) for (const [k, v] of Object.entries(vars))
      s = s.split("{" + k + "}").join(v);
    return s;
  }
  var KIND_KEYBOARD = 1;
  var KIND_MEDIA = 2;
  var KIND_MOUSE = 3;
  var KIND_NAMES = { 1: "key", 2: "media", 3: "mouse" };
  var MAX_CODES = 18;
  var MODS = {
    241: "Ctrl",
    242: "Shift",
    243: "Alt",
    244: "Win",
    245: "RCtrl",
    246: "RShift",
    247: "RAlt",
    248: "RWin"
  };
  var MODORDER = [241, 242, 243, 244, 245, 246, 247, 248];
  var MODS_LEFT = [241, 242, 243, 244];
  var MODS_RIGHT = [245, 246, 247, 248];
  var isMod = (c) => c >= 241 && c <= 248;
  var sortMods = (a) => a.slice().sort((x, y) => MODORDER.indexOf(x) - MODORDER.indexOf(y));
  var MOD_BY_NAME = (() => {
    const m = {};
    for (const [code, name] of Object.entries(MODS)) m[name.toLowerCase()] = +code;
    Object.assign(m, {
      command: 244,
      cmd: 244,
      "\u2318": 244,
      option: 243,
      opt: 243,
      "\u2325": 243,
      control: 241,
      "\u2303": 241,
      "right option": 247,
      "right command": 248
    });
    return m;
  })();
  var MOUSE_BUTTONS = {
    1: "MouseLeft",
    2: "MouseRight",
    4: "MouseMiddle",
    8: "MouseBack",
    16: "MouseForward"
  };
  var MOUSE_BY_NAME = byName(MOUSE_BUTTONS);
  var WHEEL_UP = 1;
  var WHEEL_DOWN = -1;
  var MEDIA_USAGES = {
    181: "NextTrack",
    182: "PrevTrack",
    183: "Stop",
    205: "PlayPause",
    226: "Mute",
    233: "VolumeUp",
    234: "VolumeDown",
    111: "BrightnessUp",
    112: "BrightnessDown",
    338: "BassUp",
    339: "BassDown",
    340: "TrebleUp",
    341: "TrebleDown",
    387: "MediaPlayer",
    394: "Email",
    402: "Calculator",
    404: "MyComputer",
    545: "WwwSearch",
    547: "WwwHome",
    548: "WwwBack",
    549: "WwwForward",
    551: "WwwRefresh"
  };
  var MEDIA_BY_NAME = byName(MEDIA_USAGES);
  var MEDIA_LABELS = {
    en: {
      181: "Next track",
      182: "Previous track",
      183: "Stop",
      205: "Play / Pause",
      226: "Mute",
      233: "Volume +",
      234: "Volume \u2212",
      111: "Screen brighter",
      112: "Screen dimmer",
      338: "Bass +",
      339: "Bass \u2212",
      340: "Treble +",
      341: "Treble \u2212",
      387: "Media player",
      394: "Email",
      402: "Calculator",
      404: "Open This PC",
      545: "Web search",
      547: "Home page",
      548: "Browser back",
      549: "Browser forward",
      551: "Reload"
    },
    ja: {
      181: "\u6B21\u306E\u66F2",
      182: "\u524D\u306E\u66F2",
      183: "\u505C\u6B62",
      205: "\u518D\u751F\uFF0F\u4E00\u6642\u505C\u6B62",
      226: "\u6D88\u97F3",
      233: "\u97F3\u91CF\uFF0B",
      234: "\u97F3\u91CF\u2212",
      111: "\u753B\u9762\u3092\u660E\u308B\u304F",
      112: "\u753B\u9762\u3092\u6697\u304F",
      338: "\u4F4E\u97F3\uFF0B",
      339: "\u4F4E\u97F3\u2212",
      340: "\u9AD8\u97F3\uFF0B",
      341: "\u9AD8\u97F3\u2212",
      387: "\u30E1\u30C7\u30A3\u30A2\u30D7\u30EC\u30FC\u30E4\u30FC",
      394: "\u30E1\u30FC\u30EB",
      402: "\u96FB\u5353",
      404: "PC \u3092\u958B\u304F",
      545: "Web \u691C\u7D22",
      547: "\u30DB\u30FC\u30E0\u30DA\u30FC\u30B8",
      548: "\u30D6\u30E9\u30A6\u30B6\u623B\u308B",
      549: "\u30D6\u30E9\u30A6\u30B6\u9032\u3080",
      551: "\u518D\u8AAD\u307F\u8FBC\u307F"
    }
  };
  var mediaLabel = (code, lang = LANG) => (MEDIA_LABELS[lang] || MEDIA_LABELS.en)[code] || MEDIA_LABELS.en[code] || MEDIA_USAGES[code] || hex(code);
  var MEDIA_ALIASES = {
    181: ["\u3064\u304E\u306E\u304D\u3087\u304F", "\u6B21\u306E\u66F2", "\u3064\u304E", "nexttrack", "next"],
    182: ["\u307E\u3048\u306E\u304D\u3087\u304F", "\u524D\u306E\u66F2", "\u307E\u3048", "prevtrack", "prev"],
    183: ["\u3066\u3044\u3057", "\u505C\u6B62", "stop"],
    205: ["\u3055\u3044\u305B\u3044", "\u518D\u751F", "\u3044\u3061\u3058\u3066\u3044\u3057", "\u4E00\u6642\u505C\u6B62", "playpause", "play", "pause"],
    226: ["\u3057\u3087\u3046\u304A\u3093", "\u6D88\u97F3", "\u307F\u3085\u30FC\u3068", "mute"],
    233: ["\u304A\u3093\u308A\u3087\u3046", "\u97F3\u91CF", "\u304A\u3093\u308A\u3087\u3046\u3042\u3063\u3077", "volumeup", "volup"],
    234: ["\u304A\u3093\u308A\u3087\u3046", "\u97F3\u91CF", "\u304A\u3093\u308A\u3087\u3046\u3060\u3046\u3093", "volumedown", "voldown"],
    111: ["\u3042\u304B\u308B\u304F", "\u660E\u308B\u304F", "\u304D\u3069", "\u8F1D\u5EA6", "brightnessup"],
    112: ["\u304F\u3089\u304F", "\u6697\u304F", "\u304D\u3069", "\u8F1D\u5EA6", "brightnessdown"],
    /* Up and down share every generic word, so each also carries a direction
       term -- without one no query can single out BassDown. */
    338: ["\u3066\u3044\u304A\u3093", "\u4F4E\u97F3", "\u3070\u3059", "\u3066\u3044\u304A\u3093\u3042\u3063\u3077", "\u4F4E\u97F3\uFF0B", "bassup"],
    339: ["\u3066\u3044\u304A\u3093", "\u4F4E\u97F3", "\u3070\u3059", "\u3066\u3044\u304A\u3093\u3060\u3046\u3093", "\u4F4E\u97F3\u2212", "bassdown"],
    340: ["\u3053\u3046\u304A\u3093", "\u9AD8\u97F3", "\u3068\u308C\u3076\u308B", "\u3053\u3046\u304A\u3093\u3042\u3063\u3077", "\u9AD8\u97F3\uFF0B", "trebleup"],
    341: ["\u3053\u3046\u304A\u3093", "\u9AD8\u97F3", "\u3068\u308C\u3076\u308B", "\u3053\u3046\u304A\u3093\u3060\u3046\u3093", "\u9AD8\u97F3\u2212", "trebledown"],
    387: ["\u3081\u3067\u3043\u3042\u3077\u308C\u30FC\u3084\u30FC", "\u30E1\u30C7\u30A3\u30A2\u30D7\u30EC\u30FC\u30E4\u30FC", "mediaplayer"],
    394: ["\u3081\u30FC\u308B", "\u30E1\u30FC\u30EB", "email", "mail"],
    402: ["\u3067\u3093\u305F\u304F", "\u96FB\u5353", "\u3051\u3044\u3055\u3093", "calculator", "calc"],
    404: ["\u3074\u30FC\u3057\u30FC", "PC", "\u307E\u3044\u3053\u3093\u3074\u3085\u30FC\u305F", "mycomputer", "explorer"],
    545: ["\u3051\u3093\u3055\u304F", "\u691C\u7D22", "wwwsearch", "search"],
    547: ["\u307B\u30FC\u3080\u307A\u30FC\u3058", "\u30DB\u30FC\u30E0\u30DA\u30FC\u30B8", "\u307B\u30FC\u3080", "wwwhome", "home"],
    548: ["\u3082\u3069\u308B", "\u623B\u308B", "\u3076\u3089\u3046\u3056", "wwwback", "back"],
    549: ["\u3059\u3059\u3080", "\u9032\u3080", "\u3076\u3089\u3046\u3056", "wwwforward", "forward"],
    551: ["\u3055\u3044\u3088\u307F\u3053\u307F", "\u518D\u8AAD\u307F\u8FBC\u307F", "\u308A\u308D\u30FC\u3069", "wwwrefresh", "refresh", "reload"]
  };
  var MOUSE_ALIASES = {
    MouseLeft: ["\u3072\u3060\u308A\u304F\u308A\u3063\u304F", "\u5DE6\u30AF\u30EA\u30C3\u30AF", "\u3072\u3060\u308A", "\u5DE6", "mouseleft", "lclick"],
    MouseRight: ["\u307F\u304E\u304F\u308A\u3063\u304F", "\u53F3\u30AF\u30EA\u30C3\u30AF", "\u307F\u304E", "\u53F3", "mouseright", "rclick"],
    MouseMiddle: [
      "\u3061\u3085\u3046\u304A\u3046\u304F\u308A\u3063\u304F",
      "\u4E2D\u592E\u30AF\u30EA\u30C3\u30AF",
      "\u3061\u3085\u3046\u304A\u3046",
      "\u307E\u3093\u306A\u304B",
      "mousemiddle",
      "mclick"
    ],
    MouseBack: ["\u3082\u3069\u308B", "\u623B\u308B", "mouseback", "back"],
    MouseForward: ["\u3059\u3059\u3080", "\u9032\u3080", "mouseforward", "forward"],
    WheelUp: [
      "\u307B\u3044\u30FC\u308B",
      "\u30DB\u30A4\u30FC\u30EB",
      "\u307B\u3044\u30FC\u308B\u3046\u3048",
      "\u3059\u304F\u308D\u30FC\u308B",
      "wheelup",
      "wheel",
      "scrollup"
    ],
    WheelDown: [
      "\u307B\u3044\u30FC\u308B",
      "\u30DB\u30A4\u30FC\u30EB",
      "\u307B\u3044\u30FC\u308B\u3057\u305F",
      "\u3059\u304F\u308D\u30FC\u308B",
      "wheeldown",
      "wheel",
      "scrolldown"
    ]
  };
  var mediaList = (lang = LANG) => [
    205,
    181,
    182,
    183,
    // transport
    233,
    234,
    226,
    // volume
    111,
    112,
    // brightness
    402,
    404,
    394,
    387,
    // apps
    547,
    545,
    548,
    549,
    551,
    // browser
    338,
    339,
    340,
    341
    // tone
  ].map((c) => ({
    code: c,
    name: MEDIA_USAGES[c],
    label: mediaLabel(c, lang),
    alias: MEDIA_ALIASES[c] || []
  }));
  var HID_NAMES = (() => {
    const n = {};
    for (let i = 0; i < 26; i++) n[4 + i] = String.fromCharCode(65 + i);
    "1234567890".split("").forEach((c, i) => {
      n[30 + i] = c;
    });
    Object.assign(n, {
      40: "Enter",
      41: "Esc",
      42: "Backspace",
      43: "Tab",
      44: "Space",
      45: "Minus",
      46: "Equal",
      47: "LBracket",
      48: "RBracket",
      49: "Backslash",
      50: "NonUsHash",
      51: "Semicolon",
      52: "Quote",
      100: "NonUsBackslash",
      101: "Application",
      53: "Grave",
      54: "Comma",
      55: "Period",
      56: "Slash",
      57: "CapsLock",
      70: "PrintScreen",
      71: "ScrollLock",
      72: "Pause",
      73: "Insert",
      74: "Home",
      75: "PageUp",
      76: "Delete",
      77: "End",
      78: "PageDown",
      79: "Right",
      80: "Left",
      81: "Down",
      82: "Up",
      83: "NumLock",
      135: "JisRo",
      136: "JisKana",
      137: "JisYen",
      138: "JisHenkan",
      139: "JisMuhenkan"
    });
    for (let i = 0; i < 12; i++) n[58 + i] = "F" + (i + 1);
    for (let i = 0; i < 12; i++) n[104 + i] = "F" + (i + 13);
    return n;
  })();
  var NAME_TO_HID = byName(HID_NAMES);
  var KEYPAD_NAMES = {
    84: "KpDivide",
    85: "KpMultiply",
    86: "KpMinus",
    87: "KpPlus",
    88: "KpEnter",
    89: "Kp1",
    90: "Kp2",
    91: "Kp3",
    92: "Kp4",
    93: "Kp5",
    94: "Kp6",
    95: "Kp7",
    96: "Kp8",
    97: "Kp9",
    98: "Kp0",
    99: "KpDot"
  };
  var JIS_OUTPUT = {
    30: ["1", "!"],
    31: ["2", '"'],
    32: ["3", "#"],
    33: ["4", "$"],
    34: ["5", "%"],
    35: ["6", "&"],
    36: ["7", "'"],
    37: ["8", "("],
    38: ["9", ")"],
    39: ["0", null],
    45: ["-", "="],
    46: ["^", "~"],
    47: ["@", "`"],
    48: ["[", "{"],
    49: ["]", "}"],
    51: [";", "+"],
    52: [":", "*"],
    53: ["Zenkaku", null],
    54: [",", "<"],
    55: [".", ">"],
    56: ["/", "?"],
    135: ["\\", "_"],
    137: ["\\", "|"]
  };
  var JIS_VERIFIED = /* @__PURE__ */ new Set([
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    45,
    46,
    47,
    48,
    49,
    51,
    52,
    54,
    55,
    56,
    135,
    137
  ]);
  var LAYOUTS = {
    jis: {
      id: "jis",
      name: "Japanese (JIS 106/109)",
      output: JIS_OUTPUT,
      verified: JIS_VERIFIED
    }
  };
  var LAYOUT = "jis";
  function setLayout(l) {
    LAYOUT = LAYOUTS[l] ? l : "jis";
    return LAYOUT;
  }
  function glyphFor(code, shifted = false, layout = LAYOUT) {
    const map = (LAYOUTS[layout] || LAYOUTS.jis).output;
    const pair = map[code];
    if (!pair) return null;
    const out = shifted ? pair[1] : pair[0];
    return out && out.length === 1 ? out : null;
  }
  function keyLabel(code, shifted = false, layout = LAYOUT) {
    const g = glyphFor(code, shifted, layout);
    if (g) return g;
    if (!shifted && code >= 4 && code <= 29)
      return String.fromCharCode(97 + code - 4);
    if (shifted && code >= 4 && code <= 29)
      return String.fromCharCode(65 + code - 4);
    return null;
  }
  var CHAR_TO_KEY = (() => {
    const m = {};
    for (const [u, pair] of Object.entries(JIS_OUTPUT)) {
      const [plain, shift] = pair;
      if (plain && plain.length === 1 && !(plain in m)) m[plain] = [+u, false];
      if (shift && shift.length === 1 && !(shift in m)) m[shift] = [+u, true];
    }
    for (let i = 0; i < 26; i++) {
      m[String.fromCharCode(97 + i)] = [4 + i, false];
      m[String.fromCharCode(65 + i)] = [4 + i, true];
    }
    return m;
  })();
  function keysForChar(ch) {
    if (ch === " ") return [44];
    const ent = CHAR_TO_KEY[ch];
    if (!ent) return null;
    const [usage, shift] = ent;
    return shift ? [242, usage] : [usage];
  }
  function keysForText(s) {
    const codes = [];
    const bad = [];
    for (const ch of s) {
      const part = keysForChar(ch);
      if (!part) {
        bad.push(ch);
        continue;
      }
      codes.push(...part);
    }
    if (bad.length) return { error: "no key types: " + bad.join(" "), bad };
    return { codes };
  }
  var KNOB_ACTIONS = ["CCW", "Press", "CW"];
  var KNOB_ORDER = [1, 2, 3];
  function setKnobOrder(order) {
    if (Array.isArray(order) && order.length === 3) {
      KNOB_ORDER = order.slice();
    }
  }
  var MAX_KEY_ID = 25;
  var isPhysical = (id) => id >= 1 && id <= MAX_KEY_ID;
  function keyIdToName(id) {
    if (id >= 1 && id <= 16) return "key" + String(id).padStart(2, "0");
    if (id >= 17 && id <= 25) {
      const block = Math.floor((id - 17) / 3);
      return "knob" + KNOB_ORDER[block] + "-" + KNOB_ACTIONS[(id - 17) % 3];
    }
    return null;
  }
  function nameToKeyId(name) {
    const s = String(name).trim();
    let m = /^key0*(\d+)$/i.exec(s);
    if (m) {
      const n = +m[1];
      return n >= 1 && n <= 16 ? n : null;
    }
    m = /^knob([1-3])-(ccw|press|cw)$/i.exec(s);
    if (m) {
      const block = KNOB_ORDER.indexOf(+m[1]);
      if (block < 0) return null;
      const act = KNOB_ACTIONS.findIndex((a) => a.toLowerCase() === m[2].toLowerCase());
      return 17 + block * 3 + act;
    }
    return null;
  }
  function allTargets() {
    const out = [];
    for (let id = 1; id <= 25; id++) out.push({ keyId: id, name: keyIdToName(id) });
    return out;
  }
  var LED_MODES = {
    0: "off",
    1: "static"
  };
  var LED_SLOTS = 16;
  var LED_MODE_HELP = {
    ko: {
      0: "LED\uB97C \uC644\uC804\uD788 \uB055\uB2C8\uB2E4.",
      1: "\uC9C0\uC815\uD55C \uC0C9\uC0C1\uC73C\uB85C \uD0A4\uD328\uB4DC \uBC31\uB77C\uC774\uD2B8\uB97C \uD56D\uC0C1 \uCF2D\uB2C8\uB2E4."
    },
    en: {
      0: "Off \u2014 no lights",
      1: "Always on \u2014 lights up with your chosen colours"
    },
    ja: {
      0: "\u6D88\u706F",
      1: "\u5E38\u6642\u70B9\u706F \u2014 \u30AD\u30FC\u3054\u3068\u306E\u8272\u304C\u51FA\u307E\u3059"
    }
  };
  var LED_MODE_TRAITS = {
    0: { perKey: false, animated: false },
    1: { perKey: true, animated: false }
  };
  var LED_NO_COLOR_REASON = {
    ko: {
      0: "\uC18C\uB4F1 \uBAA8\uB4DC\uC5D0\uC11C\uB294 \uC0C9\uC0C1\uC774 \uAEBC\uC9D1\uB2C8\uB2E4. \uBD88\uC744 \uCF1C\uB824\uBA74 [\uC0C1\uC2DC \uC810\uB4F1]\uC744 \uC120\uD0DD\uD558\uC138\uC694."
    },
    en: {
      0: "Off mode cannot use LED colours. Choose Always on to set colours."
    },
    ja: {
      0: "\u6D88\u706F\u30E2\u30FC\u30C9\u3067\u306F LED\u306E\u8272\u3092\u8A2D\u5B9A\u3067\u304D\u307E\u305B\u3093\u3002\u300C\u5E38\u6642\u70B9\u706F\u300D\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002"
    }
  };
  var LED_MODE_LABELS = {
    ko: { 0: "0 \u2014 \uC18C\uB4F1 (LED \uB044\uAE30)", 1: "1 \u2014 \uC0C1\uC2DC \uC810\uB4F1 (LED \uCF1C\uAE30)" },
    en: { 0: "0 \u2014 Off", 1: "1 \u2014 Always on" },
    ja: { 0: "0 \u2014 \u6D88\u706F", 1: "1 \u2014 \u5E38\u6642\u70B9\u706F" }
  };
  var ledModeLabel = (n, lang = LANG) => (LED_MODE_LABELS[lang] || LED_MODE_LABELS.en)[n] || LED_MODE_LABELS.en[n] || LED_MODES[n] || String(n);
  var ledModeList = (lang = LANG) => {
    const help = LED_MODE_HELP[lang] || LED_MODE_HELP.en;
    const why = LED_NO_COLOR_REASON[lang] || LED_NO_COLOR_REASON.en;
    return Object.entries(LED_MODES).map(([n, name]) => ({
      n: +n,
      name,
      label: ledModeLabel(+n, lang),
      help: help[+n] || "",
      noColor: why[+n] || "",
      ...LED_MODE_TRAITS[+n] || { perKey: true, animated: false }
    }));
  };
  var VENDOR_PALETTE = [
    ["#ff0000", "#ff8030", "#ffff30", "#00ff00", "#00ffff", "#0000ff", "#800080"],
    ["#8b0000", "#ffa500", "#ffff96", "#7dff00", "#008b8b", "#00008b", "#ff00ff"],
    ["#a00000", "#ff8c00", "#ffd700", "#00fa9a", "#e0ffff", "#87ceeb", "#4b0082"],
    ["#ff6666", "#ffc864", "#ffff99", "#006400", "#0f8b8b", "#1e90ff", "#f0f0ff"],
    ["#ffc0cb", "#ffc000", "#c8b400", "#808000", "#00fa9a", "#3a0a6b", "#9932cc"],
    ["#ff4500", "#ff5a00", "#c8ff00", "#90ee90", "#7fb3b3", "#add8e6", "#9090c8"],
    ["#ffffc8", "#ff8c00", "#a8a878", "#228b22", "#0080ff", "#0096ff", "#d8b0ff"],
    ["#ff00ff", "#ff6400", "#a8b878", "#22cc22", "#00b478", "#9090c8", "#c8c896"]
  ];
  var WIRELESS_NOTES = {
    ko: "Bluetooth / 2.4G \uBB34\uC120\uC73C\uB85C \uC0AC\uC6A9\uD558\uAE30 \uC804\uC5D0 \uBA3C\uC800 USB\uB85C \uC5F0\uACB0\uD558\uC5EC \uC124\uC815\uD574 \uC8FC\uC138\uC694. \uBB34\uC120 \uC0AC\uC6A9 \uC2DC\uC5D0\uB294 \uC808\uC804\uC744 \uC704\uD574 RGB LED\uAC00 \uAEBC\uC9D1\uB2C8\uB2E4. USB \uD5C8\uBE0C\uB97C \uD1B5\uD558\uC9C0 \uB9D0\uACE0 \uCEF4\uD4E8\uD130\uC5D0 \uC9C1\uC811 \uC5F0\uACB0\uD574 \uC8FC\uC138\uC694.",
    en: "Set the device up over USB before using Bluetooth or 2.4G. RGB is off on wireless. Connect it directly, not through a hub.",
    ja: "Bluetooth\uFF0F2.4G \u3067\u4F7F\u3046\u524D\u306B\u3001USB \u3067\u3064\u306A\u3044\u3067\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u7121\u7DDA\u6642\u306F RGB \u304C\u6D88\u706F\u3057\u307E\u3059\u3002\u30CF\u30D6\u7D4C\u7531\u3067\u306F\u306A\u304F\u76F4\u63A5\u3064\u306A\u3044\u3067\u304F\u3060\u3055\u3044\u3002"
  };
  var wirelessNote = (lang = LANG) => WIRELESS_NOTES[lang] || WIRELESS_NOTES.en;
  var charTable = () => {
    const out = {};
    for (const [u, pair] of Object.entries(JIS_OUTPUT)) {
      const [plain, shift] = pair;
      if (plain && plain.length === 1) out[plain] = { usage: +u, shift: false };
      if (shift && shift.length === 1) out[shift] = { usage: +u, shift: true };
    }
    for (let i = 0; i < 26; i++) {
      out[String.fromCharCode(97 + i)] = { usage: 4 + i, shift: false };
      out[String.fromCharCode(65 + i)] = { usage: 4 + i, shift: true };
    }
    return out;
  };
  var MOUSE_LABELS = {
    en: {
      MouseLeft: "Left click",
      MouseRight: "Right click",
      MouseMiddle: "Middle click",
      MouseBack: "Back",
      MouseForward: "Forward",
      WheelUp: "Wheel \u2191",
      WheelDown: "Wheel \u2193"
    },
    ja: {
      MouseLeft: "\u5DE6\u30AF\u30EA\u30C3\u30AF",
      MouseRight: "\u53F3\u30AF\u30EA\u30C3\u30AF",
      MouseMiddle: "\u4E2D\u592E\u30AF\u30EA\u30C3\u30AF",
      MouseBack: "\u623B\u308B",
      MouseForward: "\u9032\u3080",
      WheelUp: "\u30DB\u30A4\u30FC\u30EB\u2191",
      WheelDown: "\u30DB\u30A4\u30FC\u30EB\u2193"
    }
  };
  var mouseLabel = (name, lang = LANG) => (MOUSE_LABELS[lang] || MOUSE_LABELS.en)[name] || MOUSE_LABELS.en[name] || name;
  var MOUSE_ACTIONS = [
    { name: "MouseLeft", label: MOUSE_LABELS.en.MouseLeft, buttons: 1, wheel: 0, mod: 0 },
    { name: "MouseRight", label: MOUSE_LABELS.en.MouseRight, buttons: 2, wheel: 0, mod: 0 },
    { name: "MouseMiddle", label: MOUSE_LABELS.en.MouseMiddle, buttons: 4, wheel: 0, mod: 0 },
    { name: "MouseBack", label: MOUSE_LABELS.en.MouseBack, buttons: 8, wheel: 0, mod: 0 },
    { name: "MouseForward", label: MOUSE_LABELS.en.MouseForward, buttons: 16, wheel: 0, mod: 0 },
    { name: "WheelUp", label: MOUSE_LABELS.en.WheelUp, buttons: 0, wheel: 1, mod: 0 },
    { name: "WheelDown", label: MOUSE_LABELS.en.WheelDown, buttons: 0, wheel: -1, mod: 0 }
    /* Modifier combinations are not listed here: arming Ctrl and picking
     * ホイール↑ produces Ctrl+WheelUp. Where the modifier lands on the wire
     * (mod field for mouse, an inline code for keyboard) is decided when the
     * binding is built. */
  ];
  var MOUSE_MOD_OK = { 241: 241, 242: 242, 243: 243 };
  function armMouse(action, armed = []) {
    const ok = [], dropped = [];
    for (const c of armed) (MOUSE_MOD_OK[c] ? ok : dropped).push(c);
    if (!ok.length) return { action, dropped };
    const [first, ...rest] = ok;
    dropped.push(...rest);
    const names = { 241: "Ctrl", 242: "Shift", 243: "Alt" };
    return {
      action: {
        ...action,
        mod: first,
        name: names[first] + "+" + action.name,
        label: names[first] + "+" + action.label
      },
      dropped
    };
  }
  var MOUSE_ACTION_BY_NAME = Object.fromEntries(MOUSE_ACTIONS.map((a) => [a.name.toLowerCase(), a]));
  var mouseActions = (lang = LANG) => MOUSE_ACTIONS.map((a) => ({ ...a, label: mouseLabel(a.name, lang) }));
  var mouseNames = () => Object.values(MOUSE_BUTTONS).sort();
  var mediaNames = () => Object.values(MEDIA_USAGES).sort();
  function labelFor(code, kind = KIND_KEYBOARD, shifted = false, layout = LAYOUT, raw = false) {
    if (kind === KIND_MEDIA) return MEDIA_USAGES[code] || hex(code);
    if (kind === KIND_MOUSE) return MOUSE_BUTTONS[code] || hex(code);
    if (MODS[code]) return MODS[code];
    if (!raw) {
      const g = keyLabel(code, shifted, layout);
      if (g) return g;
    }
    return HID_NAMES[code] || KEYPAD_NAMES[code] || hex(code);
  }
  function jisFor(code, shifted = false) {
    return glyphFor(code, shifted, "jis");
  }
  var hex = (c) => "0x" + c.toString(16).toUpperCase().padStart(2, "0");
  function byName(table) {
    const m = {};
    for (const [code, name] of Object.entries(table)) m[name.toLowerCase()] = +code;
    return m;
  }

  // pad-wire.js
  var pad_wire_exports = {};
  __export(pad_wire_exports, {
    CMD_COMMIT: () => CMD_COMMIT,
    CMD_LED_INIT: () => CMD_LED_INIT,
    N_ENTRIES: () => N_ENTRIES,
    OP_LED: () => OP_LED,
    OP_READ: () => OP_READ,
    OP_WRITE: () => OP_WRITE,
    PACKET: () => PACKET,
    REPORT_ID: () => REPORT_ID,
    decodeBinding: () => decodeBinding,
    decodeLeds: () => decodeLeds,
    encodeBinding: () => encodeBinding,
    encodeCommit: () => encodeCommit,
    encodeLedInit: () => encodeLedInit,
    encodeLeds: () => encodeLeds,
    encodeReadLayer: () => encodeReadLayer,
    encodeReadLeds: () => encodeReadLeds,
    foldMods: () => foldMods,
    looksLikeBinding: () => looksLikeBinding,
    slotCost: () => slotCost
  });
  var REPORT_ID = 3;
  var PACKET = 64;
  var N_ENTRIES = 25;
  var OP_WRITE = 253;
  var OP_READ = 250;
  var OP_LED = 176;
  var CMD_COMMIT = [253, 254, 255];
  var CMD_LED_INIT = [251, 251, 251];
  var PAYLOAD = 6;
  var SLOT = 3;
  var usageAt = (i) => PAYLOAD + i * SLOT + 2;
  var MOUSE_MOD = 8;
  var MOUSE_BUTTON = 11;
  var MOUSE_WHEEL = 20;
  function encodeBinding(b) {
    if (!b || typeof b !== "object") throw new Error("binding: not an object");
    if (!isPhysical(b.keyId)) throw new Error("binding: bad keyId " + b.keyId);
    if (!(b.layer >= 1 && b.layer <= 3)) throw new Error("binding: bad layer " + b.layer);
    if (![KIND_KEYBOARD, KIND_MEDIA, KIND_MOUSE].includes(b.kind)) {
      throw new Error("binding: bad kind " + b.kind);
    }
    if (b.kind === KIND_MOUSE) {
      if (b.mouse && typeof b.mouse !== "object") throw new Error("binding: bad mouse");
    } else {
      if (!Array.isArray(b.codes)) throw new Error("binding: codes must be an array");
      if (b.delays !== void 0 && !Array.isArray(b.delays)) {
        throw new Error("binding: delays must be an array");
      }
      if (b.codes.length > MAX_CODES) {
        throw new Error("binding: " + b.codes.length + " slots exceeds " + MAX_CODES);
      }
    }
    const p = new Uint8Array(PACKET);
    p[0] = OP_WRITE;
    p[1] = b.keyId;
    p[2] = b.layer;
    p[3] = b.kind;
    if (b.kind === KIND_MOUSE) {
      const m = b.mouse || {};
      p[4] = 1;
      p[5] = 4;
      if (m.mod) p[MOUSE_MOD] = m.mod;
      if (m.buttons) p[MOUSE_BUTTON] = m.buttons;
      if (m.wheel) p[MOUSE_WHEEL] = m.wheel & 255;
      return p;
    }
    if (b.kind === KIND_MEDIA) {
      const usage = b.codes[0] | 0;
      p[4] = 0;
      p[5] = 2;
      p[usageAt(0)] = usage & 255;
      p[usageAt(1)] = usage >> 8 & 255;
      return p;
    }
    const codes = b.codes || [];
    const delays = b.delays || [];
    p[4] = 0;
    p[5] = codes.length;
    codes.forEach((c, i) => {
      const at = usageAt(i);
      const ms = delays[i] | 0;
      p[at - 2] = ms >> 8 & 255;
      p[at - 1] = ms & 255;
      p[at] = c;
    });
    return p;
  }
  function encodeReadLayer(layer) {
    const p = new Uint8Array(PACKET);
    p.set([OP_READ, N_ENTRIES, 0, layer]);
    return p;
  }
  function encodeReadLeds(layer) {
    const p = new Uint8Array(PACKET);
    p.set([OP_READ, OP_LED, layer - 1]);
    return p;
  }
  function encodeLeds(layer, mode, colors) {
    const p = new Uint8Array(PACKET);
    p.set([254, OP_LED, layer - 1, mode]);
    for (let i = 0; i < LED_SLOTS; i++) {
      const [r, g, bl] = colors[i] || [0, 0, 0];
      p[4 + i * 3] = r;
      p[5 + i * 3] = g;
      p[6 + i * 3] = bl;
    }
    return p;
  }
  function encodeCommit() {
    const p = new Uint8Array(PACKET);
    p.set(CMD_COMMIT);
    return p;
  }
  function encodeLedInit() {
    const p = new Uint8Array(PACKET);
    p.set(CMD_LED_INIT);
    return p;
  }
  function decodeBinding(bytes) {
    const r = toBytes(bytes);
    if (r[0] !== OP_READ) return null;
    const kind = r[3];
    const out = {
      keyId: r[1],
      layer: r[2],
      kind,
      codes: [],
      delays: []
    };
    if (kind === KIND_MOUSE) {
      out.mouse = {
        mod: r[MOUSE_MOD] || 0,
        buttons: r[MOUSE_BUTTON] || 0,
        // The wheel byte is signed: 0xFF means one click down, not 255.
        wheel: r[MOUSE_WHEEL] ? r[MOUSE_WHEEL] << 24 >> 24 : 0
      };
      return out;
    }
    if (kind === KIND_MEDIA) {
      const usage = r[usageAt(0)] | r[usageAt(1)] << 8;
      if (usage) {
        out.codes = [usage];
        out.delays = [0];
      }
      return out;
    }
    for (let i = 0; ; i++) {
      const at = usageAt(i);
      if (at >= r.length || !r[at]) break;
      out.codes.push(r[at]);
      out.delays.push(r[at - 2] << 8 | r[at - 1]);
    }
    return out;
  }
  function decodeLeds(bytes) {
    const r = toBytes(bytes);
    if (r[0] !== OP_READ) return null;
    const colors = [];
    for (let i = 0; i < LED_SLOTS; i++) {
      colors.push([r[2 + i * 3], r[3 + i * 3], r[4 + i * 3]]);
    }
    return { mode: r[1], colors };
  }
  function looksLikeBinding(bytes) {
    const r = toBytes(bytes);
    return r[0] === OP_READ && r[1] >= 1 && r[1] <= MAX_KEY_ID && r[2] >= 1 && r[2] <= 3 && r[3] >= 1 && r[3] <= 3;
  }
  var slotCost = (codes) => codes.length;
  function foldMods(codes, delays = []) {
    const out = [];
    let pending = [];
    codes.forEach((c, i) => {
      if (isMod(c)) {
        pending.push(c);
        return;
      }
      out.push({ code: c, mods: pending, ms: delays[i] | 0 });
      pending = [];
    });
    if (pending.length) {
      out.push({ code: pending[0], mods: pending.slice(1), ms: 0 });
    }
    return out;
  }
  function toBytes(x) {
    if (x instanceof Uint8Array) return x;
    if (ArrayBuffer.isView(x)) return new Uint8Array(x.buffer, x.byteOffset, x.byteLength);
    if (x instanceof ArrayBuffer) return new Uint8Array(x);
    return Uint8Array.from(x);
  }

  // pad-model.js
  var pad_model_exports = {};
  __export(pad_model_exports, {
    EXPORT_KIND: () => EXPORT_KIND,
    EXPORT_VERSION: () => EXPORT_VERSION,
    STORE_KEY: () => STORE_KEY,
    canonBinding: () => canonBinding,
    canonConfig: () => canonConfig,
    canonLayer: () => canonLayer,
    canonLeds: () => canonLeds,
    clearDraft: () => clearDraft,
    cloneConfig: () => cloneConfig,
    diff: () => diff,
    emptyConfig: () => emptyConfig,
    fromExport: () => fromExport,
    fromPlain: () => fromPlain,
    isNull: () => isNull,
    layerRows: () => layerRows,
    loadDraft: () => loadDraft,
    saveDraft: () => saveDraft,
    toExport: () => toExport,
    toPlain: () => toPlain,
    withBinding: () => withBinding,
    withLeds: () => withLeds
  });
  var LAYERS = [1, 2, 3];
  var LED_SLOTS2 = 16;
  var STORE_KEY = "macropad.draft.v1";
  var EXPORT_KIND = "macropad-config";
  var EXPORT_VERSION = 1;
  var KIND_MOUSE2 = 3;
  function canonBinding(b) {
    const keyId = b.keyId !== void 0 ? b.keyId : b.key_id;
    const kind = b.kind | 0;
    if (kind === KIND_MOUSE2) {
      const m = b.mouse || {};
      return {
        keyId,
        kind,
        mouse: { mod: m.mod | 0, buttons: m.buttons | 0, wheel: m.wheel | 0 }
      };
    }
    const codes = (b.codes || []).map((c) => c | 0);
    const delays = codes.map((_, i) => (b.delays && b.delays[i]) | 0);
    return { keyId, kind, codes, delays };
  }
  function canonLayer(rows) {
    const out = /* @__PURE__ */ new Map();
    for (const r of rows || []) {
      const c = canonBinding(r);
      if (isNull(c)) continue;
      out.set(c.keyId, c);
    }
    return out;
  }
  function isNull(c) {
    if (c.kind === KIND_MOUSE2) {
      const m = c.mouse;
      return !m.mod && !m.buttons && !m.wheel;
    }
    return !c.codes.length || c.codes.every((x) => x === 0);
  }
  function canonLeds(led) {
    if (!led) return null;
    const colors = [];
    for (let i = 0; i < LED_SLOTS2; i++) colors.push(hex2(led.colors && led.colors[i]));
    return { mode: led.mode | 0, colors };
  }
  function hex2(c) {
    if (typeof c === "string") {
      const m = /^#?([0-9a-fA-F]{6})$/.exec(c);
      return m ? "#" + m[1].toLowerCase() : "#000000";
    }
    if (Array.isArray(c)) {
      return "#" + c.slice(0, 3).map((v) => (v | 0).toString(16).padStart(2, "0")).join("");
    }
    return "#000000";
  }
  function canonConfig(cfg) {
    const layers = {}, leds = {};
    for (const L of LAYERS) {
      layers[L] = canonLayer(cfg && cfg.layers && cfg.layers[L]);
      const src = cfg && cfg.leds;
      const raw = Array.isArray(src) ? src[L - 1] : src && src[L];
      leds[L] = canonLeds(raw);
    }
    return { layers, leds };
  }
  function diff(draft, device) {
    const a = canonConfig(draft);
    const b = device ? canonConfig(device) : null;
    const bindings = [], leds = [];
    for (const L of LAYERS) {
      const want = a.layers[L];
      const have = b ? b.layers[L] : /* @__PURE__ */ new Map();
      const keys = /* @__PURE__ */ new Set([...want.keys(), ...have.keys()]);
      for (const k of [...keys].sort((x, y) => x - y)) {
        const w = want.get(k), h = have.get(k);
        if (same(w, h)) continue;
        bindings.push({ layer: L, keyId: k, binding: w || nullBinding(k, h) });
      }
      if (b ? !sameLeds(a.leds[L], b.leds[L]) : !!a.leds[L]) leds.push(L);
    }
    return { bindings, leds, count: bindings.length + leds.length };
  }
  function nullBinding(keyId, old) {
    const kind = old ? old.kind : 0;
    if (kind === KIND_MOUSE2) {
      return { keyId, kind, codes: [], delays: [], mouse: { mod: 0, buttons: 0, wheel: 0 } };
    }
    return { keyId, kind, codes: [], delays: [] };
  }
  function same(x, y) {
    if (!x && !y) return true;
    if (!x || !y) return false;
    return JSON.stringify(x) === JSON.stringify(y);
  }
  function sameLeds(x, y) {
    if (!x || !y) return true;
    if (x.mode !== y.mode) return false;
    for (let i = 0; i < 16; i++) if (x.colors[i] !== y.colors[i]) return false;
    return true;
  }
  function toPlain(cfg) {
    const c = canonConfig(cfg);
    const layers = {}, leds = {};
    for (const L of LAYERS) {
      layers[L] = [...c.layers[L].values()];
      leds[L] = c.leds[L];
    }
    return { layers, leds };
  }
  function fromPlain(obj) {
    if (!obj || typeof obj !== "object") return null;
    const src = obj.config && typeof obj.config === "object" ? obj.config : obj;
    if (!src.layers || typeof src.layers !== "object") return null;
    try {
      return toPlain(src);
    } catch {
      return null;
    }
  }
  function saveDraft(cfg, store) {
    const s = store || globalStorage();
    if (!s) return false;
    try {
      s.setItem(STORE_KEY, JSON.stringify(toPlain(cfg)));
      return true;
    } catch {
      return false;
    }
  }
  function loadDraft(store) {
    const s = store || globalStorage();
    if (!s) return null;
    try {
      return fromPlain(JSON.parse(s.getItem(STORE_KEY) || "null"));
    } catch {
      return null;
    }
  }
  function clearDraft(store) {
    const s = store || globalStorage();
    if (!s) return;
    try {
      s.removeItem(STORE_KEY);
    } catch {
    }
  }
  function globalStorage() {
    try {
      return typeof localStorage !== "undefined" ? localStorage : null;
    } catch {
      return null;
    }
  }
  function toExport(cfg, source, meta = {}) {
    return {
      kind: EXPORT_KIND,
      version: EXPORT_VERSION,
      source,
      exported: meta.at || null,
      device: meta.device || null,
      config: toPlain(cfg)
    };
  }
  function fromExport(obj) {
    if (!obj || typeof obj !== "object") {
      return { ok: false, why: "\u30D5\u30A1\u30A4\u30EB\u306E\u4E2D\u8EAB\u304C\u8AAD\u3081\u307E\u305B\u3093\u3067\u3057\u305F" };
    }
    if (obj.kind && obj.kind !== EXPORT_KIND) {
      return { ok: false, why: "\u3053\u306E\u30A2\u30D7\u30EA\u306E\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u30D5\u30A1\u30A4\u30EB\u3067\u306F\u3042\u308A\u307E\u305B\u3093" };
    }
    if (obj.version && obj.version > EXPORT_VERSION) {
      return { ok: false, why: "\u65B0\u3057\u3044\u5F62\u5F0F\u306E\u30D5\u30A1\u30A4\u30EB\u3067\u3059\u3002\u30A2\u30D7\u30EA\u3092\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044" };
    }
    const cfg = fromPlain(obj);
    if (!cfg) return { ok: false, why: "\u8A2D\u5B9A\u30C7\u30FC\u30BF\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F" };
    return { ok: true, config: cfg };
  }
  function emptyConfig() {
    const layers = {}, leds = {};
    for (const L of LAYERS) {
      layers[L] = [];
      leds[L] = null;
    }
    return { layers, leds };
  }
  function cloneConfig(cfg) {
    return toPlain(cfg);
  }
  function layerRows(cfg, layer) {
    const rows = cfg && cfg.layers && cfg.layers[layer];
    return Array.isArray(rows) ? rows : [...canonLayer(rows).values()];
  }
  function withBinding(cfg, ...args) {
    const binding = args.length === 1 ? args[0] : args[args.length - 1];
    const next = toPlain(cfg);
    const L = binding.layer;
    const rows = (next.layers[L] || []).filter((r) => r.keyId !== binding.keyId);
    const c = canonBinding(binding);
    if (!isNull(c)) rows.push(c);
    next.layers[L] = rows.sort((a, b) => a.keyId - b.keyId);
    return next;
  }
  function withLeds(cfg, layer, mode, colors) {
    const next = toPlain(cfg);
    next.leds[layer] = canonLeds({ mode, colors });
    return next;
  }

  // pad-driver.js
  var pad_driver_exports = {};
  __export(pad_driver_exports, {
    COMMIT_GAP: () => COMMIT_GAP,
    PadHttp: () => PadHttp,
    PadMock: () => PadMock,
    PadWebHid: () => PadWebHid,
    SETTLE_AFTER_OPEN: () => SETTLE_AFTER_OPEN,
    SETTLE_AFTER_WRITE: () => SETTLE_AFTER_WRITE,
    WRITE_GAP: () => WRITE_GAP,
    autoDriver: () => autoDriver,
    sleep: () => sleep
  });
  var WRITE_GAP = 300;
  var COMMIT_GAP = 800;
  var SETTLE_AFTER_OPEN = 250;
  var SETTLE_AFTER_WRITE = 600;
  var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  var PadHttp = class {
    constructor(base = "") {
      this.base = base;
      this.isMock = false;
    }
    get name() {
      return "http";
    }
    isConnected() {
      return true;
    }
    // the server owns the handle
    async connect() {
      return { via: "http" };
    }
    async disconnect() {
    }
    async _api(path, body) {
      const r = await fetch(this.base + path, {
        method: body ? "POST" : "GET",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : null
      });
      const j = await r.json();
      if (!r.ok || j.error) throw new Error(j.error || "HTTP " + r.status);
      return j;
    }
    async readAll() {
      const st = await this._api("/api/state");
      return st;
    }
    async readLayer(layer) {
      const st = await this._api("/api/state");
      return (st.layers?.[layer] || []).filter((b) => isPhysical(b.key_id));
    }
    async writeBinding(b) {
      const { target, spec, delays } = toLegacy(b);
      await this._api("/api/set", { target, layer: b.layer, spec, delays });
    }
    async readLeds(layer) {
      return this._api("/api/state").then((s) => s.leds?.[layer - 1]);
    }
    async writeLeds(layer, mode, colors) {
      await this._api("/api/led", { layer: layer - 1, mode, colors });
    }
    async backup() {
      return this._api("/api/backup", {});
    }
  };
  function toLegacy(b) {
    const name = keyIdToName(b.keyId);
    if (b.kind === KIND_MOUSE) {
      const m = b.mouse || {};
      return { target: name, spec: mouseName(m), delays: [] };
    }
    return {
      target: name,
      spec: (b.codes || []).map((c) => "0x" + c.toString(16)).join("+"),
      delays: b.delays || []
    };
  }
  var PadWebHid = class _PadWebHid {
    constructor() {
      this.dev = null;
      this.isMock = false;
      this._q = [];
    }
    get name() {
      return "webhid";
    }
    /* Test the value, not just the key: a browser can expose the property and
       leave it undefined, and `'hid' in navigator` still says yes. */
    static supported() {
      return typeof navigator !== "undefined" && !!navigator.hid && typeof navigator.hid.requestDevice === "function";
    }
    isConnected() {
      return !!(this.dev && this.dev.opened);
    }
    /** Reuse a previously granted device if there is one, else ask. Asking
     *  requires a user gesture, so `prompt` is only true from a click. */
    async connect({ prompt = true } = {}) {
      const filter = {
        vendorId: 20812,
        productId: 34896,
        usagePage: 65280,
        usage: 1
      };
      let devs = (await navigator.hid.getDevices()).filter((d) => d.vendorId === filter.vendorId && d.productId === filter.productId && d.collections.some((c) => c.usagePage === 65280));
      if (!devs.length) {
        if (!prompt) throw new Error("not granted yet");
        devs = await navigator.hid.requestDevice({ filters: [filter] });
      }
      if (!devs.length) throw new Error("no device selected");
      this.dev = devs[0];
      if (!this.dev.opened) await this.dev.open();
      this.dev.addEventListener("inputreport", (e) => this._onReport(e));
      await sleep(SETTLE_AFTER_OPEN);
      return { via: "webhid", name: this.dev.productName };
    }
    /** Let go of the device. The permission survives, so connecting again is
     *  silent. */
    async disconnect() {
      if (this.dev?.opened) await this.dev.close();
      this.dev = null;
      this._q.length = 0;
    }
    /** Revoke the permission too, so the next connect has to ask again. */
    async forget() {
      const d = this.dev;
      await this.disconnect();
      if (d && d.forget) await d.forget();
    }
    /** Devices this origin may already open without prompting. */
    static async granted() {
      if (!_PadWebHid.supported()) return [];
      return (await navigator.hid.getDevices()).filter((d) => d.vendorId === 20812 && d.productId === 34896);
    }
    /** Drop every grant for this pad, including ones this page is not holding. */
    static async forgetAll() {
      for (const d of await _PadWebHid.granted()) {
        if (d.forget) await d.forget();
      }
    }
    /* Reports arrive as events, so a request and its reply are linked only by
     * order, and binding and LED replies both open with 0xFA -- an LED reply's
     * mode byte sits where a key id would. So a waiter declares what it expects
     * and anything failing that test is discarded. */
    _onReport(e) {
      const bytes = new Uint8Array(e.data.buffer);
      while (this._q.length) {
        const w = this._q[0];
        if (w.accept(bytes)) {
          w.got.push(bytes);
          return;
        }
        return;
      }
    }
    async _send(data) {
      if (!this.dev) throw new Error("\u30C7\u30D0\u30A4\u30B9\u304C\u63A5\u7D9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
      await this.dev.sendReport(REPORT_ID, data);
    }
    /** Collect reports matching `accept` until `want` of them or the timeout. */
    _collect(accept, want, ms) {
      return new Promise((resolve) => {
        const w = { accept, got: [] };
        this._q.push(w);
        const done = () => {
          const i = this._q.indexOf(w);
          if (i >= 0) this._q.splice(i, 1);
          resolve(w.got);
        };
        const t2 = setInterval(() => {
          if (w.got.length >= want) {
            clearInterval(t2);
            done();
          }
        }, 10);
        setTimeout(() => {
          clearInterval(t2);
          done();
        }, ms);
      });
    }
    async readLayer(layer) {
      const p = this._collect((b) => looksLikeBinding(b), MAX_KEY_ID, 1200);
      await this._send(encodeReadLayer(layer));
      const reports = await p;
      const byKey = /* @__PURE__ */ new Map();
      for (const r of reports) {
        const b = decodeBinding(r);
        if (b && b.layer === layer && isPhysical(b.keyId)) byKey.set(b.keyId, b);
      }
      return [...byKey.values()].sort((a, b) => a.keyId - b.keyId);
    }
    async readAll() {
      const layers = {};
      for (const l of [1, 2, 3]) layers[l] = await this.readLayer(l);
      const leds = [];
      for (const l of [1, 2, 3]) leds.push(await this.readLeds(l));
      return { layers, leds };
    }
    async writeBinding(b) {
      await this._send(encodeBinding(b));
      await sleep(WRITE_GAP);
      await this._send(encodeCommit());
      await sleep(COMMIT_GAP);
    }
    async readLeds(layer) {
      this._q.length = 0;
      const accept = (b) => b[0] === OP_READ && !looksLikeBinding(b) && b[1] <= 5;
      const p = this._collect(accept, 1, 900);
      await this._send(encodeReadLeds(layer));
      const [r] = await p;
      return r ? decodeLeds(r) : null;
    }
    async writeLeds(layer, mode, colors) {
      await this._send(encodeLedInit());
      await sleep(WRITE_GAP);
      await this._send(encodeLeds(layer, mode, colors));
      await sleep(WRITE_GAP);
      await this._send(encodeCommit());
      await sleep(COMMIT_GAP);
    }
  };
  var PadMock = class {
    constructor({ layers = {}, leds = [] } = {}) {
      this.isMock = true;
      this.writeLog = [];
      this.layers = { 1: [], 2: [], 3: [], ...layers };
      this.leds = leds.length ? leds : [0, 1, 2].map(() => ({ mode: 0, colors: blank() }));
    }
    get name() {
      return "mock";
    }
    isConnected() {
      return true;
    }
    async connect() {
      return { via: "mock" };
    }
    async disconnect() {
    }
    async readAll() {
      return { layers: this.layers, leds: this.leds };
    }
    async readLayer(layer) {
      return this.layers[layer] || [];
    }
    async readLeds(layer) {
      return this.leds[layer - 1];
    }
    async writeBinding(b) {
      this.writeLog.push({ op: "binding", ...b });
      encodeBinding(b);
      const rows = (this.layers[b.layer] ||= []).filter((x) => x.keyId !== b.keyId);
      rows.push({ ...b });
      this.layers[b.layer] = rows.sort((x, y) => x.keyId - y.keyId);
    }
    async writeLeds(layer, mode, colors) {
      this.writeLog.push({ op: "leds", layer, mode, colors });
      this.leds[layer - 1] = { mode, colors };
    }
    async backup() {
      return { path: "(mock)" };
    }
  };
  var blank = () => Array.from({ length: 16 }, () => [0, 0, 0]);
  function mouseName(m) {
    if (m.buttons && MOUSE_BUTTONS[m.buttons]) return MOUSE_BUTTONS[m.buttons];
    if (m.wheel > 0) return "WheelUp";
    if (m.wheel < 0) return "WheelDown";
    return "MouseLeft";
  }
  async function autoDriver() {
    if (PadWebHid.supported()) {
      const d = new PadWebHid();
      try {
        await d.connect({ prompt: false });
        return d;
      } catch {
      }
    }
    return null;
  }

  // entry.js
  window.CAT = catalog_exports;
  window.WIRE = pad_wire_exports;
  window.MODEL = pad_model_exports;
  window.PadHttp = PadHttp;
  window.PadWebHid = PadWebHid;
  window.PadMock = PadMock;
  window.PadDriver = pad_driver_exports;
})();
