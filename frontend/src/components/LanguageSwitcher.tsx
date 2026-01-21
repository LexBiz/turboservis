import { useMemo } from "react";
import { useI18n } from "../i18n/useI18n";
import type { Lang } from "../i18n/types";
import { LANG_LABEL } from "../i18n/translations";

function FlagUA({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="24" height="8" y="0" fill="#0057B7" />
      <rect width="24" height="8" y="8" fill="#FFD700" />
      <rect width="24" height="16" fill="none" stroke="rgba(255,255,255,0.25)" />
    </svg>
  );
}

function FlagCZ({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="24" height="8" y="0" fill="#FFFFFF" />
      <rect width="24" height="8" y="8" fill="#D7141A" />
      <path d="M0 0 L10.5 8 L0 16 Z" fill="#11457E" />
      <rect width="24" height="16" fill="none" stroke="rgba(255,255,255,0.25)" />
    </svg>
  );
}

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  const options = useMemo(
    () =>
      [
        { value: "cs" as const, label: LANG_LABEL.cs },
        { value: "uk" as const, label: LANG_LABEL.uk }
      ] satisfies { value: Lang; label: string }[],
    []
  );

  return (
    <div className="flex items-center gap-2 rounded-lg border border-primary-500/20 bg-dark-50 px-2 py-1">
      <button
        type="button"
        onClick={() => setLang("cs")}
        className={[
          "flex items-center gap-2 rounded-md px-2 py-1 text-xs font-semibold transition",
          lang === "cs" ? "bg-primary-500/15 text-primary-400" : "text-white/70 hover:text-white"
        ].join(" ")}
        aria-label={options[0].label}
      >
        <FlagCZ className="h-4 w-6" />
        <span className="hidden sm:inline">CZ</span>
      </button>
      <button
        type="button"
        onClick={() => setLang("uk")}
        className={[
          "flex items-center gap-2 rounded-md px-2 py-1 text-xs font-semibold transition",
          lang === "uk" ? "bg-primary-500/15 text-primary-400" : "text-white/70 hover:text-white"
        ].join(" ")}
        aria-label={options[1].label}
      >
        <FlagUA className="h-4 w-6" />
        <span className="hidden sm:inline">UK</span>
      </button>
    </div>
  );
}


