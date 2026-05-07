const app = document.getElementById('app');
let preferences = {
  major: 'Computer Science',
  semester: 'Fall 2026',
  time: 'Morning (8 AM - 12 PM)',
  days: 'Mon, Tue, Wed, Thu, Fri',
  units: 15,
  online: true,
  waitlist: false
};

const courses = [
  { code: 'CS 151', title: 'Algorithms', units: 3, days: 'Mon, Wed, Fri', time: '9:00 AM - 9:50 AM', risk: 'Low' },
  { code: 'CS 160', title: 'Software Engineering', units: 3, days: 'Tue, Thu', time: '10:00 AM - 11:15 AM', risk: 'Medium' },
  { code: 'CS 146', title: 'Data Structures', units: 3, days: 'Mon, Wed', time: '11:00 AM - 12:15 PM', risk: 'High' },
  { code: 'MATH 241', title: 'Discrete Math', units: 3, days: 'Tue, Thu', time: '9:30 AM - 10:45 AM', risk: 'Low' },
  { code: 'ENG 101', title: 'English Composition', units: 3, days: 'Mon, Wed, Fri', time: '1:00 PM - 1:50 PM', risk: 'Low' }
];
const backups = [
  { code: 'CS 149', title: 'Operating Systems', units: 3, days: 'Tue, Thu', time: '1:00 PM - 2:15 PM', risk: 'Medium' },
  { code: 'CS 130', title: 'Intro to Programming', units: 3, days: 'Mon, Wed', time: '2:00 PM - 3:15 PM', risk: 'Low' }
];

