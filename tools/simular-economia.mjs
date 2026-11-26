// Simulação de economia: node tools/simular-economia.mjs . [atento|casual|lento] [dias] [partidas]
// perfil: casual (acerta ~45% das receitas novas, lento) | atento (rápido, 65%)
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const dir = path.resolve(process.argv[2]);
const prof = process.argv[3] || 'casual';
const DAYS = Number(process.argv[4] || 12);
const SEEDS = Number(process.argv[5] || 200);
const imp = (f) => import(pathToFileURL(path.join(dir, 'src', f)).href);
const D = await imp('data.js');
const E = await imp('engine.js');
const P = await imp('progression.js');
const S = await imp('story.js');
const { CONFIG, RECIPES, INGREDIENTS, UPGRADES } = D;
const hasPatience = typeof P.tickPatience === 'function';

function mulberry(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const P_NOVEL = prof === 'atento' ? 0.65 : prof === 'lento' ? 0.35 : 0.45; // chance de acertar o par de uma receita nova por tentativa (com o livro)
const T = prof === 'atento'
  ? { read: 10, mix: 6, deliver: 4, perTry: 12 }
  : prof === 'lento' ? { read: 35, mix: 15, deliver: 8, perTry: 30 } : { read: 20, mix: 10, deliver: 6, perTry: 22 };

function run(seed) {
  const rng = mulberry(seed);
  let s = S.seedTutorialDay(E.createInitialState(), rng);
  const log = [];
  for (let day = 1; day <= DAYS; day++) {
    // atende os clientes um a um (o primeiro da fila)
    let guard = 0;
    while (s.phase === 'open' && guard++ < 200) {
      s = P.fillOrders(s, rng);
      if (P.isDayOver(s)) break;
      const o = s.orders[0];
      if (!o) break;
      const r = RECIPES.find((x) => x.id === o.potionId);
      let t = T.read; // segundos gastos com este cliente
      let ok = (s.inventory[o.potionId] || 0) > 0;
      const known = s.discovered.includes(o.potionId);
      if (!ok && known) {
        const m = E.mix(s, r.a, r.b, rng); if (m.ok) { s = m.state; t += T.mix; ok = (s.inventory[o.potionId] || 0) > 0; }
      }
      if (!ok && !known) {
        // experimenta: cada tentativa gasta 2 ingredientes; acerta com P_NOVEL
        for (let k = 0; k < 4 && !ok; k++) {
          t += T.perTry;
          if (rng() < P_NOVEL) { const m = E.mix(s, r.a, r.b, rng); if (m.ok) { s = m.state; ok = true; } else break; }
          else {
            const ids = INGREDIENTS.map((i) => i.id).filter((id) => (s.stock[id] || 0) > 0);
            if (ids.length < 2) break;
            const a = ids[Math.floor(rng() * ids.length)], b = ids[Math.floor(rng() * ids.length)];
            const m = E.mix(s, a, b, rng); if (m.ok) s = m.state; else break;
            if ((s.inventory[o.potionId] || 0) > 0) ok = true;
          }
        }
      }
      t += T.deliver;
      if (hasPatience) {
        // tempo real passa para todos os presentes
        const tk = P.tickPatience(s, t * 1000, o.id); s = tk.state;
        const gone = tk.expired;
        for (const g of gone) { const w = P.walkOutOrder(s, g); if (w.ok) s = w.state; }
        if (!s.orders.find((x) => x.id === o.id)) continue;
      }
      if (ok) { const d = P.deliverOrder(s, o.id, rng); if (d.ok) { s = d.state; continue; } }
      const d = P.dismissOrder(s, o.id); s = d.state;
    }
    s = P.fillOrders(s, rng);
    const c = P.closeDay(s); if (!c.ok) { console.error('não fechou', day, s.orders.length, s.plan); break; }
    s = c.state;
    // vende lodo: primeiro à mercadora (v1.26, 3 moedas, até 3 por noite), o resto na prateleira
    if (P.sellSludgeToMerchant) for (let r = P.sellSludgeToMerchant(s); r.ok; r = P.sellSludgeToMerchant(s)) s = r.state;
    while ((s.inventory.lodo || 0) > 0) s = E.sellItem(s, 'lodo').state;
    // compra utensílios na ordem de prioridade se sobrar reserva
    for (const id of ['lupa', 'caldeirao', 'mercador', 'estufa', 'alambique']) {
      const u = UPGRADES.find((x) => x.id === id);
      if (!s.upgrades[id] && s.coins >= u.cost + 30) s = P.buyUpgrade(s, id).state;
    }
    // compra ingredientes: garante ~2 por ingrediente + extra p/ clientes de amanhã
    const want = Math.ceil((D.customersForDay(day + 1) * 2) / INGREDIENTS.length) + 1;
    for (const ing of INGREDIENTS) {
      while ((s.stock[ing.id] || 0) < want && s.coins >= ing.cost) s = P.buyFromMerchant(s, ing.id, 1).state;
    }
    log.push({ day, coins: s.coins, rep: s.reputation, rec: s.discovered.length, tips: s.plan.tips || 0, perf: s.plan.perfect ? 1 : 0, served: s.plan.served - s.plan.sentAway, away: s.plan.sentAway, gaveUp: s.plan.gaveUp || 0, earned: s.plan.earned, upkeep: s.plan.upkeep, ups: Object.values(s.upgrades).filter(Boolean).length });
    s = P.startNextDay(s, rng).state;
  }
  return log;
}

const all = [];
for (let i = 1; i <= SEEDS; i++) all.push(run(i * 7919));
const avg = (k, d) => (all.reduce((a, l) => a + (l[d]?.[k] ?? 0), 0) / all.length);
console.log(`perfil=${prof} paciência=${hasPatience}`);
console.log('dia | bolsa | fama | receitas | atend | embora | desistiu | ganho | gorjeta | %perfeito | despesa | utensílios');
for (let d = 0; d < DAYS; d++) {
  console.log([d + 1, avg('coins', d), avg('rep', d), avg('rec', d), avg('served', d), avg('away', d), avg('gaveUp', d), avg('earned', d), avg('tips', d), avg('perf', d) * 100, avg('upkeep', d), avg('ups', d)].map((v) => (typeof v === 'number' ? v.toFixed(1) : v)).join(' | '));
}
