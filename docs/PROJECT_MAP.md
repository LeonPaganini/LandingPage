# Mapa operacional do projeto

Atualizado em: 2026-07-07

## Objetivo

Este documento registra a estrutura atual da landing page, os arquivos principais, funcoes recorrentes, historico de decisoes e padroes aprendidos. Ele serve como ponto de partida para novas sessoes de manutencao.

## Stack

- Frontend: React 18, Vite, TypeScript e Tailwind CSS.
- Roteamento: query string `?page=` com aliases normalizados em `src/lib/queryRouter.ts`.
- Conteudo: arquivos TypeScript em `src/data/`.
- Conversao: CTAs para WhatsApp via `src/lib/whatsapp.ts`.
- Backend auxiliar: `server.js` em Node e `backend/app/main.py` em FastAPI.

## Historico

| Data | Evento | Arquivos |
| --- | --- | --- |
| 2026-07-07 | Criado sistema de documentacao operacional com historico, mapa de arquivos, funcoes recorrentes, padroes aprendidos e inventario da pagina principal. | `src/data/projectKnowledge.ts`, `src/ui/sections/ProjectDocumentation.tsx`, `docs/PROJECT_MAP.md` |
| 2026-07-07 | Mapeada arquitetura atual da landing: React/Vite, conteudo centralizado, roteamento por query string e CTAs de WhatsApp. | `src/App.tsx`, `src/ui/HomePage.tsx`, `src/data/content.ts`, `src/data/landingCopy.ts` |

## Mapa de arquivos

| Caminho | Area | Responsabilidade |
| --- | --- | --- |
| `src/App.tsx` | Aplicacao | Controla rota atual, SEO, canonical, header, footer e renderizacao das paginas. |
| `src/ui/HomePage.tsx` | Pagina principal | Compoe hero, diagnostico, sobre, programas, historia, beneficios, localizacao, FAQ, documentacao e CTA final. |
| `src/data/content.ts` | Conteudo | Fonte de texto, imagens, programas, FAQ, beneficios e rodape da landing padrao. |
| `src/data/landingCopy.ts` | Conteudo | Adapta mensagens por variante: default, presencial e online. |
| `src/lib/queryRouter.ts` | Roteamento | Normaliza aliases de paginas, gera hrefs preservando UTMs e navega via history API. |
| `src/lib/whatsapp.ts` | Conversao | Mapeia labels de CTA para mensagens de WhatsApp por rota. |
| `src/Calculator.tsx` | Ferramenta | Calculadora de percentual de gordura com captura de lead e arte para Instagram. |
| `src/ui/sections/LocationModule.tsx` | Secao | Mostra modulo de localizacao para a variante presencial. |
| `backend/app/main.py` | Backend Python | API FastAPI para servicos auxiliares do projeto. |
| `server.js` | Backend Node | Servidor Node/Express para integracoes e execucao fora do Vite. |

## Funcoes recorrentes

| Funcao | Arquivo | Uso |
| --- | --- | --- |
| `getLandingCopy` | `src/data/landingCopy.ts` | Retorna a copy correta para a variante da landing. |
| `navigateTo` | `src/lib/queryRouter.ts` | Altera a query `page`, dispara `popstate` e rola para o topo. |
| `getHref` | `src/lib/queryRouter.ts` | Cria links internos preservando parametros de campanha. |
| `getWhatsappHrefForCta` | `src/lib/whatsapp.ts` | Gera URL do WhatsApp com mensagem coerente com label e rota. |
| `calculateBodyFat` | `src/Calculator.tsx` | Calcula percentual de gordura pelo metodo da Marinha Americana. |

## Sessoes da pagina principal

| Secao | Origem | Papel |
| --- | --- | --- |
| Hero | `HeroSection` em `src/ui/HomePage.tsx` | Apresenta promessa principal, badges e CTAs. |
| Diagnostico interativo | `DiagnosticSection` em `src/ui/HomePage.tsx` | Permite marcar sintomas e aumenta intencao de agendamento. |
| Quem sou eu | `AboutSection` em `src/ui/HomePage.tsx` | Construcao de autoridade e contexto profissional. |
| Metodos e programas | `MethodsSection` em `src/ui/HomePage.tsx` | Lista ofertas e direciona para WhatsApp, calculadora ou reset. |
| Transformacao | `StorySection` em `src/ui/HomePage.tsx` | Explica a narrativa do metodo e reforca mudanca de comportamento. |
| Beneficios praticos | `BenefitsSection` em `src/ui/HomePage.tsx` | Resume ganhos objetivos para leitura rapida. |
| Localizacao | `LocationModule` | Aparece apenas na variante presencial. |
| FAQ | `FAQSection` em `src/ui/HomePage.tsx` | Remove objecoes antes do CTA final. |
| CTA final | `FinalCTASection` em `src/ui/HomePage.tsx` | Fecha a pagina com chamada direta para contato. |

## Padroes aprendidos

1. Conteudo comercial deve ficar em `src/data/` quando puder variar por campanha.
2. Novas paginas publicas devem ser adicionadas em `RouteKey`, `ROUTES` e `ALIAS_MAP`.
3. Labels de CTA precisam estar sincronizados com `CTA_MESSAGES`, pois a mensagem do WhatsApp depende do texto normalizado.
4. Paginas de campanha devem ter decisao explicita de SEO antes de serem indexadas.
5. Ao criar novas secoes na home, atualizar `mainPageSections` em `src/data/projectKnowledge.ts`.

## Como manter este sistema

1. Registre cada mudanca relevante em `projectHistory`.
2. Adicione novos arquivos importantes em `projectFileMap`.
3. Inclua funcoes compartilhadas em `recurringFunctions`.
4. Transforme aprendizados recorrentes em regras dentro de `learnedPatterns`.
5. Atualize este documento quando a estrutura publica ou o fluxo de manutencao mudar.
