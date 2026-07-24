import sharp from 'sharp';
import { readFileSync } from 'fs';

const OUT = './public/assets/patrol-caza-cut.png';
const SRC = './public/assets/patrol-caza.png';

// colorType directo del header PNG
const b = readFileSync(OUT);
const colorType = b[25];
const types = { 0: 'grayscale', 2: 'RGB', 3: 'paleta', 4: 'gray+alfa', 6: 'RGBA' };
console.log(`colorType: ${colorType} => ${types[colorType]}`);

// alfa de esquinas (raw RGBA)
const { data, info } = await sharp(OUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const A = (x, y) => data[(y * W + x) * 4 + 3];
console.log('alfa esquinas:', 'TL', A(2, 2), 'TR', A(W - 3, 2), 'BL', A(2, H - 3), 'BR', A(W - 3, H - 3));

// cobertura: % de píxeles opacos (para detectar si "se comió" demasiado)
let opac = 0;
for (let p = 0; p < W * H; p++) if (data[p * 4 + 3] > 200) opac++;
console.log(`opacos(>200): ${(100 * opac / (W * H)).toFixed(1)}%`);

// preview: componer sobre fondo oscuro #0b0f18 (a tamaño completo) y luego escalar
const composed = await sharp({ create: { width: W, height: H, channels: 4, background: { r: 11, g: 15, b: 24, alpha: 1 } } })
  .composite([{ input: OUT }])
  .png()
  .toBuffer();
await sharp(composed).resize(900).png().toFile('./scripts/preview-cut.png');
console.log('preview -> ./scripts/preview-cut.png');

// diagnóstico esquina BL: ¿nave real o fallo de flood-fill? (color original)
const orig = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const od = orig.data, OW = orig.info.width;
const oc = (x, y) => [od[(y * OW + x) * 4], od[(y * OW + x) * 4 + 1], od[(y * OW + x) * 4 + 2]];
console.log('BL original px(2,H-3):', oc(2, H - 3), '| px(10,H-10):', oc(10, H - 10));

// conteo de "islas" opacas pequeñas = speckle del patrón de puntos
let speckle = 0;
for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
  const p = y * W + x;
  if (data[p * 4 + 3] > 200 &&
      data[(p - 1) * 4 + 3] < 50 && data[(p + 1) * 4 + 3] < 50 &&
      data[(p - W) * 4 + 3] < 50 && data[(p + W) * 4 + 3] < 50) speckle++;
}
console.log('píxeles opacos aislados (speckle):', speckle);
