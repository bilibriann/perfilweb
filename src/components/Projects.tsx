'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Globe, Package } from 'lucide-react';

interface Proyecto {
  titulo: string;
  descripcion: string;
  etiquetas: string[];
  repositorio: string;
  icono: React.ReactNode;
}

const PROYECTOS: Proyecto[] = [
  {
    titulo: 'Bodega Ecole — Gestión de Inventario',
    descripcion:
      'API REST para gestión de inventario (productos, lotes y movimientos) con autenticación JWT. NestJS 11 + MySQL/TypeORM + Flyway, documentación Swagger y entorno completo con Docker Compose. Incluye CRUD, trazabilidad de stock y creación automática de admin desde variables de entorno.',
    etiquetas: ['NestJS', 'TypeScript', 'MySQL', 'TypeORM', 'Flyway', 'JWT', 'Docker', 'Swagger'],
    repositorio: 'https://github.com/bilibriann',
    icono: <Package size={18} />,
  },
  {
    titulo: 'Calvary Santiago — Sitio Institucional',
    descripcion:
      'Sitio web institucional para iglesia cristiana (en desarrollo). Desarrollado con Next.js, React, TypeScript y Tailwind CSS, utilizando arquitectura MVC en el backend. Incluye diseño responsivo, validación de formularios, accesibilidad, seguridad HTTP y despliegue en Hostinger.',
    etiquetas: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'MVC', 'Hostinger'],
    repositorio: 'https://github.com/bilibriann',
    icono: <Globe size={18} />,
  },
];

export default function SeccionProyectos({ bg }: { bg: string }) {
  const refSeccion = useRef(null);
  const enVista    = useInView(refSeccion, { once: true, margin: '-80px' });

  return (
    <section id="projects" className="py-24" style={{ background: bg }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={refSeccion}
          initial={{ opacity: 0, y: 16 }}
          animate={enVista ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--theme-fg)' }}>
            Proyectos
          </h2>
          <div className="h-0.5 w-10" style={{ background: 'var(--theme-accent)' }} />
          <p className="mt-4 text-sm max-w-lg" style={{ color: 'var(--theme-fg-muted)' }}>
            Proyectos de backend enfocados en APIs REST, autenticación,
            microservicios y bases de datos.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {PROYECTOS.map((proyecto, indice) => (
            <TarjetaProyecto
              key={proyecto.titulo}
              proyecto={proyecto}
              indice={indice}
              enVista={enVista}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TarjetaProyecto({
  proyecto,
  indice,
  enVista,
}: {
  proyecto: Proyecto;
  indice: number;
  enVista: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={enVista ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: indice * 0.08 }}
      className="p-6 transition-colors"
      style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-panel)' }}
      onMouseEnter={e =>
        ((e.currentTarget as HTMLElement).style.borderColor = 'var(--theme-border-hover)')
      }
      onMouseLeave={e =>
        ((e.currentTarget as HTMLElement).style.borderColor = 'var(--theme-border)')
      }
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{
              border: '1px solid var(--theme-border)',
              background: 'var(--theme-bg-alt)',
              color: 'var(--theme-accent)',
            }}
          >
            {proyecto.icono}
          </div>
          <h3 className="font-semibold text-base" style={{ color: 'var(--theme-fg)' }}>
            {proyecto.titulo}
          </h3>
        </div>
        <a
          href={proyecto.repositorio}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 shrink-0 transition-colors"
          style={{ color: 'var(--theme-fg-dim)' }}
          aria-label="GitHub"
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--theme-fg)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--theme-fg-dim)')}
        >
          <Github size={16} />
        </a>
      </div>

      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--theme-fg-muted)' }}>
        {proyecto.descripcion}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {proyecto.etiquetas.map((etiqueta) => (
          <span
            key={etiqueta}
            className="px-2 py-0.5 text-[11px] font-mono"
            style={{
              color: 'var(--theme-fg-muted)',
              background: 'var(--theme-bg-alt)',
              border: '1px solid var(--theme-border)',
            }}
          >
            {etiqueta}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
