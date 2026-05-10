const STORAGE_KEYS = {
  rounds: "foreball.rounds.v1",
  activeRound: "foreball.activeRound.v1",
  meta: "foreball.meta.v1"
};

const COURSES = [
  { name: "North Berwick", pars: [4, 4, 4, 4, 4, 3, 4, 4, 5, 4, 3, 5, 4, 4, 3, 4, 4, 4] },
  { name: "Gullane 1", pars: [4, 4, 4, 5, 3, 4, 4, 4, 4, 4, 3, 4, 5, 4, 4, 4, 3, 4] },
  { name: "Gullane 2", pars: [4, 4, 3, 4, 5, 4, 4, 3, 4, 4, 4, 5, 3, 4, 4, 4, 4, 4] },
  { name: "Muirfield", pars: [4, 4, 4, 3, 5, 4, 3, 4, 5, 4, 4, 4, 3, 4, 4, 4, 5, 4] },
  { name: "Gosforth", pars: [4, 4, 3, 4, 4, 5, 4, 3, 4, 4, 5, 4, 3, 4, 4, 4, 3, 4] }
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

const el = {
  screenTitle: document.getElementById("screenTitle"),
  runningScore: document.getElementById("runningScore"),
  courseSelect: document.getElementById("courseSelect"),
  startPanel: document.getElementById("startPanel"),
  startRoundBtn: document.getElementById("startRoundBtn"),
  resumeRoundBtn: document.getElementById("resumeRoundBtn"),
  holeForm: document.getElementById("holeForm"),
  courseName: document.getElementById("courseName"),
  holeTitle: document.getElementById("holeTitle"),
  holePar: document.getElementById("holePar"),
  scoreInput: document.getElementById("scoreInput"),
  pickedUpInput: document.getElementById("pickedUpInput"),
  pickedUpValue: document.getElementById("pickedUpValue"),
  fairwayField: document.getElementById("fairwayField"),
  fairwaySummary: document.getElementById("fairwaySummary"),
  fairwayFollowup: document.getElementById("fairwayFollowup"),
  approachDistanceInput: document.getElementById("approachDistanceInput"),
  approachSummary: document.getElementById("approachSummary"),
  approachFollowup: document.getElementById("approachFollowup"),
  puttChoiceButtons: Array.from(document.querySelectorAll(".putt-choice")),
  otherPuttsWrap: document.getElementById("otherPuttsWrap"),
  otherPuttsSelect: document.getElementById("otherPuttsSelect"),
  puttDistanceFields: document.getElementById("puttDistanceFields"),
  penaltyButtons: Array.from(document.querySelectorAll(".penalty-button")),
  otherPenaltyWrap: document.getElementById("otherPenaltyWrap"),
  otherPenaltySelect: document.getElementById("otherPenaltySelect"),
  penaltySummary: document.getElementById("penaltySummary"),
  prevHoleBtn: document.getElementById("prevHoleBtn"),
  nextHoleBtn: document.getElementById("nextHoleBtn"),
  statsGrid: document.getElementById("statsGrid"),
  roundList: document.getElementById("roundList"),
  exportJsonBtn: document.getElementById("exportJsonBtn"),
  exportCsvBtn: document.getElementById("exportCsvBtn")
};

init();

function init() {
  saveMeta();
  populateCourses();
  bindEvents();
  updateResumeButton();
  if (activeRound) showHole();
  renderAnalytics();
  renderRounds();
  registerServiceWorker();
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => setView(tab.dataset.view));
  });

  document.querySelectorAll("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const current = Number(el.scoreInput.value) || currentHole().par;
      el.scoreInput.value = Math.max(1, current + Number(button.dataset.step));
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

  el.startRoundBtn.addEventListener("click", startRound);
  el.resumeRoundBtn.addEventListener("click", showHole);
  el.prevHoleBtn.addEventListener("click", () => {
    saveCurrentHole();
    currentHoleIndex = Math.max(0, currentHoleIndex - 1);
    activeRound.currentHoleIndex = currentHoleIndex;
    persistActiveRound();
    showHole();
  });

  el.pickedUpInput.addEventListener("change", handlePickedUpChange);
  el.holeForm.addEventListener("input", () => {
    saveCurrentHole();
    updateRunningScore();
  });

  el.puttChoiceButtons.forEach((button) => {
    button.addEventListener("click", () => handlePuttChoice(button.dataset.puttChoice));
  });
  el.otherPuttsSelect.addEventListener("change", handleOtherPuttsChange);

  el.penaltyButtons.forEach((button) => {
    button.addEventListener("click", () => handlePenaltySelect(button.dataset.penaltyType));
  });
  el.otherPenaltySelect.addEventListener("change", handleOtherPenaltyChange);

  el.holeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveCurrentHole();
    if (currentHoleIndex === 17) completeRound();
    else {
      currentHoleIndex += 1;
      activeRound.currentHoleIndex = currentHoleIndex;
      persistActiveRound();
      showHole();
    }
  });

  el.exportJsonBtn.addEventListener("click", exportJson);
  el.exportCsvBtn.addEventListener("click", exportCsv);
}

