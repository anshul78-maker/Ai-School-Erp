// Redirect to login if there's no token.
if (!API.token()) location.href = "/login.html";

/* ---------------- icons ---------------- */
const I = {
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 0-2 2z"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  tick:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 12l5 5L20 6"/></svg>',
  spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></svg>',
  trophy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  flame:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3-1 4-2 6s0 4 2 4 3-2 2.5-4C16 10 18 12 18 15a6 6 0 1 1-12 0c0-4 4-5 4-8 0-2-2-3 2-5Z"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/></svg>',
  chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z"/></svg>',
  pause:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
  refresh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2M18 4v5h-5M6 20v-5h5"/></svg>',
  send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12l16-8-6 16-2-6-8-2z"/></svg>'
};

const NAV = [["overview","Overview","home"],["subjects","My subjects","book"],["plan","Study plan","check"],["buddy","Study buddy","spark"],["awards","Achievements","trophy"],["timetable","Timetable","cal"]];

let DATA = null;
const state = { view: "overview" };

const stColor = (s) => s === "strong" ? "var(--teal)" : s === "work" ? "var(--amber)" : "var(--rose)";
const stLabel = (s) => s === "strong" ? "Strong" : s === "work" ? "Needs work" : "Weak";
const initials = (name) => name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

function ring(pct, color, size, sw) {
  size = size || 58; sw = sw || 6;
  const r = (size - sw) / 2, c = 2 * Math.PI * r;
  return '<div class="ring-wrap" style="width:' + size + 'px;height:' + size + 'px">'
    + '<svg width="' + size + '" height="' + size + '"><circle cx="' + size/2 + '" cy="' + size/2 + '" r="' + r + '" fill="none" stroke="#eeedfb" stroke-width="' + sw + '"/>'
    + '<circle class="rc" cx="' + size/2 + '" cy="' + size/2 + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + c.toFixed(1) + '" data-off="' + (c*(1-pct/100)).toFixed(1) + '" transform="rotate(-90 ' + size/2 + ' ' + size/2 + ')"/></svg>'
    + '<div class="mid" style="color:' + color + '">' + pct + '%</div></div>';
}
function sh(ic, txt, bg, col) {
  return '<div class="sec-h"><span class="s-ic" style="background:' + bg + ';color:' + col + '">' + I[ic] + '</span>' + txt + '</div>';
}

/* ---------------- views ---------------- */
const V = {};

