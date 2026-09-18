#!/usr/bin/env python3
"""
build_html.py - Bundles modules and builds a 100% standalone index.html
Works seamlessly with file:// (no CORS error) and http:// (WebHID ready).
"""

import os
import subprocess

# 1. Build bundle.js using esbuild
subprocess.run([
    "npx", "esbuild", "entry.js", "--bundle", "--outfile=bundle.js"
], check=True)

with open("bundle.js", "r", encoding="utf-8") as f:
    bundle_js = f.read()

with open("template.html", "r", encoding="utf-8") as f:
    src_html = f.read()

# 2. Modify CSS in src_html
css_target = ".switches i{width:20px;height:6px;border-radius:3px;background:#5a5f67;\n              box-shadow:inset 0 1px 0 #ffffff18}"
css_replace = """.switches i{width:20px;height:6px;border-radius:3px;background:#5a5f67;
              box-shadow:inset 0 1px 0 #ffffff18;transition:all .2s}
  .switches i.active{background:#4a9eff;box-shadow:0 0 10px #4a9eff, 0 0 3px #ffffff}"""
assert css_target in src_html, "css_target not found"
src_html = src_html.replace(css_target, css_replace)

# 3. Modify HTML structure
assert '<div class="switches"><i></i><i></i><i></i></div>' in src_html
src_html = src_html.replace(
    '<div class="switches"><i></i><i></i><i></i></div>',
    '<div class="switches" title="키패드 측면의 레이어 변경 버튼으로 전환되는 레이어 표시 LED (Layer 1 / 2 / 3)"><i title="Layer 1"></i><i title="Layer 2"></i><i title="Layer 3"></i></div>'
)

# Add Preset menu and Language selector to header
header_target = '<div class="menu">\n    <button onclick="toggleMenu(event)" data-i18n="btn.export"></button>'
header_replace = """<div class="menu">
    <button onclick="toggleMenu(event)" data-i18n="btn.preset">프리셋 ▾</button>
    <div class="menupop" style="min-width:260px">
      <button onclick="applyPlanAPreset()" data-i18n="btn.presetPlanA" style="font-weight:700;color:#6366f1;text-align:left">⭐ 3개 레이어 48키 전체 무반응 키 매핑</button>
      <hr>
      <button onclick="clearAllCurrentLayer()" data-i18n="btn.clearAll" style="text-align:left">현재 레이어 모두 비우기 (None)</button>
    </div>
  </div>
  <div class="menu" id="langMenu">
    <button onclick="toggleMenu(event)" id="langBtn" style="padding:7px 12px;font-size:13px;display:flex;align-items:center;gap:6px">🌐 <span id="currentLangLabel">Language</span> ▾</button>
    <div class="menupop" style="min-width:130px">
      <button onclick="switchLanguage('ko')">🇰🇷 한국어</button>
      <button onclick="switchLanguage('en')">🇺🇸 English</button>
      <button onclick="switchLanguage('ja')">🇯🇵 日本語</button>
      <hr style="margin:4px 0">
      <button onclick="switchLanguage('auto')" style="font-size:12px;color:var(--dim)">🔄 자동 (Auto)</button>
    </div>
  </div>
  <div class="menu">
    <button onclick="toggleMenu(event)" data-i18n="btn.export"></button>"""
assert header_target in src_html, "header_target not found"
src_html = src_html.replace(header_target, header_replace)

# Update Custom color row to include per-key apply, realtime input, and random button
custom_color_row_old = """        <div class="row" style="margin-bottom:0">
          <label data-i18n="led.customColor"></label>
          <input type="color" id="ledAll" value="#4a9eff">
          <button onclick="applyAll()" data-i18n="led.applyAll"></button>
          <div class="grow"></div>
          <span class="hint" data-i18n="led.writeHint"></span>
        </div>"""

