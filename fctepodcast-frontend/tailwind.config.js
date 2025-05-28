import { heroui } from "@heroui/react";
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
      keyframes: {
        bounceDot: {
          "0%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-0.5rem)" },
        },
      },
      animation: {
        "bounce-dot": "bounceDot 1.4s infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      defaultTheme: "dark",
      themes: {
        dark: {
          colors: {
            // primary: {
            //   50: "#2c193f",
            //   100: "#462764",
            //   200: "#603689",
            //   300: "#7944ae",
            //   400: "#9353d3",
            //   500: "#a671db",
            //   600: "#b98fe2",
            //   700: "#ccadea",
            //   800: "#dfcbf2",
            //   900: "#f2eafa",
            //   foreground: "#fff",
            //   DEFAULT: "#9353d3",
            // },
            // secondary: {
            //   50: "#1e254d",
            //   100: "#2f3a79",
            //   200: "#404fa6",
            //   300: "#5265d2",
            //   400: "#637aff",
            //   500: "#7e91ff",
            //   600: "#9aa9ff",
            //   700: "#b5c0ff",
            //   800: "#d0d7ff",
            //   900: "#eceeff",
            //   foreground: "#000",
            //   DEFAULT: "#637aff",
            // },
            success: {
              50: "#073c1e",
              100: "#0b5f30",
              200: "#0f8341",
              300: "#13a653",
              400: "#17c964",
              500: "#40d27f",
              600: "#68dc9a",
              700: "#91e5b5",
              800: "#b9efd1",
              900: "#e2f8ec",
              foreground: "#000",
              DEFAULT: "#17c964",
            },
            warning: {
              50: "#4a320b",
              100: "#744e11",
              200: "#9f6b17",
              300: "#ca881e",
              400: "#f5a524",
              500: "#f7b54a",
              600: "#f9c571",
              700: "#fad497",
              800: "#fce4bd",
              900: "#fef4e4",
              foreground: "#000",
              DEFAULT: "#f5a524",
            },
            danger: {
              50: "#49051d",
              100: "#73092e",
              200: "#9e0c3e",
              300: "#c80f4f",
              400: "#f31260",
              500: "#f53b7c",
              600: "#f76598",
              700: "#f98eb3",
              800: "#fbb8cf",
              900: "#fee1eb",
              foreground: "#000",
              DEFAULT: "#f31260",
            },
          },
        },
      },
    }),
  ],
};
