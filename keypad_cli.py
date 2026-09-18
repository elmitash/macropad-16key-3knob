#!/usr/bin/env python3
"""
keypad_cli.py - 514c:8850 16-Key 3-Knob Macro Keypad Linux Tool
Supports reading, writing, dumping, and applying presets (F13-F24) via HID.
"""

import sys
import os
import json
import time
import argparse
import http.server
import socketserver
import webbrowser

VENDOR_ID = 0x514C
PRODUCT_ID = 0x8850
USAGE_PAGE = 0xFF00
USAGE = 0x01
REPORT_ID = 0x03
PACKET_SIZE = 64
N_ENTRIES = 25

OP_WRITE = 0xFD
OP_READ = 0xFA
CMD_COMMIT = [0xFD, 0xFE, 0xFF]

# HID Key codes for F13 ~ F24
# F13: 0x68, F14: 0x69, ..., F24: 0x73
F_KEYS = {f"F{i+13}": 0x68 + i for i in range(12)}

# Media Key codes
MEDIA_KEYS = {
    "vol_up": 0x00E9,
    "vol_down": 0x00EA,
    "mute": 0x00E2,
    "play_pause": 0x00CD,
    "next_track": 0x00B5,
    "prev_track": 0x00B6,
}

def get_hid_device():
    try:
        import hid
    except ImportError:
        print("[오류] 'hidapi' 라이브러리가 설치되어 있지 않습니다.", file=sys.stderr)
        print("다음 명령으로 설치해 주세요: pip install hidapi", file=sys.stderr)
        sys.exit(1)

    devices = hid.enumerate(VENDOR_ID, PRODUCT_ID)
    if not devices:
        print(f"[알림] VID {hex(VENDOR_ID)} : PID {hex(PRODUCT_ID)} 키패드가 감지되지 않았습니다.", file=sys.stderr)
        print("  1. 키패드가 USB에 제대로 연결되어 있는지 확인해 주세요.", file=sys.stderr)
        print("  2. 리눅스 권한(udev rules)이 설정되어 있는지 확인해 주세요.", file=sys.stderr)
        print("     (sudo cp 99-macropad-514c-8850.rules /etc/udev/rules.d/ && sudo udevadm control --reload-rules)", file=sys.stderr)
        return None

    # Find the interface matching usagePage 0xFF00
    target_path = None
    for d in devices:
        if d.get('usage_page') == USAGE_PAGE or d.get('interface_number') in (1, 2, 3, 0):
            target_path = d['path']
            break
    if not target_path:
        target_path = devices[0]['path']

    dev = hid.device()
    try:
        dev.open_path(target_path)
    except Exception as e:
        print(f"[오류] 장치를 열 수 없습니다: {e}", file=sys.stderr)
        print("권한 문제일 수 있습니다. 'sudo'로 실행하거나 udev 룰을 적용해 주세요.", file=sys.stderr)
        return None

    return dev

def encode_read_layer(layer):
    packet = [0] * PACKET_SIZE
    packet[0] = OP_READ
    packet[1] = N_ENTRIES
    packet[2] = 0x00
    packet[3] = layer
    return packet

def encode_write_binding(binding):
    packet = [0] * PACKET_SIZE
    packet[0] = OP_WRITE
    packet[1] = binding['keyId']
    packet[2] = binding['layer']
    packet[3] = binding['kind']

    kind = binding['kind']
    if kind == 3: # Mouse
        m = binding.get('mouse', {})
        packet[4] = 1
        packet[5] = 4
        if m.get('mod'): packet[8] = m['mod']
        if m.get('buttons'): packet[11] = m['buttons']
        if m.get('wheel'): packet[20] = m['wheel'] & 0xFF
        return packet

    if kind == 2: # Media
        codes = binding.get('codes', [0])
        usage = codes[0] if codes else 0
        packet[4] = 0
        packet[5] = 2
        packet[8] = usage & 0xFF
        packet[11] = (usage >> 8) & 0xFF
        return packet

    # Keyboard / Macro
    codes = binding.get('codes', [])
    delays = binding.get('delays', [])
    packet[4] = 0
    packet[5] = len(codes)
    for i, code in enumerate(codes):
        if i >= 18: break
        at = 6 + i * 3 + 2
        ms = delays[i] if i < len(delays) else 0
        packet[at - 2] = (ms >> 8) & 0xFF
        packet[at - 1] = ms & 0xFF
        packet[at] = code

    return packet

