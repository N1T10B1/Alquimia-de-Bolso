// Testes do núcleo de Alquimia de Bolso.
// Executar: node --test tests/game.test.mjs
// Usa apenas node:test e node:assert/strict. Baseado em docs/GDD.md (seção 8 e
// "Casos de teste mínimos") e no contrato docs/CONTRATOS.md.

import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  INGREDIENTS, RECIPES, SLUDGE, UPGRADES, CUSTOMERS, CONFIG, MERCHANT, customersForDay,
  getIngredient, getRecipe, getItem, recipeKey, findRecipe,
} from '../src/data.js';
import {
  createInitialState, getLevel, getLevelProgress, sellPrice, orderReward,
  canMix, mix, buyIngredient, sellItem, isVictory, addCoins,
} from '../src/engine.js';
import {
  fillOrders, deliverOrder, dismissOrder, buyUpgrade,
  canRequestHint, requestHint, getRecipeBook,
  isDayOver, closeDay, startNextDay, buyFromMerchant, getOrderClues,
} from '../src/progression.js';
import {
  SAVE_KEY, sanitizeState, loadGame, saveGame, clearSave,
} from '../src/storage.js';

// ---------------------------------------------------------------------------
// Utilitários de teste
// ---------------------------------------------------------------------------

/** PRNG determinístico (mulberry32). Retorna função com valores em [0, 1). */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** rng constante que conta quantas vezes foi chamado. */
function countingRng(value) {
  const fn = () => { fn.calls += 1; return value; };
  fn.calls = 0;
  return fn;
}

/** rng que falha o teste se for chamado. */
function forbiddenRng() {
  throw new Error('rng não deveria ter sido chamado nesta situação');
}

/** Storage falso em memória compatível com a API de localStorage. */
function memoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    map,
    getItem(k) { return map.has(k) ? map.get(k) : null; },
    setItem(k, v) { map.set(k, String(v)); },
    removeItem(k) { map.delete(k); },
    clear() { map.clear(); },
    key(i) { return [...map.keys()][i] ?? null; },
    get length() { return map.size; },
  };
}

/** Storage que lança em qualquer operação (ex.: modo privado/quota). */
const throwingStorage = {
  getItem() { throw new Error('storage indisponível'); },
  setItem() { throw new Error('storage indisponível'); },
  removeItem() { throw new Error('storage indisponível'); },
};

const ING_IDS = INGREDIENTS.map((i) => i.id);
const RECIPE_IDS = RECIPES.map((r) => r.id);

/** Estado inicial com sobrescritas rasas (estado é dado puro). */
function makeState(overrides = {}) {
  const s = createInitialState();
  return { ...s, ...overrides };
}

/** Garante que uma ação falhou, sem efeitos, devolvendo o MESMO objeto. */
function assertFail(res, original, codes, label = '') {
  const allowed = Array.isArray(codes) ? codes : [codes];
  assert.equal(res.ok, false, `${label}: esperado ok=false, obtido ok=${res.ok}`);
  assert.equal(res.state, original, `${label}: em falha o estado devolvido deve ser o MESMO objeto recebido`);
  assert.ok(res.error && typeof res.error === 'object', `${label}: falha deve ter objeto error`);
  if (allowed.length) {
    assert.ok(allowed.includes(res.error.code),
      `${label}: código de erro esperado ${allowed.join(' | ')}, obtido ${res.error.code}`);
  }
  assert.equal(typeof res.error.message, 'string', `${label}: error.message deve ser string`);
  assert.ok(res.error.message.length > 0, `${label}: error.message não pode ser vazia`);
}

/** Garante sucesso e que o estado original não foi mutado. */
function assertOk(res, label = '') {
  assert.equal(res.ok, true,
    `${label}: esperado ok=true, obtido erro ${res.error && res.error.code} (${res.error && res.error.message})`);
  assert.ok(res.state && typeof res.state === 'object', `${label}: sucesso deve devolver state`);
  return res;
}

/** Executa ação e verifica que o estado de entrada não foi alterado (pureza). */
function pure(fn, state, ...args) {
  const snapshot = structuredClone(state);
  const res = fn(state, ...args);
  assert.deepEqual(state, snapshot, `${fn.name}: a ação não pode mutar o estado recebido`);
  return res;
}

const isNonNegInt = (n) => Number.isInteger(n) && n >= 0;

/** Verifica invariantes de um estado v1 válido. */
function assertValidState(s, label = 'estado') {
  assert.ok(s && typeof s === 'object', `${label}: deve ser objeto`);
  assert.equal(s.version, 1, `${label}: version deve ser 1`);
  assert.ok(isNonNegInt(s.coins), `${label}: coins inteiro >= 0 (obtido ${s.coins})`);
  assert.ok(isNonNegInt(s.xp), `${label}: xp inteiro >= 0 (obtido ${s.xp})`);
  assert.ok(s.stock && typeof s.stock === 'object', `${label}: stock objeto`);
  for (const id of ING_IDS) {
    assert.ok(isNonNegInt(s.stock[id]), `${label}: stock.${id} inteiro >= 0 (obtido ${s.stock[id]})`);
  }
  assert.ok(s.inventory && typeof s.inventory === 'object' && !Array.isArray(s.inventory),
    `${label}: inventory objeto`);
  for (const [id, q] of Object.entries(s.inventory)) {
    assert.ok(id === 'lodo' || RECIPE_IDS.includes(id), `${label}: inventory com id desconhecido ${id}`);
    assert.ok(Number.isInteger(q) && q > 0, `${label}: inventory.${id} deve ser inteiro > 0 (obtido ${q})`);
  }
  assert.ok(Array.isArray(s.discovered), `${label}: discovered array`);
  assert.equal(new Set(s.discovered).size, s.discovered.length, `${label}: discovered sem repetição`);
  for (const id of s.discovered) assert.ok(RECIPE_IDS.includes(id), `${label}: discovered com id desconhecido ${id}`);
  for (const u of ['caldeirao', 'mercador', 'lupa']) {
    assert.equal(typeof s.upgrades?.[u], 'boolean', `${label}: upgrades.${u} booleano`);
  }
  assert.ok(Array.isArray(s.orders), `${label}: orders array`);
  assert.ok(s.orders.length <= CONFIG.ORDER_SLOTS, `${label}: no máximo 3 pedidos (obtido ${s.orders.length})`);
  for (const o of s.orders) {
    assert.ok(RECIPE_IDS.includes(o.potionId), `${label}: pedido com poção desconhecida ${o.potionId}`);
  }
  assert.ok(isNonNegInt(s.orderSeq), `${label}: orderSeq inteiro >= 0`);
  assert.ok(s.hints && typeof s.hints === 'object', `${label}: hints objeto`);
  for (const [rid, ing] of Object.entries(s.hints)) {
    assert.ok(RECIPE_IDS.includes(rid), `${label}: dica para receita desconhecida ${rid}`);
    assert.ok(ING_IDS.includes(ing), `${label}: dica com ingrediente desconhecido ${ing}`);
  }
  assert.equal(typeof s.sound, 'boolean', `${label}: sound booleano`);
  assert.equal(typeof s.victorySeen, 'boolean', `${label}: victorySeen booleano`);
  for (const k of ['mixes', 'failures', 'sold', 'delivered', 'coinsEarned', 'bestCoins']) {
    assert.ok(isNonNegInt(s.stats?.[k]), `${label}: stats.${k} inteiro >= 0 (obtido ${s.stats?.[k]})`);
  }
}

/** Pedidos coerentes: poção existe; `novel` só quando a poção não estava no caderno ao chegar. */
function assertOrdersValid(s, label = 'pedidos') {
  for (const o of s.orders) {
    assert.ok(RECIPE_IDS.includes(o.potionId), `${label}: pedido ${o.id} com poção desconhecida`);
    assert.ok(CUSTOMERS.some((c) => c.id === o.customerId), `${label}: cliente ${o.customerId} inválido`);
    assert.equal(typeof o.novel, 'boolean', `${label}: novel booleano`);
    if (!o.novel) assert.ok(s.discovered.includes(o.potionId), `${label}: pedido comum de poção fora do caderno`);
  }
}

function assertNoDuplicateOrders(s, label = 'pedidos') {
  const potions = s.orders.map((o) => o.potionId);
  assert.equal(new Set(potions).size, potions.length, `${label}: poções repetidas entre pedidos: ${potions.join(',')}`);
}

/** Tabela canônica do GDD 2.2. */
const GDD_RECIPES = [
  ['vapor', 'agua', 'fogo', 10, 'comum'],
  ['cura', 'agua', 'planta', 10, 'comum'],
  ['vigor', 'fogo', 'planta', 10, 'comum'],
  ['brilho', 'cristal', 'luz', 14, 'incomum'],
  ['invisibilidade', 'sombra', 'vento', 14, 'incomum'],
  ['sono', 'cogumelo', 'agua', 10, 'comum'],
  ['chamaazul', 'fogo', 'cristal', 14, 'incomum'],
  ['raiz', 'planta', 'cristal', 14, 'incomum'],
  ['amanhecer', 'luz', 'agua', 14, 'incomum'],
  ['eclipse', 'sombra', 'luz', 18, 'rara'],
  ['esporos', 'cogumelo', 'vento', 10, 'comum'],
  ['tempestade', 'vento', 'fogo', 10, 'comum'],
  // v1.26 — doses duplas (só os ingredientes de 4 moedas) e duplas novas
  ['chuva', 'agua', 'agua', 10, 'comum'],
  ['coracao', 'fogo', 'fogo', 10, 'comum'],
  ['broto', 'planta', 'planta', 10, 'comum'],
  ['pluma', 'vento', 'vento', 10, 'comum'],
  ['urso', 'cogumelo', 'cogumelo', 10, 'comum'],
  ['brisa', 'agua', 'vento', 10, 'comum'],
  ['gelo', 'agua', 'cristal', 14, 'incomum'],
  ['fogofatuo', 'fogo', 'sombra', 14, 'incomum'],
  ['eco', 'cristal', 'vento', 14, 'incomum'],
  ['seiva', 'planta', 'luz', 14, 'incomum'],
  ['arcoiris', 'luz', 'vento', 14, 'incomum'],
  ['espelho', 'cristal', 'sombra', 18, 'rara'],
];

