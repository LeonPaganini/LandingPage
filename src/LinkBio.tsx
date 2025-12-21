import React from "react";
import { CTAButton, GlassCard } from "./ui/Primitives.js";
import {
  LINK_BIO_HERO,
  LINK_BIO_PROFILE,
  LINK_BIO_SECTIONS,
  LinkBioItem,
  WHATSAPP_CONFIG,
} from "./data/linkBioConfig";

const buildWhatsappUrl = (message?: string) => {
  const phone = WHATSAPP_CONFIG.phone.replace(/\D/g, "");
  const text = encodeURIComponent(message || WHATSAPP_CONFIG.default_message);
  return `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
};

const IconCircle: React.FC<{ icon?: string }> = ({ icon }) => (
  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 text-lg text-primary-700 shadow-inner">
    {icon || "→"}
  </div>
);

const LinkBioCard: React.FC<{
  item: LinkBioItem;
  onInternalNavigate: (route: string) => void;
}> = ({ item, onInternalNavigate }) => {
  const isWhatsapp = item.action_type === "whatsapp";
  const isExternal = item.action_type === "external" || isWhatsapp;
  const href = isWhatsapp
    ? buildWhatsappUrl(item.whatsappMessage)
    : item.route_or_url || undefined;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.action_type === "internal") {
      event.preventDefault();
      onInternalNavigate(item.route_or_url);
    }
  };

  const cardClasses = `glass-card flex items-center gap-4 rounded-2xl p-4 transition focus:outline-none focus:ring-2 focus:ring-primary-700/60 hover:-translate-y-0.5 active:translate-y-0 ${
    item.highlight ? "border-primary-500/60 shadow-xl" : "border-white/80"
  }`;

  return (
    <a
      className={cardClasses}
      href={href}
      onClick={handleClick}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      aria-label={item.label}
    >
      <IconCircle icon={item.icon} />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-neutral-900">{item.label}</p>
          {item.badge && (
            <span className="rounded-full border border-primary-200 bg-primary-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary-800">
              {item.badge}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-sm text-neutral-700">{item.description}</p>
        )}
        {item.ctaLabel && (
          <p className="mt-1 text-sm font-semibold text-primary-700">{item.ctaLabel}</p>
        )}
      </div>
      <span className="text-lg text-primary-700" aria-hidden>
        {isExternal ? "↗" : "→"}
      </span>
    </a>
  );
};

const LinkBio: React.FC<{
  onNavigateHome: () => void;
  onInternalRoute: (route: string) => void;
}> = ({ onNavigateHome, onInternalRoute }) => {
  const sortedSections = React.useMemo(
    () =>
      LINK_BIO_SECTIONS.map((section) => ({
        ...section,
        items: [...section.items].sort((a, b) => a.priority - b.priority),
      })),
    [],
  );

  const handleInternal = (route: string) => {
    onInternalRoute(route);
  };

  const heroCtaHref = buildWhatsappUrl();

  return (
    <div className="min-h-screen bg-surface-100 text-neutral-900">
      <section className="linkbio-hero relative isolate overflow-visible px-5 pt-16 pb-12">
        <div className="linkbio-hero__bg absolute inset-0 -z-10" aria-hidden />

        <div className="linkbio-hero__content mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="linkbio-hero__stack">
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

            <GlassCard className="hero-glass w-full px-6 py-8 text-center text-neutral-900 md:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700/80">
                {LINK_BIO_PROFILE.subtitle}
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight text-neutral-900 md:text-4xl">
                {LINK_BIO_HERO.headline}
              </h1>
              <p className="mt-3 text-base text-neutral-700">{LINK_BIO_HERO.subheadline}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
                <CTAButton label={LINK_BIO_HERO.ctaLabel} href={heroCtaHref} />
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="rounded-full border border-primary-700/60 px-5 py-3 text-sm font-semibold text-primary-800 transition hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-primary-700/40"
                >
                  Voltar para página inicial
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-xl flex-col gap-6 px-5 pb-16">
        <div className="text-center">
          <h2 className="mt-2 text-2xl font-bold text-neutral-900 md:text-3xl">{LINK_BIO_PROFILE.name}</h2>
          <p className="mt-1 text-base text-neutral-700">{LINK_BIO_PROFILE.subtitle}</p>
        </div>

        {sortedSections.map((section) => (
          <div key={section.title} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-primary-500/60 to-transparent" />
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-800">
                {section.title}
              </p>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-primary-500/60 to-transparent" />
            </div>
            {section.badge && (
              <div className="flex justify-center">
                <span className="rounded-full border border-primary-200 bg-primary-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary-800">
                  {section.badge}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {section.items.map((item) => (
                <LinkBioCard key={item.label} item={item} onInternalNavigate={handleInternal} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default LinkBio;
