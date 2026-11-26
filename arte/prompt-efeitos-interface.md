# Prompt: efeitos da interface em xilogravura (vela, estrelinhas, carta escolhida)

São os brilhos que ainda são feitos em CSS e destoam do caderno. O brilho do caldeirão e o brilho dos bilhetes do tutorial já estão resolvidos pela manícula e pelos raios de `arte/prompt-indicador-caldeirao.md`, então não entram aqui.

| Hoje (CSS) | Vira |
|---|---|
| Barrinha verde → amarela → vermelha com chama brilhando na ponta (paciência do cliente) | Uma vela de verdade que vai derretendo, com uma chama desenhada que tremula |
| Bolinhas coloridas que explodem quando você descobre uma receita | Estrelinhas de xilogravura que saltam e giram |
| Aro colorido em volta da carta de ingrediente escolhida | Uma moldura de tinta com cantoneiras, como uma página marcada |

O cliente que entra "saindo da sombra" (degradê) ficou de fora: é rápido e quase não aparece. Se ainda incomodar depois, dá para trocar por um desenho.

## Como usar

Cole na mesma conversa do ChatGPT em que você fez os efeitos animados (caldo, vapor e noite), porque ela já tem o guia de estilo de efeitos em xilogravura. Se for uma conversa nova, cole antes o guia de `arte/prompt-efeitos-animados.md`. Gere uma peça por vez e salve com o nome indicado.

## 1. Vela da paciência — `vela-paciencia.png`

O jogo mostra um quadro por vez conforme a paciência do cliente acaba: quadro 1 é a vela inteira e quadro 8 é o toco quase apagado. Ela aparece pequena, ao lado do nome do cliente e embaixo dos retratos da fila.

```
Gere a sprite sheet "Vela da paciência", no guia de estilo de efeitos em xilogravura combinado.
Tamanho: 1024 x 1024 px. Grade invisível de 4 colunas x 2 linhas = 8 quadros, cada célula com 256 x 512 px (vertical).
Em cada célula: uma vela de sebo num castiçal baixo de prato com alça, vista de frente. O castiçal é IGUAL e NO MESMO LUGAR em todos os quadros, apoiado na base da célula (cerca de 180 x 60 px). Só a vela muda: no quadro 1 ela é alta (cerca de 330 px) e reta; a cada quadro fica mais baixa e mais derretida, com mais escorridos de cera descendo pelos lados e pingos no prato; no quadro 8 é um toco de uns 30 px afundado numa poça de cera. Pavio curto e preto no topo de cada vela, SEM CHAMA (a chama é outra imagem).
Traço: contorno grosso em tinta preta-amarronzada, sombra em hachura paralela no lado direito da vela, cera em branco do papel. Castiçal em ocre-ouro (#b88a2e) chapado com contorno de tinta.
Fundo transparente fora do desenho, sem chama, sem brilho, sem texto, sem linhas de grade.
```

## 2. Chama da vela — `chama-vela.png`

Fica por cima do pavio e tremula sempre. Quando a paciência está acabando, o jogo troca para os quadros da chama fraca.

```
Gere a sprite sheet "Chama da vela", no guia de estilo de efeitos em xilogravura combinado.
Tamanho: 1024 x 1024 px. Grade invisível de 4 colunas x 2 linhas = 8 quadros, cada célula com 256 x 512 px (vertical).
Em cada célula: uma chama de vela de xilogravura, em forma de gota pontuda, com a base num ponto fixo no centro da parte de baixo da célula (sempre o mesmo lugar). Contorno grosso em tinta, miolo em ocre-ouro (#b88a2e) chapado, um núcleo menor em branco do papel perto da base e 2 ou 3 traços curtos de tinta subindo do lado da chama como fumaça.
Linha de cima (quadros 1 a 4): chama viva e alta (cerca de 200 px), que se inclina um pouco para a esquerda, fica reta, se inclina para a direita e volta, como se balançasse.
Linha de baixo (quadros 5 a 8): a mesma chama fraca e baixa (cerca de 90 px), com o miolo em vermelhão (#a8322a), tremendo mais e soltando um fio de fumaça de tinta.
Nada de brilho, halo ou degradê. Fundo transparente, sem vela, sem texto, sem linhas de grade.
```

## 3. Estrelinhas da descoberta — `estrelinhas.png`

Quando uma receita nova aparece, o jogo espalha várias cópias destas estrelinhas em volta do frasco, girando e sumindo. Por isso cada quadro é uma estrelinha diferente, e não uma animação.

```
Gere a folha "Estrelinhas da descoberta", no guia de estilo de efeitos em xilogravura combinado.
Tamanho: 1024 x 1024 px. Grade invisível de 2 colunas x 2 linhas = 4 células, cada uma com 512 x 512 px.
Em cada célula, centralizado e com bastante margem vazia, um ornamento pequeno diferente dos livros impressos antigos (cerca de 260 px):
1. estrela de quatro pontas longas e finas, em cunha;
2. estrela de seis pontas com um furinho redondo no meio;
3. um pequeno sol de xilogravura: círculo com 12 raios curtos alternados em cunha;
4. uma folhinha de arruda girando, com um pontinho ao lado.
Contorno grosso em tinta preta-amarronzada, miolo em ocre-ouro (#b88a2e) chapado, uma das quatro com o miolo em vermelhão (#a8322a). Nada de brilho, halo ou degradê.
Fundo transparente, sem texto, sem linhas de grade.
```

## 4. Moldura da carta escolhida — `carta-escolhida.png`

Fica por cima da carta de ingrediente que já está no caldeirão. Será fatiada em 9 partes para servir em qualquer tamanho de carta.

```
Gere a peça "Moldura da carta escolhida", no guia de estilo de efeitos em xilogravura combinado.
Tamanho: 1024 x 1536 px (proporção 2:3), vertical.
Peça: uma moldura retangular vazada, como a marca que se faz em volta de uma figura do herbário para destacá-la. Filete duplo em tinta (o de fora grosso, o de dentro fino), com uma linha tracejada de ocre-ouro (#b88a2e) entre os dois, de cerca de 40 px de espessura no total. Nos quatro cantos, cantoneiras de cerca de 150 px: um ramo curto de arruda dobrando o canto e uma estrelinha de quatro pontas em ocre-ouro. No meio da borda de cima, um pequeno laço de fita vermelhão (#a8322a) com as duas pontas caídas, como uma fita marcadora presa na página.
Entre os cantos, as bordas são retas e iguais do começo ao fim, para poder esticar. O CENTRO é COMPLETAMENTE TRANSPARENTE: a carta aparece por trás.
Vista frontal, simétrica, sem sombra, sem texto, fundo transparente fora da moldura.
```

## Se algo sair errado

- **O castiçal ou a base da chama mudaram de lugar entre os quadros:** "o castiçal (ou a base da chama) fica exatamente no mesmo lugar e no mesmo tamanho em todos os quadros; só a vela (ou a chama) muda".
- **A vela veio com chama acesa:** "sem chama, só o pavio preto; a chama é outra imagem".
- **Veio brilho, halo ou degradê:** "só tinta e cores chapadas, sem luz, sem brilho".
- **O meio da moldura veio com papel ou desenho:** "o centro tem que ser transparente, sem nada".
- **Vieram linhas de grade ou números:** "refaça sem nenhuma linha de grade, borda ou número; as células são invisíveis".
- **O fundo veio branco ou com xadrez desenhado:** peça "fundo transparente de verdade". Se não der, mande assim mesmo que eu recorto.
- Se vierem menos quadros que o pedido, mande assim mesmo dizendo quantos vieram: eu ajusto no código.
