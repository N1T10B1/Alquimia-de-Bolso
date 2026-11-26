// v1.28 — edição demo: 12 receitas (4 por categoria) e fim no fechamento do dia 5.
// Roda num processo próprio (node --test separa os arquivos), com a marca da demo antes de importar o jogo.
import { test } from 'node:test';
import assert from 'node:assert/strict';

globalThis.ALQUIMIA_EDICAO = 'demo';
const D = await import('../src/data.js');
const E = await import('../src/engine.js');
const P = await import('../src/progression.js');
const L = await import('../src/dialogue.js');

function mulberry(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

test('demo: 12 receitas, 4 por categoria, as 12 do GDD', () => {
  assert.equal(D.IS_DEMO, true);
  assert.equal(D.RECIPES.length, 12);
  assert.equal(D.CONFIG.TOTAL_RECIPES, 12);
  for (const cat of ['cura', 'protecao', 'travessura']) assert.equal(D.RECIPES.filter((r) => r.category === cat).length, 4, cat);
  assert.deepEqual(D.RECIPES.map((r) => r.id).sort(), [...D.DEMO_RECIPES].sort());
});

test('demo: dose dupla vira Lodo e as fichas não falam dela', () => {
  assert.equal(D.findRecipe('agua', 'agua'), null);
  assert.equal(D.findRecipe('agua', 'planta').id, 'cura');
  for (const i of D.INGREDIENTS) assert.ok(!/dose dupla/i.test(i.helps), i.id);
  assert.ok(!/duas vezes/.test(D.TIPS.find((t) => t.id === 'misturar').text));
});

test('demo: o dia 5 fecha e não há dia 6; resumo e carta', () => {
  const rng = mulberry(7);
  let s = E.createInitialState();
  s.coins = 500;
  for (let day = 1; day <= 5; day++) {
    for (let g = 0; g < 50 && !P.isDayOver(s); g++) {
      s = P.fillOrders(s, rng);
      const o = s.orders[0];
      if (!o) break;
      s = P.dismissOrder(s, o.id).state;
    }
    s = P.closeDay(P.fillOrders(s, rng)).state;
    if (day < 5) {
      assert.equal(P.isDemoOver(s), false, `dia ${day}`);
      s = P.startNextDay(s, rng).state;
    }
  }
  assert.equal(s.day, 5);
  assert.equal(P.isDemoOver(s), true);
  const next = P.startNextDay(s, rng);
  assert.equal(next.ok, false);
  assert.equal(next.error.code, 'DEMO_OVER');
  const r = P.demoSummary(s);
  assert.equal(r.total, 12);
  assert.equal(r.day, 5);
  const letter = L.demoLetter(r);
  assert.ok(letter.paragraphs[0].includes('das 12 receitas'));
  assert.ok(L.demoLetter({ ...r, found: 12 }).paragraphs[0].includes('12 páginas'));
});

test('demo: com o senhorio no balcão, a carta espera ele ir embora', () => {
  const s = { ...E.createInitialState(), day: 5, phase: 'closed', landlord: true, debt: 30 };
  assert.equal(P.isDemoOver(s), false);
  assert.equal(P.isDemoOver({ ...s, landlord: false, debt: 0 }), true);
});
