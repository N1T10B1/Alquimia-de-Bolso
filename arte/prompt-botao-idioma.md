# Prompt: botão de idioma do menu (xilogravura)

O botão fica no canto de baixo do menu inicial (à direita no PC, centralizado acima da versão no celular). Ele mostra sempre o **outro** idioma: no jogo em português aparece "English", no jogo em inglês aparece "Português". Tocar nele recarrega o jogo no outro idioma.

Hoje ele é provisório, feito em CSS: uma pílula escura com contorno creme, um globo desenhado em traço fino e a palavra em Grenze. A arte nova substitui a pílula e o globo.

## Como vai funcionar

- **Sem texto na imagem.** A palavra ("English" ou "Português") é escrita pelo jogo por cima, em Grenze creme, para a mesma arte servir aos dois idiomas e continuar nítida em qualquer tela.
- **Duas imagens:** a etiqueta normal e a etiqueta acesa (mouse em cima, foco do teclado ou dedo encostado). É a mesma ideia dos botões do menu, em que o selecionado ganha a cor de chama.
- **Não precisa de estado "idioma ativo".** O botão nunca mostra o idioma em que o jogo já está, e nas Opções a escolha continua com os botões redondos que já existem.
- **Fundo transparente** nas duas. O jogo mostra a peça com cerca de 190 x 70 px no PC e 170 x 62 px no celular; a imagem é gerada maior para ficar nítida em tela de alta resolução.

## A ideia

Uma **etiqueta de bagagem de viajante**, das que se amarram na alça da mala com barbante. A Mestra Benvinda foi ver o mar, e o caderno já viajou: a etiqueta diz "este caderno também fala outra língua". Ela combina com as etiquetas de botica do guia de arte e com a fita do menu.

À esquerda da etiqueta, no lugar do globo provisório, uma **pequena rosa dos ventos** entalhada. O espaço da direita fica liso para o jogo escrever a palavra.

## Como usar

Cole na mesma conversa do ChatGPT em que você já usou o guia de estilo de **ornamentos em xilogravura** (o das molduras, botões e da barra de rolagem). Se for uma conversa nova, cole o guia de estilo antes (botão "Copiar guia de estilo" em `arte/prompts-molduras-botoes.html`). Gere uma peça por vez, na ordem.

## 1. Etiqueta normal: `idioma-etiqueta.png`

```
Gere a peça "Etiqueta do botão de idioma", no guia de estilo de ornamentos em xilogravura combinado.
Tamanho: 768 x 288 px (proporção 8:3), horizontal.
Peça: uma etiqueta de bagagem de viajante, de papel grosso, deitada na horizontal e ocupando quase toda a imagem (deixe uns 16 px de folga em volta). O lado esquerdo é cortado em ponta, com os dois cantos chanfrados, e perto da ponta há um ilhó redondo de metal com um pedacinho de barbante amarrado saindo para a esquerda e para baixo. O lado direito é reto, com cantos levemente arredondados. Contorno em tinta preta, com um segundo filete fino por dentro, a uns 12 px da borda.
Logo à direita do ilhó, um pequeno medalhão redondo com uma rosa dos ventos de 8 pontas entalhada, ocupando uns 60% da altura da etiqueta.
Todo o resto da etiqueta, da rosa dos ventos até a borda direita, fica LISO, só papel, sem desenho, sem linhas e sem manchas: é ali que o jogo escreve a palavra.
Cores: papel em azul-noite escuro (#1c2233) chapado, para a palavra creme ficar legível por cima; contorno e filete em creme (#efe2c4); ilhó e rosa dos ventos em ocre-ouro (#b88a2e) com traços pretos; barbante em creme.
Fundo transparente fora da peça, vista frontal, reta (sem girar), sem sombra, mesmo traço das peças anteriores, sem texto, sem letras e sem as iniciais N, S, L, O na rosa dos ventos.
```

## 2. Etiqueta acesa: `idioma-etiqueta-acesa.png`

```
Agora gere a mesma etiqueta, no MESMO tamanho (768 x 288 px), mesma posição e mesmo desenho, para quando o jogador passa o mouse ou o dedo. Mude só as cores:
- o contorno e o filete ficam cor de chama (#f7c163);
- a rosa dos ventos fica vermelhão (#a8322a) com o miolo em chama (#f7c163), como se acendesse;
- o papel fica um pouco mais claro (#273049).
Nada mais muda: mesma silhueta, mesmo ilhó, mesmo barbante, área da direita lisa, fundo transparente, sem texto.
```

## Se algo sair errado

- Se vier qualquer palavra, letra ou as iniciais dos pontos cardeais, peça: "refaça sem nenhum texto e sem letras".
- Se a área da direita vier com enfeite, linhas ou manchas, peça: "a parte da direita tem que ser lisa, só papel, para o jogo escrever por cima".
- Se a etiqueta vier torta, girada ou com sombra, peça: "etiqueta reta, vista de frente, sem sombra".
- Se a segunda imagem mudar o formato da etiqueta, peça: "use exatamente o mesmo desenho da anterior, mudando só as cores".
- Se o fundo vier branco ou com xadrez desenhado, peça "fundo transparente de verdade". Se não der, salve assim mesmo que eu recorto.
- Salve como `idioma-etiqueta.png` e `idioma-etiqueta-acesa.png` e mande aqui na conversa. Eu coloco em `assets/ui/` e troco a pílula provisória no `styles.css`, com a palavra centrada na área lisa e a troca de imagem no mouse, no foco do teclado e no toque.
