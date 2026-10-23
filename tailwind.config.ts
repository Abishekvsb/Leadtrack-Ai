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
        sans: ["var(--font-instrument)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
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
        // Dedicated editorial brand palette
        forest: {
          DEFAULT: "#0F3D33",
          light: "#185346",
          dark: "#09251F",
          mint: "#4FB89A",
        },
        saffron: {
          DEFAULT: "#E0A030",
          tint: "#FAF1E1",
          dark: "#9E6C16",
        },
        terracotta: {
          DEFAULT: "#C4552F",
          tint: "#FAF0EC",
          dark: "#8D3418",
        },
        slateBlue: {
          DEFAULT: "#5B7083",
          tint: "#EEF3F7",
          dark: "#3B4C5B",
        },
        ivory: {
          DEFAULT: "#F6F2EA",
          surface: "#FFFFFF",
          border: "#E4DDD0",
          hover: "#EFE8DC",
        },
        ink: {
          DEFAULT: "#1B1A17",
          muted: "#6B665C",
          dark: "#0F1412",
          darkSurface: "#171D1A",
          darkBorder: "#26302B",
          darkText: "#ECE8DF",
        },
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
        input: "8px",
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ruled-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "fade-up": "fade-up 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "ruled-pulse": "ruled-pulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
