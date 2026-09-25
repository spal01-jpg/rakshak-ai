/**
 * Rakshak AI (रक्षक AI) - Main Application Controller
 * Ultra-Premium Tactical Welfare & Mental Resilience Platform
 * Full 6-Screen Architecture Matching Prototype PDF Exactly
 */

class RakshakApp {
  constructor() {
    this.currentView = 'soldier'; // 'soldier' | 'twin' | 'commander' | 'welfare_intervention' | 'privacy_trust' | 'resilience' | 'chat'
    this.currentTheme = 'clean';
    this.selectedLoginRole = 'soldier';
    this.personnelList = [];
    this.activeFilter = 'all';
    this.currentSortKey = 'default';
    this.selectedSoldier = null;
    this.activeSoldierId = 'P-204';
    this.selectedMood = 5; // Default Good
    
    // Tactical Resilience State
    this.isBreathingActive = false;
    this.breathingPhaseIndex = 0;
    this.breathingSecRemaining = 4;
    this.breathingTimerId = null;
    this.pmrCurrentStep = 1;

    // Chart instances
    this.radarChart = null;
    this.twinTrendsChart = null;
    this.cmdUnitLineChart = null;
    this.cmdDonutChart = null;
    this.riskScoreDonutChart = null;

    this.chatbot = null;

    this.init();
  }

  async init() {
    this.bindEvents();
    await this.fetchPersonnel();
    this.initChatbot();
    // Default to Screen 2 if logged in, or Screen 1
  }

