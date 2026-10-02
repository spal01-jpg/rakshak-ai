/**
 * RAKSHAK AI - ENTERPRISE UNIVERSAL CLIENT-SIDE OFFLINE & GITHUB PAGES ENGINE
 * Version 3.2 - Fully Self-Healing, Non-Corruptible, Zero-Server Architecture
 *
 * Implements 100% complete parity with the backend FastAPI server:
 *  - 28 Personnel records with active vitals and stress telemetry
 *  - 75% Stress Triage Protocol (Direct MO Referral vs Commander Application)
 *  - Medical Officer Patient Queue Isolation (strict clinical confidentiality)
 *  - Commander Sanctions, Batch Approvals & Advisory Dispatches
 *  - Daily Check-In Self Assessment & Real-Time Stress Inference
 *  - CSV Report Export Generation
 *  - Self-Healing Schema Validator with localStorage Corruption Protection
 */
(function() {
  'use strict';

  const isGitHubPages = window.location.hostname.includes('github.io');
  const isFileProtocol = window.location.protocol === 'file:';
  const forceOffline = window.RAKSHAK_OFFLINE_MODE === true || window.FORCE_OFFLINE_ADAPTER === true;

  // If on localhost or custom domain with live backend, we can still monitor for connection failures
  const shouldIntercept = isGitHubPages || isFileProtocol || forceOffline;

  console.log('[Rakshak AI] Initializing Universal Client-Side Engine (Mode: ' + (shouldIntercept ? 'Permanent GitHub Pages / Air-Gapped' : 'Hybrid Live/Fallback') + ')');

  // Pristine Factory Dataset (Immutable baseline)
  const FACTORY_PERSONNEL = [{"id": "CRPF-94821", "name": "Havildar Rajesh Kumar", "rank": "Havildar", "force": "CRPF", "unit": "182 Battalion, Delta Company", "station": "Pulwama, J&K", "deploymentZone": "Counter-Insurgency High Risk", "monthsInZone": 16, "age": 34, "yearsInService": 14, "photo": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 5, "stressRiskLevel": "Critical", "riskScore": 98, "consentStatus": {"consented": true, "consentDate": "2026-09-24", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 0, "consecutiveFieldDays": 240, "leaveApplicationsPending": 0, "leaveSanctionedDaysYear": 72, "leaveEntitlementRemaining": 48, "nightDutyShiftsPastMonth": 18, "averageSleepHours": 5.5, "restRecoveryScore": 32, "hardshipTenureMonths": 16, "familyEmergencyStatus": "Father hospitalized with renal failure in Rohtak"}, "biometrics": {"restingHeartRate": 84, "hrvMs": 28, "sleepQuality": "Fragmented (Insomnia)", "dailySteps": 16500, "bloodPressure": "138/88"}, "selfAssessment": {"lastCheckin": "2026-09-29", "moodScore": 2.0, "exhaustionLevel": "Moderate", "familyWorryScore": 4.0, "reportedSymptoms": ["Border Patrol Fatigue", "Family Separation / Worry", "Extreme Climate / Hypoxia", "Overdue Leave Anxiety"]}, "aiRiskFactors": ["220 days since last home visit with active father medical crisis", "High night-shift duty density (18 shifts in 30 days)", "Critically low HRV (28ms) indicating autonomic nervous system exhaustion", "Consecutive counter-insurgency deployment exceeding recommended 12-month limit"], "welfareRecommendations": ["Immediate 15-day Special Compassionate Home Leave", "Temporary relief from night ambush duty rotations", "Schedule voluntary confidential counseling with Unit Medical Officer", "Assign trusted Peer Buddy (Sahayak) from same sub-unit"], "actionHistory": [], "treatmentHistory": [], "moReferralPending": false, "welfareAdvisory": {"isValidated": true, "validatedBy": "Maj. Sunita Rao (Welfare Officer)", "validationDate": "2026-09-26", "ratingStatus": "Validated", "activeRecommendation": {"actionType": "Sanction Leave & 1-to-1 Personal Care", "suggestedAction": "Sanction 14-day emergency compassionate leave immediately; arrange 1-to-1 personal care & buddy debrief for 3 days prior to departure.", "severityLevel": "Critical", "notes": "210 days without leave combined with father in ICU in Bihar. High risk of burnout and severe sleep fragmentation.", "dispatchedAt": "2026-09-25 11:30", "status": "Pending Review", "approvedAt": null, "approvedBy": null}, "validationNotes": "Stress rating reviewed and clinically verified against duty logs."}, "liveStressLevel": 98, "treatmentPriority": "Immediate Priority", "treatmentRequired": {"priority": "Immediate Priority", "priorityClass": "immediate", "threshold": "70% and higher", "badgeColor": "#ef4444", "modalities": ["Emergency Psychiatric Consultation & Clinical Evaluation", "Acute Clinical Decompression Therapy (In-Clinic)", "Mandatory 48-Hour Buddy Watch & In-Patient Rest Mandate", "Pharmacotherapy Evaluation & Sleep Cycle Reset Regimen", "Immediate Temporary Duty Withdrawal from Weapon-Bearing Posts"], "primaryFocus": "Crisis stabilization, suicide/self-harm risk mitigation, and neuro-autonomic reset."}, "stressClassification": "Immediate Priority", "modelConfidence": 1.0, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "directMoReferral": {"active": false}, "commanderApprovedForTreatment": {"active": false}}, {"id": "BSF-44120", "name": "Head Constable Manoj Gurjar", "rank": "Head Constable", "force": "BSF", "unit": "65 Battalion, Border Outpost Alpha", "station": "Jaisalmer Sector, Rajasthan", "deploymentZone": "Harsh Desert Border Outpost", "monthsInZone": 14, "age": 38, "yearsInService": 17, "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 5, "stressRiskLevel": "Critical", "riskScore": 98, "consentStatus": {"consented": true, "consentDate": "2026-07-15", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 185, "consecutiveFieldDays": 190, "leaveApplicationsPending": 1, "leaveSanctionedDaysYear": 18, "leaveEntitlementRemaining": 42, "nightDutyShiftsPastMonth": 9, "averageSleepHours": 5.0, "restRecoveryScore": 41, "hardshipTenureMonths": 14, "familyEmergencyStatus": "Agricultural land dispute back home in Alwar"}, "biometrics": {"restingHeartRate": 73, "hrvMs": 45, "sleepQuality": "Moderate", "dailySteps": 18200, "bloodPressure": "130/84"}, "selfAssessment": {"lastCheckin": "2026-09-23", "moodScore": 3, "exhaustionLevel": "Moderate-High", "familyWorryScore": 8, "reportedSymptoms": ["Dehydration fatigue", "Sleep disturbances"]}, "aiRiskFactors": ["185 days separation from family amidst domestic property litigation", "Prolonged extreme weather thermal fatigue (Desert summer duty)", "Accumulated leave deficit of 42 days unutilized"], "welfareRecommendations": ["Expedite approval of pending 12-day casual leave application", "Refer land dispute details to District Welfare Liaison Officer", "Provide electrolyte hydration packs & afternoon shaded rest cycles"], "actionHistory": [], "treatmentHistory": [], "moReferralPending": false, "welfareAdvisory": {"isValidated": true, "validatedBy": "Maj. Sunita Rao (Welfare Officer)", "validationDate": "2026-09-26", "ratingStatus": "Validated", "activeRecommendation": {"actionType": "Sanction Emergency Leave & 1-to-1 Personal Care", "severityLevel": "High", "suggestedAction": "Sanction 14-day emergency compassionate leave immediately; arrange dedicated sub-unit buddy for 1-to-1 personal care & debrief for 3 days prior to departure.", "notes": "Soldier has reached 185 days without leave with active distress flags (Agricultural land dispute back home in Alwar). Immediate compassionate home leave and peer support are necessary to prevent crisis.", "status": "Pending Review", "timestamp": "2026-09-29 00:52", "approvedAt": null, "approvedBy": null}}, "liveStressLevel": 98, "treatmentPriority": "Immediate Priority", "treatmentRequired": {"priority": "Immediate Priority", "priorityClass": "immediate", "threshold": "70% and higher", "badgeColor": "#ef4444", "modalities": ["Emergency Psychiatric Consultation & Clinical Evaluation", "Acute Clinical Decompression Therapy (In-Clinic)", "Mandatory 48-Hour Buddy Watch & In-Patient Rest Mandate", "Pharmacotherapy Evaluation & Sleep Cycle Reset Regimen", "Immediate Temporary Duty Withdrawal from Weapon-Bearing Posts"], "primaryFocus": "Crisis stabilization, suicide/self-harm risk mitigation, and neuro-autonomic reset."}, "stressClassification": "Immediate Priority", "modelConfidence": 1.0, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "directMoReferral": {"active": false}, "commanderApprovedForTreatment": {"active": false}}, {"id": "ITBP-88192", "name": "Sub-Inspector Tenzing Dorjee", "rank": "Sub-Inspector", "force": "ITBP", "unit": "34 Battalion, High Altitude Post", "station": "Eastern Ladakh (LAC)", "deploymentZone": "Extreme High-Altitude (15,500 ft)", "monthsInZone": 11, "age": 31, "yearsInService": 9, "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 52, "stressRiskLevel": "Moderate", "riskScore": 58, "consentStatus": {"consented": true, "consentDate": "2026-06-01", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 140, "consecutiveFieldDays": 140, "leaveApplicationsPending": 0, "leaveSanctionedDaysYear": 24, "leaveEntitlementRemaining": 36, "nightDutyShiftsPastMonth": 12, "averageSleepHours": 5.8, "restRecoveryScore": 54, "hardshipTenureMonths": 11, "familyEmergencyStatus": "Normal (Routine communication available via satellite SATPHONE)"}, "biometrics": {"restingHeartRate": 74, "hrvMs": 44, "sleepQuality": "Hypoxic awakenings noted", "dailySteps": 12000, "bloodPressure": "126/82"}, "selfAssessment": {"lastCheckin": "2026-09-21", "moodScore": 3.5, "exhaustionLevel": "Moderate", "familyWorryScore": 4, "reportedSymptoms": ["Mild hypoxia headaches", "Physical isolation cabin fever"]}, "aiRiskFactors": ["High altitude cold isolation for 11 continuous months", "Approaching tenure threshold for high-altitude acclimatization cycle", "Sub-zero environmental stress"], "welfareRecommendations": ["Plan rotational de-induction to lower transit camp (Leh) next month", "Ensure broadband VSAT connectivity for weekly video call with spouse", "Schedule recreation and tactical wellness recovery sessions"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "CISF-31908", "name": "Constable Sunita Sharma", "rank": "Constable", "force": "CISF", "unit": "Airport Security Unit", "station": "Indira Gandhi International Airport, New Delhi", "deploymentZone": "High-Density Metro Transit", "monthsInZone": 8, "age": 27, "yearsInService": 5, "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 61, "stressRiskLevel": "Moderate", "riskScore": 49, "consentStatus": {"consented": true, "consentDate": "2026-05-18", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 95, "consecutiveFieldDays": 95, "leaveApplicationsPending": 0, "leaveSanctionedDaysYear": 15, "leaveEntitlementRemaining": 45, "nightDutyShiftsPastMonth": 14, "averageSleepHours": 5.6, "restRecoveryScore": 58, "hardshipTenureMonths": 8, "familyEmergencyStatus": "Caring for 3-year-old toddler with day-care shift clashes"}, "biometrics": {"restingHeartRate": 72, "hrvMs": 48, "sleepQuality": "Disrupted by irregular airport shift timings", "dailySteps": 15400, "bloodPressure": "120/78"}, "selfAssessment": {"lastCheckin": "2026-09-23", "moodScore": 3.8, "exhaustionLevel": "Moderate", "familyWorryScore": 6, "reportedSymptoms": ["Circadian rhythm fatigue", "Prolonged standing backache"]}, "aiRiskFactors": ["Rapid shift rotations (Morning/Evening/Night cycles without 48hr turnaround)", "Dual-burden of childcare with irregular metro duty hours", "Ergonomic fatigue from 8+ hours continuous standing security frisking"], "welfareRecommendations": ["Align duty schedule to fixed-shift bracket to stabilize childcare arrangement", "Grant 4 days compensatory rest off (CRO)", "Ergonomic anti-fatigue mat allocation at passenger frisking terminal"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "AR-12903", "name": "Rifleman Lalthan Puia", "rank": "Rifleman", "force": "Assam Rifles", "unit": "26 Assam Rifles", "station": "Chandel, Manipur Border", "deploymentZone": "Dense Jungle Border Counter-Insurgency", "monthsInZone": 18, "age": 29, "yearsInService": 8, "photo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 5, "stressRiskLevel": "Critical", "riskScore": 98, "consentStatus": {"consented": true, "consentDate": "2026-04-10", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 245, "consecutiveFieldDays": 270, "leaveApplicationsPending": 2, "leaveSanctionedDaysYear": 8, "leaveEntitlementRemaining": 52, "nightDutyShiftsPastMonth": 20, "averageSleepHours": 4.1, "restRecoveryScore": 25, "hardshipTenureMonths": 18, "familyEmergencyStatus": "Wife delivered newborn baby 6 weeks ago; yet to meet child"}, "biometrics": {"restingHeartRate": 83, "hrvMs": 34, "sleepQuality": "Critical Deficit", "dailySteps": 21000, "bloodPressure": "142/92"}, "selfAssessment": {"lastCheckin": "2026-09-23", "moodScore": 1.5, "exhaustionLevel": "Severe", "familyWorryScore": 10, "reportedSymptoms": ["Extreme anxiety", "Hypervigilance", "Severe emotional distress"]}, "aiRiskFactors": ["245 days without leave during critical life milestone (birth of first child)", "20 night patrols in 30 days in active hostile border terrain", "Severe autonomic exhaustion (HRV 22ms, sleep 4.1 hrs)", "Critical self-assessment scores indicating severe psychological burnout risk"], "welfareRecommendations": ["PRIORITY 1: Immediate sanction of 20-day Paternity & Annual Leave with travel clearance", "Mandatory 72-hour stand-down from ambush/night patrol duties pending departure", "In-person check-in with Battalion Psychologist or Medical Officer", "Peer buddy escort for transit to Dimapur railhead"], "actionHistory": [], "treatmentHistory": [], "liveStressLevel": 98, "welfareAdvisory": {"isValidated": true, "validatedBy": "Maj. Sunita Rao (Welfare Officer)", "validationDate": "2026-09-25", "ratingStatus": "Validated", "activeRecommendation": {"actionType": "Arrange 1-to-1 Personal Care & Duty Relief", "suggestedAction": "Immediate temporary relief from border outpost duty and arrange dedicated 1-to-1 personal care & peer observation at Battalion HQ for 5 days.", "severityLevel": "Critical", "notes": "Recent counter-insurgency cross-border engagement. Critical physiological stress index (98%). Immediate personal care and close observation required.", "dispatchedAt": "2026-09-26 01:15", "status": "Pending Review", "approvedAt": null, "approvedBy": null}}, "treatmentPriority": "Immediate Priority", "treatmentRequired": {"priority": "Immediate Priority", "priorityClass": "immediate", "threshold": "70% and higher", "badgeColor": "#ef4444", "modalities": ["Emergency Psychiatric Consultation & Clinical Evaluation", "Acute Clinical Decompression Therapy (In-Clinic)", "Mandatory 48-Hour Buddy Watch & In-Patient Rest Mandate", "Pharmacotherapy Evaluation & Sleep Cycle Reset Regimen", "Immediate Temporary Duty Withdrawal from Weapon-Bearing Posts"], "primaryFocus": "Crisis stabilization, suicide/self-harm risk mitigation, and neuro-autonomic reset."}, "stressClassification": "Immediate Priority", "modelConfidence": 1.0, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "directMoReferral": {"active": false}, "commanderApprovedForTreatment": {"active": false}, "moReferralPending": false}, {"id": "IA-67219", "name": "Naik Subedar Gurpreet Singh", "rank": "Naik Subedar", "force": "Indian Army", "unit": "14 Sikh Regiment", "station": "Siachen Glacier Base Camp", "deploymentZone": "Super High Altitude Glacier", "monthsInZone": 6, "age": 36, "yearsInService": 16, "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 68, "stressRiskLevel": "Low", "riskScore": 32, "consentStatus": {"consented": true, "consentDate": "2026-07-01", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 65, "consecutiveFieldDays": 65, "leaveApplicationsPending": 0, "leaveSanctionedDaysYear": 30, "leaveEntitlementRemaining": 30, "nightDutyShiftsPastMonth": 8, "averageSleepHours": 6.8, "restRecoveryScore": 72, "hardshipTenureMonths": 6, "familyEmergencyStatus": "Stable, daily connectivity via Army welfare telephone"}, "biometrics": {"restingHeartRate": 66, "hrvMs": 56, "sleepQuality": "Good", "dailySteps": 11500, "bloodPressure": "118/76"}, "selfAssessment": {"lastCheckin": "2026-09-24", "moodScore": 4.5, "exhaustionLevel": "Low", "familyWorryScore": 2, "reportedSymptoms": ["None reported"]}, "aiRiskFactors": ["Normal acclimatization trajectory", "Good sleep patterns and robust autonomic heart recovery"], "welfareRecommendations": ["Continue routine high-altitude monitoring", "Appoint as Peer Welfare Mentor for junior soldiers in unit"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "SSB-55201", "name": "Constable Amit Verma", "rank": "Constable", "force": "SSB", "unit": "42 Battalion, Indo-Nepal Border", "station": "Raxaul Checkpost, Bihar", "deploymentZone": "Open Border Friendly Sector", "monthsInZone": 9, "age": 26, "yearsInService": 4, "photo": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 79, "stressRiskLevel": "Low", "riskScore": 21, "consentStatus": {"consented": true, "consentDate": "2026-08-20", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 42, "consecutiveFieldDays": 42, "leaveApplicationsPending": 0, "leaveSanctionedDaysYear": 20, "leaveEntitlementRemaining": 40, "nightDutyShiftsPastMonth": 6, "averageSleepHours": 7.2, "restRecoveryScore": 82, "hardshipTenureMonths": 9, "familyEmergencyStatus": "Family living in nearby district; visited recently"}, "biometrics": {"restingHeartRate": 64, "hrvMs": 62, "sleepQuality": "Optimal", "dailySteps": 14000, "bloodPressure": "116/74"}, "selfAssessment": {"lastCheckin": "2026-09-24", "moodScore": 4.8, "exhaustionLevel": "Very Low", "familyWorryScore": 1, "reportedSymptoms": ["None"]}, "aiRiskFactors": ["Well-balanced rest and leave distribution", "Low operational threat environment"], "welfareRecommendations": ["Maintain current operational cadence", "Eligible for upcoming specialized sports/drill training camp"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "CRPF-81144", "name": "Inspector Vikramaditya Rathore", "rank": "Inspector", "force": "CRPF", "unit": "205 CoBRA Battalion (Commando)", "station": "Sukma, Bastar, Chhattisgarh", "deploymentZone": "Deep Jungle Anti-Maoist Operations", "monthsInZone": 15, "age": 37, "yearsInService": 15, "photo": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 5, "stressRiskLevel": "Critical", "riskScore": 98, "consentStatus": {"consented": true, "consentDate": "2026-05-12", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 195, "consecutiveFieldDays": 210, "leaveApplicationsPending": 1, "leaveSanctionedDaysYear": 10, "leaveEntitlementRemaining": 50, "nightDutyShiftsPastMonth": 17, "averageSleepHours": 4.8, "restRecoveryScore": 36, "hardshipTenureMonths": 15, "familyEmergencyStatus": "Mother suffering from chronic arthritis; lives alone in village"}, "biometrics": {"restingHeartRate": 82, "hrvMs": 31, "sleepQuality": "Fragmented", "dailySteps": 19500, "bloodPressure": "136/88"}, "selfAssessment": {"lastCheckin": "2026-09-23", "moodScore": 2.5, "exhaustionLevel": "High", "familyWorryScore": 8, "reportedSymptoms": ["Combat hyper-arousal", "Fatigue", "Musculoskeletal pain"]}, "aiRiskFactors": ["15 months in high-intensity jungle ambush and IED threat operational zone", "Substantial leave deficit (195 days without family leave)", "Sustained autonomic hyper-vigilance state (HRV 31ms)"], "welfareRecommendations": ["Grant 14 days operational respite leave", "De-escalate to Group Centre / Training academy instructor rotation", "Provide psychological debrief session with force counselor"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "liveStressLevel": 98, "treatmentPriority": "Immediate Priority", "treatmentRequired": {"priority": "Immediate Priority", "priorityClass": "immediate", "threshold": "70% and higher", "badgeColor": "#ef4444", "modalities": ["Emergency Psychiatric Consultation & Clinical Evaluation", "Acute Clinical Decompression Therapy (In-Clinic)", "Mandatory 48-Hour Buddy Watch & In-Patient Rest Mandate", "Pharmacotherapy Evaluation & Sleep Cycle Reset Regimen", "Immediate Temporary Duty Withdrawal from Weapon-Bearing Posts"], "primaryFocus": "Crisis stabilization, suicide/self-harm risk mitigation, and neuro-autonomic reset."}, "stressClassification": "Immediate Priority", "modelConfidence": 1.0, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "directMoReferral": {"active": false}, "commanderApprovedForTreatment": {"active": false}, "moReferralPending": false}, {"id": "NSG-10204", "name": "Captain Aditya Nair", "rank": "Captain", "force": "NSG", "unit": "51 Special Action Group (SAG)", "station": "Manesar, Haryana", "deploymentZone": "Counter-Terrorism Quick Reaction", "monthsInZone": 10, "age": 30, "yearsInService": 8, "photo": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 64, "stressRiskLevel": "Moderate", "riskScore": 48, "consentStatus": {"consented": true, "consentDate": "2026-08-01", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 90, "consecutiveFieldDays": 90, "leaveApplicationsPending": 0, "leaveSanctionedDaysYear": 20, "leaveEntitlementRemaining": 40, "nightDutyShiftsPastMonth": 14, "averageSleepHours": 5.8, "restRecoveryScore": 62, "hardshipTenureMonths": 10, "familyEmergencyStatus": "Stable, newly married; spouse working in Gurgaon"}, "biometrics": {"restingHeartRate": 68, "hrvMs": 52, "sleepQuality": "Good", "dailySteps": 17800, "bloodPressure": "122/80"}, "selfAssessment": {"lastCheckin": "2026-09-24", "moodScore": 3.9, "exhaustionLevel": "Moderate", "familyWorryScore": 3, "reportedSymptoms": ["High adrenaline post-drill soreness"]}, "aiRiskFactors": ["High tempo CQB drills and constant 15-minute standby alert posture", "Frequent unannounced night mobilisation exercises"], "welfareRecommendations": ["Weekend off-station pass to visit family in Gurgaon", "Routine sports physiotherapy sessions"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "IN-44912", "name": "Master Chief Petty Officer Ramesh Pillai", "rank": "MCPO II", "force": "Indian Navy", "unit": "INS Vikrant Battle Group", "station": "Arabian Sea Operational Deployment", "deploymentZone": "Continuous Blue-Water Sea Sortie", "monthsInZone": 7, "age": 42, "yearsInService": 21, "photo": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 5, "stressRiskLevel": "Critical", "riskScore": 98, "consentStatus": {"consented": true, "consentDate": "2026-06-15", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 175, "consecutiveFieldDays": 175, "leaveApplicationsPending": 1, "leaveSanctionedDaysYear": 15, "leaveEntitlementRemaining": 45, "nightDutyShiftsPastMonth": 16, "averageSleepHours": 4.9, "restRecoveryScore": 45, "hardshipTenureMonths": 7, "familyEmergencyStatus": "Son appearing for Class 12 Board exams in Kochi"}, "biometrics": {"restingHeartRate": 76, "hrvMs": 38, "sleepQuality": "Vessel engine vibration noise disruption", "dailySteps": 13200, "bloodPressure": "132/86"}, "selfAssessment": {"lastCheckin": "2026-09-23", "moodScore": 3.1, "exhaustionLevel": "High", "familyWorryScore": 7, "reportedSymptoms": ["Mild vestibular dizziness", "Chronic shift fatigue"]}, "aiRiskFactors": ["Confined shipboard environment with no physical off-ship liberty for 90 days", "High acoustic and mechanical fatigue in boiler/engine compartments", "Family milestone separation anxiety"], "welfareRecommendations": ["Priority shore leave upon vessel docking in Karwar Naval Base", "Allocate satellite calling minutes quota for family calls", "Sound isolation earmuffs upgrade for engine room watch"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "liveStressLevel": 98, "treatmentPriority": "Immediate Priority", "treatmentRequired": {"priority": "Immediate Priority", "priorityClass": "immediate", "threshold": "70% and higher", "badgeColor": "#ef4444", "modalities": ["Emergency Psychiatric Consultation & Clinical Evaluation", "Acute Clinical Decompression Therapy (In-Clinic)", "Mandatory 48-Hour Buddy Watch & In-Patient Rest Mandate", "Pharmacotherapy Evaluation & Sleep Cycle Reset Regimen", "Immediate Temporary Duty Withdrawal from Weapon-Bearing Posts"], "primaryFocus": "Crisis stabilization, suicide/self-harm risk mitigation, and neuro-autonomic reset."}, "stressClassification": "Immediate Priority", "modelConfidence": 1.0, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "directMoReferral": {"active": false}, "commanderApprovedForTreatment": {"active": false}, "moReferralPending": false}, {"id": "IAF-78103", "name": "Junior Warrant Officer Sandeep Bhasin", "rank": "Junior Warrant Officer", "force": "Indian Air Force", "unit": "45 Squadron (Flying Daggers)", "station": "Air Force Station Sulur, Coimbatore", "deploymentZone": "Frontline Airbase Radar & Avionics Maintenance", "monthsInZone": 12, "age": 39, "yearsInService": 18, "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 72, "stressRiskLevel": "Low", "riskScore": 28, "consentStatus": {"consented": true, "consentDate": "2026-07-20", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 50, "consecutiveFieldDays": 50, "leaveApplicationsPending": 0, "leaveSanctionedDaysYear": 28, "leaveEntitlementRemaining": 32, "nightDutyShiftsPastMonth": 6, "averageSleepHours": 7.0, "restRecoveryScore": 78, "hardshipTenureMonths": 12, "familyEmergencyStatus": "Normal, living with family in married airforce quarters"}, "biometrics": {"restingHeartRate": 65, "hrvMs": 58, "sleepQuality": "Good", "dailySteps": 12400, "bloodPressure": "118/78"}, "selfAssessment": {"lastCheckin": "2026-09-24", "moodScore": 4.6, "exhaustionLevel": "Low", "familyWorryScore": 1, "reportedSymptoms": ["None"]}, "aiRiskFactors": ["Stable operational environment", "Healthy rest and domestic balance"], "welfareRecommendations": ["Continue routine operational excellence", "Lead squadron welfare sports team"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "CRPF-66219", "name": "Lady Constable Ananya Roy", "rank": "Constable", "force": "CRPF", "unit": "232 Mahila Battalion", "station": "Srinagar Law & Order Sector", "deploymentZone": "Urban Crowd Control & Checkpost Security", "monthsInZone": 13, "age": 25, "yearsInService": 4, "photo": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 43, "stressRiskLevel": "High", "riskScore": 76, "consentStatus": {"consented": true, "consentDate": "2026-06-11", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 190, "consecutiveFieldDays": 190, "leaveApplicationsPending": 1, "leaveSanctionedDaysYear": 10, "leaveEntitlementRemaining": 50, "nightDutyShiftsPastMonth": 16, "averageSleepHours": 4.6, "restRecoveryScore": 38, "hardshipTenureMonths": 13, "familyEmergencyStatus": "Mother in Siliguri undergoing chemotherapy sessions"}, "biometrics": {"restingHeartRate": 81, "hrvMs": 33, "sleepQuality": "Poor", "dailySteps": 18400, "bloodPressure": "134/86"}, "selfAssessment": {"lastCheckin": "2026-09-23", "moodScore": 2.2, "exhaustionLevel": "High", "familyWorryScore": 9, "reportedSymptoms": ["Anxiety episodes", "Severe body ache from riot gear"]}, "aiRiskFactors": ["Prolonged heavy full-body riot gear wearing (10+ hrs daily in high tension)", "Severe family oncology distress (mother chemotherapy)", "Overdue leave backlog of 190 days"], "welfareRecommendations": ["Grant immediate 20 days emergency compassionate leave to attend mother", "Temporary rotation to administrative desk duty at Group Centre", "Medical review with Battalion Gynecologist & Physician"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "BSF-99104", "name": "Sub-Inspector Balwinder Singh", "rank": "Sub-Inspector", "force": "BSF", "unit": "113 Battalion, Riverine Sector", "station": "Sunderbans Floating BOP, West Bengal", "deploymentZone": "Tidal Mangrove Riverine Border Patrol", "monthsInZone": 15, "age": 35, "yearsInService": 13, "photo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 39, "stressRiskLevel": "Critical", "riskScore": 87, "consentStatus": {"consented": true, "consentDate": "2026-05-04", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 215, "consecutiveFieldDays": 230, "leaveApplicationsPending": 2, "leaveSanctionedDaysYear": 12, "leaveEntitlementRemaining": 48, "nightDutyShiftsPastMonth": 19, "averageSleepHours": 4.4, "restRecoveryScore": 30, "hardshipTenureMonths": 15, "familyEmergencyStatus": "Heavy flooding damaged family home in Gurdaspur, Punjab"}, "biometrics": {"restingHeartRate": 85, "hrvMs": 26, "sleepQuality": "Fragmented (River humidity & insects)", "dailySteps": 14000, "bloodPressure": "140/90"}, "selfAssessment": {"lastCheckin": "2026-09-22", "moodScore": 1.8, "exhaustionLevel": "Severe", "familyWorryScore": 9, "reportedSymptoms": ["Extreme mental fatigue", "Gastrointestinal distress", "Skin fungus"]}, "aiRiskFactors": ["15 continuous months on isolated floating watercraft with zero land access", "Loss of family property due to severe floods back in ancestral village", "High night speedboat patrol frequency in high pirate/smuggling active creeks"], "welfareRecommendations": ["Urgent relief from Floating BOP; post to shore base immediately", "Sanction 18 days emergency flood rehabilitation leave", "Financial grant from BSF Central Welfare Fund for house repairs"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "ITBP-41092", "name": "Head Constable Sunil Negi", "rank": "Head Constable", "force": "ITBP", "unit": "8th Battalion, Animal Transport Wing", "station": "Mana Pass, Uttarakhand (18,000 ft)", "deploymentZone": "Snowbound High Pass Supply Route", "monthsInZone": 8, "age": 33, "yearsInService": 11, "photo": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 26, "stressRiskLevel": "High", "riskScore": 74, "consentStatus": {"consented": true, "consentDate": "2026-07-09", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 110, "consecutiveFieldDays": 110, "leaveApplicationsPending": 0, "leaveSanctionedDaysYear": 18, "leaveEntitlementRemaining": 42, "nightDutyShiftsPastMonth": 10, "averageSleepHours": 6.0, "restRecoveryScore": 59, "hardshipTenureMonths": 8, "familyEmergencyStatus": "Normal, spouse and parents in Chamoli district"}, "biometrics": {"restingHeartRate": 71, "hrvMs": 46, "sleepQuality": "Acceptable with oxygen tent", "dailySteps": 19000, "bloodPressure": "124/80"}, "selfAssessment": {"lastCheckin": "2026-09-24", "moodScore": 3.7, "exhaustionLevel": "Moderate", "familyWorryScore": 3, "reportedSymptoms": ["Extreme cold chilblains on toes"]}, "aiRiskFactors": ["Sub-zero trek with mules across frozen moraine passes daily", "High physical calorie exertion (19k steps on steep inclines)"], "welfareRecommendations": ["Issue heated thermal boot liners from battalion depot", "Plan winter rotation to Joshimath transit camp"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false, "liveStressLevel": 74, "treatmentPriority": "Immediate Priority", "treatmentRequired": {"priority": "Immediate Priority", "priorityClass": "immediate", "threshold": "70% and higher", "badgeColor": "#ef4444", "modalities": ["Emergency Psychiatric Consultation & Clinical Evaluation", "Acute Clinical Decompression Therapy (In-Clinic)", "Mandatory 48-Hour Buddy Watch & In-Patient Rest Mandate", "Pharmacotherapy Evaluation & Sleep Cycle Reset Regimen", "Immediate Temporary Duty Withdrawal from Weapon-Bearing Posts"], "primaryFocus": "Crisis stabilization, suicide/self-harm risk mitigation, and neuro-autonomic reset."}, "stressClassification": "Immediate Priority", "modelConfidence": 0.7565}, {"id": "CISF-66710", "name": "Sub-Inspector Deepak Chillar", "rank": "Sub-Inspector", "force": "CISF", "unit": "DMRC Metro Security Unit", "station": "Rajiv Chowk Metro Station, New Delhi", "deploymentZone": "High-Footfall Underground Transit", "monthsInZone": 7, "age": 28, "yearsInService": 6, "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 67, "stressRiskLevel": "Low", "riskScore": 33, "consentStatus": {"consented": true, "consentDate": "2026-08-14", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 55, "consecutiveFieldDays": 55, "leaveApplicationsPending": 0, "leaveSanctionedDaysYear": 22, "leaveEntitlementRemaining": 38, "nightDutyShiftsPastMonth": 8, "averageSleepHours": 6.8, "restRecoveryScore": 70, "hardshipTenureMonths": 7, "familyEmergencyStatus": "Family residing locally in Rohini"}, "biometrics": {"restingHeartRate": 66, "hrvMs": 55, "sleepQuality": "Good", "dailySteps": 16000, "bloodPressure": "120/78"}, "selfAssessment": {"lastCheckin": "2026-09-24", "moodScore": 4.4, "exhaustionLevel": "Low", "familyWorryScore": 2, "reportedSymptoms": ["Occasional crowd noise fatigue"]}, "aiRiskFactors": ["Continuous ambient underground acoustic exposure", "High alert vigilance during peak commuter rush hours"], "welfareRecommendations": ["Acoustic noise-dampening ear protection at X-ray monitors", "Nominated for upcoming advanced security specialist course"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "IA-90412", "name": "Havildar Kuldeep Yadav", "rank": "Havildar", "force": "Indian Army", "unit": "3 Grenadiers", "station": "Line of Control (LoC), Poonch", "deploymentZone": "Active Ceasefire Forward Post", "monthsInZone": 13, "age": 35, "yearsInService": 15, "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 44, "stressRiskLevel": "High", "riskScore": 75, "consentStatus": {"consented": true, "consentDate": "2026-06-18", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 180, "consecutiveFieldDays": 200, "leaveApplicationsPending": 1, "leaveSanctionedDaysYear": 12, "leaveEntitlementRemaining": 48, "nightDutyShiftsPastMonth": 18, "averageSleepHours": 4.7, "restRecoveryScore": 39, "hardshipTenureMonths": 13, "familyEmergencyStatus": "Wife undergoing surgery for gallbladder stone in Rewari"}, "biometrics": {"restingHeartRate": 80, "hrvMs": 34, "sleepQuality": "Poor (Sniping threat vigilance)", "dailySteps": 15000, "bloodPressure": "136/88"}, "selfAssessment": {"lastCheckin": "2026-09-23", "moodScore": 2.6, "exhaustionLevel": "High", "familyWorryScore": 8, "reportedSymptoms": ["Combat hypervigilance", "Shoulder tension"]}, "aiRiskFactors": ["13 months in frontline bunker with direct sniper threat", "18 night observation post duties in 30 days", "Wife's impending surgical operation with no adult relative available"], "welfareRecommendations": ["Sanction 15-day Medical Attendant leave for spouse surgery", "Rotate out of forward bunker to company headquarters depot"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "SSB-11890", "name": "Lady Constable Priyanka Tamang", "rank": "Constable", "force": "SSB", "unit": "17 Battalion, Anti-Human Trafficking Unit", "station": "Panitanki Border, Indo-Nepal", "deploymentZone": "Border Surveillance & Women Safety Desk", "monthsInZone": 9, "age": 26, "yearsInService": 4, "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 75, "stressRiskLevel": "Low", "riskScore": 25, "consentStatus": {"consented": true, "consentDate": "2026-08-05", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 45, "consecutiveFieldDays": 45, "leaveApplicationsPending": 0, "leaveSanctionedDaysYear": 25, "leaveEntitlementRemaining": 35, "nightDutyShiftsPastMonth": 6, "averageSleepHours": 7.1, "restRecoveryScore": 80, "hardshipTenureMonths": 9, "familyEmergencyStatus": "Normal, regular home contact in Darjeeling"}, "biometrics": {"restingHeartRate": 63, "hrvMs": 64, "sleepQuality": "Optimal", "dailySteps": 13500, "bloodPressure": "115/75"}, "selfAssessment": {"lastCheckin": "2026-09-24", "moodScore": 4.7, "exhaustionLevel": "Low", "familyWorryScore": 2, "reportedSymptoms": ["None"]}, "aiRiskFactors": ["Emotional secondary trauma from trafficking interception cases (managed via peer counseling)", "Healthy rest balance"], "welfareRecommendations": ["Provide psychological debrief sessions post rescue operations", "Commendation for high-performing trafficking interception"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "CRPF-12001", "name": "Assistant Commandant Ankit Sharma", "rank": "Assistant Commandant", "force": "CRPF", "unit": "150 Battalion, Bravo Company Commander", "station": "Dantewada, Chhattisgarh", "deploymentZone": "Maoist Insurgency Red Corridor", "monthsInZone": 17, "age": 32, "yearsInService": 9, "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 5, "stressRiskLevel": "Critical", "riskScore": 97, "consentStatus": {"consented": true, "consentDate": "2026-04-14", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 230, "consecutiveFieldDays": 250, "leaveApplicationsPending": 2, "leaveSanctionedDaysYear": 10, "leaveEntitlementRemaining": 50, "nightDutyShiftsPastMonth": 21, "averageSleepHours": 4.2, "restRecoveryScore": 27, "hardshipTenureMonths": 17, "familyEmergencyStatus": "Pregnant wife in 8th month with gestational complications in Jaipur"}, "biometrics": {"restingHeartRate": 88, "hrvMs": 24, "sleepQuality": "Critical Deficit", "dailySteps": 22000, "bloodPressure": "144/94"}, "selfAssessment": {"lastCheckin": "2026-09-23", "moodScore": 1.7, "exhaustionLevel": "Severe", "familyWorryScore": 10, "reportedSymptoms": ["Severe operational stress", "Acid reflux", "Insomnia"]}, "aiRiskFactors": ["Company Commander carrying full operational responsibility for 130 troops in high-risk IED belt", "Wife entering delivery month with medical complications while 1,500km away", "230 days continuous field tenure without leave relief", "Signs of severe executive burnout and sympathetic adrenal overdrive"], "welfareRecommendations": ["PRIORITY 1: Immediate relief of command by Second-in-Command (2IC)", "Sanction 25-day Paternity & Special Welfare Leave with direct air transit clearance", "Executive medical check-up at AIIMS New Delhi en route"], "actionHistory": [], "treatmentHistory": [], "liveStressLevel": 97, "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "treatmentPriority": "Immediate Priority", "treatmentRequired": {"priority": "Immediate Priority", "priorityClass": "immediate", "threshold": "70% and higher", "badgeColor": "#ef4444", "modalities": ["Emergency Psychiatric Consultation & Clinical Evaluation", "Acute Clinical Decompression Therapy (In-Clinic)", "Mandatory 48-Hour Buddy Watch & In-Patient Rest Mandate", "Pharmacotherapy Evaluation & Sleep Cycle Reset Regimen", "Immediate Temporary Duty Withdrawal from Weapon-Bearing Posts"], "primaryFocus": "Crisis stabilization, suicide/self-harm risk mitigation, and neuro-autonomic reset."}, "stressClassification": "Immediate Priority", "modelConfidence": 0.85, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "directMoReferral": {"active": false}, "commanderApprovedForTreatment": {"active": false}, "moReferralPending": false}, {"id": "IN-99014", "name": "Lieutenant Commander Varun Nambiar", "rank": "Lt Commander", "force": "Indian Navy", "unit": "Submarine Arm (INS Kalvari)", "station": "Eastern Fleet, Visakhapatnam", "deploymentZone": "Submerged Long-Endurance Patrol", "monthsInZone": 5, "age": 34, "yearsInService": 12, "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 25, "stressRiskLevel": "High", "riskScore": 75, "consentStatus": {"consented": true, "consentDate": "2026-07-11", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 85, "consecutiveFieldDays": 85, "leaveApplicationsPending": 0, "leaveSanctionedDaysYear": 20, "leaveEntitlementRemaining": 40, "nightDutyShiftsPastMonth": 15, "averageSleepHours": 5.4, "restRecoveryScore": 56, "hardshipTenureMonths": 5, "familyEmergencyStatus": "Normal, spouse in Naval Officers Enclave, Vizag"}, "biometrics": {"restingHeartRate": 70, "hrvMs": 48, "sleepQuality": "Artificial diurnal cycle adaptation", "dailySteps": 8500, "bloodPressure": "122/82"}, "selfAssessment": {"lastCheckin": "2026-09-24", "moodScore": 3.8, "exhaustionLevel": "Moderate", "familyWorryScore": 3, "reportedSymptoms": ["Vitamin D lack", "Circadian phase delay"]}, "aiRiskFactors": ["Zero natural sunlight for 45-day submerged mission cycles", "High sensory hyper-vigilance (sonar acoustic monitoring)"], "welfareRecommendations": ["Prescribe full-spectrum bright light therapy and Vitamin D3 supplementation", "Mandatory 7-day decompression leave post-patrol"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": true, "validatedBy": "Maj. Sunita Rao (Welfare Officer)", "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": {"actionType": "Reduce Workload & Shift Duty Cap", "severityLevel": "High", "suggestedAction": "Immediately cap night patrol duty to maximum 4 shifts per month; withdraw from frontline weapon-bearing posts for 7-day rest rotation.", "notes": "Severe operational circadian exhaustion observed. Capping workload will facilitate REM sleep restoration and autonomic recovery.", "status": "Pending Review", "timestamp": "2026-09-29 00:54", "approvedAt": null, "approvedBy": null}}, "liveStressLevel": 75, "treatmentPriority": "Immediate Priority", "treatmentRequired": {"priority": "Immediate Priority", "priorityClass": "immediate", "threshold": "70% and higher", "badgeColor": "#ef4444", "modalities": ["Emergency Psychiatric Consultation & Clinical Evaluation", "Acute Clinical Decompression Therapy (In-Clinic)", "Mandatory 48-Hour Buddy Watch & In-Patient Rest Mandate", "Pharmacotherapy Evaluation & Sleep Cycle Reset Regimen", "Immediate Temporary Duty Withdrawal from Weapon-Bearing Posts"], "primaryFocus": "Crisis stabilization, suicide/self-harm risk mitigation, and neuro-autonomic reset."}, "stressClassification": "Immediate Priority", "modelConfidence": 0.8598, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "directMoReferral": {"active": false}, "commanderApprovedForTreatment": {"active": false}, "moReferralPending": false}, {"id": "BSF-33201", "name": "Constable Jagdish Meena", "rank": "Constable", "force": "BSF", "unit": "194 Battalion, Creek Crocodile Commando", "station": "Sir Creek, Gujarat", "deploymentZone": "Tidal Salt Marshes & Extreme Salinity", "monthsInZone": 12, "age": 30, "yearsInService": 8, "photo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 51, "stressRiskLevel": "Moderate", "riskScore": 60, "consentStatus": {"consented": true, "consentDate": "2026-06-22", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 135, "consecutiveFieldDays": 140, "leaveApplicationsPending": 1, "leaveSanctionedDaysYear": 15, "leaveEntitlementRemaining": 45, "nightDutyShiftsPastMonth": 14, "averageSleepHours": 5.5, "restRecoveryScore": 51, "hardshipTenureMonths": 12, "familyEmergencyStatus": "Normal, family in Dausa, Rajasthan"}, "biometrics": {"restingHeartRate": 75, "hrvMs": 42, "sleepQuality": "Moderate", "dailySteps": 16800, "bloodPressure": "128/84"}, "selfAssessment": {"lastCheckin": "2026-09-23", "moodScore": 3.4, "exhaustionLevel": "Moderate", "familyWorryScore": 5, "reportedSymptoms": ["Extreme salt glare eye strain", "Foot skin maceration"]}, "aiRiskFactors": ["Corrosive marsh environment with high isolation and solar reflection", "High night amphibious patrol density"], "welfareRecommendations": ["Issue polarized UV protective tactical goggles", "Approve upcoming 15-day festival leave application for Diwali"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "IAF-22108", "name": "Corporal Rohit Deshmukh", "rank": "Corporal", "force": "Indian Air Force", "unit": "Air Defence Radar Station", "station": "Naliya, Kutch", "deploymentZone": "Forward Operational Early Warning Radar", "monthsInZone": 10, "age": 27, "yearsInService": 6, "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 69, "stressRiskLevel": "Low", "riskScore": 31, "consentStatus": {"consented": true, "consentDate": "2026-08-18", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 60, "consecutiveFieldDays": 60, "leaveApplicationsPending": 0, "leaveSanctionedDaysYear": 24, "leaveEntitlementRemaining": 36, "nightDutyShiftsPastMonth": 7, "averageSleepHours": 6.9, "restRecoveryScore": 75, "hardshipTenureMonths": 10, "familyEmergencyStatus": "Normal, communication daily via mobile"}, "biometrics": {"restingHeartRate": 64, "hrvMs": 59, "sleepQuality": "Good", "dailySteps": 11000, "bloodPressure": "116/76"}, "selfAssessment": {"lastCheckin": "2026-09-24", "moodScore": 4.5, "exhaustionLevel": "Low", "familyWorryScore": 1, "reportedSymptoms": ["None"]}, "aiRiskFactors": ["Predictable shift rotation schedule with adequate turnaround"], "welfareRecommendations": ["Maintain current operational cadence", "Eligible for technical advanced instrumentation training"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "AR-44018", "name": "Havildar David Vanlalhruaia", "rank": "Havildar", "force": "Assam Rifles", "unit": "10 Assam Rifles", "station": "Ukhrul, Nagaland Border", "deploymentZone": "Dense Ridge Mountain Counter-Insurgency", "monthsInZone": 14, "age": 36, "yearsInService": 15, "photo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 47, "stressRiskLevel": "High", "riskScore": 72, "consentStatus": {"consented": true, "consentDate": "2026-06-25", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 165, "consecutiveFieldDays": 180, "leaveApplicationsPending": 1, "leaveSanctionedDaysYear": 15, "leaveEntitlementRemaining": 45, "nightDutyShiftsPastMonth": 16, "averageSleepHours": 5.1, "restRecoveryScore": 43, "hardshipTenureMonths": 14, "familyEmergencyStatus": "Teenage daughter hospitalized with severe dengue in Aizawl"}, "biometrics": {"restingHeartRate": 77, "hrvMs": 37, "sleepQuality": "Moderate", "dailySteps": 19200, "bloodPressure": "130/84"}, "selfAssessment": {"lastCheckin": "2026-09-23", "moodScore": 2.9, "exhaustionLevel": "Moderate-High", "familyWorryScore": 8, "reportedSymptoms": ["Knee joint inflammation", "Family anxiety"]}, "aiRiskFactors": ["14 months steep jungle terrain patrolling", "Active family medical crisis with daughter in hospital", "Accumulated leave deficit"], "welfareRecommendations": ["Expedite 14-day emergency compassionate leave to visit daughter", "Knee joint orthopaedic check-up at Base Hospital"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "CRPF-55102", "name": "Constable Manpreet Kaur", "rank": "Constable", "force": "CRPF", "unit": "Rapid Action Force (RAF 99 Bn)", "station": "Ahmedabad Rapid Deployment Camp", "deploymentZone": "Communal Riot Control & Rapid Response", "monthsInZone": 9, "age": 27, "yearsInService": 5, "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 63, "stressRiskLevel": "Moderate", "riskScore": 47, "consentStatus": {"consented": true, "consentDate": "2026-07-29", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 80, "consecutiveFieldDays": 80, "leaveApplicationsPending": 0, "leaveSanctionedDaysYear": 18, "leaveEntitlementRemaining": 42, "nightDutyShiftsPastMonth": 11, "averageSleepHours": 6.2, "restRecoveryScore": 64, "hardshipTenureMonths": 9, "familyEmergencyStatus": "Normal, periodic phone calls with family in Patiala"}, "biometrics": {"restingHeartRate": 69, "hrvMs": 51, "sleepQuality": "Good", "dailySteps": 15800, "bloodPressure": "120/78"}, "selfAssessment": {"lastCheckin": "2026-09-24", "moodScore": 4.1, "exhaustionLevel": "Moderate", "familyWorryScore": 3, "reportedSymptoms": ["Fatigue after heavy drill week"]}, "aiRiskFactors": ["Spike in sudden 30-minute riot control mobilizations", "Physical muscle strain"], "welfareRecommendations": ["Provide scheduled sauna & physical recovery sessions", "Maintain current leave rotation schedule"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "IA-88091", "name": "Subedar Major Balram Thapa", "rank": "Subedar Major", "force": "Indian Army", "unit": "1/11 Gorkha Rifles", "station": "Kupwara, North Kashmir", "deploymentZone": "Dense Pine Forest Infiltration Counter-Ops", "monthsInZone": 15, "age": 46, "yearsInService": 25, "photo": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 23, "stressRiskLevel": "High", "riskScore": 77, "consentStatus": {"consented": true, "consentDate": "2026-05-19", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 125, "consecutiveFieldDays": 140, "leaveApplicationsPending": 0, "leaveSanctionedDaysYear": 20, "leaveEntitlementRemaining": 40, "nightDutyShiftsPastMonth": 12, "averageSleepHours": 5.7, "restRecoveryScore": 57, "hardshipTenureMonths": 15, "familyEmergencyStatus": "Normal, son selected in NDA Khadakwasla (source of pride)"}, "biometrics": {"restingHeartRate": 70, "hrvMs": 47, "sleepQuality": "Acceptable", "dailySteps": 17000, "bloodPressure": "128/82"}, "selfAssessment": {"lastCheckin": "2026-09-24", "moodScore": 4.0, "exhaustionLevel": "Moderate", "familyWorryScore": 2, "reportedSymptoms": ["Mild chronic lower back ache"]}, "aiRiskFactors": ["High senior non-commissioned officer responsibility for all battalion jawans' morale", "Harsh winter mountain terrain"], "welfareRecommendations": ["Physiotherapy for chronic lumbar spine alignment", "Appoint as Senior Battalion Welfare Advisory Mentor"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "liveStressLevel": 77, "treatmentPriority": "Immediate Priority", "treatmentRequired": {"priority": "Immediate Priority", "priorityClass": "immediate", "threshold": "70% and higher", "badgeColor": "#ef4444", "modalities": ["Emergency Psychiatric Consultation & Clinical Evaluation", "Acute Clinical Decompression Therapy (In-Clinic)", "Mandatory 48-Hour Buddy Watch & In-Patient Rest Mandate", "Pharmacotherapy Evaluation & Sleep Cycle Reset Regimen", "Immediate Temporary Duty Withdrawal from Weapon-Bearing Posts"], "primaryFocus": "Crisis stabilization, suicide/self-harm risk mitigation, and neuro-autonomic reset."}, "stressClassification": "Immediate Priority", "modelConfidence": 0.9139, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "directMoReferral": {"active": false}, "commanderApprovedForTreatment": {"active": false}, "moReferralPending": false}, {"id": "CISF-88190", "name": "Head Constable Satish Pillai", "rank": "Head Constable", "force": "CISF", "unit": "Bhabha Atomic Research Centre Security", "station": "Trombay, Mumbai", "deploymentZone": "Strategic Nuclear Facility Perimeter Security", "monthsInZone": 11, "age": 36, "yearsInService": 14, "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 71, "stressRiskLevel": "Low", "riskScore": 29, "consentStatus": {"consented": true, "consentDate": "2026-07-03", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 60, "consecutiveFieldDays": 60, "leaveApplicationsPending": 0, "leaveSanctionedDaysYear": 26, "leaveEntitlementRemaining": 34, "nightDutyShiftsPastMonth": 7, "averageSleepHours": 7.0, "restRecoveryScore": 76, "hardshipTenureMonths": 11, "familyEmergencyStatus": "Family residing comfortably in Navi Mumbai"}, "biometrics": {"restingHeartRate": 65, "hrvMs": 60, "sleepQuality": "Good", "dailySteps": 13000, "bloodPressure": "118/76"}, "selfAssessment": {"lastCheckin": "2026-09-24", "moodScore": 4.6, "exhaustionLevel": "Low", "familyWorryScore": 1, "reportedSymptoms": ["None"]}, "aiRiskFactors": ["Controlled industrial access protocol environment with low dynamic threat"], "welfareRecommendations": ["Maintain current operational cadence", "Eligible for fire-fighting certification refresh"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "ITBP-77002", "name": "Constable Rigzin Namgyal", "rank": "Constable", "force": "ITBP", "unit": "Sikkim Sector High Altitude Post", "station": "Nathu La Pass, Sikkim (14,140 ft)", "deploymentZone": "Snowbound Strategic Border Pass", "monthsInZone": 13, "age": 28, "yearsInService": 6, "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 49, "stressRiskLevel": "High", "riskScore": 70, "consentStatus": {"consented": true, "consentDate": "2026-06-08", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 170, "consecutiveFieldDays": 180, "leaveApplicationsPending": 1, "leaveSanctionedDaysYear": 14, "leaveEntitlementRemaining": 46, "nightDutyShiftsPastMonth": 15, "averageSleepHours": 5.2, "restRecoveryScore": 44, "hardshipTenureMonths": 13, "familyEmergencyStatus": "Elderly grandmother unwell in Leh"}, "biometrics": {"restingHeartRate": 78, "hrvMs": 36, "sleepQuality": "Fragmented by extreme blizzards", "dailySteps": 14500, "bloodPressure": "130/84"}, "selfAssessment": {"lastCheckin": "2026-09-23", "moodScore": 3.0, "exhaustionLevel": "Moderate-High", "familyWorryScore": 7, "reportedSymptoms": ["Cold numbness in fingers", "Insomnia"]}, "aiRiskFactors": ["13 months sub-zero temperature deployment", "170 days without home leave", "Declining heart rate variability"], "welfareRecommendations": ["Sanction 15-day home leave to Leh via Gangtok transit", "Schedule medical check for early-stage frostnip"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "BSF-10294", "name": "Lady Constable Meenakshi Boro", "rank": "Constable", "force": "BSF", "unit": "South Bengal Frontier, Mahila Picket", "station": "Petrapole Integrated Checkpost", "deploymentZone": "High-Volume Border Crossing & Anti-Smuggling", "monthsInZone": 10, "age": 25, "yearsInService": 4, "photo": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 66, "stressRiskLevel": "Low", "riskScore": 34, "consentStatus": {"consented": true, "consentDate": "2026-08-02", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 65, "consecutiveFieldDays": 65, "leaveApplicationsPending": 0, "leaveSanctionedDaysYear": 22, "leaveEntitlementRemaining": 38, "nightDutyShiftsPastMonth": 9, "averageSleepHours": 6.7, "restRecoveryScore": 71, "hardshipTenureMonths": 10, "familyEmergencyStatus": "Normal, regular communication with home in Assam"}, "biometrics": {"restingHeartRate": 67, "hrvMs": 56, "sleepQuality": "Good", "dailySteps": 16200, "bloodPressure": "118/76"}, "selfAssessment": {"lastCheckin": "2026-09-24", "moodScore": 4.3, "exhaustionLevel": "Low", "familyWorryScore": 2, "reportedSymptoms": ["None"]}, "aiRiskFactors": ["Good physiological resilience metrics", "Adequate sleep recovery"], "welfareRecommendations": ["Continue current shift rotation schedule", "Eligible for canine handling certification"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": false, "validatedBy": null, "validationDate": null, "ratingStatus": "Pending Validation", "activeRecommendation": null}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}, {"id": "CRPF-33019", "name": "Constable Vinod Paswan", "rank": "Constable", "force": "CRPF", "unit": "204 CoBRA Battalion", "station": "Bijapur, Bastar", "deploymentZone": "Dense Sal Forest Deep Anti-Maoist Ops", "monthsInZone": 16, "age": 31, "yearsInService": 10, "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", "wellbeingPercentage": 35, "stressRiskLevel": "Critical", "riskScore": 91, "consentStatus": {"consented": true, "consentDate": "2026-05-02", "voluntaryBiometrics": true}, "hrIndicators": {"daysSinceLastLeave": 235, "consecutiveFieldDays": 250, "leaveApplicationsPending": 2, "leaveSanctionedDaysYear": 8, "leaveEntitlementRemaining": 52, "nightDutyShiftsPastMonth": 20, "averageSleepHours": 4.1, "restRecoveryScore": 26, "hardshipTenureMonths": 16, "familyEmergencyStatus": "Two children down with severe enteric typhoid in Gaya, Bihar"}, "biometrics": {"restingHeartRate": 87, "hrvMs": 23, "sleepQuality": "Severe Deficit", "dailySteps": 21500, "bloodPressure": "142/92"}, "selfAssessment": {"lastCheckin": "2026-09-22", "moodScore": 1.6, "exhaustionLevel": "Severe", "familyWorryScore": 10, "reportedSymptoms": ["Extreme anxiety", "Tremors", "Severe sleep loss"]}, "aiRiskFactors": ["235 days without leave in active IED and ambush jungle warfare", "Extreme family crisis with both young children hospitalized", "Autonomic nervous system exhaustion (HRV 23ms, sleep 4.1 hrs)", "Severe psychological distress"], "welfareRecommendations": ["PRIORITY 1: Immediate sanction of 20 days emergency compassionate leave", "Stand down from jungle ambush operations immediately", "Battalion psychologist debrief before travel to railhead"], "actionHistory": [], "treatmentHistory": [], "welfareAdvisory": {"isValidated": true, "validatedBy": "Maj. Sunita Rao (Welfare Officer)", "validationDate": "2026-09-24", "ratingStatus": "Validated", "activeRecommendation": {"actionType": "Sanction Leave & Decompression", "suggestedAction": "Sanction 20 days special compassionate leave and rotate out of jungle patrol operations.", "severityLevel": "Critical", "notes": "Overdue leave by 210 days; mother critical illness in Gaya. Persistent combat hypervigilance.", "dispatchedAt": "2026-09-24 16:20", "status": "Pending Review", "approvedAt": null, "approvedBy": null}}, "welfareCommanderReporting": {"applicationSubmitted": false, "commanderApproved": false, "absenceReported": false, "reportedToCommander": false, "status": "Normal Duty"}, "directMoReferral": {"active": false}, "directEmergencyReferral": {"isDirectReferral": false, "bypassedCommander": false}, "commanderApprovedForTreatment": {"active": false}, "medicalTreatment": {"status": "Not Referred", "prescribedModality": null, "prescribedBy": null, "prescribedDate": null, "clinicalNotes": null, "reportedToWelfare": false}, "moReferralPending": false}];

  const STORAGE_KEY = 'RAKSHAK_PERSISTENT_DATA_V3_CLEAN';
  const SCHEMA_VERSION = 'v3.2';

  // -------------------------------------------------------------
  // SELF-HEALING SCHEMA VALIDATOR & CORRUPTION PREVENTER
  // -------------------------------------------------------------
  function validateAndHealRecord(p, factoryMap) {
    if (!p || typeof p !== 'object' || !p.id) return null;
    const defaultRecord = factoryMap.get(p.id) || p;

    // Core fields
    if (!p.name) p.name = defaultRecord.name || 'Personnel';
    if (!p.rank) p.rank = defaultRecord.rank || 'Jawan';
    if (!p.force) p.force = defaultRecord.force || 'Security Forces';
    if (!p.unit) p.unit = defaultRecord.unit || 'HQ Battalion';
    if (!p.station) p.station = defaultRecord.station || 'Base Station';
    if (typeof p.liveStressLevel !== 'number') p.liveStressLevel = defaultRecord.liveStressLevel || 50;
    if (typeof p.wellbeingPercentage !== 'number') p.wellbeingPercentage = 100 - p.liveStressLevel;
    if (typeof p.stressScore !== 'number') p.stressScore = p.liveStressLevel;
    if (!p.stressRiskLevel) {
      p.stressRiskLevel = p.liveStressLevel >= 75 ? 'Critical' : p.liveStressLevel >= 50 ? 'High' : p.liveStressLevel >= 30 ? 'Moderate' : 'Low';
    }

    // Ensure sub-objects exist
    if (!p.hrIndicators || typeof p.hrIndicators !== 'object') p.hrIndicators = Object.assign({}, defaultRecord.hrIndicators || {});
    if (!p.biometrics || typeof p.biometrics !== 'object') p.biometrics = Object.assign({}, defaultRecord.biometrics || {});
    if (!p.selfAssessment || typeof p.selfAssessment !== 'object') p.selfAssessment = Object.assign({}, defaultRecord.selfAssessment || {});

    // Ensure 75% protocol workflow objects exist with safe defaults
    if (!p.directMoReferral || typeof p.directMoReferral !== 'object') {
      p.directMoReferral = { active: false };
    }
    if (!p.directEmergencyReferral || typeof p.directEmergencyReferral !== 'object') {
      p.directEmergencyReferral = { isDirectReferral: false, bypassedCommander: false };
    }
    if (!p.commanderApprovedForTreatment || typeof p.commanderApprovedForTreatment !== 'object') {
      p.commanderApprovedForTreatment = { active: false };
    }
    if (!p.welfareCommanderReporting || typeof p.welfareCommanderReporting !== 'object') {
      p.welfareCommanderReporting = {
        applicationSubmitted: false,
        commanderApproved: false,
        absenceReported: false,
        reportedToCommander: false,
        status: 'Normal Duty'
      };
    }
    if (!p.medicalTreatment || typeof p.medicalTreatment !== 'object') {
      p.medicalTreatment = {
        status: 'Not Referred',
        prescribedModality: null,
        prescribedBy: null,
        prescribedDate: null,
        clinicalNotes: null,
        reportedToWelfare: false
      };
    }

    if (!Array.isArray(p.treatmentHistory)) p.treatmentHistory = [];
    if (!Array.isArray(p.actionHistory)) p.actionHistory = [];

    return p;
  }

  function loadHealedDB() {
    const factoryMap = new Map();
    FACTORY_PERSONNEL.forEach(item => factoryMap.set(item.id, item));

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const healedList = [];
          const existingIds = new Set();

          parsed.forEach(item => {
            const healed = validateAndHealRecord(item, factoryMap);
            if (healed && !existingIds.has(healed.id)) {
              existingIds.add(healed.id);
              healedList.push(healed);
            }
          });

          // If any records were missing from factory, restore them
          FACTORY_PERSONNEL.forEach(f => {
            if (!existingIds.has(f.id)) {
              healedList.push(JSON.parse(JSON.stringify(f)));
            }
          });

          return healedList;
        }
      }
    } catch(err) {
      console.warn('[Rakshak AI] Corrupted localStorage detected. Auto-recovering from pristine baseline.', err);
    }

    // Default: Clean deep copy of factory personnel
    const fresh = JSON.parse(JSON.stringify(FACTORY_PERSONNEL));
    saveDB(fresh);
    return fresh;
  }

  function saveDB(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      localStorage.setItem('RAKSHAK_STORAGE_META', JSON.stringify({
        version: SCHEMA_VERSION,
        lastUpdated: new Date().toISOString(),
        recordCount: list.length
      }));
    } catch(err) {
      console.warn('[Rakshak AI] localStorage write warning (operating in memory):', err);
    }
  }

  let memoryPersonnel = loadHealedDB();

  function getFormatDate() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  function calcStats(list) {
    const total = list.length;
    let critical = 0, high = 0, moderate = 0, low = 0, sum = 0;
    list.forEach(p => {
      const s = p.liveStressLevel !== undefined ? p.liveStressLevel : (p.stressScore || 0);
      sum += s;
      if (s >= 75) critical++;
      else if (s >= 50) high++;
      else if (s >= 30) moderate++;
      else low++;
    });
    const avg = total > 0 ? (sum / total).toFixed(1) : 0;
    const readiness = Math.max(10, Math.min(95, Math.round(100 - (critical * 3.5 + high * 2.0))));
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

  // -------------------------------------------------------------
  // UNIVERSAL FETCH INTERCEPTOR (COVERS 100% OF SYSTEM ENDPOINTS)
  // -------------------------------------------------------------
  const nativeFetch = window.fetch;

  window.fetch = async function(resource, init = {}) {
    let urlStr = '';
    if (typeof resource === 'string') {
      urlStr = resource;
    } else if (resource && resource.url) {
      urlStr = resource.url;
    }

    const method = (init.method || 'GET').toUpperCase();

    // Only intercept /api/ requests (or when running on GitHub Pages / file protocol)
    const isApiRequest = urlStr.includes('/api/') || urlStr.includes('api/');
    if (!isApiRequest && !shouldIntercept) {
      return nativeFetch(resource, init);
    }

    // If on localhost/server and NOT forced offline, attempt network first with fallback
    if (!shouldIntercept) {
      try {
        const netRes = await nativeFetch(resource, init);
        if (netRes.status < 500 && netRes.status !== 404) {
          return netRes;
        }
      } catch(netErr) {
        console.warn('[Rakshak AI] Live server offline, falling back to client-side engine for:', urlStr);
      }
    }

    // --- 1. GET /api/analytics ---
    if (urlStr.includes('/api/analytics')) {
      const stats = calcStats(memoryPersonnel);
      return new Response(JSON.stringify(stats), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // --- 2. GET /api/medical/patients (Strict 75% protocol isolation) ---
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

    // --- 3. GET /api/export-report ---
    if (urlStr.includes('/api/export-report')) {
      let csv = 'ID,Name,Rank,Force,Unit,Station,StressLevel,WellbeingPct,RiskLevel,CommanderApproval,MOTreatmentStatus\n';
      memoryPersonnel.forEach(p => {
        const isApp = p.welfareCommanderReporting?.commanderApproved ? 'Approved' : 'Pending/None';
        const moStat = p.medicalTreatment?.status || 'Not Referred';
        csv += `"${p.id}","${p.name}","${p.rank}","${p.force}","${p.unit}","${p.station}",${p.liveStressLevel},${p.wellbeingPercentage},"${p.stressRiskLevel}","${isApp}","${moStat}"\n`;
      });
      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="Rakshak_Personnel_Report.csv"'
        }
      });
    }

    // --- 4. POST /api/welfare/direct-referral (>75% Stress Direct MO Referral) ---
    if (urlStr.includes('/api/welfare/direct-referral') || urlStr.includes('/api/welfare/emergency-mo-referral')) {
      let body = {};
      try { body = JSON.parse(init.body || '{}'); } catch(e) {}
      const pid = body.soldierId || body.personnelId;
      const target = memoryPersonnel.find(p => p.id.toLowerCase() === (pid || '').toLowerCase());

      if (!target) {
        return new Response(JSON.stringify({ success: false, detail: 'Personnel not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const now = getFormatDate();
      const modality = body.modality || body.prescribedModality || '1-on-1 Critical Psychiatric Counseling & Trauma CBT';
      const severity = body.severity || 'Critical / Severe (>75% Stress)';
      const notes = body.notes || 'Acute autonomic overload (>75%). Urgent direct referral dispatched to Medical Officer.';

      target.directMoReferral = {
        active: true,
        referredAt: now,
        severity: severity,
        recommendedModality: modality,
        notes: notes,
        status: 'Directly Referred to MO (>75%)',
        referredBy: 'Maj. Sunita Rao (Unit Welfare Officer)'
      };

      target.directEmergencyReferral = {
        isDirectReferral: true,
        bypassedCommander: true,
        referredAt: now,
        stressLevel: target.liveStressLevel,
        reason: `Severe stress ${target.liveStressLevel}% > 75% — Direct clinical referral to MO`,
        notes: notes,
        status: 'In MO Clinical Queue',
        referredBy: 'Maj. Sunita Rao (Unit Welfare Officer)'
      };

      target.moReferralPending = true;

      target.medicalTreatment = {
        status: 'Undergoing Treatment',
        prescribedModality: modality,
        clinicalNotes: notes,
        prescribedDate: now,
        reportedToWelfare: true,
        treatmentPlanNotes: notes,
        authorizedBy: 'Maj. Sunita Rao (Welfare Officer)'
      };

      target.welfareCommanderReporting = {
        applicationSubmitted: false,
        absenceReported: true,
        requestMode: 'notice',
        reportedAt: now,
        status: 'Undergoing MO Care (>75%)',
        absenceReason: `Urgent Direct MO Referral: ${modality}`,
        commanderApproved: false
      };

      if (!target.treatmentHistory) target.treatmentHistory = [];
      target.treatmentHistory.unshift({
        treatmentId: 'TRT-' + Date.now(),
        modality: modality,
        status: 'Undergoing Treatment',
        date: now,
        prescribedBy: 'Maj. Sunita Rao (Unit Welfare Officer)',
        notes: notes,
        stressLevelAtTreatment: target.liveStressLevel
      });

      saveDB(memoryPersonnel);

      return new Response(JSON.stringify({
        success: true,
        message: `Direct treatment request for ${target.name} (Stress: ${target.liveStressLevel}%) sent to Medical Officer.`,
        personnel: target,
        directMoReferral: target.directMoReferral
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // --- 5. POST /api/welfare/submit-application (<=75% Stress Commander Application) ---
    if (urlStr.includes('/api/welfare/submit-application') || urlStr.includes('/api/welfare/report-commander-absence')) {
      let body = {};
      try { body = JSON.parse(init.body || '{}'); } catch(e) {}
      const pid = body.soldierId || body.personnelId;
      const target = memoryPersonnel.find(p => p.id.toLowerCase() === (pid || '').toLowerCase());

      if (!target) {
        return new Response(JSON.stringify({ success: false, detail: 'Personnel not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const now = getFormatDate();
      const days = parseInt(body.absenceDays || 3, 10);
      const reason = body.absenceReason || body.reason || 'Mild/Moderate Stress Decompression & Counseling';
      const modality = body.requestedModality || body.recommendedModality || '1-on-1 Counseling & Therapy Sessions';
      const notes = body.notes || 'Welfare application requesting Commander sanction for medical treatment.';

      target.welfareCommanderReporting = {
        applicationSubmitted: true,
        reportedToCommander: true,
        reportedAt: now,
        personnelStatus: 'Pending Commander Approval',
        absenceReported: true,
        requestMode: 'permission',
        absenceDays: days,
        absenceReason: reason,
        requestedModality: modality,
        notes: notes,
        commanderApproved: false,
        status: 'Pending Commander Approval',
        reportedBy: 'Maj. Sunita Rao (Unit Welfare Officer)'
      };

      // Reset active MO referral until commander sanctions
      target.commanderApprovedForTreatment = { active: false };
      target.directMoReferral = { active: false };
      target.directEmergencyReferral = { isDirectReferral: false, bypassedCommander: false };
      target.medicalTreatment = {
        status: 'Pending Commander Approval',
        prescribedModality: null,
        prescribedBy: null,
        prescribedDate: null,
        clinicalNotes: notes,
        reportedToWelfare: false
      };

      saveDB(memoryPersonnel);

      return new Response(JSON.stringify({
        success: true,
        message: `Treatment application for ${target.name} (Stress: ${target.liveStressLevel}%) submitted to Commanding Officer for approval.`,
        personnel: target,
        welfareCommanderReporting: target.welfareCommanderReporting
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // --- 6. POST /api/commander/approve-treatment-application (Commander Approval) ---
    if (urlStr.includes('/api/commander/approve-treatment-application') || urlStr.includes('/api/commander/approve-absence')) {
      let body = {};
      try { body = JSON.parse(init.body || '{}'); } catch(e) {}
      const pid = body.soldierId || body.personnelId;
      const target = memoryPersonnel.find(p => p.id.toLowerCase() === (pid || '').toLowerCase());

      if (!target) {
        return new Response(JSON.stringify({ success: false, detail: 'Personnel not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const now = getFormatDate();
      if (!target.welfareCommanderReporting) target.welfareCommanderReporting = {};
      target.welfareCommanderReporting.commanderApproved = true;
      target.welfareCommanderReporting.approvedAt = now;
      target.welfareCommanderReporting.approvedBy = 'Col. Virendra Saxena (Commanding Officer)';
      target.welfareCommanderReporting.status = 'Approved for Treatment';
      target.welfareCommanderReporting.personnelStatus = 'Undergoing Treatment';

      const modality = target.welfareCommanderReporting.requestedModality || '1-on-1 Counseling & Therapy Sessions';
      target.commanderApprovedForTreatment = {
        active: true,
        approvedAt: now,
        approvedBy: 'Col. Virendra Saxena (Commanding Officer)',
        status: 'Commander Sanctioned - In MO Queue'
      };

      target.medicalTreatment = {
        status: 'Undergoing Treatment',
        prescribedModality: modality,
        prescribedDate: now,
        prescribedBy: 'Dr. Capt. Ananya Sharma (Senior MO)',
        clinicalNotes: `Sanctioned by Commander. Assigned modality: ${modality}`,
        reportedToWelfare: true
      };

      if (!target.treatmentHistory) target.treatmentHistory = [];
      target.treatmentHistory.unshift({
        treatmentId: 'TRT-' + Date.now(),
        modality: modality,
        status: 'Undergoing Treatment',
        date: now,
        prescribedBy: 'Dr. Capt. Ananya Sharma (Senior MO)',
        notes: `Commander sanctioned absence. Scheduled for ${modality}.`,
        stressLevelAtTreatment: target.liveStressLevel
      });

      saveDB(memoryPersonnel);

      return new Response(JSON.stringify({
        success: true,
        message: `Treatment application approved by Commander for ${target.name}. Personnel forwarded to Medical Officer queue with options to treat.`,
        personnel: target
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // --- 7. POST /api/commander/batch-approve-absence ---
    if (urlStr.includes('/api/commander/batch-approve-absence')) {
      let body = {};
      try { body = JSON.parse(init.body || '{}'); } catch(e) {}
      const pids = body.soldierIds || [];
      const now = getFormatDate();
      let approvedCount = 0;

      memoryPersonnel.forEach(p => {
        if (!pids.length || pids.includes(p.id)) {
          if (!p.welfareCommanderReporting) p.welfareCommanderReporting = {};
          if (!p.welfareCommanderReporting.commanderApproved) {
            p.welfareCommanderReporting.commanderApproved = true;
            p.welfareCommanderReporting.approvedAt = now;
            p.welfareCommanderReporting.approvedBy = 'Col. Virendra Saxena (Commanding Officer)';
            p.welfareCommanderReporting.status = 'Approved for Treatment';
            p.welfareCommanderReporting.personnelStatus = 'Undergoing Treatment';

            const modality = p.welfareCommanderReporting.requestedModality || '1-on-1 Counseling & Therapy Sessions';
            p.commanderApprovedForTreatment = {
              active: true,
              approvedAt: now,
              approvedBy: 'Col. Virendra Saxena (Commanding Officer)',
              status: 'Commander Sanctioned - In MO Queue'
            };

            p.medicalTreatment = {
              status: 'Undergoing Treatment',
              prescribedModality: modality,
              prescribedDate: now,
              prescribedBy: 'Dr. Capt. Ananya Sharma (Senior MO)',
              clinicalNotes: `Batch sanctioned by Commander. Assigned modality: ${modality}`,
              reportedToWelfare: true
            };
            approvedCount++;
          }
        }
      });

      saveDB(memoryPersonnel);

      return new Response(JSON.stringify({
        success: true,
        approvedCount: approvedCount,
        message: `Successfully approved ${approvedCount} applications and forwarded personnel to Medical Officer queue.`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // --- 8. POST /api/medical/prescribe-treatment ---
    if (urlStr.includes('/api/medical/prescribe-treatment')) {
      let body = {};
      try { body = JSON.parse(init.body || '{}'); } catch(e) {}
      const pid = body.soldierId || body.personnelId;
      const target = memoryPersonnel.find(p => p.id.toLowerCase() === (pid || '').toLowerCase());

      if (!target) {
        return new Response(JSON.stringify({ success: false, detail: 'Patient not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const now = getFormatDate();
      const status = body.status || 'Treated / Discharged';
      const modality = body.modality || (Array.isArray(body.modalities) ? body.modalities[0] : null) || target.medicalTreatment?.prescribedModality || 'Clinical Counseling & Therapy Sessions';
      const notes = body.treatmentNotes || body.clinicalNotes || 'Treatment session completed and synced with Welfare Officer.';

      target.medicalTreatment = {
        status: status,
        prescribedModality: modality,
        clinicalNotes: notes,
        prescribedDate: now,
        prescribedBy: 'Dr. Capt. Ananya Sharma (Senior MO)',
        reportedToWelfare: true
      };

      if (!target.treatmentHistory) target.treatmentHistory = [];
      target.treatmentHistory.unshift({
        treatmentId: 'TRT-' + Date.now(),
        modality: modality,
        status: status,
        date: now,
        prescribedBy: 'Dr. Capt. Ananya Sharma (Senior MO)',
        notes: notes,
        stressLevelAtTreatment: target.liveStressLevel
      });

      // If discharged/treated, simulate positive psychological recovery
      if (status === 'Treated / Discharged') {
        const relief = Math.round(25 + Math.random() * 15);
        target.liveStressLevel = Math.max(15, target.liveStressLevel - relief);
        target.stressScore = target.liveStressLevel;
        target.wellbeingPercentage = 100 - target.liveStressLevel;
        target.stressRiskLevel = target.liveStressLevel >= 75 ? 'Critical' : target.liveStressLevel >= 50 ? 'High' : target.liveStressLevel >= 30 ? 'Moderate' : 'Low';
        if (target.directMoReferral) target.directMoReferral.status = 'Treated & Discharged';
      }

      if (target.welfareCommanderReporting) {
        target.welfareCommanderReporting.status = status;
        target.welfareCommanderReporting.personnelStatus = status;
      }

      saveDB(memoryPersonnel);

      return new Response(JSON.stringify({
        success: true,
        message: `Clinical treatment prescribed for ${target.name}. Syncing with Welfare.`,
        personnel: target
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // --- 9. POST /api/reset-all-data ---
    if (urlStr.includes('/api/reset-all-data')) {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('RAKSHAK_OFFLINE_DATA_V2');
      } catch(e) {}

      memoryPersonnel = JSON.parse(JSON.stringify(FACTORY_PERSONNEL));
      saveDB(memoryPersonnel);

      return new Response(JSON.stringify({
        success: true,
        message: 'All options and workflow data successfully reset to pristine clean state.'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // --- 10. POST /api/self-assessment (Daily Check-In & Stress Calculation) ---
    if (urlStr.includes('/api/self-assessment')) {
      let body = {};
      try { body = JSON.parse(init.body || '{}'); } catch(e) {}
      const pid = body.personnelId || 'CRPF-94821';
      let target = memoryPersonnel.find(p => p.id.toLowerCase() === pid.toLowerCase()) || memoryPersonnel[0];

      const sleep = parseFloat(body.sleepHours || 6.0);
      const mood = parseFloat(body.moodScore || 3.0);
      const exhaustion = body.exhaustionLevel || 'Moderate';
      const famWorry = parseFloat(body.familyWorryScore || 4.0);
      const symptoms = body.reportedSymptoms || [];

      target.selfAssessment = {
        lastCheckin: new Date().toISOString().split('T')[0],
        moodScore: mood,
        exhaustionLevel: exhaustion,
        familyWorryScore: famWorry,
        reportedSymptoms: symptoms
      };

      if (!target.hrIndicators) target.hrIndicators = {};
      target.hrIndicators.averageSleepHours = sleep;

      const rhr = (target.biometrics && target.biometrics.restingHeartRate) || 72;
      const daysLeave = target.hrIndicators.daysSinceLastLeave || 45;

      // Empirical military psychological stress algorithm matching backend
      let score = Math.round(50 + (8 - sleep) * 5 + (3 - mood) * 10 + (rhr - 72) * 0.5 + (daysLeave > 90 ? 10 : 0));
      score = Math.max(10, Math.min(98, score));

      target.liveStressLevel = score;
      target.stressScore = score;
      target.riskScore = score;
      target.wellbeingPercentage = 100 - score;
      target.stressRiskLevel = score >= 75 ? 'Critical' : score >= 50 ? 'High' : score >= 30 ? 'Moderate' : 'Low';
      target.stressClassification = target.stressRiskLevel + ' Priority';

      saveDB(memoryPersonnel);

      return new Response(JSON.stringify({
        success: true,
        personnel: target,
        metrics: {
          wellbeing: target.wellbeingPercentage,
          risk: target.stressRiskLevel,
          score: target.liveStressLevel,
          classification: target.stressClassification,
          confidence: 0.95,
          treatmentRequired: target.treatmentRequired || {}
        },
        engine: 'Empirical Heuristic Model (GitHub Pages Edition)'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // --- 11. POST /predict or /api/predict ---
    if (urlStr.includes('/predict')) {
      let body = {};
      try { body = JSON.parse(init.body || '{}'); } catch(e) {}
      const sleep = parseFloat(body.sleepHours || body.sleep_hours || 6.5);
      const mood = parseFloat(body.moodScore || body.mood_score || 3.0);
      const rhr = parseFloat(body.restingHeartRate || body.resting_heart_rate || 72);
      const daysLeave = parseFloat(body.daysSinceLastLeave || body.days_since_last_leave || 60);

      let score = Math.round(50 + (8 - sleep) * 5 + (3 - mood) * 10 + (rhr - 72) * 0.5 + (daysLeave > 90 ? 10 : 0));
      score = Math.max(10, Math.min(98, score));
      const risk = score >= 75 ? 'CRITICAL' : score >= 50 ? 'HIGH' : score >= 30 ? 'MODERATE' : 'LOW';

      return new Response(JSON.stringify({
        success: true,
        predicted_stress_score: score,
        wellbeing_percentage: 100 - score,
        stress_risk_level: risk,
        stress_class: risk,
        confidence: 0.94,
        engine: 'Client-Side Neural Heuristics (GitHub Pages Edition)'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // --- 12. GET /api/personnel/:id (Single soldier lookup) ---
    const matchSingle = urlStr.match(/\/api\/personnel\/([^\/\?]+)$/);
    if (matchSingle && method === 'GET') {
      const pid = matchSingle[1];
      const target = memoryPersonnel.find(p => p.id.toLowerCase() === pid.toLowerCase());
      if (target) {
        return new Response(JSON.stringify(target), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ detail: 'Personnel not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // --- 13. POST /api/personnel/:id/welfare-advisory ---
    const matchAdvisory = urlStr.match(/\/api\/personnel\/([^\/]+)\/welfare-advisory$/);
    if (matchAdvisory && method === 'POST') {
      const pid = matchAdvisory[1];
      const target = memoryPersonnel.find(p => p.id.toLowerCase() === pid.toLowerCase());
      if (target) {
        let body = {};
        try { body = JSON.parse(init.body || '{}'); } catch(e) {}
        if (!target.welfareAdvisory) target.welfareAdvisory = {};
        target.welfareAdvisory.isValidated = true;
        target.welfareAdvisory.validatedBy = 'Maj. Sunita Rao (Welfare Officer)';
        target.welfareAdvisory.validationDate = new Date().toISOString().split('T')[0];
        target.welfareAdvisory.activeRecommendation = {
          actionType: body.actionType || 'Sanction 14-Day Compassionate Leave',
          severityLevel: body.severity || 'High',
          suggestedAction: body.suggestedAction || 'Arrange personal care & buddy debrief.',
          notes: body.notes || 'Welfare advisory dispatched to Commander.',
          status: 'Pending Review',
          dispatchedAt: getFormatDate()
        };
        saveDB(memoryPersonnel);
        return new Response(JSON.stringify({ success: true, personnel: target }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // --- 14. POST /api/personnel/:id/commander-approve-advisory ---
    const matchApproveAdv = urlStr.match(/\/api\/personnel\/([^\/]+)\/commander-approve-advisory$/);
    if (matchApproveAdv && method === 'POST') {
      const pid = matchApproveAdv[1];
      const target = memoryPersonnel.find(p => p.id.toLowerCase() === pid.toLowerCase());
      if (target) {
        if (target.welfareAdvisory && target.welfareAdvisory.activeRecommendation) {
          target.welfareAdvisory.activeRecommendation.status = 'Approved & Sanctioned';
          target.welfareAdvisory.activeRecommendation.approvedAt = getFormatDate();
          target.welfareAdvisory.activeRecommendation.approvedBy = 'Col. Virendra Saxena (Commanding Officer)';
        }
        saveDB(memoryPersonnel);
        return new Response(JSON.stringify({ success: true, personnel: target }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // --- 15. POST /api/personnel/:id/welfare-validate ---
    const matchValidate = urlStr.match(/\/api\/personnel\/([^\/]+)\/welfare-validate$/);
    if (matchValidate && method === 'POST') {
      const pid = matchValidate[1];
      const target = memoryPersonnel.find(p => p.id.toLowerCase() === pid.toLowerCase());
      if (target) {
        if (!target.welfareAdvisory) target.welfareAdvisory = {};
        target.welfareAdvisory.isValidated = true;
        target.welfareAdvisory.validatedBy = 'Maj. Sunita Rao (Welfare Officer)';
        target.welfareAdvisory.validationDate = new Date().toISOString().split('T')[0];
        target.welfareAdvisory.ratingStatus = 'Validated';
        saveDB(memoryPersonnel);
        return new Response(JSON.stringify({ success: true, personnel: target }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // --- 16. GET /api/personnel (Search, Filter & Sort) ---
    if (urlStr.includes('/api/personnel') || urlStr.endsWith('api/personnel')) {
      let filtered = [...memoryPersonnel];
      try {
        const parsedUrl = new URL(urlStr, window.location.origin);
        const q = (parsedUrl.searchParams.get('q') || '').toLowerCase().trim();
        const risk = parsedUrl.searchParams.get('risk');
        const sort = parsedUrl.searchParams.get('sort');

        if (q) {
          filtered = filtered.filter(p =>
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.id && p.id.toLowerCase().includes(q)) ||
            (p.rank && p.rank.toLowerCase().includes(q)) ||
            (p.force && p.force.toLowerCase().includes(q)) ||
            (p.unit && p.unit.toLowerCase().includes(q)) ||
            (p.station && p.station.toLowerCase().includes(q))
          );
        }

        if (risk && risk !== 'ALL') {
          filtered = filtered.filter(p =>
            (p.stressRiskLevel && p.stressRiskLevel.toUpperCase() === risk.toUpperCase())
          );
        }

        if (sort) {
          if (sort === 'stress_desc') filtered.sort((a, b) => (b.liveStressLevel || 0) - (a.liveStressLevel || 0));
          else if (sort === 'stress_asc') filtered.sort((a, b) => (a.liveStressLevel || 0) - (b.liveStressLevel || 0));
          else if (sort === 'leave_desc') filtered.sort((a, b) => (b.hrIndicators?.daysSinceLastLeave || 0) - (a.hrIndicators?.daysSinceLastLeave || 0));
          else if (sort === 'name') filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }
      } catch(e) {}

      return new Response(JSON.stringify(filtered), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fallback for any unknown /api/ route
    return new Response(JSON.stringify({ success: true, clientEngine: true, note: 'Synthetic fallback' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  console.log('[Rakshak AI] Universal Engine Ready: 28 personnel, 75% protocol, MO isolation & corruption prevention loaded.');
})();
