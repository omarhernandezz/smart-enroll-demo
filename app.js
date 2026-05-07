const app = document.getElementById('app');

let preferences = {
  major: 'Computer Science',
  semester: 'Fall 2026',
  time: 'Morning (8 AM - 12 PM)',
  days: 'Mon, Tue, Wed, Thu, Fri',
  units: 15,
  online: true,
  waitlist: false,
  desiredCourses: ['CS 151', 'CS 160', 'CS 146']
};

let selectedEnrollment = [];
let selectedPlan = 'primary';

const catalog = [
  { code: 'CS 151', title: 'Algorithms', units: 3, days: 'Mon, Wed, Fri', time: '9:00 AM - 9:50 AM', risk: 'Low', seats: 18, waitlist: 2, required: true },
  { code: 'CS 160', title: 'Software Engineering', units: 3, days: 'Tue, Thu', time: '10:00 AM - 11:15 AM', risk: 'Medium', seats: 7, waitlist: 6, required: true },
  { code: 'CS 146', title: 'Data Structures', units: 3, days: 'Mon, Wed', time: '11:00 AM - 12:15 PM', risk: 'High', seats: 2, waitlist: 18, required: true },
  { code: 'MATH 241', title: 'Discrete Math', units: 3, days: 'Tue, Thu', time: '9:30 AM - 10:45 AM', risk: 'Low', seats: 24, waitlist: 1, required: false },
  { code: 'ENG 101', title: 'English Composition', units: 3, days: 'Mon, Wed, Fri', time: '1:00 PM - 1:50 PM', risk: 'Low', seats: 31, waitlist: 0, required: false },
  { code: 'CS 149', title: 'Operating Systems', units: 3, days: 'Tue, Thu', time: '1:00 PM - 2:15 PM', risk: 'Medium', seats: 8, waitlist: 5, required: false },
  { code: 'CS 130', title: 'Intro to Programming', units: 3, days: 'Mon, Wed', time: '2:00 PM - 3:15 PM', risk: 'Low', seats: 22, waitlist: 0, required: false },
  { code: 'CS 157A', title: 'Database Management', units: 3, days: 'Mon, Wed', time: '3:00 PM - 4:15 PM', risk: 'Medium', seats: 9, waitlist: 4, required: false },
  { code: 'BUS 160', title: 'Business Strategy', units: 3, days: 'Tue, Thu', time: '11:00 AM - 12:15 PM', risk: 'Low', seats: 19, waitlist: 1, required: false },
  { code: 'STAT 95', title: 'Statistics', units: 3, days: 'Mon, Wed', time: '8:00 AM - 9:15 AM', risk: 'Medium', seats: 11, waitlist: 7, required: false }
];

const backupPlans = {
  primary: [
    ['CS 151','CS 160','CS 146','MATH 241','ENG 101']
  ],
  backups: [
    { name: 'Backup Schedule A - Lower Risk CS Option', reason: 'Replaces high-risk CS 146 with CS 130.', codes: ['CS 151','CS 160','CS 130','MATH 241','ENG 101'] },
    { name: 'Backup Schedule B - Alternate Major Requirement', reason: 'Replaces CS 160 with CS 157A if software engineering fills.', codes: ['CS 151','CS 157A','CS 146','MATH 241','ENG 101'] },
    { name: 'Backup Schedule C - Safest Seat Availability', reason: 'Prioritizes lower-risk open sections with the best seat availability.', codes: ['CS 151','CS 130','BUS 160','MATH 241','ENG 101'] }
  ]
};

function getCourse(code) { return catalog.find(c => c.code === code); }
function totalUnits(codes) { return codes.map(getCourse).filter(Boolean).reduce((s,c)=>s+c.units,0); }
function riskPoints(risk) { return risk === 'High' ? 3 : risk === 'Medium' ? 2 : 1; }
function overallRisk(codes) {
  const pts = codes.map(getCourse).filter(Boolean).reduce((s,c)=>s+riskPoints(c.risk),0) / codes.length;
  if (pts >= 2.35) return 'High';
  if (pts >= 1.55) return 'Medium';
  return 'Low';
}

