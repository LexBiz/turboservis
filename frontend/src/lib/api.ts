export type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
  preferredContact?: "phone" | "whatsapp" | "telegram";
  consent: boolean;
  company?: string; // honeypot
};

export async function submitLead(payload: LeadPayload) {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = (await res.json().catch(() => null)) as unknown;
  if (!res.ok) {
    throw new Error(extractErrorMessage(data) ?? `Request failed (${res.status})`);
  }
  return data;
}

function extractErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const anyData = data as Record<string, unknown>;
  if (typeof anyData.error === "string") return anyData.error;
  return null;
}


