'use client'

export default function OceanBackground() {
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
            'linear-gradient(170deg, #010508 0%, #020d1a 50%, #010508 100%)',
        }}
      />

      {/* Teal center glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80vw',
          height: '60vh',
          background:
            'radial-gradient(ellipse, rgba(56,189,248,0.18) 0%, rgba(14,165,233,0.08) 45%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'ocean-wave 12s ease-in-out infinite',
        }}
      />

      {/* Deep blue edges */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-20%',
          width: '80vw',
          height: '80vw',
          background:
            'radial-gradient(circle, rgba(7,89,133,0.20) 0%, transparent 60%)',
          filter: 'blur(80px)',
          animation: 'glow-breathe-2 15s ease-in-out infinite 4s',
        }}
      />

      {/* Bottom glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          height: '40vh',
          background:
            'radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'glow-breathe 18s ease-in-out infinite 2s',
        }}
      />

      {/* Shimmer overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'conic-gradient(from 0deg, transparent, rgba(56,189,248,0.02), transparent)',
          transformOrigin: 'center',
          animation: 'shimmer-rotate 30s linear infinite',
          opacity: 0.5,
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  )
}
