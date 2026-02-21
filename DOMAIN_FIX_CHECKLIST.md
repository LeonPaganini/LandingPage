# Domain fix checklist (Render + custom domain)

Use this checklist when assets under `/assets/*` are returning HTML (`text/html`) instead of static files.

## Mandatory verification

- Open: `https://SEU_DOMINIO/assets/index-XXXX.css`
- Expected:
  - HTTP `200`
  - `Content-Type: text/css`
- If this URL returns HTML, there is an active rewrite/proxy/forwarding intercepting asset routes.

## Required fixes in domain/proxy stack

1. Remove URL forwarding/masking/iframe forwarding in your DNS/hosting provider.
2. Remove rewrite rules like `/* -> /index.html` from domain proxies/CDN layers.
3. Keep DNS aligned with Render configuration:
   - typically `www` CNAME to `thaispaganini.onrender.com` (or the current Render target from your dashboard).
4. If using Cloudflare:
   - disable Transform Rules / Page Rules / Workers that rewrite `/assets/*`.
   - disable any “Always Use HTML fallback” behavior for static assets.
5. Purge/clear CDN cache after deploy and after DNS/proxy changes.

## Extra sanity checks

- Open: `https://SEU_DOMINIO/asset-health.txt`
  - expected plain text response: `asset-health-ok`
- Open home: `https://SEU_DOMINIO/`
- Open query pages:
  - `https://SEU_DOMINIO/?page=consulta-online-controle-peso`
  - `https://SEU_DOMINIO/?page=controle-metabolico-barra`

If query pages work but `/assets/*` still return HTML, the issue is in domain/proxy rewrites, not in Vite build output.
