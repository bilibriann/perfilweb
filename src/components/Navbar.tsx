'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BarraNavegacion() {
  const [desplazado, setDesplazado] = useState(false);

  // El panel de contacto dejó de ser emergente: ahora la presentación vive en
  // el hero, así que el burger sube ahí en vez de abrir/cerrar nada.
  const irAlInicio = () =>
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });

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
      className="fixed top-0 inset-x-0 z-[300] transition-all duration-200"
      style={desplazado ? {
        background: 'var(--theme-panel)',
        borderBottom: '1px solid var(--theme-border)',
        backdropFilter: 'blur(12px)',
      } : {}}
    >
      <div className="w-full pl-6 pr-4 h-16 flex items-center justify-end">
        {/* Burger de sables de luz: vuelve al inicio */}
        <button
          type="button"
          className="burger"
          onClick={irAlInicio}
          aria-label="Ir al inicio"
        >
          <span className="bun top" />
          <span className="filling" />
          <span className="bun bottom" />
        </button>
      </div>
    </motion.header>
  );
}
