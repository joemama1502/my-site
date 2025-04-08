/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ This line lets YOU control dark mode manually
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        '0.5': '0.5px',
      },
    },
  },
  plugins: [],
}
