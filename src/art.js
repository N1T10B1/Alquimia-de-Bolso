// Mapa das artes do Rafael (gerado a partir de assets/). Caminhos literais de propósito:
// o tools/build-standalone.mjs troca cada um por um data: URI no jogar.html.

export const ITEM_ART = Object.freeze({
  // v1.26 — poções novas
  'arcoiris': 'assets/itens/arcoiris.webp',
  'brisa': 'assets/itens/brisa.webp',
  'broto': 'assets/itens/broto.webp',
  'chuva': 'assets/itens/chuva.webp',
  'coracao': 'assets/itens/coracao.webp',
  'eco': 'assets/itens/eco.webp',
  'espelho': 'assets/itens/espelho.webp',
  'fogofatuo': 'assets/itens/fogofatuo.webp',
  'gelo': 'assets/itens/gelo.webp',
  'pluma': 'assets/itens/pluma.webp',
  'seiva': 'assets/itens/seiva.webp',
  'urso': 'assets/itens/urso.webp',
  'agua': 'assets/itens/agua.webp',
  'amanhecer': 'assets/itens/amanhecer.webp',
  'brilho': 'assets/itens/brilho.webp',
  'caldeirao-bancada': 'assets/itens/caldeirao-bancada.webp',
  'chamaazul': 'assets/itens/chamaazul.webp',
  'cogumelo': 'assets/itens/cogumelo.webp',
  'cristal': 'assets/itens/cristal.webp',
  'cura': 'assets/itens/cura.webp',
  'eclipse': 'assets/itens/eclipse.webp',
  'esporos': 'assets/itens/esporos.webp',
  'fogo': 'assets/itens/fogo.webp',
  'invisibilidade': 'assets/itens/invisibilidade.webp',
  'lodo': 'assets/itens/lodo.webp',
  'luz': 'assets/itens/luz.webp',
  'moeda': 'assets/itens/moeda.webp',
  'planta': 'assets/itens/planta.webp',
  'raiz': 'assets/itens/raiz.webp',
  'selo': 'assets/itens/selo.webp',
  'sino': 'assets/itens/sino.webp',
  'sombra': 'assets/itens/sombra.webp',
  'sono': 'assets/itens/sono.webp',
  'tempestade': 'assets/itens/tempestade.webp',
  'up-caldeirao': 'assets/itens/up-caldeirao.webp',
  'up-lupa': 'assets/itens/up-lupa.webp',
  'up-mercador': 'assets/itens/up-mercador.webp',
  'up-estufa': 'assets/itens/planta.webp',
  'up-alambique': 'assets/itens/caldeirao-bancada.webp',
  'vapor': 'assets/itens/vapor.webp',
  'vela': 'assets/itens/vela.webp',
  'vento': 'assets/itens/vento.webp',
  'vigor': 'assets/itens/vigor.webp',
});

export const CUSTOMER_ART = Object.freeze({
  'anao-baltazar': Object.freeze({
    neutro: 'assets/clientes/anao-baltazar-neutro.webp',
    feliz: 'assets/clientes/anao-baltazar-feliz.webp',
    triste: 'assets/clientes/anao-baltazar-triste.webp',
  }),
  'bardo-cirilo': Object.freeze({
    neutro: 'assets/clientes/bardo-cirilo-neutro.webp',
    feliz: 'assets/clientes/bardo-cirilo-feliz.webp',
    triste: 'assets/clientes/bardo-cirilo-triste.webp',
  }),
  'bruxa-ofelia': Object.freeze({
    neutro: 'assets/clientes/bruxa-ofelia-neutro.webp',
    feliz: 'assets/clientes/bruxa-ofelia-feliz.webp',
    triste: 'assets/clientes/bruxa-ofelia-triste.webp',
  }),
  'cavaleiro-tadeu': Object.freeze({
    neutro: 'assets/clientes/cavaleiro-tadeu-neutro.webp',
    feliz: 'assets/clientes/cavaleiro-tadeu-feliz.webp',
    triste: 'assets/clientes/cavaleiro-tadeu-triste.webp',
  }),
  'elfo-anselmo': Object.freeze({
    neutro: 'assets/clientes/elfo-anselmo-neutro.webp',
    feliz: 'assets/clientes/elfo-anselmo-feliz.webp',
    triste: 'assets/clientes/elfo-anselmo-triste.webp',
  }),
  'fada-lumi': Object.freeze({
    neutro: 'assets/clientes/fada-lumi-neutro.webp',
    feliz: 'assets/clientes/fada-lumi-feliz.webp',
    triste: 'assets/clientes/fada-lumi-triste.webp',
  }),
  'gato-falante': Object.freeze({
    neutro: 'assets/clientes/gato-falante-neutro.webp',
    feliz: 'assets/clientes/gato-falante-feliz.webp',
    triste: 'assets/clientes/gato-falante-triste.webp',
  }),
  'mercadora-zuleica': Object.freeze({
    neutro: 'assets/clientes/mercadora-zuleica-neutro.webp',
    feliz: 'assets/clientes/mercadora-zuleica-feliz.webp',
    triste: 'assets/clientes/mercadora-zuleica-triste.webp',
  }),
  'pirata-dorotea': Object.freeze({
    neutro: 'assets/clientes/pirata-dorotea-neutro.webp',
    feliz: 'assets/clientes/pirata-dorotea-feliz.webp',
    triste: 'assets/clientes/pirata-dorotea-triste.webp',
  }),
  'vovo-quiteria': Object.freeze({
    neutro: 'assets/clientes/vovo-quiteria-neutro.webp',
    feliz: 'assets/clientes/vovo-quiteria-feliz.webp',
    triste: 'assets/clientes/vovo-quiteria-triste.webp',
  }),
});

export function itemArt(id) {
  return ITEM_ART[id] || '';
}

export function customerArt(id, mood = 'neutro') {
  const set = CUSTOMER_ART[id];
  return set ? (set[mood] || set.neutro) : '';
}
