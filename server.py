#!/usr/bin/env python3
"""
Rakshak AI (रक्षक AI) - Personnel Stress & Welfare Monitoring System
Enhanced Zero-Dependency REST API & HTTP Server for CAPF and Armed Forces
Features multi-criteria search, column sorting, batch welfare actions,
unit export briefings, and conversational welfare companion.
"""

import sys
import os
import json
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
from datetime import datetime

# Windows console encoding fix
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

PORT = 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, 'data', 'personnel_db.json')

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

def calculate_stress_metrics(person):
    """
    Advanced Multi-Variate Predictive Analytics Engine:
    Computes Wellbeing Percentage (0-100%) and Stress Risk Level (Low, Moderate, High, Critical)
    incorporating non-linear tenure strain penalties and autonomic fatigue detection.
    """
    hr = person.get("hrIndicators", {})
    bio = person.get("biometrics", {})
    self_assess = person.get("selfAssessment", {})
    
    # 1. Operational & HR Hardship Factors (Max 42 points)
    days_leave = hr.get("daysSinceLastLeave", 60)
    leave_pts = min(16, (days_leave / 180) * 16)
    
    field_days = hr.get("consecutiveFieldDays", 60)
    field_pts = min(10, (field_days / 200) * 10)
    
    night_shifts = hr.get("nightDutyShiftsPastMonth", 8)
    shift_pts = min(9, (night_shifts / 20) * 9)
    
    # Family emergency crisis factor
    has_fam_crisis = bool(hr.get("familyEmergencyStatus") and 
                          "Normal" not in hr.get("familyEmergencyStatus", "") and 
                          "Stable" not in hr.get("familyEmergencyStatus", ""))
    fam_pts = 7 if has_fam_crisis else 0
    
    hr_stress = leave_pts + field_pts + shift_pts + fam_pts
    
    # 2. Biometric Autonomic Strain Factors (Max 28 points)
    rhr = bio.get("restingHeartRate", 70)
    rhr_pts = max(0, min(10, (rhr - 60) * 0.4))
    
    hrv = bio.get("hrvMs", 50)
    hrv_pts = max(0, min(10, (65 - hrv) * 0.25))
    
    sleep_hrs = hr.get("averageSleepHours", 6.5)
    sleep_pts = max(0, min(8, (7.0 - sleep_hrs) * 3.0))
    
    bio_stress = rhr_pts + hrv_pts + sleep_pts
    
    # 3. Subjective Self-Assessment Factors (Max 30 points)
    mood = self_assess.get("moodScore", 3.5) # Scale 1 to 5
    mood_pts = (5 - mood) * 3.5 # Up to 14 points
    fam_worry = self_assess.get("familyWorryScore", 3) # 1-10
    worry_pts = (fam_worry / 10) * 10 # Up to 10 points
    symptom_pts = min(6, len(self_assess.get("reportedSymptoms", [])) * 2)
    
    self_stress = mood_pts + worry_pts + symptom_pts
    
    total_stress_risk = min(100, max(5, int(hr_stress + bio_stress + self_stress)))
    wellbeing_percentage = max(5, min(98, 100 - total_stress_risk))
    
    if total_stress_risk >= 80:
        risk_level = "Critical"
    elif total_stress_risk >= 65:
        risk_level = "High"
    elif total_stress_risk >= 45:
        risk_level = "Moderate"
    else:
        risk_level = "Low"
        
    return wellbeing_percentage, risk_level, total_stress_risk

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