const GDD_INGREDIENTS = {
  agua: 4, fogo: 4, planta: 4, cristal: 5, sombra: 5, luz: 5, cogumelo: 4, vento: 4,
};

/** Todos os pares não ordenados com repetição (36 para 8 ingredientes). */
function allPairsWithRepetition() {
  const pairs = [];
  for (let i = 0; i < ING_IDS.length; i++) {
    for (let j = i; j < ING_IDS.length; j++) pairs.push([ING_IDS[i], ING_IDS[j]]);
  }
  return pairs;
}

function officialFor(a, b) {
  return GDD_RECIPES.find(([, x, y]) => (x === a && y === b) || (x === b && y === a)) || null;
}

const allTrue = { caldeirao: true, mercador: true, lupa: true, estufa: true, alambique: true };

// ---------------------------------------------------------------------------
// Dados
// ---------------------------------------------------------------------------

describe('data.js', () => {
  test('8 ingredientes com ids e custos do GDD', () => {
    assert.equal(INGREDIENTS.length, 8);
    for (const [id, cost] of Object.entries(GDD_INGREDIENTS)) {
      const ing = getIngredient(id);
      assert.ok(ing, `ingrediente ${id} ausente`);
      assert.equal(ing.cost, cost, `custo de ${id}`);
      assert.equal(typeof ing.name, 'string');
    }
    assert.equal(getIngredient('ouro'), null);
  });

  // v1.14: preços por raridade 10/14/18 (incomum e rara subiram para valer o ingrediente mais caro)
  test('24 receitas (12 do GDD + 12 da v1.26) com id, a, b, preço e raridade', () => {
    assert.equal(RECIPES.length, 24);
    assert.equal(CONFIG.TOTAL_RECIPES, 24);
    for (const [id, a, b, price, rarity] of GDD_RECIPES) {
      const r = getRecipe(id);
      assert.ok(r, `receita ${id} ausente`);
      assert.equal(r.a, a, `${id}.a (a dica revela este ingrediente)`);
      assert.equal(r.b, b, `${id}.b`);
      assert.equal(r.price, price, `${id}.price`);
      assert.equal(r.rarity, rarity, `${id}.rarity`);
    }
    assert.equal(getRecipe('lodo'), null, 'lodo não é receita');
  });

  test('SLUDGE, getItem, UPGRADES, CUSTOMERS e CONFIG', () => {
    assert.equal(SLUDGE.id, 'lodo');
    assert.equal(SLUDGE.price, 1);
    assert.equal(getItem('lodo'), SLUDGE);
    assert.equal(getItem('vapor').id, 'vapor');
    assert.equal(getItem('nada'), null);
    const costs = Object.fromEntries(UPGRADES.map((u) => [u.id, u.cost]));
    assert.deepEqual(costs, { caldeirao: 40, mercador: 90, lupa: 30, estufa: 150, alambique: 240 });
    assert.ok(CUSTOMERS.length >= 8, 'pelo menos 8 clientes');
    assert.equal(new Set(CUSTOMERS.map((c) => c.id)).size, CUSTOMERS.length, 'ids de clientes únicos');
    assert.equal(CONFIG.START_COINS, 40);
    assert.equal(CONFIG.START_STOCK, 3);
    assert.equal(CONFIG.ORDER_SLOTS, 3);
    assert.equal(CONFIG.ORDER_BONUS, 3);
    assert.equal(CONFIG.NOVEL_BONUS, 8);
    assert.equal(CONFIG.HINT_COST, 5);
  });

  test('recipeKey e findRecipe são comutativos', () => {
    for (const [a, b] of allPairsWithRepetition()) {
      assert.equal(recipeKey(a, b), recipeKey(b, a), `recipeKey(${a},${b})`);
      const off = officialFor(a, b);
      const r1 = findRecipe(a, b);
      const r2 = findRecipe(b, a);
      assert.equal(r1 && r1.id, off ? off[0] : null, `findRecipe(${a},${b})`);
      assert.equal(r2 && r2.id, off ? off[0] : null, `findRecipe(${b},${a})`);
    }
  });
});

// ---------------------------------------------------------------------------
// Estado inicial e níveis
// ---------------------------------------------------------------------------

describe('estado inicial e nível', () => {
  test('createInitialState segue o modelo v1', () => {
    const s = createInitialState();
    assertValidState(s, 'inicial');
    assert.equal(s.coins, 40);
    assert.equal(s.xp, 0);
    for (const id of ING_IDS) assert.equal(s.stock[id], 3, `stock inicial de ${id}`);
    assert.deepEqual(s.inventory, {});
    assert.deepEqual(s.discovered, []);
    assert.deepEqual(s.upgrades, { caldeirao: false, mercador: false, lupa: false, estufa: false, alambique: false });
    assert.deepEqual(s.orders, []);
    assert.deepEqual(s.hints, {});
    assert.equal(s.sound, false, 'som desligado por padrão');
    assert.equal(s.stats.bestCoins, 40);
    assert.notEqual(createInitialState(), createInitialState(), 'cada chamada devolve objeto novo');
  });

  test('nível = 1 + floor(xp/20) e progresso', () => {
    const cases = [[0, 1], [1, 1], [19, 1], [20, 2], [39, 2], [40, 3], [199, 10], [200, 11]];
    for (const [xp, lvl] of cases) assert.equal(getLevel(xp), lvl, `getLevel(${xp})`);
    const p = getLevelProgress(45);
    assert.equal(p.level, 3);
    assert.equal(p.current, 5);
    assert.equal(p.needed, 20);
    assert.ok(Math.abs(p.ratio - 0.25) < 1e-9, `ratio esperado 0.25, obtido ${p.ratio}`);
  });
});

// ---------------------------------------------------------------------------
// Mistura (critérios 1, 2, 7)
// ---------------------------------------------------------------------------

