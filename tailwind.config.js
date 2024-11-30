/** @type {import('tailwindcss').Config} */
import { themePlugin } from './src/theme/plugin';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#60a5fa', // Lighter in dark mode for better contrast
        },
        secondary: {
          DEFAULT: '#64748b',
          dark: '#94a3b8', // Lighter in dark mode
        },
        accent: {
          DEFAULT: '#0ea5e9',
          dark: '#38bdf8',
        },
        success: {
          DEFAULT: '#059669',
          dark: '#34d399', // Increased brightness for dark mode
        },
        danger: {
          DEFAULT: '#dc2626',
          dark: '#f87171', // Lighter red for dark mode
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
          elevated: '#ffffff', // For elevated surfaces
        },
        'surface-dark': {
          DEFAULT: '#111827',
          secondary: '#1f2937',
          tertiary: '#374151',
          elevated: '#242b38', // For elevated surfaces in dark mode
        },
        // Content-aware surface colors
        'content-surface': {
          text: '#ffffff',      // Pure white for text content
          code: '#f8fafc',      // Slightly off-white for code
          image: '#f1f5f9',     // Light gray for image backgrounds
          card: '#ffffff',      // White for cards
          input: '#ffffff',     // White for input fields
          table: '#f8fafc',     // Slightly off-white for tables
        },
        'content-surface-dark': {
          text: '#1f2937',      // Dark blue-gray for text content
          code: '#1e293b',      // Slightly lighter for code readability
          image: '#111827',     // Darker for images
          card: '#1f2937',      // Slightly lighter for cards
          input: '#374151',     // Lighter for input fields
          table: '#1e293b',     // For table backgrounds
        },
        text: {
          primary: '#1e293b',
          secondary: '#475569',
          tertiary: '#64748b',
          muted: 'rgba(30, 41, 59, 0.7)', // For less important text
          // Content-specific text colors
          'on-code': '#1e293b',
          'on-image': '#0f172a',
          'on-card': '#1e293b',
        },
        'text-dark': {
          primary: '#f1f5f9',
          secondary: '#cbd5e1',
          tertiary: '#94a3b8',
          muted: 'rgba(241, 245, 249, 0.7)', // For less important text
          // Content-specific dark text colors
          'on-code': '#e2e8f0',
          'on-image': '#f1f5f9',
          'on-card': '#f1f5f9',
        },
        border: {
          DEFAULT: '#e2e8f0',
          dark: '#374151',
        },
        hover: {
          DEFAULT: '#f1f5f9',
          dark: '#374151',
        },
        focus: {
          light: 'rgba(37, 99, 235, 0.5)',
          dark: 'rgba(96, 165, 250, 0.5)',
        },
        shadow: {
          light: 'rgba(0, 0, 0, 0.1)',
          dark: 'rgba(0, 0, 0, 0.5)',
        },
        menu: {
          dark: '#1a1a1a',
          hover: {
            dark: 'rgba(31, 41, 55, 0.8)'
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
        card: '0 2px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
        'card-dark': '0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.3)',
        'menu-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.24)'
      },
      // Add backdrop blur variations
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    themePlugin,
  ],
}