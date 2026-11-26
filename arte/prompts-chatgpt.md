# Prompts para gerar a arte no ChatGPT

Use uma única conversa no ChatGPT para todas as imagens, para ele manter o mesmo estilo. Envie as mensagens na ordem abaixo e copie cada bloco inteiro.

---

## Mensagem 1: definir o estilo (envie primeiro, sem pedir imagem ainda)

```
Vou te pedir várias imagens para um jogo de navegador chamado "Alquimia de Bolso", uma loja de poções aconchegante de fantasia medieval. Todas as imagens desta conversa devem seguir EXATAMENTE este guia de estilo. Não gere nada ainda, só confirme que entendeu.

GUIA DE ESTILO
- Técnica: ilustração 2D estilo visual novel, traço de tinta marrom-escuro fino e levemente irregular, como desenho em caderno de alquimista, com pintura em aquarela suave por cima. Nada de 3D, nada de fotorrealismo, nada de anime brilhante.
- Paleta: tons quentes de cobre (#c87533), marrom de madeira (#3a2618), pergaminho (#e2cda2) e dourado (#f2c14e). Acentos de turquesa (#3fd0c9) e violeta (#a77be6) só em detalhes mágicos (líquidos, brilhos, joias).
- Luz: quente, de vela e de janela no fim da tarde. Sombras macias, sem preto puro.
- Clima: acolhedor, gentil, um pouco excêntrico e bem-humorado. Nada assustador, sangrento ou sensual.
- Personagens: proporção realista estilizada (cerca de 6 cabeças de altura), rostos expressivos e simpáticos, roupas medievais de fantasia com muitos detalhes artesanais.
- Proibido: texto, letras, logotipos, marcas d'água, molduras e bordas na imagem.

REGRA DE CORES DOS PERSONAGENS
- Cada cliente tem uma paleta própria de 3 cores: a cor dominante cobre cerca de 60% da roupa, a secundária cerca de 30% e o acento só 10% (um detalhe, uma joia, um bordado).
- Todos os personagens compartilham os mesmos neutros: pergaminho (#e2cda2) para tecidos claros, tinta marrom-escura (#2b1e16) para contornos e sombras, e couro (#4a2c1a) para cintos e sapatos.
- As cores imitam pigmentos de manuscrito antigo: saturação média, levemente terrosas, nunca neon.
- A cor dominante do personagem nunca pode ser cobre ou marrom de madeira, porque essas são as cores do fundo da loja e o personagem sumiria.
- Turquesa e violeta brilhantes são reservados para magia; nos personagens aparecem só como acento.
```

---

## Mensagem 2: fundo da loja

```
Gere o FUNDO do jogo, no guia de estilo combinado.
Formato: horizontal, 1536x1024.
Cena: interior de uma pequena loja de poções vista de frente, do ponto de vista de quem está atrás do balcão. Balcão de madeira gasta na parte de baixo da imagem, vazio no centro (é onde o cliente vai aparecer, então deixe o centro livre e um pouco desfocado). Prateleiras com frascos coloridos, ervas secas penduradas, um caldeirão de cobre no canto direito com vapor turquesa, uma janela redonda à esquerda com luz dourada de fim de tarde, velas acesas. Sem pessoas.
```

---

## Mensagem 3 em diante: um cliente por mensagem

Envie primeiro o bloco "Modelo de personagem" preenchido com um cliente da lista. Quando a imagem neutra estiver boa, peça as outras duas expressões com o bloco "Expressões".

### Modelo de personagem

```
Gere o retrato do cliente [NOME], no guia de estilo combinado.
Formato: vertical, 1024x1536, FUNDO TRANSPARENTE (PNG).
Enquadramento: da cintura para cima, de frente, olhando para o espectador, corpo centralizado, cabeça no terço superior. Mesmo enquadramento e mesmo tamanho de cabeça que os outros clientes.
Expressão: neutra e simpática.
Personagem: [DESCRIÇÃO]
Paleta: [PALETA]
```

### Expressões (envie logo depois do retrato neutro aprovado)

