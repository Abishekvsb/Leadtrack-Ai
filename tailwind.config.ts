import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        heading: ["var(--font-heading)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["var(--font-heading)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          deep: "hsl(var(--primary-deep))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Dedicated Royal Crimson & Gold palette tokens
        crimson: {
          DEFAULT: "#D62828",
          hover: "#B81E1E",
          deep: "#8F1218",
          bright: "#E63946",
          dark: "#FF5A5F",
          tint: "#FDF2F2",
        },
        gold: {
          DEFAULT: "#FFC21A",
          soft: "#FFE08A",
          deep: "#E5A100",
          text: "#8A5A00",
          dark: "#FFD25A",
          tint: "#FFF9E6",
        },
        ink: {
          DEFAULT: "#17141A",
          muted: "#6B6470",
          dark: "#120A0C",
          darkSurface: "#1B1114",
          darkBorder: "#2E1D21",
          darkText: "#F7EFE6",
        },
      },
      borderRadius: {
        card: "14px",
        btn: "10px",
        input: "10px",
        badge: "6px",
        lg: "14px",
        md: "10px",
        sm: "6px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(23, 20, 26, 0.05)",
        card: "0 1px 3px 0 rgba(23, 20, 26, 0.04), 0 4px 14px 0 rgba(23, 20, 26, 0.03)",
        "card-hover": "0 8px 24px -4px rgba(214, 40, 40, 0.08), 0 2px 8px -2px rgba(23, 20, 26, 0.05)",
        floating: "0 16px 36px -8px rgba(23, 20, 26, 0.12), 0 4px 12px -2px rgba(23, 20, 26, 0.06)",
        "gold-glow": "0 0 20px -2px rgba(255, 194, 26, 0.4)",
        "crimson-glow": "0 0 24px -2px rgba(214, 40, 40, 0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer-sweep": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        "marquee-scroll": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "aurora-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(4%, 3%) scale(1.08)" },
        },
        "gold-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 194, 26, 0.5)" },
          "50%": { boxShadow: "0 0 0 8px rgba(255, 194, 26, 0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "shimmer-sweep": "shimmer-sweep 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "marquee-scroll": "marquee-scroll 28s linear infinite",
        "aurora-drift": "aurora-drift 18s ease-in-out infinite",
        "gold-pulse": "gold-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
