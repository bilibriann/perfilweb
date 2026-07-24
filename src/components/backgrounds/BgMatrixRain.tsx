'use client'
import { useEffect, useRef } from 'react'

const CHARS = '01010101010101アイウエオカキクケコサシスセソ0123456789ABCDEF'

export default function BgMatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!
    const dpr    = Math.min(window.devicePixelRatio || 1, 2)

    const FONT_SIZE = 16
    let columns: number[] = []

    function resize() {
      canvas.width  = window.innerWidth  * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const colCount = Math.ceil(window.innerWidth / FONT_SIZE)
      columns = Array.from({ length: colCount }, () => Math.random() * -50)
    }
    resize()
    window.addEventListener('resize', resize)

    function getColor() {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-accent').trim() || '#22d3ee'
    }
    function getBg() {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-bg').trim() || '#04040a'
    }
    function getIntensity() {
      return parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--bg-effect-intensity') || '1',
      )
    }

    let rafId: number
    let running = true

    function draw() {
      if (!running) return
      rafId = requestAnimationFrame(draw)

      const W         = window.innerWidth
      const H         = window.innerHeight
      const intensity = getIntensity() * 0.9
      const color     = getColor()

      // Fade trail
      ctx.fillStyle = getBg()
      ctx.globalAlpha = 0.08
      ctx.fillRect(0, 0, W, H)
      ctx.globalAlpha = 1

      ctx.font = `${FONT_SIZE}px monospace`
      ctx.fillStyle = color

      for (let i = 0; i < columns.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const x = i * FONT_SIZE
        const y = columns[i] * FONT_SIZE

        ctx.save()
        ctx.globalAlpha = 0.32 * intensity
        ctx.fillText(char, x, y)
        ctx.restore()

        if (y > H && Math.random() > 0.975) {
          columns[i] = 0
        } else {
          columns[i] += 0.4
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
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    />
  )
}
