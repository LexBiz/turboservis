import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dict, Lang } from "./types";
import { dict } from "./translations";
import { I18nContext } from "./context";

const STORAGE_KEY = "turboservis.lang";

function getInitialLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "uk" || saved === "cs") return saved;
  // default to Czech (CZK prices + Czech audience)
  return "cs";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => getInitialLang());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const d: Dict = dict[lang];
      const base = d[key] ?? dict.cs[key] ?? key;
      if (!vars) return base;
      return base.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}


