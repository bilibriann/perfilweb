import type { ThemePreset } from './types'

// bgPattern, effectColor, effectIntensity, frosted — exact values from Odysseus
// THEME_DEFAULT_PATTERN / THEME_DEFAULT_EFFECT_COLOR / THEME_DEFAULT_INTENSITY / THEME_DEFAULT_FROSTED

export const PRESETS: ThemePreset[] = [
  {
    id: 'portfolio',
    label: 'Portfolio',
    colors: { bg: '#070b14', fg: '#f1f5f9', panel: '#0c1220', border: '#1a2a3a', accent: '#00FFD4' },
    sections: {
      hero: '#07090f', about: '#0b1a2e', stack: '#0c2020',
      projects: '#101428', experience: '#071a12', contact: '#11101e',
    },
    bgPattern: 'none',
  },
  {
    id: 'dark',
    label: 'Dark',
    colors: { bg: '#282c34', fg: '#9cdef2', panel: '#111111', border: '#355a66', accent: '#e06c75' },
    bgPattern: 'none',
  },
  {
    id: 'light',
    label: 'Light',
    colors: { bg: '#f0ebe3', fg: '#5a5248', panel: '#faf6f0', border: '#d4cdc2', accent: '#c47d5a' },
    bgPattern: 'dots',
  },
  {
    id: 'midnight',
    label: 'Midnight',
    colors: { bg: '#0d1117', fg: '#c9d1d9', panel: '#161b22', border: '#30363d', accent: '#f85149' },
    sections: {
      hero: '#0d1117', about: '#0e1521', stack: '#0d1820',
      projects: '#0f1220', experience: '#0d1a16', contact: '#0e1019',
    },
    bgPattern: 'rain',
    effectColor: '#ffffff',
    effectIntensity: 0.5,
  },
  {
    id: 'paper',
    label: 'Paper',
    colors: { bg: '#faf8f5', fg: '#3b3836', panel: '#ffffff', border: '#d5d0c8', accent: '#c5ac4a' },
    bgPattern: 'dots',
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    colors: { bg: '#0a0a0f', fg: '#0ff0fc', panel: '#12101a', border: '#9b30ff', accent: '#e040fb' },
    bgPattern: 'synapse',
  },
  {
    id: 'forest',
    label: 'Forest',
    colors: { bg: '#1b2a1b', fg: '#a8d5a2', panel: '#142414', border: '#3d6b3d', accent: '#7cb871' },
    bgPattern: 'petals',
  },
  {
    id: 'ocean',
    label: 'Ocean',
    colors: { bg: '#0b1a2c', fg: '#64d2ff', panel: '#091422', border: '#1e5074', accent: '#4facfe' },
    bgPattern: 'constellations',
  },
  {
    id: 'ume',
    label: 'Ume',
    colors: { bg: '#2b1b2e', fg: '#f5c2e7', panel: '#1e1420', border: '#6c4675', accent: '#f5a0c0' },
    bgPattern: 'petals',
    effectColor: '#f5a0c0',
  },
  {
    id: 'copper',
    label: 'Copper',
    colors: { bg: '#1c1410', fg: '#e8c39e', panel: '#140f0a', border: '#7a5533', accent: '#d4764e' },
    bgPattern: 'none',
  },
  {
    id: 'terminal',
    label: 'Terminal',
    colors: { bg: '#000000', fg: '#00ff41', panel: '#0a0a0a', border: '#003b00', accent: '#00ff41' },
    bgPattern: 'perlin-flow',
    effectIntensity: 0.8,
  },
  {
    id: 'lavender',
    label: 'Lavender',
    colors: { bg: '#f3eef8', fg: '#3d3551', panel: '#faf7ff', border: '#cec3de', accent: '#9b6dcc' },
    bgPattern: 'none',
    frosted: true,
  },
  {
    id: 'claude',
    label: 'Claude',
    colors: { bg: '#262624', fg: '#f5f4f0', panel: '#30302e', border: '#4a4a47', accent: '#c6613f' },
    bgPattern: 'none',
  },
  {
    id: 'cute',
    label: 'Cute',
    colors: { bg: '#fff0f5', fg: '#d4608a', panel: '#fff8fa', border: '#f0c0d0', accent: '#ff6b9d' },
    bgPattern: 'sparkles',
    effectColor: '#ff8cb8',
  },
]

export const DEFAULT_PRESET_ID = 'midnight'
