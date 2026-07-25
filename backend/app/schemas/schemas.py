from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class StateBase(BaseModel):
    state_name: str
    state_code: str
    latitude: float
    longitude: float
    population: int

class StateResponse(StateBase):
    id: int
    class Config:
        from_attributes = True

class DiseaseResponse(BaseModel):
    id: int
    disease_name: str
    disease_code: str
    description: str
    vector: str
    class Config:
        from_attributes = True

class WeatherResponse(BaseModel):
    id: int
    state_id: int
    temperature: float
    humidity: float
    rainfall: float
    date: datetime
    class Config:
        from_attributes = True

class CaseResponse(BaseModel):
    id: int
    state_id: int
    disease_id: int
    total_cases: int
    date: datetime
    class Config:
        from_attributes = True

class PredictionResponse(BaseModel):
    id: int
    state_id: int
    disease_id: int
    risk_score: float
    confidence: float
    predicted_cases: int
    risk_level: str
    date: datetime
    class Config:
        from_attributes = True

class AlertResponse(BaseModel):
    id: int
    state_id: int
    disease_id: int
    severity: str
    message: str
    created_at: datetime
    is_active: bool
    class Config:
        from_attributes = True

class PredictRequest(BaseModel):
    state: str
    disease: str
    temperature: float
    humidity: float
    rainfall: float
    population_density: float
    historical_cases: int

class PredictResponse(BaseModel):
    risk_score: float
    risk_level: str
    confidence: float
    predicted_cases: int
    message: str
    risk_drivers: dict

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str