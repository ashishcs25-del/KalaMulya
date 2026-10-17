"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  MapPin, 
  ChevronRight,
  Info,
  Loader2,
  QrCode
} from "lucide-react";
import { useLanguage } from "@/components/LanguageToggle";

interface ProductItem {
  id: string;
  title: string;
  craft_type: string;
  product_type: string;
  description?: string;
  listed_price: number;
  gi_tagged: boolean;
  is_demo: boolean;
  main_photo_url: string;
  story?: string;
  price_breakdown?: {
    materials: number;
    labour: number;
    overhead: number;
    heritage: number;
    total: number;
  };
  artisans?: {
    id: string;
    name: string;
    village: string;
    craft: string;
  };
}

export default function HomePage() {
  const { lang, t } = useLanguage();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCraft, setSelectedCraft] = useState<string>("all");
  const [activeBreakdownId, setActiveBreakdownId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [selectedCraft]);

  const fetchProducts = async () => {
    try {
      const url =
        selectedCraft === "all"
          ? "/api/products"
          : `/api/products?craft=${selectedCraft}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Clean Hero Section */}
      <section className="bg-gradient-to-b from-amber-50/80 via-stone-50 to-stone-50 border-b border-stone-200/60 py-10 md:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          {/* Bigger, Darker Headline Tagline */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-200/90 border border-amber-300 text-amber-950 text-sm md:text-base font-extrabold shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-900 shrink-0" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
            {t.heroTitle}
          </h1>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-stone-700 leading-relaxed font-medium">
            {t.heroSubtitle}
          </p>
          {/* Note: "Explore Collection" and "Artisan Portal • List Craft" buttons removed as requested */}
        </div>
      </section>

      {/* Main Storefront Section */}
      <section id="storefront" className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">{t.collectionTitle}</h2>
            <p className="text-xs text-stone-600 mt-0.5 font-medium">
              {t.collectionSubtitle}
            </p>
          </div>

          {/* Craft Filter Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: t.allCrafts },
              { id: "kasuti", label: t.craftKasuti },
              { id: "beedu", label: t.craftBeedu },
              { id: "kinhal", label: t.craftKinhal },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCraft(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCraft === tab.id
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-white text-stone-700 border border-stone-300 hover:bg-stone-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center text-stone-500 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-700" />
            <span className="text-xs">{lang === "kn" ? "ವಸ್ತುಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..." : "Loading craft items..."}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="p-12 md:p-16 text-center bg-white rounded-3xl border border-stone-200 space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7 text-amber-700" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900">
                {lang === "kn" ? "ನಿಮ್ಮ ವಸ್ತುಗಳನ್ನು ಪ್ರದರ್ಶಿಸಲು ಸಿದ್ಧವಾಗಿದೆ" : "Ready for Your Handcrafted Items"}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                {lang === "kn"
                  ? "ಡೆಮೊ ವಸ್ತುಗಳನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆ. ನಿಮ್ಮ ಸ್ವಂತ ಫೋಟೋಗಳು ಮತ್ತು ಕರಕುಶಲ ವಿವರಗಳನ್ನು ಸೇರಿಸಿ."
                  : "Demo products cleared. Post your own photos, calculate fair prices, and list authentic crafts."}
              </p>
            </div>
            <Link
              href="/artisan/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-sm transition"
            >
              <span>{t.navListCraft}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Product Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const artisanName = product.artisans?.name || "Traditional Artisan";
              const village = product.artisans?.village || "Karnataka";
              const craftName =
                product.craft_type === "kasuti"
                  ? t.craftKasuti
                  : product.craft_type === "beedu"
                  ? t.craftBeedu
                  : t.craftKinhal;
              const isHero = product.title.toLowerCase().includes("dupatta");
              const breakdown = product.price_breakdown || {
                materials: Math.round(product.listed_price * 0.15),
                labour: Math.round(product.listed_price * 0.65),
                overhead: Math.round(product.listed_price * 0.08),
                heritage: Math.round(product.listed_price * 0.12),
              };

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                >
                  {/* Image & Badges */}
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.main_photo_url}
                      alt={product.title}
                      className="w-full h-full object-cover transition duration-300 hover:scale-105"
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.gi_tagged && (
                        <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          {t.giBadge}
                        </span>
                      )}
                    </div>

                    {isHero && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-amber-500 text-amber-950 font-bold text-[10px] px-2 py-0.5 rounded-full shadow">
                          {t.featuredBadge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-800 font-medium">
                        <span>{craftName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-stone-500">
                          <MapPin className="w-3 h-3" />
                          {village}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-stone-900 mt-1 leading-snug">
                        <Link href={`/products/${product.id}`} className="hover:text-amber-800 transition">
                          {product.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                        {product.description || product.story}
                      </p>

                      <div className="mt-3 flex items-center gap-2 pt-2 border-t border-stone-100">
                        <div className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center justify-center">
                          {artisanName.charAt(0)}
                        </div>
                        <span className="text-xs text-stone-600">
                          {t.byArtisan} <strong className="text-stone-800">{artisanName}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-3 border-t border-stone-100 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[11px] text-stone-400 block">{t.transparentPrice}</span>
                          <span className="text-xl font-bold text-stone-900">
                            ₹{product.listed_price.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            setActiveBreakdownId(
                              activeBreakdownId === product.id ? null : product.id
                            )
                          }
                          className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded transition"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>{activeBreakdownId === product.id ? t.hideBreakdown : t.whereMoneyGoes}</span>
                        </button>
                      </div>

                      {/* Expandable "Where your money goes" bar */}
                      {activeBreakdownId === product.id && (
                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                          {/* Visual Breakdown Bar */}
                          <div className="h-2.5 w-full bg-stone-200 rounded-full overflow-hidden flex">
                            <div
                              style={{
                                width: `${(breakdown.materials / product.listed_price) * 100}%`,
                              }}
                              className="bg-sky-500"
                              title={`${t.materials}: ₹${breakdown.materials}`}
                            />
                            <div
                              style={{
                                width: `${(breakdown.labour / product.listed_price) * 100}%`,
                              }}
                              className="bg-emerald-500"
                              title={`${t.labour}: ₹${breakdown.labour}`}
                            />
                            <div
                              style={{
                                width: `${(breakdown.overhead / product.listed_price) * 100}%`,
                              }}
                              className="bg-amber-500"
                              title={`${t.overhead}: ₹${breakdown.overhead}`}
                            />
                            <div
                              style={{
                                width: `${(breakdown.heritage / product.listed_price) * 100}%`,
                              }}
                              className="bg-purple-500"
                              title={`${t.heritage}: ₹${breakdown.heritage}`}
                            />
                          </div>

                          {/* Legend */}
                          <div className="grid grid-cols-2 gap-1 text-[11px] text-stone-600 pt-1">
                            <span>{t.materials}: ₹{breakdown.materials}</span>
                            <span>{t.labour}: ₹{breakdown.labour}</span>
                            <span>{t.overhead}: ₹{breakdown.overhead}</span>
                            <span>{t.heritage}: ₹{breakdown.heritage}</span>
                          </div>
                        </div>
                      )}

                      {/* Action Links */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                          href={`/passport/${product.id}`}
                          className="py-2 px-3 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 text-center transition flex items-center justify-center gap-1"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>{t.craftPassport}</span>
                        </Link>
                        <Link
                          href={`/checkout/${product.id}`}
                          className="py-2 px-3 rounded-lg text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 text-center shadow-sm transition flex items-center justify-center gap-1"
                        >
                          <span>{t.buyNow}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
