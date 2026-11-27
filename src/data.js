// Dados estáticos do jogo Alquimia de Bolso (sem DOM).
// v1.30: textos em inglês em en.js (dados longos) ou em L('pt', 'en') aqui mesmo (textos curtos).
import { EN, L } from './idioma.js';
import { INGREDIENTS_EN, RECIPES_EN } from './en.js';

// v1.28 — edição do jogo. A demo (index.html define globalThis.ALQUIMIA_EDICAO = 'demo') tem as
// 12 receitas originais, 4 por categoria, e termina no fechamento do dia 5. Sem a marca, é a edição
// completa (24 receitas, sem fim de demo): é assim que os testes antigos rodam.
export const EDITION = globalThis.ALQUIMIA_EDICAO === 'demo' ? 'demo' : 'completa';
export const IS_DEMO = EDITION === 'demo';
export const DEMO_RECIPES = Object.freeze([
  'cura', 'vigor', 'sono', 'amanhecer',            // cura
  'brilho', 'chamaazul', 'raiz', 'tempestade',     // proteção
  'vapor', 'invisibilidade', 'eclipse', 'esporos', // travessura
]);
// Na demo não há doses duplas: tira das fichas a frase que fala delas.
const demoText = (t) => (IS_DEMO ? t.replace(/ Em dose dupla[^.]*\./g, '').replace(/ In a double dose[^.]*\./g, '') : t);

export const INGREDIENTS = Object.freeze([
  { id: 'agua', quality: 'úmido', name: 'Gota Lunar', cost: 4, element: 'água', icon: '💧',
    lore: 'Orvalho colhido em noite de lua cheia e guardado em frasco de vidro azul.',
    property: 'Úmida e calmante. Dilui, refresca e leva o efeito do outro ingrediente para dentro do corpo.',
    helps: 'Feridas que não fecham, olhos cansados, noites sem sono. Perto de algo quente, sobe em névoa. Em dose dupla, vira chuva.' },
  { id: 'fogo', quality: 'quente', name: 'Brasa Rubra', cost: 4, element: 'fogo', icon: '🔥',
    lore: 'Carvão que nunca apaga, tirado do fundo da forja de um dragão velho.',
    property: 'Quente e agitada. Dá energia, acelera e deixa mais forte tudo o que toca.',
    helps: 'Falta de força e de fôlego, forjas e chamas teimosas, ventos que precisam de faísca. Em dose dupla, aquece até o fundo do peito.' },
  { id: 'planta', quality: 'vivo', name: 'Folha Viva', cost: 4, element: 'natureza', icon: '🌿',
    lore: 'Folha que continua crescendo depois de colhida; precisa ser regada até dentro do frasco.',
    property: 'Viva e regeneradora. Fecha, faz crescer e fortalece.',
    helps: 'Machucados, músculos exaustos, pele que precisa de uma casca protetora. Em dose dupla, cresce sem parar.' },
  { id: 'cristal', quality: 'duro', name: 'Pó de Cristal', cost: 5, element: 'mineral', icon: '💎',
    lore: 'Quartzo moído na pedra de amolar; brilha como areia ao sol do meio-dia.',
    property: 'Duro e concentrado. Endurece, protege e faz a luz e o calor ficarem mais intensos.',
    helps: 'Pele sensível, luz que não se apaga, fogo que não esquenta o bastante. Duro demais para ir duas vezes ao caldeirão.' },
  { id: 'sombra', quality: 'escuro', name: 'Sombra Engarrafada', cost: 5, element: 'obscuridade', icon: '🌑',
    lore: 'Um pedaço de noite sem lua, preso com rolha e cera preta.',
    property: 'Escura e esquiva. Esconde, apaga e engana os olhos.',
    helps: 'Passar sem ser visto, sumir de vista, apagar luzes incômodas. Em dose dupla, a escuridão engole a si mesma.' },
  { id: 'luz', quality: 'brilhante', name: 'Orvalho Solar', cost: 5, element: 'luz', icon: '☀️',
    lore: 'Gotas da primeira luz da manhã, colhidas nas pétalas de um girassol.',
    property: 'Brilhante e desperta. Ilumina, acorda e clareia.',
    helps: 'Lugares escuros, vista embaçada, acordar com disposição. Junto da escuridão, o céu fica estranho. Forte demais para ir duas vezes ao caldeirão.' },
  { id: 'cogumelo', quality: 'terroso', name: 'Cogumelo Azul', cost: 4, element: 'fungo', icon: '🍄',
    lore: 'Cresce no fundo de cavernas úmidas e brilha de leve quando ninguém está olhando.',
    property: 'Terroso e sonolento. Acalma, faz adormecer e solta esporos.',
    helps: 'Insônia, terra fraca, brincadeiras que fazem todo mundo espirrar. Em dose dupla, o sono dura uma estação.' },
  { id: 'vento', quality: 'leve', name: 'Pena do Vento', cost: 4, element: 'ar', icon: '🪶',
    lore: 'Pena de um pássaro que nunca pousa; flutua até dentro do frasco.',
    property: 'Leve e veloz. Espalha, levanta e carrega o efeito para longe.',
    helps: 'Moinhos parados, coisas que precisam se espalhar pelo ar, sumir sem deixar rastro. Em dose dupla, ninguém cai, só flutua.' },
].map((i) => (EN ? { ...i, ...INGREDIENTS_EN[i.id] } : i)).map((i) => Object.freeze({ ...i, helps: demoText(i.helps) })));

