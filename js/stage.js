// Shared visual building blocks: player identity, emblems, and the "stage screen"
// shown on the host device and on the big-screen (projector) view.
import { t, quipText, teamName } from './i18n.js';
import { sfx, burst, jolt } from './media.js';

export const SH = {
  circle: '<circle cx="12" cy="12" r="10"/>', tri: '<path d="M12 2 23 21H1z"/>', square: '<rect x="2.5" y="2.5" width="19" height="19" rx="2"/>',
  star: '<path d="m12 1.5 3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.6l-6.4 3.5L7 14l-5.3-5 7.2-.9z"/>', hex: '<path d="M12 1.5 21.5 7v10L12 22.5 2.5 17V7z"/>', diamond: '<path d="M12 1 23 12 12 23 1 12z"/>'
};
export const SHAPES = Object.keys(SH);
export const COLORS = ['#FF7A66', '#5AA9FF', '#FFD25A', '#4FE0A0', '#C38BFF', '#FF8FC7', '#56E0E0', '#FFA24C', '#A3E05A', '#8C9BFF'];
export const TEAM_COLORS = ['#FF6B5B', '#4F9DFF', '#FFC93D', '#3FD98C'];
export const TEAM_SHAPES = ['tri', 'circle', 'star', 'hex'];
const NOTES = [262, 294, 330, 392, 440];

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const ms = x => Math.round(x) + ' ms';
export const svg = s => `<svg viewBox="0 0 24 24" aria-hidden="true">${SH[s] || SH.circle}</svg>`;
export function identity(slot) {
  return { color: COLORS[slot % 10], shape: SHAPES[(slot + Math.floor(slot / 10)) % 6], f: NOTES[slot % 5] * 2 ** (Math.floor(slot / 5) % 3) };
}
export const noteOf = p => identity(p?.slot || 0).f;
export function embHTML(o, cls = '') {
  if (!o) return '';
  return o.photo ? `<span class="emb ph ${cls}"><img src="${esc(o.photo)}" alt=""></span>` : `<span class="emb ${cls}" style="color:${o.color}">${svg(o.shape)}</span>`;
}
export const teamsOn = s => (s?.teams || 0) > 0;
export const keyOf = (pid, players, s) => teamsOn(s) ? 't' + (players?.[pid]?.team ?? 0) : pid;
export function entity(key, players, s) {
  if (!key) return null;
  if (key[0] === 't' && /^t\d$/.test(key) && teamsOn(s)) { const i = +key[1]; return { name: teamName(i), color: TEAM_COLORS[i], shape: TEAM_SHAPES[i], team: true }; }
  const p = players?.[key]; return p ? { name: p.name, color: p.color, shape: p.shape, photo: p.photo } : { name: '?', color: '#888', shape: 'circle' };
}
export function ranking(st, players, s) {
  const sc = st?.scores || {};
  const keys = teamsOn(s) ? Array.from({ length: s.teams }, (_, i) => 't' + i) : Object.keys(players || {});
  return keys.map(k => ({ key: k, ...entity(k, players, s), pts: sc[k] || 0 })).sort((a, b) => b.pts - a.pts);
}

