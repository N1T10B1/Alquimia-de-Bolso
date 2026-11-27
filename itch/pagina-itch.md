# Página do itch.io: tema, configuração e textos

Tudo o que vai na página da demo da Alquimia de Bolso no itch.io: o tema visual, onde clicar para aplicar, os arquivos para subir e os textos prontos para copiar.

- Prompts das imagens: `arte/prompt-pagina-itch.md`
- Imagens provisórias (já dá para montar a página hoje com elas): `itch/provisorio/`
- `.exe` e `.zip` do navegador: gerados no GitHub (ver a parte 4)

---

## 1. A temática: "o caderno aberto na bancada, à noite"

A página inteira é a cena do menu do jogo. O **fundo** é a parede da botica à noite, em xilogravura (prateleiras com frascos de um lado, a janela com a lua do outro). A **coluna do meio** é uma página do caderno da boticária: papel creme, tinta escura, títulos em vermelhão, como as rubricas dos manuscritos. O **banner** é o título em Grenze Gotisch, a mesma fonte do menu.

Por que assim:

- Quem chega pela capa (o menu à noite, a vela, o caderno) cai numa página com o mesmo clima. A página parece a continuação do jogo, não um formulário.
- Papel claro no meio deixa o texto confortável de ler e faz as capturas de tela escuras do jogo saltarem.
- Usa só a paleta e as fontes do guia de arte (`arte/guia-de-arte-grimorio.md`), então nada destoa do jogo.

O que as páginas mais visitadas de jogos "cozy" no itch.io têm em comum, e que seguimos aqui: capa com uma ideia só e o nome legível em miniatura; banner com o logotipo em vez do título padrão; fundo que conversa com a arte do jogo; uma frase de gancho logo no começo; capturas grandes e um GIF curto mostrando a ação principal; descrição curta em tópicos; o botão de jogar no topo.

## 2. Medidas do itch.io (o que cada imagem vira)

| Peça | Medida | Observação |
|---|---|---|
| Capa | 630x500 (pode subir 1260x1000) | Aparece nas listas, na busca e nos links. Máx. 3 MB. |
| Banner | até 960 de largura, ~300 de altura | Substitui o nome do jogo no topo. PNG transparente fica melhor. Máx. 3 MB. |
| Fundo | 1920x1080 | Opções: repetir, alinhar e "fixo". Só as laterais aparecem no PC. |
| Coluna do meio | 960 de largura | Fica mais larga se o jogo embutido for mais largo. |
| Capturas de tela | 1920x1080, de 3 a 5 | A primeira é a mais vista. GIF animado é aceito. Máx. 3 MB cada. |
| Imagens no texto | até 920 de largura | Para as vinhetas da descrição. |

## 3. Como aplicar no itch.io (passo a passo)

### 3.1 Criar a página

1. Entre em **itch.io → seu perfil → Dashboard → Create new project**.
2. Preencha com os textos da parte 5:
   - **Title**: Alquimia de Bolso
   - **Project URL**: `alquimia-de-bolso` (fica `n1t10b1.itch.io/alquimia-de-bolso`)
   - **Short description or tagline**: a frase de gancho
   - **Classification**: Games
   - **Kind of project**: **HTML** (assim o jogo roda direto na página; o `.exe` entra como download extra no mesmo lugar)
   - **Release status**: In development
   - **Pricing**: **No payments** (demo gratuita). Se quiser receber apoio, **Donate** com valor sugerido de 0.
3. **Uploads**:
   - `alquimia-de-bolso-web.zip` → marque **This file will be played in the browser**.
   - `alquimia-de-bolso-windows.zip` → marque o ícone do **Windows**. Nome de exibição: "Windows (portátil, sem instalar)".
   - `alquimia-de-bolso-instalador.exe` (opcional) → **Windows**. Nome: "Windows (instalador)".