function populateCourses() {
  el.courseSelect.innerHTML = COURSES.map((course) => `<option value="${course.name}">${course.name}</option>`).join("");
}

function startRound() {
  const course = COURSES.find((item) => item.name === el.courseSelect.value);
  activeRound = {
    id: `round_${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    course: course.name,
    currentHoleIndex: 0,
    holes: course.pars.map((par, index) => ({
      hole: index + 1,
      par,
      score: null,
      pickedUp: false,
      fairway: par === 3 ? null : null,
      fairwayMiss: null,
      gir: null,
      approachDistance: null,
      approachHit: null,
      approachMiss: null,
      penaltyType: null,
      penaltyStrokes: null,
      putts: null,
      puttDistances: []
    }))
  };
  currentHoleIndex = 0;
  persistActiveRound();
  showHole();
}

function showHole() {
  if (!activeRound) return;
  const hole = currentHole();
  el.startPanel.classList.add("hidden");
  el.holeForm.classList.remove("hidden");
  el.courseName.textContent = activeRound.course;
  el.holeTitle.textContent = `Hole ${hole.hole}`;
  el.holePar.textContent = `Par ${hole.par}`;
  el.scoreInput.value = hole.score ?? "";
  el.pickedUpInput.checked = Boolean(hole.pickedUp);
  el.pickedUpValue.classList.toggle("hidden", !hole.pickedUp);
  el.approachDistanceInput.value = hole.approachDistance ?? "";
  el.fairwayField.classList.toggle("hidden", hole.par === 3);
  setRadio("gir", hole.gir);
  renderShotUi("fairway", hole.par === 3 ? null : deriveShotState(hole.fairway, hole.fairwayMiss), hole.fairwayMiss);
  renderShotUi("approach", deriveShotState(hole.approachHit, hole.approachMiss), hole.approachMiss);
  renderPuttUi(hole.putts, hole.puttDistances);
  updatePenaltyUi(hole.penaltyType, hole.penaltyStrokes);
  el.prevHoleBtn.disabled = currentHoleIndex === 0;
  el.nextHoleBtn.textContent = currentHoleIndex === 17 ? "Finish round" : "Next hole";
  updateRunningScore();
}

function saveCurrentHole() {
  if (!activeRound) return false;
  const hole = currentHole();
  const putts = hole.putts;
  const puttDistances = Array.from(document.querySelectorAll(".putt-distance-input")).map((input) => numberOrNull(input.value));
  const nextHole = {
    ...hole,
    score: numberOrNull(el.scoreInput.value),
    pickedUp: el.pickedUpInput.checked,
    gir: radioValue("gir"),
    approachDistance: numberOrNull(el.approachDistanceInput.value),
    putts,
    puttDistances: putts === null ? [] : puttDistances.slice(0, putts)
  };
  activeRound.holes[currentHoleIndex] = nextHole;
  activeRound.currentHoleIndex = currentHoleIndex;
  persistActiveRound();
  return true;
}

function completeRound() {
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
  setView("scorecard");
  showHole();
}

function deleteRound(roundId) {
  if (!confirm("Delete this round?")) return;
  rounds = rounds.filter((round) => round.id !== roundId);
  saveRounds();
  renderAnalytics();
  renderRounds();
}

function applyShotSelection(field, value) {
  if (!activeRound) return;
  const hole = currentHole();
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

  const summary = field === "fairway" ? el.fairwaySummary : el.approachSummary;
  const followup = field === "fairway" ? el.fairwayFollowup : el.approachFollowup;
  const hole = currentHole();
  const miss = field === "fairway" ? hole.fairwayMiss : hole.approachMiss;

  if (selected === "hit") {
    summary.textContent = "Hit";
    followup.innerHTML = "";
    followup.classList.add("hidden");
    return;
  }
  if (!selected) {
    summary.textContent = "Not set";
    followup.innerHTML = "";
    followup.classList.add("hidden");
    return;
  }

  summary.textContent = `Miss ${capitalize(selected)}${miss && miss !== selected ? ` · ${formatMissLabel(miss)}` : ""}`;
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

function handlePickedUpChange() {
  if (!activeRound) return;
  const hole = currentHole();
  hole.pickedUp = el.pickedUpInput.checked;
  if (hole.pickedUp) clearHoleValues(hole);
  persistActiveRound();
  showHole();
}

function clearHoleValues(hole) {
  hole.score = null;
  hole.fairway = hole.par === 3 ? null : null;
  hole.fairwayMiss = null;
  hole.gir = null;
  hole.approachDistance = null;
  hole.approachHit = null;
  hole.approachMiss = null;
  hole.putts = null;
  hole.puttDistances = [];
  hole.penaltyType = null;
  hole.penaltyStrokes = null;
}

function handlePuttChoice(choice) {
  if (!activeRound) return;
  const hole = currentHole();
  if (choice === "clear") hole.putts = null;
  else if (choice === "other") hole.putts = numberOrNull(el.otherPuttsSelect.value);
  else hole.putts = Number(choice);
  renderPuttUi(hole.putts, hole.puttDistances);
  persistActiveRound();
}

function handleOtherPuttsChange() {
  if (!activeRound) return;
  const hole = currentHole();
  hole.putts = numberOrNull(el.otherPuttsSelect.value);
  renderPuttUi(hole.putts, hole.puttDistances);
  persistActiveRound();
}

function renderPuttUi(putts, distances = []) {
  el.puttChoiceButtons.forEach((button) => {
    const active = button.dataset.puttChoice === "other" ? putts !== null && ![1, 2, 3].includes(putts) : String(putts) === button.dataset.puttChoice;
    button.classList.toggle("is-active", active);
  });
  el.otherPuttsWrap.classList.toggle("hidden", putts === null || [1, 2, 3].includes(putts));
  el.otherPuttsSelect.value = putts !== null && ![1, 2, 3].includes(putts) ? String(putts) : "";
  const count = Number.isInteger(putts) && putts >= 0 ? putts : 0;
  el.puttDistanceFields.innerHTML = Array.from({ length: count }, (_, index) => {
    const value = distances[index] ?? "";
    return `<div><label for="putt${index}">Putt ${index + 1} ft</label><input id="putt${index}" class="putt-distance-input" type="number" inputmode="numeric" min="0" value="${value}"></div>`;
  }).join("");
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
    return;
  }
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
        <p>${totalScore(round)} shots · ${sumKnownPutts(round)} putts · ${girCount(round)} GIR</p>
        <div class="card-actions">
          <button class="secondary-action" type="button" data-edit="${round.id}">Edit</button>
          <button class="danger-action" type="button" data-delete="${round.id}">Delete</button>
        </div>
      </article>
    `)
    .join("");
  document.querySelectorAll("[data-edit]").forEach((button) => button.addEventListener("click", () => editRound(button.dataset.edit)));
  document.querySelectorAll("[data-delete]").forEach((button) => button.addEventListener("click", () => deleteRound(button.dataset.delete)));
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
        borderColor: "#1f3d7a",
        backgroundColor: type === "bar" ? "#1f3d7a" : "#5f83c3",
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
        borderColor: "#1f3d7a",
        backgroundColor: "#5f83c3",
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
      legend: { labels: { color: "#183153" } }
    },
    scales: {
      x: axisOptions(""),
      y: axisOptions("")
    }
  };
}

