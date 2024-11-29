/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#3b82f6',
        },
        secondary: '#64748b',
        accent: {
          DEFAULT: '#0ea5e9',
          dark: '#38bdf8',
        },
        success: {
          DEFAULT: '#059669',
          dark: '#10b981',
        },
        danger: {
          DEFAULT: '#dc2626',
          dark: '#ef4444',
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f8fafc',
        },
        'surface-dark': {
          DEFAULT: '#111827',
          secondary: '#1f2937',
          tertiary: '#374151',
        },
        text: {
          primary: '#1e293b',
          secondary: '#475569',
        },
        'text-dark': {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          tertiary: '#64748b',
        },
        border: {
          DEFAULT: '#e2e8f0',
          dark: '#374151',
        },
        hover: {
          DEFAULT: '#f1f5f9',
          dark: '#374151',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
        'card-dark': '0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.3)',
      }
    },
  },
  plugins: [],
};