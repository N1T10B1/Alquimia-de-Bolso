// Simula aluguel fixo com dívida ("Contas atrasadas"): node aluguel.mjs <aluguel> <dia-inicial> [soma=0|1] [dias] [partidas]
// Uso: copie o jogo para ./game e, em game/src/data.js, faça upkeepForDay devolver globalThis.__RENT a partir de globalThis.__RENT_FROM (ver thread "Balancear economia").
// Dívida: o que não deu para pagar ao fechar o dia vira dívida; à noite, antes de comprar, paga o que puder.
// No 3º fechamento seguido devendo, o senhorio cobra: se a bolsa não cobre a dívida, game over.
globalThis.__RENT = Number(process.argv[2]);
globalThis.__RENT_FROM = Number(process.argv[3]);
globalThis.__RENT_ADD = process.argv[4] === '1';
const DAYS = Number(process.argv[5] || 12);
const SEEDS = Number(process.argv[6] || 300);
const base = new URL('./game/src/', import.meta.url);
const D = await import(new URL('data.js', base));
const E = await import(new URL('engine.js', base));
const P = await import(new URL('progression.js', base));
const S = await import(new URL('story.js', base));
const { RECIPES, INGREDIENTS, UPGRADES } = D;

function mulberry(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const PROFILES = {
  atento: { pNovel: 0.65, T: { read: 10, mix: 6, deliver: 4, perTry: 12 } },
  casual: { pNovel: 0.45, T: { read: 20, mix: 10, deliver: 6, perTry: 22 } },
  lento: { pNovel: 0.35, T: { read: 35, mix: 15, deliver: 8, perTry: 30 } },
  // compra mal: gasta tudo em ingredientes toda noite e erra mais
  gastao: { pNovel: 0.35, T: { read: 35, mix: 15, deliver: 8, perTry: 30 }, spendAll: true },
  embora: { dismissAll: true },
};

function run(prof, seed) {
  const cfg = PROFILES[prof];
  const rng = mulberry(seed);
  let s = S.seedTutorialDay(E.createInitialState(), rng);
  let debt = 0, debtDays = 0, maxDebtDays = 0, daysInDebt = 0, over = 0, collected = 0;
  for (let day = 1; day <= DAYS; day++) {
    let guard = 0;
    while (s.phase === 'open' && guard++ < 300) {
      s = P.fillOrders(s, rng);
      if (P.isDayOver(s)) break;
      const o = s.orders[0];
      if (!o) break;
      if (cfg.dismissAll) { s = P.dismissOrder(s, o.id).state; continue; }
      const r = RECIPES.find((x) => x.id === o.potionId);
      const T = cfg.T;
      let t = T.read;
      let ok = (s.inventory[o.potionId] || 0) > 0;
      const known = s.discovered.includes(o.potionId);
      if (!ok && known) { const m = E.mix(s, r.a, r.b, rng); if (m.ok) { s = m.state; t += T.mix; ok = (s.inventory[o.potionId] || 0) > 0; } }
      if (!ok && !known) {
        for (let k = 0; k < 4 && !ok; k++) {
          t += T.perTry;
          if (rng() < cfg.pNovel) { const m = E.mix(s, r.a, r.b, rng); if (m.ok) { s = m.state; ok = true; } else break; }
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
      const tk = P.tickPatience(s, t * 1000, o.id); s = tk.state;
      for (const g of tk.expired) { const w = P.walkOutOrder(s, g); if (w.ok) s = w.state; }
      if (!s.orders.find((x) => x.id === o.id)) continue;
      if (ok) { const d = P.deliverOrder(s, o.id, rng); if (d.ok) { s = d.state; continue; } }
      s = P.dismissOrder(s, o.id).state;
    }
    s = P.fillOrders(s, rng);
    const c = P.closeDay(s);
    if (!c.ok) break;
    s = c.state;
    const rent = D.upkeepForDay(day);
    debt += rent - (s.plan.upkeep || 0);
    // vende lodo à mercadora
    if (!cfg.dismissAll && P.sellSludgeToMerchant) for (let q = P.sellSludgeToMerchant(s); q.ok; q = P.sellSludgeToMerchant(s)) s = q.state;
    // paga a dívida antes de qualquer compra
    const pay = Math.min(debt, s.coins); s = { ...s, coins: s.coins - pay }; debt -= pay;
    if (debt > 0) { debtDays++; daysInDebt++; } else debtDays = 0;
    maxDebtDays = Math.max(maxDebtDays, debtDays);
    if (debtDays >= 3) { collected++; over = day; break; } // senhorio cobra e a bolsa não cobre
    if (cfg.dismissAll) { s = P.startNextDay(s, rng).state; continue; }
    for (const id of ['lupa', 'caldeirao', 'mercador', 'estufa', 'alambique']) {
      const u = UPGRADES.find((x) => x.id === id);
      if (!s.upgrades[id] && s.coins >= u.cost + 30 + rent) s = P.buyUpgrade(s, id).state;
    }
    const want = cfg.spendAll ? 99 : Math.ceil((D.customersForDay(day + 1) * 2) / INGREDIENTS.length) + 1;
    for (const ing of INGREDIENTS) {
      while ((s.stock[ing.id] || 0) < want && s.coins >= ing.cost) s = P.buyFromMerchant(s, ing.id, 1).state;
    }
    s = P.startNextDay(s, rng).state;
  }
  return { over, daysInDebt, maxDebtDays, coins: s.coins };
}

const out = [];
for (const prof of Object.keys(PROFILES)) {
  const res = [];
  for (let i = 1; i <= SEEDS; i++) res.push(run(prof, i * 7919));
  const lost = res.filter((r) => r.over);
  const avgOver = lost.length ? (lost.reduce((a, r) => a + r.over, 0) / lost.length).toFixed(1) : '-';
  const touched = res.filter((r) => r.daysInDebt > 0).length;
  const recovered = res.filter((r) => r.daysInDebt > 0 && !r.over).length;
  out.push(`${prof.padEnd(7)} | perdeu ${String(Math.round(100 * lost.length / SEEDS)).padStart(3)}% (dia médio ${avgOver}) | já deveu ${String(Math.round(100 * touched / SEEDS)).padStart(3)}% | deveu e se recuperou ${String(Math.round(100 * recovered / SEEDS)).padStart(3)}% | bolsa final média ${Math.round(res.reduce((a, r) => a + r.coins, 0) / SEEDS)}`);
}
console.log(`aluguel ${globalThis.__RENT}/dia desde o dia ${globalThis.__RENT_FROM}${globalThis.__RENT_ADD ? ' + despesa crescente' : ''}`);
console.log(out.join('\n'));
