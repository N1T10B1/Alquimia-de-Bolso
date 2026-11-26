// v1.30 — textos em inglês dos dados do jogo (ingredientes, receitas, falas, história, tutorial).
// O português continua nos arquivos de origem (data.js, dialogue.js, story.js); aqui fica só o
// inglês, pela mesma `id`. Quem escolhe entre os dois é idioma.js (constante EN).
// Ao criar uma receita, cliente ou fala nova em português, acrescente o inglês aqui também:
// tests/idioma.test.mjs avisa quando falta alguma coisa.

// ---------- ingredientes ----------
export const INGREDIENTS_EN = Object.freeze({
  agua: { quality: 'moist', name: 'Moon Drop', element: 'water',
    lore: 'Dew gathered on a full-moon night and kept in a blue glass flask.',
    property: 'Moist and soothing. Dilutes, cools and carries the other ingredient’s effect into the body.',
    helps: 'Wounds that won’t close, tired eyes, sleepless nights. Near something hot, it rises as mist. In a double dose, it turns to rain.' },
  fogo: { quality: 'hot', name: 'Ruby Ember', element: 'fire',
    lore: 'A coal that never goes out, taken from the bottom of an old dragon’s forge.',
    property: 'Hot and restless. Gives energy, speeds things up and makes whatever it touches stronger.',
    helps: 'Lack of strength and breath, forges and stubborn flames, winds that need a spark. In a double dose, it warms you to the bottom of your chest.' },
  planta: { quality: 'alive', name: 'Living Leaf', element: 'nature',
    lore: 'A leaf that keeps growing after it is picked; it must be watered even inside the flask.',
    property: 'Alive and regenerating. Closes, grows and strengthens.',
    helps: 'Scrapes, worn-out muscles, skin that needs a protective bark. In a double dose, it grows and never stops.' },
  cristal: { quality: 'hard', name: 'Crystal Dust', element: 'mineral',
    lore: 'Quartz ground on the whetstone; it shines like sand under the noon sun.',
    property: 'Hard and concentrated. Hardens, protects and makes light and heat more intense.',
    helps: 'Sensitive skin, a light that never goes out, a fire that isn’t hot enough. Too hard to go into the cauldron twice.' },
  sombra: { quality: 'dark', name: 'Bottled Shadow', element: 'darkness',
    lore: 'A piece of moonless night, trapped with a cork and black wax.',
    property: 'Dark and elusive. Hides, dims and fools the eyes.',
    helps: 'Slipping by unseen, vanishing from sight, putting out bothersome lights. In a double dose, the darkness swallows itself.' },
  luz: { quality: 'bright', name: 'Sun Dew', element: 'light',
    lore: 'Drops of the first morning light, gathered from the petals of a sunflower.',
    property: 'Bright and wakeful. Lights up, wakes up and clears.',
    helps: 'Dark places, blurry eyes, waking up full of energy. Next to darkness, the sky turns strange. Too strong to go into the cauldron twice.' },
  cogumelo: { quality: 'earthy', name: 'Blue Mushroom', element: 'fungus',
    lore: 'It grows deep in damp caves and glows faintly when nobody is looking.',
    property: 'Earthy and drowsy. Calms, puts you to sleep and releases spores.',
    helps: 'Insomnia, weak soil, pranks that make everyone sneeze. In a double dose, sleep lasts a whole season.' },
  vento: { quality: 'airy', name: 'Wind Feather', element: 'air',
    lore: 'A feather from a bird that never lands; it floats all the way into the flask.',
    property: 'Airy and swift. Spreads, lifts and carries the effect far away.',
    helps: 'Idle windmills, things that need to spread through the air, vanishing without a trace. In a double dose, nobody falls, they only float.' },
});

