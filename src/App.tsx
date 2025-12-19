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
import ResetNutricionalPage from "./ResetNutricional.js";
import LinkBio from "./LinkBio.js";
import { Badge, CTAButton, GlassCard, SectionTitle, SectionWave } from "./ui/Primitives.js";
import {
  RouteKey,
  getRouteHref,
  navigateToRoute,
  normalizeAndResolveRoute,
  resolveRouteFromString,
} from "./lib/router.js";
import { LINK_BIO_HERO, LINK_BIO_PROFILE } from "./data/linkBioConfig";

const Hero: React.FC = () => {
  return (
    <section className="home-hero relative isolate overflow-hidden bg-bgBase px-6 pt-20 pb-16 md:pt-24 md:pb-24">
      <div className="home-hero__bg absolute inset-0 -z-10 overflow-hidden">
        <img
          src={hero.image}
          alt=""
          className="home-hero__bg-img"
          loading="lazy"
          aria-hidden
        />
        <div className="home-hero__bg-overlay" />
      </div>
      <div className="home-hero__grid relative mx-auto max-w-6xl">
          <div className="home-hero__mobile-portrait">
            <div className="hero-image-layer">
              <div className="hero-image-wrapper">
                <img
                  src={LINK_BIO_HERO.photo}
                  alt={LINK_BIO_PROFILE.name}
                  className="hero-image"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

        <div className="home-hero__content">
          <GlassCard className="home-hero__card w-full border-white/60 px-8 py-10 text-left">
            <div className="flex flex-wrap items-center justify-between gap-4 text-white/90">
              <p className="text-sm font-semibold uppercase tracking-[0.2em]">Nutrição Acolhedora</p>
              <div className="flex gap-2 text-xs text-white/80" />
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
      </div>
    </section>
  );
};

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
                  className={`group flex items-start gap-3 rounded-xl border border-transparent bg-white/40 p-3 text-left transition ease-out focus:outline-none focus:ring-2 focus:ring-primary-700/60 ${
                    isSelected ? "selected-item" : "hover:bg-white/60 hover:border-white/70"
                  }`}
                >
                  <span
                    className={`icon-circle text-lg transition-colors ${
                      isSelected ? "bg-[var(--deep-forest)] text-white shadow-md" : ""
                    }`}
                  >
                    ✓
                  </span>
                  <p
                    className={`card-text text-base transition-colors ${
                      isSelected ? "font-semibold text-[var(--deep-forest)]" : ""
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

const About: React.FC = () => {
  const aboutMobilePosition = about.imagePositionMobile ?? "40% 40%";
  const aboutDesktopPosition = about.imagePositionDesktop ?? "45% 35%";

  return (
    <SectionWave className="bg-white/70">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle label={about.title} />
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
          <div className="h-64 overflow-hidden rounded-3xl shadow-2xl md:h-80 lg:h-96">
            <img
              src={about.image}
              alt=""
              className={`h-full w-full object-cover md:object-[var(--about-desktop-position)]`}
              style={{
                objectPosition: aboutMobilePosition,
                ["--about-desktop-position" as string]: aboutDesktopPosition,
              }}
            />
          </div>
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
              <CTAButton label="Quero emagrecer de forma leve" />
              <button className="rounded-full border border-neutral-900/10 px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:-translate-y-0.5 hover:bg-peach-500/40">
                Quero saber mais
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </SectionWave>
  );
};

const Methods: React.FC<{
  onNavigateToCalculator: () => void;
  onNavigateToReset: () => void;
  calculatorHref: string;
  resetHref: string;
}> = ({ onNavigateToCalculator, onNavigateToReset, calculatorHref, resetHref }) => (
  <SectionWave className="bg-gradient-to-b from-peach-500/40 via-surface-100 to-white">
    <div className="mx-auto max-w-6xl px-6">
      <SectionTitle label="Métodos & Programas" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((program) => {
          const goToCalculator = program.cta.toLowerCase().includes("calcular");
          const isReset = program.title.toLowerCase().includes("reset nutricional");
          return (
            <GlassCard key={program.title} className="p-6 transition hover:-translate-y-1">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="card-title">{program.title}</p>
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
                    href={goToCalculator ? calculatorHref : isReset ? resetHref : undefined}
                    onClick={
                      goToCalculator
                        ? onNavigateToCalculator
                        : isReset
                          ? onNavigateToReset
                          : undefined
                    }
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
          <GlassCard
            key={item.name}
            className="min-w-[260px] max-w-sm flex-1 p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
              <div className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary-300 via-peach-500/80 to-blush-300 p-[2px] sm:h-16 sm:w-16">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full rounded-full object-cover bg-surface-100"
                />
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-sm italic text-neutral-900">“{item.text}”</p>
                <div className="text-sm font-semibold text-neutral-600">{item.name}</div>
                <div className="inline-flex rounded-full bg-surface-100/60 px-3 py-1 text-xs font-semibold text-neutral-900">
                  {item.tag}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  </SectionWave>
);

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = React.useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <SectionWave className="bg-gradient-to-b from-blush-300/30 via-surface-100 to-white">
      <div className="mx-auto max-w-5xl px-6">
        <SectionTitle label="Perguntas frequentes" />
        <div className="grid gap-4 md:grid-cols-2">
          {faq.map((item, index) => {
            const isOpen = openItems.has(index);
            const contentId = `faq-answer-${index}`;
            return (
              <div
                key={item.q}
                className="rounded-xl border border-white/70 bg-white/70 p-3 shadow-sm backdrop-blur"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggleItem(index)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1 text-left transition-colors hover:bg-white/70"
                >
                  <span className="text-base font-semibold text-neutral-900">{item.q}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-100 text-neutral-900 shadow-inner">
                    <svg
                      className={`h-5 w-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.5 7.5L10 12l4.5-4.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  id={contentId}
                  role="region"
                  className={`overflow-hidden text-sm text-neutral-600 transition-all duration-300 ease-in-out ${
                    isOpen ? "mt-2 max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="rounded-lg bg-white/70 px-2 py-2 leading-relaxed">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWave>
  );
};

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

const LandingContent: React.FC<{
  onNavigateToCalculator: () => void;
  onNavigateToReset: () => void;
  calculatorHref: string;
  resetHref: string;
}> = ({ onNavigateToCalculator, onNavigateToReset, calculatorHref, resetHref }) => (
  <>
    <Hero />
    <Diagnostic />
    <About />
    <Methods
      onNavigateToCalculator={onNavigateToCalculator}
      onNavigateToReset={onNavigateToReset}
      calculatorHref={calculatorHref}
      resetHref={resetHref}
    />
    <Story />
    <Benefits />
    <Testimonials />
    <FAQ />
    <FinalCTA />
  </>
);

const App: React.FC = () => {
  const [activePage, setActivePage] = React.useState<RouteKey>(() => normalizeAndResolveRoute());

  const syncRouteFromLocation = React.useCallback(() => {
    setActivePage(normalizeAndResolveRoute());
  }, []);

  React.useEffect(() => {
    const handlePopState = () => {
      syncRouteFromLocation();
    };

    syncRouteFromLocation();

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [syncRouteFromLocation]);

  const routeHrefs = React.useMemo(
    () => ({
      calculator: getRouteHref("calculator"),
      reset: getRouteHref("reset-nutricional"),
    }),
    [activePage],
  );

  const navigateToCalculator = React.useCallback(() => {
    navigateToRoute("calculator");
    setActivePage("calculator");
  }, []);

  const navigateToReset = React.useCallback(() => {
    navigateToRoute("reset-nutricional");
    setActivePage("reset-nutricional");
  }, []);

  const navigateToLinkBio = React.useCallback(() => {
    navigateToRoute("link-bio");
    setActivePage("link-bio");
  }, []);

  const navigateHome = React.useCallback(() => {
    navigateToRoute("home");
    setActivePage("home");
  }, []);

  const handleInternalRoute = React.useCallback(
    (route: string) => {
      const targetRoute = resolveRouteFromString(route);

      switch (targetRoute) {
        case "calculator":
          navigateToCalculator();
          return;
        case "reset-nutricional":
          navigateToReset();
          return;
        case "link-bio":
          navigateToLinkBio();
          return;
        case "home":
        default:
          navigateHome();
          return;
      }
    },
    [navigateHome, navigateToCalculator, navigateToLinkBio, navigateToReset],
  );

  return (
    <main className="min-h-screen bg-surface-100 text-neutral-900">
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 text-sm font-semibold">
          <button
            type="button"
            onClick={navigateHome}
            className="text-left font-semibold text-neutral-900 transition hover:text-primary-700"
          >
            Thais Paganini | Nutrição Acolhedora
          </button>
          <div className="flex items-center gap-3">
            <CTAButton label="Agendar consulta" />
            <CTAButton
              label="Calcular agora"
              href={routeHrefs.calculator}
              onClick={navigateToCalculator}
            />
          </div>
        </div>
      </header>
      {activePage === "calculator" && <BodyFatCalculator />}
      {activePage === "link-bio" && (
        <LinkBio
          onNavigateHome={navigateHome}
          onInternalRoute={handleInternalRoute}
        />
      )}
      {activePage === "home" && (
        <LandingContent
          onNavigateToCalculator={navigateToCalculator}
          onNavigateToReset={navigateToReset}
          calculatorHref={routeHrefs.calculator}
          resetHref={routeHrefs.reset}
        />
      )}
      {activePage === "reset-nutricional" && <ResetNutricionalPage onNavigateHome={navigateHome} />}
      <Footer />
    </main>
  );
};

export default App;
