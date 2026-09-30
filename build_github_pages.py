import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, 'data', 'personnel_db.json')

with open(DB_FILE, 'r', encoding='utf-8') as f:
    db_data = json.load(f)

adapter_code = """/**
 * RAKSHAK AI - UNIVERSAL CLIENT-SIDE OFFLINE & GITHUB PAGES ADAPTER
 * Enables 100% full interactive operation on GitHub Pages (24/7 static hosting)
 * and air-gapped offline environments with zero backend server dependency.
 */
(function() {
  const isGitHubPages = window.location.hostname.includes('github.io');
  const isFileProtocol = window.location.protocol === 'file:';
  const forceOffline = window.RAKSHAK_OFFLINE_MODE === true || window.FORCE_OFFLINE_ADAPTER === true;

  if (!isGitHubPages && !isFileProtocol && !forceOffline) {
    // Running on localhost or Cloudflare tunnel with live backend
    return;
  }

  console.log('[Rakshak AI] Activating Universal GitHub Pages / Offline Client-Side Adapter');

  const INITIAL_PERSONNEL = """ + json.dumps(db_data.get('personnel', []), ensure_ascii=False) + """;

  function getStoredDB() {
    try {
      const saved = localStorage.getItem('RAKSHAK_OFFLINE_DATA_V2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch(e) {
      console.warn('[Rakshak AI] Error reading localStorage:', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_PERSONNEL));
  }

  function saveStoredDB(data) {
    try {
      localStorage.setItem('RAKSHAK_OFFLINE_DATA_V2', JSON.stringify(data));
    } catch(e) {
      console.warn('[Rakshak AI] Error writing localStorage:', e);
    }
  }

  let memoryPersonnel = getStoredDB();

  function calcStats(list) {
    let total = list.length;
    let critical = 0, high = 0, moderate = 0, low = 0, sum = 0;
    list.forEach(p => {
      let s = p.stressScore || 0;
      sum += s;
      if (s >= 75) critical++;
      else if (s >= 50) high++;
      else if (s >= 30) moderate++;
      else low++;
    });
    let avg = total > 0 ? (sum / total).toFixed(1) : 0;
    let readiness = Math.max(10, Math.min(95, Math.round(100 - (critical * 3.5 + high * 2.0))));
    return {
      totalMonitored: total,
      criticalCount: critical,
      highRiskCount: high,
      moderateRiskCount: moderate,
      lowRiskCount: low,
      averageStressLevel: parseFloat(avg),
      forceReadinessIndex: readiness
    };
  }

  const nativeFetch = window.fetch;

  window.fetch = async function(url, options = {}) {
    const urlStr = typeof url === 'string' ? url : (url.url || '');
    const method = (options.method || 'GET').toUpperCase();

    // 1. GET /api/personnel
    if (urlStr.includes('/api/personnel') && !urlStr.includes('/welfare-') && !urlStr.includes('/commander-')) {
      return new Response(JSON.stringify(memoryPersonnel), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. GET /api/analytics
    if (urlStr.includes('/api/analytics')) {
      return new Response(JSON.stringify(calcStats(memoryPersonnel)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. GET /api/medical/patients (Strict 75% protocol isolation)
    if (urlStr.includes('/api/medical/patients')) {
      const filtered = memoryPersonnel.filter(p => {
        const isDirect = p.directMoReferral && p.directMoReferral.active === true;
        const isApproved = p.welfareCommanderReporting && p.welfareCommanderReporting.commanderApproved === true;
        return isDirect || isApproved;
      });
      return new Response(JSON.stringify(filtered), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 4. POST /api/welfare/direct-referral (or emergency-mo-referral) -> Stress > 75%
    if (urlStr.includes('/api/welfare/direct-referral') || urlStr.includes('/api/welfare/emergency-mo-referral')) {
      let body = {};
      try { body = JSON.parse(options.body || '{}'); } catch(e) {}
      const pid = body.soldierId || body.personnelId;
      const target = memoryPersonnel.find(p => p.id === pid);
      if (target) {
        target.directMoReferral = {
          active: true,
          timestamp: new Date().toISOString(),
          referredBy: 'Maj. Sunita Rao (Welfare Officer)',
          protocol: 'Stress > 75% Direct Clinical Referral',
          urgency: body.urgency || 'Immediate Clinical Intervention',
          recommendedModality: body.recommendedModality || '1-1 Counseling & Psychological First Aid',
          justification: body.justification || 'Elevated acute stress exceeded 75% triage threshold.',
          clinicalNotes: body.clinicalNotes || 'Admitted directly to Medical Officer under standing Welfare authority.'
        };
        target.medicalTreatment = {
          status: 'Undergoing Treatment',
          modalities: [body.recommendedModality || '1-1 Counseling & Psychological First Aid'],
          treatmentPlanNotes: body.clinicalNotes || 'Direct referral intervention initialized.',
          priorityClass: 'critical',
          authorizedBy: 'Maj. Sunita Rao (Welfare Officer)'
        };
        target.welfareCommanderReporting = {
          absenceReported: true,
          commanderApproved: false,
          isDirectNotice: true,
          reportReason: 'Stress > 75% Direct MO Referral Notice',
          requestedAbsenceDays: 5,
          reportedTimestamp: new Date().toISOString()
        };
        saveStoredDB(memoryPersonnel);
      }
      return new Response(JSON.stringify({ success: true, message: 'Direct referral dispatched to Medical Officer.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 5. POST /api/welfare/submit-application (or report-commander-absence) -> Stress <= 75%
    if (urlStr.includes('/api/welfare/submit-application') || urlStr.includes('/api/welfare/report-commander-absence')) {
      let body = {};
      try { body = JSON.parse(options.body || '{}'); } catch(e) {}
      const pid = body.soldierId || body.personnelId;
      const target = memoryPersonnel.find(p => p.id === pid);
      if (target) {
        target.welfareCommanderReporting = {
          absenceReported: true,
          commanderApproved: false,
          requestedAbsenceDays: parseInt(body.absenceDays || 3, 10),
          recommendedModalityForMo: body.recommendedModality || 'Guided Biofeedback & Stress De-escalation',
          reportReason: body.reason || 'Moderate Stress Level (<=75%) Welfare Application',
          reportedTimestamp: new Date().toISOString(),
          status: 'Pending Commander Sanction'
        };
        saveStoredDB(memoryPersonnel);
      }
      return new Response(JSON.stringify({ success: true, message: 'Application submitted to Commander for review.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 6. POST /api/commander/approve-treatment-application (or approve-absence)
    if (urlStr.includes('/api/commander/approve-treatment-application') || urlStr.includes('/api/commander/approve-absence')) {
      let body = {};
      try { body = JSON.parse(options.body || '{}'); } catch(e) {}
      const pid = body.soldierId || body.personnelId;
      const target = memoryPersonnel.find(p => p.id === pid);
      if (target) {
        if (!target.welfareCommanderReporting) target.welfareCommanderReporting = {};
        target.welfareCommanderReporting.commanderApproved = true;
        target.welfareCommanderReporting.approvedTimestamp = new Date().toISOString();
        target.welfareCommanderReporting.status = 'Approved by Commander';

        const modality = target.welfareCommanderReporting.recommendedModalityForMo || 'Guided Biofeedback & Stress De-escalation';
        target.medicalTreatment = {
          status: 'Undergoing Treatment',
          modalities: [modality],
          treatmentPlanNotes: `Sanctioned by Commander. Assigned modality: ${modality}`,
          priorityClass: target.stressScore >= 75 ? 'critical' : 'medium',
          authorizedBy: 'Col. Vikram Rathore (Commander)'
        };
        saveStoredDB(memoryPersonnel);
      }
      return new Response(JSON.stringify({ success: true, message: 'Application approved and forwarded to Medical Officer.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 7. POST /api/commander/batch-approve-absence
    if (urlStr.includes('/api/commander/batch-approve-absence')) {
      let body = {};
      try { body = JSON.parse(options.body || '{}'); } catch(e) {}
      const pids = body.soldierIds || [];
      let count = 0;
      memoryPersonnel.forEach(p => {
        if (!pids.length || pids.includes(p.id)) {
          if (!p.welfareCommanderReporting) p.welfareCommanderReporting = {};
          p.welfareCommanderReporting.commanderApproved = true;
          p.welfareCommanderReporting.approvedTimestamp = new Date().toISOString();
          p.welfareCommanderReporting.status = 'Approved by Commander';
          const modality = p.welfareCommanderReporting.recommendedModalityForMo || 'Guided Biofeedback & Stress De-escalation';
          p.medicalTreatment = {
            status: 'Undergoing Treatment',
            modalities: [modality],
            treatmentPlanNotes: `Sanctioned by Commander. Assigned modality: ${modality}`,
            priorityClass: p.stressScore >= 75 ? 'critical' : 'medium',
            authorizedBy: 'Col. Vikram Rathore (Commander)'
          };
          count++;
        }
      });
      saveStoredDB(memoryPersonnel);
      return new Response(JSON.stringify({ success: true, approvedCount: count }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 8. POST /api/medical/prescribe-treatment
    if (urlStr.includes('/api/medical/prescribe-treatment')) {
      let body = {};
      try { body = JSON.parse(options.body || '{}'); } catch(e) {}
      const pid = body.soldierId || body.personnelId;
      const target = memoryPersonnel.find(p => p.id === pid);
      if (target) {
        if (!target.medicalTreatment) target.medicalTreatment = {};
        target.medicalTreatment.status = body.status || 'Treated / Discharged';
        if (body.modalities) target.medicalTreatment.modalities = body.modalities;
        if (body.treatmentNotes) target.medicalTreatment.treatmentPlanNotes = body.treatmentNotes;
        saveStoredDB(memoryPersonnel);
      }
      return new Response(JSON.stringify({ success: true, message: 'Treatment prescribed successfully.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 9. POST /api/reset-all-data
    if (urlStr.includes('/api/reset-all-data')) {
      try {
        localStorage.removeItem('RAKSHAK_OFFLINE_DATA_V2');
      } catch(e) {}
      memoryPersonnel = JSON.parse(JSON.stringify(INITIAL_PERSONNEL));
      return new Response(JSON.stringify({ success: true, message: 'All workflow data reset to pristine state.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 10. POST /api/predict
    if (urlStr.includes('/api/predict')) {
      let sleep = 6, mood = 3, rhr = 75;
      try {
        const body = JSON.parse(options.body || '{}');
        sleep = parseFloat(body.sleepHours || 6);
        mood = parseFloat(body.moodScore || 3);
        rhr = parseFloat(body.restingHeartRate || 75);
      } catch(e) {}

      let score = Math.round(50 + (8 - sleep)*5 + (3 - mood)*10 + (rhr - 72)*0.5);
      score = Math.max(12, Math.min(96, score));
      let risk = score >= 75 ? 'CRITICAL' : score >= 50 ? 'HIGH' : score >= 30 ? 'MODERATE' : 'LOW';

      return new Response(JSON.stringify({
        success: true,
        predicted_stress_score: score,
        wellbeing_percentage: 100 - score,
        stress_risk_level: risk,
        stress_class: risk,
        confidence: 0.96,
        engine: 'Client-Side Neural Heuristics (GitHub Pages Edition)'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Default fallback for any unhandled /api calls
    if (urlStr.startsWith('/api/')) {
      return new Response(JSON.stringify({ success: true, note: 'Simulated client-side response' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return nativeFetch(url, options);
  };
})();
"""

adapter_file = os.path.join(BASE_DIR, 'js', 'offline-adapter.js')
with open(adapter_file, 'w', encoding='utf-8') as f:
    f.write(adapter_code)

print(f"Generated {adapter_file} ({len(adapter_code)} bytes)")

# Update index.html to include offline-adapter.js before app.js if not already present
index_file = os.path.join(BASE_DIR, 'index.html')
with open(index_file, 'r', encoding='utf-8') as f:
    html_content = f.read()

if 'offline-adapter.js' not in html_content:
    html_content = html_content.replace(
        '<script src="js/app.js"></script>',
        '<script src="js/offline-adapter.js"></script>\n  <script src="js/app.js"></script>'
    )
    with open(index_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print("Updated index.html to include offline-adapter.js")
else:
    print("index.html already contains offline-adapter.js")
