'use client'

import { useState, useRef, useEffect } from 'react'
import { Palette } from 'lucide-react'
import { useTheme } from '@/themes/ThemeContext'

export default function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  return (
    <div
      ref={ref}
      style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 999 }}
    >
      {open && (
        <div style={{
          position: 'absolute', bottom: '3.5rem', right: 0,
          background: 'var(--theme-panel)',
          border: '1px solid var(--theme-border)',
          borderRadius: '14px',
          padding: '1.1rem',
          width: '290px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
          backdropFilter: 'blur(16px)',
        }}>
          <p style={{
            color: 'var(--theme-fg)',
            fontSize: '0.68rem',
            letterSpacing: '0.12em',
            fontFamily: 'var(--font-mono, monospace)',
            opacity: 0.5,
            marginBottom: '0.9rem',
            textTransform: 'uppercase',
          }}>
            Tema visual
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {themes.filter(t => !t.hidden).map(t => {
              const isActive = theme.id === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t.id); setOpen(false) }}
                  title={t.label}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.6rem 0.35rem',
                    borderRadius: '10px',
                    border: isActive
                      ? `2px solid ${t.vars['--theme-accent']}`
                      : '2px solid transparent',
                    background: isActive
                      ? 'rgba(255,255,255,0.06)'
                      : 'transparent',
                    cursor: 'pointer',
                    transition: 'border 0.15s, background 0.15s',
                  }}
                >
                  {/* Gradient preview swatch */}
                  <div style={{
                    width: '42px',
                    height: '28px',
                    borderRadius: '6px',
                    background: t.preview,
                    border: '1px solid rgba(255,255,255,0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {/* Accent dot indicator */}
                    <div style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: t.vars['--theme-accent'],
                      boxShadow: `0 0 6px ${t.vars['--theme-accent']}`,
                    }} />
                  </div>
                  <span style={{
                    fontSize: '0.6rem',
                    color: 'var(--theme-fg)',
                    opacity: isActive ? 1 : 0.6,
                    whiteSpace: 'nowrap',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'opacity 0.15s',
                  }}>
                    {t.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Cambiar tema"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'var(--theme-panel)',
          border: '1px solid var(--theme-border)',
          color: 'var(--theme-accent)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            `0 4px 20px rgba(0,0,0,0.5), 0 0 12px var(--theme-glow-1)`
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)'
        }}
      >
        <Palette size={18} />
      </button>
    </div>
  )
}
