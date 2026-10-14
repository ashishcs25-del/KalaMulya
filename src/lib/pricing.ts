import { z } from "zod";
import {
  HOURLY_RATE_INR,
  OVERHEAD_PCT,
  HERITAGE_PREMIUM,
  ROUND_TO,
  SkillLevel,
  ComplexityLevel,
} from "./pricingConfig";
import comparablesData from "../../data/comparables.json";

// Validation schema for pricing inputs
export const MaterialItemSchema = z.object({
  name: z.string().min(1, "Material name is required"),
  qty: z.number().positive("Quantity must be greater than zero"),
  unitPriceInr: z.number().nonnegative("Unit price cannot be negative"),
});

export const PricingInputSchema = z.object({
  craftType: z.string().min(1, "Craft type is required"),
  productType: z.string().min(1, "Product type is required"),
  materials: z.array(MaterialItemSchema),
  hoursSpent: z.number().positive("Hours spent must be greater than zero"),
  skillLevel: z.enum(["apprentice", "skilled", "master"] as const),
  giTagged: z.boolean(),
  complexity: z.enum(["simple", "moderate", "intricate"] as const),
});

export type PricingInput = z.infer<typeof PricingInputSchema>;
export type MaterialItem = z.infer<typeof MaterialItemSchema>;

export interface ComparableRecord {
  craftType: string;
  productType: string;
  priceInr: number;
  source: string;
}

export interface ComparableStats {
  count: number;
  p25: number;
  median: number;
  p75: number;
  min: number;
  max: number;
}

export interface PricingResult {
  success: true;
  breakdown: {
    materials: number;
    labour: number;
    overhead: number;
    heritage: number;
    total: number;
  };
  floor: number;
  target: number;
  low: number;
  high: number;
  comparableStats: ComparableStats | null;
  marketPosition: string;
  lowConfidence: boolean;
  fairWageCheck: {
    effectiveHourlyRate: number;
    baselineHourlyRate: number;
    isFair: boolean;
  };
  explanation: string[];
}

export interface PricingError {
  success: false;
  error: string;
  details?: z.ZodIssue[];
}

export type PricingOutput = PricingResult | PricingError;

/**
 * Rounds a number to the configured threshold (e.g., nearest 10 INR)
 */
export function roundToNearest(val: number, step = ROUND_TO): number {
  if (isNaN(val) || !isFinite(val)) return 0;
  return Math.round(val / step) * step;
}

/**
 * Computes percentile from a sorted array of numbers
 */
function getPercentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];

  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  if (lower === upper) return sorted[lower];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Pure function: calculates fair price range, breakdown, and market positioning.
 */
