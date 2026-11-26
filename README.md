# Alquimia de Bolso

Jogo de navegador single-player em que você cuida de uma pequena botica ao entardecer: os clientes chegam ao balcão e contam o que precisam, e você mistura dois ingredientes para descobrir poções, atende os pedidos, ganha moedas e XP e compra melhorias. O objetivo do MVP é descobrir as **12 poções**; depois disso o jogo continua em modo livre.

Feito com HTML, CSS e JavaScript puro (ES modules). Sem frameworks, sem CDN, sem backend e sem dependências; o build é opcional e só serve para gerar o `jogar.html` de arquivo único. Depois de carregados os arquivos, funciona offline.

## Como jogar

### Jeito mais fácil: duplo clique (não precisa instalar nada)

Abra o arquivo **`jogar.html`** com duplo clique (ou arraste-o para o Chrome, Edge ou Firefox). Ele traz o jogo inteiro num único arquivo, funciona offline pelo `file://` e salva o progresso normalmente no navegador.

> Mantenha sempre o mesmo `jogar.html` no mesmo lugar: o save fica ligado ao endereço do arquivo. Se mover ou renomear o arquivo, o navegador trata como outro jogo.

### Versão modular (para desenvolvimento)

O `index.html` carrega o código como módulos ES (`<script type="module">`), que **não funcionam abrindo direto pelo `file://`** na maioria dos navegadores. Para ele, use qualquer servidor estático local na pasta do projeto, por exemplo:

```bash
npx serve -l 8000          # se tiver Node.js
python3 -m http.server 8000 # se tiver Python
```

e abra **http://localhost:8000**. Extensões como "Live Server" do VS Code também servem.

### Gerar o `jogar.html` de novo

O `jogar.html` é gerado a partir de `index.html`, `styles.css` e `src/*.js` (que continuam sendo a fonte oficial). Depois de editar o código, rode:

```bash
node tools/build-standalone.mjs
```

Nenhuma API, token ou conexão externa é necessária em nenhum dos modos.

## Menu principal

O jogo abre no menu, sobre o fundo em xilogravura (versão horizontal no computador e vertical no celular):

- **Continuar**: só aparece quando existe um caderno salvo.
- **Novo jogo**: se já houver caderno salvo, pede confirmação numa página de papel antes de apagar.
- **Livro de receitas**: abre a coleção sem entrar na loja.
- **Opções**: efeitos sonoros, volume, menos animação e tamanho do texto (Normal, Grande, Maior). As opções ficam na chave `alquimia-de-bolso-opcoes-v1` e sobrevivem a um Novo jogo.
- **Créditos**.

Setas ↑/↓ (e Home/End) andam pelo menu; Enter ativa; Esc fecha as páginas de papel. Na loja, o botão **Menu** volta para esta tela.

## Fontes

Embutidas no jogo (licença SIL OFL 1.1, arquivos e licenças em `fonts/`): **Grenze Gotisch** nos títulos grandes, **Grenze** em botões, abas, nomes de poções e ingredientes, rótulos e números, e **Alegreya Sans** no texto corrido. Os papéis seguem a seção 5 do guia de arte.

## Dicas uma vez só e Anotações (v1.10)

As dicas da tela (pistas do cliente, mandar embora, prateleira vazia, frasco errado, receita nova, cartas, misturar, propriedades, mercadora, despesas, dica grátis e a fita do livro) aparecem **uma vez**, com a etiqueta "Anotado no caderno", e ficam guardadas na terceira aba do livro, **Anotações** (página pautada da arte do Rafael: topo, linha repetida e pé, com o selo de pena numerando cada anotação) (lista `TIPS` em src/data.js; vistas em `state.seenTips`). No máximo uma dica por cliente ou por noite; ela some quando aquele cliente vai embora.

## Balanceamento de moedas (v1.9)

Antes, cada dia rendia uns 120 de lucro a partir do dia 5, os 3 utensílios eram comprados até o dia 4 e as moedas se acumulavam sem uso (mais de 1.000 no dia 12). Agora:

