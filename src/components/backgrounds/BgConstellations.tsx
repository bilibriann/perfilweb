'use client'
import { useEffect, useRef } from 'react'

// Exact port of Odysseus _initConstellations
export default function BgConstellations() {
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
             '#64d2ff'
    }
    function getIntensity() {
      return parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--bg-effect-intensity') || '1',
      )
    }

    const STAR_COUNT   = 50
    const CONNECT_DIST = 120

    interface Star {
      x: number; y: number
      vx: number; vy: number
      r: number; twinkle: number; phase: number
    }

    function newStar(): Star {
      return {
        x:       Math.random() * window.innerWidth,
        y:       Math.random() * window.innerHeight,
        vx:      (Math.random() - 0.5) * 0.3,
        vy:      (Math.random() - 0.5) * 0.3,
        r:       0.8 + Math.random() * 1.4,
        twinkle: Math.random(),
        phase:   Math.random() * Math.PI * 2,
      }
    }

    const stars: Star[] = Array.from({ length: STAR_COUNT }, newStar)
    let rafId: number
    let running = true
    let tick = 0

    function draw() {
      if (!running) return
      rafId = requestAnimationFrame(draw)
      tick++

      const W         = window.innerWidth
      const H         = window.innerHeight
      const intensity = getIntensity()
      const color     = getColor()

      ctx.clearRect(0, 0, W, H)

      // Connections
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx   = stars[i].x - stars[j].x
          const dy   = stars[i].y - stars[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            ctx.save()
            ctx.globalAlpha = (1 - dist / CONNECT_DIST) * 0.15 * intensity
            ctx.strokeStyle = color
            ctx.lineWidth   = 0.5
            ctx.beginPath()
            ctx.moveTo(stars[i].x, stars[i].y)
            ctx.lineTo(stars[j].x, stars[j].y)
            ctx.stroke()
            ctx.restore()
          }
        }
      }

      // Stars
      for (const s of stars) {
        s.phase += 0.02
        const tw = Math.sin(s.phase)
        const a  = (0.15 + tw * 0.25) * intensity

        ctx.save()
        ctx.globalAlpha = Math.max(0, a)
        ctx.fillStyle   = color
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        s.x += s.vx
        s.y += s.vy
        if (s.x < 0)  s.x = W
        if (s.x > W)  s.x = 0
        if (s.y < 0)  s.y = H
        if (s.y > H)  s.y = 0
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
