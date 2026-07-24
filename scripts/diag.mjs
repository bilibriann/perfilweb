import sharp from 'sharp';
const SRC = './public/assets/patrol-caza.png';
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const minCh = (x,y)=>{const i=(y*W+x)*4;return Math.min(data[i],data[i+1],data[i+2]);};
// histograma de minCh en buckets de 32
const h = new Array(8).fill(0);
for (let y=0;y<H;y++) for(let x=0;x<W;x++) h[minCh(x,y)>>5]++;
const tot=W*H;
console.log('histograma minCh (bucket*32):');
h.forEach((c,i)=>console.log(`  ${i*32}-${i*32+31}: ${(100*c/tot).toFixed(1)}%`));
// grid 9x6 de minCh para ver gradiente
console.log('\ngrid minCh (9 col x 6 fil):');
for (let r=0;r<6;r++){
  let row='';
  for(let c=0;c<9;c++){ row += String(minCh(((c+0.5)/9*W)|0, ((r+0.5)/6*H)|0)).padStart(5); }
  console.log('  '+row);
}
