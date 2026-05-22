'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const ENLACES_NAV = [
  { etiqueta: 'About', enlace: '#about' },
  { etiqueta: 'Stack', enlace: '#stack' },
  { etiqueta: 'Projects', enlace: '#projects' },
  { etiqueta: 'Experience', enlace: '#experience' },
];

export default function BarraNavegacion() {
  const [desplazado, setDesplazado] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const alDesplazar = () => setDesplazado(window.scrollY > 24);
    window.addEventListener('scroll', alDesplazar);
    return () => window.removeEventListener('scroll', alDesplazar);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
        desplazado ? 'bg-[#07090f] border-b border-[#1a2535]' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <nav className="hidden md:flex items-center gap-8">
          {ENLACES_NAV.map(({ etiqueta, enlace }) => (
            <a
              key={enlace}
              href={enlace}
              className="text-sm text-[#5a7080] hover:text-[#f0f4f8] transition-colors"
            >
              {etiqueta}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium border border-[#00FFD4]/25 text-[#00FFD4] hover:bg-[#00FFD4]/8 transition-colors"
        >
          Contacto
        </a>

        <button
          onClick={() => setAbierto(!abierto)}
          className="md:hidden text-[#5a7080] hover:text-[#f0f4f8]"
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
            className="md:hidden bg-[#0c1520] border-b border-[#1a2535] overflow-hidden"
          >
            <nav className="px-6 py-5 flex flex-col gap-4">
              {ENLACES_NAV.map(({ etiqueta, enlace }) => (
                <a
                  key={enlace}
                  href={enlace}
                  onClick={() => setAbierto(false)}
                  className="text-[#5a7080] hover:text-[#f0f4f8] transition-colors"
                >
                  {etiqueta}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setAbierto(false)}
                className="mt-1 text-center py-2 border border-[#00FFD4]/25 text-[#00FFD4] text-sm"
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
