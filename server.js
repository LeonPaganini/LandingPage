import http from "node:http";
import { URL } from "node:url";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { google } from "googleapis";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const SPREADSHEET_ID = "1SwN3j3l7MRs57knGUey616wS7_V3pmE2QCKsrbRRBy4";
const SHEET_RANGE = "Leads!A:D";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

let sheetsClient;

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
