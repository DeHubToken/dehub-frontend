import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    screens: {
      "2xs": "320px",
      xs: "480px",
      sm: "640px",
      md: "960px",
      lg: "1160px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1925px",
      "4xl": "2560px",
      "5xl": "3840px"
    },
    container: {
      center: true,
      screens: {
        "2xl": "1600px",
        xl: "1280px",
        lg: "1024px",
        md: "768px",
        sm: "640px",
        xs: "480px",
        "2xs": "340px"
      }
    },
    fontFamily: {
      archivo: ["Archivo", "sans-serif"],
      tanker: ["Tanker", "sans-serif"],
      nunito: ["Nunito", "sans-serif"]
    },
    extend: {
      colors: {
        classic: {
          pink: "#FF0080",
          blue: "#0070F3",
          cyan: "#50E3C2",
          orange: "#F5A623",
          violet: "#7928CA"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        theme: {
          background: "hsl(var(--theme-background))",
          "mine-shaft-dark": "hsl(var(--theme-mine-shaft-dark))",
          "cloud-burst": "hsl(var(--theme-cloud-burst))",
          "mine-shaft": "hsl(var(--theme-mine-shaft))",
          "titan-white": "hsl(var(--theme-titan-white))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      keyframes: ({ theme }) => ({
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)"
          }
        },
        translateXReset: {
          "100%": {
            transform: "translateX(0)"
          }
        },
        fadeToTransparent: {
          "0%": {
            opacity: "1"
          },
          "40%": {
            opacity: "1"
          },
          "100%": {
            opacity: "0"
          }
        },
        rerender: {
          "0%": {
            ["border-color"]: theme("colors.classic.pink")
          },
          "40%": {
            ["border-color"]: theme("colors.classic.pink")
          }
        },
        highlight: {
          "0%": {
            background: theme("colors.classic.pink"),
            color: theme("colors.white")
          },
          "40%": {
            background: theme("colors.classic.pink"),
            color: theme("colors.white")
          }
        },
        loading: {
          "0%": {
            opacity: ".2"
          },
          "20%": {
            opacity: "1",
            transform: "translateX(1px)"
          },
          to: {
            opacity: ".2"
          }
        }
      }),
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    },
    boxShadow: {
      default: "0 0 10px 0 hsl(var(--theme-orange-500))",
      custom: "0 10px 50px 5px hsl(var(--theme-monochrome-700))"
    },
    dropShadow: {
      default: "0 0 10px 0 hsl(var(--theme-orange-500))"
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries")
  ]
} satisfies Config;

export default config;
