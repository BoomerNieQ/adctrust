import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        boogaloo: ["Boogaloo", "cursive"],
        fredoka: ["Fredoka One", "cursive"],
      },
      colors: {
        dhl: {
          yellow: "#FFCC00",
          red: "#D40511",
          dark: "#1C1C1C",
          gray: "#2A2A2A",
        },
      },
      keyframes: {
        windmill: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
        confetti: {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(255, 204, 0, 0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(255, 204, 0, 0.7)" },
        },
      },
      animation: {
        windmill: "windmill 3s linear infinite",
        "windmill-slow": "windmill 8s linear infinite",
        float: "float 4s ease-in-out infinite",
        shake: "shake 0.5s ease-in-out",
        confetti: "confetti 3s ease-in forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
