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


class AdsPerformanceLeadPayload(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    nome: str = Field(..., min_length=1)
    email: str = Field(..., min_length=5)
    whatsapp: str = Field(..., min_length=10)
    idade: int = Field(..., ge=18, le=70)
    objetivo_principal: str = Field(..., min_length=3)
    disposicao_investimento: str = Field(..., min_length=3)
    origem_rota: str = Field(..., min_length=3)
    utm_source: str = Field(default="")
    utm_campaign: str = Field(default="")
    utm_term: str = Field(default="")
    utm_medium: str = Field(default="")
    utm_content: str = Field(default="")
    timestamp: str = Field(default="")


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


@router.post("/ads-performance")
def create_ads_performance_lead(payload: AdsPerformanceLeadPayload):
    try:
        service = get_sheets_service()
        service.append_ads_lead(
            nome=payload.nome,
            email=payload.email,
            whatsapp=payload.whatsapp,
            idade=payload.idade,
            objetivo_principal=payload.objetivo_principal,
            disposicao_investimento=payload.disposicao_investimento,
            origem_rota=payload.origem_rota,
            utm_source=payload.utm_source,
            utm_campaign=payload.utm_campaign,
            utm_term=payload.utm_term,
            utm_medium=payload.utm_medium,
            utm_content=payload.utm_content,
            timestamp=payload.timestamp,
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("Error saving ads performance lead")
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {"ok": True}
