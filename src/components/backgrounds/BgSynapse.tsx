'use client'
import { useEffect, useRef } from 'react'

// Exact port of Odysseus _initSynapse
export default function BgSynapse() {
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
             '#c9d1d9'
    }
    function getIntensity() {
      return parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--bg-effect-intensity') || '1',
      )
    }

    const GRID      = 24
    const MAX_PULSES = 20
    const SPEED_MIN  = 2
    const SPEED_MAX  = 22
    const TRAIL_LEN  = 12

    interface Pulse {
      x: number; y: number
      dx: number; dy: number
      speed: number
      trail: Array<{ x: number; y: number }>
    }

    const pulses: Pulse[] = []

    function spawnPulse() {
      const cols = Math.ceil(window.innerWidth  / GRID)
      const rows = Math.ceil(window.innerHeight / GRID)
      const dirs = [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }]
      const dir  = dirs[Math.floor(Math.random() * dirs.length)]
      pulses.push({
        x:     Math.floor(Math.random() * cols) * GRID,
        y:     Math.floor(Math.random() * rows) * GRID,
        dx:    dir.dx,
        dy:    dir.dy,
        speed: SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN),
        trail: [],
      })
    }

    let rafId: number
    let running = true

    function draw() {
      if (!running) return
      rafId = requestAnimationFrame(draw)

      const W         = window.innerWidth
      const H         = window.innerHeight
      const intensity = getIntensity()
      const color     = getColor()

      ctx.clearRect(0, 0, W, H)

      // Spawn
      if (pulses.length < MAX_PULSES && Math.random() < 0.12) spawnPulse()

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        p.trail.push({ x: p.x, y: p.y })
        if (p.trail.length > TRAIL_LEN) p.trail.shift()

        // Move to next grid cell
        p.x += p.dx * p.speed
        p.y += p.dy * p.speed

        // Bounce / redirect at grid boundaries
        const cols = Math.ceil(W / GRID)
        const rows = Math.ceil(H / GRID)
        if (p.x < 0 || p.x >= cols * GRID || p.y < 0 || p.y >= rows * GRID) {
          pulses.splice(i, 1)
          continue
        }

        // Draw trail
        for (let t = 0; t < p.trail.length; t++) {
          const pt   = p.trail[t]
          const frac = (t + 1) / p.trail.length
          ctx.save()
          ctx.globalAlpha = frac * 0.35 * intensity
          ctx.fillStyle   = color
          ctx.fillRect(pt.x - 1, pt.y - 1, 2, 2)
          ctx.restore()
        }

        // Draw dot head
        ctx.save()
        ctx.globalAlpha = 0.55 * intensity
        ctx.fillStyle   = color
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
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
