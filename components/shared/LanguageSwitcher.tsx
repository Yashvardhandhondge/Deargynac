"use client";

import { useLang } from "@/context/LanguageContext";
import type { Language } from "@/lib/translations";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  const languages: { code: Language; label: string; fullLabel: string }[] = [
    { code: "en", label: "EN", fullLabel: "English" },
    { code: "hi", label: "हि", fullLabel: "हिंदी" },
    { code: "mr", label: "म", fullLabel: "मराठी" },
  ];

  return (
    <div className="flex gap-1 items-center shrink-0">
      {languages.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          title={l.fullLabel}
          className="rounded-full border px-2 py-1 text-xs font-semibold transition-all duration-150 cursor-pointer"
          style={{
            borderColor: lang === l.code ? "#C2185B" : "#E5E7EB",
            backgroundColor: lang === l.code ? "#C2185B" : "white",
            color: lang === l.code ? "white" : "#6B7280",
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
