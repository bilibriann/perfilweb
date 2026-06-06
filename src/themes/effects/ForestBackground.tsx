'use client'

export default function ForestBackground() {
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
            'linear-gradient(170deg, #010401 0%, #020a02 50%, #010301 100%)',
        }}
      />

      {/* Emerald canopy top */}
      <div
        style={{
          position: 'absolute',
          top: '-25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          height: '70vw',
          background:
            'radial-gradient(ellipse, rgba(52,211,153,0.18) 0%, rgba(16,185,129,0.08) 40%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'glow-breathe 10s ease-in-out infinite',
        }}
      />

      {/* Ground mist */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: 0,
          right: 0,
          height: '45%',
          background:
            'linear-gradient(0deg, rgba(5,46,22,0.35) 0%, transparent 100%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Particle 1 */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '200px',
          height: '200px',
          background:
            'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)',
          filter: 'blur(30px)',
          animation: 'float-up-1 8s ease-in-out infinite',
        }}
      />

      {/* Particle 2 */}
      <div
        style={{
          position: 'absolute',
          top: '55%',
          right: '20%',
          width: '150px',
          height: '150px',
          background:
            'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
          filter: 'blur(25px)',
          animation: 'float-up-2 11s ease-in-out infinite 3s',
        }}
      />

      {/* Particle 3 */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '60%',
          width: '180px',
          height: '180px',
          background:
            'radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)',
          filter: 'blur(28px)',
          animation: 'float-up-1 14s ease-in-out infinite 6s',
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  )
}
