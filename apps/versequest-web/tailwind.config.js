/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        mystic: ["Cinzel Decorative", "serif"],
        tech: ["Space Grotesk", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },

      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },

        core: {
          DEFAULT: "hsl(var(--core))",
          foreground: "hsl(var(--core-foreground))",
          glow: "hsl(var(--core-glow))",
        },

        radiant: {
          DEFAULT: "hsl(var(--radiant))",
          foreground: "hsl(var(--radiant-foreground))",
          glow: "hsl(var(--radiant-glow))",
        },

        aura: {
          dim: "hsl(var(--aura-dim))",
          kindled: "hsl(var(--aura-kindled))",
          radiant: "hsl(var(--aura-radiant))",
          luminous: "hsl(var(--aura-luminous))",
          ascendant: "hsl(var(--aura-ascendant))",
          draconic: "hsl(var(--aura-draconic))",
        },

        quest: {
          wisdom: "hsl(var(--quest-wisdom))",
          discovery: "hsl(var(--quest-discovery))",
          mastery: "hsl(var(--quest-mastery))",
        },

        glass: {
          DEFAULT: "hsl(var(--glass))",
          border: "hsl(var(--glass-border))",
          glow: "hsl(var(--glass-glow))",
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
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 2px)",
        "2xl": "calc(var(--radius) + 6px)",
      },

      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-core": "var(--gradient-core)",
        "gradient-radiant": "var(--gradient-radiant)",
        "gradient-aura": "var(--gradient-aura)",
        "gradient-glass": "var(--gradient-glass)",
        "gradient-nebula": "var(--gradient-nebula)",
        "grid-cyber":
          "repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.03) 20px)",
      },

      boxShadow: {
        aura: "var(--shadow-aura)",
        core: "var(--shadow-core)",
        radiant: "var(--shadow-radiant)",
        glass: "var(--shadow-glass)",
        float: "var(--shadow-float)",
        nebula: "0 0 40px -10px var(--color-nebula)",
      },

      keyframes: {
        "aura-pulse": {
          "0%,100%": { opacity: "0.8", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        "float-gentle": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "glow-expand": {
          "0%,100%": { filter: "blur(6px)", opacity: "0.8" },
          "50%": { filter: "blur(12px)", opacity: "1" },
        },
        "cosmic-drift": {
          to: { backgroundPosition: "200% center" },
        },
        "particle-float": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },

      animation: {
        "aura-pulse": "aura-pulse 3s ease-in-out infinite",
        "float-gentle": "float-gentle 6s ease-in-out infinite",
        "glow-expand": "glow-expand 2s ease-in-out infinite",
        "cosmic-drift": "cosmic-drift 30s linear infinite",
        "particle-float": "particle-float 8s ease-in-out infinite",
        spin: "spin 1.5s linear infinite",
      },

      backdropBlur: {
        mystic: "24px",
        deep: "40px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