def encode_commit():
    packet = [0] * PACKET_SIZE
    for i, b in enumerate(CMD_COMMIT):
        packet[i] = b
    return packet

def decode_binding(raw_bytes):
    if len(raw_bytes) < 6 or raw_bytes[0] != OP_READ:
        return None
    key_id = raw_bytes[1]
    layer = raw_bytes[2]
    kind = raw_bytes[3]

    out = {
        'keyId': key_id,
        'layer': layer,
        'kind': kind,
        'codes': [],
        'delays': []
    }

    if kind == 3: # Mouse
        out['mouse'] = {
            'mod': raw_bytes[8] if len(raw_bytes) > 8 else 0,
            'buttons': raw_bytes[11] if len(raw_bytes) > 11 else 0,
            'wheel': (raw_bytes[20] if raw_bytes[20] < 128 else raw_bytes[20] - 256) if len(raw_bytes) > 20 else 0
        }
        return out

    if kind == 2: # Media
        usage = (raw_bytes[8] if len(raw_bytes) > 8 else 0) | ((raw_bytes[11] if len(raw_bytes) > 11 else 0) << 8)
        if usage:
            out['codes'] = [usage]
            out['delays'] = [0]
        return out

    n_keys = raw_bytes[5]
    for i in range(n_keys):
        at = 6 + i * 3 + 2
        if at >= len(raw_bytes): break
        code = raw_bytes[at]
        if code == 0: break
        ms = (raw_bytes[at - 2] << 8) | raw_bytes[at - 1]
        out['codes'].append(code)
        out['delays'].append(ms)

    return out

def read_device_config(dev):
    config = {"layers": {}, "version": 1, "device": "514c:8850-16k3k"}
    for layer in [1, 2, 3]:
        read_pkt = [REPORT_ID] + encode_read_layer(layer)
        dev.write(read_pkt)
        bindings = []
        for _ in range(N_ENTRIES):
            res = dev.read(65, timeout_ms=500)
            if not res:
                break
            # Skip report ID if present
            data = res[1:] if len(res) == 65 and res[0] == REPORT_ID else res
            b = decode_binding(data)
            if b:
                bindings.append(b)
        config["layers"][str(layer)] = bindings
        time.sleep(0.1)
    return config

def write_device_config(dev, config):
    for layer_str, bindings in config.get("layers", {}).items():
        layer = int(layer_str)
        print(f"[*] Layer {layer} 데이터 기록 중...")
        for b in bindings:
            b['layer'] = layer
            pkt = [REPORT_ID] + encode_write_binding(b)
            dev.write(pkt)
            time.sleep(0.04)

        # Commit layer
        commit_pkt = [REPORT_ID] + encode_commit()
        dev.write(commit_pkt)
        time.sleep(0.3)

    print("[✔] 기기 롬(Flash/EEPROM)에 성공적으로 저장되었습니다!")


def encode_led_init():
    pkt = [0] * PACKET_SIZE
    pkt[0], pkt[1], pkt[2] = 0xFB, 0xFB, 0xFB
    return pkt

def encode_leds(layer, mode, rgb_colors):
    pkt = [0] * PACKET_SIZE
    pkt[0] = 0xFE
    pkt[1] = 0xB0
    pkt[2] = layer - 1
    pkt[3] = mode
    for i in range(16):
        r, g, b = rgb_colors[i] if i < len(rgb_colors) else (0, 0, 0)
        pkt[4 + i * 3] = r
        pkt[5 + i * 3] = g
        pkt[6 + i * 3] = b
    return pkt


