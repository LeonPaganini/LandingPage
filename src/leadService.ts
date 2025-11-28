export type LeadMeasurementPayload = {
  altura_cm: number;
  pescoco_cm: number;
  cintura_cm?: number;
  quadril_cm?: number;
  abdomen_cm?: number;
};

export type LeadCalculadoraPayload = {
  nome: string;
  celular: string;
  genero: "feminino" | "masculino";
  resultado_gordura: number;
  dados_medidas: LeadMeasurementPayload;
};

const LEAD_ORIGEM = "calculadora_gordura_marinha";

export const salvarLeadCalculadora = async (payload: LeadCalculadoraPayload) => {
  const enrichedPayload = {
    ...payload,
    origem: LEAD_ORIGEM,
    data_hora: new Date().toISOString(),
  };

  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enrichedPayload),
    });

    if (!response.ok) {
      throw new Error(`Falha ao salvar lead: ${response.status}`);
    }
  } catch (error) {
    // Ponto de extensão: futura integração com Google Sheets pode ser adicionada aqui.
    console.error("Não foi possível salvar o lead da calculadora", error);
  }
};
