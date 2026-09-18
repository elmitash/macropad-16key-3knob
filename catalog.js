/* catalog.js -- what this device can be told to do.
 *
 * Tables (HID Keyboard/Consumer pages, JIS 106/109 layout) plus pure
 * functions. No I/O, no DOM. macropad.py keeps a matching copy of these
 * tables; tools/check_catalog.py proves the two agree.
 */

// ----------------------------------------------------------- language

/* Display language. `en` is the base and must be complete; other languages
 * may be partial and fall back to it. Search aliases are deliberately not
 * per-language -- any query should match whatever the display language. */
export const LANGS = ['ko', 'en', 'ja'];

export function detectLang() {
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem('minikeyboard_lang');
      if (saved && LANGS.includes(saved)) return saved;
    } catch (e) {}
  }
  const navLangs = (typeof navigator !== 'undefined' && Array.isArray(navigator.languages) && navigator.languages.length)
    ? navigator.languages
    : (typeof navigator !== 'undefined' && navigator.language ? [navigator.language] : []);

  for (const l of navLangs) {
    const code = String(l || '').toLowerCase().trim();
    if (code.startsWith('ko')) return 'ko';
    if (code.startsWith('ja')) return 'ja';
    if (code.startsWith('en')) return 'en';
  }
  return 'en';
}

export let LANG = detectLang();

export function setLang(l) {
  if (l === 'auto') {
    if (typeof localStorage !== 'undefined') {
      try { localStorage.removeItem('minikeyboard_lang'); } catch (e) {}
    }
    LANG = detectLang();
  } else if (LANGS.includes(l)) {
    LANG = l;
    if (typeof localStorage !== 'undefined') {
      try { localStorage.setItem('minikeyboard_lang', l); } catch (e) {}
    }
  }
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = LANG;
  }
  return LANG;
}

/* One entry per string: { en, ja, ko }. Keys are dotted and grouped by where the
 * string appears. */
