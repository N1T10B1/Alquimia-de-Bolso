# Status por frente

| Frente | Feito | Pendente | Bloqueado |
|---|---|---|---|
| Orquestrador | Contratos, main.js, integração, E2E no Chromium (desktop 1366px, celular 320/375px), zip | — | — |
| A — Engine e dados | data.js, engine.js (13 verificações próprias OK) | — | — |
| B — Interface | index.html, styles.css, ui.js, audio.js | — | — |
| C — Progressão/save | progression.js, storage.js (15 verificações próprias OK) | — | — |
| D — QA/docs | tests/game.test.mjs (73 testes), README.md | — | — |

Falhas de integração encontradas e corrigidas pelo orquestrador:
1. Aba "Livro de Receitas" não escondia a Oficina (`.workshop { display: grid }` vencia `[hidden]`).
2. Pedidos repetidos persistiam depois de haver variedade (ex.: 3× Névoa Fumegante até 12/12).
3. Rafael não tem Python: criado `jogar.html` (arquivo único, abre por `file://`) gerado por `tools/build-standalone.mjs`; E2E completo repetido via `file://` sem erros.

## v1.1 (20/11/2026)

Feito: pedidos por pistas com reputação, dica grátis a cada 4 min, grimório de combinações erradas com aviso no caldeirão, lodo com pista, categorias e selo no livro, refazer receita com um toque. 82 testes passando. Pendente (ideias 7–10 da pesquisa, esforço médio/alto): poções como ingredientes, passo de preparo, recorde por pedido/pedido do dia, clientes com mini-história.

## v1.2 (21/11/2026)

Feito: fontes Grenze Gotisch + Grenze + Alegreya Sans embutidas, textos reescritos no tom do caderno da boticária, menu principal (opção A, fita marcadora) com Continuar, Novo jogo, Livro, Opções e Créditos sobre os fundos de PC e celular. 85 testes passando. Pendente: artes dos itens e personagens (Rafael vai trazer) e o restyle da bancada para o papel do guia de arte.

## v1.3 (21/11/2026)

- Artes do Rafael no jogo: 8 ingredientes, 12 poções, Lodo, 3 utensílios, moeda, vela, sino, selo, caldeirão e os 10 clientes em 3 expressões, mais o fundo "Loja de Alquimia ao Pôr do Sol" (todas convertidas para WebP).
- Mapeamento: os nomes dos arquivos seguem o prompt de arte e não os nomes do jogo; cada um foi casado pela descrição. O Bardo Cirilo não tem expressão neutra (usa a feliz). Na Fada Lumi, o arquivo "Fada Lumi Decepcionada" é sorridente, então virou a expressão feliz, e "Fadinha Lumi Decepcionada" virou a triste.
- Nova tela de jogo: loja ao entardecer, cliente entrando até o balcão, caixa de diálogo com o pedido, fila de clientes, livro que desce ao arrastar para baixo, caldeirão com ingredientes em cartas, prateleira com poções em cartas, utensílios e dicas.
- Testes: 85/85. Verificado no Chromium em 1440×900, 1280×800, 390×844, 844×390 e 320px, por file:// e por http, sem erros no console e sem rolagem lateral.

## v1.4 (21/11/2026)

- Pedido do Rafael: acabar com a monotonia. Dias de atendimento (3, 4, 5… até 8 clientes por dia), fim do dia com resumo, mercadora só à noite, mandar cliente embora quando faltam ingredientes, pedidos que não se repetem, receitas novas pedidas com bônus e muitas variações de fala.
- Balanceamento conferido com uma simulação de 10 dias (jogador que acerta ~45% das tentativas de receita nova): o caderno fica completo entre os dias 5 e 6, cerca de 1 cliente por dia é mandado embora por falta de ingrediente, e a bolsa cresce de 30 para ~600 moedas no dia 10. Ainda falta um destino para as moedas no fim do jogo.
- Testes: 88/88. Verificado no Chromium (PC 1440×900, celular 390×844 e deitado 844×390), sem erros no console.

