import http from "node:http";
import { URL } from "node:url";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { google } from "googleapis";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const SPREADSHEET_ID = "1SwN3j3l7MRs57knGUey616wS7_V3pmE2QCKsrbRRBy4";
const SHEET_RANGE = "Leads!A:Q";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
const READONLY_SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
const PAGE_DATA_TIMEOUT_MS = 8_000;
const PAGE_DATA_CACHE_TTL_MS = 60_000;
const ALLOWED_PAGE_SLUGS = new Set(["consulta-online-controle-peso", "controle-metabolico-barra"]);
const PAGE_FIELDS = ["slug", "title", "subtitle", "hero_text", "bullets", "cta_text", "cta_link", "faq_json", "updated_at"];

let sheetsClient;
let pageSheetsClient;
const pageCache = new Map();

const STATIC_DIR = process.env.STATIC_DIR ?? "dist";
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

const loadGoogleCredentials = () => {
  const possiblePaths = ["/etc/secrets/credentials.json", "./credentials.json"];

  for (const credentialsPath of possiblePaths) {
    if (existsSync(credentialsPath)) {
      try {
        const raw = readFileSync(credentialsPath, "utf8");
        const parsed = JSON.parse(raw);
        return {
          ...parsed,
          private_key: typeof parsed.private_key === "string" ? parsed.private_key.replace(/\\n/g, "\n") : parsed.private_key,
        };
      } catch (error) {
        throw new Error("Não foi possível ler as credenciais do Google.");
      }
    }
  }

  throw new Error("Google credentials file not found.");
};

const getSheetsClient = () => {
  if (!sheetsClient) {
    const credentials = loadGoogleCredentials();
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [SCOPES],
    });

    sheetsClient = google.sheets({ version: "v4", auth });
  }

  return sheetsClient;
};

const loadServiceAccountFromEnv = () => {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON não configurado.");
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      private_key: typeof parsed.private_key === "string" ? parsed.private_key.replace(/\\n/g, "\n") : parsed.private_key,
    };
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON inválido.");
  }
};

const getPageSheetsClient = () => {
  if (!pageSheetsClient) {
    const credentials = loadServiceAccountFromEnv();
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [READONLY_SCOPES],
    });

    pageSheetsClient = google.sheets({ version: "v4", auth });
  }

  return pageSheetsClient;
};

const withTimeout = (promise, timeoutMs, timeoutMessage) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    }),
  ]);

const parseBullets = (raw) => {
  if (typeof raw !== "string") return [];
  return raw
    .replace(/\\n/g, "\n")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseFaqJson = (raw) => {
  if (typeof raw !== "string" || !raw.trim()) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const question = typeof item.question === "string" ? item.question.trim() : "";
        const answer = typeof item.answer === "string" ? item.answer.trim() : "";
        if (!question || !answer) return null;
        return { question, answer };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
};

const normalizePagePayload = (rawData) => ({
  slug: rawData.slug,
  title: typeof rawData.title === "string" ? rawData.title : "",
  subtitle: typeof rawData.subtitle === "string" ? rawData.subtitle : "",
  hero_text: typeof rawData.hero_text === "string" ? rawData.hero_text : "",
  bullets: parseBullets(rawData.bullets),
  cta_text: typeof rawData.cta_text === "string" ? rawData.cta_text : "",
  cta_link: typeof rawData.cta_link === "string" ? rawData.cta_link : "",
  faq: parseFaqJson(rawData.faq_json),
  updated_at: typeof rawData.updated_at === "string" ? rawData.updated_at : "",
});

const getPageSpreadsheetId = () => {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_ID não configurado.");
  }

  return spreadsheetId;
};

const fetchPageFromPagesTab = async (slug) => {
  const sheets = getPageSheetsClient();
  const response = await withTimeout(
    sheets.spreadsheets.values.get({
      spreadsheetId: getPageSpreadsheetId(),
      range: "pages!A:I",
    }),
    PAGE_DATA_TIMEOUT_MS,
    "Timeout ao consultar aba pages.",
  );

  const rows = response?.data?.values ?? [];
  if (rows.length === 0) return null;

  const dataRows = rows.slice(1);
  const matched = dataRows.find((row) => normalizePageValue(row?.[0]) === slug);
  if (!matched) return null;

  const rawData = PAGE_FIELDS.reduce((acc, key, index) => {
    acc[key] = matched[index] ?? "";
    return acc;
  }, {});

  return normalizePagePayload(rawData);
};

