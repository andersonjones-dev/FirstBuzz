// Offline cache for the app shell. Live game data always goes to the network.
// Bump VERSION whenever you publish changes so phones pick up the new files.
const VERSION = 'firstbuzz-v1.0.1';
const SHELL = [
  './', 'index.html', 'css/app.css', 'manifest.webmanifest',
  'js/app.js', 'js/config.js', 'js/net.js', 'js/i18n.js', 'js/packs.js', 'js/media.js', 'js/stage.js', 'js/ui.js', 'js/host.js', 'js/player.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'
];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Never cache Firebase traffic.
  if (/firebaseio\.com|firebasedatabase\.app|googleapis\.com\/identitytoolkit|securetoken/.test(url.host + url.pathname)) return;
  const sameOrigin = url.origin === location.origin;
  const cdn = /fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com|gstatic\.com\/firebasejs/.test(url.host + url.pathname);
  if (!sameOrigin && !cdn) return;
  // Network first for our own files (so updates arrive), cache first for fonts and libraries.
  if (sameOrigin) {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
  } else {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const c = res.clone(); caches.open(VERSION).then(x => x.put(e.request, c)); return res; })));
  }
});
