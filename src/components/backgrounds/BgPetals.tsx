'use client'
import { useEffect, useRef } from 'react'

// Exact port of Odysseus _initPetals
export default function BgPetals() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    const dpr    = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      canvas.width  = window.innerWidth  * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    function getColor() {
      const st = getComputedStyle(document.documentElement)
      return st.getPropertyValue('--bg-effect-color').trim() ||
             st.getPropertyValue('--fg').trim() ||
             '#a8d5a2'
    }
    function getIntensity() {
      return parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--bg-effect-intensity') || '1',
      )
    }

    const PETAL_COUNT = 30

    interface Petal {
      x: number; y: number
      r: number; vr: number; vy: number
      drift: number; driftSpeed: number
      phase: number; size: number
    }

    function newPetal(): Petal {
      return {
        x:          Math.random() * window.innerWidth,
        y:          Math.random() * window.innerHeight - window.innerHeight,
        r:          Math.random() * Math.PI * 2,
        vr:         (Math.random() - 0.5) * 0.06,
        vy:         0.3 + Math.random() * 0.6,
        drift:      0,
        driftSpeed: 0.01 + Math.random() * 0.02,
        phase:      Math.random() * Math.PI * 2,
        size:       4 + Math.random() * 8,
      }
    }

    const petals: Petal[] = Array.from({ length: PETAL_COUNT }, newPetal)
    let rafId: number
    let running = true

    function drawPetal(p: Petal, color: string, intensity: number) {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.r)

      // First ellipse
      ctx.save()
      ctx.globalAlpha = 0.2 * intensity
      ctx.fillStyle   = color
      ctx.beginPath()
      ctx.ellipse(0, 0, p.size, p.size * 1.6, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Second overlapping ellipse (slightly offset, lower alpha)
      ctx.save()
      ctx.globalAlpha = 0.15 * intensity
      ctx.fillStyle   = color
      ctx.beginPath()
      ctx.ellipse(p.size * 0.3, p.size * 0.2, p.size * 0.8, p.size * 1.2, Math.PI / 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      ctx.restore()
    }

    function draw() {
      if (!running) return
      rafId = requestAnimationFrame(draw)

      const W         = window.innerWidth
      const H         = window.innerHeight
      const intensity = getIntensity()
      const color     = getColor()

      ctx.clearRect(0, 0, W, H)

      for (const p of petals) {
        p.phase += p.driftSpeed
        p.drift  = Math.sin(p.phase) * 1.5
        p.x     += p.drift
        p.y     += p.vy
        p.r     += p.vr

        drawPetal(p, color, intensity)

        if (p.y > H + 20) {
          const fresh = newPetal()
          p.x          = fresh.x
          p.y          = fresh.y
          p.r          = fresh.r
          p.vr         = fresh.vr
          p.vy         = fresh.vy
          p.driftSpeed = fresh.driftSpeed
          p.phase      = fresh.phase
          p.size       = fresh.size
        }
      }
    }

    draw()

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="odysseus-bg-canvas"
      aria-hidden="true"
    />
  )
}
