import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0e1511",
        surface: "#0e1511",
        "surface-low": "#161d1a",
        "surface-card": "#1a211d",
        "surface-high": "#242c28",
        primary: "#42e5b0",
        "primary-container": "#00c896",
        secondary: "#bec6e0",
        tertiary: "#ffbca2",
        outline: "#85948c",
        "outline-variant": "#3c4a43",
        "on-surface": "#dce4de",
        "on-surface-variant": "#bbcac1",
        danger: "#ffb4ab"
      },
      fontFamily: {
        heading: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        label: ["var(--font-geist)", "Geist", "sans-serif"]
      },
      boxShadow: {
        glow: "0 18px 60px rgba(66, 229, 176, 0.16)",
        glass: "0 18px 50px rgba(0, 0, 0, 0.35)"
      },
      borderRadius: {
        card: "16px"
      }
    }
  },
  plugins: []
};

export default config;