// Ordem a/b exatamente como escrita no GDD (a dica revela `a`).
const ALL_RECIPES = Object.freeze([
  { id: 'vapor', a: 'agua', b: 'fogo', name: 'Névoa Fumegante', price: 10, rarity: 'comum', icon: '🌫️', category: 'travessura',
    clues: [
      "Preciso de uma cortina de fumaça para sair de fininho da festa da minha sogra.",
      "Quero encher o palco de bruma para o meu número de mágica.",
      "Os fantasmas da peça de teatro precisam de uma névoa bem assustadora.",
      "Quero sumir no meio de uma nuvem quente quando o cobrador bater à porta.",
    ] },
  { id: 'cura', a: 'agua', b: 'planta', name: 'Elixir de Cura', price: 10, rarity: 'comum', icon: '💚', category: 'cura',
    clues: [
      "Caí do telhado consertando a chaminé e ralei os dois joelhos.",
      "Meu braço não para de doer depois da briga com um javali.",
      "Cortei a mão descascando batatas para cem convidados.",
      "Levei uma bicada do ganso do moleiro e a ferida não fecha.",
    ] },
  { id: 'vigor', a: 'fogo', b: 'planta', name: 'Tônico de Vigor', price: 10, rarity: 'comum', icon: '💪', category: 'cura',
    clues: [
      "Preciso arar o campo inteiro até o pôr do sol e já não aguento mais.",
      "Amanhã é a corrida da vila e minhas pernas parecem geleia.",
      "Vou carregar sacas de trigo o dia todo e as costas já reclamam.",
      "Vou dançar três noites seguidas na festa da colheita e preciso de fôlego.",
    ] },
  { id: 'brilho', a: 'cristal', b: 'luz', name: 'Essência Cintilante', price: 14, rarity: 'incomum', icon: '✨', category: 'protecao',
    clues: [
      "A mina onde trabalho é escura demais; preciso de algo que brilhe sem fogo.",
      "Quero que meu manto reluza como estrelas no baile da rainha.",
      "Deixei cair um anel no fundo do poço e preciso de uma luz que não se apague na água.",
      "Meu barco chega de madrugada; quero um farol de bolso que cintile.",
    ] },
  { id: 'invisibilidade', a: 'sombra', b: 'vento', name: 'Véu Invisível', price: 14, rarity: 'incomum', icon: '👻', category: 'travessura',
    clues: [
      "Preciso passar pelos guardas do castelo sem que ninguém me veja.",
      "Quero espiar o treino do time rival sem ninguém perceber.",
      "Vou entrar na cozinha do palácio e pegar um pedaço de torta sem deixar rastro.",
      "Queria que nem o meu próprio espelho me achasse, só por uma tarde.",
    ] },
  { id: 'sono', a: 'cogumelo', b: 'agua', name: 'Chá do Sono', price: 10, rarity: 'comum', icon: '😴', category: 'cura',
    clues: [
      "Não durmo há três noites: o galo do vizinho não deixa.",
      "Meu filhote de dragão não quer dormir de jeito nenhum.",
      "Os gêmeos da casa choram a noite inteira; preciso de silêncio.",
      "Viro de um lado para o outro na cama e conto ovelhas até o sol nascer.",
    ] },
  { id: 'chamaazul', a: 'fogo', b: 'cristal', name: 'Chama Azul', price: 14, rarity: 'incomum', icon: '🔵', category: 'protecao',
    clues: [
      "Minha forja não esquenta o bastante para derreter este metal teimoso.",
      "Preciso de um fogo que continue aceso mesmo debaixo da chuva.",
      "Quero uma chama cor de safira para a cerimônia do templo.",
      "A lareira do castelo vive se apagando com o vento do norte.",
    ] },
  { id: 'raiz', a: 'planta', b: 'cristal', name: 'Pele de Raiz', price: 14, rarity: 'incomum', icon: '🌳', category: 'protecao',
    clues: [
      "Vou atravessar um campo de espinhos e minha pele é sensível.",
      "Os mosquitos do pântano não me deixam em paz.",
      "Preciso de uma pele grossa como casca de árvore para colher urtigas.",
      "Vou podar a roseira encantada que morde quem chega perto.",
    ] },
  { id: 'amanhecer', a: 'luz', b: 'agua', name: 'Gotas do Amanhecer', price: 14, rarity: 'incomum', icon: '🌅', category: 'cura',
    clues: [
      "Meus olhos andam cansados; enxergo tudo embaçado.",
      "Preciso acordar cedinho e com disposição para a feira.",
      "Li tanto à luz de vela que as letras dançam na página.",
      "Minha vista anda turva e não acho mais a agulha no bordado.",
    ] },
  { id: 'eclipse', a: 'sombra', b: 'luz', name: 'Eclipse Líquido', price: 18, rarity: 'rara', icon: '🌘', category: 'travessura',
    clues: [
      "Quero escurecer o céu por um instante para impressionar a plateia.",
      "Preciso apagar a luz da torre do mago vizinho, que não me deixa dormir.",
      "Quero que o dia vire noite no meio do casamento, só por um momento mágico.",
      "Preciso de uma sombra tão grande que cubra a praça inteira ao meio-dia.",
    ] },
  { id: 'esporos', a: 'cogumelo', b: 'vento', name: 'Nuvem de Esporos', price: 10, rarity: 'comum', icon: '🦠', category: 'travessura',
    clues: [
      "Minha horta está fraca; quero espalhar fungos bons por toda a terra.",
      "Quero pregar uma peça e fazer a taverna inteira espirrar.",
      "Os cogumelos do meu porão sumiram e preciso semear tudo de novo.",
      "Quero uma nuvenzinha que faça o velho moleiro espirrar até rir.",
    ] },
  { id: 'tempestade', a: 'vento', b: 'fogo', name: 'Faísca da Tempestade', price: 10, rarity: 'comum', icon: '⚡', category: 'protecao',
    clues: [
      "Meu moinho não gira há semanas; preciso de uma boa ventania.",
      "Quero espantar os corvos da plantação com trovões.",
      "O navio está parado no mar sem vento; preciso de uma rajada com faísca.",
      "Quero um trovão de bolso para acordar meu irmão, que dorme demais.",
    ] },
  // v1.26 — doses duplas: os ingredientes brandos (4 moedas) aguentam ir duas vezes ao caldeirão;
  // Pó de Cristal, Sombra Engarrafada e Orvalho Solar são fortes demais e desandam em Lodo.
  { id: 'chuva', a: 'agua', b: 'agua', name: 'Chuva Engarrafada', price: 10, rarity: 'comum', icon: '🌧️', category: 'protecao',
    clues: [
      "Faz dois meses que não cai uma gota na minha plantação.",
      "O poço da vila secou e as vacas estão com sede.",
      "Quero uma nuvem só minha para regar a horta sem carregar balde.",
      "O celeiro do vizinho pegou fogo e precisa de um aguaceiro, e rápido!",
    ] },
  { id: 'coracao', a: 'fogo', b: 'fogo', name: 'Coração de Dragão', price: 10, rarity: 'comum', icon: '❤️‍🔥', category: 'protecao',
    clues: [
      "Vou subir a montanha gelada atrás do yeti e não quero virar picolé.",
      "A neve trancou minha porta e a lenha acabou; preciso de um calor que venha de dentro.",
      "Vou mergulhar no lago congelado para buscar o anel que caiu lá.",
      "Meus pés vivem gelados, mesmo com três pares de meia.",
    ] },
  { id: 'broto', a: 'planta', b: 'planta', name: 'Broto Desenfreado', price: 10, rarity: 'comum', icon: '🌱', category: 'cura',
    clues: [
      "Meu pé de feijão precisa chegar às nuvens até amanhã.",
      "A cerca viva do castelo foi comida pelas cabras; preciso dela inteira até o baile.",
      "Plantei abóboras para o concurso da colheita, que é daqui a dois dias.",
      "Quero uma trepadeira que suba até a janela da torre mais alta.",
    ] },
  { id: 'pluma', a: 'vento', b: 'vento', name: 'Pés de Pluma', price: 10, rarity: 'comum', icon: '🪽', category: 'travessura',
    clues: [
      "Tenho que descer o barranco da mina e morro de medo de altura.",
      "Quero pular do campanário na festa do padroeiro e pousar como uma folha.",
      "Quero andar por cima da neve fofa sem afundar até a cintura.",
      "Meu gato subiu no telhado mais alto da vila e eu vou buscá-lo.",
    ] },
  { id: 'urso', a: 'cogumelo', b: 'cogumelo', name: 'Sono de Urso', price: 10, rarity: 'comum', icon: '🐻', category: 'cura',
    clues: [
      "Odeio o frio. Quero dormir até o inverno inteiro passar.",
      "O dragão da montanha acorda de mau humor; preciso que ele durma a estação toda.",
      "Meu urso de estimação esqueceu de hibernar e está destruindo a cozinha.",
      "Vou passar meses num navio e queria dormir a viagem inteira, de uma vez.",
    ] },
  // v1.26 — duplas novas
  { id: 'brisa', a: 'agua', b: 'vento', name: 'Brisa Marinha', price: 10, rarity: 'comum', icon: '🐚', category: 'cura',
    clues: [
      "Enjoo até em barquinho de lago… e amanhã tenho que cruzar o mar.",
      "Toda vez que subo na carroça, o estômago dá cambalhotas.",
      "Vou até a ilha dos meus avós e já fico verde só de pensar nas ondas.",
      "O balanço da rede do navio me deixa tonto a noite toda.",
    ] },
  { id: 'gelo', a: 'agua', b: 'cristal', name: 'Gelo Eterno', price: 14, rarity: 'incomum', icon: '❄️', category: 'protecao',
    clues: [
      "O queijo do banquete do rei não pode estragar neste verão.",
      "Quero sorvete na festa de casamento, e estamos no auge do calor.",
      "O peixe que pesquei precisa chegar fresquinho na feira da capital.",
      "Preciso congelar o lago da vila para a festa de patinação.",
    ] },
  { id: 'fogofatuo', a: 'fogo', b: 'sombra', name: 'Fogo-Fátuo', price: 14, rarity: 'incomum', icon: '🏮', category: 'travessura',
    clues: [
      "Quero assustar os meninos que roubam as minhas maçãs.",
      "Preciso de luzinhas fantasmas para despistar quem vem atrás de mim pela floresta.",
      "A noite de assombração da vila precisa de umas almas penadas bem convincentes.",
      "Quero que o cemitério brilhe de um jeito que ninguém tenha coragem de entrar.",
    ] },
  { id: 'eco', a: 'cristal', b: 'vento', name: 'Eco de Cristal', price: 14, rarity: 'incomum', icon: '📯', category: 'travessura',
    clues: [
      "Minha voz não chega até o fundo da praça no dia do show.",
      "Preciso chamar as ovelhas que fugiram para o outro lado do vale.",
      "Vou fazer o discurso da colheita e ninguém nunca me escuta.",
      "Quero cantar uma serenata que se ouça lá do alto da torre.",
    ] },
  { id: 'seiva', a: 'planta', b: 'luz', name: 'Seiva Dourada', price: 14, rarity: 'incomum', icon: '🌹', category: 'cura',
    clues: [
      "Minhas rosas de cinquenta anos estão morrendo.",
      "O velho carvalho da praça secou depois do raio; quero ele verde de novo.",
      "As flores do meu buquê de noiva murcharam na véspera do casamento.",
      "O jardim do mosteiro passou o inverno sem sol e está todo amarelo.",
    ] },
  { id: 'arcoiris', a: 'luz', b: 'vento', name: 'Arco-Íris de Bolso', price: 14, rarity: 'incomum', icon: '🌈', category: 'travessura',
    clues: [
      "Quero um arco-íris no aniversário da minha irmã.",
      "Prometi para as crianças que hoje elas veriam um arco-íris, e o céu está limpinho.",
      "Quero colorir o céu na hora em que a noiva entrar na capela.",
      "Dizem que no pé do arco-íris tem um pote de ouro. Quero conferir.",
    ] },
  { id: 'espelho', a: 'cristal', b: 'sombra', name: 'Espelho Negro', price: 18, rarity: 'rara', icon: '🪞', category: 'protecao',
    clues: [
      "Alguém está me enganando e eu quero ver quem é.",
      "Sinto que tem algo escondido na minha casa, e não consigo achar.",
      "Quero ver o que o mago da torre esconde atrás da cortina.",
      "Preciso descobrir qual dos meus sócios sumiu com as moedas do baú.",
    ] },
].map((r) => Object.freeze(EN ? { ...r, ...RECIPES_EN[r.id] } : r)));

