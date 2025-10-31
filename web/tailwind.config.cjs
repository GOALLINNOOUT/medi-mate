/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'], // supports both class and data-theme toggle
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 💙 MediMate Brand Colors
        primary: "#2D9CDB",
        "primary-light": "#56CCF2",
        secondary: "#27AE60",

        // 🩶 Neutrals
        background: "#F9FAFB",
        surface: "#FFFFFF",
        border: "#E5E7EB",

        // 🩺 Text Colors
        text: {
          primary: "#111827",
          secondary: "#6B7280",
        },

        // 🚦 Status Colors
        error: "#E63946",
        warning: "#F59E0B",
        info: "#3B82F6",
        success: "#10B981",

        // 🌙 Dark Mode Overrides (for optional use)
        dark: {
          background: "#0F172A",
          surface: "#1E293B",
          border: "#374151",
          text: {
            primary: "#F9FAFB",
            secondary: "#9CA3AF",
          },
        },
      },
    },
  },
  plugins: [],
};
