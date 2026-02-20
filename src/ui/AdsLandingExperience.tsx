import React from "react";
import { buildWhatsappUrl } from "../config/whatsapp";
import { CTAButton, GlassCard, SectionTitle, SectionWave } from "./Primitives";
import LocationModule from "./sections/LocationModule";
import TransformationTestimonials from "./sections/TransformationTestimonials";

type AdsVariant = "presencial" | "online";

type AdsLandingExperienceProps = {
  variant: AdsVariant;
};

type LeadFormData = {
  nome: string;
  telefone: string;
};

const COPY = {
  presencial: {
    hero: {
      title: "Nutricionista na Barra da Tijuca para Controle de Peso e Saúde Metabólica Feminina",
      subtitle:
        "Atendimento clínico individual no Shopping Downtown, direcionado a mulheres que enfrentam dificuldade de emagrecimento, compulsão alimentar e desorganização metabólica persistente.",
      description:
        "Acompanhamento técnico e personalizado para organizar alimentação, energia, composição corporal e consistência de resultados.",
      cta: "Agendar Avaliação Presencial",
      microcopy: "Agenda limitada a 4 atendimentos presenciais por semana.",
    },
    audience: {
      title: "Este atendimento é indicado para mulheres que:",
      bullets: [
        "Já tentaram diferentes abordagens e não conseguiram estabilidade",
        "Sentem que fazem tudo certo e mesmo assim não evoluem",
        "Vivem ciclos de compulsão e frustração",
        "Sofrem com inchaço, intestino irregular ou cansaço frequente",
        "Buscam acompanhamento individual e estratégia clínica estruturada",
      ],
      footer: "Este não é um protocolo genérico. É acompanhamento técnico individual.",
    },
    process: {
      title: "Estrutura do acompanhamento presencial",
      steps: [
        {
          title: "1️⃣ Pré-consulta estruturada",
          description: "Análise prévia detalhada da sua rotina e histórico.",
        },
        {
          title: "2️⃣ Consulta clínica individual",
          description: "Avaliação aprofundada de sintomas, hábitos, exames e composição corporal.",
        },
        {
          title: "3️⃣ Estratégia personalizada",
          description: "Plano alimentar e comportamental alinhado à sua realidade.",
        },
        {
          title: "4️⃣ Reavaliação estratégica presencial",
          description: "Ajustes técnicos conforme sua evolução.",
        },
      ],
      cta: "Quero garantir minha avaliação",
    },
    transformationTitle: "Transformação por Atendimento Presencial",
    transformationCta: "Agendar Avaliação Presencial",
    authority: {
      title: "Atendimento técnico com acompanhamento individual",
      description:
        "Nutricionista com foco em controle de peso feminino, organização metabólica e construção de rotina sustentável. O atendimento presencial permite análise aprofundada e estratégia personalizada para mulheres que buscam direcionamento profissional de alto nível.",
    },
    locationTitle: "Atendimento no Shopping Downtown — Barra da Tijuca",
    locationDescription: "Ambiente reservado, estrutura confortável e fácil acesso.",
    faq: [
      {
        q: "O atendimento é individual?",
        a: "Sim. Toda estratégia é personalizada.",
      },
      {
        q: "Preciso levar exames?",
        a: "Exames recentes ajudam na avaliação, mas não são obrigatórios.",
      },
      {
        q: "Quantas vagas estão disponíveis?",
        a: "A agenda presencial é limitada a 4 atendimentos por semana.",
      },
    ],
    finalCta: {
      title: "Pronta para organizar seu controle de peso com acompanhamento estruturado?",
      button: "Agendar minha avaliação presencial",
      subtitle: "Atendimento individual. Estratégia técnica. Evolução consistente.",
    },
  },
  online: {
    hero: {
      title: "Consulta Nutricional Online para Controle de Peso e Organização Metabólica",
      subtitle:
        "Atendimento individual para mulheres que desejam estruturar alimentação, reduzir compulsão e recuperar energia — sem sair de casa.",
      description: "Consulta online com retorno estratégico em 45 dias para ajustes e evolução do plano.",
      cta: "Agendar Consulta Online",
      microcopy: "Vagas online limitadas por semana.",
    },
    audience: {
      title: "Essa consulta online é para você que:",
      bullets: [
        "Quer acompanhamento profissional sem sair de casa",
        "Já tentou dietas e não conseguiu manter resultado",
        "Vive ciclos de compulsão alimentar",
        "Busca organização alimentar adaptada à sua rotina",
        "Quer acompanhamento com retorno estruturado",
      ],
    },
    process: {
      title: "Como funciona a consulta online",
      steps: [
        {
          title: "1️⃣ Pré-consulta detalhada",
          description: "Você preenche um formulário completo antes do atendimento.",
        },
        {
          title: "2️⃣ Consulta individual por videochamada",
          description: "Avaliação da sua rotina, histórico e objetivos.",
        },
        {
          title: "3️⃣ Estratégia personalizada",
          description: "Plano alimentar adaptado à sua realidade.",
        },
        {
          title: "4️⃣ Retorno online em 45 dias",
          description: "Reavaliação estratégica com ajustes personalizados.",
        },
      ],
      cta: "Quero agendar minha consulta online",
    },
    transformationTitle: "Transformação por Atendimento Online",
    transformationCta: "Agendar Consulta Online",
    authority: {
      title: "Acompanhamento estruturado onde você estiver",
      description:
        "O atendimento online mantém a mesma estrutura estratégica do presencial, com organização, acompanhamento e retorno programado.",
    },
    faq: [
      {
        q: "A consulta online funciona mesmo?",
        a: "Sim. O atendimento é estruturado e individual.",
      },
      {
        q: "Recebo plano alimentar?",
        a: "Sim. Você recebe plano personalizado e orientações estratégicas.",
      },
      {
        q: "Preciso de exames?",
        a: "Não é obrigatório, mas pode contribuir para a estratégia.",
      },
    ],
    finalCta: {
      title: "Pronta para organizar seu controle de peso?",
      button: "Agendar minha consulta online",
      subtitle: "Estratégia personalizada e acompanhamento estruturado.",
    },
  },
} as const;

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const AdsLandingExperience: React.FC<AdsLandingExperienceProps> = ({ variant }) => {
  const copy = COPY[variant];
  const formRef = React.useRef<HTMLElement | null>(null);
  const [formData, setFormData] = React.useState<LeadFormData>({ nome: "", telefone: "" });

  const scrollToForm = React.useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const trackSubmitConversion = React.useCallback(() => {
    const eventName = variant === "presencial" ? "ads_submit_presencial" : "ads_submit_online";
    const payload = { event: eventName, route_variant: variant };

    if (Array.isArray((window as Window & { dataLayer?: unknown[] }).dataLayer)) {
      (window as Window & { dataLayer?: unknown[] }).dataLayer?.push(payload);
    }

    if (typeof (window as Window & { gtag?: (...args: unknown[]) => void }).gtag === "function") {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.("event", "conversion", {
        event_category: "lead",
        event_label: eventName,
      });
    }
  }, [variant]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nome = formData.nome.trim();
    const telefoneLimpo = formData.telefone.replace(/\D/g, "");

    if (nome.length < 3 || telefoneLimpo.length < 10) {
      return;
    }

    trackSubmitConversion();

    const interesse = variant === "presencial" ? "avaliação presencial" : "consulta online";
    const message = `Olá, sou ${nome} e quero agendar ${interesse}. Meu telefone é ${formData.telefone}.`;
    window.open(buildWhatsappUrl(message), "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section className="bg-bgBase px-6 pb-14 pt-16 md:pb-20 md:pt-20">
        <div className="mx-auto max-w-5xl">
          <GlassCard className="border-white/60 px-6 py-8 md:px-10 md:py-12">
            <h1 className="text-3xl font-bold leading-tight text-neutral-900 md:text-4xl">{copy.hero.title}</h1>
            <p className="mt-4 text-lg text-neutral-700">{copy.hero.subtitle}</p>
            <p className="mt-4 text-base text-neutral-600">{copy.hero.description}</p>
            <div className="mt-8">
              <CTAButton label={copy.hero.cta} onClick={scrollToForm} />
              <p className="mt-3 text-sm font-medium text-neutral-600">{copy.hero.microcopy}</p>
            </div>
          </GlassCard>
        </div>
      </section>

      <SectionWave className="bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <SectionTitle label={copy.audience.title} />
          <GlassCard className="p-6 md:p-8">
            <ul className="space-y-3">
              {copy.audience.bullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-neutral-800">
                  <span className="mt-1 text-primary-700">✔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {"footer" in copy.audience && copy.audience.footer ? (
              <p className="mt-6 text-sm font-semibold text-neutral-700">{copy.audience.footer}</p>
            ) : null}
          </GlassCard>
        </div>
      </SectionWave>

      <SectionWave className="bg-gradient-to-b from-surface-100 to-white">
        <div className="mx-auto max-w-5xl px-6">
          <SectionTitle label={copy.process.title} />
          <div className="grid gap-4">
            {copy.process.steps.map((step) => (
              <GlassCard key={step.title} className="p-5 md:p-6">
                <p className="text-lg font-semibold text-neutral-900">{step.title}</p>
                <p className="mt-2 text-neutral-600">{step.description}</p>
              </GlassCard>
            ))}
          </div>
          <div className="mt-8">
            <CTAButton label={copy.process.cta} onClick={scrollToForm} />
          </div>
        </div>
      </SectionWave>

      <TransformationTestimonials title={copy.transformationTitle} variant={variant} />

      <SectionWave className="bg-white pt-0">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex justify-center">
            <CTAButton label={copy.transformationCta} onClick={scrollToForm} />
          </div>
        </div>
      </SectionWave>

      <SectionWave className="bg-gradient-to-b from-blush-300/20 to-white">
        <div className="mx-auto max-w-5xl px-6">
          <SectionTitle label={copy.authority.title} />
          <GlassCard className="p-6 md:p-8">
            <p className="text-neutral-700">{copy.authority.description}</p>
          </GlassCard>
        </div>
      </SectionWave>

      {variant === "presencial" ? (
        <SectionWave className="bg-white">
          <div className="mx-auto max-w-6xl px-6">
            <SectionTitle label={copy.locationTitle} />
            <p className="mb-6 text-neutral-700">{copy.locationDescription}</p>
          </div>
          <LocationModule />
        </SectionWave>
      ) : null}

      <SectionWave className="bg-gradient-to-b from-surface-100 to-white">
        <div className="mx-auto max-w-5xl px-6">
          <SectionTitle label="FAQ" />
          <div className="grid gap-4 md:grid-cols-3">
            {copy.faq.map((item) => (
              <GlassCard key={item.q} className="p-5">
                <p className="font-semibold text-neutral-900">{item.q}</p>
                <p className="mt-2 text-sm text-neutral-600">{item.a}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </SectionWave>

      <section ref={formRef} className="bg-gradient-to-br from-primary-700/80 via-peach-500/60 to-blush-300/70 px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <GlassCard className="border-white/60 px-6 py-8 text-white md:px-10">
            <h2 className="text-3xl font-bold">{copy.finalCta.title}</h2>
            <p className="mt-3 text-white/90">{copy.finalCta.subtitle}</p>
            <form className="mt-8 grid gap-4 md:grid-cols-3" onSubmit={handleSubmit}>
              <label className="md:col-span-1">
                <span className="mb-1 block text-sm font-semibold">Nome</span>
                <input
                  required
                  minLength={3}
                  value={formData.nome}
                  onChange={(event) => setFormData((prev) => ({ ...prev, nome: event.target.value }))}
                  className="w-full rounded-xl border border-white/40 bg-white/80 px-4 py-3 text-neutral-900 outline-none focus:ring-2 focus:ring-white/70"
                  placeholder="Seu nome"
                />
              </label>
              <label className="md:col-span-1">
                <span className="mb-1 block text-sm font-semibold">WhatsApp</span>
                <input
                  required
                  value={formData.telefone}
                  onChange={(event) => setFormData((prev) => ({ ...prev, telefone: formatPhone(event.target.value) }))}
                  className="w-full rounded-xl border border-white/40 bg-white/80 px-4 py-3 text-neutral-900 outline-none focus:ring-2 focus:ring-white/70"
                  placeholder="(21) 99999-9999"
                />
              </label>
              <div className="flex items-end md:col-span-1">
                <CTAButton type="submit" label={copy.finalCta.button} />
              </div>
            </form>
          </GlassCard>
        </div>
      </section>
    </>
  );
};

export default AdsLandingExperience;
