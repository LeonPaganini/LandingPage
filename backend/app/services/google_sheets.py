import logging
import os
from datetime import datetime
from functools import lru_cache
from typing import Optional

from zoneinfo import ZoneInfo
import gspread

logger = logging.getLogger(__name__)

SHEET_HEADERS = ["Nome", "Telefone", "Sexo", "Resultado", "DataHora", "Origem"]
SAO_PAULO_TZ = ZoneInfo("America/Sao_Paulo")


def _current_timestamp() -> str:
    return datetime.now(SAO_PAULO_TZ).strftime("%d/%m/%Y %H:%M")


class GoogleSheetsService:
    def __init__(self, credentials_path: str, spreadsheet_id: str, worksheet_title: Optional[str] = None):
        self.credentials_path = credentials_path
        self.spreadsheet_id = spreadsheet_id
        self.worksheet_title = worksheet_title
        self._client = None
        self._worksheet = None
        self._header_checked = False

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

    def _ensure_headers(self, worksheet):
        if self._header_checked:
            return

        try:
            existing_headers = worksheet.row_values(1)
        except Exception as exc:  # noqa: BLE001
            raise RuntimeError("Failed to read worksheet headers") from exc

        normalized = existing_headers[: len(SHEET_HEADERS)]
        if normalized != SHEET_HEADERS or len(existing_headers) != len(SHEET_HEADERS):
            try:
                worksheet.update("A1:F1", [SHEET_HEADERS])
            except Exception as exc:  # noqa: BLE001
                raise RuntimeError("Failed to set worksheet headers") from exc

        self._header_checked = True

    def append_lead(self, nome: str, telefone: str, sexo: str = "", resultado: str | float = "", origem: str = ""):
        worksheet = self._get_worksheet()
        self._ensure_headers(worksheet)

        resultado_value = "" if resultado in ("", None) else resultado
        row = [nome, telefone, sexo, resultado_value, _current_timestamp(), origem]
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
