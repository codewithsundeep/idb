const filesToCache = [
    './icons/android-chrome-192x192.png',
    './icons/android-chrome-512x512.png',
    './icons/favicon.ico',
    './icons/apple-touch-icon.png',
    './index.html',
    './site.webmanifest',
    './crud.js',
    './serviceworker.js',
    './style.css'
]
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open("myfiles").then(cache => {
            cache.addAll(filesToCache);
        })
    )
})
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(res => {
            return res || e.request
        })
    )
})