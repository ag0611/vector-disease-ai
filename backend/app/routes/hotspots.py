from fastapi import APIRouter, Query
from app.services.data_service import get_hotspots

router = APIRouter()

@router.get("/api/hotspots")
def hotspots(disease: str = Query("Overall")):
    return get_hotspots(disease)