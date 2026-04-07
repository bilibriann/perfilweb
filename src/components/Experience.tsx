'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';

interface Trabajo {
  rol: string;
  empresa: string;
  periodo: string;
  tipo: string;
  puntos: string[];
  etiquetas: string[];
}

const TRABAJOS: Trabajo[] = [
  {
    rol: 'Desarrollador Backend — Proyecto Aplicado',
    empresa: 'Bodega Ecole',
    periodo: 'Ago 2025 — Mar 2026',
    tipo: 'Proyecto aplicado',
    puntos: [
      'Desarrollo de API REST para gestión de inventario (productos, lotes y movimientos) con NestJS 11 y TypeScript.',
      'Integración con MySQL mediante TypeORM y gestión de migraciones con Flyway.',
      'Implementación de autenticación JWT y documentación automática con Swagger.',
      'Configuración de entorno completo con Docker Compose, seed inicial y creación automática de admin desde variables de entorno.',
      'Desarrollo de CRUD con trazabilidad de stock y control de movimientos.',
    ],
    etiquetas: ['NestJS', 'TypeScript', 'MySQL', 'TypeORM', 'JWT', 'Docker', 'Swagger'],
  },
  {
    rol: 'Control y Seguimiento de Obra',
    empresa: 'Constructora Suksa',
    periodo: 'Ene 2016 — Dic 2023',
    tipo: 'Full-time',
    puntos: [
      'Seguimiento de avance y control de calidad en terreno, con registro y trazabilidad de información.',
      'Elaboración de reportes de avance, evidencia y documentación; actualización de planos y apoyo a coordinación operativa.',
      'Revisión de partidas y cubicaciones, apoyo a planificación diaria para cumplimiento de actividades.',
      'Apoyo en medidas de mitigación medioambiental: verificación de cumplimiento en obra y control operativo.',
    ],
    etiquetas: ['Control de calidad', 'Reportes', 'Planificación', 'Documentación', 'Coordinación'],
  },
];

export default function SeccionExperiencia() {
  const refSeccion = useRef(null);
  const enVista = useInView(refSeccion, { once: true, margin: '-80px' });

  return (
    <section id="experience" className="py-24 bg-[#080e1a]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Encabezado */}
        <motion.div
          ref={refSeccion}
          initial={{ opacity: 0, y: 16 }}
          animate={enVista ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-[#f1f5f9] mb-3">
            Experiencia
          </h2>
          <div className="h-0.5 w-10 bg-indigo-500" />
        </motion.div>

        {/* Línea de tiempo */}
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-[#1a2a3a] hidden md:block" />
          <div className="flex flex-col gap-6">
            {TRABAJOS.map((trabajo, indice) => (
              <ElementoTimeline
                key={trabajo.empresa}
                trabajo={trabajo}
                indice={indice}
                enVista={enVista}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ElementoTimeline({
  trabajo,
  indice,
  enVista,
}: {
  trabajo: Trabajo;
  indice: number;
  enVista: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={enVista ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: indice * 0.1 }}
      className="relative md:pl-16"
    >
      {/* Punto de la línea */}
      <div className="hidden md:flex absolute left-0 top-1 w-10 h-10 border border-[#1a2a3a] bg-[#0f1929] items-center justify-center">
        <Briefcase size={14} className="text-indigo-400" />
      </div>

      <div className="border border-[#1a2a3a] bg-[#0f1929] p-6 hover:border-[#2a3a4a] transition-colors">
        {/* Fila superior */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[#f1f5f9] font-bold text-lg">{trabajo.rol}</h3>
            <div className="text-indigo-400 text-sm mt-0.5">
              {trabajo.empresa}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 text-[#94a3b8] text-xs font-mono">
              <Calendar size={11} />
              {trabajo.periodo}
            </div>
            <span className="px-2 py-0.5 text-[11px] font-mono border border-[#1a2a3a] text-[#94a3b8]">
              {trabajo.tipo}
            </span>
          </div>
        </div>

        {/* Puntos */}
        <ul className="space-y-1.5 mb-4">
          {trabajo.puntos.map((punto, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-[#94a3b8] text-sm"
            >
              <span className="mt-2 w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
              {punto}
            </li>
          ))}
        </ul>

        {/* Etiquetas */}
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#1a2a3a]">
          {trabajo.etiquetas.map((etiqueta) => (
            <span
              key={etiqueta}
              className="px-2 py-0.5 text-[11px] font-mono bg-[#0c1220] border border-[#1a2a3a] text-[#94a3b8]"
            >
              {etiqueta}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
