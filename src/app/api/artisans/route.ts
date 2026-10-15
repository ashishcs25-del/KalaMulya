import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbService } from "@/lib/supabaseServer";

const CreateArtisanSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  village: z.string().min(2, "Village is required"),
  craft: z.string().min(2, "Craft is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  photo_url: z.string().optional().default(""),
  is_demo: z.boolean().default(true),
});

export async function GET() {
  try {
    const artisans = await dbService.getArtisans();
    return NextResponse.json({ success: true, artisans });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch artisans" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = CreateArtisanSchema.safeParse(body);

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

    const createdArtisan = await dbService.createArtisan(validation.data);
    return NextResponse.json({ success: true, artisan: createdArtisan }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create artisan" },
      { status: 500 }
    );
  }
}
