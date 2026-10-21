// Sounds (synthesised, no audio files) and visual effects (confetti, shockwaves).
const rnd = a => a[Math.floor(Math.random() * a.length)];
let actx = null, nb = null;
export const audio = { mode: 'classic', enabled: true };

export function unlockAudio() { try { ac(); } catch (e) {} }
function ac() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  if (actx.state === 'suspended') actx.resume();
  return actx;
}
function osc({ f = 440, f1, type = 'square', d = .2, v = .06, at = 0, vib = 0, vr = 6 }) {
  try {
    const a = ac(), t = a.currentTime + at, o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + d);
    if (vib) { const l = a.createOscillator(), lg = a.createGain(); l.frequency.value = vr; lg.gain.value = vib; l.connect(lg).connect(o.frequency); l.start(t); l.stop(t + d); }
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + d + .03);
  } catch (e) {}
}
function noise({ d = .08, v = .05, at = 0, f = 1500, q = 1 }) {
  try {
    const a = ac();
    if (!nb) { nb = a.createBuffer(1, a.sampleRate, a.sampleRate); const c = nb.getChannelData(0); for (let k = 0; k < c.length; k++) c[k] = Math.random() * 2 - 1; }
    const s = a.createBufferSource(), bp = a.createBiquadFilter(), g = a.createGain(), t = a.currentTime + at;
    s.buffer = nb; bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = q;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    s.connect(bp).connect(g).connect(a.destination); s.start(t, Math.random() * .5, d + .05);
  } catch (e) {}
}
const applause = (n = 70, start = .2, len = 1.6) => { for (let k = 0; k < n; k++) noise({ d: .05, v: .02 + Math.random() * .04, at: start + Math.random() * len, f: 1200 + Math.random() * 2800, q: .8 }); };
const FUN = {
  boing: f => osc({ f: f / 2, f1: f * 1.6, type: 'sine', d: .38, v: .13, vib: 40, vr: 18 }),
  quack: f => { osc({ f: f * 1.4, f1: f * .7, type: 'sawtooth', d: .14, v: .07 }); osc({ f: f * 1.4, f1: f * .6, type: 'sawtooth', d: .16, v: .07, at: .16 }); },
  kazoo: f => osc({ f, type: 'sawtooth', d: .32, v: .05, vib: 14, vr: 8 }),
  slide: () => osc({ f: 300, f1: 1500, type: 'sine', d: .4, v: .1 }),
  squeak: f => osc({ f: f * 3, f1: f * 4.5, type: 'sine', d: .12, v: .08 })
};

export function sfx(n, arg) {
  if (!audio.enabled || audio.mode === 'off') return;
  const fun = audio.mode === 'funny';
  switch (n) {
    case 'press': { const f = arg || 440; fun ? rnd(Object.values(FUN))(f) : osc({ f, type: 'triangle', d: .08, v: .06 }); break; }
    case 'win': { const f = arg || 523;
      if (fun) { osc({ f: 250, f1: 1300, type: 'sine', d: .35, v: .1 }); osc({ f: 784, d: .12, v: .05, at: .38 }); osc({ f: 1046, d: .3, v: .05, at: .52 }); }
      else { [1, 1.25, 1.5, 2].forEach((m, k) => osc({ f: f * m, d: .22, v: .055, at: k * .08 })); osc({ f: f / 2, type: 'sawtooth', d: .5, v: .035 }); }
      break; }
    case 'correct':
      if (fun) { [523, 659, 784].forEach(f => osc({ f, d: .15, v: .035 })); [659, 784, 1046].forEach(f => osc({ f, d: .6, v: .035, at: .18 })); applause(); }
      else [784, 988, 1175, 1568].forEach((f, k) => osc({ f, type: 'triangle', d: .2, v: .07, at: k * .07 }));
      break;
    case 'wrong':
      if (fun) { [392, 370, 349].forEach((f, k) => osc({ f, type: 'sawtooth', d: .36, v: .05, at: k * .38, vib: 3, vr: 5 })); osc({ f: 330, type: 'sawtooth', d: 1.1, v: .05, at: 1.14, vib: 9, vr: 6 }); }
      else { osc({ f: 196, type: 'sawtooth', d: .25, v: .06 }); osc({ f: 147, type: 'sawtooth', d: .45, v: .06, at: .2 }); }
      break;
    case 'early': if (fun) { osc({ f: 520, f1: 90, type: 'sine', d: .25, v: .14 }); noise({ d: .04, v: .08, f: 700 }); } else osc({ f: 140, type: 'sawtooth', d: .2, v: .05 }); break;
    case 'timeout': if (fun) { osc({ f: 220, d: .22, v: .06 }); osc({ f: 208, d: .45, v: .06, at: .26 }); } else osc({ f: 200, type: 'sawtooth', d: .5, v: .06 }); break;
    case 'tick': fun ? osc({ f: 1200, f1: 900, type: 'triangle', d: .05, v: .09 }) : osc({ f: 880, type: 'sine', d: .06, v: .05 }); break;
    case 'count': fun ? osc({ f: 500 + arg * 80, f1: 900 + arg * 80, type: 'sine', d: .1, v: .09 }) : osc({ f: arg === 1 ? 660 : 440, d: .12, v: .06 }); break;
    case 'go': fun ? (FUN.slide(), osc({ f: 1318, type: 'triangle', d: .2, v: .06, at: .35 })) : osc({ f: 1046, d: .16, v: .06 }); break;
    case 'join': osc({ f: 660, f1: 990, type: 'sine', d: .12, v: .05 }); break;
    case 'reveal': osc({ f: 523, type: 'triangle', d: .12, v: .05 }); osc({ f: 784, type: 'triangle', d: .25, v: .05, at: .1 }); break;
    case 'podium':
      [523, 659, 784, 1046, 784, 1046].forEach((f, k) => osc({ f, type: fun ? 'sawtooth' : 'square', d: k === 5 ? .7 : .16, v: .05, at: k * .13, vib: fun ? 6 : 0 }));
      if (fun) applause(90, .4, 2);
      break;
  }
}

