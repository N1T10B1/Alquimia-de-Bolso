# Trilha sonora de Alquimia de Bolso: "Renascença de Bolso"

## O estilo

A arte do jogo é um herbário em xilogravura do século XV–XVI, numa botica iluminada por velas ao entardecer. A música segue a mesma época: **música renascentista de câmara, tocada por um pequeno conjunto (um "consort") dentro da loja**. Pense nas danças de Tielman Susato e no *Terpsichore* de Praetorius, mas tocadas baixinho, de forma aconchegante, sem pompa de corte.

Regras do estilo:

- **Modos antigos em vez de maior/menor puro.** O menu está em Ré dórico (melancólico mas acolhedor). A loja está em Sol mixolídio (alegre, com um sétimo grau "antigo" que soa de época).
- **Danças em compasso ternário.** O menu é uma pavana lenta em 3/4. A loja é uma galharda leve em 6/8, que dá o balanço de quem atende no balcão.
- **Poucos instrumentos, todos acústicos e "de madeira".** Nada de bateria, sintetizador ou orquestra grande. A sensação é de 4 a 6 músicos num cômodo pequeno.
- **A magia entra só como brilho.** Celesta, glockenspiel e triângulo aparecem pouco, como faíscas do caldeirão. Se tocarem o tempo todo, perde o encanto.
- **Loops sem emenda.** As faixas terminam preparando a volta ao começo (o último compasso leva de volta ao primeiro acorde).

## Os arquivos

| Arquivo | Uso no jogo | Tom / compasso / andamento | Duração |
|---|---|---|---|
| `01-tema-do-menu.mid` | Menu principal | Ré dórico, 3/4, 80 bpm | ~72 s, em loop |
| `02-loop-da-loja.mid` | Loja durante o dia | Sol mixolídio, 6/8, 99 bpm (semínima pontuada ≈ 66) | ~62 s, em loop |
| `03-efeito-pocao-pronta.mid` | Poção certa | Ré maior | ~2 s |
| `04-efeito-pocao-falhou.mid` | Poção virou lodo | Descida cromática | ~2 s |
| `05-efeito-cliente-chegou.mid` | Cliente entra (sino da porta) | Sol | ~1,5 s |

Cada arquivo tem uma trilha por instrumento, com nome, canal e programa General MIDI já definidos. As faixas longas têm **marcadores** (Intro, A, B, Loop...) que aparecem na timeline do FL Studio.

### Estrutura

**Tema do menu "O Caderno da Boticária"**: Intro (4 compassos, alaúde e bordão) → A (8, flauta doce canta o tema) → B (8, a viola da gamba responde com contracanto e entra o cravo) → A2 (8, todos, com celesta dobrando o tema uma oitava acima) → Fim (4, alaúde sozinho e celesta caindo) → volta ao início.

**Loop da loja "Balcão ao Entardecer"**: Intro (2) → A (8, flauta, alaúde, baixo e tambor) → A2 (8, entram cravo e "bolhas" de glockenspiel) → B (8, o fagote faz contracanto e o saltério responde às frases) → A3 (8, todos, o saltério dobra a melodia em terças) → volta ao início.

## Instrumentos

| Trilha no MIDI | Instrumento real que ela representa | Programa GM | Papel |
|---|---|---|---|
| Flauta doce (Recorder) | Flauta doce contralto/soprano | 75 Recorder | Melodia principal |
| Alaúde (Nylon Guitar) | Alaúde renascentista | 25 Nylon Guitar | Arpejos, a "cama" harmônica |
| Viola da gamba (Cello) | Viola da gamba baixo | 43 Cello | Baixo e contracanto do menu |
| Baixo pizzicato | Violone/gamba dedilhada | 46 Pizzicato Strings | Baixo saltitante da loja |
| Cravo (Harpsichord) | Cravo ou espineta | 7 Harpsichord | Acordes curtos, entra na 2ª metade |
| Fagote (Bassoon) | Dulciana / fagote antigo | 71 Bassoon | Contracanto da parte B da loja |
| Saltério (Dulcimer) | Saltério / dulcimer martelado | 16 Dulcimer | Respostas e terças |
| Bordão (String Ensemble) | Sanfona (hurdy-gurdy) segurando Ré e Lá | 49 String Ensemble | Nota longa de fundo |
| Celesta / Glockenspiel | Brilho mágico | 9 Celesta / 10 Glockenspiel | Faíscas, bolhas do caldeirão |
| Sininho (Tubular Bells) | Sino de porta de loja | 15 Tubular Bells | Efeito "cliente chegou" |
| Percussão (canal 10) | Tambor de mão (tambor de moldura), pandeirola, triângulo | GM: 61/60 bongôs, 54 pandeirola, 81 triângulo | Pulso leve da dança |

(Os números estão contados a partir de 1, como o FL mostra. No arquivo eles estão gravados a partir de 0.)

## Como montar no FL Studio

1. Arraste o `.mid` para o FL (ou *File → Import → MIDI file*). Marque **"Start new project"** e deixe as trilhas separadas por canal. Cada instrumento vira um canal no Channel Rack, com o nome já certo.
2. O FL coloca o *FL Keys*/MIDI Out em cada canal. Troque cada um pelo instrumento virtual que quiser. Opções gratuitas que funcionam bem para esse som:
   - **Pianobook (Decent Sampler)**: tem várias bibliotecas grátis de alaúde, flauta doce, cravo, saltério e sanfona. Procure por "lute", "recorder", "harpsichord", "dulcimer", "hurdy gurdy".
   - **Spitfire LABS**: cordas suaves para o bordão e a gamba.
   - Se faltar algo, a *FL Keys*, *FLEX* e o *Fruity Soundfont Player* com um soundfont GM servem de rascunho.
3. Os andamentos, compassos e marcadores já vêm no arquivo. O 6/8 da loja aparece como 99 bpm em semínimas, o que é normal.
4. As dinâmicas (velocity) já têm uma leve humanização. Se quiser mais vida, use *Tools → Riff machine* ou ajuste a velocity no Piano Roll.

### Dicas de mixagem para combinar com a arte

- **Sala pequena, não catedral.** Um reverb de sala curto (Fruity Reeverb 2 ou Valhalla Supermassive, grátis), com 15–25% de mix, dá a sensação de estar dentro da botica.
- **Calor de pergaminho.** Um passa-baixa suave em ~9–11 kHz no master e um pouco de saturação de fita deixam o som "envelhecido", como o papel da xilogravura.
- **Ambiente opcional.** Um chiado de lareira/velas bem baixo por baixo da música da loja ajuda muito.
- **Volume no jogo.** Música de fundo de jogo cozy costuma ficar uns 6–10 dB abaixo dos efeitos e da interface. Deixe a flauta à frente e o resto bem atrás.
- **Para o loop não "estalar":** exporte em WAV com *Leave remainder* desligado e corte exatamente no marcador **Loop**. Depois converta para OGG/MP3.

## Se quiser mudar as músicas

`compor-midis.py` é o script que gerou os MIDIs. As melodias e acordes estão escritos nele como listas fáceis de ler. Mas o caminho natural é editar direto no Piano Roll do FL.
