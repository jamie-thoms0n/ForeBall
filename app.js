const STORAGE_KEYS = {
  rounds: "foreball.rounds.v1",
  roundsBackup: "foreball.rounds.backup.v1",
  activeRound: "foreball.activeRound.v1",
  meta: "foreball.meta.v1"
};

const COURSES = [
  {
    name: "North Berwick",
    pars: [4, 4, 4, 3, 4, 3, 4, 5, 5, 3, 5, 4, 4, 4, 3, 4, 4, 4],
    strokeIndexes: [9, 11, 1, 15, 5, 17, 3, 13, 7, 18, 2, 8, 12, 6, 14, 4, 10, 16],
    lengths: [312, 414, 444, 168, 359, 139, 344, 487, 502, 153, 523, 363, 362, 359, 178, 360, 405, 268]
  },
  {
    name: "Gullane 1",
    pars: [4, 4, 5, 3, 4, 4, 4, 4, 3, 4, 4, 5, 3, 4, 5, 3, 4, 4],
    strokeIndexes: [14, 4, 8, 18, 1, 16, 10, 6, 12, 2, 7, 11, 15, 3, 9, 13, 5, 17],
    lengths: [287, 345, 479, 134, 436, 299, 398, 398, 141, 434, 427, 423, 160, 409, 487, 177, 390, 338]
  },
  {
    name: "Gullane 2",
    pars: [4, 4, 4, 4, 3, 5, 4, 4, 4, 4, 3, 4, 4, 4, 3, 5, 4, 4],
    strokeIndexes: [9, 7, 13, 1, 17, 5, 15, 3, 11, 6, 16, 10, 2, 12, 18, 4, 8, 14],
    lengths: [356, 326, 233, 425, 171, 498, 358, 352, 347, 340, 194, 376, 384, 336, 167, 471, 351, 291]
  },
  {
    name: "Gullane 3",
    pars: [4, 3, 4, 4, 4, 4, 4, 3, 4, 4, 3, 4, 3, 5, 3, 4, 4, 3],
    strokeIndexes: [3, 17, 5, 13, 7, 1, 11, 15, 9, 4, 18, 8, 14, 2, 12, 6, 10, 16],
    lengths: [341, 144, 293, 250, 314, 342, 311, 165, 327, 450, 135, 371, 186, 443, 176, 379, 328, 179]
  },
  {
    name: "Muirfield",
    pars: [4, 4, 4, 3, 5, 4, 3, 4, 5, 4, 4, 4, 3, 4, 4, 3, 5, 4],
    strokeIndexes: [5, 17, 11, 13, 7, 3, 15, 1, 9, 4, 18, 16, 14, 2, 8, 12, 10, 6],
    lengths: [446, 365, 377, 182, 510, 440, 147, 443, 505, 470, 354, 380, 156, 449, 394, 186, 506, 418]
  },
  {
    name: "Parklands Golf Club",
    pars: [4, 4, 4, 4, 4, 4, 5, 3, 5, 4, 5, 3, 4, 3, 4, 4, 4, 3],
    strokeIndexes: [13, 3, 17, 5, 9, 1, 15, 11, 7, 2, 14, 10, 16, 4, 18, 6, 12, 8],
    lengths: [300, 300, 281, 331, 354, 360, 467, 162, 504, 453, 498, 149, 364, 140, 287, 336, 338, 192]
  },
  {
    name: "Newcastle United Golf Club",
    pars: [4, 4, 4, 3, 4, 5, 3, 4, 5, 5, 4, 4, 5, 3, 3, 4, 4, 4],
    strokeIndexes: [8, 3, 17, 15, 14, 11, 16, 1, 4, 10, 13, 7, 12, 6, 18, 9, 5, 2],
    lengths: [383, 387, 347, 150, 349, 514, 156, 422, 546, 547, 342, 347, 497, 186, 118, 372, 352, 407]
  }
];

const APPROACH_BUCKETS = [
  { label: "40-60", min: 40, max: 60 },
  { label: "60-80", min: 60, max: 80 },
  { label: "80-100", min: 80, max: 100 },
  { label: "100+", min: 100, max: Infinity }
];

const PUTT_BUCKETS = [
  { label: "0-5", min: 0, max: 5 },
  { label: "5-10", min: 5, max: 10 },
  { label: "10-20", min: 10, max: 20 },
  { label: "20+", min: 20, max: Infinity }
];

const PENALTY_PRESETS = {
  threeOffTee: 2,
  lostBall: 1,
  ob: 1
};

const FOLLOW_UP_CONFIG = {
  fairway: {
    left: [{ value: "hook", label: "Hook" }, { value: "left", label: "No Hook" }],
    right: [{ value: "slice", label: "Slice" }, { value: "right", label: "No Slice" }],
    short: [
      { value: "heavy", label: "Heavy" },
      { value: "top", label: "Topped" },
      { value: "short", label: "Neither" }
    ]
  },
  approach: {
    left: [{ value: "hook", label: "Hook" }, { value: "left", label: "No Hook" }],
    right: [{ value: "slice", label: "Slice" }, { value: "right", label: "No Slice" }],
    short: [
      { value: "heavy", label: "Heavy" },
      { value: "top", label: "Topped" },
      { value: "short", label: "Neither" }
    ]
  }
};

let activeRound = loadActiveRound();
let rounds = loadRounds();
let currentHoleIndex = activeRound?.currentHoleIndex || 0;
let charts = {};
let pendingConfirmAction = null;
let openRoundCardMenuId = null;
let selectedRoundId = null;

window.__menuClick = function menuClick(event) {
  toggleRoundMenu(event);
};

window.__pickedUpMenuClick = function pickedUpMenuClick(event) {
  if (event) event.stopPropagation();
  togglePickedUpFromMenu();
};

window.__restartRoundMenuClick = function restartRoundMenuClick(event) {
  if (event) event.stopPropagation();
  openConfirmModal("restart");
};

window.__finishRoundMenuClick = function finishRoundMenuClick(event) {
  if (event) event.stopPropagation();
  finishRoundFromMenu();
};

window.__cancelRoundMenuClick = function cancelRoundMenuClick(event) {
  if (event) event.stopPropagation();
  openConfirmModal("cancel");
};

window.__nextClick = function nextClick(event) {
  goNextHole(event);
};

window.__puttChoiceClick = function puttChoiceClick(choice) { handlePuttChoice(choice); };

window.__otherPuttsChanged = function otherPuttsChanged(value) {
  el.otherPuttsSelect.value = value;
  handleOtherPuttsChange();
};

window.__chipChoiceClick = function chipChoiceClick(choice) { handleChipChoice(choice); };

window.__otherChipsChanged = function otherChipsChanged(value) {
  el.otherChipsSelect.value = value;
  handleOtherChipsChange();
};

window.__bunkerChoiceClick = function bunkerChoiceClick(choice) { handleBunkerChoice(choice); };

window.__otherBunkerChanged = function otherBunkerChanged(value) {
  el.otherBunkerSelect.value = value;
  handleOtherBunkerChange();
};

window.__roundDetailBackClick = function roundDetailBackClick(event) {
  if (event) event.preventDefault();
  closeRoundDetail();
};

