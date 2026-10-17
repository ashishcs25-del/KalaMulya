"use client";

import React from "react";
import Link from "next/link";
import { useLanguage, LanguageSwitcher } from "@/components/LanguageToggle";
import { Store, Plus, Shield } from "lucide-react";

export function Navbar() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-9 h-9 rounded-xl bg-amber-700 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-amber-800 transition-colors">
            ಕ
          </span>
          <div>
            <span className="text-xl font-bold tracking-tight text-stone-900 block leading-tight">
              {t.appName}
            </span>
            <span className="text-[10px] uppercase font-semibold text-amber-700 tracking-wider block">
              {t.tagline}
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-stone-700 hover:text-amber-800 hover:bg-stone-100 transition-colors"
          >
            {t.navStorefront}
          </Link>

          <Link
            href="/artisan/new"
            className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-amber-700 text-white hover:bg-amber-800 shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.navListCraft}</span>
          </Link>

          {/* Seller Portal Button (Replaces Public Orders Page) */}
          <Link
            href="/seller"
            className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center gap-1.5"
          >
            <Store className="w-3.5 h-3.5 text-amber-800" />
            <span>{t.navSellerPortal}</span>
          </Link>

          <Link
            href="/admin"
            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors border border-stone-300 hidden sm:inline-block"
          >
            {t.navAdmin}
          </Link>

          {/* Bilingual Kannada/English Switcher */}
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
