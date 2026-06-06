'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';

const ENLACES_SOCIALES = [
  { enlace: 'https://github.com/bilibriann',          Icono: Github,   etiqueta: 'GitHub' },
  { enlace: 'https://linkedin.com/in/brian-vilches',  Icono: Linkedin, etiqueta: 'LinkedIn' },
  { enlace: 'mailto:b.vilchesm@gmail.com',            Icono: Mail,     etiqueta: 'Email' },
];

export default function Inicio({ bg }: { bg: string }) {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-16 relative overflow-hidden"
      style={{ background: bg }}
    >
      {/* Glow ambiental del tema */}
      <div
        aria-hidden
        style={{
          position: 'absolute', top: '-120px', left: '-160px',
          width: '680px', height: '680px',
          background: 'radial-gradient(ellipse at center, var(--theme-glow-1) 0%, transparent 70%)',
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
              <span style={{ color: 'var(--theme-fg)' }}>Brian Vilches</span>
              <br />
              <span style={{ color: 'var(--theme-accent)' }}>Developer</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-base leading-relaxed max-w-md mb-8"
              style={{ color: 'var(--theme-fg-muted)' }}
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
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-85"
                style={{ background: 'var(--theme-accent)', color: 'var(--theme-accent-on)' }}
              >
                Ver proyectos
                <ArrowRight size={14} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center px-5 py-2.5 border text-sm font-medium transition-colors"
                style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-fg-muted)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--theme-border-hover)'
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--theme-fg)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--theme-border)'
                  ;(e.currentTarget as HTMLElement).style.color = 'var(--theme-fg-muted)'
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
                  className="transition-colors"
                  style={{ color: 'var(--theme-fg-dim)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--theme-fg)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--theme-fg-dim)')}
                >
                  <Icono size={18} />
                </a>
              ))}
              <div className="h-px w-16" style={{ background: 'var(--theme-border)' }} />
              <span className="text-xs font-mono" style={{ color: 'var(--theme-fg-dim)' }}>
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
    <div
      className="overflow-hidden"
      style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-panel)' }}
    >
      {/* Barra superior */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: 'var(--theme-bg-alt)', borderBottom: '1px solid var(--theme-border)' }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]/70" />
        <span className="ml-3 text-xs font-mono" style={{ color: 'var(--theme-fg-dim)' }}>
          auth.controller.ts
        </span>
      </div>

      {/* Código */}
      <div className="p-5 font-mono text-[13px] leading-6 overflow-x-auto">
        <div className="flex gap-4">
          {/* Números de línea */}
          <div className="select-none text-right shrink-0" style={{ color: 'var(--theme-border-hover)' }}>
            {Array.from({ length: 23 }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          {/* Contenido */}
          <div className="leading-6">
            <div>
              <span className="text-purple-400">@Controller</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>(&apos;auth&apos;)</span>
            </div>
            <div>
              <span className="text-blue-400">export class </span>
              <span className="text-yellow-300">AuthController </span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>{'{'}</span>
            </div>
            <div className="ml-4">
              <span className="text-blue-400">constructor</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>(</span>
            </div>
            <div className="ml-8">
              <span className="text-blue-400">private readonly </span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>authService: </span>
              <span className="text-yellow-300">AuthService</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>,</span>
            </div>
            <div className="ml-4"><span style={{ color: 'var(--theme-fg-muted)' }}>{') {}'}</span></div>
            <div>&nbsp;</div>
            <div className="ml-4">
              <span className="text-purple-400">@Post</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>(&apos;login&apos;)</span>
            </div>
            <div className="ml-4">
              <span className="text-purple-400">@HttpCode</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>(</span>
              <span className="text-orange-400">200</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>)</span>
            </div>
            <div className="ml-4">
              <span className="text-blue-400">async </span>
              <span style={{ color: 'var(--theme-accent)' }}>login</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>(</span>
            </div>
            <div className="ml-8">
              <span className="text-purple-400">@Body</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>() dto: </span>
              <span className="text-yellow-300">LoginDto</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>,</span>
            </div>
            <div className="ml-4">
              <span style={{ color: 'var(--theme-fg-muted)' }}>{'): '}</span>
              <span className="text-yellow-300">Promise</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>{'<'}</span>
              <span className="text-yellow-300">TokenResponse</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>{'> {'}</span>
            </div>
            <div className="ml-8">
              <span className="text-blue-400">return </span>
              <span className="text-blue-400">this</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>.authService</span>
            </div>
            <div className="ml-12">
              <span style={{ color: 'var(--theme-fg-muted)' }}>.</span>
              <span style={{ color: 'var(--theme-accent)' }}>validateUser</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>(dto);</span>
            </div>
            <div className="ml-4"><span style={{ color: 'var(--theme-fg-muted)' }}>{'}'}</span></div>
            <div>&nbsp;</div>
            <div className="ml-4">
              <span className="text-purple-400">@UseGuards</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>(</span>
              <span className="text-yellow-300">JwtAuthGuard</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>)</span>
            </div>
            <div className="ml-4">
              <span className="text-purple-400">@Get</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>(&apos;profile&apos;)</span>
            </div>
            <div className="ml-4">
              <span style={{ color: 'var(--theme-accent)' }}>getProfile</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>(</span>
              <span className="text-purple-400">@CurrentUser</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>() user: </span>
              <span className="text-yellow-300">User</span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>,</span>
            </div>
            <div className="ml-4">
              <span style={{ color: 'var(--theme-fg-muted)' }}>{'): '}</span>
              <span className="text-yellow-300">User </span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>{'{ '}</span>
              <span className="text-blue-400">return </span>
              <span style={{ color: 'var(--theme-fg-muted)' }}>{'user; }'}</span>
            </div>
            <div><span style={{ color: 'var(--theme-fg-muted)' }}>{'}'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
