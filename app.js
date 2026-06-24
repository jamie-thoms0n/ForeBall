const STORAGE_KEYS = {
  rounds: "foreball.rounds.v1",
  roundsBackup: "foreball.rounds.backup.v1",
  activeRound: "foreball.activeRound.v1",
  profile: "foreball.profile.v1",
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
    name: "North Berwick Children's Course",
    pars: [3, 3, 3, 3, 3, 3, 3, 3, 3],
    strokeIndexes: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    lengths: [null, null, null, null, null, null, null, null, null]
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

const ROUND_FORMATS = {
  "18": { label: "18 holes", start: 0, end: 18 },
  course9: { label: "9 holes", start: 0, end: 9 },
  front9: { label: "Front 9", start: 0, end: 9 },
  back9: { label: "Back 9", start: 9, end: 18 }
};

const HANDICAP_PCC = 0;
const DEFAULT_SLOPE_RATING = 113;
const HANDICAP_ALLOWANCES = [
  { min: 20, count: 8, adjustment: 0 },
  { min: 19, count: 7, adjustment: 0 },
  { min: 17, count: 6, adjustment: 0 },
  { min: 15, count: 5, adjustment: 0 },
  { min: 12, count: 4, adjustment: 0 },
  { min: 9, count: 3, adjustment: 0 },
  { min: 7, count: 2, adjustment: 0 },
  { min: 6, count: 2, adjustment: -1 },
  { min: 5, count: 1, adjustment: 0 },
  { min: 4, count: 1, adjustment: -1 },
  { min: 3, count: 1, adjustment: -2 }
];

const SCRATCH_STROKES_LOST_BASELINE = {
  penaltyStrokesPerRound: 0.5,
  threePuttsPerRound: 0.4,
  missedGirPerRound: 8,
  greensideBunkersPerRound: 0.8,
  teeMissesRightPerRound: 1.5,
  missedGirCost: 0.35,
  greensideBunkerCost: 0.5,
  teeMissRightCost: 0.3
};

const EMPTY_ROUND_CONTEXT = {
  weather: "",
  windSpeed: null,
  windDirection: "",
  food: [],
  notes: ""
};

const DEFAULT_PROFILE = {
  name: "",
  currentHandicap: null,
  handicapGoal: null,
  handicapGoalDate: "",
  handicapGoals: [],
  bag: [],
  wedges: [],
  photo: ""
};

const CLUB_GROUPS = [
  { label: "Driver", clubs: ["Driver"] },
  { label: "Woods", clubs: ["2 Wood", "3 Wood", "4 Wood", "5 Wood", "7 Wood", "9 Wood"] },
  { label: "Hybrids", clubs: ["2 Hybrid", "3 Hybrid", "4 Hybrid", "5 Hybrid", "6 Hybrid"] },
  { label: "Irons", clubs: ["2 Iron", "3 Iron", "4 Iron", "5 Iron", "6 Iron", "7 Iron", "8 Iron", "9 Iron"] },
  { label: "Putter", clubs: ["Putter"] }
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
    left: [
      { value: "overDraw", label: "Over draw" },
      { value: "pull", label: "Pull" },
      { value: "hook", label: "Hook" },
      { value: "leftOther", label: "Other" }
    ],
    right: [
      { value: "push", label: "Push" },
      { value: "overFade", label: "Over fade" },
      { value: "slice", label: "Slice" },
      { value: "rightOther", label: "Other" }
    ],
    short: [
      { value: "bigHeavy", label: "Big heavy" },
      { value: "smallHeavy", label: "Small heavy" },
      { value: "shortOther", label: "Other" }
    ]
  },
  approach: {
    left: [
      { value: "overDraw", label: "Over draw" },
      { value: "pull", label: "Pull" },
      { value: "hook", label: "Hook" },
      { value: "leftOther", label: "Other" }
    ],
    right: [
      { value: "push", label: "Push" },
      { value: "overFade", label: "Over fade" },
      { value: "slice", label: "Slice" },
      { value: "rightOther", label: "Other" }
    ],
    short: [
      { value: "bigHeavy", label: "Big heavy" },
      { value: "smallHeavy", label: "Small heavy" },
      { value: "shortOther", label: "Other" }
    ]
  }
};

let activeRound = loadActiveRound();
let rounds = loadRounds();
let profile = loadProfile();
let currentHoleIndex = activeRound?.currentHoleIndex || 0;
let charts = {};
let pendingConfirmAction = null;
let openRoundCardMenuId = null;
let selectedRoundId = null;
let editingCompletedRoundId = null;
let analyticsRange = "lastX";
let analyticsRoundCount = 20;
let analyticsSection = "performanceOverview";
let selectedRoundFormat = "18";
let bagEditMode = false;
let draftBag = [];
let draftWedges = [];
let profileEditMode = false;

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
  profileBtn: document.getElementById("profileBtn"),
  profilePhotoInput: document.getElementById("profilePhotoInput"),
  profilePhotoPreview: document.getElementById("profilePhotoPreview"),
  profileMenuBtn: document.getElementById("profileMenuBtn"),
  profileMenu: document.getElementById("profileMenu"),
  editProfileBtn: document.getElementById("editProfileBtn"),
  profileNameDisplay: document.getElementById("profileNameDisplay"),
  profileNameEditor: document.getElementById("profileNameEditor"),
  profileGoalEditor: document.getElementById("profileGoalEditor"),
  profileNameInput: document.getElementById("profileNameInput"),
  currentHandicapInput: document.getElementById("currentHandicapInput"),
  handicapGoalInput: document.getElementById("handicapGoalInput"),
  handicapGoalDateInput: document.getElementById("handicapGoalDateInput"),
  saveProfileGoalBtn: document.getElementById("saveProfileGoalBtn"),
  profileHandicapSummary: document.getElementById("profileHandicapSummary"),
  profileBagPanel: document.getElementById("profileBagPanel"),
  bagCount: document.getElementById("bagCount"),
  bagMenuBtn: document.getElementById("bagMenuBtn"),
  bagMenu: document.getElementById("bagMenu"),
  editBagBtn: document.getElementById("editBagBtn"),
  clubSelector: document.getElementById("clubSelector"),
  courseSelect: document.getElementById("courseSelect"),
  startPanel: document.getElementById("startPanel"),
  startRoundBtn: document.getElementById("startRoundBtn"),
  resumeRoundBtn: document.getElementById("resumeRoundBtn"),
  roundFormatButtons: Array.from(document.querySelectorAll("[data-round-format]")),
  holeForm: document.getElementById("holeForm"),
  roundContextForm: document.getElementById("roundContextForm"),
  roundContextCourse: document.getElementById("roundContextCourse"),
  weatherSelect: document.getElementById("weatherSelect"),
  windSpeedInput: document.getElementById("windSpeedInput"),
  windDirectionSelect: document.getElementById("windDirectionSelect"),
  foodEntries: document.getElementById("foodEntries"),
  addFoodBtn: document.getElementById("addFoodBtn"),
  roundNotesInput: document.getElementById("roundNotesInput"),
  roundContextBackBtn: document.getElementById("roundContextBackBtn"),
  finishRoundBtn: document.getElementById("finishRoundBtn"),
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
  topNextHoleBtn: document.getElementById("topNextHoleBtn"),
  scoreInput: document.getElementById("scoreInput"),
  scoreAsterisk: document.getElementById("scoreAsterisk"),
  pickedUpValue: document.getElementById("pickedUpValue"),
  fairwayField: document.getElementById("fairwayField"),
  fairwayFollowup: document.getElementById("fairwayFollowup"),
  teeClubSelect: document.getElementById("teeClubSelect"),
  approachDistanceInput: document.getElementById("approachDistanceInput"),
  approachClubSelect: document.getElementById("approachClubSelect"),
  approachFollowup: document.getElementById("approachFollowup"),
  puttChoiceButtons: Array.from(document.querySelectorAll(".putt-choice")),
  otherPuttsWrap: document.getElementById("otherPuttsWrap"),
  otherPuttsSelect: document.getElementById("otherPuttsSelect"),
  puttDistanceFields: document.getElementById("puttDistanceFields"),
  chipChoiceButtons: Array.from(document.querySelectorAll(".chip-choice")),
  otherChipsWrap: document.getElementById("otherChipsWrap"),
  otherChipsSelect: document.getElementById("otherChipsSelect"),
  chipTypeFields: document.getElementById("chipTypeFields"),
  fairwayBunkerField: document.getElementById("fairwayBunkerField"),
  fairwayBunkerToggleBtn: document.getElementById("fairwayBunkerToggleBtn"),
  fairwayBunkerPanel: document.getElementById("fairwayBunkerPanel"),
  fairwayBunkerChoiceButtons: Array.from(document.querySelectorAll(".fairway-bunker-choice")),
  otherFairwayBunkerWrap: document.getElementById("otherFairwayBunkerWrap"),
  otherFairwayBunkerSelect: document.getElementById("otherFairwayBunkerSelect"),
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
  analyticsRoundCountWrap: document.getElementById("analyticsRoundCountWrap"),
  analyticsRoundCountSelect: document.getElementById("analyticsRoundCountSelect"),
  analyticsSectionSelect: document.getElementById("analyticsSectionSelect"),
  analyticsContent: document.getElementById("analyticsContent"),
  roundList: document.getElementById("roundList"),
  roundListSection: document.getElementById("roundListSection"),
  roundExportCountSelect: document.getElementById("roundExportCountSelect"),
  exportRoundsBtn: document.getElementById("exportRoundsBtn"),
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
  populateAnalyticsRoundCounts();
  renderProfile();
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
  el.profileBtn.addEventListener("click", () => setView("profile"));
  el.saveProfileGoalBtn.addEventListener("click", saveProfileSummary);
  el.profilePhotoInput.addEventListener("change", handleProfilePhotoChange);
  el.profileMenuBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    el.profileMenu.classList.toggle("hidden");
  });
  el.editProfileBtn.addEventListener("click", () => {
    profileEditMode = true;
    el.profileMenu.classList.add("hidden");
    renderProfile();
  });
  el.bagMenuBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    el.bagMenu.classList.toggle("hidden");
  });
  el.editBagBtn.addEventListener("click", () => {
    bagEditMode = true;
    draftBag = [...profile.bag];
    draftWedges = profile.wedges.map((wedge) => ({ ...wedge }));
    el.bagMenu.classList.add("hidden");
    renderClubSelector();
  });
  document.querySelectorAll("[data-dashboard-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.dashboardView));
  });
  el.analyticsRangeSelect.addEventListener("change", () => {
    analyticsRange = el.analyticsRangeSelect.value;
    updateAnalyticsUi();
    renderAnalytics();
  });
  el.analyticsRoundCountSelect.addEventListener("change", () => {
    analyticsRoundCount = Number(el.analyticsRoundCountSelect.value) || 20;
    renderAnalytics();
  });
  el.analyticsSectionSelect.addEventListener("change", () => {
    analyticsSection = el.analyticsSectionSelect.value;
    renderAnalytics();
  });
  el.courseSelect.addEventListener("change", updateRoundFormatOptions);

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
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      applyShotSelection(button.dataset.field, button.dataset.value);
    });
  });
  document.querySelectorAll(".shot-wheel").forEach((wheel) => {
    wheel.addEventListener("click", handleShotWheelClick);
  });
  document.querySelectorAll(".shot-clear").forEach((button) => {
    button.addEventListener("click", () => clearShotSelection(button.dataset.field));
  });
  bindToggleableGir();

  el.roundFormatButtons.forEach((button) => {
    button.addEventListener("click", () => setRoundFormat(button.dataset.roundFormat));
  });
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
  el.addFoodBtn.addEventListener("click", () => addFoodEntry());
  el.roundContextBackBtn.addEventListener("click", returnToLastHole);
  [el.weatherSelect, el.windSpeedInput, el.windDirectionSelect, el.roundNotesInput].forEach((input) => {
    input.addEventListener("input", saveRoundContext);
    input.addEventListener("change", saveRoundContext);
  });
  el.roundContextForm.addEventListener("submit", (event) => {
    event.preventDefault();
    completeRound();
  });
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
  el.teeClubSelect.addEventListener("change", () => {
    if (!activeRound) return;
    currentHole().teeClub = el.teeClubSelect.value || null;
    persistActiveRound();
  });
  el.approachClubSelect.addEventListener("change", () => {
    if (!activeRound) return;
    currentHole().approachClub = el.approachClubSelect.value || null;
    persistActiveRound();
  });
  el.fairwayBunkerToggleBtn.addEventListener("click", toggleFairwayBunkerPanel);
  el.fairwayBunkerChoiceButtons.forEach((button) => {
    button.addEventListener("click", () => handleFairwayBunkerChoice(button.dataset.fairwayBunkerChoice));
  });
  el.otherFairwayBunkerSelect.addEventListener("change", handleOtherFairwayBunkerChange);
  el.bunkerChoiceButtons.forEach((button) => {
    button.addEventListener("click", () => handleBunkerChoice(button.dataset.bunkerChoice));
  });
  el.otherBunkerSelect.addEventListener("change", handleOtherBunkerChange);

  el.penaltyButtons.forEach((button) => {
    button.addEventListener("click", () => handlePenaltySelect(button.dataset.penaltyType));
  });
  el.otherPenaltySelect.addEventListener("change", handleOtherPenaltyChange);

  el.roundDetailBackBtn.addEventListener("click", closeRoundDetail);
  el.exportRoundsBtn.addEventListener("click", exportSelectedRounds);
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
  updateRoundFormatOptions();
}

function populateAnalyticsRoundCounts() {
  el.analyticsRoundCountSelect.innerHTML = Array.from({ length: 100 }, (_, index) => {
    const count = index + 1;
    return `<option value="${count}" ${count === analyticsRoundCount ? "selected" : ""}>${count}</option>`;
  }).join("");
}

function renderProfile() {
  if (!profile.name && profile.currentHandicap === null && profile.handicapGoal === null) profileEditMode = true;
  el.profileNameInput.value = profile.name || "";
  el.currentHandicapInput.value = profile.currentHandicap ?? "";
  el.handicapGoalInput.value = profile.handicapGoal ?? "";
  el.handicapGoalDateInput.value = profile.handicapGoalDate || "";
  renderProfileName();
  renderProfilePhoto();
  renderProfileSummary();
  renderClubSelector();
}

function saveProfileSummary() {
  const name = el.profileNameInput.value.trim() || profile.name;
  const currentHandicap = numberOrNull(el.currentHandicapInput.value);
  const handicapGoal = numberOrNull(el.handicapGoalInput.value);
  profile.name = name;
  profile.currentHandicap = currentHandicap;
  profile.handicapGoal = handicapGoal;
  profile.handicapGoalDate = el.handicapGoalDateInput.value;
  profile.handicapGoals = [
    {
      date: new Date().toISOString().slice(0, 10),
      currentHandicap,
      handicapGoal,
      handicapGoalDate: profile.handicapGoalDate
    },
    ...profile.handicapGoals
  ].slice(0, 25);
  profileEditMode = false;
  saveProfile();
  renderProfile();
}

function renderProfileName() {
  el.profileNameDisplay.textContent = profile.name || "";
  el.profileNameDisplay.classList.toggle("hidden", !profile.name || profileEditMode);
  el.profileNameEditor.classList.toggle("hidden", !profileEditMode);
  el.profileGoalEditor.classList.toggle("hidden", !profileEditMode);
}

function renderProfileSummary() {
  const current = displayCellValue(profile.currentHandicap);
  const goal = displayCellValue(profile.handicapGoal);
  const date = profile.handicapGoalDate ? `, by ${profile.handicapGoalDate}` : "";
  el.profileHandicapSummary.textContent = `My current handicap is: ${current} and my goal is ${goal}${date}.`;
}

function renderProfilePhoto() {
  el.profilePhotoPreview.style.backgroundImage = profile.photo ? `url("${profile.photo}")` : "";
  el.profilePhotoPreview.classList.toggle("has-photo", Boolean(profile.photo));
}

function handleProfilePhotoChange() {
  const file = el.profilePhotoInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    profile.photo = String(reader.result || "");
    saveProfile();
    renderProfilePhoto();
  });
  reader.readAsDataURL(file);
}