4. **Embed options** (aparece depois do upload do zip do navegador):
   - Viewport: **1280 x 720**. Marque **Mobile friendly** (o jogo tem layout de celular) e **Fullscreen button**. Deixe **Automatically start on page load** desmarcado, para o som não tocar antes do clique.
   - Se achar a coluna larga demais em notebook, use 960 x 600: a página volta para a largura padrão.
5. **Details**: cole a descrição da parte 5 (o editor aceita colar texto formatado; os títulos `##` viram "Heading" pelo botão de título do editor).
6. **Genre**: Simulation. **Tags**: ver a parte 5.
7. **AI generation disclosure**: ver a parte 6. Marque com sinceridade; o itch.io exige.
8. **Cover image**: `itch/provisorio/capa-630x500.png` (troque pela capa nova quando ela vier).
9. **Screenshots**: as capturas do jogo (ver a parte 7).
10. **Visibility**: deixe em **Draft** até tudo estar no lugar, abra a página para conferir e só então mude para **Public**.

### 3.2 Aplicar o tema

Na página do jogo, clique em **Edit theme** (barra de cima, só aparece para você).

| Seção do editor | Opção | Valor |
|---|---|---|
| Images | Banner | `itch/provisorio/banner-960x300.png` (depois o banner com ornamento) |
| Images | Background | `itch/provisorio/fundo-1920x1080.jpg` (depois o `itch-fundo`) |
| Images | Repeat / Align / Fixed | **No repeat**, **Center**, **Fixed** marcado |
| Colors | BG color (fundo da página) | `#12131b` |
| Colors | BG2 color (coluna do meio) | `#efe2c4` (papel do caderno) |
| Colors | BG2 alpha (em "More options") | 100% |
| Colors | Text | `#2b1e16` (tinta ferrogálica) |
| Colors | Link | `#2c4f9e` (ultramar) |
| Colors | Button | `#a8322a` (vermelhão) |
| Colors | Header | `#a8322a` (vermelhão, como rubrica) |
| Text | Header font | **Grenze Gotisch** |
| Text | Body font | **Alegreya Sans**, tamanho 16 ou 17 |
| Layout | Screenshots | **Auto** (com o jogo embutido, fica em uma coluna larga) |
| Layout | Embed background | o mesmo fundo, ou a cor `#12131b` |

Clique em **Save**. Se o vermelhão dos títulos ficar escuro demais no fundo creme, use `#b0362c`.

## 4. Os arquivos do jogo (`.exe` e versão de navegador)

O `.exe` é feito com **Tauri**: uma janela de Windows que abre o próprio `jogar.html`. Não precisa instalar nada no seu PC para gerar: o GitHub monta tudo numa máquina Windows dele.

- Código: pasta `desktop/` do repositório.
- Receita: `.github/workflows/exe-windows.yml`. Roda sozinha toda vez que o `jogar.html` ou a pasta `desktop/` mudam no GitHub, e também pelo botão **Run workflow** em **Actions → Gerar exe e zip do itch.io**.
- Link fixo para baixar (sem login): https://github.com/N1T10B1/Alquimia-de-Bolso/releases/tag/demo-v1.28
- Também fica em **Actions**, abra a execução mais recente (bolinha verde) e baixe **alquimia-de-bolso-itch** no fim da página, em "Artifacts". Dentro vêm três arquivos:
  - `alquimia-de-bolso-windows.zip`: o `.exe` portátil (abre com duplo clique, sem instalar).
  - `alquimia-de-bolso-instalador.exe`: instalador, cria atalho no menu Iniciar.
  - `alquimia-de-bolso-web.zip`: a versão de navegador para o itch.io (é o `jogar.html` renomeado para `index.html`).

Sobre o `.exe`:

