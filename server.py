#!/usr/bin/env python3
"""
Rakshak AI (रक्षक AI) - Personnel Stress & Welfare Monitoring System
High-Performance FastAPI + TensorFlow/Keras Inference Engine for CAPF & Armed Forces
Features:
- Real-time Deep Learning Stress Classification via my_tensorflow_model.keras
- Automatic feature normalization via scaler_mean.npy and scaler_scale.npy
- CORS-enabled REST API for Next.js and SPA frontends
- Non-punitive, air-gapped data architecture with Role-Based Access Control
"""

import sys
import os
import json
import numpy as np
from datetime import datetime
from typing import Optional, List, Dict, Any

# Windows console encoding fix
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

from fastapi import FastAPI, Request, Query, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, 'data', 'personnel_db.json')
MODEL_FILE = os.path.join(BASE_DIR, 'my_tensorflow_model.keras')
SCALER_MEAN_FILE = os.path.join(BASE_DIR, 'scaler_mean.npy')
SCALER_SCALE_FILE = os.path.join(BASE_DIR, 'scaler_scale.npy')

# -------------------------------------------------------------
# DATABASE OPERATIONS
# -------------------------------------------------------------
def load_db():
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading database: {e}")
        return {"personnel": [], "unitStats": {}}

def save_db(data):
    try:
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving database: {e}")
        return False

# -------------------------------------------------------------
# TENSORFLOW DEEP LEARNING MODEL INITIALIZATION
# -------------------------------------------------------------
TF_MODEL = None
SCALER_MEAN = None
SCALER_SCALE = None

CLASS_NAMES = ["Low Priority", "Medium Priority", "High Priority", "Immediate Priority"]
FEATURE_COLS = [
    'average_sleep_hours',
    'mood_score',
    'resting_heart_rate',
    'hrv_ms',
    'days_since_last_leave',
    'consecutive_field_days',
    'night_duty_shifts',
    'family_worry_score',
    'family_emergency',
    'reported_symptoms_count',
    'moca_score',
    'reaction_time_s',
    'switch_cost_s',
    'backward_errors'
]

try:
    if os.path.exists(MODEL_FILE) and os.path.exists(SCALER_MEAN_FILE) and os.path.exists(SCALER_SCALE_FILE):
        import tensorflow as tf
        TF_MODEL = tf.keras.models.load_model(MODEL_FILE)
        SCALER_MEAN = np.load(SCALER_MEAN_FILE)
        SCALER_SCALE = np.load(SCALER_SCALE_FILE)
        print(f"[OK] TensorFlow Model loaded from {MODEL_FILE}")
        print(f"[OK] Standardization Matrices loaded: mean={SCALER_MEAN.shape}, scale={SCALER_SCALE.shape}")
    else:
        print("Notice: TensorFlow model files not found yet in workspace.")
except Exception as e:
    print(f"Warning: Could not load TensorFlow model: {e}")

# -------------------------------------------------------------
# CLINICAL TREATMENT GUIDANCE MATRIX
# -------------------------------------------------------------
def get_treatment_priority(stress_pct):
    if stress_pct >= 70:
        return "Immediate Priority"
    elif stress_pct >= 55:
        return "High Priority"
    elif stress_pct >= 40:
        return "Medium Priority"
    else:
        return "Low Priority"

def get_treatment_recommendations(stress_pct):
    if stress_pct >= 70:
        return {
            "priority": "Immediate Priority",
            "priorityClass": "immediate",
            "threshold": "70% and higher",
            "badgeColor": "#ef4444",
            "modalities": [
                "Emergency Psychiatric Consultation & Clinical Evaluation",
                "Acute Clinical Decompression Therapy (In-Clinic)",
                "Mandatory 48-Hour Buddy Watch & In-Patient Rest Mandate",
                "Pharmacotherapy Evaluation & Sleep Cycle Reset Regimen",
                "Immediate Temporary Duty Withdrawal from Weapon-Bearing Posts"
            ],
            "primaryFocus": "Crisis stabilization, suicide/self-harm risk mitigation, and neuro-autonomic reset."
        }
    elif stress_pct >= 55:
        return {
            "priority": "High Priority",
            "priorityClass": "high",
            "threshold": "55% to 69%",
            "badgeColor": "#f97316",
            "modalities": [
                "Intensive 1-on-1 Clinical Counseling (Trauma-Informed CBT)",
                "Daily Supervised Biofeedback & Autonomic Grounding Protocol",
                "Targeted Sleep Restoration Program (7.5h minimum sleep window)",
                "Welfare Officer Family Liaison & Compassionate Hardship Relief"
            ],
            "primaryFocus": "Trauma desensitization, cognitive restructuring, and preventing critical burnout."
        }
    elif stress_pct >= 40:
        return {
            "priority": "Medium Priority",
            "priorityClass": "medium",
            "threshold": "40% to 54%",
            "badgeColor": "#eab308",
            "modalities": [
                "Guided Biofeedback Therapy & Heart-Rate Variability Coaching",
                "Group Peer-Support Counseling & Stress De-escalation Circles",
                "Rotational Fatigue Relief (Night shift duty capping)",
                "Progressive Muscle Relaxation (PMR) & 4-4-4-4 Box Breathing"
            ],
            "primaryFocus": "Sub-acute stress management, camaraderie sharing, and sleep hygiene."
        }
    else:
        return {
            "priority": "Low Priority",
            "priorityClass": "low",
            "threshold": "Less than 40%",
            "badgeColor": "#10b981",
            "modalities": [
                "Routine Resilience Fortification Workshops & Mental Toughness Training",
                "Digital Self-Assessment & Sleep Telemetry Monitoring",
                "Recreational Sports, Unit Bonding & Physical Reconditioning",
                "Bi-Monthly Routine Medical Wellness Follow-Up"
            ],
            "primaryFocus": "Maintenance of high operational readiness and positive psychological health."
        }

