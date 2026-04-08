/** @type {import('tailwindcss').Config} */
const { colors } = require('./src/constants/theme');

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Brand
        primary:          colors.primary,
        'primary-dark':   colors.primaryDark,
        'primary-light':  colors.primaryLight,
        // Semantic
        success:          colors.success,
        warning:          colors.warning,
        danger:           colors.danger,
        'danger-light':   colors.dangerLight,
        online:           colors.success,
      },
      fontSize: {
        '2xs': '10px',
      },
      height: {
        '13': '52px',
      },
    },
  },
  plugins: [],
}
