import React from "react";
import BodyFatCalculator from "./Calculator";
import ResetNutricionalPage from "./ResetNutricional.js";
import LinkBio from "./LinkBio.js";
import EbooksPage from "./Ebooks.js";
import AdsLandingPage from "./AdsLandingPage";
import HomeOriginal from "./ui/HomeOriginal";
import { CTAButton } from "./ui/Primitives.js";
import { getCurrentPageKey, getHref, navigateTo, resolvePageKeyFromString } from "./lib/queryRouter.js";
import { ROUTES, RouteKey } from "./lib/routes.js";
import { footer } from "./data/content";
import { getLandingCopy } from "./data/landingCopy";
import {
  getWhatsappHrefForCta,
  hasWhatsappMessageForCta,
  openWhatsappForCta,
} from "./lib/whatsapp.js";

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



const ADS_ROUTE_KEYS: RouteKey[] = ["controle_metabolico_barra", "consulta_online_controle_peso"];

const getCanonicalHrefForRoute = (routeKey: RouteKey): string => {
  if (routeKey === "home") return `${window.location.origin}/`;

  const canonicalPage =
    routeKey === "controle_metabolico_barra"
      ? "controle-metabolico-barra"
      : routeKey === "consulta_online_controle_peso"
        ? "consulta-online-controle-peso"
        : routeKey;

  return `${window.location.origin}/?page=${canonicalPage}`;
};

const App: React.FC = () => {
  const [currentPageKey, setCurrentPageKey] = React.useState<RouteKey>(() => getCurrentPageKey());

  const syncRouteFromLocation = React.useCallback(() => {
    setCurrentPageKey(getCurrentPageKey());
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
      calculator: getHref("calculadora_gordura"),
      reset: getHref("reset_nutricional"),
      ebooks: getHref("ebooks"),
    }),
    [currentPageKey],
  );

  const navigateToCalculator = React.useCallback(() => {
    navigateTo("calculadora_gordura");
  }, []);

  const navigateToReset = React.useCallback(() => {
    navigateTo("reset_nutricional");
  }, []);

  const navigateToEbooks = React.useCallback(() => {
    navigateTo("ebooks");
  }, []);

  const navigateToLinkBio = React.useCallback(() => {
    navigateTo("link_bio");
  }, []);

  const navigateToControleMetabolicoBarra = React.useCallback(() => {
    navigateTo("controle_metabolico_barra");
  }, []);

  const navigateToConsultaOnlineControlePeso = React.useCallback(() => {
    navigateTo("consulta_online_controle_peso");
  }, []);

  const navigateHome = React.useCallback(() => {
    navigateTo("home");
  }, []);

  const getWhatsappHref = React.useCallback(
    (label: string) => getWhatsappHrefForCta(label, currentPageKey),
    [currentPageKey],
  );

  const handleWhatsappClick = React.useCallback(
    (label: string) => openWhatsappForCta(label, currentPageKey),
    [currentPageKey],
  );

  const isWhatsappCta = React.useCallback(
    (label: string) => hasWhatsappMessageForCta(label, currentPageKey),
    [currentPageKey],
  );

  React.useEffect(() => {
    const routeConfig = ROUTES[currentPageKey];
    document.title = routeConfig.title;

    if (routeConfig.seo?.description) {
      let descriptionMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!descriptionMeta) {
        descriptionMeta = document.createElement("meta");
        descriptionMeta.setAttribute("name", "description");
        document.head.appendChild(descriptionMeta);
      }
      descriptionMeta.setAttribute("content", routeConfig.seo.description);
    }

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", getCanonicalHrefForRoute(currentPageKey));

    const isAdsPage = ADS_ROUTE_KEYS.includes(currentPageKey);
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;

    if (isAdsPage) {
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta");
        robotsMeta.setAttribute("name", "robots");
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute("content", "noindex, nofollow");
      return;
    }

    if (robotsMeta) {
      robotsMeta.remove();
    }
  }, [currentPageKey]);

  const handleInternalRoute = React.useCallback(
    (route: string) => {
      const targetRoute = resolvePageKeyFromString(route);

      switch (targetRoute) {
        case "calculadora_gordura":
          navigateToCalculator();
          return;
        case "reset_nutricional":
          navigateToReset();
          return;
        case "ebooks":
          navigateToEbooks();
          return;
        case "link_bio":
          navigateToLinkBio();
          return;
        case "controle_metabolico_barra":
          navigateToControleMetabolicoBarra();
          return;
        case "consulta_online_controle_peso":
          navigateToConsultaOnlineControlePeso();
          return;
        case "home":
        default:
          navigateHome();
          return;
      }
    },
    [
      navigateHome,
      navigateToCalculator,
      navigateToConsultaOnlineControlePeso,
      navigateToControleMetabolicoBarra,
      navigateToEbooks,
      navigateToLinkBio,
      navigateToReset,
    ],
  );

  const renderCurrentPage = React.useCallback(() => {
    const sharedHomeProps = {
      onNavigateToCalculator: navigateToCalculator,
      onNavigateToReset: navigateToReset,
      calculatorHref: routeHrefs.calculator,
      resetHref: routeHrefs.reset,
      onWhatsappClick: handleWhatsappClick,
      isWhatsappCta,
      getWhatsappHref,
    };

    const context = {
      renderHome: () => <HomeOriginal {...sharedHomeProps} />,
      renderCalculadoraGordura: () => <BodyFatCalculator />,
      renderResetNutricional: () => <ResetNutricionalPage onNavigateHome={navigateHome} />,
      renderLinkBio: () => <LinkBio onNavigateHome={navigateHome} onInternalRoute={handleInternalRoute} />,
      renderEbooks: () => <EbooksPage onNavigateHome={navigateHome} />,
      renderControleMetabolicoBarra: () => <AdsLandingPage routeKey="controle_metabolico_barra" {...sharedHomeProps} />,
      renderConsultaOnlineControlePeso: () => (
        <AdsLandingPage routeKey="consulta_online_controle_peso" {...sharedHomeProps} />
      ),
    };

    return ROUTES[currentPageKey].render(context);
  }, [
    currentPageKey,
    getWhatsappHref,
    handleInternalRoute,
    handleWhatsappClick,
    isWhatsappCta,
    navigateHome,
    navigateToCalculator,
    navigateToReset,
    routeHrefs.calculator,
    routeHrefs.reset,
  ]);

  const headerVariant =
    currentPageKey === "controle_metabolico_barra"
      ? "presencial"
      : currentPageKey === "consulta_online_controle_peso"
        ? "online"
        : "default";
  const headerCtaLabel = getLandingCopy(headerVariant).headerCtaLabel;

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
            <CTAButton
              label={headerCtaLabel}
              href={getWhatsappHref(headerCtaLabel)}
              onClick={() => handleWhatsappClick(headerCtaLabel)}
            />
          </div>
        </div>
      </header>
      {renderCurrentPage()}
      <Footer />
    </main>
  );
};

export default App;
