export type ProjectHistoryEntry = {
  date: string;
  title: string;
  summary: string;
  files: string[];
};

export type ProjectFileMapEntry = {
  path: string;
  area: string;
  purpose: string;
  owners: string[];
};

export type RecurringFunctionEntry = {
  name: string;
  path: string;
  responsibility: string;
  usedBy: string[];
};

export type LearnedPatternEntry = {
  pattern: string;
  where: string;
  rule: string;
  nextAction: string;
};

export type MainPageSectionEntry = {
  id: string;
  title: string;
  source: string;
  role: string;
  contentSource: string;
};

export const projectHistory: ProjectHistoryEntry[] = [
  {
    date: "2026-07-07",
    title: "Sistema de documentacao operacional",
    summary:
      "Criado mapa interno do projeto com historico, localizacao de arquivos, funcoes recorrentes, padroes aprendidos e documentacao das secoes da pagina principal.",
    files: [
      "src/data/projectKnowledge.ts",
      "src/ui/sections/ProjectDocumentation.tsx",
      "docs/PROJECT_MAP.md",
    ],
  },
  {
    date: "2026-07-07",
    title: "Arquitetura da landing atual",
    summary:
      "A pagina principal usa React/Vite, conteudo centralizado em data modules, roteamento por query string e CTAs conectados ao WhatsApp.",
    files: ["src/App.tsx", "src/ui/HomePage.tsx", "src/data/content.ts", "src/data/landingCopy.ts"],
  },
];

export const projectFileMap: ProjectFileMapEntry[] = [
  {
    path: "src/App.tsx",
    area: "Aplicacao",
    purpose: "Controla rota atual, SEO, canonical, header, footer e renderizacao das paginas.",
    owners: ["Rotas", "SEO", "Layout global"],
  },
  {
    path: "src/ui/HomePage.tsx",
    area: "Pagina principal",
    purpose: "Compoe hero, diagnostico, sobre, programas, historia, beneficios, localizacao, FAQ, documentacao e CTA final.",
    owners: ["Landing", "Secoes", "Conversao"],
  },
  {
    path: "src/data/content.ts",
    area: "Conteudo",
    purpose: "Fonte de texto, imagens, programas, FAQ, beneficios e rodape da landing padrao.",
    owners: ["Copy", "Conteudo comercial"],
  },
  {
    path: "src/data/landingCopy.ts",
    area: "Conteudo",
    purpose: "Adapta mensagens por variante: default, presencial e online.",
    owners: ["Variantes", "Anuncios", "CTA"],
  },
  {
    path: "src/lib/queryRouter.ts",
    area: "Roteamento",
    purpose: "Normaliza aliases de paginas, gera hrefs preservando UTMs e navega via history API.",
    owners: ["URL", "UTM", "Aliases"],
  },
  {
    path: "src/lib/whatsapp.ts",
    area: "Conversao",
    purpose: "Mapeia labels de CTA para mensagens de WhatsApp por rota.",
    owners: ["CTA", "WhatsApp"],
  },
  {
    path: "src/Calculator.tsx",
    area: "Ferramenta",
    purpose: "Calculadora de percentual de gordura com captura de lead e arte para Instagram.",
    owners: ["Lead", "Calculadora", "Canvas"],
  },
  {
    path: "src/ui/sections/LocationModule.tsx",
    area: "Secao",
    purpose: "Mostra modulo de localizacao para a variante presencial.",
    owners: ["Presencial", "Localizacao"],
  },
  {
    path: "backend/app/main.py",
    area: "Backend Python",
    purpose: "API FastAPI para servicos auxiliares do projeto.",
    owners: ["API", "Backend"],
  },
  {
    path: "server.js",
    area: "Backend Node",
    purpose: "Servidor Node/Express para integracoes e execucao fora do Vite.",
    owners: ["Integracoes", "Deploy"],
  },
];

