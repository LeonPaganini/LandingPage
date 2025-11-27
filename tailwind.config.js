/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          900: "#1F4D3A",
          700: "#2E6A50",
          500: "#3E8C67",
          300: "#66B08E",
        },
        olive: {
          900: "#3E4C35",
          700: "#556247",
        },
        peach: {
          500: "#F4CBB4",
        },
        blush: {
          300: "#F0D9D3",
        },
        success: "#2E8B57",
        warning: "#C9A441",
        error: "#C45B5B",
        neutral: {
          900: "#1F2622",
          600: "#4A554F",
          400: "#8A938D",
        },
        surface: {
          100: "#F6F4F2",
          200: "#EFEAE6",
        },
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
