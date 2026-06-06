'use client'
import { useEffect, useRef } from 'react'
import { bgSmoothNoise } from '@/lib/themes/utils'

// Exact port of Odysseus _initPerlinFlow
export default function BgPerlinFlow() {
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
             '#00ff41'
    }
    function getBg() {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--bg').trim() || '#000000'
    }
    function getIntensity() {
      return parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--bg-effect-intensity') || '1',
      )
    }

    const PARTICLE_COUNT = 200
    const SCALE = 0.003

    interface Particle {
      x: number; y: number
      life: number; speed: number
    }

    function newParticle(): Particle {
      return {
        x:     Math.random() * window.innerWidth,
        y:     Math.random() * window.innerHeight,
        life:  0.3 + Math.random() * 0.7,
        speed: 0.5 + Math.random() * 1.5,
      }
    }

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, newParticle)
    let tick = 0
    let rafId: number
    let running = true

    function draw() {
      if (!running) return
      rafId = requestAnimationFrame(draw)
      tick = (tick + 1) % 100000

      const W         = window.innerWidth
      const H         = window.innerHeight
      const intensity = getIntensity()
      const color     = getColor()
      const bgColor   = getBg()

      // Fade trail
      ctx.save()
      ctx.globalAlpha      = 0.02
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, W, H)
      ctx.restore()

      for (const p of particles) {
        const angle  = bgSmoothNoise(p.x * SCALE + tick * 0.001, p.y * SCALE) * Math.PI * 4
        const dx     = Math.cos(angle) * p.speed
        const dy     = Math.sin(angle) * p.speed

        ctx.save()
        ctx.globalAlpha = p.life * 0.15 * intensity
        ctx.strokeStyle = color
        ctx.lineWidth   = 0.8
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x + dx, p.y + dy)
        ctx.stroke()
        ctx.restore()

        p.x += dx
        p.y += dy
        p.life -= 0.001

        if (p.life <= 0 || p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
          const fresh = newParticle()
          p.x    = fresh.x
          p.y    = fresh.y
          p.life = fresh.life
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
