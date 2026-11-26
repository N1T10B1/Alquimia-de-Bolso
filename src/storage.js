// Persistência: save versionado em localStorage com sanitização robusta. Sem DOM; nunca lança.
import { INGREDIENTS, RECIPES, UPGRADES, CUSTOMERS, CONFIG, recipeKey, findRecipe, TIPS } from './data.js';
import { createInitialState, newDayPlan } from './engine.js';

export const SAVE_KEY = 'alquimia-de-bolso-save-v1';

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

function toInt(v, fallback) {
  if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) return fallback;
  return Math.floor(v);
}

function toBool(v, fallback) {
  return typeof v === 'boolean' ? v : fallback;
}

export function sanitizeState(raw) {
  const base = createInitialState();
  if (!isObj(raw) || raw.version !== 1) return base;
  const s = structuredClone(base);

  s.coins = toInt(raw.coins, base.coins);
  s.xp = toInt(raw.xp, base.xp);

  // estoque: só ingredientes conhecidos
  if (isObj(raw.stock)) {
    for (const ing of INGREDIENTS) {
      if (has(raw.stock, ing.id)) s.stock[ing.id] = toInt(raw.stock[ing.id], base.stock[ing.id] ?? 0);
    }
  }

  // descobertas: ids válidos, sem repetição, na ordem original
  const recipeIds = new Set(RECIPES.map((r) => r.id));
  s.discovered = [];
  if (Array.isArray(raw.discovered)) {
    for (const id of raw.discovered) {
      if (typeof id === 'string' && recipeIds.has(id) && !s.discovered.includes(id)) s.discovered.push(id);
    }
  }

  // inventário: receitas ou 'lodo', quantidade inteira > 0
  s.inventory = {};
  if (isObj(raw.inventory)) {
    for (const [id, qty] of Object.entries(raw.inventory)) {
      if (!recipeIds.has(id) && id !== 'lodo') continue;
      const n = toInt(qty, 0);
      if (n > 0) s.inventory[id] = n;
    }
  }

  // melhorias: só ids conhecidos, apenas booleano true conta
  s.upgrades = {};
  for (const u of UPGRADES) {
    s.upgrades[u.id] = isObj(raw.upgrades) ? raw.upgrades[u.id] === true : false;
  }

  // pedidos: até 3, poção conhecida pelo jogo (pode ser inédita), cliente conhecido, ids únicos 'o<n>'
  const customerIds = new Set(CUSTOMERS.map((c) => c.id));
  let orderSeq = toInt(raw.orderSeq, 0);
  const slots = CONFIG.ORDER_SLOTS ?? 3;
  const usedIds = new Set();
  s.orders = [];
  if (Array.isArray(raw.orders)) {
    for (const o of raw.orders) {
      if (s.orders.length >= slots) break;
      if (!isObj(o) || !recipeIds.has(o.potionId) || !customerIds.has(o.customerId)) continue;
      const m = typeof o.id === 'string' ? /^o(\d+)$/.exec(o.id) : null;
      if (!m || usedIds.has(o.id)) continue;
      usedIds.add(o.id);
      orderSeq = Math.max(orderSeq, Number(m[1]));
      const nClues = RECIPES.find((r) => r.id === o.potionId).clues.length;
      const clue = toInt(o.clue, 0);
      s.orders.push({
        id: o.id, customerId: o.customerId, potionId: o.potionId,
        clue: clue < nClues ? clue : 0,
        misses: Math.min(toInt(o.misses, 0), CONFIG.REVEAL_AFTER_MISSES ?? 2),
        novel: o.novel === true,
        patience: toInt(o.patience, 0),
        waited: Math.min(toInt(o.waited, 0), toInt(o.patience, 0)),
      });
    }
  }
  s.orderSeq = Number.isSafeInteger(orderSeq) ? orderSeq : 0;

  // dicas: receita conhecida → sempre o ingrediente `a` dela
  s.hints = {};
  if (isObj(raw.hints)) {
    for (const r of RECIPES) {
      if (has(raw.hints, r.id) && raw.hints[r.id] === r.a) s.hints[r.id] = r.a;
    }
  }

  s.reputation = toInt(raw.reputation, 0);
  s.freeHintReadyAt = toInt(raw.freeHintReadyAt, 0);

  // grimório: só pares de ingredientes válidos que não são receita, sem repetição
  const ingIds = INGREDIENTS.map((i) => i.id);
  const validFails = new Set();
  for (const a of ingIds) for (const b of ingIds) if (!findRecipe(a, b)) validFails.add(recipeKey(a, b));
  s.failedPairs = [];
  if (Array.isArray(raw.failedPairs)) {
    for (const k of raw.failedPairs) {
      if (typeof k === 'string' && validFails.has(k) && !s.failedPairs.includes(k)) s.failedPairs.push(k);
    }
  }

  // v1.4: dia, fase (aberta/fechada) e plano do dia
  s.day = Math.max(1, toInt(raw.day, 1));
  s.phase = raw.phase === 'closed' ? 'closed' : 'open';
  if (s.phase === 'closed') s.orders = [];
  const rp = isObj(raw.plan) ? raw.plan : null;
  s.plan = newDayPlan(s.day, s.coins, s.reputation, (s.discovered || []).length);
  if (rp) {
    for (const k of ['arrived', 'served', 'sentAway', 'gaveUp', 'tips', 'perfect', 'earned', 'novel', 'startCoins', 'startRep', 'startFound', 'upkeep', 'paid', 'debt']) s.plan[k] = toInt(rp[k], s.plan[k]);
    s.plan.asked = Array.isArray(rp.asked) ? rp.asked.filter((id) => recipeIds.has(id)) : [];
    s.plan.visitors = Array.isArray(rp.visitors) ? rp.visitors.filter((id) => customerIds.has(id)) : [];
    s.plan.delivered = Array.isArray(rp.delivered)
      ? rp.delivered.filter((d) => isObj(d) && recipeIds.has(d.potionId)).slice(0, 40)
        .map((d) => ({ potionId: d.potionId, reward: Math.max(0, toInt(d.reward, 0)) }))
      : [];
  }
  s.plan.arrived = Math.min(s.plan.total, Math.max(s.plan.arrived, s.orders.length));
  s.plan.served = Math.min(s.plan.served, s.plan.arrived - s.orders.length);
  s.plan.sentAway = Math.min(s.plan.sentAway, s.plan.served);
  s.plan.gaveUp = Math.min(s.plan.gaveUp, s.plan.served - s.plan.sentAway);
  s.lastPotion = recipeIds.has(raw.lastPotion) ? raw.lastPotion : null;
  s.lastCustomer = customerIds.has(raw.lastCustomer) ? raw.lastCustomer : null;
  s.merchantWait = s.phase === 'closed' ? Math.min(toInt(raw.merchantWait, 0), (CONFIG.MERCHANT_PATIENCE_S ?? 240) * 1000) : 0;
  s.merchantGone = s.phase === 'closed' && raw.merchantGone === true;
  s.merchantSludge = s.phase === 'closed' ? Math.min(toInt(raw.merchantSludge, 0), CONFIG.MERCHANT_SLUDGE_MAX ?? 3) : 0;
  // v1.27 — aluguel atrasado e a cobrança do senhorio
  s.debt = toInt(raw.debt, 0);
  s.debtDays = s.debt > 0 ? Math.min(toInt(raw.debtDays, 0), CONFIG.DEBT_CLOSES ?? 3) : 0;
  s.landlord = s.phase === 'closed' && s.debt > 0 && raw.landlord === true;
  s.evicted = raw.evicted === true;
  s.recentAsked = Array.isArray(raw.recentAsked) ? raw.recentAsked.filter((id) => recipeIds.has(id)).slice(-(CONFIG.RECENT_MEMORY ?? 6)) : [];
  s.lastClue = {};
  if (isObj(raw.lastClue)) {
    for (const r of RECIPES) {
      const c = raw.lastClue[r.id];
      if (Number.isInteger(c) && c >= 0 && c < r.clues.length) s.lastClue[r.id] = c;
    }
  }

  s.sound = toBool(raw.sound, base.sound);
  s.relaxed = toBool(raw.relaxed, base.relaxed);
  s.victorySeen = toBool(raw.victorySeen, base.victorySeen);
  const tipIds = new Set(TIPS.map((t) => t.id));
  s.seenTips = Array.isArray(raw.seenTips) ? [...new Set(raw.seenTips.filter((id) => tipIds.has(id)))] : [];

  const rs = isObj(raw.stats) ? raw.stats : {};
  s.stats = {};
  for (const k of Object.keys(base.stats)) s.stats[k] = toInt(rs[k], base.stats[k]);
  s.stats.bestCoins = Math.max(s.stats.bestCoins, s.coins);

  return s;
}

function defaultStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function usable(storage) {
  return (storage !== null && typeof storage === 'object') || typeof storage === 'function';
}

export function loadGame(storage = defaultStorage()) {
  try {
    if (!usable(storage) || typeof storage.getItem !== 'function') {
      return { state: createInitialState(), status: 'new' };
    }
    const text = storage.getItem(SAVE_KEY);
    if (text === null || text === undefined) return { state: createInitialState(), status: 'new' };
    let raw;
    try {
      raw = JSON.parse(text);
    } catch {
      return { state: createInitialState(), status: 'corrupt' };
    }
    if (!isObj(raw) || raw.version !== 1) return { state: createInitialState(), status: 'corrupt' };
    return { state: sanitizeState(raw), status: 'loaded' };
  } catch {
    return { state: createInitialState(), status: 'corrupt' };
  }
}

export function saveGame(state, storage = defaultStorage()) {
  try {
    if (!usable(storage) || typeof storage.setItem !== 'function') return false;
    storage.setItem(SAVE_KEY, JSON.stringify(sanitizeState(state)));
    return true;
  } catch {
    return false;
  }
}

export function clearSave(storage = defaultStorage()) {
  try {
    if (!usable(storage) || typeof storage.removeItem !== 'function') return false;
    storage.removeItem(SAVE_KEY);
    return true;
  } catch {
    return false;
  }
}

