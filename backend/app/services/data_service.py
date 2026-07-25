import json
from datetime import datetime, timedelta
from typing import List, Dict, Any
import random

STATES_DATA = [
    {"name": "Maharashtra", "code": "MH", "lat": 19.7515, "lng": 75.7139, "pop": 124000000},
    {"name": "Kerala", "code": "KL", "lat": 10.8505, "lng": 76.2711, "pop": 33000000},
    {"name": "West Bengal", "code": "WB", "lat": 22.9868, "lng": 87.8550, "pop": 91000000},
    {"name": "Odisha", "code": "OD", "lat": 20.9517, "lng": 85.0985, "pop": 42000000},
    {"name": "NCT of Delhi", "code": "DL", "lat": 28.7041, "lng": 77.1025, "pop": 19000000},
    {"name": "Bihar", "code": "BR", "lat": 25.0961, "lng": 85.3131, "pop": 104000000},
    {"name": "Tamil Nadu", "code": "TN", "lat": 11.1271, "lng": 78.6569, "pop": 72000000},
    {"name": "Assam", "code": "AS", "lat": 26.2006, "lng": 92.9376, "pop": 31000000},
    {"name": "Uttar Pradesh", "code": "UP", "lat": 26.8467, "lng": 80.9462, "pop": 200000000},
    {"name": "Karnataka", "code": "KA", "lat": 15.3173, "lng": 75.7139, "pop": 61000000},
    {"name": "Jharkhand", "code": "JH", "lat": 23.6102, "lng": 85.2799, "pop": 33000000},
    {"name": "Chhattisgarh", "code": "CT", "lat": 21.2787, "lng": 81.8661, "pop": 26000000},
    {"name": "Madhya Pradesh", "code": "MP", "lat": 22.9734, "lng": 78.6569, "pop": 73000000},
    {"name": "Andhra Pradesh", "code": "AP", "lat": 15.9129, "lng": 79.7400, "pop": 49000000},
    {"name": "Gujarat", "code": "GJ", "lat": 22.2587, "lng": 71.1924, "pop": 60000000},
    {"name": "Rajasthan", "code": "RJ", "lat": 27.0238, "lng": 74.2179, "pop": 68000000},
    {"name": "Punjab", "code": "PB", "lat": 31.1471, "lng": 75.3412, "pop": 28000000},
    {"name": "Haryana", "code": "HR", "lat": 29.0588, "lng": 76.0856, "pop": 25000000},
    {"name": "Telangana", "code": "TG", "lat": 18.1124, "lng": 79.0193, "pop": 35000000},
    {"name": "Meghalaya", "code": "ML", "lat": 25.4670, "lng": 91.3662, "pop": 3000000},
    {"name": "Tripura", "code": "TR", "lat": 23.9408, "lng": 91.9882, "pop": 4000000},
    {"name": "Manipur", "code": "MN", "lat": 24.6637, "lng": 93.9063, "pop": 3000000},
    {"name": "Mizoram", "code": "MZ", "lat": 23.1645, "lng": 92.9376, "pop": 1000000},
    {"name": "Nagaland", "code": "NL", "lat": 26.1584, "lng": 94.5624, "pop": 2000000},
    {"name": "Arunachal Pradesh", "code": "AR", "lat": 28.2180, "lng": 94.7278, "pop": 1000000},
    {"name": "Sikkim", "code": "SK", "lat": 27.5330, "lng": 88.5122, "pop": 600000},
    {"name": "Goa", "code": "GA", "lat": 15.2993, "lng": 74.1240, "pop": 1500000},
    {"name": "Himachal Pradesh", "code": "HP", "lat": 31.1048, "lng": 77.1734, "pop": 7000000},
    {"name": "Uttarakhand", "code": "UK", "lat": 30.0668, "lng": 79.0193, "pop": 10000000},
    {"name": "Jammu & Kashmir", "code": "JK", "lat": 33.7782, "lng": 76.5762, "pop": 14000000},
    {"name": "Ladakh", "code": "LA", "lat": 34.1526, "lng": 77.5770, "pop": 300000},
    {"name": "Puducherry", "code": "PY", "lat": 11.9416, "lng": 79.8083, "pop": 1300000},
    {"name": "Chandigarh", "code": "CH", "lat": 30.7333, "lng": 76.7794, "pop": 1000000},
    {"name": "Dadra & NH", "code": "DN", "lat": 20.1809, "lng": 73.0169, "pop": 600000},
    {"name": "Lakshadweep", "code": "LD", "lat": 10.5667, "lng": 72.6417, "pop": 65000},
    {"name": "Andaman & Nicobar", "code": "AN", "lat": 11.7401, "lng": 92.6586, "pop": 400000},
]

