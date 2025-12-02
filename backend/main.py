import logging
import os
from datetime import datetime, timezone
from functools import lru_cache
from typing import Optional

import gspread
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def _current_timestamp() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat()


class LeadPayload(BaseModel):
    nome: str = Field(..., min_length=1)
    telefone: str = Field(..., min_length=1)
    sexo: str = Field(..., min_length=1)
    resultado: str = Field(..., min_length=1)


class GoogleSheetsService:
    def __init__(self, credentials_path: str, spreadsheet_id: str, worksheet_title: Optional[str] = None):
        self.credentials_path = credentials_path
        self.spreadsheet_id = spreadsheet_id
        self.worksheet_title = worksheet_title
        self._client = None
        self._worksheet = None

    def _get_client(self):
        if not self._client:
            if not os.path.exists(self.credentials_path):
                raise FileNotFoundError(
                    f"Google credentials file not found at {self.credentials_path}. "
                    "Ensure the Render Secret File is mounted."
                )
            logger.info("Loading Google credentials from %s", self.credentials_path)
            self._client = gspread.service_account(filename=self.credentials_path)
        return self._client

    def _get_worksheet(self):
        if self._worksheet:
            return self._worksheet

        client = self._get_client()
        try:
            spreadsheet = client.open_by_key(self.spreadsheet_id)
        except Exception as exc:  # noqa: BLE001
            raise RuntimeError("Unable to open Google Sheet. Check GOOGLE_SHEET_ID.") from exc

        if self.worksheet_title:
            try:
                worksheet = spreadsheet.worksheet(self.worksheet_title)
            except Exception as exc:  # noqa: BLE001
                raise RuntimeError(
                    f"Worksheet '{self.worksheet_title}' not found in spreadsheet {self.spreadsheet_id}."
                ) from exc
        else:
            worksheet = spreadsheet.sheet1

        self._worksheet = worksheet
        return worksheet

    def append_lead(self, lead: LeadPayload):
        worksheet = self._get_worksheet()
        row = [lead.nome, lead.telefone, lead.sexo, lead.resultado, _current_timestamp()]
        try:
            worksheet.append_row(row, value_input_option="USER_ENTERED")
        except Exception as exc:  # noqa: BLE001
            raise RuntimeError("Failed to append lead to Google Sheets") from exc


@lru_cache
def get_sheets_service() -> GoogleSheetsService:
    sheet_id = os.getenv("GOOGLE_SHEET_ID")
    if not sheet_id:
        raise RuntimeError("Environment variable GOOGLE_SHEET_ID is required.")

    credentials_path = os.getenv("GOOGLE_CREDENTIALS_PATH", "/etc/secrets/google-credentials.json")
    worksheet_title = os.getenv("GOOGLE_SHEET_WORKSHEET")

    return GoogleSheetsService(credentials_path, sheet_id, worksheet_title)


app = FastAPI(title="Landing Page Leads Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/leads/gordura-marinha")
def create_lead(payload: LeadPayload):
    try:
        service = get_sheets_service()
        service.append_lead(payload)
    except Exception as exc:  # noqa: BLE001
        logger.exception("Error saving lead")
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {"ok": True}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
