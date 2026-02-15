import React from "react";
import { Badge, CTAButton, GlassCard, SectionWave } from "./ui/Primitives";
import {
  ADS_ROUTE_META,
  AdsLeadFormValues,
  AdsRouteKey,
  buildWhatsAppRedirectUrl,
  captureUtmParams,
  normalizeAdsLeadPayload,
  submitAdsLead,
  triggerConversionEvent,
  validateAdsLeadValues,
} from "./lib/adsLanding";

type LandingCopy = {
  title: string;
  description: string;
  canonicalPath: string;
  h1: string;
  subheadline: string;
  cta: string;
  heroImage: string;
  heroAlt: string;
  sectionOneTitle: string;
  sectionOneItems: string[];
  sectionTwoTitle: string;
  sectionTwoItems: string[];
  scarcity?: string;
};

const ADS_COPIES: Record<AdsRouteKey, LandingCopy> = {
  "controle-metabolico-barra": {
    title: "Nutricionista na Barra da Tijuca | Controle metabólico feminino",
    description:
      "Atendimento clínico individual no Shopping Downtown para mulheres com dificuldade de emagrecimento e sintomas metabólicos persistentes.",
    canonicalPath: "/?page=controle-metabolico-barra",
    h1: "Nutricionista na Barra da Tijuca para controle de peso e saúde metabólica feminina",
    subheadline:
      "Atendimento clínico individual no Shopping Downtown para mulheres com dificuldade de emagrecimento e sintomas metabólicos persistentes.",
    cta: "Solicitar avaliação presencial",
    heroImage: "/mockups/hero-clinica-premium.svg",
    heroAlt: "Mockup de consultório clínico premium",
    sectionOneTitle: "Sintomas que merecem avaliação clínica",
    sectionOneItems: [
      "Ganho de peso resistente",
      "Dificuldade de emagrecer mesmo treinando",
      "Compulsão alimentar e fome emocional",
      "Intestino desregulado e inchaço",
      "Cansaço frequente e queda de energia",
      "Exames alterados (quando aplicável)",
    ],
    sectionTwoTitle: "Método de atendimento presencial",
    sectionTwoItems: [
      "Pré-consulta estruturada (anamnese + histórico)",
      "Consulta clínica aprofundada",
      "Estratégia personalizada para rotina real",
      "Material complementar (ebooks/orientações)",
      "Pós-consulta com direcionamento",
    ],
    scarcity: "Apenas 4 vagas presenciais por semana.",
  },
  "consulta-online-controle-peso": {
    title: "Consulta nutricional online | Controle de peso e metabolismo",
    description:
      "Atendimento individual com retorno estruturado em 45 dias para ajuste de estratégia.",
    canonicalPath: "/?page=consulta-online-controle-peso",
    h1: "Consulta nutricional online para controle de peso e organização metabólica",
    subheadline: "Atendimento individual com retorno estruturado em 45 dias para ajuste de estratégia.",
    cta: "Solicitar consulta online",
    heroImage: "/mockups/hero-consulta-online.svg",
    heroAlt: "Mockup de consulta nutricional por videochamada",
    sectionOneTitle: "Benefícios do acompanhamento online",
    sectionOneItems: [
      "Plano individualizado",
      "Estratégia para compulsão e estresse",
      "Organização metabólica e rotina",
      "Retorno em 45 dias (reavaliação + nova estratégia)",
      "Parcelamento em até 2x",
    ],
    sectionTwoTitle: "Como funciona o processo",
    sectionTwoItems: [
      "Triagem inicial com contexto clínico e rotina",
      "Plano alimentar com estratégia aplicável no dia a dia",
      "Ajustes direcionados conforme evolução",
      "Material complementar para reforçar adesão",
      "Acompanhamento com retorno estruturado",
    ],
  },
};

const useAdsHead = (copy: LandingCopy) => {
  React.useEffect(() => {
    const previousTitle = document.title;
    const previousRobots = document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
    const previousDescription =
      document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";

    document.title = copy.title;

    const ensureMeta = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", attr);
        document.head.appendChild(element);
      }
      element.setAttribute("content", value);
    };

    ensureMeta('meta[name="robots"]', "robots", "noindex, nofollow");
    ensureMeta('meta[name="description"]', "description", copy.description);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    const canonicalHref = new URL(copy.canonicalPath, window.location.origin).toString();
    const previousCanonical = canonical.getAttribute("href") ?? "";
    canonical.setAttribute("href", canonicalHref);

    return () => {
      document.title = previousTitle;
      ensureMeta('meta[name="robots"]', "robots", previousRobots);
      ensureMeta('meta[name="description"]', "description", previousDescription);
      canonical?.setAttribute("href", previousCanonical);
    };
  }, [copy]);
};

