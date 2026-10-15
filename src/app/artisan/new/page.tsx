"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Scale, 
  Layers, 
  Clock, 
  Award, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Image as ImageIcon, 
  Upload, 
  BookOpen, 
  DollarSign, 
  Check, 
  ArrowRight,
  User,
  ShieldCheck,
  Info
} from "lucide-react";
import craftsData from "../../../../data/crafts.json";
import { calculateFairPrice, PricingResult } from "@/lib/pricing";

interface MaterialRow {
  name: string;
  qty: number;
  unitPriceInr: number;
}

interface ArtisanOption {
  id: string;
  name: string;
  village: string;
  craft: string;
}

const PRESET_PHOTOS = {
  kasuti: {
    main: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    process: [
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1528458876861-544fd1761a91?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    ],
  },
  beedu: {
    main: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
    process: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
    ],
  },
  kinhal: {
    main: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    process: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    ],
  },
};

export default function NewProductStepper() {
  const router = useRouter();

  // Wizard Step: 1 = Craft & Maker, 2 = Materials & Hours, 3 = Price Result, 4 = Story & Photos
  const [step, setStep] = useState<number>(1);

  // Artisans list
  const [artisans, setArtisans] = useState<ArtisanOption[]>([]);
  const [selectedArtisanId, setSelectedArtisanId] = useState<string>("");
  const [newArtisanName, setNewArtisanName] = useState<string>("");
  const [newArtisanVillage, setNewArtisanVillage] = useState<string>("");

  // Step 1: Craft & Product Selection
  const [craftType, setCraftType] = useState<string>("kasuti");
  const [productType, setProductType] = useState<string>("Dupatta");
  const [customProductTitle, setCustomProductTitle] = useState<string>("");

  // Step 2: Cost & Labor Inputs
  const [materials, setMaterials] = useState<MaterialRow[]>([
    { name: "Handloom Cotton Fabric (2.5m)", qty: 1, unitPriceInr: 250 },
    { name: "Silk Floss & Needle Set", qty: 3, unitPriceInr: 50 },
  ]);
  const [hoursSpent, setHoursSpent] = useState<number>(20);
  const [skillLevel, setSkillLevel] = useState<"apprentice" | "skilled" | "master">("skilled");
  const [giTagged, setGiTagged] = useState<boolean>(true);
  const [complexity, setComplexity] = useState<"simple" | "moderate" | "intricate">("intricate");

  // Step 3: Pricing Engine Output & Listed Price
  const [priceResult, setPriceResult] = useState<PricingResult | null>(null);
  const [listedPrice, setListedPrice] = useState<number>(3690);

  // Step 4: Story & Photos
  const [mentor, setMentor] = useState<string>("My grandmother");
  const [specialDetail, setSpecialDetail] = useState<string>("Traditional Gopura and peacock motifs stitched without tying knots");
  const [timeTakenText, setTimeTakenText] = useState<string>("20 hours of concentrated hand-stitching over two weeks");
  const [draftedStory, setDraftedStory] = useState<string>("");
  const [isDraftingStory, setIsDraftingStory] = useState<boolean>(false);
  const [mainPhotoUrl, setMainPhotoUrl] = useState<string>(PRESET_PHOTOS.kasuti.main);
  const [processPhotos, setProcessPhotos] = useState<string[]>(PRESET_PHOTOS.kasuti.process);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Load Artisans on mount
  useEffect(() => {
    fetch("/api/artisans")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.artisans.length > 0) {
          setArtisans(data.artisans);
          setSelectedArtisanId(data.artisans[0].id);
        }
      })
      .catch(() => {});
  }, []);

  // Update craft defaults
  const activeCraftConfig = craftsData.find((c) => c.id === craftType) || craftsData[0];

  const handleCraftChange = (newCraft: string) => {
    setCraftType(newCraft);
    const cfg = craftsData.find((c) => c.id === newCraft) || craftsData[0];
    setProductType(cfg.productTypes[0]);
    setGiTagged(cfg.giTagged);
    if (cfg.commonMaterials && cfg.commonMaterials.length > 0) {
      setMaterials(
        cfg.commonMaterials.map((m) => ({
          name: m.name,
          qty: 1,
          unitPriceInr: m.defaultPrice,
        }))
      );
    }
    const presets = PRESET_PHOTOS[newCraft as keyof typeof PRESET_PHOTOS];
    if (presets) {
      setMainPhotoUrl(presets.main);
      setProcessPhotos(presets.process);
    }
  };

  // Material Row Actions
  const handleAddMaterial = () => {
    setMaterials([...materials, { name: "", qty: 1, unitPriceInr: 50 }]);
  };

  const handleRemoveMaterial = (index: number) => {
    if (materials.length > 1) {
      setMaterials(materials.filter((_, i) => i !== index));
    }
  };

  const handleUpdateMaterial = (
    index: number,
    field: keyof MaterialRow,
    value: string | number
  ) => {
    const updated = [...materials];
    updated[index] = { ...updated[index], [field]: value };
    setMaterials(updated);
  };

  // Calculate Price when moving to Step 3
  const handleProceedToPricing = () => {
    setErrorMessage("");
    const cleanedMaterials = materials.filter((m) => m.name.trim().length > 0 && m.qty > 0);
    if (cleanedMaterials.length === 0) {
      setErrorMessage("Please enter at least one valid material row.");
      return;
    }
    if (hoursSpent <= 0) {
      setErrorMessage("Hours spent must be at least 1 hour.");
      return;
    }

    const calcResult = calculateFairPrice({
      craftType,
      productType,
      materials: cleanedMaterials,
      hoursSpent,
      skillLevel,
      giTagged,
      complexity,
    });

    if (!calcResult.success) {
      setErrorMessage(calcResult.error);
      return;
    }

    setPriceResult(calcResult);
    setListedPrice(calcResult.target);
    setStep(3);
  };

  // Draft Story using API
  const handleDraftStory = async () => {
    setIsDraftingStory(true);
    setErrorMessage("");

    const currentArtisan = artisans.find((a) => a.id === selectedArtisanId);
    const artisanName = currentArtisan ? currentArtisan.name : newArtisanName || "Master Artisan";
    const village = currentArtisan ? currentArtisan.village : newArtisanVillage || "Karnataka";

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artisanName,
          craftName: activeCraftConfig.name,
          productTitle: customProductTitle || `${activeCraftConfig.name} ${productType}`,
          village,
          mentor,
          specialDetail,
          timeTaken: timeTakenText || `${hoursSpent} hours of handcrafted work`,
        }),
      });
      const data = await res.json();
      if (data.success && data.story) {
        setDraftedStory(data.story);
      } else {
        setErrorMessage("Could not generate story draft. You can write your story directly below.");
      }
    } catch {
      setErrorMessage("Story generator unavailable. You can write your story directly below.");
    } finally {
      setIsDraftingStory(false);
    }
  };

  // Publish Product & Generate Passport
  const handlePublish = async () => {
    if (!priceResult) return;
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      let finalArtisanId = selectedArtisanId;

      // If creating new artisan
      if (selectedArtisanId === "new" || !selectedArtisanId) {
        const artisanRes = await fetch("/api/artisans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newArtisanName || "Traditional Artisan",
            village: newArtisanVillage || "Karnataka",
            craft: activeCraftConfig.name,
            bio: `Practitioner of authentic ${activeCraftConfig.name} in ${newArtisanVillage || "Karnataka"}.`,
            photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
            is_demo: true,
          }),
        });
        const artisanData = await artisanRes.json();
        if (artisanData.success) {
          finalArtisanId = artisanData.artisan.id;
        } else {
          throw new Error("Failed to register artisan profile.");
        }
      }

      const productPayload = {
        artisan_id: finalArtisanId,
        title: customProductTitle || `Handcrafted ${activeCraftConfig.name} ${productType}`,
        craft_type: craftType,
        product_type: productType,
        description: `Handcrafted authentic ${activeCraftConfig.name} by traditional master makers.`,
        materials: materials.filter((m) => m.name.trim().length > 0),
        hours: hoursSpent,
        skill_level: skillLevel,
        gi_tagged: giTagged,
        complexity,
        price_breakdown: priceResult.breakdown,
        floor_price: priceResult.floor,
        target_price: priceResult.target,
        listed_price: listedPrice,
        story: draftedStory || `Crafted with devotion using traditional ${activeCraftConfig.name} techniques.`,
        main_photo_url: mainPhotoUrl,
        process_photos: processPhotos,
        status: "active",
        is_demo: true,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      });

      const resData = await res.json();
      if (resData.success && resData.product) {
        router.push(`/passport/${resData.product.id}`);
      } else {
        throw new Error(resData.error || "Failed to publish craft item.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while publishing.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Page Title & Context */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
          <Scale className="w-3.5 h-3.5 text-amber-700" />
          <span>Artisan Fair-Price Engine & Craft Passport Wizard</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">
          List Your Craft & Calculate Fair Price
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Answer a few guided questions. We calculate a fair price range that honors your time and heritage.
        </p>
      </div>

      {/* Progress Stepper Bar */}
      <div className="grid grid-cols-4 gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
        {[
          { num: 1, label: "Craft & Maker", icon: User },
          { num: 2, label: "Materials & Hours", icon: Layers },
          { num: 3, label: "Fair Price Result", icon: DollarSign },
          { num: 4, label: "Story & Passport", icon: BookOpen },
        ].map((s) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <button
              key={s.num}
              disabled={step < s.num}
              onClick={() => {
                if (s.num <= 2) setStep(s.num);
                else if (s.num === 3 && priceResult) setStep(3);
                else if (s.num === 4 && priceResult) setStep(4);
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition ${
                isActive
                  ? "bg-amber-700 text-white shadow-sm"
                  : isDone
                  ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                  : "text-stone-400"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">Step {s.num}</span>
            </button>
          );
        })}
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: CRAFT & MAKER PROFILE */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs flex items-center justify-center">
                1
              </span>
              <span>Who is making this craft?</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Select an existing registered artisan or add your details.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {artisans.map((artisan) => (
              <button
                type="button"
                key={artisan.id}
                onClick={() => setSelectedArtisanId(artisan.id)}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  selectedArtisanId === artisan.id
                    ? "border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20"
                    : "border-stone-200 hover:border-stone-300 bg-white"
                }`}
              >
                <div>
                  <p className="font-bold text-stone-900 text-sm">{artisan.name}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{artisan.village}</p>
                </div>
                <span className="text-[11px] font-medium text-amber-800 mt-2 block">
                  {artisan.craft}
                </span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => setSelectedArtisanId("new")}
              className={`p-3.5 rounded-xl border border-dashed text-left transition flex flex-col justify-center items-center gap-1 ${
                selectedArtisanId === "new"
                  ? "border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20"
                  : "border-stone-300 hover:border-stone-400 bg-stone-50"
              }`}
            >
              <Plus className="w-5 h-5 text-stone-600" />
              <span className="text-xs font-bold text-stone-800">Add New Artisan</span>
            </button>
          </div>

          {selectedArtisanId === "new" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Artisan Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Parvati Bai"
                  value={newArtisanName}
                  onChange={(e) => setNewArtisanName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Village / District *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dharwad, Karnataka"
                  value={newArtisanVillage}
                  onChange={(e) => setNewArtisanVillage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* Craft Selection */}
          <div className="pt-4 border-t border-stone-100 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Select Heritage Craft Type</h3>
              <p className="text-xs text-stone-500">
                Craft type determines benchmark market comparables and heritage protections.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {craftsData.map((craft) => (
                <button
                  type="button"
                  key={craft.id}
                  onClick={() => handleCraftChange(craft.id)}
                  className={`p-4 rounded-xl border text-left transition space-y-1 ${
                    craftType === craft.id
                      ? "border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-900">{craft.name}</span>
                    {craft.giTagged && (
                      <span className="text-[10px] bg-amber-600 text-white font-bold px-1.5 py-0.5 rounded">
                        GI
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-2">{craft.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Product Type & Custom Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Product Category *
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {activeCraftConfig.productTypes.map((pt) => (
                  <option key={pt} value={pt}>
                    {pt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Custom Title (Optional)
              </label>
              <input
                type="text"
                placeholder={`e.g. Masterpiece ${activeCraftConfig.name} ${productType}`}
                value={customProductTitle}
                onChange={(e) => setCustomProductTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow-sm transition flex items-center gap-2"
            >
              <span>Continue to Materials & Labor</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: MATERIALS, LABOR & HERITAGE */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs flex items-center justify-center">
                2
              </span>
              <span>Raw Materials & Handcrafted Labor</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Add every material you purchased and hours spent. Nothing is hidden.
            </p>
          </div>

          {/* Materials Row Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                1. Purchased Raw Materials
              </label>
              <button
                type="button"
                onClick={handleAddMaterial}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Material Row</span>
              </button>
            </div>

            <div className="space-y-2">
              {materials.map((mat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200"
                >
                  <input
                    type="text"
                    placeholder="Material name (e.g. Cotton cloth, Silk floss)"
                    value={mat.name}
                    onChange={(e) => handleUpdateMaterial(idx, "name", e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 text-sm bg-white"
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-stone-500">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={mat.qty}
                        onChange={(e) =>
                          handleUpdateMaterial(idx, "qty", parseFloat(e.target.value) || 1)
                        }
                        className="w-16 px-2 py-1.5 rounded-lg border border-stone-300 text-sm text-center bg-white"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-stone-500">₹/unit:</span>
                      <input
                        type="number"
                        min="0"
                        value={mat.unitPriceInr}
                        onChange={(e) =>
                          handleUpdateMaterial(idx, "unitPriceInr", parseFloat(e.target.value) || 0)
                        }
                        className="w-24 px-2 py-1.5 rounded-lg border border-stone-300 text-sm text-center bg-white"
                      />
                    </div>
                    <span className="text-xs font-bold text-stone-700 w-16 text-right">
                      ₹{Math.round(mat.qty * mat.unitPriceInr)}
                    </span>
                    <button
                      type="button"
                      disabled={materials.length <= 1}
                      onClick={() => handleRemoveMaterial(idx)}
                      className="p-1.5 text-stone-400 hover:text-red-600 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end text-sm font-bold text-stone-800 pr-2">
              Total Materials: ₹
              {Math.round(
                materials.reduce((sum, m) => sum + m.qty * m.unitPriceInr, 0)
              )}
            </div>
          </div>

          {/* Labor Hours & Skill Level */}
          <div className="pt-4 border-t border-stone-100 space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              2. Artisan Craftsmanship & Hours
            </label>

            {/* Quick Hours Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                <span>Total Dedicated Hours: {hoursSpent} hrs</span>
                <span className="text-stone-500">Tap quick button or adjust</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[5, 10, 15, 20, 30, 40].map((h) => (
                  <button
                    type="button"
                    key={h}
                    onClick={() => setHoursSpent(h)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      hoursSpent === h
                        ? "bg-amber-700 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    {h} hrs
                  </button>
                ))}
                <div className="flex items-center gap-1 ml-auto">
                  <span className="text-xs text-stone-500">Custom:</span>
                  <input
                    type="number"
                    min="1"
                    value={hoursSpent}
                    onChange={(e) => setHoursSpent(parseFloat(e.target.value) || 1)}
                    className="w-20 px-2 py-1 rounded-lg border border-stone-300 text-sm text-center"
                  />
                </div>
              </div>
            </div>

            {/* Skill Level Selection */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-stone-700 block">
                Select Mastery Level (Guarantees transparent hourly living wage):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "apprentice",
                    title: "Apprentice",
                    rate: "₹80 / hr",
                    desc: "Learning artisan, basic border work",
                  },
                  {
                    id: "skilled",
                    title: "Skilled Artisan",
                    rate: "₹120 / hr",
                    desc: "Independent maker, proficient in traditional patterns",
                  },
                  {
                    id: "master",
                    title: "Master Artisan",
                    rate: "₹180 / hr",
                    desc: "Veteran tradition keeper, heirloom complexity",
                  },
                ].map((sk) => (
                  <button
                    type="button"
                    key={sk.id}
                    onClick={() => setSkillLevel(sk.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      skillLevel === sk.id
                        ? "border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-stone-900">{sk.title}</span>
                      <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        {sk.rate}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">{sk.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Heritage Protection & Complexity */}
          <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* GI Tag Toggle */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-stone-900 block">
                  Geographical Indication (GI) Certified?
                </span>
                <span className="text-[11px] text-stone-500 block mt-0.5">
                  Adds a +10% heritage authenticity premium protecting indigenous craft knowledge.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setGiTagged(!giTagged)}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  giTagged ? "bg-amber-700" : "bg-stone-300"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white block absolute top-0.5 transition-transform ${
                    giTagged ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Complexity Selector */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
              <span className="text-xs font-bold text-stone-900 block">
                Pattern Motif Complexity:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "simple", label: "Simple (0%)" },
                  { id: "moderate", label: "Mod (+5%)" },
                  { id: "intricate", label: "Intricate (+12%)" },
                ].map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setComplexity(c.id as any)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                      complexity === c.id
                        ? "bg-stone-900 text-white border-stone-900"
                        : "bg-white text-stone-700 border-stone-300 hover:bg-stone-100"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl text-stone-700 hover:bg-stone-100 font-bold text-sm transition flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleProceedToPricing}
              className="px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow-sm transition flex items-center gap-2"
            >
              <Scale className="w-4 h-4" />
              <span>Calculate Fair Price</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PRICE RESULT & BREAKDOWN */}
      {step === 3 && priceResult && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Fair-Price Calculation Complete</span>
            </div>
            <h2 className="text-xl font-black text-stone-900">
              Transparent Price Recommendation
            </h2>
            <p className="text-xs text-stone-500">
              Guidance disclaimer: Price is guidance, not a guarantee. You decide the final listed price.
            </p>
          </div>

          {/* Suggested Price Range Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Floor */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Cost Floor (Min)
              </span>
              <p className="text-2xl font-black text-stone-700">₹{priceResult.floor}</p>
              <p className="text-[11px] text-stone-500">Zero loss: covers raw mats, labor & overhead</p>
            </div>

            {/* Target (Recommended) */}
            <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-500 space-y-1 relative shadow-sm">
              <span className="absolute -top-2.5 right-3 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Recommended
              </span>
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                Target Fair Price
              </span>
              <p className="text-3xl font-black text-amber-900">₹{priceResult.target}</p>
              <p className="text-[11px] text-amber-800 font-medium">Includes heritage & intricacy value</p>
            </div>

            {/* High */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Market Premium (High)
              </span>
              <p className="text-2xl font-black text-stone-700">₹{priceResult.high}</p>
              <p className="text-[11px] text-stone-500">For boutique galleries and collectors</p>
            </div>
          </div>

          {/* Animated/Visual Cost Breakdown Bar */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-800">
              <span>Where Every Rupee Goes:</span>
              <span className="text-stone-500">Total: ₹{priceResult.target}</span>
            </div>

            <div className="h-4 w-full bg-stone-200 rounded-full overflow-hidden flex shadow-inner">
              <div
                style={{
                  width: `${(priceResult.breakdown.materials / priceResult.target) * 100}%`,
                }}
                className="bg-sky-500 transition-all duration-500"
                title={`Materials: ₹${priceResult.breakdown.materials}`}
              />
              <div
                style={{
                  width: `${(priceResult.breakdown.labour / priceResult.target) * 100}%`,
                }}
                className="bg-emerald-500 transition-all duration-500"
                title={`Labor: ₹${priceResult.breakdown.labour}`}
              />
              <div
                style={{
                  width: `${(priceResult.breakdown.overhead / priceResult.target) * 100}%`,
                }}
                className="bg-amber-500 transition-all duration-500"
                title={`Overhead: ₹${priceResult.breakdown.overhead}`}
              />
              <div
                style={{
                  width: `${(priceResult.breakdown.heritage / priceResult.target) * 100}%`,
                }}
                className="bg-purple-500 transition-all duration-500"
                title={`Heritage: ₹${priceResult.breakdown.heritage}`}
              />
            </div>

            {/* Legend & Breakdown grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="p-2 rounded-lg bg-white border border-stone-200 flex flex-col">
                <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                  <span>Materials</span>
                </div>
                <span className="font-bold text-stone-900 text-sm mt-0.5">
                  ₹{priceResult.breakdown.materials}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-white border border-stone-200 flex flex-col">
                <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Artisan Labor</span>
                </div>
                <span className="font-bold text-emerald-800 text-sm mt-0.5">
                  ₹{priceResult.breakdown.labour}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-white border border-stone-200 flex flex-col">
                <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span>Overheads (8%)</span>
                </div>
                <span className="font-bold text-stone-900 text-sm mt-0.5">
                  ₹{priceResult.breakdown.overhead}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-white border border-stone-200 flex flex-col">
                <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                  <span>Heritage Prem.</span>
                </div>
                <span className="font-bold text-purple-900 text-sm mt-0.5">
                  ₹{priceResult.breakdown.heritage}
                </span>
              </div>
            </div>
          </div>

          {/* Market Benchmark & Fair Wage Check */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5">
              <span className="text-xs font-bold text-stone-700 block">
                Regional Market Positioning:
              </span>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-900 text-white text-xs font-bold">
                {priceResult.marketPosition}
              </div>
              {priceResult.comparableStats && (
                <p className="text-[11px] text-stone-500 pt-1">
                  Based on {priceResult.comparableStats.count} regional market comparables: Median ₹
                  {priceResult.comparableStats.median} (Range ₹{priceResult.comparableStats.p25} – ₹
                  {priceResult.comparableStats.p75}).
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5">
              <span className="text-xs font-bold text-stone-700 block">
                Fair Living Wage Check:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  ₹{priceResult.fairWageCheck.effectiveHourlyRate}/hr effective wage
                </span>
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Fair wage verified
                </span>
              </div>
              <p className="text-[11px] text-stone-500 pt-1">
                Artisan is protected against distress selling below regional baseline wage.
              </p>
            </div>
          </div>

          {/* Plain-Language Explanations */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-800" />
              <span>Explainable Price Formula Breakdown:</span>
            </span>
            <ul className="text-xs text-amber-900 space-y-1 pl-4 list-disc">
              {priceResult.explanation.map((exp, idx) => (
                <li key={idx}>{exp}</li>
              ))}
            </ul>
          </div>

          {/* Artisan Sets Listed Price */}
          <div className="p-4 rounded-xl border-2 border-stone-900 bg-stone-50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-sm font-black text-stone-900 block">
                  Your Final Listed Price (INR):
                </label>
                <p className="text-xs text-stone-500">
                  Default set to fair target. You can adjust up or down.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-stone-900">₹</span>
                <input
                  type="number"
                  value={listedPrice}
                  onChange={(e) => setListedPrice(parseFloat(e.target.value) || 0)}
                  className="w-32 px-3 py-2 rounded-xl border-2 border-stone-400 font-black text-xl text-stone-900 bg-white text-center focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            {listedPrice < priceResult.floor && (
              <div className="p-3 rounded-lg bg-amber-100 border border-amber-300 text-amber-950 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0" />
                <span>
                  Warning: Listed price (₹{listedPrice}) is below your floor cost (₹
                  {priceResult.floor}). You may take a loss on materials or labor.
                </span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl text-stone-700 hover:bg-stone-100 font-bold text-sm transition flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Edit Inputs</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(4);
                if (!draftedStory) {
                  handleDraftStory();
                }
              }}
              className="px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow-sm transition flex items-center gap-2"
            >
              <span>Continue to Story & Passport</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: STORY & CRAFT PASSPORT */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>Craft Storytelling & Provenance</span>
            </div>
            <h2 className="text-xl font-black text-stone-900">
              Tell the Story Behind Your Hands
            </h2>
            <p className="text-xs text-stone-500">
              Conscious buyers pay fair prices when they know who made it and how much skill was required.
            </p>
          </div>

          {/* 3 Guided Prompts */}
          <div className="space-y-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                1. Who taught you this craft?
              </label>
              <input
                type="text"
                placeholder="e.g. My grandmother in our village home in Dharwad"
                value={mentor}
                onChange={(e) => setMentor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                2. What makes this piece special or unique?
              </label>
              <input
                type="text"
                placeholder="e.g. Pure handloom cotton with traditional Gopura and Mayura temple motifs"
                value={specialDetail}
                onChange={(e) => setSpecialDetail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                3. How long did it take to complete?
              </label>
              <input
                type="text"
                placeholder="e.g. Over 20 hours of delicate counting across 14 days"
                value={timeTakenText}
                onChange={(e) => setTimeTakenText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                disabled={isDraftingStory}
                onClick={handleDraftStory}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isDraftingStory ? "Drafting Story..." : "Draft My Story"}</span>
              </button>
            </div>
          </div>

          {/* Drafted Story Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Final Craft Passport Story (Artisan can edit):
              </label>
              <span className="text-[11px] text-stone-500">Max 120 words • 100% truthful</span>
            </div>
            <textarea
              rows={4}
              value={draftedStory}
              onChange={(e) => setDraftedStory(e.target.value)}
              placeholder="Your craft story will appear here. You can refine or rewrite it."
              className="w-full p-3.5 rounded-xl border border-stone-300 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>

          {/* Photos Showcase */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Craft Photos (1 Finished Product + Process Photos)
              </label>
              <span className="text-[11px] text-stone-500">Preset demo photos loaded</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-amber-600 bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mainPhotoUrl}
                  alt="Main Product"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 left-1.5 bg-stone-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  Main Photo
                </span>
              </div>

              {processPhotos.map((url, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-xl overflow-hidden border border-stone-300 bg-stone-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Process ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 bg-stone-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Process #{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Publish Action */}
          <div className="flex items-center justify-between pt-6 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-4 py-2.5 rounded-xl text-stone-700 hover:bg-stone-100 font-bold text-sm transition flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Price</span>
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handlePublish}
              className="px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition flex items-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{isSubmitting ? "Publishing Craft..." : "Publish & Generate Craft Passport"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
