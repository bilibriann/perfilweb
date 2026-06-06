'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const ENLACES_NAV = [
  { etiqueta: 'About',      enlace: '#about' },
  { etiqueta: 'Stack',      enlace: '#stack' },
  { etiqueta: 'Projects',   enlace: '#projects' },
  { etiqueta: 'Experience', enlace: '#experience' },
];

export default function BarraNavegacion() {
  const [desplazado, setDesplazado] = useState(false);
  const [abierto,    setAbierto]    = useState(false);

  useEffect(() => {
    const onScroll = () => setDesplazado(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 inset-x-0 z-50 transition-all duration-200"
      style={desplazado ? {
        background: 'var(--theme-panel)',
        borderBottom: '1px solid var(--theme-border)',
        backdropFilter: 'blur(12px)',
      } : {}}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <nav className="hidden md:flex items-center gap-8">
          {ENLACES_NAV.map(({ etiqueta, enlace }) => (
            <a
              key={enlace}
              href={enlace}
              className="text-sm transition-colors"
              style={{ color: 'var(--theme-fg-muted)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--theme-fg)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--theme-fg-muted)')}
            >
              {etiqueta}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium transition-colors"
          style={{
            border: '1px solid rgba(var(--theme-accent-rgb), 0.3)',
            color: 'var(--theme-accent)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(var(--theme-accent-rgb), 0.08)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent'
          }}
        >
          Contacto
        </a>

        <button
          onClick={() => setAbierto(!abierto)}
          className="md:hidden transition-colors"
          style={{ color: 'var(--theme-fg-muted)' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--theme-fg)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--theme-fg-muted)')}
          aria-label="Abrir menú"
        >
          {abierto ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
            style={{
              background: 'var(--theme-panel)',
              borderBottom: '1px solid var(--theme-border)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <nav className="px-6 py-5 flex flex-col gap-4">
              {ENLACES_NAV.map(({ etiqueta, enlace }) => (
                <a
                  key={enlace}
                  href={enlace}
                  onClick={() => setAbierto(false)}
                  className="transition-colors"
                  style={{ color: 'var(--theme-fg-muted)' }}
                >
                  {etiqueta}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setAbierto(false)}
                className="mt-1 text-center py-2 text-sm transition-colors"
                style={{
                  border: '1px solid rgba(var(--theme-accent-rgb), 0.3)',
                  color: 'var(--theme-accent)',
                }}
              >
                Contacto
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
