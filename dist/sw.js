var log = console.log.bind(console);
var err = console.error.bind(console);

var version = '1';
var cacheName = 'pwa-timer-v' + version;
var appShellFilesToCache = [
  './',
  'index.html',
  '//cdn.rawgit.com/necolas/normalize.css/master/normalize.css',
  '//cdn.rawgit.com/milligram/milligram/master/dist/milligram.min.css',
  'https://fonts.googleapis.com/css?family=Quicksand'
];

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
  log('[Service Worker]: Installed');

  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      log('[Service Worker]: Caching App Shell')
      return cache.addAll(appShellFilesToCache)
    })
  );

});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  log('[Service Worker]: Active');

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== cacheName) {
          log('[Service Worker]: Removing old cache', key)
          return caches.delete(key)
        }
      }))
    })
  );

});

self.addEventListener('fetch', (event) => {
  log('[Service Worker]: Fetch');

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        log('[Service Worker]: returning ' + event.request.url + ' from cache')
        return response
      } else {
        log('[Service Worker]: returning ' + event.request.url + ' from net')
        return fetch(event.request)
      }
    })
  );

});
