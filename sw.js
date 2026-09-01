const CACHE = 'veil-of-lies-v15';
const CORE = [
  './index.html',
  './css/style.css',
  './js/engine.js',
  './js/audio.js',
  './js/features.js',
  './js/rumors.js',
  './js/combat-feel.js',
  './js/skills.js',
  './js/bounties.js',
  './js/craft.js',
  './js/daynight.js',
  './js/tutorial.js',
  './js/data.js',
  './js/sprites.js',
  './js/renderer3d.js',
  './js/three.min.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  if (e.request.mode === 'navigate') {
    e.respondWith(caches.match('./index.html').then((hit) => hit || fetch(e.request)));
    return;
  }

  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      });
    })
  );
});