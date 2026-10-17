import { NextRequest, NextResponse } from "next/server";

interface StoryRequest {
  artisanName?: string;
  craftName?: string;
  productTitle?: string;
  village?: string;
  mentor?: string;       // "Who taught you?"
  specialDetail?: string; // "What makes this piece special?"
  timeTaken?: string;    // "How long does it take?"
}

export async function POST(req: NextRequest) {
  try {
    const body: StoryRequest = await req.json();
    const {
      artisanName = "Artisan",
      craftName = "Traditional Craft",
      productTitle = "Handcrafted Piece",
      village = "Karnataka",
      mentor = "",
      specialDetail = "",
      timeTaken = "",
    } = body;

    const geminiKey = process.env.GEMINI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    // Strict prompt to ensure NO invented facts and max 120 words
    const prompt = `You are a respectful chronicler of Indian heritage crafts. 
Draft a first-person authentic artisan story for a product passport.

STRICT CONSTRAINTS:
1. Maximum 120 words.
2. Use ONLY the facts provided below. NEVER invent or hallucinate any dates, awards, family history, or techniques not stated.
3. Keep the tone warm, proud, and grounded in coastal/North Karnataka craftsmanship.

GIVEN FACTS:
- Artisan: ${artisanName} from ${village}
- Craft: ${craftName}
- Product: ${productTitle}
- Who taught them: ${mentor || "Learned traditional techniques from family elders"}
- What makes this piece special: ${specialDetail || "Handmade using time-honored artisanal methods"}
- Time taken: ${timeTaken || "Hours of focused dedication"}

Write the final story in clear English:`;

    // 1. Try Gemini if configured
    if (geminiKey && geminiKey.trim().length > 10) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { maxOutputTokens: 250, temperature: 0.3 },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const generatedText =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (generatedText) {
            return NextResponse.json({
              success: true,
              story: generatedText,
              provider: "gemini",
            });
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini story generation failed, falling back to template:", geminiErr);
      }
    }

    // 2. Try Anthropic if configured
    if (anthropicKey && anthropicKey.trim().length > 10) {
      try {
        const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            max_tokens: 200,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (anthropicRes.ok) {
          const anthropicData = await anthropicRes.json();
          const text = anthropicData?.content?.[0]?.text?.trim();
          if (text) {
            return NextResponse.json({
              success: true,
              story: text,
              provider: "anthropic",
            });
          }
        }
      } catch (anthropicErr) {
        console.warn("Anthropic story generation failed, falling back to template:", anthropicErr);
      }
    }

    // 3. High quality deterministic template fallback (ZERO external dependency required)
    const mentorSentence = mentor
      ? `I learned the nuances of ${craftName} from ${mentor}, who instilled in me the discipline of handcrafted perfection.`
      : `Practicing ${craftName} in ${village} is a living link to our regional heritage.`;

    const detailSentence = specialDetail
      ? `What makes this ${productTitle} distinct is ${specialDetail.toLowerCase().startsWith("that") ? specialDetail : specialDetail}.`
      : `Each motif is shaped by hand with complete respect for sustainable, natural materials.`;

    const timeSentence = timeTaken
      ? timeTaken.toLowerCase().includes("patience") || timeTaken.toLowerCase().includes("over")
        ? `Creating this piece requires ${timeTaken}.`
        : `Creating this piece requires ${timeTaken} of patience and concentration.`
      : `Bringing this piece to life requires many hours of devoted handwork.`;

    const fallbackStory = `My name is ${artisanName} from ${village}. ${mentorSentence} ${detailSentence} ${timeSentence} When you bring this piece into your home, you support our craft legacy directly.`;

    return NextResponse.json({
      success: true,
      story: fallbackStory,
      provider: "template",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate story" },
      { status: 500 }
    );
  }
}
