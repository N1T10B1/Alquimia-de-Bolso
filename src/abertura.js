// Abertura do Novo jogo (história da botica, carta da Mestra, assinatura do caderno) e o tutorial
// do primeiro dia, guiado por bilhetes da Mestra Benvinda. Só DOM: as regras ficam em story.js.
import { INGREDIENTS } from './data.js';
import { itemArt } from './art.js';
import { STORY_PAGES, LETTER, TUTORIAL_NOTES, TUTORIAL_END, TUTORIAL_ORDER } from './story.js';

export const TUTORIAL_KEY = 'alquimia-de-bolso-tutorial-v1';

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function readProfile() {
  try {
    const raw = JSON.parse(localStorage.getItem(TUTORIAL_KEY) || 'null');
    if (raw && typeof raw === 'object') {
      return { step: typeof raw.step === 'string' ? raw.step : 'feito', name: typeof raw.name === 'string' ? raw.name.slice(0, 24) : '' };
    }
  } catch { /* sem armazenamento */ }
  return { step: 'feito', name: '' };
}

function writeProfile(p) {
  try { localStorage.setItem(TUTORIAL_KEY, JSON.stringify({ step: p.step, name: p.name || '' })); } catch { /* sem armazenamento */ }
}

export function cleanName(raw) {
  return String(raw ?? '').replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24);
}

// O nome assinado na contracapa aparece no subtítulo do menu ("o caderno de Rafa").
export function applyBookName(doc, name) {
  const sub = doc.querySelector('.menu-logo small');
  if (sub) sub.textContent = name ? `o caderno de ${name}` : 'o caderno da boticária';
}

function artHTML(kind) {
  if (kind === 'loja') return '<div class="intro-art intro-art-loja" aria-hidden="true"></div>';
  if (kind === 'herbario') {
    return `<div class="intro-art intro-art-herbario" aria-hidden="true">${INGREDIENTS.map((ing, i) =>
      `<img src="${itemArt(ing.id)}" alt="" style="--i:${i}" draggable="false">`).join('')}</div>`;
  }
  const src = kind === 'caldeirao' ? itemArt('caldeirao-bancada') : itemArt(kind);
  return src ? `<div class="intro-art" aria-hidden="true"><img src="${src}" alt="" draggable="false"></div>` : '';
}

