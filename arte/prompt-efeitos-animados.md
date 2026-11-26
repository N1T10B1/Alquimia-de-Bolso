# Prompt: efeitos animados do caldeirão e da noite (xilogravura)

O Rafael achou artificiais dois efeitos do jogo:

1. **O caldo do caldeirão** quando há dois ingredientes na bancada: era uma elipse colorida com brilho em volta (sombra luminosa de CSS) e três bolinhas brancas subindo lisas.
2. **O círculo em volta da mercadora** no fim do dia: era uma luz alaranjada em forma de elipse no meio da tela, escurecendo as bordas em degradê, como um holofote.

Os dois são efeitos digitais (brilho, degradê, deslize suave) que nenhuma gravura antiga teria. A partir da v1.13 o jogo já usa uma versão provisória em CSS sem brilho e sem halo (bolhas em argola de tinta, quadro a quadro; noite com linhas de goiva só nas bordas). As três imagens abaixo substituem essa versão provisória pela arte de verdade.

## O que a pesquisa mostrou

Como se anima um estilo de gravura, livro antigo ou desenho à mão:

- **Quadro a quadro, poucos quadros, sem interpolação.** Animação desenhada à mão roda "em 2" ou "em 3" (12 ou 8 desenhos por segundo) e troca de desenho de uma vez, sem deslizar entre poses. É o que faz Cuphead parecer feito à mão, mesmo sendo um jogo moderno ([Game Developer](https://gamedeveloper.com/art/animating-i-cuphead-i-the-verve-of-the-1930s-with-the-tech-of-now), [Unity: Cuphead](https://unity.com/made-with-unity/cuphead)). No código, isso é `steps()`: cada quadro aparece inteiro e some inteiro.
- **"Line boil" (a linha que ferve).** Redesenhar a mesma imagem 2 ou 3 vezes com pequenas diferenças e alternar faz o traço "respirar", e é o que dá vida a ilustrações paradas sem mexer nelas ([PremiumBeat](https://www.premiumbeat.com/blog/how-to-create-line-boil-animations), [TV Tropes: Line Boil](https://TVTropes.org/pmwiki/pmwiki.php/Main/LineBoil)). No caldo e no vapor isso vem de graça: cada quadro é um desenho novo.
- **Ilustração clássica animada mantém o traço da ilustração.** Projetos que animam gravuras e iluminuras antigas não acrescentam luz nem brilho: só trocam desenhos e deslocam peças recortadas ([Move the Stasis: Animating Classical Illustration](https://researchr.org/publication/RallOL25), [Animating the archives](https://culture.pl/en/article/animating-the-archives-making-new-jokes-from-the-16th-century)). Wolfwalkers, que usa linhas de xilogravura e carvão, anima tudo à mão e deixa a linha do lápis visível ([Frame.io](https://blog.frame.io/2021/05/03/made-in-frame-wolfwalkers/)).
- **Luz e escuridão, na gravura, são feitas de linhas.** Não existe brilho nem degradê: a noite é hachura mais densa, e a luz é o papel que ficou sem tinta. Fumaça e vapor são nuvens de contorno grosso com linhas paralelas no lado da sombra, como nos herbários e livros de alquimia impressos.
- **Cor de xilogravura é chapada e independente da tinta.** Por isso as folhas abaixo vêm só em preto e branco: o jogo pinta o branco com a cor de cada ingrediente (como a cor aplicada à mão por cima da impressão) e o preto da matriz continua por cima. Assim uma imagem serve para todas as misturas.

## Como funciona uma "sprite sheet" (folha de quadros)

É uma imagem só, dividida numa grade invisível. Cada célula da grade é um quadro da animação, na ordem de leitura (da esquerda para a direita, de cima para baixo). O jogo mostra uma célula por vez, em sequência, e volta para a primeira. Por isso é importante:

- as células terem **exatamente o mesmo tamanho**, sem linhas de grade desenhadas;
- o desenho ficar **no mesmo lugar e na mesma escala** em todas as células (só o que se mexe muda);
- o **último quadro emendar no primeiro**, para o ciclo não dar pulo.

O ChatGPT só gera nos tamanhos 1024 x 1024, 1536 x 1024 e 1024 x 1536, então as grades foram pensadas para caber neles.

## Como usar

1. Abra uma **conversa nova** no ChatGPT e cole o **guia de estilo** abaixo. Espere ele confirmar.
2. Na mesma conversa, cole uma peça por vez, na ordem.
3. Salve com o nome indicado (PNG) e mande aqui na conversa. Eu coloco em `assets/fx/` e ativo o bloco comentado no fim de `styles.css` (v1.13, parte 2).

## Guia de estilo (cole primeiro)

```
Vou te pedir algumas folhas de animação (sprite sheets) para efeitos de um jogo de navegador chamado "Alquimia de Bolso", uma loja de poções aconchegante de fantasia medieval cujo visual é o de um caderno de boticária impresso em xilogravura. Todas as imagens desta conversa devem seguir EXATAMENTE este guia. Não gere nada ainda, só confirme que entendeu.

GUIA DE ESTILO: EFEITOS EM XILOGRAVURA
- Técnica: xilogravura antiga, como nos herbários e livros de alquimia impressos do século XV e XVI. Linhas grossas e firmes em tinta preta-amarronzada (#2b1e16), com a marca da goiva visível: traços em cunha, sombras feitas com linhas paralelas grossas, pequenas falhas de impressão. Nada de hachura fina de gravura em metal.
- SÓ DUAS CORES: tinta preta-amarronzada (#2b1e16) e branco puro (#ffffff). Sem nenhuma outra cor, sem cinza, sem degradê, sem brilho, sem luz difusa, sem desfoque. O jogo vai colorir o branco por conta própria.
- Fundo TRANSPARENTE de verdade (PNG com canal alfa) fora do desenho. Não desenhe o xadrez de transparência.
- Sprite sheet: a imagem é dividida numa grade invisível de células iguais. Cada célula é um quadro da mesma animação, lido da esquerda para a direita e de cima para baixo. NÃO desenhe linhas de grade, bordas, números nem molduras entre as células.
- Em todas as células o objeto fica no mesmo lugar, com o mesmo tamanho e o mesmo traço; só muda o que se move. Cada desenho fica inteiro dentro da sua célula, com uma margem vazia, sem encostar nem invadir a célula vizinha.
- O último quadro precisa emendar suavemente no primeiro (a animação roda em loop).
- Movimento de desenho animado antigo feito à mão: poses claras e um pouco exageradas, poucas linhas, legíveis em tamanho pequeno.
- Proibido: texto, letras, números, logotipos, marcas d'água, cenário, mesa, sombra no chão.
```

## 1. Caldo fervendo — `caldo-fervendo.png`

A superfície do líquido dentro da boca do caldeirão, vista um pouco de cima. O jogo coloca essa imagem por cima do caldeirão da bancada e pinta o branco com a cor dos dois ingredientes.

```
Gere a sprite sheet "Caldo fervendo", no guia de estilo de efeitos em xilogravura combinado.
Tamanho: 1024 x 1024 px. Grade invisível de 2 colunas x 4 linhas = 8 quadros, cada célula com 512 x 256 px.
Em cada célula: a superfície de um líquido grosso fervendo, vista de três quartos um pouco de cima, no formato de uma elipse larga e achatada (cerca de 460 x 190 px, centralizada na célula). Contorno da elipse em tinta grossa, igual em todos os quadros. Dentro, branco puro, com algumas ondas curvas curtas entalhadas em tinta acompanhando a curva da elipse, e um pouco de linhas paralelas na borda de trás para dar profundidade. Não desenhe o caldeirão nem a borda de metal: só o líquido.
A animação: bolhas que nascem, crescem e estouram, em lugares diferentes, sempre 2 ou 3 ao mesmo tempo. Cada bolha é uma argola branca com contorno grosso e uma pequena meia-lua de linhas no lado direito; ao estourar, vira um anel quebrado com 3 ou 4 respingos em gota saltando para fora, e no quadro seguinte some deixando um círculo de ondinhas. As ondas da superfície mudam um pouco de lugar a cada quadro, como se o caldo girasse devagar no sentido horário.
Ordem: quadro 1 calmo com 2 bolhas pequenas; quadros 2 a 4 uma bolha grande cresce à esquerda e estoura; quadros 5 a 7 outra cresce à direita e estoura; quadro 8 quase igual ao quadro 1, para emendar.
Só tinta preta-amarronzada e branco, fundo transparente fora das elipses, sem texto.
```

## 2. Vapor do caldeirão — `vapor-caldeirao.png`

Um fio de vapor que sobe do caldeirão enquanto há ingredientes dentro. O jogo pinta o branco com a cor do primeiro ingrediente, como uma xilogravura colorida à mão.

```
Gere a sprite sheet "Vapor do caldeirão", no guia de estilo de efeitos em xilogravura combinado.
Tamanho: 1024 x 1024 px. Grade invisível de 4 colunas x 2 linhas = 8 quadros, cada célula com 256 x 512 px (vertical).
Em cada célula: um fio de vapor que nasce de um ponto no centro da borda de baixo da célula e sobe até perto do topo, no jeito das nuvens dos livros impressos antigos: volutas e caracóis arredondados, contorno grosso em tinta, miolo branco, e 3 a 5 linhas paralelas curtas no lado direito de cada voluta como sombra. Embaixo o vapor é mais grosso; em cima fica mais fino e se solta em 1 ou 2 pequenos caracóis separados. Largura máxima do vapor: cerca de 150 px.
A animação: as volutas sobem e se enrolam, ondulando para a esquerda e para a direita como uma chama lenta. A cada quadro, cada voluta sobe um pouco e gira um pouco; no topo, o caracol solto se desfaz em traços curtos e some. No quadro 8 o desenho fica quase igual ao quadro 1, para emendar.
Só tinta preta-amarronzada e branco, fundo transparente fora do vapor, sem texto, sem caldeirão.
```

## 3. Noite na loja — `noite-hachura.png`

Substitui o "círculo" de luz em volta da mercadora. É uma moldura de escuridão feita de linhas, por cima da loja inteira, que deixa o meio limpo e escurece as bordas como uma gravura de cena noturna. Não tem forma de círculo nem de holofote: a borda é irregular e segue os cantos da tela.

```
Gere a imagem "Noite na loja", no guia de estilo de efeitos em xilogravura combinado. Esta não é uma sprite sheet: é uma imagem só.
Tamanho: 1536 x 1024 px (paisagem).
A imagem é uma sobreposição transparente que vai por cima de uma cena: escuridão de noite feita apenas com linhas de goiva em tinta preta-amarronzada, sem nenhum preenchimento cinza ou degradê. Nos 4 cantos, a tinta é quase chapada (linhas cruzadas muito juntas). Indo para o meio, as linhas ficam paralelas, depois mais espaçadas, depois mais curtas e finas, até sumirem. Todo o miolo da imagem (cerca de 60% da largura e 65% da altura) fica completamente transparente, sem nenhuma linha.
A borda entre a parte com linhas e o miolo vazio é irregular e orgânica, mais funda nos cantos e mais rasa no meio de cada lado, seguindo o formato retangular da imagem. NÃO faça um círculo, oval, holofote ou vinheta redonda. As linhas são inclinadas a uns 40 graus e acompanham um pouco o contorno, como nas cenas noturnas dos livros antigos.
No canto de cima à direita, deixe algumas estrelinhas de xilogravura (pequenas cruzes de 4 pontas) no meio das linhas, só 4 ou 5.
Só tinta preta-amarronzada, sem branco, fundo transparente, sem texto, sem cenário, sem lua desenhada.
```

## Se algo sair errado

- **Vieram linhas de grade ou números entre os quadros:** "refaça sem nenhuma linha de grade, borda ou número; as células são invisíveis".
- **O desenho mudou de tamanho ou de lugar de um quadro para outro:** "mantenha o contorno da elipse (ou a base do vapor) exatamente no mesmo lugar e tamanho em todos os quadros; só as bolhas (ou as volutas) se mexem". Uma variação pequena no traço tudo bem, é até bom (é o "line boil").
- **Vieram cores, cinza ou brilho:** "só tinta preta-amarronzada e branco puro, sem cinza, sem degradê, sem brilho".
- **O caldo ou o vapor saíram fora da célula:** "deixe margem vazia em volta de cada desenho dentro da sua célula".
- **A noite veio redonda, como um holofote:** "a borda da escuridão segue os cantos retangulares da imagem, nada de círculo ou oval".
- **O fundo veio branco ou com xadrez desenhado:** peça "fundo transparente de verdade". Se não der, mande assim mesmo que eu recorto.
- Se o ChatGPT gerar menos quadros que o pedido, mande assim mesmo dizendo quantos vieram: eu ajusto a grade no código.

## Para quem for ativar no código

As três imagens vão em `assets/fx/`. No fim de `styles.css` (bloco v1.13), tire a parte 2 do comentário e troque as aspas simples dos `url()` por aspas duplas, para o `tools/build-standalone.mjs` embutir as imagens no `jogar.html`. O caldo usa grade 2 x 4 (`background-size: 200% 400%`), o vapor 4 x 2 (`400% 200%`), ambos com `background-blend-mode: multiply` sobre a cor do ingrediente e `mask` com a mesma imagem. Se a grade vier diferente, ajuste o `background-size` e os `@keyframes fx-caldo` / `fx-vapor`. A parte 2 já foi testada no Chromium com imagens de teste nesses tamanhos.
