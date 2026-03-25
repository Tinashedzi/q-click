import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Inter', 'system-ui', 'sans-serif'],
        journal: ['Inter', 'system-ui', 'sans-serif'],
        grotesk: ['Inter', 'system-ui', 'sans-serif'],
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Britannica Bright-Clean palette
        "britannica-green": "hsl(var(--britannica-green))",
        "britannica-blue": "hsl(var(--britannica-blue))",
        "britannica-teal": "hsl(var(--britannica-teal))",
        // Legacy aliases — mapped to new palette
        "midnight-teal": "hsl(var(--midnight-teal))",
        "electric-cyan": "hsl(var(--electric-cyan))",
        "sunset-coral": "hsl(var(--sunset-coral))",
        "pearl-mist": "hsl(var(--pearl-mist))",
        "deep-lagoon": "hsl(var(--deep-lagoon))",
        abyss: "hsl(var(--abyss))",
        jade: "hsl(var(--britannica-green))",
        clay: "hsl(var(--britannica-green))",
        petal: "hsl(var(--britannica-green))",
        gold: "hsl(var(--britannica-green))",
        wave: "hsl(var(--britannica-blue))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        float: "var(--shadow-float)",
        deep: "var(--shadow-deep)",
        "glow-green": "var(--shadow-green-glow)",
        "glow-blue": "var(--shadow-blue-glow)",
        // Legacy aliases
        elevated: "var(--shadow-deep)",
        "glow-cyan": "var(--shadow-blue-glow)",
        "glow-coral": "var(--shadow-green-glow)",
        "glow-jade": "var(--shadow-green-glow)",
        "glow-petal": "var(--shadow-green-glow)",
        "glow-gold": "var(--shadow-green-glow)",
        "glow-clay": "var(--shadow-green-glow)",
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "float-gentle": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-8px) rotate(1deg)" },
          "66%": { transform: "translateY(4px) rotate(-0.5deg)" },
        },
        "morph": {
          "0%, 100%": { borderRadius: "42% 58% 60% 40% / 45% 55% 45% 55%" },
          "25%": { borderRadius: "55% 45% 40% 60% / 60% 40% 55% 45%" },
          "50%": { borderRadius: "45% 55% 55% 45% / 40% 60% 45% 55%" },
          "75%": { borderRadius: "60% 40% 45% 55% / 55% 45% 60% 40%" },
        },
        "breathe": {
          "0%, 100%": { transform: "scale(1)", filter: "brightness(1)" },
          "50%": { transform: "scale(1.03)", filter: "brightness(1.05)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "float-gentle": "float-gentle 6s ease-in-out infinite",
        "morph": "morph 8s ease-in-out infinite",
        "breathe": "breathe 6s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
