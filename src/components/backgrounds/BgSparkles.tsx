'use client'
import { useEffect, useRef } from 'react'

// Exact port of Odysseus _initSparkles
export default function BgSparkles() {
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
             '#ff8cb8'
    }
    function getIntensity() {
      return parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--bg-effect-intensity') || '1',
      )
    }

    const SPARKLE_COUNT = 35

    interface Sparkle {
      x: number; y: number
      size: number; phase: number; speed: number
      life: number
    }

    function newSparkle(): Sparkle {
      return {
        x:     Math.random() * window.innerWidth,
        y:     Math.random() * window.innerHeight,
        size:  3 + Math.random() * 6,
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.04,
        life:  0.5 + Math.random() * 0.5,
      }
    }

    const sparkles: Sparkle[] = Array.from({ length: SPARKLE_COUNT }, newSparkle)
    let rafId: number
    let running = true

    // 4-point star via quadraticCurveTo (Odysseus technique)
    function drawStar(x: number, y: number, r: number, color: string, alpha: number) {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle   = color
      ctx.translate(x, y)
      ctx.beginPath()
      const inner = r * 0.3
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2
        const nAngle = ((i + 0.5) / 4) * Math.PI * 2
        if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
        ctx.quadraticCurveTo(0, 0, Math.cos(nAngle) * inner, Math.sin(nAngle) * inner)
        const nextAngle = ((i + 1) / 4) * Math.PI * 2
        ctx.quadraticCurveTo(0, 0, Math.cos(nextAngle) * r, Math.sin(nextAngle) * r)
      }
      ctx.closePath()
      ctx.fill()
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

      for (const s of sparkles) {
        s.phase += s.speed
        const twinkle = Math.sin(s.phase)
        const alpha   = Math.max(0, twinkle) * 0.25 * s.life * intensity
        const scale   = 0.5 + Math.max(0, twinkle) * 0.5

        if (alpha > 0) drawStar(s.x, s.y, s.size * scale, color, alpha)

        // Respawn after 3 full cycles
        if (s.phase > Math.PI * 6) {
          const fresh = newSparkle()
          s.x     = fresh.x
          s.y     = fresh.y
          s.size  = fresh.size
          s.phase = 0
          s.speed = fresh.speed
          s.life  = fresh.life
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