V.overview = function () {
  const d = DATA;
  const badge = d.aiEnabled ? '<span class="ai-live">Live AI</span>' : '<span class="ai-off">Offline sample</span>';
  return ''
  + '<div class="hero mb24"><div class="blob a"></div><div class="blob b"></div>'
    + '<div class="hero-row"><div class="hero-ring">'
      + '<svg width="96" height="96"><circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="6"/>'
      + '<circle id="lvlRing" cx="48" cy="48" r="42" fill="none" stroke="#FFD36B" stroke-width="6" stroke-linecap="round" stroke-dasharray="263.9" stroke-dashoffset="263.9" transform="rotate(-90 48 48)"/></svg>'
      + '<div class="face">' + d.level + '</div></div>'
    + '<div><h1>You are on a ' + d.streak + '-day roll, ' + d.name.split(" ")[0] + '</h1>'
      + '<div class="lvl-line">Level ' + d.level + ' · ' + d.xp + ' / ' + d.xpToNext + ' XP to Level ' + (d.level+1) + '</div>'
      + '<div class="xp-bar"><span id="xpFill" data-w="' + Math.round(d.xp/d.xpToNext*100) + '"></span></div></div>'
    + '<div class="hero-cta"><button class="btn-w" onclick="go(\'plan\')">Start today\'s plan ' + I.arrow + '</button>'
      + '<button class="btn-w" style="background:rgba(255,255,255,.16);color:#fff" onclick="go(\'buddy\')">Ask study buddy</button></div>'
    + '</div></div>'
  + '<div class="grid g4 mb24">'
    + '<div class="stat">' + ring(d.overall,'var(--violet)') + '<div><div class="lab">Overall</div><div class="val" data-count="' + d.overall + '" data-suffix="%">0%</div><div class="sub up">tracking up</div></div></div>'
    + '<div class="stat">' + ring(d.attendance,'var(--teal)') + '<div><div class="lab">Attendance</div><div class="val" data-count="' + d.attendance + '" data-suffix="%">0%</div><div class="sub flat">this month</div></div></div>'
    + '<div class="stat">' + ring(Math.round(d.homeworkDone/d.homeworkTotal*100),'var(--sky)') + '<div><div class="lab">Homework</div><div class="val">' + d.homeworkDone + '<span style="font-size:15px;color:var(--muted)">/' + d.homeworkTotal + '</span></div><div class="sub down">' + (d.homeworkTotal-d.homeworkDone) + ' pending</div></div></div>'
    + '<div class="stat">' + ring(Math.round((1-d.rank/d.classSize)*100),'var(--coral)') + '<div><div class="lab">Class rank</div><div class="val">' + d.rank + '<span style="font-size:15px;color:var(--muted)">/' + d.classSize + '</span></div><div class="sub up">keep climbing</div></div></div>'
  + '</div>'
  + '<div class="grid g2 mb24"><div class="ai"><div class="ai-h"><span class="spark">' + I.spark + '</span>Your AI insight this week' + badge + '</div>'
    + '<p id="insightText">' + d.insight + '</p>'
    + '<div style="display:flex;gap:9px;flex-wrap:wrap"><button class="btn-p" onclick="go(\'buddy\')">Get help now ' + I.arrow + '</button>'
    + '<button class="btn-o" id="refreshInsight" onclick="refreshInsight()">' + I.refresh + ' Refresh with AI</button></div></div>'
  + '<div class="card">' + sh('trophy','Performance over the year','var(--coral-soft)','var(--coral)')
    + '<svg viewBox="0 0 520 200" style="width:100%;height:auto;overflow:visible">'
    + [0,25,50,75,100].map((g) => '<line x1="34" y1="' + (20+g*1.4) + '" x2="510" y2="' + (20+g*1.4) + '" stroke="#f0eff8"/>').join('')
    + d.trend.map((p,i) => '<text x="' + (54+i*90) + '" y="182" font-size="11" fill="#8B8AA3" text-anchor="middle" font-weight="600">' + p[0] + '</text>').join('')
    + '<polyline id="trendLine" fill="none" stroke="url(#tg)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="' + d.trend.map((p,i) => (54+i*90) + ',' + (160-(p[1]-55)*3.6)).join(' ') + '"/>'
    + d.trend.map((p,i) => { const x=54+i*90, y=160-(p[1]-55)*3.6; return '<circle cx="' + x + '" cy="' + y + '" r="4.5" fill="#fff" stroke="#6D5CE7" stroke-width="2.5"/><text x="' + x + '" y="' + (y-12) + '" font-size="11" font-weight="700" fill="#1B1930" text-anchor="middle">' + p[1] + '</text>'; }).join('')
    + '<defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7C6BF0"/><stop offset="1" stop-color="#FF6B4A"/></linearGradient></defs></svg></div></div>'
  + '<div class="grid g2 mb24"><div class="card">' + sh('target','Strengths & weak spots','#efeaff','var(--violet)')
    + '<p style="font-size:12.5px;color:var(--muted);margin:-8px 0 8px">Topic by topic — so you know exactly what to practice.</p>'
    + d.skills.map((s) => '<div class="skill"><div class="top"><span>' + s.topic + '</span><span class="st" style="color:' + stColor(s.level) + '">' + stLabel(s.level) + ' · ' + s.score + '%</span></div><div class="trk"><span data-w="' + s.score + '" style="background:' + stColor(s.level) + '"></span></div></div>').join('') + '</div>'
  + '<div class="card">' + sh('cal','Coming up','var(--amber-soft)','var(--amber)')
    + d.exams.map((e) => '<div class="row"><span class="r-ic" style="background:var(--' + e[2] + '-soft);color:var(--' + e[2] + ')">' + I.clock + '</span><div><b>' + e[0] + '</b><small>Get ready in advance</small></div><span class="r-end" style="color:var(--' + e[2] + ')">' + e[1] + '</span></div>').join('')
    + '<button class="btn-o" style="width:100%;margin-top:12px" onclick="go(\'timetable\')">See full timetable</button></div></div>';
};

