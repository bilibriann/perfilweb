'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import styles from './ContactPanel.module.css';
import GlitchImage from '@/components/flota/GlitchImage';
import {
  RETRASO_ENTRADA,
  animarEntrada,
  prepararEntrada,
  useEntradaLayout,
} from '@/lib/anim';
import {
  cargarNaves,
  filtrarNaves,
  type Nave,
  type EspecificacionesNave,
} from '@/lib/starships/api';

const dosDigitos = (n: number): string => String(n).padStart(2, '0');

/** Cada cuánto el visor salta solo a otra nave al azar. */
const AUTO_MS = 6000;

/** Línea mono secundaria de cada fila: telemetría derivada de specs reales. */
function lineaTelemetria(nave: Nave, indice: number): string {
  const { hyperdrive, crew, model } = nave.specs;
  const partes: string[] = [];
  if (hyperdrive) partes.push(`HI ${hyperdrive}`);
  if (crew) partes.push(`TRIP ${crew}`);
  if (partes.length === 0 && model) partes.push(model.toUpperCase());
  if (partes.length === 0) partes.push('SIN TELEMETRÍA');
  return `NV-${dosDigitos(indice + 1)} · ${partes.join(' · ')}`;
}

interface StatItem {
  label: string;
  value: string;
  icon: ReactNode;
}

/** Las 4 celdas de estadísticas del visor (lo que falta se muestra como "—"). */
function statsVisor(specs: EspecificacionesNave): StatItem[] {
  return [
    { label: 'Tripulación', value: specs.crew ?? '—', icon: <CrewIcon /> },
    {
      label: 'Pasajeros',
      value: specs.passengers ?? '—',
      icon: <PassengersIcon />,
    },
    { label: 'Velocidad', value: specs.maxSpeed ?? '—', icon: <SpeedIcon /> },
    { label: 'Clase HI', value: specs.hyperdrive ?? '—', icon: <ShieldIcon /> },
  ];
}

// ── Iconos SVG inline ────────────────────────────────────────────────────────

/** Tamaño de icono en rem: sigue la raíz fluida en vez de anclarse a px, para
    que los iconos crezcan junto al resto del panel en monitores grandes. */
const dim = (n: number) => ({
  style: { width: `${n / 16}rem`, height: `${n / 16}rem` },
});