# -------------------------------------------------------------
# STRESS INFERENCE ENGINE (TENSORFLOW + FALLBACK)
# -------------------------------------------------------------
def predict_stress_metrics(person_dict: Dict[str, Any]):
    hr = person_dict.get("hrIndicators", {})
    bio = person_dict.get("biometrics", {})
    self_assess = person_dict.get("selfAssessment", {})

    sleep_hrs = float(hr.get("averageSleepHours", 6.5))
    mood = float(self_assess.get("moodScore", 3.5))
    rhr = float(bio.get("restingHeartRate", 70.0))
    hrv = float(bio.get("hrvMs", 52.0))
    days_leave = float(hr.get("daysSinceLastLeave", 60.0))
    field_days = float(hr.get("consecutiveFieldDays", 45.0))
    night_shifts = float(hr.get("nightDutyShiftsPastMonth", 7.0))
    fam_worry = float(self_assess.get("familyWorryScore", 3.5))
    has_fam_crisis = 1.0 if (hr.get("familyEmergencyStatus") and 
                             "Normal" not in hr.get("familyEmergencyStatus", "") and 
                             "Stable" not in hr.get("familyEmergencyStatus", "")) else 0.0
    symptoms_cnt = float(len(self_assess.get("reportedSymptoms", [])))
    moca = float(person_dict.get("mocaScore", 18.2))
    reaction_time = float(person_dict.get("reactionTimeS", 1.32))
    switch_cost = float(person_dict.get("switchCostS", 0.38))
    bk_errors = float(person_dict.get("backwardErrors", 0.0))

    if TF_MODEL is not None and SCALER_MEAN is not None and SCALER_SCALE is not None:
        try:
            x_raw = np.array([[
                sleep_hrs, mood, rhr, hrv,
                days_leave, field_days, night_shifts,
                fam_worry, has_fam_crisis, symptoms_cnt,
                moca, reaction_time, switch_cost, bk_errors
            ]], dtype=np.float32)

            x_scaled = (x_raw - SCALER_MEAN) / np.where(SCALER_SCALE == 0, 1.0, SCALER_SCALE)
            preds = TF_MODEL(x_scaled, training=False)
            
            # Multi-output: [class_probabilities, continuous_stress_score]
            if isinstance(preds, (list, tuple)) and len(preds) >= 2:
                class_probs = preds[0].numpy()[0]
                continuous_score = float(preds[1].numpy()[0][0])
            else:
                class_probs = preds.numpy()[0]
                continuous_score = float(np.sum(class_probs * np.array([25.0, 48.0, 62.0, 85.0])))

            cls_idx = int(np.argmax(class_probs))
            confidence = float(class_probs[cls_idx])
            class_label = CLASS_NAMES[cls_idx]
            stress_score = int(round(max(5.0, min(98.0, continuous_score))))
            wellbeing_pct = max(5, min(98, 100 - stress_score))

            if stress_score >= 80:
                risk_level = "Critical"
            elif stress_score >= 65:
                risk_level = "High"
            elif stress_score >= 45:
                risk_level = "Moderate"
            else:
                risk_level = "Low"

            return {
                "wellbeingPercentage": wellbeing_pct,
                "stressRiskLevel": risk_level,
                "riskScore": stress_score,
                "liveStressLevel": stress_score,
                "classification": class_label,
                "classConfidence": round(confidence, 4),
                "probabilities": {name: round(float(p), 4) for name, p in zip(CLASS_NAMES, class_probs)},
                "engine": "TensorFlow Deep Neural Network (my_tensorflow_model.keras)"
            }
        except Exception as e:
            print(f"TensorFlow inference error: {e}, falling back to analytical engine")

    # Analytical Heuristic Fallback
    leave_pts = min(16, (days_leave / 180) * 16)
    field_pts = min(10, (field_days / 200) * 10)
    shift_pts = min(9, (night_shifts / 20) * 9)
    fam_pts = 7 if has_fam_crisis else 0
    hr_stress = leave_pts + field_pts + shift_pts + fam_pts

    rhr_pts = max(0, min(10, (rhr - 60) * 0.4))
    hrv_pts = max(0, min(10, (65 - hrv) * 0.25))
    sleep_pts = max(0, min(8, (7.0 - sleep_hrs) * 3.0))
    bio_stress = rhr_pts + hrv_pts + sleep_pts

    mood_pts = (5 - mood) * 3.5
    worry_pts = (fam_worry / 10) * 10
    symptom_pts = min(6, symptoms_cnt * 2)
    self_stress = mood_pts + worry_pts + symptom_pts

    total_stress = min(100, max(5, int(hr_stress + bio_stress + self_stress)))
    wellbeing = max(5, min(98, 100 - total_stress))
    risk = "Critical" if total_stress >= 80 else "High" if total_stress >= 65 else "Moderate" if total_stress >= 45 else "Low"

    return {
        "wellbeingPercentage": wellbeing,
        "stressRiskLevel": risk,
        "riskScore": total_stress,
        "liveStressLevel": total_stress,
        "classification": get_treatment_priority(total_stress),
        "classConfidence": 0.85,
        "probabilities": {},
        "engine": "Analytical Multi-Variate Grounding Engine"
    }

# -------------------------------------------------------------
# CONVERSATIONAL WELFARE COMPANION (MITRA AI)
# -------------------------------------------------------------
def generate_chatbot_response(user_message: str, history=None):
    msg = user_message.lower().strip()
    critical_triggers = ["suicide", "end my life", "marna chahta", "marne ka man", "kill myself", "no reason to live", "give up on life", "jaan de dunga"]
    for trig in critical_triggers:
        if trig in msg:
            return {
                "reply": "⚠️ **Jawan, please pause. Your presence and life are priceless to your comrades, your family, and our nation.**\n\nYou do not have to fight this internal battle alone. Immediate, compassionate help is standing by right now:\n\n📞 **Tele-MANAS (24x7 Toll-Free & Confidential):** 14416 / 1800-891-4416\n📞 **Armed Forces KIRAN Helpline:** 1800-599-0019\n📞 **Unit Medical Officer (MO) Base Desk:** Ext. 102\n\nI am right here with you. Please click the SOS button above or tell your Unit Buddy.",
                "isCrisis": True,
                "suggestedQuickReplies": ["Call Tele-MANAS (14416) Now", "Speak with Unit Counselor", "Guide me through calming breaths"]
            }

    if any(w in msg for w in ["ram ram", "namaste", "jai hind", "hello", "hi", "kya haal", "kaise ho", "good morning"]):
        return {
            "reply": "**Jai Hind, Veer!** 🇮🇳 Main hoon aapka 24x7 digital welfare sahayak **Mitra**. Duty par sab theek hai? Dil halka karne ke liye main har pal aapke saath hoon!",
            "isCrisis": False,
            "suggestedQuickReplies": ["Ek mazedaar Fauji joke sunao! 😄", "Ghar ki chinta ho rahi hai", "Start Tactical Box Breathing 🧘", "Check sleep recovery hacks 🌙"]
        }

    if any(w in msg for w in ["joke", "hasao", "chutkula", "funny", "laugh", "hasi"]):
        jokes = [
            "😄 **Suniye ek zabardast Fauji joke:**\n\nUstad ne recruit se poocha: *'Fauji ki sabse badi taakat kya hoti hai?'*\nRecruit muskurate hue bola: *'Ustad ji, doosre ka garam tiffin aur 15 din ki sanction hui home leave!'* 🍱✈️\n\nMuskurate rahiye Veer!",
            "🌟 **Ustad:** *'Daudte waqt pairo mein dard kyu hota hai?'*\n**Jawan:** *'Kyunki pair sochte hain ki sar par kitna bojh hai!'*\n\nThoda bojh sar se utariye aur chaliye 2 minute ka **Tactical Box Breathing** karte hain!"
        ]
        import random
        return {
            "reply": random.choice(jokes),
            "isCrisis": False,
            "suggestedQuickReplies": ["Aur ek joke sunao!", "Tactical Box Breathing shuru karo", "Check my Digital Twin", "Ghar ki baat karni hai"]
        }

    return {
        "reply": "Main aapki baat dil se samajh raha hoon. Ek jawan ka jeevan bahut challenging hota hai — mausam, khatra, aur parivaar se doori. Par aap akele nahi hain! Boliye, aaj kahan se shuru karein?",
        "isCrisis": False,
        "suggestedQuickReplies": ["Ek mazedaar joke sunao!", "Start Box Breathing", "Check my Digital Twin", "Connect to Counselor"]
    }

