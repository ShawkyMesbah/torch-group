import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Simplified, semantic breakpoints
    screens: {
      'sm': '640px',      // Large phones
      'md': '768px',      // Tablets
      'lg': '1024px',     // Desktop
      'xl': '1280px',     // Wide screens
      '2xl': '1536px',    // Ultra-wide
      // Semantic device targeting
      'mobile': {'max': '767px'},
      'tablet': {'min': '768px', 'max': '1023px'},
      'desktop': {'min': '1024px'},
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
      // Enhanced semantic spacing (8px base unit) - aligned with CSS custom properties
      spacing: {
        'xxs': '0.125rem',       // 2px - Micro adjustments
        'xs': '0.25rem',         // 4px - Element borders
        'sm': '0.5rem',          // 8px - Small gaps
        'md': '0.75rem',         // 12px - Form elements
        'lg': '1rem',            // 16px - Standard spacing
        'xl': '1.5rem',          // 24px - Section elements
        '2xl': '2rem',           // 32px - Component separation
        '3xl': '3rem',           // 48px - Major sections
        '4xl': '4rem',           // 64px - Hero sections
        '5xl': '6rem',           // 96px - Page divisions
        '6xl': '8rem',           // 128px - Monumental spacing
        // Legacy support
        'tight': '0.25rem',
        'compact': '0.5rem',
        'cozy': '0.75rem',
        'comfortable': '1rem',
        'spacious': '1.5rem',
        'generous': '2rem',
        'expansive': '3rem',
        'grand': '4rem',
        'monumental': '6rem',
        '18': '4.5rem',
        '88': '22rem',
        '144': '36rem',
      },
      // Optimized font sizes with proper line heights
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25rem' }],
        'sm': ['0.875rem', { lineHeight: '1.5rem' }],
        'base': ['1rem', { lineHeight: '1.75rem' }],
        'lg': ['1.125rem', { lineHeight: '2rem' }],
        'xl': ['1.25rem', { lineHeight: '2.25rem' }],
        '2xl': ['1.5rem', { lineHeight: '2.5rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.75rem' }],
        '4xl': ['2.25rem', { lineHeight: '3rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1.1' }],
        '9xl': ['8rem', { lineHeight: '1.1' }],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
    // Essential device utilities plugin
    plugin(({ addUtilities }) => {
      const deviceUtilities = {
        // Essential responsive utilities
        '.mobile-only': {
          '@media (min-width: 768px)': {
            display: 'none !important',
          },
        },
        '.desktop-only': {
          '@media (max-width: 1023px)': {
            display: 'none !important',
          },
        },
        // Touch-friendly interactions
        '.touch-friendly': {
          minHeight: '44px',
          minWidth: '44px',
          padding: '12px',
        },
      };
      
      addUtilities(deviceUtilities);
    }),
  ],
};

export default config; 