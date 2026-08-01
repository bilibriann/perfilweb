'use client';

import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import gsap from 'gsap';
import { Github, Linkedin, Mail, X, ArrowRight } from 'lucide-react';
import { DESLIZAMIENTO, prepararEntrada, varsEntrada } from '@/lib/anim';

/** Ancho del panel. `main` reserva este espacio para no quedar tapado. */
export const PANEL_WIDTH = 'min(380px, 92vw)';

/** Bajo este ancho el panel taparía casi toda la pantalla: arranca cerrado. */
export const PANEL_MIN_VIEWPORT = 1024;

const NAME = 'Brian Vilches Mella';
const ROLE = 'Desarrollador Web | Programación y Análisis de sistemas.';
const DESCRIPCION =
  'Programador orientado al desarrollo backend APIs y lógica de negocio, con conocimientos en bases de datos y programación orientada a objetos. Interesado en integrarme a equipos de desarrollo y participar en proyectos reales. Experiencia previa como Ingeniero Constructor en empresas de construcción, desarrollando competencias en planificación, organización y trabajo en equipo.';
const STACK = [
  'TypeScript',
  'NestJS',
  'Next.js',
  'React',
  'Java Spring Boot',
  'Docker',
  'MySQL',
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

const nameLen = NAME.length + 1;
const roleLen = ROLE.length + 1;
const descLen = DESCRIPCION.length + 1;

export interface ContactPanelHandle {
  open: () => void;
  close: () => void;
}

const ContactPanel = forwardRef<ContactPanelHandle, { onClose?: () => void }>(
  function ContactPanel({ onClose }, ref) {
    const panelRef = useRef<HTMLDivElement>(null);
    const nameEl = useRef<HTMLHeadingElement>(null);
    const roleEl = useRef<HTMLParagraphElement>(null);
    const descEl = useRef<HTMLParagraphElement>(null);
    const stackEl = useRef<HTMLDivElement>(null);
    const socialEl = useRef<HTMLDivElement>(null);
    const actionsEl = useRef<HTMLDivElement>(null);
    const closeBtnEl = useRef<HTMLButtonElement>(null);
    const isOpen = useRef(false);

    const resetTypewriter = useCallback(() => {
      [nameEl.current, roleEl.current, descEl.current].forEach((el) => {
        if (!el) return;
        el.classList.remove('scroll-type-done');
        el.style.setProperty('--idx', '0');
      });
    }, []);

    const startTypewriter = useCallback(() => {
      const n = nameEl.current;
      const r = roleEl.current;
      const d = descEl.current;
      if (!n || !r || !d) return;

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
            '--idx': descLen,
            duration: 3.5,
            ease: `steps(${descLen})`,
            onComplete: () => d.classList.add('scroll-type-done'),
          },
        );
    }, []);

    const close = useCallback(() => {
      if (!isOpen.current) return;
      isOpen.current = false;
      onClose?.();

      const items = [
        actionsEl.current,
        socialEl.current,
        stackEl.current,
        descEl.current,
        roleEl.current,
        nameEl.current,
        closeBtnEl.current,
      ];

      gsap
        .timeline({ onComplete: resetTypewriter })
        .to(items, {
          opacity: 0,
          y: -10,
          duration: 0.18,
          stagger: 0.03,
          ease: 'power2.in',
        })
        .to(
          panelRef.current,
          { xPercent: 100, duration: 0.35, ease: 'power2.in' },
          '-=0.05',
        );
    }, [resetTypewriter, onClose]);

    const open = useCallback(() => {
      if (isOpen.current) return;
      isOpen.current = true;

      const panel = panelRef.current;
      if (!panel) return;

      const items = [
        nameEl.current,
        roleEl.current,
        descEl.current,
        stackEl.current,
        socialEl.current,
        actionsEl.current,
      ];

      // x:0 limpia el translateX(100%) inline (gsap lo leería como px y lo sumaría
      // al xPercent, dejando el panel fuera de pantalla). Solo xPercent posiciona.
      gsap.set(panel, { x: 0, xPercent: 100, opacity: 1 });
      prepararEntrada(items);
      gsap.set(closeBtnEl.current, { opacity: 0 });

      gsap
        .timeline()
        .to(panel, {
          xPercent: 0,
          duration: DESLIZAMIENTO.duracion,
          ease: DESLIZAMIENTO.ease,
        })
        .to(
          closeBtnEl.current,
          { opacity: 1, duration: 0.25, ease: 'power3.out' },
          '-=0.1',
        )
        .to(items, varsEntrada(), '-=0.15')
        .call(startTypewriter);
    }, [startTypewriter]);

    useImperativeHandle(ref, () => ({ open, close }), [open, close]);

    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen.current) close();
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [close]);

    return (
      <>
        {/* Panel lateral fijo: NO es modal. Sin overlay, el fondo animado
            (starfield / matrix) se ve siempre y la página sigue usable
            mientras el panel está abierto — a lo paleta de comandos. */}
        <div
          ref={panelRef}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100dvh',
            width: PANEL_WIDTH,
            zIndex: 201,
            background: 'var(--theme-panel)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            borderLeft: '1px solid var(--theme-border)',
            boxShadow: '-24px 0 48px -24px rgba(0,0,0,0.55)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transform: 'translateX(100%)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--theme-border)',
              flexShrink: 0,
            }}
          >
            <button
              ref={closeBtnEl}
              onClick={close}
              aria-label="Cerrar panel"
              style={{
                // Oculto: el burger (X de sables) es ahora el botón de cerrar.
                // Se mantiene en el DOM para la lógica/animación existente.
                display: 'none',
                background: 'transparent',
                border: '1px solid var(--theme-border)',
                color: 'var(--theme-fg-muted)',
                width: '32px',
                height: '32px',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  'var(--theme-border-hover)';
                (e.currentTarget as HTMLElement).style.color =
                  'var(--theme-fg)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  'var(--theme-border)';
                (e.currentTarget as HTMLElement).style.color =
                  'var(--theme-fg-muted)';
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Contenido scrolleable */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
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
                    fontSize: 'clamp(1.3rem, 4vw, 1.65rem)',
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
                    fontSize: '0.88rem',
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

            {/* Descripción */}
            <p
              ref={descEl}
              style={
                {
                  position: 'relative',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.77rem',
                  lineHeight: 1.75,
                  '--text-length': descLen,
                } as React.CSSProperties
              }
            >
              <span className="scroll-type-span">{DESCRIPCION} </span>
            </p>

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
              <div
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}
              >
                {STACK.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.71rem',
                      padding: '0.22rem 0.6rem',
                      border: '1px solid var(--theme-border)',
                      color: 'var(--theme-fg-muted)',
                      background: 'rgba(var(--theme-accent-rgb), 0.05)',
                      borderRadius: '2px',
                    }}
                  >
                    {tech}
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
                  <Icon size={18} />
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

            {/* Botones de acción */}
            <div
              ref={actionsEl}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}
            >
              <a
                href="#contact"
                onClick={(e) => {
                  // Baja a la sección de contacto (contact.controller) sin
                  // cerrar el panel: ahora es una superficie permanente, no un
                  // modal. preventDefault evita el salto brusco.
                  e.preventDefault();
                  document
                    .getElementById('contact')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: 'var(--theme-accent)',
                  color: 'var(--theme-accent-on)',
                  textDecoration: 'none',
                  borderRadius: '2px',
                }}
              >
                Contactar <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </>
    );
  },
);

export default ContactPanel;