// ---------- receitas: nome e pistas (as pistas na mesma ordem do português) ----------
export const RECIPES_EN = Object.freeze({
  vapor: { name: 'Smoking Mist', clues: [
    'I need a smoke screen to sneak out of my mother-in-law’s party.',
    'I want to fill the stage with fog for my magic act.',
    'The ghosts in the play need a really spooky mist.',
    'I want to vanish into a warm cloud when the debt collector knocks.',
  ] },
  cura: { name: 'Healing Elixir', clues: [
    'I fell off the roof fixing the chimney and scraped both knees.',
    'My arm won’t stop hurting after a fight with a wild boar.',
    'I cut my hand peeling potatoes for a hundred guests.',
    'The miller’s goose pecked me and the wound won’t close.',
  ] },
  vigor: { name: 'Vigor Tonic', clues: [
    'I have to plow the whole field before sunset and I can’t go on.',
    'The village race is tomorrow and my legs feel like jelly.',
    'I’ll be carrying sacks of wheat all day and my back already complains.',
    'I’m dancing three nights in a row at the harvest feast and I need stamina.',
  ] },
  brilho: { name: 'Sparkling Essence', clues: [
    'The mine where I work is too dark; I need something that shines without fire.',
    'I want my cloak to glitter like the stars at the queen’s ball.',
    'I dropped a ring down the well and I need a light that won’t go out underwater.',
    'My boat comes in before dawn; I want a pocket lighthouse that twinkles.',
  ] },
  invisibilidade: { name: 'Invisible Veil', clues: [
    'I need to get past the castle guards without anyone seeing me.',
    'I want to spy on the rival team’s practice without anyone noticing.',
    'I’m sneaking into the palace kitchen for a slice of pie, leaving no trace.',
    'I wish not even my own mirror could find me, just for one afternoon.',
  ] },
  sono: { name: 'Sleep Tea', clues: [
    'I haven’t slept in three nights: the neighbor’s rooster won’t let me.',
    'My baby dragon won’t go to sleep no matter what.',
    'The twins in the house cry all night long; I need some quiet.',
    'I toss and turn in bed counting sheep until the sun comes up.',
  ] },
  chamaazul: { name: 'Blue Flame', clues: [
    'My forge won’t get hot enough to melt this stubborn metal.',
    'I need a fire that stays lit even in the rain.',
    'I want a sapphire-colored flame for the temple ceremony.',
    'The castle fireplace keeps going out in the north wind.',
  ] },
  raiz: { name: 'Rootskin', clues: [
    'I’m crossing a field of thorns and my skin is sensitive.',
    'The swamp mosquitoes won’t leave me alone.',
    'I need skin as thick as tree bark to pick nettles.',
    'I’m pruning the enchanted rosebush that bites anyone who gets close.',
  ] },
  amanhecer: { name: 'Dawn Drops', clues: [
    'My eyes are so tired; everything looks blurry.',
    'I need to wake up early and full of energy for the market.',
    'I read so much by candlelight that the letters dance on the page.',
    'My sight is cloudy and I can’t find the needle in my embroidery anymore.',
  ] },
  eclipse: { name: 'Liquid Eclipse', clues: [
    'I want to darken the sky for a moment to impress the audience.',
    'I need to put out the light in the wizard’s tower next door; it keeps me awake.',
    'I want day to turn into night in the middle of the wedding, just for one magical moment.',
    'I need a shadow so big it covers the whole square at noon.',
  ] },
  esporos: { name: 'Spore Cloud', clues: [
    'My vegetable garden is weak; I want to spread good fungi all over the soil.',
    'I want to play a prank and make the whole tavern sneeze.',
    'The mushrooms in my cellar disappeared and I need to sow them all again.',
    'I want a little cloud that makes the old miller sneeze until he laughs.',
  ] },
  tempestade: { name: 'Storm Spark', clues: [
    'My windmill hasn’t turned in weeks; I need a good gale.',
    'I want to scare the crows off the crops with thunder.',
    'The ship is stuck at sea with no wind; I need a gust with a spark.',
    'I want pocket thunder to wake up my brother, who sleeps way too much.',
  ] },
  chuva: { name: 'Bottled Rain', clues: [
    'Not a single drop has fallen on my crops in two months.',
    'The village well dried up and the cows are thirsty.',
    'I want a cloud of my own to water the garden without carrying buckets.',
    'The neighbor’s barn caught fire and needs a downpour, and fast!',
  ] },
  coracao: { name: 'Dragon Heart', clues: [
    'I’m climbing the frozen mountain after the yeti and I don’t want to turn into an icicle.',
    'Snow has blocked my door and I’m out of firewood; I need a warmth that comes from within.',
    'I’m diving into the frozen lake to get back the ring that fell in.',
    'My feet are always cold, even with three pairs of socks.',
  ] },
  broto: { name: 'Runaway Sprout', clues: [
    'My beanstalk needs to reach the clouds by tomorrow.',
    'The goats ate the castle hedge; I need it whole again before the ball.',
    'I planted pumpkins for the harvest contest, and it’s in two days.',
    'I want a vine that climbs all the way to the highest tower window.',
  ] },
  pluma: { name: 'Feather Feet', clues: [
    'I have to climb down the mine’s ravine and I’m terrified of heights.',
    'I want to jump off the bell tower at the patron saint’s feast and land like a leaf.',
    'I want to walk on fluffy snow without sinking to my waist.',
    'My cat climbed the tallest roof in the village and I’m going to get it.',
  ] },
  urso: { name: 'Bear’s Slumber', clues: [
    'I hate the cold. I want to sleep until the whole winter is over.',
    'The mountain dragon wakes up grumpy; I need it to sleep all season.',
    'My pet bear forgot to hibernate and is wrecking the kitchen.',
    'I’ll spend months on a ship and I’d like to sleep through the whole voyage, all at once.',
  ] },
  brisa: { name: 'Sea Breeze', clues: [
    'I get seasick even in a little lake boat… and tomorrow I have to cross the sea.',
    'Every time I get on the cart, my stomach turns somersaults.',
    'I’m going to my grandparents’ island and I turn green just thinking about the waves.',
    'The swaying of the ship’s hammock makes me dizzy all night.',
  ] },
  gelo: { name: 'Everlasting Ice', clues: [
    'The cheese for the king’s banquet can’t spoil this summer.',
    'I want ice cream at the wedding, and we’re in the middle of a heat wave.',
    'The fish I caught needs to reach the capital’s market nice and fresh.',
    'I need to freeze the village lake for the skating festival.',
  ] },
  fogofatuo: { name: 'Will-o’-the-Wisp', clues: [
    'I want to scare the boys who steal my apples.',
    'I need little ghost lights to throw off whoever is chasing me through the forest.',
    'The village haunting night needs some really convincing lost souls.',
    'I want the graveyard to glow so that nobody dares to go in.',
  ] },
  eco: { name: 'Crystal Echo', clues: [
    'My voice doesn’t reach the back of the square on the day of the show.',
    'I need to call the sheep that ran off to the other side of the valley.',
    'I’m giving the harvest speech and nobody ever hears me.',
    'I want to sing a serenade that can be heard from the top of the tower.',
  ] },
  seiva: { name: 'Golden Sap', clues: [
    'My fifty-year-old roses are dying.',
    'The old oak in the square dried up after the lightning; I want it green again.',
    'The flowers in my bridal bouquet wilted the day before the wedding.',
    'The monastery garden spent the winter without sun and it’s all yellow.',
  ] },
  arcoiris: { name: 'Pocket Rainbow', clues: [
    'I want a rainbow for my sister’s birthday.',
    'I promised the children they would see a rainbow today, and the sky is perfectly clear.',
    'I want to color the sky right when the bride walks into the chapel.',
    'They say there’s a pot of gold at the end of the rainbow. I want to check.',
  ] },
  espelho: { name: 'Black Mirror', clues: [
    'Someone is deceiving me and I want to see who it is.',
    'I feel there’s something hidden in my house, and I can’t find it.',
    'I want to see what the tower wizard hides behind the curtain.',
    'I need to find out which of my partners ran off with the coins from the chest.',
  ] },
});

