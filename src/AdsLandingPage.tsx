import React from "react";
import { CTAButton, GlassCard, SectionWave } from "./ui/Primitives";
import {
  ADS_ROUTE_META,
  ADS_ROUTE_SLUG,
  AdsLeadFormValues,
  AdsRouteKey,
  buildWhatsAppRedirectUrl,
  captureUtmParams,
  normalizeAdsLeadPayload,
  submitAdsLead,
  triggerConversionEvent,
  validateAdsLeadValues,
} from "./lib/adsLanding";
import {
  AboutModule,
  BenefitsModule,
  ChipsAccordionModule,
  FAQModule,
  GalleryModule,
  HeroModule,
  LocationModule,
  ResultsModule,
  StepsModule,
  TestimonialsModule,
} from "./ui/landing/AdsModules";

type LandingConfig = {
  title: string;
  description: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    imageSrc: string;
    imageAlt: string;
  };
  benefits: string[];
  protocols: string[];
  differentials: string[];
  aboutParagraphs: string[];
  testimonials: Array<{ quote: string; author: string }>;
  steps: string[];
  galleryImages: string[];
  location?: { title: string; text: string; ctaLabel: string };
  faq: Array<{ title: string; content: string }>;
  scarcity: string;
};

const MOCKUP_PATHS = {
  heroPresencial: "/mockups/hero-presencial.svg",
  heroOnline: "/mockups/hero-online.svg",
  about: "/mockups/about.svg",
  result: ["/mockups/result-1.svg", "/mockups/result-2.svg", "/mockups/result-3.svg", "/mockups/result-4.svg"],
  clinic: ["/mockups/clinic-1.svg", "/mockups/clinic-2.svg", "/mockups/clinic-3.svg", "/mockups/clinic-4.svg"],
};

