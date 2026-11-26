# Contratos entre módulos — Alquimia de Bolso

Definido pelo orquestrador antes da implementação concorrente. Qualquer mudança neste contrato passa pelo orquestrador.

## Proprietários de arquivos

| Agente | Arquivos |
|---|---|
| A — Engine e dados | `src/data.js`, `src/engine.js` |
| B — Interface e experiência | `index.html`, `styles.css`, `src/ui.js`, `src/audio.js` |
| C — Progressão e persistência | `src/progression.js`, `src/storage.js` |
| D — QA e documentação | `tests/game.test.mjs`, `README.md` |
| Orquestrador | `src/main.js`, `docs/CONTRATOS.md`, `docs/STATUS.md`, integração |

Ninguém edita arquivo de outro proprietário. Demandas para outro módulo vão no relatório final do agente.

## Regras gerais

- ES modules puros (`export`), sem dependências externas. `data.js`, `engine.js`, `progression.js` e `storage.js` **não tocam no DOM** e precisam rodar no Node 22 (`node --test`).
- Todas as ações são **puras**: recebem `state` e nunca o modificam; devolvem um novo estado (use `structuredClone`).
- Aleatoriedade sempre por parâmetro `rng` (função que retorna número em `[0, 1)`), padrão `Math.random`.
- Dinheiro e XP são inteiros ≥ 0. Bônus de 25% usa `Math.floor`.

### Formato de retorno de ações

```js
// sucesso
{ ok: true, state: novoEstado, result: { /* específico da ação */ } }
// falha: estado devolvido é o MESMO objeto recebido (nada muda)
{ ok: false, state: estadoOriginal, error: { code: 'CODIGO', message: 'Mensagem em pt-BR para o jogador' } }
```

Códigos de erro: `INVALID_ID`, `INSUFFICIENT_STOCK`, `INSUFFICIENT_FUNDS`, `NOT_IN_INVENTORY`, `ALREADY_OWNED`, `LOCKED`, `NO_ALTERNATIVE`, `NOTHING_TO_HINT`, `INVALID_ORDER`, `WRONG_POTION`.

## Modelo de estado (v1)

```js
{
  version: 1,
  coins: 30,
  xp: 0,
  stock: { agua: 3, fogo: 3, planta: 3, cristal: 3, sombra: 3, luz: 3, cogumelo: 3, vento: 3 },
  inventory: {},            // { [itemId]: quantidade>0 } — itemId = id de receita ou 'lodo'; chaves com 0 são removidas
  discovered: [],           // ids de receitas na ordem da descoberta, sem repetição
  upgrades: { caldeirao: false, mercador: false, lupa: false },
  orders: [],               // até 3: { id: 'o1', customerId, potionId }
  orderSeq: 0,              // contador para gerar ids de pedido 'o' + n
  hints: {},                // { [recipeId]: ingredientId } — 1º ingrediente (campo `a`) da receita
  sound: false,
  victorySeen: false,       // o jogador já viu o aviso de vitória
  stats: { mixes: 0, failures: 0, sold: 0, delivered: 0, coinsEarned: 0, bestCoins: 30 }
}
```

`stats.bestCoins` = maior saldo já alcançado (atualizado sempre que `coins` aumenta).

## `src/data.js` (A)

```js
export const INGREDIENTS  // array de { id, name, cost, element, icon }  (icon = emoji)
export const RECIPES      // array de { id, a, b, name, price, rarity, icon } — 12, exatamente o GDD. rarity: 'comum'|'incomum'|'rara'
export const SLUDGE       // { id: 'lodo', name: 'Lodo Instável', price: 1, rarity: 'falha', icon }
export const UPGRADES     // array de { id, name, cost, description, icon } — ids: 'caldeirao'(30), 'mercador'(45), 'lupa'(25)
export const CUSTOMERS    // array de ≥ 8 { id, name, icon } (clientes fictícios)
export const CONFIG = {
  START_COINS: 30, START_STOCK: 3, XP_PER_MIX: 1, XP_DISCOVERY: 5, XP_DELIVERY: 3,
  XP_PER_LEVEL: 20, ORDER_SLOTS: 3, ORDER_BONUS: 3, REROLL_COST: 3, HINT_COST: 5,
  EFFICIENCY_CHANCE: 0.2, MERCHANT_BONUS: 0.25, TOTAL_RECIPES: 12,
}
export function getIngredient(id)   // objeto ou null
export function getRecipe(id)       // objeto ou null
export function getItem(id)         // receita, SLUDGE (para 'lodo') ou null
export function recipeKey(a, b)     // chave comutativa: ids ordenados unidos por '+'
export function findRecipe(a, b)    // receita ou null (comutativa)
```