- Funciona no Windows 10 e 11 (usa o WebView2, que já vem no Windows). O instalador baixa o WebView2 sozinho se faltar.
- O save fica guardado no próprio PC, separado do save do navegador.
- O Windows pode mostrar o aviso azul "O Windows protegeu o computador" na primeira vez, porque o `.exe` não tem assinatura digital paga. É normal em jogos independentes: "Mais informações → Executar assim mesmo". Vale avisar na página (já está no texto da parte 5).
- O ícone atual é provisório (a poção de cura). Quando a `itch-icone.png` vier, ela entra em `desktop/icone.png` e o próximo `.exe` já sai com ela.
- Para gerar no seu PC no futuro (opcional): instale o Rust e o Node, e rode `npm install` e `npm run build` dentro de `desktop/`.

## 5. Textos da página (prontos para copiar)

### Título

Alquimia de Bolso

### Frase de gancho (Short description or tagline)

Ninguém pede a poção pelo nome. O gato paga em peixe. | Nobody asks for a potion by name. The cat pays in fish.

Primeira linha da descrição: "Sua mestra sabia todas as receitas de cabeça. O caderno que ela deixou está em branco." (em inglês: "Your master knew every recipe by heart. The book she left you is blank.")

### Descrição (Details)

> Cole a partir daqui.

**Uma botica pequena, um caderno em branco e clientes com pedidos estranhos.**

A Mestra Benvinda foi ver o mar e deixou para você a Alquimia de Bolso, a botica mais estreita de Ladeira Torta, espremida entre a padaria e o muro. Com ela vieram um caldeirão de cobre, alguns frascos e um caderno de receitas... com todas as páginas em branco. Ela nunca escreveu nada: sabia tudo de cabeça.

Agora a freguesia está no balcão, e cada receita você vai ter que descobrir sozinha.

## Como se joga

**Ouça o cliente.** Ninguém pede "um Elixir de Cura". Pedem coisas como "cortei a mão descascando batatas para cem convidados" ou "quero um trovão de bolso para acordar meu irmão, que dorme demais". E o gato Bartolomeu derruba três frascos da sua prateleira só para chamar atenção. As pistas estão no que eles contam.

**Misture no caldeirão.** Escolha dois ingredientes entre oito (Gota Lunar, Brasa Rubra, Folha Viva, Pena do Vento...) e veja o que sai. Acertou, nasce uma poção. Errou, sai Lodo Instável, que ao menos fica anotado para você não repetir.

**Escreva o caderno.** Cada descoberta vira uma página. Venda, junte moedas, compre utensílios melhores e não esqueça: o aluguel do Seu Leopoldo vence todo fim de dia.

## Na demo

- 5 dias de botica, do primeiro cliente até uma carta que chega do mar
- 12 receitas para descobrir com 8 ingredientes
- 9 clientes, cada um com seu jeito de pedir e sua paciência, mais a mercadora Zuleica, que passa à noite
- Utensílios para comprar e um livro-caixa no fim de cada dia
- Arte em xilogravura, no clima de um caderno de boticária antigo
- Partidas de 20 a 40 minutos, com save automático

## Como jogar

- **No navegador**: clique em "Run game" aqui em cima. Funciona no computador e no celular.
- **No Windows**: baixe o `.zip`, extraia e abra **Alquimia de Bolso.exe**. Se o Windows mostrar "O Windows protegeu o computador", clique em "Mais informações" e depois em "Executar assim mesmo": é só porque o jogo é novo e independente.
- **No Android**: baixe o `.apk` e toque nele para instalar. O celular vai pedir para permitir apps desta fonte.
- **Controles**: mouse ou toque. Arraste para baixo para abrir o caderno. No menu, as setas e o Enter também funcionam.
- **Idioma**: português do Brasil.

## Ainda em desenvolvimento

Esta é a demo de um jogo feito por uma pessoa só. Se você jogou, conta nos comentários: qual receita mais te deu trabalho? Algum cliente ficou sem resposta? Cada comentário vira uma anotação no caderno da próxima versão.

## Créditos

