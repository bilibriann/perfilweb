'use client'

export default function RetrowaveBackground() {
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
            'linear-gradient(155deg, #080414 0%, #1a1a2e 45%, #0d0a1e 100%)',
        }}
      />

      {/* Magenta glow top */}
      <div
        style={{
          position: 'absolute',
          top: '-25%',
          left: '15%',
          width: '80vw',
          height: '70vw',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(232,20,200,0.28) 0%, rgba(180,0,180,0.12) 40%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'glow-breathe 8s ease-in-out infinite',
        }}
      />

      {/* Purple glow right */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '-15%',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(140,0,255,0.22) 0%, rgba(80,0,180,0.10) 40%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'glow-breathe-2 14s ease-in-out infinite 2s',
        }}
      />

      {/* Neon horizon line */}
      <div
        style={{
          position: 'absolute',
          bottom: '32%',
          left: 0,
          right: 0,
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,40,180,0.6) 20%, rgba(255,80,220,0.8) 50%, rgba(255,40,180,0.6) 80%, transparent 100%)',
          boxShadow:
            '0 0 20px rgba(255,40,180,0.5), 0 0 40px rgba(255,40,180,0.2)',
          animation: 'neon-pulse 4s ease-in-out infinite',
        }}
      />

      {/* Grid bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '32%',
          backgroundImage:
            'linear-gradient(rgba(180,0,255,0.04) 1px, transparent 1px)',
          backgroundSize: '100% 24px',
          animation: 'retro-grid-shift 4s linear infinite',
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </div>
  )
}
