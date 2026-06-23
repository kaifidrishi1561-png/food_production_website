/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            orange: 'var(--button)  ',
            hoverOrange: 'var(--hoverButtonColor)',
            primary: '#FF5722',
            secondary: '#4CAF50',
        },
        

    },
  },
  plugins: [],
}