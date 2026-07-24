'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { Search, Rocket, ImageOff, Maximize2, X } from 'lucide-react';
import {
  cargarNaves,
  filtrarNaves,
  type Nave,
  type EspecificacionesNave,
} from '@/lib/starships/api';

// ─── Visor maestro-detalle ──────────────────────────────────────────────────
// Metáfora: cabina de caza. La columna izquierda es el RADAR (índice compacto
// de contactos) y la derecha es el VISOR (el objetivo fijado, en grande).
// Nada de tarjetas: la fila activa se marca con una barra en el borde y los
// stats se separan con hairlines de 1px.

const ANCHO_RADAR = 200;

// Sin scroll anidado: el radar muestra como mucho estas filas. El resto se
// alcanza filtrando (por eso el buscador vive dentro del propio radar).
const MAX_FILAS = 10;

// Revelado eléctrico: la foto nueva entra en franjas horizontales desfasadas.
const REVEAL_BANDS = 4;

// Rangos de referencia para normalizar las barras de los stats.
const SPEED_MAX = 1500; // km/h atmosférica (los cazas rondan 1000-1300)
const HYPER_BEST = 0.5; // clase hiperimpulsor: MENOR es mejor
const HYPER_WORST = 4;

const clampPct = (n: number) => Math.max(4, Math.min(100, n));
const hyperPct = (r: number) => clampPct(((HYPER_WORST - r) / (HYPER_WORST - HYPER_BEST)) * 100);

/** Número representativo de un valor textual (mayor, para rangos "30-165"). */
function parseNum(v?: string): number | null {
  if (!v) return null;
  const nums = v.replace(/,/g, '').match(/\d+(\.\d+)?/g);
  if (!nums) return null;
  const vals = nums.map(Number).filter((n) => !Number.isNaN(n));
  return vals.length ? Math.max(...vals) : null;
}

const dosDigitos = (n: number) => String(n).padStart(2, '0');

/** Línea secundaria mono de cada fila: telemetría real si la API la trajo. */
function lineaTelemetria(nave: Nave, indice: number): string {
  const { hyperdrive, crew, model } = nave.specs;
  const partes: string[] = [];
  if (hyperdrive) partes.push(`HI ${hyperdrive}`);
  if (crew) partes.push(`TRIP ${crew}`);
  if (partes.length === 0 && model) partes.push(model.toUpperCase());
  if (partes.length === 0) partes.push('SIN TELEMETRÍA');
  return `NV-${dosDigitos(indice + 1)} · ${partes.join(' · ')}`;
}

interface Stat {
  etiqueta: string;
  valor: string;
  /** Si existe, el número sube desde 0 (count-up). */
  num?: number;
  /** Si existe, se dibuja la hairline de relleno bajo el valor. */
  pct?: number;
}

/** Los 4 stats del visor. Siempre son 4: lo que falta se muestra como "—". */
function statsVisor(specs: EspecificacionesNave): Stat[] {
  const crew = parseNum(specs.crew);
  const pass = parseNum(specs.passengers);
  const speed = parseNum(specs.maxSpeed);
  const hyper = parseNum(specs.hyperdrive);

  return [
    { etiqueta: 'Tripulación', valor: specs.crew ?? '—', num: crew ?? undefined },
    { etiqueta: 'Pasajeros', valor: specs.passengers ?? '—', num: pass ?? undefined },
    {
      etiqueta: 'Velocidad',
      valor: specs.maxSpeed ?? '—',
      num: speed ?? undefined,
      pct: speed != null ? clampPct((speed / SPEED_MAX) * 100) : undefined,
    },
    {
      etiqueta: 'Clase HI',
      valor: specs.hyperdrive ?? '—',
      pct: hyper != null ? hyperPct(hyper) : undefined,
    },
  ];
}