// ---------------------------------------------------------------------------
// Abertura: páginas da história, a carta e a assinatura
// ---------------------------------------------------------------------------
export function createIntro(doc) {
  const el = doc.createElement('div');
  el.id = 'intro';
  el.className = 'intro';
  el.hidden = true;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-labelledby', 'intro-title');
  doc.body.appendChild(el);

  let page = 0;
  let done = null;
  let name = '';
  const total = STORY_PAGES.length + 2; // história + carta + assinatura

  function dots() {
    return `<ol class="intro-dots" aria-hidden="true">${Array.from({ length: total }, (_, i) =>
      `<li class="${i === page ? 'is-on' : i < page ? 'is-past' : ''}"></li>`).join('')}</ol>`;
  }

  function storyHTML(p) {
    return `
      <article class="intro-page" data-page="${esc(p.id)}">
        ${artHTML(p.art)}
        <p class="intro-kicker">${esc(p.kicker)}</p>
        <h2 id="intro-title" class="intro-title">${esc(p.title)}</h2>
        ${p.text.map((t, i) => `<p class="intro-text" style="--d:${i}">${esc(t)}</p>`).join('')}
      </article>`;
  }

  function letterHTML() {
    return `
      <article class="intro-page intro-letter" data-page="carta">
        <p class="intro-kicker">Em cima do caderno, uma carta</p>
        <h2 id="intro-title" class="sr-only">A carta da Mestra Benvinda</h2>
        <div class="letter">
          <p class="letter-greet">${esc(LETTER.greeting)}</p>
          ${LETTER.paragraphs.map((t, i) => `<p class="letter-p" style="--d:${i}">${esc(t)}</p>`).join('')}
          <p class="letter-sign">${esc(LETTER.signature)}</p>
          <img class="letter-seal" src="${itemArt('selo')}" alt="" aria-hidden="true" draggable="false">
        </div>
      </article>`;
  }

  function signHTML() {
    return `
      <article class="intro-page intro-sign" data-page="assinatura">
        ${artHTML('sino')}
        <p class="intro-kicker">A contracapa do caderno</p>
        <h2 id="intro-title" class="intro-title">Assine o seu nome</h2>
        <p class="intro-text">O caderno agora é seu. Escreva o seu nome na contracapa, logo abaixo do nome da Mestra.</p>
        <form class="sign-form" data-intro="sign">
          <label class="sign-label" for="intro-name">Este caderno pertence a</label>
          <input id="intro-name" class="sign-input" type="text" maxlength="24" autocomplete="off" spellcheck="false"
            placeholder="seu nome" value="${esc(name)}">
          <p class="sign-hint">Pode deixar em branco. A freguesia vai chamar você de boticária de qualquer jeito.</p>
        </form>
      </article>`;
  }

  function render() {
    const last = page === total - 1;
    const body = page < STORY_PAGES.length ? storyHTML(STORY_PAGES[page])
      : page === STORY_PAGES.length ? letterHTML() : signHTML();
    el.innerHTML = `
      <div class="intro-sheet">
        ${body}
        <footer class="intro-foot">
          ${dots()}
          <div class="intro-btns">
            ${page > 0 ? '<button type="button" class="btn btn-small btn-quiet" data-intro="back">Voltar</button>' : ''}
            ${!last ? '<button type="button" class="btn btn-small btn-quiet" data-intro="skip">Pular história</button>' : ''}
            <button type="button" class="btn btn-primary" data-intro="next">${last ? 'Abrir a botica' : page === STORY_PAGES.length ? 'Guardar a carta' : 'Continuar'}</button>
          </div>
        </footer>
      </div>`;
    const input = el.querySelector('#intro-name');
    const focus = input || el.querySelector('[data-intro="next"]');
    if (focus) setTimeout(() => focus.focus({ preventScroll: true }), 30);
  }

  function readName() {
    const input = el.querySelector('#intro-name');
    if (input) name = cleanName(input.value);
  }

  function go(to) {
    readName();
    page = Math.max(0, Math.min(total - 1, to));
    render();
  }

  function finish() {
    readName();
    el.hidden = true;
    el.innerHTML = '';
    doc.documentElement.classList.remove('intro-open');
    const cb = done;
    done = null;
    if (cb) cb(name);
  }

  el.addEventListener('click', (ev) => {
    const act = ev.target.closest('[data-intro]')?.dataset.intro;
    if (act === 'next') { if (page >= total - 1) finish(); else go(page + 1); }
    else if (act === 'back') go(page - 1);
    else if (act === 'skip') go(total - 1); // pula para a assinatura
  });
  el.addEventListener('submit', (ev) => { ev.preventDefault(); finish(); });
  el.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') { ev.preventDefault(); if (page < total - 1) go(total - 1); }
    else if (ev.key === 'ArrowRight' && ev.target.tagName !== 'INPUT') { ev.preventDefault(); if (page < total - 1) go(page + 1); }
    else if (ev.key === 'ArrowLeft' && ev.target.tagName !== 'INPUT') { ev.preventDefault(); go(page - 1); }
  });

  function play({ onDone } = {}) {
    page = 0;
    name = '';
    done = onDone || null;
    doc.documentElement.classList.add('intro-open');
    el.hidden = false;
    render();
  }

  return { play, isOpen: () => !el.hidden };
}

// ---------------------------------------------------------------------------
// Tutorial do dia 1: bilhetes da Mestra presos na margem
// ---------------------------------------------------------------------------
const GUIDED = new Set(['balcao', 'livro', 'herbario', 'ler', 'caldeirao', 'misturar', 'lodo', 'outra', 'descoberta', 'entregar']);
const BREWING = new Set(['misturar', 'lodo', 'outra']);

// Alvo destacado em cada passo (seletores do ui.js).
const TARGETS = {
  balcao: ['#talk .talk-box'],
  livro: ['#book-ribbon'],
  herbario: ['#sheet-livro .book-tab[data-id="ingredientes"]'],
  ler: ['#sheet-livro .ing-pages > li:nth-child(1)', '#sheet-livro .ing-pages > li:nth-child(3)'],
  caldeirao: ['.pot-counter', '.pot-hotspot', '#talk [data-action="open-sheet"][data-id="caldeirao"]'],
  misturar: ['#hand [data-action="select"][data-id="agua"]', '#hand [data-action="select"][data-id="planta"]', '#cauldron .btn-mix:not(:disabled)'],
  descoberta: ['#sheet-caldeirao [data-action="close-sheet"]'],
  entregar: ['#talk [data-action="open-sheet"][data-id="prateleira"]', '#shelf [data-action="give"][data-id="cura"]'],
  sozinha: ['.queue-wrap'],
  zuleica: ['#talk [data-action="open-sheet"][data-id="mercador"]'],
  banca: [],
  amanha: ['#talk [data-action="next-day"]'],
};
TARGETS.lodo = TARGETS.misturar;
TARGETS.outra = TARGETS.misturar;

