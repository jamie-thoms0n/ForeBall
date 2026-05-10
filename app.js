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
let editingCompletedRoundId = null;
let analyticsRange = "last20";
let analyticsTab = "overview";

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

window.__penaltyChoiceClick = function penaltyChoiceClick(type) { handlePenaltySelect(type); };

window.__otherPenaltyChanged = function otherPenaltyChanged(value) {
  el.otherPenaltySelect.value = value;
  handleOtherPenaltyChange();
};

window.__roundDetailBackClick = function roundDetailBackClick(event) {
  if (event) event.preventDefault();
  closeRoundDetail();
};

window.__roundDetailStatsClick = function roundDetailStatsClick(event) {
  if (event) event.preventDefault();
  if (selectedRoundId) editRound(selectedRoundId);
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
  analyticsRangeSelect: document.getElementById("analyticsRangeSelect"),
  analyticsContent: document.getElementById("analyticsContent"),
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
  roundStatsSection: document.getElementById("roundStatsSection"),
  roundStatsBackBtn: document.getElementById("roundStatsBackBtn"),
  roundStatsTitle: document.getElementById("roundStatsTitle"),
  roundStatsMeta: document.getElementById("roundStatsMeta"),
  roundStatsViewRoundBtn: document.getElementById("roundStatsViewRoundBtn"),
  roundStatsGross: document.getElementById("roundStatsGross"),
  roundStatsRelative: document.getElementById("roundStatsRelative"),
  roundStatsGrid: document.getElementById("roundStatsGrid"),
  roundStatsTableBody: document.getElementById("roundStatsTableBody"),
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
  document.querySelectorAll("[data-analytics-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      analyticsTab = button.dataset.analyticsTab;
      renderAnalytics();
    });
  });
  el.analyticsRangeSelect.addEventListener("change", () => {
    analyticsRange = el.analyticsRangeSelect.value;
    renderAnalytics();
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
  el.roundStatsBackBtn.addEventListener("click", closeRoundStats);
  el.roundStatsViewRoundBtn.addEventListener("click", () => {
    if (selectedRoundId) openRoundDetail(selectedRoundId);
  });
}

function populateCourses() {
  el.courseSelect.innerHTML = COURSES.map((course) => `<option value="${course.name}">${course.name}</option>`).join("");
}

function startRound() {
  const course = COURSES.find((item) => item.name === el.courseSelect.value);
  editingCompletedRoundId = null;
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
  const completedRound = normalizeRound(completed);
  rounds = rounds.filter((round) => round.id !== completed.id).concat(completedRound);
  saveRounds();
  editingCompletedRoundId = null;
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
  openRoundDetail(completedRound.id);
}

function editRound(roundId) {
  const round = rounds.find((item) => item.id === roundId);
  if (!round) return;
  editingCompletedRoundId = roundId;
  activeRound = normalizeRound({ ...round, currentHoleIndex: 0 });
  localStorage.removeItem(STORAGE_KEYS.activeRound);
  currentHoleIndex = 0;
  updateResumeButton();
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
  editingCompletedRoundId = null;
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
  const activeRoundLabel = activeRound && !editingCompletedRoundId ? `${activeRound.course} · Hole ${currentHoleIndex + 1}` : "None";

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
  updateAnalyticsUi();
  destroyAnalyticsCharts();
  const filteredRounds = getAnalyticsRounds();
  const roundMetrics = filteredRounds.map(buildRoundMetrics);
  if (!filteredRounds.length) {
    el.analyticsContent.innerHTML = `<div class="panel"><h2>No data for this range</h2><p class="analytics-note">Try a wider range or add more completed rounds.</p></div>`;
    return;
  }
  if (analyticsTab === "overview") renderAnalyticsOverview(filteredRounds, roundMetrics);
  if (analyticsTab === "drivers") renderAnalyticsDrivers(filteredRounds, roundMetrics);
  if (analyticsTab === "ballStriking") renderAnalyticsBallStriking(filteredRounds, roundMetrics);
  if (analyticsTab === "shortGame") renderAnalyticsShortGame(filteredRounds, roundMetrics);
  if (analyticsTab === "putting") renderAnalyticsPutting(filteredRounds, roundMetrics);
  if (analyticsTab === "trends") renderAnalyticsTrends(filteredRounds, roundMetrics);
  if (analyticsTab === "comparisons") renderAnalyticsComparisons(filteredRounds, roundMetrics);
}

function updateAnalyticsUi() {
  el.analyticsRangeSelect.value = analyticsRange;
  document.querySelectorAll("[data-analytics-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.analyticsTab === analyticsTab);
  });
}

function destroyAnalyticsCharts() {
  Object.keys(charts).forEach((id) => {
    if (id !== "dashboardScoreChart") {
      charts[id].destroy();
      delete charts[id];
    }
  });
}

function getAnalyticsRounds() {
  const sorted = rounds.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
  const now = new Date();
  if (analyticsRange === "last20") return sorted.slice(-20);
  if (analyticsRange === "all") return sorted;
  const cutoff = new Date(now);
  if (analyticsRange === "ytd" || analyticsRange === "calendarYear") {
    return sorted.filter((round) => new Date(round.date).getFullYear() === now.getFullYear());
  }
  if (analyticsRange === "threeMonths") cutoff.setMonth(cutoff.getMonth() - 3);
  if (analyticsRange === "month") cutoff.setMonth(cutoff.getMonth() - 1);
  if (analyticsRange === "week") cutoff.setDate(cutoff.getDate() - 7);
  return sorted.filter((round) => new Date(round.date) >= cutoff);
}

