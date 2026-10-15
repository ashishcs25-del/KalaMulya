"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  QrCode, 
  ChevronRight, 
  MapPin, 
  CheckCircle2, 
  Scale, 
  ShieldCheck, 
  Clock, 
  Award, 
  Sparkles,
  ArrowLeft,
  Loader2,
  AlertCircle
} from "lucide-react";

interface ProductDetail {
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
  artisans?: {
    id: string;
    name: string;
    village: string;
    craft: string;
    bio: string;
    photo_url?: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activePhoto, setActivePhoto] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.product) {
            setProduct(data.product);
            setActivePhoto(data.product.main_photo_url);
          }
        })
        .catch((err) => console.error("Error fetching product:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
        <span className="text-sm text-stone-500">Loading craft details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
        <h1 className="text-2xl font-bold text-stone-900">Craft Item Not Found</h1>
        <p className="text-sm text-stone-500">The product you are looking for may have been updated or removed.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 text-white text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
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

  const allPhotos = [product.main_photo_url, ...(product.process_photos || [])].filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
        <Link href="/" className="hover:text-amber-800 transition">
          Storefront
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="capitalize">{product.craft_type}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-stone-900 truncate max-w-xs">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Photos Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activePhoto || product.main_photo_url}
              alt={product.title}
              className="w-full h-full object-cover transition duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.is_demo && (
                <span className="bg-stone-900/80 backdrop-blur text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow">
                  Demo Data
                </span>
              )}
              {product.gi_tagged && (
                <span className="bg-amber-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                  Certified GI Heritage
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {allPhotos.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allPhotos.map((photoUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhoto(photoUrl)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                    activePhoto === photoUrl
                      ? "border-amber-600 ring-2 ring-amber-500/30"
                      : "border-stone-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Maker Bio Card */}
          {product.artisans && (
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3 mt-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                Crafted With Heritage
              </span>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-200 text-amber-950 font-black text-xl flex items-center justify-center shrink-0">
                  {product.artisans.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-stone-900">{product.artisans.name}</h3>
                  <p className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    <span>{product.artisans.village}</span>
                    <span>•</span>
                    <span className="font-medium text-amber-900">{product.artisans.craft}</span>
                  </p>
                </div>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed pt-1">{product.artisans.bio}</p>
            </div>
          )}

          {/* Maker Story */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3">
            <h3 className="font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Maker&apos;s Craft Story</span>
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed italic bg-stone-50 p-4 rounded-xl border border-stone-100">
              &ldquo;{product.story}&rdquo;
            </p>
          </div>
        </div>

        {/* Right Column: Pricing & Purchase */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-6 shadow-sm sticky top-24">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                {product.craft_type.toUpperCase()} • {product.product_type}
              </span>
              <h1 className="text-2xl font-black text-stone-900 mt-1">{product.title}</h1>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-stone-500 font-medium block">Transparent Fair Price</span>
                <span className="text-3xl font-black text-stone-900">
                  ₹{product.listed_price.toLocaleString("en-IN")}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Fair-Wage Verified</span>
              </span>
            </div>

            {/* "Where your money goes" Breakdown */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                <span>Where Your Money Goes:</span>
                <span className="text-stone-500 font-medium">100% Transparent</span>
              </div>

              {/* Progress Bar */}
              <div className="h-3.5 w-full bg-stone-200 rounded-full overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${(breakdown.materials / product.listed_price) * 100}%` }}
                  className="bg-sky-500"
                  title={`Materials: ₹${breakdown.materials}`}
                />
                <div
                  style={{ width: `${(breakdown.labour / product.listed_price) * 100}%` }}
                  className="bg-emerald-500"
                  title={`Labour: ₹${breakdown.labour}`}
                />
                <div
                  style={{ width: `${(breakdown.overhead / product.listed_price) * 100}%` }}
                  className="bg-amber-500"
                  title={`Overhead: ₹${breakdown.overhead}`}
                />
                <div
                  style={{ width: `${(breakdown.heritage / product.listed_price) * 100}%` }}
                  className="bg-purple-500"
                  title={`Heritage: ₹${breakdown.heritage}`}
                />
              </div>

              {/* Itemized Legend */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                    <span>Raw Materials</span>
                  </span>
                  <span className="font-bold text-stone-900 mt-0.5">₹{breakdown.materials}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Artisan Labour ({product.hours}h)</span>
                  </span>
                  <span className="font-bold text-emerald-800 mt-0.5">₹{breakdown.labour}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Workshop Overhead</span>
                  </span>
                  <span className="font-bold text-stone-900 mt-0.5">₹{breakdown.overhead}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col">
                  <span className="text-stone-500 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span>Heritage Value</span>
                  </span>
                  <span className="font-bold text-purple-900 mt-0.5">₹{breakdown.heritage}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-stone-100">
              <div>
                <span className="text-stone-400 block">Time</span>
                <span className="font-bold text-stone-800">{product.hours} Hours</span>
              </div>
              <div>
                <span className="text-stone-400 block">Skill</span>
                <span className="font-bold text-stone-800 capitalize">{product.skill_level}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Complexity</span>
                <span className="font-bold text-stone-800 capitalize">{product.complexity}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <Link
                href={`/checkout/${product.id}`}
                className="w-full py-4 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-base shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Buy Now (Simulated Checkout)</span>
                <ChevronRight className="w-5 h-5" />
              </Link>

              <Link
                href={`/passport/${product.id}`}
                className="w-full py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm transition flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4 text-stone-700" />
                <span>View Full Craft Passport & QR</span>
              </Link>
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-stone-400 text-center">
              Payment is simulated (demo). All proceeds go directly to {product.artisans?.name || "the artisan"}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
