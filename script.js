const appState = {
  rules: null,
  osmd: null,
  xmlTextOriginal: "",
  xmlDoc: null,
  noteModels: [],
  measureModels: [],
  selectedNoteId: null,
  mission: null,
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
  allowedMidiMin: 12,
  allowedMidiMax: 108,
  tempo: 90,
  lastMissionKey: "",
  highlightRedrawTimers: [],
  highlightObserver: null,
  highlightIntervalId: null,
  scoreClickBound: false,
  activeMeasureNumber: null,
  measureHitBoxes: [],
  measureRegions: [],
  samplers: new Map(),
  currentInstrumentId: "acoustic_piano",
};

const dom = {
  scoreContainer: document.getElementById("score-container"),
  songTitle: document.getElementById("song-title"),
  songKey: document.getElementById("song-key"),
  songTime: document.getElementById("song-time"),
  missionRange: document.getElementById("mission-range"),
  selectedNoteView: document.getElementById("selected-note-view"),
  durationButtons: document.getElementById("duration-buttons"),
  toast: document.getElementById("toast"),
  pitchUpButton: document.getElementById("pitch-up-btn"),
  pitchDownButton: document.getElementById("pitch-down-btn"),
  undoButton: document.getElementById("undo-btn"),
  redoButton: document.getElementById("redo-btn"),
  resetButton: document.getElementById("reset-btn"),
  playButton: document.getElementById("play-btn"),
  pauseButton: document.getElementById("pause-btn"),
  stopButton: document.getElementById("stop-btn"),
  playMeasureButton: document.getElementById("play-measure-btn"),
  exportXmlButton: document.getElementById("export-xml-btn"),
  exportLogsButton: document.getElementById("export-logs-btn"),
  reloadMissionButton: document.getElementById("reload-mission-btn"),
  randomRhythmButton: document.getElementById("random-rhythm-btn"),
  instrumentSelect: document.getElementById("instrument-select"),
};

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
  dom.songTitle.textContent = appState.rules.title;
  dom.songKey.textContent = `${appState.rules.key} ${appState.rules.mode}`;
  dom.songTime.textContent = appState.rules.timeSignature;
  dom.missionRange.textContent = `${appState.mission.list.join(", ")}`;
}

function pickThreeSeparatedMeasures() {
  const source = appState.measureModels.map((m) => m.number).sort((a, b) => a - b);
  if (source.length === 0) {
    appState.mission = { list: [], measures: new Set() };
    return;
  }

  const pickOne = (candidates) => candidates[Math.floor(Math.random() * candidates.length)];
  const uniqueSource = [...new Set(source)];
  let picked = null;

  for (let attempt = 0; attempt < 500; attempt += 1) {
    const selected = [];
    const first = pickOne(uniqueSource);
    selected.push(first);

    const secondPool = uniqueSource.filter((n) => Math.abs(n - first) > 1);
    if (secondPool.length === 0) continue;
    const second = pickOne(secondPool);
    selected.push(second);

    const thirdPool = uniqueSource.filter((n) => selected.every((s) => Math.abs(s - n) > 1));
    if (thirdPool.length === 0) continue;
    const third = pickOne(thirdPool);
    selected.push(third);

    const sorted = selected.sort((a, b) => a - b);
    const key = sorted.join(",");
    if (key !== appState.lastMissionKey) {
      picked = sorted;
      break;
    }
  }

  if (!picked) {
    const fallback = [];
    for (const n of uniqueSource) {
      if (fallback.every((p) => Math.abs(p - n) > 1)) fallback.push(n);
      if (fallback.length === 3) break;
    }
    picked = (fallback.length >= 3 ? fallback : uniqueSource.slice(0, Math.min(3, uniqueSource.length))).sort(
      (a, b) => a - b
    );
  }

  appState.lastMissionKey = picked.join(",");

  appState.mission = {
    list: picked,
    measures: new Set(picked),
  };
}

function isMeasureInMission(measureNumber) {
  return appState.mission.measures.has(measureNumber);
}

function getSelectedNoteModel() {
  return appState.noteModels.find((note) => note.noteId === appState.selectedNoteId) || null;
}