const fetchPageFromSlugTab = async (slug) => {
  const sheets = getPageSheetsClient();
  const response = await withTimeout(
    sheets.spreadsheets.values.get({
      spreadsheetId: getPageSpreadsheetId(),
      range: `${slug}!A:B`,
    }),
    PAGE_DATA_TIMEOUT_MS,
    `Timeout ao consultar aba ${slug}.`,
  );

  const rows = response?.data?.values ?? [];
  if (rows.length === 0) return null;

  const rawData = rows.reduce(
    (acc, row) => {
      const key = normalizePageValue(row?.[0]);
      if (!key || !PAGE_FIELDS.includes(key)) return acc;
      acc[key] = row?.[1] ?? "";
      return acc;
    },
    { slug },
  );

  return normalizePagePayload(rawData);
};

const resolvePageData = async (slug) => {
  const cached = pageCache.get(slug);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.payload;
  }

  let pagesTabError = null;
  let payload = null;

  try {
    payload = await fetchPageFromPagesTab(slug);
  } catch (error) {
    pagesTabError = error;
    console.warn("Falha ao ler aba pages; tentando fallback por aba individual", error?.message || error);
  }

  if (!payload) {
    try {
      payload = await fetchPageFromSlugTab(slug);
    } catch (fallbackError) {
      const detail = fallbackError?.message || pagesTabError?.message || "Falha na leitura da planilha.";
      throw new Error(detail);
    }
  }

  if (!payload) {
    throw new Error("Conteúdo não encontrado na planilha para o slug informado.");
  }

  pageCache.set(slug, {
    payload,
    expiresAt: Date.now() + PAGE_DATA_CACHE_TTL_MS,
  });

  return payload;
};

const appendLeadToSheet = async (values) => {
  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: SHEET_RANGE,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });
};

const parseJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Payload muito grande."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("JSON inválido."));
      }
    });
    req.on("error", reject);
  });

const normalizePageValue = (value) => {
  const raw = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!raw) return "";
  return raw.replace(/^\/+|\/+$/g, "");
};

const sendJson = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

const validateLead = ({ nome, telefone, sexo, resultado }) => {
  const errors = [];
  const trimmedName = typeof nome === "string" ? nome.trim() : "";

  if (!trimmedName || trimmedName.length < 3) {
    errors.push("nome deve ter ao menos 3 caracteres.");
  }

  if (typeof telefone !== "string" || !/^\d{11}$/.test(telefone)) {
    errors.push("telefone deve conter 11 dígitos (apenas números).");
  }

  const normalizedSexo = typeof sexo === "string" ? sexo.toLowerCase() : "";
  if (!["feminino", "masculino"].includes(normalizedSexo)) {
    errors.push("sexo deve ser 'feminino' ou 'masculino'.");
  }

  const parsedResultado = Number(resultado);
  if (!Number.isFinite(parsedResultado) || parsedResultado < 1 || parsedResultado > 80) {
    errors.push("resultado deve ser um número entre 1 e 80.");
  }

  return { errors, normalized: { nome: trimmedName, telefone, sexo: normalizedSexo, resultado: parsedResultado } };
};



