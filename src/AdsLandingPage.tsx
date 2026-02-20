import React from "react";
import { RouteKey } from "./lib/routes";
import HomePage from "./ui/HomePage";

type AdsLandingRouteKey = Extract<RouteKey, "controle_metabolico_barra" | "consulta_online_controle_peso">;

type AdsLandingPageProps = {
  routeKey: AdsLandingRouteKey;
  onNavigateToCalculator: () => void;
  onNavigateToReset: () => void;
  calculatorHref: string;
  resetHref: string;
  onWhatsappClick: (label: string) => void;
  isWhatsappCta: (label: string) => boolean;
  getWhatsappHref: (label: string) => string;
};

const AdsLandingPage: React.FC<AdsLandingPageProps> = ({ routeKey, ...props }) => {
  const variant = routeKey === "controle_metabolico_barra" ? "presencial" : "online";

  return <HomePage variant={variant} {...props} />;
};

export default AdsLandingPage;