## v1.5 (21/11/2026)

- Caderno de ingredientes: aba "Ingredientes" no livro com anotação, propriedade e "ajuda em" de cada ingrediente (sem receitas). Atalho no caldeirão. Campos `lore`, `property`, `helps` em `INGREDIENTS` (src/data.js); `buildIngredientsHTML` em src/ui.js.

## v1.6 (21/11/2026)

- Molduras e botões em xilogravura (assets/ui, 14 peças) aplicados via border-image no bloco v1.6 de styles.css; divisória `.talk-divider` em src/ui.js.

## v1.7 (21/11/2026)

- Abertura do Novo jogo com a história aprovada pelo Rafael: 4 páginas (a Mestra Benvinda chega a Ladeira Torta, a botica no vão entre a padaria e o muro, o caderno em branco com o herbário, a partida para ver o mar), a carta da Mestra e a assinatura do caderno (nome opcional, vira o subtítulo do menu). Dá para voltar, pular a história (vai direto à assinatura) e usar o teclado (→, ←, Esc).
- Tutorial do dia 1 com bilhetes da Mestra presos na margem, um por passo, e um brilho de vela no alvo: Vovó Quitéria (sempre a primeira freguesa, pedindo Elixir de Cura) → fita do Livro → aba Ingredientes → caldeirão → Gota Lunar + Folha Viva (com bilhetes próprios se sair lodo ou outra receita) → entregar → resto do dia livre → Zuleica e a banca → abrir o dia 2 → página de fim com dicas. "Pular tutorial" em todos os bilhetes.
- Código: `src/story.js` (textos e `seedTutorialDay`, puro) e `src/abertura.js` (DOM). O progresso do tutorial e o nome ficam em `alquimia-de-bolso-tutorial-v1`, fora do save. Ganchos em `main.js` (onNewGame, onContinue, onMix, onDeliver, onNextDay, onMenu). CSS no bloco "v1.7" no fim de `styles.css`.
- Testes: 88 + 4 novos em `tests/story.test.mjs` (92/92). Fluxo completo do tutorial verificado no Chromium em 1440×900 e 390×844, mais retomada pelo Continuar, pular tutorial e Novo jogo sobre um save, sem erros no console.

## v1.8 (21/11/2026)

- Barra do topo com moldura e relógio de sol/lua (disco gira com o dia; lua da imagem do Rafael invertida no arquivo para ficar em pé à noite). Livro-caixa do fim do dia (sheet `caixa`), aberto 2,4 s após o fechamento.

## v1.9 (21/11/2026)

- Balanceamento de moedas (substitui os valores do GDD): ingredientes 4/5, START_COINS 40, ORDER_BONUS 3, despesas diárias (upkeepForDay), utensílios 40/30/90 + Estufa de Ervas (150) e Alambique Duplo (240). Testes em tests/economy.test.mjs.

## v1.10 (21/11/2026)

- Dicas aparecem uma vez (TIPS em data.js, state.seenTips, handler onTipSeen) e ficam na aba Anotações do livro.

## v1.11 (21/11/2026)

- Arte da aba Anotações: página pautada fatiada em topo/linha/pé (assets/ui/anotacoes-*.webp), texto alinhado à pauta (--pitch), selo de pena como número.

## v1.12 (23/11/2026)

- Menus cabendo na tela (pedido do Rafael). No PC (1280×720 até 1920×1080) caldeirão, prateleira, utensílios, mercadora, livro (Receitas e Ingredientes), páginas do menu e abertura abrem sem rolar. Cartas menores, livro com as 3 categorias em colunas e receitas em linha, ingredientes 4 por linha, páginas do menu e abertura enxutas em telas baixas (celular deitado).
- O que ainda não cabe (aba Anotações, e o livro/prateleira no celular) rola com a barra do caderno: `src/rolagem.js` troca a barra nativa por trilho + alça + setas (CSS provisório no bloco v1.12 de styles.css). Arte pedida em `arte/prompt-barra-rolagem.md` (rolagem-trilho/alca/seta); ao chegar, ativar o bloco comentado no fim de styles.css.
- `.dialog` não rola mais: quem rola é o `.dialog-body`.

