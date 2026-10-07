// Data-only tactical abilities shared by local and authoritative online combat.
export const tactics={
 ember:{basicMark:null,entry:{name:'ไฟพร้อมรบ',description:'ATK +20% จนจบเทิร์นถัดไป',effects:[{type:'status',status:'boost',duration:2,target:'self'}]},special:{charge:true,multiplier:2.4,description:'ชาร์จ 1 เทิร์น แล้วกดท่าพิเศษเพื่อปล่อยพลัง 240% + เผาไหม้; สตันหรือสลับออกจะยกเลิก พลังงานที่จ่ายไม่คืน'}},
 brook:{basicMark:'wet',entry:{name:'สายน้ำชำระ',description:'ล้างเผาไหม้/พิษตัวเอง และทำศัตรูเปียก 3 เทิร์น',effects:[{type:'cleanse',statuses:['burn','poison'],target:'self'},{type:'status',status:'wet',duration:3,target:'enemy'}]},special:{description:'โจมตีและได้โล่ 40 หน่วย; การโจมตีทุกครั้งทำเป้าหมายเปียก'}},
 moss:{basicMark:'rooted',entry:{name:'สวนแรกผลิ',description:'ฟื้น HP ตัวเอง 15% และสร้างรากยึดศัตรู 3 เทิร์น',effects:[{type:'heal',ratio:.15,target:'self'},{type:'status',status:'rooted',duration:3,target:'enemy'}]},special:{description:'โจมตี สร้างรากยึด และฟื้นฟูต่อเนื่อง 2 เทิร์น'}},
 pebble:{entry:{name:'กำแพงหิน',description:'รับโล่ 35 หน่วย นาน 2 เทิร์น',effects:[{type:'shield',amount:35,duration:2,target:'self'}]},special:{description:'โจมตีและรับโล่ 40 หน่วย; โล่ใหม่แทนค่าเดิม'}},
 spore:{entry:{name:'ละอองต้อนรับ',description:'ทำศัตรูติดพิษ 3 เทิร์น',effects:[{type:'status',status:'poison',duration:3,target:'enemy'}]},special:{description:'โจมตีและใส่พิษ; ถ้าเป้าหมายเปียกจะต่อคอมโบลม'}},
 spark:{entry:{name:'ประกายเสี่ยง',description:'พลังงาน +1 แต่รับดาเมจโจมตี +25% จนจบเทิร์นถัดไป',effects:[{type:'energy',amount:1},{type:'status',status:'exposed',duration:2,target:'self'}]},special:{description:'โจมตีและ ATK +20%; แลกกับรับดาเมจโจมตี +25% จนจบเทิร์นถัดไป',expose:true}},
 mist:{basicMark:'wet',entry:{name:'ม่านหมอก',description:'ลด ATK ศัตรู 25% นาน 2 เทิร์นของศัตรู',effects:[{type:'status',status:'weakened',duration:2,target:'enemy'}]},special:{description:'โจมตี ทำเป้าหมายเปียก และสตันเพื่อหยุดการชาร์จ/ข้ามแอ็กชัน'}},
 mochi:{entry:{name:'กระดิ่งช่วยเพื่อน',description:'ฟื้น HP ให้เพื่อนที่ยังมีชีวิตทุกตัว 8%',effects:[{type:'heal',ratio:.08,target:'team'}]},special:{description:'โจมตีและฟื้นฟูต่อเนื่อง; ใช้ลมต่อคอมโบกับเป้าหมายเปียก'}}
};
export const tacticalStatuses={wet:['water','เปียก',3],rooted:['root','รากยึด',3],weakened:['mist','ATK −25%',2],exposed:['target','รับดาเมจ +25%',2]};
export const combos=[
 {id:'storm',name:'พายุสายน้ำ',element:'wind',mark:'wet',multiplier:1.5,description:'ลมโจมตีเป้าหมายเปียก: ดาเมจ ×1.5 แล้วใช้สถานะเปียกหมด'},
 {id:'wildfire',name:'รากเพลิงระเบิด',element:'fire',mark:'rooted',multiplier:1.5,description:'ไฟโจมตีเป้าหมายรากยึด: ดาเมจ ×1.5 แล้วใช้รากยึดหมด'}
];
export function comboFor(card,target){return combos.find(c=>c.element===card.element&&target.status[c.mark]>0)||null;}
