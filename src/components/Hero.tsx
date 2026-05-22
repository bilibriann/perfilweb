'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';

const ENLACES_SOCIALES = [
  { enlace: 'https://github.com/bilibriann', Icono: Github, etiqueta: 'GitHub' },
  { enlace: 'https://linkedin.com/in/brian-vilches', Icono: Linkedin, etiqueta: 'LinkedIn' },
  { enlace: 'mailto:b.vilchesm@gmail.com', Icono: Mail, etiqueta: 'Email' },
];

export default function Inicio({ bg }: { bg: string }) {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-16 relative overflow-hidden"
      style={{ background: bg }}
    >
      {/* Teal radial glow — top-left, referencia PageCoder */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-120px',
          left: '-160px',
          width: '680px',
          height: '680px',
          background: 'radial-gradient(ellipse at center, rgba(0,80,60,0.28) 0%, rgba(6,24,24,0.14) 45%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 w-full py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Columna izquierda */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-5xl lg:text-6xl font-bold leading-tight mb-5"
            >
              <span className="text-[#f0f4f8]">Brian Vilches</span>
              <br />
              <span style={{ color: '#00FFD4' }}>Developer</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-[#5a7080] text-base leading-relaxed max-w-md mb-8"
            >
              Analista Programador con enfoque en desarrollo Backend,
              especializado en TypeScript y NestJS. Experiencia en construcción
              de APIs y sistemas web escalables, así como en la implementación y
              despliegue utilizando Docker y MySQL.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-[#07090f] text-sm font-semibold transition-opacity hover:opacity-85"
                style={{ background: '#00FFD4' }}
              >
                Ver proyectos
                <ArrowRight size={14} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center px-5 py-2.5 border text-sm font-medium transition-colors"
                style={{ borderColor: '#1a2535', color: '#5a7080' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#253040'
                  ;(e.currentTarget as HTMLElement).style.color = '#f0f4f8'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#1a2535'
                  ;(e.currentTarget as HTMLElement).style.color = '#5a7080'
                }}
              >
                Contactar
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex items-center gap-4"
            >
              {ENLACES_SOCIALES.map(({ enlace, Icono, etiqueta }) => (
                <a
                  key={etiqueta}
                  href={enlace}
                  target={enlace.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={etiqueta}
                  className="text-[#4a5a6a] hover:text-[#f0f4f8] transition-colors"
                >
                  <Icono size={18} />
                </a>
              ))}
              <div className="h-px w-16" style={{ background: '#1a2535' }} />
              <span className="text-[#4a5a6a] text-xs font-mono">
                TypeScript · NestJS · Docker
              </span>
            </motion.div>
          </div>

          {/* Columna derecha: ventana de código */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden lg:block"
          >
            <VentanaCodigo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function VentanaCodigo() {
  return (
    <div className="overflow-hidden" style={{ border: '1px solid #1a2535', background: '#0c1520' }}>
      {/* Barra superior */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: '#07090f', borderBottom: '1px solid #1a2535' }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/70" />
        <span className="ml-3 text-[#4a5a6a] text-xs font-mono">
          auth.controller.ts
        </span>
      </div>

      {/* Código */}
      <div className="p-5 font-mono text-[13px] leading-6 overflow-x-auto">
        <div className="flex gap-4">
          {/* Números de línea */}
          <div className="select-none text-[#253040] text-right shrink-0">
            {Array.from({ length: 23 }, (_, indice) => (
              <div key={indice}>{indice + 1}</div>
            ))}
          </div>
          {/* Contenido */}
          <div className="leading-6">
            <div>
              <span className="text-purple-400">@Controller</span>
              <span className="text-[#5a7080]">(&apos;auth&apos;)</span>
            </div>
            <div>
              <span className="text-blue-400">export class </span>
              <span className="text-yellow-300">AuthController </span>
              <span className="text-[#5a7080]">{'{'}</span>
            </div>
            <div className="ml-4">
              <span className="text-blue-400">constructor</span>
              <span className="text-[#5a7080]">(</span>
            </div>
            <div className="ml-8">
              <span className="text-blue-400">private readonly </span>
              <span className="text-[#5a7080]">authService: </span>
              <span className="text-yellow-300">AuthService</span>
              <span className="text-[#5a7080]">,</span>
            </div>
            <div className="ml-4">
              <span className="text-[#5a7080]">{') {}'}</span>
            </div>
            <div>&nbsp;</div>
            <div className="ml-4">
              <span className="text-purple-400">@Post</span>
              <span className="text-[#5a7080]">(&apos;login&apos;)</span>
            </div>
            <div className="ml-4">
              <span className="text-purple-400">@HttpCode</span>
              <span className="text-[#5a7080]">(</span>
              <span className="text-orange-400">200</span>
              <span className="text-[#5a7080]">)</span>
            </div>
            <div className="ml-4">
              <span className="text-blue-400">async </span>
              <span style={{ color: '#00FFD4' }}>login</span>
              <span className="text-[#5a7080]">(</span>
            </div>
            <div className="ml-8">
              <span className="text-purple-400">@Body</span>
              <span className="text-[#5a7080]">() dto: </span>
              <span className="text-yellow-300">LoginDto</span>
              <span className="text-[#5a7080]">,</span>
            </div>
            <div className="ml-4">
              <span className="text-[#5a7080]">{'): '}</span>
              <span className="text-yellow-300">Promise</span>
              <span className="text-[#5a7080]">{'<'}</span>
              <span className="text-yellow-300">TokenResponse</span>
              <span className="text-[#5a7080]">{'> {'}</span>
            </div>
            <div className="ml-8">
              <span className="text-blue-400">return </span>
              <span className="text-blue-400">this</span>
              <span className="text-[#5a7080]">.authService</span>
            </div>
            <div className="ml-12">
              <span className="text-[#5a7080]">.</span>
              <span style={{ color: '#00FFD4' }}>validateUser</span>
              <span className="text-[#5a7080]">(dto);</span>
            </div>
            <div className="ml-4">
              <span className="text-[#5a7080]">{'}'}</span>
            </div>
            <div>&nbsp;</div>
            <div className="ml-4">
              <span className="text-purple-400">@UseGuards</span>
              <span className="text-[#5a7080]">(</span>
              <span className="text-yellow-300">JwtAuthGuard</span>
              <span className="text-[#5a7080]">)</span>
            </div>
            <div className="ml-4">
              <span className="text-purple-400">@Get</span>
              <span className="text-[#5a7080]">(&apos;profile&apos;)</span>
            </div>
            <div className="ml-4">
              <span style={{ color: '#00FFD4' }}>getProfile</span>
              <span className="text-[#5a7080]">(</span>
              <span className="text-purple-400">@CurrentUser</span>
              <span className="text-[#5a7080]">() user: </span>
              <span className="text-yellow-300">User</span>
              <span className="text-[#5a7080]">,</span>
            </div>
            <div className="ml-4">
              <span className="text-[#5a7080]">{'): '}</span>
              <span className="text-yellow-300">User </span>
              <span className="text-[#5a7080]">{'{ '}</span>
              <span className="text-blue-400">return </span>
              <span className="text-[#5a7080]">{'user; }'}</span>
            </div>
            <div>
              <span className="text-[#5a7080]">{'}'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
