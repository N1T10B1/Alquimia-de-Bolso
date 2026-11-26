// Alquimia de Bolso — efeitos sonoros sintéticos (Web Audio API), curtos e baixos.
// AudioContext é criado só no primeiro play() com som habilitado (respeita autoplay). Nunca lança.

// Cada som é uma lista de notas: { f: freq inicial, to: freq final, t: início (s), d: duração (s), type, v: volume }
const SOUNDS = {
  click: [{ f: 720, to: 640, t: 0, d: 0.05, type: 'square', v: 0.18 }],
  mix: [
    { f: 220, to: 330, t: 0, d: 0.18, type: 'triangle', v: 0.35 },
    { f: 330, to: 520, t: 0.1, d: 0.18, type: 'sine', v: 0.25 },
  ],
  discover: [
    { f: 523.25, t: 0, d: 0.12, type: 'triangle', v: 0.35 },
    { f: 659.25, t: 0.09, d: 0.12, type: 'triangle', v: 0.35 },
    { f: 783.99, t: 0.18, d: 0.14, type: 'triangle', v: 0.35 },
    { f: 1046.5, t: 0.27, d: 0.28, type: 'sine', v: 0.3 },
  ],
  coin: [
    { f: 988, t: 0, d: 0.07, type: 'square', v: 0.16 },
    { f: 1319, t: 0.06, d: 0.16, type: 'square', v: 0.16 },
  ],
  error: [
    { f: 200, to: 140, t: 0, d: 0.12, type: 'sawtooth', v: 0.16 },
    { f: 150, to: 110, t: 0.11, d: 0.16, type: 'sawtooth', v: 0.14 },
  ],
};

const MASTER_VOLUME = 0.15;

export function createAudio() {
  let enabled = false;
  let ctx = null;
  let master = null;
  let unavailable = false;
  let volume = 0.5; // 0 a 1 (opção do jogador)

  function getContext() {
    if (ctx || unavailable) return ctx;
    try {
      const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!AC) { unavailable = true; return null; }
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = MASTER_VOLUME * volume * 2;
      master.connect(ctx.destination);
    } catch {
      unavailable = true;
      ctx = null;
      master = null;
    }
    return ctx;
  }

  function note(c, now, n) {
    const osc = c.createOscillator();
    const gain = c.createGain();
    const start = now + (n.t || 0);
    const end = start + n.d;
    osc.type = n.type || 'sine';
    osc.frequency.setValueAtTime(n.f, start);
    if (n.to) osc.frequency.exponentialRampToValueAtTime(n.to, end);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(n.v ?? 0.2, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    osc.connect(gain);
    gain.connect(master);
    osc.start(start);
    osc.stop(end + 0.02);
    osc.onended = () => { try { osc.disconnect(); gain.disconnect(); } catch { /* ignora */ } };
  }

  function play(name) {
    if (!enabled) return;
    try {
      const notes = SOUNDS[name];
      if (!notes) return;
      const c = getContext();
      if (!c || !master) return;
      if (c.state === 'suspended' && typeof c.resume === 'function') {
        const p = c.resume();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }
      const now = c.currentTime + 0.005;
      for (const n of notes) note(c, now, n);
    } catch {
      /* áudio é opcional: silêncio em caso de falha */
    }
  }

  return {
    setEnabled(value) { enabled = !!value; },
    isEnabled() { return enabled; },
    // volume de 0 a 100 (50 = volume original do jogo)
    setVolume(value) {
      const v = Number(value);
      volume = Number.isFinite(v) ? Math.min(1, Math.max(0, v / 100)) : 0.5;
      try { if (master) master.gain.value = MASTER_VOLUME * volume * 2; } catch { /* sem áudio */ }
    },
    play,
  };
}
