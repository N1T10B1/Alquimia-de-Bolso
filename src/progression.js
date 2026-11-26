// Progressão: pedidos, melhorias, dicas e livro de receitas.
// Funções puras: nunca modificam o estado recebido; sem DOM.
import { IS_DEMO, CONFIG, RECIPES, INGREDIENTS, UPGRADES, CUSTOMERS, CATEGORIES, getRecipe, getIngredient, upkeepForDay, patienceForDay, fameTier } from './data.js';
import { orderReward, addCoins, buyIngredient, newDayPlan, sellPrice } from './engine.js';

// ---------- utilitários internos ----------

function fail(state, code, message) {
  return { ok: false, state, error: { code, message } };
}

function pick(list, rng) {
  if (!list.length) return undefined;
  let r = Number(rng());
  if (!Number.isFinite(r) || r < 0) r = 0;
  const i = Math.min(list.length - 1, Math.floor(r * list.length));
  return list[i];
}

function slots() {
  return CONFIG.ORDER_SLOTS ?? 3;
}

function discoveredList(state) {
  const seen = new Set();
  const out = [];
  for (const id of Array.isArray(state.discovered) ? state.discovered : []) {
    if (getRecipe(id) && !seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

// Escolhe a 1ª lista não vazia entre as preferências (filtros progressivamente mais frouxos).
function pickPreferred(base, excludeSets, rng) {
  for (const excl of excludeSets) {
    const candidates = base.filter((id) => !excl.has(id));
    if (candidates.length) return pick(candidates, rng);
  }
  return pick(base, rng);
}

function pickCustomer(draft, otherOrders, rng) {
  const ids = CUSTOMERS.map((c) => c.id);
  const here = new Set(otherOrders.map((o) => o.customerId));
  const today = new Set([...here, ...(draft.plan?.visitors || [])]);
  if (draft.lastCustomer) today.add(draft.lastCustomer);
  const recent = new Set(here);
  if (draft.lastCustomer) recent.add(draft.lastCustomer);
  return pickPreferred(ids, [today, recent, here], rng);
}

function clueCount(potionId) {
  return getRecipe(potionId)?.clues?.length || 1;
}

function pickClue(potionId, rng) {
  let r = Number(rng());
  if (!Number.isFinite(r) || r < 0) r = 0;
  return Math.min(clueCount(potionId) - 1, Math.floor(r * clueCount(potionId)));
}

// Receitas que podem ser pedidas como novidade no dia (raridade liberada aos poucos).
function novelPool(draft) {
  const disc = new Set(discoveredList(draft));
  const from = CONFIG.RARITY_FROM_DAY || {};
  const day = Number.isInteger(draft.day) && draft.day > 0 ? draft.day : 1;
  return RECIPES.filter((r) => !disc.has(r.id) && (from[r.rarity] ?? 1) <= day).map((r) => r.id);
}

function ensurePlan(draft) {
  const p = draft.plan;
  if (!p || typeof p !== 'object' || !Number.isInteger(p.total)) {
    draft.plan = newDayPlan(draft.day, draft.coins, draft.reputation, (draft.discovered || []).length);
    draft.plan.arrived = Array.isArray(draft.orders) ? draft.orders.length : 0;
  }
  for (const k of ['asked', 'visitors']) if (!Array.isArray(draft.plan[k])) draft.plan[k] = [];
  return draft.plan;
}

// Cria o pedido do próximo cliente do dia (muta `draft`, que já é um clone).
// Estímulo: o 1º cliente de cada dia (e ~35% dos demais) pede uma receita que ainda
// não está no caderno, paga bônus e ensina a experimentar. Os outros são sorteados com
// pesos entre as receitas conhecidas (ver comentário v1.16 abaixo).
function makeOrder(draft, otherOrders, rng) {
  const plan = ensurePlan(draft);
  const known = discoveredList(draft);
  const fresh = novelPool(draft);
  const wantNovel = fresh.length > 0 && (known.length === 0 || plan.novel === 0 || Number(rng()) < (CONFIG.NOVEL_CHANCE ?? 0.35));
  const open = new Set(otherOrders.map((o) => o.potionId));
  const last = draft.lastPotion ? [draft.lastPotion] : [];
  // v1.16 — sorteio ponderado: o pedido aberto e o último (atendido ou mandado embora) nunca
  // se repetem; o que já foi pedido hoje e nos últimos dias pesa pouco; receitas que usam os
  // mesmos ingredientes do pedido logo à frente, ou que a prateleira não consegue fazer agora, pesam menos.
  const blocked = new Set([...open, ...last]);
  const today = new Set(plan.asked);
  const recent = Array.isArray(draft.recentAsked) ? draft.recentAsked : [];
  // quem vem logo antes na fila (ou o último que saiu, se a fila está vazia)
  const ahead = otherOrders.length ? otherOrders[otherOrders.length - 1].potionId : draft.lastPotion;
  const lastRecipe = getRecipe(ahead);
  const lastIngs = lastRecipe ? [lastRecipe.a, lastRecipe.b] : [];
  let allowToday = false; // só repete uma poção do dia se não houver outra
  const weight = (id) => {
    if (blocked.has(id)) return 0;
    if (today.has(id) && !allowToday) return 0;
    const r = getRecipe(id);
    let w = (CONFIG.RARITY_WEIGHT || {})[r.rarity] ?? 1;
    if (today.has(id)) w *= CONFIG.WEIGHT_ASKED_TODAY ?? 0.1;
    const ago = recent.lastIndexOf(id);
    if (ago >= 0) w *= (CONFIG.WEIGHT_RECENT ?? 0.35) + (CONFIG.WEIGHT_RECENT_STEP ?? 0.1) * (recent.length - 1 - ago);
    if (lastIngs.includes(r.a) || lastIngs.includes(r.b)) w *= CONFIG.WEIGHT_SAME_INGREDIENT ?? 0.6;
    if (known.includes(id) && !((draft.inventory || {})[id] > 0) && !canBrew(draft, r)) w *= CONFIG.WEIGHT_CANT_BREW ?? 0.6;
    return w;
  };
  const freshLeft = fresh.some((id) => weight(id) > 0);
  const knownLeft = known.some((id) => weight(id) > 0);
  // se as novidades liberadas já foram pedidas hoje, o cliente pede algo conhecido (e vice-versa)
  let base = wantNovel && (freshLeft || !knownLeft) ? fresh : (known.length ? known : fresh);
  if (!wantNovel && !knownLeft && freshLeft) base = fresh;
  if (!base.some((id) => weight(id) > 0)) base = [...known, ...fresh];
  if (!base.some((id) => weight(id) > 0)) allowToday = true;
  if (!base.length) return null;
  const potionId = pickWeighted(base, weight, rng) ?? pickPreferred(base, [blocked, new Set(open)], rng);
  const customerId = pickCustomer(draft, otherOrders, rng);
  const seq = (Number.isInteger(draft.orderSeq) && draft.orderSeq >= 0 ? draft.orderSeq : 0) + 1;
  draft.orderSeq = seq;
  const novel = !known.includes(potionId);
  plan.arrived += 1;
  if (novel) plan.novel += 1;
  plan.asked.push(potionId);
  plan.visitors.push(customerId);
  draft.recentAsked = [...recent, potionId].slice(-(CONFIG.RECENT_MEMORY ?? 6));
  // a frase do pedido também varia: não repete a última usada para esta poção
  const clues = draft.lastClue && typeof draft.lastClue === 'object' ? draft.lastClue : {};
  let clue = pickClue(potionId, rng);
  if (clueCount(potionId) > 1 && clues[potionId] === clue) clue = (clue + 1 + Math.floor(Number(rng()) * (clueCount(potionId) - 1) || 0)) % clueCount(potionId);
  draft.lastClue = { ...clues, [potionId]: clue };
  return { id: 'o' + seq, customerId, potionId, clue, misses: 0, novel, patience: patienceFor(draft, novel, customerId), waited: 0 };
}

// Sorteio com pesos (peso 0 nunca sai). Devolve undefined se ninguém tem peso.
function pickWeighted(list, weight, rng) {
  const ws = list.map((id) => Math.max(0, Number(weight(id)) || 0));
  const total = ws.reduce((a, b) => a + b, 0);
  if (!(total > 0)) return undefined;
  let r = Number(rng());
  if (!Number.isFinite(r) || r < 0) r = 0;
  r = Math.min(r, 0.999999) * total;
  for (let i = 0; i < list.length; i++) {
    if (ws[i] <= 0) continue;
    if (r < ws[i]) return list[i];
    r -= ws[i];
  }
  return list[ws.findLastIndex((w) => w > 0)];
}

// A prateleira tem ingredientes para fazer esta receita agora?
function canBrew(state, recipe) {
  const st = state.stock || {};
  return recipe.a === recipe.b ? (st[recipe.a] || 0) >= 2 : (st[recipe.a] || 0) >= 1 && (st[recipe.b] || 0) >= 1;
}

// ---------- paciência (v1.14) ----------

// Quanto tempo (ms) um cliente novo aguenta esperar; 0 = sem pressa (dias 1–2 ou opção "sem pressa").
// v1.15: cada freguês multiplica a paciência pelo seu jeito (Vovó Quitéria ×1,3; Pirata Dorotéia ×0,75).
export function patienceFor(state, novel = false, customerId = null) {
  if (state && state.relaxed) return 0;
  const base = patienceForDay(state && state.day);
  if (!base) return 0;
  const tier = fameTier(state && state.reputation);
  const who = CUSTOMERS.find((c) => c.id === customerId);
  const temper = who && Number.isFinite(who.patience) ? who.patience : 1;
  return Math.round(base * temper * (novel ? (CONFIG.PATIENCE_NOVEL ?? 1) : 1) * (1 + (tier.patience || 0)));
}

// Fração de paciência que resta (1 = acabou de chegar; 0 = vai embora). Sem pressa = 1.
export function patienceLeft(order) {
  const total = Number(order && order.patience) || 0;
  if (total <= 0) return 1;
  return Math.max(0, Math.min(1, 1 - (Number(order.waited) || 0) / total));
}

// O tempo passa: o cliente do balcão perde paciência na velocidade normal; os da fila, na metade.
// Devolve o estado novo e os pedidos cuja paciência acabou (quem chama decide tirá-los com walkOutOrder).
export function tickPatience(state, dtMs, counterId = null) {
  const dt = Number.isFinite(dtMs) && dtMs > 0 ? dtMs : 0;
  if (!dt || state.phase === 'closed' || !Array.isArray(state.orders) || !state.orders.some((o) => o && o.patience > 0)) {
    return { state, expired: [] };
  }
  const next = structuredClone(state);
  const counter = counterId && next.orders.some((o) => o.id === counterId) ? counterId : next.orders[0].id;
  const expired = [];
  for (const o of next.orders) {
    if (!(o.patience > 0)) continue;
    const rate = o.id === counter ? 1 : (CONFIG.QUEUE_DRAIN ?? 0.5);
    o.waited = Math.min(o.patience, (Number(o.waited) || 0) + dt * rate);
    if (o.waited >= o.patience) expired.push(o.id);
  }
  return { state: next, expired };
}

// O cliente cansou de esperar e foi embora: −2 de fama (mais do que mandar embora, que custa 1).
export function walkOutOrder(state, orderId) {
  const index = findOrderIndex(state, orderId);
  if (index < 0) return fail(state, 'INVALID_ORDER', 'Esse cliente já foi embora.');
  const next = structuredClone(state);
  ensurePlan(next);
  const order = finishOrder(next, index);
  next.plan.gaveUp = (next.plan.gaveUp || 0) + 1;
  next.reputation = Math.max(0, (next.reputation || 0) - (CONFIG.WALKOUT_FAME ?? 2));
  next.stats.gaveUp = (next.stats.gaveUp || 0) + 1;
  return { ok: true, state: next, result: { orderId, customerId: order.customerId, potionId: order.potionId, fame: CONFIG.WALKOUT_FAME ?? 2 } };
}

// Liga/desliga a opção "Freguesia sem pressa": os clientes presentes também deixam de ter pressa.
export function setRelaxed(state, on) {
  const relaxed = !!on;
  if (!!state.relaxed === relaxed) return state;
  const next = structuredClone(state);
  next.relaxed = relaxed;
  if (relaxed) for (const o of next.orders || []) { o.patience = 0; o.waited = 0; }
  return next;
}

function isValidOrder(order) {
  return (
    order !== null &&
    typeof order === 'object' &&
    typeof order.id === 'string' &&
    order.id.length > 0 &&
    !!getRecipe(order.potionId) &&
    CUSTOMERS.some((c) => c.id === order.customerId)
  );
}

function findOrderIndex(state, orderId) {
  if (!Array.isArray(state.orders) || typeof orderId !== 'string') return -1;
  return state.orders.findIndex((o) => o && o.id === orderId);
}

// ---------- dias de atendimento e pedidos ----------

// Com a loja aberta, os clientes do dia entram até ocupar os 3 lugares do balcão/fila.
export function fillOrders(state, rng = Math.random) {
  const draft = structuredClone(state);
  ensurePlan(draft);
  const ids = new Set();
  const kept = [];
  for (const o of Array.isArray(draft.orders) ? draft.orders : []) {
    if (kept.length >= slots()) break;
    if (!isValidOrder(o) || ids.has(o.id)) continue;
    ids.add(o.id);
    const max = clueCount(o.potionId) - 1;
    kept.push({
      id: o.id, customerId: o.customerId, potionId: o.potionId,
      clue: Number.isInteger(o.clue) && o.clue >= 0 && o.clue <= max ? o.clue : 0,
      misses: Number.isInteger(o.misses) && o.misses > 0 ? Math.min(o.misses, CONFIG.REVEAL_AFTER_MISSES ?? 2) : 0,
      novel: o.novel === true,
      patience: Number.isFinite(o.patience) && o.patience > 0 ? Math.floor(o.patience) : 0,
      waited: Number.isFinite(o.waited) && o.waited > 0 ? Math.min(Math.floor(o.waited), Number.isFinite(o.patience) && o.patience > 0 ? Math.floor(o.patience) : 0) : 0,
    });
  }
  draft.orders = kept;
  if (draft.phase === 'closed') return draft;
  while (draft.orders.length < slots() && draft.plan.arrived < draft.plan.total) {
    const order = makeOrder(draft, draft.orders, rng);
    if (!order) break;
    draft.orders.push(order);
  }
  return draft;
}

function finishOrder(next, index) {
  const [order] = next.orders.splice(index, 1);
  next.plan.served = Math.min(next.plan.total, (next.plan.served || 0) + 1);
  next.lastPotion = order.potionId;
  next.lastCustomer = order.customerId;
  return order;
}

// Pedidos por pistas: o cliente descreve o problema e o jogador escolhe qual poção entregar.
// `givenPotionId` omitido = entrega a poção pedida. Poção errada: não consome nada, custa
// 1 de reputação e o cliente dá mais pistas (2ª frase; após 2 erros, o nome da poção).
// Acertou: o cliente paga (com bônus se o pedido era inédito) e vai embora.
export function deliverOrder(state, orderId, rng = Math.random, givenPotionId) {
  const index = findOrderIndex(state, orderId);
  if (index < 0) return fail(state, 'INVALID_ORDER', 'Esse cliente já foi embora.');
  const order = state.orders[index];
  const recipe = getRecipe(order.potionId);
  if (!recipe) return fail(state, 'INVALID_ORDER', 'Esse pedido está confuso.');
  if (givenPotionId !== undefined && givenPotionId !== order.potionId) {
    const given = getRecipe(givenPotionId);
    if (!given) return fail(state, 'INVALID_ID', 'Essa poção não consta no caderno.');
    if (!((state.inventory?.[givenPotionId] ?? 0) >= 1)) {
      return fail(state, 'NOT_IN_INVENTORY', `Não há ${given.name} na prateleira.`);
    }
    const next = structuredClone(state);
    const o = next.orders[index];
    o.misses = Math.min((o.misses || 0) + 1, CONFIG.REVEAL_AFTER_MISSES ?? 2);
    next.reputation = Math.max(0, (next.reputation || 0) - 1);
    return {
      ok: true,
      state: next,
      result: { orderId, correct: false, potionId: givenPotionId, misses: o.misses, revealed: isOrderRevealed(o) },
    };
  }
  const have = state.inventory?.[order.potionId] ?? 0;
  if (!(have >= 1)) {
    return fail(state, 'NOT_IN_INVENTORY', `Não há ${recipe.name} na prateleira. Prepare uma no caldeirão primeiro.`);
  }

  const bonus = order.novel ? (CONFIG.NOVEL_BONUS ?? 0) : 0;
  const reward = orderReward(state, order.potionId) + bonus;
  // gorjeta: atendido com mais da metade da paciência (só quando há pressa)
  const tip = order.patience > 0 && patienceLeft(order) >= (CONFIG.TIP_FAST_RATIO ?? 0.5) ? (CONFIG.TIP_FAST ?? 0) : 0;
  const next = addCoins(state, reward + tip); // addCoins já devolve um clone
  ensurePlan(next);
  const left = have - 1;
  if (left > 0) next.inventory[order.potionId] = left;
  else delete next.inventory[order.potionId];
  next.xp = (next.xp || 0) + (CONFIG.XP_DELIVERY ?? 3) + (order.novel ? (CONFIG.NOVEL_XP ?? 0) : 0);
  next.stats.delivered = (next.stats.delivered || 0) + 1;
  next.reputation = (next.reputation || 0) + 1;
  next.plan.earned = (next.plan.earned || 0) + reward;
  next.plan.tips = (next.plan.tips || 0) + tip;
  next.stats.tips = (next.stats.tips || 0) + tip;
  if (!Array.isArray(next.plan.delivered)) next.plan.delivered = [];
  if (next.plan.delivered.length < 40) next.plan.delivered.push({ potionId: order.potionId, reward });
  finishOrder(next, index);
  void rng;

  return { ok: true, state: next, result: { orderId, correct: true, potionId: order.potionId, reward, bonus, tip, novel: !!order.novel } };
}

// Sem ingredientes (ou sem paciência): o cliente vai embora sem poção. Custa 1 de fama.
export function dismissOrder(state, orderId) {
  const index = findOrderIndex(state, orderId);
  if (index < 0) return fail(state, 'INVALID_ORDER', 'Esse cliente já foi embora.');
  const next = structuredClone(state);
  ensurePlan(next);
  const order = finishOrder(next, index);
  next.plan.sentAway = (next.plan.sentAway || 0) + 1;
  next.reputation = Math.max(0, (next.reputation || 0) - 1);
  next.stats.dismissed = (next.stats.dismissed || 0) + 1;
  return { ok: true, state: next, result: { orderId, customerId: order.customerId, potionId: order.potionId } };
}

// Quanto o pedido mostra ao jogador: frases de pista e, após erros suficientes, o nome.
export function isOrderRevealed(order) {
  return (order?.misses || 0) >= (CONFIG.REVEAL_AFTER_MISSES ?? 2);
}

export function getOrderClues(order) {
  const recipe = getRecipe(order?.potionId);
  if (!recipe) return [];
  const n = recipe.clues.length;
  const first = Number.isInteger(order.clue) && order.clue >= 0 && order.clue < n ? order.clue : 0;
  const clues = [recipe.clues[first]];
  if ((order.misses || 0) >= 1 && n > 1) clues.push(recipe.clues[(first + 1) % n]);
  return clues;
}

// O dia acaba quando todos os clientes previstos chegaram e foram atendidos ou mandados embora.
export function isDayOver(state) {
  return state.phase !== 'closed'
    && !!state.plan && state.plan.arrived >= state.plan.total
    && (!Array.isArray(state.orders) || state.orders.length === 0);
}

// Fecha a loja: resumo do dia e a mercadora chega. Se a botica ficou sem como trabalhar
// (quase sem ingredientes e sem moedas), a mercadora deixa um punhado fiado.
export function closeDay(state) {
  if (!isDayOver(state)) return fail(state, 'DAY_NOT_OVER', 'Ainda há clientes para atender hoje.');
  const next = structuredClone(state);
  next.phase = 'closed';
  next.merchantWait = 0;
  next.merchantGone = false;
  next.merchantSludge = 0;
  ensurePlan(next);
  // dia perfeito: todo cliente saiu com a poção (ninguém mandado embora nem cansado de esperar)
  const perfect = next.plan.total > 0 && !(next.plan.sentAway > 0) && !(next.plan.gaveUp > 0);
  next.plan.perfect = 0;
  if (perfect) {
    const bonus = next.plan.total * (CONFIG.PERFECT_PER_CUSTOMER ?? 0);
    Object.assign(next, addCoins(next, bonus));
    next.plan.perfect = bonus;
    next.reputation = (next.reputation || 0) + (CONFIG.PERFECT_FAME ?? 0);
    next.stats.perfectDays = (next.stats.perfectDays || 0) + 1;
  }
  // v1.27 — aluguel fixo + o que estava atrasado. A bolsa paga o que puder (nunca fica negativa);
  // o resto vai para a conta do senhorio. DEBT_CLOSES fechamentos seguidos devendo: ele vem cobrar.
  const upkeep = upkeepForDay(next.day);
  const due = upkeep + Math.max(0, Number(next.debt) || 0);
  const paid = Math.min(Math.max(0, next.coins || 0), due);
  next.coins -= paid;
  next.debt = due - paid;
  next.debtDays = next.debt > 0 ? (Number(next.debtDays) || 0) + 1 : 0;
  next.landlord = next.debt > 0 && next.debtDays >= (CONFIG.DEBT_CLOSES ?? 3);
  ensurePlan(next);
  next.plan.upkeep = upkeep;
  next.plan.paid = paid;
  next.plan.debt = next.debt;
  const units = Object.values(next.stock || {}).reduce((a, b) => a + (Number(b) || 0), 0);
  const potions = Object.values(next.inventory || {}).reduce((a, b) => a + (Number(b) || 0), 0);
  const cheapest = Math.min(...INGREDIENTS.map((i) => i.cost));
  const aid = units < 4 && potions === 0 && next.coins < cheapest * 2;
  if (aid) {
    for (const ing of INGREDIENTS.filter((i) => i.cost === cheapest).slice(0, 4)) {
      next.stock[ing.id] = (next.stock[ing.id] || 0) + 1;
    }
  }
  return {
    ok: true,
    state: next,
    result: { day: next.day, ...structuredClone(next.plan), endCoins: next.coins, aid, upkeep, paid, debt: next.debt, landlord: next.landlord, isPerfect: perfect },
  };
}

// A mercadora só monta a banca depois que o senhorio (se veio cobrar) for embora.
export function isMerchantHere(state) {
  return state.phase === 'closed' && !state.merchantGone && !state.landlord;
}

// ---------- aluguel atrasado e o senhorio (v1.27) ----------

// Quantos fechamentos ainda faltam até o senhorio vir cobrar (0 = ele já está aqui ou nada é devido).
export function closesUntilLandlord(state) {
  if (!(state.debt > 0) || state.landlord) return 0;
  return Math.max(1, (CONFIG.DEBT_CLOSES ?? 3) - (Number(state.debtDays) || 0));
}

// Quanto os frascos da prateleira rendem se vendidos agora (para juntar o aluguel).
export function shelfValue(state) {
  return Object.entries(state.inventory || {}).reduce((sum, [id, n]) => sum + sellPrice(state, id) * (Number(n) || 0), 0);
}

// Paga a dívida inteira ao senhorio; ele vai embora e a mercadora chega.
export function payLandlord(state) {
  if (!(state.debt > 0)) return fail(state, 'NO_DEBT', 'Não há aluguel atrasado.');
  if ((state.coins || 0) < state.debt) {
    return fail(state, 'NOT_ENOUGH_COINS', `Faltam ${state.debt - (state.coins || 0)} moedas para quitar o aluguel.`);
  }
  const next = structuredClone(state);
  const paid = next.debt;
  next.coins -= paid;
  next.debt = 0;
  next.debtDays = 0;
  next.landlord = false;
  ensurePlan(next);
  next.plan.paid = (next.plan.paid || 0) + paid;
  next.plan.debt = 0;
  return { ok: true, state: next, result: { paid } };
}

// Sem como pagar: o senhorio leva a chave e a botica fecha (fim de jogo).
export function evict(state) {
  if (!state.landlord) return fail(state, 'NO_LANDLORD', 'O senhorio não está cobrando agora.');
  const next = structuredClone(state);
  next.evicted = true;
  const stats = next.stats || {};
  return {
    ok: true,
    state: next,
    result: {
      day: next.day || 1,
      debt: next.debt || 0,
      served: stats.delivered || 0,
      brewed: Math.max(0, (stats.mixes || 0) - (stats.failures || 0)),
      found: (next.discovered || []).length,
      total: CONFIG.TOTAL_RECIPES,
    },
  };
}

// ---------- fim da demo (v1.28) ----------

// A demo acaba no fechamento do último dia, depois do senhorio (se ele veio cobrar e foi pago).
export function isDemoOver(state) {
  return IS_DEMO && !!state && state.phase === 'closed' && !state.landlord && !state.evicted
    && (Number(state.day) || 1) >= (CONFIG.DEMO_LAST_DAY ?? 5);
}

// Resumo da partida para a carta de fim da demo.
export function demoSummary(state) {
  const s = state || {};
  const stats = s.stats || {};
  return {
    day: s.day || 1,
    served: stats.delivered || 0,
    brewed: Math.max(0, (stats.mixes || 0) - (stats.failures || 0)),
    found: (s.discovered || []).length,
    total: CONFIG.TOTAL_RECIPES,
    coins: s.coins || 0,
    reputation: s.reputation || 0,
    fame: fameTier(s.reputation || 0).name,
    perfectDays: stats.perfectDays || 0,
  };
}

// Recomeçar depois de perder a botica: caderno novo, mas as receitas e o grimório ficam.
export function restartAfterEviction(state, fresh) {
  const keep = state || {};
  return {
    ...fresh,
    discovered: [...(keep.discovered || [])],
    failedPairs: [...(keep.failedPairs || [])],
    hints: { ...(keep.hints || {}) },
    seenTips: [...(keep.seenTips || [])],
    sound: !!keep.sound,
    relaxed: !!keep.relaxed,
    victorySeen: !!keep.victorySeen,
  };
}

// ---------- paciência da mercadora (v1.23) ----------

// Quanto tempo (ms) a mercadora espera por noite; 0 = sem pressa (opção "Freguesia sem pressa").
export function merchantPatience(state) {
  return state && state.relaxed ? 0 : (CONFIG.MERCHANT_PATIENCE_S ?? 240) * 1000;
}

// A vela da mercadora no formato de um pedido (para reaproveitar a vela da paciência).
export function merchantCandle(state) {
  const patience = merchantPatience(state);
  if (!patience || !isMerchantHere(state)) return null;
  return { id: 'mercadora', patience, waited: Math.min(patience, Number(state.merchantWait) || 0) };
}

// O tempo passa à noite: quando a vela apaga, a mercadora fecha a banca e segue viagem.
export function tickMerchant(state, dtMs) {
  const dt = Number.isFinite(dtMs) && dtMs > 0 ? dtMs : 0;
  const patience = merchantPatience(state);
  if (!dt || !patience || !isMerchantHere(state)) return { state, gone: false };
  const next = structuredClone(state);
  next.merchantWait = Math.min(patience, (Number(next.merchantWait) || 0) + dt);
  const gone = next.merchantWait >= patience;
  if (gone) next.merchantGone = true;
  return { state: next, gone };
}

// A mercadora só vende no fim do dia (e enquanto não for embora).
export function buyFromMerchant(state, ingredientId, qty = 1) {
  if (state.phase === 'closed' && state.merchantGone) {
    return fail(state, 'MERCHANT_GONE', 'A mercadora já seguiu viagem. Ela volta amanhã à noite.');
  }
  if (!isMerchantHere(state)) {
    return fail(state, 'MERCHANT_AWAY', 'A mercadora só abre a banca no fim do dia.');
  }
  return buyIngredient(state, ingredientId, qty);
}

// v1.26 — a mercadora compra Lodo Instável à noite (preço fixo, até MERCHANT_SLUDGE_MAX por noite).
export function merchantSludgeLeft(state) {
  if (!isMerchantHere(state)) return 0;
  const max = CONFIG.MERCHANT_SLUDGE_MAX ?? 3;
  const sold = Number.isInteger(state.merchantSludge) && state.merchantSludge > 0 ? state.merchantSludge : 0;
  return Math.max(0, Math.min(max - sold, (state.inventory || {}).lodo || 0));
}

export function sellSludgeToMerchant(state) {
  if (state.phase === 'closed' && state.merchantGone) {
    return fail(state, 'MERCHANT_GONE', 'A mercadora já seguiu viagem. Ela volta amanhã à noite.');
  }
  if (!isMerchantHere(state)) return fail(state, 'MERCHANT_AWAY', 'A mercadora só abre a banca no fim do dia.');
  if (!((state.inventory || {}).lodo > 0)) return fail(state, 'NOT_IN_INVENTORY', 'Não há Lodo na prateleira.');
  if (merchantSludgeLeft(state) < 1) return fail(state, 'MERCHANT_FULL', 'A carroça já está cheia de Lodo por hoje.');
  const price = CONFIG.MERCHANT_SLUDGE_PRICE ?? 3;
  const next = addCoins(state, price);
  next.inventory.lodo -= 1;
  if (next.inventory.lodo <= 0) delete next.inventory.lodo;
  next.merchantSludge = (Number.isInteger(next.merchantSludge) ? next.merchantSludge : 0) + 1;
  next.stats.sold += 1;
  return { ok: true, state: next, result: { price, left: merchantSludgeLeft(next) } };
}

// Abre a loja no dia seguinte, com mais clientes.
export function startNextDay(state, rng = Math.random) {
  if (state.phase !== 'closed') return fail(state, 'DAY_OPEN', 'A loja já está aberta.');
  if (state.landlord) return fail(state, 'LANDLORD_HERE', 'O senhorio está no balcão esperando o aluguel.');
  if (state.evicted) return fail(state, 'EVICTED', 'A botica fechou as portas.');
  if (isDemoOver(state)) return fail(state, 'DEMO_OVER', 'A demo termina aqui: o caderno fecha no fim do dia ' + CONFIG.DEMO_LAST_DAY + '.');
  const next = structuredClone(state);
  next.day = (Number.isInteger(next.day) && next.day > 0 ? next.day : 1) + 1;
  next.phase = 'open';
  next.merchantWait = 0;
  next.merchantGone = false;
  next.merchantSludge = 0;
  if (next.upgrades && next.upgrades.estufa) {
    for (const id of CONFIG.GREENHOUSE || []) next.stock[id] = (next.stock[id] || 0) + 1;
  }
  next.plan = newDayPlan(next.day, next.coins, next.reputation, (next.discovered || []).length);
  next.orders = [];
  const filled = fillOrders(next, rng);
  return { ok: true, state: filled, result: { day: filled.day, customers: filled.plan.total } };
}

// ---------- melhorias ----------

export function buyUpgrade(state, upgradeId) {
  const upgrade = UPGRADES.find((u) => u.id === upgradeId);
  if (!upgrade) return fail(state, 'INVALID_ID', 'Esse utensílio não existe.');
  if (state.upgrades?.[upgradeId] === true) {
    return fail(state, 'ALREADY_OWNED', `${upgrade.name} já está na sua botica.`);
  }
  if (!(state.coins >= upgrade.cost)) {
    return fail(state, 'INSUFFICIENT_FUNDS', `A bolsa não alcança: ${upgrade.name} custa ${upgrade.cost} moedas.`);
  }
  const next = structuredClone(state);
  next.coins -= upgrade.cost;
  next.upgrades = { ...(next.upgrades || {}), [upgradeId]: true };
  return { ok: true, state: next, result: { upgradeId, cost: upgrade.cost } };
}

// ---------- dicas ----------

function undiscoveredRecipes(state) {
  const disc = new Set(discoveredList(state));
  return RECIPES.filter((r) => !disc.has(r.id));
}

export function canRequestHint(state) {
  if (state.upgrades?.lupa !== true) {
    return { ok: false, error: { code: 'LOCKED', message: 'Compre a Lupa Arcana para estudar dicas pagas.' } };
  }
  if (!undiscoveredRecipes(state).length) {
    return { ok: false, error: { code: 'NOTHING_TO_HINT', message: 'O caderno está completo: não há segredos a revelar.' } };
  }
  const cost = CONFIG.HINT_COST ?? 5;
  if (!(state.coins >= cost)) {
    return { ok: false, error: { code: 'INSUFFICIENT_FUNDS', message: `Uma dica da Lupa custa ${cost} moedas.` } };
  }
  return { ok: true };
}

function giveHint(state, rng, apply) {
  const hints = state.hints && typeof state.hints === 'object' ? state.hints : {};
  const pending = undiscoveredRecipes(state);
  const fresh = pending.filter((r) => !Object.prototype.hasOwnProperty.call(hints, r.id));
  const repeated = fresh.length === 0;
  const recipe = pick(repeated ? pending : fresh, rng);
  const next = structuredClone(state);
  apply(next);
  next.hints = { ...(next.hints || {}), [recipe.id]: recipe.a };
  return { ok: true, state: next, result: { recipeId: recipe.id, ingredientId: recipe.a, repeated } };
}

export function requestHint(state, rng = Math.random) {
  const check = canRequestHint(state);
  if (!check.ok) return { ok: false, state, error: check.error };
  return giveHint(state, rng, (next) => { next.coins -= CONFIG.HINT_COST ?? 5; });
}

// Dica grátis: não exige a Lupa; recarrega a cada CONFIG.FREE_HINT_COOLDOWN_MS (sem acumular).
export function freeHintWaitMs(state, now) {
  const ready = Number.isFinite(state.freeHintReadyAt) ? state.freeHintReadyAt : 0;
  return Math.max(0, ready - now);
}

export function canRequestFreeHint(state, now) {
  if (!undiscoveredRecipes(state).length) {
    return { ok: false, error: { code: 'NOTHING_TO_HINT', message: 'O caderno está completo: não há segredos a revelar.' } };
  }
  const wait = freeHintWaitMs(state, now);
  if (wait > 0) {
    const min = Math.ceil(wait / 60000);
    return { ok: false, error: { code: 'COOLDOWN', message: `A próxima dica grátis chega em ${min} min.` } };
  }
  return { ok: true };
}

export function requestFreeHint(state, now, rng = Math.random) {
  if (!Number.isFinite(now)) return fail(state, 'INVALID_ID', 'Horário inválido.');
  const check = canRequestFreeHint(state, now);
  if (!check.ok) return { ok: false, state, error: check.error };
  return giveHint(state, rng, (next) => { next.freeHintReadyAt = now + (CONFIG.FREE_HINT_COOLDOWN_MS ?? 240000); });
}

// Lodo que ensina: aponta um ingrediente do par que ainda guarda receita não descoberta
// e a qualidade do parceiro que falta ("A Brasa Rubra pedia algo úmido"). Determinístico.
export function sludgeClue(state, a, b) {
  const disc = new Set(discoveredList(state));
  for (const ingId of a === b ? [a] : [a, b]) {
    const recipe = RECIPES.find((r) => !disc.has(r.id) && (r.a === ingId || r.b === ingId));
    if (recipe) {
      const partner = recipe.a === ingId ? recipe.b : recipe.a;
      return { ingredientId: ingId, quality: getIngredient(partner)?.quality ?? '' };
    }
  }
  return null;
}

// ---------- livro de receitas ----------

export function getRecipeBook(state) {
  const disc = new Set(discoveredList(state));
  const hints = state.hints && typeof state.hints === 'object' ? state.hints : {};
  return RECIPES.map((r) => {
    const known = disc.has(r.id);
    const hasHint = Object.prototype.hasOwnProperty.call(hints, r.id);
    const hint = hasHint ? r.a : null;
    return {
      id: r.id,
      discovered: known,
      name: known || hasHint ? r.name : '???',
      icon: known ? r.icon : '❔',
      rarity: r.rarity,
      price: r.price,
      ingredients: known ? [r.a, r.b] : null,
      hint,
      category: r.category,
      order: known ? discoveredList(state).indexOf(r.id) + 1 : null, // selo: nª descoberta
    };
  });
}

// Livro agrupado por categoria: [{ id, name, icon, found, total, entries }]
export function getRecipeBookByCategory(state) {
  const book = getRecipeBook(state);
  return CATEGORIES.map((c) => {
    const entries = book.filter((e) => e.category === c.id);
    return { ...c, found: entries.filter((e) => e.discovered).length, total: entries.length, entries };
  });
}
