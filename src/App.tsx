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
import BodyFatCalculator from "./Calculator";

const SectionTitle: React.FC<{ label: string }> = ({ label }) => (
  <h2 className="section-title text-neutral-900">{label}</h2>
);

const GlassCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className = "",
}) => <div className={`glass-card ${className}`}>{children}</div>;

const Badge: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="badge-pill">{children}</span>
);

const CTAButton: React.FC<{ label: string; href?: string; onClick?: () => void }> = ({
  label,
  href,
  onClick,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (onClick) {
      event.preventDefault();
      onClick();
    }
  };

  if (href) {
    return (
      <a className="button-primary" href={href} onClick={handleClick}>
        {label}
      </a>
    );
  }

  return (
    <button type="button" className="button-primary" onClick={onClick}>
      {label}
    </button>
  );
};

const SectionWave: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className = "",
}) => (
  <section className={`section-wave ${className} pb-16 pt-12 md:pt-16`}>{children}</section>
);

const Hero: React.FC = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-primary-700/75 via-peach-500/70 to-surface-200/80 text-neutral-900">
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

const Diagnostic: React.FC = () => {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const toggleSymptom = (item: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  };

  const selectedCount = selected.size;
  const totalSymptoms = diagnostic.symptoms.length;

  return (
    <SectionWave className="bg-gradient-to-br from-surface-100 via-blush-300/30 to-surface-100">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle label={diagnostic.title} />
        <GlassCard className="p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {diagnostic.symptoms.map((item) => {
              const isSelected = selected.has(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleSymptom(item)}
                  className={`group flex items-start gap-3 rounded-2xl p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-primary-700/60 ${
                    isSelected ? "bg-white/80 shadow-lg" : "hover:bg-white/60"
                  }`}
                >
                  <span
                    className={`icon-circle text-lg transition-colors ${
                      isSelected ? "bg-neutral-900 text-white" : ""
                    }`}
                  >
                    ✓
                  </span>
                  <p
                    className={`card-text text-base transition-colors ${
                      isSelected ? "font-semibold text-neutral-900" : ""
                    }`}
                  >
                    {item}
                  </p>
                </button>
              );
            })}
          </div>
          <div className="mt-6 border-t border-white/60 pt-4 text-center text-sm font-semibold text-neutral-900">
            {selectedCount > 0
              ? `${selectedCount}/${totalSymptoms} Motivos para você agendar sua Consulta`
              : diagnostic.tagline}
          </div>
        </GlassCard>
      </div>
    </SectionWave>
  );
};

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
          <ul className="mt-4 space-y-3 text-sm font-semibold text-neutral-900">
            {about.bullets.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 text-primary-700">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <CTAButton label="Quero orientação leve" />
            <button className="rounded-full border border-neutral-900/10 px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:bg-peach-500/40">
              Falar com a Thaís
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  </SectionWave>
);

const Methods: React.FC<{ onNavigateToCalculator: () => void }> = ({ onNavigateToCalculator }) => (
  <SectionWave className="bg-gradient-to-b from-peach-500/40 via-surface-100 to-white">
    <div className="mx-auto max-w-6xl px-6">
      <SectionTitle label="Métodos & Programas" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((program) => {
          const goToCalculator = program.cta.toLowerCase().includes("calcular");
          return (
            <GlassCard key={program.title} className="p-6 transition hover:-translate-y-1">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="card-title">{program.title}</p>
                  <span className="badge-pill bg-white/60 text-[11px]">Glass</span>
                </div>
                <p className="card-text">{program.desc}</p>
                <ul className="space-y-2 text-sm text-neutral-900">
                  {program.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2">
                      <span className="text-primary-700">✓</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <CTAButton
                    label={program.cta}
                    href={goToCalculator ? "?page=calculadora_gordura" : undefined}
                    onClick={goToCalculator ? onNavigateToCalculator : undefined}
                  />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  </SectionWave>
);

const Story: React.FC = () => (
  <SectionWave className="bg-blush-300/20">
    <div className="mx-auto max-w-5xl px-6">
      <GlassCard className="p-6 md:p-10 text-center">
        <SectionTitle label={story.title} />
        <p className="text-xl font-semibold text-neutral-900 md:text-2xl">{story.headline}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {story.bullets.map((item) => (
            <div key={item} className="glass-card p-4 text-sm font-semibold text-neutral-900">
              {item}
            </div>
          ))}
        </div>
        <p className="mt-6 text-base text-neutral-600">{story.text}</p>
        <div className="mt-8 flex justify-center">
          <CTAButton label="Quero viver isso" />
        </div>
      </GlassCard>
    </div>
  </SectionWave>
);

const Benefits: React.FC = () => (
  <SectionWave className="bg-gradient-to-tr from-surface-100 via-peach-500/30 to-blush-300/20">
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
            <p className="text-sm italic text-neutral-900">“{item.text}”</p>
            <div className="mt-3 text-sm font-semibold text-neutral-600">{item.name}</div>
            <div className="mt-2 inline-flex rounded-full bg-surface-100/60 px-3 py-1 text-xs font-semibold text-neutral-900">
              {item.tag}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  </SectionWave>
);

const FAQ: React.FC = () => (
  <SectionWave className="bg-gradient-to-b from-blush-300/30 via-surface-100 to-white">
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
  <section className="relative overflow-hidden bg-gradient-to-br from-primary-700/70 via-peach-500/60 to-blush-300/60 text-white">
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
  <footer className="bg-surface-100/90 py-6 text-center text-xs text-neutral-900">
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-3 text-primary-700">
        <span className="icon-circle">IG</span>
        <span className="icon-circle">TT</span>
        <span className="icon-circle">WA</span>
      </div>
      <p>© 2024 Thaís Paganini | Nutrição Feminina</p>
      <p className="text-neutral-600">{footer.note}</p>
    </div>
  </footer>
);

const LandingContent: React.FC<{ onNavigateToCalculator: () => void }> = ({ onNavigateToCalculator }) => (
  <>
    <Hero />
    <Diagnostic />
    <About />
    <Methods onNavigateToCalculator={onNavigateToCalculator} />
    <Story />
    <Benefits />
    <Testimonials />
    <FAQ />
    <FinalCTA />
  </>
);

const App: React.FC = () => {
  const getIsCalculator = React.useCallback(() => {
    return new URLSearchParams(window.location.search).get("page") === "calculadora_gordura";
  }, []);

  const [isCalculator, setIsCalculator] = React.useState<boolean>(getIsCalculator);

  React.useEffect(() => {
    const handlePopState = () => setIsCalculator(getIsCalculator());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [getIsCalculator]);

  const navigateToCalculator = React.useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", "calculadora_gordura");
    window.history.pushState({}, "", url);
    setIsCalculator(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigateHome = React.useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("page");
    const normalized = `${url.pathname}${url.search}${url.hash}`;
    window.history.pushState({}, "", normalized);
    setIsCalculator(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main className="min-h-screen bg-surface-100 text-neutral-900">
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 text-sm font-semibold">
          <button
            type="button"
            onClick={navigateHome}
            className="text-left font-semibold text-neutral-900 transition hover:text-primary-700"
          >
            Thaís Paganini | Nutrição Feminina
          </button>
          <div className="flex items-center gap-3">
            <CTAButton label="Agendar consulta" />
            <CTAButton label="Calcular agora" href="?page=calculadora_gordura" onClick={navigateToCalculator} />
          </div>
        </div>
      </header>
      {isCalculator ? (
        <BodyFatCalculator />
      ) : (
        <LandingContent onNavigateToCalculator={navigateToCalculator} />
      )}
      <Footer />
    </main>
  );
};

export default App;