// ---------- opções (v1.2): guardadas à parte, sobrevivem a "Novo jogo" ----------

export const OPTIONS_KEY = 'alquimia-de-bolso-opcoes-v1';
export const TEXT_SIZES = Object.freeze(['normal', 'grande', 'maior']);
export const QUALITIES = Object.freeze(['alta', 'leve']);

export function defaultOptions() {
  return { sound: false, volume: 50, reduceMotion: false, textSize: 'normal', relaxed: false, quality: 'alta' };
}

export function sanitizeOptions(raw) {
  const o = defaultOptions();
  if (!isObj(raw)) return o;
  o.sound = toBool(raw.sound, o.sound);
  const v = toInt(raw.volume, o.volume);
  o.volume = Math.min(100, v);
  o.reduceMotion = toBool(raw.reduceMotion, o.reduceMotion);
  o.relaxed = toBool(raw.relaxed, o.relaxed);
  o.textSize = TEXT_SIZES.includes(raw.textSize) ? raw.textSize : o.textSize;
  o.quality = QUALITIES.includes(raw.quality) ? raw.quality : o.quality;
  return o;
}

export function loadOptions(storage = defaultStorage()) {
  try {
    if (!usable(storage) || typeof storage.getItem !== 'function') return { options: defaultOptions(), found: false };
    const text = storage.getItem(OPTIONS_KEY);
    if (text === null || text === undefined) return { options: defaultOptions(), found: false };
    return { options: sanitizeOptions(JSON.parse(text)), found: true };
  } catch {
    return { options: defaultOptions(), found: false };
  }
}

export function saveOptions(options, storage = defaultStorage()) {
  try {
    if (!usable(storage) || typeof storage.setItem !== 'function') return false;
    storage.setItem(OPTIONS_KEY, JSON.stringify(sanitizeOptions(options)));
    return true;
  } catch {
    return false;
  }
}

// Existe um caderno salvo? (decide se "Continuar" aparece no menu)
export function hasSave(storage = defaultStorage()) {
  try {
    return usable(storage) && typeof storage.getItem === 'function' && storage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}
