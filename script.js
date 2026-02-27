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
  metronomeEnabled: true,
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
  lyricInputLiveText: "",
  lyricInputTouched: false,
  lyricCaretVisible: true,
  lyricCaretIntervalId: null,
  lyricCommitInFlight: false,
  dragPitch: { active: false, pointerId: null, noteId: null, lastY: 0, pendingSteps: 0, processing: false, moved: false },
  homeGrade: 3,
  homeDecorResizeTimer: null,
  songDrafts: new Map(),
  loadedXmlBaseline: "",
  teacherOsmd: null,
  teacherSelectedSubmissionId: null,
  teacherSelectedSubmission: null,
  teacherPlaybackState: "stopped",
  teacherPlaybackEventIds: [],
  teacherPlaybackStopEventId: null,
  teacherPlaybackActiveNoteId: null,
  teacherHighlightTimerId: null,
  teacherPlaybackNotes: [],
  teacherPlaybackVisualIndex: -1,
  teacherCurrentInstrumentId: "acoustic_piano",
  teacherTempo: 90,
  teacherFullscreenOsmd: null,
  teacherFullscreenNoteModels: [],
  teacherListCollapsed: false,
  teacherSelectedIds: new Set(),
  teacherSortMode: "latest",
  teacherViewMode: "preview",
  teacherPreviewGrade: 3,
  teacherPreviewSongId: "",
  teacherPreviewRangeStart: null,
  teacherPreviewRangeEnd: null,
  teacherPreviewMeasureHitBoxes: [],
};

const dom = {
  homeScreen: document.getElementById("home-screen"),
  teacherScreen: document.getElementById("teacher-screen"),
  teacherWorkspace: document.querySelector(".teacher-workspace"),
  homeMap: document.querySelector(".home-map"),
  homeDecorLayer: document.getElementById("home-decor-layer"),
  goTeacherButton: document.getElementById("go-teacher-btn"),
  teacherBackButton: document.getElementById("teacher-back-btn"),
  teacherSubmissionList: document.getElementById("teacher-submission-list"),
  teacherListTitle: document.getElementById("teacher-list-title"),
  teacherListToggleButton: document.getElementById("teacher-list-toggle-btn"),
  teacherSelectAllCheckbox: document.getElementById("teacher-select-all-checkbox"),
  teacherSortSelect: document.getElementById("teacher-sort-select"),
  teacherDeleteSelectedButton: document.getElementById("teacher-delete-selected-btn"),
  teacherSubmissionMeta: document.getElementById("teacher-submission-meta"),
  teacherScoreContainer: document.getElementById("teacher-score-container"),
  teacherFullscreenButton: document.getElementById("teacher-fullscreen-btn"),
  teacherFullscreenOverlay: document.getElementById("teacher-fullscreen-overlay"),
  teacherFullscreenCloseButton: document.getElementById("teacher-fullscreen-close-btn"),
  teacherFullscreenScoreContainer: document.getElementById("teacher-fullscreen-score-container"),
  teacherScoreIconWrap: document.getElementById("teacher-score-icon-wrap"),
  teacherScoreIcon: document.getElementById("teacher-score-icon"),
  teacherInstrumentSelect: document.getElementById("teacher-instrument-select"),
  teacherModeSelect: document.getElementById("teacher-mode-select"),
  teacherPreviewSongTools: document.getElementById("teacher-preview-song-tools"),
  teacherPreviewGradeSelect: document.getElementById("teacher-preview-grade-select"),
  teacherPreviewSongSelect: document.getElementById("teacher-preview-song-select"),
  teacherTempoSlider: document.getElementById("teacher-tempo-slider"),
  teacherTempoValue: document.getElementById("teacher-tempo-value"),
  teacherPlayButton: document.getElementById("teacher-play-btn"),
  teacherPauseButton: document.getElementById("teacher-pause-btn"),
  teacherStopButton: document.getElementById("teacher-stop-btn"),
  teacherFullPlayButton: document.getElementById("teacher-full-play-btn"),
  teacherClearMeasureButton: document.getElementById("teacher-clear-measure-btn"),
  submitOverlay: document.getElementById("submit-overlay"),
  submitNameInput: document.getElementById("submit-name-input"),
  submitConfirmButton: document.getElementById("submit-confirm-btn"),
  submitCancelButton: document.getElementById("submit-cancel-btn"),
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
  currentGradeLabel: document.getElementById("current-grade-label"),
  scoreBottomIconWrap: document.getElementById("score-bottom-icon-wrap"),
  scoreBottomIcon: document.getElementById("score-bottom-icon"),
  selectedNoteView: document.getElementById("selected-note-view"),
  durationButtons: document.getElementById("duration-buttons"),
  toast: document.getElementById("toast"),
  pitchUpButton: document.getElementById("pitch-up-btn"),
  pitchDownButton: document.getElementById("pitch-down-btn"),
  pitchPrevButton: document.getElementById("pitch-prev-btn"),
  pitchNextButton: document.getElementById("pitch-next-btn"),
  lyricPenButton: document.getElementById("lyric-pen-btn"),
  lyricPad: document.getElementById("lyric-pad"),
  lyricPadPreviewChar: document.getElementById("lyric-pad-preview-char"),
  lyricPadApplyButton: document.getElementById("lyric-pad-apply-btn"),
  lyricKeyboard: document.getElementById("lyric-keyboard"),
  lyricInputCapture: document.getElementById("lyric-input-capture"),
  undoButton: document.getElementById("undo-btn"),
  redoButton: document.getElementById("redo-btn"),
  resetButton: document.getElementById("reset-btn"),
  playButton: document.getElementById("play-btn"),
  pauseButton: document.getElementById("pause-btn"),
  stopButton: document.getElementById("stop-btn"),
  fullPlayButton: document.getElementById("full-play-btn"),
  saveButton: document.getElementById("save-btn"),
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
    id: "3_guseulbi",
    name: "구슬비",
    grade: 3,
    mxlPath: "./assets/songs/3_guseulbi.mxl",
  },
  {
    id: "3_dotori",
    name: "도토리",
    grade: 3,
    mxlPath: "./assets/songs/3_dotori.mxl",
  },
  {
    id: "3_jamjari",
    name: "잠자리",
    grade: 3,
    mxlPath: "./assets/songs/3_jamjari.mxl",
  },
  {
    id: "gabaram",
    name: "가을바람",
    grade: 3,
    rulesPath: "./assets/score.rules.json",
    musicxmlPath: "./assets/score.musicxml",
    mxlPath: "./assets/score.mxl",
  },
  {
    id: "3_somsatang",
    name: "솜사탕",
    grade: 3,
    mxlPath: "./assets/songs/3_somsatang.mxl",
  },
  {
    id: "4_namulnorae",
    name: "나물노래",
    grade: 4,
    mxlPath: "./assets/songs/4_namulnorae.mxl",
  },
  {
    id: "4_heosuabi_ajeossi",
    name: "허수아비 아저씨",
    grade: 4,
    mxlPath: "./assets/songs/4_heosuabi_ajeossi.mxl",
  },
  {
    id: "4_jongdalsaee_haru",
    name: "종달새의 하루",
    grade: 4,
    mxlPath: "./assets/songs/4_jongdalsaee_haru.mxl",
  },
  {
    id: "4_jageun_sesang",
    name: "작은 세상",
    grade: 4,
    mxlPath: "./assets/songs/4_jageun_sesang.mxl",
  },
  {
    id: "4_oksusu_hamonika",
    name: "옥수수 하모니카",
    grade: 4,
    mxlPath: "./assets/songs/4_oksusu_hamonika.mxl",
  },
  {
    id: "5_doremisong",
    name: "도레미 송",
    grade: 5,
    mxlPath: "./assets/songs/5_doremisong.mxl",
  },
  {
    id: "5_eommaya_nunaya",
    name: "엄마야 누나야",
    grade: 5,
    mxlPath: "./assets/songs/5_eommaya_nunaya.mxl",
  },
  {
    id: "5_supsogeul_georeoyo",
    name: "숲속을 걸어요",
    grade: 5,
    mxlPath: "./assets/songs/5_supsogeul_georeoyo.mxl",
  },
  {
    id: "5_gichareul_tago",
    name: "기차를 타고",
    grade: 5,
    mxlPath: "./assets/songs/5_gichareul_tago.mxl",
  },
  {
    id: "5_gosari_kkeokja",
    name: "고사리 꺾자",
    grade: 5,
    mxlPath: "./assets/songs/5_gosari_kkeokja.mxl",
  },
  {
    id: "6_saessakdeulida",
    name: "새싹들이다",
    grade: 6,
    mxlPath: "./assets/songs/6_saessakdeulida.mxl",
  },
  {
    id: "6_namuui_norae",
    name: "나무의 노래",
    grade: 6,
    mxlPath: "./assets/songs/6_namuui_norae.mxl",
  },
  {
    id: "6_geumdaraekkung",
    name: "금다래꿍",
    grade: 6,
    mxlPath: "./assets/songs/6_geumdaraekkung.mxl",
  },
  {
    id: "6_neulliriya",
    name: "늴리리야",
    grade: 6,
    mxlPath: "./assets/songs/6_neulliriya.mxl",
  },
  {
    id: "6_seuwanigang",
    name: "스와니강",
    grade: 6,
    mxlPath: "./assets/songs/6_seuwanigang.mxl",
  },
];

const SCORE_BOTTOM_ICONS = {
  gabaram: { src: "./assets/score-icons/autumn2.png", alt: "가을바람 아이콘" },
  "3_dotori": { src: "./assets/score-icons/acorn.png", alt: "도토리 아이콘" },
  "3_guseulbi": { src: "./assets/score-icons/guseulbi.png", alt: "구슬비 아이콘" },
  "3_somsatang": { src: "./assets/score-icons/somsatang.png", alt: "솜사탕 아이콘" },
  "3_jamjari": { src: "./assets/score-icons/jamjari.png", alt: "잠자리 아이콘" },
  "4_jongdalsaee_haru": { src: "./assets/score-icons/bird.png", alt: "종달새의 하루 아이콘" },
  "4_namulnorae": { src: "./assets/score-icons/herbs.png", alt: "나물노래 아이콘" },
  "4_heosuabi_ajeossi": { src: "./assets/score-icons/heosuabi2.png", alt: "허수아비 아저씨 아이콘" },
  "4_oksusu_hamonika": { src: "./assets/score-icons/oksusu.png", alt: "옥수수 하모니카 아이콘" },
  "5_doremisong": { src: "./assets/score-icons/doremi.png", alt: "도레미 송 아이콘" },
  "5_eommaya_nunaya": { src: "./assets/score-icons/eommaya_nunaya.png", alt: "엄마야 누나야 아이콘" },
  "5_supsogeul_georeoyo": { src: "./assets/score-icons/supsok.png", alt: "숲속을 걸어요 아이콘" },
  "5_gichareul_tago": { src: "./assets/score-icons/gicha.png", alt: "기차를 타고 아이콘" },
  "5_gosari_kkeokja": { src: "./assets/score-icons/gosari.png", alt: "고사리 꺾자 아이콘" },
  "6_namuui_norae": { src: "./assets/score-icons/namuinorae.png", alt: "나무의 노래 아이콘" },
  "6_geumdaraekkung": { src: "./assets/score-icons/geumdaraekkung.png", alt: "금다래꿍 아이콘" },
  "6_neulliriya": { src: "./assets/score-icons/neulliriya.png", alt: "늴리리야 아이콘" },
  "6_saessakdeulida": { src: "./assets/score-icons/saessak.png", alt: "새싹들이다 아이콘" },
  "6_seuwanigang": { src: "./assets/score-icons/seuwanigang.png", alt: "스와니강 아이콘" },
  "4_jageun_sesang": { src: "./assets/score-icons/jageun_sesang.png", alt: "작은 세상 아이콘" },
};

const SCORE_ICON_X_BY_SONG = {
  "3_guseulbi": { desktop: -300, mobile: -248 },
  "3_somsatang": { desktop: -300, mobile: -248 },
  "4_heosuabi_ajeossi": { desktop: -330, mobile: -270 },
  "4_namulnorae": { desktop: -305, mobile: -255 },
  "4_jongdalsaee_haru": { desktop: -365, mobile: -300 },
  "4_oksusu_hamonika": { desktop: -430, mobile: -350 },
  "5_doremisong": { desktop: -430, mobile: -355 },
  "5_eommaya_nunaya": { desktop: -390, mobile: -320 },
  "5_supsogeul_georeoyo": { desktop: -355, mobile: -295 },
  "5_gichareul_tago": { desktop: -420, mobile: -340 },
  "5_gosari_kkeokja": { desktop: -320, mobile: -265 },
  "6_namuui_norae": { desktop: -340, mobile: -285 },
  "6_saessakdeulida": { desktop: -340, mobile: -285 },
  "6_geumdaraekkung": { desktop: -300, mobile: -248 },
};
const SCORE_ICON_Y_BY_SONG = {
  "5_gichareul_tago": { desktop: 24, mobile: 24 },
};
const SCORE_ICON_SIZE_BY_SONG = {
  "5_gichareul_tago": 1.32,
  "5_eommaya_nunaya": 0.86,
  "6_geumdaraekkung": 0.88,
  "6_seuwanigang": 1.08,
};
const SONG_COMPOSER_OVERRIDE = {
  "4_jageun_sesang": "셔먼 작곡",
  "6_seuwanigang": "포스터 작곡",
};
const SONG_DEFAULT_TEMPO = {
  "3_guseulbi": 90,
  "3_dotori": 110,
  "3_jamjari": 110,
  gabaram: 90,
  "3_somsatang": 105,
  "4_namulnorae": 60,
  "4_heosuabi_ajeossi": 110,
  "4_jongdalsaee_haru": 110,
  "4_jageun_sesang": 100,
  "4_oksusu_hamonika": 95,
  "5_doremisong": 120,
  "5_eommaya_nunaya": 85,
  "5_supsogeul_georeoyo": 105,
  "5_gichareul_tago": 115,
  "5_gosari_kkeokja": 66,
  "6_saessakdeulida": 100,
  "6_namuui_norae": 90,
  "6_geumdaraekkung": 105,
  "6_neulliriya": 50,
  "6_seuwanigang": 100,
};

const SONG_ALLOW_ACCIDENTALS = new Set(["6_namuui_norae"]);
const NO_FIT_SONGS = new Set(["6_saessakdeulida", "6_namuui_norae", "5_gichareul_tago", "4_oksusu_hamonika"]);
const NO_FIT_SCALE_BY_SONG = {
  "6_saessakdeulida": 0.9,
  "6_namuui_norae": 0.9,
  "5_gichareul_tago": 0.9,
  "4_oksusu_hamonika": 0.92,
};

const SHARP_ORDER = ["F", "C", "G", "D", "A", "E", "B"];
const FLAT_ORDER = ["B", "E", "A", "D", "G", "C", "F"];
const SUBMISSION_STORAGE_KEY = "pium_modul3_submissions_v1";

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

