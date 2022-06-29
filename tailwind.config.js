/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        themeBlack: "#120F13",
        themeBlackDarker: "#0b090c",
        themeGray: "#252329",
        themeBlue:'#2f80ed'
      },
    },
  },
  plugins: [],
};
