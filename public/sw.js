const CACHE_NAME = 'sff-v1';
const PRECACHE_URLS = [
    '/',
    '/logo.svg',
    '/manifest.json',
];

// Install — precache shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
    );
    self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch — network first, fallback to cache, SPA fallback to /index.html
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip non-GET, non-http(s), and API/Supabase requests
    if (
        request.method !== 'GET' ||
        !request.url.startsWith('http') ||
        request.url.includes('supabase.co')
    ) return;

    event.respondWith(
        fetch(request)
            .then((response) => {
                // Cache successful responses
                if (response.ok && response.type === 'basic') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                }
                return response;
            })
            .catch(() =>
                caches.match(request).then((cached) => {
                    if (cached) return cached;
                    // SPA fallback — serve index.html for navigation requests
                    if (request.mode === 'navigate') {
                        return caches.match('/');
                    }
                    return new Response('Hors ligne', { status: 503 });
                })
            )
    );
});
