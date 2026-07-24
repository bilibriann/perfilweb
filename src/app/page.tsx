'use client';

import { useRef, useState } from 'react';
import { useTheme } from '@/themes/ThemeContext';
import BarraNavegacion from '@/components/Navbar';
import Inicio from '@/components/Hero';
import SeccionProyectos from '@/components/Projects';
import Contacto from '@/components/Contact';
import PieDePagina from '@/components/Footer';
import ContactPanel, { ContactPanelHandle } from '@/components/ContactPanel';

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

const MAIN_CONTACT = {
  '--theme-surface': '#EBE3A7',                   // Vanilla (claro)
  '--theme-bg-alt': '#e0d78c',
  '--theme-panel': '#f3edc4',
  '--theme-panel-hover': '#eae2a0',
  '--theme-fg': '#2E2910',                        // Drab Dark Brown (texto oscuro)
  '--theme-fg-muted': 'rgba(46,41,16,0.72)',
  '--theme-fg-dim': 'rgba(46,41,16,0.50)',
  '--theme-border': 'rgba(46,41,16,0.20)',
  '--theme-border-hover': 'rgba(44,87,69,0.70)',
  '--theme-accent': '#2C5745',                    // Brunswick Green (acento)
  '--theme-accent-rgb': '44,87,69',
  '--theme-accent-on': '#EBE3A7',
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
  const panelRef = useRef<ContactPanelHandle>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const { theme } = useTheme();
  const isMain = theme.id === 'main';

  // Toggle del burger: abre/cierra el panel de contacto existente.
  const toggleContact = () => {
    if (contactOpen) {
      panelRef.current?.close();      // onClose sincroniza contactOpen -> false
    } else {
      panelRef.current?.open();
      setContactOpen(true);
    }
  };

  return (
    <>
      {/* onClose mantiene el burger en sync si el panel se cierra por X / overlay / Escape */}
      <ContactPanel ref={panelRef} onClose={() => setContactOpen(false)} />

      {/* Navbar fuera de <main>: así su z-index compite con el panel de contacto
          (main tiene su propio stacking context con z-index:1). */}
      <BarraNavegacion onContactClick={toggleContact} contactOpen={contactOpen} />

      <main className="min-h-screen overflow-x-hidden relative" style={{ zIndex: 1 }}>
        <Inicio />

        <div style={isMain ? MAIN_PROJECTS : undefined}>
          <SeccionProyectos bg={S} />
        </div>
        <div style={isMain ? MAIN_CONTACT : undefined}>
          <Contacto bg={S} />
        </div>
        <div style={isMain ? MAIN_FOOTER : undefined}>
          <PieDePagina bg={S} />
        </div>
      </main>
    </>
  );
}
