'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

interface EnlaceSocial {
  Icono: React.ElementType;
  etiqueta: string;
  valor: string;
  enlace: string;
}

const ENLACES_SOCIALES: EnlaceSocial[] = [
  {
    Icono: Github,
    etiqueta: 'GitHub',
    valor: 'github.com/bilibriann',
    enlace: 'https://github.com/bilibriann',
  },
  {
    Icono: Linkedin,
    etiqueta: 'LinkedIn',
    valor: 'linkedin.com/brian-vilches',
    enlace: 'https://linkedin.com/in/brian-vilches/',
  },
  {
    Icono: Mail,
    etiqueta: 'Email',
    valor: 'b.vilchesm@gmail.com',
    enlace: 'mailto:b.vilchesm@gmail.com',
  },
];

export default function Contacto({ bg }: { bg: string }) {
  const refSeccion = useRef(null);
  const enVista    = useInView(refSeccion, { once: true, margin: '-80px' });

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
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--theme-fg)' }}>
            Contacto
          </h2>
          <div className="h-0.5 w-10" style={{ background: 'var(--theme-accent)' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={enVista ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          <p className="text-xs mb-1" style={{ color: 'var(--theme-fg-muted)' }}>
            O encuéntrame en:
          </p>

          {ENLACES_SOCIALES.map(({ Icono, etiqueta, valor, enlace }) => (
            <a
              key={etiqueta}
              href={enlace}
              target={enlace.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 transition-colors"
              style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-panel)' }}
              onMouseEnter={e =>
                ((e.currentTarget as HTMLElement).style.borderColor = 'var(--theme-border-hover)')
              }
              onMouseLeave={e =>
                ((e.currentTarget as HTMLElement).style.borderColor = 'var(--theme-border)')
              }
            >
              <div
                className="w-9 h-9 flex items-center justify-center shrink-0"
                style={{
                  border: '1px solid var(--theme-border)',
                  background: 'var(--theme-bg-alt)',
                  color: 'var(--theme-accent)',
                }}
              >
                <Icono size={16} />
              </div>
              <div>
                <div className="text-xs" style={{ color: 'var(--theme-fg-muted)' }}>{etiqueta}</div>
                <div className="text-sm" style={{ color: 'var(--theme-fg)' }}>{valor}</div>
              </div>
            </a>
          ))}

          <div
            className="mt-2 p-4"
            style={{
              border: '1px solid rgba(var(--theme-accent-rgb), 0.2)',
              background: 'rgba(var(--theme-accent-rgb), 0.04)',
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--theme-accent)' }}
              />
              <span className="text-sm font-medium" style={{ color: 'var(--theme-accent)' }}>
                Disponible
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--theme-fg-muted)' }}>
              Abierto a posiciones full-time, part-time o proyectos freelance de backend.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
