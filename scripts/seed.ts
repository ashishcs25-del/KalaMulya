import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import seedArtisans from "../data/seed/artisans.json";
import seedProducts from "../data/seed/products.json";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function seed() {
  console.log("🌱 KalaMulya Seeding: Starting seed process...");

  // 1. Reset local fallback DB
  const localDbPath = path.resolve(process.cwd(), "data/local-db.json");
  const localData = {
    artisans: seedArtisans,
    products: seedProducts,
    orders: [],
  };
  fs.writeFileSync(localDbPath, JSON.stringify(localData, null, 2), "utf8");
  console.log("✅ Local fallback DB seeded successfully (data/local-db.json).");

  // 2. Check if remote Supabase is configured
  if (
    !supabaseUrl ||
    supabaseUrl.includes("placeholder") ||
    !serviceKey ||
    serviceKey.includes("placeholder")
  ) {
    console.log("ℹ️ Supabase environment variables not configured. Local fallback DB is ready to use.");
    return;
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  console.log("🚀 Connecting to Supabase at:", supabaseUrl);

  // Seed Artisans
  console.log(`Seeding ${seedArtisans.length} artisans...`);
  const { error: artisanError } = await supabase
    .from("artisans")
    .upsert(seedArtisans, { onConflict: "id" });
  if (artisanError) {
    console.error("❌ Error seeding artisans in Supabase:", artisanError.message);
  } else {
    console.log("✅ Artisans seeded in Supabase.");
  }

  // Seed Products
  console.log(`Seeding ${seedProducts.length} products...`);
  const { error: productError } = await supabase
    .from("products")
    .upsert(seedProducts, { onConflict: "id" });
  if (productError) {
    console.error("❌ Error seeding products in Supabase:", productError.message);
  } else {
    console.log("✅ Products seeded in Supabase.");
  }

  console.log("🎉 Seeding complete!");
}

seed().catch((err) => {
  console.error("Seeding failed with unhandled error:", err);
  process.exit(1);
});
