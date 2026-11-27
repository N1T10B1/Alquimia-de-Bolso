// Integração: liga menu, engine, progressão, persistência, interface e áudio.
import { getIngredient, getItem, getRecipe, UPGRADES, CUSTOMERS } from './data.js';
import { createInitialState, mix, sellItem, isVictory } from './engine.js';
import {
  fillOrders, deliverOrder, dismissOrder, buyUpgrade, requestHint, requestFreeHint,
  isDayOver, closeDay, startNextDay, buyFromMerchant, tickPatience, walkOutOrder, setRelaxed, tickMerchant,
  sellSludgeToMerchant, payLandlord, evict, restartAfterEviction, isDemoOver, demoSummary,
} from './progression.js';
import {
  loadGame, saveGame, clearSave, hasSave, loadOptions, saveOptions, sanitizeOptions,
} from './storage.js';
import { createUI } from './ui.js';
import { createMenu } from './menu.js';
import { createAudio } from './audio.js';
import { seedTutorialDay } from './story.js';
import { createIntro, createTutorial } from './abertura.js';
import { createScrollbars } from './rolagem.js';
import { createNightShader } from './noite.js';
import { createBackButton } from './voltar.js';
import { L, aplicaIdiomaHTML, guardaIdioma, LANG } from './idioma.js';

const audio = createAudio();
const getUpgradeName = (id) => UPGRADES.find((u) => u.id === id)?.name ?? id;
const getCustomerName = (id) => CUSTOMERS.find((c) => c.id === id)?.name ?? L('O cliente', 'The customer');
const root = document.documentElement;
let state;
let options;
let playing = false; // a loja está na tela (fora do menu e da abertura)

function persist() {
  saveGame(state);
}

// ---------- opções (som, volume, menos animação, tamanho do texto) ----------
function applyOptions() {
  audio.setEnabled(options.sound);
  audio.setVolume(options.volume);
  root.classList.toggle('reduce-motion', options.reduceMotion);
  root.dataset.textSize = options.textSize;
  root.dataset.quality = options.quality;
}

// v1.30 — troca de idioma: guarda a escolha, salva o caderno e recarrega o jogo no idioma novo.
function setLanguage(lang) {
  if (!lang || lang === LANG) return false;
  if (!guardaIdioma(lang)) return false;
  if (hasSave()) persist();
  location.reload();
  return true;
}

function setOptions(next) {
  if (next && setLanguage(next.lang)) return;
  const wasOn = options.sound;
  options = sanitizeOptions(next);
  saveOptions(options);
  applyOptions();
  state = setRelaxed({ ...state, sound: options.sound }, options.relaxed);
  if (hasSave()) persist();
  if (options.sound && !wasOn) audio.play('click');
}

// ---------- ações da bancada ----------
function commit(next) {
  state = fillOrders(next);
  // último cliente do dia saiu: a loja fecha e a mercadora chega
  if (isDayOver(state)) {
    const closed = closeDay(state);
    if (closed.ok) {
      state = closed.state;
      if (closed.result.aid) ui.markAid(state.day);
      if (closed.result.landlord) setTimeout(() => audio.play('error'), 2400);
      // depois da despedida do último cliente, o livro-caixa do dia
      setTimeout(() => ui.showLedger(), 2400);
    }
  }
  persist();
  ui.render(state);
}

function checkVictory() {
  if (isVictory(state) && !state.victorySeen) {
    state = { ...state, victorySeen: true };
    persist();
    audio.play('discover');
    ui.showVictory();
  }
}

// Executa uma ação pura da engine/progressão: em falha nada muda.
function run(outcome, onSuccess) {
  if (!outcome || !outcome.ok) {
    const message = outcome?.error?.message || L('Isso não dá para fazer agora.', 'You can’t do that right now.');
    ui.notify(message, 'error');
    audio.play('error');
    return false;
  }
  commit(outcome.state);
  onSuccess?.(outcome.result);
  return true;
}

function showGame(message, tone = 'info') {
  menu.hide();
  playing = true;
  lastTick = performance.now();
  ui.render(state);
  const first = document.querySelector('#talk button:not(:disabled)');
  if (first) first.focus({ preventScroll: true });
  window.scrollTo(0, 0);
  if (message) ui.notify(message, tone);
}

