# Guia de arte: O Caderno da Boticária

Linha de arte oficial da Alquimia de Bolso, aprovada pelo Rafael em 20/11/2026 (linha "Grimório de bolso"). Este guia é a regra para toda arte de interface. Os retratos dos clientes e o fundo da loja são gerados à parte pelo Rafael (ver `prompts-chatgpt.md`) e precisam conviver com esta interface.

## 1. A ideia em uma frase

A interface é o **caderno de bolso de uma boticária viajante**: metade grimório alquímico, metade caderno de campo de naturalista, com etiquetas de botica, numeração de espécimes e manchas de aquarela onde as poções deram certo (ou errado).

## 2. O que pegamos das referências, e o que NÃO pegamos

| Referência | O que captamos | O que não copiamos |
| --- | --- | --- |
| Manuscritos medievais | Rubrica em vermelho e azul, capitulares, linhas de pauta, margens largas | Iluminuras religiosas, ouro em excesso, letra gótica ilegível |
| Manuscritos alquímicos (Ripley Scroll, Splendor Solis) | As 4 cores da Grande Obra e diagramas com setas e círculos | Imagens perturbadoras ou simbolismo religioso |
| Caderno de campo (Maria Sibylla Merian) | Numeração de espécimes, anotações à mão ao redor do desenho, mostrar o ingrediente no seu ambiente | Prancha científica fria |
| Potion Craft | Só a sensação de "papel e tinta" | Mapa de navegação, gravura envelhecida em tom sépia, composição das telas, ícones e fontes dele |
| Inkulinati | Só a ideia de a interface ser o próprio livro | Marginália animada, criaturas de batalha, paleta e personagens |

Regra de autenticidade: nenhum elemento pode ser redesenhado olhando uma captura de outro jogo. Desenhe a partir das fontes históricas (manuscritos e herbários) e deste guia.

## 3. Os quatro elementos de assinatura

São eles que fazem o jogo ser reconhecido sem parecer nenhum outro:

