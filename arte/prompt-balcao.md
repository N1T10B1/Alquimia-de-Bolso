# Prompt: balcão separado do fundo (base do caldeirão e da vela)

Hoje o balcão e o caldeirão estão pintados no fundo da loja (`fundo-loja`). No celular a lateral do fundo sai da tela e o caldeirão some, por isso existe o caldeirão pequeno do canto. Com o balcão como peça própria, presa na parte de baixo da tela, o caldeirão e a vela da paciência ficam sempre no mesmo lugar, do PC ao celular, e o cliente fica atrás do balcão.

São 3 peças:

| Arquivo | O que é | Tamanho |
|---|---|---|
| `fundo-loja-sem-balcao.png` | o mesmo fundo de hoje, sem o balcão da frente e sem o caldeirão | 1536 x 1024 |
| `balcao.png` | o tampo e a frente do balcão de madeira, sozinho, fundo transparente | 1536 x 1024 |
| `caldeirao-balcao.png` | o caldeirão de cobre num tripé de ferro com braseiro, sozinho, fundo transparente | 1024 x 1024 |

A vela da paciência que você já gerou fica em pé em cima do balcão, então não precisa de peça nova.

A estante de frascos da direita vem **vazia**: ela vira o estoque da loja. Cada poção que você prepara aparece de pé numa das tábuas, usando a arte de cada poção que já está no jogo, e some quando você entrega. Por isso o fundo pede tábuas retas, paralelas e com espaço igual entre elas, para o jogo saber onde apoiar cada frasco.

## Como usar

1. Abra uma **conversa nova** no ChatGPT.
2. **Anexe** as duas imagens de referência que estão em `arte/referencia/`: `fundo-loja.png` (o fundo atual) e `caldeirao-bancada.png` (o caldeirão atual). Elas são o que garante que o balcão novo tenha a mesma luz, a mesma madeira e a mesma perspectiva do fundo, e não pareça colado.
3. Cole o guia abaixo, espere ele confirmar e peça uma peça por vez, na ordem.
4. Salve com o nome indicado e mande aqui. Antes de trocar no jogo, eu monto uma prévia para você aprovar.

## Guia (cole primeiro, com as duas referências anexadas)

```
Anexei duas imagens de referência do meu jogo de navegador "Alquimia de Bolso", uma loja de poções aconchegante de fantasia medieval:
1) fundo-loja.png: o interior da botica, pintado à mão, luz quente de fim de tarde entrando pela janela redonda, madeira cor de mel, paredes de reboco rosado, prateleiras com frascos, ervas penduradas;
2) caldeirao-bancada.png: o caldeirão de cobre do jogo.
Vou separar essa cena em camadas: o fundo da sala, o balcão da frente e o caldeirão, cada um numa imagem. Todas as imagens desta conversa devem seguir EXATAMENTE o estilo do fundo-loja.png: mesma pintura, mesma paleta, mesma luz vinda da esquerda (da janela), mesma madeira, mesmo ponto de vista (câmera na altura dos olhos de quem está atrás do balcão, olhando de frente). Nada de contorno grosso de desenho animado, nada de brilho extra, nada de texto. Não gere nada ainda, só confirme que entendeu.
```

## 1. Fundo sem balcão: `fundo-loja-sem-balcao.png`

```
Gere "fundo-loja-sem-balcao", 1536 x 1024 px, horizontal.
É EXATAMENTE a mesma sala do fundo-loja.png, com a mesma composição, no mesmo lugar e no mesmo tamanho: a janela redonda à esquerda, a estante de livros, o estandarte roxo com luas no alto, a parede do meio vazia com a luz da janela, a estante de frascos à direita, as ervas e lanternas penduradas.
Mude só três coisas:
1. Tire o balcão de madeira da frente e tudo o que está em cima dele (livros, vela, pilão, cristais, lavanda, toalhinhas, frascos). No lugar, continue a sala: o chão de tábuas e a base das estantes até a borda de baixo da imagem.
2. Tire o caldeirão de cobre, o fogareiro de tijolos e o vapor verde da direita. No lugar, continue a estante da direita até o chão.
3. A estante da direita fica VAZIA: tire todos os frascos, a ampulheta, os cristais e a redoma com cogumelos. Ficam só as tábuas. A estante fica de FRENTE para a câmera, sem nenhuma perspectiva: 4 prateleiras perfeitamente horizontais (a borda da frente de cada tábua é uma linha reta e nivelada, paralela à borda de baixo da imagem), com o mesmo espaço entre elas, rasas, mostrando só uma faixa fina do tampo de cada tábua, como uma estante vista bem de frente num desenho técnico. Só a madeira e talvez um pouco de poeira; nada em cima. As lanternas penduradas no alto podem ficar.
O centro da parede deve continuar vazio, porque é onde o cliente aparece.
```

## 1b. Só refazer a estante (se o fundo já veio bom no resto)

