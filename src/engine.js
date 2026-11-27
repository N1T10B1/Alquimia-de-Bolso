// Regras centrais do jogo Alquimia de Bolso. Sem DOM; todas as ações são puras.
import {
  INGREDIENTS, CONFIG, SLUDGE, customersForDay, fameTier,
  getIngredient, getRecipe, getItem, findRecipe, recipeKey,
} from './data.js';
import { L } from './idioma.js';

function fail(state, code, message) {
  return { ok: false, state, error: { code, message } };
}

function toSafeInt(n) {
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
}

export function createInitialState() {
  const stock = {};
  for (const ing of INGREDIENTS) stock[ing.id] = CONFIG.START_STOCK;
  return {
    version: 1,
    coins: CONFIG.START_COINS,
    xp: 0,
    stock,
    inventory: {},
    discovered: [],
    upgrades: { caldeirao: false, mercador: false, lupa: false, estufa: false, alambique: false },
    orders: [],
    orderSeq: 0,
    hints: {},
    reputation: 0,            // +1 por pedido certo, -1 por entrega errada (mínimo 0)
    freeHintReadyAt: 0,       // timestamp (ms) em que a próxima dica grátis fica disponível
    failedPairs: [],          // chaves recipeKey de combinações que já viraram Lodo
    sound: false,
    relaxed: false,           // v1.14: opção "Freguesia sem pressa" (clientes não perdem a paciência)
    victorySeen: false,
    seenTips: [],             // dicas já mostradas (ficam na aba Anotações)
    stats: { mixes: 0, failures: 0, sold: 0, delivered: 0, dismissed: 0, gaveUp: 0, tips: 0, perfectDays: 0, coinsEarned: 0, bestCoins: CONFIG.START_COINS },
    // v1.4 — dias de atendimento
    day: 1,
    phase: 'open',            // 'open' = loja aberta; 'closed' = fim do dia, mercador na porta
    plan: newDayPlan(1, CONFIG.START_COINS),
    lastPotion: null,         // último pedido atendido (o próximo cliente pede outra coisa)
    lastCustomer: null,
    recentAsked: [],          // v1.16: últimas poções pedidas (entre dias), para variar
    merchantWait: 0,          // v1.23: quanto (ms) a mercadora já esperou nesta noite
    merchantGone: false,      // v1.23: a mercadora cansou de esperar e foi embora
    merchantSludge: 0,        // v1.26: Lodos vendidos à mercadora nesta noite
    lastClue: {},             // v1.16: última frase usada por poção
    debt: 0,                  // v1.27: aluguel atrasado (moedas)
    debtDays: 0,              // v1.27: fechamentos seguidos terminados devendo
    landlord: false,          // v1.27: o senhorio está no balcão cobrando (à noite)
    evicted: false,           // v1.27: a botica fechou por dívida (fim de jogo)
  };
}

// Resumo e fila de um dia: quantos clientes vêm, quantos já chegaram e o que aconteceu.
export function newDayPlan(day, startCoins = 0, startRep = 0, startFound = 0) {
  return {
    total: customersForDay(day),
    arrived: 0,
    served: 0,
    sentAway: 0,
    gaveUp: 0,         // v1.14: clientes que cansaram de esperar
    tips: 0,           // v1.14: gorjetas do dia
    perfect: 0,        // v1.14: bônus de dia perfeito (moedas)
    earned: 0,
    novel: 0,          // pedidos de receita fora do caderno que chegaram hoje
    startCoins: toSafeInt(startCoins),
    startRep: toSafeInt(startRep),   // fama no começo do dia (livro-caixa)
    startFound: toSafeInt(startFound), // receitas no caderno no começo do dia
    delivered: [],     // poções entregues hoje: { potionId, reward }
    upkeep: 0,         // aluguel do dia (v1.27)
    paid: 0,           // v1.27: quanto saiu da bolsa para o senhorio ao fechar (aluguel + atrasado)
    debt: 0,           // v1.27: dívida que ficou depois do fechamento
    asked: [],         // poções já pedidas hoje (para variar)
    visitors: [],      // clientes que já vieram hoje
  };
}

export function getLevel(xp) {
  return 1 + Math.floor(toSafeInt(xp) / CONFIG.XP_PER_LEVEL);
}

export function getLevelProgress(xp) {
  const safe = toSafeInt(xp);
  const needed = CONFIG.XP_PER_LEVEL;
  const current = safe % needed;
  return { level: getLevel(safe), current, needed, ratio: current / needed };
}

function applyMerchant(state, base) {
  return state && state.upgrades && state.upgrades.mercador
    ? Math.floor(base * (1 + CONFIG.MERCHANT_BONUS))
    : base;
}

// Venda avulsa na prateleira: só 60% do preço (fica abaixo do custo dos ingredientes),
// para que o lucro venha dos pedidos e não de encher e esvaziar a prateleira.
export function sellPrice(state, itemId) {
  if (itemId === SLUDGE.id) return SLUDGE.price;
  const recipe = getRecipe(itemId);
  if (!recipe) return 0;
  return applyMerchant(state, Math.floor(recipe.price * (CONFIG.SHELF_RATE ?? 1)));
}

