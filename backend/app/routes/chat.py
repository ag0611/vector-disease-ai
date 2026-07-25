from fastapi import APIRouter
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.data_service import DISEASE_RISK, get_risk_level, STATES_DATA
import re

router = APIRouter()

def generate_response(message: str) -> str:
    msg = message.lower()
    
    if any(w in msg for w in ["highest", "top", "worst", "critical"]):
        if "dengue" in msg:
            return "The states with highest Dengue risk this week are: Maharashtra (Risk: 82, Critical), Kerala (79, High), NCT of Delhi (74, High), Tamil Nadu (71, High). Maharashtra needs immediate intervention with 3 rapid-response teams deployed."
        elif "malaria" in msg:
            return "Top Malaria hotspots: Odisha (Risk: 88, Critical), West Bengal (86, Critical), Assam (84, Critical), Bihar (82, Critical). Eastern states are under severe Malaria pressure this monsoon season."
        else:
            return "Current highest risk states: Maharashtra (Dengue, 82-Critical), Odisha (Malaria, 88-Critical), Kerala (Dengue, 79-High). 14 of 36 states have risk score ≥ 60."

    for state in STATES_DATA:
        if state["name"].lower() in msg or state["code"].lower() in msg:
            sname = state["name"]
            scode = state["code"]
            info = []
            for disease, states in DISEASE_RISK.items():
                if scode in states:
                    d = states[scode]
                    info.append(f"{disease}: Risk {d['risk']} ({get_risk_level(d['risk'])}), Cases: {d['cases']:,}, Temp: {d['temp']}°C, Humidity: {d['humidity']}%, Rainfall: {d['rainfall']}mm")
            if info:
                resp = f"**{sname} Disease Intelligence:**\n"
                resp += "\n".join(f"• {i}" for i in info)
                resp += f"\n\n**Risk Drivers:** Rainfall (38%), Humidity (27%), Historical cases (22%), Temperature (13%)"
                return resp
            return f"{sname} currently shows Low risk. Environmental conditions are favorable with no significant outbreaks detected."

    if "recommend" in msg or "intervention" in msg or "action" in msg:
        state_match = None
        for s in STATES_DATA:
            if s["name"].lower() in msg:
                state_match = s["name"]
        if state_match:
            return f"**Recommended interventions for {state_match}:**\n• Deploy 3 rapid-response teams immediately\n• Prioritize Dengue case surveillance in urban wards\n• Issue public health advisory within 24 hours\n• Community fogging in identified hotspot clusters\n• Distribute LLINs in high-risk zones\n• Reserve 18% ward capacity in district hospitals\n• Stock diagnostic kits and IV fluids for 2 weeks"
        return "**General Recommendations:**\n• Increase surveillance in High/Critical states\n• Deploy fogging teams in high-rainfall zones\n• Issue public health advisories in 14 high-risk states\n• Stock hospitals with dengue/malaria diagnostic kits\n• Public awareness via SMS and radio in local languages"

    if "rainfall" in msg or "weather" in msg or "climate" in msg:
        return "Rainfall is the primary driver (38% contribution) of vector-borne disease risk in India. June-September monsoon season sees 3-4x spike in Dengue and Malaria cases. States with >400mm/month rainfall like Maharashtra, Odisha, and Assam are at Critical risk."

    if "compare" in msg:
        return "**State Comparison (Top Risk):**\n• Maharashtra: Dengue 82 (Critical)\n• Odisha: Malaria 88 (Critical)\n• West Bengal: Malaria 86 (Critical)\n• Kerala: Dengue 79 (High)\n\nMonsoon states dominate the high-risk list. Rainfall correlation with cases is strongest in eastern India."

    return "I'm the VBD analyst assistant. I can help you with:\n• State-level risk scores and drivers\n• Disease-specific hotspot analysis\n• Intervention recommendations\n• Rainfall-disease correlations\n• Historical trend analysis\n\nTry asking: 'Which states have highest dengue risk?' or 'Recommend interventions for Maharashtra'"

@router.post("/api/chat")
def chat(req: ChatRequest):
    response = generate_response(req.message)
    return {"response": response}