function noteToMidi(note) {
  if (!note?.pitch) return null;
  const stepToSemitone = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const keyFifths = note.keyFifths ?? 0;
  const explicitPlaybackAlter = Number.isFinite(note.playbackAlter) ? Number(note.playbackAlter) : null;
  const alter = explicitPlaybackAlter ?? resolvePitchAlter(note.pitch, keyFifths);
  return (note.pitch.octave + 1) * 12 + stepToSemitone[note.pitch.step] + alter;
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
    existingPrints.forEach((printNode) => printNode.remove());

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

function enforceSystemBreaksByPattern(xmlDoc, breakStartIndex, repeatEvery) {
  if (!xmlDoc) return;
  if (!Number.isFinite(breakStartIndex) || breakStartIndex < 1) return;
  if (!Number.isFinite(repeatEvery) || repeatEvery < 1) return;
  const measures = Array.from(xmlDoc.querySelectorAll("part > measure"));
  measures.forEach((measureNode, idx) => {
    const existingPrints = Array.from(measureNode.children).filter((child) => child.tagName === "print");
    void idx;
    existingPrints.forEach((printNode) => printNode.remove());
  });

  for (let idx = breakStartIndex; idx < measures.length; idx += repeatEvery) {
    const measureNode = measures[idx];
    if (!measureNode) continue;
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
  }
}

function applySongSystemBreakLayout(xmlDoc, songId = appState.currentSongId) {
  if (!xmlDoc) return;
  if (songId === "4_namulnorae") {
    enforceSystemBreaksEvery(xmlDoc, 3);
    return;
  }
  if (songId === "4_jageun_sesang") {
    // first line 5 measures, then 4 measures each line
    enforceSystemBreaksByPattern(xmlDoc, 5, 4);
    return;
  }
  if (songId === "5_gosari_kkeokja") {
    enforceSystemBreaksEvery(xmlDoc, 3);
    return;
  }
  enforceSystemBreaksEvery(xmlDoc, 4);
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
  const yOffset = SCORE_ICON_Y_BY_SONG[appState.currentSongId] || { desktop: 34, mobile: 34 };
  dom.scoreBottomIconWrap.style.setProperty("--score-icon-top", `${yOffset.desktop}px`);
  dom.scoreBottomIconWrap.style.setProperty("--score-icon-top-sm", `${yOffset.mobile}px`);
  const iconScale = SCORE_ICON_SIZE_BY_SONG[appState.currentSongId] ?? 1;
  dom.scoreBottomIcon.style.setProperty("--score-icon-size-scale", `${iconScale}`);
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

  if (NO_FIT_SONGS.has(appState.currentSongId)) {
    const scale = NO_FIT_SCALE_BY_SONG[appState.currentSongId] ?? 1;
    const naturalHeight = Math.max(1, content.scrollHeight || content.getBoundingClientRect().height || 1);
    content.style.transformOrigin = "top left";
    content.style.transform = `scale(${scale})`;
    container.style.height = `${Math.max(200, Math.round(naturalHeight * scale + 14))}px`;
    if (dom.scoreBottomIconWrap) {
      dom.scoreBottomIconWrap.style.setProperty("--score-fit-scale", `${scale}`);
    }
    return;
  }

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

function updateSongLayoutMode() {
  if (!dom.editorScreen) return;
  dom.editorScreen.classList.toggle("song-scroll-mode", NO_FIT_SONGS.has(appState.currentSongId));
  dom.editorScreen.classList.remove("namul-four-layout");
}

function updateBodyOverflowBySong() {
  document.body.style.overflow = "hidden";
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
    // Always keep pitch movement in the current key signature scale.
    if (!scalePitchClasses.has(pc)) {
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

function normalizePitchAlterByKeySignature(step, alter, keyFifths = 0) {
  const keyAlter = getKeySignatureAlter(step, keyFifths);
  if (alter === null || alter === undefined) return null;
  const numericAlter = Number(alter);
  if (!Number.isFinite(numericAlter)) return null;
  if (numericAlter === keyAlter) return null;
  if (numericAlter === 0 && keyAlter === 0) return null;
  return numericAlter;
}

function accidentalTextToAlter(accidentalText) {
  const text = String(accidentalText || "").trim().toLowerCase();
  if (!text) return null;
  if (text === "natural") return 0;
  if (text === "sharp") return 1;
  if (text === "flat") return -1;
  if (text === "double-sharp" || text === "sharp-sharp") return 2;
  if (text === "flat-flat") return -2;
  return null;
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
    const accidentalState = new Map();

    const noteNodes = getMeasureChildrenByTag(measureNode, "note");
    noteNodes.forEach((noteNode, noteIndex) => {
      const noteId = noteNode.getAttribute("id") || `m${measureNumber}_n${noteIndex}`;
      const isRest = Boolean(noteNode.querySelector("rest"));
      const isGrace = Boolean(noteNode.querySelector("grace"));
      const isChord = Boolean(noteNode.querySelector("chord"));
      const durationDivisions = getNoteDurationDivisions(noteNode);
      const typeText = noteNode.querySelector("type")?.textContent?.trim() || "quarter";

      let pitch = null;
      let playbackAlter = null;
      if (!isRest) {
        const pitchNode = noteNode.querySelector("pitch");
        if (pitchNode) {
          const stepText = pitchNode.querySelector("step")?.textContent?.trim() || "C";
          const octaveNumber = Number(pitchNode.querySelector("octave")?.textContent || 4);
          const accidentalNode = noteNode.querySelector("accidental");
          const accidentalText = accidentalNode?.textContent?.trim() || "";
          const accidentalAlter = accidentalTextToAlter(accidentalText);
          const alterNode = pitchNode.querySelector("alter");
          const parsedAlter = alterNode ? Number(alterNode.textContent) : accidentalAlter;
          const normalizedAlter = normalizePitchAlterByKeySignature(stepText, parsedAlter, currentKeyFifths);
          const pitchKey = `${stepText}${octaveNumber}`;

          if (accidentalAlter !== null) {
            const prevAlterInMeasure = accidentalState.get(pitchKey);
            if (accidentalNode && prevAlterInMeasure === accidentalAlter) {
              // 같은 마디의 같은 음에 같은 임시표는 첫 표기만 유지
              accidentalNode.remove();
            }
            playbackAlter = accidentalAlter;
            accidentalState.set(pitchKey, accidentalAlter);
          } else if (alterNode) {
            const explicitAlter = Number(alterNode.textContent);
            if (Number.isFinite(explicitAlter)) {
              playbackAlter = explicitAlter;
              accidentalState.set(pitchKey, explicitAlter);
            }
          } else if (accidentalState.has(pitchKey)) {
            playbackAlter = accidentalState.get(pitchKey);
          }

          pitch = {
            step: stepText,
            alter: normalizedAlter,
            octave: octaveNumber,
          };
        }
      }

      const tieInfo = Array.from(noteNode.querySelectorAll("tie")).map((tieEl) => tieEl.getAttribute("type"));
      const isStaccato = Boolean(noteNode.querySelector("notations > articulations > staccato"));
      const lyricText = getNoteLyricText(noteNode);
      const hasLyricSlot = Boolean(noteNode.querySelector("lyric"));

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
        playbackAlter,
        keyFifths: currentKeyFifths,
        tieInfo,
        isStaccato,
        lyricText,
        hasLyricSlot,
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
  if (dom.currentGradeLabel) {
    dom.currentGradeLabel.textContent = `${appState.homeGrade}학년`;
  }
  dom.stageButtons.forEach((button) => {
    const buttonGrade = Number(button.dataset.grade);
    button.classList.toggle("active", buttonGrade === appState.homeGrade);
  });
}

function getStoredSubmissions() {
  try {
    const raw = window.localStorage.getItem(SUBMISSION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.error("[getStoredSubmissions]", error);
    return [];
  }
}

function saveStoredSubmissions(submissions) {
  try {
    window.localStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify(submissions));
  } catch (error) {
    console.error("[saveStoredSubmissions]", error);
  }
}

function formatSubmissionTime(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function submitCurrentSong(studentName) {
  if (!appState.xmlDoc) return false;
  const song = getCurrentSongOption();
  const xmlText = new XMLSerializer().serializeToString(appState.xmlDoc);
  const submissions = getStoredSubmissions();
  const safeName = String(studentName || "").trim();
  if (!safeName) return false;
  submissions.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    studentName: safeName,
    songId: song.id,
    songName: song.name,
    grade: Number(song.grade) || appState.homeGrade || 0,
    tempo: Math.max(0, Math.min(200, Math.round(appState.tempo || 90))),
    submittedAt: new Date().toISOString(),
    xmlText,
  });
  saveStoredSubmissions(submissions);
  saveCurrentSongDraft();
  appState.loadedXmlBaseline = xmlText;
  return true;
}

function openSubmitOverlay() {
  if (
    !dom.submitOverlay ||
    !dom.submitNameInput ||
    !dom.submitConfirmButton ||
    !dom.submitCancelButton
  ) {
    return Promise.resolve(null);
  }
  dom.submitOverlay.classList.remove("is-hidden");
  dom.submitNameInput.value = "";
  requestAnimationFrame(() => dom.submitNameInput.focus());
  return new Promise((resolve) => {
    const onConfirm = () => {
      const name = String(dom.submitNameInput.value || "").trim();
      if (!name) {
        showToast("이름을 입력해 주세요");
        dom.submitNameInput.focus();
        return;
      }
      cleanup(name);
    };
    const onCancel = () => cleanup(null);
    const onKey = (event) => {
      if (event.key === "Escape") cleanup(null);
      if (event.key === "Enter") onConfirm();
    };
    const cleanup = (result) => {
      dom.submitConfirmButton.removeEventListener("click", onConfirm);
      dom.submitCancelButton.removeEventListener("click", onCancel);
      document.removeEventListener("keydown", onKey);
      dom.submitOverlay.classList.add("is-hidden");
      resolve(result);
    };
    dom.submitConfirmButton.addEventListener("click", onConfirm);
    dom.submitCancelButton.addEventListener("click", onCancel);
    document.addEventListener("keydown", onKey);
  });
}

function updateTeacherIcon(songId, isPlaying = false) {
  void songId;
  void isPlaying;
  if (dom.teacherScoreIconWrap) dom.teacherScoreIconWrap.classList.add("is-hidden");
}

function mountTeacherIconIntoScoreContent() {
  return;
}

function updateTeacherTempoControls() {
  if (dom.teacherTempoSlider) dom.teacherTempoSlider.value = String(Math.max(0, Math.min(200, Math.round(appState.teacherTempo || 90))));
  if (dom.teacherTempoValue) dom.teacherTempoValue.textContent = `${Math.round(appState.teacherTempo || 90)} BPM`;
}

function updateTeacherPlaybackButtonsState() {
  const hasSubmission = Boolean(appState.teacherSelectedSubmission);
  const isPreview = appState.teacherViewMode === "preview";
  const hasPreviewRange = Boolean(getTeacherPreviewSelectedRange());

  if (dom.teacherPlayButton) {
    dom.teacherPlayButton.disabled = !hasSubmission || (isPreview && !hasPreviewRange);
  }
  if (dom.teacherPauseButton) {
    dom.teacherPauseButton.disabled = appState.teacherPlaybackState !== "playing";
  }
  if (dom.teacherStopButton) {
    dom.teacherStopButton.disabled = appState.teacherPlaybackState === "stopped";
  }
  if (dom.teacherFullPlayButton) {
    dom.teacherFullPlayButton.disabled = !hasSubmission;
  }
  if (dom.teacherClearMeasureButton) {
    dom.teacherClearMeasureButton.disabled = !isPreview || !hasPreviewRange;
  }
}

async function openTeacherFullscreen() {
  const submission = appState.teacherSelectedSubmission;
  if (!submission || !dom.teacherFullscreenOverlay || !dom.teacherFullscreenScoreContainer) {
    showToast("먼저 제출 악보를 선택하세요");
    return;
  }
  dom.teacherFullscreenOverlay.classList.remove("is-hidden");
  dom.teacherFullscreenScoreContainer.innerHTML = "";
  appState.teacherFullscreenNoteModels = [];
  try {
    appState.teacherFullscreenOsmd = new opensheetmusicdisplay.OpenSheetMusicDisplay(dom.teacherFullscreenScoreContainer, {
      autoResize: true,
      drawTitle: true,
      drawComposer: true,
      drawPartNames: false,
      drawMeasureNumbers: true,
      newSystemFromXML: true,
      newSystemFromNewPageInXML: true,
    });
    await appState.teacherFullscreenOsmd.load(stripTeacherCredits(submission.xmlText));
    await appState.teacherFullscreenOsmd.render();
    stripRenderedNoteAccidentals(dom.teacherFullscreenScoreContainer);
    keepOnlyFirstMeasureNumberPerRow(dom.teacherFullscreenScoreContainer);
    const parsed = parseMusicXMLToModel(submission.xmlText);
    appState.teacherFullscreenNoteModels = parsed.noteModels;
    mapRenderedElementsToNoteModels(appState.teacherFullscreenNoteModels, dom.teacherFullscreenScoreContainer);
    if (appState.teacherPlaybackActiveNoteId || appState.teacherPlaybackVisualIndex >= 0) {
      setTeacherPlaybackHighlight(
        appState.teacherPlaybackActiveNoteId,
        -1,
        appState.teacherPlaybackVisualIndex
      );
    }
  } catch (error) {
    console.error("[openTeacherFullscreen]", error);
    dom.teacherFullscreenScoreContainer.innerHTML = '<p class="teacher-submission-meta">전체보기 렌더링에 실패했어요.</p>';
  }
}

function closeTeacherFullscreen() {
  dom.teacherFullscreenOverlay?.classList.add("is-hidden");
  appState.teacherFullscreenNoteModels = [];
}

function updateTeacherListCollapsedUI() {
  if (!dom.teacherWorkspace || !dom.teacherListToggleButton) return;
  dom.teacherWorkspace.classList.toggle("list-collapsed", appState.teacherListCollapsed);
  if (dom.teacherListTitle) {
    dom.teacherListTitle.style.display = appState.teacherListCollapsed ? "none" : "";
  }
  dom.teacherListToggleButton.textContent = appState.teacherListCollapsed ? "▸" : "◂";
  dom.teacherListToggleButton.setAttribute("aria-label", appState.teacherListCollapsed ? "제출목록 펼치기" : "제출목록 접기");
  dom.teacherListToggleButton.setAttribute("title", appState.teacherListCollapsed ? "제출목록 펼치기" : "제출목록 접기");
}

function initTeacherPreviewSelectors() {
  if (!dom.teacherPreviewGradeSelect || !dom.teacherPreviewSongSelect) return;
  dom.teacherPreviewGradeSelect.innerHTML = "";
  [3, 4, 5, 6].forEach((grade) => {
    const option = document.createElement("option");
    option.value = String(grade);
    option.textContent = `${grade}학년`;
    dom.teacherPreviewGradeSelect.appendChild(option);
  });
  if (!getSongsByGrade(appState.teacherPreviewGrade).length) {
    appState.teacherPreviewGrade = 3;
  }
  dom.teacherPreviewGradeSelect.value = String(appState.teacherPreviewGrade);
  refreshTeacherPreviewSongSelect();
}

function refreshTeacherPreviewSongSelect() {
  if (!dom.teacherPreviewSongSelect) return;
  const songs = getSongsByGrade(appState.teacherPreviewGrade);
  dom.teacherPreviewSongSelect.innerHTML = "";
  songs.forEach((song) => {
    const option = document.createElement("option");
    option.value = song.id;
    option.textContent = song.name;
    dom.teacherPreviewSongSelect.appendChild(option);
  });
  if (!songs.some((song) => song.id === appState.teacherPreviewSongId)) {
    appState.teacherPreviewSongId = songs[0]?.id || "";
  }
  dom.teacherPreviewSongSelect.value = appState.teacherPreviewSongId || "";
}

async function renderTeacherPreviewSong(songId = appState.teacherPreviewSongId) {
  const song = SONG_OPTIONS.find((item) => item.id === songId);
  if (!song) {
    await renderTeacherSubmissionScore(null);
    return;
  }
  appState.teacherPreviewRangeStart = null;
  appState.teacherPreviewRangeEnd = null;
  appState.teacherPreviewMeasureHitBoxes = [];
  appState.teacherPreviewSongId = song.id;
  const defaultTempo = SONG_DEFAULT_TEMPO[song.id] ?? 90;
  appState.teacherTempo = Math.max(0, Math.min(200, Math.round(defaultTempo)));
  updateTeacherTempoControls();

  const sourceXml = await loadScoreXmlBySong(song);
  const parsed = parseMusicXMLToModel(sourceXml);
  ensureSongTitle(parsed.xmlDoc, song.name);
  applySongComposerOverride(parsed.xmlDoc, song.id, sourceXml);
  applySongSystemBreakLayout(parsed.xmlDoc, song.id);
  const xmlText = new XMLSerializer().serializeToString(parsed.xmlDoc);
  await renderTeacherSubmissionScore({
    id: `preview_${song.id}`,
    studentName: "미리듣기",
    songId: song.id,
    songName: song.name,
    grade: Number(song.grade) || appState.teacherPreviewGrade,
    tempo: defaultTempo,
    submittedAt: new Date().toISOString(),
    xmlText,
  });
}

function setTeacherViewMode(mode = "submission") {
  const nextMode = mode === "preview" ? "preview" : "submission";
  appState.teacherViewMode = nextMode;
  if (dom.teacherModeSelect) dom.teacherModeSelect.value = nextMode;
  if (dom.teacherScreen) dom.teacherScreen.classList.toggle("preview-mode", nextMode === "preview");
  if (dom.teacherPreviewSongTools) dom.teacherPreviewSongTools.classList.toggle("is-hidden", nextMode !== "preview");
  appState.teacherPreviewRangeStart = null;
  appState.teacherPreviewRangeEnd = null;
  appState.teacherPreviewMeasureHitBoxes = [];

  stopTeacherPlayback();
  closeTeacherFullscreen();

  if (nextMode === "preview") {
    initTeacherPreviewSelectors();
    renderTeacherPreviewSong(appState.teacherPreviewSongId).catch((error) => {
      console.error("[renderTeacherPreviewSong]", error);
      showToast(`미리듣기 로드 실패: ${error.message || "알 수 없는 오류"}`);
    });
    updateTeacherPlaybackButtonsState();
    return;
  }
  renderTeacherSubmissionList();
  updateTeacherPlaybackButtonsState();
}

function clearTeacherPreviewMeasureHighlights() {
  if (!dom.teacherScoreContainer) return;
  dom.teacherScoreContainer.querySelectorAll(".teacher-preview-measure-box").forEach((el) => el.remove());
  appState.teacherPreviewMeasureHitBoxes = [];
}

function getTeacherPreviewSelectedRange() {
  const start = Number(appState.teacherPreviewRangeStart);
  const end = Number(appState.teacherPreviewRangeEnd);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  return { start: Math.min(start, end), end: Math.max(start, end) };
}

function isTeacherPreviewMeasureSelected(measureNumber) {
  const range = getTeacherPreviewSelectedRange();
  if (!range) return false;
  const m = Number(measureNumber);
  return Number.isFinite(m) && m >= range.start && m <= range.end;
}

function drawTeacherPreviewMeasureHighlights() {
  clearTeacherPreviewMeasureHighlights();
  if (appState.teacherViewMode !== "preview") return;
  if (appState.teacherSelectedSubmission?.noteModels?.length && dom.teacherScoreContainer) {
    mapRenderedElementsToNoteModels(appState.teacherSelectedSubmission.noteModels, dom.teacherScoreContainer);
  }
  const noteModels = appState.teacherSelectedSubmission?.noteModels || [];
  const byMeasure = new Map();
  noteModels.forEach((note) => {
    if (!note?.renderedElement || !Number.isFinite(note.measureNumber)) return;
    if (!byMeasure.has(note.measureNumber)) byMeasure.set(note.measureNumber, []);
    byMeasure.get(note.measureNumber).push(note.renderedElement);
  });

  const bySvg = new Map();
  for (const [measureNumber, elements] of byMeasure.entries()) {
    elements.forEach((el) => {
      const svg = el.ownerSVGElement;
      if (!svg) return;
      if (!bySvg.has(svg)) bySvg.set(svg, new Map());
      const measureMap = bySvg.get(svg);
      if (!measureMap.has(measureNumber)) {
        measureMap.set(measureNumber, {
          measureNumber,
          elements: [],
          minX: Infinity,
          minY: Infinity,
          maxX: -Infinity,
          maxY: -Infinity,
        });
      }
      const info = measureMap.get(measureNumber);
      let box;
      try {
        box = el.getBBox();
      } catch {
        return;
      }
      info.elements.push(el);
      info.minX = Math.min(info.minX, box.x);
      info.minY = Math.min(info.minY, box.y);
      info.maxX = Math.max(info.maxX, box.x + box.width);
      info.maxY = Math.max(info.maxY, box.y + box.height);
    });
  }

  const ns = "http://www.w3.org/2000/svg";
  for (const [svg, measureMap] of bySvg.entries()) {
    const measures = Array.from(measureMap.values())
      .filter((m) => Number.isFinite(m.minX))
      .sort((a, b) => a.minY - b.minY || a.minX - b.minX);
    if (!measures.length) continue;

    const rowGroups = [];
    const rowThreshold = 65;
    measures.forEach((m) => {
      const centerY = (m.minY + m.maxY) / 2;
      const existing = rowGroups.find((row) => Math.abs(row.centerY - centerY) <= rowThreshold);
      if (existing) {
        existing.items.push(m);
        existing.centerY = (existing.centerY * (existing.items.length - 1) + centerY) / existing.items.length;
      } else {
        rowGroups.push({ centerY, items: [m] });
      }
    });
    rowGroups.forEach((row) => row.items.sort((a, b) => a.minX - b.minX));

    const lineNodes = Array.from(svg.querySelectorAll("line"));
    const pathNodes = Array.from(svg.querySelectorAll("path"));
    const lyricTextNodes = Array.from(svg.querySelectorAll("text, text tspan"));
    const isLyricToken = (text) => /^(?:[가-힣]|-|[!?.,~])+$/.test(String(text || "").trim());

    rowGroups.forEach((row) => {
      const rowMinX = Math.min(...row.items.map((it) => it.minX));
      const rowMaxX = Math.max(...row.items.map((it) => it.maxX));
      const rowMinY = Math.min(...row.items.map((it) => it.minY));
      const rowMaxY = Math.max(...row.items.map((it) => it.maxY));
      const rowCenterY = (rowMinY + rowMaxY) / 2;

      const staffLineBoxes = [];
      lineNodes.forEach((line) => {
        let box;
        try {
          box = line.getBBox();
        } catch {
          return;
        }
        if (!Number.isFinite(box.x) || !Number.isFinite(box.y)) return;
        const isHorizontalStaff = box.width > 80 && box.height <= 2.5;
        if (!isHorizontalStaff) return;
        const cy = box.y + box.height / 2;
        const cx = box.x + box.width / 2;
        if (Math.abs(cy - rowCenterY) > 55) return;
        if (cx < rowMinX - 80 || cx > rowMaxX + 80) return;
        staffLineBoxes.push(box);
      });

      const rowStaffMinY = staffLineBoxes.length ? Math.min(...staffLineBoxes.map((b) => b.y)) : rowMinY - 10;
      const rowStaffMaxY = staffLineBoxes.length
        ? Math.max(...staffLineBoxes.map((b) => b.y + b.height))
        : rowMaxY + 10;

      const barlineXs = [];
      const staffHeight = Math.max(18, rowStaffMaxY - rowStaffMinY);
      const barlineCandidates = [...lineNodes, ...pathNodes];
      barlineCandidates.forEach((el) => {
        let box;
        try {
          box = el.getBBox();
        } catch {
          return;
        }
        if (!Number.isFinite(box.x) || !Number.isFinite(box.y)) return;
        const isVertical = box.height >= staffHeight * 0.88 && box.width <= 3.2;
        if (!isVertical) return;
        const lineTop = box.y;
        const lineBottom = box.y + box.height;
        const spansWholeStaff = lineTop <= rowStaffMinY + 3 && lineBottom >= rowStaffMaxY - 3;
        if (!spansWholeStaff) return;
        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2;
        if (cx < rowMinX - 60 || cx > rowMaxX + 60) return;
        if (cy < rowStaffMinY - 20 || cy > rowStaffMaxY + 20) return;
        barlineXs.push(cx);
      });
      barlineXs.sort((a, b) => a - b);
      const uniqueBarlineXs = [];
      barlineXs.forEach((x) => {
        const last = uniqueBarlineXs[uniqueBarlineXs.length - 1];
        if (!Number.isFinite(last) || Math.abs(last - x) > 2) uniqueBarlineXs.push(x);
      });

      row.items.forEach((m, idx) => {
        const prev = idx > 0 ? row.items[idx - 1] : null;
        const next = idx < row.items.length - 1 ? row.items[idx + 1] : null;
        const prevMidX = prev ? (prev.minX + prev.maxX) / 2 : Number.NEGATIVE_INFINITY;
        const nextMidX = next ? (next.minX + next.maxX) / 2 : Number.POSITIVE_INFINITY;

        const leftCandidates = uniqueBarlineXs.filter((x) => x <= m.minX + 10 && x >= prevMidX - 16);
        const rightCandidates = uniqueBarlineXs.filter((x) => x >= m.maxX - 10 && x <= nextMidX + 16);
        const leftBarline = leftCandidates.length ? leftCandidates[leftCandidates.length - 1] : undefined;
        const rightBarline = rightCandidates.length ? rightCandidates[0] : undefined;

        const leftBoundary = Number.isFinite(leftBarline)
          ? leftBarline
          : prev
            ? (prev.maxX + m.minX) / 2
            : m.minX - 10;
        const rightBoundary = Number.isFinite(rightBarline)
          ? rightBarline
          : next
            ? (m.maxX + next.minX) / 2
            : m.maxX + 10;
        if (!Number.isFinite(leftBoundary) || !Number.isFinite(rightBoundary) || rightBoundary <= leftBoundary) return;

        let lyricMaxY = -Infinity;
        lyricTextNodes.forEach((textEl) => {
          const text = (textEl.textContent || "").trim();
          if (!isLyricToken(text)) return;
          let box;
          try {
            box = textEl.getBBox();
          } catch {
            return;
          }
          const cx = box.x + box.width / 2;
          const cy = box.y + box.height / 2;
          if (cx < leftBoundary - 2 || cx > rightBoundary + 2) return;
          if (cy < rowStaffMaxY + 2 || cy > rowStaffMaxY + 86) return;
          lyricMaxY = Math.max(lyricMaxY, box.y + box.height);
        });

        const top = Math.min(m.minY, rowStaffMinY) - 4;
        let bottom = Number.isFinite(lyricMaxY) ? lyricMaxY + 6 : Math.max(m.maxY, rowStaffMaxY) + 8;
        bottom = Math.min(bottom, rowStaffMaxY + 86);

        const rectX = leftBoundary;
        const rectY = top;
        const rectW = Math.max(20, rightBoundary - leftBoundary);
        const rectH = Math.max(20, bottom - top);

        if (isTeacherPreviewMeasureSelected(m.measureNumber)) {
          const rect = document.createElementNS(ns, "rect");
          rect.setAttribute("class", "teacher-preview-measure-box active");
          rect.setAttribute("x", String(rectX));
          rect.setAttribute("y", String(rectY));
          rect.setAttribute("width", String(rectW));
          rect.setAttribute("height", String(rectH));
          rect.setAttribute("rx", "12");
          rect.setAttribute("ry", "12");
          svg.insertBefore(rect, svg.firstChild);
        }

        const svgRect = svg.getBoundingClientRect();
        const vb = svg.viewBox?.baseVal;
        const vbWidth = vb && vb.width ? vb.width : Number(svg.getAttribute("width")) || 1;
        const vbHeight = vb && vb.height ? vb.height : Number(svg.getAttribute("height")) || 1;
        const left = svgRect.left + (rectX / vbWidth) * svgRect.width;
        const topPx = svgRect.top + (rectY / vbHeight) * svgRect.height;
        const right = svgRect.left + ((rectX + rectW) / vbWidth) * svgRect.width;
        const bottomPx = svgRect.top + ((rectY + rectH) / vbHeight) * svgRect.height;
        appState.teacherPreviewMeasureHitBoxes.push({
          measureNumber: m.measureNumber,
          left,
          right,
          top: topPx,
          bottom: bottomPx,
        });
      });
    });
  }
  updateTeacherPlaybackButtonsState();
}

function toggleTeacherPreviewMeasure(measureNumber) {
  const target = Number(measureNumber);
  if (!Number.isFinite(target)) return;
  const range = getTeacherPreviewSelectedRange();
  if (!range) {
    appState.teacherPreviewRangeStart = target;
    appState.teacherPreviewRangeEnd = target;
    drawTeacherPreviewMeasureHighlights();
    showToast(`${target}마디 선택`);
    return;
  }

  // Deselect is only allowed for selected range boundaries.
  if (target >= range.start && target <= range.end) {
    if (range.start === range.end) {
      appState.teacherPreviewRangeStart = null;
      appState.teacherPreviewRangeEnd = null;
      drawTeacherPreviewMeasureHighlights();
      showToast("선택 해제");
      return;
    }
    if (target === range.start) {
      appState.teacherPreviewRangeStart = range.start + 1;
      appState.teacherPreviewRangeEnd = range.end;
      drawTeacherPreviewMeasureHighlights();
      showToast(`${appState.teacherPreviewRangeStart}~${appState.teacherPreviewRangeEnd}마디 선택`);
      return;
    }
    if (target === range.end) {
      appState.teacherPreviewRangeStart = range.start;
      appState.teacherPreviewRangeEnd = range.end - 1;
      drawTeacherPreviewMeasureHighlights();
      showToast(`${appState.teacherPreviewRangeStart}~${appState.teacherPreviewRangeEnd}마디 선택`);
      return;
    }
    // Middle measure click keeps selection (only boundary can be deselected).
    drawTeacherPreviewMeasureHighlights();
    showToast(`${range.start}~${range.end}마디 선택`);
    return;
  }

  // allow extending only with adjacent measure
  if (target === range.start - 1) {
    appState.teacherPreviewRangeStart = target;
    appState.teacherPreviewRangeEnd = range.end;
    drawTeacherPreviewMeasureHighlights();
    showToast(`${appState.teacherPreviewRangeStart}~${appState.teacherPreviewRangeEnd}마디 선택`);
    return;
  }
  if (target === range.end + 1) {
    appState.teacherPreviewRangeStart = range.start;
    appState.teacherPreviewRangeEnd = target;
    drawTeacherPreviewMeasureHighlights();
    showToast(`${appState.teacherPreviewRangeStart}~${appState.teacherPreviewRangeEnd}마디 선택`);
    return;
  }

  // non-adjacent click starts a new contiguous selection.
  appState.teacherPreviewRangeStart = target;
  appState.teacherPreviewRangeEnd = target;
  drawTeacherPreviewMeasureHighlights();
  showToast(`${target}마디 선택`);
}

function applyTeacherPreviewViewportFit() {
  if (appState.teacherViewMode !== "preview" || !dom.teacherScoreContainer) return;
  const container = dom.teacherScoreContainer;
  const content = container.firstElementChild;
  if (!(content instanceof HTMLElement)) return;

  container.style.height = "";
  container.style.paddingTop = "";
  content.style.transform = "";
  content.style.transformOrigin = "";
  if (appState.teacherSelectedSubmission?.songId === "3_dotori") {
    content.style.transform = "translateY(-20px)";
    content.style.transformOrigin = "top left";
    container.style.paddingTop = "0";
  }
  drawTeacherPreviewMeasureHighlights();
}

function queueTeacherPreviewViewportFit() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      applyTeacherPreviewViewportFit();
    });
  });
}