describe('mix', () => {
  test('agua + fogo e fogo + agua resultam em vapor', () => {
    for (const [a, b] of [['agua', 'fogo'], ['fogo', 'agua']]) {
      const s = createInitialState();
      const res = assertOk(pure(mix, s, a, b, forbiddenRng), `${a}+${b}`);
      assert.equal(res.result.itemId, 'vapor');
      assert.equal(res.result.recipeId, 'vapor');
      assert.equal(res.state.inventory.vapor, 1);
    }
  });

  test('as 24 receitas funcionam em ambas as ordens', () => {
    for (const [id, a, b] of GDD_RECIPES) {
      for (const [x, y] of [[a, b], [b, a]]) {
        const res = assertOk(mix(createInitialState(), x, y, forbiddenRng), `${x}+${y}`);
        assert.equal(res.result.itemId, id, `${x}+${y} deveria gerar ${id}`);
        assert.equal(res.result.recipeId, id);
        assert.equal(res.result.isNew, true);
        assert.deepEqual(res.state.discovered, [id]);
        assert.equal(res.state.inventory[id], 1);
      }
    }
  });

  test('todas as 36 combinações (com repetição): oficiais dão poção, as demais dão lodo', () => {
    const pairs = allPairsWithRepetition();
    assert.equal(pairs.length, 36);
    let sludge = 0;
    for (const [a, b] of pairs) {
      const off = officialFor(a, b);
      for (const [x, y] of [[a, b], [b, a]]) {
        const res = assertOk(mix(createInitialState(), x, y, forbiddenRng), `${x}+${y}`);
        if (off) {
          assert.equal(res.result.itemId, off[0], `${x}+${y} deveria gerar ${off[0]}`);
        } else {
          assert.equal(res.result.itemId, 'lodo', `${x}+${y} não é receita oficial e deveria virar lodo`);
          assert.equal(res.result.recipeId, null, `${x}+${y}: recipeId deve ser null para lodo`);
          assert.equal(res.result.isNew, false, 'lodo nunca é nova descoberta');
          assert.equal(res.state.inventory.lodo, 1);
          assert.deepEqual(res.state.discovered, []);
          assert.equal(res.state.stats.failures, 1);
          assert.equal(res.state.xp, 1, 'lodo também dá 1 XP');
        }
      }
      if (!off) sludge++;
    }
    assert.equal(sludge, 12, '36 pares - 24 receitas = 12 combinações de lodo');
  });

  test('consome 1 de cada ingrediente e não mexe nos demais', () => {
    const s = createInitialState();
    const res = assertOk(mix(s, 'cristal', 'luz', forbiddenRng));
    for (const id of ING_IDS) {
      const expected = id === 'cristal' || id === 'luz' ? 2 : 3;
      assert.equal(res.state.stock[id], expected, `stock.${id}`);
    }
    assert.equal(res.state.coins, s.coins, 'misturar não custa moedas');
    assert.equal(res.state.stats.mixes, 1);
  });

  test('agua + agua exige 2 unidades e vira Chuva Engarrafada', () => {
    const one = makeState({ stock: { ...createInitialState().stock, agua: 1 } });
    assert.equal(canMix(one, 'agua', 'agua').ok, false, 'canMix com 1 água deve falhar');
    assertFail(pure(mix, one, 'agua', 'agua', forbiddenRng), one, 'INSUFFICIENT_STOCK', 'agua+agua com 1');

    const two = makeState({ stock: { ...createInitialState().stock, agua: 2 } });
    assert.equal(canMix(two, 'agua', 'agua').ok, true, 'canMix com 2 águas deve passar');
    const res = assertOk(mix(two, 'agua', 'agua', forbiddenRng), 'agua+agua com 2');
    assert.equal(res.result.itemId, 'chuva');
    assert.equal(res.state.stock.agua, 0, 'consome 2 águas');
    assert.equal(res.state.inventory.chuva, 1);
  });

  test('v1.26: só os ingredientes de 4 moedas aguentam dose dupla; os de 5 viram lodo', () => {
    for (const ing of INGREDIENTS) {
      const res = assertOk(mix(createInitialState(), ing.id, ing.id, forbiddenRng), `${ing.id} x2`);
      if (ing.cost === 4) assert.notEqual(res.result.itemId, 'lodo', `${ing.id} em dose dupla deveria dar poção`);
      else assert.equal(res.result.itemId, 'lodo', `${ing.id} em dose dupla deveria desandar`);
    }
  });

  test('misturar sem estoque falha: mesmo objeto, sem XP, sem item', () => {
    const s = makeState({ stock: { ...createInitialState().stock, fogo: 0 } });
    const res = pure(mix, s, 'agua', 'fogo', forbiddenRng);
    assertFail(res, s, 'INSUFFICIENT_STOCK', 'mix sem fogo');
    assert.equal(s.xp, 0);
    assert.deepEqual(s.inventory, {});
    assert.equal(canMix(s, 'fogo', 'agua').ok, false);
    assert.equal(canMix(s, 'fogo', 'agua').error.code, 'INSUFFICIENT_STOCK');
  });

  test('estoque nunca fica negativo misturando até acabar', () => {
    let s = createInitialState();
    for (let i = 0; i < 3; i++) s = assertOk(mix(s, 'sombra', 'vento', forbiddenRng)).state;
    assert.equal(s.stock.sombra, 0);
    assert.equal(s.stock.vento, 0);
    const res = mix(s, 'vento', 'sombra', forbiddenRng);
    assertFail(res, s, 'INSUFFICIENT_STOCK', '4ª mistura');
    assert.equal(s.stock.sombra, 0);
  });

  test('ingrediente inválido falha com INVALID_ID', () => {
    const s = createInitialState();
    assertFail(mix(s, 'agua', 'ouro', forbiddenRng), s, 'INVALID_ID', 'mix ouro');
    assertFail(mix(s, undefined, 'agua', forbiddenRng), s, 'INVALID_ID', 'mix undefined');
    assert.equal(canMix(s, 'xx', 'agua').ok, false);
  });

  test('XP: +1 por mistura e +5 só na primeira descoberta (isNew só uma vez)', () => {
    let s = createInitialState();
    let res = assertOk(mix(s, 'agua', 'fogo', forbiddenRng));
    assert.equal(res.result.isNew, true);
    assert.equal(res.result.xpGained, 6);
    assert.equal(res.state.xp, 6);
    s = res.state;
    res = assertOk(mix(s, 'fogo', 'agua', forbiddenRng));
    assert.equal(res.result.isNew, false, 'segunda vez não é nova descoberta');
    assert.equal(res.result.xpGained, 1);
    assert.equal(res.state.xp, 7);
    assert.deepEqual(res.state.discovered, ['vapor'], 'discovered sem repetição');
    assert.equal(res.state.inventory.vapor, 2);
    s = res.state;
    res = assertOk(mix(s, 'cristal', 'cristal', forbiddenRng));
    assert.equal(res.result.xpGained, 1, 'lodo dá 1 XP');
    assert.equal(res.state.xp, 8);
    assert.equal(res.state.stats.mixes, 3);
    assert.equal(res.state.stats.failures, 1);
  });

  test('discovered preserva a ordem de descoberta', () => {
    let s = createInitialState();
    s = mix(s, 'sombra', 'luz', forbiddenRng).state;
    s = mix(s, 'agua', 'planta', forbiddenRng).state;
    s = mix(s, 'luz', 'sombra', forbiddenRng).state;
    assert.deepEqual(s.discovered, ['eclipse', 'cura']);
  });
});

// ---------------------------------------------------------------------------
// Caldeirão Eficiente (critério 6)
// ---------------------------------------------------------------------------

describe('Caldeirão Eficiente', () => {
  const withCauldron = () => makeState({ upgrades: { caldeirao: true, mercador: false, lupa: false } });

  test('rng()=0 → nenhum ingrediente consumido, mas gera item e XP', () => {
    const s = withCauldron();
    const rng = countingRng(0);
    const res = assertOk(mix(s, 'agua', 'fogo', rng));
    assert.equal(res.result.free, true);
    assert.equal(res.state.stock.agua, 3);
    assert.equal(res.state.stock.fogo, 3);
    assert.equal(res.state.inventory.vapor, 1, 'mistura grátis ainda gera poção');
    assert.equal(res.result.xpGained, 6);
    assert.ok(rng.calls <= 1, `rng chamado ${rng.calls} vezes (máx. 1)`);
  });

  test('rng()=0.99 → ambos consumidos', () => {
    const s = withCauldron();
    const rng = countingRng(0.99);
    const res = assertOk(mix(s, 'agua', 'fogo', rng));
    assert.equal(res.result.free, false);
    assert.equal(res.state.stock.agua, 2);
    assert.equal(res.state.stock.fogo, 2);
    assert.equal(rng.calls, 1, `rng deve ser chamado exatamente 1 vez com caldeirão (obtido ${rng.calls})`);
  });

  test('limite: rng()=0.2 não é grátis (free = rng() < 0.2)', () => {
    const res = assertOk(mix(withCauldron(), 'agua', 'fogo', countingRng(0.2)));
    assert.equal(res.result.free, false);
    const res2 = assertOk(mix(withCauldron(), 'agua', 'fogo', countingRng(0.1999)));
    assert.equal(res2.result.free, true);
  });

  test('agua+agua com caldeirão: consome 0 ou 2, nunca 1', () => {
    const s = withCauldron();
    assert.equal(mix(s, 'agua', 'agua', countingRng(0)).state.stock.agua, 3);
    assert.equal(mix(s, 'agua', 'agua', countingRng(0.5)).state.stock.agua, 1);
  });

  test('nunca consome só um ingrediente (varredura de rng)', () => {
    for (let i = 0; i < 100; i++) {
      const v = i / 100;
      const rng = countingRng(v);
      const res = assertOk(mix(withCauldron(), 'cristal', 'sombra', rng));
      const dc = 3 - res.state.stock.cristal;
      const ds = 3 - res.state.stock.sombra;
      assert.equal(dc, ds, `rng=${v}: consumo assimétrico (cristal -${dc}, sombra -${ds})`);
      assert.ok(dc === 0 || dc === 1);
      assert.equal(res.result.free, dc === 0, `rng=${v}: free deve refletir o consumo`);
      assert.ok(rng.calls <= 1, `rng=${v}: rng chamado ${rng.calls} vezes`);
    }
  });

  test('sem caldeirão, rng não é chamado e consome sempre', () => {
    const rng = countingRng(0);
    const res = assertOk(mix(createInitialState(), 'agua', 'fogo', rng));
    assert.equal(rng.calls, 0, 'rng só deve ser chamado se upgrades.caldeirao');
    assert.equal(res.result.free, false);
    assert.equal(res.state.stock.agua, 2);
  });

  test('mix com falha não chama rng mesmo com caldeirão', () => {
    const s = makeState({
      upgrades: { caldeirao: true, mercador: false, lupa: false },
      stock: { ...createInitialState().stock, agua: 0 },
    });
    const rng = countingRng(0);
    assertFail(mix(s, 'agua', 'fogo', rng), s, 'INSUFFICIENT_STOCK', 'caldeirão sem estoque');
    assert.equal(rng.calls, 0);
  });
});

// ---------------------------------------------------------------------------
// Mercado e venda (critérios 3, 4)
// ---------------------------------------------------------------------------

describe('compra de ingredientes', () => {
  test('compra desconta custo e soma estoque', () => {
    const s = createInitialState();
    const res = assertOk(pure(buyIngredient, s, 'cristal'));
    assert.equal(res.state.coins, 35);
    assert.equal(res.state.stock.cristal, 4);
    assert.deepEqual(res.result, { ingredientId: 'cristal', qty: 1, cost: 5 });
    const res3 = assertOk(buyIngredient(s, 'agua', 3));
    assert.equal(res3.state.coins, 28);
    assert.equal(res3.state.stock.agua, 6);
    assert.equal(res3.result.cost, 12);
  });

  test('carteira insuficiente impede compra; carteira nunca negativa', () => {
    let s = makeState({ coins: 5 });
    s = assertOk(buyIngredient(s, 'luz')).state;
    assert.equal(s.coins, 0, 'pode gastar exatamente tudo');
    const res = pure(buyIngredient, s, 'agua');
    assertFail(res, s, 'INSUFFICIENT_FUNDS', 'compra com 0 moedas');
    const s2 = makeState({ coins: 5 });
    assertFail(buyIngredient(s2, 'agua', 2), s2, 'INSUFFICIENT_FUNDS', 'compra de 2 águas com 5 moedas');
  });

  test('ingrediente ou quantidade inválidos falham', () => {
    const s = createInitialState();
    assertFail(buyIngredient(s, 'ouro'), s, 'INVALID_ID', 'compra ouro');
    for (const q of [0, -1, 1.5, NaN]) {
      const res = buyIngredient(s, 'agua', q);
      assert.equal(res.ok, false, `qty=${q} deveria falhar`);
      assert.equal(res.state, s);
    }
  });
});