  bindEvents() {
    // Auth Tab Switcher
    const tabLogin = document.getElementById('authTabLogin');
    const tabReg = document.getElementById('authTabRegister');
    if (tabLogin && tabReg) {
      tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabReg.classList.remove('active');
      });
      tabReg.addEventListener('click', () => {
        tabReg.classList.add('active');
        tabLogin.classList.remove('active');
      });
    }

    // Modal Close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay && overlay.id !== 'consentModal') {
          overlay.classList.remove('active');
        }
      });
    });
  }

  showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `<i class="fas fa-check-circle" style="color:#10b981;"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================================
  // TOP PROTOTYPE DIRECT SCREEN NAVIGATION (PAGES 1 to 6)
  // ==========================================================
  navigateToPrototypeScreen(pageNum) {
    // Update quick tab buttons
    document.querySelectorAll('.quick-tab-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', (idx + 1) === pageNum);
    });

    if (pageNum === 1) {
      this.logoutToLanding();
    } else {
      document.getElementById('authLandingView').style.display = 'none';
      document.getElementById('mainAppShell').style.display = 'flex';

      const screenMap = {
        2: 'soldier',
        3: 'twin',
        4: 'commander',
        5: 'welfare_intervention',
        6: 'privacy_trust'
      };
      this.navigateToView(screenMap[pageNum] || 'soldier');
    }
  }

  // ==========================================================
  // VIEW NAVIGATION ENGINE
  // ==========================================================
  navigateToView(viewName) {
    this.currentView = viewName;

    // Update sidebar active states
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });

    // Update quick switcher tabs if matching
    const pageMap = {
      'soldier': 2,
      'twin': 3,
      'commander': 4,
      'welfare_intervention': 5,
      'privacy_trust': 6
    };
    if (pageMap[viewName]) {
      document.querySelectorAll('.quick-tab-btn').forEach((btn, idx) => {
        btn.classList.toggle('active', (idx + 1) === pageMap[viewName]);
      });
    }

    // Hide all subviews
    document.querySelectorAll('.app-subview').forEach(view => {
      view.style.display = 'none';
    });

    const targetView = document.getElementById(`view_${viewName}`);
    if (targetView) targetView.style.display = 'block';

    const topbar = document.getElementById('appTopbar');
    const title = document.getElementById('topbarTitle');
    const subtitle = document.getElementById('topbarSubtitle');
    const avatar = document.getElementById('topbarAvatar');

    // Handle view-specific headers and charts
    if (viewName === 'soldier') {
      if (topbar) topbar.style.display = 'flex';
      if (title) title.innerText = "Good Morning, Rajesh 👋";
      if (subtitle) subtitle.innerText = "Take a moment. Your well-being matters.";
      if (avatar) avatar.src = "assets/prototype_avatar_rajesh.png";
    } else if (viewName === 'twin') {
      if (topbar) topbar.style.display = 'none'; // Prototype Screen 3 has its own dedicated top banner
      setTimeout(() => this.initRadarAndTwinCharts(), 50);
    } else if (viewName === 'commander') {
      if (topbar) topbar.style.display = 'flex';
      if (title) title.innerText = "Commander Dashboard";
      if (subtitle) subtitle.innerText = "Unit wellness at a glance. Better decisions. Stronger teams.";
      if (avatar) avatar.src = "assets/prototype_avatar_commander.png";
      setTimeout(() => this.initCommanderCharts(), 50);
    } else if (viewName === 'welfare_intervention') {
      if (topbar) topbar.style.display = 'none'; // Prototype Screen 5 has its own dedicated top banner
    } else if (viewName === 'privacy_trust') {
      if (topbar) topbar.style.display = 'none'; // Prototype Screen 6 has its own dedicated top banner
      setTimeout(() => this.initPrivacyTrustCharts(), 50);
    } else if (viewName === 'resilience') {
      if (topbar) topbar.style.display = 'flex';
      if (title) title.innerText = "Tactical Resilience Center";
      if (subtitle) subtitle.innerText = "4-4-4-4 Box Breathing, Muscle Decompression, & Sleep Hygiene";
    } else if (viewName === 'chat') {
      if (topbar) topbar.style.display = 'flex';
      if (title) title.innerText = "Mitra AI Welfare Companion";
      if (subtitle) subtitle.innerText = "24x7 confidential listening, camaraderie, & crisis safety net";
    }
  }

  // ==========================================================
  // AUTH & LOGIN LOGIC
  // ==========================================================
  selectLoginRole(role, elem) {
    this.selectedLoginRole = role;
    document.querySelectorAll('.role-card-picker').forEach(c => c.classList.remove('active'));
    if (elem) elem.classList.add('active');

    const usernameInput = document.getElementById('loginUsernameInput');
    if (usernameInput) {
      if (role === 'soldier') usernameInput.value = 'P-204 (Rajesh Kumar)';
      else if (role === 'commander') usernameInput.value = 'CMD-01 (Col. Virendra Saxena)';
      else if (role === 'welfare_intervention') usernameInput.value = 'WEL-04 (Maj. Sunita Rao - Welfare HQ)';
      else if (role === 'privacy_trust') usernameInput.value = 'HR-ADMIN (Privacy & Audit Officer)';
    }
  }

  handleAuthLogin() {
    document.getElementById('authLandingView').style.display = 'none';
    document.getElementById('mainAppShell').style.display = 'flex';
    this.navigateToView(this.selectedLoginRole);
    this.showToast(`Logged in successfully as ${this.selectedLoginRole.toUpperCase()}`);
  }

  handleBiometricLogin() {
    this.showToast("Biometric verification verified. Access granted.");
    setTimeout(() => {
      this.handleAuthLogin();
    }, 600);
  }

  togglePasswordVisibility() {
    const input = document.getElementById('loginPasswordInput');
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  }

  logoutToLanding() {
    document.getElementById('mainAppShell').style.display = 'none';
    document.getElementById('authLandingView').style.display = 'flex';
    document.querySelectorAll('.quick-tab-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === 0);
    });
  }

  // ==========================================================
  // SCREEN 2: PERSONNEL WELLNESS CHECK-IN HANDLERS
  // ==========================================================
  selectMood(score, elem) {
    this.selectedMood = score;
    document.querySelectorAll('.mood-option-card').forEach(c => c.classList.remove('active'));
    if (elem) elem.classList.add('active');
  }

  updateSleepDisplay(hours) {
    const valElem = document.getElementById('sleepHoursVal');
    if (valElem) {
      valElem.innerText = `${hours} hrs`;
    }
  }

  updateCharCount(textarea) {
    const label = document.getElementById('charCountLabel');
    if (label) {
      label.innerText = `${textarea.value.length}/200`;
    }
  }

  toggleYesNo(btn, isYes) {
    const group = btn.closest('.yes-no-toggle-group');
    if (group) {
      group.querySelectorAll('.toggle-btn-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  }

  async submitCheckin() {
    const sleep = document.getElementById('sleepRangeInput')?.value || "7.5";
    const note = document.getElementById('checkinNote')?.value || "";

    const moodNames = { 5: 'Good', 3: 'Okay', 2: 'Stressed', 1: 'Exhausted' };
    const moodPillClasses = { 5: 'green', 3: 'yellow', 2: 'red', 1: 'red' };

    const tbody = document.getElementById('recentCheckinsBody');
    if (tbody) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="status-circle ${moodPillClasses[this.selectedMood]}"></span> Today, ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
        <td class="text-right"><span class="badge-status-pill ${moodPillClasses[this.selectedMood]}">${moodNames[this.selectedMood]}</span></td>
      `;
      tbody.insertBefore(tr, tbody.firstChild);
    }

    this.showToast("Check-In Submitted! Your Digital Welfare Twin has been updated.");
  }

  // ==========================================================
  // SCREEN 5: WELFARE INTERVENTION ACTIONS
  // ==========================================================
  scheduleIntervention(pid, actionName) {
    this.showToast(`Action dispatched for ${pid}: "${actionName}"`);
  }

  // ==========================================================
  // SCREEN 6: PRIVACY & TRUST CONSENT HANDLER
  // ==========================================================
  handleConsentToggle(settingName, isChecked) {
    this.showToast(`${settingName} set to: ${isChecked ? 'ENABLED (Air-Gapped)' : 'DISABLED'}`);
  }

  // ==========================================================
  // EXACT RESOLUTION PROTOTYPE VIEWER (2304x1536)
  // ==========================================================
  openPrototypeViewer() {
    const modal = document.getElementById('prototypeViewerModal');
    if (modal) {
      modal.classList.add('active');
      // Set to current page if possible
      const pageMap = {
        'soldier': 2,
        'twin': 3,
        'commander': 4,
        'welfare_intervention': 5,
        'privacy_trust': 6
      };
      const pg = pageMap[this.currentView] || 1;
      this.setViewerPage(pg);
    }
  }

  setViewerPage(pageNum) {
    document.querySelectorAll('.proto-pg-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', (idx + 1) === pageNum);
    });
    const img = document.getElementById('prototypeViewerImage');
    if (img) {
      img.src = `assets/prototype_screens/screen_${pageNum}.png`;
    }
  }

  openHelplineModal() {
    const modal = document.getElementById('helplineModal');
    if (modal) modal.classList.add('active');
  }

  confirmConsent(val) {
    const modal = document.getElementById('consentModal');
    if (modal) modal.classList.remove('active');
    this.showToast("Digital Welfare Consent confirmed.");
  }

  toggleRosterView() {
    const container = document.getElementById('rosterTableContainer');
    const chevron = document.getElementById('rosterChevron');
    if (container) {
      const isHidden = container.style.display === 'none';
      container.style.display = isHidden ? 'block' : 'none';
      if (chevron) {
        chevron.className = isHidden ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
      }
    }
  }

  // ==========================================================
  // CHART INITIALIZATIONS
  // ==========================================================
  initRadarAndTwinCharts() {
    if (typeof Chart === 'undefined') return;

    // 1. Pentagon Radar Chart on Screen 3
    const radarCanvas = document.getElementById('twinRadarCanvas');
    if (radarCanvas && !this.radarChart) {
      this.radarChart = new Chart(radarCanvas, {
        type: 'radar',
        data: {
          labels: ['Sleep Quality', 'Workload', 'Resilience', 'Emotional State', 'Leave Balance'],
          datasets: [{
            label: 'Resilience Radar',
            data: [85, 60, 75, 70, 45],
            backgroundColor: 'rgba(56, 189, 248, 0.25)',
            borderColor: '#0284c7',
            pointBackgroundColor: '#0284c7',
            pointBorderColor: '#ffffff',
            pointRadius: 4,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              suggestedMin: 20,
              suggestedMax: 100,
              ticks: { display: false },
              grid: { color: 'rgba(148, 163, 184, 0.25)' },
              angleLines: { color: 'rgba(148, 163, 184, 0.25)' },
              pointLabels: {
                font: { size: 11, weight: '700' },
                color: '#334155'
              }
            }
          },
          plugins: { legend: { display: false } }
        }
      });
    }

    // 2. 6-Month Wellness Trends on Screen 3
    const trendCtx = document.getElementById('twinTrendsCanvas');
    if (trendCtx && !this.twinTrendsChart) {
      this.twinTrendsChart = new Chart(trendCtx, {
        type: 'line',
        data: {
          labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
          datasets: [
            { label: 'Stress Level', data: [52, 58, 62, 70, 74, 82], borderColor: '#ef4444', backgroundColor: '#ef4444', tension: 0.3, pointRadius: 4 },
            { label: 'Sleep Quality', data: [74, 62, 50, 44, 40, 36], borderColor: '#0284c7', backgroundColor: '#0284c7', tension: 0.3, pointRadius: 4 },
            { label: 'Resilience', data: [62, 66, 60, 56, 52, 50], borderColor: '#10b981', backgroundColor: '#10b981', tension: 0.3, pointRadius: 4 },
            { label: 'Workload', data: [48, 54, 60, 72, 78, 84], borderColor: '#f59e0b', backgroundColor: '#f59e0b', tension: 0.3, pointRadius: 4 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 10, font: { size: 10, weight: '600' } }
            }
          },
          scales: {
            y: { grid: { color: 'rgba(148, 163, 184, 0.12)' }, min: 20, max: 100 },
            x: { grid: { display: false } }
          }
        }
      });
    }
  }

  initCommanderCharts() {
    if (typeof Chart === 'undefined') return;

    // 1. Unit Line Chart on Screen 4
    const unitCanvas = document.getElementById('cmdUnitLineCanvas');
    if (unitCanvas && !this.cmdUnitLineChart) {
      this.cmdUnitLineChart = new Chart(unitCanvas, {
        type: 'line',
        data: {
          labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
          datasets: [
            { label: 'Alert Trend', data: [45, 52, 58, 65, 70, 78], borderColor: '#ef4444', backgroundColor: '#ef4444', tension: 0.3, pointRadius: 4 },
            { label: 'Operational Read.', data: [68, 60, 52, 45, 42, 40], borderColor: '#0284c7', backgroundColor: '#0284c7', tension: 0.3, pointRadius: 4 },
            { label: 'Avg Resilience', data: [55, 50, 56, 62, 60, 54], borderColor: '#10b981', backgroundColor: '#10b981', tension: 0.3, pointRadius: 4 },
            { label: 'Fatigue Rate', data: [35, 42, 46, 50, 51, 53], borderColor: '#f59e0b', backgroundColor: '#f59e0b', tension: 0.3, pointRadius: 4 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: 'rgba(148, 163, 184, 0.12)' }, min: 0, max: 100 },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // 2. Multi-color Donut Chart on Screen 4
    const donutCanvas = document.getElementById('cmdWellnessDonutCanvas');
    if (donutCanvas && !this.cmdDonutChart) {
      this.cmdDonutChart = new Chart(donutCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Physical Health', 'Mental Well-being', 'Operational Readiness', 'Work-Life Balance'],
          datasets: [{
            data: [78, 68, 75, 62],
            backgroundColor: ['#10b981', '#0284c7', '#06b6d4', '#f59e0b'],
            borderWidth: 0,
            cutout: '72%'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }
  }

  initPrivacyTrustCharts() {
    if (typeof Chart === 'undefined') return;

    // 72% Risk Score Donut Chart on Screen 6
    const riskCanvas = document.getElementById('riskScoreDonutCanvas');
    if (riskCanvas && !this.riskScoreDonutChart) {
      this.riskScoreDonutChart = new Chart(riskCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Deployment Load', 'Sleep Decline', 'Leave Deficit', 'Workload Increase'],
          datasets: [{
            data: [45, 30, 15, 10],
            backgroundColor: ['#ef4444', '#f59e0b', '#0284c7', '#8b5cf6'],
            borderWidth: 0,
            cutout: '72%'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }
  }

  // ==========================================================
  // DATA SERVICES & ROSTER
  // ==========================================================
  async fetchPersonnel() {
    try {
      const res = await fetch('/api/personnel');
      this.personnelList = await res.json();
      this.renderCommanderTable(this.personnelList);
    } catch(e) {
      console.error("Fetch personnel error", e);
    }
  }

  renderCommanderTable(list) {
    const tbody = document.getElementById('commanderTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!list || list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:1.5rem; color:#64748b;">No personnel found.</td></tr>`;
      return;
    }

    list.slice(0, 8).forEach(p => {
      const tr = document.createElement('tr');
      const riskClass = (p.stressRiskLevel || 'low').toLowerCase();
      const leaveDays = p.hrIndicators ? p.hrIndicators.daysSinceLastLeave : 45;

      tr.innerHTML = `
        <td><input type="checkbox" value="${p.id}" /></td>
        <td><strong>${p.name}</strong> <span style="font-size:0.75rem; color:#64748b;">(${p.id})</span></td>
        <td>${p.station || 'Bravo Unit'}</td>
        <td>${leaveDays} days</td>
        <td><span class="badge-status-pill ${riskClass === 'high' || riskClass === 'critical' ? 'red' : riskClass === 'moderate' ? 'yellow' : 'green'}">${p.stressRiskLevel}</span></td>
        <td><strong>${p.wellbeingPercentage || 70}%</strong></td>
        <td>
          <button class="toggle-btn-pill" onclick="rakshakApp.scheduleIntervention('${p.id}', 'Support Dispatch')">Support</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  handleCommanderSearch(val) {
    const term = val.toLowerCase().trim();
    const filtered = this.personnelList.filter(p => 
      p.name.toLowerCase().includes(term) || p.id.toLowerCase().includes(term)
    );
    this.renderCommanderTable(filtered);
  }

  filterPersonnel(filterType, btn) {
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    if (filterType === 'all') {
      this.renderCommanderTable(this.personnelList);
    } else {
      const filtered = this.personnelList.filter(p => (p.stressRiskLevel || '').toLowerCase() === filterType);
      this.renderCommanderTable(filtered);
    }
  }

  toggleSelectAll(masterCheckbox) {
    const tbody = document.getElementById('commanderTableBody');
    if (tbody) {
      tbody.querySelectorAll('input[type="checkbox"]').forEach(chk => {
        chk.checked = masterCheckbox.checked;
      });
    }
  }

  // ==========================================================
  // TACTICAL RESILIENCE
  // ==========================================================
  toggleBoxBreathing() {
    this.isBreathingActive = !this.isBreathingActive;
    const btn = document.getElementById('btnStartBreathing');
    if (!this.isBreathingActive) {
      clearInterval(this.breathingTimerId);
      if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Resume Session';
      return;
    }

    if (btn) btn.innerHTML = '<i class="fas fa-pause"></i> Pause Session';
    const disc = document.getElementById('breathingDisc');
    const phaseText = document.getElementById('breathPhaseText');
    const timerText = document.getElementById('breathTimerText');

    const phases = [
      { name: 'INHALE (सांस लें)', cls: 'inhale' },
      { name: 'HOLD (रोकें)', cls: 'hold' },
      { name: 'EXHALE (छोड़ें)', cls: 'exhale' },
      { name: 'HOLD (शांत रहें)', cls: 'hold' }
    ];

    this.breathingTimerId = setInterval(() => {
      this.breathingSecRemaining--;
      if (timerText) timerText.innerText = `${this.breathingSecRemaining}s`;

      if (this.breathingSecRemaining <= 0) {
        this.breathingSecRemaining = 4;
        this.breathingPhaseIndex = (this.breathingPhaseIndex + 1) % 4;
        const cur = phases[this.breathingPhaseIndex];
        if (phaseText) phaseText.innerText = cur.name;
        if (disc) {
          disc.className = `breathing-pulsing-disc ${cur.cls}`;
        }
      }
    }, 1000);
  }

  resetBoxBreathing() {
    this.isBreathingActive = false;
    clearInterval(this.breathingTimerId);
    const btn = document.getElementById('btnStartBreathing');
    const phaseText = document.getElementById('breathPhaseText');
    const timerText = document.getElementById('breathTimerText');
    const disc = document.getElementById('breathingDisc');
    if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Start Session';
    if (phaseText) phaseText.innerText = 'READY';
    if (timerText) timerText.innerText = '4s';
    if (disc) disc.className = 'breathing-pulsing-disc';
    this.breathingSecRemaining = 4;
    this.breathingPhaseIndex = 0;
  }

  nextPmrStep() {
    const curElem = document.getElementById(`pmrStep${this.pmrCurrentStep}`);
    if (curElem) curElem.classList.remove('active');

    this.pmrCurrentStep = (this.pmrCurrentStep % 4) + 1;
    const nextElem = document.getElementById(`pmrStep${this.pmrCurrentStep}`);
    if (nextElem) nextElem.classList.add('active');
  }

  resetPmr() {
    for (let i = 1; i <= 4; i++) {
      const el = document.getElementById(`pmrStep${i}`);
      if (el) el.classList.remove('active');
    }
    this.pmrCurrentStep = 1;
    const el1 = document.getElementById('pmrStep1');
    if (el1) el1.classList.add('active');
  }

  initChatbot() {
    if (typeof WelfareChatbot !== 'undefined') {
      this.chatbot = new WelfareChatbot('view_chat');
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.rakshakApp = new RakshakApp();
});