def make_random_rgb_list():
    import random
    base_offset = random.randint(0, 359)
    unique_hues = [(base_offset + int(i * (360 / 16))) % 360 for i in range(16)]
    random.shuffle(unique_hues)
    rgb_list = []
    for h in unique_hues:
        s = 0.95
        l = 0.52
        c = (1 - abs(2 * l - 1)) * s
        x = c * (1 - abs((h / 60) % 2 - 1))
        m = l - c / 2
        if h < 60: r, g, b = c, x, 0
        elif h < 120: r, g, b = x, c, 0
        elif h < 180: r, g, b = 0, c, x
        elif h < 240: r, g, b = 0, x, c
        elif h < 300: r, g, b = x, 0, c
        else: r, g, b = c, 0, x
        rgb_list.append([round((r + m) * 255), round((g + m) * 255), round((b + m) * 255)])
    return rgb_list

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    if len(hex_str) == 6:
        return [int(hex_str[i:i+2], 16) for i in (0, 2, 4)]
    return [255, 255, 255]

def make_plan_a_preset():
    """
    Plan A: 75-Action (48 Keys + 27 Knob Actions) Full No-Conflict Matrix
    Layer 1:
      Keys 1..12: F13..F24
      Keys 13..16: Shift + F13..F16
      Knob 1 (CCW, Click, CW): Shift + F17, F18, F19
      Knob 2 (CCW, Click, CW): Shift + F20, F21, F22
      Knob 3 (CCW, Click, CW): Shift + F23, F24, Ctrl+Shift+F13
    Layer 2:
      Keys 1..12: Ctrl + F13..F24
      Keys 13..16: Ctrl + Shift + F14..F17
      Knob 1 (CCW, Click, CW): Ctrl + Shift + F18, F19, F20
      Knob 2 (CCW, Click, CW): Ctrl + Shift + F21, F22, F23
      Knob 3 (CCW, Click, CW): Ctrl + Shift + F24, Ctrl+Alt+F13, Ctrl+Alt+F14
    Layer 3:
      Keys 1..12: Alt + F13..F24
      Keys 13..16: Alt + Shift + F13..F16
      Knob 1 (CCW, Click, CW): Alt + Shift + F17, F18, F19
      Knob 2 (CCW, Click, CW): Alt + Shift + F20, F21, F22
      Knob 3 (CCW, Click, CW): Alt + Shift + F23, F24, Ctrl+Alt+Shift+F13
    """
    MOD_CTRL = 0xF1
    MOD_SHIFT = 0xF2
    MOD_ALT = 0xF3

    preset = {"layers": {}, "version": 1, "device": "514c:8850-16k3k"}
    for layer in [1, 2, 3]:
        bindings = []
        if layer == 1:
            # Keys 1..12: F13..F24
            for k in range(1, 13):
                bindings.append({"keyId": k, "layer": 1, "kind": 1, "codes": [0x68 + (k - 1)], "delays": [0]})
            # Keys 13..16: Shift + F13..F16
            for k in range(13, 17):
                bindings.append({"keyId": k, "layer": 1, "kind": 1, "codes": [MOD_SHIFT, 0x68 + (k - 13)], "delays": [0, 0]})
            # Knob 1 (17..19): Shift + F17..F19
            bindings.append({"keyId": 17, "layer": 1, "kind": 1, "codes": [MOD_SHIFT, 0x68 + 4], "delays": [0, 0]})
            bindings.append({"keyId": 18, "layer": 1, "kind": 1, "codes": [MOD_SHIFT, 0x68 + 5], "delays": [0, 0]})
            bindings.append({"keyId": 19, "layer": 1, "kind": 1, "codes": [MOD_SHIFT, 0x68 + 6], "delays": [0, 0]})
            # Knob 2 (20..22): Shift + F20..F22
            bindings.append({"keyId": 20, "layer": 1, "kind": 1, "codes": [MOD_SHIFT, 0x68 + 7], "delays": [0, 0]})
            bindings.append({"keyId": 21, "layer": 1, "kind": 1, "codes": [MOD_SHIFT, 0x68 + 8], "delays": [0, 0]})
            bindings.append({"keyId": 22, "layer": 1, "kind": 1, "codes": [MOD_SHIFT, 0x68 + 9], "delays": [0, 0]})
            # Knob 3 (23..25): Shift + F23..F24, Ctrl+Shift+F13
            bindings.append({"keyId": 23, "layer": 1, "kind": 1, "codes": [MOD_SHIFT, 0x68 + 10], "delays": [0, 0]})
            bindings.append({"keyId": 24, "layer": 1, "kind": 1, "codes": [MOD_SHIFT, 0x68 + 11], "delays": [0, 0]})
            bindings.append({"keyId": 25, "layer": 1, "kind": 1, "codes": [MOD_CTRL, MOD_SHIFT, 0x68], "delays": [0, 0, 0]})

        elif layer == 2:
            # Keys 1..12: Ctrl + F13..F24
            for k in range(1, 13):
                bindings.append({"keyId": k, "layer": 2, "kind": 1, "codes": [MOD_CTRL, 0x68 + (k - 1)], "delays": [0, 0]})
            # Keys 13..16: Ctrl + Shift + F14..F17
            for k in range(13, 17):
                bindings.append({"keyId": k, "layer": 2, "kind": 1, "codes": [MOD_CTRL, MOD_SHIFT, 0x68 + (k - 12)], "delays": [0, 0, 0]})
            # Knob 1 (17..19): Ctrl + Shift + F18..F20
            bindings.append({"keyId": 17, "layer": 2, "kind": 1, "codes": [MOD_CTRL, MOD_SHIFT, 0x68 + 5], "delays": [0, 0, 0]})
            bindings.append({"keyId": 18, "layer": 2, "kind": 1, "codes": [MOD_CTRL, MOD_SHIFT, 0x68 + 6], "delays": [0, 0, 0]})
            bindings.append({"keyId": 19, "layer": 2, "kind": 1, "codes": [MOD_CTRL, MOD_SHIFT, 0x68 + 7], "delays": [0, 0, 0]})
            # Knob 2 (20..22): Ctrl + Shift + F21..F23
            bindings.append({"keyId": 20, "layer": 2, "kind": 1, "codes": [MOD_CTRL, MOD_SHIFT, 0x68 + 8], "delays": [0, 0, 0]})
            bindings.append({"keyId": 21, "layer": 2, "kind": 1, "codes": [MOD_CTRL, MOD_SHIFT, 0x68 + 9], "delays": [0, 0, 0]})
            bindings.append({"keyId": 22, "layer": 2, "kind": 1, "codes": [MOD_CTRL, MOD_SHIFT, 0x68 + 10], "delays": [0, 0, 0]})
            # Knob 3 (23..25): Ctrl + Shift + F24, Ctrl+Alt+F13, Ctrl+Alt+F14
            bindings.append({"keyId": 23, "layer": 2, "kind": 1, "codes": [MOD_CTRL, MOD_SHIFT, 0x68 + 11], "delays": [0, 0, 0]})
            bindings.append({"keyId": 24, "layer": 2, "kind": 1, "codes": [MOD_CTRL, MOD_ALT, 0x68], "delays": [0, 0, 0]})
            bindings.append({"keyId": 25, "layer": 2, "kind": 1, "codes": [MOD_CTRL, MOD_ALT, 0x68 + 1], "delays": [0, 0, 0]})

        elif layer == 3:
            # Keys 1..12: Alt + F13..F24
            for k in range(1, 13):
                bindings.append({"keyId": k, "layer": 3, "kind": 1, "codes": [MOD_ALT, 0x68 + (k - 1)], "delays": [0, 0]})
            # Keys 13..16: Alt + Shift + F13..F16
            for k in range(13, 17):
                bindings.append({"keyId": k, "layer": 3, "kind": 1, "codes": [MOD_ALT, MOD_SHIFT, 0x68 + (k - 13)], "delays": [0, 0, 0]})
            # Knob 1 (17..19): Alt + Shift + F17..F19
            bindings.append({"keyId": 17, "layer": 3, "kind": 1, "codes": [MOD_ALT, MOD_SHIFT, 0x68 + 4], "delays": [0, 0, 0]})
            bindings.append({"keyId": 18, "layer": 3, "kind": 1, "codes": [MOD_ALT, MOD_SHIFT, 0x68 + 5], "delays": [0, 0, 0]})
            bindings.append({"keyId": 19, "layer": 3, "kind": 1, "codes": [MOD_ALT, MOD_SHIFT, 0x68 + 6], "delays": [0, 0, 0]})
            # Knob 2 (20..22): Alt + Shift + F20..F22
            bindings.append({"keyId": 20, "layer": 3, "kind": 1, "codes": [MOD_ALT, MOD_SHIFT, 0x68 + 7], "delays": [0, 0, 0]})
            bindings.append({"keyId": 21, "layer": 3, "kind": 1, "codes": [MOD_ALT, MOD_SHIFT, 0x68 + 8], "delays": [0, 0, 0]})
            bindings.append({"keyId": 22, "layer": 3, "kind": 1, "codes": [MOD_ALT, MOD_SHIFT, 0x68 + 9], "delays": [0, 0, 0]})
            # Knob 3 (23..25): Alt + Shift + F23..F24, Ctrl+Alt+Shift+F13
            bindings.append({"keyId": 23, "layer": 3, "kind": 1, "codes": [MOD_ALT, MOD_SHIFT, 0x68 + 10], "delays": [0, 0, 0]})
            bindings.append({"keyId": 24, "layer": 3, "kind": 1, "codes": [MOD_ALT, MOD_SHIFT, 0x68 + 11], "delays": [0, 0, 0]})
            bindings.append({"keyId": 25, "layer": 3, "kind": 1, "codes": [MOD_CTRL, MOD_ALT, MOD_SHIFT, 0x68], "delays": [0, 0, 0, 0]})

        preset["layers"][str(layer)] = bindings

    return preset

