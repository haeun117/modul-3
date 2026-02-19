const appState = {
  rules: null,
  osmd: null,
  xmlTextOriginal: "",
  xmlDoc: null,
  noteModels: [],
  measureModels: [],
  selectedNoteId: null,
  allowedScaleMidis: [],
  undoStack: [],
  redoStack: [],
  editLogs: [],
  playbackState: "stopped",
  playbackEventIds: [],
  playbackStopEventId: null,
  playbackTotalSec: 0,
  playbackActiveNoteId: null,
  playbackDirty: true,
  playbackContext: { type: "score", measureNumber: null },
  playbackPausedAtSec: 0,
  metronomeEnabled: false,
  metronomeSynth: null,
  allowedMidiMin: 12,
  allowedMidiMax: 108,
  tempo: 90,
  tempoUserSet: false,
  highlightRedrawTimers: [],
  highlightObserver: null,
  highlightIntervalId: null,
  scoreClickBound: false,
  activeMeasureNumber: null,
  measureHitBoxes: [],
  measureRegions: [],
  samplers: new Map(),
  currentInstrumentId: "acoustic_piano",
  currentSongId: "gabaram",
  metronomeRepeatId: null,
  metronomeBeatCounter: 0,
  lastRandomRhythmByMeasure: new Map(),
  originalPitchMidiByNoteId: new Map(),
  lyricEditMode: false,
  selectedLyricNoteId: null,
  dragPitch: { active: false, pointerId: null, noteId: null, lastY: 0, pendingSteps: 0, processing: false, moved: false },
  homeGrade: 3,
  homeDecorResizeTimer: null,
  songDrafts: new Map(),
  loadedXmlBaseline: "",
};

const dom = {
  homeScreen: document.getElementById("home-screen"),
  homeMap: document.querySelector(".home-map"),
  homeDecorLayer: document.getElementById("home-decor-layer"),
  editorScreen: document.getElementById("editor-screen"),
  goHomeButton: document.getElementById("go-home-btn"),
  saveOverlay: document.getElementById("save-overlay"),
  overlaySaveButton: document.getElementById("overlay-save-btn"),
  overlayDiscardButton: document.getElementById("overlay-discard-btn"),
  overlayCancelButton: document.getElementById("overlay-cancel-btn"),
  stageButtons: Array.from(document.querySelectorAll(".stage-btn[data-grade]")),
  scoreContainer: document.getElementById("score-container"),
  songSelect: document.getElementById("song-select"),
  songKey: document.getElementById("song-key"),
  songTime: document.getElementById("song-time"),
  missionRange: document.getElementById("mission-range"),
  scoreBottomIconWrap: document.getElementById("score-bottom-icon-wrap"),
  scoreBottomIcon: document.getElementById("score-bottom-icon"),
  selectedNoteView: document.getElementById("selected-note-view"),
  durationButtons: document.getElementById("duration-buttons"),
  toast: document.getElementById("toast"),
  pitchUpButton: document.getElementById("pitch-up-btn"),
  pitchDownButton: document.getElementById("pitch-down-btn"),
  lyricPenButton: document.getElementById("lyric-pen-btn"),
  lyricPad: document.getElementById("lyric-pad"),
  lyricPadPreviewChar: document.getElementById("lyric-pad-preview-char"),
  lyricPadApplyButton: document.getElementById("lyric-pad-apply-btn"),
  lyricKeyboard: document.getElementById("lyric-keyboard"),
  undoButton: document.getElementById("undo-btn"),
  redoButton: document.getElementById("redo-btn"),
  resetButton: document.getElementById("reset-btn"),
  playButton: document.getElementById("play-btn"),
  pauseButton: document.getElementById("pause-btn"),
  stopButton: document.getElementById("stop-btn"),
  exportXmlButton: document.getElementById("export-xml-btn"),
  exportLogsButton: document.getElementById("export-logs-btn"),
  randomRhythmButton: document.getElementById("random-rhythm-btn"),
  instrumentSelect: document.getElementById("instrument-select"),
  tempoSlider: document.getElementById("tempo-slider"),
  tempoValue: document.getElementById("tempo-value"),
  metronomeToggleButton: document.getElementById("metronome-toggle-btn"),
};

const BLOCKED_LYRIC_KEYWORDS = [
  "시발",
  "씨발",
  "병신",
  "개새끼",
  "좆",
  "꺼져",
  "죽어",
  "섹스",
  "야동",
  "강간",
  "살인",
  "자살",
  "테러",
  "흑인",
  "짱깨",
  "게이",
];

const HANGUL_CHO = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const HANGUL_JUNG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
const HANGUL_JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const SHIFT_MAP = { "ㄱ": "ㄲ", "ㄷ": "ㄸ", "ㅂ": "ㅃ", "ㅅ": "ㅆ", "ㅈ": "ㅉ", "ㅐ": "ㅒ", "ㅔ": "ㅖ" };
const KEYBOARD_ROWS = [
  ["ㅂ", "ㅈ", "ㄷ", "ㄱ", "ㅅ", "ㅛ", "ㅕ", "ㅑ", "ㅐ", "ㅔ"],
  ["ㅁ", "ㄴ", "ㅇ", "ㄹ", "ㅎ", "ㅗ", "ㅓ", "ㅏ", "ㅣ"],
  ["⇧", "ㅋ", "ㅌ", "ㅊ", "ㅍ", "ㅠ", "ㅜ", "ㅡ", "⌫"],
];

const DURATION_BEATS = {
  whole: 4,
  half: 2,
  quarter: 1,
  eighth: 0.5,
  "16th": 0.25,
};

const PALETTE_DURATION_ORDER = ["16th", "eighth", "quarter", "half", "whole"];

const SEMITONE_BY_KEY = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE = [0, 2, 3, 5, 7, 8, 10];

const SHARP_PC_TO_PITCH = {
  0: { step: "C", alter: 0 },
  1: { step: "C", alter: 1 },
  2: { step: "D", alter: 0 },
  3: { step: "D", alter: 1 },
  4: { step: "E", alter: 0 },
  5: { step: "F", alter: 0 },
  6: { step: "F", alter: 1 },
  7: { step: "G", alter: 0 },
  8: { step: "G", alter: 1 },
  9: { step: "A", alter: 0 },
  10: { step: "A", alter: 1 },
  11: { step: "B", alter: 0 },
};

const FLAT_PC_TO_PITCH = {
  0: { step: "C", alter: 0 },
  1: { step: "D", alter: -1 },
  2: { step: "D", alter: 0 },
  3: { step: "E", alter: -1 },
  4: { step: "E", alter: 0 },
  5: { step: "F", alter: 0 },
  6: { step: "G", alter: -1 },
  7: { step: "G", alter: 0 },
  8: { step: "A", alter: -1 },
  9: { step: "A", alter: 0 },
  10: { step: "B", alter: -1 },
  11: { step: "B", alter: 0 },
};

const DURATION_LABELS = {
  "16th": "16분",
  eighth: "8분",
  quarter: "4분",
  half: "2분",
  whole: "온음",
};

const SAMPLE_INSTRUMENTS = [
  { id: "acoustic_piano", name: "피아노", baseUrl: "./assets/INST_SAMPLE/acoustic_piano/none/", notes: [24, 36, 48, 60, 72, 84, 96, 108], suffix: "_127.flac" },
  { id: "organ", name: "오르간", baseUrl: "./assets/INST_SAMPLE/organ/organ/none/", notes: [36, 48, 60, 72, 84, 96], suffix: "_127_1.flac" },
  { id: "sax", name: "색소폰", baseUrl: "./assets/INST_SAMPLE/sax/long/", notes: [49, 60, 72, 81], suffix: "_127_1.flac" },
  { id: "guitar", name: "기타", baseUrl: "./assets/INST_SAMPLE/guitar/electric_guitar/open/", notes: [40, 48, 59, 72, 80], suffix: "_127_3.flac" },
  { id: "bass", name: "베이스", baseUrl: "./assets/INST_SAMPLE/bass/electric_bass/open/", notes: [26, 37, 49, 61], suffix: "_125_4.flac" },
  { id: "trumpet", name: "트럼펫", baseUrl: "./assets/INST_SAMPLE/brass_bigband/trumpet/long/", notes: [52, 60, 72, 84], suffix: "_127_1.flac" },
  { id: "marimba", name: "마림바", baseUrl: "./assets/INST_SAMPLE/marimba/none/", notes: [44, 50, 56, 59, 62, 65, 68, 71, 74, 77, 80, 83, 86, 89, 92, 96], suffix: "_127_3.flac" },
  { id: "synth", name: "신스", baseUrl: "./assets/INST_SAMPLE/synth/lead/01/", notes: [36, 48, 60, 72, 84, 96, 108, 120], suffix: "_127_1.flac" },
];

const SONG_OPTIONS = [
  {
    id: "gabaram",
    name: "가을바람",
    grade: 3,
    rulesPath: "./assets/score.rules.json",
    musicxmlPath: "./assets/score.musicxml",
    mxlPath: "./assets/score.mxl",
  },
  {
    id: "3_dotori",
    name: "도토리",
    grade: 3,
    mxlPath: "./assets/songs/3_dotori.mxl",
  },
  {
    id: "4_namulnorae",
    name: "나물노래",
    grade: 4,
    mxlPath: "./assets/songs/4_namulnorae.mxl",
  },
  {
    id: "4_jongdalsaee_haru",
    name: "종달새의 하루",
    grade: 4,
    mxlPath: "./assets/songs/4_jongdalsaee_haru.mxl",
  },
  {
    id: "5_doremisong",
    name: "도레미송",
    grade: 5,
    mxlPath: "./assets/songs/5_doremisong.mxl",
  },
];

const SCORE_BOTTOM_ICONS = {
  gabaram: { src: "./assets/score-icons/autumn2.png", alt: "가을바람 아이콘" },
  "3_dotori": { src: "./assets/score-icons/acorn.png", alt: "도토리 아이콘" },
  "4_jongdalsaee_haru": { src: "./assets/score-icons/bird.png", alt: "종달새의 하루 아이콘" },
  "4_namulnorae": { src: "./assets/score-icons/herbs.png", alt: "나물노래 아이콘" },
  "5_doremisong": { src: "./assets/score-icons/doremi.png", alt: "도레미송 아이콘" },
};

const SCORE_ICON_X_BY_SONG = {
  "4_namulnorae": { desktop: -430, mobile: -355 },
  "4_jongdalsaee_haru": { desktop: -365, mobile: -300 },
  "5_doremisong": { desktop: -430, mobile: -355 },
};

const SHARP_ORDER = ["F", "C", "G", "D", "A", "E", "B"];
const FLAT_ORDER = ["B", "E", "A", "D", "G", "C", "F"];

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("show");
  clearTimeout(showToast.timerId);
  showToast.timerId = setTimeout(() => {
    dom.toast.classList.remove("show");
  }, 1700);
}

