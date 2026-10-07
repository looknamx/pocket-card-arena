import sharp from 'sharp';
import fs from 'node:fs';
import {cards} from '../src/cards.js';
fs.mkdirSync('public/characters',{recursive:true});
const tiles=[];
for(const c of cards){
 const source=`assets/characters/source/${c.id}-v2.png`;
 const meta=await sharp(source).metadata();
 const stats=await sharp(source).stats();
 if(!meta.hasAlpha||stats.channels.at(-1).min!==0)throw Error(`${c.id}: transparent alpha missing`);
 // Mechanical export only: preserve artwork/alpha; normalize canvas and compress.
 await sharp(source).resize(512,512,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png({compressionLevel:9,palette:false}).toFile(`public/characters/${c.id}-v2.png`);
 const thumb=await sharp(source).resize(250,250,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).toBuffer();
 const i=tiles.length;tiles.push({input:thumb,left:(i%4)*280+15,top:Math.floor(i/4)*280+15});
 console.log(`${c.id}: ${meta.width}x${meta.height} RGBA -> 512x512, alpha preserved`);
}
fs.mkdirSync('output/playwright',{recursive:true});
await sharp({create:{width:1120,height:560,channels:4,background:'#f8f2e3'}}).composite(tiles).png().toFile('output/playwright/character-art-contact.png');