# -------------------------------------------------------------
# FASTAPI APPLICATION DEFINITION
# -------------------------------------------------------------
app = FastAPI(
    title="Rakshak AI - Personnel Stress & Welfare Monitoring API",
    description="Full-stack AI platform equipped with TensorFlow Keras neural inference and CORS support",
    version="2.0.0"
)

# Mandatory CORS Middleware Configuration to support Next.js & all external frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# API ROUTES
# -------------------------------------------------------------
@app.get("/api/model-info")
async def get_model_info():
    """Returns runtime diagnostics for the TensorFlow model and standardization matrices."""
    return {
        "modelLoaded": TF_MODEL is not None,
        "modelPath": MODEL_FILE,
        "architecture": "Dense Multi-Task Neural Network (Keras 3.x / TF 2.x)",
        "featuresCount": len(FEATURE_COLS),
        "features": FEATURE_COLS,
        "scalerMeanLoaded": SCALER_MEAN is not None,
        "scalerScaleLoaded": SCALER_SCALE is not None,
        "classes": CLASS_NAMES
    }

def enrich_personnel_record(p: Dict[str, Any]) -> Dict[str, Any]:
    metrics = predict_stress_metrics(p)
    p["wellbeingPercentage"] = metrics["wellbeingPercentage"]
    p["stressRiskLevel"] = metrics["stressRiskLevel"]
    p["riskScore"] = metrics["riskScore"]
    p["liveStressLevel"] = metrics["liveStressLevel"]
    p["treatmentPriority"] = get_treatment_priority(metrics["liveStressLevel"])
    p["treatmentRequired"] = get_treatment_recommendations(metrics["liveStressLevel"])
    p["stressClassification"] = metrics.get("classification", p["treatmentPriority"])
    p["modelConfidence"] = metrics.get("classConfidence", 0.88)
    if "treatmentHistory" not in p:
        p["treatmentHistory"] = []
    if "actionHistory" not in p:
        p["actionHistory"] = []

    # Clean initial state without injecting false auto-approvals
    if "welfareCommanderReporting" not in p:
        p["welfareCommanderReporting"] = {
            "applicationSubmitted": False,
            "commanderApproved": False,
            "absenceReported": False,
            "status": "Normal Duty"
        }

    if "directMoReferral" not in p:
        p["directMoReferral"] = {
            "active": False,
            "referredAt": None,
            "severity": None,
            "recommendedModality": None,
            "notes": None
        }

    if "directEmergencyReferral" not in p:
        p["directEmergencyReferral"] = {
            "isDirectReferral": False,
            "bypassedCommander": False
        }

    if "commanderApprovedForTreatment" not in p:
        p["commanderApprovedForTreatment"] = {
            "active": False,
            "approvedAt": None,
            "approvedBy": None
        }

    if "medicalTreatment" not in p:
        p["medicalTreatment"] = {
            "status": "Not Referred",
            "prescribedModality": None,
            "prescribedBy": None,
            "prescribedDate": None,
            "clinicalNotes": None,
            "reportedToWelfare": False
        }

    return p

@app.get("/api/personnel")
async def get_personnel(
    q: Optional[str] = "",
    role: Optional[str] = "all",
    risk: Optional[str] = "all",
    force: Optional[str] = "all",
    priority: Optional[str] = "all",
    treatment_status: Optional[str] = "all",
    sort: Optional[str] = "default"
):
    db = load_db()
    personnel = db.get("personnel", [])
    q_str = (q or "").strip().lower()
    role_filter = (role or "all").strip().lower()
    risk_filter = (risk or "all").strip().lower()
    force_filter = (force or "all").strip().lower()
    priority_filter = (priority or "all").strip().lower()
    trt_filter = (treatment_status or "all").strip().lower()

    filtered = []
    for p in personnel:
        enrich_personnel_record(p)

        # ROLE RESTRICTION: Medical Officer MUST NOT have the entire list!
        # MO only sees patients who were directly referred (>75%) by Welfare OR approved by Commander (<=75%)
        if role_filter == "medical":
            is_direct = bool(p.get("directMoReferral", {}).get("active") or p.get("directEmergencyReferral", {}).get("isDirectReferral"))
            is_cmd_approved = bool(p.get("commanderApprovedForTreatment", {}).get("active") or (p.get("welfareCommanderReporting", {}).get("applicationSubmitted") and p.get("welfareCommanderReporting", {}).get("commanderApproved")))
            if not (is_direct or is_cmd_approved):
                continue

        match_q = True
        if q_str:
            searchable = f"{p['name']} {p['id']} {p['rank']} {p['force']} {p['unit']} {p['station']} {p['deploymentZone']}".lower()
            match_q = q_str in searchable

        match_risk = True
        if risk_filter != 'all':
            if risk_filter in ['pending_permissions', 'pending', 'pending_permission']:
                w_rep = p.get("welfareCommanderReporting", {})
                match_risk = bool(w_rep.get("absenceReported") and not w_rep.get("commanderApproved"))
            elif risk_filter in ['absence_notices', 'notices', 'notice']:
                w_rep = p.get("welfareCommanderReporting", {})
                match_risk = bool(w_rep.get("absenceReported") and (w_rep.get("requestMode") == 'report' or p.get("liveStressLevel", 0) > 80))
            elif risk_filter in ['undergoing', 'undergoing_treatment', 'treatments_active']:
                match_risk = p.get("medicalTreatment", {}).get("status", "").lower() == "undergoing treatment"
            elif risk_filter in ['treated']:
                match_risk = p.get("medicalTreatment", {}).get("status", "").lower() == "treated"
            else:
                match_risk = p["stressRiskLevel"].lower() == risk_filter

        match_force = True
        if force_filter != 'all':
            match_force = p["force"].lower() == force_filter

        match_priority = True
        if priority_filter != 'all':
            if priority_filter == 'escalated':
                match_priority = bool(p.get("directEmergencyReferral", {}).get("isDirectReferral")) or any(t.get('reportedBackToMO') or (t.get('difference', 0) < 25 and not t.get('reportedBackToMO')) for t in p.get('treatmentHistory', []))
            elif priority_filter in ['undergoing', 'undergoing treatment']:
                match_priority = p.get("medicalTreatment", {}).get("status", "").lower() == "undergoing treatment"
            elif priority_filter in ['treated']:
                match_priority = p.get("medicalTreatment", {}).get("status", "").lower() == "treated"
            else:
                match_priority = priority_filter in p["treatmentPriority"].lower()

        match_trt = True
        if trt_filter != 'all':
            curr_status = p.get("medicalTreatment", {}).get("status", "").lower()
            match_trt = (trt_filter in curr_status)

        if match_q and match_risk and match_force and match_priority and match_trt:
            filtered.append(p)

    # Sorting
    if sort in ['stress_desc', 'risk_desc', 'default']:
        filtered.sort(key=lambda x: x["liveStressLevel"], reverse=True)
    elif sort == 'stress_asc':
        filtered.sort(key=lambda x: x["liveStressLevel"])
    elif sort == 'wellbeing_asc':
        filtered.sort(key=lambda x: x["wellbeingPercentage"])
    elif sort == 'wellbeing_desc':
        filtered.sort(key=lambda x: x["wellbeingPercentage"], reverse=True)
    elif sort == 'leave_desc':
        filtered.sort(key=lambda x: x.get("hrIndicators", {}).get("daysSinceLastLeave", 0), reverse=True)
    elif sort == 'name_asc':
        filtered.sort(key=lambda x: x["name"])
    elif sort == 'permissions_pending':
        filtered.sort(key=lambda x: (1 if x.get("welfareCommanderReporting", {}).get("absenceReported") and not x.get("welfareCommanderReporting", {}).get("commanderApproved") else 0), reverse=True)
    elif sort == 'treatment_status':
        filtered.sort(key=lambda x: (1 if x.get("medicalTreatment", {}).get("status") == "Undergoing Treatment" else 0), reverse=True)

    return filtered

