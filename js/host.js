// Host: set up a quiz, run the lobby, and referee the game.
// The host device is the single source of truth for game state. Phones only
// write their own buzz (with a server-synced press time); the host collects
// buzzes for a short window, orders them by press time and publishes the result.
import { t, getLang, teamName } from './i18n.js';
import { PACKS, findPack, loadCustomPacks, saveCustomPacks, parseCustom } from './packs.js';
import { MAX_PLAYERS } from './config.js';
import { audio, unlockAudio, keepAwake, sfx, rain } from './media.js';
import { createStage, identity, embHTML, esc, svg, ms, keyOf, entity, ranking, teamsOn, TEAM_COLORS } from './stage.js';
import { $, $$, joinUrl, screenUrl, shortHost, drawQR, codeTiles, langToggle, bindLang, applyTheme, podiumHTML, shareOrCopy, copyText, brandHTML } from './ui.js';

const ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const WINDOW = 300;            // ms to wait after the first buzz arrives for slower networks
const COUNT_MS = 1950;         // 3-2-1 countdown length
const DEFAULTS = { skin: 'studio', sound: 'classic', time: 10, teams: 0, quips: true, count: true, early: true, neg: false, showQScreen: true, showQPhones: true, points: 10, packId: 'bible-basics' };
const BOT_NAMES = ['Asha', 'Ravi', 'Joy', 'Neha', 'Sam', 'Tina', 'Arun', 'Lina', 'Mohan', 'Riya', 'Kevin', 'Zoe', 'Vinay', 'Anu', 'Ben', 'Isha', 'Raj', 'Maya', 'Dev', 'Ann', 'Kiran', 'Sona', 'Leo', 'Pooja', 'Max', 'Gita', 'Tom', 'Uma', 'Ved', 'Elsa'];
const ls = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }, del(k) { try { localStorage.removeItem(k); } catch (e) {} } };
const rnd = n => Math.floor(Math.random() * n);

