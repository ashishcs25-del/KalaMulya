"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  QrCode, 
  ArrowRight, 
  MapPin, 
  CheckCircle2, 
  ChevronRight,
  Info,
  Loader2
} from "lucide-react";

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
        if (data.products.length > 0 && !activeBreakdownId) {
          setActiveBreakdownId(data.products[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-amber-50 to-stone-50 border-b border-amber-100/60 py-12 md:py-16 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs md:text-sm font-semibold tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>DevHack 2026 • PS 4.2: Digital Market Access for Local Artisans</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
            Fair Pricing & Digital Provenance for Karnataka&apos;s Heritage Artisans
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-stone-600 leading-relaxed">
            Eliminating middleman exploitation for makers of Kasuti embroidery, Beedu craft, and coastal treasures through an 
            <span className="font-semibold text-stone-900"> explainable fair-wage pricing engine</span> and verifiable 
            <span className="font-semibold text-stone-900"> Craft Passports</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/artisan/new"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-base shadow-sm hover:shadow transition flex items-center justify-center gap-2"
            >
              <Scale className="w-5 h-5" />
              <span>Calculate Fair Price & List Craft</span>
            </Link>

            <a
              href="#storefront"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-semibold text-base border border-stone-300 transition flex items-center justify-center gap-2"
            >
              <span>Explore Direct Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 max-w-4xl mx-auto text-left">
            <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-stone-900 text-sm">Explainable Pricing</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Transparent formula accounts for raw materials, artisan labor hours, workshop overheads, and GI heritage value.
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-stone-900 text-sm">Verifiable Craft Passport</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Every product comes with a QR passport detailing maker story, village provenance, and fair-wage breakdown.
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-stone-900 text-sm">Zero Digital Barriers</h2>
                <p className="text-xs text-stone-500 mt-1">
                  Icon-led, high contrast UI designed specifically for low digital literacy with Kannada bilingual support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Storefront Section */}
      <section id="storefront" className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-stone-900">Artisan Storefront</h2>
              <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-medium">
                Live Prototype
              </span>
            </div>
            <p className="text-sm text-stone-600 mt-1">
              Direct connection with traditional makers. 100% transparent pricing on every single piece.
            </p>
          </div>

          {/* Craft Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Crafts" },
              { id: "kasuti", label: "Kasuti Embroidery" },
              { id: "beedu", label: "Beedu Craft" },
              { id: "kinhal", label: "Kinhal Woodcraft" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCraft(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition ${
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
            <span className="text-sm">Loading authentic handcrafted items...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
            <p className="text-stone-700 font-bold">No craft items found in this category.</p>
            <p className="text-xs text-stone-500">
              Be the first artisan to list a piece in this heritage category!
            </p>
            <Link
              href="/artisan/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-700 text-white text-xs font-bold"
            >
              <span>List a Craft</span>
              <ChevronRight className="w-3.5 h-3.5" />
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
                  ? "Kasuti Embroidery"
                  : product.craft_type === "beedu"
                  ? "Beedu Craft"
                  : "Kinhal Woodcraft";
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
                  className={`bg-white rounded-2xl border ${
                    isHero ? "border-amber-400 ring-2 ring-amber-400/20" : "border-stone-200"
                  } overflow-hidden shadow-sm hover:shadow-md transition flex flex-col`}
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
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.is_demo && (
                        <span className="bg-stone-900/80 backdrop-blur text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow">
                          Demo Data
                        </span>
                      )}
                      {product.gi_tagged && (
                        <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          GI Tagged Heritage
                        </span>
                      )}
                    </div>

                    {isHero && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-amber-500 text-amber-950 font-bold text-[11px] px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                          ★ Hero Showcase
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

                      <h3 className="font-bold text-lg text-stone-900 mt-1 leading-snug">
                        <Link href={`/products/${product.id}`} className="hover:text-amber-800 transition">
                          {product.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-stone-600 mt-1.5 line-clamp-2">
                        {product.description || product.story}
                      </p>

                      <div className="mt-3 flex items-center gap-2 pt-2 border-t border-stone-100">
                        <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center">
                          {artisanName.charAt(0)}
                        </div>
                        <span className="text-xs text-stone-700">
                          Crafted by <strong className="text-stone-900">{artisanName}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-3 border-t border-stone-100 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-xs text-stone-500 block">Transparent Fair Price</span>
                          <span className="text-2xl font-black text-stone-900">
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
                          <span>{activeBreakdownId === product.id ? "Hide breakdown" : "Where money goes"}</span>
                        </button>
                      </div>

                      {/* Expandable "Where your money goes" bar */}
                      {activeBreakdownId === product.id && (
                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                          <p className="font-semibold text-stone-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Exact Fair Cost Breakdown:</span>
                          </p>
                          
                          {/* Visual Breakdown Bar */}
                          <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden flex">
                            <div
                              style={{
                                width: `${(breakdown.materials / product.listed_price) * 100}%`,
                              }}
                              className="bg-sky-500"
                              title={`Materials: ₹${breakdown.materials}`}
                            />
                            <div
                              style={{
                                width: `${(breakdown.labour / product.listed_price) * 100}%`,
                              }}
                              className="bg-emerald-500"
                              title={`Artisan Labour: ₹${breakdown.labour}`}
                            />
                            <div
                              style={{
                                width: `${(breakdown.overhead / product.listed_price) * 100}%`,
                              }}
                              className="bg-amber-500"
                              title={`Overhead: ₹${breakdown.overhead}`}
                            />
                            <div
                              style={{
                                width: `${(breakdown.heritage / product.listed_price) * 100}%`,
                              }}
                              className="bg-purple-500"
                              title={`Heritage: ₹${breakdown.heritage}`}
                            />
                          </div>

                          {/* Legend */}
                          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-stone-600 pt-1">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                              <span>Materials: ₹{breakdown.materials}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                              <span>Artisan Labour: ₹{breakdown.labour}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                              <span>Overhead (8%): ₹{breakdown.overhead}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                              <span>Heritage: ₹{breakdown.heritage}</span>
                            </div>
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
                          <span>Craft Passport</span>
                        </Link>
                        <Link
                          href={`/checkout/${product.id}`}
                          className="py-2 px-3 rounded-lg text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 text-center shadow-sm transition flex items-center justify-center gap-1"
                        >
                          <span>Buy Now</span>
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

      {/* Artisan Value Prop Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-amber-900 text-amber-50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              For Coastal & North Karnataka Artisans
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white">
              Are you selling below your true value?
            </h2>
            <p className="text-sm md:text-base text-amber-200 leading-relaxed">
              Traditional craft takes days of dedicated labor. Answer 4 simple guided questions on materials, 
              hours, and complexity. KalaMulya computes a fair price range backed by market comparables, protects your living wage, 
              and generates your printable QR passport.
            </p>
            <div className="pt-2">
              <Link
                href="/artisan/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-amber-950 font-bold text-sm shadow hover:bg-amber-50 transition"
              >
                <Scale className="w-4 h-4 text-amber-800" />
                <span>Launch Guided Fair-Price Calculator</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
