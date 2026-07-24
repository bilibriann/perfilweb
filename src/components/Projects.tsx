'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { Github, Globe, Package, ArrowUpRight } from 'lucide-react';

interface Enlace {
  etiqueta: string;
  url: string;
}

interface Proyecto {
  titulo: string;
  descripcion: string;
  etiquetas: string[];
  enlaces: Enlace[];
  icono: React.ReactNode;
  /** Vista previa del sitio (screenshot vía mShots). Si falta, se usa el icono. */
  imagen?: string;
}

/** Screenshot en vivo del sitio mediante el servicio mShots de WordPress. */
function preview(url: string): string {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=320&h=200`;
}

const PROYECTOS: Proyecto[] = [
  {
    titulo: 'Bodega Ecole — API de Gestión de Inventario',
    descripcion:
      'API REST en NestJS/TypeScript sobre MySQL (TypeORM) con autenticación JWT, roles y documentación Swagger. Pipeline CI/CD en GitHub Actions con enfoque DevSecOps (Gitleaks, Trivy, CodeQL y Dependabot en cada push) e imagen Docker endurecida (build multi-stage, usuario no-root). Despliegue en la nube: backend en Render, MySQL gestionada en Aiven (SSL) y frontend React en Vercel.',
    etiquetas: [
      'NestJS',
      'TypeScript',
      'MySQL',
      'Docker',
      'GitHub Actions',
      'React',
    ],
    enlaces: [
      { etiqueta: 'Demo', url: 'https://bodega-eco.vercel.app' },
      { etiqueta: 'API', url: 'https://bodega-eco.onrender.com/docs' },
      { etiqueta: 'GitHub', url: 'https://github.com/bilibriann/bodega-ecole' },
    ],
    icono: <Package size={26} />,
    imagen: preview('https://bodega-eco.vercel.app'),
  },
  {
    titulo: 'Calvary Santiago — Sitio Institucional',
    descripcion:
      'Sitio web institucional para iglesia critiana. Next.js, React, TypeScript y Tailwind CSS con arquitectura MVC en el backend, diseño responsivo y despliegue en Hostinger.',
    etiquetas: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'MVC',
      'Hostinger',
    ],
    enlaces: [{ etiqueta: 'Web', url: 'https://calvarysantiago.cl/' }],
    icono: <Globe size={26} />,
    imagen: preview('https://calvarysantiago.cl/'),
  },
  {
    titulo: 'Marea Alta — Sitio Web Institucional',
    descripcion:
      'Sitio web institucional para cliente particular. Next.js, React, TypeScript y Tailwind CSS con arquitectura MVC en el backend, diseño responsivo y despliegue en Hostinger.',
    etiquetas: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'MVC',
      'Hostinger',
    ],
    enlaces: [],
    icono: <Globe size={26} />,
  },
];

export default function SeccionProyectos({ bg }: { bg: string }) {
  const refSeccion = useRef<HTMLDivElement>(null);
  const enVista = useInView(refSeccion, { once: true, margin: '-80px' });

  // --- Refs de la mecánica "Magic Area" -------------------------------------
  const contenedorRef = useRef<HTMLDivElement>(null); // ancla relativa
  const magicRef = useRef<HTMLDivElement>(null); // recuadro que se desliza
  const tarjetasRef = useRef<(HTMLDivElement | null)[]>([]);

  // Timeouts compartidos (delay de hover 100ms / restauración 400ms)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Índice del proyecto "originalmente activo" (al que se vuelve al salir)
  const originalActive = useRef(0);
  const [activo, setActivo] = useState(0);

  /**
   * Desliza la magic-area (y su barra) hasta la tarjeta indicada.
   * Calcula coordenadas relativas al contenedor (position:relative).
   */
  function moveMagicArea(indice: number, instant = false) {
    const contenedor = contenedorRef.current;
    const magic = magicRef.current;
    const tarjeta = tarjetasRef.current[indice];
    if (!contenedor || !magic || !tarjeta) return;

    // Geometría de LAYOUT (offset*), no visual: es inmune al transform:scale del
    // contenedor de proyectos. getBoundingClientRect devolvería medidas ya
    // escaladas que, aplicadas al resaltado que vive dentro del mismo contexto
    // escalado, lo encogen y lo dejan corto antes de la miniatura. offsetParent
    // de cada tarjeta es `contenedor` (position: relative), igual que la magic-
    // area, así que las coordenadas coinciden.
    const props = {
      x: tarjeta.offsetLeft,
      y: tarjeta.offsetTop,
      width: tarjeta.offsetWidth,
      height: tarjeta.offsetHeight,
    };

    if (instant) {
      gsap.set(magic, props);
    } else {
      gsap.to(magic, { ...props, duration: 0.35, ease: 'power3.out' });
    }
  }

  /** Marca una tarjeta como activa y mueve la magic-area hacia ella. */
  function setActiveItem(indice: number) {
    setActivo(indice);
    moveMagicArea(indice);
  }

  // --- Posicionamiento inicial + reposición en resize -----------------------
  useLayoutEffect(() => {
    moveMagicArea(originalActive.current, true);
    if (magicRef.current) {
      gsap.set(magicRef.current, { opacity: 1 }); // evita el "salto" inicial
    }
  }, []);

  useEffect(() => {
    const onResize = () => moveMagicArea(activo, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      if (wrapperTimeout.current) clearTimeout(wrapperTimeout.current);
    };
  }, [activo]);

  // --- Handlers de hover ----------------------------------------------------
  function handleEnter(indice: number) {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    if (wrapperTimeout.current) clearTimeout(wrapperTimeout.current);
    if (indice === activo) return;

    hoverTimeout.current = setTimeout(() => setActiveItem(indice), 100);
  }

  function handleLeaveContenedor() {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    if (wrapperTimeout.current) clearTimeout(wrapperTimeout.current);

    wrapperTimeout.current = setTimeout(() => {
      if (originalActive.current !== activo)
        setActiveItem(originalActive.current);
    }, 400);
  }

  return (
    <section id="projects" className="py-24" style={{ background: bg }}>
      {/* Escala del contenedor de proyectos (mismo patrón que ContactPanel).
          1 = tamaño normal. Baja --cell-scale para achicar todo el bloque. */}
      <div
        className="max-w-3xl mx-auto px-6"
        style={
          {
            '--cell-scale': 0.8,
            transform: 'scale(var(--cell-scale))',
            transformOrigin: 'top center',
          } as CSSProperties
        }
      >
        {/* Encabezado */}
        <motion.div
          ref={refSeccion}
          initial={{ opacity: 0, y: 16 }}
          animate={enVista ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-12"
        ></motion.div>

        {/* Contenedor relativo: ancla de la magic-area */}
        <div
          ref={contenedorRef}
          className="relative"
          onMouseLeave={handleLeaveContenedor}
        >
          {/* Magic Area: recuadro único que se desliza tras la tarjeta activa */}
          <div
            ref={magicRef}
            aria-hidden
            className="pointer-events-none absolute top-0 left-0"
            style={{
              width: 0,
              height: 0,
              opacity: 0,
              borderRadius: 4,
              background: 'rgba(var(--theme-accent-rgb), 0.10)',
              border: '1px solid rgba(var(--theme-accent-rgb), 0.25)',
              zIndex: 0,
            }}
          >
            {/* Barra de acento a la izquierda (viaja con la magic-area) */}
            <span
              aria-hidden
              style={{
                position: 'absolute',
                left: -3,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 6,
                height: '70%',
                borderRadius: 2,
                background: 'var(--theme-accent)',
              }}
            />
          </div>

          {/* Tarjetas de proyecto */}
          {PROYECTOS.map((proyecto, indice) => (
            <div
              key={proyecto.titulo}
              ref={(el) => {
                tarjetasRef.current[indice] = el;
              }}
              onMouseEnter={() => handleEnter(indice)}
              onClick={() => {
                originalActive.current = indice;
                setActiveItem(indice);
              }}
              className="relative z-[1] flex items-center justify-between gap-5 p-5"
              style={{ color: 'var(--theme-fg)' }}
            >
              {/* Izquierda: título + descripción + etiquetas + enlaces */}
              <div className="min-w-0">
                <h3
                  className="text-lg font-semibold mb-1.5"
                  style={{ color: 'var(--theme-fg)' }}
                >
                  {proyecto.titulo}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-3"
                  style={{ color: 'var(--theme-fg-muted)' }}
                >
                  {proyecto.descripcion}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {proyecto.etiquetas.map((etiqueta) => (
                    <span
                      key={etiqueta}
                      className="text-[11px] px-2 py-0.5 rounded-sm"
                      style={{
                        color: 'var(--theme-fg-dim)',
                        border: '1px solid var(--theme-border)',
                        background: 'var(--theme-bg-alt)',
                      }}
                    >
                      {etiqueta}
                    </span>
                  ))}
                </div>

                {/* Enlaces del proyecto (Demo / API / GitHub / Web) */}
                {proyecto.enlaces.length > 0 && (
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                    {proyecto.enlaces.map((enlace) => (
                      <a
                        key={enlace.url}
                        href={enlace.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
                        style={{ color: 'var(--theme-accent)' }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.color =
                            'var(--theme-fg)')
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.color =
                            'var(--theme-accent)')
                        }
                      >
                        {enlace.etiqueta}
                        <ArrowUpRight size={13} />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Derecha: vista previa del sitio (o icono de respaldo) */}
              <Miniatura
                activa={activo === indice}
                imagen={proyecto.imagen}
                alt={proyecto.titulo}
              >
                {proyecto.icono}
              </Miniatura>
            </div>
          ))}
        </div>

        {/* Pie con enlace a GitHub */}
        <div className="mt-10 flex justify-center">
          <a
            href="https://github.com/bilibriann"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: 'var(--theme-fg-muted)' }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                'var(--theme-accent)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                'var(--theme-fg-muted)')
            }
          >
            <Github size={16} />
            Ver más en GitHub
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * Miniatura rectangular (160×100) a la derecha de cada tarjeta.
 * Pasa de tono apagado (grayscale del diseño original) a color de acento
 * cuando su tarjeta está activa.
 */
function Miniatura({
  activa,
  imagen,
  alt,
  children,
}: {
  activa: boolean;
  imagen?: string;
  alt?: string;
  children: React.ReactNode;
}) {
  const [error, setError] = useState(false);
  const mostrarImagen = Boolean(imagen) && !error;

  return (
    <div
      className="shrink-0 flex items-center justify-center overflow-hidden transition-all duration-300"
      style={{
        width: 160,
        height: 100,
        borderRadius: 2,
        border: '1px solid var(--theme-border)',
        background: 'var(--theme-bg-alt)',
        color: activa ? 'var(--theme-accent)' : 'var(--theme-fg-dim)',
        filter: activa ? 'grayscale(0%)' : 'grayscale(100%)',
        opacity: activa ? 1 : 0.7,
      }}
    >
      {mostrarImagen ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imagen}
          alt={alt ?? ''}
          loading="lazy"
          draggable={false}
          onError={() => setError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        children
      )}
    </div>
  );
}
