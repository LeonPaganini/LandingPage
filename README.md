# Landing Page - Thaís Paganini

Landing page em **React + TypeScript com Vite e TailwindCSS**.

## Stack detectada e estratégia
- SPA em React renderizada no cliente (Vite).
- Rotas resolvidas por utilitário interno (`src/lib/router.ts`) com suporte a `pathname` e `?page=`.
- Tema e estilos globais em `src/index.css` + componentes base em `src/ui/Primitives.tsx`.
- Novas landing pages Ads implementadas no mesmo padrão visual para evitar refatoração e sem quebrar a home existente.

## Scripts
- `npm install` — instala dependências.
- `npm run dev` — ambiente de desenvolvimento.
- `npm run build` — build otimizado.
- `npm run preview` — pré-visualização do build.
- `npm test` — testes de TypeScript + suíte Node.

## Novas rotas Ads
- `/controle-metabolico-barra`
- `/consulta-online-controle-peso`

Essas rotas usam `noindex, nofollow`, canonical próprio e formulário conectado ao endpoint existente de leads.

## Variáveis de ambiente
No frontend (`.env`):
- `VITE_BACKEND_BASE_URL` (ou `VITE_LEADS_API_URL`) — base do backend de leads.

Já existente no código:
- `WHATSAPP_NUMBER` definido em `src/config/whatsapp.ts`.

No backend (`backend`):
- `GOOGLE_SHEET_ID`
- `GOOGLE_CREDENTIALS_PATH`
- `GOOGLE_SHEET_WORKSHEET` (opcional)

## Como validar conversão
1. Abrir uma rota Ads com UTMs, ex:
   - `/controle-metabolico-barra?utm_source=google&utm_campaign=teste`
2. Preencher e enviar formulário.
3. Confirmar POST `201` para `/api/leads/ads-performance`.
4. Verificar disparo de evento:
   - `conversion_presencial` na rota presencial.
   - `conversion_online` na rota online.
5. Confirmar redirecionamento automático para WhatsApp após sucesso.
