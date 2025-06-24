import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Enhanced breakpoints for better device targeting
    screens: {
      'xs': '375px',      // Small phones
      'sm': '640px',      // Large phones / small tablets
      'md': '768px',      // Tablets
      'lg': '1024px',     // Small laptops
      'xl': '1280px',     // Large laptops / desktops
      '2xl': '1536px',    // Large desktops
      '3xl': '1920px',    // Ultra-wide screens
      '4xl': '2560px',    // 4K displays
      // Device-specific breakpoints
      'mobile': {'max': '767px'},
      'tablet': {'min': '768px', 'max': '1023px'},
      'desktop': {'min': '1024px'},
      'ultrawide': {'min': '1920px'},
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      borderColor: {
        DEFAULT: "hsl(var(--border))",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Enhanced spacing for better device control
      spacing: {
        '1': '0.25rem', // 4px
        '2': '0.5rem',  // 8px
        '3': '0.75rem', // 12px
        '4': '1rem',    // 16px
        '5': '1.25rem', // 20px
        '6': '1.5rem',  // 24px
        '8': '2rem',    // 32px
        '10': '2.5rem', // 40px
        '12': '3rem',   // 48px
        '16': '4rem',   // 64px
        '20': '5rem',   // 80px
        '24': '6rem',   // 96px
        '32': '8rem',   // 128px
        '18': '4.5rem',
        '88': '22rem',
        '144': '36rem',
      },
      // Device-specific font sizes
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25rem' }],
        'sm': ['0.875rem', { lineHeight: '1.5rem' }],
        'base': ['1rem', { lineHeight: '1.75rem' }],
        'lg': ['1.125rem', { lineHeight: '2rem' }],
        'xl': ['1.25rem', { lineHeight: '2.25rem' }],
        '2xl': ['1.5rem', { lineHeight: '2.5rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.75rem' }],
        '4xl': ['2.25rem', { lineHeight: '3rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        'xs-mobile': ['0.75rem', { lineHeight: '1rem' }],
        'sm-mobile': ['0.875rem', { lineHeight: '1.25rem' }],
        'base-mobile': ['1rem', { lineHeight: '1.5rem' }],
        'lg-mobile': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl-mobile': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl-mobile': ['1.5rem', { lineHeight: '2rem' }],
        '3xl-mobile': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl-mobile': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl-mobile': ['3rem', { lineHeight: '1' }],
        '6xl-mobile': ['3.75rem', { lineHeight: '1' }],
        '7xl-mobile': ['4.5rem', { lineHeight: '1' }],
        '8xl-mobile': ['6rem', { lineHeight: '1' }],
        '9xl-mobile': ['8rem', { lineHeight: '1' }],
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'appear': 'appear 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'appear-zoom': 'appearZoom 1s cubic-bezier(0.16, 1, 0.3, 1)',
        'glow': 'glow 2s ease-in-out infinite alternate',
        // Device-specific animations
        'mobile-bounce': 'bounce 2s infinite',
        'tablet-fade': 'fadeIn 0.8s ease-in-out',
        'desktop-slide': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.3' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        appear: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        appearZoom: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(220, 38, 38, 0.3)' },
          '100%': { boxShadow: '0 0 15px rgba(220, 38, 38, 0.7)' },
        }
      },
      // Animation delay utilities
      transitionDelay: {
        '1000': '1000ms',
        '2000': '2000ms',
        '3000': '3000ms',
        '4000': '4000ms',
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      const animationDelays = {
        '.animation-delay-200': { animationDelay: '0.2s' },
        '.animation-delay-300': { animationDelay: '0.3s' },
        '.animation-delay-400': { animationDelay: '0.4s' },
        '.animation-delay-500': { animationDelay: '0.5s' },
        '.animation-delay-700': { animationDelay: '0.7s' },
        '.animation-delay-1000': { animationDelay: '1s' },
        '.animation-delay-2000': { animationDelay: '2s' },
        '.animation-delay-3000': { animationDelay: '3s' },
        '.animation-delay-4000': { animationDelay: '4s' },
      }
      addUtilities(animationDelays)
    }),
    plugin(({ matchUtilities, theme, addUtilities }) => {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      );
      
      // Custom text shadow utilities
      const textShadowUtilities = {
        '.text-shadow-red': {
          textShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
        },
        '.text-shadow-white': {
          textShadow: '0 0 8px rgba(255, 255, 255, 0.6)'
        },
      };
      
      addUtilities(textShadowUtilities);
    }),
    // Device-specific utilities plugin
    plugin(({ addUtilities }) => {
      const deviceUtilities = {
        // Mobile-specific utilities
        '.mobile-only': {
          '@media (min-width: 768px)': {
            display: 'none !important',
          },
        },
        '.mobile-hidden': {
          '@media (max-width: 767px)': {
            display: 'none !important',
          },
        },
        // Tablet-specific utilities
        '.tablet-only': {
          '@media (max-width: 767px), (min-width: 1024px)': {
            display: 'none !important',
          },
        },
        '.tablet-hidden': {
          '@media (min-width: 768px) and (max-width: 1023px)': {
            display: 'none !important',
          },
        },
        // Desktop-specific utilities
        '.desktop-only': {
          '@media (max-width: 1023px)': {
            display: 'none !important',
          },
        },
        '.desktop-hidden': {
          '@media (min-width: 1024px)': {
            display: 'none !important',
          },
        },
        // Touch device optimizations
        '.touch-friendly': {
          minHeight: '44px',
          minWidth: '44px',
          padding: '12px',
        },
        // High DPI display optimizations
        '.retina-ready': {
          '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)': {
            transform: 'scale(0.5)',
            transformOrigin: 'top left',
          },
        },
      };
      
      addUtilities(deviceUtilities);
    }),
  ],
};

export default config; 