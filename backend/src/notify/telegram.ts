import type { Lead } from "../storage/leadsStore.js";
import https from "node:https";
import { URL } from "node:url";

type TelegramConfig = {
  token: string;
  chatIds: string[];
};

function getTelegramConfig(): TelegramConfig | null {
  const token = (process.env.TELEGRAM_BOT_TOKEN ?? "").trim();
  if (!token) return null;

  const raw =
    (process.env.TELEGRAM_CHAT_IDS ?? "").trim() ||
    (process.env.TELEGRAM_CHAT_ID ?? "").trim();

  const chatIds = raw
    .split(/[,\s]+/g)
    .map((s) => s.trim())
    .filter(Boolean);

  if (chatIds.length === 0) return null;
  return { token, chatIds };
}

function formatLeadMessage(lead: Lead) {
  const lines: string[] = [];
  lines.push("🆕 Новая заявка с сайта TURBOSERVIS");
  lines.push(`ID: ${lead.id}`);
  lines.push(`Дата: ${lead.createdAt}`);
  lines.push("");
  lines.push(`Имя: ${lead.name}`);
  lines.push(`Телефон: ${lead.phone}`);
  if (lead.email) lines.push(`Email: ${lead.email}`);
  if (lead.preferredContact) lines.push(`Как связаться: ${lead.preferredContact}`);
  if (lead.service) lines.push(`Услуга: ${lead.service}`);
  if (lead.message) {
    lines.push("");
    lines.push("Комментарий:");
    lines.push(lead.message);
  }
  if (lead.ip) lines.push(`\nIP: ${lead.ip}`);
  return lines.join("\n");
}

async function sendTelegramMessage(token: string, chatId: string, text: string) {
  const url = new URL(`https://api.telegram.org/bot${token}/sendMessage`);
  const payload = JSON.stringify({
    chat_id: chatId,
    text,
    disable_web_page_preview: true
  });

  await new Promise<void>((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "content-length": Buffer.byteLength(payload)
        }
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
        res.on("end", () => {
          const body = Buffer.concat(chunks).toString("utf8");
          const ok = res.statusCode && res.statusCode >= 200 && res.statusCode < 300;
          if (!ok) {
            reject(new Error(`Telegram sendMessage failed (${res.statusCode}): ${body}`));
            return;
          }
          resolve();
        });
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

export async function notifyTelegramLead(lead: Lead) {
  const cfg = getTelegramConfig();
  if (!cfg) return;

  const text = formatLeadMessage(lead);

  // Send to all configured groups/chats
  await Promise.all(
    cfg.chatIds.map(async (chatId) => {
      try {
        await sendTelegramMessage(cfg.token, chatId, text);
      } catch (e) {
        console.warn("[telegram] send failed", { chatId, error: String(e) });
      }
    })
  );
}


