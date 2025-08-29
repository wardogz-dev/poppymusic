/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#0B0B0B',
        secondary: '#121212',
        accent: '#E7C873',
        'text-secondary': '#D1D5DB',
        'text-primary': '#F3F4F6',
      },
      fontFamily: {
        'fraunces': ['Fraunces', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
