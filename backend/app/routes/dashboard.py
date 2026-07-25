from fastapi import APIRouter
from app.services.data_service import get_dashboard_data

router = APIRouter()

@router.get("/api/dashboard")
def dashboard():
    return get_dashboard_data()