import "dotenv/config";
import path from "node:path";
import fs from "node:fs";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import express from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { leadSchema } from "./validation/leadSchema.js";
import { appendLead, listLeads } from "./storage/leadsStore.js";
import { notifyTelegramLead } from "./notify/telegram.js";

const app = express();

// Default ports (dev):
// - frontend: 3000
// - backend:  3001
const PORT = Number(process.env.PORT ?? 3001);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";
const IS_DEV = process.env.NODE_ENV !== "production";

app.set("trust proxy", 1);
app.disable("x-powered-by");
// NOTE: We currently deploy over plain HTTP (IP:PORT). Helmet's default CSP includes
// `upgrade-insecure-requests`, which forces the browser to upgrade JS/CSS/image requests to HTTPS,
// causing `net::ERR_SSL_PROTOCOL_ERROR` and a white page. Disable CSP until HTTPS is configured.
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(compression());
app.use(morgan("dev"));
app.use(
  cors({
    origin: IS_DEV ? true : FRONTEND_ORIGIN,
    credentials: false
  })
);
app.use(express.json({ limit: "64kb" }));

app.use(
  "/api/",
  rateLimit({
    windowMs: 60_000,
    limit: 30,
    standardHeaders: "draft-7",
    legacyHeaders: false
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/leads", async (req, res) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "VALIDATION_ERROR",
      details: parsed.error.flatten()
    });
  }

  const input = parsed.data;
  if (input.company && input.company.trim().length > 0) {
    return res.status(200).json({ ok: true }); // silently ignore spam
  }
  if (!input.consent) {
    return res.status(400).json({ ok: false, error: "CONSENT_REQUIRED" });
  }

  const createdAt = new Date().toISOString();
  const lead = {
    id: cryptoRandomId(),
    createdAt,
    name: input.name,
    phone: input.phone,
    email: input.email,
    service: input.service,
    message: input.message,
    preferredContact: input.preferredContact,
    source: "website",
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  };

  await appendLead(lead);
  // Fire-and-forget telegram notification (doesn't block the response)
  void notifyTelegramLead(lead);
  res.status(201).json({ ok: true, id: lead.id, createdAt });
});

// (optional) lightweight admin view for quick check in dev
app.get("/api/leads", async (req, res) => {
  const token = process.env.ADMIN_TOKEN;
  if (token && req.headers["x-admin-token"] !== token) {
    return res.status(401).json({ ok: false });
  }
  const limit = clampNumber(Number(req.query.limit ?? 50), 1, 500);
  const leads = await listLeads(limit);
  res.json({ ok: true, leads });
});

// Production: serve frontend build if present (SPA fallback)
// IMPORTANT: don't rely on process.cwd() (PM2 can start the process from different directories).
// Resolve paths relative to this file location (works in both src/ via tsx and dist/ via node).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../../frontend/dist");
if (fs.existsSync(distDir)) {
  app.use(
    express.static(distDir, {
      setHeaders(res, filePath) {
        // Cache policy:
        // - index.html: never cache (so updates show immediately)
        // - hashed assets: cache forever
        // - other static (images): cache 7 days
        if (filePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache");
          return;
        }
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          return;
        }
        res.setHeader("Cache-Control", "public, max-age=604800");
      }
    })
  );
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`[backend] listening on http://localhost:${PORT}`);
  console.log(`[backend] CORS origin: ${IS_DEV ? "(dev: reflect request origin)" : FRONTEND_ORIGIN}`);
});

function clampNumber(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function cryptoRandomId() {
  // 16 bytes -> 32 hex chars; compact, safe
  return randomBytes(16).toString("hex");
}


