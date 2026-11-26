// v1.9 — balanceamento: despesas da botica, Estufa de Ervas e Alambique Duplo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG, upkeepForDay } from '../src/data.js';
import { createInitialState, mix } from '../src/engine.js';
import { closeDay, startNextDay, isMerchantHere, payLandlord, evict, restartAfterEviction, shelfValue } from '../src/progression.js';

const dayOver = (over = {}) => {
  const s = createInitialState();
  s.plan.total = 0;
  s.orders = [];
  return { ...s, ...over };
};

test('aluguel (v1.27): dia 1 grátis, depois 15 fixos por dia', () => {
  assert.equal(upkeepForDay(1), 0);
  assert.equal(upkeepForDay(2), 15);
  assert.equal(upkeepForDay(3), 15);
  assert.equal(upkeepForDay(50), CONFIG.RENT_PER_DAY);
});

test('fechar o dia cobra as despesas e registra no plano, sem deixar a bolsa negativa', () => {
  const res = closeDay(dayOver({ day: 5, coins: 100 }));
  assert.equal(res.ok, true);
  assert.equal(res.state.coins, 100 - upkeepForDay(5));
  assert.equal(res.state.plan.upkeep, upkeepForDay(5));
  assert.equal(res.result.upkeep, upkeepForDay(5));
  const broke = closeDay(dayOver({ day: 9, coins: 4 }));
  assert.equal(broke.state.coins, 0);
  assert.equal(broke.result.paid, 4);
  assert.equal(broke.state.debt, CONFIG.RENT_PER_DAY - 4);
  assert.equal(broke.state.debtDays, 1);
  assert.equal(broke.state.landlord, false);
});

test('dívida (v1.27): a bolsa quita o atrasado no fechamento seguinte e zera a contagem', () => {
  const res = closeDay(dayOver({ day: 5, coins: 40, debt: 11, debtDays: 2 }));
  assert.equal(res.state.coins, 40 - 15 - 11);
  assert.equal(res.state.debt, 0);
  assert.equal(res.state.debtDays, 0);
  assert.equal(res.state.landlord, false);
});

test('dívida (v1.27): no 3º fechamento seguido devendo o senhorio vem e a mercadora espera', () => {
  let s = dayOver({ day: 4, coins: 0, debt: 30, debtDays: 2 });
  const res = closeDay(s);
  assert.equal(res.state.debt, 45);
  assert.equal(res.state.debtDays, 3);
  assert.equal(res.state.landlord, true);
  assert.equal(res.result.landlord, true);
  assert.equal(isMerchantHere(res.state), false);
  assert.equal(startNextDay(res.state).ok, false);
});

test('senhorio (v1.27): pagar quita tudo e a mercadora chega; sem moedas, pagar falha', () => {
  const night = { ...closeDay(dayOver({ day: 4, coins: 0, debt: 30, debtDays: 2 })).state };
  assert.equal(payLandlord(night).ok, false);
  const rich = { ...night, coins: 60 };
  const paid = payLandlord(rich);
  assert.equal(paid.ok, true);
  assert.equal(paid.state.coins, 15);
  assert.equal(paid.state.debt, 0);
  assert.equal(paid.state.landlord, false);
  assert.equal(isMerchantHere(paid.state), true);
  assert.equal(startNextDay(paid.state).ok, true);
});

test('senhorio (v1.27): a prateleira conta para juntar o aluguel', () => {
  const night = { ...closeDay(dayOver({ day: 4, coins: 0, debt: 30, debtDays: 2 })).state, inventory: { lodo: 2 } };
  assert.equal(shelfValue(night), 2);
});

test('despejo (v1.27): entregar a chave fecha a botica; recomeçar mantém as receitas', () => {
  const night = closeDay(dayOver({ day: 6, coins: 0, debt: 30, debtDays: 2, discovered: ['vapor'] })).state;
  const out = evict(night);
  assert.equal(out.ok, true);
  assert.equal(out.state.evicted, true);
  assert.equal(out.result.day, 6);
  assert.equal(out.result.debt, 45);
  const again = restartAfterEviction(out.state, createInitialState());
  assert.deepEqual(again.discovered, ['vapor']);
  assert.equal(again.day, 1);
  assert.equal(again.debt, 0);
  assert.equal(again.evicted, false);
  assert.equal(again.coins, CONFIG.START_COINS);
  assert.equal(evict(createInitialState()).ok, false);
});

