import { describe, it, expect } from "vitest";
import { calculateFairPrice, PricingInput } from "../src/lib/pricing";

describe("KalaMulya Fair-Price Engine (/lib/pricing.ts)", () => {
  // Hero prompt scenario:
  // materials 400, hours 20, skilled, giTagged true, intricate
  // -> labour 2400, overhead 224, floor 3024, premium ~665.28, target ~3689.28 (rounds to 3690)
  it("accurately calculates the hero test case from specification", () => {
    const input: PricingInput = {
      craftType: "kasuti",
      productType: "Dupatta",
      materials: [
        { name: "Handloom Cotton Fabric", qty: 1, unitPriceInr: 250 },
        { name: "Silk Floss & Needle", qty: 3, unitPriceInr: 50 },
      ], // total materials = 250 + 150 = 400
      hoursSpent: 20,
      skillLevel: "skilled", // 120 INR/hr -> 2400 labour
      giTagged: true,        // 10%
      complexity: "intricate", // 12% -> total premium = 22%
    };

    const result = calculateFairPrice(input);

    expect(result.success).toBe(true);
    if (!result.success) return;

    // Direct costs: 400 mats + 2400 labour = 2800
    expect(result.breakdown.materials).toBe(400);
    expect(result.breakdown.labour).toBe(2400);
    // Overhead = 2800 * 0.08 = 224
    expect(result.breakdown.overhead).toBe(224);
    // Floor = 2800 + 224 = 3024 (rounded to nearest 10: 3020)
    expect(result.floor).toBe(3020);
    // Heritage premium = 3024 * 0.22 = 665.28 (rounded in breakdown to 665)
    expect(result.breakdown.heritage).toBe(665);
    // Target = 3024 + 665.28 = 3689.28 -> rounds to 3690
    expect(result.target).toBe(3690);
    expect(result.low).toBe(3020);
    expect(result.high).toBeGreaterThanOrEqual(result.target);

    // Comparables check (Dupatta has 5 matches in seed comparables)
    expect(result.lowConfidence).toBe(false);
    expect(result.comparableStats).not.toBeNull();
    expect(result.comparableStats?.count).toBeGreaterThanOrEqual(3);
    expect(["Within market", "Below market: room to raise", "Premium: story and provenance justify this"]).toContain(
      result.marketPosition
    );

    // Fair wage check
    expect(result.fairWageCheck.isFair).toBe(true);
    expect(result.fairWageCheck.effectiveHourlyRate).toBeGreaterThanOrEqual(120);

    // Explanations present
    expect(result.explanation.length).toBeGreaterThan(0);
  });

  it("handles fallback and lowConfidence when < 3 product matches exist", () => {
    const input: PricingInput = {
      craftType: "kasuti",
      productType: "UncommonWallPanel", // Less than 3 matches
      materials: [{ name: "Cotton", qty: 1, unitPriceInr: 200 }],
      hoursSpent: 10,
      skillLevel: "apprentice",
      giTagged: true,
      complexity: "simple",
    };

    const result = calculateFairPrice(input);
    expect(result.success).toBe(true);
    if (!result.success) return;

    // Should fall back to broader craftType 'kasuti'
    expect(result.lowConfidence).toBe(true);
    expect(result.comparableStats).not.toBeNull();
    expect(result.explanation.some((e) => e.includes("broader craft category"))).toBe(true);
  });

  it("handles case with zero comparables gracefully", () => {
    const input: PricingInput = {
      craftType: "unknown_rare_craft",
      productType: "rare_artifact",
      materials: [{ name: "Wood", qty: 1, unitPriceInr: 500 }],
      hoursSpent: 5,
      skillLevel: "master",
      giTagged: false,
      complexity: "moderate",
    };

    // Pass empty array of comparables
    const result = calculateFairPrice(input, []);
    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.comparableStats).toBeNull();
    expect(result.marketPosition).toBe("No market data available");
    expect(result.target).toBeGreaterThan(0);
    expect(result.high).toBeGreaterThanOrEqual(result.target);
  });

  it("rejects zero hours with clear validation error", () => {
    const input = {
      craftType: "kasuti",
      productType: "Dupatta",
      materials: [{ name: "Fabric", qty: 1, unitPriceInr: 100 }],
      hoursSpent: 0, // Invalid: zero hours
      skillLevel: "skilled",
      giTagged: false,
      complexity: "simple",
    };

    const result = calculateFairPrice(input);
    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.error).toContain("Hours spent must be greater than zero");
  });

  it("rejects negative or invalid inputs without throwing or producing NaN", () => {
    const invalidInputs = [
      {
        craftType: "kasuti",
        productType: "Dupatta",
        materials: [{ name: "Fabric", qty: -1, unitPriceInr: 100 }],
        hoursSpent: 10,
        skillLevel: "skilled",
        giTagged: false,
        complexity: "simple",
      },
      {
        craftType: "kasuti",
        productType: "Dupatta",
        materials: [{ name: "Fabric", qty: 1, unitPriceInr: -50 }],
        hoursSpent: 10,
        skillLevel: "skilled",
        giTagged: false,
        complexity: "simple",
      },
      {
        craftType: "",
        productType: "Dupatta",
        materials: [],
        hoursSpent: -5,
        skillLevel: "invalid_skill",
        giTagged: "not_a_bool",
        complexity: "extreme",
      },
      null,
      undefined,
      {},
    ];

    for (const testInput of invalidInputs) {
      const result = calculateFairPrice(testInput);
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(typeof result.error).toBe("string");
      expect(result.error.length).toBeGreaterThan(0);
    }
  });
});