export const RECIPES = IS_DEMO
  ? Object.freeze(ALL_RECIPES.filter((r) => DEMO_RECIPES.includes(r.id)))
  : ALL_RECIPES;

// Categorias do Livro de Receitas.
export const CATEGORIES = Object.freeze([
  { id: 'cura', name: L('Cura', 'Healing'), icon: '🩹' },
  { id: 'protecao', name: L('Proteção', 'Protection'), icon: '🛡️' },
  { id: 'travessura', name: L('Travessura', 'Mischief'), icon: '🎭' },
].map(Object.freeze));

export const SLUDGE = Object.freeze({ id: 'lodo', name: L('Lodo Instável', 'Unstable Sludge'), price: 1, rarity: 'falha', icon: '🟤' });

export const UPGRADES = Object.freeze([
  {
    id: 'caldeirao', name: L('Caldeirão Eficiente', 'Efficient Cauldron'), cost: 40, icon: '⚗️',
    description: L('Cobre bem batido: em 1 de cada 5 misturas, os dois ingredientes voltam inteiros para a prateleira.',
      'Well-hammered copper: in 1 of every 5 mixtures, both ingredients go back to the shelf untouched.'),
  },
  {
    id: 'mercador', name: L('Marca do Mercador', 'Merchant’s Mark'), cost: 90, icon: '🪙',
    description: L('Um selo de confiança no balcão: +25% no preço das poções e nos pagamentos dos bilhetes (arredondado para baixo). O Lodo continua valendo 1.',
      'A seal of trust on the counter: +25% on potion prices and order payments (rounded down). Sludge is still worth 1.'),
  },
  {
    id: 'lupa', name: L('Lupa Arcana', 'Arcane Lens'), cost: 30, icon: '🔍',
    description: L('Lente de latão para ler entrelinhas: por 5 moedas, revela um ingrediente de uma poção ainda fora do caderno.',
      'A brass lens for reading between the lines: for 5 coins, it reveals one ingredient of a potion not yet in the notebook.'),
  },
  {
    id: 'estufa', name: L('Estufa de Ervas', 'Herb Greenhouse'), cost: 150, icon: '🪴',
    description: L('Um canteiro de vidro nos fundos: toda manhã aparecem 1 Gota Lunar, 1 Folha Viva e 1 Cogumelo Azul na prateleira, de graça.',
      'A glass garden out back: every morning 1 Moon Drop, 1 Living Leaf and 1 Blue Mushroom appear on the shelf, for free.'),
  },
  {
    id: 'alambique', name: L('Alambique Duplo', 'Double Still'), cost: 240, icon: '⚗️',
    description: L('Dois bicos de cobre: em 1 de cada 3 misturas de uma receita que já está no caderno, saem dois frascos em vez de um.',
      'Two copper spouts: in 1 of every 3 mixtures of a recipe already in the notebook, you get two flasks instead of one.'),
  },
].map(Object.freeze));

