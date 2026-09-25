# RakshakAI (रक्षक AI) - Personnel Stress & Welfare Monitoring System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Status: Operational](https://img.shields.io/badge/Status-Operational-brightgreen.svg)]()
[![Privacy: Air--Gapped](https://img.shields.io/badge/Privacy-ACR%20Air--Gapped-success.svg)]()

> **"Serving Those Who Serve Us"**  
> *Healthier Minds | Stronger Forces | Safer Tomorrow*

---

## 📌 Executive Overview

**RakshakAI** is an AI-powered personnel stress and welfare monitoring platform engineered specifically for **Central Armed Police Forces (CRPF, BSF, CISF, ITBP, SSB, Assam Rifles)** and the **Indian Armed Forces (Army, Navy, Air Force, NSG)**.

Personnel serving in uniformed services operate under physically demanding, psychologically stressful, and frequently hazardous conditions:
- Extended deployments in extreme operational theaters (Siachen, Bastar LWE, Pulwama, Thar Desert, Sir Creek).
- Prolonged separation from families and home environments.
- Irregular duty shifts, night patrols, and sleep deprivation.
- High-intensity operational pressure and exposure to traumatic incidents.

**RakshakAI shifts mental health from a delayed, reactive, manual reporting mechanism into a proactive, confidential, technology-driven welfare system** while maintaining complete data privacy, individual dignity, and organizational trust.

---

## 🛡️ Core Architectural Pillars

### 1. 🔒 Non-Punitive & Air-Gapped Privacy Framework
- **Strict Partitioning**: All psychological indicators, self-reported moods, sleep ratings, and stress scores are cryptographically isolated and **100% air-gapped from Annual Confidential Reports (ACR)**, promotion boards, and disciplinary records.
- **Voluntary Digital Consent Gate**: Transparent digital informed consent required before any personal check-in data or biometrics can be collected.

### 2. 📊 Multi-Dimensional Stress & Wellbeing Engine
- **Stress Risk Stratification**: Dynamically calculates risk levels (`🔴 Critical`, `🟠 High`, `🟡 Moderate`, `🟢 Low`) and a granular **Wellbeing Percentage (`0–100%`)**.
- **Explainable AI (XAI)**: Provides clear, non-stigmatizing operational attribution for why a flag was raised (e.g. *210 days without home leave*, *18 night patrols in 30 days*, *family medical emergency*).

### 3. 🧘 Tactical Resilience & Mental Recovery Center (Zero Games)
Replaces trivial mini-games with clinically proven, operational neuro-resilience tools:
- **Tactical 4-4-4-4 Box Breathing Visualizer**: Special Forces autonomic nerve regulation protocol (*Inhale 4s → Hold 4s → Exhale 4s → Hold 4s*) with animated guidance disc and Web Audio chimes.
- **Progressive Muscle Relaxation (PMR)**: Guided 4-zone neuromuscular tension release for post-patrol physical fatigue.
- **High-Altitude Sleep Hygiene Station**: Synthesizes ambient acoustic soundscapes (*Himalayan Stream*, *Rain on Canvas Tent*, *Mountain Breeze*) via browser Web Audio API.

### 4. 🤖 Mitra AI (रक्षक सहायक) Conversational Companion
- Bilingual (Hindi/English/Hinglish) empathetic conversational assistant with authentic camp camaraderie.
- Built-in **Voice Speech Synthesis** (`Web Speech API`).
- **Emergency Crisis Safety Net**: Real-time distress keyword interception routing directly to priority helplines.

### 5. 🚨 24×7 Priority Emergency Helplines
- Direct speed-dial integration available at 1st-service:
  - **Tele-MANAS**: National Mental Health Helpline (`14416` / `1800-891-4416`)
  - **KIRAN**: Armed Forces & CAPF Mental Health Helpline (`1800-599-0019`)
  - **Unit Medical Officer (MO) Base Clinic Desk** (`Ext. 102`)

### 6. 🎖️ Commander Operations Dashboard
- **Instant Search**: Search soldiers by Name, Service ID, Rank, Force, or Location.
- **Multi-Column Sorting**: Sort by Wellbeing %, Days Overdue for Leave, Risk Severity, or Name.
- **1-Click Welfare Interventions**:
  - Grant 15-Day Immediate Home Leave
  - Recommend Rotational Peace Station Transfer
  - Schedule Medical Officer Counseling
  - Assign Sahayak Peer Buddy
- **Batch Actions**: Multi-select personnel for bulk leave sanctioning.
- **CSV Exporter**: Download comprehensive welfare compliance reports.

---

## 🎨 Design System & Views

Built aligned with the 4-screen layout of modern military-grade health platforms:
1. **Screen 1**: Landing & Role Switcher (*Personnel, Commander, Welfare Officer, Medical Officer*).
2. **Screen 2**: Personnel Wellness App (*Daily check-in, mood emojis, sleep hours slider, operational triggers*).
3. **Screen 3**: Digital Welfare Twin (*Pentagon Radar Chart, Circular Risk Progress Rings, 6-Month Longitudinal Trends*).
4. **Screen 4**: Commander Operations Center (*KPI cards, sortable roster table, batch dispatcher, detail modal*).
- **Dual-Theme Engine**:
  - `☀️ Canva Clean`: Crisp executive slate, high legibility.
  - `🌙 Tactical Cyber`: Dark HUD glassmorphism with neon cyan, amber, and crimson telemetry.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+ (Zero external pip dependencies required — uses Python Standard Library).
- Modern web browser (Chrome, Edge, Firefox, Safari).

### Running the Platform Locally
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/rakshak-ai.git
cd rakshak-ai

# Start the zero-dependency REST & HTTP server
python server.py
```
Open **`http://localhost:8080`** in your browser.

### Running Automated Test Suite
```bash
python test_server.py
```
Executes 7 integration tests verifying:
- Personnel database retrieval across 28 profiles.
- Fuzzy search and risk classification.
- Detailed soldier profile endpoints.
- Chatbot empathetic dialogue and crisis safety net.
- Commander welfare action dispatch and live recalculation.
- Aggregate force readiness analytics.

---

## 📁 Repository Structure

```
rakshak-ai/
├── assets/
│   ├── rakshak_ai_eagle_logo.jpg    # Master 1024x1024 official emblem logo
│   ├── rakshak_ai_human_logo.jpg    # Humanized soldier variant
│   └── rakshak_ai_logo.svg          # Fully editable vector SVG with text layers
├── css/
│   └── styles.css                   # Dual-theme design system (Canva Clean & Tactical Cyber)
├── data/
│   └── personnel_db.json            # 28 personnel profiles across CAPF & Armed Forces
├── js/
│   ├── app.js                       # State controller, search, sort, ECG pulse, & resilience tools
│   └── chatbot.js                   # Mitra AI conversational companion with voice synthesis
├── index.html                       # Unified 4-role responsive web application
├── logo-download.html               # Logo branding studio & in-browser JPG/SVG exporter
├── server.py                        # Zero-dependency Python HTTP & REST API server
├── test_server.py                   # Automated test suite (7 test cases)
└── README.md                        # Documentation
```

---

## 📄 License & Confidentiality
Distributed under the **MIT License**.  
All health and stress monitoring metrics are intended strictly for welfare, non-punitive support, and voluntary care in accordance with Indian Armed Forces and CAPF welfare directives.