const el = {
  brandHomeBtn: document.getElementById("brandHomeBtn"),
  screenTitle: document.getElementById("screenTitle"),
  runningScore: document.getElementById("runningScore"),
  courseSelect: document.getElementById("courseSelect"),
  startPanel: document.getElementById("startPanel"),
  startRoundBtn: document.getElementById("startRoundBtn"),
  resumeRoundBtn: document.getElementById("resumeRoundBtn"),
  holeForm: document.getElementById("holeForm"),
  courseName: document.getElementById("courseName"),
  holeTitle: document.getElementById("holeTitle"),
  holeLength: document.getElementById("holeLength"),
  holeStrokeIndex: document.getElementById("holeStrokeIndex"),
  holePar: document.getElementById("holePar"),
  topPrevHoleBtn: document.getElementById("topPrevHoleBtn"),
  roundMenuBtn: document.getElementById("roundMenuBtn"),
  roundMenu: document.getElementById("roundMenu"),
  menuPickedUpBtn: document.getElementById("menuPickedUpBtn"),
  menuFinishRoundBtn: document.getElementById("menuFinishRoundBtn"),
  menuRestartRoundBtn: document.getElementById("menuRestartRoundBtn"),
  menuCancelRoundBtn: document.getElementById("menuCancelRoundBtn"),
  scoreInput: document.getElementById("scoreInput"),
  scoreAsterisk: document.getElementById("scoreAsterisk"),
  pickedUpValue: document.getElementById("pickedUpValue"),
  fairwayField: document.getElementById("fairwayField"),
  fairwayFollowup: document.getElementById("fairwayFollowup"),
  approachDistanceInput: document.getElementById("approachDistanceInput"),
  approachFollowup: document.getElementById("approachFollowup"),
  puttChoiceButtons: Array.from(document.querySelectorAll(".putt-choice")),
  otherPuttsWrap: document.getElementById("otherPuttsWrap"),
  otherPuttsSelect: document.getElementById("otherPuttsSelect"),
  puttDistanceFields: document.getElementById("puttDistanceFields"),
  chipChoiceButtons: Array.from(document.querySelectorAll(".chip-choice")),
  otherChipsWrap: document.getElementById("otherChipsWrap"),
  otherChipsSelect: document.getElementById("otherChipsSelect"),
  chipTypeFields: document.getElementById("chipTypeFields"),
  bunkerChoiceButtons: Array.from(document.querySelectorAll(".bunker-choice")),
  otherBunkerWrap: document.getElementById("otherBunkerWrap"),
  otherBunkerSelect: document.getElementById("otherBunkerSelect"),
  penaltyButtons: Array.from(document.querySelectorAll(".penalty-button")),
  otherPenaltyWrap: document.getElementById("otherPenaltyWrap"),
  otherPenaltySelect: document.getElementById("otherPenaltySelect"),
  penaltySummary: document.getElementById("penaltySummary"),
  prevHoleBtn: document.getElementById("prevHoleBtn"),
  nextHoleBtn: document.getElementById("nextHoleBtn"),
  dashboardStats: document.getElementById("dashboardStats"),
  dashboardRecent: document.getElementById("dashboardRecent"),
  statsGrid: document.getElementById("statsGrid"),
  roundList: document.getElementById("roundList"),
  roundListSection: document.getElementById("roundListSection"),
  roundDetailSection: document.getElementById("roundDetailSection"),
  roundDetailBackBtn: document.getElementById("roundDetailBackBtn"),
  roundDetailTitle: document.getElementById("roundDetailTitle"),
  roundDetailMeta: document.getElementById("roundDetailMeta"),
  roundDetailStatsBtn: document.getElementById("roundDetailStatsBtn"),
  roundDetailTotal: document.getElementById("roundDetailTotal"),
  roundDetailRelative: document.getElementById("roundDetailRelative"),
  roundDetailParTotal: document.getElementById("roundDetailParTotal"),
  roundDetailGrossTotal: document.getElementById("roundDetailGrossTotal"),
  roundDetailFooterRelative: document.getElementById("roundDetailFooterRelative"),
  roundScoreGrid: document.getElementById("roundScoreGrid"),
  roundDetailTableBody: document.getElementById("roundDetailTableBody"),
  confirmModal: document.getElementById("confirmModal"),
  confirmModalTitle: document.getElementById("confirmModalTitle"),
  confirmModalMessage: document.getElementById("confirmModalMessage"),
  confirmModalCancelBtn: document.getElementById("confirmModalCancelBtn"),
  confirmModalConfirmBtn: document.getElementById("confirmModalConfirmBtn")
};

init();

function init() {
  saveMeta();
  populateCourses();
  bindEvents();
  updateResumeButton();
  if (activeRound) showHole();
  renderRounds();
  setView("dashboard");
  window.addEventListener("load", () => {
    if (document.getElementById("dashboardView").classList.contains("is-active")) {
      queueVisibleRender(renderDashboard);
    }
  });
  registerServiceWorker();
}

function bindEvents() {
  window.addEventListener("beforeunload", flushPersistence);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushPersistence();
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => setView(tab.dataset.view));
  });
  el.brandHomeBtn.addEventListener("click", () => setView("dashboard"));
  document.querySelectorAll("[data-dashboard-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.dashboardView));
  });

  document.querySelectorAll("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const currentValue = numberOrNull(el.scoreInput.value);
      if (currentValue === null) {
        el.scoreInput.value = currentHole().par;
      } else {
        el.scoreInput.value = Math.max(1, currentValue + Number(button.dataset.step));
      }
      saveCurrentHole();
      updateRunningScore();
    });
  });

  document.querySelectorAll(".shot-option").forEach((button) => {
    button.addEventListener("click", () => applyShotSelection(button.dataset.field, button.dataset.value));
  });
  document.querySelectorAll(".shot-clear").forEach((button) => {
    button.addEventListener("click", () => clearShotSelection(button.dataset.field));
  });
  bindToggleableGir();

  el.startRoundBtn.addEventListener("click", startRound);
  el.resumeRoundBtn.addEventListener("click", showHole);
  el.holePar.addEventListener("click", () => {
    if (!activeRound) return;
    el.scoreInput.value = currentHole().par;
    saveCurrentHole();
    updateRunningScore();
  });
  el.prevHoleBtn.onclick = goPrevHole;
  el.topPrevHoleBtn.onclick = goPrevHole;
  el.topNextHoleBtn.onclick = goNextHole;
  el.nextHoleBtn.onclick = goNextHole;
  el.roundMenuBtn.addEventListener("click", toggleRoundMenu);
  el.menuPickedUpBtn.addEventListener("click", togglePickedUpFromMenu);
  el.menuFinishRoundBtn.addEventListener("click", finishRoundFromMenu);
  el.menuRestartRoundBtn.addEventListener("click", () => openConfirmModal("restart"));
  el.menuCancelRoundBtn.addEventListener("click", () => openConfirmModal("cancel"));
  el.confirmModalCancelBtn.addEventListener("click", closeConfirmModal);
  el.confirmModalConfirmBtn.addEventListener("click", runConfirmedAction);
  el.confirmModal.addEventListener("click", (event) => {
    if (event.target === el.confirmModal) closeConfirmModal();
  });
  document.addEventListener("click", handleDocumentClick);

  el.holeForm.addEventListener("input", () => {
    saveCurrentHole();
    updateRunningScore();
  });

  el.puttChoiceButtons.forEach((button) => {
    button.addEventListener("click", () => handlePuttChoice(button.dataset.puttChoice));
  });
  el.otherPuttsSelect.addEventListener("change", handleOtherPuttsChange);
  el.chipChoiceButtons.forEach((button) => {
    button.addEventListener("click", () => handleChipChoice(button.dataset.chipChoice));
  });
  el.otherChipsSelect.addEventListener("change", handleOtherChipsChange);
  el.bunkerChoiceButtons.forEach((button) => {
    button.addEventListener("click", () => handleBunkerChoice(button.dataset.bunkerChoice));
  });
  el.otherBunkerSelect.addEventListener("change", handleOtherBunkerChange);

  el.penaltyButtons.forEach((button) => {
    button.addEventListener("click", () => handlePenaltySelect(button.dataset.penaltyType));
  });
  el.otherPenaltySelect.addEventListener("change", handleOtherPenaltyChange);

  el.roundDetailBackBtn.addEventListener("click", closeRoundDetail);
  el.roundDetailStatsBtn.addEventListener("click", () => {
    if (selectedRoundId) editRound(selectedRoundId);
  });
}

