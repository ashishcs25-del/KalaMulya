import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        artisan: {
          terracotta: "#B45309",
          "terracotta-dark": "#78350F",
          marigold: "#D97706",
          ochre: "#F59E0B",
          sand: "#FEF3C7",
          clay: "#FFFBEB",
          indigo: "#1E3A8A",
          forest: "#065F46",
          charcoal: "#1F2937",
        },
      },
    },
  },
  plugins: [],
};

export default config;
