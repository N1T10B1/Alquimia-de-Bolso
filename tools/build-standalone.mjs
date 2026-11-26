// Gera `jogar.html`: um único arquivo que abre com duplo clique (file://), sem servidor.
// Junta styles.css e os módulos de src/ num <script> clássico, cada módulo em seu próprio escopo.
// Uso: node tools/build-standalone.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORDER = ['art', 'data', 'dialogue', 'engine', 'progression', 'storage', 'ui', 'menu', 'audio', 'story', 'abertura', 'rolagem', 'noite', 'voltar', 'main'];

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

const js = `(() => {\n'use strict';\nconst __mods = {};\n${ORDER.map((m) => inlineAssets(bundleModule(m))).join('\n')}})();\n`;
// Fontes e imagens referenciadas no CSS viram data: URIs, para o arquivo único funcionar offline.
const css = readFileSync(join(root, 'styles.css'), 'utf8').replace(/url\("((?:fonts|assets)\/[^"]+)"\)/g, (_, rel) => `url("${dataUri(rel)}")`);
let html = readFileSync(join(root, 'index.html'), 'utf8');
if (/<\/script/i.test(js) || /<\/style/i.test(css)) throw new Error('Conteúdo com </script> ou </style>');

html = html.replace(/<link rel="stylesheet" href="styles\.css">/, () => `<style>\n${css}\n</style>`);
html = html.replace(/<script type="module" src="src\/main\.js"><\/script>/, () => `<script>\n${js}</script>`);
if (/<link rel="stylesheet"|type="module"/.test(html)) throw new Error('Substituição falhou');
html = html.replace('<head>', '<head>\n  <!-- Arquivo gerado por tools/build-standalone.mjs. Edite os fontes em src/ e styles.css. -->');
writeFileSync(join(root, 'jogar.html'), html);
console.log(`jogar.html gerado (${(html.length / 1024).toFixed(1)} KB)`);