// ---------- falas dos clientes ----------
export const LINES_EN = Object.freeze({
  'bruxa-ofelia': {
    greet: [
      'My herbs ran out, so I came knocking on your door.',
      'Good afternoon, fellow cauldron-stirrer. Today my spell needs a boost.',
      'Don’t tell the witches’ council I bought a ready-made potion, will you?',
      'My cat ran off with the broom, so I walked here. Listen:',
      'I smelled good alchemy from around the corner. I have a problem:',
    ],
    thanks: [
      'Oh, I’m copying this recipe into my grimoire. Thank you!',
      'Perfect. Not even I could do better, and I’ve been trying for a hundred years.',
      'I’ll be back tomorrow with more orders, you can bet on it.',
    ],
    sad: ['Hmm, that smell isn’t what I asked for, dear.', 'Close! But a witch knows the right potion by its steam.'],
    leave: ['That’s fine, I’ll improvise with toad and nettle myself.', 'I’ll come back when your shelves are fuller.'],
  },
  'cavaleiro-tadeu': {
    greet: [
      'Greetings! I come on an urgent quest.',
      'For the honor of the realm, I need your help.',
      'My armor creaks, but the problem is something else:',
      'The king sent me here with a list. Well, with a request:',
      'Good afternoon! I promise not to track road mud on your floor.',
    ],
    thanks: [
      'May the bards sing of your apothecary!',
      'Quest complete, thanks to you.',
      'I owe you one, apothecary. On my word as a knight.',
    ],
    sad: ['With all due respect, this won’t serve my quest.', 'Hmm, I think there’s been a mix-up with the flask.'],
    leave: ['I understand. A knight knows how to wait.', 'I’ll ride on without the potion, then. May luck be with me.'],
  },
  'fada-lumi': {
    greet: [
      'Hi, hi! I flew all the way here!',
      'Psst! I came in through the window, sorry about the fairy dust.',
      'The queen of the flowers sent me. I have a teeny-tiny request:',
      'What a lovely shop! It shines almost as much as I do. Look:',
      'I brought you some dew as a gift. And a request:',
    ],
    thanks: ['Yay! I’m telling every flower in the woods!', 'How pretty! It shines just the way I wanted.', 'You’re truly magical!'],
    sad: ['Oh… that’s not quite it. But I’ll explain again!', 'This flask doesn’t shine the right way.'],
    leave: ['That’s okay, I’ll fly back another day!', 'Oh, too bad. But your shop is still lovely.'],
  },
  'anao-baltazar': {
    greet: [
      'Bah! Came straight from the mine, didn’t even wash my hands.',
      'I came down the mountain just for this, so make it worth it.',
      'I’ve got gold, I’ve got no time and I’ve got a problem.',
      'My cousins said the service here is good. Let’s see:',
      'No beating around the bush, my pickaxe is waiting:',
    ],
    thanks: ['Ha! That’s a master’s work.', 'Worth every nugget. Until next time!', 'I’ll recommend this place to the whole clan.'],
    sad: ['Bah! This isn’t even good for greasing a mine cart.', 'You missed the vein, apothecary. Listen again:'],
    leave: ['Humph. I’ll be back when you have what I need.', 'I’ll try the other mountain, then.'],
  },
  'bardo-cirilo': {
    greet: [
      'O apothecary, hear my song… I mean, my request!',
      'I composed a ballad about your shop. But first:',
      'La-la-la! What wonderful acoustics this shop has. Well:',
      'Every good story starts with a problem. Mine is this:',
      'I’m back from a tavern tour and I need rescuing.',
    ],
    thanks: ['I’ll write three verses about this potion!', 'Bravo! What a happy ending for my story.', 'My audience will love it. Thank you!'],
    sad: ['Off-key! That wasn’t the right note.', 'Hmm, this potion doesn’t rhyme with my problem.'],
    leave: ['A sad ballad, but I’ll keep singing.', 'We’ll leave it for the next verse, then.'],
  },
  'vovo-quiteria': {
    greet: [
      'Oh, my knees… let me tell you what I need.',
      'I brought you some cornbread, dear. And a request:',
      'In my day we did all this with tea. But here we go:',
      'My grandson says you’re very clever. So help me out:',
      'Sit here a minute and listen to Granny:',
    ],
    thanks: ['Bless you, my dear.', 'Such golden hands! I’ll bring more cake.', 'This reminds me of my mother’s apothecary. Thank you!'],
    sad: ['Oh, dear, I think you got mixed up.', 'Not that one, no. Granny will explain slowly:'],
    leave: ['That’s all right, Granny will come back tomorrow.', 'No harm done, I’ll make do with a cup of tea.'],
  },
  'elfo-anselmo': {
    greet: [
      'Greetings beneath the light of dusk.',
      'The trees whispered the name of your apothecary.',
      'I traveled three moons to get here. Listen:',
      'Forgive me for visiting unannounced. It is urgent:',
      'Such a pure scent of herbs. Perhaps you can help me.',
    ],
    thanks: ['The stars smile upon your work.', 'Perfect as the first leaf of spring.', 'My people will remember this favor.'],
    sad: ['This essence does not speak to my problem.', 'A lovely potion, but not the one I seek.'],
    leave: ['The time of elves is long. I shall return.', 'I go on my way. May your herbs flourish.'],
  },
  'pirata-dorotea': {
    greet: [
      'Arr! I dropped anchor here for a good reason.',
      'I left the parrot on the ship so it wouldn’t steal anything. Listen:',
      'I’ve got coins from three kingdoms and a problem from just one:',
      'The tide is rising, so talk fast and help me out:',
      'Ahoy, apothecary! The sea brought me to your door.',
    ],
    thanks: ['Arr! That’s worth a treasure chest!', 'I’ll tell the whole crew.', 'Fair winds to you, apothecary!'],
    sad: ['Arr, this is bilge water!', 'Wrong heading, sailor. Listen again:'],
    leave: ['I’ll look in another port, then.', 'The tide waits for no one. Until the next voyage!'],
  },
  'gato-falante': {
    greet: [
      'Meow. Yes, I talk. Now, down to business:',
      'Don’t look at me like that, cats have problems too.',
      'I knocked three flasks off your shelf just to get attention. Listen:',
      'I pay in fish or in coins, your choice. I need this:',
      'Meow. I’ll be brief, I have a nap scheduled.',
    ],
    thanks: ['Purr. Acceptable. Very acceptable.', 'You have earned my feline respect.', 'I shall sleep on your counter out of gratitude.'],
    sad: ['Meow?! That’s not even close to what I asked for.', 'Wrong. I’ll knock over another flask in protest.'],
    leave: ['Humph. Cats know how to wait. Or sleep.', 'I’ll be back tomorrow. Maybe. If I feel like it.'],
  },
});

