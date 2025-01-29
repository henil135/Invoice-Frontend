/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgprimary: '#2A7C76',  
        black: '#222',  
        grey: '#666666', 
      
      },
    },
  },
  plugins: [],
}