function parsePitchText(pitchText) {
  const match = /^([A-G])([#b]?)(\d)$/.exec(pitchText);
  if (!match) {
    throw new Error(`Invalid pitch: ${pitchText}`);
  }
  const [, step, accidental, octaveText] = match;
  const alter = accidental === "#" ? 1 : accidental === "b" ? -1 : 0;
  return { step, alter, octave: Number(octaveText) };
}

function getKeySignatureAlter(step, fifths = 0) {
  if (!Number.isFinite(fifths) || fifths === 0) return 0;
  if (fifths > 0) {
    return SHARP_ORDER.slice(0, fifths).includes(step) ? 1 : 0;
  }
  return FLAT_ORDER.slice(0, Math.abs(fifths)).includes(step) ? -1 : 0;
}

function resolvePitchAlter(pitch, keyFifths = 0) {
  if (pitch.alter === null || pitch.alter === undefined) {
    return getKeySignatureAlter(pitch.step, keyFifths);
  }
  return pitch.alter;
}

function pitchToMidi(pitch, keyFifths = 0) {
  const stepToSemitone = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  return (pitch.octave + 1) * 12 + stepToSemitone[pitch.step] + resolvePitchAlter(pitch, keyFifths);
}

function midiToPitch(midi, key, keyFifths = 0) {
  const preferFlats = keyFifths < 0 || key.includes("b");
  const map = preferFlats ? FLAT_PC_TO_PITCH : SHARP_PC_TO_PITCH;
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const base = map[pc];
  const keyAlter = getKeySignatureAlter(base.step, keyFifths);
  const alter = base.alter === keyAlter ? null : base.alter;
  return { step: base.step, alter, octave };
}

function pitchToText(pitch) {
  if (!pitch) return "rest";
  const acc = pitch.alter === 1 ? "#" : pitch.alter === -1 ? "b" : "";
  return `${pitch.step}${acc}${pitch.octave}`;
}

function parseTimeSignature(sigText) {
  const [beatsText, beatTypeText] = sigText.split("/");
  return { beats: Number(beatsText), beatType: Number(beatTypeText) };
}

function durationTypeToDivisions(durationType, divisions) {
  const beats = DURATION_BEATS[durationType];
  if (!beats) throw new Error(`Unsupported duration: ${durationType}`);
  const value = beats * divisions;
  if (!Number.isInteger(value)) {
    throw new Error(`${durationType}는 현재 마디 단위(divisions=${divisions})에서 표현할 수 없습니다.`);
  }
  return value;
}

function getAvailableDurationTypesForDivisions(divisions) {
  return PALETTE_DURATION_ORDER.filter((durationType) => {
    const beats = DURATION_BEATS[durationType];
    if (!beats) return false;
    const value = beats * divisions;
    return Number.isInteger(value);
  });
}

function loadSnapshot() {
  return {
    xmlText: new XMLSerializer().serializeToString(appState.xmlDoc),
    selectedNoteId: appState.selectedNoteId,
    editLogs: structuredClone(appState.editLogs),
  };
}

function restoreSnapshot(snapshot) {
  appState.xmlDoc = new DOMParser().parseFromString(snapshot.xmlText, "application/xml");
  appState.selectedNoteId = snapshot.selectedNoteId;
  appState.editLogs = structuredClone(snapshot.editLogs);
}

function pushUndoSnapshot() {
  appState.undoStack.push(loadSnapshot());
  if (appState.undoStack.length > 200) appState.undoStack.shift();
}

function clearRedoStack() {
  appState.redoStack = [];
}

function getMeasureChildrenByTag(measureNode, tagName) {
  return Array.from(measureNode.children).filter((child) => child.tagName === tagName);
}

function enforceSystemBreaksEvery(xmlDoc, measuresPerLine = 4) {
  if (!xmlDoc || !Number.isFinite(measuresPerLine) || measuresPerLine <= 0) return;
  const measures = Array.from(xmlDoc.querySelectorAll("part > measure"));
  measures.forEach((measureNode, idx) => {
    const existingPrints = Array.from(measureNode.children).filter((child) => child.tagName === "print");
    existingPrints.forEach((printNode) => {
      if (printNode.getAttribute("new-system") === "yes") {
        printNode.removeAttribute("new-system");
      }
      if (printNode.attributes.length === 0 && printNode.children.length === 0) {
        printNode.remove();
      }
    });

    if (idx === 0 || idx % measuresPerLine !== 0) return;
    let printNode = Array.from(measureNode.children).find((child) => child.tagName === "print");
    if (!printNode) {
      printNode = xmlDoc.createElement("print");
      const attributesNode = Array.from(measureNode.children).find((child) => child.tagName === "attributes");
      if (attributesNode) {
        measureNode.insertBefore(printNode, attributesNode.nextSibling);
      } else {
        measureNode.insertBefore(printNode, measureNode.firstChild);
      }
    }
    printNode.setAttribute("new-system", "yes");
  });
}

function getNoteDurationDivisions(noteNode) {
  const durationEl = noteNode.querySelector("duration");
  return durationEl ? Number(durationEl.textContent) : 0;
}

function isGraceOrChordNote(noteNode) {
  return Boolean(noteNode.querySelector("grace") || noteNode.querySelector("chord"));
}

function getCurrentMeasureTotalDuration(measureModel) {
  let total = 0;
  const noteNodes = getMeasureChildrenByTag(measureModel.xmlNode, "note");
  noteNodes.forEach((noteNode) => {
    if (isGraceOrChordNote(noteNode)) return;
    total += getNoteDurationDivisions(noteNode);
  });
  return total;
}

function getExpectedMeasureDuration(measureModel) {
  const { beats, beatType } = parseTimeSignature(appState.rules.timeSignature);
  const quarterBeats = beats * (4 / beatType);
  return Math.round(quarterBeats * measureModel.divisions);
}

function updateScoreStatusHeader() {
  if (dom.songSelect) {
    dom.songSelect.value = appState.currentSongId;
  }
  if (dom.songKey) dom.songKey.textContent = `${appState.rules.key} ${appState.rules.mode}`;
  if (dom.songTime) dom.songTime.textContent = appState.rules.timeSignature;
  if (dom.missionRange) {
    dom.missionRange.textContent = appState.activeMeasureNumber ? `${appState.activeMeasureNumber}마디` : "-";
  }
}

function updateScoreBottomIcon() {
  if (!dom.scoreBottomIconWrap || !dom.scoreBottomIcon) return;
  const icon = SCORE_BOTTOM_ICONS[appState.currentSongId];
  if (!icon) {
    dom.scoreBottomIconWrap.classList.add("is-hidden");
    dom.scoreBottomIcon.removeAttribute("src");
    dom.scoreBottomIcon.alt = "";
    return;
  }
  dom.scoreBottomIcon.src = icon.src;
  dom.scoreBottomIcon.alt = icon.alt || "";
  const offset = SCORE_ICON_X_BY_SONG[appState.currentSongId] || { desktop: -280, mobile: -225 };
  dom.scoreBottomIconWrap.style.setProperty("--score-icon-x", `${offset.desktop}px`);
  dom.scoreBottomIconWrap.style.setProperty("--score-icon-x-sm", `${offset.mobile}px`);
  dom.scoreBottomIconWrap.classList.remove("is-hidden");
}

function applyScoreViewportFit() {
  const container = dom.scoreContainer;
  if (!container || dom.editorScreen?.classList.contains("is-hidden")) return;
  const content = container.firstElementChild;
  if (!(content instanceof HTMLElement)) return;

  container.style.height = "auto";
  content.style.transform = "";
  content.style.transformOrigin = "";

  const availableWidth = Math.max(120, container.clientWidth - 8);
  const top = container.getBoundingClientRect().top;
  const availableHeight = Math.max(140, window.innerHeight - top - 12);
  const naturalWidth = Math.max(1, content.scrollWidth || content.getBoundingClientRect().width || 1);
  const naturalHeight = Math.max(1, content.scrollHeight || content.getBoundingClientRect().height || 1);

  const widthScale = availableWidth / naturalWidth;
  const heightScale = availableHeight / naturalHeight;
  const scale = Math.min(1, widthScale, heightScale);

  content.style.transformOrigin = "top left";
  content.style.transform = `scale(${scale})`;
  container.style.height = `${Math.max(140, Math.round(naturalHeight * scale + 8))}px`;
  if (dom.scoreBottomIconWrap) {
    dom.scoreBottomIconWrap.style.setProperty("--score-fit-scale", `${scale}`);
  }
}

function queueScoreViewportFit() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      applyScoreViewportFit();
    });
  });
}

function isMeasureInMission(measureNumber) {
  return appState.activeMeasureNumber != null && Number(measureNumber) === Number(appState.activeMeasureNumber);
}

function getSelectedNoteModel() {
  return appState.noteModels.find((note) => note.noteId === appState.selectedNoteId) || null;
}

function findNoteIdByPosition(measureNumber, noteIndex) {
  const matched = appState.noteModels.find(
    (note) => note.measureNumber === measureNumber && note.noteIndex === noteIndex
  );
  return matched?.noteId || null;
}

function findClosestNoteIdInMeasure(measureNumber, noteIndex) {
  const candidates = appState.noteModels
    .filter((note) => note.measureNumber === measureNumber && note.isRenderable)
    .sort((a, b) => Math.abs(a.noteIndex - noteIndex) - Math.abs(b.noteIndex - noteIndex));
  return candidates[0]?.noteId || null;
}

function ensureSelectedNote(mode) {
  const note = getSelectedNoteModel();
  if (!note) {
    throw new Error("선택된 음표를 찾지 못했습니다.");
  }
  if (!isMeasureInMission(note.measureNumber)) {
    throw new Error("선택된 마디 밖의 음표입니다.");
  }
  if (mode === "pitch") {
    if (note.isRest) throw new Error("쉼표는 음정을 바꿀 수 없습니다.");
    if (!note.pitch) throw new Error("이 음표의 pitch 정보가 없습니다.");
  }
  if (!note.xmlNode) {
    throw new Error("선택 음표의 XML 노드를 찾지 못했습니다.");
  }
  return note;
}

function isSelectedNoteEditable() {
  const note = getSelectedNoteModel();
  if (!note) return false;
  return isMeasureInMission(note.measureNumber);
}

function getActiveMissionMeasureNumber() {
  return appState.activeMeasureNumber;
}

function selectMissionMeasure(measureNumber) {
  if (!Number.isFinite(Number(measureNumber))) return;
  appState.activeMeasureNumber = Number(measureNumber);
  appState.selectedNoteId = null;
  refreshRenderedNoteClasses();
  updateScoreStatusHeader();
  updateSelectedNoteView();
  updateButtonsState();
}

function toggleMissionMeasure(measureNumber) {
  const target = Number(measureNumber);
  if (!Number.isFinite(target)) return;
  if (Number(appState.activeMeasureNumber) === target) {
    appState.activeMeasureNumber = null;
    appState.selectedNoteId = null;
    if (!appState.lyricEditMode) {
      appState.selectedLyricNoteId = null;
    }
    refreshRenderedNoteClasses();
    updateScoreStatusHeader();
    updateSelectedNoteView();
    updateButtonsState();
    return;
  }
  selectMissionMeasure(target);
}

function isSelectedNoteEditableForPitch() {
  const note = getSelectedNoteModel();
  if (!note || note.isRest) return false;
  return isSelectedNoteEditable();
}

function hasExceededMeasureEditLimit(note) {
  void note;
  return false;
}

function buildAllowedScaleMidis(noteModels = appState.noteModels) {
  const mode = appState.rules.mode === "minor" ? "minor" : "major";
  const intervals = mode === "minor" ? MINOR_SCALE : MAJOR_SCALE;
  const tonic = SEMITONE_BY_KEY[appState.rules.key] ?? 0;
  const scalePitchClasses = new Set(intervals.map((interval) => (interval + tonic) % 12));
  const pitchNotes = (noteModels || []).filter((n) => n.pitch && !n.isRest);
  const midis = pitchNotes.map((n) => pitchToMidi(n.pitch, n.keyFifths ?? 0));
  const fallbackMin = pitchToMidi(parsePitchText(appState.rules.constraints.pitchRange.min));
  const fallbackMax = pitchToMidi(parsePitchText(appState.rules.constraints.pitchRange.max));
  const sourceMin = midis.length ? Math.min(...midis) : fallbackMin;
  const sourceMax = midis.length ? Math.max(...midis) : fallbackMax;
  const minMidi = Math.max(12, sourceMin - 12);
  const maxMidi = Math.min(108, sourceMax + 12);
  appState.allowedMidiMin = minMidi;
  appState.allowedMidiMax = maxMidi;

  const allowed = [];
  for (let midi = minMidi; midi <= maxMidi; midi += 1) {
    const pc = ((midi % 12) + 12) % 12;
    if (!appState.rules.constraints.allowAccidentals && !scalePitchClasses.has(pc)) {
      continue;
    }
    allowed.push(midi);
  }
  appState.allowedScaleMidis = allowed;
}

function cacheOriginalPitchMidiByNoteId(noteModels = appState.noteModels) {
  appState.originalPitchMidiByNoteId = new Map();
  (noteModels || []).forEach((note) => {
    if (!note?.pitch || note.isRest) return;
    appState.originalPitchMidiByNoteId.set(note.noteId, pitchToMidi(note.pitch, note.keyFifths ?? 0));
  });
}

function getModeIntervals() {
  return appState.rules.mode === "minor" ? MINOR_SCALE : MAJOR_SCALE;
}

function getTonicPcFromFifths(fifths = 0, mode = "major") {
  const base = mode === "minor" ? 9 : 0; // A minor / C major
  return ((base + fifths * 7) % 12 + 12) % 12;
}

function getScalePitchClassesForKeyFifths(fifths = 0) {
  const intervals = getModeIntervals();
  const tonicPc = getTonicPcFromFifths(fifths, appState.rules.mode === "minor" ? "minor" : "major");
  return new Set(intervals.map((interval) => (interval + tonicPc) % 12));
}

function getNoteLyricText(noteNode) {
  const textNode = noteNode.querySelector("lyric > text");
  const text = textNode?.textContent?.trim();
  return text || "";
}

function parseMusicXMLToModel(xmlText) {
  const xmlDoc = new DOMParser().parseFromString(xmlText, "application/xml");
  const part = xmlDoc.querySelector("part");
  if (!part) throw new Error("MusicXML에서 part를 찾을 수 없습니다.");

  const noteModels = [];
  const measureModels = [];
  let currentDivisions = 1;
  let currentKeyFifths = 0;

  const tempoEl = xmlDoc.querySelector("sound[tempo]") || xmlDoc.querySelector("metronome > per-minute");
  if (!appState.tempoUserSet) {
    appState.tempo = tempoEl ? Number(tempoEl.getAttribute("tempo") || tempoEl.textContent || "90") : 90;
  }

  const measures = Array.from(part.querySelectorAll("measure"));
  measures.forEach((measureNode, measureIndex) => {
    const rawMeasureNumber = measureNode.getAttribute("number");
    const parsedNumber = Number.parseInt(rawMeasureNumber || "", 10);
    const measureNumber = Number.isFinite(parsedNumber) ? parsedNumber : measureIndex + 1;
    const divisionsEl = measureNode.querySelector("attributes > divisions");
    if (divisionsEl) currentDivisions = Number(divisionsEl.textContent);
    const fifthsEl = measureNode.querySelector("attributes > key > fifths");
    if (fifthsEl) currentKeyFifths = Number(fifthsEl.textContent);

    const measureModel = {
      number: measureNumber,
      index: measureIndex,
      divisions: currentDivisions,
      keyFifths: currentKeyFifths,
      xmlNode: measureNode,
      notes: [],
    };

    const noteNodes = getMeasureChildrenByTag(measureNode, "note");
    noteNodes.forEach((noteNode, noteIndex) => {
      const noteId = noteNode.getAttribute("id") || `m${measureNumber}_n${noteIndex}`;
      const isRest = Boolean(noteNode.querySelector("rest"));
      const isGrace = Boolean(noteNode.querySelector("grace"));
      const isChord = Boolean(noteNode.querySelector("chord"));
      const durationDivisions = getNoteDurationDivisions(noteNode);
      const typeText = noteNode.querySelector("type")?.textContent?.trim() || "quarter";

      let pitch = null;
      if (!isRest) {
        const pitchNode = noteNode.querySelector("pitch");
        if (pitchNode) {
          const alterNode = pitchNode.querySelector("alter");
          pitch = {
            step: pitchNode.querySelector("step")?.textContent?.trim() || "C",
            alter: alterNode ? Number(alterNode.textContent) : null,
            octave: Number(pitchNode.querySelector("octave")?.textContent || 4),
          };
        }
      }

      const tieInfo = Array.from(noteNode.querySelectorAll("tie")).map((tieEl) => tieEl.getAttribute("type"));
      const lyricText = getNoteLyricText(noteNode);

      const noteModel = {
        noteId,
        measureNumber,
        measureIndex,
        noteIndex,
        isRest,
        isGrace,
        isChord,
        durationDivisions,
        durationType: typeText,
        pitch,
        keyFifths: currentKeyFifths,
        tieInfo,
        lyricText,
        xmlNode: noteNode,
        renderedElement: null,
        renderedLyricElement: null,
        isRenderable: !isGrace && !isChord && durationDivisions > 0,
      };

      measureModel.notes.push(noteModel);
      noteModels.push(noteModel);
    });

    measureModels.push(measureModel);
  });

  return { xmlDoc, noteModels, measureModels };
}

async function parseMxlToXml(arrayBuffer) {
  if (!window.fflate) throw new Error("fflate 로드 실패: .mxl 파일을 읽을 수 없습니다.");
  const unzip = window.fflate.unzipSync(new Uint8Array(arrayBuffer));
  let scorePath = null;

  const containerName = Object.keys(unzip).find((name) => name.includes("META-INF/container.xml"));
  if (containerName) {
    const containerText = new TextDecoder().decode(unzip[containerName]);
    const containerDoc = new DOMParser().parseFromString(containerText, "application/xml");
    const rootFile = containerDoc.querySelector("rootfile");
    if (rootFile) scorePath = rootFile.getAttribute("full-path");
  }

  if (!scorePath) {
    scorePath = Object.keys(unzip).find((name) => name.endsWith(".xml") && !name.includes("container.xml"));
  }
  if (!scorePath || !unzip[scorePath]) throw new Error("MXL 내부 score XML을 찾을 수 없습니다.");
  return new TextDecoder().decode(unzip[scorePath]);
}

function getCurrentSongOption() {
  return SONG_OPTIONS.find((song) => song.id === appState.currentSongId) || SONG_OPTIONS[0];
}

function getSongsByGrade(grade) {
  return SONG_OPTIONS.filter((song) => Number(song.grade) === Number(grade));
}

function getSongOptionsForCurrentGrade() {
  const songs = getSongsByGrade(appState.homeGrade);
  return songs.length > 0 ? songs : SONG_OPTIONS;
}

function hasUnsavedChanges() {
  if (!appState.xmlDoc) return false;
  const currentXml = new XMLSerializer().serializeToString(appState.xmlDoc);
  return currentXml !== (appState.loadedXmlBaseline || "");
}

