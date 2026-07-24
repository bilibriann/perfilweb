'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import VentanaContacto from '@/components/CodeWindow';

export default function Contacto({ bg }: { bg: string }) {
  const refSeccion = useRef(null);
  const enVista    = useInView(refSeccion, { once: true, margin: '-80px' });

  return (
    <section id="contact" className="py-24" style={{ background: bg }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={refSeccion}
          initial={{ opacity: 0, y: 16 }}
          animate={enVista ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center"
        >
          {/* Ventana de código (contact.controller.ts) centrada */}
          <div className="w-full max-w-2xl">
            <VentanaContacto />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
