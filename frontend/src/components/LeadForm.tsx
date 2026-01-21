import { type FormEvent, useMemo, useState } from "react";
import { z } from "zod";
import { submitLead, type LeadPayload } from "../lib/api";
import { Send } from "lucide-react";
import { useI18n } from "../i18n/useI18n";

type FormState = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  preferredContact: "phone" | "whatsapp" | "telegram";
  consent: boolean;
  company: string;
};

const initial: FormState = {
  name: "",
  phone: "",
  email: "",
  service: "",
  message: "",
  preferredContact: "phone",
  consent: true,
  company: ""
};

export function LeadForm() {
  const { t } = useI18n();
  const [state, setState] = useState<FormState>(initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const leadSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t("form.errName")).max(80),
        phone: z.string().trim().min(6, t("form.errPhone")).max(30),
        email: z
          .string()
          .trim()
          .optional()
          .refine((v) => !v || /\S+@\S+\.\S+/.test(v), t("form.errEmail")),
        service: z.string().trim().optional(),
        message: z.string().trim().max(1000).optional(),
        preferredContact: z.enum(["phone", "whatsapp", "telegram"]).optional(),
        consent: z.literal(true, { errorMap: () => ({ message: t("form.errConsent") }) }),
        company: z.string().optional()
      }),
    [t]
  );

  const payload: LeadPayload = useMemo(
    () => ({
      name: state.name,
      phone: state.phone,
      email: state.email || undefined,
      service: state.service || undefined,
      message: state.message || undefined,
      preferredContact: state.preferredContact,
      consent: state.consent,
      company: state.company || undefined
    }),
    [state]
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessId(null);
    setFieldErrors({});

    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fe[key]) fe[key] = issue.message;
      }
      setFieldErrors(fe);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = (await submitLead(parsed.data)) as { id?: string };
      setSuccessId(res?.id ?? "ok");
      setState(initial);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="label" htmlFor="name">
            {t("form.name")}
          </label>
          <input
            id="name"
            className="input"
            value={state.name}
            onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
            placeholder={t("form.namePh")}
            autoComplete="name"
          />
          {fieldErrors.name && <div className="text-xs text-red-300">{fieldErrors.name}</div>}
        </div>
        <div className="grid gap-2">
          <label className="label" htmlFor="phone">
            {t("form.phone")}
          </label>
          <input
            id="phone"
            className="input"
            value={state.phone}
            onChange={(e) => setState((s) => ({ ...s, phone: e.target.value }))}
            placeholder={t("form.phonePh")}
            autoComplete="tel"
          />
          {fieldErrors.phone && <div className="text-xs text-red-300">{fieldErrors.phone}</div>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="label" htmlFor="email">
            {t("form.email")}
          </label>
          <input
            id="email"
            className="input"
            value={state.email}
            onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
            placeholder="you@example.com"
            autoComplete="email"
          />
          {fieldErrors.email && <div className="text-xs text-red-300">{fieldErrors.email}</div>}
        </div>
        <div className="grid gap-2">
          <label className="label" htmlFor="service">
            {t("form.service")}
          </label>
          <input
            id="service"
            className="input"
            value={state.service}
            onChange={(e) => setState((s) => ({ ...s, service: e.target.value }))}
            placeholder={t("form.servicePh")}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="label" htmlFor="message">
          {t("form.message")}
        </label>
        <textarea
          id="message"
          className="input min-h-[110px] resize-y"
          value={state.message}
          onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))}
          placeholder={t("form.messagePh")}
        />
        {fieldErrors.message && <div className="text-xs text-red-300">{fieldErrors.message}</div>}
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="label" htmlFor="preferredContact">
            {t("form.preferred")}
          </label>
          <select
            id="preferredContact"
            className="input"
            value={state.preferredContact}
            onChange={(e) =>
              setState((s) => ({ ...s, preferredContact: e.target.value as FormState["preferredContact"] }))
            }
          >
            <option value="phone">{t("form.preferred.phone")}</option>
            <option value="whatsapp">{t("form.preferred.whatsapp")}</option>
            <option value="telegram">{t("form.preferred.telegram")}</option>
          </select>
        </div>

        <div className="grid gap-2">
          <label className="label"> </label>
          <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <input
              type="checkbox"
              checked={state.consent}
              onChange={(e) => setState((s) => ({ ...s, consent: e.target.checked }))}
              className="mt-1 size-4"
            />
            <span>
              {t("form.consent")}
              {fieldErrors.consent && <div className="mt-1 text-xs text-red-300">{fieldErrors.consent}</div>}
            </span>
          </label>
        </div>
      </div>

      {/* honeypot */}
      <input
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        value={state.company}
        onChange={(e) => setState((s) => ({ ...s, company: e.target.value }))}
        name="company"
        aria-hidden="true"
      />

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {t("form.errorGeneric")}: {error}
        </div>
      )}
      {successId && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {t("form.success")}
        </div>
      )}

      <button 
        className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg shadow-lg hover:shadow-primary-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full md:w-auto justify-center" 
        disabled={isSubmitting} 
        type="submit"
      >
        <Send className="w-5 h-5" />
        {isSubmitting ? t("form.submitting") : t("form.submit")}
      </button>
    </form>
  );
}


