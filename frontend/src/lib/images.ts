import type { Lang } from "../i18n/types";

export function imageUrl(filename: string) {
  // filename may contain spaces; encode safely
  return `/images/${encodeURIComponent(filename)}`;
}

export function optImageUrl(filename: string) {
  return `/images/opt/${encodeURIComponent(filename)}`;
}

function srcset(base: string, widths: number[], ext: "webp" | "jpg") {
  return widths.map((w) => `${optImageUrl(`${base}-${w}.${ext}`)} ${w}w`).join(", ");
}

export function heroMainSources() {
  const base = "hero-main";
  return {
    src: imageUrl("hero-main-2560x1200.jpg"),
    webpSrcSet: srcset(base, [900, 1600], "webp"),
    jpgSrcSet: srcset(base, [900, 1600], "jpg"),
    sizes: "100vw"
  };
}

export function heroImage(page: "services" | "about" | "contacts", lang: Lang) {
  if (lang === "cs") return imageUrl(`cz hero-${page}-2560x900.jpg`);
  return imageUrl(`ua hero-${page}-2560x900.jpg`);
}

export function heroSources(page: "services" | "about" | "contacts", lang: Lang) {
  const base = `${lang}-hero-${page}`;
  return {
    src: heroImage(page, lang),
    webpSrcSet: srcset(base, [900, 1600], "webp"),
    jpgSrcSet: srcset(base, [900, 1600], "jpg"),
    sizes: "100vw"
  };
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

export function serviceSources(id: string, lang: Lang) {
  if (id === "diagnostics") {
    const base = `${lang}-service-diagnostics`;
    return {
      src: serviceImage(id, lang),
      webpSrcSet: srcset(base, [400, 800], "webp"),
      jpgSrcSet: srcset(base, [400, 800], "jpg"),
      sizes: "(max-width: 768px) 50vw, 33vw"
    };
  }
  const base = `service-${id}`;
  return {
    src: serviceImage(id, lang),
    webpSrcSet: srcset(base, [400, 800], "webp"),
    jpgSrcSet: srcset(base, [400, 800], "jpg"),
    sizes: "(max-width: 768px) 50vw, 33vw"
  };
}


