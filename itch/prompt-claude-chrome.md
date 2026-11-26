# Prompt para o Claude no Chrome: montar a página no itch.io

Como usar:

1. No Chrome, entre no itch.io já logado na sua conta e abra a extensão do Claude.
2. Anexe na conversa da extensão as 3 imagens da pasta `itch/provisorio/`: `capa-630x500.png`, `banner-960x300.png` e `fundo-1920x1080.jpg`.
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
O editor tem um botão para editar em HTML (ícone "<>" ou "HTML"/"Source"). Se tiver, use-o e cole o HTML abaixo. Se não tiver, digite o texto e use os botões do editor para formatar os títulos (h2), negritos e listas.

<p><strong>Uma botica pequena, um caderno em branco e clientes com pedidos estranhos.</strong></p>
<p>A Mestra Benvinda foi ver o mar e deixou para você a Alquimia de Bolso, a botica mais estreita de Ladeira Torta, espremida entre a padaria e o muro. Com ela vieram um caldeirão de cobre, alguns frascos e um caderno de receitas... com todas as páginas em branco. Ela nunca escreveu nada: sabia tudo de cabeça.</p>
<p>Agora a freguesia está no balcão, e cada receita você vai ter que descobrir sozinha.</p>
<h2>Como se joga</h2>
<p><strong>Ouça o cliente.</strong> Ninguém pede "um Elixir de Cura". Pedem coisas como "cortei a mão descascando batatas para cem convidados" ou "quero um trovão de bolso para acordar meu irmão, que dorme demais". E o gato Bartolomeu derruba três frascos da sua prateleira só para chamar atenção. As pistas estão no que eles contam.</p>
<p><strong>Misture no caldeirão.</strong> Escolha dois ingredientes entre oito (Gota Lunar, Brasa Rubra, Folha Viva, Pena do Vento...) e veja o que sai. Acertou, nasce uma poção. Errou, sai Lodo Instável, que ao menos fica anotado para você não repetir.</p>
<p><strong>Escreva o caderno.</strong> Cada descoberta vira uma página. Venda, junte moedas, compre utensílios melhores e não esqueça: o aluguel do Seu Leopoldo vence todo fim de dia.</p>
<h2>Na demo</h2>
<ul>
<li>5 dias de botica, do primeiro cliente até uma carta que chega do mar</li>
<li>12 receitas para descobrir com 8 ingredientes</li>
<li>9 clientes, cada um com seu jeito de pedir e sua paciência, mais a mercadora Zuleica, que passa à noite</li>
<li>Utensílios para comprar e um livro-caixa no fim de cada dia</li>
<li>Arte em xilogravura, no clima de um caderno de boticária antigo</li>
<li>Partidas de 20 a 40 minutos, com save automático</li>
</ul>
<h2>Como jogar</h2>
<ul>
<li><strong>No navegador</strong>: clique em "Run game" aqui em cima. Funciona no computador e no celular.</li>
<li><strong>No Windows</strong>: baixe o .zip, extraia e abra <strong>Alquimia de Bolso.exe</strong>. Se o Windows mostrar "O Windows protegeu o computador", clique em "Mais informações" e depois em "Executar assim mesmo": é só porque o jogo é novo e independente.</li>
<li><strong>No Android</strong>: baixe o .apk e toque nele para instalar. O celular vai pedir para permitir apps desta fonte.</li>
<li><strong>Controles</strong>: mouse ou toque. Arraste para baixo para abrir o caderno. No menu, as setas e o Enter também funcionam.</li>
<li><strong>Idioma</strong>: português do Brasil.</li>
</ul>
<h2>Ainda em desenvolvimento</h2>
<p>Esta é a demo de um jogo feito por uma pessoa só. Se você jogou, conta nos comentários: qual receita mais te deu trabalho? Algum cliente ficou sem resposta? Cada comentário vira uma anotação no caderno da próxima versão.</p>
<h2>Créditos</h2>
<p>Ideia, game design e direção de arte: Rafael (N1T10B1). Programação feita com o Claude, assistente de IA da Anthropic. Artes geradas com IA sob a direção de Rafael. Fontes: Grenze Gotisch e Grenze (Omnibus-Type) e Alegreya Sans (Huerta Tipográfica), licença SIL Open Font License 1.1.</p>
<hr>
<p><strong>English:</strong> <em>Pocket Alchemy</em> is a cozy potion-shop game. Your old master left to see the sea and handed you a tiny apothecary and a recipe book with every page blank. Listen to odd customers, mix two of eight ingredients in the cauldron, discover 12 recipes and keep up with the rent. Free demo, about 30 minutes. <strong>The game is currently in Brazilian Portuguese only.</strong></p>

PARTE 4: METADADOS (mesma página de edição, mais abaixo)
- Genre: Simulation
- Tags (uma de cada vez): alchemy, potions, cozy, crafting, management, shopkeeper, fantasy, medieval, casual, short
- AI generation disclosure: marque que o projeto USA IA generativa, e marque Graphics, Code e Text/Dialogue. NÃO marque Sound.
- Se aparecerem (em "Metadata" ou "Optional"): Average session = About a half-hour; Languages = Portuguese (Brazil); Inputs = Mouse, Touchscreen, Keyboard; Accessibility = Adjustable text size (e Reduced motion, se existir).
- Community: Comments
- Visibility & access: Draft
Clique em Save.

PARTE 5: CAPA
Em "Cover image", suba a imagem capa-630x500.png que anexei nesta conversa. Clique em Save.

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