// ─── Celda de stat: count-up + barra de relleno, sin caja propia ────────────
function StatCelda({ etiqueta, valor, num, pct }: Stat) {
  const numRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  // Count-up del número (conserva el sufijo original: "1,050 km/h" → cuenta el 1050).
  useEffect(() => {
    const el = numRef.current;
    if (!el || num == null) return;
    const sufijo = valor.replace(/[\d.,]+/, '').trim();
    const obj = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        n: num,
        duration: 1.1,
        ease: 'power2.out',
        delay: 0.25,
        onUpdate: () => {
          const v = num % 1 === 0 ? Math.round(obj.n).toLocaleString('es') : obj.n.toFixed(1);
          el.textContent = sufijo ? `${v} ${sufijo}` : v;
        },
      });
    });
    return () => ctx.revert();
  }, [num, valor]);

  // Relleno de la barra.
  useEffect(() => {
    const el = fillRef.current;
    if (!el || pct == null) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { width: '0%' }, { width: `${pct}%`, duration: 1, ease: 'power2.out', delay: 0.25 });
    });
    return () => ctx.revert();
  }, [pct]);

  return (
    <div style={{ background: 'var(--theme-panel)', padding: '10px 12px' }}>
      <p className="text-[0.7rem]" style={{ color: 'var(--theme-fg-dim)' }}>
        {etiqueta}
      </p>
      <p
        className="text-[0.95rem] truncate tabular-nums"
        style={{ color: 'var(--theme-fg)', fontWeight: 500, marginTop: 2 }}
        title={valor}
      >
        {num != null ? <span ref={numRef}>0</span> : valor}
      </p>
      {/* Hairline de nivel: 2px, sin caja */}
      <div style={{ height: 2, marginTop: 6, background: 'var(--theme-bg-alt)' }}>
        {pct != null && (
          <div
            ref={fillRef}
            style={{
              height: '100%',
              width: 0,
              background: 'var(--theme-accent)',
              boxShadow: '0 0 8px rgba(var(--theme-accent-rgb), 0.55)',
            }}
          />
        )}
      </div>
    </div>
  );
}

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-mono, monospace)',
  letterSpacing: '0.08em',
};

