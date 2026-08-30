'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import PerfilCard from '@/components/PerfilCard';
import VentanaContacto from '@/components/CodeWindow';
import {
  RETRASO_ENTRADA,
  animarEntrada,
  movimientoReducido,
  prepararEntrada,
  useEntradaLayout,
} from '@/lib/anim';

export default function Inicio() {
  const contactoRef = useRef<HTMLDivElement>(null);

  // La ventana de contacto entra cuando a la tarjeta de perfil le queda poco de
  // deslizamiento: las dos columnas aparecen como una sola coreografía en vez
  // de cada una por su cuenta.
  useEntradaLayout(() => {
    const el = contactoRef.current;
    if (!el || movimientoReducido()) return;

    const ctx = gsap.context(() => {
      prepararEntrada(el);
      animarEntrada(el, { delay: RETRASO_ENTRADA });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      // dvh y no vh: en móvil la barra del navegador se retrae y 100vh deja un
      // salto. pt-20 despeja la navbar fija (h-16) cuando las columnas, ya
      // apiladas, no caben centradas en la pantalla.
      // overflow-hidden: contiene el deslizamiento de entrada de la tarjeta.
      className="relative overflow-hidden flex items-center pt-24 pb-12 lg:py-24"
      style={{ minHeight: '100dvh' }}
    >
      {/* Rectángulo centrado: 60% información / 40% contacto. Bajo lg se apila
          (perfil arriba, contacto abajo). */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5 lg:gap-7 items-center">
          <PerfilCard />

          {/* Ventana de código (contact.controller.ts): antes era la última
              sección de la página, ahora vive en el hero. Conserva el
              id="contact" para que los anclajes sigan funcionando. */}
          <div id="contact" ref={contactoRef} className="scroll-mt-24 w-full">
            <VentanaContacto />
          </div>
        </div>
      </div>
    </section>
  );
}
