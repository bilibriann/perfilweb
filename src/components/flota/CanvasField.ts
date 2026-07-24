// ─── Motor de canvas: galería en scroll infinito TRANSPARENTE + efectos ─────
// Modelo (inspirado en la referencia ejem.png):
//   · Cuadrícula de columnas tipo "masonry": las imágenes NO son del mismo
//     tamaño, cada tile toma una proporción variada de un patrón determinista
//     (así el orden se respeta y el tamaño varía).
//   · Scroll vertical infinito: cada columna es una tira que hace wrap sobre su
//     propia altura. Hay una deriva automática lenta + el wheel/touch la empuja,
//     de modo que "el scroll va mostrando más imágenes".
//   · Aparición gradual: cada tile escala y se desvanece según su distancia al
//     centro vertical. En los bordes entra pequeño y translúcido y, al avanzar
//     hacia el centro, CRECE hasta el tamaño pleno de las imágenes principales.
//   · Foco: rectángulo rosa #FE296D que interpola hacia el tile bajo el cursor.
//   · Glitch por imagen: intermitentemente un tile se trocea en franjas.
//   · Revelado: al hacer clic, la nave se ensambla en el centro desde franjas
//     que entran con offsets en X que decaen (ease 1-√(1-x²)). Clic/ESC vuelve.

import { PALETA } from './types';
import type { ImagenCargada } from './types';

type Modo = 'campo' | 'revelando' | 'revelado' | 'borrando';
type Corner = [number, number, number, number];

interface Tile {
  img: HTMLImageElement;
  nombre: string;
  col: number;
  worldY: number; // posición dentro de la tira de su columna
  w: number;
  h: number;
  jitterX: number; // desplazamiento horizontal aleatorio (desorden)
}

interface Columna {
  tiles: Tile[];
  contentH: number; // alto total de la tira (para el wrap)
  phase: number;    // desfase inicial (stagger tipo masonry)
}

// Instancia dibujada en el frame actual (para hit-testing de foco/clic).
interface Instancia {
  tile: Tile;
  cx: number;
  cy: number;
  w: number;
  h: number;
  a: number;
}

// El scroll de la galería sigue al scroll real de la página (parallax): así
// "las naves bajan al hacer scroll" de forma fiable, sin atrapar la página ni
// pelear con el clic. K = cuánto se desplaza la galería por px de scroll.
const SCROLL_K = 1.6;
// Umbral de alpha para poder enfocar/seleccionar un tile (los muy tenues de los
// bordes no; el resto sí).
const CLICK_ALPHA = 0.3;

const randRange = (a: number, b: number) => a + Math.random() * (b - a);
const randInt = (a: number, b: number) => Math.floor(a + Math.random() * (b - a + 1));
const smoothstep = (t: number) => t * t * (3 - 2 * t);

export class CanvasField {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private imgs: ImagenCargada[];
  private onSelect?: (nombre: string | null) => void;

  private W = 0;
  private H = 0;
  private raf = 0;

  private columnas: Columna[] = [];
  private colW = 0;
  private gap = 0;
  private offX = 0;

  private scroll = 0;        // scroll suavizado (el que se pinta)
  private targetScroll = 0;  // objetivo (deriva + input)

  private instancias: Instancia[] = []; // visibles en el último frame

  private mouseX = -9999;
  private mouseY = -9999;
  private hover: Instancia | null = null;
  private foco = { x: 0, y: 0, w: 0, h: 0, a: 0 };

  private modo: Modo = 'campo';
  private selImg: HTMLImageElement | null = null;
  private bandas: { y0: number; h: number; offX: number }[] = [];
  private revStart = 0;
  private delStart = 0;

  // Glitch: se asocia a un tile concreto por un tiempo.
  private glitchTile: Tile | null = null;
  private glitchUntil = 0;

  private ro?: ResizeObserver;

