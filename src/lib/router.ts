export type RouteKey =
  | "home"
  | "calculator"
  | "reset-nutricional"
  | "link-bio"
  | "ebooks"
  | "controle-metabolico-barra"
  | "consulta-online-controle-peso";

const PAGE_PARAM = "page";

const canonicalPageByRoute: Record<Exclude<RouteKey, "home">, string> = {
  calculator: "calculadora-gordura",
  "reset-nutricional": "reset-nutricional",
  "link-bio": "link-bio",
  ebooks: "ebooks",
  "controle-metabolico-barra": "controle-metabolico-barra",
  "consulta-online-controle-peso": "consulta-online-controle-peso",
};

const normalizePathname = (pathname: string): string => {
  const trimmed = pathname.replace(/\/$/, "");
  return trimmed === "" ? "/" : trimmed.toLowerCase();
};

const normalizePageValue = (value: string | null): string =>
  (value ?? "").trim().toLowerCase().replace(/_/g, "-");

const pageParamRoutes: Record<string, RouteKey> = {
  "calculadora-gordura": "calculator",
  "calculadora_gordura": "calculator", // legacy underscore support
  "reset-nutricional": "reset-nutricional",
  "reset_nutricional": "reset-nutricional",
  "link-bio": "link-bio",
  "link_bio": "link-bio",
  ebooks: "ebooks",
  "controle-metabolico-barra": "controle-metabolico-barra",
  "consulta-online-controle-peso": "consulta-online-controle-peso",
  home: "home",
};

const pathRoutes: Record<string, RouteKey> = {
  "/": "home",
  "/calculadora-gordura": "calculator",
  "/reset-nutricional": "reset-nutricional",
  "/link-bio": "link-bio",
  "/link_bio": "link-bio",
  "/ebooks": "ebooks",
  "/controle-metabolico-barra": "controle-metabolico-barra",
  "/consulta-online-controle-peso": "consulta-online-controle-peso",
};

export const resolveRoute = (locationLike: Location): RouteKey => {
  const params = new URLSearchParams(locationLike.search);
  const normalizedPage = normalizePageValue(params.get(PAGE_PARAM));

  if (normalizedPage && normalizedPage in pageParamRoutes) {
    return pageParamRoutes[normalizedPage];
  }

  const normalizedPath = normalizePathname(locationLike.pathname);
  if (normalizedPath in pathRoutes) {
    return pathRoutes[normalizedPath];
  }

  return "home";
};

export const buildUrlForRoute = (route: RouteKey, currentLocation: Location = window.location): URL => {
  const url = new URL(currentLocation.href);
  url.hash = currentLocation.hash;

  url.pathname = "/";

  if (route === "home") {
    url.searchParams.delete(PAGE_PARAM);
    return url;
  }

  url.searchParams.set(PAGE_PARAM, canonicalPageByRoute[route]);

  return url;
};

export const getRouteHref = (route: RouteKey, currentLocation: Location = window.location): string => {
  const url = buildUrlForRoute(route, currentLocation);
  return `${url.pathname}${url.search}${url.hash}`;
};

export const navigateToRoute = (
  route: RouteKey,
  options?: { replace?: boolean; scroll?: boolean },
): void => {
  const url = buildUrlForRoute(route);
  const method = options?.replace ? "replaceState" : "pushState";
  window.history[method]({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));

  if (options?.scroll !== false) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

export const normalizeAndResolveRoute = (locationLike: Location = window.location): RouteKey => {
  const route = resolveRoute(locationLike);
  const canonicalUrl = buildUrlForRoute(route, locationLike);
  const isSamePath =
    canonicalUrl.pathname === locationLike.pathname && canonicalUrl.search === locationLike.search;

  if (!isSamePath) {
    if (typeof window !== "undefined" && window.history && locationLike === window.location) {
      window.history.replaceState({}, "", canonicalUrl);
    }
  }

  return route;
};

export const resolveRouteFromString = (routeOrUrl: string, base: Location = window.location): RouteKey => {
  try {
    const parsed = new URL(routeOrUrl, `${base.origin}`);
    return resolveRoute(parsed as Location);
  } catch (error) {
    return resolveRoute(base);
  }
};