Ordem dos ingredientes da receita (`a`, `b`) = ordem escrita no GDD (ex.: `sono` → a='cogumelo', b='agua'). A dica revela `a`.

## `src/engine.js` (A)

```js
export function createInitialState()                 // novo estado conforme modelo acima
export function getLevel(xp)                         // 1 + floor(xp/20)
export function getLevelProgress(xp)                 // { level, current, needed: 20, ratio }  current = xp % 20
export function sellPrice(state, itemId)             // preço com Marca do Mercador (não vale para 'lodo'); 0 se id inválido
export function orderReward(state, potionId)         // floor((price + 3) * 1.25) com mercador, senão price + 3
export function canMix(state, a, b)                  // { ok: true } | { ok: false, error }  (a===b exige stock >= 2)
export function mix(state, a, b, rng = Math.random)
//   result: { itemId, recipeId (null se lodo), isNew, free (Caldeirão poupou os 2 ingredientes), xpGained }
//   rng é chamado UMA vez e só se upgrades.caldeirao; free = rng() < 0.2. Consome ambos ou nenhum.
//   XP: +1 por mistura, +5 na primeira descoberta. stats.mixes++, stats.failures++ se lodo.
export function buyIngredient(state, ingredientId, qty = 1)  // result: { ingredientId, qty, cost }
export function sellItem(state, itemId)              // remove 1 do inventário; result: { itemId, price }
export function isVictory(state)                     // discovered.length === 12
export function addCoins(state, amount)              // utilitário puro p/ outros módulos: soma, atualiza coinsEarned e bestCoins; devolve novo estado
```

## `src/progression.js` (C) — importa de `data.js` e `engine.js`

```js
export function fillOrders(state, rng = Math.random)
//   Devolve novo estado (NÃO o envelope {ok}). Completa `orders` até 3 com poções de `discovered`.
//   Sem descobertas → orders vazio. Evita poção repetida entre pedidos simultâneos enquanto houver variedade
//   (com < 3 descobertas, pode repetir). Idempotente se já houver 3 pedidos. Remove pedidos inválidos.
export function deliverOrder(state, orderId, rng = Math.random)
//   Exige a poção no inventário. Consome 1, paga orderReward, +3 XP, stats.delivered++,
//   substitui o pedido NA MESMA POSIÇÃO por um novo válido (evitando duplicar poções dos outros pedidos e,
//   se possível, a mesma poção recém-entregue). result: { orderId, potionId, reward }
export function canReroll(state, orderId)            // boolean: existe poção alternativa (diferente da atual e das dos outros pedidos)? (ignora dinheiro)
export function rerollOrder(state, orderId, rng = Math.random)
//   Custa 3 moedas. Erros: INVALID_ORDER, NO_ALTERNATIVE, INSUFFICIENT_FUNDS. result: { orderId, potionId }
export function buyUpgrade(state, upgradeId)         // erros: INVALID_ID, ALREADY_OWNED, INSUFFICIENT_FUNDS. result: { upgradeId, cost }
export function canRequestHint(state)                // { ok } | { ok:false, error } (LOCKED sem lupa, NOTHING_TO_HINT, INSUFFICIENT_FUNDS)
export function requestHint(state, rng = Math.random)
//   Exige lupa. Escolhe receita não descoberta, preferindo as sem dica; se todas já têm dica, repete uma
//   (cobra mesmo assim). Não cobra se não houver receitas a descobrir. Grava hints[id] = receita.a.
//   result: { recipeId, ingredientId, repeated }
export function getRecipeBook(state)
//   Array das 12 receitas na ordem de RECIPES:
//   { id, discovered, name, icon, rarity, price, ingredients: [a,b] | null, hint: ingredientId | null }
//   Desconhecida: name '???' (mas se houver dica, mostra o nome real), icon '❔', ingredients null.
```

## `src/storage.js` (C) — importa `createInitialState` de `engine.js`