  constructor(
    canvas: HTMLCanvasElement,
    imgs: ImagenCargada[],
    onSelect?: (nombre: string | null) => void,
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo obtener el contexto 2D');
    this.ctx = ctx;
    this.imgs = imgs;
    this.onSelect = onSelect;

    this.attach();
    this.layout();
    // Posición inicial acorde al scroll actual de la página (negativo: las
    // naves DESCIENDEN por la pantalla al hacer scroll hacia abajo).
    this.targetScroll = this.scroll =
      -(typeof window !== 'undefined' ? window.scrollY : 0) * SCROLL_K;
  }

  start() {
    if (!this.raf) this.raf = requestAnimationFrame(this.loop);
  }
  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }
  destroy() {
    this.stop();
    this.detach();
  }

  private attach() {
    const c = this.canvas;
    c.addEventListener('pointermove', this.onMove);
    c.addEventListener('pointerleave', this.onLeave);
    c.addEventListener('click', this.onClick);
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('keydown', this.onKey);
    this.ro = new ResizeObserver(() => this.layout());
    this.ro.observe(c);
  }
  private detach() {
    const c = this.canvas;
    c.removeEventListener('pointermove', this.onMove);
    c.removeEventListener('pointerleave', this.onLeave);
    c.removeEventListener('click', this.onClick);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('keydown', this.onKey);
    this.ro?.disconnect();
  }

  private local(e: { clientX: number; clientY: number }) {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  private onMove = (e: PointerEvent) => {
    const p = this.local(e);
    this.mouseX = p.x;
    this.mouseY = p.y;
  };
  private onLeave = () => {
    this.mouseX = -9999;
    this.mouseY = -9999;
  };
  private onScroll = () => {
    // La galería sigue al scroll de la página (parallax): las naves bajan al
    // hacer scroll hacia abajo, y la página nunca queda atrapada.
    this.targetScroll = -window.scrollY * SCROLL_K;
  };
  private onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && (this.modo === 'revelado' || this.modo === 'revelando')) {
      this.cerrar();
    }
  };
  private onClick = () => {
    if (this.modo === 'revelando' || this.modo === 'revelado') {
      this.cerrar();
      return;
    }
    if (this.modo !== 'campo') return;
    // Clicables todos los tiles razonablemente visibles (no sólo la banda
    // central): así se puede seleccionar casi cualquier imagen.
    let best: Instancia | null = null;
    for (const ins of this.instancias) {
      if (ins.a < CLICK_ALPHA) continue;
      if (this.contiene(ins, this.mouseX, this.mouseY) && (!best || ins.a > best.a)) {
        best = ins;
      }
    }
    if (best) this.abrir(best);
  };

  private contiene(ins: Instancia, x: number, y: number) {
    return (
      x > ins.cx - ins.w / 2 &&
      x < ins.cx + ins.w / 2 &&
      y > ins.cy - ins.h / 2 &&
      y < ins.cy + ins.h / 2
    );
  }

  // ── Disposición: columnas tipo masonry con alturas variadas ────────────────
  private layout = () => {
    const c = this.canvas;
    this.W = c.clientWidth;
    this.H = c.clientHeight;
    c.width = Math.max(1, Math.floor(this.W));
    c.height = Math.max(1, Math.floor(this.H));

    // Más columnas → tiles más pequeños.
    const cols = this.W < 560 ? 3 : this.W < 1000 ? 4 : 5;
    // Separación mínima → imágenes más unidas entre sí.
    this.gap = Math.min(5, Math.max(2, Math.min(this.W, this.H) * 0.004));

    // Rejilla más angosta y centrada en X (más margen a los lados).
    const gridW = Math.min(this.W * 0.78, 1040);
    this.colW = (gridW - (cols - 1) * this.gap) / cols;
    this.offX = (this.W - gridW) / 2;

    // Reparte las imágenes en round-robin (respeta el orden de lectura) y
    // apila cada columna con alturas variadas.
    this.columnas = Array.from({ length: cols }, () => ({
      tiles: [] as Tile[],
      contentH: 0,
      phase: 0,
    }));

    this.imgs.forEach((im, i) => {
      const col = i % cols;
      const columna = this.columnas[col];
      // Proporción aleatoria por tile → tamaños desordenados.
      const ar = randRange(0.78, 1.85);
      const h = this.colW / ar;
      const tile: Tile = {
        img: im.el,
        nombre: im.nombre,
        col,
        worldY: columna.contentH,
        w: this.colW,
        h,
        // Sin jitter horizontal: cada columna mantiene su carril → las
        // imágenes no se solapan/transponen entre sí.
        jitterX: 0,
      };
      columna.tiles.push(tile);
      // Separación vertical también algo aleatoria → menos alineado.
      columna.contentH += h + this.gap * randRange(0.4, 1.8);
    });

    // Stagger vertical aleatorio entre columnas → look desordenado (masonry).
    this.columnas.forEach((columna) => {
      columna.phase = Math.random() * columna.contentH;
    });
  };

  // ── Bucle ────────────────────────────────────────────────────────────────
  private loop = (now: number) => {
    this.raf = requestAnimationFrame(this.loop);
    this.step(now);
  };

  // Escala + alpha RADIAL respecto al centro de la pantalla: la imagen del
  // centro es la más grande y a plena opacidad; a medida que se alejan del
  // centro (en cualquier dirección) se hacen más chicas y translúcidas. Así
  // las ~6 centrales quedan como las mejores visibles.
  private factor(cx: number, cy: number) {
    const dx = cx - this.W / 2;
    const dy = cy - this.H / 2;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Radio de caída: dentro de él las naves son grandes; fuera, pequeñas.
    const R = Math.min(this.W, this.H) * 0.62;
    const t = Math.max(0, Math.min(1, 1 - dist / R));
    const f = smoothstep(t);
    // Central ≈ tamaño pleno (1.0); las lejanas hasta 0.4.
    return { alpha: 0.12 + 0.88 * f, scale: 0.4 + 0.6 * f };
  }

  private step(now: number) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H); // TRANSPARENTE: se ve el fondo del sitio
    ctx.globalAlpha = 1;

    // Estáticas: sin deriva automática. Sólo se mueven con el scroll del
    // usuario; aquí únicamente suavizamos hacia el objetivo.
    this.scroll += (this.targetScroll - this.scroll) * 0.12;

    if (this.modo === 'campo' || this.modo === 'borrando') {
      this.calcularInstancias();
      this.dibujarCampo(now);
    }

    if (this.modo === 'campo') {
      // Glitch ocasional sobre un tile visible.
      if (now >= this.glitchUntil && Math.random() < 0.02 && this.instancias.length) {
        this.glitchTile = this.instancias[randInt(0, this.instancias.length - 1)].tile;
        this.glitchUntil = now + randRange(110, 240);
      }
      this.dibujarFoco();
      this.canvas.style.cursor = this.hover ? 'zoom-in' : 'default';
    } else if (this.modo === 'revelando' || this.modo === 'revelado') {
      // Velo tenue (grado bajo) para destacar la nave revelada.
      ctx.fillStyle = 'rgba(1,1,42,0.1)';
      ctx.fillRect(0, 0, this.W, this.H);
      this.dibujarRevelado(now);
      this.canvas.style.cursor = 'zoom-out';
    }

    if (this.modo === 'borrando') {
      this.dibujarBorrado(now);
    }
  }

  // Calcula las instancias visibles (con wrap por columna) del frame actual.
  private calcularInstancias() {
    this.instancias = [];
    for (const columna of this.columnas) {
      if (columna.contentH <= 0) continue;
      const base = this.scroll + columna.phase;
      const mod = ((base % columna.contentH) + columna.contentH) % columna.contentH;
      for (const tile of columna.tiles) {
        const cx =
          this.offX + tile.col * (this.colW + this.gap) + this.colW / 2 + tile.jitterX;
        // Tres copias (arriba/actual/abajo) para el wrap sin costuras.
        for (let k = -1; k <= 1; k++) {
          const topY = tile.worldY - mod + k * columna.contentH;
          if (topY + tile.h < -60 || topY > this.H + 60) continue;
          const centerY = topY + tile.h / 2;
          const { alpha, scale } = this.factor(cx, centerY);
          if (alpha < 0.02) continue;
          this.instancias.push({
            tile,
            cx,
            cy: centerY,
            w: tile.w * scale,
            h: tile.h * scale,
            a: alpha,
          });
        }
      }
    }
    // Los más "presentes" al final → se dibujan encima.
    this.instancias.sort((a, b) => a.a - b.a);
  }

  private dibujarCampo(now: number) {
    for (const ins of this.instancias) {
      if (this.glitchTile === ins.tile && now < this.glitchUntil) {
        this.dibujarGlitch(ins);
      } else {
        this.dibujarTile(ins);
      }
    }
    this.ctx.globalAlpha = 1;
  }

  private crop(img: HTMLImageElement, dw: number, dh: number) {
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

  private dibujarTile(ins: Instancia) {
    const ctx = this.ctx;
    const { img } = ins.tile;
    if (!img.width) return;
    const dx = ins.cx - ins.w / 2;
    const dy = ins.cy - ins.h / 2;
    const { sx, sy, sw, sh } = this.crop(img, ins.w, ins.h);
    ctx.save();
    ctx.globalAlpha = ins.a;
    ctx.shadowColor = 'rgba(51,222,244,0.4)';
    ctx.shadowBlur = 18 * ins.a;
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, ins.w, ins.h);
    ctx.restore();
  }

  private dibujarGlitch(ins: Instancia) {
    const ctx = this.ctx;
    const { img } = ins.tile;
    if (!img.width) return;
    const dx = ins.cx - ins.w / 2;
    const dy = ins.cy - ins.h / 2;
    const { sx, sy, sw, sh } = this.crop(img, ins.w, ins.h);
    const bandas = 10;
    for (let k = 0; k < bandas; k++) {
      const fy = k / bandas;
      const fh = 1 / bandas;
      let off = Math.tan(dy + fy * ins.h) * 6 * Math.random();
      if (Math.random() < 0.06) off = ins.w * Math.random() - ins.w / 2;
      ctx.globalAlpha = ins.a;
      ctx.drawImage(
        img,
        sx, sy + fy * sh, sw, sh * fh,
        dx + off, dy + fy * ins.h, ins.w, ins.h * fh,
      );
    }
    ctx.globalAlpha = ins.a * 0.85;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = PALETA.pink;
    ctx.strokeRect(dx, dy, ins.w, ins.h);
    ctx.globalAlpha = 1;
  }

  // ── Foco rosa ────────────────────────────────────────────────────────────
  private dibujarFoco() {
    let best: Instancia | null = null;
    for (const ins of this.instancias) {
      if (ins.a < CLICK_ALPHA) continue;
      if (this.contiene(ins, this.mouseX, this.mouseY) && (!best || ins.a > best.a)) {
        best = ins;
      }
    }
    this.hover = best;

    // El recuadro rojo se coloca EXCLUSIVAMENTE sobre la imagen bajo el cursor:
    // se fija de golpe a ese tile (sin deslizarse por otros) y desaparece al
    // instante cuando el cursor no está sobre ninguna imagen.
    const f = this.foco;
    if (best) {
      const pad = 8;
      f.x = best.cx - best.w / 2 - pad;
      f.y = best.cy - best.h / 2 - pad;
      f.w = best.w + pad * 2;
      f.h = best.h + pad * 2;
      f.a = 1;
    } else {
      f.a = 0;
      return;
    }
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = f.a;
    ctx.strokeStyle = PALETA.pink;
    ctx.lineWidth = 2;
    ctx.strokeRect(f.x, f.y, f.w, f.h);
    const L = 12;
    const cs: Corner[] = [
      [f.x, f.y, 1, 1],
      [f.x + f.w, f.y, -1, 1],
      [f.x, f.y + f.h, 1, -1],
      [f.x + f.w, f.y + f.h, -1, -1],
    ];
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (const [x, y, sx, sy] of cs) {
      ctx.moveTo(x, y + sy * L);
      ctx.lineTo(x, y);
      ctx.lineTo(x + sx * L, y);
    }
    ctx.stroke();
    if (this.hover) {
      ctx.font = '11px monospace';
      ctx.fillStyle = PALETA.pink;
      ctx.fillText(this.hover.tile.nombre.toUpperCase(), f.x, f.y - 7);
    }
    ctx.restore();
  }

  // ── Revelado / borrado (drawImage, sin getImageData) ────────────────────────
  private rectRevelado(img: HTMLImageElement) {
    let bw: number;
    let bh: number;
    let ratio: number;
    if (img.width >= img.height) {
      bw = Math.min(this.W * 0.9, img.width);
      ratio = img.width / img.height;
      bh = bw / ratio;
    } else {
      bh = Math.min(this.H * 0.9, img.height);
      ratio = img.height / img.width;
      bw = bh / ratio;
      if (bw >= this.W * 0.9) {
        bw = Math.min(this.W * 0.9, img.width);
        ratio = img.width / img.height;
        bh = bw / ratio;
      }
    }
    return { bw, bh, bx: (this.W - bw) / 2, by: (this.H - bh) / 2 };
  }

  private abrir(ins: Instancia) {
    this.selImg = ins.tile.img;
    const { bh } = this.rectRevelado(this.selImg);

    this.bandas = [];
    let pre = 0;
    let add = 0;
    for (let y = 0; y < bh; y += add) {
      add = randInt(5, 20);
      if (pre + add > bh) add = Math.floor(bh - pre);
      if (add <= 0) break;
      this.bandas.push({ y0: pre / bh, h: add / bh, offX: Math.random() * this.W * 0.5 - this.W * 0.25 });
      pre += add;
    }
    this.modo = 'revelando';
    this.revStart = performance.now();
    this.onSelect?.(ins.tile.nombre);
  }

  private cerrar() {
    if (this.modo !== 'revelando' && this.modo !== 'revelado') return;
    this.modo = 'borrando';
    this.delStart = performance.now();
    this.onSelect?.(null);
  }

  private dibujarRevelado(now: number) {
    const img = this.selImg;
    if (!img) {
      this.modo = 'campo';
      return;
    }
    const { bw, bh, bx, by } = this.rectRevelado(img);

    if (this.modo === 'revelando') {
      for (const b of this.bandas) {
        this.ctx.globalAlpha = 1;
        this.ctx.drawImage(
          img,
          0, b.y0 * img.height, img.width, b.h * img.height,
          bx + b.offX, by + b.y0 * bh, bw, b.h * bh,
        );
      }
      const t = 1 - Math.min((now - this.revStart) * 0.0011, 1);
      const e = 1 - Math.sqrt(1 - t * t);
      for (const b of this.bandas) b.offX *= e;
      if (t <= 0) this.modo = 'revelado';
    } else {
      this.ctx.globalAlpha = 1;
      this.ctx.drawImage(img, bx, by, bw, bh);
    }
    this.marcoRevelado(bx, by, bw, bh);
  }

  private dibujarBorrado(now: number) {
    const img = this.selImg;
    if (!img) {
      this.modo = 'campo';
      return;
    }
    const { bw, bh, bx, by } = this.rectRevelado(img);
    const p = Math.min(1, (now - this.delStart) / 260);
    const t = now / 1000;
    for (const b of this.bandas) {
      const off = Math.tan(t * 0.9 + b.y0 * Math.PI) * 120 * p;
      this.ctx.globalAlpha = Math.max(0, 1 - p);
      this.ctx.drawImage(
        img,
        0, b.y0 * img.height, img.width, b.h * img.height,
        bx + off, by + b.y0 * bh, bw, b.h * bh,
      );
    }
    this.ctx.globalAlpha = 1;
    if (p >= 1) {
      this.modo = 'campo';
      this.selImg = null;
    }
  }

  private marcoRevelado(x: number, y: number, w: number, h: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = PALETA.cyan;
    ctx.lineWidth = 2;
    const L = 22;
    const cs: Corner[] = [
      [x, y, 1, 1],
      [x + w, y, -1, 1],
      [x, y + h, 1, -1],
      [x + w, y + h, -1, -1],
    ];
    ctx.beginPath();
    for (const [cxp, cyp, sx, sy] of cs) {
      ctx.moveTo(cxp, cyp + sy * L);
      ctx.lineTo(cxp, cyp);
      ctx.lineTo(cxp + sx * L, cyp);
    }
    ctx.stroke();
    ctx.restore();
  }
}
