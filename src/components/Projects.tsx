'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Package, Search, Server } from 'lucide-react';

interface Proyecto {
  titulo: string;
  descripcion: string;
  etiquetas: string[];
  repositorio: string;
  icono: React.ReactNode;
  acento: string;
}

const PROYECTOS: Proyecto[] = [
  {
    titulo: 'Bodega Ecole — Gestión de Inventario',
    descripcion:
      'API REST para gestión de inventario (productos, lotes y movimientos) con autenticación JWT. NestJS 11 + MySQL/TypeORM + Flyway, documentación Swagger y entorno completo con Docker Compose. Incluye CRUD, trazabilidad de stock y creación automática de admin desde variables de entorno.',
    etiquetas: [
      'NestJS',
      'TypeScript',
      'MySQL',
      'TypeORM',
      'Flyway',
      'JWT',
      'Docker',
      'Swagger',
    ],
    repositorio: 'https://github.com/bilibriann',
    icono: <Package size={18} />,
    acento: '#6366f1',
  },
  {
    titulo: 'Aves Chile — API REST',
    descripcion:
      'API REST construida con NestJS + MongoDB (Mongoose), documentación automática con Swagger/OpenAPI, validación con DTOs + class-validator, tests unitarios y e2e con Jest. Lista para correr con Docker/docker-compose. Incluye endpoints CRUD, búsqueda avanzada y gestión de usuarios.',
    etiquetas: [
      'NestJS',
      'TypeScript',
      'MongoDB',
      'Mongoose',
      'Swagger',
      'Jest',
      'Docker',
    ],
    repositorio: 'https://github.com/bilibriann',
    icono: <Search size={18} />,
    acento: '#8b5cf6',
  },
  {
    titulo: 'Ludomentor — Proyecto Bootcamp',
    descripcion:
      'Backend NestJS modularizado (auth, carritos, catálogo, checkout, equipos, preferencias, quiz) con DTOs/validaciones y capa common para middleware/interceptores/filtros. Despliegue en AWS EC2 (Ubuntu 24.04) con Docker Compose, Swagger publicado y versionado de imagen en Docker Hub.',
    etiquetas: [
      'NestJS',
      'TypeScript',
      'AWS EC2',
      'Docker',
      'Docker Hub',
      'Swagger',
    ],
    repositorio: 'https://github.com/bilibriann',
    icono: <Server size={18} />,
    acento: '#06b6d4',
  },
];

export default function SeccionProyectos() {
  const refSeccion = useRef(null);
  const enVista = useInView(refSeccion, { once: true, margin: '-80px' });

  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Encabezado */}
        <motion.div
          ref={refSeccion}
          initial={{ opacity: 0, y: 16 }}
          animate={enVista ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-[#f1f5f9] mb-3">Proyectos</h2>
          <div className="h-0.5 w-10 bg-indigo-500" />
          <p className="text-[#94a3b8] mt-4 text-sm max-w-lg">
            Proyectos de backend enfocados en APIs REST, autenticación,
            microservicios y bases de datos.
          </p>
        </motion.div>

        {/* Grilla 2x2 */}
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
      className="border border-[#1a2a3a] bg-[#0f1929] p-6 hover:border-[#2a3a4a] transition-colors"
    >
      {/* Icono + título */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center border border-[#1a2a3a] bg-[#0c1220]"
            style={{ color: proyecto.acento }}
          >
            {proyecto.icono}
          </div>
          <h3 className="text-white font-semibold text-base">
            {proyecto.titulo}
          </h3>
        </div>
        <a
          href={proyecto.repositorio}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#64748b] hover:text-white transition-colors ml-2 shrink-0"
          aria-label="GitHub"
        >
          <Github size={16} />
        </a>
      </div>

      {/* Descripción */}
      <p className="text-[#94a3b8] text-sm leading-relaxed mb-4">
        {proyecto.descripcion}
      </p>

      {/* Etiquetas */}
      <div className="flex flex-wrap gap-1.5">
        {proyecto.etiquetas.map((etiqueta) => (
          <span
            key={etiqueta}
            className="px-2 py-0.5 text-[11px] font-mono bg-[#0c1220] border border-[#1a2a3a] text-[#94a3b8]"
          >
            {etiqueta}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
