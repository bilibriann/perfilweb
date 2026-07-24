// scripts/cut-bg.mjs — recorte de fondo blanco -> alfa. Ejecutar: node scripts/cut-bg.mjs
import sharp from 'sharp';

const SRC = './public/assets/patrol-caza.png';
const OUT = './public/assets/patrol-caza-cut.png';

const T_BG    = 215;   // (2) tolerancia flood-fill: min(r,g,b) >= T => candidato a fondo
const ERODE   = 1;     // (4) erosiona el 1er plano 1px (mata el halo claro del contorno)
const FEATHER = 0.8;   // (3) sigma blur del alfa (~1px, borde anti-aliased, NO binario)
const DESPILL = 0.75;  // (4) baja luminancia de píxeles semitransparentes (anti-halo)

// (1) cargar RGBA SIN trim -> conserva 1536x1024, escala/posición/ángulo intactos
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const N = W * H;
const minCh = (p) => Math.min(data[p * 4], data[p * 4 + 1], data[p * 4 + 2]);

// (2) flood-fill desde los 4 bordes con tolerancia -> solo fondo conectado al borde.
//     Los blancos/claros ENCERRADOS por la nave (interior) NO se tocan.
const isBg = new Uint8Array(N);
const stack = [];
const pushIf = (p) => { if (!isBg[p] && minCh(p) >= T_BG) { isBg[p] = 1; stack.push(p); } };
for (let x = 0; x < W; x++) { pushIf(x); pushIf((H - 1) * W + x); }
for (let y = 0; y < H; y++) { pushIf(y * W); pushIf(y * W + W - 1); }
while (stack.length) {
  const p = stack.pop(), x = p % W, y = (p / W) | 0;
  if (x > 0)   pushIf(p - 1);
  if (x < W - 1) pushIf(p + 1);
  if (y > 0)   pushIf(p - W);
  if (y < H - 1) pushIf(p + W);
}

// (4a) erosionar 1er plano = dilatar el fondo ERODE px (quita el anillo claro del borde)
for (let k = 0; k < ERODE; k++) {
  const grow = [];
  for (let p = 0; p < N; p++) {
    if (isBg[p]) continue;
    const x = p % W, y = (p / W) | 0;
    if ((x > 0 && isBg[p - 1]) || (x < W - 1 && isBg[p + 1]) || (y > 0 && isBg[p - W]) || (y < H - 1 && isBg[p + W]))
      grow.push(p);
  }
  for (const p of grow) isBg[p] = 1;
}

// alfa binaria (0 fondo / 255 nave)
const alphaBin = Buffer.alloc(N);
for (let p = 0; p < N; p++) alphaBin[p] = isBg[p] ? 0 : 255;

// (3) feather: desenfoque ligero SOLO del alfa -> bordes anti-aliased (no dientes de sierra)
const alphaSoft = await sharp(alphaBin, { raw: { width: W, height: H, channels: 1 } })
  .blur(FEATHER).raw().toBuffer();

// componer RGBA + (4b) despill: oscurece el rim semitransparente para que la nave
// oscura no quede con contorno blanco al ir sobre el espacio oscuro.
const out = Buffer.alloc(N * 4);
for (let p = 0; p < N; p++) {
  const a = alphaSoft[p];
  let r = data[p * 4], g = data[p * 4 + 1], b = data[p * 4 + 2];
  if (a > 0 && a < 255) { r = (r * DESPILL) | 0; g = (g * DESPILL) | 0; b = (b * DESPILL) | 0; }
  out[p * 4] = r; out[p * 4 + 1] = g; out[p * 4 + 2] = b; out[p * 4 + 3] = a;
}

await sharp(out, { raw: { width: W, height: H, channels: 4 } }).png().toFile(OUT);
console.log(`OK -> ${OUT} (${W}x${H})`);
