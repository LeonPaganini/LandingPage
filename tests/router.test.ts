import test from "node:test";
import assert from "node:assert/strict";
import { getCurrentPageKey, getHref, normalizePageValue, resolvePageKeyFromString } from "../src/lib/queryRouter.js";

type MockLocation = Pick<Location, "search" | "origin" | "href" | "hash">;

const buildLocation = (search = ""): MockLocation => {
  const origin = "http://localhost:5173";
  const hash = "";
  return {
    search,
    origin,
    href: `${origin}/${search}${hash}`,
    hash,
  };
};

test("getCurrentPageKey usa fallback para defaultPage quando page é inválido", () => {
  const location = buildLocation("?page=inexistente");
  assert.equal(getCurrentPageKey(location as Location), "home");
});

test("getCurrentPageKey resolve páginas canônicas via query string", () => {
  assert.equal(getCurrentPageKey(buildLocation("?page=calculadora_gordura") as Location), "calculadora_gordura");
  assert.equal(
    getCurrentPageKey(buildLocation("?page=controle_metabolico_barra") as Location),
    "controle_metabolico_barra",
  );
});

test("getCurrentPageKey resolve aliases com hífen", () => {
  assert.equal(getCurrentPageKey(buildLocation("?page=calculadora-gordura") as Location), "calculadora_gordura");
  assert.equal(getCurrentPageKey(buildLocation("?page=link-bio") as Location), "link_bio");
  assert.equal(
    getCurrentPageKey(buildLocation("?page=consulta-online-controle-peso") as Location),
    "consulta_online_controle_peso",
  );
});

test("normalizePageValue limpa espaços, barras e lixo de hash/query", () => {
  assert.equal(normalizePageValue(" /controle-metabolico-barra/ "), "controle-metabolico-barra");
  assert.equal(normalizePageValue("reset_nutricional#abc"), "reset_nutricional");
  assert.equal(normalizePageValue("consulta_online_controle_peso?x=1"), "consulta_online_controle_peso");
});

test("getHref preserva UTMs e atualiza somente page", () => {
  const location = {
    href: "http://localhost:5173/?utm_source=google&gclid=123&page=home",
    search: "?utm_source=google&gclid=123&page=home",
    origin: "http://localhost:5173",
    hash: "",
  };

  assert.equal(
    getHref("controle_metabolico_barra", location as Location),
    "/?utm_source=google&gclid=123&page=controle_metabolico_barra",
  );
});

test("resolvePageKeyFromString resolve URL absoluta e fallback", () => {
  const base = buildLocation("?page=home");

  assert.equal(
    resolvePageKeyFromString("http://localhost:5173/?page=reset-nutricional", base as Location),
    "reset_nutricional",
  );
  assert.equal(resolvePageKeyFromString("url-inválida", base as Location), "home");
});