export const NOVEL_HINTS_EN = Object.freeze([
  'They say nobody in the village knows how to make this yet.',
  'I know it’s something new, but I pay well for novelty.',
  'I don’t think it’s even in the books. Are you up for inventing it?',
]);

export const MERCHANT_LINES_EN = Object.freeze([
  'End of the workday! I brought fresh ingredients from the road.',
  'Good evening, apothecary. The cart came in full today.',
  'I know it’s been a long day. How about restocking for tomorrow?',
  'Herbs, crystals, bottled shadows… take your pick.',
  'I made it before the rain! What will you take today?',
]);

export const IMPATIENT_LINES_EN = Object.freeze([
  'I waited as long as I could. Maybe I’ll come back another day.',
  'The candle went out and so did my patience. Good day!',
  'I have better things to do than wait at the counter.',
  'I’ll try the market in the next town. Goodbye!',
  'Not a single little flask in all this time? What a shame.',
]);

export const HURRY_LINES_EN = Object.freeze([
  'Is this going to take long?',
  'Hmm… the sun is already going down.',
  '(drums fingers on the counter)',
  'I’m in a bit of a hurry, you know?',
]);

export const MERCHANT_HURRY_LINES_EN = Object.freeze([
  'The road to the next village is long… are you buying anything?',
  'The donkeys are getting restless. Make up your mind, apothecary!',
  'I’ll be closing the stall soon, you know?',
]);

