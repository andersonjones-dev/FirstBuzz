// Player phone: join a room, then become one big buzzer.
import { t, teamName } from './i18n.js';
import { MAX_PLAYERS } from './config.js';
import { audio, unlockAudio, sfx, buzzVibe, burst, keepAwake } from './media.js';
import { identity, embHTML, esc, svg, keyOf, entity, ranking, teamsOn, TEAM_COLORS } from './stage.js';
import { $, langToggle, bindLang, applyTheme, readPhoto, brandHTML } from './ui.js';

const ls = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }, del(k) { try { localStorage.removeItem(k); } catch (e) {} } };
const RC = 2 * Math.PI * 44;
const clean = c => (c || '').replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 6);

export async function runPlayer(app, net, codeFromUrl) {
  let code = clean(codeFromUrl), err = '';
  // Already a member of this room on this device? Go straight back in.
  if (code) {
    const me = await net.get(`rooms/${code}/players/${net.uid}`).catch(() => null);
    if (me) return playRoom(app, net, code);
    const meta = await net.get(`rooms/${code}/meta`).catch(() => null);
    if (meta) return nameStep(app, net, code);
    err = t('badCode');
  }
  codeStep();

  function codeStep() {
    app.innerHTML = `<div class="view pjoin">
      <div class="topbar">${brandHTML()}${langToggle()}</div>
      <h2>${t('joinTitle')}</h2><p class="note">${t('enterCode')}</p>
      <form id="f" class="field" autocomplete="off">
        <input class="input codeInput" id="code" maxlength="7" inputmode="text" autocapitalize="characters" spellcheck="false" placeholder="ABC123" aria-label="Room code" value="${esc(code)}">
        <div class="err" id="err">${esc(err)}</div>
        <button class="btn primary big" type="submit">${t('join')}</button>
      </form></div>`;
    bindLang(app, codeStep);
    const inp = $('#code', app); inp.focus();
    inp.oninput = () => { inp.value = inp.value.toUpperCase(); };
    $('#f', app).onsubmit = async e => {
      e.preventDefault(); unlockAudio();
      code = clean(inp.value);
      if (code.length < 6) { $('#err', app).textContent = t('needCode'); return; }
      const meta = await net.get(`rooms/${code}/meta`).catch(() => null);
      if (!meta) { $('#err', app).textContent = t('badCode'); return; }
      history.replaceState(null, '', '#/join/' + code);
      const me = await net.get(`rooms/${code}/players/${net.uid}`).catch(() => null);
      me ? playRoom(app, net, code) : nameStep(app, net, code);
    };
  }
}

function nameStep(app, net, code) {
  let photo = ls.get('fb.photo', null), name = ls.get('fb.name', ''), err = '';
  const draw = () => {
    app.innerHTML = `<div class="view pjoin">
      <div class="topbar">${brandHTML()}${langToggle()}</div>
      <span class="label">${t('roomLabel', { c: code })}</span>
      <h2>${t('nameTitle')}</h2>
      <form id="f" class="field" autocomplete="off">
        <input class="input" id="nm" maxlength="16" placeholder="${t('namePh')}" aria-label="${t('namePh')}" value="${esc(name)}" enterkeyhint="go">
        <div class="avatarPick"><span class="emb ${photo ? 'ph' : ''}" style="background:#5AA9FF">${photo ? `<img src="${esc(photo)}" alt="">` : svg('circle')}</span>
          <label class="btn sm" for="ph">${photo ? t('changePhoto') : t('addPhoto')}</label><input type="file" id="ph" accept="image/*" hidden></div>
        <div class="err">${esc(err)}</div>
        <button class="btn primary big" type="submit">${t('imIn')}</button>
      </form></div>`;
    bindLang(app, draw);
    const nm = $('#nm', app); nm.oninput = () => name = nm.value;
    $('#ph', app).onchange = async e => { const f = e.target.files[0]; if (!f) return; try { photo = await readPhoto(f); ls.set('fb.photo', photo); } catch (x) {} draw(); };
    $('#f', app).onsubmit = async e => {
      e.preventDefault(); unlockAudio();
      name = nm.value.trim().replace(/\s+/g, ' ');
      if (!name) { err = t('needName'); return draw(); }
      const players = await net.get(`rooms/${code}/players`) || {};
      if (Object.keys(players).length >= MAX_PLAYERS) { err = t('roomFull'); return draw(); }
      if (Object.entries(players).some(([id, p]) => id !== net.uid && p.name.toLowerCase() === name.toLowerCase())) { err = t('nameTaken'); return draw(); }
      let slot = 0; await net.txn(`rooms/${code}/seq`, c => { slot = c || 0; return slot + 1; });
      const idn = identity(slot);
      await net.set(`rooms/${code}/players/${net.uid}`, { name, slot, color: idn.color, shape: idn.shape, photo: photo || null, joinedAt: net.now(), online: true });
      ls.set('fb.name', name);
      playRoom(app, net, code, true);
    };
  };
  draw();
}