V.subjects = function () {
  return ''
  + sh('book','My subjects','var(--sky-soft)','var(--sky)')
  + '<p style="font-size:13px;color:var(--muted);margin:-8px 0 18px">Tap a subject to see how you are doing in each topic.</p>'
  + '<div class="grid" style="gap:12px">'
  + DATA.subjects.map((s,i) => '<div class="subj-card" id="subj' + i + '">'
    + '<div class="sh" onclick="document.getElementById(\'subj' + i + '\').classList.toggle(\'open\')">'
    + '<div class="ring-wrap" style="width:48px;height:48px"><svg width="48" height="48"><circle cx="24" cy="24" r="20" fill="none" stroke="#eeedf8" stroke-width="5"/>'
    + '<circle class="rc" cx="24" cy="24" r="20" fill="none" stroke="' + s.color + '" stroke-width="5" stroke-linecap="round" stroke-dasharray="125.6" stroke-dashoffset="125.6" data-off="' + (125.6*(1-s.score/100)).toFixed(1) + '" transform="rotate(-90 24 24)"/></svg>'
    + '<div class="mid" style="font-size:11px;color:' + s.color + '">' + s.score + '</div></div>'
    + '<div><b style="font-size:15px">' + s.name + '</b><br><small style="font-size:12px;color:var(--muted)">Overall ' + s.score + '% · <span class="' + s.dir + '">' + (s.dir==='up'?'▲ improving':'▼ needs care') + '</span></small></div>'
    + '<span class="caret">' + I.chevron + '</span></div>'
    + '<div class="body"><div style="padding-top:16px">'
    + s.topics.map((t) => { const c = t[1]<60?'var(--rose)':t[1]<75?'var(--amber)':'var(--teal)'; return '<div class="skill"><div class="top"><span>' + t[0] + '</span><span class="st" style="color:' + c + '">' + t[1] + '%</span></div><div class="trk"><span data-w="' + t[1] + '" style="background:' + c + '"></span></div></div>'; }).join('')
    + '</div></div></div>').join('') + '</div>';
};

V.plan = function () {
  return ''
  + '<div class="grid g2" style="align-items:start"><div class="card">'
    + sh('check',"Today's study plan",'var(--teal-soft)','var(--teal)')
    + '<p style="font-size:12.5px;color:var(--muted);margin:-8px 0 16px">Built from your weak spots and homework. Finish tasks to earn XP — changes are saved.</p>'
    + '<div id="taskList">' + DATA.tasks.map((t) => '<div class="task ' + (t.done?'done':'') + '" data-id="' + t.id + '" onclick="toggleTask(' + t.id + ')"><div class="check">' + I.tick + '</div><b>' + t.text + '</b><span class="xp">+' + t.xp + ' XP</span></div>').join('') + '</div>'
    + '<div style="margin-top:14px;padding:14px;border-radius:var(--radius-sm);background:var(--panel);display:flex;align-items:center;gap:12px">'
    + '<div style="flex:1"><b style="font-size:13px" id="planMsg"></b><div class="trk" style="margin-top:8px"><span id="planBar" style="background:var(--grad);transition:width .4s"></span></div></div>'
    + '<div style="font-size:13px;font-weight:800;color:var(--violet)" id="planXp"></div></div></div>'
  + '<div class="card timer">' + sh('clock','Focus timer','#efeaff','var(--violet)')
    + '<p style="font-size:12.5px;color:var(--muted);margin:-8px 0 6px">Study in focused 25-minute sprints.</p>'
    + '<div class="tw"><svg width="150" height="150"><circle cx="75" cy="75" r="66" fill="none" stroke="#eeedf8" stroke-width="9"/>'
    + '<circle id="timerRing" cx="75" cy="75" r="66" fill="none" stroke="var(--violet)" stroke-width="9" stroke-linecap="round" stroke-dasharray="414.7" stroke-dashoffset="0" transform="rotate(-90 75 75)"/></svg>'
    + '<div class="tt"><div class="num" id="timerNum">25:00</div><div class="lb" id="timerLb">ready to focus</div></div></div>'
    + '<div class="t-btns"><button class="btn-p" id="timerBtn" onclick="toggleTimer()">' + I.play + ' Start</button><button class="btn-o" onclick="resetTimer()">Reset</button></div>'
    + '<p class="demo">Great for beating distraction — study 25, break 5.</p></div></div>';
};