export const STRINGS = {
  // -- header / connection
  'btn.connect':        { en: 'Connect device',        ja: 'デバイスに直結',       ko: '키패드 연결 (WebHID)' },
  'btn.disconnect':     { en: 'Disconnect',            ja: '切断',                 ko: '연결 해제' },
  'btn.export':         { en: 'Export ▾',              ja: 'エクスポート ▾',        ko: '내보내기 ▾' },
  'btn.exportApp':      { en: 'Save app settings',     ja: 'アプリの設定を保存',    ko: '앱 설정 저장' },
  'btn.exportDevice':   { en: 'Save device settings',  ja: '本体の設定を保存',      ko: '기기 롬 설정 저장' },
  'btn.import':         { en: 'Load a file',           ja: 'ファイルを読み込む',    ko: '파일 불러오기' },
  'btn.preset':         { en: 'Presets ▾',             ja: 'プリセット ▾',          ko: '프리셋 ▾' },
  'btn.presetPlanA':    { en: '48-Key No-Conflict Preset (Rec.)', ja: '48キー無反応キー割当（推奨）', ko: '3개 레이어 48키 전체 무반응 키 매핑' },
  'btn.clearAll':       { en: 'Clear all keys (None)', ja: '全キー解除 (None)',     ko: '현재 레이어 모두 비우기 (None)' },
  'btn.reload':         { en: 'Reload',                ja: '再読み込み',           ko: '다시 읽기' },
  'btn.revert':         { en: 'Revert to device',      ja: '本体の値に戻す',       ko: '기기 값으로 되돌리기' },
  'btn.write':          { en: 'Write to device',       ja: '本体に書き込む',       ko: '기기 롬에 쓰기 (Write)' },
  'btn.writeN':         { en: 'Write to device ({n})', ja: '本体に書き込む（{n}）', ko: '기기 롬에 쓰기 ({n})' },
  'btn.written':        { en: 'Written',               ja: '書き込み済み',          ko: '쓰기 완료됨' },
  'tip.reload':         { en: 'Re-read the device and compare again',
                          ja: '本体を読み直して比較しなおします',
                          ko: '기기 설정을 다시 읽어옵니다' },
  'conn.webhid':        { en: 'WebHID (direct)',       ja: 'WebHID（直結）',        ko: 'WebHID 연결됨' },
  'conn.mock':          { en: 'Mock',                  ja: 'モック',                ko: '모의 기기 (Mock)' },
  'conn.none':          { en: 'Not connected',         ja: '未接続',                ko: '연결 안 됨' },
  'conn.loading':       { en: 'Reading device…',       ja: '本体を読み込み中…',     ko: '기기 롬 읽는 중…' },
  'conn.offlineN':      { en: 'Offline · {n} changed', ja: '未接続・変更 {n} 件',   ko: '오프라인 · {n}개 변경됨' },
  'conn.unwritten':     { en: 'You have unwritten changes',
                          ja: '未書き込みの変更があります',
                          ko: '아직 롬에 기록되지 않은 변경사항이 있습니다' },

  // -- messages
  'msg.connected':      { en: 'Connected directly (WebHID)',
                          ja: 'デバイスに直接つながりました（WebHID）' },
  'msg.connectFail':    { en: 'Could not connect: {e}',
                          ja: '接続できませんでした: {e}' },
  'msg.noDevice':       { en: 'No device is connected',
                          ja: 'デバイスが接続されていません' },
  'msg.noDeviceHint':   { en: 'No device is connected. Press "Connect device"',
                          ja: 'デバイスが接続されていません。「デバイスに直結」を押してください' },
  'msg.cannotConnect':  { en: 'Cannot reach the device: {e}',
                          ja: 'デバイスに接続できません: {e}' },
  'msg.loaded':         { en: 'Loaded the device settings',
                          ja: '本体の設定を読み込みました' },
  'msg.inSync':         { en: 'Matches the device settings',
                          ja: '本体の設定と一致しています' },
  'msg.notDirect':      { en: 'Not connected directly', ja: '直結していません' },
  'msg.disconnected':   { en: 'Disconnected. Permission was revoked too, so you will pick the device again next time',
                          ja: '切断しました。許可も取り消したので、次は選び直しになります' },
  'msg.disconnectFail': { en: 'Could not disconnect: {e}',
                          ja: '切断できませんでした: {e}' },
  'msg.restored':       { en: 'Restored your last settings. Use "Connect device" to write them to the device',
                          ja: '前回の設定を復元しました。「デバイスに直結」で本体に書き込めます' },
  'msg.pickDevice':     { en: 'Press "Connect device" and choose your macropad',
                          ja: '「デバイスに直結」を押してマクロパッドを選んでください' },
  'msg.noWebhid':       { en: 'This browser cannot reach the device: it has no WebHID. Open this page in Chrome or Edge.',
                          ja: 'このブラウザは WebHID に対応していないためデバイスに接続できません。Chrome か Edge で開いてください',
                          ko: '이 브라우저는 WebHID를 지원하지 않습니다. Chrome, Edge, Brave 등의 브라우저에서 열어주세요.' },
  'msg.insecure':       { en: 'WebHID needs a secure connection. Open this page over https, or from 127.0.0.1.',
                          ja: 'WebHID は保護された接続でしか動きません。https か 127.0.0.1 で開いてください',
                          ko: 'WebHID 기기 통신은 보안 연결이 필요합니다. 터미널에서 ./keypad_cli.py gui 를 실행하여 http://127.0.0.1:8850 으로 열어주세요.' },
  'msg.sameAsDevice':   { en: 'Same as the device. Nothing to write',
                          ja: '本体と同じ内容です。書き込む必要はありません' },
  'msg.notRead':        { en: 'The device settings have not been read',
                          ja: '本体の設定を読み込んでいません' },
  'msg.reverted':       { en: 'Reverted to the device values',
                          ja: '本体の値に戻しました' },
  'msg.keptDraft':      { en: 'Keeping your edits. Use "Write to device" to apply them',
                          ja: '編集中の設定を保持しています。「本体に書き込む」で反映できます' },
  'msg.nothingToSave':  { en: 'There are no settings to save',
                          ja: '保存する設定がありません' },
  'msg.exportedApp':    { en: 'Exported the app settings',
                          ja: 'アプリの設定をエクスポートしました' },
  'msg.readingDevice':  { en: 'Reading the device…',   ja: '本体を読み込んでいます…' },
  'msg.exportedDevice': { en: 'Exported the device settings',
                          ja: '本体の設定をエクスポートしました' },
  'msg.readFail':       { en: 'Could not read the device: {e}',
                          ja: '本体を読み込めませんでした: {e}' },
  'msg.importedWrite':  { en: 'Loaded. Use "Write to device" to apply it',
                          ja: '読み込みました。「本体に書き込む」で反映できます' },
  'msg.imported':       { en: 'Loaded',                ja: '読み込みました' },
  'msg.importFail':     { en: 'Could not read the file: {e}',
                          ja: 'ファイルを読み込めませんでした: {e}' },
  'msg.startFail':      { en: 'Failed to start: {e}',  ja: '起動に失敗しました: {e}' },
  'msg.savedKey':       { en: '{k} set (not written yet)',
                          ja: '{k} を設定しました（未書き込み）',
                          ko: '{k} 설정됨 (아직 기기에 미저장)' },
  'msg.copiedTo':       { en: 'Copied to {k} (layer {L}) — not written yet',
                          ja: '{k}（レイヤ {L}）へコピーしました（未書き込み）',
                          ko: '{k}(레이어 {L})로 복사됨 (아직 기기에 미저장)' },
  'msg.planAApplied':   { en: 'Preset applied (48 keys + 9 knob actions across 3 layers)! Click [Write to device] to save.',
                          ja: 'プリセット適用完了（全3レイヤー48キー＋9ノブ動作を無反応キーに設定）！「本体に書き込む」で保存してください。',
                          ko: '3개 레이어 48키 + 9개 노브 동작 전체 무반응 키 매핑 적용 완료! [기기 롬에 쓰기]를 누르면 저장됩니다.' },
  'msg.confirmClear':   { en: 'Clear all keys and knobs on the current layer?\\n(Unassigned keys do nothing when pressed)',
                          ja: '現在のレイヤのすべてのキーとノブ設定を解除しますか？\\n（未割り当てのキーは押しても何も動作しません）',
                          ko: '현재 레이어의 모든 키와 노브 설정을 비우시겠습니까?\\n(할당되지 않은 키는 눌러도 아무 동작도 하지 않습니다)' },
  'msg.layerCleared':   { en: 'Current layer cleared. Click [Write to device] to apply to keypad.',
                          ja: '現在のレイヤをすべて解除しました。「本体に書き込む」で反映してください。',
                          ko: '현재 레이어가 모두 비워졌습니다. [기기 롬에 쓰기]를 누르면 기기에 적용됩니다.' },

  // -- pad
  'pad.hint':           { en: 'Click a key or knob to edit its input sequence.',
                          ja: 'キー・ノブをクリックすると入力シーケンスを編集できます。',
                          ko: '키나 노브를 클릭하여 입력 시퀀스를 편집할 수 있습니다.' },
  'pad.hintPaint':      { en: 'Click a key to make it the target for colours. (Close LED to go back to editing input sequences.)',
                          ja: 'キーをクリックすると、そのキーが色の適用先になります。（LEDを閉じるとクリックで入力シーケンスの編集に戻ります）',
                          ko: '키를 클릭하면 해당 키가 색상 적용 대상이 됩니다. (키 입력 편집으로 돌아가려면 하단 LED 창을 닫으세요)' },
  'pad.hintHover':      { en: 'Hover a key to see how it lights when pressed. (Click to edit its input sequence.)',
                          ja: 'キーにマウスを乗せると、押したときの光り方が見えます。（クリックすると入力シーケンスを編集できます）',
                          ko: '키에 마우스를 올리면 눌렸을 때의 LED 발광 효과를 미리 볼 수 있습니다. (클릭하면 키 입력 편집)' },
  'pad.layer':          { en: 'Layer {n}',             ja: 'レイヤ {n}',            ko: '레이어 {n}' },
  'pad.knob':           { en: 'Knob {n}',              ja: 'ノブ {n}',              ko: '노브 {n}' },

  // -- LED area
  'led.mode':           { en: 'Mode',                  ja: 'モード',               ko: 'LED 모드' },
  'led.customColor':    { en: 'Custom colour',         ja: '任意色',               ko: '임의 색상' },
  'led.applyAll':       { en: 'Apply to all keys',     ja: '全キーに適用',         ko: '전체 키에 적용' },
  'led.applyKey':       { en: 'Apply to Key {n}',      ja: 'Key {n} に適用',       ko: 'Key {n}에 적용' },
  'led.randomColors':   { en: '🎲 Random Colors',      ja: '🎲 全ランダム色',       ko: '🎲 전체 랜덤 색상' },
  'led.writeHint':      { en: 'Click "Write to device" to save. (Reconnecting USB is required to apply changes to physical LEDs)',
                          ja: '「本体に書き込む」で保存されます。（※物理LEDへの反映にはUSBの抜き差し・再接続が必要です）',
                          ko: '상단의 [기기 롬에 쓰기]를 눌러 저장하세요. (※ 실제 키패드 LED 적용을 위해 USB 케이블을 뺐다가 다시 연결해 주세요)' },
  'led.targetOne':      { en: '<span style="color:var(--accent);font-weight:700">🎯 Key {n}{q} Selected</span>: Choosing a colour or clicking [Apply to Key {n}] sets <b>Key {n}</b> only. (Click the key again to return to all keys)',
                          ja: '<span style="color:var(--accent);font-weight:700">🎯 Key {n}{q} 選択中</span>: 色見本・任意色を選ぶか［Key {n} に適用］を押すと <b>Key {n}</b> のみに適用されます。（もう一度キーをクリックすると全キー対象に戻ります）',
                          ko: '<span style="color:var(--accent);font-weight:700">🎯 Key {n}{q} 선택됨</span>: 색상표나 임의색을 고르거나 [Key {n}에 적용]을 누르면 <b>Key {n}</b>에만 색상이 적용됩니다. (전체 적용으로 돌아가려면 해당 키를 다시 클릭)' },
  'led.targetAll':      { en: '<span>🎨 <b>Target: All 16 Keys</b></span>: Picking a colour or clicking [Apply to all keys] sets all 16 keys. (Click a key on the pad to colour only that key)',
                          ja: '<span>🎨 <b>全16キー対象</b></span>: 色見本を選ぶか［全キーに適用］を押すと16キー全体に適用されます。（特定キーのみ塗る場合はキーパッドのキーをクリックしてください）',
                          ko: '<span>🎨 <b>전체 16개 키 대상</b></span>: 색상을 고르거나 [전체 키에 적용]을 누르면 16개 키 전체에 적용됩니다. (특정 키만 칠하려면 키패드의 키를 클릭하세요)' },
  'led.msgAppliedKey':  { en: 'Applied {c} to Key {n}. Click [Write to device] to save.',
                          ja: 'Key {n} に {c} を適用しました。「本体に書き込む」で保存してください。',
                          ko: 'Key {n}에 {c} 색상이 적용되었습니다. [기기 롬에 쓰기]를 눌러 저장하세요.' },
  'led.msgAppliedAll':  { en: 'Applied {c} to all 16 keys. Click [Write to device] to save.',
                          ja: '全16キーに {c} を適用しました。「本体に書き込む」で保存してください。',
                          ko: '전체 16개 키에 {c} 색상이 적용되었습니다. [기기 롬에 쓰기]를 눌러 키패드에 저장하세요.' },
  'led.msgRandom':      { en: '🎲 Applied 16 distinct unique colours to all 16 keys!',
                          ja: '🎲 重複のない16色の固有カラーを全16キーにランダム配置しました！',
                          ko: '🎲 16개 키에 겹치지 않는 16가지 고유 색상이 랜덤하게 배치되었습니다!' },

  // -- editor sheet
  'ed.intro':           { en: 'Just type and the chips line up. Click a chip to change its modifiers or its delay. The Windows key is under "Modifiers" below; F13-F24 are under "Choose a key".',
                          ja: 'そのまま文字を打てばチップが並びます。チップをクリックすると修飾キーや待ち時間を変えられます。Windowsキーは下の「修飾」、F13〜F24 は「キーを選ぶ」から。' },
  'ed.copyTo':          { en: 'Copy to other keys…',   ja: '他のキーへコピー…' },
  'ed.cancel':          { en: 'Cancel',                ja: 'キャンセル' },
  'ed.clearAll':        { en: 'Clear all',             ja: '全部消す' },
  'ed.confirm':         { en: 'OK',                    ja: '確定' },
  'ed.placeholder':     { en: 'Type, or pick from "Choose a key" below',
                          ja: '文字を打つか、下の「キーを選ぶ」から選んでください' },
  'ed.meter':           { en: '{c} chips / {u} steps (max {m})',
                          ja: '{c} チップ / {u} ステップ（上限 {m}）' },
  'ed.meterNote':       { en: 'Each modifier costs one step',
                          ja: '修飾キーは 1 つにつき 1 ステップ使います' },
  'ed.nothingChosen':   { en: 'Nothing chosen yet',    ja: 'まだ何も選ばれていません' },
  'ed.overBudget':      { en: 'Needs {c} steps, but the limit is {m}',
                          ja: '{c} ステップ必要ですが、上限は {m} です' },

  // -- chips
  'chip.mouse':         { en: 'Mouse',                 ja: 'マウス' },
  'chip.media':         { en: 'Media',                 ja: 'メディア' },
  'chip.key':           { en: 'Key',                   ja: 'キー' },
  'chip.solo':          { en: 'Solo',                  ja: '単独' },
  'chip.kindSteps':     { en: '{kind} · {n} steps',    ja: '{kind}・{n} ステップ' },
  'chip.mods':          { en: 'Modifiers',             ja: '修飾' },
  'chip.delay':         { en: 'Delay',                 ja: '待ち時間' },
  'chip.msRange':       { en: 'ms (0-6000)',           ja: 'ms（0〜6000）' },
  'chip.reselect':      { en: 'Choose again from the list', ja: '一覧から選び直す' },
  'chip.delete':        { en: 'Delete',                ja: '削除' },
  'chip.close':         { en: 'Close',                 ja: '閉じる' },
  'chip.rightMods':     { en: 'Right',                 ja: '右' },
  'chip.soloNote':      { en: 'Mouse and media actions take no modifiers and no delay.',
                          ja: 'マウス／メディアは修飾キーと待ち時間を持ちません。' },

  // -- toasts
  'toast.noCombine':    { en: 'Mouse and media actions cannot be combined with other keys',
                          ja: 'マウス／メディアは他のキーと組み合わせできません' },
  'toast.noModsSpecial':{ en: 'Mouse and media actions take no modifiers',
                          ja: 'マウス／メディアに修飾キーは付けられません' },
  'toast.maxChips':     { en: 'A key holds at most {n} chips',
                          ja: '1 つのキーに入れられるのは {n} 個までです' },
  'toast.chipsCut':     { en: 'At most {n} chips. The rest were dropped',
                          ja: 'チップは {n} 個までです。以降は切り捨てました' },
  'toast.badChars':     { en: 'These characters cannot be typed: {c}',
                          ja: '使えない文字があります: {c}' },
  'toast.badChar':      { en: 'This layout cannot type: {c}',
                          ja: 'このレイアウトでは入力できない文字です: {c}' },
  'toast.mouseModOne':  { en: 'A mouse action takes exactly one of Ctrl, Shift or Alt ({d} will not apply)',
                          ja: 'マウスに付けられるのは Ctrl・Shift・Alt のいずれか1つだけです（{d} は付きません）' },
  'toast.mouseNoMods':  { en: 'Mouse actions take no modifiers. Clear the armed modifiers first',
                          ja: 'マウスに修飾キーは付けられません。修飾を解除してください' },
  'toast.mediaNoMods':  { en: 'Media actions take no modifiers. Clear the armed modifiers first',
                          ja: 'メディアに修飾キーは付けられません。修飾を解除してください' },

  // -- picker
  'pk.title':           { en: 'Choose a key',          ja: 'キーを選ぶ' },
  'pk.stop':            { en: 'Stop',                  ja: 'やめる' },
  'pk.search':          { en: 'Type to search  e.g. mouse / win / f13 / ↑',
                          ja: '打って探す  例: mouse / win / f13 / ↑ / まうす' },
  'pk.noMatch':         { en: 'No match. You can also pick from the list below.',
                          ja: '該当なし。下の一覧からも選べます。' },
  'pk.reselecting':     { en: 'Choosing key {n} again', ja: '{n}番目のキーを選び直しています' },
  'pk.reselectNote':    { en: 'The chosen key replaces it (modifiers and delay are kept)',
                          ja: '選んだキーで置き換えます（修飾キーと待ち時間は残ります）' },
  'pk.keyboard':        { en: 'Keyboard',              ja: 'キーボード' },
  'pk.mouse':           { en: 'Mouse',                 ja: 'マウス' },
  'pk.media':           { en: 'Media',                 ja: 'メディア' },
  'pk.blockedSpecial':  { en: 'Not available while a mouse or media action is in the sequence. Delete that chip first.',
                          ja: 'いまはマウス／メディアが入っているため選べません。先にそのチップを消してください。' },
  'pk.charsNote':       { en: 'These are the characters this layout <b>actually types</b> (not the HID names).',
                          ja: 'この機種のキーボード配列で<b>実際に出る文字</b>を並べています（HID の名前ではありません）。' },
  'pk.shiftCost':       { en: ' <b>While Shift is armed every one costs 2 steps.</b>',
                          ja: ' <b>Shift 中はどれも2ステップ使います。</b>' },
  'pk.letters':         { en: 'Letters',               ja: '英字' },
  'pk.digits':          { en: 'Digits',                ja: '数字' },
  'pk.digitsShift':     { en: 'Symbols (number row)',  ja: '記号（数字キー）' },
  'pk.symbols':         { en: 'Symbols',               ja: '記号' },
  'pk.symbolsShift':    { en: 'Symbols (other)',       ja: '記号（その他）' },
  'pk.navEdit':         { en: 'Arrows & editing',      ja: '矢印・編集' },
  'pk.fkeys':           { en: 'F13-F24 (not on a normal keyboard)',
                          ja: 'F13〜F24（普通のキーボードに無い）' },
  'pk.jisKeys':         { en: 'Japanese keys (the vendor tool cannot set these)',
                          ja: '日本語キー（メーカー製ツールでは設定不可）' },
  'pk.soloNote':        { en: 'Can only be set on its own (cannot be combined). Choosing one replaces the current sequence.',
                          ja: '単独でのみ設定できます（他と組み合わせ不可）。選ぶと今の並びを置き換えます。' },
  'pk.mouseArmed':      { en: 'Will be set with <b>{m}</b>.',
                          ja: '<b>{m}</b> を付けて設定します。' },
  'pk.mouseArmedDrop':  { en: ' (Only Ctrl, Shift and Alt can ride on a mouse action.)',
                          ja: '（マウスに付けられるのは Ctrl・Shift・Alt だけです）' },
  'pk.mouseHint':       { en: 'Arm Ctrl, Shift or Alt above and it rides along (e.g. Ctrl+Wheel up). The wheel and modifier+wheel cannot be set by the vendor tool at all.',
                          ja: '上の修飾で Ctrl・Shift・Alt を押しておくと、それを付けて設定できます（例: Ctrl＋ホイール↑）。ホイールと 修飾＋ホイール はメーカー製ツールでは設定できません。' },
  'pk.modsLabel':       { en: 'Modifiers',             ja: '修飾' },
  'pk.modsArmed':       { en: 'The next key you choose gets <b>{m}</b>. Press it again with nothing chosen to clear.',
                          ja: '次に選ぶキーに <b>{m}</b> が付きます。何も選ばずもう一度押すと解除。' },
  'pk.modsIdle':        { en: 'Press one first and it attaches to the next key you choose. They can also be inserted on their own.',
                          ja: '先に押しておくと、次に選ぶキーに付きます。単独で入れることもできます。' },
  'pk.badgeMod':        { en: 'mod',                   ja: '修飾' },
  'pk.badgeSolo':       { en: 'solo',                  ja: '単独' },

  // -- conflict dialog
  'cf.title':           { en: 'The device differs from what is on screen',
                          ja: '本体の設定が画面と違います' },
  'cf.sub':             { en: 'Choose which one to keep. The other is lost.',
                          ja: 'どちらを使うか選んでください。選ばなかった側は失われます。' },
  'cf.takeDevice':      { en: 'Load the device values', ja: '本体の値を読み込む' },
  'cf.keepDraft':       { en: 'Keep my edits',          ja: '編集中の設定を使う' },
  'cf.count':           { en: '{n} differences',        ja: '食い違い {n} 件' },

  // -- write dialog
  'wr.title':           { en: 'Write to the device',    ja: '本体に書き込みます' },
  'wr.sub':             { en: 'Writing {n} changes to the device.',
                          ja: '変更 {n} 件を本体に書き込みます。' },
  'wr.note':            { en: 'Takes about {s} seconds. Do not unplug the device.',
                          ja: '所要 およそ {s} 秒。途中で本体を外さないでください。' },
  'wr.cancel':          { en: 'Cancel',                 ja: 'キャンセル' },
  'wr.go':              { en: 'Write',                  ja: '書き込む' },
  'wr.progress':        { en: 'Writing… {i} / {n}',     ja: '書き込み中… {i} / {n}' },
  'wr.verifying':       { en: 'Checking the device…',   ja: '本体を確認しています…' },
  'wr.partial':         { en: 'Wrote {n}, but {p} did not take effect',
                          ja: '{n} 件書き込みましたが、{p} 件が反映されていません' },
  'wr.done':            { en: 'Wrote {n} changes to the device. (Please unplug and replug USB to reflect new LED modes)',
                          ja: '{n} 件を本体に書き込みました。（※LEDの変更を反映するにはUSBを抜き差ししてください）',
                          ko: '{n}건의 변경사항을 기기 롬에 기록했습니다. (※ LED 변경 사항을 반영하려면 키패드 USB를 뺐다가 다시 연결해 주세요)' },
  'wr.failed':          { en: 'Failed after writing {n}: {e}',
                          ja: '{n} 件書き込んだところで失敗しました: {e}' },
  'wr.none':            { en: 'none',                   ja: 'なし' },
  'wr.diffRow':         { en: 'Layer {L} · <b>{k}</b> → {v}',
                          ja: 'レイヤ {L} · <b>{k}</b> → {v}' },
  'wr.ledModeOnly':     { en: 'Layer {L} · <b>LED</b> (mode only)',
                          ja: 'レイヤ {L} · <b>LED</b>（モードのみ）' },
  'wr.ledModeOnlyNote': { en: 'This mode does not use the colours, so they are left as they are.',
                          ja: 'このモードでは色は使われないため、色は今のままです。' },
  'wr.ledBoth':         { en: 'Layer {L} · <b>LED</b> (colours and mode)',
                          ja: 'レイヤ {L} · <b>LED</b>（色とモード）' },

  // -- copy-to dialog
  'cp.title':           { en: 'Copy to other keys',     ja: '他のキーへコピー' },
  'cp.from':            { en: 'Copies {k} (layer {L}) as-is onto the keys you choose. Writing to the device happens later, all at once.',
                          ja: '{k}（レイヤ {L}）の内容を、選んだキーにそのままコピーします。本体への書き込みは後でまとめて行います。' },
  'cp.waits':           { en: ' ({n} with a delay)',    ja: '（待ち時間つき {n} 個）' },
  'cp.layer':           { en: 'Layer',                  ja: 'レイヤ' },
  'cp.target':          { en: 'Destination',            ja: 'コピー先' },
  'cp.targetIs':        { en: 'Destination: {k} (layer {L})',
                          ja: 'コピー先: {k}（レイヤ {L}）' },
  'cp.pickTarget':      { en: 'Choose a destination key.',
                          ja: 'コピー先のキーを選んでください。' },
  'cp.cancel':          { en: 'Cancel',                 ja: 'キャンセル' },
  'cp.go':              { en: 'Copy here',              ja: 'ここへコピー' },
};

