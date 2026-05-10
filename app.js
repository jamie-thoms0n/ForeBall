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
  firField: document.getElementById("firField"),
  driveField: document.getElementById("driveField"),
  driveDistanceInput: document.getElementById("driveDistanceInput"),
  approachDistanceInput: document.getElementById("approachDistanceInput"),
  puttsInput: document.getElementById("puttsInput"),
  puttDistanceFields: document.getElementById("puttDistanceFields"),
  formError: document.getElementById("formError"),
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

  el.startRoundBtn.addEventListener("click", startRound);
  el.resumeRoundBtn.addEventListener("click", () => showHole());
  el.prevHoleBtn.addEventListener("click", () => {
    saveCurrentHole(false);
    currentHoleIndex = Math.max(0, currentHoleIndex - 1);
    activeRound.currentHoleIndex = currentHoleIndex;
    persistActiveRound();
    showHole();
  });

  document.querySelectorAll("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const current = Number(el.scoreInput.value) || currentHole().par;
      el.scoreInput.value = Math.max(1, current + Number(button.dataset.step));
      saveCurrentHole(false);
      updateRunningScore();
    });
  });

  el.holeForm.addEventListener("input", () => {
    saveCurrentHole(false);
    updateRunningScore();
  });
  el.puttsInput.addEventListener("change", () => {
    syncPuttInputs();
    saveCurrentHole(false);
    updateRunningScore();
  });
  el.holeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const saved = saveCurrentHole(true);
    if (!saved) return;
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
      fir: par === 3 ? null : null,
      gir: null,
      driveDistance: par === 3 ? null : null,
      approachDistance: null,
      approachHit: null,
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
  el.scoreInput.value = hole.score ?? hole.par;
  el.driveDistanceInput.value = hole.driveDistance ?? "";
  el.approachDistanceInput.value = hole.approachDistance ?? "";
  el.puttsInput.value = hole.putts ?? "";
  setRadio("fir", hole.fir);
  setRadio("gir", hole.gir);
  setRadio("approachHit", hole.approachHit);
  el.firField.classList.toggle("hidden", hole.par === 3);
  el.driveField.classList.toggle("hidden", hole.par === 3);
  syncPuttInputs(hole.puttDistances);
  el.prevHoleBtn.disabled = currentHoleIndex === 0;
  el.nextHoleBtn.textContent = currentHoleIndex === 17 ? "Finish round" : "Next hole";
  el.formError.textContent = "";
  updateRunningScore();
}

function saveCurrentHole(validate) {
  if (!activeRound) return false;
  const hole = currentHole();
  const putts = numberOrNull(el.puttsInput.value);
  const puttDistances = Array.from(document.querySelectorAll(".putt-distance-input")).map((input) =>
    numberOrNull(input.value)
  );
  const nextHole = {
    ...hole,
    score: numberOrNull(el.scoreInput.value),
    fir: hole.par === 3 ? null : radioValue("fir"),
    gir: radioValue("gir"),
    driveDistance: hole.par === 3 ? null : numberOrNull(el.driveDistanceInput.value),
    approachDistance: numberOrNull(el.approachDistanceInput.value),
    approachHit: radioValue("approachHit"),
    putts,
    puttDistances
  };

  if (validate) {
    const error = validateHole(nextHole);
    if (error) {
      el.formError.textContent = error;
      return false;
    }
  }

  activeRound.holes[currentHoleIndex] = nextHole;
  activeRound.currentHoleIndex = currentHoleIndex;
  persistActiveRound();
  return true;
}

function validateHole(hole) {
  if (!positiveNumber(hole.score)) return "Enter a score.";
  if (hole.par !== 3 && hole.fir === null) return "Select fairway result.";
  if (hole.gir === null) return "Select GIR result.";
  if (hole.par !== 3 && !positiveNumber(hole.driveDistance)) return "Enter drive distance.";
  if (!positiveNumber(hole.approachDistance)) return "Enter approach distance.";
  if (hole.approachHit === null) return "Select approach result.";
  if (hole.putts === null || hole.putts < 0) return "Select putts.";
  if (hole.puttDistances.length !== hole.putts) return "Enter one distance per putt.";
  if (hole.puttDistances.some((value) => value === null || value < 0)) return "Enter every putt distance.";
  return "";
}

