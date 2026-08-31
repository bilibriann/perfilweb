'use client';

import { useCallback, useRef, useState } from 'react';
import gsap from 'gsap';
import { Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import {
  DESLIZAMIENTO,
  movimientoReducido,
  prepararEntrada,
  useEntradaLayout,
  varsEntrada,
} from '@/lib/anim';

const NAME = 'Brian Vilches Mella';
const ROLE = 'Desarrollador Web | Programación y Análisis de sistemas.';
const DESCRIPCION =
  'Programador orientado al desarrollo backend APIs y lógica de negocio, con conocimientos en bases de datos y programación orientada a objetos. Experiencia previa como Ingeniero Constructor en empresas de construcción, desarrollando competencias en planificación, organización y trabajo en equipo.';
type Idioma = 'es' | 'en';
const IDIOMAS: Idioma[] = ['es', 'en'];

/** Misma descripción en inglés; se muestra en lugar de la española con el selector. */
const DESCRIPCION_EN =
  'Backend-oriented developer focused on APIs and business logic, with knowledge of databases and object-oriented programming. Previously a Construction Engineer at construction companies, where I built skills in planning, organization and teamwork.';
/**
 * Stack con el color oficial de cada tecnologia. `rgb` es el mismo color en
 * componentes sueltas, para las capas translucidas (fondo y glow) del hover;
 * ambos se inyectan como variables CSS y los usa `.stack-chip` en globals.css.
 */
const STACK = [
  { nombre: 'TypeScript', color: '#3178C6', rgb: '49,120,198' },
  { nombre: 'NestJS', color: '#E0234E', rgb: '224,35,78' },
  // Next.js es blanco/negro: sobre los paneles oscuros del tema va el blanco.
  { nombre: 'Next.js', color: '#FFFFFF', rgb: '255,255,255' },
  { nombre: 'React', color: '#61DAFB', rgb: '97,218,251' },
  { nombre: 'Java Spring Boot', color: '#6DB33F', rgb: '109,179,63' },
  { nombre: 'Docker', color: '#2496ED', rgb: '36,150,237' },
  // MySQL de la marca es azul + naranjo (#F29111); aqui va en amarillo.
  { nombre: 'MySQL', color: '#FFCC00', rgb: '255,204,0' },
];
const SOCIAL = [
  { href: 'https://github.com/bilibriann', Icon: Github, label: 'GitHub' },
  {
    href: 'https://linkedin.com/in/brian-vilches',
    Icon: Linkedin,
    label: 'LinkedIn',
  },
  { href: 'mailto:b.vilchesm@gmail.com', Icon: Mail, label: 'Email' },
];

/** Accesos de la tarjeta, en orden de aparición. `destino` es el id de la sección. */
const ACCIONES = [
  { etiqueta: 'Proyectos', destino: 'projects' },
  // Oculto por el momento: el boton de contacto. Descomentar para restaurarlo.
  // { etiqueta: 'Contactar', destino: 'contact' },
];

const ESTILO_ACCION: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.5rem 1.05rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  background: 'var(--theme-accent)',
  color: 'var(--theme-accent-on)',
  textDecoration: 'none',
  borderRadius: '2px',
};

const nameLen = NAME.length + 1;
const roleLen = ROLE.length + 1;
const descLen = DESCRIPCION.length + 1;
const descEnLen = DESCRIPCION_EN.length + 1;

/**
 * Tarjeta de presentación del hero.
 *
 * Antes era el panel lateral emergente (fijo al borde derecho, alto completo,
 * abierto/cerrado con el burger). Ahora es un rectángulo dentro del propio hero
 * que aparece solo al cargar la página, con la MISMA coreografía de siempre:
 * deslizamiento lateral → cascada escalonada → máquina de escribir.
 */