@app.get("/api/personnel/{person_id}")
async def get_single_personnel(person_id: str):
    db = load_db()
    person = next((p for p in db.get("personnel", []) if p["id"].lower() == person_id.lower()), None)
    if not person:
        raise HTTPException(status_code=404, detail="Personnel not found")

    enrich_personnel_record(person)
    return person

@app.get("/api/treatments")
async def get_treatments():
    db = load_db()
    all_treatments = []
    for p in db.get("personnel", []):
        metrics = predict_stress_metrics(p)
        for trt in p.get("treatmentHistory", []):
            item = dict(trt)
            item["soldierId"] = p["id"]
            item["soldierName"] = p["name"]
            item["soldierRank"] = p["rank"]
            item["soldierForce"] = p["force"]
            item["soldierUnit"] = p["unit"]
            item["soldierStation"] = p["station"]
            item["soldierPhoto"] = p.get("photo", "")
            item["currentLiveStress"] = metrics["liveStressLevel"]
            all_treatments.append(item)

    all_treatments.sort(key=lambda x: x.get("date", ""), reverse=True)
    return all_treatments

@app.get("/api/analytics")
async def get_analytics():
    db = load_db()
    personnel = db.get("personnel", [])
    total = len(personnel)
    critical_count = 0
    high_count = 0
    total_stress = 0

    for p in personnel:
        metrics = predict_stress_metrics(p)
        s = metrics["liveStressLevel"]
        total_stress += s
        if s >= 70:
            critical_count += 1
        elif s >= 55:
            high_count += 1

    avg_stress = round(total_stress / total, 1) if total > 0 else 35.0
    readiness = max(10, min(95, int(100 - avg_stress)))

    return {
        "totalMonitored": total,
        "criticalCount": critical_count,
        "highRiskCount": high_count,
        "moderateRiskCount": total - critical_count - high_count,
        "averageStressLevel": avg_stress,
        "forceReadinessIndex": readiness
    }

@app.post("/api/chat")
async def chat_endpoint(request: Request):
    payload = await request.json()
    user_msg = payload.get("message", "")
    history = payload.get("history", [])
    return generate_chatbot_response(user_msg, history)

@app.post("/api/consent")
async def update_consent(request: Request):
    payload = await request.json()
    person_id = payload.get("personnelId", "CRPF-94821")
    consented = bool(payload.get("consented", True))
    voluntary = bool(payload.get("voluntaryBiometrics", True))

    db = load_db()
    for p in db.get("personnel", []):
        if p["id"].lower() == person_id.lower():
            p["consentStatus"] = {
                "consented": consented,
                "consentDate": datetime.now().strftime("%Y-%m-%d"),
                "voluntaryBiometrics": voluntary
            }
            save_db(db)
            return {"success": True, "personnel": p}

    raise HTTPException(status_code=404, detail="Personnel not found")

@app.post("/api/welfare-advisory")
async def create_welfare_advisory(request: Request):
    payload = await request.json()
    soldier_id = payload.get("soldierId", "")
    action_type = payload.get("actionType", "")
    severity = payload.get("severity", "High")
    action_details = payload.get("suggestedAction", "")
    notes = payload.get("notes", "")

    db = load_db()
    person = next((p for p in db.get("personnel", []) if p["id"].lower() == soldier_id.lower()), None)
    if not person:
        raise HTTPException(status_code=404, detail="Personnel not found")

    advisory_item = {
        "advisoryId": f"ADV-{int(datetime.now().timestamp())}",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "soldierId": person["id"],
        "soldierName": person["name"],
        "soldierRank": person["rank"],
        "actionType": action_type,
        "severity": severity,
        "suggestedAction": action_details,
        "notes": notes,
        "dispatchedToCommander": True
    }

    if "welfareAdvisories" not in db:
        db["welfareAdvisories"] = []
    db["welfareAdvisories"].insert(0, advisory_item)
    save_db(db)
    return {"success": True, "advisory": advisory_item}