// v1.15 — cada freguês tem a sua paciência (multiplica a do dia) e um jeito de esperar.
export const CUSTOMERS = Object.freeze([
  { id: 'bruxa-ofelia', name: L('Bruxa Ofélia', 'Ofélia the Witch'), icon: '🧙‍♀️', patience: 1, temper: L('Espera o tempo de um feitiço', 'Waits as long as a spell takes') },
  { id: 'cavaleiro-tadeu', name: L('Cavaleiro Tadeu', 'Sir Tadeu the Knight'), icon: '🛡️', patience: 0.8, temper: L('Está em missão urgente', 'On an urgent quest') },
  { id: 'fada-lumi', name: L('Fada Lumi', 'Lumi the Fairy'), icon: '🧚', patience: 0.85, temper: L('Não para quieta no balcão', 'Can’t sit still at the counter') },
  { id: 'anao-baltazar', name: L('Anão Baltazar', 'Baltazar the Dwarf'), icon: '⛏️', patience: 1, temper: L('Teimoso, mas espera', 'Stubborn, but waits') },
  { id: 'bardo-cirilo', name: L('Bardo Cirilo', 'Cirilo the Bard'), icon: '🎻', patience: 0.9, temper: L('Tem show daqui a pouco', 'Has a show soon') },
  { id: 'vovo-quiteria', name: L('Vovó Quitéria', 'Granny Quitéria'), icon: '👵', patience: 1.3, temper: L('Tem todo o tempo do mundo', 'Has all the time in the world') },
  { id: 'elfo-anselmo', name: L('Elfo Anselmo', 'Anselmo the Elf'), icon: '🧝', patience: 1.2, temper: L('Vive séculos, sabe esperar', 'Lives for centuries, knows how to wait') },
  { id: 'pirata-dorotea', name: L('Pirata Dorotéia', 'Dorotéia the Pirate'), icon: '🏴‍☠️', patience: 0.75, temper: L('A maré não espera', 'The tide waits for no one') },
  { id: 'gato-falante', name: L('Gato Falante Bartolomeu', 'Bartolomeu the Talking Cat'), icon: '🐈', patience: 1.2, temper: L('Gatos sabem esperar (ou dormir)', 'Cats know how to wait (or sleep)') },
].map(Object.freeze));

