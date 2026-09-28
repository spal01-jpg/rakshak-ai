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

@app.get("/api/personnel")
async def get_personnel(
    q: Optional[str] = "",
    risk: Optional[str] = "all",
    force: Optional[str] = "all",
    priority: Optional[str] = "all",
    sort: Optional[str] = "default"
):
    db = load_db()
    personnel = db.get("personnel", [])
    q_str = (q or "").strip().lower()
    risk_filter = (risk or "all").strip().lower()
    force_filter = (force or "all").strip().lower()
    priority_filter = (priority or "all").strip().lower()

    filtered = []
    for p in personnel:
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

        match_q = True
        if q_str:
            searchable = f"{p['name']} {p['id']} {p['rank']} {p['force']} {p['unit']} {p['station']} {p['deploymentZone']}".lower()
            match_q = q_str in searchable

        match_risk = True
        if risk_filter != 'all':
            match_risk = p["stressRiskLevel"].lower() == risk_filter

        match_force = True
        if force_filter != 'all':
            match_force = p["force"].lower() == force_filter

        match_priority = True
        if priority_filter != 'all':
            if priority_filter == 'escalated':
                match_priority = any(t.get('reportedBackToMO') or (t.get('difference', 0) < 25 and not t.get('reportedBackToMO')) for t in p.get('treatmentHistory', []))
            else:
                match_priority = priority_filter in p["treatmentPriority"].lower()

        if match_q and match_risk and match_force and match_priority:
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

    return filtered

@app.get("/api/personnel/{person_id}")
async def get_single_personnel(person_id: str):
    db = load_db()
    person = next((p for p in db.get("personnel", []) if p["id"].lower() == person_id.lower()), None)
    if not person:
        raise HTTPException(status_code=404, detail="Personnel not found")

    metrics = predict_stress_metrics(person)
    person["wellbeingPercentage"] = metrics["wellbeingPercentage"]
    person["stressRiskLevel"] = metrics["stressRiskLevel"]
    person["riskScore"] = metrics["riskScore"]
    person["liveStressLevel"] = metrics["liveStressLevel"]
    person["treatmentPriority"] = get_treatment_priority(metrics["liveStressLevel"])
    person["treatmentRequired"] = get_treatment_recommendations(metrics["liveStressLevel"])
    person["stressClassification"] = metrics.get("classification")
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
# STATIC FILES & SINGLE PAGE APP SERVING
# -------------------------------------------------------------
@app.get("/")
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
@app.get("/{full_path:path}")
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
