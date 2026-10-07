import {icon} from './icons.js';
import {byId} from './cards.js';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=n=>(n||0).toLocaleString('th-TH');
export function matchSummaryHTML(state,names,you=0){
 const all=state.players.flatMap((p,player)=>p.team.map(u=>({...u,player})));
 const highest=Math.max(0,...all.map(u=>u.stats?.damage||0));
 const leaders=all.filter(u=>highest>0&&u.stats?.damage===highest);
 const mvp=leaders.length?`<div class="damage-award"><span>${icon('sparkle')} ตัวทำดาเมจสูงสุด${leaders.length>1?' (ร่วม)':''}</span><strong>${leaders.map(u=>`${escape(byId(u.id).name)} · ${escape(names[u.player])}`).join('<br>')}</strong><b>${number(highest)} DMG</b></div>`:'';
 return `${mvp}<div class="match-teams">${[you,1-you].map(player=>{const p=state.players[player];const total=p.team.reduce((n,u)=>n+(u.stats?.damage||0),0);return `<section class="team-report ${player===state.winner?'winner-team':''}"><div class="report-heading"><h3>${escape(names[player])}${player===you?' · ทีมคุณ':''}</h3><span>${state.winner===player?`${icon('trophy')} ชนะ`:state.winner==='draw'?'เสมอ':'แพ้'}</span></div><div class="team-total">ดาเมจรวม <strong>${number(total)} <small>DMG</small></strong></div>${p.team.map(u=>{const c=byId(u.id),s=u.stats||{};return `<article class="unit-report"><div class="report-unit"><img src="${c.image}" alt="${c.name}"><div><strong>${c.name}</strong><small>${u.hp>0?`เหลือ ${u.hp} / ${c.hp} HP`:'หมดสภาพ'}</small></div><b>${number(s.damage)}<small>DMG</small></b></div><div class="damage-track"><i style="width:${highest?Math.round((s.damage||0)/highest*100):0}%"></i></div><div class="report-metrics"><span>รับดาเมจ <b>${number(s.taken)}</b></span><span>ล้มคู่ต่อสู้ <b>${number(s.kos)}</b></span><span>ฟื้นฟู <b>${number(s.healing)}</b></span></div><details><summary>รายละเอียดดาเมจ</summary><p>ลด HP ${number(s.hpDamage)} · ทำลายโล่ ${number(s.shieldDamage)}</p></details></article>`;}).join('')}</section>`;}).join('')}</div><p class="summary-note">DMG นับความเสียหายจริงต่อ HP และโล่ รวมเผาไหม้ / พิษของตัวนั้น ไม่รวมดาเมจส่วนเกินหลังเป้าหมายหมดสภาพ</p>`;
}