- Ingredientes custam 4 (comuns) ou 5 (Pó de Cristal, Sombra Engarrafada, Orvalho Solar). Começa com 40 moedas.
- Bônus de pedido caiu de +5 para +3 (o bônus de receita nova, +8, continua).
- **Despesas da botica** (lenha, velas e aluguel) ao fechar o dia: grátis nos dias 1 e 2, depois 3 por dia a mais, até 26. Aparecem no livro-caixa.
- Utensílios mais caros (Caldeirão 40, Lupa 30, Marca do Mercador 90) e dois novos objetivos de longo prazo: **Estufa de Ervas** (150: 1 Gota Lunar, 1 Folha Viva e 1 Cogumelo Azul de graça toda manhã) e **Alambique Duplo** (240: 1 em 3 misturas de receita conhecida rende 2 frascos).

Simulação de 14 dias (16 partidas): a bolsa fica entre 30 e 80 até o dia 6, os utensílios são comprados entre os dias 3 e 12, e o lucro do fim de jogo cai para uns 60 por dia.

## Relógio do dia e livro-caixa (v1.8)

A barra do topo usa a moldura com encaixe redondo, onde fica o relógio: o disco de sol e lua gira conforme os clientes são atendidos (o sol nasce à esquerda e se põe à direita) e mostra a lua à noite. Quando o último cliente sai, abre o **Livro-caixa** do dia: clientes atendidos e mandados embora (com carimbos), receitas novas, cada poção entregue com o valor, bolsa ao abrir, ganho com pedidos, vendas ou gastos, fama do dia e o saldo, fechado com o selo de cera. Ele pode ser reaberto pela caixa da noite ("Ver o livro-caixa"). O plano do dia guarda `delivered`, `startRep` e `startFound` para isso.

## Molduras e botões (v1.6)

As peças de interface em xilogravura do Rafael ficam em `assets/ui/` (webp, recortadas e reduzidas). São esticadas com `border-image` (9 partes): caixa de diálogo (versão de PC e de celular), vinheta do nome do cliente, divisória entre a fala e o pedido, botões principal, pressionado, secundário e desativado, medalhão dos botões de ícone do balcão, retrato com arco na fila, fita marcadora na aba escolhida do livro e as fitas penduradas (azul no livro, vermelha na bancada, verde na loja). A cantoneira avulsa não foi usada porque a moldura inteira fatiou bem.

## Caderno de ingredientes (v1.5)

O livro tem duas abas: **Receitas** (o que você já descobriu) e **Ingredientes**. A aba de ingredientes mostra, para cada um dos 8, uma anotação curta, a **propriedade** (o que ele faz na mistura) e **no que ajuda**, além de elemento, preço e estoque. Não revela nenhuma receita. Dentro do caldeirão, o botão "O que cada ingrediente faz?" abre direto nessa aba.

## Dias de atendimento (v1.4)

- O jogo é dividido em **dias**. No dia 1 vêm **3 clientes**; cada dia seguinte traz **+1**, até o teto de **8** por dia. No máximo 3 ficam na loja ao mesmo tempo (um no balcão e dois na fila); a bolinha `+N` mostra quantos ainda vão chegar.
- **Pedidos variados**: o cliente seguinte nunca repete a poção do anterior, e no mesmo dia as poções não se repetem enquanto houver alternativa. Cada receita tem 4 jeitos de ser pedida, e cada cliente tem várias saudações, agradecimentos, reações e despedidas.
- **Receitas novas como estímulo**: o 1º cliente de cada dia (e cerca de 1 em cada 3 dos demais) pede uma receita que ainda **não está no caderno**. Esses pedidos têm o selo **Receita nova!** e pagam **+8 moedas e +4 XP** de bônus. As raridades liberam aos poucos: comuns desde o dia 1, incomuns a partir do dia 2 e a rara a partir do dia 3.
- **Ingredientes acabam**: durante o dia não há onde comprar. Sem ingredientes (ou sem ideia), use **Mandar embora**: o cliente sai sem poção e você perde 1 de fama.
- **Fim do dia**: quando o último cliente sai, a loja fecha e aparece o resumo (atendidos, mandados embora, moedas). A **Mercadora Zuleica** chega com a banca de ingredientes (+1 ou +5 por carta). Também dá para preparar poções à noite. Depois, **Abrir a loja** começa o dia seguinte. Se a botica ficar sem ingredientes, sem poções e sem moedas, a mercadora deixa um punhado fiado para o jogo não travar.

