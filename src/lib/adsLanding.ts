import { WHATSAPP_NUMBER } from "../config/whatsapp";

export type AdsRouteKey = "controle_metabolico_barra" | "consulta_online_controle_peso";

export type AdsLeadFormValues = {
  nome: string;
  email: string;
  whatsapp: string;
  idade: string;
  objetivo_principal: string;
  disposicao_investimento: string;
};

export type AdsLeadPayload = {
  nome: string;
  email: string;
  whatsapp: string;
  idade: number;
  objetivo_principal: string;
  disposicao_investimento: string;
  origem_rota: "presencial" | "online";
  utm_source: string;
  utm_campaign: string;
  utm_term: string;
  utm_medium: string;
  utm_content: string;
  timestamp: string;
};

export const ADS_ROUTE_META: Record<
  AdsRouteKey,
  {
    origin: "presencial" | "online";
    conversionEvent: "conversion_presencial" | "conversion_online";
    pageKey: AdsRouteKey;
    whatsappTemplate: (goal: string) => string;
  }
> = {
  controle_metabolico_barra: {
    pageKey: "controle_metabolico_barra",
    origin: "presencial",
    conversionEvent: "conversion_presencial",
    whatsappTemplate: (goal) =>
      `Olá, Thais. Acabei de preencher o formulário para avaliação PRESENCIAL na Barra da Tijuca (Shopping Downtown). Meu objetivo principal é: ${goal}. Quero organizar meu controle de peso e saúde metabólica.`,
  },
  consulta_online_controle_peso: {
    pageKey: "consulta_online_controle_peso",
    origin: "online",
    conversionEvent: "conversion_online",
    whatsappTemplate: (goal) =>
      `Olá, Thais. Acabei de preencher o formulário para consulta ONLINE. Meu objetivo principal é: ${goal}. Quero organizar meu controle de peso e metabolismo. Pode me passar os próximos horários?`,
  },
};

const sanitizePhone = (phone: string) => phone.replace(/\D/g, "");

export const captureUtmParams = (search: string = window.location.search) => {
  const params = new URLSearchParams(search);
  return {
    utm_source: params.get("utm_source") ?? "",
    utm_campaign: params.get("utm_campaign") ?? "",
    utm_term: params.get("utm_term") ?? "",
    utm_medium: params.get("utm_medium") ?? "",
    utm_content: params.get("utm_content") ?? "",
  };
};

export const validateAdsLeadValues = (values: AdsLeadFormValues): string | null => {
  if (values.nome.trim().length < 3) return "Informe seu nome completo.";

  const email = values.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Informe um e-mail válido.";

  const phone = sanitizePhone(values.whatsapp);
  if (phone.length < 10 || phone.length > 13) return "Informe um WhatsApp válido com DDD.";

  const idade = Number(values.idade);
  if (!Number.isInteger(idade) || idade < 18 || idade > 70) return "A idade deve estar entre 18 e 70 anos.";

  if (!values.objetivo_principal.trim()) return "Informe seu objetivo principal.";
  if (!values.disposicao_investimento.trim()) return "Selecione sua disposição de investimento.";

  return null;
};

export const normalizeAdsLeadPayload = (
  route: AdsRouteKey,
  values: AdsLeadFormValues,
  utmParams = captureUtmParams(),
): AdsLeadPayload => ({
  nome: values.nome.trim(),
  email: values.email.trim().toLowerCase(),
  whatsapp: sanitizePhone(values.whatsapp),
  idade: Number(values.idade),
  objetivo_principal: values.objetivo_principal.trim(),
  disposicao_investimento: values.disposicao_investimento.trim(),
  origem_rota: ADS_ROUTE_META[route].origin,
  ...utmParams,
  timestamp: new Date().toISOString(),
});

const resolveBackendBaseUrl = () => {
  const base =
    (import.meta.env.VITE_BACKEND_BASE_URL as string | undefined) ??
    (import.meta.env.BACKEND_BASE_URL as string | undefined) ??
    (import.meta.env.VITE_LEADS_API_URL as string | undefined) ??
    (import.meta.env.NEXT_PUBLIC_LEADS_API_URL as string | undefined) ??
    "https://landing-leads.onrender.com";

  return base.replace(/\/$/, "");
};

export const submitAdsLead = async (payload: AdsLeadPayload): Promise<boolean> => {
  try {
    const response = await fetch(`${resolveBackendBaseUrl()}/api/leads/ads-performance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (error) {
    console.error("Erro ao enviar lead das rotas de Ads", error);
    return false;
  }
};

export const triggerConversionEvent = (eventName: string, payload: Record<string, unknown>) => {
  const globalObj = window as typeof window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Array<Record<string, unknown>>;
  };

  if (typeof globalObj.gtag === "function") {
    globalObj.gtag("event", eventName, payload);
    return;
  }

  globalObj.dataLayer = globalObj.dataLayer || [];
  globalObj.dataLayer.push({ event: eventName, ...payload });
};

export const buildWhatsAppRedirectUrl = (route: AdsRouteKey, goal: string, name: string) => {
  const normalizedPhone = WHATSAPP_NUMBER.replace(/\D/g, "");
  const introGoal = goal.trim() || "Não informado";
  const personalizedMessage = `${ADS_ROUTE_META[route].whatsappTemplate(introGoal)}\nNome: ${name.trim() || "Não informado"}`;
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(personalizedMessage)}`;
};
