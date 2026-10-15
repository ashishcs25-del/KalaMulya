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
  Package, 
  Users, 
  DollarSign, 
  Database, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Loader2
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
      // 1. Fetch Metrics
      const metricsRes = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, action: "metrics" }),
      });
      const metricsData = await metricsRes.json();
      if (metricsData.success) {
        setMetrics(metricsData.metrics);
      }

      // 2. Fetch Products
      const prodsRes = await fetch("/api/products");
      const prodsData = await prodsRes.json();
      if (prodsData.success) {
        setProducts(prodsData.products);
      }

      // 3. Fetch Artisans
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
    const confirmReset = window.confirm(
      "Are you sure you want to reset all products and orders to the initial seed state? This is ideal before recording your demo video."
    );
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
        setActionMessage("Database successfully reset and restored to seed state!");
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
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-stone-900">Admin Control Panel</h1>
            <p className="text-xs text-stone-500 mt-1">
              Protected administration interface for managing artisans, crafts, and database state.
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
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter ADMIN_PASSWORD"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 pl-10"
                />
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Default configured: <code className="bg-stone-100 px-1 py-0.5 rounded">kalamulya2026</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isVerifying ? "Verifying..." : "Access Admin Console"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Admin Authorized • DevHack 2026</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-stone-900">
            Platform Management & Database Controls
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Database Engine: <strong className="text-stone-800">{metrics?.databaseMode || "Active"}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboardData}
            className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
          >
            Lock Console
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Active Artisans
            </span>
            <p className="text-2xl font-black text-stone-900">{metrics.totalArtisans}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Listed Products
            </span>
            <p className="text-2xl font-black text-stone-900">{metrics.totalProducts}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Orders Placed
            </span>
            <p className="text-2xl font-black text-stone-900">{metrics.totalOrders}</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Simulated Revenue
            </span>
            <p className="text-2xl font-black text-emerald-900">
              ₹{metrics.totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        {[
          { id: "overview", label: "Overview & Controls" },
          { id: "products", label: `Products (${products.length})` },
          { id: "artisans", label: `Artisans (${artisans.length})` },
          { id: "reset", label: "Demo Reset & Reseed" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
              activeTab === tab.id
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & QUICK ACTIONS */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm">
            <h2 className="text-base font-black text-stone-900">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/artisan/new"
                className="w-full p-3.5 rounded-xl border border-stone-200 hover:border-amber-600 hover:bg-amber-50/50 transition flex items-center justify-between text-left group"
              >
                <div>
                  <span className="text-xs font-bold text-stone-900 block group-hover:text-amber-900">
                    ➕ List New Craft as Artisan
                  </span>
                  <span className="text-[11px] text-stone-500 block">
                    Launch guided stepper with materials, labor hours, and living wage check.
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800" />
              </Link>

              <Link
                href="/orders"
                className="w-full p-3.5 rounded-xl border border-stone-200 hover:border-amber-600 hover:bg-amber-50/50 transition flex items-center justify-between text-left group"
              >
                <div>
                  <span className="text-xs font-bold text-stone-900 block group-hover:text-amber-900">
                    📦 Open Orders Fulfillment Queue
                  </span>
                  <span className="text-[11px] text-stone-500 block">
                    Review pending packages and update status from New to Packed or Shipped.
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800" />
              </Link>

              <button
                onClick={handleResetDatabase}
                disabled={isResetting}
                className="w-full p-3.5 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-50 text-left transition flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-red-900 block">
                    🔄 Reset & Reseed Demo Data
                  </span>
                  <span className="text-[11px] text-red-700/80 block">
                    Restore the 3 demo artisans and 5 initial products before recording your video.
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>

          <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 space-y-4">
            <h2 className="text-base font-black text-stone-900">Hackathon Round 1 Deliverables</h2>
            <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Hero Product Seeded:</strong> &quot;Heritage Kasuti Embroidered Dupatta&quot; by Parvati Bai with complete materials breakdown and living wage verification.</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Explainable Pricing:</strong> Zero ML black-boxes. Pure formula accounts for materials, direct labor, overheads, and GI heritage value.</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Craft Passport & QR:</strong> Printable provenance certificate with downloadable packaging QR codes.</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Simulated Payments:</strong> Seamless end-to-end checkout with order fulfillment tracking.</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS TABLE */}
      {activeTab === "products" && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-bold text-sm text-stone-900">All Listed Products</h2>
            <Link
              href="/artisan/new"
              className="px-3 py-1.5 rounded-lg bg-amber-700 text-white font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Craft</th>
                  <th className="p-3.5">Maker</th>
                  <th className="p-3.5">Listed Price</th>
                  <th className="p-3.5">Cost Floor</th>
                  <th className="p-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/80 transition">
                    <td className="p-3.5 font-bold text-stone-900 flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.main_photo_url}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                      <span className="truncate max-w-[200px]">{p.title}</span>
                    </td>
                    <td className="p-3.5 uppercase text-stone-600">{p.craft_type}</td>
                    <td className="p-3.5 text-stone-800">{p.artisans?.name || "Artisan"}</td>
                    <td className="p-3.5 font-bold text-stone-900">₹{p.listed_price}</td>
                    <td className="p-3.5 text-stone-500">₹{p.floor_price}</td>
                    <td className="p-3.5 space-x-2">
                      <Link
                        href={`/products/${p.id}`}
                        className="text-amber-800 hover:underline font-bold inline-flex items-center gap-0.5"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <Link
                        href={`/passport/${p.id}`}
                        className="text-stone-700 hover:underline font-bold inline-flex items-center gap-0.5"
                      >
                        <span>Passport</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ARTISANS & ADD ARTISAN */}
      {activeTab === "artisans" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Artisans List */}
            <div className="md:col-span-2 bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-stone-100">
                <h2 className="font-bold text-sm text-stone-900">Registered Artisans</h2>
              </div>
              <div className="divide-y divide-stone-100">
                {artisans.map((a) => (
                  <div key={a.id} className="p-4 flex items-start gap-3 hover:bg-stone-50 transition">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-black flex items-center justify-center shrink-0">
                      {a.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-stone-900">{a.name}</h3>
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                          {a.craft}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">{a.village}</p>
                      <p className="text-xs text-stone-600 mt-1 line-clamp-2">{a.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Add Artisan Form */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm">
              <h2 className="font-bold text-sm text-stone-900">Register New Artisan</h2>
              <form onSubmit={handleCreateArtisan} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Artisan Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Parvati Bai"
                    value={newArtisanName}
                    onChange={(e) => setNewArtisanName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Village / District</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dharwad, Karnataka"
                    value={newArtisanVillage}
                    onChange={(e) => setNewArtisanVillage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Primary Craft</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasuti Embroidery"
                    value={newArtisanCraft}
                    onChange={(e) => setNewArtisanCraft(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Artisan Bio</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Generations of experience, traditional techniques..."
                    value={newArtisanBio}
                    onChange={(e) => setNewArtisanBio(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAddingArtisan}
                  className="w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition"
                >
                  {isAddingArtisan ? "Registering..." : "Add Artisan Profile"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DEMO RESET */}
      {activeTab === "reset" && (
        <div className="bg-white rounded-3xl border border-stone-200 p-8 space-y-6 max-w-2xl shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-amber-700" />
              <span>Reset & Reseed Demo Data</span>
            </h2>
            <p className="text-xs text-stone-500">
              Ideal before recording your demo video or submitting to DevHack judges.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
            <p className="font-bold">What this does:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Wipes any temporary test orders created during checkout tests.</li>
              <li>Restores the 3 demo artisans (Parvati Bai, Laxmi Poojary, Anand Gudigar).</li>
              <li>Restores the 5 benchmark products including the verified Hero Kasuti Dupatta.</li>
              <li>Maintains all pricing calibrations and formula rules.</li>
            </ul>
          </div>

          <button
            onClick={handleResetDatabase}
            disabled={isResetting}
            className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow transition flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isResetting ? "Resetting Database..." : "Execute Database Reseed Now"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