describe('venda', () => {
  test('vender reduz inventário em 1 e paga o preço de balcão (60% do preço)', () => {
    const s = makeState({ inventory: { brilho: 2 } });
    const res = assertOk(pure(sellItem, s, 'brilho'));
    assert.equal(res.state.inventory.brilho, 1);
    assert.equal(res.state.coins, 48);
    assert.deepEqual(res.result, { itemId: 'brilho', price: 8 });
    assert.equal(res.state.stats.sold, 1);
    assert.equal(res.state.stats.coinsEarned, 8);
    assert.equal(res.state.stats.bestCoins, 48);
    const res2 = assertOk(sellItem(res.state, 'brilho'));
    assert.equal('brilho' in res2.state.inventory, false, 'chave com 0 é removida do inventário');
  });

  test('preço de venda de todas as receitas', () => {
    const s = createInitialState();
    for (const [id, , , price] of GDD_RECIPES) {
      assert.equal(sellPrice(s, id), Math.floor(price * CONFIG.SHELF_RATE), `sellPrice(${id})`);
    }
    assert.equal(sellPrice(s, 'lodo'), 1);
    assert.equal(sellPrice(s, 'nada'), 0);
  });

  test('lodo vale 1 e não é afetado pela Marca do Mercador', () => {
    const s = makeState({ inventory: { lodo: 1 }, upgrades: { ...allTrue } });
    assert.equal(sellPrice(s, 'lodo'), 1);
    const res = assertOk(sellItem(s, 'lodo'));
    assert.equal(res.result.price, 1);
    assert.equal(res.state.coins, 41);
  });

  test('não vende o que não tem', () => {
    const s = createInitialState();
    assertFail(pure(sellItem, s, 'vapor'), s, 'NOT_IN_INVENTORY', 'vender sem ter');
    assertFail(sellItem(s, 'lodo'), s, 'NOT_IN_INVENTORY', 'vender lodo sem ter');
    assertFail(sellItem(s, 'nada'), s, ['INVALID_ID', 'NOT_IN_INVENTORY'], 'vender id inválido');
  });

  test('addCoins atualiza coinsEarned e bestCoins, sem mutar', () => {
    const s = createInitialState();
    const snap = structuredClone(s);
    const n = addCoins(s, 7);
    assert.deepEqual(s, snap);
    assert.equal(n.coins, 47);
    assert.equal(n.stats.coinsEarned, 7);
    assert.equal(n.stats.bestCoins, 47);
  });

  test('bestCoins não diminui ao gastar', () => {
    let s = makeState({ inventory: { eclipse: 1 } });
    s = sellItem(s, 'eclipse').state; // 50
    s = buyIngredient(s, 'agua', 5).state; // 30
    assert.equal(s.coins, 30);
    assert.equal(s.stats.bestCoins, 50);
  });
});

// ---------------------------------------------------------------------------
// Marca do Mercador (critério 6)
// ---------------------------------------------------------------------------

describe('Marca do Mercador', () => {
  const merchant = () => makeState({ upgrades: { caldeirao: false, mercador: true, lupa: false } });

  test('venda de balcão +25% arredondado para baixo (6→7, 8→10, 10→12)', () => {
    const s = merchant();
    assert.equal(sellPrice(s, 'vapor'), 7);
    assert.equal(sellPrice(s, 'brilho'), 10);
    assert.equal(sellPrice(s, 'eclipse'), 12);
    const res = assertOk(sellItem(makeState({ ...s, inventory: { brilho: 1 } }), 'brilho'));
    assert.equal(res.result.price, 10);
    assert.equal(res.state.coins, 50);
  });

  test('recompensa de pedido: price+3, com mercador floor(x1.25) uma vez (eclipse 21→26)', () => {
    const base = createInitialState();
    const m = merchant();
    assert.equal(orderReward(base, 'vapor'), 13);
    assert.equal(orderReward(base, 'brilho'), 17);
    assert.equal(orderReward(base, 'eclipse'), 21);
    assert.equal(orderReward(m, 'vapor'), 16); // 13*1.25 = 16.25
    assert.equal(orderReward(m, 'brilho'), 21); // 17*1.25 = 21.25
    assert.equal(orderReward(m, 'eclipse'), 26); // 21*1.25 = 26.25
  });

  test('comprado via buyUpgrade aplica o efeito', () => {
    const s = makeState({ coins: 90 });
    const res = assertOk(buyUpgrade(s, 'mercador'));
    assert.equal(res.state.coins, 0);
    assert.equal(res.state.upgrades.mercador, true);
    assert.equal(sellPrice(res.state, 'vapor'), 7);
  });
});

// ---------------------------------------------------------------------------
// Entregar paga mais que vender (critério 5)
// ---------------------------------------------------------------------------

