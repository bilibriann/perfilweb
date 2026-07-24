'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { drawTile, drawGlitch, type Fit } from './glitch';

interface GlitchImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Nodo a mostrar si la imagen no carga. */
  fallback?: ReactNode;
  /** Dispara un glitch de entrada al cargar (revelado). Por defecto true. */
  glitchOnLoad?: boolean;
  /** cover (recorta y llena) o contain (imagen completa). Por defecto cover. */
  fit?: Fit;
}

/**
 * Renderiza una imagen en un <canvas> aplicando los efectos eléctricos del
 * enjambre (FlotaEstelar): glow cian permanente y glitch de franjas
 * intermitente. Sirve para la imagen principal del panel y las miniaturas.
 */
export default function GlitchImage({
  src,
  alt,
  className,
  fallback,
  glitchOnLoad = true,
  fit = 'cover',
}: GlitchImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stopped = false;
    let raf = 0;
    let burstTimer: ReturnType<typeof setTimeout>;
    let loaded = false;
    let W = 0;
    let H = 0;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const img = new window.Image();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (loaded) drawStatic();
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      drawTile(ctx, img, W, H, 1, fit);
    };

    const runBurst = () => {
      if (stopped) return;
      const start = performance.now();
      const dur = 110 + Math.random() * 130; // 110–240 ms, como en el enjambre
      const frame = (now: number) => {
        if (stopped) return;
        ctx.clearRect(0, 0, W, H);
        drawGlitch(ctx, img, W, H, now / 120, fit);
        if (now - start < dur) {
          raf = requestAnimationFrame(frame);
        } else {
          drawStatic();
          schedule();
        }
      };
      raf = requestAnimationFrame(frame);
    };

    const schedule = () => {
      if (stopped || reduce) return;
      burstTimer = setTimeout(runBurst, 1500 + Math.random() * 4000);
    };

    img.onload = () => {
      loaded = true;
      setError(false);
      resize();
      drawStatic();
      if (reduce) return;
      if (glitchOnLoad) runBurst();
      else schedule();
    };
    img.onerror = () => setError(true);
    img.src = src;

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      clearTimeout(burstTimer);
      ro.disconnect();
    };
  }, [src, glitchOnLoad, fit]);

  if (error) return <>{fallback ?? null}</>;

  return <canvas ref={canvasRef} className={className} role="img" aria-label={alt} />;
}