export const recurringFunctions: RecurringFunctionEntry[] = [
  {
    name: "getLandingCopy",
    path: "src/data/landingCopy.ts",
    responsibility: "Retorna a copy correta para a variante da landing.",
    usedBy: ["Header", "HomePage", "AdsLandingPage"],
  },
  {
    name: "navigateTo",
    path: "src/lib/queryRouter.ts",
    responsibility: "Altera a query page, dispara popstate e rola para o topo.",
    usedBy: ["App", "LinkBio", "CTAs internos"],
  },
  {
    name: "getHref",
    path: "src/lib/queryRouter.ts",
    responsibility: "Cria links internos preservando parametros de campanha.",
    usedBy: ["HomePage", "App", "Botoes de programas"],
  },
  {
    name: "getWhatsappHrefForCta",
    path: "src/lib/whatsapp.ts",
    responsibility: "Gera URL do WhatsApp com mensagem coerente com label e rota.",
    usedBy: ["Header", "Hero", "Programas", "CTA final"],
  },
  {
    name: "calculateBodyFat",
    path: "src/Calculator.tsx",
    responsibility: "Calcula percentual de gordura pelo metodo da Marinha Americana.",
    usedBy: ["BodyFatCalculator", "tests/calculateBodyFat.test.ts"],
  },
];

export const learnedPatterns: LearnedPatternEntry[] = [
  {
    pattern: "Conteudo comercial fica em arquivos de dados",
    where: "src/data/content.ts e src/data/landingCopy.ts",
    rule: "Evitar texto hardcoded em componentes quando a copy pode variar por rota ou campanha.",
    nextAction: "Ao criar nova secao comercial, primeiro modelar os dados e depois consumir no componente.",
  },
  {
    pattern: "Rotas publicas usam query string page",
    where: "src/lib/queryRouter.ts",
    rule: "Novas paginas devem ser adicionadas em RouteKey, ROUTES e ALIAS_MAP.",
    nextAction: "Incluir teste de alias quando criar uma pagina publica nova.",
  },
  {
    pattern: "CTAs dependem do label normalizado",
    where: "src/lib/whatsapp.ts",
    rule: "Mudancas de texto de botao podem alterar a mensagem enviada ao WhatsApp.",
    nextAction: "Atualizar CTA_MESSAGES sempre que um label de CTA mudar.",
  },
  {
    pattern: "Variantes de anuncios nao devem indexar",
    where: "src/App.tsx",
    rule: "Paginas de campanha recebem canonical e robots noindex quando necessario.",
    nextAction: "Avaliar SEO antes de tornar uma variante publica indexavel.",
  },
];

export const mainPageSections: MainPageSectionEntry[] = [
  {
    id: "hero",
    title: "Hero",
    source: "HeroSection em src/ui/HomePage.tsx",
    role: "Apresenta promessa principal, badges e CTAs.",
    contentSource: "src/data/landingCopy.ts e src/data/content.ts",
  },
  {
    id: "diagnostico",
    title: "Diagnostico interativo",
    source: "DiagnosticSection em src/ui/HomePage.tsx",
    role: "Permite marcar sintomas e aumenta intencao de agendamento.",
    contentSource: "copy.diagnostic",
  },
  {
    id: "sobre",
    title: "Quem sou eu",
    source: "AboutSection em src/ui/HomePage.tsx",
    role: "Construcao de autoridade e contexto profissional.",
    contentSource: "about em src/data/content.ts",
  },
  {
    id: "metodos",
    title: "Metodos e programas",
    source: "MethodsSection em src/ui/HomePage.tsx",
    role: "Lista ofertas e direciona para WhatsApp, calculadora ou reset.",
    contentSource: "programs em src/data/content.ts",
  },
  {
    id: "transformacao",
    title: "Transformacao",
    source: "StorySection em src/ui/HomePage.tsx",
    role: "Explica a narrativa do metodo e reforca mudanca de comportamento.",
    contentSource: "story em src/data/content.ts",
  },
  {
    id: "beneficios",
    title: "Beneficios praticos",
    source: "BenefitsSection em src/ui/HomePage.tsx",
    role: "Resume ganhos objetivos para leitura rapida.",
    contentSource: "benefits em src/data/content.ts",
  },
  {
    id: "faq",
    title: "Perguntas frequentes",
    source: "FAQSection em src/ui/HomePage.tsx",
    role: "Remove objeções antes do CTA final.",
    contentSource: "faq em src/data/content.ts",
  },
  {
    id: "cta-final",
    title: "CTA final",
    source: "FinalCTASection em src/ui/HomePage.tsx",
    role: "Fecha a pagina com chamada direta para contato.",
    contentSource: "copy.finalCta em src/data/landingCopy.ts",
  },
];