test('save (v1.27): dívida, contagem e senhorio sobrevivem ao salvar', () => {
  const night = closeDay(dayOver({ day: 4, coins: 0, debt: 30, debtDays: 2 })).state;
  const back = sanitizeState(JSON.parse(JSON.stringify(night)));
  assert.equal(back.debt, 45);
  assert.equal(back.debtDays, 3);
  assert.equal(back.landlord, true);
  const open = sanitizeState({ ...JSON.parse(JSON.stringify(night)), phase: 'open' });
  assert.equal(open.landlord, false);
});

test('Estufa de Ervas põe 1 água, 1 folha e 1 cogumelo na prateleira a cada manhã', () => {
  const closed = closeDay(dayOver({ coins: 50 })).state;
  const withGreenhouse = { ...closed, upgrades: { ...closed.upgrades, estufa: true } };
  const next = startNextDay(withGreenhouse, () => 0.5).state;
  for (const id of CONFIG.GREENHOUSE) assert.equal(next.stock[id], closed.stock[id] + 1, id);
  assert.equal(next.stock.fogo, closed.stock.fogo);
  const plain = startNextDay(closed, () => 0.5).state;
  assert.equal(plain.stock.agua, closed.stock.agua);
});

test('Alambique Duplo: receita conhecida pode render 2 frascos; receita nova nunca', () => {
  const base = createInitialState();
  const s = { ...base, discovered: ['vapor'], upgrades: { ...base.upgrades, alambique: true } };
  const lucky = mix(s, 'agua', 'fogo', () => 0);
  assert.equal(lucky.result.double, true);
  assert.equal(lucky.state.inventory.vapor, 2);
  const unlucky = mix(s, 'agua', 'fogo', () => 0.99);
  assert.equal(unlucky.state.inventory.vapor, 1);
  const fresh = mix({ ...s, discovered: [] }, 'agua', 'fogo', () => 0);
  assert.equal(fresh.result.double, false);
  assert.equal(fresh.state.inventory.vapor, 1);
});

test('dicas vistas sobrevivem ao save e ids desconhecidos são descartados', async () => {
  const { saveGame, loadGame } = await import('../src/storage.js');
  const { TIPS } = await import('../src/data.js');
  const mem = new Map();
  const st = { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k) };
  const s = { ...createInitialState(), seenTips: [TIPS[0].id, 'inventada', TIPS[1].id, TIPS[0].id] };
  assert.equal(saveGame(s, st), true);
  const { state } = loadGame(st);
  assert.deepEqual(state.seenTips, [TIPS[0].id, TIPS[1].id]);
  assert.deepEqual(createInitialState().seenTips, []);
});

// ---------------------------------------------------------------------------
// v1.14 — fama em faixas, paciência dos clientes, gorjeta e dia perfeito
// ---------------------------------------------------------------------------
import { fameTier, patienceForDay, FAME_TIERS } from '../src/data.js';
import { orderReward, sellPrice } from '../src/engine.js';
import {
  fillOrders, deliverOrder, tickPatience, walkOutOrder, patienceFor, patienceLeft, setRelaxed,
} from '../src/progression.js';
import { sanitizeState } from '../src/storage.js';

const order = (over = {}) => ({ id: 'o1', customerId: 'bruxa-ofelia', potionId: 'vapor', clue: 0, misses: 0, novel: false, patience: 100000, waited: 0, ...over });
const withOrders = (orders, over = {}) => {
  const s = createInitialState();
  return { ...s, day: 5, orders, orderSeq: orders.length, plan: { ...s.plan, total: orders.length, arrived: orders.length }, ...over };
};

test('paciência: dias 1 e 2 sem pressa; do dia 3 cai 7 s por dia até o piso de 90 s', () => {
  assert.equal(patienceForDay(1), 0);
  assert.equal(patienceForDay(2), 0);
  assert.equal(patienceForDay(3), 140000);
  assert.equal(patienceForDay(4), 133000);
  assert.equal(patienceForDay(10), 91000);
  assert.equal(patienceForDay(11), 90000);
  assert.equal(patienceForDay(40), 90000);
});

