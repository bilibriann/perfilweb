import sharp from 'sharp';
const OUT='./public/assets/patrol-caza-cut.png';
const meta = await sharp(OUT).metadata();
const {width:W,height:H}=meta;
async function over(bg,name,resize){
  const c = await sharp({create:{width:W,height:H,channels:4,background:bg}})
    .composite([{input:OUT}]).png().toBuffer();
  let s = sharp(c); if(resize) s=s.resize(resize);
  await s.png().toFile(name);
}
await over({r:255,g:0,b:255,alpha:1}, './scripts/prev-magenta.png', 1100);
await over({r:11,g:15,b:24,alpha:1}, './scripts/prev-space.png', 1100);
console.log('ok');