DISEASE_RISK = {
    "Dengue": {
        "MH": {"risk": 82, "cases": 4820, "historical": 18400, "temp": 31, "humidity": 78, "rainfall": 412},
        "KL": {"risk": 79, "cases": 3120, "historical": 14200, "temp": 30, "humidity": 76, "rainfall": 356},
        "DL": {"risk": 74, "cases": 2410, "historical": 11200, "temp": 34, "humidity": 65, "rainfall": 180},
        "TN": {"risk": 71, "cases": 2980, "historical": 13500, "temp": 32, "humidity": 72, "rainfall": 290},
        "UP": {"risk": 68, "cases": 3620, "historical": 16800, "temp": 33, "humidity": 68, "rainfall": 220},
        "KA": {"risk": 66, "cases": 2410, "historical": 11000, "temp": 29, "humidity": 70, "rainfall": 310},
        "WB": {"risk": 68, "cases": 1980, "historical": 9200, "temp": 31, "humidity": 80, "rainfall": 380},
        "AP": {"risk": 61, "cases": 1820, "historical": 8400, "temp": 30, "humidity": 69, "rainfall": 270},
        "GJ": {"risk": 66, "cases": 2180, "historical": 10100, "temp": 33, "humidity": 64, "rainfall": 210},
        "RJ": {"risk": 55, "cases": 1420, "historical": 6600, "temp": 36, "humidity": 55, "rainfall": 160},
    },
    "Malaria": {
        "OD": {"risk": 88, "cases": 4210, "historical": 19500, "temp": 30, "humidity": 82, "rainfall": 480},
        "WB": {"risk": 86, "cases": 3120, "historical": 14400, "temp": 31, "humidity": 80, "rainfall": 380},
        "AS": {"risk": 84, "cases": 2140, "historical": 9900, "temp": 28, "humidity": 85, "rainfall": 520},
        "BR": {"risk": 82, "cases": 2680, "historical": 12400, "temp": 32, "humidity": 75, "rainfall": 340},
        "CT": {"risk": 80, "cases": 1980, "historical": 9200, "temp": 29, "humidity": 78, "rainfall": 410},
        "JH": {"risk": 78, "cases": 1820, "historical": 8400, "temp": 30, "humidity": 76, "rainfall": 390},
        "MP": {"risk": 74, "cases": 2110, "historical": 9800, "temp": 31, "humidity": 72, "rainfall": 340},
        "ML": {"risk": 72, "cases": 460, "historical": 2100, "temp": 22, "humidity": 88, "rainfall": 580},
        "TR": {"risk": 68, "cases": 520, "historical": 2400, "temp": 27, "humidity": 83, "rainfall": 420},
        "MN": {"risk": 65, "cases": 380, "historical": 1800, "temp": 24, "humidity": 80, "rainfall": 460},
    },
    "Chikungunya": {
        "KL": {"risk": 71, "cases": 980, "historical": 4500, "temp": 30, "humidity": 76, "rainfall": 356},
        "KA": {"risk": 68, "cases": 890, "historical": 4100, "temp": 29, "humidity": 70, "rainfall": 310},
        "TN": {"risk": 62, "cases": 720, "historical": 3300, "temp": 32, "humidity": 72, "rainfall": 290},
        "MH": {"risk": 54, "cases": 640, "historical": 2900, "temp": 31, "humidity": 78, "rainfall": 412},
        "DL": {"risk": 52, "cases": 340, "historical": 1600, "temp": 34, "humidity": 65, "rainfall": 180},
        "AP": {"risk": 48, "cases": 420, "historical": 1900, "temp": 30, "humidity": 69, "rainfall": 270},
        "TG": {"risk": 46, "cases": 380, "historical": 1700, "temp": 31, "humidity": 68, "rainfall": 260},
        "WB": {"risk": 42, "cases": 340, "historical": 1600, "temp": 31, "humidity": 80, "rainfall": 380},
        "GJ": {"risk": 42, "cases": 380, "historical": 1700, "temp": 33, "humidity": 64, "rainfall": 210},
    }
}

def get_risk_level(score: int) -> str:
    if score < 25: return "Low"
    elif score < 50: return "Moderate"
    elif score < 75: return "High"
    else: return "Critical"

