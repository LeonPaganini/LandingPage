import React from "react";

export type RouteKey =
  | "home"
  | "calculadora_gordura"
  | "reset_nutricional"
  | "link_bio"
  | "ebooks"
  | "controle_metabolico_barra"
  | "consulta_online_controle_peso";

export const defaultPage: RouteKey = "home";

export type SeoConfig = {
  description?: string;
};

export type RouteRenderContext = {
  renderHome: () => React.ReactNode;
  renderCalculadoraGordura: () => React.ReactNode;
  renderResetNutricional: () => React.ReactNode;
  renderLinkBio: () => React.ReactNode;
  renderEbooks: () => React.ReactNode;
  renderControleMetabolicoBarra: () => React.ReactNode;
  renderConsultaOnlineControlePeso: () => React.ReactNode;
};

export const ROUTES: Record<
  RouteKey,
  {
    title: string;
    render: (context: RouteRenderContext) => React.ReactNode;
    seo?: SeoConfig;
    isPublic?: boolean;
  }
> = {
  home: {
    title: "Thais Paganini | Nutrição Acolhedora",
    seo: {
      description:
        "Nutrição feminina com Thais Paganini: acabe com inchaço, TPM e ansiedade com reset nutricional, consultoria e protocolos leves para mulheres reais.",
    },
    isPublic: true,
    render: (context) => context.renderHome(),
  },
  calculadora_gordura: {
    title: "Calculadora de Gordura Corporal | Thais Paganini",
    isPublic: true,
    render: (context) => context.renderCalculadoraGordura(),
  },
  reset_nutricional: {
    title: "Reset Nutricional | Thais Paganini",
    isPublic: true,
    render: (context) => context.renderResetNutricional(),
  },
  link_bio: {
    title: "Link da Bio | Thais Paganini",
    isPublic: true,
    render: (context) => context.renderLinkBio(),
  },
  ebooks: {
    title: "E-books | Thais Paganini",
    isPublic: true,
    render: (context) => context.renderEbooks(),
  },
  controle_metabolico_barra: {
    title: "Nutricionista na Barra da Tijuca para Controle de Peso | Atendimento Presencial",
    seo: {
      description:
        "Atendimento clínico individual no Shopping Downtown para controle de peso feminino, compulsão alimentar e organização metabólica.",
    },
    isPublic: true,
    render: (context) => context.renderControleMetabolicoBarra(),
  },
  consulta_online_controle_peso: {
    title: "Consulta Nutricional Online para Controle de Peso | Retorno em 45 dias",
    seo: {
      description:
        "Consulta nutricional online individual para mulheres com dificuldade de emagrecimento, compulsão alimentar e baixa energia, com retorno em 45 dias.",
    },
    isPublic: true,
    render: (context) => context.renderConsultaOnlineControlePeso(),
  },
};
