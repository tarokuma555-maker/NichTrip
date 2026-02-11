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
        navy: {
          DEFAULT: "#1A365D",
          light: "#2A4A7F",
          dark: "#102444",
        },
        accent: {
          DEFAULT: "#E53E3E",
          light: "#FC8181",
          dark: "#C53030",
        },
        sub: {
          DEFAULT: "#3182CE",
          light: "#63B3ED",
          dark: "#2B6CB0",
        },
        warm: {
          50: "#FFFBF5",
          100: "#FFF5E8",
          200: "#FEEBD2",
          300: "#FDD8A8",
          400: "#FBC97D",
        },
      },
    },
  },
  plugins: [],
};
export default config;
