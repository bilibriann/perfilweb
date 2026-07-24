// Genera src/lib/starships/info.ts: descripción + specs de cada nave, UNA VEZ,
// en tiempo de build (no en runtime). Así el sitio estático no depende de
// ninguna API ni sufre CORS al cargarse.
//
//   Descripciones -> Wookieepedia (MediaWiki api.php, action=parse, sección 0).
//                    Es la única fuente con artículo por nave y sin bloqueo de
//                    Cloudflare. Se limpia el wikitext a 1-2 frases.
//   Specs         -> SWAPI (swapi.info). Cobertura parcial (~9 naves); lo que
//                    falta queda vacío y el visor muestra "—".
//
// Ejecutar:  node scripts/gen-ship-info.mjs
// El catálogo de naves sale de public/ship (mismos .jpg que el manifiesto).

import { readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const shipDir = join(root, 'public', 'ship');
const outFile = join(root, 'src', 'lib', 'starships', 'info.ts');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Misma normalización que src/lib/starships/api.ts (clave de emparejamiento).
function normalizar(t) {
  return t
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

// ─── Mapa de títulos de Wookieepedia ────────────────────────────────────────
// Solo las naves cuyo nombre de archivo NO resuelve directo por redirección.
// (Verificado a mano: todas devuelven artículo correcto.)
const TITULO_WOOKIEE = {
  'A-wing': 'RZ-1 A-wing interceptor',
  'Arc-170': 'ARC-170 starfighter',
  'Belbullab-22': 'Belbullab-22 starfighter',
  'Delta-7 Aethersprite': 'Delta-7 Aethersprite-class light interceptor',
  Devastator: 'Devastator',
  'Droid Tri-Fighter': 'Droid tri-fighter',
  'Eta2 - Interceptor': 'Eta-2 Actis-class light interceptor',
  'Fang Fighter': 'Fang fighter',
  'Gauntlet Fighter': "Kom'rk-class fighter/transport",
  'Hyena Bomber': 'Hyena-class bomber',
  Malevolence: 'Malevolence',
  'N-1 Naboo Starfighter': 'N-1 starfighter',
  'Naboo Royal Starship': 'J-type 327 Nubian royal starship',
  'Resistance X-wing': 'T-70 X-wing starfighter',
  'Resistance Y-wing': 'BTA-NR2 Y-wing starfighter',
  'Rogue-class Starfighter': 'Rogue-class starfighter',
  'RZ-1 A-wing': 'RZ-1 A-wing interceptor',
  'TIE Advanced v1': 'TIE/sk x1 experimental air superiority fighter',
  'TIE Whisper': 'TIE/wi modified interceptor',
  'Vulture Droid': 'Vulture-class droid starfighter',
  // Naves de nombre propio del usuario (no canónicas): apuntadas a su equivalente.
  caza: 'TIE/ln space superiority starfighter',
  cazadarkvader: 'TIE Advanced x1',
};

// ─── Nombre en SWAPI cuando difiere del nombre de archivo ───────────────────
const NOMBRE_SWAPI = {
  'Arc-170': 'arc-170',
  'Belbullab-22': 'Belbullab-22 starfighter',
  'Slave I': 'Slave 1',
  cazadarkvader: 'TIE Advanced x1',
  caza: 'TIE/ln space superiority starfighter',
};

// ─── Limpieza de wikitext -> 1-2 frases en texto plano ──────────────────────
function limpiarWikitext(wt) {
  let t = wt;
  // Plantillas {{...}} anidadas: varias pasadas de dentro hacia fuera.
  for (let i = 0; i < 8; i++) t = t.replace(/\{\{[^{}]*\}\}/g, '');
  // Tablas {|...|}, refs, comentarios y etiquetas HTML.
  t = t
    .replace(/\{\|[\s\S]*?\|\}/g, '')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '')
    .replace(/<ref[^>]*\/>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\[\[(?:File|Image|Archivo):[^\]]*\]\]/gi, '')
    .replace(/<[^>]+>/g, '');
  // Enlaces: [[destino|texto]] -> texto ; [[texto]] -> texto.
  t = t.replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, '$1');
  // Enlaces externos [http... etiqueta] -> etiqueta.
  t = t.replace(/\[https?:\/\/\S+\s+([^\]]+)\]/g, '$1').replace(/\[https?:\/\/\S+\]/g, '');
  // Negrita/cursiva y pronunciaciones "(pronounced /.../)".
  t = t.replace(/'''?/g, '').replace(/\(pronounced[^)]*\)/gi, '');
  // Primera línea de prosa real.
  const linea =
    t
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .find((s) => /^["A-Z]/.test(s)) || '';
  // Espacios y recorte a ~2 frases (máx. ~320 chars, corte en punto).
  const prosa = linea.replace(/\s+/g, ' ').trim();
  if (prosa.length <= 320) return prosa;
  const corte = prosa.slice(0, 320);
  const fin = corte.lastIndexOf('. ');
  return (fin > 120 ? corte.slice(0, fin + 1) : corte.trim() + '…').trim();
}

async function descripcion(nombre) {
  const titulo = TITULO_WOOKIEE[nombre] || nombre;
  const url =
    'https://starwars.fandom.com/api.php?action=parse&page=' +
    encodeURIComponent(titulo.replace(/ /g, '_')) +
    '&prop=wikitext&section=0&redirects=1&format=json';
  try {
    const res = await fetch(url, { headers: { accept: 'application/json', 'user-agent': UA } });
    if (!res.ok) return { desc: '', nota: `HTTP ${res.status}` };
    const json = await res.json();
    if (json.error) return { desc: '', nota: json.error.code };
    const wt = json.parse?.wikitext?.['*'] || '';
    const desc = limpiarWikitext(wt);
    return { desc, nota: desc ? 'ok' : 'vacío' };
  } catch (err) {
    return { desc: '', nota: err.message };
  }
}

// ─── Specs desde SWAPI (una sola llamada, mapa por nombre normalizado) ───────
function limpiarSpec(v) {
  if (!v) return undefined;
  const s = String(v).trim();
  if (!s || /^(n\/a|unknown|none)$/i.test(s)) return undefined;
  return s;
}

async function cargarSpecs() {
  const mapa = new Map();
  try {
    const res = await fetch('https://swapi.info/api/starships', {
      headers: { accept: 'application/json', 'user-agent': UA },
    });
    if (!res.ok) return mapa;
    const json = await res.json();
    const naves = Array.isArray(json) ? json : json?.results ?? [];
    for (const n of naves) {
      if (!n.name) continue;
      mapa.set(normalizar(n.name), {
        model: limpiarSpec(n.model),
        manufacturer: limpiarSpec(n.manufacturer),
        crew: limpiarSpec(n.crew),
        passengers: limpiarSpec(n.passengers),
        maxSpeed: limpiarSpec(n.max_atmosphering_speed),
        hyperdrive: limpiarSpec(n.hyperdrive_rating),
      });
    }
  } catch (err) {
    console.warn('SWAPI no disponible:', err.message);
  }
  return mapa;
}

// ─── Serialización de un objeto a literal TS compacto (sin claves vacías) ────
function specToLiteral(specs) {
  const pares = Object.entries(specs || {}).filter(([, v]) => v);
  if (pares.length === 0) return '{}';
  return '{ ' + pares.map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(', ') + ' }';
}

// ─── Programa ────────────────────────────────────────────────────────────────
const nombres = readdirSync(shipDir)
  .filter((f) => f.toLowerCase().endsWith('.jpg'))
  .map((f) => f.replace(/\.jpg$/i, ''))
  .sort((a, b) => a.localeCompare(b, 'es'));

console.log(`Cargando specs de SWAPI…`);
const specsPorNombre = await cargarSpecs();

const entradas = [];
let conDesc = 0;
let conSpecs = 0;

for (const nombre of nombres) {
  const clave = normalizar(nombre);
  const nombreSwapi = NOMBRE_SWAPI[nombre] || nombre;
  const specs = specsPorNombre.get(normalizar(nombreSwapi)) || {};

  const { desc, nota } = await descripcion(nombre);
  if (desc) conDesc++;
  if (Object.values(specs).some(Boolean)) conSpecs++;

  console.log(`${desc ? '✓' : '✗'} ${nombre.padEnd(26)} desc:${nota}`);
  entradas.push({ clave, desc, specs });
  await sleep(350); // amable con Wookieepedia
}

const cuerpo = entradas
  .map(
    (e) =>
      `  ${JSON.stringify(e.clave)}: { descripcion: ${JSON.stringify(
        e.desc,
      )}, specs: ${specToLiteral(e.specs)} },`,
  )
  .join('\n');

const contenido = `// GENERADO automáticamente por scripts/gen-ship-info.mjs — no editar a mano.
// Descripciones: Wookieepedia (starwars.fandom.com). Specs: SWAPI (swapi.info).
// Indexado por nombre de nave normalizado (sin acentos, minúsculas).
// Regenerar:  node scripts/gen-ship-info.mjs

export interface SpecsNave {
  model?: string;
  manufacturer?: string;
  crew?: string;
  passengers?: string;
  maxSpeed?: string;
  hyperdrive?: string;
}

export interface InfoNave {
  descripcion: string;
  specs: SpecsNave;
}

export const INFO_NAVES: Record<string, InfoNave> = {
${cuerpo}
};
`;

writeFileSync(outFile, contenido, 'utf8');
console.log(
  `\nGenerado ${outFile}\n  ${entradas.length} naves · ${conDesc} con descripción · ${conSpecs} con specs`,
);
