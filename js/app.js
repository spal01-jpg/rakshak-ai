/**
 * Rakshak AI (रक्षक AI) - Main Application Controller
 * Ultra-Premium Tactical Welfare & Mental Resilience Platform
 * Clean, Non-Punitive, Air-Gapped, Zero-Game Architecture
 */

class RakshakApp {
  constructor() {
    this.currentView = 'soldier'; // 'soldier' | 'twin' | 'commander' | 'resilience' | 'chat'
    this.currentTheme = 'clean'; // 'clean' | 'cyber'
    this.selectedLoginRole = 'soldier';
    this.personnelList = [];
    this.activeFilter = 'all';
    this.currentSortKey = 'default';
    this.selectedSoldier = null;
    this.activeSoldierId = 'CRPF-94821';
    this.selectedMood = 3;
    
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
      else if (role === 'twin') usernameInput.value = 'WEL-04 (Maj. Sunita Rao - Welfare)';
    }
  }

  handleAuthLogin(roleOverride = null) {
    const role = roleOverride || this.selectedLoginRole;
    document.getElementById('authLandingView').style.display = 'none';
    document.getElementById('mainAppShell').style.display = 'flex';

    if (role === 'commander') {
      this.navigateToView('commander');
    } else if (role === 'twin') {
      this.navigateToView('twin');
    } else {
      this.navigateToView('soldier');
      this.checkSoldierConsent();
    }
    this.showToast(`Welcome! Logged in as: ${role.toUpperCase()}`);
  }

  logoutToLanding() {
    this.stopAmbientSound();
    this.resetBoxBreathing();
    document.getElementById('mainAppShell').style.display = 'none';
    document.getElementById('authLandingView').style.display = 'flex';
  }

  navigateToView(viewName) {
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

    if (viewName === 'soldier') {
      if (title) title.innerText = "Good Morning, Rajesh 👋";
      if (subtitle) subtitle.innerText = "Take a moment. Your well-being matters.";
      if (avatar) avatar.src = "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150";
      if (uName) uName.innerText = "Rajesh Kumar";
      if (uRole) uRole.innerText = "Havildar (CRPF)";
    } else if (viewName === 'twin') {
      if (title) title.innerText = "Digital Welfare Twin";
      if (subtitle) subtitle.innerText = "Your evolving resilience profile powered by AI (CRPF-94821)";
      this.initRadarAndTwinCharts();
    } else if (viewName === 'commander') {
      if (title) title.innerText = "Commander Operations Center";
      if (subtitle) subtitle.innerText = "Force-wide stress metrics, leave management, & welfare dispatch";
      if (avatar) avatar.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150";
      if (uName) uName.innerText = "Col. V. Saxena";
      if (uRole) uRole.innerText = "Commanding Officer";
      this.initCommanderCharts();
      this.renderCommanderTable(this.personnelList);
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
  }

  updateSleepDisplay(hours) {
    const valElem = document.getElementById('sleepHoursVal');
    if (!valElem) return;
    let label = "Optimal";
    if (hours < 5) label = "Critical Insomnia ⚠️";
    else if (hours < 6.5) label = "Sub-optimal";
    else if (hours > 9) label = "Elevated Fatigue";
    valElem.innerText = `${hours} Hours (${label})`;
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

    try {
      const res = await fetch('/api/self-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personnelId: this.activeSoldierId,
          moodScore: this.selectedMood,
          sleepHours: sleep,
          exhaustionLevel: sleep < 5 ? "Critical" : "Moderate",
          reportedSymptoms: symptoms
        })
      });
      const data = await res.json();
      this.showToast("Check-In Submitted! Your resilience twin has been updated.");

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

  initChatbot() {
    this.chatbot = new WelfareChatbot('view_chat');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.rakshakApp = new RakshakApp();
});
