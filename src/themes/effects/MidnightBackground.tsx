'use client'

export default function MidnightBackground() {
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
      {/* Base gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, #060c17 0%, #0b0f18 45%, #080d14 100%)',
        }}
      />

      {/* Glow azul top-left */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-15%',
          width: '70vw',
          height: '70vw',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(56,100,255,0.22) 0%, rgba(30,60,200,0.10) 45%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'glow-breathe 12s ease-in-out infinite',
        }}
      />

      {/* Glow indigo bottom-right */}
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '55vw',
          height: '55vw',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(60,70,200,0.08) 45%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'glow-breathe-2 18s ease-in-out infinite 3s',
        }}
      />

      {/* Nebula center-top */}
      <div
        style={{
          position: 'absolute',
          top: '2%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80vw',
          height: '35vh',
          background:
            'radial-gradient(ellipse, rgba(80,130,255,0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'glow-breathe-2 25s ease-in-out infinite 6s',
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </div>
  )
}
