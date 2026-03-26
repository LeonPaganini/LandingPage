# Análise de dimensões — imagens da seção “Depoimentos”

## O que o código atual renderiza

Com base em `TransformationTestimonials.tsx`, cada imagem usa:
- `w-full`
- `h-56` (224 px) no tamanho base
- `sm:h-64` (256 px) a partir de 640 px
- `object-cover`

O container da seção está em `max-w-6xl px-6` e o grid vira 3 colunas em `md` (`md:grid-cols-3`) com `gap-5`.

## Tamanho visual aproximado por breakpoint (sem alterar código)

- **Mobile (~360 px viewport)**
  - largura útil do container: ~312 px
  - largura da imagem (1 coluna): ~312 px
  - altura da imagem: 224 px
  - frame resultante: **~312x224** (ratio ~1.39:1)

- **Mobile maior (~390 px viewport)**
  - largura útil do container: ~342 px
  - altura da imagem: 224 px
  - frame: **~342x224** (ratio ~1.53:1)

- **Tablet / md (768 px viewport)**
  - largura útil do container: ~720 px
  - 3 colunas + gaps
  - largura da imagem por card: ~227 px
  - altura da imagem: 256 px
  - frame: **~227x256** (ratio ~0.89:1, retrato)

- **Desktop grande (>= 1200 px)**
  - container limitado por `max-w-6xl`
  - largura útil máxima: ~1104 px
  - largura por card: ~355 px
  - altura da imagem: 256 px
  - frame: **~355x256** (ratio ~1.39:1)

## Recomendação prática de dimensões

Como o frame muda de retrato (tablet) para paisagem (mobile/desktop), a imagem precisa de "folga" para crop pelo `object-cover`.

### Recomendação principal (sem mudar layout)
- **Subir imagens em 4:3 com 1200x900 px** (ou 960x720 px como mínimo aceitável).
- Faixa segura de rosto/assunto principal no centro (60% central).

### Versões responsivas sugeridas
- 480x360 (mobile)
- 768x576 (tablet)
- 1200x900 (desktop/retina)

Preferir WebP/AVIF e manter cada arquivo idealmente entre ~100 KB e ~220 KB.

## Observação de UX visual

No breakpoint `md`, o card fica mais estreito que a altura (retrato), então imagens muito "horizontais" tendem a cortar mais as laterais. Fotos com enquadramento central e margens laterais de segurança funcionam melhor.