```
Agora gere o MESMO personagem, com a mesma roupa, o mesmo enquadramento, as mesmas cores e o fundo transparente, mudando só a expressão e a pose das mãos. Gere duas imagens separadas:
1. Feliz: sorriso aberto, olhos brilhando, segurando um frasco de poção com as duas mãos.
2. Decepcionado: sobrancelhas caídas, boca torta, ombros um pouco encolhidos, sem raiva.
```

### Os 10 clientes (já existem no jogo)

Troque [NOME], [DESCRIÇÃO] e [PALETA] no modelo pelos textos abaixo.

As paletas foram distribuídas pela roda de cores para que nenhum cliente se confunda com outro, nem com o fundo cobre da loja. A Ofélia mantém o violeta que já tinha; as paletas novas começam no Tadeu.

| # | Cliente | Dominante (60%) | Secundária (30%) | Acento (10%) |
| --- | --- | --- | --- | --- |
| 1 | Bruxa Ofélia | violeta-ameixa `#5e3c94` | cinza-lã `#8c8478` | verde-erva `#6b8f3a` |
| 2 | Cavaleiro Tadeu | azul-ultramar `#2c4f9e` | aço claro `#b9c0c8` | vermelhão `#a8322a` |
| 3 | Fada Lumi | turquesa-água `#3fb8b0` | lavanda clara `#c9b6e8` | ouro-pólen `#f2c14e` |
| 4 | Anão Baltazar | cinza-ardósia `#5d6b78` | ruivo-ferrugem `#a8432a` | azul-cristal `#7fb8d9` |
| 5 | Bardo Cirilo | verde-verdete `#3f7f6a` | ouro velho `#b88a2e` | vinho `#7a2238` |
| 6 | Vovó Quitéria | rosa-ruge `#d9776f` | creme `#efe2c4` | azul-cogumelo `#4f7fc4` |
| 7 | Mercadora Zuleica | açafrão `#d99a2b` | ameixa escura `#4a2a4f` | violeta-joia `#a77be6` |
| 8 | Elfo Anselmo | azul-noite `#1f2f5c` | prata `#c8ccd4` | verde-musgo `#5b7a3a` |
| 9 | Pirata Dorotéia | vermelhão `#a8322a` | azul-marinho desbotado `#3b4a63` | turquesa `#3fd0c9` |
| 10 | Gato Bartolomeu | preto-tinta `#1d1a1f` | violeta-veludo `#6b3fa0` | ouro `#e0b13e` |

1. **Bruxa Ofélia.**
   - Descrição: Bruxa de uns 60 anos, alta e magra, chapéu pontudo violeta gasto com remendos, cabelo grisalho preso em trança, óculos redondos na ponta do nariz, xale de tricô cheio de bolsos com ervas aparecendo.
   - Paleta: dominante violeta-ameixa #5e3c94 no chapéu e no vestido; secundária cinza-lã #8c8478 no xale; acento verde-erva #6b8f3a nas ervas dos bolsos.
2. **Cavaleiro Tadeu.**
   - Descrição: Cavaleiro jovem e um pouco desajeitado, armadura de aço amassada e grande demais para ele, túnica por cima da armadura, elmo debaixo do braço, cabelo castanho bagunçado, curativo na bochecha, olhar sincero.
   - Paleta: dominante azul-ultramar #2c4f9e na túnica e na capa; secundária aço claro #b9c0c8 na armadura; acento vermelhão #a8322a num laço ou brasão pequeno no peito.
3. **Fada Lumi.**
   - Descrição: Fada do tamanho de uma criança, pele levemente azulada, asas translúcidas com brilho suave, cabelo branco curto e espetado, vestido feito de pétalas, segurando uma gota de orvalho.
   - Paleta: dominante turquesa-água #3fb8b0 no vestido de pétalas e nas asas; secundária lavanda clara #c9b6e8 nas bordas das pétalas e no brilho; acento ouro-pólen #f2c14e na gota de orvalho e nas sardas brilhantes.
4. **Anão Baltazar.**
   - Descrição: Anão minerador robusto, barba ruiva enorme com tranças e argolas de metal, capacete com uma vela presa, avental de couro sujo de pó de cristal, mãos grandes e calejadas.
   - Paleta: dominante cinza-ardósia #5d6b78 na camisa, no capacete e nas calças; secundária ruivo-ferrugem #a8432a na barba; acento azul-cristal #7fb8d9 no pó de cristal e nas argolas da barba.
