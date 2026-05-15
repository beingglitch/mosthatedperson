import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        paper: "#f4ede0",
        blood: "#c1121f",
        ember: "#fcbf49",
        mute: "#6b6357",
        line: "#1a1a1a",
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.05em",
      },
      keyframes: {
        "shake-up": {
          "0%,100%": { transform: "translate3d(0,0,0) rotate(0)" },
          "20%": { transform: "translate3d(-1px,-3px,0) rotate(-2deg)" },
          "40%": { transform: "translate3d(2px,-1px,0) rotate(2deg)" },
          "60%": { transform: "translate3d(-2px,1px,0) rotate(-1deg)" },
          "80%": { transform: "translate3d(1px,2px,0) rotate(1deg)" },
        },
        "tick-up": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-1.6em)", opacity: "0" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "shake-up": "shake-up 400ms ease-out",
        "tick-up": "tick-up 600ms ease-out forwards",
        "marquee": "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
