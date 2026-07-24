export interface ThemeDefinition {
  id: string
  label: string
  type: 'premium' | 'simple'
  preview: string // CSS gradient para thumbnail en ThemeToggle
  vars: Record<string, string> // ALL CSS variables a aplicar en :root
  hidden?: boolean // si true, no se muestra en el selector (sigue existiendo)
}

export const THEMES: ThemeDefinition[] = [
  {
    id: 'main',
    label: 'Main',
    type: 'premium',
    hidden: true, // oculto por ahora — se desarrollará más adelante
    preview: 'linear-gradient(135deg, #2E2910 0%, #2C5745 40%, #EBE3A7 72%, #EB7D00 100%)',
    // Paleta base = sección Hero (café). Cada sección redefine sus variables
    // localmente en page.tsx (verde / vainilla / mandarina).
    vars: {
      '--theme-bg': '#2E2910',
      '--theme-surface': 'rgba(46,41,16,0.86)',
      '--theme-panel': 'rgba(58,52,26,0.85)',
      '--theme-panel-hover': 'rgba(69,62,33,0.90)',
      '--theme-bg-alt': 'rgba(33,29,11,0.90)',
      '--theme-border': 'rgba(235,227,167,0.18)',
      '--theme-border-hover': 'rgba(235,125,0,0.60)',
      '--theme-fg': '#EBE3A7',
      '--theme-fg-muted': 'rgba(235,227,167,0.72)',
      '--theme-fg-dim': 'rgba(235,227,167,0.45)',
      '--theme-accent': '#EB7D00',
      '--theme-accent-rgb': '235,125,0',
      '--theme-accent-on': '#2E2910',
      '--theme-glow-1': 'rgba(235,125,0,0.20)',
      '--theme-glow-2': 'rgba(44,87,69,0.15)',
      '--bg-effect-color': 'rgba(235,125,0,0.55)',
      '--bg-effect-intensity': '0.80',
    },
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    type: 'simple',
    preview: 'linear-gradient(135deg, #070b14 0%, #1a2a3a 50%, #070b14 100%)',
    vars: {
      '--theme-bg': '#070b14',
      '--theme-surface': 'rgba(7,11,20,0.80)',
      '--theme-panel': 'rgba(12,18,32,0.88)',
      '--theme-panel-hover': 'rgba(18,26,44,0.92)',
      '--theme-bg-alt': '#04070d',
      '--theme-border': 'rgba(26,42,58,0.7)',
      '--theme-border-hover': 'rgba(42,58,74,0.8)',
      '--theme-fg': '#f1f5f9',
      '--theme-fg-muted': '#94a3b8',
      '--theme-fg-dim': '#64748b',
      '--theme-accent': '#5b8cff',
      '--theme-accent-rgb': '91,140,255',
      '--theme-accent-on': '#0d1117',
      '--theme-glow-1': 'rgba(91,140,255,0.14)',
      '--theme-glow-2': 'rgba(56,80,180,0.10)',
    },
  },
]

export const DEFAULT_THEME_ID = 'portfolio'
