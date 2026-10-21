// Entry point: picks the view from the address.
//   #/              start screen
//   #/host          host a game (resumes your room if you reload)
//   #/join/CODE     player phone
//   #/screen/CODE   big-screen view for a projector or TV
import { initNet } from './net.js';
import { t, getLang } from './i18n.js';
import { audio, unlockAudio, keepAwake, rain } from './media.js';
import { createStage, ranking } from './stage.js';
import { $, langToggle, bindLang, applyTheme, joinUrl, shortHost, drawQR, codeTiles, podiumHTML, brandHTML } from './ui.js';
import { runHost } from './host.js';
import { runPlayer } from './player.js';
import { APP_VERSION } from './config.js';

const app = document.getElementById('app');
const ls = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };

addEventListener('hashchange', () => location.reload());

(async function boot() {
  try { applyTheme({ skin: (ls('fb.hostSettings') || {}).skin || 'studio' }); } catch (e) {}
  const net = await initNet();
  const [, route, arg] = (location.hash || '#/').replace(/^#\/?/, '#/').split('/');
  if (route === 'host') return runHost(app, net);
  if (route === 'join') return runPlayer(app, net, arg || '');
  if (route === 'screen' && arg) return runScreen(app, net, arg.toUpperCase());
  landing(net);
})().catch(e => { app.innerHTML = `<div class="card"><b>Something went wrong.</b><span class="mono">${String(e.message || e)}</span></div>`; console.error(e); });

function landing(net) {
  const host = ls('fb.host'), player = ls('fb.player');
  app.innerHTML = `<div class="view" style="display:flex;flex-direction:column;gap:18px">
    <div class="topbar">${brandHTML()}${langToggle()}</div>
    ${net.mode === 'local' ? `<div class="banner">${net.fallback ? t('demoFallback') + ' ' : ''}${t('demoBanner')}</div>` : ''}
    <div class="hero"><button type="button" class="bigKnob" id="knob" aria-label="Buzz"></button><h1>First<span style="background:linear-gradient(90deg,#FF7A66,#FFD25A,#4FE0A0,#5AA9FF,#C38BFF);-webkit-background-clip:text;background-clip:text;color:transparent">buzz</span></h1><p>${t('tagline')}</p></div>
    <div class="resume">${host?.code ? `<a class="btn sm" href="#/host">${t('hostGame')} · ${host.code}</a>` : ''}${player?.code ? `<a class="btn sm" href="#/join/${player.code}">${t('joinGame')} · ${player.code}</a>` : ''}</div>
    <div class="choices">
      <a class="card choice" href="#/host" style="text-decoration:none;color:inherit"><span class="label">${t('hostSub')}</span><h2>${t('hostGame')} →</h2></a>
      <form class="card choice" id="jf" autocomplete="off"><span class="label">${t('joinSub')}</span><h2>${t('joinGame')}</h2>
        <input class="input codeInput" id="jc" maxlength="7" autocapitalize="characters" spellcheck="false" placeholder="ABC123" aria-label="Room code">
        <button class="btn primary" type="submit">${t('join')}</button></form>
    </div>
    <p class="note center" style="margin:0 auto">v${APP_VERSION}</p>
  </div>`;
  bindLang(app, () => landing(net));
  $('#knob', app).onclick = () => { unlockAudio(); audio.mode = 'funny'; import('./media.js').then(m => m.sfx('press', 392 + Math.random() * 300)); };
  $('#jc', app).oninput = e => e.target.value = e.target.value.toUpperCase();
  $('#jf', app).onsubmit = e => { e.preventDefault(); const c = $('#jc', app).value.replace(/[^a-z0-9]/gi, '').toUpperCase(); location.hash = '#/join/' + c; };
}

// ---------------------------------------------------------------- big screen
async function runScreen(app, net, code) {
  const R = p => `rooms/${code}/${p}`;
  const meta = await net.get(R('meta')).catch(() => null);
  if (!meta) { app.innerHTML = `<div class="hero"><h1>${t('noRoom')}</h1><a class="btn" href="#/">${t('backHome')}</a></div>`; return; }
  // A tap is needed before browsers allow sound and fullscreen.
  app.innerHTML = `<div class="startScreen"><button type="button" class="btn primary big" id="go">${t('startScreen')}</button></div>`;
  await new Promise(r => $('#go', app).onclick = r);
  unlockAudio(); keepAwake();
  try { await document.documentElement.requestFullscreen?.(); } catch (e) {}
  net.syncClock(`rooms/${code}`);
  let st = null, S = {}, players = {}, podEl = null;
  app.innerHTML = `<div class="screenWrap view"><div class="topbar">${brandHTML()}<div class="joinCorner" id="jc"></div></div><div id="stageMount"></div></div>`;
  const stage = createStage($('#stageMount', app), { mode: 'screen' });
  const jc = $('#jc', app);
  let lastJoin = '';
  function render() {
    if (!st) return;
    applyTheme(S); audio.mode = S.sound || 'classic';
    stage.update({ st, players, settings: S, net, code });
    const big = st.phase === 'lobby';
    const key = big ? 'big' : 'small';
    if (key !== lastJoin) {
      lastJoin = key;
      jc.innerHTML = big ? '' : `<span class="mono">${shortHost()}</span><div class="codeTiles" style="transform:scale(.6);transform-origin:right">${codeTiles(code)}</div>`;
    }
    const disp = $('.display', app);
    if (big && !disp.querySelector('.qrWrap')) {
      disp.innerHTML = `<div class="joinCorner"><div class="qrWrap" id="qr"></div><div class="field center"><span class="label">${t('orCode')}</span><div class="codeTiles">${codeTiles(code)}</div><span class="note">${t('atSite', { u: `<b>${shortHost()}</b>` })}</span>
        <div class="count" style="margin-top:10px">${Object.keys(players).length}<small> ${t('players').toLowerCase()}</small></div></div></div>`;
      drawQR($('#qr', app), joinUrl(code));
    } else if (big) { const c = disp.querySelector('.count'); if (c) c.innerHTML = `${Object.keys(players).length}<small> ${t('players').toLowerCase()}</small>`; }
    if (st.phase === 'podium' && podEl) { const h = podiumHTML(ranking(st, players, S), { seed: st.ev?.at }); if (podEl.dataset.h !== h) { podEl.dataset.h = h; podEl.firstChild.innerHTML = h; } }
    if (st.phase === 'podium' && !podEl) {
      podEl = document.createElement('div'); podEl.className = 'overlay';
      podEl.innerHTML = `<div class="podBox">${podiumHTML(ranking(st, players, S), { seed: st.ev?.at })}</div>`;
      document.body.appendChild(podEl); import('./media.js').then(m => m.sfx('podium')); setTimeout(() => rain(300), 700);
    } else if (st.phase !== 'podium' && podEl) { podEl.remove(); podEl = null; }
  }
  net.on(R('state'), v => { st = v; if (st) { st.queue = Array.isArray(st.queue) ? st.queue : Object.values(st.queue || {}); } render(); });
  net.on(R('settings'), v => { S = v || {}; render(); });
  net.on(R('players'), v => { players = v || {}; render(); });
  net.on(R('meta'), v => { if (v === null) { app.innerHTML = `<div class="hero"><h1>${t('roomEnded')}</h1></div>`; } });
}
