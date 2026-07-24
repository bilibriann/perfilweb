'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { NAVES_LOCALES } from '@/lib/starships/manifest';
import {
  cargarNaves,
  normalizar,
  specsComoLista,
  type Nave,
} from '@/lib/starships/api';
import { CanvasField } from './CanvasField';
import { useImages } from './useImages';
import { PALETA, type FlotaImagen } from './types';

// Solo 12 imágenes preliminares: la galería usa estas 12 naves (se repiten en
// el scroll infinito).
const CANTIDAD = Math.min(12, NAVES_LOCALES.length);

// ─── Pantalla de carga: contador de % + línea que se llena ──────────────────
function Cargando({ progreso }: { progreso: number }) {
  const pct = Math.round(progreso * 100);
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-4"
      style={{ background: PALETA.bg, color: PALETA.cyan, zIndex: 3 }}
    >
      <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.25em' }}>
        CARGANDO FLOTA
      </span>
      <span style={{ fontFamily: 'monospace', fontSize: '2.4rem', fontWeight: 700, color: PALETA.txt }}>
        {pct}
        <span style={{ fontSize: '1rem', color: PALETA.cyan2 }}>%</span>
      </span>
      <div style={{ position: 'relative', width: 'min(320px, 70%)', height: 2, background: 'rgba(51,222,244,0.15)' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: '100%',
            width: `${pct}%`,
            background: PALETA.cyan2,
            boxShadow: `0 0 10px ${PALETA.cyan}`,
            transition: 'width 0.2s ease-out',
          }}
        />
      </div>
    </div>
  );
}

// ─── Panel de información de la nave seleccionada (overlay sobre el revelado) ─
// pointer-events: none → un clic sobre el hero cierra el revelado (lo maneja el
// canvas), sin que este panel intercepte el evento.
function InfoNave({ nave }: { nave: Nave }) {
  const specs = specsComoLista(nave.specs);
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '4%',
        transform: 'translateX(-50%)',
        width: 'min(680px, 92%)',
        zIndex: 4,
        pointerEvents: 'none',
        background: 'rgba(1,1,42,0.72)',
        border: `1px solid ${PALETA.cyan}`,
        borderRadius: 8,
        padding: '1rem 1.25rem',
        backdropFilter: 'blur(6px)',
        color: PALETA.txt,
        boxShadow: `0 0 24px rgba(51,222,244,0.25)`,
      }}
    >
      <h3
        style={{
          fontFamily: 'monospace',
          fontSize: '1.05rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: PALETA.cyan,
          marginBottom: nave.descripcion || specs.length ? '0.5rem' : 0,
        }}
      >
        {nave.nombre.toUpperCase()}
      </h3>

      {nave.descripcion && (
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: '0.74rem',
            lineHeight: 1.6,
            color: 'rgba(232,241,255,0.82)',
            margin: 0,
            marginBottom: specs.length ? '0.75rem' : 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {nave.descripcion}
        </p>
      )}

      {specs.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.4rem 1rem',
          }}
        >
          {specs.map(({ etiqueta, valor }) => (
            <div key={etiqueta} style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.56rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: PALETA.cyan2,
                }}
              >
                {etiqueta}
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.74rem', color: PALETA.txt }}>
                {valor}
              </span>
            </div>
          ))}
        </div>
      ) : (
        !nave.descripcion && (
          <p style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'rgba(232,241,255,0.6)', margin: 0 }}>
            Sin datos adicionales de esta nave.
          </p>
        )
      )}

      <p
        style={{
          fontFamily: 'monospace',
          fontSize: '0.58rem',
          letterSpacing: '0.14em',
          color: PALETA.cyan2,
          marginTop: '0.75rem',
          marginBottom: 0,
        }}
      >
        CLIC / ESC PARA VOLVER
      </p>
    </div>
  );
}

export default function FlotaEstelar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motorRef = useRef<CanvasField | null>(null);

  const imagenes = useMemo<FlotaImagen[]>(
    () =>
      NAVES_LOCALES.slice(0, CANTIDAD).map((n) => ({
        src: `/ship/${encodeURIComponent(n.archivo)}`,
        nombre: n.nombre,
      })),
    [],
  );

  const { cargadas, progreso, listo } = useImages(imagenes);

  // Catálogo con info (descripción + specs) indexado por nombre normalizado.
  const [porNombre, setPorNombre] = useState<Map<string, Nave>>(new Map());
  // Nombre de la nave seleccionada (revelada) o null.
  const [seleccion, setSeleccion] = useState<string | null>(null);

  // Carga la info de las naves una sola vez (las imágenes ya son locales).
  useEffect(() => {
    const ctrl = new AbortController();
    cargarNaves(ctrl.signal)
      .then((lista) => {
        const mapa = new Map<string, Nave>();
        for (const n of lista) mapa.set(normalizar(n.nombre), n);
        setPorNombre(mapa);
      })
      .catch(() => {
        /* Info opcional: si falla, se muestra el revelado sin panel de datos. */
      });
    return () => ctrl.abort();
  }, []);

  useEffect(() => {
    if (!listo || !canvasRef.current || cargadas.length === 0) return;
    const motor = new CanvasField(canvasRef.current, cargadas, setSeleccion);
    motorRef.current = motor;
    motor.start();
    return () => {
      motor.destroy();
      motorRef.current = null;
    };
  }, [listo, cargadas]);

  // Siempre hay panel cuando algo está seleccionado: si la API no trajo datos,
  // se usa un mínimo con el nombre (evita que el revelado quede sin etiqueta).
  const naveSeleccionada: Nave | undefined = seleccion
    ? porNombre.get(normalizar(seleccion)) ?? {
        id: normalizar(seleccion),
        nombre: seleccion,
        descripcion: '',
        imagen: '',
        specs: {},
      }
    : undefined;

  return (
    <div
      id="flota"
      className="absolute inset-0 overflow-hidden"
    >
      {listo && cargadas.length > 0 && (
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Enjambre de naves estelares. Pasa el cursor para enfocar y haz clic en una nave para revelarla."
          style={{ width: '100%', height: '100%', display: 'block', touchAction: 'manipulation' }}
        />
      )}
      {naveSeleccionada && <InfoNave nave={naveSeleccionada} />}
      {!listo && <Cargando progreso={progreso} />}
    </div>
  );
}
