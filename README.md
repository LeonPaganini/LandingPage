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

### URLs oficiais (canonical)
- Home: `https://thaispaganini.com.br/`
- Calculadora: `https://thaispaganini.com.br/?page=calculadora-gordura`
- Reset Nutricional: `https://thaispaganini.com.br/?page=reset-nutricional`
- Link Bio: `https://thaispaganini.com.br/?page=link-bio`
- Ebooks: `https://thaispaganini.com.br/?page=ebooks`
- Ads presencial: `https://thaispaganini.com.br/?page=controle-metabolico-barra`
- Ads online: `https://thaispaganini.com.br/?page=consulta-online-controle-peso`

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

## Render Static Site (SPA rewrite)
Para evitar 404 em acesso direto/refresh, configure no Render:
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Redirects/Rewrites:**
  - Source: `/*`
  - Destination: `/index.html`
  - Type: `Rewrite`

Referência: documentação de Redirects/Rewrites do Render.