/** A user-visible string, with {placeholders} filled from `vars`.
 *  Falls back to English, then to the key itself. */
export function t(key, vars = null, lang = LANG) {
  const row = STRINGS[key];
  let s = row ? (row[lang] !== undefined ? row[lang] : row.en) : key;
  if (vars) for (const [k, v] of Object.entries(vars))
    s = s.split('{' + k + '}').join(v);
  return s;
}

// ---------------------------------------------------------------- kinds

export const KIND_KEYBOARD = 1;
export const KIND_MEDIA = 2;
export const KIND_MOUSE = 3;
export const KIND_NAMES = { 1: 'key', 2: 'media', 3: 'mouse' };

export const MAX_CODES = 18;   // slots per binding; modifiers cost one each

// ------------------------------------------------------------ modifiers

/* The eight modifier pseudo-usages. They occupy a slot in the code list just
 * like an ordinary key -- they are not a separate bitfield. */
export const MODS = {
  0xF1: 'Ctrl', 0xF2: 'Shift', 0xF3: 'Alt', 0xF4: 'Win',
  0xF5: 'RCtrl', 0xF6: 'RShift', 0xF7: 'RAlt', 0xF8: 'RWin',
};

/* Display order, which is also the order they are written to the wire. */
export const MODORDER = [0xF1, 0xF2, 0xF3, 0xF4, 0xF5, 0xF6, 0xF7, 0xF8];

