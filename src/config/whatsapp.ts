export const WHATSAPP_NUMBER = "5521990189004";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Olá, Nutri Thais! Acabei de abrir seu link da bio e quero saber mais sobre os atendimentos.";

export const buildWhatsappUrl = (message: string = DEFAULT_WHATSAPP_MESSAGE): string => {
  const phone = WHATSAPP_NUMBER.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message.trim());

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
};
