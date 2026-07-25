from fastapi import APIRouter
from app.services.data_service import get_analytics_data

router = APIRouter()

@router.get("/api/analytics")
def analytics():
    return get_analytics_data()