export const MERCHANT_BYE_LINES_EN = Object.freeze([
  'Well, the road is calling. See you tomorrow night!',
  'I’m closing the stall for today. I’ll come by again tomorrow!',
  'I can’t wait any longer: I have a delivery up in the hills. See you tomorrow!',
]);

// Fim da demo: a Mestra Benvinda escreve do mar. `r` = demoSummary(state).
export function demoLetterEN(r) {
  const all = r.found >= r.total;
  return {
    greeting: 'My dear,',
    paragraphs: [
      all
        ? `Zuleica came by with her cart and told me: all ${r.total} pages of the notebook are already written. It took me a whole winter. It took you ${r.day} days.`
        : `Zuleica came by with her cart and told me you’ve already written ${r.found} of the ${r.total} recipes in ${r.day} days. With no one to teach you, just the cauldron and the herbarium.`,
      'Granny Quitéria keeps telling everyone in the square that her hand healed faster than with my potions. I felt jealous and proud, in that order.',
      'The sea is bigger than I thought, and the sand smells of things that don’t have a name yet. I think the notebook will still need many more pages.',
      'Take care of the cauldron. I’ll write again soon.',
    ],
    signature: 'Benvinda',
  };
}

// ---------- história e tutorial ----------
export const MENTOR_EN = Object.freeze({ name: 'Mistress Benvinda', village: 'Crooked Hill' });

