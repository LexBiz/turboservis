import { countLeadsForDay, getDailyLeadSummary, type Lead } from "../storage/leadsStore.js";
import https from "node:https";
import { URL } from "node:url";

type TelegramConfig = {
  token: string;
  chatIds: string[];
};

type TelegramErrorPayload = {
  ok?: boolean;
  error_code?: number;
  description?: string;
  parameters?: {
    migrate_to_chat_id?: number;
  };
};

class TelegramApiError extends Error {
  statusCode: number | undefined;
  payload: TelegramErrorPayload | null;

  constructor(message: string, statusCode?: number, payload?: TelegramErrorPayload | null) {
    super(message);
    this.name = "TelegramApiError";
    this.statusCode = statusCode;
    this.payload = payload ?? null;
  }
}

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

function formatDatePrague(iso: string, timeZone: string) {
  const d = new Date(iso);
  // dd.mm.yyyy, HH:MM
  // Use a stable numeric formatter (locale doesn't matter because we build digits ourselves)
  const parts = new Intl.DateTimeFormat("en-GB", {
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

function formatTimePrague(iso: string, timeZone: string) {
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit"
  }).formatToParts(d);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${hour}:${minute}`;
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  const y = Number(get("year"));
  const m = Number(get("month"));
  const d = Number(get("day"));
  const h = Number(get("hour"));
  const min = Number(get("minute"));
  const s = Number(get("second"));
  const asUtc = Date.UTC(y, m - 1, d, h, min, s);
  return asUtc - date.getTime();
}

function makeZonedDateUtcMs(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
) {
  const guessUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  const offset = getTimeZoneOffsetMs(new Date(guessUtc), timeZone);
  return guessUtc - offset;
}

function getNextDailyReportDate(timeZone: string, hour = 21, minute = 0) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);
  const y = Number(parts.find((p) => p.type === "year")?.value ?? "0000");
  const m = Number(parts.find((p) => p.type === "month")?.value ?? "01");
  const d = Number(parts.find((p) => p.type === "day")?.value ?? "01");
  let targetUtc = makeZonedDateUtcMs(y, m, d, hour, minute, timeZone);
  if (targetUtc <= now.getTime()) {
    const tomorrow = new Date(Date.UTC(y, m - 1, d) + 24 * 60 * 60 * 1000);
    const tParts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(tomorrow);
    const ty = Number(tParts.find((p) => p.type === "year")?.value ?? "0000");
    const tm = Number(tParts.find((p) => p.type === "month")?.value ?? "01");
    const td = Number(tParts.find((p) => p.type === "day")?.value ?? "01");
    targetUtc = makeZonedDateUtcMs(ty, tm, td, hour, minute, timeZone);
  }
  return new Date(targetUtc);
}

function normalizePhoneForLinks(raw: string) {
  const digits = raw.replace(/[^\d+]/g, "");
  // For wa.me, only digits (no +)
  const wa = digits.replace(/[^\d]/g, "");
  return { tel: digits.startsWith("+") ? digits : `+${wa}`, wa };
}

function normalizeTelegramUsername(raw?: string) {
  const v = (raw ?? "").trim().replace(/^@/, "");
  if (!v) return null;
  if (!/^[A-Za-z0-9_]{5,64}$/.test(v)) return null;
  return v;
}

function preferredContactUk(v: Lead["preferredContact"]) {
  if (!v) return null;
  switch (v) {
    case "phone":
      return "Дзвінок";
    case "whatsapp":
      return "WhatsApp";
    case "telegram":
      return "Telegram";
    default:
      return String(v);
  }
}

type LeadMsg = { text: string; buttons?: Array<Array<{ text: string; url: string }>> };

async function formatLeadMessage(lead: Lead): Promise<LeadMsg> {
  // Prague timezone so daily counter resets at 00:00 Prague time
  const timeZone = process.env.LEADS_TIMEZONE ?? "Europe/Prague";
  const dailyNo = await countLeadsForDay(lead.createdAt, timeZone);
  const date = formatDatePrague(lead.createdAt, timeZone);
  const phoneLinks = normalizePhoneForLinks(lead.phone);
  const includeId = String(process.env.TELEGRAM_INCLUDE_ID ?? "").trim() === "1";
  const includeIp = String(process.env.TELEGRAM_INCLUDE_IP ?? "").trim() === "1";

  const textLines: string[] = [];

  textLines.push(`🆕 Заявка №${dailyNo} • ${date.short}`);

  textLines.push(`🕒 Час: ${date.full}`);

  if (includeId) {
    textLines.push(`🆔 ID: ${lead.id}`);
  }

  textLines.push("");

  textLines.push(`👤 Ім’я: ${lead.name}`);
  textLines.push(`📞 Телефон: ${lead.phone}`);

  if (lead.email) {
    textLines.push(`✉️ Email: ${lead.email}`);
  }
  if (lead.preferredContact) {
    const pc = preferredContactUk(lead.preferredContact) ?? lead.preferredContact;
    textLines.push(`📲 Зв’язок: ${pc}`);
  }
  if (lead.service) {
    textLines.push(`🛠️ Послуга: ${lead.service}`);
  }
  if (lead.message) {
    textLines.push("");
    textLines.push("💬 Коментар:");
    textLines.push(lead.message);
  }
  if (includeIp && lead.ip) {
    textLines.push(`\n🌐 IP: ${lead.ip}`);
  }

  const buttons: LeadMsg["buttons"] = (() => {
    // Buttons must match user's preference from the form.
    // Telegram inline keyboard does NOT support tel: reliably, so we only use https URLs.
    if (lead.preferredContact === "whatsapp" && phoneLinks.wa.length >= 6) {
      return [[{ text: "WhatsApp", url: `https://wa.me/${phoneLinks.wa}` }]];
    }
    if (lead.preferredContact === "telegram") {
      const u = normalizeTelegramUsername(lead.telegramUsername);
      if (u) return [[{ text: "Telegram", url: `https://t.me/${u}` }]];
    }
    return undefined;
  })();

  return {
    text: textLines.join("\n"),
    buttons
  };
}