function populateCourses() {
  el.courseSelect.innerHTML = COURSES.map((course) => `<option value="${course.name}">${course.name}</option>`).join("");
}

function startRound() {
  const course = COURSES.find((item) => item.name === el.courseSelect.value);
  activeRound = createRoundState(course);
  currentHoleIndex = 0;
  persistActiveRound();
  showHole();
}

function goPrevHole(event) {
  if (event) event.preventDefault();
  if (!activeRound) return;
  saveCurrentHole();
  currentHoleIndex = Math.max(0, currentHoleIndex - 1);
  activeRound.currentHoleIndex = currentHoleIndex;
  persistActiveRound();
  showHole();
}

function goNextHole(event) {
  if (event) event.preventDefault();
  if (!activeRound) return;
  saveCurrentHole();
  if (currentHoleIndex === 17) completeRound();
  else {
    currentHoleIndex += 1;
    activeRound.currentHoleIndex = currentHoleIndex;
    persistActiveRound();
    showHole();
  }
}

function createRoundState(course) {
  return {
    id: `round_${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    course: course.name,
    currentHoleIndex: 0,
    holes: course.pars.map((par, index) => ({
      hole: index + 1,
      par,
      strokeIndex: course.strokeIndexes?.[index] ?? null,
      length: course.lengths?.[index] ?? null,
      score: null,
      pickedUp: false,
      pickedUpManual: false,
      fairway: par === 3 ? null : null,
      fairwayMiss: null,
      gir: null,
      approachDistance: null,
      approachHit: null,
      approachMiss: null,
      chips: null,
      chipsEntryMode: null,
      chipTypes: [],
      greensideBunker: null,
      bunkerEntryMode: null,
      penaltyType: null,
      penaltyStrokes: null,
      puttsEntryMode: null,
      putts: null,
      puttDistances: []
    }))
  };
}

function showHole() {
  if (!activeRound) return;
  const hole = currentHole();
  el.startPanel.classList.add("hidden");
  el.holeForm.classList.remove("hidden");
  el.courseName.textContent = activeRound.course;
  el.holeTitle.textContent = `Hole ${hole.hole}`;
  el.holeLength.textContent = hole.length ? `Length: ${hole.length} yds` : "Length: -- yds";
  el.holeStrokeIndex.textContent = hole.strokeIndex ? `S.I.: ${hole.strokeIndex}` : "S.I.: --";
  el.holePar.textContent = `Par ${hole.par}`;
  el.scoreInput.value = hole.pickedUp ? hole.par + 3 : hole.score ?? "";
  el.scoreAsterisk.classList.toggle("hidden", !hole.pickedUp);
  el.pickedUpValue.classList.toggle("hidden", !hole.pickedUp);
  el.menuPickedUpBtn.classList.toggle("is-active", Boolean(hole.pickedUp));
  el.approachDistanceInput.value = hole.approachDistance ?? "";
  el.fairwayField.classList.toggle("hidden", hole.par === 3);
  setRadio("gir", hole.gir);
  renderShotUi("fairway", hole.par === 3 ? null : deriveShotState(hole.fairway, hole.fairwayMiss), hole.fairwayMiss);
  renderShotUi("approach", deriveShotState(hole.approachHit, hole.approachMiss), hole.approachMiss);
  renderPuttUi(hole.putts, hole.puttDistances, hole.puttsEntryMode);
  renderChipUi(hole.chips, hole.chipTypes, hole.chipsEntryMode);
  renderBunkerUi(hole.greensideBunker, hole.bunkerEntryMode);
  updatePenaltyUi(hole.penaltyType, hole.penaltyStrokes);
  el.prevHoleBtn.disabled = currentHoleIndex === 0;
  el.topPrevHoleBtn.disabled = currentHoleIndex === 0;
  el.nextHoleBtn.textContent = currentHoleIndex === 17 ? "Finish" : "Next";
  closeRoundMenu();
  updateRunningScore();
}

function saveCurrentHole() {
  if (!activeRound) return false;
  const hole = currentHole();
  const putts = hole.putts;
  const puttDistances = Array.from(document.querySelectorAll(".putt-distance-input")).map((input) => numberOrNull(input.value));
  const enteredScore = numberOrNull(el.scoreInput.value);
  const pickedUp = hole.pickedUpManual || enteredScore === null;
  const nextHole = {
    ...hole,
    score: pickedUp ? hole.par + 3 : enteredScore,
    pickedUp,
    pickedUpManual: hole.pickedUpManual,
    gir: radioValue("gir"),
    approachDistance: limitNumberOrNull(el.approachDistanceInput.value, 999),
    chips: hole.chips ?? null,
    chipsEntryMode: hole.chipsEntryMode ?? null,
    chipTypes: hole.chipTypes ?? [],
    greensideBunker: hole.greensideBunker ?? null,
    bunkerEntryMode: hole.bunkerEntryMode ?? null,
    puttsEntryMode: hole.puttsEntryMode ?? null,
    putts,
    puttDistances: putts === null ? [] : puttDistances.slice(0, putts)
  };
  activeRound.holes[currentHoleIndex] = nextHole;
  activeRound.currentHoleIndex = currentHoleIndex;
  persistActiveRound();
  return true;
}

function completeRound() {
  saveCurrentHole();
  finalizeRemainingHoles();
  const completed = { ...activeRound };
  delete completed.currentHoleIndex;
  rounds = rounds.filter((round) => round.id !== completed.id).concat(normalizeRound(completed));
  saveRounds();
  activeRound = null;
  localStorage.removeItem(STORAGE_KEYS.activeRound);
  currentHoleIndex = 0;
  el.holeForm.classList.add("hidden");
  el.startPanel.classList.remove("hidden");
  updateResumeButton();
  renderDashboard();
  renderAnalytics();
  renderRounds();
  setView("rounds");
}

function editRound(roundId) {
  const round = rounds.find((item) => item.id === roundId);
  if (!round) return;
  activeRound = normalizeRound({ ...round, currentHoleIndex: 0 });
  rounds = rounds.filter((item) => item.id !== roundId);
  saveRounds();
  currentHoleIndex = 0;
  persistActiveRound();
  renderDashboard();
  setView("scorecard");
  showHole();
}

function deleteRound(roundId) {
  if (!confirm("Delete this round?")) return;
  rounds = rounds.filter((round) => round.id !== roundId);
  if (selectedRoundId === roundId) closeRoundDetail();
  saveRounds();
  renderDashboard();
  renderAnalytics();
  renderRounds();
}

function applyShotSelection(field, value) {
  if (!activeRound) return;
  const hole = currentHole();
  const currentSelection = field === "fairway" ? deriveShotState(hole.fairway, hole.fairwayMiss) : deriveShotState(hole.approachHit, hole.approachMiss);
  if (currentSelection === value) {
    clearShotSelection(field);
    return;
  }
  if (field === "fairway") {
    if (value === "hit") {
      hole.fairway = true;
      hole.fairwayMiss = null;
    } else {
      hole.fairway = false;
      hole.fairwayMiss = value;
    }
    renderShotUi("fairway", value, hole.fairwayMiss);
  } else {
    if (value === "hit") {
      hole.approachHit = true;
      hole.approachMiss = null;
    } else {
      hole.approachHit = false;
      hole.approachMiss = value;
    }
    renderShotUi("approach", value, hole.approachMiss);
  }
  persistActiveRound();
}

function clearShotSelection(field) {
  if (!activeRound) return;
  const hole = currentHole();
  if (field === "fairway") {
    hole.fairway = null;
    hole.fairwayMiss = null;
    renderShotUi("fairway", null, null);
  } else {
    hole.approachHit = null;
    hole.approachMiss = null;
    renderShotUi("approach", null, null);
  }
  persistActiveRound();
}

function renderShotUi(field, selected, missValue) {
  document.querySelectorAll(`[data-field="${field}"].shot-option`).forEach((button) => {
    button.classList.toggle("is-active", button.dataset.value === selected);
  });

  const followup = field === "fairway" ? el.fairwayFollowup : el.approachFollowup;
  const hole = currentHole();

  if (selected === "hit") {
    followup.innerHTML = "";
    followup.classList.add("hidden");
    return;
  }
  if (!selected) {
    followup.innerHTML = "";
    followup.classList.add("hidden");
    return;
  }

  const options = FOLLOW_UP_CONFIG[field][selected];
  if (!options) {
    followup.innerHTML = "";
    followup.classList.add("hidden");
    return;
  }

  followup.classList.remove("hidden");
  followup.innerHTML = options
    .map(
      (option) =>
        `<button class="followup-button${missValue === option.value ? " is-active" : ""}" type="button" data-followup-field="${field}" data-followup-value="${option.value}">${option.label}</button>`
    )
    .join("");
  followup.querySelectorAll("[data-followup-field]").forEach((button) => {
    button.addEventListener("click", () => applyFollowup(field, button.dataset.followupValue));
  });
}

function applyFollowup(field, value) {
  if (!activeRound) return;
  const hole = currentHole();
  const currentValue = field === "fairway" ? hole.fairwayMiss : hole.approachMiss;
  if (currentValue === value) {
    clearShotSelection(field);
    return;
  }
  if (field === "fairway") {
    hole.fairway = false;
    hole.fairwayMiss = value;
    renderShotUi("fairway", findPrimaryMiss(value), value);
  } else {
    hole.approachHit = false;
    hole.approachMiss = value;
    renderShotUi("approach", findPrimaryMiss(value), value);
  }
  persistActiveRound();
}

function bindToggleableGir() {
  document.querySelectorAll('input[name="gir"]').forEach((input) => {
    const label = input.closest("label");
    label.addEventListener("click", (event) => {
      event.preventDefault();
      if (!activeRound) return;
      const nextValue = input.checked ? null : input.value === "true";
      setRadio("gir", nextValue);
      handleGirChange();
      saveCurrentHole();
      updateRunningScore();
    });
  });
}

function clearHoleValues(hole) {
  hole.score = hole.par + 3;
  hole.fairway = hole.par === 3 ? null : null;
  hole.fairwayMiss = null;
  hole.gir = null;
  hole.approachDistance = null;
  hole.approachHit = null;
  hole.approachMiss = null;
  hole.chips = null;
  hole.chipsEntryMode = null;
  hole.chipTypes = [];
  hole.greensideBunker = null;
  hole.bunkerEntryMode = null;
  hole.putts = null;
  hole.puttDistances = [];
  hole.penaltyType = null;
  hole.penaltyStrokes = null;
}

function finalizeRemainingHoles() {
  if (!activeRound) return;
  activeRound.holes = activeRound.holes.map((hole, index) => {
    if (index === currentHoleIndex) return normalizeHole(hole);
    if (hole.score !== null) return normalizeHole(hole);
    return normalizeHole({
      ...hole,
      score: hole.par + 3,
      pickedUp: true,
      pickedUpManual: true
    });
  });
}

function toggleRoundMenu(event) {
  event.stopPropagation();
  const open = el.roundMenu.classList.contains("hidden");
  el.roundMenu.classList.toggle("hidden", !open);
  el.roundMenuBtn.setAttribute("aria-expanded", String(open));
}

function closeRoundMenu() {
  el.roundMenu.classList.add("hidden");
  el.roundMenuBtn.setAttribute("aria-expanded", "false");
}

function handleDocumentClick(event) {
  if (!event.target.closest(".menu-anchor")) closeRoundMenu();
  if (!event.target.closest(".card-menu-anchor")) {
    openRoundCardMenuId = null;
    renderRounds();
  }
}

function togglePickedUpFromMenu() {
  if (!activeRound) return;
  const hole = currentHole();
  hole.pickedUpManual = !hole.pickedUpManual;
  hole.pickedUp = hole.pickedUpManual;
  if (hole.pickedUpManual) clearHoleValues(hole);
  persistActiveRound();
  closeRoundMenu();
  showHole();
}

function finishRoundFromMenu() {
  if (!activeRound) return;
  closeRoundMenu();
  completeRound();
}

function openConfirmModal(action) {
  pendingConfirmAction = action;
  el.confirmModalTitle.textContent = action === "restart" ? "Restart round?" : "Cancel round?";
  el.confirmModalMessage.textContent = `Are you sure you want to ${action} round? If you do, existing data from this round will be permanently lost.`;
  el.confirmModalConfirmBtn.textContent = action === "restart" ? "Restart round" : "Delete round";
  el.confirmModal.classList.remove("hidden");
  closeRoundMenu();
}

function closeConfirmModal() {
  pendingConfirmAction = null;
  el.confirmModal.classList.add("hidden");
}

function runConfirmedAction() {
  if (pendingConfirmAction === "restart") restartActiveRound();
  if (pendingConfirmAction === "cancel") cancelActiveRound();
  closeConfirmModal();
}

function restartActiveRound() {
  if (!activeRound) return;
  const course = COURSES.find((item) => item.name === activeRound.course);
  if (!course) return;
  activeRound = createRoundState(course);
  currentHoleIndex = 0;
  persistActiveRound();
  showHole();
}

function cancelActiveRound() {
  activeRound = null;
  currentHoleIndex = 0;
  localStorage.removeItem(STORAGE_KEYS.activeRound);
  el.holeForm.classList.add("hidden");
  el.startPanel.classList.remove("hidden");
  updateResumeButton();
  renderDashboard();
  setView("scorecard");
}

function handlePuttChoice(choice) {
  if (!activeRound) return;
  const hole = currentHole();
  if (choice === "other") {
    if (hole.puttsEntryMode === "other") {
      hole.puttsEntryMode = null;
      hole.putts = null;
    } else {
      hole.puttsEntryMode = "other";
      hole.putts = numberOrNull(el.otherPuttsSelect.value);
    }
  } else if (hole.puttsEntryMode === "preset" && hole.putts === Number(choice)) {
    hole.puttsEntryMode = null;
    hole.putts = null;
  } else {
    hole.puttsEntryMode = "preset";
    hole.putts = Number(choice);
  }
  renderPuttUi(hole.putts, hole.puttDistances, hole.puttsEntryMode);
  persistActiveRound();
}

function handleOtherPuttsChange() {
  if (!activeRound) return;
  const hole = currentHole();
  hole.puttsEntryMode = "other";
  hole.putts = numberOrNull(el.otherPuttsSelect.value);
  renderPuttUi(hole.putts, hole.puttDistances, hole.puttsEntryMode);
  persistActiveRound();
}

function renderPuttUi(putts, distances = [], entryMode = null) {
  el.puttChoiceButtons.forEach((button) => {
    const active = button.dataset.puttChoice === "other" ? entryMode === "other" : String(putts) === button.dataset.puttChoice;
    button.classList.toggle("is-active", active);
  });
  el.otherPuttsWrap.classList.toggle("hidden", entryMode !== "other");
  el.otherPuttsSelect.value = entryMode === "other" && putts !== null ? String(putts) : "";
  const count = Number.isInteger(putts) && putts >= 0 ? putts : 0;
  el.puttDistanceFields.innerHTML = Array.from({ length: count }, (_, index) => {
    const value = distances[index] ?? "";
    return `<div><label for="putt${index}">Putt ${index + 1} length (ft)</label><input id="putt${index}" class="putt-distance-input" type="number" inputmode="numeric" min="0" value="${value}"></div>`;
  }).join("");
}

function handleChipChoice(choice) {
  if (!activeRound) return;
  const hole = currentHole();
  if (choice === "other") {
    if (hole.chipsEntryMode === "other") {
      hole.chipsEntryMode = null;
      hole.chips = null;
    } else {
      hole.chipsEntryMode = "other";
      hole.chips = numberOrNull(el.otherChipsSelect.value);
    }
  } else if (hole.chipsEntryMode === "preset" && hole.chips === Number(choice)) {
    hole.chipsEntryMode = null;
    hole.chips = null;
  } else {
    hole.chipsEntryMode = "preset";
    hole.chips = Number(choice);
  }
  if (!hole.chips) hole.chipTypes = [];
  renderChipUi(hole.chips, hole.chipTypes, hole.chipsEntryMode);
  persistActiveRound();
}

function handleOtherChipsChange() {
  if (!activeRound) return;
  const hole = currentHole();
  hole.chipsEntryMode = "other";
  hole.chips = numberOrNull(el.otherChipsSelect.value);
  if (!hole.chips) hole.chipTypes = [];
  renderChipUi(hole.chips, hole.chipTypes, hole.chipsEntryMode);
  persistActiveRound();
}

function handleChipTypeChange(index, value) {
  if (!activeRound) return;
  const hole = currentHole();
  hole.chipTypes[index] = value || null;
  persistActiveRound();
}

function renderChipUi(chips, chipTypes = [], entryMode = null) {
  el.chipChoiceButtons.forEach((button) => {
    const active = button.dataset.chipChoice === "other" ? entryMode === "other" : String(chips) === button.dataset.chipChoice;
    button.classList.toggle("is-active", active);
  });
  el.otherChipsWrap.classList.toggle("hidden", entryMode !== "other");
  el.otherChipsSelect.value = entryMode === "other" && chips !== null ? String(chips) : "";
  const showTypes = Number.isInteger(chips) && chips > 0;
  el.chipTypeFields.classList.toggle("hidden", !showTypes);
  if (!showTypes) {
    el.chipTypeFields.innerHTML = "";
    return;
  }
  el.chipTypeFields.innerHTML = Array.from({ length: chips }, (_, index) => `
    <div>
      <label for="chipType${index}">Chip ${index + 1} type</label>
      <select id="chipType${index}" data-chip-index="${index}">
        <option value="">Select</option>
        <option value="regular" ${chipTypes[index] === "regular" ? "selected" : ""}>Regular</option>
        <option value="bumpRun" ${chipTypes[index] === "bumpRun" ? "selected" : ""}>Bump and run</option>
        <option value="flop" ${chipTypes[index] === "flop" ? "selected" : ""}>Flop</option>
        <option value="highObstacle" ${chipTypes[index] === "highObstacle" ? "selected" : ""}>High over obstacle</option>
        <option value="rough" ${chipTypes[index] === "rough" ? "selected" : ""}>Out of rough</option>
        <option value="bank" ${chipTypes[index] === "bank" ? "selected" : ""}>Into a bank</option>
        <option value="putter" ${chipTypes[index] === "putter" ? "selected" : ""}>Putter</option>
      </select>
    </div>
  `).join("");
  el.chipTypeFields.querySelectorAll("[data-chip-index]").forEach((select) => {
    select.addEventListener("change", () => handleChipTypeChange(Number(select.dataset.chipIndex), select.value));
  });
}

function handleBunkerChoice(choice) {
  if (!activeRound) return;
  const hole = currentHole();
  if (choice === "other") {
    if (hole.bunkerEntryMode === "other") {
      hole.bunkerEntryMode = null;
      hole.greensideBunker = null;
    } else {
      hole.bunkerEntryMode = "other";
      hole.greensideBunker = numberOrNull(el.otherBunkerSelect.value);
    }
  } else if (hole.bunkerEntryMode === "preset" && hole.greensideBunker === Number(choice)) {
    hole.bunkerEntryMode = null;
    hole.greensideBunker = null;
  } else {
    hole.bunkerEntryMode = "preset";
    hole.greensideBunker = Number(choice);
  }
  renderBunkerUi(hole.greensideBunker, hole.bunkerEntryMode);
  persistActiveRound();
}

function handleOtherBunkerChange() {
  if (!activeRound) return;
  const hole = currentHole();
  hole.bunkerEntryMode = "other";
  hole.greensideBunker = numberOrNull(el.otherBunkerSelect.value);
  renderBunkerUi(hole.greensideBunker, hole.bunkerEntryMode);
  persistActiveRound();
}

function renderBunkerUi(value, entryMode = null) {
  el.bunkerChoiceButtons.forEach((button) => {
    const active = button.dataset.bunkerChoice === "other" ? entryMode === "other" : String(value) === button.dataset.bunkerChoice;
    button.classList.toggle("is-active", active);
  });
  el.otherBunkerWrap.classList.toggle("hidden", entryMode !== "other");
  el.otherBunkerSelect.value = entryMode === "other" && value !== null ? String(value) : "";
}

function handleGirChange() {
  if (!activeRound) return;
  const hole = currentHole();
  if (radioValue("gir") === true && hole.putts === null && numberOrNull(el.scoreInput.value) === hole.par) {
    hole.puttsEntryMode = "preset";
    hole.putts = 2;
    renderPuttUi(hole.putts, hole.puttDistances, hole.puttsEntryMode);
    persistActiveRound();
    return;
  }
  if (radioValue("gir") === false && numberOrNull(el.scoreInput.value) === hole.par) {
    if (hole.chips === null) {
      hole.chipsEntryMode = "preset";
      hole.chips = 1;
      hole.chipTypes = ["regular"];
      renderChipUi(hole.chips, hole.chipTypes, hole.chipsEntryMode);
    }
    if (hole.putts === null) {
      hole.puttsEntryMode = "preset";
      hole.putts = 1;
      renderPuttUi(hole.putts, hole.puttDistances, hole.puttsEntryMode);
    }
    persistActiveRound();
  }
}

function handlePenaltySelect(type) {
  if (!activeRound) return;
  const hole = currentHole();
  if (hole.penaltyType === type) {
    hole.penaltyType = null;
    hole.penaltyStrokes = null;
  } else {
    hole.penaltyType = type;
    hole.penaltyStrokes = type === "other" ? numberOrNull(el.otherPenaltySelect.value) : PENALTY_PRESETS[type];
  }
  updatePenaltyUi(hole.penaltyType, hole.penaltyStrokes);
  persistActiveRound();
}

function handleOtherPenaltyChange() {
  if (!activeRound) return;
  const hole = currentHole();
  if (hole.penaltyType !== "other") return;
  hole.penaltyStrokes = numberOrNull(el.otherPenaltySelect.value);
  updatePenaltyUi(hole.penaltyType, hole.penaltyStrokes);
  persistActiveRound();
}

function updatePenaltyUi(type, strokes) {
  el.penaltyButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.penaltyType === type);
  });
  el.otherPenaltyWrap.classList.toggle("hidden", type !== "other");
  el.otherPenaltySelect.value = type === "other" && strokes !== null ? String(strokes) : "";
  el.penaltySummary.classList.toggle("hidden", !type);
  if (!type) {
    el.penaltySummary.textContent = "";
    return;
  }
  const label = type === "threeOffTee" ? "3 off the tee" : type === "lostBall" ? "Lost Ball" : type === "ob" ? "OB" : "Other";
  el.penaltySummary.textContent = strokes === null ? `${label}` : `${label}: ${strokes}`;
}

function renderDashboard() {
  const scoredRounds = rounds.filter(hasRoundScore);
  const recent7 = countRoundsSince(7);
  const recent30 = countRoundsSince(30);
  const activeRoundLabel = activeRound ? `${activeRound.course} · Hole ${currentHoleIndex + 1}` : "None";

  el.dashboardStats.innerHTML = [
    ["Completed rounds", rounds.length],
    ["Scoring average", scoredRounds.length ? average(scoredRounds.map(totalScore)).toFixed(1) : "0.0"],
    ["Played last 7 days", recent7],
    ["Active round", activeRoundLabel]
  ]
    .map(([label, value]) => `<div class="stat-card"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  el.dashboardRecent.innerHTML = [
    ["Last 7 days", `${recent7} rounds`],
    ["Last 30 days", `${recent30} rounds`],
    ["Most recent round", mostRecentRoundLabel()],
    ["Best score", bestScoreLabel()]
  ]
    .map(([label, value]) => `<div class="dashboard-mini-card"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  drawChart(
    "dashboardScoreChart",
    "line",
    scoredRounds.map((round) => round.date),
    scoredRounds.map(totalScore),
    "Score"
  );
}

function renderAnalytics() {
  const stats = calculateStats(rounds);
  el.statsGrid.innerHTML = [
    ["Rounds", rounds.length],
    ["Scoring Avg", stats.scoringAverage],
    ["Fairway", `${stats.fairwayPct}%`],
    ["GIR", `${stats.girPct}%`],
    ["Putts/Round", stats.puttsPerRound],
    ["3-Putt Rate", `${stats.threePuttPct}%`]
  ]
    .map(([label, value]) => `<div class="stat-card"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  drawChart("scoreTrendChart", "line", rounds.filter(hasRoundScore).map((round) => round.date), rounds.filter(hasRoundScore).map(totalScore), "Score");
  drawChart("approachChart", "bar", stats.approachBuckets.map((item) => item.label), stats.approachBuckets.map((item) => item.hitPct), "Hit %");
  drawChart("puttChart", "bar", stats.puttBuckets.map((item) => item.label), stats.puttBuckets.map((item) => item.avgPutts), "Avg putts");
  drawScatter(
    "girCorrelationChart",
    rounds.filter(hasRoundScore).map((round) => ({ x: girCount(round), y: totalScore(round) })),
    "GIR",
    "Score"
  );
  drawScatter(
    "threePuttCorrelationChart",
    rounds.filter(hasRoundScore).map((round) => ({ x: threePuttCount(round), y: totalScore(round) })),
    "3-putts",
    "Score"
  );
}

function calculateStats(sourceRounds) {
  const holes = sourceRounds.flatMap((round) => round.holes.map(normalizeHole));
  const scoredRounds = sourceRounds.filter(hasRoundScore);
  const roundsWithPutts = sourceRounds.filter((round) => round.holes.some((hole) => hole.putts !== null));
  const fairwayHoles = holes.filter((hole) => hole.fairway !== null);
  const girHoles = holes.filter((hole) => hole.gir !== null);
  const puttHoles = holes.filter((hole) => hole.putts !== null);
  const puttTotal = puttHoles.reduce((sum, hole) => sum + hole.putts, 0);
  const threePutts = puttHoles.filter((hole) => hole.putts >= 3).length;

  return {
    scoringAverage: average(scoredRounds.map(totalScore)).toFixed(1),
    fairwayPct: pct(fairwayHoles.filter((hole) => hole.fairway).length, fairwayHoles.length),
    girPct: pct(girHoles.filter((hole) => hole.gir).length, girHoles.length),
    puttsPerRound: roundsWithPutts.length ? (puttTotal / roundsWithPutts.length).toFixed(1) : "0.0",
    threePuttPct: pct(threePutts, puttHoles.length),
    approachBuckets: APPROACH_BUCKETS.map((bucket) => {
      const bucketHoles = holes.filter((hole) => inBucket(hole.approachDistance, bucket) && hole.approachHit !== null);
      return { label: bucket.label, hitPct: pct(bucketHoles.filter((hole) => hole.approachHit).length, bucketHoles.length) };
    }),
    puttBuckets: PUTT_BUCKETS.map((bucket) => {
      const bucketHoles = holes.filter((hole) => inBucket(hole.puttDistances?.[0], bucket) && hole.putts !== null);
      return { label: bucket.label, avgPutts: Number(average(bucketHoles.map((hole) => hole.putts)).toFixed(1)) };
    })
  };
}

function renderRounds() {
  if (!rounds.length) {
    el.roundList.innerHTML = `<div class="panel"><p>No completed rounds yet.</p></div>`;
    el.roundListSection.classList.remove("hidden");
    el.roundDetailSection.classList.add("hidden");
    return;
  }
  el.roundListSection.classList.remove("hidden");
  el.roundDetailSection.classList.add("hidden");
  el.roundList.innerHTML = rounds
    .slice()
    .reverse()
    .map((round) => `
      <article class="round-card">
        <header>
          <div>
            <h2>${round.course}</h2>
            <p>${round.date}</p>
          </div>
          <strong>${formatRelative(totalScore(round), totalPar(round))}</strong>
        </header>
        <p class="round-summary">${totalScore(round)} shots · ${sumKnownPutts(round)} putts · ${girCount(round)} GIR</p>
        <div class="card-actions">
          <button class="secondary-action" type="button" data-view-round="${round.id}">View</button>
          <div class="card-menu-anchor">
            <button class="card-menu-button" type="button" data-round-menu="${round.id}" aria-label="Round options">...</button>
            <div class="card-menu${openRoundCardMenuId === round.id ? "" : " hidden"}">
              <button class="card-menu-item" type="button" data-edit="${round.id}">Edit</button>
              <button class="card-menu-item hole-menu-item-danger" type="button" data-delete="${round.id}">Delete</button>
            </div>
          </div>
        </div>
      </article>
    `)
    .join("");
  document.querySelectorAll("[data-view-round]").forEach((button) => button.addEventListener("click", () => openRoundDetail(button.dataset.viewRound)));
  document.querySelectorAll("[data-round-menu]").forEach((button) =>
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openRoundCardMenuId = openRoundCardMenuId === button.dataset.roundMenu ? null : button.dataset.roundMenu;
      renderRounds();
    })
  );
  document.querySelectorAll("[data-edit]").forEach((button) => button.addEventListener("click", () => editRound(button.dataset.edit)));
  document.querySelectorAll("[data-delete]").forEach((button) => button.addEventListener("click", () => deleteRound(button.dataset.delete)));
}

