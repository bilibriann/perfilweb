'use client'

import { useEffect, useRef } from 'react'

function energyZone(x: number, t: number): number {
  return (
    Math.sin(x * 0.008 + t * 1.10) * 0.50 +
    Math.sin(x * 0.019 + t * 1.70) * 0.30 +
    Math.sin(x * 0.041 + t * 2.50) * 0.20
  ) * 0.5 + 0.5
}

export default function DataWaveDivider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const rafRef       = useRef<number>(0)

  const rawVelocity  = useRef(0)
  const intensityRef = useRef(0)
  const lastScrollY  = useRef(0)
  const stopTimer    = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const canvas    = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const H         = 180
    const startTime = performance.now()
    let W = 0
    let ys = new Float32Array(0)

    function resize() {
      W = container!.offsetWidth
      canvas!.width  = W
      canvas!.height = H
      if (ys.length < W) ys = new Float32Array(W)
    }

    function onScroll() {
      const dy = Math.abs(window.scrollY - lastScrollY.current)
      rawVelocity.current = Math.min(dy / 80, 1)
      lastScrollY.current = window.scrollY
      if (stopTimer.current) clearTimeout(stopTimer.current)
      stopTimer.current = setTimeout(() => { rawVelocity.current = 0 }, 120)
    }

    function draw(now: number) {
      rafRef.current = requestAnimationFrame(draw)
      if (!ctx || W === 0) return

      const elapsed   = now - startTime
      const t         = elapsed * 0.001
      const target    = rawVelocity.current
      const lerpRate  = target > intensityRef.current ? 0.10 : 0.035
      intensityRef.current += (target - intensityRef.current) * lerpRate
      const intensity = intensityRef.current

      const amp     = 18 + intensity * 10
      const centerY = H / 2

      for (let x = 0; x < W; x++) {
        const w1 = Math.sin(x * 0.006  - t * 1.80) * 1.00
        const w2 = Math.sin(x * 0.009  + t * 1.30) * 0.75
        const w3 = Math.sin(x * 0.015  - t * 1.10) * 0.50
        const w4 = Math.sin(x * 0.023  + t * 1.90) * 0.30
        const w5 = Math.sin(x * 0.035  - t * 1.50) * 0.18
        const w6 = Math.sin(x * 0.051  + t * 0.95) * 0.10
        ys[x] = centerY + ((w1 + w2 + w3 + w4 + w5 + w6) / 2.83) * amp
      }

      // Transparent canvas — only draw the wave line
      ctx.clearRect(0, 0, W, H)

      const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-accent').trim() || '#60a5fa'
      const accentRgb   = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-accent-rgb').trim() || '96, 165, 250'

      // Glow line beneath dots
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(0, ys[0])
      for (let x = 1; x < W; x++) ctx.lineTo(x, ys[x])
      ctx.strokeStyle = `rgba(${accentRgb}, 0.12)`
      ctx.lineWidth   = 6
      ctx.filter      = 'blur(4px)'
      ctx.stroke()
      ctx.restore()

      // Dotted line with energy zones
      ctx.shadowColor = accentColor
      ctx.fillStyle   = accentColor

      for (let x = 0; x < W; x += 5) {
        const e  = energyZone(x, t)
        const py = ys[x] | 0

        ctx.globalAlpha = 0.70 + e * 0.30
        ctx.shadowBlur  = 5 + e * 12 + intensity * 8
        ctx.fillRect(x, py, 0.9, 0.9)

        if (e > 0.38) {
          ctx.fillStyle   = '#ffffff'
          ctx.shadowColor = '#ffffff'
          ctx.globalAlpha = (e - 0.38) * 1.4
          ctx.shadowBlur  = 3 + e * 5
          ctx.fillRect(x, py, 0.6, 0.6)
          ctx.fillStyle   = accentColor
          ctx.shadowColor = accentColor
        }
      }

      ctx.globalAlpha = 1.0
    }

    resize()
    lastScrollY.current = window.scrollY

    const ro = new ResizeObserver(resize)
    ro.observe(container)
    window.addEventListener('scroll', onScroll, { passive: true })
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (stopTimer.current) clearTimeout(stopTimer.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '180px', position: 'relative', flexShrink: 0, background: 'var(--theme-surface)' }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '180px' }}
      />
    </div>
  )
}