export default function PerfilCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const nameEl = useRef<HTMLHeadingElement>(null);
  const roleEl = useRef<HTMLParagraphElement>(null);
  const descEl = useRef<HTMLParagraphElement>(null);
  // El bloque (párrafo + selector) es lo que entra en la cascada; descEl solo
  // se usa para escribir el texto.
  const descBloqueEl = useRef<HTMLDivElement>(null);
  const stackEl = useRef<HTMLDivElement>(null);
  const socialEl = useRef<HTMLDivElement>(null);
  const actionsEl = useRef<HTMLDivElement>(null);

  const [idioma, setIdioma] = useState<Idioma>('es');
  // La máquina de escribir se crea una sola vez (si cambiara de identidad se
  // repetiría toda la entrada de la tarjeta), así que lee el idioma por ref.
  const idiomaRef = useRef(idioma);
  idiomaRef.current = idioma;
  const texto = idioma === 'es' ? DESCRIPCION : DESCRIPCION_EN;
  const largoTexto = idioma === 'es' ? descLen : descEnLen;

  const startTypewriter = useCallback(() => {
    const n = nameEl.current;
    const r = roleEl.current;
    const d = descEl.current;
    if (!n || !r || !d) return;
    const largo = idiomaRef.current === 'es' ? descLen : descEnLen;

    gsap
      .timeline()
      .fromTo(
        n,
        { '--idx': 0 },
        {
          '--idx': nameLen,
          duration: 0.8,
          ease: `steps(${nameLen})`,
          onComplete: () => n.classList.add('scroll-type-done'),
        },
      )
      .fromTo(
        r,
        { '--idx': 0 },
        {
          '--idx': roleLen,
          duration: 0.6,
          ease: `steps(${roleLen})`,
          onComplete: () => r.classList.add('scroll-type-done'),
        },
      )
      .fromTo(
        d,
        { '--idx': 0 },
        {
          '--idx': largo,
          duration: 3.5,
          ease: `steps(${largo})`,
          onComplete: () => d.classList.add('scroll-type-done'),
        },
      );
  }, []);

  // Cambio de idioma: reescribe el párrafo, más rápido que la entrada inicial.
  // Es layout effect para poner --idx en 0 antes de pintar; si no, el texto
  // nuevo asomaría un frame ya revelado con el --idx que dejó la animación
  // anterior. La primera pasada la hace la entrada, no esto.
  const primerRender = useRef(true);
  useEntradaLayout(() => {
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    const d = descEl.current;
    if (!d) return;

    // Si aún corría la escritura inicial, mandarla a parar: si no, las dos
    // animaciones se pelearían por --idx.
    gsap.killTweensOf(d);
    d.classList.remove('scroll-type-done');

    if (movimientoReducido()) {
      d.style.setProperty('--idx', String(largoTexto));
      d.classList.add('scroll-type-done');
      return;
    }

    const tw = gsap.fromTo(
      d,
      { '--idx': 0 },
      {
        '--idx': largoTexto,
        duration: 1,
        ease: `steps(${largoTexto})`,
        onComplete: () => d.classList.add('scroll-type-done'),
      },
    );
    return () => {
      tw.kill();
    };
  }, [idioma, largoTexto]);

  // Entrada al cargar: ya no hay open/close, la tarjeta es el estado inicial de
  // la página y se anima una sola vez al montarse.
  useEntradaLayout(() => {
    const card = cardRef.current;
    if (!card) return;

    const items = [
      nameEl.current,
      roleEl.current,
      descBloqueEl.current,
      stackEl.current,
      socialEl.current,
      actionsEl.current,
    ];

    // Sin animación: todo visible de una y con el texto ya "escrito".
    if (movimientoReducido()) {
      gsap.set(card, { xPercent: 0, opacity: 1 });
      gsap.set(items, { opacity: 1, y: 0 });
      [
        [nameEl.current, nameLen],
        [roleEl.current, roleLen],
        [descEl.current, idiomaRef.current === 'es' ? descLen : descEnLen],
      ].forEach(([el, largo]) => {
        const nodo = el as HTMLElement | null;
        if (!nodo) return;
        nodo.style.setProperty('--idx', String(largo));
        nodo.classList.add('scroll-type-done');
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(card, { xPercent: 100, opacity: 1 });
      prepararEntrada(items);

      gsap
        .timeline()
        .to(card, {
          xPercent: 0,
          duration: DESLIZAMIENTO.duracion,
          ease: DESLIZAMIENTO.ease,
        })
        .to(items, varsEntrada(), '-=0.15')
        .call(startTypewriter);
    }, cardRef);

    return () => ctx.revert();
  }, [startTypewriter]);

  return (
    // Rectángulo del hero: mismo lenguaje visual que el panel (superficie del
    // tema + blur + borde), pero con borde completo y sin alto de viewport.
    // `opacity: 0` inicial evita el flash antes de que GSAP tome el control.
    <div
      ref={cardRef}
      style={{
        position: 'relative',
        width: '100%',
        background: 'var(--theme-panel)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        border: '1px solid var(--theme-border)',
        borderRadius: '6px',
        boxShadow: '0 24px 48px -24px rgba(0,0,0,0.55)',
        overflow: 'hidden',
        opacity: 0,
      }}
    >
      <div
        style={{
          padding: '1.6rem 1.4rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.4rem',
        }}
      >
        {/* Nombre + Rol */}
        <div>
          <h2
            ref={nameEl}
            style={
              {
                position: 'relative',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 'clamp(1.2rem, 2.4vw, 1.6rem)',
                fontWeight: 700,
                color: 'var(--theme-fg)',
                lineHeight: 1.2,
                marginBottom: '0.5rem',
                '--text-length': nameLen,
              } as React.CSSProperties
            }
          >
            <span className="scroll-type-span">{NAME} </span>
          </h2>
          <p
            ref={roleEl}
            style={
              {
                position: 'relative',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 'clamp(0.76rem, 1vw, 0.85rem)',
                '--text-length': roleLen,
              } as React.CSSProperties
            }
          >
            <span
              className="scroll-type-span"
              style={
                {
                  '--st-color': 'var(--theme-accent)',
                } as React.CSSProperties
              }
            >
              {ROLE}{' '}
            </span>
          </p>
        </div>

        {/* Descripción + selector de idioma (ES/EN) */}
        <div
          ref={descBloqueEl}
          style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}
        >
          <p
            ref={descEl}
            lang={idioma}
            style={
              {
                position: 'relative',
                flex: 1,
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 'clamp(0.7rem, 0.85vw, 0.77rem)',
                lineHeight: 1.75,
                maxWidth: '68ch',
                '--text-length': largoTexto,
              } as React.CSSProperties
            }
          >
            <span className="scroll-type-span">{texto} </span>
          </p>

          <div className="lang-toggle" role="group" aria-label="Idioma">
            {IDIOMAS.map((codigo) => (
              <button
                key={codigo}
                type="button"
                className="lang-toggle-btn"
                data-activo={idioma === codigo}
                aria-pressed={idioma === codigo}
                onClick={() => setIdioma(codigo)}
              >
                {codigo.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Stack */}
        <div ref={stackEl}>
          <p
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--theme-fg-dim)',
              marginBottom: '0.75rem',
            }}
          >
            Stack
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {STACK.map(({ nombre, color, rgb }) => (
              <span
                key={nombre}
                className="stack-chip"
                tabIndex={0}
                style={
                  {
                    '--brand': color,
                    '--brand-rgb': rgb,
                  } as React.CSSProperties
                }
              >
                {nombre}
              </span>
            ))}
          </div>
        </div>

        {/* Redes sociales */}
        <div
          ref={socialEl}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
        >
          {SOCIAL.map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              style={{ color: 'var(--theme-fg-dim)', display: 'flex' }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  'var(--theme-fg)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  'var(--theme-fg-dim)')
              }
            >
              <Icon size={16} />
            </a>
          ))}
          <div
            style={{
              height: '1px',
              flex: 1,
              background: 'var(--theme-border)',
            }}
          />
        </div>

        {/* Botones de acción: en fila, ahora que la tarjeta es ancha */}
        <div
          ref={actionsEl}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {ACCIONES.map(({ etiqueta, destino }) => (
            <a
              key={destino}
              href={`#${destino}`}
              onClick={(e) => {
                // preventDefault evita el salto brusco; el scroll suave lo hace
                // scrollIntoView.
                e.preventDefault();
                document
                  .getElementById(destino)
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={ESTILO_ACCION}
            >
              {etiqueta} <ArrowRight size={13} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