function clearTeacherPlaybackHighlight() {
  [dom.teacherScoreContainer, dom.teacherFullscreenScoreContainer].forEach((container) => {
    if (!container) return;
    container.querySelectorAll(".teacher-playing-note, .playback-note").forEach((el) => {
      el.classList.remove("teacher-playing-note");
      el.classList.remove("playback-note");
      if (el instanceof HTMLElement) {
        el.style.filter = "";
      }
    });
  });
  dom.teacherScoreContainer?.querySelectorAll(".teacher-playback-box").forEach((el) => el.remove());
  dom.teacherFullscreenScoreContainer?.querySelectorAll(".teacher-playback-box").forEach((el) => el.remove());
  const groups = [
    appState.teacherSelectedSubmission?.noteModels || [],
    appState.teacherFullscreenNoteModels || [],
  ];
  groups.forEach((noteModels) => {
    noteModels.forEach((note) => {
      note.renderedElement?.classList.remove("teacher-playing-note");
      note.renderedElement?.classList.remove("playback-note");
    });
  });
  appState.teacherPlaybackActiveNoteId = null;
}

function drawTeacherPlaybackOverlay(noteEl) {
  if (!noteEl) return;
  const svg = noteEl.ownerSVGElement;
  if (!svg) return;
  let box;
  try {
    box = noteEl.getBBox();
  } catch {
    return;
  }
  const ns = "http://www.w3.org/2000/svg";
  const rect = document.createElementNS(ns, "rect");
  rect.setAttribute("class", "teacher-playback-box");
  rect.setAttribute("x", String(box.x - 5));
  rect.setAttribute("y", String(box.y - 10));
  rect.setAttribute("width", String(box.width + 10));
  rect.setAttribute("height", String(box.height + 20));
  rect.setAttribute("rx", "8");
  rect.setAttribute("ry", "8");
  rect.style.pointerEvents = "none";
  svg.appendChild(rect);
}

function getTeacherHighlightTargets(container) {
  if (!container) return [];
  const byData = Array.from(container.querySelectorAll("[data-note-id]"));
  if (byData.length > 0) return byData;
  return getScoreNoteElementsForContainer(container);
}

function getTeacherHighlightTargetByOrder(container, order) {
  if (!container || !Number.isFinite(order) || order < 0) return null;
  const byOrder = container.querySelector(`[data-render-order="${order}"]`);
  if (byOrder) return byOrder;
  const targets = getTeacherHighlightTargets(container);
  return targets[order] || null;
}

function setTeacherPlaybackHighlight(noteId, renderOrder = -1, visualIndex = -1) {
  const order =
    Number.isFinite(visualIndex) && visualIndex >= 0
      ? visualIndex
      : Number.isFinite(renderOrder) && renderOrder >= 0
      ? renderOrder
      : -1;
  if (!noteId && order < 0) return clearTeacherPlaybackHighlight();
  clearTeacherPlaybackHighlight();
  const mainNoteModels = appState.teacherSelectedSubmission?.noteModels || [];
  const fullscreenNoteModels = appState.teacherFullscreenNoteModels || [];
  const groups = [mainNoteModels, fullscreenNoteModels];
  let matched = false;
  groups.forEach((noteModels) => {
    const container = noteModels === fullscreenNoteModels ? dom.teacherFullscreenScoreContainer : dom.teacherScoreContainer;
    let el = order >= 0 ? getTeacherHighlightTargetByOrder(container, order) : null;
    if (!el && noteId) {
      const note = noteModels.find((n) => n.noteId === noteId);
      el = note?.renderedElement || null;
    }
    if (!el && noteId) {
      el = container?.querySelector(`[data-note-id="${noteId}"]`) || null;
    }
    if (!el && Number.isFinite(renderOrder) && renderOrder >= 0) {
      const container = noteModels === fullscreenNoteModels ? dom.teacherFullscreenScoreContainer : dom.teacherScoreContainer;
      el = container?.querySelector(`[data-render-order="${renderOrder}"]`) || null;
      if (!el) {
        const targets = getTeacherHighlightTargets(container);
        el = targets[renderOrder] || null;
      }
    }
    if (!el) return;
    el.classList.add("teacher-playing-note");
    el.classList.add("playback-note");
    if (el instanceof HTMLElement) {
      el.style.filter = "drop-shadow(0 0 5px rgba(63, 176, 71, 0.95)) drop-shadow(0 0 10px rgba(63, 176, 71, 0.8)) drop-shadow(0 0 18px rgba(120, 230, 126, 0.75))";
    }
    drawTeacherPlaybackOverlay(el);
    matched = true;
  });
  if (!matched) return;
  appState.teacherPlaybackActiveNoteId = noteId;
  appState.teacherPlaybackVisualIndex = order >= 0 ? order : -1;
}

