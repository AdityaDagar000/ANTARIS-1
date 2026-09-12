/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0B101D",
          card: "rgba(13, 22, 41, 0.78)",
          cardHover: "rgba(20, 32, 58, 0.85)",
          border: "rgba(255, 255, 255, 0.12)",
          borderGlow: "rgba(56, 189, 248, 0.3)",
          accent: "#00A8FF",
          accentGlow: "rgba(0, 168, 255, 0.25)",
        },
        status: {
          operational: "#10B981",
          atRisk: "#F59E0B",
          critical: "#EF4444",
          info: "#3B82F6",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        neonCyan: '0 0 15px rgba(0, 168, 255, 0.3)',
        neonGreen: '0 0 12px rgba(16, 185, 129, 0.4)',
      }
    },
  },
  plugins: [],
};
