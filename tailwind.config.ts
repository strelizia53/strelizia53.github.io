import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#F6F6F6",
          dark: "#000000",
        },
        foreground: {
          light: "#000000",
          dark: "#F6F6F6",
        },
        accent: "#CFFFE2",
        muted: "#A2D5C6",
      },
    },
  },
  plugins: [],
};

export default config;
