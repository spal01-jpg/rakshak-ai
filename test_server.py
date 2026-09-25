import urllib.request
import json
import time
import sys

# Windows console encoding fix
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

BASE_URL = "http://127.0.0.1:8080"

def run_tests():
    print("Testing Rakshak AI Server Endpoints...")
    
    # 1. Test GET /api/personnel
    try:
        req = urllib.request.urlopen(f"{BASE_URL}/api/personnel")
        assert req.status == 200, f"Expected 200, got {req.status}"
        data = json.loads(req.read().decode('utf-8'))
        assert len(data) >= 7, f"Expected at least 7 personnel, got {len(data)}"
        print(f"[PASS] GET /api/personnel passed. Retrieved {len(data)} personnel records.")
    except Exception as e:
        print(f"[FAIL] GET /api/personnel failed: {e}")
        return False

    # 2. Test Search by Name
    try:
        req = urllib.request.urlopen(f"{BASE_URL}/api/personnel?q=Rajesh")
        data = json.loads(req.read().decode('utf-8'))
        assert len(data) == 1, f"Expected 1 record for Rajesh, got {len(data)}"
        assert "Rajesh" in data[0]["name"], f"Name mismatch: {data[0]['name']}"
        print(f"[PASS] Search by name passed for 'Rajesh': {data[0]['name']} ({data[0]['id']}) - Risk: {data[0]['stressRiskLevel']}, Wellbeing: {data[0]['wellbeingPercentage']}%")
    except Exception as e:
        print(f"[FAIL] Search failed: {e}")
        return False

    # 3. Test Personnel Details
    try:
        req = urllib.request.urlopen(f"{BASE_URL}/api/personnel/CRPF-94821")
        data = json.loads(req.read().decode('utf-8'))
        assert data["id"] == "CRPF-94821", f"ID mismatch: {data['id']}"
        assert len(data["welfareRecommendations"]) > 0, "Missing welfare recommendations"
        print(f"[PASS] GET /api/personnel/CRPF-94821 passed. Risk factors count: {len(data['aiRiskFactors'])}")
    except Exception as e:
        print(f"[FAIL] Personnel details failed: {e}")
        return False

    # 4. Test AI Companion Chatbot
    try:
        chat_payload = json.dumps({"message": "Mujhe ek joke sunao mood off hai"}).encode('utf-8')
        req = urllib.request.Request(f"{BASE_URL}/api/chat", data=chat_payload, headers={'Content-Type': 'application/json'}, method='POST')
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            assert "reply" in data, "Missing reply"
            assert len(data["suggestedQuickReplies"]) > 0, "Missing quick replies"
            print(f"[PASS] POST /api/chat passed (Joke Query). Reply preview: {data['reply'][:50]}...")
    except Exception as e:
        print(f"[FAIL] Chatbot test failed: {e}")
        return False

    # 5. Test Chatbot Crisis Intervention
    try:
        crisis_payload = json.dumps({"message": "I feel like giving up on life and suicide"}).encode('utf-8')
        req = urllib.request.Request(f"{BASE_URL}/api/chat", data=crisis_payload, headers={'Content-Type': 'application/json'}, method='POST')
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            assert data["isCrisis"] == True, "Failed to flag crisis"
            assert "14416" in data["reply"], "Missing emergency helpline in crisis response"
            print("[PASS] Chatbot crisis safety net passed (Detected and provided 14416 Tele-MANAS).")
    except Exception as e:
        print(f"[FAIL] Crisis safety net test failed: {e}")
        return False

    # 6. Test Commander Welfare Action Dispatch
    try:
        action_payload = json.dumps({"actionType": "Sanction 15-Day Welfare Leave", "notes": "Approved for father's hospital treatment"}).encode('utf-8')
        req = urllib.request.Request(f"{BASE_URL}/api/personnel/CRPF-94821/welfare-action", data=action_payload, headers={'Content-Type': 'application/json'}, method='POST')
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            assert data["success"] == True, "Welfare action failed"
            print(f"[PASS] Welfare action dispatch passed. New days since leave: {data['updatedPersonnel']['hrIndicators']['daysSinceLastLeave']}")
    except Exception as e:
        print(f"[FAIL] Welfare action failed: {e}")
        return False

    # 7. Test Unit Analytics
    try:
        req = urllib.request.urlopen(f"{BASE_URL}/api/analytics")
        data = json.loads(req.read().decode('utf-8'))
        assert "forceReadinessIndex" in data, "Missing force readiness"
        assert "riskDistribution" in data, "Missing risk distribution"
        print(f"[PASS] GET /api/analytics passed. Readiness: {data['forceReadinessIndex']}%, Monitored: {data['totalMonitored']}")
    except Exception as e:
        print(f"[FAIL] Analytics test failed: {e}")
        return False

    print("\n[SUCCESS] ALL 7 AUTOMATED TESTS PASSED!")
    return True

if __name__ == '__main__':
    run_tests()
