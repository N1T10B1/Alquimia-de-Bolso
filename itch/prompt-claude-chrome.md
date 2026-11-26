# Prompt para o Claude no Chrome: montar a página no itch.io

Como usar:

1. No Chrome, entre no itch.io já logado na sua conta e abra a extensão do Claude.
2. Anexe na conversa da extensão 15 imagens: as 3 da pasta `itch/provisorio/` (`capa-630x500.png`, `banner-960x300.png`, `fundo-1920x1080.jpg`), as 5 figurinhas da pasta `itch/figurinhas/` (`fig-divisoria.png`, `fig-passos.png`, `fig-ingredientes.png`, `fig-pocoes.png`, `fig-clientes.png`) e os 7 arquivos da pasta `itch/capturas/` (`captura-1.jpg` a `captura-6.jpg` e `mistura.gif`). Se a extensão não aceitar tantas de uma vez, mande em duas mensagens antes do prompt.
3. Deixe numa pasta fácil do PC (ex.: Downloads) os arquivos do jogo, baixados de https://github.com/N1T10B1/Alquimia-de-Bolso/releases/tag/demo-v1.28: `alquimia-de-bolso-web.zip`, `alquimia-de-bolso-windows.zip` e `alquimia-de-bolso-android.apk`. A extensão não consegue escolher esses arquivos sozinha: quando chegar a hora, ela vai pedir para você clicar em "Upload files" e escolher.
4. Copie tudo o que está dentro do bloco abaixo e cole na extensão.

````
Monte a página do meu jogo no itch.io, em RASCUNHO (Draft). Estou logado na minha conta no itch.io nesta aba. Siga os passos na ordem e me avise ao terminar cada parte.

Regras:
- NUNCA mude a visibilidade para Public e nunca publique nada. A página fica em Draft até eu revisar.
- Não aceite termos, não mexa em configurações da conta e não faça pagamentos.
- Os textos abaixo devem ser colados exatamente como estão, sem reescrever.
- Se algum campo não existir com o nome que eu dei, procure o equivalente mais próximo e me diga o que fez.
- Clique em Save sempre que terminar uma seção, para não perder nada.

PARTE 1: CRIAR O PROJETO
Vá em https://itch.io/game/new e preencha:
- Title: Alquimia de Bolso
- Project URL: alquimia-de-bolso
- Short description or tagline: Uma botica pequena, um caderno em branco e clientes com pedidos estranhos.
- Classification: Games
- Kind of project: HTML
- Release status: In development
- Pricing: No payments

PARTE 2: ARQUIVOS DO JOGO (preciso de você aqui)
Na seção Uploads, me PEÇA para subir os arquivos e espere eu dizer "pronto". Eu vou clicar em "Upload files" e escolher:
- alquimia-de-bolso-web.zip
- alquimia-de-bolso-windows.zip
- alquimia-de-bolso-android.apk
Depois que eu subir, configure cada arquivo:
- alquimia-de-bolso-web.zip: marque "This file will be played in the browser".
- alquimia-de-bolso-windows.zip: marque o ícone de Windows. Nome de exibição: Windows (portátil, sem instalar)
- alquimia-de-bolso-android.apk: marque o ícone de Android. Nome de exibição: Android (APK)
Em Embed options (aparece depois do zip do navegador):
- Viewport dimensions: 1280 x 720
- Marque: Mobile friendly, Fullscreen button
- Deixe DESMARCADO: Automatically start on page load

PARTE 3: DESCRIÇÃO (campo Details/Description)
O editor tem um botão para editar em HTML (ícone "<>" ou "HTML"/"Source"). Use-o e cole o HTML abaixo inteiro. Ele tem marcadores como [[fig-passos]] e [[mistura]] no lugar das imagens.
Depois, volte para o modo visual e troque CADA marcador pela imagem de mesmo nome que anexei nesta conversa ([[mistura]] = mistura.gif; [[fig-divisoria]] = fig-divisoria.png; [[fig-passos]] = fig-passos.png; [[fig-ingredientes]] = fig-ingredientes.png; [[fig-pocoes]] = fig-pocoes.png; [[fig-clientes]] = fig-clientes.png): clique no marcador, apague o texto dele e use o botão de inserir imagem do editor para subir a imagem certa. Os marcadores aparecem duas vezes (parte em português e parte em inglês): insira a imagem nos dois lugares. Ao final não pode sobrar nenhum [[...]] no texto. Centralize as imagens se o editor deixar.
Se o editor não tiver modo HTML, digite o texto e use os botões do editor para formatar os títulos (h2), negritos, itálicos e listas.

