import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Shadcn/Radix UI compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // Daikin Brand Colors (Primary)
        primary: {
          DEFAULT: '#2E9AD8',
          dark: '#246D9E',
          foreground: '#FFFFFF',
        },

        // Brand variants
        brand: {
          DEFAULT: '#2E9AD8',
          deep: '#1B4F72',
          light: '#6EC1FF',
        },

        // Secondary colors
        secondary: {
          DEFAULT: '#E6EEF7',
          foreground: '#231F20',
          hover: '#D1D9E6',
        },

        // Destructive/Error states
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },

        // Muted/subtle states
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: '#6B7B8A',
        },

        // Accent colors
        accent: {
          DEFAULT: '#2CA66A',
          light: '#6EC1FF',
          orange: '#E67E50',
          foreground: '#FFFFFF',
        },

        // Success/positive states
        success: {
          DEFAULT: '#2CA66A',
          foreground: '#FFFFFF',
        },

        // Popover/Dialog
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        // Card
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // CTA/Call-to-action
        cta: {
          DEFAULT: '#2B9EE0',
          hover: '#246D9E',
          active: '#1B5A7D',
        },

        // Hero section
        hero: '#1B4F72',

        // Backgrounds
        page: '#F7FAFC',

        // Comprehensive Daikin palette
        daikin: {
          blue: '#2E9AD8',
          deep: '#1B4F72',
          light: '#6EC1FF',
          raisin: '#231F20',
          orange: '#E67E50',
          green: '#2CA66A',
          gray: {
            50: '#F7FAFC',
            100: '#E6EEF7',
            200: '#D1D9E6',
            300: '#B0B8C5',
            400: '#8A93A1',
            500: '#6B7B8A',
            600: '#4A5568',
            700: '#2D3748',
            800: '#1A202C',
            900: '#231F20',
          },
        },

        // Chart colors
        chart: {
          baseline: '#2E9AD8',
          daikin: '#2CA66A',
          accent1: '#6EC1FF',
          accent2: '#E67E50',
          grid: '#E6EEF7',
          axis: '#6B7B8A',
        },
      },

      // Border radius tokens
      borderRadius: {
        lg: '0.75rem', // 12px
        md: '0.625rem', // 10px
        sm: '0.375rem', // 6px
        pill: '1.5rem', // 24px (updated for fuller pill shape)
        card: '0.625rem', // 10px
        circle: '50%',
      },

      // Font family
      fontFamily: {
        sans: [
          'var(--font-inter)',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
        mono: [
          'SF Mono',
          'Monaco',
          'Cascadia Code',
          'Roboto Mono',
          'Consolas',
          'Courier New',
          'monospace',
        ],
      },

      // Font sizes with line heights
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.4' }], // 12px
        sm: ['0.875rem', { lineHeight: '1.45' }], // 14px
        base: ['0.9375rem', { lineHeight: '1.45' }], // 15px
        md: ['1rem', { lineHeight: '1.45' }], // 16px
        lg: ['1.125rem', { lineHeight: '1.6' }], // 18px
        xl: ['1.375rem', { lineHeight: '1.3' }], // 22px
        '2xl': ['1.75rem', { lineHeight: '1.2' }], // 28px
        '3xl': ['2rem', { lineHeight: '1.2' }], // 32px
        '4xl': ['2.5rem', { lineHeight: '1.2' }], // 40px

        // Custom semantic sizes
        headline: ['1.75rem', { lineHeight: '1.2', fontWeight: '600' }], // 28px
        'headline-lg': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }], // 40px
        subheading: ['1.375rem', { lineHeight: '1.3', fontWeight: '600' }], // 22px
        body: ['0.9375rem', { lineHeight: '1.45' }], // 15px
        caption: ['0.75rem', { lineHeight: '1.4' }], // 12px
      },

      // Spacing scale (extends Tailwind's default)
      spacing: {
        '18': '4.5rem', // 72px
        '22': '5.5rem', // 88px
        '26': '6.5rem', // 104px
        '30': '7.5rem', // 120px
      },

      // Box shadows
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        soft: '0 2px 8px rgba(0, 0, 0, 0.08)',
        card: '0 6px 18px rgba(20, 40, 60, 0.06)',
        elevation1: '0 2px 4px rgba(20, 40, 60, 0.04)',
        elevation2: '0 4px 8px rgba(20, 40, 60, 0.06)',
        elevation3: '0 8px 16px rgba(20, 40, 60, 0.08)',
      },

      // Animation keyframes
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
      },

      // Animations
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-bottom': 'slide-in-from-bottom 0.3s ease-out',
      },

      // Transition durations
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
