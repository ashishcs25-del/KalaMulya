"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import QRCode from "qrcode";
import { 
  Download, 
  Printer, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft,
  Loader2,
  Calendar
} from "lucide-react";

interface ProductPassport {
  id: string;
  title: string;
  craft_type: string;
  product_type: string;
  description: string;
  materials: { name: string; qty: number; unitPriceInr: number }[];
  hours: number;
  skill_level: string;
  gi_tagged: boolean;
  complexity: string;
  price_breakdown: {
    materials: number;
    labour: number;
    overhead: number;
    heritage: number;
    total: number;
  };
  floor_price: number;
  target_price: number;
  listed_price: number;
  story: string;
  main_photo_url: string;
  process_photos: string[];
  is_demo: boolean;
  created_at?: string;
  artisans?: {
    id: string;
    name: string;
    village: string;
    craft: string;
    bio: string;
    photo_url?: string;
  };
}

export default function CraftPassportPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<ProductPassport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then((res) => res.json())
        .then(async (data) => {
          if (data.success && data.product) {
            setProduct(data.product);

            const url = typeof window !== "undefined" ? window.location.href : `https://kalamulya.org/passport/${id}`;
            try {
              const qr = await QRCode.toDataURL(url, {
                width: 360,
                margin: 2,
                color: {
                  dark: "#78350F",
                  light: "#FFFFFF",
                },
              });
              setQrCodeDataUrl(qr);
            } catch (qrErr) {
              console.error("Failed to generate QR code:", qrErr);
            }
          }
        })
        .catch((err) => console.error("Error loading passport:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
        <span className="text-xs text-stone-500">Loading digital craft passport...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-stone-900">Craft Passport Not Found</h1>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Marketplace</span>
        </Link>
      </div>
    );
  }

  const breakdown = product.price_breakdown || {
    materials: Math.round(product.listed_price * 0.15),
    labour: Math.round(product.listed_price * 0.65),
    overhead: Math.round(product.listed_price * 0.08),
    heritage: Math.round(product.listed_price * 0.12),
    total: product.listed_price,
  };

  const formattedDate = product.created_at
    ? new Date(product.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "October 2026";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href={`/products/${product.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Details</span>
        </Link>

        <div className="flex items-center gap-2">
          {qrCodeDataUrl && (
            <a
              href={qrCodeDataUrl}
              download={`kalamulya-passport-${product.id}.png`}
              className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>Download QR</span>
            </a>
          )}

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>

      {/* PASSPORT CERTIFICATE CARD */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden print:border print:rounded-none">
        {/* Certificate Header Banner */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white p-6 sm:p-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-700/80 text-white font-bold flex items-center justify-center text-xs border border-amber-400/30">
                  ಕ
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
                  Digital Craft Passport
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{product.title}</h1>
              <p className="text-xs text-amber-200/90 flex items-center gap-2 pt-1">
                <span className="capitalize font-bold text-white">{product.craft_type}</span>
                <span>•</span>
                <span>Certificate #{product.id.slice(0, 8).toUpperCase()}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </span>
              </p>
            </div>

            {product.gi_tagged && (
              <span className="bg-amber-500 text-amber-950 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow">
                ★ Certified GI Heritage
              </span>
            )}
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Artisan & Provenance Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-stone-200 pb-8">
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-black text-xl flex items-center justify-center shrink-0 border border-amber-300">
                  {product.artisans?.name?.charAt(0) || "A"}
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Authentic Maker
                  </span>
                  <h2 className="text-xl font-black text-stone-900">{product.artisans?.name}</h2>
                  <p className="text-xs text-amber-800 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{product.artisans?.village}</span>
                  </p>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed pt-1">
                {product.artisans?.bio}
              </p>
            </div>

            {/* QR Code Block */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-2">
              {qrCodeDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrCodeDataUrl}
                  alt="Craft Passport QR"
                  className="w-32 h-32 rounded-xl border border-stone-300 shadow-sm"
                />
              ) : (
                <div className="w-32 h-32 bg-stone-200 animate-pulse rounded-xl" />
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                Scan to Verify Provenance
              </span>
            </div>
          </div>

          {/* Maker Story */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Maker Story</span>
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed italic bg-amber-50/40 p-4 rounded-xl border border-amber-200/60">
              &ldquo;{product.story}&rdquo;
            </p>
          </div>

          {/* Process Photos */}
          {product.process_photos && product.process_photos.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-900">
                Handcrafted Process ({product.hours} Hours)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {product.process_photos.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5"
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoUrl}
                        alt={`Process ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-amber-800 block">
                      Phase {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fair-Price Transparency Breakdown */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-baseline justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-900">
                Where Your Money Goes
              </h3>
              <span className="text-base font-bold text-stone-900">
                ₹{product.listed_price}
              </span>
            </div>

            {/* Visual Bar */}
            <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(breakdown.materials / product.listed_price) * 100}%` }}
                className="bg-sky-500"
              />
              <div
                style={{ width: `${(breakdown.labour / product.listed_price) * 100}%` }}
                className="bg-emerald-500"
              />
              <div
                style={{ width: `${(breakdown.overhead / product.listed_price) * 100}%` }}
                className="bg-amber-500"
              />
              <div
                style={{ width: `${(breakdown.heritage / product.listed_price) * 100}%` }}
                className="bg-purple-500"
              />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <span className="text-stone-400 block text-[10px]">Materials</span>
                <span className="font-bold text-stone-900">₹{breakdown.materials}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <span className="text-emerald-700 block text-[10px] font-bold">Artisan Labour</span>
                <span className="font-bold text-emerald-800">₹{breakdown.labour}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <span className="text-stone-400 block text-[10px]">Overhead</span>
                <span className="font-bold text-stone-900">₹{breakdown.overhead}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                <span className="text-purple-700 block text-[10px] font-bold">Heritage</span>
                <span className="font-bold text-purple-900">₹{breakdown.heritage}</span>
              </div>
            </div>
          </div>

          {/* Footer Seal */}
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Certified authentic Karnataka craft</span>
            </div>
            <span className="text-stone-400 text-[11px]">KalaMulya Craft Passport</span>
          </div>
        </div>
      </div>
    </div>
  );
}