<p><em>Jogue no navegador, no Windows ou no Android. English version below.</em></p>
<p><strong>Uma botica pequena, um caderno em branco e clientes com pedidos estranhos.</strong></p>
<p>A Mestra Benvinda foi ver o mar e deixou para você a <strong>Alquimia de Bolso</strong>, a botica mais estreita de Ladeira Torta, espremida entre a padaria e o muro. Com ela vieram um caldeirão de cobre, alguns frascos e um caderno de receitas... com todas as páginas em branco. Ela nunca escreveu nada: sabia tudo de cabeça.</p>
<p>Agora a freguesia está no balcão, e cada receita você vai ter que descobrir sozinha.</p>
[[mistura]]
[[fig-divisoria]]
<h2>Como se joga</h2>
[[fig-passos]]
<p><strong>Ouça o cliente.</strong> Ninguém pede "um Elixir de Cura". Pedem coisas como "cortei a mão descascando batatas para cem convidados" ou "quero um trovão de bolso para acordar meu irmão, que dorme demais". As pistas estão no que eles contam.</p>
<p><strong>Misture no caldeirão.</strong> Escolha duas cartas de ingrediente e veja o que sai. Acertou, nasce uma poção e o cliente sai feliz. Errou, sai Lodo Instável, que ao menos fica anotado para você não repetir.</p>
<p><strong>Escreva o caderno.</strong> Cada descoberta vira uma página. Venda, junte moedas, compre utensílios melhores e não esqueça: o aluguel do Seu Leopoldo vence todo fim de dia.</p>
<h2>Oito ingredientes, doze receitas</h2>
[[fig-ingredientes]]
<p>Gota Lunar, Brasa Rubra, Folha Viva, Pó de Cristal, Sombra Engarrafada, Orvalho Solar, Cogumelo Azul e Pena do Vento. Cada um tem uma qualidade (úmido, quente, vivo, duro, escuro, brilhante, terroso, leve), e o herbário que a Mestra deixou no fim do caderno conta o que cada um faz. O resto é com você.</p>
[[fig-pocoes]]
<h2>Quem aparece no balcão</h2>
[[fig-clientes]]
<ul>
<li><strong>Vovó Quitéria</strong>: a cliente mais antiga da botica. Tem todo o tempo do mundo.</li>
<li><strong>Cavaleiro Tadeu</strong>: está sempre em missão urgente.</li>
<li><strong>Fada Lumi</strong>: não para quieta no balcão.</li>
<li><strong>Anão Baltazar</strong>: teimoso, mas espera.</li>
<li><strong>Bardo Cirilo</strong>: tem show daqui a pouco, e espalha a fama da botica pela vila.</li>
<li><strong>Elfo Anselmo</strong>: vive séculos e sabe esperar.</li>
<li><strong>Pirata Dorotéia</strong>: a maré não espera.</li>
<li><strong>Bartolomeu</strong>: um gato que fala. Derruba frascos para chamar atenção e paga em peixe, se você deixar.</li>
<li><strong>Bruxa Ofélia</strong>: espera o tempo de um feitiço.</li>
</ul>
<p>E à noite passa a mercadora <strong>Zuleica</strong>, com a carroça cheia de ingredientes.</p>
<h2>Na demo</h2>
<ul>
<li>5 dias de botica, do primeiro cliente até uma carta que chega do mar</li>
<li>12 receitas para descobrir com 8 ingredientes</li>
<li>9 clientes, cada um com seu jeito de pedir e sua paciência</li>
<li>Utensílios para comprar e um livro-caixa no fim de cada dia</li>
<li>Arte em xilogravura, no clima de um caderno de boticária antigo</li>
<li>Partidas de 20 a 40 minutos, com save automático</li>
</ul>
<h2>Como jogar</h2>
<ul>
<li><strong>No navegador</strong>: clique em "Run game" aqui em cima. Funciona no computador e no celular.</li>
<li><strong>No Windows</strong>: baixe o .zip, extraia e abra <strong>Alquimia de Bolso.exe</strong>. Se aparecer "O Windows protegeu o computador", clique em "Mais informações" e depois em "Executar assim mesmo": é só porque o jogo é novo e independente.</li>
<li><strong>No Android</strong>: baixe o .apk e toque nele para instalar. O celular vai pedir para permitir apps desta fonte.</li>
<li><strong>Controles</strong>: mouse ou toque. Arraste para baixo para abrir o caderno.</li>
<li><strong>Idiomas</strong>: português do Brasil e inglês (o botão fica no menu).</li>
</ul>
<h2>Ainda em desenvolvimento</h2>
<p>Esta é a demo de um jogo feito por uma pessoa só. Se você jogou, conta nos comentários: qual receita mais te deu trabalho? Algum cliente ficou sem resposta? Cada comentário vira uma anotação no caderno da próxima versão.</p>
<h2>Créditos</h2>
<p>Ideia, game design e direção de arte: Rafael (N1T10B1). Programação feita com o Claude, assistente de IA da Anthropic. Artes geradas com IA sob a direção de Rafael. Fontes: Grenze Gotisch e Grenze (Omnibus-Type) e Alegreya Sans (Huerta Tipográfica), licença SIL Open Font License 1.1.</p>
[[fig-divisoria]]
<h2>English</h2>
<p><strong>A tiny apothecary, a blank recipe book and customers with very strange requests.</strong></p>
<p>Mistress Benvinda has gone to see the sea and left you <strong>Alquimia de Bolso</strong> ("Pocket Alchemy"), the narrowest shop in the village of Crooked Hill (Ladeira Torta), squeezed between the bakery and the wall. With it came a copper cauldron, a few flasks and a recipe book... with every single page blank. She never wrote anything down: she knew it all by heart.</p>
<p>Now the customers are lining up at the counter, and every recipe is yours to discover.</p>
[[mistura]]
<h2>How to play</h2>
[[fig-passos]]
<p><strong>Listen to the customer.</strong> Nobody asks for "a Healing Elixir". They say things like "I cut my hand peeling potatoes for a hundred guests" or "I want a pocket thunderclap to wake up my brother, who sleeps way too much". The clues are in what they tell you.</p>
<p><strong>Mix in the cauldron.</strong> Pick two ingredient cards and see what comes out. Get it right and a potion is born. Get it wrong and you brew Unstable Sludge, which at least goes in the book so you never make it twice.</p>
<p><strong>Fill the book.</strong> Every discovery becomes a page. Sell, save coins, buy better tools and don't forget: Mr. Leopoldo's rent is due at the end of every day.</p>
<h2>Eight ingredients, twelve recipes</h2>
[[fig-ingredientes]]
<p>Moon Drop, Ruby Ember, Living Leaf, Crystal Dust, Bottled Shadow, Sun Dew, Blue Mushroom and Wind Feather. Each one has a quality (wet, hot, alive, hard, dark, bright, earthy, light), and the herbarium your master left at the back of the book tells you what each one does. The rest is up to you.</p>
[[fig-pocoes]]
<h2>Who comes to the counter</h2>
[[fig-clientes]]
<p>Granny Quitéria, who has all the time in the world. Sir Tadeu the Knight, always on an urgent quest. Lumi the Fairy, who can't keep still. Baltazar the Dwarf, stubborn but patient. Cirilo the Bard, who has a show in a few minutes. Anselmo the Elf, who lives for centuries. Dorotéia the Pirate, because the tide waits for no one. Bartolomeu the Talking Cat, who knocks your flasks over to get attention. And Ofélia the Witch, who waits as long as a spell takes. At night, Zuleica the Merchant rolls by with her cart full of ingredients.</p>
<h2>In this demo</h2>
<ul>
<li>5 days running the shop, from the first customer to a letter from the sea</li>
<li>12 recipes to discover with 8 ingredients</li>
<li>9 customers, each with their own way of asking and their own patience</li>
<li>Tools to buy and a ledger at the end of every day</li>
<li>Woodcut-style art, like an old apothecary's notebook</li>
<li>20 to 40 minutes per run, with autosave</li>
</ul>
<h2>Play it</h2>
<ul>
<li><strong>In the browser</strong>: click "Run game" above. Works on desktop and mobile.</li>
<li><strong>Windows</strong>: download the .zip, extract it and open <strong>Alquimia de Bolso.exe</strong>. If Windows shows "Windows protected your PC", click "More info" and then "Run anyway": it only happens because the game is new and independent.</li>
<li><strong>Android</strong>: download the .apk and tap it to install. Your phone will ask you to allow apps from this source.</li>
<li><strong>Controls</strong>: mouse or touch. Swipe down to open the book.</li>
<li><strong>Languages</strong>: English and Brazilian Portuguese (switch in the menu).</li>
</ul>
<h2>Still brewing</h2>
<p>This is the demo of a game made by one person. If you played it, tell me in the comments: which recipe gave you the hardest time? Did any customer leave without an answer? Every comment becomes a note in the book for the next version.</p>
<p><em>Idea, game design and art direction: Rafael (N1T10B1). Code written with Claude, Anthropic's AI assistant. Art generated with AI under Rafael's direction. Fonts: Grenze Gotisch, Grenze and Alegreya Sans (SIL Open Font License 1.1).</em></p>