function renderClubSelector() {
  if (!bagEditMode) {
    renderSavedBagView();
    renderBagCount();
    return;
  }
  const selectedBag = new Set(draftBag);
  const standardGroups = CLUB_GROUPS.map((group) => `
    <fieldset class="club-group">
      <legend>${group.label}</legend>
      <div class="club-grid">
        ${group.clubs.map((club) => `
          <label class="club-chip">
            <input type="checkbox" value="${escapeAttr(club)}" ${selectedBag.has(club) ? "checked" : ""}>
            <span>${club}</span>
          </label>
        `).join("")}
      </div>
    </fieldset>
  `).join("");
  const putterIndex = standardGroups.lastIndexOf("<fieldset");
  el.clubSelector.innerHTML = `
    <button class="primary-action" type="button" data-save-bag>Save bag</button>
    ${standardGroups.slice(0, putterIndex)}
    ${renderWedgeSelector()}
    ${standardGroups.slice(putterIndex)}
    <button class="primary-action" type="button" data-save-bag>Save bag</button>
  `;
  el.clubSelector.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.addEventListener("change", () => {
      const selected = new Set(draftBag);
      if (input.checked) selected.add(input.value);
      else selected.delete(input.value);
      draftBag = Array.from(selected);
      renderBagCount();
    });
  });
  el.clubSelector.querySelectorAll("[data-remove-wedge]").forEach((button) => {
    button.addEventListener("click", () => {
      draftWedges = draftWedges.filter((wedge) => wedge.id !== button.dataset.removeWedge);
      renderClubSelector();
    });
  });
  el.clubSelector.querySelectorAll("[data-save-bag]").forEach((button) => button.addEventListener("click", saveBagSelection));
  const addWedgeBtn = document.getElementById("addWedgeBtn");
  addWedgeBtn.addEventListener("click", addWedgeFromInputs);
  renderBagCount();
}

function renderSavedBagView() {
  const clubs = allSelectedClubsForDisplay();
  el.clubSelector.innerHTML = clubs.length
    ? `<div class="saved-bag-list">${clubs.map((club) => `<div class="saved-bag-item">${escapeHtml(club)}</div>`).join("")}</div>`
    : `<p class="analytics-note">No clubs saved yet. Use the menu to update your bag.</p>`;
}

function renderWedgeSelector() {
  return `
    <fieldset class="club-group">
      <legend>Wedges</legend>
      <div class="wedge-entry-row">
        <input id="wedgeNameInput" type="text" placeholder="Pitching">
        <input id="wedgeLoftInput" type="number" inputmode="numeric" min="1" max="90" placeholder="43">
        <button class="secondary-action" type="button" id="addWedgeBtn">Add wedge</button>
      </div>
      <div class="club-grid wedge-list">
        ${draftWedges.map((wedge) => `
          <div class="club-chip wedge-chip">
            <span>${escapeHtml(formatWedgeLabel(wedge))}</span>
            <button class="wedge-remove-button" type="button" data-remove-wedge="${wedge.id}" aria-label="Remove ${escapeAttr(formatWedgeLabel(wedge))}">X</button>
          </div>
        `).join("")}
      </div>
    </fieldset>
  `;
}

function addWedgeFromInputs() {
  const nameInput = document.getElementById("wedgeNameInput");
  const loftInput = document.getElementById("wedgeLoftInput");
  const name = nameInput.value.trim();
  const loft = numberOrNull(loftInput.value);
  if (!name && loft === null) return;
  draftWedges = [
    ...draftWedges,
    { id: `wedge_${Date.now()}`, name, loft }
  ];
  renderClubSelector();
}

function saveBagSelection() {
  profile.bag = [...draftBag];
  profile.wedges = draftWedges.map((wedge) => ({ ...wedge }));
  bagEditMode = false;
  saveProfile();
  renderClubSelector();
}

function formatWedgeLabel(wedge) {
  const name = wedge.name?.trim();
  const loft = numberOrNull(wedge.loft);
  if (name && loft !== null) return `${name} - ${loft}`;
  if (name) return name;
  return `${loft}degree`;
}

function renderBagCount() {
  const count = (bagEditMode ? draftBag.length + draftWedges.length : profile.bag.length + profile.wedges.length);
  el.bagCount.textContent = `${count}/14`;
  el.bagCount.classList.toggle("is-good", count === 14);
  el.bagCount.classList.toggle("is-over", count > 14);
}

function allSelectedClubsForDisplay() {
  const wedges = profile.wedges.map(formatWedgeLabel);
  const clubs = [];
  CLUB_GROUPS.forEach((group) => {
    if (group.label === "Putter") clubs.push(...wedges);
    clubs.push(...group.clubs.filter((club) => profile.bag.includes(club)));
  });
  return clubs;
}

function clubBuckets() {
  const standard = profile.bag.filter((club) => club !== "Putter");
  const wedges = profile.wedges.map(formatWedgeLabel);
  return {
    driverWoodsHybrids: standard.filter((club) => club === "Driver" || club.includes("Wood") || club.includes("Hybrid")),
    woodsHybridsDriver: standard.filter((club) => club === "Driver" || club.includes("Wood") || club.includes("Hybrid")),
    woodsHybrids: standard.filter((club) => club.includes("Wood") || club.includes("Hybrid")),
    irons: standard.filter((club) => club.includes("Iron")),
    wedges
  };
}

function selectableTeeClubsForHole(hole) {
  const { driverWoodsHybrids, irons, wedges } = clubBuckets();
  if (hole.par === 3) return [...sortIronsAscending(irons), ...sortWedgesByLoft(wedges), ...sortLongClubs(driverWoodsHybrids)];
  return [...sortLongClubs(driverWoodsHybrids), ...sortIronsAscending(irons), ...sortWedgesByLoft(wedges)];
}

function renderTeeClubSelect(hole) {
  const clubs = selectableTeeClubsForHole(hole);
  el.teeClubSelect.innerHTML = [`<option value="">Select club</option>`, ...clubs.map((club) => `<option value="${escapeAttr(club)}">${escapeHtml(club)}</option>`)].join("");
  el.teeClubSelect.value = clubs.includes(hole.teeClub) ? hole.teeClub : "";
}

function selectableApproachClubsForHole(hole) {
  const { driverWoodsHybrids, woodsHybrids, irons, wedges } = clubBuckets();
  if (hole.par === 3) return [...sortIronsAscending(irons), ...sortWedgesByLoft(wedges), ...sortLongClubs(driverWoodsHybrids)];
  if (hole.par === 4) return [...sortWedgesByLoft(wedges), ...sortIronsDescending(irons)];
  return [...sortLongClubs(woodsHybrids), ...sortIronsAscending(irons), ...sortWedgesByLoft(wedges)];
}

function renderApproachClubSelect(hole) {
  const clubs = selectableApproachClubsForHole(hole);
  el.approachClubSelect.innerHTML = [`<option value="">Select club</option>`, ...clubs.map((club) => `<option value="${escapeAttr(club)}">${escapeHtml(club)}</option>`)].join("");
  el.approachClubSelect.value = clubs.includes(hole.approachClub) ? hole.approachClub : "";
}

function sortLongClubs(clubs) {
  const rank = (club) => {
    if (club === "Driver") return 0;
    const number = Number(club.match(/\d+/)?.[0] || 99);
    const typeOffset = club.includes("Wood") ? 10 : club.includes("Hybrid") ? 30 : 50;
    return typeOffset + number;
  };
  return clubs.slice().sort((a, b) => rank(a) - rank(b));
}

function sortIronsAscending(clubs) {
  return clubs.slice().sort((a, b) => Number(a.match(/\d+/)?.[0] || 99) - Number(b.match(/\d+/)?.[0] || 99));
}

function sortIronsDescending(clubs) {
  return clubs.slice().sort((a, b) => Number(b.match(/\d+/)?.[0] || 0) - Number(a.match(/\d+/)?.[0] || 0));
}

function sortWedgesByLoft(clubs) {
  return clubs.slice().sort((a, b) => wedgeLoftFromLabel(a) - wedgeLoftFromLabel(b));
}

function wedgeLoftFromLabel(label) {
  return Number(String(label).match(/\d+/)?.[0] || 99);
}

function selectedCourse() {
  return COURSES.find((item) => item.name === el.courseSelect.value);
}

function updateRoundFormatOptions() {
  const course = selectedCourse();
  if (!course) return;
  const isNineHoleCourse = course.pars.length === 9;
  el.roundFormatButtons.forEach((button) => {
    const isFullRoundButton = button.dataset.roundFormat === "18";
    button.classList.toggle("hidden", isNineHoleCourse && !isFullRoundButton);
    if (isFullRoundButton) button.textContent = isNineHoleCourse ? "9 holes" : "18 holes";
  });
  if (isNineHoleCourse) setRoundFormat("18");
}

function setRoundFormat(formatId) {
  if (!ROUND_FORMATS[formatId]) return;
  selectedRoundFormat = formatId;
  el.roundFormatButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.roundFormat === selectedRoundFormat);
  });
}

