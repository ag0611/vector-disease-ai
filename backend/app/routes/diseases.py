from fastapi import APIRouter
from app.services.data_service import get_diseases_data

router = APIRouter()

@router.get("/api/diseases")
def diseases():
    return get_diseases_data()