/** @type {import('tailwindcss').Config} */
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
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a5b8fd',
          400: '#8193fb',
          500: '#6370f6',
          600: '#4f50eb',
          700: '#4240d0',
          800: '#3637a8',
          900: '#313285',
          950: '#1e1d50',
        },
        accent: {
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
        dark: {
          900: '#0d0f1a',
          800: '#131525',
          700: '#1a1d30',
          600: '#22253d',
          500: '#2d3154',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1e1d50 0%, #131525 40%, #1a1040 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(99,112,246,0.08) 0%, rgba(244,63,94,0.05) 100%)',
        'glow-primary': 'radial-gradient(ellipse at center, rgba(99,112,246,0.3) 0%, transparent 70%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
      boxShadow: {
        'glow': '0 0 30px rgba(99,112,246,0.35)',
        'glow-sm': '0 0 15px rgba(99,112,246,0.25)',
        'card': '0 4px 24px rgba(0,0,0,0.35)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};