function openRoundDetail(roundId) {
  const round = rounds.find((item) => item.id === roundId);
  if (!round) return;
  selectedRoundId = roundId;
  openRoundCardMenuId = null;
  el.roundListSection.classList.add("hidden");
  el.roundDetailSection.classList.remove("hidden");
  el.roundDetailTitle.textContent = round.course;
  el.roundDetailMeta.textContent = round.date;
  el.roundDetailTotal.textContent = totalScore(round);
  el.roundDetailRelative.textContent = formatRelative(totalScore(round), totalPar(round));
  el.roundDetailParTotal.textContent = `Par ${totalPar(round)}`;
  el.roundDetailGrossTotal.textContent = `Gross ${totalScore(round)}`;
  el.roundDetailFooterRelative.textContent = `(${formatRelative(totalScore(round), totalPar(round))})`;
  el.roundScoreGrid.innerHTML = round.holes
    .map((hole) => `
      <div class="round-score-cell">
        <span class="round-score-hole">${hole.hole}</span>
        <span class="round-score-mark ${scoreDecorationClass(hole)}">${displayHoleScore(hole)}</span>
      </div>
    `)
    .join("");
  el.roundDetailTableBody.innerHTML = round.holes
    .map((hole) => `
      <tr>
        <td>${hole.hole}</td>
        <td>${hole.strokeIndex ?? "--"}</td>
        <td>${hole.par}</td>
        <td class="table-score-cell"><span class="round-score-mark ${scoreDecorationClass(hole)}">${displayHoleScore(hole)}</span></td>
      </tr>
    `)
    .join("");
}

