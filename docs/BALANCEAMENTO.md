# Balanceamento — Alquimia de Bolso (v1.14, 23/11/2026)

## 1. Levantamento (como estava na v1.13)

| Item | Valor | Problema |
|---|---|---|
| Ingredientes | 4 (comuns) e 5 (Cristal, Sombra, Orvalho Solar) | ok |
| Poção comum / incomum / rara | 10 / 13 / 16 | incomum e rara pagavam quase o mesmo que a comum, apesar do ingrediente mais caro |
| Pedido | preço + 3 (Marca do Mercador +25%) | ok |
| Venda avulsa | 100% do preço | vender o que sobra dava lucro (10 contra 8 de custo): dava para "farmar" moedas sem atender ninguém |
| Fama | +1 por pedido, −1 por erro ou cliente mandado embora | **não fazia nada**: só um número subindo |
| Insatisfação | só "mandar embora" (−1) | sem tempo, sem pressão: nenhum cliente ia embora sozinho |
| Despesas | +3 por dia a partir do dia 3, teto 26 | ok, mas leve no fim |

Simulação (200 partidas, jogador casual que acerta 45% das tentativas de receita nova): caderno completo no dia 6, todos os utensílios no dia 10, bolsa de 40 → 228 no dia 12, fama 69 sem efeito, zero clientes indo embora por demora.

## 2. Pesquisa: espera de clientes em jogos casuais

