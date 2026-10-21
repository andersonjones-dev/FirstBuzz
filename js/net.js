// Networking layer: one small API over either Firebase Realtime Database
// (real multi-phone games) or a local demo store (tabs on one device).
//   net.uid            this device's id
//   net.now()          server-synced clock in ms (same timeline on every phone)
//   net.on(path, cb)   subscribe to a value, returns unsubscribe
//   net.get/set/update/remove/txn/onDisconnect
import { FIREBASE_CONFIG } from './config.js';

const FB_VER = '10.12.2';
const clean = v => v === undefined ? null : JSON.parse(JSON.stringify(v));

function loadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load ' + src));
    document.head.appendChild(s);
  });
}

export async function initNet() {
  if (!FIREBASE_CONFIG) return localNet();
  try { return await firebaseNet(); }
  catch (e) { console.warn('Firebase unavailable, using demo mode', e); const n = localNet(); n.fallback = e.message; return n; }
}

async function firebaseNet() {
  const base = `https://www.gstatic.com/firebasejs/${FB_VER}/`;
  await loadScript(base + 'firebase-app-compat.js');
  await Promise.all([loadScript(base + 'firebase-auth-compat.js'), loadScript(base + 'firebase-database-compat.js')]);
  const fb = window.firebase;
  if (!fb.apps.length) fb.initializeApp(FIREBASE_CONFIG);
  const auth = fb.auth();
  if (!auth.currentUser) await auth.signInAnonymously();
  await new Promise(r => { const u = auth.onAuthStateChanged(x => { if (x) { u(); r(); } }); });
  const db = fb.database();
  let offset = 0, refined = false;
  db.ref('.info/serverTimeOffset').on('value', s => { if (!refined) offset = s.val() || 0; });
  let connected = true; const connCbs = new Set();
  db.ref('.info/connected').on('value', s => { connected = !!s.val(); connCbs.forEach(f => f(connected)); });

  return {
    mode: 'firebase',
    uid: auth.currentUser.uid,
    now: () => Date.now() + offset,
    on(path, cb) { const r = db.ref(path); const h = s => cb(s.val()); r.on('value', h); return () => r.off('value', h); },
    onChild(path, cb) { const r = db.ref(path); const h = s => cb(s.key, s.val()); r.on('child_added', h); return () => r.off('child_added', h); },
    get: path => db.ref(path).get().then(s => s.val()),
    set: (path, v) => db.ref(path).set(clean(v)),
    update: (path, obj) => db.ref(path).update(clean(obj)),
    remove: path => db.ref(path).remove(),
    async txn(path, fn) { const r = await db.ref(path).transaction(fn); return r.committed; },
    onDisconnect: (path, v) => db.ref(path).onDisconnect().set(v),
    serverStamp: () => fb.database.ServerValue.TIMESTAMP,
    onConnection(cb) { connCbs.add(cb); cb(connected); return () => connCbs.delete(cb); },
    // NTP-style refinement: write a server timestamp, time the round trip, keep the
    // sample with the shortest trip. Brings phones within a few ms of each other.
    async syncClock(roomPath) {
      const ref = db.ref(`${roomPath}/sync/${auth.currentUser.uid}`);
      let best = null;
      for (let i = 0; i < 6; i++) {
        const t0 = Date.now();
        try { await ref.set({ ts: fb.database.ServerValue.TIMESTAMP }); } catch (e) { break; }
        const t1 = Date.now();
        const ts = (await ref.get()).val()?.ts;
        if (!ts) continue;
        const rtt = t1 - t0, est = ts - (t0 + rtt / 2);
        if (!best || rtt < best.rtt) best = { rtt, est };
      }
      if (best) { offset = best.est; refined = true; }
      return best;
    }
  };
}

// ---------------------------------------------------------------------------
// Demo store: the whole database lives in localStorage and changes are broadcast
// to every tab of this browser. Each tab is its own "phone".
function localNet() {
  const KEY = 'fb.local.db';
  let uid;
  try { uid = sessionStorage.getItem('fb.local.uid'); } catch (e) {}
  if (!uid) { uid = 'u' + Math.random().toString(36).slice(2, 10); try { sessionStorage.setItem('fb.local.uid', uid); } catch (e) {} }
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  let tree = load();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(tree)); } catch (e) { console.warn('Demo storage full', e); } };
  const parts = p => p.split('/').filter(Boolean);
  const getAt = (t, p) => parts(p).reduce((o, k) => (o == null ? null : o[k] ?? null), t);
  function setAt(t, p, v) {
    const ks = parts(p); let o = t;
    for (let i = 0; i < ks.length - 1; i++) { if (typeof o[ks[i]] !== 'object' || o[ks[i]] === null) o[ks[i]] = {}; o = o[ks[i]]; }
    const last = ks[ks.length - 1];
    if (v === null || v === undefined) delete o[last]; else o[last] = clean(v);
  }
  const subs = new Set();
  let ch = null;
  try { ch = new BroadcastChannel('fb-local'); ch.onmessage = () => { tree = load(); notify(); }; } catch (e) {}
  addEventListener('storage', e => { if (e.key === KEY) { tree = load(); notify(); } });
  function notify() {
    subs.forEach(s => {
      const v = getAt(tree, s.path), j = JSON.stringify(v);
      if (s.kind === 'child') {
        if (v && typeof v === 'object') Object.keys(v).forEach(k => { if (!s.seen.has(k)) { s.seen.add(k); s.cb(k, clean(v[k])); } });
        if (!v) s.seen.clear();
      } else if (j !== s.last) { s.last = j; s.cb(clean(v)); }
    });
  }
  function commit() { save(); notify(); try { ch && ch.postMessage(1); } catch (e) {} }
  return {
    mode: 'local',
    uid,
    now: () => Date.now(),
    on(path, cb) { const s = { path, cb, last: undefined }; subs.add(s); setTimeout(() => { s.last = JSON.stringify(getAt(tree, path)); cb(clean(getAt(tree, path))); }); return () => subs.delete(s); },
    onChild(path, cb) { const s = { path, cb, kind: 'child', seen: new Set() }; subs.add(s); setTimeout(notify); return () => subs.delete(s); },
    get: async path => clean(getAt(load(), path)),
    async set(path, v) { tree = load(); setAt(tree, path, v); commit(); },
    async update(path, obj) { tree = load(); Object.entries(obj).forEach(([k, v]) => setAt(tree, path + '/' + k, v)); commit(); },
    async remove(path) { tree = load(); setAt(tree, path, null); commit(); },
    async txn(path, fn) { tree = load(); const v = fn(clean(getAt(tree, path))); if (v === undefined) return false; setAt(tree, path, v); commit(); return true; },
    onDisconnect() {},
    serverStamp: () => Date.now(),
    onConnection(cb) { cb(true); return () => {}; },
    async syncClock() { return { rtt: 0, est: 0 }; },
    resetDemo() { tree = {}; commit(); }
  };
}