function saveCurrentSongDraft() {
  if (!appState.currentSongId || !appState.xmlDoc) return;
  appState.songDrafts.set(appState.currentSongId, {
    xmlText: new XMLSerializer().serializeToString(appState.xmlDoc),
    editLogs: structuredClone(appState.editLogs),
  });
}

function openSaveOverlay() {
  if (!dom.saveOverlay || !dom.overlaySaveButton || !dom.overlayDiscardButton || !dom.overlayCancelButton) {
    return Promise.resolve("discard");
  }
  dom.saveOverlay.classList.remove("is-hidden");
  return new Promise((resolve) => {
    const onSave = () => cleanup("save");
    const onDiscard = () => cleanup("discard");
    const onCancel = () => cleanup("cancel");
    const onKey = (event) => {
      if (event.key === "Escape") cleanup("cancel");
    };
    const cleanup = (result) => {
      dom.overlaySaveButton.removeEventListener("click", onSave);
      dom.overlayDiscardButton.removeEventListener("click", onDiscard);
      dom.overlayCancelButton.removeEventListener("click", onCancel);
      document.removeEventListener("keydown", onKey);
      dom.saveOverlay.classList.add("is-hidden");
      resolve(result);
    };
    dom.overlaySaveButton.addEventListener("click", onSave);
    dom.overlayDiscardButton.addEventListener("click", onDiscard);
    dom.overlayCancelButton.addEventListener("click", onCancel);
    document.addEventListener("keydown", onKey);
  });
}

function setActiveHomeGrade(grade) {
  appState.homeGrade = Number(grade);
  dom.stageButtons.forEach((button) => {
    const buttonGrade = Number(button.dataset.grade);
    button.classList.toggle("active", buttonGrade === appState.homeGrade);
  });
}

function showHomeScreen() {
  stopScore();
  dom.homeScreen?.classList.remove("is-hidden");
  dom.editorScreen?.classList.add("is-hidden");
  setActiveHomeGrade(appState.homeGrade || 3);
  requestAnimationFrame(() => {
    populateHomeDecor();
  });
}

async function openEditorForSong(songId) {
  const song = SONG_OPTIONS.find((item) => item.id === songId);
  if (!song) {
    showToast("곡 정보를 찾을 수 없어요");
    return;
  }
  appState.currentSongId = song.id;
  appState.homeGrade = Number(song.grade) || appState.homeGrade;
  initSongSelect();
  dom.homeScreen?.classList.add("is-hidden");
  dom.editorScreen?.classList.remove("is-hidden");
  if (dom.songSelect) dom.songSelect.value = song.id;
  stopScore();
  await loadCurrentSong();
  showToast(`${song.name} 로드 완료`);
}

function rectsOverlap(a, b, gap = 0) {
  return !(
    a.x + a.w + gap <= b.x ||
    b.x + b.w + gap <= a.x ||
    a.y + a.h + gap <= b.y ||
    b.y + b.h + gap <= a.y
  );
}

function getTreeAsset() {
  return { src: "./assets/home/tree.png", baseW: 192, baseH: 252, minScale: 0.72, maxScale: 0.96 };
}

function getHouseAsset() {
  return { src: "./assets/home/home.png", baseW: 206, baseH: 166, minScale: 0.68, maxScale: 1.02 };
}

function getStageBlockedRects() {
  if (!dom.homeMap) return [];
  const mapRect = dom.homeMap.getBoundingClientRect();
  return dom.stageButtons.map((button) => {
    const r = button.getBoundingClientRect();
    return {
      x: r.left - mapRect.left - 16,
      y: r.top - mapRect.top - 18,
      w: r.width + 32,
      h: r.height + 36,
    };
  });
}

function getTrailBlockedRects(mapRect) {
  const w = mapRect.width;
  const h = mapRect.height;
  return [
    { x: 0.16 * w, y: 0.03 * h, w: 0.74 * w, h: 0.22 * h },
    { x: 0.08 * w, y: 0.25 * h, w: 0.80 * w, h: 0.24 * h },
    { x: 0.19 * w, y: 0.50 * h, w: 0.74 * w, h: 0.22 * h },
  ];
}

function getGrassZones(mapRect) {
  const w = mapRect.width;
  const h = mapRect.height;
  return [
    { x: 0.01 * w, y: 0.01 * h, w: 0.28 * w, h: 0.26 * h },
    { x: 0.66 * w, y: 0.01 * h, w: 0.33 * w, h: 0.28 * h },
    { x: 0.01 * w, y: 0.28 * h, w: 0.24 * w, h: 0.27 * h },
    { x: 0.78 * w, y: 0.30 * h, w: 0.21 * w, h: 0.27 * h },
    { x: 0.01 * w, y: 0.60 * h, w: 0.30 * w, h: 0.39 * h },
    { x: 0.62 * w, y: 0.62 * h, w: 0.37 * w, h: 0.36 * h },
    { x: 0.33 * w, y: 0.79 * h, w: 0.24 * w, h: 0.19 * h },
  ];
}

function populateHomeDecor() {
  if (!dom.homeMap || !dom.homeDecorLayer) return;
  const mapRect = dom.homeMap.getBoundingClientRect();
  if (mapRect.width <= 0 || mapRect.height <= 0) return;

  const stageBlocked = getStageBlockedRects();
  const blocked = [...stageBlocked]; // road overlap allowed; only signs are blocked
  const housePlaced = [];
  const treePlaced = [];
  dom.homeDecorLayer.innerHTML = "";

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const addObj = (asset, ax, ay, scale, kind) => {
    const w = asset.baseW * scale;
    const h = asset.baseH * scale;
    const x = clamp(ax * mapRect.width - w / 2, 6, mapRect.width - w - 6);
    const y = clamp(ay * mapRect.height - h / 2, 6, mapRect.height - h - 6);
    const candidate = { x, y, w, h };
    if (blocked.some((box) => rectsOverlap(candidate, box, 3))) return false;
    if (housePlaced.some((box) => rectsOverlap(candidate, box, kind === "house" ? 16 : 10))) return false;
    if (kind === "tree" && treePlaced.some((box) => rectsOverlap(candidate, box, 4))) return false;
    if (kind === "house" && treePlaced.some((box) => rectsOverlap(candidate, box, 10))) return false;
    const img = document.createElement("img");
    img.className = "home-decor-object";
    img.src = asset.src;
    img.alt = "";
    img.draggable = false;
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.width = `${w}px`;
    img.style.height = `${h}px`;
    dom.homeDecorLayer.appendChild(img);
    if (kind === "house") housePlaced.push(candidate);
    if (kind === "tree") treePlaced.push(candidate);
    return true;
  };

  const houseAnchors = [
    [0.08, 0.13],
    [0.92, 0.16],
    [0.08, 0.85],
    [0.54, 0.90],
    [0.84, 0.86],
    [0.26, 0.88],
    [0.70, 0.88],
  ];
  for (const [ax, ay] of houseAnchors) {
    if (housePlaced.length >= 5) break;
    addObj(getHouseAsset(), ax, ay, 0.78, "house");
  }

  const treeAnchors = [
    [0.16, 0.11],
    [0.30, 0.18],
    [0.46, 0.12],
    [0.68, 0.20],
    [0.20, 0.62],
    [0.36, 0.70],
    [0.68, 0.66],
    [0.80, 0.72],
  ];
  for (const [ax, ay] of treeAnchors) {
    if (treePlaced.length >= 5) break;
    addObj(getTreeAsset(), ax, ay, 0.84, "tree");
  }

  if (treePlaced.length < 5) {
    const fallbackAnchors = [
      [0.10, 0.26], [0.24, 0.30], [0.40, 0.28], [0.56, 0.30], [0.74, 0.34],
      [0.14, 0.54], [0.30, 0.56], [0.46, 0.58], [0.62, 0.60], [0.78, 0.62],
      [0.12, 0.74], [0.28, 0.76], [0.44, 0.78], [0.60, 0.80], [0.76, 0.82],
    ];
    for (const [ax, ay] of fallbackAnchors) {
      if (treePlaced.length >= 5) break;
      addObj(getTreeAsset(), ax, ay, 0.76, "tree");
    }
  }

  // User-requested extra 3 trees (do not overlap signs/houses).
  const extraTrees = [
    [0.12, 0.46],
    [0.52, 0.40],
    [0.86, 0.50],
  ];
  for (const [ax, ay] of extraTrees) {
    const asset = getTreeAsset();
    const scale = 0.76;
    const w = asset.baseW * scale;
    const h = asset.baseH * scale;
    const x = clamp(ax * mapRect.width - w / 2, 6, mapRect.width - w - 6);
    const y = clamp(ay * mapRect.height - h / 2, 6, mapRect.height - h - 6);
    const candidate = { x, y, w, h };
    if (blocked.some((box) => rectsOverlap(candidate, box, 3))) continue;
    if (housePlaced.some((box) => rectsOverlap(candidate, box, 10))) continue;
    const img = document.createElement("img");
    img.className = "home-decor-object";
    img.src = asset.src;
    img.alt = "";
    img.draggable = false;
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.width = `${w}px`;
    img.style.height = `${h}px`;
    dom.homeDecorLayer.appendChild(img);
    treePlaced.push(candidate);
  }
}

function keyFromFifths(fifths, mode) {
  const majorByFifths = {
    "-7": "Cb",
    "-6": "Gb",
    "-5": "Db",
    "-4": "Ab",
    "-3": "Eb",
    "-2": "Bb",
    "-1": "F",
    "0": "C",
    "1": "G",
    "2": "D",
    "3": "A",
    "4": "E",
    "5": "B",
    "6": "F#",
    "7": "C#",
  };
  const minorByFifths = {
    "-7": "Ab",
    "-6": "Eb",
    "-5": "Bb",
    "-4": "F",
    "-3": "C",
    "-2": "G",
    "-1": "D",
    "0": "A",
    "1": "E",
    "2": "B",
    "3": "F#",
    "4": "C#",
    "5": "G#",
    "6": "D#",
    "7": "A#",
  };
  const table = mode === "minor" ? minorByFifths : majorByFifths;
  return table[String(Number.isFinite(fifths) ? fifths : 0)] || (mode === "minor" ? "A" : "C");
}

function buildDefaultRulesFromParsed(parsed, song) {
  const xmlDoc = parsed.xmlDoc;
  const beats = xmlDoc.querySelector("measure attributes time beats")?.textContent?.trim() || "4";
  const beatType = xmlDoc.querySelector("measure attributes time beat-type")?.textContent?.trim() || "4";
  const modeRaw = (xmlDoc.querySelector("measure attributes key mode")?.textContent || "major").trim().toLowerCase();
  const mode = modeRaw === "minor" ? "minor" : "major";
  const fifths = Number(xmlDoc.querySelector("measure attributes key fifths")?.textContent || 0);
  const key = keyFromFifths(fifths, mode);
  const measureNumbers = parsed.measureModels.map((m) => m.number);
  const pitchNotes = parsed.noteModels.filter((n) => !n.isRest && n.pitch);
  const midis = pitchNotes.map((n) => pitchToMidi(n.pitch, n.keyFifths ?? 0));
  const minMidi = midis.length ? Math.min(...midis) : 60;
  const maxMidi = midis.length ? Math.max(...midis) : 72;
  const minPitch = midiToPitch(minMidi, key, fifths);
  const maxPitch = midiToPitch(maxMidi, key, fifths);

  return {
    songId: song.id,
    title: song.name,
    grade: Number.parseInt(song.id, 10) || 3,
    timeSignature: `${beats}/${beatType}`,
    key,
    mode,
    editableMeasures: {
      pitch: measureNumbers,
      rhythm: measureNumbers,
    },
    constraints: {
      pitchRange: { min: pitchToText(minPitch), max: pitchToText(maxPitch) },
      allowAccidentals: false,
      allowedDurations: ["16th", "eighth", "quarter", "half", "whole"],
      maxEditsPerMeasure: 999,
    },
  };
}

async function loadRules(parsed) {
  const song = getCurrentSongOption();
  if (song.rulesPath) {
    const res = await fetch(song.rulesPath);
    if (res.ok) return res.json();
  }
  return buildDefaultRulesFromParsed(parsed, song);
}

async function loadScoreXml() {
  const song = getCurrentSongOption();
  if (song.musicxmlPath) {
    const musicXmlRes = await fetch(song.musicxmlPath);
    if (musicXmlRes.ok) return musicXmlRes.text();
  }

  if (song.mxlPath) {
    const mxlRes = await fetch(song.mxlPath);
    if (mxlRes.ok) return parseMxlToXml(await mxlRes.arrayBuffer());
  }
  throw new Error("선택한 곡의 score.musicxml / score.mxl 로드 실패");
}

function stripCredits(xmlText) {
  const doc = new DOMParser().parseFromString(xmlText, "application/xml");
  Array.from(doc.querySelectorAll("credit")).forEach((node) => {
    const text = node.textContent || "";
    if (text.includes("김규환")) {
      node.remove();
    }
  });
  Array.from(doc.querySelectorAll("identification > creator")).forEach((node) => {
    const text = node.textContent || "";
    if (text.includes("김규환")) {
      node.remove();
    }
  });
  return new XMLSerializer().serializeToString(doc);
}

function ensureSongTitle(xmlDoc, title) {
  if (!xmlDoc || !title) return;
  let scorePartwise = xmlDoc.querySelector("score-partwise");
  if (!scorePartwise) {
    scorePartwise = xmlDoc.documentElement;
  }
  if (!scorePartwise) return;

  Array.from(scorePartwise.querySelectorAll("work")).forEach((node) => node.remove());

  let movementTitle = scorePartwise.querySelector("movement-title");
  if (!movementTitle) {
    movementTitle = xmlDoc.createElement("movement-title");
    const firstPart = scorePartwise.querySelector("part-list");
    if (firstPart) scorePartwise.insertBefore(movementTitle, firstPart);
    else scorePartwise.insertBefore(movementTitle, scorePartwise.firstChild);
  }
  movementTitle.textContent = title;
}

function getScoreNoteElements() {
  const svgs = Array.from(dom.scoreContainer.querySelectorAll("svg"));
  const all = [];
  svgs.forEach((svg) => {
    let elements = Array.from(svg.querySelectorAll("g.vf-stavenote, g.vf-rest"));
    if (elements.length === 0) {
      elements = Array.from(svg.querySelectorAll("g")).filter((el) => {
        const cls = el.getAttribute("class") || "";
        return cls.includes("vf-stavenote") || cls.includes("vf-rest");
      });
    }
    all.push(...elements);
  });
  return all;
}

function getRenderableNoteModels() {
  return appState.noteModels.filter((note) => note.isRenderable);
}

function mapRenderedElementsToNotes() {
  const noteElements = getScoreNoteElements();
  appState.noteModels.forEach((note) => {
    note.renderedElement = null;
  });

  const renderableNotes = getRenderableNoteModels();
  const count = Math.min(noteElements.length, renderableNotes.length);
  for (let i = 0; i < count; i += 1) {
    const el = noteElements[i];
    const note = renderableNotes[i];
    note.renderedElement = el;
    el.dataset.noteId = note.noteId;
    el.style.cursor = "pointer";
  }

  return count;
}