custom_color_row_new = """        <div class="row" style="margin-bottom:0;gap:8px;align-items:center;flex-wrap:wrap">
          <label data-i18n="led.customColor"></label>
          <input type="color" id="ledAll" value="#4a9eff" oninput="onCustomColorInput(this.value)">
          <button id="applyKeyBtn" class="primary" onclick="applySelectedKey()" style="display:none;font-weight:700"></button>
          <button onclick="applyAll()" data-i18n="led.applyAll"></button>
          <button type="button" onclick="applyRandomColors()" data-i18n="led.randomColors" style="background:linear-gradient(135deg,#8b5cf6,#ec4899);border:none;color:#fff;font-weight:700;padding:6px 12px;border-radius:6px;cursor:pointer">🎲 전체 랜덤 색상</button>
          <div class="grow"></div>
          <span class="hint" data-i18n="led.writeHint"></span>
        </div>"""
assert custom_color_row_old in src_html, "custom_color_row_old not found"
src_html = src_html.replace(custom_color_row_old, custom_color_row_new)

# 4. Modify Script
old_initpad = """async function initPad(){
  CAT  = await import('./catalog.js');
  WIRE = await import('./pad-wire.js');
  MODEL= await import('./pad-model.js');
  window.MODEL=MODEL;
  const D = await import('./pad-driver.js');
  window.PadHttp=D.PadHttp; window.PadWebHid=D.PadWebHid; window.PadMock=D.PadMock;
  /* Timing constants live with the driver that measured them, not here. */
  D_SLEEP=D.sleep; SETTLE_AFTER_WRITE=D.SETTLE_AFTER_WRITE;
  // A test may install its own PAD before boot; never overwrite that.
  /* A test cannot construct a PadMock before boot -- the class arrives with
     the module boot is loading -- so it asks and boot builds it. window.PAD
     alone does not survive the reloads a persistence test needs. */
  if(!PAD && window.__padMock) PAD = new D.PadMock(window.__padMock);
  if(!PAD) PAD = window.PAD || await D.autoDriver();   // may be null
  window.PAD=PAD; window.CAT=CAT; window.WIRE=WIRE;
  return PAD;
}"""

new_initpad = """async function initPad(){
  if (window.CAT && window.WIRE && window.MODEL && window.PadDriver) {
    CAT = window.CAT;
    WIRE = window.WIRE;
    MODEL = window.MODEL;
  } else {
    try {
      CAT  = await import('./catalog.js');
      WIRE = await import('./pad-wire.js');
      MODEL= await import('./pad-model.js');
      window.PadDriver = await import('./pad-driver.js');
    } catch(e) {
      console.warn('Dynamic import failed, using bundled globals', e);
      CAT = window.CAT;
      WIRE = window.WIRE;
      MODEL = window.MODEL;
    }
  }
  const D = window.PadDriver;
  if (D) {
    window.PadHttp = D.PadHttp; window.PadWebHid = D.PadWebHid; window.PadMock = D.PadMock;
    D_SLEEP = D.sleep || D_SLEEP;
    SETTLE_AFTER_WRITE = D.SETTLE_AFTER_WRITE || SETTLE_AFTER_WRITE;
    if(!PAD && window.__padMock) PAD = new D.PadMock(window.__padMock);
    if(!PAD && D.autoDriver) {
      try { PAD = window.PAD || await D.autoDriver(); } catch(e){}
    }
  }
  window.PAD=PAD; window.CAT=CAT; window.WIRE=WIRE; window.MODEL=MODEL;
  return PAD;
}"""
assert old_initpad in src_html, "old_initpad not found"
src_html = src_html.replace(old_initpad, new_initpad)

# Update render() to render 16 keys and 3 knobs
old_render = """function render(){
  const K=$('#keys');K.innerHTML='';
  for(let i=1;i<=12;i++){
    const n='key'+String(i).padStart(2,'0');
    const e=byName(n)||{label:'NULL',codes:[]};
    const col=COLORS[i-1]||'#000000', lit=col!=='#000000';
    const d=document.createElement('div');
    d.className='key'+(SEL===n?' sel':'');
    d.style.background=lit?col:'#3c4048';
    d.style.color=textOn(col,lit);
    /* Palette open means colouring, so a key click picks the key to paint.
       Otherwise the click opens the editor. Without this the palette can
       never be aimed at one key -- the overlay covers the swatches. */
    d.onclick=()=>{ if($('#ledarea').classList.contains('open')) pickForPaint(n);
                    else openEditor(n); };
    const cnt=(e.codes||[]).length;
    /* A key face is 96px wide and clips at three lines, so `title` carries the
       whole binding for the ones whose face cannot show it. */
    const full=e.label==='NULL'?'':e.label;
    if(full) d.title=`${CAT.t('pad.layer',{n:LAYER})} · ${i}: ${full}`;
    d.innerHTML=`<span class="n">${i}</span>
      ${cnt>1?`<span class="cnt">${cnt}</span>`:''}
      <span class="lab">${esc(full)}</span>`;
    K.appendChild(d);
  }
  const KN=$('#knobs');KN.innerHTML='';
  const top=document.createElement('div');top.className='knobrow';
  top.appendChild(knobEl(1,'s'));top.appendChild(knobEl(2,'s'));
  KN.appendChild(top);KN.appendChild(knobEl(3,'m'));KN.appendChild(knobEl(4,'l'));
}"""