function completeRound() {
  const completed = { ...activeRound };
  delete completed.currentHoleIndex;
  rounds = rounds.filter((round) => round.id !== completed.id).concat(completed);
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
  activeRound = { ...round, currentHoleIndex: 0 };
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

function syncPuttInputs(existing = null) {
  const count = Number(el.puttsInput.value);
  if (!Number.isInteger(count) || count < 0) {
    el.puttDistanceFields.innerHTML = "";
    return;
  }
  const current = existing || Array.from(document.querySelectorAll(".putt-distance-input")).map((input) => input.value);
  el.puttDistanceFields.innerHTML = Array.from({ length: count }, (_, index) => {
    const value = current[index] ?? "";
    return `<div><label for="putt${index}">Putt ${index + 1} ft</label><input id="putt${index}" class="putt-distance-input" type="number" inputmode="numeric" min="0" value="${value}" required></div>`;
  }).join("");
}

function renderAnalytics() {
  const stats = calculateStats(rounds);
  el.statsGrid.innerHTML = [
    ["Rounds", rounds.length],
    ["Scoring Avg", stats.scoringAverage],
    ["FIR", `${stats.firPct}%`],
    ["GIR", `${stats.girPct}%`],
    ["Putts/Round", stats.puttsPerRound],
    ["3-Putt Rate", `${stats.threePuttPct}%`]
  ]
    .map(([label, value]) => `<div class="stat-card"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  drawChart("scoreTrendChart", "line", rounds.map((round) => round.date), rounds.map(totalScore), "Score");
  drawChart("approachChart", "bar", stats.approachBuckets.map((item) => item.label), stats.approachBuckets.map((item) => item.hitPct), "Hit %");
  drawChart("puttChart", "bar", stats.puttBuckets.map((item) => item.label), stats.puttBuckets.map((item) => item.avgPutts), "Avg putts");
  drawScatter(
    "girCorrelationChart",
    rounds.map((round) => ({ x: girCount(round), y: totalScore(round) })),
    "GIR",
    "Score"
  );
  drawScatter(
    "threePuttCorrelationChart",
    rounds.map((round) => ({ x: threePuttCount(round), y: totalScore(round) })),
    "3-putts",
    "Score"
  );
}

function calculateStats(sourceRounds) {
  const holes = sourceRounds.flatMap((round) => round.holes);
  const scores = sourceRounds.map(totalScore);
  const firHoles = holes.filter((hole) => hole.fir !== null);
  const girHoles = holes.filter((hole) => hole.gir !== null);
  const puttTotal = holes.reduce((sum, hole) => sum + (hole.putts || 0), 0);
  const threePutts = holes.filter((hole) => hole.putts >= 3).length;

  return {
    scoringAverage: average(scores).toFixed(1),
    firPct: pct(firHoles.filter((hole) => hole.fir).length, firHoles.length),
    girPct: pct(girHoles.filter((hole) => hole.gir).length, girHoles.length),
    puttsPerRound: sourceRounds.length ? (puttTotal / sourceRounds.length).toFixed(1) : "0.0",
    threePuttPct: pct(threePutts, holes.length),
    approachBuckets: APPROACH_BUCKETS.map((bucket) => {
      const bucketHoles = holes.filter((hole) => inBucket(hole.approachDistance, bucket));
      return { label: bucket.label, hitPct: pct(bucketHoles.filter((hole) => hole.approachHit).length, bucketHoles.length) };
    }),
    puttBuckets: PUTT_BUCKETS.map((bucket) => {
      const bucketHoles = holes.filter((hole) => inBucket(hole.puttDistances?.[0], bucket));
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
        <p>${totalScore(round)} shots · ${round.holes.reduce((sum, hole) => sum + (hole.putts || 0), 0)} putts · ${girCount(round)} GIR</p>
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
        borderColor: "#e5b84b",
        backgroundColor: type === "bar" ? "#54a86a" : "#e5b84b",
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
        borderColor: "#e5b84b",
        backgroundColor: "#54a86a",
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
      legend: { labels: { color: "#f6f1df" } }
    },
    scales: {
      x: axisOptions(""),
      y: axisOptions("")
    }
  };
}

function axisOptions(title) {
  return {
    title: { display: Boolean(title), text: title, color: "#b9c2ad" },
    ticks: { color: "#b9c2ad" },
    grid: { color: "#314237" }
  };
}

function exportJson() {
  download("foreball-rounds.json", JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), rounds }, null, 2), "application/json");
}

function exportCsv() {
  const header = ["roundId", "date", "course", "hole", "par", "score", "fir", "gir", "driveDistance", "approachDistance", "approachHit", "putts", "puttDistances"];
  const rows = rounds.flatMap((round) =>
    round.holes.map((hole) => [
      round.id,
      round.date,
      round.course,
      hole.hole,
      hole.par,
      hole.score,
      hole.fir,
      hole.gir,
      hole.driveDistance,
      hole.approachDistance,
      hole.approachHit,
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
  const round = activeRound;
  if (!round) {
    el.runningScore.textContent = "E";
    return;
  }
  const score = round.holes.reduce((sum, hole) => sum + (hole.score || 0), 0);
  const par = round.holes.reduce((sum, hole) => sum + (hole.score ? hole.par : 0), 0);
  el.runningScore.textContent = formatRelative(score, par);
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
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.rounds) || "[]");
}

function loadActiveRound() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.activeRound) || "null");
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

function positiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function totalScore(round) {
  return round.holes.reduce((sum, hole) => sum + (hole.score || 0), 0);
}

function totalPar(round) {
  return round.holes.reduce((sum, hole) => sum + hole.par, 0);
}

function girCount(round) {
  return round.holes.filter((hole) => hole.gir).length;
}

function threePuttCount(round) {
  return round.holes.filter((hole) => hole.putts >= 3).length;
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
