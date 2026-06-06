'use client'

export default function SimpleBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'var(--theme-bg)',
      }}
      aria-hidden="true"
    />
  )
}