V.buddy = function () {
  const badge = DATA.aiEnabled ? '<span class="ai-live">Live AI</span>' : '<span class="ai-off">Offline sample</span>';
  return '<div class="card">'
  + '<div class="sec-h"><span class="s-ic" style="background:#efeaff;color:var(--violet)">' + I.spark + '</span>Study buddy' + badge + '</div>'
  + '<p style="font-size:12.5px;color:var(--muted);margin:-8px 0 4px">Ask anything, any time. It explains the concept — it does not just hand you the answer.</p>'
  + '<div class="chips">' + ['How do I balance equations?','Explain geometry theorems','Help with fractions','Give me a quiz'].map((q) => '<button class="qchip" onclick="ask(this.textContent)">' + q + '</button>').join('') + '</div>'
  + '<div class="chat" id="chat"><div class="bub ai">Hi ' + DATA.name.split(" ")[0] + '! I am your study buddy. Chemistry equations are your weak spot right now — want to start there, or ask me anything else?</div></div>'
  + '<div class="composer"><input id="chatInput" placeholder="Type your question…" onkeydown="if(event.key===\'Enter\')ask(this.value)"><button class="btn-p" onclick="ask(document.getElementById(\'chatInput\').value)">' + I.send + '</button></div>'
  + (DATA.aiEnabled ? '' : '<p class="demo">No API key set, so replies are built-in samples. Add ANTHROPIC_API_KEY in .env to make this a live AI tutor.</p>') + '</div>';
};

V.awards = function () {
  const d = DATA;
  return ''
  + '<div class="grid g2 mb24" style="align-items:start"><div class="card">'
    + sh('trophy','Your badges','var(--coral-soft)','var(--coral)')
    + '<div class="badge-grid">' + d.badges.map((b) => '<div class="bg-item ' + (b[4]?'':'locked') + '"><div class="bg-ic" style="background:' + (b[4]?b[3]:'#e9e8f2') + ';color:#fff">' + I[b[2]] + '</div><b>' + b[0] + '</b><small>' + b[1] + '</small></div>').join('') + '</div></div>'
  + '<div class="card">' + sh('flame','Your streak','var(--coral-soft)','var(--coral)')
    + '<div style="font-size:34px;font-weight:800;color:var(--coral);display:flex;align-items:center;gap:8px">' + I.flame + '<span>' + d.streak + ' days</span></div>'
    + '<p style="font-size:12.5px;color:var(--muted);margin:4px 0 16px">Your longest streak yet — do not break it today!</p>'
    + '<div class="week">' + d.week.map((w) => '<div class="day"><div class="dd ' + (w[1]?'hit':'miss') + '">' + (w[1]?I.tick:'') + '</div><small>' + w[0] + '</small></div>').join('') + '</div></div></div>'
  + '<div class="card">' + sh('target','Class leaderboard','#efeaff','var(--violet)')
    + d.leaderboard.map((l) => '<div class="lb-row ' + (l[5]?'you':'') + '"><span class="lb-rank">' + l[0] + '</span><span class="lb-av" style="background:' + l[3] + '">' + l[2] + '</span><b style="flex:1;font-size:13.5px">' + l[1] + (l[5]?' (you)':'') + '</b><span style="font-weight:800;color:var(--violet)">' + l[4] + ' XP</span></div>').join('')
    + '<p class="demo">Ranked by XP earned this month — finish your plan to climb.</p></div>';
};

