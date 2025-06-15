// Keep all your imports and initializations the same
importScripts('https://brominecdn.netlify.app/uv/uv.bundle.js');
importScripts('uv.config.js');
importScripts(__uv$config.sw);
importScripts("/scram/scramjet.shared.js", "/scram/scramjet.worker.js");

if (navigator.userAgent.includes("Firefox")) {
    Object.defineProperty(globalThis, "crossOriginIsolated", {
        value: true,
        writable: true
    });
}

const uv = new UVServiceWorker();
const scramjet = new ScramjetServiceWorker();

const CONTENT_CACHE_NAME = 'MyFancyCacheName_v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
    // It's good practice to wrap waitUntil in a promise
    event.waitUntil(
        caches.open(CONTENT_CACHE_NAME).then(() => self.skipWaiting())
    );
});

// The corrected fetch listener
self.addEventListener('fetch', (event) => {
    // Pass a promise that resolves with the response to respondWith
    event.respondWith(
        (async () => {
            // Wait for the config to load before doing any routing
            await scramjet.loadConfig();

            // 1. Try Scramjet
            if (scramjet.route(event)) {
                // If scramjet handles it, return its response promise.
                // The async function will end here.
                return scramjet.fetch(event);
            }

            // 2. Try UV
            if (uv.route(event)) {
                // If UV handles it, return its response promise.
                // The async function will end here.
                return uv.fetch(event);
            }

            // 3. If neither handled it, use the Cache-First strategy
            const request = event.request;

            // IMPORTANT: Do not cache POST requests, range requests, or chrome-extension URLs.
            if (request.method !== 'GET' || request.url.startsWith('chrome-extension://')) {
                // Fall back to network and end the function.
                return fetch(request);
            }

            const cache = await caches.open(CONTENT_CACHE_NAME);
            const cachedResponse = await cache.match(request);

            if (cachedResponse) {
                console.debug(`[SW] Serving from cache: ${request.url}`);
                // Return the cached response and end the function.
                return cachedResponse;
            }

            // If not in cache, go to the network
            try {
                const networkResponse = await fetch(request);

                // Check if the response is valid to cache
                if (networkResponse.ok || network-response.type === 'opaque') {
                    console.debug(`[SW] Caching new response: ${request.url}`);
                    // IMPORTANT: You must clone the response to cache it
                    await cache.put(request, networkResponse.clone());
                } else {
                    console.warn(`[SW] Not caching non-ok response (${networkResponse.status}): ${request.url}`);
                }

                // Return the network response and end the function.
                return networkResponse;

            } catch (error) {
                console.error(`[SW] Fetch failed for ${request.url}:`, error);
                // Return a fallback error response.
                return new Response('Network error and no cache available.', {
                    status: 503,
                    headers: { 'Content-Type': 'text/plain' },
                });
            }
        })() // Immediately invoke the async function
    );
});
