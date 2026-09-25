/**
 * Rakshak AI (रक्षक AI) - Main Application Controller
 * Ultra-Premium Tactical Welfare & Mental Resilience Platform
 * Clean, Non-Punitive, Air-Gapped, Zero-Game Architecture
 */

class RakshakApp {
  constructor() {
    this.currentView = 'soldier'; // 'soldier' | 'twin' | 'commander' | 'treatment' | 'welfare_tracker' | 'resilience' | 'chat'
    this.currentTheme = 'clean'; // 'clean' | 'cyber'
    this.selectedLoginRole = 'soldier';
    this.personnelList = [];
    this.activeFilter = 'all';
    this.currentSortKey = 'default';
    this.selectedSoldier = null;
    this.activeSoldierId = 'CRPF-94821';
    this.selectedMood = 3;
    this.stressIndicatorMode = 'stress'; // 'stress' | 'wellbeing'
    this.lastCalculatedStressPct = 42;
    this.hasTriggeredStressPopup = false;

    // Medical Officer Treatment Matrix State
    this.treatmentPriorityFilter = 'all';
    this.treatmentSearchText = '';
    this.treatmentSortOrder = 'stress_desc';
    this.treatmentPersonnelList = [];

    // Welfare Officer Treatment Outcomes State
    this.welfareTreatments = [];
    this.welfareOutcomeFilter = 'all';
    this.welfareSelectedSoldierId = 'all';
    this.currentReportingTreatment = null;
    
    // Tactical Resilience State
    this.isBreathingActive = false;
    this.breathingPhaseIndex = 0;
    this.breathingSecRemaining = 4;
    this.breathingTimerId = null;
    this.pmrCurrentStep = 1;
    this.activeAmbientSound = null;
    this.audioCtx = null;
    this.ambientNodes = null;

    // Charts & Animation
    this.radarChart = null;
    this.twinTrendsChart = null;
    this.cmdTrendsChart = null;
    this.ecgAnimId = null;

    this.chatbot = null;

    this.init();
  }

  async init() {
    this.bindEvents();
    this.startEcgMonitor();
    await this.fetchPersonnel();
    await this.fetchAnalytics();
    this.initChatbot();
    this.updateLiveStressIndicator();
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

  // ==========================================================
  // LIVE ECG TELEMETRY CANVAS
  // ==========================================================
  startEcgMonitor() {
    const canvas = document.getElementById('ecgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let x = 0;
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;
    let prevY = midY;

    ctx.fillStyle = '#061226';
    ctx.fillRect(0, 0, width, height);

    const step = () => {
      ctx.fillStyle = 'rgba(6, 18, 38, 0.08)';
      ctx.fillRect(x, 0, 4, height);

      let targetY = midY;
      const cycle = x % 45;
      if (cycle === 12) targetY = midY - 3; // P wave
      else if (cycle === 15) targetY = midY + 2; // Q
      else if (cycle === 18) targetY = midY - 10; // R peak
      else if (cycle === 21) targetY = midY + 6; // S
      else if (cycle === 25) targetY = midY - 4; // T wave
      else targetY = midY + (Math.random() * 1.5 - 0.75);

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.moveTo(x > 0 ? x - 1 : 0, prevY);
      ctx.lineTo(x, targetY);
      ctx.stroke();

      prevY = targetY;
      x = (x + 1) % width;

      this.ecgAnimId = requestAnimationFrame(step);
    };

    step();
  }

  // ==========================================================
  // THEME ENGINE (CANVA CLEAN vs TACTICAL CYBER)
  // ==========================================================
  toggleTheme() {
    const html = document.documentElement;
    this.currentTheme = this.currentTheme === 'clean' ? 'cyber' : 'clean';
    html.setAttribute('data-theme', this.currentTheme);

    const label = document.getElementById('themeToggleLabel');
    if (label) {
      label.innerText = this.currentTheme === 'clean' ? 'Tactical Cyber' : 'Canva Clean';
    }
    this.showToast(`Theme switched to: ${this.currentTheme === 'clean' ? 'CANVA CLEAN' : 'TACTICAL CYBER'}`);
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
  // AUTH & ROLE DISPATCHER
  // ==========================================================
  selectLoginRole(role, elem) {
    this.selectedLoginRole = role;
    document.querySelectorAll('.role-card-picker').forEach(c => c.classList.remove('active'));
    if (elem) elem.classList.add('active');

    const usernameInput = document.getElementById('loginUsernameInput');
    if (usernameInput) {
      if (role === 'soldier') usernameInput.value = 'CRPF-94821 (Rajesh Kumar)';
      else if (role === 'commander') usernameInput.value = 'CMD-01 (Col. Virendra Saxena)';
      else if (role === 'welfare') usernameInput.value = 'WEL-04 (Maj. Sunita Rao - Welfare Officer)';
      else if (role === 'medical') usernameInput.value = 'MED-09 (Dr. Capt. Ananya Sharma - Medical Officer)';
    }
  }

  handleAuthLogin(roleOverride = null) {
    const role = roleOverride || this.selectedLoginRole;
    this.selectedLoginRole = role;
    document.getElementById('authLandingView').style.display = 'none';
    document.getElementById('mainAppShell').style.display = 'flex';

    // Role-Based Navigation & Access Enforcement
    const navLiHome = document.getElementById('navLiHome');
    const navLiTreatment = document.getElementById('navLiTreatment');
    const navLiWelfareTracker = document.getElementById('navLiWelfareTracker');
    const navLiCommander = document.getElementById('navLiCommander');
    const navLiTwin = document.getElementById('navLiTwin');
    const navHomeText = document.querySelector('#navItemHome span');

    if (role === 'soldier') {
      // PERSONNEL (JAWAN) VIEW:
      // Only sees own daily check-in, live stress indicator & own twin
      if (navHomeText) navHomeText.innerText = 'Home (Check-In)';
      if (navLiHome) navLiHome.style.display = 'block';
      if (navLiTreatment) navLiTreatment.style.display = 'none';
      if (navLiWelfareTracker) navLiWelfareTracker.style.display = 'none';
      if (navLiCommander) navLiCommander.style.display = 'none';
      if (navLiTwin) navLiTwin.style.display = 'block'; // ONLY PERSONNEL HAS TWIN!

      this.navigateToView('soldier');
      this.checkSoldierConsent();
    } else if (role === 'medical') {
      // MEDICAL OFFICER VIEW:
      // Removed personal stress checker & twin! Views all personnel & Clinical Treatment Center
      if (navLiHome) navLiHome.style.display = 'none';
      if (navLiTreatment) navLiTreatment.style.display = 'block';
      if (navLiWelfareTracker) navLiWelfareTracker.style.display = 'none';
      if (navLiCommander) navLiCommander.style.display = 'block';
      if (navLiTwin) navLiTwin.style.display = 'none'; // REMOVED FROM ALL EXCEPT PERSONNEL

      this.navigateToView('treatment');
    } else if (role === 'welfare') {
      // WELFARE OFFICER VIEW:
      // Removed personal stress checker & twin! Views all personnel & Welfare Treatment Tracker
      if (navLiHome) navLiHome.style.display = 'none';
      if (navLiTreatment) navLiTreatment.style.display = 'none';
      if (navLiWelfareTracker) navLiWelfareTracker.style.display = 'block';
      if (navLiCommander) navLiCommander.style.display = 'block';
      if (navLiTwin) navLiTwin.style.display = 'none'; // REMOVED FROM ALL EXCEPT PERSONNEL

      this.navigateToView('welfare_tracker');
    } else {
      // COMMANDER VIEW:
      // Can check his own live stress level & accesses Commander Operations Center
      // Twin panel removed from all except personnel!
      if (navHomeText) navHomeText.innerText = 'Personal Stress Check';
      if (navLiHome) navLiHome.style.display = 'block'; // COMMANDER ALLOWED TO CHECK LIVE STRESS!
      if (navLiTreatment) navLiTreatment.style.display = 'none';
      if (navLiWelfareTracker) navLiWelfareTracker.style.display = 'none';
      if (navLiCommander) navLiCommander.style.display = 'block';
      if (navLiTwin) navLiTwin.style.display = 'none'; // REMOVED FROM ALL EXCEPT PERSONNEL

      this.navigateToView('commander');
    }

    const roleTitles = {
      soldier: 'PERSONNEL (JAWAN)',
      commander: 'COMMANDING OFFICER',
      welfare: 'WELFARE OFFICER',
      medical: 'MEDICAL OFFICER'
    };
    this.showToast(`Welcome! Logged in as: ${roleTitles[role] || role.toUpperCase()}`);
  }

  logoutToLanding() {
    this.stopAmbientSound();
    this.resetBoxBreathing();
    document.getElementById('mainAppShell').style.display = 'none';
    document.getElementById('authLandingView').style.display = 'flex';
  }

  navigateToView(viewName) {
    // PERSONNEL DATA PRIVACY PROTECTION:
    // If logged in as personnel/soldier, deny access to commander, treatment, and welfare tracker!
    if (this.selectedLoginRole === 'soldier') {
      if (viewName === 'commander' || viewName === 'treatment' || viewName === 'welfare_tracker') {
        this.showToast("🔒 Access Restricted: Personnel force roster & clinical data are restricted to Officers.");
        return;
      }
    }

    // DIGITAL WELFARE TWIN RESTRICTION:
    // "remove digital welfare twin panel from all except personnel"
    if (viewName === 'twin' && this.selectedLoginRole !== 'soldier') {
      this.showToast("🔒 Access Restricted: Digital Welfare Twin panel is only accessible to active Personnel.");
      return;
    }

    // MEDICAL & WELFARE OFFICERS cannot access personal check-in
    // Commander and Personnel CAN check live stress level
    if (viewName === 'soldier' && (this.selectedLoginRole === 'medical' || this.selectedLoginRole === 'welfare')) {
      this.showToast("Personal check-in is disabled for Medical and Welfare Officers.");
      return;
    }

    this.currentView = viewName;

    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });

    document.querySelectorAll('.app-subview').forEach(view => {
      view.style.display = 'none';
    });

    const targetView = document.getElementById(`view_${viewName}`);
    if (targetView) targetView.style.display = 'block';

    const title = document.getElementById('topbarTitle');
    const subtitle = document.getElementById('topbarSubtitle');
    const avatar = document.getElementById('topbarAvatar');
    const uName = document.getElementById('topbarUserName');
    const uRole = document.getElementById('topbarUserRole');
    const checkinGreeting = document.getElementById('checkinGreetingText');

    if (viewName === 'soldier') {
      if (this.selectedLoginRole === 'commander') {
        if (title) title.innerText = "Good Morning, Commander Saxena 👋";
        if (subtitle) subtitle.innerText = "Check your personal operational stress level & wellbeing metrics.";
        if (avatar) avatar.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150";
        if (uName) uName.innerText = "Col. V. Saxena";
        if (uRole) uRole.innerText = "Commanding Officer";
        if (checkinGreeting) checkinGreeting.innerText = "How is your operational strain today, Commander?";
      } else {
        if (title) title.innerText = "Good Morning, Rajesh 👋";
        if (subtitle) subtitle.innerText = "Take a moment. Your well-being matters.";
        if (avatar) avatar.src = "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150";
        if (uName) uName.innerText = "Rajesh Kumar";
        if (uRole) uRole.innerText = "Havildar (CRPF)";
        if (checkinGreeting) checkinGreeting.innerText = "How are you feeling today, Veer?";
      }
    } else if (viewName === 'twin') {
      if (title) title.innerText = "Digital Welfare Twin";
      if (subtitle) subtitle.innerText = "Multi-dimensional resilience radar & longitudinal trends";
      this.initRadarAndTwinCharts();
    } else if (viewName === 'commander') {
      if (title) title.innerText = "Commander Operations Center";
      if (subtitle) subtitle.innerText = "Force-wide stress metrics, leave management, & welfare dispatch";
      if (avatar) avatar.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150";
      if (uName) uName.innerText = "Col. V. Saxena";
      if (uRole) uRole.innerText = "Commanding Officer";
      this.initCommanderCharts();
      this.renderCommanderTable(this.personnelList);
    } else if (viewName === 'treatment') {
      if (title) title.innerText = "Clinical Treatment Center & Stress Triage Matrix";
      if (subtitle) subtitle.innerText = "Live stress triage, priority-tiered therapies, and psychiatric counseling";
      if (avatar) avatar.src = "https://images.unsplash.com/photo-1594824813626-d98c2537ef18?w=150";
      if (uName) uName.innerText = "Dr. Capt. A. Sharma";
      if (uRole) uRole.innerText = "Unit Medical Officer (MO)";
      this.fetchTreatmentRoster();
    } else if (viewName === 'welfare_tracker') {
      if (title) title.innerText = "Welfare & Treatment Outcomes Tracker";
      if (subtitle) subtitle.innerText = "Post-treatment stress delta monitoring & 25% threshold re-referral workflow";
      if (avatar) avatar.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150";
      if (uName) uName.innerText = "Maj. Sunita Rao";
      if (uRole) uRole.innerText = "Senior Welfare Officer";
      this.fetchWelfareTreatments();
    } else if (viewName === 'resilience') {
      if (title) title.innerText = "Tactical Resilience Center";
      if (subtitle) subtitle.innerText = "4-4-4-4 Box Breathing, Muscle Decompression, & Sleep Hygiene";
    } else if (viewName === 'chat') {
      if (title) title.innerText = "Mitra AI Welfare Companion";
      if (subtitle) subtitle.innerText = "24x7 confidential listening, camaraderie, & crisis safety net";
    }
  }

  // ==========================================================
  // DATA FETCHING & API SERVICES
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

  async fetchAnalytics() {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      const elMon = document.getElementById('kpiTotalMonitored');
      const elCrit = document.getElementById('kpiCriticalCount');
      const elHigh = document.getElementById('kpiHighCount');
      const elRead = document.getElementById('kpiReadinessVal');

      if (elMon) elMon.innerText = data.totalMonitored;
      if (elCrit) elCrit.innerText = data.criticalCount;
      if (elHigh) elHigh.innerText = data.highRiskCount;
      if (elRead) elRead.innerText = `${data.forceReadinessIndex}%`;
    } catch(e) {
      console.error("Fetch analytics error", e);
    }
  }

