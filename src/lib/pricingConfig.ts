/**
 * KalaMulya Pricing Engine Configuration
 * 
 * All values below represent explicit, explainable calibration assumptions.
 * These can be adjusted per regional economic studies or cooperative guidelines.
 */

// ASSUMPTION I will calibrate:
// Baseline hourly wage benchmark for artisans in Coastal & North Karnataka in INR.
// Fair living wage benchmark vs minimum manual labor wage.
export const HOURLY_RATE_INR = {
  apprentice: 80, // Basic stitching, learning artisan
  skilled: 120,    // Competent artisan working independently
  master: 180,     // Veteran artisan preserving heirloom patterns/techniques
} as const;

export type SkillLevel = keyof typeof HOURLY_RATE_INR;

// ASSUMPTION I will calibrate:
// Workshop overheads percentage: covers thread wastage, needles, frame depreciation,
// lighting, workshop space, and protective packaging.
export const OVERHEAD_PCT = 0.08; // 8% of direct costs (materials + labour)

// ASSUMPTION I will calibrate:
// Heritage & complexity premiums to prevent undervaluation of unique cultural crafts.
export const HERITAGE_PREMIUM = {
  giTagged: 0.10, // +10% premium if certified under Geographical Indication (e.g. Ilkal/Kasuti)
  complexity: {
    simple: 0,       // Straightforward motifs, repetitive borders
    moderate: 0.05,  // 5% premium for mixed patterns
    intricate: 0.12, // 12% premium for high-density, multi-directional traditional motifs (e.g. Gavanti, Murgi)
  },
} as const;

export type ComplexityLevel = keyof typeof HERITAGE_PREMIUM.complexity;

// ASSUMPTION I will calibrate:
// Rounding threshold for clean retail pricing in INR.
export const ROUND_TO = 10;

// Standard craft categories and defaults for UI forms
export const SUPPORTED_CRAFTS = [
  {
    id: "kasuti",
    name: "Kasuti Embroidery",
    region: "Dharwad / North Karnataka",
    giTagged: true,
    description: "Centuries-old counted thread embroidery featuring temple chariots, peacocks, and sacred geometric motifs.",
    defaultProducts: ["Dupatta", "Saree", "Wall Hanging", "Clutch Bag", "Kurta Yoke"],
  },
  {
    id: "beedu",
    name: "Beedu Craft",
    region: "Dakshina Kannada / Coastal Karnataka",
    giTagged: false,
    description: "Traditional coastal fiber & woven artifact craft using wild grass, reeds, and natural dyes.",
    defaultProducts: ["Storage Basket", "Table Runner", "Hand Fan", "Decorative Mat", "Planter"],
  },
  {
    id: "kinhal",
    name: "Kinhal Woodcraft",
    region: "Koppal, Karnataka",
    giTagged: true,
    description: "Intricate lacquered woodwork and traditional figurative art using light wood and tamarind paste.",
    defaultProducts: ["Idol / Figurine", "Wall Relief", "Traditional Tray", "Toy"],
  },
] as const;
