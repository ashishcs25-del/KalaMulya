import { NextRequest, NextResponse } from "next/server";
import { calculateFairPrice } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = calculateFairPrice(body);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to calculate fair price" },
      { status: 500 }
    );
  }
}
