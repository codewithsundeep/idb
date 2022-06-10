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
        (
            async() => {
                const cache = await caches.open("contact");
                await cache.addAll(filesToCache)
                console.log("contents has been cached");
            }
        )()
    )
})

self.addEventListener('fetch', (e) => {
    e.respondWith(
        (
            async() => {
                const res = await caches.match(e.request)
                if (res) { return res }
                const response = await fetch(e.request);
                const cache = await caches.open("contact");
                await cache.put(e.request, response.clone())
                return response;
            }
        )()
    )
})
