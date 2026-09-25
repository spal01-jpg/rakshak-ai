/**
 * Rakshak AI (रक्षक AI) - Main Application Controller
 * Ultra-Premium Tactical Welfare & Mental Resilience Platform
 * Clean, Non-Punitive, Air-Gapped, Zero-Game Architecture
 */

class RakshakApp {
  constructor() {
    this.currentView = 'soldier'; // 'soldier' | 'twin' | 'commander' | 'welfare' | 'resilience' | 'chat'
    this.currentTheme = 'clean'; // 'clean' | 'cyber'
    this.selectedLoginRole = 'soldier'; // 'soldier' | 'commander' | 'welfare'
    this.personnelList = [];
    this.activeFilter = 'all';
    this.currentSortKey = 'default';
    this.selectedSoldier = null;
    this.activeSoldierId = 'CRPF-94821';
    this.selectedMood = 3;
    this.stressIndicatorMode = 'stress'; // 'stress' | 'wellbeing'
    this.lastCalculatedStressPct = 42;
    this.hasTriggeredStressPopup = false;

    // Welfare Officer Advisory & Validation Console State
    this.welfareActiveFilter = 'all';
    this.welfareSortKey = 'stress_desc';
    this.welfareSearchText = '';
    this.currentAdviseTargetPid = null;
    
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
    if (role !== 'soldier' && role !== 'commander' && role !== 'welfare') role = 'soldier';
    this.selectedLoginRole = role;
    document.querySelectorAll('.role-card-picker').forEach(c => c.classList.remove('active'));
    if (elem) elem.classList.add('active');

    const usernameInput = document.getElementById('loginUsernameInput');
    if (usernameInput) {
      if (role === 'soldier') usernameInput.value = 'CRPF-94821 (Rajesh Kumar)';
      else if (role === 'welfare') usernameInput.value = 'WEL-04 (Maj. Sunita Rao - Unit Welfare Officer)';
      else if (role === 'commander') usernameInput.value = 'CMD-01 (Col. Virendra Saxena)';
    }
  }

