# Prompt: sinal do caldeirão (no lugar do círculo de luz)

Hoje o caldeirão da loja pisca com um brilho redondo e amarelo (CSS `box-shadow`) para mostrar que dá para clicar nele. É o mesmo problema da antiga luz da noite: brilho e degradê não existem num livro impresso em xilogravura, por isso parece colado por cima da cena.

## O que a pesquisa mostrou

- **Nos livros antigos, quem diz "olhe aqui" é a mãozinha que aponta, a manícula (☞).** Ela aparece nas margens de manuscritos e de livros impressos dos séculos XV e XVI, primeiro desenhada pelos leitores e depois entalhada nos tipos dos impressores ([Manicule, Wikipedia](https://en.wikipedia.org/wiki/Manicule); [Newberry Library](https://www.newberry.org/blog/finger-pointing); [University of Melbourne](https://blogs.unimelb.edu.au/librarycollections/?p=3479); [St Andrews, manícula do século XV](https://university-collections.wp.st-andrews.ac.uk/2011/12/21/look-at-this-lovely-15th-century-manicula/)). É o "brilho de interação" do mundo do caderno.
- **Nos jogos, o brilho é só um dos jeitos de marcar um objeto que dá para usar.** Contorno, ícone flutuante, mudança de cor ou um sinal que só aparece ao passar o mouse também funcionam ([discussão na Unity](https://discussions.unity.com/t/creative-ways-to-select-an-object-with-highlight/590322); [DePaul, design de níveis](https://ogs.cdm.depaul.edu/?p=786); [devlog de Edge Case](https://smnthgn.itch.io/edge-case/devlog/972567/devlog-5-interaction-outline-and-prompt)). O que importa é ser **consistente** e **combinar com o estilo do jogo**. Um sinal que balança de leve chama mais a atenção que um brilho constante, e incomoda menos.
- **Na gravura, a "luz" de um objeto especial é feita com raios entalhados**: traços em cunha saindo em volta dele, como nas gravuras de objetos milagrosos e de astros. Não é um halo borrado.

**Proposta:** duas peças.

1. **Manícula**: uma mãozinha de xilogravura ao lado do caldeirão, apontando para ele e balançando devagar quadro a quadro. Ela aparece sempre que o caldeirão é a próxima coisa a fazer, e some depois que a pessoa já usou o caldeirão no dia.
2. **Raios de tinta**: ao passar o mouse ou focar com o teclado, em volta do caldeirão aparecem raios curtos em cunha que "fervem" de leve (3 a 4 quadros). Eles substituem o brilho amarelo do hover.

As duas peças vêm só em tinta e ocre, como a borda da noite, para combinarem de dia e à noite.

## Como usar

Cole na mesma conversa do ChatGPT em que você fez os efeitos animados (o caldo, o vapor e a noite), porque ela já tem o guia de estilo de efeitos em xilogravura. Se for uma conversa nova, cole antes o guia de `arte/prompt-efeitos-animados.md`. Gere uma peça por vez e salve com o nome indicado.

## 1. Manícula — `manicula.png`

```
Gere a sprite sheet "Manícula", no guia de estilo de efeitos em xilogravura combinado.
Tamanho: 1024 x 1024 px. Grade invisível de 2 colunas x 2 linhas = 4 quadros, cada célula com 512 x 512 px.
Em cada célula: uma manícula de livro impresso do século XVI, a mãozinha com o dedo indicador esticado APONTANDO PARA A DIREITA, vista de lado, com o punho de uma manga bufante com babado no lado esquerdo. Os outros dedos dobrados, unha do indicador visível. Traço de xilogravura: contorno grosso em tinta preta-amarronzada, sombras em hachura paralela curta, miolo branco do papel. A manga tem uma faixa em ocre-ouro (#b88a2e) chapado, um pouco desencontrada do contorno, como cor aplicada à mão. A mão ocupa cerca de 380 x 220 px e fica centralizada na célula, com margem vazia em volta.
A animação: a mão vai e volta para a direita como quem cutuca: quadro 1 na posição de descanso, quadro 2 avança uns 20 px para a direita, quadro 3 avança uns 36 px, quadro 4 volta para uns 16 px. A forma da mão é a mesma em todos os quadros, só a posição muda e o traço varia de leve ("line boil").
Só tinta preta-amarronzada, branco e ocre-ouro. Fundo transparente fora da mão, sem texto, sem letras, sem números, sem moldura, sem linhas de grade.
```

## 2. Raios de tinta — `raios-caldeirao.png`

```
Gere a sprite sheet "Raios de tinta", no guia de estilo de efeitos em xilogravura combinado.
Tamanho: 1024 x 1024 px. Grade invisível de 2 colunas x 2 linhas = 4 quadros, cada célula com 512 x 512 px.
Em cada célula: uma coroa de raios entalhados em volta de um espaço vazio no formato de uma elipse vertical (cerca de 300 x 340 px, centralizada), como os raios que saem de um objeto milagroso nas gravuras antigas. São uns 24 raios em cunha, alternando longos (cerca de 70 px) e curtos (cerca de 40 px), todos apontando para fora a partir da borda da elipse. Entre alguns raios, 3 ou 4 estrelinhas de quatro pontas. A elipse do meio é COMPLETAMENTE TRANSPARENTE, sem contorno e sem nenhuma linha dentro: o caldeirão vai aparecer ali.
A animação: os raios "fervem" de leve; em cada quadro os raios longos e curtos trocam um pouco de comprimento e o traço varia, como se a gravura tremesse. A elipse vazia fica exatamente no mesmo lugar e tamanho nos 4 quadros. O quadro 4 emenda no quadro 1.
Cores: raios em tinta preta-amarronzada com o miolo de cada raio em ocre-ouro (#b88a2e) chapado; estrelinhas em ocre-ouro com contorno de tinta. Nada de brilho, degradê, halo ou luz borrada.
Fundo transparente, sem texto, sem caldeirão, sem linhas de grade.
```

## Se algo sair errado

- **A mão apontou para o lado errado:** tudo bem, o código espelha. Só avise.
- **A mão mudou de forma ou de tamanho entre os quadros:** "mantenha a mesma mão no mesmo tamanho nos 4 quadros; só a posição muda para a direita".
- **Os raios vieram como um círculo de luz ou com brilho:** "só traços de tinta em cunha, sem luz, sem halo, sem degradê".
- **A elipse do meio veio com desenho ou contorno:** "o meio tem que ser transparente, sem nenhum traço".
- **Vieram linhas de grade ou números:** "refaça sem nenhuma linha de grade, borda ou número; as células são invisíveis".
- **O fundo veio branco ou com xadrez desenhado:** peça "fundo transparente de verdade". Se não der, mande assim mesmo que eu recorto.