new_render = """function render(){
  const K=$('#keys');K.innerHTML='';
  for(let i=1;i<=16;i++){
    const n='key'+String(i).padStart(2,'0');
    const e=byName(n)||{label:'NULL',codes:[]};
    const col=COLORS[i-1]||'#000000', lit=col!=='#000000';
    const d=document.createElement('div');
    d.className='key'+(SEL===n?' sel':'');
    d.style.background=lit?col:'#3c4048';
    d.style.color=textOn(col,lit);
    d.onclick=()=>{ if($('#ledarea').classList.contains('open')) pickForPaint(n);
                    else openEditor(n); };
    const cnt=(e.codes||[]).length;
    const full=e.label==='NULL'?'':e.label;
    if(full) d.title=`${CAT.t('pad.layer',{n:LAYER})} · ${i}: ${full}`;
    d.innerHTML=`<span class="n">${i}</span>
      ${cnt>1?`<span class="cnt">${cnt}</span>`:''}
      <span class="lab">${esc(full)}</span>`;
    K.appendChild(d);
  }
  const KN=$('#knobs');KN.innerHTML='';
  KN.appendChild(knobEl(1,'m'));
  KN.appendChild(knobEl(2,'m'));
  KN.appendChild(knobEl(3,'m'));
}"""
assert old_render in src_html, "old_render not found"
src_html = src_html.replace(old_render, new_render)

# Update setLayer(n) to toggle LED
old_setlayer = """function setLayer(n){LAYER=n;SEL=null;
  [1,2,3].forEach(i=>$('#lb'+i).classList.toggle('on',i===n));refresh();}"""

new_setlayer = """function setLayer(n){LAYER=n;SEL=null;
  [1,2,3].forEach(i=>{
    const b=$('#lb'+i);if(b)b.classList.toggle('on',i===n);
    const sw=document.querySelectorAll('.switches i')[i-1];
    if(sw)sw.classList.toggle('active',i===n);
  });
  refresh();}"""
assert old_setlayer in src_html, "old_setlayer not found"
src_html = src_html.replace(old_setlayer, new_setlayer)

# Update COLORS 12 -> 16
assert "COLORS = led ? led.colors.slice(0,12) : Array(12).fill('#000000');" in src_html
src_html = src_html.replace("COLORS = led ? led.colors.slice(0,12) : Array(12).fill('#000000');",
                            "COLORS = led ? led.colors.slice(0,16) : Array(16).fill('#000000');")
src_html = src_html.replace("COLORS.slice(0,12).map(c=>", "COLORS.slice(0,16).map(c=>")
src_html = src_html.replace("keep ? keep.colors.slice(0,12) : COLORS.slice(0,12)", "keep ? keep.colors.slice(0,16) : COLORS.slice(0,16)")
src_html = src_html.replace("for(let i=0;i<12;i++)COLORS[i]=hex;", "for(let i=0;i<16;i++)COLORS[i]=hex;")
src_html = src_html.replace("for(let i=0;i<12;i++)COLORS[i]=c;commitColors();", "for(let i=0;i<16;i++)COLORS[i]=c;commitColors();")