- Jogos de pedido com cronômetro (Tapper, Diner Dash, Papa's) usam um medidor que esvazia com a espera; quando zera, o cliente vai embora e o jogador perde pontos. A dificuldade sobe com mais clientes e menos tempo, e melhorias deixam os clientes esperarem mais.
- Papa's paga gorjeta e nota de espera: rapidez vira recompensa, não castigo.
- Estúdios de jogos aconchegantes relatam que clientes indo embora irritados estressam o jogador casual; o que funciona melhor é o "tempo suave": o cronômetro dá bônus pela rapidez e raramente pune.
- Medidor simples (anel ou barra) é mais legível que vários indicadores.

Fontes: [Diner Dash](https://en.wikipedia.org/wiki/Diner_Dash), [Time management game](https://en.wikipedia.org/wiki/Time_management_game), [Order-Fulfillment Games (FDG 2019)](https://www.kmjn.org/publications/OrderFulfillment_FDG19.pdf), [Papa's Pastaria](https://jayisgames.com/review/papas-pastaria.php), [Flipline: Papa's Pizzeria post-mortem](https://www.flipline.com/blog/?p=3887), [Designing a stress-free game loop](https://dev.to/tatomamo_games/designing-a-stress-free-game-loop-balancing-engagement-vs-pressure-2976), [Designing variables in a management sim](https://www.gamedeveloper.com/design/designing-variables-and-calculating-score-in-a-management-sim-game).

Como o nosso cliente pede por pistas (o jogador precisa ler, pensar e às vezes experimentar), os tempos ficam bem acima dos jogos de lanchonete (que giram em dezenas de segundos).

## 3. O que mudou (v1.14)

| Item | Antes | Agora |
|---|---|---|
| Poção comum / incomum / rara | 10 / 13 / 16 | 10 / 14 / 18 |
| Pedido (sem fama) | 13 / 16 / 19 | 13 / 17 / 21 |
| Venda avulsa | 100% | 60% (6 / 8 / 10): recupera parte do custo, não dá lucro |
| Fama | sem efeito | faixas: 10 → +1 moeda por pedido; 25 → +2 e +10% de paciência; 50 → +3 e +20% |
| Paciência | não existia | dias 1–2 sem pressa; dia 3: 140 s, −7 s por dia, piso 90 s (dia 11+) |
| Receita nova | — | cliente espera 50% mais |
| Fila | — | quem espera na fila se cansa a 1/4 da velocidade |
| Gorjeta | — | +3 moedas atendendo com mais da metade da vela |
| Cliente cansou de esperar | — | vai embora, −2 de fama (mandar embora continua −1: é a saída honesta) |
| Dia perfeito | — | ninguém saiu sem poção: 2 moedas por cliente e +1 de fama |
| Despesas | teto 26 | teto 30 |
| Opção | — | "Freguesia sem pressa" (sem vela, sem gorjeta) |

A estratégia que o jogo passa a ensinar: à noite, sem pressa, deixar prontas as poções conhecidas; de dia, gastar o tempo com as receitas novas.

## 4. Simulação depois (300 partidas, 12 dias)

| Perfil | Clientes que cansam por dia (dia 8) | Gorjetas no dia 8 | Dias perfeitos no dia 8 | Bolsa no dia 12 |
|---|---|---|---|---|
| Atento (rápido, acerta 65%) | 0 | 24 | 96% | ~960 |
| Casual (acerta 45%) | 0 | 22 | 90% | ~780 |
| Lento (devagar, acerta 35%) | 0,1 | 0,3 | 73% | ~440 |

Faixas de fama: "Conhecida" por volta do dia 3, "Falada na vila" no dia 5, "Famosa" no dia 8 (casual). O jogador lento quase nunca perde cliente, mas também quase não ganha gorjeta: a pressão é sentida como prêmio, não como castigo.

Ponto em aberto: depois do dia 9 o jogador tem tudo comprado e as moedas acumulam sem destino (ver lista de harmonização).

## 5. Paciência por freguês (v1.15)

| Freguês | Multiplicador | Jeito |
|---|---|---|
| Vovó Quitéria | ×1,3 | Tem todo o tempo do mundo |
| Elfo Anselmo | ×1,2 | Vive séculos, sabe esperar |
| Gato Bartolomeu | ×1,2 | Gatos sabem esperar (ou dormir) |
| Bruxa Ofélia | ×1,0 | Espera o tempo de um feitiço |
| Anão Baltazar | ×1,0 | Teimoso, mas espera |
| Bardo Cirilo | ×0,9 | Tem show daqui a pouco |
| Fada Lumi | ×0,85 | Não para quieta no balcão |
| Cavaleiro Tadeu | ×0,8 | Está em missão urgente |
| Pirata Dorotéia | ×0,75 | A maré não espera |

No piso (90 s), a Pirata espera cerca de 68 s e a Vovó cerca de 117 s. Simulação no dia 12: o jogador lento perde ~1 cliente por dia (antes 0,1); casual e atento, nenhum.

## 6. Poções novas (v1.26)

| Item | Antes | Agora |
|---|---|---|
| Receitas | 12 | 24 (5 doses duplas, 7 duplas novas) |
| Combinações que dão Lodo | 24 de 36 | 12 de 36 |
| Preços novos | — | doses duplas e Brisa Marinha 10 (comum); Gelo, Fogo-Fátuo, Eco, Seiva, Arco-Íris 14 (incomum); Espelho Negro 18 (rara) |
| Lodo | só 1 moeda na prateleira | a mercadora paga 3, até 3 por noite |
| Paciência de receita nova | ×1,5 | ×1,75 |

Simulação (300 partidas, 12 dias):

| Perfil | Receitas no dia 8 | Bolsa no dia 12 (antes → agora) | Fama no dia 12 (antes → agora) | Desistências por dia (dia 12) |
|---|---|---|---|---|
| Atento | 23,1 de 24 | ~960 → ~890 | — → 80 | 0 |
| Casual | 23,1 de 24 | ~760 → ~660 | 83 → 72 | 0 |
| Lento | 22,3 de 24 | ~320 → ~220 | 51 → 34 | 1,0 → 1,3 |

Com o dobro de receitas, o caderno completa por volta do dia 10 (antes, dia 8) e o jogo dura mais. Pedidos de receita nova continuam ~35%, então o jogador passa mais dias experimentando: rende um pouco menos e pressiona mais o jogador lento. Os ×1,75 de paciência para receita nova compensam parte disso (sem eles, o lento ficava com ~170 moedas e fama 27).