function nav(active='Dashboard') {
  return `<div class="navbar"><div class="logo">🎓 Smart Enroll</div><div class="navlinks"><span class="${active==='Dashboard'?'active-nav':''}">Dashboard</span><span onclick="renderCatalog()">Courses</span><span class="${active==='My Schedule'?'active-nav':''}">My Schedule</span><span>Analytics</span><span>🔔</span><span>AS Alex Student ▾</span></div></div>`;
}
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}
function badge(risk) { return `<span class="badge ${risk.toLowerCase()}">${risk}</span>`; }
function optionList() {
  return catalog.map(c => `<label class="course-check"><input type="checkbox" value="${c.code}" ${preferences.desiredCourses.includes(c.code) ? 'checked' : ''}> <b>${c.code}</b> - ${c.title} ${badge(c.risk)}</label>`).join('');
}
function courseRows(codes, includeCheckbox=false) {
  return codes.map(code => {
    const c = getCourse(code);
    return `<tr>
      ${includeCheckbox ? `<td><input class="enroll-check" type="checkbox" value="${c.code}"></td>` : ''}
      <td><b>${c.code}</b></td><td>${c.title}</td><td>${c.units}</td><td>${c.days}<br>${c.time}</td>
      <td>${c.seats} open<br><small>${c.waitlist} waitlisted</small></td><td>${badge(c.risk)}</td>
    </tr>`;
  }).join('');
}

