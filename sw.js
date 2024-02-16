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
  ev.respondWith(cacheFirstAndSave(ev));
});

function cacheFirst(ev) {
  //try cache then fetch
  return caches.match(ev.request).then((cacheResponse) => {
    return cacheResponse || fetch(ev.request);
  });
}
function cacheFirstAndSave(ev) {
  //try cache then fetch
  return caches.match(ev.request).then((cacheResponse) => {
    return (
      cacheResponse ||
      fetch(ev.request)
        .then((fetchResp) => {
          if (fetchResp.status > 0 && !fetchResp.ok) throw new Error('bad response');
          //throw the error IF NOT opaque AND NOT in the 200-299 range
          //we will just return a 404 error... to keep it simple
          return caches
            .open(cacheName)
            .then((cache) => {
              return cache.put(ev.request, fetchResp.clone());
            })
            .then(() => {
              //finished putting the copy in the cache
              return fetchResp; //send the resp to the browser
            });
        })
        .catch((err) => {
          return response404();
        })
    );
  });
}
function response404() {
  //any generic 404 error that we want to generate
  return new Response(null, { status: 404 });
}
