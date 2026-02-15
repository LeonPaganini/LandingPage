export type LinkBioActionType = "internal" | "external" | "whatsapp";

export type LinkBioItem = {
  label: string;
  description?: string;
  icon?: string;
  action_type: LinkBioActionType;
  route_or_url: string;
  priority: number;
  highlight?: boolean;
  whatsappMessage?: string;
  badge?: string;
  ctaLabel?: string;
};

export type LinkBioSection = {
  title: string;
  badge?: string;
  items: LinkBioItem[];
};

export const LINK_BIO_PROFILE = {
  name: "Nutri Thais Paganini",
  subtitle: "",
};

export const LINK_BIO_HERO = {
  photo:
    "https://i.ibb.co/CprMFS9t/Signos-do-zod-aco-m-stico-neon-azul-fundo-de-tela-para-celular-1.png",
  headline: "Viva leve, com orientação e acolhimento",
  subheadline: "Escolha o melhor caminho para falar com minha equipe ou acessar os programas.",
  ctaLabel: "Falar com equipe agora",
};

export const APP_NUTRI_CONFIG = {
  label: "AppNutri - EM BREVE",
  description: "Plano alimentar inteligente com relatórios e insights personalizados.",
  url: "", // TODO: Ajustar para a URL oficial do AppNutri
  ctaLabel: "Acessar AppNutri",
  badge: "Digital",
};

export const LINK_BIO_SECTIONS: LinkBioSection[] = [
  {
    title: "Serviços para Você",
    items: [
      {
        label: "Atendimento Online com a Nutri",
        description: "Fale comigo para definir o acompanhamento ideal",
        icon: "💬",
        action_type: "whatsapp",
        route_or_url: "",
        priority: 1,
        highlight: true,
        whatsappMessage:
          "Olá! Quero agendar um atendimento online com a nutri. Pode me passar horários e valores?",
        ctaLabel: "Falar comigo",
      },
      {
        label: "Atendimento Presencial - Barra da Tijuca-RJ",
        description: "Agende sua consulta presencial na Barra da Tijuca-RJ",
        icon: "📍",
        action_type: "whatsapp",
        route_or_url: "",
        priority: 2,
        highlight: true,
        whatsappMessage:
          "Olá! Tenho interesse em atendimento presencial na Barra da Tijuca-RJ. Pode me passar horários, local e valores?",
        ctaLabel: "Agendar presencial",
      },
      {
        label: APP_NUTRI_CONFIG.label,
        description: APP_NUTRI_CONFIG.description,
        icon: "📱",
        action_type: "external",
        route_or_url: APP_NUTRI_CONFIG.url,
        priority: 3,
        highlight: true,
        badge: APP_NUTRI_CONFIG.badge,
        ctaLabel: APP_NUTRI_CONFIG.ctaLabel,
      },
      {
        label: "Calculadora de % de Gordura",
        description: "Calcule seu percentual de gordura corporal",
        icon: "📊",
        action_type: "internal",
        route_or_url: "https://thaispaganini.com.br/?page=calculadora-gordura",
        priority: 4,
        highlight: true,
        ctaLabel: "Usar calculadora",
      },
      {
        label: "Reset Nutricional",
        description: "Grupo sazonal de 21 dias para desinchar e regular o corpo",
        icon: "✨",
        action_type: "internal",
        route_or_url: "https://thaispaganini.com.br/?page=reset-nutricional",
        priority: 5,
        ctaLabel: "Entrar no programa",
      },
    ],
  },
  {
    title: "Contato Parcerias",
    items: [
      {
        label: "WhatsApp direto",
        description: "Me chame com uma mensagem pronta",
        icon: "💬",
        action_type: "whatsapp",
        route_or_url: "",
        priority: 1,
        whatsappMessage:
          "Olá! Tenho interesse em fechar uma parceria. Podemos conversar sobre formatos e condições?",
      },
      {
        label: "E-mail profissional",
        description: "Envie um e-mail com seu objetivo",
        icon: "✉️",
        action_type: "external",
        route_or_url: "mailto:equipe.nutripaganini@gmail.com", // TODO: Ajustar e-mail oficial se necessário
        priority: 2,
      },
    ],
  },
  {
    title: "Materiais / Ebooks / Conteúdos",
    badge: "Novidade",
    items: [
      {
        label: "Catálogo de Ebooks",
        description: "Receitas, protocolos e guias para cada momento",
        icon: "📚",
        action_type: "internal",
        route_or_url: "",
        priority: 1,
        highlight: true,
        badge: "Em Breve",
      },
    ],
  },
];
