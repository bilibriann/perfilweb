'use client'

export default function TerminalBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {/* Base */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #010401 0%, #020602 100%)',
        }}
      />

      {/* Phosphor center glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60vw',
          height: '60vh',
          background:
            'radial-gradient(circle, rgba(74,222,128,0.12) 0%, rgba(34,197,94,0.06) 40%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'glow-breathe 6s ease-in-out infinite',
        }}
      />

      {/* CRT scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
          pointerEvents: 'none',
          opacity: 0.7,
        }}
      />

      {/* Scan line animation */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '2px',
          background:
            'linear-gradient(90deg, transparent, rgba(74,222,128,0.4), transparent)',
          filter: 'blur(1px)',
          animation: 'scan-down 8s linear infinite 1s',
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
        }}
      />
    </div>
  )
}
