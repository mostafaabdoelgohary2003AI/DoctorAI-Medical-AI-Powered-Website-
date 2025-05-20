/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#cce1ff',
          200: '#99c3ff',
          300: '#66a5ff',
          400: '#3387ff',
          500: '#0D6EFD', // Primary blue
          600: '#0a58ca',
          700: '#084298',
          800: '#052c65',
          900: '#031633',
        },
        secondary: {
          50: '#e9fcf7',
          100: '#d3f9ef',
          200: '#a7f3df',
          300: '#7beccf',
          400: '#4fe6bf',
          500: '#20C997', // Secondary teal
          600: '#1aa179',
          700: '#13795a',
          800: '#0d503c',
          900: '#06281e',
        },
        accent: {
          50: '#fff9e6',
          100: '#fff3cc',
          200: '#ffe799',
          300: '#ffdb66',
          400: '#ffcf33',
          500: '#FFC107', // Warning amber
          600: '#cc9a06',
          700: '#997404',
          800: '#664d03',
          900: '#332701',
        },
        success: {
          50: '#eaf9ed',
          100: '#d5f3db',
          200: '#aae7b7',
          300: '#80db94',
          400: '#55cf70',
          500: '#198754', // Success green
          600: '#146c43',
          700: '#0f5132',
          800: '#0a3622',
          900: '#051b11',
        },
        warning: {
          50: '#fff8e6',
          100: '#fff1cc',
          200: '#ffe399',
          300: '#ffd466',
          400: '#ffc633',
          500: '#fd7e14', // Warning orange
          600: '#ca6510',
          700: '#984c0c',
          800: '#653208',
          900: '#331904',
        },
        error: {
          50: '#fbecec',
          100: '#f8d9d9',
          200: '#f0b3b3',
          300: '#e98e8e',
          400: '#e16868',
          500: '#DC3545', // Danger red
          600: '#b02a37',
          700: '#842029',
          800: '#58151c',
          900: '#2c0b0e',
        },
        neutral: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#0a0a0a',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};