const handlers = {
  // uma dica apareceu pela primeira vez: guarda nas Anotações do livro
  onTipSeen(id) {
    if (!state || (state.seenTips || []).includes(id)) return;
    state = { ...state, seenTips: [...(state.seenTips || []), id] };
    persist();
    ui.render(state);
  },
  onBuy(ingredientId, qty = 1) {
    run(buyFromMerchant(state, ingredientId, qty), (r) => {
      audio.play('coin');
      const ing = getIngredient(r.ingredientId);
      ui.notify(L(`A mercadora embrulhou ${r.qty} ${ing ? ing.name : r.ingredientId} por ${r.cost} moedas.`, `The merchant wrapped up ${r.qty} ${ing ? ing.name : r.ingredientId} for ${r.cost} coins.`), 'info');
    });
  },
  // v1.26 — a mercadora leva o Lodo Instável por um preço melhor que a prateleira
  onSellSludge() {
    run(sellSludgeToMerchant(state), (r) => {
      audio.play('coin');
      ui.notify(r.left > 0
        ? L(`A mercadora levou um Lodo Instável por ${r.price} moedas. "Serve para calafetar barco", diz ela.`, `The merchant took an Unstable Sludge for ${r.price} coins. "Good for caulking boats", she says.`)
        : L(`A mercadora levou um Lodo Instável por ${r.price} moedas. Por hoje, a carroça não leva mais.`, `The merchant took an Unstable Sludge for ${r.price} coins. The cart can’t take any more today.`), 'info');
    });
  },
  onDismiss(orderId) {
    const outcome = dismissOrder(state, orderId);
    if (outcome.ok) ui.showDismiss(outcome.result);
    run(outcome, () => {
      audio.play('error');
      ui.notify(L('O cliente foi embora sem poção (−1 de fama).', 'The customer left without a potion (−1 fame).'), 'error');
    });
  },
  // v1.27 — o senhorio cobra o aluguel atrasado
  onPayLandlord() {
    run(payLandlord(state), (r) => {
      audio.play('coin');
      ui.notify(L(`Você pagou ${r.paid} moedas de aluguel atrasado. O senhorio conferiu as moedas, tirou o chapéu e foi embora. A mercadora já vem chegando.`, `You paid ${r.paid} coins of overdue rent. The landlord counted the coins, tipped his hat and left. The merchant is on her way.`), 'success');
    });
  },
  onEvict() {
    const out = evict(state);
    if (!out.ok) { ui.notify(out.error.message, 'error'); return; }
    playing = false;
    tutorial.pause();
    clearSave(); // o Continuar do menu não volta para a dívida
    state = out.state;
    audio.play('error');
    ui.showGameOver(out.result);
  },
  onRestartAfterEviction() {
    const kept = state;
    state = fillOrders(setRelaxed(restartAfterEviction(kept, createInitialState()), options.relaxed));
    persist();
    ui.hideGameOver();
    ui.resetView();
    showGame(L('A botica reabriu num cômodo novo. As receitas do caderno vieram junto.', 'The apothecary reopened in a new room. The notebook’s recipes came along.'), 'success');
  },
  onGameOverMenu() {
    state = fillOrders(setRelaxed(restartAfterEviction(state, createInitialState()), options.relaxed));
    ui.hideGameOver();
    ui.resetView();
    playing = false;
    menu.show();
  },
  // v1.28 — fim da demo: carta da Mestra e resumo; o save fica (o Continuar volta para esta noite)
  onDemoEnd() {
    if (!isDemoOver(state)) return;
    playing = false;
    tutorial.pause();
    persist();
    audio.play('discover');
    ui.showDemoEnd(demoSummary(state));
  },
  onDemoRestart() {
    ui.hideDemoEnd();
    menuHandlers.onNewGame();
  },
  onDemoMenu() {
    ui.hideDemoEnd();
    playing = false;
    menu.show();
  },
  onNextDay() {
    run(startNextDay(state), (r) => {
      audio.play('discover');
      ui.notify(L(`Dia ${r.day}: a loja abriu e ${r.customers} clientes devem passar hoje.`, `Day ${r.day}: the shop is open and ${r.customers} customers should come by today.`), 'success');
      tutorial.event('nextDay', r);
    });
  },
  onMix(a, b) {
    run(mix(state, a, b), (r) => {
      audio.play(r.isNew ? 'discover' : r.recipeId ? 'mix' : 'error');
      ui.showMixResult(r, state);
      checkVictory();
      tutorial.event('mix', r);
    });
  },
  onSell(itemId) {
    run(sellItem(state, itemId), (r) => {
      audio.play('coin');
      const item = getItem(r.itemId);
      ui.notify(L(`${item ? item.name : r.itemId} vendido no balcão por ${r.price} ${r.price === 1 ? 'moeda' : 'moedas'}.`, `${item ? item.name : r.itemId} sold at the counter for ${r.price} ${r.price === 1 ? 'coin' : 'coins'}.`), 'success');
    });
  },
  onDeliver(orderId, potionId) {
    const order = (state.orders || []).find((o) => o.id === orderId);
    const outcome = deliverOrder(state, orderId, Math.random, potionId);
    // a reação do cliente entra antes de desenhar o estado novo (o satisfeito sai, o próximo entra)
    if (outcome.ok) ui.showDelivery(outcome.result, order ? order.customerId : null);
    run(outcome, (r) => {
      const rec = getRecipe(r.potionId);
      const name = rec ? rec.name : r.potionId;
      tutorial.event('deliver', r);
      if (r.correct) {
        audio.play('coin');
        ui.notify(L(`Acertou! ${name} era o remédio certo. +${r.reward + (r.tip || 0)} moedas${r.bonus ? ` (${r.bonus} de bônus pela receita nova)` : ''}${r.tip ? ` (${r.tip} de gorjeta pela rapidez)` : ''}.`, `Right on! ${name} was the right remedy. +${r.reward + (r.tip || 0)} coins${r.bonus ? ` (${r.bonus} bonus for the new recipe)` : ''}${r.tip ? ` (${r.tip} tip for speed)` : ''}.`), 'success');
      } else {
        audio.play('error');
        ui.notify(r.revealed
          ? L(`${name} não resolve. Agora o pedido ficou claro (−1 de fama; o frasco voltou à prateleira).`, `${name} doesn’t solve it. Now the request is clear (−1 fame; the flask went back to the shelf).`)
          : L(`${name} não resolve. O cliente explicou melhor (−1 de fama; o frasco voltou à prateleira).`, `${name} doesn’t solve it. The customer explained better (−1 fame; the flask went back to the shelf).`), 'error');
      }
    });
  },
  onBuyUpgrade(upgradeId) {
    run(buyUpgrade(state, upgradeId), (r) => {
      audio.play('discover');
      ui.notify(L(`${getUpgradeName(r.upgradeId)} agora faz parte da botica.`, `${getUpgradeName(r.upgradeId)} is now part of the apothecary.`), 'success');
    });
  },
  onHint() {
    run(requestHint(state), (r) => {
      audio.play('click');
      ui.showHint(r);
    });
  },
  onFreeHint() {
    run(requestFreeHint(state, Date.now()), (r) => {
      audio.play('click');
      ui.showHint(r);
    });
  },
  onToggleSound() {
    setOptions({ ...options, sound: !options.sound });
    ui.render(state);
    ui.notify(options.sound ? L('Som ligado.', 'Sound on.') : L('Som desligado.', 'Sound off.'), 'info');
  },
  onMenu() {
    playing = false;
    persist();
    tutorial.pause();
    menu.show();
  },
};

