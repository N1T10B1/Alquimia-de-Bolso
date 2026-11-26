// História de origem da botica e roteiro do tutorial do primeiro dia (só texto e regras puras, sem DOM).
// Texto aprovado pelo Rafael em 21/11/2026 (documento "Alquimia de Bolso: a história da loja").
import { fillOrders } from './progression.js';

export const MENTOR = Object.freeze({ name: 'Mestra Benvinda', village: 'Ladeira Torta' });

// Páginas da abertura (Novo jogo). `art` é uma vinheta já existente no jogo.
export const STORY_PAGES = Object.freeze([
  {
    id: 'chegada',
    kicker: 'Ladeira Torta, há quarenta invernos',
    title: 'Tudo cabia num bolso',
    art: 'caldeirao',
    text: [
      'Uma alquimista andarilha chamada Benvinda chegou à vila com tudo o que tinha dentro do bolso do casaco: um caldeirão do tamanho de uma xícara, oito frasquinhos e um maço de ervas.',
      'Curou a febre do filho do moleiro ali mesmo, na praça. Depois disso, a vila não a deixou mais ir embora.',
    ],
  },
  {
    id: 'botica',
    kicker: 'Entre a padaria e o muro velho',
    title: 'A menor botica da vila',
    art: 'loja',
    text: [
      'O único lugar vago era um vão estreito onde antes se guardavam vassouras. Benvinda pendurou uma tabuleta torta na porta e escreveu: Alquimia de Bolso.',
      'Por quarenta anos passaram pelo balcão bruxas sem ervas, cavaleiros em missão, anões da mina, fadas pela janela e até um gato que fala.',
    ],
  },
  {
    id: 'caderno',
    kicker: 'Receita escrita é receita esquecida',
    title: 'O caderno em branco',
    art: 'herbario',
    text: [
      'A Mestra sabia de cor as doze poções e nunca escreveu nenhuma. Dizia que a mão só aprende quando erra.',
      'Para os aprendizes, deixou um caderno com doze páginas vazias. Só nas últimas folhas, o herbário, ela anotou tudo sobre os oito ingredientes: de onde vêm, o que fazem e para que servem.',
    ],
  },
  {
    id: 'partida',
    kicker: 'No outono passado',
    title: 'A chave muda de mãos',
    art: 'vela',
    text: [
      'Benvinda decidiu que estava velha para o balcão e partiu para ver o mar, que nunca tinha visto.',
      'Antes de ir, entregou a chave da botica a uma aprendiz. A você.',
    ],
  },
]);

export const LETTER = Object.freeze({
  greeting: 'Minha querida,',
  paragraphs: [
    'A botica agora é sua. Não deixei receita nenhuma, de propósito. Você vai descobrir as doze do jeito que eu descobri: juntando duas coisas e prestando atenção no que sai do caldeirão.',
    'Vai sair lodo. Muito lodo. Lodo é o primeiro trabalho de todo aprendiz, e ainda vale uma moeda.',
    'Escute os clientes. Ninguém sabe o nome da poção que quer, mas todo mundo sabe contar o problema que tem. O problema é a pista. Quando não souber por onde começar, vire o caderno e leia o herbário.',
    'Deixei três frascos de cada ingrediente e quarenta moedas. No fim da tarde, a Zuleica passa com a carroça. Compre dela e diga que fui eu que mandei.',
    'Cuide do caldeirão. Ele é mais velho que nós duas.',
  ],
  signature: 'Benvinda',
});

// Primeira cliente fixa do tutorial: Vovó Quitéria, com a mão cortada (Elixir de Cura = úmido + vivo).
export const TUTORIAL_ORDER = Object.freeze({
  id: 'o1', customerId: 'vovo-quiteria', potionId: 'cura', clue: 2, misses: 0, novel: true,
});
export const TUTORIAL_PAIR = Object.freeze(['agua', 'planta']);

// Dia 1 do tutorial: a Vovó Quitéria é a primeira no balcão; os outros clientes do dia vêm normalmente.
export function seedTutorialDay(state, rng = Math.random) {
  const draft = structuredClone(state);
  const plan = draft.plan;
  draft.orders = [{ ...TUTORIAL_ORDER }];
  draft.orderSeq = Math.max(1, Number.isInteger(draft.orderSeq) ? draft.orderSeq : 0);
  if (plan && typeof plan === 'object') {
    plan.arrived = 1;
    plan.novel = 1;
    plan.asked = [TUTORIAL_ORDER.potionId];
    plan.visitors = [TUTORIAL_ORDER.customerId];
  }
  return fillOrders(draft, rng);
}

