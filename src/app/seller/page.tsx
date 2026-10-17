"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Store, 
  Lock, 
  KeyRound, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  DollarSign, 
  Plus, 
  ExternalLink, 
  QrCode, 
  LogOut, 
  RefreshCw,
  AlertCircle,
  Loader2
} from "lucide-react";

interface Artisan {
  id: string;
  name: string;
  village: string;
  craft: string;
  bio: string;
}

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
    artisan_id?: string;
    title: string;
    craft_type: string;
    main_photo_url: string;
    listed_price: number;
  };
}

export default function SellerPortalPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [selectedArtisanId, setSelectedArtisanId] = useState<string>("");
  const [pin, setPin] = useState<string>("1234");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  // Seller store data
  const [currentArtisan, setCurrentArtisan] = useState<Artisan | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Load artisans list
    fetch("/api/artisans")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.artisans.length > 0) {
          setArtisans(data.artisans);
          setSelectedArtisanId(data.artisans[0].id);

          // Check if previously logged in
          const savedArtisanId = localStorage.getItem("kalamulya_seller_id");
          if (savedArtisanId) {
            const found = data.artisans.find((a: Artisan) => a.id === savedArtisanId);
            if (found) {
              setCurrentArtisan(found);
              setSelectedArtisanId(found.id);
              setIsAuthenticated(true);
            }
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentArtisan) {
      loadStoreData(currentArtisan.id);
    }
  }, [isAuthenticated, currentArtisan]);

  const loadStoreData = async (artisanId: string) => {
    setLoading(true);
    try {
      // Fetch all products
      const prodsRes = await fetch("/api/products");
      const prodsData = await prodsRes.json();
      let myProducts: any[] = [];
      if (prodsData.success && Array.isArray(prodsData.products)) {
        myProducts = prodsData.products.filter(
          (p: any) => p.artisan_id === artisanId || p.artisans?.id === artisanId
        );
        setProducts(myProducts);
      }

      // Fetch all orders
      const ordersRes = await fetch("/api/orders");
      const ordersData = await ordersRes.json();
      if (ordersData.success && Array.isArray(ordersData.orders)) {
        // Filter orders belonging to this artisan's products
        const myProductIds = new Set(myProducts.map((p) => p.id));
        const myOrders = ordersData.orders.filter(
          (o: OrderItem) =>
            myProductIds.has(o.product_id) ||
            o.products?.artisan_id === artisanId
        );
        // If no orders match this specific artisan yet in demo, show all orders so seller can review demo orders
        setOrders(myOrders.length > 0 ? myOrders : ordersData.orders);
      }
    } catch (err) {
      console.error("Failed to load store data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!selectedArtisanId) {
      setAuthError("Please select an artisan profile.");
      return;
    }

    // Default PIN: 1234
    if (pin.trim() !== "1234") {
      setAuthError("Incorrect PIN. Default PIN is 1234.");
      return;
    }

    const found = artisans.find((a) => a.id === selectedArtisanId);
    if (found) {
      setCurrentArtisan(found);
      setIsAuthenticated(true);
      try {
        localStorage.setItem("kalamulya_seller_id", found.id);
      } catch {}
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentArtisan(null);
    try {
      localStorage.removeItem("kalamulya_seller_id");
    } catch {}
  };

  const handleUpdateStatus = async (orderId: string, newStatus: "New" | "Packed" | "Shipped") => {
    setUpdatingOrderId(orderId);
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
      console.error("Error updating status:", err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Metrics
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === "New" || o.status === "Packed").length;
  const totalEarnings = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  // LOGIN FORM VIEW
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-6">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
            <Store className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-stone-900">Artisan & Seller Login</h1>
            <p className="text-xs text-stone-500 mt-1">
              Access your personal store dashboard, customer orders, and product catalog.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Select Your Artisan Profile
              </label>
              <select
                value={selectedArtisanId}
                onChange={(e) => setSelectedArtisanId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {artisans.map((artisan) => (
                  <option key={artisan.id} value={artisan.id}>
                    {artisan.name} ({artisan.craft} • {artisan.village})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Security PIN / Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10"
                />
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Default demo PIN: <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">1234</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow transition flex items-center justify-center gap-2"
            >
              <span>Access My Store</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // LOGGED-IN SELLER DASHBOARD
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Seller Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-700 text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-sm">
            {currentArtisan?.name?.charAt(0) || "A"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Active Artisan Store
              </span>
            </div>
            <h1 className="text-2xl font-black text-stone-900 mt-0.5">
              {currentArtisan?.name}
            </h1>
            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>{currentArtisan?.village}</span>
              <span>•</span>
              <span className="text-stone-700 font-medium">{currentArtisan?.craft}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/artisan/new"
            className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>List New Craft Piece</span>
          </Link>

          <button
            onClick={() => loadStoreData(currentArtisan!.id)}
            className="p-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 transition"
            title="Refresh Store Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
          <span className="text-[11px] text-stone-500 uppercase tracking-wider block font-semibold">
            My Listed Products
          </span>
          <p className="text-2xl font-bold text-stone-900 mt-1">{products.length}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
          <span className="text-[11px] text-stone-500 uppercase tracking-wider block font-semibold">
            Customer Orders
          </span>
          <p className="text-2xl font-bold text-stone-900 mt-1">{totalOrdersCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm">
          <span className="text-[11px] text-amber-800 uppercase tracking-wider block font-semibold">
            To Pack / Ship
          </span>
          <p className="text-2xl font-bold text-amber-950 mt-1">{pendingCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm">
          <span className="text-[11px] text-emerald-800 uppercase tracking-wider block font-semibold">
            Total Earnings
          </span>
          <p className="text-2xl font-bold text-emerald-900 mt-1">
            ₹{totalEarnings.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === "orders"
              ? "bg-stone-900 text-white"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === "products"
              ? "bg-stone-900 text-white"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>My Products Catalog ({products.length})</span>
        </button>
      </div>

      {/* TAB 1: CUSTOMER ORDERS */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
              <Package className="w-10 h-10 text-stone-300 mx-auto" />
              <h2 className="text-base font-bold text-stone-800">No Orders Yet</h2>
              <p className="text-xs text-stone-500">
                When customers purchase your craft items on the storefront, their orders will appear here for packaging.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const product = order.products;
                const isUpdating = updatingOrderId === order.id;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })
                            : "Recent"}
                        </span>
                      </div>

                      {/* Status Toggle */}
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

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Product Info */}
                      <div className="md:col-span-5 flex items-center gap-3">
                        {product?.main_photo_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.main_photo_url}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200"
                          />
                        )}
                        <div>
                          <h3 className="font-bold text-xs text-stone-900 line-clamp-1">
                            {product?.title || "Handcrafted Item"}
                          </h3>
                          <p className="text-xs text-stone-500">
                            Qty: <strong>{order.quantity}</strong> • Payout:{" "}
                            <strong className="text-stone-900">₹{order.total}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Buyer Details */}
                      <div className="md:col-span-7 bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-stone-800">
                          <span>{order.buyer_name}</span>
                          <span className="font-medium text-stone-600">{order.buyer_phone}</span>
                        </div>
                        <p className="text-stone-500 line-clamp-1">{order.address}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY PRODUCTS */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.main_photo_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {product.gi_tagged && (
                    <span className="absolute top-2 left-2 bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                      GI Tagged
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-stone-500">{product.product_type}</p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Listed Price</span>
                      <span className="font-bold text-stone-900 text-sm">
                        ₹{product.listed_price}
                      </span>
                    </div>

                    <Link
                      href={`/passport/${product.id}`}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <QrCode className="w-3 h-3" />
                      <span>Passport</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
