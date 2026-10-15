"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  DollarSign, 
  RefreshCw, 
  ChevronRight,
  Loader2,
  AlertCircle,
  QrCode
} from "lucide-react";

interface OrderItem {
  id: string;
  product_id: string;
  buyer_name: string;
  buyer_phone: string;
  address: string;
  quantity: number;
  total: number;
  status: "New" | "Packed" | "Shipped";
  created_at: string;
  products?: {
    id: string;
    title: string;
    craft_type: string;
    main_photo_url: string;
    listed_price: number;
  };
}

export default function ArtisanOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: "New" | "Packed" | "Shipped") => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const newCount = orders.filter((o) => o.status === "New").length;
  const packedCount = orders.filter((o) => o.status === "Packed").length;
  const shippedCount = orders.filter((o) => o.status === "Shipped").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-1">
            <Package className="w-3.5 h-3.5 text-amber-700" />
            <span>Artisan Order Fulfillment Dashboard</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-stone-900">
            Incoming Orders & Packaging
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage simulated buyer orders and update parcel fulfillment status.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs flex items-center gap-2 shadow-sm transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Total Orders
          </span>
          <p className="text-2xl font-black text-stone-900">{orders.length}</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            New / To Pack
          </span>
          <p className="text-2xl font-black text-amber-900">{newCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
            Packed
          </span>
          <p className="text-2xl font-black text-blue-900">{packedCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Total Revenue
          </span>
          <p className="text-2xl font-black text-emerald-900">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
          <span className="text-sm text-stone-500">Loading incoming orders...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-4">
          <Package className="w-12 h-12 text-stone-300 mx-auto" />
          <h2 className="text-lg font-bold text-stone-900">No Orders Yet</h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            When buyers complete the simulated checkout on your items, they will appear right here for packaging.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-700 text-white text-xs font-bold"
          >
            <span>Visit Storefront & Place Test Order</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Orders List */}
      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const product = order.products;
            const isUpdating = updatingId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-stone-900">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "Recent"}
                    </span>
                  </div>

                  {/* Status Badges & Toggle */}
                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                    {(["New", "Packed", "Shipped"] as const).map((st) => (
                      <button
                        key={st}
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(order.id, st)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          order.status === st
                            ? st === "New"
                              ? "bg-amber-600 text-white shadow-sm"
                              : st === "Packed"
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-emerald-600 text-white shadow-sm"
                            : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Product Mini Info */}
                  <div className="md:col-span-5 flex items-center gap-3">
                    {product?.main_photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.main_photo_url}
                        alt="Product"
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-stone-100 shrink-0 flex items-center justify-center">
                        <Package className="w-6 h-6 text-stone-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-sm text-stone-900 line-clamp-1">
                        {product?.title || "Handcrafted Heritage Item"}
                      </h3>
                      <p className="text-xs text-stone-500">
                        Qty: <strong>{order.quantity}</strong> • Total:{" "}
                        <strong className="text-stone-900">₹{order.total}</strong>
                      </p>
                      {product?.id && (
                        <Link
                          href={`/passport/${product.id}`}
                          className="text-[11px] text-amber-800 hover:text-amber-950 font-bold inline-flex items-center gap-1 mt-0.5"
                        >
                          <QrCode className="w-3 h-3" />
                          <span>View Passport</span>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Buyer Delivery Information */}
                  <div className="md:col-span-7 bg-stone-50 p-3 rounded-xl border border-stone-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-stone-800">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-stone-500" />
                        <span>{order.buyer_name}</span>
                      </span>
                      <span className="flex items-center gap-1 text-stone-600">
                        <Phone className="w-3 h-3 text-stone-500" />
                        <span>{order.buyer_phone}</span>
                      </span>
                    </div>
                    <div className="text-stone-600 flex items-start gap-1 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{order.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
