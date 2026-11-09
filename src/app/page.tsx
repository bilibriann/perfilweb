'use client';

import { useTheme } from '@/themes/ThemeContext';
// Oculto por el momento: el navbar solo contenia el burger (ir al inicio) y
// no tiene utilidad ahora. Descomenta este import y el bloque de abajo.
// import BarraNavegacion from '@/components/Navbar';
import Inicio from '@/components/Hero';
import SeccionProyectos from '@/components/Projects';
// Oculto por el momento: la seccion de la flota (API de naves de Star Wars).
// Para volver a mostrarla, descomenta este import y el bloque de abajo.
// import Flota from '@/components/Flota';
// Oculto por el momento: el pie de página. Descomenta este import y el bloque
// de abajo para restaurarlo.
// import PieDePagina from '@/components/Footer';
import DataWaveDivider from '@/components/DataWaveDivider';
import BrilloCypress from '@/components/BrilloCypress';

// Secciones transparentes: el único starfield fijo (GalaxyBackground) se ve
// igual en TODA la página. Antes era `var(--theme-surface)` (rgba oscuro al
// 80%), que oscurecía proyectos/contacto y creaba una costura con el hero.
const S = 'transparent';

// --- Tema "main": una paleta por sección ------------------------------------
// Cada sección redefine localmente las variables de tema. Las secciones oscuras
// (café / verde) dejan pasar el Matrix rain; las claras (vainilla / mandarina)
// invierten el texto a oscuro para mantener el contraste.

const MAIN_PROJECTS = {
  '--theme-surface': 'rgba(44,87,69,0.86)',      // Brunswick Green
  '--theme-bg-alt': 'rgba(30,62,49,0.90)',
  '--theme-panel': 'rgba(36,70,58,0.90)',
  '--theme-panel-hover': 'rgba(44,87,69,0.95)',
  '--theme-fg': '#EBE3A7',                        // Vanilla
  '--theme-fg-muted': 'rgba(235,227,167,0.72)',
  '--theme-fg-dim': 'rgba(235,227,167,0.50)',
  '--theme-border': 'rgba(235,227,167,0.18)',
  '--theme-border-hover': 'rgba(235,125,0,0.60)',
  '--theme-accent': '#EB7D00',                    // Tangerine
  '--theme-accent-rgb': '235,125,0',
  '--theme-accent-on': '#2E2910',
} as React.CSSProperties;

const MAIN_FOOTER = {
  '--theme-surface': '#EB7D00',                   // Tangerine (claro)
  '--theme-bg-alt': '#d97400',
  '--theme-panel': '#d97400',
  '--theme-panel-hover': '#c76a00',
  '--theme-fg': '#2E2910',                        // Drab Dark Brown (texto oscuro)
  '--theme-fg-muted': 'rgba(46,41,16,0.80)',
  '--theme-fg-dim': 'rgba(46,41,16,0.62)',
  '--theme-border': 'rgba(46,41,16,0.28)',
  '--theme-border-hover': 'rgba(46,41,16,0.50)',
  '--theme-accent': '#2C5745',                    // Brunswick Green (acento)
  '--theme-accent-rgb': '44,87,69',
  '--theme-accent-on': '#EBE3A7',
} as React.CSSProperties;

// --- Tema "cypress": fondos lisos por sección -------------------------------
// (Paleta grafito; los nombres conservan el id del tema.)
const CYPRESS_HERO = '#0D1117';     // grafito más oscuro, primera página
const CYPRESS_PROJECTS = '#222934'; // grafito más claro, proyectos
// Contenedor de cada sección con brillo: recorta el resplandor a la sección y
// crea su propio contexto de apilamiento (ver BrilloCypress).
const CYPRESS_CAPA: React.CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  isolation: 'isolate',
};

export default function Pagina() {
  const { theme } = useTheme();
  const isMain = theme.id === 'main';
  // Tema "Cypress": fondo liso, con la línea wave separando las secciones.
  const conWave = theme.id === 'cypress';

  return (
    <>
      {/* Oculto por el momento. Iba fuera de <main> para que su z-index no
          quedara atrapado en el stacking context propio de main (z-index: 1). */}
      {/* <BarraNavegacion /> */}

      <main className="min-h-screen overflow-x-hidden relative" style={{ zIndex: 1 }}>
        {/* Hero: presentación + ventana de contacto, ambas al cargar. */}
        {/* En Cypress el hero va en un tono más oscuro que el verde del resto. */}
        <div style={conWave ? { ...CYPRESS_CAPA, background: CYPRESS_HERO } : undefined}>
          {conWave && <BrilloCypress lado="arriba-izquierda" />}
          <Inicio />
        </div>

        {/* La onda es la frontera: arriba el tono del hero, abajo el verde de
            proyectos, y el límite entre ambos se mueve con la línea. */}
        {conWave && (
          <DataWaveDivider topColor={CYPRESS_HERO} bottomColor={CYPRESS_PROJECTS} />
        )}

        <div style={isMain ? MAIN_PROJECTS : conWave ? CYPRESS_CAPA : undefined}>
          {conWave && <BrilloCypress lado="abajo-derecha" />}
          <SeccionProyectos bg={S} />
        </div>

        {/* Oculta por el momento: la flota (API de naves) cerraba el contenido
            antes del pie. Descomentar junto con su import para restaurarla. */}
        {/* <Flota bg={S} /> */}

        {/* Oculto por el momento: el pie de página (en ambos temas), junto con
            la línea wave que lo separaba en Cypress. Para restaurarlos,
            descomenta este bloque y el import de PieDePagina. */}
        {/* {conWave && <DataWaveDivider />}

        <div style={isMain ? MAIN_FOOTER : undefined}>
          <PieDePagina bg={S} />
        </div> */}
      </main>
    </>
  );
}