// A mercadora não é freguesa: ela abre a banca de ingredientes no fim de cada dia.
export const MERCHANT = Object.freeze({ id: 'mercadora-zuleica', name: L('Mercadora Zuleica', 'Zuleica the Merchant') });
// v1.27 — o dono do prédio da botica, que vem cobrar o aluguel atrasado
export const LANDLORD = Object.freeze({ id: 'senhorio-leopoldo', name: L('Seu Leopoldo, o senhorio', 'Mr. Leopoldo, the landlord') });

export const CONFIG = Object.freeze({
  START_COINS: 40,
  START_STOCK: 3,
  XP_PER_MIX: 1,
  XP_DISCOVERY: 5,
  XP_DELIVERY: 3,
  XP_PER_LEVEL: 20,
  ORDER_SLOTS: 3,
  ORDER_BONUS: 3,
  HINT_COST: 5,
  EFFICIENCY_CHANCE: 0.2,
  MERCHANT_BONUS: 0.25,
  TOTAL_RECIPES: RECIPES.length,     // 24 na edição completa, 12 na demo
  DEMO_LAST_DAY: 5,                 // v1.28: a demo termina no fechamento deste dia
  FREE_HINT_COOLDOWN_MS: 4 * 60 * 1000, // dica grátis a cada 4 minutos
  REVEAL_AFTER_MISSES: 2,               // pedido mostra o nome da poção após 2 erros
  // v1.4 — dias de atendimento
  DAY_FIRST_CUSTOMERS: 3,               // clientes no dia 1
  DAY_GROWTH: 1,                        // +1 cliente a cada dia
  DAY_MAX_CUSTOMERS: 8,                 // teto de clientes por dia
  NOVEL_CHANCE: 0.35,                   // chance de um pedido pedir receita fora do caderno
  NOVEL_BONUS: 8,                       // moedas extras por atender um pedido inédito
  NOVEL_XP: 4,                          // XP extra por atender um pedido inédito
  // dia a partir do qual cada raridade pode ser pedida como receita nova
  RARITY_FROM_DAY: Object.freeze({ comum: 1, incomum: 2, rara: 3 }),
  // v1.27 — aluguel fixo cobrado ao fechar o dia (substitui a despesa crescente da v1.9).
  // Simulado na v1.26: o casual nunca deve, o lento deve em ~7% das partidas e quase sempre se recupera,
  // e quem manda todo mundo embora perde no dia 6.
  RENT_FREE_DAYS: 1,                    // o dia 1 (tutorial) não paga aluguel
  RENT_PER_DAY: 15,                     // aluguel fixo por dia, do fechamento do dia 2 em diante
  DEBT_CLOSES: 3,                       // fechamentos seguidos devendo até o senhorio vir cobrar
  DOUBLE_CHANCE: 1 / 3,                 // Alambique Duplo
  GREENHOUSE: Object.freeze(['agua', 'planta', 'cogumelo']), // Estufa de Ervas
  // v1.14 — balanceamento: vender no balcão rende menos que entregar um pedido
  SHELF_RATE: 0.6,                      // poção vendida avulsa: 60% do preço (abaixo do custo dos ingredientes)
  // v1.14 — paciência dos clientes (dificuldade progressiva e suave)
  PATIENCE_FROM_DAY: 3,                 // dias 1 e 2: freguesia sem pressa (aprendizado)
  PATIENCE_START_S: 140,                // paciência no dia 3, em segundos
  PATIENCE_STEP_S: 7,                   // −7 s a cada dia
  PATIENCE_MIN_S: 90,                   // piso (dia 11 em diante)
  PATIENCE_NOVEL: 1.75,                 // receita nova: o cliente espera 75% mais (v1.26: era 50%; com 24 receitas há mais o que experimentar)
  QUEUE_DRAIN: 0.25,                    // quem espera na fila perde paciência a 1/4 da velocidade
  TIP_FAST: 3,                          // gorjeta por atender com mais da metade da paciência
  TIP_FAST_RATIO: 0.5,
  WALKOUT_FAME: 2,                      // cliente que cansa de esperar: −2 de fama (mandar embora custa 1)
  PERFECT_PER_CUSTOMER: 2,              // dia perfeito (ninguém saiu sem poção): 2 moedas por cliente
  PERFECT_FAME: 1,                      // e +1 de fama
  // v1.16 — sorteio ponderado dos pedidos (mais variedade, sem repetir o último)
  RARITY_WEIGHT: Object.freeze({ comum: 3, incomum: 2, rara: 1.5 }), // conhecidas: comuns saem mais
  WEIGHT_ASKED_TODAY: 0.1,              // já pedida hoje: quase não volta
  RECENT_MEMORY: 6,                     // lembra as 6 últimas poções pedidas (entre dias)
  WEIGHT_RECENT: 0.25,                  // a mais recente pesa 25%, as anteriores um pouco mais
  WEIGHT_RECENT_STEP: 0.1,
  WEIGHT_SAME_INGREDIENT: 0.3,          // usa ingrediente do pedido logo à frente: pesa menos
  WEIGHT_CANT_BREW: 0.6,                // conhecida mas sem ingredientes nem frasco: pesa menos
  // v1.23 — a mercadora também espera, mas com folga: 4 minutos de noite, e o relógio dela
  // para enquanto o livro-caixa ou a banca dela estão abertos (só corre se você for fazer outra coisa)
  MERCHANT_PATIENCE_S: 240,
  // v1.26 — a mercadora leva o Lodo Instável (calafeto, adubo, tinta de bruxa): paga mais que a prateleira, com limite por noite
  MERCHANT_SLUDGE_PRICE: 3,
  MERCHANT_SLUDGE_MAX: 3,
});

