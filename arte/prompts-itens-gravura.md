# Prompts para gerar os itens em estilo xilogravura no ChatGPT

Mesma lógica dos prompts dos personagens: uma única conversa no ChatGPT para todos os itens, para o estilo ficar igual. Envie primeiro o guia de estilo, depois um item por mensagem usando o modelo.

São 29 imagens: 8 ingredientes, 12 poções, o Lodo Instável, 3 melhorias e 5 objetos da interface. Os vasos das poções são os mesmos do álbum do setor de artes.

---

## Mensagem 1: guia de estilo (envie primeiro, sem pedir imagem ainda)

```
Vou te pedir várias ilustrações de objetos para um jogo de navegador chamado "Alquimia de Bolso", uma loja de poções aconchegante de fantasia medieval. Todas as imagens desta conversa devem seguir EXATAMENTE este guia de estilo. Não gere nada ainda, só confirme que entendeu.

GUIA DE ESTILO: XILOGRAVURA COLORIDA À MÃO
- Técnica: xilogravura antiga, impressão de matriz de madeira entalhada, como nos herbários e livros de alquimia impressos do século XV e XVI. Linhas grossas e firmes em tinta preta-amarronzada (#2b1e16), com a marca da goiva visível: traços entalhados em cunha, sombras feitas com linhas paralelas grossas e áreas chapadas de preto. Leve textura de veio de madeira e pequenas falhas de impressão. Nada de hachura fina de gravura em metal, nada de degradê digital.
- Cor: no máximo 3 cores por item, aplicadas à mão em manchas chapadas por cima da impressão, um pouco desencontradas do contorno, como nas xilogravuras coloridas antigas. O preto da matriz continua por cima de tudo.
- Formas: simplificadas e expressivas, contornos fechados e grossos, poucos detalhes, legíveis mesmo em tamanho pequeno (64 px).
- Paleta de pigmentos: vermelhão (#a8322a), azul-ultramar (#2c4f9e), verdete (#3f7f6a), ocre-ouro (#b88a2e), cobre (#c87533). Turquesa (#3fd0c9) e violeta (#a77be6) só nos líquidos e brilhos mágicos.
- Luz: sempre vindo do alto à esquerda, linhas de sombra entalhadas à direita.
- Composição: um único objeto, centralizado, em vista de três quartos levemente de cima, ocupando cerca de 75% da altura da imagem, com margem vazia em volta. Todos os objetos na mesma escala visual, como se fossem pranchas da mesma coleção.
- Formato: quadrado 1024x1024, FUNDO TRANSPARENTE (PNG). Sem sombra no chão, sem mesa, sem cenário.
- Clima: charmoso e um pouco bem-humorado, nada sombrio ou assustador.
- Proibido: texto, letras, números, rótulos escritos, logotipos, marcas d'água, molduras e bordas.
```

---

## Modelo de item (uma mensagem por item)

```
Gere a ilustração do item [NOME], no guia de estilo de xilogravura combinado.
Tipo: [TIPO]
Objeto: [DESCRIÇÃO]
Cores: [CORES]
Fundo transparente, objeto centralizado, mesma escala dos itens anteriores, sem texto.
```

Troque [NOME], [TIPO], [DESCRIÇÃO] e [CORES] pelos textos da lista abaixo.

---

## Lista de itens

### Ingredientes (8)

1. **Gota Lunar** (`agua`)
   - Tipo: ingrediente
   - Objeto: uma gota de água grande e perfeita, flutuando, com um pequeno crescente de lua refletido dentro dela e três gotinhas menores caindo ao lado.
   - Cores: azul-ultramar claro na gota, reflexo prateado da lua, linhas de sombra entalhadas em azul-escuro.
2. **Brasa Rubra** (`fogo`)
   - Tipo: ingrediente
   - Objeto: um pedaço de carvão em brasa, rachado, com chamas pequenas saindo das rachaduras e duas faíscas soltas.
   - Cores: vermelhão nas rachaduras e chamas, ocre-ouro no centro das chamas, carvão em preto chapado.
3. **Folha Viva** (`planta`)
   - Tipo: ingrediente
   - Objeto: um ramo com três folhas largas de nervuras bem desenhadas, como numa prancha de herbário, com a ponta de uma folha levemente enrolada como se estivesse se mexendo.
   - Cores: verdete nas folhas, nervuras em tinta marrom, caule ocre.
4. **Pó de Cristal** (`cristal`)
   - Tipo: ingrediente
   - Objeto: um pequeno saquinho de pano amarrado com barbante, aberto, com um monte de pó brilhante e dois cristais facetados saindo dele.
   - Cores: pano em pergaminho, cristais em azul-claro e branco com reflexos, pó cintilante.