export function buzzVibe(ms = 30) { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} }

// ---- confetti + shockwaves on a fixed canvas ----
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let cv, cx, parts = [], waves = [], raf = null;
const PALETTE = ['#FF7A66', '#5AA9FF', '#FFD25A', '#4FE0A0', '#C38BFF', '#FF8FC7', '#56E0E0', '#FFA24C', '#ffffff'];
function ensureCanvas() {
  if (cv) return;
  cv = document.createElement('canvas'); cv.id = 'fx'; cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv); cx = cv.getContext('2d');
  const fit = () => { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; };
  fit(); addEventListener('resize', fit);
}
export function burst(el, color, n = 120) {
  if (reduce || !el) return; ensureCanvas();
  const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  waves.push({ x, y, r: 10, a: 1, c: color });
  const cols = [color, '#ffffff', color, '#FFE3A1'];
  for (let k = 0; k < n; k++) { const a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 9; parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, w: 5 + Math.random() * 6, h: 3 + Math.random() * 4, rot: Math.random() * 6, vr: (Math.random() - .5) * .4, c: cols[k % 4], life: 1 }); }
  if (!raf) raf = requestAnimationFrame(tick);
}
export function rain(n = 240) {
  if (reduce) return; ensureCanvas();
  for (let k = 0; k < n; k++) parts.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * .6, vx: (Math.random() - .5) * 2, vy: 2 + Math.random() * 3, w: 6 + Math.random() * 6, h: 3 + Math.random() * 4, rot: Math.random() * 6, vr: (Math.random() - .5) * .3, c: rnd(PALETTE), life: 1.6 });
  if (!raf) raf = requestAnimationFrame(tick);
}
function tick() {
  const d = devicePixelRatio; cx.setTransform(d, 0, 0, d, 0, 0); cx.clearRect(0, 0, innerWidth, innerHeight);
  waves = waves.filter(w => w.a > .02);
  waves.forEach(w => { w.r += 18; w.a *= .93; cx.strokeStyle = w.c; cx.globalAlpha = w.a; cx.lineWidth = 10 * w.a + 1; cx.beginPath(); cx.arc(w.x, w.y, w.r, 0, Math.PI * 2); cx.stroke(); });
  parts = parts.filter(p => p.life > 0 && p.y < innerHeight + 40);
  parts.forEach(p => { p.vy = Math.min(p.vy + .22, 7); p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= .006;
    cx.globalAlpha = Math.min(1, p.life * 2); cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c; cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 2))); cx.restore(); });
  cx.globalAlpha = 1;
  raf = (parts.length || waves.length) ? requestAnimationFrame(tick) : null;
  if (!raf) cx.clearRect(0, 0, innerWidth, innerHeight);
}
export function jolt(el) { if (reduce || !el) return; el.classList.remove('jolt'); void el.offsetWidth; el.classList.add('jolt'); }

let wakeLock = null;
export async function keepAwake() {
  try { if ('wakeLock' in navigator) { wakeLock = await navigator.wakeLock.request('screen'); } } catch (e) {}
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && wakeLock) keepAwake(); });
