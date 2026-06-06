import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/themes/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      // Dynamic theme colors via CSS variables
      colors: {
        theme: {
          bg:            'var(--theme-bg)',
          'bg-alt':      'var(--theme-bg-alt)',
          surface:       'var(--theme-surface)',
          panel:         'var(--theme-panel)',
          'panel-hover': 'var(--theme-panel-hover)',
          border:        'var(--theme-border)',
          'border-hover':'var(--theme-border-hover)',
          fg:            'var(--theme-fg)',
          'fg-muted':    'var(--theme-fg-muted)',
          'fg-dim':      'var(--theme-fg-dim)',
          accent:        'var(--theme-accent)',
          'accent-on':   'var(--theme-accent-on)',
        },
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