// v1.14 — fama em faixas: cada faixa paga um extra por pedido e deixa a freguesia mais paciente.
export const FAME_TIERS = Object.freeze([
  { min: 0, name: L('Botica nova', 'New apothecary'), coins: 0, patience: 0 },
  { min: 10, name: L('Conhecida na ladeira', 'Known on the hill'), coins: 1, patience: 0 },
  { min: 25, name: L('Falada na vila', 'Talk of the village'), coins: 2, patience: 0.1 },
  { min: 50, name: L('Famosa no reino', 'Famous in the realm'), coins: 3, patience: 0.2 },
].map(Object.freeze));

export function fameTier(reputation) {
  const r = Number.isFinite(reputation) ? reputation : 0;
  let index = 0;
  for (let i = 0; i < FAME_TIERS.length; i++) if (r >= FAME_TIERS[i].min) index = i;
  const tier = FAME_TIERS[index];
  const next = FAME_TIERS[index + 1] || null;
  return { ...tier, index, next };
}

// Paciência-base (ms) de um cliente no dia; 0 = sem pressa.
export function patienceForDay(day) {
  const d = Number.isInteger(day) && day > 0 ? day : 1;
  if (d < CONFIG.PATIENCE_FROM_DAY) return 0;
  const s = Math.max(CONFIG.PATIENCE_MIN_S, CONFIG.PATIENCE_START_S - (d - CONFIG.PATIENCE_FROM_DAY) * CONFIG.PATIENCE_STEP_S);
  return s * 1000;
}