```js
export const SAVE_KEY = 'alquimia-de-bolso-save-v1'
export function sanitizeState(raw)   // qualquer valor → estado v1 válido (campos inválidos voltam ao padrão; ids desconhecidos descartados; números inteiros ≥ 0)
export function loadGame(storage = globalThis.localStorage)   // { state, status: 'new' | 'loaded' | 'corrupt' } — nunca lança
export function saveGame(state, storage = globalThis.localStorage)   // true/false — nunca lança
export function clearSave(storage = globalThis.localStorage)  // remove APENAS SAVE_KEY; true/false
```

## `src/ui.js` (B) — único módulo (com `main.js`) que toca no DOM

```js
export function createUI(root, handlers)  // root = document; devolve a API abaixo
// handlers (fornecidos pelo main.js), todos síncronos:
//   onBuy(ingredientId), onMix(a, b), onSell(itemId), onDeliver(orderId), onReroll(orderId),
//   onBuyUpgrade(upgradeId), onHint(), onToggleSound(), onNewGame()  // onNewGame só é chamado APÓS confirmação na UI
// API:
//   render(state)                 // redesenha tudo a partir do estado (pode usar funções de consulta da engine/progression)
//   showMixResult(result, state)  // animação + texto do resultado do mix (result do engine.mix)
//   notify(message, tone)         // tone: 'info' | 'success' | 'error'; escreve em região aria-live
//   showVictory()                 // diálogo/mensagem de vitória 12/12 (jogo continua)
//   showHint(result)              // exibe a dica recebida
```

A UI guarda apenas estado de interface (seleção do caldeirão, aba ativa). Não calcula preços/regras por conta própria: usa `sellPrice`, `orderReward`, `canMix`, `canReroll`, `canRequestHint`, `getRecipeBook`, `getLevelProgress`, `CONFIG`.

Elementos com ids fixos para o orquestrador e testes manuais: `#app`, `#live-region`.

## `src/audio.js` (B)

```js
export function createAudio()  // { setEnabled(bool), isEnabled(), play(name) }
// names: 'click' | 'mix' | 'discover' | 'coin' | 'error'. AudioContext criado preguiçosamente no 1º play habilitado.
// Nunca lança (navegadores sem Web Audio → silencioso).
```

## `src/main.js` (orquestrador)

Carrega save, aplica `fillOrders`, cria UI e áudio, e implementa `dispatch(action)`: executa a ação → se `ok`, `fillOrders` → `saveGame` → `render` → feedback/som; se falhar, `notify(error.message, 'error')` + som de erro. Vitória exibida uma vez (`victorySeen`).

## Ajustes de integração (orquestrador)

- `fillOrders` também troca a poção de pedidos repetidos (mantendo id e cliente) quando existe poção descoberta livre.
- `styles.css`: regra `[hidden] { display: none !important; }` para a troca de abas funcionar.
- Códigos adotados: `buyIngredient` com qty inválida → `INVALID_ID`; entregar sem a poção → `NOT_IN_INVENTORY`; `rerollOrder` gera novo id na mesma posição (`result.newOrderId`).

## v1.1 — ideias 1 a 6 da pesquisa de jogos parecidos

Estado ganhou `reputation`, `freeHintReadyAt` (ms) e `failedPairs` (chaves `recipeKey`). Pedidos ganharam `clue` (0|1) e `misses`.

- `data.js`: `INGREDIENTS[].quality`, `RECIPES[].category` e `RECIPES[].clues` (2 frases), `CATEGORIES`, `CONFIG.FREE_HINT_COOLDOWN_MS` (4 min) e `CONFIG.REVEAL_AFTER_MISSES` (2).
- `engine.js`: `mix` registra pares que viram lodo; `isKnownFailure(state, a, b)`.
- `progression.js`: `deliverOrder(state, orderId, rng, givenPotionId?)` (poção errada: `ok:true`, `result.correct:false`, não consome, −1 reputação, `misses++`); `getOrderClues(order)`, `isOrderRevealed(order)`; `requestFreeHint(state, now, rng)`, `canRequestFreeHint(state, now)`, `freeHintWaitMs(state, now)` (código `COOLDOWN`); `sludgeClue(state, a, b)`; `getRecipeBookByCategory(state)`; `getRecipeBook` traz `category` e `order` (selo).
- `ui.js`: handlers novos `onDeliver(orderId, potionId)` e `onFreeHint()`; ações `give`, `remake` e `free-hint`.

## v1.2 — fontes, textos e menu principal

