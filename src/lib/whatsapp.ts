import { DEFAULT_WHATSAPP_MESSAGE, buildWhatsappUrl } from "../config/whatsapp";
import { RouteKey } from "./router";

const normalizeLabel = (label: string): string =>
  label
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const ROUTE_SPECIFIC_MESSAGES: Partial<Record<RouteKey, Record<string, string>>> = {
  "link-bio": {
    "agendar consulta": "Olá nutri, vim pelo link da bio e gostaria de agendar uma consulta.",
  },
  "reset-nutricional": {
    "agendar consulta": "Olá nutri, tenho interesse no Reset Nutricional e quero agendar uma consulta.",
    "tirar duvidas rapidas":
      "Olá nutri, gostaria de tirar dúvidas rápidas sobre o Reset Nutricional.",
  },
};

const CTA_MESSAGES: Record<string, string> = {
  "quero saber mais": "Olá nutri, quero saber mais sobre os seus serviços.",
  "ja decidi! quero agendar!": "Olá nutri, já decidi pelo plano e quero agendar uma consulta.",
  "quero emagrecer de forma leve":
    "Olá nutri, quero emagrecer de forma leve e gostaria de mais informações.",
  "reservar consultoria": "Olá nutri, quero reservar uma consultoria online.",
  "escolher protocolo": "Olá nutri, gostaria de ajuda para escolher o melhor protocolo para mim.",
  "conhecer o protocolo": "Olá nutri, gostaria de conhecer melhor o protocolo oferecido.",
  "quero viver isso": "Olá nutri, me identifiquei com a proposta e quero viver essa experiência.",
  "chamar equipe agora": "Olá, gostaria de falar com a equipe agora.",
  "chamar thais agora": "Olá, gostaria de falar com a equipe agora.",
  "ver disponibilidade": "Olá nutri, gostaria de verificar disponibilidade para atendimento.",
  "agendar consulta": "Olá nutri, já decidi pelo plano e quero agendar uma consulta.",
};

export const hasWhatsappMessageForCta = (label: string, route?: RouteKey): boolean => {
  const normalizedLabel = normalizeLabel(label);

  if (route && ROUTE_SPECIFIC_MESSAGES[route]?.[normalizedLabel]) {
    return true;
  }

  return Boolean(CTA_MESSAGES[normalizedLabel]);
};

export const getWhatsappMessageForCta = (label: string, route?: RouteKey): string => {
  const normalizedLabel = normalizeLabel(label);

  if (route && ROUTE_SPECIFIC_MESSAGES[route]?.[normalizedLabel]) {
    return ROUTE_SPECIFIC_MESSAGES[route][normalizedLabel];
  }

  if (CTA_MESSAGES[normalizedLabel]) {
    return CTA_MESSAGES[normalizedLabel];
  }

  return `Olá nutri, cliquei no botão \"${label}\" e quero mais detalhes.`;
};

export const getWhatsappHrefForCta = (label: string, route?: RouteKey): string =>
  buildWhatsappUrl(getWhatsappMessageForCta(label, route));

export const openWhatsappForCta = (label: string, route?: RouteKey): void => {
  const href = getWhatsappHrefForCta(label, route);
  window.open(href, "_blank", "noopener,noreferrer");
};