## A loja (v1.3)

- **O balcão**: o fundo é a loja ao entardecer. O cliente da vez entra pelos fundos e para atrás do balcão; abre-se uma **caixa de diálogo** com a fala dele e o pedido (descrito como um problema, não pelo nome da poção). Os outros clientes esperam **na fila** (retratos à esquerda); clique num retrato para chamá-lo ao balcão.
- **Livro de receitas**: **arraste a tela para baixo** (mouse ou dedo) ou puxe a fita vermelha **Livro**. Para fechar, arraste para cima, clique em **Fechar** ou aperte `Esc`.
- **Caldeirão**: clique no caldeirão (o do fundo, no computador; o do balcão, no celular). Os ingredientes aparecem como **cartas**: toque numa carta para pô-la num dos dois espaços, toque no espaço para tirar, e clique em **Misturar**. O botão **+1** de cada carta compra mais uma unidade, mas só no fim do dia, quando a mercadora está na loja. As receitas já descobertas ficam como atalhos para repetir com um toque.
- **Entregar**: na caixa de diálogo, **Entregar poção** abre a prateleira com as poções em cartas; escolha a que resolve o pedido. Acertou: o cliente fica feliz, paga e vai embora, e o próximo entra. Errou: o cliente fica triste e explica melhor (o frasco volta para a prateleira). **Mandar embora** dispensa o cliente sem poção (−1 de fama).
- **Prateleira e Utensílios** (botões no topo): vender poções e Lodo, comprar utensílios e pedir dicas (vela = dica grátis; Lupa = dica paga).
- **Raridade**: selos e bordas nas cores da Grande Obra (preto para Lodo, prata para comum, ouro para incomum, vermelho para rara).

## Controles

- **Clique/toque** em tudo; **arrastar para baixo** abre o livro.
- **Teclado**: todos os controles são botões reais. Use `Tab`/`Shift+Tab` para navegar, `Enter` ou `Espaço` para acionar. `Esc` fecha o livro, o caldeirão, a prateleira e os utensílios. A fita **Livro** também é um botão, então o livro abre sem arrastar.
- Resultados e mensagens são anunciados em uma região `aria-live` para leitores de tela. O jogo respeita `prefers-reduced-motion` e a opção **Menos animação**.
- O som vem **desligado** e pode ser ligado pelo sino no topo ou nas Opções (a escolha é salva).

## Regras resumidas