function mapRenderedLyricsToNotes() {
  const isLyricToken = (text) => /^[가-힣](?:[!?.,~])?$/.test(text);
  const lyricCandidates = Array.from(dom.scoreContainer.querySelectorAll("svg text"))
    .map((el) => ({ el, text: (el.textContent || "").trim() }))
    .filter((item) => isLyricToken(item.text))
    .map((item) => item.el);

  appState.noteModels.forEach((note) => {
    note.renderedLyricElement = null;
  });
  const lyricNotes = getRenderableNoteModels().filter((note) => note.lyricText);
  const count = Math.min(lyricNotes.length, lyricCandidates.length);
  for (let i = 0; i < count; i += 1) {
    const note = lyricNotes[i];
    const lyricEl = lyricCandidates[i];
    note.renderedLyricElement = lyricEl;
    lyricEl.dataset.lyricNoteId = note.noteId;
    lyricEl.style.cursor = appState.lyricEditMode ? "text" : "default";
  }
}

function setLyricElementHighlight(el, active) {
  if (!el) return;
  const color = active ? "#1f6df0" : "";
  const weight = active ? "900" : "";
  el.style.fill = color;
  el.style.stroke = color;
  el.style.fontWeight = weight;
  Array.from(el.querySelectorAll("tspan")).forEach((child) => {
    child.style.fill = color;
    child.style.stroke = color;
    child.style.fontWeight = weight;
  });
}

function setNoteElementHighlight(el, active) {
  if (!el) return;
  if (!active) {
    el.style.filter = "";
    return;
  }
  el.style.filter =
    "drop-shadow(0 0 4px rgba(55, 150, 255, 0.98)) drop-shadow(0 0 10px rgba(55, 150, 255, 0.9)) drop-shadow(0 0 16px rgba(93, 188, 255, 0.82))";
}

function findNearestLyricElementForNote(note) {
  if (!note?.renderedElement) return null;
  const svg = note.renderedElement.ownerSVGElement;
  if (!svg) return null;
  const isLyricToken = (text) => /^[가-힣](?:[!?.,~])?$/.test(text);
  let noteBox;
  try {
    noteBox = note.renderedElement.getBBox();
  } catch {
    return null;
  }
  const ncx = noteBox.x + noteBox.width / 2;
  const ncy = noteBox.y + noteBox.height / 2;
  let best = null;
  let bestScore = Number.POSITIVE_INFINITY;
  Array.from(svg.querySelectorAll("text")).forEach((el) => {
    const text = (el.textContent || "").trim();
    if (!isLyricToken(text)) return;
    let box;
    try {
      box = el.getBBox();
    } catch {
      return;
    }
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    if (cy <= ncy + 2 || cy > ncy + 180) return;
    const dx = Math.abs(cx - ncx);
    const score = dx * 1.35 + (cy - ncy) * 0.3;
    if (score < bestScore) {
      bestScore = score;
      best = el;
    }
  });
  return best;
}

function removeSelectedNoteOverlay() {
  dom.scoreContainer.querySelectorAll(".selected-note-box").forEach((el) => el.remove());
}

function drawSelectedNoteOverlay(note) {
  if (!note?.renderedElement) return;
  const svg = note.renderedElement.ownerSVGElement;
  if (!svg) return;
  let box;
  try {
    box = note.renderedElement.getBBox();
  } catch {
    return;
  }
  const ns = "http://www.w3.org/2000/svg";
  const rect = document.createElementNS(ns, "rect");
  rect.setAttribute("class", "selected-note-box");
  rect.setAttribute("x", String(box.x - 4));
  rect.setAttribute("y", String(box.y - 6));
  rect.setAttribute("width", String(box.width + 8));
  rect.setAttribute("height", String(box.height + 12));
  rect.setAttribute("rx", "7");
  rect.setAttribute("ry", "7");
  svg.appendChild(rect);
}

function applyCurrentSelectionVisuals() {
  removeSelectedNoteOverlay();

  appState.noteModels.forEach((note) => {
    if (!note.renderedElement) return;
    if (note.noteId === appState.selectedNoteId) {
      note.renderedElement.classList.add("selected-note");
      setNoteElementHighlight(note.renderedElement, true);
      drawSelectedNoteOverlay(note);
    } else {
      note.renderedElement.classList.remove("selected-note");
      setNoteElementHighlight(note.renderedElement, false);
    }
  });

  Array.from(dom.scoreContainer.querySelectorAll("text.selected-lyric")).forEach((el) => {
    el.classList.remove("selected-lyric");
    setLyricElementHighlight(el, false);
  });

  if (!appState.lyricEditMode || !appState.selectedLyricNoteId) return;
  const selectedNote = appState.noteModels.find((n) => n.noteId === appState.selectedLyricNoteId);
  if (!selectedNote) return;
  const lyricEl = selectedNote.renderedLyricElement || findNearestLyricElementForNote(selectedNote);
  if (!lyricEl) return;
  lyricEl.dataset.lyricNoteId = selectedNote.noteId;
  lyricEl.classList.add("selected-lyric");
  setLyricElementHighlight(lyricEl, true);
}

function removeMissionMeasureHighlights() {
  dom.scoreContainer.querySelectorAll(".mission-measure-box").forEach((el) => el.remove());
  appState.measureHitBoxes = [];
  appState.measureRegions = [];
}

function drawMissionMeasureHighlights() {
  const mappedCount = mapRenderedElementsToNotes();
  if (mappedCount === 0) {
    return;
  }

  removeMissionMeasureHighlights();
  const byMeasure = new Map();

  getRenderableNoteModels().forEach((note) => {
    if (!note.renderedElement) return;
    if (!byMeasure.has(note.measureNumber)) byMeasure.set(note.measureNumber, []);
    byMeasure.get(note.measureNumber).push(note.renderedElement);
  });

  const svgByMeasure = new Map();
  for (const [measureNumber, elements] of byMeasure.entries()) {
    const grouped = new Map();
    elements.forEach((el) => {
      const svg = el.ownerSVGElement;
      if (!grouped.has(svg)) grouped.set(svg, []);
      grouped.get(svg).push(el);
    });
    svgByMeasure.set(measureNumber, grouped);
  }

  const ns = "http://www.w3.org/2000/svg";
  for (const [measureNumber, grouped] of svgByMeasure.entries()) {
    for (const [svg, elements] of grouped.entries()) {
      if (!svg || elements.length === 0) continue;

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      elements.forEach((el) => {
        const box = el.getBBox();
        minX = Math.min(minX, box.x);
        minY = Math.min(minY, box.y);
        maxX = Math.max(maxX, box.x + box.width);
        maxY = Math.max(maxY, box.y + box.height);
      });

      if (!Number.isFinite(minX)) continue;

      if (measureNumber === appState.activeMeasureNumber) {
        const rect = document.createElementNS(ns, "rect");
        rect.setAttribute("class", "mission-measure-box active");
        rect.setAttribute("data-measure-number", String(measureNumber));
        rect.setAttribute("x", String(minX - 14));
        rect.setAttribute("y", String(minY - 24));
        rect.setAttribute("width", String(maxX - minX + 28));
        rect.setAttribute("height", String(maxY - minY + 68));
        rect.setAttribute("rx", "12");
        rect.setAttribute("ry", "12");
        svg.insertBefore(rect, svg.firstChild);
      }

      const svgRect = svg.getBoundingClientRect();
      const vb = svg.viewBox?.baseVal;
      const vbWidth = vb && vb.width ? vb.width : Number(svg.getAttribute("width")) || 1;
      const vbHeight = vb && vb.height ? vb.height : Number(svg.getAttribute("height")) || 1;
      const left = svgRect.left + ((minX - 14) / vbWidth) * svgRect.width;
      const top = svgRect.top + ((minY - 24) / vbHeight) * svgRect.height;
      const right = svgRect.left + ((maxX + 14) / vbWidth) * svgRect.width;
      const bottom = svgRect.top + ((maxY + 44) / vbHeight) * svgRect.height;
      appState.measureHitBoxes.push({ measureNumber, left, top, right, bottom });
      appState.measureRegions.push({
        measureNumber,
        svg,
        x: minX - 14,
        y: minY - 24,
        width: maxX - minX + 28,
        height: maxY - minY + 78,
      });
    }
  }
  applyCurrentSelectionVisuals();
}

function applyActiveMeasureZoom() {
  dom.scoreContainer.querySelectorAll(".active-staff-line").forEach((el) => {
    el.classList.remove("active-staff-line");
  });

  const activeMeasure = getActiveMissionMeasureNumber();
  if (!activeMeasure) return;
  const region = appState.measureRegions.find((item) => item.measureNumber === activeMeasure);
  if (!region || !region.svg) return;

  const regionX2 = region.x + region.width;
  const regionY2 = region.y + region.height;
  const candidates = Array.from(region.svg.querySelectorAll("line, path, polyline, polygon"));

  candidates.forEach((el) => {
    if (el.classList.contains("mission-measure-box")) return;
    if (!(el instanceof SVGGraphicsElement)) return;
    if (el.closest(".mission-measure-box")) return;
    const cls = (el.getAttribute("class") || "").toLowerCase();
    const tag = el.tagName.toLowerCase();
    const isStaffLike = cls.includes("staveline") || cls.includes("barline") || tag === "line";
    if (!isStaffLike) return;
    let box;
    try {
      box = el.getBBox();
    } catch {
      return;
    }
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    if (cx >= region.x && cx <= regionX2 && cy >= region.y && cy <= regionY2) {
      el.classList.add("active-staff-line");
    }
  });
}

function queuePersistentHighlightRedraw() {
  appState.highlightRedrawTimers.forEach((id) => clearTimeout(id));
  appState.highlightRedrawTimers = [];
  [0, 200, 600, 1200, 2200].forEach((ms) => {
    const id = setTimeout(() => {
      drawMissionMeasureHighlights();
    }, ms);
    appState.highlightRedrawTimers.push(id);
  });
}

function installHighlightPersistence() {
  if (appState.highlightObserver) {
    appState.highlightObserver.disconnect();
  }

  const observer = new MutationObserver(() => {
    queuePersistentHighlightRedraw();
  });
  observer.observe(dom.scoreContainer, { childList: true, subtree: true });
  appState.highlightObserver = observer;

  window.addEventListener("resize", () => queuePersistentHighlightRedraw(), { passive: true });

  if (appState.highlightIntervalId) {
    clearInterval(appState.highlightIntervalId);
  }
  appState.highlightIntervalId = setInterval(() => {
    queuePersistentHighlightRedraw();
  }, 900);
}

function refreshRenderedNoteClasses() {
  mapRenderedLyricsToNotes();
  appState.noteModels.forEach((note) => {
    const el = note.renderedElement;
    if (!el) return;

    el.classList.remove("mission-note", "locked-note", "selected-note", "playback-note");
    if (isMeasureInMission(note.measureNumber)) {
      el.classList.add("mission-note");
    } else {
      el.classList.add("locked-note");
    }
    if (note.noteId === appState.playbackActiveNoteId) {
      el.classList.add("playback-note");
    }
  });

  applyCurrentSelectionVisuals();
  drawMissionMeasureHighlights();
  applyActiveMeasureZoom();
  queuePersistentHighlightRedraw();
  applyLiveLyricPreview();
}

function updateSelectedNoteView() {
  if (!dom.selectedNoteView) return;
  const note = getSelectedNoteModel();
  if (!note) {
    dom.selectedNoteView.textContent = "선택된 음표 없음";
    return;
  }

  const place = isMeasureInMission(note.measureNumber) ? "편집 가능" : "잠금";
  const typeLabel = note.isRest ? "쉼표" : "음표";
  dom.selectedNoteView.textContent = `${note.noteId} | ${typeLabel} ${pitchToText(note.pitch)} | ${note.durationType} | ${place}`;
}

function updatePlaybackButtons() {
  if (!dom.playButton || !dom.pauseButton || !dom.stopButton) return;
  dom.playButton.disabled = appState.playbackState === "playing";
  dom.pauseButton.disabled = appState.playbackState !== "playing";
  dom.stopButton.disabled = appState.playbackState === "stopped";
  if (dom.scoreBottomIconWrap) {
    dom.scoreBottomIconWrap.classList.toggle("is-playing", appState.playbackState === "playing");
  }
}

function updateTempoControls() {
  if (dom.tempoSlider) dom.tempoSlider.value = String(Math.max(0, Math.min(200, Math.round(appState.tempo || 90))));
  if (dom.tempoValue) dom.tempoValue.textContent = `${Math.round(appState.tempo || 90)} BPM`;
  if (dom.metronomeToggleButton) {
    dom.metronomeToggleButton.innerHTML = `<span class="metronome-icon">⏱</span> 박자 도우미 ${
      appState.metronomeEnabled ? "ON" : "OFF"
    }`;
  }
}

function updateButtonsState() {
  dom.pitchUpButton.disabled = !isSelectedNoteEditableForPitch();
  dom.pitchDownButton.disabled = !isSelectedNoteEditableForPitch();
  dom.undoButton.disabled = appState.undoStack.length === 0;
  dom.redoButton.disabled = appState.redoStack.length === 0;

  const editable = isSelectedNoteEditable();
  Array.from(dom.durationButtons.querySelectorAll("button")).forEach((button) => {
    button.disabled = !editable;
  });
  if (dom.randomRhythmButton) {
    dom.randomRhythmButton.disabled = !getActiveMissionMeasureNumber();
  }
  updatePlaybackButtons();
}

async function renderScore(xmlText) {
  if (!window.opensheetmusicdisplay) throw new Error("OSMD 라이브러리를 찾지 못했습니다.");

  dom.scoreContainer.innerHTML = "";
  appState.osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay(dom.scoreContainer, {
    autoResize: true,
    drawTitle: true,
    drawComposer: false,
    drawPartNames: false,
    drawMeasureNumbers: true,
    newSystemFromXML: true,
    newSystemFromNewPageInXML: true,
  });

  await appState.osmd.load(stripCredits(xmlText));
  await appState.osmd.render();
  queueScoreViewportFit();
}

function onScoreNoteClick(noteId) {
  const note = appState.noteModels.find((item) => item.noteId === noteId);
  if (!note) return;
  if (appState.activeMeasureNumber !== note.measureNumber) {
    appState.activeMeasureNumber = note.measureNumber;
  }
  if (appState.lyricEditMode) {
    appState.selectedLyricNoteId = note.lyricText ? note.noteId : appState.selectedLyricNoteId;
  }

  if (appState.selectedNoteId === noteId) {
    appState.selectedNoteId = null;
    if (appState.lyricEditMode) {
      appState.selectedLyricNoteId = note.lyricText ? note.noteId : appState.selectedLyricNoteId;
    }
    refreshRenderedNoteClasses();
    updateScoreStatusHeader();
    updateSelectedNoteView();
    updateButtonsState();
    return;
  }

  appState.selectedNoteId = noteId;
  refreshRenderedNoteClasses();
  updateScoreStatusHeader();
  updateSelectedNoteView();
  updateButtonsState();
}