// Bilhetes da Mestra na margem do caderno, um por passo do tutorial.
export const TUTORIAL_NOTES = Object.freeze({
  balcao: {
    title: 'A primeira freguesa',
    text: 'Esta é a Vovó Quitéria, a freguesa mais antiga da botica. Repare: ela não diz o nome da poção, só conta o problema. Mão cortada pede algo que feche a ferida.',
    action: 'Entendi',
  },
  livro: {
    title: 'Antes de misturar, leia',
    text: 'Toque na fita do Livro, lá em cima, ou arraste a tela para baixo. É ali que ficam as receitas e o meu herbário.',
  },
  herbario: {
    title: 'O herbário',
    text: 'As páginas de receitas estão vazias, eu sei. Abra a aba Ingredientes: cada um tem uma qualidade e diz no que ajuda.',
  },
  ler: {
    title: 'Úmido com vivo',
    text: 'Para ferida, junte o que é úmido com o que é vivo: a Gota Lunar leva o efeito para dentro do corpo e a Folha Viva fecha e faz crescer. Agora feche o livro.',
    action: 'Fechar o livro',
  },
  caldeirao: {
    title: 'O caldeirão',
    text: 'Toque no caldeirão, ou em Misturar no caldeirão, para abrir a bancada.',
  },
  misturar: {
    title: 'Duas cartas, uma mistura',
    text: 'Toque na Gota Lunar e na Folha Viva para pôr as duas no caldeirão. Depois, toque em Misturar.',
  },
  lodo: {
    title: 'Lodo!',
    text: 'Viu? Lodo é o primeiro trabalho de todo aprendiz, e ainda vale uma moeda na prateleira. Agora tente a Gota Lunar com a Folha Viva.',
  },
  outra: {
    title: 'Uma página nova',
    text: 'Você descobriu uma receita, e ela já está no caderno para sempre. Mas não é o que a Vovó precisa: tente a Gota Lunar com a Folha Viva.',
  },
  descoberta: {
    title: 'A primeira página',
    text: 'O Elixir de Cura entrou no caderno, e agora ele está na prateleira. Volte ao balcão e entregue o frasco para a Vovó.',
    action: 'Voltar ao balcão',
  },
  entregar: {
    title: 'Entregue o frasco',
    text: 'Toque em Entregar poção e escolha o Elixir de Cura.',
  },
  sozinha: {
    title: 'Agora é com você',
    text: 'Os outros fregueses do dia estão na fila, sem bilhete meu. Ingrediente não se compra de dia: se faltar, você pode mandar o cliente embora, mas a fama da botica cai um pouco.',
    action: 'Pode deixar',
  },
  zuleica: {
    title: 'A Zuleica chegou',
    text: 'É a minha fornecedora há trinta anos. Ela só vende no fim do dia, então compre pensando nos pedidos de amanhã.',
    quote: 'Então você é a aprendiz da Benvinda. Ela sempre pagou em dia. Vejamos você.',
  },
  banca: {
    title: 'Compre com cuidado',
    text: 'Cada frasco custa 4 ou 5 moedas. Guarde moedas também para os utensílios, como a lupa, que ajudam a descobrir receitas.',
    action: 'Entendi',
  },
  amanha: {
    title: 'Quando estiver pronta',
    text: 'Toque em Abrir a loja para começar o dia 2. Amanhã vem mais gente.',
  },
});

export const TUTORIAL_END = Object.freeze({
  title: 'O primeiro dia acabou',
  text: 'Daqui em diante, não deixo mais bilhetes. A botica é sua de verdade.',
  tips: [
    'Leia o problema do cliente e procure no herbário o ingrediente que ajuda.',
    'Lodo vale uma moeda. Cada erro fica anotado, e o caldeirão avisa antes de você repetir.',
    'A vela, nos utensílios, dá uma dica grátis de vez em quando.',
    'Os clientes aumentam a cada dia. Descubra as doze receitas para completar o caderno.',
  ],
  action: 'Abrir a loja',
});
