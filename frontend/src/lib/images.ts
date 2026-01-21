import type { Lang } from "../i18n/types";

export function imageUrl(filename: string) {
  // filename may contain spaces; encode safely
  return `/images/${encodeURIComponent(filename)}`;
}

export function heroImage(page: "services" | "about" | "contacts", lang: Lang) {
  if (lang === "cs") return imageUrl(`cz hero-${page}-2560x900.jpg`);
  return imageUrl(`ua hero-${page}-2560x900.jpg`);
}

export function serviceImage(id: string, lang: Lang) {
  // Only diagnostics has per-language variant in your folder so far
  if (id === "diagnostics") {
    return lang === "cs"
      ? imageUrl("cz service-diagnostics-800x800.jpg")
      : imageUrl("ua service-diagnostics-800x800.jpg");
  }
  const primary = `service-${id}-800x800.jpg`;
  // Fallbacks so cards never look "empty" even if a specific image wasn't provided
  const fallbackById: Record<string, string> = {
    warranty: "service-maintenance-800x800.jpg",
    dyno: lang === "cs" ? "cz service-diagnostics-800x800.jpg" : "ua service-diagnostics-800x800.jpg"
  };
  return imageUrl(fallbackById[id] ?? primary);
}


