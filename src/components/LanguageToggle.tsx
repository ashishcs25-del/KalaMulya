"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations, Translations } from "@/lib/i18n";
import { Languages } from "lucide-react";

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("kalamulya_lang") as Language;
    if (saved === "kn" || saved === "en") {
      setLang(saved);
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem("kalamulya_lang", newLang);
    } catch {}
  };

  return (
    <LanguageContext.Provider
      value={{ lang, setLang: handleSetLang, t: translations[lang] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "kn" : "en")}
      title="Toggle Kannada / English"
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs transition shadow-sm"
    >
      <Languages className="w-3.5 h-3.5 text-amber-800" />
      <span>{lang === "en" ? "ಕನ್ನಡ" : "English"}</span>
    </button>
  );
}
