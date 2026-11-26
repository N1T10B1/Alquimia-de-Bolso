// Falas dos clientes e da mercadora (só texto, sem regras). Cada cliente tem várias
// saudações, agradecimentos, reações ao frasco errado e despedidas quando vai embora
// sem poção. A escolha é estável por pedido (mesmo pedido, mesma fala), e varia entre pedidos.

export const LINES = Object.freeze({
  'bruxa-ofelia': {
    greet: [
      'Minhas ervas acabaram, então vim bater na sua porta.',
      'Boa tarde, colega de caldeirão. Hoje o meu feitiço precisa de reforço.',
      'Não conte para o conselho das bruxas que eu comprei poção pronta, sim?',
      'Meu gato fugiu com a vassoura, então vim a pé. Escute só:',
      'Senti cheiro de alquimia boa da esquina. Tenho um problema:',
    ],
    thanks: [
      'Ah, essa receita eu vou copiar para o meu grimório. Obrigada!',
      'Perfeita. Nem eu faria melhor, e olha que eu tento há cem anos.',
      'Volto amanhã com mais encomendas, pode apostar.',
    ],
    sad: ['Hmm, esse cheiro não é o que eu pedi, querida.', 'Quase! Mas uma bruxa conhece a poção certa pelo vapor.'],
    leave: ['Tudo bem, eu mesma improviso com sapo e urtiga.', 'Volto quando o seu estoque estiver mais cheio.'],
  },
  'cavaleiro-tadeu': {
    greet: [
      'Saudações! Venho em missão urgente.',
      'Pela honra do reino, preciso da sua ajuda.',
      'Minha armadura range, mas o problema é outro:',
      'O rei me mandou aqui com uma lista. Bem, com um pedido:',
      'Boa tarde! Prometo não sujar o chão com a lama da estrada.',
    ],
    thanks: [
      'Que a sua botica seja cantada pelos bardos!',
      'Missão cumprida, graças a você.',
      'Devo-lhe uma, boticária. Palavra de cavaleiro.',
    ],
    sad: ['Com todo o respeito, isto não serve para a minha missão.', 'Hmm, acho que houve um engano no frasco.'],
    leave: ['Entendo. Um cavaleiro sabe esperar.', 'Seguirei sem a poção, então. Que a sorte me acompanhe.'],
  },
  'fada-lumi': {
    greet: [
      'Oi, oi! Voei o caminho inteiro até aqui!',
      'Psiu! Cheguei pela janela, desculpa o pó de fada.',
      'A rainha das flores me mandou. Tenho um pedido pequenininho:',
      'Que loja linda! Brilha quase tanto quanto eu. Olha só:',
      'Eu trouxe um orvalho de presente. E um pedido:',
    ],
    thanks: ['Eba! Vou contar para todas as flores do bosque!', 'Que lindo! Brilha igualzinho eu queria.', 'Você é mágica de verdade!'],
    sad: ['Ah… não era bem isso. Mas eu explico de novo!', 'Esse frasco não brilha do jeito certo.'],
    leave: ['Tudo bem, eu volto outro dia voando!', 'Ah, que pena. Mas a sua loja continua linda.'],
  },
  'anao-baltazar': {
    greet: [
      'Bah! Vim direto da mina, nem lavei as mãos.',
      'Desci da montanha só para isso, então vale a pena.',
      'Tenho ouro, tenho pressa e tenho um problema.',
      'Meus primos disseram que aqui o serviço é bom. Vamos ver:',
      'Sem rodeios, que a picareta me espera:',
    ],
    thanks: ['Ha! Isso é trabalho de mestre.', 'Vale cada pepita. Até a próxima!', 'Vou recomendar a botica para o clã inteiro.'],
    sad: ['Bah! Isso aqui não serve nem para lubrificar carrinho de mina.', 'Errou o veio, boticária. Escute de novo:'],
    leave: ['Hunf. Volto quando tiver o que eu preciso.', 'Vou procurar na outra montanha, então.'],
  },
  'bardo-cirilo': {
    greet: [
      'Ó boticária, ouça a minha canção… quer dizer, o meu pedido!',
      'Compus uma balada sobre a sua loja. Mas antes:',
      'Lá-lá-lá! Que acústica maravilhosa tem esta botica. Bem:',
      'Toda boa história começa com um problema. O meu é este:',
      'Venho de uma turnê pelas tavernas e preciso de socorro.',
    ],
    thanks: ['Vou escrever três estrofes sobre esta poção!', 'Bravo! Que final feliz para a minha história.', 'Minha plateia vai amar. Obrigado!'],
    sad: ['Desafinou! Não era essa a nota.', 'Hmm, essa poção não rima com o meu problema.'],
    leave: ['Uma balada triste, mas eu sigo cantando.', 'Fica para o próximo verso, então.'],
  },
  'vovo-quiteria': {
    greet: [
      'Ai, meus joelhos… deixa eu contar do que preciso.',
      'Trouxe bolo de fubá para você, querida. E um pedido:',
      'No meu tempo a gente fazia tudo isso com chá. Mas vamos lá:',
      'Meu neto disse que você é muito esperta. Então me ajude:',
      'Sente aqui um minutinho e escute a vovó:',
    ],
    thanks: ['Deus lhe pague, minha filha.', 'Que mãos de ouro! Vou trazer mais bolo.', 'Isso me lembra a botica da minha mãe. Obrigada!'],
    sad: ['Ai, querida, acho que você se confundiu.', 'Não é esse não. A vovó explica com calma:'],
    leave: ['Tudo bem, a vovó volta amanhã.', 'Não faz mal, eu me viro com um chazinho.'],
  },
  'elfo-anselmo': {
    greet: [
      'Saudações sob a luz do entardecer.',
      'As árvores sussurraram o nome da sua botica.',
      'Viajei três luas para chegar aqui. Ouça:',
      'Peço perdão pela visita sem aviso. É urgente:',
      'Que aroma de ervas tão puro. Talvez você possa me ajudar.',
    ],
    thanks: ['As estrelas sorriem para o seu trabalho.', 'Perfeita como a primeira folha da primavera.', 'Minha gente lembrará deste favor.'],
    sad: ['Esta essência não conversa com o meu problema.', 'Bela poção, mas não é a que eu busco.'],
    leave: ['O tempo dos elfos é longo. Voltarei.', 'Sigo meu caminho. Que suas ervas floresçam.'],
  },
  'pirata-dorotea': {
    greet: [
      'Arr! Lancei âncora aqui por um bom motivo.',
      'Deixei o papagaio no navio para ele não roubar nada. Escute:',
      'Tenho moedas de três reinos e um problema de um só:',
      'A maré está subindo, então fale rápido e me ajude:',
      'Ahoy, boticária! O mar me trouxe até a sua porta.',
    ],
    thanks: ['Arr! Isso vale um baú de tesouro!', 'Vou contar a toda a tripulação.', 'Ventos bons para você, boticária!'],
    sad: ['Arr, isso aqui é água do porão!', 'Rumo errado, marujo. Escute de novo:'],
    leave: ['Vou procurar em outro porto, então.', 'A maré não espera. Até a próxima viagem!'],
  },
  'gato-falante': {
    greet: [
      'Miau. Sim, eu falo. Agora, ao que interessa:',
      'Não me olhe assim, gatos também têm problemas.',
      'Derrubei três frascos da sua prateleira só para chamar atenção. Ouça:',
      'Pago em peixe ou em moedas, você escolhe. Preciso disto:',
      'Miau. Serei breve, que tenho uma soneca marcada.',
    ],
    thanks: ['Ronrom. Aceitável. Muito aceitável.', 'Você ganhou o meu respeito felino.', 'Vou dormir em cima do seu balcão de gratidão.'],
    sad: ['Miau?! Isso não é nem de longe o que eu pedi.', 'Errou. Vou derrubar mais um frasco em protesto.'],
    leave: ['Hunf. Gatos sabem esperar. Ou dormir.', 'Volto amanhã. Talvez. Se eu quiser.'],
  },
});