## v1.13 (23/11/2026)

- Efeitos do caldeirão e da noite sem brilho digital (pedido do Rafael: pareciam artificiais). Caldo em aquarela chapada de duas cores com contorno de tinta, sem sombra luminosa; bolhas viram argolas de tinta que sobem quadro a quadro (`steps`) e estouram. Noite sem o halo elíptico em volta da mercadora: só linhas de goiva nas bordas da tela.
- Pronto para a arte: `<span class="pot-vapor">` no caldeirão e bloco comentado "parte 2" no fim de `styles.css` para as sprite sheets `assets/fx/caldo-fervendo.png` (2x4), `vapor-caldeirao.png` (4x2) e `noite-hachura.png`, coloridas pelo código com multiply + mask. Prompt em `arte/prompt-efeitos-animados.md`. Parte 2 testada no Chromium com imagens de teste.

## v1.14 (23/11/2026)

- Balanceamento geral e dificuldade progressiva (pedido do Rafael). Detalhes, números e simulação em `docs/BALANCEAMENTO.md`.
- Preços por raridade 10/14/18 (antes 10/13/16). Venda avulsa na prateleira paga 60% do preço (`CONFIG.SHELF_RATE`), abaixo do custo dos ingredientes. Teto das despesas 26 → 30.
- Fama em faixas (`FAME_TIERS`, `fameTier`): 0 Botica nova, 10 Conhecida na ladeira (+1 moeda por pedido), 25 Falada na vila (+2, clientes 10% mais pacientes), 50 Famosa no reino (+3, 20%). Nome da faixa no topo, ao lado da fama.
- Paciência dos clientes (`patienceForDay`, `patienceFor`, `tickPatience`, `walkOutOrder` em progression.js): dias 1 e 2 sem pressa; do dia 3, 140 s caindo 7 s por dia até 90 s. Receita nova ×1,5. Fila perde paciência a 1/4 da velocidade. Gorjeta de 3 moedas com mais da metade da vela. Vela apagou: o cliente vai embora (−2 de fama, `plan.gaveUp`). Rosto triste e fala de pressa no último quarto.
- Dia perfeito (ninguém saiu sem poção): 2 moedas por cliente e +1 de fama. Livro-caixa mostra gorjetas, dia perfeito e quem cansou de esperar; a noite avisa quanto os clientes de amanhã vão esperar.
- Opção "Freguesia sem pressa" (options.relaxed, state.relaxed): sem vela e sem gorjeta.
- O relógio de paciência (main.js, a cada 0,5 s) pausa no menu, com a aba escondida e durante a despedida; salva a cada 5 s. Corrigido: esconder a aba no menu inicial criava um save vazio.
- Testes: 105/105 (8 novos em tests/economy.test.mjs).

## v1.15 (23/11/2026)

- Paciência por freguês (item 5 da lista de harmonização, escolhido pelo Rafael): `CUSTOMERS[].patience` multiplica a paciência do dia e `temper` aparece abaixo do nome quando há vela. Vovó Quitéria ×1,3; Elfo Anselmo e Gato Bartolomeu ×1,2; Bruxa Ofélia e Anão Baltazar ×1; Bardo Cirilo ×0,9; Fada Lumi ×0,85; Cavaleiro Tadeu ×0,8; Pirata Dorotéia ×0,75 (média 1).
- Simulação: jogador lento passa a perder cerca de 1 cliente apressado por dia no fim; casual e atento continuam sem perder. Testes: 106/106.

## v1.16 (24/11/2026)

