// v1.30 — jogo em inglês: todo texto em português tem o seu par em inglês.
// Este arquivo roda num processo próprio (node --test), com o idioma forçado para inglês
// e a edição completa (24 receitas).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

globalThis.ALQUIMIA_IDIOMA = 'en';
const I = await import('../src/idioma.js');
const D = await import('../src/data.js');
const DL = await import('../src/dialogue.js');
const S = await import('../src/story.js');
const E = await import('../src/engine.js');

// palavras que só aparecem em português (nomes próprios como Quitéria e Benvinda ficam iguais)
const PT = /\b(não|você|poção|poções|moedas?|caldeirão|ingrediente|receita|cliente|freguesa?|mercadora|boticária|amanhã|hoje|para|com|que)\b/i;

test('idioma forçado para inglês', () => {
  assert.equal(I.LANG, 'en');
  assert.equal(I.L('sim', 'yes'), 'yes');
});

test('ingredientes, receitas, utensílios e clientes têm texto em inglês', () => {
  for (const i of D.INGREDIENTS) {
    for (const k of ['name', 'quality', 'element', 'lore', 'property', 'helps']) {
      assert.ok(i[k] && !PT.test(i[k]), `${i.id}.${k}: ${i[k]}`);
    }
  }
  assert.equal(D.RECIPES.length, 24);
  for (const r of D.RECIPES) {
    assert.ok(r.name && !PT.test(r.name), r.id);
    assert.equal(r.clues.length, 4, r.id);
    for (const c of r.clues) assert.ok(!PT.test(c), `${r.id}: ${c}`);
  }
  for (const u of D.UPGRADES) assert.ok(!PT.test(u.name) && !PT.test(u.description), u.id);
  for (const c of D.CUSTOMERS) assert.ok(!PT.test(c.name) && !PT.test(c.temper), c.id);
  for (const t of D.TIPS) assert.ok(!PT.test(t.title) && !PT.test(t.text), t.id);
  for (const f of D.FAME_TIERS) assert.ok(!PT.test(f.name), f.name);
  assert.equal(D.SLUDGE.name, 'Unstable Sludge');
});

test('quem chega tem falas em inglês para todas as situações', () => {
  for (const c of D.CUSTOMERS) {
    for (const kind of ['greet', 'thanks', 'sad', 'leave']) {
      const line = DL.lineFor(c.id, kind, 'x');
      assert.ok(line && !PT.test(line), `${c.id}.${kind}: ${line}`);
    }
  }
  for (const list of [DL.NOVEL_HINTS, DL.MERCHANT_LINES, DL.IMPATIENT_LINES, DL.HURRY_LINES, DL.MERCHANT_HURRY_LINES, DL.MERCHANT_BYE_LINES]) {
    for (const l of list) assert.ok(!PT.test(l), l);
  }
  const carta = DL.demoLetter({ found: 3, total: 12, day: 5 });
  assert.ok(carta.paragraphs.every((p) => !PT.test(p)));
});

test('história e tutorial em inglês, com as mesmas páginas e passos do português', () => {
  assert.equal(S.STORY_PAGES.length, 4);
  for (const p of S.STORY_PAGES) {
    assert.ok(p.art && p.id, p.id);
    for (const t of [p.kicker, p.title, ...p.text]) assert.ok(!PT.test(t), t);
  }
  for (const t of S.LETTER.paragraphs) assert.ok(!PT.test(t), t);
  const passos = ['balcao', 'livro', 'herbario', 'ler', 'caldeirao', 'misturar', 'lodo', 'outra', 'descoberta', 'entregar', 'sozinha', 'zuleica', 'banca', 'amanha'];
  assert.deepEqual(Object.keys(S.TUTORIAL_NOTES).sort(), passos.sort());
  for (const n of Object.values(S.TUTORIAL_NOTES)) assert.ok(!PT.test(n.text), n.text);
});

test('mensagens de erro das regras saem em inglês', () => {
  const st = E.createInitialState();
  const out = E.mix(st, 'nada', 'agua');
  assert.equal(out.ok, false);
  assert.match(out.error.message, /notebook/);
});

test('cada texto fixo do index.html com tradução usa um atributo data-en conhecido', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const attrs = [...html.matchAll(/\sdata-en(-[a-z-]+)?="/g)].map((m) => m[1] || '');
  assert.ok(attrs.length > 60);
  for (const a of new Set(attrs)) assert.ok(['', '-html', '-aria-label', '-title', '-content', '-data-lang', '-lang'].includes(a), a);
  // nenhuma tradução presa num <input> (o texto do rótulo fica no <label>)
  assert.ok(!/<input[^>]*\sdata-en="/.test(html));
});
