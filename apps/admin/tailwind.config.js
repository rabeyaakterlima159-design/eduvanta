/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        eduvanta: {
          navy: '#102A56',
          royal: '#2563EB',
          electric: '#3B82F6',
          gold: '#F5B82E',
          bg: '#0F172A',
          darkSurface: '#1E293B',
          card: '#162235',
          text: '#F8FAFC',
        },
      },
    },
  },
  plugins: [],
};
