'use client'

import { useRef, useEffect } from 'react'

/**
 * Campo de estrellas con profundidad y avance lentísimo hacia adelante: la
 * página parece derivar despacio hacia el centro del espacio.
 *
 * Modelo: cada estrella tiene una posición (x,y) en un plano virtual y una
 * profundidad z. Se proyecta en pantalla como `centro + (x,y)·escala / z`, así
 * que al disminuir z la estrella se ALEJA del centro en línea recta siguiendo su
 * radio, crece y se aclara. La velocidad en píxeles ∝ 1/z²: casi imperceptible
 * cerca del centro y mayor en los bordes → sensación de profundidad. Al salir de
 * pantalla (o al llegar a z mínimo) reaparece cerca del centro con posición y
 * profundidad nuevas, de modo que el campo nunca se vacía ni se nota un patrón.
 *
 * Puntos redondos, sin estelas. Tres planos (lejano/medio/cercano) que difieren
 * en velocidad, tamaño y brillo. Con prefers-reduced-motion el campo es estático.
 */

// Paleta fría inspirada en space.png: mayoría de blancos y azules,
// con algún destello cálido puntual para dar naturalidad.
const STAR_COLORS = [
  '255,255,255', // blanco puro
  '235,242,255', // blanco azulado
  '210,226,255', // azul frío
  '183,206,255', // azul
  '255,246,224', // cálido tenue (poco frecuente)
] as const

// Tres planos de profundidad. `speed` = z-unidades por segundo (cuanto menor es
// z, más "cerca" está la estrella y más rápido se abre hacia los bordes).
// El plano lejano es lento/pequeño/tenue; el cercano rápido/grande/claro.
const PLANES = [
  { count: 460, speed: 0.0018, size: 0.32, bright: 0.5 }, // lejano: apenas se mueve
  { count: 190, speed: 0.0042, size: 0.55, bright: 0.75 }, // medio: el grueso del campo
  { count: 34, speed: 0.0085, size: 1.05, bright: 1.0 }, // cercano: se abre y sale
] as const

// z de reaparición (lejos = 1) y z mínimo antes de reciclar (cerca de la cámara).
const Z_FAR = 1
const Z_MIN = 0.05

interface Star {
  x: number // posición en el plano virtual
  y: number
  z: number // profundidad: Z_FAR (lejos) → Z_MIN (cerca, al borde)
  speed: number
  size: number
  bright: number
  color: string
  age: number // segundos desde que (re)apareció, para el fundido de entrada
}

function ParallaxStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const cnv: HTMLCanvasElement = canvas
    const context = canvas.getContext('2d')
    if (!context) return
    const ctx = context

    const reduce =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const pickColor = () =>
      STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]

    let dpr = 1
    let width = 0
    let height = 0
    let scale = 40 // escala de proyección (define cuán "cerca del centro" nacen)
    let stars: Star[] = []
    let raf = 0
    let last = 0

    // Menos densidad en pantallas pequeñas.
    function densityFactor() {
      if (width < 640) return 0.4
      if (width < 1024) return 0.7
      return 1
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = cnv.clientWidth
      height = cnv.clientHeight
      cnv.width = Math.floor(width * dpr)
      cnv.height = Math.floor(height * dpr)
      scale = Math.min(width, height) * 0.062
    }

    // Coloca la estrella en una posición ALEATORIA de toda la pantalla (densidad
    // uniforme, sin acumularse en el centro) con una profundidad aleatoria. Se
    // parte de un punto de pantalla y se "des-proyecta" al plano virtual.
    function scatter(s: Star, freshAge: boolean) {
      const z = rand(Z_MIN, Z_FAR)
      const px = rand(0, width)
      const py = rand(0, height)
      s.z = z
      s.x = ((px - width / 2) * z) / scale
      s.y = ((py - height / 2) * z) / scale
      s.age = freshAge ? 0 : rand(0, 3)
    }

    function build() {
      resize()
      const df = densityFactor()
      stars = []
      for (const plane of PLANES) {
        const n = Math.round(plane.count * df)
        for (let i = 0; i < n; i++) {
          const s: Star = {
            x: 0,
            y: 0,
            z: Z_FAR,
            speed: plane.speed,
            size: plane.size,
            bright: plane.bright,
            color: pickColor(),
            age: 0,
          }
          scatter(s, false) // z/posición repartidos → campo lleno y uniforme
          stars.push(s)
        }
      }
    }

    // Reaparece en un punto aleatorio de la pantalla (no en el centro).
    function respawn(s: Star) {
      scatter(s, true)
      s.color = pickColor()
    }

    function render(now: number) {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
      last = now
      const cxp = width / 2
      const cyp = height / 2
      const margin = 4

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      for (const s of stars) {
        if (dt > 0) {
          s.z -= s.speed * dt
          s.age += dt
        }

        const inv = 1 / s.z
        const sx = cxp + s.x * scale * inv
        const sy = cyp + s.y * scale * inv

        // Recicla si llegó a la cámara o salió por los bordes.
        if (
          s.z <= Z_MIN ||
          sx < -margin ||
          sx > width + margin ||
          sy < -margin ||
          sy > height + margin
        ) {
          respawn(s)
          continue
        }

        const depth = 1 - s.z // 0 lejos → ~1 cerca (borde)
        const fade = Math.min(s.age / 0.8, 1) // fundido de entrada
        const r = s.size * (0.5 + 1.7 * depth)
        const a = Math.min(s.bright * (0.12 + 0.88 * depth), 1) * fade

        // Halo suave solo en el plano cercano (sigue siendo un punto redondo).
        if (s.size >= 1.0 && depth > 0.4) {
          const gr = r * 3
          const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, gr)
          grad.addColorStop(0, `rgba(${s.color},${a * 0.5})`)
          grad.addColorStop(1, `rgba(${s.color},0)`)
          ctx.globalAlpha = 1
          ctx.fillStyle = grad
          ctx.fillRect(sx - gr, sy - gr, gr * 2, gr * 2)
        }

        ctx.globalAlpha = a
        ctx.fillStyle = `rgb(${s.color})`
        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(render)
    }

    // Un único fotograma estático (posiciones repartidas por toda la pantalla).
    function renderStatic() {
      resize()
      const df = densityFactor()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      for (const plane of PLANES) {
        const n = Math.round(plane.count * df)
        for (let i = 0; i < n; i++) {
          const px = rand(0, width)
          const py = rand(0, height)
          const depth = rand(0, 1)
          const r = plane.size * (0.5 + 1.5 * depth)
          const a = Math.min(plane.bright * (0.3 + 0.6 * depth), 1)
          ctx.globalAlpha = a
          ctx.fillStyle = `rgb(${pickColor()})`
          ctx.beginPath()
          ctx.arc(px, py, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (reduce) {
          renderStatic()
        } else {
          build()
        }
      }, 200)
    }

    if (reduce) {
      renderStatic()
    } else {
      build()
      raf = requestAnimationFrame(render)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  )
}

function DeathStar() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '9%',
        right: '8%',
        width: '15vmin',
        height: '15vmin',
        minWidth: 110,
        minHeight: 110,
        maxWidth: 220,
        maxHeight: 220,
        zIndex: 2,
      }}
      aria-hidden="true"
    >
      {/* Estrella de la Muerte (asset 1024×1024, fondo transparente) */}
      <img
        src="/assets/death-star.png"
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter:
            'brightness(1.15) contrast(1.08) saturate(1.2) drop-shadow(0 0 14px rgba(120,170,255,0.35))',
        }}
      />
    </div>
  )
}

export default function GalaxyBackground() {
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
      {/* Base nocturna */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--theme-bg)',
        }}
      />

      {/* Nebulosa real (foto de fondo) — se mantiene quieta debajo del campo */}
      <img
        src="/assets/space.png"
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.85,
        }}
      />

      {/* Núcleo de la galaxia */}
      <div
        style={{
          position: 'absolute',
          top: '-25%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90vw',
          height: '90vw',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, var(--theme-glow-1) 0%, var(--theme-glow-2) 35%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'glow-breathe 9s ease-in-out infinite',
        }}
      />

      {/* Estrella de la Muerte, a lo lejos */}
      <DeathStar />

      {/* Campo de estrellas radial (canvas 2D) */}
      <ParallaxStars />

      {/* Viñeta para profundidad */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 45%, var(--theme-bg) 100%)',
          opacity: 0.7,
        }}
      />
    </div>
  )
}