function closeRoundDetail() {
  selectedRoundId = null;
  el.roundDetailSection.classList.add("hidden");
  el.roundListSection.classList.remove("hidden");
  renderRounds();
}

function drawChart(id, type, labels, data, label) {
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart(document.getElementById(id), {
    type,
    data: {
      labels,
      datasets: [{
        label,
        data,
        borderColor: type === "bar" ? "#041d4d" : "#63d11f",
        backgroundColor: type === "bar" ? "#041d4d" : "#63d11f",
        tension: 0.25
      }]
    },
    options: chartOptions()
  });
}

function drawScatter(id, data, xLabel, yLabel) {
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart(document.getElementById(id), {
    type: "scatter",
    data: {
      datasets: [{
        label: `${yLabel} vs ${xLabel}`,
        data,
        borderColor: "#041d4d",
        backgroundColor: "#63d11f",
        pointRadius: 5
      }]
    },
    options: {
      ...chartOptions(),
      scales: {
        x: axisOptions(xLabel),
        y: axisOptions(yLabel)
      }
    }
  });
}

function chartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#041d4d" } }
    },
    scales: {
      x: axisOptions(""),
      y: axisOptions("")
    }
  };
}

function axisOptions(title) {
  return {
    title: { display: Boolean(title), text: title, color: "#041d4d" },
    ticks: { color: "#041d4d" },
    grid: { color: "#dce4f3" }
  };
}

