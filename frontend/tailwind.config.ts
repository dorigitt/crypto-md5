import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Base — slightly lifted, less inky
        bg: {
          DEFAULT: '#0f1117',
          soft: '#151824',
          panel: '#1a1d2a',
          raised: '#1f2230',
        },
        border: {
          DEFAULT: '#2a2e3e80',
          strong: '#343849',
        },
        // Buffer palette — softer, less saturated
        buffer: {
          a: '#7dd3fc', // sky
          b: '#c4b5fd', // violet
          c: '#fcd34d', // amber
          d: '#86efac', // green
        },
        round: {
          0: '#7dd3fc',
          1: '#c4b5fd',
          2: '#fcd34d',
          3: '#86efac',
        },
        accent: {
          cyan: '#7dd3fc',
          magenta: '#c4b5fd',
          amber: '#fcd34d',
          emerald: '#86efac',
        },
        fg: {
          DEFAULT: '#d4d7de',
          muted: '#9ea3b0',
          subtle: '#6b7280',
        },
      },
      boxShadow: {
        glow: '0 0 16px -6px rgba(125, 211, 252, 0.25)',
        'glow-magenta': '0 0 16px -6px rgba(196, 181, 253, 0.25)',
        panel: '0 1px 0 0 rgba(255,255,255,0.02) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'fade-in': 'fade-in 200ms ease-out',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
