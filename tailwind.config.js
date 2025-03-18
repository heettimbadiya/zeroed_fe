/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: "#2557a7",
        grayLight: "#f3f2f1",
        "primary": "#00c5ff",
        "primary-100": "#E6F5F9",
        "black": "#000000",
        "white": "#FFFFFF",
        "text-gray-400": "#9CA3AF",
        "text-gray-500": "#6B7280",
        "bg-text-in": "#E8F0FE",
        "text-border": "#D1D5DB",
      },
      backgroundImage: {  
        'profileTheme': "url('/src/assets/profile-theme.svg')",
      }
    },
  },
  plugins: [],
}