function setLyricNodeText(noteNode, text) {
  let lyricNode = noteNode.querySelector("lyric");
  if (!lyricNode) {
    lyricNode = noteNode.ownerDocument.createElement("lyric");
    noteNode.appendChild(lyricNode);
  }
  let syllabicNode = lyricNode.querySelector("syllabic");
  if (!syllabicNode) {
    syllabicNode = noteNode.ownerDocument.createElement("syllabic");
    lyricNode.appendChild(syllabicNode);
  }
  syllabicNode.textContent = "single";

  let textNode = lyricNode.querySelector("text");
  if (!textNode) {
    textNode = noteNode.ownerDocument.createElement("text");
    lyricNode.appendChild(textNode);
  }
  textNode.textContent = text;
}

function clearLyricNodes(noteNode) {
  Array.from(noteNode.querySelectorAll("lyric")).forEach((node) => node.remove());
}

function isHangulSyllable(text) {
  return /^[가-힣]$/.test(text);
}

function buildLyricsCandidateText(targetNoteId, nextChar) {
  return appState.noteModels
    .filter((note) => note.isRenderable)
    .map((note) => {
      if (note.noteId === targetNoteId) return nextChar;
      return note.lyricText || " ";
    })
    .join("");
}

function hasUnsafeLyricContent(text) {
  const normalized = String(text || "").toLowerCase().replace(/\s+/g, "");
  if (BLOCKED_LYRIC_KEYWORDS.some((word) => normalized.includes(word))) return true;
  if (/(01[016789])[-\s]?\d{3,4}[-\s]?\d{4}/.test(text)) return true;
  if (/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(text)) return true;
  if (/(시|도|군|구|로|길|동)\s*\d+/.test(text)) return true;
  return false;
}

function selectLyricNote(noteId) {
  const note = appState.noteModels.find((item) => item.noteId === noteId && item.isRenderable && item.lyricText);
  if (!note) return;
  appState.activeMeasureNumber = note.measureNumber;
  appState.selectedLyricNoteId = note.noteId;
  appState.selectedNoteId = note.noteId;
  resetLyricPad();
  updateScoreStatusHeader();
  refreshRenderedNoteClasses();
  updateSelectedNoteView();
  updateButtonsState();
}

function getFirstLyricNoteId() {
  return appState.noteModels.find((note) => note.isRenderable && note.lyricText)?.noteId || null;
}

const lyricPadState = { cho: null, jung: null, jong: 0, shifted: false, touched: false };

function composeHangulFromPad() {
  if (lyricPadState.cho == null || lyricPadState.jung == null) return "";
  const choIndex = lyricPadState.cho;
  const jungIndex = lyricPadState.jung;
  const jongIndex = lyricPadState.jong || 0;
  return String.fromCharCode(0xac00 + (choIndex * 21 + jungIndex) * 28 + jongIndex);
}

function getLyricPadDisplayText() {
  if (lyricPadState.cho != null && lyricPadState.jung == null) {
    return HANGUL_CHO[lyricPadState.cho] || "";
  }
  if (lyricPadState.cho == null && lyricPadState.jung != null) {
    return HANGUL_JUNG[lyricPadState.jung] || "";
  }
  return composeHangulFromPad();
}

function applyLiveLyricPreview() {
  if (!appState.lyricEditMode || !appState.selectedLyricNoteId) return;
  const note = appState.noteModels.find((n) => n.noteId === appState.selectedLyricNoteId);
  if (!note?.renderedLyricElement) return;
  const live = getLyricPadDisplayText();
  if (live) {
    note.renderedLyricElement.textContent = live;
    return;
  }
  if (lyricPadState.touched) {
    note.renderedLyricElement.textContent = "-";
    return;
  }
  note.renderedLyricElement.textContent = note.lyricText || "";
}

function updateLyricPadPreview() {
  if (!dom.lyricPadPreviewChar) return;
  const char = getLyricPadDisplayText();
  dom.lyricPadPreviewChar.textContent = char || "-";
  applyLiveLyricPreview();
}

function buildLyricPadButtons() {
  if (!dom.lyricKeyboard) return;
  dom.lyricKeyboard.innerHTML = "";

  KEYBOARD_ROWS.forEach((row, rowIndex) => {
    const rowEl = document.createElement("div");
    rowEl.className = `lyric-keyboard-row row-${rowIndex + 1}`;
    row.forEach((label) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lyric-key-btn";
      btn.textContent = label;
      btn.dataset.key = label;
      if (["⇧", "⌫", "123", "☺", "↵"].includes(label)) {
        btn.classList.add("special");
      }
      if (label === "↵") {
        btn.classList.add("enter");
      }
      btn.addEventListener("click", () => handleLyricKeyboardKey(label));
      rowEl.appendChild(btn);
    });
    dom.lyricKeyboard.appendChild(rowEl);
  });
  updateLyricPadPreview();
  updateLyricKeyboardUI();
}

function resetLyricPad() {
  lyricPadState.cho = null;
  lyricPadState.jung = null;
  lyricPadState.jong = 0;
  lyricPadState.shifted = false;
  lyricPadState.touched = false;
  updateLyricPadPreview();
  updateLyricKeyboardUI();
}

function getNextLyricNoteId(currentNoteId) {
  const lyricNotes = appState.noteModels.filter((n) => n.isRenderable && n.lyricText);
  const idx = lyricNotes.findIndex((n) => n.noteId === currentNoteId);
  if (idx < 0) return null;
  return lyricNotes[(idx + 1) % lyricNotes.length]?.noteId || null;
}

function applyShiftToLabel(label) {
  if (!lyricPadState.shifted) return label;
  return SHIFT_MAP[label] || label;
}

function setJamoToPad(label) {
  const choIndex = HANGUL_CHO.indexOf(label);
  const jungIndex = HANGUL_JUNG.indexOf(label);
  const jongIndex = HANGUL_JONG.indexOf(label);

  if (choIndex >= 0 && lyricPadState.cho == null) {
    lyricPadState.cho = choIndex;
    return;
  }
  if (jungIndex >= 0 && lyricPadState.jung == null) {
    lyricPadState.jung = jungIndex;
    return;
  }
  if (jongIndex > 0 && lyricPadState.cho != null && lyricPadState.jung != null && lyricPadState.jong === 0) {
    lyricPadState.jong = jongIndex;
    return;
  }
  if (choIndex >= 0) {
    lyricPadState.cho = choIndex;
    lyricPadState.jung = null;
    lyricPadState.jong = 0;
    return;
  }
  if (jungIndex >= 0) {
    lyricPadState.jung = jungIndex;
    lyricPadState.jong = 0;
  }
}

function updateLyricKeyboardUI() {
  if (!dom.lyricKeyboard) return;
  Array.from(dom.lyricKeyboard.querySelectorAll(".lyric-key-btn")).forEach((btn) => {
    const base = btn.dataset.key || "";
    if (!base) return;
    if (!["⇧", "⌫", "123", "☺", "간격", "↵"].includes(base)) {
      btn.textContent = applyShiftToLabel(base);
    }
    if (base === "⇧") {
      btn.classList.toggle("active", lyricPadState.shifted);
    }
  });
}

function handleLyricKeyboardKey(rawKey) {
  if (rawKey === "⇧") {
    lyricPadState.shifted = !lyricPadState.shifted;
    updateLyricKeyboardUI();
    return;
  }
  if (rawKey === "⌫") {
    lyricPadState.touched = true;
    if (lyricPadState.jong) {
      lyricPadState.jong = 0;
      updateLyricPadPreview();
      return;
    }
    if (lyricPadState.jung != null) {
      lyricPadState.jung = null;
      updateLyricPadPreview();
      return;
    }
    if (lyricPadState.cho != null) {
      lyricPadState.cho = null;
      updateLyricPadPreview();
      return;
    }
    applyLyricDelete().catch((error) => {
      console.error("[applyLyricDelete:virtual]", error);
      showToast("가사 삭제 중 오류가 발생했어요");
    });
    return;
  }

  const key = applyShiftToLabel(rawKey);
  lyricPadState.touched = true;
  setJamoToPad(key);
  lyricPadState.shifted = false;
  updateLyricPadPreview();
  updateLyricKeyboardUI();
}

function setLyricPadVisible(visible) {
  if (!dom.lyricPad) return;
  dom.lyricPad.classList.toggle("is-hidden", !visible);
  queueScoreViewportFit();
}

async function applyLyricEdit(inputChar) {
  if (!appState.lyricEditMode) return;
  if (!appState.selectedLyricNoteId) return;
  if (!isHangulSyllable(inputChar)) {
    showToast("가사는 한 음표당 한 글자(완성형 한글)만 입력할 수 있어요");
    return;
  }

  const note = appState.noteModels.find((item) => item.noteId === appState.selectedLyricNoteId);
  if (!note || !note.xmlNode) return;
  const lyricOrderBefore = appState.noteModels.filter((n) => n.isRenderable && n.lyricText).map((n) => n.noteId);
  const lyricIndexBefore = lyricOrderBefore.indexOf(note.noteId);
  const candidateText = buildLyricsCandidateText(note.noteId, inputChar);
  if (hasUnsafeLyricContent(candidateText)) {
    showToast("안전하지 않은 가사(욕설/혐오/개인정보/성적 표현)는 입력할 수 없어요");
    return;
  }

  pushUndoSnapshot();
  clearRedoStack();
  setLyricNodeText(note.xmlNode, inputChar);
  const before = { lyric: note.lyricText || "" };
  const after = { lyric: inputChar };
  appState.editLogs.push({
    measureNumber: note.measureNumber,
    noteId: note.noteId,
    before,
    after,
    timestamp: new Date().toISOString(),
  });

  await rebuildFromCurrentXml();
  const lyricOrderAfter = appState.noteModels.filter((n) => n.isRenderable && n.lyricText).map((n) => n.noteId);
  let targetNoteId = null;
  if (lyricOrderAfter.length > 0) {
    if (lyricIndexBefore >= 0) {
      targetNoteId = lyricOrderAfter[(lyricIndexBefore + 1) % lyricOrderAfter.length];
    } else {
      targetNoteId = lyricOrderAfter[0];
    }
  }
  resetLyricPad();
  if (targetNoteId) {
    selectLyricNote(targetNoteId);
    setTimeout(() => applyCurrentSelectionVisuals(), 0);
    setTimeout(() => applyCurrentSelectionVisuals(), 120);
  } else {
    appState.selectedLyricNoteId = null;
    appState.selectedNoteId = null;
    refreshRenderedNoteClasses();
    updateScoreStatusHeader();
    updateSelectedNoteView();
    updateButtonsState();
  }
}

async function applyLyricDelete() {
  if (!appState.lyricEditMode || !appState.selectedLyricNoteId) return;
  const note = appState.noteModels.find((item) => item.noteId === appState.selectedLyricNoteId);
  if (!note || !note.xmlNode) return;

  pushUndoSnapshot();
  clearRedoStack();
  clearLyricNodes(note.xmlNode);
  appState.editLogs.push({
    measureNumber: note.measureNumber,
    noteId: note.noteId,
    before: { lyric: note.lyricText || "" },
    after: { lyric: "" },
    timestamp: new Date().toISOString(),
  });

  const pos = { measureNumber: note.measureNumber, noteIndex: note.noteIndex };
  await rebuildFromCurrentXml();
  const restoredNoteId =
    findNoteIdByPosition(pos.measureNumber, pos.noteIndex) || findClosestNoteIdInMeasure(pos.measureNumber, pos.noteIndex);
  if (restoredNoteId) {
    selectLyricNote(restoredNoteId);
  } else {
    appState.selectedLyricNoteId = null;
    appState.selectedNoteId = null;
    appState.activeMeasureNumber = pos.measureNumber;
    refreshRenderedNoteClasses();
    updateScoreStatusHeader();
    updateSelectedNoteView();
    updateButtonsState();
  }
}

async function processDragPitchQueue() {
  if (appState.dragPitch.processing) return;
  appState.dragPitch.processing = true;
  try {
    while (appState.dragPitch.pendingSteps !== 0) {
      const step = appState.dragPitch.pendingSteps > 0 ? 1 : -1;
      appState.dragPitch.pendingSteps -= step;
      await applyPitchEdit(step);
    }
  } finally {
    appState.dragPitch.processing = false;
  }
}

function startNoteDrag(pointerId, clientY, noteId) {
  appState.dragPitch.active = true;
  appState.dragPitch.pointerId = pointerId;
  appState.dragPitch.noteId = noteId;
  appState.dragPitch.lastY = clientY;
  appState.dragPitch.pendingSteps = 0;
  appState.dragPitch.processing = false;
  appState.dragPitch.moved = false;
}

function moveNoteDrag(clientY) {
  if (!appState.dragPitch.active) return;
  const threshold = 18;
  let delta = appState.dragPitch.lastY - clientY;
  if (Math.abs(delta) < threshold) return;
  if (!appState.dragPitch.moved) {
    const note = appState.noteModels.find((item) => item.noteId === appState.dragPitch.noteId);
    if (note) {
      appState.activeMeasureNumber = note.measureNumber;
      appState.selectedNoteId = note.noteId;
      updateScoreStatusHeader();
      refreshRenderedNoteClasses();
      updateSelectedNoteView();
      updateButtonsState();
    }
  }
  const steps = Math.trunc(delta / threshold);
  appState.dragPitch.lastY = clientY;
  appState.dragPitch.pendingSteps += steps;
  appState.dragPitch.moved = true;
  processDragPitchQueue();
}

function endNoteDrag() {
  appState.dragPitch.active = false;
  appState.dragPitch.pointerId = null;
  appState.dragPitch.noteId = null;
  appState.dragPitch.pendingSteps = 0;
}

function isNoteheadPointerTarget(target, noteEl) {
  if (!(target instanceof Element) || !(noteEl instanceof Element)) return false;
  if (!noteEl.contains(target)) return false;
  const blocked = ["stem", "beam", "flag", "stave", "ledger", "clef", "lyric", "annotation"];
  const targetClass = (target.getAttribute("class") || "").toLowerCase();
  if (blocked.some((token) => targetClass.includes(token))) return false;
  const ancestorWithClass = target.closest("[class]");
  if (ancestorWithClass && ancestorWithClass !== noteEl) {
    const ancestorClass = (ancestorWithClass.getAttribute("class") || "").toLowerCase();
    if (blocked.some((token) => ancestorClass.includes(token))) return false;
  }
  return true;
}

function createPitchNode(doc, pitch) {
  const pitchNode = doc.createElement("pitch");
  const stepNode = doc.createElement("step");
  stepNode.textContent = pitch.step;
  pitchNode.appendChild(stepNode);

  if (pitch.alter !== null && pitch.alter !== undefined) {
    const alterNode = doc.createElement("alter");
    alterNode.textContent = String(pitch.alter);
    pitchNode.appendChild(alterNode);
  }

  const octaveNode = doc.createElement("octave");
  octaveNode.textContent = String(pitch.octave);
  pitchNode.appendChild(octaveNode);
  return pitchNode;
}