  handleAuthLogin(roleOverride = null) {
    let role = roleOverride || this.selectedLoginRole;
    if (role !== 'soldier' && role !== 'commander' && role !== 'welfare') role = 'soldier';
    this.selectedLoginRole = role;
    document.getElementById('authLandingView').style.display = 'none';
    document.getElementById('mainAppShell').style.display = 'flex';

    // Role-Based Navigation & Access Enforcement
    const navLiHome = document.getElementById('navLiHome');
    const navLiCommander = document.getElementById('navLiCommander');
    const navLiWelfare = document.getElementById('navLiWelfare');
    const navLiTwin = document.getElementById('navLiTwin');
    const navHomeText = document.querySelector('#navItemHome span');

    if (role === 'soldier') {
      // PERSONNEL (JAWAN) VIEW:
      // Only sees own daily check-in, live stress indicator, treatment indication & own twin
      if (navHomeText) navHomeText.innerText = 'Home (Check-In)';
      if (navLiHome) navLiHome.style.display = 'block';
      if (navLiCommander) navLiCommander.style.display = 'none';
      if (navLiWelfare) navLiWelfare.style.display = 'none';
      if (navLiTwin) navLiTwin.style.display = 'block'; // ONLY PERSONNEL HAS TWIN!

      this.navigateToView('soldier');
      this.checkSoldierConsent();
    } else if (role === 'welfare') {
      // WELFARE OFFICER VIEW:
      // Reviews all personnel stress ratings, validates them & advises Commander
      // Strictly no personal check-in or digital twin
      if (navLiHome) navLiHome.style.display = 'none';
      if (navLiCommander) navLiCommander.style.display = 'none';
      if (navLiWelfare) navLiWelfare.style.display = 'block';
      if (navLiTwin) navLiTwin.style.display = 'none'; // REMOVED FROM ALL EXCEPT PERSONNEL

      this.navigateToView('welfare');
    } else {
      // COMMANDER VIEW:
      // Can check his own live stress level & accesses Commander Operations Center
      // Twin panel removed from all except personnel!
      if (navHomeText) navHomeText.innerText = 'Personal Stress Check';
      if (navLiHome) navLiHome.style.display = 'block'; // COMMANDER ALLOWED TO CHECK LIVE STRESS!
      if (navLiCommander) navLiCommander.style.display = 'block';
      if (navLiWelfare) navLiWelfare.style.display = 'none';
      if (navLiTwin) navLiTwin.style.display = 'none'; // REMOVED FROM ALL EXCEPT PERSONNEL

      this.navigateToView('commander');
    }

    const roleTitles = {
      soldier: 'PERSONNEL (JAWAN)',
      welfare: 'WELFARE OFFICER',
      commander: 'COMMANDING OFFICER'
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
    // If logged in as personnel/soldier, deny access to commander operations roster & welfare console!
    if (this.selectedLoginRole === 'soldier' && (viewName === 'commander' || viewName === 'welfare')) {
      this.showToast("🔒 Access Restricted: Force roster & welfare advisory backchannel is restricted to Officers.");
      return;
    }

    // WELFARE OFFICER ACCESS CONTROL:
    if (this.selectedLoginRole === 'welfare' && (viewName === 'commander' || viewName === 'soldier' || viewName === 'twin')) {
      this.showToast("🔒 Access Restricted: Operational command & personal check-ins are restricted.");
      return;
    }

    // DIGITAL WELFARE TWIN RESTRICTION:
    // "remove digital welfare twin panel from all except personnel"
    if (viewName === 'twin' && this.selectedLoginRole !== 'soldier') {
      this.showToast("🔒 Access Restricted: Digital Welfare Twin panel is only accessible to active Personnel.");
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
    } else if (viewName === 'welfare') {
      if (title) title.innerText = "Welfare Officer Advisory Console";
      if (subtitle) subtitle.innerText = "Validate force stress ratings & dispatch action suggestions to Commanding Officer.";
      if (avatar) avatar.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150";
      if (uName) uName.innerText = "Maj. Sunita Rao";
      if (uRole) uRole.innerText = "Unit Welfare Officer";
      this.renderWelfareConsole();
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
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--text-muted);">No personnel matched your search criteria.</td></tr>`;
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

      // Welfare Advisory Column Content
      let advisoryHtml = `<span style="font-size:0.75rem; color:var(--text-muted);"><i class="fas fa-minus"></i> Routine Roster</span>`;
      const wAdv = p.welfareAdvisory;
      if (wAdv && wAdv.activeRecommendation) {
        const rec = wAdv.activeRecommendation;
        const isPending = rec.status === 'Pending Commander Approval';
        const isApproved = rec.status === 'Approved & Sanctioned';
        
        if (isPending) {
          advisoryHtml = `
            <div class="commander-advisory-cell">
              <div class="commander-advisory-badge pending" title="${rec.suggestedAction || ''}">
                <i class="fas fa-paper-plane" style="color:#f97316;"></i> <strong>${rec.actionType}</strong>
              </div>
              <div style="margin-top:0.25rem;">
                <button class="btn-commander-approve-pill" onclick="rakshakApp.commanderApproveAdvisory('${p.id}')">
                  <i class="fas fa-check"></i> Approve & Sanction
                </button>
              </div>
            </div>
          `;
        } else if (isApproved) {
          advisoryHtml = `
            <div class="commander-advisory-cell">
              <div class="commander-advisory-badge approved" title="${rec.suggestedAction || ''}">
                <i class="fas fa-check-circle" style="color:#10b981;"></i> <strong>${rec.actionType}</strong>
              </div>
              <div style="font-size:0.7rem; color:#10b981; font-weight:600;"><i class="fas fa-user-check"></i> Sanctioned by CO</div>
            </div>
          `;
        }
      }

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
        <td>${advisoryHtml}</td>
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

        ${p.welfareAdvisory?.activeRecommendation ? `
          <div style="background:rgba(2, 132, 199, 0.08); border:1.5px solid rgba(2, 132, 199, 0.3); border-radius:var(--radius-md); padding:1rem; margin-bottom:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
              <span style="font-weight:800; font-size:0.9rem; color:#0284c7;">
                <i class="fas fa-hand-holding-heart"></i> Welfare Officer Recommendation:
              </span>
              <span class="commander-advisory-badge ${p.welfareAdvisory.activeRecommendation.status === 'Approved & Sanctioned' ? 'approved' : 'pending'}">
                ${p.welfareAdvisory.activeRecommendation.status}
              </span>
            </div>
            <div style="font-size:0.85rem; font-weight:700; color:var(--text-main); margin-bottom:0.25rem;">
              Action: ${p.welfareAdvisory.activeRecommendation.actionType} (${p.welfareAdvisory.activeRecommendation.severityLevel || 'High'} Severity)
            </div>
            <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.4; margin-bottom:0.4rem;">
              ${p.welfareAdvisory.activeRecommendation.suggestedAction}
            </div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">
              Officer Rationale: "${p.welfareAdvisory.activeRecommendation.notes}" — ${p.welfareAdvisory.validatedBy || 'Maj. Sunita Rao'}
            </div>
            ${p.welfareAdvisory.activeRecommendation.status === 'Pending Commander Approval' ? `
              <div style="margin-top:0.75rem;">
                <button class="btn-commander-approve-pill" style="font-size:0.8rem; padding:0.4rem 1rem;" onclick="rakshakApp.commanderApproveAdvisory('${p.id}'); document.getElementById('personnelDetailModal').classList.remove('active');">
                  <i class="fas fa-check-circle"></i> Approve & Sanction Welfare Recommendation
                </button>
              </div>
            ` : ''}
          </div>
        ` : ''}

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
    const btnTreatment = document.getElementById('btnOptTreatmentIndication');
    if (btnStress) btnStress.classList.toggle('active', mode === 'stress');
    if (btnWellbeing) btnWellbeing.classList.toggle('active', mode === 'wellbeing');
    if (btnTreatment) btnTreatment.classList.toggle('active', mode === 'treatment');

    if (mode === 'treatment') {
      const box = document.getElementById('liveTreatmentIndicationBox');
      if (box) {
        box.classList.add('highlight-glow');
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => box.classList.remove('highlight-glow'), 2000);
      }
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

    // Mode-specific display (Stress % vs Wellbeing % vs Treatment Indication)
    const isStressMode = this.stressIndicatorMode === 'stress';
    const isWellbeingMode = this.stressIndicatorMode === 'wellbeing';
    const isTreatmentMode = this.stressIndicatorMode === 'treatment';
    const displayVal = isWellbeingMode ? wellbeingPct : stressPct;

    if (numElem) {
      numElem.innerText = `${displayVal}%`;
      if (!isWellbeingMode) {
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

    // Determine Severity Status & Advice
    let statusClass = 'moderate';
    let statusIcon = 'fa-info-circle';
    let statusText = 'Moderate Strain';
    let adviceText = 'Sub-optimal sleep and moderate mood place your autonomic load in the manageable range.';

    // 5. Treatment Indication Guidance (Informational Only - No Option to Schedule/Execute Therapy or Counseling)
    let priorityTier = 'low';
    let priorityBadgeText = 'Low Priority (< 40%)';
    let priorityTitle = 'Routine Preventive Wellness Indicated';
    let priorityPillClass = 'low';
    let modalities = [
      "Routine Resilience Fortification & Tactical Mindfulness",
      "Voluntary Bi-Weekly Digital Check-Ins",
      "Physical Recovery Cycles & Sleep Quality Maintenance"
    ];

    if (stressPct >= 70) {
      statusClass = 'critical';
      statusIcon = 'fa-exclamation-circle';
      statusText = 'Critical Stress • Action Needed';
      adviceText = 'Severe sleep deficit and operational exhaustion detected. High autonomic nervous system strain.';
      priorityTier = 'immediate';
      priorityBadgeText = 'Immediate Priority (≥ 70%)';
      priorityTitle = 'Clinical Crisis Decompression Indicated';
      priorityPillClass = 'immediate';
      modalities = [
        "In-Clinic Acute Clinical Decompression Protocol",
        "Emergency Psychiatric Medical Diagnostic Evaluation",
        "Immediate 72-Hour Relief from High-Hazard Duty & Night Patrols",
        "In-Patient Buddy Vigilance & Circadian Rest Reset"
      ];
    } else if (stressPct >= 55) {
      statusClass = 'high';
      statusIcon = 'fa-exclamation-triangle';
      statusText = 'High Stress • Fatigue Alert';
      adviceText = 'Elevated operational fatigue detected. Autonomic recovery cycles indicated.';
      priorityTier = 'high';
      priorityBadgeText = 'High Priority (55–69%)';
      priorityTitle = 'Intensive Clinical Care Indicated';
      priorityPillClass = 'high';
      modalities = [
        "Intensive 1-on-1 Psychological Counseling Sessions",
        "Trauma-Informed Cognitive Behavioral Therapy (CBT)",
        "7-Day Structured Sleep Restoration Protocol",
        "Autonomic Grounding & Biofeedback Regimen"
      ];
    } else if (stressPct >= 40) {
      statusClass = 'moderate';
      statusIcon = 'fa-info-circle';
      statusText = 'Moderate Strain • Stable';
      adviceText = 'Autonomic load is elevated but manageable. Prioritize 7+ hours sleep and brief recovery pauses.';
      priorityTier = 'medium';
      priorityBadgeText = 'Medium Priority (40–54%)';
      priorityTitle = 'Guided Support Regimen Indicated';
      priorityPillClass = 'medium';
      modalities = [
        "Guided Heart Rate Variability (HRV) Biofeedback Training",
        "Structured Peer Support & Unit Buddy Debriefing Circles",
        "Operational Fatigue Rotation & Shift Schedule Re-balancing",
        "Tactical 4-4-4-4 Box Breathing & Progressive Muscle Relaxation (PMR)"
      ];
    } else {
      statusClass = 'low';
      statusIcon = 'fa-check-circle';
      statusText = 'Low Stress • Restored';
      adviceText = 'Restorative sleep and positive outlook provide optimal cognitive focus and physical resilience.';
    }

    if (lblElem) {
      if (isTreatmentMode) {
        lblElem.innerText = `INDICATED: ${priorityTier.toUpperCase()} TREATMENT (${stressPct}%)`;
      } else if (isWellbeingMode) {
        lblElem.innerText = 'LIVE WELLBEING INDEX';
      } else {
        lblElem.innerText = 'LIVE STRESS LEVEL';
      }
    }

    if (barElem) {
      barElem.style.width = `${displayVal}%`;
      if (!isWellbeingMode) {
        barElem.style.background = 'linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%)';
      } else {
        barElem.style.background = 'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #10b981 100%)';
      }
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

    // Render Live Treatment Indication Box (Informational only - strictly no options to execute therapy/counseling)
    const trtBox = document.getElementById('liveTreatmentIndicationBox');
    if (trtBox) {
      trtBox.className = `live-treatment-indication-box tier-${priorityTier}`;
      trtBox.innerHTML = `
        <div class="live-treatment-header">
          <div class="treatment-priority-pill ${priorityPillClass}">
            <i class="fas fa-stethoscope"></i> <span>${priorityBadgeText}</span>
          </div>
          <span class="treatment-advisory-tag"><i class="fas fa-info-circle"></i> Indicative Clinical Guidance Only</span>
        </div>
        <div class="treatment-modalities-title">${priorityTitle}:</div>
        <ul class="treatment-modalities-list">
          ${modalities.map(m => `<li><i class="fas fa-check-circle"></i> <span>${m}</span></li>`).join('')}
        </ul>
        <div class="treatment-disclaimer-note">
          <i class="fas fa-shield-alt"></i>
          <span>
            <strong>Informational Advisory:</strong> Calculated in real-time from your current stress level (${stressPct}%). Without specialized diagnostic training datasets, Rakshak AI presents suggested treatment modalities strictly as advisory indications. No treatments, therapy sessions, or counseling can be booked or administered through this interface. Please report to base medical officers for formal clinical procedures.
          </span>
        </div>
      `;
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
      const userName = this.selectedLoginRole === 'commander' ? 'Commander Saxena' : 'Rajesh';
      if (this.chatbot && typeof this.chatbot.renderMessage === 'function') {
        setTimeout(() => {
          this.chatbot.renderMessage({
            sender: 'bot',
            text: `**Namaste ${userName}.** I noticed your live stress level is currently elevated at **${stressVal}%**. I am right here with you.\n\nEverything we share is strictly confidential, non-punitive, and 100% air-gapped from your service records. How are you feeling right now? Would you like to share what's on your mind, or do a 2-minute tactical breathing exercise together?`,
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
  // WELFARE OFFICER ADVISORY & VALIDATION CONSOLE
  // ==========================================================
  renderWelfareConsole() {
    const list = this.personnelList || [];
    
    // 1. Calculate Welfare KPIs
    const totalCount = list.length;
    const validatedCount = list.filter(p => p.welfareAdvisory && p.welfareAdvisory.isValidated).length;
    const criticalCount = list.filter(p => (p.liveStressLevel || p.riskScore || 0) >= 70).length;
    const advisoriesCount = list.filter(p => p.welfareAdvisory && p.welfareAdvisory.activeRecommendation).length;

    const elTot = document.getElementById('kWelfareTotal');
    const elVal = document.getElementById('kWelfareValidated');
    const elCrit = document.getElementById('kWelfareCritical');
    const elAdv = document.getElementById('kWelfareAdvisories');
    if (elTot) elTot.innerText = totalCount;
    if (elVal) elVal.innerText = validatedCount;
    if (elCrit) elCrit.innerText = criticalCount;
    if (elAdv) elAdv.innerText = advisoriesCount;

    // 2. Filter list
    let filtered = list.filter(p => {
      const stress = p.liveStressLevel || p.riskScore || 0;
      const wAdv = p.welfareAdvisory;

      if (this.welfareActiveFilter === 'pending_validation') {
        if (wAdv && wAdv.isValidated) return false;
      } else if (this.welfareActiveFilter === 'has_advisory') {
        if (!wAdv || !wAdv.activeRecommendation) return false;
      } else if (this.welfareActiveFilter === 'critical') {
        if (stress < 70) return false;
      } else if (this.welfareActiveFilter === 'high') {
        if (stress < 55 || stress >= 70) return false;
      } else if (this.welfareActiveFilter === 'moderate') {
        if (stress < 40 || stress >= 55) return false;
      } else if (this.welfareActiveFilter === 'low') {
        if (stress >= 40) return false;
      }

      if (this.welfareSearchText) {
        const q = this.welfareSearchText.toLowerCase();
        const searchable = `${p.name} ${p.id} ${p.rank} ${p.force} ${p.unit} ${p.station}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }

      return true;
    });

    // 3. Sort list
    if (this.welfareSortKey === 'stress_desc') {
      filtered.sort((a, b) => (b.liveStressLevel || b.riskScore || 0) - (a.liveStressLevel || a.riskScore || 0));
    } else if (this.welfareSortKey === 'stress_asc') {
      filtered.sort((a, b) => (a.liveStressLevel || a.riskScore || 0) - (b.liveStressLevel || b.riskScore || 0));
    } else if (this.welfareSortKey === 'leave_desc') {
      filtered.sort((a, b) => (b.hrIndicators?.daysSinceLastLeave || 0) - (a.hrIndicators?.daysSinceLastLeave || 0));
    } else if (this.welfareSortKey === 'name_asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // 4. Render cards into #welfarePersonnelContainer
    const container = document.getElementById('welfarePersonnelContainer');
    if (!container) return;
    container.innerHTML = '';

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:3rem; background:var(--bg-card); border-radius:var(--radius-lg); border:1px solid var(--border-card);">
          <div style="font-size:2.5rem; color:#94a3b8; margin-bottom:0.75rem;"><i class="fas fa-user-slash"></i></div>
          <h4 style="font-size:1.1rem; font-weight:700; color:var(--text-main); margin-bottom:0.3rem;">No Personnel Found</h4>
          <p style="font-size:0.85rem; color:var(--text-muted);">No soldiers matched the selected criteria in the Welfare Console.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(p => {
      const stress = p.liveStressLevel || p.riskScore || 50;
      let borderClass = 'low-border';
      let riskPillClass = 'low';
      let riskText = 'Low Stress';
      if (stress >= 70) {
        borderClass = 'critical-border';
        riskPillClass = 'critical';
        riskText = 'Critical Stress';
      } else if (stress >= 55) {
        borderClass = 'high-border';
        riskPillClass = 'high';
        riskText = 'High Stress';
      } else if (stress >= 40) {
        borderClass = 'moderate-border';
        riskPillClass = 'moderate';
        riskText = 'Moderate Stress';
      }

      const wAdv = p.welfareAdvisory;
      const isValidated = wAdv && wAdv.isValidated;
      const validatedBadge = isValidated 
        ? `<span class="badge-validated"><i class="fas fa-check-circle"></i> Rating Validated (${wAdv.validatedBy ? wAdv.validatedBy.split(' ')[1] : 'Officer'})</span>`
        : `<span class="badge-pending-val"><i class="fas fa-clock"></i> Rating Pending Validation</span>`;

      // Advisory section
      let advisoryHtml = '';
      if (wAdv && wAdv.activeRecommendation) {
        const rec = wAdv.activeRecommendation;
        const isApproved = rec.status === 'Approved & Sanctioned';
        const boxClass = isApproved ? 'status-approved' : 'status-pending';
        const statusIcon = isApproved ? 'fa-check-double' : 'fa-hourglass-half';
        const statusColor = isApproved ? '#10b981' : '#f97316';
        
        advisoryHtml = `
          <div class="welfare-advisory-display-box ${boxClass}">
            <div class="welfare-advisory-title-line">
              <span><i class="fas fa-paper-plane" style="color:${statusColor};"></i> Advisory: ${rec.actionType}</span>
              <span style="font-size:0.7rem; color:${statusColor}; font-weight:700;">
                <i class="fas ${statusIcon}"></i> ${rec.status}
              </span>
            </div>
            <div class="welfare-advisory-text">
              <strong>Suggestion to Commander:</strong> ${rec.suggestedAction || 'Operational relief advised.'}
            </div>
            ${rec.notes ? `<div style="font-size:0.72rem; color:var(--text-muted); margin-top:0.25rem; font-style:italic;">"${rec.notes}"</div>` : ''}
          </div>
        `;
      } else {
        advisoryHtml = `
          <div class="welfare-advisory-display-box" style="background:var(--bg-card-subtle); border-style:dashed;">
            <div style="font-size:0.75rem; color:var(--text-muted); display:flex; align-items:center; gap:0.4rem;">
              <i class="fas fa-info-circle"></i> No Commander advisory dispatched yet. Review stress & advise action if needed.
            </div>
          </div>
        `;
      }

      const leaveDays = p.hrIndicators ? p.hrIndicators.daysSinceLastLeave : 45;
      const sleepHours = p.hrIndicators ? p.hrIndicators.averageSleepHours : 6.0;
      const nightShifts = p.hrIndicators ? p.hrIndicators.nightDutyShiftsPastMonth : 8;
      const emergency = p.hrIndicators?.familyEmergencyStatus || p.aiRiskFactors?.[0] || 'No critical family emergency';

      const card = document.createElement('div');
      card.className = `welfare-soldier-card ${borderClass}`;
      card.innerHTML = `
        <div class="welfare-card-top-row">
          <img src="${p.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'}" class="welfare-soldier-avatar" alt="Avatar" />
          <div class="welfare-soldier-info">
            <div class="welfare-soldier-name">${p.name}</div>
            <div class="welfare-soldier-sub">${p.rank} • ${p.force} (${p.id})</div>
            <div class="welfare-soldier-sub" style="font-size:0.72rem; margin-top:0.15rem;">
              <i class="fas fa-map-marker-alt" style="color:#0284c7;"></i> ${p.station || 'Field Post'} • ${p.deploymentZone || 'Operational Zone'}
            </div>
          </div>
        </div>

        <div class="welfare-stress-rating-bar-wrap">
          <div class="welfare-stress-rating-header">
            <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Live Stress Rating</span>
            <div style="display:flex; align-items:center; gap:0.4rem;">
              <span class="welfare-stress-rating-val" style="color:${stress >= 70 ? '#ef4444' : stress >= 55 ? '#f97316' : stress >= 40 ? '#eab308' : '#10b981'};">${stress}%</span>
              <span class="risk-badge ${riskPillClass}" style="font-size:0.7rem; padding:0.15rem 0.5rem;">${riskText}</span>
            </div>
          </div>
          <div class="progress-track" style="height:6px; background:var(--border-card);">
            <div class="progress-fill" style="width:${stress}%; background:linear-gradient(90deg, #10b981, #f59e0b, #ef4444);"></div>
          </div>
        </div>

        <div class="welfare-vitals-grid">
          <div class="welfare-vital-box">
            <span class="welfare-vital-label">Days w/o Leave</span>
            <span class="welfare-vital-val" style="${leaveDays > 120 ? 'color:#ef4444;' : ''}">${leaveDays}d</span>
          </div>
          <div class="welfare-vital-box">
            <span class="welfare-vital-label">Avg Sleep</span>
            <span class="welfare-vital-val">${sleepHours}h</span>
          </div>
          <div class="welfare-vital-box">
            <span class="welfare-vital-label">Night Shifts</span>
            <span class="welfare-vital-val">${nightShifts}</span>
          </div>
        </div>

        <div style="font-size:0.75rem; color:var(--text-muted); background:var(--bg-card-subtle); padding:0.5rem 0.65rem; border-radius:var(--radius-sm); border:1px solid var(--border-card); line-height:1.4;">
          <strong style="color:var(--text-main);"><i class="fas fa-stethoscope" style="color:#0284c7;"></i> Hardship Flag:</strong> ${emergency}
        </div>

        <div class="welfare-status-badges-row">
          ${validatedBadge}
          <span style="font-size:0.72rem; color:var(--text-muted);"><i class="fas fa-user-secret"></i> Air-Gapped</span>
        </div>

        ${advisoryHtml}

        <div class="welfare-action-btn-row">
          <button class="btn-welfare-val ${isValidated ? 'validated' : ''}" onclick="rakshakApp.validatePersonnelRating('${p.id}')">
            <i class="fas ${isValidated ? 'fa-check' : 'fa-clipboard-check'}"></i> ${isValidated ? 'Re-Validate Rating' : 'Validate Rating'}
          </button>
          <button class="btn-welfare-advise" onclick="rakshakApp.openWelfareAdviseModal('${p.id}')">
            <i class="fas fa-paper-plane"></i> Advise Commander
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  }

  handleWelfareSearch(val) {
    this.welfareSearchText = val.trim();
    this.renderWelfareConsole();
  }

  filterWelfare(filterKey, elem) {
    this.welfareActiveFilter = filterKey;
    document.querySelectorAll('#view_welfare .filter-pill').forEach(btn => btn.classList.remove('active'));
    if (elem) elem.classList.add('active');
    this.renderWelfareConsole();
  }

  handleWelfareSortChange(sortKey) {
    this.welfareSortKey = sortKey;
    this.renderWelfareConsole();
  }

  async validatePersonnelRating(pid) {
    try {
      const res = await fetch(`/api/personnel/${pid}/welfare-validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          validatedBy: "Maj. Sunita Rao (Welfare Officer)",
          ratingStatus: "Validated",
          notes: "Stress rating reviewed and verified against field duty roster and biometric telemetry."
        })
      });
      const data = await res.json();
      if (data.success) {
        const p = this.personnelList.find(x => x.id.toLowerCase() === pid.toLowerCase());
        if (p) {
          p.welfareAdvisory = data.welfareAdvisory;
        }
        this.renderWelfareConsole();
        this.showToast(`Stress rating for ${p ? p.name : pid} validated by Welfare Officer!`);
      }
    } catch(e) {
      this.showToast("Rating validation failed.");
    }
  }

  openWelfareAdviseModal(pid) {
    const p = this.personnelList.find(x => x.id.toLowerCase() === pid.toLowerCase());
    if (!p) return;
    this.currentAdviseTargetPid = pid;

    const nameElem = document.getElementById('wModalSoldierName');
    const idElem = document.getElementById('wModalSoldierId');
    const stressElem = document.getElementById('wModalStressPct');
    const leaveElem = document.getElementById('wModalLeaveDays');
    const shiftsElem = document.getElementById('wModalNightShifts');
    const valElem = document.getElementById('wModalValidationStatus');
    const inputPid = document.getElementById('wAdviseSoldierId');
    const selectAction = document.getElementById('wAdviseActionType');
    const selectSev = document.getElementById('wAdviseSeverity');
    const textAction = document.getElementById('wAdviseSuggestedAction');
    const textNotes = document.getElementById('wAdviseNotes');

    const stress = p.liveStressLevel || p.riskScore || 50;
    const leaveDays = p.hrIndicators ? p.hrIndicators.daysSinceLastLeave : 45;
    const shifts = p.hrIndicators ? p.hrIndicators.nightDutyShiftsPastMonth : 8;
    const isValidated = p.welfareAdvisory && p.welfareAdvisory.isValidated;

    if (nameElem) nameElem.innerText = p.name;
    if (idElem) idElem.innerText = p.id;
    if (stressElem) stressElem.innerText = `${stress}% (${stress >= 70 ? 'Critical' : stress >= 55 ? 'High' : 'Moderate'})`;
    if (leaveElem) leaveElem.innerText = `${leaveDays} Days`;
    if (shiftsElem) shiftsElem.innerText = `${shifts} Shifts`;
    if (valElem) {
      valElem.innerText = isValidated ? "Validated" : "Pending Validation";
      valElem.style.color = isValidated ? "#10b981" : "#f59e0b";
    }
    if (inputPid) inputPid.value = p.id;

    // Check if existing recommendation
    const activeRec = p.welfareAdvisory?.activeRecommendation;
    if (activeRec) {
      if (selectAction) selectAction.value = activeRec.actionType;
      if (selectSev) selectSev.value = activeRec.severityLevel || "High";
      if (textAction) textAction.value = activeRec.suggestedAction || "";
      if (textNotes) textNotes.value = activeRec.notes || "";
    } else {
      // Smart Auto-Populate based on soldier context
      let defaultActionType = "Sanction Emergency Leave & 1-to-1 Personal Care";
      let defaultSev = stress >= 70 ? "Critical" : stress >= 55 ? "High" : "Moderate";
      
      if (leaveDays > 120 && stress >= 65) {
        defaultActionType = "Sanction Emergency Leave & 1-to-1 Personal Care";
      } else if (shifts >= 14) {
        defaultActionType = "Reduce Workload & Shift Duty Cap";
      } else if (stress >= 70) {
        defaultActionType = "Arrange 1-to-1 Personal Care for 3-5 Days";
      } else {
        defaultActionType = "Sanction 14-Day Compassionate Leave";
      }

      if (selectAction) selectAction.value = defaultActionType;
      if (selectSev) selectSev.value = defaultSev;
      this.handleAdvisoryTypeSelect(defaultActionType, p);
    }

    const modal = document.getElementById('welfareAdviseModal');
    if (modal) modal.classList.add('active');
  }

  closeWelfareAdviseModal() {
    const modal = document.getElementById('welfareAdviseModal');
    if (modal) modal.classList.remove('active');
  }

  handleAdvisoryTypeSelect(actionType, soldierObj = null) {
    const p = soldierObj || this.personnelList.find(x => x.id === this.currentAdviseTargetPid) || {};
    const textAction = document.getElementById('wAdviseSuggestedAction');
    const textNotes = document.getElementById('wAdviseNotes');
    const leaveDays = p.hrIndicators?.daysSinceLastLeave || 90;
    const emergency = p.hrIndicators?.familyEmergencyStatus || "Operational duty burnout";

    const presets = {
      "Sanction Emergency Leave & 1-to-1 Personal Care": {
        suggested: `Sanction 14-day emergency compassionate leave immediately; arrange dedicated sub-unit buddy for 1-to-1 personal care & debrief for 3 days prior to departure.`,
        notes: `Soldier has reached ${leaveDays} days without leave with active distress flags (${emergency}). Immediate compassionate home leave and peer support are necessary to prevent crisis.`
      },
      "Sanction 14-Day Compassionate Leave": {
        suggested: `Sanction 14-day priority compassionate leave to Rohtak/home station with travel allowance clearance.`,
        notes: `High leave deficit (${leaveDays} days overdue) causing acute sleep fragmentation. Sanctioning leave will restore autonomic balance.`
      },
      "Reduce Workload & Shift Duty Cap": {
        suggested: `Immediately cap night patrol duty to maximum 4 shifts per month; withdraw from frontline weapon-bearing posts for 7-day rest rotation.`,
        notes: `Severe operational circadian exhaustion observed. Capping workload will facilitate REM sleep restoration and autonomic recovery.`
      },
      "Arrange 1-to-1 Personal Care for 3-5 Days": {
        suggested: `Assign trusted senior buddy and Unit Welfare Officer for daily 1-to-1 personal care check-ins and operational decompression over the next 5 days.`,
        notes: `Soldier exhibiting symptoms of acute post-incident stress and emotional isolation. 1-to-1 dedicated personal care protocol advised.`
      },
      "Rotational Peace Station Transfer": {
        suggested: `Initiate administrative recommendation for fast-track rotational posting to a Category 'A' peace station.`,
        notes: `Prolonged hardship zone tenure (exceeding recommended deployment limit). Rotational posting recommended on compassionate welfare grounds.`
      },
      "Sub-Unit Decompression & Rest Rotation": {
        suggested: `Withdraw from tactical field operations for a mandatory 48-hour sub-unit rest and recovery regimen at base camp.`,
        notes: `High cumulative fatigue index detected. Brief operational pause advised.`
      }
    };

    const sel = presets[actionType] || presets["Sanction Emergency Leave & 1-to-1 Personal Care"];
    if (textAction) textAction.value = sel.suggested;
    if (textNotes) textNotes.value = sel.notes;
  }

  async submitWelfareAdvisory(e) {
    if (e && e.preventDefault) e.preventDefault();
    const pid = document.getElementById('wAdviseSoldierId')?.value || this.currentAdviseTargetPid;
    const actionType = document.getElementById('wAdviseActionType')?.value;
    const severity = document.getElementById('wAdviseSeverity')?.value;
    const suggestedAction = document.getElementById('wAdviseSuggestedAction')?.value;
    const notes = document.getElementById('wAdviseNotes')?.value;

    try {
      const res = await fetch(`/api/personnel/${pid}/welfare-advisory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: actionType,
          suggestedAction: suggestedAction,
          severityLevel: severity,
          notes: notes,
          validatedBy: "Maj. Sunita Rao (Welfare Officer)"
        })
      });
      const data = await res.json();
      if (data.success) {
        const p = this.personnelList.find(x => x.id.toLowerCase() === pid.toLowerCase());
        if (p) {
          p.welfareAdvisory = data.welfareAdvisory;
        }
        this.closeWelfareAdviseModal();
        this.renderWelfareConsole();
        this.showToast(`Advisory dispatched to Commanding Officer for ${p ? p.name : pid}! (Air-gapped from soldier)`);
      }
    } catch(e) {
      this.showToast("Failed to dispatch advisory.");
    }
  }

  async commanderApproveAdvisory(pid) {
    try {
      const res = await fetch(`/api/personnel/${pid}/commander-approve-advisory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvedBy: "Col. Virendra Saxena (Commanding Officer)",
          decisionNotes: "Approved and sanctioned as advised by Welfare Officer."
        })
      });
      const data = await res.json();
      if (data.success) {
        const idx = this.personnelList.findIndex(x => x.id.toLowerCase() === pid.toLowerCase());
        if (idx !== -1) {
          this.personnelList[idx] = data.personnel;
        }
        await this.fetchPersonnel();
        await this.fetchAnalytics();
        this.renderCommanderTable(this.personnelList);
        this.showToast(`Advisory Approved! Welfare sanction executed for ${data.personnel.name}.`);
      }
    } catch(e) {
      this.showToast("Advisory approval failed.");
    }
  }

  initChatbot() {
    this.chatbot = new WelfareChatbot('view_chat');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.rakshakApp = new RakshakApp();
});
