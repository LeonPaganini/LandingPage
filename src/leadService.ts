export type LeadCalculadoraPayload = {
  nome: string;
  telefone: string;
  sexo: "feminino" | "masculino";
  resultado: number;
};

export type LeadProgramaPayload = {
  nome: string;
  telefone: string;
  email: string;
  origem: string;
};

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby-XU0LXQTdmtYsODkcVkxPtVfYCceUGsPPUecHdpcWXlnT1kKyWndLTuq4fQy8rIXO/exec";

const sanitizePhone = (phone: string) => phone.replace(/\D/g, "");
const sanitizeEmail = (email: string) => email.trim().toLowerCase();

const isValidPayload = (payload: LeadCalculadoraPayload) => {
  const nomeValido = payload.nome.trim().length >= 3;
  const telefoneLimpo = sanitizePhone(payload.telefone);
  const telefoneValido = telefoneLimpo.length === 11;
  const sexoValido = payload.sexo === "feminino" || payload.sexo === "masculino";
  const resultadoValido = Number.isFinite(payload.resultado);

  return nomeValido && telefoneValido && sexoValido && resultadoValido;
};

const isValidProgramaPayload = (payload: LeadProgramaPayload) => {
  const nomeValido = payload.nome.trim().length >= 3;
  const telefoneLimpo = sanitizePhone(payload.telefone);
  const telefoneValido = telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;
  const emailNormalizado = sanitizeEmail(payload.email);
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado);
  const origemValida = payload.origem.trim().length > 0;

  return nomeValido && telefoneValido && emailValido && origemValida;
};

export const enviarLeadParaPlanilha = async (payload: LeadCalculadoraPayload) => {
  if (!isValidPayload(payload)) return;

  try {
    const telefone = sanitizePhone(payload.telefone);

    await fetch(APPS_SCRIPT_URL, {
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
    // Fluxo não deve bloquear a calculadora; apenas registramos o erro localmente.
    console.error("Erro ao enviar lead para planilha", error);
  }
};

export const enviarLeadPrograma = async (payload: LeadProgramaPayload) => {
  if (!isValidProgramaPayload(payload)) return false;

  try {
    const telefone = sanitizePhone(payload.telefone);
    const email = sanitizeEmail(payload.email);

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: payload.nome.trim(),
        telefone,
        email,
        origem: payload.origem.trim(),
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Erro ao enviar lead do programa", error);
    return false;
  }
};
