import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider, LanguageSwitcher } from "@/components/LanguageToggle";

export const metadata: Metadata = {
  title: "KalaMulya | Fair-Price Engine & Craft Passport",
  description:
    "Empowering traditional artisans of coastal Karnataka with transparent fair pricing and authentic Craft Passports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-stone-50 text-stone-900">
        <LanguageProvider>
          {/* Top Announcement / Disclaimer Banner */}
          <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 text-xs md:text-sm text-amber-900 text-center font-medium flex items-center justify-center gap-2">
            <span>ℹ️ Notice: Price is guidance, not a guarantee. Payment is simulated (demo).</span>
          </div>

          {/* Global Navigation */}
          <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              <a href="/" className="flex items-center gap-2 group">
                <span className="w-9 h-9 rounded-xl bg-amber-700 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-amber-800 transition-colors">
                  ಕ
                </span>
                <div>
                  <span className="text-xl font-bold tracking-tight text-stone-900 block leading-tight">
                    KalaMulya
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-amber-700 tracking-wider block">
                    Fair Price • Craft Passport
                  </span>
                </div>
              </a>

              <nav className="flex items-center gap-2 sm:gap-3">
                <a
                  href="/"
                  className="px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-stone-700 hover:text-amber-800 hover:bg-stone-100 transition-colors"
                >
                  Storefront
                </a>
                <a
                  href="/artisan/new"
                  className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-amber-700 text-white hover:bg-amber-800 shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <span>➕</span>
                  <span className="hidden sm:inline">List Craft</span>
                </a>
                <a
                  href="/orders"
                  className="px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-stone-700 hover:text-amber-800 hover:bg-stone-100 transition-colors"
                >
                  Orders
                </a>
                <a
                  href="/admin"
                  className="px-2 py-1 rounded-lg text-xs font-semibold text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors border border-stone-300 hidden sm:inline-block"
                >
                  Admin
                </a>

                {/* Bilingual Kannada/English Switcher */}
                <LanguageSwitcher />
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="bg-stone-900 text-stone-300 py-8 border-t border-stone-800 mt-12 text-sm">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white">KalaMulya (ಕಲಾಮೌಲ್ಯ)</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  DevHack 2026 (Sahyadri) • PS 4.2: Digital Market Access for Local Artisans
                </p>
              </div>
              <div className="text-xs text-stone-400 text-center sm:text-right">
                <p>Kasuti Embroidery • Beedu Craft • Coastal Karnataka</p>
                <p className="text-stone-500 mt-0.5">All transactions simulated for prototype demonstration.</p>
              </div>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
