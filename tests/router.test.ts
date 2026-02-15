import test from "node:test";
import assert from "node:assert/strict";
import { buildUrlForRoute, getRouteHref, normalizeAndResolveRoute, resolveRouteFromString } from "../src/lib/router.js";

type MockLocation = Pick<Location, "pathname" | "search" | "origin" | "href" | "hash">;

const buildLocation = (pathname: string, search = ""): MockLocation => {
  const origin = "http://localhost:5173";
  const hash = "";
  return {
    pathname,
    search,
    origin,
    href: `${origin}${pathname}${search}${hash}`,
    hash,
  };
};

test("normalizeAndResolveRoute reconhece /controle-metabolico-barra", () => {
  const location = buildLocation("/controle-metabolico-barra");
  assert.equal(normalizeAndResolveRoute(location as Location), "controle-metabolico-barra");
});

test("normalizeAndResolveRoute reconhece /consulta-online-controle-peso", () => {
  const location = buildLocation("/consulta-online-controle-peso");
  assert.equal(normalizeAndResolveRoute(location as Location), "consulta-online-controle-peso");
});

test("resolveRouteFromString reconhece as duas URLs completas", () => {
  const base = buildLocation("/");

  assert.equal(
    resolveRouteFromString("http://localhost:5173/controle-metabolico-barra", base as Location),
    "controle-metabolico-barra",
  );
  assert.equal(
    resolveRouteFromString("http://localhost:5173/consulta-online-controle-peso", base as Location),
    "consulta-online-controle-peso",
  );
});

test("buildUrlForRoute gera canonical query routes para páginas internas", () => {
  const location = buildLocation("/qualquer", "?utm_source=google");

  assert.equal(
    getRouteHref("controle-metabolico-barra", location as Location),
    "/?utm_source=google&page=controle-metabolico-barra",
  );
  assert.equal(
    getRouteHref("consulta-online-controle-peso", location as Location),
    "/?utm_source=google&page=consulta-online-controle-peso",
  );
  assert.equal(getRouteHref("home", location as Location), "/?utm_source=google");

  const calculator = buildUrlForRoute("calculator", location as Location);
  assert.equal(calculator.pathname, "/");
  assert.equal(calculator.searchParams.get("page"), "calculadora-gordura");
});


test("normalizeAndResolveRoute aceita legacy underscores nas rotas de ads", () => {
  const controle = buildLocation("/", "?page=controle_metabolico_barra");
  const consulta = buildLocation("/", "?page=consulta_online_controle_peso");

  assert.equal(normalizeAndResolveRoute(controle as Location), "controle-metabolico-barra");
  assert.equal(normalizeAndResolveRoute(consulta as Location), "consulta-online-controle-peso");
});

test("normalizeAndResolveRoute reconhece /index.html das rotas", () => {
  const location = buildLocation("/controle-metabolico-barra/index.html");
  assert.equal(normalizeAndResolveRoute(location as Location), "controle-metabolico-barra");
});


test("normalizeAndResolveRoute normaliza variações de page para ads + preserva UTM", () => {
  const withLeadingAndTrailingSlash = buildLocation("/", "?page=/controle-metabolico-barra/");
  const withCanonical = buildLocation("/", "?page=controle-metabolico-barra");
  const withUtm = buildLocation("/", "?page=controle-metabolico-barra&utm_source=google");
  const consulta = buildLocation("/", "?page=consulta-online-controle-peso");

  assert.equal(normalizeAndResolveRoute(withLeadingAndTrailingSlash as Location), "controle-metabolico-barra");
  assert.equal(normalizeAndResolveRoute(withCanonical as Location), "controle-metabolico-barra");
  assert.equal(normalizeAndResolveRoute(withUtm as Location), "controle-metabolico-barra");
  assert.equal(normalizeAndResolveRoute(consulta as Location), "consulta-online-controle-peso");
});

test("normalizeAndResolveRoute remove sufixo colado inválido no parâmetro page", () => {
  const withHashSuffix = buildLocation("/", "?page=controle-metabolico-barra%23x");
  assert.equal(normalizeAndResolveRoute(withHashSuffix as Location), "controle-metabolico-barra");
});