async function sendTelegramMessage(
  token: string,
  chatId: string,
  opts: {
    text: string;
    buttons?: Array<Array<{ text: string; url: string }>>;
  }
) {
  const url = new URL(`https://api.telegram.org/bot${token}/sendMessage`);
  const payload = JSON.stringify({
    chat_id: chatId,
    text: opts.text,
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
            let parsed: TelegramErrorPayload | null = null;
            try {
              parsed = JSON.parse(body) as TelegramErrorPayload;
            } catch {
              parsed = null;
            }
            reject(new TelegramApiError(`Telegram sendMessage failed (${res.statusCode}): ${body}`, res.statusCode, parsed));
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

async function sendTelegramToChats(cfg: TelegramConfig, text: string) {
  await Promise.all(
    cfg.chatIds.map(async (chatId) => {
      try {
        await sendTelegramMessage(cfg.token, chatId, { text });
      } catch (e) {
        if (e instanceof TelegramApiError) {
          const migrateTo = e.payload?.parameters?.migrate_to_chat_id;
          if (migrateTo) {
            const newChatId = String(migrateTo);
            console.warn("[telegram] chat migrated (update TELEGRAM_CHAT_IDS)", {
              oldChatId: chatId,
              newChatId
            });
            try {
              await sendTelegramMessage(cfg.token, newChatId, { text });
              return;
            } catch (e2) {
              console.warn("[telegram] send failed", { chatId: newChatId, error: String(e2) });
              return;
            }
          }
        }
        console.warn("[telegram] send failed", { chatId, error: String(e) });
      }
    })
  );
}

async function formatDailyReportMessage(nowIso: string, timeZone: string) {
  const date = formatDatePrague(nowIso, timeZone);
  const { count, lastLeadAt, lastLeadName } = await getDailyLeadSummary(nowIso, timeZone);
  const lines: string[] = [];
  lines.push(`📊 Щоденний звіт • ${date.short}`);
  lines.push("");
  if (count > 0) {
    lines.push(`✅ Заявок сьогодні: ${count}`);
    if (lastLeadAt) {
      lines.push(`⏱ Остання заявка: ${formatTimePrague(lastLeadAt, timeZone)}`);
    }
    if (lastLeadName) {
      // keep for future use if needed
    }
  } else {
    lines.push("📭 Заявок сьогодні: 0");
  }
  lines.push("");
  return lines.join("\n");
}

let dailyReportTimer: NodeJS.Timeout | null = null;

export function startDailyTelegramReport() {
  const cfg = getTelegramConfig();
  if (!cfg) return;

  const timeZone = process.env.LEADS_TIMEZONE ?? "Europe/Prague";
  if (dailyReportTimer) clearTimeout(dailyReportTimer);

  const scheduleNext = () => {
    const nextAt = getNextDailyReportDate(timeZone, 21, 0);
    const delay = Math.max(5_000, nextAt.getTime() - Date.now());
    dailyReportTimer = setTimeout(async () => {
      try {
        const nowIso = new Date().toISOString();
        const text = await formatDailyReportMessage(nowIso, timeZone);
        await sendTelegramToChats(cfg, text);
      } catch (e) {
        console.warn("[telegram] daily report failed", { error: String(e) });
      } finally {
        scheduleNext();
      }
    }, delay);
  };

  scheduleNext();
}

async function sendTelegramContact(token: string, chatId: string, phoneNumber: string, firstName: string) {
  const url = new URL(`https://api.telegram.org/bot${token}/sendContact`);
  const payload = JSON.stringify({
    chat_id: chatId,
    phone_number: phoneNumber,
    first_name: firstName || "Lead"
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
            let parsed: TelegramErrorPayload | null = null;
            try {
              parsed = JSON.parse(body) as TelegramErrorPayload;
            } catch {
              parsed = null;
            }
            reject(new TelegramApiError(`Telegram sendContact failed (${res.statusCode}): ${body}`, res.statusCode, parsed));
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

  let msg: LeadMsg;
  try {
    msg = await formatLeadMessage(lead);
  } catch (e) {
    console.warn("[telegram] format failed", { error: String(e) });
    return;
  }

  // Send to all configured groups/chats
  await Promise.all(
    cfg.chatIds.map(async (chatId) => {
      try {
        await sendTelegramMessage(cfg.token, chatId, { text: msg.text, buttons: msg.buttons });
        // For "phone" preference, also send contact card so Telegram shows a built-in Call button.
        if (lead.preferredContact === "phone") {
          const pn = normalizePhoneForLinks(lead.phone).tel;
          await sendTelegramContact(cfg.token, chatId, pn, lead.name);
        }
      } catch (e) {
        // If group was upgraded to supergroup, Telegram returns migrate_to_chat_id.
        if (e instanceof TelegramApiError) {
          const migrateTo = e.payload?.parameters?.migrate_to_chat_id;
          if (migrateTo) {
            const newChatId = String(migrateTo);
            console.warn("[telegram] chat migrated (update TELEGRAM_CHAT_IDS)", {
              oldChatId: chatId,
              newChatId
            });
            try {
              await sendTelegramMessage(cfg.token, newChatId, { text: msg.text, buttons: msg.buttons });
              if (lead.preferredContact === "phone") {
                const pn = normalizePhoneForLinks(lead.phone).tel;
                await sendTelegramContact(cfg.token, newChatId, pn, lead.name);
              }
              return;
            } catch (e2) {
              console.warn("[telegram] send failed", { chatId: newChatId, error: String(e2) });
              return;
            }
          }
        }

        console.warn("[telegram] send failed", { chatId, error: String(e) });
      }
    })
  );
}


