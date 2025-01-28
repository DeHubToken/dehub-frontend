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
      exo: ["Exo", "sans-serif"]
    },
    extend: {
      colors: {
        // REMOVEME: Below are no longer needed.
        // TODO: Need quick check
        classic: {
          violet: "#2E064D",
          magenta: "#860C93",
          purple: "#8955AA",
          blue: "#45BFD6"
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
          // REMOVEME: Below will be removed.
          background: "hsl(var(--theme-background))",
          "mine-shaft-dark": "hsl(var(--theme-mine-shaft-dark))",
          "cloud-burst": "hsl(var(--theme-cloud-burst))",
          "mine-shaft": "hsl(var(--theme-mine-shaft))",
          "titan-white": "hsl(var(--theme-titan-white))",
          yellow: {
            25: "hsl(var(--theme-yellow-25))",
            50: "hsl(var(--theme-yellow-50))",
            100: "hsl(var(--theme-yellow-100))",
            200: "hsl(var(--theme-yellow-200))",
            300: "hsl(var(--theme-yellow-300))",
            400: "hsl(var(--theme-yellow-400))",
            500: "hsl(var(--theme-yellow-500))",
            600: "hsl(var(--theme-yellow-600))",
            700: "hsl(var(--theme-yellow-700))",
            800: "hsl(var(--theme-yellow-800))",
            900: "hsl(var(--theme-yellow-900))"
          },
          red: {
            25: "hsl(var(--theme-red-25))",
            50: "hsl(var(--theme-red-50))",
            100: "hsl(var(--theme-red-100))",
            200: "hsl(var(--theme-red-200))",
            300: "hsl(var(--theme-red-300))",
            400: "hsl(var(--theme-red-400))",
            500: "hsl(var(--theme-red-500))",
            600: "hsl(var(--theme-red-600))",
            700: "hsl(var(--theme-red-700))",
            800: "hsl(var(--theme-red-800))",
            900: "hsl(var(--theme-red-900))"
          },
          green: {
            25: "hsl(var(--theme-green-25))",
            50: "hsl(var(--theme-green-50))",
            100: "hsl(var(--theme-green-100))",
            200: "hsl(var(--theme-green-200))",
            300: "hsl(var(--theme-green-300))",
            400: "hsl(var(--theme-green-400))",
            500: "hsl(var(--theme-green-500))",
            600: "hsl(var(--theme-green-600))",
            700: "hsl(var(--theme-green-700))",
            800: "hsl(var(--theme-green-800))",
            900: "hsl(var(--theme-green-900))"
          },
          blue: {
            25: "hsl(var(--theme-blue-25))",
            50: "hsl(var(--theme-blue-50))",
            100: "hsl(var(--theme-blue-100))",
            200: "hsl(var(--theme-blue-200))",
            300: "hsl(var(--theme-blue-300))",
            400: "hsl(var(--theme-blue-400))",
            500: "hsl(var(--theme-blue-500))",
            600: "hsl(var(--theme-blue-600))",
            700: "hsl(var(--theme-blue-700))",
            800: "hsl(var(--theme-blue-800))",
            900: "hsl(var(--theme-blue-900))"
          },
          sky: {
            25: "hsl(var(--theme-sky-25))",
            50: "hsl(var(--theme-sky-50))",
            100: "hsl(var(--theme-sky-100))",
            200: "hsl(var(--theme-sky-200))",
            300: "hsl(var(--theme-sky-300))",
            400: "hsl(var(--theme-sky-400))",
            500: "hsl(var(--theme-sky-500))",
            600: "hsl(var(--theme-sky-600))",
            700: "hsl(var(--theme-sky-700))",
            800: "hsl(var(--theme-sky-800))",
            900: "hsl(var(--theme-sky-900))"
          },
          gray: {
            25: "hsl(var(--theme-gray-25))",
            50: "hsl(var(--theme-gray-50))",
            100: "hsl(var(--theme-gray-100))",
            200: "hsl(var(--theme-gray-200))",
            300: "hsl(var(--theme-gray-300))",
            400: "hsl(var(--theme-gray-400))",
            500: "hsl(var(--theme-gray-500))",
            600: "hsl(var(--theme-gray-600))",
            700: "hsl(var(--theme-gray-700))"
          }
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
        "accordion-down": "accordion-down 0.4s ease-out",
        "accordion-up": "accordion-up 0.4s ease-out"
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