/* The four most keyboards distinguish, and the four they don't. */
export const MODS_LEFT = [0xF1, 0xF2, 0xF3, 0xF4];
export const MODS_RIGHT = [0xF5, 0xF6, 0xF7, 0xF8];

export const isMod = c => c >= 0xF1 && c <= 0xF8;
export const sortMods = a =>
  a.slice().sort((x, y) => MODORDER.indexOf(x) - MODORDER.indexOf(y));

/* Names a user might type for a modifier, including the Mac ones. Measured:
 * command/option/control are the same eight bits, not distinct codes. */
export const MOD_BY_NAME = (() => {
  const m = {};
  for (const [code, name] of Object.entries(MODS)) m[name.toLowerCase()] = +code;
  Object.assign(m, {
    command: 0xF4, cmd: 0xF4, '⌘': 0xF4,
    option: 0xF3, opt: 0xF3, '⌥': 0xF3,
    control: 0xF1, '⌃': 0xF1,
    'right option': 0xF7, 'right command': 0xF8,
  });
  return m;
})();

// ---------------------------------------------------------------- mouse

export const MOUSE_BUTTONS = {
  0x01: 'MouseLeft', 0x02: 'MouseRight', 0x04: 'MouseMiddle',
  0x08: 'MouseBack', 0x10: 'MouseForward',
};
export const MOUSE_BY_NAME = byName(MOUSE_BUTTONS);