export async function runHost(app, net) {
  let S = { ...DEFAULTS, ...ls.get('fb.hostSettings', {}) };
  applyTheme(S);
  const saved = ls.get('fb.host', null);
  if (saved?.code) {
    const meta = await net.get(`rooms/${saved.code}/meta`).catch(() => null);
    if (meta && meta.hostId === net.uid) return hostRoom(app, net, saved.code);
    ls.del('fb.host');
  }
  setup();

  // ---------------------------------------------------------------- setup
  function setup() {
    let packId = S.packId, showCustom = false;
    const draw = () => {
      const custom = loadCustomPacks();
      const packBtn = p => `<button type="button" class="pack" data-pack="${p.id}" aria-pressed="${packId === p.id}">
        <b>${esc(p.title)}</b><span class="note">${esc(p.blurb || '')}</span>
        <span class="meta"><span class="pill">${t('questionsN', { n: p.questions.length })}</span>${p.level ? `<span class="pill">${esc(p.level)}</span>` : ''}${p.lang === 'kn' ? '<span class="pill">ಕನ್ನಡ</span>' : ''}</span></button>`;
      app.innerHTML = `<div class="view" style="display:flex;flex-direction:column;gap:16px">
        <div class="topbar">${brandHTML()}<div class="nav">${langToggle()}</div></div>
        <section class="card">
          <h2 style="margin:0;font-family:var(--f-display);font-weight:var(--hlWeight);font-size:30px">${t('setupTitle')}</h2>
          <div class="field"><span class="label">${t('mood')}</span>
            <div class="seg"><button type="button" class="btn" data-mood="party">${t('party')}</button><button type="button" class="btn" data-mood="official">${t('official')}</button></div>
            <p class="note">${t('moodNote')}</p></div>
        </section>
        <section class="card">
          <span class="label">${t('choosePack')} · ${t('catBible')}</span>
          <div class="packGrid">${PACKS.filter(p => p.cat === 'bible').map(packBtn).join('')}</div>
          <span class="label">${t('catGK')}</span>
          <div class="packGrid">${PACKS.filter(p => p.cat === 'gk').map(packBtn).join('')}</div>
          <span class="label">${t('catCustom')}</span>
          <div class="packGrid">${custom.map(packBtn).join('')}
            <button type="button" class="pack" data-pack="free" aria-pressed="${packId === 'free'}"><b>${t('freePlay')}</b><span class="note">${t('freePlaySub')}</span></button>
            <button type="button" class="pack" id="newPack" aria-expanded="${showCustom}"><b>+ ${t('customPack')}</b><span class="note">${t('customHelp')}</span></button></div>
          <div id="customForm" ${showCustom ? '' : 'hidden'} class="field">
            <label class="label" for="cpName">${t('customName')}</label><input id="cpName" class="input" maxlength="40">
            <label class="label" for="cpText">${t('customHelp')}</label><textarea id="cpText" class="input" placeholder="Who built the ark? | Noah"></textarea>
            <div class="rowActions"><button type="button" class="btn" id="cpSave">${t('saveDeck')}</button>${packId.startsWith('c_') ? `<button type="button" class="btn ghost" id="cpDel">${t('deleteDeck')}</button>` : ''}</div>
          </div>
        </section>
        <div class="setupFoot">${net.mode === 'local' ? `<span class="note">${t('demoBanner')}</span>` : ''}<button type="button" class="btn primary big" id="create">${t('createRoom')}</button></div>
      </div>`;
      bindLang(app, draw);
      $$('[data-pack]', app).forEach(b => b.onclick = () => { packId = b.dataset.pack; draw(); });
      $('#newPack', app).onclick = () => { showCustom = !showCustom; draw(); if (showCustom) $('#cpName', app).focus(); };
      $$('[data-mood]', app).forEach(b => b.onclick = () => { Object.assign(S, moodPreset(b.dataset.mood)); applyTheme(S); ls.set('fb.hostSettings', S); unlockAudio(); audio.mode = S.sound; sfx('join'); });
      const save = $('#cpSave', app);
      if (save) save.onclick = () => {
        const qs = parseCustom($('#cpText', app).value); if (!qs.length) return;
        const list = loadCustomPacks(); const id = 'c_' + Date.now().toString(36);
        list.push({ id, cat: 'custom', lang: getLang(), title: $('#cpName', app).value.trim() || t('customPack'), questions: qs });
        saveCustomPacks(list); packId = id; showCustom = false; draw();
      };
      const del = $('#cpDel', app);
      if (del) del.onclick = () => { saveCustomPacks(loadCustomPacks().filter(p => p.id !== packId)); packId = 'free'; draw(); };
      $('#create', app).onclick = async () => { unlockAudio(); S.packId = packId; ls.set('fb.hostSettings', S); $('#create', app).disabled = true; const code = await createRoom(); hostRoom(app, net, code); };
    };
    draw();
  }

  async function createRoom() {
    for (let i = 0; i < 12; i++) {
      const code = Array.from({ length: 6 }, () => ALPHA[rnd(ALPHA.length)]).join('');
      const ok = await net.txn(`rooms/${code}/meta`, cur => cur ? undefined : { hostId: net.uid, createdAt: Date.now(), v: 1 });
      if (!ok) continue;
      const pack = findPack(S.packId);
      await net.set(`rooms/${code}/settings`, S);
      await net.set(`rooms/${code}/state`, { phase: 'lobby', round: 0, qi: -1, qTotal: pack ? pack.questions.length : 0, scores: {} });
      ls.set('fb.host', { code });
      if (pack && pack.cat === 'custom') ls.set('fb.hostDeck', pack);
      return code;
    }
    throw new Error('Could not create a room');
  }
}

export function moodPreset(m) {
  return m === 'official' ? { skin: 'broadcast', sound: 'classic', quips: false, neg: true } : { skin: 'toybox', sound: 'funny', quips: true, neg: false };
}

