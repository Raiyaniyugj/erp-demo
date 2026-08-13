/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        elite: {
          info: '#03a9f3',
          success: '#00c292',
          warning: '#fec107',
          danger: '#fb9678',
          sidebar: '#2f323e',
          bg: '#f2f7f8',
          text: '#212529',
          border: '#e9ecef',
        }
      }
    },
  },
  plugins: [],
}
