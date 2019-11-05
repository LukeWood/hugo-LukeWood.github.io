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

this.addEventListener('fetch', event => {
  // request.mode = navigate isn't supported in all browsers
  // so include a check for Accept: text/html header.
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
          fetch(event.request).catch(error => {
              // Return the offline page
              return caches.match('/offline');
          })
    );
  }
});