describe('entregar x vender', () => {
  test('orderReward > sellPrice para toda receita, com e sem mercador', () => {
    for (const upgrades of [{ caldeirao: false, mercador: false, lupa: false }, { ...allTrue }]) {
      const s = makeState({ upgrades });
      for (const id of RECIPE_IDS) {
        assert.ok(orderReward(s, id) > sellPrice(s, id),
          `${id} (mercador=${upgrades.mercador}): entregar (${orderReward(s, id)}) deve pagar mais que vender (${sellPrice(s, id)})`);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Pedidos (critérios 4, 5)
// ---------------------------------------------------------------------------

describe('pedidos e dias de atendimento', () => {
  test('dia 1: chegam clientes já no começo, pedindo receitas novas (comuns)', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const n = pure(fillOrders, createInitialState(), mulberry32(seed));
      assert.equal(n.orders.length, 3, 'o balcão enche com os 3 clientes do dia 1');
      assert.equal(n.plan.arrived, 3);
      assertOrdersValid(n, `seed ${seed}`);
      assertNoDuplicateOrders(n, `seed ${seed}`);
      for (const o of n.orders) {
        assert.equal(o.novel, true, 'sem caderno, todo pedido é inédito');
        assert.equal(getRecipe(o.potionId).rarity, 'comum', 'no dia 1 só receitas comuns como novidade');
      }
      assert.equal(new Set(n.orders.map((o) => o.customerId)).size, 3, 'clientes diferentes');
    }
  });

  test('clientes por dia crescem e têm teto', () => {
    assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 20].map(customersForDay), [3, 4, 5, 6, 7, 8, 8, 8]);
    assert.ok(!CUSTOMERS.some((c) => c.id === MERCHANT.id), 'a mercadora não é freguesa');
  });

  test('só chegam os clientes previstos no dia (no máximo 3 de cada vez)', () => {
    let s = fillOrders(makeState({ discovered: ['vapor', 'cura', 'vigor'] }), mulberry32(4));
    let arrivals = s.orders.length;
    while (s.orders.length) {
      s = assertOk(dismissOrder(s, s.orders[0].id)).state;
      const before = s.orders.length;
      s = fillOrders(s, mulberry32(arrivals));
      arrivals += s.orders.length - before;
      assert.ok(s.orders.length <= CONFIG.ORDER_SLOTS);
    }
    assert.equal(arrivals, customersForDay(1));
    assert.equal(s.plan.arrived, s.plan.total);
    assert.equal(s.plan.served, s.plan.total);
    assert.equal(isDayOver(s), true);
  });

  test('variedade: com receitas suficientes, ninguém repete a poção do dia nem a última', () => {
    for (let seed = 1; seed <= 40; seed++) {
      let s = makeState({ discovered: RECIPE_IDS.slice(0, 8), day: 5, plan: undefined });
      s = fillOrders(s, mulberry32(seed));
      const seen = [];
      let last = null;
      while (s.orders.length) {
        const o = s.orders[0];
        assert.notEqual(o.potionId, last, `seed ${seed}: repetiu a poção do cliente anterior`);
        seen.push(o.potionId);
        last = o.potionId;
        s = fillOrders(assertOk(dismissOrder(s, o.id)).state, mulberry32(seed * 7 + seen.length));
      }
      assert.equal(new Set(seen).size, seen.length, `seed ${seed}: poções repetidas no mesmo dia (${seen.join(',')})`);
    }
  });

  test('estímulo: o 1º cliente de cada dia pede receita fora do caderno (se houver liberada)', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const s = fillOrders(makeState({ discovered: ['vapor', 'cura', 'vigor', 'sono', 'esporos', 'tempestade'], day: 2, plan: undefined }), mulberry32(seed));
      const novel = s.orders.filter((o) => o.novel);
      assert.ok(novel.length >= 1, 'pelo menos um pedido inédito');
      for (const o of novel) assert.notEqual(getRecipe(o.potionId).rarity, 'rara', 'rara só a partir do dia 3');
    }
  });

  test('entregar: consome 1, paga price+3, +3 XP e o cliente vai embora', () => {
    let s = makeState({ discovered: ['vapor', 'cura', 'vigor', 'brilho'], day: 5, plan: undefined });
    s = fillOrders(s, () => 0.9); // 0.9 → sem pedido inédito além do 1º
    const target = s.orders.find((o) => !o.novel);
    s = { ...s, inventory: { [target.potionId]: 2 } };
    const price = getRecipe(target.potionId).price;
    const res = assertOk(pure(deliverOrder, s, target.id, mulberry32(8)), 'entrega');
    const n = res.state;
    assert.equal(n.inventory[target.potionId], 1, 'consome exatamente 1');
    assert.equal(n.coins, s.coins + price + 3 + CONFIG.TIP_FAST, 'paga price + 3 (+ gorjeta: atendido na hora no dia 5)');
    assert.equal(res.result.reward, price + 3);
    assert.equal(res.result.tip, CONFIG.TIP_FAST);
    assert.equal(res.result.bonus, 0);
    assert.equal(n.xp, s.xp + 3, '+3 XP por entrega');
    assert.equal(n.stats.delivered, 1);
    assert.equal(n.orders.length, s.orders.length - 1, 'o cliente sai do balcão');
    assert.ok(!n.orders.some((o) => o.id === target.id));
    assert.equal(n.plan.served, s.plan.served + 1);
    assert.equal(n.plan.earned, price + 3);
    assert.equal(n.lastPotion, target.potionId);
  });

  test('pedido inédito paga bônus e XP extra', () => {
    let s = fillOrders(createInitialState(), mulberry32(3));
    const o = s.orders[0];
    s = { ...s, discovered: [o.potionId], inventory: { [o.potionId]: 1 } };
    const res = assertOk(deliverOrder(s, o.id, mulberry32(1)));
    assert.equal(res.result.bonus, CONFIG.NOVEL_BONUS);
    assert.equal(res.result.reward, orderReward(s, o.potionId) + CONFIG.NOVEL_BONUS);
    assert.equal(res.state.xp, s.xp + CONFIG.XP_DELIVERY + CONFIG.NOVEL_XP);
  });

  test('entregar com mercador paga floor((price+3)*1.25)', () => {
    const s = makeState({
      discovered: ['eclipse'], upgrades: { caldeirao: false, mercador: true, lupa: false },
      orders: [{ id: 'o1', customerId: CUSTOMERS[0].id, potionId: 'eclipse', clue: 0, misses: 0, novel: false }],
      orderSeq: 1, inventory: { eclipse: 1 },
    });
    const res = assertOk(deliverOrder(s, 'o1', mulberry32(3)));
    assert.equal(res.result.reward, 26);
    assert.equal(res.state.coins, s.coins + 26);
  });

  test('pedido só aceita a poção especificada (sem ela na prateleira, falha)', () => {
    const s = makeState({
      discovered: ['vapor', 'cura'],
      orders: [{ id: 'o1', customerId: CUSTOMERS[0].id, potionId: 'vapor', clue: 0, misses: 0, novel: false }],
      orderSeq: 1,
      inventory: { cura: 3, lodo: 2 },
    });
    assertFail(pure(deliverOrder, s, 'o1', mulberry32(1)), s, 'NOT_IN_INVENTORY', 'entregar vapor sem ter');
    assertFail(deliverOrder(s, 'o999', mulberry32(1)), s, 'INVALID_ORDER', 'pedido inexistente');
  });

  test('uma poção não pode ser vendida e entregue', () => {
    const s = makeState({
      discovered: ['vapor'],
      orders: [{ id: 'o1', customerId: CUSTOMERS[0].id, potionId: 'vapor', clue: 0, misses: 0, novel: false }],
      orderSeq: 1, inventory: { vapor: 1 },
    });
    const sold = assertOk(sellItem(s, 'vapor')).state;
    assertFail(deliverOrder(sold, 'o1', mulberry32(6)), sold, 'NOT_IN_INVENTORY', 'entregar após vender');
    const delivered = assertOk(deliverOrder(s, 'o1', mulberry32(6))).state;
    assertFail(sellItem(delivered, 'vapor'), delivered, 'NOT_IN_INVENTORY', 'vender após entregar');
  });

  test('entregar rende mais moedas que vender a mesma poção', () => {
    const s = makeState({
      discovered: ['sono'],
      orders: [{ id: 'o1', customerId: CUSTOMERS[0].id, potionId: 'sono', clue: 0, misses: 0, novel: false }],
      orderSeq: 1, inventory: { sono: 1 },
    });
    const viaSale = sellItem(s, 'sono').state.coins - s.coins;
    const viaOrder = deliverOrder(s, 'o1', mulberry32(1)).state.coins - s.coins;
    assert.ok(viaOrder > viaSale, `entrega ${viaOrder} deve ser > venda ${viaSale}`);
  });

  test('mandar embora: sai sem poção, −1 de fama (mín. 0), conta como atendido', () => {
    let s = fillOrders(makeState({ reputation: 1 }), mulberry32(2));
    const o = s.orders[1];
    const res = assertOk(pure(dismissOrder, s, o.id));
    assert.equal(res.state.orders.length, 2);
    assert.equal(res.state.reputation, 0);
    assert.equal(res.state.plan.sentAway, 1);
    assert.equal(res.state.plan.served, 1);
    assert.equal(res.state.stats.dismissed, 1);
    assert.equal(res.state.coins, s.coins, 'não custa moedas');
    assert.equal(assertOk(dismissOrder(res.state, res.state.orders[0].id)).state.reputation, 0, 'fama nunca negativa');
    assertFail(dismissOrder(s, 'o999'), s, 'INVALID_ORDER', 'mandar embora quem não existe');
  });

  test('fim do dia: só fecha sem clientes; mercador só vende à noite; dia seguinte traz mais gente', () => {
    let s = fillOrders(createInitialState(), mulberry32(9));
    assertFail(closeDay(s), s, 'DAY_NOT_OVER', 'fechar com clientes');
    assertFail(buyFromMerchant(s, 'agua'), s, 'MERCHANT_AWAY', 'comprar de dia');
    assertFail(startNextDay(s), s, 'DAY_OPEN', 'abrir dia já aberto');
    while (s.orders.length) s = fillOrders(dismissOrder(s, s.orders[0].id).state, mulberry32(1));
    const closed = assertOk(pure(closeDay, s));
    assert.equal(closed.state.phase, 'closed');
    assert.equal(closed.result.day, 1);
    assert.equal(closed.result.sentAway, 3);
    assert.equal(fillOrders(closed.state, mulberry32(1)).orders.length, 0, 'à noite ninguém entra');
    const bought = assertOk(buyFromMerchant(closed.state, 'agua', 2));
    assert.equal(bought.state.stock.agua, closed.state.stock.agua + 2);
    const next = assertOk(pure(startNextDay, bought.state, mulberry32(5)));
    assert.equal(next.state.day, 2);
    assert.equal(next.state.phase, 'open');
    assert.equal(next.state.plan.total, 4);
    assert.equal(next.state.orders.length, 3);
    assert.equal(next.state.plan.startCoins, bought.state.coins);
    assertFail(buyFromMerchant(next.state, 'agua'), next.state, 'MERCHANT_AWAY', 'comprar no dia 2 aberto');
  });

  test('sem ingredientes, sem poções e sem moedas, a mercadora deixa um punhado fiado', () => {
    const stock = Object.fromEntries(ING_IDS.map((id) => [id, 0]));
    const s = makeState({ stock, coins: 2, orders: [], plan: { ...createInitialState().plan, arrived: 3, served: 3, sentAway: 3 } });
    const r = assertOk(closeDay(s));
    assert.equal(r.result.aid, true);
    assert.ok(Object.values(r.state.stock).reduce((a, b) => a + b, 0) >= 4);
    const rich = assertOk(closeDay({ ...s, coins: 50 }));
    assert.equal(rich.result.aid, false);
  });
});

// ---------------------------------------------------------------------------
// Upgrades (critérios 3, 6)
// ---------------------------------------------------------------------------

describe('upgrades', () => {
  test('compra desconta custo e liga o upgrade', () => {
    for (const [id, cost] of [['caldeirao', 40], ['mercador', 90], ['lupa', 30], ['estufa', 150], ['alambique', 240]]) {
      const s = makeState({ coins: 300 });
      const res = assertOk(pure(buyUpgrade, s, id), `upgrade ${id}`);
      assert.equal(res.state.coins, 300 - cost);
      assert.equal(res.state.upgrades[id], true);
      assert.deepEqual(res.result, { upgradeId: id, cost });
    }
  });

  test('upgrades só podem ser comprados uma vez', () => {
    let s = makeState({ coins: 200 });
    for (const id of ['caldeirao', 'mercador', 'lupa']) {
      s = assertOk(buyUpgrade(s, id)).state;
      assertFail(pure(buyUpgrade, s, id), s, 'ALREADY_OWNED', `recomprar ${id}`);
    }
    assert.equal(s.coins, 200 - 160);
  });

  test('carteira insuficiente impede compra de upgrade', () => {
    const s = makeState({ coins: 29 });
    assertFail(buyUpgrade(s, 'caldeirao'), s, 'INSUFFICIENT_FUNDS', 'caldeirão com 29');
    assertFail(buyUpgrade(s, 'mercador'), s, 'INSUFFICIENT_FUNDS', 'mercador com 29');
    const s2 = makeState({ coins: 24 });
    assertFail(buyUpgrade(s2, 'lupa'), s2, 'INSUFFICIENT_FUNDS', 'lupa com 24');
    assertFail(buyUpgrade(s, 'foguete'), s, 'INVALID_ID', 'upgrade inexistente');
  });
});

// ---------------------------------------------------------------------------
// Dicas
// ---------------------------------------------------------------------------

