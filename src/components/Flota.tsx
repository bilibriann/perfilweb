'use client';

import { useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PanelFlota from '@/components/ContactPanel/ContactPanel';
import { revelarBloqueAlEntrar, useEntradaLayout } from '@/lib/anim';

/**
 * Sección de la flota (API de naves). Antes ocupaba el hero; ahora cierra la
 * página y, como proyectos y contacto, aparece de 0 a 100 al llegar a ella
 * scrolleando.
 */
export default function Flota({ bg }: { bg: string }) {
  const bloqueRef = useRef<HTMLDivElement>(null);

  useEntradaLayout(() => {
    const bloque = bloqueRef.current;
    if (!bloque) return;

    const limpiar = revelarBloqueAlEntrar(bloque);

    // El panel se pinta después del fetch de naves: hasta entonces solo mide lo
    // que ocupa "Cargando flota…". Sin este refresh, ScrollTrigger se quedaría
    // con las posiciones del placeholder y dispararía el revelado a destiempo.
    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(bloque);

    return () => {
      ro.disconnect();
      limpiar();
    };
  }, []);

  return (
    <section id="flota" className="py-16 sm:py-24" style={{ background: bg }}>
      <div
        ref={bloqueRef}
        className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-center"
      >
        <PanelFlota />
      </div>
    </section>
  );
}
