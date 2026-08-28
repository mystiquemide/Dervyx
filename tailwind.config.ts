import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101416",
        surface: "#151b1d",
        raise: "#1b2224",
        edge: "#2b383b",
        cream: "#edf2f2",
        muted: "#91a2a3",
        faint: "#83908f",
        teal: { DEFAULT: "#91d8d0", deep: "#5fb3aa", ink: "#0f6e64" },
        anomaly: "#e8a24a",
        caution: "#d2a95e",
        danger: "#ef9a9a",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Inter",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        serif: ["ui-serif", "Georgia", "Cambria", "serif"],
      },
      maxWidth: { measure: "66ch" },
      letterSpacing: { widest2: "0.16em" },
      transitionTimingFunction: { calm: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
  },
  plugins: [],
};

export default config;
