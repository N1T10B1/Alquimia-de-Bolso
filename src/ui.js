// Alquimia de Bolso — interface (DOM). A loja ao entardecer: o cliente chega ao balcão,
// faz o pedido numa caixa de diálogo e o jogador responde com cartas (ingredientes e poções).
// Guarda só estado de interface; regras e preços vêm da engine/progression.
import { IS_DEMO, INGREDIENTS, RECIPES, UPGRADES, CUSTOMERS, CONFIG, MERCHANT, LANDLORD, TIPS, getIngredient, getItem, getRecipe, upkeepForDay, fameTier, patienceForDay } from './data.js';
import { sellPrice, orderReward, canMix, getLevelProgress, isKnownFailure } from './engine.js';
import {
  canRequestHint, getRecipeBookByCategory, getOrderClues, isOrderRevealed,
  canRequestFreeHint, freeHintWaitMs, sludgeClue, isMerchantHere, patienceLeft, merchantCandle, merchantSludgeLeft,
  closesUntilLandlord, shelfValue, isDemoOver, demoSummary,
} from './progression.js';
import { itemArt, customerArt } from './art.js';
import { lineFor, pickLine, NOVEL_HINTS, MERCHANT_LINES, MERCHANT_HURRY_LINES, MERCHANT_BYE_LINES, IMPATIENT_LINES, HURRY_LINES, demoLetter } from './dialogue.js';

// Raridade pelas cores da Grande Obra (guia de arte): nigredo, albedo, citrinitas, rubedo.
const RARITY_LABEL = { comum: 'Comum', incomum: 'Incomum', rara: 'Rara', falha: 'Falha' };

// Cores puramente cosméticas do líquido do caldeirão.
const BREW_COLOR = {
  agua: '#4f86c6', fogo: '#d2552d', planta: '#4f9a4a', cristal: '#9fc6da',
  sombra: '#5b3f86', luz: '#e8b93c', cogumelo: '#3d6fb8', vento: '#8fc9bb',
};

const GREETER = 'gato-falante';

const TOTAL = () => (CONFIG && CONFIG.TOTAL_RECIPES) || 12;
const SHEETS = ['livro', 'caldeirao', 'prateleira', 'utensilios', 'mercador', 'caixa'];
const DRAG_OPEN_PX = 70;

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function rarityLabel(r) { return RARITY_LABEL[r] || ''; }
function plural(n, one, many) { return `${n} ${n === 1 ? one : many}`; }
function coins(n) { return `${n} ${n === 1 ? 'moeda' : 'moedas'}`; }
function disabledAttr(disabled, reason) {
  return disabled ? ` disabled title="${esc(reason)}"` : '';
}

function img(id, cls = '', alt = '') {
  const src = itemArt(id);
  return src ? `<img class="${cls}" src="${src}" alt="${esc(alt)}" draggable="false">` : '';
}
const coinIcon = () => img('moeda', 'coin-ico');

// ---------- Livro de receitas (também usado pelo menu, sem botões) ----------
function remakeButton(state, recipe, label) {
  const check = canMix(state, recipe.a, recipe.b);
  const why = check && check.ok ? '' : ((check && check.error && check.error.message) || 'Faltam ingredientes na prateleira.');
  return `<button type="button" class="btn btn-small btn-remake" data-action="remake" data-id="${esc(recipe.id)}"
    aria-label="Preparar ${esc(recipe.name)} de novo"${disabledAttr(!(check && check.ok), why)}>${label}</button>`;
}

export function buildBookHTML(state, { interactive = true } = {}) {
  const groups = getRecipeBookByCategory(state) || [];
  const found = (state.discovered || []).length;
  const entryHTML = (e) => {
    if (e.discovered) {
      const [a, b] = (e.ingredients || []).map(getIngredient);
      const recipe = getRecipe(e.id);
      return `
      <li class="book-entry is-known rarity-${esc(e.rarity)}">
        <span class="book-seal" title="Ordem em que você descobriu esta receita">nº ${esc(e.order)}</span>
        ${img(e.id, 'book-img')}
        <span class="book-text">
          <span class="book-name">${esc(e.name)}</span>
          <span class="book-meta"><span class="rarity rarity-${esc(e.rarity)}">${esc(rarityLabel(e.rarity))}</span> · <span class="book-price" title="Pedido: quanto o cliente paga. Balcão: venda avulsa na prateleira.">Pedido ${coinIcon()} ${esc(orderReward(state, e.id))} · balcão ${esc(sellPrice(state, e.id))}</span></span>
          ${a && b ? `<span class="book-recipe">${img(a.id, 'mini-img')} ${esc(a.name)} + ${img(b.id, 'mini-img')} ${esc(b.name)}</span>` : ''}
        </span>
        ${recipe && interactive ? remakeButton(state, recipe, 'Preparar') : ''}
      </li>`;
    }
    const hint = e.hint ? getIngredient(e.hint) : null;
    return `
    <li class="book-entry is-unknown">
      ${img(e.id, 'book-img book-silhouette')}
      <span class="book-text">
        <span class="book-name">${esc(e.name || '???')}${e.name && e.name !== '???' ? '' : '<span class="sr-only"> (receita desconhecida)</span>'}</span>
        ${hint
          ? `<span class="book-hint">Dica: leva ${img(hint.id, 'mini-img')} ${esc(hint.name)} + ???</span>`
          : '<span class="book-hint is-muted">Página em branco</span>'}
      </span>
    </li>`;
  };
  const sections = groups.map((g) => `
    <section class="book-group" aria-labelledby="book-cat-${esc(g.id)}">
      <h3 id="book-cat-${esc(g.id)}" class="book-cat">${esc(g.name)} <small>${esc(g.found)}/${esc(g.total)}</small></h3>
      <ul class="book-grid">${g.entries.map(entryHTML).join('')}</ul>
    </section>`).join('');
  const fails = (state.failedPairs || []).map((k) => k.split('+').map(getIngredient)).filter(([a, b]) => a && b);
  const grimoire = `
    <section class="book-group grimoire" aria-labelledby="book-grimoire">
      <h3 id="book-grimoire" class="book-cat">Grimório de tentativas <small>${esc(fails.length)} ${fails.length === 1 ? 'combinação' : 'combinações'} que viram Lodo</small></h3>
      ${fails.length
        ? `<ul class="grimoire-list">${fails.map(([a, b]) => `<li>${img(a.id, 'mini-img')} ${esc(a.name)} + ${img(b.id, 'mini-img')} ${esc(b.name)}</li>`).join('')}</ul>`
        : '<p class="empty">Nenhum borrão por enquanto. Quando uma mistura desandar em Lodo, ela fica anotada aqui.</p>'}
    </section>`;
  return `
    <div class="book-top">
      <p class="book-progress">Receitas descobertas: <strong>${found}/${TOTAL()}</strong></p>
      <div class="xp-bar book-bar" aria-hidden="true"><span class="xp-fill" style="width:${Math.round((found / TOTAL()) * 100)}%"></span></div>
    </div>
    <div class="book-cats">${sections}</div>
    ${grimoire}`;
}

// ---------- Caderno de ingredientes: o que cada um é e faz (sem revelar receitas) ----------
export function buildIngredientsHTML(state, { intro = '' } = {}) {
  const stock = (state && state.stock) || {};
  const pages = INGREDIENTS.map((ing) => `
    <li class="ing-page" style="--ing:${BREW_COLOR[ing.id] || '#c87533'}">
      <div class="ing-page-art">${img(ing.id, 'ing-page-img')}</div>
      <div class="ing-page-text">
        <h3 class="ing-page-name">${esc(ing.name)} <span class="ing-page-quality">${esc(ing.quality)}</span></h3>
        <p class="ing-page-lore">${esc(ing.lore)}</p>
        <dl class="ing-page-facts">
          <dt>Propriedade</dt><dd>${esc(ing.property)}</dd>
          <dt>Ajuda em</dt><dd>${esc(ing.helps)}</dd>
        </dl>
        <p class="ing-page-meta">Elemento: ${esc(ing.element)} · ${coinIcon()} ${esc(ing.cost)} com a mercadora · na prateleira: <strong>${esc(stock[ing.id] ?? 0)}</strong></p>
      </div>
    </li>`).join('');
  return `
    ${intro}
    <ul class="ing-pages">${pages}</ul>`;
}

// ---------- Anotações: as dicas que já apareceram ----------
export function buildNotesHTML(state) {
  const seen = new Set((state && state.seenTips) || []);
  const known = TIPS.filter((t) => seen.has(t.id));
  const missing = TIPS.length - known.length;
  const items = known.map((t, i) => `
      <li class="note-item" style="--i:${i}">
        <span class="note-mark" aria-hidden="true">${i + 1}</span>
        <strong class="note-title">${esc(t.title)}.</strong> ${esc(t.text)}
      </li>`).join('');
  return `
    <div class="notes-page">
      <div class="notes-top">
        <p class="notes-count"><strong>${known.length}/${TIPS.length}</strong> anotadas</p>
      </div>
      <div class="notes-body">
        ${known.length ? `<ol class="notes">${items}</ol>` : '<p class="notes-empty">Nada anotado ainda. As dicas aparecem enquanto você atende.</p>'}
        ${missing && known.length ? `<p class="notes-more">Faltam ${missing} ${missing === 1 ? 'anotação' : 'anotações'}: aparecem quando a situação acontecer.</p>` : ''}
      </div>
      <div class="notes-foot" aria-hidden="true"></div>
    </div>`;
}

