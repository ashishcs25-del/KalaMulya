"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageToggle";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 py-10 border-t border-stone-800 mt-16 text-sm">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-white">{t.footerTitle}</p>
          <p className="text-xs text-stone-400 mt-1">{t.footerSubtitle}</p>
        </div>
        <div className="text-xs text-stone-400 text-center sm:text-right">
          <p>{t.craftKasuti} • {t.craftBeedu} • {t.craftKinhal}</p>
          <p className="text-stone-500 mt-0.5">{t.footerText}</p>
        </div>
      </div>
    </footer>
  );
}
