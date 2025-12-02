# Landing Page Leads Backend

Serviço FastAPI minimalista para receber leads da calculadora de gordura e registrá-los em uma planilha Google Sheets.

## Como funciona
- `POST /api/leads/gordura-marinha`: recebe `nome`, `telefone`, `sexo` e `resultado` e salva na planilha.
- `GET /health`: rota de verificação de disponibilidade.
- Os leads são anexados com a data/hora do servidor em formato ISO 8601.

## Variáveis de ambiente
- `GOOGLE_SHEET_ID` (obrigatório): ID da planilha Google Sheets que receberá os leads.
- `GOOGLE_CREDENTIALS_PATH` (opcional): caminho do arquivo de credenciais do Google Service Account. Padrão `/etc/secrets/google-credentials.json`.
- `GOOGLE_SHEET_WORKSHEET` (opcional): nome da aba a ser usada. Se não informado, utiliza a primeira aba (`sheet1`).

No Render, configure o Secret File `google-credentials.json` em `/etc/secrets/google-credentials.json` e defina `GOOGLE_SHEET_ID` no painel de variáveis de ambiente.

## Execução local

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Com o serviço no ar, envie um teste:

```bash
curl -X POST http://localhost:8000/api/leads/gordura-marinha \
  -H "Content-Type: application/json" \
  -d '{"nome": "Fulano", "telefone": "11999999999", "sexo": "M", "resultado": "18%"}'
```
