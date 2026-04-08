import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // OLED Primary Colors
        primary: "#d1a2fe",
        "primary-dim": "#c395ef",
        "primary-container": "#3b1e5a",
        
        // Secondary & Tertiary
        secondary: "#be82ff",
        "secondary-dim": "#be82ff",
        tertiary: "#d8b1ff",
        
        // Surface Colors (OLED Black)
        surface: "#000000",
        "surface-variant": "#12051f",
        "surface-container": "#0c0c0c",
        "surface-container-low": "#080808",
        "surface-container-high": "#1a0b2e",
        "surface-container-highest": "#1c1c1c",
        
        // On-Surface Colors
        "on-surface": "#f2f2f2",
        "on-surface-variant": "#a1a1aa",
        
        // Error Colors
        error: "#ff6e84",
        "error-dim": "#ff4d6d",
        "error-container": "#a70138",
        
        // Outline Colors
        outline: "#4a3b5a",
        "outline-variant": "#2d2d2d",
        
        // Background
        background: "#000000",
        foreground: "#f2f2f2",
      },
      fontFamily: {
        sans: ["var(--font-body)", "Inter", "sans-serif"],
        headline: ["var(--font-headline)", "Space Grotesk", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
        label: ["var(--font-body)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "pulse-slow": "pulse-slow 8s infinite ease-in-out",
        "status-pulse": "subtle-pulse 2s infinite ease-in-out",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.3", transform: "scale(1) translate(-50%, -50%)" },
          "50%": { opacity: "0.6", transform: "scale(1.1) translate(-50%, -45%)" },
        },
        "subtle-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(0.98)" },
        },
      },
    },
  },
  plugins: [],
}

export default config