export const STORY_PAGES_EN = Object.freeze({
  chegada: {
    kicker: 'Crooked Hill, forty winters ago',
    title: 'It all fit in a pocket',
    text: [
      'A wandering alchemist named Benvinda arrived in the village with everything she owned in her coat pocket: a cauldron the size of a teacup, eight little flasks and a bundle of herbs.',
      'She cured the miller’s son of his fever right there in the square. After that, the village never let her leave.',
    ],
  },
  botica: {
    kicker: 'Between the bakery and the old wall',
    title: 'The smallest apothecary in the village',
    text: [
      'The only empty spot was a narrow nook where brooms used to be kept. Benvinda hung a crooked sign on the door and wrote: Alquimia de Bolso, “Pocket Alchemy”.',
      'For forty years, all sorts came to the counter: witches out of herbs, knights on quests, dwarves from the mine, fairies through the window and even a cat that talks.',
    ],
  },
  caderno: {
    kicker: 'A written recipe is a forgotten recipe',
    title: 'The blank notebook',
    text: [
      'The Mistress knew the twelve potions by heart and never wrote a single one down. She used to say the hand only learns when it makes mistakes.',
      'For her apprentices, she left a notebook with twelve empty pages. Only in the last leaves, the herbarium, did she write down everything about the eight ingredients: where they come from, what they do and what they are good for.',
    ],
  },
  partida: {
    kicker: 'Last autumn',
    title: 'The key changes hands',
    text: [
      'Benvinda decided she was too old for the counter and left to see the sea, which she had never seen.',
      'Before leaving, she gave the key to the apothecary to an apprentice. To you.',
    ],
  },
});