async function renderTeacherSubmissionScore(submission) {
  if (!dom.teacherScoreContainer || !dom.teacherSubmissionMeta) return;
  stopTeacherPlayback();
  appState.teacherSelectedSubmission = null;
  appState.teacherFullscreenNoteModels = [];
  appState.teacherPreviewMeasureHitBoxes = [];
  if (appState.teacherViewMode !== "preview") {
    appState.teacherPreviewRangeStart = null;
    appState.teacherPreviewRangeEnd = null;
  }
  if (!submission) {
    dom.teacherSubmissionMeta.textContent = "제출 악보를 선택하세요.";
    dom.teacherScoreContainer.innerHTML = "";
    updateTeacherIcon(null, false);
    updateTeacherPlaybackButtonsState();
    return;
  }
  appState.teacherTempo = Math.max(0, Math.min(200, Math.round(submission.tempo || 90)));
  updateTeacherTempoControls();
  const isPreview = String(submission.id || "").startsWith("preview_");
  dom.teacherSubmissionMeta.textContent = isPreview
    ? `${submission.grade}학년 · ${submission.songName}`
    : `${submission.grade}학년 · ${submission.songName} · 제출 ${formatSubmissionTime(submission.submittedAt)}`;
  dom.teacherScoreContainer.innerHTML = "";
  try {
    if (!window.opensheetmusicdisplay) throw new Error("OSMD 라이브러리를 찾지 못했습니다.");
    appState.teacherOsmd = new opensheetmusicdisplay.OpenSheetMusicDisplay(dom.teacherScoreContainer, {
      autoResize: true,
      drawTitle: true,
      drawComposer: true,
      drawPartNames: false,
      drawMeasureNumbers: true,
      newSystemFromXML: true,
      newSystemFromNewPageInXML: true,
    });
    await appState.teacherOsmd.load(stripTeacherCredits(submission.xmlText));
    await appState.teacherOsmd.render();
    stripRenderedNoteAccidentals(dom.teacherScoreContainer);
    keepOnlyFirstMeasureNumberPerRow(dom.teacherScoreContainer);
    const parsed = parseMusicXMLToModel(submission.xmlText);
    appState.teacherSelectedSubmission = {
      ...submission,
      noteModels: parsed.noteModels,
      measureModels: parsed.measureModels,
    };
    mapRenderedElementsToNoteModels(appState.teacherSelectedSubmission.noteModels, dom.teacherScoreContainer);
    clearTeacherPlaybackHighlight();
    drawTeacherPreviewMeasureHighlights();
    queueTeacherPreviewViewportFit();
    updateTeacherIcon(submission.songId, false);
    mountTeacherIconIntoScoreContent();
    updateTeacherPlaybackButtonsState();
  } catch (error) {
    console.error("[renderTeacherSubmissionScore]", error);
    dom.teacherScoreContainer.innerHTML = '<p class="teacher-submission-meta">악보를 렌더링하지 못했어요.</p>';
    updateTeacherIcon(null, false);
    updateTeacherPlaybackButtonsState();
  }
}

function clearTeacherPlaybackSchedule() {
  if (!window.Tone) return;
  appState.teacherPlaybackEventIds.forEach((id) => Tone.Transport.clear(id));
  appState.teacherPlaybackEventIds = [];
  if (appState.teacherPlaybackStopEventId !== null) {
    Tone.Transport.clear(appState.teacherPlaybackStopEventId);
    appState.teacherPlaybackStopEventId = null;
  }
}

function stopTeacherHighlightFollower() {
  if (appState.teacherHighlightTimerId !== null) {
    clearInterval(appState.teacherHighlightTimerId);
    appState.teacherHighlightTimerId = null;
  }
}

function startTeacherHighlightFollower(notes) {
  stopTeacherHighlightFollower();
  if (!window.Tone || !Array.isArray(notes) || notes.length === 0) return;
  const timeline = [];
  let cursor = 0;
  let visualIndex = -1;
  notes.forEach((note, index) => {
    const dur = Math.max(0.01, Number(note.durationSec) || 0.01);
    if (!note.isRest) visualIndex += 1;
    timeline.push({ start: cursor, end: cursor + dur, note, index, visualIndex });
    cursor += dur;
  });
  if (timeline.length === 0) return;
  appState.teacherHighlightTimerId = setInterval(() => {
    if (appState.teacherPlaybackState !== "playing") return;
    const t = Tone.Transport.seconds || 0;
    const current = timeline.find((item) => t >= item.start && t < item.end);
    if (!current) {
      clearTeacherPlaybackHighlight();
      return;
    }
    if (current.note.isRest) {
      clearTeacherPlaybackHighlight();
      return;
    }
    setTeacherPlaybackHighlight(current.note.noteId || null, current.index, current.visualIndex);
  }, 55);
}

function stopTeacherPlayback() {
  if (window.Tone) {
    Tone.Transport.stop();
    Tone.Transport.position = 0;
  }
  stopTeacherHighlightFollower();
  clearTeacherPlaybackSchedule();
  appState.teacherPlaybackState = "stopped";
  appState.teacherPlaybackNotes = [];
  appState.teacherPlaybackVisualIndex = -1;
  clearTeacherPlaybackHighlight();
  updateTeacherIcon(appState.teacherSelectedSubmission?.songId || null, false);
  updateTeacherPlaybackButtonsState();
}

function pauseTeacherPlayback() {
  if (!window.Tone) return;
  if (appState.teacherPlaybackState !== "playing") return;
  Tone.Transport.pause();
  stopTeacherHighlightFollower();
  appState.teacherPlaybackState = "paused";
  updateTeacherIcon(appState.teacherSelectedSubmission?.songId || null, false);
  updateTeacherPlaybackButtonsState();
}

function getTeacherNoteDurationSec(note, measureModels, tempo) {
  const measure = measureModels.find((m) => m.number === note.measureNumber);
  const durationBeats = note.durationDivisions / (measure?.divisions || 1);
  return durationBeats * (60 / (tempo || 90));
}

function buildTeacherPlaybackNotes(rawNotes, measureModels, tempo) {
  const playback = [];
  for (let i = 0; i < rawNotes.length; i += 1) {
    const note = rawNotes[i];
    if (!note) continue;
    if (note.isRest || !note.pitch) {
      playback.push({
        sourceIndex: i,
        isRest: true,
        noteId: note.noteId,
        pitch: null,
        playbackAlter: null,
        keyFifths: note.keyFifths ?? 0,
        staccato: false,
        durationSec: getTeacherNoteDurationSec(note, measureModels, tempo),
      });
      continue;
    }
    let durationSec = getTeacherNoteDurationSec(note, measureModels, tempo);
    let isStaccato = Boolean(note.isStaccato);
    let cursor = i;
    while (hasTieType(rawNotes[cursor], "start")) {
      const next = rawNotes[cursor + 1];
      if (!next || next.isRest || !next.pitch) break;
      if (!areSamePitchByMidi(rawNotes[cursor], next)) break;
      if (!hasTieType(next, "stop")) break;
      durationSec += getTeacherNoteDurationSec(next, measureModels, tempo);
      isStaccato = isStaccato || Boolean(next.isStaccato);
      cursor += 1;
    }
    playback.push({
      sourceIndex: i,
      isRest: false,
      noteId: note.noteId,
      pitch: note.pitch,
      playbackAlter: note.playbackAlter ?? null,
      keyFifths: note.keyFifths ?? 0,
      staccato: isStaccato,
      durationSec,
    });
    i = cursor;
  }
  return playback;
}

async function playTeacherSubmission(options = {}) {
  const forceFull = Boolean(options.forceFull);
  try {
    const submission = appState.teacherSelectedSubmission;
    if (!submission) return showToast("먼저 제출 악보를 선택하세요");
    if (!window.Tone) return showToast("재생 엔진(Tone.js)을 찾을 수 없어요");
    if (appState.teacherViewMode === "preview" && !forceFull && !getTeacherPreviewSelectedRange()) {
      showToast("마디를 먼저 선택해 주세요");
      updateTeacherPlaybackButtonsState();
      return;
    }
    if (appState.teacherPlaybackState === "paused") {
      Tone.Transport.start("+0.01");
      appState.teacherPlaybackState = "playing";
      updateTeacherIcon(submission.songId, true);
      updateTeacherPlaybackButtonsState();
      return;
    }
    await Tone.start();
    Tone.Transport.cancel(0);
    stopMetronomeLoop();
    clearTeacherPlaybackSchedule();
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    Tone.Transport.bpm.value = appState.teacherTempo || 90;

    let rawNotes = (submission.noteModels || []).filter((n) => n.isRenderable && !n.isGrace && !n.isChord);
    const previewRange = getTeacherPreviewSelectedRange();
    const hasPreviewMeasureSelection = Boolean(previewRange);
    if (appState.teacherViewMode === "preview" && !forceFull && hasPreviewMeasureSelection) {
      rawNotes = rawNotes.filter((n) => {
        const m = Number(n.measureNumber);
        return Number.isFinite(m) && m >= previewRange.start && m <= previewRange.end;
      });
      if (!rawNotes.length) {
        appState.teacherPreviewRangeStart = null;
        appState.teacherPreviewRangeEnd = null;
        drawTeacherPreviewMeasureHighlights();
        rawNotes = (submission.noteModels || []).filter((n) => n.isRenderable && !n.isGrace && !n.isChord);
      }
    }
    const notes = buildTeacherPlaybackNotes(rawNotes, submission.measureModels || [], appState.teacherTempo || 90);
    appState.teacherPlaybackNotes = notes;
    if (!notes.length) return showToast("재생할 음표가 없어요");

    const sampler = await getSampler(appState.teacherCurrentInstrumentId || "acoustic_piano");
    if (!sampler) return showToast("악기 샘플을 로드하지 못했어요");

    let cursorSec = 0;
    notes.forEach((note, index) => {
      const highlightId = Tone.Transport.schedule((time) => {
        Tone.Draw.schedule(() => {
          try {
            if (note.isRest) clearTeacherPlaybackHighlight();
            else {
              setTeacherPlaybackHighlight(note.noteId || null, -1, -1);
            }
          } catch (error) {
            console.error("[teacher-highlight]", error);
          }
        }, time);
      }, cursorSec);
      appState.teacherPlaybackEventIds.push(highlightId);
      if (!note.isRest && note.pitch) {
        const midi = noteToMidi(note);
        if (!Number.isFinite(midi)) return;
        const noteName = midiToToneNoteName(midi);
        const playedDuration = note.staccato
          ? Math.max(0.04, note.durationSec * 0.45)
          : Math.max(0.05, note.durationSec * 0.96);
        const id = Tone.Transport.schedule((time) => {
          sampler.triggerAttackRelease(noteName, playedDuration, time, 0.9);
        }, cursorSec);
        appState.teacherPlaybackEventIds.push(id);
      }
      cursorSec += Math.max(0.01, note.durationSec);
    });

    appState.teacherPlaybackStopEventId = Tone.Transport.scheduleOnce(() => {
      stopTeacherPlayback();
    }, Math.max(0.05, cursorSec + 0.02));

    Tone.Transport.start("+0.01");
    appState.teacherPlaybackState = "playing";
    updateTeacherIcon(submission.songId, true);
    updateTeacherPlaybackButtonsState();
  } catch (error) {
    console.error("[playTeacherSubmission]", error);
    stopTeacherPlayback();
    showToast(`재생 오류: ${error.message || "알 수 없는 오류"}`);
    updateTeacherPlaybackButtonsState();
  }
}

function initTeacherInstrumentSelect() {
  if (!dom.teacherInstrumentSelect) return;
  dom.teacherInstrumentSelect.innerHTML = "";
  SAMPLE_INSTRUMENTS.forEach((instrument) => {
    const option = document.createElement("option");
    option.value = instrument.id;
    option.textContent = instrument.name;
    dom.teacherInstrumentSelect.appendChild(option);
  });
  if (!SAMPLE_INSTRUMENTS.some((item) => item.id === appState.teacherCurrentInstrumentId)) {
    appState.teacherCurrentInstrumentId = SAMPLE_INSTRUMENTS[0]?.id || "acoustic_piano";
  }
  dom.teacherInstrumentSelect.value = appState.teacherCurrentInstrumentId;
  dom.teacherInstrumentSelect.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    appState.teacherCurrentInstrumentId = target.value;
  });
}

function renderTeacherSubmissionList() {
  if (!dom.teacherSubmissionList) return;
  const submissions = getStoredSubmissions();
  const sorted = [...submissions].sort((a, b) => {
    const at = new Date(a.submittedAt || 0).getTime();
    const bt = new Date(b.submittedAt || 0).getTime();
    if (appState.teacherSortMode === "oldest") return at - bt;
    if (appState.teacherSortMode === "grade") {
      const g = Number(a.grade || 0) - Number(b.grade || 0);
      if (g !== 0) return g;
      return bt - at;
    }
    if (appState.teacherSortMode === "name") {
      const an = String(a.studentName || "").trim();
      const bn = String(b.studentName || "").trim();
      const cmp = an.localeCompare(bn, "ko");
      if (cmp !== 0) return cmp;
      return bt - at;
    }
    return bt - at; // latest
  });

  const validIds = new Set(sorted.map((s) => s.id));
  appState.teacherSelectedIds = new Set([...appState.teacherSelectedIds].filter((id) => validIds.has(id)));

  dom.teacherSubmissionList.innerHTML = "";
  if (sorted.length === 0) {
    appState.teacherSelectedSubmissionId = null;
    appState.teacherSelectedIds.clear();
    if (dom.teacherSelectAllCheckbox) dom.teacherSelectAllCheckbox.checked = false;
    if (dom.teacherDeleteSelectedButton) dom.teacherDeleteSelectedButton.disabled = true;
    const empty = document.createElement("p");
    empty.className = "teacher-submission-meta";
    empty.textContent = "아직 제출된 악보가 없습니다.";
    dom.teacherSubmissionList.appendChild(empty);
    renderTeacherSubmissionScore(null);
    return;
  }

  sorted.forEach((submission) => {
    const item = document.createElement("article");
    item.className = "teacher-item";
    const checkWrap = document.createElement("label");
    checkWrap.className = "teacher-item-check-wrap";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.dataset.selectSubmissionId = submission.id;
    check.checked = appState.teacherSelectedIds.has(submission.id);
    const checkText = document.createElement("span");
    checkText.textContent = "선택";
    checkWrap.append(check, checkText);

    const title = document.createElement("p");
    title.className = "teacher-item-title";
    title.textContent = `${submission.grade}학년 - ${submission.studentName || "이름없음"}`;
    const meta = document.createElement("p");
    meta.className = "teacher-item-meta";
    meta.textContent = `${submission.songName} · 제출 ${formatSubmissionTime(submission.submittedAt)}`;
    const row = document.createElement("div");
    row.className = "row";
    const viewBtn = document.createElement("button");
    viewBtn.type = "button";
    viewBtn.className = "action-btn";
    viewBtn.dataset.submissionId = submission.id;
    viewBtn.textContent = "악보 보기";
    row.appendChild(viewBtn);
    item.append(checkWrap, title, meta, row);
    dom.teacherSubmissionList.appendChild(item);
  });

  const selected =
    sorted.find((item) => item.id === appState.teacherSelectedSubmissionId) || sorted[0] || null;
  appState.teacherSelectedSubmissionId = selected?.id || null;

  if (dom.teacherSelectAllCheckbox) {
    dom.teacherSelectAllCheckbox.checked = sorted.length > 0 && sorted.every((s) => appState.teacherSelectedIds.has(s.id));
  }
  if (dom.teacherDeleteSelectedButton) {
    dom.teacherDeleteSelectedButton.disabled = appState.teacherSelectedIds.size === 0;
  }
  renderTeacherSubmissionScore(selected);
}