function buildRoundMetrics(round) {
  const holes = round.holes.map(normalizeHole);
  const fairwayHoles = holes.filter((hole) => hole.fairway !== null);
  const girHoles = holes.filter((hole) => hole.gir !== null);
  const approachHoles = holes.filter((hole) => hole.approachHit !== null);
  const puttHoles = holes.filter((hole) => hole.putts !== null);
  const firstPuttDistances = holes.map((hole) => hole.puttDistances?.[0]).filter((value) => typeof value === "number");
  const chipTypes = holes.flatMap((hole) => hole.chipTypes || []);
  const missedGir = holes.filter((hole) => hole.gir === false);
  const score = totalScore(round);
  return {
    round,
    score,
    overPar: score - totalPar(round),
    girPct: pct(girHoles.filter((hole) => hole.gir).length, girHoles.length),
    firPct: pct(fairwayHoles.filter((hole) => hole.fairway).length, fairwayHoles.length),
    approachHitPct: pct(approachHoles.filter((hole) => hole.approachHit).length, approachHoles.length),
    girCount: girCount(round),
    firCount: fairwayHoles.filter((hole) => hole.fairway).length,
    puttsTotal: puttHoles.reduce((sum, hole) => sum + hole.putts, 0),
    avgPutts: average(puttHoles.map((hole) => hole.putts)),
    threePutts: puttHoles.filter((hole) => hole.putts >= 3).length,
    puttsOver6: holes.reduce((sum, hole) => sum + countHolePuttsByDistance(hole, "over"), 0),
    puttsUnder6: holes.reduce((sum, hole) => sum + countHolePuttsByDistance(hole, "under"), 0),
    firstPuttDistance: average(firstPuttDistances),
    chipsTotal: holes.reduce((sum, hole) => sum + (hole.chips || 0), 0),
    bunkerTotal: holes.reduce((sum, hole) => sum + (hole.greensideBunker || 0), 0),
    penaltiesTotal: holes.reduce((sum, hole) => sum + (hole.penaltyStrokes || 0), 0),
    avgApproachDistance: average(holes.map((hole) => hole.approachDistance)),
    scramblePct: pct(missedGir.filter((hole) => hole.score !== null && hole.score <= hole.par).length, missedGir.length),
    chipRegular: chipTypes.filter((type) => type === "regular").length,
    chipBumpRun: chipTypes.filter((type) => type === "bumpRun").length,
    chipFlop: chipTypes.filter((type) => type === "flop").length,
    chipHighObstacle: chipTypes.filter((type) => type === "highObstacle").length,
    chipRough: chipTypes.filter((type) => type === "rough").length,
    chipBank: chipTypes.filter((type) => type === "bank").length,
    chipPutter: chipTypes.filter((type) => type === "putter").length,
    avgPar3: average(holes.filter((hole) => hole.par === 3).map((hole) => hole.score)),
    avgPar4: average(holes.filter((hole) => hole.par === 4).map((hole) => hole.score)),
    avgPar5: average(holes.filter((hole) => hole.par === 5).map((hole) => hole.score))
  };
}

function renderAnalyticsOverview(filteredRounds, roundMetrics) {
  const overview = {
    scoreAvg: average(roundMetrics.map((item) => item.score)).toFixed(1),
    girPct: pct(sum(roundMetrics.map((item) => item.girCount)), sum(roundMetrics.map((item) => item.round.holes.filter((hole) => hole.gir !== null).length))),
    firPct: pct(sum(roundMetrics.map((item) => item.firCount)), sum(roundMetrics.map((item) => item.round.holes.filter((hole) => hole.fairway !== null).length))),
    puttsAvg: average(roundMetrics.map((item) => item.puttsTotal)).toFixed(1),
    penaltiesAvg: average(roundMetrics.map((item) => item.penaltiesTotal)).toFixed(1),
    scramblePct: Math.round(average(roundMetrics.map((item) => item.scramblePct)))
  };
  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="stats-grid">
        ${renderStatCards([
          ["Rounds", filteredRounds.length],
          ["Scoring Avg", overview.scoreAvg],
          ["FIR %", `${overview.firPct}%`],
          ["GIR %", `${overview.girPct}%`],
          ["Avg Putts", overview.puttsAvg],
          ["Penalties/Round", overview.penaltiesAvg],
          ["Scrambling %", `${overview.scramblePct}%`],
          ["Best Score", Math.min(...roundMetrics.map((item) => item.score))]
        ])}
      </div>
      <div class="chart-panel"><div class="analytics-section-header"><h2>Score Over Time</h2><span class="analytics-kicker">${filterLabel()}</span></div><div class="chart-wrap"><canvas id="analyticsOverviewScoreChart"></canvas></div></div>
      <div class="chart-panel"><div class="analytics-section-header"><h2>Core Performance Trends</h2><span class="analytics-note">FIR %, GIR %, and approach hit % by round</span></div><div class="chart-wrap"><canvas id="analyticsOverviewCoreChart"></canvas></div></div>
      <div class="panel"><div class="analytics-section-header"><h2>Approach Distance Buckets</h2><span class="analytics-note">How scoring and hit rate change by yardage</span></div>${renderApproachBucketTable(filteredRounds)}</div>
    </div>
  `;
  drawChart("analyticsOverviewScoreChart", "line", filteredRounds.map((round) => round.date), roundMetrics.map((item) => item.score), "Score");
  drawMultiLineChart("analyticsOverviewCoreChart", filteredRounds.map((round) => round.date), [
    { label: "FIR %", data: roundMetrics.map((item) => item.firPct), color: "#041d4d" },
    { label: "GIR %", data: roundMetrics.map((item) => item.girPct), color: "#63d11f" },
    { label: "Approach Hit %", data: roundMetrics.map((item) => item.approachHitPct), color: "#8aa2d3" }
  ], "%");
}

function renderAnalyticsDrivers(filteredRounds, roundMetrics) {
  const rows = buildCorrelationRows(roundMetrics);
  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="panel">
        <div class="analytics-section-header"><h2>Score Correlations</h2><span class="analytics-note">Google Sheets style CORREL coefficient against total score</span></div>
        ${renderCorrelationTable(rows)}
      </div>
      <div class="chart-panel"><div class="analytics-section-header"><h2>Strongest Relationships</h2><span class="analytics-note">Ranked by absolute correlation to score</span></div><div class="chart-wrap"><canvas id="analyticsDriversChart"></canvas></div></div>
    </div>
  `;
  const topRows = rows.slice(0, 10);
  drawBarChart("analyticsDriversChart", topRows.map((row) => row.label), topRows.map((row) => row.coeff), "Correlation");
}

