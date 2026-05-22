'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Code2, Layers, Server, Database, Container, GitBranch, LayoutTemplate,
} from 'lucide-react';

interface Tecnologia {
  nombre: string;
  categoria: string;
  color: string;
  Icono: React.ElementType;
  descripcion: string;
}

const TECNOLOGIAS: Tecnologia[] = [
  {
    nombre: 'TypeScript',
    categoria: 'Lenguaje',
    color: '#3b82f6',
    Icono: Code2,
    descripcion:
      'Implementación de tipado estático, genéricos e interfaces para asegurar consistencia en el código y prevenir errores en etapas tempranas.',
  },
  {
    nombre: 'NestJS',
    categoria: 'Framework',
    color: '#f43f5e',
    Icono: Layers,
    descripcion:
      'Framework Node.js progresivo con inyección de dependencias, módulos y decoradores.',
  },
  {
    nombre: 'Node.js',
    categoria: 'Runtime',
    color: '#22c55e',
    Icono: Server,
    descripcion:
      'Uso de Node.js para el desarrollo de servidores eficientes y escalables mediante programación asíncrona.',
  },
  {
    nombre: 'MySQL',
    categoria: 'Base de datos',
    color: '#4ade80',
    Icono: Database,
    descripcion:
      'Base de datos SQL relacional con TypeORM para la gestión de migraciones y la creación de entidades.',
  },
  {
    nombre: 'Docker',
    categoria: 'Infraestructura',
    color: '#38bdf8',
    Icono: Container,
    descripcion: 'Contenedores para entornos reproducibles.',
  },
  {
    nombre: 'Git & GitHub',
    categoria: 'Control de versiones',
    color: '#fb923c',
    Icono: GitBranch,
    descripcion:
      'Flujos de trabajo con branches, pull requests y CI/CD pipelines.',
  },
  {
    nombre: 'MVC',
    categoria: 'Arquitectura',
    color: '#a78bfa',
    Icono: LayoutTemplate,
    descripcion:
      'Patrón Modelo-Vista-Controlador para separación de responsabilidades y código mantenible.',
  },
];

export default function SeccionTecnologias({ bg }: { bg: string }) {
  const refSeccion = useRef(null);
  const enVista = useInView(refSeccion, { once: true, margin: '-80px' });

  return (
    <section id="stack" className="py-24" style={{ background: bg }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={refSeccion}
          initial={{ opacity: 0, y: 16 }}
          animate={enVista ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-[#f0f4f8] mb-3">Tecnologías</h2>
          <div className="h-0.5 w-10" style={{ background: '#00FFD4' }} />
          <p className="text-[#5a7080] mt-4 text-sm max-w-lg">
            Herramientas con las que trabajo a diario para diseñar y construir
            sistemas backend orientados a producción.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TECNOLOGIAS.map((tecnologia, indice) => (
            <TarjetaTecnologia
              key={tecnologia.nombre}
              tecnologia={tecnologia}
              indice={indice}
              enVista={enVista}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TarjetaTecnologia({
  tecnologia,
  indice,
  enVista,
}: {
  tecnologia: Tecnologia;
  indice: number;
  enVista: boolean;
}) {
  const { Icono, nombre, categoria, color, descripcion } = tecnologia;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={enVista ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, delay: indice * 0.06 }}
      className="p-5 transition-colors"
      style={{ border: '1px solid #1a2535', background: '#111c2b' }}
      onMouseEnter={e =>
        ((e.currentTarget as HTMLElement).style.borderColor = '#253040')
      }
      onMouseLeave={e =>
        ((e.currentTarget as HTMLElement).style.borderColor = '#1a2535')
      }
    >
      <div
        className="w-10 h-10 flex items-center justify-center mb-4"
        style={{ border: '1px solid #1a2535', background: '#0c1520' }}
      >
        <Icono size={18} style={{ color }} />
      </div>

      <div
        className="text-[10px] font-mono uppercase tracking-widest mb-1.5"
        style={{ color }}
      >
        {categoria}
      </div>

      <div className="text-[#f0f4f8] font-bold mb-2">{nombre}</div>

      <div className="text-[#5a7080] text-xs leading-relaxed">{descripcion}</div>
    </motion.div>
  );
}
