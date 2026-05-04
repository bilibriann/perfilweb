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
  { Icono: Github, enlace: 'https://github.com', etiqueta: 'GitHub' },
  { Icono: Linkedin, enlace: 'https://linkedin.com', etiqueta: 'LinkedIn' },
  { Icono: Mail, enlace: 'mailto:tu@email.com', etiqueta: 'Email' },
];

export default function PieDePagina() {
  const anio = new Date().getFullYear();

  return (
    <footer className="border-t border-[#1a2a3a] bg-[#070b14]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Navegación */}
          <nav className="flex flex-wrap justify-center gap-6">
            {ENLACES_NAV.map(({ etiqueta, enlace }) => (
              <a
                key={enlace}
                href={enlace}
                className="text-sm text-[#64748b] hover:text-[#94a3b8] transition-colors"
              >
                {etiqueta}
              </a>
            ))}
          </nav>

          {/* Redes sociales */}
          <div className="flex items-center gap-4">
            {REDES_SOCIALES.map(({ Icono, enlace, etiqueta }) => (
              <a
                key={etiqueta}
                href={enlace}
                target={enlace.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={etiqueta}
                className="text-[#64748b] hover:text-[#94a3b8] transition-colors"
              >
                <Icono size={17} />
              </a>
            ))}
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-10 pt-6 border-t border-[#0f1929] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#64748b] text-xs font-mono">
            © {anio} Brian Vilches Portfolio. Todos los derechos reservados.
          </p>
          <p className="text-[#64748b] text-xs font-mono">
            Next.js · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