function renderAnalyticsBallStriking(filteredRounds, roundMetrics) {
  const fairwayMissSeries = buildMissTrendSeries(filteredRounds, "fairway");
  const approachMissSeries = buildMissTrendSeries(filteredRounds, "approach");
  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="stats-grid">
        ${renderStatCards([
          ["FIR %", `${pct(sum(roundMetrics.map((item) => item.firCount)), sum(filteredRounds.map((round) => round.holes.filter((hole) => hole.fairway !== null).length)))}%`],
          ["GIR %", `${pct(sum(roundMetrics.map((item) => item.girCount)), sum(filteredRounds.map((round) => round.holes.filter((hole) => hole.gir !== null).length)))}%`],
          ["Approach Hit %", `${Math.round(average(roundMetrics.map((item) => item.approachHitPct)))}%`],
          ["Avg Approach Yds", average(roundMetrics.map((item) => item.avgApproachDistance)).toFixed(0)]
        ])}
      </div>
      <div class="chart-panel"><div class="analytics-section-header"><h2>Ball Striking Trends</h2><span class="analytics-note">FIR %, GIR %, and approach hit % over time</span></div><div class="chart-wrap"><canvas id="analyticsBallStrikingTrend"></canvas></div></div>
      <div class="chart-panel"><div class="analytics-section-header"><h2>Fairway Misses Over Time</h2><span class="analytics-note">Per-round miss counts by type</span></div><div class="chart-wrap"><canvas id="analyticsFairwayMissTrend"></canvas></div></div>
      <div class="chart-panel"><div class="analytics-section-header"><h2>Approach Misses Over Time</h2><span class="analytics-note">Per-round miss counts by type</span></div><div class="chart-wrap"><canvas id="analyticsApproachMissTrend"></canvas></div></div>
      <div class="panel"><div class="analytics-section-header"><h2>Fairway Miss Pattern</h2><span class="analytics-note">Where tee shots are missing</span></div>${renderMissBreakdownTable(filteredRounds, "fairway")}</div>
      <div class="panel"><div class="analytics-section-header"><h2>Approach Miss Pattern</h2><span class="analytics-note">Where approach shots are missing</span></div>${renderMissBreakdownTable(filteredRounds, "approach")}</div>
    </div>
  `;
  drawMultiLineChart("analyticsBallStrikingTrend", filteredRounds.map((round) => round.date), [
    { label: "FIR %", data: roundMetrics.map((item) => item.firPct), color: "#041d4d" },
    { label: "GIR %", data: roundMetrics.map((item) => item.girPct), color: "#63d11f" },
    { label: "Approach Hit %", data: roundMetrics.map((item) => item.approachHitPct), color: "#8aa2d3" }
  ], "%");
  drawMultiLineChart("analyticsFairwayMissTrend", filteredRounds.map((round) => round.date), fairwayMissSeries, "Misses");
  drawMultiLineChart("analyticsApproachMissTrend", filteredRounds.map((round) => round.date), approachMissSeries, "Misses");
}

function renderAnalyticsShortGame(filteredRounds, roundMetrics) {
  const chipSummary = chipTypeSummary(filteredRounds);
  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="stats-grid">
        ${renderStatCards([
          ["Scrambling %", `${Math.round(average(roundMetrics.map((item) => item.scramblePct)))}%`],
          ["Chips/Round", average(roundMetrics.map((item) => item.chipsTotal)).toFixed(1)],
          ["Bunker/Round", average(roundMetrics.map((item) => item.bunkerTotal)).toFixed(1)],
          ["Penalties/Round", average(roundMetrics.map((item) => item.penaltiesTotal)).toFixed(1)]
        ])}
      </div>
      <div class="chart-panel"><div class="analytics-section-header"><h2>Short Game Over Time</h2><span class="analytics-note">Chips, bunker shots, and penalties per round</span></div><div class="chart-wrap"><canvas id="analyticsShortGameTrend"></canvas></div></div>
      <div class="panel"><div class="analytics-section-header"><h2>Chip Type Mix</h2><span class="analytics-note">Usage and scoring context by chip type</span></div>${renderChipTypeTable(chipSummary)}</div>
      <div class="panel"><div class="analytics-section-header"><h2>Recovery on Missed GIR</h2><span class="analytics-note">How you score when the green is missed</span></div>${renderRecoveryTable(filteredRounds)}</div>
    </div>
  `;
  drawMultiLineChart("analyticsShortGameTrend", filteredRounds.map((round) => round.date), [
    { label: "Chips", data: roundMetrics.map((item) => item.chipsTotal), color: "#041d4d" },
    { label: "Bunker", data: roundMetrics.map((item) => item.bunkerTotal), color: "#63d11f" },
    { label: "Penalties", data: roundMetrics.map((item) => item.penaltiesTotal), color: "#8aa2d3" }
  ], "Count");
}