function playRoom(app, net, code, fresh) {
  const R = p => `rooms/${code}/${p}`;
  ls.set('fb.player', { code });
  let st = null, S = {}, players = {}, me = null, joined = false, gone = false;
  let pressedRound = -1, lockUntil = 0, flashUntil = 0, prev = {}, lastCount = null, showWelcome = !!fresh;
  net.set(R(`players/${net.uid}/online`), true); net.onDisconnect(R(`players/${net.uid}/online`), false);
  net.syncClock(`rooms/${code}`); keepAwake();

  app.innerHTML = `<div class="pv idle" id="pv">
    <div class="meBar"><div class="me" id="me"></div><div class="myScore" id="myScore"></div></div>
    <div class="pq" id="pq"></div>
    <button type="button" class="buzzer" id="buzz" aria-label="Buzz"></button>
    <div class="pmsg" id="pmsg" aria-live="polite"></div>
    <div class="cdOver" id="cd" hidden></div>
    <div class="wash" id="wash"></div>
    <div class="pbig" id="pbig"></div>
    <div id="welcome"></div>
  </div><div class="conn" id="conn" hidden>${t('reconnecting')}</div>`;
  const pv = $('#pv', app), buzz = $('#buzz', app), msg = $('#pmsg', app);
  buzz.addEventListener('pointerdown', e => { e.preventDefault(); press(); });
  buzz.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); press(); } });
  net.onConnection(ok => { $('#conn', app).hidden = ok; if (ok && joined) net.set(R(`players/${net.uid}/online`), true); });

  net.on(R(`players/${net.uid}`), v => {
    if (v) { me = v; joined = true; render(); return; }
    if (joined && !gone) { gone = true; ended(t('removed'), true); }
  });
  net.on(R('players'), v => { players = v || {}; render(); });
  net.on(R('settings'), v => { S = v || {}; audio.mode = S.sound || 'classic'; applyTheme(S); render(); });
  net.on(R('state'), v => { st = v; if (st && st.queue && !Array.isArray(st.queue)) st.queue = Object.values(st.queue); render(); });
  net.on(R('meta'), v => { if (v === null && joined && !gone) { gone = true; ls.del('fb.player'); ended(t('roomEnded'), false); } });

  function ended(text, canRejoin) {
    app.innerHTML = `<div class="view pjoin center" style="padding-top:20vh"><h2>${esc(text)}</h2>
      ${canRejoin ? `<a class="btn primary" href="#/join/${code}" onclick="setTimeout(()=>location.reload())">${t('rejoin')}</a>` : ''}
      <a class="btn" href="#/" onclick="setTimeout(()=>location.reload())">${t('backHome')}</a></div>`;
  }

  const myKey = () => keyOf(net.uid, players, S);
  function press() {
    unlockAudio();
    if (!st || !me) return;
    const now = net.now(), k = myKey(), phase = st.phase;
    if (Date.now() < lockUntil) return flash(t('locked'));
    if (phase === 'idle' || phase === 'countdown' || (phase === 'live' && now < (st.armAt || 0) - 30)) {
      if (S.early !== false && phase !== 'lobby') { lockUntil = Date.now() + 1500; net.set(R(`early/${net.uid}`), now); sfx('early'); buzzVibe([40, 40, 40]); return flash(t('tooEarly')); }
      return;
    }
    if (phase !== 'live' && phase !== 'won') return;
    if ((st.out || {})[k]) return flash(teamsOn(S) ? t('teamOut') : t('outQ'));
    if (pressedRound === st.round) return flash(t('alreadyBuzzed'));
    if (teamsOn(S) && (st.queue || []).some(e => e.k === k)) return flash(t('teammateFirst'));
    pressedRound = st.round;
    net.set(R(`buzzes/${st.round}/${net.uid}`), { t: now });
    sfx('press', identity(me.slot || 0).f); buzzVibe(35);
    buzz.classList.add('down'); setTimeout(() => buzz.classList.remove('down'), 140);
    msg.textContent = t('sent');
  }
  function flash(text) { flashUntil = Date.now() + 1500; pv.classList.remove('early'); void pv.offsetWidth; pv.classList.add('early'); msg.textContent = text; setTimeout(() => render(), 1600); }

  function render() {
    if (!me || !st) return;
    pv.style.setProperty('--c', me.color);
    const tm = teamsOn(S) && me.team != null;
    $('#me', app).innerHTML = `${embHTML(me)}<span>${esc(me.name)}</span>${tm ? `<span class="teamTag" style="background:${TEAM_COLORS[me.team]}">${esc(teamName(me.team))}</span>` : ''}`;
    const sc = (st.scores || {})[myKey()] || 0;
    $('#myScore', app).textContent = st.phase === 'lobby' ? '' : t('pts', { n: sc });
    buzz.innerHTML = svg(me.shape);

    // welcome / lobby card
    const w = $('#welcome', app);
    if (st.phase === 'lobby' || showWelcome) {
      w.innerHTML = `<div class="inRoom" style="--c:${me.color}">${embHTML(me)}<h2>${t('youreIn', { n: esc(me.name) })}</h2><p>${t('keepOpen')}</p>
        <span class="mono" style="color:#111">${t('roomLabel', { c: code })}</span>
        <div class="rowActions" style="justify-content:center">${langToggle()}<button type="button" class="btn sm" id="leave">${t('leave')}</button></div></div>`;
      bindLang(w, () => render());
      $('#leave', w).onclick = async () => { gone = true; await net.remove(R(`players/${net.uid}`)); ls.del('fb.player'); location.hash = '#/'; location.reload(); };
      if (st.phase !== 'lobby') setTimeout(() => { showWelcome = false; render(); }, 1800);
    } else w.innerHTML = '';

    const phase = st.phase, now = net.now(), k = myKey(), out = (st.out || {})[k];
    pv.classList.toggle('live', phase === 'live' && !out);
    pv.classList.toggle('idle', phase !== 'live' || !!out);

    // question
    const showQ = S.showQPhones !== false && st.q && ['idle', 'countdown', 'live', 'won'].includes(phase);
    $('#pq', app).innerHTML = showQ ? `<small>${t('qOf', { i: (st.qi ?? 0) + 1, n: st.qTotal || '?' })}</small>${esc(st.q.q)}` : '';

    // countdown overlay
    const cd = $('#cd', app);
    if (phase === 'countdown' && st.goAt > now) {
      const n = Math.max(1, Math.ceil((st.goAt - now) / 650));
      cd.hidden = false;
      if (lastCount !== n + ':' + st.round) { lastCount = n + ':' + st.round; cd.textContent = n; cd.classList.remove('pop'); void cd.offsetWidth; cd.classList.add('pop'); }
    } else cd.hidden = true;

    // status line
    if (Date.now() >= Math.max(lockUntil, flashUntil)) {
      msg.textContent = out ? (teamsOn(S) ? t('teamOut') : t('outQ'))
        : phase === 'idle' ? (st.showAnswer ? '' : t('waitHost'))
        : phase === 'countdown' ? t('getReady')
        : phase === 'live' ? (pressedRound === st.round ? t('sent') : t('go'))
        : phase === 'podium' ? '' : '';
    }

    // answer reveal (idle after correct / reveal)
    const pbig = $('#pbig', app), wash = $('#wash', app);
    const cur = phase === 'won' ? (st.queue || [])[st.pos || 0] : null;
    if (cur) {
      const e = entity(cur.k, players, S), mine = cur.p === net.uid, team = teamsOn(S) && cur.k === k && !mine;
      pv.classList.add('lit'); wash.style.setProperty('--w', e.color);
      if (mine) {
        const left = Math.max(0, (st.deadline || now) - now), frac = left / ((S.time || 10) * 1000);
        if (!pbig.querySelector('.ring')) pbig.innerHTML = `<div class="ring"><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="44"/><circle class="fg" cx="50" cy="50" r="44" stroke-dasharray="${RC}"/></svg><b></b></div><div class="nm"></div><div class="sub"></div>`;
        pbig.querySelector('.fg').style.strokeDashoffset = RC * (1 - frac);
        pbig.querySelector('.ring b').textContent = Math.ceil(left / 1000);
        pbig.querySelector('.nm').textContent = me.name;
        pbig.querySelector('.sub').textContent = teamsOn(S) ? t('answerTeam') : t('youreUp');
      } else {
        const qi = (st.queue || []).findIndex(q => q.p === net.uid);
        const sub = out ? (teamsOn(S) ? t('teamOut') : t('outQ')) : team ? t('teamAnswers', { n: players[cur.p]?.name || '' }) : qi > (st.pos || 0) ? t('inLine', { n: qi + 1, ms: Math.round(st.queue[qi].t - cur.t) }) : t('buzzedFirst', { n: players[cur.p]?.name || '' });
        pbig.innerHTML = `${embHTML(e, 'wemb')}<div class="nm">${esc(e.name)}</div><div class="sub">${esc(sub)}</div>`;
      }
    } else {
      pv.classList.remove('lit');
      if (phase === 'idle' && st.showAnswer && st.q) {
        pbig.innerHTML = '';
        msg.innerHTML = `<div class="pAnswer"><span class="label" style="color:#06281Acc">${t('answer')}</span><b>${esc(st.q.a)}</b>${st.q.ref ? `<span class="ref">${esc(st.q.ref)}</span>` : ''}</div>`;
      } else if (phase === 'podium') {
        const r = ranking(st, players, S), place = r.findIndex(e => e.key === k) + 1;
        pv.classList.add('lit'); wash.style.setProperty('--w', place === 1 ? '#FFD25A' : me.color);
        pbig.innerHTML = `${embHTML(teamsOn(S) ? entity(k, players, S) : me, 'wemb')}<div class="nm">#${place}</div><div class="sub">${t('place', { n: place })} · ${t('pts', { n: sc })}</div>`;
      } else pbig.innerHTML = '';
    }

    // one-shot effects
    if (cur && st.winAt !== prev.winAt) {
      if (cur.p === net.uid) { sfx('win', identity(me.slot || 0).f); buzzVibe([60, 40, 120]); }
      else buzzVibe(20);
    }
    if (st.ev && st.ev.at !== prev.evAt && st.ev.type === 'correct' && st.ev.k === k) { sfx('correct'); burst(pv, me.color, 120); }
    if (phase === 'live' && prev.phase !== 'live') { buzzVibe(15); }
    prev = { winAt: st.winAt, evAt: st.ev?.at, phase };
  }
  setInterval(() => { if (st && (st.phase === 'countdown' || st.phase === 'won')) render(); }, 100);
}