PARTE 4: METADADOS (mesma página de edição, mais abaixo)
- Genre: Simulation
- Tags (uma de cada vez): alchemy, potions, cozy, crafting, management, shopkeeper, fantasy, medieval, casual, short
- AI generation disclosure: marque que o projeto USA IA generativa, e marque Graphics, Code e Text/Dialogue. NÃO marque Sound.
- Se aparecerem (em "Metadata" ou "Optional"): Average session = About a half-hour; Languages = English e Portuguese (Brazil); Inputs = Mouse, Touchscreen, Keyboard; Accessibility = Adjustable text size (e Reduced motion, se existir).
- Community: Comments
- Visibility & access: Draft
Clique em Save.

PARTE 5: CAPA E CAPTURAS
Em "Cover image", suba a imagem capa-630x500.png que anexei nesta conversa.
Em "Screenshots", suba nesta ordem: captura-1.jpg, captura-2.jpg, captura-3.jpg, captura-4.jpg, captura-5.jpg, captura-6.jpg e por último mistura.gif.
Clique em Save.

PARTE 6: TEMA
Abra a página do jogo (botão "View page") e clique em "Edit theme" no topo. Configure:
- Banner: suba a imagem banner-960x300.png que anexei.
- Background: suba a imagem fundo-1920x1080.jpg que anexei. Repeat: No repeat (ou "Don't repeat"). Align: Center. Marque "Fixed".
- Cores (digite os códigos exatamente):
  - BG color: #12131b
  - BG2 color: #efe2c4
  - Text color: #2b1e16
  - Link color: #2c4f9e
  - Button color: #a8322a
  - Header color (se existir): #a8322a
- Em "More options", BG2 alpha (opacidade da coluna): 100%
- Fontes: Header font = Grenze Gotisch; Body font = Alegreya Sans; tamanho do texto 16 ou 17.
- Layout > Screenshots: Auto
- Embed background (se existir): cor #12131b
Clique em Save theme.

PARTE 7: CONFERIR
Recarregue a página do jogo e confira: banner no topo, fundo nas laterais, coluna creme com texto escuro, títulos em vermelho, botão de jogar funcionando. Tire um print e me mostre. Confirme que a visibilidade continua em Draft e me mande o link da página (algo como https://n1t10b1.itch.io/alquimia-de-bolso).
````

## Depois

- Quando as artes novas chegarem (capa com o gato, ornamento do banner, fundo novo), mande aqui que eu monto as versões finais com o título, e é só trocar as imagens no mesmo lugar.
- Para publicar, você mesmo muda **Visibility & access** para **Public** quando gostar do resultado.
