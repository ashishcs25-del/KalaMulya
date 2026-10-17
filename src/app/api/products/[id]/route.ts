import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/supabaseServer";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await dbService.getProductById(params.id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await dbService.deleteProduct(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Product not found or already removed" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "Product removed successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to remove product" },
      { status: 500 }
    );
  }
}
