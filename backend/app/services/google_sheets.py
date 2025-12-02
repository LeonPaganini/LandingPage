import logging
import os
from functools import lru_cache
from typing import Optional

import gspread

logger = logging.getLogger(__name__)


def _current_timestamp() -> str:
    from datetime import datetime, timezone

    return datetime.now(timezone.utc).astimezone().isoformat()


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

    def append_lead(self, lead):
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