/* Wheel is a signed byte at its own offset (idx 20), not a button bit.
 * Encoded separately by pad-wire.js. */
export const WHEEL_UP = 1;
export const WHEEL_DOWN = -1;

// ---------------------------------------------------------------- media

/* Consumer-page usages, measured against the HID Consumer Page standard.
 * Bass/Treble carry a high byte: writing only idx8 leaves them unreachable. */
export const MEDIA_USAGES = {
  0xB5: 'NextTrack', 0xB6: 'PrevTrack', 0xB7: 'Stop', 0xCD: 'PlayPause',
  0xE2: 'Mute', 0xE9: 'VolumeUp', 0xEA: 'VolumeDown',
  0x6F: 'BrightnessUp', 0x70: 'BrightnessDown',
  0x152: 'BassUp', 0x153: 'BassDown', 0x154: 'TrebleUp', 0x155: 'TrebleDown',
  0x183: 'MediaPlayer', 0x18A: 'Email', 0x192: 'Calculator',
  0x194: 'MyComputer', 0x221: 'WwwSearch', 0x223: 'WwwHome',
  0x224: 'WwwBack', 0x225: 'WwwForward', 0x227: 'WwwRefresh',
};
export const MEDIA_BY_NAME = byName(MEDIA_USAGES);

/* Display names. MEDIA_USAGES above holds the protocol's own names and must
 * keep matching macropad.py, so labels live here instead. */
export const MEDIA_LABELS = {
  en: {
    0xB5: 'Next track', 0xB6: 'Previous track', 0xB7: 'Stop',
    0xCD: 'Play / Pause',
    0xE2: 'Mute', 0xE9: 'Volume +', 0xEA: 'Volume −',
    0x6F: 'Screen brighter', 0x70: 'Screen dimmer',
    0x152: 'Bass +', 0x153: 'Bass −',
    0x154: 'Treble +', 0x155: 'Treble −',
    0x183: 'Media player', 0x18A: 'Email', 0x192: 'Calculator',
    0x194: 'Open This PC', 0x221: 'Web search', 0x223: 'Home page',
    0x224: 'Browser back', 0x225: 'Browser forward', 0x227: 'Reload',
  },
  ja: {
    0xB5: '次の曲', 0xB6: '前の曲', 0xB7: '停止',
    0xCD: '再生／一時停止',
    0xE2: '消音', 0xE9: '音量＋', 0xEA: '音量−',
    0x6F: '画面を明るく', 0x70: '画面を暗く',
    0x152: '低音＋', 0x153: '低音−',
    0x154: '高音＋', 0x155: '高音−',
    0x183: 'メディアプレーヤー',
    0x18A: 'メール', 0x192: '電卓',
    0x194: 'PC を開く', 0x221: 'Web 検索',
    0x223: 'ホームページ',
    0x224: 'ブラウザ戻る',
    0x225: 'ブラウザ進む',
    0x227: '再読み込み',
  },
};
/** The display name for a media usage, falling back to the protocol name. */
export const mediaLabel = (code, lang = LANG) =>
  (MEDIA_LABELS[lang] || MEDIA_LABELS.en)[code] || MEDIA_LABELS.en[code]
  || MEDIA_USAGES[code] || hex(code);
/* Search words for each media usage: the Japanese terms someone would reach
 * for, plus the English protocol name. */
export const MEDIA_ALIASES = {
  0xB5: ['つぎのきょく', '次の曲', 'つぎ', 'nexttrack', 'next'],
  0xB6: ['まえのきょく', '前の曲', 'まえ', 'prevtrack', 'prev'],
  0xB7: ['ていし', '停止', 'stop'],
  0xCD: ['さいせい', '再生', 'いちじていし', '一時停止', 'playpause', 'play', 'pause'],
  0xE2: ['しょうおん', '消音', 'みゅーと', 'mute'],
  0xE9: ['おんりょう', '音量', 'おんりょうあっぷ', 'volumeup', 'volup'],
  0xEA: ['おんりょう', '音量', 'おんりょうだうん', 'volumedown', 'voldown'],
  0x6F: ['あかるく', '明るく', 'きど', '輝度', 'brightnessup'],
  0x70: ['くらく', '暗く', 'きど', '輝度', 'brightnessdown'],
  /* Up and down share every generic word, so each also carries a direction
     term -- without one no query can single out BassDown. */
  0x152: ['ていおん', '低音', 'ばす', 'ていおんあっぷ', '低音＋', 'bassup'],
  0x153: ['ていおん', '低音', 'ばす', 'ていおんだうん', '低音−', 'bassdown'],
  0x154: ['こうおん', '高音', 'とれぶる', 'こうおんあっぷ', '高音＋', 'trebleup'],
  0x155: ['こうおん', '高音', 'とれぶる', 'こうおんだうん', '高音−', 'trebledown'],
  0x183: ['めでぃあぷれーやー', 'メディアプレーヤー', 'mediaplayer'],
  0x18A: ['めーる', 'メール', 'email', 'mail'],
  0x192: ['でんたく', '電卓', 'けいさん', 'calculator', 'calc'],
  0x194: ['ぴーしー', 'PC', 'まいこんぴゅーた', 'mycomputer', 'explorer'],
  0x221: ['けんさく', '検索', 'wwwsearch', 'search'],
  0x223: ['ほーむぺーじ', 'ホームページ', 'ほーむ', 'wwwhome', 'home'],
  0x224: ['もどる', '戻る', 'ぶらうざ', 'wwwback', 'back'],
  0x225: ['すすむ', '進む', 'ぶらうざ', 'wwwforward', 'forward'],
  0x227: ['さいよみこみ', '再読み込み', 'りろーど', 'wwwrefresh', 'refresh', 'reload'],
};
/** Search words for a mouse action, by name. */
export const MOUSE_ALIASES = {
  MouseLeft:    ['ひだりくりっく', '左クリック', 'ひだり', '左', 'mouseleft', 'lclick'],
  MouseRight:   ['みぎくりっく', '右クリック', 'みぎ', '右', 'mouseright', 'rclick'],
  MouseMiddle:  ['ちゅうおうくりっく', '中央クリック', 'ちゅうおう', 'まんなか',
                 'mousemiddle', 'mclick'],
  MouseBack:    ['もどる', '戻る', 'mouseback', 'back'],
  MouseForward: ['すすむ', '進む', 'mouseforward', 'forward'],
  WheelUp:      ['ほいーる', 'ホイール', 'ほいーるうえ', 'すくろーる',
                 'wheelup', 'wheel', 'scrollup'],
  WheelDown:    ['ほいーる', 'ホイール', 'ほいーるした', 'すくろーる',
                 'wheeldown', 'wheel', 'scrolldown'],
};

