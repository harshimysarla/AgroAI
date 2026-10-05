"""
Plant Health Assistant Endpoint.
"""

from fastapi import APIRouter
from backend.app.schemas.prediction import AssistantRequest, AssistantResponse
from backend.app.services.assistant_service import answer_assistant_query

router = APIRouter()


@router.post("/assistant/query", response_model=AssistantResponse)
async def query_plant_assistant(payload: AssistantRequest):
    """Processes user questions about tomato leaf pathology, model architectures, and crop management."""
    result = answer_assistant_query(payload.query)
    return AssistantResponse(**result)
