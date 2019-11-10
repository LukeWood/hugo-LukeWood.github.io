'use strict';
const offlineUrl = "/offline";

const cacheVersion = 1;
const currentCache = {
  offline: 'offline-cache' + cacheVersion
}
const toCache = ['/'];

this.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache.offline).then(cache => {
      console.info("[Service Worker] precaching pages", toCache)
    })
  )
})

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate' || (event.request.method === 'GET') && (event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request).catch(error => {
        console.log("[Service Worker] request failed, looking in caches for", event.request)
        return caches.match(event.request);
      })
    );
  }
});

// WORKBOX
