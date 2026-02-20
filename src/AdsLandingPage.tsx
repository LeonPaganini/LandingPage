import React from "react";
import { RouteKey } from "./lib/routes";
import AdsLandingExperience from "./ui/AdsLandingExperience";

type AdsLandingRouteKey = Extract<RouteKey, "controle_metabolico_barra" | "consulta_online_controle_peso">;

type AdsLandingPageProps = {
  routeKey: AdsLandingRouteKey;
};

const AdsLandingPage: React.FC<AdsLandingPageProps> = ({ routeKey }) => {
  const variant = routeKey === "controle_metabolico_barra" ? "presencial" : "online";

  return <AdsLandingExperience variant={variant} />;
};

export default AdsLandingPage;