- `storage.js`: `OPTIONS_KEY`, `TEXT_SIZES`, `defaultOptions()`, `sanitizeOptions(raw)`, `loadOptions(storage)` → `{ options, found }`, `saveOptions(options, storage)`, `hasSave(storage)`. Opções: `{ sound, volume (0–100), reduceMotion, textSize: 'normal'|'grande'|'maior' }`.
- `audio.js`: `setVolume(0–100)` (50 = volume original).
- `ui.js`: `buildBookHTML(state, { interactive })` exportado (o menu usa sem botões); handler novo `onMenu()`; API nova `resetView()`. A confirmação de Novo jogo saiu da bancada e foi para o menu.
- `menu.js` (novo): `createMenu(document, { hasSave, getState, getOptions, onOptions, onContinue, onNewGame })` → `{ show(message?), hide() }`.
- `main.js`: começa no menu; aplica opções em `<html>` (`.reduce-motion`, `data-text-size`).
- `tools/build-standalone.mjs`: embute `fonts/` e `assets/` como data URIs no `jogar.html`.

## v1.3 — artes do Rafael e a loja com clientes

- `src/art.js` (novo): `ITEM_ART`, `CUSTOMER_ART`, `itemArt(id)` e `customerArt(customerId, mood)` com `mood` em `neutro | feliz | triste`. Os caminhos são textos literais `'assets/...webp'` de propósito: o `tools/build-standalone.mjs` troca cada um por um data: URI (e `art` entrou primeiro na ordem dos módulos).
- `ui.js`: API nova `showDelivery(result, customerId)` (reação do cliente; o `main.js` chama **antes** de gravar o estado novo, para o cliente satisfeito sair e o próximo entrar). Ações novas: `open-sheet` (`livro`, `caldeirao`, `prateleira`, `utensilios`), `close-sheet`, `call` (chama um cliente da fila). `give` agora recebe o id da poção e entrega ao cliente do balcão. Saíram as abas e o seletor de poção dos bilhetes.
- Depois de misturar, os dois espaços do caldeirão voltam vazios (repetir: atalhos de receita).
- Sem mudanças em `data.js`, `engine.js`, `progression.js` e `storage.js`: o save continua na versão 1.

## v1.4 — dias de atendimento

- Estado (save continua `version: 1`, campos novos sanitizados): `day` (≥ 1), `phase` (`'open' | 'closed'`), `plan` `{ total, arrived, served, sentAway, earned, novel, startCoins, asked[], visitors[] }`, `lastPotion`, `lastCustomer`, `stats.dismissed`. Pedido ganhou `novel` (boolean) e `clue` agora vai de 0 a 3.
- `data.js`: `MERCHANT` (a Mercadora Zuleica saiu de `CUSTOMERS`), `customersForDay(day)`, CONFIG `DAY_FIRST_CUSTOMERS`, `DAY_GROWTH`, `DAY_MAX_CUSTOMERS`, `NOVEL_CHANCE`, `NOVEL_BONUS`, `NOVEL_XP`, `RARITY_FROM_DAY`. Saiu `REROLL_COST`. Cada receita tem 4 pistas.
- `engine.js`: `newDayPlan(day, startCoins)`.
- `progression.js`: `fillOrders` agora só traz os clientes previstos do dia (pode pedir receita fora do caderno); `deliverOrder` remove o cliente atendido (bônus em pedido inédito, `result.bonus`, `result.novel`); novos `dismissOrder`, `isDayOver`, `closeDay` (resultado com o resumo e `aid`), `isMerchantHere`, `buyFromMerchant` (erro `MERCHANT_AWAY` de dia), `startNextDay` (erro `DAY_OPEN`). Saíram `canReroll` e `rerollOrder`. `buyIngredient` da engine continua sem trava (a trava fica em `buyFromMerchant`).
- `dialogue.js` (novo): `LINES[customerId].{greet, thanks, sad, leave}`, `NOVEL_HINTS`, `MERCHANT_LINES`, `lineFor(customerId, kind, seed)` e `pickLine(list, seed)` (escolha estável por pedido).
- `ui.js`: handlers novos `onDismiss(orderId)`, `onNextDay()`, `onBuy(id, qty)`; API nova `showDismiss(result)` e `markAid(day)`; folha nova `mercador`. O `main.js` fecha o dia sozinho em `commit` quando `isDayOver`.
