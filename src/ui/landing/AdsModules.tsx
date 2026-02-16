import React from "react";
import { CTAButton, GlassCard, SectionWave } from "../Primitives";

export type AccordionItem = { title: string; content: string };

type HeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  imageSrc: string;
  imageAlt: string;
};

export const HeroModule: React.FC<HeroProps> = ({ eyebrow, title, subtitle, ctaLabel, imageSrc, imageAlt }) => (
  <section className="relative isolate overflow-hidden bg-bgBase px-6 py-16 md:py-20">
    <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
      <GlassCard className="border-white/60 p-7 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">{eyebrow}</p>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-neutral-900 md:text-4xl">{title}</h1>
        <p className="mt-4 text-base text-neutral-700 md:text-lg">{subtitle}</p>
        <a href="#form-ads" className="mt-7 inline-flex">
          <CTAButton label={ctaLabel} />
        </a>
      </GlassCard>
      <div className="rounded-3xl border border-white/60 bg-white/70 p-4 shadow-xl">
        <img src={imageSrc} alt={imageAlt} className="h-auto w-full rounded-2xl object-cover" loading="lazy" />
      </div>
    </div>
  </section>
);

export const BenefitsModule: React.FC<{ items: string[] }> = ({ items }) => (
  <SectionWave className="bg-gradient-to-br from-surface-100 via-blush-300/30 to-white">
    <div className="mx-auto max-w-6xl px-6">
      <h2 className="text-center text-2xl font-bold text-neutral-900 md:text-3xl">Benefícios</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {items.map((item) => (
          <GlassCard key={item} className="p-5 text-center text-sm font-semibold text-neutral-800">{item}</GlassCard>
        ))}
      </div>
    </div>
  </SectionWave>
);

export const ChipsAccordionModule: React.FC<{ title: string; items: AccordionItem[] }> = ({ title, items }) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <SectionWave className="bg-white/70">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-2xl font-bold text-neutral-900 md:text-3xl">{title}</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {items.map((item, idx) => {
            const expanded = openIndex === idx;
            const panelId = `chip-panel-${idx}`;
            return (
              <div key={item.title} className="w-full max-w-xl">
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  className={`w-full rounded-full border px-5 py-3 text-left text-sm font-semibold transition ${expanded ? "border-primary-700 bg-primary-700 text-white" : "border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50"}`}
                  onClick={() => setOpenIndex(expanded ? null : idx)}
                >
                  {item.title}
                </button>
                <div id={panelId} hidden={!expanded} className="px-4 pt-3 text-sm text-neutral-700">
                  {item.content}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWave>
  );
};

export const ResultsModule: React.FC<{ images: string[] }> = ({ images }) => (
  <SectionWave className="bg-gradient-to-b from-peach-500/30 to-surface-100">
    <div className="mx-auto max-w-6xl px-6">
      <h2 className="text-center text-2xl font-bold text-neutral-900 md:text-3xl">Resultados</h2>
      <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3">
        {images.map((src, idx) => (
          <div key={src} className="min-w-[82%] snap-center rounded-2xl border border-white/60 bg-white/80 p-3 shadow md:min-w-[48%]">
            <img src={src} alt={`Resultado ${idx + 1}`} className="h-64 w-full rounded-xl object-cover md:h-72" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  </SectionWave>
);

export const AboutModule: React.FC<{ imageSrc: string; paragraphs: string[]; ctaLabel: string }> = ({ imageSrc, paragraphs, ctaLabel }) => (
  <SectionWave className="bg-white/70">
    <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center">
      <img src={imageSrc} alt="Nutricionista em atendimento" className="h-72 w-full rounded-3xl object-cover shadow-xl md:h-96" loading="lazy" />
      <GlassCard className="p-6 md:p-8">
        <h2 className="text-2xl font-bold text-neutral-900">Sobre o acompanhamento</h2>
        <div className="mt-4 space-y-3 text-sm text-neutral-700">
          {paragraphs.map((text) => <p key={text}>{text}</p>)}
        </div>
        <a href="#form-ads" className="mt-6 inline-flex">
          <CTAButton label={ctaLabel} />
        </a>
      </GlassCard>
    </div>
  </SectionWave>
);

export const TestimonialsModule: React.FC<{ items: Array<{ quote: string; author: string }> }> = ({ items }) => (
  <SectionWave className="bg-gradient-to-br from-surface-100 via-blush-300/30 to-white">
    <div className="mx-auto max-w-6xl px-6">
      <h2 className="text-center text-2xl font-bold text-neutral-900 md:text-3xl">Depoimentos</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <GlassCard key={item.quote} className="p-5">
            <p className="text-sm text-neutral-700">“{item.quote}”</p>
            <p className="mt-3 text-sm font-semibold text-neutral-900">{item.author}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  </SectionWave>
);

export const StepsModule: React.FC<{ steps: string[] }> = ({ steps }) => (
  <SectionWave className="bg-white/70">
    <div className="mx-auto max-w-6xl px-6">
      <h2 className="text-center text-2xl font-bold text-neutral-900 md:text-3xl">Como funciona</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {steps.map((step, idx) => (
          <GlassCard key={step} className="p-5">
            <p className="text-sm font-semibold text-primary-700">Passo {idx + 1}</p>
            <p className="mt-2 text-sm text-neutral-700">{step}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  </SectionWave>
);

export const GalleryModule: React.FC<{ images: string[] }> = ({ images }) => (
  <SectionWave className="bg-gradient-to-b from-peach-500/30 to-surface-100">
    <div className="mx-auto max-w-6xl px-6">
      <h2 className="text-center text-2xl font-bold text-neutral-900 md:text-3xl">Galeria</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {images.map((src, idx) => (
          <img key={src} src={src} alt={`Galeria ${idx + 1}`} className="h-52 w-full rounded-2xl border border-white/60 object-cover shadow" loading="lazy" />
        ))}
      </div>
    </div>
  </SectionWave>
);

export const LocationModule: React.FC<{ title: string; text: string; ctaLabel: string }> = ({ title, text, ctaLabel }) => (
  <SectionWave className="bg-white/70">
    <div className="mx-auto max-w-4xl px-6">
      <GlassCard className="p-6 text-center md:p-8">
        <h2 className="text-2xl font-bold text-neutral-900">{title}</h2>
        <p className="mt-3 text-base text-neutral-700">{text}</p>
        <a href="#form-ads" className="mt-5 inline-flex">
          <CTAButton label={ctaLabel} />
        </a>
      </GlassCard>
    </div>
  </SectionWave>
);

export const FAQModule: React.FC<{ items: AccordionItem[] }> = ({ items }) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <SectionWave className="bg-gradient-to-br from-surface-100 via-blush-300/30 to-white">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-2xl font-bold text-neutral-900 md:text-3xl">FAQ</h2>
        <div className="mt-6 space-y-3">
          {items.map((item, idx) => {
            const expanded = openIndex === idx;
            const panelId = `faq-panel-${idx}`;
            return (
              <GlassCard key={item.title} className="p-4">
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(expanded ? null : idx)}
                  className="w-full text-left text-sm font-semibold text-neutral-900"
                >
                  {item.title}
                </button>
                <p id={panelId} hidden={!expanded} className="mt-2 text-sm text-neutral-700">
                  {item.content}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </SectionWave>
  );
};
