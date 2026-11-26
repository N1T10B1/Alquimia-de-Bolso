# Prompt: tela de carregamento (antes do menu inicial)

Pedida pelo Rafael em 26/11/2026. É a primeira coisa que aparece quando o jogo abre (navegador/itch.io, .exe e celular), enquanto o arquivo de ~10 MB chega e as fontes e o fundo do menu ficam prontos. Some sozinha com um fade e dá lugar ao menu.

A ideia: **a boticária chegando à porta da botica à noite**. O menu mostra o balcão por dentro; a tela de carregamento é a fachada, do lado de fora, um instante antes de entrar. No meio da tela o jogo escreve o título "Alquimia de Bolso" e mostra um frasco que vai enchendo conforme carrega, com frases como "Acendendo a vela…" e "Moendo as ervas…".

Já está no jogo com arte provisória (o fundo do menu desfocado e o frasco da Poção de Cura). Quando as imagens abaixo chegarem, é só trocar os arquivos de `assets/carregamento/`.

Use na mesma conversa do ChatGPT em que você gerou o fundo do menu inicial (guia de estilo de xilogravura). Se for uma conversa nova, cole o guia de estilo antes e anexe `arte/menu/menu-fundo.png` como referência, para as duas telas parecerem irmãs.

| Arquivo | O que é | Tamanho |
|---|---|---|
| `carregamento-fundo.png` | fundo do computador | 1920 x 1080 |
| `carregamento-fundo-celular.png` | fundo do celular | 1080 x 1920 |
| `carregamento-frasco.png` | frasco cheio, fundo transparente | 1024 x 1024 |

Por que poucas peças e tão simples: esta tela precisa aparecer **antes** do resto do jogo, então ela tem que ser leve (o jogo encolhe e comprime o fundo para uns 60 KB). Áreas grandes de cor chapada comprimem bem; detalhe miúdo no meio da imagem vira borrão.

## 1. Fundo, versão horizontal (computador)

```
Gere o FUNDO DA TELA DE CARREGAMENTO do jogo, no guia de estilo de xilogravura combinado. É a mesma loja de poções do fundo do menu inicial, agora vista DE FORA, pela rua, à noite, um instante antes de a boticária entrar.
Formato: horizontal, 1920x1080, imagem cheia (sem fundo transparente).
Cena: a fachada da botica numa ruela de pedra. No terço da DIREITA, a porta de madeira em arco, entreaberta, com uma faixa de luz ocre-ouro saindo pela fresta e caindo no chão de pedras; ao lado da porta, um vaso com ervas e um gato preto sentado no degrau, de costas, olhando para dentro. No terço da ESQUERDA, um lampião de ferro pendurado num braço de parede, aceso, e uma janela pequena com frascos na vidraça. No alto, a lua crescente e algumas estrelas entalhadas. Uma tabuleta pendurada sobre a porta com o desenho de um caldeirão, SEM LETRAS.
Composição: o CENTRO da imagem (uma faixa vertical no meio, uns 40% da largura) deve ficar calmo e escuro, só a parede de pedra lisa da fachada com poucas linhas entalhadas suaves, porque o jogo vai escrever o título e mostrar um frasco por cima, bem no meio. Nada importante nessa área. Prefira áreas grandes de cor chapada, poucos detalhes miúdos.
Cores: no máximo 4 cores chapadas além do preto da matriz: azul-noite no céu, na parede e nas sombras; ocre-ouro na luz da porta e do lampião; cobre na tabuleta e no lampião; verde-musgo nas ervas e na hera da parede.
Proibido: texto, letras, números, título, placas escritas, logotipo, molduras e bordas.
```

## 2. Fundo, versão vertical (celular)

```
Agora gere a mesma cena em formato vertical, 1080x1920, para celular. Mantenha a porta entreaberta com a luz, o gato no degrau, o lampião, a tabuleta sem letras e a lua. A porta e o gato ficam no terço de BAIXO; o lampião e a lua no terço de CIMA, nos cantos. O MEIO da imagem (a faixa do centro, de cima a baixo do terço do meio) fica calmo e escuro, só a parede de pedra, para o título e o frasco. Mesmo estilo, mesmas cores, sem texto.
```

## 3. Frasco que enche (indicador de carregamento)

O jogo mostra o frasco "vazio" e vai revelando o frasco cheio de baixo para cima, conforme o jogo carrega. Peça só o frasco **cheio**: a versão vazia eu faço a partir dele (escurecida e sem cor), para as duas ficarem perfeitamente encaixadas.

```
Agora gere uma peça separada: "carregamento-frasco", 1024x1024, FUNDO TRANSPARENTE (PNG), no mesmo guia de estilo de xilogravura e no mesmo traço dos frascos de poção do jogo.
É um único frasco de vidro de alquimista, de fundo redondo e gargalo comprido, com rolha de cortiça amarrada por um barbante e um raminho de ervas preso no gargalo. Visto bem de frente, sem perspectiva, em pé, centralizado, ocupando uns 80% da altura.
O frasco está CHEIO até o começo do gargalo de um líquido ocre-ouro luminoso, com duas ou três bolhinhas e um brilho branco no vidro. A linha do líquido é reta e horizontal.
Sem sombra no chão, sem mesa, sem nada atrás: só o frasco sobre a transparência.
Cores: ocre-ouro no líquido, vidro com reflexos azul-noite, cortiça e barbante em cobre, ervas em verde-musgo, contornos no preto da matriz.
Proibido: texto, letras, rótulo escrito, moldura e fundo.
```

## Dicas

- Se o meio do fundo vier cheio de detalhes, responda: "Deixe o centro da imagem bem mais vazio e escuro, só a parede de pedra lisa."
- Se aparecer letra na tabuleta, responda: "Tire as letras da tabuleta, só o desenho do caldeirão." O título fica no código, em Grenze Gotisch.
- Se a luz da porta ficar fraca, responda: "Deixe a faixa de luz ocre-ouro saindo da porta mais forte, é o ponto mais claro da cena."
- Se o frasco não vier transparente, responda: "Refaça com fundo transparente, só o frasco."
- Se o líquido vier torto ou ondulado, responda: "Deixe a superfície do líquido reta e horizontal."
- Salve como `carregamento-fundo.png`, `carregamento-fundo-celular.png` e `carregamento-frasco.png` e mande aqui. Eu comprimo, monto a tela e mostro uma prévia antes de entrar no jogo.

## Como a tela funciona (já implementada com arte provisória, v1.29)

- Aparece no primeiro instante, antes do resto do jogo: o CSS e as imagens dela ficam no começo do `jogar.html` (`carregamento.css` + `assets/carregamento/`), e o resto do arquivo vem depois.
- O frasco enche de verdade conforme o arquivo chega: entre os pedaços de estilo e de código o jogo avisa quanto já leu. No fim, espera as fontes e o fundo do menu estarem prontos, para o menu aparecer inteiro de uma vez.
- Fica no mínimo 1,4 s na tela (para não piscar no .exe e no celular, que carregam rápido) e some com um fade de 0,5 s. Sem fade se o jogador marcou "Menos animação".
- Enquanto ela está na tela, as teclas não chegam ao menu por trás.
- No celular Android, antes dela ainda aparece a tela do próprio sistema (ícone do jogo no fundo escuro), que o Android mostra sozinho.
