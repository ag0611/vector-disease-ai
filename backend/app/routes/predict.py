from fastapi import APIRouter
from app.schemas.schemas import PredictRequest
from app.services.ml_service import ml_service

router = APIRouter()

@router.post("/api/predict")
def predict(req: PredictRequest):
    result = ml_service.predict(
        temperature=req.temperature,
        humidity=req.humidity,
        rainfall=req.rainfall,
        population_density=req.population_density,
        historical_cases=req.historical_cases
    )
    result["message"] = f"High {req.disease} risk detected in {req.state}. Immediate action recommended." if result["risk_score"] > 60 else f"{req.disease} risk is {result['risk_level']} in {req.state}."
    return result