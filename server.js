import http from "node:http";
import { URL } from "node:url";
import { createSign } from "node:crypto";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const SPREADSHEET_ID = "1SwN3j3l7MRs57knGUey616wS7_V3pmE2QCKsrbRRBy4";
const SHEET_RANGE = "Leads!A:D";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

const credentialsEnv = process.env.CREDENTIALS;

if (!credentialsEnv) {
  console.warn("Variável de ambiente CREDENTIALS não encontrada. As gravações no Google Sheets falharão.");
}

const parsedCredentials = (() => {
  if (!credentialsEnv) return null;
  try {
    const parsed = JSON.parse(credentialsEnv);
    return {
      ...parsed,
      private_key: typeof parsed.private_key === "string" ? parsed.private_key.replace(/\\n/g, "\n") : parsed.private_key,
    };
  } catch (error) {
    console.error("Não foi possível interpretar as credenciais do Google", error);
    return null;
  }
})();

let cachedToken = { token: "", expiresAt: 0 };

const base64Url = (input) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const fetchAccessToken = async () => {
  if (!parsedCredentials) {
    throw new Error("Credenciais não configuradas.");
  }

  const now = Math.floor(Date.now() / 1000);
  if (cachedToken.token && cachedToken.expiresAt - 60 > now) {
    return cachedToken.token;
  }

  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: parsedCredentials.client_email,
    scope: SCOPES,
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const toEncode = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(toEncode);
  signer.end();
  const signature = signer.sign(parsedCredentials.private_key, "base64");
  const jwt = `${toEncode}.${signature.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")}`;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }).toString(),
  });

  if (!tokenResponse.ok) {
    const message = await tokenResponse.text();
    throw new Error(`Falha ao obter token do Google: ${message}`);
  }

  const tokenJson = await tokenResponse.json();
  cachedToken = {
    token: tokenJson.access_token,
    expiresAt: now + Number(tokenJson.expires_in ?? 0),
  };

  return cachedToken.token;
};

const appendLeadToSheet = async (values) => {
  const accessToken = await fetchAccessToken();
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(
      SHEET_RANGE
    )}:append`
  );
  url.searchParams.set("valueInputOption", "USER_ENTERED");
  url.searchParams.set("insertDataOption", "INSERT_ROWS");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Erro ao registrar lead no Google Sheets: ${message}`);
  }
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

  sendJson(res, 404, { error: "Rota não encontrada." });
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
  });
}

export default server;
