export type Language = "en" | "kn";

export interface Translations {
  appName: string;
  tagline: string;
  navStorefront: string;
  navListCraft: string;
  navSellerPortal: string;
  navAdmin: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  allCrafts: string;
  craftKasuti: string;
  craftBeedu: string;
  craftKinhal: string;
  collectionTitle: string;
  collectionSubtitle: string;
  transparentPrice: string;
  whereMoneyGoes: string;
  hideBreakdown: string;
  craftPassport: string;
  buyNow: string;
  giBadge: string;
  featuredBadge: string;
  materials: string;
  labour: string;
  overhead: string;
  heritage: string;
  byArtisan: string;
  footerTitle: string;
  footerSubtitle: string;
  footerText: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "KalaMulya",
    tagline: "Fair Price • Craft Passport",
    navStorefront: "Storefront",
    navListCraft: "List Craft",
    navSellerPortal: "Seller Portal",
    navAdmin: "Admin",
    heroBadge: "Handmade Heritage From Karnataka's Master Makers",
    heroTitle: "Fair Pricing & Digital Provenance for Traditional Crafts",
    heroSubtitle: "Support makers of Kasuti embroidery, Beedu reed weaving, and Kinhal woodcraft. Every purchase includes a transparent price breakdown and a verifiable Craft Passport.",
    allCrafts: "All Items",
    craftKasuti: "Kasuti Embroidery",
    craftBeedu: "Beedu Craft",
    craftKinhal: "Kinhal Woodcraft",
    collectionTitle: "Artisan Collection",
    collectionSubtitle: "Direct connection with traditional makers. 100% price transparency.",
    transparentPrice: "Fair Price",
    whereMoneyGoes: "Cost breakdown",
    hideBreakdown: "Hide breakdown",
    craftPassport: "Passport",
    buyNow: "Buy Now",
    giBadge: "GI Tagged",
    featuredBadge: "Featured",
    materials: "Materials",
    labour: "Labour",
    overhead: "Overhead",
    heritage: "Heritage",
    byArtisan: "By",
    footerTitle: "KalaMulya (ಕಲಾಮೌಲ್ಯ)",
    footerSubtitle: "A fair-price marketplace connecting conscious buyers directly with Karnataka's heritage artisans.",
    footerText: "Empowering artisans through transparent pricing and digital provenance.",
  },
  kn: {
    appName: "ಕಲಾಮೌಲ್ಯ",
    tagline: "ನ್ಯಾಯಯುತ ಬೆಲೆ • ಕರಕುಶಲ ಪಾಸ್‌ಪೋರ್ಟ್",
    navStorefront: "ಮುಖಪುಟ",
    navListCraft: "ಕರಕುಶಲ ಸೇರಿಸಿ",
    navSellerPortal: "ಮಾರಾಟಗಾರರ ಖಾತೆ",
    navAdmin: "ನಿರ್ವಾಹಕ",
    heroBadge: "ಕರ್ನಾಟಕದ ಶ್ರೇಷ್ಠ ಕುಶಲಕರ್ಮಿಗಳ ಪಾರಂಪರಿಕ ಕಲೆ",
    heroTitle: "ಸಾಂಪ್ರದಾಯಿಕ ಕರಕುಶಲ ಕಲೆಗಳಿಗೆ ನ್ಯಾಯಯುತ ಬೆಲೆ ಮತ್ತು ಡಿಜಿಟಲ್ ಗುರುತು",
    heroSubtitle: "ಕಸೂತಿ, ಬೀಡು ಹೆಣಿಗೆ ಮತ್ತು ಕಿನ್ಹಾಳ ಮರಗೆಲಸದ ಕುಶಲಕರ್ಮಿಗಳಿಗೆ ನೇರ ಮಾರುಕಟ್ಟೆ. ಪ್ರತಿ ಖರೀದಿಯು ಪಾರದರ್ಶಕ ಬೆಲೆ ಮತ್ತು ಅಧಿಕೃತ ಕರಕುಶಲ ಪಾಸ್‌ಪೋರ್ಟ್ ಒಳಗೊಂಡಿದೆ.",
    allCrafts: "ಎಲ್ಲಾ ವಸ್ತುಗಳು",
    craftKasuti: "ಕಸೂತಿ ಕಲೆ (ಧಾರವಾಡ)",
    craftBeedu: "ಬೀಡು ಕಲೆ (ಕರಾವಳಿ)",
    craftKinhal: "ಕಿನ್ಹಾಳ ಮರಗೆಲಸ (ಕೊಪ್ಪಳ)",
    collectionTitle: "ಕುಶಲಕರ್ಮಿಗಳ ಸಂಗ್ರಹ",
    collectionSubtitle: "ಸಾಂಪ್ರದಾಯಿಕ ಕುಶಲಕರ್ಮಿಗಳೊಂದಿಗೆ ನೇರ ಸಂಪರ್ಕ. 100% ಪಾರದರ್ಶಕ ಬೆಲೆ.",
    transparentPrice: "ನ್ಯಾಯಯುತ ಬೆಲೆ",
    whereMoneyGoes: "ವೆಚ್ಚದ ವಿವರ",
    hideBreakdown: "ವಿವರ ಮರೆಮಾಡಿ",
    craftPassport: "ಪಾಸ್‌ಪೋರ್ಟ್",
    buyNow: "ಖರೀದಿಸಿ",
    giBadge: "ಭೌಗೋಳಿಕ ಮಾನ್ಯತೆ (GI)",
    featuredBadge: "ವಿಶೇಷ ವಸ್ತು",
    materials: "ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳು",
    labour: "ಕುಶಲಕರ್ಮಿ ಶ್ರಮ",
    overhead: "ಕಾರ್ಯಾಗಾರ ವೆಚ್ಚ (8%)",
    heritage: "ಪಾರಂಪರಿಕ ಮೌಲ್ಯ",
    byArtisan: "ರಚನೆಕಾರರು",
    footerTitle: "ಕಲಾಮೌಲ್ಯ",
    footerSubtitle: "ಕರ್ನಾಟಕದ ಸಾಂಪ್ರದಾಯಿಕ ಕುಶಲಕರ್ಮಿಗಳಿಗೆ ನೇರ ನ್ಯಾಯಯುತ ಮಾರುಕಟ್ಟೆ ವೇದಿಕೆ.",
    footerText: "ಪಾರದರ್ಶಕ ಬೆಲೆ ಮತ್ತು ಡಿಜಿಟಲ್ ಕರಕುಶಲ ಪಾಸ್‌ಪೋರ್ಟ್ ಮೂಲಕ ಕುಶಲಕರ್ಮಿಗಳ ಸಬಲೀಕರಣ.",
  },
};
