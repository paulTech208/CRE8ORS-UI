/* eslint-disable global-require */
/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./shared/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        aldrich: ["Aldrich", "sans-serif"],
        objektivmk1_bold: ["Objektiv Mk1 Trial", "sans-serif"],
        eigerdals: ["Eigerdals", "sans-serif"],
        objektivmk1: ["Objektiv Mk1 Trial Rg", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
      },
      screens: {
        'ios' : '320px',
        samsungS8: "360px",
        'xs': '390px',
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1150px",
        "2xl":'1315px',
        "3xl": "1920px",
      },
    },
  },
  variants: {
    extend: {
      display: ["dark"],
    },
  },
  darkMode: ["class"],
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar")({ nocompatible: true }),
    // ...
  ],
}
