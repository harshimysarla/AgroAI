"""
Disease Encyclopedia Endpoints.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status

from backend.app.services.disease_service import get_all_disease_profiles, get_disease_profile_by_id

router = APIRouter()


@router.get("/diseases", response_model=List[Dict[str, Any]])
async def list_all_diseases():
    """Returns curated botanical profiles for all 10 tomato leaf classes."""
    return get_all_disease_profiles()


@router.get("/diseases/{disease_id}", response_model=Dict[str, Any])
async def get_disease_by_id(disease_id: str):
    """Returns comprehensive disease profile for a specific disease identifier."""
    profile = get_disease_profile_by_id(disease_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Disease profile '{disease_id}' not found in knowledge base."
        )
    return profile
