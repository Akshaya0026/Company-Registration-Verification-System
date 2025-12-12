/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: "#4f46e5",
        "brand-dark": "#4338ca"
      }
    }
  },
  plugins: []
};
