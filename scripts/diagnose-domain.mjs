import { readFile } from "node:fs/promises";

const DIST_INDEX_PATH = new URL("../dist/index.html", import.meta.url);

const TARGETS = [
  "https://thaispaganini.onrender.com",
  "https://www.thaispaganini.com.br",
  "https://thaispaganini.com.br",
];

const REDIRECT_STATUSES = new Set([301, 302, 307, 308]);

const getCssAssetPathFromDist = async () => {
  const html = await readFile(DIST_INDEX_PATH, "utf8");
  const cssMatch = html.match(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+\.css)["']/i);

  if (!cssMatch?.[1]) {
    throw new Error("Não foi possível encontrar o CSS asset em dist/index.html.");
  }

  const cssPath = cssMatch[1].trim();
  if (!cssPath.startsWith("/assets/")) {
    throw new Error(`Asset CSS inválido em dist/index.html: ${cssPath}. Esperado /assets/*.css`);
  }

  return cssPath;
};

const toBodyPreview = (text) => text.replace(/\s+/g, " ").slice(0, 80);

const diagnoseEndpoint = async (url) => {
  const response = await fetch(url, { method: "GET", redirect: "manual" });
  const location = response.headers.get("location");
  const contentType = response.headers.get("content-type") ?? "<missing>";

  let preview = "";
  if (!contentType.toLowerCase().startsWith("text/css")) {
    const body = await response.text();
    preview = toBodyPreview(body);
  }

  console.log(`\n[diagnose] ${url}`);
  console.log(`status      : ${response.status}`);
  console.log(`location    : ${location ?? "<none>"}`);
  console.log(`content-type: ${contentType}`);
  if (preview) {
    console.log(`body[0..80] : ${preview}`);
  }

  const hasInvalidRedirect = REDIRECT_STATUSES.has(response.status);
  const hasInvalidContentType = !contentType.toLowerCase().startsWith("text/css");

  return {
    ok: !hasInvalidRedirect && !hasInvalidContentType,
    hasInvalidRedirect,
    hasInvalidContentType,
  };
};

const main = async () => {
  let cssPath;

  try {
    cssPath = await getCssAssetPathFromDist();
  } catch (error) {
    console.error("[diagnose] erro ao ler dist/index.html:", error.message);
    console.error("[diagnose] rode 'npm run build' antes de executar este diagnóstico.");
    process.exit(1);
  }

  console.log(`[diagnose] CSS detectado no build: ${cssPath}`);

  let hasFailures = false;

  for (const baseUrl of TARGETS) {
    const result = await diagnoseEndpoint(`${baseUrl}${cssPath}`);
    if (!result.ok) {
      hasFailures = true;
    }
  }

  if (hasFailures) {
    console.error("\n[diagnose] FALHA: detectado redirect e/ou content-type incorreto para CSS.");
    process.exit(1);
  }

  console.log("\n[diagnose] OK: todos os domínios responderam CSS sem redirects.");
};

main().catch((error) => {
  console.error("[diagnose] erro inesperado:", error);
  process.exit(1);
});
