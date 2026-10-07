import {byId,CONFIG,statuses,elementFactor} from './cards.js';
import {tactics,comboFor} from './tactics.js';
export function validTeam(ids){return Array.isArray(ids)&&ids.length===3&&new Set(ids).size===3&&ids.every(id=>byId(id));}
const unit=id=>({id,hp:byId(id).hp,status:{},shield:0,cooldown:0,guard:false,charging:false,statusSources:{},stats:{damage:0,hpDamage:0,shieldDamage:0,taken:0,kos:0,healing:0}});
export const active=(s,p)=>s.players[p].team[s.players[p].active];
export function createMatch(teams,first=Math.random()<.5?0:1,options={}){
 if(!teams.every(validTeam))throw Error('ทีมไม่ถูกต้อง');
 const s={players:teams.map(t=>({team:t.map(unit),active:0,energy:3,switches:CONFIG.switches})),turn:first,round:1,winner:null,pending:null,log:[`ฝ่าย ${first+1} ได้เริ่มก่อน`],revision:0,ai:Number.isInteger(options.botPlayer)?{player:options.botPlayer,intent:null}:null};
 start(s);commitIntent(s);return s;
}
function result(s){
 const alive=s.players.map(p=>p.team.some(u=>u.hp>0));
 if(!alive[0]&&!alive[1])s.winner='draw';else if(!alive[0])s.winner=1;else if(!alive[1])s.winner=0;
 if(s.winner!==null){s.pending=null;return;}
 s.pending=null;for(let p=0;p<2;p++)if(active(s,p).hp<=0){s.pending=p;break;}
}
function clearStatus(u,type){delete u.status[type];delete u.statusSources[type];if(type==='shield')u.shield=0;}
function hurt(u,n,source=null){
 const before=u.hp,absorbed=Math.min(u.shield,n),hpDamage=Math.min(u.hp,n-absorbed);
 u.shield-=absorbed;u.hp-=hpDamage;if(!u.shield)clearStatus(u,'shield');
 const total=absorbed+hpDamage;if(u.stats)u.stats.taken+=total;
 if(source?.stats){source.stats.damage+=total;source.stats.hpDamage+=hpDamage;source.stats.shieldDamage+=absorbed;if(before>0&&u.hp===0)source.stats.kos++;}
 if(!u.hp)u.charging=false;return total;
}
function heal(u,amount,source){if(u.hp<=0)return 0;const recovered=Math.min(byId(u.id).hp-u.hp,amount);u.hp+=recovered;if(source?.stats)source.stats.healing+=recovered;return recovered;}
function statusSource(s,u,type){const source=u.statusSources?.[type];return source?s.players[source.player]?.team.find(v=>v.id===source.id):null;}
function addStatus(s,u,type,duration,p,source){
 if(u.hp<=0)return;u.status[type]=duration;u.statusSources[type]={player:p,id:source.id};
 if(type==='stun'&&u.charging){u.charging=false;s.log.push(`${byId(u.id).name} ถูกขัดจังหวะ • ยกเลิกการชาร์จ`);}
}
function start(s){const p=s.players[s.turn];p.energy=Math.min(CONFIG.maxEnergy,p.energy+1);for(const u of p.team){u.guard=false;u.cooldown=Math.max(0,u.cooldown-1);}result(s);}
function finish(s){
 const p=s.players[s.turn];
 for(const u of p.team){
  if(u.hp<=0)continue;const c=byId(u.id);
  for(const type of ['burn','poison','regen','shield','boost','wet','rooted','weakened','exposed'])if(u.status[type]){
   if(type==='burn'||type==='poison')hurt(u,Math.max(1,Math.round(c.hp*(type==='burn'?.05:.04))),statusSource(s,u,type));
   if(type==='regen'&&u.hp>0)heal(u,Math.round(c.hp*.05),statusSource(s,u,type));
   if(--u.status[type]<=0)clearStatus(u,type);
  }
 }
 result(s);if(s.winner!==null)return;s.turn=1-s.turn;s.round++;start(s);
}
export function damage(attacker,defender,multiplier){
 const a=byId(attacker.id),d=byId(defender.id),factor=elementFactor(a.element,d.element),combo=comboFor(a,defender);
 const atk=a.atk*(attacker.status.boost?1.2:1)*(attacker.status.weakened?.75:1);
 const amount=Math.max(1,Math.round(Math.max(1,atk*multiplier-d.def*.5)*factor*(combo?.multiplier||1)*(defender.status.exposed?1.25:1)*(defender.guard?.5:1)));
 return {amount,factor,combo};
}
function entry(s,p){
 const owner=s.players[p],u=active(s,p),c=byId(u.id);
 for(const effect of c.entry.effects){
  if(effect.type==='energy'){owner.energy=Math.min(CONFIG.maxEnergy,owner.energy+effect.amount);continue;}
  const targets=effect.target==='team'?owner.team:effect.target==='enemy'?[active(s,1-p)]:[u];
  for(const target of targets){
   if(target.hp<=0)continue;
   if(effect.type==='cleanse')effect.statuses.forEach(type=>clearStatus(target,type));
   if(effect.type==='heal')heal(target,Math.round(byId(target.id).hp*effect.ratio),u);
   if(effect.type==='status')addStatus(s,target,effect.status,effect.duration,p,u);
   if(effect.type==='shield'){addStatus(s,target,'shield',effect.duration,p,u);target.shield=effect.amount;}
  }
 }
 s.log.push(`${c.name} ลงสนาม: ${c.entry.name} • ${c.entry.description}`);
}
function cancelCharge(s,u){if(u.charging){u.charging=false;s.log.push(`${byId(u.id).name} ยกเลิกการชาร์จ • ไม่คืนพลังงาน`);}}
function endAction(s){finish(s);s.log=s.log.slice(-50);s.revision++;commitIntent(s);return s;}
export function act(state,p,action){
 const s=structuredClone(state);if(s.winner!==null)throw Error('การแข่งขันจบแล้ว');
 if(s.pending!==null){
  if(p!==s.pending||action.type!=='replace')throw Error('ต้องเลือกตัวสำรอง');
  const i=action.index;if(!Number.isInteger(i)||i===s.players[p].active||!s.players[p].team[i]||s.players[p].team[i].hp<=0)throw Error('เลือกตัวที่ยังมีชีวิต');
  s.players[p].active=i;s.log.push(`${byId(active(s,p).id).name} ลงสนาม • เปลี่ยนฟรี ไม่มีเอฟเฟกต์เข้าสนาม`);result(s);s.revision++;commitIntent(s,true);return s;
 }
 if(p!==s.turn)throw Error('ยังไม่ใช่เทิร์นของคุณ');
 const own=s.players[p],a=active(s,p),d=active(s,1-p),c=byId(a.id);
 if(a.hp<=0)throw Error('ตัวละครหมดสภาพ');
 if(a.status.stun){clearStatus(a,'stun');cancelCharge(s,a);s.log.push(`${c.name} สตัน ข้ามแอ็กชัน`);return endAction(s);}
 if(action.type==='switch'){
  const i=action.index;if(!own.switches)throw Error('โควตาสลับหมดแล้ว');
  if(!Number.isInteger(i)||i===own.active||!own.team[i]||own.team[i].hp<=0)throw Error('สลับตัวนี้ไม่ได้');
  cancelCharge(s,a);own.active=i;own.switches--;entry(s,p);
 }else if(action.type==='guard'){
  if(own.energy<c.guard.cost)throw Error('พลังงานไม่พอ');cancelCharge(s,a);own.energy-=c.guard.cost;a.guard=true;
  s.log.push(`${c.name} ตั้งรับ ลดความเสียหาย 50% • รับการโจมตีสำเร็จได้พลังงาน +1`);
 }else if(action.type==='basic'||action.type==='special'){
  const special=action.type==='special',sk=special?c.special:c.basic,release=special&&a.charging;
  if(!release&&(own.energy<sk.cost||special&&a.cooldown>0))throw Error('พลังงานหรือคูลดาวน์ไม่พร้อม');
  if(!special)cancelCharge(s,a);
  if(!release)own.energy-=sk.cost;
  if(special&&sk.charge&&!release){
   a.charging=true;a.cooldown=sk.cooldown+1;s.log.push(`${c.name} ชาร์จ ${sk.name} • เทิร์นถัดไปกดปล่อยพลัง หรือยกเลิกด้วยแอ็กชันอื่น`);return endAction(s);
  }
  const guarded=d.guard,hit=damage(a,d,sk.multiplier);hurt(d,hit.amount,a);d.guard=false;
  if(release)a.charging=false;
  s.log.push(`${c.name} ${release?'ปล่อยพลัง':'ใช้'} ${sk.name} • ${hit.amount}${hit.factor>1?' ชนะธาตุ +25%':hit.factor<1?' แพ้ธาตุ −20%':''}`);
  if(hit.combo){clearStatus(d,hit.combo.mark);s.log.push(`คอมโบ ${hit.combo.name} • ดาเมจ ×${hit.combo.multiplier} • ใช้ ${statuses[hit.combo.mark][1]} หมด`);}
  if(guarded){const defender=s.players[1-p];defender.energy=Math.min(CONFIG.maxEnergy,defender.energy+1);s.log.push(`${byId(d.id).name} ป้องกันสำเร็จ • พลังงาน +1`);}
  const mark=tactics[a.id].basicMark;if(mark&&d.hp>0)addStatus(s,d,mark,statuses[mark][2],p,a);
  if(special){
   a.cooldown=sk.cooldown+1;
   const effect=sk.effect,target=['shield','boost','regen'].includes(effect)?a:d;
   if(target.hp>0){addStatus(s,target,effect,statuses[effect][2],p,a);if(effect==='shield')target.shield=40;}
   if(sk.expose)addStatus(s,a,'exposed',2,p,a);
  }
  result(s);
 }else throw Error('คำสั่งไม่ถูกต้อง');
 return endAction(s);
}
function chooseBot(s,p,forecast=false){
 const player=s.players[p],a=active(s,p),enemy=active(s,1-p),c=byId(a.id);
 const energy=Math.min(CONFIG.maxEnergy,player.energy+(forecast?1:0)),cd=Math.max(0,a.cooldown-(forecast?1:0));
 const candidates=player.team.map((u,i)=>({u,i})).filter(({u,i})=>u.hp>0&&i!==player.active);
 const best=candidates.sort((x,y)=>(elementFactor(byId(y.u.id).element,byId(enemy.id).element)*30+y.u.hp/byId(y.u.id).hp*20)-(elementFactor(byId(x.u.id).element,byId(enemy.id).element)*30+x.u.hp/byId(x.u.id).hp*20))[0];
 if(s.pending===p)return {type:'replace',index:best?.i??player.team.findIndex(u=>u.hp>0)};
 if(a.status.stun)return {type:'basic'};
 if(a.charging)return {type:'special'};
 if(enemy.charging&&energy>=1){if(c.special.effect==='stun'&&energy>=3&&!cd)return {type:'special'};if(damage(a,enemy,1).amount>=enemy.hp+enemy.shield)return {type:'basic'};return {type:'guard'};}
 if(player.switches&&best&&a.hp<Math.max(30,c.hp*.3)&&best.u.hp/byId(best.u.id).hp>.45)return {type:'switch',index:best.i};
 if(comboFor(c,enemy))return {type:'basic'};
 // Reserve a switch for a real combo window; do not switch after the mark expires.
 if(player.switches){
  const setup=['wet','rooted'].find(mark=>enemy.status[mark]>=(forecast?3:2));
  if(setup){const element=setup==='wet'?'wind':'fire';const partner=candidates.find(({u})=>byId(u.id).element===element&&u.hp>byId(u.id).hp*.3);if(partner)return {type:'switch',index:partner.i};}
 }
 if(energy>=c.special.cost&&!cd)return {type:'special'};
 return {type:'basic'};
}
function commitIntent(s,force=false){
 if(!s.ai||s.winner!==null)return;
 const p=s.ai.player,current=active(s,p);
 if(force||s.turn!==p||!s.ai.intent||s.ai.intent.actor!==current.id){const action=chooseBot(s,p,s.turn!==p);s.ai.intent={actor:current.id,action};}
}
export function botAction(s,p){
 if(s.pending===p)return chooseBot(s,p);
 const plan=s.ai?.player===p?s.ai.intent:null;
 if(plan&&plan.actor===active(s,p).id){
  const action=plan.action,own=s.players[p],u=active(s,p);
  if(action.type==='switch'&&(!own.switches||own.team[action.index]?.hp<=0))return {type:'basic'};
  if(action.type==='special'&&!u.charging&&(own.energy<byId(u.id).special.cost||u.cooldown>0))return {type:'basic'};
  return {...action};
 }
 return chooseBot(s,p);
}
export function intentDescription(s,p){
 if(s.pending===p)return 'ตัวในสนามหมดสภาพ • กำลังเลือกสำรอง';
 const u=active(s,p),c=byId(u.id),action=botAction(s,p);
 if(u.status.stun)return 'ติดสตัน • ข้ามแอ็กชัน';
 if(action.type==='switch')return `เตรียมสลับเป็น ${byId(s.players[p].team[action.index].id).name}`;
 if(action.type==='guard')return 'เตรียมตั้งรับ • ลดดาเมจ 50%';
 if(action.type==='special')return u.charging?`เตรียมปล่อย ${c.special.name} • พลัง ${Math.round(c.special.multiplier*100)}%`:c.special.charge?`เตรียมชาร์จ ${c.special.name}`:`เตรียมใช้ ${c.special.name}`;
 return comboFor(c,active(s,1-p))?'เตรียมโจมตีต่อคอมโบ':'เตรียมโจมตีพื้นฐาน';
}
