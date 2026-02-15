import React from "react";
import { Badge, CTAButton, GlassCard, SectionWave } from "./ui/Primitives";
import {
  ADS_ROUTE_META,
  ADS_ROUTE_SLUG,
  AdsLeadFormValues,
  AdsPageDataPayload,
  AdsRouteKey,
  buildWhatsAppRedirectUrl,
  captureUtmParams,
  fetchAdsPageData,
  normalizeAdsLeadPayload,
  submitAdsLead,
  triggerConversionEvent,
  validateAdsLeadValues,
} from "./lib/adsLanding";

type LandingCopy = {
  title: string;
  description: string;
  h1: string;
  subheadline: string;
  cta: string;
  heroImage: string;
  heroAlt: string;
  sectionOneTitle: string;
  sectionOneItems: string[];
};

const ADS_FALLBACK_COPY: Record<AdsRouteKey, LandingCopy> = {
  controle_metabolico_barra: {
    title: "Nutricionista na Barra da Tijuca | Controle metabólico feminino",
    description:
      "Atendimento clínico individual no Shopping Downtown para mulheres com dificuldade de emagrecimento e sintomas metabólicos persistentes.",
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
  },
  consulta_online_controle_peso: {
    title: "Consulta nutricional online | Controle de peso e metabolismo",
    description: "Atendimento individual com retorno estruturado em 45 dias para ajuste de estratégia.",
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
  },
};

const useAdsHead = (copy: LandingCopy, routeKey: AdsRouteKey) => {
  React.useEffect(() => {
    const previousTitle = document.title;
    const previousRobots = document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
    const previousDescription = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";

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

    const canonicalHref = new URL(`/?page=${ADS_ROUTE_SLUG[routeKey]}`, window.location.origin).toString();
    const previousCanonical = canonical.getAttribute("href") ?? "";
    canonical.setAttribute("href", canonicalHref);

    return () => {
      document.title = previousTitle;
      ensureMeta('meta[name="robots"]', "robots", previousRobots);
      ensureMeta('meta[name="description"]', "description", previousDescription);
      canonical?.setAttribute("href", previousCanonical);
    };
  }, [copy, routeKey]);
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
  const fallbackCopy = ADS_FALLBACK_COPY[routeKey];
  const [values, setValues] = React.useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [pageData, setPageData] = React.useState<AdsPageDataPayload | null>(null);
  const [pageDataError, setPageDataError] = React.useState(false);

  useAdsHead(fallbackCopy, routeKey);

  React.useEffect(() => {
    let mounted = true;

    const loadPageData = async () => {
      setPageDataError(false);
      try {
        const data = await fetchAdsPageData(routeKey);
        if (!mounted) return;
        setPageData(data);
      } catch (fetchError) {
        console.error("Falha ao carregar conteúdo da rota via /api/page-data", fetchError);
        if (!mounted) return;
        setPageData(null);
        setPageDataError(true);
      }
    };

    loadPageData();

    return () => {
      mounted = false;
    };
  }, [routeKey]);

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
      route: ADS_ROUTE_META[routeKey].pageKey,
      origem: payload.origem_rota,
      utm_campaign: payload.utm_campaign,
    });

    setSuccessMessage("Enviando você para o WhatsApp...");

    window.setTimeout(() => {
      window.location.href = buildWhatsAppRedirectUrl(routeKey, payload.objetivo_principal, payload.nome);
    }, 1000);
  };

  const displayTitle = pageData?.title || fallbackCopy.h1;
  const displaySubtitle = pageData?.subtitle || fallbackCopy.subheadline;
  const displayBullets = pageData?.bullets?.length ? pageData.bullets : fallbackCopy.sectionOneItems;
  const displayCta = pageData?.cta_text || fallbackCopy.cta;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-bgBase px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
          <GlassCard className="border-white/60 p-7 md:p-10">
            <Badge>Atendimento clínico individual</Badge>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-neutral-900 md:text-4xl">{displayTitle}</h1>
            <p className="mt-4 text-base text-neutral-700 md:text-lg">{displaySubtitle}</p>
            {pageDataError && (
              <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                Conteúdo temporariamente indisponível
              </p>
            )}
            <a href="#form-ads" className="mt-7 inline-flex">
              <CTAButton label={displayCta} />
            </a>
          </GlassCard>
          <div className="rounded-3xl border border-white/60 bg-white/70 p-4 shadow-xl">
            <img src={fallbackCopy.heroImage} alt={fallbackCopy.heroAlt} className="h-auto w-full rounded-2xl" loading="lazy" />
          </div>
        </div>
      </section>

      <SectionWave className="bg-gradient-to-br from-surface-100 via-blush-300/30 to-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-neutral-900">{fallbackCopy.sectionOneTitle}</h2>
            <ul className="mt-4 space-y-3">
              {displayBullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-neutral-700">
                  <span className="icon-circle h-8 w-8 text-sm">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-neutral-900">Perguntas frequentes</h2>
            <ul className="mt-4 space-y-3">
              {(pageData?.faq ?? []).length > 0 ? (
                pageData?.faq.map((item) => (
                  <li key={item.question} className="rounded-lg border border-neutral-200 p-3 text-sm text-neutral-700">
                    <p className="font-semibold text-neutral-900">{item.question}</p>
                    <p className="mt-1">{item.answer}</p>
                  </li>
                ))
              ) : (
                <li className="text-sm text-neutral-700">Tire suas dúvidas no formulário para receber orientação personalizada.</li>
              )}
            </ul>
          </GlassCard>
        </div>
      </SectionWave>

      <SectionWave className="bg-gradient-to-b from-peach-500/30 to-surface-100" id="form-ads">
        <div className="mx-auto max-w-3xl px-6">
          <GlassCard className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-neutral-900">{displayCta}</h2>
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

              <CTAButton label={loading ? "Enviando..." : displayCta} type="submit" disabled={loading} />
            </form>
          </GlassCard>
        </div>
      </SectionWave>
    </>
  );
};

export default AdsLandingPage;
