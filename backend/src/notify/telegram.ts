import { countLeadsForDay, type Lead } from "../storage/leadsStore.js";
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

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatDateRu(iso: string, timeZone: string) {
  const d = new Date(iso);
  // dd.mm.yyyy, HH:MM
  const parts = new Intl.DateTimeFormat("ru-RU", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).formatToParts(d);
  const day = parts.find((p) => p.type === "day")?.value ?? "00";
  const month = parts.find((p) => p.type === "month")?.value ?? "00";
  const year = parts.find((p) => p.type === "year")?.value ?? "0000";
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return { short: `${day}.${month}.${year}`, full: `${day}.${month}.${year} ${hour}:${minute}` };
}

function normalizePhoneForLinks(raw: string) {
  const digits = raw.replace(/[^\d+]/g, "");
  // For wa.me, only digits (no +)
  const wa = digits.replace(/[^\d]/g, "");
  return { tel: digits.startsWith("+") ? digits : `+${wa}`, wa };
}

async function formatLeadMessageHtml(lead: Lead) {
  const timeZone = process.env.LEADS_TIMEZONE ?? "Europe/Prague";
  const dailyNo = await countLeadsForDay(lead.createdAt, timeZone);
  const date = formatDateRu(lead.createdAt, timeZone);
  const phoneLinks = normalizePhoneForLinks(lead.phone);

  const lines: string[] = [];
  lines.push(`<b>🆕 Заявка #${dailyNo} • ${escapeHtml(date.short)}</b>`);
  lines.push(`<b>Время:</b> ${escapeHtml(date.full)}`);
  lines.push(`<b>ID:</b> <code>${escapeHtml(lead.id)}</code>`);
  lines.push("");
  lines.push(`<b>Имя:</b> ${escapeHtml(lead.name)}`);
  // NOTE: Telegram HTML does not reliably support tel:/mailto: links. Keep as plain text.
  lines.push(`<b>Телефон:</b> <code>${escapeHtml(lead.phone)}</code>`);
  if (lead.email) lines.push(`<b>Email:</b> <code>${escapeHtml(lead.email)}</code>`);
  if (lead.preferredContact) lines.push(`<b>Связь:</b> ${escapeHtml(lead.preferredContact)}`);
  if (lead.service) lines.push(`<b>Услуга:</b> ${escapeHtml(lead.service)}`);
  if (lead.message) {
    lines.push("");
    lines.push("<b>Комментарий:</b>");
    lines.push(`<pre>${escapeHtml(lead.message)}</pre>`);
  }
  if (lead.ip) lines.push(`\n<b>IP:</b> <code>${escapeHtml(lead.ip)}</code>`);

  return {
    html: lines.join("\n"),
    buttons: [
      [
        { text: "WhatsApp", url: `https://wa.me/${phoneLinks.wa}` }
      ]
    ]
  };
}

async function sendTelegramMessage(
  token: string,
  chatId: string,
  opts: { html: string; buttons?: Array<Array<{ text: string; url: string }>> }
) {
  const url = new URL(`https://api.telegram.org/bot${token}/sendMessage`);
  const payload = JSON.stringify({
    chat_id: chatId,
    text: opts.html,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: opts.buttons ? { inline_keyboard: opts.buttons } : undefined
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

  let msg: { html: string; buttons?: Array<Array<{ text: string; url: string }>> };
  try {
    msg = await formatLeadMessageHtml(lead);
  } catch (e) {
    console.warn("[telegram] format failed", { error: String(e) });
    return;
  }

  // Send to all configured groups/chats
  await Promise.all(
    cfg.chatIds.map(async (chatId) => {
      try {
        await sendTelegramMessage(cfg.token, chatId, msg);
      } catch (e) {
        console.warn("[telegram] send failed", { chatId, error: String(e) });
      }
    })
  );
}


