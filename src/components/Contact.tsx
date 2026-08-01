'use client';

import { useRef } from 'react';
import VentanaContacto from '@/components/CodeWindow';
import { revelarBloqueAlEntrar, useEntradaLayout } from '@/lib/anim';

export default function Contacto({ bg }: { bg: string }) {
  const bloqueRef = useRef<HTMLDivElement>(null);

  // El bloque entero de contacto aparece de 0 a 100 al llegar a él scrolleando,
  // igual que el de proyectos.
  useEntradaLayout(() => {
    if (!bloqueRef.current) return;
    return revelarBloqueAlEntrar(bloqueRef.current);
  }, []);

  return (
    <section id="contact" className="py-16 sm:py-24" style={{ background: bg }}>
      <div ref={bloqueRef} className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-center">
          {/* Ventana de código (contact.controller.ts) centrada */}
          <div className="w-full max-w-2xl">
            <VentanaContacto />
          </div>
        </div>
      </div>
    </section>
  );
}