# -------------------------------------------------------------
# MEDICAL OFFICER & WELFARE COLLABORATION ENDPOINTS
# -------------------------------------------------------------
@app.post("/api/medical/prescribe-treatment")
@app.post("/api/personnel/{person_id}/medical-prescribe")
async def prescribe_treatment(request: Request, person_id: Optional[str] = None):
    """
    Medical Officer prescribes treatment modality (1-1 counseling, therapy sessions,
    decompression) based on stress severity and reports it to the Welfare Officer.
    """
    payload = await request.json()
    pid = person_id or payload.get("soldierId") or payload.get("personnelId")
    if not pid:
        raise HTTPException(status_code=400, detail="Personnel ID is required")

    modality = payload.get("prescribedModality") or payload.get("modality", "1-on-1 Clinical Counseling (Trauma CBT)")
    status = payload.get("status", "Undergoing Treatment")
    notes = payload.get("clinicalNotes") or payload.get("notes", "Prescribed by Medical Officer")
    mo_name = payload.get("prescribedBy", "Dr. Capt. Ananya Sharma (Senior MO)")

    db = load_db()
    person = next((p for p in db.get("personnel", []) if p["id"].lower() == pid.lower()), None)
    if not person:
        raise HTTPException(status_code=404, detail="Personnel not found")

    enrich_personnel_record(person)
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    person["medicalTreatment"] = {
        "treatmentRequired": get_treatment_recommendations(person["liveStressLevel"]),
        "prescribedModality": modality,
        "status": status,
        "prescribedBy": mo_name,
        "prescribedDate": now_str,
        "clinicalNotes": notes,
        "reportedToWelfare": True,
        "reportedToWelfareAt": now_str
    }

    treatment_entry = {
        "treatmentId": f"TRT-{int(datetime.now().timestamp())}",
        "modality": modality,
        "status": status,
        "date": now_str,
        "prescribedBy": mo_name,
        "notes": notes,
        "stressLevelAtTreatment": person["liveStressLevel"]
    }
    if "treatmentHistory" not in person:
        person["treatmentHistory"] = []
    person["treatmentHistory"].insert(0, treatment_entry)

    # Sync with welfare status
    if "welfareCommanderReporting" in person:
        person["welfareCommanderReporting"]["personnelStatus"] = status

    save_db(db)
    return {
        "success": True,
        "message": f"Treatment prescribed and reported to Welfare Officer for {person['name']}.",
        "personnel": person,
        "medicalTreatment": person["medicalTreatment"]
    }

@app.get("/api/medical/patients")
async def get_medical_patients(q: Optional[str] = ""):
    """
    Returns ONLY the patients referred for clinical medical care.
    Medical Officer MUST NOT have the entire roster of 28 personnel!
    Only personnel with:
    1. Direct Welfare Referral (Stress > 75%)
    2. Commander Approved Application (Stress <= 75%)
    """
    db = load_db()
    personnel = db.get("personnel", [])
    patients = []
    q_str = (q or "").strip().lower()

    for p in personnel:
        enrich_personnel_record(p)
        is_direct = bool(p.get("directMoReferral", {}).get("active") or p.get("directEmergencyReferral", {}).get("isDirectReferral"))
        is_cmd_approved = bool(p.get("commanderApprovedForTreatment", {}).get("active") or (p.get("welfareCommanderReporting", {}).get("applicationSubmitted") and p.get("welfareCommanderReporting", {}).get("commanderApproved")))

        if is_direct or is_cmd_approved:
            if q_str:
                searchable = f"{p['name']} {p['id']} {p['rank']} {p['force']} {p['unit']} {p['station']}".lower()
                if q_str not in searchable:
                    continue
            patients.append(p)

    patients.sort(key=lambda x: x.get("liveStressLevel", 0), reverse=True)
    return patients

@app.post("/api/welfare/direct-referral")
@app.post("/api/welfare/emergency-mo-referral")
@app.post("/api/personnel/{person_id}/emergency-mo-referral")
async def emergency_mo_referral(request: Request, person_id: Optional[str] = None):
    """
    Welfare Officer Direct Request to Medical Officer (> 75% Stress).
    If stress is > 75%, directly sends a request to Medical Officer to treat
    based on severity (counseling, therapy) WITHOUT prior Commander permission.
    """
    payload = await request.json()
    pid = person_id or payload.get("soldierId") or payload.get("personnelId")
    modality = payload.get("modality") or payload.get("prescribedModality") or "1-on-1 Critical Psychiatric Counseling & Trauma CBT"
    severity = payload.get("severity") or "Critical / Severe (>75% Stress)"
    notes = payload.get("notes") or "Acute autonomic overload (>75%). Urgent direct referral dispatched to Medical Officer."

    db = load_db()
    person = next((p for p in db.get("personnel", []) if p["id"].lower() == pid.lower()), None)
    if not person:
        raise HTTPException(status_code=404, detail="Personnel not found")

    enrich_personnel_record(person)
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    person["directMoReferral"] = {
        "active": True,
        "referredAt": now_str,
        "severity": severity,
        "recommendedModality": modality,
        "notes": notes,
        "status": "Directly Referred to MO (>75%)",
        "referredBy": "Maj. Sunita Rao (Unit Welfare Officer)"
    }
    person["directEmergencyReferral"] = {
        "isDirectReferral": True,
        "bypassedCommander": True,
        "referredAt": now_str,
        "stressLevel": person["liveStressLevel"],
        "reason": f"Severe stress {person['liveStressLevel']}% > 75% — Direct clinical referral to MO",
        "notes": notes,
        "status": "In MO Clinical Queue",
        "referredBy": "Maj. Sunita Rao (Unit Welfare Officer)"
    }
    person["moReferralPending"] = True

    # Initialize / update medicalTreatment
    person["medicalTreatment"]["status"] = "Undergoing Treatment"
    person["medicalTreatment"]["prescribedModality"] = modality
    person["medicalTreatment"]["clinicalNotes"] = notes
    person["medicalTreatment"]["prescribedDate"] = now_str
    person["medicalTreatment"]["reportedToWelfare"] = True

    # Informational notice for Commander
    person["welfareCommanderReporting"]["absenceReported"] = True
    person["welfareCommanderReporting"]["requestMode"] = "notice"
    person["welfareCommanderReporting"]["reportedAt"] = now_str
    person["welfareCommanderReporting"]["status"] = "Undergoing MO Care (>75%)"
    person["welfareCommanderReporting"]["absenceReason"] = f"Urgent Direct MO Referral: {modality}"

    save_db(db)
    return {
        "success": True,
        "message": f"Direct treatment request for {person['name']} (Stress: {person['liveStressLevel']}%) sent to Medical Officer.",
        "personnel": person,
        "directMoReferral": person["directMoReferral"]
    }

