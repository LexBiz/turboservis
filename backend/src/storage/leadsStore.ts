import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type Lead = {
  id: string;
  createdAt: string; // ISO
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
  preferredContact?: "phone" | "whatsapp" | "telegram";
  source?: string;
  ip?: string;
  userAgent?: string;
};

// Avoid relying on process.cwd() (PM2 may start the process from different directories).
// Keep data under backend/data regardless of working directory.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../../data");
const leadsFile = path.join(dataDir, "leads.json");
const leadsNdjsonFile = path.join(dataDir, "leads.ndjson");

async function ensureDataFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(leadsFile);
  } catch {
    await fs.writeFile(leadsFile, JSON.stringify({ leads: [] }, null, 2), "utf8");
  }
}

export async function appendLead(lead: Lead) {
  await ensureDataFile();
  const raw = await fs.readFile(leadsFile, "utf8");
  const parsed = safeParseJson<{ leads: Lead[] }>(raw) ?? { leads: [] };
  parsed.leads.unshift(lead);
  await fs.writeFile(leadsFile, JSON.stringify(parsed, null, 2), "utf8");

  // Extra safety: append-only backup (easy to recover even if JSON becomes corrupted)
  try {
    await fs.appendFile(leadsNdjsonFile, `${JSON.stringify(lead)}\n`, "utf8");
  } catch {
    // ignore backup errors
  }
}

export async function listLeads(limit = 100): Promise<Lead[]> {
  await ensureDataFile();
  const raw = await fs.readFile(leadsFile, "utf8");
  const parsed = safeParseJson<{ leads: Lead[] }>(raw) ?? { leads: [] };
  return parsed.leads.slice(0, limit);
}

function dateKey(iso: string, timeZone: string) {
  const d = new Date(iso);
  // Use YYYY-MM-DD in the given timezone
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value ?? "0000";
  const m = parts.find((p) => p.type === "month")?.value ?? "00";
  const day = parts.find((p) => p.type === "day")?.value ?? "00";
  return `${y}-${m}-${day}`;
}

export async function countLeadsForDay(iso: string, timeZone = "Europe/Prague"): Promise<number> {
  await ensureDataFile();
  const raw = await fs.readFile(leadsFile, "utf8");
  const parsed = safeParseJson<{ leads: Lead[] }>(raw) ?? { leads: [] };
  const key = dateKey(iso, timeZone);
  let count = 0;
  for (const l of parsed.leads) {
    if (dateKey(l.createdAt, timeZone) === key) count++;
  }
  return count;
}

function safeParseJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}




