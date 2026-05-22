'use client';

import { Github, Linkedin, Mail } from 'lucide-react';

const ENLACES_NAV = [
  { etiqueta: 'About', enlace: '#about' },
  { etiqueta: 'Stack', enlace: '#stack' },
  { etiqueta: 'Projects', enlace: '#projects' },
  { etiqueta: 'Experience', enlace: '#experience' },
  { etiqueta: 'Contact', enlace: '#contact' },
];

const REDES_SOCIALES = [
  { Icono: Github,   enlace: 'https://github.com/bilibriann',          etiqueta: 'GitHub' },
  { Icono: Linkedin, enlace: 'https://www.linkedin.com/in/brian-vilches', etiqueta: 'LinkedIn' },
  { Icono: Mail,     enlace: 'mailto:b.vilchesm@gmail.com',             etiqueta: 'Email' },
];

export default function PieDePagina({ bg }: { bg: string }) {
  const anio = new Date().getFullYear();

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: bg }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <nav className="flex flex-wrap justify-center gap-6">
            {ENLACES_NAV.map(({ etiqueta, enlace }) => (
              <a
                key={enlace}
                href={enlace}
                className="text-sm transition-colors"
                style={{ color: '#4a5a6a' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#5a7080')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#4a5a6a')}
              >
                {etiqueta}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {REDES_SOCIALES.map(({ Icono, enlace, etiqueta }) => (
              <a
                key={etiqueta}
                href={enlace}
                target={enlace.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={etiqueta}
                className="transition-colors"
                style={{ color: '#4a5a6a' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#5a7080')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#4a5a6a')}
              >
                <Icono size={17} />
              </a>
            ))}
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid #111c2b' }}
        >
          <p className="text-[#4a5a6a] text-xs font-mono">
            © {anio} Brian Vilches Portfolio. Todos los derechos reservados.
          </p>
          <p className="text-[#4a5a6a] text-xs font-mono">
            Next.js · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