test('fama em faixas: 0, 10, 25 e 50 pagam 0/1/2/3 moedas a mais por pedido', () => {
  assert.equal(FAME_TIERS.length, 4);
  assert.equal(fameTier(0).coins, 0);
  assert.equal(fameTier(9).coins, 0);
  assert.equal(fameTier(10).coins, 1);
  assert.equal(fameTier(25).coins, 2);
  assert.equal(fameTier(80).coins, 3);
  assert.equal(fameTier(80).next, null);
  assert.equal(fameTier(12).next.min, 25);
  const s = createInitialState();
  assert.equal(orderReward({ ...s, reputation: 30 }, 'vapor'), orderReward(s, 'vapor') + 2);
  assert.equal(sellPrice({ ...s, reputation: 30 }, 'vapor'), sellPrice(s, 'vapor'), 'a fama não mexe na venda avulsa');
});

test('cliente novo traz a paciência do dia; receita nova e fama alta dão mais tempo; "sem pressa" zera', () => {
  const s = { ...createInitialState(), day: 3 };
  assert.equal(patienceFor(s, false), 140000);
  assert.equal(patienceFor(s, true), 245000); // v1.26: receita nova ×1,75
  assert.equal(patienceFor({ ...s, reputation: 50 }, false), 168000);
  assert.equal(patienceFor({ ...s, day: 1 }, false), 0);
  assert.equal(patienceFor({ ...s, relaxed: true }, true), 0);
  const filled = fillOrders({ ...s, discovered: ['vapor', 'cura', 'vigor'], plan: undefined }, () => 0.9);
  assert.ok(filled.orders.length > 0);
  for (const o of filled.orders) {
    assert.equal(o.waited, 0);
    assert.equal(o.patience, patienceFor(s, o.novel, o.customerId));
  }
});

test('o tempo passa: balcão perde paciência inteira, fila 1/4; avisa quem esgotou; não muta', () => {
  const s = withOrders([order(), order({ id: 'o2', customerId: 'fada-lumi', potionId: 'cura' })]);
  const snap = structuredClone(s);
  const t = tickPatience(s, 40000, 'o1');
  assert.deepEqual(s, snap);
  assert.equal(t.state.orders[0].waited, 40000);
  assert.equal(t.state.orders[1].waited, 10000);
  assert.deepEqual(t.expired, []);
  assert.equal(patienceLeft(t.state.orders[0]), 0.6);
  const end = tickPatience(t.state, 70000, 'o1');
  assert.deepEqual(end.expired, ['o1']);
  assert.equal(end.state.orders[0].waited, 100000, 'não passa do total');
  // sem pressa e à noite nada muda
  const calm = withOrders([order({ patience: 0 })]);
  assert.equal(tickPatience(calm, 50000).state, calm);
  assert.equal(tickPatience({ ...s, phase: 'closed' }, 50000).state.orders[0].waited, 0);
  assert.equal(patienceLeft(order({ patience: 0, waited: 999 })), 1);
});

test('cansou de esperar: sai do balcão, conta no dia e custa 2 de fama', () => {
  const s = withOrders([order()], { reputation: 5 });
  const r = walkOutOrder(s, 'o1');
  assert.equal(r.ok, true);
  assert.equal(r.state.orders.length, 0);
  assert.equal(r.state.reputation, 5 - CONFIG.WALKOUT_FAME);
  assert.equal(r.state.plan.gaveUp, 1);
  assert.equal(r.state.plan.served, 1);
  assert.equal(r.state.stats.gaveUp, 1);
  assert.equal(walkOutOrder({ ...s, reputation: 1 }, 'o1').state.reputation, 0, 'fama nunca negativa');
  assert.equal(walkOutOrder(s, 'o9').ok, false);
});

test('gorjeta: só com mais da metade da paciência; sem pressa não há gorjeta', () => {
  const base = (o) => withOrders([o], { discovered: ['vapor'], inventory: { vapor: 1 } });
  const fast = deliverOrder(base(order({ waited: 40000 })), 'o1');
  assert.equal(fast.result.tip, CONFIG.TIP_FAST);
  assert.equal(fast.state.coins, 40 + fast.result.reward + CONFIG.TIP_FAST);
  assert.equal(fast.state.plan.tips, CONFIG.TIP_FAST);
  assert.equal(fast.state.plan.earned, fast.result.reward, 'gorjeta fica separada do ganho com pedidos');
  assert.equal(deliverOrder(base(order({ waited: 60000 })), 'o1').result.tip, 0);
  assert.equal(deliverOrder(base(order({ patience: 0 })), 'o1').result.tip, 0);
});