export function createUI(root, handlers = {}) {
  const doc = root && root.nodeType === 9 ? root : (root && root.ownerDocument) || document;
  const byId = (id) => doc.getElementById(id);

  const els = {
    app: byId('app'),
    scene: byId('scene'),
    hud: byId('hud'),
    clock: byId('hud-clock'),
    ledger: byId('ledger'),
    sound: byId('sound-toggle'),
    customer: byId('customer'),
    estoque: byId('estoque'),
    balcaoVela: byId('balcao-vela'),
    talk: byId('talk'),
    queue: byId('queue'),
    shelfCount: byId('shelf-count'),
    cauldron: byId('cauldron'),
    result: byId('result'),
    hand: byId('hand'),
    quick: byId('quick'),
    shelf: byId('shelf'),
    tools: byId('tools'),
    merchant: byId('merchant'),
    book: byId('book'),
    live: byId('live-region'),
    victory: byId('victory-dialog'),
    sheets: Object.fromEntries(SHEETS.map((s) => [s, byId(`sheet-${s}`)])),
  };

  // altura ocupada pela caixa de fala: no celular o balcão fica logo acima dela (v1.25)
  if (els.talk && els.scene && typeof ResizeObserver !== 'undefined') {
    const medir = () => {
      const t = els.talk.getBoundingClientRect(); const sc = els.scene.getBoundingClientRect();
      els.scene.style.setProperty('--talk-h', `${Math.max(0, Math.round(sc.bottom - t.top))}px`);
    };
    new ResizeObserver(medir).observe(els.talk);
    if (doc.defaultView) doc.defaultView.addEventListener('resize', medir);
  }

  const ui = {
    selection: [null, null],
    state: null,
    lastHint: null,
    lastPair: null,
    bookTab: 'receitas', // aba do livro: receitas ou ingredientes
    currentId: null,     // pedido (cliente) no balcão
    currentIndex: 0,
    shownKey: null,      // cliente desenhado no balcão (para a animação de chegada)
    farewell: null,      // { customerId, line, reward } cliente satisfeito saindo
    reaction: null,      // { orderId, line } cliente triste com o frasco errado
    sheet: null,
    sheetSeq: 0,   // conta as aberturas de folhas (contexto das dicas)
    tipCtx: {},    // dica -> contexto em que ela está aparecendo agora
    sheetOpener: null,
    toastTimer: 0,
    toastWrite: 0,
    timers: [],
    dialogOpener: null,
    potDay: null,  // dia em que o caldeirão já foi aberto (a manícula some)
  };

  const cache = new Map();

  function call(name, ...args) {
    const fn = handlers && handlers[name];
    if (typeof fn === 'function') {
      try { fn(...args); } catch (err) { console.error(`[ui] handler ${name} falhou`, err); }
    }
  }

  function setHTML(el, html) {
    if (!el) return;
    if (cache.get(el) === html) return; // nada mudou: preserva DOM e foco
    cache.set(el, html);
    el.innerHTML = html;
  }

  function later(fn, ms) { ui.timers.push(setTimeout(fn, ms)); }

  // Imagens fixas do HTML (botões do topo, caldeirão do balcão).
  for (const im of doc.querySelectorAll('img[data-art]')) im.src = itemArt(im.dataset.art);

  // ---------- foco ----------
  function captureFocus() {
    const active = doc.activeElement;
    if (!active || !active.dataset || !active.dataset.action) return null;
    const box = active.closest('dialog, .scene');
    return {
      el: active,
      action: active.dataset.action,
      id: active.dataset.id ?? null,
      slot: active.dataset.slot ?? null,
      heading: box ? box.querySelector('.sheet-title') : null,
    };
  }

  function restoreFocus(key) {
    if (!key) return;
    if (key.el.isConnected && doc.activeElement === key.el && !key.el.disabled) return;
    let sel = `[data-action="${CSS.escape(key.action)}"]`;
    if (key.id !== null) sel += `[data-id="${CSS.escape(key.id)}"]`;
    if (key.slot !== null) sel += `[data-slot="${CSS.escape(key.slot)}"]`;
    const scope = (ui.sheet && els.sheets[ui.sheet]) || els.app || doc;
    const target = scope.querySelector(sel);
    if (target && !target.disabled && !target.closest('[hidden]')) target.focus({ preventScroll: true });
    else if (key.heading && key.heading.isConnected) key.heading.focus({ preventScroll: true });
  }

  // ---------- pedidos / cliente no balcão ----------
  function customerOf(id) {
    if (id === MERCHANT.id) return MERCHANT;
    return CUSTOMERS.find((c) => c.id === id) || { id, name: 'Cliente', icon: '' };
  }

  function currentOrder(state) {
    const orders = state.orders || [];
    if (!orders.length) return null;
    let o = orders.find((x) => x.id === ui.currentId);
    if (!o) o = orders[Math.min(ui.currentIndex, orders.length - 1)] || orders[0];
    ui.currentId = o.id;
    ui.currentIndex = orders.indexOf(o);
    return o;
  }

  const isNight = (state) => state.phase === 'closed';

  function renderHud(state) {
    const lp = getLevelProgress(state.xp || 0);
    const pct = Math.max(0, Math.min(100, Math.round((lp.ratio || 0) * 100)));
    const found = (state.discovered || []).length;
    const best = state.stats && Number.isFinite(state.stats.bestCoins) ? state.stats.bestCoins : state.coins;
    const plan = state.plan || { total: 0, served: 0 };
    setHTML(els.hud, `
      <div class="hud-item hud-day" title="${isNight(state) ? 'Loja fechada: a mercadora está na porta' : `Clientes atendidos hoje: ${plan.served} de ${plan.total}`}">
        <span>Dia <strong class="hud-value">${esc(state.day || 1)}</strong></span>
        <small class="hud-sub">${isNight(state) ? 'loja fechada' : `${esc(plan.served)}/${esc(plan.total)} clientes`}</small>
        <small class="hud-sub-lv">nível ${esc(lp.level)}</small>
      </div>
      <div class="hud-item hud-coins" title="Recorde: ${esc(best)} moedas">
        ${coinIcon()}<strong class="hud-value">${esc(state.coins)}</strong><span class="sr-only"> moedas</span>
      </div>
      <div class="hud-item hud-level">
        <span>Nível <strong class="hud-value">${esc(lp.level)}</strong></span>
        <div class="xp-bar" role="progressbar" aria-label="Experiência rumo ao nível ${esc(lp.level + 1)}"
             aria-valuemin="0" aria-valuemax="${esc(lp.needed)}" aria-valuenow="${esc(lp.current)}"
             aria-valuetext="${esc(lp.current)} de ${esc(lp.needed)} XP">
          <span class="xp-fill" style="width:${pct}%"></span>
        </div>
      </div>
      <div class="hud-item hud-rep" title="${esc(fameTitle(state.reputation || 0))}">
        <span>Fama <strong class="hud-value">${esc(state.reputation || 0)}</strong></span>
        <small class="hud-sub hud-tier">${esc(fameTier(state.reputation || 0).name)}</small>
      </div>
      <div class="hud-item hud-recipes" title="Receitas no caderno">
        <span>Receitas <strong class="hud-value">${found}/${TOTAL()}</strong></span>
      </div>`);
  }

  // Fama em faixas: o que a faixa atual rende e quanto falta para a próxima.
  function fameTitle(rep) {
    const t = fameTier(rep);
    const perks = [];
    if (t.coins) perks.push(`+${coins(t.coins)} por pedido`);
    if (t.patience) perks.push(`clientes ${Math.round(t.patience * 100)}% mais pacientes`);
    const now = `${t.name}${perks.length ? `: ${perks.join(', ')}` : ''}.`;
    const next = t.next ? ` Faltam ${t.next.min - rep} de fama para "${t.next.name}".` : '';
    return `${now}${next} Sobe 1 a cada pedido certo; cai 1 por frasco errado ou cliente mandado embora, e 2 quando o cliente cansa de esperar.`;
  }

  // Vela da paciência: só aparece quando o cliente tem pressa (do dia 3 em diante).
  // quadro da vela que derrete (0 = inteira, 7 = toco), arte em assets/fx/vela-paciencia.webp
  const velaFrame = (left) => Math.max(0, Math.min(7, Math.floor((1 - left) * 8)));
  const patienceClass = (left) => (left < 0.25 ? ' is-low' : left < CONFIG.TIP_FAST_RATIO ? ' is-half' : '');
  function patienceHTML(order, cls = 'patience') {
    if (!order || !(order.patience > 0)) return '';
    const left = patienceLeft(order);
    return `<span class="${cls}${patienceClass(left)}" data-patience="${esc(order.id)}" data-vela="${velaFrame(left)}" style="--left:${left.toFixed(3)}"
      role="meter" aria-label="Paciência" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(left * 100)}"><span class="patience-fill"></span></span>`;
  }
  function moodBucket(order) {
    if (!order || !(order.patience > 0)) return 0;
    const left = patienceLeft(order);
    return left < 0.25 ? 2 : left < CONFIG.TIP_FAST_RATIO ? 1 : 0;
  }

  // Chamado a cada meio segundo pelo relógio do jogo: atualiza as velas sem redesenhar a loja.
  function updatePatience(state) {
    if (!state) return;
    ui.state = state;
    const byId = new Map((state.orders || []).map((o) => [o.id, o]));
    const merchant = merchantCandle(state);
    if (merchant) byId.set(merchant.id, merchant);
    for (const el of doc.querySelectorAll('[data-patience]')) {
      const o = byId.get(el.dataset.patience);
      if (!o) continue;
      const left = patienceLeft(o);
      el.style.setProperty('--left', left.toFixed(3));
      el.dataset.vela = String(velaFrame(left));
      el.setAttribute('aria-valuenow', String(Math.round(left * 100)));
      el.classList.toggle('is-low', left < 0.25);
      el.classList.toggle('is-half', left >= 0.25 && left < CONFIG.TIP_FAST_RATIO);
    }
    // o cliente do balcão mudou de humor (meia vela, quase apagando): redesenha a cena
    const cur = ui.farewell ? null : isNight(state) ? merchantCandle(state) : currentOrder(state);
    const key = cur ? `${cur.id}:${moodBucket(cur)}` : '';
    if (key !== ui.moodKey) render(state);
  }

  // Qual cliente está no balcão agora (é ele quem perde paciência na velocidade normal).
  function counterId() {
    const st = ui.state;
    if (!st || ui.farewell || isNight(st)) return null;
    const o = currentOrder(st);
    return o ? o.id : null;
  }

  // Dicas: cada uma aparece uma vez (num contexto: um cliente, uma noite, uma abertura de folha)
  // e fica guardada nas Anotações. Num mesmo contexto ela continua visível até ele acabar.
  function tipActive(id, ctx) {
    if (ui.tipCtx[id] !== undefined) return ui.tipCtx[id] === ctx;
    const seen = ui.state && (ui.state.seenTips || []).includes(id);
    if (seen) return false;
    ui.tipCtx[id] = ctx;
    if (typeof handlers.onTipSeen === 'function') queueMicrotask(() => handlers.onTipSeen(id));
    return true;
  }
  function pickTip(ids, ctx) {
    const list = ids.filter(Boolean);
    const now = list.find((id) => ui.tipCtx[id] === ctx);
    if (now) return now;
    const seen = new Set((ui.state && ui.state.seenTips) || []);
    const next = list.find((id) => ui.tipCtx[id] === undefined && !seen.has(id));
    return next && tipActive(next, ctx) ? next : null;
  }
  function tipHTML(id) {
    const t = id && TIPS.find((x) => x.id === id);
    if (!t) return '';
    return `<p class="tip-once"><span class="tip-tag">Anotado no caderno</span> ${esc(t.text)}</p>`;
  }
  const sheetCtx = (name) => (ui.sheet === name ? `${name}-${ui.sheetSeq}` : null);

  // Relógio do dia: o disco gira do nascer do sol (primeiro cliente) ao poente; à noite, a lua sobe.
  function renderClock(state) {
    if (!els.clock) return;
    const plan = state.plan || { total: 0, served: 0 };
    const night = isNight(state);
    const frac = plan.total ? Math.min(1, (plan.served || 0) / plan.total) : 0;
    const base = night ? 180 : -75 + 150 * frac;
    // o disco só anda para a frente: da noite para a manhã seguinte ele completa a volta
    const angle = ui.clockAngle == null ? base : base + 360 * Math.ceil((ui.clockAngle - 0.01 - base) / 360);
    if (angle !== ui.clockAngle) {
      ui.clockAngle = angle;
      els.clock.style.setProperty('--clock-turn', `${angle}deg`);
    }
    const label = night ? `Noite do dia ${state.day || 1}: loja fechada`
      : `Dia ${state.day || 1}: ${plan.served || 0} de ${plan.total || 0} clientes atendidos`;
    if (els.clock.getAttribute('aria-label') !== label) { els.clock.setAttribute('aria-label', label); els.clock.title = label; }
    els.clock.classList.toggle('is-night', night);
  }

  // Livro-caixa do fim do dia: as linhas aparecem uma a uma, e o selo fecha a página.
  function renderLedger(state) {
    if (!els.ledger) return;
    if (!isNight(state)) { setHTML(els.ledger, ''); return; }
    const p = state.plan || {};
    const served = Math.max(0, (p.served || 0) - (p.sentAway || 0) - (p.gaveUp || 0));
    const found = Math.max(0, (state.discovered || []).length - (p.startFound || 0));
    const byPotion = new Map();
    for (const d of p.delivered || []) {
      const e = byPotion.get(d.potionId) || { n: 0, coins: 0 };
      e.n += 1; e.coins += d.reward || 0; byPotion.set(d.potionId, e);
    }
    const earned = p.earned || 0;
    const start = p.startCoins || 0;
    const end = state.coins || 0;
    const upkeep = p.upkeep || 0;
    const paid = p.paid || 0;
    const tips = p.tips || 0;
    const perfect = p.perfect || 0;
    const other = end - start - earned - tips - perfect + paid;
    const rep = (state.reputation || 0) - (p.startRep || 0);
    const sign = (n) => (n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '0');
    const rows = [];
    const row = (qty, label, coins = '', cls = '') => rows.push({ qty, label, coins, cls });
    row(served, `${served === 1 ? 'Cliente atendido' : 'Clientes atendidos'} <span class="lstamp lstamp-ok" aria-hidden="true"></span>`);
    row(p.sentAway || 0, `${p.sentAway === 1 ? 'Mandado embora' : 'Mandados embora'} <span class="lstamp lstamp-out" aria-hidden="true"></span>`);
    if (p.gaveUp) row(p.gaveUp, `${p.gaveUp === 1 ? 'Cansou de esperar' : 'Cansaram de esperar'} <span class="lstamp lstamp-out" aria-hidden="true"></span>`);
    if (found) row(found, `${found === 1 ? 'Receita nova no caderno' : 'Receitas novas no caderno'} <span class="lstamp lstamp-new" aria-hidden="true"></span>`);
    let listed = 0;
    for (const [id, e] of byPotion) {
      if (listed++ >= 6) break;
      const r = getRecipe(id);
      row(`${e.n}×`, `${img(id, 'ledger-img')} ${esc(r ? r.name : id)}`, `+${e.coins}`, 'is-item');
    }
    if (!byPotion.size) row('', '<em>Nenhuma poção entregue hoje</em>', '', 'is-item');
    row('', 'Bolsa ao abrir a loja', String(start), 'is-sum');
    row('', 'Ganho com pedidos', sign(earned), 'is-sum');
    if (tips) row('', 'Gorjetas por atender rápido', sign(tips), 'is-sum');
    if (perfect) row('', 'Dia perfeito: ninguém saiu sem poção', sign(perfect), 'is-sum');
    if (other) row('', other > 0 ? 'Vendas na prateleira' : 'Gastos do dia', sign(other), 'is-sum');
    if (paid) row('', paid > upkeep ? `Aluguel do dia (${upkeep}) e atrasado` : 'Aluguel do dia', sign(-paid), 'is-sum is-cost');
    else if (upkeep) row('', 'Aluguel do dia: ficou na conta', '0', 'is-sum is-cost');
    if (state.debt) row('', 'Ficou na conta do senhorio', String(state.debt), 'is-sum is-cost');
    row('', 'Fama do dia', sign(rep), 'is-sum is-rep');
    const lines = rows.map((r, i) => `
      <li class="ledger-row ${r.cls}" style="--i:${i}">
        <span class="ledger-qty">${esc(r.qty)}</span>
        <span class="ledger-label">${r.label}</span>
        <span class="ledger-coins">${esc(r.coins)}</span>
      </li>`).join('');
    setHTML(els.ledger, `
      <p class="ledger-day">Fechamento do dia ${esc(state.day || 1)}</p>
      <div class="ledger-page" style="--n:${rows.length}">
        <ol class="ledger-rows">${lines}</ol>
        <p class="ledger-total" style="--i:${rows.length}">
          <span>Saldo</span>
          <span class="ledger-total-value">${coinIcon()} ${esc(end)}</span>
        </p>

        <span class="ledger-seal" style="--i:${rows.length + 1}" title="Dia fechado" aria-hidden="true"></span>
      </div>
      <div class="ledger-actions">
        <button type="button" class="btn btn-primary" data-action="${isDemoOver(state) ? 'demo-end' : 'close-sheet'}">${state.landlord ? 'Atender o senhorio' : isDemoOver(state) ? 'Ler a carta que chegou' : 'Chamar a mercadora'}</button>
      </div>`);
  }

  function showLedger() { if (ui.state && isNight(ui.state)) openSheet('caixa'); }

  function renderSound(state) {
    if (!els.sound) return;
    const on = !!state.sound;
    els.sound.setAttribute('aria-pressed', on ? 'true' : 'false');
    els.sound.classList.toggle('is-on', on);
    els.sound.title = on ? 'Desligar efeitos sonoros' : 'Ligar efeitos sonoros';
    const label = els.sound.querySelector('.sound-label');
    const text = on ? 'Som ligado' : 'Som desligado';
    if (label && label.textContent !== text) label.textContent = text;
  }

  function potionsOnShelf(state) {
    const inv = state.inventory || {};
    return RECIPES.filter((r) => (inv[r.id] || 0) > 0);
  }

  // estoque: cada poção pronta aparece de pé na estante vazia do fundo (v1.25)
  const ESTOQUE_LINHAS = [30.4, 41.5, 53.2, 65.3];   // base de cada tábua, em % da altura do fundo
  const ESTOQUE_X0 = 71.2; const ESTOQUE_X1 = 98.2;   // parte livre das tábuas, em % da largura
  const ESTOQUE_POR_LINHA = 6; const ESTOQUE_POR_TIPO = 4;
  function renderEstoque(state) {
    if (!els.estoque) return;
    const inv = state.inventory || {};
    const frascos = [];
    for (const r of potionsOnShelf(state)) for (let i = 0; i < Math.min(inv[r.id], ESTOQUE_POR_TIPO); i += 1) frascos.push(r.id);
    const max = ESTOQUE_LINHAS.length * ESTOQUE_POR_LINHA;
    const passo = (ESTOQUE_X1 - ESTOQUE_X0) / ESTOQUE_POR_LINHA;
    setHTML(els.estoque, frascos.slice(0, max).map((id, i) => {
      const linha = Math.floor(i / ESTOQUE_POR_LINHA);
      const x = ESTOQUE_X0 + passo * ((i % ESTOQUE_POR_LINHA) + 0.5);
      const src = itemArt(id);
      return src ? `<span class="estoque-frasco" style="left:${x.toFixed(2)}%;top:${ESTOQUE_LINHAS[linha]}%"><img src="${src}" alt="" draggable="false"></span>` : '';
    }).join(''));
  }

  function renderCustomer(state, order) {
    let customerId;
    let mood = 'neutro';
    let key;
    if (ui.farewell) {
      customerId = ui.farewell.customerId;
      mood = ui.farewell.mood || 'feliz';
      key = ui.shownKey;
    } else if (isNight(state) && state.landlord) {
      // v1.27 — o senhorio ainda não tem retrato: o balcão fica vazio e a fala dele aparece na caixa
      customerId = null;
      key = `senhorio-${state.day}`;
    } else if (isNight(state) && isDemoOver(state)) {
      // v1.28 — fim da demo: a mercadora não vem; chega uma carta da Mestra
      customerId = null;
      key = `demo-fim-${state.day}`;
    } else if (isNight(state)) {
      customerId = state.merchantGone ? null : MERCHANT.id;
      key = state.merchantGone ? `noite-${state.day}-vazia` : `noite-${state.day}`;
      if (moodBucket(merchantCandle(state)) === 2) mood = 'triste';
    } else if (order) {
      customerId = order.customerId;
      key = order.id;
      if (ui.reaction && ui.reaction.orderId === order.id) mood = 'triste';
      else if (moodBucket(order) === 2) mood = 'triste'; // a vela está quase apagando
    } else {
      customerId = GREETER;
      key = 'greeter';
    }
    const src = customerId ? customerArt(customerId, mood) : '';
    const leaving = ui.farewell && ui.farewell.leaving;
    setHTML(els.customer, src
      ? `<img class="customer-img mood-${mood}" src="${src}" alt="" draggable="false">`
      : '');
    els.customer.classList.toggle('is-leaving', !!leaving);
    if (key !== ui.shownKey) {
      ui.shownKey = key;
      // reinicia a animação de chegada (o cliente vem dos fundos até o balcão)
      els.customer.classList.remove('is-entering');
      void els.customer.offsetWidth;
      els.customer.classList.add('is-entering');
      els.talk.classList.remove('is-opening');
      void els.talk.offsetWidth;
      els.talk.classList.add('is-opening');
    }
  }

  // v1.27 — o senhorio no balcão: paga a dívida inteira ou entrega a chave (fim de jogo).
  function landlordTalk(state) {
    const debt = state.debt || 0;
    const coinsNow = state.coins || 0;
    const missing = Math.max(0, debt - coinsNow);
    const shelf = shelfValue(state);
    const canPay = coinsNow >= debt;
    const canRaise = !canPay && coinsNow + shelf >= debt;
    return `
      <div class="talk-box is-night is-sad talk-landlord">
        <p class="talk-day">Noite do dia ${esc(state.day)}</p>
        <div class="talk-head"><p id="talk-name" class="talk-name">${esc(LANDLORD.name)}</p></div>
        <p class="talk-line">“${esc(canPay
          ? `Três noites sem aluguel, boticária. São ${debt} moedas, e eu vejo que a bolsa alcança.`
          : `Três noites sem aluguel, boticária. São ${debt} moedas. Se não tiver, vou precisar da chave da loja.`)}”</p>
        <p class="talk-note talk-debt">Aluguel atrasado: <strong>${coinIcon()} ${esc(debt)}</strong> · na bolsa: <strong>${esc(coinsNow)}</strong>${missing ? ` · faltam <strong>${esc(missing)}</strong>` : ''}</p>
        ${canRaise ? `<p class="talk-note">Os frascos da prateleira valem ${coinIcon()} ${esc(shelf)} vendidos no balcão: dá para juntar o que falta.</p>` : ''}
        ${!canPay && !canRaise ? `<p class="talk-note">Nem vendendo a prateleira inteira (${coinIcon()} ${esc(shelf)}) a bolsa alcança.</p>` : ''}
        <div class="talk-actions">
          ${canPay ? `<button type="button" class="btn btn-primary" data-action="pay-landlord">Pagar ${esc(debt)} moedas</button>` : ''}
          ${canRaise ? '<button type="button" class="btn btn-primary" data-action="open-sheet" data-id="prateleira">Vender frascos da prateleira</button>' : ''}
          ${!canPay ? '<button type="button" class="btn btn-danger" data-action="evict">Entregar a chave</button>' : ''}
          <button type="button" class="btn btn-small btn-quiet" data-action="open-sheet" data-id="caixa">Ver o livro-caixa</button>
        </div>
      </div>`;
  }

  function debtNote(state) {
    const debt = state.debt || 0;
    if (!debt) return '';
    const n = closesUntilLandlord(state);
    return `<p class="talk-note talk-debt">Aluguel atrasado: <strong>${coinIcon()} ${esc(debt)}</strong>. A bolsa paga o atrasado junto com o aluguel no próximo fechamento. ${n === 1 ? 'Se ainda dever amanhã à noite, o senhorio vem cobrar.' : `Se continuar devendo por mais ${esc(n)} fechamentos, o senhorio vem cobrar.`}</p>`;
  }

  // v1.28 — última noite da demo: no lugar da mercadora, uma carta da Mestra Benvinda.
  function demoNightTalk(state) {
    const p = state.plan || {};
    const served = (p.served || 0) - (p.sentAway || 0) - (p.gaveUp || 0);
    const diff = (state.coins || 0) - (p.startCoins || 0);
    return `
      <div class="talk-box is-night talk-demo-fim">
        <p class="talk-day">Fim do dia ${esc(state.day)}</p>
        <p class="day-sum-line"><strong>${esc(served)}</strong> de ${esc(p.total || 0)} atendidos · bolsa ${diff >= 0 ? '+' : '−'}${esc(Math.abs(diff))} ${coinIcon()}
          <button type="button" class="btn btn-small btn-quiet" data-action="open-sheet" data-id="caixa">Ver o livro-caixa</button></p>
        ${p.perfect ? `<p class="talk-note talk-perfect">Dia perfeito! Ninguém saiu sem poção: +${esc(p.perfect)} ${coinIcon()} e +${esc(CONFIG.PERFECT_FAME)} de fama.</p>` : ''}
        <p class="talk-line">A carroça da Zuleica não veio hoje. No lugar dela, um menino entregou uma carta amarrada com barbante, com cheiro de maresia e um grãozinho de areia no lacre.</p>
        <div class="talk-actions">
          <button type="button" class="btn btn-primary" data-action="demo-end">Ler a carta da Mestra</button>
        </div>
      </div>`;
  }

  function nightTalk(state) {
    if (state.landlord) return landlordTalk(state);
    if (isDemoOver(state)) return demoNightTalk(state);
    const p = state.plan || {};
    const served = (p.served || 0) - (p.sentAway || 0) - (p.gaveUp || 0);
    const diff = (state.coins || 0) - (p.startCoins || 0);
    const aid = ui.aid === state.day;
    const tomorrow = Math.min(CONFIG.DAY_MAX_CUSTOMERS, (p.total || 0) + CONFIG.DAY_GROWTH);
    const wait = state.relaxed ? 0 : patienceForDay((state.day || 1) + 1);
    const tier = fameTier(state.reputation || 0);
    const waitS = wait ? Math.round((wait * (1 + (tier.patience || 0))) / 1000) : 0;
    const waitText = waitS >= 60 ? `${Math.floor(waitS / 60)} min${waitS % 60 ? ` e ${waitS % 60} s` : ''}` : `${waitS} s`;
    const merchant = merchantCandle(state);
    const hurry = moodBucket(merchant) === 2;
    if (merchant) ui.moodKey = `${merchant.id}:${moodBucket(merchant)}`;
    return `
      <div class="talk-box is-night${hurry ? ' is-sad' : ''}">
        <p class="talk-day">Fim do dia ${esc(state.day)}</p>
        <p class="day-sum-line"><strong>${esc(served)}</strong> de ${esc(p.total || 0)} atendidos · bolsa ${diff >= 0 ? '+' : '−'}${esc(Math.abs(diff))} ${coinIcon()}
          <button type="button" class="btn btn-small btn-quiet" data-action="open-sheet" data-id="caixa">Ver o livro-caixa</button></p>
        ${state.merchantGone
          ? '<p class="talk-note talk-gone">A carroça da mercadora já virou a esquina. Ela volta amanhã à noite; hoje não há onde comprar ingredientes.</p>'
          : `<div class="talk-head"><p id="talk-name" class="talk-name">${esc(MERCHANT.name)}</p></div>
        ${merchant ? `<p class="talk-temper">Espera um bom tempo, mas segue viagem antes de a vela apagar${hurry ? '' : ' · o relógio dela para com a banca aberta'}</p>` : ''}
        <p class="talk-line${hurry ? ' talk-hurry' : ''}">“${esc(hurry ? pickLine(MERCHANT_HURRY_LINES, `pressa-${state.day}`) : pickLine(MERCHANT_LINES, `noite-${state.day}`))}”</p>`}
        ${p.perfect ? `<p class="talk-note talk-perfect">Dia perfeito! Ninguém saiu sem poção: +${esc(p.perfect)} ${coinIcon()} e +${esc(CONFIG.PERFECT_FAME)} de fama.</p>` : ''}
        ${debtNote(state)}
        ${aid ? '<p class="talk-note">A mercadora deixou um punhado de ingredientes fiado para você não fechar as portas.</p>' : ''}
        <div class="talk-divider" aria-hidden="true"></div>
        <p class="talk-note">Amanhã vêm <strong>${esc(tomorrow)}</strong> clientes${wait ? `, e cada um espera cerca de <strong>${esc(waitText)}</strong> no balcão` : ', sem pressa nenhuma'}.</p>
        ${tipHTML(pickTip(['mercadora', (p.upkeep || upkeepForDay(state.day + 1)) ? 'despesas' : null, wait && (state.discovered || []).length ? 'preparar-antes' : null, (state.reputation || 0) >= 5 ? 'fama' : null], `noite-${state.day}`))}
        <div class="talk-actions">
          <button type="button" class="btn btn-primary" data-action="open-sheet" data-id="mercador"${disabledAttr(!!state.merchantGone, 'A mercadora já foi embora: volta amanhã à noite')}>Comprar ingredientes</button>
          <button type="button" class="btn" data-action="open-sheet" data-id="caldeirao">Preparar poções</button>
          <button type="button" class="btn" data-action="next-day">Abrir a loja: dia ${esc((state.day || 1) + 1)}</button>
        </div>
      </div>`;
  }

  function renderTalk(state, order) {
    ui.moodKey = '';
    if (ui.farewell) {
      const f = ui.farewell;
      const c = customerOf(f.customerId);
      setHTML(els.talk, `
        <div class="talk-box ${f.mood === 'triste' ? 'is-sad' : 'is-happy'}">
          <p id="talk-name" class="talk-name">${esc(c.name)}</p>
          <p class="talk-line">“${esc(f.line)}”</p>
          ${f.reward != null
            ? `<p class="talk-pay">${coinIcon()} +${esc(f.reward + (f.tip || 0))}${f.bonus ? ` (com ${esc(f.bonus)} de bônus pela novidade)` : ''}${f.tip ? ` (com ${esc(f.tip)} de gorjeta pela rapidez)` : ''} · +${esc(f.xp)} XP · +1 de fama</p>`
            : `<p class="talk-pay is-loss">${f.merchant ? 'Fechou a banca e seguiu viagem até amanhã à noite' : f.walkout ? `Cansou de esperar · −${esc(f.fame)} de fama` : 'Foi embora sem poção · −1 de fama'}</p>`}
        </div>`);
      return;
    }
    if (isNight(state)) { setHTML(els.talk, nightTalk(state)); return; }
    if (!order) {
      const c = customerOf(GREETER);
      setHTML(els.talk, `
        <div class="talk-box">
          <p id="talk-name" class="talk-name">${esc(c.name)}, o gato da loja</p>
          <p class="talk-line">“Miau. Ninguém no balcão por enquanto. Aproveite para mexer no caldeirão.”</p>
          <div class="talk-actions">
            <button type="button" class="btn btn-primary" data-action="open-sheet" data-id="caldeirao">Abrir o caldeirão</button>
          </div>
        </div>`);
      return;
    }
    const c = customerOf(order.customerId);
    const potion = getItem(order.potionId);
    const clues = getOrderClues(order);
    const revealed = isOrderRevealed(order);
    const misses = order.misses || 0;
    const bonus = order.novel ? CONFIG.NOVEL_BONUS : 0;
    const reward = orderReward(state, order.potionId) + bonus;
    const potions = potionsOnShelf(state);
    const sad = ui.reaction && ui.reaction.orderId === order.id;
    const lines = clues.map((txt, i) => `<p class="talk-line">${i ? '<span class="talk-more">E tem mais:</span> ' : ''}“${esc(txt)}”</p>`).join('');
    const known = (state.discovered || []).includes(order.potionId);
    const hurry = moodBucket(order) === 2;
    ui.moodKey = `${order.id}:${moodBucket(order)}`;
    const timed = order.patience > 0;
    setHTML(els.talk, `
      <div class="talk-box${sad || hurry ? ' is-sad' : ''}${timed ? ' is-timed' : ''}">
        ${order.novel ? `<p class="stamp-novel" title="Pedido de uma receita que não estava no caderno">Receita nova! +${esc(bonus)}</p>` : ''}
        <div class="talk-head"><p id="talk-name" class="talk-name">${esc(c.name)}</p></div>
        ${timed && c.temper ? `<p class="talk-temper" title="Cada freguês espera de um jeito">${esc(c.temper)}${c.patience > 1 ? ' · espera mais' : c.patience < 1 ? ' · espera menos' : ''}</p>` : ''}
        ${sad ? `<p class="talk-line talk-react">“${esc(lineFor(c.id, 'sad', `${order.id}-${misses}`))}”</p>`
          : hurry ? `<p class="talk-greet talk-hurry">${esc(pickLine(HURRY_LINES, order.id))}</p>`
          : `<p class="talk-greet">${esc(lineFor(c.id, 'greet', order.id) || 'Boa tarde!')}</p>`}
        ${lines}
        ${order.novel && !known ? `<p class="talk-greet talk-novel">${esc(pickLine(NOVEL_HINTS, order.id))}</p>` : ''}
        ${revealed && potion ? `<p class="talk-want">Quero: ${img(potion.id, 'mini-img')} <strong>${esc(potion.name)}</strong></p>` : ''}

        <div class="talk-divider" aria-hidden="true"></div>
        <p class="talk-pay">Paga ${coinIcon()} <strong>${esc(reward)}</strong> e +${esc(CONFIG.XP_DELIVERY + (order.novel ? CONFIG.NOVEL_XP : 0))} XP${timed ? `<span class="talk-tip${moodBucket(order) ? ' is-gone' : ''}"> · +${esc(CONFIG.TIP_FAST)} de gorjeta se for rápido</span>` : ''}</p>
        <div class="talk-actions">
          <button type="button" class="btn btn-primary" data-action="open-sheet" data-id="prateleira"
            ${disabledAttr(!potions.length, 'A prateleira está vazia: prepare uma poção no caldeirão')}>Entregar poção</button>
          <button type="button" class="btn" data-action="open-sheet" data-id="caldeirao">Misturar no caldeirão</button>
          <button type="button" class="btn btn-small btn-quiet" data-action="dismiss" data-id="${esc(order.id)}"
            aria-label="Mandar ${esc(c.name)} embora sem poção (−1 de fama)" title="Sem ingredientes ou sem ideia? O cliente vai embora e você perde 1 de fama.">Mandar embora</button>
        </div>
        ${tipHTML(pickTip([misses ? 'erro-revela' : null, timed ? 'paciencia' : null, 'pistas', order.novel ? 'receita-nova' : null, !potions.length ? 'prateleira-vazia' : null, 'mandar-embora'], `pedido-${order.id}`))}
      </div>`);
  }

  function renderQueue(state, order) {
    const others = isNight(state) ? [] : (state.orders || []).filter((o) => !order || o.id !== order.id);
    const plan = state.plan || { total: 0, arrived: 0 };
    const coming = isNight(state) ? 0 : Math.max(0, plan.total - plan.arrived);
    els.queue.closest('.queue-wrap').hidden = (!others.length && !coming) || !!ui.farewell;
    setHTML(els.queue, others.map((o) => {
      const c = customerOf(o.customerId);
      return `<li><button type="button" class="queue-btn" data-action="call" data-id="${esc(o.id)}"
        aria-label="Chamar ${esc(c.name)} ao balcão" title="${esc(c.name)}${o.patience > 0 && c.temper ? ` · ${esc(c.temper)}` : ''}">
        <img src="${customerArt(o.customerId, 'neutro')}" alt="" draggable="false">${patienceHTML(o, 'patience patience-mini')}</button></li>`;
    }).join('') + (coming ? `<li class="queue-more" title="Clientes que ainda vão chegar hoje">+${esc(coming)} <span class="sr-only">ainda vão chegar</span></li>` : ''));
  }

  function renderScene(state) {
    const order = isNight(state) ? null : currentOrder(state);
    els.scene.classList.toggle('is-night', isNight(state) && (!ui.farewell || !!ui.farewell.merchant));
    // manícula apontando o caldeirão até ele ser aberto no dia (v1.22)
    els.scene.classList.toggle('pot-apontar', !isNight(state) && !ui.farewell && ui.potDay !== state.day);
    renderCustomer(state, order);
    renderTalk(state, order);
    renderQueue(state, order);
    // vela da paciência em pé no balcão (v1.25): cliente de dia, mercadora à noite
    const lit = ui.farewell ? null : isNight(state) ? (state.merchantGone ? null : merchantCandle(state)) : order;
    if (els.balcaoVela) setHTML(els.balcaoVela, patienceHTML(lit, 'patience patience-mesa'));
    renderEstoque(state);
    const n = potionsOnShelf(state).reduce((sum, r) => sum + (state.inventory[r.id] || 0), 0) + ((state.inventory || {}).lodo || 0);
    if (els.shelfCount) {
      els.shelfCount.hidden = !n;
      els.shelfCount.textContent = String(n);
    }
  }

  // v1.27 — lembrete na banca: o aluguel de amanhã sai da bolsa ao fechar o dia
  function rentNote(state) {
    const rent = upkeepForDay((state.day || 1) + 1);
    const due = rent + (state.debt || 0);
    if (!due) return '';
    const short = (state.coins || 0) < due;
    return `<p class="shelf-ask rent-note${short ? ' is-short' : ''}">Guarde para o aluguel: amanhã, ao fechar, saem ${coinIcon()} <strong>${esc(due)}</strong>${state.debt ? ` (${esc(rent)} do dia + ${esc(state.debt)} atrasado)` : ''}. ${short ? 'A bolsa já está abaixo disso; o que vender amanhã ajuda a cobrir.' : ''}</p>`;
  }

  // ---------- banca da mercadora (fim do dia) ----------
  function renderMerchant(state) {
    const stock = state.stock || {};
    const here = isMerchantHere(state);
    const cards = INGREDIENTS.map((ing, i) => {
      const qty = stock[ing.id] ?? 0;
      const can1 = here && (state.coins || 0) >= ing.cost;
      const can5 = here && (state.coins || 0) >= ing.cost * 5;
      return `
      <li class="card ing-card${qty === 0 ? ' is-empty' : ''}" style="--i:${i};--ing:${BREW_COLOR[ing.id] || '#c87533'}">
        <div class="card-face">
          <span class="card-count" aria-hidden="true">${esc(qty)}</span>
          ${img(ing.id, 'card-img')}
          <span class="card-name">${esc(ing.name)}</span>
          <span class="card-quality">${esc(ing.quality)} · ${coinIcon()} ${esc(ing.cost)} cada</span>
        </div>
        <div class="card-btns">
          <button type="button" class="btn btn-small btn-coin" data-action="buy" data-id="${esc(ing.id)}" data-qty="1"
            aria-label="Comprar 1 ${esc(ing.name)} por ${esc(ing.cost)} moedas (tem ${esc(qty)})"${disabledAttr(!can1, here ? `A bolsa não alcança: custa ${ing.cost}` : 'A mercadora só vem no fim do dia')}>+1</button>
          <button type="button" class="btn btn-small btn-coin" data-action="buy" data-id="${esc(ing.id)}" data-qty="5"
            aria-label="Comprar 5 ${esc(ing.name)} por ${esc(ing.cost * 5)} moedas"${disabledAttr(!can5, here ? `A bolsa não alcança: custa ${ing.cost * 5}` : 'A mercadora só vem no fim do dia')}>+5</button>
        </div>
      </li>`;
    }).join('');
    // v1.26 — a mercadora também leva Lodo Instável (preço fixo, poucos por noite)
    const lodo = (state.inventory || {}).lodo || 0;
    const lodoMax = CONFIG.MERCHANT_SLUDGE_MAX ?? 3;
    const lodoPrice = CONFIG.MERCHANT_SLUDGE_PRICE ?? 3;
    const lodoLeft = merchantSludgeLeft(state);
    const lodoTaken = Math.min(lodoMax, Number(state.merchantSludge) || 0);
    const lodoWhy = !here ? 'A mercadora só vem no fim do dia'
      : !lodo ? 'Não há Lodo na prateleira'
      : 'A carroça já está cheia de Lodo por hoje';
    const lodoCard = here ? `
      <li class="card ing-card merchant-lodo${lodo === 0 ? ' is-empty' : ''}" style="--i:${INGREDIENTS.length};--ing:#5b4a2e">
        <div class="card-face">
          <span class="card-count" aria-hidden="true">${esc(lodo)}</span>
          ${img('lodo', 'card-img')}
          <span class="card-name">Lodo Instável</span>
          <span class="card-quality" title="A mercadora leva até ${esc(lodoMax)} Lodos por noite">${coinIcon()} ${esc(lodoPrice)} cada · ${esc(lodoTaken)}/${esc(lodoMax)}</span>
        </div>
        <div class="card-btns">
          <button type="button" class="btn btn-small btn-coin" data-action="sell-sludge"
            aria-label="Vender 1 Lodo Instável à mercadora por ${esc(lodoPrice)} moedas (tem ${esc(lodo)})"${disabledAttr(lodoLeft < 1, lodoWhy)}>Vender</button>
        </div>
      </li>` : '';
    const plan = state.plan || {};
    setHTML(els.merchant, `
      <p class="shelf-ask">${here
        ? `Compre o que vai precisar amanhã: vêm <strong>${esc(Math.min(CONFIG.DAY_MAX_CUSTOMERS, (plan.total || 0) + CONFIG.DAY_GROWTH))}</strong> clientes, e durante o dia não há onde comprar.`
        : isNight(state) ? 'A mercadora já seguiu viagem. Ela volta amanhã à noite.' : 'A mercadora só abre a banca no fim do dia.'} Bolsa: ${coinIcon()} <strong>${esc(state.coins)}</strong></p>
      ${here ? rentNote(state) : ''}
      <ul class="hand merchant-cards">${cards}${lodoCard}</ul>`);
  }

  // ---------- caldeirão ----------
  function slotHTML(index, ingId) {
    const ing = ingId ? getIngredient(ingId) : null;
    const n = index + 1;
    if (!ing) {
      return `<button type="button" class="slot is-empty" data-action="slot" data-slot="${index}"
        aria-label="Espaço ${n} vazio: escolha uma carta de ingrediente"><span class="slot-plus" aria-hidden="true">+</span></button>`;
    }
    return `<button type="button" class="slot card-mini" data-action="slot" data-slot="${index}" style="--ing:${BREW_COLOR[ing.id] || '#c87533'}"
      aria-label="Espaço ${n}: ${esc(ing.name)}. Clique para tirar" title="Clique para tirar">
      ${img(ing.id, 'slot-img')}<span class="slot-name">${esc(ing.name)}</span></button>`;
  }

  function renderCauldron(state) {
    const [a, b] = ui.selection;
    let ready = false;
    let reason;
    if (!a || !b) {
      reason = !a && !b
        ? 'Escolha 2 cartas de ingrediente.'
        : 'Falta 1 ingrediente: escolha mais uma carta.';
    } else {
      const check = canMix(state, a, b);
      ready = !!(check && check.ok);
      if (ready) {
        const ia = getIngredient(a); const ib = getIngredient(b);
        reason = a === b ? `Tudo pronto: vão 2 porções de ${ia.name}.` : `Tudo pronto: vão 1 ${ia.name} e 1 ${ib.name}.`;
        if (isKnownFailure(state, a, b)) reason += ' O grimório lembra: essa dupla já desandou em Lodo.';
      } else {
        reason = (check && check.error && check.error.message) || 'O caldeirão não aceita essa mistura agora.';
      }
    }
    const ca = a ? BREW_COLOR[a] : '#3b2a1c';
    const cb = b ? BREW_COLOR[b] : (a ? BREW_COLOR[a] : '#3b2a1c');
    const hasAny = !!(a || b);
    setHTML(els.cauldron, `
      <div class="brew-row">
        ${slotHTML(0, a)}
        <div class="pot${hasAny ? ' is-filled' : ''}" aria-hidden="true" style="--brew-a:${ca};--brew-b:${cb}">
          ${img('caldeirao-bancada', 'pot-img')}
          <span class="pot-liquid"></span>
          <span class="bubble b1"></span><span class="bubble b2"></span><span class="bubble b3"></span>
          <span class="pot-vapor"></span>
        </div>
        ${slotHTML(1, b)}
      </div>
      <div class="cauldron-actions">
        <button type="button" class="btn" data-action="clear"${disabledAttr(!hasAny, 'O caldeirão já está vazio')}>Esvaziar</button>
        <button type="button" class="btn btn-primary btn-mix" data-action="mix" aria-describedby="mix-reason"${disabledAttr(!ready, reason)}>Misturar</button>
      </div>
      <p id="mix-reason" class="reason${ready ? ' is-ready' : ''}${ready && isKnownFailure(state, a, b) ? ' is-warning' : ''}">${esc(reason)}</p>`);
  }

  function renderHand(state) {
    const handTip = byId('hand-tip');
    if (handTip) {
      const ctx = sheetCtx('caldeirao');
      handTip.hidden = !(ctx && pickTip(['cartas'], ctx));
    }
    const stock = state.stock || {};
    const full = !!(ui.selection[0] && ui.selection[1]);
    setHTML(els.hand, INGREDIENTS.map((ing, i) => {
      const qty = stock[ing.id] ?? 0;
      const inPot = ui.selection.filter((x) => x === ing.id).length;
      const poor = (state.coins || 0) < ing.cost;
      const here = isMerchantHere(state);
      const why = qty < 1
        ? (here ? `Sem ${ing.name}: compre com a mercadora` : `Sem ${ing.name}: a mercadora só vem no fim do dia`)
        : 'O caldeirão já tem dois ingredientes: toque em um para tirá-lo';
      return `
      <li class="card ing-card${qty === 0 ? ' is-empty' : ''}${inPot ? ' is-in-pot' : ''}" style="--i:${i};--ing:${BREW_COLOR[ing.id] || '#c87533'}">
        <button type="button" class="card-face" data-action="select" data-id="${esc(ing.id)}"
          aria-label="Pôr ${esc(ing.name)} no caldeirão (${esc(qty)} em estoque)"${disabledAttr(full || qty < 1, why)}>
          <span class="card-count" aria-hidden="true">${esc(qty)}</span>
          ${img(ing.id, 'card-img')}
          <span class="card-name">${esc(ing.name)}</span>
          <span class="card-quality">${esc(ing.quality)}</span>
          ${inPot ? `<span class="card-flag">no caldeirão${inPot > 1 ? ` ×${inPot}` : ''}</span>` : ''}
        </button>
        ${here
          ? `<button type="button" class="card-buy" data-action="buy" data-id="${esc(ing.id)}" data-qty="1"
          aria-label="Comprar 1 ${esc(ing.name)} por ${esc(ing.cost)} moedas"${disabledAttr(poor, `A bolsa não alcança: custa ${ing.cost}`)}>+1 · ${coinIcon()} ${esc(ing.cost)}</button>`
          : `<span class="card-buy is-off" title="Durante o dia não há onde comprar: a mercadora vem no fim do dia">${qty ? 'em estoque' : 'acabou'}</span>`}
      </li>`;
    }).join(''));
  }

  function renderQuick(state) {
    const known = (state.discovered || []).map(getRecipe).filter(Boolean);
    setHTML(els.quick, known.length
      ? `<p class="quick-title">Receitas do caderno (um toque para repetir)</p>
         <ul class="quick-list">${known.map((r) => `<li>${remakeButton(state, r, `${img(r.id, 'mini-img')} ${esc(r.name)}`)}</li>`).join('')}</ul>`
      : '');
  }

  function renderResultPlaceholder() {
    const ctx = sheetCtx('caldeirao');
    const t = ctx && pickTip(['misturar'], ctx);
    setHTML(els.result, t ? `<p class="result-empty">${esc(TIPS.find((x) => x.id === t).text)}</p>` : '<p class="result-empty">O resultado da mistura aparece aqui.</p>');
  }

  // ---------- prateleira ----------
  function renderShelf(state) {
    const inv = state.inventory || {};
    const ids = [...RECIPES.map((r) => r.id), 'lodo'].filter((id) => inv[id] > 0);
    const order = ui.farewell ? null : currentOrder(state);
    const c = order ? customerOf(order.customerId) : null;
    const head = c
      ? `<p class="shelf-ask">Qual frasco resolve o pedido de <strong>${esc(c.name)}</strong>? Errar não gasta a poção, só custa 1 de fama.</p>
         <blockquote class="shelf-clue">“${esc(getOrderClues(order).join(' '))}”</blockquote>`
      : '<p class="shelf-ask">Sem ninguém no balcão agora. Dá para vender frascos para o mercador.</p>';
    if (!ids.length) {
      setHTML(els.shelf, `${head}<p class="empty">A prateleira está vazia. Misture ingredientes no caldeirão para encher os frascos.</p>
        <button type="button" class="btn btn-primary" data-action="open-sheet" data-id="caldeirao">Ir ao caldeirão</button>`);
      return;
    }
    const cards = ids.map((id, i) => {
      const item = getItem(id);
      if (!item) return '';
      const price = sellPrice(state, id);
      const potion = id !== 'lodo';
      return `
      <li class="card potion-card rarity-${esc(item.rarity)}" style="--i:${i}">
        <div class="card-face">
          <span class="card-count" aria-hidden="true">${esc(inv[id])}</span>
          <span class="seal seal-${esc(item.rarity)}" title="${esc(rarityLabel(item.rarity))}"></span>
          ${img(id, 'card-img')}
          <span class="card-name">${esc(item.name)}</span>
          <span class="card-quality">${esc(rarityLabel(item.rarity))} · ×${esc(inv[id])}</span>
        </div>
        <div class="card-btns">
          ${c && potion ? `<button type="button" class="btn btn-small btn-primary" data-action="give" data-id="${esc(id)}"
              aria-label="Entregar ${esc(item.name)} a ${esc(c.name)}">Entregar</button>` : ''}
          <button type="button" class="btn btn-small btn-coin" data-action="sell" data-id="${esc(id)}"
            aria-label="Vender 1 ${esc(item.name)} por ${esc(coins(price))}"><span class="btn-word">Vender · </span>${coinIcon()} ${esc(price)}</button>
        </div>
      </li>`;
    }).join('');
    setHTML(els.shelf, `${head}<ul class="hand shelf-cards">${cards}</ul>`);
  }

  // ---------- utensílios e dicas ----------
  function formatWait(ms) {
    const total = Math.ceil(ms / 1000);
    const m = Math.floor(total / 60);
    const sec = total % 60;
    return m ? `${m} min${sec >= 30 ? ' e meio' : ''}` : 'menos de 1 min';
  }

  function renderTools(state) {
    const owned = state.upgrades || {};
    const ups = UPGRADES.map((u, i) => {
      const has = !!owned[u.id];
      const poor = (state.coins || 0) < u.cost;
      return `
      <li class="card tool-card${has ? ' is-owned' : ''}" style="--i:${i}">
        <div class="card-face">
          ${img(`up-${u.id}`, 'card-img')}
          <span class="card-name">${esc(u.name)}</span>
          <span class="card-desc">${esc(u.description)}</span>
        </div>
        <div class="card-btns">
        ${has
          ? '<span class="stamp-owned">Na botica</span>'
          : `<button type="button" class="btn btn-small btn-coin" data-action="upgrade" data-id="${esc(u.id)}"
              aria-label="Comprar ${esc(u.name)} por ${esc(u.cost)} moedas"${disabledAttr(poor, `A bolsa não alcança: custa ${u.cost}`)}>Comprar · ${coinIcon()} ${esc(u.cost)}</button>`}
        </div>
      </li>`;
    }).join('');

    const check = canRequestHint(state) || { ok: false };
    let reason = '';
    if (!check.ok) {
      const code = check.error && check.error.code;
      reason = (check.error && check.error.message)
        || (code === 'LOCKED' ? 'Compre a Lupa Arcana para estudar dicas pagas.' : 'Nenhuma dica disponível agora.');
    }
    let last = '';
    if (ui.lastHint) {
      const ing = getIngredient(ui.lastHint.ingredientId);
      const rec = getItem(ui.lastHint.recipeId);
      if (ing && rec) last = `<p class="hint-last"><strong>${esc(rec.name)}</strong> leva ${img(ing.id, 'mini-img')} ${esc(ing.name)} + ???</p>`;
    }
    const now = Date.now();
    const free = canRequestFreeHint(state, now) || { ok: false };
    let freeReason = '';
    if (!free.ok) {
      const code = free.error && free.error.code;
      freeReason = code === 'COOLDOWN'
        ? `A próxima dica grátis chega em ${formatWait(freeHintWaitMs(state, now))}.`
        : ((free.error && free.error.message) || 'Nenhuma dica grátis agora.');
    }
    const toolsCtx = sheetCtx('utensilios');
    setHTML(els.tools, `
      ${toolsCtx ? tipHTML(pickTip(['dica-gratis'], toolsCtx)) : ''}
      <h3 class="tools-title">Dicas</h3>
      <ul class="hint-row">
        <li class="hint-card">
          ${img('vela', 'hint-img')}
          <div>
            <button type="button" class="btn btn-primary" data-action="free-hint" aria-describedby="free-hint-reason"${disabledAttr(!free.ok, freeReason)}>Dica grátis</button>
            <p id="free-hint-reason" class="reason">${free.ok ? 'Pronta! A cada 4 minutos a vela acende uma dica grátis.' : esc(freeReason)}</p>
          </div>
        </li>
        <li class="hint-card">
          ${img('up-lupa', 'hint-img')}
          <div>
            <button type="button" class="btn" data-action="hint" aria-describedby="hint-reason"${disabledAttr(!check.ok, reason)}>Dica da Lupa · ${coinIcon()} ${esc(CONFIG.HINT_COST)}</button>
            <p id="hint-reason" class="reason">${check.ok ? 'Revela 1 ingrediente de uma poção ainda fora do caderno.' : esc(reason)}</p>
          </div>
        </li>
      </ul>
      ${last}
      <h3 class="tools-title">Utensílios da botica</h3>
      <ul class="hand tool-cards">${ups}</ul>`);
  }

  function renderBook(state) {
    const ings = ui.bookTab === 'ingredientes';
    const notes = ui.bookTab === 'anotacoes';
    const bookCtx = sheetCtx('livro');
    const intro = ings && bookCtx && pickTip(['propriedades'], `${bookCtx}-ing`) ? tipHTML('propriedades') : '';
    setHTML(els.book, notes ? buildNotesHTML(state) : ings ? buildIngredientsHTML(state, { intro }) : buildBookHTML(state, { interactive: true }));
    for (const t of doc.querySelectorAll('[data-action="book-tab"]')) {
      const on = t.dataset.id === ui.bookTab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    }
    const title = byId('h-book');
    const text = notes ? 'Anotações da boticária' : ings ? 'Caderno de ingredientes' : 'Livro de receitas';
    if (title && title.textContent !== text) title.textContent = text;
  }

  // ---------- API ----------
  function render(state) {
    if (!state) return;
    ui.state = state;
    const focus = captureFocus();
    try {
      const drag = doc.querySelector('.drag-hint');
      if (drag) drag.hidden = !tipActive('livro', 'sessao');
      renderHud(state);
      renderClock(state);
      renderLedger(state);
      renderSound(state);
      renderScene(state);
      renderCauldron(state);
      renderHand(state);
      renderQuick(state);
      renderShelf(state);
      renderTools(state);
      renderMerchant(state);
      renderBook(state);
      if (!cache.has(els.result)) renderResultPlaceholder();
    } catch (err) {
      console.error('[ui] falha ao desenhar', err);
    }
    restoreFocus(focus);
  }

  function rerender() { if (ui.state) render(ui.state); }

  function showMixResult(result, state) {
    if (!result || !els.result) return;
    const st = state || ui.state || {};
    const item = getItem(result.itemId);
    if (!item) return;
    const sludge = result.itemId === 'lodo' || !result.recipeId;
    const price = sellPrice(st, result.itemId);
    const isNew = !!result.isNew;
    let clueText = '';
    if (sludge && ui.lastPair) {
      const clue = sludgeClue(st, ui.lastPair[0], ui.lastPair[1]);
      const ing = clue ? getIngredient(clue.ingredientId) : null;
      clueText = ing
        ? `${ing.name} borbulhou de leve: pede algo ${clue.quality}.`
        : 'Esses ingredientes já contaram todos os seus segredos.';
    }
    const particles = isNew
      ? `<span class="particles" aria-hidden="true">${Array.from({ length: 10 }, (_, i) => `<span class="particle" style="--i:${i}"></span>`).join('')}</span>`
      : '';
    const order = ui.farewell ? null : (st.orders && st.orders.length ? currentOrder(st) : null);
    // as cartas usadas saem dos espaços; para repetir, há as receitas do caderno logo abaixo
    ui.selection = [null, null];
    rerender();
    const html = `
      <div class="result-card card reveal${isNew ? ' is-new' : ''}${sludge ? ' is-sludge' : ''} rarity-${esc(item.rarity)}">
        ${particles}
        ${isNew ? '<p class="stamp-new">Nova página!</p>' : ''}
        <span class="seal seal-${esc(item.rarity)}" title="${esc(rarityLabel(item.rarity))}"></span>
        ${img(item.id, 'result-img')}
        <p class="result-name">${esc(item.name)}</p>
        <p class="result-meta">${esc(rarityLabel(item.rarity))} · vende por ${coinIcon()} ${esc(price)}</p>
        ${sludge ? `<p class="result-note">A mistura desandou… mas o Lodo ainda vale uma moedinha.</p>${clueText ? `<p class="result-clue">${esc(clueText)}</p>` : ''}` : ''}
        ${result.free ? '<p class="result-free">O Caldeirão Eficiente devolveu os ingredientes!</p>' : ''}
        ${result.double ? '<p class="result-free">O Alambique Duplo encheu dois frascos!</p>' : ''}
        ${result.xpGained ? `<p class="result-xp">+${esc(result.xpGained)} XP</p>` : ''}
        ${!sludge && order ? '<button type="button" class="btn btn-small btn-primary" data-action="close-sheet">Levar ao balcão</button>' : ''}
      </div>`;
    cache.set(els.result, html);
    els.result.innerHTML = html; // sempre recria para reiniciar a animação
    const pot = els.cauldron && els.cauldron.querySelector('.pot');
    if (pot) { pot.classList.remove('is-stirring'); void pot.offsetWidth; pot.classList.add('is-stirring'); }

    let msg;
    if (sludge) msg = `A mistura desandou em ${item.name} (vende por ${coins(price)}). ${clueText}`;
    else msg = `${isNew ? 'Nova página no caderno! ' : ''}Do caldeirão saiu ${item.name}, poção ${rarityLabel(item.rarity).toLowerCase()} que vale ${coins(price)}.`;
    if (result.xpGained) msg += ` +${result.xpGained} XP.`;
    if (result.free) msg += ' O Caldeirão Eficiente devolveu os ingredientes!';
    if (result.double) msg += ' O Alambique Duplo encheu dois frascos!';
    notify(msg, sludge ? 'info' : 'success');
  }

  // Reação do cliente à entrega: feliz e vai embora, ou triste e explica melhor.
  function startFarewell(f) {
    ui.reaction = null;
    ui.farewell = { ...f, leaving: false };
    rerender();
    later(() => { if (ui.farewell) { ui.farewell.leaving = true; rerender(); } }, 1900);
    later(() => { ui.farewell = null; rerender(); }, 2400);
  }

  function showDelivery(result, customerId) {
    if (!result) return;
    if (result.correct) {
      startFarewell({
        customerId, mood: 'feliz', line: lineFor(customerId, 'thanks', result.orderId),
        reward: result.reward, bonus: result.bonus || 0, tip: result.tip || 0,
        xp: CONFIG.XP_DELIVERY + (result.novel ? CONFIG.NOVEL_XP : 0),
      });
    } else {
      ui.reaction = { orderId: result.orderId };
      rerender();
      later(() => {
        if (ui.reaction && ui.reaction.orderId === result.orderId) { ui.reaction = null; rerender(); }
      }, 2600);
    }
  }

  // Cliente mandado embora: sai triste, sem pagar.
  function showDismiss(result) {
    if (!result) return;
    startFarewell({ customerId: result.customerId, mood: 'triste', line: lineFor(result.customerId, 'leave', result.orderId), reward: null });
  }

  // A vela apagou: o cliente cansou de esperar e sai sozinho.
  function showWalkOut(result) {
    if (!result) return;
    startFarewell({ customerId: result.customerId, mood: 'triste', line: pickLine(IMPATIENT_LINES, result.orderId), reward: null, walkout: true, fame: result.fame });
  }

  // A vela da mercadora apagou: ela fecha a banca e vai embora.
  function showMerchantLeft() {
    if (ui.sheet === 'mercador') closeSheet();
    startFarewell({ customerId: MERCHANT.id, mood: 'triste', line: pickLine(MERCHANT_BYE_LINES, `tchau-${ui.state ? ui.state.day : 0}`), reward: null, merchant: true });
  }

  // Qual folha está aberta (o relógio da mercadora para no livro-caixa e na banca).
  function currentSheet() { return ui.sheet || null; }

  // A mercadora deixou ingredientes fiado neste fim de dia.
  function markAid(day) { ui.aid = day; rerender(); }

  function notify(message, tone = 'info') {
    const live = els.live;
    if (!live || !message) return;
    const t = ['info', 'success', 'error'].includes(tone) ? tone : 'info';
    clearTimeout(ui.toastTimer);
    clearTimeout(ui.toastWrite);
    live.className = `toast is-visible tone-${t}`;
    live.textContent = '';
    // popover: o aviso aparece por cima das folhas abertas (camada superior)
    if (typeof live.showPopover === 'function') {
      try { if (live.matches(':popover-open')) live.hidePopover(); live.showPopover(); } catch { /* sem popover */ }
    }
    ui.toastWrite = setTimeout(() => { live.textContent = message; }, 40);
    ui.toastTimer = setTimeout(() => {
      live.classList.remove('is-visible');
      if (typeof live.hidePopover === 'function') { try { live.hidePopover(); } catch { /* já fechado */ } }
    }, 4200);
  }

  function showHint(result) {
    if (!result) return;
    ui.lastHint = { recipeId: result.recipeId, ingredientId: result.ingredientId };
    rerender();
    const ing = getIngredient(result.ingredientId);
    const rec = getItem(result.recipeId);
    if (ing && rec) notify(`Anotado${result.repeated ? ' de novo' : ''}: ${rec.name} leva ${ing.name} e um ingrediente secreto.`, 'success');
  }

  // ---------- folhas (livro, caldeirão, prateleira, utensílios) ----------
  function openSheet(name) {
    const d = els.sheets[name];
    if (!d) return;
    if (ui.sheet && ui.sheet !== name) closeSheet({ restore: false });
    if (!ui.sheet) ui.sheetOpener = doc.activeElement;
    ui.sheet = name;
    ui.sheetSeq += 1;
    if (name === 'caldeirao' && ui.state) ui.potDay = ui.state.day;
    if (name === 'caldeirao' && els.result && (!cache.has(els.result) || els.result.querySelector('.result-empty'))) renderResultPlaceholder();
    rerender();
    try { if (!d.open) d.showModal(); } catch { d.setAttribute('open', ''); }
    if (name === 'caldeirao' || name === 'prateleira' || name === 'utensilios') {
      const hand = d.querySelectorAll('.hand');
      hand.forEach((h) => { h.classList.remove('is-dealing'); void h.offsetWidth; h.classList.add('is-dealing'); });
      later(() => hand.forEach((h) => h.classList.remove('is-dealing')), 1100);
    }
    const body = d.querySelector('.sheet-body');
    if (body) body.scrollTop = 0;
    const title = d.querySelector('.sheet-title');
    if (title) setTimeout(() => title.focus({ preventScroll: true }), 0);
  }

  function closeSheet({ restore = true } = {}) {
    const name = ui.sheet;
    const d = name && els.sheets[name];
    ui.sheet = null;
    if (d) { try { if (d.open) d.close(); else d.removeAttribute('open'); } catch { d.removeAttribute('open'); } }
    const opener = ui.sheetOpener;
    if (restore) {
      ui.sheetOpener = null;
      if (opener && opener.isConnected && !opener.closest('dialog') && typeof opener.focus === 'function') opener.focus({ preventScroll: true });
    }
  }

  for (const [name, d] of Object.entries(els.sheets)) {
    if (!d) continue;
    d.addEventListener('close', () => { if (ui.sheet === name) closeSheet(); });
    d.addEventListener('click', (ev) => { if (ev.target === d) closeSheet(); });
  }

  // ---------- diálogo de vitória ----------
  function showVictory() {
    const d = els.victory;
    if (!d) return;
    if (ui.sheet) closeSheet({ restore: false });
    const desc = doc.getElementById('victory-desc');
    if (desc) desc.textContent = IS_DEMO
      ? `As ${TOTAL()} receitas da demo estão no caderno. A botica segue aberta até o fim do dia ${CONFIG.DEMO_LAST_DAY}: atenda a freguesia e encha a bolsa.`
      : `As ${TOTAL()} receitas estão no caderno. A loja continua aberta: atenda a freguesia, venda poções e tente bater o seu recorde de moedas.`;
    ui.dialogOpener = doc.activeElement;
    try { if (!d.open) d.showModal(); } catch { d.setAttribute('open', ''); }
  }
  function closeVictory() {
    const d = els.victory;
    try { if (d.open) d.close(); } catch { d.removeAttribute('open'); }
  }
  if (els.victory) {
    els.victory.addEventListener('click', (ev) => { if (ev.target === els.victory) closeVictory(); });
    els.victory.addEventListener('close', () => {
      const o = ui.dialogOpener; ui.dialogOpener = null;
      if (o && o.isConnected) o.focus({ preventScroll: true });
    });
  }

  // Limpa o estado de interface (caderno novo pelo menu).
  function resetView() {
    for (const t of ui.timers) clearTimeout(t);
    ui.timers = [];
    if (ui.sheet) closeSheet({ restore: false });
    ui.selection = [null, null];
    ui.lastHint = null;
    ui.lastPair = null;
    ui.currentId = null;
    ui.currentIndex = 0;
    ui.shownKey = null;
    ui.farewell = null;
    ui.reaction = null;
    cache.delete(els.result);
    renderResultPlaceholder();
  }

  // ---------- eventos ----------
  function selectIngredient(id) {
    const i = ui.selection.indexOf(null);
    if (i === -1) {
      notify('O caldeirão já tem dois ingredientes. Toque em um deles para tirá-lo.', 'info');
      return;
    }
    ui.selection[i] = id;
    rerender();
  }

  function onClick(ev) {
    const btn = ev.target && ev.target.closest ? ev.target.closest('[data-action]') : null;
    if (!btn || btn.disabled || (els.app && !els.app.contains(btn) && !btn.closest('#gameover, #fimdemo'))) return;
    if (dragged) { dragged = false; return; }
    const { action, id } = btn.dataset;
    switch (action) {
      case 'open-sheet':
        if (btn.dataset.tab) ui.bookTab = btn.dataset.tab;
        openSheet(id);
        break;
      case 'book-tab': {
        ui.bookTab = id === 'ingredientes' || id === 'anotacoes' ? id : 'receitas';
        rerender();
        const body = els.sheets.livro && els.sheets.livro.querySelector('.sheet-body');
        if (body) body.scrollTop = 0;
        break;
      }
      case 'close-sheet': closeSheet(); break;
      case 'buy': call('onBuy', id, Number(btn.dataset.qty) || 1); break;
      case 'sell-sludge': call('onSellSludge'); break;
      case 'dismiss': call('onDismiss', id); break;
      case 'next-day': call('onNextDay'); break;
      case 'pay-landlord': call('onPayLandlord'); break;
      case 'evict': call('onEvict'); break;
      case 'restart-botica': call('onRestartAfterEviction'); break;
      case 'gameover-menu': call('onGameOverMenu'); break;
      case 'demo-end': call('onDemoEnd'); break;
      case 'demo-restart': call('onDemoRestart'); break;
      case 'demo-menu': call('onDemoMenu'); break;
      case 'select': selectIngredient(id); break;
      case 'slot': {
        const i = Number(btn.dataset.slot);
        if (ui.selection[i]) { ui.selection[i] = null; rerender(); }
        else {
          const first = els.hand && els.hand.querySelector('.card-face:not(:disabled)');
          if (first) first.focus();
          notify('Espaço vazio: escolha uma carta de ingrediente.', 'info');
        }
        break;
      }
      case 'clear': ui.selection = [null, null]; rerender(); break;
      case 'mix': {
        const [a, b] = ui.selection;
        if (a && b) { ui.lastPair = [a, b]; call('onMix', a, b); }
        break;
      }
      case 'remake': {
        const r = getRecipe(id);
        if (r) {
          if (ui.sheet !== 'caldeirao') openSheet('caldeirao');
          ui.selection = [r.a, r.b];
          ui.lastPair = [r.a, r.b];
          call('onMix', r.a, r.b);
        }
        break;
      }
      case 'sell': call('onSell', id); break;
      case 'give': {
        const order = ui.state && currentOrder(ui.state);
        if (order) { closeSheet(); call('onDeliver', order.id, id); }
        break;
      }
      case 'call': {
        ui.currentId = id;
        ui.reaction = null;
        rerender();
        break;
      }
      case 'free-hint': call('onFreeHint'); break;
      case 'upgrade': call('onBuyUpgrade', id); break;
      case 'hint': call('onHint'); break;
      case 'sound': call('onToggleSound'); break;
      case 'menu': if (ui.sheet) closeSheet({ restore: false }); call('onMenu'); break;
      case 'close-dialog': closeVictory(); break;
      default: break;
    }
  }

  // Arrastar para baixo na loja abre o livro; arrastar para cima no livro fecha.
  let drag = null;
  let dragged = false;
  function startDrag(ev, kind) {
    if (ev.pointerType === 'mouse' && ev.button !== 0) return;
    drag = { kind, x: ev.clientX, y: ev.clientY, id: ev.pointerId };
    dragged = false;
  }
  function moveDrag(ev) {
    if (!drag || ev.pointerId !== drag.id) return;
    const dx = ev.clientX - drag.x;
    const dy = ev.clientY - drag.y;
    if (drag.kind === 'open') {
      els.scene.style.setProperty('--pull', `${Math.max(0, Math.min(90, dy))}px`);
      if (dy > DRAG_OPEN_PX && dy > Math.abs(dx)) {
        drag = null; dragged = true;
        els.scene.style.setProperty('--pull', '0px');
        openSheet('livro');
      }
    } else if (dy < -DRAG_OPEN_PX && -dy > Math.abs(dx)) {
      drag = null; dragged = true;
      closeSheet();
    }
  }
  function endDrag() {
    if (drag && drag.kind === 'open') els.scene.style.setProperty('--pull', '0px');
    drag = null;
    // o clique que vem logo após soltar não deve contar como toque
    setTimeout(() => { dragged = false; }, 0);
  }
  if (els.scene) {
    els.scene.addEventListener('pointerdown', (ev) => {
      if (ui.sheet) return;
      const t = ev.target;
      // botões e a caixa de diálogo continuam clicáveis; a fita do livro também pode ser puxada
      if (t.closest('.talk, .shop-top, .queue-wrap, .pot-counter, .pot-hotspot') ) return;
      startDrag(ev, 'open');
    });
  }
  const book = els.sheets.livro;
  if (book) {
    book.addEventListener('pointerdown', (ev) => {
      if (ev.target.closest('button, a, input, select')) return;
      startDrag(ev, 'close');
    });
  }
  doc.addEventListener('pointermove', moveDrag);
  doc.addEventListener('pointerup', endDrag);
  doc.addEventListener('pointercancel', endDrag);

  const target = els.app || doc;
  target.addEventListener('click', onClick);

  // ---------- fim de jogo: a botica fechou por dívida (v1.27) ----------
  const gameover = doc.getElementById('gameover');
  function showGameOver(r) {
    if (!gameover) return;
    for (const t of ui.timers) clearTimeout(t);
    ui.timers = [];
    if (ui.sheet) closeSheet({ restore: false });
    const set = (id, html) => { const el = doc.getElementById(id); if (el) el.innerHTML = html; };
    set('gameover-sub', `O senhorio levou a chave. Ficaram ${esc(r.debt)} ${r.debt === 1 ? 'moeda' : 'moedas'} de aluguel atrasado.`);
    const portrait = (globalThis.matchMedia && matchMedia('(orientation: portrait), (max-aspect-ratio: 4/5)').matches);
    const rows = portrait
      ? [['Dias', r.day], ['Clientes', r.served], ['Poções', r.brewed], ['Receitas', `${r.found} de ${r.total}`]]
      : [['Dias de loja aberta', r.day], ['Clientes atendidos', r.served], ['Poções preparadas', r.brewed], ['Receitas descobertas', `${r.found} de ${r.total}`]];
    set('gameover-dl', rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join(''));
    if (els.app) els.app.hidden = true;
    gameover.hidden = false;
    const btns = [...gameover.querySelectorAll('.gameover-btn')];
    btns.forEach((b, i) => b.classList.toggle('is-sel', i === 0));
  }
  function hideGameOver() { if (gameover) gameover.hidden = true; }
  if (gameover) {
    gameover.addEventListener('click', onClick);
    const mark = (ev) => {
      const b = ev.target.closest && ev.target.closest('.gameover-btn');
      if (!b) return;
      for (const o of gameover.querySelectorAll('.gameover-btn')) o.classList.toggle('is-sel', o === b);
    };
    gameover.addEventListener('pointerover', mark);
    gameover.addEventListener('focusin', mark);
    gameover.addEventListener('keydown', (ev) => {
      if (ev.key !== 'ArrowDown' && ev.key !== 'ArrowUp') return;
      const btns = [...gameover.querySelectorAll('.gameover-btn')];
      const i = btns.indexOf(doc.activeElement);
      const n = (i + (ev.key === 'ArrowDown' ? 1 : -1) + btns.length) % btns.length;
      btns[n].focus();
      ev.preventDefault();
    });
  }

  // ---------- fim da demo (v1.28): carta da Mestra + resumo da partida ----------
  const fimdemo = doc.getElementById('fimdemo');
  function showDemoEnd(r) {
    if (!fimdemo) return;
    for (const t of ui.timers) clearTimeout(t);
    ui.timers = [];
    if (ui.sheet) closeSheet({ restore: false });
    const set = (id, html) => { const el = doc.getElementById(id); if (el) el.innerHTML = html; };
    const letter = demoLetter(r);
    set('fimdemo-carta', `<p class="fimdemo-saudacao">${esc(letter.greeting)}</p>${letter.paragraphs.map((t) => `<p>${esc(t)}</p>`).join('')}<p class="fimdemo-assinatura">${esc(letter.signature)}</p>`);
    const rows = [['Dias', r.day], ['Clientes', r.served], ['Receitas', `${r.found} de ${r.total}`], ['Moedas', r.coins], ['Fama', r.fame], ['Dias perfeitos', r.perfectDays]];
    set('fimdemo-dl', rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join(''));
    if (els.app) els.app.hidden = true;
    fimdemo.hidden = false;
    fimdemo.scrollTop = 0;
    const btns = [...fimdemo.querySelectorAll('.gameover-btn')];
    btns.forEach((b, i) => b.classList.toggle('is-sel', i === 0));
    if (btns[0]) btns[0].focus({ preventScroll: true });
  }
  function hideDemoEnd() { if (fimdemo) fimdemo.hidden = true; }
  if (fimdemo) {
    fimdemo.addEventListener('click', onClick);
    const mark = (ev) => {
      const b = ev.target.closest && ev.target.closest('.gameover-btn');
      if (!b) return;
      for (const o of fimdemo.querySelectorAll('.gameover-btn')) o.classList.toggle('is-sel', o === b);
    };
    fimdemo.addEventListener('pointerover', mark);
    fimdemo.addEventListener('focusin', mark);
  }

  renderResultPlaceholder();
  // Atualiza a contagem da dica grátis sem exigir ação do jogador.
  setInterval(rerender, 10000);

  return { render, showMixResult, showDelivery, showDismiss, showWalkOut, markAid, notify, showVictory, showHint, resetView, showLedger, updatePatience, counterId, showMerchantLeft, currentSheet, showGameOver, hideGameOver, showDemoEnd, hideDemoEnd };
}