# Replace syncLedTarget with rich per-key indicator
old_sync_led_target = """function syncLedTarget(){
  const t=$('#ledTarget'); if(!t) return;
  const m=SEL&&SEL.match(/^key(\\d+)$/);
  if(m){
    const e=byName(SEL), lab=e&&e.label!=='NULL'?e.label:'';
    t.innerHTML=CAT.t('led.targetOne',
      {n:+m[1], q:lab?' \\u201c'+esc(lab)+'\\u201d':''});
  }else{
    t.innerHTML=CAT.t('led.targetAll');
  }
}"""

new_sync_led_target = """function syncLedTarget(){
  const t=$('#ledTarget'); if(!t) return;
  const btnKey = $('#applyKeyBtn');
  const m=SEL&&SEL.match(/^key(\\\\d+)$/);
  if(m){
    const keyNum = +m[1];
    const e=byName(SEL), lab=e&&e.label!=='NULL'?e.label:'';
    const qStr = lab ? ' ('+esc(lab)+')' : '';
    t.innerHTML = CAT.t('led.targetOne', { n: keyNum, q: qStr });
    if(btnKey) {
      btnKey.style.display = '';
      btnKey.textContent = CAT.t('led.applyKey', { n: keyNum });
    }
    if(COLORS[keyNum - 1] && COLORS[keyNum - 1] !== '#000000') {
      $('#ledAll').value = COLORS[keyNum - 1];
    }
  } else {
    t.innerHTML = CAT.t('led.targetAll');
    if(btnKey) btnKey.style.display = 'none';
  }
}"""
assert old_sync_led_target in src_html, "old_sync_led_target not found"
src_html = src_html.replace(old_sync_led_target, new_sync_led_target)

# Replace useSwatch and applyAll, and add applySelectedKey, onCustomColorInput, applyRandomColors
old_swatch_funcs = """function useSwatch(hex){
  if(!colorsUsed()) return;
  const m=SEL&&SEL.match(/^key(\\d+)$/);
  if(m)COLORS[+m[1]-1]=hex;
  else for(let i=0;i<16;i++)COLORS[i]=hex;
  $('#ledAll').value=hex; commitColors();
}
function applyAll(){if(!colorsUsed())return;const c=$('#ledAll').value;
  for(let i=0;i<16;i++)COLORS[i]=c;commitColors();}"""

new_swatch_funcs = """function useSwatch(hex){
  const modeSelect = $('#ledMode');
  if (modeSelect && +modeSelect.value === 0) modeSelect.value = 1;
  const m=SEL&&SEL.match(/^key(\\\\d+)$/);
  if(m) {
    COLORS[+m[1]-1]=hex;
    msg(CAT.t('led.msgAppliedKey', { n: m[1], c: hex }), 'ok');
  } else {
    for(let i=0;i<16;i++) COLORS[i]=hex;
  }
  $('#ledAll').value=hex;
  commitColors();
}
function applySelectedKey(){
  const m=SEL&&SEL.match(/^key(\\\\d+)$/);
  if(!m){
    return;
  }
  const modeSelect = $('#ledMode');
  if (modeSelect && +modeSelect.value === 0) modeSelect.value = 1;
  const c=$('#ledAll').value;
  const keyIdx = +m[1] - 1;
  COLORS[keyIdx] = c;
  commitColors();
  msg(CAT.t('led.msgAppliedKey', { n: m[1], c }), 'ok');
}
function onCustomColorInput(hex){
  const m=SEL&&SEL.match(/^key(\\\\d+)$/);
  if(m){
    const modeSelect = $('#ledMode');
    if (modeSelect && +modeSelect.value === 0) modeSelect.value = 1;
    COLORS[+m[1] - 1] = hex;
    commitColors();
  }
}
function applyAll(){
  const modeSelect = $('#ledMode');
  if (modeSelect && +modeSelect.value === 0) modeSelect.value = 1;
  const c=$('#ledAll').value;
  for(let i=0;i<16;i++) COLORS[i]=c;
  commitColors();
  msg(CAT.t('led.msgAppliedAll', { c }), 'ok');
}
function applyRandomColors(){
  const modeSelect = $('#ledMode');
  if (modeSelect && +modeSelect.value === 0) modeSelect.value = 1;

  // 1. 16개의 완전히 구별되는 고유 색조(Hue) 생성 (360도를 16등분하여 중복 0%)
  const baseOffset = Math.floor(Math.random() * 360);
  const uniqueHues = [];
  for (let i = 0; i < 16; i++) {
    uniqueHues.push((baseOffset + Math.floor(i * (360 / 16))) % 360);
  }

  // 2. 피셔-예이츠 셔플(Fisher-Yates Shuffle)로 16개 색상을 완벽하게 뒤섞음
  for (let i = uniqueHues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = uniqueHues[i];
    uniqueHues[i] = uniqueHues[j];
    uniqueHues[j] = tmp;
  }

  // 3. 섞인 16개 서로 다른 고유 색상을 각 키에 1개씩만 배정
  for (let i = 0; i < 16; i++) {
    const h = uniqueHues[i];
    const s = 0.95;
    const l = 0.52;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    const toHex = v => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    COLORS[i] = '#' + toHex(r) + toHex(g) + toHex(b);
  }
  commitColors();
  msg(CAT.t('led.msgRandom'), 'ok');
}"""
assert old_swatch_funcs in src_html, "old_swatch_funcs not found"
src_html = src_html.replace(old_swatch_funcs, new_swatch_funcs)