function updateNotePitchInXml(noteModel, nextPitch) {
  const noteNode = noteModel.xmlNode;
  const pitchNode = noteNode.querySelector("pitch");
  if (!pitchNode) return false;
  noteNode.replaceChild(createPitchNode(noteNode.ownerDocument, nextPitch), pitchNode);
  return true;
}

function setDurationOnNoteNode(noteNode, durationType, durationDivisions) {
  let durationNode = noteNode.querySelector("duration");
  if (!durationNode) {
    durationNode = noteNode.ownerDocument.createElement("duration");
    noteNode.appendChild(durationNode);
  }
  durationNode.textContent = String(durationDivisions);

  let typeNode = noteNode.querySelector("type");
  if (!typeNode) {
    typeNode = noteNode.ownerDocument.createElement("type");
    noteNode.appendChild(typeNode);
  }
  typeNode.textContent = durationType;
  Array.from(noteNode.querySelectorAll("dot")).forEach((dotNode) => dotNode.remove());
}

function setNoteNodeRestState(noteNode, shouldRest, fallbackPitch) {
  const doc = noteNode.ownerDocument;

  if (shouldRest) {
    if (!noteNode.querySelector("rest")) {
      const restNode = doc.createElement("rest");
      const firstChild = noteNode.firstChild;
      if (firstChild) noteNode.insertBefore(restNode, firstChild);
      else noteNode.appendChild(restNode);
    }
    Array.from(noteNode.querySelectorAll("pitch")).forEach((node) => node.remove());
    Array.from(noteNode.querySelectorAll("accidental")).forEach((node) => node.remove());
    Array.from(noteNode.querySelectorAll("tie")).forEach((node) => node.remove());
    return;
  }

  Array.from(noteNode.querySelectorAll("rest")).forEach((node) => node.remove());
  const pitchNode = noteNode.querySelector("pitch");
  const targetPitch = fallbackPitch || { step: "C", alter: null, octave: 4 };
  if (pitchNode) {
    noteNode.replaceChild(createPitchNode(doc, targetPitch), pitchNode);
  } else {
    const newPitchNode = createPitchNode(doc, targetPitch);
    const durationNode = noteNode.querySelector("duration");
    if (durationNode) noteNode.insertBefore(newPitchNode, durationNode);
    else noteNode.appendChild(newPitchNode);
  }
}

function getAccidentalTextByAlter(alter) {
  if (alter === -2) return "flat-flat";
  if (alter === -1) return "flat";
  if (alter === 0) return "natural";
  if (alter === 1) return "sharp";
  if (alter === 2) return "double-sharp";
  return null;
}

function syncAccidentalNode(noteNode, pitch, keyFifths = 0) {
  const existing = noteNode.querySelector("accidental");
  if (!pitch) {
    if (existing) existing.remove();
    return;
  }

  const resolvedAlter = resolvePitchAlter(pitch, keyFifths);
  const keyAlter = getKeySignatureAlter(pitch.step, keyFifths);
  if (resolvedAlter === keyAlter) {
    if (existing) existing.remove();
    return;
  }

  const accidentalText = getAccidentalTextByAlter(resolvedAlter);
  if (!accidentalText) {
    if (existing) existing.remove();
    return;
  }

  const node = existing || noteNode.ownerDocument.createElement("accidental");
  node.textContent = accidentalText;
  if (!existing) {
    const typeNode = noteNode.querySelector("type");
    if (typeNode) noteNode.insertBefore(node, typeNode);
    else noteNode.appendChild(node);
  }
}

function findNearbyPitch(note) {
  const currentMeasureNotes = appState.noteModels.filter((n) => n.measureNumber === note.measureNumber);
  const prev = currentMeasureNotes
    .slice(0, note.noteIndex)
    .reverse()
    .find((n) => !n.isRest && n.pitch);
  if (prev) return prev.pitch;

  const globalPrev = appState.noteModels
    .slice(0, appState.noteModels.findIndex((n) => n.noteId === note.noteId))
    .reverse()
    .find((n) => !n.isRest && n.pitch);
  if (globalPrev) return globalPrev.pitch;

  return { step: "C", alter: 0, octave: 4 };
}

function findNextScaleMidi(note, currentMidi, direction) {
  const step = direction > 0 ? 1 : -1;
  const keyFifths = note?.keyFifths ?? 0;
  const scalePitchClasses = getScalePitchClassesForKeyFifths(keyFifths);
  const globalMin = appState.allowedMidiMin ?? 12;
  const globalMax = appState.allowedMidiMax ?? 108;
  const anchorMidi = appState.originalPitchMidiByNoteId.get(note?.noteId);
  const localMin = Number.isFinite(anchorMidi) ? anchorMidi - 12 : globalMin;
  const localMax = Number.isFinite(anchorMidi) ? anchorMidi + 12 : globalMax;
  const minMidi = Math.max(globalMin, localMin);
  const maxMidi = Math.min(globalMax, localMax);

  for (let midi = currentMidi + step; midi >= minMidi && midi <= maxMidi; midi += step) {
    if (appState.rules.constraints.allowAccidentals) return midi;
    const pc = ((midi % 12) + 12) % 12;
    if (scalePitchClasses.has(pc)) return midi;
  }
  return null;
}

function createEditLog(note, before, after) {
  return {
    measureNumber: note.measureNumber,
    noteId: note.noteId,
    before,
    after,
    timestamp: new Date().toISOString(),
  };
}

async function rebuildFromCurrentXml() {
  enforceSystemBreaksEvery(appState.xmlDoc, 4);
  const currentXml = new XMLSerializer().serializeToString(appState.xmlDoc);
  const parsed = parseMusicXMLToModel(currentXml);
  appState.xmlDoc = parsed.xmlDoc;
  appState.noteModels = parsed.noteModels;
  appState.measureModels = parsed.measureModels;
  buildAllowedScaleMidis(appState.noteModels);
  normalizeAccidentalsInCurrentXml();
  appState.playbackDirty = true;
  const normalizedXml = new XMLSerializer().serializeToString(appState.xmlDoc);

  await renderScore(normalizedXml);
  mapRenderedElementsToNotes();
  refreshRenderedNoteClasses();
  updateSelectedNoteView();
  updateButtonsState();
}

async function applyPitchEdit(direction) {
  try {
    stopScore();
    if (!isSelectedNoteEditableForPitch()) return showToast("이 음은 음정 편집 대상이 아니에요");
    const note = ensureSelectedNote("pitch");
    appState.selectedNoteId = note.noteId;
    appState.activeMeasureNumber = note.measureNumber;
    if (hasExceededMeasureEditLimit(note)) return;

    const currentMidi = pitchToMidi(note.pitch, note.keyFifths ?? 0);
    const nextMidi = findNextScaleMidi(note, currentMidi, direction);
    if (nextMidi == null) return showToast("이 음은 사용할 수 없어요(조성 밖/음역 밖)");

    const nextPitch = midiToPitch(nextMidi, appState.rules.key, note.keyFifths ?? 0);
    const before = {
      pitch: pitchToText(note.pitch),
      duration: note.durationType,
      kind: note.isRest ? "rest" : "note",
    };
    const selectedPosition = { measureNumber: note.measureNumber, noteIndex: note.noteIndex };

    pushUndoSnapshot();
    clearRedoStack();

    if (!updateNotePitchInXml(note, nextPitch)) {
      appState.undoStack.pop();
      return showToast("음정 변경 실패");
    }
    syncAccidentalNode(note.xmlNode, nextPitch, note.keyFifths ?? 0);

    const after = { pitch: pitchToText(nextPitch), duration: note.durationType, kind: "note" };
    appState.editLogs.push(createEditLog(note, before, after));
    await rebuildFromCurrentXml();
    appState.selectedNoteId =
      findNoteIdByPosition(selectedPosition.measureNumber, selectedPosition.noteIndex) ||
      findClosestNoteIdInMeasure(selectedPosition.measureNumber, selectedPosition.noteIndex) ||
      note.noteId;
    appState.activeMeasureNumber = selectedPosition.measureNumber;
    updateScoreStatusHeader();
    refreshRenderedNoteClasses();
    updateSelectedNoteView();
    updateButtonsState();
  } catch (error) {
    console.error("[applyPitchEdit]", error);
    showToast(`음정 변경 오류: ${error.message || "알 수 없는 오류"}`);
  }
}

async function applyDurationOrRestEdit(durationType, asRest) {
  try {
    stopScore();
    if (!isSelectedNoteEditable()) return showToast("이 구간은 잠겨 있어요");
    const note = ensureSelectedNote("rhythm");
    if (hasExceededMeasureEditLimit(note)) return;

    const measure = appState.measureModels.find((m) => m.number === note.measureNumber);
    if (!measure) throw new Error("마디 정보를 찾지 못했습니다.");

    const before = {
      pitch: pitchToText(note.pitch),
      duration: note.durationType,
      kind: note.isRest ? "rest" : "note",
    };

    const noteNode = note.xmlNode;
    const prevPitchNode = noteNode.querySelector("pitch")?.cloneNode(true) || null;
    const prevRestNode = noteNode.querySelector("rest")?.cloneNode(true) || null;
    const prevDurationType = note.durationType;
    const prevDurationDivisions = note.durationDivisions;

    pushUndoSnapshot();
    clearRedoStack();

    const available = getAvailableDurationTypesForDivisions(measure.divisions);
    if (!available.includes(durationType)) {
      return showToast(`현재 마디에서 ${durationType} 길이는 지원되지 않아요`);
    }
    const nextDurationDivisions = durationTypeToDivisions(durationType, measure.divisions);
    setDurationOnNoteNode(noteNode, durationType, nextDurationDivisions);

    if (asRest) {
      setNoteNodeRestState(noteNode, true, null);
    } else {
      setNoteNodeRestState(noteNode, false, note.pitch || findNearbyPitch(note));
      const pitchNode = noteNode.querySelector("pitch");
      if (pitchNode) {
        const pitch = {
          step: pitchNode.querySelector("step")?.textContent?.trim() || "C",
          alter: pitchNode.querySelector("alter")
            ? Number(pitchNode.querySelector("alter")?.textContent || 0)
            : null,
          octave: Number(pitchNode.querySelector("octave")?.textContent || 4),
        };
        syncAccidentalNode(noteNode, pitch, note.keyFifths ?? 0);
      }
    }

    const expected = getExpectedMeasureDuration(measure);
    const actual = getCurrentMeasureTotalDuration(measure);
    if (expected !== actual) {
      setDurationOnNoteNode(noteNode, prevDurationType, prevDurationDivisions);
      Array.from(noteNode.querySelectorAll("pitch")).forEach((n) => n.remove());
      Array.from(noteNode.querySelectorAll("rest")).forEach((n) => n.remove());
      if (prevPitchNode) noteNode.insertBefore(prevPitchNode, noteNode.querySelector("duration"));
      if (prevRestNode) {
        const firstChild = noteNode.firstChild;
        if (firstChild) noteNode.insertBefore(prevRestNode, firstChild);
        else noteNode.appendChild(prevRestNode);
      }
      appState.undoStack.pop();
      return showToast("박자가 맞지 않아요");
    }

    const afterModelPitchNode = noteNode.querySelector("pitch");
    const afterPitch = afterModelPitchNode
      ? {
          step: afterModelPitchNode.querySelector("step")?.textContent || "C",
          alter: afterModelPitchNode.querySelector("alter")
            ? Number(afterModelPitchNode.querySelector("alter")?.textContent || 0)
            : null,
          octave: Number(afterModelPitchNode.querySelector("octave")?.textContent || 4),
        }
      : null;

    const after = {
      pitch: pitchToText(afterPitch),
      duration: durationType,
      kind: asRest ? "rest" : "note",
    };

    appState.editLogs.push(createEditLog(note, before, after));
    await rebuildFromCurrentXml();
  } catch (error) {
    console.error("[applyDurationOrRestEdit]", error);
    showToast(`리듬 변경 오류: ${error.message || "알 수 없는 오류"}`);
  }
}

function downloadTextFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportEditedMusicXml() {
  downloadTextFile(
    "edited.musicxml",
    new XMLSerializer().serializeToString(appState.xmlDoc),
    "application/vnd.recordare.musicxml+xml"
  );
}

function exportEditLogs() {
  downloadTextFile("edits.json", JSON.stringify(appState.editLogs, null, 2), "application/json");
}

async function undoEdit() {
  if (appState.undoStack.length === 0) return;
  const current = loadSnapshot();
  const snapshot = appState.undoStack.pop();
  appState.redoStack.push(current);
  restoreSnapshot(snapshot);
  await rebuildFromCurrentXml();
}

async function redoEdit() {
  if (appState.redoStack.length === 0) return;
  const current = loadSnapshot();
  const snapshot = appState.redoStack.pop();
  appState.undoStack.push(current);
  restoreSnapshot(snapshot);
  await rebuildFromCurrentXml();
}

async function resetAllEdits() {
  stopScore();
  appState.xmlDoc = new DOMParser().parseFromString(appState.xmlTextOriginal, "application/xml");
  appState.undoStack = [];
  appState.redoStack = [];
  appState.editLogs = [];
  appState.selectedNoteId = null;
  appState.selectedLyricNoteId = null;
  appState.lyricEditMode = false;
  dom.lyricPenButton?.classList.remove("active");
  setLyricPadVisible(false);
  resetLyricPad();
  appState.activeMeasureNumber = null;
  await rebuildFromCurrentXml();
  showToast("원본 악보로 초기화했어요");
}

function getPlayableScoreNotes() {
  return appState.noteModels.filter((note) => !note.isGrace && !note.isChord);
}

function getPlayableMeasureNotes(measureNumber) {
  return appState.noteModels.filter(
    (note) => note.measureNumber === measureNumber && !note.isGrace && !note.isChord
  );
}