const LANDING_CONFIG: Record<AdsRouteKey, LandingConfig> = {
  controle_metabolico_barra: {
    title: "Nutricionista na Barra da Tijuca | Controle metabólico feminino",
    description:
      "Atendimento clínico individual no Shopping Downtown para mulheres com dificuldade de emagrecimento e sintomas metabólicos persistentes.",
    hero: {
      eyebrow: "Atendimento presencial",
      title: "Nutricionista na Barra da Tijuca para controle de peso e saúde metabólica feminina",
      subtitle:
        "Atendimento clínico individual no Shopping Downtown para mulheres com dificuldade de emagrecimento e sintomas metabólicos persistentes.",
      ctaLabel: "Solicitar avaliação presencial",
      imageSrc: MOCKUP_PATHS.heroPresencial,
      imageAlt: "Mockup do atendimento presencial",
    },
    benefits: [
      "Pré-consulta estruturada",
      "Consulta clínica aprofundada",
      "Estratégia personalizada para rotina real",
      "Atenção pré/consulta/pós",
    ],
    protocols: [
      "Ganho de peso resistente",
      "Compulsão e fome emocional",
      "Intestino desregulado e inchaço",
      "Cansaço frequente e queda de energia",
      "Performance feminina (rotina e treino)",
    ],
    differentials: [
      "Pré-consulta estruturada para mapear histórico, exames e rotina.",
      "Consulta clínica aprofundada com foco em sintomas metabólicos persistentes.",
      "Estratégia personalizada para rotina real, sem plano engessado.",
      "Material complementar (ebooks/orientações) para facilitar aderência.",
      "Acompanhamento próximo antes, durante e após a consulta.",
    ],
    aboutParagraphs: [
      "O acompanhamento é individual e considera sua rotina, exames, sinais clínicos e objetivos reais.",
      "A proposta é construir consistência com estratégia nutricional prática e monitoramento contínuo.",
      "Apenas 4 vagas presenciais por semana.",
    ],
    testimonials: [
      { quote: "Consegui organizar alimentação e energia sem radicalismos.", author: "Paciente presencial" },
      { quote: "Saí da consulta com clareza do que fazer na rotina.", author: "Paciente presencial" },
      { quote: "Meu plano ficou realista e fácil de manter no dia a dia.", author: "Paciente presencial" },
    ],
    steps: [
      "Preenchimento da pré-consulta",
      "Consulta clínica aprofundada",
      "Plano alimentar e estratégia de rotina",
      "Ajustes pós-consulta",
    ],
    galleryImages: MOCKUP_PATHS.clinic,
    location: {
      title: "Onde nos encontramos",
      text: "Shopping Downtown — Barra da Tijuca, RJ",
      ctaLabel: "Solicitar avaliação presencial",
    },
    faq: [
      { title: "Como funciona o atendimento presencial?", content: "Após o formulário, você recebe orientações para triagem e agenda a consulta presencial." },
      { title: "Qual público é atendido?", content: "Mulheres adultas com foco em controle de peso e saúde metabólica." },
      { title: "Quantas vagas presenciais existem?", content: "A agenda presencial abre apenas 4 vagas por semana." },
    ],
    scarcity: "Apenas 4 vagas presenciais por semana.",
  },
  consulta_online_controle_peso: {
    title: "Consulta nutricional online | Controle de peso e metabolismo",
    description: "Atendimento individual com retorno estruturado em 45 dias para ajuste de estratégia.",
    hero: {
      eyebrow: "Atendimento online",
      title: "Consulta nutricional online para controle de peso e organização metabólica",
      subtitle: "Atendimento individual com retorno estruturado em 45 dias para ajuste de estratégia.",
      ctaLabel: "Solicitar consulta online",
      imageSrc: MOCKUP_PATHS.heroOnline,
      imageAlt: "Mockup da consulta online",
    },
    benefits: [
      "Plano individualizado",
      "Estratégia para compulsão e estresse",
      "Organização metabólica e rotina",
      "Retorno em 45 dias (reavaliação + nova estratégia)",
    ],
    protocols: [
      "Controle de peso com estratégia",
      "Compulsão e estresse",
      "Intestino e inchaço",
      "Performance e rotina",
      "Consistência e aderência",
    ],
    differentials: [
      "Plano individualizado de acordo com sua fase atual.",
      "Estratégia para reduzir gatilhos de compulsão e estresse alimentar.",
      "Organização metabólica combinada com rotina possível de cumprir.",
      "Retorno estruturado em 45 dias com reavaliação e nova estratégia.",
      "Comunicação clara para você manter consistência no processo.",
    ],
    aboutParagraphs: [
      "A consulta online é individual e organizada para facilitar adesão no cotidiano.",
      "Você recebe direcionamento prático, metas realistas e retorno estruturado para ajustes.",
      "O foco é continuidade com estratégia personalizada.",
    ],
    testimonials: [
      { quote: "Consegui manter consistência e reduzir episódios de compulsão.", author: "Paciente online" },
      { quote: "O retorno de 45 dias fez diferença para ajustar minha estratégia.", author: "Paciente online" },
      { quote: "Atendimento objetivo, acolhedor e fácil de aplicar na rotina.", author: "Paciente online" },
    ],
    steps: [
      "Preenchimento da pré-consulta",
      "Consulta individual online",
      "Plano alimentar e estratégia de rotina",
      "Retorno em 45 dias (reavaliação + nova estratégia)",
    ],
    galleryImages: MOCKUP_PATHS.clinic,
    faq: [
      { title: "Como funciona a consulta online?", content: "Após preencher o formulário, você recebe os próximos passos para triagem e agendamento." },
      { title: "Quando acontece o retorno?", content: "O retorno é em 45 dias com reavaliação e ajuste da estratégia." },
      { title: "Existe parcelamento?", content: "Sim, o atendimento online pode ser parcelado em até 2x." },
    ],
    scarcity: "Agenda com disponibilidade limitada para manter acompanhamento individual.",
  },
};

const defaultValues: AdsLeadFormValues = {
  nome: "",
  email: "",
  whatsapp: "",
  idade: "",
  objetivo_principal: "",
  disposicao_investimento: "",
};

const useAdsHead = (config: LandingConfig, routeKey: AdsRouteKey) => {
  React.useEffect(() => {
    const previousTitle = document.title;
    const previousRobots = document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
    const previousDescription = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";

    document.title = config.title;

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
    ensureMeta('meta[name="description"]', "description", config.description);

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
  }, [config.description, config.title, routeKey]);
};