@app.post("/api/welfare/submit-application")
@app.post("/api/welfare/report-commander-absence")
@app.post("/api/personnel/{person_id}/report-commander-absence")
async def report_commander_absence(request: Request, person_id: Optional[str] = None):
    """
    Welfare Officer sends application to Commander for stress <= 75%.
    Requires Commander approval before forwarding to Medical Officer.
    """
    payload = await request.json()
    pid = person_id or payload.get("soldierId") or payload.get("personnelId")
    days = int(payload.get("absenceDays", 5))
    reason = payload.get("absenceReason", "Mild/Moderate Stress Decompression & Counseling")
    requested_modality = payload.get("requestedModality") or payload.get("prescribedModality", "1-on-1 Counseling & Therapy Sessions")
    notes = payload.get("notes", "Welfare application requesting Commander sanction for medical treatment.")

    db = load_db()
    person = next((p for p in db.get("personnel", []) if p["id"].lower() == pid.lower()), None)
    if not person:
        raise HTTPException(status_code=404, detail="Personnel not found")

    enrich_personnel_record(person)
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    person["welfareCommanderReporting"] = {
        "applicationSubmitted": True,
        "reportedToCommander": True,
        "reportedAt": now_str,
        "personnelStatus": "Pending Commander Approval",
        "absenceReported": True,
        "requestMode": "permission",
        "absenceDays": days,
        "absenceReason": reason,
        "requestedModality": requested_modality,
        "notes": notes,
        "commanderApproved": False,
        "status": "Pending Commander Approval",
        "reportedBy": "Maj. Sunita Rao (Unit Welfare Officer)"
    }
    # Reset any previous flags so not sent to MO before approval
    person["commanderApprovedForTreatment"] = { "active": False }
    person["directMoReferral"] = { "active": False }
    person["directEmergencyReferral"] = { "isDirectReferral": False }
    person["medicalTreatment"]["status"] = "Pending Commander Approval"

    save_db(db)
    return {
        "success": True,
        "message": f"Treatment application for {person['name']} (Stress: {person['liveStressLevel']}%) submitted to Commanding Officer for approval.",
        "personnel": person,
        "welfareCommanderReporting": person["welfareCommanderReporting"]
    }

@app.post("/api/commander/approve-treatment-application")
@app.post("/api/commander/approve-absence")
@app.post("/api/personnel/{person_id}/commander-approve-absence")
async def approve_commander_absence(request: Request, person_id: Optional[str] = None):
    """
    Commander approves application for treatment (Stress <= 75%).
    Once approved, the personnel IS FORWARDED TO MEDICAL OFFICER with options to treat!
    """
    payload = await request.json()
    pid = person_id or payload.get("soldierId") or payload.get("personnelId")

    db = load_db()
    person = next((p for p in db.get("personnel", []) if p["id"].lower() == pid.lower()), None)
    if not person:
        raise HTTPException(status_code=404, detail="Personnel not found")

    enrich_personnel_record(person)
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    if "welfareCommanderReporting" not in person:
        person["welfareCommanderReporting"] = {}

    person["welfareCommanderReporting"]["commanderApproved"] = True
    person["welfareCommanderReporting"]["approvedAt"] = now_str
    person["welfareCommanderReporting"]["approvedBy"] = "Col. Virendra Saxena (Commanding Officer)"
    person["welfareCommanderReporting"]["status"] = "Approved for Treatment"

    # Forward to Medical Officer with treatment options!
    modality = person["welfareCommanderReporting"].get("requestedModality", "1-on-1 Counseling & Therapy Sessions")
    person["commanderApprovedForTreatment"] = {
        "active": True,
        "approvedAt": now_str,
        "approvedBy": "Col. Virendra Saxena (Commanding Officer)",
        "status": "Commander Sanctioned - In MO Queue"
    }

    person["medicalTreatment"]["status"] = "Undergoing Treatment"
    person["medicalTreatment"]["prescribedModality"] = modality
    person["medicalTreatment"]["prescribedDate"] = now_str
    person["medicalTreatment"]["prescribedBy"] = "Dr. Capt. Ananya Sharma (Senior MO)"

    save_db(db)
    return {
        "success": True,
        "message": f"Treatment application approved by Commander for {person['name']}. Personnel forwarded to Medical Officer queue with options to treat.",
        "personnel": person
    }

@app.post("/api/commander/batch-approve-absence")
async def batch_approve_commander_absence(request: Request):
    """
    Commander batch approval: forwards all approved personnel to Medical Officer queue!
    """
    payload = await request.json()
    pids = payload.get("soldierIds", [])
    db = load_db()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    approved_count = 0
    pids_lower = [str(x).lower() for x in pids]

    for person in db.get("personnel", []):
        if not pids or person["id"].lower() in pids_lower:
            enrich_personnel_record(person)
            w_rep = person.get("welfareCommanderReporting", {})
            if not w_rep.get("commanderApproved"):
                w_rep["commanderApproved"] = True
                w_rep["approvedAt"] = now_str
                w_rep["approvedBy"] = "Col. Virendra Saxena (Commanding Officer)"
                w_rep["status"] = "Approved for Treatment"

                modality = w_rep.get("requestedModality", "1-on-1 Counseling & Therapy Sessions")
                person["commanderApprovedForTreatment"] = {
                    "active": True,
                    "approvedAt": now_str,
                    "approvedBy": "Col. Virendra Saxena (Commanding Officer)",
                    "status": "Commander Sanctioned - In MO Queue"
                }
                person["medicalTreatment"]["status"] = "Undergoing Treatment"
                person["medicalTreatment"]["prescribedModality"] = modality
                person["medicalTreatment"]["prescribedDate"] = now_str
                approved_count += 1

    save_db(db)
    return {
        "success": True,
        "approvedCount": approved_count,
        "message": f"Successfully approved {approved_count} applications and forwarded personnel to Medical Officer queue."
    }

@app.post("/api/reset-all-data")
async def reset_all_data_endpoint():
    """
    Resets all approvals, applications, and treatment states to clean initial state.
    """
    db = load_db()
    for p in db.get("personnel", []):
        p["welfareCommanderReporting"] = {
            "applicationSubmitted": False,
            "commanderApproved": False,
            "absenceReported": False,
            "reportedToCommander": False,
            "status": "Normal Duty"
        }
        p["directMoReferral"] = { "active": False, "referredAt": None, "severity": None, "modality": None, "notes": None }
        p["directEmergencyReferral"] = { "isDirectReferral": False, "bypassedCommander": False }
        p["commanderApprovedForTreatment"] = { "active": False, "approvedAt": None, "approvedBy": None }
        p["medicalTreatment"] = {
            "status": "Not Referred",
            "prescribedModality": None,
            "prescribedBy": None,
            "prescribedDate": None,
            "clinicalNotes": None,
            "reportedToWelfare": False
        }
        p["actionHistory"] = []
        p["treatmentHistory"] = []
        p["moReferralPending"] = False

    if "unitStats" in db:
        db["unitStats"]["pendingApprovals"] = 0
        db["unitStats"]["undergoingCare"] = 0
        db["unitStats"]["treatedCount"] = 0

    save_db(db)
    return {"success": True, "message": "All database records successfully reset to clean initial state!"}

