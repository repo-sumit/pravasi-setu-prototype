/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'Google Sans', 'Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0F766E',
          dark: '#0B5E57',
          light: '#E6F4F2',
          50: '#F2F9F8',
        },
        accent: {
          DEFAULT: '#F97316',
          light: '#FFF1E6',
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#F5F7FA',
          chat: '#F0F8F7',
        },
        txt: {
          primary: '#0E1A2B',
          secondary: '#56708F',
          tertiary: '#A8B4C5',
        },
        bdr: {
          DEFAULT: '#E5EBF2',
          light: '#F0F4FA',
        },
        ok: { DEFAULT: '#16A34A', light: '#E7F6EC' },
        warn: { DEFAULT: '#F59E0B', light: '#FEF4DC' },
        danger: { DEFAULT: '#DC2626', light: '#FEECEC' },
        info: { DEFAULT: '#2563EB', light: '#E5EEFE' },
      },
      borderRadius: {
        pill: '50px',
        card: '16px',
        xl: '12px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.08)',
        modal: '0 4px 14px rgba(0,0,0,0.12)',
        bottom: '0 -2px 8px rgba(0,0,0,0.06)',
      },
      animation: {
        'slide-in': 'slideIn 0.26s cubic-bezier(0.4,0,0.2,1)',
        'fade-in': 'fadeIn 0.18s ease',
        'bubble-in': 'bubbleIn 0.18s ease',
        pop: 'pop 0.4s cubic-bezier(0.16,1,0.3,1)',
        typing: 'typing 0.9s infinite',
      },
      keyframes: {
        slideIn: { from: { transform: 'translateX(100%)', opacity: '0' }, to: { transform: 'none', opacity: '1' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        bubbleIn: { from: { opacity: '0', transform: 'translateY(7px)' }, to: { opacity: '1', transform: 'none' } },
        pop: { from: { transform: 'scale(0)' }, to: { transform: 'scale(1)' } },
        typing: {
          '0%,60%,100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-5px)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
