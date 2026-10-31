const CACHE_NAME = 'dorganix-shell-v2';
const APP_SHELL = [
  './',
  './index.html',
  './app.js',
  './firebase-config.js',
  './style.css',
  './theme.css',
  './manifest.webmanifest',
  './assets/dorganix-school-seal.png',
  './assets/dorganix-icon-192.png',
  './assets/dorganix-icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(
      APP_SHELL.map(url => new Request(url, { cache: 'reload' }))
    ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith('dorganix-shell-') && key !== CACHE_NAME)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(new Request(event.request, { cache: 'no-cache' })).then(async response => {
      if (response.ok) {
        await caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
      }
      return response;
    }).catch(async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      if (event.request.mode === 'navigate') return caches.match('./index.html');
      return Response.error();
    })
  );
});
