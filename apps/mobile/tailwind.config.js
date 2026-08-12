/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset'), require('../../packages/config/tailwind-preset')],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};
