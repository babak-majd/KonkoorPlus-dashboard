/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        iranyekan: ["iranyekan"],
      },
      fontSize: {
        xs: ['12px', { lineHeight: "15px", fontWeight: "400" }],
        sm: ['14px', { lineHeight: "17.5px", fontWeight: "400" }],
        base: ['16px', { lineHeight: "24px", fontWeight: "400" }],
        lg: ['18px', { lineHeight: "27px", fontWeight: "400" }],
        xl: ['20px', { lineHeight: "30px", fontWeight: "400" }],
        "2xl": ['24px', { lineHeight: "36px", fontWeight: "400" }],
        "3xl": ['30px', { lineHeight: "37.5px", fontWeight: "400" }],
        "4xl": ['36px', { lineHeight: "45px", fontWeight: "400" }],
        "5xl": ['48px', { lineHeight: "48px", fontWeight: "400" }],
        "6xl": ['60px', { lineHeight: "60px", fontWeight: "400" }],
      },
      colors: {
        base: {
          100: "#FFFFFF",
          200: "#FCFCFB",
          250: "#F5F5F4",
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
          DEFAULT: "#E52421",
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
        disabled: "#78716C"
      },
    },
  },
  plugins: [],
}