test('dia perfeito: ninguém saiu sem poção → 2 moedas por cliente e +1 de fama', () => {
  const ok = dayOver({ coins: 50, reputation: 3 });
  ok.plan = { ...ok.plan, total: 5, arrived: 5, served: 5 };
  const r = closeDay(ok);
  assert.equal(r.result.isPerfect, true);
  assert.equal(r.state.plan.perfect, 10);
  assert.equal(r.state.coins, 60);
  assert.equal(r.state.reputation, 4);
  assert.equal(r.state.stats.perfectDays, 1);
  for (const k of ['sentAway', 'gaveUp']) {
    const bad = dayOver({ coins: 50 });
    bad.plan = { ...bad.plan, total: 5, arrived: 5, served: 5, [k]: 1 };
    const b = closeDay(bad);
    assert.equal(b.result.isPerfect, false, k);
    assert.equal(b.state.coins, 50);
  }
});

test('"sem pressa" e paciência sobrevivem ao save', () => {
  const s = withOrders([order({ waited: 25000 })], { relaxed: false });
  const back = sanitizeState(JSON.parse(JSON.stringify(s)));
  assert.equal(back.orders[0].patience, 100000);
  assert.equal(back.orders[0].waited, 25000);
  const relaxed = setRelaxed(s, true);
  assert.equal(relaxed.relaxed, true);
  assert.equal(relaxed.orders[0].patience, 0);
  assert.equal(sanitizeState(JSON.parse(JSON.stringify(relaxed))).relaxed, true);
  assert.equal(setRelaxed(relaxed, true), relaxed);
});

test('v1.15: cada freguês tem a sua paciência (média perto de 1, Vovó mais e Pirata menos)', async () => {
  const { CUSTOMERS } = await import('../src/data.js');
  for (const c of CUSTOMERS) {
    assert.ok(c.patience >= 0.7 && c.patience <= 1.4, c.id);
    assert.equal(typeof c.temper, 'string');
  }
  const avg = CUSTOMERS.reduce((a, c) => a + c.patience, 0) / CUSTOMERS.length;
  assert.ok(Math.abs(avg - 1) < 0.05, `média ${avg}`);
  const s = { ...createInitialState(), day: 3 };
  assert.equal(patienceFor(s, false, 'vovo-quiteria'), 182000);
  assert.equal(patienceFor(s, false, 'pirata-dorotea'), 105000);
  assert.equal(patienceFor(s, false, 'inventado'), 140000);
  assert.equal(patienceFor({ ...s, relaxed: true }, false, 'pirata-dorotea'), 0);
  const filled = fillOrders({ ...s, discovered: ['vapor', 'cura', 'vigor'], plan: undefined }, () => 0.9);
  for (const o of filled.orders) assert.equal(o.patience, patienceFor(s, o.novel, o.customerId));
});

test('v1.16: sorteio de pedidos varia mais (frase nova, ingrediente diferente do pedido à frente, memória entre dias)', async () => {
  const { RECIPES, getRecipe } = await import('../src/data.js');
  const { dismissOrder } = await import('../src/progression.js');
  let shared = 0, pairs = 0;
  for (let seed = 1; seed <= 60; seed++) {
    let r = seed * 9301;
    const rng = () => ((r = (r * 1103515245 + 12345) % 2147483648) / 2147483648);
    let s = { ...createInitialState(), day: 6, discovered: RECIPES.map((x) => x.id), plan: undefined };
    s = fillOrders(s, rng);
    let prev = null;
    const clueBy = {};
    while (s.orders.length) {
      const o = s.orders[0];
      if (prev) {
        assert.notEqual(o.potionId, prev.potionId, 'nunca repete o pedido anterior');
        pairs++;
        const a = getRecipe(prev.potionId), b = getRecipe(o.potionId);
        if ([a.a, a.b].some((x) => [b.a, b.b].includes(x))) shared++;
      }
      if (clueBy[o.potionId] !== undefined) assert.notEqual(o.clue, clueBy[o.potionId], 'frase nova');
      clueBy[o.potionId] = o.clue;
      prev = o;
      s = fillOrders(dismissOrder(s, o.id).state, rng);
    }
    assert.ok(s.recentAsked.length <= CONFIG.RECENT_MEMORY);
  }
  assert.ok(shared / pairs < 0.35, `pedidos seguidos com ingrediente em comum: ${(100 * shared / pairs).toFixed(0)}%`);
  const back = sanitizeState(JSON.parse(JSON.stringify({ ...createInitialState(), recentAsked: ['vapor', 'x', 'cura'], lastClue: { vapor: 2, cura: 99 } })));
  assert.deepEqual(back.recentAsked, ['vapor', 'cura']);
  assert.deepEqual(back.lastClue, { vapor: 2 });
});