export const mediaList = (lang = LANG) => [
  0xCD, 0xB5, 0xB6, 0xB7,                 // transport
  0xE9, 0xEA, 0xE2,                       // volume
  0x6F, 0x70,                             // brightness
  0x192, 0x194, 0x18A, 0x183,             // apps
  0x223, 0x221, 0x224, 0x225, 0x227,      // browser
  0x152, 0x153, 0x154, 0x155,             // tone
].map(c => ({ code: c, name: MEDIA_USAGES[c], label: mediaLabel(c, lang),
              alias: MEDIA_ALIASES[c] || [] }));

// ------------------------------------------------------------ keyboard

/* HID usage -> the name of the *physical US key*, because that is what the
 * device transmits. Which character appears depends on the host layout; on a
 * JIS host it often differs -- see JIS_OUTPUT below. */
export const HID_NAMES = (() => {
  const n = {};
  for (let i = 0; i < 26; i++) n[0x04 + i] = String.fromCharCode(65 + i);
  '1234567890'.split('').forEach((c, i) => { n[0x1E + i] = c; });
  Object.assign(n, {
    0x28: 'Enter', 0x29: 'Esc', 0x2A: 'Backspace', 0x2B: 'Tab', 0x2C: 'Space',
    0x2D: 'Minus', 0x2E: 'Equal', 0x2F: 'LBracket', 0x30: 'RBracket',
    0x31: 'Backslash', 0x32: 'NonUsHash', 0x33: 'Semicolon', 0x34: 'Quote',
    0x64: 'NonUsBackslash', 0x65: 'Application',
    0x35: 'Grave', 0x36: 'Comma', 0x37: 'Period', 0x38: 'Slash',
    0x39: 'CapsLock', 0x46: 'PrintScreen', 0x47: 'ScrollLock', 0x48: 'Pause',
    0x49: 'Insert', 0x4A: 'Home', 0x4B: 'PageUp', 0x4C: 'Delete', 0x4D: 'End',
    0x4E: 'PageDown', 0x4F: 'Right', 0x50: 'Left', 0x51: 'Down', 0x52: 'Up',
    0x53: 'NumLock',
    0x87: 'JisRo', 0x88: 'JisKana', 0x89: 'JisYen', 0x8A: 'JisHenkan',
    0x8B: 'JisMuhenkan',
  });
  for (let i = 0; i < 12; i++) n[0x3A + i] = 'F' + (i + 1);
  for (let i = 0; i < 12; i++) n[0x68 + i] = 'F' + (i + 13);
  return n;
})();
export const NAME_TO_HID = byName(HID_NAMES);

/* Keypad usages. */
export const KEYPAD_NAMES = {
  0x54: 'KpDivide', 0x55: 'KpMultiply', 0x56: 'KpMinus', 0x57: 'KpPlus',
  0x58: 'KpEnter', 0x59: 'Kp1', 0x5A: 'Kp2', 0x5B: 'Kp3', 0x5C: 'Kp4',
  0x5D: 'Kp5', 0x5E: 'Kp6', 0x5F: 'Kp7', 0x60: 'Kp8', 0x61: 'Kp9',
  0x62: 'Kp0', 0x63: 'KpDot',
};

// ------------------------------------------------------------- JIS map

/* What each physical key produces on a Japanese (106/109) layout. HID calls
 * 0x30 "RBracket", but on a JIS board it types `[`.
 *
 * The unshifted column was measured on this machine; all 22 printable entries
 * matched the JIS standard, so the shifted column is trusted. */
export const JIS_OUTPUT = {
  0x1E: ['1', '!'], 0x1F: ['2', '"'], 0x20: ['3', '#'], 0x21: ['4', '$'],
  0x22: ['5', '%'], 0x23: ['6', '&'], 0x24: ['7', "'"], 0x25: ['8', '('],
  0x26: ['9', ')'], 0x27: ['0', null], 0x2D: ['-', '='], 0x2E: ['^', '~'],
  0x2F: ['@', '`'], 0x30: ['[', '{'], 0x31: [']', '}'], 0x33: [';', '+'],
  0x34: [':', '*'], 0x35: ['Zenkaku', null], 0x36: [',', '<'],
  0x37: ['.', '>'], 0x38: ['/', '?'], 0x87: ['\\', '_'], 0x89: ['\\', '|'],
};

/* Usages whose unshifted output was observed directly on this host. */
export const JIS_VERIFIED = new Set([
  0x1E, 0x1F, 0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27,
  0x2D, 0x2E, 0x2F, 0x30, 0x31, 0x33, 0x34, 0x36, 0x37, 0x38, 0x87, 0x89,
]);


/* ---- keyboard layouts ----
 *
 * The device transmits a US physical usage; what the HOST types depends on
 * its keyboard layout. Only `jis` is supported today.
 *
 * `output` is usage -> [unshifted, shifted]; a usage absent from it types the
 * character its US name already says. */
export const LAYOUTS = {
  jis: { id: 'jis', name: 'Japanese (JIS 106/109)',
         output: JIS_OUTPUT, verified: JIS_VERIFIED },
};
export let LAYOUT = 'jis';
export function setLayout(l) { LAYOUT = LAYOUTS[l] ? l : 'jis'; return LAYOUT; }

/* What a usage actually types on `layout`, or null if the layout does not
 * remap it. Single characters only: 'Zenkaku' is a key, not a glyph. */
export function glyphFor(code, shifted = false, layout = LAYOUT) {
  const map = (LAYOUTS[layout] || LAYOUTS.jis).output;
  const pair = map[code];
  if (!pair) return null;
  const out = shifted ? pair[1] : pair[0];
  return out && out.length === 1 ? out : null;
}

/* The best display name for a usage on the current layout: the character it
 * types if it types one, otherwise the key's name -- HID's `RBracket` names a
 * key on a US board, which on this machine types `[`.
 *
 * `shifted` folds the modifier into the glyph where the layout has one
 * (Shift+0x30 is `{`). Where there is none the caller keeps its `Shift+`. */
export function keyLabel(code, shifted = false, layout = LAYOUT) {
  const g = glyphFor(code, shifted, layout);
  if (g) return g;
  if (!shifted && code >= 0x04 && code <= 0x1D)
    return String.fromCharCode(97 + code - 0x04);
  if (shifted && code >= 0x04 && code <= 0x1D)
    return String.fromCharCode(65 + code - 0x04);
  return null;
}

/* The character you want -> [usage, needsShift]. */
export const CHAR_TO_KEY = (() => {
  const m = {};
  for (const [u, pair] of Object.entries(JIS_OUTPUT)) {
    const [plain, shift] = pair;
    if (plain && plain.length === 1 && !(plain in m)) m[plain] = [+u, false];
    if (shift && shift.length === 1 && !(shift in m)) m[shift] = [+u, true];
  }
  for (let i = 0; i < 26; i++) {
    m[String.fromCharCode(97 + i)] = [0x04 + i, false];
    m[String.fromCharCode(65 + i)] = [0x04 + i, true];
  }
  return m;
})();

/** Usages that type `ch` on a JIS host: '[' -> [0x30], '{' -> [0xF2, 0x30]. */
export function keysForChar(ch) {
  if (ch === ' ') return [0x2C];
  const ent = CHAR_TO_KEY[ch];
  if (!ent) return null;
  const [usage, shift] = ent;
  return shift ? [0xF2, usage] : [usage];
}

/** Usages for a whole string, or {error} if a character has no key. */
export function keysForText(s) {
  const codes = [];
  const bad = [];
  for (const ch of s) {
    const part = keysForChar(ch);
    if (!part) { bad.push(ch); continue; }
    codes.push(...part);
  }
  if (bad.length) return { error: 'no key types: ' + bad.join(' '), bad };
  return { codes };
}

// ------------------------------------------------------------- targets