const AdsLandingPage: React.FC<{ routeKey: AdsRouteKey }> = ({ routeKey }) => {
  const config = LANDING_CONFIG[routeKey];
  const [values, setValues] = React.useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  useAdsHead(config, routeKey);

  const handleChange = (field: keyof AdsLeadFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const utm = captureUtmParams();

  const submitLead = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const validationError = validateAdsLeadValues(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      ...normalizeAdsLeadPayload(routeKey, values, utm),
      page: ADS_ROUTE_SLUG[routeKey],
    };

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

  return (
    <>
      <HeroModule {...config.hero} />
      <BenefitsModule items={config.benefits} />
      <ChipsAccordionModule title="O que tratamos / protocolos" items={config.protocols.map((item, index) => ({ title: item, content: config.differentials[index] ?? item }))} />
      <ResultsModule images={MOCKUP_PATHS.result} />
      <AboutModule imageSrc={MOCKUP_PATHS.about} paragraphs={[...config.aboutParagraphs, config.scarcity]} ctaLabel={config.hero.ctaLabel} />
      <TestimonialsModule items={config.testimonials} />
      <StepsModule steps={config.steps} />
      <GalleryModule images={config.galleryImages} />
      {config.location && <LocationModule {...config.location} />}
      <FAQModule items={config.faq} />

      <SectionWave className="bg-gradient-to-b from-peach-500/30 to-surface-100" id="form-ads">
        <div className="mx-auto max-w-3xl px-6">
          <GlassCard className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-neutral-900">{config.hero.ctaLabel}</h2>
            <p className="mt-2 text-sm text-neutral-700">Preencha os dados para receber as próximas orientações.</p>
            <form className="mt-6 grid gap-4" onSubmit={submitLead}>
              <input className="rounded-xl border border-neutral-200 px-4 py-3" placeholder="Nome" value={values.nome} onChange={handleChange("nome")} required />
              <input className="rounded-xl border border-neutral-200 px-4 py-3" placeholder="E-mail" type="email" value={values.email} onChange={handleChange("email")} required />
              <input className="rounded-xl border border-neutral-200 px-4 py-3" placeholder="WhatsApp com DDD" value={values.whatsapp} onChange={handleChange("whatsapp")} required />
              <input className="rounded-xl border border-neutral-200 px-4 py-3" placeholder="Idade" type="number" min={18} max={70} value={values.idade} onChange={handleChange("idade")} required />

              <select className="rounded-xl border border-neutral-200 px-4 py-3" value={values.objetivo_principal} onChange={handleChange("objetivo_principal")} required>
                <option value="">Objetivo principal</option>
                <option value="Controle de peso">Controle de peso</option>
                <option value="Compulsão/ansiedade alimentar">Compulsão/ansiedade alimentar</option>
                <option value="Intestino/inchaço">Intestino/inchaço</option>
                <option value="Performance">Performance</option>
                <option value="Outro">Outro</option>
              </select>

              <fieldset className="rounded-xl border border-neutral-200 px-4 py-3">
                <legend className="px-1 text-sm font-semibold text-neutral-700">Disposição de investimento</legend>
                <div className="mt-2 flex gap-6 text-sm text-neutral-700">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="disposicao_investimento" value="Sim" checked={values.disposicao_investimento === "Sim"} onChange={handleChange("disposicao_investimento")} required />
                    Sim
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="disposicao_investimento" value="Ainda avaliando" checked={values.disposicao_investimento === "Ainda avaliando"} onChange={handleChange("disposicao_investimento")} required />
                    Ainda avaliando
                  </label>
                </div>
              </fieldset>

              <input type="hidden" name="page" value={ADS_ROUTE_SLUG[routeKey]} />
              <input type="hidden" name="utm_source" value={utm.utm_source} />
              <input type="hidden" name="utm_medium" value={utm.utm_medium} />
              <input type="hidden" name="utm_campaign" value={utm.utm_campaign} />
              <input type="hidden" name="utm_term" value={utm.utm_term} />
              <input type="hidden" name="utm_content" value={utm.utm_content} />
              <input type="hidden" name="timestamp" value={new Date().toISOString()} />

              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
              {successMessage && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</p>}

              <CTAButton label={loading ? "Enviando..." : config.hero.ctaLabel} type="submit" disabled={loading} />
            </form>
          </GlassCard>
        </div>
      </SectionWave>
    </>
  );
};

export default AdsLandingPage;