const svgBase = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function ImageMarkerIcon({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <svg {...dim(size)} viewBox="0 0 24 24" className={className} {...svgBase}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}
function ContactsIcon() {
  return (
    <svg
      {...dim(20)}
      viewBox="0 0 24 24"
      className={styles.listHeadIcon}
      {...svgBase}
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5.5a3 3 0 0 1 0 5.6M18 20a6 6 0 0 0-3-5.2" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg
      {...dim(15)}
      viewBox="0 0 24 24"
      className={styles.searchIcon}
      {...svgBase}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" />
    </svg>
  );
}
function ChevronRight({ className }: { className?: string }) {
  return (
    <svg {...dim(16)} viewBox="0 0 24 24" className={className} {...svgBase}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg {...dim(16)} viewBox="0 0 24 24" {...svgBase}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg {...dim(12)} viewBox="0 0 24 24" {...svgBase}>
      <path d="M12 17v5" />
      <path d="M9 3h6l-1 7 3 3H7l3-3-1-7z" />
    </svg>
  );
}
function EmblemIcon() {
  return (
    <svg
      {...dim(26)}
      viewBox="0 0 24 24"
      className={styles.manufIcon}
      {...svgBase}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18" strokeWidth={1} />
    </svg>
  );
}
function CrewIcon() {
  return (
    <svg {...dim(20)} viewBox="0 0 24 24" {...svgBase}>
      <path d="M12 2c2.5 2.5 3.5 5.5 3.5 9 0 2-1.5 4-3.5 6-2-2-3.5-4-3.5-6C8.5 7.5 9.5 4.5 12 2z" />
      <path d="M8.5 13L5 16l1 3 3-1.5M15.5 13L19 16l-1 3-3-1.5" />
      <circle cx="12" cy="9" r="1.4" />
    </svg>
  );
}
function PassengersIcon() {
  return (
    <svg {...dim(20)} viewBox="0 0 24 24" {...svgBase}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5.5a3 3 0 0 1 0 5.6M18 20a6 6 0 0 0-3-5.2" />
    </svg>
  );
}
function SpeedIcon() {
  return (
    <svg {...dim(20)} viewBox="0 0 24 24" {...svgBase}>
      <path d="M4 15a8 8 0 0 1 16 0" />
      <path d="M12 15l4-4" />
      <circle cx="12" cy="15" r="1" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg {...dim(20)} viewBox="0 0 24 24" {...svgBase}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg {...dim(18)} viewBox="0 0 24 24" {...svgBase} strokeWidth={2}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
function ZoomIcon() {
  return (
    <svg {...dim(26)} viewBox="0 0 24 24" {...svgBase} strokeWidth={1.75}>
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}

/** Marco de foco rojo/rosa (el "objetivo fijado" del enjambre). */
function LockFrame() {
  return (
    <span className={styles.lockFrame} aria-hidden>
      <span className={`${styles.lockCorner} ${styles.lockTL}`} />
      <span className={`${styles.lockCorner} ${styles.lockTR}`} />
      <span className={`${styles.lockCorner} ${styles.lockBL}`} />
      <span className={`${styles.lockCorner} ${styles.lockBR}`} />
    </span>
  );
}

// ── Lightbox de la imagen fijada ────────────────────────────────────────────
function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
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
      aria-label={`Imagen de ${alt}`}
      className={styles.lightbox}
      onClick={onClose}
    >
      <div
        className={styles.lightboxInner}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className={styles.lightboxClose}
        >
          <XIcon />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={styles.lightboxImg}
          draggable={false}
        />
        <p className={styles.lightboxCaption}>{alt}</p>
      </div>
    </div>
  );
}

// ── Miniatura del radar: imagen real con el glitch del enjambre ─────────────
function Thumb({ src, alt }: { src: string; alt: string }) {
  return (
    <span className={styles.thumb}>
      <GlitchImage
        src={src}
        alt={alt}
        className={styles.thumbCanvas}
        glitchOnLoad={false}
        fallback={
          <ImageMarkerIcon size={16} className={styles.markerFallback} />
        }
      />
    </span>
  );
}

// ── Visor: imagen principal con efectos + FIJADO + nombre + contador/nav ────
function Visor({
  nave,
  posicion,
  total,
  auto,
  onOpen,
  onPrev,
  onNext,
}: {
  nave: Nave;
  posicion: number;
  total: number;
  auto: boolean;
  onOpen: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const clickable = Boolean(nave.imagen);
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      data-reveal
      className={`${styles.visor} ${clickable ? styles.clickable : ''}`}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? `Ampliar imagen de ${nave.nombre}` : undefined}
      onClick={clickable ? onOpen : undefined}
      onKeyDown={(e) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <GlitchImage
        key={nave.id}
        src={nave.imagen}
        alt={nave.nombre}
        className={styles.visorCanvas}
        fit="contain"
        fallback={
          <span className={styles.markerFallback}>
            <ImageMarkerIcon size={28} />
          </span>
        }
      />

      {clickable && <LockFrame key={`lock-${nave.id}`} />}

      <span className={styles.status}>
        <PinIcon /> Fijado
      </span>
      {clickable && <span className={styles.lockLabel}>{nave.nombre}</span>}

      <div className={styles.nav}>
        {auto && (
          <span className={styles.autoPill} title="Rastreo automático">
            <span className={styles.autoDot} aria-hidden /> AUTO
          </span>
        )}
        <span className={styles.counter}>
          {dosDigitos(posicion)} / {dosDigitos(total)}
        </span>
        <button
          type="button"
          className={styles.navBtn}
          aria-label="Anterior"
          onClick={(e) => {
            stop(e);
            onPrev();
          }}
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          className={styles.navBtn}
          aria-label="Siguiente"
          onClick={(e) => {
            stop(e);
            onNext();
          }}
        >
          <ChevronRight />
        </button>
      </div>

      {clickable && (
        <span className={styles.zoomHint} aria-hidden>
          <ZoomIcon />
        </span>
      )}
    </div>
  );
}

// ── Componente ──────────────────────────────────────────────────────────────
export default function ContactPanel() {
  const [naves, setNaves] = useState<Nave[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [consulta, setConsulta] = useState('');
  const [auto, setAuto] = useState(true);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setCargando(true);
    setErrorCarga(false);
    cargarNaves(ctrl.signal)
      .then((lista) => {
        setNaves(lista);
        setSelectedId(lista[0]?.id ?? null);
      })
      .catch((err: unknown) => {
        if ((err as { name?: string })?.name === 'AbortError') return;
        setErrorCarga(true);
      })
      .finally(() => setCargando(false));
    return () => ctrl.abort();
  }, []);

  // Entrada al cargar: la misma cascada que el burger le da al panel de
  // contacto. Corre cuando la flota ya está en pantalla, no antes, porque
  // hasta entonces solo existe el texto de "Cargando flota…".
  useEntradaLayout(() => {
    if (cargando || errorCarga || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      prepararEntrada(items);
      animarEntrada(items, { delay: RETRASO_ENTRADA });
    }, rootRef);
    return () => ctx.revert();
  }, [cargando, errorCarga]);

  const lista = useMemo(() => filtrarNaves(naves, consulta), [naves, consulta]);
  const selected = useMemo(
    () => naves.find((n) => n.id === selectedId) ?? lista[0] ?? null,
    [naves, selectedId, lista],
  );
  const index = useMemo(
    () => lista.findIndex((n) => n.id === selected?.id),
    [lista, selected],
  );

  // Rastreo automático: el visor salta solo a otra nave al azar. Cambiar el id
  // remonta el <GlitchImage key={nave.id}>, así que cada salto trae su glitch.
  // Se detiene en cuanto el visitante toma el control (lista, flechas, zoom):
  // pelear contra el usuario es peor que no tener la animación.
  useEffect(() => {
    if (!auto || modalOpen || lista.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = window.setInterval(() => {
      setSelectedId((actual) => {
        const otras = lista.filter((n) => n.id !== actual);
        if (otras.length === 0) return actual;
        return otras[Math.floor(Math.random() * otras.length)].id;
      });
    }, AUTO_MS);

    return () => window.clearInterval(id);
  }, [auto, modalOpen, lista]);

  const irA = (delta: number) => {
    if (lista.length === 0) return;
    setAuto(false);
    const base = index >= 0 ? index : 0;
    const next = Math.min(Math.max(base + delta, 0), lista.length - 1);
    setSelectedId(lista[next].id);
    btnRefs.current[next]?.focus();
  };

  const onListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    irA(e.key === 'ArrowDown' ? 1 : -1);
  };

  if (cargando) {
    return (
      <div className={styles.container}>
        <p className={styles.state}>Cargando flota…</p>
      </div>
    );
  }

  if (errorCarga || !selected) {
    return (
      <div className={styles.container}>
        <p className={styles.state}>
          No se pudo contactar con la base de datos de la flota.
        </p>
      </div>
    );
  }

  const badge = selected.specs.manufacturer ?? 'Origen sin registrar';

  return (
    <div className={styles.container} ref={rootRef}>
      {/* Columna izquierda: tarjeta de contactos */}
      <aside data-reveal className={styles.listCard}>
        <div className={styles.listHead}>
          <span className={styles.countPill}>{naves.length}</span>
        </div>
        <ul className={styles.list} onKeyDown={onListKeyDown}>
          {lista.map((n, i) => {
            const isSel = n.id === selected.id;
            return (
              <li key={n.id}>
                <button
                  type="button"
                  ref={(el) => {
                    btnRefs.current[i] = el;
                  }}
                  aria-pressed={isSel}
                  className={`${styles.item} ${isSel ? styles.itemSelected : ''}`}
                  onClick={() => {
                    setAuto(false);
                    setSelectedId(n.id);
                  }}
                >
                  <Thumb src={n.imagen} alt={n.nombre} />
                  <span className={styles.textBlock}>
                    <span className={styles.name}>{n.nombre}</span>
                    <span className={styles.meta}>{lineaTelemetria(n, i)}</span>
                  </span>
                  <ChevronRight className={styles.itemChevron} />
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Columna derecha: tarjeta de detalle */}
      <section className={styles.detailCard}>
        <Visor
          nave={selected}
          posicion={(index >= 0 ? index : 0) + 1}
          total={lista.length}
          auto={auto}
          onOpen={() => {
            setAuto(false);
            setModalOpen(true);
          }}
          onPrev={() => irA(-1)}
          onNext={() => irA(1)}
        />

        <div className={styles.detailBody}>
          <div className={styles.detailTop}>
            <div data-reveal className={styles.titleBlock}>
              <h2 className={styles.title}>{selected.nombre}</h2>
              <span className={styles.titleRule} />
              <p className={styles.description}>
                {selected.descripcion ||
                  'Sin informe de inteligencia para este contacto.'}
              </p>
            </div>

            <div data-reveal className={styles.manufCard}>
              <EmblemIcon />
              <span className={styles.manufText}>{badge}</span>
            </div>
          </div>

          <div className={styles.stats}>
            {statsVisor(selected.specs).map((s) => (
              <div key={s.label} data-reveal className={styles.cell}>
                <span className={styles.statIcon}>{s.icon}</span>
                <div className={styles.statLabel}>{s.label}</div>
                <div className={styles.statValue}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {modalOpen && (
        <Lightbox
          src={selected.imagen}
          alt={selected.nombre}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