/* Physical layout: 16 keys (4x4), then 3 knobs of 3 actions each (total 25 slots).
 * Key ids are what the wire uses; the names are for people.
 *
 * Knob ids run 17..25 in blocks of three (CCW, press, CW):
 * Knob 1: 17, 18, 19
 * Knob 2: 20, 21, 22
 * Knob 3: 23, 24, 25 */
export const KNOB_ACTIONS = ['CCW', 'Press', 'CW'];
export let KNOB_ORDER = [1, 2, 3];   // default knob order [1, 2, 3]

export function setKnobOrder(order) {
  if (Array.isArray(order) && order.length === 3) {
    KNOB_ORDER = order.slice();
  }
}

/* A read returns 25 entries. For 16-key + 3-knob layout, exactly 25 entries
 * are reachable: 16 keys (1..16) + 3 knobs * 3 actions (17..25). */
export const MAX_KEY_ID = 25;
export const isPhysical = id => id >= 1 && id <= MAX_KEY_ID;

export function keyIdToName(id) {
  if (id >= 1 && id <= 16) return 'key' + String(id).padStart(2, '0');
  if (id >= 17 && id <= 25) {
    const block = Math.floor((id - 17) / 3);
    return 'knob' + KNOB_ORDER[block] + '-' + KNOB_ACTIONS[(id - 17) % 3];
  }
  return null;
}

export function nameToKeyId(name) {
  const s = String(name).trim();
  let m = /^key0*(\d+)$/i.exec(s);
  if (m) { const n = +m[1]; return n >= 1 && n <= 16 ? n : null; }
  m = /^knob([1-3])-(ccw|press|cw)$/i.exec(s);
  if (m) {
    const block = KNOB_ORDER.indexOf(+m[1]);
    if (block < 0) return null;
    const act = KNOB_ACTIONS.findIndex(a => a.toLowerCase() === m[2].toLowerCase());
    return 17 + block * 3 + act;
  }
  return null;
}

export function allTargets() {
  const out = [];
  for (let id = 1; id <= 25; id++) out.push({ keyId: id, name: keyIdToName(id) });
  return out;
}

// ----------------------------------------------------------------- LED

/* All six observed on this unit with every key set to white. The vendor tool
 * only calls these "LED Mode0".."LED Mode5"; these names are ours.
 *
 * Modes 6+ are refused by the firmware: writing one leaves reads unanswered
 * until a valid mode is written back. */
export const LED_MODES = {
  0: 'off', 1: 'static', 2: 'reactive', 3: 'ripple', 4: 'wave', 5: 'fade',
};
export const LED_SLOTS = 16;

export const LED_MODE_HELP = {
  ko: {
    0: 'LED를 완전히 끕니다.',
    1: '지정한 색상으로 키패드 백라이트를 항상 켭니다.',
    2: '평소엔 어둡다가 키를 누를 때만 지정한 색상으로 점등합니다.',
    3: '키를 누르면 물방울이 번지듯 파문(리플) 효과가 퍼집니다.',
    4: '무지개 색상이 왼쪽에서 오른쪽으로 물결치듯 흐릅니다 (웨이브).',
    5: '무지개 색상이 키패드 전체에서 은은하게 변합니다 (그라데이션).',
  },
  en: {
    0: 'Off — no lights',
    1: 'Always on — lights up with your chosen colours',
    2: 'Light on press — dim until pressed, lights with your chosen colours',
    3: 'Ripple on press — sends out a wave from the pressed key',
    4: 'Rainbow wave — rainbow sweeps across the pad from left to right',
    5: 'Rainbow fade — all keys shift through the rainbow together',
  },
  ja: {
    0: '消灯',
    1: '常時点灯 — キーごとの色が出ます',
    2: '押すと点灯 — 普段は暗く、押したキーだけ光ります',
    3: '波紋 — 押したキーから光の波が広がります',
    4: '虹色の波 — 左から右へ虹が流れます',
    5: '虹色のフェード — 全キーが揃って虹色に移り変わります',
  },
};

export const LED_MODE_TRAITS = {
  0: { perKey: false, animated: false },
  1: { perKey: true,  animated: false },
  2: { perKey: true,  animated: false },
  3: { perKey: true,  animated: true  },
  4: { perKey: false, animated: true  },
  5: { perKey: false, animated: true  },
};

export const LED_NO_COLOR_REASON = {
  ko: {
    0: '소등 모드에서는 색상이 꺼집니다. 불을 켜려면 [상시 점등]을 선택하세요.',
    4: '웨이브 모드는 펌웨어 자체 무지개 색상을 사용하므로 개별 색상은 적용되지 않습니다.',
    5: '페이드 모드는 펌웨어 자체 무지개 색상을 사용하므로 개별 색상은 적용되지 않습니다.',
  },
  en: {
    0: 'Off mode cannot use LED colours. Choose Always on to set colours.',
    4: 'Rainbow wave mode generates its own colours from firmware.',
    5: 'Rainbow fade mode generates its own colours from firmware.',
  },
  ja: {
    0: '消灯モードでは LEDの色を設定できません。「常時点灯」を選んでください。',
    4: '虹色の波モードは本体が色を作るため、パレットの色は使われません。',
    5: '虹色のフェードモードは本体が色を作るため、パレットの色は使われません。',
  },
};

export const LED_MODE_LABELS = {
  ko: {
    0: '소등 (LED 끄기)',
    1: '상시 점등 (LED 켜기)',
    2: '누를 때 점등 (리액티브)',
    3: '파문 (누를 때 리플 확산)',
    4: '무지개 웨이브 (흐름)',
    5: '무지개 페이드 (전체 순환)',
  },
  en: {
    0: 'Off',
    1: 'Always on',
    2: 'Light on press',
    3: 'Ripple on press',
    4: 'Rainbow wave',
    5: 'Rainbow fade',
  },
  ja: {
    0: '消灯',
    1: '常時点灯',
    2: '押すと点灯',
    3: '波紋',
    4: '虹色の波',
    5: '虹色のフェード',
  },
};
/** The display name for an LED mode number. */
export const ledModeLabel = (n, lang = LANG) =>
  (LED_MODE_LABELS[lang] || LED_MODE_LABELS.en)[n]
  || LED_MODE_LABELS.en[n] || LED_MODES[n] || String(n);
/** The LED mode list in the shape a <select> wants. `name` stays the protocol
 *  name; `label` is what to show. perKey/animated/noColor ride along. */
export const ledModeList = (lang = LANG) => {
  const help = LED_MODE_HELP[lang] || LED_MODE_HELP.en;
  const why = LED_NO_COLOR_REASON[lang] || LED_NO_COLOR_REASON.en;
  return Object.entries(LED_MODES)
    .map(([n, name]) => ({ n: +n, name, label: ledModeLabel(+n, lang),
                           help: help[+n] || '',
                           noColor: why[+n] || '',
                           ...(LED_MODE_TRAITS[+n] || { perKey: true, animated: false }) }));
};

/* The vendor tool's 7-column swatch grid. The device accepts any 24-bit
   colour -- this is a convenience, not a limit. */
export const VENDOR_PALETTE = [
  ['#ff0000','#ff8030','#ffff30','#00ff00','#00ffff','#0000ff','#800080'],
  ['#8b0000','#ffa500','#ffff96','#7dff00','#008b8b','#00008b','#ff00ff'],
  ['#a00000','#ff8c00','#ffd700','#00fa9a','#e0ffff','#87ceeb','#4b0082'],
  ['#ff6666','#ffc864','#ffff99','#006400','#0f8b8b','#1e90ff','#f0f0ff'],
  ['#ffc0cb','#ffc000','#c8b400','#808000','#00fa9a','#3a0a6b','#9932cc'],
  ['#ff4500','#ff5a00','#c8ff00','#90ee90','#7fb3b3','#add8e6','#9090c8'],
  ['#ffffc8','#ff8c00','#a8a878','#228b22','#0080ff','#0096ff','#d8b0ff'],
  ['#ff00ff','#ff6400','#a8b878','#22cc22','#00b478','#9090c8','#c8c896'],
];

