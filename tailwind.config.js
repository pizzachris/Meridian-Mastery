/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "!./src/**/*.test.{js,jsx,ts,tsx}",
    "!./node_modules/**/*",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Kuk Sool Won colors
        primary: {
          gold: "#FFD700",
          red: "#DC2626",
          black: "#000000",
        },
        // 5 Elements colors
        elements: {
          wood: "#10B981", // Green
          fire: "#EF4444", // Red
          earth: "#F59E0B", // Gold
          metal: "#F3F4F6", // White
          water: "#3B82F6", // Blue
          violet: "#8B5CF6", // Violet for CV/GV
        },
        gold: "#FFD700",
        deepred: "#7B2D26",
        dark: "#181512",
      },
      fontFamily: {
        serif: ["Cinzel", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      transformStyle: {
        "preserve-3d": "preserve-3d",
      },
      backfaceVisibility: {
        hidden: "hidden",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".transform-style-preserve-3d": {
          "transform-style": "preserve-3d",
        },
        ".backface-hidden": {
          "backface-visibility": "hidden",
        },
        ".rotate-y-180": {
          transform: "rotateY(180deg)",
        },
      });
    },
  ],
};
