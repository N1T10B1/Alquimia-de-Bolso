# Prompt: imagens da página do itch.io

Imagens para a página da demo no itch.io e para o ícone do `.exe`. As capturas de tela de gameplay ficam de fora: vêm do próprio jogo.

O título "Alquimia de Bolso" **não** vai dentro de nenhuma imagem gerada. O ChatGPT erra letras e o título precisa ser igual ao do menu do jogo, em Grenze Gotisch. Por isso cada peça deixa uma área vazia e calma, e o título é colocado por cima depois (é só mandar as imagens aqui na thread que eu monto a capa e o banner finais com o título).

Use na mesma conversa do ChatGPT em que você gerou o fundo do menu, o do game over e o do fim da demo (guia de estilo de xilogravura). Se for uma conversa nova, cole o guia de estilo antes e anexe `arte/menu/menu-fundo.png` como referência.

| Arquivo | Onde aparece no itch.io | Peça ao ChatGPT | Tamanho final (eu ajusto) |
|---|---|---|---|
| `itch-capa.png` | capa: busca, página inicial, listas, miniatura dos links | horizontal 1536x1024 | 630x500 (e 1260x1000) |
| `itch-banner-ornamento.png` | banner no topo da página, em volta do título | horizontal 1536x1024, fundo transparente | 960x300 |
| `itch-fundo.png` | fundo da página inteira, atrás da coluna de texto | horizontal 1536x1024 | 1920x1080 |
| `itch-icone.png` | ícone do `.exe`, da barra de tarefas e do instalador | quadrado 1024x1024, fundo transparente | 1024x1024 |
| `itch-vinhetas.png` | 3 desenhos pequenos ao lado dos tópicos da descrição | horizontal 1536x1024, fundo transparente | 3 de 400x400 |

## 1. Capa: `itch-capa.png`

É a peça mais importante: é ela que a pessoa vê numa grade com dezenas de jogos, em tamanho pequeno. Precisa de uma ideia só, forte, que se leia de longe.

```
Gere a CAPA de um jogo, no guia de estilo de xilogravura combinado. Ela vai ser vista pequena, numa grade com muitos outros jogos, então precisa ser simples, com poucos elementos grandes e contraste forte.
Formato: horizontal, 1536x1024, imagem cheia (sem fundo transparente). Ela vai ser cortada para a proporção 630x500, então deixe tudo o que importa longe das bordas da esquerda e da direita.
Cena: o balcão de uma loja de poções minúscula ao anoitecer, visto de frente. No centro, grande, um caldeirão de cobre fervendo, com uma nuvem de vapor que sobe e se enrola em espiral. Duas mãos (só as mãos e os punhos da aprendiz, mangas de linho dobradas, sem rosto e sem corpo) despejam ao mesmo tempo dois frascos no caldeirão: de um cai uma gota azul-clara, do outro uma brasa vermelha. Sentado na ponta do balcão, à direita, o cliente Bartolomeu, um gato preto e peludo de olhos amarelos, com colete violeta bordado, gravata-borboleta dourada e um relógio de bolso na corrente, olha para o caldeirão com muito interesse, como quem espera a encomenda (anexe `assets/clientes/gato-falante-neutro.webp` como referência do personagem). À esquerda, um caderno de couro aberto com fitas marcadoras vermelhas penduradas.
Composição: o terço de CIMA da imagem fica calmo e escuro (parede de madeira com poucas linhas entalhadas e o vapor se dissolvendo), porque o título do jogo vai ser colocado ali por cima. O caldeirão e o vapor são o centro de tudo.
Cores: no máximo 4 cores chapadas além do preto da matriz: cobre no caldeirão, ocre-ouro na luz do fogo e na gravata do gato, azul-noite nas sombras e na gota, vermelhão na brasa e nas fitas (o violeta do colete pode ficar bem escuro, quase preto). Mesmo clima do fundo do menu.
Proibido: texto, letras, números, título, logotipo, molduras, bordas e rostos humanos.
```

## 2. Ornamento do banner: `itch-banner-ornamento.png`

O banner fica no topo da página, no lugar do nome do jogo. Ele vai ser o título em Grenze Gotisch com este ornamento em volta, sobre o fundo da página.

```
Agora gere uma peça separada, "itch-banner-ornamento", 1536x1024, FUNDO TRANSPARENTE (PNG), no mesmo guia de estilo de xilogravura.
É um ornamento horizontal, comprido e baixo, para ficar em volta de um título: ocupa só uma faixa no meio da imagem, mais ou menos um terço da altura, de ponta a ponta.
À esquerda: um raminho de ervas cruzado com um frasco de poção pequeno de rolha. À direita, espelhado: um raminho de ervas cruzado com um pequeno caldeirão de cobre soltando um fio de vapor. Entre os dois, uma fita marcadora vermelha bem fina corre por baixo, de um lado ao outro, com as pontas cortadas em V.
O MEIO da faixa fica VAZIO E TRANSPARENTE, largo (metade da largura da imagem), porque o título vai entrar ali. Nada atrás do ornamento: só transparência em cima, embaixo e no meio.
Cores: tinta preta da matriz nos contornos, ocre-ouro, cobre no caldeirão, verde-oliva nas ervas, vermelhão na fita. Ele vai ficar sobre um fundo escuro, então use contornos e preenchimentos claros o bastante para aparecer em cima de azul-noite.
Proibido: texto, letras, números, moldura fechada e fundo.
```

