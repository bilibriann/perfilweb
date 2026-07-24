// ─── Tipos de la galería flotante (FlotaEstelar) ────────────────────────────

/** Entrada declarativa: ruta en /public + nombre a mostrar. */
export interface FlotaImagen {
  src: string;
  nombre: string;
}

/** Imagen ya precargada (con su HTMLImageElement listo para el canvas). */
export interface ImagenCargada extends FlotaImagen {
  el: HTMLImageElement;
}

/** Paleta neón/HUD fija (independiente del tema del sitio). */
export const PALETA = {
  bg: '#01012A',
  cyan: '#33def4',
  cyan2: '#03E2E7',
  pink: '#FE296D',
  txt: '#e8f1ff',
} as const;
