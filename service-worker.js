const cacheName = 'cache-v1';
const files = [
  'https://alex-berson.github.io/frudoku/',
  'index.html',
  'css/style.css',
  'js/frudoku.js',
  'images/fruits/avocado.svg',
  'images/fruits/banana.svg',
  'images/fruits/blueberries.svg',
  'images/fruits/cherries.svg',
  'images/fruits/coconut.svg',
  'images/fruits/grapes.svg',
  'images/fruits/green-apple.svg',
  'images/fruits/kiwi.svg',
  'images/fruits/lemon.svg',
  'images/fruits/mango.svg',
  'images/fruits/melon.svg',
  'images/fruits/peach.svg',
  'images/fruits/pear.svg',
  'images/fruits/pineapple.svg',
  'images/fruits/red-apple.svg',
  'images/fruits/strawberry.svg',
  'images/fruits/tangerine.svg',
  'images/fruits/watermelon.svg',
  'fonts/roboto-regular-webfont.woff',
  'fonts/roboto-bold-webfont.woff'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
      cache.addAll(files);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== cacheName)
        .map(key => caches.delete(key))
      )
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});