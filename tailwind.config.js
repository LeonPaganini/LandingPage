/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        roseGlow: "#FF8DA1",
        peachGlow: "#FFD4B8",
        softBeige: "#FBEEDD",
        rosyBeige: "#F4A9A3",
        deepText: "#1E1E1E",
        mutedText: "#4A4A4A",
        cta: "#E05780",
        icon: "#D17B8F",
      },
      fontFamily: {
        inter: ["Inter", "Poppins", "Manrope", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 10px 40px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        glass: "24px",
      },
    },
  },
  plugins: [],
};
