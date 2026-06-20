import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Syncopate', 'Space Grotesk', 'Syne', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#09090b',
          900: '#111113',
          800: '#1c1c21',
        },
        neon: {
          red: '#ff003c',
          silver: '#e5e7eb',
          blue: '#4cc9f0',
          purple: '#8b5cf6',
          green: '#22c55e',
        },
      },
      boxShadow: {
        glass: '0 24px 80px rgba(0, 0, 0, 0.45)',
        glowBlue: '0 0 24px rgba(76, 201, 240, 0.35)',
        glowPurple: '0 0 24px rgba(139, 92, 246, 0.28)',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(circle at top, rgba(255, 0, 60, 0.15), transparent 35%), radial-gradient(circle at 80% 20%, rgba(229, 231, 235, 0.08), transparent 28%), radial-gradient(circle at 50% 100%, rgba(255, 0, 60, 0.08), transparent 30%)',
        'glass-gradient':
          'linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))',
      },
    },
  },
  plugins: [],
} satisfies Config;