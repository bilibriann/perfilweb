'use client';

import { Github, Linkedin, Mail } from 'lucide-react';

const ENLACES_NAV = [
  { etiqueta: 'Projects', enlace: '#projects' },
  { etiqueta: 'Contact',  enlace: '#contact' },
];

const REDES_SOCIALES = [
  { Icono: Github,   enlace: 'https://github.com/bilibriann',             etiqueta: 'GitHub' },
  { Icono: Linkedin, enlace: 'https://www.linkedin.com/in/brian-vilches', etiqueta: 'LinkedIn' },
  { Icono: Mail,     enlace: 'mailto:b.vilchesm@gmail.com',               etiqueta: 'Email' },
];

export default function PieDePagina({ bg }: { bg: string }) {
  const anio = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: '1px solid var(--theme-border)',
        background: bg,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <nav className="flex flex-wrap justify-center gap-6">
            {ENLACES_NAV.map(({ etiqueta, enlace }) => (
              <a
                key={enlace}
                href={enlace}
                className="text-sm transition-colors"
                style={{ color: 'var(--theme-fg-dim)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--theme-fg-muted)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--theme-fg-dim)')}
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
                style={{ color: 'var(--theme-fg-dim)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--theme-fg-muted)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--theme-fg-dim)')}
              >
                <Icono size={17} />
              </a>
            ))}
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex justify-center"
          style={{ borderTop: '1px solid var(--theme-border)' }}
        >
          <p className="text-xs font-mono" style={{ color: 'var(--theme-fg-dim)' }}>
            © {anio} Brian Vilches Portfolio.
          </p>
        </div>
      </div>
    </footer>
  );
}