// --------------------------------------------------------------------------
// The stage. createStage(el, {mode}) → {update(ctx), actionsEl}
//   ctx = { st, players, settings, net, joinUrl, code }
export function createStage(el, { mode = 'host' } = {}) {
  el.innerHTML = `<section class="stageBox idleGlow">
    <div class="bulbs"></div>
    <div class="screenIn">
      <div class="statusRow"><div class="status"><span class="dot"></span><span class="statusText"></span></div><div class="record"></div></div>
      <div class="display"></div>
      <div class="quipRow"><div class="quip" hidden></div></div>
      <div class="timerBar" hidden><span></span></div>
      <div class="actions"></div>
      <div class="projBoard"></div>
    </div></section>`;
  const $ = s => el.querySelector(s);
  const box = $('.stageBox'), disp = $('.display'), quipEl = $('.quip'), timer = $('.timerBar'), fill = $('.timerBar span');
  let ctx = null, prev = {}, dispKey = '', quipTO = null, lastCount = null, lastTickS = null, timeoutFired = null;

  const bulbs = $('.bulbs');
  function placeBulbs() {
    const W = bulbs.clientWidth, H = bulbs.clientHeight; if (!W) return;
    const gap = 22, ins = 7, w = W - 2 * ins, h = H - 2 * ins, per = 2 * (w + h), n = Math.floor(per / gap); let out = '';
    for (let k = 0; k < n; k++) { let d = k * per / n, x, y; if (d < w) { x = ins + d; y = ins; } else if ((d -= w) < h) { x = W - ins; y = ins + d; } else if ((d -= h) < w) { x = W - ins - d; y = H - ins; } else { d -= w; x = ins; y = H - ins - d; } out += `<span style="left:${x}px;top:${y}px"></span>`; }
    bulbs.innerHTML = out;
  }
  try { new ResizeObserver(placeBulbs).observe(box); } catch (e) {}

  function setDisp(key, html) { if (key !== dispKey) { dispKey = key; disp.innerHTML = html; } }
  function showQuip(q) {
    if (!q) return; const s = ctx.settings || {};
    if (!s.quips) return;
    quipEl.textContent = quipText(q.k, q.i || 0, q.v || {});
    quipEl.hidden = false; quipEl.classList.remove('pop'); void quipEl.offsetWidth; quipEl.classList.add('pop');
    clearTimeout(quipTO); quipTO = setTimeout(() => quipEl.hidden = true, 4500);
  }
  function qCard(st, small) {
    const s = ctx.settings || {};
    if (!st.q || s.showQScreen === false) return '';
    return `<div class="qCard ${small ? 'small' : ''}"><div class="qMeta">${t('qOf', { i: (st.qi ?? 0) + 1, n: st.qTotal || '?' })}</div><div class="qText">${esc(st.q.q)}</div></div>`;
  }
  function aCard(st) {
    if (!st.q || !st.showAnswer) return '';
    return `<div class="aCard"><span class="label">${t('answer')}</span><b>${esc(st.q.a)}</b>${st.q.ref ? `<span class="ref">${esc(st.q.ref)}</span>` : ''}</div>`;
  }

  function render() {
    if (!ctx || !ctx.st) return;
    const { st, players = {}, settings: s = {} } = ctx;
    const now = ctx.net.now(), phase = st.phase;
    document.body.classList.toggle('won', phase === 'won');
    box.className = 'stageBox ' + (phase === 'won' ? 'winBulbs' : (phase === 'live' || phase === 'countdown') ? 'chase' : 'idleGlow');
    $('.status').className = 'status ' + (phase === 'live' ? 'live' : phase === 'won' ? 'won' : '');
    $('.statusText').textContent = phase === 'live' ? t('buzzersLive') : phase === 'won' ? t('answering') : phase === 'countdown' ? t('getReady') : t('roundN', { n: st.round || 1 });
    const best = st.best && entity(st.best.p, players, {});
    $('.record').innerHTML = best ? `${t('fastest')}: <b>${esc(best.name)} ${ms(st.best.ms)}</b>` : (ctx.code ? `${t('roomLabel', { c: ctx.code })} · ${Object.keys(players).length} ${t('players').toLowerCase()}` : '');

    // display
    if (phase === 'lobby') {
      setDisp('lobby', `<div class="hl slam">${esc(t('scanToJoin'))}</div><div class="sub">${t('roomLabel', { c: ctx.code })}</div>`);
    } else if (phase === 'countdown') {
      const n = Math.max(1, Math.ceil((st.goAt - now) / 650));
      if (st.goAt > now) {
        setDisp('cd' + n + st.round, `<div class="hl cnt slam">${n}</div>${qCard(st, true)}`);
        if (lastCount !== n + ':' + st.round) { lastCount = n + ':' + st.round; sfx('count', n); }
      } else setDisp('cd-go' + st.round, `<div class="hl go slam">${t('buzz')}</div>${qCard(st, true)}`);
    } else if (phase === 'live') {
      setDisp('live' + st.round + (st.out ? Object.keys(st.out).length : 0), `<div class="hl go slam">${t('buzz')}</div><div class="sub">${st.out && Object.keys(st.out).length ? t('reopened') : t('buzzersLive')}</div>${qCard(st, true)}`);
    } else if (phase === 'won') {
      const cur = (st.queue || [])[st.pos || 0];
      if (cur) {
        const e = entity(cur.k, players, s), who = players[cur.p];
        const nxt = (st.queue || []).slice((st.pos || 0) + 1).find(q => !(st.out || {})[q.k]);
        setDisp('won' + st.winAt + ':' + (st.pos || 0) + ':' + (nxt ? nxt.p : ''), `<div class="hl win slam" style="--tint:${e.color}">${embHTML(e)}${esc(e.name)}!</div>
          <div class="sub">${teamsOn(s) && who ? `<b class="nm">${esc(who.name)}</b> · ` : ''}${(st.pos || 0) === 0 ? t('buzzedIn', { ms: `<b>${ms(cur.t - st.armAt)}</b>` }) : t('nextInLine')}${nxt ? ' · ' + t('waiting', { n: esc(players[nxt.p]?.name || '?'), ms: `<b>${ms(nxt.t - cur.t)}</b>` }) : ''}${st.corrected && (st.pos || 0) === 0 ? ` · <span class="tag">${t('latencyFixed')}</span>` : ''}</div>${qCard(st, true)}`);
      }
    } else { // idle
      const body = st.q && s.showQScreen !== false ? `${qCard(st)}${aCard(st)}` : `<div class="hl ${st.showAnswer ? '' : 'slam'}">${t('roundN', { n: st.round || 1 })}</div><div class="sub">${mode === 'host' ? t('readQ') : ''}</div>${aCard(st)}`;
      setDisp('idle' + st.qi + ':' + (st.showAnswer ? 1 : 0) + ':' + st.round + (st.q ? st.q.q.length : 0), body);
    }

    // timer
    timer.hidden = phase !== 'won';
    if (phase === 'won' && st.deadline) {
      const total = (s.time || 10) * 1000, left = Math.max(0, st.deadline - now);
      fill.style.width = (left / total * 100) + '%';
      const sec = Math.ceil(left / 1000);
      if (sec <= 3 && sec > 0 && lastTickS !== sec + ':' + st.deadline) { lastTickS = sec + ':' + st.deadline; sfx('tick'); }
      if (left <= 0 && timeoutFired !== st.deadline) { timeoutFired = st.deadline; sfx('timeout'); }
    }

    // board
    $('.projBoard').innerHTML = ranking(st, players, s).slice(0, 5).map(e => `<div>${embHTML(e)}<span style="color:${e.color}">${esc(e.name)}</span> <b>${e.pts}</b></div>`).join('');

    // transitions → effects (skipped on the very first render so late joiners don't replay old moments)
    if (prev.phase === undefined) { prev = { winAt: st.winAt, phase, quipAt: st.quip?.at, evAt: st.ev?.at }; return; }
    if (st.winAt && st.winAt !== prev.winAt) {
      const cur = (st.queue || [])[st.pos || 0];
      if (cur) { const e = entity(cur.k, players, s); document.documentElement.style.setProperty('--tint', e.color); sfx('win', noteOf(players[cur.p])); requestAnimationFrame(() => { burst(disp, e.color, 130); jolt(box); }); }
    }
    if (phase !== 'won' && prev.phase === 'won' || (phase === 'idle' && prev.phase !== 'idle')) document.documentElement.style.removeProperty('--tint');
    if (phase === 'live' && prev.phase !== 'live') { document.documentElement.style.setProperty('--tint', '#3DDC97'); if (prev.phase === 'countdown' || !s.count) sfx('go'); }
    if (st.quip && st.quip.at !== prev.quipAt) showQuip(st.quip);
    if (st.ev && st.ev.at !== prev.evAt) {
      if (st.ev.type === 'correct') { sfx('correct'); const e = entity(st.ev.k, players, s); burst(disp, e?.color || '#FFD25A', 200); }
      if (st.ev.type === 'wrong') sfx('wrong');
      if (st.ev.type === 'reveal') sfx('reveal');
    }
    prev = { winAt: st.winAt, phase, quipAt: st.quip?.at, evAt: st.ev?.at };
  }
  const iv = setInterval(() => { if (ctx && ctx.st && (ctx.st.phase === 'countdown' || ctx.st.phase === 'won')) render(); }, 100);
  return {
    actionsEl: $('.actions'), boxEl: box,
    update(next) { ctx = next; render(); },
    destroy() { clearInterval(iv); }
  };
}
