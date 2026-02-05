/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#6B46C1", // Purple accent
        background: {
          primary: "#000000",
          secondary: "#0a0a0a",
          card: "#121212",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#A0A0A0",
          muted: "#666666",
        },
        border: "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Roboto", "system-ui", "sans-serif"],
      },
      borderRadius: {
        macos: "16px",
      },
      boxShadow: {
        macos: "0 2px 8px rgba(0, 0, 0, 0.16), 0 0 1px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};