function nav(active='Dashboard') {
  return `<div class="navbar"><div class="logo">🎓 Smart Enroll</div><div class="navlinks"><span>${active}</span><span>Courses</span><span>My Schedule</span><span>Analytics</span><span>🔔</span><span>AS Alex Student ▾</span></div></div>`;
}
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}
function renderLogin() {
  app.innerHTML = `<div class="page"><div class="card login-layout"><section class="login-left"><div class="login-art">🎓</div><h1>Smart Enroll</h1><p><strong>Plan smarter. Enroll better.</strong></p><p>Build optimal schedules, predict course availability, and enroll with confidence.</p></section><section class="login-form"><h2>Welcome Back!</h2><p class="helper">Sign in to your account</p><label>Email</label><input id="email" value="alex.student@university.edu" /><label>Password</label><input id="password" type="password" value="password" /><div class="row" style="justify-content:space-between;margin-top:14px;"><span><input type="checkbox" checked style="width:auto;"> Remember me</span><a>Forgot Password?</a></div><button class="primary" onclick="renderDashboard()">Sign In</button><p style="text-align:center;margin-top:22px;color:var(--muted);">Don't have an account? <b style="color:var(--blue)">Sign up</b></p></section></div></div>`;
}
function renderDashboard() {
  app.innerHTML = `<div class="page">${nav()}<main class="container"><div class="dashboard-hero"><div><p>Welcome back,</p><h1>Alex Student!</h1><p>What would you like to do today?</p></div><div class="hero-illustration">👨‍💻</div></div><div class="action-grid"><div class="card action-card"><div><div class="icon">📅</div><h3>Generate Schedule</h3><p>Build your personalized course schedule with smart recommendations.</p></div><button class="primary" onclick="renderPreferences()">Start Now →</button></div><div class="card action-card"><div><div class="icon">📚</div><h3>View Courses</h3><p>Browse course catalog, check availability, and course details.</p></div><button class="secondary" onclick="toast('Course catalog opened')">Browse Courses →</button></div><div class="card action-card"><div><div class="icon">📊</div><h3>View Analytics</h3><p>See insights about course demand, risk trends, and planning.</p></div><button class="secondary" onclick="toast('Analytics dashboard opened')">View Analytics →</button></div></div><div class="card stats"><div class="stat"><strong>15</strong>Max Units</div><div class="stat"><strong>8</strong>Enrolled Units</div><div class="stat"><strong>3</strong>Courses in Plan</div><div class="stat"><strong style="color:var(--orange)">Medium</strong>Overall Risk</div></div></main></div>`;
}
function renderPreferences() {
  app.innerHTML = `<div class="page">${nav('Dashboard')}<main class="container form-shell"><aside class="card steps"><div class="step active"><span class="step-num">1</span> Preferences</div><div class="step"><span class="step-num">2</span> Review</div><div class="step"><span class="step-num">3</span> Results</div></aside><section class="card form-card"><h1>Generate Your Schedule</h1><p class="helper">Tell us your preferences and we will create the best schedule for you.</p><div class="form-grid"><div><label>Major *</label><select id="major"><option>Computer Science</option><option>Business</option><option>Engineering</option></select></div><div><label>Semester *</label><select id="semester"><option>Fall 2026</option><option>Spring 2027</option></select></div><div><label>Preferred Time</label><select id="time"><option>Morning (8 AM - 12 PM)</option><option>Afternoon (12 PM - 5 PM)</option><option>Evening (5 PM - 9 PM)</option></select></div><div><label>Days Available</label><select id="days"><option>Mon, Tue, Wed, Thu, Fri</option><option>Mon, Wed, Fri</option><option>Tue, Thu</option></select></div><div><label>Max Units</label><input id="units" value="15" /></div></div><div class="toggle-row"><b>Include Online Courses</b><span class="toggle"></span></div><div class="toggle-row"><b>Include Waitlisted Classes</b><span class="toggle" style="background:#cbd5e1"></span></div><button class="orange" style="margin-top:22px;min-width:260px;" onclick="savePrefs()">Generate Schedule →</button></section></main></div>`;
}
function savePrefs() {
  preferences.major = document.getElementById('major').value;
  preferences.semester = document.getElementById('semester').value;
  preferences.time = document.getElementById('time').value;
  preferences.days = document.getElementById('days').value;
  preferences.units = document.getElementById('units').value;
  renderResults();
}
function badge(risk) { return `<span class="badge ${risk.toLowerCase()}">${risk}</span>`; }
function renderResults() {
  app.innerHTML = `<div class="page">${nav('My Schedule')}<main class="container results-layout"><aside class="card sidebar"><h4>Your Preferences</h4><p><b>Major:</b> ${preferences.major}</p><p><b>Semester:</b> ${preferences.semester}</p><p><b>Preferred Time:</b> ${preferences.time}</p><p><b>Max Units:</b> ${preferences.units}</p><div class="card risk-meter"><h4>Overall Risk Level</h4><h2 style="color:var(--orange)">Medium</h2><div class="meter"></div><p>Your schedule has moderate risk of course unavailability.</p></div></aside><section class="card results-card"><h1>Your Recommended Schedule</h1><table><thead><tr><th>Course</th><th>Title</th><th>Units</th><th>Days & Time</th><th>Risk Level</th></tr></thead><tbody>${courses.map(c => `<tr><td><b>${c.code}</b></td><td>${c.title}</td><td>${c.units}</td><td>${c.days}<br>${c.time}</td><td>${badge(c.risk)}</td></tr>`).join('')}</tbody></table><p><b>Total Units:</b> 15</p><h3>Backup Options <small>(if courses are full)</small></h3><table><tbody>${backups.map(c => `<tr><td><b>${c.code}</b></td><td>${c.title}</td><td>${c.units}</td><td>${c.days}<br>${c.time}</td><td>${badge(c.risk)}</td></tr>`).join('')}</tbody></table><div class="actions"><button class="secondary" onclick="renderPreferences()">Modify Preferences</button><button class="primary" onclick="renderConfirmation()">Enroll Now</button></div></section></main></div>`;
}
function renderConfirmation() {
  app.innerHTML = `<div class="page">${nav('My Schedule')}<main class="container"><section class="card confirm"><div class="check">✓</div><h1>Enrollment Successful!</h1><p>You have been successfully enrolled in the following course:</p><div class="success-box"><h2>CS 151 – Algorithms</h2><p>Fall 2026 | 3 Units</p></div><p>✉ A confirmation email has been sent to alex.student@university.edu</p><button class="primary" style="margin-top:20px;min-width:260px;" onclick="renderDashboard()">Back to Dashboard</button></section></main></div>`;
}
renderLogin();
