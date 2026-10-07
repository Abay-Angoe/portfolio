import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic design tokens (defined in globals.css). Using them means dark
        // mode is defined once, not per-component.
        win: "var(--win)",
        panel: "var(--panel)",
        sunken: "var(--sunken)",
        line: "var(--line)",
        ink: "var(--text)",
        dim: "var(--dim)",
        faint: "var(--faint)",
        accent: "var(--accent)",
      },
    },
  },
  plugins: [],
};
export default config;