function renderAnalyticsPutting(filteredRounds, roundMetrics) {
  const puttBuckets = buildPuttBucketTable(filteredRounds);
  const puttHoles = filteredRounds.flatMap((round) => round.holes.map(normalizeHole)).filter((hole) => hole.putts !== null);
  const onePutts = puttHoles.filter((hole) => hole.putts === 1).length;
  const twoPutts = puttHoles.filter((hole) => hole.putts === 2).length;
  const threePutts = puttHoles.filter((hole) => hole.putts >= 3).length;
  const firstPuttDistance = average(filteredRounds.flatMap((round) => round.holes.map((hole) => hole.puttDistances?.[0])));
  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="stats-grid">
        ${renderStatCards([
          ["Avg Putts", average(roundMetrics.map((item) => item.puttsTotal)).toFixed(1)],
          ["Total Putts", sum(roundMetrics.map((item) => item.puttsTotal))],
          ["1-Putt %", `${pct(onePutts, puttHoles.length)}%`],
          ["2-Putt %", `${pct(twoPutts, puttHoles.length)}%`],
          ["3-Putt %", `${pct(threePutts, puttHoles.length)}%`],
          ["Avg 1st Putt Ft", firstPuttDistance.toFixed(1)]
        ])}
      </div>
      <div class="chart-panel"><div class="analytics-section-header"><h2>Putting Trends</h2><span class="analytics-note">Total putts and distance split over time</span></div><div class="chart-wrap"><canvas id="analyticsPuttingTrend"></canvas></div></div>
      <div class="panel"><div class="analytics-section-header"><h2>First-Putt Distance Buckets</h2><span class="analytics-note">Expected putts by opening putt distance</span></div>${renderPuttBucketTable(puttBuckets)}</div>
    </div>
  `;
  drawMultiLineChart("analyticsPuttingTrend", filteredRounds.map((round) => round.date), [
    { label: "Total Putts", data: roundMetrics.map((item) => item.puttsTotal), color: "#041d4d" },
    { label: "Putts > 6ft", data: roundMetrics.map((item) => item.puttsOver6), color: "#63d11f" },
    { label: "Putts <= 6ft", data: roundMetrics.map((item) => item.puttsUnder6), color: "#8aa2d3" }
  ], "Count");
}

function renderAnalyticsTrends(filteredRounds, roundMetrics) {
  const rollingScore = rollingAverage(roundMetrics.map((item) => item.score), 3);
  const rollingGir = rollingAverage(roundMetrics.map((item) => item.girPct), 5);
  const rollingFir = rollingAverage(roundMetrics.map((item) => item.firPct), 5);
  const rollingPutts = rollingAverage(roundMetrics.map((item) => item.puttsTotal), 5);
  const recentDelta = compareRecentVsPrevious(roundMetrics);
  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="stats-grid">
        ${renderStatCards([
          ["Score Δ", recentDelta.score],
          ["GIR Δ", recentDelta.girPct],
          ["FIR Δ", recentDelta.firPct],
          ["Putts Δ", recentDelta.putts],
          ["Penalties Δ", recentDelta.penalties],
          ["Scramble Δ", recentDelta.scramble]
        ])}
      </div>
      <div class="chart-panel"><div class="analytics-section-header"><h2>Rolling Score Trend</h2><span class="analytics-note">3-round rolling average</span></div><div class="chart-wrap"><canvas id="analyticsTrendScore"></canvas></div></div>
      <div class="chart-panel"><div class="analytics-section-header"><h2>Rolling Skill Trends</h2><span class="analytics-note">5-round rolling GIR, FIR, and putts</span></div><div class="chart-wrap"><canvas id="analyticsTrendSkills"></canvas></div></div>
    </div>
  `;
  drawMultiLineChart("analyticsTrendScore", filteredRounds.map((round) => round.date), [
    { label: "Score", data: rollingScore, color: "#041d4d" }
  ], "Score");
  drawMultiLineChart("analyticsTrendSkills", filteredRounds.map((round) => round.date), [
    { label: "GIR %", data: rollingGir, color: "#63d11f" },
    { label: "FIR %", data: rollingFir, color: "#041d4d" },
    { label: "Putts", data: rollingPutts, color: "#8aa2d3" }
  ], "Rolling");
}