  // ==========================================================
  // COMMANDER TABLE, SEARCH & SORT
  // ==========================================================
  renderCommanderTable(list) {
    const tbody = document.getElementById('commanderTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!list || list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--text-muted);">No personnel matched your search criteria.</td></tr>`;
      return;
    }

    list.forEach(p => {
      const tr = document.createElement('tr');
      const riskClass = (p.stressRiskLevel || 'low').toLowerCase();
      const wbPct = p.wellbeingPercentage || 70;
      
      let barColor = '#10b981';
      if (wbPct < 40) barColor = '#ef4444';
      else if (wbPct < 70) barColor = '#f97316';

      const leaveDays = p.hrIndicators ? p.hrIndicators.daysSinceLastLeave : 45;
      const leaveAlert = leaveDays > 120 ? `style="color:#ef4444; font-weight:700;"` : '';

      tr.innerHTML = `
        <td><input type="checkbox" class="roster-row-checkbox" value="${p.id}" onchange="rakshakApp.updateBatchSelection()" /></td>
        <td>
          <div class="personnel-cell">
            <img src="${p.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'}" class="personnel-table-avatar" alt="Avatar" />
            <div>
              <div class="personnel-table-name">${p.name}</div>
              <div class="personnel-table-id">${p.rank} • ${p.force} (${p.id})</div>
            </div>
          </div>
        </td>
        <td>
          <div style="font-weight:600; font-size:0.85rem;">${p.station || 'Field Post'}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${p.deploymentZone || 'Border'}</div>
        </td>
        <td ${leaveAlert}>${leaveDays} days</td>
        <td><span class="risk-badge ${riskClass}">${p.stressRiskLevel}</span></td>
        <td>
          <div class="wellbeing-bar-cell">
            <span style="font-weight:700; font-size:0.85rem; width:35px;">${wbPct}%</span>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${wbPct}%; background: ${barColor};"></div>
            </div>
          </div>
        </td>
        <td>
          <button class="btn-table-action" onclick="rakshakApp.openPersonnelModal('${p.id}')">
            <i class="fas fa-file-medical"></i> Review
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  handleCommanderSearch(val) {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(async () => {
      const q = val.trim();
      let url = `/api/personnel?q=${encodeURIComponent(q)}`;
      if (this.activeFilter !== 'all') url += `&risk=${this.activeFilter}`;
      if (this.currentSortKey !== 'default') url += `&sort=${this.currentSortKey}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        this.renderCommanderTable(data);
      } catch(e) {}
    }, 200);
  }

  filterPersonnel(riskLevel, btnElem) {
    this.activeFilter = riskLevel;
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
    if (btnElem) btnElem.classList.add('active');

    const searchInput = document.getElementById('commanderSearchInput');
    const q = searchInput ? searchInput.value.trim() : '';
    let url = `/api/personnel?risk=${riskLevel}`;
    if (q) url += `&q=${encodeURIComponent(q)}`;
    if (this.currentSortKey !== 'default') url += `&sort=${this.currentSortKey}`;

    fetch(url).then(r => r.json()).then(data => this.renderCommanderTable(data));
  }

  handleSortChange(sortVal) {
    this.currentSortKey = sortVal;
    const searchInput = document.getElementById('commanderSearchInput');
    const q = searchInput ? searchInput.value.trim() : '';
    let url = `/api/personnel?sort=${sortVal}`;
    if (q) url += `&q=${encodeURIComponent(q)}`;
    if (this.activeFilter !== 'all') url += `&risk=${this.activeFilter}`;

    fetch(url).then(r => r.json()).then(data => this.renderCommanderTable(data));
  }

  // ==========================================================
  // BATCH ACTIONS DISPATCHER
  // ==========================================================
  toggleSelectAll(masterCheckbox) {
    const checks = document.querySelectorAll('.roster-row-checkbox');
    checks.forEach(c => c.checked = masterCheckbox.checked);
    this.updateBatchSelection();
  }

  updateBatchSelection() {
    const selected = document.querySelectorAll('.roster-row-checkbox:checked');
    const bar = document.getElementById('batchActionBar');
    const countLabel = document.getElementById('batchSelectedCount');
    if (selected.length > 0) {
      if (bar) bar.style.display = 'flex';
      if (countLabel) countLabel.innerText = `${selected.length} Personnel Selected`;
    } else {
      if (bar) bar.style.display = 'none';
    }
  }

  async executeBatchAction(actionType) {
    const selected = Array.from(document.querySelectorAll('.roster-row-checkbox:checked')).map(c => c.value);
    if (selected.length === 0) return;

    for (const pid of selected) {
      try {
        await fetch(`/api/personnel/${pid}/welfare-action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actionType: actionType, notes: "Commander Batch Sanction" })
        });
      } catch(e) {}
    }

    this.showToast(`Batch Action Executed: ${actionType} for ${selected.length} personnel!`);
    await this.fetchPersonnel();
    await this.fetchAnalytics();
    const bar = document.getElementById('batchActionBar');
    if (bar) bar.style.display = 'none';
  }

  async exportReportCSV() {
    try {
      const res = await fetch('/api/export-report');
      const data = await res.json();
      
      let csv = "ID,Name,Rank,Force,DaysWithoutLeave,WellbeingPct,PrimaryRisk,RecommendedAction\n";
      data.highPriorityPersonnel.forEach(p => {
        csv += `"${p.id}","${p.name}","${p.rank}","${p.force}",${p.overdueLeaveDays},${p.wellbeingPercentage},"${p.primaryRisk}","${p.recommendedAction}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `Rakshak_Welfare_Report_${new Date().toISOString().slice(0,10)}.csv`);
      a.click();
      this.showToast("Welfare CSV Report downloaded successfully!");
    } catch(e) {
      this.showToast("Report download failed.");
    }
  }

  // ==========================================================
  // SOLDIER DEEP-DIVE & INTERVENTION MODAL
  // ==========================================================
  async openPersonnelModal(pid) {
    try {
      const res = await fetch(`/api/personnel/${pid}`);
      const p = await res.json();
      this.selectedSoldier = p;

      const container = document.getElementById('soldierModalContent');
      if (!container) return;

      const wb = p.wellbeingPercentage || 60;
      const riskClass = (p.stressRiskLevel || 'low').toLowerCase();

      container.innerHTML = `
        <div style="display:flex; align-items:center; gap:1.2rem; margin-bottom:1.5rem;">
          <img src="${p.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'}" style="width:64px; height:64px; border-radius:50%; object-fit:cover; border:3px solid var(--primary);" />
          <div>
            <h3 style="font-size:1.3rem; font-weight:800; color:var(--text-main);">${p.name}</h3>
            <p style="font-size:0.85rem; color:var(--text-muted);">${p.rank} • ${p.force} (${p.id}) | ${p.station}</p>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:1rem; margin-bottom:1.5rem;">
          <div style="background:var(--bg-card-subtle); padding:1rem; border-radius:var(--radius-md); text-align:center; border:1px solid var(--border-card);">
            <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Wellbeing Score</div>
            <div style="font-size:1.6rem; font-weight:800; color:var(--primary);">${wb}%</div>
          </div>
          <div style="background:var(--bg-card-subtle); padding:1rem; border-radius:var(--radius-md); text-align:center; border:1px solid var(--border-card);">
            <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Days Overdue Leave</div>
            <div style="font-size:1.6rem; font-weight:800; color:${p.hrIndicators.daysSinceLastLeave > 120 ? '#ef4444' : '#10b981'};">
              ${p.hrIndicators.daysSinceLastLeave}d
            </div>
          </div>
          <div style="background:var(--bg-card-subtle); padding:1rem; border-radius:var(--radius-md); text-align:center; border:1px solid var(--border-card);">
            <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Stress Classification</div>
            <div style="margin-top:0.4rem;"><span class="risk-badge ${riskClass}">${p.stressRiskLevel}</span></div>
          </div>
        </div>

        <div style="margin-bottom:1.5rem;">
          <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:0.5rem;"><i class="fas fa-microchip" style="color:#ef4444;"></i> AI Diagnostic Strain Drivers:</h4>
          <ul style="padding-left:1.2rem; font-size:0.85rem; line-height:1.6; color:var(--text-main);">
            ${p.aiRiskFactors.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-bottom:1.5rem;">
          <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:0.5rem;"><i class="fas fa-clipboard-check" style="color:#10b981;"></i> Recommended Interventions:</h4>
          <ul style="padding-left:1.2rem; font-size:0.85rem; line-height:1.6; color:var(--text-main);">
            ${p.welfareRecommendations.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>

        <div style="border-top:1px solid var(--border-card); padding-top:1.2rem;">
          <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:0.8rem;">1-Click Commander Dispatch Actions:</h4>
          <div style="display:flex; flex-wrap:wrap; gap:0.6rem;">
            <button class="btn-welfare-action primary" onclick="rakshakApp.dispatchWelfareAction('${p.id}', 'Sanction 15-Day Home Leave')">
              <i class="fas fa-plane-departure"></i> Grant 15-Day Immediate Home Leave
            </button>
            <button class="btn-welfare-action warning" onclick="rakshakApp.dispatchWelfareAction('${p.id}', 'Recommend Rotational Peace Station Transfer')">
              <i class="fas fa-sync-alt"></i> Rotate to Peace Station
            </button>
            <button class="btn-welfare-action danger" onclick="rakshakApp.dispatchWelfareAction('${p.id}', 'Schedule Urgent Medical Officer Counseling')">
              <i class="fas fa-user-md"></i> Schedule MO Counseling
            </button>
          </div>
        </div>
      `;

      const modal = document.getElementById('personnelDetailModal');
      if (modal) modal.classList.add('active');
    } catch(e) {
      console.error(e);
    }
  }

  openSoldierModal(pid) {
    return this.openPersonnelModal(pid);
  }

  async dispatchWelfareAction(pid, actionType) {
    try {
      const res = await fetch(`/api/personnel/${pid}/welfare-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType: actionType, notes: "Commander Dashboard Direct Dispatch" })
      });
      const data = await res.json();
      this.showToast(`Action dispatched: ${actionType}!`);
      
      const modal = document.getElementById('personnelDetailModal');
      if (modal) modal.classList.remove('active');

      await this.fetchPersonnel();
      await this.fetchAnalytics();
    } catch(e) {
      this.showToast("Action dispatch failed.");
    }
  }

  // ==========================================================
  // TACTICAL RESILIENCE CENTER (BOX BREATHING, PMR, AUDIO)
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
    this.runBreathingLoop();
  }

  runBreathingLoop() {
    const phases = [
      { name: "INHALE", scale: "1.35", color: "#10b981", duration: 4 },
      { name: "HOLD", scale: "1.35", color: "#0ea5e9", duration: 4 },
      { name: "EXHALE", scale: "1.0", color: "#6366f1", duration: 4 },
      { name: "HOLD", scale: "1.0", color: "#f59e0b", duration: 4 }
    ];

    const phaseText = document.getElementById('breathPhaseText');
    const timerText = document.getElementById('breathTimerText');
    const disc = document.getElementById('breathingDisc');

    const updatePhase = () => {
      const cur = phases[this.breathingPhaseIndex];
      if (phaseText) phaseText.innerText = cur.name;
      if (timerText) timerText.innerText = `${this.breathingSecRemaining}s`;
      if (disc) {
        disc.style.transform = `scale(${cur.scale})`;
        disc.style.borderColor = cur.color;
      }
    };

    updatePhase();
    this.playTone(440, 0.1);

    clearInterval(this.breathingTimerId);
    this.breathingTimerId = setInterval(() => {
      this.breathingSecRemaining--;
      if (this.breathingSecRemaining < 0) {
        this.breathingPhaseIndex = (this.breathingPhaseIndex + 1) % 4;
        this.breathingSecRemaining = 4;
        this.playTone(this.breathingPhaseIndex === 0 ? 520 : 440, 0.12);
      }
      updatePhase();
    }, 1000);
  }

  resetBoxBreathing() {
    this.isBreathingActive = false;
    clearInterval(this.breathingTimerId);
    this.breathingPhaseIndex = 0;
    this.breathingSecRemaining = 4;
    const btn = document.getElementById('btnStartBreathing');
    const phaseText = document.getElementById('breathPhaseText');
    const timerText = document.getElementById('breathTimerText');
    const disc = document.getElementById('breathingDisc');

    if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Start Session';
    if (phaseText) phaseText.innerText = 'READY';
    if (timerText) timerText.innerText = '4s';
    if (disc) disc.style.transform = 'scale(1.0)';
  }

  nextPmrStep() {
    this.pmrCurrentStep = (this.pmrCurrentStep % 4) + 1;
    for (let i = 1; i <= 4; i++) {
      const el = document.getElementById(`pmrStep${i}`);
      if (el) el.classList.toggle('active', i === this.pmrCurrentStep);
    }
    this.playTone(330, 0.15);
  }

  resetPmr() {
    this.pmrCurrentStep = 1;
    for (let i = 1; i <= 4; i++) {
      const el = document.getElementById(`pmrStep${i}`);
      if (el) el.classList.toggle('active', i === 1);
    }
  }

  // Synthesized Ambient Audio Generator (Web Audio API)
  toggleAmbientSound(type) {
    if (this.activeAmbientSound === type) {
      this.stopAmbientSound();
      return;
    }
    this.stopAmbientSound();
    this.startAmbientSound(type);
  }

  startAmbientSound(type) {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx) this.audioCtx = new AudioCtxClass();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      // Create pink noise buffer
      const bufferSize = this.audioCtx.sampleRate * 2;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }

      const noiseNode = this.audioCtx.createBufferSource();
      noiseNode.buffer = buffer;
      noiseNode.loop = true;

      const filter = this.audioCtx.createBiquadFilter();
      if (type === 'stream') {
        filter.type = 'lowpass';
        filter.frequency.value = 650;
      } else if (type === 'rain') {
        filter.type = 'bandpass';
        filter.frequency.value = 850;
      } else if (type === 'wind') {
        filter.type = 'lowpass';
        filter.frequency.value = 350;
      }

      const gain = this.audioCtx.createGain();
      gain.gain.value = 0.25;

      noiseNode.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);
      noiseNode.start();

      this.ambientNodes = { noiseNode, filter, gain };
      this.activeAmbientSound = type;

      // Update button UI
      const btnId = type === 'stream' ? 'btnSoundStream' : type === 'rain' ? 'btnSoundRain' : 'btnSoundWind';
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.classList.add('playing');
        btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
      }
      this.showToast(`Ambient Sound Started: ${type.toUpperCase()}`);
    } catch(e) {
      console.warn("Audio Context init error", e);
    }
  }

  stopAmbientSound() {
    if (this.ambientNodes) {
      try {
        this.ambientNodes.noiseNode.stop();
        this.ambientNodes.noiseNode.disconnect();
      } catch(e) {}
      this.ambientNodes = null;
    }
    ['btnSoundStream', 'btnSoundRain', 'btnSoundWind'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.classList.remove('playing');
        btn.innerHTML = '<i class="fas fa-play"></i> Play';
      }
    });
    this.activeAmbientSound = null;
  }

  playTone(freq, dur) {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx) this.audioCtx = new AudioCtxClass();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + dur);
    } catch(e) {}
  }

  // ==========================================================
  // PERSONNEL DAILY WELLNESS CHECK-IN
  // ==========================================================
  selectMood(score, elem) {
    this.selectedMood = score;
    document.querySelectorAll('.mood-option-card').forEach(c => c.classList.remove('active'));
    if (elem) elem.classList.add('active');
    this.updateLiveStressIndicator();
  }

  updateSleepDisplay(hours) {
    const valElem = document.getElementById('sleepHoursVal');
    if (!valElem) return;
    let label = "Optimal";
    if (hours < 5) label = "Critical Insomnia ⚠️";
    else if (hours < 6.5) label = "Sub-optimal";
    else if (hours > 9) label = "Elevated Fatigue";
    valElem.innerText = `${hours} Hours (${label})`;
    this.updateLiveStressIndicator();
  }

  setStressIndicatorMode(mode) {
    this.stressIndicatorMode = mode;
    const btnStress = document.getElementById('btnOptStressPct');
    const btnWellbeing = document.getElementById('btnOptWellbeingPct');
    if (btnStress && btnWellbeing) {
      btnStress.classList.toggle('active', mode === 'stress');
      btnWellbeing.classList.toggle('active', mode === 'wellbeing');
    }
    this.updateLiveStressIndicator();
  }

  updateLiveStressIndicator() {
    const sleepInput = document.getElementById('sleepRangeInput');
    const sleepHours = sleepInput ? parseFloat(sleepInput.value) : 5.5;
    const mood = this.selectedMood || 3;

    // 1. Mood Component (0 to 100)
    let moodScore = 35;
    let moodLabel = "Okay (35% load)";
    if (mood >= 5) {
      moodScore = 12;
      moodLabel = "Good (12% load)";
    } else if (mood === 3) {
      moodScore = 35;
      moodLabel = "Okay (35% load)";
    } else if (mood === 2) {
      moodScore = 68;
      moodLabel = "Stressed (68% load)";
    } else if (mood <= 1) {
      moodScore = 88;
      moodLabel = "Exhausted (88% load)";
    }

    // 2. Sleep Component (0 to 100)
    let sleepScore = 25;
    let sleepLabel = `${sleepHours}h (+25%)`;
    if (sleepHours >= 7.0 && sleepHours <= 8.5) {
      sleepScore = Math.max(8, Math.round(8 + (8.5 - sleepHours) * 5));
      sleepLabel = `${sleepHours}h (Optimal Rest)`;
    } else if (sleepHours > 8.5) {
      sleepScore = Math.round(14 + (sleepHours - 8.5) * 6);
      sleepLabel = `${sleepHours}h (Mild Fatigue)`;
    } else if (sleepHours >= 6.0 && sleepHours < 7.0) {
      sleepScore = Math.round(22 + (7.0 - sleepHours) * 16);
      sleepLabel = `${sleepHours}h (Mild Deficit)`;
    } else if (sleepHours >= 4.5 && sleepHours < 6.0) {
      sleepScore = Math.round(40 + (6.0 - sleepHours) * 18);
      sleepLabel = `${sleepHours}h (Sub-optimal Deficit)`;
    } else if (sleepHours >= 3.0 && sleepHours < 4.5) {
      sleepScore = Math.round(66 + (4.5 - sleepHours) * 12);
      sleepLabel = `${sleepHours}h (High Insomnia)`;
    } else {
      sleepScore = Math.min(96, Math.round(84 + (3.0 - sleepHours) * 5));
      sleepLabel = `${sleepHours}h (Critical Sleep Loss)`;
    }

    // 3. Operational Strain Triggers Component
    let triggerCount = 0;
    if (document.getElementById('chkPatrol')?.checked) triggerCount++;
    if (document.getElementById('chkFamily')?.checked) triggerCount++;
    if (document.getElementById('chkAltitude')?.checked) triggerCount++;
    if (document.getElementById('chkLeave')?.checked) triggerCount++;
    const triggerScore = triggerCount * 20;

    // 4. Combined Multi-Variate Stress %
    const stressPct = Math.min(98, Math.max(8, Math.round(
      (moodScore * 0.52) + (sleepScore * 0.36) + (triggerScore * 0.12)
    )));
    this.lastCalculatedStressPct = stressPct;
    const wellbeingPct = 100 - stressPct;

    // 5. Update DOM Elements
    const card = document.getElementById('liveStressCard');
    const numElem = document.getElementById('liveStressNumber');
    const lblElem = document.getElementById('liveStressLabel');
    const barElem = document.getElementById('liveStressProgressBar');
    const badgeElem = document.getElementById('liveStressBadge');
    const moodChip = document.getElementById('valMoodFactor');
    const sleepChip = document.getElementById('valSleepFactor');
    const adviceElem = document.getElementById('liveStressAdviceText');

    if (moodChip) moodChip.innerText = moodLabel;
    if (sleepChip) sleepChip.innerText = sleepLabel;

    // Mode-specific display (Stress % vs Wellbeing %)
    const isStressMode = this.stressIndicatorMode === 'stress';
    const displayVal = isStressMode ? stressPct : wellbeingPct;

    if (numElem) {
      numElem.innerText = `${displayVal}%`;
      if (isStressMode) {
        if (stressPct <= 35) numElem.style.color = '#10b981';
        else if (stressPct <= 60) numElem.style.color = '#eab308';
        else if (stressPct <= 78) numElem.style.color = '#f97316';
        else numElem.style.color = '#ef4444';
      } else {
        if (wellbeingPct >= 65) numElem.style.color = '#10b981';
        else if (wellbeingPct >= 40) numElem.style.color = '#eab308';
        else numElem.style.color = '#ef4444';
      }
    }

    if (lblElem) {
      lblElem.innerText = isStressMode ? 'LIVE STRESS LEVEL' : 'LIVE WELLBEING INDEX';
    }

    if (barElem) {
      barElem.style.width = `${displayVal}%`;
      if (isStressMode) {
        barElem.style.background = 'linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%)';
      } else {
        barElem.style.background = 'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #10b981 100%)';
      }
    }

    // Determine Severity Status & Advice
    let statusClass = 'moderate';
    let statusIcon = 'fa-info-circle';
    let statusText = 'Moderate Strain';
    let adviceText = 'Sub-optimal sleep and moderate mood place your autonomic load in the manageable range.';

    if (stressPct <= 32) {
      statusClass = 'low';
      statusIcon = 'fa-check-circle';
      statusText = 'Low Stress • Restored';
      adviceText = 'Restorative sleep and positive outlook provide optimal cognitive focus and physical resilience.';
    } else if (stressPct <= 58) {
      statusClass = 'moderate';
      statusIcon = 'fa-info-circle';
      statusText = 'Moderate Strain • Stable';
      adviceText = 'Autonomic load is elevated but manageable. Prioritize 7+ hours sleep and brief recovery pauses.';
    } else if (stressPct <= 78) {
      statusClass = 'high';
      statusIcon = 'fa-exclamation-triangle';
      statusText = 'High Stress • Fatigue Alert';
      adviceText = 'Elevated operational fatigue detected. 4-4-4-4 tactical box breathing or a short rest cycle recommended.';
    } else {
      statusClass = 'critical';
      statusIcon = 'fa-exclamation-circle';
      statusText = 'Critical Stress • Action Needed';
      adviceText = 'Severe sleep deficit and exhaustion detected. Confidential counseling or rotational recovery recommended.';
    }

    if (badgeElem) {
      badgeElem.className = `live-stress-status-badge ${statusClass}`;
      badgeElem.innerHTML = `<i class="fas ${statusIcon}"></i> <span>${statusText}</span>`;
    }

    if (card) {
      card.className = `live-stress-indicator-card stress-${statusClass}`;
    }

    if (adviceElem) {
      adviceElem.innerText = adviceText;
    }

    // 6. Elevated Stress Support Trigger (>= 60% Threshold)
    const alertBox = document.getElementById('stressAlertTriggerBox');
    if (stressPct >= 60) {
      if (alertBox) alertBox.style.display = 'block';
      if (!this.hasTriggeredStressPopup) {
        this.hasTriggeredStressPopup = true;
        setTimeout(() => {
          this.openElevatedStressModal(stressPct);
        }, 300);
      }
    } else {
      if (stressPct < 55) {
        if (alertBox) alertBox.style.display = 'none';
        this.hasTriggeredStressPopup = false;
      }
    }
  }

  // ==========================================================
  // ELEVATED STRESS MODAL & SUPPORT ACTIONS
  // ==========================================================
  openElevatedStressModal(pct = null) {
    const stressVal = pct !== null ? pct : (this.lastCalculatedStressPct || 68);
    const pctSpan = document.getElementById('stressModalPct');
    const pctStrong = document.getElementById('stressModalPctStrong');
    if (pctSpan) pctSpan.innerText = `${stressVal}%`;
    if (pctStrong) pctStrong.innerText = `${stressVal}%`;

    const modal = document.getElementById('elevatedStressModal');
    if (modal) modal.classList.add('active');
  }

  closeElevatedStressModal() {
    const modal = document.getElementById('elevatedStressModal');
    if (modal) modal.classList.remove('active');
  }

  chooseStressSupport(choice) {
    this.closeElevatedStressModal();
    const stressVal = this.lastCalculatedStressPct || 68;

    if (choice === 'mitra') {
      this.navigateToView('chat');
      if (this.chatbot && typeof this.chatbot.renderMessage === 'function') {
        setTimeout(() => {
          this.chatbot.renderMessage({
            sender: 'bot',
            text: `**Namaste Rajesh.** I noticed your live stress level is currently elevated at **${stressVal}%**. I am right here with you.\n\nEverything we share is strictly confidential, non-punitive, and 100% air-gapped from your service records. How are you feeling right now? Would you like to share what's on your mind, or do a 2-minute tactical breathing exercise together?`,
            quickReplies: [
              "Start 4-4-4-4 Box Breathing 🧘",
              "Duty ki thakaan aur family chinta",
              "Ek mazedaar Fauji joke sunao 😄",
              "I just need a moment of peace"
            ]
          });
        }, 200);
      }
      this.showToast("Connected to Mitra AI. Your support session is 100% confidential.");
    } else if (choice === 'phone') {
      this.openHelplineModal();
      this.showToast("Opening 24x7 confidential military phone helplines...");
    }
  }

  async submitCheckin() {
    const sleepInput = document.getElementById('sleepRangeInput');
    const sleep = sleepInput ? parseFloat(sleepInput.value) : 6.0;
    const note = document.getElementById('checkinNote')?.value || '';
    
    const symptoms = [];
    if (document.getElementById('chkPatrol')?.checked) symptoms.push("Border Patrol Fatigue");
    if (document.getElementById('chkFamily')?.checked) symptoms.push("Family Separation / Worry");
    if (document.getElementById('chkAltitude')?.checked) symptoms.push("Extreme Climate / Hypoxia");
    if (document.getElementById('chkLeave')?.checked) symptoms.push("Overdue Leave Anxiety");

    const pid = this.selectedLoginRole === 'commander' ? 'CMD-01' : this.activeSoldierId;

    try {
      const res = await fetch('/api/self-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personnelId: pid,
          moodScore: this.selectedMood,
          sleepHours: sleep,
          exhaustionLevel: sleep < 5 ? "Critical" : "Moderate",
          reportedSymptoms: symptoms
        })
      });
      const data = await res.json();
      if (this.selectedLoginRole === 'commander') {
        this.showToast("Personal Assessment Logged! Commander live stress level registered.");
      } else {
        this.showToast("Check-In Submitted! Your resilience record has been updated.");
      }

      // Add to recent check-ins table
      const tbody = document.getElementById('recentCheckinsBody');
      if (tbody) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>Today (Just now)</td>
          <td>${this.selectedMood >= 4 ? '😊 Good' : this.selectedMood === 3 ? '😐 Okay' : '😰 Stressed'}</td>
          <td>${sleep} hrs</td>
          <td><span class="risk-badge low">Logged</span></td>
        `;
        tbody.insertBefore(row, tbody.firstChild);
      }
    } catch(e) {
      this.showToast("Submission failed. Offline mode active.");
    }
  }

  checkSoldierConsent() {
    const modal = document.getElementById('consentModal');
    if (modal) modal.classList.add('active');
  }

  confirmConsent(val) {
    const modal = document.getElementById('consentModal');
    if (modal) modal.classList.remove('active');
    this.showToast("Digital Welfare Consent confirmed. Data is protected.");
  }

  openHelplineModal() {
    const modal = document.getElementById('helplineModal');
    if (modal) modal.classList.add('active');
  }

  // ==========================================================
  // CHART.JS INITIALIZATIONS (CANVA SCREENS 3 & 4)
  // ==========================================================
  initRadarAndTwinCharts() {
    if (typeof Chart === 'undefined') return;

    const radarCanvas = document.getElementById('twinRadarCanvas');
    if (radarCanvas && !this.radarChart) {
      this.radarChart = new Chart(radarCanvas, {
        type: 'radar',
        data: {
          labels: ['Sleep Quality', 'Workload Strain', 'Mental Resilience', 'Emotional Balance', 'Leave Balance'],
          datasets: [{
            label: 'Current Resilience Index',
            data: [62, 85, 78, 65, 45],
            backgroundColor: 'rgba(2, 132, 199, 0.25)',
            borderColor: '#0284c7',
            pointBackgroundColor: '#0284c7',
            pointBorderColor: '#fff'
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
              grid: { color: 'rgba(148, 163, 184, 0.2)' }
            }
          },
          plugins: { legend: { display: false } }
        }
      });
    }

    const trendCtx = document.getElementById('twinTrendsCanvas');
    if (trendCtx && !this.twinTrendsChart) {
      this.twinTrendsChart = new Chart(trendCtx, {
        type: 'line',
        data: {
          labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
          datasets: [
            { label: 'Stress Level', data: [52, 58, 65, 70, 72, 84], borderColor: '#ef4444', tension: 0.35 },
            { label: 'Sleep Quality', data: [72, 60, 48, 42, 40, 38], borderColor: '#0284c7', tension: 0.35 },
            { label: 'Resilience', data: [60, 68, 62, 54, 50, 48], borderColor: '#10b981', tension: 0.35 },
            { label: 'Workload', data: [50, 55, 62, 75, 80, 85], borderColor: '#f59e0b', tension: 0.35 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
          scales: { y: { grid: { color: 'rgba(148, 163, 184, 0.1)' }, min: 20, max: 100 }, x: { grid: { display: false } } }
        }
      });
    }
  }

  initCommanderCharts() {
    if (typeof Chart === 'undefined') return;

    const cmdTrends = document.getElementById('cmdTrendsCanvas');
    if (cmdTrends && !this.cmdTrendsChart) {
      this.cmdTrendsChart = new Chart(cmdTrends, {
        type: 'line',
        data: {
          labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
          datasets: [
            {
              label: 'High Stress Alert %',
              data: [4.2, 5.1, 6.8, 7.2, 6.9, 8.2],
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              fill: true,
              tension: 0.3
            },
            {
              label: 'Force Resilience %',
              data: [88, 86, 84, 82, 85, 88.5],
              borderColor: '#10b981',
              backgroundColor: 'transparent',
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } },
          scales: { y: { grid: { color: 'rgba(148, 163, 184, 0.1)' } }, x: { grid: { display: false } } }
        }
      });
    }
  }

  // ==========================================================
  // MEDICAL OFFICER: CLINICAL TREATMENT MATRIX & PRIORITY TRIAGE
  // ==========================================================
  async fetchTreatmentRoster() {
    try {
      const res = await fetch(`/api/personnel?sort=${this.treatmentSortOrder}`);
      this.treatmentPersonnelList = await res.json();

      // Count priority tiers
      let countImm = 0, countHigh = 0, countMed = 0, countLow = 0;
      this.treatmentPersonnelList.forEach(p => {
        const stress = p.liveStressLevel !== undefined ? p.liveStressLevel : (p.riskScore || 50);
        if (stress >= 70) countImm++;
        else if (stress >= 55) countHigh++;
        else if (stress >= 40) countMed++;
        else countLow++;
      });

      const elImm = document.getElementById('countImmediatePriority');
      const elHigh = document.getElementById('countHighPriority');
      const elMed = document.getElementById('countMediumPriority');
      const elLow = document.getElementById('countLowPriority');

      if (elImm) elImm.innerText = countImm;
      if (elHigh) elHigh.innerText = countHigh;
      if (elMed) elMed.innerText = countMed;
      if (elLow) elLow.innerText = countLow;

      this.renderTreatmentRoster();
    } catch(e) {
      console.error("fetchTreatmentRoster error", e);
    }
  }

  renderTreatmentRoster() {
    const grid = document.getElementById('treatmentRosterGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const q = (this.treatmentSearchText || '').toLowerCase().trim();
    const priority = this.treatmentPriorityFilter;

    let list = this.treatmentPersonnelList.filter(p => {
      const stress = p.liveStressLevel !== undefined ? p.liveStressLevel : (p.riskScore || 50);
      let matchQ = true;
      if (q) {
        const searchable = `${p.name} ${p.id} ${p.rank} ${p.force} ${p.unit} ${p.station}`.toLowerCase();
        matchQ = searchable.includes(q);
      }

      let matchP = true;
      if (priority === 'immediate') matchP = stress >= 70;
      else if (priority === 'high') matchP = stress >= 55 && stress < 70;
      else if (priority === 'medium') matchP = stress >= 40 && stress < 55;
      else if (priority === 'low') matchP = stress < 40;
      else if (priority === 'escalated') {
        matchP = (p.treatmentHistory || []).some(t => t.reportedBackToMO || (t.difference !== undefined && t.difference < 25));
      }

      return matchQ && matchP;
    });

    if (list.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:3rem; color:var(--text-muted); background:var(--bg-card); border-radius:var(--radius-lg); border:1px dashed var(--border-card);">
        <i class="fas fa-user-slash" style="font-size:2rem; margin-bottom:0.8rem; display:block;"></i>
        No personnel found matching the selected treatment priority or search criteria.
      </div>`;
      return;
    }

    list.forEach(p => {
      const stress = p.liveStressLevel !== undefined ? p.liveStressLevel : (p.riskScore || 50);
      let priorityClass = 'low';
      let priorityBadgeText = '🟢 Low Priority (<40%)';
      let priorityColor = '#10b981';

      if (stress >= 70) {
        priorityClass = 'immediate';
        priorityBadgeText = '🔴 Immediate Priority (≥ 70%)';
        priorityColor = '#ef4444';
      } else if (stress >= 55) {
        priorityClass = 'high';
        priorityBadgeText = '🟠 High Priority (55% - 69%)';
        priorityColor = '#f97316';
      } else if (stress >= 40) {
        priorityClass = 'medium';
        priorityBadgeText = '🟡 Medium Priority (40% - 54%)';
        priorityColor = '#eab308';
      }

      const req = p.treatmentRequired || {
        priority: priorityBadgeText,
        modalities: [
          stress >= 70 ? "Emergency Psychiatric Consultation & Clinical Decompression" :
          stress >= 55 ? "Intensive 1-on-1 Counseling & Trauma CBT" :
          stress >= 40 ? "Guided Biofeedback Therapy & Group Peer Circles" :
          "Routine Resilience Fortification Workshops"
        ],
        primaryFocus: "Autonomic re-regulation and psychological recovery."
      };

      // Check if re-referred by Welfare Officer (< 25% drop)
      const escalatedTrt = (p.treatmentHistory || []).find(t => t.reportedBackToMO || (t.difference !== undefined && t.difference < 25));

      const card = document.createElement('div');
      card.className = `treatment-soldier-card priority-${priorityClass}`;
      card.innerHTML = `
        <div class="treatment-card-header">
          <img src="${p.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'}" class="treatment-soldier-avatar" alt="${p.name}" />
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.4rem;">
              <div>
                <h4 style="font-size:1.05rem; font-weight:800; color:var(--text-main); margin:0;">${p.name}</h4>
                <p style="font-size:0.78rem; color:var(--text-muted); margin:0.2rem 0 0 0;">${p.rank} • ${p.force} (${p.id})</p>
              </div>
              <span class="treatment-priority-badge ${priorityClass}">${priorityBadgeText}</span>
            </div>
            <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.35rem;">
              <i class="fas fa-map-marker-alt"></i> ${p.station} | ${p.deploymentZone} (${p.monthsInZone || 12}m in zone)
            </p>
          </div>
        </div>

        <div class="treatment-stress-meter-row">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <span style="font-size:0.75rem; font-weight:800; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.03em;">Live Autonomic Stress Level</span>
            <strong style="font-size:1.15rem; font-weight:900; color:${priorityColor};">${stress}%</strong>
          </div>
          <div style="height:8px; background:rgba(148,163,184,0.2); border-radius:4px; overflow:hidden;">
            <div style="height:100%; width:${stress}%; background:${priorityColor}; border-radius:4px; transition:width 0.4s ease;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-muted); margin-top:0.35rem;">
            <span>Resting HR: <strong>${p.biometrics ? p.biometrics.restingHeartRate : 74} bpm</strong></span>
            <span>HRV: <strong>${p.biometrics ? p.biometrics.hrvMs : 38} ms</strong></span>
            <span>Overdue Leave: <strong>${p.hrIndicators ? p.hrIndicators.daysSinceLastLeave : 45}d</strong></span>
          </div>
        </div>

        ${escalatedTrt ? `
          <div style="background:rgba(239, 68, 68, 0.1); border:1.5px solid #ef4444; border-radius:var(--radius-md); padding:0.75rem 0.9rem; margin-bottom:1rem; font-size:0.8rem; color:#ef4444; display:flex; align-items:center; gap:0.6rem;">
            <i class="fas fa-exclamation-circle" style="font-size:1.1rem; flex-shrink:0;"></i>
            <div>
              <strong>Welfare Officer Escalation:</strong> Stress drop was only ${escalatedTrt.difference}% (&lt; 25% threshold). Secondary clinical intervention mandated.
            </div>
          </div>
        ` : ''}

        <div class="treatment-required-box ${priorityClass}">
          <h5><i class="fas fa-notes-medical"></i> Treatment Required (${req.priority || priorityBadgeText}):</h5>
          <ul class="treatment-modalities-list">
            ${(req.modalities || []).map(m => `<li>${m}</li>`).join('')}
          </ul>
        </div>

        <div class="treatment-card-actions">
          <button type="button" class="btn-welfare-action primary" style="flex:1; justify-content:center;" onclick="rakshakApp.openPrescribeModal('${p.id}')">
            <i class="fas fa-stethoscope"></i> Prescribe Treatment
          </button>
          <button type="button" class="btn-welfare-action secondary" onclick="rakshakApp.openSoldierModal('${p.id}')" title="View Full Profile">
            <i class="fas fa-id-card"></i> Profile
          </button>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  filterTreatmentPriority(priority, elem) {
    this.treatmentPriorityFilter = priority;
    const pills = document.querySelectorAll('#treatmentFilterPills .filter-pill');
    pills.forEach(p => p.classList.remove('active'));
    if (elem) elem.classList.add('active');
    else {
      pills.forEach(p => {
        if (p.getAttribute('onclick')?.includes(priority)) p.classList.add('active');
      });
    }
    this.renderTreatmentRoster();
  }

  handleTreatmentSearch(query) {
    this.treatmentSearchText = query;
    this.renderTreatmentRoster();
  }

  handleTreatmentSort(sortKey) {
    this.treatmentSortOrder = sortKey;
    this.fetchTreatmentRoster();
  }

  openPrescribeModal(pid = null) {
    const select = document.getElementById('prescribeSoldierSelect');
    if (select && this.personnelList) {
      select.innerHTML = '';
      this.personnelList.forEach(p => {
        const stress = p.liveStressLevel !== undefined ? p.liveStressLevel : (p.riskScore || 50);
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.innerText = `${p.rank} ${p.name} (${p.id}) • Live Stress: ${stress}%`;
        if (pid && p.id === pid) opt.selected = true;
        select.appendChild(opt);
      });
    }

    const selectedPid = pid || (select ? select.value : 'CRPF-94821');
    this.handlePrescribeSoldierChange(selectedPid);

    const modal = document.getElementById('prescribeTreatmentModal');
    if (modal) modal.classList.add('active');
  }

  closePrescribeModal() {
    const modal = document.getElementById('prescribeTreatmentModal');
    if (modal) modal.classList.remove('active');
  }

  handlePrescribeSoldierChange(pid) {
    const person = (this.personnelList || []).find(p => p.id === pid);
    const stress = person ? (person.liveStressLevel !== undefined ? person.liveStressLevel : (person.riskScore || 70)) : 70;
    const preInput = document.getElementById('prescribePreStress');
    const postInput = document.getElementById('prescribePostStress');
    if (preInput) preInput.value = stress;
    if (postInput) postInput.value = Math.max(25, stress - 22);
  }

  async submitPrescribeTreatment(e) {
    if (e) e.preventDefault();
    const pid = document.getElementById('prescribeSoldierSelect')?.value;
    const pre = parseFloat(document.getElementById('prescribePreStress')?.value || '70');
    const post = parseFloat(document.getElementById('prescribePostStress')?.value || '50');
    const treatmentName = document.getElementById('prescribeTreatmentSelect')?.value || 'Intensive 1-on-1 Clinical Counseling';
    const notes = document.getElementById('prescribeNotes')?.value || 'Clinical therapy session conducted and logged.';

    try {
      const res = await fetch(`/api/personnel/${pid}/treatment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treatmentName: treatmentName,
          category: 'Clinical Therapy',
          preStressLevel: pre,
          postStressLevel: post,
          notes: notes,
          treatingMO: 'Dr. Capt. Ananya Sharma (Unit MO)'
        })
      });
      const data = await res.json();
      this.closePrescribeModal();
      this.showToast(`Clinical Treatment Prescribed & Logged! Stress drop: ${data.treatment.difference}%`);
      await this.fetchPersonnel();
      await this.fetchTreatmentRoster();
    } catch(err) {
      console.error(err);
      this.showToast("Failed to record treatment session.");
    }
  }

  // ==========================================================
  // WELFARE OFFICER: TREATMENT OUTCOMES TRACKER & RE-REFERRAL (<25%)
  // ==========================================================
  async fetchWelfareTreatments() {
    try {
      const res = await fetch('/api/treatments');
      this.welfareTreatments = await res.json();

      let under25Count = 0;
      this.welfareTreatments.forEach(t => {
        const diff = t.difference !== undefined ? t.difference : (t.preStressLevel - t.postStressLevel);
        if (diff < 25) under25Count++;
      });

      const elTotal = document.getElementById('wfTotalTreatments');
      const elAction = document.getElementById('wfActionRequiredCount');
      if (elTotal) elTotal.innerText = this.welfareTreatments.length;
      if (elAction) elAction.innerText = under25Count;

      // Populate soldier selector dropdown with unique soldiers
      const soldierSelect = document.getElementById('welfareSoldierSelect');
      if (soldierSelect) {
        const currentVal = soldierSelect.value || 'all';
        soldierSelect.innerHTML = `<option value="all">Showing All Soldiers with Treatment History (${this.welfareTreatments.length})</option>`;
        const seen = new Set();
        this.welfareTreatments.forEach(t => {
          if (!seen.has(t.soldierId)) {
            seen.add(t.soldierId);
            const opt = document.createElement('option');
            opt.value = t.soldierId;
            opt.innerText = `${t.soldierRank} ${t.soldierName} (${t.soldierId}) - ${t.soldierForce}`;
            soldierSelect.appendChild(opt);
          }
        });
        soldierSelect.value = currentVal;
      }

      this.renderWelfareTreatments();
    } catch(e) {
      console.error("fetchWelfareTreatments error", e);
    }
  }

  renderWelfareTreatments() {
    const container = document.getElementById('welfareTreatmentsList');
    if (!container) return;
    container.innerHTML = '';

    let list = this.welfareTreatments;

    // Filter by soldier
    if (this.welfareSelectedSoldierId && this.welfareSelectedSoldierId !== 'all') {
      list = list.filter(t => t.soldierId === this.welfareSelectedSoldierId);
    }

    // Filter by outcome (under25 vs over25)
    if (this.welfareOutcomeFilter === 'under25') {
      list = list.filter(t => (t.difference !== undefined ? t.difference : (t.preStressLevel - t.postStressLevel)) < 25);
    } else if (this.welfareOutcomeFilter === 'over25') {
      list = list.filter(t => (t.difference !== undefined ? t.difference : (t.preStressLevel - t.postStressLevel)) >= 25);
    }

    if (list.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:3rem; color:var(--text-muted); background:var(--bg-card); border-radius:var(--radius-lg); border:1px dashed var(--border-card);">
        <i class="fas fa-clipboard-check" style="font-size:2.2rem; margin-bottom:0.8rem; display:block; color:#10b981;"></i>
        No treatment records matching the selected filter criteria.
      </div>`;
      return;
    }

    list.forEach(t => {
      const diff = t.difference !== undefined ? t.difference : (t.preStressLevel - t.postStressLevel);
      const isUnder25 = diff < 25;
      const isReported = Boolean(t.reportedBackToMO);

      const card = document.createElement('div');
      card.className = `welfare-treatment-item-card ${isUnder25 ? 'alert-under-25' : 'responsive-over-25'}`;
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:0.8rem;">
          <div style="display:flex; align-items:center; gap:0.9rem;">
            <img src="${t.soldierPhoto || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'}" style="width:48px; height:48px; border-radius:50%; object-fit:cover; border:2px solid var(--border-card);" alt="${t.soldierName}" />
            <div>
              <h4 style="font-size:1.1rem; font-weight:800; color:var(--text-main); margin:0;">${t.soldierRank} ${t.soldierName}</h4>
              <p style="font-size:0.8rem; color:var(--text-muted); margin:0.2rem 0 0 0;">${t.soldierForce} • Service ID: <strong>${t.soldierId}</strong> | Station: ${t.soldierStation}</p>
            </div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">Administered: ${t.date}</span>
            <div style="font-size:0.8rem; color:var(--text-main); font-weight:600; margin-top:0.2rem;">By: ${t.treatingMO}</div>
          </div>
        </div>

        <div style="background:var(--bg-card-subtle); padding:0.7rem 1rem; border-radius:var(--radius-md); border:1px solid var(--border-card); margin-bottom:1rem;">
          <strong style="color:var(--primary); font-size:0.9rem;">${t.treatmentName}</strong>
          <span style="font-size:0.75rem; color:var(--text-muted); margin-left:0.5rem;">[${t.category}]</span>
        </div>

        <!-- Before & After Stress Visualizer -->
        <div class="stress-delta-visualizer">
          <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted);">Treatment Stress Delta:</span>
          
          <div class="stress-metric-pill pre">
            <i class="fas fa-arrow-circle-up"></i> Before Treatment: <strong>${t.preStressLevel}%</strong>
          </div>

          <i class="fas fa-long-arrow-alt-right" style="color:var(--text-muted); font-size:1.1rem;"></i>

          <div class="stress-metric-pill ${isUnder25 ? 'post' : 'post-good'}">
            <i class="fas fa-arrow-circle-down"></i> After Treatment: <strong>${t.postStressLevel}%</strong>
          </div>

          <div class="stress-delta-badge ${isUnder25 ? 'under-25' : 'over-25'}">
            <i class="fas ${isUnder25 ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
            Difference: <strong>${diff}% Drop</strong> (${isUnder25 ? 'Under 25% Threshold' : '≥ 25% Optimal Recovery'})
          </div>
        </div>

        <div style="margin-bottom:1rem; font-size:0.85rem; color:var(--text-main); line-height:1.5;">
          <strong>Clinical Notes:</strong> ${t.notes || 'Routine therapeutic intervention.'}
        </div>

        <!-- Action / Reporting Section -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.8rem; padding-top:0.8rem; border-top:1px solid var(--border-card);">
          ${isUnder25 ? `
            <div style="color:#ef4444; font-size:0.82rem; font-weight:700; display:flex; align-items:center; gap:0.4rem;">
              <i class="fas fa-info-circle"></i>
              Stress delta (${diff}%) is less than 25%. Under military welfare protocol, soldier requires further clinical treatment.
            </div>
            <div>
              ${isReported ? `
                <button type="button" class="btn-reported-done" disabled>
                  <i class="fas fa-check-double"></i> Reported to Medical Officer (Further Treatment Queued)
                </button>
              ` : `
                <button type="button" class="btn-report-to-mo" onclick="rakshakApp.openReportToMoModal('${t.treatmentId}', '${t.soldierId}')">
                  <i class="fas fa-paper-plane"></i> Report Back to Medical Officer for Further Treatment
                </button>
              `}
            </div>
          ` : `
            <div style="color:#10b981; font-size:0.82rem; font-weight:700; display:flex; align-items:center; gap:0.4rem;">
              <i class="fas fa-check-circle"></i>
              Stress drop satisfies mandatory ≥ 25% recovery threshold. Soldier responding favorably to treatment.
            </div>
            <button type="button" class="btn-welfare-action secondary" onclick="rakshakApp.openSoldierModal('${t.soldierId}')">
              <i class="fas fa-id-card"></i> View Service Profile
            </button>
          `}
        </div>
      `;

      container.appendChild(card);
    });
  }

  handleWelfareSoldierFilter(soldierId) {
    this.welfareSelectedSoldierId = soldierId;
    this.renderWelfareTreatments();
  }

  filterWelfareOutcomes(mode, elem) {
    this.welfareOutcomeFilter = mode;
    const pills = document.querySelectorAll('#welfareFilterPills .filter-pill');
    pills.forEach(p => p.classList.remove('active'));
    if (elem) elem.classList.add('active');
    this.renderWelfareTreatments();
  }

  openReportToMoModal(treatmentId, soldierId) {
    const trt = this.welfareTreatments.find(t => t.treatmentId === treatmentId && t.soldierId === soldierId);
    if (!trt) return;
    this.currentReportingTreatment = trt;

    const diff = trt.difference !== undefined ? trt.difference : (trt.preStressLevel - trt.postStressLevel);
    const box = document.getElementById('reportToMoDetailsBox');
    if (box) {
      box.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
          <h4 style="font-size:1.05rem; font-weight:800; color:var(--text-main); margin:0;">${trt.soldierRank} ${trt.soldierName}</h4>
          <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted);">${trt.soldierId} • ${trt.soldierForce}</span>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin:0 0 0.8rem 0;"><strong>Recent Treatment:</strong> ${trt.treatmentName} (${trt.date})</p>
        <div style="display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
          <span class="stress-metric-pill pre">Pre-Treatment: <strong>${trt.preStressLevel}%</strong></span>
          <span>➔</span>
          <span class="stress-metric-pill post">Post-Treatment: <strong>${trt.postStressLevel}%</strong></span>
          <span class="stress-delta-badge under-25">Difference: <strong>${diff}% Drop (&lt; 25%)</strong></span>
        </div>
      `;
    }

    const notesInput = document.getElementById('reportToMoNotes');
    if (notesInput) {
      notesInput.value = `Patient experienced only a ${diff}% stress reduction following ${trt.treatmentName}. Persistent operational fatigue and sleep deficits observed. Requesting secondary clinical intervention and psychiatrist evaluation.`;
    }

    const modal = document.getElementById('reportToMoModal');
    if (modal) modal.classList.add('active');
  }

  closeReportToMoModal() {
    const modal = document.getElementById('reportToMoModal');
    if (modal) modal.classList.remove('active');
  }

  async confirmReportToMedicalOfficer() {
    if (!this.currentReportingTreatment) return;
    const trt = this.currentReportingTreatment;
    const notes = document.getElementById('reportToMoNotes')?.value || 'Stress delta < 25%. Escalated for further treatment.';

    try {
      const res = await fetch(`/api/personnel/${trt.soldierId}/report-to-mo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treatmentId: trt.treatmentId,
          referralNotes: notes
        })
      });
      const data = await res.json();
      this.closeReportToMoModal();
      this.showToast(`🚨 Escalation Dispatched! ${trt.soldierName} has been referred back to the Medical Officer.`);
      await this.fetchWelfareTreatments();
      await this.fetchPersonnel();
    } catch(err) {
      console.error(err);
      this.showToast("Failed to dispatch referral to Medical Officer.");
    }
  }

  initChatbot() {
    this.chatbot = new WelfareChatbot('view_chat');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.rakshakApp = new RakshakApp();
});
