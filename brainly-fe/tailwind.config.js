
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', ...defaultTheme.fontFamily.sans] },
      colors: {
        primary: {
          50: '#F2EAFE',
          100: '#E5D4FD',
          200: '#C9A9FB',
          300: '#AE7EF8',
          400: '#9353F5',
          500: '#7A33F0',
          600: '#6429C6',
          700: '#4E209B',
          800: '#371771',
          900: '#210E46'
        }
      },
      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,0.06)'
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } }
      },
      animation: {
        fadeIn: 'fadeIn .15s ease-out',
        slideUp: 'slideUp .18s ease-out'
      }
    }
  },
  plugins: []
};