def make_fkeys_preset():
    """
    Key 1..12: F13..F24
    Key 13..16: Empty (None - 아무 동작 안 함)
    Knob 1: Volume Down / Mute / Volume Up
    Knob 2: Wheel Down / Middle Click / Wheel Up
    Knob 3: Prev Track / Play-Pause / Next Track
    """
    preset = {"layers": {}, "version": 1, "device": "514c:8850-16k3k"}
    for layer in [1, 2, 3]:
        bindings = []
        # Keys 1..12: F13..F24
        for k in range(1, 13):
            f_code = 0x68 + (k - 1)
            bindings.append({
                "keyId": k, "layer": layer, "kind": 1,
                "codes": [f_code], "delays": [0]
            })
        # Keys 13..16: Unbound (None)
        for k in range(13, 17):
            bindings.append({
                "keyId": k, "layer": layer, "kind": 1,
                "codes": [], "delays": []
            })
        # Knob 1: VolDown, Mute, VolUp
        bindings.append({"keyId": 17, "layer": layer, "kind": 2, "codes": [MEDIA_KEYS["vol_down"]], "delays": [0]})
        bindings.append({"keyId": 18, "layer": layer, "kind": 2, "codes": [MEDIA_KEYS["mute"]], "delays": [0]})
        bindings.append({"keyId": 19, "layer": layer, "kind": 2, "codes": [MEDIA_KEYS["vol_up"]], "delays": [0]})
        # Knob 2: WheelDown, MiddleClick, WheelUp
        bindings.append({"keyId": 20, "layer": layer, "kind": 3, "codes": [], "delays": [], "mouse": {"mod": 0, "buttons": 0, "wheel": -1}})
        bindings.append({"keyId": 21, "layer": layer, "kind": 3, "codes": [], "delays": [], "mouse": {"mod": 0, "buttons": 4, "wheel": 0}})
        bindings.append({"keyId": 22, "layer": layer, "kind": 3, "codes": [], "delays": [], "mouse": {"mod": 0, "buttons": 0, "wheel": 1}})
        # Knob 3: PrevTrack, PlayPause, NextTrack
        bindings.append({"keyId": 23, "layer": layer, "kind": 2, "codes": [MEDIA_KEYS["prev_track"]], "delays": [0]})
        bindings.append({"keyId": 24, "layer": layer, "kind": 2, "codes": [MEDIA_KEYS["play_pause"]], "delays": [0]})
        bindings.append({"keyId": 25, "layer": layer, "kind": 2, "codes": [MEDIA_KEYS["next_track"]], "delays": [0]})

        preset["layers"][str(layer)] = bindings

    return preset

