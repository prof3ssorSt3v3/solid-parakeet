const version = 1;
const cacheName = `YourNameHere-${version}`;
const staticFiles = [];

self.addEventListener('install', (ev) => {
    //if you have an array of files then addAll() here
    ev.waitUntil(
      caches.open(cacheName).then((cache) => {
        cache.addAll(staticFiles);
      })
    );
});
self.addEventListener('activate', (ev) => {
  //delete old version
  ev.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    })
  );
});
self.addEventListener('fetch', (ev) => {
  //try the cache first, then fetch and save copy in cache
});

function cacheFirst(ev) {
  //try cache then fetch
  return caches.match(ev.request).then((cacheResponse) => {
    return cacheResponse || fetch(ev.request);
  });
}
function cacheFirstAndSave(ev) {
  //try cache then fetch
}
function response404() {
  //any generic 404 error that we want to generate
  return new Response(null, { status: 404 });
}
