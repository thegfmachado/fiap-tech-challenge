/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#664373',
        'primary-light': '#AA8BB5',
        'primary-foreground': '#fafafa',
        secondary: '#E1E1E1',
        'secondary-foreground': '#664373',
        destructive: '#e7000b',
        'debit-color': '#9F523B',
        'credit-color': '#3B9F4A'
      },
      fontFamily: {
        'mono': ['GeistMono'],
        'sans': ['Geist'],
      },
    },
  },
  plugins: [],
};