function exportJson() {
  download("foreball-rounds.json", JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), rounds }, null, 2), "application/json");
}

function exportCsv() {
  const header = [
    "roundId",
    "date",
    "course",
    "hole",
    "par",
    "score",
    "pickedUp",
    "fairway",
    "fairwayMiss",
    "gir",
    "approachHit",
    "approachMiss",
    "approachDistance",
    "chips",
    "chipTypes",
    "greensideBunker",
    "penaltyType",
    "penaltyStrokes",
    "putts",
    "puttDistances"
  ];
  const rows = rounds.flatMap((round) =>
    round.holes.map((hole) => [
      round.id,
      round.date,
      round.course,
      hole.hole,
      hole.par,
      hole.score,
      hole.pickedUp,
      hole.fairway,
      hole.fairwayMiss,
      hole.gir,
      hole.approachHit,
      hole.approachMiss,
      hole.approachDistance,
      hole.chips,
      (hole.chipTypes || []).join("|"),
      hole.greensideBunker,
      hole.penaltyType,
      hole.penaltyStrokes,
      hole.putts,
      (hole.puttDistances || []).join("|")
    ])
  );
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  download("foreball-rounds.csv", csv, "text/csv");
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function setView(view) {
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === view));
  document.querySelectorAll(".view").forEach((section) => section.classList.remove("is-active"));
  document.getElementById(`${view}View`).classList.add("is-active");
  el.screenTitle.textContent =
    view === "dashboard" ? "Dashboard" : view === "scorecard" ? "Scorecard" : view === "analytics" ? "Analytics" : "Rounds";
  if (view === "dashboard") queueVisibleRender(renderDashboard);
  if (view === "analytics") queueVisibleRender(renderAnalytics);
  if (view === "rounds") renderRounds();
}

