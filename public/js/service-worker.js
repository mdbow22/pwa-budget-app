const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/styles.css',
    '/js/index.js',
    '/js/offline.js',
    '/js/service-worker.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
 ];

const CACHE_NAME = "static-cache-v3";
const DATA_CACHE_NAME = "data-cache-v1";



 //install service worker
self.addEventListener('install', (evt) => {
    //pre cache current transactions
    evt.waitUntil(caches.open(DATA_CACHE_NAME)
        .then(cache => cache.add('/api/transaction')));

    //pre cache static assets
    evt.waitUntil(caches.open(CACHE_NAME)
        .then(cache => cache.addAll(FILES_TO_CACHE))
        .catch(err => console.error(err)));

    //activate immediately once finished installing
    self.skipWaiting();
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener("activate", event => {
    const currentCaches = [CACHE_NAME, DATA_CACHE_NAME];
    event.waitUntil(
      caches
        .keys()
        .then(cacheNames => {
          // return array of cache names that are old to delete
          return cacheNames.filter(
            cacheName => !currentCaches.includes(cacheName)
          );
        })
        .then(cachesToDelete => {
          return Promise.all(
            cachesToDelete.map(cacheToDelete => {
              return caches.delete(cacheToDelete);
            })
          );
        })
        .then(() => self.clients.claim())
    );
  });

  self.addEventListener("fetch", event => {
    // non GET requests are not cached and requests to other origins are not cached
    if (
      event.request.method !== "GET" ||
      !event.request.url.startsWith(self.location.origin)
    ) {
      event.respondWith(fetch(event.request));
      return;
    }
  
    // handle runtime GET requests for data from /api routes
    if (event.request.url.includes("/api/transaction")) {
      // make network request and fallback to cache if network request fails (offline)
      event.respondWith(
        caches.open(RUNTIME_CACHE).then(cache => {
          return fetch(event.request)
            .then(response => {
              cache.put(event.request, response.clone());
              return response;
            })
            .catch(() => caches.match(event.request));
        })
      );
      return;
    }
  });