function deleteSubmissionById(submissionId) {
  if (!submissionId) return;
  const submissions = getStoredSubmissions();
  const next = submissions.filter((item) => item.id !== submissionId);
  saveStoredSubmissions(next);
  if (appState.teacherSelectedSubmissionId === submissionId) {
    appState.teacherSelectedSubmissionId = next[0]?.id || null;
  }
  renderTeacherSubmissionList();
}

function deleteSubmissionsByIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return;
  const idSet = new Set(ids);
  const submissions = getStoredSubmissions();
  const next = submissions.filter((item) => !idSet.has(item.id));
  saveStoredSubmissions(next);
  if (appState.teacherSelectedSubmissionId && idSet.has(appState.teacherSelectedSubmissionId)) {
    appState.teacherSelectedSubmissionId = next[0]?.id || null;
  }
  appState.teacherSelectedIds = new Set([...appState.teacherSelectedIds].filter((id) => !idSet.has(id)));
  renderTeacherSubmissionList();
}

function showTeacherScreen() {
  stopScore();
  stopTeacherPlayback();
  closeTeacherFullscreen();
  appState.teacherViewMode = "preview";
  dom.homeScreen?.classList.add("is-hidden");
  dom.editorScreen?.classList.add("is-hidden");
  dom.teacherScreen?.classList.remove("is-hidden");
  updateBodyOverflowBySong();
  updateTeacherTempoControls();
  updateTeacherListCollapsedUI();
  if (dom.teacherSortSelect) dom.teacherSortSelect.value = appState.teacherSortMode || "latest";
  if (dom.teacherModeSelect) dom.teacherModeSelect.value = appState.teacherViewMode || "submission";
  setTeacherViewMode(appState.teacherViewMode || "submission");
}

function showHomeScreen() {
  stopScore();
  stopTeacherPlayback();
  closeTeacherFullscreen();
  dom.homeScreen?.classList.remove("is-hidden");
  dom.teacherScreen?.classList.add("is-hidden");
  dom.editorScreen?.classList.add("is-hidden");
  setActiveHomeGrade(appState.homeGrade || 3);
  updateBodyOverflowBySong();
  updateSongLayoutMode();
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
  dom.teacherScreen?.classList.add("is-hidden");
  stopTeacherPlayback();
  closeTeacherFullscreen();
  updateBodyOverflowBySong();
  updateSongLayoutMode();
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
      allowAccidentals: SONG_ALLOW_ACCIDENTALS.has(song.id),
      allowedDurations: ["16th", "eighth", "quarter", "half", "whole"],
      maxEditsPerMeasure: 999,
    },
  };
}

async function loadRules(parsed) {
  const song = getCurrentSongOption();
  if (song.rulesPath) {
    const res = await fetch(song.rulesPath, { cache: "no-store" });
    if (res.ok) return res.json();
  }
  return buildDefaultRulesFromParsed(parsed, song);
}

async function loadScoreXml() {
  const song = getCurrentSongOption();
  return loadScoreXmlBySong(song);
}

async function loadScoreXmlBySong(song) {
  if (!song) throw new Error("곡 정보를 찾을 수 없습니다.");
  if (song.musicxmlPath) {
    const musicXmlRes = await fetch(song.musicxmlPath, { cache: "no-store" });
    if (musicXmlRes.ok) return musicXmlRes.text();
  }

  if (song.mxlPath) {
    const mxlRes = await fetch(song.mxlPath, { cache: "no-store" });
    if (mxlRes.ok) return parseMxlToXml(await mxlRes.arrayBuffer());
  }
  throw new Error("선택한 곡의 score.musicxml / score.mxl 로드 실패");
}

function stripCredits(xmlText) {
  // Keep original score credits/creators exactly as written in each source score.
  return xmlText;
}

function stripTeacherCredits(xmlText) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, "application/xml");
    const metaPattern = /(작사|작곡|편곡|전래동요|민요)/;
    Array.from(doc.querySelectorAll("credit")).forEach((credit) => {
      const words = Array.from(credit.querySelectorAll("credit-words"))
        .map((n) => (n.textContent || "").trim())
        .join(" ");
      if (metaPattern.test(words)) {
        credit.remove();
      }
    });
    Array.from(doc.querySelectorAll("identification > creator")).forEach((node) => node.remove());
    return new XMLSerializer().serializeToString(doc);
  } catch (error) {
    console.error("[stripTeacherCredits]", error);
    return xmlText;
  }
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

function applySongComposerOverride(xmlDoc, songId, sourceXmlText = "") {
  if (!xmlDoc || !songId) return;
  const normalize = (s) => (s || "").replace(/\s+/g, " ").trim();
  const isPlaceholder = (text) => text === "작곡가 / 편곡가" || text === "작사 / 작곡";
  const isMeta = (text) => /(작사|작곡|편곡|민요|전래동요|작사작곡|작사 작곡)/.test(text);

  const sourceDoc =
    sourceXmlText && typeof sourceXmlText === "string"
      ? new DOMParser().parseFromString(sourceXmlText, "application/xml")
      : xmlDoc;

  const extractedFromCredits = Array.from(sourceDoc.querySelectorAll("credit-words"))
    .map((n) => normalize(n.textContent))
    .filter((t) => t && isMeta(t) && !isPlaceholder(t));
  const extractedFromCreators = Array.from(sourceDoc.querySelectorAll("identification > creator"))
    .map((n) => {
      const t = normalize(n.textContent);
      if (!t || isPlaceholder(t)) return "";
      const type = (n.getAttribute("type") || "").toLowerCase();
      if (type === "lyricist" && !t.includes("작사")) return `${t} 작사`;
      if (type === "composer" && !/(작곡|편곡|민요|전래동요)/.test(t)) return `${t} 작곡`;
      return t;
    })
    .filter((t) => t && isMeta(t) && !isPlaceholder(t));

  let lines = [...extractedFromCredits];
  extractedFromCreators.forEach((t) => {
    if (!lines.includes(t)) lines.push(t);
  });

  const overrideComposer = SONG_COMPOSER_OVERRIDE[songId] || null;
  if (overrideComposer) {
    const idx = lines.findIndex((t) => /(작곡|편곡|민요|전래동요)/.test(t));
    if (idx >= 0) lines[idx] = overrideComposer;
    else lines.push(overrideComposer);
  }

  lines = lines.filter((t, i, arr) => t && arr.indexOf(t) === i);

  // Remove placeholders in creator regardless.
  Array.from(xmlDoc.querySelectorAll("identification > creator")).forEach((node) => {
    const text = normalize(node.textContent);
    if (isPlaceholder(text)) node.remove();
  });

  const placeholderWords = Array.from(xmlDoc.querySelectorAll("credit-words")).filter((node) =>
    isPlaceholder(normalize(node.textContent))
  );

  if (songId === "gabaram") {
    Array.from(xmlDoc.querySelectorAll("credit-words")).forEach((node) => {
      const text = normalize(node.textContent);
      if (text === "김규환") {
        const credit = node.parentElement;
        if (credit?.tagName === "credit") credit.remove();
        else node.remove();
      }
    });
    Array.from(xmlDoc.querySelectorAll("identification > creator")).forEach((node) => {
      const text = normalize(node.textContent);
      if (text === "김규환") node.remove();
    });
  }

  // 옥수수 하모니카는 placeholder 문구를 그냥 제거.
  if (songId === "4_oksusu_hamonika") {
    placeholderWords.forEach((node) => {
      const credit = node.parentElement;
      if (credit?.tagName === "credit") credit.remove();
      else node.remove();
    });
    return;
  }

  if (placeholderWords.length > 0) {
    if (lines.length > 0) {
      placeholderWords[0].textContent = lines.join("\n");
      for (let i = 1; i < placeholderWords.length; i += 1) {
        const node = placeholderWords[i];
        const credit = node.parentElement;
        if (credit?.tagName === "credit") credit.remove();
        else node.remove();
      }
    } else {
      placeholderWords.forEach((node) => {
        const credit = node.parentElement;
        if (credit?.tagName === "credit") credit.remove();
        else node.remove();
      });
    }
    return;
  }

  // If score has no meta credit lines at all, add right-top fallback lines.
  const hasMetaInRendered = Array.from(xmlDoc.querySelectorAll("credit-words"))
    .map((n) => normalize(n.textContent))
    .some((t) => t && isMeta(t));
  if (hasMetaInRendered || lines.length === 0) return;

  const scoreRoot = xmlDoc.querySelector("score-partwise") || xmlDoc.documentElement;
  if (!scoreRoot) return;
  const partList = scoreRoot.querySelector("part-list");
  const topY = 146;
  const lineGap = 22;

  lines.forEach((line, idx) => {
    const credit = xmlDoc.createElement("credit");
    credit.setAttribute("page", "1");
    const words = xmlDoc.createElement("credit-words");
    words.setAttribute("default-x", "1060");
    words.setAttribute("default-y", String(topY - idx * lineGap));
    words.setAttribute("justify", "right");
    words.setAttribute("halign", "right");
    words.setAttribute("font-size", "12");
    words.textContent = line;
    credit.appendChild(words);
    if (partList) scoreRoot.insertBefore(credit, partList);
    else scoreRoot.insertBefore(credit, scoreRoot.firstChild);
  });
}

function getScoreNoteElementsForContainer(container) {
  if (!container) return [];
  const svgs = Array.from(container.querySelectorAll("svg"));
  const all = [];
  svgs.forEach((svg) => {
    let elements = Array.from(svg.querySelectorAll("g.vf-stavenote, g.vf-rest"));
    if (elements.length === 0) {
      elements = Array.from(svg.querySelectorAll("g")).filter((el) => {
        const cls = el.getAttribute("class") || "";
        return cls.includes("vf-stavenote") || cls.includes("vf-rest");
      });
    }
    if (elements.length === 0) {
      // Robust fallback for different OSMD/VexFlow DOM variants:
      // collect g groups that contain notehead/rest glyph, then keep only leaf groups.
      const groups = Array.from(svg.querySelectorAll("g"));
      const matchesNoteGlyph = (group) =>
        Boolean(group.querySelector(".vf-notehead, .vf-rest, [class*='vf-notehead'], [class*='vf-rest']"));
      const matched = groups.filter((g) => matchesNoteGlyph(g));
      if (matched.length > 0) {
        const matchedSet = new Set(matched);
        const leaf = matched.filter((g) => {
          const childGroups = Array.from(g.children).filter((ch) => ch.tagName?.toLowerCase() === "g");
          return !childGroups.some((ch) => matchedSet.has(ch));
        });
        elements = leaf.length > 0 ? leaf : matched;
      }
    }
    all.push(...elements);
  });
  return all;
}

function getScoreNoteElements() {
  return getScoreNoteElementsForContainer(dom.scoreContainer);
}

function mapRenderedElementsToNoteModels(noteModels, containerEl) {
  const noteElements = getScoreNoteElementsForContainer(containerEl);
  noteModels.forEach((note) => {
    note.renderedElement = null;
  });

  const renderableNotes = noteModels.filter((note) => note.isRenderable);
  const count = Math.min(noteElements.length, renderableNotes.length);
  for (let i = 0; i < count; i += 1) {
    const el = noteElements[i];
    const note = renderableNotes[i];
    note.renderedElement = el;
    el.dataset.noteId = note.noteId;
    el.dataset.renderOrder = String(i);
    el.style.cursor = "pointer";
  }
  return count;
}

function getRenderableNoteModels() {
  return appState.noteModels.filter((note) => note.isRenderable);
}

function mapRenderedElementsToNotes() {
  return mapRenderedElementsToNoteModels(appState.noteModels, dom.scoreContainer);
}

