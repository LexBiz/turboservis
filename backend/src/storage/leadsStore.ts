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
}

export async function listLeads(limit = 100): Promise<Lead[]> {
  await ensureDataFile();
  const raw = await fs.readFile(leadsFile, "utf8");
  const parsed = safeParseJson<{ leads: Lead[] }>(raw) ?? { leads: [] };
  return parsed.leads.slice(0, limit);
}

function safeParseJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}




