/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'very-dark-gray': 'hsl(0, 0%, 17%)',
        'dark-gray': 'hsl(0, 0%, 59%)',
      },
      fontFamily: {
        'rubik': ['Rubik', 'sans-serif'],
      },
      fontSize: {
        'input': '18px',
      }
    },
  },
  plugins: [],
}