5. **Sombra Engarrafada** (`sombra`)
   - Tipo: ingrediente
   - Objeto: um frasco pequeno e arredondado com rolha de cortiça e lacre, cheio de uma fumaça escura que se mexe lá dentro, com dois pontinhos de luz como olhos curiosos.
   - Cores: vidro levemente esverdeado, fumaça em violeta muito escuro quase preto, lacre vermelhão.
6. **Orvalho Solar** (`luz`)
   - Tipo: ingrediente
   - Objeto: uma flor aberta tipo calêndula com uma gota dourada de orvalho no centro, soltando pequenos raios de luz desenhados como num sol de xilogravura.
   - Cores: pétalas em ocre-ouro e laranja, gota em amarelo luminoso, raios em ocre.
7. **Cogumelo Azul** (`cogumelo`)
   - Tipo: ingrediente
   - Objeto: dois cogumelos de chapéu redondo, um grande e um pequeno, nascendo de um pedacinho de musgo, com pintinhas no chapéu e um brilho suave em volta.
   - Cores: chapéus em azul-ultramar com pintas brancas, pés em pergaminho, musgo verdete, brilho turquesa bem leve.
8. **Pena do Vento** (`vento`)
   - Tipo: ingrediente
   - Objeto: uma pena longa e leve, levemente curvada, flutuando, com três linhas de vento em espiral desenhadas em volta como nos mapas antigos.
   - Cores: pena em branco-acinzentado com ponta azul-clara, linhas de vento em tinta marrom.

### Poções (12)

Cada poção tem um vaso histórico de laboratório diferente, para que todas tenham silhueta própria.

9. **Névoa Fumegante** (`vapor`)
   - Tipo: poção
   - Objeto: um alambique de cobre pequeno, com a cúpula e o bico longo, soltando uma névoa espessa que sobe em caracol.
   - Cores: cobre no alambique, névoa em cinza-perolado com toque turquesa.
10. **Elixir de Cura** (`cura`)
    - Tipo: poção
    - Objeto: uma ampola de vidro de colo longo e fino, com rolha de cortiça e um raminho de erva amarrado no pescoço com barbante.
    - Cores: líquido verde-esmeralda claro, vidro transparente, erva verdete.
11. **Tônico de Vigor** (`vigor`)
    - Tipo: poção
    - Objeto: um albarelo, pote de farmácia de cerâmica com cintura, decorado com faixas pintadas, com a tampa de pano amarrada e bolhinhas saindo.
    - Cores: cerâmica branca com faixas ultramar, líquido laranja vivo aparecendo nas bolhas.
12. **Essência Cintilante** (`brilho`)
    - Tipo: poção
    - Objeto: um frasco de vidro facetado como uma pedra preciosa, com tampa em forma de estrela, e pequenas estrelas de xilogravura saindo do vidro.
    - Cores: líquido dourado brilhante, reflexos brancos nas facetas.
13. **Véu Invisível** (`invisibilidade`)
    - Tipo: poção
    - Objeto: uma fiala esguia e alta, com a metade de baixo desaparecendo, desenhada só com contorno pontilhado, como se estivesse ficando invisível.
    - Cores: líquido lavanda-pálido quase transparente, contorno pontilhado em tinta marrom.
14. **Chá do Sono** (`sono`)
    - Tipo: poção
    - Objeto: uma cabaça seca usada como garrafa, com tampa de cortiça e uma touca de dormir minúscula pendurada no gargalo, com três "z" desenhados como fumacinhas (formas, não letras).
    - Cores: cabaça em ocre, líquido azul-noite visível na boca, touca vermelhão.
15. **Chama Azul** (`chamaazul`)
    - Tipo: poção
    - Objeto: uma retorta de vidro, o frasco redondo com o pescoço longo dobrado para o lado, com uma pequena chama azul dançando dentro do líquido.
    - Cores: líquido e chama em azul-ultramar e turquesa, vidro transparente.
16. **Pele de Raiz** (`raiz`)
    - Tipo: poção
    - Objeto: um matraz cônico de vidro com raízes finas crescendo de dentro para fora, enroladas em volta do vidro.
    - Cores: líquido verde-musgo, raízes em marrom e ocre, pequenas folhas verdete.
17. **Gotas do Amanhecer** (`amanhecer`)
    - Tipo: poção
    - Objeto: um frasco em forma de gota com tampa de vidro, e dentro dele o líquido em camadas como um céu nascendo, com um pequeno sol no topo.
    - Cores: camadas de rosa, laranja e ouro, sol em ocre-ouro.
