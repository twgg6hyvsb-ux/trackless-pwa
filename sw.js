// sw.js — simple cache-first service worker for the PWA
const CACHE = 'trackless-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json'
];

// install -> cache assets
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// activate -> cleanup
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// fetch -> serve cache first, then network
self.addEventListener('fetch', (evt) => {
  if (evt.request.method !== 'GET') return;
  evt.respondWith(
    caches.match(evt.request).then(resp => {
      if (resp) return resp;
      return fetch(evt.request).then(networkResp => {
        // optionally cache new requests for offline
        return caches.open(CACHE).then(cache => {
          // don't cache opaque requests from foreign origins
          try {
            if (networkResp && networkResp.status === 200 && networkResp.type === 'basic') {
              cache.put(evt.request, networkResp.clone());
            }
          } catch (e) {}
          return networkResp;
        });
      }).catch(() => caches.match('/index.html'));
    })
  );
});