function midiToToneNoteName(midi) {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${names[pc]}${octave}`;
}

function getInstrumentMeta(instrumentId = appState.currentInstrumentId) {
  return SAMPLE_INSTRUMENTS.find((inst) => inst.id === instrumentId) || SAMPLE_INSTRUMENTS[0];
}

async function getSampler(instrumentId = appState.currentInstrumentId) {
  if (!window.Tone) return null;
  if (appState.samplers.has(instrumentId)) {
    return appState.samplers.get(instrumentId);
  }

  const instrument = getInstrumentMeta(instrumentId);
  if (!instrument) return null;
  const urls = {};
  instrument.notes.forEach((midi) => {
    urls[midiToToneNoteName(midi)] = `${midi}${instrument.suffix}`;
  });

  const sampler = new Tone.Sampler({
    urls,
    baseUrl: instrument.baseUrl,
    release: 1.2,
  }).toDestination();

  await Tone.loaded();
  appState.samplers.set(instrumentId, sampler);
  return sampler;
}

function toUnitsByDuration(durationType) {
  const units = { whole: 16, half: 8, quarter: 4, eighth: 2, "16th": 1 };
  return units[durationType] ?? null;
}

function buildRandomRhythmUnits(noteCount, targetUnits, options) {
  const memo = new Set();
  const randomOptions = [...options];

  function key(index, remain) {
    return `${index}:${remain}`;
  }

  function backtrack(index, remain, acc) {
    if (index === noteCount) return remain === 0 ? [...acc] : null;
    const memoKey = key(index, remain);
    if (memo.has(memoKey)) return null;

    const shuffled = [...randomOptions].sort(() => Math.random() - 0.5);
    for (const candidate of shuffled) {
      if (candidate > remain) continue;
      acc.push(candidate);
      const result = backtrack(index + 1, remain - candidate, acc);
      if (result) return result;
      acc.pop();
    }

    memo.add(memoKey);
    return null;
  }

  return backtrack(0, targetUnits, []);
}

async function applyRandomRhythmToActiveMeasure() {
  try {
    stopScore();
    const measureNumber = getActiveMissionMeasureNumber();
    if (!measureNumber) return showToast("먼저 하이라이트 마디를 선택하세요");

    const measure = appState.measureModels.find((m) => m.number === measureNumber);
    if (!measure) throw new Error("활성 마디를 찾지 못했습니다.");

    const noteList = measure.notes.filter((n) => n.isRenderable);
    if (noteList.length === 0) return showToast("이 마디에는 변경 가능한 음표가 없어요");

    const { beats, beatType } = parseTimeSignature(appState.rules.timeSignature);
    const targetUnits = Math.round(beats * (16 / beatType));
    const availableTypes = getAvailableDurationTypesForDivisions(measure.divisions);
    const durationUnits = availableTypes.map(toUnitsByDuration).filter((u) => u != null);
    if (durationUnits.length === 0) return showToast("이 마디에서 사용 가능한 리듬 길이가 없어요");
    const currentUnits = noteList.map((note) => toUnitsByDuration(note.durationType) ?? 0).join("-");
    const lastUnits = appState.lastRandomRhythmByMeasure.get(measureNumber) || "";
    let randomUnits = null;
    let randomUnitsKey = "";
    for (let attempt = 0; attempt < 24; attempt += 1) {
      const candidate = buildRandomRhythmUnits(noteList.length, targetUnits, durationUnits);
      if (!candidate) continue;
      const key = candidate.join("-");
      randomUnits = candidate;
      randomUnitsKey = key;
      if (key !== currentUnits && key !== lastUnits) break;
    }
    if (!randomUnits) return showToast("랜덤 리듬 조합을 찾지 못했어요");

    const unitToDuration = { 1: "16th", 2: "eighth", 4: "quarter", 8: "half", 16: "whole" };
    const beforeSnapshot = loadSnapshot();
    pushUndoSnapshot();
    clearRedoStack();

    noteList.forEach((note, index) => {
      const durationType = unitToDuration[randomUnits[index]];
      const durationDivisions = durationTypeToDivisions(durationType, measure.divisions);
      setDurationOnNoteNode(note.xmlNode, durationType, durationDivisions);
    });

    const expected = getExpectedMeasureDuration(measure);
    const actual = getCurrentMeasureTotalDuration(measure);
    if (expected !== actual) {
      restoreSnapshot(beforeSnapshot);
      appState.undoStack.pop();
      await rebuildFromCurrentXml();
      return showToast("박자가 맞지 않아요");
    }

    noteList.forEach((note, index) => {
      const durationType = unitToDuration[randomUnits[index]];
      appState.editLogs.push(
        createEditLog(
          note,
          { pitch: pitchToText(note.pitch), duration: note.durationType, kind: note.isRest ? "rest" : "note" },
          { pitch: pitchToText(note.pitch), duration: durationType, kind: note.isRest ? "rest" : "note" }
        )
      );
    });

    await rebuildFromCurrentXml();
    appState.lastRandomRhythmByMeasure.set(measureNumber, randomUnitsKey);
    showToast(`${measureNumber}마디 랜덤 리듬 적용`);
  } catch (error) {
    console.error("[applyRandomRhythmToActiveMeasure]", error);
    showToast(`랜덤 리듬 오류: ${error.message || "알 수 없는 오류"}`);
  }
}

function clearPlaybackSchedule() {
  if (!window.Tone) return;
  appState.playbackEventIds.forEach((id) => Tone.Transport.clear(id));
  appState.playbackEventIds = [];
  if (appState.playbackStopEventId !== null) {
    Tone.Transport.clear(appState.playbackStopEventId);
    appState.playbackStopEventId = null;
  }
  appState.playbackTotalSec = 0;
}

function stopMetronomeLoop() {
  if (!window.Tone) return;
  if (appState.metronomeRepeatId !== null) {
    Tone.Transport.clear(appState.metronomeRepeatId);
    appState.metronomeRepeatId = null;
  }
}

function ensureMetronomeSynth() {
  if (!window.Tone) return;
  if (appState.metronomeSynth) return;
  appState.metronomeSynth = new Tone.MembraneSynth({
    pitchDecay: 0.01,
    octaves: 2,
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 },
  }).toDestination();
}

function startMetronomeLoop() {
  if (!window.Tone || !appState.metronomeEnabled) return;
  ensureMetronomeSynth();
  stopMetronomeLoop();
  const beatSec = 60 / (appState.tempo || 90);
  if (!Number.isFinite(beatSec) || beatSec <= 0) return;
  const nowSec = Tone.Transport.seconds || 0;
  const beatIndex = Math.floor(nowSec / beatSec);
  const nextBeatTime = nowSec;
  appState.metronomeBeatCounter = beatIndex % 4;
  appState.metronomeRepeatId = Tone.Transport.scheduleRepeat((time) => {
    const accent = appState.metronomeBeatCounter % 4 === 0;
    const note = accent ? "C5" : "A4";
    appState.metronomeSynth.triggerAttackRelease(note, "32n", time, accent ? 0.7 : 0.42);
    appState.metronomeBeatCounter += 1;
  }, "4n", nextBeatTime);
}

function normalizeAccidentalsInCurrentXml() {
  appState.noteModels.forEach((note) => {
    if (!note?.xmlNode) return;
    if (note.isRest || !note.pitch) {
      Array.from(note.xmlNode.querySelectorAll("accidental")).forEach((node) => node.remove());
      return;
    }
    syncAccidentalNode(note.xmlNode, note.pitch, note.keyFifths ?? 0);
  });
}

function setPlaybackActiveNote(noteId) {
  if (appState.playbackActiveNoteId === noteId) return;
  const prevId = appState.playbackActiveNoteId;
  appState.playbackActiveNoteId = noteId;

  if (prevId) {
    const prev = appState.noteModels.find((n) => n.noteId === prevId);
    if (prev?.renderedElement) prev.renderedElement.classList.remove("playback-note");
  }
  if (noteId) {
    const next = appState.noteModels.find((n) => n.noteId === noteId);
    if (next?.renderedElement) next.renderedElement.classList.add("playback-note");
  }
}

function finishPlayback() {
  if (window.Tone) {
    Tone.Transport.stop();
    Tone.Transport.position = 0;
  }
  stopMetronomeLoop();
  clearPlaybackSchedule();
  setPlaybackActiveNote(null);
  appState.playbackPausedAtSec = 0;
  appState.playbackState = "stopped";
  updatePlaybackButtons();
}

function getNoteDurationSec(note) {
  const measure = appState.measureModels.find((m) => m.number === note.measureNumber);
  const durationBeats = note.durationDivisions / (measure?.divisions || 1);
  const beatSec = 60 / (appState.tempo || 90);
  return durationBeats * beatSec;
}

function buildScheduledNotesFromOffset(notes, startOffsetSec = 0) {
  if (startOffsetSec <= 0) {
    return notes.map((note) => ({ note, durationSec: getNoteDurationSec(note), offsetSec: 0 }));
  }

  const scheduled = [];
  let elapsed = 0;
  notes.forEach((note) => {
    const durationSec = getNoteDurationSec(note);
    const end = elapsed + durationSec;
    if (end <= startOffsetSec) {
      elapsed = end;
      return;
    }
    const offsetSec = Math.max(0, startOffsetSec - elapsed);
    scheduled.push({ note, durationSec, offsetSec });
    elapsed = end;
  });
  return scheduled;
}

async function schedulePlaybackForNotes(notes, startOffsetSec = 0) {
  if (!window.Tone) throw new Error("Tone.js를 찾을 수 없습니다.");
  await Tone.start();
  Tone.Transport.cancel(0);
  clearPlaybackSchedule();
  Tone.Transport.stop();
  Tone.Transport.position = 0;
  Tone.Transport.bpm.value = appState.tempo || 90;

  if (notes.length === 0) throw new Error("재생할 음표가 없어요");
  const sampler = await getSampler(appState.currentInstrumentId);
  if (!sampler) throw new Error("악기 샘플을 로드하지 못했습니다.");

  const scheduledNotes = buildScheduledNotesFromOffset(notes, startOffsetSec);
  if (scheduledNotes.length === 0) throw new Error("재생할 음표가 없어요");
  let cursorSec = 0;

  scheduledNotes.forEach(({ note, durationSec, offsetSec }) => {
    const effectiveDuration = Math.max(0.03, durationSec - offsetSec);

    if (!note.isRest && note.pitch) {
      const midi = pitchToMidi(note.pitch, note.keyFifths ?? 0);
      const noteName = midiToToneNoteName(midi);
      const id = Tone.Transport.schedule((time) => {
        Tone.Draw.schedule(() => {
          setPlaybackActiveNote(note.noteId);
        }, time);
        sampler.triggerAttackRelease(noteName, Math.max(0.05, effectiveDuration * 0.96), time, 0.9);
      }, cursorSec);
      appState.playbackEventIds.push(id);
      const clearId = Tone.Transport.schedule((time) => {
        Tone.Draw.schedule(() => {
          if (appState.playbackActiveNoteId === note.noteId) {
            setPlaybackActiveNote(null);
          }
        }, time);
      }, cursorSec + Math.max(0.04, effectiveDuration * 0.92));
      appState.playbackEventIds.push(clearId);
    }

    cursorSec += effectiveDuration;
  });

  appState.playbackTotalSec = cursorSec;
  appState.playbackDirty = false;
  appState.playbackStopEventId = Tone.Transport.scheduleOnce(() => {
    finishPlayback();
  }, Math.max(0.05, cursorSec + 0.02));
}

async function scheduleScorePlayback() {
  const notes = getPlayableScoreNotes();
  appState.playbackContext = { type: "score", measureNumber: null };
  await schedulePlaybackForNotes(notes, 0);
}

async function scheduleSelectedMeasurePlayback() {
  const measureNumber = getActiveMissionMeasureNumber();
  if (!measureNumber) throw new Error("먼저 하이라이트 마디를 선택하세요");
  const notes = getPlayableMeasureNotes(measureNumber);
  appState.playbackContext = { type: "measure", measureNumber };
  await schedulePlaybackForNotes(notes, 0);
}

function getPlaybackContextNotes() {
  if (appState.playbackContext.type === "measure" && appState.playbackContext.measureNumber) {
    return getPlayableMeasureNotes(appState.playbackContext.measureNumber);
  }
  return getPlayableScoreNotes();
}

async function playScore() {
  try {
    if (!window.Tone) return showToast("재생 엔진(Tone.js)을 찾을 수 없어요");

    if (appState.selectedNoteId) {
      appState.selectedNoteId = null;
      updateSelectedNoteView();
      refreshRenderedNoteClasses();
      updateButtonsState();
    }

    if (appState.playbackState === "paused") {
      if (appState.playbackDirty) {
        const notes = getPlaybackContextNotes();
        await schedulePlaybackForNotes(notes, appState.playbackPausedAtSec || 0);
      }
      Tone.Transport.start("+0.01");
      startMetronomeLoop();
      appState.playbackState = "playing";
      updatePlaybackButtons();
      return;
    }
    if (appState.playbackState === "playing") return;

    await scheduleScorePlayback();
    Tone.Transport.start("+0.01");
    startMetronomeLoop();
    appState.playbackState = "playing";
    updatePlaybackButtons();
  } catch (error) {
    console.error("[playScore]", error);
    finishPlayback();
    showToast(`재생 오류: ${error.message || "알 수 없는 오류"}`);
  }
}

function pauseScore() {
  if (!window.Tone) return;
  if (appState.playbackState !== "playing") return;
  appState.playbackPausedAtSec = Tone.Transport.seconds || 0;
  stopMetronomeLoop();
  Tone.Transport.pause();
  appState.playbackState = "paused";
  updatePlaybackButtons();
}

function stopScore() {
  finishPlayback();
}

async function playSelectedMeasure() {
  try {
    if (!window.Tone) return showToast("재생 엔진(Tone.js)을 찾을 수 없어요");
    if (!getActiveMissionMeasureNumber()) return showToast("먼저 하이라이트 마디를 선택하세요");

    if (appState.selectedNoteId) {
      appState.selectedNoteId = null;
      updateSelectedNoteView();
      refreshRenderedNoteClasses();
      updateButtonsState();
    }

    if (appState.playbackState !== "stopped") {
      stopScore();
    }
    await scheduleSelectedMeasurePlayback();
    Tone.Transport.start("+0.01");
    startMetronomeLoop();
    appState.playbackState = "playing";
    updatePlaybackButtons();
  } catch (error) {
    console.error("[playSelectedMeasure]", error);
    finishPlayback();
    showToast(`마디 재생 오류: ${error.message || "알 수 없는 오류"}`);
  }
}

function makeNoteIconSvg(durationType) {
  const flagsByDuration = { whole: 0, half: 0, quarter: 0, eighth: 1, "16th": 2 };
  const filled = durationType === "quarter" || durationType === "eighth" || durationType === "16th";
  const flags = flagsByDuration[durationType] ?? 0;
  const stem = durationType !== "whole";

  return `
    <svg class="rhythm-icon" viewBox="0 0 32 32" aria-hidden="true">
      <ellipse cx="12" cy="22" rx="6.2" ry="4.6" ${filled ? 'fill="#111"' : 'fill="none" stroke="#111" stroke-width="2.2"'} />
      ${
        stem
          ? '<line x1="16.2" y1="21" x2="16.2" y2="6" stroke="#111" stroke-width="2.2" stroke-linecap="round" />'
          : ""
      }
      ${
        flags >= 1
          ? '<path d="M16.2 8 C22 8, 23.8 10.5, 24.3 13 C21.6 12.2, 19 12.8, 16.2 14.6 Z" fill="#111" />'
          : ""
      }
      ${
        flags >= 2
          ? '<path d="M16.2 12 C22 12, 23.8 14.5, 24.3 17 C21.6 16.2, 19 16.8, 16.2 18.6 Z" fill="#111" />'
          : ""
      }
    </svg>
  `;
}

function makeRestIconSvg(durationType) {
  const map = {
    whole:
      '<rect x="8" y="10" width="16" height="4" rx="0.8" fill="#111" />',
    half:
      '<rect x="8" y="14" width="16" height="4" rx="0.8" fill="#111" />',
    quarter:
      '<path d="M16 6 C13 10, 19 12, 14 16 C18 17, 14 21, 17 25" stroke="#111" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round" />',
    eighth:
      '<path d="M15 7 C11 11, 18 12, 15 16 C12 18, 13 22, 18 21" stroke="#111" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round" /><circle cx="18.4" cy="22.2" r="1.4" fill="#111" />',
    "16th":
      '<path d="M15 7 C11 11, 18 12, 15 16 C12 18, 13 22, 18 21" stroke="#111" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round" /><circle cx="18.3" cy="20.6" r="1.2" fill="#111" /><circle cx="18.7" cy="24.1" r="1.2" fill="#111" />',
  };

  return `
    <svg class="rhythm-icon" viewBox="0 0 32 32" aria-hidden="true">
      ${map[durationType] || map.quarter}
    </svg>
  `;
}

function buildDurationButtons() {
  if (!dom.durationButtons) return;
  dom.durationButtons.innerHTML = "";
  // 리듬은 랜덤 버튼만 사용: 개별 음표/쉼표 버튼은 숨김 처리
  return;
}

function initInstrumentSelect() {
  if (!dom.instrumentSelect) return;
  dom.instrumentSelect.innerHTML = "";

  SAMPLE_INSTRUMENTS.forEach((instrument) => {
    const option = document.createElement("option");
    option.value = instrument.id;
    option.textContent = instrument.name;
    dom.instrumentSelect.appendChild(option);
  });

  if (!SAMPLE_INSTRUMENTS.some((item) => item.id === appState.currentInstrumentId)) {
    appState.currentInstrumentId = SAMPLE_INSTRUMENTS[0]?.id || "acoustic_piano";
  }
  dom.instrumentSelect.value = appState.currentInstrumentId;

  dom.instrumentSelect.addEventListener("change", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    appState.currentInstrumentId = target.value;
    if (appState.playbackState === "paused") {
      appState.playbackDirty = true;
    }
    if (window.Tone) {
      try {
        await getSampler(appState.currentInstrumentId);
      } catch (error) {
        console.error("[initInstrumentSelect:getSampler]", error);
        showToast("악기 샘플 로드에 실패했어요");
      }
    }
  });
}

function initSongSelect() {
  if (!dom.songSelect) return;
  dom.songSelect.innerHTML = "";

  const options = getSongOptionsForCurrentGrade();
  options.forEach((song) => {
    const option = document.createElement("option");
    option.value = song.id;
    option.textContent = song.name;
    dom.songSelect.appendChild(option);
  });

  if (!options.some((song) => song.id === appState.currentSongId)) {
    appState.currentSongId = options[0]?.id || "gabaram";
  }
  dom.songSelect.value = appState.currentSongId;
}

async function loadCurrentSong() {
  const song = getCurrentSongOption();
  const fetchedXml = await loadScoreXml();
  const draft = appState.songDrafts.get(song.id);
  const xmlText = draft?.xmlText || fetchedXml;
  appState.xmlTextOriginal = fetchedXml;

  const parsed = parseMusicXMLToModel(xmlText);
  appState.rules = await loadRules(parsed);
  appState.xmlDoc = parsed.xmlDoc;
  ensureSongTitle(appState.xmlDoc, song?.name || appState.rules?.title || "");
  enforceSystemBreaksEvery(appState.xmlDoc, 4);
  appState.noteModels = parsed.noteModels;
  appState.measureModels = parsed.measureModels;
  buildAllowedScaleMidis(appState.noteModels);
  cacheOriginalPitchMidiByNoteId(appState.noteModels);
  normalizeAccidentalsInCurrentXml();
  appState.undoStack = [];
  appState.redoStack = [];
  appState.editLogs = draft?.editLogs ? structuredClone(draft.editLogs) : [];
  appState.selectedNoteId = null;
  appState.selectedLyricNoteId = null;
  appState.lyricEditMode = false;
  dom.lyricPenButton?.classList.remove("active");
  setLyricPadVisible(false);
  resetLyricPad();
  appState.activeMeasureNumber = null;

  updateScoreStatusHeader();
  updateTempoControls();

  await renderScore(new XMLSerializer().serializeToString(appState.xmlDoc));
  mapRenderedElementsToNotes();
  refreshRenderedNoteClasses();
  updateSelectedNoteView();
  updateButtonsState();
  updateScoreBottomIcon();
  appState.loadedXmlBaseline = new XMLSerializer().serializeToString(appState.xmlDoc);
  queueScoreViewportFit();
}

function wireEvents() {
  window.addEventListener("resize", () => {
    if (!dom.homeScreen?.classList.contains("is-hidden")) {
      clearTimeout(appState.homeDecorResizeTimer);
      appState.homeDecorResizeTimer = setTimeout(() => {
        populateHomeDecor();
      }, 120);
      return;
    }
    queueScoreViewportFit();
  });

  dom.goHomeButton?.addEventListener("click", async () => {
    if (hasUnsavedChanges()) {
      const decision = await openSaveOverlay();
      if (decision === "cancel") return;
      if (decision === "save") {
        saveCurrentSongDraft();
      } else if (decision === "discard") {
        appState.songDrafts.delete(appState.currentSongId);
      }
    }
    showHomeScreen();
  });

  dom.stageButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const grade = Number(button.dataset.grade);
      if (!Number.isFinite(grade)) return;
      const songs = getSongsByGrade(grade);
      if (songs.length === 0) {
        showToast(`${grade}학년 곡은 아직 준비 중이에요`);
        return;
      }
      setActiveHomeGrade(grade);
      try {
        await openEditorForSong(songs[0].id);
      } catch (error) {
        console.error("[openEditorForSong]", error);
        showToast(`곡 로드 실패: ${error.message || "알 수 없는 오류"}`);
      }
    });
  });

  if (!appState.scoreClickBound) {
    dom.scoreContainer.addEventListener("pointerdown", (event) => {
      if (appState.lyricEditMode) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const noteEl = target.closest("g[data-note-id]");
      if (!noteEl) return;
      if (!isNoteheadPointerTarget(target, noteEl)) return;
      const noteId = noteEl.getAttribute("data-note-id");
      if (!noteId) return;
      startNoteDrag(event.pointerId, event.clientY, noteId);
      if (typeof noteEl.setPointerCapture === "function") {
        try {
          noteEl.setPointerCapture(event.pointerId);
        } catch {
          void 0;
        }
      }
    });

    dom.scoreContainer.addEventListener("pointermove", (event) => {
      if (!appState.dragPitch.active) return;
      if (appState.dragPitch.pointerId !== event.pointerId) return;
      moveNoteDrag(event.clientY);
    });

    dom.scoreContainer.addEventListener("pointerup", (event) => {
      if (appState.dragPitch.pointerId !== event.pointerId) return;
      const didDrag = appState.dragPitch.moved;
      endNoteDrag();
      if (didDrag) {
        event.preventDefault();
      }
    });

    dom.scoreContainer.addEventListener("pointercancel", () => {
      endNoteDrag();
    });

    dom.scoreContainer.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (appState.dragPitch.moved) {
        appState.dragPitch.moved = false;
        return;
      }
      const lyricEl = target.closest("text[data-lyric-note-id]");
      if (lyricEl && appState.lyricEditMode) {
        const lyricNoteId = lyricEl.getAttribute("data-lyric-note-id");
        if (lyricNoteId) selectLyricNote(lyricNoteId);
        return;
      }

      const noteEl = target.closest("g[data-note-id]");
      if (!noteEl) {
        const x = event.clientX;
        const y = event.clientY;
        const hit = appState.measureHitBoxes.find(
          (box) => x >= box.left && x <= box.right && y >= box.top && y <= box.bottom
        );
        if (hit) {
          toggleMissionMeasure(hit.measureNumber);
          showToast(`${hit.measureNumber}마디 선택`);
        }
        return;
      }
      const noteId = noteEl.getAttribute("data-note-id");
      if (!noteId) return;
      event.preventDefault();
      onScoreNoteClick(noteId);
    });
    appState.scoreClickBound = true;
  }

  dom.pitchUpButton.addEventListener("click", () => {
    applyPitchEdit(1);
  });

  dom.pitchDownButton.addEventListener("click", () => {
    applyPitchEdit(-1);
  });

  dom.undoButton.addEventListener("click", () => {
    undoEdit().catch((error) => {
      console.error(error);
      showToast("Undo 중 오류가 발생했어요");
    });
  });

  dom.redoButton.addEventListener("click", () => {
    redoEdit().catch((error) => {
      console.error(error);
      showToast("Redo 중 오류가 발생했어요");
    });
  });

  dom.resetButton.addEventListener("click", () => {
    resetAllEdits().catch((error) => {
      console.error(error);
      showToast("Reset 중 오류가 발생했어요");
    });
  });

  dom.playButton.addEventListener("click", () => {
    if (appState.playbackState === "playing") return;
    playScore();
  });
  dom.pauseButton.addEventListener("click", pauseScore);
  dom.stopButton.addEventListener("click", stopScore);

  if (dom.exportXmlButton) {
    dom.exportXmlButton.addEventListener("click", exportEditedMusicXml);
  }
  if (dom.exportLogsButton) {
    dom.exportLogsButton.addEventListener("click", exportEditLogs);
  }
  if (dom.randomRhythmButton) {
    dom.randomRhythmButton.addEventListener("click", () => {
      applyRandomRhythmToActiveMeasure();
    });
  }

  if (dom.lyricPenButton) {
    dom.lyricPenButton.addEventListener("click", () => {
      appState.lyricEditMode = !appState.lyricEditMode;
      dom.lyricPenButton.classList.toggle("active", appState.lyricEditMode);
      setLyricPadVisible(appState.lyricEditMode);
      if (appState.lyricEditMode) {
        const first = getFirstLyricNoteId();
        if (!first) {
          showToast("편집할 가사가 없어요");
          appState.lyricEditMode = false;
          dom.lyricPenButton.classList.remove("active");
          return;
        }
        if (!appState.selectedLyricNoteId) {
          selectLyricNote(first);
        } else {
          refreshRenderedNoteClasses();
        }
        showToast("가사 편집 모드: 글자를 클릭하고 키보드로 한 글자 입력하세요");
      } else {
        appState.selectedLyricNoteId = null;
        resetLyricPad();
        refreshRenderedNoteClasses();
      }
    });
  }

  dom.lyricPadApplyButton?.addEventListener("click", () => {
    const char = composeHangulFromPad();
    if (!char) {
      showToast("초성과 중성을 선택해 주세요");
      return;
    }
    applyLyricEdit(char).catch((error) => {
      console.error("[applyLyricEdit:pad]", error);
      showToast("가사 변경 중 오류가 발생했어요");
    });
  });
  document.addEventListener("keydown", (event) => {
    if (!appState.lyricEditMode) return;
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
      return;
    }
    if (event.key === "Escape") {
      appState.lyricEditMode = false;
      appState.selectedLyricNoteId = null;
      dom.lyricPenButton?.classList.remove("active");
      setLyricPadVisible(false);
      resetLyricPad();
      refreshRenderedNoteClasses();
      return;
    }
    if (event.key === "Backspace") {
      event.preventDefault();
      applyLyricDelete().catch((error) => {
        console.error("[applyLyricDelete:keydown]", error);
        showToast("가사 삭제 중 오류가 발생했어요");
      });
      return;
    }
    if (event.key.length !== 1) return;
    event.preventDefault();
    applyLyricEdit(event.key).catch((error) => {
      console.error("[applyLyricEdit]", error);
      showToast("가사 변경 중 오류가 발생했어요");
    });
  });

  document.addEventListener("compositionend", (event) => {
    if (!appState.lyricEditMode) return;
    const text = String(event.data || "").trim();
    if (!text) return;
    applyLyricEdit(text).catch((error) => {
      console.error("[applyLyricEdit:compositionend]", error);
      showToast("가사 변경 중 오류가 발생했어요");
    });
  });

  document.addEventListener("compositionupdate", (event) => {
    if (!appState.lyricEditMode || !appState.selectedLyricNoteId) return;
    const note = appState.noteModels.find((n) => n.noteId === appState.selectedLyricNoteId);
    if (!note?.renderedLyricElement) return;
    const live = String(event.data || "").trim();
    note.renderedLyricElement.textContent = live || note.lyricText || "";
  });

  if (dom.tempoSlider) {
    dom.tempoSlider.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      const bpm = Math.max(0, Math.min(200, Number.parseInt(target.value || "90", 10) || 0));
      appState.tempo = bpm;
      appState.tempoUserSet = true;
      appState.playbackDirty = true;
      if (window.Tone) {
        Tone.Transport.bpm.value = bpm;
      }
      if (appState.playbackState === "playing" && appState.metronomeEnabled) {
        startMetronomeLoop();
      }
      updateTempoControls();
    });
  }

  if (dom.metronomeToggleButton) {
    dom.metronomeToggleButton.addEventListener("click", async () => {
      appState.metronomeEnabled = !appState.metronomeEnabled;
      if (appState.metronomeEnabled && window.Tone) {
        try {
          await Tone.start();
        } catch (error) {
          console.error("[metronome:Tone.start]", error);
        }
      }
      if (appState.playbackState === "playing") {
        if (appState.metronomeEnabled) startMetronomeLoop();
        else stopMetronomeLoop();
      } else if (!appState.metronomeEnabled) {
        stopMetronomeLoop();
      }
      updateTempoControls();
    });
  }

  if (dom.songSelect) {
    dom.songSelect.addEventListener("change", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;
      const nextSongId = target.value;
      const prevSongId = appState.currentSongId;
      if (!nextSongId || nextSongId === prevSongId) return;

      if (hasUnsavedChanges()) {
        const decision = await openSaveOverlay();
        if (decision === "cancel") {
          target.value = prevSongId;
          return;
        }
        if (decision === "save") {
          saveCurrentSongDraft();
        }
        if (decision === "discard") {
          appState.songDrafts.delete(prevSongId);
        }
      }

      appState.currentSongId = nextSongId;
      const song = SONG_OPTIONS.find((item) => item.id === appState.currentSongId);
      if (song?.grade) setActiveHomeGrade(song.grade);
      stopScore();
      try {
        await loadCurrentSong();
        showToast(`${target.selectedOptions[0]?.textContent || "곡"} 로드 완료`);
      } catch (error) {
        appState.currentSongId = prevSongId;
        target.value = prevSongId;
        console.error("[songSelectChange]", error);
        showToast(`곡 로드 실패: ${error.message || "알 수 없는 오류"}`);
      }
    });
  }
}

async function init() {
  try {
    initSongSelect();
    initInstrumentSelect();
    buildLyricPadButtons();
    resetLyricPad();
    setLyricPadVisible(false);
    buildDurationButtons();
    wireEvents();
    installHighlightPersistence();
    showHomeScreen();
    showToast("학년 단계를 선택해 주세요");
  } catch (error) {
    console.error(error);
    showToast(`초기화 실패: ${error.message}`);
  }
}

init();
