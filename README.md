# 514c:8850 16키 3노브(16-Key 3-Knob) 매크로 키패드 리눅스 설정 도구

> 🌐 **웹에서 설치 없이 바로 사용하기 (Live WebHID App):**  
> 👉 **[https://elmitash.github.io/macropad-16key-3knob/](https://elmitash.github.io/macropad-16key-3knob/)**  
> *(Chrome, Edge, Whale, Brave 등 WebHID 지원 브라우저에서 키패드를 USB로 연결 후 바로 사용 가능합니다)*

중국산 WCH CH57x 기반 매크로 키패드 (**USB VID: `0x514C`, PID: `0x8850`**) 중 **16개 기계식 스위치(4x4) + 3개 로터리 엔코더(노브)** 제품을 위한 리눅스 전용 및 크로스 플랫폼 롬(ROM) 설정 도구입니다.

기존 12키 4노브 전용 툴(`takamorita/MiniKeyboard-514c-8850`)의 슬롯 불일치 문제를 해결하여, **16개 키와 3개 노브(총 25개 슬롯)** 및 **3개 레이어(총 75개 바인딩)**를 완벽하게 지원합니다.

---

## 💡 주요 특징

1. **측면 레이아웃 변경 키 & 3개 레이어 완벽 지원**:
   - 키패드 측면에 있는 작은 버튼을 누를 때마다 키패드 내부 펌웨어가 **Layer 1 → Layer 2 → Layer 3**으로 순환 전환됩니다.
   - 각 레이어별로 16개 키와 3개 노브의 기능을 완전히 독립적으로 저장할 수 있습니다.
2. **F13 ~ F24 키 지원 & 미할당 키(None) 무반응 처리**:
   - 일반 키보드와 겹치지 않는 특수 기능키인 **F13 ~ F24**를 자유롭게 지정할 수 있습니다. (OBS, 디스코드, 매크로 트리거용으로 최적)
   - 키에 아무것도 할당하지 않으면(None / Unbound), **키를 눌러도 컴퓨터에 아무런 키 입력이 발생하지 않습니다.**
3. **두 가지 사용 환경 제공**:
   - **웹 GUI 도구 (WebHID)**: Chrome, Edge, Brave 등 브라우저에서 마우스 클릭만으로 시각적으로 키/노브/LED를 설정하고 기기에 기록
   - **파이썬 터미널 도구 (`keypad_cli.py`)**: 브라우저 없이 터미널에서 덤프(백업), 복원, 원클릭 F13~F24 프리셋 플래시 지원

---

## 🚀 1. 빠른 시작 (사전 설정: 리눅스 udev 권한)

리눅스에서 일반 사용자(non-root) 권한으로 키패드 USB 및 WebHID에 접근할 수 있도록 udev 룰을 등록합니다:

```bash
# 1. udev 룰 복사
sudo cp 99-macropad-514c-8850.rules /etc/udev/rules.d/

# 2. udev 룰 갱신
sudo udevadm control --reload-rules
sudo udevadm trigger

# 3. 키패드 USB 케이블을 뺐다가 다시 연결합니다.
```

---

## 🖥️ 2. 사용 방법 A: WebHID 웹 GUI 도구 (추천)

Chrome, Edge, Brave 등 WebHID를 지원하는 브라우저에서 시각적으로 설정하는 가장 편리한 방법입니다.

### 실행:
```bash
./keypad_cli.py gui
# 또는 python3 keypad_cli.py gui
```
실행하면 로컬 웹서버가 열리고 브라우저(`http://127.0.0.1:8850`)가 자동으로 실행됩니다.

### 사용 순서:
1. 상단 **[키패드 연결 (WebHID)]** 버튼을 누르고 나타나는 팝업에서 키패드를 선택합니다.
2. 기기 롬에서 현재 설정(Layer 1, 2, 3)을 자동으로 읽어옵니다.
3. 원하는 레이어 탭(**Layer 1 / Layer 2 / Layer 3**)을 선택합니다.
4. **원클릭 프리셋 즉시 적용**:
   - 상단 메뉴의 **[프리셋 ▾] → [3개 레이어 48키 전체 무반응 키 매핑]**을 클릭하면:
     - 3개 레이어(Layer 1, 2, 3)의 모든 키(총 48개)와 3개 노브(총 9개 동작)가 일반 키보드와 겹치지 않는 고유 기능키(`F13~F24` 및 `Shift/Ctrl/Alt` 조합)로 한 번에 자동 매핑됩니다.
     - Linux `input-remapper` 등에서 개별 키를 원하는 단축키나 매크로로 자유롭게 1:1 매핑하여 쓰실 수 있습니다.
5. **RGB LED 색상 및 랜덤 팔레트**:
   - 하단 LED 설정에서 16개 키 전체에 단일 색상을 채우거나, 특정 키를 클릭해 개별 색상을 지정할 수 있습니다.
   - **[🎲 전체 랜덤 색상]** 버튼을 누르면 16개 키에 겹치지 않는 16가지 고유 색상이 아름답게 자동 배분됩니다.
6. 편집이 끝나면 상단의 주황색 **[기기 롬에 쓰기 (Write)]** 버튼을 누르면 키패드 내부 롬에 영구 저장됩니다.

---

## ⌨️ 3. 사용 방법 B: 파이썬 터미널 도구 (`keypad_cli.py`)

GUI 없이 터미널 환경에서 빠르게 백업하거나 설정할 수 있습니다.

### 의존성 설치:
```bash
pip install hidapi
```

### 주요 명령어:

#### 1) 기기 연결 감지
```bash
./keypad_cli.py list
```

#### 2) 원클릭 F13~F24 프리셋 기록 (가장 빠른 방법!)
1~12번 키에 F13~F24를 할당하고, 13~16번 키는 비우며(None), 노브에 유용한 미디어/휠 기능을 즉시 플래시합니다:
```bash
./keypad_cli.py preset-fkeys
```

#### 3) 현재 키패드 롬 설정 백업 (덤프)
```bash
./keypad_cli.py dump -o my_keypad_backup.json
```

#### 4) JSON 설정 파일 기기에 기록 (복원/플래시)
```bash
./keypad_cli.py flash f13_f24_preset.json
```

---

## 🛠️ 4. 사용 방법 C: Rust 기반 `ch57x-keyboard-tool` 사용 시

Rust로 작성된 공식 CLI 도구인 [`kriomant/ch57x-keyboard-tool`](https://github.com/kriomant/ch57x-keyboard-tool) 최신 master 버전을 사용하시는 경우, 본 리포지토리에 포함된 `ch57x_16key_3knob.yaml` 파일을 이용하실 수 있습니다:

```bash
ch57x-keyboard-tool upload ch57x_16key_3knob.yaml
```

---

## 📁 파일 구성 안내

- `index.html` / `ui.html`: 16키 3노브 레이아웃에 맞춘 WebHID GUI 애플리케이션
- `catalog.js`: 16키 3노브 키 ID 매핑(1..25), HID 키코드(F13~F24 포함), 다국어(한국어) 사전
- `pad-wire.js`: `0x514c:0x8850` USB HID 프로토콜 인코딩/디코딩 엔진
- `pad-model.js`: 3개 레이어 데이터 모델 및 롬 변경사항 diff 계산 엔진
- `pad-driver.js`: 브라우저 WebHID API 하드웨어 통신 드라이버
- `keypad_cli.py`: 리눅스 터미널 CLI 유틸리티 및 로컬 GUI 서버
- `f13_f24_preset.json`: F13~F24 및 미할당 키 None 처리 프리셋 파일
- `plan_a_preset.json`: 3개 레이어 48키 + 3개 노브 전체 75개 무반응 단축키 프리셋
- `ch57x_16key_3knob.yaml`: `ch57x-keyboard-tool`용 16키 3노브 설정 템플릿
- `99-macropad-514c-8850.rules`: 리눅스 udev 권한 설정 파일
- `LICENSE`: MIT 라이선스 파일

---

## 📜 라이선스 및 출처 (License & Attribution)

이 프로젝트는 [takamorita/MiniKeyboard-514c-8850](https://github.com/takamorita/MiniKeyboard-514c-8850)의 12키 4노브용 WebHID 코드를 기반으로 하여 16키 3노브 하드웨어 및 리눅스 환경에 맞추어 개작·확장되었습니다.

- **원작자:** takamorita ([MiniKeyboard-514c-8850](https://github.com/takamorita/MiniKeyboard-514c-8850))
- **라이선스:** **MIT License**
  - 원작자의 저작권 고지문과 MIT 라이선스 전문이 `LICENSE` 파일에 보존되어 있습니다.
  - MIT 라이선스 조건에 따라 자유롭게 수정, 배포, 상업적/비상업적 용도로 재배포가 가능합니다.

