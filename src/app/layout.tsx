import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageToggle";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "KalaMulya | Authentic Indian Crafts & Fair Pricing",
  description:
    "Discover authentic handcrafted treasures directly from traditional artisans of Karnataka with transparent fair pricing and verifiable Craft Passports.",
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
          {/* Main Navigation (Bilingual) */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Global Footer (Bilingual) */}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
