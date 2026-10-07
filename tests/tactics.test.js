import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,act,active,damage,botAction,intentDescription} from '../src/engine.js';
import {byId} from '../src/cards.js';
const enemy=['pebble','mist','moss'];
const base=(team=['ember','brook','moss'],options={})=>createMatch([team,enemy],0,options);
test('entry effects only on voluntary switches and count healing correctly',()=>{
 for(const id of ['pebble','brook','moss','spore','spark','mist','mochi','ember']){
  const start=id==='ember'?'brook':'ember';const third=['brook','moss','pebble'].find(x=>x!==id&&x!==start);
  let s=base([start,id,third]);const entrant=s.players[0].team[1];entrant.hp-=30;if(id==='brook'){entrant.status.burn=2;entrant.status.poison=2;}s.players[0].team[2].hp-=20;
  const before=s.players[0].energy;s=act(s,0,{type:'switch',index:1});assert.equal(s.players[0].switches,2);
  if(id==='pebble')assert.equal(active(s,0).shield,35);
  if(id==='brook'){assert.equal(active(s,0).status.burn,undefined);assert.equal(active(s,0).status.poison,undefined);assert.equal(active(s,1).status.wet,3);}
  if(id==='moss'){assert.equal(active(s,0).stats.healing,21);assert.equal(active(s,1).status.rooted,3);}
  if(id==='spore')assert.equal(active(s,1).status.poison,3);
  if(id==='spark'){assert.equal(s.players[0].energy,before+1);assert.equal(active(s,0).status.exposed,1);}
  if(id==='mist')assert.equal(active(s,1).status.weakened,2);
  if(id==='mochi')assert.ok(active(s,0).stats.healing>=12);
  if(id==='ember')assert.equal(active(s,0).status.boost,1);
 }
 let s=base(['ember','pebble','moss']);active(s,0).hp=0;s.pending=0;const rev=s.revision;s=act(s,0,{type:'replace',index:1});assert.equal(active(s,0).shield,0);assert.equal(s.players[0].switches,3);assert.equal(s.turn,0);assert.equal(s.revision,rev+1);
});
test('water setup survives one voluntary switch and wind consumes the combo mark',()=>{
 let s=base(['brook','spore','ember']);s=act(s,0,{type:'basic'});assert.equal(active(s,1).status.wet,3);
 s=act(s,1,{type:'basic'});s=act(s,0,{type:'switch',index:1});s=act(s,1,{type:'basic'});
 assert.equal(active(s,1).status.wet,1);const hit=damage(active(s,0),active(s,1),1);assert.equal(hit.combo.id,'storm');const before=active(s,0).stats.damage;
 s=act(s,0,{type:'basic'});assert.equal(active(s,1).status.wet,undefined);assert.equal(active(s,0).stats.damage-before,hit.amount);assert.ok(s.log.some(l=>l.includes('พายุสายน้ำ')));
});
test('root setup -> fire detonation, consumed once; marks expire on reserve owner turns',()=>{
 let s=base(['moss','ember','brook']);s=act(s,0,{type:'basic'});s=act(s,1,{type:'basic'});s=act(s,0,{type:'switch',index:1});s=act(s,1,{type:'basic'});
 assert.equal(damage(active(s,0),active(s,1),1).combo.id,'wildfire');s=act(s,0,{type:'basic'});assert.equal(active(s,1).status.rooted,undefined);assert.equal(damage(active(s,0),active(s,1),1).combo,null);
 let t=base();t.players[0].team[2].status.wet=1;t=act(t,0,{type:'guard'});assert.equal(t.players[0].team[2].status.wet,undefined);
});
test('charge spends a turn and energy, release is free, cooldown starts after release',()=>{
 let s=base();const hp=active(s,1).hp;s=act(s,0,{type:'special'});assert.equal(active(s,1).hp,hp);assert.equal(active(s,0).charging,true);assert.equal(s.players[0].energy,1);
 s=act(s,1,{type:'guard'});const energy=s.players[0].energy;const expected=damage(active(s,0),active(s,1),byId('ember').special.multiplier).amount;
 s=act(s,0,{type:'special'});assert.equal(active(s,1).hp,hp-expected);assert.equal(s.players[0].energy,energy);assert.equal(active(s,0).charging,false);assert.equal(active(s,0).cooldown,3);
});
test('stun interrupts charge; switching cancels without refund; invalid input does not mutate',()=>{
 let s=createMatch([['ember','brook','moss'],['mist','pebble','spore']],0);s=act(s,0,{type:'special'});s=act(s,1,{type:'special'});assert.equal(active(s,0).charging,false);assert.ok(s.log.some(l=>l.includes('ขัดจังหวะ')));const enemyHP=active(s,1).hp;s=act(s,0,{type:'special'});assert.equal(active(s,1).hp,enemyHP);
 let t=base();t=act(t,0,{type:'special'});t=act(t,1,{type:'basic'});const before=structuredClone(t);assert.throws(()=>act(t,0,{type:'switch',index:9}));assert.deepEqual(t,before);const energy=t.players[0].energy;t=act(t,0,{type:'switch',index:1});assert.equal(t.players[0].team[0].charging,false);assert.equal(t.players[0].energy,energy);
});
test('guard reduces next hit and rewards one energy capped at six',()=>{
 let s=base();s=act(s,0,{type:'guard'});const energy=s.players[0].energy;s=act(s,1,{type:'basic'});assert.equal(s.players[0].energy,energy+2);assert.equal(active(s,0).guard,false);
 let t=base();t.players[0].energy=6;t=act(t,0,{type:'guard'});t=act(t,1,{type:'basic'});assert.equal(t.players[0].energy,6);
});
test('weakness and exposure alter damage; no effect on DOT percentages',()=>{
 const a={id:'spark',status:{}},d={id:'pebble',status:{},guard:false};const normal=damage(a,d,1).amount;a.status.weakened=2;assert.ok(damage(a,d,1).amount<normal);a.status={};d.status.exposed=2;assert.ok(damage(a,d,1).amount>normal);
 let s=base(['spark','brook','moss']);s=act(s,0,{type:'special'});assert.equal(active(s,0).status.exposed,1);assert.equal(active(s,0).status.boost,1);
});
test('bot announces a committed legal action, responds to charge and completes strategic matches',()=>{
 let s=base(undefined,{botPlayer:1});const plan=structuredClone(s.ai.intent);s=act(s,0,{type:'basic'});assert.deepEqual(s.ai.intent,plan);assert.deepEqual(botAction(s,1),plan.action);
 let t=base(undefined,{botPlayer:1});t=act(t,0,{type:'special'});t=act(t,1,botAction(t,1));assert.equal(t.ai.intent.action.type,'guard');assert.match(intentDescription(t,1),/ตั้งรับ/);
 for(let run=0;run<12;run++){let m=createMatch([['ember','brook','spore'],['moss','mist','spark']],run%2,{botPlayer:1});let count=0;while(m.winner===null&&count++<500){const p=m.pending??m.turn;m=act(m,p,botAction(m,p));assert.ok(m.players.every(p=>p.energy>=0&&p.energy<=6&&p.switches>=0));}assert.notEqual(m.winner,null);}
});

test('bot spends a switch to continue a live combo window and preserves quota when expired',()=>{let s=base(['brook','spore','ember']);active(s,1).status.wet=3;assert.deepEqual(botAction(s,0),{type:'switch',index:1});active(s,1).status.wet=1;assert.notEqual(botAction(s,0).type,'switch');});