def main():
    parser = argparse.ArgumentParser(description="514c:8850 16-Key 3-Knob Macro Keypad Linux Tool")
    subparsers = parser.add_subparsers(dest="command", help="사용할 명령")

    # list
    subparsers.add_parser("list", help="연결된 키패드 감지 및 상태 확인")

    # dump
    dump_p = subparsers.add_parser("dump", help="기기 롬의 현재 설정을 JSON 파일로 백업")
    dump_p.add_argument("-o", "--output", default="keypad_backup.json", help="저장할 JSON 파일 경로")

    # flash
    flash_p = subparsers.add_parser("flash", help="JSON 설정 파일을 기기 롬에 기록")
    flash_p.add_argument("config_file", help="기록할 JSON 설정 파일")

    # preset-plan-a
    subparsers.add_parser("preset-plan-a", help="[추천] 3개 레이어 48키 전체를 F13~F24 및 조합키로 즉시 기기에 기록 (방안 A)")
    # preset-fkeys
    subparsers.add_parser("preset-fkeys", help="1~12번 키에 F13~F24를 할당하고 13~16번은 비움(None)으로 즉시 기기에 기록")
    # led
    led_p = subparsers.add_parser("led", help="키패드 LED 모드 및 색상 변경 (0:소등, 1:상시점등(LED켜기))")
    led_p.add_argument("mode", type=int, choices=range(6), help="LED 모드 번호 (0..5)")
    led_p.add_argument("color", nargs="?", default="#4a9eff", help="HEX 색상 코드 (예: #ff0000, 기본 #4a9eff)")
    led_p.add_argument("--layer", type=int, default=1, choices=[1, 2, 3], help="적용할 레이어 (기본 1)")


    # serve
    serve_p = subparsers.add_parser("gui", help="웹 브라우저 GUI 설정 도구 실행 (로컬 웹서버)")
    serve_p.add_argument("-p", "--port", type=int, default=8850, help="웹서버 포트 (기본 8850)")

    args = parser.parse_args()

    if not args.command or args.command == "gui":
        port = getattr(args, 'port', 8850)
        web_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(web_dir)
        handler = http.server.SimpleHTTPRequestHandler
        with socketserver.TCPServer(("", port), handler) as httpd:
            url = f"http://127.0.0.1:{port}/"
            print(f"[✔] WebHID GUI 설정 도구가 실행되었습니다: {url}")
            print("    (Chrome, Edge, Brave 등 WebHID 지원 브라우저에서 접속해 주세요)")
            print("    종료하려면 Ctrl+C 를 누르세요.")
            try:
                webbrowser.open(url)
            except Exception:
                pass
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n웹서버를 종료합니다.")
        return

    if args.command == "list":
        dev = get_hid_device()
        if dev:
            print("[✔] 514c:8850 16키 3노브 키패드가 정상적으로 감지되었습니다.")
            dev.close()
        return

    if args.command == "dump":
        dev = get_hid_device()
        if not dev: return
        print("[*] 기기 롬에서 설정을 읽어오는 중...")
        cfg = read_device_config(dev)
        dev.close()
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(cfg, f, indent=2, ensure_ascii=False)
        print(f"[✔] 설정이 성공적으로 저장되었습니다: {args.output}")
        return

    if args.command == "flash":
        if not os.path.exists(args.config_file):
            print(f"[오류] 파일이 존재하지 않습니다: {args.config_file}", file=sys.stderr)
            return
        with open(args.config_file, "r", encoding="utf-8") as f:
            cfg = json.load(f)
        dev = get_hid_device()
        if not dev: return
        write_device_config(dev, cfg)
        dev.close()
        return

    if args.command == "led":
        dev = get_hid_device()
        if not dev: return
        if args.color.lower() in ("random", "rand", "rainbow"):
            rgb_list = make_random_rgb_list()
            color_desc = "랜덤 무지개 색상"
        else:
            rgb = hex_to_rgb(args.color)
            rgb_list = [rgb] * 16
            color_desc = args.color
        print(f"[*] Layer {args.layer} 에 LED 모드 {args.mode}, {color_desc} 기록 중...")
        # 1. LED Init
        dev.write([REPORT_ID] + encode_led_init())
        time.sleep(0.3)
        # 2. Write LEDs
        dev.write([REPORT_ID] + encode_leds(args.layer, args.mode, rgb_list))
        time.sleep(0.3)
        # 3. Commit
        dev.write([REPORT_ID] + encode_commit())
        time.sleep(0.5)
        dev.close()
        print(f"[✔] LED 모드 {args.mode} ({color_desc}) 가 기기에 즉시 저장되었습니다!")
        return

    if args.command == "preset-plan-a":
        print("[*] ⭐ 방안 A (48키 전체 무반응 키 매핑) 프리셋을 생성합니다...")
        print("  - Layer 1: 키 1~12 (F13~F24) / 키 13~16 (Shift + F13~F16)")
        print("  - Layer 2: 키 1~12 (Ctrl + F13~F24) / 키 13~16 (Ctrl + Shift + F13~F16)")
        print("  - Layer 3: 키 1~12 (Alt + F13~F24) / 키 13~16 (Alt + Shift + F13~F16)")
        print("  - 노브 1~3: 볼륨 조절 / 마우스 휠 / 트랙 제어")
        preset = make_plan_a_preset()

        dev = get_hid_device()
        if not dev: return
        write_device_config(dev, preset)
        dev.close()
        print("[✔] ⭐ 방안 A (48키 전체 무반응 키) 프리셋이 키패드 롬에 완벽하게 저장되었습니다!")
        return

    if args.command == "preset-fkeys":
        print("[*] F13~F24 프리셋을 생성합니다...")
        print("  - 키 1~12 : F13 ~ F24 할당")
        print("  - 키 13~16: 비움 (None - 눌러도 아무 일도 일어나지 않음)")
        print("  - 노브 1~3: 볼륨 조절 / 마우스 휠 / 트랙 제어")
        print("  - 레이어 1, 2, 3 모두 동일하게 적용 (측면 버튼으로 언제든 전환 가능)")
        preset = make_fkeys_preset()

        dev = get_hid_device()
        if not dev: return
        write_device_config(dev, preset)
        dev.close()
        print("[✔] F13~F24 프리셋이 키패드 롬에 즉시 반영되었습니다!")

if __name__ == "__main__":
    main()