function mapRenderedLyricsToNotes() {
  appState.noteModels.forEach((note) => {
    note.renderedLyricElement = null;
  });
  const usedLyrics = new Set();
  const lyricNotes = getRenderableNoteModels().filter(
    (note) => note.hasLyricSlot || Boolean(note.lyricText)
  );
  lyricNotes.forEach((note) => {
    const lyricEl = findNearestLyricElementForNote(note, usedLyrics);
    if (!lyricEl) return;
    note.renderedLyricElement = lyricEl;
    lyricEl.dataset.lyricNoteId = note.noteId;
    lyricEl.style.cursor = appState.lyricEditMode ? "text" : "default";
    usedLyrics.add(lyricEl);
  });
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

function findNearestLyricElementForNote(note, usedSet = null) {
  if (!note?.renderedElement) return null;
  const svg = note.renderedElement.ownerSVGElement;
  if (!svg) return null;
  const isLyricToken = (text) => /^(?:[가-힣]|-|[!?.,~])$/.test(text);
  let noteBox;
  try {
    noteBox = note.renderedElement.getBBox();
  } catch {
    return null;
  }
  const ncx = noteBox.x + noteBox.width / 2;
  const ncy = noteBox.y + noteBox.height / 2;
  const lyricNodes = [];
  Array.from(svg.querySelectorAll("text")).forEach((textEl) => {
    const tspanChildren = Array.from(textEl.querySelectorAll("tspan"));
    if (tspanChildren.length > 0) {
      tspanChildren.forEach((tspan) => {
        if (!Array.from(tspan.querySelectorAll("tspan")).length) lyricNodes.push(tspan);
      });
      return;
    }
    lyricNodes.push(textEl);
  });
  let best = null;
  let bestScore = Number.POSITIVE_INFINITY;
  lyricNodes.forEach((el) => {
    if (usedSet?.has(el)) return;
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
  selectedNote.renderedLyricElement = lyricEl;
  lyricEl.dataset.lyricNoteId = selectedNote.noteId;
  lyricEl.classList.add("selected-lyric");
  setLyricElementHighlight(lyricEl, true);
  applyLiveLyricPreview();
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
  mapRenderedLyricsToNotes();

  removeMissionMeasureHighlights();
  const byMeasure = new Map();

  getRenderableNoteModels().forEach((note) => {
    if (!note.renderedElement) return;
    if (!byMeasure.has(note.measureNumber)) byMeasure.set(note.measureNumber, []);
    byMeasure.get(note.measureNumber).push(note.renderedElement);
  });

  const bySvg = new Map();
  for (const [measureNumber, elements] of byMeasure.entries()) {
    elements.forEach((el) => {
      const svg = el.ownerSVGElement;
      if (!svg) return;
      if (!bySvg.has(svg)) bySvg.set(svg, new Map());
      const measureMap = bySvg.get(svg);
      if (!measureMap.has(measureNumber)) {
        measureMap.set(measureNumber, { measureNumber, elements: [], minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
      }
      const info = measureMap.get(measureNumber);
      let box;
      try {
        box = el.getBBox();
      } catch {
        return;
      }
      info.elements.push(el);
      info.minX = Math.min(info.minX, box.x);
      info.minY = Math.min(info.minY, box.y);
      info.maxX = Math.max(info.maxX, box.x + box.width);
      info.maxY = Math.max(info.maxY, box.y + box.height);
    });
  }

  const ns = "http://www.w3.org/2000/svg";
  for (const [svg, measureMap] of bySvg.entries()) {
    const measures = Array.from(measureMap.values())
      .filter((m) => Number.isFinite(m.minX))
      .sort((a, b) => a.minY - b.minY || a.minX - b.minX);
    if (measures.length === 0) continue;

    const rowGroups = [];
    const rowThreshold = 65;
    measures.forEach((m) => {
      const centerY = (m.minY + m.maxY) / 2;
      const existing = rowGroups.find((row) => Math.abs(row.centerY - centerY) <= rowThreshold);
      if (existing) {
        existing.items.push(m);
        existing.centerY = (existing.centerY * (existing.items.length - 1) + centerY) / existing.items.length;
      } else {
        rowGroups.push({ centerY, items: [m] });
      }
    });
    rowGroups.forEach((row) => row.items.sort((a, b) => a.minX - b.minX));

    const lineNodes = Array.from(svg.querySelectorAll("line"));
    const pathNodes = Array.from(svg.querySelectorAll("path"));

    rowGroups.forEach((row) => {
      const rowMinX = Math.min(...row.items.map((it) => it.minX));
      const rowMaxX = Math.max(...row.items.map((it) => it.maxX));
      const rowMinY = Math.min(...row.items.map((it) => it.minY));
      const rowMaxY = Math.max(...row.items.map((it) => it.maxY));
      const rowCenterY = (rowMinY + rowMaxY) / 2;

      const staffLineBoxes = [];
      lineNodes.forEach((line) => {
        let box;
        try {
          box = line.getBBox();
        } catch {
          return;
        }
        if (!Number.isFinite(box.x) || !Number.isFinite(box.y)) return;
        const isHorizontalStaff = box.width > 80 && box.height <= 2.5;
        if (!isHorizontalStaff) return;
        const cy = box.y + box.height / 2;
        const cx = box.x + box.width / 2;
        if (Math.abs(cy - rowCenterY) > 55) return;
        if (cx < rowMinX - 80 || cx > rowMaxX + 80) return;
        staffLineBoxes.push(box);
      });

      const rowStaffMinY = staffLineBoxes.length ? Math.min(...staffLineBoxes.map((b) => b.y)) : rowMinY - 10;
      const rowStaffMaxY = staffLineBoxes.length
        ? Math.max(...staffLineBoxes.map((b) => b.y + b.height))
        : rowMaxY + 10;

      const barlineXs = [];
      const staffHeight = Math.max(18, rowStaffMaxY - rowStaffMinY);
      const barlineCandidates = [...lineNodes, ...pathNodes];
      barlineCandidates.forEach((el) => {
        let box;
        try {
          box = el.getBBox();
        } catch {
          return;
        }
        if (!Number.isFinite(box.x) || !Number.isFinite(box.y)) return;
        // Avoid picking note stems/beams: only long, near-zero-width verticals spanning staff.
        const isVertical = box.height >= staffHeight * 0.88 && box.width <= 3.2;
        if (!isVertical) return;
        const lineTop = box.y;
        const lineBottom = box.y + box.height;
        const spansWholeStaff = lineTop <= rowStaffMinY + 3 && lineBottom >= rowStaffMaxY - 3;
        if (!spansWholeStaff) return;
        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2;
        if (cx < rowMinX - 60 || cx > rowMaxX + 60) return;
        if (cy < rowStaffMinY - 20 || cy > rowStaffMaxY + 20) return;
        barlineXs.push(cx);
      });
      barlineXs.sort((a, b) => a - b);
      const uniqueBarlineXs = [];
      barlineXs.forEach((x) => {
        const last = uniqueBarlineXs[uniqueBarlineXs.length - 1];
        if (!Number.isFinite(last) || Math.abs(last - x) > 2) uniqueBarlineXs.push(x);
      });

      row.items.forEach((m, idx) => {
        const prev = idx > 0 ? row.items[idx - 1] : null;
        const next = idx < row.items.length - 1 ? row.items[idx + 1] : null;
        const prevMidX = prev ? (prev.minX + prev.maxX) / 2 : Number.NEGATIVE_INFINITY;
        const nextMidX = next ? (next.minX + next.maxX) / 2 : Number.POSITIVE_INFINITY;

        const leftCandidates = uniqueBarlineXs.filter((x) => x <= m.minX + 10 && x >= prevMidX - 16);
        const rightCandidates = uniqueBarlineXs.filter((x) => x >= m.maxX - 10 && x <= nextMidX + 16);
        const leftBarline = leftCandidates.length ? leftCandidates[leftCandidates.length - 1] : undefined;
        const rightBarline = rightCandidates.length ? rightCandidates[0] : undefined;

        const leftBoundary = Number.isFinite(leftBarline)
          ? leftBarline
          : prev
            ? (prev.maxX + m.minX) / 2
            : m.minX - 10;
        const rightBoundary = Number.isFinite(rightBarline)
          ? rightBarline
          : next
            ? (m.maxX + next.minX) / 2
            : m.maxX + 10;

        if (!Number.isFinite(leftBoundary) || !Number.isFinite(rightBoundary) || rightBoundary <= leftBoundary) return;

        // Gather lyrics from mapped notes in this measure only.
        let lyricMinY = Infinity;
        let lyricMaxY = -Infinity;
        appState.noteModels
          .filter((n) => n.measureNumber === m.measureNumber && n.renderedElement?.ownerSVGElement === svg)
          .forEach((n) => {
            const lyricEl = n.renderedLyricElement;
            if (!lyricEl || lyricEl.ownerSVGElement !== svg) return;
            let box;
            try {
              box = lyricEl.getBBox();
            } catch {
              return;
            }
            const cy = box.y + box.height / 2;
            if (cy < rowStaffMaxY + 2 || cy > rowStaffMaxY + 86) return;
            lyricMinY = Math.min(lyricMinY, box.y);
            lyricMaxY = Math.max(lyricMaxY, box.y + box.height);
          });

        // Requested bounds:
        // x: by barlines, y: include note stems and extend slightly below lyrics.
        const top = Math.min(m.minY, rowStaffMinY) - 4;
        let bottom = Number.isFinite(lyricMaxY) ? lyricMaxY + 6 : Math.max(m.maxY, rowStaffMaxY) + 8;
        bottom = Math.min(bottom, rowStaffMaxY + 86);

        const rectX = leftBoundary;
        const rectY = top;
        const rectW = Math.max(20, rightBoundary - leftBoundary);
        const rectH = Math.max(20, bottom - top);

        if (m.measureNumber === appState.activeMeasureNumber) {
          const rect = document.createElementNS(ns, "rect");
          rect.setAttribute("class", "mission-measure-box active");
          rect.setAttribute("data-measure-number", String(m.measureNumber));
          rect.setAttribute("x", String(rectX));
          rect.setAttribute("y", String(rectY));
          rect.setAttribute("width", String(rectW));
          rect.setAttribute("height", String(rectH));
          rect.setAttribute("rx", "12");
          rect.setAttribute("ry", "12");
          svg.insertBefore(rect, svg.firstChild);
        }

        const svgRect = svg.getBoundingClientRect();
        const vb = svg.viewBox?.baseVal;
        const vbWidth = vb && vb.width ? vb.width : Number(svg.getAttribute("width")) || 1;
        const vbHeight = vb && vb.height ? vb.height : Number(svg.getAttribute("height")) || 1;
        const left = svgRect.left + (rectX / vbWidth) * svgRect.width;
        const topPx = svgRect.top + (rectY / vbHeight) * svgRect.height;
        const right = svgRect.left + ((rectX + rectW) / vbWidth) * svgRect.width;
        const bottomPx = svgRect.top + ((rectY + rectH) / vbHeight) * svgRect.height;

        appState.measureHitBoxes.push({ measureNumber: m.measureNumber, left, top: topPx, right, bottom: bottomPx });
        appState.measureRegions.push({
          measureNumber: m.measureNumber,
          svg,
          x: rectX,
          y: rectY,
          width: rectW,
          height: rectH,
        });
      });
    });
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
  const hasSelectedMeasure = Boolean(getActiveMissionMeasureNumber());
  dom.playButton.disabled = appState.playbackState === "playing" || !hasSelectedMeasure;
  dom.pauseButton.disabled = appState.playbackState !== "playing";
  dom.stopButton.disabled = appState.playbackState === "stopped";
  if (dom.fullPlayButton) {
    dom.fullPlayButton.disabled = appState.playbackState === "playing";
  }
  if (dom.scoreBottomIconWrap) {
    dom.scoreBottomIconWrap.classList.toggle("is-playing", appState.playbackState === "playing");
  }
}

function updateTempoControls() {
  if (dom.tempoSlider) dom.tempoSlider.value = String(Math.max(0, Math.min(200, Math.round(appState.tempo || 90))));
  if (dom.tempoValue) dom.tempoValue.textContent = `${Math.round(appState.tempo || 90)} BPM`;
  if (dom.metronomeToggleButton) {
    const offClass = appState.metronomeEnabled ? "" : " off";
    dom.metronomeToggleButton.innerHTML = `<span class="metronome-icon${offClass}">⏱</span> 박자 도우미 ${
      appState.metronomeEnabled ? "ON" : "OFF"
    }`;
  }
}

function updateButtonsState() {
  dom.pitchUpButton.disabled = !isSelectedNoteEditableForPitch();
  dom.pitchDownButton.disabled = !isSelectedNoteEditableForPitch();
  const hasSelectedNote = Boolean(getSelectedNoteModel());
  if (dom.pitchPrevButton) dom.pitchPrevButton.disabled = !hasSelectedNote;
  if (dom.pitchNextButton) dom.pitchNextButton.disabled = !hasSelectedNote;
  dom.undoButton.disabled = appState.undoStack.length === 0;
  dom.redoButton.disabled = appState.redoStack.length === 0;
  if (dom.resetButton) {
    dom.resetButton.disabled = appState.undoStack.length === 0 && appState.editLogs.length === 0;
  }

  const editable = isSelectedNoteEditable();
  Array.from(dom.durationButtons.querySelectorAll("button")).forEach((button) => {
    button.disabled = !editable;
  });
  if (dom.randomRhythmButton) {
    dom.randomRhythmButton.disabled = !getActiveMissionMeasureNumber();
  }
  updatePlaybackButtons();
}

function moveSelectedNoteHorizontal(direction = 0) {
  const step = Number(direction);
  if (step !== -1 && step !== 1) return;
  const selected = getSelectedNoteModel();
  if (!selected) return;

  const candidates = appState.noteModels
    .filter((note) => note.isRenderable && !note.isRest)
    .sort((a, b) => {
      if (a.measureNumber !== b.measureNumber) return a.measureNumber - b.measureNumber;
      return a.noteIndex - b.noteIndex;
    });
  if (candidates.length === 0) return;

  let currentIndex = candidates.findIndex((note) => note.noteId === selected.noteId);
  if (currentIndex < 0) {
    currentIndex = candidates.findIndex((note) => note.measureNumber === selected.measureNumber);
    if (currentIndex < 0) currentIndex = 0;
  }

  const targetIndex = currentIndex + step;
  if (targetIndex < 0 || targetIndex >= candidates.length) return;

  const target = candidates[targetIndex];
  if (!target) return;

  appState.selectedNoteId = target.noteId;
  appState.activeMeasureNumber = target.measureNumber;
  refreshRenderedNoteClasses();
  updateScoreStatusHeader();
  updateSelectedNoteView();
  updateButtonsState();
}

function stripRenderedNoteAccidentals(container) {
  void container;
  // Keep source MusicXML accidentals as-is.
  // (Do not strip rendered accidentals globally.)
}

function keepOnlyFirstMeasureNumberPerRow(container) {
  if (!container) return;
  const svgs = Array.from(container.querySelectorAll("svg"));
  svgs.forEach((svg) => {
    const candidates = Array.from(svg.querySelectorAll("text"))
      .map((el) => {
        const text = (el.textContent || "").trim();
        if (!/^\d{1,3}$/.test(text)) return null;
        let box;
        try {
          box = el.getBBox();
        } catch {
          return null;
        }
        return {
          el,
          x: box.x,
          y: box.y,
          w: box.width,
          h: box.height,
          cx: box.x + box.width / 2,
          cy: box.y + box.height / 2,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.cy - b.cy || a.cx - b.cx);
    if (!candidates.length) return;

    const rows = [];
    const threshold = 44;
    candidates.forEach((item) => {
      const row = rows.find((r) => Math.abs(r.centerY - item.cy) <= threshold);
      if (row) {
        row.items.push(item);
        row.centerY = (row.centerY * (row.items.length - 1) + item.cy) / row.items.length;
      } else {
        rows.push({ centerY: item.cy, items: [item] });
      }
    });

    rows.forEach((row) => {
      row.items.sort((a, b) => a.cx - b.cx);
      row.items.slice(1).forEach((item) => item.el.remove());
    });
  });
}

function enforceKeySignatureAlterInXmlDoc(xmlDoc) {
  if (!xmlDoc) return;
  const parts = Array.from(xmlDoc.querySelectorAll("part"));
  parts.forEach((part) => {
    let currentKeyFifths = 0;
    const measures = Array.from(part.querySelectorAll("measure"));
    measures.forEach((measure) => {
      const fifthsNode = measure.querySelector("attributes > key > fifths");
      if (fifthsNode) currentKeyFifths = Number(fifthsNode.textContent || 0);
      const notes = Array.from(measure.querySelectorAll(":scope > note"));
      notes.forEach((noteNode) => {
        if (noteNode.querySelector("rest")) return;
        const pitchNode = noteNode.querySelector("pitch");
        if (!pitchNode) return;
        const step = pitchNode.querySelector("step")?.textContent?.trim() || "C";
        const keyAlter = getKeySignatureAlter(step, currentKeyFifths);
        const octaveNode = pitchNode.querySelector("octave");
        const alterNodes = Array.from(pitchNode.querySelectorAll("alter"));

        Array.from(noteNode.querySelectorAll("accidental")).forEach((node) => node.remove());

        if (keyAlter === 0) {
          alterNodes.forEach((node) => node.remove());
          return;
        }

        const primary = alterNodes[0] || xmlDoc.createElement("alter");
        primary.textContent = String(keyAlter);
        if (!alterNodes[0]) {
          if (octaveNode) pitchNode.insertBefore(primary, octaveNode);
          else pitchNode.appendChild(primary);
        }
        alterNodes.slice(1).forEach((node) => node.remove());
      });
    });
  });
}

async function renderScore(xmlText) {
  if (!window.opensheetmusicdisplay) throw new Error("OSMD 라이브러리를 찾지 못했습니다.");

  const renderXml = xmlText;

  dom.scoreContainer.innerHTML = "";
  appState.osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay(dom.scoreContainer, {
    autoResize: true,
    drawTitle: true,
    drawComposer: true,
    drawPartNames: false,
    drawMeasureNumbers: true,
    newSystemFromXML: true,
    newSystemFromNewPageInXML: true,
  });

  await appState.osmd.load(stripCredits(renderXml));
  await appState.osmd.render();
  stripRenderedNoteAccidentals(dom.scoreContainer);
  keepOnlyFirstMeasureNumberPerRow(dom.scoreContainer);
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
  clearLyricNodes(noteNode);
  const lyricNode = noteNode.ownerDocument.createElement("lyric");
  noteNode.appendChild(lyricNode);
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

function getLyricEditableNotes() {
  return appState.noteModels.filter(
    (note) => note.isRenderable && (note.hasLyricSlot || Boolean(note.lyricText))
  );
}

function normalizeSingleLyricChar(rawInput) {
  const text = String(rawInput || "")
    .replace(/\s+/g, "")
    .replace(/│/g, "");
  if (!text) return null;
  const chars = Array.from(text);
  const lastSyllable = chars.reverse().find((ch) => isHangulSyllable(ch));
  return lastSyllable || null;
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
  const note = appState.noteModels.find(
    (item) => item.noteId === noteId && item.isRenderable && (item.hasLyricSlot || Boolean(item.lyricText))
  );
  if (!note) return;
  appState.activeMeasureNumber = note.measureNumber;
  appState.selectedLyricNoteId = note.noteId;
  appState.selectedNoteId = note.noteId;
  resetLyricPad();
  if (dom.lyricInputCapture) {
    dom.lyricInputCapture.value = note.lyricText || "";
  }
  appState.lyricInputLiveText = String(note.lyricText || "");
  appState.lyricInputTouched = false;
  appState.lyricCaretVisible = true;
  updateScoreStatusHeader();
  refreshRenderedNoteClasses();
  updateSelectedNoteView();
  updateButtonsState();
  applyLiveLyricPreview();
  focusLyricInputCapture();
}

function getFirstLyricNoteId() {
  return getLyricEditableNotes()[0]?.noteId || null;
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

function stopLyricCaretBlink() {
  if (appState.lyricCaretIntervalId != null) {
    clearInterval(appState.lyricCaretIntervalId);
    appState.lyricCaretIntervalId = null;
  }
  appState.lyricCaretVisible = true;
}

function startLyricCaretBlink() {
  stopLyricCaretBlink();
  appState.lyricCaretVisible = true;
  appState.lyricCaretIntervalId = setInterval(() => {
    if (!appState.lyricEditMode || !appState.selectedLyricNoteId) return;
    appState.lyricCaretVisible = !appState.lyricCaretVisible;
    applyLiveLyricPreview();
  }, 500);
}

function getLiveLyricPreviewSource() {
  if (appState.lyricEditMode && dom.lyricInputCapture) {
    return String(dom.lyricInputCapture.value ?? "");
  }
  const typed = String(appState.lyricInputLiveText || "");
  if (typed) return typed;
  const livePad = getLyricPadDisplayText();
  if (livePad) return livePad;
  return "";
}

function applyLiveLyricPreview() {
  if (!appState.lyricEditMode || !appState.selectedLyricNoteId) return;
  const note = appState.noteModels.find((n) => n.noteId === appState.selectedLyricNoteId);
  if (!note) return;
  if (!note.renderedLyricElement) {
    note.renderedLyricElement = findNearestLyricElementForNote(note);
  }
  if (!note.renderedLyricElement) return;
  const preview = getLiveLyricPreviewSource();
  if (!appState.lyricInputTouched && !preview) {
    note.renderedLyricElement.textContent = String(note.lyricText || "");
    return;
  }
  note.renderedLyricElement.textContent = String(preview);
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
  const lyricNotes = getLyricEditableNotes();
  const idx = lyricNotes.findIndex((n) => n.noteId === currentNoteId);
  if (idx < 0) return null;
  return lyricNotes[idx + 1]?.noteId || null;
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

function focusLyricInputCapture() {
  if (!appState.lyricEditMode) return;
  if (!dom.lyricInputCapture) return;
  requestAnimationFrame(() => {
    try {
      dom.lyricInputCapture.focus();
      dom.lyricInputCapture.setSelectionRange?.(
        dom.lyricInputCapture.value.length,
        dom.lyricInputCapture.value.length
      );
    } catch {
      void 0;
    }
  });
}

function clearLyricInputCapture() {
  if (!dom.lyricInputCapture) return;
  dom.lyricInputCapture.value = "";
  appState.lyricInputLiveText = "";
  appState.lyricInputTouched = false;
  appState.lyricCaretVisible = true;
  applyLiveLyricPreview();
}

async function applyLyricEdit(inputChar) {
  if (!appState.lyricEditMode) return;
  if (!appState.selectedLyricNoteId) return;
  if (appState.lyricCommitInFlight) return;
  const normalizedChar = normalizeSingleLyricChar(inputChar);
  if (!normalizedChar) {
    showToast("가사는 한 음표당 한 글자(완성형 한글)만 입력할 수 있어요");
    return;
  }

  const note = appState.noteModels.find((item) => item.noteId === appState.selectedLyricNoteId);
  if (!note || !note.xmlNode) return;
  const editableBefore = getLyricEditableNotes();
  const lyricIndexBefore = editableBefore.findIndex((n) => n.noteId === note.noteId);
  const nextBefore = lyricIndexBefore >= 0 ? editableBefore[lyricIndexBefore + 1] : null;
  const nextPos = nextBefore
    ? { measureNumber: nextBefore.measureNumber, noteIndex: nextBefore.noteIndex }
    : null;
  const candidateText = buildLyricsCandidateText(note.noteId, normalizedChar);
  if (hasUnsafeLyricContent(candidateText)) {
    showToast("안전하지 않은 가사(욕설/혐오/개인정보/성적 표현)는 입력할 수 없어요");
    return;
  }

  appState.lyricCommitInFlight = true;
  try {
    pushUndoSnapshot();
    clearRedoStack();
    setLyricNodeText(note.xmlNode, normalizedChar);
    const before = { lyric: note.lyricText || "" };
    const after = { lyric: normalizedChar };
    appState.editLogs.push({
      measureNumber: note.measureNumber,
      noteId: note.noteId,
      before,
      after,
      timestamp: new Date().toISOString(),
    });

    await rebuildFromCurrentXml();
    let targetNoteId = null;
    if (nextPos) {
      targetNoteId =
        findNoteIdByPosition(nextPos.measureNumber, nextPos.noteIndex) ||
        findClosestNoteIdInMeasure(nextPos.measureNumber, nextPos.noteIndex);
    }
    if (!targetNoteId) targetNoteId = note.noteId;
    resetLyricPad();
    clearLyricInputCapture();
    if (targetNoteId) {
      selectLyricNote(targetNoteId);
    } else {
      appState.selectedLyricNoteId = null;
      appState.selectedNoteId = null;
      refreshRenderedNoteClasses();
      updateScoreStatusHeader();
      updateSelectedNoteView();
      updateButtonsState();
    }
  } finally {
    appState.lyricCommitInFlight = false;
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

function setDurationOnNoteNode(noteNode, durationType, durationDivisions, dotCount = 0) {
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
  for (let i = 0; i < (dotCount || 0); i += 1) {
    const dotNode = noteNode.ownerDocument.createElement("dot");
    noteNode.appendChild(dotNode);
  }
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
  const existingNodes = Array.from(noteNode.querySelectorAll("accidental"));
  const firstExisting = existingNodes[0] || null;
  if (!pitch) {
    existingNodes.forEach((node) => node.remove());
    return;
  }

  const resolvedAlter = resolvePitchAlter(pitch, keyFifths);
  const keyAlter = getKeySignatureAlter(pitch.step, keyFifths);
  if (resolvedAlter === keyAlter) {
    existingNodes.forEach((node) => node.remove());
    return;
  }

  const accidentalText = getAccidentalTextByAlter(resolvedAlter);
  if (!accidentalText) {
    existingNodes.forEach((node) => node.remove());
    return;
  }

  // keep only one accidental node
  existingNodes.slice(1).forEach((node) => node.remove());
  const node = firstExisting || noteNode.ownerDocument.createElement("accidental");
  node.textContent = accidentalText;
  if (!firstExisting) {
    const typeNode = noteNode.querySelector("type");
    if (typeNode) noteNode.insertBefore(node, typeNode);
    else noteNode.appendChild(node);
  }
}

function syncPitchAlterWithKeySignature(note, keyFifths = 0) {
  if (!note?.xmlNode || !note.pitch || note.isRest) return;
  const pitchNode = note.xmlNode.querySelector("pitch");
  if (!pitchNode) return;

  const keyAlter = getKeySignatureAlter(note.pitch.step, keyFifths);
  const resolvedAlter = resolvePitchAlter(note.pitch, keyFifths);
  const allowAccidentals = Boolean(appState.rules?.constraints?.allowAccidentals);
  let nextAlter = note.pitch.alter;

  // If pitch equals key-signature alter:
  // - keep C/D/E... naturals implicit when key alter is 0
  // - keep explicit alter when key signature has sharp/flat to avoid
  //   accidental rendering ambiguity after edits.
  if (resolvedAlter === keyAlter) {
    nextAlter = keyAlter === 0 ? null : keyAlter;
  }

  // When accidentals are not allowed, drop explicit naturals that cancel key signature
  // (e.g., B natural in F major) and use key-signature pitch instead.
  if (!allowAccidentals && resolvedAlter === 0 && keyAlter !== 0) {
    nextAlter = null;
  }

  note.pitch.alter = nextAlter;
  const alterNodes = Array.from(pitchNode.querySelectorAll("alter"));
  const alterNode = alterNodes[0] || null;
  if (nextAlter === null || nextAlter === undefined) {
    alterNodes.forEach((node) => node.remove());
    return;
  }

  alterNodes.slice(1).forEach((node) => node.remove());
  if (alterNode) {
    alterNode.textContent = String(nextAlter);
    return;
  }

  const newAlter = note.xmlNode.ownerDocument.createElement("alter");
  newAlter.textContent = String(nextAlter);
  const octaveNode = pitchNode.querySelector("octave");
  if (octaveNode) pitchNode.insertBefore(newAlter, octaveNode);
  else pitchNode.appendChild(newAlter);
}

function forceRemoveNaturalForKeyNotes(note, keyFifths = 0) {
  if (!note?.xmlNode || !note.pitch || note.isRest) return;
  const allowAccidentals = Boolean(appState.rules?.constraints?.allowAccidentals);
  if (allowAccidentals) return;
  const keyAlter = getKeySignatureAlter(note.pitch.step, keyFifths);
  if (keyAlter === 0) return;

  const resolvedAlter = resolvePitchAlter(note.pitch, keyFifths);
  if (resolvedAlter === 0 || resolvedAlter === keyAlter) {
    note.pitch.alter = keyAlter;
    const pitchNode = note.xmlNode.querySelector("pitch");
    if (pitchNode) {
      const alterNodes = Array.from(pitchNode.querySelectorAll("alter"));
      const alterNode = alterNodes[0] || note.xmlNode.ownerDocument.createElement("alter");
      alterNode.textContent = String(keyAlter);
      if (!alterNodes[0]) {
        const octaveNode = pitchNode.querySelector("octave");
        if (octaveNode) pitchNode.insertBefore(alterNode, octaveNode);
        else pitchNode.appendChild(alterNode);
      }
      alterNodes.slice(1).forEach((node) => node.remove());
    }
  }

  Array.from(note.xmlNode.querySelectorAll("accidental")).forEach((node) => {
    if ((node.textContent || "").trim() === "natural") node.remove();
  });
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
  const allowedPitchClasses = new Set(scalePitchClasses);
  if (note?.pitch) {
    const keyAlter = getKeySignatureAlter(note.pitch.step, keyFifths);
    const effectiveAlter = Number.isFinite(note.playbackAlter)
      ? Number(note.playbackAlter)
      : resolvePitchAlter(note.pitch, keyFifths);
    if (effectiveAlter !== keyAlter) {
      const selectedMidi = noteToMidi(note);
      if (Number.isFinite(selectedMidi)) {
        allowedPitchClasses.add(((selectedMidi % 12) + 12) % 12);
      }
    }
  }
  const globalMin = appState.allowedMidiMin ?? 12;
  const globalMax = appState.allowedMidiMax ?? 108;
  const anchorMidi = appState.originalPitchMidiByNoteId.get(note?.noteId);
  const localMin = Number.isFinite(anchorMidi) ? anchorMidi - 12 : globalMin;
  const localMax = Number.isFinite(anchorMidi) ? anchorMidi + 12 : globalMax;
  const minMidi = Math.max(globalMin, localMin);
  const maxMidi = Math.min(globalMax, localMax);

  for (let midi = currentMidi + step; midi >= minMidi && midi <= maxMidi; midi += step) {
    const pc = ((midi % 12) + 12) % 12;
    if (allowedPitchClasses.has(pc)) return midi;
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
  applySongSystemBreakLayout(appState.xmlDoc, appState.currentSongId);
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
    if (!appState.rules?.constraints?.allowAccidentals) {
      const keyAlter = getKeySignatureAlter(nextPitch.step, note.keyFifths ?? 0);
      const resolvedAlter = resolvePitchAlter(nextPitch, note.keyFifths ?? 0);
      if (keyAlter !== 0 && (resolvedAlter === 0 || resolvedAlter === keyAlter)) {
        nextPitch.alter = keyAlter;
      }
      if (keyAlter === 0 && resolvedAlter === 0) nextPitch.alter = null;
    }
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
    note.pitch = { ...nextPitch };
    forceRemoveNaturalForKeyNotes(note, note.keyFifths ?? 0);
    syncPitchAlterWithKeySignature(note, note.keyFifths ?? 0);
    // Use normalized pitch model to avoid re-inserting natural signs during pitch edits.
    syncAccidentalNode(note.xmlNode, note.pitch, note.keyFifths ?? 0);
    if (!appState.rules?.constraints?.allowAccidentals) {
      normalizeAccidentalsInCurrentXml();
    }

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
  const baselineXml = appState.loadedXmlBaseline || appState.xmlTextOriginal;
  appState.xmlDoc = new DOMParser().parseFromString(baselineXml, "application/xml");
  appState.undoStack = [];
  appState.redoStack = [];
  appState.editLogs = [];
  appState.selectedNoteId = null;
  appState.selectedLyricNoteId = null;
  appState.lyricEditMode = false;
  stopLyricCaretBlink();
  dom.lyricPenButton?.classList.remove("active");
  setLyricPadVisible(false);
  clearLyricInputCapture();
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

function hasTieType(note, type) {
  return Array.isArray(note?.tieInfo) && note.tieInfo.includes(type);
}

function areSamePitchByMidi(a, b) {
  if (!a?.pitch || !b?.pitch) return false;
  return noteToMidi(a) === noteToMidi(b);
}

function buildPlaybackNotes(rawNotes) {
  const playback = [];
  for (let i = 0; i < rawNotes.length; i += 1) {
    const note = rawNotes[i];
    if (!note) continue;

    if (note.isRest || !note.pitch) {
      playback.push({
        noteId: note.noteId,
        isRest: true,
        pitch: null,
        playbackAlter: null,
        keyFifths: note.keyFifths ?? 0,
        staccato: false,
        durationSec: getNoteDurationSec(note),
      });
      continue;
    }

    let durationSec = getNoteDurationSec(note);
    let isStaccato = Boolean(note.isStaccato);
    let cursor = i;

    // Tie handling: same-pitch tied notes are played as one sustained note.
    while (hasTieType(rawNotes[cursor], "start")) {
      const next = rawNotes[cursor + 1];
      if (!next || next.isRest || !next.pitch) break;
      if (!areSamePitchByMidi(rawNotes[cursor], next)) break;
      if (!hasTieType(next, "stop")) break;
      durationSec += getNoteDurationSec(next);
      isStaccato = isStaccato || Boolean(next.isStaccato);
      cursor += 1;
    }

    playback.push({
      noteId: note.noteId,
      isRest: false,
      pitch: note.pitch,
      playbackAlter: note.playbackAlter ?? null,
      keyFifths: note.keyFifths ?? 0,
      staccato: isStaccato,
      durationSec,
    });

    i = cursor;
  }
  return playback;
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

function divisionsToUnit16(durationDivisions, divisions) {
  const one16 = divisions / 4;
  if (!Number.isFinite(one16) || one16 <= 0) return null;
  const units = durationDivisions / one16;
  return Number.isFinite(units) ? units : null;
}

function unit16ToDurationSpec(unit, divisions) {
  const specMap = {
    1: { type: "16th", dots: 0 },
    2: { type: "eighth", dots: 0 },
    3: { type: "eighth", dots: 1 },   // dotted eighth
    4: { type: "quarter", dots: 0 },
    6: { type: "quarter", dots: 1 },  // dotted quarter
    8: { type: "half", dots: 0 },
    12: { type: "half", dots: 1 },    // dotted half
    16: { type: "whole", dots: 0 },
  };
  const base = specMap[unit];
  if (!base) return null;
  const one16 = divisions / 4;
  if (!Number.isFinite(one16) || one16 <= 0) return null;
  const durationDivisions = unit * one16;
  if (!Number.isInteger(durationDivisions)) return null;
  return { ...base, durationDivisions };
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

function isRenderableNoteNode(noteNode) {
  if (!noteNode) return false;
  if (noteNode.querySelector("grace")) return false;
  if (noteNode.querySelector("chord")) return false;
  const duration = Number(noteNode.querySelector("duration")?.textContent || 0);
  return duration > 0;
}

function ensureMeasureDivisionsForRandomRhythm(measure, minDivisions = 4) {
  if (!measure?.xmlNode) return;
  const current = Number(measure.divisions || 1);
  if (current >= minDivisions) return;

  let attrs = measure.xmlNode.querySelector(":scope > attributes");
  if (!attrs) {
    attrs = measure.xmlNode.ownerDocument.createElement("attributes");
    const first = measure.xmlNode.firstChild;
    if (first) measure.xmlNode.insertBefore(attrs, first);
    else measure.xmlNode.appendChild(attrs);
  }

  let divNode = attrs.querySelector(":scope > divisions");
  if (!divNode) {
    divNode = measure.xmlNode.ownerDocument.createElement("divisions");
    attrs.appendChild(divNode);
  }
  divNode.textContent = String(minDivisions);
  measure.divisions = minDivisions;
}

async function applyRandomRhythmToActiveMeasure() {
  try {
    stopScore();
    const measureNumber = getActiveMissionMeasureNumber();
    if (!measureNumber) return showToast("먼저 하이라이트 마디를 선택하세요");

    const measure = appState.measureModels.find((m) => m.number === measureNumber);
    if (!measure) throw new Error("활성 마디를 찾지 못했습니다.");
    // Enable dotted/16th combinations (e.g., 점8분+16분) by guaranteeing enough divisions.
    ensureMeasureDivisionsForRandomRhythm(measure, 4);

    const noteList = measure.notes.filter((n) => n.isRenderable);
    if (noteList.length === 0) return showToast("이 마디에는 변경 가능한 음표가 없어요");

    const { beats, beatType } = parseTimeSignature(appState.rules.timeSignature);
    const targetUnits = Math.round(beats * (16 / beatType));
    const availableTypes = getAvailableDurationTypesForDivisions(measure.divisions);
    const baseUnits = availableTypes.map(toUnitsByDuration).filter((u) => u != null);
    const dottedCandidates = [3, 6, 12].filter((u) => unit16ToDurationSpec(u, measure.divisions));
    const durationUnits = [...new Set([...baseUnits, ...dottedCandidates])].sort((a, b) => a - b);
    if (durationUnits.length === 0) return showToast("이 마디에서 사용 가능한 리듬 길이가 없어요");
    const currentUnits = noteList
      .map((note) => {
        const byDiv = divisionsToUnit16(note.durationDivisions, measure.divisions);
        if (Number.isFinite(byDiv)) return byDiv;
        return toUnitsByDuration(note.durationType) ?? 0;
      })
      .join("-");
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
    if (randomUnitsKey === currentUnits || randomUnitsKey === lastUnits) {
      return showToast("이 마디는 현재 음표 개수를 유지하면 바꿀 수 있는 다른 리듬이 없어요");
    }

    const beforeSnapshot = loadSnapshot();
    pushUndoSnapshot();
    clearRedoStack();

    const measureNoteNodes = getMeasureChildrenByTag(measure.xmlNode, "note").filter(isRenderableNoteNode);
    if (measureNoteNodes.length === 0) {
      appState.undoStack.pop();
      return showToast("랜덤 리듬 적용 대상 음표가 없어요");
    }

    const targetCount = noteList.length;
    if (measureNoteNodes.length !== targetCount || randomUnits.length !== targetCount) {
      appState.undoStack.pop();
      return showToast("가사 글자 수를 유지하기 위해 음표 개수는 바꿀 수 없어요");
    }

    measureNoteNodes.forEach((noteNode, index) => {
      const unit = randomUnits[index];
      const spec = unit16ToDurationSpec(unit, measure.divisions);
      if (!spec) return;
      setDurationOnNoteNode(noteNode, spec.type, spec.durationDivisions, spec.dots);
      Array.from(noteNode.querySelectorAll("beam, dot")).forEach((node) => node.remove());
      // restore dot after cleanup
      if (spec.dots) {
        for (let i = 0; i < spec.dots; i += 1) {
          const dotNode = noteNode.ownerDocument.createElement("dot");
          noteNode.appendChild(dotNode);
        }
      }
      Array.from(noteNode.querySelectorAll("tie, notations > tied")).forEach((node) => node.remove());
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
      const unit = randomUnits[Math.min(index, randomUnits.length - 1)];
      const durationType = unit16ToDurationSpec(unit, measure.divisions)?.type || note.durationType;
      appState.editLogs.push(
        createEditLog(
          note,
          { pitch: pitchToText(note.pitch), duration: note.durationType, kind: note.isRest ? "rest" : "note" },
          { pitch: pitchToText(note.pitch), duration: durationType || note.durationType, kind: note.isRest ? "rest" : "note" }
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
  const { beats, beatType } = parseTimeSignature(appState.rules?.timeSignature || "4/4");
  const isCompound = beatType === 8 && beats >= 6 && beats % 3 === 0;
  const accentCycle = Math.max(1, isCompound ? Math.round(beats / 3) : beats);
  const quarterSec = 60 / (appState.tempo || 90);
  const quarterUnitsPerPulse = isCompound ? 1.5 : 4 / Math.max(1, beatType);
  const pulseSec = quarterSec * quarterUnitsPerPulse;
  if (!Number.isFinite(pulseSec) || pulseSec <= 0) return;
  const nowSec = Tone.Transport.seconds || 0;
  const epsilon = 0.0001;
  const nextPulseIndex = Math.max(0, Math.ceil((nowSec - epsilon) / pulseSec));
  const nextBeatTime = nextPulseIndex * pulseSec;
  appState.metronomeBeatCounter = nextPulseIndex % accentCycle;
  appState.metronomeRepeatId = Tone.Transport.scheduleRepeat((time) => {
    const accent = appState.metronomeBeatCounter % accentCycle === 0;
    const note = accent ? "C5" : "A4";
    appState.metronomeSynth.triggerAttackRelease(note, "32n", time, accent ? 0.7 : 0.42);
    appState.metronomeBeatCounter += 1;
  }, pulseSec, nextBeatTime);
}

function normalizeAccidentalsInCurrentXml() {
  // Keep source MusicXML accidental engraving as-is.
  // Re-adding/removing accidental nodes globally causes repeated symbols in a measure.
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
    return notes.map((note) => ({ note, durationSec: note.durationSec, offsetSec: 0 }));
  }

  const scheduled = [];
  let elapsed = 0;
  notes.forEach((note) => {
    const durationSec = note.durationSec;
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

  const playbackNotes = buildPlaybackNotes(notes);
  if (playbackNotes.length === 0) throw new Error("재생할 음표가 없어요");
  const sampler = await getSampler(appState.currentInstrumentId);
  if (!sampler) throw new Error("악기 샘플을 로드하지 못했습니다.");

  const scheduledNotes = buildScheduledNotesFromOffset(playbackNotes, startOffsetSec);
  if (scheduledNotes.length === 0) throw new Error("재생할 음표가 없어요");
  let cursorSec = 0;

  scheduledNotes.forEach(({ note, durationSec, offsetSec }) => {
    const effectiveDuration = Math.max(0.03, durationSec - offsetSec);

    if (!note.isRest && note.pitch) {
      const midi = noteToMidi(note);
      if (!Number.isFinite(midi)) {
        cursorSec += effectiveDuration;
        return;
      }
      const noteName = midiToToneNoteName(midi);
      const playedDuration = note.staccato
        ? Math.max(0.04, effectiveDuration * 0.45)
        : Math.max(0.05, effectiveDuration * 0.96);
      const id = Tone.Transport.schedule((time) => {
        Tone.Draw.schedule(() => {
          setPlaybackActiveNote(note.noteId);
        }, time);
        sampler.triggerAttackRelease(noteName, playedDuration, time, 0.9);
      }, cursorSec);
      appState.playbackEventIds.push(id);
      const clearId = Tone.Transport.schedule((time) => {
        Tone.Draw.schedule(() => {
          if (appState.playbackActiveNoteId === note.noteId) {
            setPlaybackActiveNote(null);
          }
        }, time);
      }, cursorSec + Math.max(0.04, playedDuration * 0.92));
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
  const defaultTempo = SONG_DEFAULT_TEMPO[song.id] ?? 90;
  appState.tempo = defaultTempo;
  // Lock parser tempo override so each song opens with our preset BPM.
  appState.tempoUserSet = true;
  const fetchedXml = await loadScoreXml();
  const draft = appState.songDrafts.get(song.id);
  const xmlText = draft?.xmlText || fetchedXml;
  appState.xmlTextOriginal = fetchedXml;

  const parsed = parseMusicXMLToModel(xmlText);
  appState.rules = await loadRules(parsed);
  appState.xmlDoc = parsed.xmlDoc;
  ensureSongTitle(appState.xmlDoc, song?.name || appState.rules?.title || "");
  applySongComposerOverride(appState.xmlDoc, song?.id, fetchedXml);
  applySongSystemBreakLayout(appState.xmlDoc, song.id);
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
  stopLyricCaretBlink();
  dom.lyricPenButton?.classList.remove("active");
  setLyricPadVisible(false);
  clearLyricInputCapture();
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
  updateBodyOverflowBySong();
  updateSongLayoutMode();
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
    if (!dom.teacherScreen?.classList.contains("is-hidden") && appState.teacherViewMode === "preview") {
      queueTeacherPreviewViewportFit();
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

  dom.goTeacherButton?.addEventListener("click", () => {
    showTeacherScreen();
  });

  dom.teacherBackButton?.addEventListener("click", () => {
    showHomeScreen();
  });

  dom.teacherListToggleButton?.addEventListener("click", () => {
    appState.teacherListCollapsed = !appState.teacherListCollapsed;
    updateTeacherListCollapsedUI();
  });

  dom.teacherModeSelect?.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    setTeacherViewMode(target.value || "submission");
  });

  dom.teacherPreviewGradeSelect?.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    const grade = Number(target.value || "3");
    appState.teacherPreviewGrade = Number.isFinite(grade) ? grade : 3;
    refreshTeacherPreviewSongSelect();
    renderTeacherPreviewSong(appState.teacherPreviewSongId).catch((error) => {
      console.error("[teacherPreviewGradeSelect]", error);
      showToast(`미리듣기 로드 실패: ${error.message || "알 수 없는 오류"}`);
    });
  });

  dom.teacherPreviewSongSelect?.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    appState.teacherPreviewSongId = target.value || "";
    renderTeacherPreviewSong(appState.teacherPreviewSongId).catch((error) => {
      console.error("[teacherPreviewSongSelect]", error);
      showToast(`미리듣기 로드 실패: ${error.message || "알 수 없는 오류"}`);
    });
  });

  dom.teacherScoreContainer?.addEventListener("click", (event) => {
    if (appState.teacherViewMode !== "preview") return;
    drawTeacherPreviewMeasureHighlights();
    const target = event.target;
    if (target instanceof Element) {
      const noteEl = target.closest("g[data-note-id]");
      if (noteEl) {
        const noteId = noteEl.getAttribute("data-note-id");
        if (noteId) {
          const note = (appState.teacherSelectedSubmission?.noteModels || []).find((n) => n.noteId === noteId);
          if (note && Number.isFinite(Number(note.measureNumber))) {
            toggleTeacherPreviewMeasure(Number(note.measureNumber));
            return;
          }
        }
      }
    }
    const x = event.clientX;
    const y = event.clientY;
    const hit = appState.teacherPreviewMeasureHitBoxes.find(
      (box) => x >= box.left && x <= box.right && y >= box.top && y <= box.bottom
    );
    if (hit) {
      toggleTeacherPreviewMeasure(hit.measureNumber);
    }
  });

  dom.teacherSubmissionList?.addEventListener("click", (event) => {
    if (appState.teacherViewMode !== "submission") return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("button[data-submission-id]");
    if (!button) return;
    const submissionId = button.getAttribute("data-submission-id");
    if (!submissionId) return;
    const submission = getStoredSubmissions().find((item) => item.id === submissionId);
    if (!submission) return;
    appState.teacherSelectedSubmissionId = submissionId;
    renderTeacherSubmissionScore(submission);
  });

  dom.teacherSubmissionList?.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const id = target.getAttribute("data-select-submission-id");
    if (!id) return;
    if (target.checked) appState.teacherSelectedIds.add(id);
    else appState.teacherSelectedIds.delete(id);

    if (dom.teacherSelectAllCheckbox) {
      const all = getStoredSubmissions();
      dom.teacherSelectAllCheckbox.checked =
        all.length > 0 && all.every((item) => appState.teacherSelectedIds.has(item.id));
    }
    if (dom.teacherDeleteSelectedButton) {
      dom.teacherDeleteSelectedButton.disabled = appState.teacherSelectedIds.size === 0;
    }
  });

  dom.teacherSelectAllCheckbox?.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const submissions = getStoredSubmissions();
    if (target.checked) {
      submissions.forEach((item) => appState.teacherSelectedIds.add(item.id));
    } else {
      appState.teacherSelectedIds.clear();
    }
    renderTeacherSubmissionList();
  });

  dom.teacherSortSelect?.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    appState.teacherSortMode = target.value || "latest";
    renderTeacherSubmissionList();
  });

  dom.teacherDeleteSelectedButton?.addEventListener("click", () => {
    const ids = [...appState.teacherSelectedIds];
    if (ids.length === 0) {
      showToast("삭제할 제출을 먼저 선택하세요");
      return;
    }
    deleteSubmissionsByIds(ids);
    showToast(`${ids.length}개 제출 악보를 삭제했어요`);
  });

  dom.teacherPlayButton?.addEventListener("click", () => {
    playTeacherSubmission({ forceFull: false });
  });
  dom.teacherPauseButton?.addEventListener("click", () => {
    pauseTeacherPlayback();
  });
  dom.teacherStopButton?.addEventListener("click", () => {
    stopTeacherPlayback();
  });
  dom.teacherFullPlayButton?.addEventListener("click", () => {
    appState.teacherPreviewRangeStart = null;
    appState.teacherPreviewRangeEnd = null;
    drawTeacherPreviewMeasureHighlights();
    playTeacherSubmission({ forceFull: true });
  });
  dom.teacherClearMeasureButton?.addEventListener("click", () => {
    appState.teacherPreviewRangeStart = null;
    appState.teacherPreviewRangeEnd = null;
    drawTeacherPreviewMeasureHighlights();
    showToast("마디 선택을 전체 해제했어요");
  });
  dom.teacherTempoSlider?.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const bpm = Math.max(0, Math.min(200, Number.parseInt(target.value || "90", 10) || 0));
    appState.teacherTempo = bpm;
    if (window.Tone && appState.teacherPlaybackState === "playing") {
      Tone.Transport.bpm.value = bpm;
    }
    updateTeacherTempoControls();
  });

  dom.teacherFullscreenButton?.addEventListener("click", () => {
    openTeacherFullscreen();
  });
  dom.teacherFullscreenCloseButton?.addEventListener("click", () => {
    closeTeacherFullscreen();
  });
  dom.teacherFullscreenOverlay?.addEventListener("click", (event) => {
    if (event.target === dom.teacherFullscreenOverlay) {
      closeTeacherFullscreen();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dom.teacherFullscreenOverlay?.classList.contains("is-hidden")) {
      closeTeacherFullscreen();
    }
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
    dom.scoreContainer.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (appState.lyricEditMode) {
        focusLyricInputCapture();
      }
      const lyricEl = target.closest("[data-lyric-note-id]");
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

  dom.pitchPrevButton?.addEventListener("click", () => {
    moveSelectedNoteHorizontal(-1);
  });

  dom.pitchNextButton?.addEventListener("click", () => {
    moveSelectedNoteHorizontal(1);
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
    playSelectedMeasure();
  });
  dom.fullPlayButton?.addEventListener("click", () => {
    if (appState.playbackState === "playing") return;
    playScore();
  });
  dom.pauseButton.addEventListener("click", pauseScore);
  dom.stopButton.addEventListener("click", stopScore);
  dom.saveButton?.addEventListener("click", async () => {
    if (!appState.xmlDoc) return;
    const studentName = await openSubmitOverlay();
    if (!studentName) return;
    const ok = submitCurrentSong(studentName);
    if (!ok) return;
    showToast("제출했어요");
  });

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
      setLyricPadVisible(false);
      if (appState.lyricEditMode) {
        startLyricCaretBlink();
        const first = getFirstLyricNoteId();
        if (!first) {
          showToast("편집할 가사가 없어요");
          appState.lyricEditMode = false;
          dom.lyricPenButton.classList.remove("active");
          stopLyricCaretBlink();
          return;
        }
        if (!appState.selectedLyricNoteId) {
          selectLyricNote(first);
        } else {
          refreshRenderedNoteClasses();
        }
        focusLyricInputCapture();
        showToast("가사 편집 모드: 글자를 클릭하고 키보드로 한 글자 입력하세요");
      } else {
        stopLyricCaretBlink();
        appState.selectedLyricNoteId = null;
        clearLyricInputCapture();
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
      stopLyricCaretBlink();
      clearLyricInputCapture();
      resetLyricPad();
      refreshRenderedNoteClasses();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      focusLyricInputCapture();
      return;
    }
    focusLyricInputCapture();
  });

  document.addEventListener("compositionend", (event) => {
    if (!appState.lyricEditMode) return;
    if (event.target === dom.lyricInputCapture) return;
    appState.lyricInputLiveText = String(event.data || "");
    appState.lyricInputTouched = true;
    appState.lyricCaretVisible = true;
    applyLiveLyricPreview();
  });

  document.addEventListener("compositionupdate", (event) => {
    if (!appState.lyricEditMode || !appState.selectedLyricNoteId) return;
    if (event.target === dom.lyricInputCapture) return;
    appState.lyricInputLiveText = String(event.data || "");
    appState.lyricInputTouched = true;
    appState.lyricCaretVisible = true;
    applyLiveLyricPreview();
  });

  dom.lyricInputCapture?.addEventListener("compositionupdate", (event) => {
    if (!appState.lyricEditMode || !appState.selectedLyricNoteId) return;
    appState.lyricInputLiveText = String(event.data || "");
    appState.lyricInputTouched = true;
    appState.lyricCaretVisible = true;
    applyLiveLyricPreview();
  });

  dom.lyricInputCapture?.addEventListener("compositionend", () => {
    if (!appState.lyricEditMode || !appState.selectedLyricNoteId) return;
    appState.lyricInputLiveText = String(dom.lyricInputCapture?.value || "");
    appState.lyricInputTouched = true;
    appState.lyricCaretVisible = true;
    applyLiveLyricPreview();
  });

  dom.lyricInputCapture?.addEventListener("input", () => {
    if (!appState.lyricEditMode || !appState.selectedLyricNoteId) return;
    appState.lyricInputLiveText = String(dom.lyricInputCapture?.value || "");
    appState.lyricInputTouched = true;
    appState.lyricCaretVisible = true;
    applyLiveLyricPreview();
  });

  dom.lyricInputCapture?.addEventListener("keydown", (event) => {
    if (!appState.lyricEditMode) return;
    if (event.key === "Escape") {
      event.preventDefault();
      appState.lyricEditMode = false;
      appState.selectedLyricNoteId = null;
      dom.lyricPenButton?.classList.remove("active");
      setLyricPadVisible(false);
      stopLyricCaretBlink();
      clearLyricInputCapture();
      resetLyricPad();
      refreshRenderedNoteClasses();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const text = String(dom.lyricInputCapture?.value || appState.lyricInputLiveText || getLiveLyricPreviewSource() || "");
      applyLyricEdit(text).catch((error) => {
        console.error("[applyLyricEdit:input-enter]", error);
        showToast("가사 변경 중 오류가 발생했어요");
      }).finally(() => {
        focusLyricInputCapture();
      });
      return;
    }
    if (event.key === "Backspace") {
      appState.lyricCaretVisible = true;
      setTimeout(() => {
        appState.lyricInputLiveText = String(dom.lyricInputCapture?.value || "");
        appState.lyricInputTouched = true;
        applyLiveLyricPreview();
      }, 0);
    }
  });

  dom.lyricInputCapture?.addEventListener("blur", () => {
    if (!appState.lyricEditMode) return;
    setTimeout(() => {
      if (!appState.lyricEditMode) return;
      focusLyricInputCapture();
    }, 0);
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
    initTeacherInstrumentSelect();
    updateTeacherListCollapsedUI();
    updateTeacherPlaybackButtonsState();
    buildLyricPadButtons();
    resetLyricPad();
    setLyricPadVisible(false);
    clearLyricInputCapture();
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
