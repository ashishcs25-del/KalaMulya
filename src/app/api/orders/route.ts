import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbService } from "@/lib/supabaseServer";

const CreateOrderSchema = z.object({
  product_id: z.string().min(1, "Product ID is required"),
  buyer_name: z.string().min(2, "Name must be at least 2 characters"),
  buyer_phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  quantity: z.number().int().positive().default(1),
  total: z.number().positive("Total must be positive"),
});

export async function GET() {
  try {
    const orders = await dbService.getOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = CreateOrderSchema.safeParse(body);

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

    const createdOrder = await dbService.createOrder(validation.data);
    return NextResponse.json({ success: true, order: createdOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to place order" },
      { status: 500 }
    );
  }
}
