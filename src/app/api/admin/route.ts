import { NextRequest, NextResponse } from "next/server";
import { dbService, isServerSupabaseConfigured } from "@/lib/supabaseServer";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "kalamulya2026";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password, action } = body;

    // Verify Password
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Invalid admin password" },
        { status: 401 }
      );
    }

    if (action === "verify") {
      return NextResponse.json({ success: true, authorized: true });
    }

    if (action === "reset") {
      await dbService.resetData();
      return NextResponse.json({
        success: true,
        message: "Database wiped and restored to initial seed state.",
      });
    }

    if (action === "metrics") {
      const artisans = await dbService.getArtisans();
      const products = await dbService.getProducts();
      const orders = await dbService.getOrders();
      const totalRevenue = orders.reduce(
        (sum: number, o: any) => sum + (Number(o.total) || 0),
        0
      );

      return NextResponse.json({
        success: true,
        metrics: {
          databaseMode: isServerSupabaseConfigured() ? "Supabase Cloud" : "Local Persistent JSON",
          totalArtisans: artisans.length,
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue,
        },
      });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Admin request failed" },
      { status: 500 }
    );
  }
}
