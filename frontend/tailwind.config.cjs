module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f4c81',
          50: '#eaf3ff',
          100: '#d6e9ff',
          200: '#b6daff',
          300: '#89c1ff',
          400: '#57a6ff',
          500: '#2f8bff',
          600: '#1163d1',
          700: '#0d4d9e',
          800: '#083569',
          900: '#04213b'
        },
        accent: '#06b6d4',
        surface: '#ffffff',
        subtle: '#6b7280'
      },
      boxShadow: {
        'soft-lg': '0 10px 30px rgba(2,6,23,0.08)',
        'card': '0 8px 24px rgba(15,76,129,0.06)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};