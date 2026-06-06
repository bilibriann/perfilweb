'use client'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { THEMES, DEFAULT_THEME_ID, type ThemeDefinition } from './themes'

interface ThemeContextValue {
  theme: ThemeDefinition
  setTheme: (id: string) => void
  themes: ThemeDefinition[]
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const LS_KEY = 'perfilweb-theme-v2'

function applyTheme(theme: ThemeDefinition) {
  const root = document.documentElement

  // Apply all CSS variables to :root
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value)
  }

  // Apply background and foreground to body
  document.body.style.backgroundColor = theme.vars['--theme-bg']
  document.body.style.color = theme.vars['--theme-fg']
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const defaultTheme = THEMES.find((t) => t.id === DEFAULT_THEME_ID)!
  const [theme, setThemeState] = useState<ThemeDefinition>(defaultTheme)

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    const resolved = THEMES.find((t) => t.id === saved) ?? defaultTheme
    setThemeState(resolved)
    applyTheme(resolved)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setTheme = useCallback(
    (id: string) => {
      const resolved = THEMES.find((t) => t.id === id) ?? defaultTheme
      setThemeState(resolved)
      applyTheme(resolved)
      localStorage.setItem(LS_KEY, id)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