// Abertura extra quando o pedido é de uma receita fora do caderno.
export const NOVEL_HINTS = Object.freeze([
  'Disseram que ninguém na vila sabe fazer isto ainda.',
  'Sei que é coisa nova, mas pago bem pela novidade.',
  'Acho que nem está nos livros. Você topa inventar?',
]);

// A mercadora no fim do dia.
export const MERCHANT_LINES = Object.freeze([
  'Fim de expediente! Trouxe ingredientes frescos da estrada.',
  'Boa noite, boticária. A carroça chegou cheia hoje.',
  'Sei que o dia foi longo. Que tal reabastecer para amanhã?',
  'Ervas, cristais, sombras engarrafadas… escolha à vontade.',
  'Cheguei antes da chuva! O que vai levar hoje?',
]);

// Número pequeno e estável a partir de um texto (para escolher falas sem sorteio).
export function hashText(text) {
  let h = 2166136261;
  for (const ch of String(text)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

export function lineFor(customerId, kind, seed) {
  const set = LINES[customerId];
  const list = (set && set[kind]) || [];
  if (!list.length) return '';
  return list[hashText(`${customerId}:${kind}:${seed}`) % list.length];
}

export function pickLine(list, seed) {
  return list.length ? list[hashText(String(seed)) % list.length] : '';
}

// v1.14 — quando a vela da paciência apaga e o cliente vai embora sozinho.
export const IMPATIENT_LINES = Object.freeze([
  'Esperei o quanto pude. Volto outro dia, quem sabe.',
  'A vela apagou e a minha paciência junto. Passar bem!',
  'Tenho mais o que fazer do que esperar no balcão.',
  'Vou tentar a feira da cidade vizinha. Adeus!',
  'Nem um frasquinho em tanto tempo? Que pena.',
]);

// v1.14 — o cliente começa a se impacientar (menos de 1/4 da vela).
export const HURRY_LINES = Object.freeze([
  'Vai demorar muito?',
  'Hum… o sol já está baixando.',
  '(batuca os dedos no balcão)',
  'Estou com um pouco de pressa, sabe?',
]);

// v1.23 — a mercadora com pressa (último quarto da vela) e indo embora.
export const MERCHANT_HURRY_LINES = Object.freeze([
  'A estrada até a próxima vila é longa… vai levar alguma coisa?',
  'Os burros já estão inquietos. Decide logo, boticária!',
  'Daqui a pouco eu fecho a banca, viu?',
]);
export const MERCHANT_BYE_LINES = Object.freeze([
  'Bom, a estrada me chama. Até amanhã à noite!',
  'Fecho a banca por hoje. Amanhã eu passo de novo!',
  'Não dá para esperar mais: tenho entrega na serra. Até amanhã!',
]);

// v1.28 — fim da demo: a Mestra Benvinda escreve do mar. `r` = demoSummary(state).
export function demoLetter(r) {
  const all = r.found >= r.total;
  return {
    greeting: 'Minha querida,',
    paragraphs: [
      all
        ? `A Zuleica passou por aqui com a carroça e me contou: as ${r.total} páginas do caderno já estão escritas. Eu levei um inverno inteiro para isso. Você levou ${r.day} dias.`
        : `A Zuleica passou por aqui com a carroça e me contou que você já escreveu ${r.found} das ${r.total} receitas em ${r.day} dias. Sem ninguém para ensinar, só o caldeirão e o herbário.`,
      'A Vovó Quitéria anda dizendo na praça que a mão sarou mais rápido que com as minhas poções. Fiquei com ciúme e com orgulho, nessa ordem.',
      'O mar é maior do que eu pensava, e a areia tem cheiro de coisa que ainda não tem nome. Acho que o caderno ainda vai precisar de muitas páginas.',
      'Cuide do caldeirão. Logo eu escrevo de novo.',
    ],
    signature: 'Benvinda',
  };
}