describe('dicas', () => {
  const lupa = (extra = {}) => makeState({ upgrades: { caldeirao: false, mercador: false, lupa: true }, ...extra });

  test('exigem a Lupa Arcana', () => {
    const s = makeState({ coins: 100 });
    assert.equal(canRequestHint(s).ok, false);
    assert.equal(canRequestHint(s).error.code, 'LOCKED');
    assertFail(pure(requestHint, s, mulberry32(1)), s, 'LOCKED', 'dica sem lupa');
  });

  test('custam 5 e revelam só o 1º ingrediente (a) de receita não descoberta', () => {
    const s = lupa({ discovered: ['vapor', 'cura'] });
    assert.equal(canRequestHint(s).ok, true);
    const res = assertOk(pure(requestHint, s, mulberry32(1)));
    const { recipeId, ingredientId, repeated } = res.result;
    assert.ok(RECIPE_IDS.includes(recipeId));
    assert.ok(!s.discovered.includes(recipeId), 'dica não pode ser de receita já descoberta');
    assert.equal(ingredientId, getRecipe(recipeId).a, 'revela o campo a da receita');
    assert.equal(res.state.hints[recipeId], getRecipe(recipeId).a);
    assert.equal(repeated, false);
    assert.equal(res.state.coins, s.coins - 5);
    assert.deepEqual(res.state.discovered, s.discovered, 'dica não descobre a receita');
    const book = getRecipeBook(res.state).find((e) => e.id === recipeId);
    assert.equal(book.ingredients, null, 'o par inteiro não é revelado pela dica');
    assert.equal(book.hint, getRecipe(recipeId).a);
  });

  test('não duplicam enquanto houver receita sem dica; depois repetem e cobram', () => {
    let s = lupa({ coins: 200 });
    const rng = mulberry32(42);
    const seen = new Set();
    for (let i = 0; i < RECIPES.length; i++) {
      const res = assertOk(requestHint(s, rng), `dica ${i + 1}`);
      assert.ok(!seen.has(res.result.recipeId), `dica ${i + 1} repetiu ${res.result.recipeId} havendo receitas sem dica`);
      assert.equal(res.result.repeated, false);
      seen.add(res.result.recipeId);
      s = res.state;
    }
    assert.equal(s.coins, 200 - 5 * RECIPES.length);
    assert.equal(Object.keys(s.hints).length, RECIPES.length);
    for (const r of RECIPES) assert.equal(s.hints[r.id], r.a, `hints.${r.id}`);
    const res = assertOk(requestHint(s, rng), 'dica repetida');
    assert.equal(res.result.repeated, true);
    assert.equal(res.state.coins, s.coins - 5, 'dica repetida também cobra');
  });

  test('com receitas descobertas, dicas só para as restantes', () => {
    const discovered = RECIPE_IDS.slice(0, -2);
    let s = lupa({ discovered, coins: 50 });
    const got = new Set();
    for (let i = 0; i < 2; i++) {
      const res = assertOk(requestHint(s, mulberry32(i + 1)));
      assert.ok(!discovered.includes(res.result.recipeId));
      got.add(res.result.recipeId);
      s = res.state;
    }
    assert.deepEqual([...got].sort(), RECIPE_IDS.slice(-2).sort());
  });

  test('não cobram com todas as receitas descobertas', () => {
    const s = lupa({ discovered: [...RECIPE_IDS], coins: 50 });
    assert.equal(canRequestHint(s).ok, false);
    assert.equal(canRequestHint(s).error.code, 'NOTHING_TO_HINT');
    assertFail(pure(requestHint, s, mulberry32(1)), s, 'NOTHING_TO_HINT', 'dica com tudo descoberto');
  });

  test('carteira insuficiente impede dica', () => {
    const s = lupa({ coins: 4 });
    assert.equal(canRequestHint(s).ok, false);
    assert.equal(canRequestHint(s).error.code, 'INSUFFICIENT_FUNDS');
    assertFail(requestHint(s, mulberry32(1)), s, 'INSUFFICIENT_FUNDS', 'dica com 4 moedas');
  });
});

// ---------------------------------------------------------------------------
// Livro de receitas (critério 7)
// ---------------------------------------------------------------------------

describe('livro de receitas', () => {
  test('desconhecidas ocultas; descobertas mostram ingredientes', () => {
    const s0 = createInitialState();
    const book0 = getRecipeBook(s0);
    assert.equal(book0.length, 24);
    assert.deepEqual(book0.map((e) => e.id), RECIPE_IDS, 'ordem de RECIPES');
    for (const e of book0) {
      assert.equal(e.discovered, false);
      assert.equal(e.name, '???');
      assert.equal(e.ingredients, null);
      assert.equal(e.hint, null);
    }
    const s1 = mix(s0, 'fogo', 'cristal', forbiddenRng).state;
    const entry = getRecipeBook(s1).find((e) => e.id === 'chamaazul');
    assert.equal(entry.discovered, true);
    assert.equal(entry.name, getRecipe('chamaazul').name);
    assert.deepEqual(entry.ingredients, ['fogo', 'cristal']);
    assert.equal(getRecipeBook(s1).filter((e) => e.discovered).length, 1);
  });
});

// ---------------------------------------------------------------------------
// Persistência (critérios 8, 9)
// ---------------------------------------------------------------------------

describe('storage', () => {
  test('SAVE_KEY versionada', () => {
    assert.equal(SAVE_KEY, 'alquimia-de-bolso-save-v1');
  });

  test('sem save → status new com estado inicial válido', () => {
    const st = memoryStorage();
    const { state, status } = loadGame(st);
    assert.equal(status, 'new');
    assertValidState(state);
    assert.equal(state.coins, 40);
  });

  test('save/load preserva descobertas, upgrades e demais progresso', () => {
    let s = createInitialState();
    s = mix(s, 'agua', 'fogo', forbiddenRng).state;
    s = mix(s, 'sombra', 'luz', forbiddenRng).state;
    s = addCoins(s, 100);
    s = buyUpgrade(s, 'lupa').state;
    s = buyUpgrade(s, 'caldeirao').state;
    s = requestHint(s, mulberry32(1)).state;
    s = fillOrders(s, mulberry32(2));
    s = { ...s, sound: true };
    const st = memoryStorage();
    assert.equal(saveGame(s, st), true);
    assert.ok(st.getItem(SAVE_KEY), 'grava em SAVE_KEY');
    const { state, status } = loadGame(st);
    assert.equal(status, 'loaded');
    assert.deepEqual(state.discovered, ['vapor', 'eclipse']);
    assert.deepEqual(state.upgrades, { caldeirao: true, mercador: false, lupa: true, estufa: false, alambique: false });
    assert.equal(state.sound, true, 'opção de som persistida');
    assert.deepEqual(state, s, 'estado válido deve sobreviver ao save/load sem alterações');
  });

  test('JSON inválido → corrupt com estado válido, sem lançar', () => {
    const st = memoryStorage({ [SAVE_KEY]: '{isto não é json' });
    const { state, status } = loadGame(st);
    assert.equal(status, 'corrupt');
    assertValidState(state, 'após JSON inválido');
  });

  test('valores estranhos no storage não quebram (null, número, array, string)', () => {
    for (const raw of ['null', '42', '[]', '"texto"', 'true', '{}']) {
      const st = memoryStorage({ [SAVE_KEY]: raw });
      let out;
      assert.doesNotThrow(() => { out = loadGame(st); }, `loadGame com ${raw}`);
      assert.ok(['new', 'loaded', 'corrupt'].includes(out.status), `status inválido ${out.status} para ${raw}`);
      assertValidState(out.state, `save = ${raw}`);
    }
  });

  test('tipos errados nos campos são sanitizados', () => {
    const raw = {
      version: 1,
      coins: -50,
      xp: 'muito',
      stock: { agua: -3, fogo: 2.7, planta: '5', ouro: 99 },
      inventory: { vapor: -1, lodo: 2, inexistente: 5, cura: 'x' },
      discovered: ['vapor', 'vapor', 'falsa', 3, null],
      upgrades: { caldeirao: 'sim', mercador: true, foguete: true },
      orders: 'nenhum',
      orderSeq: -2,
      hints: { eclipse: 'sombra', falsa: 'agua', cura: 'ouro' },
      sound: 'yes',
      victorySeen: 1,
      stats: null,
    };
    const st = memoryStorage({ [SAVE_KEY]: JSON.stringify(raw) });
    const { state } = loadGame(st);
    assertValidState(state, 'loadGame com tipos errados');
    assert.ok(!state.discovered.includes('falsa'));
    assert.ok(state.discovered.filter((d) => d === 'vapor').length <= 1);
    assert.equal(state.upgrades.mercador, true, 'campo válido mantido');
    assert.equal('ouro' in state.stock, false, 'ingrediente desconhecido descartado');

    for (const v of [null, undefined, 0, 'x', [], [1, 2], () => 1, raw, { version: 99 }]) {
      let out;
      assert.doesNotThrow(() => { out = sanitizeState(v); }, `sanitizeState(${String(v)})`);
      assertValidState(out, `sanitizeState(${typeof v})`);
    }
  });

  test('estado sanitizado continua jogável', () => {
    const st = memoryStorage({ [SAVE_KEY]: '{"coins":"abc","stock":[]}' });
    const { state } = loadGame(st);
    const s = fillOrders(state, mulberry32(1));
    assertValidState(s);
    const r = buyIngredient({ ...s, coins: 10 }, 'agua');
    assert.equal(r.ok, true);
  });

  test('storage que lança: loadGame/saveGame/clearSave não lançam', () => {
    let out;
    assert.doesNotThrow(() => { out = loadGame(throwingStorage); });
    assertValidState(out.state);
    assert.doesNotThrow(() => { out = saveGame(createInitialState(), throwingStorage); });
    assert.equal(out, false);
    assert.doesNotThrow(() => { out = clearSave(throwingStorage); });
    assert.equal(out, false);
    assert.doesNotThrow(() => loadGame(undefined));
    assert.doesNotThrow(() => saveGame(createInitialState(), null));
  });

  test('clearSave remove apenas SAVE_KEY', () => {
    const st = memoryStorage({ outra: 'chave', 'alquimia-de-bolso-save-v0': 'antigo' });
    saveGame(createInitialState(), st);
    assert.equal(st.map.size, 3);
    assert.equal(clearSave(st), true);
    assert.equal(st.getItem(SAVE_KEY), null);
    assert.equal(st.getItem('outra'), 'chave');
    assert.equal(st.getItem('alquimia-de-bolso-save-v0'), 'antigo');
    assert.equal(st.map.size, 2);
    assert.equal(loadGame(st).status, 'new');
  });
});

