import { about, diagnostic, hero } from "./content";

export type LandingVariant = "default" | "presencial" | "online";

type LandingCopy = {
  headerCtaLabel: string;
  hero: {
    title: string;
    subtitle: string;
    badges: string[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
  diagnostic: {
    title: string;
    symptoms: string[];
    tagline: string;
  };
  about: {
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
  };
  finalCta: {
    title: string;
    subtitle: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
};

const defaultCopy: LandingCopy = {
  headerCtaLabel: "Agendar consulta",
  hero: {
    title: hero.title,
    subtitle: hero.subtitle,
    badges: hero.badges,
    ctaPrimary: hero.ctaPrimary,
    ctaSecondary: hero.ctaSecondary,
  },
  diagnostic: {
    title: diagnostic.title,
    symptoms: diagnostic.symptoms,
    tagline: diagnostic.tagline,
  },
  about: {
    primaryCtaLabel: "Quero emagrecer de forma leve",
    secondaryCtaLabel: "Quero saber mais",
  },
  finalCta: {
    title: "Pronta para leveza?",
    subtitle: "Agende agora e receba seu plano guiado.",
    primaryLabel: "Chamar Thaís agora",
    secondaryLabel: "Ver disponibilidade",
  },
};

export const landingCopy: Record<LandingVariant, LandingCopy> = {
  default: defaultCopy,
  presencial: {
    ...defaultCopy,
    headerCtaLabel: "Solicitar avaliação presencial",
    hero: {
      ...defaultCopy.hero,
      title: "Controle de peso e saúde metabólica feminina — atendimento presencial na Barra da Tijuca",
      subtitle:
        "Consulta clínica individual no Shopping Downtown para mulheres com dificuldade de emagrecimento e sintomas metabólicos persistentes.",
      badges: [
        "Ganho de peso resistente",
        "Compulsão e fome emocional",
        "Intestino desregulado e inchaço",
        "Cansaço frequente e baixa energia",
      ],
      ctaPrimary: "Solicitar avaliação presencial",
      ctaSecondary: "Falar com a equipe",
    },
    diagnostic: {
      ...defaultCopy.diagnostic,
      title: "Principais sinais que avaliamos no atendimento presencial",
      symptoms: [
        "Ganho de peso resistente",
        "Compulsão e fome emocional",
        "Intestino desregulado e inchaço",
        "Cansaço frequente e baixa energia",
      ],
      tagline: "Atendimento clínico individual no Shopping Downtown — Barra da Tijuca.",
    },
    about: {
      primaryCtaLabel: "Solicitar avaliação presencial",
      secondaryCtaLabel: "Tirar dúvidas do atendimento",
    },
    finalCta: {
      title: "Pronta para iniciar seu cuidado presencial?",
      subtitle: "Solicite sua avaliação clínica individual na Barra da Tijuca.",
      primaryLabel: "Solicitar avaliação presencial",
      secondaryLabel: "Ver disponibilidade",
    },
  },
  online: {
    ...defaultCopy,
    headerCtaLabel: "Solicitar consulta online",
    hero: {
      ...defaultCopy.hero,
      title: "Consulta nutricional online para controle de peso e organização metabólica",
      subtitle:
        "Atendimento individual com retorno estruturado em 45 dias para ajuste de estratégia.",
      badges: [
        "Estratégia para compulsão e estresse",
        "Organização metabólica e rotina",
        "Plano individualizado",
        "Retorno em 45 dias (reavaliação + nova estratégia)",
      ],
      ctaPrimary: "Solicitar consulta online",
      ctaSecondary: "Falar com a equipe",
    },
    diagnostic: {
      ...defaultCopy.diagnostic,
      title: "Pontos centrais da consulta online",
      symptoms: [
        "Estratégia para compulsão e estresse",
        "Organização metabólica e rotina",
        "Plano individualizado",
        "Retorno em 45 dias (reavaliação + nova estratégia)",
      ],
      tagline: "Consulta individual com reavaliação em 45 dias para nova estratégia.",
    },
    about: {
      primaryCtaLabel: "Solicitar consulta online",
      secondaryCtaLabel: "Tirar dúvidas da consulta",
    },
    finalCta: {
      title: "Pronta para organizar seu processo online?",
      subtitle: "Solicite sua consulta online com retorno estruturado em 45 dias.",
      primaryLabel: "Solicitar consulta online",
      secondaryLabel: "Ver disponibilidade",
    },
  },
};

export const getLandingCopy = (variant: LandingVariant): LandingCopy => landingCopy[variant];
