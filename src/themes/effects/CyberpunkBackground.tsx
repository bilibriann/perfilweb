'use client'

export default function CyberpunkBackground() {
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
            'linear-gradient(160deg, #020208 0%, #04040a 50%, #050210 100%)',
        }}
      />

      {/* Cyan glow right */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-20%',
          width: '65vw',
          height: '65vw',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(34,211,238,0.22) 0%, rgba(0,190,255,0.10) 40%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'glow-breathe 5s ease-in-out infinite',
        }}
      />

      {/* Magenta glow left */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '-20%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(232,56,253,0.18) 0%, rgba(180,0,255,0.08) 40%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'glow-breathe-2 7s ease-in-out infinite 1s',
        }}
      />

      {/* Scan line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '1px',
          background: 'rgba(34,211,238,0.6)',
          filter: 'blur(1px)',
          animation: 'scan-down 10s linear infinite',
        }}
      />

      {/* Grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
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
