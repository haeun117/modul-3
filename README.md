# modul-3

초등 3~6학년 대상 부분 창작용 웹 모듈 MVP입니다.

## MVP 구현 범위
- MusicXML 렌더링: OpenSheetMusicDisplay(OSMD)
- 입력: `assets/score.musicxml` 또는 `assets/score.mxl` + `assets/score.rules.json`
- 랜덤 미션: 서로 떨어진 3마디 선택 (예: 3, 8, 12)
- 잠금 구간: 미션 구간 외 편집 불가
- 편집 도구:
  - 음정 ▲/▼ (스케일 음 + 음역 검증)
  - 리듬 길이 변경 (16분~온음, 음표/쉼표 버튼)
  - 마디 박 합 검증 실패 시 롤백
- 이력: Undo / Redo / Reset
- 미션 구간 재생(단선율)
- 내보내기:
  - `edited.musicxml`
  - `edits.json`

## 파일
- `index.html`: 화면 구조
- `style.css`: 스타일
- `script.js`: 렌더링/편집/검증/내보내기 로직
- `check.py`: Python 점검 스크립트
- `assets/score.musicxml`: 기본 악보 XML
- `assets/score.mxl`: 원본 MXL
- `assets/score.rules.json`: 편집 규칙
- `libs/opensheetmusicdisplay.min.js`: OSMD 라이브러리

## 실행
```bash
cd /Users/jeongha-eun/Desktop/PIUM/modul-3
python3 -m http.server 8000
```
브라우저: `http://localhost:8000`

## 점검
```bash
cd /Users/jeongha-eun/Desktop/PIUM/modul-3
python3 check.py
```
