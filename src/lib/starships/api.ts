// ─── Star Wars — capa de datos ──────────────────────────────────────────────
// Todo es LOCAL: las imágenes están en public/ship (ver manifest.ts) y la
// información (descripción + specs) está pre-generada en info.ts. Ambos se
// producen en build con scripts/gen-ship-manifest.mjs y gen-ship-info.mjs.
// En runtime NO se llama a ninguna API: el sitio estático carga al instante y
// no depende de CORS ni de que un servicio externo siga en pie.

import { NAVES_LOCALES } from './manifest';
import { INFO_NAVES } from './info';

export interface EspecificacionesNave {
  model?: string;
  manufacturer?: string;
  crew?: string;
  passengers?: string;
  maxSpeed?: string;
  hyperdrive?: string;
}

export interface Nave {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  specs: EspecificacionesNave;
}

/** Ruta pública de la imagen local de una nave. */
function rutaImagen(archivo: string): string {
  return `/ship/${encodeURIComponent(archivo)}`;
}

// ─── Normalización de texto (sin acentos, sin mayúsculas) ───────────────────
// Debe coincidir con la de scripts/gen-ship-info.mjs (misma clave de índice).
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

// ─── Carga del catálogo: imágenes locales + info pre-generada ───────────────
// Une el manifiesto (una nave por imagen) con INFO_NAVES por nombre normalizado.
// Es síncrono, pero mantiene firma asíncrona (y acepta el AbortSignal que pasan
// los componentes) para no tocar sus llamadas; el signal ya no hace falta.
export async function cargarNaves(signal?: AbortSignal): Promise<Nave[]> {
  void signal; // aceptado por compatibilidad; sin fetch, no hay nada que abortar
  return NAVES_LOCALES.map((local) => {
    const clave = normalizar(local.nombre);
    const info = INFO_NAVES[clave];
    return {
      id: clave,
      nombre: local.nombre,
      descripcion: info?.descripcion ?? '',
      imagen: rutaImagen(local.archivo),
      specs: info?.specs ?? {},
    };
  });
}

// ─── Filtrado en memoria por nombre (sin acentos / mayúsculas) ──────────────
export function filtrarNaves(naves: Nave[], consulta: string): Nave[] {
  const q = normalizar(consulta);
  if (!q) return naves;
  return naves.filter((n) => normalizar(n.nombre).includes(q));
}

// ─── Specs a lista de pares etiqueta/valor (solo los presentes) ─────────────
export function specsComoLista(specs: EspecificacionesNave): { etiqueta: string; valor: string }[] {
  const mapa: [keyof EspecificacionesNave, string][] = [
    ['model', 'Modelo'],
    ['manufacturer', 'Fabricante'],
    ['crew', 'Tripulación'],
    ['passengers', 'Pasajeros'],
    ['maxSpeed', 'Velocidad máx.'],
    ['hyperdrive', 'Hiperimpulsor'],
  ];
  return mapa
    .filter(([clave]) => specs[clave])
    .map(([clave, etiqueta]) => ({ etiqueta, valor: specs[clave]! }));
}
