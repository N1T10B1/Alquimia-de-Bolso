// Menu principal (tela inicial): botões "fita marcadora" sobre o fundo em xilogravura,
// mais as páginas de papel de confirmação, opções, créditos e livro de receitas.
import { buildBookHTML } from './ui.js';

export function createMenu(doc, handlers) {
  const byId = (id) => doc.getElementById(id);
  const screen = byId('menu-screen');
  const app = byId('app');
  const list = byId('menu-list');
  const note = byId('menu-note');
  const continueItem = byId('menu-item-continue');
  const dialogs = {
    confirm: byId('confirm-dialog'),
    options: byId('options-dialog'),
    credits: byId('credits-dialog'),
    book: byId('book-dialog'),
  };
  const opt = {
    sound: byId('opt-sound'),
    volume: byId('opt-volume'),
    volumeOut: byId('opt-volume-out'),
    motion: byId('opt-motion'),
    relaxed: byId('opt-relaxed'),
  };
  let opener = null;

  const call = (name, ...args) => {
    const fn = handlers && handlers[name];
    if (typeof fn === 'function') {
      try { return fn(...args); } catch (err) { console.error(`[menu] ${name} falhou`, err); }
    }
    return undefined;
  };

  const buttons = () => [...list.querySelectorAll('.mb')].filter((b) => !b.closest('[hidden]'));

  function select(btn) {
    for (const b of list.querySelectorAll('.mb')) b.classList.toggle('is-on', b === btn);
  }

  function show(message = '') {
    const saved = !!call('hasSave');
    continueItem.hidden = !saved;
    // botão principal: Continuar se houver caderno salvo, senão Novo jogo
    for (const b of list.querySelectorAll('.mb')) b.classList.remove('primary');
    const primary = list.querySelector(saved ? '[data-menu="continue"]' : '[data-menu="new"]');
    primary.classList.add('primary');
    if (note) note.textContent = message;
    if (app) app.hidden = true;
    screen.hidden = false;
    select(primary);
    primary.focus({ preventScroll: true });
  }

  function hide() {
    screen.hidden = true;
    if (app) app.hidden = false;
  }

  function openDialog(d) {
    if (!d) return;
    opener = doc.activeElement;
    try { d.showModal(); } catch { d.setAttribute('open', ''); }
  }

  function closeDialog(d) {
    if (!d) return;
    try { if (d.open) d.close(); } catch { d.removeAttribute('open'); }
  }

  function fillOptions() {
    const o = call('getOptions') || {};
    opt.sound.checked = !!o.sound;
    opt.volume.value = String(o.volume ?? 50);
    opt.volumeOut.value = String(o.volume ?? 50);
    opt.motion.checked = !!o.reduceMotion;
    if (opt.relaxed) opt.relaxed.checked = !!o.relaxed;
    for (const r of doc.querySelectorAll('input[name="opt-size"]')) r.checked = r.value === (o.textSize || 'normal');
    for (const r of doc.querySelectorAll('input[name="opt-quality"]')) r.checked = r.value === (o.quality || 'alta');
  }

  function readOptions() {
    const size = doc.querySelector('input[name="opt-size"]:checked');
    const quality = doc.querySelector('input[name="opt-quality"]:checked');
    return {
      sound: opt.sound.checked,
      volume: Number(opt.volume.value),
      reduceMotion: opt.motion.checked,
      relaxed: !!(opt.relaxed && opt.relaxed.checked),
      textSize: size ? size.value : 'normal',
      quality: quality ? quality.value : 'alta',
    };
  }

  function openOptions() { fillOptions(); openDialog(dialogs.options); }

  function activate(action) {
    switch (action) {
      case 'continue': call('onContinue'); break;
      case 'new':
        if (call('hasSave')) openDialog(dialogs.confirm);
        else call('onNewGame');
        break;
      case 'book': {
        const content = byId('book-dialog-content');
        if (content) content.innerHTML = buildBookHTML(call('getState') || {}, { interactive: false });
        openDialog(dialogs.book);
        break;
      }
      case 'options': openOptions(); break;
      case 'credits': openDialog(dialogs.credits); break;
      default: break;
    }
  }

  // ---------- eventos do menu ----------
  list.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.mb');
    if (btn) activate(btn.dataset.menu);
  });
  list.addEventListener('mouseover', (ev) => {
    const btn = ev.target.closest('.mb');
    if (!btn || btn.classList.contains('is-on')) return;
    select(btn);
    // o foco acompanha o mouse, para nunca haver duas opções marcadas
    if (list.contains(doc.activeElement)) btn.focus({ preventScroll: true });
  });
  list.addEventListener('focusin', (ev) => {
    const btn = ev.target.closest('.mb');
    if (btn) select(btn);
  });
  list.addEventListener('keydown', (ev) => {
    const all = buttons();
    const i = all.indexOf(doc.activeElement);
    if (i < 0) return;
    let next = null;
    if (ev.key === 'ArrowDown') next = all[(i + 1) % all.length];
    else if (ev.key === 'ArrowUp') next = all[(i - 1 + all.length) % all.length];
    else if (ev.key === 'Home') next = all[0];
    else if (ev.key === 'End') next = all[all.length - 1];
    if (next) {
      ev.preventDefault();
      next.focus();
    }
  });

  // ---------- páginas de papel ----------
  for (const d of Object.values(dialogs)) {
    if (!d) continue;
    d.addEventListener('click', (ev) => {
      const action = ev.target.closest('[data-dialog]')?.dataset.dialog;
      if (action === 'close' || ev.target === d) closeDialog(d);
      if (action === 'confirm-new') {
        closeDialog(d);
        call('onNewGame');
      }
    });
    d.addEventListener('close', () => {
      if (opener && opener.isConnected && !screen.hidden) opener.focus();
      opener = null;
    });
  }
  const form = dialogs.options && dialogs.options.querySelector('form');
  if (form) {
    form.addEventListener('input', () => {
      opt.volumeOut.value = opt.volume.value;
      call('onOptions', readOptions());
    });
    form.addEventListener('change', () => call('onOptions', readOptions()));
  }

  return { show, hide, openOptions };
}
