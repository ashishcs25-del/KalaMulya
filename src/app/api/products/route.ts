import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbService } from "@/lib/supabaseServer";

const CreateProductSchema = z.object({
  artisan_id: z.string().min(1, "Artisan is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  craft_type: z.string().min(1, "Craft type is required"),
  product_type: z.string().min(1, "Product type is required"),
  description: z.string().optional().default(""),
  materials: z.array(
    z.object({
      name: z.string().min(1),
      qty: z.number().positive(),
      unitPriceInr: z.number().nonnegative(),
    })
  ).min(1, "At least one material item is required"),
  hours: z.number().positive("Hours must be greater than zero"),
  skill_level: z.enum(["apprentice", "skilled", "master"]),
  gi_tagged: z.boolean().default(false),
  complexity: z.enum(["simple", "moderate", "intricate"]),
  price_breakdown: z.object({
    materials: z.number(),
    labour: z.number(),
    overhead: z.number(),
    heritage: z.number(),
    total: z.number(),
  }),
  floor_price: z.number().positive(),
  target_price: z.number().positive(),
  listed_price: z.number().positive(),
  story: z.string().min(10, "Story must be provided"),
  main_photo_url: z.string().min(1, "Main product photo is required"),
  process_photos: z.array(z.string()).default([]),
  is_demo: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const craft = searchParams.get("craft") || undefined;
    const products = await dbService.getProducts(craft);
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = CreateProductSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const createdProduct = await dbService.createProduct(validation.data);
    return NextResponse.json({ success: true, product: createdProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
