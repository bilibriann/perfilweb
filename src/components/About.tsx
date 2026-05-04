'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, BookOpen, Wrench } from 'lucide-react';

const PILARES = [
  {
    Icono: GraduationCap,
    titulo: 'Programación y Análisis de Sistemas',
    descripcion: 'Instituto Profesional San Sebastián CIISA — 2023 · 2025',
  },
  {
    Icono: BookOpen,
    titulo: 'Bootcamp Backend DDC',
    descripcion: 'Universidad de Chile — 2025',
  },
  {
    Icono: Wrench,
    titulo: 'Ingeniería en Construcción',
    descripcion: 'INACAP, Universidad Tecnológica de Chile — 2010 · 2016',
  },
];

const variantesContenedor = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const variantesElemento = {
  oculto: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function SobreMi() {
  const refSeccion = useRef(null);
  const enVista = useInView(refSeccion, { once: true, margin: '-80px' });

  return (
    <section id="about" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Encabezado */}
        <motion.div
          ref={refSeccion}
          initial={{ opacity: 0, y: 16 }}
          animate={enVista ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-[#f1f5f9] mb-3">Sobre mí</h2>
          <div className="h-0.5 w-10 bg-indigo-500" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Biografía y estadísticas */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={enVista ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <p className="text-white text-base leading-relaxed mb-4">
              Analista Programador con orientación al desarrollo Backend.
              Experiencia en desarrollo de APIs REST utilizando TypeScript y
              NestJS, priorizando la claridad del código y escalabilidad.
              También me desempeño en el desarrollo frontend, trabajando con
              tecnologías como React, lo que me permite desenvolverme en la
              construcción de sistemas y aplicaciones web de manera integral.
              Manejo de bases de datos relacionales con MySQL y uso de Docker
              para la gestión de entornos de desarrollo y despliegue en
              servidor.
            </p>
            <p className="text-white text-base leading-relaxed mb-8">
              Interesado en integrarme a equipos de trabajo donde pueda aportar
              con soluciones backend y seguir fortaleciendo mis conocimientos en
              entornos productivos.
            </p>
          </motion.div>

          {/* Pilares */}
          <motion.div
            variants={variantesContenedor}
            initial="oculto"
            animate={enVista ? 'visible' : 'oculto'}
            className="flex flex-col gap-3"
          >
            {PILARES.map(({ Icono, titulo, descripcion }) => (
              <motion.div
                key={titulo}
                variants={variantesElemento}
                className="flex items-start gap-4 p-4 border border-[#1a2a3a] bg-[#0f1929] hover:border-indigo-500/30 transition-colors"
              >
                <div className="w-9 h-9 border border-[#1a2a3a] bg-[#0c1220] flex items-center justify-center shrink-0">
                  <Icono size={16} className="text-indigo-400" />
                </div>
                <div>
                  <div className="text-[#f1f5f9] font-semibold text-sm mb-1">
                    {titulo}
                  </div>
                  <div className="text-[#94a3b8] text-sm leading-relaxed">
                    {descripcion}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
