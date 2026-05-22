'use client'

import { useEffect, useRef } from 'react'

// --- Permutation table (Ken Perlin standard) ---
const BASE_PERM = [
  151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,
  20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,
  230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,
  169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,
  147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,
  2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,
  112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,
  49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,
  67,29,24,72,243,141,128,195,78,66,215,61,156,180,
]
const PERM = new Uint8Array(512)
for (let k = 0; k < 512; k++) PERM[k] = BASE_PERM[k & 255]

function Is(n: number): number { return n & 255 }
function nt(n: number): number { return PERM[n & 511] }

function simplexNoise2D(t: number, a: number): number {
  const s = 0.211324865405187, n = 0.366025403784439
  const r = -0.577350269189626, i = 0.024390243902439
  const p = (t + a) * n
  let m = Math.floor(t + p), l = Math.floor(a + p)
  const c = (m + l) * s
  const x = t - m + c, d = a - l + c
  const f = x > d ? 1 : 0, j = x > d ? 0 : 1
  const b = x + s - f, v = d + s - j
  const w = x + r, C = d + r
  m = Is(m); l = Is(l)
  const P = nt(nt(l) + m), S = nt(nt(l + j) + m + f), R = nt(nt(l + 1) + m + 1)
  let N = Math.max(0.5 - (x * x + d * d), 0)
  let A = Math.max(0.5 - (b * b + v * v), 0)
  let y = Math.max(0.5 - (w * w + C * C), 0)
  N = N * N * N * N; A = A * A * A * A; y = y * y * y * y
  const u = 2 * (P * i - Math.floor(P * i)) - 1
  const h = 2 * (S * i - Math.floor(S * i)) - 1
  const g = 2 * (R * i - Math.floor(R * i)) - 1
  const D = Math.abs(u) - 0.5, I = Math.abs(h) - 0.5, T = Math.abs(g) - 0.5
  const F = u - Math.floor(u + 0.5)
  const H = h - Math.floor(h + 0.5)
  const G = g - Math.floor(g + 0.5)
  N *= 1.79284291400159 - 0.85373472095314 * (F * F + D * D)
  A *= 1.79284291400159 - 0.85373472095314 * (H * H + I * I)
  y *= 1.79284291400159 - 0.85373472095314 * (G * G + T * T)
  return 130 * (N * (F * x + D * d) + A * (H * b + I * v) + y * (G * w + T * C))
}

// Ocean wave: three traveling-wave components at different spatial/temporal scales.
// Each one shifts the noise X-coordinate with time → pattern moves horizontally.
function oceanWave(x: number, elapsedMs: number, intensity: number): number {
  const t  = elapsedMs * 0.001
  // Velocidad base muy baja — letárgica. Con scroll sube suavemente (×2 máx)
  const sp = 1 + intensity * 1.8

  // Ola principal — k=0.0048 → 1920*0.0048=9.2 → 4-5 crestas visibles a la vez
  const w1 = simplexNoise2D(x * 0.0048 - t * 0.008 * sp,  t * 0.004)

  // Segunda capa — frecuencia levemente mayor, misma dirección → varía las crestas
  const w2 = simplexNoise2D(x * 0.0078 - t * 0.012 * sp,  t * 0.006) * 0.28

  return (w1 + w2) / (1.28 * 100)
}

interface Props {
  colorAbove: string   // bg color of the section above
  colorBelow: string   // bg color of the section below
}

export default function DataWaveDivider({ colorAbove, colorBelow }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const rafRef       = useRef<number>(0)

  // Velocity tracked globally so it responds to any scroll, not just near this element
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

    let W = 0
    const H = 260
    const startTime = performance.now()

    function resize() {
      W = container!.offsetWidth
      canvas!.width  = W
      canvas!.height = H
    }

    function onScroll() {
      const dy = Math.abs(window.scrollY - lastScrollY.current)
      // Map pixel delta per event to 0–1 intensity; 80px/event = full turbulence
      rawVelocity.current = Math.min(dy / 80, 1)
      lastScrollY.current = window.scrollY

      // Auto-calm after 200 ms of no scroll events
      if (stopTimer.current) clearTimeout(stopTimer.current)
      stopTimer.current = setTimeout(() => {
        rawVelocity.current = 0
      }, 200)
    }

    function draw(now: number) {
      if (!ctx) return
      const elapsed = now - startTime

      const target   = rawVelocity.current
      const lerpRate = target > intensityRef.current ? 0.10 : 0.006
      intensityRef.current += (target - intensityRef.current) * lerpRate

      const intensity = intensityRef.current
      const amplitude = 118 + intensity * 10

      ctx.clearRect(0, 0, W, H)
      const centerY = H / 2

      ctx.shadowColor = '#00FFD4'
      ctx.shadowBlur  = 1.5
      ctx.fillStyle   = '#00FFD4'

      for (let x = 0; x < W; x += 5) {
        const n = oceanWave(x, elapsed, intensity)
        ctx.fillRect(x, (centerY + n * amplitude) | 0, 0.8, 0.8)
      }

      rafRef.current = requestAnimationFrame(draw)
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
      style={{
        width: '100%',
        height: '260px',
        background: `linear-gradient(to bottom, ${colorAbove} 50%, ${colorBelow} 50%)`,
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '260px' }}
      />
    </div>
  )
}