# Add preset helper functions before exportApp
preset_code = """
function applyPlanAPreset(){
  if(!DRAFT){ DRAFT=MODEL.emptyConfig(); }

  // 1. Layer 1:
  // Keys 1..12: F13..F24 (0x68 .. 0x73)
  for(let i=1; i<=12; i++){
    const fcode = 0x68 + (i - 1);
    DRAFT = MODEL.withBinding(DRAFT, { keyId: i, layer: 1, kind: 1, codes: [fcode], delays: [0] });
  }
  // Keys 13..16: Shift + F13..F16 (0xF2, 0x68 .. 0x6B)
  for(let i=13; i<=16; i++){
    const fcode = 0x68 + (i - 13);
    DRAFT = MODEL.withBinding(DRAFT, { keyId: i, layer: 1, kind: 1, codes: [0xF2, fcode], delays: [0, 0] });
  }
  // Knobs 1..3: Shift + F17..F24, Ctrl+Shift+F13
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 17, layer: 1, kind: 1, codes: [0xF2, 0x68 + 4], delays: [0, 0] }); // Shift+F17
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 18, layer: 1, kind: 1, codes: [0xF2, 0x68 + 5], delays: [0, 0] }); // Shift+F18
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 19, layer: 1, kind: 1, codes: [0xF2, 0x68 + 6], delays: [0, 0] }); // Shift+F19
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 20, layer: 1, kind: 1, codes: [0xF2, 0x68 + 7], delays: [0, 0] }); // Shift+F20
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 21, layer: 1, kind: 1, codes: [0xF2, 0x68 + 8], delays: [0, 0] }); // Shift+F21
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 22, layer: 1, kind: 1, codes: [0xF2, 0x68 + 9], delays: [0, 0] }); // Shift+F22
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 23, layer: 1, kind: 1, codes: [0xF2, 0x68 + 10], delays: [0, 0] }); // Shift+F23
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 24, layer: 1, kind: 1, codes: [0xF2, 0x68 + 11], delays: [0, 0] }); // Shift+F24
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 25, layer: 1, kind: 1, codes: [0xF1, 0xF2, 0x68], delays: [0, 0, 0] }); // Ctrl+Shift+F13

  // 2. Layer 2:
  // Keys 1..12: Ctrl + F13..F24 (0xF1, 0x68 .. 0x73)
  for(let i=1; i<=12; i++){
    const fcode = 0x68 + (i - 1);
    DRAFT = MODEL.withBinding(DRAFT, { keyId: i, layer: 2, kind: 1, codes: [0xF1, fcode], delays: [0, 0] });
  }
  // Keys 13..16: Ctrl + Shift + F14..F17 (0xF1, 0xF2, 0x68+1 .. 0x68+4)
  for(let i=13; i<=16; i++){
    const fcode = 0x68 + (i - 12);
    DRAFT = MODEL.withBinding(DRAFT, { keyId: i, layer: 2, kind: 1, codes: [0xF1, 0xF2, fcode], delays: [0, 0, 0] });
  }
  // Knobs 1..3: Ctrl + Shift + F18..F24, Ctrl+Alt+F13, Ctrl+Alt+F14
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 17, layer: 2, kind: 1, codes: [0xF1, 0xF2, 0x68 + 5], delays: [0, 0, 0] }); // Ctrl+Shift+F18
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 18, layer: 2, kind: 1, codes: [0xF1, 0xF2, 0x68 + 6], delays: [0, 0, 0] }); // Ctrl+Shift+F19
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 19, layer: 2, kind: 1, codes: [0xF1, 0xF2, 0x68 + 7], delays: [0, 0, 0] }); // Ctrl+Shift+F20
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 20, layer: 2, kind: 1, codes: [0xF1, 0xF2, 0x68 + 8], delays: [0, 0, 0] }); // Ctrl+Shift+F21
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 21, layer: 2, kind: 1, codes: [0xF1, 0xF2, 0x68 + 9], delays: [0, 0, 0] }); // Ctrl+Shift+F22
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 22, layer: 2, kind: 1, codes: [0xF1, 0xF2, 0x68 + 10], delays: [0, 0, 0] }); // Ctrl+Shift+F23
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 23, layer: 2, kind: 1, codes: [0xF1, 0xF2, 0x68 + 11], delays: [0, 0, 0] }); // Ctrl+Shift+F24
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 24, layer: 2, kind: 1, codes: [0xF1, 0xF3, 0x68], delays: [0, 0, 0] }); // Ctrl+Alt+F13
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 25, layer: 2, kind: 1, codes: [0xF1, 0xF3, 0x68 + 1], delays: [0, 0, 0] }); // Ctrl+Alt+F14

  // 3. Layer 3:
  // Keys 1..12: Alt + F13..F24 (0xF3, 0x68 .. 0x73)
  for(let i=1; i<=12; i++){
    const fcode = 0x68 + (i - 1);
    DRAFT = MODEL.withBinding(DRAFT, { keyId: i, layer: 3, kind: 1, codes: [0xF3, fcode], delays: [0, 0] });
  }
  // Keys 13..16: Alt + Shift + F13..F16 (0xF3, 0xF2, 0x68 .. 0x6B)
  for(let i=13; i<=16; i++){
    const fcode = 0x68 + (i - 13);
    DRAFT = MODEL.withBinding(DRAFT, { keyId: i, layer: 3, kind: 1, codes: [0xF3, 0xF2, fcode], delays: [0, 0, 0] });
  }
  // Knobs 1..3: Alt + Shift + F17..F24, Ctrl+Alt+Shift+F13
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 17, layer: 3, kind: 1, codes: [0xF3, 0xF2, 0x68 + 4], delays: [0, 0, 0] }); // Alt+Shift+F17
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 18, layer: 3, kind: 1, codes: [0xF3, 0xF2, 0x68 + 5], delays: [0, 0, 0] }); // Alt+Shift+F18
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 19, layer: 3, kind: 1, codes: [0xF3, 0xF2, 0x68 + 6], delays: [0, 0, 0] }); // Alt+Shift+F19
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 20, layer: 3, kind: 1, codes: [0xF3, 0xF2, 0x68 + 7], delays: [0, 0, 0] }); // Alt+Shift+F20
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 21, layer: 3, kind: 1, codes: [0xF3, 0xF2, 0x68 + 8], delays: [0, 0, 0] }); // Alt+Shift+F21
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 22, layer: 3, kind: 1, codes: [0xF3, 0xF2, 0x68 + 9], delays: [0, 0, 0] }); // Alt+Shift+F22
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 23, layer: 3, kind: 1, codes: [0xF3, 0xF2, 0x68 + 10], delays: [0, 0, 0] }); // Alt+Shift+F23
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 24, layer: 3, kind: 1, codes: [0xF3, 0xF2, 0x68 + 11], delays: [0, 0, 0] }); // Alt+Shift+F24
  DRAFT = MODEL.withBinding(DRAFT, { keyId: 25, layer: 3, kind: 1, codes: [0xF1, 0xF3, 0xF2, 0x68], delays: [0, 0, 0, 0] }); // Ctrl+Alt+Shift+F13

  setDraft(DRAFT);
  msg(CAT.t('msg.planAApplied'), 'ok');
}

function clearAllCurrentLayer(){
  if(!confirm(CAT.t('msg.confirmClear').replace(/\\\\n/g, '\\n'))) return;
  if(!DRAFT) DRAFT=MODEL.emptyConfig();
  for(let i=1;i<=25;i++){
    DRAFT=MODEL.withBinding(DRAFT,LAYER,i,{
      keyId:i,layer:LAYER,kind:1,codes:[],delays:[]
    });
  }
  setDraft(DRAFT);
  msg(CAT.t('msg.layerCleared'), 'ok');
}

function switchLanguage(lang){
  CAT.setLang(lang);
  applyCurrentLang();
}

function applyCurrentLang(){
  const cur = CAT.LANG;
  const labels = { ko: '한국어', en: 'English', ja: '日本語' };
  const el = $('#currentLangLabel');
  if (el) el.textContent = labels[cur] || cur;
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = cur;
  }

  // 1. Apply string table to data-i18n elements
  applyI18n();

  // 2. Re-render layer buttons with translated label
  const lbContainer = $('#layerBtns');
  if (lbContainer && typeof LAYER !== 'undefined') {
    lbContainer.innerHTML = [1, 2, 3].map(n =>
      `<button id="lb${n}" class="${LAYER === n ? 'on' : ''}" onclick="setLayer(${n})">${esc(CAT.t('pad.layer', { n }))}</button>`
    ).join('');
  }

  // 3. Re-render LED mode select options
  if (typeof META !== 'undefined' && META) {
    META.modes = CAT.ledModeList();
    META.wireless = CAT.wirelessNote();
  }
  const modeSelect = $('#ledMode');
  if (modeSelect) {
    const curVal = modeSelect.value;
    modeSelect.innerHTML = '';
    const modes = CAT.ledModeList();
    modes.forEach(m => modeSelect.add(new Option(m.n + ' — ' + (m.label || m.name), m.n)));
    modeSelect.value = curVal;
  }

  // 4. Update pad hint & wireless warning note
  if (typeof syncPadHint === 'function') syncPadHint();
  else {
    const hintEl = $('#padHint');
    if (hintEl) hintEl.innerHTML = CAT.t('pad.hint');
  }
  const wireEl = $('#wirelessNote');
  if (wireEl) wireEl.textContent = CAT.wirelessNote();

  // 5. Update LED bar & LED target text
  if (typeof syncLedBar === 'function') syncLedBar();
  if (typeof syncLedTarget === 'function') syncLedTarget();
  if (typeof refresh === 'function') refresh();
}
"""
assert "function exportApp(){" in src_html, "exportApp not found"
src_html = src_html.replace("function exportApp(){", preset_code + "\nfunction exportApp(){")

