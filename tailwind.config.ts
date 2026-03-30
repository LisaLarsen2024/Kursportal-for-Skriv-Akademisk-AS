import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1140px' },
    },
    extend: {
      colors: {
        brand: {
          // Primary (teal → purple)
          teal: 'rgb(var(--c-primary) / <alpha-value>)',
          'teal-light': 'rgb(var(--c-primary) / 0.12)',
          'teal-pale': 'rgb(var(--c-surface-raised) / <alpha-value>)',
          // Accent (coral stays coral, new shade)
          coral: 'rgb(var(--c-accent) / <alpha-value>)',
          'coral-light': 'rgb(var(--c-accent) / 0.7)',
          // Backgrounds / surfaces
          cream: 'rgb(var(--c-bg) / <alpha-value>)',
          warm: 'rgb(var(--c-surface) / <alpha-value>)',
          // Text
          ink: 'rgb(var(--c-text) / <alpha-value>)',
          gray: 'rgb(var(--c-muted) / <alpha-value>)',
          // Utility
          green: 'rgb(var(--c-success) / <alpha-value>)',
          border: 'rgb(var(--c-border) / <alpha-value>)',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 40px rgba(0, 0, 0, 0.3)',
        card: '0 1px 3px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.25)',
        hover: '0 4px 20px rgba(0, 0, 0, 0.35)',
      },
      maxWidth: { content: '1140px' },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
