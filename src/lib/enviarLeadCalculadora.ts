export type LeadCalculadoraPayload = {
  nome: string;
  telefone: string;
  sexo: "feminino" | "masculino";
  resultado: number;
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

export const enviarLeadCalculadora = async (payload: LeadCalculadoraPayload) => {
  const telefone = sanitizePhone(payload.telefone);
  const baseUrl = resolveBaseUrl();

  try {
    await fetch(`${baseUrl}/api/leads/gordura-marinha`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: payload.nome.trim(),
        telefone,
        sexo: payload.sexo,
        resultado: payload.resultado,
      }),
    });
  } catch (error) {
    console.error("Erro ao enviar lead da calculadora", error);
  }
};