// ---------------------------------------------------------------------------
// Vitória e free play
// ---------------------------------------------------------------------------

describe('vitória', () => {
  test('descobrir as 24 receitas jogando → isVictory, e o jogo continua', () => {
    let s = createInitialState();
    const rng = mulberry32(2024);
    for (const [id, a, b] of GDD_RECIPES) {
      assert.equal(isVictory(s), false, `ainda não venceu antes de ${id}`);
      for (const ing of [a, b]) {
        const need = a === b ? 2 : 1;
        while (s.stock[ing] < need) s = assertOk(buyIngredient(addCoins(s, 10), ing), `comprar ${ing}`).state;
      }
      const res = assertOk(mix(s, b, a, rng), `mix ${id}`);
      assert.equal(res.result.recipeId, id);
      s = fillOrders(res.state, rng);
    }
    assert.equal(s.discovered.length, 24);
    assert.equal(isVictory(s), true);
    assert.equal(isVictory(makeState({ discovered: RECIPE_IDS.slice(0, 23) })), false);

    // free play depois da vitória
    s = assertOk(buyIngredient(addCoins(s, 20), 'agua'), 'comprar água após vitória').state;
    s = assertOk(buyIngredient(s, 'fogo'), 'comprar fogo após vitória').state;
    const m = assertOk(mix(s, 'agua', 'fogo', rng), 'mix após vitória');
    assert.equal(m.result.isNew, false);
    s = m.state;
    const sold = assertOk(sellItem(s, 'vapor'), 'vender após vitória');
    s = fillOrders(sold.state, rng);
    assert.equal(s.orders.length, 3);
    assertOrdersValid(s, "após vitória");
    const o = s.orders[0];
    s = { ...s, inventory: { ...s.inventory, [o.potionId]: (s.inventory[o.potionId] || 0) + 1 } };
    assertOk(deliverOrder(s, o.id, rng), 'entregar após vitória');
    assert.equal(isVictory(s), true);
  });
});

// ---------------------------------------------------------------------------
// Simulação aleatória com invariantes
// ---------------------------------------------------------------------------

describe('simulação aleatória', () => {
  function runSimulation(seed, steps) {
    const rng = mulberry32(seed);
    const pick = (arr) => arr[Math.floor(rng() * arr.length)];
    let s = fillOrders(createInitialState(), rng);
    const counts = { ok: 0, fail: 0 };
    for (let step = 0; step < steps; step++) {
      const label = `seed ${seed}, passo ${step}`;
      const kind = pick(['mix', 'mix', 'mix', 'buy', 'buy', 'sell', 'deliver', 'deliver', 'dismiss', 'day', 'upgrade', 'hint']);
      const before = s;
      const snapshot = structuredClone(s);
      let res;
      let a; let b;
      switch (kind) {
        case 'mix':
          a = pick(ING_IDS); b = pick(ING_IDS);
          res = mix(s, a, b, rng);
          break;
        case 'buy':
          res = buyIngredient(s, pick(ING_IDS), 1 + Math.floor(rng() * 3));
          break;
        case 'sell': {
          const items = Object.keys(s.inventory);
          res = sellItem(s, items.length ? pick(items) : 'vapor');
          break;
        }
        case 'deliver':
          res = deliverOrder(s, s.orders.length ? pick(s.orders).id : 'o0', rng);
          break;
        case 'dismiss':
          res = dismissOrder(s, s.orders.length ? pick(s.orders).id : 'o0');
          break;
        case 'day':
          res = s.phase === 'closed' ? startNextDay(s, rng) : closeDay(s);
          break;
        case 'upgrade':
          res = buyUpgrade(s, pick(['caldeirao', 'mercador', 'lupa']));
          break;
        default:
          res = requestHint(s, rng);
      }
      assert.deepEqual(before, snapshot, `${label}: ${kind} mutou o estado de entrada`);
      if (res.ok) {
        counts.ok++;
        const n = res.state;
        assert.notEqual(n, before, `${label}: sucesso deve devolver novo objeto`);
        if (kind === 'mix') {
          const da = before.stock[a] - n.stock[a];
          const db = before.stock[b] - n.stock[b];
          const expected = res.result.free ? 0 : (a === b ? 2 : 1);
          assert.equal(da, expected, `${label}: consumo de ${a} (free=${res.result.free})`);
          if (a !== b) assert.equal(db, expected, `${label}: consumo de ${b}`);
          assert.equal(n.xp - before.xp, res.result.isNew ? 6 : 1, `${label}: XP da mistura`);
          const totalBefore = Object.values(before.inventory).reduce((x, y) => x + y, 0);
          const totalAfter = Object.values(n.inventory).reduce((x, y) => x + y, 0);
          assert.equal(totalAfter, totalBefore + 1, `${label}: mistura gera exatamente 1 item`);
        }
        if (kind === 'deliver') {
          assert.equal(n.xp - before.xp, res.result.novel ? 3 + CONFIG.NOVEL_XP : 3, `${label}: XP da entrega`);
          assert.equal(n.orders.length, before.orders.length - 1, `${label}: cliente atendido sai`);
        }
        if (kind === 'dismiss') assert.equal(n.plan.sentAway, before.plan.sentAway + 1, `${label}: mandou embora`);
        if (kind === 'sell' || kind === 'deliver') assert.ok(n.coins > before.coins, `${label}: ${kind} deve render moedas`);
        if (kind === 'buy' || kind === 'upgrade' || kind === 'hint') {
          assert.ok(n.coins < before.coins, `${label}: ${kind} deve custar moedas`);
        }
        s = fillOrders(n, rng);
      } else {
        counts.fail++;
        assert.equal(res.state, before, `${label}: falha (${res.error && res.error.code}) deve devolver o mesmo objeto`);
      }
      assertValidState(s, label);
      assertOrdersValid(s, label);
      assert.ok(s.orders.length <= CONFIG.ORDER_SLOTS, `${label}: no máximo 3 clientes`);
      if (s.phase === 'closed') assert.equal(s.orders.length, 0, `${label}: loja fechada sem clientes`);
      assert.ok(s.plan.arrived <= s.plan.total && s.plan.served <= s.plan.arrived, `${label}: plano do dia coerente`);
      // Pedidos repetidos gerados quando havia < 3 descobertas podem persistir (fillOrders é
      // idempotente com 3 pedidos, conforme CONTRATOS.md); por isso não exigimos ausência global
      // de duplicatas aqui — só que substituições não criem novas duplicatas (verificado acima).
      assert.equal(getLevel(s.xp), 1 + Math.floor(s.xp / 20), `${label}: nível`);
      assert.ok(s.stats.bestCoins >= s.coins, `${label}: bestCoins >= coins`);
      assert.equal(isVictory(s), s.discovered.length === CONFIG.TOTAL_RECIPES, `${label}: isVictory`);
    }
    return { s, counts };
  }

  for (const seed of [1, 7, 123, 2024, 99999]) {
    test(`seed ${seed}: 400 ações mantêm invariantes`, () => {
      const { s, counts } = runSimulation(seed, 400);
      assert.ok(counts.ok > 50, `poucas ações bem-sucedidas (${counts.ok}); simulação pouco representativa`);
      assert.ok(s.stats.mixes > 0);
    });
  }
});

// ---------------------------------------------------------------------------
// v1.1 — ideias da pesquisa: pedidos por pistas, dica grátis, grimório,
// lodo com pista, categorias/selo no livro.
// ---------------------------------------------------------------------------
import * as D11 from '../src/data.js';
import * as E11 from '../src/engine.js';
import * as P11 from '../src/progression.js';
import * as S11 from '../src/storage.js';

function v11State(discovered = []) {
  const s = E11.createInitialState();
  s.discovered = [...discovered];
  return s;
}

describe('v1.1 pedidos por pistas', () => {
  test('pedidos novos trazem uma das 4 pistas e misses 0; getOrderClues mostra 1 frase', () => {
    const s = P11.fillOrders(v11State(['vapor', 'cura', 'vigor']), () => 0.7);
    for (const o of s.orders) {
      assert.ok(Number.isInteger(o.clue) && o.clue >= 0 && o.clue < 4);
      assert.equal(o.misses, 0);
      const clues = P11.getOrderClues(o);
      assert.equal(clues.length, 1);
      assert.ok(D11.getRecipe(o.potionId).clues.includes(clues[0]));
      assert.equal(P11.isOrderRevealed(o), false);
    }
  });

  test('entregar poção errada: não consome, −1 reputação (mín. 0), revela mais pista e depois o nome', () => {
    let s = P11.fillOrders(v11State(['vapor', 'cura', 'vigor']), () => 0.1);
    const o = s.orders[0];
    const wrong = ['vapor', 'cura', 'vigor'].find((id) => id !== o.potionId);
    s = { ...s, reputation: 1, inventory: { [wrong]: 1, [o.potionId]: 1 } };
    let r = P11.deliverOrder(s, o.id, () => 0.1, wrong);
    assert.equal(r.ok, true);
    assert.equal(r.result.correct, false);
    assert.equal(r.state.inventory[wrong], 1, 'poção errada volta ao inventário');
    assert.equal(r.state.coins, s.coins);
    assert.equal(r.state.reputation, 0);
    assert.equal(P11.getOrderClues(r.state.orders[0]).length, 2);
    r = P11.deliverOrder(r.state, o.id, () => 0.1, wrong);
    assert.equal(r.state.reputation, 0, 'reputação nunca fica negativa');
    assert.equal(P11.isOrderRevealed(r.state.orders[0]), true);
    const ok = P11.deliverOrder(r.state, o.id, () => 0.1, o.potionId);
    assert.equal(ok.result.correct, true);
    assert.equal(ok.state.reputation, 1);
    assert.equal(ok.state.coins, s.coins + E11.orderReward(s, o.potionId) + (o.novel ? D11.CONFIG.NOVEL_BONUS : 0));
    assert.equal(ok.state.inventory[o.potionId], undefined);
  });

  test('não dá para "entregar" poção errada que não está no inventário', () => {
    const s = P11.fillOrders(v11State(['vapor', 'cura']), () => 0.1);
    const o = s.orders[0];
    const wrong = o.potionId === 'vapor' ? 'cura' : 'vapor';
    const r = P11.deliverOrder(s, o.id, () => 0.1, wrong);
    assert.equal(r.ok, false);
    assert.equal(r.state, s);
    assert.equal(r.error.code, 'NOT_IN_INVENTORY');
  });
});