function queueVisibleRender(renderFn) {
  requestAnimationFrame(() => requestAnimationFrame(renderFn));
}

function updateRunningScore() {
  if (!activeRound) {
    el.runningScore.textContent = "E";
    return;
  }
  el.runningScore.textContent = formatRelative(totalScore(activeRound), totalPar(activeRound));
}

function updateResumeButton() {
  el.resumeRoundBtn.classList.toggle("hidden", !activeRound);
}

function persistActiveRound() {
  localStorage.setItem(STORAGE_KEYS.activeRound, JSON.stringify(activeRound));
  updateResumeButton();
}

function saveRounds() {
  const payload = JSON.stringify(rounds);
  localStorage.setItem(STORAGE_KEYS.rounds, payload);
  localStorage.setItem(STORAGE_KEYS.roundsBackup, payload);
}

function saveMeta() {
  localStorage.setItem(STORAGE_KEYS.meta, JSON.stringify({ courses: COURSES, updatedAt: new Date().toISOString() }));
}

function loadRounds() {
  const primary = safeLoadJson(STORAGE_KEYS.rounds);
  if (Array.isArray(primary)) return primary.map(normalizeRound);
  const backup = safeLoadJson(STORAGE_KEYS.roundsBackup);
  if (Array.isArray(backup)) return backup.map(normalizeRound);
  return [];
}

