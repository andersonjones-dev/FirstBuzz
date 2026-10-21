// Small shared UI pieces: join links, QR codes, podium, language toggle, theme.
import { PUBLIC_URL } from './config.js';
import { t, getLang, setLang, quipText } from './i18n.js';
import { esc, svg } from './stage.js';

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];

export function baseUrl() {
  if (PUBLIC_URL) return PUBLIC_URL.endsWith('/') ? PUBLIC_URL : PUBLIC_URL + '/';
  return location.origin + location.pathname.replace(/index\.html$/, '');
}
export const joinUrl = code => `${baseUrl()}#/join/${code}`;
export const screenUrl = code => `${baseUrl()}#/screen/${code}`;
export const shortHost = () => baseUrl().replace(/^https?:\/\//, '').replace(/\/$/, '');

export function drawQR(el, text) {
  el.innerHTML = '';
  try { new window.QRCode(el, { text, width: 256, height: 256, colorDark: '#0D1020', colorLight: '#ffffff', correctLevel: window.QRCode.CorrectLevel.M }); }
  catch (e) { el.innerHTML = `<span class="mono" style="color:#333;padding:8px;text-align:center;word-break:break-all">${esc(text)}</span>`; }
}
export const codeTiles = code => code.split('').map((c, k) => `<span style="animation-delay:${k * .07}s">${c}</span>`).join('');

export function langToggle() {
  const l = getLang();
  return `<div class="langToggle" role="group" aria-label="${t('language')}"><button type="button" data-lang="en" aria-pressed="${l === 'en'}">EN</button><button type="button" data-lang="kn" aria-pressed="${l === 'kn'}">ಕನ್ನಡ</button></div>`;
}
export function bindLang(root, onChange) {
  $$('[data-lang]', root).forEach(b => b.onclick = () => { setLang(b.dataset.lang); onChange && onChange(); });
}

export function applyTheme(settings) {
  const skin = settings?.skin || 'studio';
  if (document.documentElement.dataset.skin !== skin) document.documentElement.dataset.skin = skin;
}

export function podiumHTML(rank, { title = true, seed = 0 } = {}) {
  const r = rank.slice(0, 3);
  if (!r.length) return '';
  const head = title ? quipText('champ', Math.floor(seed / 7) % 3, { n: r[0].name }) : '';
  const slots = [[r[1], 2, 105, .3], [r[0], 1, 150, .6], [r[2], 3, 75, 0]];
  return `<div class="label">${t('finalResults')}</div><h2>${esc(head)}</h2><div class="pods">${slots.map(([e, place, h, dl]) => e ? `<div class="pod">
    <span class="emb ${e.photo ? 'ph' : ''}" style="background:${e.color};animation-delay:${dl + .5}s">${e.photo ? `<img src="${esc(e.photo)}" alt="">` : svg(e.shape)}</span>
    <div class="nm">${esc(e.name)}</div><div class="mono">${t('pts', { n: e.pts })}</div>
    <div class="blk" style="height:${h}px;background:${e.color};animation-delay:${dl}s">${place}</div></div>` : '<div></div>').join('')}</div>`;
}

export async function copyText(text, btn, fallbackEl) {
  const old = btn.textContent;
  try { await navigator.clipboard.writeText(text); btn.textContent = t('copied'); }
  catch (e) {
    if (fallbackEl) { const r = document.createRange(); r.selectNodeContents(fallbackEl); getSelection().removeAllRanges(); getSelection().addRange(r); }
    btn.textContent = t('selected');
  }
  setTimeout(() => btn.textContent = old, 1800);
}

export async function shareOrCopy(text, url, btn, fallbackEl) {
  if (navigator.share) { try { await navigator.share({ text, url }); return; } catch (e) { if (e.name === 'AbortError') return; } }
  copyText(text, btn, fallbackEl);
}

// Resize a chosen photo to a small square JPEG so it syncs quickly.
export function readPhoto(file, size = 128) {
  return new Promise((res, rej) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = c.height = size;
      const s = Math.min(img.width, img.height), x = (img.width - s) / 2, y = (img.height - s) / 2;
      c.getContext('2d').drawImage(img, x, y, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', .72));
    };
    img.onerror = rej; img.src = url;
  });
}

export const brandHTML = () => `<a class="brand" href="#/" aria-label="Firstbuzz home"><span class="knob"></span><span>First<em>buzz</em></span></a>`;
