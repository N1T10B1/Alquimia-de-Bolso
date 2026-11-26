// Mede repetição de pedidos ao longo de 10 dias: node tools/medir-variedade.mjs .
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const dir = path.resolve(process.argv[2]);
const imp = (f) => import(pathToFileURL(path.join(dir, 'src', f)).href);
const P = await imp('progression.js');
const E = await imp('engine.js');
const D = await imp('data.js');
let tot = 0, sameIng = 0, prevDayRepeat = 0, prevDayTot = 0, clueRep = 0, clueTot = 0;
for (let run = 0; run < 400; run++) {
  let s = E.createInitialState();
  s.discovered = D.RECIPES.map((r) => r.id).slice(0, 3 + (run % 10));
  let prev = null;
  let yesterday = new Set();
  const lastClue = {};
  for (let day = 1; day <= 10; day++) {
    const todaySet = new Set();
    s = P.fillOrders(s, Math.random);
    let guard = 0;
    while (s.orders.length && guard++ < 50) {
      const o = s.orders[0];
      if (prev) {
        tot++;
        const a = D.getRecipe(prev), b = D.getRecipe(o.potionId);
        if ([a.a, a.b].some((x) => [b.a, b.b].includes(x))) sameIng++;
      }
      prevDayTot++;
      if (yesterday.has(o.potionId)) prevDayRepeat++;
      clueTot++;
      if (lastClue[o.potionId] === o.clue) clueRep++;
      lastClue[o.potionId] = o.clue;
      todaySet.add(o.potionId);
      prev = o.potionId;
      if (Math.random() < 0.5) s = P.dismissOrder(s, o.id).state;
      else s = P.deliverOrder({ ...s, inventory: { [o.potionId]: 1 } }, o.id).state;
      s = P.fillOrders(s, Math.random);
    }
    s = P.closeDay(s).state;
    s = P.startNextDay(s, Math.random).state;
    yesterday = todaySet;
  }
}
const pct = (a, b) => (100 * a / b).toFixed(0) + '%';
console.log({ seguidoUsaMesmoIngrediente: pct(sameIng, tot), repeteDeOntem: pct(prevDayRepeat, prevDayTot), mesmaFraseDaUltimaVez: pct(clueRep, clueTot) });
