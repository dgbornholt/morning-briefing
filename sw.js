const CACHE = 'briefing-v1';
const ASSETS = ['/briefing.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
});

self.addEventListener('fetch', e => {
  // Never cache API calls
  const url = e.request.url;
  if (
    url.includes('api.anthropic.com') ||
    url.includes('alphavantage.co') ||
    url.includes('rss2json.com') ||
    url.includes('fonts.googleapis.com') ||
    url.includes('fonts.gstatic.com')
  ) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