function renderAnalyticsComparisons(filteredRounds, roundMetrics) {
  const compared = buildBestWorstComparison(filteredRounds);
  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="panel"><div class="analytics-section-header"><h2>Best vs Worst Rounds</h2><span class="analytics-note">What separated the low scores from the high scores</span></div>${renderComparisonTable(compared)}</div>
      <div class="chart-panel"><div class="analytics-section-header"><h2>Best vs Worst Snapshot</h2><span class="analytics-note">Average metrics across both groups</span></div><div class="chart-wrap"><canvas id="analyticsComparisonChart"></canvas></div></div>
    </div>
  `;
  drawGroupedBarChart("analyticsComparisonChart", ["Score", "GIR %", "FIR %", "Putts", "Penalties", "Chips"], [
    { label: "Best 5", data: [compared.best.score, compared.best.girPct, compared.best.firPct, compared.best.putts, compared.best.penalties, compared.best.chips], color: "#63d11f" },
    { label: "Worst 5", data: [compared.worst.score, compared.worst.girPct, compared.worst.firPct, compared.worst.putts, compared.worst.penalties, compared.worst.chips], color: "#041d4d" }
  ]);
}

function renderRounds() {
  if (!rounds.length) {
    el.roundList.innerHTML = `<div class="panel"><p>No completed rounds yet.</p></div>`;
    el.roundListSection.classList.remove("hidden");
    el.roundDetailSection.classList.add("hidden");
    el.roundStatsSection.classList.add("hidden");
    return;
  }
  el.roundListSection.classList.remove("hidden");
  el.roundDetailSection.classList.add("hidden");
  el.roundStatsSection.classList.add("hidden");
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
          <button class="secondary-action" type="button" data-view-round-stats="${round.id}">View stats</button>
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
  document.querySelectorAll("[data-view-round-stats]").forEach((button) => button.addEventListener("click", () => openRoundStats(button.dataset.viewRoundStats)));
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
  el.roundStatsSection.classList.add("hidden");
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
  el.roundStatsSection.classList.add("hidden");
  el.roundListSection.classList.remove("hidden");
  renderRounds();
}

function openRoundStats(roundId) {
  const round = rounds.find((item) => item.id === roundId);
  if (!round) return;
  const stats = calculateRoundStats(round);
  selectedRoundId = roundId;
  openRoundCardMenuId = null;
  el.roundListSection.classList.add("hidden");
  el.roundDetailSection.classList.add("hidden");
  el.roundStatsSection.classList.remove("hidden");
  el.roundStatsTitle.textContent = `${round.course} Stats`;
  el.roundStatsMeta.textContent = round.date;
  el.roundStatsGross.textContent = totalScore(round);
  el.roundStatsRelative.textContent = formatRelative(totalScore(round), totalPar(round));
  el.roundStatsGrid.innerHTML = [
    ["GIR %", `${stats.girPct}%`],
    ["Fairway %", `${stats.fairwayPct}%`],
    ["Avg putts", stats.avgPutts],
    ["Total putts", stats.totalPutts],
    ["Avg Par 3", stats.avgPar3],
    ["Avg Par 4", stats.avgPar4],
    ["Avg Par 5", stats.avgPar5],
    ["3-putts", stats.threePutts],
    ["Penalties", stats.penaltiesTotal],
    ["Scrambling", `${stats.scramblePct}%`]
  ]
    .map(([label, value]) => `<div class="stat-card"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
  el.roundStatsTableBody.innerHTML = round.holes
    .map((hole) => `
      <tr>
        <td>${hole.hole}</td>
        <td>${displayHoleScore(hole)}</td>
        <td>${formatFairwayCell(hole)}</td>
        <td>${formatApproachCell(hole)}</td>
        <td>${formatGirCell(hole)}</td>
        <td>${displayCellValue(hole.putts)}</td>
        <td>${countPuttsByDistance(hole, "over")}</td>
        <td>${countPuttsByDistance(hole, "under")}</td>
        <td>${displayCellValue(hole.chips)}</td>
        <td>${displayCellValue(hole.greensideBunker)}</td>
        <td>${displayCellValue(hole.penaltyStrokes)}</td>
      </tr>
    `)
    .join("");
}

function closeRoundStats() {
  selectedRoundId = null;
  el.roundStatsSection.classList.add("hidden");
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

function drawMultiLineChart(id, labels, datasets, yLabel) {
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart(document.getElementById(id), {
    type: "line",
    data: {
      labels,
      datasets: datasets.map((dataset) => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: dataset.color,
        backgroundColor: dataset.color,
        tension: 0.25,
        spanGaps: true
      }))
    },
    options: {
      ...chartOptions(),
      scales: {
        x: axisOptions(""),
        y: axisOptions(yLabel)
      }
    }
  });
}

function drawBarChart(id, labels, data, label) {
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart(document.getElementById(id), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: data.map((value) => (value >= 0 ? "#041d4d" : "#63d11f"))
      }]
    },
    options: chartOptions()
  });
}

