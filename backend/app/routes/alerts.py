from fastapi import APIRouter
from app.services.data_service import get_dashboard_data

router = APIRouter()

@router.get("/api/alerts")
def alerts():
    data = get_dashboard_data()
    return data["alerts"]