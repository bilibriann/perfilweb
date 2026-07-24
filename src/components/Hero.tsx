'use client';

import ContactPanel from '@/components/ContactPanel/ContactPanel';

export default function Inicio() {
  return (
    <section
      id="home"
      className="relative overflow-hidden flex items-center"
      style={{ minHeight: '100vh' }}
    >
      {/* Panel maestro/detalle de contactos. */}
      <div className="w-full max-w-5xl mx-auto">
        <ContactPanel />
      </div>
    </section>
  );
}