V.timetable = function () {
  return ''
  + sh('cal',"Today's timetable",'var(--sky-soft)','var(--sky)')
  + '<div class="card">' + DATA.timetable.map((t) => '<div class="row"><span style="width:52px;font-weight:800;font-size:13px;color:var(--muted)">' + t[0] + '</span><span style="width:4px;height:38px;border-radius:20px;background:' + t[3] + ';flex:none"></span><div><b>' + t[1] + '</b><small>' + t[2] + '</small></div></div>').join('') + '</div>';
};

/* ---------------- render + animate ---------------- */
function buildNav() {
  document.getElementById("nav").innerHTML = NAV.map((n) => '<button class="nav-i ' + (n[0]===state.view?'on':'') + '" onclick="go(\'' + n[0] + '\')">' + I[n[2]] + '<span>' + n[1] + '</span></button>').join('');
}
function go(v) { state.view = v; buildNav(); render(); window.scrollTo({ top: 0, behavior: "smooth" }); }
function render() {
  document.getElementById("view").innerHTML = V[state.view]();
  requestAnimationFrame(animateIn);
  if (state.view === "plan") updatePlan();
}
function animateIn() {
  document.querySelectorAll(".rc").forEach((c) => { const off = c.getAttribute("data-off"); setTimeout(() => c.style.transition = "stroke-dashoffset 1.1s cubic-bezier(.2,.7,.2,1)", 20); setTimeout(() => c.style.strokeDashoffset = off, 60); });
  document.querySelectorAll(".trk>span[data-w]").forEach((s) => setTimeout(() => s.style.width = s.getAttribute("data-w") + "%", 60));
  const xp = document.getElementById("xpFill"); if (xp) setTimeout(() => xp.style.width = xp.getAttribute("data-w") + "%", 120);
  const lr = document.getElementById("lvlRing"); if (lr) { const frac = DATA.xp / DATA.xpToNext; lr.style.transition = "stroke-dashoffset 1.2s cubic-bezier(.2,.7,.2,1)"; setTimeout(() => lr.style.strokeDashoffset = 263.9 * (1 - frac), 80); }
  const tl = document.getElementById("trendLine"); if (tl) { const len = tl.getTotalLength(); tl.style.strokeDasharray = len; tl.style.strokeDashoffset = len; tl.getBoundingClientRect(); tl.style.transition = "stroke-dashoffset 1.4s ease"; setTimeout(() => tl.style.strokeDashoffset = 0, 80); }
  document.querySelectorAll("[data-count]").forEach((el) => { const end = +el.getAttribute("data-count"), suf = el.getAttribute("data-suffix") || ""; let s = null; function step(t) { if (!s) s = t; const p = Math.min((t - s) / 900, 1); el.textContent = Math.round(p * end) + suf; if (p < 1) requestAnimationFrame(step); } requestAnimationFrame(step); });
}

/* ---------------- study plan (persisted) ---------------- */
async function toggleTask(id) {
  const el = document.querySelector('#taskList .task[data-id="' + id + '"]');
  const task = DATA.tasks.find((t) => t.id === id);
  const optimistic = task.done ? 0 : 1;      // flip immediately for a snappy feel
  task.done = optimistic;
  if (el) el.classList.toggle("done", !!optimistic);
  updatePlan();
  try {
    const r = await API.post("/api/tasks/" + id + "/toggle", {});
    task.done = r.done;                        // trust the server
    if (el) el.classList.toggle("done", !!r.done);
    updatePlan();
  } catch (e) {
    task.done = task.done ? 0 : 1;             // revert on failure
    if (el) el.classList.toggle("done", !!task.done);
    updatePlan();
  }
}
function updatePlan() {
  const done = DATA.tasks.filter((t) => t.done).length, tot = DATA.tasks.length;
  const xp = DATA.tasks.reduce((a, t) => a + (t.done ? t.xp : 0), 0);
  const bar = document.getElementById("planBar"), msg = document.getElementById("planMsg"), px = document.getElementById("planXp");
  if (bar) { bar.style.width = (done / tot * 100) + "%"; msg.textContent = done === tot ? "All done — amazing work!" : (done + " of " + tot + " done"); px.textContent = "+" + xp + " XP"; }
}