function drawGroupedBarChart(id, labels, datasets) {
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart(document.getElementById(id), {
    type: "bar",
    data: {
      labels,
      datasets: datasets.map((dataset) => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: dataset.color
      }))
    },
    options: chartOptions()
  });
}

function renderStatCards(items) {
  return items.map(([label, value]) => `<div class="stat-card"><span>${label}</span><strong>${value}</strong></div>`).join("");
}

function filterLabel() {
  return el.analyticsRangeSelect.options[el.analyticsRangeSelect.selectedIndex]?.text || "";
}

function sum(values) {
  return values.reduce((total, value) => total + (Number.isFinite(value) ? value : 0), 0);
}

function countHolePuttsByDistance(hole, direction) {
  if (!Array.isArray(hole.puttDistances)) return 0;
  return hole.puttDistances.filter((distance) => typeof distance === "number" && (direction === "over" ? distance > 6 : distance <= 6)).length;
}

function buildCorrelationRows(roundMetrics) {
  const metrics = [
    ["GIR %", "girPct"],
    ["FIR %", "firPct"],
    ["Approach hit %", "approachHitPct"],
    ["Avg approach yds", "avgApproachDistance"],
    ["Total putts", "puttsTotal"],
    ["3-putts", "threePutts"],
    ["Putts > 6ft", "puttsOver6"],
    ["Putts <= 6ft", "puttsUnder6"],
    ["Chips", "chipsTotal"],
    ["Bunker shots", "bunkerTotal"],
    ["Penalty strokes", "penaltiesTotal"],
    ["Scrambling %", "scramblePct"],
    ["Regular chips", "chipRegular"],
    ["Bump and run", "chipBumpRun"],
    ["Flop chips", "chipFlop"],
    ["High obstacle chips", "chipHighObstacle"],
    ["Rough chips", "chipRough"],
    ["Bank chips", "chipBank"],
    ["Putter chips", "chipPutter"]
  ];
  return metrics
    .map(([label, key]) => {
      const coeff = correl(
        roundMetrics.map((item) => item[key]),
        roundMetrics.map((item) => item.score)
      );
      const sample = pairSampleCount(roundMetrics.map((item) => item[key]), roundMetrics.map((item) => item.score));
      return {
        label,
        key,
        coeff,
        sample,
        direction: coeff < 0 ? "Higher tends to lower score" : coeff > 0 ? "Lower tends to lower score" : "No clear relationship",
        strength: correlationStrength(coeff)
      };
    })
    .filter((row) => row.sample >= 3)
    .sort((a, b) => Math.abs(b.coeff) - Math.abs(a.coeff));
}

