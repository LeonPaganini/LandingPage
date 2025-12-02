export type LeadCalculadoraPayload = {
  nome: string;
  telefone: string;
  sexo: "feminino" | "masculino";
  resultado: number;
};

const LEAD_ORIGEM = "calculadora_gordura_marinha";
const ENDPOINT = "/api/leads/calculadora-gordura";

const construirPayload = (payload: LeadCalculadoraPayload) => ({
  ...payload,
  origem: LEAD_ORIGEM,
});

export const salvarLeadCalculadora = async (payload: LeadCalculadoraPayload) => {
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(construirPayload(payload)),
    });

    if (!response.ok) {
      const message = await response.text().catch(() => "");
      throw new Error(`Falha ao salvar lead (${response.status}): ${message}`);
    }
  } catch (error) {
    // Fluxo não deve bloquear a calculadora; apenas registramos o erro localmente.
    console.error("Não foi possível salvar o lead da calculadora", error);
  }
};