function ensureSelectedNote(mode) {
  const note = getSelectedNoteModel();
  if (!note) {
    throw new Error("선택된 음표를 찾지 못했습니다.");
  }
  if (!isMeasureInMission(note.measureNumber)) {
    throw new Error("미션 3마디 밖의 음표입니다.");
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
  if (appState.activeMeasureNumber && isMeasureInMission(appState.activeMeasureNumber)) {
    return appState.activeMeasureNumber;
  }
  const selected = getSelectedNoteModel();
  if (selected && isMeasureInMission(selected.measureNumber)) {
    return selected.measureNumber;
  }
  return null;
}

function selectMissionMeasure(measureNumber) {
  if (!isMeasureInMission(measureNumber)) return;
  appState.activeMeasureNumber = measureNumber;
  refreshRenderedNoteClasses();
  updateButtonsState();
}

function toggleMissionMeasure(measureNumber) {
  if (!isMeasureInMission(measureNumber)) return;
  if (appState.activeMeasureNumber === measureNumber) {
    appState.activeMeasureNumber = null;
  } else {
    appState.activeMeasureNumber = measureNumber;
  }
  refreshRenderedNoteClasses();
  updateButtonsState();
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

function parseMusicXMLToModel(xmlText) {
  const xmlDoc = new DOMParser().parseFromString(xmlText, "application/xml");
  const part = xmlDoc.querySelector("part");
  if (!part) throw new Error("MusicXML에서 part를 찾을 수 없습니다.");

  const noteModels = [];
  const measureModels = [];
  let currentDivisions = 1;
  let currentKeyFifths = 0;

  const tempoEl = xmlDoc.querySelector("sound[tempo]") || xmlDoc.querySelector("metronome > per-minute");
  appState.tempo = tempoEl ? Number(tempoEl.getAttribute("tempo") || tempoEl.textContent || "90") : 90;

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
        xmlNode: noteNode,
        renderedElement: null,
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

async function loadRules() {
  const res = await fetch("./assets/score.rules.json");
  if (!res.ok) throw new Error("rules.json 로드 실패");
  return res.json();
}

async function loadScoreXml() {
  const musicXmlRes = await fetch("./assets/score.musicxml");
  if (musicXmlRes.ok) return musicXmlRes.text();

  const mxlRes = await fetch("./assets/score.mxl");
  if (!mxlRes.ok) throw new Error("score.musicxml / score.mxl 모두 로드 실패");
  return parseMxlToXml(await mxlRes.arrayBuffer());
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
    if (!isMeasureInMission(note.measureNumber)) return;
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

      const rect = document.createElementNS(ns, "rect");
      rect.setAttribute("class", "mission-measure-box");
      rect.setAttribute("data-measure-number", String(measureNumber));
      rect.setAttribute("x", String(minX - 14));
      rect.setAttribute("y", String(minY - 24));
      rect.setAttribute("width", String(maxX - minX + 28));
      rect.setAttribute("height", String(maxY - minY + 68));
      rect.setAttribute("rx", "12");
      rect.setAttribute("ry", "12");
      if (measureNumber === appState.activeMeasureNumber) {
        rect.classList.add("active");
      }
      svg.insertBefore(rect, svg.firstChild);

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
  appState.noteModels.forEach((note) => {
    const el = note.renderedElement;
    if (!el) return;

    el.classList.remove("mission-note", "locked-note", "selected-note", "playback-note");
    if (isMeasureInMission(note.measureNumber)) {
      el.classList.add("mission-note");
    } else {
      el.classList.add("locked-note");
    }
    if (note.noteId === appState.selectedNoteId) {
      el.classList.add("selected-note");
    }
    if (note.noteId === appState.playbackActiveNoteId) {
      el.classList.add("playback-note");
    }
  });

  drawMissionMeasureHighlights();
  applyActiveMeasureZoom();
  queuePersistentHighlightRedraw();
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
  if (dom.playMeasureButton) {
    dom.playMeasureButton.disabled = !getActiveMissionMeasureNumber() || appState.playbackState === "playing";
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
  });

  await appState.osmd.load(stripCredits(xmlText));
  await appState.osmd.render();
}

function onScoreNoteClick(noteId) {
  const note = appState.noteModels.find((item) => item.noteId === noteId);
  if (!note) return;
  if (!isMeasureInMission(note.measureNumber)) {
    showToast("이 구간은 잠겨 있어요");
    return;
  }

  if (appState.selectedNoteId === noteId) {
    appState.selectedNoteId = null;
    refreshRenderedNoteClasses();
    updateSelectedNoteView();
    updateButtonsState();
    return;
  }

  selectMissionMeasure(note.measureNumber);
  appState.selectedNoteId = noteId;
  refreshRenderedNoteClasses();
  updateSelectedNoteView();
  updateButtonsState();
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

function findNextScaleMidi(currentMidi, direction) {
  const step = direction > 0 ? 1 : -1;
  const note = getSelectedNoteModel();
  const keyFifths = note?.keyFifths ?? 0;
  const scalePitchClasses = getScalePitchClassesForKeyFifths(keyFifths);
  const minMidi = appState.allowedMidiMin ?? 12;
  const maxMidi = appState.allowedMidiMax ?? 108;

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
  const currentXml = new XMLSerializer().serializeToString(appState.xmlDoc);
  const parsed = parseMusicXMLToModel(currentXml);
  appState.xmlDoc = parsed.xmlDoc;
  appState.noteModels = parsed.noteModels;
  appState.measureModels = parsed.measureModels;
  buildAllowedScaleMidis(appState.noteModels);
  normalizeAccidentalsInCurrentXml();
  appState.playbackDirty = true;

  await renderScore(currentXml);
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
    if (hasExceededMeasureEditLimit(note)) return;

    const currentMidi = pitchToMidi(note.pitch, note.keyFifths ?? 0);
    const nextMidi = findNextScaleMidi(currentMidi, direction);
    if (nextMidi == null) return showToast("이 음은 사용할 수 없어요(조성 밖/음역 밖)");

    const nextPitch = midiToPitch(nextMidi, appState.rules.key, note.keyFifths ?? 0);
    const before = {
      pitch: pitchToText(note.pitch),
      duration: note.durationType,
      kind: note.isRest ? "rest" : "note",
    };

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
    const randomUnits = buildRandomRhythmUnits(noteList.length, targetUnits, durationUnits);
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
      appState.playbackState = "playing";
      updatePlaybackButtons();
      return;
    }
    if (appState.playbackState === "playing") return;

    await scheduleScorePlayback();
    Tone.Transport.start("+0.01");
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

function resetMissionAndRerender(message) {
  stopScore();
  appState.xmlDoc = new DOMParser().parseFromString(appState.xmlTextOriginal, "application/xml");
  appState.undoStack = [];
  appState.redoStack = [];
  appState.editLogs = [];
  appState.selectedNoteId = null;
  appState.activeMeasureNumber = null;

  const parsed = parseMusicXMLToModel(new XMLSerializer().serializeToString(appState.xmlDoc));
  appState.xmlDoc = parsed.xmlDoc;
  appState.noteModels = parsed.noteModels;
  appState.measureModels = parsed.measureModels;
  buildAllowedScaleMidis(appState.noteModels);

  pickThreeSeparatedMeasures();
  appState.activeMeasureNumber = null;
  updateScoreStatusHeader();
  rebuildFromCurrentXml().then(() => showToast(`${message}: ${appState.mission.list.join(", ")}`));
}

function wireEvents() {
  if (!appState.scoreClickBound) {
    dom.scoreContainer.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
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

  dom.playButton.addEventListener("click", playScore);
  dom.pauseButton.addEventListener("click", pauseScore);
  dom.stopButton.addEventListener("click", stopScore);
  if (dom.playMeasureButton) {
    dom.playMeasureButton.addEventListener("click", playSelectedMeasure);
  }

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

  dom.reloadMissionButton.addEventListener("click", () => {
    resetMissionAndRerender("새 3마디 미션을 선택했어요");
  });
}

async function init() {
  try {
    appState.rules = await loadRules();

    const xmlText = await loadScoreXml();
    appState.xmlTextOriginal = xmlText;

    const parsed = parseMusicXMLToModel(xmlText);
    appState.xmlDoc = parsed.xmlDoc;
    appState.noteModels = parsed.noteModels;
    appState.measureModels = parsed.measureModels;
    buildAllowedScaleMidis(appState.noteModels);
    normalizeAccidentalsInCurrentXml();

    pickThreeSeparatedMeasures();
    appState.activeMeasureNumber = null;
    updateScoreStatusHeader();
    initInstrumentSelect();
    buildDurationButtons();
    wireEvents();
    installHighlightPersistence();

    await renderScore(new XMLSerializer().serializeToString(appState.xmlDoc));
    mapRenderedElementsToNotes();
    refreshRenderedNoteClasses();
    updateSelectedNoteView();
    updateButtonsState();

    showToast(`랜덤 3마디: ${appState.mission.list.join(", ")} (표시된 마디만 편집 가능)`);
  } catch (error) {
    console.error(error);
    showToast(`초기화 실패: ${error.message}`);
  }
}

init();