## 3. Fundo da página: `itch-fundo.png`

Fica atrás de tudo, parado (a coluna de texto rola por cima dele). No computador só as laterais aparecem, porque o meio fica coberto pela coluna de 960 px.

```
Agora gere o FUNDO DE UMA PÁGINA DE SITE, no mesmo guia de estilo de xilogravura. A página tem uma coluna de texto larga no meio que cobre o centro, então só as LATERAIS vão aparecer.
Formato: horizontal, 1536x1024, imagem cheia (sem fundo transparente).
Cena: a parede de madeira da loja de poções à noite, vista de frente. Na faixa da ESQUERDA (o quinto da esquerda da imagem): prateleiras estreitas cheias de frascos de poção de formas diferentes, um ramo de ervas secas pendurado de cabeça para baixo e uma vela acesa. Na faixa da DIREITA (o quinto da direita): a janela redonda com a lua crescente, um vaso de planta trepadeira descendo e um pequeno sino de balcão pendurado.
O CENTRO da imagem (os três quintos do meio) fica liso e escuro: só tábuas de madeira com linhas entalhadas suaves, sem nenhum objeto, porque vai ficar escondido atrás do texto.
Cores: as mesmas do fundo do menu, mais escuras e calmas, para não brigar com o texto: azul-noite e marrom-madeira dominando, ocre-ouro só na chama da vela e na lua, cobre e vermelhão em detalhes pequenos.
Proibido: texto, letras, números, título, logotipo, molduras e bordas.
```

## 4. Ícone: `itch-icone.png`

Vira o ícone do `.exe`, da barra de tarefas e do instalador. Ele aparece com 16, 32 e 48 pixels, então precisa ser uma silhueta só, sem detalhes finos.

```
Agora gere um ÍCONE DE APLICATIVO, "itch-icone", 1024x1024, FUNDO TRANSPARENTE (PNG), no mesmo guia de estilo de xilogravura, mas bem simplificado.
Um único objeto, grande, centralizado, ocupando quase toda a imagem (deixe só uma margem pequena): um caldeirão de cobre gordinho e redondo, visto de frente, com um líquido azul-turquesa borbulhando na boca e uma fita marcadora vermelha pendurada na alça, como se o caldeirão fosse um caderno.
Ele vai aparecer MUITO pequeno (32 por 32 pixels), então: contorno preto grosso e contínuo em volta de toda a silhueta, poucas linhas internas e grossas, cores chapadas fortes, nenhum detalhe fino, nenhuma textura miúda, nenhuma chama embaixo.
Cores: cobre no caldeirão, turquesa no líquido, vermelhão na fita, preto da matriz no contorno.
Proibido: texto, letras, números, fundo, sombra no chão, moldura e mais de um objeto.
```

## 5. Vinhetas da descrição: `itch-vinhetas.png`

Três desenhos pequenos que ficam ao lado dos tópicos da descrição ("Ouça o cliente", "Misture no caldeirão", "Escreva o caderno").

```
Agora gere uma folha com 3 VINHETAS separadas, 1536x1024, FUNDO TRANSPARENTE (PNG), no mesmo guia de estilo de xilogravura. Os três desenhos ficam lado a lado, do mesmo tamanho, bem separados entre si (com espaço transparente entre eles), cada um dentro de um quadrado imaginário.
1. Um sino de balcão de latão com um bilhetinho de papel dobrado preso por um alfinete (o pedido do cliente).
2. Um caldeirão de cobre pequeno com dois frascos tombados por cima, despejando uma gota azul e uma brasa vermelha.
3. Um caderno de couro aberto, com as páginas cheias de rabiscos ilegíveis e desenhos de frascos, e duas fitas marcadoras vermelhas penduradas.
Cada vinheta vai aparecer com uns 120 pixels sobre papel creme claro, então: contorno preto firme, poucas cores chapadas, sem fundo atrás de cada objeto.
Cores: preto da matriz, cobre, ocre-ouro, azul da gota, vermelhão nas fitas e na brasa.
Proibido: texto, letras legíveis, números, fundo e moldura.
```

## Dicas

- Se a capa vier cheia de coisas, responda: "Simplifique: só o caldeirão, as duas mãos, o gato Bartolomeu e o caderno. Ela vai ser vista bem pequena."
- Se aparecer rosto de pessoa na capa, responda: "Só as mãos e os punhos da aprendiz, sem rosto e sem corpo."
- Se o centro do fundo vier com objetos, responda: "Deixe os três quintos do meio lisos, só tábuas de madeira escura."
- Se o ícone vier com detalhes finos, responda: "Simplifique mais: precisa ser reconhecível com 32 pixels. Contorno grosso e poucas linhas."
- Se aparecer qualquer texto ou letra, responda: "Tire todo o texto, o título entra depois, por cima."
- Se o fundo transparente não vier transparente, responda: "Refaça com fundo transparente, só o desenho."
- Salve com os nomes da tabela e mande aqui na thread. Eu corto, redimensiono, coloco o título em Grenze Gotisch na capa e no banner, gero o ícone do `.exe` em todos os tamanhos e deixo tudo abaixo de 3 MB (limite do itch.io).