const validateAdsLead = (payload) => {
  const errors = [];
  const nome = typeof payload.nome === "string" ? payload.nome.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const whatsapp = typeof payload.whatsapp === "string" ? payload.whatsapp.replace(/\D/g, "") : "";
  const idade = Number(payload.idade);
  const objetivo = typeof payload.objetivo_principal === "string" ? payload.objetivo_principal.trim() : "";
  const investimento =
    typeof payload.disposicao_investimento === "string" ? payload.disposicao_investimento.trim() : "";
  const origem = typeof payload.origem_rota === "string" ? payload.origem_rota.trim() : "";

  if (nome.length < 3) errors.push("nome deve ter ao menos 3 caracteres.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("email inválido.");
  if (whatsapp.length < 10 || whatsapp.length > 13) errors.push("whatsapp inválido.");
  if (!Number.isInteger(idade) || idade < 18 || idade > 70) errors.push("idade deve ser entre 18 e 70.");
  if (!objetivo) errors.push("objetivo_principal é obrigatório.");
  if (!investimento) errors.push("disposicao_investimento é obrigatório.");
  if (!origem) errors.push("origem_rota é obrigatória.");

  return {
    errors,
    normalized: {
      nome,
      email,
      whatsapp,
      idade,
      objetivo_principal: objetivo,
      disposicao_investimento: investimento,
      origem_rota: origem,
      utm_source: payload.utm_source ?? "",
      utm_campaign: payload.utm_campaign ?? "",
      utm_term: payload.utm_term ?? "",
      utm_medium: payload.utm_medium ?? "",
      utm_content: payload.utm_content ?? "",
      timestamp: payload.timestamp ?? new Date().toISOString(),
    },
  };
};

const serveFile = (res, absolutePath) => {
  if (!existsSync(absolutePath)) return false;

  const ext = extname(absolutePath).toLowerCase();
  const contentType = MIME_TYPES[ext] ?? "application/octet-stream";
  res.statusCode = 200;
  res.setHeader("Content-Type", contentType);
  createReadStream(absolutePath).pipe(res);
  return true;
};

const getIndexFallback = () => {
  const distIndex = join(process.cwd(), STATIC_DIR, "index.html");
  if (existsSync(distIndex)) return distIndex;

  const rootIndex = join(process.cwd(), "index.html");
  if (existsSync(rootIndex)) return rootIndex;

  return null;
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "", `http://${req.headers.host ?? "localhost"}`);

  if (req.method === "GET" && url.pathname === "/health") {
    sendJson(res, 200, { status: "ok" });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/page-data") {
    const slug = normalizePageValue(url.searchParams.get("page"));

    if (!ALLOWED_PAGE_SLUGS.has(slug)) {
      sendJson(res, 400, {
        error: "Parâmetro 'page' inválido.",
        detail: "Use um slug permitido.",
      });
      return;
    }

    try {
      const payload = await resolvePageData(slug);
      sendJson(res, 200, payload);
    } catch (error) {
      console.error("Falha ao carregar page-data", error?.message || error);
      sendJson(res, 502, {
        error: "Falha ao consultar Google Sheets.",
        detail: error?.message || "Erro desconhecido.",
      });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/leads/calculadora-gordura") {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }

    const { errors, normalized } = validateLead(body ?? {});
    if (errors.length > 0) {
      sendJson(res, 400, { error: "Payload inválido.", detalhes: errors });
      return;
    }

    try {
      await appendLeadToSheet([[normalized.nome, normalized.telefone, normalized.sexo, normalized.resultado]]);
      sendJson(res, 201, { status: "ok" });
    } catch (error) {
      console.error("Falha ao salvar lead no Google Sheets", error?.message || error);
      sendJson(res, 500, { error: "Não foi possível registrar o lead." });
    }
    return;
  }



  if (req.method === "POST" && url.pathname === "/api/leads/ads-performance") {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }

    const { errors, normalized } = validateAdsLead(body ?? {});
    if (errors.length > 0) {
      sendJson(res, 400, { error: "Payload inválido.", detalhes: errors });
      return;
    }

    try {
      await appendLeadToSheet([[
        normalized.nome,
        normalized.email,
        normalized.whatsapp,
        normalized.idade,
        normalized.objetivo_principal,
        normalized.disposicao_investimento,
        normalized.origem_rota,
        normalized.utm_source,
        normalized.utm_campaign,
        normalized.utm_term,
        normalized.utm_medium,
        normalized.utm_content,
        normalized.timestamp,
      ]]);
      sendJson(res, 201, { status: "ok" });
    } catch (error) {
      console.error("Falha ao salvar lead Ads", error?.message || error);
      sendJson(res, 500, { error: "Não foi possível registrar o lead." });
    }
    return;
  }

  if (req.method === "GET" && url.pathname === "/link-bio") {
    res.statusCode = 308;
    res.setHeader("Location", "/link-bio");
    res.end();
    return;
  }

  if (req.method === "GET") {
    const staticCandidate = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
    const staticPath = join(process.cwd(), STATIC_DIR, staticCandidate);

    if (serveFile(res, staticPath)) return;

    const fallbackIndex = getIndexFallback();
    if (fallbackIndex) {
      serveFile(res, fallbackIndex);
      return;
    }
  }

  sendJson(res, 404, { error: "Rota não encontrada." });
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
  });
}

export default server;