// ======================================================================= room
async function hostRoom(app, net, code) {
  const R = p => `rooms/${code}/${p}`;
  let S = { ...DEFAULTS, ...(await net.get(R('settings')) || {}) };
  let st = await net.get(R('state')) || { phase: 'lobby', round: 0, qi: -1, scores: {} };
  st.scores = st.scores || {}; st.out = st.out || {}; st.queue = Array.isArray(st.queue) ? st.queue : Object.values(st.queue || {}); st.pos = st.pos || 0;
  let players = {}, deck = loadDeck(), logLines = [], mode = '', stage = null, peekOpen = false, endArmed = false;
  let pending = [], arrivals = [], decideTO = null, timeoutTO = null, armTO = null, unsubBuzz = null, seenBuzz = new Set(), earlySeen = {}, botTimers = [];
  audio.mode = S.sound; audio.enabled = ls.get('fb.hostSound', true);
  applyTheme(S); keepAwake(); net.syncClock(`rooms/${code}`);

  function loadDeck() {
    const p = findPack(S.packId) || (ls.get('fb.hostDeck', null)?.id === S.packId ? ls.get('fb.hostDeck', null) : null);
    return p ? p.questions : [];
  }
  const push = () => net.set(R('state'), st);
  const saveSettings = () => { net.set(R('settings'), S); ls.set('fb.hostSettings', S); applyTheme(S); audio.mode = S.sound; };
  const nameOf = pid => players[pid]?.name || '?';
  const units = () => teamsOn(S) ? S.teams : Object.keys(players).length;
  const quip = (k, v = {}) => { st.quip = { k, i: rnd(12), v, at: net.now() }; };
  function log(s, cls = '') { logLines.unshift({ s, cls }); logLines = logLines.slice(0, 80); renderLog(); }

  // ---- subscriptions
  net.on(R('players'), v => {
    const before = Object.keys(players).length;
    players = v || {};
    if (Object.keys(players).length > before && mode) sfx('join');
    ensureTeams(); render();
  });
  net.on(R('early'), v => {
    if (!v) return;
    Object.entries(v).forEach(([pid, tm]) => {
      if (earlySeen[pid] === undefined) { earlySeen[pid] = tm; return; }
      if (tm > earlySeen[pid]) { earlySeen[pid] = tm; if (st.phase === 'idle' || st.phase === 'countdown') { quip('early', { n: nameOf(pid) }); log(t('earlyLog', { n: esc(nameOf(pid)) })); push(); } }
    });
  });
  net.on(R('meta'), v => { if (!v) { ls.del('fb.host'); location.hash = '#/'; location.reload(); } });
  if (st.round) subBuzz(st.round);

  function ensureTeams() {
    if (!teamsOn(S)) return;
    const counts = Array(S.teams).fill(0);
    Object.values(players).forEach(p => { if (p.team != null && p.team < S.teams) counts[p.team]++; });
    Object.entries(players).sort((a, b) => (a[1].joinedAt || 0) - (b[1].joinedAt || 0)).forEach(([pid, p]) => {
      if (p.team == null || p.team >= S.teams) { const tm = counts.indexOf(Math.min(...counts)); counts[tm]++; p.team = tm; net.set(R(`players/${pid}/team`), tm); }
    });
  }
  function reassignTeams() {
    Object.entries(players).sort((a, b) => (a[1].joinedAt || 0) - (b[1].joinedAt || 0)).forEach(([pid, p], i) => { const tm = teamsOn(S) ? i % S.teams : null; p.team = tm; net.set(R(`players/${pid}/team`), tm); });
  }

  // ---- buzz handling
  function subBuzz(round) {
    if (unsubBuzz) unsubBuzz();
    seenBuzz = new Set();
    unsubBuzz = net.onChild(R(`buzzes/${round}`), (pid, v) => { if (!seenBuzz.has(pid) && v) { seenBuzz.add(pid); onBuzz(pid, v.t, round); } });
  }
  function onBuzz(pid, tm, round) {
    if (round !== st.round || !players[pid]) return;
    if (st.phase !== 'live' && st.phase !== 'won') return;
    if (tm < (st.armAt || 0) - 30) return;               // pressed before buzzers opened
    const k = keyOf(pid, players, S);
    if (st.out[k]) return;
    arrivals.push(pid);
    if (st.phase === 'live') {
      const ex = pending.find(e => e.k === k);
      if (ex) { if (tm < ex.t) { ex.t = tm; ex.p = pid; } return; }
      pending.push({ p: pid, k, t: tm });
      if (!decideTO) decideTO = setTimeout(decide, WINDOW);
    } else {
      if (st.queue.some(e => e.k === k)) return;
      const head = st.queue.slice(0, st.pos + 1), rest = st.queue.slice(st.pos + 1).concat({ p: pid, k, t: tm }).sort((a, b) => a.t - b.t);
      st.queue = head.concat(rest); push(); render();
    }
  }
  function decide() {
    decideTO = null;
    if (st.phase !== 'live' || !pending.length) return;
    st.queue = pending.sort((a, b) => a.t - b.t); pending = [];
    st.pos = 0; st.phase = 'won'; st.winAt = net.now(); st.deadline = st.winAt + S.time * 1000;
    const w = st.queue[0], rt = w.t - st.armAt;
    st.corrected = arrivals[0] !== w.p;
    if (!st.best || rt < st.best.ms) st.best = { p: w.p, ms: Math.round(rt) };
    const gap = st.queue[1] ? st.queue[1].t - w.t : 999;
    gap < 25 ? quip('photo', { d: ms(gap) }) : quip('buzz', { n: nameOf(w.p) });
    log(t('winLog', { r: st.round, n: `<b>${esc(nameOf(w.p))}</b>`, ms: ms(rt) }) + (st.queue[1] ? ', ' + t('aheadLog', { ms: ms(gap), n: esc(nameOf(st.queue[1].p)) }) : ''));
    if (st.corrected) log('⚖ ' + t('fixLog', { a: esc(nameOf(arrivals[0])), b: esc(nameOf(w.p)) }), 'corr');
    armTimeout(); push(); render();
  }
  function armTimeout() {
    clearTimeout(timeoutTO);
    timeoutTO = setTimeout(() => { if (st.phase === 'won') { const c = st.queue[st.pos]; quip('timeout'); log(t('timeoutLog', { n: esc(nameOf(c?.p)) })); push(); } }, Math.max(0, st.deadline - net.now()));
  }

  // ---- host actions
  function openBuzzers() {
    unlockAudio();
    clearTimers();
    st.round = (st.round || 0) + 1; st.out = {}; st.queue = []; st.pos = 0; st.showAnswer = false; st.corrected = false;
    pending = []; arrivals = []; subBuzz(st.round);
    if (S.count) {
      st.phase = 'countdown'; st.goAt = net.now() + COUNT_MS; quip('open');
      armTO = setTimeout(arm, COUNT_MS);
    } else arm();
    push(); render();
  }
  function arm() {
    st.phase = 'live'; st.armAt = st.goAt && st.goAt <= net.now() + 50 ? st.goAt : net.now();
    log(t('openLog', { r: st.round })); scheduleBots(); push(); render();
  }
  function correct() {
    const w = st.queue[st.pos]; if (!w) return;
    st.scores[w.k] = (st.scores[w.k] || 0) + S.points;
    st.ev = { type: 'correct', k: w.k, p: w.p, at: net.now() };
    quip('correct', { n: nameOf(w.p) }); log(t('correctLog', { n: `<b>${esc(nameOf(w.p))}</b>`, p: S.points }));
    st.phase = 'idle'; st.showAnswer = !!st.q; st.out = {}; st.lastWinner = w.p; clearTimers(); push(); render();
  }
  function wrong() {
    const w = st.queue[st.pos]; if (!w) return;
    if (S.neg) st.scores[w.k] = (st.scores[w.k] || 0) - 5;
    st.out[w.k] = true; st.ev = { type: 'wrong', k: w.k, at: net.now() };
    quip('wrong'); log(t('wrongLog', { n: `<b>${esc(nameOf(w.p))}</b>` }) + (S.neg ? ' −5' : ''));
    st.pos++;
    while (st.queue[st.pos] && st.out[st.queue[st.pos].k]) st.pos++;
    const nx = st.queue[st.pos];
    if (nx) {
      st.winAt = net.now() + 50; st.deadline = st.winAt + S.time * 1000; quip('pass', { n: nameOf(nx.p) });
      log(t('passedLog', { n: `<b>${esc(nameOf(nx.p))}</b>` })); armTimeout();
    } else if (Object.keys(st.out).length < units()) {
      clearTimers(); st.round++; st.queue = []; st.pos = 0; pending = []; arrivals = []; subBuzz(st.round);
      st.phase = 'live'; st.armAt = net.now(); scheduleBots(); log(t('reopened'));
    } else {
      clearTimers(); st.phase = 'idle'; st.showAnswer = !!st.q; quip('nobody'); log(t('nobodyLog'));
    }
    push(); render();
  }
  function cancelRound() { clearTimers(); st.phase = 'idle'; st.queue = []; st.pos = 0; push(); render(); }
  function setQuestion(i) {
    clearTimers();
    st.qi = i; st.q = deck[i] ? { q: deck[i].q, a: deck[i].a, ref: deck[i].ref || null } : null; st.qTotal = deck.length;
    st.showAnswer = false; st.out = {}; st.queue = []; st.pos = 0; st.phase = 'idle'; peekOpen = false;
  }
  function nextQ() {
    if (deck.length && st.qi + 1 >= deck.length) { log(t('endOfDeck')); return finish(); }
    setQuestion(deck.length ? st.qi + 1 : -1); push(); render();
  }
  function toggleAnswer() { st.showAnswer = !st.showAnswer; if (st.showAnswer) st.ev = { type: 'reveal', at: net.now() }; push(); render(); }
  function startGame() {
    unlockAudio(); ensureTeams(); st.scores = {}; st.best = null; st.round = st.round || 0;
    setQuestion(deck.length ? 0 : -1); push(); render();
  }
  function finish() { clearTimers(); st.phase = 'podium'; st.ev = { type: 'podium', at: net.now() }; push(); render(); }
  function playAgain() { st.scores = {}; st.best = null; startGame(); }
  function backToLobby() { clearTimers(); st.phase = 'lobby'; push(); render(); }
  async function endRoom() { clearTimers(); ls.del('fb.host'); await net.remove(`rooms/${code}`); location.hash = '#/'; location.reload(); }
  function clearTimers() { clearTimeout(decideTO); decideTO = null; clearTimeout(timeoutTO); clearTimeout(armTO); botTimers.forEach(clearTimeout); botTimers = []; }

  // ---- demo players (bots) — handy for trying the app alone
  async function addBots(n) {
    const used = new Set(Object.values(players).map(p => p.name));
    for (let i = 0; i < n && Object.keys(players).length + i < MAX_PLAYERS; i++) {
      const name = BOT_NAMES.find(x => !used.has(x)) || 'Bot ' + rnd(99); used.add(name);
      let slot = 0; await net.txn(R('seq'), c => { slot = (c || 0); return slot + 1; });
      const id = 'bot_' + Math.random().toString(36).slice(2, 9), idn = identity(slot);
      await net.set(R(`players/${id}`), { name, slot, color: idn.color, shape: idn.shape, joinedAt: Date.now() + i, online: true, bot: true });
    }
  }
  function scheduleBots() {
    const round = st.round;
    Object.entries(players).filter(([, p]) => p.bot).forEach(([pid]) => {
      if (st.out[keyOf(pid, players, S)] || Math.random() < .15) return;
      const react = 180 + Math.random() * (Object.keys(players).length > 10 ? 650 : 380);
      botTimers.push(setTimeout(() => { if (st.round === round && (st.phase === 'live' || st.phase === 'won')) net.set(R(`buzzes/${round}/${pid}`), { t: st.armAt + react }); }, react + 30 + Math.random() * 160));
    });
  }

  // ================================================================ views
  function render() {
    applyTheme(S);
    const want = st.phase === 'lobby' ? 'lobby' : 'game';
    if (want !== mode) { mode = want; want === 'lobby' ? buildLobby() : buildGame(); }
    mode === 'lobby' ? renderLobby() : renderGame();
    renderPodium();
  }
  function topbar(extra = '') {
    return `<div class="topbar">${brandHTML()}<div class="nav">${extra}${langToggle()}<button type="button" class="btn sm" id="bSettings">${t('settings')}</button></div></div>
      ${net.mode === 'local' ? `<div class="banner">${net.fallback ? t('demoFallback') + ' ' : ''}${t('demoBanner')}</div>` : ''}`;
  }
  function bindTop() {
    bindLang(app, () => { mode = ''; render(); });
    $('#bSettings', app).onclick = openSettings;
  }
  function joinCard() {
    return `<span class="label">${t('scanToJoin')}</span><div class="qrWrap" id="qr"></div>
      <div class="or" style="width:100%">${t('orCode')}</div><div class="codeTiles">${codeTiles(code)}</div>
      <p class="note">${t('atSite', { u: `<b>${esc(shortHost())}</b>` })}</p>
      <div class="linkRow"><code id="jLink">${esc(joinUrl(code))}</code><button type="button" class="btn sm" id="bInvite">${t('copyInvite')}</button></div>
      <p class="note">${t('screenHint')}</p><div class="linkRow"><code id="sLink">${esc(screenUrl(code))}</code><a class="btn sm" href="${esc(screenUrl(code))}" target="_blank" rel="noopener">${t('screenView')}</a></div>`;
  }
  function bindJoinCard(root) {
    drawQR($('#qr', root), joinUrl(code));
    $('#bInvite', root).onclick = e => shareOrCopy(t('inviteText', { u: shortHost(), c: code, l: joinUrl(code) }), joinUrl(code), e.currentTarget, $('#jLink', root));
  }

  // ---- lobby
  function buildLobby() {
    app.innerHTML = `<div class="view" style="display:flex;flex-direction:column;gap:16px">${topbar()}
      <div class="lobby">
        <section class="card center">${joinCard()}</section>
        <section class="card">
          <div class="rowActions"><div><span class="label">${t('playersInRoom')}</span><div class="count"><span id="nCount">0</span><small> / ${MAX_PLAYERS}</small></div></div>
            <div class="push"><span class="pill" id="packPill"></span></div></div>
          <div class="meter"><span id="meter"></span></div>
          <div class="chips" id="chips"></div>
          <p class="note">${t('kickHint')}</p>
          <div class="rowActions"><button type="button" class="btn sm" id="bBots">${t('addBots')}</button>
            <button type="button" class="btn ghost sm" id="bEnd">${t('endGame')}</button>
            <button type="button" class="btn primary big push" id="bStart">${t('startGame')}</button></div>
        </section>
      </div></div>`;
    bindTop(); bindJoinCard(app);
    $('#bBots', app).onclick = () => addBots(5);
    $('#bStart', app).onclick = startGame;
    bindEnd($('#bEnd', app));
    $('#chips', app).onclick = e => { const k = e.target.closest('[data-kick]'); if (k) net.remove(R(`players/${k.dataset.kick}`)); };
  }
  const seenChips = new Set();
  function chipHTML(pid, p) {
    const seen = seenChips.has(pid); seenChips.add(pid);
    return `<div class="pchip ${seen ? 'seen' : ''} ${p.online === false ? 'off' : ''}" style="--c:${p.color}">${embHTML(p)}${esc(p.name)}
      ${teamsOn(S) && p.team != null ? `<span class="tm" style="background:${TEAM_COLORS[p.team]}">${esc(teamName(p.team))}</span>` : ''}${p.bot ? `<span class="pill">${t('demoPlayer')}</span>` : ''}
      <button type="button" class="x" data-kick="${pid}" aria-label="Remove ${esc(p.name)}">×</button></div>`;
  }
  const sortedPlayers = () => Object.entries(players).sort((a, b) => (a[1].joinedAt || 0) - (b[1].joinedAt || 0));
  function renderLobby() {
    const n = Object.keys(players).length;
    $('#nCount', app).textContent = n; $('#meter', app).style.width = (n / MAX_PLAYERS * 100) + '%';
    $('#chips', app).innerHTML = n ? sortedPlayers().map(([pid, p]) => chipHTML(pid, p)).join('') : `<div class="empty">${t('waitingPlayers')}</div>`;
    $('#bStart', app).disabled = n < 1; $('#bBots', app).disabled = n >= MAX_PLAYERS;
    const pk = findPack(S.packId); $('#packPill', app).textContent = `${t('pack')}: ${pk ? pk.title : t('freePlay')}`;
  }

  // ---- game
  function buildGame() {
    app.innerHTML = `<div class="view" style="display:flex;flex-direction:column;gap:14px">
      ${topbar(`<button type="button" class="btn sm" id="bRoom">${code}</button>`)}
      <div id="stageMount"></div>
      <section class="card"><div class="privateBar"><div class="peek" id="peek"></div><div class="rowActions" id="deckActions"></div></div></section>
      <div class="grid3">
        <section class="card"><span class="label">${t('queue')}</span><div id="queue" class="scroll"></div></section>
        <section class="card"><span class="label" id="scoreLabel"></span><div id="scores" class="scroll"></div></section>
        <section class="card"><span class="label">${t('players')} · <span id="pCount"></span></span><div id="plist" class="scroll"></div></section>
      </div>
      <section class="card"><span class="label">${t('log')}</span><div class="log" id="log"></div></section>
    </div>`;
    bindTop();
    stage = createStage($('#stageMount', app), { mode: 'host' });
    $('#bRoom', app).onclick = openJoinOverlay;
    renderLog();
  }
  function renderGame() {
    const ctx = { st, players, settings: S, net, code };
    stage.update(ctx);
    const A = stage.actionsEl, cur = st.queue[st.pos];
    if (st.phase === 'idle') A.innerHTML = `<button type="button" class="btn primary big" id="aOpen">${t('openBuzzers')}</button>`;
    else if (st.phase === 'countdown' || st.phase === 'live') A.innerHTML = `<button type="button" class="btn" id="aCancel">${t('cancel')}</button>`;
    else if (st.phase === 'won' && cur) A.innerHTML = `<button type="button" class="btn ok big" id="aOk">${t('correct', { p: S.points })}</button><button type="button" class="btn no big" id="aNo">${t('wrong')}</button><button type="button" class="btn" id="aCancel">${t('cancel')}</button>`;
    else A.innerHTML = '';
    const on = (id, f) => { const b = $('#' + id, app); if (b) b.onclick = f; };
    on('aOpen', openBuzzers); on('aCancel', cancelRound); on('aOk', correct); on('aNo', wrong);

    // private answer + deck controls
    const q = st.q;
    $('#peek', app).innerHTML = q ? (peekOpen ? `${t('answerIs', { a: `<b>${esc(q.a)}</b>` })}${q.ref ? ` <span class="mono">${esc(q.ref)}</span>` : ''}` : `<button type="button" class="btn sm" id="dPeek">${t('peek')}</button> <span class="mono">${t('qOf', { i: st.qi + 1, n: deck.length })}</span>`) : `<span class="mono">${t('freePlay')}</span>`;
    on('dPeek', () => { peekOpen = true; renderGame(); });
    $('#deckActions', app).innerHTML = `${q ? `<button type="button" class="btn sm" id="dReveal">${st.showAnswer ? t('hideAnswer') : t('reveal')}</button>` : ''}
      <button type="button" class="btn sm" id="dNext">${deck.length ? t('nextQ') : t('skip')}</button><button type="button" class="btn sm" id="dFinish">${t('finish')}</button>`;
    on('dReveal', toggleAnswer); on('dNext', nextQ); on('dFinish', finish);

    // queue
    $('#queue', app).innerHTML = st.queue.length ? st.queue.slice(0, 12).map((e, k) => {
      const p = players[e.p] || {}; return `<div class="row ${k === st.pos && st.phase === 'won' ? 'up' : ''} ${st.out[e.k] ? 'out' : ''}"><span class="pos">${k + 1}</span>
      <span class="sw ${p.photo ? 'ph' : ''}" style="background:${p.color}">${p.photo ? `<img src="${esc(p.photo)}" alt="">` : svg(p.shape)}</span>
      <span class="grow">${esc(p.name)}${teamsOn(S) ? ` <span class="mono">${esc(teamName(p.team ?? 0))}</span>` : ''}</span>
      <span class="mono">${k === 0 ? ms(e.t - st.armAt) : '+' + ms(e.t - st.queue[0].t)}</span></div>`;
    }).join('') + (st.queue.length > 12 ? `<div class="empty">${t('more', { n: st.queue.length - 12 })}</div>` : '')
      : `<div class="empty">${st.phase === 'live' ? t('waitBuzz') : t('emptyQueue')}</div>`;

    // scores
    $('#scoreLabel', app).textContent = teamsOn(S) ? t('teamScores') : t('scores');
    const r = ranking(st, players, S), top = Math.max(10, ...r.map(e => e.pts));
    $('#scores', app).innerHTML = r.map((e, k) => `<div class="row"><span class="sw ${e.photo ? 'ph' : ''}" style="background:${e.color}">${e.photo ? `<img src="${esc(e.photo)}" alt="">` : svg(e.shape)}</span>
      <div class="grow">${esc(e.name)}${k === 0 && e.pts > 0 ? '<span class="crown">★</span>' : ''}<div class="bar"><span style="width:${Math.max(0, e.pts) / top * 100}%;background:${e.color}"></span></div></div>
      <button type="button" class="mini" data-adj="${e.key}" data-d="-5" aria-label="${esc(e.name)} −5">−5</button><button type="button" class="mini" data-adj="${e.key}" data-d="5" aria-label="${esc(e.name)} +5">+5</button>
      <span class="score">${e.pts}</span></div>`).join('');
    $$('[data-adj]', app).forEach(b => b.onclick = () => { const k = b.dataset.adj, d = +b.dataset.d; st.scores[k] = (st.scores[k] || 0) + d; push(); render(); });

    // players
    const ps = sortedPlayers();
    $('#pCount', app).textContent = ps.length;
    $('#plist', app).innerHTML = ps.map(([pid, p]) => `<div class="row"><span class="onl ${p.online === false ? 'off' : ''}" title="${p.online === false ? t('offline') : t('online')}"></span>
      <span class="sw ${p.photo ? 'ph' : ''}" style="background:${p.color}">${p.photo ? `<img src="${esc(p.photo)}" alt="">` : svg(p.shape)}</span>
      <span class="grow">${esc(p.name)}${p.bot ? ` <span class="pill">${t('demoPlayer')}</span>` : ''}</span>
      <button type="button" class="mini" data-kick="${pid}" aria-label="Remove ${esc(p.name)}">×</button></div>`).join('');
    $$('#plist [data-kick]', app).forEach(b => b.onclick = () => net.remove(R(`players/${b.dataset.kick}`)));
  }
  function renderLog() {
    const el = $('#log', app); if (!el) return;
    el.innerHTML = logLines.map(l => `<div class="${l.cls}">${l.s}</div>`).join('') || `<div class="empty">—</div>`;
  }

  // ---- podium overlay
  let podEl = null;
  function renderPodium() {
    if (st.phase !== 'podium') { if (podEl) { podEl.remove(); podEl = null; } return; }
    if (podEl) { const box = $('.podBox', podEl), html = podiumHTML(ranking(st, players, S), { seed: st.ev?.at }); if (box.dataset.h !== html) { box.dataset.h = html; $('#podInner', podEl).innerHTML = html; } return; }
    podEl = document.createElement('div'); podEl.className = 'overlay';
    podEl.innerHTML = `<div class="podBox"><div id="podInner" style="display:contents">${podiumHTML(ranking(st, players, S), { seed: st.ev?.at })}</div>
      <div class="actions"><button type="button" class="btn primary" id="pAgain">${t('playAgain')}</button><button type="button" class="btn" id="pLobby">${t('backToLobby')}</button><button type="button" class="btn ghost" id="pEnd">${t('endGame')}</button></div></div>`;
    document.body.appendChild(podEl);
    sfx('podium'); setTimeout(() => rain(260), 700);
    $('#pAgain', podEl).onclick = playAgain; $('#pLobby', podEl).onclick = backToLobby; bindEnd($('#pEnd', podEl));
  }
  function bindEnd(btn) {
    btn.onclick = () => { if (!endArmed) { endArmed = true; btn.textContent = t('confirmEnd'); setTimeout(() => { endArmed = false; btn.textContent = t('endGame'); }, 3000); } else endRoom(); };
  }

  // ---- join overlay (QR during the game)
  function openJoinOverlay() {
    const o = document.createElement('div'); o.className = 'overlay';
    o.innerHTML = `<div class="card center" style="max-width:440px;width:100%">${joinCard()}<button type="button" class="btn" id="oClose">${t('done')}</button></div>`;
    document.body.appendChild(o); bindJoinCard(o);
    o.onclick = e => { if (e.target === o || e.target.id === 'oClose') o.remove(); };
  }

  // ---- settings sheet
  function openSettings() {
    const back = document.createElement('div'); back.className = 'sheetBack';
    const sh = document.createElement('aside'); sh.className = 'sheet'; sh.setAttribute('aria-label', t('settings'));
    const seg = (key, opts) => `<div class="seg">${opts.map(([v, l]) => typeof v === 'string' && v.startsWith('#') ? `<span class="segGroup">${l}</span>` : `<button type="button" class="btn" data-k="${key}" data-v="${v}" aria-pressed="${String(S[key]) === String(v)}">${l}</button>`).join('')}</div>`;
    const tog = (key, label) => `<label class="tog">${label}<input type="checkbox" data-t="${key}" ${S[key] ? 'checked' : ''}></label>`;
    const draw = () => {
      sh.innerHTML = `<div class="rowActions"><h2>${t('settings')}</h2><button type="button" class="btn sm push" id="sDone">${t('done')}</button></div>
        <div class="field"><span class="label">${t('mood')}</span><div class="seg"><button type="button" class="btn" data-mood="party">${t('party')}</button><button type="button" class="btn" data-mood="official">${t('official')}</button></div><p class="note">${t('moodNote')}</p></div>
        <div class="field"><span class="label">${t('theme')}</span>${seg('skin', [['#', t('fun')], ['toybox', 'Toybox'], ['retro', 'Retro Showtime'], ['neon', 'Neon Arcade'], ['church', 'Church Night'], ['#', t('officialG')], ['broadcast', 'Live Broadcast'], ['studio', 'Studio'], ['daylight', 'Daylight']])}</div>
        <div class="field"><span class="label">${t('sounds')}</span>${seg('sound', [['classic', t('sGame')], ['funny', t('sFunny')], ['off', t('sOff')]])}</div>
        <div class="field"><span class="label">${t('answerTime')}</span>${seg('time', [[5, '5 s'], [10, '10 s'], [15, '15 s'], [20, '20 s'], [30, '30 s']])}</div>
        <div class="field"><span class="label">${t('points')}</span>${seg('points', [[5, '5'], [10, '10'], [20, '20']])}</div>
        <div class="field"><span class="label">${t('playAs')}</span>${seg('teams', [[0, t('individuals')], [2, t('teamsN', { n: 2 })], [3, t('teamsN', { n: 3 })], [4, t('teamsN', { n: 4 })]])}<p class="note">${t('teamNote')}</p></div>
        ${tog('quips', t('quipsT'))}${tog('count', t('countT'))}${tog('early', t('earlyT'))}${tog('neg', t('negT'))}${tog('showQScreen', t('showQScreen'))}${tog('showQPhones', t('showQPhones'))}
        <label class="tog">${t('soundHere')}<input type="checkbox" id="sHere" ${audio.enabled ? 'checked' : ''}></label>
        <div class="field"><span class="label">${t('language')}</span>${langToggle()}</div>`;
      $$('[data-k]', sh).forEach(b => b.onclick = () => {
        const k = b.dataset.k, v = ['time', 'teams', 'points'].includes(k) ? +b.dataset.v : b.dataset.v;
        S[k] = v; saveSettings(); if (k === 'teams') reassignTeams(); if (k === 'sound') { unlockAudio(); sfx('join'); }
        draw(); render();
      });
      $$('[data-mood]', sh).forEach(b => b.onclick = () => { Object.assign(S, moodPreset(b.dataset.mood)); saveSettings(); unlockAudio(); sfx('join'); draw(); render(); });
      $$('[data-t]', sh).forEach(i => i.onchange = () => { S[i.dataset.t] = i.checked; saveSettings(); render(); });
      $('#sHere', sh).onchange = e => { audio.enabled = e.target.checked; ls.set('fb.hostSound', audio.enabled); };
      bindLang(sh, () => { draw(); mode = ''; render(); });
      $('#sDone', sh).onclick = close;
    };
    const close = () => { back.remove(); sh.remove(); };
    back.onclick = close;
    document.body.append(back, sh); draw();
  }

  render();
}