# Hook applyCurrentLang() into boot()
assert "applyI18n();" in src_html, "applyI18n() not found"
src_html = src_html.replace("applyI18n();", "applyCurrentLang();", 1)

# Remove duplicate ledMode option appending in boot() (applyCurrentLang already handles it)
boot_led_add = "META.modes.forEach(m=>$('#ledMode').add(new Option(m.n+' — '+(m.label||m.name),m.n)));"
assert boot_led_add in src_html, "boot_led_add not found"
src_html = src_html.replace(boot_led_add, "// ledMode options populated in applyCurrentLang()")

# Safe boot() error reporting (never crash if CAT is null)
boot_catch_old = "msg(CAT.t('msg.startFail',{e:e.message}),'err');"
boot_catch_new = "msg((CAT && CAT.t ? CAT.t('msg.startFail',{e:e.message}) : ('초기화 실패: ' + e.message)),'err');"
src_html = src_html.replace(boot_catch_old, boot_catch_new)

# Inject bundle_js inside <head> right before </head>
injected_bundle = f"<script>\n{bundle_js}\n</script>\n</head>"
assert "</head>" in src_html, "</head> not found"
src_html = src_html.replace("</head>", injected_bundle, 1)

assert "function applyRandomColors()" in src_html, "FATAL: applyRandomColors function missing in generated HTML!"

with open("index.html", "w", encoding="utf-8") as f:
    f.write(src_html)

with open("ui.html", "w", encoding="utf-8") as f:
    f.write(src_html)

print("Successfully generated standalone index.html and ui.html with 100% verified applyRandomColors!")