/* ---------------- focus timer ---------------- */
let tLeft = 1500, tRun = false, tInt = null; const TOT = 1500, DASH = 414.7;
function fmt(s) { return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }
function paintTimer() { document.getElementById("timerNum").textContent = fmt(tLeft); document.getElementById("timerRing").style.strokeDashoffset = DASH * (1 - tLeft / TOT); }
function toggleTimer() {
  const btn = document.getElementById("timerBtn"), lb = document.getElementById("timerLb");
  if (tRun) { clearInterval(tInt); tRun = false; btn.innerHTML = I.play + " Start"; lb.textContent = "paused"; return; }
  tRun = true; btn.innerHTML = I.pause + " Pause"; lb.textContent = "stay focused…";
  tInt = setInterval(() => { tLeft--; paintTimer(); if (tLeft <= 0) { clearInterval(tInt); tRun = false; lb.textContent = "done! take a break"; btn.innerHTML = I.play + " Start"; tLeft = TOT; } }, 1000);
}
function resetTimer() { clearInterval(tInt); tRun = false; tLeft = TOT; paintTimer(); const b = document.getElementById("timerBtn"); if (b) b.innerHTML = I.play + " Start"; const lb = document.getElementById("timerLb"); if (lb) lb.textContent = "ready to focus"; }

/* ---------------- study buddy (AI) ---------------- */
async function ask(text) {
  text = (text || "").trim(); if (!text) return;
  const chat = document.getElementById("chat"); const inp = document.getElementById("chatInput"); if (inp) inp.value = "";
  chat.insertAdjacentHTML("beforeend", '<div class="bub me">' + text.replace(/</g, "&lt;") + "</div>");
  const typing = document.createElement("div"); typing.className = "bub ai typing"; typing.textContent = "thinking…";
  chat.appendChild(typing); chat.scrollTop = chat.scrollHeight;
  try {
    const r = await API.post("/api/buddy", { message: text });
    typing.classList.remove("typing"); typing.textContent = r.reply;
  } catch (e) {
    typing.classList.remove("typing"); typing.textContent = "Sorry, I could not reach the tutor just now. Please try again.";
  }
  chat.scrollTop = chat.scrollHeight;
}

/* ---------------- AI insight refresh ---------------- */
async function refreshInsight() {
  const btn = document.getElementById("refreshInsight");
  const txt = document.getElementById("insightText");
  if (btn) { btn.disabled = true; btn.innerHTML = I.refresh + " Thinking…"; }
  try {
    const r = await API.get("/api/insight");
    if (txt) txt.textContent = r.insight;
  } catch (e) { /* keep existing text */ }
  if (btn) { btn.disabled = false; btn.innerHTML = I.refresh + " Refresh with AI"; }
}

/* ---------------- boot ---------------- */
document.getElementById("logout").addEventListener("click", () => { API.clear(); location.href = "/login.html"; });

(async function () {
  const d = new Date();
  document.getElementById("dateline").textContent = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  try {
    DATA = await API.get("/api/dashboard");
  } catch (e) { return; } // api.js already redirected to login on 401
  const first = DATA.name.split(" ")[0];
  const h = d.getHours();
  document.getElementById("greet").textContent = (h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening") + ", " + first;
  document.getElementById("meIni").textContent = initials(DATA.name);
  document.getElementById("meName").textContent = DATA.name;
  document.getElementById("meClass").textContent = DATA.className + " · Roll " + DATA.roll;
  document.getElementById("meLvl").textContent = "Level " + DATA.level;
  document.getElementById("chipStreak").textContent = DATA.streak;
  document.getElementById("chipXp").textContent = DATA.xp;
  document.getElementById("sideMsg").textContent = "You are " + (DATA.xpToNext - DATA.xp) + " XP from Level " + (DATA.level + 1) + ". Finish today's plan to get there faster.";
  buildNav();
  render();
})();
