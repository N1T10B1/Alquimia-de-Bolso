// Barra de rolagem do caderno (v1.12): substitui a barra nativa nas folhas, páginas de papel,
// abertura e conversa. Só aparece quando o conteúdo não cabe. A rolagem nativa (roda do mouse,
// toque, teclado) continua funcionando; a barra é um atalho visual e fica fora da leitura de tela.
// A arte vem do CSS (.rolagem*): trilho, alça e setas podem trocar para imagens sem mexer aqui.

const SCROLLERS = ['dialog.sheet > .sheet-body', 'dialog.dialog > .dialog-body', '.intro', '.talk'];
const STEP = 0.8; // seta e clique no trilho rolam 80% da altura visível

export function createScrollbars(doc) {
  const win = doc.defaultView;
  const bars = new Map();

  function make(el) {
    const host = el.parentElement;
    if (!host) return null;
    const rail = doc.createElement('div');
    rail.className = 'rolagem';
    rail.setAttribute('aria-hidden', 'true');
    rail.hidden = true;
    rail.innerHTML = '<span class="rolagem-seta rolagem-cima" data-dir="-1"></span>'
      + '<span class="rolagem-trilho"><span class="rolagem-alca"></span></span>'
      + '<span class="rolagem-seta rolagem-baixo" data-dir="1"></span>';
    host.append(rail);
    const track = rail.querySelector('.rolagem-trilho');
    const thumb = rail.querySelector('.rolagem-alca');
    const bar = { el, rail, track, thumb, frame: 0, fixed: getComputedStyle(el).position === 'fixed' };

    for (const arrow of rail.querySelectorAll('.rolagem-seta')) {
      arrow.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();
        el.scrollBy({ top: Number(arrow.dataset.dir) * el.clientHeight * STEP, behavior: 'smooth' });
      });
    }
    track.addEventListener('pointerdown', (ev) => {
      if (ev.target === thumb) return;
      ev.preventDefault();
      const r = thumb.getBoundingClientRect();
      el.scrollBy({ top: (ev.clientY < r.top ? -1 : 1) * el.clientHeight * STEP, behavior: 'smooth' });
    });
    thumb.addEventListener('pointerdown', (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      thumb.setPointerCapture(ev.pointerId);
      rail.classList.add('is-dragging');
      const startY = ev.clientY;
      const startTop = el.scrollTop;
      const room = track.clientHeight - thumb.offsetHeight;
      const max = el.scrollHeight - el.clientHeight;
      const move = (e) => { if (room > 0) el.scrollTop = startTop + ((e.clientY - startY) / room) * max; };
      const up = () => {
        rail.classList.remove('is-dragging');
        thumb.removeEventListener('pointermove', move);
        thumb.removeEventListener('pointerup', up);
        thumb.removeEventListener('pointercancel', up);
      };
      thumb.addEventListener('pointermove', move);
      thumb.addEventListener('pointerup', up);
      thumb.addEventListener('pointercancel', up);
    });

    el.addEventListener('scroll', () => schedule(bar), { passive: true });
    new MutationObserver(() => schedule(bar)).observe(el, { childList: true, subtree: true, characterData: true });
    if (win.ResizeObserver) new win.ResizeObserver(() => schedule(bar)).observe(el);
    // folhas e páginas abrem e fecham: mede de novo quando o pai muda de estado
    new MutationObserver(() => schedule(bar)).observe(host, { attributes: true, attributeFilter: ['open', 'hidden', 'class'] });
    new MutationObserver(() => schedule(bar)).observe(el, { attributes: true, attributeFilter: ['hidden', 'class'] });
    host.addEventListener('animationend', () => schedule(bar));
    rail.addEventListener('pointerdown', (ev) => ev.stopPropagation());
    el.dataset.rolagem = '';
    return bar;
  }

  function schedule(bar) {
    if (bar.frame) return;
    bar.frame = win.requestAnimationFrame(() => { bar.frame = 0; update(bar); });
  }

  function update(bar) {
    const { el, rail, track, thumb } = bar;
    const max = el.scrollHeight - el.clientHeight;
    const show = max > 2 && el.clientHeight > 0 && el.getClientRects().length > 0;
    rail.hidden = !show;
    if (show) el.dataset.rola = ''; else delete el.dataset.rola;
    if (!show) return;
    // posiciona o trilho na borda direita do que rola, no sistema do pai (folha, página, cena)
    const box = el.getBoundingClientRect();
    const base = bar.fixed ? { top: 0, left: 0 } : (rail.offsetParent || doc.body).getBoundingClientRect();
    const inset = parseFloat(getComputedStyle(rail).getPropertyValue('--rolagem-recuo')) || 4;
    rail.style.position = bar.fixed ? 'fixed' : 'absolute';
    rail.style.top = `${box.top - base.top + inset}px`;
    rail.style.height = `${Math.max(0, el.clientHeight - inset * 2)}px`;
    rail.style.left = `${box.left - base.left + el.clientWidth - rail.offsetWidth - inset}px`;
    const room = track.clientHeight;
    const size = Math.max(Math.min(room, 34), room * (el.clientHeight / el.scrollHeight));
    thumb.style.height = `${size}px`;
    thumb.style.transform = `translateY(${(room - size) * (el.scrollTop / max)}px)`;
    rail.classList.toggle('no-topo', el.scrollTop <= 1);
    rail.classList.toggle('no-fim', el.scrollTop >= max - 1);
  }

  function scan() {
    for (const sel of SCROLLERS) {
      for (const el of doc.querySelectorAll(sel)) {
        if (!bars.has(el)) { const bar = make(el); if (bar) bars.set(el, bar); }
      }
    }
    for (const bar of bars.values()) schedule(bar);
  }

  scan();
  win.addEventListener('resize', () => { for (const bar of bars.values()) schedule(bar); });
  // a abertura cria a página dela depois; observa o body só para achar novos elementos que rolam
  new MutationObserver(() => {
    for (const sel of SCROLLERS) for (const el of doc.querySelectorAll(sel)) if (!bars.has(el)) { scan(); return; }
  }).observe(doc.body, { childList: true });
  return { refresh: scan };
}
