'use client'
import { useEffect, useRef } from 'react'
import { hexToRgb } from '@/lib/themes/utils'

// Exact port of Odysseus _initEmbers
export default function BgEmbers() {
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
             '#e94560'
    }
    function getIntensity() {
      return parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--bg-effect-intensity') || '1',
      )
    }

    const EMBER_COUNT = 60

    interface Ember {
      x: number; y: number
      vx: number; vy: number
      r: number; alpha: number; life: number
    }

    function newEmber(): Ember {
      return {
        x:     Math.random() * window.innerWidth,
        y:     window.innerHeight + Math.random() * 20,
        vx:    (Math.random() - 0.5) * 0.8,
        vy:    -(0.4 + Math.random() * 1.2),
        r:     1 + Math.random() * 2,
        alpha: 0.4 + Math.random() * 0.6,
        life:  0.8 + Math.random() * 0.2,
      }
    }

    const embers: Ember[] = Array.from({ length: EMBER_COUNT }, newEmber)
    let rafId: number
    let running = true

    function draw() {
      if (!running) return
      rafId = requestAnimationFrame(draw)

      const W         = window.innerWidth
      const H         = window.innerHeight
      const intensity = getIntensity()
      const colorHex  = getColor()
      const rgb       = hexToRgb(colorHex) || { r: 233, g: 69, b: 96 }

      // Fade via destination-out (erase) then switch to 'lighter' for additive blend
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.globalAlpha = 0.18
      ctx.fillStyle   = 'rgba(0,0,0,1)'
      ctx.fillRect(0, 0, W, H)
      ctx.restore()

      ctx.save()
      ctx.globalCompositeOperation = 'lighter'

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i]
        const a = e.alpha * e.life * intensity

        // Radial gradient ember
        const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 2.4)
        grad.addColorStop(0,   `rgba(${rgb.r},${rgb.g},${rgb.b},${a * 0.9})`)
        grad.addColorStop(0.4, `rgba(${rgb.r},${rgb.g},${rgb.b},${a * 0.5})`)
        grad.addColorStop(1,   `rgba(${rgb.r},${rgb.g},${rgb.b},0)`)

        ctx.beginPath()
        ctx.fillStyle = grad
        ctx.arc(e.x, e.y, e.r * 2.4, 0, Math.PI * 2)
        ctx.fill()

        // White highlight core
        ctx.save()
        ctx.globalAlpha = a * 0.6
        ctx.fillStyle   = '#ffffff'
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r * 0.4, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        e.x    += e.vx
        e.y    += e.vy
        e.life -= 0.004
        e.vx   += (Math.random() - 0.5) * 0.05

        // 1.5% chance burst of 5 new embers
        if (Math.random() < 0.015) {
          for (let b = 0; b < 5; b++) embers.push(newEmber())
        }

        if (e.life <= 0 || e.y < -10) {
          const fresh = newEmber()
          e.x     = fresh.x;  e.y     = fresh.y
          e.vx    = fresh.vx; e.vy    = fresh.vy
          e.r     = fresh.r;  e.alpha = fresh.alpha
          e.life  = fresh.life
        }
      }

      // Keep ember count bounded
      while (embers.length > EMBER_COUNT * 3) embers.shift()

      ctx.restore()
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