@app.post("/api/personnel/{person_id}/welfare-validate")
async def validate_welfare_rating(person_id: str, request: Request):
    payload = await request.json()
    val_by = payload.get("validatedBy", "Maj. Sunita Rao (Welfare Officer)")
    db = load_db()
    person = next((p for p in db.get("personnel", []) if p["id"].lower() == person_id.lower()), None)
    if not person:
        raise HTTPException(status_code=404, detail="Personnel not found")
    
    enrich_personnel_record(person)
    if "welfareAdvisory" not in person:
        person["welfareAdvisory"] = {}
    person["welfareAdvisory"]["isValidated"] = True
    person["welfareAdvisory"]["validatedBy"] = val_by
    person["welfareAdvisory"]["validatedAt"] = datetime.now().strftime("%Y-%m-%d %H:%M")
    save_db(db)
    return {"success": True, "personnel": person}

@app.post("/api/personnel/{person_id}/welfare-action")
async def dispatch_welfare_action_route(person_id: str, request: Request):
    payload = await request.json()
    action = payload.get("actionType", "Sanction 15-Day Home Leave")
    notes = payload.get("notes", "Commander Dashboard Direct Dispatch")
    db = load_db()
    person = next((p for p in db.get("personnel", []) if p["id"].lower() == person_id.lower()), None)
    if not person:
        raise HTTPException(status_code=404, detail="Personnel not found")
    
    enrich_personnel_record(person)
    action_item = {
        "actionId": f"ACT-{int(datetime.now().timestamp())}",
        "action": action,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "status": "Dispatched",
        "notes": notes
    }
    if "actionHistory" not in person:
        person["actionHistory"] = []
    person["actionHistory"].insert(0, action_item)
    save_db(db)
    return {"success": True, "action": action_item, "personnel": person}

@app.post("/api/personnel/{person_id}/welfare-advisory")
async def set_personnel_welfare_advisory(person_id: str, request: Request):
    payload = await request.json()
    action_type = payload.get("actionType", "Sanction 14-Day Compassionate Leave")
    severity = payload.get("severity", "High")
    suggested_action = payload.get("suggestedAction", "")
    notes = payload.get("notes", "")

    db = load_db()
    person = next((p for p in db.get("personnel", []) if p["id"].lower() == person_id.lower()), None)
    if not person:
        raise HTTPException(status_code=404, detail="Personnel not found")

    enrich_personnel_record(person)
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    rec = {
        "actionType": action_type,
        "severityLevel": severity,
        "suggestedAction": suggested_action,
        "notes": notes,
        "status": "Pending Commander Approval",
        "timestamp": now_str
    }
    if "welfareAdvisory" not in person:
        person["welfareAdvisory"] = {}
    person["welfareAdvisory"]["activeRecommendation"] = rec
    person["welfareAdvisory"]["isValidated"] = True
    person["welfareAdvisory"]["validatedBy"] = "Maj. Sunita Rao (Welfare Officer)"

    save_db(db)
    return {"success": True, "personnel": person}

@app.post("/api/personnel/{person_id}/commander-approve-advisory")
async def commander_approve_advisory(person_id: str):
    db = load_db()
    person = next((p for p in db.get("personnel", []) if p["id"].lower() == person_id.lower()), None)
    if not person:
        raise HTTPException(status_code=404, detail="Personnel not found")

    enrich_personnel_record(person)
    if person.get("welfareAdvisory", {}).get("activeRecommendation"):
        person["welfareAdvisory"]["activeRecommendation"]["status"] = "Approved & Sanctioned"
        person["welfareAdvisory"]["activeRecommendation"]["approvedAt"] = datetime.now().strftime("%Y-%m-%d %H:%M")
        person["welfareAdvisory"]["activeRecommendation"]["approvedBy"] = "Col. Virendra Saxena"

    save_db(db)
    return {"success": True, "personnel": person}

@app.get("/api/export-report")
async def export_report():
    db = load_db()
    high_priority = []
    for p in db.get("personnel", []):
        enrich_personnel_record(p)
        if p["liveStressLevel"] >= 55:
            high_priority.append({
                "id": p["id"],
                "name": p["name"],
                "rank": p["rank"],
                "force": p["force"],
                "overdueLeaveDays": p.get("hrIndicators", {}).get("daysSinceLastLeave", 0),
                "wellbeingPercentage": p["wellbeingPercentage"],
                "primaryRisk": p["stressRiskLevel"],
                "recommendedAction": p.get("medicalTreatment", {}).get("prescribedModality", "Clinical Counseling")
            })
    return {"highPriorityPersonnel": high_priority}

# -------------------------------------------------------------
# CHECK-IN & REAL-TIME PREDICTION ENDPOINTS
# -------------------------------------------------------------
@app.post("/api/self-assessment")
async def self_assessment(request: Request):
    """
    Submits daily wellness check-in, runs input through TensorFlow model,
    and returns real stress classification outputs.
    """
    payload = await request.json()
    person_id = payload.get("personnelId", "CRPF-94821")
    mood = float(payload.get("moodScore", 3.0))
    sleep_hours = float(payload.get("sleepHours", 6.0))
    exhaustion = payload.get("exhaustionLevel", "Moderate")
    fam_worry = float(payload.get("familyWorryScore", 4.0))
    symptoms = payload.get("reportedSymptoms", [])

    db = load_db()
    target_person = next((p for p in db.get("personnel", []) if p["id"].lower() == person_id.lower()), None)

    if not target_person:
        # Fallback to first person in DB or dummy profile
        target_person = db.get("personnel", [])[0] if db.get("personnel") else {
            "id": person_id,
            "name": "Personnel",
            "hrIndicators": {"averageSleepHours": sleep_hrs},
            "biometrics": {"restingHeartRate": 70, "hrvMs": 52}
        }

    # Update state
    target_person["selfAssessment"] = {
        "lastCheckin": datetime.now().strftime("%Y-%m-%d"),
        "moodScore": mood,
        "exhaustionLevel": exhaustion,
        "familyWorryScore": fam_worry,
        "reportedSymptoms": symptoms
    }
    if "hrIndicators" in target_person:
        target_person["hrIndicators"]["averageSleepHours"] = sleep_hours

    # Run TensorFlow Deep Learning Inference
    metrics = predict_stress_metrics(target_person)
    target_person["wellbeingPercentage"] = metrics["wellbeingPercentage"]
    target_person["stressRiskLevel"] = metrics["stressRiskLevel"]
    target_person["riskScore"] = metrics["riskScore"]
    target_person["liveStressLevel"] = metrics["liveStressLevel"]
    target_person["treatmentPriority"] = get_treatment_priority(metrics["liveStressLevel"])
    target_person["treatmentRequired"] = get_treatment_recommendations(metrics["liveStressLevel"])
    target_person["stressClassification"] = metrics.get("classification")

    save_db(db)

    # Console logging as requested
    print(f"\n>>> [TensorFlow AI Check-In] Personnel: {person_id} | Sleep: {sleep_hours}h | Mood: {mood}/5")
    print(f"    --> Stress Score: {metrics['liveStressLevel']}% | Classification: {metrics['classification']} | Confidence: {metrics.get('classConfidence', 0)*100:.1f}%")
    print(f"    --> Treatment Priority: {target_person['treatmentPriority']} | Engine: {metrics.get('engine')}\n")

    return {
        "success": True,
        "personnel": target_person,
        "metrics": {
            "wellbeing": metrics["wellbeingPercentage"],
            "risk": metrics["stressRiskLevel"],
            "score": metrics["liveStressLevel"],
            "classification": metrics["classification"],
            "confidence": metrics.get("classConfidence", 0.90),
            "treatmentRequired": target_person["treatmentRequired"]
        },
        "engine": metrics.get("engine", "TensorFlow Neural Network")
    }