const menuHandlers = {
  hasSave: () => hasSave(),
  getState: () => state,
  getOptions: () => options,
  onOptions: (next) => setOptions(next),
  onLanguage: (lang) => setLanguage(lang),
  onContinue() {
    showGame(L('A loja está aberta de novo.', 'The shop is open again.'));
    tutorial.resume();
  },
  onNewGame() {
    clearSave();
    tutorial.reset();
    // a Vovó Quitéria é a primeira freguesa do caderno novo (tutorial do dia 1)
    state = seedTutorialDay({ ...createInitialState(), sound: options.sound, relaxed: options.relaxed });
    persist();
    ui.resetView();
    // a história abre por cima do menu; a loja só aparece depois da assinatura
    intro.play({
      onDone(name) {
        showGame();
        tutorial.start(name);
      },
    });
  },
};

// ---------- paciência dos clientes (v1.14) ----------
// A cada meio segundo de jogo o tempo passa para quem está na loja. Pausa no menu, com a aba
// escondida e durante a despedida de um cliente; um salto grande (computador dormiu) conta no máximo 1 s.
const TICK_MS = 500;
let lastTick = performance.now();
let sinceSave = 0;
function tick() {
  const now = performance.now();
  const dt = Math.min(1000, Math.max(0, now - lastTick));
  lastTick = now;
  if (!playing || document.hidden || !state) return;
  if (state.phase === 'closed') { if (!isDemoOver(state)) tickNight(dt); return; }
  if (!(state.orders || []).some((o) => o.patience > 0)) return;
  const counter = ui.counterId();
  if (!counter) return; // despedida em andamento
  const t = tickPatience(state, dt, counter);
  state = t.state;
  if (t.expired.length) {
    for (const id of t.expired) {
      const out = walkOutOrder(state, id);
      if (!out.ok) continue;
      if (id === counter) ui.showWalkOut(out.result);
      state = out.state;
      audio.play('error');
      ui.notify(L(`${getCustomerName(out.result.customerId)} cansou de esperar e foi embora (−${out.result.fame} de fama).`, `${getCustomerName(out.result.customerId)} got tired of waiting and left (−${out.result.fame} fame).`), 'error');
    }
    commit(state);
    sinceSave = 0;
    return;
  }
  ui.updatePatience(state);
  sinceSave += dt;
  if (sinceSave >= 5000) { sinceSave = 0; persist(); }
}
// À noite a vela é da mercadora: corre só fora do livro-caixa e da banca dela.
function tickNight(dt) {
  const sheet = ui.currentSheet();
  if (sheet === 'caixa' || sheet === 'mercador') return;
  const t = tickMerchant(state, dt);
  if (t.state === state) return;
  state = t.state;
  if (t.gone) {
    ui.showMerchantLeft();
    audio.play('error');
    ui.notify(L('A mercadora cansou de esperar e seguiu viagem. Ela volta amanhã à noite.', 'The merchant got tired of waiting and moved on. She’ll be back tomorrow night.'), 'error');
    persist();
    ui.render(state);
    sinceSave = 0;
    return;
  }
  ui.updatePatience(state);
  sinceSave += dt;
  if (sinceSave >= 5000) { sinceSave = 0; persist(); }
}
setInterval(tick, TICK_MS);
document.addEventListener('visibilitychange', () => { lastTick = performance.now(); if (document.hidden && state && playing) persist(); });

