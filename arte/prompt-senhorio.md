# Prompt: retrato do senhorio (Seu Leopoldo)

O senhorio aparece no balcão, antes da mercadora, quando a botica fecha 3 dias seguidos devendo o aluguel (v1.27). Ele precisa das mesmas 3 expressões dos clientes, porque o jogo troca o rosto conforme o que acontece:

| Arquivo | Quando aparece |
|---|---|
| `senhorio-leopoldo-neutro.png` | chegou para cobrar |
| `senhorio-leopoldo-feliz.png` | você pagou a dívida |
| `senhorio-leopoldo-triste.png` | você entregou a chave (fim de jogo) |

Observação: o nome mudou de "Anselmo" para **Leopoldo**, porque o jogo já tem o cliente Elfo Anselmo.

## Como usar

Use a mesma conversa do ChatGPT em que você gerou os clientes (o guia de estilo da visual novel, de `prompts-chatgpt.md`). Se for uma conversa nova, cole o guia de estilo antes e anexe dois retratos prontos (por exemplo, a mercadora Zuleica e a Vovó Quitéria) como referência de traço, enquadramento e tamanho de cabeça.

## 1. Retrato neutro

```
Gere o retrato do SENHORIO LEOPOLDO, dono do prédio da botica, no guia de estilo combinado.
Formato: vertical, 1024x1536, FUNDO TRANSPARENTE (PNG).
Enquadramento: da cintura para cima, de frente, olhando para o espectador, corpo centralizado, cabeça no terço superior. Mesmo enquadramento e mesmo tamanho de cabeça que os outros clientes.
Expressão: séria e educada, sobrancelhas um pouco franzidas, de quem veio tratar de um assunto chato mas não quer brigar.
Personagem: homem de uns 60 anos, alto e barrigudo, bigode grisalho farto e bem penteado, costeletas, óculos pequenos redondos na ponta do nariz. Chapéu de feltro de aba larga molhado de chuva, casaco comprido de lã com gola alta e botões de metal, colete escuro por baixo. Numa mão, um caderninho de couro de cobranças aberto; na outra, um guarda-chuva fechado pingando. Preso ao cinto, um molho grande de chaves de ferro antigas, e uma corrente de relógio de bolso atravessando o colete. Ele é rígido, mas não é vilão: parece um tio sério que cobra o que é dele.
Paleta: dominante verde-oliva #6b6b35 no casaco e no chapéu (60%); secundária preto-carvão #2a2626 no colete, nas luvas e no guarda-chuva (30%); acento ouro velho #b88a2e na corrente do relógio, nos botões e na argola das chaves (10%). As chaves são de ferro escuro.
Nada ameaçador: sem armas, sem cara de mau, sem sombras dramáticas.
```

## 2. Expressões (envie depois que o neutro estiver aprovado)

```
Agora gere o MESMO personagem, com a mesma roupa, o mesmo enquadramento, as mesmas cores e o fundo transparente, mudando só a expressão e a pose das mãos. Gere duas imagens separadas:
1. Feliz: aliviado e satisfeito, sorriso discreto debaixo do bigode, tirando o chapéu com uma mão em cumprimento; a outra mão segura uma bolsinha de moedas.
2. Triste: sobrancelhas caídas, olhar sem jeito, segurando com as duas mãos na frente do peito uma chave grande de ferro (a chave da botica); o chapéu está na cabeça e o guarda-chuva pendurado no braço. É um "sinto muito", sem raiva.
```

## Dicas

- Se ele vier com cara de vilão, responda: "Deixe ele menos ameaçador: um senhor sério e educado, não um vilão."
- Se o casaco vier marrom ou cobre, responda: "O casaco tem que ser verde-oliva #6b6b35; marrom e cobre são as cores da loja e ele sumiria no fundo."
- Se as cores mudarem entre as expressões, responda: "Mantenha exatamente a paleta: dominante verde-oliva, secundária preto-carvão, acento ouro velho, nas proporções 60/30/10."
- Se o fundo não vier transparente, peça: "Remova o fundo e entregue em PNG transparente."
- Salve com os nomes da tabela e mande aqui. Eu converto para o tamanho do jogo e ponho no balcão.

## 3. Só a expressão decepcionada (`senhorio-leopoldo-triste.png`)

Pedido pelo Rafael em 25/11/2026. Use na mesma conversa do retrato neutro; se for outra conversa, anexe o `senhorio-leopoldo-neutro.png` antes.

```
Agora gere UMA imagem do MESMO senhorio Leopoldo do retrato neutro: mesma roupa, mesmo chapéu, mesmo bigode e óculos, mesmo enquadramento (da cintura para cima, de frente, cabeça no terço superior), mesmo tamanho, mesmas cores (verde-oliva, preto-carvão, ouro velho) e FUNDO TRANSPARENTE (PNG), 1024x1536.
Mude só a expressão e a pose das mãos: DECEPCIONADO. Sobrancelhas caídas, olhos um pouco baixos, bigode caído com a boca torta para baixo, ombros levemente encolhidos, de quem não queria que terminasse assim. Segura com as duas mãos, na frente do peito, uma chave grande de ferro antiga (a chave da botica); o guarda-chuva fica pendurado no braço.
Sem raiva e sem lágrimas: é um "sinto muito", não uma bronca.
```