def get_dashboard_data() -> Dict[str, Any]:
    high_risk_states = sum(1 for d in DISEASE_RISK.values() 
                          for s in d.values() if s["risk"] >= 60)
    
    monthly_cases = [
        {"month": "Jan", "cases": 12000},
        {"month": "Feb", "cases": 15000},
        {"month": "Mar", "cases": 18000},
        {"month": "Apr", "cases": 28000},
        {"month": "May", "cases": 45000},
        {"month": "Jun", "cases": 68000},
        {"month": "Jul", "cases": 72000},
        {"month": "Aug", "cases": 70000},
        {"month": "Sep", "cases": 55000},
        {"month": "Oct", "cases": 38000},
        {"month": "Nov", "cases": 22000},
        {"month": "Dec", "cases": 14000},
    ]

    rainfall_trend = [
        {"month": "Jan", "rainfall": 120},
        {"month": "Feb", "rainfall": 140},
        {"month": "Mar", "rainfall": 130},
        {"month": "Apr", "rainfall": 150},
        {"month": "May", "rainfall": 160},
        {"month": "Jun", "rainfall": 420},
        {"month": "Jul", "rainfall": 460},
        {"month": "Aug", "rainfall": 480},
        {"month": "Sep", "rainfall": 440},
        {"month": "Oct", "rainfall": 320},
        {"month": "Nov", "rainfall": 140},
        {"month": "Dec", "rainfall": 130},
    ]

    alerts = []
    for disease, states in DISEASE_RISK.items():
        for code, data in states.items():
            state_name = next((s["name"] for s in STATES_DATA if s["code"] == code), code)
            if data["risk"] >= 75:
                alerts.append({
                    "state": state_name,
                    "disease": disease,
                    "severity": "Critical",
                    "message": f"Critical {disease} outbreak risk in {state_name}"
                })
            elif data["risk"] >= 60:
                alerts.append({
                    "state": state_name,
                    "disease": disease,
                    "severity": "High",
                    "message": f"Rising {disease} activity in {state_name}"
                })

    return {
        "overall_risk": 53,
        "risk_level": "Moderate",
        "high_risk_states": 14,
        "total_states": 36,
        "active_alerts": len([a for a in alerts if a["severity"] in ["Critical", "High"]][:32]),
        "diseases_monitored": 4,
        "monthly_cases": monthly_cases,
        "rainfall_trend": rainfall_trend,
        "alerts": alerts[:6],
        "last_sync": datetime.utcnow().isoformat()
    }

def get_map_data(disease: str = "Overall") -> List[Dict]:
    result = []
    for state in STATES_DATA:
        code = state["code"]
        if disease == "Overall":
            max_risk = 0
            primary_disease = "Dengue"
            total_cases = 0
            hist_cases = 0
            temp, hum, rain = 28, 70, 200
            for d_name, d_states in DISEASE_RISK.items():
                if code in d_states:
                    if d_states[code]["risk"] > max_risk:
                        max_risk = d_states[code]["risk"]
                        primary_disease = d_name
                    total_cases += d_states[code]["cases"]
                    hist_cases = d_states[code]["historical"]
                    temp = d_states[code]["temp"]
                    hum = d_states[code]["humidity"]
                    rain = d_states[code]["rainfall"]
            risk = max_risk if max_risk > 0 else random.randint(5, 45)
        else:
            d_states = DISEASE_RISK.get(disease, {})
            if code in d_states:
                data = d_states[code]
                risk = data["risk"]
                primary_disease = disease
                total_cases = data["cases"]
                hist_cases = data["historical"]
                temp = data["temp"]
                hum = data["humidity"]
                rain = data["rainfall"]
            else:
                risk = random.randint(5, 40)
                primary_disease = disease
                total_cases = random.randint(50, 500)
                hist_cases = random.randint(200, 2000)
                temp = random.randint(20, 35)
                hum = random.randint(50, 80)
                rain = random.randint(80, 300)

        predicted_7d = min(100, int(risk * 1.07))
        confidence = 0.92 if risk > 70 else (0.85 if risk > 50 else 0.78)

        rainfall_c = round(min(38, rain/600*100*0.3/risk*100) if risk > 0 else 30, 0)
        humidity_c = round(min(30, hum/100*100*0.25/risk*100) if risk > 0 else 25, 0)
        hist_c = round(min(28, hist_cases/20000*100*0.20/risk*100) if risk > 0 else 22, 0)
        temp_c = round(min(20, (temp-20)/20*100*0.15/risk*100) if risk > 0 else 13, 0)
        pop_c = round(max(5, 100 - rainfall_c - humidity_c - hist_c - temp_c), 0)

        result.append({
            "state": state["name"],
            "state_code": code,
            "lat": state["lat"],
            "lng": state["lng"],
            "population": state["pop"],
            "risk_score": risk,
            "risk_level": get_risk_level(risk),
            "primary_disease": primary_disease,
            "cases": total_cases,
            "historical_cases": hist_cases,
            "predicted_7d": predicted_7d,
            "confidence": confidence,
            "temperature": temp,
            "humidity": hum,
            "rainfall": rain,
            "risk_drivers": {
                "Rainfall": rainfall_c,
                "Humidity": humidity_c,
                "Historical cases": hist_c,
                "Temperature": temp_c,
                "Population density": pop_c
            }
        })

    return sorted(result, key=lambda x: x["risk_score"], reverse=True)

