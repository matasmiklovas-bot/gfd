import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ink: '#0A0A0A',
      white: '#FFFFFF',
      bone: '#F4F2EE',
      // Brand accent. 3.4:1 on white — borders, disabled states and large text only.
      concrete: '#8A8A8A',
      // Secondary text. 6.5:1 on white, 5.8:1 on bone — passes WCAG AA at body sizes.
      muted: '#5E5E5E',
      line: '#E2E0DB',
      danger: '#9B1C1C',
    },
    borderRadius: { none: '0', DEFAULT: '2px', full: '9999px' },
    boxShadow: { none: 'none' },
    fontFamily: {
      display: ['"Archivo Variable"', 'Arial Narrow', 'Arial', 'sans-serif'],
      sans: ['"Inter Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
    },
    extend: {
      fontSize: {
        label: ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.14em' }],
        display: ['clamp(3rem, 13vw, 8.75rem)', { lineHeight: '0.86', letterSpacing: '-0.035em' }],
        h1: ['clamp(2.25rem, 6vw, 4.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        h2: ['clamp(1.75rem, 4vw, 3rem)', { lineHeight: '1', letterSpacing: '-0.025em' }],
        h3: ['1.125rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      spacing: { gutter: '1rem', 'gutter-lg': '2rem', header: '3.5rem' },
      maxWidth: { site: '96rem', prose: '42rem' },
      transitionTimingFunction: { out: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      zIndex: { header: '40', drawer: '60', overlay: '50', banner: '70' },
    },
  },
  plugins: [],
};

export default config;