// ─── Miniatura del radar ────────────────────────────────────────────────────
function Miniatura({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  const caja: React.CSSProperties = { width: 44, height: 30, flex: 'none' };

  if (!src || error) {
    return (
      <span
        className="flex items-center justify-center"
        style={{ ...caja, background: 'var(--theme-bg-alt)', color: 'var(--theme-fg-dim)' }}
      >
        <Rocket size={14} />
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      loading="lazy"
      draggable={false}
      style={{
        ...caja,
        objectFit: 'cover',
        boxShadow: '0 0 8px rgba(var(--theme-accent-rgb), 0.35)',
      }}
    />
  );
}

// ─── Radar: índice vertical (riel horizontal en pantallas angostas) ─────────
function Radar({
  naves,
  total,
  seleccionadaId,
  onSeleccionar,
  onNavegar,
}: {
  naves: Nave[];
  total: number;
  seleccionadaId: string | null;
  onSeleccionar: (n: Nave) => void;
  onNavegar: (delta: number) => void;
}) {
  // Flechas arriba/abajo mueven el objetivo sin que la página haga scroll.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    onNavegar(e.key === 'ArrowDown' ? 1 : -1);
  };

  const ocultas = total - naves.length;

  return (
    <div>
      <p className="text-[0.62rem] mb-2.5" style={{ ...MONO, color: 'var(--theme-fg-dim)' }}>
        CONTACTOS · {dosDigitos(total)}
      </p>

      {naves.length === 0 ? (
        <p className="text-xs py-2" style={{ color: 'var(--theme-fg-muted)' }}>
          Sin contactos en rango.
        </p>
      ) : (
        <ul
          role="listbox"
          tabIndex={0}
          aria-label="Contactos de la flota"
          aria-activedescendant={seleccionadaId ? `nave-${seleccionadaId}` : undefined}
          onKeyDown={onKeyDown}
          className="flex gap-2 overflow-x-auto md:flex-col md:gap-0 md:overflow-visible outline-none"
          style={{ scrollbarWidth: 'thin' }}
        >
          {naves.map((nave, i) => {
            const activa = nave.id === seleccionadaId;
            return (
              <li
                key={nave.id}
                id={`nave-${nave.id}`}
                role="option"
                aria-selected={activa}
                onClick={() => onSeleccionar(nave)}
                className="flex items-center gap-2.5 shrink-0 w-[190px] md:w-auto cursor-pointer transition-colors"
                style={{
                  padding: 8,
                  marginBottom: 2,
                  borderLeft: `3px solid ${activa ? 'var(--theme-accent)' : 'transparent'}`,
                  background: activa ? 'var(--theme-panel)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!activa) e.currentTarget.style.background = 'var(--theme-panel-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!activa) e.currentTarget.style.background = 'transparent';
                }}
              >
                <Miniatura src={nave.imagen} alt={nave.nombre} />
                <div style={{ minWidth: 0 }}>
                  <p
                    className="text-[0.81rem] truncate"
                    style={{
                      color: activa ? 'var(--theme-accent)' : 'var(--theme-fg)',
                      fontWeight: activa ? 600 : 400,
                    }}
                  >
                    {nave.nombre}
                  </p>
                  <p
                    className="text-[0.66rem] truncate"
                    style={{ ...MONO, color: 'var(--theme-fg-dim)' }}
                  >
                    {lineaTelemetria(nave, i)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Corte explícito: no hay scroll anidado, se filtra para llegar al resto */}
      {ocultas > 0 && (
        <p
          className="text-[0.6rem] mt-2"
          style={{ ...MONO, color: 'var(--theme-fg-dim)', paddingLeft: 3 }}
        >
          +{ocultas} FUERA DE PANTALLA · FILTRA
        </p>
      )}
    </div>
  );
}

// ─── Imagen del visor: crossfade con precarga + retículo que enfoca ─────────
function ImagenVisor({
  src,
  alt,
  estado,
  posicion,
  onClick,
}: {
  src: string;
  alt: string;
  estado: string;
  posicion: string;
  onClick?: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const actualRef = useRef<HTMLDivElement>(null);
  const previaRef = useRef<HTMLImageElement>(null);
  const [capas, setCapas] = useState<{ actual: string | null; previa: string | null }>({
    actual: null,
    previa: null,
  });
  const [error, setError] = useState(false);

  // Precarga: la fuente solo cambia cuando el bitmap ya está en memoria, así el
  // crossfade nunca arranca contra una imagen a medio descargar.
  useEffect(() => {
    if (!src) {
      setCapas({ actual: null, previa: null });
      return;
    }
    let cancelado = false;
    setError(false);
    const img = new window.Image();
    img.onload = () => {
      if (!cancelado) setCapas((c) => ({ actual: src, previa: c.actual }));
    };
    img.onerror = () => {
      if (!cancelado) setError(true);
    };
    img.src = src;
    return () => {
      cancelado = true;
    };
  }, [src]);

  // Fundido entre capas + las 4 esquinas entrando escaladas con desfase.
  useEffect(() => {
    if (!capas.actual) return;
    const ctx = gsap.context(() => {
      if (previaRef.current) {
        gsap.fromTo(previaRef.current, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.5, ease: 'power2.out' });
      }
      gsap.fromTo(actualRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' });
      // Revelado eléctrico: cada franja entra desde un desplazamiento alterno.
      gsap.fromTo(
        '[data-band]',
        { xPercent: (i: number) => (i % 2 === 0 ? -14 : 14), autoAlpha: 0 },
        { xPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out', stagger: 0.09 },
      );
      gsap.fromTo(
        '[data-esquina]',
        { scale: 1.65, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 0.85,
          duration: 0.45,
          ease: 'power3.out',
          stagger: 0.07,
          transformOrigin: 'center',
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [capas.actual]);

  // Glitch eléctrico intermitente (heredado de FlotaEstelar): cada cierto tiempo
  // las franjas de la imagen se desplazan en X y vuelven, con un parpadeo de
  // canal cian/magenta encima. Reutiliza las mismas franjas del revelado.
  useEffect(() => {
    if (!capas.actual || error) return;
    const root = rootRef.current;
    if (!root) return;
    let timer: ReturnType<typeof setTimeout>;
    const ctx = gsap.context(() => {
      const bands = gsap.utils.toArray<HTMLElement>('[data-band]');
      const tint = root.querySelector('[data-glitch-tint]');
      const glitch = () => {
        const tl = gsap.timeline();
        bands.forEach((b) => {
          tl.to(b, { x: gsap.utils.random(-14, 14), duration: 0.05, ease: 'none' }, 0)
            .to(b, { x: 0, duration: 0.12, ease: 'power2.out' }, 0.06);
        });
        if (tint) {
          tl.fromTo(tint, { autoAlpha: 0.65 }, { autoAlpha: 0, duration: 0.22, ease: 'power2.out' }, 0);
        }
        timer = setTimeout(glitch, gsap.utils.random(2200, 5200));
      };
      timer = setTimeout(glitch, gsap.utils.random(1400, 3000));
    }, rootRef);
    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [capas.actual, error]);

  const c = 'var(--theme-accent)';
  const esquina = (pos: React.CSSProperties, bordes: React.CSSProperties) => (
    <span
      data-esquina
      aria-hidden
      style={{ position: 'absolute', width: 26, height: 26, ...pos, ...bordes }}
    />
  );

  const clicable = Boolean(onClick) && !error && Boolean(capas.actual);

  return (
    <div
      ref={rootRef}
      onClick={clicable ? onClick : undefined}
      role={clicable ? 'button' : undefined}
      tabIndex={clicable ? 0 : undefined}
      aria-label={clicable ? `Ampliar imagen de ${alt}` : undefined}
      onKeyDown={(e) => {
        if (clicable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="relative w-full overflow-hidden group"
      style={{
        aspectRatio: '16 / 9',
        background: 'var(--theme-bg-alt)',
        borderRadius: 8,
        cursor: clicable ? 'zoom-in' : 'default',
        // Glow eléctrico alrededor de la nave (heredado de FlotaEstelar).
        boxShadow:
          '0 0 26px rgba(var(--theme-accent-rgb), 0.35), inset 0 0 40px rgba(var(--theme-accent-rgb), 0.10)',
      }}
    >
      {error || !capas.actual ? (
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: 'var(--theme-fg-dim)' }}
        >
          <ImageOff size={34} strokeWidth={1.5} />
        </span>
      ) : (
        <>
          {capas.previa && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={previaRef}
              src={capas.previa}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: 'cover' }}
              draggable={false}
            />
          )}
          {/* Capa nueva partida en franjas (revelado eléctrico) */}
          <div ref={actualRef} className="absolute inset-0">
            {Array.from({ length: REVEAL_BANDS }).map((_, i) => (
              <div
                key={`${capas.actual}-${i}`}
                data-band
                className="absolute inset-0"
                style={{
                  clipPath: `inset(${(i / REVEAL_BANDS) * 100}% 0 ${
                    ((REVEAL_BANDS - i - 1) / REVEAL_BANDS) * 100
                  }% 0)`,
                  willChange: 'transform, opacity',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={capas.actual ?? undefined}
                  alt={i === 0 ? alt : ''}
                  aria-hidden={i !== 0}
                  className="absolute inset-0 w-full h-full"
                  style={{ objectFit: 'cover' }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
          {/* Tinte de canal para el parpadeo del glitch (cian/magenta) */}
          <span
            data-glitch-tint
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: 0,
              mixBlendMode: 'screen',
              background:
                'linear-gradient(90deg, rgba(51,222,244,0.55) 0%, transparent 45%, transparent 55%, rgba(254,41,109,0.55) 100%)',
            }}
          />
        </>
      )}

      {/* Scanline HUD: banda fina que recorre el visor en loop */}
      <span
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background:
            'linear-gradient(90deg, transparent, rgba(var(--theme-accent-rgb), 0.85), transparent)',
          boxShadow: '0 0 8px rgba(var(--theme-accent-rgb), 0.6)',
          animation: 'hud-scan 5.5s linear infinite',
        }}
      />

      {/* Retículo */}
      <div className="absolute inset-0 pointer-events-none">
        {esquina({ top: 14, left: 14 }, { borderTop: `1.5px solid ${c}`, borderLeft: `1.5px solid ${c}` })}
        {esquina({ top: 14, right: 14 }, { borderTop: `1.5px solid ${c}`, borderRight: `1.5px solid ${c}` })}
        {esquina({ bottom: 14, left: 14 }, { borderBottom: `1.5px solid ${c}`, borderLeft: `1.5px solid ${c}` })}
        {esquina({ bottom: 14, right: 14 }, { borderBottom: `1.5px solid ${c}`, borderRight: `1.5px solid ${c}` })}
        {/* Cruz central */}
        <span
          data-esquina
          aria-hidden
          style={{ position: 'absolute', top: '46%', left: '50%', width: 1, height: '8%', background: c }}
        />
        <span
          data-esquina
          aria-hidden
          style={{ position: 'absolute', top: '50%', left: '47.5%', width: '5%', height: 1, background: c }}
        />
      </div>

      {/* Etiquetas mono en esquinas opuestas */}
      <span
        className="absolute text-[0.66rem]"
        style={{ ...MONO, top: 12, left: 14, color: 'var(--theme-fg-muted)', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
      >
        {estado}
      </span>
      <span
        className="absolute text-[0.66rem]"
        style={{ ...MONO, bottom: 12, right: 14, color: 'var(--theme-fg-muted)', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
      >
        {posicion}
      </span>

      {clicable && (
        <span
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,0,0,0.30)', color: '#fff' }}
        >
          <Maximize2 size={26} strokeWidth={1.75} />
        </span>
      )}
    </div>
  );
}

// ─── Visor: el objetivo fijado ──────────────────────────────────────────────
function Visor({
  nave,
  indice,
  total,
  onAmpliar,
}: {
  nave: Nave | null;
  indice: number;
  total: number;
  onAmpliar: () => void;
}) {
  const textoRef = useRef<HTMLDivElement>(null);

  // Los textos entran con un desfase mínimo POR DETRÁS de la imagen.
  useEffect(() => {
    if (!nave) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-reveal]',
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.06, delay: 0.16 },
      );
    }, textoRef);
    return () => ctx.revert();
  }, [nave?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!nave) {
    return (
      <div
        className="flex items-center justify-center text-sm"
        style={{ aspectRatio: '16 / 9', background: 'var(--theme-bg-alt)', borderRadius: 8, color: 'var(--theme-fg-muted)' }}
      >
        Ningún objetivo fijado
      </div>
    );
  }

  const badge = nave.specs.manufacturer ?? 'Origen sin registrar';

  return (
    <div>
      <ImagenVisor
        src={nave.imagen}
        alt={nave.nombre}
        estado="FIJADO"
        posicion={`${dosDigitos(indice + 1)} / ${dosDigitos(total)}`}
        onClick={onAmpliar}
      />

      <div ref={textoRef}>
        <div
          data-reveal
          className="flex items-baseline justify-between gap-3 flex-wrap"
          style={{ margin: '14px 0 4px' }}
        >
          <p
            className="text-[1.35rem] leading-tight"
            style={{ color: 'var(--theme-fg)', fontFamily: 'var(--font-orbitron)', fontWeight: 500 }}
          >
            {nave.nombre}
          </p>
          <span
            className="text-[0.7rem] truncate"
            style={{
              maxWidth: '100%',
              padding: '3px 10px',
              borderRadius: 99,
              background: 'rgba(var(--theme-accent-rgb), 0.14)',
              color: 'var(--theme-accent)',
              border: '1px solid rgba(var(--theme-accent-rgb), 0.35)',
            }}
            title={badge}
          >
            {badge}
          </span>
        </div>

        <p
          data-reveal
          className="text-[0.85rem] line-clamp-3"
          style={{ color: 'var(--theme-fg-muted)', lineHeight: 1.7, margin: '0 0 14px' }}
        >
          {nave.descripcion || 'Sin informe de inteligencia para este contacto.'}
        </p>

        {/* Stats: sin cajas — la separación son hairlines de 1px */}
        <div
          data-reveal
          className="grid grid-cols-2 sm:grid-cols-4"
          style={{ gap: 1, background: 'var(--theme-border)' }}
        >
          {statsVisor(nave.specs).map((stat) => (
            <StatCelda key={`${nave.id}-${stat.etiqueta}`} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Lightbox de la imagen fijada ───────────────────────────────────────────
function ModalImagen({ nave, onClose }: { nave: Nave; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Imagen de ${nave.nombre}`}
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center p-6"
      style={{ zIndex: 100, background: 'rgba(0,0,0,0.82)' }}
    >
      <div className="relative" style={{ maxWidth: '90vw' }} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute -top-3 -right-3 flex items-center justify-center rounded-full"
          style={{
            width: 36,
            height: 36,
            background: 'var(--theme-panel)',
            color: 'var(--theme-fg)',
            border: '1px solid var(--theme-border)',
          }}
        >
          <X size={18} />
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={nave.imagen}
          alt={nave.nombre}
          style={{ display: 'block', maxWidth: '90vw', maxHeight: '82vh', objectFit: 'contain', borderRadius: 6 }}
        />
        <p
          className="mt-3 text-center text-sm font-medium"
          style={{ color: '#fff', fontFamily: 'var(--font-orbitron)' }}
        >
          {nave.nombre}
        </p>
      </div>
    </div>
  );
}

// ─── Skeleton mientras carga el catálogo ────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse grid gap-5" style={{ gridTemplateColumns: '1fr' }}>
      <div style={{ aspectRatio: '16 / 9', background: 'var(--theme-bg-alt)', borderRadius: 8 }} />
      <div className="flex flex-col gap-2">
        <div style={{ height: 20, width: '45%', background: 'var(--theme-bg-alt)', borderRadius: 3 }} />
        <div style={{ height: 10, width: '100%', background: 'var(--theme-bg-alt)', borderRadius: 3 }} />
        <div style={{ height: 10, width: '80%', background: 'var(--theme-bg-alt)', borderRadius: 3 }} />
      </div>
    </div>
  );
}

// ─── Sección ────────────────────────────────────────────────────────────────
export default function SeccionNaves({ bg }: { bg: string }) {
  const refSeccion = useRef(null);
  const enVista = useInView(refSeccion, { once: true, margin: '-80px' });

  const [naves, setNaves] = useState<Nave[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(false);

  const [consulta, setConsulta] = useState(''); // input (inmediato)
  const [filtro, setFiltro] = useState('');     // con debounce
  const [seleccionadaId, setSeleccionadaId] = useState<string | null>(null);
  const [modalNave, setModalNave] = useState<Nave | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setCargando(true);
    setErrorCarga(false);

    cargarNaves(ctrl.signal)
      .then((lista) => {
        setNaves(lista);
        setSeleccionadaId(lista[0]?.id ?? null);
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        setErrorCarga(true);
      })
      .finally(() => setCargando(false));

    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setFiltro(consulta), 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [consulta]);

  const resultados = useMemo(() => filtrarNaves(naves, filtro), [naves, filtro]);
  // Lo que el radar realmente pinta (sin scroll anidado).
  const visibles = useMemo(() => resultados.slice(0, MAX_FILAS), [resultados]);

  // Si el objetivo fijado sale de la lista visible, se fija el primero.
  useEffect(() => {
    if (visibles.length === 0) {
      if (seleccionadaId !== null) setSeleccionadaId(null);
      return;
    }
    if (!visibles.some((n) => n.id === seleccionadaId)) {
      setSeleccionadaId(visibles[0].id);
    }
  }, [visibles, seleccionadaId]);

  const indice = visibles.findIndex((n) => n.id === seleccionadaId);
  const seleccionada = indice >= 0 ? visibles[indice] : null;

  const navegar = (delta: number) => {
    if (visibles.length === 0) return;
    const siguiente = Math.min(Math.max(indice + delta, 0), visibles.length - 1);
    setSeleccionadaId(visibles[siguiente].id);
  };

  return (
    <section id="starships" style={{ background: bg }}>
      <div className="w-full">
        <motion.div
          ref={refSeccion}
          initial={{ opacity: 0, y: 16 }}
          animate={enVista ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2
            className="text-2xl font-bold mb-1.5"
            style={{ color: 'var(--theme-fg)', fontFamily: 'var(--font-orbitron)' }}
          >
            Flota Estelar
          </h2>
          <p className="text-sm" style={{ color: 'var(--theme-fg-muted)' }}>
            El radar lista los contactos; el visor fija el objetivo. Usa las flechas ↑ ↓ para cambiar de nave.
          </p>
        </motion.div>

        {cargando ? (
          <Skeleton />
        ) : errorCarga ? (
          <div className="px-4 py-10 text-center text-sm" style={{ color: 'var(--theme-fg-muted)' }}>
            No pudimos contactar con la base de datos de la Alianza.
            <br />
            Intenta recargar la página.
          </div>
        ) : (
          <>
            {/* Dos columnas desde md: el radar queda fijo en ~200px */}
            <style>{`
              @media (min-width: 768px) {
                #starships [data-visor-grid] {
                  grid-template-columns: ${ANCHO_RADAR}px minmax(0, 1fr);
                }
              }
            `}</style>

            <div
              data-visor-grid
              className="grid items-start"
              style={{ gap: 16, gridTemplateColumns: 'minmax(0, 1fr)' }}
            >
              <div>
                {/* Buscador: es la forma de llegar a las naves fuera de pantalla */}
                <div className="relative mb-3">
                  <Search
                    size={14}
                    className="absolute top-1/2 -translate-y-1/2 left-2.5 pointer-events-none"
                    style={{ color: 'var(--theme-fg-dim)' }}
                  />
                  <input
                    type="text"
                    value={consulta}
                    onChange={(e) => setConsulta(e.target.value)}
                    placeholder="Filtrar contactos..."
                    aria-label="Filtrar contactos"
                    className="w-full text-xs outline-none pl-8 pr-2.5 py-1.5"
                    style={{
                      background: 'var(--theme-bg-alt)',
                      border: '1px solid var(--theme-border)',
                      color: 'var(--theme-fg)',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--theme-accent)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--theme-border)')}
                  />
                </div>

                <Radar
                  naves={visibles}
                  total={resultados.length}
                  seleccionadaId={seleccionadaId}
                  onSeleccionar={(n) => setSeleccionadaId(n.id)}
                  onNavegar={navegar}
                />
              </div>

              <Visor
                nave={seleccionada}
                indice={indice}
                total={visibles.length}
                onAmpliar={() => seleccionada && setModalNave(seleccionada)}
              />
            </div>
          </>
        )}
      </div>

      {modalNave && <ModalImagen nave={modalNave} onClose={() => setModalNave(null)} />}
    </section>
  );
}
