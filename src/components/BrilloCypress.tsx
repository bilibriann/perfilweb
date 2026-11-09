/**
 * Brillo del tema "Cypress": resplandores difusos que "respiran" muy lento,
 * adaptados de los de Midnight (commit 796d29d) a la paleta grafito del tema.
 *
 * Va DENTRO de una sección (no fijo a la ventana) porque cada sección de
 * Cypress pinta su propio fondo liso y taparía un brillo puesto detrás. El
 * contenedor debe tener `position: relative`, `overflow: hidden` e
 * `isolation: isolate`: así el brillo (z-index -1) queda sobre el fondo de la
 * sección pero debajo de su contenido.
 */
type Lado = 'arriba-izquierda' | 'abajo-derecha';

const POSICION: Record<Lado, React.CSSProperties> = {
  'arriba-izquierda': { top: '-12%', left: '-10%' },
  'abajo-derecha': { bottom: '-10%', right: '-8%' },
};

export default function BrilloCypress({ lado }: { lado: Lado }) {
  const principal = lado === 'arriba-izquierda';

  return (
    <div
      aria-hidden="true"
      className="brillo-cypress"
      style={{
        position: 'absolute',
        zIndex: -1,
        pointerEvents: 'none',
        width: 'min(48vw, 720px)',
        aspectRatio: '1',
        borderRadius: '50%',
        // Azul acero del acento al centro, que se funde en un azul pizarra
        // profundo y luego en transparente: tono sobre tono, sin colores ajenos.
        background: principal
          ? 'radial-gradient(circle, rgba(143,169,199,0.14) 0%, rgba(52,72,102,0.12) 40%, transparent 70%)'
          : 'radial-gradient(circle, rgba(143,169,199,0.09) 0%, rgba(52,72,102,0.10) 40%, transparent 70%)',
        filter: 'blur(70px)',
        animation: principal
          ? 'glow-breathe 14s ease-in-out infinite'
          : 'glow-breathe-2 18s ease-in-out infinite 3s',
        ...POSICION[lado],
      }}
    />
  );
}