1. **As cores da Grande Obra como raridade.** Na alquimia histórica, a obra passa por quatro etapas de cor ([fonte](https://en.wikipedia.org/wiki/Magnum_opus_(alchemy))). Usamos isso como sistema de raridade:
   - Lodo (falha) = **nigredo**, mancha de tinta preta borrada.
   - Comum = **albedo**, selo prata/branco.
   - Incomum = **citrinitas**, selo amarelo-ouro.
   - Rara = **rubedo**, selo vermelho.
2. **Etiqueta de botica numerada.** Cada poção e ingrediente tem uma etiqueta de papel com número de espécime (ex.: "Nº 07"), no estilo das notas numeradas de Merian.
3. **Fitas marcadoras como abas.** As abas do jogo (Bancada, Livro, Loja) são fitas de tecido presas no topo do caderno, uma cor por aba.
4. **Carimbos e selos de cera como feedback.** Descoberta nova = carimbo "Nova!"; pedido entregue = selo de cera; nível novo = selo maior com o número.

## 4. Paleta

Texto sempre em tinta escura sobre papel claro. Contraste mínimo de 4,5:1 para qualquer texto.

| Nome | Uso | Hex |
| --- | --- | --- |
| Papel | fundo das páginas | `#efe2c4` |
| Papel sombra | dobras, bordas, cartões | `#d9c49a` |
| Couro | capa do caderno, moldura externa da tela | `#4a2c1a` |
| Tinta ferrogálica | texto e traço principal | `#2b1e16` |
| Vermelhão | rubrica, títulos, botão principal, rubedo | `#a8322a` |
| Ultramar | capitulares, links, foco | `#2c4f9e` |
| Verdete | sucesso, natureza | `#3f7f6a` |
| Ouro velho | citrinitas, moedas, detalhes (com moderação) | `#b88a2e` |
| Cobre | caldeirão, metais | `#c87533` |
| Turquesa e violeta | só líquidos mágicos, brilhos | `#3fd0c9`, `#a77be6` |

Modo escuro: o caderno é lido à luz de vela. Papel vira `#2a2018`, tinta vira `#efe2c4`, e as cores de acento ficam um pouco mais claras para manter o contraste.

## 5. Tipografia

Atualizado em 20/11/2026: o Rafael aprovou a dupla **Grenze Gotisch + Grenze** (testes em https://claude.ai/artifact/5gb3GT2DX9JpDD2d8mVe1z). Ela substitui a IM Fell em todo o jogo.

- Títulos e chamadas grandes (28 px ou mais): **Grenze Gotisch**, peso 500 a 700. Nunca em caixa alta, nunca em texto corrido.
- Botões, abas, nomes de poções e ingredientes, rótulos e subtítulos: **Grenze**, peso 500 a 600.
- Texto corrido (descrições, pedidos, dicas, tutorial): **Alegreya Sans**, tamanho mínimo de 15px.
- Números (moedas, preços, XP): Grenze com algarismos tabulares.
- Capitular: a primeira letra do título de cada página em vermelhão ou ultramar, com 2 linhas de altura.
- O jogo precisa funcionar offline em `jogar.html`. As fontes devem ir embutidas (subset em base64) ou ter fallback seguro: `"Iowan Old Style", Georgia, serif`.

## 6. Traço e textura

- Traço: linha de tinta de 1,5px, cor tinta ferrogálica, pontas arredondadas, levemente irregular (sem régua perfeita).
- Preenchimento: aquarela chapada com borda um pouco mais escura, sem gradiente brilhante.
- Textura de papel: só com CSS (gradiente radial suave e ruído leve); nada de imagem de pergaminho rasgado.
- Linhas de pauta claras nas páginas de texto, como nos manuscritos.
- Sem sombras projetadas modernas. Profundidade vem de papel sobreposto e da borda mais escura.

## 7. Peças que o setor de artes deve criar

Tudo em SVG inline ou CSS, sem arquivos de imagem externos (regra do GDD).

1. **Tela principal** (celular 360px e desktop 1280px): caderno aberto, página esquerda com ingredientes, página direita com caldeirão, pedidos como bilhetes presos por alfinete no topo, área reservada para o retrato do cliente.
2. **Caldeirão de cobre** em 5 estados: vazio, com 1 ingrediente, mexendo, sucesso (vapor colorido + carimbo), lodo (mancha preta).
3. **8 ingredientes**: Gota Lunar, Brasa Rubra, Folha Viva, Pó de Cristal, Sombra Engarrafada, Orvalho Solar, Cogumelo Azul, Pena do Vento. Cada um como desenho de caderno de campo com etiqueta numerada.
4. **12 frascos de poção + Lodo Instável**, cada um com silhueta de frasco própria e cor do líquido, e o selo de raridade.
5. **Botões**: principal (vermelhão), secundário (contorno de tinta), desativado, hover, pressionado e foco visível (contorno ultramar).
6. **Abas** como fitas marcadoras, ativa e inativa.
7. **Cartão de pedido** como bilhete de papel com alfinete: cliente, poção pedida (ou pista) e recompensa.
8. **HUD**: moedas, XP com barra desenhada como linha de tinta enchendo, e nível no selo de cera.
9. **Livro de receitas**: página de receita descoberta (desenho + anotações) e página não descoberta (silhueta a lápis com "?").
10. **3 melhorias** (Caldeirão Eficiente, Marca do Mercador, Lupa Arcana) como pequenas gravuras com etiqueta de preço.
11. **Feedback**: carimbo "Nova!", selo de pedido entregue, aviso de erro (nota rabiscada) e o aviso de "já tentou esta mistura".
12. **Janelas**: vitória (página de honra com as 12 poções), confirmação de novo jogo e dica.
13. **Ícones pequenos**: som ligado/desligado, dica, fechar, voltar, todos no mesmo traço.

## 8. Regras de uso

- Legibilidade vence decoração: ornamento só em títulos, divisórias e molduras.
- Área de toque mínima de 44 x 44 px no celular.
- Animação curta (até 300 ms): virar página, carimbo batendo, vapor subindo. Respeitar `prefers-reduced-motion`.
- Nada de emoji na versão final: cada emoji atual vira um desenho no traço do guia.
- Retratos dos clientes (gerados por IA) entram numa moldura de papel colada com fita no caderno, para casar com a interface.

## 9. Processo de aprovação

1. O setor de artes cria **todas as peças da seção 7** e publica um **álbum** (página única) com cada peça numerada, em tamanho real e ampliada, nos modos claro e escuro.
2. O Rafael avalia o álbum e aprova ou pede ajustes por número da peça.
3. **Só depois da aprovação** a arte é implementada no jogo.

## Fontes da pesquisa

- [Decoração e iluminação de manuscritos (Univ. de Nottingham)](https://www.nottingham.ac.uk/manuscriptsandspecialcollections/researchguidance/medievalbooks/decorationandillumination.aspx)
- [Capitulares a pena do Peterborough Psalter (Fitzwilliam Museum)](https://www.fitzmuseum.cam.ac.uk/illuminated/manuscript/discover/the-peterborough-psalter/material/the-penwork-initials/folio/folio-169v)
- [Pigmentos e produção de manuscritos (Getty)](https://www.getty.edu/education/teachers/classroom_resources/curricula/manuscripts/background1.html)
- [Depicting the Great Work (Princeton)](https://dpul.princeton.edu/alchemy/feature/depicting-the-great-work)
- [Manuscritos alquímicos (Vice)](https://www.vice.com/en/article/these-surreal-ancient-alchemy-manuscripts-are-terrifyingly-cool/)
- [Magnum opus e as 4 etapas de cor (Wikipedia)](https://en.wikipedia.org/wiki/Magnum_opus_(alchemy))
- [Observações de campo de Maria Sibylla Merian (Dartmouth)](https://exhibits.library.dartmouth.edu/s/merian/page/field-observations)
- [Merian e o ecossistema (Dartmouth)](https://exhibits.library.dartmouth.edu/s/merian/page/ecosystem-artist)
- [Skeuomorfismo de manuscrito em interface (daisyUI)](https://trends.daisyui.com/trend/historical-manuscript-skeuomorphism/)
- [Interface diegética e legibilidade (Unity)](https://unity.com/blog/games/how-to-immerse-your-players-through-effective-ui-and-game-design)
