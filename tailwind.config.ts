import type { Config } from "tailwindcss"
const { addDynamicIconSelectors } = require("@iconify/tailwind")

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "color-primary-bright": "hsl(var(--color-primary-bright))",
        "color-secondary-bright": "hsl(var(--color-secondary-bright))",
        "color-accent-bright": "hsl(var(--color-accent-bright))",
        "color-warning-bright": "hsl(var(--color-warning-bright))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          1: "hsl(var(--primary-1))",
          2: "hsl(var(--primary-2))",
          3: "hsl(var(--primary-3))",
          4: "hsl(var(--primary-4))",
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
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          primary: {
            background: "hsl(var(--card-primary-background))",
            foreground: "hsl(var(--card-primary-foreground))",
            border: "hsl(var(--card-primary-border))",
            hover: "hsl(var(--card-primary-hover))",
          },
          "primary-1": {
            background: "hsl(var(--card-primary-1-background))",
            foreground: "hsl(var(--card-primary-1-foreground))",
          },
          "primary-2": {
            background: "hsl(var(--card-primary-2-background))",
            foreground: "hsl(var(--card-primary-2-foreground))",
          },
          "primary-3": {
            background: "hsl(var(--card-primary-3-background))",
            foreground: "hsl(var(--card-primary-3-foreground))",
          },
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontSize: "2.5rem",
            },
            h2: {
              fontSize: "2rem",
            },
            h3: {
              fontSize: "1.75rem",
            },
            h4: {
              fontSize: "1.5rem",
            },
            h5: {
              fontSize: "1.25rem",
            },
          },
        },
      },
      fontSize: {
        "heading-1": ["2.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        "heading-2": ["2rem", { lineHeight: "1.25", fontWeight: "700" }],
        "heading-3": ["1.75rem", { lineHeight: "1.3", fontWeight: "700" }],
        "heading-4": ["1.5rem", { lineHeight: "1.35", fontWeight: "700" }],
        "heading-5": ["1.25rem", { lineHeight: "1.4", fontWeight: "700" }],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    addDynamicIconSelectors(),
    require("tailwind-scrollbar")({ nocompatible: true }),
    require("@tailwindcss/typography"),
  ],
}

export default config