Ideia, game design e direção de arte: Rafael (N1T10B1). Programação feita com o Claude, assistente de IA da Anthropic. Artes geradas com IA sob a direção de Rafael. Fontes: Grenze Gotisch e Grenze (Omnibus-Type) e Alegreya Sans (Huerta Tipográfica), licença SIL Open Font License 1.1.

---

**English:** *Pocket Alchemy* is a cozy potion-shop game. Your old master left to see the sea and handed you a tiny apothecary and a recipe book with every page blank. Listen to odd customers, mix two of eight ingredients in the cauldron, discover 12 recipes and keep up with the rent. Free demo, about 30 minutes. **The game is currently in Brazilian Portuguese only.**

> Cole até aqui.

Onde entram as vinhetas: quando a `itch-vinhetas.png` vier, eu corto em três e você insere cada uma (botão de imagem do editor) logo antes de "Ouça o cliente", "Misture no caldeirão" e "Escreva o caderno". Até lá a descrição funciona sem elas. Se quiser um divisor entre as seções, a `assets/ui/divisoria.webp` do jogo serve (converta para PNG antes, o itch não aceita webp em todo lugar).

### Gênero e tags

- **Genre**: Simulation
- **Tags** (o itch.io aceita até 10, em inglês): `alchemy`, `potions`, `cozy`, `crafting`, `management`, `shopkeeper`, `fantasy`, `medieval`, `casual`, `short`
- **Average session**: About a half-hour
- **Languages**: Portuguese (Brazil)
- **Inputs**: Mouse, Touchscreen, Keyboard
- **Accessibility**: marque só o que o jogo tem: **Adjustable text size** (Opções › tamanho do texto) e, se aparecer, **Reduced motion** (Opções › menos animação).

### Primeiro devlog (opcional, publique no dia do lançamento)

**Título:** A botica abriu as portas

A demo da Alquimia de Bolso está no ar! São cinco dias atrás do balcão de uma botica minúscula, com um caderno de receitas em branco e uma freguesia que nunca pede nada do jeito simples.

O que já dá para fazer: descobrir as 12 primeiras receitas, atender nove clientes (e um gato), negociar com a Zuleica à noite e tentar fechar o livro-caixa sem dever o aluguel ao Seu Leopoldo. No fim do quinto dia chega uma carta do mar.

O que vem depois: mais 12 receitas, doses duplas, Estufa e Alambique, retrato do Seu Leopoldo e música. Se você jogou, deixa um comentário: eu leio todos.

## 6. Declaração de IA (AI generation disclosure)

O itch.io pede que todo projeto diga se usa conteúdo gerado por IA, e mostra isso na página. Pelo que está nos créditos do jogo, a resposta honesta é:

- **Graphics**: sim (retratos, itens, fundos e molduras gerados com IA sob sua direção).
- **Code**: sim (programação feita com o Claude).
- **Text and dialogue**: marque sim se os diálogos e textos foram escritos com ajuda de IA (foram, em boa parte, nas threads deste projeto).
- **Sound**: não (os sons são sintetizados no próprio código; os MIDIs ainda não estão no jogo).

Esconder isso pode tirar a página do ar, e o público de jogos cozy costuma reagir melhor à transparência do que a descobrir depois.

## 7. Capturas de tela e GIF

As capturas vêm do próprio jogo, em 1920x1080 (tela cheia, F11 no navegador ou o `.exe` maximizado; no Windows, **Win + Shift + S** recorta a tela). Sugestão de ordem, porque a primeira é a mais vista:

1. Balcão com um cliente pedindo (a fala com as pistas aparecendo).
2. Caldeirão com duas cartas de ingrediente e o vapor subindo.
3. O caderno aberto com algumas receitas descobertas.
4. A noite com a mercadora Zuleica.
5. O livro-caixa do fim do dia.

Um GIF de 5 a 8 segundos da mistura (escolher duas cartas, misturar, nascer a poção) costuma ser o que mais segura quem passa pela página. Programa gratuito para gravar: ScreenToGif.
