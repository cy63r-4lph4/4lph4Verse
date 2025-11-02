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
      screens: { "2xl": "1400px" },
    },

    extend: {
      /* -------------------------------------------------------------- */
      /* 🪶 Fonts                                                      */
      /* -------------------------------------------------------------- */
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        body: ["Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      /* -------------------------------------------------------------- */
      /* 🎨 Core Colors & System Tokens                                 */
      /* -------------------------------------------------------------- */
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        /* Main Palettes */
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

        /* Supporting Layers */
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      /* -------------------------------------------------------------- */
      /* 🌌 Backgrounds & Gradients                                     */
      /* -------------------------------------------------------------- */
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-core": "var(--gradient-core)",
        "gradient-radiant": "var(--gradient-radiant)",
        "gradient-aura": "var(--gradient-aura)",
        "gradient-nebula": "var(--gradient-nebula)",
        "grid-cyber":
          "repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.03) 20px)",
      },

      /* -------------------------------------------------------------- */
      /* 🌀 Effects & Motion                                            */
      /* -------------------------------------------------------------- */
      boxShadow: {
        aura: "var(--shadow-aura)",
        core: "var(--shadow-core)",
        radiant: "var(--shadow-radiant)",
        glass: "var(--shadow-glass)",
        float: "var(--shadow-float)",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
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
        "cosmic-drift": {
          to: { backgroundPosition: "200% center" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },

      animation: {
        "aura-pulse": "aura-pulse 3s ease-in-out infinite",
        "float-gentle": "float-gentle 6s ease-in-out infinite",
        "cosmic-drift": "cosmic-drift 30s linear infinite",
        spin: "spin 1.5s linear infinite",
      },

      backdropBlur: {
        mystic: "24px",
        deep: "40px",
      },
    },
  },

  /* -------------------------------------------------------------- */
  /* 🔮 Plugins                                                     */
  /* -------------------------------------------------------------- */
  plugins: [require("tailwindcss-animate")],
};