A primeira versão do fundo veio com a estante da direita em diagonal: as tábuas descem para a esquerda, como se a estante estivesse virada para o meio da sala. Assim os frascos ficam flutuando ou afundando na madeira. Para corrigir sem perder o resto do fundo, **anexe o `fundo-loja-sem-balcao.png` que já veio** e cole:

```
Anexei o fundo que você gerou. Ele está ótimo, mantenha TUDO exatamente igual (janela, estante de livros, estandarte, parede, chão, plantas, lanternas, luz), menos a estante vazia da direita.
Refaça só essa estante, no mesmo lugar e do mesmo tamanho, mas virada de FRENTE para a câmera, sem perspectiva: 4 prateleiras perfeitamente horizontais e niveladas, a borda da frente de cada tábua é uma linha reta paralela à borda de baixo da imagem, todas com a mesma largura e o mesmo espaço entre elas. As tábuas são rasas: aparece só uma faixa fina do tampo de cada uma, sem a lateral interna da estante se abrindo em diagonal. A moldura da estante (laterais e arco do alto) fica reta e simétrica, e o armário de portas embaixo continua igual.
Estante vazia, sem nenhum objeto. Mesma pintura, mesma madeira e mesma luz vinda da esquerda.
```

## 2. Balcão: `balcao.png`

```
Gere "balcao", 1536 x 1024 px, horizontal, FUNDO TRANSPARENTE.
Só o balcão de madeira da frente da loja, como o do fundo-loja.png, visto de frente na mesma perspectiva: o tampo grosso de tábuas cor de mel, com marcas de uso, um nó na madeira e uma rachadura, e logo abaixo a frente do balcão com painéis almofadados de madeira mais escura.
O balcão ocupa a largura INTEIRA da imagem, de ponta a ponta, sem extremidades visíveis. O tampo começa a cerca de 30% da altura (tudo acima dele é transparente) e a frente vai até a borda de baixo.
A faixa do meio (de 25% a 70% da largura) é simples e igual, sem objetos, para eu poder cortar e repetir conforme a largura da tela. Na ponta ESQUERDA, perto da borda, uma toalhinha de renda caindo pela frente. A ponta DIREITA (os últimos 22% da largura) é diferente: ali o tampo de madeira dá lugar a um tampo grosso de pedra clara com ladrilhos de barro, e a frente embaixo dele é de pedra assentada, como a bancada de fogo de uma cozinha antiga. É onde o caldeirão com o braseiro vai ficar, para o fogo não encostar na madeira.
Nada em cima do tampo: nada de livros, vela, frascos ou caldeirão; essas coisas vêm de outras imagens.
Sombra suave do tampo sobre a frente, luz vindo da esquerda como no fundo.
```

## 3. Caldeirão: `caldeirao-balcao.png`

```
Gere "caldeirao-balcao", 1024 x 1024 px, FUNDO TRANSPARENTE.
O caldeirão de cobre do caldeirao-bancada.png (mesmo formato, mesmas alças de argola, mesma flor-de-lis gravada na barriga), apoiado num tripé baixo de ferro batido. Embaixo dele, dentro do tripé, um braseiro pequeno: uma tigela rasa de ferro com brasas acesas e pequenas chamas. Tudo isso fica sobre uma laje redonda de pedra (cerca de 60 px de altura), que vai apoiada na ponta de pedra do balcão. Vista de frente, um pouco de cima, como se estivesse em cima do balcão.
O conjunto ocupa cerca de 700 x 760 px, centralizado na horizontal e com a base da laje de pedra apoiada a cerca de 40 px da borda de baixo. A boca do caldeirão mostra o caldo verde-água, liso e sem bolhas.
SEM vapor, sem fumaça e sem bolhas saindo: o jogo já anima isso por cima. Sem balcão embaixo, sem sombra no chão, sem texto.
```

## Se algo sair errado

- **O fundo mudou de composição** (a janela andou, a estante sumiu): "mantenha tudo exatamente no mesmo lugar do fundo-loja.png, só remova o balcão e o caldeirão".
- **Sobrou algum frasco ou objeto na estante da direita:** "a estante da direita fica totalmente vazia, só as tábuas".
- **As tábuas vieram tortas, em diagonal ou em alturas desiguais:** "a estante fica de frente, sem perspectiva: 4 tábuas retas, niveladas e paralelas à borda de baixo, com o mesmo espaço entre elas".
- **O balcão veio com pontas ou cantos aparecendo:** "o balcão vai de uma borda à outra da imagem, sem extremidades".
- **Vieram objetos no meio do tampo:** "a faixa do meio do tampo fica vazia, só madeira".
- **O balcão ou o caldeirão vieram com contorno grosso ou cara de desenho animado:** "mesma pintura do fundo-loja.png, sem contorno de tinta".
- **O fundo veio branco ou com xadrez desenhado:** peça "fundo transparente de verdade". Se não der, mande assim mesmo que eu recorto.
