'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, Mail, Send } from 'lucide-react';

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
    color: '#94a3b8',
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
    color: '#a78bfa',
  },
];

export default function Contacto() {
  const refSeccion = useRef(null);
  const enVista = useInView(refSeccion, { once: true, margin: '-80px' });

  return (
    <section id="contact" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Encabezado */}
        <motion.div
          ref={refSeccion}
          initial={{ opacity: 0, y: 16 }}
          animate={enVista ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-[#f1f5f9] mb-3">Contacto</h2>
          <div className="h-0.5 w-10 bg-indigo-500" />
        </motion.div>
        {/* Enlaces sociales */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={enVista ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          <p className="text-[#94a3b8] text-xs mb-1">O encuéntrame en:</p>

          {ENLACES_SOCIALES.map(({ Icono, etiqueta, valor, enlace, color }) => (
            <a
              key={etiqueta}
              href={enlace}
              target={enlace.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border border-[#1a2a3a] bg-[#0f1929] hover:border-[#2a3a4a] transition-colors"
            >
              <div
                className="w-9 h-9 border border-[#1a2a3a] bg-[#0c1220] flex items-center justify-center shrink-0"
                style={{ color }}
              >
                <Icono size={16} />
              </div>
              <div>
                <div className="text-[#94a3b8] text-xs">{etiqueta}</div>
                <div className="text-[#f1f5f9] text-sm">{valor}</div>
              </div>
            </a>
          ))}

          {/* Disponibilidad */}
          <div className="mt-2 p-4 border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">
                Disponible
              </span>
            </div>
            <p className="text-[#94a3b8] text-xs leading-relaxed">
              Abierto a posiciones full-time, part-time o proyectos freelance de
              backend.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
