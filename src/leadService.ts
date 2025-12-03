export type LeadResetPayload = {
  nome: string;
  telefone: string;
};

const DEFAULT_BASE_URL = "https://landing-leads.onrender.com";

const sanitizePhone = (phone: string) => phone.replace(/\D/g, "");

const resolveBaseUrl = () => {
  const envBase =
    (import.meta.env.NEXT_PUBLIC_LEADS_API_URL as string | undefined) ??
    (import.meta.env.VITE_LEADS_API_URL as string | undefined);

  const baseUrl = envBase && envBase.trim() ? envBase : DEFAULT_BASE_URL;
  return baseUrl.replace(/\/$/, "");
};

const isValidResetPayload = (payload: LeadResetPayload) => {
  const nomeValido = payload.nome.trim().length >= 3;
  const telefoneLimpo = sanitizePhone(payload.telefone);
  const telefoneValido = telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;

  return nomeValido && telefoneValido;
};

export const enviarLeadReset = async (payload: LeadResetPayload) => {
  if (!isValidResetPayload(payload)) return false;

  const telefone = sanitizePhone(payload.telefone);
  const baseUrl = resolveBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/api/leads/reset-nutricional`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: payload.nome.trim(),
        telefone,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Erro ao enviar lead do Reset Nutricional", error);
    return false;
  }
};
