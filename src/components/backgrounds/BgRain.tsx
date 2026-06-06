'use client'
import { useEffect, useRef } from 'react'

// Exact port of Odysseus _initRain
export default function BgRain() {
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
    function getSize() {
      return parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--bg-effect-size') || '1',
      )
    }

    interface Drop { x: number; y: number; len: number; speed: number; alpha: number }

    const MAX_DROPS = 130

    function newDrop(): Drop {
      return {
        x:     Math.random() * window.innerWidth,
        y:     Math.random() * window.innerHeight - window.innerHeight,
        len:   20 + Math.random() * 40,
        speed: 4  + Math.random() * 8,
        alpha: 0.32 + Math.random() * 0.28,
      }
    }

    const drops: Drop[] = Array.from({ length: MAX_DROPS }, newDrop)
    let rafId: number
    let running = true

    function draw() {
      if (!running) return
      rafId = requestAnimationFrame(draw)

      const W         = window.innerWidth
      const H         = window.innerHeight
      const intensity = getIntensity()
      const sizeMult  = getSize()
      const speedMult = 0.35 + intensity * 0.65
      const lw        = 1.3 * Math.min(2, Math.max(0.6, sizeMult))
      const color     = getColor()

      ctx.clearRect(0, 0, W, H)

      for (const d of drops) {
        ctx.save()
        ctx.globalAlpha = d.alpha * intensity
        ctx.strokeStyle = color
        ctx.lineWidth   = lw
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x - d.len * 0.2, d.y + d.len)
        ctx.stroke()
        ctx.restore()

        d.y += d.speed * speedMult
        if (d.y - d.len > H) {
          const fresh = newDrop()
          d.x     = fresh.x
          d.y     = fresh.y
          d.len   = fresh.len
          d.speed = fresh.speed
          d.alpha = fresh.alpha
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
