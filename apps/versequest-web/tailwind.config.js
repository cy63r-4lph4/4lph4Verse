export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'mystic': ['Cinzel Decorative', 'serif'],
				'tech': ['Space Grotesk', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				core: {
					DEFAULT: 'hsl(var(--core))',
					foreground: 'hsl(var(--core-foreground))',
					glow: 'hsl(var(--core-glow))'
				},
				radiant: {
					DEFAULT: 'hsl(var(--radiant))',
					foreground: 'hsl(var(--radiant-foreground))',
					glow: 'hsl(var(--radiant-glow))'
				},
				aura: {
					dim: 'hsl(var(--aura-dim))',
					kindled: 'hsl(var(--aura-kindled))',
					radiant: 'hsl(var(--aura-radiant))',
					luminous: 'hsl(var(--aura-luminous))',
					ascendant: 'hsl(var(--aura-ascendant))',
					draconic: 'hsl(var(--aura-draconic))'
				},
				quest: {
					wisdom: 'hsl(var(--quest-wisdom))',
					discovery: 'hsl(var(--quest-discovery))',
					mastery: 'hsl(var(--quest-mastery))'
				},
				glass: {
					DEFAULT: 'hsl(var(--glass))',
					border: 'hsl(var(--glass-border))',
					glow: 'hsl(var(--glass-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-core': 'var(--gradient-core)',
				'gradient-radiant': 'var(--gradient-radiant)',
				'gradient-aura': 'var(--gradient-aura)',
				'gradient-glass': 'var(--gradient-glass)',
				'gradient-nebula': 'var(--gradient-nebula)'
			},
			boxShadow: {
				'aura': 'var(--shadow-aura)',
				'core': 'var(--shadow-core)',
				'radiant': 'var(--shadow-radiant)',
				'glass': 'var(--shadow-glass)',
				'float': 'var(--shadow-float)'
			},
			animation: {
				'aura-pulse': 'aura-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'float-gentle': 'float-gentle 8s ease-in-out infinite',
				'glow-expand': 'glow-expand 2s ease-in-out infinite',
				'cosmic-drift': 'cosmic-drift 20s linear infinite',
				'particle-float': 'particle-float 6s ease-in-out infinite',
				'spin': 'spin 1s linear infinite'
			},
			backdropBlur: {
				'mystic': '24px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}
