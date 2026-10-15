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

async function reset() {
  console.log("🔄 KalaMulya Reset: Wiping products and orders, restoring seed data...");

  // 1. Reset local fallback DB
  const localDbPath = path.resolve(process.cwd(), "data/local-db.json");
  const localData = {
    artisans: seedArtisans,
    products: seedProducts,
    orders: [],
  };
  fs.writeFileSync(localDbPath, JSON.stringify(localData, null, 2), "utf8");
  console.log("✅ Local fallback DB restored to initial seed state (data/local-db.json).");

  // 2. If remote Supabase is configured, wipe and re-seed
  if (
    !supabaseUrl ||
    supabaseUrl.includes("placeholder") ||
    !serviceKey ||
    serviceKey.includes("placeholder")
  ) {
    console.log("ℹ️ Remote Supabase not configured. Local database reset complete.");
    return;
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  console.log("🚀 Connected to Supabase. Resetting remote tables...");

  // Wipe orders first (foreign key dependency)
  const { error: delOrdersError } = await supabase.from("orders").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delOrdersError) console.warn("Orders delete note:", delOrdersError.message);

  // Wipe products
  const { error: delProdsError } = await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delProdsError) console.warn("Products delete note:", delProdsError.message);

  // Re-seed artisans
  const { error: artisanError } = await supabase.from("artisans").upsert(seedArtisans, { onConflict: "id" });
  if (artisanError) console.error("Error reseeding artisans:", artisanError.message);

  // Re-seed products
  const { error: productError } = await supabase.from("products").upsert(seedProducts, { onConflict: "id" });
  if (productError) console.error("Error reseeding products:", productError.message);

  console.log("🎉 Remote database reset and re-seeded successfully!");
}

reset().catch((err) => {
  console.error("Reset failed with unhandled error:", err);
  process.exit(1);
});
