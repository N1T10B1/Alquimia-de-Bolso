# Prompt: tela de fim da demo (carta da Mestra Benvinda)

Tela nova da v1.28. A demo termina no fechamento do dia 5: a mercadora não vem e, no lugar dela, chega uma carta da Mestra Benvinda, que foi ver o mar. A tela mostra a carta, o resumo da partida e os botões "Começar de novo" e "Menu inicial".

O clima é o oposto do game over: fim de capítulo feliz, manhã clara, cheiro de maresia. É a irmã alegre da tela da botica fechada.

Use na mesma conversa do ChatGPT em que você gerou o fundo do menu e o do game over (guia de estilo de xilogravura). Se for uma conversa nova, cole o guia de estilo antes e anexe `arte/menu/menu-fundo.png` e `arte/game-over/game-over-fundo.png` como referência.

| Arquivo | O que é | Tamanho |
|---|---|---|
| `fim-demo-fundo.png` | fundo do computador | 1920 x 1080 |
| `fim-demo-fundo-celular.png` | fundo do celular | 1080 x 1920 |
| `fim-demo-carta.png` | a folha da carta, por cima do fundo (PC e celular) | 1024 x 1024, fundo transparente |

## 1. Versão horizontal (computador)

```
Gere o FUNDO DA TELA DE FIM DA DEMO, no guia de estilo de xilogravura combinado. É a mesma loja de poções do fundo do menu inicial, na manhã seguinte a um dia de muito trabalho, quando chega uma carta da antiga dona da loja, que foi morar perto do mar.
Formato: horizontal, 1920x1080, imagem cheia (sem fundo transparente).
Cena: o balcão da loja visto de frente e um pouco de cima, de manhã cedo, com a luz do sol entrando pela janela redonda. Pela janela, lá longe, depois dos telhados tortos da vila, aparece uma faixa fina de mar com duas ou três gaivotas. No terço direito, sobre o balcão: o caderno de couro da boticária aberto, com as páginas cheias de anotações ilegíveis e desenhos de frascos (só rabiscos, nenhuma letra legível); um envelope de papel aberto, amarrado com barbante, com o lacre de cera azul-esverdeado partido ao meio; uma concha grande e uma estrela-do-mar seca; um frasquinho cheio de areia com rolha; uma pena de gaivota; o pequeno caldeirão de cobre aceso, com um fio de vapor alegre subindo. Nas prateleiras atrás, frascos cheios e coloridos, bem arrumados.
Composição: os dois terços da esquerda devem ficar calmos (parede de madeira clara com poucos detalhes e linhas entalhadas suaves, banhada de sol), porque é ali que o jogo vai colocar a carta, o resumo da partida e os botões por cima. Nada importante nessa área.
Clima: acolhedor, luminoso e um pouco saudoso, como o fim feliz de um capítulo. Sem personagens na cena.
Cores: no máximo 4 cores chapadas além do preto da matriz: ocre-ouro na luz do sol, azul-esverdeado no mar e no lacre, cobre no caldeirão, vermelhão em pequenos detalhes (fitas do caderno). Mais quente e mais clara que a tela de game over.
Proibido: texto, letras, números, título, placas escritas, logotipo, molduras e bordas.
```

## 2. Versão vertical (celular)

```
Agora gere a mesma cena em formato vertical, 1080x1920, para celular. Mantenha o caderno aberto, o envelope com o lacre azul-esverdeado partido, a concha, a estrela-do-mar, o frasco de areia, a pena de gaivota, o caldeirão com vapor e a janela com a faixa de mar, agora agrupados no terço de BAIXO da imagem. Os dois terços de cima ficam calmos e claros para a carta, o resumo e os botões. Mesmo estilo, mesmas cores, sem texto.
```

## 3. A folha da carta: `fim-demo-carta.png`

Peça na mesma conversa, depois dos fundos:

```
Agora gere uma peça separada para ficar POR CIMA desse fundo: "fim-demo-carta", 1024x1024, FUNDO TRANSPARENTE (PNG), no mesmo guia de estilo de xilogravura.
É uma carta pessoal escrita por uma velha alquimista que mora perto do mar: uma única folha de papel bom, levemente amarelado, vista bem de frente, sem perspectiva, ocupando quase toda a imagem (deixe só uma margem transparente pequena em volta).
Detalhes: as marcas de duas dobras (dobrada em três, como carta); as bordas um pouco onduladas pela umidade da maresia; alguns grãozinhos de areia num canto de baixo; no canto superior esquerdo, um pedacinho do lacre de cera azul-esverdeado que ficou grudado, com o desenho de uma concha; no canto inferior direito, um raminho pequeno de alga seca preso com o barbante.
O MEIO DA FOLHA fica LISO E VAZIO, cor de papel claro e uniforme (creme), sem linhas, sem textura forte e sem sombras, porque o jogo vai escrever a carta, uma tabela e dois botões por cima, em tinta escura. Todos os detalhes ficam só nas bordas.
Cores: papel creme, tinta preta da matriz nos contornos, azul-esverdeado só no lacre, verde-oliva escuro na alga.
Proibido: texto, letras, números, assinatura legível, linhas de escrita, moldura decorativa e qualquer coisa atrás da folha (nada de parede, só transparência).
```

## Dicas

- Se vier escuro ou noturno, responda: "É de manhã cedo: mais sol entrando pela janela e madeira mais clara."
- Se a área da esquerda (ou de cima, no celular) vier cheia de detalhes, responda: "Deixe a área da carta bem mais vazia, só a parede de madeira com sol."
- Se o mar ficar grande demais, responda: "O mar é só uma faixa fina lá longe, depois dos telhados."
- Se aparecer escrita legível no caderno, no envelope ou na carta, responda: "Tire toda a escrita, só rabiscos que não formem letras." O texto fica no código, em Grenze, para poder ser traduzido.
- Se o fundo da carta não vier transparente, responda: "Refaça com fundo transparente, só a folha."
- Salve como `fim-demo-fundo.png`, `fim-demo-fundo-celular.png` e `fim-demo-carta.png` e mande aqui. Até lá, a tela usa o fundo do menu escurecido e um papel provisório em CSS.
