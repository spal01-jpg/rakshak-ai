const CACHE_NAME = 'rakshak-ai-v3.0';
const STATIC_ASSETS = [
  './',
  'index.html',
  'css/styles.css',
  'js/app.js',
  'js/offline-adapter.js',
  'js/chatbot.js',
  'manifest.json',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/rakshak_ai_eagle_logo.jpg?v=eagle_final'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[Rakshak PWA] Cache addAll warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // NEVER intercept /api/ calls in Service Worker!
  // Let the browser/page handle them directly via offline-adapter or live backend
  if (url.pathname.includes('/api/')) {
    return;
  }

  // Stale-while-revalidate for static assets only
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