function axisOptions(title) {
  return {
    title: { display: Boolean(title), text: title, color: "#38598f" },
    ticks: { color: "#38598f" },
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
  el.screenTitle.textContent = view === "scorecard" ? "Scorecard" : view === "analytics" ? "Analytics" : "Rounds";
  if (view === "analytics") renderAnalytics();
  if (view === "rounds") renderRounds();
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
  localStorage.setItem(STORAGE_KEYS.rounds, JSON.stringify(rounds));
}

function saveMeta() {
  localStorage.setItem(STORAGE_KEYS.meta, JSON.stringify({ courses: COURSES, updatedAt: new Date().toISOString() }));
}

function loadRounds() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.rounds) || "[]").map(normalizeRound);
}

function loadActiveRound() {
  const round = JSON.parse(localStorage.getItem(STORAGE_KEYS.activeRound) || "null");
  return round ? normalizeRound(round) : null;
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

function totalScore(round) {
  return round.holes.reduce((sum, hole) => sum + (hole.score || 0), 0);
}

function totalPar(round) {
  return round.holes.reduce((sum, hole) => sum + (hole.score !== null ? hole.par : 0), 0);
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
  if ("serviceWorker" in navigator) {
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
    pickedUp: Boolean(hole.pickedUp),
    fairway: hole.fairway ?? hole.fir ?? null,
    fairwayMiss: hole.fairwayMiss ?? null,
    approachHit: hole.approachHit ?? null,
    approachMiss: hole.approachMiss ?? null,
    penaltyType: hole.penaltyType ?? null,
    penaltyStrokes: hole.penaltyStrokes ?? null,
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
