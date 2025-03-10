/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'right-only': '4px 0px 8px -2px rgba(0, 0, 0, 0.05)'
      },
    },
    colors: {
      'gold': '#E50914',
      'grey': '#B3B3B3',
      'white': '#FFFFFF',
      'black': '#141414'
    },
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
      playball: ['Playball', 'cursive'],
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

