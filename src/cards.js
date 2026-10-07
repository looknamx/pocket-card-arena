import {tactics,tacticalStatuses} from './tactics.js';
export const CONFIG={switches:3,maxEnergy:6,elementAdvantage:1.25,elementDisadvantage:0.8};
const skill=(name,multiplier,effect=null)=>({name,multiplier,effect,cost:3,cooldown:2});
export const cards=[
{id:'ember',name:'ฟ็อกซ์ฟู',element:'fire',role:'นักโจมตี',hp:125,atk:31,def:14,color:'#ef9c83',kind:'fox',special:skill('หางเพลิง',1.65,'burn'),description:'จิ้งจอกจิ๋วผู้เก็บแสงอาทิตย์ไว้ที่ปลายหาง'},
{id:'brook',name:'บับเบิลบัน',element:'water',role:'ผู้พิทักษ์',hp:155,atk:23,def:25,color:'#93ced3',kind:'bunny',special:skill('ฟองน้ำพิทักษ์',1.2,'shield'),description:'กระต่ายน้ำผู้สร้างฟองวิเศษให้เพื่อนปลอดภัย'},
{id:'moss',name:'มอสซี่',element:'earth',role:'สายฟื้นฟู',hp:140,atk:24,def:19,color:'#adc58a',kind:'cat',special:skill('สวนแห่งชีวิต',1,'regen'),description:'แมวใบไม้ที่พกสวนเล็ก ๆ ไปทุกที่'},
{id:'pebble',name:'ปุ๊กปิ๊ก',element:'earth',role:'สายป้องกัน',hp:180,atk:21,def:30,color:'#d5b99c',kind:'bear',special:skill('เกราะก้อนเมฆ',1.3,'shield'),description:'หมีเกราะหินใจดี ผู้ปกป้องเพื่อนด้วยอ้อมแขนแข็งแกร่ง'},
{id:'spore',name:'เห็ดจิ๋ว',element:'wind',role:'สร้างสถานะ',hp:120,atk:27,def:17,color:'#c5b4d7',kind:'bear',special:skill('ละอองฝัน',1.3,'poison'),description:'ภูตหมวกเห็ดผู้พัดละอองฝันไปกับสายลม'},
{id:'spark',name:'ปิ๊งปิ๊ง',element:'fire',role:'เพิ่มพลัง',hp:115,atk:33,def:12,color:'#efbb70',kind:'cat',special:skill('หัวใจลุกโชน',1.4,'boost'),description:'ลูกแมวดาวตกที่เต็มไปด้วยพลังและความกล้า'},
{id:'mist',name:'มิสตี้',element:'water',role:'หยุดคู่ต่อสู้',hp:120,atk:26,def:18,color:'#aabddc',kind:'fox',special:skill('คลื่นหลับใหล',1.15,'stun'),description:'จิ้งจอกสามหางสายน้ำ ผู้กล่อมคู่ต่อสู้ด้วยเสียงคลื่น'},
{id:'mochi',name:'โมจิมูน',element:'wind',role:'สายสมดุล',hp:150,atk:27,def:21,color:'#eab9cd',kind:'bunny',special:skill('แสงจันทร์อุ่น',1.4,'regen'),description:'กระต่ายหูจันทร์เสี้ยว ผู้ฝากคำอธิษฐานไว้ในกระดิ่งสายลม'}
].map(c=>({...c,entry:tactics[c.id].entry,special:{...c.special,...tactics[c.id].special},basic:{name:'โจมตี',cost:0,multiplier:1},guard:{name:'ป้องกัน',cost:1},image:`/characters/${c.id}-v2.png`}));
export const elements={fire:['fire','ไฟ'],water:['water','น้ำ'],earth:['earth','ดิน'],wind:['wind','ลม']};
export const statuses={...tacticalStatuses,burn:['fire','เผาไหม้',2],poison:['poison','พิษ',3],stun:['stun','สตัน',1],shield:['shield','โล่',2],boost:['attack','ATK +20%',2],regen:['heart','ฟื้นฟู',2]};
export const byId=id=>cards.find(c=>c.id===id);

// A beats B only along the next edge; same and opposite elements are neutral.
export const elementWins={fire:'earth',earth:'wind',wind:'water',water:'fire'};
export function elementFactor(attacker,defender){return elementWins[attacker]===defender?CONFIG.elementAdvantage:elementWins[defender]===attacker?CONFIG.elementDisadvantage:1;}
export function elementMatchupText(attacker,defender){const factor=elementFactor(attacker,defender);return factor>1?'ชนะธาตุ • ดาเมจ +25%':factor<1?'แพ้ธาตุ • ดาเมจ −20%':'ธาตุสูสี • ดาเมจปกติ';}
