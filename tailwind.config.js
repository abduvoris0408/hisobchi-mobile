/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          900: '#1E3A8A',
        },
        income: '#10B981',
        expense: '#EF4444',
        warning: '#F59E0B',
        surface: {
          light: '#FFFFFF',
          dark:  '#111827',
        },
        bg: {
          light: '#F8FAFC',
          dark:  '#0A0F1E',
        },
        card: {
          light: '#FFFFFF',
          dark:  '#1E2535',
        }
      }
    }
  },
  plugins: []
};