- **Ingredientes**: 8 (Gota Lunar, Brasa Rubra, Folha Viva, Pó de Cristal, Sombra Engarrafada, Orvalho Solar, Cogumelo Azul, Pena do Vento), custando 4 ou 5 moedas. Começa com 3 de cada e 40 moedas. Compras são instantâneas.
- **Mistura**: consome 1 unidade de cada ingrediente (2 se forem iguais) e gera 1 item no inventário. As receitas são comutativas (A+B = B+A). Sem estoque suficiente, a mistura é recusada e nada muda.
- **Lodo Instável**: qualquer combinação que não seja uma das 12 receitas vira Lodo, vendável por 1 moeda. O Lodo dá uma pista de "quase" (ex.: "Gota Lunar borbulhou de leve: pede algo quente"), e a combinação fica anotada no **Grimório de tentativas** (no Livro). Se você montar de novo um par já anotado, o caldeirão avisa antes de misturar.
- **Venda**: cada poção vale o preço tabelado (10, 13 ou 16). Uma poção pode ser vendida **ou** entregue, nunca ambos.
- **Pedidos por pistas**: 3 encomendas simultâneas, sempre de poções que você já descobriu (nenhuma antes da primeira descoberta). O cliente **descreve o problema** em vez de dizer o nome da poção, e você escolhe qual poção entregar. Acertar paga **preço da poção + 5**, dá 3 XP e +1 de fama, e gera um novo pedido na hora. Errar não gasta a poção: custa 1 de fama (nunca abaixo de 0) e o cliente explica melhor com uma segunda frase; depois de 2 erros, o nome da poção aparece. Não há mais troca paga de pedido: na v1.4 o cliente pode ser mandado embora (−1 de fama).
- **XP e nível**: +1 XP por mistura (inclusive Lodo), +5 XP extra na primeira descoberta de cada receita, +3 XP por entrega. **Nível = 1 + floor(XP / 20)**.
- **Melhorias** (cada uma comprada uma única vez):
  - **Caldeirão Eficiente** (30): 20% de chance de a mistura não consumir ingredientes (os dois juntos, nunca só um).
  - **Marca do Mercador** (45): +25% em vendas e recompensas de pedidos, arredondado para baixo; não vale para o Lodo.
  - **Lupa Arcana** (25): libera **Pedir dica** (5 moedas), que mostra o nome de uma poção não descoberta e apenas o seu primeiro ingrediente. Dicas evitam repetir receitas enquanto houver outras sem dica; não cobram se não houver nada a descobrir.
- **Dica grátis**: a cada 4 minutos você ganha uma dica sem custo e sem precisar da Lupa (ela não acumula).
- **Livro de receitas**: separado em 3 categorias (Cura, Proteção, Travessura). Poções desconhecidas aparecem como `???`; os ingredientes só aparecem após a descoberta, junto com um **selo** com a ordem em que você as descobriu.
- **Refazer com um toque**: receitas conhecidas aparecem como atalhos no Caldeirão e com o botão **Preparar** no Livro.
- **Vitória**: descobrir as 12 receitas. Um aviso é exibido uma vez e o jogo continua (pedidos, vendas e recorde de moedas).

## Estrutura de arquivos

```text
alquimia-de-bolso/
├─ jogar.html            # versão de arquivo único: abre com duplo clique (gerada)
├─ index.html            # página principal (carrega src/main.js como módulo)
├─ styles.css            # layout responsivo, tema e animações
├─ src/
│  ├─ data.js            # ingredientes, receitas, lodo, melhorias, clientes, CONFIG
│  ├─ engine.js          # estado inicial, mistura, compra, venda, XP/nível, preços (puro, sem DOM)
│  ├─ progression.js     # pedidos, troca, entrega, melhorias, dicas, livro (puro, sem DOM)
│  ├─ storage.js         # save/load em localStorage com sanitização e reset
│  ├─ dialogue.js        # falas dos clientes e da mercadora (variações)
│  ├─ art.js             # mapa id → arquivo de arte (caminhos literais, embutidos no jogar.html)
│  ├─ ui.js              # loja: cliente, diálogo, cartas, folhas (livro, caldeirão, prateleira, utensílios)
│  ├─ menu.js            # menu principal, opções, créditos e livro pelo menu
│  ├─ audio.js           # efeitos sonoros sintéticos (Web Audio API), com volume
│  └─ main.js            # inicialização e despacho de ações
├─ tests/
│  └─ game.test.mjs      # testes do núcleo com node:test
├─ fonts/                # Grenze Gotisch, Grenze e Alegreya Sans (woff2) + licenças OFL
├─ assets/menu/          # fundos do menu (PC e celular, WebP)
├─ assets/loja/          # fundo da loja ao entardecer
├─ assets/itens/         # ingredientes, poções, Lodo, utensílios, moeda, vela, sino, selo, caldeirão
├─ assets/clientes/      # 10 clientes × 3 expressões (neutro, feliz, triste)
├─ tools/
│  └─ build-standalone.mjs # gera jogar.html a partir dos fontes
├─ docs/
│  ├─ GDD.md             # documento de design (especificação)
│  ├─ CONTRATOS.md       # contrato de API entre módulos
│  └─ STATUS.md          # andamento por frente de trabalho
├─ arte/                 # prompts de arte, guias, álbum, prévias de menu e game over
├─ musica/               # MIDIs da trilha, script de composição e guias de som
├─ previa/               # capturas de tela do menu e do balcão
├─ simulacoes/           # simulações de economia (ex.: aluguel)
├─ originais/            # .rar com as artes originais de itens e personagens
└─ README.md
```

