"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import confetti from "canvas-confetti";
import { 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft, 
  QrCode, 
  Sparkles, 
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
      setErrorMessage("Please fill in all delivery details.");
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

        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
      } else {
        throw new Error(data.error || "Failed to complete payment.");
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
        <span className="text-xs text-stone-500">Preparing checkout...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-stone-900">Craft Item Not Found</h1>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800">
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
              Order Confirmed
            </span>
            <h1 className="text-2xl font-black text-stone-900">
              Thank You for Supporting Local Artisans!
            </h1>
            <p className="text-xs text-stone-500">
              Order #{confirmedOrder.id}
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

          <div className="p-3 bg-stone-100 rounded-xl text-[11px] text-stone-500">
            Payment simulated in demo mode.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/passport/${product.id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>View Product Craft Passport</span>
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs border border-stone-300 transition flex items-center justify-center gap-2"
            >
              <span>Return to Storefront</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = product.listed_price * quantity;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <Link
          href={`/products/${product.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product</span>
        </Link>
        <h1 className="text-2xl font-black text-stone-900">Checkout</h1>
      </div>

      {/* Clean Demo Notice */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
        <span>Demo Store Notice: Payment is simulated for demonstration. No real card charge will occur.</span>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 space-y-5 shadow-sm">
          <h2 className="text-sm font-bold text-stone-900">Delivery Details</h2>

          <form onSubmit={handleSimulatePayment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name
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
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Phone Number
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
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Shipping Address
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
                className="w-full py-3.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? "Processing..."
                    : `Pay ₹${totalAmount.toLocaleString("en-IN")} (Simulated)`}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="md:col-span-5 bg-stone-50 rounded-3xl border border-stone-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-stone-900">Order Summary</h2>

          {/* Product Mini Card */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-stone-200">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0">
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
                By {product.artisans?.name || "Artisan"}
              </p>
              <p className="text-xs font-bold text-stone-900 mt-0.5">
                ₹{product.listed_price}
              </p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between text-xs border-y border-stone-200 py-3">
            <span className="font-semibold text-stone-700">Quantity</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((qty) => (
                <button
                  type="button"
                  key={qty}
                  onClick={() => setQuantity(qty)}
                  className={`w-7 h-7 rounded-lg font-bold text-xs transition ${
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
              <span>Subtotal ({quantity} item)</span>
              <span>₹{product.listed_price * quantity}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between text-stone-900 font-bold text-base pt-2 border-t border-stone-200">
              <span>Total</span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