function startRound() {
  const course = selectedCourse();
  if (!course) return;
  editingCompletedRoundId = null;
  activeRound = createRoundState(course, selectedRoundFormat);
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
  if (!confirmPuttDistanceOrder()) return;
  saveCurrentHole();
  if (currentHoleIndex === activeRound.holes.length - 1) showRoundContextPage();
  else {
    currentHoleIndex += 1;
    activeRound.currentHoleIndex = currentHoleIndex;
    persistActiveRound();
    showHole();
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}

function createRoundState(course, formatId = "18") {
  const isNineHoleCourse = course.pars.length === 9;
  const format = isNineHoleCourse ? { label: "9 holes", start: 0, end: 9 } : getRoundFormat(formatId);
  const storedFormatId = isNineHoleCourse ? "course9" : formatId;
  return {
    id: `round_${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    course: course.name,
    formatId: storedFormatId,
    formatLabel: format.label,
    excludeFromAnalysis: false,
    excludeFromHandicap: false,
    context: { ...EMPTY_ROUND_CONTEXT },
    currentHoleIndex: 0,
    holes: course.pars.slice(format.start, format.end).map((par, index) => {
      const courseHoleIndex = format.start + index;
      return {
        hole: courseHoleIndex + 1,
        par,
        strokeIndex: course.strokeIndexes?.[courseHoleIndex] ?? null,
        length: course.lengths?.[courseHoleIndex] ?? null,
        score: null,
        pickedUp: false,
        pickedUpManual: false,
        teeClub: null,
        fairway: par === 3 ? null : null,
        fairwayMiss: null,
        gir: null,
        approachClub: null,
        approachDistance: null,
        approachHit: null,
        approachMiss: null,
        chips: null,
        chipsEntryMode: null,
        chipTypes: [],
        fairwayBunker: null,
        fairwayBunkerEntryMode: null,
        greensideBunker: null,
        bunkerEntryMode: null,
        penaltyType: null,
        penaltyStrokes: null,
        puttsEntryMode: null,
        putts: null,
        puttDistances: []
      };
    })
  };
}

function showHole() {
  if (!activeRound) return;
  const hole = currentHole();
  el.startPanel.classList.add("hidden");
  el.roundContextForm.classList.add("hidden");
  el.holeForm.classList.remove("hidden");
  el.courseName.textContent = roundDisplayName(activeRound);
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
  el.teeClubSelect.closest("div").classList.toggle("hidden", hole.par === 3);
  setRadio("gir", hole.gir);
  renderShotUi("fairway", hole.par === 3 ? null : deriveShotState(hole.fairway, hole.fairwayMiss), hole.fairwayMiss);
  renderTeeClubSelect(hole);
  renderApproachClubSelect(hole);
  renderShotUi("approach", deriveShotState(hole.approachHit, hole.approachMiss), hole.approachMiss);
  renderPuttUi(hole.putts, hole.puttDistances, hole.puttsEntryMode);
  renderChipUi(hole.chips, hole.chipTypes, hole.chipsEntryMode);
  el.fairwayBunkerPanel.classList.add("hidden");
  renderFairwayBunkerUi(hole.fairwayBunker, hole.fairwayBunkerEntryMode);
  renderBunkerUi(hole.greensideBunker, hole.bunkerEntryMode);
  updatePenaltyUi(hole.penaltyType, hole.penaltyStrokes);
  el.prevHoleBtn.disabled = currentHoleIndex === 0;
  el.topPrevHoleBtn.disabled = currentHoleIndex === 0;
  el.prevHoleBtn.classList.toggle("hidden", currentHoleIndex === 0);
  el.topPrevHoleBtn.classList.toggle("hidden", currentHoleIndex === 0);
  const nextLabel = currentHoleIndex === activeRound.holes.length - 1 ? "Finish" : "Next";
  el.topNextHoleBtn.textContent = nextLabel;
  el.nextHoleBtn.textContent = nextLabel;
  closeRoundMenu();
  updateRunningScore();
}

function showRoundContextPage() {
  if (!activeRound) return;
  activeRound.context = normalizeRoundContext(activeRound.context);
  el.holeForm.classList.add("hidden");
  el.startPanel.classList.add("hidden");
  el.roundContextForm.classList.remove("hidden");
  el.roundContextCourse.textContent = roundDisplayName(activeRound);
  el.weatherSelect.value = activeRound.context.weather || "";
  el.windSpeedInput.value = activeRound.context.windSpeed ?? "";
  el.windDirectionSelect.value = activeRound.context.windDirection || "";
  el.roundNotesInput.value = activeRound.context.notes || "";
  renderFoodEntries(activeRound.context.food.length ? activeRound.context.food : [{ name: "", holes: [] }]);
  persistActiveRound();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function returnToLastHole() {
  if (!activeRound) return;
  saveRoundContext();
  currentHoleIndex = activeRound.holes.length - 1;
  activeRound.currentHoleIndex = currentHoleIndex;
  persistActiveRound();
  showHole();
}

function renderFoodEntries(entries) {
  el.foodEntries.innerHTML = entries
    .map((entry, index) => `
      <div class="food-entry" data-food-entry>
        <div>
          <label for="foodName${index}">Food</label>
          <input id="foodName${index}" data-food-name type="text" value="${escapeAttr(entry.name || "")}" placeholder="Banana, bar, sandwich">
        </div>
        <div>
          <label for="foodHoles${index}">Holes</label>
          <input id="foodHoles${index}" data-food-holes type="text" value="${escapeAttr(formatHoleList(entry.holes))}" placeholder="3, 7, 12">
        </div>
        <button class="shot-clear-icon food-remove" type="button" data-remove-food aria-label="Remove food">X</button>
      </div>
    `)
    .join("");
  el.foodEntries.querySelectorAll("[data-remove-food]").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest("[data-food-entry]").remove();
      if (!el.foodEntries.querySelector("[data-food-entry]")) addFoodEntry();
      saveRoundContext();
    });
  });
  el.foodEntries.querySelectorAll("input").forEach((input) => input.addEventListener("input", saveRoundContext));
}

function addFoodEntry(entry = { name: "", holes: [] }) {
  const entries = readFoodEntries();
  entries.push(entry);
  renderFoodEntries(entries);
}

function saveRoundContext() {
  if (!activeRound) return;
  activeRound.context = normalizeRoundContext({
    weather: el.weatherSelect.value,
    windSpeed: numberOrNull(el.windSpeedInput.value),
    windDirection: el.windDirectionSelect.value,
    food: readFoodEntries(),
    notes: el.roundNotesInput.value.trim()
  });
  persistActiveRound();
}

function readFoodEntries() {
  return Array.from(el.foodEntries.querySelectorAll("[data-food-entry]"))
    .map((row) => ({
      name: row.querySelector("[data-food-name]").value.trim(),
      holes: parseHoleList(row.querySelector("[data-food-holes]").value)
    }))
    .filter((entry) => entry.name || entry.holes.length);
}

function parseHoleList(value) {
  return String(value || "")
    .split(/[^0-9]+/)
    .map((item) => Number(item))
    .filter((hole) => Number.isInteger(hole) && hole > 0 && hole <= 18);
}

function formatHoleList(holes) {
  return Array.isArray(holes) ? holes.join(", ") : "";
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
    teeClub: el.teeClubSelect.value || null,
    gir: radioValue("gir"),
    approachClub: el.approachClubSelect.value || null,
    approachDistance: limitNumberOrNull(el.approachDistanceInput.value, 999),
    chips: hole.chips ?? null,
    chipsEntryMode: hole.chipsEntryMode ?? null,
    chipTypes: hole.chipTypes ?? [],
    fairwayBunker: hole.fairwayBunker ?? null,
    fairwayBunkerEntryMode: hole.fairwayBunkerEntryMode ?? null,
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
  saveRoundContext();
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
  el.roundContextForm.classList.add("hidden");
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
      hole.fairwayBunker = null;
      hole.fairwayBunkerEntryMode = null;
    } else {
      hole.fairway = false;
      hole.fairwayMiss = value;
    }
    renderShotUi("fairway", value, hole.fairwayMiss);
    renderFairwayBunkerUi(hole.fairwayBunker, hole.fairwayBunkerEntryMode);
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
    hole.fairwayBunker = null;
    hole.fairwayBunkerEntryMode = null;
    renderShotUi("fairway", null, null);
    renderFairwayBunkerUi(hole.fairwayBunker, hole.fairwayBunkerEntryMode);
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

function handleShotWheelClick(event) {
  const wheel = event.currentTarget;
  const field = wheel.dataset.field;
  if (!field) return;
  const rect = wheel.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;
  const distance = Math.hypot(x, y);
  const centerRadius = rect.width * 0.22;
  const value = distance <= centerRadius ? "hit" : Math.abs(y) >= Math.abs(x) ? (y < 0 ? "long" : "short") : x < 0 ? "left" : "right";
  applyShotSelection(field, value);
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
    renderFairwayBunkerUi(hole.fairwayBunker, hole.fairwayBunkerEntryMode);
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
  hole.fairwayBunker = null;
  hole.fairwayBunkerEntryMode = null;
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
  if (!event.target.closest("#profileMenu") && !event.target.closest("#profileMenuBtn")) el.profileMenu.classList.add("hidden");
  if (!event.target.closest("#bagMenu") && !event.target.closest("#bagMenuBtn")) el.bagMenu.classList.add("hidden");
  if (!event.target.closest(".card-menu-anchor")) {
    const hadOpenCardMenu = Boolean(openRoundCardMenuId);
    openRoundCardMenuId = null;
    if (hadOpenCardMenu) renderRounds();
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
  if (!confirmPuttDistanceOrder()) return;
  closeRoundMenu();
  saveCurrentHole();
  showRoundContextPage();
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
  activeRound = createRoundState(course, activeRound.formatId || "18");
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
  el.roundContextForm.classList.add("hidden");
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

function confirmPuttDistanceOrder() {
  const distances = Array.from(document.querySelectorAll(".putt-distance-input")).map((input) => numberOrNull(input.value));
  const first = distances[0];
  const second = distances[1];
  if (!Number.isFinite(first) || !Number.isFinite(second) || first >= second) return true;
  return window.confirm("Putt 1 is shorter than Putt 2. Is that definitely correct?");
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

function toggleFairwayBunkerPanel() {
  el.fairwayBunkerPanel.classList.toggle("hidden");
  updateFairwayBunkerButtonState(currentHole());
}

function handleFairwayBunkerChoice(choice) {
  if (!activeRound) return;
  const hole = currentHole();
  if (choice === "other") {
    if (hole.fairwayBunkerEntryMode === "other") {
      hole.fairwayBunkerEntryMode = null;
      hole.fairwayBunker = null;
    } else {
      hole.fairwayBunkerEntryMode = "other";
      hole.fairwayBunker = numberOrNull(el.otherFairwayBunkerSelect.value);
    }
  } else if (hole.fairwayBunkerEntryMode === "preset" && hole.fairwayBunker === Number(choice)) {
    hole.fairwayBunkerEntryMode = null;
    hole.fairwayBunker = null;
  } else {
    hole.fairwayBunkerEntryMode = "preset";
    hole.fairwayBunker = Number(choice);
  }
  renderFairwayBunkerUi(hole.fairwayBunker, hole.fairwayBunkerEntryMode);
  persistActiveRound();
}

function handleOtherFairwayBunkerChange() {
  if (!activeRound) return;
  const hole = currentHole();
  hole.fairwayBunkerEntryMode = "other";
  hole.fairwayBunker = numberOrNull(el.otherFairwayBunkerSelect.value);
  renderFairwayBunkerUi(hole.fairwayBunker, hole.fairwayBunkerEntryMode);
  persistActiveRound();
}

function renderFairwayBunkerUi(value, entryMode = null) {
  const hole = currentHole();
  const showField = shouldShowFairwayBunker(hole);
  el.fairwayBunkerField.classList.toggle("hidden", !showField);
  if (!showField) {
    el.fairwayBunkerPanel.classList.add("hidden");
  }
  const hasValue = value !== null && value !== undefined;
  el.fairwayBunkerToggleBtn.textContent = hasValue ? `Fairway bunkers: ${value}` : "Fairway bunkers";
  el.fairwayBunkerChoiceButtons.forEach((button) => {
    const active = button.dataset.fairwayBunkerChoice === "other" ? entryMode === "other" : String(value) === button.dataset.fairwayBunkerChoice;
    button.classList.toggle("is-active", active);
  });
  el.otherFairwayBunkerWrap.classList.toggle("hidden", entryMode !== "other");
  el.otherFairwayBunkerSelect.value = entryMode === "other" && value !== null ? String(value) : "";
  updateFairwayBunkerButtonState(hole);
}

function shouldShowFairwayBunker(hole) {
  if (!hole || hole.par === 3) return false;
  if (hole.par === 5) return true;
  return hole.fairway === false;
}

function updateFairwayBunkerButtonState(hole) {
  const active = Boolean(hole?.fairwayBunker !== null && hole?.fairwayBunker !== undefined || hole?.fairwayBunkerEntryMode === "other" || !el.fairwayBunkerPanel.classList.contains("hidden"));
  el.fairwayBunkerToggleBtn.classList.toggle("is-active", active);
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
  const activeRoundLabel = activeRound && !editingCompletedRoundId ? `${roundDisplayName(activeRound)} · Hole ${currentHole().hole}` : "None";
  const handicapLedger = calculateHandicapLedger(scoredRounds);
  const currentHandicap = handicapLedger.at(-1)?.handicapIndex ?? null;

  el.dashboardStats.innerHTML = [
    ["Completed rounds", rounds.length],
    ["Scoring average", scoredRounds.length ? average(scoredRounds.map(adjustedRoundScore)).toFixed(1) : "0.0"],
    ["Handicap index", formatHandicapIndex(currentHandicap)],
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
    scoredRounds.map(adjustedRoundScore),
    "Score"
  );

  drawChart(
    "dashboardHandicapChart",
    "line",
    handicapLedger.map((item) => item.round.date),
    handicapLedger.map((item) => item.handicapIndex),
    "Handicap Index"
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
  if (analyticsSection === "performanceOverview") renderPerformanceOverview(filteredRounds, roundMetrics);
  else if (analyticsSection === "strokesLost") renderStrokesLostAnalysis(filteredRounds, roundMetrics);
  else if (analyticsSection === "driving") renderDrivingAnalysis(filteredRounds);
  else if (analyticsSection === "approachPlay") renderApproachPlayAnalysis(filteredRounds);
  else if (analyticsSection === "shortGame") renderShortGameAnalysis(filteredRounds);
  else if (analyticsSection === "putting") renderPuttingAnalysis(filteredRounds);
  else if (analyticsSection === "scoringAnalysis") renderScoringAnalysis(filteredRounds);
  else if (analyticsSection === "situationalAnalysis") renderSituationalAnalysis(filteredRounds);
  else if (analyticsSection === "trends") renderExpandedTrends(filteredRounds, roundMetrics);
  else if (analyticsSection === "practicePriorities") renderPracticePriorities(filteredRounds);
  else renderAnalyticsPlaceholder(analyticsSection);
}

function updateAnalyticsUi() {
  el.analyticsRangeSelect.value = analyticsRange;
  el.analyticsRoundCountSelect.value = String(analyticsRoundCount);
  el.analyticsRoundCountWrap.classList.toggle("hidden", analyticsRange !== "lastX");
  el.analyticsSectionSelect.value = analyticsSection;
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
  const sorted = analysisEligibleRounds(rounds).sort((a, b) => new Date(a.date) - new Date(b.date));
  const now = new Date();
  if (analyticsRange === "lastX") return sorted.slice(-analyticsRoundCount);
  if (analyticsRange === "all") return sorted;
  const cutoff = new Date(now);
  if (analyticsRange === "ytd" || analyticsRange === "calendarYear") {
    return sorted.filter((round) => new Date(round.date).getFullYear() === now.getFullYear());
  }
  if (analyticsRange === "sixMonths") cutoff.setMonth(cutoff.getMonth() - 6);
  if (analyticsRange === "threeMonths") cutoff.setMonth(cutoff.getMonth() - 3);
  if (analyticsRange === "month") cutoff.setMonth(cutoff.getMonth() - 1);
  if (analyticsRange === "week") cutoff.setDate(cutoff.getDate() - 7);
  return sorted.filter((round) => new Date(round.date) >= cutoff);
}

function analysisEligibleRounds(sourceRounds = rounds) {
  return sourceRounds.filter((round) => !round.excludeFromAnalysis);
}

function handicapEligibleRounds(sourceRounds = rounds) {
  return sourceRounds.filter((round) => !round.excludeFromHandicap);
}

function buildRoundMetrics(round) {
  const holes = round.holes.map(normalizeHole);
  const context = normalizeRoundContext(round.context);
  const fairwayHoles = holes.filter((hole) => hole.fairway !== null);
  const girHoles = holes.filter((hole) => hole.gir !== null);
  const approachHoles = holes.filter((hole) => hole.approachHit !== null);
  const puttHoles = holes.filter((hole) => hole.putts !== null);
  const firstPuttDistances = holes.map((hole) => hole.puttDistances?.[0]).filter((value) => typeof value === "number");
  const chipTypes = holes.flatMap((hole) => hole.chipTypes || []);
  const missedGir = holes.filter((hole) => hole.gir === false);
  const scale = roundEighteenHoleScale(round);
  const score = adjustedRoundScore(round);
  const actualPuttsTotal = puttHoles.reduce((sum, hole) => sum + hole.putts, 0);
  const actualChipsTotal = holes.reduce((sum, hole) => sum + (hole.chips || 0), 0);
  const actualFairwayBunkerTotal = holes.reduce((sum, hole) => sum + (hole.fairwayBunker || 0), 0);
  const actualBunkerTotal = holes.reduce((sum, hole) => sum + (hole.greensideBunker || 0), 0);
  const actualPenaltiesTotal = holes.reduce((sum, hole) => sum + (hole.penaltyStrokes || 0), 0);
  return {
    round,
    context,
    score,
    actualScore: totalScore(round),
    overPar: score - totalPar(round) * scale,
    girPct: pct(girHoles.filter((hole) => hole.gir).length, girHoles.length),
    firPct: pct(fairwayHoles.filter((hole) => hole.fairway).length, fairwayHoles.length),
    approachHitPct: pct(approachHoles.filter((hole) => hole.approachHit).length, approachHoles.length),
    girCount: girCount(round),
    firCount: fairwayHoles.filter((hole) => hole.fairway).length,
    puttsTotal: actualPuttsTotal * scale,
    actualPuttsTotal,
    avgPutts: average(puttHoles.map((hole) => hole.putts)),
    threePutts: puttHoles.filter((hole) => hole.putts >= 3).length,
    puttsOver6: holes.reduce((sum, hole) => sum + countHolePuttsByDistance(hole, "over"), 0) * scale,
    puttsUnder6: holes.reduce((sum, hole) => sum + countHolePuttsByDistance(hole, "under"), 0) * scale,
    firstPuttDistance: average(firstPuttDistances),
    chipsTotal: actualChipsTotal * scale,
    fairwayBunkerTotal: actualFairwayBunkerTotal * scale,
    bunkerTotal: actualBunkerTotal * scale,
    penaltiesTotal: actualPenaltiesTotal * scale,
    windSpeed: context.windSpeed,
    foodCount: context.food.length,
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
    avgPar5: average(holes.filter((hole) => hole.par === 5).map((hole) => hole.score)),
    doubleBogeyPlus: holes.filter((hole) => hole.score !== null && hole.score - hole.par >= 2).length * scale
  };
}

function renderPerformanceOverview(filteredRounds, roundMetrics) {
  const handicapLedger = calculateHandicapLedger(filteredRounds);
  const currentHandicap = handicapLedger.at(-1)?.handicapIndex ?? null;
  const fairwayAttempts = sum(filteredRounds.map((round) => round.holes.filter((hole) => hole.fairway !== null).length));
  const girAttempts = sum(filteredRounds.map((round) => round.holes.filter((hole) => hole.gir !== null).length));
  const doubleBogeyPlus = average(roundMetrics.map((item) => item.doubleBogeyPlus)).toFixed(1);
  const consistency = roundConsistencyStats(roundMetrics);
  const frontBack = frontBackSplitStats(filteredRounds);

  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="analytics-page-title">
        <p class="eyebrow">${filterLabel()}</p>
        <h2>Performance Overview</h2>
      </div>
      <div class="stats-grid performance-overview-grid">
        ${renderStatCards([
          ["Handicap Trend", formatHandicapIndex(currentHandicap)],
          ["Average Score", average(roundMetrics.map((item) => item.score)).toFixed(1)],
          ["Best Score", Math.min(...roundMetrics.map((item) => item.score))],
          ["Rounds Played", filteredRounds.length],
          ["FIR %", `${pct(sum(roundMetrics.map((item) => item.firCount)), fairwayAttempts)}%`],
          ["GIR %", `${pct(sum(roundMetrics.map((item) => item.girCount)), girAttempts)}%`],
          ["Scrambling %", `${Math.round(average(roundMetrics.map((item) => item.scramblePct)))}%`],
          ["Putts/Round", average(roundMetrics.map((item) => item.puttsTotal)).toFixed(1)],
          ["Penalties/Round", average(roundMetrics.map((item) => item.penaltiesTotal)).toFixed(1)],
          ["Double Bogeys+/Round", doubleBogeyPlus]
        ])}
      </div>
      <div class="chart-panel">
        <div class="analytics-section-header">
          <h2>Scoring Distribution</h2>
          <span class="analytics-note">Shows consistency across score bands</span>
        </div>
        <div class="chart-wrap"><canvas id="performanceScoreDistributionChart"></canvas></div>
        ${renderScoringDistributionTable(scoringDistributionRows(roundMetrics))}
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Round Consistency Index</h2>
          <span class="analytics-note">Shows whether scoring is volatile or consistent</span>
        </div>
        <div class="stats-grid">
          ${renderStatCards([
            ["Average Score", consistency.average],
            ["Standard Deviation", consistency.standardDeviation],
            ["Consistency", consistency.label]
          ])}
        </div>
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Front 9 vs Back 9</h2>
          <span class="analytics-note">Can identify fatigue or focus issues</span>
        </div>
        ${renderFrontBackTable(frontBack)}
      </div>
    </div>
  `;

  const distribution = scoringDistributionRows(roundMetrics);
  drawBarChart(
    "performanceScoreDistributionChart",
    distribution.map((row) => row.label),
    distribution.map((row) => row.rounds),
    "Rounds"
  );
}

function renderAnalyticsPlaceholder(section) {
  const label = el.analyticsSectionSelect.options[el.analyticsSectionSelect.selectedIndex]?.text || section;
  el.analyticsContent.innerHTML = `
    <div class="panel">
      <h2>${escapeHtml(label)}</h2>
      <p class="analytics-note">This section is ready to be built next.</p>
    </div>
  `;
}

function renderStrokesLostAnalysis(filteredRounds, roundMetrics) {
  const strokesLost = strokesLostRows(filteredRounds);
  const doubleCauses = doubleBogeyCauseRows(filteredRounds);
  const birdies = birdieOpportunityStats(filteredRounds);
  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="analytics-page-title">
        <p class="eyebrow">${filterLabel()}</p>
        <h2>Strokes Lost Analysis</h2>
        <p class="analytics-note">Any SG or SL data is estimated and relative to scratch handicap.</p>
      </div>
      <div class="chart-panel">
        <div class="analytics-section-header">
          <h2>Estimated Strokes Lost / Round</h2>
          <span class="analytics-note">Where you lose the most shots against scratch</span>
        </div>
        <div class="chart-wrap"><canvas id="strokesLostCategoryChart"></canvas></div>
        ${renderStrokesLostTable(strokesLost)}
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Double Bogey Causes</h2>
          <span class="analytics-note">Causes tracked on every double bogey or worse hole</span>
        </div>
        ${renderCauseTable(doubleCauses)}
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Birdie Opportunities</h2>
          <span class="analytics-note">How often GIR turns into birdie</span>
        </div>
        <div class="stats-grid">
          ${renderStatCards([
            ["GIR opportunities", birdies.girOpportunities],
            ["Birdies made", birdies.birdiesMade],
            ["Conversion", `${birdies.conversion}%`]
          ])}
        </div>
      </div>
    </div>
  `;
  drawHorizontalBarChart(
    "strokesLostCategoryChart",
    strokesLost.map((row) => row.category),
    strokesLost.map((row) => row.strokesLost),
    "Strokes lost / round"
  );
}

function strokesLostRows(sourceRounds) {
  const perRound = sourceRounds.map(strokesLostForRound);
  const rows = [
    ["Penalties", "penalties"],
    ["3 putts", "threePutts"],
    ["Missed GIR", "missedGir"],
    ["Greenside bunker", "greensideBunker"],
    ["Tee misses right", "teeMissesRight"]
  ].map(([category, key]) => ({
    category,
    strokesLost: roundToTenth(average(perRound.map((round) => round[key])))
  }));
  return rows.sort((a, b) => b.strokesLost - a.strokesLost);
}

function strokesLostForRound(round) {
  const holes = round.holes.map(normalizeHole);
  const scale = roundEighteenHoleScale(round);
  const penaltyStrokes = holes.reduce((sum, hole) => sum + (hole.penaltyStrokes || 0), 0) * scale;
  const threePutts = holes.filter((hole) => hole.putts !== null && hole.putts >= 3).length * scale;
  const missedGir = holes.filter((hole) => hole.gir === false).length * scale;
  const greensideBunker = holes.reduce((sum, hole) => sum + (hole.greensideBunker || 0), 0) * scale;
  const teeMissesRight = holes.filter((hole) => ["push", "overFade", "slice", "right", "rightOther"].includes(hole.fairwayMiss)).length * scale;
  return {
    penalties: Math.max(0, penaltyStrokes - SCRATCH_STROKES_LOST_BASELINE.penaltyStrokesPerRound),
    threePutts: Math.max(0, threePutts - SCRATCH_STROKES_LOST_BASELINE.threePuttsPerRound),
    missedGir: Math.max(0, missedGir - SCRATCH_STROKES_LOST_BASELINE.missedGirPerRound) * SCRATCH_STROKES_LOST_BASELINE.missedGirCost,
    greensideBunker: Math.max(0, greensideBunker - SCRATCH_STROKES_LOST_BASELINE.greensideBunkersPerRound) * SCRATCH_STROKES_LOST_BASELINE.greensideBunkerCost,
    teeMissesRight: Math.max(0, teeMissesRight - SCRATCH_STROKES_LOST_BASELINE.teeMissesRightPerRound) * SCRATCH_STROKES_LOST_BASELINE.teeMissRightCost
  };
}

function renderStrokesLostTable(rows) {
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Category</th><th>Strokes lost/round</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${row.category}</td><td>${row.strokesLost.toFixed(1)}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function doubleBogeyCauseRows(sourceRounds) {
  const counts = new Map([
    ["Penalty", 0],
    ["3 putt", 0],
    ["Missed approach", 0],
    ["Bunker", 0],
    ["Tee miss right", 0]
  ]);
  sourceRounds.flatMap((round) => round.holes.map(normalizeHole)).forEach((hole) => {
    if (hole.score === null || hole.score - hole.par < 2) return;
    if ((hole.penaltyStrokes || 0) > 0) counts.set("Penalty", counts.get("Penalty") + 1);
    if (hole.putts !== null && hole.putts >= 3) counts.set("3 putt", counts.get("3 putt") + 1);
    if (hole.approachHit === false || hole.gir === false) counts.set("Missed approach", counts.get("Missed approach") + 1);
    if ((hole.greensideBunker || 0) > 0 || (hole.fairwayBunker || 0) > 0) counts.set("Bunker", counts.get("Bunker") + 1);
    if (["push", "overFade", "slice", "right", "rightOther"].includes(hole.fairwayMiss)) counts.set("Tee miss right", counts.get("Tee miss right") + 1);
  });
  return Array.from(counts.entries()).map(([cause, count]) => ({ cause, count })).sort((a, b) => b.count - a.count);
}

function renderCauseTable(rows) {
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Cause</th><th>Count</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${row.cause}</td><td>${row.count}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function birdieOpportunityStats(sourceRounds) {
  const girHoles = sourceRounds.flatMap((round) => round.holes.map(normalizeHole)).filter((hole) => hole.gir === true && hole.score !== null);
  const birdiesMade = girHoles.filter((hole) => hole.score < hole.par).length;
  return {
    girOpportunities: girHoles.length,
    birdiesMade,
    conversion: pct(birdiesMade, girHoles.length)
  };
}

function renderDrivingAnalysis(filteredRounds) {
  const clubRows = drivingClubRows(filteredRounds);
  const missRows = drivingMissSeverityRows(filteredRounds);
  const heatMap = drivingMissHeatMap(filteredRounds);
  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="analytics-page-title">
        <p class="eyebrow">${filterLabel()}</p>
        <h2>Driving</h2>
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Club Performance Table</h2>
          <span class="analytics-note">How tee club choice affects scoring and risk</span>
        </div>
        ${renderDrivingClubTable(clubRows)}
      </div>
      <div class="chart-panel">
        <div class="analytics-section-header">
          <h2>Tee Club Decision Matrix</h2>
          <span class="analytics-note">Average score by tee club</span>
        </div>
        <div class="chart-wrap"><canvas id="drivingDecisionChart"></canvas></div>
        ${renderDecisionMatrix(clubRows)}
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Miss Severity</h2>
          <span class="analytics-note">Not all misses are equal</span>
        </div>
        ${renderMissSeverityTable(missRows)}
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Miss Heat Map</h2>
          <span class="analytics-note">Visual tee-shot dispersion, left to right</span>
        </div>
        ${renderDrivingHeatMap(heatMap)}
      </div>
      <div class="chart-panel">
        <div class="analytics-section-header">
          <h2>Penalty Risk By Club</h2>
          <span class="analytics-note">Penalty holes divided by tee club uses</span>
        </div>
        <div class="chart-wrap"><canvas id="drivingPenaltyRiskChart"></canvas></div>
      </div>
    </div>
  `;
  drawBarChart("drivingDecisionChart", clubRows.map((row) => row.club), clubRows.map((row) => Number(row.avgScore)), "Avg Score");
  drawBarChart("drivingPenaltyRiskChart", clubRows.map((row) => row.club), clubRows.map((row) => row.penaltyRisk), "Penalty Risk %");
}

function drivingClubRows(sourceRounds) {
  const groups = new Map();
  drivingHoles(sourceRounds).forEach((hole) => {
    const club = hole.teeClub || "Unknown";
    if (!groups.has(club)) groups.set(club, []);
    groups.get(club).push(hole);
  });
  return Array.from(groups.entries()).map(([club, holes]) => {
    const uses = holes.length;
    const fairwayAttempts = holes.filter((hole) => hole.fairway !== null);
    const penalties = holes.filter((hole) => (hole.penaltyStrokes || 0) > 0).length;
    const misses = fairwayAttempts.filter((hole) => hole.fairway === false).length;
    return {
      club,
      uses,
      avgScore: average(holes.map((hole) => hole.score)).toFixed(1),
      fir: pct(fairwayAttempts.filter((hole) => hole.fairway).length, fairwayAttempts.length),
      penalties,
      missPct: pct(misses, fairwayAttempts.length),
      penaltyRisk: pct(penalties, uses)
    };
  }).sort((a, b) => b.uses - a.uses);
}

function drivingHoles(sourceRounds) {
  return sourceRounds
    .flatMap((round) => round.holes.map(normalizeHole))
    .filter((hole) => hole.par !== 3 && hole.score !== null);
}

function renderDrivingClubTable(rows) {
  if (!rows.length) return `<p class="analytics-note">No tee club data yet.</p>`;
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Club</th><th>Uses</th><th>Avg Score</th><th>FIR</th><th>Penalties</th><th>Miss %</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.club)}</td><td>${row.uses}</td><td>${row.avgScore}</td><td>${row.fir}%</td><td>${row.penalties}</td><td>${row.missPct}%</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function renderDecisionMatrix(rows) {
  if (!rows.length) return `<p class="analytics-note">No tee club data yet.</p>`;
  return `
    <div class="decision-list">
      ${rows.map((row) => `<div><strong>${escapeHtml(row.club)}</strong> average score: ${row.avgScore}</div>`).join("")}
    </div>
  `;
}

function drivingMissSeverityRows(sourceRounds) {
  const groups = new Map();
  drivingHoles(sourceRounds).forEach((hole) => {
    if (!hole.fairwayMiss) return;
    const key = hole.fairwayMiss;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(hole);
  });
  return Array.from(groups.entries()).map(([miss, holes]) => ({
    miss,
    label: formatMissLabel(miss),
    count: holes.length,
    avgScore: average(holes.map((hole) => hole.score)).toFixed(1)
  })).sort((a, b) => Number(b.avgScore) - Number(a.avgScore));
}

function renderMissSeverityTable(rows) {
  if (!rows.length) return `<p class="analytics-note">No fairway miss data yet.</p>`;
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Miss</th><th>Count</th><th>Avg Score</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${row.label}</td><td>${row.count}</td><td>${row.avgScore}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function drivingMissHeatMap(sourceRounds) {
  const holes = drivingHoles(sourceRounds);
  return [
    { key: "left", label: "Left", count: holes.filter((hole) => findPrimaryMiss(hole.fairwayMiss) === "left").length },
    { key: "short", label: "Short", count: holes.filter((hole) => findPrimaryMiss(hole.fairwayMiss) === "short").length },
    { key: "hit", label: "Hit", count: holes.filter((hole) => hole.fairway === true).length },
    { key: "long", label: "Long", count: holes.filter((hole) => findPrimaryMiss(hole.fairwayMiss) === "long").length },
    { key: "right", label: "Right", count: holes.filter((hole) => findPrimaryMiss(hole.fairwayMiss) === "right").length }
  ];
}

function renderDrivingHeatMap(rows) {
  const max = Math.max(...rows.map((row) => row.count), 1);
  return `
    <div class="miss-heatmap" aria-label="Driving miss heat map">
      ${rows.map((row) => `
        <div class="miss-heatmap-cell miss-${row.key}" style="--heat:${Math.max(0.12, row.count / max)}">
          <span>${row.label}</span>
          <strong>${row.count}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderApproachPlayAnalysis(filteredRounds) {
  const distanceRows = approachDistanceRows(filteredRounds);
  const clubRows = approachClubRows(filteredRounds);
  const biasRows = approachMissBiasRows(filteredRounds);
  const costRows = approachCostRows(filteredRounds);
  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="analytics-page-title">
        <p class="eyebrow">${filterLabel()}</p>
        <h2>Approach Play</h2>
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Distance Matrix</h2>
          <span class="analytics-note">GIR and scoring by approach distance</span>
        </div>
        ${renderApproachDistanceMatrix(distanceRows)}
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Club Matrix</h2>
          <span class="analytics-note">GIR, miss short rate, and scoring by approach club</span>
        </div>
        ${renderApproachClubMatrix(clubRows)}
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Miss Bias</h2>
          <span class="analytics-note">Where approaches tend to miss</span>
        </div>
        ${renderApproachMissBias(biasRows)}
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>GIR By Lie</h2>
          <span class="analytics-note">Requires adding approach lie to score entry</span>
        </div>
        <p class="analytics-note">Approach lie is not collected yet. Once added, this will compare fairway, rough, bunker, recovery, and tee-lie GIR rates.</p>
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Approach Cost Matrix</h2>
          <span class="analytics-note">Average score by approach outcome</span>
        </div>
        ${renderApproachCostMatrix(costRows)}
      </div>
    </div>
  `;
}

function approachHoles(sourceRounds) {
  return sourceRounds
    .flatMap((round) => round.holes.map(normalizeHole))
    .filter((hole) => hole.score !== null && (hole.approachDistance !== null || hole.approachClub || hole.gir !== null || hole.approachHit !== null));
}

function approachDistanceRows(sourceRounds) {
  const buckets = [
    { label: "0-50", min: 0, max: 50 },
    { label: "50-100", min: 50, max: 100 },
    { label: "100-150", min: 100, max: 150 },
    { label: "150-200", min: 150, max: 200 },
    { label: "200+", min: 200, max: Infinity }
  ];
  const holes = approachHoles(sourceRounds).filter((hole) => Number.isFinite(hole.approachDistance));
  return buckets.map((bucket) => {
    const bucketHoles = holes.filter((hole) => inBucket(hole.approachDistance, bucket));
    return {
      distance: bucket.label,
      attempts: bucketHoles.length,
      gir: pct(bucketHoles.filter((hole) => hole.gir).length, bucketHoles.filter((hole) => hole.gir !== null).length),
      avgScore: average(bucketHoles.map((hole) => hole.score)).toFixed(1)
    };
  });
}

function renderApproachDistanceMatrix(rows) {
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Distance</th><th>Attempts</th><th>GIR</th><th>Avg Score</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${row.distance}</td><td>${row.attempts}</td><td>${row.gir}%</td><td>${row.avgScore}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function approachClubRows(sourceRounds) {
  const groups = new Map();
  approachHoles(sourceRounds).forEach((hole) => {
    const club = hole.approachClub || "Unknown";
    if (!groups.has(club)) groups.set(club, []);
    groups.get(club).push(hole);
  });
  return Array.from(groups.entries()).map(([club, holes]) => {
    const attempts = holes.length;
    const girHoles = holes.filter((hole) => hole.gir !== null);
    const missShort = holes.filter((hole) => findPrimaryMiss(hole.approachMiss) === "short").length;
    return {
      club,
      attempts,
      gir: pct(girHoles.filter((hole) => hole.gir).length, girHoles.length),
      missShort: pct(missShort, attempts),
      avgScore: average(holes.map((hole) => hole.score)).toFixed(1)
    };
  }).sort((a, b) => b.attempts - a.attempts);
}

function renderApproachClubMatrix(rows) {
  if (!rows.length) return `<p class="analytics-note">No approach club data yet.</p>`;
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Club</th><th>Attempts</th><th>GIR</th><th>Miss Short</th><th>Avg Score</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.club)}</td><td>${row.attempts}</td><td>${row.gir}%</td><td>${row.missShort}%</td><td>${row.avgScore}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function approachMissBiasRows(sourceRounds) {
  const holes = approachHoles(sourceRounds).filter((hole) => hole.approachHit === false || hole.approachMiss);
  const keys = [
    { key: "short", label: "Short", arrow: "↓" },
    { key: "right", label: "Right", arrow: "→" },
    { key: "long", label: "Long", arrow: "↑" },
    { key: "left", label: "Left", arrow: "←" }
  ];
  return keys.map((item) => ({
    ...item,
    count: holes.filter((hole) => findPrimaryMiss(hole.approachMiss) === item.key).length,
    pct: pct(holes.filter((hole) => findPrimaryMiss(hole.approachMiss) === item.key).length, holes.length)
  }));
}

function renderApproachMissBias(rows) {
  return `
    <div class="miss-bias-grid">
      ${rows.map((row) => `
        <div class="miss-bias-card">
          <span class="miss-bias-arrow">${row.arrow}</span>
          <strong>${row.pct}%</strong>
          <span>${row.label}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function approachCostRows(sourceRounds) {
  const holes = approachHoles(sourceRounds);
  const rows = [
    { result: "GIR hit", holes: holes.filter((hole) => hole.gir === true || hole.approachHit === true) },
    { result: "GIR missed short", holes: holes.filter((hole) => hole.gir === false && findPrimaryMiss(hole.approachMiss) === "short") },
    { result: "GIR missed right", holes: holes.filter((hole) => hole.gir === false && findPrimaryMiss(hole.approachMiss) === "right") },
    { result: "GIR missed left", holes: holes.filter((hole) => hole.gir === false && findPrimaryMiss(hole.approachMiss) === "left") },
    { result: "GIR missed long", holes: holes.filter((hole) => hole.gir === false && findPrimaryMiss(hole.approachMiss) === "long") }
  ];
  return rows.map((row) => ({
    result: row.result,
    attempts: row.holes.length,
    avgScore: average(row.holes.map((hole) => hole.score)).toFixed(1)
  }));
}

function renderApproachCostMatrix(rows) {
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Result</th><th>Attempts</th><th>Avg Score</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${row.result}</td><td>${row.attempts}</td><td>${row.avgScore}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function renderShortGameAnalysis(filteredRounds) {
  const scrambleRows = scramblingBreakdownRows(filteredRounds);
  const upDownRows = upAndDownByChipTypeRows(filteredRounds);
  const missedGir = missedGirFinishStats(filteredRounds);
  const sand = sandSaveStats(filteredRounds);
  const recovery = missedFairwayRecoveryStats(filteredRounds);
  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="analytics-page-title">
        <p class="eyebrow">${filterLabel()}</p>
        <h2>Short Game</h2>
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Scrambling Breakdown</h2>
          <span class="analytics-note">Scramble rate by recovery situation</span>
        </div>
        ${renderScramblingBreakdownTable(scrambleRows)}
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Up-and-Down by Chip Type</h2>
          <span class="analytics-note">How each chip type converts missed greens</span>
        </div>
        ${renderUpAndDownTable(upDownRows)}
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Average Strokes After Missed GIR</h2>
          <span class="analytics-note">Putts plus chips/bunker shots after missed greens</span>
        </div>
        <div class="stats-grid">
          ${renderStatCards([
            ["Missed GIR holes", missedGir.count],
            ["Average finish", `${missedGir.averageFinish} strokes`]
          ])}
        </div>
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Sand Saves</h2>
          <span class="analytics-note">Bunker holes where par or better was saved</span>
        </div>
        <div class="stats-grid">
          ${renderStatCards([
            ["Bunker holes", sand.bunkerHoles],
            ["Saved par", sand.savedPar],
            ["Sand save %", `${sand.savePct}%`]
          ])}
        </div>
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Recovery Efficiency</h2>
          <span class="analytics-note">Performance after a missed fairway</span>
        </div>
        ${renderRecoveryEfficiencyTable(recovery)}
      </div>
    </div>
  `;
}

function scramblingBreakdownRows(sourceRounds) {
  const holes = missedGirHoles(sourceRounds);
  const rows = [
    { situation: "Regular chip", holes: holes.filter((hole) => (hole.chipTypes || []).includes("regular")) },
    { situation: "Rough chip", holes: holes.filter((hole) => (hole.chipTypes || []).includes("rough")) },
    { situation: "Bunker", holes: holes.filter((hole) => (hole.greensideBunker || 0) > 0) }
  ];
  return rows.map((row) => ({
    situation: row.situation,
    attempts: row.holes.length,
    scramblePct: pct(row.holes.filter(isScrambleSuccess).length, row.holes.length)
  }));
}

function renderScramblingBreakdownTable(rows) {
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Situation</th><th>Attempts</th><th>Scramble %</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${row.situation}</td><td>${row.attempts}</td><td>${row.scramblePct}%</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function upAndDownByChipTypeRows(sourceRounds) {
  const labels = [
    ["regular", "Regular"],
    ["bumpRun", "Bump and run"],
    ["flop", "Flop"],
    ["highObstacle", "High over obstacle"],
    ["rough", "Out of rough"],
    ["bank", "Into a bank"],
    ["putter", "Putter"]
  ];
  const holes = missedGirHoles(sourceRounds).filter((hole) => (hole.chips || 0) > 0);
  return labels.map(([key, label]) => {
    const matching = holes.filter((hole) => (hole.chipTypes || []).includes(key));
    return {
      type: label,
      attempts: matching.length,
      upDownPct: pct(matching.filter(isScrambleSuccess).length, matching.length),
      avgScore: average(matching.map((hole) => hole.score)).toFixed(1)
    };
  });
}

function renderUpAndDownTable(rows) {
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Chip Type</th><th>Attempts</th><th>Up-and-Down %</th><th>Avg Score</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${row.type}</td><td>${row.attempts}</td><td>${row.upDownPct}%</td><td>${row.avgScore}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function missedGirFinishStats(sourceRounds) {
  const holes = missedGirHoles(sourceRounds);
  const finishes = holes.map((hole) => (hole.putts || 0) + (hole.chips || 0) + (hole.greensideBunker || 0));
  return {
    count: holes.length,
    averageFinish: average(finishes).toFixed(1)
  };
}

function sandSaveStats(sourceRounds) {
  const holes = sourceRounds
    .flatMap((round) => round.holes.map(normalizeHole))
    .filter((hole) => hole.score !== null && (hole.greensideBunker || 0) > 0);
  const savedPar = holes.filter((hole) => hole.score <= hole.par).length;
  return {
    bunkerHoles: holes.length,
    savedPar,
    savePct: pct(savedPar, holes.length)
  };
}

function missedFairwayRecoveryStats(sourceRounds) {
  const holes = sourceRounds
    .flatMap((round) => round.holes.map(normalizeHole))
    .filter((hole) => hole.score !== null && hole.fairway === false);
  return [
    { metric: "Avg score", value: average(holes.map((hole) => hole.score)).toFixed(1) },
    { metric: "GIR", value: `${pct(holes.filter((hole) => hole.gir).length, holes.filter((hole) => hole.gir !== null).length)}%` },
    { metric: "Scramble", value: `${pct(holes.filter(isScrambleSuccess).length, holes.filter((hole) => hole.gir === false).length)}%` }
  ];
}

function renderRecoveryEfficiencyTable(rows) {
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Metric</th><th>Value</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${row.metric}</td><td>${row.value}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function missedGirHoles(sourceRounds) {
  return sourceRounds
    .flatMap((round) => round.holes.map(normalizeHole))
    .filter((hole) => hole.score !== null && hole.gir === false);
}

function isScrambleSuccess(hole) {
  return hole.score !== null && hole.score <= hole.par;
}

function renderPuttingAnalysis(filteredRounds) {
  const makeRows = puttingMakeRows(filteredRounds);
  const lag = lagPuttingStats(filteredRounds);
  const expected = expectedPuttsStats(filteredRounds);
  const pressure = puttingPressureStats(filteredRounds);
  const scatter = firstPuttDistanceScorePoints(filteredRounds);
  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="analytics-page-title">
        <p class="eyebrow">${filterLabel()}</p>
        <h2>Putting</h2>
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Make Percentage by Distance</h2>
          <span class="analytics-note">Holed putts inferred from the final putt length recorded on each hole</span>
        </div>
        ${renderPuttingMakeTable(makeRows)}
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Lag Putting Analysis</h2>
          <span class="analytics-note">First putts longer than 20 feet</span>
        </div>
        <div class="stats-grid">
          ${renderStatCards([
            ["Lag attempts", lag.attempts],
            ["Average leave", `${lag.averageLeave} ft`],
            ["3-putt rate", `${lag.threePuttRate}%`]
          ])}
        </div>
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Expected Putts</h2>
          <span class="analytics-note">Actual putts compared with a scratch-style benchmark by first-putt distance</span>
        </div>
        <div class="stats-grid">
          ${renderStatCards([
            ["Expected", expected.expected],
            ["Actual", expected.actual],
            ["Difference", expected.difference]
          ])}
        </div>
      </div>
      <div class="chart-panel">
        <div class="analytics-section-header">
          <h2>First Putt Distance vs Score</h2>
          <span class="analytics-note">Each point is one hole</span>
        </div>
        <div class="chart-wrap"><canvas id="puttingDistanceScoreChart"></canvas></div>
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Putting Pressure Metric</h2>
          <span class="analytics-note">Inside 6 feet, inferred from final putt length</span>
        </div>
        <div class="stats-grid">
          ${renderStatCards([
            ["Attempted", pressure.attempted],
            ["Holed", pressure.holed],
            ["Make %", `${pressure.makePct}%`]
          ])}
        </div>
      </div>
    </div>
  `;
  drawScatter("puttingDistanceScoreChart", scatter, "First putt distance", "Score");
}

function puttingMakeRows(sourceRounds) {
  const attempts = puttingAttemptRows(sourceRounds);
  const buckets = [
    { label: "0-3 ft", min: 0, max: 3 },
    { label: "3-6 ft", min: 3, max: 6 },
    { label: "6-10 ft", min: 6, max: 10 },
    { label: "10-20 ft", min: 10, max: 20 },
    { label: "20-40 ft", min: 20, max: 40 },
    { label: "40+ ft", min: 40, max: Infinity }
  ];
  return buckets.map((bucket) => {
    const bucketAttempts = attempts.filter((attempt) => inBucket(attempt.distance, bucket));
    return {
      bucket: bucket.label,
      attempts: bucketAttempts.length,
      made: bucketAttempts.filter((attempt) => attempt.made).length,
      makePct: pct(bucketAttempts.filter((attempt) => attempt.made).length, bucketAttempts.length)
    };
  });
}

function renderPuttingMakeTable(rows) {
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Distance</th><th>Attempts</th><th>Holed</th><th>Make %</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${row.bucket}</td><td>${row.attempts}</td><td>${row.made}</td><td>${row.makePct}%</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function lagPuttingStats(sourceRounds) {
  const holes = puttingHoles(sourceRounds).filter((hole) => Number.isFinite(hole.puttDistances?.[0]) && hole.puttDistances[0] > 20);
  const leaves = holes.map((hole) => hole.puttDistances?.[1]).filter(Number.isFinite);
  return {
    attempts: holes.length,
    averageLeave: average(leaves).toFixed(1),
    threePuttRate: pct(holes.filter((hole) => hole.putts >= 3).length, holes.length)
  };
}

function expectedPuttsStats(sourceRounds) {
  const holes = puttingHoles(sourceRounds).filter((hole) => Number.isFinite(hole.puttDistances?.[0]));
  const actual = sum(holes.map((hole) => hole.putts));
  const expected = sum(holes.map((hole) => expectedPuttsForDistance(hole.puttDistances[0])));
  const perRoundScale = sourceRounds.length ? roundToTenth((actual - expected) / sourceRounds.length) : 0;
  return {
    expected: expected.toFixed(1),
    actual: actual.toFixed(1),
    difference: `${perRoundScale >= 0 ? "Losing" : "Gaining"} ${Math.abs(perRoundScale).toFixed(1)} shots/round`
  };
}

function expectedPuttsForDistance(distance) {
  if (distance <= 3) return 1.05;
  if (distance <= 6) return 1.25;
  if (distance <= 10) return 1.55;
  if (distance <= 20) return 1.85;
  if (distance <= 40) return 2.05;
  return 2.25;
}

function firstPuttDistanceScorePoints(sourceRounds) {
  return puttingHoles(sourceRounds)
    .filter((hole) => Number.isFinite(hole.puttDistances?.[0]) && Number.isFinite(hole.score))
    .map((hole) => ({ x: hole.puttDistances[0], y: hole.score }));
}

function puttingPressureStats(sourceRounds) {
  const attempts = puttingAttemptRows(sourceRounds).filter((attempt) => attempt.distance <= 6);
  const holed = attempts.filter((attempt) => attempt.made).length;
  return {
    attempted: attempts.length,
    holed,
    makePct: pct(holed, attempts.length)
  };
}

function puttingAttemptRows(sourceRounds) {
  return puttingHoles(sourceRounds).flatMap((hole) => {
    const distances = Array.isArray(hole.puttDistances) ? hole.puttDistances.filter(Number.isFinite) : [];
    return distances.map((distance, index) => ({
      distance,
      made: index === distances.length - 1
    }));
  });
}

function puttingHoles(sourceRounds) {
  return sourceRounds
    .flatMap((round) => round.holes.map(normalizeHole))
    .filter((hole) => hole.putts !== null && Array.isArray(hole.puttDistances) && hole.puttDistances.length);
}

function renderScoringAnalysis(filteredRounds) {
  const parRows = scoreByParRows(filteredRounds);
  const difficultyRows = holeDifficultyRows(filteredRounds);
  const bogey = bogeyAvoidanceStats(filteredRounds);
  const blowUps = blowUpAnalysisRows(filteredRounds);
  const afterBad = scoringAfterBadHoleStats(filteredRounds);
  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="analytics-page-title">
        <p class="eyebrow">${filterLabel()}</p>
        <h2>Scoring Analysis</h2>
      </div>
      <div class="panel">
        <div class="analytics-section-header"><h2>Score By Hole Par</h2><span class="analytics-note">Average scoring by par type</span></div>
        ${renderSimpleTable(["Par", "Avg"], parRows.map((row) => [row.par, row.avg]))}
      </div>
      <div class="panel">
        <div class="analytics-section-header"><h2>Hole Difficulty Ranking</h2><span class="analytics-note">Across all played courses</span></div>
        ${renderSimpleTable(["Hole", "Rounds", "Avg Score", "Avg vs Par"], difficultyRows.map((row) => [row.hole, row.rounds, row.avgScore, row.avgVsPar]))}
      </div>
      <div class="panel">
        <div class="analytics-section-header"><h2>Bogey Avoidance</h2><span class="analytics-note">Distribution of scoring outcomes</span></div>
        <div class="stats-grid">
          ${renderStatCards([
            ["Pars or better", `${bogey.parOrBetter}%`],
            ["Bogeys", `${bogey.bogey}%`],
            ["Double+", `${bogey.doublePlus}%`]
          ])}
        </div>
      </div>
      <div class="panel">
        <div class="analytics-section-header"><h2>Blow-Up Hole Analysis</h2><span class="analytics-note">Double, triple, quad+ and common causes</span></div>
        ${renderSimpleTable(["Type", "Count", "Top Cause"], blowUps.map((row) => [row.type, row.count, row.topCause]))}
      </div>
      <div class="panel">
        <div class="analytics-section-header"><h2>Scoring After Bad Hole</h2><span class="analytics-note">Mental game metric after double bogey or worse</span></div>
        <div class="stats-grid">
          ${renderStatCards([
            ["Follow-up holes", afterBad.count],
            ["Avg score vs par", afterBad.averageVsPar]
          ])}
        </div>
      </div>
    </div>
  `;
}

function scoreByParRows(sourceRounds) {
  return [3, 4, 5].map((par) => {
    const holes = allScoredHoles(sourceRounds).filter((hole) => hole.par === par);
    return { par: `Par ${par}`, avg: average(holes.map((hole) => hole.score)).toFixed(1) };
  });
}

function holeDifficultyRows(sourceRounds) {
  const groups = new Map();
  sourceRounds.forEach((round) => {
    round.holes.map(normalizeHole).forEach((hole) => {
      if (hole.score === null) return;
      const key = `${round.course} #${hole.hole}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(hole);
    });
  });
  return Array.from(groups.entries()).map(([hole, holes]) => ({
    hole,
    rounds: holes.length,
    avgScore: average(holes.map((item) => item.score)).toFixed(1),
    avgVsPar: signedNumber(average(holes.map((item) => item.score - item.par)))
  })).sort((a, b) => Number(b.avgVsPar) - Number(a.avgVsPar));
}

function bogeyAvoidanceStats(sourceRounds) {
  const holes = allScoredHoles(sourceRounds);
  return {
    parOrBetter: pct(holes.filter((hole) => hole.score <= hole.par).length, holes.length),
    bogey: pct(holes.filter((hole) => hole.score - hole.par === 1).length, holes.length),
    doublePlus: pct(holes.filter((hole) => hole.score - hole.par >= 2).length, holes.length)
  };
}

function blowUpAnalysisRows(sourceRounds) {
  const holes = allScoredHoles(sourceRounds);
  const rows = [
    { type: "Double+", holes: holes.filter((hole) => hole.score - hole.par >= 2) },
    { type: "Triple+", holes: holes.filter((hole) => hole.score - hole.par >= 3) },
    { type: "Quad+", holes: holes.filter((hole) => hole.score - hole.par >= 4) }
  ];
  return rows.map((row) => ({
    type: row.type,
    count: row.holes.length,
    topCause: topBlowUpCause(row.holes)
  }));
}

function topBlowUpCause(holes) {
  const counts = new Map([
    ["Penalty", 0],
    ["3 putt", 0],
    ["Missed approach", 0],
    ["Bunker", 0],
    ["Tee miss", 0]
  ]);
  holes.forEach((hole) => {
    if ((hole.penaltyStrokes || 0) > 0) counts.set("Penalty", counts.get("Penalty") + 1);
    if (hole.putts !== null && hole.putts >= 3) counts.set("3 putt", counts.get("3 putt") + 1);
    if (hole.approachHit === false || hole.gir === false) counts.set("Missed approach", counts.get("Missed approach") + 1);
    if ((hole.greensideBunker || 0) > 0 || (hole.fairwayBunker || 0) > 0) counts.set("Bunker", counts.get("Bunker") + 1);
    if (hole.fairway === false) counts.set("Tee miss", counts.get("Tee miss") + 1);
  });
  const top = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0];
  return top && top[1] ? `${top[0]} (${top[1]})` : "None logged";
}

function scoringAfterBadHoleStats(sourceRounds) {
  const following = [];
  sourceRounds.forEach((round) => {
    const holes = round.holes.map(normalizeHole);
    holes.forEach((hole, index) => {
      if (hole.score === null || hole.score - hole.par < 2) return;
      const next = holes[index + 1];
      if (next?.score !== null && next?.score !== undefined) following.push(next.score - next.par);
    });
  });
  return {
    count: following.length,
    averageVsPar: signedNumber(average(following))
  };
}

function renderSituationalAnalysis(filteredRounds) {
  const frontBack = frontBackSplitStats(filteredRounds);
  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="analytics-page-title">
        <p class="eyebrow">${filterLabel()}</p>
        <h2>Situational Analysis</h2>
      </div>
      <div class="panel">
        <div class="analytics-section-header"><h2>Performance In Wind</h2><span class="analytics-note">Average adjusted score by wind speed bucket</span></div>
        ${renderSimpleTable(["Wind", "Rounds", "Score"], windSpeedBucketRows(filteredRounds).map((row) => [row.wind, row.rounds, row.score]))}
      </div>
      <div class="panel">
        <div class="analytics-section-header"><h2>Weather Impact</h2><span class="analytics-note">Average adjusted score by weather</span></div>
        ${renderContextGroupTable(groupRoundsByContext(filteredRounds, "weather"), "Weather")}
      </div>
      <div class="panel">
        <div class="analytics-section-header"><h2>Fatigue Analysis</h2><span class="analytics-note">Front vs back nine performance</span></div>
        ${renderFrontBackTable(frontBack)}
      </div>
      <div class="panel">
        <div class="analytics-section-header"><h2>Nutrition Analysis</h2><span class="analytics-note">Rounds with each food compared against rounds without it</span></div>
        ${renderNutritionTable(nutritionRows(filteredRounds))}
      </div>
    </div>
  `;
}

function windSpeedBucketRows(sourceRounds) {
  const buckets = [
    { wind: "0-10", min: 0, max: 10 },
    { wind: "10-20", min: 10, max: 20 },
    { wind: "20+", min: 20, max: Infinity }
  ];
  return buckets.map((bucket) => {
    const matching = sourceRounds.filter((round) => inBucket(normalizeRoundContext(round.context).windSpeed, bucket));
    return {
      wind: bucket.wind,
      rounds: matching.length,
      score: matching.length ? average(matching.map(adjustedRoundScore)).toFixed(1) : "—"
    };
  });
}

function nutritionRows(sourceRounds) {
  const foods = new Map();
  sourceRounds.forEach((round) => {
    normalizeRoundContext(round.context).food.forEach((entry) => {
      const key = entry.name.trim().toLowerCase();
      if (!key) return;
      if (!foods.has(key)) foods.set(key, entry.name.trim());
    });
  });
  return Array.from(foods.entries()).map(([key, label]) => {
    const withFood = sourceRounds.filter((round) => normalizeRoundContext(round.context).food.some((entry) => entry.name.trim().toLowerCase() === key));
    const withoutFood = sourceRounds.filter((round) => !normalizeRoundContext(round.context).food.some((entry) => entry.name.trim().toLowerCase() === key));
    return {
      food: label,
      withRounds: withFood.length,
      withAvg: withFood.length ? average(withFood.map(adjustedRoundScore)).toFixed(1) : "—",
      withoutAvg: withoutFood.length ? average(withoutFood.map(adjustedRoundScore)).toFixed(1) : "—"
    };
  }).sort((a, b) => Number(a.withAvg) - Number(b.withAvg));
}

function renderNutritionTable(rows) {
  if (!rows.length) return `<p class="analytics-note">No food data logged yet.</p>`;
  return renderSimpleTable(
    ["Food", "Rounds with", "With avg", "Without avg"],
    rows.map((row) => [row.food, row.withRounds, row.withAvg, row.withoutAvg])
  );
}

function renderExpandedTrends(filteredRounds, roundMetrics) {
  const rollingScore = rollingAverage(roundMetrics.map((item) => item.score), 3);
  const rollingGir = rollingAverage(roundMetrics.map((item) => item.girPct), 5);
  const rollingFir = rollingAverage(roundMetrics.map((item) => item.firPct), 5);
  const rollingPutts = rollingAverage(roundMetrics.map((item) => item.puttsTotal), 5);
  const handicapLedger = calculateHandicapLedger(filteredRounds);
  const rollingHandicap = handicapLedger.map((item) => item.handicapIndex);
  const rollingDoubleBogeys = rollingAverage(roundMetrics.map((item) => item.doubleBogeyPlus), 5);
  const rollingPenalties = rollingAverage(roundMetrics.map((item) => item.penaltiesTotal), 5);
  const rollingBirdies = rollingAverage(filteredRounds.map(birdieCount), 5);
  const rollingConsistency = rollingConsistencySeries(roundMetrics.map((item) => item.score), 5);
  const recentDelta = compareRecentVsPrevious(roundMetrics);
  const labels = filteredRounds.map((round) => round.date);
  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="analytics-page-title">
        <p class="eyebrow">${filterLabel()}</p>
        <h2>Trends</h2>
      </div>
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
      <div class="chart-panel"><div class="analytics-section-header"><h2>Rolling Handicap Trend</h2><span class="analytics-note">Handicap index by round</span></div><div class="chart-wrap"><canvas id="analyticsTrendHandicap"></canvas></div></div>
      <div class="chart-panel"><div class="analytics-section-header"><h2>Rolling Mistake Trends</h2><span class="analytics-note">Double bogeys and penalties</span></div><div class="chart-wrap"><canvas id="analyticsTrendMistakes"></canvas></div></div>
      <div class="chart-panel"><div class="analytics-section-header"><h2>Rolling Birdie Trend</h2><span class="analytics-note">5-round rolling birdies per round</span></div><div class="chart-wrap"><canvas id="analyticsTrendBirdies"></canvas></div></div>
      <div class="chart-panel"><div class="analytics-section-header"><h2>Rolling Consistency Trend</h2><span class="analytics-note">5-round scoring standard deviation</span></div><div class="chart-wrap"><canvas id="analyticsTrendConsistency"></canvas></div></div>
    </div>
  `;
  drawMultiLineChart("analyticsTrendScore", labels, [{ label: "Score", data: rollingScore, color: "#041d4d" }], "Score");
  drawMultiLineChart("analyticsTrendSkills", labels, [
    { label: "GIR %", data: rollingGir, color: "#63d11f" },
    { label: "FIR %", data: rollingFir, color: "#041d4d" },
    { label: "Putts", data: rollingPutts, color: "#8aa2d3" }
  ], "Rolling");
  drawMultiLineChart("analyticsTrendHandicap", labels, [{ label: "Handicap", data: rollingHandicap, color: "#041d4d" }], "Index");
  drawMultiLineChart("analyticsTrendMistakes", labels, [
    { label: "Double bogey+", data: rollingDoubleBogeys, color: "#d48f3f" },
    { label: "Penalties", data: rollingPenalties, color: "#c24c4c" }
  ], "Per round");
  drawMultiLineChart("analyticsTrendBirdies", labels, [{ label: "Birdies", data: rollingBirdies, color: "#63d11f" }], "Birdies");
  drawMultiLineChart("analyticsTrendConsistency", labels, [{ label: "Std dev", data: rollingConsistency, color: "#8aa2d3" }], "Std dev");
}

function rollingConsistencySeries(scores, windowSize) {
  return scores.map((_, index) => standardDeviation(scores.slice(Math.max(0, index - windowSize + 1), index + 1)));
}

function birdieCount(round) {
  return round.holes.map(normalizeHole).filter((hole) => hole.score !== null && hole.score < hole.par).length * roundEighteenHoleScale(round);
}

function renderPracticePriorities(filteredRounds) {
  const priorities = practicePriorityRows(filteredRounds).slice(0, 5);
  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="analytics-page-title">
        <p class="eyebrow">${filterLabel()}</p>
        <h2>Practice Priorities</h2>
        <p class="analytics-note">Automatically ranked by estimated scoring upside, sample size, and how much worse the pattern is than a reasonable target.</p>
      </div>
      <div class="panel">
        <div class="analytics-section-header">
          <h2>Highest Return Practice Areas</h2>
          <span class="analytics-note">Estimated gain is a directional guide, not a formal strokes-gained model</span>
        </div>
        ${renderPracticePriorityList(priorities)}
      </div>
    </div>
  `;
}

function practicePriorityRows(sourceRounds) {
  return [
    ...approachPracticePriorities(sourceRounds),
    lagPuttPracticePriority(sourceRounds),
    driverRightPracticePriority(sourceRounds),
    penaltyPracticePriority(sourceRounds),
    bunkerPracticePriority(sourceRounds),
    scramblingPracticePriority(sourceRounds)
  ]
    .filter(Boolean)
    .sort((a, b) => b.gain - a.gain);
}

function approachPracticePriorities(sourceRounds) {
  const buckets = [
    { label: "0-50y", min: 0, max: 50, targetGir: 70 },
    { label: "50-100y", min: 50, max: 100, targetGir: 58 },
    { label: "100-150y", min: 100, max: 150, targetGir: 42 },
    { label: "150-200y", min: 150, max: 200, targetGir: 28 },
    { label: "200y+", min: 200, max: Infinity, targetGir: 18 }
  ];
  const holes = approachHoles(sourceRounds).filter((hole) => Number.isFinite(hole.approachDistance) && hole.gir !== null);
  return buckets.map((bucket) => {
    const bucketHoles = holes.filter((hole) => inBucket(hole.approachDistance, bucket));
    if (bucketHoles.length < 5) return null;
    const girPct = pct(bucketHoles.filter((hole) => hole.gir).length, bucketHoles.length);
    const missPct = 100 - girPct;
    const avgScore = average(bucketHoles.map((hole) => hole.score));
    const attemptsPerRound = bucketHoles.length / Math.max(sourceRounds.length, 1);
    const gap = Math.max(0, bucket.targetGir - girPct);
    const gain = roundToTenth(attemptsPerRound * (gap / 100) * 0.65);
    if (gain < 0.2) return null;
    return {
      title: `Approach shots ${bucket.label}`,
      detail: `You miss ${missPct}% of greens and average ${avgScore.toFixed(1)} on these holes.`,
      gain
    };
  }).filter(Boolean);
}

function lagPuttPracticePriority(sourceRounds) {
  const holes = puttingHoles(sourceRounds).filter((hole) => Number.isFinite(hole.puttDistances?.[0]) && hole.puttDistances[0] >= 20);
  if (holes.length < 5) return null;
  const threePuttPct = pct(holes.filter((hole) => hole.putts >= 3).length, holes.length);
  const attemptsPerRound = holes.length / Math.max(sourceRounds.length, 1);
  const gain = roundToTenth(attemptsPerRound * Math.max(0, threePuttPct - 12) / 100);
  if (gain < 0.2) return null;
  return {
    title: "3-putts from 20ft+",
    detail: `You 3-putt ${threePuttPct}% of the time from long range.`,
    gain
  };
}

function driverRightPracticePriority(sourceRounds) {
  const holes = drivingHoles(sourceRounds).filter((hole) => hole.teeClub === "Driver" || !hole.teeClub);
  const misses = holes.filter((hole) => hole.fairway === false || hole.fairwayMiss);
  if (misses.length < 5) return null;
  const rightMisses = misses.filter((hole) => findPrimaryMiss(hole.fairwayMiss) === "right");
  const rightPct = pct(rightMisses.length, misses.length);
  const rightAvg = average(rightMisses.map((hole) => hole.score - hole.par));
  const otherAvg = average(misses.filter((hole) => findPrimaryMiss(hole.fairwayMiss) !== "right").map((hole) => hole.score - hole.par));
  const cost = Math.max(0, rightAvg - otherAvg);
  const rightPerRound = rightMisses.length / Math.max(sourceRounds.length, 1);
  const gain = roundToTenth(rightPerRound * Math.max(0.25, cost) * 0.5);
  if (gain < 0.2 || rightPct < 35) return null;
  return {
    title: "Driver misses right",
    detail: `${rightPct}% of driver misses are right and cost about ${cost.toFixed(1)} shots each.`,
    gain
  };
}

function penaltyPracticePriority(sourceRounds) {
  const penaltyTotal = allScoredHoles(sourceRounds).reduce((sum, hole) => sum + (hole.penaltyStrokes || 0), 0);
  const perRound = penaltyTotal / Math.max(sourceRounds.length, 1);
  const gain = roundToTenth(Math.max(0, perRound - 0.5));
  if (gain < 0.2) return null;
  return {
    title: "Penalty avoidance",
    detail: `You average ${perRound.toFixed(1)} penalty strokes per round.`,
    gain
  };
}

function bunkerPracticePriority(sourceRounds) {
  const sand = sandSaveStats(sourceRounds);
  if (sand.bunkerHoles < 5 || sand.savePct >= 35) return null;
  const bunkerPerRound = sand.bunkerHoles / Math.max(sourceRounds.length, 1);
  const gain = roundToTenth(bunkerPerRound * ((35 - sand.savePct) / 100) * 0.7);
  if (gain < 0.2) return null;
  return {
    title: "Greenside bunker saves",
    detail: `You save par ${sand.savePct}% of the time from greenside bunkers.`,
    gain
  };
}

function scramblingPracticePriority(sourceRounds) {
  const missed = missedGirHoles(sourceRounds);
  if (missed.length < 8) return null;
  const scramblePct = pct(missed.filter(isScrambleSuccess).length, missed.length);
  const missedPerRound = missed.length / Math.max(sourceRounds.length, 1);
  const gain = roundToTenth(missedPerRound * Math.max(0, 35 - scramblePct) / 100 * 0.55);
  if (gain < 0.2) return null;
  return {
    title: "Missed-GIR recovery",
    detail: `You scramble ${scramblePct}% after missed greens.`,
    gain
  };
}

function renderPracticePriorityList(rows) {
  if (!rows.length) return `<p class="analytics-note">Not enough logged patterns yet. Keep recording club, approach, putting, penalty, and bunker data.</p>`;
  return `
    <ol class="practice-priority-list">
      ${rows.map((row) => `
        <li>
          <strong>${escapeHtml(row.title)}</strong>
          <span>${escapeHtml(row.detail)}</span>
          <em>Potential gain: ${row.gain.toFixed(1)} shots/round.</em>
        </li>
      `).join("")}
    </ol>
  `;
}

function scoringDistributionRows(roundMetrics) {
  const scores = roundMetrics.map((item) => item.score).filter(Number.isFinite);
  if (!scores.length) return [];
  const minBand = Math.floor(Math.min(...scores) / 5) * 5;
  const maxBand = Math.floor(Math.max(...scores) / 5) * 5;
  const rows = [];
  for (let start = minBand; start <= maxBand; start += 5) {
    const end = start + 4;
    rows.push({
      label: `${start}-${end}`,
      rounds: scores.filter((score) => score >= start && score <= end).length
    });
  }
  return rows;
}

function renderScoringDistributionTable(rows) {
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Score Band</th><th>Rounds</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${row.label}</td><td>${row.rounds}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function roundConsistencyStats(roundMetrics) {
  const scores = roundMetrics.map((item) => item.score).filter(Number.isFinite);
  const avg = average(scores);
  const deviation = standardDeviation(scores);
  return {
    average: avg.toFixed(1),
    standardDeviation: deviation.toFixed(1),
    label: deviation <= 2.5 ? "Very consistent" : deviation <= 4.5 ? "Consistent" : deviation <= 6.5 ? "Variable" : "Volatile"
  };
}

function frontBackSplitStats(sourceRounds) {
  const frontRows = [];
  const backRows = [];
  sourceRounds.forEach((round) => {
    const holes = round.holes.map(normalizeHole).filter((hole) => hole.score !== null);
    const front = holes.filter((hole) => hole.hole <= 9);
    const back = holes.filter((hole) => hole.hole >= 10);
    if (front.length) frontRows.push(splitMetrics(front));
    if (back.length) backRows.push(splitMetrics(back));
  });
  return {
    front: summarizeSplitRows(frontRows),
    back: summarizeSplitRows(backRows)
  };
}

function splitMetrics(holes) {
  const girHoles = holes.filter((hole) => hole.gir !== null);
  const puttHoles = holes.filter((hole) => hole.putts !== null);
  return {
    score: sum(holes.map((hole) => hole.score)),
    girPct: pct(girHoles.filter((hole) => hole.gir).length, girHoles.length),
    putts: sum(puttHoles.map((hole) => hole.putts))
  };
}

function summarizeSplitRows(rows) {
  return {
    score: rows.length ? average(rows.map((row) => row.score)).toFixed(1) : "—",
    girPct: rows.length ? `${Math.round(average(rows.map((row) => row.girPct)))}%` : "—",
    putts: rows.length ? average(rows.map((row) => row.putts)).toFixed(1) : "—"
  };
}

function renderFrontBackTable(frontBack) {
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>Metric</th><th>Front</th><th>Back</th></tr></thead>
        <tbody>
          <tr><td>Score</td><td>${frontBack.front.score}</td><td>${frontBack.back.score}</td></tr>
          <tr><td>GIR</td><td>${frontBack.front.girPct}</td><td>${frontBack.back.girPct}</td></tr>
          <tr><td>Putts</td><td>${frontBack.front.putts}</td><td>${frontBack.back.putts}</td></tr>
        </tbody>
      </table>
    </div>
  `;
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
          ["Fairway Bunker/Round", average(roundMetrics.map((item) => item.fairwayBunkerTotal)).toFixed(1)],
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
    { label: "Fairway bunker", data: roundMetrics.map((item) => item.fairwayBunkerTotal), color: "#63d11f" },
    { label: "Greenside bunker", data: roundMetrics.map((item) => item.bunkerTotal), color: "#8aa2d3" },
    { label: "Penalties", data: roundMetrics.map((item) => item.penaltiesTotal), color: "#d48f3f" }
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
          ["Total Putts", sum(roundMetrics.map((item) => item.actualPuttsTotal))],
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

function renderAnalyticsConditions(filteredRounds, roundMetrics) {
  const windRows = roundMetrics.filter((item) => Number.isFinite(item.windSpeed));
  const windCoeff = correl(windRows.map((item) => item.windSpeed), windRows.map((item) => item.score));
  el.analyticsContent.innerHTML = `
    <div class="analytics-stack">
      <div class="stats-grid">
        ${renderStatCards([
          ["Rounds with weather", filteredRounds.filter((round) => normalizeRoundContext(round.context).weather).length],
          ["Rounds with wind", windRows.length],
          ["Avg wind speed", windRows.length ? `${average(windRows.map((item) => item.windSpeed)).toFixed(1)} mph` : "0.0 mph"],
          ["Wind/score CORREL", Number.isFinite(windCoeff) ? windCoeff.toFixed(2) : "0.00"]
        ])}
      </div>
      <div class="panel"><div class="analytics-section-header"><h2>Weather vs Score</h2><span class="analytics-note">Average adjusted score by weather</span></div>${renderContextGroupTable(groupRoundsByContext(filteredRounds, "weather"), "Weather")}</div>
      <div class="panel"><div class="analytics-section-header"><h2>Wind Direction vs Score</h2><span class="analytics-note">Average adjusted score by wind direction</span></div>${renderContextGroupTable(groupRoundsByContext(filteredRounds, "windDirection"), "Direction")}</div>
      <div class="panel"><div class="analytics-section-header"><h2>Food vs Score</h2><span class="analytics-note">Average adjusted score when food was logged</span></div>${renderContextGroupTable(groupRoundsByFood(filteredRounds), "Food")}</div>
    </div>
  `;
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
  const countingRoundIds = currentCountingRoundIds(rounds);
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
    .map((round) => {
      const handicap = calculateScoreDifferential(round);
      return `
      <article class="round-card${countingRoundIds.has(round.id) ? " is-counting-handicap" : ""}">
        <div class="round-status-badges">
          ${countingRoundIds.has(round.id) ? `<span class="round-status-badge counting-handicap-badge" title="Counting handicap round">✓</span>` : ""}
          ${round.excludeFromHandicap ? `<span class="round-status-badge excluded-handicap-badge" title="Excluded from handicap">⚑</span>` : ""}
          ${round.excludeFromAnalysis ? `<span class="round-status-badge excluded-analysis-badge" title="Excluded from analysis">⚑</span>` : ""}
        </div>
        <header>
          <div>
            <h2>${roundDisplayName(round)}</h2>
            <p>${round.date}</p>
          </div>
          <strong>${formatRelative(totalScore(round), totalPar(round))}</strong>
        </header>
        <p class="round-summary">${totalScore(round)} shots · ${sumKnownPutts(round)} putts · ${girCount(round)} GIR · Diff ${formatDifferential(handicap.differential)}</p>
        <div class="card-actions">
          <button class="secondary-action" type="button" data-view-round="${round.id}">View</button>
          <button class="secondary-action" type="button" data-view-round-stats="${round.id}">View stats</button>
          <div class="card-menu-anchor">
            <button class="card-menu-button" type="button" data-round-menu="${round.id}" aria-label="Round options">...</button>
            <div class="card-menu${openRoundCardMenuId === round.id ? "" : " hidden"}">
              <button class="card-menu-item" type="button" data-export-round="${round.id}">Export round</button>
              <button class="card-menu-item" type="button" data-toggle-analysis-exclusion="${round.id}">${round.excludeFromAnalysis ? "Include in analysis" : "Exclude from analysis"}</button>
              <button class="card-menu-item" type="button" data-toggle-handicap-exclusion="${round.id}">${round.excludeFromHandicap ? "Include in handicap" : "Exclude from handicap"}</button>
              <button class="card-menu-item" type="button" data-edit="${round.id}">Edit</button>
              <button class="card-menu-item hole-menu-item-danger" type="button" data-delete="${round.id}">Delete</button>
            </div>
          </div>
        </div>
      </article>
    `;
    })
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
  document.querySelectorAll("[data-export-round]").forEach((button) => button.addEventListener("click", () => exportOneRound(button.dataset.exportRound)));
  document.querySelectorAll("[data-toggle-analysis-exclusion]").forEach((button) =>
    button.addEventListener("click", () => toggleRoundExclusion(button.dataset.toggleAnalysisExclusion, "analysis"))
  );
  document.querySelectorAll("[data-toggle-handicap-exclusion]").forEach((button) =>
    button.addEventListener("click", () => toggleRoundExclusion(button.dataset.toggleHandicapExclusion, "handicap"))
  );
  document.querySelectorAll("[data-edit]").forEach((button) => button.addEventListener("click", () => editRound(button.dataset.edit)));
  document.querySelectorAll("[data-delete]").forEach((button) => button.addEventListener("click", () => deleteRound(button.dataset.delete)));
}

function toggleRoundExclusion(roundId, type) {
  rounds = rounds.map((round) => {
    if (round.id !== roundId) return round;
    if (type === "analysis") return normalizeRound({ ...round, excludeFromAnalysis: !round.excludeFromAnalysis });
    return normalizeRound({ ...round, excludeFromHandicap: !round.excludeFromHandicap });
  });
  openRoundCardMenuId = null;
  saveRounds();
  renderDashboard();
  renderAnalytics();
  renderRounds();
}

function openRoundDetail(roundId) {
  const round = rounds.find((item) => item.id === roundId);
  if (!round) return;
  const handicap = calculateScoreDifferential(round);
  selectedRoundId = roundId;
  openRoundCardMenuId = null;
  el.roundListSection.classList.add("hidden");
  el.roundDetailSection.classList.remove("hidden");
  el.roundStatsSection.classList.add("hidden");
  el.roundDetailTitle.textContent = roundDisplayName(round);
  el.roundDetailMeta.textContent = `${round.date} · Score differential ${formatDifferential(handicap.differential)} · PCC ${handicap.pcc}`;
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
  const handicap = calculateScoreDifferential(round);
  selectedRoundId = roundId;
  openRoundCardMenuId = null;
  el.roundListSection.classList.add("hidden");
  el.roundDetailSection.classList.add("hidden");
  el.roundStatsSection.classList.remove("hidden");
  el.roundStatsTitle.textContent = `${roundDisplayName(round)} Stats`;
  el.roundStatsMeta.textContent = `${round.date} · Score differential ${formatDifferential(handicap.differential)} · PCC ${handicap.pcc}`;
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
    ["Score differential", formatDifferential(handicap.differential)],
    ["PCC", handicap.pcc],
    ["3-putts", stats.threePutts],
    ["Fairway bunkers", stats.fairwayBunkerTotal],
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
        <td>${displayCellValue(hole.teeClub)}</td>
        <td>${formatFairwayCell(hole)}</td>
        <td>${displayCellValue(hole.approachClub)}</td>
        <td>${formatApproachCell(hole)}</td>
        <td>${formatGirCell(hole)}</td>
        <td>${displayCellValue(hole.putts)}</td>
        <td>${countPuttsByDistance(hole, "over")}</td>
        <td>${countPuttsByDistance(hole, "under")}</td>
        <td>${displayCellValue(hole.chips)}</td>
        <td>${displayCellValue(hole.fairwayBunker)}</td>
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

function drawHorizontalBarChart(id, labels, data, label) {
  if (charts[id]) charts[id].destroy();
  charts[id] = new Chart(document.getElementById(id), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: "#041d4d"
      }]
    },
    options: {
      ...chartOptions(),
      indexAxis: "y",
      scales: {
        x: axisOptions(label),
        y: axisOptions("")
      }
    }
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
  if (analyticsRange === "lastX") return `Last ${analyticsRoundCount} rounds`;
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
    ["Wind speed", "windSpeed"],
    ["Food entries", "foodCount"],
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
  const missKeys = ["overDraw", "pull", "hook", "leftOther", "push", "overFade", "slice", "rightOther", "bigHeavy", "smallHeavy", "shortOther", "long"];
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
  const missKeys = ["overDraw", "pull", "hook", "leftOther", "push", "overFade", "slice", "rightOther", "bigHeavy", "smallHeavy", "shortOther", "long"];
  const colors = {
    hook: "#041d4d",
    overDraw: "#38598b",
    pull: "#5f7fb3",
    leftOther: "#93a8ca",
    push: "#63d11f",
    overFade: "#89df57",
    slice: "#89df57",
    rightOther: "#b6ec9d",
    bigHeavy: "#d48f3f",
    smallHeavy: "#e5ad69",
    shortOther: "#cc5a71",
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
  const sorted = sourceRounds.slice().sort((a, b) => adjustedRoundScore(a) - adjustedRoundScore(b));
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

function groupRoundsByContext(sourceRounds, field) {
  const groups = new Map();
  sourceRounds.forEach((round) => {
    const context = normalizeRoundContext(round.context);
    const key = context[field];
    if (!key) return;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(round);
  });
  return Array.from(groups.entries())
    .map(([label, group]) => ({
      label: formatContextLabel(label),
      rounds: group.length,
      avgScore: average(group.map(adjustedRoundScore)).toFixed(1),
      bestScore: Math.min(...group.map(adjustedRoundScore))
    }))
    .sort((a, b) => Number(a.avgScore) - Number(b.avgScore));
}

function groupRoundsByFood(sourceRounds) {
  const groups = new Map();
  sourceRounds.forEach((round) => {
    normalizeRoundContext(round.context).food.forEach((entry) => {
      if (!entry.name) return;
      const key = entry.name.toLowerCase();
      if (!groups.has(key)) groups.set(key, { label: entry.name, rounds: [] });
      groups.get(key).rounds.push(round);
    });
  });
  return Array.from(groups.values())
    .map((group) => ({
      label: group.label,
      rounds: group.rounds.length,
      avgScore: average(group.rounds.map(adjustedRoundScore)).toFixed(1),
      bestScore: Math.min(...group.rounds.map(adjustedRoundScore))
    }))
    .sort((a, b) => Number(a.avgScore) - Number(b.avgScore));
}

function renderContextGroupTable(rows, label) {
  if (!rows.length) return `<p class="analytics-note">No logged data yet.</p>`;
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr><th>${label}</th><th>Rounds</th><th>Avg score</th><th>Best</th></tr></thead>
        <tbody>${rows.map((row) => `<tr><td>${escapeHtml(row.label)}</td><td>${row.rounds}</td><td>${row.avgScore}</td><td>${row.bestScore}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function renderSimpleTable(headers, rows) {
  if (!rows.length) return `<p class="analytics-note">No data yet.</p>`;
  return `
    <div class="analytics-table-wrap">
      <table class="analytics-table">
        <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function formatContextLabel(value) {
  return String(value || "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function allScoredHoles(sourceRounds) {
  return sourceRounds.flatMap((round) => round.holes.map(normalizeHole)).filter((hole) => hole.score !== null);
}

function signedNumber(value) {
  if (!Number.isFinite(value)) return "0.0";
  const rounded = roundToTenth(value);
  return rounded > 0 ? `+${rounded.toFixed(1)}` : rounded.toFixed(1);
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

function exportOneRound(roundId) {
  const round = rounds.find((item) => item.id === roundId);
  if (!round) return;
  openRoundCardMenuId = null;
  renderRounds();
  const format = askExportFormat();
  if (!format) return;
  exportRoundSet([round], format, `foreball-${slugify(round.course)}-${round.date}`);
}

function exportSelectedRounds() {
  if (!rounds.length) {
    window.alert("No rounds to export yet.");
    return;
  }
  const countValue = el.roundExportCountSelect.value;
  const sortedRounds = rounds.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  const selectedRounds = countValue === "all" ? sortedRounds : sortedRounds.slice(0, Number(countValue));
  const format = askExportFormat();
  if (!format) return;
  const countLabel = countValue === "all" ? "all" : `last-${selectedRounds.length}`;
  exportRoundSet(selectedRounds, format, `foreball-rounds-${countLabel}`);
}

function askExportFormat() {
  const value = window.prompt("Export format? Type csv, json, or txt.", "csv");
  if (value === null) return null;
  const format = value.trim().toLowerCase();
  if (["csv", "json", "txt"].includes(format)) return format;
  window.alert("Please enter csv, json, or txt.");
  return null;
}

function exportRoundSet(sourceRounds, format, baseFilename = "foreball-rounds") {
  const normalizedRounds = sourceRounds.map(normalizeRound);
  const exportRounds = normalizedRounds.map((round) => ({
    ...round,
    handicap: calculateScoreDifferential(round)
  }));
  if (format === "json") {
    download(`${baseFilename}.json`, JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), rounds: exportRounds }, null, 2), "application/json");
    return;
  }
  if (format === "txt") {
    download(`${baseFilename}.txt`, normalizedRounds.map(formatRoundText).join("\n\n---\n\n"), "text/plain");
    return;
  }
  download(`${baseFilename}.csv`, buildRoundsCsv(normalizedRounds), "text/csv");
}

function exportCsv() {
  download("foreball-rounds.csv", buildRoundsCsv(rounds), "text/csv");
}

function buildRoundsCsv(sourceRounds) {
  const header = [
    "roundId",
    "date",
    "course",
    "round_format",
    "excluded_from_analysis",
    "excluded_from_handicap",
    "score_differential",
    "adjusted_gross_score",
    "course_rating",
    "slope_rating",
    "pcc",
    "weather",
    "wind_speed",
    "wind_direction",
    "food",
    "round_notes",
    "hole",
    "tee_club",
    "par",
    "score",
    "pickedUp",
    "fairway",
    "fairwayMiss",
    "gir",
    "approachHit",
    "approachMiss",
    "approachDistance",
    "approach_club",
    "chips",
    "chipTypes",
    "fairwayBunker",
    "greensideBunker",
    "penaltyType",
    "penaltyStrokes",
    "putts",
    "puttDistances"
  ];
  const rows = sourceRounds.flatMap((round) =>
    round.holes.map((hole) => {
      const context = normalizeRoundContext(round.context);
      const handicap = calculateScoreDifferential(round);
      return [
      round.id,
      round.date,
      round.course,
      round.formatLabel,
      Boolean(round.excludeFromAnalysis),
      Boolean(round.excludeFromHandicap),
      handicap.differential,
      handicap.adjustedGrossScore,
      handicap.courseRating,
      handicap.slopeRating,
      handicap.pcc,
      context.weather,
      context.windSpeed,
      context.windDirection,
      context.food.map((entry) => `${entry.name}${entry.holes.length ? ` (${formatHoleList(entry.holes)})` : ""}`).join("|"),
      context.notes,
      hole.hole,
      hole.teeClub,
      hole.par,
      hole.score,
      hole.pickedUp,
      hole.fairway,
      hole.fairwayMiss,
      hole.gir,
      hole.approachHit,
      hole.approachMiss,
      hole.approachDistance,
      hole.approachClub,
      hole.chips,
      (hole.chipTypes || []).join("|"),
      hole.fairwayBunker,
      hole.greensideBunker,
      hole.penaltyType,
      hole.penaltyStrokes,
      hole.putts,
      (hole.puttDistances || []).join("|")
      ];
    })
  );
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

function formatRoundText(round) {
  const context = normalizeRoundContext(round.context);
  const handicap = calculateScoreDifferential(round);
  const lines = [
    `Course: ${roundDisplayName(round)}`,
    `Date: ${round.date}`,
    `Score: ${totalScore(round)} (${formatRelative(totalScore(round), totalPar(round))})`,
    `Par: ${totalPar(round)}`,
    `Excluded from analysis: ${round.excludeFromAnalysis ? "Yes" : "No"}`,
    `Excluded from handicap: ${round.excludeFromHandicap ? "Yes" : "No"}`,
    `Score differential: ${formatDifferential(handicap.differential)}`,
    `Adjusted gross score: ${displayCellValue(handicap.adjustedGrossScore)}`,
    `Course rating: ${displayCellValue(handicap.courseRating)}`,
    `Slope rating: ${displayCellValue(handicap.slopeRating)}`,
    `PCC: ${handicap.pcc}`,
    `Putts: ${sumKnownPutts(round)}`,
    "",
    "Round conditions",
    `Weather: ${context.weather || "-"}`,
    `Wind speed: ${context.windSpeed ?? "-"}${context.windSpeed !== null ? " mph" : ""}`,
    `Wind direction: ${context.windDirection || "-"}`,
    `Food: ${context.food.length ? context.food.map((entry) => `${entry.name}${entry.holes.length ? ` on holes ${formatHoleList(entry.holes)}` : ""}`).join("; ") : "-"}`,
    `Notes: ${context.notes || "-"}`,
    "",
    "Hole-by-hole",
    "Hole | Tee club | Approach club | Par | SI | Length | Score | Putts | Putt distances | Fairway | Approach | GIR | Chips | Fairway bunker | Greenside bunker | Penalties"
  ];
  round.holes.map(normalizeHole).forEach((hole) => {
    lines.push([
      hole.hole,
      displayCellValue(hole.teeClub),
      displayCellValue(hole.approachClub),
      hole.par,
      hole.strokeIndex ?? "-",
      hole.length ? `${hole.length} yds` : "-",
      displayHoleScore(hole),
      displayCellValue(hole.putts),
      hole.puttDistances?.length ? hole.puttDistances.join(", ") : "-",
      formatFairwayCell(hole),
      formatApproachCell(hole),
      formatGirCell(hole),
      displayCellValue(hole.chips),
      displayCellValue(hole.fairwayBunker),
      displayCellValue(hole.greensideBunker),
      displayCellValue(hole.penaltyStrokes)
    ].join(" | "));
  });
  return lines.join("\n");
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
    view === "dashboard" ? "Dashboard" : view === "scorecard" ? "Scorecard" : view === "analytics" ? "Analytics" : view === "profile" ? "Profile" : "Rounds";
  if (view === "dashboard") queueVisibleRender(renderDashboard);
  if (view === "analytics") queueVisibleRender(renderAnalytics);
  if (view === "profile") renderProfile();
  if (view === "rounds") renderRounds();
}

function queueVisibleRender(renderFn) {
  requestAnimationFrame(() => requestAnimationFrame(renderFn));
}

function updateRunningScore() {
  return;
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

function loadProfile() {
  return normalizeProfile(safeLoadJson(STORAGE_KEYS.profile));
}

function saveProfile() {
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}

function flushPersistence() {
  try {
    if (activeRound) persistActiveRound();
    saveRounds();
    saveProfile();
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

function roundEighteenHoleScale(round) {
  return round.holes.length === 9 ? 2 : 1;
}

function adjustedRoundScore(round) {
  return totalScore(round) * roundEighteenHoleScale(round);
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
  return `${roundDisplayName(recent)} · ${recent.date}`;
}

function bestScoreLabel() {
  const scoredRounds = rounds.filter(hasRoundScore);
  if (!scoredRounds.length) return "No score";
  const best = scoredRounds.slice().sort((a, b) => adjustedRoundScore(a) - adjustedRoundScore(b))[0];
  return `${adjustedRoundScore(best)} · ${roundDisplayName(best)}`;
}

function getRoundFormat(formatId) {
  return ROUND_FORMATS[formatId] || ROUND_FORMATS["18"];
}

function inferRoundFormat(round) {
  if (round.formatId && ROUND_FORMATS[round.formatId]) return round.formatId;
  const holes = round.holes || [];
  if (holes.length === 9 && round.course === "North Berwick Children's Course") return "course9";
  if (holes.length === 9 && holes[0]?.hole === 10) return "back9";
  if (holes.length === 9) return "front9";
  return "18";
}

function roundDisplayName(round) {
  const formatId = inferRoundFormat(round);
  const format = getRoundFormat(formatId);
  return formatId === "18" ? round.course : `${round.course} · ${format.label}`;
}

function calculateScoreDifferential(round) {
  if (!hasRoundScore(round)) {
    return {
      differential: null,
      adjustedGrossScore: null,
      courseRating: null,
      slopeRating: null,
      pcc: HANDICAP_PCC
    };
  }
  const scale = roundEighteenHoleScale(round);
  const adjustedGrossScore = totalScore(round) * scale;
  const courseRating = courseRatingForRound(round) * scale;
  const slopeRating = slopeRatingForRound(round);
  const differential = roundToTenth((adjustedGrossScore - courseRating - HANDICAP_PCC) * (113 / slopeRating));
  return {
    differential,
    adjustedGrossScore,
    courseRating,
    slopeRating,
    pcc: HANDICAP_PCC
  };
}

function calculateHandicapLedger(sourceRounds = rounds) {
  const scored = handicapEligibleRounds(sourceRounds)
    .filter(hasRoundScore)
    .map((round, index) => ({ round, index, handicap: calculateScoreDifferential(round) }))
    .filter((item) => item.handicap.differential !== null)
    .sort((a, b) => {
      const dateDiff = new Date(a.round.date) - new Date(b.round.date);
      return dateDiff || a.index - b.index;
    });

  return scored.map((item, index) => {
    const recent = scored.slice(Math.max(0, index - 19), index + 1);
    const handicapIndex = handicapIndexFromDifferentials(recent.map((entry) => entry.handicap.differential));
    const counting = selectedCountingDifferentials(recent);
    return {
      round: item.round,
      differential: item.handicap.differential,
      handicapIndex,
      countingRoundIds: new Set(counting.map((entry) => entry.round.id))
    };
  });
}

function handicapIndexFromDifferentials(differentials) {
  const allowance = handicapAllowanceForCount(differentials.length);
  if (!allowance) return null;
  const selected = differentials.slice().sort((a, b) => a - b).slice(0, allowance.count);
  return roundToTenth(average(selected) + allowance.adjustment);
}

function selectedCountingDifferentials(recentEntries) {
  const allowance = handicapAllowanceForCount(recentEntries.length);
  if (!allowance) return [];
  return recentEntries
    .slice()
    .sort((a, b) => a.handicap.differential - b.handicap.differential)
    .slice(0, allowance.count);
}

function handicapAllowanceForCount(count) {
  return HANDICAP_ALLOWANCES.find((item) => count >= item.min) || null;
}

function currentCountingRoundIds(sourceRounds = rounds) {
  const current = calculateHandicapLedger(sourceRounds).at(-1);
  return current?.countingRoundIds || new Set();
}

function courseRatingForRound(round) {
  const course = COURSES.find((item) => item.name === round.course);
  const total = totalPar(round);
  const formatId = inferRoundFormat(round);
  if (!course) return total;
  if (formatId === "front9") return course.courseRatingFront9 ?? course.courseRating9 ?? total;
  if (formatId === "back9") return course.courseRatingBack9 ?? course.courseRating9 ?? total;
  if (formatId === "course9") return course.courseRating9 ?? course.courseRating ?? total;
  return course.courseRating ?? total;
}

function slopeRatingForRound(round) {
  const course = COURSES.find((item) => item.name === round.course);
  return course?.slopeRating || DEFAULT_SLOPE_RATING;
}

function roundToTenth(value) {
  return Number.isFinite(value) ? Math.round(value * 10) / 10 : null;
}

function formatDifferential(value) {
  return Number.isFinite(value) ? value.toFixed(1) : "—";
}

function formatHandicapIndex(value) {
  return Number.isFinite(value) ? value.toFixed(1) : "Need 3 rounds";
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
    fairwayBunkerTotal: holes.reduce((sum, hole) => sum + (hole.fairwayBunker || 0), 0),
    penaltiesTotal: holes.reduce((sum, hole) => sum + (hole.penaltyStrokes || 0), 0),
    scramblePct: pct(scrambleMade, missedGir.length)
  };
}

function average(values) {
  const clean = values.filter((value) => Number.isFinite(value));
  return clean.length ? clean.reduce((sum, value) => sum + value, 0) / clean.length : 0;
}

function standardDeviation(values) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (!clean.length) return 0;
  const avg = average(clean);
  const variance = average(clean.map((value) => (value - avg) ** 2));
  return Math.sqrt(variance);
}

function inBucket(value, bucket) {
  return typeof value === "number" && value >= bucket.min && value < bucket.max;
}

function csvCell(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function slugify(value) {
  return String(value || "round").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "round";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function registerServiceWorker() {
  const isLocalhost = ["127.0.0.1", "localhost"].includes(window.location.hostname);
  if ("serviceWorker" in navigator && !isLocalhost) {
    navigator.serviceWorker.register("./sw.js");
  }
}

function normalizeRound(round) {
  const formatId = inferRoundFormat(round);
  return {
    ...round,
    formatId,
    formatLabel: getRoundFormat(formatId).label,
    excludeFromAnalysis: Boolean(round.excludeFromAnalysis),
    excludeFromHandicap: Boolean(round.excludeFromHandicap),
    context: normalizeRoundContext(round.context),
    holes: (round.holes || []).map(normalizeHole)
  };
}

function normalizeRoundContext(context = {}) {
  return {
    weather: context.weather || "",
    windSpeed: context.windSpeed === "" || context.windSpeed === null || context.windSpeed === undefined
      ? null
      : Number.isFinite(Number(context.windSpeed)) ? Number(context.windSpeed) : null,
    windDirection: context.windDirection || "",
    food: Array.isArray(context.food)
      ? context.food
          .map((entry) => ({
            name: String(entry.name || "").trim(),
            holes: Array.isArray(entry.holes)
              ? entry.holes.filter((hole) => Number.isInteger(hole) && hole > 0 && hole <= 18)
              : parseHoleList(entry.holes)
          }))
          .filter((entry) => entry.name || entry.holes.length)
      : [],
    notes: context.notes || ""
  };
}

function normalizeProfile(rawProfile) {
  const source = rawProfile && typeof rawProfile === "object" ? rawProfile : {};
  return {
    ...DEFAULT_PROFILE,
    ...source,
    currentHandicap: numberOrNull(source.currentHandicap),
    handicapGoal: numberOrNull(source.handicapGoal),
    handicapGoalDate: source.handicapGoalDate || "",
    handicapGoals: Array.isArray(source.handicapGoals)
      ? source.handicapGoals.map((entry) => ({
          date: entry.date || "",
          currentHandicap: numberOrNull(entry.currentHandicap),
          handicapGoal: numberOrNull(entry.handicapGoal),
          handicapGoalDate: entry.handicapGoalDate || ""
        })).filter((entry) => entry.date)
      : [],
    bag: Array.isArray(source.bag) ? source.bag.filter((club) => typeof club === "string") : [],
    wedges: Array.isArray(source.wedges)
      ? source.wedges.map((wedge) => ({
          id: wedge.id || `wedge_${Date.now()}_${Math.random().toString(16).slice(2)}`,
          name: String(wedge.name || "").trim(),
          loft: numberOrNull(wedge.loft)
        })).filter((wedge) => wedge.name || wedge.loft !== null)
      : [],
    photo: typeof source.photo === "string" ? source.photo : ""
  };
}

function normalizeHole(hole) {
  return {
    ...hole,
    strokeIndex: hole.strokeIndex ?? null,
    length: hole.length ?? null,
    pickedUp: Boolean(hole.pickedUp),
    pickedUpManual: Boolean(hole.pickedUpManual ?? hole.pickedUp),
    teeClub: hole.teeClub ?? hole.clubUsed ?? null,
    fairway: hole.fairway ?? hole.fir ?? null,
    fairwayMiss: hole.fairwayMiss ?? null,
    approachHit: hole.approachHit ?? null,
    approachMiss: hole.approachMiss ?? null,
    approachClub: hole.approachClub ?? null,
    chips: hole.chips ?? null,
    chipsEntryMode: hole.chipsEntryMode ?? (hole.chips !== null && ![1, 2, 3].includes(hole.chips) ? "other" : hole.chips !== null ? "preset" : null),
    chipTypes: hole.chipTypes ?? [],
    fairwayBunker: hole.fairwayBunker ?? null,
    fairwayBunkerEntryMode: hole.fairwayBunkerEntryMode ?? (hole.fairwayBunker !== null && ![1, 2, 3].includes(hole.fairwayBunker) ? "other" : hole.fairwayBunker !== null ? "preset" : null),
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
  if (["overDraw", "pull", "hook", "left", "leftOther"].includes(value)) return "left";
  if (["push", "overFade", "slice", "right", "rightOther"].includes(value)) return "right";
  if (["bigHeavy", "smallHeavy", "heavy", "top", "short", "shortOther"].includes(value)) return "short";
  return "long";
}

function formatMissLabel(value) {
  const labels = {
    overDraw: "Over draw",
    pull: "Pull",
    hook: "Hook",
    left: "Left",
    leftOther: "Other",
    push: "Push",
    overFade: "Over fade",
    slice: "Slice",
    right: "Right",
    rightOther: "Other",
    bigHeavy: "Big heavy",
    smallHeavy: "Small heavy",
    heavy: "Heavy",
    short: "Short",
    shortOther: "Other",
    long: "Long"
  };
  if (labels[value]) return labels[value];
  if (value === "top") return "topped";
  return capitalize(value);
}

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
}
