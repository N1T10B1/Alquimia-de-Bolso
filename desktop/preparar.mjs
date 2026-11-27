// Copia o jogar.html da raiz para desktop/dist/index.html, que é a página que o Tauri abre.
// Uso: node preparar.mjs (o "npm run build" já chama este script antes do tauri build).
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const origem = join(aqui, '..', 'jogar.html');
if (!existsSync(origem)) {
  console.error('Não achei o jogar.html na raiz. Rode antes: node tools/build-standalone.mjs');
  process.exit(1);
}
mkdirSync(join(aqui, 'dist'), { recursive: true });
copyFileSync(origem, join(aqui, 'dist', 'index.html'));
console.log('jogar.html copiado para desktop/dist/index.html');
