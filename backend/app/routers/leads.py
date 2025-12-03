import logging

from fastapi import APIRouter, HTTPException
from pydantic import AliasChoices, BaseModel, ConfigDict, Field

from app.services.google_sheets import get_sheets_service

router = APIRouter(prefix="/api/leads", tags=["Leads"])

logger = logging.getLogger(__name__)


class LeadPayload(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    nome: str = Field(
        ..., min_length=1, validation_alias=AliasChoices("nome", "name")
    )
    telefone: str = Field(
        ..., min_length=1, validation_alias=AliasChoices("telefone", "phone")
    )
    sexo: str = Field(
        ..., min_length=1, validation_alias=AliasChoices("sexo", "gender")
    )
    resultado: float = Field(
        ..., validation_alias=AliasChoices("resultado", "result")
    )


class ResetLeadPayload(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    nome: str = Field(
        ..., min_length=1, validation_alias=AliasChoices("nome", "name")
    )
    telefone: str = Field(
        ..., min_length=1, validation_alias=AliasChoices("telefone", "phone")
    )


@router.post("/gordura-marinha")
def create_lead(payload: LeadPayload):
    try:
        service = get_sheets_service()
        service.append_lead(
            nome=payload.nome,
            telefone=payload.telefone,
            sexo=payload.sexo,
            resultado=payload.resultado,
            origem="Calculadora",
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("Error saving lead")
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {"ok": True}


@router.post("/reset-nutricional")
def create_reset_lead(payload: ResetLeadPayload):
    try:
        service = get_sheets_service()
        service.append_lead(
            nome=payload.nome,
            telefone=payload.telefone,
            sexo="",
            resultado="",
            origem="Reset",
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("Error saving reset lead")
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {"ok": True}
