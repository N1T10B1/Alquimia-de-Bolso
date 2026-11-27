// Gera `jogar.html`: um único arquivo que abre com duplo clique (file://), sem servidor.
// Junta styles.css e os módulos de src/ num <script> clássico, cada módulo em seu próprio escopo.
// Uso: node tools/build-standalone.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORDER = ['idioma', 'en', 'art', 'data', 'dialogue', 'engine', 'progression', 'storage', 'ui', 'menu', 'audio', 'story', 'abertura', 'rolagem', 'noite', 'voltar', 'main'];

function bundleModule(name) {
  let code = readFileSync(join(root, 'src', `${name}.js`), 'utf8');
  code = code.replace(/import\s*\{([^}]*)\}\s*from\s*'\.\/([a-z]+)\.js';/g,
    (_, names, mod) => `const {${names}} = __mods.${mod};`);
  if (/^\s*import\s/m.test(code)) throw new Error(`Import não suportado em ${name}.js`);
  const exported = [];
  code = code.replace(/^export\s+(function|const|let|class)\s+([A-Za-z_$][\w$]*)/gm, (_, kw, id) => {
    exported.push(id);
    return `${kw} ${id}`;
  });
  if (/^\s*export\s/m.test(code)) throw new Error(`Export não suportado em ${name}.js`);
  return `// ---- src/${name}.js ----\n__mods.${name} = (() => {\n${code}\nreturn { ${exported.join(', ')} };\n})();\n`;
}

const MIME = { woff2: 'font/woff2', webp: 'image/webp', png: 'image/png', svg: 'image/svg+xml' };
const dataUri = (rel) => {
  const ext = rel.split('.').pop();
  if (!MIME[ext]) throw new Error(`Tipo de arquivo sem MIME: ${rel}`);
  return `data:${MIME[ext]};base64,${readFileSync(join(root, rel)).toString('base64')}`;
};
// Caminhos de arte escritos como texto no JS (src/art.js) também viram data: URIs.
const inlineAssets = (code) => code.replace(/'(assets\/[^']+)'/g, (_, rel) => `'${dataUri(rel)}'`);

// v1.29: o CSS e o JS saem em pedaços, com um aviso à tela de carregamento entre eles, para o
// frasco encher conforme o arquivo de 10 MB chega (no itch.io ele vem pela rede).
const avisa = (p) => `<script>window.__carga && __carga.etapa(${p.toFixed(2)});</script>`;
const jsMods = ORDER.map((m) => `(() => {\n'use strict';\nconst __mods = window.__alquimiaMods;\n${inlineAssets(bundleModule(m))}})();\n`);
const js = jsMods.join('');
// Fontes e imagens referenciadas no CSS viram data: URIs, para o arquivo único funcionar offline.
const inlineCss = (file) => readFileSync(join(root, file), 'utf8').replace(/url\("((?:fonts|assets)\/[^"]+)"\)/g, (_, rel) => `url("${dataUri(rel)}")`);
const css = inlineCss('styles.css');
// Tela de carregamento (v1.29): CSS pequeno no <head>, pinta antes do styles.css grande (que fica no <body>).
const cssCarga = inlineCss('carregamento.css');

// Corta o CSS só entre regras de nível zero (fora de { }, comentários e aspas), em pedaços de ~600 KB.
function cortaCss(text, alvo = 600 * 1024) {
  const pedacos = []; let depth = 0; let ini = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '/' && text[i + 1] === '*') { i = text.indexOf('*/', i + 2) + 1; if (i === 0) throw new Error('Comentário CSS aberto'); continue; }
    if (c === '"' || c === "'") { const f = text.indexOf(c, i + 1); if (f < 0) throw new Error('Aspas CSS abertas'); i = f; continue; }
    if (c === '{') depth++;
    else if (c === '}' && --depth === 0 && i + 1 - ini >= alvo) { pedacos.push(text.slice(ini, i + 1)); ini = i + 1; }
  }
  if (depth !== 0) throw new Error('Chaves do CSS desbalanceadas');
  pedacos.push(text.slice(ini));
  return pedacos;
}
const cssPedacos = cortaCss(css);
if (cssPedacos.join('') !== css) throw new Error('Corte do CSS perdeu conteúdo');
const total = css.length + js.length;
let lido = 0;
const passo = (n) => { lido += n; return avisa(0.15 + 0.67 * (lido / total)); };
const cssHtml = cssPedacos.map((c) => `<style>\n${c}\n</style>\n${passo(c.length)}`).join('\n');
const jsHtml = `<script>window.__alquimiaMods = {};</script>\n` + jsMods.map((m) => `<script>\n${m}</script>\n${passo(m.length)}`).join('\n');

let html = readFileSync(join(root, 'index.html'), 'utf8');
if (/<\/script/i.test(js) || /<\/style/i.test(css + cssCarga)) throw new Error('Conteúdo com </script> ou </style>');

html = html.replace(/<link rel="stylesheet" href="carregamento\.css">/, () => `<style>\n${cssCarga}\n</style>`);
html = html.replace(/<link rel="stylesheet" href="styles\.css">/, () => cssHtml);
html = html.replace(/<script type="module" src="src\/main\.js"><\/script>/, () => jsHtml);
if (/<link rel="stylesheet"|type="module"/.test(html)) throw new Error('Substituição falhou');
html = html.replace('<head>', '<head>\n  <!-- Arquivo gerado por tools/build-standalone.mjs. Edite os fontes em src/ e styles.css. -->');
writeFileSync(join(root, 'jogar.html'), html);
console.log(`jogar.html gerado (${(html.length / 1024).toFixed(1)} KB)`);
