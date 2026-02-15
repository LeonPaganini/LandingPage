const DEFAULT_WHATSAPP_NUMBER = "5521990189004";

export const WHATSAPP_NUMBER =
  (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.trim() ||
  (import.meta.env.NEXT_PUBLIC_WHATSAPP_NUMBER as string | undefined)?.trim() ||
  DEFAULT_WHATSAPP_NUMBER;

export const DEFAULT_WHATSAPP_MESSAGE =
  "Olá, Nutri Thais! Acabei de abrir seu link da bio e quero saber mais sobre os atendimentos.";

export const buildWhatsappUrl = (message: string = DEFAULT_WHATSAPP_MESSAGE): string => {
  const phone = WHATSAPP_NUMBER.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message.trim());

  return `https://wa.me/${phone}?text=${encodedMessage}`;
};
