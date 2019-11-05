'use strict';
const offlineUrl = "/offline";

const cacheVersion = 1;
const currentCache = {
  offline: 'offline-cache' + cacheVersion
}

this.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache.offline).then(cache => {
      return cache.addAll(['/offline'])
    })
  )
})

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate' || (event.request.method === 'GET') && (event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request).catch(error => {
        return caches.match("/offline");
      })
    );
  }
});
