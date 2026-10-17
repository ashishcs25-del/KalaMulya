"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  RefreshCw, 
  Trash2, 
  Plus, 
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface Metrics {
  databaseMode: string;
  totalArtisans: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminPage() {
  const [password, setPassword] = useState<string>("kalamulya2026");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Admin Dashboard State
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [artisans, setArtisans] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "artisans" | "reset">("overview");
  const [actionMessage, setActionMessage] = useState<string>("");
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // New Artisan Form
  const [newArtisanName, setNewArtisanName] = useState("");
  const [newArtisanVillage, setNewArtisanVillage] = useState("");
  const [newArtisanCraft, setNewArtisanCraft] = useState("Kasuti Embroidery");
  const [newArtisanBio, setNewArtisanBio] = useState("");
  const [isAddingArtisan, setIsAddingArtisan] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, action: "verify" }),
      });
      const data = await res.json();
      if (data.success && data.authorized) {
        setIsAuthenticated(true);
        loadDashboardData();
      } else {
        setAuthError(data.error || "Incorrect admin password.");
      }
    } catch {
      setAuthError("Failed to authenticate. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const metricsRes = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, action: "metrics" }),
      });
      const metricsData = await metricsRes.json();
      if (metricsData.success) {
        setMetrics(metricsData.metrics);
      }

      const prodsRes = await fetch("/api/products");
      const prodsData = await prodsRes.json();
      if (prodsData.success) {
        setProducts(prodsData.products);
      }

      const artsRes = await fetch("/api/artisans");
      const artsData = await artsRes.json();
      if (artsData.success) {
        setArtisans(artsData.artisans);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  };

  const handleResetDatabase = async () => {
    const confirmReset = window.confirm("Reset products and orders to initial seed state?");
    if (!confirmReset) return;

    setIsResetting(true);
    setActionMessage("");

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, action: "reset" }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage("Database restored to initial seed state.");
        await loadDashboardData();
      }
    } catch {
      setActionMessage("Error resetting database.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleCreateArtisan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingArtisan(true);
    try {
      const res = await fetch("/api/artisans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newArtisanName,
          village: newArtisanVillage,
          craft: newArtisanCraft,
          bio: newArtisanBio,
          photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
          is_demo: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`Artisan "${newArtisanName}" registered successfully.`);
        setNewArtisanName("");
        setNewArtisanVillage("");
        setNewArtisanBio("");
        await loadDashboardData();
      }
    } catch {
      setActionMessage("Failed to register artisan.");
    } finally {
      setIsAddingArtisan(false);
    }
  };

  // PASSWORD GATE
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-6">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm space-y-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-stone-900">Admin Login</h1>
            <p className="text-xs text-stone-500 mt-1">
              Enter password to access platform controls.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10"
                />
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm shadow transition disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            Platform Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Database: {metrics?.databaseMode || "Active"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboardData}
            className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider block font-semibold">Artisans</span>
            <p className="text-2xl font-bold text-stone-900 mt-0.5">{metrics.totalArtisans}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider block font-semibold">Products</span>
            <p className="text-2xl font-bold text-stone-900 mt-0.5">{metrics.totalProducts}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider block font-semibold">Orders</span>
            <p className="text-2xl font-bold text-stone-900 mt-0.5">{metrics.totalOrders}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider block font-semibold">Total Revenue</span>
            <p className="text-2xl font-bold text-stone-900 mt-0.5">₹{metrics.totalRevenue.toLocaleString("en-IN")}</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        {[
          { id: "overview", label: "Overview" },
          { id: "products", label: `Products (${products.length})` },
          { id: "artisans", label: `Artisans (${artisans.length})` },
          { id: "reset", label: "Reset Database" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === tab.id
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm max-w-xl">
          <h2 className="text-sm font-bold text-stone-900">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/artisan/new"
              className="p-3 rounded-xl border border-stone-200 hover:border-amber-600 hover:bg-amber-50/40 transition flex items-center justify-between text-left block"
            >
              <div>
                <span className="text-xs font-semibold text-stone-900 block">➕ Add New Product</span>
                <span className="text-[11px] text-stone-500">Launch the guided artisan listing wizard</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </Link>

            <Link
              href="/seller"
              className="p-3 rounded-xl border border-stone-200 hover:border-amber-600 hover:bg-amber-50/40 transition flex items-center justify-between text-left block"
            >
              <div>
                <span className="text-xs font-semibold text-stone-900 block">🏪 Open Seller Portal</span>
                <span className="text-[11px] text-stone-500">Access seller store, customer orders, and payouts</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </Link>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS TABLE */}
      {activeTab === "products" && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-semibold text-xs text-stone-900">Products</h2>
            <Link
              href="/artisan/new"
              className="px-2.5 py-1 rounded-lg bg-amber-700 text-white font-semibold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Craft</th>
                  <th className="p-3">Maker</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 transition">
                    <td className="p-3 font-semibold text-stone-900 flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.main_photo_url}
                        alt=""
                        className="w-7 h-7 rounded-lg object-cover shrink-0"
                      />
                      <span className="truncate max-w-[200px]">{p.title}</span>
                    </td>
                    <td className="p-3 uppercase text-stone-500 text-[11px]">{p.craft_type}</td>
                    <td className="p-3 text-stone-700">{p.artisans?.name || "Artisan"}</td>
                    <td className="p-3 font-bold text-stone-900">₹{p.listed_price}</td>
                    <td className="p-3 space-x-2">
                      <Link
                        href={`/products/${p.id}`}
                        className="text-amber-800 hover:underline font-semibold inline-flex items-center gap-0.5"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <Link
                        href={`/passport/${p.id}`}
                        className="text-stone-600 hover:underline font-semibold"
                      >
                        Passport
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ARTISANS */}
      {activeTab === "artisans" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-stone-100">
              <h2 className="font-semibold text-xs text-stone-900">Registered Artisans</h2>
            </div>
            <div className="divide-y divide-stone-100">
              {artisans.map((a) => (
                <div key={a.id} className="p-3.5 flex items-start gap-3 hover:bg-stone-50 transition">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                    {a.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-xs text-stone-900">{a.name}</h3>
                      <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                        {a.craft}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400">{a.village}</p>
                    <p className="text-xs text-stone-600 mt-0.5 line-clamp-1">{a.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Add Artisan Form */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3 shadow-sm text-xs">
            <h2 className="font-semibold text-stone-900">Add Artisan</h2>
            <form onSubmit={handleCreateArtisan} className="space-y-2.5">
              <div>
                <label className="block text-stone-600 mb-0.5 font-medium">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Artisan Name"
                  value={newArtisanName}
                  onChange={(e) => setNewArtisanName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-0.5 font-medium">Village</label>
                <input
                  type="text"
                  required
                  placeholder="Village, District"
                  value={newArtisanVillage}
                  onChange={(e) => setNewArtisanVillage(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-0.5 font-medium">Craft</label>
                <input
                  type="text"
                  required
                  placeholder="Primary Craft"
                  value={newArtisanCraft}
                  onChange={(e) => setNewArtisanCraft(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-0.5 font-medium">Bio</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Background and experience..."
                  value={newArtisanBio}
                  onChange={(e) => setNewArtisanBio(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300"
                />
              </div>

              <button
                type="submit"
                disabled={isAddingArtisan}
                className="w-full py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold transition"
              >
                {isAddingArtisan ? "Saving..." : "Save Artisan"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: RESET */}
      {activeTab === "reset" && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 max-w-md shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-stone-900">Reset Store Data</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Wipes temporary orders and restores products to original seed catalog.
            </p>
          </div>

          <button
            onClick={handleResetDatabase}
            disabled={isResetting}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow transition flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isResetting ? "Resetting..." : "Reset Store Data"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
