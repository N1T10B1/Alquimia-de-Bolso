// v1.30 — idioma do jogo: português (pt) ou inglês (en).
// A escolha fica guardada à parte das opções (chave própria). Sem escolha guardada, segue o idioma
// do navegador: português para quem usa pt-*, inglês para o resto. No Node (testes) é sempre
// português, a não ser que `globalThis.ALQUIMIA_IDIOMA` force outro.
// Trocar de idioma recarrega a página: os textos são escolhidos uma vez, quando o jogo abre.

export const IDIOMA_KEY = 'alquimia-de-bolso-idioma-v1';
export const IDIOMAS = Object.freeze(['pt', 'en']);

function detecta() {
  const forcado = globalThis.ALQUIMIA_IDIOMA;
  if (IDIOMAS.includes(forcado)) return forcado;
  try {
    const salvo = globalThis.localStorage && globalThis.localStorage.getItem(IDIOMA_KEY);
    if (IDIOMAS.includes(salvo)) return salvo;
  } catch { /* sem armazenamento */ }
  if (typeof document === 'undefined') return 'pt';
  const nav = globalThis.navigator || {};
  const pref = (nav.languages && nav.languages[0]) || nav.language || 'pt';
  return /^pt\b/i.test(pref) ? 'pt' : 'en';
}

export const LANG = detecta();
export const EN = LANG === 'en';

// L('texto em português', 'English text'): devolve o do idioma atual.
export function L(pt, en) { return EN ? en : pt; }

// Guarda o idioma escolhido (quem chama recarrega a página).
export function guardaIdioma(lang) {
  if (!IDIOMAS.includes(lang)) return false;
  try { globalThis.localStorage.setItem(IDIOMA_KEY, lang); return true; } catch { return false; }
}

// Textos fixos do index.html: cada elemento traduzível traz o inglês em atributos data-en*.
//   data-en="..."      troca o texto (se houver ícone/campo dentro, só o último trecho de texto)
//   data-en-html="..." troca o HTML interno
//   data-en-<atributo>="..." troca o atributo (aria-label, title, placeholder, content...)
export function aplicaIdiomaHTML(doc) {
  if (!doc || !doc.documentElement) return;
  doc.documentElement.lang = EN ? 'en' : 'pt-BR';
  if (!EN) return;
  for (const el of doc.querySelectorAll('*')) {
    for (const { name, value } of [...el.attributes]) {
      if (!name.startsWith('data-en')) continue;
      if (name === 'data-en') trocaTexto(el, value);
      else if (name === 'data-en-html') el.innerHTML = value;
      else el.setAttribute(name.slice('data-en-'.length), value);
    }
  }
}

function trocaTexto(el, texto) {
  if (!el.children.length) { el.textContent = texto; return; }
  const nos = [...el.childNodes].filter((n) => n.nodeType === 3 && n.nodeValue.trim());
  const no = nos[nos.length - 1];
  if (!no) { el.appendChild(el.ownerDocument.createTextNode(texto)); return; }
  const antes = /^\s*/.exec(no.nodeValue)[0];
  const depois = /\s*$/.exec(no.nodeValue)[0];
  no.nodeValue = antes + texto + depois;
}
