import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Sampled from the PK Farms logo — flat colours, no gradients
          ink: "#1F2D24",       // deep forest green-black — primary text
          accent: "#0B5B36",    // forest green — links, icons, highlights
          funk: "#0B5B36",      // forest green — buttons / primary CTA
          funkDark: "#08472A",  // forest green hover
          plum: "#C4553C",      // terracotta accent
          tan: "#E2A230",       // harvest gold (logo)
          cream: "#FBF8F1",     // page background — warm cream
          soft: "#F4EDDA",      // warm parchment surface (hero, page banners)
          muted: "#6B7566",     // secondary text
          line: "#E6E0CC",      // hairline borders
          strip: "#E7F0E4",     // soft sage for pills / chips
        },
      },
      fontFamily: {
        // Headings — Figtree
        display: ["'Figtree'", "system-ui", "sans-serif"],
        // Body, buttons and UI text — Nunito
        body: ["'Nunito'", "system-ui", "sans-serif"],
        // Accent words — italic
        script: ["'Figtree'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 24px -12px rgba(31,45,36, 0.16)",
      },
      animation: {
        marquee: "marquee 45s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
