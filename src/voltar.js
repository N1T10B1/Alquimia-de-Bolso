// v1.29 — botão voltar do celular (Android, app Tauri) e a página de Pausa.
// O voltar faz uma coisa por vez, sempre "um passo para trás":
//   1. uma página aberta (livro, caldeirão, prateleira, opções, pausa...) → fecha e volta ao balcão;
//   2. no balcão, sem nada aberto → abre a Pausa;
//   3. no menu principal → sai do app.
// História de abertura, fim de jogo e fim da demo têm botões próprios: lá o voltar não faz nada.
// No computador, Esc no balcão também abre a Pausa (Esc já fecha as páginas sozinho).

export function createBackButton(doc, { onPause, onResume, onMenu, openOptions } = {}) {
  const byId = (id) => doc.getElementById(id);
  const pause = byId('pause-dialog');
  const app = byId('app');
  const menuScreen = byId('menu-screen');

  const visible = (el) => !!el && !el.hidden;
  // telas que o voltar não deve atravessar
  const blocking = () => visible(byId('intro'))
    || [...doc.querySelectorAll('.tut-end, #gameover, #fimdemo')].some(visible);
  // a página de papel por cima de tudo (a última aberta fica depois no HTML)
  const topDialog = () => [...doc.querySelectorAll('dialog[open]')].pop() || null;
  const inShop = () => visible(app) && !visible(menuScreen);

  function openPause() {
    if (!pause || pause.open || !inShop()) return;
    try { pause.showModal(); } catch { pause.setAttribute('open', ''); }
    onPause?.();
  }
  function closeDialog(d) {
    try { if (d.open) d.close(); else d.removeAttribute('open'); } catch { d.removeAttribute('open'); }
  }

  if (pause) {
    pause.addEventListener('click', (ev) => {
      const action = ev.target.closest('[data-pause]')?.dataset.pause;
      if (ev.target === pause || action === 'resume') closeDialog(pause);
      else if (action === 'options') openOptions?.();
      else if (action === 'menu') { closeDialog(pause); onMenu?.(); }
    });
    pause.addEventListener('close', () => {
      // as Opções abertas por cima da Pausa fecham junto
      const opts = byId('options-dialog');
      if (opts && opts.open) closeDialog(opts);
      // o evento chega depois: se foi para o menu principal, a loja já está escondida
      if (inShop()) onResume?.();
    });
  }

  // Um passo para trás. Devolve false quando não há para onde voltar (menu principal: sair).
  function back() {
    if (blocking()) return true;
    const d = topDialog();
    if (d) { closeDialog(d); return true; }
    if (inShop()) { openPause(); return true; }
    return false;
  }

  doc.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape' || ev.defaultPrevented) return;
    if (blocking() || topDialog() || !inShop()) return;
    ev.preventDefault();
    openPause();
  });

  // Android (app Tauri): o Tauri entrega o botão voltar para a página em vez de fechar o app.
  const tauriApp = globalThis.__TAURI__ && globalThis.__TAURI__.app;
  const android = /Android/i.test(globalThis.navigator?.userAgent || '');
  if (tauriApp && android && typeof tauriApp.onBackButtonPress === 'function') {
    tauriApp.onBackButtonPress(() => {
      if (back()) return;
      Promise.resolve(tauriApp.exit?.(0)).catch(() => {});
    }).catch((err) => console.warn('[voltar] botão voltar indisponível', err));
  }

  return { back, openPause, isPaused: () => !!(pause && pause.open) };
}
