import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        medspace: {
          50: '#eefbff',
          100: '#d8f4ff',
          200: '#b4e8ff',
          300: '#7fd4ff',
          400: '#4bb6ff',
          500: '#1e8bff',
          600: '#0d6fe8',
          700: '#0d57bd',
          800: '#124a9a',
          900: '#153f7e',
        },
        accent: {
          blue: '#0d6fe8',
          teal: '#3cc8b7',
          crimson: '#c84d62',
          gold: '#f3b65f',
        },
      },
      boxShadow: {
        soft: '0 20px 45px rgba(14, 49, 104, 0.14)',
      },
      fontFamily: {
        arabic: ['"Tajawal"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
