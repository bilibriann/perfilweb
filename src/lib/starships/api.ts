// ─── Star Wars — capa de datos ──────────────────────────────────────────────
// Las IMÁGENES son locales (public/ship, ver manifest.ts): el catálogo se arma
// desde el nombre de cada archivo .jpg. La INFORMACIÓN de cada nave (descripción
// y specs) se sigue trayendo de las APIs (Databank + SWAPI), haciendo match por
// nombre. Si las APIs fallan, las naves se muestran igual con imagen + nombre.

import { NAVES_LOCALES } from './manifest';

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

const DATABANK_URL = 'https://starwars-databank-server.vercel.app/api/v1/vehicles';
const SWAPI_URL = 'https://swapi.info/api/starships';
const LIMIT = 20;
const MAX_PAGINAS = 30; // salvaguarda anti-bucle infinito

/** Ruta pública de la imagen local de una nave. */
function rutaImagen(archivo: string): string {
  return `/ship/${encodeURIComponent(archivo)}`;
}

// ─── Normalización de texto (sin acentos, sin mayúsculas) ───────────────────
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

// ─── Descripciones desde el Databank (paginado, opcional) ───────────────────
// La respuesta suele venir como { data: [...] }. Iteramos hasta que una página
// venga vacía o con menos elementos que el límite. Solo usamos name+description;
// las imágenes del Databank se ignoran (ahora son locales).

interface ItemDatabank {
  name?: string;
  description?: string;
}

function extraerLista(json: unknown): ItemDatabank[] {
  if (Array.isArray(json)) return json as ItemDatabank[];
  if (json && typeof json === 'object' && Array.isArray((json as { data?: unknown }).data)) {
    return (json as { data: ItemDatabank[] }).data;
  }
  return [];
}

async function fetchPaginaDatabank(pagina: number, signal?: AbortSignal): Promise<ItemDatabank[]> {
  const res = await fetch(`${DATABANK_URL}?page=${pagina}&limit=${LIMIT}`, { signal });
  if (!res.ok) throw new Error(`Databank respondió ${res.status}`);
  return extraerLista(await res.json());
}

// Devuelve un mapa normalizado nombre -> descripción. Tolerante a fallos.
async function fetchDescripciones(signal?: AbortSignal): Promise<Map<string, string>> {
  const mapa = new Map<string, string>();
  try {
    for (let pagina = 1; pagina <= MAX_PAGINAS; pagina++) {
      const lote = await fetchPaginaDatabank(pagina, signal);
      for (const item of lote) {
        const desc = item.description?.trim();
        if (item.name && desc) mapa.set(normalizar(item.name), desc);
      }
      if (lote.length < LIMIT) break; // última página
    }
  } catch (err) {
    if ((err as { name?: string })?.name === 'AbortError') throw err;
    // Databank es opcional: si falla, seguimos sin descripciones.
  }
  return mapa;
}

// ─── Specs desde SWAPI (opcional, tolerante a fallos) ────────────────────────

interface StarshipSWAPI {
  name?: string;
  model?: string;
  manufacturer?: string;
  crew?: string;
  passengers?: string;
  max_atmosphering_speed?: string;
  hyperdrive_rating?: string;
}

// Descarta valores vacíos o desconocidos ("n/a", "unknown", "none").
function limpiar(valor?: string): string | undefined {
  if (!valor) return undefined;
  const v = valor.trim();
  if (!v || /^(n\/a|unknown|none)$/i.test(v)) return undefined;
  return v;
}

// Devuelve un mapa normalizado nombre -> specs. Tolerante a fallos.
async function fetchSpecs(signal?: AbortSignal): Promise<Map<string, EspecificacionesNave>> {
  const mapa = new Map<string, EspecificacionesNave>();
  try {
    const res = await fetch(SWAPI_URL, { signal });
    if (!res.ok) return mapa;
    const json = await res.json();
    const naves: StarshipSWAPI[] = Array.isArray(json) ? json : (json?.results ?? []);
    for (const n of naves) {
      if (!n.name) continue;
      mapa.set(normalizar(n.name), {
        model: limpiar(n.model),
        manufacturer: limpiar(n.manufacturer),
        crew: limpiar(n.crew),
        passengers: limpiar(n.passengers),
        maxSpeed: limpiar(n.max_atmosphering_speed),
        hyperdrive: limpiar(n.hyperdrive_rating),
      });
    }
  } catch (err) {
    if ((err as { name?: string })?.name === 'AbortError') throw err;
    // SWAPI es opcional: si falla, seguimos sin specs.
  }
  return mapa;
}

// ─── Carga completa: imágenes locales + info de las APIs por nombre ─────────
// El catálogo lo define el manifiesto local (una nave por imagen). La info
// (descripción y specs) se pide en paralelo y se fusiona por nombre. Si las
// APIs fallan, cada nave conserva su imagen y su nombre.
export async function cargarNaves(signal?: AbortSignal): Promise<Nave[]> {
  const [descripciones, specs] = await Promise.all([
    fetchDescripciones(signal),
    fetchSpecs(signal),
  ]);

  return NAVES_LOCALES.map((local) => {
    const clave = normalizar(local.nombre);
    return {
      id: clave,
      nombre: local.nombre,
      descripcion: descripciones.get(clave) ?? '',
      imagen: rutaImagen(local.archivo),
      specs: specs.get(clave) ?? {},
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
