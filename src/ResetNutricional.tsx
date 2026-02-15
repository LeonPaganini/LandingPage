import React from "react";
import { enviarLeadReset } from "./leadService.js";
import { CTAButton, GlassCard, SectionTitle, SectionWave } from "./ui/Primitives.js";
import { openWhatsappForCta } from "./lib/whatsapp.js";

const benefitCards = [
  "Desincha em 7–14 dias com protocolos simples",
  "Melhora do intestino, sono e energia",
  "Menos ansiedade e fome emocional",
  "Receitas rápidas (até 15 minutos)",
  "Acompanhamento leve e sem julgamento",
  "Rotina prática e possível para sua realidade",
];

const bonusItems = [
  "Sorteio de conjunto fitness",
  "E-books exclusivos de receitas",
  "Protocolos de chás e suplementação de apoio",
];

const highlights = [
  "Acesso ao grupo exclusivo",
  "Materiais digitais e trilha guiada",
  "Protocolos seguros e supervisionados",
];

const normalizePhoneNumber = (value: string) => value.replace(/\D/g, "").slice(0, 11);

const formatPhoneNumber = (digits: string) => {
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

const validateLead = (data: { nome: string; telefone: string }, touched: Set<keyof typeof data>) => {
  const errors: Partial<Record<keyof typeof data, string>> = {};
  const trimmedName = data.nome.trim();

  if (touched.has("nome")) {
    if (!trimmedName || trimmedName.length < 3) {
      errors.nome = "Informe seu nome completo (mínimo 3 caracteres).";
    }
  }

  if (touched.has("telefone")) {
    const digits = normalizePhoneNumber(data.telefone);
    if (digits.length < 10 || digits.length > 11) {
      errors.telefone = "Use um celular válido com DDD.";
    }
  }

  return errors;
};

const ResetNutricionalPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const formRef = React.useRef<HTMLDivElement>(null);
  const [formData, setFormData] = React.useState({ nome: "", telefone: "" });
  const [touched, setTouched] = React.useState<Set<keyof typeof formData>>(new Set());
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const errors = React.useMemo(() => validateLead(formData, touched), [formData, touched]);

  const updateField = (field: keyof typeof formData, value: string) => {
    if (field === "telefone") {
      const normalized = normalizePhoneNumber(value);
      setFormData((prev) => ({ ...prev, telefone: normalized }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const markTouched = (field: keyof typeof formData) => {
    setTouched((prev) => new Set(prev).add(field));
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const allTouched = new Set<keyof typeof formData>(["nome", "telefone"]);
    setTouched(allTouched);

    const currentErrors = validateLead(formData, allTouched);
    if (Object.keys(currentErrors).length > 0) {
      setErrorMessage("Confira os campos destacados e tente novamente.");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    const ok = await enviarLeadReset({
      nome: formData.nome.trim(),
      telefone: formData.telefone,
    });

    if (ok) {
      setStatus("success");
      setFormData({ nome: "", telefone: "" });
      setTouched(new Set());
    } else {
      setStatus("error");
      setErrorMessage("Não foi possível enviar agora. Tente novamente em instantes.");
    }
  };

  return (
    <div className="bg-surface-100 text-neutral-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700/75 via-peach-500/70 to-surface-200/80 text-white">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col justify-center px-6 py-16">
          <GlassCard className="max-w-3xl border-white/60 px-8 py-10 text-left text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              Programa sazonal | Grupo em 21 dias
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
              Reset Nutricional – Grupo de Emagrecimento 21 Dias
            </h1>
            <p className="mt-3 text-lg text-white/90 md:text-xl">
              Um protocolo guiado para desinchar, regular intestino, diminuir ansiedade e retomar o controle do corpo em apenas
              21 dias.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-white/90">
              <span className="badge-pill bg-white/20 text-white">Grupo guiado</span>
              <span className="badge-pill bg-white/20 text-white">Sem julgamento</span>
              <span className="badge-pill bg-white/20 text-white">Resultados em 3 semanas</span>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <CTAButton label="Quero participar do Reset" onClick={scrollToForm} />
              <button
                type="button"
                onClick={onNavigateHome}
                className="rounded-full border border-white/70 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Voltar para página inicial
              </button>
            </div>
          </GlassCard>
        </div>
      </section>

      <SectionWave className="bg-gradient-to-b from-surface-100 via-blush-300/30 to-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <GlassCard className="p-6 md:p-8">
              <SectionTitle label="Como funciona" />
              <p className="card-text mt-2 text-base">
                Você entra em um grupo com metas semanais, recebe materiais digitais, receitas rápidas e protocolos simples para
                reduzir inchaço, ajustar intestino e controlar a ansiedade alimentar. Tudo guiado, humano e possível.
              </p>
              <ul className="mt-4 space-y-2 text-sm font-semibold text-neutral-900">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-primary-700">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <CTAButton label="Quero reservar minha vaga" onClick={scrollToForm} />
              </div>
            </GlassCard>
            <GlassCard className="overflow-hidden p-0">
              <div
                className="h-full min-h-[320px]"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </GlassCard>
          </div>
        </div>
      </SectionWave>

      <SectionWave className="bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle label="Benefícios do Reset" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {benefitCards.map((item) => (
              <GlassCard key={item} className="p-5">
                <p className="card-title text-base">{item}</p>
                <p className="card-text mt-2 text-sm text-neutral-700">
                  Resultado rápido, guiado e possível para quem precisa retomar o ritmo e voltar a se sentir bem.
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </SectionWave>

      <SectionWave className="bg-gradient-to-r from-peach-500/30 via-surface-100 to-peach-500/30">
        <div className="mx-auto max-w-5xl px-6">
          <GlassCard className="p-6 md:p-10 text-center">
            <SectionTitle label="Premiações & Bônus" />
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {bonusItems.map((item) => (
                <div key={item} className="glass-card p-4 text-sm font-semibold text-neutral-900">
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-4 text-base text-neutral-700">
              Participando do grupo você concorre a prêmios e ainda recebe materiais extras para manter o resultado depois dos 21
              dias.
            </p>
          </GlassCard>
        </div>
      </SectionWave>

      <div id="form-reset">
        <SectionWave className="bg-white">
          <div className="mx-auto max-w-4xl px-6" ref={formRef}>
            <GlassCard className="p-6 md:p-8">
            <SectionTitle label="Garanta sua vaga" />
            <p className="card-text mt-2 text-base">
              Preencha seus dados e eu te chamo para confirmar sua participação no próximo grupo.
            </p>
            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 rounded-2xl bg-white/70 p-4 shadow">
                <span className="text-sm font-semibold text-neutral-900">Nome</span>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(event) => updateField("nome", event.target.value)}
                  onBlur={() => markTouched("nome")}
                  placeholder="Ex.: Ana Silva"
                  className="w-full rounded-xl border border-white/40 bg-white/80 px-4 py-3 text-base font-semibold text-neutral-900 shadow-inner outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40"
                  autoComplete="name"
                />
                {errors.nome && <p className="text-xs font-semibold text-error">{errors.nome}</p>}
              </label>

              <label className="flex flex-col gap-2 rounded-2xl bg-white/70 p-4 shadow">
                <span className="text-sm font-semibold text-neutral-900">Telefone</span>
                <input
                  type="tel"
                  inputMode="tel"
                  value={formatPhoneNumber(formData.telefone)}
                  onChange={(event) => updateField("telefone", event.target.value)}
                  onBlur={() => markTouched("telefone")}
                  placeholder="(11) 98765-4321"
                  className="w-full rounded-xl border border-white/40 bg-white/80 px-4 py-3 text-base font-semibold text-neutral-900 shadow-inner outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40"
                  autoComplete="tel"
                />
                {errors.telefone && <p className="text-xs font-semibold text-error">{errors.telefone}</p>}
              </label>

              {errorMessage && <p className="text-sm font-semibold text-error">{errorMessage}</p>}
              {status === "success" && (
                <p className="text-sm font-semibold text-success">Lead enviado com sucesso! Aguarde meu contato.</p>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <CTAButton
                  label={status === "loading" ? "Enviando..." : "Quero entrar no próximo grupo"}
                  type="submit"
                />
                <button
                  type="button"
                  onClick={() => openWhatsappForCta("Tirar dúvidas rápidas", "reset_nutricional")}
                  className="rounded-full border border-neutral-900/10 px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:bg-peach-500/40"
                >
                  Tirar dúvidas rápidas
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
        </SectionWave>
      </div>
    </div>
  );
};

export default ResetNutricionalPage;