18. **Eclipse Líquido** (`eclipse`)
    - Tipo: poção rara
    - Objeto: um pelicano alquímico, vaso de vidro com dois braços curvos que saem do pescoço e voltam para o corpo, com o líquido metade escuro e metade brilhante, formando um eclipse dentro do vaso.
    - Cores: metade violeta-escuro, metade dourada, anel de luz turquesa no encontro das duas.
19. **Nuvem de Esporos** (`esporos`)
    - Tipo: poção
    - Objeto: um aludel, vasos de cerâmica empilhados uns sobre os outros como uma pequena torre, com esporos redondos flutuando para fora pelo topo.
    - Cores: cerâmica pergaminho, esporos em verde-claro e azul.
20. **Faísca da Tempestade** (`tempestade`)
    - Tipo: poção
    - Objeto: uma garrafa de ombro largo com rolha amarrada, com uma nuvenzinha de tempestade dentro e um pequeno raio em zigue-zague.
    - Cores: líquido cinza-azulado, raio em ocre-ouro, vidro levemente esverdeado.

### Falha (1)

21. **Lodo Instável** (`lodo`)
    - Tipo: mistura que deu errado
    - Objeto: um pote de barro rachado, com uma gosma escura transbordando pela borda e escorrendo pela lateral, e uma bolha engraçada estourando no topo.
    - Cores: barro ocre-escuro, gosma marrom-esverdeada quase preta.

### Melhorias (3)

22. **Caldeirão Eficiente** (`caldeirao`)
    - Tipo: melhoria
    - Objeto: um caldeirão de cobre pequeno e reforçado, com rebites e um fole de couro preso ao lado.
    - Cores: cobre polido, fole em couro marrom, borda ocre.
23. **Marca do Mercador** (`mercador`)
    - Tipo: melhoria
    - Objeto: um sinete de mercador, o carimbo de metal com cabo de madeira, ao lado de um selo de cera recém-carimbado com o desenho de uma balança.
    - Cores: metal em ocre-ouro, cabo em madeira, cera vermelhão.
24. **Lupa Arcana** (`lupa`)
    - Tipo: melhoria
    - Objeto: uma lupa antiga com aro de latão gravado e cabo de osso, com um pequeno brilho de magia na lente.
    - Cores: aro em ocre-ouro, cabo pergaminho, lente com reflexo turquesa.

### Objetos da interface (5)

25. **Caldeirão da bancada** (`caldeirao-bancada`)
    - Tipo: objeto principal da tela
    - Objeto: um caldeirão grande de cobre sobre um tripé de ferro, com brasas embaixo e a boca vazia vista um pouco de cima, para o jogo colocar o líquido por cima.
    - Cores: cobre, ferro em preto chapado, brasas vermelhão.
26. **Moeda** (`moeda`)
    - Tipo: ícone
    - Objeto: uma moeda antiga grossa, de borda irregular, com um frasco gravado no centro.
    - Cores: ocre-ouro com linhas entalhadas.
27. **Vela da dica** (`vela`)
    - Tipo: ícone
    - Objeto: um toco de vela num castiçal de latão com alça, chama acesa e cera escorrida.
    - Cores: cera pergaminho, chama ocre-ouro, castiçal cobre.
28. **Sino do balcão** (`sino`)
    - Tipo: ícone de som
    - Objeto: um sino de balcão de loja antigo, de latão, com base de madeira.
    - Cores: latão ocre-ouro, base em madeira marrom.
29. **Selo de cera** (`selo`)
    - Tipo: ícone de nível e de pedido entregue
    - Objeto: um selo de cera redondo, com bordas irregulares e o desenho de um frasco no centro, sem letras.
    - Cores: cera vermelhão com brilho.

---

## Dicas

- Se um item sair com degradê, cara de 3D ou traço fino demais, responda: "Refaça como xilogravura: linhas grossas entalhadas a goiva, áreas chapadas de preto, no máximo 3 cores chapadas por cima."
- Se aparecer texto ou rótulo, responda: "Remova todo texto e rótulo, deixe a etiqueta em branco ou sem etiqueta."
- Se o fundo não vier transparente, peça: "Remova o fundo e entregue em PNG transparente."
- Se a escala variar muito, responda: "Mantenha o mesmo tamanho visual dos itens anteriores, ocupando 75% da altura."
- Salve cada imagem com o id entre parênteses: `item-agua.png`, `item-vapor.png`, `item-lodo.png`, `item-caldeirao.png`, `item-moeda.png` e assim por diante.
- Para testar o estilo, comece por 3 itens de tipos diferentes: Gota Lunar, Elixir de Cura e Lodo Instável.
