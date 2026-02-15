import { ROUTES, RouteKey, defaultPage } from "./routes";

const PAGE_PARAM = "page";

type SearchLocation = Pick<Location, "search">;

const ALIAS_MAP: Record<string, RouteKey> = {
  "calculadora-gordura": "calculadora_gordura",
  calculadora_gordura: "calculadora_gordura",
  "reset-nutricional": "reset_nutricional",
  reset_nutricional: "reset_nutricional",
  "link-bio": "link_bio",
  link_bio: "link_bio",
  ebooks: "ebooks",
  "controle-metabolico-barra": "controle_metabolico_barra",
  controle_metabolico_barra: "controle_metabolico_barra",
  "consulta-online-controle-peso": "consulta_online_controle_peso",
  consulta_online_controle_peso: "consulta_online_controle_peso",
  home: "home",
};

export const normalizePageValue = (value: string | null): string => {
  const raw = (value ?? "").trim();
  if (!raw) return "";

  const safelyDecoded = (() => {
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  })();

  const trimmed = safelyDecoded.trim().toLowerCase();
  const noGarbage = trimmed.replace(/[?#].*$/, "");
  const noEdgeSlashes = noGarbage.replace(/^\/+|\/+$/g, "");

  return noEdgeSlashes;
};

const resolveCanonicalPageKey = (pageValue: string): RouteKey | null => {
  if (!pageValue) return null;

  const directAlias = ALIAS_MAP[pageValue];
  if (directAlias) return directAlias;

  const hyphenVariant = pageValue.replace(/_/g, "-");
  if (ALIAS_MAP[hyphenVariant]) return ALIAS_MAP[hyphenVariant];

  const underscoreVariant = pageValue.replace(/-/g, "_");
  if (ALIAS_MAP[underscoreVariant]) return ALIAS_MAP[underscoreVariant];

  if (pageValue in ROUTES) {
    return pageValue as RouteKey;
  }

  return null;
};

export const getCurrentPageKey = (locationLike: SearchLocation = window.location): RouteKey => {
  const params = new URLSearchParams(locationLike.search);
  const raw = params.get(PAGE_PARAM);
  const normalized = normalizePageValue(raw);
  const canonical = resolveCanonicalPageKey(normalized);

  if (!canonical || !(canonical in ROUTES)) {
    return defaultPage;
  }

  return canonical;
};

export const getHref = (pageKey: RouteKey, currentLocation: Location = window.location): string => {
  if (!(pageKey in ROUTES)) {
    throw new Error(`Invalid route key: ${pageKey}`);
  }

  const nextUrl = new URL(currentLocation.href);
  nextUrl.pathname = "/";
  const queryPageValue =
    pageKey === "controle_metabolico_barra"
      ? "controle-metabolico-barra"
      : pageKey === "consulta_online_controle_peso"
        ? "consulta-online-controle-peso"
        : pageKey;
  nextUrl.searchParams.set(PAGE_PARAM, queryPageValue);

  return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
};

export const navigateTo = (pageKey: RouteKey): void => {
  if (!(pageKey in ROUTES)) {
    throw new Error(`Invalid route key: ${pageKey}`);
  }

  const nextHref = getHref(pageKey);
  window.history.pushState({}, "", nextHref);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const resolvePageKeyFromString = (
  routeOrUrl: string,
  base: Location = window.location,
): RouteKey => {
  try {
    const parsed = new URL(routeOrUrl, base.origin);
    return getCurrentPageKey(parsed as unknown as SearchLocation);
  } catch {
    return getCurrentPageKey(base);
  }
};