5. **Bardo Cirilo.**
   - Descrição: Bardo magro e dramático, chapéu com pena longa, colete bordado, bigode fino enrolado, alaúde pendurado nas costas, pose teatral com uma mão no peito.
   - Paleta: dominante verde-verdete #3f7f6a no colete e no chapéu; secundária ouro velho #b88a2e nos bordados e no alaúde; acento vinho #7a2238 na pena do chapéu.
6. **Vovó Quitéria.**
   - Descrição: Avó baixinha e redonda, lenço florido na cabeça, avental bordado, bochechas rosadas, cesta de vime com pães e cogumelos azuis no braço, sorriso de quem vai oferecer bolo.
   - Paleta: dominante rosa-ruge #d9776f no vestido e nas flores do lenço; secundária creme #efe2c4 no avental; acento azul-cogumelo #4f7fc4 nos cogumelos da cesta.
7. **Mercadora Zuleica.**
   - Descrição: Mercadora viajante de pele morena, turbante com uma joia, colete cheio de bolsinhas e moedas penduradas, mochila enorme carregada de rolos de tecido, olhar esperto.
   - Paleta: dominante açafrão #d99a2b no turbante e nos rolos de tecido; secundária ameixa escura #4a2a4f no colete; acento violeta-joia #a77be6 na joia do turbante.
8. **Elfo Anselmo.**
   - Descrição: Elfo erudito de aparência jovem mas olhar antigo, orelhas longas, cabelo prateado liso até os ombros, manto com bordados de estrelas, livro grosso preso ao cinto, monóculo.
   - Paleta: dominante azul-noite #1f2f5c no manto; secundária prata #c8ccd4 no cabelo e nas estrelas bordadas; acento verde-musgo #5b7a3a na capa do livro.
9. **Pirata Dorotéia.**
   - Descrição: Pirata de meia-idade, chapéu tricorne com uma pena, tapa-olho bordado, casaco desbotado, papagaio pequeno no ombro, sorriso de canto com um dente de ouro.
   - Paleta: dominante vermelhão #a8322a no casaco; secundária azul-marinho desbotado #3b4a63 no chapéu e nas calças; acento turquesa #3fd0c9 na pena do chapéu e no papagaio.
10. **Gato Falante Bartolomeu.**
   - Descrição: Gato preto gordo e elegante, sentado em pé sobre o balcão, colete de veludo, gravata-borboleta, olhos amarelos semicerrados de ar superior. Enquadramento de corpo inteiro neste caso, ocupando a mesma altura dos outros retratos.
   - Paleta: dominante preto-tinta #1d1a1f no pelo; secundária violeta-veludo #6b3fa0 no colete; acento ouro #e0b13e na gravata-borboleta e nos olhos.

---

## Dicas

- Se as cores saírem diferentes, responda: "Mantenha exatamente a paleta: dominante [cor], secundária [cor], acento [cor], nas proporções 60/30/10."
- Para conferir se as paletas conversam, coloque os retratos lado a lado: cada cliente deve ser reconhecível só pela cor dominante, e nenhum deve sumir sobre o fundo da loja.
- Se um cliente sair com estilo diferente, responda: "Refaça seguindo mais de perto o estilo do fundo da loja e do primeiro cliente."
- Se o fundo não vier transparente, peça: "Remova o fundo e entregue em PNG transparente."
- Salve cada imagem com este nome, que é o que eu vou usar no jogo: `fundo-loja.png`, `bruxa-ofelia-neutro.png`, `bruxa-ofelia-feliz.png`, `bruxa-ofelia-triste.png`, e assim por diante (os ids estão na lista: bruxa-ofelia, cavaleiro-tadeu, fada-lumi, anao-baltazar, bardo-cirilo, vovo-quiteria, mercadora-zuleica, elfo-anselmo, pirata-dorotea, gato-falante).
- No total são 31 imagens: 1 fundo e 30 retratos. Para testar, comece pelo fundo e por 2 clientes.