const defaultValues: AdsLeadFormValues = {
  nome: "",
  email: "",
  whatsapp: "",
  idade: "",
  objetivo_principal: "",
  disposicao_investimento: "",
};

const AdsLandingPage: React.FC<{ routeKey: AdsRouteKey }> = ({ routeKey }) => {
  const copy = ADS_COPIES[routeKey];
  const [values, setValues] = React.useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  useAdsHead(copy);

  const handleChange = (field: keyof AdsLeadFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const submitLead = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const validationError = validateAdsLeadValues(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = normalizeAdsLeadPayload(routeKey, values, captureUtmParams());

    setLoading(true);
    const sent = await submitAdsLead(payload);

    if (!sent) {
      setLoading(false);
      setError("Não foi possível enviar agora. Tente novamente em instantes.");
      return;
    }

    triggerConversionEvent(ADS_ROUTE_META[routeKey].conversionEvent, {
      route: ADS_ROUTE_META[routeKey].pathname,
      origem: payload.origem_rota,
      utm_campaign: payload.utm_campaign,
    });

    setSuccessMessage("Enviando você para o WhatsApp...");

    window.setTimeout(() => {
      window.location.href = buildWhatsAppRedirectUrl(routeKey, payload.objetivo_principal, payload.nome);
    }, 1000);
  };

  return (
    <>
      <section className="relative isolate overflow-hidden bg-bgBase px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
          <GlassCard className="border-white/60 p-7 md:p-10">
            <Badge>Atendimento clínico individual</Badge>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-neutral-900 md:text-4xl">{copy.h1}</h1>
            <p className="mt-4 text-base text-neutral-700 md:text-lg">{copy.subheadline}</p>
            {copy.scarcity && (
              <p className="mt-4 rounded-xl bg-peach-500/40 px-4 py-3 text-sm font-semibold text-neutral-900">
                {copy.scarcity}
              </p>
            )}
            <a href="#form-ads" className="mt-7 inline-flex">
              <CTAButton label={copy.cta} />
            </a>
          </GlassCard>
          <div className="rounded-3xl border border-white/60 bg-white/70 p-4 shadow-xl">
            <img src={copy.heroImage} alt={copy.heroAlt} className="h-auto w-full rounded-2xl" loading="lazy" />
          </div>
        </div>
      </section>

      <SectionWave className="bg-gradient-to-br from-surface-100 via-blush-300/30 to-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-neutral-900">{copy.sectionOneTitle}</h2>
            <ul className="mt-4 space-y-3">
              {copy.sectionOneItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-neutral-700">
                  <span className="icon-circle h-8 w-8 text-sm">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-neutral-900">{copy.sectionTwoTitle}</h2>
            <ul className="mt-4 space-y-3">
              {copy.sectionTwoItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-neutral-700">
                  <span className="icon-circle h-8 w-8 text-sm">★</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </SectionWave>

      <SectionWave className="bg-gradient-to-b from-peach-500/30 to-surface-100" id="form-ads">
        <div className="mx-auto max-w-3xl px-6">
          <GlassCard className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-neutral-900">{copy.cta}</h2>
            <p className="mt-2 text-sm text-neutral-700">Preencha os dados para receber as próximas orientações.</p>
            <form className="mt-6 grid gap-4" onSubmit={submitLead}>
              <input className="rounded-xl border border-neutral-200 px-4 py-3" placeholder="Nome" value={values.nome} onChange={handleChange("nome")} />
              <input className="rounded-xl border border-neutral-200 px-4 py-3" placeholder="E-mail" type="email" value={values.email} onChange={handleChange("email")} />
              <input className="rounded-xl border border-neutral-200 px-4 py-3" placeholder="WhatsApp com DDD" value={values.whatsapp} onChange={handleChange("whatsapp")} />
              <input className="rounded-xl border border-neutral-200 px-4 py-3" placeholder="Idade" type="number" min={18} max={70} value={values.idade} onChange={handleChange("idade")} />
              <textarea className="min-h-24 rounded-xl border border-neutral-200 px-4 py-3" placeholder="Objetivo principal" value={values.objetivo_principal} onChange={handleChange("objetivo_principal")} />
              <select className="rounded-xl border border-neutral-200 px-4 py-3" value={values.disposicao_investimento} onChange={handleChange("disposicao_investimento")}>
                <option value="">Disposição de investimento</option>
                <option value="imediata">Pronta para iniciar imediatamente</option>
                <option value="ate-30-dias">Pretendo iniciar em até 30 dias</option>
                <option value="avaliando">Ainda estou avaliando</option>
              </select>

              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
              {successMessage && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</p>}

              <CTAButton label={loading ? "Enviando..." : copy.cta} type="submit" disabled={loading} />
            </form>
          </GlassCard>
        </div>
      </SectionWave>
    </>
  );
};

export default AdsLandingPage;
