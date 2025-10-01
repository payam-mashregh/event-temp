// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0D6EFD',
        'primary-hover': '#0B5ED7',
        'secondary': '#6C757D',
        'light': '#F8F9FA',
        'dark': '#212529',
        'white': '#FFFFFF',
        'success': '#198754',
        'danger': '#DC3545',
        'warning': '#FFC107',
        'info': '#0DCAF0',
      },
      fontFamily: {
        'sans': ['Vazirmatn', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};