/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./widget/**/*.{ts, js, vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        iranyekan: ["iranyekan"],
      },
      colors: {
        base: {
          100: "#FFFFFF",
          200: "#FCFCFB",
          250: "#F2F5F7",
          300: "#D3D5E2",
          350: "#D7D7D7",
          400: "#D9D9D9",
          500: "#7D7D7D",
          content: "#002145",
        },
        icon: "#002145",
        success: "#10CCAE",
        warning: "#ffcb1c",
        danger: "#ef4444",
        error: "#F35242",
        primary: {
          DEFAULT: "#0A65CD",
          hover: "#0AC7E2",
          focus: "#009FB9",
          active: "#009FB9",
          disabled: "#D9D9D9",
          text: "#FFFFFF"
        },
        secondary: {
          DEFAULT: "#F2F5F7",
          hover: "#0A65CD",
          focus: "#0B4B94",
          active: "#0B4B94",
          disabled: "#D9D9D9",
          text: "#488CDA"
        },
        main: {
          default: "#E52421",
          50: "#fff1f1",
          100: "#ffe1e1",
          200: "#ffc9c8",
          300: "#ffa2a1",
          400: "#fe6d6b",
          500: "#f73f3c",
          600: "#e52421",
          700: "#c01815",
          800: "#9f1715",
          900: "#841a18",
          950: "#480807",
        },
        disabled: "#7D7D7D"
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [],
  },
};