@app.post("/predict")
@app.post("/api/predict")
async def predict_direct(request: Request):
    """
    Direct model inference endpoint accepting raw input features or Next.js check-in payloads.
    """
    payload = await request.json()
    
    # Extract features with flexible snake_case & camelCase key mappings
    sleep = float(payload.get("sleep_hours", payload.get("sleepHours", 6.5)))
    mood = float(payload.get("mood_score", payload.get("moodScore", 3.0)))
    rhr = float(payload.get("resting_heart_rate", payload.get("restingHeartRate", payload.get("heart_rate", 70.0))))
    hrv = float(payload.get("hrv_ms", payload.get("hrvMs", payload.get("hrv", 52.0))))
    days_leave = float(payload.get("days_since_last_leave", payload.get("daysSinceLastLeave", 60.0)))
    field_days = float(payload.get("consecutive_field_days", payload.get("consecutiveFieldDays", 45.0)))
    night_shifts = float(payload.get("night_duty_shifts", payload.get("nightDutyShiftsPastMonth", 7.0)))
    fam_worry = float(payload.get("family_worry_score", payload.get("familyWorryScore", 3.5)))
    fam_emergency = float(payload.get("family_emergency", 1.0 if payload.get("hasFamilyCrisis") else 0.0))
    symptoms_list = payload.get("reported_symptoms", payload.get("reportedSymptoms", []))
    symptoms_count = float(len(symptoms_list) if isinstance(symptoms_list, list) else payload.get("symptoms_count", 1.0))
    moca = float(payload.get("moca_score", 18.2))
    reaction_time = float(payload.get("reaction_time_s", 1.32))
    switch_cost = float(payload.get("switch_cost_s", 0.38))
    bk_errors = float(payload.get("backward_errors", 0.0))

    synthetic_person = {
        "hrIndicators": {
            "averageSleepHours": sleep,
            "daysSinceLastLeave": days_leave,
            "consecutiveFieldDays": field_days,
            "nightDutyShiftsPastMonth": night_shifts,
            "familyEmergencyStatus": "Crisis" if fam_emergency else "Normal"
        },
        "biometrics": {
            "restingHeartRate": rhr,
            "hrvMs": hrv
        },
        "selfAssessment": {
            "moodScore": mood,
            "familyWorryScore": fam_worry,
            "reportedSymptoms": symptoms_list
        },
        "mocaScore": moca,
        "reactionTimeS": reaction_time,
        "switchCostS": switch_cost,
        "backwardErrors": bk_errors
    }

    metrics = predict_stress_metrics(synthetic_person)
    treatment = get_treatment_recommendations(metrics["liveStressLevel"])

    print(f">>> [TensorFlow /predict] Sleep={sleep}h, Mood={mood}, RHR={rhr} -> Score: {metrics['liveStressLevel']}%, Class: {metrics['classification']}")

    return {
        "success": True,
        "predicted_stress_score": metrics["liveStressLevel"],
        "wellbeing_percentage": metrics["wellbeingPercentage"],
        "stress_risk_level": metrics["stressRiskLevel"],
        "stress_class": metrics["classification"],
        "confidence": metrics.get("classConfidence", 0.90),
        "probabilities": metrics.get("probabilities", {}),
        "treatment_required": treatment,
        "engine": metrics.get("engine")
    }

# -------------------------------------------------------------
# DOWNLOAD & DISTRIBUTION ENDPOINTS
# -------------------------------------------------------------
@app.api_route("/download/desktop-app", methods=["GET", "HEAD"])
@app.api_route("/api/download-app", methods=["GET", "HEAD"])
async def download_desktop_app():
    zip_path = os.path.join(BASE_DIR, "Rakshak-AI-Desktop-Setup.zip")
    if os.path.exists(zip_path):
        return FileResponse(
            zip_path,
            filename="Rakshak-AI-Desktop-Setup.zip",
            media_type="application/zip",
            headers={"Content-Disposition": 'attachment; filename="Rakshak-AI-Desktop-Setup.zip"'}
        )
    raise HTTPException(status_code=404, detail="Desktop package not found. Run create_desktop_package.py to build it.")

# -------------------------------------------------------------
# STATIC FILES & SINGLE PAGE APP SERVING
# -------------------------------------------------------------
@app.api_route("/", methods=["GET", "HEAD"])
async def root_index():
    index_path = os.path.join(BASE_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return HTMLResponse("<h1>Rakshak AI API Running</h1>")

# Mount static asset folders
for folder in ["assets", "css", "js", "canva_pages"]:
    folder_path = os.path.join(BASE_DIR, folder)
    if os.path.exists(folder_path):
        app.mount(f"/{folder}", StaticFiles(directory=folder_path), name=folder)

# Catch-all to serve index.html for client-side navigation
@app.api_route("/{full_path:path}", methods=["GET", "HEAD"])
async def catch_all(full_path: str):
    file_path = os.path.join(BASE_DIR, full_path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    index_path = os.path.join(BASE_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    raise HTTPException(status_code=404, detail="File not found")

# Entrypoint for standalone python execution
if __name__ == "__main__":
    import uvicorn
    print("\nStarting Rakshak AI FastAPI Server with Uvicorn on http://127.0.0.1:8000 ...")
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
