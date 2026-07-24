import sharp from 'sharp';
const OUT='./public/assets/patrol-caza-cut.png';
const { data, info } = await sharp(OUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const A=(x,y)=>data[(y*W+x)*4+3];
let trans=0,opac=0,mid=0;
for(let p=0;p<W*H;p++){const a=data[p*4+3]; if(a<30)trans++; else if(a>225)opac++; else mid++;}
const t=W*H;
console.log(`transp<30: ${(100*trans/t).toFixed(1)}%  opaco>225: ${(100*opac/t).toFixed(1)}%  medios: ${(100*mid/t).toFixed(1)}%`);
console.log('\ngrid alfa output (9 col x 6 fil):');
for(let r=0;r<6;r++){let row='';for(let c=0;c<9;c++){row+=String(A(((c+0.5)/9*W)|0,((r+0.5)/6*H)|0)).padStart(5);}console.log('  '+row);}