- Pedido do Rafael: ao mandar alguém embora, o próximo parecia pedir a mesma coisa. O motor já não repetia a poção, mas o cliente seguinte costumava usar o mesmo ingrediente (41% das vezes) e as mesmas frases voltavam.
- Sorteio ponderado em `makeOrder` (progression.js): pedido aberto e último nunca repetem; pedido do dia só repete sem alternativa; memória das 6 últimas poções entre dias (`state.recentAsked`); receita que usa ingrediente do pedido logo à frente pesa 0,3; receita conhecida que a prateleira não consegue fazer pesa 0,6; comuns saem mais que raras (3/2/1,5). A frase do pedido não repete a última usada para a mesma poção (`state.lastClue`). Pesos em `CONFIG` (data.js).
- Medição (`tools/medir-variedade.mjs`): pedidos seguidos com ingrediente em comum 41% → 24%; frase repetida 21% → 0%. Economia praticamente igual na simulação. Testes: 107/107.

## v1.17 (24/11/2026)

- Arte do Rafael aplicada: barra de rolagem (assets/ui/rolagem-trilho, rolagem-alca, rolagem-seta; costura da lombada, fita marcadora e fleurão) e os efeitos animados de arte/prompt-efeitos-animados.md (assets/fx/caldo-fervendo 2×4, vapor-caldeirao 4×2, noite-hachura). Parte 2 do bloco v1.13 ativada; PNGs convertidos para WebP.

## v1.18 (24/11/2026)

- Noite adaptável (Rafael: desproporcional ao mudar de tela). A hachura saiu do fundo (`.stage`, maior que a tela) e virou `.scene::after`, um 9-slice (`border-image` 340/500, bordas `round`) sobre a tela visível; cantos com tamanho fixo em vmin (clamp), mesma proporção em qualquer formato. Alfa da arte reforçado (×1,9) porque ficou menor na tela.

## v1.19 (24/11/2026)

