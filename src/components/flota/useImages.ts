'use client';

import { useEffect, useState } from 'react';
import type { FlotaImagen, ImagenCargada } from './types';

/**
 * Precarga las imágenes locales y reporta el progreso (0..1). Las que fallen se
 * descartan. `imagenes` debe ser una referencia ESTABLE (useMemo en el llamante).
 */
export function useImages(imagenes: FlotaImagen[]) {
  const [cargadas, setCargadas] = useState<ImagenCargada[]>([]);
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    let vivo = true;
    let hechas = 0;
    const total = imagenes.length;
    const acc: ImagenCargada[] = [];

    if (total === 0) {
      setProgreso(1);
      setCargadas([]);
      return;
    }

    setProgreso(0);
    setCargadas([]);

    const marcar = () => {
      if (!vivo) return;
      hechas += 1;
      setProgreso(hechas / total);
      if (hechas === total) setCargadas(acc.slice());
    };

    const els: HTMLImageElement[] = imagenes.map((meta) => {
      const el = new Image();
      el.crossOrigin = 'anonymous';
      el.onload = () => {
        acc.push({ ...meta, el });
        marcar();
      };
      el.onerror = () => marcar();
      el.src = meta.src;
      return el;
    });

    return () => {
      vivo = false;
      for (const el of els) {
        el.onload = null;
        el.onerror = null;
      }
    };
  }, [imagenes]);

  return { cargadas, progreso, listo: progreso >= 1 };
}
