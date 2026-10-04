// Gyan Sthali School ERP Service Worker (PWA Offline Shell)
const CACHE_NAME = 'gsps-erp-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/logo.svg',
  '/portal/timetable',
  '/portal/notices',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline shell');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Navigation & Assets: Network first, cache fallback
  if (event.request.mode === 'navigate' || event.request.destination === 'style' || event.request.destination === 'script') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((cached) => {
          return cached || caches.match('/');
        });
      })
    );
  }
});
