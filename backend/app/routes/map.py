from fastapi import APIRouter, Query
from app.services.data_service import get_map_data

router = APIRouter()

@router.get("/api/map")
def map_data(disease: str = Query("Overall")):
    return get_map_data(disease)