function loadActiveRound() {
  const round = safeLoadJson(STORAGE_KEYS.activeRound);
  return round ? normalizeRound(round) : null;
}

function flushPersistence() {
  try {
    if (activeRound) persistActiveRound();
    saveRounds();
  } catch (error) {
    console.error("Persistence flush failed", error);
  }
}

function safeLoadJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error(`Failed to load storage key: ${key}`, error);
    return null;
  }
}

function currentHole() {
  return activeRound.holes[currentHoleIndex];
}

function setRadio(name, value) {
  document.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
    input.checked = value !== null && String(value) === input.value;
  });
}

function radioValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value === "true" : null;
}

function numberOrNull(value) {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function limitNumberOrNull(value, max) {
  const parsed = numberOrNull(value);
  if (parsed === null) return null;
  return Math.min(parsed, max);
}

function totalScore(round) {
  return round.holes.reduce((sum, hole) => sum + (hole.score || 0), 0);
}

function totalPar(round) {
  return round.holes.reduce((sum, hole) => sum + (hole.score !== null ? hole.par : 0), 0);
}

function displayHoleScore(hole) {
  if (hole.score === null) return "—";
  return hole.pickedUp ? `${hole.score}*` : String(hole.score);
}

function scoreDecorationClass(hole) {
  if (hole.score === null) return "";
  const diff = hole.score - hole.par;
  if (diff <= -2) return "is-eagle";
  if (diff === -1) return "is-birdie";
  if (diff === 1) return "is-bogey";
  if (diff >= 2) return "is-double-bogey";
  return "";
}

function girCount(round) {
  return round.holes.filter((hole) => hole.gir).length;
}

function threePuttCount(round) {
  return round.holes.filter((hole) => hole.putts !== null && hole.putts >= 3).length;
}

function sumKnownPutts(round) {
  return round.holes.reduce((sum, hole) => sum + (hole.putts || 0), 0);
}

function hasRoundScore(round) {
  return round.holes.some((hole) => hole.score !== null);
}

function formatRelative(score, par) {
  const diff = score - par;
  if (diff === 0) return "E";
  return diff > 0 ? `+${diff}` : String(diff);
}

function pct(part, total) {
  return total ? Math.round((part / total) * 100) : 0;
}

function countRoundsSince(days) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return rounds.filter((round) => new Date(round.date) >= cutoff).length;
}

function mostRecentRoundLabel() {
  if (!rounds.length) return "No rounds";
  const recent = rounds.slice().sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  return `${recent.course} · ${recent.date}`;
}

function bestScoreLabel() {
  const scoredRounds = rounds.filter(hasRoundScore);
  if (!scoredRounds.length) return "No score";
  const best = scoredRounds.slice().sort((a, b) => totalScore(a) - totalScore(b))[0];
  return `${totalScore(best)} · ${best.course}`;
}

function average(values) {
  const clean = values.filter((value) => Number.isFinite(value));
  return clean.length ? clean.reduce((sum, value) => sum + value, 0) / clean.length : 0;
}

function inBucket(value, bucket) {
  return typeof value === "number" && value >= bucket.min && value < bucket.max;
}

function csvCell(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function registerServiceWorker() {
  const isLocalhost = ["127.0.0.1", "localhost"].includes(window.location.hostname);
  if ("serviceWorker" in navigator && !isLocalhost) {
    navigator.serviceWorker.register("./sw.js");
  }
}

function normalizeRound(round) {
  return {
    ...round,
    holes: (round.holes || []).map(normalizeHole)
  };
}

function normalizeHole(hole) {
  return {
    ...hole,
    strokeIndex: hole.strokeIndex ?? null,
    length: hole.length ?? null,
    pickedUp: Boolean(hole.pickedUp),
    pickedUpManual: Boolean(hole.pickedUpManual ?? hole.pickedUp),
    fairway: hole.fairway ?? hole.fir ?? null,
    fairwayMiss: hole.fairwayMiss ?? null,
    approachHit: hole.approachHit ?? null,
    approachMiss: hole.approachMiss ?? null,
    chips: hole.chips ?? null,
    chipsEntryMode: hole.chipsEntryMode ?? (hole.chips !== null && ![1, 2, 3].includes(hole.chips) ? "other" : hole.chips !== null ? "preset" : null),
    chipTypes: hole.chipTypes ?? [],
    greensideBunker: hole.greensideBunker ?? null,
    bunkerEntryMode: hole.bunkerEntryMode ?? (hole.greensideBunker !== null && ![1, 2, 3].includes(hole.greensideBunker) ? "other" : hole.greensideBunker !== null ? "preset" : null),
    penaltyType: hole.penaltyType ?? null,
    penaltyStrokes: hole.penaltyStrokes ?? null,
    puttsEntryMode: hole.puttsEntryMode ?? (hole.putts !== null && ![1, 2, 3].includes(hole.putts) ? "other" : hole.putts !== null ? "preset" : null),
    putts: hole.putts ?? null,
    puttDistances: hole.puttDistances ?? []
  };
}

function deriveShotState(hitValue, missValue) {
  if (hitValue === true) return "hit";
  if (hitValue === false) return findPrimaryMiss(missValue);
  return null;
}

function findPrimaryMiss(value) {
  if (!value) return null;
  if (value === "hook" || value === "left") return "left";
  if (value === "slice" || value === "right") return "right";
  if (value === "heavy" || value === "top" || value === "short") return "short";
  return "long";
}

function formatMissLabel(value) {
  if (value === "top") return "topped";
  return capitalize(value);
}

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}
