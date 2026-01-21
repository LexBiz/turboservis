import type { Lang } from "../i18n/types";

export function formatCzk(amount: number, lang: Lang) {
  // We always show CZK, but use locale formatting per language.
  const locale = lang === "uk" ? "uk-UA" : "cs-CZ";
  return new Intl.NumberFormat(locale, { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(amount);
}

export function fromCzk(amount: number) {
  // "od 1 500 Kč" style text is built in UI; keep helper for future logic.
  return amount;
}