// Dicas: aparecem uma vez na tela e ficam guardadas na aba "Anotações" do livro.
const TIPS_PT = Object.freeze([
  { id: 'livro', title: 'O livro', text: 'Puxe a fita azul para baixo, ou toque nela, para abrir o livro: receitas, ingredientes e estas anotações.' },
  { id: 'pistas', title: 'Pistas do cliente', text: 'O cliente conta o problema, não o nome da poção. Procure no livro o ingrediente que ajuda naquilo.' },
  { id: 'mandar-embora', title: 'Mandar embora', text: 'Sem ingrediente ou sem ideia? Mandar o cliente embora custa 1 de fama e libera o balcão para o próximo.' },
  { id: 'prateleira-vazia', title: 'Prateleira vazia', text: 'Para entregar, prepare a poção no caldeirão primeiro. Se faltar ingrediente, a mercadora só vem à noite.' },
  { id: 'erro-revela', title: 'Frasco errado', text: 'Errar não gasta a poção, mas custa 1 de fama. Depois de 2 erros, o cliente diz o nome da poção.' },
  { id: 'receita-nova', title: 'Receita nova', text: 'Pedidos com o selo "Receita nova" pagam bônus e dão mais XP. Leia as pistas e experimente no caldeirão.' },
  { id: 'cartas', title: 'Cartas de ingrediente', text: 'Toque numa carta para pôr no caldeirão.' + (IS_DEMO ? '' : ' Vale repetir a mesma carta duas vezes.') },
  { id: 'misturar', title: 'Misturar', text: 'Com duas cartas no caldeirão, toque em Misturar. Dupla errada vira Lodo: vale 1 moeda (a mercadora paga 3 à noite) e fica no grimório para você não repetir.' + (IS_DEMO ? '' : ' Alguns ingredientes aguentam ir duas vezes ao caldeirão.') },
  { id: 'propriedades', title: 'Propriedades', text: 'Junte duas propriedades que combinem com o problema do cliente.' },
  { id: 'mercadora', title: 'A mercadora', text: 'Ingredientes só se compram à noite, com a mercadora. Compre pensando nos clientes do dia seguinte. Ela espera uns 4 minutos (o relógio para enquanto a banca dela está aberta) e depois segue viagem até a noite seguinte. Ela também leva até 3 Lodos por noite, a 3 moedas cada.' },
  { id: 'despesas', title: 'Aluguel', text: 'Do dia 2 em diante, a botica paga 15 moedas de aluguel ao fechar o dia. Se a bolsa não alcançar, o que faltar fica na conta do senhorio. Três fechamentos seguidos devendo e ele vem cobrar: sem como pagar, a botica fecha.' },
  { id: 'paciencia', title: 'Freguesia com pressa', text: 'Do dia 3 em diante, a vela acesa no balcão mostra a paciência do cliente. Atender com mais da metade da vela rende gorjeta; se ela apagar, o cliente vai embora (−2 de fama). Quem espera na fila se cansa mais devagar.' },
  { id: 'preparar-antes', title: 'Frascos de reserva', text: 'À noite não há pressa: deixe prontas na prateleira as poções que você já conhece. Assim sobra tempo para as receitas novas.' },
  { id: 'fama', title: 'Fama', text: 'Fama alta paga um extra em cada pedido e deixa a freguesia mais paciente. Um dia sem ninguém indo embora sem poção vale bônus e +1 de fama.' },
  { id: 'dica-gratis', title: 'Dica grátis', text: 'Nos utensílios, a vela dá uma dica grátis de tempos em tempos. A Lupa Arcana vende dicas a qualquer hora.' },
].map(Object.freeze));

