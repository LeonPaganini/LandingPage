# Landing Page - Thaís Paganini

Landing page em **React + TypeScript (Vite) + TailwindCSS**.

## Scripts
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm test`

## Roteamento (padrão oficial)
Este projeto usa **query routing** como padrão público/canonical, via `src/lib/router.ts`:
- parâmetro oficial: `page`
- canonical de páginas internas: `/?page=<slug>`
- home canonical: `/`
- O roteamento público é via `?page=` e o valor é normalizado (remove `/` nas bordas e lixo colado após `?`/`#`).

### URLs oficiais (canonical)
- Home: `https://thaispaganini.com.br/`
- Calculadora: `https://thaispaganini.com.br/?page=calculadora-gordura`
- Reset Nutricional: `https://thaispaganini.com.br/?page=reset-nutricional`
- Link Bio: `https://thaispaganini.com.br/?page=link-bio`
- Ebooks: `https://thaispaganini.com.br/?page=ebooks`
- Ads presencial: `https://thaispaganini.com.br/?page=controle-metabolico-barra`
- Ads online: `https://thaispaganini.com.br/?page=consulta-online-controle-peso`

### Rotas Ads
- `/?page=controle-metabolico-barra`
- `/?page=consulta-online-controle-peso`

## Compatibilidade legada
O router continua aceitando formatos antigos para não quebrar links já publicados:
- `?page=link_bio`
- `?page=calculadora_gordura`
- path routing (`/link-bio`, `/controle-metabolico-barra`, etc.)

Quando alguém acessa por path, a aplicação resolve a rota e **normaliza automaticamente para a URL canonical por query** (com `history.replaceState`) sem cair na home.

## Como adicionar uma nova rota
1. Adicionar a chave em `RouteKey` (`src/lib/router.ts`).
2. Adicionar aliases de leitura em `pageParamRoutes` (incluindo legados se necessário).
3. Adicionar suporte opcional de compatibilidade em `pathRoutes`.
4. Definir o slug canonical em `canonicalPageByRoute`.
5. Renderizar a página em `src/App.tsx` com `activePage === "<routeKey>"`.

## Render Static Site (sem rewrite global)
Para este projeto (query routing via `/?page=`), **não configure** rewrite global `/* -> /index.html`.

Configuração recomendada no Render Static Site:
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Redirects/Rewrites:** nenhum rewrite global para `/index.html`

Motivo: rewrite global pode capturar `/assets/*` no domínio customizado e devolver HTML no lugar de CSS/JS.

## Diagnóstico de domínio customizado (assets)
1. Gere build local:
   - `npm run build`
2. Rode o diagnóstico:
   - `npm run diagnose:domain`

O script `scripts/diagnose-domain.mjs`:
- lê o asset CSS real de `dist/index.html`;
- testa `onrender.com`, `www.thaispaganini.com.br` e `thaispaganini.com.br`;
- imprime status, `location`, `content-type` e preview de body quando não vier CSS;
- retorna erro (`exit 1`) se houver redirect (301/302/307/308) ou `content-type` diferente de `text/css`.


## Conteúdo dinâmico das páginas de Ads via Google Sheets
As páginas abaixo continuam roteadas **somente por query string**:
- `/?page=consulta-online-controle-peso`
- `/?page=controle-metabolico-barra`

O frontend busca conteúdo no endpoint interno:
- `GET /api/page-data?page=<slug>`

### Backend (`/api/page-data`)
Implementado em `server.js`, com:
- whitelist estrita de slug permitido;
- timeout de 8s na leitura do Google Sheets;
- cache em memória por 60s por slug;
- fallback de leitura:
  1. aba `pages` (`pages!A:I`), com colunas: `slug,title,subtitle,hero_text,bullets,cta_text,cta_link,faq_json,updated_at`;
  2. aba por slug (`<slug>!A:B`) em formato chave-valor.

Erros do Sheets retornam `502` com JSON `{ error, detail }` e slug inválido retorna `400`.

### Variáveis de ambiente obrigatórias (backend)
- `GOOGLE_SERVICE_ACCOUNT_JSON`: JSON completo da service account em string;
- `GOOGLE_SHEETS_ID`: ID da planilha com os dados de conteúdo.

### Setup Google Service Account
1. Crie uma Service Account no Google Cloud e habilite a Google Sheets API.
2. Gere a chave JSON da Service Account.
3. Configure `GOOGLE_SERVICE_ACCOUNT_JSON` com o JSON completo (incluindo `private_key`).
4. Compartilhe a planilha com o e-mail da Service Account com acesso de leitura.
5. Configure `GOOGLE_SHEETS_ID` com o ID da planilha.

### Exemplo de resposta `GET /api/page-data?page=consulta-online-controle-peso`
```json
{
  "slug": "consulta-online-controle-peso",
  "title": "Consulta nutricional online para controle de peso",
  "subtitle": "Atendimento individual com retorno em 45 dias.",
  "hero_text": "Plano personalizado com acompanhamento.",
  "bullets": [
    "Plano individualizado",
    "Retorno estruturado em 45 dias"
  ],
  "cta_text": "Solicitar consulta online",
  "cta_link": "https://wa.me/5511999999999",
  "faq": [
    {
      "question": "Como funciona o retorno?",
      "answer": "Você recebe reavaliação e ajustes em até 45 dias."
    }
  ],
  "updated_at": "2026-01-20T10:30:00.000Z"
}
```