export function createTutorial(doc, { getState } = {}) {
  const note = doc.createElement('aside');
  note.className = 'tut-note';
  note.hidden = true;
  note.setAttribute('role', 'status');
  note.setAttribute('aria-live', 'polite');

  const endEl = doc.createElement('div');
  endEl.className = 'intro tut-end';
  endEl.hidden = true;
  endEl.setAttribute('role', 'dialog');
  endEl.setAttribute('aria-modal', 'true');
  endEl.setAttribute('aria-labelledby', 'tut-end-title');
  doc.body.appendChild(endEl);

  let profile = readProfile();
  let timer = null;
  let wait = null;      // passo agendado (espera a despedida do cliente ou o aviso da noite)
  let shownKey = '';
  let lit = [];

  const active = () => profile.step !== 'feito';
  const state = () => (typeof getState === 'function' ? getState() : null) || {};
  const openSheet = () => doc.querySelector('dialog.sheet[open]');

  function save() { writeProfile(profile); }

  function setStep(step) {
    if (wait) { clearTimeout(wait); wait = null; }
    profile.step = step;
    save();
    tick();
  }

  function later(step, ms) {
    if (wait) clearTimeout(wait);
    wait = setTimeout(() => { wait = null; setStep(step); }, ms);
  }

  function unlight() {
    for (const t of lit) t.classList.remove('tut-alvo');
    lit = [];
  }

  function light(step) {
    const want = [];
    for (const sel of TARGETS[step] || []) for (const t of doc.querySelectorAll(sel)) want.push(t);
    for (const t of lit) if (!want.includes(t)) t.classList.remove('tut-alvo');
    for (const t of want) t.classList.add('tut-alvo');
    lit = want;
  }

  function hideNote() {
    note.hidden = true;
    for (const d of doc.querySelectorAll('dialog.sheet.has-tut')) d.classList.remove('has-tut');
    shownKey = '';
    unlight();
  }

  function showNote(step) {
    const n = TUTORIAL_NOTES[step];
    if (!n) { hideNote(); return; }
    const sheet = openSheet();
    const parent = sheet || doc.body;
    if (note.parentNode !== parent) parent.appendChild(note);
    note.dataset.where = sheet ? (sheet.classList.contains('sheet-top') ? 'sheet-top' : 'sheet-bottom') : 'loja';
    const key = `${step}|${note.dataset.where}`;
    if (key !== shownKey) {
      shownKey = key;
      note.innerHTML = `
        <p class="tut-from"><img src="${itemArt('vela')}" alt="" aria-hidden="true"> Bilhete da Mestra</p>
        <p class="tut-title">${esc(n.title)}</p>
        ${n.quote ? `<p class="tut-quote">“${esc(n.quote)}”</p>` : ''}
        <p class="tut-text">${esc(n.text)}</p>
        <div class="tut-btns">
          ${n.action ? `<button type="button" class="btn btn-small btn-primary" data-tut="ok">${esc(n.action)}</button>` : ''}
          <button type="button" class="tut-skip" data-tut="skip">Pular tutorial</button>
        </div>`;
      note.classList.remove('is-new');
      void note.offsetWidth;
      note.classList.add('is-new');
    }
    note.hidden = false;
    for (const d of doc.querySelectorAll('dialog.sheet')) d.classList.toggle('has-tut', d === sheet);
    light(step);
  }

  function closeSheetNow() {
    const btn = openSheet()?.querySelector('[data-action="close-sheet"]');
    if (btn) btn.click();
  }

  function onOk() {
    switch (profile.step) {
      case 'balcao': setStep('livro'); break;
      case 'ler': closeSheetNow(); setStep('caldeirao'); break;
      case 'descoberta': closeSheetNow(); setStep('entregar'); break;
      case 'sozinha': setStep('livre'); break;
      case 'banca': setStep('amanha'); break;
      default: break;
    }
  }

  note.addEventListener('click', (ev) => {
    const act = ev.target.closest('[data-tut]')?.dataset.tut;
    if (act === 'ok') onOk();
    else if (act === 'skip') finish({ silent: true });
  });

  // Confere a tela e o estado do jogo e decide o bilhete do momento.
  function tick() {
    if (!active()) { hideNote(); return; }
    const app = doc.getElementById('app');
    if (!app || app.hidden || !endEl.hidden) { hideNote(); return; }
    const s = state();
    if ((s.day || 1) > 1) { finish({ silent: true }); return; }
    const sheet = openSheet();
    const sheetId = sheet ? sheet.id : '';
    const hasOrder = (s.orders || []).some((o) => o.id === TUTORIAL_ORDER.id && o.customerId === TUTORIAL_ORDER.customerId);
    const hasCura = (s.inventory?.cura || 0) > 0;
    let step = profile.step;

    // a Vovó já foi embora (entregue ou mandada embora): segue para o dia livre
    if (GUIDED.has(step) && !hasOrder && !wait) { setStep(s.phase === 'closed' ? 'zuleica' : 'sozinha'); return; }
    if (s.phase === 'closed' && (step === 'livre' || step === 'sozinha')) { if (!wait) later('zuleica', 2200); hideNote(); return; }

    if (GUIDED.has(step) && step !== 'entregar' && step !== 'descoberta' && hasCura && !BREWING.has(step)) step = 'entregar';
    if (BREWING.has(step) && hasCura) step = sheetId === 'sheet-caldeirao' ? 'descoberta' : 'entregar';
    if (step === 'livro' && sheetId === 'sheet-livro') {
      const tab = sheet.querySelector('.book-tab[data-id="ingredientes"]');
      step = tab && tab.getAttribute('aria-selected') === 'true' ? 'ler' : 'herbario';
    }
    if (step === 'herbario') {
      if (sheetId !== 'sheet-livro') step = 'livro';
      else if (sheet.querySelector('.book-tab[data-id="ingredientes"]')?.getAttribute('aria-selected') === 'true') step = 'ler';
    }
    if (step === 'ler' && sheetId !== 'sheet-livro') step = 'caldeirao';
    if (step === 'caldeirao' && sheetId === 'sheet-caldeirao') step = 'misturar';
    if (BREWING.has(step) && sheetId !== 'sheet-caldeirao') step = 'caldeirao';
    if (step === 'descoberta' && !sheetId) step = 'entregar';
    if (step === 'zuleica' && sheetId === 'sheet-mercador') step = 'banca';
    if (step !== profile.step) { profile.step = step; save(); }

    // passos sem bilhete visível: o dia livre, a espera e as folhas que não fazem parte do passo
    const quiet = step === 'livre'
      || (step === 'sozinha' && !!sheetId)
      || (step === 'balcao' && !!sheetId)
      || (step === 'amanha' && !!sheetId)
      || (step === 'zuleica' && !!sheetId)
      || (step === 'entregar' && sheetId && sheetId !== 'sheet-prateleira');
    if (quiet || wait) hideNote();
    else showNote(step);
  }

  function startLoop() {
    if (timer) return;
    timer = setInterval(tick, 250);
  }

  function stopLoop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function showEnd() {
    hideNote();
    const name = profile.name;
    endEl.innerHTML = `
      <div class="intro-sheet">
        <article class="intro-page">
          ${artHTML('caldeirao')}
          <p class="intro-kicker">${esc(name ? `Caderno de ${name}` : 'Caderno da boticária')}</p>
          <h2 id="tut-end-title" class="intro-title">${esc(TUTORIAL_END.title)}</h2>
          <p class="intro-text">${esc(TUTORIAL_END.text)}</p>
          <ul class="tut-tips">${TUTORIAL_END.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        </article>
        <footer class="intro-foot">
          <div class="intro-btns"><button type="button" class="btn btn-primary" data-intro="next">${esc(TUTORIAL_END.action)}</button></div>
        </footer>
      </div>`;
    endEl.hidden = false;
    doc.documentElement.classList.add('intro-open');
    setTimeout(() => endEl.querySelector('[data-intro="next"]')?.focus({ preventScroll: true }), 30);
  }
  endEl.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-intro="next"]')) {
      endEl.hidden = true;
      endEl.innerHTML = '';
      doc.documentElement.classList.remove('intro-open');
    }
  });
  endEl.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') endEl.querySelector('[data-intro="next"]')?.click();
  });

  function finish({ silent = false } = {}) {
    if (wait) { clearTimeout(wait); wait = null; }
    profile.step = 'feito';
    save();
    hideNote();
    stopLoop();
    if (!silent) showEnd();
  }

  // Eventos vindos do main.js (depois que a ação deu certo).
  function event(type, data = {}) {
    if (!active()) return;
    const step = profile.step;
    if (type === 'mix' && (BREWING.has(step) || step === 'caldeirao')) {
      if (data.recipeId === 'cura') setStep('descoberta');
      else if (!data.recipeId) setStep('lodo');
      else setStep('outra');
    } else if (type === 'deliver' && data.correct && data.potionId === TUTORIAL_ORDER.potionId && GUIDED.has(step)) {
      // espera a Vovó agradecer e sair do balcão
      hideNote();
      later('sozinha', 2600);
    } else if (type === 'nextDay') {
      finish();
    }
  }

  return {
    start(name) {
      profile = { step: 'balcao', name: cleanName(name) };
      save();
      applyBookName(doc, profile.name);
      startLoop();
      tick();
    },
    resume() {
      profile = readProfile();
      applyBookName(doc, profile.name);
      if (active()) { startLoop(); tick(); }
    },
    pause() { hideNote(); },
    reset() {
      if (wait) { clearTimeout(wait); wait = null; }
      profile = { step: 'feito', name: '' };
      save();
      hideNote();
      stopLoop();
    },
    event,
    isActive: active,
    getName: () => profile.name,
  };
}