const TIPS_EN = Object.freeze([
  { id: 'livro', title: 'The book', text: 'Pull the blue ribbon down, or tap it, to open the book: recipes, ingredients and these notes.' },
  { id: 'pistas', title: 'Customer clues', text: 'Customers describe their problem, not the name of the potion. Look in the book for the ingredient that helps with it.' },
  { id: 'mandar-embora', title: 'Sending away', text: 'Out of ingredients or ideas? Sending a customer away costs 1 fame and frees the counter for the next one.' },
  { id: 'prateleira-vazia', title: 'Empty shelf', text: 'To hand something over, brew the potion in the cauldron first. If you are missing an ingredient, the merchant only comes at night.' },
  { id: 'erro-revela', title: 'Wrong flask', text: 'A wrong guess doesn’t use up the potion, but it costs 1 fame. After 2 misses, the customer tells you the name of the potion.' },
  { id: 'receita-nova', title: 'New recipe', text: 'Orders with the "New recipe" stamp pay a bonus and give more XP. Read the clues and experiment in the cauldron.' },
  { id: 'cartas', title: 'Ingredient cards', text: 'Tap a card to put it in the cauldron.' + (IS_DEMO ? '' : ' You can use the same card twice.') },
  { id: 'misturar', title: 'Mixing', text: 'With two cards in the cauldron, tap Mix. A wrong pair turns into Sludge: it’s worth 1 coin (the merchant pays 3 at night) and stays in the grimoire so you don’t repeat it.' + (IS_DEMO ? '' : ' Some ingredients can go into the cauldron twice.') },
  { id: 'propriedades', title: 'Properties', text: 'Combine two properties that match the customer’s problem.' },
  { id: 'mercadora', title: 'The merchant', text: 'Ingredients can only be bought at night, from the merchant. Buy with the next day’s customers in mind. She waits about 4 minutes (the clock stops while her stall is open) and then travels on until the next night. She also takes up to 3 Sludges a night, at 3 coins each.' },
  { id: 'despesas', title: 'Rent', text: 'From day 2 on, the apothecary pays 15 coins of rent when the day closes. If your purse falls short, the rest goes on the landlord’s tab. Three closings in a row in debt and he comes to collect: if you can’t pay, the apothecary closes.' },
  { id: 'paciencia', title: 'Customers in a hurry', text: 'From day 3 on, the lit candle on the counter shows the customer’s patience. Serving them with more than half the candle left earns a tip; if it goes out, the customer leaves (−2 fame). Those waiting in line tire more slowly.' },
  { id: 'preparar-antes', title: 'Spare flasks', text: 'There’s no rush at night: brew the potions you already know and leave them on the shelf. That way you’ll have time for the new recipes.' },
  { id: 'fama', title: 'Fame', text: 'High fame pays extra on every order and makes customers more patient. A day with nobody leaving without a potion earns a bonus and +1 fame.' },
  { id: 'dica-gratis', title: 'Free hint', text: 'Among the tools, the candle gives a free hint every so often. The Arcane Lens sells hints at any time.' },
].map(Object.freeze));

export const TIPS = EN ? TIPS_EN : TIPS_PT;

// Aluguel cobrado ao fechar o dia `day` (v1.27: valor fixo, o dia do tutorial é grátis).
export function upkeepForDay(day) {
  const d = Number.isInteger(day) && day > 0 ? day : 1;
  return d > CONFIG.RENT_FREE_DAYS ? CONFIG.RENT_PER_DAY : 0;
}

export function customersForDay(day) {
  const d = Number.isInteger(day) && day > 0 ? day : 1;
  return Math.min(CONFIG.DAY_MAX_CUSTOMERS, CONFIG.DAY_FIRST_CUSTOMERS + (d - 1) * CONFIG.DAY_GROWTH);
}

const INGREDIENT_MAP = new Map(INGREDIENTS.map((i) => [i.id, i]));
const RECIPE_MAP = new Map(RECIPES.map((r) => [r.id, r]));

export function recipeKey(a, b) {
  return [String(a), String(b)].sort().join('+');
}

const RECIPE_BY_KEY = new Map(RECIPES.map((r) => [recipeKey(r.a, r.b), r]));

export function getIngredient(id) {
  return (typeof id === 'string' && INGREDIENT_MAP.get(id)) || null;
}

export function getRecipe(id) {
  return (typeof id === 'string' && RECIPE_MAP.get(id)) || null;
}

export function getItem(id) {
  if (id === SLUDGE.id) return SLUDGE;
  return getRecipe(id);
}

export function findRecipe(a, b) {
  if (!getIngredient(a) || !getIngredient(b)) return null;
  return RECIPE_BY_KEY.get(recipeKey(a, b)) || null;
}
