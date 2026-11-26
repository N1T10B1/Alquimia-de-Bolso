# Prompt: fundo da tela de game over (botica fechada por dívida)

Tela nova da mecânica "Contas atrasadas": a despesa do dia que não dá para pagar vira dívida no livro-caixa e, depois de 3 dias devendo, o senhorio vem cobrar. Se ainda não houver dinheiro, ele fecha a botica e aparece esta tela.

O clima é de fim de história triste, mas gentil e com um toque de humor, como o resto do jogo. Nada assustador: ninguém foi preso, a boticária só perdeu a loja por enquanto.

Use na mesma conversa do ChatGPT em que você gerou o fundo do menu inicial (guia de estilo de xilogravura). Se for uma conversa nova, cole o guia de estilo antes e anexe `arte/menu/menu-fundo.png` como referência, para a tela de game over parecer irmã do menu.

| Arquivo | O que é | Tamanho |
|---|---|---|
| `game-over-fundo.png` | fundo do computador | 1920 x 1080 |
| `game-over-fundo-celular.png` | fundo do celular | 1080 x 1920 |

## Versão horizontal (computador)

```
Gere o FUNDO DA TELA DE FIM DE JOGO, no guia de estilo de xilogravura combinado. É a mesma loja de poções do fundo do menu inicial, na noite em que ela fecha as portas por falta de pagamento do aluguel.
Formato: horizontal, 1920x1080, imagem cheia (sem fundo transparente).
Cena: o balcão da loja visto de frente e um pouco de cima, de noite, com chuva fina na janela redonda e a lua escondida atrás de nuvens. No terço direito, sobre o balcão: o caderno de couro da boticária fechado, amarrado com um barbante e lacrado com um grande selo de cera vermelho; uma vela que acabou de apagar, soltando um fio de fumaça enrolado; o pequeno caldeirão de cobre frio e virado de boca para baixo; uma bolsinha de moedas de pano vazia e murcha, aberta, com uma única moeda caída ao lado. Pendurada num prego acima do balcão, uma argola com uma chave grande de ferro. Atrás, as prateleiras quase vazias, com só dois ou três frascos e muita poeira.
Composição: os dois terços da esquerda devem ficar calmos e escuros (parede de madeira com poucos detalhes e linhas entalhadas suaves), porque é ali que o jogo vai colocar o título, o resumo da partida e os botões por cima. Nada importante nessa área.
Clima: melancólico e aconchegante ao mesmo tempo, como o fim de um capítulo, não como uma tragédia. Nada de caveiras, sangue, correntes ou objetos quebrados.
Cores: no máximo 4 cores chapadas além do preto da matriz: azul-noite na janela, na chuva e nas sombras; cinza-fumaça na fumaça da vela; cobre no caldeirão; vermelhão no selo de cera. Sem a luz ocre-ouro da vela acesa: esta cena é mais fria que a do menu.
Proibido: texto, letras, números, título, placas escritas, logotipo, molduras e bordas.
```

## Versão vertical (celular)

```
Agora gere a mesma cena em formato vertical, 1080x1920, para celular. Mantenha o mesmo caderno lacrado, a vela apagada com fumaça, o caldeirão virado, a bolsinha vazia, a chave pendurada e a janela com chuva, agora agrupados no terço de BAIXO da imagem. Os dois terços de cima ficam calmos e escuros para o título, o resumo e os botões. Mesmo estilo, mesmas cores, sem texto.
```

## Dicas

- Se vier escuro ou triste demais, responda: "Deixe a cena um pouco mais aconchegante, como o fim de um capítulo: mais azul-noite e menos preto."
- Se a área da esquerda (ou de cima, no celular) vier cheia de detalhes, responda: "Deixe a área do título bem mais vazia e escura, só a parede de madeira."
- Se aparecer alguma placa com letras (tipo "fechado" ou "despejo"), responda: "Tire a placa, sem nenhuma letra na imagem." O texto fica no código, em Grenze, para poder ser traduzido.
- Salve como `game-over-fundo.png` e `game-over-fundo-celular.png` e mande aqui. Eu monto uma prévia da tela com o texto e os botões por cima para você aprovar antes de entrar no jogo.

## Carta do senhorio (fundo do texto): `game-over-carta.png`

Pedida pelo Rafael em 25/11/2026, depois de ver a prévia: o título, o resumo e os botões ficam escritos sobre uma carta de cobrança do senhorio, pregada na parede escura da esquerda. A mesma imagem serve no PC e no celular (o jogo só muda o tamanho dela). O texto continua no código, então o papel tem que vir vazio.

Peça na mesma conversa em que gerou os fundos do game over, para manter o estilo:

```
Agora gere uma peça separada para ficar POR CIMA desse fundo: "game-over-carta", 1024x1024, FUNDO TRANSPARENTE (PNG), no mesmo guia de estilo de xilogravura.
É uma carta de cobrança do senhorio, uma única folha de papel grosso e gasto, vista bem de frente, sem perspectiva, ocupando quase toda a imagem (deixe só uma margem transparente pequena em volta).
Detalhes: a folha está presa na parede por um prego de ferro no meio da borda de cima; tem as marcas de duas dobras (dobrada em três, como carta); as bordas estão um pouco amassadas e com um rasgadinho num canto; há uma mancha discreta de umidade num canto de baixo. No canto inferior direito, um pequeno carimbo redondo de tinta vermelha com o desenho de uma chave, sem letras.
O MEIO DA FOLHA fica LISO E VAZIO, cor de papel claro e uniforme (creme), sem linhas, sem textura forte e sem sombras, porque o jogo vai escrever o título, uma tabela e dois botões por cima, em tinta escura. Toda a sujeira e os detalhes ficam só nas bordas.
Cores: papel creme, tinta preta da matriz nos contornos, vermelhão só no carimbo, ferro escuro no prego.
Proibido: texto, letras, números, assinatura legível, linhas de escrita, moldura decorativa e qualquer coisa atrás da folha (nada de parede, só transparência).
```

Dicas da carta:
- Se o meio vier com textura ou linhas, responda: "Deixe o centro da folha liso e de uma cor só, sem textura, para eu escrever por cima."
- Se o fundo não vier transparente, responda: "Refaça com fundo transparente, só a folha e o prego."
- Se vier com letrinhas ou rabiscos imitando escrita, responda: "Tire toda a escrita, a folha tem que estar em branco."

## Como a tela funcionaria (proposta, ainda não implementada)

- Aparece depois da cena do senhorio no balcão, quando ele cobra e a dívida não cabe nas moedas. Entra com um fade de 1 s; o selo de cera do caderno "carimba" por cima (sem animação se o jogador pediu menos animação).
- Tudo fica escrito sobre a carta do senhorio, em tinta escura. Título em Grenze Gotisch, vermelhão: **"A botica fechou as portas"**.
- Linha de baixo em Grenze, tinta: "O senhorio levou a chave. Ficaram X moedas de aluguel atrasado."
- Resumo da partida, como uma página do livro-caixa: dias com a loja aberta, clientes atendidos, poções preparadas e receitas descobertas (X de 24).
- Botões no estilo fita marcadora do menu:
  1. **Recomeçar a botica** (principal, já selecionado): novo jogo do dia 1. O livro de receitas continua com o que foi descoberto.
  2. **Menu inicial**.
- O save da partida perdida é apagado, para o botão Continuar do menu não voltar para a dívida.
