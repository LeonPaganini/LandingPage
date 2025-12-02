import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.google_sheets import get_sheets_service

router = APIRouter(prefix="/api/leads", tags=["Leads"])

logger = logging.getLogger(__name__)


class LeadPayload(BaseModel):
    nome: str = Field(..., min_length=1)
    telefone: str = Field(..., min_length=1)
    sexo: str = Field(..., min_length=1)
    resultado: str = Field(..., min_length=1)


@router.post("/gordura-marinha")
def create_lead(payload: LeadPayload):
    try:
        service = get_sheets_service()
        service.append_lead(payload)
    except Exception as exc:  # noqa: BLE001
        logger.exception("Error saving lead")
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {"ok": True}