export const WIRELESS_NOTES = {
  ko: 'Bluetooth / 2.4G 무선으로 사용하기 전에 먼저 USB로 연결하여 설정해 주세요. '
    + '무선 사용 시에는 절전을 위해 RGB LED가 꺼집니다. USB 허브를 통하지 말고 컴퓨터에 직접 연결해 주세요.',
  en: 'Set the device up over USB before using Bluetooth or 2.4G. '
    + 'RGB is off on wireless. Connect it directly, not through a hub.',
  ja: 'Bluetooth／2.4G で使う前に、'
    + 'USB でつないで設定してください。'
    + '無線時は RGB が消灯します。'
    + 'ハブ経由ではなく直接つないでください。',
};
export const wirelessNote = (lang = LANG) =>
  WIRELESS_NOTES[lang] || WIRELESS_NOTES.en;

/* The character table the picker and the typing path both read, in
   {usage, shift} form. Letters included. */
export const charTable = () => {
  const out = {};
  for (const [u, pair] of Object.entries(JIS_OUTPUT)) {
    const [plain, shift] = pair;
    if (plain && plain.length === 1) out[plain] = { usage: +u, shift: false };
    if (shift && shift.length === 1) out[shift] = { usage: +u, shift: true };
  }
  for (let i = 0; i < 26; i++) {
    out[String.fromCharCode(97 + i)] = { usage: 0x04 + i, shift: false };
    out[String.fromCharCode(65 + i)] = { usage: 0x04 + i, shift: true };
  }
  return out;
};

/* Everything the mouse kind can express, as one list the picker can render.
   Buttons, wheel and modifier are three different fields on the wire
   (idx 11, idx 20, idx 8), so each entry carries the values it sets. */
export const MOUSE_LABELS = {
  en: { MouseLeft: 'Left click', MouseRight: 'Right click',
        MouseMiddle: 'Middle click', MouseBack: 'Back', MouseForward: 'Forward',
        WheelUp: 'Wheel \u2191', WheelDown: 'Wheel \u2193' },
  ja: { MouseLeft: '\u5de6\u30af\u30ea\u30c3\u30af',
        MouseRight: '\u53f3\u30af\u30ea\u30c3\u30af',
        MouseMiddle: '\u4e2d\u592e\u30af\u30ea\u30c3\u30af',
        MouseBack: '\u623b\u308b', MouseForward: '\u9032\u3080',
        WheelUp: '\u30db\u30a4\u30fc\u30eb\u2191',
        WheelDown: '\u30db\u30a4\u30fc\u30eb\u2193' },
};
/** The display name for a mouse action, by its protocol name. */
export const mouseLabel = (name, lang = LANG) =>
  (MOUSE_LABELS[lang] || MOUSE_LABELS.en)[name] || MOUSE_LABELS.en[name] || name;

/* `label` here is the ENGLISH label; mouseActions(lang) below hands back the
   same rows re-labelled, and that is what the UI renders. */
export const MOUSE_ACTIONS = [
  { name: 'MouseLeft',    label: MOUSE_LABELS.en.MouseLeft,    buttons: 0x01, wheel: 0,  mod: 0 },
  { name: 'MouseRight',   label: MOUSE_LABELS.en.MouseRight,   buttons: 0x02, wheel: 0,  mod: 0 },
  { name: 'MouseMiddle',  label: MOUSE_LABELS.en.MouseMiddle,  buttons: 0x04, wheel: 0,  mod: 0 },
  { name: 'MouseBack',    label: MOUSE_LABELS.en.MouseBack,    buttons: 0x08, wheel: 0,  mod: 0 },
  { name: 'MouseForward', label: MOUSE_LABELS.en.MouseForward, buttons: 0x10, wheel: 0,  mod: 0 },
  { name: 'WheelUp',      label: MOUSE_LABELS.en.WheelUp,      buttons: 0,    wheel: 1,  mod: 0 },
  { name: 'WheelDown',    label: MOUSE_LABELS.en.WheelDown,    buttons: 0,    wheel: -1, mod: 0 },
  /* Modifier combinations are not listed here: arming Ctrl and picking
   * ホイール↑ produces Ctrl+WheelUp. Where the modifier lands on the wire
   * (mod field for mouse, an inline code for keyboard) is decided when the
   * binding is built. */
];
/** The mod byte a modifier code becomes on a mouse binding. The wire keeps
 *  mouse modifiers in their own field (idx 8) rather than inline, and only
 *  these three exist there. */
export const MOUSE_MOD_OK = { 0xF1: 0xF1, 0xF2: 0xF2, 0xF3: 0xF3 };
/** Fold armed modifiers into a mouse action.
 *  Returns { action, dropped:[code] } -- `dropped` is what the device cannot
 *  express on a mouse binding, for the caller to tell the user about. */
export function armMouse(action, armed = []) {
  const ok = [], dropped = [];
  for (const c of armed) (MOUSE_MOD_OK[c] ? ok : dropped).push(c);
  if (!ok.length) return { action, dropped };
  /* One mod byte, not a set: the field is a single value, so extras are
     reported as dropped. */
  const [first, ...rest] = ok;
  dropped.push(...rest);
  const names = { 0xF1: 'Ctrl', 0xF2: 'Shift', 0xF3: 'Alt' };
  return { action: { ...action, mod: first,
                     name: names[first] + '+' + action.name,
                     label: names[first] + '+' + action.label },
           dropped };   /* label follows whatever the caller passed in */
}
export const MOUSE_ACTION_BY_NAME =
  Object.fromEntries(MOUSE_ACTIONS.map(a => [a.name.toLowerCase(), a]));

/** The mouse actions as the picker should render them in `lang`. Same rows
 *  and field values -- only `label` differs. */
export const mouseActions = (lang = LANG) =>
  MOUSE_ACTIONS.map(a => ({ ...a, label: mouseLabel(a.name, lang) }));

export const mouseNames = () => Object.values(MOUSE_BUTTONS).sort();
export const mediaNames = () => Object.values(MEDIA_USAGES).sort();

// --------------------------------------------------------------- naming

/** Best display name for a usage, whatever kind of thing it is.
 *
 *  For keyboard usages this is the character the key types on the current
 *  LAYOUT where it types one, and the key's name otherwise. `shifted` folds
 *  Shift into the glyph when the layout has one.
 *
 *  `raw: true` asks for the protocol name instead -- for logs and tests. */
export function labelFor(code, kind = KIND_KEYBOARD, shifted = false,
                         layout = LAYOUT, raw = false) {
  if (kind === KIND_MEDIA) return MEDIA_USAGES[code] || hex(code);
  if (kind === KIND_MOUSE) return MOUSE_BUTTONS[code] || hex(code);
  if (MODS[code]) return MODS[code];
  if (!raw) {
    const g = keyLabel(code, shifted, layout);
    if (g) return g;
  }
  return HID_NAMES[code] || KEYPAD_NAMES[code] || hex(code);
}

/** What a key actually types here, when that differs from its US name.
 *  The general form is glyphFor(code, shifted, layout). */
export function jisFor(code, shifted = false) {
  return glyphFor(code, shifted, 'jis');
}

const hex = c => '0x' + c.toString(16).toUpperCase().padStart(2, '0');

function byName(table) {
  const m = {};
  for (const [code, name] of Object.entries(table)) m[name.toLowerCase()] = +code;
  return m;
}