## Testes

Requer Node.js 22 ou superior, sem instalar nada:

```bash
node --test tests/game.test.mjs tests/story.test.mjs
```

Os testes cobrem dados, mistura (as 12 receitas nas duas ordens e as 36 combinações possíveis), estoque, XP/nível, compra e venda, Marca do Mercador, Caldeirão Eficiente com RNG injetável, pedidos (geração, entrega, troca), melhorias, dicas, livro de receitas, save/load com storage falso e dados corrompidos, vitória com jogo livre e uma simulação aleatória semeada que verifica invariantes. Eles não testam a interface (DOM) nem o áudio.

## Persistência

O progresso é salvo no `localStorage` do navegador, na chave **`alquimia-de-bolso-save-v1`**, ao fim de cada ação concluída: moedas, XP, estoque, inventário, receitas descobertas, melhorias, pedidos, dicas, opção de som e estatísticas. Os dados lidos são validados e sanitizados; se estiverem corrompidos, o jogo começa um save seguro em vez de quebrar. **Novo jogo** (no menu) pede confirmação e apaga apenas essa chave; as opções ficam em `alquimia-de-bolso-opcoes-v1`.

## Limitações conhecidas

- O save fica só no navegador e no endereço usados (ex.: `localhost:8000`); trocar de porta, navegador ou limpar os dados do site perde o progresso. Não há exportação/importação de save.
- Em modo privado ou com o armazenamento bloqueado, o jogo funciona, mas o progresso pode não ser salvo.
- Abrir o `index.html` via `file://` não funciona por causa dos ES modules; use o `jogar.html` ou um servidor local.
- Sem arrastar e soltar (seleção por clique/toque/teclado); o som depende de suporte a Web Audio.
- Pedidos repetidos gerados quando havia menos de 3 receitas descobertas são trocados automaticamente (mesmo cliente) assim que uma nova receita fica livre.
- Em telas estreitas os painéis ficam empilhados; o Caldeirão fica abaixo da lista de 8 ingredientes, então é preciso rolar a página para misturar.
- Os testes automatizados cobrem apenas a lógica; a interface precisa de verificação manual.

## Checklist de aceitação (verificação manual)

Critérios da seção 8 do GDD:

- [ ] 1. As 12 combinações corretas funcionam em qualquer ordem; combinações incorretas geram Lodo.
- [ ] 2. O estoque nunca fica negativo e o botão Misturar falha/fica desabilitado sem insumos.
- [ ] 3. A carteira nunca fica negativa; compras, dicas e trocas são recusadas sem fundos.
- [ ] 4. Uma poção não pode ser vendida e entregue (nem entregue duas vezes).
- [ ] 5. Pedidos só pedem receitas descobertas, e entregar paga mais que vender.
- [ ] 6. Cada melhoria só pode ser comprada uma vez e aplica o efeito anunciado.
- [ ] 7. O livro marca "Nova descoberta!" somente na primeira vez de cada receita.
- [ ] 8. Recarregar a página (F5) preserva progresso e a opção de som.
- [ ] 9. Novo jogo pede confirmação e apaga apenas a chave `alquimia-de-bolso-save-v1` (outras chaves do `localStorage` continuam lá).
- [ ] 10. Funciona em desktop e celular (a partir de 320px, sem rolagem horizontal), sem erros no console e offline depois de carregado.
- [ ] 11. `node --test tests/game.test.mjs` passa.
- [ ] 12. O jogo abre por servidor estático local, sem APIs, tokens ou CDN (verifique a aba Rede do navegador).