// ---------- início ----------
const loaded = loadGame();
// v1.27 — um caderno de botica fechada não volta pelo Continuar
if (loaded.state && loaded.state.evicted) { clearSave(); loaded.state = createInitialState(); }
state = fillOrders(loaded.state);
const savedOptions = loadOptions();
options = savedOptions.found ? savedOptions.options : sanitizeOptions({ sound: !!state.sound });
state = setRelaxed({ ...state, sound: options.sound }, options.relaxed);
applyOptions();

aplicaIdiomaHTML(document); // v1.30: textos fixos do index.html no idioma escolhido
const ui = createUI(document, handlers);
const menu = createMenu(document, menuHandlers);
const intro = createIntro(document);
const tutorial = createTutorial(document, { getState: () => state });
createScrollbars(document);
createNightShader(document);
// v1.29 — botão voltar do celular e página de Pausa (o tempo da loja para enquanto ela está aberta)
createBackButton(document, {
  onPause() { playing = false; tutorial.pause(); persist(); },
  onResume() { playing = true; lastTick = performance.now(); tutorial.resume(); },
  onMenu: () => handlers.onMenu(),
  openOptions: () => menu.openOptions(),
});
if (hasSave()) tutorial.resume();
tutorial.pause();
if (loaded.status === 'corrupt') {
  clearSave();
  menu.show(L('O caderno salvo estava danificado. Comece um novo pelo menu.', 'The saved notebook was damaged. Start a new one from the menu.'));
} else {
  menu.show();
}
