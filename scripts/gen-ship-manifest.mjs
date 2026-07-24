// Genera src/lib/starships/manifest.ts a partir de los .jpg en public/ship.
// El nombre del archivo (sin extensión) es el nombre de la nave.
// Ejecutar: node scripts/gen-ship-manifest.mjs
import { readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const shipDir = join(root, 'public', 'ship');
const outFile = join(root, 'src', 'lib', 'starships', 'manifest.ts');

const archivos = readdirSync(shipDir)
  .filter((f) => f.toLowerCase().endsWith('.jpg'))
  .sort((a, b) => a.localeCompare(b, 'es'));

const items = archivos.map((archivo) => ({
  archivo,
  nombre: archivo.replace(/\.jpg$/i, ''),
}));

const cuerpo = items
  .map((n) => `  { archivo: ${JSON.stringify(n.archivo)}, nombre: ${JSON.stringify(n.nombre)} },`)
  .join('\n');

const contenido = `// GENERADO automáticamente por scripts/gen-ship-manifest.mjs — no editar a mano.
// Cada entrada corresponde a un archivo .jpg en public/ship.

export interface ArchivoNave {
  /** Nombre del archivo dentro de public/ship, p. ej. "A-wing.jpg". */
  archivo: string;
  /** Nombre de la nave (título del archivo sin extensión). */
  nombre: string;
}

export const NAVES_LOCALES: ArchivoNave[] = [
${cuerpo}
];
`;

writeFileSync(outFile, contenido, 'utf8');
console.log(`Manifiesto generado con ${items.length} naves -> ${outFile}`);
