export type Language = "en" | "kn";

export interface Translations {
  appName: string;
  tagline: string;
  navStorefront: string;
  navListCraft: string;
  navOrders: string;
  navAdmin: string;
  heroNotice: string;
  heroTitle: string;
  heroSubtitle: string;
  btnCalculate: string;
  btnExplore: string;
  craftKasuti: string;
  craftBeedu: string;
  craftKinhal: string;
  transparentPrice: string;
  whereMoneyGoes: string;
  craftPassport: string;
  buyNow: string;
  demoBadge: string;
  giBadge: string;
  materials: string;
  labour: string;
  overhead: string;
  heritage: string;
  hours: string;
  fairWageVerified: string;
  paymentSimulated: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "KalaMulya",
    tagline: "Fair Price • Craft Passport",
    navStorefront: "Storefront",
    navListCraft: "List Craft",
    navOrders: "Orders",
    navAdmin: "Admin",
    heroNotice: "Notice: Price is guidance, not a guarantee. Payment is simulated (demo).",
    heroTitle: "Fair Pricing & Digital Provenance for Karnataka's Heritage Artisans",
    heroSubtitle: "Eliminating middleman exploitation for makers of Kasuti embroidery, Beedu craft, and coastal treasures through an explainable fair-wage pricing engine and verifiable Craft Passports.",
    btnCalculate: "Calculate Fair Price & List Craft",
    btnExplore: "Explore Direct Marketplace",
    craftKasuti: "Kasuti Embroidery",
    craftBeedu: "Beedu Craft",
    craftKinhal: "Kinhal Woodcraft",
    transparentPrice: "Transparent Fair Price",
    whereMoneyGoes: "Where your money goes",
    craftPassport: "Craft Passport",
    buyNow: "Buy Now",
    demoBadge: "Demo Data",
    giBadge: "GI Tagged Heritage",
    materials: "Raw Materials",
    labour: "Artisan Labour",
    overhead: "Workshop Overhead",
    heritage: "Heritage Premium",
    hours: "Hours",
    fairWageVerified: "Fair-Wage Verified",
    paymentSimulated: "Payment is simulated (demo). All proceeds go directly to the artisan.",
  },
  kn: {
    appName: "ಕಲಾಮೌಲ್ಯ",
    tagline: "ನ್ಯಾಯಯುತ ಬೆಲೆ • ಕರಕುಶಲ ಪಾಸ್‌ಪೋರ್ಟ್",
    navStorefront: "ಮುಖಪುಟ",
    navListCraft: "ಕರಕುಶಲ ಸೇರಿಸಿ",
    navOrders: "ಆರ್ಡರ್‌ಗಳು",
    navAdmin: "ನಿರ್ವಾಹಕ",
    heroNotice: "ಸೂಚನೆ: ಬೆಲೆಯು ಮಾರ್ಗದರ್ಶನವಾಗಿದೆ, ಖಾತರಿಯಲ್ಲ. ಪಾವತಿಯು ಪ್ರಾತ್ಯಕ್ಷಿಕೆಯಾಗಿದೆ (ಡೆಮೊ).",
    heroTitle: "ಕರ್ನಾಟಕದ ಸಾಂಪ್ರದಾಯಿಕ ಕುಶಲಕರ್ಮಿಗಳಿಗೆ ನ್ಯಾಯಯುತ ಬೆಲೆ ಮತ್ತು ಡಿಜಿಟಲ್ ಪಾಸ್‌ಪೋರ್ಟ್",
    heroSubtitle: "ಕಸೂತಿ ಕಸೂತಿದಾರರು, ಬೀಡು ಹೆಣಿಗೆ ಮತ್ತು ಕರಾವಳಿ ಕರಕುಶಲಕರ್ಮಿಗಳಿಗೆ ಮಧ್ಯವರ್ತಿಗಳ ಶೋಷಣೆ ತಪ್ಪಿಸಿ ನ್ಯಾಯಯುತ ಕೂಲಿ ಮತ್ತು ಡಿಜಿಟಲ್ ಗುರುತು ಒದಗಿಸುವುದು.",
    btnCalculate: "ನ್ಯಾಯಯುತ ಬೆಲೆ ಲೆಕ್ಕಹಾಕಿ",
    btnExplore: "ಮಾರುಕಟ್ಟೆ ವೀಕ್ಷಿಸಿ",
    craftKasuti: "ಕಸೂತಿ ಕಲೆ (ಧಾರವಾಡ)",
    craftBeedu: "ಬೀಡು ಕಲೆ (ಕರಾವಳಿ)",
    craftKinhal: "ಕಿನ್ಹಾಳ ಮರಗೆಲಸ (ಕೊಪ್ಪಳ)",
    transparentPrice: "ಪಾರದರ್ಶಕ ನ್ಯಾಯಯುತ ಬೆಲೆ",
    whereMoneyGoes: "ಹಣ ಎಲ್ಲಿಗೆ ತಲುಪುತ್ತದೆ?",
    craftPassport: "ಕರಕುಶಲ ಪಾಸ್‌ಪೋರ್ಟ್",
    buyNow: "ಖರೀದಿಸಿ",
    demoBadge: "ಡೆಮೊ ಡೇಟಾ",
    giBadge: "ಭೌಗೋಳಿಕ ಮಾನ್ಯತೆ (GI)",
    materials: "ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳು",
    labour: "ಕುಶಲಕರ್ಮಿ ಶ್ರಮ",
    overhead: "ಕಾರ್ಯಾಗಾರ ವೆಚ್ಚ (8%)",
    heritage: "ಪಾರಂಪರಿಕ ಮೌಲ್ಯ",
    hours: "ಗಂಟೆಗಳು",
    fairWageVerified: "ನ್ಯಾಯಯುತ ಕೂಲಿ ದೃಢೀಕೃತ",
    paymentSimulated: "ಪಾವತಿಯು ಪ್ರಾಯೋಗಿಕವಾಗಿದೆ. ಪೂರ್ಣ ಮೊತ್ತ ಕುಶಲಕರ್ಮಿಗಳಿಗೆ ತಲುಪುತ್ತದೆ.",
  },
};
