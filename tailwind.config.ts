import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#1B4D5C',
          coral: '#E07A5F',
          cream: '#FAF7F2',
          ink: '#173039'
        }
      },
      fontFamily: {
        heading: ['Fraunces', 'serif'],
        body: ['DM Sans', 'sans-serif']
      },
      boxShadow: {
        soft: '0 12px 40px rgba(27, 77, 92, 0.12)'
      }
    }
  },
  plugins: []
};

export default config;