describe('v1.1 dica grátis', () => {
  test('não exige Lupa, não cobra e recarrega em 4 minutos', () => {
    const s = v11State();
    const now = 1_000_000;
    const r = P11.requestFreeHint(s, now, () => 0);
    assert.equal(r.ok, true);
    assert.equal(r.state.coins, s.coins);
    assert.equal(r.state.hints[r.result.recipeId], D11.getRecipe(r.result.recipeId).a);
    const again = P11.requestFreeHint(r.state, now + 60_000, () => 0);
    assert.equal(again.ok, false);
    assert.equal(again.error.code, 'COOLDOWN');
    assert.equal(again.state, r.state);
    assert.equal(P11.requestFreeHint(r.state, now + D11.CONFIG.FREE_HINT_COOLDOWN_MS, () => 0).ok, true);
  });

  test('com 12/12 não há dica grátis', () => {
    const s = v11State(D11.RECIPES.map((r) => r.id));
    const r = P11.requestFreeHint(s, 0, () => 0);
    assert.equal(r.ok, false);
    assert.equal(r.error.code, 'NOTHING_TO_HINT');
  });
});

describe('v1.1 grimório e lodo com pista', () => {
  test('mistura que vira lodo fica registrada uma vez (comutativa)', () => {
    let s = v11State();
    s = E11.mix(s, 'agua', 'sombra').state;
    s = E11.mix(s, 'sombra', 'agua').state;
    assert.deepEqual(s.failedPairs, [D11.recipeKey('agua', 'sombra')]);
    assert.equal(E11.isKnownFailure(s, 'sombra', 'agua'), true);
    assert.equal(E11.isKnownFailure(s, 'agua', 'fogo'), false);
    const ok = E11.mix(s, 'agua', 'fogo').state;
    assert.equal(ok.failedPairs.length, 1, 'receita certa não entra no grimório');
  });

  test('pista do lodo é determinística e aponta qualidade de parceiro real', () => {
    const s = v11State();
    const c = P11.sludgeClue(s, 'agua', 'sombra');
    assert.deepEqual(c, P11.sludgeClue(s, 'agua', 'sombra'));
    const partners = D11.RECIPES.filter((r) => r.a === c.ingredientId || r.b === c.ingredientId)
      .map((r) => (r.a === c.ingredientId ? r.b : r.a)).map((id) => D11.getIngredient(id).quality);
    assert.ok(partners.includes(c.quality));
    assert.equal(P11.sludgeClue(v11State(D11.RECIPES.map((r) => r.id)), 'agua', 'sombra'), null);
  });
});

describe('v1.1 livro por categoria e selo', () => {
  test('3 categorias com 8 receitas cada; selo = ordem da descoberta', () => {
    const groups = P11.getRecipeBookByCategory(v11State(['eclipse', 'cura']));
    assert.equal(groups.length, 3);
    assert.equal(groups.reduce((n, g) => n + g.total, 0), 24);
    for (const g of groups) assert.equal(g.total, 8, `categoria ${g.id}`);
    const all = groups.flatMap((g) => g.entries);
    assert.equal(all.find((e) => e.id === 'eclipse').order, 1);
    assert.equal(all.find((e) => e.id === 'cura').order, 2);
    assert.equal(all.find((e) => e.id === 'vapor').order, null);
  });
});

describe('v1.1 save', () => {
  test('reputação, dica grátis, grimório e pistas dos pedidos sobrevivem ao save e são sanitizados', () => {
    let s = P11.fillOrders(v11State(['vapor', 'cura']), () => 0.9);
    s = { ...s, reputation: 4, freeHintReadyAt: 123, failedPairs: ['agua+sombra', 'agua+fogo', 'lixo'] };
    s.orders[0].misses = 1;
    const clean = S11.sanitizeState(JSON.parse(JSON.stringify(s)));
    assert.equal(clean.reputation, 4);
    assert.equal(clean.freeHintReadyAt, 123);
    assert.deepEqual(clean.failedPairs, ['agua+sombra'], 'só pares que realmente viram lodo');
    assert.equal(clean.orders[0].misses, 1);
    assert.equal(clean.orders[0].clue, s.orders[0].clue);
    const bad = S11.sanitizeState({ ...s, reputation: -3, freeHintReadyAt: 'x', failedPairs: 'nada' });
    assert.equal(bad.reputation, 0);
    assert.equal(bad.freeHintReadyAt, 0);
    assert.deepEqual(bad.failedPairs, []);
  });
});

// ---------------------------------------------------------------------------
// v1.2 — opções do menu (guardadas à parte) e detecção de caderno salvo
// ---------------------------------------------------------------------------
import * as S12 from '../src/storage.js';

function memStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    keys: () => [...m.keys()],
  };
}

describe('v1.2 opções e menu', () => {
  test('opções têm padrão seguro e são sanitizadas', () => {
    assert.deepEqual(S12.defaultOptions(), { sound: false, volume: 50, reduceMotion: false, textSize: 'normal', relaxed: false, quality: 'alta' });
    assert.equal(S12.sanitizeOptions({ quality: 'leve' }).quality, 'leve');
    assert.equal(S12.sanitizeOptions({ quality: 'ultra' }).quality, 'alta');
    assert.deepEqual(
      S12.sanitizeOptions({ sound: 'sim', volume: 250, reduceMotion: true, textSize: 'gigante' }),
      { sound: false, volume: 100, reduceMotion: true, textSize: 'normal', relaxed: false, quality: 'alta' },
    );
    assert.equal(S12.sanitizeOptions({ volume: -5 }).volume, 50);
    assert.deepEqual(S12.sanitizeOptions(null), S12.defaultOptions());
  });

  test('opções sobrevivem ao save e ao "Novo jogo" (clearSave não as apaga)', () => {
    const st = memStorage();
    assert.equal(S12.loadOptions(st).found, false);
    assert.equal(S12.saveOptions({ sound: true, volume: 30, reduceMotion: true, textSize: 'maior' }, st), true);
    S12.saveGame(E11.createInitialState(), st);
    assert.equal(S12.hasSave(st), true);
    S12.clearSave(st);
    assert.equal(S12.hasSave(st), false);
    const { options, found } = S12.loadOptions(st);
    assert.equal(found, true);
    assert.deepEqual(options, { sound: true, volume: 30, reduceMotion: true, textSize: 'maior', relaxed: false, quality: 'alta' });
  });

  test('JSON de opções corrompido não quebra e hasSave nunca lança', () => {
    const st = memStorage();
    st.setItem(S12.OPTIONS_KEY, '{oops');
    assert.deepEqual(S12.loadOptions(st).options, S12.defaultOptions());
    const broken = { getItem() { throw new Error('bloqueado'); } };
    assert.equal(S12.hasSave(broken), false);
    assert.equal(S12.loadOptions(broken).found, false);
  });
});

// ---------------------------------------------------------------------------
// v1.4 — dias de atendimento no save
// ---------------------------------------------------------------------------
describe('v1.4 save dos dias', () => {
  test('dia, fase, plano e pedidos inéditos sobrevivem ao save e são sanitizados', () => {
    let s = fillOrders(createInitialState(), mulberry32(5));
    s = { ...s, day: 4, lastPotion: 'vapor', lastCustomer: s.orders[0].customerId };
    const clean = sanitizeState(JSON.parse(JSON.stringify(s)));
    assert.equal(clean.day, 4);
    assert.equal(clean.phase, 'open');
    assert.equal(clean.plan.arrived, 3);
    assert.deepEqual(clean.orders, s.orders, 'pedidos inéditos (poção fora do caderno) continuam válidos');
    assert.equal(clean.lastPotion, 'vapor');
    const bad = sanitizeState({ ...s, day: -2, phase: 'xyz', plan: 'nada', lastPotion: 'ouro', orders: [{ id: 'o9', customerId: MERCHANT.id, potionId: 'vapor' }] });
    assert.equal(bad.day, 1);
    assert.equal(bad.phase, 'open');
    assert.equal(bad.plan.total, customersForDay(1));
    assert.equal(bad.lastPotion, null);
    assert.deepEqual(bad.orders, [], 'a mercadora não vira cliente');
    const night = sanitizeState({ ...s, phase: 'closed' });
    assert.equal(night.phase, 'closed');
    assert.deepEqual(night.orders, [], 'à noite não há clientes');
    assertValidState(bad, 'save ruim');
  });
});