test('v1.23: a mercadora espera 4 minutos à noite e depois segue viagem até a noite seguinte', async () => {
  const { tickMerchant, merchantCandle, merchantPatience, isMerchantHere, buyFromMerchant } = await import('../src/progression.js');
  const night = closeDay(dayOver({ coins: 50 })).state;
  assert.equal(merchantPatience(night), 240000);
  assert.deepEqual(merchantCandle(night), { id: 'mercadora', patience: 240000, waited: 0 });
  const half = tickMerchant(night, 120000);
  assert.equal(half.gone, false);
  assert.equal(half.state.merchantWait, 120000);
  assert.equal(isMerchantHere(half.state), true);
  const gone = tickMerchant(half.state, 130000);
  assert.equal(gone.gone, true);
  assert.equal(isMerchantHere(gone.state), false);
  assert.equal(merchantCandle(gone.state), null);
  const buy = buyFromMerchant(gone.state, 'agua');
  assert.equal(buy.ok, false);
  assert.equal(buy.error.code, 'MERCHANT_GONE');
  // de dia não corre; sem pressa não corre
  assert.equal(tickMerchant(createInitialState(), 5000).state.merchantWait, 0);
  assert.equal(tickMerchant({ ...night, relaxed: true }, 999999).gone, false);
  // a noite seguinte começa com a mercadora de volta
  const next = startNextDay(gone.state, () => 0.5).state;
  assert.equal(next.merchantGone, false);
  const back = closeDay({ ...next, orders: [], plan: { ...next.plan, total: 0, arrived: 0 } }).state;
  assert.equal(isMerchantHere(back), true);
  assert.equal(back.merchantWait, 0);
  // save
  const saved = sanitizeState(JSON.parse(JSON.stringify(half.state)));
  assert.equal(saved.merchantWait, 120000);
  assert.equal(sanitizeState(JSON.parse(JSON.stringify(gone.state))).merchantGone, true);
});

// v1.26 — a mercadora compra Lodo Instável à noite
import { sellSludgeToMerchant, merchantSludgeLeft, startNextDay as nextDay26 } from '../src/progression.js';
import { createInitialState as init26 } from '../src/engine.js';
import { CONFIG as C26 } from '../src/data.js';

test('v1.26: mercadora paga 3 por Lodo, até 3 por noite, só à noite', () => {
  const day = { ...init26(), inventory: { lodo: 5 } };
  assert.equal(sellSludgeToMerchant(day).ok, false, 'de dia não compra');
  let s = { ...day, phase: 'closed', orders: [], merchantGone: false, merchantSludge: 0 };
  const coins = s.coins;
  for (let i = 0; i < C26.MERCHANT_SLUDGE_MAX; i++) {
    const r = sellSludgeToMerchant(s);
    assert.ok(r.ok, `venda ${i + 1}`);
    s = r.state;
  }
  assert.equal(s.coins, coins + 3 * C26.MERCHANT_SLUDGE_PRICE);
  assert.equal(s.inventory.lodo, 2);
  assert.equal(merchantSludgeLeft(s), 0);
  const full = sellSludgeToMerchant(s);
  assert.equal(full.ok, false);
  assert.equal(full.error.code, 'MERCHANT_FULL');
  assert.equal(sellSludgeToMerchant({ ...s, merchantSludge: 0, merchantGone: true }).error.code, 'MERCHANT_GONE');
  assert.equal(sellSludgeToMerchant({ ...s, merchantSludge: 0, inventory: {} }).error.code, 'NOT_IN_INVENTORY');
  const next = nextDay26(s, () => 0.5).state;
  assert.equal(next.merchantSludge, 0, 'zera no dia seguinte');
});
