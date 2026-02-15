# Landing Page - Thaís Paganini

Landing page em **React + TypeScript com Vite e TailwindCSS**.

## Resumo de detecção automática
> **Stack detectada:** React + TypeScript + Vite SPA (roteamento client-side por `src/lib/router.ts`).  
> **Layout global:** `src/App.tsx` controla `<header />`, conteúdo por rota e `<Footer />` compartilhado.  
> **Tema/CSS:** tokens e utilitários em `src/index.css` (Tailwind + variáveis CSS) e componentes base em `src/ui/Primitives.tsx`.  
> **Exemplo real de construção de página:** rota `/reset-nutricional` renderiza `ResetNutricionalPage` dentro do mesmo shell global em `App.tsx`, padrão replicado para as duas rotas de Ads.

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

## Rotas SPA e prevenção de 404 em produção

Esta aplicação é uma SPA Vite e usa roteamento no cliente. Sem fallback de rewrite no host, qualquer acesso direto em rotas internas retorna 404.

Rotas suportadas por `pathname`:
- `/`
- `/calculadora-gordura`
- `/reset-nutricional`
- `/link-bio`
- `/ebooks`
- `/controle-metabolico-barra`
- `/consulta-online-controle-peso`

Compatibilidade legada via query string (`?page=`) continua ativa para links antigos.

### Vercel
- O projeto inclui `vercel.json` com rewrite global para `/index.html`.
- Isso garante que acesso direto/refresh em qualquer rota SPA não gere 404.

### Render (Static Site)
Se o deploy for como **Static Site** no Render, configure no painel:
1. **Build Command**: `npm ci && npm run build`
2. **Publish Directory**: `dist`
3. Em **Redirects/Rewrites**, adicione regra de fallback SPA:
   - Source: `/*`
   - Destination: `/index.html`
   - Action/Type: `Rewrite`

Sem essa regra, ao abrir diretamente uma rota interna (ex.: `/ebooks`) o host retorna 404.

Essas rotas usam `noindex, nofollow`, canonical próprio e formulário conectado ao endpoint existente de leads.

## Variáveis de ambiente
No frontend (`.env`):
- `VITE_BACKEND_BASE_URL` (ou `VITE_LEADS_API_URL`) — base do backend de leads.

Configuração de WhatsApp:
- `VITE_WHATSAPP_NUMBER` ou `NEXT_PUBLIC_WHATSAPP_NUMBER` (opcional, sobrescreve o padrão em `src/config/whatsapp.ts`).

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

## Checklist final
- [x] Rotas `/controle-metabolico-barra` e `/consulta-online-controle-peso` acessam sem 404 (dev/prod com rewrite SPA).
- [x] Home e rotas existentes permanecem intactas.
- [x] POST de lead usa endpoint existente `/api/leads/ads-performance` (backend Google Sheets).
- [x] Parâmetros UTM são capturados e enviados no payload.
- [x] Conversões são disparadas antes do redirecionamento para WhatsApp.
