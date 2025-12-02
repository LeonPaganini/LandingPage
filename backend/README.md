# Landing Page Leads Backend

Serviço FastAPI minimalista para receber leads e registrá-los em uma planilha Google Sheets.

## Estrutura

```
backend/
  app/
    main.py
    routers/
    services/
    utils/
  requirements.txt
  README.md
```

O serviço é exposto como módulo `app.main:app`, usando `backend` como diretório raiz.

## Configuração de ambiente

Variáveis de ambiente esperadas:

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
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Teste de saúde:

```bash
curl http://localhost:8000/health
```

Envio de lead:

```bash
curl -X POST http://localhost:8000/api/leads/gordura-marinha \
  -H "Content-Type: application/json" \
  -d '{"nome": "Fulano", "telefone": "11999999999", "sexo": "M", "resultado": "18%"}'
```

## Deploy no Render

- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
