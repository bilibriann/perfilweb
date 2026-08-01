'use client';

import ContactPanel from '@/components/ContactPanel/ContactPanel';

export default function Inicio() {
  return (
    <section
      id="home"
      // dvh y no vh: en móvil la barra del navegador se retrae y 100vh deja un
      // salto. pt-20 despeja la navbar fija (h-16) cuando el panel, apilado, ya
      // no cabe centrado en la pantalla.
      className="relative overflow-hidden flex items-center pt-20 pb-10 md:py-0"
      style={{ minHeight: '100dvh' }}
    >
      {/* Panel maestro/detalle de contactos. */}
      <div className="w-full max-w-5xl mx-auto">
        <ContactPanel />
      </div>
    </section>
  );
}
