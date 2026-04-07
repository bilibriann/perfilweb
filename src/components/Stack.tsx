'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Code2,
  Layers,
  Server,
  Database,
  Container,
  GitBranch,
  Package,
  ShieldCheck,
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
      'Tipado estático, genéricos e interfaces. Menos bugs, más confianza en tiempo de compilación.',
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
      'Entorno de ejecución JavaScript asíncrono y orientado a eventos para servidores de alto rendimiento.',
  },
  {
    nombre: 'MongoDB',
    categoria: 'Base de datos',
    color: '#4ade80',
    Icono: Database,
    descripcion:
      'Base de datos NoSQL documental con Mongoose ODM. Esquemas flexibles y agregaciones potentes.',
  },
  {
    nombre: 'Docker',
    categoria: 'Infraestructura',
    color: '#38bdf8',
    Icono: Container,
    descripcion:
      'Contenedores para entornos reproducibles. Docker Compose para orquestación de servicios.',
  },
  {
    nombre: 'Git & GitHub',
    categoria: 'Control de versiones',
    color: '#fb923c',
    Icono: GitBranch,
    descripcion:
      'Flujos de trabajo con branches, pull requests, code reviews y CI/CD pipelines.',
  },
  {
    nombre: 'npm',
    categoria: 'Gestor de paquetes',
    color: '#f87171',
    Icono: Package,
    descripcion:
      'Gestión de dependencias, scripts de automatización y publicación de paquetes en el registry.',
  },
  {
    nombre: 'JWT & Auth',
    categoria: 'Seguridad',
    color: '#c084fc',
    Icono: ShieldCheck,
    descripcion:
      'JSON Web Tokens para autenticación stateless, refresh tokens y control de acceso por roles.',
  },
];

export default function SeccionTecnologias() {
  const refSeccion = useRef(null);
  const enVista = useInView(refSeccion, { once: true, margin: '-80px' });

  return (
    <section id="stack" className="py-24 bg-[#080e1a]">
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
            Tecnologías
          </h2>
          <div className="h-0.5 w-10 bg-indigo-500" />
          <p className="text-[#94a3b8] mt-4 text-sm max-w-lg">
            Herramientas con las que trabajo a diario para diseñar y construir
            sistemas backend orientados a producción.
          </p>
        </motion.div>

        {/* Grilla */}
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
      className="border border-[#1a2a3a] bg-[#0f1929] p-5 hover:border-[#2a3a4a] transition-colors"
    >
      {/* Icono */}
      <div className="w-10 h-10 border border-[#1a2a3a] bg-[#0c1220] flex items-center justify-center mb-4">
        <Icono size={18} style={{ color }} />
      </div>

      {/* Categoría */}
      <div
        className="text-[10px] font-mono uppercase tracking-widest mb-1.5"
        style={{ color }}
      >
        {categoria}
      </div>

      {/* Nombre */}
      <div className="text-[#f1f5f9] font-bold mb-2">{nombre}</div>

      {/* Descripción */}
      <div className="text-[#94a3b8] text-xs leading-relaxed">
        {descripcion}
      </div>
    </motion.div>
  );
}
