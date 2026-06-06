import type { SectionColors, SyntaxColors, ThemeColors } from './types'

export function hexToHSL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [h * 360, s * 100, l * 100]
}

export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s)) / 100
  l = Math.max(0, Math.min(100, l)) / 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0')
  return '#' + toHex(f(0)) + toHex(f(8)) + toHex(f(4))
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null
}

// Exact port of Odysseus deriveSyntaxColors — colors.red → colors.accent
export function deriveSyntaxColors(colors: ThemeColors): SyntaxColors {
  const [fgH, fgS, fgL] = hexToHSL(colors.fg)
  const [bgH, bgS, bgL] = hexToHSL(colors.bg)
  const [redH, redS] = hexToHSL(colors.accent || '#e06c75')
  const isDark = bgL < 50
  const codeBgL = isDark ? Math.max(bgL - 4, 0) : Math.min(bgL + 4, 100)
  return {
    bg:       hslToHex(bgH, bgS, codeBgL),
    fg:       colors.fg,
    keyword:  hslToHex((redH + 280) % 360, Math.min(redS + 10, 80), isDark ? 70 : 45),
    string:   hslToHex(40,  Math.min(fgS + 20, 70), isDark ? 72 : 42),
    comment:  hslToHex(fgH, Math.max(fgS - 20, 5),  fgL * 0.5 + bgL * 0.5),
    function: hslToHex(210, Math.min(fgS + 20, 75), isDark ? 70 : 45),
    number:   hslToHex(20,  Math.min(fgS + 15, 65), isDark ? 68 : 48),
    builtin:  hslToHex(180, Math.min(fgS + 15, 60), isDark ? 65 : 40),
    variable: hslToHex((fgH + 30) % 360, Math.min(fgS + 5, 60), fgL),
    params:   hslToHex(fgH, Math.max(fgS - 5, 10), isDark ? Math.min(fgL + 8, 85) : Math.max(fgL - 8, 25)),
  }
}

export function deriveSectionColors(bg: string): SectionColors {
  const [h, s, l] = hexToHSL(bg)
  const isDark = l < 50
  const lShift = isDark ? 4 : -4
  const sBase = Math.max(s, 10)
  return {
    hero:       bg,
    about:      hslToHex(h + 15, sBase + 5,  l + lShift),
    stack:      hslToHex(h + 35, sBase + 8,  l + lShift * 0.9),
    projects:   hslToHex(h + 55, sBase + 6,  l + lShift * 1.1),
    experience: hslToHex(h + 75, sBase + 7,  l + lShift * 0.8),
    contact:    hslToHex(h + 95, sBase + 10, l + lShift * 1.2),
  }
}

export function resolveSection(
  sections: Partial<SectionColors> | undefined,
  bg: string,
): SectionColors {
  return { ...deriveSectionColors(bg), ...sections }
}

export function resolveCSSVar(value: string): string {
  if (typeof document === 'undefined') return value
  if (!value.startsWith('var(--')) return value
  const varName = value.slice(4, -1).trim()
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || value
}

// Perlin-flow noise (exact port from Odysseus _bgNoise2d / _bgSmoothNoise)
export function bgNoise2d(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return n - Math.floor(n)
}

export function bgSmoothNoise(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y)
  const fx = x - ix, fy = y - iy
  const a = bgNoise2d(ix, iy)
  const b = bgNoise2d(ix + 1, iy)
  const cc = bgNoise2d(ix, iy + 1)
  const d = bgNoise2d(ix + 1, iy + 1)
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  return a + (b - a) * ux + (cc - a) * uy + (a - b - cc + d) * ux * uy
}
