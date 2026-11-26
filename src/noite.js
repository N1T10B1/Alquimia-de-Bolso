// Noite em hachura de xilogravura feita por shader (v1.19). Lê o próprio fundo da loja e põe
// mais linhas de goiva onde a cena é escura e nas bordas da tela; a vela e a janela ficam limpas.
// As linhas tremem de leve quadro a quadro ("line boil"), a ~8 quadros por segundo, só à noite.
// Sem WebGL, com Qualidade "leve" ou se a imagem do fundo não puder virar textura, o jogo
// continua usando a moldura de hachura desenhada (assets/fx/noite-hachura.webp, v1.18).

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() { v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_loja;
uniform vec2 u_size;      // tamanho do canvas em px CSS
uniform vec4 u_view;      // parte visível da tela, em uv do fundo: x0, y0, x1, y1
uniform float u_seed;     // muda a cada quadro do "line boil"
uniform float u_night;    // 0 = dia, 1 = noite

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// uma camada de traços paralelos: ângulo, espaçamento em px e o tom que ela precisa cobrir
float hatch(vec2 p, float ang, float gap, float tone, float start) {
  vec2 dir = vec2(cos(ang), sin(ang));
  vec2 nrm = vec2(-dir.y, dir.x);
  float along = dot(p, dir);
  float across = dot(p, nrm) / gap;
  float row = floor(across);
  // cada traço ondula um pouco e muda de leve a cada quadro, como goiva na madeira
  float wob = (noise(vec2(along * 0.035, row * 3.1 + u_seed)) - 0.5) * 0.35;
  float d = abs(fract(across + wob) - 0.5);
  float k = clamp((tone - start) / (1.0 - start), 0.0, 1.0);
  float w = 0.07 + 0.30 * k;                       // traço engrossa onde é mais escuro
  // os traços se partem em pedaços (falhas de impressão), mais curtos onde é claro
  float brk = noise(vec2(along * 0.045 + row * 7.0, row + u_seed * 0.37));
  float on = step(1.0 - (0.35 + 0.65 * k), brk);
  float aa = 1.2 / gap;
  return (1.0 - smoothstep(w - aa, w + aa, d)) * on * step(0.001, k);
}

void main() {
  vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y);
  vec3 c = texture2D(u_loja, uv).rgb;
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  // borda da tela visível: escurece os cantos e as laterais (retângulo arredondado, não círculo)
  vec2 q = (uv - u_view.xy) / (u_view.zw - u_view.xy) * 2.0 - 1.0;
  vec2 e = max(abs(q) - vec2(0.55, 0.50), 0.0) / vec2(0.45, 0.50);
  float edge = clamp(length(e), 0.0, 1.0);
  float tone = clamp((0.42 - lum) * 1.7 + edge * 0.95, 0.0, 1.0) * u_night;
  vec2 p = uv * u_size;
  float ink = hatch(p, 0.70, 9.0, tone, 0.18);           // ~40°
  ink = max(ink, hatch(p, -0.62, 8.0, tone, 0.55));       // cruzada
  ink = max(ink, hatch(p, 1.38, 6.5, tone, 0.82));        // quase vertical, só no mais escuro
  gl_FragColor = vec4(vec3(0.10, 0.06, 0.035) * ink, ink * 0.88);
}`;

export function createNightShader(doc) {
  const win = doc.defaultView;
  const root = doc.documentElement;
  const scene = doc.getElementById('scene');
  const stage = scene && scene.querySelector('.stage');
  const bg = stage && stage.querySelector('.stage-bg');
  const counter = stage && stage.querySelector('.stage-counter');
  if (!scene || !stage || !bg || !counter) return { refresh() {} };

  let gl = null; let prog = null; let tex = null; let ready = false; let failed = false;
  let timer = 0; let night = 0; let target = 0; let seed = 0;
  let canvas = null; let front = null; let frontCtx = null;

  function wantShader() { return root.dataset.quality !== 'leve' && !failed; }

  function setMode(on) {
    root.classList.toggle('noite-shader', on && ready);
  }

  function build() {
    canvas = doc.createElement('canvas');
    canvas.className = 'noite-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    // o balcão (recorte do fundo) fica na frente do cliente: ganha uma cópia recortada da hachura
    front = doc.createElement('canvas');
    front.className = 'noite-canvas noite-canvas-balcao';
    front.setAttribute('aria-hidden', 'true');
    bg.after(canvas);
    counter.after(front);
    try {
      gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true, antialias: false, preserveDrawingBuffer: true });
    } catch { gl = null; }
    frontCtx = front.getContext('2d');
    if (!gl || !frontCtx) { fail(); return; }
    const sh = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch { fail(); return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    loadTexture();
  }

  function loadTexture() {
    const m = /url\(["']?(.*?)["']?\)/.exec(getComputedStyle(bg).backgroundImage || '');
    if (!m) { fail(); return; }
    const img = new win.Image();
    img.onload = () => {
      try {
        tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        ready = true;
        update();
      } catch { fail(); } // imagem de outra origem (ex.: index.html aberto por file://)
    };
    img.onerror = fail;
    img.src = m[1];
  }

  function fail() {
    failed = true; ready = false;
    stop();
    canvas?.remove(); front?.remove();
    setMode(false);
  }

  function resize() {
    const r = stage.getBoundingClientRect();
    const scale = Math.min(win.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(r.width * scale));
    const h = Math.max(1, Math.round(r.height * scale));
    for (const c of [canvas, front]) if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    return { r, scale };
  }

  function draw() {
    if (!ready) return;
    const { r } = resize();
    const vw = win.innerWidth; const vh = win.innerHeight;
    const view = [
      Math.max(0, -r.left / r.width), Math.max(0, -r.top / r.height),
      Math.min(1, (vw - r.left) / r.width), Math.min(1, (vh - r.top) / r.height),
    ];
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(gl.getUniformLocation(prog, 'u_size'), r.width, r.height);
    gl.uniform4f(gl.getUniformLocation(prog, 'u_view'), view[0], view[1], view[2], view[3]);
    gl.uniform1f(gl.getUniformLocation(prog, 'u_seed'), seed);
    gl.uniform1f(gl.getUniformLocation(prog, 'u_night'), night);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    frontCtx.clearRect(0, 0, front.width, front.height);
    frontCtx.drawImage(canvas, 0, 0);
  }

  function tick() {
    // a noite chega e vai embora em ~1,2 s, como o escurecimento do fundo
    night += Math.sign(target - night) * Math.min(Math.abs(target - night), 0.1);
    if (!root.classList.contains('reduce-motion')) seed = (seed + 1) % 64;
    draw();
    if (night === target && (target === 0 || root.classList.contains('reduce-motion'))) stop();
  }

  function start() { if (!timer) { tick(); timer = win.setInterval(tick, 125); } }
  function stop() { if (timer) { win.clearInterval(timer); timer = 0; } }

  function update() {
    const on = wantShader();
    if (on && !canvas && !failed) build();
    setMode(on);
    if (!on || !ready) { stop(); return; }
    target = scene.classList.contains('is-night') && !scene.closest('[hidden]') ? 1 : 0;
    if (target !== night || target === 1) start();
    else draw();
  }

  new win.MutationObserver(update).observe(scene, { attributes: true, attributeFilter: ['class'] });
  new win.MutationObserver(update).observe(root, { attributes: true, attributeFilter: ['data-quality', 'class'] });
  const app = doc.getElementById('app');
  if (app) new win.MutationObserver(update).observe(app, { attributes: true, attributeFilter: ['hidden'] });
  win.addEventListener('resize', () => { if (ready && night > 0) draw(); });
  update();
  return { refresh: update };
}
