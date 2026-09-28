import urllib.request
import json

base_url = 'http://127.0.0.1:8000'

# 1. Test /api/model-info
with urllib.request.urlopen(f'{base_url}/api/model-info', timeout=5) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    print('GET /api/model-info -> Model Loaded:', data['modelLoaded'], '| Features:', data['featuresCount'])

# 2. Test /api/personnel
with urllib.request.urlopen(f'{base_url}/api/personnel', timeout=5) as resp:
    personnel = json.loads(resp.read().decode('utf-8'))
    print(f'GET /api/personnel -> Retrieved {len(personnel)} personnel')
    p0 = personnel[0]
    print(f"  Sample record: {p0['id']} ({p0['name']}) -> Stress: {p0['liveStressLevel']}%, Classification: {p0['stressClassification']}")

# 3. Test /api/self-assessment POST (Automated Check-In Form Submission)
checkin_payload = json.dumps({
    'personnelId': 'CRPF-94821',
    'moodScore': 1.0,
    'sleepHours': 3.5,
    'exhaustionLevel': 'Critical',
    'familyWorryScore': 9.0,
    'reportedSymptoms': ['Severe Insomnia', 'Tremors', 'Hyper-Vigilance']
}).encode('utf-8')

req = urllib.request.Request(f'{base_url}/api/self-assessment', data=checkin_payload, headers={'Content-Type': 'application/json'}, method='POST')
with urllib.request.urlopen(req, timeout=5) as resp:
    res = json.loads(resp.read().decode('utf-8'))
    print('\nPOST /api/self-assessment Response:')
    print('  Success:', res['success'])
    print('  Metrics:', res['metrics'])
    print('  Engine:', res['engine'])

# 4. Test /predict POST (Direct Classification & Score)
pred_payload = json.dumps({
    'sleep_hours': 7.5,
    'mood_score': 4.5,
    'resting_heart_rate': 62.0,
    'hrv_ms': 68.0,
    'days_since_last_leave': 20.0,
    'consecutive_field_days': 10.0
}).encode('utf-8')

req2 = urllib.request.Request(f'{base_url}/predict', data=pred_payload, headers={'Content-Type': 'application/json'}, method='POST')
with urllib.request.urlopen(req2, timeout=5) as resp:
    res2 = json.loads(resp.read().decode('utf-8'))
    print('\nPOST /predict Response:')
    print(f"  Predicted Stress: {res2['predicted_stress_score']}%")
    print(f"  Classification: {res2['stress_class']}")
    print(f"  Confidence: {res2['confidence']}")
    print(f"  Treatment Required: {res2['treatment_required']['priority']}")

print("\nAll Backend Verification Checks Passed Successfully!")