export function calculateFairPrice(
  input: unknown,
  comparables: ComparableRecord[] = comparablesData as ComparableRecord[]
): PricingOutput {
  // 1. Input Validation
  const validation = PricingInputSchema.safeParse(input);
  if (!validation.success) {
    const errorMessages = validation.error.issues.map((i) => i.message).join(", ");
    return {
      success: false,
      error: `Invalid pricing input: ${errorMessages}`,
      details: validation.error.issues,
    };
  }

  const {
    craftType,
    productType,
    materials,
    hoursSpent,
    skillLevel,
    giTagged,
    complexity,
  } = validation.data;

  // 2. Direct Costs Calculation
  const totalMaterials = materials.reduce(
    (sum, item) => sum + item.qty * item.unitPriceInr,
    0
  );

  const hourlyRate = HOURLY_RATE_INR[skillLevel];
  const totalLabour = hoursSpent * hourlyRate;

  // 3. Overhead & Floor Price
  const overhead = (totalMaterials + totalLabour) * OVERHEAD_PCT;
  const rawFloor = totalMaterials + totalLabour + overhead;

  // 4. Heritage & Complexity Premium
  const giPremiumRate = giTagged ? HERITAGE_PREMIUM.giTagged : 0;
  const complexityPremiumRate = HERITAGE_PREMIUM.complexity[complexity];
  const totalPremiumRate = giPremiumRate + complexityPremiumRate;
  const heritagePremium = rawFloor * totalPremiumRate;

  // 5. Target Price
  const rawTarget = rawFloor + heritagePremium;

  // 6. Market Comparables Analysis
  const normalizedCraft = craftType.trim().toLowerCase();
  const normalizedProduct = productType.trim().toLowerCase();

  // Try exact match (craftType + productType)
  let matchingRecords = comparables.filter(
    (c) =>
      c.craftType.trim().toLowerCase() === normalizedCraft &&
      c.productType.trim().toLowerCase() === normalizedProduct
  );

  let lowConfidence = false;
  let fallbackMessage = "";

  // If fewer than 3 matches, fallback to craftType only
  if (matchingRecords.length < 3) {
    matchingRecords = comparables.filter(
      (c) => c.craftType.trim().toLowerCase() === normalizedCraft
    );
    lowConfidence = true;
    fallbackMessage =
      "Fewer than 3 direct product matches found; calibrated using broader craft category data.";
  }

  let stats: ComparableStats | null = null;
  let marketPosition = "No market data available";

  if (matchingRecords.length > 0) {
    const prices = matchingRecords.map((m) => m.priceInr).sort((a, b) => a - b);
    const p25 = Math.round(getPercentile(prices, 25));
    const median = Math.round(getPercentile(prices, 50));
    const p75 = Math.round(getPercentile(prices, 75));

    stats = {
      count: prices.length,
      p25,
      median,
      p75,
      min: prices[0],
      max: prices[prices.length - 1],
    };

    if (rawTarget < p25) {
      marketPosition = "Below market: room to raise";
    } else if (rawTarget > p75) {
      marketPosition = "Premium: story and provenance justify this";
    } else {
      marketPosition = "Within market";
    }
  }

  // 7. Suggested Range & Rounding
  const floorRounded = roundToNearest(rawFloor);
  const targetRounded = roundToNearest(rawTarget);
  const low = floorRounded;
  const target = targetRounded;
  const high = stats
    ? roundToNearest(Math.max(rawTarget, stats.p75))
    : roundToNearest(rawTarget * 1.15); // Sensible 15% ceiling if no comparables

  // 8. Fair Wage Check
  // Effective hourly earning = (target - materials - overhead) / hoursSpent
  const effectiveHourlyRate =
    hoursSpent > 0 ? (target - totalMaterials - overhead) / hoursSpent : hourlyRate;
  const isFair = effectiveHourlyRate >= hourlyRate * 0.95;

  // 9. Plain-language Explanations
  const explanation: string[] = [
    `Raw materials cost ₹${Math.round(totalMaterials)} based on ${materials.length} item(s).`,
    `Artisan labour contributes ₹${Math.round(totalLabour)} (${hoursSpent} hours at ₹${hourlyRate}/hr for ${skillLevel} craftsmanship).`,
    `Workshop overheads (tools, power, packaging at 8%) add ₹${Math.round(overhead)}.`,
    `Cost-recovery floor is ₹${floorRounded} (minimum needed to avoid any loss).`,
  ];

  if (giTagged) {
    explanation.push(
      `Certified GI craft tag adds a 10% heritage authenticity premium.`
    );
  }

  if (complexity !== "simple") {
    const pct = Math.round(HERITAGE_PREMIUM.complexity[complexity] * 100);
    explanation.push(
      `${complexity.charAt(0).toUpperCase() + complexity.slice(1)} motif complexity adds a ${pct}% intricate skill allowance.`
    );
  }

  explanation.push(
    `Suggested fair target is ₹${target} (effective wage ₹${Math.round(effectiveHourlyRate)}/hr).`
  );

  if (fallbackMessage) {
    explanation.push(`Market Note: ${fallbackMessage}`);
  }

  if (stats) {
    explanation.push(
      `Market range for similar pieces: ₹${stats.p25} (p25) to ₹${stats.p75} (p75), with a median of ₹${stats.median}.`
    );
  }

  return {
    success: true,
    breakdown: {
      materials: Math.round(totalMaterials),
      labour: Math.round(totalLabour),
      overhead: Math.round(overhead),
      heritage: Math.round(heritagePremium),
      total: target,
    },
    floor: floorRounded,
    target,
    low,
    high,
    comparableStats: stats,
    marketPosition,
    lowConfidence,
    fairWageCheck: {
      effectiveHourlyRate: Math.round(effectiveHourlyRate),
      baselineHourlyRate: hourlyRate,
      isFair,
    },
    explanation,
  };
}
