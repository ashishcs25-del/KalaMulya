"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import confetti from "canvas-confetti";
import { 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  QrCode, 
  Sparkles, 
  MapPin, 
  Lock, 
  AlertCircle,
  Loader2,
  PackageCheck
} from "lucide-react";

interface ProductCheckout {
  id: string;
  title: string;
  craft_type: string;
  listed_price: number;
  main_photo_url: string;
  is_demo: boolean;
  artisans?: {
    name: string;
    village: string;
  };
}

export default function CheckoutPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<ProductCheckout | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [buyerName, setBuyerName] = useState<string>("Siddharth Rao");
  const [buyerPhone, setBuyerPhone] = useState<string>("9876543210");
  const [address, setAddress] = useState<string>("Flat 402, Kadri Hills, Mangaluru, Karnataka - 575004");
  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Confirmed Order
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.product) {
            setProduct(data.product);
          }
        })
        .catch((err) => console.error("Error loading product:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (!buyerName.trim() || !buyerPhone.trim() || !address.trim()) {
      setErrorMessage("Please fill in all buyer details.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const totalAmount = product.listed_price * quantity;
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
          address,
          quantity,
          total: totalAmount,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setConfirmedOrder(data.order);

        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // Ignore confetti errors if canvas unavailable
        }
      } else {
        throw new Error(data.error || "Failed to process simulated payment.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
        <span className="text-sm text-stone-500">Preparing secure checkout...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-stone-900">Craft Item Not Found</h1>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-800">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Marketplace</span>
        </Link>
      </div>
    );
  }

  // ORDER CONFIRMATION VIEW
  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
            <PackageCheck className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Payment Simulated • Order Confirmed
            </span>
            <h1 className="text-2xl font-black text-stone-900">
              Thank You for Supporting Local Artisans!
            </h1>
            <p className="text-xs text-stone-500">
              Order #{confirmedOrder.id} • Registered in Artisan Fulfillment System
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-left space-y-2 text-xs">
            <div className="flex justify-between font-bold text-stone-900">
              <span>{product.title} (x{quantity})</span>
              <span>₹{confirmedOrder.total}</span>
            </div>
            <div className="text-stone-600">
              <p>Maker: <strong>{product.artisans?.name || "Local Artisan"}</strong> ({product.artisans?.village})</p>
              <p>Recipient: {confirmedOrder.buyer_name} ({confirmedOrder.buyer_phone})</p>
              <p>Delivery: {confirmedOrder.address}</p>
            </div>
          </div>

          <div className="p-3 bg-stone-100 rounded-xl text-[11px] text-stone-600">
            ℹ️ Notice: Payment is simulated (demo). In a live deployment, funds transfer directly to the artisan cooperative.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/passport/${product.id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>View Product Craft Passport</span>
            </Link>

            <Link
              href="/orders"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-sm border border-stone-300 transition flex items-center justify-center gap-2"
            >
              <span>View Artisan Orders Queue</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = product.listed_price * quantity;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <Link
          href={`/products/${product.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product</span>
        </Link>
        <h1 className="text-2xl font-black text-stone-900">Direct Artisan Checkout</h1>
        <p className="text-xs text-stone-500">
          Transparent, fair commerce directly supporting traditional Karnataka makers.
        </p>
      </div>

      {/* Simulated Payment Banner */}
      <div className="p-4 rounded-2xl bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold flex items-center gap-2 shadow-sm">
        <Sparkles className="w-4 h-4 text-amber-800 shrink-0" />
        <span>Hackathon Prototype Notice: Payment is simulated (demo). No credit card required.</span>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 space-y-6 shadow-sm">
          <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs flex items-center justify-center">
              1
            </span>
            <span>Buyer Delivery Details</span>
          </h2>

          <form onSubmit={handleSimulatePayment} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Contact Phone Number *
              </label>
              <input
                type="tel"
                required
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Shipping Address in India *
              </label>
              <textarea
                rows={3}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-black text-base shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? "Confirming Simulated Order..."
                    : `Pay ₹${totalAmount.toLocaleString("en-IN")} (Simulated Demo)`}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="md:col-span-5 bg-stone-50 rounded-3xl border border-stone-200 p-6 space-y-5">
          <h2 className="text-base font-black text-stone-900">Order Summary</h2>

          {/* Product Mini Card */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-stone-200">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.main_photo_url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xs text-stone-900 truncate">{product.title}</h3>
              <p className="text-[11px] text-amber-800 font-medium">
                By {product.artisans?.name || "Karnataka Artisan"}
              </p>
              <p className="text-xs font-black text-stone-900 mt-0.5">
                ₹{product.listed_price} / unit
              </p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between text-xs border-y border-stone-200 py-3">
            <span className="font-bold text-stone-700">Quantity</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((qty) => (
                <button
                  type="button"
                  key={qty}
                  onClick={() => setQuantity(qty)}
                  className={`w-8 h-8 rounded-lg font-bold text-xs transition ${
                    quantity === qty
                      ? "bg-stone-900 text-white"
                      : "bg-white border border-stone-300 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {qty}
                </button>
              ))}
            </div>
          </div>

          {/* Price Calculation */}
          <div className="space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Item Subtotal ({quantity}x)</span>
              <span>₹{product.listed_price * quantity}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Artisan Direct Shipping</span>
              <span>FREE (Demo)</span>
            </div>
            <div className="flex justify-between text-stone-900 font-black text-base pt-2 border-t border-stone-200">
              <span>Total Payable</span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-stone-200 text-[11px] text-stone-500 space-y-1">
            <p className="font-bold text-stone-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Goes to the Maker</span>
            </p>
            <p>KalaMulya takes zero platform commission on this purchase.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
