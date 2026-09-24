import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-border": "var(--card-border)",
        primary: "var(--primary)",
        "primary-dim": "var(--primary-dim)",
        accent: "var(--accent)",
        danger: "var(--danger)",
        warning: "var(--warning)",
        muted: "var(--muted)",
        success: "var(--success)",
      },
    },
  },
  plugins: [],
};
export default config;