function renderLogin() {
  app.innerHTML = `<div class="page"><div class="card login-layout"><section class="login-left"><div class="login-art">🎓</div><h1>Smart Enroll</h1><p><strong>Plan smarter. Enroll better.</strong></p><p>Build optimal schedules, predict course availability, and enroll with confidence.</p></section><section class="login-form"><h2>Welcome Back!</h2><p class="helper">Sign in to your account</p><label>Email</label><input id="email" value="alex.student@university.edu" /><label>Password</label><input id="password" type="password" value="password" /><div class="row" style="justify-content:space-between;margin-top:14px;"><span><input type="checkbox" checked style="width:auto;"> Remember me</span><a>Forgot Password?</a></div><button class="primary" onclick="renderDashboard()">Sign In</button><p style="text-align:center;margin-top:22px;color:var(--muted);">Don't have an account? <b style="color:var(--blue)">Sign up</b></p></section></div></div>`;
}
function renderDashboard() {
  app.innerHTML = `<div class="page">${nav('Dashboard')}<main class="container"><div class="dashboard-hero"><div><p>Welcome back,</p><h1>Alex Student!</h1><p>What would you like to do today?</p></div><div class="hero-illustration">👨‍💻</div></div><div class="action-grid"><div class="card action-card"><div><div class="icon">📅</div><h3>Generate Schedule</h3><p>Choose specific classes you are willing to take and get risk-scored primary and backup schedules.</p></div><button class="primary" onclick="renderPreferences()">Start Now →</button></div><div class="card action-card"><div><div class="icon">📚</div><h3>View Courses</h3><p>Browse the course catalog with seat availability and risk analysis.</p></div><button class="secondary" onclick="renderCatalog()">Browse Courses →</button></div><div class="card action-card"><div><div class="icon">📊</div><h3>View Analytics</h3><p>See overall schedule risk and registration trends.</p></div><button class="secondary" onclick="toast('Analytics dashboard opened')">View Analytics →</button></div></div><div class="card stats"><div class="stat"><strong>${preferences.units}</strong>Max Units</div><div class="stat"><strong>${preferences.desiredCourses.length}</strong>Preferred Classes</div><div class="stat"><strong>3</strong>Backup Plans</div><div class="stat"><strong style="color:var(--orange)">Medium</strong>Overall Risk</div></div></main></div>`;
}
function renderCatalog() {
  app.innerHTML = `<div class="page">${nav('Courses')}<main class="container"><section class="card results-card"><h1>Course Catalog + Risk Analysis</h1><p class="helper">Mock catalog data used for prototype demo. Risk is based on open seats, waitlist pressure, and historical demand.</p><table><thead><tr><th>Course</th><th>Title</th><th>Units</th><th>Schedule</th><th>Availability</th><th>Risk</th></tr></thead><tbody>${courseRows(catalog.map(c=>c.code))}</tbody></table><div class="actions"><button class="primary" onclick="renderPreferences()">Use These Courses in Schedule Builder</button></div></section></main></div>`;
}
function renderPreferences() {
  app.innerHTML = `<div class="page">${nav('Dashboard')}<main class="container form-shell"><aside class="card steps"><div class="step active"><span class="step-num">1</span> Preferences</div><div class="step"><span class="step-num">2</span> Class Selection</div><div class="step"><span class="step-num">3</span> Results</div></aside><section class="card form-card"><h1>Generate Your Schedule</h1><p class="helper">Enter preferences and choose specific classes you are willing to take.</p><div class="form-grid"><div><label>Major *</label><select id="major"><option>Computer Science</option><option>Business</option><option>Engineering</option></select></div><div><label>Semester *</label><select id="semester"><option>Fall 2026</option><option>Spring 2027</option></select></div><div><label>Preferred Time</label><select id="time"><option>Morning (8 AM - 12 PM)</option><option>Afternoon (12 PM - 5 PM)</option><option>Evening (5 PM - 9 PM)</option></select></div><div><label>Days Available</label><select id="days"><option>Mon, Tue, Wed, Thu, Fri</option><option>Mon, Wed, Fri</option><option>Tue, Thu</option></select></div><div><label>Max Units</label><input id="units" value="${preferences.units}" /></div></div><h3 style="margin-top:28px;">Specific Classes I Am Willing to Take</h3><p class="helper">Select the exact courses you want Smart Enroll to consider. Each option includes a risk badge.</p><div class="class-picker">${optionList()}</div><div class="toggle-row"><b>Include Online Courses</b><span class="toggle"></span></div><div class="toggle-row"><b>Exclude Waitlisted Classes</b><span class="toggle" style="background:#cbd5e1"></span></div><button class="orange" style="margin-top:22px;min-width:260px;" onclick="savePrefs()">Generate Risk Analysis + Schedules →</button></section></main></div>`;
}
function savePrefs() {
  preferences.major = document.getElementById('major').value;
  preferences.semester = document.getElementById('semester').value;
  preferences.time = document.getElementById('time').value;
  preferences.days = document.getElementById('days').value;
  preferences.units = document.getElementById('units').value;
  const checked = Array.from(document.querySelectorAll('.course-check input:checked')).map(x => x.value);
  if (checked.length < 3) {
    toast('Please select at least 3 classes for a complete schedule.');
    return;
  }
  preferences.desiredCourses = checked;
  renderResults();
}
function primaryCodes() {
  const chosen = preferences.desiredCourses.slice(0, 5);
  const filler = ['MATH 241','ENG 101','CS 130'].filter(c => !chosen.includes(c));
  return [...chosen, ...filler].slice(0,5);
}
function renderPlanCard(plan, i) {
  const risk = overallRisk(plan.codes);
  return `<div class="card backup-plan"><div class="plan-header"><h3>${plan.name}</h3>${badge(risk)}</div><p>${plan.reason}</p><table><thead><tr><th>Course</th><th>Title</th><th>Units</th><th>Schedule</th><th>Availability</th><th>Risk</th></tr></thead><tbody>${courseRows(plan.codes)}</tbody></table><button class="secondary" onclick="useBackup(${i})">Use This Backup Schedule</button></div>`;
}
function renderResults() {
  const pCodes = primaryCodes();
  const risk = overallRisk(pCodes);
  app.innerHTML = `<div class="page">${nav('My Schedule')}<main class="container results-layout"><aside class="card sidebar"><h4>Your Preferences</h4><p><b>Major:</b> ${preferences.major}</p><p><b>Semester:</b> ${preferences.semester}</p><p><b>Preferred Time:</b> ${preferences.time}</p><p><b>Max Units:</b> ${preferences.units}</p><p><b>Selected Classes:</b><br>${preferences.desiredCourses.join(', ')}</p><div class="card risk-meter"><h4>Primary Schedule Risk</h4><h2 class="risk-${risk.toLowerCase()}">${risk}</h2><div class="meter"></div><p>Risk analysis uses seat availability, waitlist count, and demand history.</p></div></aside><section class="card results-card"><h1>Your Recommended Schedule</h1><p class="helper">Primary plan generated from the specific classes you selected.</p><table><thead><tr><th>Course</th><th>Title</th><th>Units</th><th>Days & Time</th><th>Availability</th><th>Risk Level</th></tr></thead><tbody>${courseRows(pCodes)}</tbody></table><p><b>Total Units:</b> ${totalUnits(pCodes)} | <b>Overall Risk:</b> ${badge(risk)}</p><div class="actions"><button class="secondary" onclick="renderPreferences()">Modify Classes</button><button class="primary" onclick="renderEnroll('primary')">Enroll Now</button></div><h2>Full Backup Schedules</h2><p class="helper">If high-risk classes fill up, Smart Enroll recommends complete backup schedules.</p>${backupPlans.backups.map(renderPlanCard).join('')}</section></main></div>`;
}
function useBackup(i) {
  selectedPlan = `backup-${i}`;
  renderEnroll(selectedPlan);
}
function getSelectedCodes(planName) {
  if (planName === 'primary') return primaryCodes();
  const idx = Number(planName.split('-')[1]);
  return backupPlans.backups[idx].codes;
}
function renderEnroll(planName='primary') {
  selectedPlan = planName;
  const codes = getSelectedCodes(planName);
  selectedEnrollment = [...codes];
  const label = planName === 'primary' ? 'Primary Recommended Schedule' : backupPlans.backups[Number(planName.split('-')[1])].name;
  app.innerHTML = `<div class="page">${nav('My Schedule')}<main class="container"><section class="card results-card"><h1>Enroll in Selected Classes</h1><p class="helper">Review the classes below. Use Select All to enroll in the full schedule at once.</p><div class="enroll-toolbar"><label class="select-all"><input id="selectAll" type="checkbox" checked onchange="toggleAllEnroll()"> Select all classes</label><span><b>Plan:</b> ${label}</span></div><table><thead><tr><th>Select</th><th>Course</th><th>Title</th><th>Units</th><th>Days & Time</th><th>Availability</th><th>Risk</th></tr></thead><tbody>${courseRows(codes, true)}</tbody></table><div class="actions"><button class="secondary" onclick="renderResults()">Back to Results</button><button class="primary" onclick="submitEnrollment()">Confirm Enrollment</button></div></section></main></div>`;
  document.querySelectorAll('.enroll-check').forEach(cb => { cb.checked = true; });
}
function toggleAllEnroll() {
  const all = document.getElementById('selectAll').checked;
  document.querySelectorAll('.enroll-check').forEach(cb => cb.checked = all);
}
function submitEnrollment() {
  selectedEnrollment = Array.from(document.querySelectorAll('.enroll-check:checked')).map(x => x.value);
  if (selectedEnrollment.length === 0) {
    toast('Select at least one class before confirming enrollment.');
    return;
  }
  renderConfirmation();
}
function renderConfirmation() {
  const rows = selectedEnrollment.map(getCourse).map(c => `<li><b>${c.code}</b> – ${c.title} (${c.units} units) ${badge(c.risk)}</li>`).join('');
  app.innerHTML = `<div class="page">${nav('My Schedule')}<main class="container"><section class="card confirm"><div class="check">✓</div><h1>Enrollment Request Submitted!</h1><p>Your selected classes were submitted to the University Enrollment System.</p><div class="success-box"><h2>Selected Classes</h2><ul class="confirmation-list">${rows}</ul></div><p>✉ A confirmation email has been sent to alex.student@university.edu</p><button class="primary" style="margin-top:20px;min-width:260px;" onclick="renderDashboard()">Back to Dashboard</button></section></main></div>`;
}
renderLogin();