// Pagamento de um pedido: preço + bônus do pedido (com a Marca do Mercador) + extra da faixa de fama.
export function orderReward(state, potionId) {
  const recipe = getRecipe(potionId);
  if (!recipe) return 0;
  return applyMerchant(state, recipe.price + CONFIG.ORDER_BONUS) + fameTier(state && state.reputation).coins;
}

export function canMix(state, a, b) {
  const ia = getIngredient(a);
  const ib = getIngredient(b);
  if (!ia || !ib) {
    return { ok: false, error: { code: 'INVALID_ID', message: L('Esses ingredientes não constam no caderno.', 'Those ingredients are not in the notebook.') } };
  }
  const stock = (state && state.stock) || {};
  if (a === b) {
    if ((stock[a] || 0) < 2) {
      return { ok: false, error: { code: 'INSUFFICIENT_STOCK', message: L(`Falta ${ia.name} na prateleira: a receita pede 2 porções.`, `Not enough ${ia.name} on the shelf: the recipe needs 2 portions.`) } };
    }
    return { ok: true };
  }
  for (const ing of [ia, ib]) {
    if ((stock[ing.id] || 0) < 1) {
      return { ok: false, error: { code: 'INSUFFICIENT_STOCK', message: L(`Falta ${ing.name} na prateleira.`, `No ${ing.name} left on the shelf.`) } };
    }
  }
  return { ok: true };
}

export function mix(state, a, b, rng = Math.random) {
  const check = canMix(state, a, b);
  if (!check.ok) return { ok: false, state, error: check.error };

  const next = structuredClone(state);
  const free = next.upgrades && next.upgrades.caldeirao ? rng() < CONFIG.EFFICIENCY_CHANCE : false;
  if (!free) {
    next.stock[a] -= 1;
    next.stock[b] -= 1;
  }

  const recipe = findRecipe(a, b);
  const itemId = recipe ? recipe.id : SLUDGE.id;
  const isNew = !!recipe && !next.discovered.includes(recipe.id);
  // Alambique Duplo: receita já conhecida pode render dois frascos
  const double = !!recipe && !isNew && !!(next.upgrades && next.upgrades.alambique) && rng() < CONFIG.DOUBLE_CHANCE;
  next.inventory[itemId] = (next.inventory[itemId] || 0) + (double ? 2 : 1);

  if (isNew) next.discovered.push(recipe.id);

  const xpGained = CONFIG.XP_PER_MIX + (isNew ? CONFIG.XP_DISCOVERY : 0);
  next.xp += xpGained;
  next.stats.mixes += 1;
  if (!recipe) {
    next.stats.failures += 1;
    const key = recipeKey(a, b);
    if (!Array.isArray(next.failedPairs)) next.failedPairs = [];
    if (!next.failedPairs.includes(key)) next.failedPairs.push(key);
  }

  return {
    ok: true,
    state: next,
    result: { itemId, recipeId: recipe ? recipe.id : null, isNew, free, double, xpGained },
  };
}

export function buyIngredient(state, ingredientId, qty = 1) {
  const ing = getIngredient(ingredientId);
  if (!ing) return fail(state, 'INVALID_ID', L('O mercador não conhece esse ingrediente.', 'The merchant doesn’t know that ingredient.'));
  if (!Number.isInteger(qty) || qty < 1) return fail(state, 'INVALID_ID', L('Quantidade inválida.', 'Invalid quantity.'));
  const cost = ing.cost * qty;
  if (state.coins < cost) return fail(state, 'INSUFFICIENT_FUNDS', L('A bolsa não tem moedas para isso.', 'Your purse doesn’t have enough coins for that.'));
  const next = structuredClone(state);
  next.coins -= cost;
  next.stock[ingredientId] = (next.stock[ingredientId] || 0) + qty;
  return { ok: true, state: next, result: { ingredientId, qty, cost } };
}

export function sellItem(state, itemId) {
  const item = getItem(itemId);
  if (!item) return fail(state, 'INVALID_ID', L('Esse frasco não está na prateleira.', 'That flask is not on the shelf.'));
  if (!state.inventory || (state.inventory[itemId] || 0) < 1) {
    return fail(state, 'NOT_IN_INVENTORY', L(`Não há ${item.name} na prateleira.`, `There is no ${item.name} on the shelf.`));
  }
  const price = sellPrice(state, itemId);
  const next = addCoins(state, price);
  next.inventory[itemId] -= 1;
  if (next.inventory[itemId] <= 0) delete next.inventory[itemId];
  next.stats.sold += 1;
  return { ok: true, state: next, result: { itemId, price } };
}

// Grimório: esta combinação já foi tentada e virou Lodo?
export function isKnownFailure(state, a, b) {
  return Array.isArray(state.failedPairs) && state.failedPairs.includes(recipeKey(a, b));
}

export function isVictory(state) {
  return !!state && Array.isArray(state.discovered) && state.discovered.length === CONFIG.TOTAL_RECIPES;
}

export function addCoins(state, amount) {
  const next = structuredClone(state);
  const add = toSafeInt(amount);
  if (add > 0) {
    next.coins += add;
    next.stats.coinsEarned += add;
    if (next.coins > next.stats.bestCoins) next.stats.bestCoins = next.coins;
  }
  return next;
}
