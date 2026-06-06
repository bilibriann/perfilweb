export interface ThemeColors {
  bg: string
  fg: string
  panel: string
  border: string
  accent: string  // 'red' in Odysseus
}

export interface SectionColors {
  hero: string
  about: string
  stack: string
  projects: string
  experience: string
  contact: string
}

export type BgPattern =
  | 'none'
  | 'dots'
  | 'synapse'
  | 'rain'
  | 'constellations'
  | 'perlin-flow'
  | 'petals'
  | 'sparkles'
  | 'embers'

export interface ThemePreset {
  id: string
  label: string
  colors: ThemeColors
  sections?: Partial<SectionColors>
  bgPattern?: BgPattern
  effectColor?: string       // overrides --bg-effect-color; empty = use --fg
  effectIntensity?: number   // 0..1, default 1  (THEME_DEFAULT_INTENSITY)
  effectSize?: number        // 0.2..3, default 1
  frosted?: boolean
}

export interface SyntaxColors {
  bg: string
  fg: string
  keyword: string
  string: string
  comment: string
  function: string
  number: string
  builtin: string
  variable: string
  params: string
}
