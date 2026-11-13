/* KI-Dorf: Service Worker. Hält die Dateien nach dem ersten Besuch vor, damit die Seite auch ohne Netz lädt.
   Läuft nur über HTTPS (zum Beispiel GitHub Pages). Beim Doppelklick auf index.html wird er nicht gebraucht.
   Bei jeder Änderung an den Dateien die Versionsnummer erhöhen. */
var VERSION = 'ki-dorf-3.0.0';
var FILES = ['./', 'index.html', 'css/app.css', 'vendor/three.kd.js', 'daten/quellen.js', 'daten/haeuser1.js', 'daten/haeuser2.js', 'daten/prompts.js',
  'js/kern.js', 'js/figuren.js', 'js/aufgaben.js', 'js/welt.js', 'js/app.js', 'schrift/fredoka-latin.woff2', 'schrift/nunito-latin.woff2'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) { return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) { return; }
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(function (hit) { return hit || fetch(e.request); }));
});