function renderCorrelationTable(rows) {
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Metric</th><th>Coeff</th><th>Sample</th><th>Read</th><th>Direction</th></tr></thead>
        <tbody>
          ${rows.map((row) => `<tr><td>${row.label}</td><td>${row.coeff.toFixed(3)}</td><td>${row.sample}</td><td>${row.strength}</td><td>${row.direction}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderApproachBucketTable(sourceRounds) {
  const holes = sourceRounds.flatMap((round) => round.holes.map(normalizeHole));
  const rows = APPROACH_BUCKETS.map((bucket) => {
    const bucketHoles = holes.filter((hole) => inBucket(hole.approachDistance, bucket) && hole.approachHit !== null);
    return {
      label: bucket.label,
      attempts: bucketHoles.length,
      hitPct: pct(bucketHoles.filter((hole) => hole.approachHit).length, bucketHoles.length),
      avgScore: average(bucketHoles.map((hole) => hole.score)).toFixed(1)
    };
  });
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Bucket</th><th>Attempts</th><th>Hit %</th><th>Avg Score</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${row.label}</td><td>${row.attempts}</td><td>${row.hitPct}%</td><td>${row.avgScore}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function renderMissBreakdownTable(sourceRounds, field) {
  const missKeys = ["hook", "left", "right", "slice", "top", "heavy", "short", "long"];
  const holes = sourceRounds.flatMap((round) => round.holes.map(normalizeHole));
  const rows = missKeys.map((key) => {
    const count = holes.filter((hole) => (field === "fairway" ? hole.fairwayMiss : hole.approachMiss) === key).length;
    return { key, count };
  });
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Miss</th><th>Count</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${formatMissLabel(row.key)}</td><td>${row.count}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function buildMissTrendSeries(sourceRounds, field) {
  const missKeys = ["hook", "left", "right", "slice", "top", "heavy", "short", "long"];
  const colors = {
    hook: "#041d4d",
    left: "#38598b",
    right: "#63d11f",
    slice: "#89df57",
    top: "#8aa2d3",
    heavy: "#d48f3f",
    short: "#cc5a71",
    long: "#6e6e8f"
  };
  return missKeys.map((key) => ({
    label: formatMissLabel(key),
    data: sourceRounds.map((round) =>
      round.holes.map(normalizeHole).filter((hole) => (field === "fairway" ? hole.fairwayMiss : hole.approachMiss) === key).length
    ),
    color: colors[key]
  }));
}

function chipTypeSummary(sourceRounds) {
  const chipTypes = [
    ["regular", "Regular"],
    ["bumpRun", "Bump and run"],
    ["flop", "Flop"],
    ["highObstacle", "High over obstacle"],
    ["rough", "Out of rough"],
    ["bank", "Into a bank"],
    ["putter", "Putter"]
  ];
  const holes = sourceRounds.flatMap((round) => round.holes.map(normalizeHole));
  return chipTypes.map(([key, label]) => {
    const matchingHoles = holes.filter((hole) => (hole.chipTypes || []).includes(key));
    return {
      label,
      count: matchingHoles.reduce((sum, hole) => sum + hole.chipTypes.filter((type) => type === key).length, 0),
      avgScore: average(matchingHoles.map((hole) => hole.score)).toFixed(1)
    };
  });
}

function renderChipTypeTable(rows) {
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Chip Type</th><th>Count</th><th>Avg Score on Hole</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${row.label}</td><td>${row.count}</td><td>${row.avgScore}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function renderRecoveryTable(sourceRounds) {
  const holes = sourceRounds.flatMap((round) => round.holes.map(normalizeHole)).filter((hole) => hole.gir === false);
  const scramble = holes.filter((hole) => hole.score !== null && hole.score <= hole.par).length;
  const avgChips = average(holes.map((hole) => hole.chips)).toFixed(1);
  const avgBunker = average(holes.map((hole) => hole.greensideBunker)).toFixed(1);
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Metric</th><th>Value</th></tr></thead>
        <tbody>
          <tr><td>Missed GIR holes</td><td>${holes.length}</td></tr>
          <tr><td>Scramble %</td><td>${pct(scramble, holes.length)}%</td></tr>
          <tr><td>Avg score after missed GIR</td><td>${average(holes.map((hole) => hole.score)).toFixed(1)}</td></tr>
          <tr><td>Avg chips after missed GIR</td><td>${avgChips}</td></tr>
          <tr><td>Avg bunker shots after missed GIR</td><td>${avgBunker}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function buildPuttBucketTable(sourceRounds) {
  const holes = sourceRounds.flatMap((round) => round.holes.map(normalizeHole));
  return PUTT_BUCKETS.map((bucket) => {
    const bucketHoles = holes.filter((hole) => inBucket(hole.puttDistances?.[0], bucket) && hole.putts !== null);
    return {
      label: bucket.label,
      holes: bucketHoles.length,
      avgPutts: average(bucketHoles.map((hole) => hole.putts)).toFixed(1),
      twoPuttPct: pct(bucketHoles.filter((hole) => hole.putts <= 2).length, bucketHoles.length),
      threePuttPct: pct(bucketHoles.filter((hole) => hole.putts >= 3).length, bucketHoles.length)
    };
  });
}

function renderPuttBucketTable(rows) {
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>1st Putt Distance</th><th>Holes</th><th>Avg Putts</th><th>2-Putt %</th><th>3-Putt %</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${row.label}</td><td>${row.holes}</td><td>${row.avgPutts}</td><td>${row.twoPuttPct}%</td><td>${row.threePuttPct}%</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function rollingAverage(values, windowSize) {
  return values.map((_, index) => average(values.slice(Math.max(0, index - windowSize + 1), index + 1)));
}

function compareRecentVsPrevious(roundMetrics) {
  const recent = roundMetrics.slice(-5);
  const previous = roundMetrics.slice(-10, -5);
  return {
    score: deltaText(average(recent.map((item) => item.score)), average(previous.map((item) => item.score)), true),
    girPct: deltaText(average(recent.map((item) => item.girPct)), average(previous.map((item) => item.girPct))),
    firPct: deltaText(average(recent.map((item) => item.firPct)), average(previous.map((item) => item.firPct))),
    putts: deltaText(average(recent.map((item) => item.puttsTotal)), average(previous.map((item) => item.puttsTotal)), true),
    penalties: deltaText(average(recent.map((item) => item.penaltiesTotal)), average(previous.map((item) => item.penaltiesTotal)), true),
    scramble: deltaText(average(recent.map((item) => item.scramblePct)), average(previous.map((item) => item.scramblePct)))
  };
}

function buildBestWorstComparison(sourceRounds) {
  const sorted = sourceRounds.slice().sort((a, b) => totalScore(a) - totalScore(b));
  const bestRounds = sorted.slice(0, Math.min(5, sorted.length));
  const worstRounds = sorted.slice(-Math.min(5, sorted.length));
  return { best: summarizeComparisonGroup(bestRounds), worst: summarizeComparisonGroup(worstRounds) };
}

function summarizeComparisonGroup(group) {
  const metrics = group.map(buildRoundMetrics);
  return {
    score: average(metrics.map((item) => item.score)).toFixed(1),
    girPct: Math.round(average(metrics.map((item) => item.girPct))),
    firPct: Math.round(average(metrics.map((item) => item.firPct))),
    putts: average(metrics.map((item) => item.puttsTotal)).toFixed(1),
    penalties: average(metrics.map((item) => item.penaltiesTotal)).toFixed(1),
    chips: average(metrics.map((item) => item.chipsTotal)).toFixed(1),
    bunker: average(metrics.map((item) => item.bunkerTotal)).toFixed(1),
    scramblePct: Math.round(average(metrics.map((item) => item.scramblePct)))
  };
}

function renderComparisonTable(compared) {
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Metric</th><th>Best 5</th><th>Worst 5</th></tr></thead>
        <tbody>
          ${[
            ["Score", compared.best.score, compared.worst.score],
            ["GIR %", `${compared.best.girPct}%`, `${compared.worst.girPct}%`],
            ["FIR %", `${compared.best.firPct}%`, `${compared.worst.firPct}%`],
            ["Putts", compared.best.putts, compared.worst.putts],
            ["Penalties", compared.best.penalties, compared.worst.penalties],
            ["Chips", compared.best.chips, compared.worst.chips],
            ["Bunker", compared.best.bunker, compared.worst.bunker],
            ["Scrambling %", `${compared.best.scramblePct}%`, `${compared.worst.scramblePct}%`]
          ].map((row) => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function correl(xs, ys) {
  const pairs = xs.map((x, index) => [x, ys[index]]).filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
  if (pairs.length < 2) return 0;
  const xVals = pairs.map(([x]) => x);
  const yVals = pairs.map(([, y]) => y);
  const xMean = average(xVals);
  const yMean = average(yVals);
  const numerator = pairs.reduce((sum, [x, y]) => sum + ((x - xMean) * (y - yMean)), 0);
  const xDenominator = Math.sqrt(xVals.reduce((sum, x) => sum + ((x - xMean) ** 2), 0));
  const yDenominator = Math.sqrt(yVals.reduce((sum, y) => sum + ((y - yMean) ** 2), 0));
  const denominator = xDenominator * yDenominator;
  return denominator ? numerator / denominator : 0;
}

function pairSampleCount(xs, ys) {
  return xs.map((x, index) => [x, ys[index]]).filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y)).length;
}

function correlationStrength(coeff) {
  const value = Math.abs(coeff);
  if (value >= 0.7) return "Strong";
  if (value >= 0.4) return "Moderate";
  if (value >= 0.2) return "Light";
  return "Weak";
}

function deltaText(current, previous, lowerIsBetter = false) {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0 && current === 0) return "—";
  const delta = current - previous;
  const prefix = delta > 0 ? "+" : "";
  const value = `${prefix}${delta.toFixed(1)}`;
  return lowerIsBetter ? value : `${value}%`;
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
  el.resumeRoundBtn.classList.toggle("hidden", !activeRound || Boolean(editingCompletedRoundId));
}

function persistActiveRound() {
  if (editingCompletedRoundId) {
    const updatedRound = normalizeRound({ ...activeRound, id: editingCompletedRoundId });
    delete updatedRound.currentHoleIndex;
    rounds = rounds.map((round) => (round.id === editingCompletedRoundId ? updatedRound : round));
    saveRounds();
    localStorage.removeItem(STORAGE_KEYS.activeRound);
    updateResumeButton();
    renderDashboard();
    renderAnalytics();
    renderRounds();
    return;
  }
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

function displayCellValue(value) {
  return value === null || value === undefined || value === "" ? "—" : String(value);
}

function formatFairwayCell(hole) {
  if (hole.par === 3 || hole.fairway === null) return "—";
  return hole.fairway ? "Hit" : formatMissLabel(hole.fairwayMiss);
}

function formatApproachCell(hole) {
  if (hole.approachHit === null) return "—";
  return hole.approachHit ? "Hit" : formatMissLabel(hole.approachMiss);
}

function formatGirCell(hole) {
  if (hole.gir === null) return "—";
  return hole.gir ? "✓" : "✗";
}

function countPuttsByDistance(hole, direction) {
  if (hole.putts === null || !Array.isArray(hole.puttDistances) || !hole.puttDistances.length) return "—";
  const count = hole.puttDistances.filter((distance) => typeof distance === "number" && (direction === "over" ? distance > 6 : distance <= 6)).length;
  return String(count);
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

function calculateRoundStats(round) {
  const holes = round.holes.map(normalizeHole);
  const fairwayHoles = holes.filter((hole) => hole.fairway !== null);
  const girHoles = holes.filter((hole) => hole.gir !== null);
  const puttHoles = holes.filter((hole) => hole.putts !== null);
  const totalPutts = puttHoles.reduce((sum, hole) => sum + hole.putts, 0);
  const par3Scores = holes.filter((hole) => hole.par === 3 && hole.score !== null).map((hole) => hole.score);
  const par4Scores = holes.filter((hole) => hole.par === 4 && hole.score !== null).map((hole) => hole.score);
  const par5Scores = holes.filter((hole) => hole.par === 5 && hole.score !== null).map((hole) => hole.score);
  const missedGir = holes.filter((hole) => hole.gir === false);
  const scrambleMade = missedGir.filter((hole) => hole.score !== null && hole.score <= hole.par).length;
  return {
    girPct: pct(girHoles.filter((hole) => hole.gir).length, girHoles.length),
    fairwayPct: pct(fairwayHoles.filter((hole) => hole.fairway).length, fairwayHoles.length),
    avgPutts: average(puttHoles.map((hole) => hole.putts)).toFixed(1),
    totalPutts,
    avgPar3: average(par3Scores).toFixed(1),
    avgPar4: average(par4Scores).toFixed(1),
    avgPar5: average(par5Scores).toFixed(1),
    threePutts: puttHoles.filter((hole) => hole.putts >= 3).length,
    penaltiesTotal: holes.reduce((sum, hole) => sum + (hole.penaltyStrokes || 0), 0),
    scramblePct: pct(scrambleMade, missedGir.length)
  };
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
