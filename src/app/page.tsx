'use client';

import { useTheme } from '@/themes/ThemeContext';
import BarraNavegacion from '@/components/Navbar';
import Inicio from '@/components/Hero';
import SeccionProyectos from '@/components/Projects';
import Flota from '@/components/Flota';
import PieDePagina from '@/components/Footer';

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

export default function Pagina() {
  const { theme } = useTheme();
  const isMain = theme.id === 'main';

  return (
    <>
      {/* Navbar fuera de <main>: así su z-index no queda atrapado en el
          stacking context propio de main (z-index: 1). */}
      <BarraNavegacion />

      <main className="min-h-screen overflow-x-hidden relative" style={{ zIndex: 1 }}>
        {/* Hero: presentación + ventana de contacto, ambas al cargar. */}
        <Inicio />

        <div style={isMain ? MAIN_PROJECTS : undefined}>
          <SeccionProyectos bg={S} />
        </div>

        {/* La flota (API de naves) cierra el contenido, antes del pie. */}
        <Flota bg={S} />

        <div style={isMain ? MAIN_FOOTER : undefined}>
          <PieDePagina bg={S} />
        </div>
      </main>
    </>
  );
}