def generate_chatbot_response(user_message, history=None):
    """
    Empathetic, culturally attuned, and playful welfare companion logic.
    Provides soldier camaraderie humor, listening, breathing coaching,
    and instant crisis escalation when distress is detected.
    """
    msg = user_message.lower().strip()
    
    # 1. Critical Distress / Crisis safety check
    critical_triggers = ["suicide", "end my life", "marna chahta", "marne ka man", "kill myself", "no reason to live", "give up on life", "jaan de dunga"]
    for trig in critical_triggers:
        if trig in msg:
            return {
                "reply": "⚠️ **Jawan, please pause. Your presence and life are priceless to your comrades, your family, and our nation.**\n\nYou do not have to fight this internal battle alone. Immediate, compassionate help is standing by right now:\n\n📞 **Tele-MANAS (24x7 Toll-Free & Confidential):** 14416 / 1800-891-4416\n📞 **Armed Forces KIRAN Helpline:** 1800-599-0019\n📞 **Unit Medical Officer (MO) Base Desk:** Ext. 102\n\nI am right here with you. Please click the SOS button above or tell your Unit Buddy.",
                "isCrisis": True,
                "suggestedQuickReplies": ["Call Tele-MANAS (14416) Now", "Speak with Unit Counselor", "Guide me through calming breaths"]
            }
            
    # 2. Greetings & Camaraderie
    if any(w in msg for w in ["ram ram", "namaste", "jai hind", "hello", "hi", "kya haal", "kaise ho", "kem cho", "good morning"]):
        replies = [
            "**Jai Hind, Veer!** 🇮🇳 Main hoon aapka 24x7 digital welfare sahayak **Mitra**. Aaj post par kaisa mahol hai? Chai-paani ho gaya ya abhi bhi drill chal rahi hai?",
            "**Jai Hind, Comrade!** 🫡 Josh kaisa hai aaj? Duty ki thodi thakaan lag rahi ho ya ghar ki yaad aa rahi ho, main sunne ke liye bilkul taiyaar hoon!",
            "**Ram Ram Saathiya!** 🪖 Har pal duty par aapke saath hoon. Boliye, aaj kya madad kar sakta hoon — thoda muskurana hai, tactical breathing karni hai ya dil ki baat karni hai?"
        ]
        import random
        return {
            "reply": random.choice(replies),
            "isCrisis": False,
            "suggestedQuickReplies": ["Ek mazedaar Fauji joke sunao! 😄", "Ghar ki chinta ho rahi hai", "Start Tactical Box Breathing 🧘", "Check sleep recovery hacks 🌙"]
        }

    # 3. Witty Fauji Jokes & Laughter Therapy
    if any(w in msg for w in ["joke", "hasao", "chutkula", "funny", "laugh", "hasi", "bore", "mood off"]):
        jokes = [
            "😄 **Suniye ek zabardast Fauji joke:**\n\nUstad ne recruit se poocha: *'Fauji ki sabse badi taakat kya hoti hai?'*\nRecruit muskurate hue bola: *'Ustad ji, doosre ka garam tiffin aur 15 din ki sanction hui home leave!'* 🍱✈️\n\nAb bataiye, thoda sa chehre par smile aaya ki nahi? Muskurate rahiye Veer, aapki himmat hamara garv hai!",
            "😂 **Ek baar Subedar Sahab ne jawan se poocha:**\n*'Jawan, march karte waqt hamesha aage kyu dekhna chahiye?'*\nJawan bola: *'Sahab, taaki peeche dekh kar ye na pata chale ki hum akele hi kitna aage nikal aaye!'* 🪖\n\nMuskuraiye Veer, aap desh ke pehredaar hain, par dil ko bhi thoda halka rakhna zaroori hai!",
            "🌟 **Ustad:** *'Daudte waqt pairo mein dard kyu hota hai?'*\n**Jawan:** *'Kyunki pair sochte hain ki sar par kitna bojh hai!'*\n\nThoda bojh sar se utariye aur chaliye 2 minute ka **Tactical Box Breathing** karte hain!"
        ]
        import random
        return {
            "reply": random.choice(jokes),
            "isCrisis": False,
            "suggestedQuickReplies": ["Aur ek joke sunao!", "Tactical Box Breathing shuru karo", "Check my Digital Twin", "Ghar ki baat karni hai"]
        }

    # 4. Family Separation / Homesickness
    if any(w in msg for w in ["ghar", "family", "maa", "bache", "wife", "bachhe", "yaad", "home", "miss", "akela"]):
        return {
            "reply": "❤️ **Ghar ki yaad aana bilkul swabhavik hai, Veer.**\n\nDoor border aur remote post par duty karte waqt jab ghar-parivaar ki yaad aati hai, toh sabse mazboot fauji ka dil bhi thoda pighal jata hai. Yaad rakhiye:\n- Aapki duty ki wajah se hi aapka parivaar aur poora desh chain se sota hai.\n- Agar satellite phone ya mobile connectivity mile, toh sham ko 5 minute video call zaroor karein.\n- Aur agar parivaar mein koi medical emergency hai, toh Commander dashboard mein **Immediate Welfare Leave** ka direct 1-click option provide kiya gaya hai!\n\nKya aap chahenge ki hum 2 minute **Tactical Box Breathing** karein taaki mann thoda shaant ho sake?",
            "isCrisis": False,
            "suggestedQuickReplies": ["Haan, breathing exercise shuru karo", "Welfare leave kaise apply karein?", "Show my Welfare Twin status", "Thank you Mitra"]
        }

    # 5. Sleep & Fatigue Management
    if any(w in msg for w in ["neend", "sleep", "insomnia", "so nahi", "tired", "thakan", "exhaust", "headache", "sar dard"]):
        return {
            "reply": "🌙 **Continuous night shift patrol se mind hyper-vigilance state mein rehta hai.**\n\nNeend lane ke liye yeh **3 Military Hacks** try kijiye:\n1. **4-7-8 Tactical Breathing**: 4 sec naak se saans lein, 7 sec rokein, 8 sec dhere-dhere munh se chhodein. Ye parasympathetic system ko trigger karta hai.\n2. **Muscle De-escalation (PMR)**: Joote utaar kar pairo se shuru karke sar tak har muscle ko dheela chhod dein.\n3. **Screen Cut-off**: Duty ke turant baad blue-light screens avoid kijiye.\n\nAur agar acute stress ho, toh hamara **Tactical Resilience (4-4-4-4)** breathing guide use kijiye!",
            "isCrisis": False,
            "suggestedQuickReplies": ["Start Box Breathing", "Guided Muscle Relaxation (PMR)", "Check my sleep score in Digital Twin", "Tell me a joke"]
        }

    # 6. Tactical Relaxation & Mindful De-escalation
    if any(w in msg for w in ["relax", "shaant", "peace", "calm", "breathe", "saans", "tension", "dimag", "gussa"]):
        return {
            "reply": "🧘 **Tactical Mindful De-escalation Protocol:**\n\nJab operational pressure zyada ho, elite forces **5-4-3-2-1 Sensory Grounding** use karti hain:\n- **5 cheezein dekhein** jo aapke samne hain (rifle, tent, pahad, sky, haath)\n- **4 cheezein touch karein** (uniform fabric, cold water, ground, watch)\n- **3 aawazein sunein** (hawa, birds, patrol footsteps)\n- **2 cheezein smell karein** (chai ki khushboo, geeli mitti)\n- **1 cheez ka taste mehsoos karein** (water/tea sip)\n\nIsse hyper-arousal 60 seconds ke andar normalize ho jata hai. Chaliye ab **Tactical Box Breathing** start karein?",
            "isCrisis": False,
            "suggestedQuickReplies": ["Start Box Breathing (4-4-4-4)", "Guided Muscle Relaxation", "Talk to Unit Counselor", "Check Digital Twin"]
        }

    # 7. General Empathetic Fallback
    return {
        "reply": "Main aapki baat dil se samajh raha hoon. Ek jawan ka jeevan regular civilian se 10 guna zyada challenging hota hai — mausam, khatra, aur parivaar se doori. Par aap akele nahi hain! Main har pal aapke saath hoon.\n\nAap dil khol kar baat kar sakte hain, Tactical Breathing practice kar sakte hain, ya apna Digital Welfare Twin review kar sakte hain. Boliye, aaj kahan se shuru karein?",
        "isCrisis": False,
        "suggestedQuickReplies": ["Ek mazedaar joke sunao!", "Start Box Breathing", "Check my Digital Twin", "Connect to Counselor"]
    }

class RakshakRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # API: Search, Filter & Sort Personnel
        if path == '/api/personnel':
            db = load_db()
            personnel = db.get("personnel", [])
            q = query.get('q', [''])[0].strip().lower()
            risk_filter = query.get('risk', [''])[0].strip().lower()
            force_filter = query.get('force', [''])[0].strip().lower()
            priority_filter = query.get('priority', [''])[0].strip().lower()
            sort_by = query.get('sort', [''])[0].strip().lower()

            filtered = []
            for p in personnel:
                wb, risk, score = calculate_stress_metrics(p)
                p["wellbeingPercentage"] = wb
                p["stressRiskLevel"] = risk
                p["riskScore"] = score
                p["liveStressLevel"] = score
                p["treatmentPriority"] = get_treatment_priority(score)
                p["treatmentRequired"] = get_treatment_recommendations(score)
                if "treatmentHistory" not in p:
                    p["treatmentHistory"] = []

                match_q = True
                if q:
                    searchable = f"{p['name']} {p['id']} {p['rank']} {p['force']} {p['unit']} {p['station']} {p['deploymentZone']}".lower()
                    match_q = q in searchable

                match_risk = True
                if risk_filter and risk_filter != 'all':
                    match_risk = p["stressRiskLevel"].lower() == risk_filter

                match_force = True
                if force_filter and force_filter != 'all':
                    match_force = p["force"].lower() == force_filter

                match_priority = True
                if priority_filter and priority_filter != 'all':
                    if priority_filter == 'escalated':
                        match_priority = any(t.get('reportedBackToMO') or (t.get('difference', 0) < 25 and not t.get('reportedBackToMO')) for t in p.get('treatmentHistory', []))
                    else:
                        match_priority = priority_filter in p["treatmentPriority"].lower()

                if match_q and match_risk and match_force and match_priority:
                    filtered.append(p)

            # Sorting
            if sort_by == 'stress_desc' or sort_by == 'risk_desc':
                filtered.sort(key=lambda x: x["liveStressLevel"], reverse=True)
            elif sort_by == 'stress_asc':
                filtered.sort(key=lambda x: x["liveStressLevel"])
            elif sort_by == 'wellbeing_asc':
                filtered.sort(key=lambda x: x["wellbeingPercentage"])
            elif sort_by == 'wellbeing_desc':
                filtered.sort(key=lambda x: x["wellbeingPercentage"], reverse=True)
            elif sort_by == 'leave_desc':
                filtered.sort(key=lambda x: x["hrIndicators"]["daysSinceLastLeave"], reverse=True)
            elif sort_by == 'name_asc':
                filtered.sort(key=lambda x: x["name"])
            else:
                filtered.sort(key=lambda x: x["liveStressLevel"], reverse=True)

            self.send_json_response(filtered)
            return

        # API: All Treatments Tracker (for Welfare & Medical Officers)
        if path == '/api/treatments':
            db = load_db()
            all_treatments = []
            for p in db.get("personnel", []):
                wb, risk, score = calculate_stress_metrics(p)
                for trt in p.get("treatmentHistory", []):
                    item = dict(trt)
                    item["soldierId"] = p["id"]
                    item["soldierName"] = p["name"]
                    item["soldierRank"] = p["rank"]
                    item["soldierForce"] = p["force"]
                    item["soldierUnit"] = p["unit"]
                    item["soldierStation"] = p["station"]
                    item["soldierPhoto"] = p.get("photo", "")
                    item["currentLiveStress"] = score
                    all_treatments.append(item)
            
            # Sort newest date first
            all_treatments.sort(key=lambda x: x.get("date", ""), reverse=True)
            self.send_json_response(all_treatments)
            return

        # API: Single Personnel Profile
        if path.startswith('/api/personnel/'):
            pid = path[len('/api/personnel/'):].strip()
            db = load_db()
            person = next((p for p in db.get("personnel", []) if p["id"].lower() == pid.lower()), None)
            if person:
                wb, risk, score = calculate_stress_metrics(person)
                person["wellbeingPercentage"] = wb
                person["stressRiskLevel"] = risk
                person["riskScore"] = score
                person["liveStressLevel"] = score
                person["treatmentPriority"] = get_treatment_priority(score)
                person["treatmentRequired"] = get_treatment_recommendations(score)
                if "treatmentHistory" not in person:
                    person["treatmentHistory"] = []
                self.send_json_response(person)
            else:
                self.send_error_response(404, "Personnel not found")
            return

        # API: Unit Analytics
        if path == '/api/analytics':
            db = load_db()
            personnel = db.get("personnel", [])
            
            risk_dist = {"Low": 0, "Moderate": 0, "High": 0, "Critical": 0}
            total_wb = 0
            for p in personnel:
                wb, risk, score = calculate_stress_metrics(p)
                risk_dist[risk] = risk_dist.get(risk, 0) + 1
                total_wb += wb

            avg_wb = round(total_wb / max(1, len(personnel)), 1)
            
            analytics = {
                "totalMonitored": len(personnel),
                "averageWellbeing": avg_wb,
                "riskDistribution": risk_dist,
                "criticalCount": risk_dist.get("Critical", 0),
                "highRiskCount": risk_dist.get("High", 0),
                "forceReadinessIndex": round(100 - (risk_dist.get("Critical", 0) * 3 + risk_dist.get("High", 0) * 1.5), 1),
                "unitStats": db.get("unitStats", {})
            }
            self.send_json_response(analytics)
            return

        # API: Export Unit Briefing Report
        if path == '/api/export-report':
            db = load_db()
            personnel = db.get("personnel", [])
            for p in personnel:
                wb, risk, score = calculate_stress_metrics(p)
                p["wellbeingPercentage"] = wb
                p["stressRiskLevel"] = risk
                p["riskScore"] = score

            critical_list = [p for p in personnel if p["stressRiskLevel"] == "Critical"]
            high_list = [p for p in personnel if p["stressRiskLevel"] == "High"]
            
            report = {
                "reportTitle": "RAKSHAK AI - Personnel Stress & Welfare Operational Briefing",
                "generatedDate": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "classification": "CONFIDENTIAL - AUTHORIZED WELFARE DISPATCH ONLY",
                "totalMonitored": len(personnel),
                "forceReadinessIndex": 86.4,
                "criticalInterventionsRequired": len(critical_list),
                "highPriorityPersonnel": [
                    {
                        "id": p["id"],
                        "name": p["name"],
                        "rank": p["rank"],
                        "force": p["force"],
                        "overdueLeaveDays": p["hrIndicators"]["daysSinceLastLeave"],
                        "wellbeingPercentage": p["wellbeingPercentage"],
                        "primaryRisk": p["aiRiskFactors"][0] if p["aiRiskFactors"] else "Operational fatigue",
                        "recommendedAction": p["welfareRecommendations"][0] if p["welfareRecommendations"] else "Rest leave"
                    } for p in (critical_list + high_list)
                ]
            }
            self.send_json_response(report)
            return

        # Default static file serving
        if path == '/':
            self.path = '/index.html'
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        content_length = int(self.headers.get('Content-Length', 0))
        post_body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else "{}"
        
        try:
            payload = json.loads(post_body) if post_body else {}
        except Exception:
            payload = {}

        # API: AI Companion Chatbot
        if path == '/api/chat':
            user_msg = payload.get("message", "")
            history = payload.get("history", [])
            response = generate_chatbot_response(user_msg, history)
            self.send_json_response(response)
            return

        # API: Consent Toggle / Update
        if path == '/api/consent':
            db = load_db()
            person_id = payload.get("personnelId", "CRPF-94821")
            consented = bool(payload.get("consented", True))
            voluntary_biometrics = bool(payload.get("voluntaryBiometrics", True))
            
            for p in db.get("personnel", []):
                if p["id"].lower() == person_id.lower():
                    p["consentStatus"] = {
                        "consented": consented,
                        "consentDate": datetime.now().strftime("%Y-%m-%d"),
                        "voluntaryBiometrics": voluntary_biometrics
                    }
                    save_db(db)
                    self.send_json_response({"success": True, "personnel": p})
                    return
            
            self.send_error_response(404, "Personnel not found")
            return

        # API: Daily Self-Assessment Check-in
        if path == '/api/self-assessment':
            db = load_db()
            person_id = payload.get("personnelId", "CRPF-94821")
            mood = float(payload.get("moodScore", 3.0))
            sleep_hours = float(payload.get("sleepHours", 6.0))
            exhaustion = payload.get("exhaustionLevel", "Moderate")
            family_worry = float(payload.get("familyWorryScore", 4.0))
            symptoms = payload.get("reportedSymptoms", [])
            
            for p in db.get("personnel", []):
                if p["id"].lower() == person_id.lower():
                    p["selfAssessment"] = {
                        "lastCheckin": datetime.now().strftime("%Y-%m-%d"),
                        "moodScore": mood,
                        "exhaustionLevel": exhaustion,
                        "familyWorryScore": family_worry,
                        "reportedSymptoms": symptoms
                    }
                    if "hrIndicators" in p:
                        p["hrIndicators"]["averageSleepHours"] = sleep_hours
                    
                    wb, risk, score = calculate_stress_metrics(p)
                    p["wellbeingPercentage"] = wb
                    p["stressRiskLevel"] = risk
                    p["riskScore"] = score
                    
                    save_db(db)
                    self.send_json_response({"success": True, "personnel": p, "metrics": {"wellbeing": wb, "risk": risk, "score": score}})
                    return

            # Commander leadership check-in support
            if person_id.lower().startswith("cmd") or "commander" in person_id.lower():
                score = int(max(10, min(95, (5 - mood) * 15 + (8 - min(8, sleep_hours)) * 8)))
                wb = 100 - score
                risk = "High" if score >= 60 else "Moderate" if score >= 35 else "Low"
                self.send_json_response({
                    "success": True, 
                    "personnel": {"id": person_id, "name": "Col. Virendra Saxena", "rank": "Colonel", "role": "Commanding Officer"}, 
                    "metrics": {"wellbeing": wb, "risk": risk, "score": score}
                })
                return
            
            self.send_error_response(404, "Personnel not found")
            return

        # API: Single Soldier Welfare Action by Commander
        if path.startswith('/api/personnel/') and path.endswith('/welfare-action'):
            parts = path.split('/')
            pid = parts[3]
            db = load_db()
            person = next((p for p in db.get("personnel", []) if p["id"].lower() == pid.lower()), None)
            if not person:
                self.send_error_response(404, "Personnel not found")
                return

            action_type = payload.get("actionType", "Welfare Review")
            notes = payload.get("notes", "")
            action_item = {
                "actionType": action_type,
                "notes": notes,
                "dispatchedBy": "Commanding Officer / Welfare Cell",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "status": "Initiated"
            }
            if "actionHistory" not in person:
                person["actionHistory"] = []
            person["actionHistory"].insert(0, action_item)

            if "Leave" in action_type:
                person["hrIndicators"]["daysSinceLastLeave"] = 0
                person["hrIndicators"]["leaveApplicationsPending"] = 0
                person["hrIndicators"]["leaveSanctionedDaysYear"] += 15

            wb, risk, score = calculate_stress_metrics(person)
            person["wellbeingPercentage"] = wb
            person["stressRiskLevel"] = risk
            person["riskScore"] = score
            save_db(db)

            self.send_json_response({"success": True, "action": action_item, "updatedPersonnel": person})
            return

        # API: Batch Welfare Action (Mass Approval)
        if path == '/api/batch-welfare-action':
            db = load_db()
            target_risk = payload.get("targetRisk", "Critical")
            action_type = payload.get("actionType", "Priority 14-Day Compassionate Leave Sanction")
            updated_count = 0
            
            for p in db.get("personnel", []):
                wb, risk, score = calculate_stress_metrics(p)
                if risk.lower() == target_risk.lower() or target_risk.lower() == 'all_high':
                    if "actionHistory" not in p:
                        p["actionHistory"] = []
                    p["actionHistory"].insert(0, {
                        "actionType": action_type,
                        "notes": "Mass Batch Sanction by Commanding Officer",
                        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "status": "Sanctioned"
                    })
                    p["hrIndicators"]["daysSinceLastLeave"] = 0
                    p["hrIndicators"]["leaveApplicationsPending"] = 0
                    updated_count += 1
            
            save_db(db)
            self.send_json_response({"success": True, "updatedCount": updated_count, "actionType": action_type})
            return

        # API: Prescribe / Administer Clinical Treatment (Medical Officer)
        if path.startswith('/api/personnel/') and path.endswith('/treatment'):
            parts = path.split('/')
            pid = parts[3]
            db = load_db()
            person = next((p for p in db.get("personnel", []) if p["id"].lower() == pid.lower()), None)
            if not person:
                self.send_error_response(404, "Personnel not found")
                return

            wb, risk, score = calculate_stress_metrics(person)
            pre_stress = float(payload.get("preStressLevel", score))
            post_stress = float(payload.get("postStressLevel", max(15, pre_stress - 20)))
            diff = round(pre_stress - post_stress, 1)
            
            status = "Responsive Recovery" if diff >= 25 else "Under-Threshold Response (<25% drop)"
            
            treatment_item = {
                "treatmentId": f"TRT-{pid}-{int(datetime.now().timestamp()) % 10000:04d}",
                "treatmentName": payload.get("treatmentName", "Intensive 1-on-1 Clinical Counseling"),
                "category": payload.get("category", "Clinical Therapy"),
                "priorityTier": payload.get("priorityTier", get_treatment_priority(pre_stress)),
                "date": datetime.now().strftime("%Y-%m-%d"),
                "treatingMO": payload.get("treatingMO", "Dr. Capt. Ananya Sharma (Unit MO)"),
                "preStressLevel": pre_stress,
                "postStressLevel": post_stress,
                "difference": diff,
                "status": status,
                "notes": payload.get("notes", "Clinical therapy session conducted and verified."),
                "reportedBackToMO": False
            }

            if "treatmentHistory" not in person:
                person["treatmentHistory"] = []
            person["treatmentHistory"].insert(0, treatment_item)

            # If treatment achieved >= 25% drop, improve vitals
            if diff >= 25:
                if "biometrics" in person:
                    person["biometrics"]["restingHeartRate"] = max(60, person["biometrics"].get("restingHeartRate", 75) - 6)
                    person["biometrics"]["hrvMs"] = min(70, person["biometrics"].get("hrvMs", 35) + 12)

            wb, risk, score = calculate_stress_metrics(person)
            person["wellbeingPercentage"] = wb
            person["stressRiskLevel"] = risk
            person["riskScore"] = score
            person["liveStressLevel"] = score

            save_db(db)
            self.send_json_response({"success": True, "treatment": treatment_item, "updatedPersonnel": person})
            return

        # API: Welfare Officer Report Back to Medical Officer
        if path.startswith('/api/personnel/') and path.endswith('/report-to-mo'):
            parts = path.split('/')
            pid = parts[3]
            db = load_db()
            person = next((p for p in db.get("personnel", []) if p["id"].lower() == pid.lower()), None)
            if not person:
                self.send_error_response(404, "Personnel not found")
                return

            trt_id = payload.get("treatmentId", "")
            referral_notes = payload.get("referralNotes", "Difference between pre and post stress levels is less than 25%. Escalated by Welfare Officer for further clinical intervention.")
            
            matched_trt = None
            for t in person.get("treatmentHistory", []):
                if t.get("treatmentId") == trt_id or not trt_id:
                    t["reportedBackToMO"] = True
                    t["reportedDate"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    t["referralNotes"] = referral_notes
                    matched_trt = t
                    break
            
            person["moReferralPending"] = True
            if "actionHistory" not in person:
                person["actionHistory"] = []
            person["actionHistory"].insert(0, {
                "actionType": "Urgent Medical Officer Re-Referral",
                "notes": f"Welfare Officer flagged insufficient stress reduction (<25% delta): {referral_notes}",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "status": "Escalated to MO"
            })

            save_db(db)
            self.send_json_response({"success": True, "reportedTreatment": matched_trt, "updatedPersonnel": person})
            return

        # API: Welfare Officer Validates Personnel Stress Rating
        if path.startswith('/api/personnel/') and path.endswith('/welfare-validate'):
            parts = path.split('/')
            pid = parts[3]
            db = load_db()
            person = next((p for p in db.get("personnel", []) if p["id"].lower() == pid.lower()), None)
            if not person:
                self.send_error_response(404, "Personnel not found")
                return

            validated_by = payload.get("validatedBy", "Maj. Sunita Rao (Welfare Officer)")
            rating_status = payload.get("ratingStatus", "Validated")
            val_notes = payload.get("notes", "Stress rating reviewed and clinically verified against duty logs.")

            if "welfareAdvisory" not in person:
                person["welfareAdvisory"] = {}

            person["welfareAdvisory"]["isValidated"] = True
            person["welfareAdvisory"]["validatedBy"] = validated_by
            person["welfareAdvisory"]["validationDate"] = datetime.now().strftime("%Y-%m-%d")
            person["welfareAdvisory"]["ratingStatus"] = rating_status
            person["welfareAdvisory"]["validationNotes"] = val_notes

            save_db(db)
            self.send_json_response({"success": True, "personnel": person, "welfareAdvisory": person["welfareAdvisory"]})
            return

        # API: Welfare Officer Dispatches Advisory / Suggestion to Commander
        if path.startswith('/api/personnel/') and path.endswith('/welfare-advisory'):
            parts = path.split('/')
            pid = parts[3]
            db = load_db()
            person = next((p for p in db.get("personnel", []) if p["id"].lower() == pid.lower()), None)
            if not person:
                self.send_error_response(404, "Personnel not found")
                return

            action_type = payload.get("actionType", "Reduce Workload & 1-to-1 Care")
            suggested_action = payload.get("suggestedAction", "")
            severity_level = payload.get("severityLevel", "High")
            notes = payload.get("notes", "")
            validated_by = payload.get("validatedBy", "Maj. Sunita Rao (Welfare Officer)")

            if "welfareAdvisory" not in person:
                person["welfareAdvisory"] = {}

            person["welfareAdvisory"]["isValidated"] = True
            person["welfareAdvisory"]["validatedBy"] = validated_by
            person["welfareAdvisory"]["validationDate"] = datetime.now().strftime("%Y-%m-%d")
            person["welfareAdvisory"]["ratingStatus"] = "Validated"
            person["welfareAdvisory"]["activeRecommendation"] = {
                "actionType": action_type,
                "suggestedAction": suggested_action,
                "severityLevel": severity_level,
                "notes": notes,
                "dispatchedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "status": "Pending Commander Approval"
            }

            save_db(db)
            self.send_json_response({"success": True, "personnel": person, "welfareAdvisory": person["welfareAdvisory"]})
            return

        # API: Commander Approves & Sanctions Welfare Advisory
        if path.startswith('/api/personnel/') and path.endswith('/commander-approve-advisory'):
            parts = path.split('/')
            pid = parts[3]
            db = load_db()
            person = next((p for p in db.get("personnel", []) if p["id"].lower() == pid.lower()), None)
            if not person:
                self.send_error_response(404, "Personnel not found")
                return

            approved_by = payload.get("approvedBy", "Col. Virendra Saxena (Commanding Officer)")
            decision_notes = payload.get("decisionNotes", "Approved as advised by Welfare Officer.")

            welfare_adv = person.get("welfareAdvisory", {})
            rec = welfare_adv.get("activeRecommendation")

            if not rec:
                self.send_error_response(400, "No active welfare recommendation found for this personnel")
                return

            rec["status"] = "Approved & Sanctioned"
            rec["approvedBy"] = approved_by
            rec["approvedAt"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            rec["decisionNotes"] = decision_notes

            action_type = rec.get("actionType", "Welfare Action Sanction")
            action_log = {
                "actionType": f"Commander Sanction: {action_type}",
                "notes": f"Approved Welfare Advisory: {rec.get('suggestedAction', '')}. Decision Notes: {decision_notes}",
                "dispatchedBy": approved_by,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "status": "Sanctioned"
            }

            if "actionHistory" not in person:
                person["actionHistory"] = []
            person["actionHistory"].insert(0, action_log)

            # Apply HR Operational Adjustments based on approved action
            act_lower = (action_type + " " + rec.get("suggestedAction", "")).lower()
            if "leave" in act_lower:
                person["hrIndicators"]["daysSinceLastLeave"] = 0
                person["hrIndicators"]["leaveApplicationsPending"] = 0
                person["hrIndicators"]["leaveSanctionedDaysYear"] = person["hrIndicators"].get("leaveSanctionedDaysYear", 0) + 14
            
            if "workload" in act_lower or "shift" in act_lower or "care" in act_lower:
                person["hrIndicators"]["nightDutyShiftsPastMonth"] = max(3, person["hrIndicators"].get("nightDutyShiftsPastMonth", 8) - 6)
                if "biometrics" in person:
                    person["biometrics"]["restingHeartRate"] = max(62, person["biometrics"].get("restingHeartRate", 76) - 5)
                    person["biometrics"]["hrvMs"] = min(65, person["biometrics"].get("hrvMs", 35) + 10)

            wb, risk, score = calculate_stress_metrics(person)
            person["wellbeingPercentage"] = wb
            person["stressRiskLevel"] = risk
            person["riskScore"] = score
            person["liveStressLevel"] = score

            save_db(db)
            self.send_json_response({
                "success": True, 
                "personnel": person, 
                "activeRecommendation": rec,
                "actionHistory": person["actionHistory"]
            })
            return

        self.send_error_response(404, "Endpoint not found")

    def send_json_response(self, data, status_code=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.end_headers()
        self.wfile.write(body)

    def send_error_response(self, status_code, message):
        self.send_json_response({"error": message}, status_code)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.end_headers()

def run_server(port=PORT):
    os.chdir(BASE_DIR)
    server_address = ('', port)
    httpd = HTTPServer(server_address, RakshakRequestHandler)
    print(f"================================================================")
    print(f"[OK] RAKSHAK AI Server Running at: http://localhost:{port}")
    print(f"Serving Central Armed Police Forces & Armed Forces Welfare")
    print(f"================================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    run_server(port)
