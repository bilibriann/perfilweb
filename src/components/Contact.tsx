'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

interface EnlaceSocial {
  Icono: React.ElementType;
  etiqueta: string;
  valor: string;
  enlace: string;
  color: string;
}

const ENLACES_SOCIALES: EnlaceSocial[] = [
  {
    Icono: Github,
    etiqueta: 'GitHub',
    valor: 'github.com/bilibriann',
    enlace: 'https://github.com/bilibriann',
    color: '#f0f4f8',
  },
  {
    Icono: Linkedin,
    etiqueta: 'LinkedIn',
    valor: 'linkedin.com/brian-vilches',
    enlace: 'https://linkedin.com/in/brian-vilches/',
    color: '#38bdf8',
  },
  {
    Icono: Mail,
    etiqueta: 'Email',
    valor: 'b.vilchesm@gmail.com',
    enlace: 'mailto:b.vilchesm@gmail.com',
    color: '#00FFD4',
  },
];

export default function Contacto({ bg }: { bg: string }) {
  const refSeccion = useRef(null);
  const enVista = useInView(refSeccion, { once: true, margin: '-80px' });

  return (
    <section id="contact" className="py-24" style={{ background: bg }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={refSeccion}
          initial={{ opacity: 0, y: 16 }}
          animate={enVista ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-[#f0f4f8] mb-3">Contacto</h2>
          <div className="h-0.5 w-10" style={{ background: '#00FFD4' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={enVista ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          <p className="text-[#5a7080] text-xs mb-1">O encuéntrame en:</p>

          {ENLACES_SOCIALES.map(({ Icono, etiqueta, valor, enlace, color }) => (
            <a
              key={etiqueta}
              href={enlace}
              target={enlace.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 transition-colors"
              style={{ border: '1px solid #1a2535', background: '#111c2b' }}
              onMouseEnter={e =>
                ((e.currentTarget as HTMLElement).style.borderColor = '#253040')
              }
              onMouseLeave={e =>
                ((e.currentTarget as HTMLElement).style.borderColor = '#1a2535')
              }
            >
              <div
                className="w-9 h-9 flex items-center justify-center shrink-0"
                style={{ border: '1px solid #1a2535', background: '#0c1520', color }}
              >
                <Icono size={16} />
              </div>
              <div>
                <div className="text-[#5a7080] text-xs">{etiqueta}</div>
                <div className="text-[#f0f4f8] text-sm">{valor}</div>
              </div>
            </a>
          ))}

          <div
            className="mt-2 p-4"
            style={{ border: '1px solid rgba(0,255,212,0.15)', background: 'rgba(0,255,212,0.04)' }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00FFD4' }} />
              <span className="text-sm font-medium" style={{ color: '#00FFD4' }}>
                Disponible
              </span>
            </div>
            <p className="text-[#5a7080] text-xs leading-relaxed">
              Abierto a posiciones full-time, part-time o proyectos freelance de
              backend.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
