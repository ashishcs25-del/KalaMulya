import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import seedArtisans from "../../data/seed/artisans.json";
import seedProducts from "../../data/seed/products.json";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const isServerSupabaseConfigured = () => {
  return (
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("placeholder") &&
    supabaseServiceKey.length > 20 &&
    !supabaseServiceKey.includes("placeholder")
  );
};

export const getSupabaseServer = () => {
  if (!isServerSupabaseConfigured()) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
};

// Fallback Local JSON Storage (Used seamlessly if Supabase credentials are not yet configured)
const LOCAL_DB_PATH = path.resolve(process.cwd(), "data/local-db.json");

interface LocalDbSchema {
  artisans: any[];
  products: any[];
  orders: any[];
}

function getLocalDb(): LocalDbSchema {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const initialDb: LocalDbSchema = {
      artisans: seedArtisans,
      products: seedProducts,
      orders: [],
    };
    try {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialDb, null, 2), "utf8");
    } catch {
      return initialDb;
    }
    return initialDb;
  }
  try {
    const content = fs.readFileSync(LOCAL_DB_PATH, "utf8");
    return JSON.parse(content);
  } catch {
    return {
      artisans: seedArtisans,
      products: seedProducts,
      orders: [],
    };
  }
}

function saveLocalDb(db: LocalDbSchema) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write local-db.json", err);
  }
}

export const dbService = {
  async getArtisans() {
    const client = getSupabaseServer();
    if (client) {
      const { data, error } = await client.from("artisans").select("*").order("created_at", { ascending: false });
      if (!error && data) return data;
    }
    return getLocalDb().artisans;
  },

  async getProducts(craftType?: string) {
    const client = getSupabaseServer();
    if (client) {
      let query = client.from("products").select("*, artisans(*)").order("created_at", { ascending: false });
      if (craftType && craftType !== "all") {
        query = query.eq("craft_type", craftType);
      }
      const { data, error } = await query;
      if (!error && data) return data;
    }
    const db = getLocalDb();
    let prods = db.products.map((p) => {
      const artisan = db.artisans.find((a) => a.id === p.artisan_id);
      return { ...p, artisans: artisan };
    });
    if (craftType && craftType !== "all") {
      prods = prods.filter((p) => p.craft_type.toLowerCase() === craftType.toLowerCase());
    }
    return prods;
  },

  async getProductById(id: string) {
    const client = getSupabaseServer();
    if (client) {
      const { data, error } = await client
        .from("products")
        .select("*, artisans(*)")
        .eq("id", id)
        .single();
      if (!error && data) return data;
    }
    const db = getLocalDb();
    const product = db.products.find((p) => p.id === id);
    if (!product) return null;
    const artisan = db.artisans.find((a) => a.id === product.artisan_id);
    return { ...product, artisans: artisan };
  },

  async createProduct(productData: any) {
    const client = getSupabaseServer();
    if (client) {
      const { data, error } = await client.from("products").insert([productData]).select().single();
      if (!error && data) return data;
      console.warn("Supabase insert product error, falling back to local DB:", error);
    }
    const db = getLocalDb();
    const newProduct = {
      ...productData,
      id: productData.id || `p-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    db.products.unshift(newProduct);
    saveLocalDb(db);
    return newProduct;
  },

  async createArtisan(artisanData: any) {
    const client = getSupabaseServer();
    if (client) {
      const { data, error } = await client.from("artisans").insert([artisanData]).select().single();
      if (!error && data) return data;
      console.warn("Supabase insert artisan error, falling back to local DB:", error);
    }
    const db = getLocalDb();
    const newArtisan = {
      ...artisanData,
      id: artisanData.id || `a-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    db.artisans.unshift(newArtisan);
    saveLocalDb(db);
    return newArtisan;
  },

  async getOrders() {
    const client = getSupabaseServer();
    if (client) {
      const { data, error } = await client
        .from("orders")
        .select("*, products(*)")
        .order("created_at", { ascending: false });
      if (!error && data) return data;
    }
    const db = getLocalDb();
    return db.orders.map((o) => {
      const prod = db.products.find((p) => p.id === o.product_id);
      return { ...o, products: prod };
    });
  },

  async createOrder(orderData: any) {
    const client = getSupabaseServer();
    if (client) {
      const { data, error } = await client.from("orders").insert([orderData]).select().single();
      if (!error && data) return data;
      console.warn("Supabase insert order error, falling back to local DB:", error);
    }
    const db = getLocalDb();
    const newOrder = {
      ...orderData,
      id: orderData.id || `ord-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: "New",
    };
    db.orders.unshift(newOrder);
    saveLocalDb(db);
    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: "New" | "Packed" | "Shipped") {
    const client = getSupabaseServer();
    if (client) {
      const { data, error } = await client
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select()
        .single();
      if (!error && data) return data;
    }
    const db = getLocalDb();
    const ord = db.orders.find((o) => o.id === orderId);
    if (ord) {
      ord.status = status;
      saveLocalDb(db);
      return ord;
    }
    return null;
  },

  async resetData() {
    const db: LocalDbSchema = {
      artisans: seedArtisans,
      products: seedProducts,
      orders: [],
    };
    saveLocalDb(db);
    return true;
  },
};
