# Prompt: barra de rolagem do caderno (xilogravura)

A barra aparece na lateral direita do livro, do caldeirão, da prateleira e das páginas do menu quando o conteúdo não cabe na tela (no celular e na aba Anotações, principalmente). No PC quase tudo já cabe sem rolar.

Hoje o jogo usa uma versão provisória feita em CSS: trilho em filete duplo, alça de fita vermelha com ponteiras ocre e setas em triângulo. Quando as 3 imagens abaixo chegarem, é só colocar em `assets/ui/` e ativar o bloco comentado no fim de `styles.css` (v1.12).

## O que as referências mostram

Pesquisei kits de interface de fantasia e pergaminho (itch.io, Unity Asset Store, OpenGameArt). O que funciona em todos:

- **Três peças separadas**: trilho (o canal), alça (a parte que arrasta) e seta (uma só, o código gira para fazer a de baixo). Exemplos: [Parchment game UI kit](https://gamedeveloperstudio.itch.io/parchment-game-user-interface-kit), [Medieval Age Game GUI](https://pzuh.itch.io/medieval-age-game-gui), [Royal Classic GUI](https://acrock.itch.io/royal-classic-gui), [Fantasy RPG UI Elements](https://manxpixels.itch.io/fantasy-rpg-ui-elements-pack).
- **Trilho e alça esticáveis**: pontas decoradas, meio liso e repetível (o mesmo 9-slice das nossas molduras), para a alça poder ficar curta ou comprida.
- **Alça mais forte que o trilho**: o trilho é discreto, quase uma linha; a alça tem a cor de destaque para o olho achar onde está.
- **Fina**: nos jogos de livro e diário ([Grimdark Quest & Journal Panel](https://zss-game-lab.itch.io/panel-questlog), [Victorian Panel Pack](https://abstergodesign.itch.io/victorian-panel-pack)) a barra ocupa pouco e parece parte da página, não um controle de computador.

**Ideia para o nosso caderno:** o trilho é a **costura da lombada** (um filete duplo com pontos de linha de encadernação) e a alça é uma **fita marcadora de tecido** vermelha, com ponteiras em ocre, que desliza pela costura. A seta é um pequeno **losango de tinta com ponta**, como os fleurões das molduras. Combina com a fita do menu e com as abas do livro.

## Como usar

Cole na mesma conversa do ChatGPT em que você já usou o guia de estilo de **ornamentos em xilogravura** (o das molduras e botões). Se for uma conversa nova, cole o guia de estilo antes (botão "Copiar guia de estilo" em `arte/prompts-molduras-botoes.html`). Gere uma peça por vez, na ordem.

## 1. Trilho — `rolagem-trilho.png`

```
Gere a peça "Trilho da barra de rolagem", no guia de estilo de ornamentos em xilogravura combinado.
Tamanho: 128 x 1024 px (proporção 1:8), vertical.
Peça: uma faixa vertical estreita e reta, como a costura da lombada de um livro: dois filetes paralelos em tinta preta (o da esquerda mais grosso, o da direita mais fino), e entre eles uma fileira de pontos de linha de encadernação, curtos e inclinados, sempre iguais e no mesmo intervalo. A faixa ocupa só os 40 px do meio da imagem. Em cada ponta (em cima e embaixo), um pequeno arremate de cerca de 100 px: um nó de linha com uma folhinha de arruda. O meio, entre os arremates, é totalmente uniforme e repetível, sem enfeite, para poder esticar.
Cores: tinta preta nos filetes e nos pontos, papel creme (#efe2c4) liso entre os filetes, um toque de ocre-ouro (#b88a2e) na folhinha dos arremates.
Fundo transparente fora da peça, vista frontal, simétrica, mesmo traço das peças anteriores, sem texto.
```

## 2. Alça — `rolagem-alca.png`

```
Gere a peça "Alça da barra de rolagem", no guia de estilo de ornamentos em xilogravura combinado.
Tamanho: 128 x 512 px (proporção 1:4), vertical.
Peça: um pedaço de fita marcadora de tecido na vertical, com cerca de 70 px de largura, centralizada. Nas duas pontas (em cima e embaixo), uma ponteira de cerca de 70 px: uma capinha dobrada de papel ocre com um furinho redondo no meio, como o ilhó de uma etiqueta de botica. Entre as ponteiras, a fita é uniforme: trama sugerida por linhas entalhadas finas na horizontal, borda de tinta dos dois lados, sem dobras, sem sombra, para poder esticar. Simétrica de cima para baixo.
Cores: vermelhão (#a8322a) chapado na fita, ocre-ouro (#b88a2e) nas ponteiras, traços em tinta preta.
Fundo transparente fora da peça, vista frontal, simétrica, mesmo traço das peças anteriores, sem texto.
```

## 3. Seta — `rolagem-seta.png`

```
Gere a peça "Seta da barra de rolagem", no guia de estilo de ornamentos em xilogravura combinado.
Tamanho: 256 x 256 px (quadrado).
Peça: uma única seta apontando PARA CIMA, no formato de um pequeno fleurão de livro impresso: um losango alongado com a ponta de cima afiada, contorno duplo em tinta, e duas folhinhas curtas saindo dos lados da base. Centralizada, ocupando uns 70% da imagem, perfeitamente simétrica da esquerda para a direita. O código gira essa mesma imagem para fazer a seta de baixo.
Cores: miolo em ocre-ouro (#b88a2e) chapado, contorno em tinta preta, folhinhas em vermelhão (#a8322a).
Fundo transparente fora da peça, vista frontal, mesmo traço das peças anteriores, sem texto.
```

## Se algo sair errado

- Se o trilho ou a alça vierem com o meio enfeitado, peça: "o meio tem que ser liso e igual do começo ao fim, enfeite só nas pontas". Isso é o que deixa a peça esticar sem deformar.
- Se a alça vier larga demais, peça: "fita mais estreita, uns 70 px, com bastante espaço transparente dos lados".
- Se vier texto, letras ou números, peça: "refaça sem nenhum texto".
- Se o fundo vier branco ou com xadrez desenhado, peça "fundo transparente de verdade". Se não der, salve assim mesmo que eu recorto.
- Salve com os nomes `rolagem-trilho.png`, `rolagem-alca.png` e `rolagem-seta.png` e mande aqui na conversa.