def get_hotspots(disease: str = "Overall") -> List[Dict]:
    return get_map_data(disease)

def get_diseases_data() -> List[Dict]:
    dengue_states = DISEASE_RISK.get("Dengue", {})
    malaria_states = DISEASE_RISK.get("Malaria", {})
    chik_states = DISEASE_RISK.get("Chikungunya", {})

    return [
        {
            "name": "Dengue",
            "vector": "Aedes aegypti",
            "description": "Aedes-borne viral fever; urban outbreaks tied to rainfall & stagnant water.",
            "ytd_cases": sum(s["cases"] for s in dengue_states.values()),
            "avg_risk": round(sum(s["risk"] for s in dengue_states.values()) / len(dengue_states)),
            "top_state": max(dengue_states, key=lambda x: dengue_states[x]["risk"])
        },
        {
            "name": "Malaria",
            "vector": "Anopheles spp.",
            "description": "Plasmodium infection via Anopheles; endemic in eastern & north-eastern states.",
            "ytd_cases": sum(s["cases"] for s in malaria_states.values()),
            "avg_risk": round(sum(s["risk"] for s in malaria_states.values()) / len(malaria_states)),
            "top_state": max(malaria_states, key=lambda x: malaria_states[x]["risk"])
        },
        {
            "name": "Chikungunya",
            "vector": "Aedes aegypti / albopictus",
            "description": "Aedes-borne; joint pain, low mortality but high morbidity.",
            "ytd_cases": sum(s["cases"] for s in chik_states.values()),
            "avg_risk": round(sum(s["risk"] for s in chik_states.values()) / len(chik_states)),
            "top_state": max(chik_states, key=lambda x: chik_states[x]["risk"])
        },
        {
            "name": "Japanese Encephalitis",
            "vector": "Culex mosquito",
            "description": "Viral brain infection; high mortality, endemic in UP, Bihar, Assam.",
            "ytd_cases": 2840,
            "avg_risk": 38,
            "top_state": "UP"
        }
    ]

def get_analytics_data() -> Dict:
    monthly_cases = [
        {"month": "Jan", "cases": 12000}, {"month": "Feb", "cases": 15000},
        {"month": "Mar", "cases": 18000}, {"month": "Apr", "cases": 28000},
        {"month": "May", "cases": 45000}, {"month": "Jun", "cases": 68000},
        {"month": "Jul", "cases": 72000}, {"month": "Aug", "cases": 70000},
        {"month": "Sep", "cases": 55000}, {"month": "Oct", "cases": 38000},
        {"month": "Nov", "cases": 22000}, {"month": "Dec", "cases": 14000},
    ]
    rainfall_trend = [
        {"month": "Jan", "rainfall": 120}, {"month": "Feb", "rainfall": 140},
        {"month": "Mar", "rainfall": 130}, {"month": "Apr", "rainfall": 150},
        {"month": "May", "rainfall": 160}, {"month": "Jun", "rainfall": 420},
        {"month": "Jul", "rainfall": 460}, {"month": "Aug", "rainfall": 480},
        {"month": "Sep", "rainfall": 440}, {"month": "Oct", "rainfall": 320},
        {"month": "Nov", "rainfall": 140}, {"month": "Dec", "rainfall": 130},
    ]
    risk_timeline = [{"day": f"D{i+1}", "risk": 45 + (i % 7) * 3 - (i % 5)} for i in range(30)]
    state_comparison = [
        {"state": "MH", "risk": 82}, {"state": "KL", "risk": 79},
        {"state": "WB", "risk": 78}, {"state": "OD", "risk": 74},
        {"state": "DL", "risk": 74}, {"state": "BR", "risk": 72},
        {"state": "TN", "risk": 71}, {"state": "AS", "risk": 70},
    ]
    weather_correlation = [
        {"humidity": h, "cases": int(h * 80 + (h-50)**2 * 2)}
        for h in [45, 52, 58, 63, 67, 70, 73, 76, 79, 82, 85, 88, 91, 94]
    ]
    return {
        "monthly_cases": monthly_cases,
        "rainfall_trend": rainfall_trend,
        "risk_timeline": risk_timeline,
        "state_comparison": state_comparison,
        "weather_correlation": weather_correlation
    }