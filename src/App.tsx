import React from "react";
import {
  about,
  benefits,
  diagnostic,
  faq,
  footer,
  hero,
  programs,
  story,
  testimonials,
} from "./data/content";

const SectionTitle: React.FC<{ label: string }> = ({ label }) => (
  <h2 className="section-title text-deepText">{label}</h2>
);

const GlassCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className = "",
}) => <div className={`glass-card ${className}`}>{children}</div>;

const Badge: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="badge-pill">{children}</span>
);

const CTAButton: React.FC<{ label: string }> = ({ label }) => (
  <button className="button-primary">{label}</button>
);

const SectionWave: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className = "",
}) => (
  <section className={`section-wave ${className} pb-16 pt-12 md:pt-16`}>{children}</section>
);

const Hero: React.FC = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-roseGlow/70 via-peachGlow/70 to-softBeige/80 text-deepText">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.45), rgba(0,0,0,0.35)), url(${hero.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "saturate(1)",
      }}
    />
    <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
      <GlassCard className="max-w-3xl border-white/60 px-8 py-10 text-left">
        <div className="flex flex-wrap items-center justify-between gap-4 text-white/90">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]">Nutrição Feminina</p>
          <div className="flex gap-2 text-xs text-white/80">
            <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1">Glassmorphism</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1">Mobile-first</span>
          </div>
        </div>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
          {hero.title}
        </h1>
        <p className="mt-4 text-lg text-white/90 md:text-xl">{hero.subtitle}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {hero.badges.map((badge) => (
            <Badge key={badge}>{badge}</Badge>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <CTAButton label={hero.ctaPrimary} />
          <button className="rounded-full border border-white/70 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10">
            {hero.ctaSecondary}
          </button>
        </div>
      </GlassCard>
    </div>
  </section>
);

const Diagnostic: React.FC = () => (
  <SectionWave className="bg-gradient-to-br from-softBeige via-rosyBeige/30 to-softBeige">
    <div className="mx-auto max-w-5xl px-6">
      <SectionTitle label={diagnostic.title} />
      <GlassCard className="p-6 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {diagnostic.symptoms.map((item) => (
            <div key={item} className="flex items-start gap-3 text-deepText">
              <span className="icon-circle text-lg">✓</span>
              <p className="card-text text-base">{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-white/60 pt-4 text-center text-sm font-semibold text-deepText">
          {diagnostic.tagline}
        </div>
      </GlassCard>
    </div>
  </SectionWave>
);

const About: React.FC = () => (
  <SectionWave className="bg-white/70">
    <div className="mx-auto max-w-6xl px-6">
      <SectionTitle label={about.title} />
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <GlassCard className="overflow-hidden">
          <div
            className="h-full min-h-[320px]"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.35), rgba(0,0,0,0.25)), url(${about.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </GlassCard>
        <GlassCard className="p-6 md:p-8">
          <p className="card-text text-base">{about.text}</p>
          <ul className="mt-4 space-y-3 text-sm font-semibold text-deepText">
            {about.bullets.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 text-icon">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <CTAButton label="Quero orientação leve" />
            <button className="rounded-full border border-deepText/10 px-5 py-3 text-sm font-semibold text-deepText transition hover:-translate-y-0.5 hover:bg-peachGlow/40">
              Falar com a Thaís
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  </SectionWave>
);

const Methods: React.FC = () => (
  <SectionWave className="bg-gradient-to-b from-peachGlow/40 via-softBeige to-white">
    <div className="mx-auto max-w-6xl px-6">
      <SectionTitle label="Métodos & Programas" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((program) => (
          <GlassCard key={program.title} className="p-6 transition hover:-translate-y-1">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="card-title">{program.title}</p>
                <span className="badge-pill bg-white/60 text-[11px]">Glass</span>
              </div>
              <p className="card-text">{program.desc}</p>
              <ul className="space-y-2 text-sm text-deepText">
                {program.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2">
                    <span className="text-icon">✓</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <CTAButton label={program.cta} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  </SectionWave>
);

const Story: React.FC = () => (
  <SectionWave className="bg-rosyBeige/20">
    <div className="mx-auto max-w-5xl px-6">
      <GlassCard className="p-6 md:p-10 text-center">
        <SectionTitle label={story.title} />
        <p className="text-xl font-semibold text-deepText md:text-2xl">{story.headline}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {story.bullets.map((item) => (
            <div key={item} className="glass-card p-4 text-sm font-semibold text-deepText">
              {item}
            </div>
          ))}
        </div>
        <p className="mt-6 text-base text-mutedText">{story.text}</p>
        <div className="mt-8 flex justify-center">
          <CTAButton label="Quero viver isso" />
        </div>
      </GlassCard>
    </div>
  </SectionWave>
);

const Benefits: React.FC = () => (
  <SectionWave className="bg-gradient-to-tr from-softBeige via-peachGlow/30 to-rosyBeige/20">
    <div className="mx-auto max-w-6xl px-6">
      <SectionTitle label="Benefícios práticos" />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {benefits.map((benefit) => (
          <GlassCard key={benefit.title} className="p-4">
            <div className="flex items-start gap-3">
              <div className="icon-circle text-lg">{benefit.icon}</div>
              <div>
                <p className="card-title text-base">{benefit.title}</p>
                <p className="card-text">{benefit.desc}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  </SectionWave>
);

const Testimonials: React.FC = () => (
  <SectionWave className="bg-white">
    <div className="mx-auto max-w-6xl px-6">
      <SectionTitle label="Depoimentos" />
      <div className="flex gap-4 overflow-x-auto pb-4">
        {testimonials.map((item) => (
          <GlassCard key={item.name} className="min-w-[260px] max-w-sm flex-1 p-5">
            <p className="text-sm italic text-deepText">“{item.text}”</p>
            <div className="mt-3 text-sm font-semibold text-mutedText">{item.name}</div>
            <div className="mt-2 inline-flex rounded-full bg-softBeige/60 px-3 py-1 text-xs font-semibold text-deepText">
              {item.tag}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  </SectionWave>
);

const FAQ: React.FC = () => (
  <SectionWave className="bg-gradient-to-b from-rosyBeige/30 via-softBeige to-white">
    <div className="mx-auto max-w-5xl px-6">
      <SectionTitle label="Perguntas frequentes" />
      <div className="grid gap-4 md:grid-cols-2">
        {faq.map((item) => (
          <GlassCard key={item.q} className="p-5">
            <p className="card-title text-base">{item.q}</p>
            <p className="card-text mt-1">{item.a}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  </SectionWave>
);

const FinalCTA: React.FC = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-roseGlow/70 via-peachGlow/60 to-rosyBeige/60 text-white">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
    <div className="relative mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
      <GlassCard className="max-w-3xl border-white/60 px-8 py-10 text-white">
        <h2 className="text-3xl font-bold">Pronta para leveza?</h2>
        <p className="mt-4 text-lg text-white/90">Agende agora e receba seu plano guiado.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <CTAButton label="Chamar Thaís agora" />
          <button className="rounded-full border border-white/70 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10">
            Ver disponibilidade
          </button>
        </div>
      </GlassCard>
    </div>
  </section>
);

const Footer: React.FC = () => (
  <footer className="bg-softBeige/90 py-6 text-center text-xs text-deepText">
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-3 text-icon">
        <span className="icon-circle">IG</span>
        <span className="icon-circle">TT</span>
        <span className="icon-circle">WA</span>
      </div>
      <p>© 2024 Thaís Paganini | Nutrição Feminina</p>
      <p className="text-mutedText">{footer.note}</p>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <main className="min-h-screen bg-softBeige text-deepText">
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 text-sm font-semibold">
          <span>Thaís Paganini | Nutrição Feminina</span>
          <CTAButton label="Agendar consulta" />
        </div>
      </header>
      <Hero />
      <Diagnostic />
      <About />
      <Methods />
      <Story />
      <Benefits />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
};

export default App;
