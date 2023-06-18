const cacheName = 'cache-v1';
const files = [
  'https://alex-berson.github.io/frudoku/',
  'index.html',
  'css/style.css',
  'js/frudoku.js',
  'images/kids/avocado.svg',
  'images/kids/banana.svg',
  'images/kids/blueberries.svg',
  'images/kids/cantaloupe.svg',
  'images/kids/cherries.svg',
  'images/kids/coconut.svg',
  'images/kids/grapes.svg',
  'images/kids/green-apple.svg',
  'images/kids/kiwi.svg',
  'images/kids/lemon.svg',
  'images/kids/mango.svg',
  'images/kids/peach.svg',
  'images/kids/pear.svg',
  'images/kids/pineapple.svg',
  'images/kids/red-apple.svg',
  'images/kids/strawberry.svg',
  'images/kids/tangerine.svg',
  'images/kids/watermelon.svg',
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