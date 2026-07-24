// ─── Efectos eléctricos abstraídos de CanvasField (FlotaEstelar) ────────────
// Son EXACTAMENTE los del enjambre: glow cian al dibujar la imagen y el glitch
// de 10 franjas desplazadas con Math.tan + borde rosa. Se extraen aquí para
// poder aplicarlos a cualquier <canvas>, no solo al campo de naves.

import { PALETA } from './types';

/** Recorte "cover": centra y recorta la imagen para llenar el rect destino. */
export function coverCrop(
  img: HTMLImageElement,
  dw: number,
  dh: number,
): { sx: number; sy: number; sw: number; sh: number } {
  const iw = img.width;
  const ih = img.height;
  const ir = iw / ih;
  const tr = dw / dh;
  let sw = iw;
  let sh = ih;
  let sx = 0;
  let sy = 0;
  if (ir > tr) {
    sw = ih * tr;
    sx = (iw - sw) / 2;
  } else {
    sh = iw / tr;
    sy = (ih - sh) / 2;
  }
  return { sx, sy, sw, sh };
}

export type Fit = 'cover' | 'contain';

interface FitRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

/**
 * Rectángulos de origen y destino según el modo:
 * - cover: recorta la fuente y llena todo (0,0,w,h).
 * - contain: la imagen entra COMPLETA (sin recorte), centrada y con letterbox.
 */
function fitRect(img: HTMLImageElement, w: number, h: number, fit: Fit): FitRect {
  const iw = img.width;
  const ih = img.height;
  if (fit === 'contain') {
    const s = Math.min(w / iw, h / ih);
    const dw = iw * s;
    const dh = ih * s;
    return { sx: 0, sy: 0, sw: iw, sh: ih, dx: (w - dw) / 2, dy: (h - dh) / 2, dw, dh };
  }
  const { sx, sy, sw, sh } = coverCrop(img, w, h);
  return { sx, sy, sw, sh, dx: 0, dy: 0, dw: w, dh: h };
}

/** Dibuja la imagen (cover o contain) con el glow cian del enjambre. */
export function drawTile(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  glow = 1,
  fit: Fit = 'cover',
): void {
  if (!img.width) return;
  const r = fitRect(img, w, h, fit);
  ctx.save();
  if (glow > 0) {
    ctx.shadowColor = 'rgba(51, 222, 244, 0.4)'; // PALETA.cyan
    ctx.shadowBlur = 18 * glow;
  }
  ctx.drawImage(img, r.sx, r.sy, r.sw, r.sh, r.dx, r.dy, r.dw, r.dh);
  ctx.restore();
}

/**
 * Glitch eléctrico del enjambre: 10 franjas horizontales desplazadas en X
 * (con Math.tan y un salto grande ocasional) + borde rosa. `phase` anima el
 * desplazamiento a lo largo del burst.
 */
export function drawGlitch(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  phase = 0,
  fit: Fit = 'cover',
): void {
  if (!img.width) return;
  const r = fitRect(img, w, h, fit);
  const bandas = 10;
  for (let k = 0; k < bandas; k++) {
    const fy = k / bandas;
    const fh = 1 / bandas;
    let off = Math.tan(phase + fy * r.dh) * 6 * Math.random();
    if (Math.random() < 0.06) off = r.dw * Math.random() - r.dw / 2;
    ctx.globalAlpha = 1;
    ctx.drawImage(
      img,
      r.sx,
      r.sy + fy * r.sh,
      r.sw,
      r.sh * fh,
      r.dx + off,
      r.dy + fy * r.dh,
      r.dw,
      r.dh * fh,
    );
  }
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = Math.max(1.5, Math.min(r.dw, r.dh) * 0.03);
  ctx.strokeStyle = PALETA.pink;
  ctx.strokeRect(r.dx, r.dy, r.dw, r.dh);
  ctx.globalAlpha = 1;
}
