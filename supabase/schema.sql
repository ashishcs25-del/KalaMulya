-- KalaMulya (Fair-Price Engine & Craft Passport)
-- Supabase Schema Definition

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ARTISANS TABLE
CREATE TABLE IF NOT EXISTS artisans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    village TEXT NOT NULL,
    craft TEXT NOT NULL,
    bio TEXT NOT NULL,
    photo_url TEXT,
    is_demo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artisan_id UUID REFERENCES artisans(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    craft_type TEXT NOT NULL,
    product_type TEXT NOT NULL,
    description TEXT,
    materials JSONB NOT NULL DEFAULT '[]'::jsonb,
    hours NUMERIC NOT NULL,
    skill_level TEXT NOT NULL,
    gi_tagged BOOLEAN DEFAULT FALSE,
    complexity TEXT NOT NULL,
    price_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    floor_price NUMERIC NOT NULL,
    target_price NUMERIC NOT NULL,
    listed_price NUMERIC NOT NULL,
    story TEXT,
    main_photo_url TEXT,
    process_photos TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active',
    is_demo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    buyer_name TEXT NOT NULL,
    buyer_phone TEXT NOT NULL,
    address TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Packed', 'Shipped'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read access on artisans" ON artisans FOR SELECT USING (true);
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on orders" ON orders FOR SELECT USING (true);

-- Allow inserts/updates via Service Role (Next.js server routes)
CREATE POLICY "Allow service role all on artisans" ON artisans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role all on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role all on orders" ON orders FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket for product & artisan photos:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-photos', 'product-photos', true) ON CONFLICT (id) DO NOTHING;
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-photos');
-- CREATE POLICY "Service Write Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-photos');
