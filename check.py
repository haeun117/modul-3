#!/usr/bin/env python3
from pathlib import Path
import json
import sys


ROOT = Path(__file__).resolve().parent


def fail(message: str) -> None:
    print(f"[FAIL] {message}")
    sys.exit(1)


def ok(message: str) -> None:
    print(f"[OK] {message}")


def read_required(path: Path) -> str:
    if not path.exists():
        fail(f"{path.name} 파일이 없습니다.")
    text = path.read_text(encoding="utf-8")
    if not text.strip():
        fail(f"{path.name} 파일이 비어 있습니다.")
    ok(f"{path.name} 파일 확인")
    return text


def read_required_binary(path: Path) -> bytes:
    if not path.exists():
        fail(f"{path.name} 파일이 없습니다.")
    data = path.read_bytes()
    if not data:
        fail(f"{path.name} 파일이 비어 있습니다.")
    ok(f"{path.name} 파일 확인")
    return data


def main() -> None:
    print("modul-3 Python 점검 시작")

    index_html = read_required(ROOT / "index.html")
    script_js = read_required(ROOT / "script.js")
    read_required(ROOT / "style.css")
    read_required(ROOT / "libs" / "opensheetmusicdisplay.min.js")
    read_required(ROOT / "assets" / "score.musicxml")
    read_required_binary(ROOT / "assets" / "score.mxl")
    rules_text = read_required(ROOT / "assets" / "score.rules.json")

    required_ids = [
        "score-container",
        "pitch-up-btn",
        "pitch-down-btn",
        "undo-btn",
        "redo-btn",
        "reset-btn",
        "play-btn",
        "pause-btn",
        "stop-btn",
        "play-measure-btn",
        "random-rhythm-btn",
    ]
    for element_id in required_ids:
        if f'id="{element_id}"' not in index_html:
            fail(f'index.html에 id="{element_id}"가 없습니다.')
    ok("index.html 주요 UI id 확인")

    required_snippets = [
        "OpenSheetMusicDisplay",
        "pickThreeSeparatedMeasures",
        "applyPitchEdit",
        "applyDurationOrRestEdit",
        "undoEdit",
        "redoEdit",
        "playScore",
        "pauseScore",
        "playSelectedMeasure",
    ]
    for snippet in required_snippets:
        if snippet not in script_js:
            fail(f"script.js에 필수 로직이 없습니다: {snippet}")
    ok("script.js 핵심 함수 확인")

    rules = json.loads(rules_text)
    required_rule_keys = ["timeSignature", "key", "mode", "editableMeasures", "constraints"]
    for key in required_rule_keys:
        if key not in rules:
            fail(f"rules.json에 필수 키가 없습니다: {key}")

    pitch_measures = rules.get("editableMeasures", {}).get("pitch", [])
    if not isinstance(pitch_measures, list) or len(pitch_measures) == 0:
        fail("rules.json editableMeasures.pitch가 비어 있습니다.")

    allowed_durations = rules.get("constraints", {}).get("allowedDurations", [])
    if not isinstance(allowed_durations, list) or len(allowed_durations) == 0:
        fail("rules.json constraints.allowedDurations가 비어 있습니다.")

    ok("rules.json 기본 스키마 확인")
    print("모든 점검을 통과했습니다.")


if __name__ == "__main__":
    main()