export const LETTER_EN = Object.freeze({
  greeting: 'My dear,',
  paragraphs: [
    'The apothecary is yours now. I left no recipes at all, on purpose. You’ll discover the twelve the way I did: by putting two things together and paying attention to what comes out of the cauldron.',
    'There will be sludge. Lots of sludge. Sludge is every apprentice’s first work, and it’s still worth a coin.',
    'Listen to the customers. Nobody knows the name of the potion they want, but everyone can tell you the problem they have. The problem is the clue. When you don’t know where to start, turn the notebook over and read the herbarium.',
    'I left three flasks of each ingredient and forty coins. In the late afternoon, Zuleica comes by with her cart. Buy from her and tell her I sent you.',
    'Take care of the cauldron. It’s older than both of us.',
  ],
  signature: 'Benvinda',
});

export const TUTORIAL_NOTES_EN = Object.freeze({
  balcao: {
    title: 'The first customer',
    text: 'This is Granny Quitéria, the apothecary’s oldest customer. Notice: she doesn’t say the name of the potion, she only tells you the problem. A cut hand calls for something that closes the wound.',
    action: 'Got it',
  },
  livro: {
    title: 'Read before you mix',
    text: 'Tap the Book ribbon up top, or drag the screen down. That’s where the recipes and my herbarium are kept.',
  },
  herbario: {
    title: 'The herbarium',
    text: 'The recipe pages are empty, I know. Open the Ingredients tab: each one has a quality and says what it helps with.',
  },
  ler: {
    title: 'Moist with alive',
    text: 'For a wound, combine what is moist with what is alive: the Moon Drop carries the effect into the body and the Living Leaf closes and makes things grow. Now close the book.',
    action: 'Close the book',
  },
  caldeirao: {
    title: 'The cauldron',
    text: 'Tap the cauldron, or Mix in the cauldron, to open the workbench.',
  },
  misturar: {
    title: 'Two cards, one mixture',
    text: 'Tap the Moon Drop and the Living Leaf to put both in the cauldron. Then tap Mix.',
  },
  lodo: {
    title: 'Sludge!',
    text: 'See? Sludge is every apprentice’s first work, and it’s still worth a coin on the shelf. Now try the Moon Drop with the Living Leaf.',
  },
  outra: {
    title: 'A new page',
    text: 'You discovered a recipe, and it’s in the notebook forever. But it’s not what Granny needs: try the Moon Drop with the Living Leaf.',
  },
  descoberta: {
    title: 'The first page',
    text: 'The Healing Elixir is in the notebook, and now it’s on the shelf. Go back to the counter and hand the flask to Granny.',
    action: 'Back to the counter',
  },
  entregar: {
    title: 'Hand over the flask',
    text: 'Tap Give potion and choose the Healing Elixir.',
  },
  sozinha: {
    title: 'Now it’s up to you',
    text: 'The other customers of the day are in line, with no notes from me. Ingredients can’t be bought during the day: if you run out, you can send the customer away, but the apothecary’s fame drops a little.',
    action: 'Leave it to me',
  },
  zuleica: {
    title: 'Zuleica has arrived',
    text: 'She’s been my supplier for thirty years. She only sells at the end of the day, so buy with tomorrow’s orders in mind.',
    quote: 'So you’re Benvinda’s apprentice. She always paid on time. Let’s see about you.',
  },
  banca: {
    title: 'Buy carefully',
    text: 'Each flask costs 4 or 5 coins. Save some coins for tools too, like the lens, which help you discover recipes.',
    action: 'Got it',
  },
  amanha: {
    title: 'When you’re ready',
    text: 'Tap Open the shop to start day 2. More people come tomorrow.',
  },
});

export const TUTORIAL_END_EN = Object.freeze({
  title: 'The first day is over',
  text: 'From now on, I won’t leave any more notes. The apothecary is truly yours.',
  tips: [
    'Read the customer’s problem and look in the herbarium for the ingredient that helps.',
    'Sludge is worth a coin. Every mistake is written down, and the cauldron warns you before you repeat it.',
    'The candle, among the tools, gives a free hint every now and then.',
    'More customers come each day. Discover the twelve recipes to complete the notebook.',
  ],
  action: 'Open the shop',
});
