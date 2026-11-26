// Testes da abertura e do tutorial (regras puras de src/story.js).
// Executar: node --test tests/story.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, mix } from '../src/engine.js';
import { deliverOrder, isDayOver } from '../src/progression.js';
import { CUSTOMERS, getRecipe, recipeKey } from '../src/data.js';
import { sanitizeState } from '../src/storage.js';
import { seedTutorialDay, TUTORIAL_ORDER, TUTORIAL_PAIR, STORY_PAGES, LETTER, TUTORIAL_NOTES } from '../src/story.js';

const rng = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

test('o dia do tutorial começa com a Vovó Quitéria pedindo Elixir de Cura', () => {
  for (let s = 1; s < 40; s++) {
    const st = seedTutorialDay(createInitialState(), rng(s));
    assert.equal(st.orders[0].customerId, 'vovo-quiteria');
    assert.equal(st.orders[0].potionId, 'cura');
    assert.equal(st.orders.length, Math.min(3, st.plan.total));
    assert.equal(st.plan.arrived, st.orders.length);
    const others = st.orders.slice(1);
    assert.ok(others.every((o) => o.potionId !== 'cura' && o.customerId !== 'vovo-quiteria'), 'sem repetir a Vovó ou o Elixir');
    assert.equal(new Set(st.orders.map((o) => o.id)).size, st.orders.length, 'ids únicos');
  }
});

test('o par do tutorial é mesmo o Elixir de Cura e a Vovó paga ao receber', () => {
  assert.equal(recipeKey(...TUTORIAL_PAIR), recipeKey(getRecipe('cura').a, getRecipe('cura').b));
  let st = seedTutorialDay(createInitialState(), rng(7));
  const m = mix(st, ...TUTORIAL_PAIR, rng(3));
  assert.ok(m.ok);
  assert.equal(m.result.recipeId, 'cura');
  const d = deliverOrder(m.state, TUTORIAL_ORDER.id);
  assert.ok(d.ok && d.result.correct);
  assert.ok(!d.state.orders.some((o) => o.customerId === 'vovo-quiteria'));
  st = d.state;
  assert.equal(isDayOver(st), false);
});

test('o estado do tutorial sobrevive ao salvar e carregar', () => {
  const st = seedTutorialDay(createInitialState(), rng(11));
  const back = sanitizeState(JSON.parse(JSON.stringify(st)));
  assert.equal(back.orders[0].customerId, 'vovo-quiteria');
  assert.equal(back.orders[0].potionId, 'cura');
});

test('textos da abertura e bilhetes existem', () => {
  assert.equal(STORY_PAGES.length, 4);
  assert.ok(LETTER.paragraphs.length >= 4);
  assert.ok(CUSTOMERS.some((c) => c.id === TUTORIAL_ORDER.customerId));
  for (const k of ['balcao', 'livro', 'herbario', 'ler', 'caldeirao', 'misturar', 'lodo', 'outra', 'descoberta', 'entregar', 'sozinha', 'zuleica', 'banca', 'amanha']) {
    assert.ok(TUTORIAL_NOTES[k]?.text, `bilhete ${k}`);
  }
});