- Noite por shader (pedido do Rafael): `src/noite.js` desenha hachura de xilogravura em WebGL lendo o próprio fundo da loja (mais traço onde a cena é escura e nas bordas da tela visível; vela e janela limpas), 3 camadas de traço, "line boil" a 8 quadros/s só à noite. Canvas dentro de `.stage` + cópia recortada sobre o balcão. Classe `html.noite-shader` quando ativo.
- Opções → "Qualidade dos efeitos": Alta (shader) ou Leve (moldura de hachura da v1.18, sem tremor nem faíscas). `options.quality` ('alta'|'leve') em storage.js. Sem WebGL ou com textura bloqueada (index.html por file://) cai sozinho na Leve. Testes: 107/107.

## v1.20 (24/11/2026)

- Arte do Rafael nos efeitos da interface (arte/prompt-efeitos-interface.md), em assets/fx/: vela da paciência que derrete (`vela-paciencia.webp`, 8 quadros 4×2 reorganizados com o castiçal alinhado; `data-vela` 0–7 em ui.js, `--wick` por quadro no CSS) com chama animada (`chama-vela.webp`, linha de baixo = chama fraca no `is-low`); estrelinhas da receita nova (`estrelinhas.webp`, 2×2) no lugar das bolinhas; moldura da carta escolhida (`carta-escolhida.webp`, 9-slice, com a fita separada em `carta-fita.webp` para não esticar). Bloco v1.20 no fim de styles.css.

## v1.21 (24/11/2026)

- Caldeirão sem círculo: o anel de foco (turquesa, aparecia ao voltar do caldeirão porque o foco retorna ao botão), o brilho do hover e o pulso amarelo saíram. Hover/foco agora mostram 3 estrelinhas de xilogravura (`.pot-sparks`) e erguem a etiqueta; no celular o caldeirão do canto balança em vez de piscar. Provisório até a manícula/raios.

## v1.22 (24/11/2026)

- Manícula e raios de tinta do Rafael (arte/prompt-indicador-caldeirao.md): `assets/fx/manicula.webp` (2×2, mão alinhada pelo topo, cutucando para a direita) e `assets/fx/raios-caldeirao.webp` (2×2, elipse vazia centralizada em todos os quadros). A manícula aparece ao lado do caldeirão (fundo e canto do celular) até ele ser aberto no dia (`scene.pot-apontar`, `ui.potDay` em ui.js) e no passo "caldeirão" do tutorial (substitui o brilho `tut-glow` ali). Os raios aparecem no hover/foco por teclado. As estrelinhas provisórias da v1.21 saíram.

## v1.23 (24/11/2026)

- Pedido do Rafael: a mercadora também tem tempo de espera, mas folgado. `CONFIG.MERCHANT_PATIENCE_S` = 240 s por noite; o relógio dela para enquanto o livro-caixa ou a banca estão abertos (só corre se o jogador for fazer outra coisa, como preparar poções). Usa a mesma vela da paciência ao lado do nome; no último quarto ela fica triste e apressa ("Daqui a pouco eu fecho a banca"). Quando a vela apaga, ela se despede e some até a noite seguinte: "Comprar ingredientes" fica desabilitado e `buyFromMerchant` falha com MERCHANT_GONE. Sem custo de fama. A opção "Freguesia sem pressa" também desliga a vela dela.
- Estado: `merchantWait`, `merchantGone` (zerados ao fechar e ao abrir o dia). Funções `merchantPatience`, `merchantCandle`, `tickMerchant` em progression.js; `tickNight` em main.js. Testes: 108/108.

## v1.24 (24/11/2026)

- Pedido do Rafael: vela da paciência maior e fora da vinheta do nome. No balcão (clientes e Zuleica) ela fica em pé à esquerda do nome, num `.talk-head` flex (40 px de largura no PC, 30 px no celular; antes 22/18 px), com um espaço igual à direita para o nome continuar centralizado. Na fila, a vela de cada retrato passou de 15 para 22 px (18 px no celular). Saiu o aro vermelho pulsante do `is-low` (sobra da barra antiga): o aviso é a chama fraca. Classe `patience-balcao` em ui.js; bloco v1.24 no fim de styles.css.

## v1.25 (24/11/2026) — aprovada pelo Rafael

- Balcão separado do fundo (arte do Rafael, arte/prompt-balcao.md): `assets/loja/fundo-loja-vazia.webp` (sala sem balcão, estante da direita vazia), `balcao.webp` (1536x449, 3 fatias: toalha 300 px | madeira repetida | pedra 420 px), `balcao-frente.webp` (continua a frente até o pé da tela) e `caldeirao-balcao.webp`. `fundo-loja.webp` antigo continua só no menu.
- `.balcao` fica no `#scene`, preso embaixo; no celular sobe para logo acima da caixa de fala (`--talk-h`, medido por ResizeObserver em ui.js) e o cliente sobe junto. O `.pot-hotspot` mora no balcão (na ponta de pedra) em todas as telas; `.pot-counter` foi escondido. A manícula aponta para baixo em telas estreitas.
- Vela da paciência em pé no balcão (`#balcao-vela`, classe `patience-mesa`), saiu da vinheta do nome (v1.24). Dica "paciencia" atualizada.
- Estoque: `#estoque` no palco mostra cada poção pronta de pé nas 4 tábuas (até 4 por tipo, 24 no total; `renderEstoque` em ui.js, posições em % do fundo).
- Noite: balcão e estoque escurecem com filtro; o recorte de hachura do balcão (noite-canvas-balcao) foi desligado.
- Manícula só no hover/foco do caldeirão (e no tutorial), apontando de cima para baixo em todas as telas; sombras de contato em hachura (CSS `--hachura`) sob frascos do estoque, caldeirão (`.pot-sombra`) e vela.
- Fundo novo do Rafael com a estante reta; tábuas do estoque realinhadas (ESTOQUE_LINHAS/X0/X1).

## v1.26 (24/11/2026) — poções novas e Lodo à venda

Feito: 12 receitas novas (24 no total, 8 por categoria), com as artes do Rafael em `assets/itens/` (`chuva`, `coracao`, `broto`, `pluma`, `urso`, `brisa`, `gelo`, `fogofatuo`, `eco`, `seiva`, `arcoiris`, `espelho`). Dose dupla: os ingredientes de 4 moedas (Gota Lunar, Brasa Rubra, Folha Viva, Pena do Vento, Cogumelo Azul) dão poção quando vão duas vezes ao caldeirão; Pó de Cristal, Sombra Engarrafada e Orvalho Solar desandam em Lodo (as fichas de ingrediente dão a pista). Restam 12 combinações de Lodo (antes, 24). A mercadora compra Lodo Instável à noite: 3 moedas cada, até 3 por noite (`sellSludgeToMerchant`, `merchantSludgeLeft`, `state.merchantSludge`, CONFIG.MERCHANT_SLUDGE_*). Paciência de receita nova ×1,5 → ×1,75. 110 testes passando.

## v1.27 (25/11/2026) — aluguel fixo, dívida, senhorio e fim de jogo

- Pedido do Rafael: a despesa que sumia sem aviso virou aluguel com consequência ("Contas atrasadas").
- Aluguel fixo de **15 moedas por dia**, cobrado ao fechar o dia, do dia 2 em diante (o dia 1, do tutorial, é grátis). Substitui a despesa crescente da v1.9 (`CONFIG.RENT_*`, `upkeepForDay`). Valor simulado pela thread de balanceamento na v1.26: atento e casual nunca devem; o lento deve em ~7% das partidas e quase sempre se recupera; quem manda todo mundo embora perde no dia 6. Simulador: `project-files/alquimia-de-bolso/simulacoes/aluguel.mjs`.
- O que a bolsa não alcança fica em `state.debt` e é cobrado junto no fechamento seguinte. `state.debtDays` conta fechamentos seguidos devendo; no 3º (`CONFIG.DEBT_CLOSES`), `state.landlord = true`: o **senhorio** (Seu Leopoldo (o nome Anselmo já é do elfo), `LANDLORD` em data.js, ainda sem retrato) vem ao balcão antes da mercadora. Dá para pagar (`payLandlord`, vendendo frascos da prateleira se precisar) ou entregar a chave (`evict`).
- Fim de jogo: tela `#gameover` (arte `assets/gameover/`: fundo PC/celular e carta do senhorio). Botões: Recomeçar a botica (`restartAfterEviction`: dia 1, sem tutorial, mantém receitas, grimório, dicas e anotações) e Menu inicial. O save é apagado ao perder.
- Livro-caixa: linha "Aluguel do dia" e "Ficou na conta do senhorio"; aviso de dívida na noite; lembrete do aluguel na banca da mercadora.
- Testes: 7 novos em tests/economy.test.mjs (116 no total).

## Tela de carregamento (26/11/2026)

- Tela antes do menu: título, frasco que enche e frases ("Acendendo a vela…"). CSS em `carregamento.css` (no `<head>`) e imagens em `assets/carregamento/` (provisórias: fundo do menu desfocado e frasco da Cura). Prompt da arte definitiva: `arte/prompt-tela-carregamento.md`.
- `tools/build-standalone.mjs` agora põe a tela no começo do `jogar.html` e corta o `styles.css` e os módulos em pedaços, com `__carga.etapa(x)` entre eles: o frasco enche conforme o arquivo chega pela rede. Some depois das fontes e do fundo do menu decodificados (mínimo 1,4 s, limite 9 s).
- Verificado no Chromium a ~1,3 MB/s (aparece em menos de 1 s, menu em ~9,6 s) e por file:// (~2,2 s), PC 1280×800 e celular 390×844, sem erros. 120 testes passando.
