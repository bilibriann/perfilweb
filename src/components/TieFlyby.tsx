'use client';

// ─── Efecto ambiental: patrullas de cazas TIE cruzando en diagonal ──────────
// Capa decorativa para el Hero. Las naves entran por arriba-izquierda y salen
// por abajo-derecha, a distintas velocidades/tamaños (parallax) y con huecos
// entre pasadas → sensación "ocasional y elegante". No interactúa con el mouse.

interface Config {
  top: string;      // carril vertical de arranque
  escala: number;   // tamaño relativo (profundidad)
  opacidad: number; // más tenue = más lejos
  rot: number;      // grados, alinea el morro con la diagonal
  duracion: number; // s (incluye la pausa fuera de pantalla)
  retardo: number;  // s (negativo = desfasa el arranque)
}

// 3 carriles: uno cercano y rápido, uno medio, uno lejano y lento.
const NAVES: Config[] = [
  { top: '-6%', escala: 0.70, opacidad: 0.80, rot: 20, duracion: 13, retardo: -2 },
  { top: '20%', escala: 0.34, opacidad: 0.42, rot: 14, duracion: 23, retardo: -9 },
  { top: '44%', escala: 0.52, opacidad: 0.62, rot: 18, duracion: 17, retardo: -14 },
];

export default function TieFlyby() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {NAVES.map((n, i) => (
        <span
          key={i}
          className="tie-flyby-ship"
          style={
            {
              position: 'absolute',
              left: 0,
              top: n.top,
              '--tie-opacity': n.opacidad,
              animationDuration: `${n.duracion}s`,
              animationDelay: `${n.retardo}s`,
            } as React.CSSProperties
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/patrol-caza.png"
            alt=""
            style={{
              display: 'block',
              width: `${Math.round(n.escala * 340)}px`,
              transform: `rotate(${n.rot}deg)`,
              filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.55))',
            }}
          />
        </span>
      ))}
    </div>
  );
}
